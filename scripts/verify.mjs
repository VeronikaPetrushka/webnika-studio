/* ------------------------------------------------------------------
   npm run verify
   ------------------------------------------------------------------
   A pre-build sanity pass that does not need a bundler:

   1. JS syntax     — every plain .js file through node --check
   2. JSX structure — tags balanced, brackets balanced, every embedded
                      {expression} parsed on its own
   3. JS around JSX — every .jsx file with its JSX blanked to `null`
                      and then run through node --check
   4. i18n parity   — en / uk / pl must share an identical key shape
   5. CSS coverage  — every className used in the app exists in CSS
   6. Icons         — every lucide import is real and is used
   7. Anchors       — every chapter id exists as a section id

   Run it before `npm run build`; it fails loudly and fast.
------------------------------------------------------------------- */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const SRC = join(ROOT, "src");

let failures = 0;
let checks = 0;

const ok = (msg) => { checks += 1; console.log(`  \u001b[32m\u2713\u001b[0m ${msg}`); };
const bad = (msg) => { failures += 1; console.log(`  \u001b[31m\u2717\u001b[0m ${msg}`); };
const head = (msg) => console.log(`\n\u001b[1m${msg}\u001b[0m`);

function walk(dir, out = []) {
  readdirSync(dir).forEach((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  });
  return out;
}

const files = walk(SRC);
const jsFiles = files.filter((f) => f.endsWith(".js"));
const jsxFiles = files.filter((f) => f.endsWith(".jsx"));
const cssFiles = files.filter((f) => f.endsWith(".css"));
const rel = (f) => relative(ROOT, f);

const TMP = mkdtempSync(join(tmpdir(), "webnika-verify-"));

function nodeCheck(code, label) {
  const path = join(TMP, `check-${Math.random().toString(36).slice(2)}.mjs`);
  writeFileSync(path, code);
  try {
    execFileSync(process.execPath, ["--check", path], { stdio: "pipe" });
    return null;
  } catch (error) {
    const text = String(error.stderr || error.message);
    const line = text.split("\n").filter(Boolean).slice(0, 4).join(" | ");
    return `${label}: ${line}`;
  }
}

/* ==================================================================
   Tokeniser — locates strings, templates, comments and regex literals
   so that every later pass can ignore their contents.
   ================================================================== */

function scanSpans(src) {
  const spans = [];
  let i = 0;
  let prev = "";

  const pushSpan = (start, end, type) => spans.push({ start, end, type });

  while (i < src.length) {
    const c = src[i];
    const next = src[i + 1];

    if (c === "/" && next === "/") {
      const end = src.indexOf("\n", i);
      const stop = end === -1 ? src.length : end;
      pushSpan(i, stop, "comment");
      i = stop;
      continue;
    }

    if (c === "/" && next === "*") {
      const end = src.indexOf("*/", i + 2);
      const stop = end === -1 ? src.length : end + 2;
      pushSpan(i, stop, "comment");
      i = stop;
      continue;
    }

    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < src.length) {
        if (src[j] === "\\") { j += 2; continue; }
        if (src[j] === c) break;
        j += 1;
      }
      pushSpan(i, j + 1, "string");
      i = j + 1;
      prev = "str";
      continue;
    }

    if (c === "`") {
      let j = i + 1;
      let depth = 0;
      while (j < src.length) {
        if (src[j] === "\\") { j += 2; continue; }
        if (src[j] === "$" && src[j + 1] === "{") { depth += 1; j += 2; continue; }
        if (depth > 0 && src[j] === "}") { depth -= 1; j += 1; continue; }
        if (depth === 0 && src[j] === "`") break;
        j += 1;
      }
      pushSpan(i, j + 1, "template");
      i = j + 1;
      prev = "str";
      continue;
    }

    /* regex literal vs division vs JSX self-close.
       "/>" is always a JSX tag terminator, never a regex; and a "/"
       after "}" is virtually always JSX too (attr expression + close). */
    if (c === "/" && next !== ">") {
      const before = src.slice(0, i).replace(/\s+$/, "");
      const last = before[before.length - 1] || "";
      const divisionAfter = /[A-Za-z0-9_$)\]}]/.test(last);
      if (!divisionAfter) {
        let j = i + 1;
        let inClass = false;
        let closed = false;
        while (j < src.length) {
          const d = src[j];
          if (d === "\\") { j += 2; continue; }
          if (d === "\n") break;
          if (d === "[") inClass = true;
          else if (d === "]") inClass = false;
          else if (d === "/" && !inClass) { closed = true; break; }
          j += 1;
        }
        if (closed) {
          let k = j + 1;
          while (k < src.length && /[a-z]/.test(src[k])) k += 1;
          pushSpan(i, k, "regex");
          i = k;
          continue;
        }
      }
    }

    if (!/\s/.test(c)) prev = c;
    i += 1;
  }

  return spans;
}

function maskSpans(src, spans) {
  const chars = src.split("");
  spans.forEach(({ start, end }) => {
    for (let i = start; i < end && i < chars.length; i += 1) {
      if (chars[i] !== "\n") chars[i] = " ";
    }
  });
  return chars.join("");
}

/* ==================================================================
   JSX scanner
   ================================================================== */

function inSpan(spans, index) {
  return spans.some((s) => index >= s.start && index < s.end);
}

function scanJsx(src) {
  const spans = scanSpans(src);
  const elements = [];
  const expressions = [];
  const problems = [];

  function skipBraced(start) {
    /* start points at "{" — returns index just past the matching "}" */
    let depth = 0;
    let i = start;
    const local = scanSpans(src.slice(start));
    const shifted = local.map((s) => ({ start: s.start + start, end: s.end + start, type: s.type }));
    while (i < src.length) {
      if (inSpan(shifted, i)) { i += 1; continue; }
      if (src[i] === "{") depth += 1;
      else if (src[i] === "}") {
        depth -= 1;
        if (depth === 0) return i + 1;
      }
      i += 1;
    }
    return -1;
  }

  function scanElement(open) {
    /* src[open] === "<" */
    let i = open + 1;
    let name = "";
    while (i < src.length && /[A-Za-z0-9_$.:-]/.test(src[i])) { name += src[i]; i += 1; }

    /* attributes */
    while (i < src.length) {
      const c = src[i];
      if (c === "{") {
        const start = i;
        const end = skipBraced(i);
        if (end === -1) { problems.push(`unclosed { in <${name || "fragment"}> attributes`); return -1; }
        expressions.push({ start: start + 1, end: end - 1, context: `attr of <${name || ">"}>` });
        i = end;
        continue;
      }
      if (c === '"' || c === "'") {
        let j = i + 1;
        while (j < src.length && src[j] !== c) j += 1;
        i = j + 1;
        continue;
      }
      if (c === "/" && src[i + 1] === ">") return i + 2;
      if (c === ">") { i += 1; break; }
      i += 1;
    }

    /* children */
    while (i < src.length) {
      const c = src[i];
      if (c === "{") {
        const start = i;
        const end = skipBraced(i);
        if (end === -1) { problems.push(`unclosed { inside <${name || "fragment"}>`); return -1; }
        expressions.push({ start: start + 1, end: end - 1, context: `child of <${name || ">"}>` });
        i = end;
        continue;
      }
      if (c === "<" && src[i + 1] === "/") {
        let j = i + 2;
        let close = "";
        while (j < src.length && /[A-Za-z0-9_$.:-]/.test(src[j])) { close += src[j]; j += 1; }
        while (j < src.length && src[j] !== ">") j += 1;
        if (close !== name) {
          problems.push(`<${name || "fragment"}> closed by </${close}>`);
          return -1;
        }
        return j + 1;
      }
      if (c === "<" && (/[A-Za-z]/.test(src[i + 1] || "") || src[i + 1] === ">")) {
        const end = scanElement(i);
        if (end === -1) return -1;
        i = end;
        continue;
      }
      i += 1;
    }

    problems.push(`<${name || "fragment"}> is never closed`);
    return -1;
  }

  let i = 0;
  while (i < src.length) {
    if (inSpan(spans, i)) { i += 1; continue; }
    if (src[i] === "<" && (/[A-Z]/.test(src[i + 1] || "") || src[i + 1] === ">" || /[a-z]/.test(src[i + 1] || ""))) {
      /* only treat as JSX when it follows something that can precede an
         expression: ( , = : ? && || return { [ ; or start of file */
      const before = src.slice(0, i).replace(/\s+$/, "");
      const last = before[before.length - 1] || "";
      const opener = /[([{=,:;?&|>]|^$/.test(last) || /\breturn$/.test(before) || /\b(?:&&|\|\|)$/.test(before);
      if (opener) {
        const end = scanElement(i);
        if (end === -1) break;
        elements.push({ start: i, end });
        i = end;
        continue;
      }
    }
    i += 1;
  }

  return { elements, expressions, problems, spans };
}

/* ==================================================================
   1 + 2 + 3 — syntax
   ================================================================== */

head("Syntax");

jsFiles.forEach((file) => {
  const error = nodeCheck(readFileSync(file, "utf8"), rel(file));
  if (error) bad(error);
  else ok(`${rel(file)} parses`);
});

jsxFiles.forEach((file) => {
  const src = readFileSync(file, "utf8");
  const { elements, expressions, problems } = scanJsx(src);

  if (problems.length) {
    problems.forEach((p) => bad(`${rel(file)} — ${p}`));
    return;
  }

  /* brackets outside strings/comments/regex/JSX text */
  const masked = maskSpans(src, scanSpans(src));
  let stripped = masked;
  elements.slice().reverse().forEach(({ start, end }) => {
    const inner = stripped.slice(start, end).replace(/[^\n]/g, " ");
    stripped = stripped.slice(0, start) + inner + stripped.slice(end);
  });

  const pairs = { ")": "(", "]": "[", "}": "{" };
  const stack = [];
  let imbalance = null;
  for (let i = 0; i < stripped.length; i += 1) {
    const c = stripped[i];
    if (c === "(" || c === "[" || c === "{") stack.push(c);
    else if (pairs[c]) {
      if (stack.pop() !== pairs[c]) { imbalance = `unbalanced "${c}" at offset ${i}`; break; }
    }
  }
  if (!imbalance && stack.length) imbalance = `${stack.length} unclosed "${stack[stack.length - 1]}"`;

  if (imbalance) { bad(`${rel(file)} — ${imbalance}`); return; }

  /* the JavaScript around the JSX */
  let blanked = src;
  elements.slice().reverse().forEach(({ start, end }) => {
    const body = src.slice(start, end);
    const newlines = (body.match(/\n/g) || []).join("");
    blanked = `${blanked.slice(0, start)}null${newlines}${blanked.slice(end)}`;
  });
  const outer = nodeCheck(blanked, `${rel(file)} (JSX blanked)`);
  if (outer) { bad(outer); return; }

  /* every embedded expression, on its own */
  let exprFail = 0;
  expressions.forEach((expr) => {
    const body = src.slice(expr.start, expr.end);
    const trimmed = body.trim();
    if (!trimmed) return;
    if (/^\/[/*]/.test(trimmed)) return;
    const { elements: inner } = scanJsx(body);
    let candidate = body;
    inner.slice().reverse().forEach(({ start, end }) => {
      candidate = `${candidate.slice(0, start)}null${candidate.slice(end)}`;
    });
    const wrapped = trimmed.startsWith("...") ? `({ ${candidate} })` : `(${candidate})`;
    const error = nodeCheck(wrapped, `${rel(file)} — ${expr.context}`);
    if (error) { bad(`${error} \u2192 ${trimmed.slice(0, 60)}`); exprFail += 1; }
  });

  if (!exprFail) {
    ok(`${rel(file)} — ${elements.length} elements, ${expressions.length} expressions, all valid`);
  }
});

/* ==================================================================
   4 — translation parity
   ================================================================== */

head("Content");

const content = await import(join(SRC, "content.js"));

function shape(node, path = "") {
  if (Array.isArray(node)) return node.length ? shape(node[0], `${path}[]`) : [`${path}[]`];
  if (node && typeof node === "object") {
    return Object.keys(node).sort().flatMap((key) => shape(node[key], `${path}.${key}`));
  }
  return [path];
}

const shapes = Object.entries(content.copy).map(([code, value]) => [code, shape(value)]);
const [, reference] = shapes[0];
shapes.slice(1).forEach(([code, other]) => {
  const missing = reference.filter((k) => !other.includes(k));
  const extra = other.filter((k) => !reference.includes(k));
  if (missing.length || extra.length) {
    bad(`${code}: ${missing.length} missing, ${extra.length} extra \u2192 ${missing.concat(extra).slice(0, 4).join(", ")}`);
  } else {
    ok(`${code} matches en (${reference.length} keys)`);
  }
});

Object.entries(content.copy).forEach(([code, value]) => {
  const plans = value.pricing.plans.map((p) => p.key).join(",");
  if (plans !== "light,basic,pro") bad(`${code}: unexpected plan keys (${plans})`);
});
ok("plan keys aligned across languages");

const typeKeys = content.projects.map((p) => p.key);
Object.entries(content.copy).forEach(([code, value]) => {
  const missing = typeKeys.filter((k) => !value.work.types[k]);
  if (missing.length) bad(`${code}: missing project labels for ${missing.join(", ")}`);
});
ok("every project has a label in every language");

/* ==================================================================
   5 — CSS coverage
   ================================================================== */

head("Styles");

const css = cssFiles.map((f) => readFileSync(f, "utf8")).join("\n");
const definedClasses = new Set();
const classPattern = /\.(-?[_a-zA-Z][\w-]*)/g;
let match = classPattern.exec(css);
while (match) {
  definedClasses.add(match[1]);
  match = classPattern.exec(css);
}

const jsxSource = jsxFiles.map((f) => readFileSync(f, "utf8")).join("\n");
const used = new Set();
const usePattern = /className=(?:"([^"]*)"|\{`([^`]*)`\}|\{"([^"]*)"\})/g;
let hit = usePattern.exec(jsxSource);
while (hit) {
  const value = hit[1] || hit[2] || hit[3] || "";
  value.split(/[\s${}?:'"]+/).filter(Boolean).forEach((cls) => {
    if (/^[a-zA-Z][\w-]*$/.test(cls)) used.add(cls);
  });
  hit = usePattern.exec(jsxSource);
}

const orphans = Array.from(used).filter((cls) => !definedClasses.has(cls));
if (orphans.length) bad(`classNames with no CSS rule: ${orphans.join(", ")}`);
else ok(`${used.size} classNames all resolve to CSS`);

["--accent", "--font-display", "--e-out", "--r-tube"].forEach((token) => {
  if (!css.includes(token)) bad(`design token ${token} is missing`);
});
ok("core design tokens present");

/* ==================================================================
   6 — icons
   ================================================================== */

head("Icons");

const lucide = await import("lucide-react");
const iconPattern = /import\s*\{([^}]*)\}\s*from\s*"lucide-react"/g;
const importedIcons = new Set();
let iconHit = iconPattern.exec(jsxSource);
while (iconHit) {
  iconHit[1].split(",").map((s) => s.trim()).filter(Boolean).forEach((n) => importedIcons.add(n));
  iconHit = iconPattern.exec(jsxSource);
}

const unknown = Array.from(importedIcons).filter((name) => !lucide[name]);
if (unknown.length) bad(`unknown lucide icons: ${unknown.join(", ")}`);
else ok(`${importedIcons.size} lucide icons exist`);

const unusedIcons = Array.from(importedIcons).filter((name) => {
  const uses = jsxSource.split(`<${name}`).length - 1;
  return uses === 0;
});
if (unusedIcons.length) bad(`imported but never rendered: ${unusedIcons.join(", ")}`);
else ok("no unused icon imports");

/* ==================================================================
   7 — anchors
   ================================================================== */

head("Navigation");

const ids = new Set();
const idPattern = /id="([a-z-]+)"/g;
let idHit = idPattern.exec(jsxSource);
while (idHit) { ids.add(idHit[1]); idHit = idPattern.exec(jsxSource); }

const missingAnchors = content.chapters.map((c) => c.id).filter((id) => !ids.has(id));
if (missingAnchors.length) bad(`chapters with no section: ${missingAnchors.join(", ")}`);
else ok(`all ${content.chapters.length} chapter anchors exist`);

Object.entries(content.copy).forEach(([code, value]) => {
  const broken = value.nav.map((n) => n.id).filter((id) => !ids.has(id));
  if (broken.length) bad(`${code} nav points at missing sections: ${broken.join(", ")}`);
});
ok("navigation links all resolve");

/* ================================================================== */

console.log("");
if (failures) {
  console.log(`\u001b[31m\u001b[1m${failures} problem(s) found\u001b[0m — build not recommended.\n`);
  process.exit(1);
}
console.log(`\u001b[32m\u001b[1mAll ${checks} checks passed.\u001b[0m\n`);
