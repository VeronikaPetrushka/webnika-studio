/* A small JSX -> React.createElement transformer.
   Not a compiler — just enough to type-check the component tree by
   rendering it in Node during `npm run smoke`. Vite/Babel does the
   real thing at build time. */

export function scanSpans(src) {
  const spans = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    const next = src[i + 1];
    if (c === "/" && next === "/") {
      const end = src.indexOf("\n", i);
      const stop = end === -1 ? src.length : end;
      spans.push({ start: i, end: stop });
      i = stop;
      continue;
    }
    if (c === "/" && next === "*") {
      const end = src.indexOf("*/", i + 2);
      const stop = end === -1 ? src.length : end + 2;
      spans.push({ start: i, end: stop });
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
      spans.push({ start: i, end: j + 1 });
      i = j + 1;
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
      spans.push({ start: i, end: j + 1 });
      i = j + 1;
      continue;
    }
    if (c === "/" && next !== ">") {
      const before = src.slice(0, i).replace(/\s+$/, "");
      const last = before[before.length - 1] || "";
      if (!/[A-Za-z0-9_$)\]}]/.test(last)) {
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
          spans.push({ start: i, end: k });
          i = k;
          continue;
        }
      }
    }
    i += 1;
  }
  return spans;
}

const inSpan = (spans, i) => spans.some((s) => i >= s.start && i < s.end);

function matchBrace(src, start) {
  const spans = scanSpans(src.slice(start)).map((s) => ({ start: s.start + start, end: s.end + start }));
  let depth = 0;
  let i = start;
  while (i < src.length) {
    if (inSpan(spans, i)) { i += 1; continue; }
    if (src[i] === "{") depth += 1;
    else if (src[i] === "}") {
      depth -= 1;
      if (depth === 0) return i;
    }
    i += 1;
  }
  return -1;
}

const isTagStart = (src, i) =>
  src[i] === "<" && (/[A-Za-z]/.test(src[i + 1] || "") || src[i + 1] === ">");

function parseElement(src, open) {
  let i = open + 1;
  let name = "";
  while (i < src.length && /[A-Za-z0-9_$.]/.test(src[i])) { name += src[i]; i += 1; }

  const attrs = [];
  let selfClosing = false;

  while (i < src.length) {
    while (i < src.length && /\s/.test(src[i])) i += 1;
    if (src[i] === "/" && src[i + 1] === ">") { selfClosing = true; i += 2; break; }
    if (src[i] === ">") { i += 1; break; }

    if (src[i] === "{") {
      const close = matchBrace(src, i);
      attrs.push({ spread: src.slice(i + 1, close) });
      i = close + 1;
      continue;
    }

    let key = "";
    while (i < src.length && /[A-Za-z0-9_$:-]/.test(src[i])) { key += src[i]; i += 1; }
    while (i < src.length && /\s/.test(src[i])) i += 1;

    if (src[i] !== "=") { attrs.push({ key, value: "true" }); continue; }
    i += 1;
    while (i < src.length && /\s/.test(src[i])) i += 1;

    if (src[i] === "{") {
      const close = matchBrace(src, i);
      attrs.push({ key, value: src.slice(i + 1, close) });
      i = close + 1;
    } else if (src[i] === '"' || src[i] === "'") {
      const quote = src[i];
      let j = i + 1;
      while (j < src.length && src[j] !== quote) j += 1;
      attrs.push({ key, value: JSON.stringify(src.slice(i + 1, j)) });
      i = j + 1;
    } else if (src[i] === "<") {
      const child = parseElement(src, i);
      attrs.push({ key, value: child.code });
      i = child.end;
    }
  }

  const children = [];

  if (!selfClosing) {
    let text = "";
    const flush = () => {
      if (!/\S/.test(text)) { text = ""; return; }
      const cleaned = text
        .split("\n")
        .map((line, index, all) => (index === 0 || index === all.length - 1 ? line : line.trim()))
        .filter((line, index, all) => !(line.trim() === "" && (index === 0 || index === all.length - 1)))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      if (cleaned) children.push(JSON.stringify(cleaned));
      text = "";
    };

    while (i < src.length) {
      if (src[i] === "{") {
        flush();
        const close = matchBrace(src, i);
        const body = src.slice(i + 1, close).trim();
        if (body && !/^\/[/*]/.test(body)) children.push(`(${transform(body)})`);
        i = close + 1;
        continue;
      }
      if (src[i] === "<" && src[i + 1] === "/") {
        flush();
        while (i < src.length && src[i] !== ">") i += 1;
        i += 1;
        break;
      }
      if (isTagStart(src, i)) {
        flush();
        const child = parseElement(src, i);
        children.push(child.code);
        i = child.end;
        continue;
      }
      text += src[i];
      i += 1;
    }
  }

  const tag = name === ""
    ? "__Fragment"
    : /^[a-z]/.test(name) && !name.includes(".")
      ? JSON.stringify(name)
      : name;

  let props = "null";
  if (attrs.length) {
    const parts = attrs.map((attr) => {
      if (attr.spread !== undefined) return `...(${attr.spread.trim().replace(/^\.\.\./, "")})`;
      const key = /^[A-Za-z_$][\w$]*$/.test(attr.key) ? attr.key : JSON.stringify(attr.key);
      return `${key}: (${transform(attr.value)})`;
    });
    props = `{ ${parts.join(", ")} }`;
  }

  const code = children.length
    ? `__h(${tag}, ${props}, ${children.join(", ")})`
    : `__h(${tag}, ${props})`;

  return { code, end: i };
}

export function transform(src) {
  const spans = scanSpans(src);
  let out = "";
  let i = 0;
  while (i < src.length) {
    if (inSpan(spans, i)) { out += src[i]; i += 1; continue; }
    if (isTagStart(src, i)) {
      const before = out.replace(/\s+$/, "");
      const last = before[before.length - 1] || "";
      const opener = /[([{=,:;?&|>]/.test(last) || before === "" || /\breturn$/.test(before)
        || /\b(?:&&|\|\|)$/.test(before);
      if (opener) {
        const el = parseElement(src, i);
        out += el.code;
        i = el.end;
        continue;
      }
    }
    out += src[i];
    i += 1;
  }
  return out;
}
