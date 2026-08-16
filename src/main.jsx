/* ------------------------------------------------------------------
   WEBNIKA STUDIO — application shell
   Owns: theme, language, the 3D world, the scroll driver, the
   enquiry modal, and the chrome around the ten chapters.
------------------------------------------------------------------ */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  ExternalLink,
  Mail,
  MapPin,
  Menu,
  Moon,
  Phone,
  Sun,
  X,
} from "lucide-react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/components.css";
import "./styles/sections.css";

import { chapters, contact, copy, langs } from "./content.js";
import { Btn, Cursor, Loader, Ticker } from "./ui.jsx";
import {
  Capabilities,
  Care,
  Faq,
  Hero,
  Launch,
  Method,
  Premise,
  Pricing,
  Signals,
  Studio,
  Work,
} from "./sections.jsx";
import { createObjectScene, detectQuality, formFromProgress } from "./lib/scene.js";
import {
  scrollToSection,
  useActiveChapter,
  useBodyLock,
  useDepthParallax,
  useFocusTrap,
  usePointerField,
  useRevealObserver,
  useScrollDriver,
} from "./lib/motion.js";

const PORTRAIT = `${import.meta.env.BASE_URL}assets/veronika-profile.png`;

function readStored(key, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? fallback : value;
  } catch (error) {
    return fallback;
  }
}

function writeStored(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    /* private mode — preference simply does not persist */
  }
}

/* ==================================================================
   THE STAGE — the 3D world, mounted once, driven by scroll
   ================================================================== */

function Stage({ dark, onReady }) {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const [failed, setFailed] = useState(false);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const quality = detectQuality();

    const scene = createObjectScene({
      canvas,
      quality,
      dark,
      onReady: () => {
        setLive(true);
        if (onReady) onReady();
      },
      onFail: () => {
        setFailed(true);
        if (onReady) onReady();
      },
    });

    sceneRef.current = scene;
    window.__webnikaScene = scene;

    const onResize = () => scene.resize();
    const onVisibility = () => (document.hidden ? scene.stop() : scene.start());

    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    /* a safety net: if three.js never arrives, show the CSS field */
    const guard = setTimeout(() => {
      if (!window.THREE) {
        setFailed(true);
        if (onReady) onReady();
      }
    }, 4000);

    return () => {
      clearTimeout(guard);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      scene.dispose();
      sceneRef.current = null;
      delete window.__webnikaScene;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.setTheme(dark);
  }, [dark]);

  return (
    <div className={failed ? "stage is-fallback" : "stage"} aria-hidden="true">
      <canvas ref={canvasRef} className={live && !failed ? "stage__canvas is-live" : "stage__canvas"} />
      <div className="stage__fallback" />
      <div className="stage__vignette" />
    </div>
  );
}

/* ==================================================================
   ENQUIRY MODAL
   ================================================================== */

function Enquiry({ t, plan, onClose }) {
  const boxRef = useRef(null);
  const [status, setStatus] = useState({ state: "idle", message: "" });

  useBodyLock(true);
  useFocusTrap(boxRef, true, onClose);

  const submit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get("_honey")) return;

    setStatus({ state: "sending", message: t.form.sending });

    const payload = {
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone") || "—",
      business: data.get("business"),
      budget: data.get("budget"),
      plan: data.get("plan"),
      message: data.get("message"),
      _subject: `New website request — ${data.get("plan")}`,
      _template: "table",
    };

    try {
      const response = await fetch(contact.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false) throw new Error("rejected");
      form.reset();
      setStatus({ state: "success", message: t.form.success });
    } catch (error) {
      setStatus({ state: "error", message: t.form.error });
    }
  };

  return (
    <div className="backdrop" onMouseDown={onClose}>
      <div
        className="modal"
        ref={boxRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.form.title}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button type="button" className="modal__close" onClick={onClose} aria-label={t.ui.close}>
          <X size={17} strokeWidth={1.8} />
        </button>

        <div className="head__index">
          <b>{t.form.eyebrow}</b>
          <i />
          <span>{t.meta.responseNote}</span>
        </div>

        <h2 className="t-h3" style={{ marginTop: "14px" }}>{t.form.title}</h2>
        <p className="t-lede" style={{ marginTop: "12px", fontSize: "0.94rem" }}>{t.form.intro}</p>

        <div className="modal__plan">{t.form.planLabel}: {plan}</div>

        <form className="form" onSubmit={submit}>
          <input type="hidden" name="plan" value={plan} readOnly />
          <input type="text" name="_honey" className="honey" tabIndex="-1" autoComplete="off" aria-hidden="true" />

          <label className="field">
            <span>{t.form.name}</span>
            <input name="name" required autoComplete="name" />
          </label>

          <div className="form__row">
            <label className="field">
              <span>{t.form.email}</span>
              <input type="email" name="email" required autoComplete="email" />
            </label>
            <label className="field">
              <span>{t.form.phone}</span>
              <input name="phone" autoComplete="tel" />
            </label>
          </div>

          <div className="form__row">
            <label className="field">
              <span>{t.form.business}</span>
              <input name="business" required />
            </label>
            <label className="field">
              <span>{t.form.budgetLabel}</span>
              <select name="budget" defaultValue={t.form.budgets[4]}>
                {t.form.budgets.map((budget) => (
                  <option key={budget} value={budget}>{budget}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="field">
            <span>{t.form.message}</span>
            <textarea name="message" rows="4" required placeholder={t.form.messagePlaceholder} />
          </label>

          <button type="submit" className="btn btn--primary btn--block" disabled={status.state === "sending"}>
            <span>{status.state === "sending" ? t.form.sending : t.form.send}</span>
            <ArrowUpRight size={16} strokeWidth={2} />
          </button>

          {status.message && status.state !== "sending" ? (
            <p className={`form__status ${status.state}`}>{status.message}</p>
          ) : null}

          <p className="form__note">{t.form.privacy}</p>
        </form>
      </div>
    </div>
  );
}

/* ==================================================================
   APP
   ================================================================== */

function App() {
  const [lang, setLang] = useState(() => {
    const stored = readStored("wn-lang", "");
    if (stored && copy[stored]) return stored;
    const nav = (navigator.language || "en").slice(0, 2);
    return copy[nav] ? nav : "en";
  });
  const [dark, setDark] = useState(() => readStored("wn-theme", "dark") !== "light");
  const [booted, setBooted] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);
  const [menu, setMenu] = useState(false);
  const [order, setOrder] = useState(null);
  const [railVisible, setRailVisible] = useState(false);
  const [commandVisible, setCommandVisible] = useState(false);
  const [percent, setPercent] = useState(0);

  const progressRef = useRef(null);
  const headerRef = useRef(null);
  const lastY = useRef(0);

  const t = copy[lang];
  const chapterIds = useMemo(() => chapters.map((c) => c.id), []);
  const activeChapter = useActiveChapter(chapterIds);

  /* ---- theme + language side effects --------------------------- */

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    writeStored("wn-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const entry = langs.find((l) => l.code === lang);
    document.documentElement.lang = entry ? entry.htmlLang : "en";
    writeStored("wn-lang", lang);
  }, [lang]);

  /* ---- boot: fonts + first WebGL frame ------------------------- */

  useEffect(() => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setAssetsReady(true);
    };
    const timer = setTimeout(finish, 3200);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => setTimeout(finish, 220)).catch(finish);
    } else {
      setTimeout(finish, 900);
    }
    return () => clearTimeout(timer);
  }, []);

  const onSceneReady = useCallback(() => setAssetsReady(true), []);

  /* ---- the single scroll driver -------------------------------- */

  useScrollDriver(({ y, progress }) => {
    if (progressRef.current) {
      progressRef.current.style.transform = `scaleX(${progress.toFixed(4)})`;
    }

    const scene = window.__webnikaScene;
    if (scene) scene.setProgress(progress, formFromProgress(progress));

    const header = headerRef.current;
    if (header) {
      header.classList.toggle("is-stuck", y > 40);
      const goingDown = y > lastY.current && y > 340;
      header.classList.toggle("is-hidden", goingDown && !menu);
    }

    setRailVisible(y > window.innerHeight * 0.6);
    setCommandVisible(y > window.innerHeight * 0.85 && progress < 0.96);
    setPercent(Math.round(progress * 100));
    lastY.current = y;
  });

  /* ---- pointer parallax --------------------------------------- */

  usePointerField((x, y) => {
    const scene = window.__webnikaScene;
    if (scene) scene.setPointer(x, y);
  });

  /* ---- the object reacts to the hero only ---------------------- */

  useEffect(() => {
    const scene = window.__webnikaScene;
    const inHero = activeChapter === "top";
    if (scene) scene.setPointerAmp(inHero ? 0.42 : 0.08);
  }, [activeChapter]);

  /* ---- clicking the empty hero pulses the object --------------- */

  useEffect(() => {
    const onDown = (event) => {
      if (window.scrollY > window.innerHeight * 0.9) return;
      const node = event.target instanceof Element ? event.target : null;
      if (node && node.closest("a, button, input, select, textarea, [role='dialog']")) return;
      const scene = window.__webnikaScene;
      if (scene) scene.pulse();
    };
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);

  /* ---- reveals + parallax ------------------------------------- */

  useRevealObserver([lang, booted], booted);
  useDepthParallax([lang, booted]);
  useBodyLock(menu);

  /* ---- navigation --------------------------------------------- */

  const go = useCallback((id) => {
    setMenu(false);
    window.requestAnimationFrame(() => scrollToSection(id));
  }, []);

  const startProject = useCallback((label) => {
    setOrder(typeof label === "string" ? label : "Custom project");
  }, []);

  return (
    <>
      <a className="skip-link" href="#top">{t.ui.skip}</a>

      <Stage dark={dark} onReady={onSceneReady} />
      <div className="grain" aria-hidden="true" />
      <Cursor />

      {!booted ? (
        <Loader copy={t.loader} ready={assetsReady} onDone={() => setBooted(true)} />
      ) : null}

      <div className="progress" aria-hidden="true"><span ref={progressRef} /></div>

      <nav className={railVisible ? "rail is-visible" : "rail"} aria-label="Chapters">
        {chapters.map((chapter) => (
          <button
            type="button"
            key={chapter.id}
            className={activeChapter === chapter.id ? "rail__item is-active" : "rail__item"}
            onClick={() => go(chapter.id)}
          >
            <i />
            <span>{chapter.index} — {t.chapterNames[chapter.key]}</span>
          </button>
        ))}
        <div className="rail__readout">{String(percent).padStart(3, "0")}%</div>
      </nav>

      <header className="header" ref={headerRef}>
        <a className="brand" href="#top" aria-label={t.ui.home} onClick={(e) => { e.preventDefault(); go("top"); }}>
          <span className="brand__mark">WN</span>
          <span className="brand__copy">
            <b>WebNika</b>
            <small>DIGITAL STUDIO / WARSAW</small>
          </span>
        </a>

        <nav className="nav" aria-label="Primary">
          {t.nav.map((item) => (
            <button
              type="button"
              key={item.id}
              className={activeChapter === item.id ? "nav__link is-active" : "nav__link"}
              onClick={() => go(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="tools">
          <div className="lang" role="group" aria-label={t.ui.language}>
            {langs.map((entry) => (
              <button
                type="button"
                key={entry.code}
                className={lang === entry.code ? "is-active" : ""}
                onClick={() => setLang(entry.code)}
                aria-pressed={lang === entry.code}
              >
                {entry.label}
              </button>
            ))}
          </div>

          <button type="button" className="icon-btn" onClick={() => setDark(!dark)} aria-label={t.ui.theme}>
            {dark ? <Sun size={16} strokeWidth={1.8} /> : <Moon size={16} strokeWidth={1.8} />}
          </button>

          <Btn variant="primary" onClick={() => startProject("Custom project")} icon={false}>
            {t.ui.contact}
          </Btn>

          <button type="button" className="icon-btn burger" onClick={() => setMenu(true)} aria-label={t.ui.menu}>
            <Menu size={18} strokeWidth={1.8} />
          </button>
        </div>
      </header>

      {menu ? (
        <div className="drawer">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="t-mono">{t.ui.menu}</span>
            <button type="button" className="icon-btn" onClick={() => setMenu(false)} aria-label={t.ui.close}>
              <X size={18} strokeWidth={1.8} />
            </button>
          </div>

          <div className="drawer__nav">
            {t.nav.map((item, index) => (
              <button type="button" key={item.id} style={{ "--i": index }} onClick={() => go(item.id)}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item.label}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gap: "16px" }}>
            <div className="lang" style={{ justifySelf: "start" }}>
              {langs.map((entry) => (
                <button
                  type="button"
                  key={entry.code}
                  className={lang === entry.code ? "is-active" : ""}
                  onClick={() => setLang(entry.code)}
                >
                  {entry.label}
                </button>
              ))}
            </div>
            <Btn variant="primary" className="btn--block" onClick={() => { setMenu(false); startProject("Custom project"); }}>
              {t.ui.contact}
            </Btn>
          </div>
        </div>
      ) : null}

      <main className="page">
        <Hero t={t} onStart={() => startProject("Custom project")} onWork={() => go("work")} />

        <Ticker items={t.ticker} />

        <Premise t={t} />
        <Capabilities t={t} onStart={() => startProject("Custom project")} />
        <Work t={t} onStart={() => startProject("Custom project")} />
        <Method t={t} onStart={() => startProject("Custom project")} />
        <Pricing t={t} onPick={startProject} />
        <Care t={t} onPick={startProject} />
        <Studio t={t} onStart={() => startProject("Custom project")} portrait={PORTRAIT} />
        <Signals t={t} />
        <Faq t={t} onStart={() => startProject("Custom project")} />
        <Launch t={t} onStart={() => startProject("Custom project")} email={contact.email} />
      </main>

      <footer className="footer">
        <div className="wrap">
          <div className="footer__grid">
            <div className="footer__brand">
              <a className="brand" href="#top" onClick={(e) => { e.preventDefault(); go("top"); }}>
                <span className="brand__mark">WN</span>
                <span className="brand__copy">
                  <b>WebNika Studio</b>
                  <small>DIGITAL STUDIO / WARSAW</small>
                </span>
              </a>
              <p>{t.footer.blurb}</p>
            </div>

            <div className="footer__col">
              <h4>{t.footer.contactLabel}</h4>
              <a href={`mailto:${contact.email}`}><Mail size={14} strokeWidth={1.7} />{contact.email}</a>
              <a href={`tel:${contact.phoneHref}`}><Phone size={14} strokeWidth={1.7} />{contact.phone}</a>
              <span><MapPin size={14} strokeWidth={1.7} />{contact.city}</span>
            </div>

            <div className="footer__col">
              <h4>{t.footer.navLabel}</h4>
              {t.nav.map((item) => (
                <button type="button" key={item.id} onClick={() => go(item.id)}>{item.label}</button>
              ))}
            </div>

            <div className="footer__col">
              <h4>{t.footer.studioLabel}</h4>
              <a href={contact.github} target="_blank" rel="noreferrer">
                <ExternalLink size={14} strokeWidth={1.7} />GitHub
              </a>
              <button type="button" onClick={() => startProject("Custom project")}>{t.ui.contact}</button>
              <span>{t.meta.responseNote}</span>
            </div>
          </div>

          <div className="footer__base">
            <span>{t.footer.legal}</span>
            <span>{t.footer.built}</span>
          </div>
        </div>
      </footer>

      <div className={commandVisible && !order && !menu ? "command is-visible" : "command"}>
        <span className="command__note"><i />{t.meta.responseNote}</span>
        <Btn variant="primary" onClick={() => startProject("Custom project")}>{t.ui.contact}</Btn>
      </div>

      {order ? <Enquiry t={t} plan={order} onClose={() => setOrder(null)} /> : null}

      <Analytics />
      <SpeedInsights />
    </>
  );
}

const container = document.getElementById("root");
if (container) createRoot(container).render(<App />);

export default App;
