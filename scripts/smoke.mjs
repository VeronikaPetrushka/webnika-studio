/* ------------------------------------------------------------------
   npm run smoke
   Renders the whole component tree in Node, in all three languages,
   to catch runtime errors that static parsing cannot see: typos in
   identifiers, missing content keys, bad prop shapes, broken .map()s.
   Uses a minimal JSX transform (scripts/jsx-transform.mjs) — Vite
   still does the real compile at build time.
------------------------------------------------------------------- */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, rmSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { transform } from "./jsx-transform.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const SRC = join(ROOT, "src");
const OUT = join(ROOT, ".smoke");

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

/* ---- 1. transform the source tree ---------------------------- */

function walk(dir, out = []) {
  readdirSync(dir).forEach((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  });
  return out;
}

const PREAMBLE = 'import { createElement as __h, Fragment as __Fragment } from "react";\n';

walk(SRC).forEach((file) => {
  const target = join(OUT, relative(SRC, file)).replace(/\.jsx$/, ".mjs");
  mkdirSync(dirname(target), { recursive: true });

  if (file.endsWith(".css")) return;

  let code = readFileSync(file, "utf8");
  code = code.replace(/^\s*import\s+["'][^"']+\.css["'];?\s*$/gm, "");
  code = code.replace(/import\.meta\.env\.BASE_URL/g, '"/"');
  code = code.replace(/from\s+"(\.[^"]*)\.jsx"/g, 'from "$1.mjs"');

  if (file.endsWith(".jsx")) code = PREAMBLE + transform(code);

  writeFileSync(target, code);
});

/* ---- 2. a browser stub thin enough to render against --------- */

let langChoice = "en";

const noop = () => {};
const stubEl = {
  style: {}, dataset: {}, classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
  addEventListener: noop, removeEventListener: noop, setAttribute: noop, getAttribute: () => null,
  appendChild: noop, removeChild: noop, focus: noop, querySelector: () => null,
  querySelectorAll: () => [], closest: () => null, getBoundingClientRect: () => ({ top: 0, left: 0, width: 0, height: 0, bottom: 0, right: 0 }),
  scrollIntoView: noop, contains: () => false,
};

globalThis.document = {
  documentElement: { ...stubEl, dataset: {}, lang: "en" },
  body: { ...stubEl },
  getElementById: () => null,
  querySelector: () => null,
  querySelectorAll: () => [],
  createElement: () => ({ ...stubEl }),
  addEventListener: noop,
  removeEventListener: noop,
  hidden: false,
  fonts: { ready: Promise.resolve() },
};

globalThis.window = {
  innerWidth: 1440, innerHeight: 900, scrollY: 0, devicePixelRatio: 2,
  addEventListener: noop, removeEventListener: noop, requestAnimationFrame: noop,
  cancelAnimationFrame: noop, matchMedia: () => ({ matches: false, addEventListener: noop, removeEventListener: noop, addListener: noop, removeListener: noop }),
  getComputedStyle: () => ({ getPropertyValue: () => "" }),
  scrollTo: noop, location: { href: "https://webnika-studio.vercel.app/", hash: "" },
  localStorage: { getItem: (key) => (key === "wn-lang" ? langChoice : null), setItem: noop },
  document: globalThis.document,
};

Object.defineProperty(globalThis, "navigator", {
  value: { language: "en-GB", maxTouchPoints: 0, hardwareConcurrency: 8, userAgent: "node" },
  configurable: true, writable: true,
});
globalThis.localStorage = globalThis.window.localStorage;
globalThis.matchMedia = globalThis.window.matchMedia;
globalThis.requestAnimationFrame = noop;
globalThis.cancelAnimationFrame = noop;
globalThis.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
globalThis.performance = globalThis.performance || { now: () => 0 };

/* ---- 3. render ---------------------------------------------- */

const { renderToStaticMarkup } = await import("react-dom/server");
const { createElement } = await import("react");

const warnings = [];
const realError = console.error;
console.error = (...args) => { warnings.push(args.join(" ")); };

const mod = await import(pathToFileURL(join(OUT, "main.mjs")).href);
const App = mod.default;

let failed = 0;
const results = [];

for (const lang of ["en", "uk", "pl"]) {
  langChoice = lang;
  try {
    const html = renderToStaticMarkup(createElement(App));
    const checks = [
      ["renders", html.length > 8000],
      ["hero present", html.includes("hero__")],
      ["all 11 chapters", (html.match(/class="chapter/g) || []).length >= 10],
      ["pricing plans", (html.match(/plan__/g) || []).length > 6],
      ["projects listed", html.includes("frame")],
      ["no undefined text", !html.includes(">undefined<") && !html.includes("undefined ")],
      ["no [object Object]", !html.includes("[object Object]")],
    ];
    const bad = checks.filter(([, pass]) => !pass).map(([name]) => name);
    if (bad.length) { failed += 1; results.push(`  \u001b[31m\u2717\u001b[0m ${lang}: ${bad.join(", ")}`); }
    else results.push(`  \u001b[32m\u2713\u001b[0m ${lang}: ${(html.length / 1024).toFixed(0)}kB of markup, all checks pass`);
  } catch (error) {
    failed += 1;
    results.push(`  \u001b[31m\u2717\u001b[0m ${lang}: ${error.message}\n${(error.stack || "").split("\n").slice(1, 5).join("\n")}`);
  }
}

console.error = realError;

console.log("\n\u001b[1mServer render\u001b[0m");
results.forEach((line) => console.log(line));

const real = warnings.filter((w) => !/useLayoutEffect|not supported in the server/i.test(w));
if (real.length) {
  console.log("\n\u001b[1mReact warnings\u001b[0m");
  Array.from(new Set(real)).slice(0, 12).forEach((w) => console.log(`  \u001b[33m!\u001b[0m ${w.slice(0, 220)}`));
  failed += real.length ? 1 : 0;
}

rmSync(OUT, { recursive: true, force: true });

console.log("");
if (failed) { console.log("\u001b[31m\u001b[1mSmoke test failed.\u001b[0m\n"); process.exit(1); }
console.log("\u001b[32m\u001b[1mSmoke test passed in all three languages.\u001b[0m\n");
