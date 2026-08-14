import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Code2,
  ExternalLink,
  Globe2,
  Layers3,
  Mail,
  MapPin,
  Menu,
  Moon,
  Phone,
  ShieldCheck,
  Sparkles,
  Sun,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "./styles.css";
import { projects, copy } from "./content.js";

const sectionIds = ["services", "pricing", "portfolio", "about", "faq"];

const studioText = {
  en: {
    heroTitle: <> <span className="serif-accent">Ideas</span> become<br />digital presence.</>,
    heroText: <>I design and build <span className="text-highlight text-highlight--blue">custom websites</span> that turn a business into a <span className="text-highlight text-highlight--coral">clear, trusted</span> and <span className="text-highlight text-highlight--violet">memorable digital experience</span> — from first structure to final launch.</>,
    explore: "Explore the system",
    capabilities: <>Not a page.<br /><span>A complete digital system.</span></>,
    manifesto: "Strategy, structure, visual direction, development, launch and the details between them — one coherent process.",
    tellMe: "Tell me what you need",
    before: "Too many ideas.",
    beforeSub: "Scattered content / unclear flow / no visual system",
    after: "One clear presence.",
    afterSub: "Strategy / hierarchy / design / development / launch",
    unsure: "NOT SURE WHERE TO START?",
    afterLaunch: "AFTER LAUNCH",
    ready: "READY WHEN YOU ARE",
    previewHint: "Hover to load live preview",
  },
  uk: {
    heroTitle: <> <span className="serif-accent">Ідеї</span> стають<br />цифровою присутністю.</>,
    heroText: <>Створюю <span className="text-highlight text-highlight--blue">індивідуальні сайти</span>, які перетворюють бізнес на <span className="text-highlight text-highlight--coral">зрозумілий і надійний</span> та <span className="text-highlight text-highlight--violet">впізнаваний цифровий досвід</span> — від першої структури до запуску.</>,
    explore: "Дослідити систему",
    capabilities: <>Не просто сторінка.<br /><span>Цілісна цифрова система.</span></>,
    manifesto: "Стратегія, структура, візуальний напрям, розробка, запуск і всі деталі між ними — один цілісний процес.",
    tellMe: "Розкажіть, що вам потрібно",
    before: "Забагато розрізнених ідей.",
    beforeSub: "Контент без системи / нечіткий шлях / відсутня візуальна логіка",
    after: "Одна чітка присутність.",
    afterSub: "Стратегія / ієрархія / дизайн / розробка / запуск",
    unsure: "НЕ ЗНАЄТЕ, З ЧОГО ПОЧАТИ?",
    afterLaunch: "ПІСЛЯ ЗАПУСКУ",
    ready: "КОЛИ БУДЕТЕ ГОТОВІ",
    previewHint: "Наведіть, щоб завантажити live preview",
  },
  pl: {
    heroTitle: <> <span className="serif-accent">Pomysły</span> stają się<br />cyfrową obecnością.</>,
    heroText: <>Projektuję i tworzę <span className="text-highlight text-highlight--blue">indywidualne strony</span>, które zamieniają biznes w <span className="text-highlight text-highlight--coral">jasne i wiarygodne</span> oraz <span className="text-highlight text-highlight--violet">zapamiętywalne doświadczenie cyfrowe</span> — od struktury po finalny start.</>,
    explore: "Poznaj system",
    capabilities: <>Nie tylko strona.<br /><span>Kompletny system cyfrowy.</span></>,
    manifesto: "Strategia, struktura, kierunek wizualny, development, start i wszystkie detale pomiędzy — jeden spójny proces.",
    tellMe: "Opowiedz, czego potrzebujesz",
    before: "Za dużo luźnych pomysłów.",
    beforeSub: "Rozproszona treść / niejasny flow / brak systemu wizualnego",
    after: "Jedna spójna obecność.",
    afterSub: "Strategia / hierarchia / design / development / start",
    unsure: "NIE WIESZ, OD CZEGO ZACZĄĆ?",
    afterLaunch: "PO STARCIE",
    ready: "KIEDY BĘDZIESZ GOTOWY",
    previewHint: "Najedź, aby wczytać podgląd",
  },
};

function MagneticButton({ children, className = "", ...props }) {
  const ref = useRef(null);

  const onMove = (event) => {
    if (window.matchMedia("(hover: none)").matches || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    ref.current.style.setProperty("--mag-x", `${x * 0.08}px`);
    ref.current.style.setProperty("--mag-y", `${y * 0.08}px`);
  };

  const reset = () => {
    if (!ref.current) return;
    ref.current.style.setProperty("--mag-x", "0px");
    ref.current.style.setProperty("--mag-y", "0px");
  };

  return (
    <button
      ref={ref}
      className={`magnetic ${className}`}
      onPointerMove={onMove}
      onPointerLeave={reset}
      {...props}
    >
      <span>{children}</span>
    </button>
  );
}

function Scene3D() {
  return (
    <div className="scene-shell" aria-hidden="true">
      <div className="scene-glow scene-glow--a" />
      <div className="scene-glow scene-glow--b" />
      <div className="scene-grid" />
      <div className="scene-orbit scene-orbit--a" />
      <div className="scene-orbit scene-orbit--b" />
      <div className="scene-object">
        <div className="scene-frame frame-a">
          <span className="frame-kicker">STRATEGY</span>
          <strong>01</strong>
        </div>
        <div className="scene-frame frame-b">
          <span className="frame-kicker">DESIGN</span>
          <strong>02</strong>
        </div>
        <div className="scene-frame frame-c">
          <span className="frame-kicker">BUILD</span>
          <strong>03</strong>
        </div>
        <div className="scene-core">
          <span>WN</span>
          <small>DIGITAL OBJECT / 26</small>
        </div>
      </div>
      <div className="scene-note scene-note--one">
        <Sparkles size={15} />
        <div><small>VISUAL SYSTEM</small><b>Designed, not templated</b></div>
      </div>
      <div className="scene-note scene-note--two">
        <Layers3 size={15} />
        <div><small>FULL CYCLE</small><b>Idea → launch → growth</b></div>
      </div>
      <div className="scene-axis"><span>01</span><i /><span>03</span></div>
    </div>
  );
}


let threeLoaderPromise;
function loadThreeRuntime() {
  if (typeof window === "undefined") return Promise.reject(new Error("No browser runtime"));
  if (window.THREE) return Promise.resolve(window.THREE);
  if (threeLoaderPromise) return threeLoaderPromise;
  threeLoaderPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-webnika-three]');
    if (existing) {
      existing.addEventListener("load", () => resolve(window.THREE), { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.async = true;
    script.dataset.webnikaThree = "true";
    script.onload = () => window.THREE ? resolve(window.THREE) : reject(new Error("Three.js unavailable"));
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return threeLoaderPromise;
}

function ThreeMicroScene({ variant = "services" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = navigator.connection?.saveData;
    const narrow = window.innerWidth < 820;
    if (reduceMotion || saveData || narrow) return;

    let cancelled = false;
    let started = false;
    let active = false;
    let raf = 0;
    let renderer;
    let scene;
    let camera;
    let group;
    let resizeObserver;
    let lastFrame = 0;
    let targetX = 0;
    let targetY = 0;

    const disposeMaterial = (material) => {
      if (Array.isArray(material)) material.forEach((m) => m.dispose?.());
      else material?.dispose?.();
    };

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const animate = (time = 0) => {
      if (!active || cancelled || !renderer || !scene || !camera || !group) {
        raf = 0;
        return;
      }
      // Cap this decorative WebGL layer at ~30fps; visual depth stays smooth without stealing main-thread time.
      if (time - lastFrame >= 32) {
        lastFrame = time;
        group.rotation.x += (targetY - group.rotation.x) * 0.06;
        group.rotation.y += (targetX - group.rotation.y) * 0.06;
        group.rotation.z += 0.0015;
        renderer.render(scene, camera);
      }
      raf = requestAnimationFrame(animate);
    };

    const startLoop = () => {
      if (!raf && active && !document.hidden) raf = requestAnimationFrame(animate);
    };

    const setup = async () => {
      if (started || cancelled) return;
      started = true;
      try {
        const THREE = await loadThreeRuntime();
        if (cancelled || !THREE) return;
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
        camera.position.set(0, 0, 6.2);

        renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "low-power" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.2));
        renderer.setClearColor(0x000000, 0);
        mount.appendChild(renderer.domElement);
        mount.classList.add("three-micro--ready");

        scene.add(new THREE.AmbientLight(0xffffff, 0.8));
        const key = new THREE.DirectionalLight(variant === "pricing" ? 0x9a8cff : 0xff6d4a, 1.25);
        key.position.set(3, 4, 5);
        scene.add(key);
        const rim = new THREE.PointLight(variant === "pricing" ? 0xffb36a : 0xb7f0c1, 1.2, 12);
        rim.position.set(-3, -1, 3);
        scene.add(rim);

        group = new THREE.Group();
        scene.add(group);
        const colors = variant === "pricing" ? [0x9a8cff, 0xff6d4a, 0xffb36a] : [0xff6d4a, 0xb7f0c1, 0x9a8cff];
        const defs = [
          { x: -1.05, y: 0.25, z: -0.45, r: -0.32, w: 1.8, h: 1.12 },
          { x: 0.15, y: -0.15, z: 0.05, r: 0.18, w: 1.72, h: 1.08 },
          { x: 1.05, y: 0.36, z: 0.55, r: 0.38, w: 1.42, h: 0.92 },
        ];
        defs.forEach((def, index) => {
          const geometry = new THREE.BoxGeometry(def.w, def.h, 0.08);
          const material = new THREE.MeshStandardMaterial({
            color: colors[index],
            transparent: true,
            opacity: index === 2 ? 0.78 : 0.52,
            roughness: 0.38,
            metalness: 0.14,
          });
          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(def.x, def.y, def.z);
          mesh.rotation.set(index * 0.08, def.r, index === 1 ? -0.12 : 0.08);
          mesh.userData.geometry = geometry;
          group.add(mesh);

          const edges = new THREE.EdgesGeometry(geometry);
          const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.22 }));
          line.position.copy(mesh.position);
          line.rotation.copy(mesh.rotation);
          line.userData.geometry = edges;
          group.add(line);
        });

        const ringGeo = new THREE.TorusGeometry(1.95, 0.012, 6, 48);
        const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: colors[1], transparent: true, opacity: 0.32 }));
        ring.rotation.x = 0.98;
        ring.rotation.z = -0.28;
        ring.userData.geometry = ringGeo;
        group.add(ring);

        const resize = () => {
          if (!renderer || !camera) return;
          const width = Math.max(1, mount.clientWidth);
          const height = Math.max(1, mount.clientHeight);
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          if (active) renderer.render(scene, camera);
        };
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(mount);
        resize();
        startLoop();
      } catch {
        mount.classList.add("three-micro--fallback");
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      if (active) {
        setup();
        startLoop();
      } else stop();
    }, { rootMargin: "20% 0px 20% 0px" });
    observer.observe(mount);

    const pointer = (event) => {
      const rect = mount.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.42;
      targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 0.25;
    };
    const reset = () => { targetX = 0; targetY = 0; };
    const visibility = () => document.hidden ? stop() : startLoop();
    mount.addEventListener("pointermove", pointer, { passive: true });
    mount.addEventListener("pointerleave", reset);
    document.addEventListener("visibilitychange", visibility);

    return () => {
      cancelled = true;
      active = false;
      stop();
      observer.disconnect();
      resizeObserver?.disconnect();
      mount.removeEventListener("pointermove", pointer);
      mount.removeEventListener("pointerleave", reset);
      document.removeEventListener("visibilitychange", visibility);
      if (group) {
        group.traverse((obj) => {
          obj.userData?.geometry?.dispose?.();
          disposeMaterial(obj.material);
        });
      }
      renderer?.dispose?.();
      renderer?.forceContextLoss?.();
      renderer?.domElement?.remove?.();
      mount.classList.remove("three-micro--ready");
    };
  }, [variant]);

  return <div ref={mountRef} className={`three-micro three-micro--${variant}`} aria-hidden="true"><span className="three-micro__fallback">3D</span></div>;
}


function ProjectBrowser({ project, label, hint }) {
  const [loaded, setLoaded] = useState(false);
  const browserRef = useRef(null);

  useEffect(() => {
    const node = browserRef.current;
    if (!node || window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        // Mobile/tablet: only create the remote frame when this card is actually on screen.
        setLoaded(true);
        observer.disconnect();
      }
    }, { rootMargin: "80px", threshold: 0.15 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={browserRef}
      className="project-browser"
      onPointerEnter={() => {
        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) setLoaded(true);
      }}
    >
      <div className="project-browser__top"><i /><i /><i /><span>{project.url.replace("https://", "")}</span></div>
      {loaded ? (
        <iframe src={project.url} title={`${project.name} preview`} loading="lazy" tabIndex="-1" />
      ) : (
        <div className="project-browser__placeholder" style={{ "--preview-accent": project.accent }}>
          <div className="preview-grid" />
          <span className="preview-kicker">LIVE CASE / {project.type}</span>
          <strong>{project.name}</strong>
          <div className="preview-window"><i /><i /><i /><b /></div>
          <small>{hint}</small>
        </div>
      )}
      <a href={project.url} target="_blank" rel="noreferrer" aria-label={label} />
    </div>
  );
}

function App() {
  const [lang, setLang] = useState(localStorage.getItem("vp-lang") || "en");
  const [dark, setDark] = useState(() => localStorage.getItem("vp-theme") !== "light");
  const [menu, setMenu] = useState(false);
  const [order, setOrder] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);
  const [review, setReview] = useState(0);
  const [projectPage, setProjectPage] = useState(0);
  const [projectsPerPage, setProjectsPerPage] = useState(3);
  const [mobileProject, setMobileProject] = useState(0);
  const [isMobilePortfolio, setIsMobilePortfolio] = useState(() => window.innerWidth <= 700);
  const [formStatus, setFormStatus] = useState({ state: "idle", message: "" });
  const progressRef = useRef(null);
  const heroActiveRef = useRef(true);
  const t = copy[lang];
  const s = studioText[lang];
  const [expandedPlans, setExpandedPlans] = useState({});

  const [activePlan, setActivePlan] = useState(0);
  const planGridRef = useRef(null);
  const pricingScrollTimer = useRef(null);

  const [isMobilePricing, setIsMobilePricing] = useState(
    () => window.innerWidth <= 700
  );

  const pricingItems = isMobilePricing
    ? [
        t.plans[t.plans.length - 1],
        ...t.plans,
        t.plans[0],
      ]
    : t.plans;

  const getRealPlanIndex = (sliderIndex) => {
    // Desktop / tablet: no cloned cards
    if (!isMobilePricing) {
      return sliderIndex;
    }

    // Mobile circular carousel
    if (sliderIndex === 0) {
      return t.plans.length - 1;
    }

    if (sliderIndex === pricingItems.length - 1) {
      return 0;
    }

    return sliderIndex - 1;
  };

  const scrollToPricingCard = (
    sliderIndex,
    behavior = "smooth"
  ) => {
    const slider = planGridRef.current;

    if (!slider) return;

    const cards =
      slider.querySelectorAll(".plan-card");

    const card = cards[sliderIndex];

    if (!card) return;

    const target =
      card.offsetLeft -
      (slider.clientWidth - card.offsetWidth) / 2;

    slider.scrollTo({
      left: target,
      behavior,
    });
  };

  const goToPlan = (realIndex) => {
    setActivePlan(realIndex);

    if (!isMobilePricing) {
      return;
    }

    scrollToPricingCard(
      realIndex + 1
    );
  };
  
  const handlePricingScroll = () => {
    if (!isMobilePricing) return;

    const slider = planGridRef.current;

    if (!slider) return;

    clearTimeout(pricingScrollTimer.current);

    pricingScrollTimer.current = setTimeout(() => {
      const cards = slider.querySelectorAll(".plan-card");

      const sliderCenter =
        slider.scrollLeft +
        slider.clientWidth / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;

      cards.forEach((card, index) => {
        const cardCenter =
          card.offsetLeft +
          card.offsetWidth / 2;

        const distance = Math.abs(
          sliderCenter - cardCenter
        );

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      const lastIndex =
        pricingItems.length - 1;

      // cloned PRO → real PRO
      if (closestIndex === 0) {
        setActivePlan(
          t.plans.length - 1
        );

        requestAnimationFrame(() => {
          scrollToPricingCard(
            t.plans.length,
            "auto"
          );
        });

        return;
      }

      // cloned LIGHT → real LIGHT
      if (closestIndex === lastIndex) {
        setActivePlan(0);

        requestAnimationFrame(() => {
          scrollToPricingCard(
            1,
            "auto"
          );
        });

        return;
      }

      setActivePlan(
        getRealPlanIndex(
          closestIndex
        )
      );
    }, 100);
  };

  const a11y = useMemo(() => ({
    en: { home: "WebNika Studio home", menu: "Toggle navigation", theme: "Toggle theme", project: (name) => `Open ${name}` },
    uk: { home: "Головна WebNika Studio", menu: "Відкрити навігацію", theme: "Змінити тему", project: (name) => `Відкрити ${name}` },
    pl: { home: "Strona główna WebNika Studio", menu: "Otwórz nawigację", theme: "Zmień motyw", project: (name) => `Otwórz ${name}` },
  }[lang]), [lang]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 700px)");

    const updatePricingMode = () => {
      setIsMobilePricing(media.matches);
    };

    updatePricingMode();

    media.addEventListener("change", updatePricingMode);

    return () => {
      media.removeEventListener("change", updatePricingMode);
    };
  }, []);

  useEffect(() => {
    const slider = planGridRef.current;

    if (!slider) return;

    // Desktop/tablet must behave as normal grid
    if (!isMobilePricing) {
      slider.scrollLeft = 0;
      return;
    }

    const frame =
      requestAnimationFrame(() => {
        // Index 0 is cloned PRO,
        // index 1 is the real LIGHT.
        scrollToPricingCard(
          1,
          "auto"
        );
      });

    return () => {
      cancelAnimationFrame(frame);

      clearTimeout(
        pricingScrollTimer.current
      );
    };
  }, [isMobilePricing, lang]);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("vp-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => localStorage.setItem("vp-lang", lang), [lang]);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
    };
    const requestUpdate = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const hero = document.querySelector(".hero");
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => {
      heroActiveRef.current = entry.isIntersecting;
      hero.classList.toggle("is-hero-active", entry.isIntersecting);
    }, { rootMargin: "15% 0px 15% 0px" });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let raf = 0;
    let latest = null;
    const move = (event) => {
      if (!heroActiveRef.current) return;
      latest = event;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (!latest) return;
        const x = latest.clientX / window.innerWidth - 0.5;
        const y = latest.clientY / window.innerHeight - 0.5;
        document.documentElement.style.setProperty("--scene-rx", `${y * -8}deg`);
        document.documentElement.style.setProperty("--scene-ry", `${x * 11}deg`);
        document.documentElement.style.setProperty("--note-x", `${x * 14}px`);
        document.documentElement.style.setProperty("--note-y", `${y * 10}px`);
        document.documentElement.style.setProperty("--note-x-inv", `${x * -14}px`);
        document.documentElement.style.setProperty("--note-y-inv", `${y * -10}px`);
      });
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const nodes = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -7% 0px" });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [lang, projectPage]);

  useEffect(() => {
    const nodes = document.querySelectorAll("[data-motion]");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle("is-motion-active", entry.isIntersecting));
    }, { rootMargin: "12% 0px 12% 0px", threshold: 0 });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = document.querySelector(".cinematic-cursor__dot");
    const ring = document.querySelector(".cinematic-cursor__ring");
    const label = document.querySelector(".cinematic-cursor__label");
    if (!dot || !ring || !label) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const follow = () => {
      const dx = mx - rx;
      const dy = my - ry;
      rx += dx * 0.44;
      ry += dy * 0.44;
      if (Math.abs(dx) < 0.08 && Math.abs(dy) < 0.08) {
        rx = mx;
        ry = my;
      }
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      if (rx !== mx || ry !== my) raf = requestAnimationFrame(follow);
      else raf = 0;
    };

    const move = (event) => {
      mx = event.clientX;
      my = event.clientY;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      label.style.transform = `translate3d(${mx + 22}px, ${my + 22}px, 0)`;
      if (!raf && !document.hidden) raf = requestAnimationFrame(follow);
    };

    const over = (event) => {
      const node = event.target instanceof Element ? event.target : null;
      const target = node?.closest("[data-cursor], a, button, .plan-card, .project-card, .service-tile, .scene-shell");
      const active = Boolean(target);
      ring.classList.toggle("is-active", active);
      dot.classList.toggle("is-active", active);
      if (active) {
        let text = target?.dataset?.cursor;
        if (!text) {
          if (target?.classList?.contains("plan-card")) text = "SELECT";
          else if (target?.classList?.contains("project-card")) text = "OPEN";
          else if (target?.classList?.contains("scene-shell")) text = "MOVE";
          else if (target?.tagName === "BUTTON") text = "CLICK";
          else if (target?.tagName === "A") text = "OPEN";
          else text = "EXPLORE";
        }
        label.textContent = text;
        label.classList.add("is-visible");
      } else {
        label.classList.remove("is-visible");
      }
    };

    const visibility = () => {
      if (document.hidden && raf) { cancelAnimationFrame(raf); raf = 0; }
      if (!document.hidden && !raf && (rx !== mx || ry !== my)) raf = requestAnimationFrame(follow);
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("visibilitychange", visibility);

    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("visibilitychange", visibility);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowMotion = reduceMotion || window.matchMedia("(hover: none)").matches;
    if (lowMotion) return;

    const sections = Array.from(document.querySelectorAll("[data-depth]"));
    const cards = Array.from(document.querySelectorAll(".plan-card"));
    const visibleSections = new Set();
    let scrollRaf = 0;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleSections.add(entry.target);
        else visibleSections.delete(entry.target);
      });
      requestDepth();
    }, { rootMargin: "18% 0px 18% 0px", threshold: 0 });
    sections.forEach((section) => observer.observe(section));

    const updateDepth = () => {
      scrollRaf = 0;
      const vh = window.innerHeight || 1;
      visibleSections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const p = Math.max(-1, Math.min(1, (center - vh / 2) / vh));
        section.style.setProperty("--depth-y", `${p * 12}px`);
        section.style.setProperty("--depth-y-inv", `${p * -9}px`);
        section.style.setProperty("--depth-x", `${p * 6}px`);
        section.style.setProperty("--depth-rot", `${p * 0.55}deg`);
      });
    };

    function requestDepth() {
      if (!scrollRaf) scrollRaf = requestAnimationFrame(updateDepth);
    }

    const cardRafs = new WeakMap();
    const tilt = (event) => {
      const card = event.currentTarget;
      if (cardRafs.get(card)) return;
      const clientX = event.clientX;
      const clientY = event.clientY;
      const id = requestAnimationFrame(() => {
        cardRafs.delete(card);
        const rect = card.getBoundingClientRect();
        const px = (clientX - rect.left) / rect.width;
        const py = (clientY - rect.top) / rect.height;
        card.style.setProperty("--card-ry", `${(px - 0.5) * 5}deg`);
        card.style.setProperty("--card-rx", `${(0.5 - py) * 4}deg`);
        card.style.setProperty("--glow-x", `${px * 100}%`);
        card.style.setProperty("--glow-y", `${py * 100}%`);
      });
      cardRafs.set(card, id);
    };
    const untilt = (event) => {
      const card = event.currentTarget;
      const id = cardRafs.get(card);
      if (id) cancelAnimationFrame(id);
      cardRafs.delete(card);
      card.style.setProperty("--card-ry", "0deg");
      card.style.setProperty("--card-rx", "0deg");
    };

    cards.forEach((card) => {
      card.addEventListener("pointermove", tilt, { passive: true });
      card.addEventListener("pointerleave", untilt);
    });
    window.addEventListener("scroll", requestDepth, { passive: true });
    window.addEventListener("resize", requestDepth, { passive: true });
    requestDepth();

    return () => {
      observer.disconnect();
      cards.forEach((card) => {
        card.removeEventListener("pointermove", tilt);
        card.removeEventListener("pointerleave", untilt);
        const id = cardRafs.get(card);
        if (id) cancelAnimationFrame(id);
      });
      window.removeEventListener("scroll", requestDepth);
      window.removeEventListener("resize", requestDepth);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
    };
  }, [lang, projectPage]);

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      setIsMobilePortfolio(width <= 700);
      setProjectsPerPage(width <= 700 ? projects.length : width <= 1080 ? 2 : 3);
      setProjectPage(0);
      setMobileProject(0);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setReview((value) => (value + 1) % t.reviews.length), 6500);
    return () => clearInterval(id);
  }, [lang, t.reviews.length]);

  const scroll = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenu(false);
  };

  const submit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    if (fd.get("_honey")) return;

    setFormStatus({ state: "sending", message: lang === "uk" ? "Надсилання…" : lang === "pl" ? "Wysyłanie…" : "Sending…" });

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
      const response = await fetch("https://formsubmit.co/ajax/21f8a6c0d50d9b386b6b2cedd3034dcc", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false) throw new Error("Submission failed");
      form.reset();
      setFormStatus({
        state: "success",
        message: lang === "uk" ? "Дякую! Запит надіслано. Я зв’яжуся з вами найближчим часом." : lang === "pl" ? "Dziękuję! Zapytanie zostało wysłane. Skontaktuję się wkrótce." : "Thank you! Your request was sent. I will contact you shortly.",
      });
    } catch {
      setFormStatus({
        state: "error",
        message: lang === "uk" ? "Не вдалося надіслати форму. Напишіть мені напряму." : lang === "pl" ? "Nie udało się wysłać formularza. Napisz do mnie bezpośrednio." : "The form could not be sent. Please contact me directly.",
      });
    }
  };

  const pageCount = Math.ceil(projects.length / projectsPerPage);
  const visibleProjects = projects.slice(projectPage * projectsPerPage, projectPage * projectsPerPage + projectsPerPage);

  const handleProjectsScroll = (event) => {
    const card = event.currentTarget.querySelector(".project-card");
    if (!card) return;
    const gap = Number.parseFloat(getComputedStyle(event.currentTarget).gap) || 0;
    setMobileProject(Math.round(event.currentTarget.scrollLeft / (card.getBoundingClientRect().width + gap)));
  };

  const goMobileProject = (index) => {
    const slider = document.querySelector(".project-slider");
    const card = slider?.querySelector(".project-card");
    if (!slider || !card) return;
    const gap = Number.parseFloat(getComputedStyle(slider).gap) || 0;
    slider.scrollTo({ left: index * (card.getBoundingClientRect().width + gap), behavior: "smooth" });
    setMobileProject(index);
  };

  return (
    <>
      <div className="cinematic-cursor" aria-hidden="true">
        <span className="cinematic-cursor__dot" />
        <span className="cinematic-cursor__ring" />
        <span className="cinematic-cursor__label">EXPLORE</span>
      </div>
      <div className="grain" aria-hidden="true" />
      <div className="progress"><span ref={progressRef} /></div>

      <header className="site-header">
        <a className="brand" href="#top" aria-label={a11y.home}>
          <span className="brand-mark">WN</span>
          <span className="brand-copy"><b>WebNika</b><small>DIGITAL STUDIO / WARSAW</small></span>
        </a>

        <nav className={menu ? "open" : ""}>
          {t.nav.map((item, index) => <button key={item} onClick={() => scroll(sectionIds[index])}>{item}</button>)}
        </nav>

        <div className="header-tools">
          <select value={lang} onChange={(e) => setLang(e.target.value)} aria-label="Language">
            <option value="en">EN</option>
            <option value="uk">UA</option>
            <option value="pl">PL</option>
          </select>
          <button className="icon-control" onClick={() => setDark(!dark)} aria-label={a11y.theme}>{dark ? <Sun size={17} /> : <Moon size={17} />}</button>
          <MagneticButton className="header-cta" onClick={() => setOrder("Custom project")}>{t.contact}<ArrowUpRightIcon /></MagneticButton>
          <button className="menu-control" onClick={() => setMenu(!menu)} aria-label={a11y.menu}>{menu ? <X /> : <Menu />}</button>
        </div>
      </header>

      <main id="top">
        <section className="hero section-frame">
          <div className="hero-copy" data-reveal>
            <div className="eyebrow"><span>01</span>{t.heroTag}</div>
            <h1>{s.heroTitle}</h1>
            <p>{s.heroText}</p>
            <div className="hero-actions">
              <MagneticButton className="button button--accent" onClick={() => setOrder("Custom project")}>{t.contact}<ArrowRight size={17} /></MagneticButton>
              <button className="button button--ghost" onClick={() => scroll("portfolio")}>{t.heroSecondary}<ArrowDownRight size={17} /></button>
            </div>
            <div className="hero-proof"><ShieldCheck size={17} /><span>{t.trust}</span></div>
          </div>

          <div className="hero-scene" data-reveal data-reveal-style="scale" data-cursor="MOVE / EXPLORE"><Scene3D /></div>

          <div className="hero-metrics" data-reveal>
            <div><small>PROJECTS</small><strong>10+</strong><span>{t.stats[0]}</span></div>
            <div><small>RESPONSIVE</small><strong>100%</strong><span>{t.stats[1]}</span></div>
            <div><small>LANGUAGE</small><strong>04</strong><span>{t.stats[2]}</span></div>
            <button onClick={() => scroll("services")}><span>{s.explore}</span><ArrowDownRight size={18} /></button>
          </div>
        </section>

        <div className="ticker" data-motion aria-hidden="true">
          <div className="ticker-track">{[...t.marquee, ...t.marquee].map((item, index) => <span key={`${item}-${index}`}>{item}<i>✦</i></span>)}</div>
        </div>

        <section id="services" className="section-frame section-block services" data-depth="pull">
          <div className="section-intro" data-reveal data-reveal-style="left">
            <div className="section-index">02 / CAPABILITIES</div>
            <h2>{s.capabilities}</h2>
            <p>{t.servicesSub}</p>
          </div>
          <div className="service-bento" data-reveal data-reveal-style="lift">
            {t.serviceCards.map((service, index) => (
              <article key={service[0]} className={`service-tile service-tile--${index + 1}`} data-cursor="EXPLORE">
                <div className="service-top"><span>0{index + 1}</span>{[<WandSparkles />, <Globe2 />, <Code2 />, <Zap />][index]}</div>
                <h3>{service[0]}</h3>
                <p>{service[1]}</p>
                <div className="service-line"><i /></div>
              </article>
            ))}
            <article className="service-manifesto">
              <ThreeMicroScene variant="services" />
              <span>FULL CYCLE / NO HAND-OFFS</span>
              <p>{s.manifesto}</p>
              <button onClick={() => setOrder("Custom project")}>{s.tellMe} <ArrowRight size={16} /></button>
            </article>
          </div>
        </section>

        <section id="portfolio" className="section-frame section-block work" data-depth="float">
          <div className="section-intro section-intro--split" data-reveal data-reveal-style="right">
            <div><div className="section-index">03 / SELECTED WORK</div><h2>{t.portfolioTitle}</h2></div>
            <p>{t.portfolioSub}</p>
          </div>

          <div className="project-slider" data-reveal data-reveal-style="lift" onScroll={handleProjectsScroll}>
            {(isMobilePortfolio ? projects : visibleProjects).map((project, index) => {
              const realIndex = isMobilePortfolio ? index : projectPage * projectsPerPage + index;
              return (
                <article className="project-card" key={project.name} style={{ "--project-accent": project.accent }} data-cursor="OPEN PROJECT">
                  <ProjectBrowser project={project} label={a11y.project(project.name)} hint={s.previewHint} />
                  <div className="project-meta">
                    <span>{String(realIndex + 1).padStart(2, "0")} / {project.type}</span>
                    <h3>{project.name}</h3>
                    <a href={project.url} target="_blank" rel="noreferrer">{t.view}<ExternalLink size={16} /></a>
                  </div>
                </article>
              );
            })}
          </div>

          {!isMobilePortfolio && pageCount > 1 && (
            <div className="project-pagination">
              <button onClick={() => setProjectPage((v) => (v - 1 + pageCount) % pageCount)}><ChevronLeft /></button>
              <div>{Array.from({ length: pageCount }, (_, index) => <button className={index === projectPage ? "active" : ""} key={index} onClick={() => setProjectPage(index)}>{String(index + 1).padStart(2, "0")}</button>)}</div>
              <button onClick={() => setProjectPage((v) => (v + 1) % pageCount)}><ChevronRight /></button>
            </div>
          )}

          {isMobilePortfolio && <div className="project-dots">{projects.map((project, index) => <button key={project.name} className={mobileProject === index ? "active" : ""} onClick={() => goMobileProject(index)} aria-label={`Show ${project.name}`} />)}</div>}
        </section>

        <section className="story section-frame" data-depth="pull">
          <div className="story-visual" data-reveal data-reveal-style="tilt">
            <div className="story-orbit" />
            <div className="story-card story-card--raw"><small>BEFORE</small><b>{s.before}</b><span>{s.beforeSub}</span></div>
            <div className="story-card story-card--final"><small>AFTER</small><b>{s.after}</b><span>{s.afterSub}</span></div>
            <div className="story-arrow"><ArrowRight /></div>
          </div>
          <div className="story-copy" data-reveal data-reveal-style="right">
            <div className="section-index">04 / THE METHOD</div>
            <h2>{t.designPromiseTitle}</h2>
            <p>{t.designPromiseText}</p>
            <ul>{t.designPromisePoints.map((point) => <li key={point}><Check size={16} />{point}</li>)}</ul>
          </div>
        </section>

        <section className="process section-frame section-block" data-depth="float">
          <div className="process-title" data-reveal data-reveal-style="left"><div className="section-index">05 / PROCESS</div><h2>{t.processTitle}</h2></div>
          <div className="process-list" data-reveal data-reveal-style="right">
            {t.process.map((step, index) => (
              <article key={step[0]}>
                <span>{step[0]}</span><div><small>PHASE {String(index + 1).padStart(2, "0")}</small><h3>{step[1]}</h3><p>{step[2]}</p></div><ArrowDownRight />
              </article>
            ))}
          </div>
        </section>

        <section id="pricing" className="section-frame section-block pricing" data-depth="pull">
          <div className="section-intro section-intro--split pricing-intro" data-reveal data-reveal-style="scale">
            <div><div className="section-index">06 / INVESTMENT</div><h2>{t.pricingTitle}</h2></div>
            <p>{t.pricingSub}</p>
            <ThreeMicroScene variant="pricing" />
          </div>
          <div
            className="plan-grid"
            ref={planGridRef}
            onScroll={
              isMobilePricing
                ? handlePricingScroll
                : undefined
            }
            data-reveal
            data-reveal-style="lift"
          >
            {pricingItems.map(
              (plan, sliderIndex) => {
                const realIndex =
                  getRealPlanIndex(sliderIndex);

                const isFeatured =
                  realIndex === 1;

                return (
                  <article
                    key={`${plan.name}-${sliderIndex}`}
                    className={
                      isFeatured
                        ? "plan-card plan-card--featured"
                        : "plan-card"
                    }
                    data-cursor="SELECT PLAN"
                    data-plan-index={realIndex}
                  >
                    <div className="plan-head">
                      <span>
                        0{realIndex + 1}
                      </span>

                      <small>
                        {plan.badge}
                      </small>
                    </div>

                    <h3>{plan.name}</h3>

                    <strong>
                      {plan.price}
                    </strong>

                    <p>{plan.desc}</p>

                    <div className="plan-eta">
                      <span>TIMELINE</span>

                      <b>{plan.eta}</b>
                    </div>

                    <ul className="plan-features">
                      {(expandedPlans[plan.name]
                        ? plan.items
                        : plan.items.slice(0, 7)
                      ).map((item) => (
                        <li key={item}>
                          <Check size={15} />

                          <span>
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {plan.items.length > 7 && (
                      <button
                        type="button"
                        className="plan-more"
                        onClick={(event) => {
                          event.stopPropagation();

                          setExpandedPlans(
                            (prev) => ({
                              ...prev,

                              [plan.name]:
                                !prev[
                                  plan.name
                                ],
                            })
                          );
                        }}
                      >
                        <span>
                          {expandedPlans[
                            plan.name
                          ]
                            ? "Show less"
                            : `View all ${plan.items.length} features`}
                        </span>

                        <span className="plan-more-arrow">
                          {expandedPlans[
                            plan.name
                          ]
                            ? "↑"
                            : "↓"}
                        </span>
                      </button>
                    )}

                    <MagneticButton
                      className="plan-button"
                      onClick={() =>
                        setOrder(
                          `${plan.name} — ${plan.price}`
                        )
                      }
                    >
                      {t.order}

                      <ArrowRight size={16} />
                    </MagneticButton>
                  </article>
                );
              }
            )}
          </div>

          <div className="pricing-dots">
            {t.plans.map(
              (plan, index) => (
                <button
                  key={plan.name}
                  type="button"
                  className={
                    activePlan === index
                      ? "pricing-dot is-active"
                      : "pricing-dot"
                  }
                  onClick={() =>
                    goToPlan(index)
                  }
                  aria-label={`Show ${plan.name} plan`}
                  aria-current={
                    activePlan === index
                      ? "true"
                      : undefined
                  }
                />
              )
            )}
          </div>
          <div className="consultation-strip" data-reveal data-reveal-style="scale">
            <div><small>{s.unsure}</small><h3>{t.consultationTitle}</h3><p>{t.consultationText}</p></div>
            <MagneticButton className="button button--light" onClick={() => setOrder(t.consultationButton)}>{t.consultationButton}<ArrowRight size={17} /></MagneticButton>
          </div>
        </section>

        <section id="about" className="about section-frame" data-depth="float">
          <div className="about-image-wrap" data-reveal data-reveal-style="tilt-left">
            <img src={`${import.meta.env.BASE_URL}assets/veronika-profile.png`} alt="Veronika Petrushka" loading="lazy" />
            <div className="about-badge"><b>3+</b><span>years commercial experience</span></div>
          </div>
          <div className="about-copy" data-reveal data-reveal-style="right">
            <div className="section-index">07 / THE PERSON BEHIND IT</div>
            <h2>{t.aboutTitle}</h2>
            <p>{t.aboutText}</p>
            <div className="about-points">{t.aboutPoints.map((point, index) => <div key={point}><span>0{index + 1}</span><p>{point}</p></div>)}</div>
            <MagneticButton className="button button--outline" onClick={() => setOrder("Custom project")}>{t.contact}<ArrowRight size={17} /></MagneticButton>
          </div>
        </section>

        <section className="reviews section-frame section-block" data-depth="pull">
          <div className="review-stage" data-reveal data-reveal-style="left">
            <div className="section-index">08 / SIGNALS OF TRUST</div>
            <div className="review-quote">“{t.reviews[review][2]}”</div>
            <div className="review-author"><b>{t.reviews[review][0]}</b><span>{t.reviews[review][1]} / {String(review + 1).padStart(2, "0")}</span></div>
            <div className="review-controls"><button onClick={() => setReview((v) => (v - 1 + t.reviews.length) % t.reviews.length)}><ChevronLeft /></button><button onClick={() => setReview((v) => (v + 1) % t.reviews.length)}><ChevronRight /></button></div>
          </div>
          <div className="support-stack" data-reveal data-reveal-style="right">
            <span>{s.afterLaunch}</span><h3>{t.maintenanceTitle}</h3><p>{t.maintenanceSub}</p>
            {t.maintenance.map((item) => <button key={item[0]} onClick={() => setOrder(`${item[0]} — ${item[1]}`)}><span>{item[0]}<small>{item[2]}</small></span><b>{item[1]}</b></button>)}
          </div>
        </section>

        <section id="faq" className="faq section-frame section-block" data-depth="float">
          <div className="faq-heading" data-reveal data-reveal-style="left"><div className="section-index">09 / FAQ</div><h2>{t.faqTitle}</h2><p>{t.faqSub}</p></div>
          <div className="faq-list" data-reveal data-reveal-style="right">{t.faqs.map((faq, index) => (
            <article key={faq[0]} className={openFaq === index ? "open" : ""}>
              <button onClick={() => setOpenFaq(openFaq === index ? -1 : index)}><span><small>{String(index + 1).padStart(2, "0")}</small>{faq[0]}</span><ChevronDown /></button>
              <div><p>{faq[1]}</p></div>
            </article>
          ))}</div>
        </section>

        <section className="final-cta section-frame" data-reveal data-reveal-style="scale" data-depth="pull" data-motion>
          <div className="final-orb" aria-hidden="true"><span>WN</span></div>
          <div><small>{s.ready}</small><h2>{t.ctaTitle}</h2><p>{t.ctaText}</p></div>
          <MagneticButton className="button button--accent button--large" onClick={() => setOrder("Custom project")}>{t.ctaButton}<ArrowRight size={18} /></MagneticButton>
        </section>
      </main>

      <footer className="footer section-frame">
        <div className="footer-brand"><span className="brand-mark">WN</span><div><b>WebNika Studio</b><p>{t.footerText}</p></div></div>
        <div className="footer-links"><a href="mailto:veronikapetrushka@gmail.com"><Mail size={15} />veronikapetrushka@gmail.com</a><a href="tel:+48509334229"><Phone size={15} />+48 509 334 229</a><span><MapPin size={15} />Warsaw, Poland</span></div>
        <div className="footer-nav">{t.nav.map((item, index) => <button key={item} onClick={() => scroll(sectionIds[index])}>{item}</button>)}</div>
        <small>© 2026 Veronika Petrushka · WebNika Studio</small>
      </footer>

      {order && (
        <div className="modal-backdrop" onMouseDown={() => setOrder(null)}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setOrder(null)} aria-label="Close"><X /></button>
            <div className="section-index">PROJECT INQUIRY / 01</div>
            <h2>{t.formTitle}</h2>
            <p className="modal-plan">{t.formPlan}: <b>{order}</b></p>
            <form onSubmit={submit}>
              <input type="hidden" name="plan" value={order} />
              <input type="text" name="_honey" className="honey" tabIndex="-1" autoComplete="off" />
              <label>{t.formName}<input name="name" required /></label>
              <div className="form-row"><label>{t.formEmail}<input type="email" name="email" required /></label><label>{t.formPhone}<input name="phone" /></label></div>
              <label>{t.formBusiness}<input name="business" required /></label>
              <label>{t.formMessage}<textarea name="message" rows="4" required /></label>
              <button className="button button--accent" disabled={formStatus.state === "sending"}>{formStatus.state === "sending" ? formStatus.message : t.formSend}<ArrowRight size={17} /></button>
              {formStatus.message && formStatus.state !== "sending" && <p className={`form-status ${formStatus.state}`}>{formStatus.message}</p>}
            </form>
          </div>
        </div>
      )}

      <Analytics />
      <SpeedInsights />
    </>
  );
}

function ArrowUpRightIcon() {
  return <ArrowRight size={16} style={{ transform: "rotate(-45deg)" }} />;
}

createRoot(document.getElementById("root")).render(<App />);
