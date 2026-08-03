import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Code2,
  Globe2,
  Menu,
  Moon,
  Phone,
  Mail,
  MapPin,
  Sun,
  X,
  Zap,
  ShieldCheck,
  Wrench,
  ExternalLink,
} from "lucide-react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "./styles.css";
import { projects, copy } from "./content.js";


function App() {
  const [lang, setLang] = useState(localStorage.getItem("vp-lang") || "en");
  const [dark, setDark] = useState(localStorage.getItem("vp-theme") === "dark");
  const [menu, setMenu] = useState(false);
  const [order, setOrder] = useState(null);
  const [review, setReview] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const [formStatus, setFormStatus] = useState({ state: "idle", message: "" });
  const t = copy[lang];

  const a11y = {
    en: {
      home: "Go to WebNika Studio homepage",
      switchToLight: "Switch to light theme",
      switchToDark: "Switch to dark theme",
      openMenu: "Open navigation menu",
      closeMenu: "Close navigation menu",
      previousReview: "Show previous review",
      nextReview: "Show next review",
      closeModal: "Close contact form",
      openProject: (name) => `Open ${name} live website in a new tab`,
    },
    uk: {
      home: "Перейти на головну сторінку WebNika Studio",
      switchToLight: "Увімкнути світлу тему",
      switchToDark: "Увімкнути темну тему",
      openMenu: "Відкрити меню навігації",
      closeMenu: "Закрити меню навігації",
      previousReview: "Показати попередній відгук",
      nextReview: "Показати наступний відгук",
      closeModal: "Закрити контактну форму",
      openProject: (name) => `Відкрити сайт ${name} у новій вкладці`,
    },
    pl: {
      home: "Przejdź do strony głównej WebNika Studio",
      switchToLight: "Włącz jasny motyw",
      switchToDark: "Włącz ciemny motyw",
      openMenu: "Otwórz menu nawigacji",
      closeMenu: "Zamknij menu nawigacji",
      previousReview: "Pokaż poprzednią opinię",
      nextReview: "Pokaż następną opinię",
      closeModal: "Zamknij formularz kontaktowy",
      openProject: (name) => `Otwórz stronę ${name} w nowej karcie`,
    },
  }[lang];

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("vp-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => localStorage.setItem("vp-lang", lang), [lang]);

  useEffect(() => {
    if (order) setFormStatus({ state: "idle", message: "" });
  }, [order]);

  useEffect(() => {
    const id = setInterval(
      () => setReview((r) => (r + 1) % t.reviews.length),
      5000
    );
    return () => clearInterval(id);
  }, [lang]);

  const scroll = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenu(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    if (fd.get("_honey")) return;

    setFormStatus({
      state: "sending",
      message:
        lang === "uk"
          ? "Надсилання…"
          : lang === "pl"
          ? "Wysyłanie…"
          : "Sending…",
    });

    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone") || "Not provided",
      business: fd.get("business"),
      plan: fd.get("plan"),
      message: fd.get("message"),
      _subject: `New website request — ${fd.get("plan")}`,
      _template: "table",
    };

    try {
      const response = await fetch(
        "https://formsubmit.co/ajax/21f8a6c0d50d9b386b6b2cedd3034dcc",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Submission failed");
      }

      form.reset();
      setFormStatus({
        state: "success",
        message:
          lang === "uk"
            ? "Дякую! Запит надіслано. Я зв’яжуся з вами найближчим часом."
            : lang === "pl"
            ? "Dziękuję! Zapytanie zostało wysłane. Skontaktuję się wkrótce."
            : "Thank you! Your request was sent. I will contact you shortly.",
      });
    } catch (error) {
      setFormStatus({
        state: "error",
        message:
          lang === "uk"
            ? "Не вдалося надіслати форму. Напишіть мені на email або зателефонуйте."
            : lang === "pl"
            ? "Nie udało się wysłać formularza. Napisz do mnie e-mail lub zadzwoń."
            : "The form could not be sent. Please email or call me directly.",
      });
    }
  };

  return (
    <>
      <header>
        <a className="logo" href="#top" aria-label={a11y.home}>
          <img
            src={`${import.meta.env.BASE_URL}assets/android-chrome-192x192.png`}
            alt=""
            aria-hidden="true"
            width="192"
            height="192"
            decoding="async"
            fetchPriority="high"
            className="logo-image"
          />

          <div className="logo-text">
            <div className="logo-brand">
              <span className="logo-web">Web</span>
              <span className="logo-nika">Nika</span>
            </div>

            <div className="logo-studio">
              <span></span>
              STUDIO
              <span></span>
            </div>
          </div>
        </a>
        <nav id="main-navigation" className={menu ? "open" : ""}>
          {t.nav.map((x, i) => (
            <button
              key={x}
              onClick={() => scroll(["services", "pricing", "portfolio", "about", "faq"][i])}
            >
              {x}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            aria-label="Language"
          >
            <option value="en">EN</option>
            <option value="uk">UA</option>
            <option value="pl">PL</option>
          </select>
          <button
            type="button"
            className="icon-btn"
            onClick={() => setDark(!dark)}
            aria-label={dark ? a11y.switchToLight : a11y.switchToDark}
            title={dark ? a11y.switchToLight : a11y.switchToDark}
          >
            {dark ? (
              <Sun size={18} aria-hidden="true" />
            ) : (
              <Moon size={18} aria-hidden="true" />
            )}
          </button>
          <button className="contact-btn" onClick={() => setOrder("Custom project")}>
            {t.contact}
          </button>
          <button
            type="button"
            className="menu-btn"
            onClick={() => setMenu(!menu)}
            aria-label={menu ? a11y.closeMenu : a11y.openMenu}
            aria-expanded={menu}
            aria-controls="main-navigation"
          >
            {menu ? (
              <X aria-hidden="true" />
            ) : (
              <Menu aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <span className="pill">
              <Zap size={15} />
              {t.heroTag}
            </span>
            <h1>{t.heroTitle}</h1>
            <p>{t.heroText}</p>
            <div className="hero-buttons">
              <button className="primary" onClick={() => scroll("pricing")}>
                {t.heroPrimary}
                <ArrowRight size={18} />
              </button>
              <button className="secondary" onClick={() => scroll("portfolio")}>
                {t.heroSecondary}
              </button>
            </div>
            <div className="trust">
              <ShieldCheck />
              <span>{t.trust}</span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="browser">
              <div className="browser-top">
                <i />
                <i />
                <i />
                <span>yourbusiness.com</span>
              </div>
              <div className="browser-page">
                <div className="mock-nav">
                  <b>LOCAL.</b>
                  <span>Services&nbsp;&nbsp; About&nbsp;&nbsp; Contact</span>
                </div>
                <div className="mock-hero">
                  <small>MADE FOR YOUR COMMUNITY</small>
                  <h2>
                    Local quality.
                    <br />
                    Modern presence.
                  </h2>
                  <button>Book a visit</button>
                </div>
                <div className="mock-cards">
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            </div>
            <div className="floating-card one">
              <Check />
              Mobile-ready
            </div>
            <div className="floating-card two">
              <Globe2 />
              3 languages
            </div>
          </div>
          <div className="stats">
            {t.stats.map((s, i) => (
              <div key={s}>
                <strong>{["10+", "100%", "EN · UA · PL"][i]}</strong>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="services" className="section">
          <div className="section-head">
            <span>01 / SERVICES</span>
            <h2>{t.servicesTitle}</h2>
            <p>{t.servicesSub}</p>
          </div>
          <div className="services-grid">
            {t.serviceCards.map((s, i) => (
              <article key={s[0]}>
                <div className="service-icon">
                  {[<Code2 />, <Globe2 />, <Zap />, <Wrench />][i]}
                </div>
                <h3>{s[0]}</h3>
                <p>{s[1]}</p>
                <span>0{i + 1}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="section design-guidance">
          <div className="design-guidance__visual">
            <div className="guidance-window">
              <div className="guidance-window__top">
                <i />
                <i />
                <i />
              </div>
              <div className="guidance-layout">
                <span />
                <div>
                  <b />
                  <b />
                  <b />
                </div>
              </div>
            </div>
            <div className="guidance-note">Strategy + design + development</div>
          </div>
          <div className="design-guidance__copy">
            <span>DESIGN GUIDANCE</span>
            <h2>{t.designPromiseTitle}</h2>
            <p>{t.designPromiseText}</p>
            <ul>
              {t.designPromisePoints.map((item) => (
                <li key={item}>
                  <Check size={18} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="pricing" className="section pricing">
          <div className="section-head">
            <span>02 / PRICING</span>
            <h2>{t.pricingTitle}</h2>
            <p>{t.pricingSub}</p>
          </div>
          <div className="consultation-callout">
            <div>
              <span>FREE PROJECT DIRECTION</span>
              <h3>{t.consultationTitle}</h3>
              <p>{t.consultationText}</p>
            </div>
            <button onClick={() => setOrder(t.consultationButton)}>
              {t.consultationButton}
              <ArrowRight size={18} />
            </button>
          </div>
          <div className="plans">
            {t.plans.map((p, i) => (
              <article className={i === 1 ? "featured" : ""} key={p.name}>
                <div className="plan-top">
                  <span>{p.badge}</span>
                  <small>{p.eta}</small>
                </div>
                <h3>{p.name}</h3>
                <strong>{p.price}</strong>
                <p>{p.desc}</p>
                <ul>
                  {p.items.map((x) => (
                    <li key={x}>
                      <Check size={16} />
                      {x}
                    </li>
                  ))}
                </ul>
                <button onClick={() => setOrder(`${p.name} — ${p.price}`)}>
                  {t.order}
                  <ArrowRight size={17} />
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="section maintenance">
          <div className="section-head">
            <span>03 / SUPPORT</span>
            <h2>{t.maintenanceTitle}</h2>
            <p>{t.maintenanceSub}</p>
          </div>
          <div className="maintenance-grid">
            {t.maintenance.map((m, i) => (
              <article key={m[0]}>
                <div>
                  <span>0{i + 1}</span>
                  <h3>{m[0]}</h3>
                </div>
                <strong>{m[1]}</strong>
                <p>{m[2]}</p>
                <button onClick={() => setOrder(`${m[0]} — ${m[1]}`)}>
                  {t.choose}
                  <ArrowRight size={16} />
                </button>
              </article>
            ))}
          </div>
        </section>

        <section id="portfolio" className="section portfolio">
          <div className="section-head">
            <span>04 / PORTFOLIO</span>
            <h2>{t.portfolioTitle}</h2>
            <p>{t.portfolioSub}</p>
          </div>
          <div className="portfolio-grid">
            {projects.map((p, i) => (
              <article key={p.name} style={{ "--accent": p.accent }}>
                <div className="site-preview">
                  <iframe
                    src={p.url}
                    title={`${p.name} preview`}
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    tabIndex="-1"
                  />
                  <div className="preview-cover" />
                </div>
                <div className="project-info">
                  <div>
                    <small>
                      0{i + 1} · {p.type}
                    </small>
                    <h3>{p.name}</h3>
                  </div>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={a11y.openProject(p.name)}
                    title={a11y.openProject(p.name)}
                  >
                    {t.view}
                    <ExternalLink size={16} aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="section about">
          <div className="about-photo">
            <div className="photo-ring">
              <img
                src={`${import.meta.env.BASE_URL}assets/veronika-profile.png`}
                alt="Veronika Petrushka"
                width="640"
                height="640"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="experience-badge">
              <strong>3</strong>
              <span>years of commercial experience</span>
            </div>
          </div>
          <div className="about-copy">
            <span>05 / ABOUT</span>
            <h2>{t.aboutTitle}</h2>
            <p>{t.aboutText}</p>
            <ul>
              {t.aboutPoints.map((x) => (
                <li key={x}>
                  <Check />
                  {x}
                </li>
              ))}
            </ul>
            <button className="secondary" onClick={() => setOrder("Custom project")}>
              {t.contact}
              <ArrowRight size={17} />
            </button>
          </div>
        </section>

        <section className="section process">
          <div className="section-head">
            <span>06 / PROCESS</span>
            <h2>{t.processTitle}</h2>
          </div>
          <div className="process-grid">
            {t.process.map((x) => (
              <article key={x[0]}>
                <span>{x[0]}</span>
                <h3>{x[1]}</h3>
                <p>{x[2]}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section reviews">
          <div className="section-head">
            <span>07 / REVIEWS</span>
            <h2>{t.reviewsTitle}</h2>
          </div>
          <div className="review-box">
            <button
              type="button"
              aria-label={a11y.previousReview}
              onClick={() =>
                setReview((review - 1 + t.reviews.length) % t.reviews.length)
              }
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <div>
              <div className="stars">★★★★★</div>
              <blockquote>“{t.reviews[review][2]}”</blockquote>
              <strong>{t.reviews[review][0]}</strong>
              <span>{t.reviews[review][1]}</span>
              <div className="dots">
                {t.reviews.map((_, i) => (
                  <i className={i === review ? "active" : ""} key={i} />
                ))}
              </div>
            </div>
            <button
              type="button"
              aria-label={a11y.nextReview}
              onClick={() => setReview((review + 1) % t.reviews.length)}
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
        </section>

        <section 
          id="faq" 
          className="section faq"
        >
          <div className="section-head">
            <span>08 / FAQ</span>
            <h2>{t.faqTitle}</h2>
            <p>{t.faqSub}</p>
          </div>
          <div className="faq-list">
            {t.faqs.map((item, i) => (
              <article
                className={openFaq === i ? "open" : ""}
                key={item[0]}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <b>{item[0]}</b>
                  <i>{openFaq === i ? "−" : "+"}</i>
                </button>
                <div className="faq-answer">
                  <p>{item[1]}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="faq-contact">
            <div>
              <span>LET'S TALK</span>
              <h3>{t.faqCtaTitle}</h3>
              <p>{t.faqCtaText}</p>
            </div>
            <button onClick={() => setOrder("FAQ — custom consultation")}>
              {t.faqCtaButton}
              <ArrowRight size={18} />
            </button>
          </div>
        </section>

        <section className="cta">
          <div>
            <h2>{t.ctaTitle}</h2>
            <p>{t.ctaText}</p>
          </div>
          <button onClick={() => setOrder("Custom project")}>
            {t.ctaButton}
            <ArrowRight />
          </button>
        </section>
      </main>

      <footer>
        <div className="footer-main">
          <a className="logo" href="#top" aria-label={a11y.home}>
            <img
              src={`${import.meta.env.BASE_URL}assets/android-chrome-192x192.png`}
              alt=""
              aria-hidden="true"
              width="192"
              height="192"
              loading="lazy"
              decoding="async"
              className="logo-image"
            />

            <div className="logo-text">
              <div className="logo-brand">
                <span className="logo-web">Web</span>
                <span className="logo-nika">Nika</span>
              </div>

              <div className="logo-studio">
                <span></span>
                STUDIO
                <span></span>
              </div>
            </div>
          </a>
          <p>{t.footerText}</p>
        </div>
        <div>
          <h4>Contact</h4>
          <a href="mailto:veronikapetrushka@gmail.com">
            <Mail />
            veronikapetrushka@gmail.com
          </a>
          <a href="tel:+48509334229">
            <Phone />
            +48 509 334 229
          </a>
          <span>
            <MapPin />
            Warsaw, Poland
          </span>
        </div>
        <div>
          <h4>Quick links</h4>
          {t.nav.map((x, i) => (
            <button
              key={x}
              onClick={() => scroll(["services", "pricing", "portfolio", "about", "faq"][i])}
            >
              {x}
            </button>
          ))}
        </div>
        <small>© 2026 Veronika Petrushka</small>
      </footer>

      {order && (
        <div className="modal-backdrop" onMouseDown={() => setOrder(null)}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close"
              onClick={() => setOrder(null)}
              aria-label={a11y.closeModal}
            >
              <X aria-hidden="true" />
            </button>
            <span className="pill">
              {t.formPlan}: {order}
            </span>
            <h2>{t.formTitle}</h2>
            <form onSubmit={submit}>
              <input type="hidden" name="plan" value={order} />
              <input
                className="form-honeypot"
                name="_honey"
                tabIndex="-1"
                autoComplete="off"
              />
              <label>
                {t.formName}
                <input name="name" required autoComplete="name" />
              </label>
              <label>
                {t.formEmail}
                <input name="email" type="email" required autoComplete="email" />
              </label>
              <label>
                {t.formPhone}
                <input name="phone" autoComplete="tel" />
              </label>
              <label>
                {t.formBusiness}
                <input name="business" required />
              </label>
              <label className="full">
                {t.formMessage}
                <textarea name="message" required rows="5" />
              </label>
              <button
                className="primary"
                type="submit"
                disabled={formStatus.state === "sending"}
              >
                {formStatus.state === "sending"
                  ? lang === "uk"
                    ? "Надсилання…"
                    : lang === "pl"
                    ? "Wysyłanie…"
                    : "Sending…"
                  : t.formSend}
                <ArrowRight />
              </button>
              {formStatus.message && (
                <p className={`form-status ${formStatus.state}`}>
                  {formStatus.message}
                </p>
              )}
            </form>
          </div>
        </div>
      )}
      <Analytics />
      <SpeedInsights />
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);