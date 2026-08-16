/* ------------------------------------------------------------------
   SECTIONS — the ten chapters
   Each chapter is a different shape on purpose. If two sections would
   have used the same layout, one of them was rewritten.
------------------------------------------------------------------ */

import React, { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { Btn, Head, Lines, Rich } from "./ui.jsx";
import { projects } from "./content.js";
import { isFinePointer } from "./lib/motion.js";

/* ==================================================================
   01 — HERO
   ================================================================== */

export function Hero({ t, onStart, onWork }) {
  return (
    <section className="hero wrap" id="top">
      <div className="hero__body" data-reveal="lift">
        <p className="hero__kicker"><i />{t.hero.kicker}</p>

        <h1 className="t-display hero__title">
          <Lines text={t.hero.title} />
        </h1>

        <p className="hero__lede"><Rich text={t.hero.lede} /></p>

        <div className="hero__actions">
          <Btn variant="primary" size="lg" onClick={onStart} data-cursor="START">
            {t.hero.primary}
          </Btn>
          <Btn variant="ghost" size="lg" onClick={onWork} icon={false} data-cursor="VIEW">
            {t.hero.secondary}
          </Btn>
        </div>

        <p className="hero__trust">
          <ShieldCheck size={15} strokeWidth={1.7} />
          {t.hero.trust}
        </p>
      </div>

      <div className="hero__metrics" data-reveal="lift" style={{ "--reveal-delay": "260ms" }}>
        {t.hero.metrics.map((metric) => (
          <div className="hero__metric" key={metric.label}>
            <small>{metric.label}</small>
            <b>{metric.value}</b>
            <span>{metric.note}</span>
          </div>
        ))}
      </div>

      <div className="hero__scroll" aria-hidden="true">
        {t.ui.scrollHint}
        <i />
      </div>
    </section>
  );
}

/* ==================================================================
   02 — PREMISE
   ================================================================== */

export function Premise({ t }) {
  return (
    <section className="chapter wrap" id="premise" data-depth="1">
      <div className="premise__grid">
        <div>
          <div className="head__index" data-reveal="lift">
            <b>02</b>
            <i />
            <span>{t.premise.kicker}</span>
          </div>
          <h2 className="t-h2" data-reveal="lift" style={{ "--reveal-delay": "80ms" }}>
            <Lines text={t.premise.title} />
          </h2>
          <p className="premise__body" data-reveal="lift" style={{ "--reveal-delay": "180ms" }}>
            <Rich text={t.premise.body} />
          </p>
        </div>

        <div className="premise__diptych" data-reveal="right">
          <article className="state state--before plate">
            <span className="state__label"><i />{t.premise.before.label}</span>
            <h3>{t.premise.before.title}</h3>
            <ul>
              {t.premise.before.points.map((point) => <li key={point}>{point}</li>)}
            </ul>
          </article>

          <div className="premise__arrow" aria-hidden="true">
            <ArrowDown size={15} strokeWidth={1.8} />
          </div>

          <article className="state state--after plate plate--ticked">
            <span className="state__label"><i />{t.premise.after.label}</span>
            <h3>{t.premise.after.title}</h3>
            <ul>
              {t.premise.after.points.map((point) => <li key={point}>{point}</li>)}
            </ul>
          </article>
        </div>
      </div>

      <p className="premise__note" data-reveal="lift">{t.premise.note}</p>
    </section>
  );
}

/* ==================================================================
   03 — CAPABILITIES (the dossier)
   ================================================================== */

export function Capabilities({ t, onStart }) {
  const [open, setOpen] = useState(-1);

  return (
    <section className="chapter wrap" id="capabilities" data-depth="1">
      <Head index="03" kicker={t.capabilities.kicker} title={t.capabilities.title} lede={t.capabilities.lede} split />

      <div className="dossier" data-reveal="lift">
        {t.capabilities.items.map((item, index) => (
          <button
            type="button"
            key={item.title}
            className={open === index ? "dossier__row is-open" : "dossier__row"}
            onClick={() => setOpen(open === index ? -1 : index)}
            aria-expanded={open === index}
          >
            <span className="dossier__head">
              <span className="dossier__n">{item.n}</span>
              <span className="dossier__title">{item.title}</span>
              <span className="dossier__mark" aria-hidden="true">
                <Plus size={15} strokeWidth={1.7} />
              </span>
            </span>

            <span className="dossier__panel">
              <span>
                <span className="dossier__inner">
                  <span className="dossier__body">{item.body}</span>
                  <span className="dossier__tags">
                    {item.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </span>
                </span>
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className="manifesto plate plate--ticked" data-reveal="lift">
        <div>
          <span className="manifesto__label">{t.capabilities.manifesto.label}</span>
          <p>{t.capabilities.manifesto.text}</p>
        </div>
        <Btn variant="ghost" onClick={onStart}>{t.capabilities.manifesto.cta}</Btn>
      </div>
    </section>
  );
}

/* ==================================================================
   04 — WORK
   ================================================================== */

/* The width we pretend the browser is, so the previewed sites lay out
   the way a desktop visitor would actually see them. */
const PREVIEW_WIDTH = 1440;

function ProjectFrame({ project, type, hint, label }) {
  const [live, setLive] = useState(false);
  const holder = useRef(null);
  const view = useRef(null);

  useEffect(() => {
    const node = holder.current;
    if (!node || isFinePointer()) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setLive(true);
        io.disconnect();
      },
      { rootMargin: "120px", threshold: 0.2 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  /* Measure the card and drive the iframe's scale from it. The iframe is
     laid out at a real desktop width and then shrunk to fit, so the
     preview shows the desktop breakpoint rather than the tablet one. */
  useEffect(() => {
    const node = view.current;
    if (!node || typeof ResizeObserver === "undefined") return undefined;

    const measure = () => {
      const { width, height } = node.getBoundingClientRect();
      if (!width || !height) return;
      const scale = width / PREVIEW_WIDTH;
      node.style.setProperty("--frame-vw", `${PREVIEW_WIDTH}px`);
      node.style.setProperty("--frame-scale", String(scale));
      node.style.setProperty("--frame-h", String(Math.round(height / scale)));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    return () => ro.disconnect();
  }, [live]);

  const host = project.url.replace("https://", "").replace(/\/$/, "");

  return (
    <div
      className="frame"
      ref={holder}
      style={{ "--frame-accent": project.accent }}
      onPointerEnter={() => { if (isFinePointer()) setLive(true); }}
    >
      <div className="frame__bar">
        <i /><i /><i />
        <span>{host}</span>
      </div>

      {live ? (
        <div className="frame__view" ref={view}>
          <iframe src={project.url} title={`${project.name} — live preview`} loading="lazy" tabIndex="-1" />
        </div>
      ) : (
        <div className="frame__placeholder">
          <em>{type}</em>
          <b>{project.name}</b>
          <small>{hint}</small>
        </div>
      )}

      <a className="frame__link" href={project.url} target="_blank" rel="noreferrer" aria-label={label} />
    </div>
  );
}

export function Work({ t, onStart }) {
  const railRef = useRef(null);
  const [active, setActive] = useState(0);

  const scrollToCard = (index) => {
    const rail = railRef.current;
    if (!rail) return;
    const cards = rail.querySelectorAll(".work__card");
    const card = cards[index];
    if (!card) return;
    rail.scrollTo({
      left: card.offsetLeft - (rail.clientWidth - card.offsetWidth) / 2,
      behavior: "smooth",
    });
  };

  const onScroll = () => {
    const rail = railRef.current;
    if (!rail) return;
    const centre = rail.scrollLeft + rail.clientWidth / 2;
    const cards = Array.from(rail.querySelectorAll(".work__card"));
    let best = 0;
    let bestDistance = Infinity;
    cards.forEach((card, index) => {
      const distance = Math.abs(centre - (card.offsetLeft + card.offsetWidth / 2));
      if (distance < bestDistance) {
        bestDistance = distance;
        best = index;
      }
    });
    setActive(best);
  };

  const step = (delta) => {
    const next = Math.max(0, Math.min(projects.length, active + delta));
    scrollToCard(next);
  };

  return (
    <section className="chapter wrap" id="work" data-depth="0.6">
      <Head index="04" kicker={t.work.kicker} title={t.work.title} lede={t.work.lede} split />

      <div className="work__rail" ref={railRef} onScroll={onScroll} data-reveal="lift">
        {projects.map((project, index) => (
          <article className="work__card" key={project.key}>
            <ProjectFrame
              project={project}
              type={t.work.types[project.key]}
              hint={t.work.hint}
              label={`${t.work.open} — ${project.name}`}
            />
            <div className="work__meta">
              <small>
                {t.work.counter} {String(index + 1).padStart(2, "0")} — {project.stack}
              </small>
              <h3>{project.name}</h3>
              <a href={project.url} target="_blank" rel="noreferrer">
                {t.work.open}
                <ExternalLink size={14} strokeWidth={1.7} />
              </a>
            </div>
          </article>
        ))}

        <article className="work__card">
          <div className="work__end">
            <h3>{t.work.cta}</h3>
            <Btn variant="ghost" onClick={onStart}>{t.work.ctaButton}</Btn>
          </div>
        </article>
      </div>

      <div className="work__nav">
        <div className="work__dots">
          {projects.map((project, index) => (
            <button
              type="button"
              key={project.key}
              className={active === index ? "is-active" : ""}
              onClick={() => scrollToCard(index)}
              aria-label={`${t.work.counter} ${index + 1} — ${project.name}`}
            />
          ))}
        </div>
        <div className="work__arrows">
          <button type="button" className="icon-btn" onClick={() => step(-1)} aria-label={t.ui.prev}>
            <ChevronLeft size={17} strokeWidth={1.7} />
          </button>
          <button type="button" className="icon-btn" onClick={() => step(1)} aria-label={t.ui.next}>
            <ChevronRight size={17} strokeWidth={1.7} />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ==================================================================
   05 — METHOD
   ================================================================== */

export function Method({ t, onStart }) {
  return (
    <section className="chapter wrap" id="method" data-depth="1">
      <div className="method__grid">
        <div className="method__sticky">
          <div className="head__index" data-reveal="lift">
            <b>05</b>
            <i />
            <span>{t.method.kicker}</span>
          </div>
          <h2 className="t-h2" data-reveal="lift" style={{ "--reveal-delay": "80ms" }}>
            <Lines text={t.method.title} />
          </h2>
          <p className="t-lede" data-reveal="lift" style={{ "--reveal-delay": "160ms" }}>
            {t.method.lede}
          </p>
          <div data-reveal="lift" style={{ "--reveal-delay": "240ms" }}>
            <Btn variant="ghost" onClick={onStart}>{t.ui.contact}</Btn>
          </div>
        </div>

        <div className="method__phases">
          {t.method.steps.map((step) => (
            <article className="method__phase" key={step.n} data-reveal="lift">
              <div className="method__spine">
                <b>{step.n}</b>
                <i />
              </div>
              <div className="method__copy">
                <h3>{step.title}</h3>
                <p>{step.body}</p>
                <div className="method__out">
                  <span><b>OUT</b> — {step.deliverable}</span>
                  <span><b>TIME</b> — {step.duration}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==================================================================
   06 — PRICING (+ the fit finder)
   ================================================================== */

function Finder({ t, onPick }) {
  const [step, setStep] = useState(-1);
  const [score, setScore] = useState(0);

  const questions = t.pricing.finder.questions;
  const plans = t.pricing.plans;

  const pick = (weight) => {
    const total = score + weight;
    if (step + 1 >= questions.length) {
      setScore(total);
      setStep(questions.length);
    } else {
      setScore(total);
      setStep(step + 1);
    }
  };

  const reset = () => {
    setStep(-1);
    setScore(0);
  };

  const resultIndex = score <= 1 ? 0 : score <= 4 ? 1 : 2;
  const result = plans[resultIndex];
  const done = step >= questions.length;
  const progress = done ? 1 : Math.max(0, step) / questions.length;

  return (
    <div className="finder plate plate--ticked" data-reveal="lift">
      {step < 0 ? (
        <div className="finder__top">
          <span className="finder__label">{t.pricing.finder.label}</span>
          <h3 className="t-h3">{t.pricing.finder.title}</h3>
          <p className="t-lede">{t.pricing.finder.intro}</p>
          <div>
            <Btn variant="primary" onClick={() => setStep(0)} data-cursor="BEGIN">
              {t.pricing.finder.start}
            </Btn>
          </div>
        </div>
      ) : null}

      {step >= 0 && !done ? (
        <div className="finder__q">
          <div className="finder__step">
            <span>{String(step + 1).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}</span>
            <i style={{ "--fp": progress }} />
          </div>
          <h3 className="finder__question">{questions[step].q}</h3>
          <div className="finder__options">
            {questions[step].options.map((option, index) => (
              <button type="button" key={option.label} onClick={() => pick(option.weight)}>
                {option.label}
                <span>{String.fromCharCode(65 + index)}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {done ? (
        <div className="finder__result">
          <span className="finder__label">{t.pricing.finder.resultLabel}</span>
          <div className="finder__result-name">{result.name}</div>
          <p className="t-lede">{result.for}</p>
          <p className="form__note">{t.pricing.finder.resultNote}</p>
          <div className="finder__actions">
            <Btn variant="primary" onClick={() => onPick(`${result.name} — ${result.price}`)}>
              {t.pricing.finder.cta}
            </Btn>
            <Btn variant="quiet" icon={false} magnetic={false} onClick={reset}>
              {t.pricing.finder.restart}
            </Btn>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function Pricing({ t, onPick }) {
  const [expanded, setExpanded] = useState({});
  const VISIBLE = 7;

  return (
    <section className="chapter wrap" id="pricing" data-depth="1">
      <Head index="06" kicker={t.pricing.kicker} title={t.pricing.title} lede={t.pricing.lede} split />

      <div className="plans" data-reveal="lift">
        {t.pricing.plans.map((plan, index) => {
          const isOpen = Boolean(expanded[plan.key]);
          const items = isOpen ? plan.items : plan.items.slice(0, VISIBLE);
          return (
            <article
              className={index === 1 ? "plan plate plate--ticked plan--featured" : "plan plate"}
              key={plan.key}
            >
              <div className="plan__head">
                <span className="plan__name">{plan.name}</span>
                <span className="plan__badge">{plan.badge}</span>
              </div>

              <div className="plan__price">{plan.price}</div>
              <p className="plan__for">{plan.for}</p>
              <p className="plan__desc">{plan.desc}</p>

              <div className="plan__eta">
                <span>{t.pricing.timeline}</span>
                <b>{plan.eta}</b>
              </div>

              <ul className="plan__items">
                {items.map((item) => (
                  <li key={item}>
                    <Check size={13} strokeWidth={2.4} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {plan.items.length > VISIBLE ? (
                <button
                  type="button"
                  className={isOpen ? "plan__more is-open" : "plan__more"}
                  onClick={() => setExpanded({ ...expanded, [plan.key]: !isOpen })}
                >
                  {isOpen
                    ? t.pricing.showLess
                    : `${t.pricing.showAll} ${plan.items.length} ${t.pricing.featuresWord}`}
                  <ChevronDown size={13} strokeWidth={2} />
                </button>
              ) : null}

              <Btn
                variant={index === 1 ? "primary" : "ghost"}
                className="btn--block"
                onClick={() => onPick(`${plan.name} — ${plan.price}`)}
                data-cursor="SELECT"
              >
                {t.pricing.order}
              </Btn>
            </article>
          );
        })}
      </div>

      <div className="guarantees" data-reveal="lift">
        {t.pricing.guarantees.map((line) => (
          <div key={line}>
            <ShieldCheck size={14} strokeWidth={1.8} />
            <span>{line}</span>
          </div>
        ))}
      </div>

      <Finder t={t} onPick={onPick} />
    </section>
  );
}

/* ==================================================================
   07 — AFTERCARE
   ================================================================== */

export function Care({ t, onPick }) {
  return (
    <section className="chapter chapter--tight wrap" id="care" data-depth="0.7">
      <Head index="07" kicker={t.care.kicker} title={t.care.title} lede={t.care.lede} split />

      <div className="care__list" data-reveal="lift">
        {t.care.items.map((item) => (
          <button
            type="button"
            className="care__row"
            key={item.name}
            onClick={() => onPick(`${item.name} — ${item.price}`)}
            data-cursor="CHOOSE"
          >
            <h3>{item.name}</h3>
            <p>{item.body}</p>
            <span className="care__price">
              <b>{item.price}</b>
              <small>{item.note}</small>
            </span>
            <span className="care__go" aria-hidden="true">
              <ArrowRight size={15} strokeWidth={1.8} />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

/* ==================================================================
   08 — STUDIO
   ================================================================== */

export function Studio({ t, onStart, portrait }) {
  return (
    <section className="chapter wrap" id="studio" data-depth="1">
      <div className="studio__grid">
        <figure className="portrait" data-reveal="scale" data-depth="0.5">
          <img src={portrait} alt="Veronika Petrushka, founder of WebNika Studio" loading="lazy" width="800" height="1000" />
          <figcaption className="portrait__badge">
            <b>{t.studio.badge.value}</b>
            <span>{t.studio.badge.label}</span>
          </figcaption>
        </figure>

        <div className="studio__copy">
          <div className="head__index" data-reveal="lift">
            <b>08</b>
            <i />
            <span>{t.studio.kicker}</span>
          </div>
          <h2 className="t-h2" data-reveal="lift" style={{ "--reveal-delay": "80ms" }}>
            <Lines text={t.studio.title} />
          </h2>
          <p data-reveal="lift" style={{ "--reveal-delay": "150ms" }}>{t.studio.body}</p>

          <div className="studio__points" data-reveal="lift" style={{ "--reveal-delay": "220ms" }}>
            {t.studio.points.map((point) => (
              <div key={point.n}>
                <b>{point.n}</b>
                <span>{point.label}</span>
              </div>
            ))}
          </div>

          <p className="studio__sign" data-reveal="lift">{t.studio.signature}</p>

          <div data-reveal="lift">
            <Btn variant="primary" onClick={onStart}>{t.studio.cta}</Btn>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==================================================================
   09 — SIGNALS + FAQ
   ================================================================== */

export function Signals({ t }) {
  const [index, setIndex] = useState(0);
  const reviews = t.signals.reviews;

  useEffect(() => {
    const id = setInterval(() => setIndex((v) => (v + 1) % reviews.length), 7200);
    return () => clearInterval(id);
  }, [reviews.length]);

  const review = reviews[index];

  return (
    <section className="chapter chapter--tight wrap" id="signals" data-depth="0.6">
      <div className="signals">
        <div className="head__index" data-reveal="lift">
          <b>09</b>
          <i />
          <span>{t.signals.kicker}</span>
        </div>

        <blockquote className="quote plate" data-reveal="lift">
          <p>{review.quote}</p>
          <footer>
            <span className="quote__who">
              <b>{review.name}</b>
              <span>{review.role}</span>
            </span>
            <span className="quote__nav">
              <span className="dots">
                {reviews.map((item, i) => (
                  <button
                    type="button"
                    key={item.name}
                    className={i === index ? "is-active" : ""}
                    onClick={() => setIndex(i)}
                    aria-label={item.name}
                  />
                ))}
              </span>
              <button type="button" className="icon-btn" onClick={() => setIndex((v) => (v - 1 + reviews.length) % reviews.length)} aria-label={t.ui.prev}>
                <ChevronLeft size={16} strokeWidth={1.7} />
              </button>
              <button type="button" className="icon-btn" onClick={() => setIndex((v) => (v + 1) % reviews.length)} aria-label={t.ui.next}>
                <ChevronRight size={16} strokeWidth={1.7} />
              </button>
            </span>
          </footer>
        </blockquote>
      </div>
    </section>
  );
}

export function Faq({ t, onStart }) {
  const [open, setOpen] = useState(0);

  return (
    <section className="chapter wrap" id="faq" data-depth="1">
      <div className="faq__grid">
        <div className="faq__side">
          <div className="head__index" data-reveal="lift">
            <b>10</b>
            <i />
            <span>{t.faq.kicker}</span>
          </div>
          <h2 className="t-h2" data-reveal="lift" style={{ "--reveal-delay": "80ms" }}>
            <Lines text={t.faq.title} />
          </h2>
          <p className="t-lede" data-reveal="lift" style={{ "--reveal-delay": "150ms" }}>{t.faq.lede}</p>

          <div className="plate" style={{ padding: "24px" }} data-reveal="lift">
            <h3 className="t-title">{t.faq.ctaTitle}</h3>
            <p style={{ margin: "10px 0 18px", color: "var(--text-2)", fontSize: "0.88rem", lineHeight: 1.6 }}>
              {t.faq.ctaText}
            </p>
            <Btn variant="ghost" onClick={onStart}>{t.faq.ctaButton}</Btn>
          </div>
        </div>

        <div className="faq__list" data-reveal="lift">
          {t.faq.items.map((item, index) => (
            <div className={open === index ? "faq__item is-open" : "faq__item"} key={item[0]}>
              <button
                type="button"
                className="faq__q"
                onClick={() => setOpen(open === index ? -1 : index)}
                aria-expanded={open === index}
              >
                <small>{String(index + 1).padStart(2, "0")}</small>
                <b>{item[0]}</b>
                <ChevronDown size={17} strokeWidth={1.8} />
              </button>
              <div className="faq__a">
                <div>
                  <p>{item[1]}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==================================================================
   10 — LAUNCH
   ================================================================== */

export function Launch({ t, onStart, email }) {
  return (
    <section className="chapter launch wrap" id="launch" data-depth="1">
      <span className="launch__kicker" data-reveal="lift">{t.launch.kicker}</span>
      <h2 className="t-display" data-reveal="lift" style={{ "--reveal-delay": "80ms" }}>
        <Lines text={t.launch.title} />
      </h2>
      <p data-reveal="lift" style={{ "--reveal-delay": "170ms" }}>{t.launch.body}</p>
      <div className="launch__actions" data-reveal="lift" style={{ "--reveal-delay": "250ms" }}>
        <Btn variant="primary" size="lg" onClick={onStart} data-cursor="START">
          {t.launch.button}
        </Btn>
        <Btn variant="quiet" href={`mailto:${email}`} icon={false} magnetic={false}>
          {t.launch.secondary}
          <ArrowUpRight size={15} strokeWidth={1.8} />
        </Btn>
      </div>
    </section>
  );
}
