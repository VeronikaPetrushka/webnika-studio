/* ------------------------------------------------------------------
   MOTION SYSTEM — timing, triggers and the single scroll driver
   ------------------------------------------------------------------
   Rules this file enforces:

   1. ONE rAF loop for scroll. Every scroll-driven value (progress bar,
      chapter rail, 3D form, parallax) is computed in the same frame.
   2. Nothing animates on the main thread that could animate on the
      compositor — we only ever write transform/opacity/CSS variables.
   3. Reveals fire ONCE. A section that re-animates every time you
      scroll past it reads as a toy, not as a studio.
   4. prefers-reduced-motion removes movement, never content.

   Timing scale (mirrored in tokens.css):
     micro   140ms   state feedback on press
     hover   280ms   pointer response
     reveal  900ms   content entering the frame
     chapter 1400ms  world-level state change
------------------------------------------------------------------- */

import { useEffect, useLayoutEffect, useRef, useState } from "react";

export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smoothstep = (t) => {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
};

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isFinePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ---------------------------------------------------------------- */

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, [query]);

  return matches;
}

/* ---------------------------------------------------------------- */
/* Reveal — content enters the frame once, with a per-child stagger   */
/* ---------------------------------------------------------------- */

export function useRevealObserver(deps, active) {
  useEffect(() => {
    if (active === false) return undefined;
    const nodes = Array.from(document.querySelectorAll("[data-reveal]:not(.is-revealed)"));
    if (!nodes.length) return undefined;

    if (prefersReducedMotion()) {
      nodes.forEach((n) => n.classList.add("is-revealed"));
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, (deps || []).concat([active]));
}

/* ---------------------------------------------------------------- */
/* The single scroll driver                                          */
/* ---------------------------------------------------------------- */

export function useScrollDriver(handler) {
  const cb = useRef(handler);
  cb.current = handler;

  useEffect(() => {
    let raf = 0;
    let lastY = -1;

    const measure = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const y = window.scrollY || window.pageYOffset || 0;
      const progress = max > 0 ? clamp(y / max, 0, 1) : 0;
      const direction = y > lastY ? 1 : -1;
      lastY = y;
      if (cb.current) cb.current({ y, progress, max, direction });
    };

    const request = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request, { passive: true });
    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
}

/* ---------------------------------------------------------------- */
/* Which chapter is on screen                                        */
/* ---------------------------------------------------------------- */

export function useActiveChapter(ids) {
  const [active, setActive] = useState(ids[0]);
  const key = ids.join("|");

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!sections.length) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        let best = null;
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (!best || entry.intersectionRatio > best.intersectionRatio) best = entry;
        });
        if (best) setActive(best.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.6, 1] }
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return active;
}

/* ---------------------------------------------------------------- */
/* Global pointer, rAF-throttled, written straight to CSS variables   */
/* ---------------------------------------------------------------- */

export function usePointerField(handler) {
  const cb = useRef(handler);
  cb.current = handler;

  useEffect(() => {
    if (!isFinePointer()) return undefined;
    let raf = 0;
    let latest = null;

    const flush = () => {
      raf = 0;
      if (!latest) return;
      const x = latest.clientX / window.innerWidth - 0.5;
      const y = latest.clientY / window.innerHeight - 0.5;
      const root = document.documentElement.style;
      root.setProperty("--px", x.toFixed(4));
      root.setProperty("--py", y.toFixed(4));
      if (cb.current) cb.current(x, y, latest);
    };

    const onMove = (event) => {
      latest = event;
      if (!raf) raf = requestAnimationFrame(flush);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
}

/* ---------------------------------------------------------------- */
/* Parallax depth for [data-depth] blocks                            */
/* ---------------------------------------------------------------- */

export function useDepthParallax(deps) {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const nodes = Array.from(document.querySelectorAll("[data-depth]"));
    if (!nodes.length) return undefined;

    const visible = new Set();
    let raf = 0;

    const update = () => {
      raf = 0;
      const vh = window.innerHeight || 1;
      visible.forEach((node) => {
        const rect = node.getBoundingClientRect();
        const centre = rect.top + rect.height / 2;
        const p = clamp((centre - vh / 2) / vh, -1, 1);
        const strength = Number(node.dataset.depth) || 1;
        node.style.setProperty("--dy", `${(p * 26 * strength).toFixed(2)}px`);
        node.style.setProperty("--dy-inv", `${(p * -18 * strength).toFixed(2)}px`);
        node.style.setProperty("--dr", `${(p * 0.8 * strength).toFixed(3)}deg`);
        node.style.setProperty("--dp", p.toFixed(3));
      });
    };

    const request = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        });
        request();
      },
      { rootMargin: "20% 0px 20% 0px" }
    );

    nodes.forEach((n) => io.observe(n));
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request, { passive: true });
    request();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps || []);
}

/* ---------------------------------------------------------------- */
/* Body scroll lock (modal + mobile nav)                             */
/* ---------------------------------------------------------------- */

export function useBodyLock(active) {
  useLayoutEffect(() => {
    if (!active) return undefined;
    const { body } = document;
    const previous = body.style.overflow;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    return () => {
      body.style.overflow = previous;
      body.style.paddingRight = "";
    };
  }, [active]);
}

/* ---------------------------------------------------------------- */
/* Focus trap for the enquiry modal                                  */
/* ---------------------------------------------------------------- */

export function useFocusTrap(ref, active, onClose) {
  useEffect(() => {
    if (!active || !ref.current) return undefined;
    const root = ref.current;
    const previous = document.activeElement;

    const selector =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const first = root.querySelector(selector);
    if (first && first.focus) first.focus({ preventScroll: true });

    const onKey = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        if (onClose) onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const nodes = Array.from(root.querySelectorAll(selector)).filter(
        (n) => n.offsetParent !== null
      );
      if (!nodes.length) return;
      const head = nodes[0];
      const tail = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === head) {
        event.preventDefault();
        tail.focus();
      } else if (!event.shiftKey && document.activeElement === tail) {
        event.preventDefault();
        head.focus();
      }
    };

    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      if (previous && previous.focus) previous.focus({ preventScroll: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, onClose]);
}

/* ---------------------------------------------------------------- */
/* Smooth anchor scrolling that respects the sticky header           */
/* ---------------------------------------------------------------- */

export function scrollToSection(id) {
  const node = document.getElementById(id);
  if (!node) return;
  const offset = window.innerWidth > 900 ? 24 : 12;
  const top = node.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({
    top,
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
}
