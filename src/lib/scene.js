/* ------------------------------------------------------------------
   THE OBJECT — WebNika Studio's single continuous 3D world
   ------------------------------------------------------------------
   One particle set. Five states. Scroll is the only sculptor.

     0  NEBULA   chaos ................ hero / the unformed idea
     1  HELIX    alignment ............ premise & capabilities
     2  LATTICE  structure ............ selected work
     3  FACADE   the built thing ...... method & investment
     4  PORTAL   launch ............... studio, faq, final CTA

   Nothing is ever added or removed — the same 4096 particles are
   re-ordered. That IS the studio's pitch, performed rather than stated.

   Technology notes
   ----------------
   · three.js r128 loaded from CDN at runtime (no bundler dependency,
     no extra install step, cached across the web).
   · A single THREE.Points draw call + one additive "bloom echo" pass +
     one mirrored "reflection" pass. Three draw calls total.
   · All morphing happens on the GPU in the vertex shader. The CPU only
     writes four uniforms per frame.
   · Degrades: high → mid → low → static frame → CSS constellation.
------------------------------------------------------------------- */

const THREE_CDN = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";

let threePromise = null;

export function loadThree() {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.THREE) return Promise.resolve(window.THREE);
  if (threePromise) return threePromise;

  threePromise = new Promise((resolve, reject) => {
    const existing = document.querySelector("script[data-webnika-three]");
    if (existing) {
      existing.addEventListener("load", () => (window.THREE ? resolve(window.THREE) : reject(new Error("three missing"))), { once: true });
      existing.addEventListener("error", () => reject(new Error("three failed")), { once: true });
      return;
    }
    const el = document.createElement("script");
    el.src = THREE_CDN;
    el.async = true;
    el.crossOrigin = "anonymous";
    el.dataset.webnikaThree = "true";
    el.onload = () => (window.THREE ? resolve(window.THREE) : reject(new Error("three missing")));
    el.onerror = () => reject(new Error("three failed"));
    document.head.appendChild(el);
  });

  return threePromise;
}

/* ---------------------------------------------------------------- */
/* Quality tiers                                                     */
/* ---------------------------------------------------------------- */

export function detectQuality() {
  if (typeof window === "undefined") return "off";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return "static";

  const conn = navigator.connection || {};
  if (conn.saveData) return "static";
  if (typeof conn.effectiveType === "string" && /(^|-)2g$/.test(conn.effectiveType)) return "static";

  const mem = navigator.deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;
  const w = window.innerWidth;

  if (mem <= 2 || cores <= 2) return "low";
  if (w < 700) return "low";
  if (w < 1100 || mem <= 4) return "mid";
  return "high";
}

const TIERS = {
  high: { cube: 16, dpr: 1.75, reflection: true, echo: true, fps: 0 },
  mid: { cube: 12, dpr: 1.4, reflection: false, echo: true, fps: 0 },
  low: { cube: 8, dpr: 1.15, reflection: false, echo: false, fps: 34 },
  static: { cube: 12, dpr: 1.25, reflection: false, echo: true, fps: -1 },
};

/* ---------------------------------------------------------------- */
/* Camera choreography — keyframes across scroll progress 0 → 1      */
/* ---------------------------------------------------------------- */

const CAMERA_PATH = [
  { p: 0.00, pos: [0.0, 0.35, 9.4], look: [0.0, 0.0, 0.0], fov: 46 },
  { p: 0.16, pos: [1.7, 0.9, 7.6], look: [0.0, 0.1, 0.0], fov: 44 },
  { p: 0.34, pos: [-2.1, 1.4, 6.6], look: [0.0, 0.0, 0.0], fov: 42 },
  { p: 0.52, pos: [0.0, 2.6, 6.9], look: [0.0, -0.2, 0.0], fov: 40 },
  { p: 0.70, pos: [2.4, 0.4, 6.2], look: [0.0, 0.0, 0.0], fov: 40 },
  { p: 0.86, pos: [-1.2, -0.6, 7.2], look: [0.0, 0.2, 0.0], fov: 43 },
  { p: 1.00, pos: [0.0, 0.2, 10.6], look: [0.0, 0.0, 0.0], fov: 48 },
];

function sampleCamera(p) {
  const clamped = Math.max(0, Math.min(1, p));
  let a = CAMERA_PATH[0];
  let b = CAMERA_PATH[CAMERA_PATH.length - 1];
  for (let i = 0; i < CAMERA_PATH.length - 1; i += 1) {
    if (clamped >= CAMERA_PATH[i].p && clamped <= CAMERA_PATH[i + 1].p) {
      a = CAMERA_PATH[i];
      b = CAMERA_PATH[i + 1];
      break;
    }
  }
  const span = b.p - a.p || 1;
  const raw = (clamped - a.p) / span;
  const t = raw * raw * (3 - 2 * raw); // smoothstep
  return {
    pos: [
      a.pos[0] + (b.pos[0] - a.pos[0]) * t,
      a.pos[1] + (b.pos[1] - a.pos[1]) * t,
      a.pos[2] + (b.pos[2] - a.pos[2]) * t,
    ],
    look: [
      a.look[0] + (b.look[0] - a.look[0]) * t,
      a.look[1] + (b.look[1] - a.look[1]) * t,
      a.look[2] + (b.look[2] - a.look[2]) * t,
    ],
    fov: a.fov + (b.fov - a.fov) * t,
  };
}

/* ---------------------------------------------------------------- */
/* Shaders                                                           */
/* ---------------------------------------------------------------- */

const VERTEX = `
precision highp float;

attribute float aIndex;
attribute vec3 aSeed;

uniform float uTime;
uniform float uForm;
uniform float uCube;
uniform float uSize;
uniform float uDpr;
uniform float uOpacity;
uniform float uDrift;
uniform vec3  uPointer;
uniform float uPointerAmp;
uniform float uPulse;
uniform float uPulseAmp;
uniform vec3  uWarm;
uniform vec3  uCool;
uniform float uMirror;

varying vec3  vColor;
varying float vAlpha;
varying float vEnergy;

const float TAU = 6.28318530718;

float hash11(float n) {
  return fract(sin(n * 127.1) * 43758.5453123);
}

/* ---- FORM 0 — NEBULA: an unresolved cloud -------------------- */
vec3 formNebula(vec3 s, float i) {
  float theta = s.x * TAU;
  float phi = acos(clamp(s.y * 2.0 - 1.0, -1.0, 1.0));
  float r = 2.6 + s.z * 2.4;
  vec3 p = vec3(
    r * sin(phi) * cos(theta),
    r * cos(phi) * 0.72,
    r * sin(phi) * sin(theta)
  );
  float t = uTime * 0.16;
  p += vec3(
    sin(t + s.x * 9.0) * 0.55,
    cos(t * 1.2 + s.y * 7.0) * 0.42,
    sin(t * 0.8 + s.z * 11.0) * 0.55
  );
  return p;
}

/* ---- FORM 1 — HELIX: the first alignment --------------------- */
vec3 formHelix(vec3 s, float i) {
  float branch = step(0.5, s.x) * 3.14159265;
  float a = i * TAU * 3.2 + branch + uTime * 0.10;
  float rad = 1.75 + s.z * 0.20;
  float y = (i - 0.5) * 7.6;
  vec3 p = vec3(cos(a) * rad, y, sin(a) * rad);
  /* a few particles form the connecting rungs */
  float rung = step(0.94, s.y);
  p = mix(p, vec3(cos(a) * rad * (s.z * 2.0 - 1.0), y, sin(a) * rad * (s.z * 2.0 - 1.0)), rung);
  return p;
}

/* ---- FORM 2 — LATTICE: pure structure ------------------------ */
vec3 formLattice(vec3 s, float i) {
  float n = uCube;
  float k = floor(aIndex + 0.5);
  float ix = mod(k, n);
  float iy = mod(floor(k / n), n);
  float iz = floor(k / (n * n));
  float gap = 4.6 / max(n - 1.0, 1.0);
  vec3 p = vec3(ix, iy, iz) * gap - vec3(2.3);
  float breathe = sin(uTime * 0.5 + (ix + iy + iz) * 0.35) * 0.045;
  return p + normalize(p + 0.0001) * breathe;
}

/* ---- FORM 3 — FACADE: the built interface -------------------- */
vec3 formFacade(vec3 s, float i) {
  float n = uCube;
  float k = floor(aIndex + 0.5);
  float total = n * n * n;
  float band = min(floor(i * 8.0), 7.0); /* 8 horizontal content bands */
  float within = fract(i * 8.0);

  float w = 4.3;
  float h = 2.9;

  /* the frame: outer 22% of particles trace the screen border */
  float isFrame = step(0.78, s.x);
  float per = fract(k / total * 4.0);
  vec3 frame;
  float e = mod(floor(k / total * 4.0), 4.0);
  if (e < 1.0)       frame = vec3(-w * 0.5 + per * w, h * 0.5, 0.0);
  else if (e < 2.0)  frame = vec3(w * 0.5, h * 0.5 - per * h, 0.0);
  else if (e < 3.0)  frame = vec3(w * 0.5 - per * w, -h * 0.5, 0.0);
  else               frame = vec3(-w * 0.5, -h * 0.5 + per * h, 0.0);

  /* the content: staggered bars, like text blocks on a page */
  float bandW = mix(0.30, 0.94, hash11(band * 3.7));
  float x = (within - 0.5) * w * bandW - w * 0.02;
  float y = h * 0.5 - 0.30 - band * (h - 0.55) / 7.0;
  vec3 content = vec3(x, y, 0.0);

  vec3 p = mix(content, frame, isFrame);
  p.z += (s.z - 0.5) * 0.10;
  p.z += sin(uTime * 0.6 + i * 12.0) * 0.03;
  return p;
}

/* ---- FORM 4 — PORTAL: launch --------------------------------- */
vec3 formPortal(vec3 s, float i) {
  float ringMask = step(0.42, s.y);
  float a = i * TAU * 1.0 + uTime * 0.22;
  float rad = 2.35 + (s.z - 0.5) * 0.16;
  vec3 ring = vec3(cos(a) * rad, sin(a) * rad, (s.x - 0.5) * 0.22);

  /* the beam: a rising column through the ring */
  float ry = (fract(i * 7.0 + uTime * 0.14) - 0.5) * 9.0;
  float rr = (s.z * 0.9) * (1.0 - abs(ry) / 6.0);
  float ba = s.x * TAU;
  vec3 beam = vec3(cos(ba) * rr, ry, sin(ba) * rr);

  return mix(beam, ring, ringMask);
}

vec3 formAt(int idx, vec3 s, float i) {
  if (idx <= 0) return formNebula(s, i);
  if (idx == 1) return formHelix(s, i);
  if (idx == 2) return formLattice(s, i);
  if (idx == 3) return formFacade(s, i);
  return formPortal(s, i);
}

void main() {
  float i = aIndex / max(uCube * uCube * uCube - 1.0, 1.0);
  float h = hash11(aIndex * 0.137);

  float f = clamp(uForm, 0.0, 3.999);
  int idxA = int(floor(f));
  int idxB = idxA + 1;
  float raw = fract(f);

  /* per-particle stagger — the morph cascades instead of snapping */
  float t = clamp((raw - h * 0.34) / 0.66, 0.0, 1.0);
  t = t * t * (3.0 - 2.0 * t);

  vec3 a = formAt(idxA, aSeed, i);
  vec3 b = formAt(idxB, aSeed, i);
  vec3 pos = mix(a, b, t);

  /* ambient drift keeps the world alive between states */
  pos += vec3(
    sin(uTime * 0.33 + aSeed.x * 6.0),
    cos(uTime * 0.29 + aSeed.y * 6.0),
    sin(uTime * 0.37 + aSeed.z * 6.0)
  ) * uDrift * (0.25 + h * 0.75);

  /* pointer magnetism — the object notices you */
  vec3 toP = uPointer - pos;
  float pd = length(toP);
  pos += (toP / max(pd, 0.001)) * exp(-pd * pd * 0.10) * uPointerAmp;

  /* click pulse — a shockwave travelling outward */
  float rl = length(pos);
  float wave = exp(-pow(rl - uPulse * 7.0, 2.0) * 0.7) * uPulseAmp;
  pos += (pos / max(rl, 0.001)) * wave;

  /* mirrored reflection pass */
  pos.y = mix(pos.y, -pos.y - 3.4, uMirror);

  /* energy: how far this particle still has to travel.
     hot amber = unresolved, cool ice = settled. */
  float travel = length(b - a);
  float energy = clamp(travel * 0.11 * (4.0 * t * (1.0 - t)) + (1.0 - f / 4.0) * 0.42 + wave * 1.4, 0.0, 1.0);

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;

  float size = uSize * (0.52 + energy * 0.95) * (1.0 + h * 0.38);
  gl_PointSize = size * uDpr * (11.0 / max(-mv.z, 0.6));

  float depthFade = smoothstep(24.0, 5.0, -mv.z);
  vColor = mix(uCool, uWarm, energy);
  vEnergy = energy;
  vAlpha = uOpacity * depthFade * (0.42 + h * 0.58) * mix(1.0, 0.22, uMirror);
}
`;

const FRAGMENT = `
precision highp float;

varying vec3  vColor;
varying float vAlpha;
varying float vEnergy;

void main() {
  vec2 uv = gl_PointCoord - vec2(0.5);
  float d = length(uv);
  if (d > 0.5) discard;
  /* A soft disc, not a lamp. The halo term is deliberately weaker than
     the core so that overlapping sprites accumulate slowly instead of
     saturating to white. */
  float core = smoothstep(0.5, 0.0, d);
  float halo = smoothstep(0.5, 0.20, d);
  float a = vAlpha * (core * 0.42 + halo * 0.36);
  vec3 c = vColor + vec3(vEnergy * 0.09);
  gl_FragColor = vec4(c, a);
}
`;

/* ---------------------------------------------------------------- */
/* Palettes                                                          */
/* ---------------------------------------------------------------- */

/* Blending has to differ by theme. Additive light can only ever brighten,
   which is right on ink and useless on paper — on a light ground it adds
   nothing and the object disappears. Light theme therefore draws dark
   particles with normal alpha compositing, and drops the additive bloom
   echo entirely (there is nothing to bloom into). */
const PALETTE = {
  dark: {
    warm: [1.0, 0.47, 0.13],
    cool: [0.24, 0.66, 0.84],
    opacity: 0.78,
    echo: 0.26,
    mirror: 0.26,
    scaffold: 0.16,
    additive: true,
  },
  light: {
    warm: [0.58, 0.18, 0.01],
    cool: [0.02, 0.22, 0.34],
    opacity: 0.95,
    echo: 0,
    mirror: 0.22,
    scaffold: 0.26,
    additive: false,
  },
};

/* ---------------------------------------------------------------- */
/* Public factory                                                    */
/* ---------------------------------------------------------------- */

export function createObjectScene(options) {
  const canvas = options.canvas;
  const tierName = options.quality || detectQuality();
  const tier = TIERS[tierName] || TIERS.mid;
  const onReady = options.onReady || function noop() {};
  const onFail = options.onFail || function noop() {};

  let disposed = false;
  let running = false;
  let raf = 0;
  let lastFrame = 0;
  let THREE = null;
  let renderer = null;
  let scene = null;
  let camera = null;
  let points = null;
  let echo = null;
  let mirror = null;
  let uniforms = null;
  let scaffold = null;

  /* state driven from React */
  const state = {
    progress: 0,
    targetProgress: 0,
    form: 0,
    targetForm: 0,
    pointerX: 0,
    pointerY: 0,
    smoothX: 0,
    smoothY: 0,
    pointerAmp: 0,
    targetPointerAmp: 0,
    pulse: 3,
    pulseAmp: 0,
    dark: options.dark !== false,
    time: 0,
  };

  function buildGeometry() {
    const n = tier.cube;
    const count = n * n * n;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const index = new Float32Array(count);
    const seed = new Float32Array(count * 3);

    for (let k = 0; k < count; k += 1) {
      index[k] = k;
      seed[k * 3 + 0] = Math.random();
      seed[k * 3 + 1] = Math.random();
      seed[k * 3 + 2] = Math.random();
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aIndex", new THREE.BufferAttribute(index, 1));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seed, 3));
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 14);
    return geometry;
  }

  function makeMaterial(sizeScale, opacityScale, mirrorFlag) {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: uniforms.uTime,
        uForm: uniforms.uForm,
        uCube: uniforms.uCube,
        uDpr: uniforms.uDpr,
        uDrift: uniforms.uDrift,
        uPointer: uniforms.uPointer,
        uPointerAmp: uniforms.uPointerAmp,
        uPulse: uniforms.uPulse,
        uPulseAmp: uniforms.uPulseAmp,
        uWarm: uniforms.uWarm,
        uCool: uniforms.uCool,
        uSize: { value: uniforms.uSize.value * sizeScale },
        uOpacity: { value: uniforms.uOpacity.value * opacityScale },
        uMirror: { value: mirrorFlag },
      },
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: (state.dark ? PALETTE.dark : PALETTE.light).additive
        ? THREE.AdditiveBlending
        : THREE.NormalBlending,
    });
  }

  function applyTheme() {
    const p = state.dark ? PALETTE.dark : PALETTE.light;
    const blending = p.additive ? THREE.AdditiveBlending : THREE.NormalBlending;

    uniforms.uWarm.value.set(p.warm[0], p.warm[1], p.warm[2]);
    uniforms.uCool.value.set(p.cool[0], p.cool[1], p.cool[2]);
    uniforms.uOpacity.value = p.opacity;

    const retune = (mesh, opacity) => {
      if (!mesh) return;
      mesh.material.uniforms.uOpacity.value = opacity;
      mesh.material.blending = blending;
      mesh.material.needsUpdate = true;
    };

    retune(points, p.opacity);
    retune(echo, p.echo);
    retune(mirror, p.opacity * p.mirror);

    /* the bloom echo is an additive-only trick — hide it on paper */
    if (echo) echo.visible = p.echo > 0;
    if (scaffold) scaffold.material.opacity = p.scaffold;
  }

  function resize() {
    if (!renderer || !camera || !canvas) return;
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, tier.dpr);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    uniforms.uDpr.value = dpr;
    if (tierName === "static") renderOnce();
  }

  function updateCamera(p) {
    const key = sampleCamera(p);
    const breath = state.time;
    const px = state.smoothX;
    const py = state.smoothY;
    camera.position.set(
      key.pos[0] + px * 1.15 + Math.sin(breath * 0.31) * 0.10,
      key.pos[1] + py * -0.85 + Math.cos(breath * 0.24) * 0.08,
      key.pos[2] + Math.sin(breath * 0.19) * 0.06
    );
    camera.lookAt(key.look[0] + px * 0.25, key.look[1] + py * -0.18, key.look[2]);
    if (Math.abs(camera.fov - key.fov) > 0.01) {
      camera.fov = key.fov;
      camera.updateProjectionMatrix();
    }
  }

  function renderOnce() {
    if (!renderer || !scene || !camera) return;
    updateCamera(state.progress);
    renderer.render(scene, camera);
  }

  function frame(now) {
    if (disposed || !running) {
      raf = 0;
      return;
    }
    raf = requestAnimationFrame(frame);

    if (tier.fps > 0) {
      if (now - lastFrame < 1000 / tier.fps) return;
    }
    const dt = Math.min((now - lastFrame) / 1000 || 0.016, 0.05);
    lastFrame = now;
    state.time += dt;

    /* eased followers — never snap, always glide */
    state.progress += (state.targetProgress - state.progress) * 0.075;
    state.form += (state.targetForm - state.form) * 0.055;
    state.smoothX += (state.pointerX - state.smoothX) * 0.045;
    state.smoothY += (state.pointerY - state.smoothY) * 0.045;
    state.pointerAmp += (state.targetPointerAmp - state.pointerAmp) * 0.06;

    if (state.pulseAmp > 0.001) {
      state.pulse += dt * 0.55;
      state.pulseAmp *= 0.955;
      if (state.pulse > 3.2) state.pulseAmp = 0;
    }

    uniforms.uTime.value = state.time;
    uniforms.uForm.value = state.form;
    uniforms.uPointerAmp.value = state.pointerAmp;
    uniforms.uPulse.value = state.pulse;
    uniforms.uPulseAmp.value = state.pulseAmp;
    uniforms.uPointer.value.set(state.smoothX * 5.2, state.smoothY * -3.4, 1.4);
    uniforms.uDrift.value = 0.06 + (1 - Math.min(state.form / 3, 1)) * 0.16;

    if (scaffold) {
      const near = 1 - Math.min(Math.abs(state.form - 2.5) / 1.5, 1);
      scaffold.material.opacity = near * (state.dark ? 0.18 : 0.28);
      scaffold.rotation.y = state.time * 0.045;
      scaffold.visible = near > 0.01;
    }

    updateCamera(state.progress);
    renderer.render(scene, camera);
  }

  function start() {
    if (disposed || running || tierName === "static") return;
    running = true;
    lastFrame = performance.now();
    if (!raf) raf = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  async function init() {
    try {
      THREE = await loadThree();
      if (disposed || !THREE) return;

      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: false,
        alpha: true,
        powerPreference: tierName === "high" ? "high-performance" : "low-power",
        stencil: false,
        depth: false,
      });
      renderer.setClearColor(0x000000, 0);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(46, 1, 0.1, 60);

      const p = state.dark ? PALETTE.dark : PALETTE.light;
      uniforms = {
        uTime: { value: 0 },
        uForm: { value: 0 },
        uCube: { value: tier.cube },
        uSize: { value: tierName === "low" ? 5.4 : 4.2 },
        uDpr: { value: 1 },
        uOpacity: { value: p.opacity },
        uDrift: { value: 0.2 },
        uPointer: { value: new THREE.Vector3(0, 0, 2) },
        uPointerAmp: { value: 0 },
        uPulse: { value: 3 },
        uPulseAmp: { value: 0 },
        uWarm: { value: new THREE.Vector3(p.warm[0], p.warm[1], p.warm[2]) },
        uCool: { value: new THREE.Vector3(p.cool[0], p.cool[1], p.cool[2]) },
      };

      const geometry = buildGeometry();

      points = new THREE.Points(geometry, makeMaterial(1, 1, 0));
      points.frustumCulled = false;
      scene.add(points);

      if (tier.echo) {
        echo = new THREE.Points(geometry, makeMaterial(2.6, p.echo / p.opacity, 0));
        echo.frustumCulled = false;
        scene.add(echo);
      }

      if (tier.reflection) {
        mirror = new THREE.Points(geometry, makeMaterial(1, 0.32, 1));
        mirror.frustumCulled = false;
        scene.add(mirror);
      }

      /* blueprint scaffold — visible only around the LATTICE state */
      const cageSource = new THREE.BoxGeometry(5.1, 5.1, 5.1);
      const cage = new THREE.EdgesGeometry(cageSource);
      cageSource.dispose();
      scaffold = new THREE.LineSegments(
        cage,
        new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 })
      );
      scaffold.visible = false;
      scene.add(scaffold);

      applyTheme();
      resize();
      onReady(tierName);

      if (tierName === "static") {
        state.form = 3;
        state.targetForm = 3;
        uniforms.uForm.value = 3;
        uniforms.uTime.value = 2.4;
        renderOnce();
      } else {
        start();
      }
    } catch (err) {
      onFail(err);
    }
  }

  init();

  return {
    tier: tierName,

    setProgress(p, form) {
      state.targetProgress = p;
      if (typeof form === "number") state.targetForm = form;
      if (tierName === "static") renderOnce();
    },

    setPointer(x, y) {
      state.pointerX = x;
      state.pointerY = y;
    },

    setPointerAmp(v) {
      state.targetPointerAmp = v;
    },

    pulse() {
      if (tierName === "static") return;
      state.pulse = 0;
      state.pulseAmp = 0.75;
    },

    setTheme(dark) {
      state.dark = dark;
      if (uniforms) applyTheme();
      if (tierName === "static") renderOnce();
    },

    resize,
    start,
    stop,

    dispose() {
      disposed = true;
      stop();
      if (points) {
        points.geometry.dispose();
        points.material.dispose();
      }
      if (echo) echo.material.dispose();
      if (mirror) mirror.material.dispose();
      if (scaffold) {
        scaffold.geometry.dispose();
        scaffold.material.dispose();
      }
      if (renderer) {
        renderer.dispose();
        if (renderer.forceContextLoss) renderer.forceContextLoss();
      }
      points = null;
      echo = null;
      mirror = null;
      scaffold = null;
      renderer = null;
      scene = null;
      camera = null;
    },
  };
}

/* Scroll progress → form index (0…4).
   Deliberately non-linear: the object holds a state while a chapter is
   being read, then morphs quickly during the gap between chapters. */
export function formFromProgress(p) {
  const stops = [
    { at: 0.00, form: 0 },
    { at: 0.11, form: 0 },
    { at: 0.22, form: 1 },
    { at: 0.36, form: 1 },
    { at: 0.46, form: 2 },
    { at: 0.58, form: 2 },
    { at: 0.68, form: 3 },
    { at: 0.82, form: 3 },
    { at: 0.92, form: 4 },
    { at: 1.00, form: 4 },
  ];
  const c = Math.max(0, Math.min(1, p));
  for (let i = 0; i < stops.length - 1; i += 1) {
    const a = stops[i];
    const b = stops[i + 1];
    if (c >= a.at && c <= b.at) {
      const span = b.at - a.at || 1;
      const t = (c - a.at) / span;
      return a.form + (b.form - a.form) * (t * t * (3 - 2 * t));
    }
  }
  return 4;
}
