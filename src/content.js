/* ------------------------------------------------------------------
   WEBNIKA STUDIO — CONTENT LAYER
   ------------------------------------------------------------------
   All copy lives here as PLAIN STRINGS so it stays translatable and
   verifiable. Inline emphasis uses a tiny markup dialect rendered by
   <Rich /> (see ui.jsx):

     [[text]]   accent mark  — amber, the "human / craft" signal
     ((text))   accent mark  — ice, the "data / system" signal
     {{text}}   display serif (Fraunces) — the "idea" voice
     //         hard line break

   Every language object MUST share the same key shape. `npm run verify`
   enforces that.
------------------------------------------------------------------- */

export const langs = [
  { code: "en", label: "EN", htmlLang: "en" },
  { code: "uk", label: "UA", htmlLang: "uk" },
  { code: "pl", label: "PL", htmlLang: "pl" },
];

export const contact = {
  email: "veronikapetrushka@gmail.com",
  phone: "+48 509 334 229",
  phoneHref: "+48509334229",
  city: "Warsaw, Poland",
  github: "https://github.com/veronikapetrushka",
  endpoint: "https://formsubmit.co/ajax/21f8a6c0d50d9b386b6b2cedd3034dcc",
};

/* Section anchors — order defines the narrative and the chapter rail. */
export const chapters = [
  { id: "top", index: "01", key: "hero" },
  { id: "premise", index: "02", key: "premise" },
  { id: "capabilities", index: "03", key: "capabilities" },
  { id: "work", index: "04", key: "work" },
  { id: "method", index: "05", key: "method" },
  { id: "pricing", index: "06", key: "pricing" },
  { id: "care", index: "07", key: "care" },
  { id: "studio", index: "08", key: "studio" },
  { id: "signals", index: "09", key: "signals" },
  { id: "faq", index: "10", key: "faq" },
  { id: "launch", index: "11", key: "launch" },
];

export const projects = [
  { key: "lumovie", name: "Lumovie", url: "https://veronikapetrushka.github.io/lumovie/", accent: "#ef6a55", year: "2025", stack: "React · TMDB API" },
  { key: "ember", name: "Ember Table", url: "https://veronikapetrushka.github.io/ember-table/", accent: "#e5533d", year: "2025", stack: "React · Booking flow" },
  { key: "sola", name: "Sola Pilates Studio", url: "https://veronikapetrushka.github.io/sola-pilates-studio/", accent: "#c8956d", year: "2025", stack: "React · Schedule UI" },
  { key: "momentum", name: "Momentum Coach", url: "https://veronikapetrushka.github.io/momentum-coach/", accent: "#ff8a3d", year: "2025", stack: "React · Lead capture" },
  { key: "cozy", name: "Cozy Recipes", url: "https://veronikapetrushka.github.io/cozy-recipe-journal/", accent: "#d98b4a", year: "2025", stack: "React · Content model" },
  { key: "roamly", name: "Roamly", url: "https://veronikapetrushka.github.io/roamly-travel-app/", accent: "#6bb7c8", year: "2025", stack: "React · Search & filters" },
  { key: "novahome", name: "NovaHome", url: "https://veronikapetrushka.github.io/novahome-real-estate/", accent: "#6677c8", year: "2025", stack: "React · Listings engine" },
  { key: "atelier", name: "Atelier Nova", url: "https://veronikapetrushka.github.io/atelier-nova/", accent: "#9d7965", year: "2025", stack: "React · Cart & checkout" },
  { key: "mori", name: "Mori Matcha", url: "https://veronikapetrushka.github.io/mori-matcha-cafe/", accent: "#789165", year: "2025", stack: "React · Loyalty flow" },
  { key: "vantage", name: "Vantage", url: "https://veronikapetrushka.github.io/vantage-portfolio/", accent: "#5268d8", year: "2025", stack: "React · Data viz" },
];

/* ================================================================
   ENGLISH
================================================================ */
const en = {
  meta: {
    dir: "ltr",
    langLabel: "English",
    responseNote: "Replies within 24 hours",
  },

  nav: [
    { id: "capabilities", label: "Capabilities" },
    { id: "work", label: "Work" },
    { id: "method", label: "Method" },
    { id: "pricing", label: "Pricing" },
    { id: "studio", label: "Studio" },
    { id: "faq", label: "FAQ" },
  ],

  chapterNames: {
    hero: "The Object",
    premise: "The Premise",
    capabilities: "Capabilities",
    work: "Selected Work",
    method: "The Method",
    pricing: "Investment",
    care: "Aftercare",
    studio: "The Studio",
    signals: "Trust",
    faq: "Clarity",
    launch: "Launch",
  },

  ui: {
    contact: "Start a project",
    menu: "Menu",
    close: "Close",
    theme: "Toggle theme",
    language: "Language",
    home: "WebNika Studio — home",
    scrollHint: "Scroll",
    skip: "Skip to content",
    sound: "Ambience",
    back: "Back",
    next: "Next",
    prev: "Previous",
  },

  loader: {
    label: "WEBNIKA STUDIO / WARSAW",
    line: "Assembling the object",
    ready: "Ready",
  },

  hero: {
    kicker: "Custom websites · Warsaw · Remote worldwide",
    title: "Scattered ideas,//{{given form}}.",
    lede: "I design and build [[custom websites]] for businesses that are tired of looking improvised. One person, one process — ((strategy, structure, design, code and launch)) — with nothing lost in a hand-off.",
    primary: "Start a project",
    secondary: "See the work",
    trust: "Fullstack developer · Data Science graduate · 3+ years commercial",
    metrics: [
      { value: "10", label: "PROJECTS", note: "Live, explorable case builds" },
      { value: "100%", label: "RESPONSIVE", note: "Phone, tablet, desktop" },
      { value: "24h", label: "REPLY", note: "Typical response time" },
      { value: "04", label: "LANGUAGES", note: "EN · UA · PL · RU" },
    ],
  },

  ticker: [
    "STRATEGY", "STRUCTURE", "COPY DIRECTION", "VISUAL SYSTEM", "INTERFACE",
    "MOTION", "DEVELOPMENT", "INTEGRATIONS", "SEO", "PERFORMANCE",
    "LAUNCH", "AFTERCARE",
  ],

  premise: {
    kicker: "The premise",
    title: "Most websites fail before//a single pixel is drawn.",
    body: "Not because of taste. Because nobody decided what the site is {{for}}. I start with the decision, not the decoration — then everything after it has a reason to exist.",
    before: {
      label: "WITHOUT A SYSTEM",
      title: "Ten good ideas, no order.",
      points: [
        "Content written in whatever order it arrived",
        "Every section shouting at the same volume",
        "A visitor who cannot tell what to do next",
        "A design that ages the moment the trend does",
      ],
    },
    after: {
      label: "WITH ONE",
      title: "One argument, told in sequence.",
      points: [
        "A page ordered around the customer's question",
        "Hierarchy that tells the eye where to land",
        "One obvious next step on every screen",
        "A visual system that still holds in two years",
      ],
    },
    note: "The 3D object above is the same particle set in every chapter — only its order changes. That is the entire pitch.",
  },

  capabilities: {
    kicker: "Capabilities",
    title: "Not a page.//{{A complete digital system}}.",
    lede: "From a one-page launch to a platform with accounts, payments and custom workflows — built by the same person who designed it.",
    items: [
      {
        n: "01",
        title: "Business websites",
        body: "The site your customers judge you by. Clear structure, honest hierarchy, and a call to action that does not need explaining.",
        tags: ["Landing pages", "Corporate sites", "Portfolios"],
      },
      {
        n: "02",
        title: "Online stores",
        body: "Catalogue, product pages, cart and checkout designed around how people actually buy — not around a theme's defaults.",
        tags: ["Catalogue", "Checkout", "Payments"],
      },
      {
        n: "03",
        title: "Custom web apps",
        body: "Dashboards, booking systems, client areas, filters and interactive workflows. Where a template stops, this starts.",
        tags: ["Dashboards", "Booking", "Auth & accounts"],
      },
      {
        n: "04",
        title: "Redesign & rescue",
        body: "An existing site that loads slowly, breaks on phones or converts nobody. Rebuilt, restructured, measured.",
        tags: ["Performance", "Mobile", "Conversion"],
      },
    ],
    manifesto: {
      label: "FULL CYCLE / NO HAND-OFFS",
      text: "Strategy, structure, visual direction, development, launch and the details between them — one coherent process, one person accountable for the result.",
      cta: "Tell me what you need",
    },
  },

  work: {
    kicker: "Selected work",
    title: "Ten builds you can//open and use right now.",
    lede: "Not screenshots. Every card below loads the live site inside the frame — click through and break it if you like.",
    hint: "Hover to load the live site",
    open: "Open live site",
    counter: "PROJECT",
    cta: "Want yours in this list?",
    ctaButton: "Start a project",
    types: {
      lumovie: "Popular movies catalogue",
      ember: "Restaurant & reservations",
      sola: "Pilates studio & schedule",
      momentum: "Personal trainer landing",
      cozy: "Recipe journal & blog",
      roamly: "Travel booking platform",
      novahome: "Real estate listings",
      atelier: "Fashion e-commerce",
      mori: "Café & loyalty programme",
      vantage: "Finance dashboard",
    },
  },

  method: {
    kicker: "The method",
    title: "Four phases.//Nothing improvised.",
    lede: "You always know which phase we are in, what you get at the end of it, and what I need from you to start the next one.",
    steps: [
      {
        n: "01",
        title: "Brief & direction",
        body: "We talk about the business, the customer and the one thing the site has to achieve. I come back with a structure — not a mood board.",
        deliverable: "Sitemap · page structure · scope",
        duration: "1–2 days",
      },
      {
        n: "02",
        title: "Design & system",
        body: "Type, colour, layout and motion decided as one system so every later screen builds itself from the same rules.",
        deliverable: "Visual direction · key screens",
        duration: "2–6 days",
      },
      {
        n: "03",
        title: "Build & refine",
        body: "Responsive development, real content, integrations, performance and accessibility passes. You review on a live link, not a PDF.",
        deliverable: "Live staging link · revisions",
        duration: "3 days – 4 weeks",
      },
      {
        n: "04",
        title: "Launch & aftercare",
        body: "Domain, hosting, analytics, search console and structured data configured. Then support for as long as you want it.",
        deliverable: "Live site · analytics · handover",
        duration: "1 day + support",
      },
    ],
  },

  pricing: {
    kicker: "Investment",
    title: "Three starting points.//{{One honest number}}.",
    lede: "Transparent packages. Final scope is confirmed in writing before development starts — the price you agree is the price you pay.",
    order: "Order this package",
    timeline: "TIMELINE",
    includedLabel: "What is included",
    showAll: "View all",
    showLess: "Show less",
    featuresWord: "features",
    guarantees: [
      "Fixed price agreed before work starts",
      "You own the code and the domain",
      "Revision rounds included in every package",
      "No monthly lock-in — support is optional",
    ],
    finder: {
      label: "NOT SURE WHICH ONE?",
      title: "Answer three questions.",
      intro: "Thirty seconds. I will point you at the right starting point — no email required.",
      start: "Find my package",
      restart: "Start over",
      questions: [
        {
          q: "What does the site need to do first?",
          options: [
            { label: "Exist, look credible, take enquiries", weight: 0 },
            { label: "Explain several services and build trust", weight: 1 },
            { label: "Sell, book or run an account area", weight: 2 },
          ],
        },
        {
          q: "How much content is there?",
          options: [
            { label: "One page is enough", weight: 0 },
            { label: "A handful of pages", weight: 1 },
            { label: "A catalogue that keeps growing", weight: 2 },
          ],
        },
        {
          q: "When do you want to be live?",
          options: [
            { label: "This week", weight: 0 },
            { label: "In two or three weeks", weight: 1 },
            { label: "When it is genuinely right", weight: 2 },
          ],
        },
      ],
      resultLabel: "YOUR STARTING POINT",
      resultNote: "This is a recommendation, not a limit. We confirm the real scope on the call.",
      cta: "Start with this package",
    },
  },

  care: {
    kicker: "Aftercare",
    title: "A site is a garden,//not a monument.",
    lede: "Optional support that matches how often your business actually changes. Cancel whenever — nothing is locked.",
    choose: "Choose this",
    items: [
      {
        name: "One-time update",
        price: "$99",
        note: "PER REQUEST",
        body: "Content updates, a new section, layout improvements, bug fixes or a small feature — whenever you need them.",
      },
      {
        name: "Website care",
        price: "$79",
        note: "PER MONTH",
        body: "Updates, backups, security monitoring, performance checks, content changes and up to two hours of improvements every month.",
      },
      {
        name: "Premium care",
        price: "$790",
        note: "PER YEAR",
        body: "Priority support, unlimited security updates, automated backups, ongoing monitoring and improvements. Two months free.",
      },
    ],
  },

  studio: {
    kicker: "The studio",
    title: "One person.//Fully accountable.",
    body: "I am a fullstack developer with nearly three years of commercial experience. I have contributed to 100+ mobile applications, built reusable interface systems, integrated APIs and shipped production features in Agile teams. A Data Science degree means I read a website as a system with measurable outcomes — not only as a picture.",
    points: [
      { n: "01", label: "BA with Honours in Data Science" },
      { n: "02", label: "Fullstack Developer programme, GoIT" },
      { n: "03", label: "Commercial product & freelance delivery" },
      { n: "04", label: "English · Ukrainian · Polish · Russian" },
    ],
    badge: { value: "3+", label: "years commercial experience" },
    cta: "Work with me",
    signature: "Veronika Petrushka — founder, designer & developer",
  },

  signals: {
    kicker: "Signals of trust",
    title: "What clients actually say.",
    reviews: [
      {
        quote: "Veronika understood the business quickly and turned our scattered ideas into a clean site our customers can actually use.",
        name: "Anna K.",
        role: "Beauty studio owner",
      },
      {
        quote: "Communication was clear, every stage was explained, and the final website looks far more professional than our old one.",
        name: "Marek P.",
        role: "Property consultant",
      },
      {
        quote: "The site works beautifully on mobile and the ordering flow is simple. Every update arrived exactly as agreed.",
        name: "Sofia D.",
        role: "Independent brand founder",
      },
    ],
  },

  faq: {
    kicker: "Clarity",
    title: "Answers before//the first invoice.",
    lede: "The questions I am asked most often, answered the way I would answer them on a call.",
    items: [
      ["How much does a website cost?", "It depends on scope and functionality. Light starts at $399, Basic at $899, and Pro from $1,699. You receive a written quote before any development begins, and the agreed number does not move."],
      ["How long does development take?", "Light usually takes 3–7 days, Basic 10–14 days, and Pro projects 3–6 weeks. Timing depends on how quickly content and feedback arrive from your side."],
      ["Can you help with the design and the ideas?", "Yes — that is most of the value. You do not need a finished layout. I prepare the page structure, visual direction, content ideas and recommendations based on what will be clearest and most convincing for your customers."],
      ["Can a website make my business more recognisable?", "That is one of the main goals. A distinctive, professional presence states your value clearly, builds trust and makes it easier for local customers to remember and contact you."],
      ["Can you redesign my existing website?", "Yes. I modernise the visual style, fix the mobile experience, reorganise the content, improve clarity and repair technical or performance problems."],
      ["Will it work on phones and tablets?", "Yes. Every package includes a responsive layout tested across modern desktop, tablet and mobile screen sizes."],
      ["Can I update the site myself later?", "Yes, when content management is part of the chosen solution. I also provide a short written guide for updating text, images, products or services."],
      ["Do you provide support after launch?", "Yes. One-time, monthly and yearly options cover updates, fixes, backups, improvements and ongoing technical help. Support is optional and never locked in."],
      ["Will you help with the domain and hosting?", "Yes. I can help select hosting, connect the domain, configure deployment and publish the finished site."],
      ["Can you add payments, bookings or integrations?", "Yes. Depending on the project I integrate payments, booking forms, calendars, maps, newsletters, APIs, product catalogues and custom workflows."],
      ["Is SEO included?", "Essential technical SEO is included in every package: semantic structure, metadata, mobile optimisation, image optimisation and performance. Deeper SEO and structured data come with Pro."],
      ["What do you need from me to start?", "Your business goals, your services, any logo or brand material, examples you like, and any existing text or photos. Where something is missing, I propose the structure and content direction."],
      ["Do you only work with clients in Poland?", "No. I work remotely with clients in different countries and communicate in English, Ukrainian and Polish."],
      ["What happens after I submit the form?", "I read the request and normally reply within 24 hours. We discuss goals, the right package, timeline and final scope before any development begins."],
      ["Why work with you instead of an agency?", "You work directly with the person building the site, from first idea to launch. No account manager, no brief lost in translation, no surprise invoice — and commercial development experience behind the design decisions."],
    ],
    ctaTitle: "Still have a question?",
    ctaText: "Describe your business in two lines. I will answer honestly and suggest the best next step, with no obligation.",
    ctaButton: "Ask me directly",
  },

  launch: {
    kicker: "Ready when you are",
    title: "Let's build the site//your business deserves.",
    body: "Tell me what you do, what you need and roughly when you want to launch. I will reply within 24 hours with a clear recommendation.",
    button: "Start a project",
    secondary: "Or email me directly",
  },

  footer: {
    blurb: "Custom web design and development for local businesses and growing brands. Based in Warsaw, working remotely worldwide.",
    contactLabel: "Contact",
    navLabel: "Navigate",
    studioLabel: "Studio",
    legal: "© 2026 Veronika Petrushka · WebNika Studio",
    built: "Designed and built in Warsaw",
  },

  form: {
    eyebrow: "PROJECT INQUIRY",
    title: "Start your project",
    intro: "Two minutes now saves a week later. The more context you give, the more useful my first reply will be.",
    planLabel: "Selected service",
    name: "Your name",
    email: "Email",
    phone: "Phone (optional)",
    business: "Business type",
    budgetLabel: "Approximate budget",
    budgets: ["Under $500", "$500 – $1,000", "$1,000 – $2,000", "$2,000+", "Not sure yet"],
    message: "Tell me about the website you need",
    messagePlaceholder: "What you do, who your customers are, what the site must achieve, and any examples you like.",
    send: "Send request",
    sending: "Sending…",
    success: "Thank you — your request was sent. I will reply within 24 hours.",
    error: "The form could not be sent. Please email me directly and I will pick it up right away.",
    privacy: "Your details are used only to answer this enquiry. Never shared, never added to a list.",
  },
};

en.pricing.plans = [
  {
    key: "light",
    name: "Light",
    price: "$399",
    badge: "Fast launch",
    for: "New businesses that need to exist online, credibly, this week.",
    desc: "A professional one-page website that establishes your presence and lets customers understand your offer in thirty seconds.",
    eta: "3–7 days",
    items: [
      "Custom one-page design — no template",
      "Fully responsive for mobile, tablet and desktop",
      "Up to 6 professionally structured sections",
      "Contact form, Google Maps and social links",
      "Essential on-page SEO for Google",
      "Performance and loading optimisation",
      "Google Analytics integration",
      "Basic security and spam protection",
      "Light and dark theme ready",
      "Deployment to your domain and hosting",
      "1 revision round",
      "30 days of post-launch support",
    ],
  },
  {
    key: "basic",
    name: "Basic",
    price: "$899",
    badge: "Most chosen",
    for: "Established businesses with several services to explain properly.",
    desc: "A complete multi-page website that builds trust, presents your services in the right order and converts visitors into enquiries.",
    eta: "10–14 days",
    items: [
      "2–5 fully custom pages",
      "Unique UI/UX design tailored to your brand",
      "Service, portfolio, gallery and FAQ pages",
      "Contact, booking or order forms",
      "Google Maps and social media integration",
      "Simple CMS for updating your own content",
      "Considered animation and interaction",
      "Advanced responsive design",
      "SEO optimisation for better Google visibility",
      "Google Analytics and Search Console setup",
      "Performance optimisation (90+ Lighthouse target)",
      "Deployment to your domain and hosting",
      "2 revision rounds",
      "60 days of post-launch support",
    ],
  },
  {
    key: "pro",
    name: "Pro",
    price: "From $1,699",
    badge: "Custom build",
    for: "Businesses that need the website to actually do work.",
    desc: "A fully custom website or web application with advanced functionality, automation and integrations built around your operation.",
    eta: "3–6 weeks",
    items: [
      "Unlimited custom pages",
      "Completely bespoke UI/UX design system",
      "Online store, booking or reservation system",
      "Product or service catalogue with advanced filters",
      "Customer dashboard or admin panel",
      "Secure payment gateway integration",
      "API integrations with third-party services",
      "Authentication and user accounts",
      "Advanced search and dynamic content",
      "Core Web Vitals and performance engineering",
      "Advanced SEO setup and structured data",
      "Analytics, Search Console and conversion tracking",
      "Deployment, domain and hosting configuration",
      "3 revision rounds",
      "90 days of post-launch support",
    ],
  },
];

/* ================================================================
   УКРАЇНСЬКА
================================================================ */
const uk = {
  meta: {
    dir: "ltr",
    langLabel: "Українська",
    responseNote: "Відповідь протягом 24 годин",
  },

  nav: [
    { id: "capabilities", label: "Послуги" },
    { id: "work", label: "Роботи" },
    { id: "method", label: "Процес" },
    { id: "pricing", label: "Ціни" },
    { id: "studio", label: "Про мене" },
    { id: "faq", label: "Питання" },
  ],

  chapterNames: {
    hero: "Об'єкт",
    premise: "Передумова",
    capabilities: "Послуги",
    work: "Вибрані роботи",
    method: "Процес",
    pricing: "Інвестиція",
    care: "Підтримка",
    studio: "Студія",
    signals: "Довіра",
    faq: "Ясність",
    launch: "Запуск",
  },

  ui: {
    contact: "Почати проєкт",
    menu: "Меню",
    close: "Закрити",
    theme: "Змінити тему",
    language: "Мова",
    home: "WebNika Studio — головна",
    scrollHint: "Гортайте",
    skip: "До вмісту",
    sound: "Атмосфера",
    back: "Назад",
    next: "Далі",
    prev: "Попереднє",
  },

  loader: {
    label: "WEBNIKA STUDIO / ВАРШАВА",
    line: "Збираємо об'єкт",
    ready: "Готово",
  },

  hero: {
    kicker: "Індивідуальні сайти · Варшава · Віддалено по всьому світу",
    title: "Розрізнені ідеї,//{{втілені у форму}}.",
    lede: "Створюю [[індивідуальні сайти]] для бізнесів, яким набридло виглядати імпровізовано. Одна людина, один процес — ((стратегія, структура, дизайн, код і запуск)) — нічого не губиться між етапами.",
    primary: "Почати проєкт",
    secondary: "Переглянути роботи",
    trust: "Fullstack-розробниця · Випускниця Data Science · 3+ роки комерційного досвіду",
    metrics: [
      { value: "10", label: "ПРОЄКТИ", note: "Живі проєкти, які можна відкрити" },
      { value: "100%", label: "АДАПТИВНІСТЬ", note: "Телефон, планшет, комп'ютер" },
      { value: "24г", label: "ВІДПОВІДЬ", note: "Типовий час відповіді" },
      { value: "04", label: "МОВИ", note: "EN · UA · PL · RU" },
    ],
  },

  ticker: [
    "СТРАТЕГІЯ", "СТРУКТУРА", "КОНТЕНТ", "ВІЗУАЛЬНА СИСТЕМА", "ІНТЕРФЕЙС",
    "АНІМАЦІЯ", "РОЗРОБКА", "ІНТЕГРАЦІЇ", "SEO", "ШВИДКОДІЯ",
    "ЗАПУСК", "ПІДТРИМКА",
  ],

  premise: {
    kicker: "Передумова",
    title: "Більшість сайтів програють ще до//того, як намальовано перший піксель.",
    body: "Не через смак. А тому, що ніхто не вирішив, {{для чого}} цей сайт. Я починаю з рішення, а не з декору — і тоді все наступне має причину існувати.",
    before: {
      label: "БЕЗ СИСТЕМИ",
      title: "Десять хороших ідей без порядку.",
      points: [
        "Контент у тому порядку, у якому він з'явився",
        "Кожна секція кричить однаково гучно",
        "Відвідувач не розуміє, що робити далі",
        "Дизайн старіє разом із трендом",
      ],
    },
    after: {
      label: "ІЗ СИСТЕМОЮ",
      title: "Один аргумент, розказаний послідовно.",
      points: [
        "Сторінка вибудувана навколо питання клієнта",
        "Ієрархія, яка веде погляд",
        "Один очевидний наступний крок на кожному екрані",
        "Візуальна система, яка працюватиме й через два роки",
      ],
    },
    note: "3D-об'єкт вище — це той самий набір часток у кожному розділі. Змінюється лише його порядок. У цьому вся суть.",
  },

  capabilities: {
    kicker: "Послуги",
    title: "Не просто сторінка.//{{Цілісна цифрова система}}.",
    lede: "Від односторінкового запуску до платформи з акаунтами, оплатами й індивідуальними сценаріями — усе робить та сама людина, яка це спроєктувала.",
    items: [
      {
        n: "01",
        title: "Сайти для бізнесу",
        body: "Сайт, за яким вас оцінюють клієнти. Чітка структура, чесна ієрархія та заклик до дії, який не треба пояснювати.",
        tags: ["Лендінги", "Корпоративні сайти", "Портфоліо"],
      },
      {
        n: "02",
        title: "Інтернет-магазини",
        body: "Каталог, сторінки товарів, кошик і оформлення, побудовані навколо того, як люди справді купують.",
        tags: ["Каталог", "Оформлення", "Оплати"],
      },
      {
        n: "03",
        title: "Вебзастосунки",
        body: "Панелі, системи бронювання, кабінети клієнтів, фільтри та інтерактивні сценарії. Там, де шаблон закінчується, це починається.",
        tags: ["Дашборди", "Бронювання", "Акаунти"],
      },
      {
        n: "04",
        title: "Редизайн і порятунок",
        body: "Сайт, який повільно вантажиться, ламається на телефоні або нікого не конвертує. Перебудований, переструктурований, виміряний.",
        tags: ["Швидкодія", "Мобільна версія", "Конверсія"],
      },
    ],
    manifesto: {
      label: "ПОВНИЙ ЦИКЛ / БЕЗ ПЕРЕДАЧ",
      text: "Стратегія, структура, візуальний напрям, розробка, запуск і всі деталі між ними — один цілісний процес і одна людина, відповідальна за результат.",
      cta: "Розкажіть, що вам потрібно",
    },
  },

  work: {
    kicker: "Вибрані роботи",
    title: "Десять проєктів, які можна//відкрити просто зараз.",
    lede: "Не скріншоти. Кожна картка завантажує живий сайт прямо у рамці — відкривайте й тестуйте.",
    hint: "Наведіть, щоб завантажити сайт",
    open: "Відкрити сайт",
    counter: "ПРОЄКТ",
    cta: "Хочете свій проєкт у цьому списку?",
    ctaButton: "Почати проєкт",
    types: {
      lumovie: "Каталог популярних фільмів",
      ember: "Ресторан і бронювання",
      sola: "Студія пілатесу й розклад",
      momentum: "Лендінг персонального тренера",
      cozy: "Журнал рецептів і блог",
      roamly: "Платформа бронювання подорожей",
      novahome: "Каталог нерухомості",
      atelier: "Fashion e-commerce",
      mori: "Кав'ярня і програма лояльності",
      vantage: "Фінансовий дашборд",
    },
  },

  method: {
    kicker: "Процес",
    title: "Чотири етапи.//Жодної імпровізації.",
    lede: "Ви завжди знаєте, на якому етапі ми зараз, що отримаєте в кінці й що потрібно від вас, щоб почати наступний.",
    steps: [
      {
        n: "01",
        title: "Бриф і напрям",
        body: "Обговорюємо бізнес, клієнта і головну мету сайту. Я повертаюся зі структурою, а не з мудбордом.",
        deliverable: "Мапа сайту · структура · обсяг робіт",
        duration: "1–2 дні",
      },
      {
        n: "02",
        title: "Дизайн і система",
        body: "Шрифт, колір, композиція й рух визначаються як єдина система, щоб кожен наступний екран будувався за тими самими правилами.",
        deliverable: "Візуальний напрям · ключові екрани",
        duration: "2–6 днів",
      },
      {
        n: "03",
        title: "Розробка і доопрацювання",
        body: "Адаптивна верстка, реальний контент, інтеграції, швидкодія та доступність. Ви переглядаєте живе посилання, а не PDF.",
        deliverable: "Тестове посилання · правки",
        duration: "3 дні – 4 тижні",
      },
      {
        n: "04",
        title: "Запуск і підтримка",
        body: "Домен, хостинг, аналітика, Search Console і структуровані дані налаштовані. Далі — підтримка стільки, скільки потрібно.",
        deliverable: "Живий сайт · аналітика · передача",
        duration: "1 день + підтримка",
      },
    ],
  },

  pricing: {
    kicker: "Інвестиція",
    title: "Три відправні точки.//{{Одна чесна цифра}}.",
    lede: "Прозорі пакети. Остаточний обсяг фіксується письмово до початку розробки — ціна, яку ви погодили, не змінюється.",
    order: "Замовити пакет",
    timeline: "ТЕРМІН",
    includedLabel: "Що входить",
    showAll: "Показати всі",
    showLess: "Згорнути",
    featuresWord: "пунктів",
    guarantees: [
      "Фіксована ціна, погоджена до початку робіт",
      "Код і домен належать вам",
      "Раунди правок входять у кожен пакет",
      "Без щомісячної прив'язки — підтримка за бажанням",
    ],
    finder: {
      label: "НЕ ЗНАЄТЕ, ЩО ОБРАТИ?",
      title: "Три запитання.",
      intro: "Тридцять секунд. Я підкажу правильну відправну точку — без пошти й реєстрацій.",
      start: "Підібрати пакет",
      restart: "Почати заново",
      questions: [
        {
          q: "Що сайт має зробити насамперед?",
          options: [
            { label: "Існувати, викликати довіру, збирати звернення", weight: 0 },
            { label: "Пояснити кілька послуг і побудувати довіру", weight: 1 },
            { label: "Продавати, бронювати або вести кабінети", weight: 2 },
          ],
        },
        {
          q: "Скільки у вас контенту?",
          options: [
            { label: "Однієї сторінки достатньо", weight: 0 },
            { label: "Кілька сторінок", weight: 1 },
            { label: "Каталог, який постійно зростає", weight: 2 },
          ],
        },
        {
          q: "Коли хочете бути онлайн?",
          options: [
            { label: "Цього тижня", weight: 0 },
            { label: "За два-три тижні", weight: 1 },
            { label: "Коли буде дійсно якісно", weight: 2 },
          ],
        },
      ],
      resultLabel: "ВАША ВІДПРАВНА ТОЧКА",
      resultNote: "Це рекомендація, а не обмеження. Реальний обсяг узгодимо на дзвінку.",
      cta: "Почати з цього пакета",
    },
  },

  care: {
    kicker: "Підтримка",
    title: "Сайт — це сад,//а не пам'ятник.",
    lede: "Підтримка за бажанням, що відповідає темпу змін у вашому бізнесі. Скасувати можна будь-коли.",
    choose: "Обрати",
    items: [
      {
        name: "Разове оновлення",
        price: "$99",
        note: "ЗА ЗАПИТ",
        body: "Оновлення контенту, нова секція, покращення макета, виправлення помилок або невелика функція — коли потрібно.",
      },
      {
        name: "Щомісячна підтримка",
        price: "$79",
        note: "НА МІСЯЦЬ",
        body: "Оновлення, резервні копії, моніторинг безпеки, перевірка швидкодії, зміни контенту та до двох годин покращень щомісяця.",
      },
      {
        name: "Преміум підтримка",
        price: "$790",
        note: "НА РІК",
        body: "Пріоритетна підтримка, необмежені оновлення безпеки, автоматичні бекапи, постійний моніторинг і покращення. Два місяці безкоштовно.",
      },
    ],
  },

  studio: {
    kicker: "Студія",
    title: "Одна людина.//Повна відповідальність.",
    body: "Я fullstack-розробниця з майже трьома роками комерційного досвіду. Працювала над 100+ мобільними застосунками, створювала перевикористовувані інтерфейсні системи, інтегрувала API та випускала production-функції в Agile-командах. Освіта Data Science дозволяє читати сайт як систему з вимірюваним результатом, а не лише як картинку.",
    points: [
      { n: "01", label: "Бакалавр з відзнакою у Data Science" },
      { n: "02", label: "Програма Fullstack Developer, GoIT" },
      { n: "03", label: "Комерційний і freelance-досвід" },
      { n: "04", label: "Англійська · українська · польська · російська" },
    ],
    badge: { value: "3+", label: "роки комерційного досвіду" },
    cta: "Працювати зі мною",
    signature: "Вероніка Петрушка — засновниця, дизайнерка й розробниця",
  },

  signals: {
    kicker: "Сигнали довіри",
    title: "Що кажуть клієнти.",
    reviews: [
      {
        quote: "Вероніка швидко зрозуміла бізнес і перетворила наші розрізнені ідеї на чистий сайт, яким клієнтам зручно користуватися.",
        name: "Анна К.",
        role: "Власниця beauty-студії",
      },
      {
        quote: "Комунікація була зрозумілою, кожен етап пояснювався, а результат виглядає значно професійніше за попередній сайт.",
        name: "Марек П.",
        role: "Консультант з нерухомості",
      },
      {
        quote: "Сайт чудово працює на телефоні, а процес замовлення дуже простий. Кожне оновлення приходило точно як домовлялися.",
        name: "Софія Д.",
        role: "Засновниця бренду",
      },
    ],
  },

  faq: {
    kicker: "Ясність",
    title: "Відповіді ще до//першого рахунку.",
    lede: "Питання, які ставлять найчастіше — відповіді такі ж, як були б на дзвінку.",
    items: [
      ["Скільки коштує сайт?", "Залежить від обсягу та функціональності. Light — від $399, Basic — від $899, Pro — від $1,699. Ви отримуєте письмову пропозицію до початку розробки, і погоджена сума не змінюється."],
      ["Скільки часу займає розробка?", "Light зазвичай 3–7 днів, Basic 10–14 днів, Pro 3–6 тижнів. Терміни залежать від швидкості надання контенту та зворотного зв'язку."],
      ["Чи допоможете з дизайном та ідеями?", "Так — це основна цінність. Готовий макет не потрібен. Я готую структуру сторінок, візуальний напрям, ідеї контенту й рекомендації щодо того, що буде найзрозумілішим для ваших клієнтів."],
      ["Чи зробить сайт бізнес впізнаванішим?", "Це одна з головних цілей. Помітна професійна присутність чітко подає вашу цінність, формує довіру й допомагає локальним клієнтам запам'ятати вас."],
      ["Чи можете оновити мій наявний сайт?", "Так. Осучаснюю стиль, виправляю мобільну версію, переорганізовую контент, підвищую зрозумілість і усуваю технічні проблеми."],
      ["Чи працюватиме на телефонах і планшетах?", "Так. Кожен пакет включає адаптивний макет, протестований на сучасних десктопах, планшетах і смартфонах."],
      ["Чи зможу я оновлювати сайт самостійно?", "Так, якщо керування контентом входить в обране рішення. Також надаю коротку інструкцію для оновлення текстів, зображень, товарів або послуг."],
      ["Чи є підтримка після запуску?", "Так. Разова, щомісячна та річна опції покривають оновлення, виправлення, бекапи, покращення й технічну допомогу. Підтримка необов'язкова."],
      ["Чи допоможете з доменом і хостингом?", "Так. Допоможу обрати хостинг, підключити домен, налаштувати деплой і опублікувати готовий сайт."],
      ["Чи можна додати оплати, бронювання, інтеграції?", "Так. Залежно від проєкту інтегрую оплати, форми бронювання, календарі, карти, розсилки, API, каталоги та індивідуальні сценарії."],
      ["Чи входить SEO?", "Базове технічне SEO входить у кожен пакет: семантична структура, метадані, мобільна оптимізація, оптимізація зображень і швидкодія. Глибше SEO та структуровані дані — у Pro."],
      ["Що потрібно від мене для старту?", "Цілі бізнесу, опис послуг, логотип чи брендові матеріали, приклади, які подобаються, а також наявні тексти та фото. Якщо чогось немає — запропоную структуру й напрям контенту."],
      ["Ви працюєте лише з клієнтами в Польщі?", "Ні. Працюю віддалено з клієнтами з різних країн і спілкуюся англійською, українською та польською."],
      ["Що буде після надсилання форми?", "Я читаю запит і зазвичай відповідаю протягом 24 годин. Ми обговорюємо цілі, відповідний пакет, терміни й остаточний обсяг до початку розробки."],
      ["Чому ви, а не агенція?", "Ви працюєте напряму з людиною, яка робить сайт, від першої ідеї до запуску. Без акаунт-менеджера, без загубленого брифу й без несподіваних рахунків — і з комерційним досвідом розробки за дизайн-рішеннями."],
    ],
    ctaTitle: "Залишилося питання?",
    ctaText: "Опишіть свій бізнес двома реченнями. Відповім чесно й запропоную найкращий наступний крок без зобов'язань.",
    ctaButton: "Запитати напряму",
  },

  launch: {
    kicker: "Коли будете готові",
    title: "Створімо сайт, на який//ваш бізнес заслуговує.",
    body: "Розкажіть, чим займаєтеся, що потрібно і коли приблизно хочете запуститися. Відповім протягом 24 годин із чіткою рекомендацією.",
    button: "Почати проєкт",
    secondary: "Або напишіть напряму",
  },

  footer: {
    blurb: "Індивідуальний вебдизайн і розробка для локального бізнесу та брендів, що зростають. Варшава, робота віддалено по всьому світу.",
    contactLabel: "Контакти",
    navLabel: "Навігація",
    studioLabel: "Студія",
    legal: "© 2026 Вероніка Петрушка · WebNika Studio",
    built: "Спроєктовано й зібрано у Варшаві",
  },

  form: {
    eyebrow: "ЗАПИТ НА ПРОЄКТ",
    title: "Почати проєкт",
    intro: "Дві хвилини зараз економлять тиждень потім. Що більше контексту — то кориснішою буде моя перша відповідь.",
    planLabel: "Обрана послуга",
    name: "Ваше ім'я",
    email: "Email",
    phone: "Телефон (необов'язково)",
    business: "Тип бізнесу",
    budgetLabel: "Орієнтовний бюджет",
    budgets: ["До $500", "$500 – $1,000", "$1,000 – $2,000", "$2,000+", "Поки не знаю"],
    message: "Опишіть потрібний сайт",
    messagePlaceholder: "Чим займаєтеся, хто ваші клієнти, чого має досягти сайт і які приклади вам подобаються.",
    send: "Надіслати запит",
    sending: "Надсилання…",
    success: "Дякую — запит надіслано. Відповім протягом 24 годин.",
    error: "Не вдалося надіслати форму. Напишіть мені на пошту — я одразу відповім.",
    privacy: "Ваші дані використовуються лише для відповіді на цей запит. Не передаються третім особам.",
  },
};

uk.pricing.plans = [
  {
    key: "light",
    name: "Light",
    price: "$399",
    badge: "Швидкий запуск",
    for: "Новим бізнесам, яким потрібна впевнена присутність вже цього тижня.",
    desc: "Професійний односторінковий сайт, який створює присутність і дає клієнтам зрозуміти вашу пропозицію за тридцять секунд.",
    eta: "3–7 днів",
    items: [
      "Індивідуальний дизайн односторінкового сайту — без шаблонів",
      "Повна адаптація для телефона, планшета й комп'ютера",
      "До 6 професійно структурованих секцій",
      "Контактна форма, Google Maps і соцмережі",
      "Базова SEO-оптимізація для Google",
      "Оптимізація швидкості завантаження",
      "Підключення Google Analytics",
      "Базовий захист і захист від спаму",
      "Готовність до світлої та темної теми",
      "Публікація на вашому домені й хостингу",
      "1 раунд правок",
      "30 днів підтримки після запуску",
    ],
  },
  {
    key: "basic",
    name: "Basic",
    price: "$899",
    badge: "Найчастіший вибір",
    for: "Бізнесам, яким треба грамотно пояснити кілька послуг.",
    desc: "Повноцінний багатосторінковий сайт, який формує довіру, подає послуги у правильному порядку й перетворює відвідувачів на звернення.",
    eta: "10–14 днів",
    items: [
      "2–5 повністю індивідуальних сторінок",
      "Унікальний UI/UX-дизайн під ваш бренд",
      "Сторінки послуг, портфоліо, галереї та FAQ",
      "Форми контакту, бронювання або замовлення",
      "Інтеграція Google Maps і соцмереж",
      "Проста CMS для самостійного оновлення контенту",
      "Продумані анімації та взаємодії",
      "Розширена адаптивність",
      "SEO-оптимізація для кращої видимості в Google",
      "Налаштування Google Analytics і Search Console",
      "Оптимізація продуктивності (ціль 90+ Lighthouse)",
      "Публікація на вашому домені й хостингу",
      "2 раунди правок",
      "60 днів підтримки після запуску",
    ],
  },
  {
    key: "pro",
    name: "Pro",
    price: "Від $1,699",
    badge: "Індивідуальна розробка",
    for: "Бізнесам, яким сайт має виконувати реальну роботу.",
    desc: "Повністю індивідуальний сайт або вебзастосунок із розширеним функціоналом, автоматизацією та інтеграціями під вашу операційну модель.",
    eta: "3–6 тижнів",
    items: [
      "Необмежена кількість сторінок",
      "Повністю індивідуальна дизайн-система UI/UX",
      "Інтернет-магазин, бронювання або резервації",
      "Каталог товарів чи послуг із розширеними фільтрами",
      "Кабінет клієнта або адмін-панель",
      "Інтеграція безпечних онлайн-платежів",
      "API-інтеграції зі сторонніми сервісами",
      "Авторизація та облікові записи",
      "Розширений пошук і динамічний контент",
      "Робота з Core Web Vitals і продуктивністю",
      "Поглиблене SEO та структуровані дані",
      "Аналітика, Search Console і відстеження конверсій",
      "Налаштування домену, хостингу й публікація",
      "3 раунди правок",
      "90 днів підтримки після запуску",
    ],
  },
];

/* ================================================================
   POLSKI
================================================================ */
const pl = {
  meta: {
    dir: "ltr",
    langLabel: "Polski",
    responseNote: "Odpowiedź w ciągu 24 godzin",
  },

  nav: [
    { id: "capabilities", label: "Usługi" },
    { id: "work", label: "Realizacje" },
    { id: "method", label: "Proces" },
    { id: "pricing", label: "Cennik" },
    { id: "studio", label: "O mnie" },
    { id: "faq", label: "Pytania" },
  ],

  chapterNames: {
    hero: "Obiekt",
    premise: "Założenie",
    capabilities: "Usługi",
    work: "Wybrane realizacje",
    method: "Proces",
    pricing: "Inwestycja",
    care: "Opieka",
    studio: "Studio",
    signals: "Zaufanie",
    faq: "Jasność",
    launch: "Start",
  },

  ui: {
    contact: "Rozpocznij projekt",
    menu: "Menu",
    close: "Zamknij",
    theme: "Zmień motyw",
    language: "Język",
    home: "WebNika Studio — strona główna",
    scrollHint: "Przewiń",
    skip: "Przejdź do treści",
    sound: "Atmosfera",
    back: "Wstecz",
    next: "Dalej",
    prev: "Poprzednie",
  },

  loader: {
    label: "WEBNIKA STUDIO / WARSZAWA",
    line: "Składanie obiektu",
    ready: "Gotowe",
  },

  hero: {
    kicker: "Indywidualne strony · Warszawa · Zdalnie na całym świecie",
    title: "Rozproszone pomysły,//{{ubrane w formę}}.",
    lede: "Projektuję i tworzę [[indywidualne strony]] dla firm, które mają dość wyglądania na zaimprowizowane. Jedna osoba, jeden proces — ((strategia, struktura, design, kod i wdrożenie)) — nic nie ginie po drodze.",
    primary: "Rozpocznij projekt",
    secondary: "Zobacz realizacje",
    trust: "Fullstack Developer · Absolwentka Data Science · 3+ lata komercyjnie",
    metrics: [
      { value: "10", label: "PROJEKTY", note: "Działające realizacje do otwarcia" },
      { value: "100%", label: "RESPONSYWNOŚĆ", note: "Telefon, tablet, komputer" },
      { value: "24h", label: "ODPOWIEDŹ", note: "Typowy czas odpowiedzi" },
      { value: "04", label: "JĘZYKI", note: "EN · UA · PL · RU" },
    ],
  },

  ticker: [
    "STRATEGIA", "STRUKTURA", "TREŚĆ", "SYSTEM WIZUALNY", "INTERFEJS",
    "ANIMACJA", "DEVELOPMENT", "INTEGRACJE", "SEO", "WYDAJNOŚĆ",
    "WDROŻENIE", "OPIEKA",
  ],

  premise: {
    kicker: "Założenie",
    title: "Większość stron przegrywa,//zanim powstanie pierwszy piksel.",
    body: "Nie przez gust. Przez to, że nikt nie zdecydował, {{po co}} jest ta strona. Zaczynam od decyzji, nie od dekoracji — wtedy wszystko dalsze ma powód, by istnieć.",
    before: {
      label: "BEZ SYSTEMU",
      title: "Dziesięć dobrych pomysłów bez porządku.",
      points: [
        "Treść w kolejności, w jakiej się pojawiła",
        "Każda sekcja krzyczy tak samo głośno",
        "Odwiedzający nie wie, co zrobić dalej",
        "Design starzeje się razem z trendem",
      ],
    },
    after: {
      label: "Z SYSTEMEM",
      title: "Jeden argument, opowiedziany po kolei.",
      points: [
        "Strona ułożona wokół pytania klienta",
        "Hierarchia, która prowadzi wzrok",
        "Jeden oczywisty następny krok na każdym ekranie",
        "System wizualny, który wytrzyma dwa lata",
      ],
    },
    note: "Obiekt 3D powyżej to ten sam zbiór cząstek w każdym rozdziale. Zmienia się wyłącznie jego porządek. I o to właśnie chodzi.",
  },

  capabilities: {
    kicker: "Usługi",
    title: "Nie tylko strona.//{{Kompletny system cyfrowy}}.",
    lede: "Od jednostronicowego startu po platformę z kontami, płatnościami i własnymi procesami — tworzone przez tę samą osobę, która to zaprojektowała.",
    items: [
      {
        n: "01",
        title: "Strony firmowe",
        body: "Strona, po której oceniają Cię klienci. Czytelna struktura, uczciwa hierarchia i wezwanie do działania, którego nie trzeba tłumaczyć.",
        tags: ["Landing page", "Strony firmowe", "Portfolio"],
      },
      {
        n: "02",
        title: "Sklepy internetowe",
        body: "Katalog, karty produktów, koszyk i zamówienie zaprojektowane wokół tego, jak ludzie naprawdę kupują.",
        tags: ["Katalog", "Zamówienie", "Płatności"],
      },
      {
        n: "03",
        title: "Aplikacje webowe",
        body: "Panele, systemy rezerwacji, konta klientów, filtry i interaktywne procesy. Tam, gdzie kończy się szablon, to się zaczyna.",
        tags: ["Panele", "Rezerwacje", "Konta"],
      },
      {
        n: "04",
        title: "Redesign i ratunek",
        body: "Strona, która wolno się ładuje, psuje na telefonie albo nikogo nie przekonuje. Przebudowana, uporządkowana, zmierzona.",
        tags: ["Wydajność", "Mobile", "Konwersja"],
      },
    ],
    manifesto: {
      label: "PEŁNY CYKL / BEZ PRZEKAZAŃ",
      text: "Strategia, struktura, kierunek wizualny, development, wdrożenie i wszystkie detale pomiędzy — jeden spójny proces i jedna osoba odpowiedzialna za efekt.",
      cta: "Powiedz, czego potrzebujesz",
    },
  },

  work: {
    kicker: "Wybrane realizacje",
    title: "Dziesięć projektów, które//otworzysz od razu.",
    lede: "To nie zrzuty ekranu. Każda karta ładuje działającą stronę wewnątrz ramki — wejdź i sprawdź.",
    hint: "Najedź, aby wczytać stronę",
    open: "Otwórz stronę",
    counter: "PROJEKT",
    cta: "Chcesz swój projekt na tej liście?",
    ctaButton: "Rozpocznij projekt",
    types: {
      lumovie: "Katalog popularnych filmów",
      ember: "Restauracja i rezerwacje",
      sola: "Studio pilatesu i grafik",
      momentum: "Landing trenera personalnego",
      cozy: "Dziennik przepisów i blog",
      roamly: "Platforma rezerwacji podróży",
      novahome: "Portal nieruchomości",
      atelier: "E-commerce modowy",
      mori: "Kawiarnia i program lojalnościowy",
      vantage: "Panel finansowy",
    },
  },

  method: {
    kicker: "Proces",
    title: "Cztery etapy.//Zero improwizacji.",
    lede: "Zawsze wiesz, na którym etapie jesteśmy, co dostaniesz na końcu i czego potrzebuję od Ciebie, żeby zacząć kolejny.",
    steps: [
      {
        n: "01",
        title: "Brief i kierunek",
        body: "Rozmawiamy o firmie, kliencie i o tym, co strona ma osiągnąć. Wracam ze strukturą, nie z moodboardem.",
        deliverable: "Mapa strony · struktura · zakres",
        duration: "1–2 dni",
      },
      {
        n: "02",
        title: "Design i system",
        body: "Typografia, kolor, układ i ruch ustalone jako jeden system, żeby każdy kolejny ekran budował się z tych samych reguł.",
        deliverable: "Kierunek wizualny · kluczowe ekrany",
        duration: "2–6 dni",
      },
      {
        n: "03",
        title: "Development i dopracowanie",
        body: "Responsywny kod, prawdziwe treści, integracje, wydajność i dostępność. Oceniasz na żywym linku, nie w PDF-ie.",
        deliverable: "Link testowy · poprawki",
        duration: "3 dni – 4 tygodnie",
      },
      {
        n: "04",
        title: "Wdrożenie i opieka",
        body: "Domena, hosting, analityka, Search Console i dane strukturalne skonfigurowane. Potem wsparcie tak długo, jak chcesz.",
        deliverable: "Działająca strona · analityka · przekazanie",
        duration: "1 dzień + wsparcie",
      },
    ],
  },

  pricing: {
    kicker: "Inwestycja",
    title: "Trzy punkty startu.//{{Jedna uczciwa kwota}}.",
    lede: "Przejrzyste pakiety. Ostateczny zakres potwierdzamy pisemnie przed startem — uzgodniona cena się nie zmienia.",
    order: "Zamów pakiet",
    timeline: "TERMIN",
    includedLabel: "Co zawiera",
    showAll: "Pokaż wszystko",
    showLess: "Zwiń",
    featuresWord: "punktów",
    guarantees: [
      "Stała cena ustalona przed rozpoczęciem prac",
      "Kod i domena należą do Ciebie",
      "Rundy poprawek w każdym pakiecie",
      "Bez abonamentu na siłę — opieka jest opcjonalna",
    ],
    finder: {
      label: "NIE WIESZ, CO WYBRAĆ?",
      title: "Trzy pytania.",
      intro: "Trzydzieści sekund. Wskażę właściwy punkt startu — bez maila i rejestracji.",
      start: "Dobierz pakiet",
      restart: "Zacznij od nowa",
      questions: [
        {
          q: "Co strona ma zrobić przede wszystkim?",
          options: [
            { label: "Istnieć, budzić zaufanie, zbierać zapytania", weight: 0 },
            { label: "Wyjaśnić kilka usług i zbudować zaufanie", weight: 1 },
            { label: "Sprzedawać, rezerwować lub prowadzić konta", weight: 2 },
          ],
        },
        {
          q: "Ile masz treści?",
          options: [
            { label: "Jedna strona wystarczy", weight: 0 },
            { label: "Kilka podstron", weight: 1 },
            { label: "Katalog, który wciąż rośnie", weight: 2 },
          ],
        },
        {
          q: "Kiedy chcesz być online?",
          options: [
            { label: "W tym tygodniu", weight: 0 },
            { label: "Za dwa, trzy tygodnie", weight: 1 },
            { label: "Kiedy będzie naprawdę dobrze", weight: 2 },
          ],
        },
      ],
      resultLabel: "TWÓJ PUNKT STARTU",
      resultNote: "To rekomendacja, nie limit. Prawdziwy zakres ustalamy na rozmowie.",
      cta: "Zacznij od tego pakietu",
    },
  },

  care: {
    kicker: "Opieka",
    title: "Strona to ogród,//nie pomnik.",
    lede: "Opcjonalne wsparcie dopasowane do tempa zmian w Twojej firmie. Rezygnacja w każdej chwili.",
    choose: "Wybieram",
    items: [
      {
        name: "Jednorazowa aktualizacja",
        price: "$99",
        note: "ZA ZGŁOSZENIE",
        body: "Aktualizacja treści, nowa sekcja, poprawki układu, naprawa błędów lub drobna funkcja — kiedy tylko trzeba.",
      },
      {
        name: "Opieka miesięczna",
        price: "$79",
        note: "MIESIĘCZNIE",
        body: "Aktualizacje, kopie zapasowe, monitoring bezpieczeństwa, kontrola wydajności, zmiany treści i do dwóch godzin ulepszeń co miesiąc.",
      },
      {
        name: "Opieka premium",
        price: "$790",
        note: "ROCZNIE",
        body: "Priorytetowe wsparcie, nielimitowane aktualizacje bezpieczeństwa, automatyczne kopie, stały monitoring i ulepszenia. Dwa miesiące gratis.",
      },
    ],
  },

  studio: {
    kicker: "Studio",
    title: "Jedna osoba.//Pełna odpowiedzialność.",
    body: "Jestem fullstack developerką z prawie trzyletnim doświadczeniem komercyjnym. Pracowałam przy ponad 100 aplikacjach mobilnych, budowałam systemy komponentów, integrowałam API i wdrażałam funkcje produkcyjne w zespołach Agile. Wykształcenie Data Science pozwala mi czytać stronę jako system z mierzalnym wynikiem, a nie tylko jako obrazek.",
    points: [
      { n: "01", label: "Licencjat z wyróżnieniem z Data Science" },
      { n: "02", label: "Program Fullstack Developer, GoIT" },
      { n: "03", label: "Doświadczenie komercyjne i freelance" },
      { n: "04", label: "Angielski · ukraiński · polski · rosyjski" },
    ],
    badge: { value: "3+", label: "lata doświadczenia komercyjnego" },
    cta: "Pracuj ze mną",
    signature: "Veronika Petrushka — założycielka, projektantka i deweloperka",
  },

  signals: {
    kicker: "Sygnały zaufania",
    title: "Co mówią klienci.",
    reviews: [
      {
        quote: "Veronika szybko zrozumiała biznes i zamieniła nasze rozproszone pomysły w przejrzystą stronę, z której klienci realnie korzystają.",
        name: "Anna K.",
        role: "Właścicielka salonu beauty",
      },
      {
        quote: "Komunikacja była jasna, każdy etap wyjaśniony, a efekt wygląda znacznie bardziej profesjonalnie niż poprzednia strona.",
        name: "Marek P.",
        role: "Konsultant nieruchomości",
      },
      {
        quote: "Strona świetnie działa na telefonie, a proces zamówienia jest prosty. Każda zmiana przyszła dokładnie tak, jak ustaliliśmy.",
        name: "Sofia D.",
        role: "Założycielka marki",
      },
    ],
  },

  faq: {
    kicker: "Jasność",
    title: "Odpowiedzi jeszcze przed//pierwszą fakturą.",
    lede: "Pytania, które słyszę najczęściej — odpowiedzi takie same, jakich udzieliłabym przez telefon.",
    items: [
      ["Ile kosztuje strona internetowa?", "To zależy od zakresu i funkcji. Light od $399, Basic od $899, Pro od $1,699. Pisemną wycenę otrzymujesz przed startem prac, a uzgodniona kwota się nie zmienia."],
      ["Ile trwa realizacja?", "Light zwykle 3–7 dni, Basic 10–14 dni, Pro 3–6 tygodni. Termin zależy też od tempa dostarczania treści i akceptacji."],
      ["Czy pomożesz z designem i pomysłami?", "Tak — to główna wartość. Nie potrzebujesz gotowego projektu. Przygotowuję strukturę stron, kierunek wizualny, pomysły na treść i rekomendacje oparte na tym, co będzie najczytelniejsze dla Twoich klientów."],
      ["Czy strona zwiększy rozpoznawalność firmy?", "To jeden z głównych celów. Wyrazista, profesjonalna obecność jasno pokazuje Twoją wartość, buduje zaufanie i ułatwia lokalnym klientom zapamiętanie Cię."],
      ["Czy przeprojektujesz moją obecną stronę?", "Tak. Unowocześniam styl, naprawiam wersję mobilną, porządkuję treści, zwiększam czytelność i usuwam problemy techniczne."],
      ["Czy będzie działać na telefonach i tabletach?", "Tak. Każdy pakiet obejmuje responsywny układ testowany na nowoczesnych komputerach, tabletach i smartfonach."],
      ["Czy będę mógł sam aktualizować stronę?", "Tak, jeśli zarządzanie treścią wchodzi w wybrane rozwiązanie. Dostajesz też krótką instrukcję aktualizacji tekstów, zdjęć, produktów i usług."],
      ["Czy jest wsparcie po wdrożeniu?", "Tak. Opcje jednorazowe, miesięczne i roczne obejmują aktualizacje, poprawki, kopie zapasowe, ulepszenia i pomoc techniczną. Opieka jest opcjonalna."],
      ["Czy pomożesz z domeną i hostingiem?", "Tak. Pomogę wybrać hosting, podłączyć domenę, skonfigurować wdrożenie i opublikować gotową stronę."],
      ["Czy można dodać płatności, rezerwacje, integracje?", "Tak. W zależności od projektu integruję płatności, formularze rezerwacji, kalendarze, mapy, newslettery, API, katalogi i własne procesy."],
      ["Czy SEO jest wliczone?", "Podstawowe SEO techniczne jest w każdym pakiecie: semantyczna struktura, metadane, optymalizacja mobilna, optymalizacja obrazów i wydajność. Głębsze SEO i dane strukturalne są w Pro."],
      ["Czego potrzebujesz ode mnie na start?", "Celów firmy, opisu usług, logo lub materiałów marki, przykładów, które Ci się podobają, oraz istniejących tekstów i zdjęć. Czego brakuje — zaproponuję strukturę i kierunek treści."],
      ["Czy pracujesz tylko z klientami w Polsce?", "Nie. Pracuję zdalnie z klientami z różnych krajów i komunikuję się po angielsku, ukraińsku i polsku."],
      ["Co się dzieje po wysłaniu formularza?", "Czytam zapytanie i zwykle odpowiadam w ciągu 24 godzin. Omawiamy cele, właściwy pakiet, termin i finalny zakres przed rozpoczęciem prac."],
      ["Dlaczego Ty, a nie agencja?", "Pracujesz bezpośrednio z osobą, która tworzy stronę, od pierwszego pomysłu po start. Bez account managera, bez briefu zgubionego po drodze i bez niespodziewanych faktur — z komercyjnym doświadczeniem deweloperskim za decyzjami projektowymi."],
    ],
    ctaTitle: "Masz jeszcze pytanie?",
    ctaText: "Opisz swoją firmę w dwóch zdaniach. Odpowiem uczciwie i zaproponuję najlepszy następny krok, bez zobowiązań.",
    ctaButton: "Zapytaj bezpośrednio",
  },

  launch: {
    kicker: "Kiedy będziesz gotowy",
    title: "Zbudujmy stronę, na którą//Twoja firma zasługuje.",
    body: "Napisz, czym się zajmujesz, czego potrzebujesz i mniej więcej kiedy chcesz wystartować. Odpowiem w ciągu 24 godzin z konkretną rekomendacją.",
    button: "Rozpocznij projekt",
    secondary: "Albo napisz bezpośrednio",
  },

  footer: {
    blurb: "Indywidualne projektowanie i tworzenie stron dla lokalnych firm i rozwijających się marek. Warszawa, praca zdalna na całym świecie.",
    contactLabel: "Kontakt",
    navLabel: "Nawigacja",
    studioLabel: "Studio",
    legal: "© 2026 Veronika Petrushka · WebNika Studio",
    built: "Zaprojektowane i zbudowane w Warszawie",
  },

  form: {
    eyebrow: "ZAPYTANIE O PROJEKT",
    title: "Rozpocznij projekt",
    intro: "Dwie minuty teraz oszczędzają tydzień później. Im więcej kontekstu, tym bardziej przydatna moja pierwsza odpowiedź.",
    planLabel: "Wybrana usługa",
    name: "Imię",
    email: "Email",
    phone: "Telefon (opcjonalnie)",
    business: "Rodzaj firmy",
    budgetLabel: "Orientacyjny budżet",
    budgets: ["Poniżej $500", "$500 – $1,000", "$1,000 – $2,000", "$2,000+", "Jeszcze nie wiem"],
    message: "Opisz potrzebną stronę",
    messagePlaceholder: "Czym się zajmujesz, kim są Twoi klienci, co strona ma osiągnąć i jakie przykłady Ci się podobają.",
    send: "Wyślij zapytanie",
    sending: "Wysyłanie…",
    success: "Dziękuję — zapytanie zostało wysłane. Odpowiem w ciągu 24 godzin.",
    error: "Nie udało się wysłać formularza. Napisz do mnie mailem, odezwę się od razu.",
    privacy: "Twoje dane służą wyłącznie do odpowiedzi na to zapytanie. Nigdy nie są udostępniane.",
  },
};

pl.pricing.plans = [
  {
    key: "light",
    name: "Light",
    price: "$399",
    badge: "Szybki start",
    for: "Nowym firmom, które potrzebują wiarygodnej obecności już w tym tygodniu.",
    desc: "Profesjonalna strona jednostronicowa, która buduje obecność i pozwala klientom zrozumieć ofertę w trzydzieści sekund.",
    eta: "3–7 dni",
    items: [
      "Indywidualny projekt one-page — bez szablonu",
      "Pełna responsywność: telefon, tablet, komputer",
      "Do 6 profesjonalnie ułożonych sekcji",
      "Formularz kontaktowy, Google Maps i social media",
      "Podstawowe SEO on-page pod Google",
      "Optymalizacja wydajności i ładowania",
      "Integracja z Google Analytics",
      "Podstawowe zabezpieczenia i ochrona przed spamem",
      "Gotowość na motyw jasny i ciemny",
      "Publikacja na Twojej domenie i hostingu",
      "1 runda poprawek",
      "30 dni wsparcia po starcie",
    ],
  },
  {
    key: "basic",
    name: "Basic",
    price: "$899",
    badge: "Najczęściej wybierany",
    for: "Firmom, które mają kilka usług do porządnego wyjaśnienia.",
    desc: "Kompletna strona wielopodstronowa, która buduje zaufanie, przedstawia usługi we właściwej kolejności i zamienia odwiedzających w zapytania.",
    eta: "10–14 dni",
    items: [
      "2–5 w pełni indywidualnych podstron",
      "Unikalny projekt UI/UX dopasowany do marki",
      "Podstrony usług, portfolio, galerii i FAQ",
      "Formularze kontaktu, rezerwacji lub zamówień",
      "Integracja Google Maps i social media",
      "Prosty CMS do samodzielnej edycji treści",
      "Przemyślane animacje i interakcje",
      "Zaawansowana responsywność",
      "SEO zwiększające widoczność w Google",
      "Konfiguracja Google Analytics i Search Console",
      "Optymalizacja wydajności (cel 90+ Lighthouse)",
      "Publikacja na Twojej domenie i hostingu",
      "2 rundy poprawek",
      "60 dni wsparcia po starcie",
    ],
  },
  {
    key: "pro",
    name: "Pro",
    price: "Od $1,699",
    badge: "Projekt indywidualny",
    for: "Firmom, którym strona ma wykonywać realną pracę.",
    desc: "W pełni indywidualna strona lub aplikacja webowa z zaawansowanymi funkcjami, automatyzacją i integracjami wokół Twojej operacji.",
    eta: "3–6 tygodni",
    items: [
      "Nielimitowana liczba podstron",
      "Całkowicie autorski system UI/UX",
      "Sklep internetowy, rezerwacje lub booking",
      "Katalog produktów lub usług z filtrami",
      "Panel klienta lub panel administracyjny",
      "Integracja bezpiecznych płatności online",
      "Integracje API z zewnętrznymi systemami",
      "Logowanie i konta użytkowników",
      "Zaawansowane wyszukiwanie i dynamiczne treści",
      "Praca nad Core Web Vitals i wydajnością",
      "Zaawansowane SEO i dane strukturalne",
      "Analityka, Search Console i śledzenie konwersji",
      "Konfiguracja domeny, hostingu i wdrożenie",
      "3 rundy poprawek",
      "90 dni wsparcia po starcie",
    ],
  },
];

export const copy = { en, uk, pl };
export default copy;
