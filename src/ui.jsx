/* ------------------------------------------------------------------
   UI PRIMITIVES
   The small, reusable pieces of the interface: rich text, masked line
   reveals, the magnetic button, the cursor, the preloader, the ticker
   and the section header.
------------------------------------------------------------------ */

import React, { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { isFinePointer, prefersReducedMotion } from "./lib/motion.js";

/* ------------------------------------------------------------------
   RICH TEXT
   Content is stored as plain strings so it stays translatable. This
   turns the markup dialect into elements:
     [[x]] amber mark · ((x)) ice mark · {{x}} serif voice
------------------------------------------------------------------ */

const RICH_PATTERN = /(\[\[[^\]]*\]\]|\(\([^)]*\)\)|\{\{[^}]*\}\})/g;

export function parseRich(text) {
  const source = String(text == null ? "" : text);
  return source.split(RICH_PATTERN).filter(Boolean).map((part) => {
    if (part.slice(0, 2) === "[[" && part.slice(-2) === "]]") {
      return { kind: "amber", value: part.slice(2, -2) };
    }
    if (part.slice(0, 2) === "((" && part.slice(-2) === "))") {
      return { kind: "ice", value: part.slice(2, -2) };
    }
    if (part.slice(0, 2) === "{{" && part.slice(-2) === "}}") {
      return { kind: "serif", value: part.slice(2, -2) };
    }
    return { kind: "text", value: part };
  });
}

export function Rich({ text }) {
  const tokens = parseRich(text);
  return (
    <>
      {tokens.map((token, index) => {
        const key = `${token.kind}-${index}`;
        if (token.kind === "amber") {
          return <em className="mark mark--amber" key={key}>{token.value}</em>;
        }
        if (token.kind === "ice") {
          return <em className="mark mark--ice" key={key}>{token.value}</em>;
        }
        if (token.kind === "serif") {
          return <span className="serif" key={key}>{token.value}</span>;
        }
        return <React.Fragment key={key}>{token.value}</React.Fragment>;
      })}
    </>
  );
}

/* ------------------------------------------------------------------
   MASKED LINES
   "//" in content is a hard line break. Each line gets its own
   overflow mask so the headline is drawn upward, line by line, rather
   than fading in as a block.
------------------------------------------------------------------ */

export function Lines({ text, className = "" }) {
  const lines = String(text == null ? "" : text).split("//");
  return (
    <span className={className}>
      {lines.map((line, index) => (
        <span className="line-mask" key={`line-${index}`} style={{ "--line-index": index }}>
          <span><Rich text={line} /></span>
        </span>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------
   MAGNETIC BUTTON
   The pointer pulls the control 8% of the distance to its centre. It
   is the only "cute" interaction on the page, which is why it is
   allowed to exist.
------------------------------------------------------------------ */

export function Btn(props) {
  const {
    children,
    variant = "primary",
    size = "",
    className = "",
    href,
    onClick,
    magnetic = true,
    icon = true,
    ...rest
  } = props;

  const ref = useRef(null);

  const move = (event) => {
    const node = ref.current;
    if (!node || !magnetic || !isFinePointer() || prefersReducedMotion()) return;
    const rect = node.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    node.style.setProperty("--mx", `${(dx * 0.14).toFixed(2)}px`);
    node.style.setProperty("--my", `${(dy * 0.22).toFixed(2)}px`);
  };

  const reset = () => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--mx", "0px");
    node.style.setProperty("--my", "0px");
  };

  const classes = [
    "btn",
    `btn--${variant}`,
    size ? `btn--${size}` : "",
    className,
  ].filter(Boolean).join(" ");

  const content = (
    <>
      <span>{children}</span>
      {icon ? <ArrowRight size={16} strokeWidth={2} /> : null}
    </>
  );

  if (href) {
    return (
      <a
        ref={ref}
        className={classes}
        href={href}
        onPointerMove={move}
        onPointerLeave={reset}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={ref}
      type="button"
      className={classes}
      onClick={onClick}
      onPointerMove={move}
      onPointerLeave={reset}
      {...rest}
    >
      {content}
    </button>
  );
}

/* ------------------------------------------------------------------
   CURSOR
   Dot follows instantly, ring lags at 0.42 — the classic two-speed
   trick. The label reads whatever the hovered element declares in
   data-cursor, so the cursor always names the action.
------------------------------------------------------------------ */

export function Cursor() {
  useEffect(() => {
    if (!isFinePointer()) return undefined;

    const dot = document.querySelector(".cursor__dot");
    const ring = document.querySelector(".cursor__ring");
    const label = document.querySelector(".cursor__label");
    if (!dot || !ring || !label) return undefined;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const follow = () => {
      const dx = mx - rx;
      const dy = my - ry;
      rx += dx * 0.18;
      ry += dy * 0.18;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      if (Math.abs(dx) > 0.2 || Math.abs(dy) > 0.2) {
        raf = requestAnimationFrame(follow);
      } else {
        raf = 0;
      }
    };

    const move = (event) => {
      mx = event.clientX;
      my = event.clientY;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      label.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      if (!raf && !document.hidden) raf = requestAnimationFrame(follow);
    };

    const over = (event) => {
      const node = event.target instanceof Element ? event.target : null;
      const target = node
        ? node.closest("[data-cursor], a, button, .frame, .plan, .dossier__row")
        : null;

      ring.classList.toggle("is-active", Boolean(target));

      if (!target) {
        label.classList.remove("is-visible");
        return;
      }

      let text = target.getAttribute("data-cursor");
      if (!text) {
        if (target.classList.contains("frame")) text = "OPEN";
        else if (target.classList.contains("plan")) text = "SELECT";
        else if (target.classList.contains("dossier__row")) text = "EXPAND";
        else if (target.tagName === "A") text = "OPEN";
        else text = "CLICK";
      }
      label.textContent = text;
      label.classList.add("is-visible");
    };

    const onLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const onEnter = () => {
      dot.style.opacity = "";
      ring.style.opacity = "";
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="cursor" aria-hidden="true">
      <span className="cursor__ring" />
      <span className="cursor__dot" />
      <span className="cursor__label">OPEN</span>
    </div>
  );
}

/* ------------------------------------------------------------------
   PRELOADER — "IGNITION"
   Counts to 100 but never blocks: it resolves as soon as fonts and
   the first WebGL frame are ready, with a 1.1s floor so the wipe
   never feels like a flash, and a 4s ceiling so a slow CDN can never
   hold the page hostage.
------------------------------------------------------------------ */

export function Loader({ copy, ready, onDone }) {
  const [value, setValue] = useState(0);
  const [out, setOut] = useState(false);
  const started = useRef(0);

  useEffect(() => {
    started.current = performance.now();
    let raf = 0;

    const tick = () => {
      const elapsed = performance.now() - started.current;
      /* ease toward 92 on its own; the last 8 belong to `ready` */
      const natural = 92 * (1 - Math.exp(-elapsed / 720));
      const target = ready ? 100 : Math.min(natural, 92);
      setValue((current) => {
        const next = current + (target - current) * 0.14;
        return next > 99.4 ? 100 : next;
      });
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ready]);

  useEffect(() => {
    if (value < 99.5) return undefined;
    const elapsed = performance.now() - started.current;
    const wait = Math.max(0, 1100 - elapsed);
    const t1 = setTimeout(() => setOut(true), wait);
    const t2 = setTimeout(() => onDone && onDone(), wait + 1150);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [value, onDone]);

  const shown = Math.round(value);

  return (
    <div className={out ? "loader is-out" : "loader"} role="status" aria-live="polite">
      <div className="wrap">
        <div className="loader__label">{copy.label}</div>
        <div className="loader__count">
          <span>{String(shown).padStart(3, "0")}</span>
          <sub>%</sub>
        </div>
        <div className="loader__bar" style={{ "--p": value / 100 }}>
          <i />
        </div>
        <p className="loader__line">
          {shown >= 100 ? copy.ready : copy.line}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   TICKER
------------------------------------------------------------------ */

export function Ticker({ items }) {
  const doubled = items.concat(items);
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track">
        {doubled.map((item, index) => (
          <span key={`${item}-${index}`}>
            {item}
            <i>◆</i>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   SECTION HEADER
   The index is not decoration: the page is a numbered sequence and
   the rail on the left uses the same numbers.
------------------------------------------------------------------ */

export function Head({ index, kicker, title, lede, split = false, children }) {
  return (
    <header className={split ? "head head--split" : "head"} data-reveal="lift">
      <div>
        <div className="head__index">
          <b>{index}</b>
          <i />
          <span>{kicker}</span>
        </div>
        {title ? <h2 className="t-h2"><Lines text={title} /></h2> : null}
      </div>
      {lede || children ? (
        <div>
          {lede ? <p className="t-lede"><Rich text={lede} /></p> : null}
          {children}
        </div>
      ) : null}
    </header>
  );
}
