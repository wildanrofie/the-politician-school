// Menang Politik — behaviour for the landing page (reveals, stack, canvases).
// Runs once in the browser after app/page.tsx has rendered the markup.

export function initLanding() {
  if (typeof window === "undefined" || document.documentElement.dataset.mpInit) return;
  document.documentElement.dataset.mpInit = "1";

  "use strict";
  history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
  document.documentElement.classList.add("js");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const clamp01 = (v) => Math.min(1, Math.max(0, v));
  const ACCENT = [138, 163, 232], BRIGHT = [200, 212, 248], NAVY = [18, 36, 90];
  const rgba = (c, a) => `rgb(${c[0]} ${c[1]} ${c[2]} / ${a})`;

  /* ---------- one ticker ---------- */
  const subs = new Set();
  let rafId = 0;
  const loop = (t) => { for (const s of [...subs]) s(t); rafId = subs.size ? requestAnimationFrame(loop) : 0; };
  const sub = (fn) => { subs.add(fn); if (!rafId) rafId = requestAnimationFrame(loop); return () => subs.delete(fn); };
  // run fn only while el is on screen (plus ten frames)
  const whileVisible = (el, fn) => {
    let off = null, grace = 0, vis = false;
    const tick = (t) => { if (!vis && --grace <= 0) { off && off(); off = null; return; } fn(t); };
    new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis) { grace = 10; if (!off) off = sub(tick); } else grace = 10; }).observe(el);
  };

  /* ---------- text split ---------- */
  document.querySelectorAll("[data-split]").forEach((el) => {
    const mode = el.dataset.split, stagger = +el.dataset.stagger || 60, base = +el.dataset.delay || 0;
    const plain = el.textContent.trim().replace(/\s+/g, " ");
    const extra = [...el.querySelectorAll(".dot")].map((d) => { d.remove(); return d; });
    const text = el.textContent.trim().replace(/\s+/g, " ");
    el.textContent = "";
    if (!el.classList.contains("split")) el.classList.add("split");
    if (mode === "letters") el.classList.add("letters");
    const sr = document.createElement("span"); sr.className = "sr"; sr.textContent = plain; el.appendChild(sr);
    const units = mode === "letters" ? [...text] : text.split(" ");
    let i = 0;
    units.forEach((u) => {
      const s = document.createElement("span"); s.className = "u"; s.setAttribute("aria-hidden", "true");
      s.textContent = u === " " ? " " : u; s.style.setProperty("--d", base + i++ * stagger + "ms"); el.appendChild(s);
    });
    const lastU = el.lastElementChild;
    extra.forEach((d) => { d.classList.add("u"); d.style.setProperty("--d", base + i * stagger + 110 + "ms"); (lastU && lastU.classList.contains("u") ? lastU : el).appendChild(d); });
  });

  /* ---------- reveals (forward: play once, hold) ---------- */
  const heroEls = [...document.querySelectorAll("[data-hero-in]")];
  heroEls.forEach((el) => {
    const d = +el.dataset.heroIn;
    if (el.dataset.split) el.querySelectorAll(".u").forEach((u) => u.style.setProperty("--d", d + parseFloat(u.style.getPropertyValue("--d")) + "ms"));
    else el.style.setProperty("--d", d + "ms");
  });
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    e.target.querySelectorAll(".rule").forEach((r) => r.classList.add("in"));
    io.unobserve(e.target);
  }), { rootMargin: "0px 0px -2% 0px" });
  const watchReveals = () => document.querySelectorAll("[data-split], [data-rise], [data-group]").forEach((el) => { if (!el.hasAttribute("data-hero-in")) io.observe(el); });

  /* ---------- veil & hero entrance ---------- */
  const veil = document.getElementById("veil");
  const setP = (p) => { veil.style.setProperty("--p", p); };
  let prog = 0, target = 0.7;
  const creep = sub(() => { prog += (target - prog) * (target < 1 ? 0.03 : 0.18); setP(prog.toFixed(4)); });
  const heroPhoto = document.getElementById("heroPhoto");
  heroPhoto.style.setProperty("--rise", "200px");
  const imgReady = new Promise((res) => { const im = new Image(); im.onload = im.onerror = res; im.src = (getComputedStyle(document.documentElement).getPropertyValue("--rio").match(/url\(["']?(.*?)["']?\)/) || [, "/rio.webp"])[1]; });
  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  Promise.race([Promise.all([imgReady, fontsReady]), new Promise((r) => setTimeout(r, 2500))]).then(() => {
    target = 1;
    setTimeout(() => {
      veil.classList.add("clear"); veil.setAttribute("aria-label", "Selesai memuat");
      setTimeout(() => {
        veil.classList.add("lift"); creep();
        heroPhoto.style.setProperty("--rise", "0px");
        heroEls.forEach((el) => el.classList.add("in"));
        watchReveals();
        const done = () => { if (+getComputedStyle(veil).opacity <= 0.004) veil.remove(); else requestAnimationFrame(done); };
        requestAnimationFrame(done); setTimeout(() => veil.isConnected && veil.remove(), 3000);
      }, 430 + 240);
    }, 250);
  });

  /* ---------- sticky stack recede ---------- */
  const layers = [...document.querySelectorAll("#stack > .layer")];
  const pinned = layers.slice(0, -1).map((l, i) => ({ inner: l.querySelector(".layer-inner"), shade: l.querySelector(".shade"), next: layers[i + 1] }));
  const phone = matchMedia("(max-width: 639px)");
  let queued = false;
  const recede = () => {
    queued = false;
    const vh = innerHeight || 1, shrink = phone.matches ? 0 : 0.1;
    for (const { inner, shade, next } of pinned) {
      const p = clamp01(1 - next.getBoundingClientRect().top / vh);
      inner.style.transform = p > 0 && shrink > 0 ? `scale(${1 - shrink * p})` : "";
      shade.style.opacity = 0.55 * p;
      inner.style.visibility = p >= 1 ? "hidden" : "visible";
    }
  };
  addEventListener("scroll", () => { if (!queued) { queued = true; requestAnimationFrame(recede); } }, { passive: true });

  /* ---------- contour field (marching squares) ---------- */
  const field = (x, y, t) => {
    let f = Math.sin(x + t * 0.6) * 0.5;
    f += Math.sin(y * 0.85 - t * 0.45) * 0.45;
    f += Math.sin((x + y) * 0.65 + t * 0.35) * 0.35;
    f += Math.sin((x - y) * 0.95 - t * 0.55) * 0.25;
    return f * 0.5 + 0.5;
  };
  const fitCanvas = (c) => {
    const r = Math.min(devicePixelRatio || 1, 2), w = c.clientWidth, h = c.clientHeight;
    if (c.width !== Math.round(w * r) || c.height !== Math.round(h * r)) { c.width = Math.round(w * r); c.height = Math.round(h * r); }
    const ctx = c.getContext("2d"); ctx.setTransform(r, 0, 0, r, 0, 0); return [ctx, w, h];
  };
  const drawContours = (ctx, width, height, t, colour) => {
    const CELLS = 96, COUNT = 2.5, SCALE = 3.8, WAVE = 0.37;
    const cols = width >= height ? CELLS : Math.max(8, Math.round((CELLS * width) / height));
    const rows = Math.max(8, Math.round((cols * height) / width));
    const sx = width / cols, sy = height / rows, aspect = width / height;
    const v = new Float32Array((cols + 1) * (rows + 1));
    for (let j = 0; j <= rows; j++) for (let i = 0; i <= cols; i++) {
      const nx = ((i / cols) * 2 - 1) * aspect * SCALE, ny = ((j / rows) * 2 - 1) * SCALE;
      v[j * (cols + 1) + i] = field(nx + Math.sin(ny * 0.8 + t * 0.7) * WAVE, ny + Math.cos(nx * 0.7 - t * 0.6) * WAVE, t) * COUNT;
    }
    ctx.strokeStyle = colour; ctx.lineWidth = 1; ctx.beginPath();
    const seg = (p, q) => { ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); };
    for (let L = 0.5; L < COUNT; L += 1) for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const a = v[j * (cols + 1) + i], b = v[j * (cols + 1) + i + 1], c = v[(j + 1) * (cols + 1) + i + 1], d = v[(j + 1) * (cols + 1) + i];
      const k = (a > L ? 8 : 0) | (b > L ? 4 : 0) | (c > L ? 2 : 0) | (d > L ? 1 : 0);
      if (k === 0 || k === 15) continue;
      const x0 = i * sx, y0 = j * sy;
      const T = [x0 + sx * ((L - a) / (b - a)), y0], R = [x0 + sx, y0 + sy * ((L - b) / (c - b))];
      const B = [x0 + sx * ((L - d) / (c - d)), y0 + sy], Lf = [x0, y0 + sy * ((L - a) / (d - a))];
      switch (k) {
        case 1: case 14: seg(Lf, B); break; case 2: case 13: seg(B, R); break; case 3: case 12: seg(Lf, R); break;
        case 4: case 11: seg(T, R); break; case 6: case 9: seg(T, B); break; case 7: case 8: seg(Lf, T); break;
        case 5: seg(Lf, T); seg(B, R); break; case 10: seg(Lf, B); seg(T, R); break;
      }
    }
    ctx.stroke();
  };
  const start = performance.now();
  const contourLayer = (id, colour, extra) => {
    const c = document.getElementById(id); let last = 0;
    const paint = (now) => {
      const [ctx, w, h] = fitCanvas(c); ctx.clearRect(0, 0, w, h);
      extra && extra(ctx, w, h, now);
      drawContours(ctx, w, h, reduced ? 0 : ((now - start) / 1000) * 1.66, colour);
    };
    if (reduced) { paint(start); addEventListener("resize", () => paint(start)); return; }
    whileVisible(c, (now) => { if (now - last < 24) return; last = now; paint(now); });
  };

  // hero: the cursor's recent path squares the ground into a chequer
  const trail = [];
  const hero = document.querySelector("[data-hero]");
  if (finePointer && !reduced) hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect(); trail.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() });
    if (trail.length > 60) trail.shift();
  });
  contourLayer("heroField", "rgb(9 10 11 / 0.075)", (ctx, w, h, now) => {
    const CELL = 22, LIFE = 900;
    while (trail.length && now - trail[0].t > LIFE) trail.shift();
    if (!trail.length) return;
    const lit = new Map();
    for (const p of trail) {
      const life = 1 - (now - p.t) / LIFE, rad = 70 * life + 20;
      const i0 = Math.floor((p.x - rad) / CELL), i1 = Math.ceil((p.x + rad) / CELL), j0 = Math.floor((p.y - rad) / CELL), j1 = Math.ceil((p.y + rad) / CELL);
      for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
        if ((i + j) & 1) continue;
        const d = Math.hypot(i * CELL + CELL / 2 - p.x, j * CELL + CELL / 2 - p.y);
        if (d > rad) continue;
        const v = life * (1 - d / rad); const key = i + "," + j;
        if (!lit.has(key) || lit.get(key) < v) lit.set(key, v);
      }
    }
    for (const [key, v] of lit) {
      const [i, j] = key.split(",").map(Number);
      const hash = ((Math.imul(i, 374761393) + Math.imul(j, 668265263)) >>> 0) % 100;
      ctx.fillStyle = hash < 7 ? rgba(NAVY, Math.min(1, v * 1.6)) : `rgb(9 10 11 / ${Math.min(0.1, v * 0.18)})`;
      const s = CELL * (0.7 + 0.3 * Math.min(1, v * 2));
      ctx.fillRect(i * CELL + (CELL - s) / 2, j * CELL + (CELL - s) / 2, s, s);
    }
  });
  contourLayer("mentorField", "rgb(9 10 11 / 0.08)");
  contourLayer("footField", "rgb(255 255 255 / 0.1)");

  /* ---------- chequered dissolves ---------- */
  const noise = (x, y) => { let h = Math.imul(x, 374761393) + Math.imul(y, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967295; };
  const dissolves = [...document.querySelectorAll("canvas.dissolve")].map((c) => ({ c, last: -1 }));
  const drawDissolve = (d, progress) => {
    const [ctx, width, height] = fitCanvas(d.c);
    const CELL = 24, SOLID = 0.16, LIFT = 2, surface = d.c.dataset.carry === "light" ? "#f7fafb" : "#090a0b";
    ctx.clearRect(0, 0, width, height);
    const cols = Math.ceil(width / CELL), rows = Math.ceil(height / CELL), lift = progress * LIFT;
    for (let y = 0; y < rows; y++) {
      const depth = y / Math.max(1, rows - 1) + lift;
      if (depth > 1) break;
      const solid = depth <= SOLID, fade = clamp01(1 - (depth - SOLID) / (1 - SOLID));
      if (!solid && fade <= 0) break;
      for (let x = 0; x < cols; x++) {
        if (!solid) { if ((x + y) % 2) continue; if (noise(x, y) > fade) continue; }
        ctx.fillStyle = !solid && noise(x + 101, y + 57) < 0.06 ? (d.c.dataset.carry === "light" ? "#8aa3e8" : "#12245a") : surface;
        ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
      }
    }
  };
  const dissolveTick = () => {
    const vh = innerHeight;
    for (const d of dissolves) {
      const top = d.c.parentElement.getBoundingClientRect().top;
      const p = Math.round(clamp01(1 - top / vh) * 400) / 400;
      if (p !== d.last) { d.last = p; drawDissolve(d, p); }
    }
  };
  addEventListener("scroll", () => requestAnimationFrame(dissolveTick), { passive: true });
  addEventListener("resize", () => { dissolves.forEach((d) => (d.last = -1)); dissolveTick(); });
  dissolveTick();

  /* ---------- kurikulum: halftone ground + one route ---------- */
  const kur = document.getElementById("kurikulum");
  const kc = document.getElementById("kurField");
  const mods = [...document.querySelectorAll("#mods li")];
  // an archipelago of dots from a seeded field, laid along the stage
  const PITCH = 13;
  const isle = (u, v) => {
    const f = Math.sin(u * 9.1 + 1.3) * 0.35 + Math.sin(v * 7.3 - u * 3.1) * 0.3 + Math.sin(u * 21 + v * 5) * 0.18 + Math.sin(u * 4 - 0.6) * 0.25;
    const band = 1 - Math.abs(v - 0.5 - Math.sin(u * 6) * 0.08) * 3.2;
    return f + band * 0.9 > 0.72;
  };
  // the route: five checkpoints, in stage units (0..1)
  const CPS = [[0.36, 0.62], [0.5, 0.33], [0.66, 0.52], [0.8, 0.28], [0.9, 0.58]];
  const routeIn = (w, h) => {
    const pts = []; const mapP = ([u, v]) => [u * w, v * h];
    const P = CPS.map(mapP);
    const ctrl = [P[0], ...P, P[P.length - 1]];
    for (let s = 1; s < ctrl.length - 2; s++) for (let k = 0; k < 40; k++) {
      const t = k / 40, [p0, p1, p2, p3] = [ctrl[s - 1], ctrl[s], ctrl[s + 1], ctrl[s + 2]];
      const t2 = t * t, t3 = t2 * t;
      const f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      pts.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
    pts.push(P[P.length - 1]);
    const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const cpD = P.map((p) => { let best = 0, bd = 1e9; pts.forEach((q, i) => { const d = Math.hypot(q[0] - p[0], q[1] - p[1]); if (d < bd) { bd = d; best = i; } }); return cum[best]; });
    return { pts, cum, total: cum[cum.length - 1], P, cpD };
  };
  let kurW = 0, kurH = 0, dots = [], route = null, baked = null, lap = reduced ? 1 : 0, heat = reduced ? 0 : 1, lapStart = 0, armed = reduced;
  const reticle = { x: 0, y: 0, on: false, heat: 0, spread: 0 };
  const bakeKur = () => {
    const r = Math.min(devicePixelRatio || 1, 2); kurW = kc.clientWidth; kurH = kc.clientHeight;
    kc.width = Math.round(kurW * r); kc.height = Math.round(kurH * r);
    dots = [];
    const cols = Math.ceil(kurW / PITCH), rows = Math.ceil(kurH / PITCH);
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const u = (i * PITCH) / kurW, v = (j * PITCH) / kurH;
      if (u < 0.3 && v < 0.55) continue;
      if (isle(u * 1.2, v)) dots.push([i, j]);
    }
    baked = document.createElement("canvas"); baked.width = kc.width; baked.height = kc.height;
    const b = baked.getContext("2d"); b.setTransform(r, 0, 0, r, 0, 0); b.fillStyle = "#4a4e55";
    b.beginPath(); for (const [i, j] of dots) { const x = i * PITCH + PITCH / 2, y = j * PITCH + PITCH / 2; b.moveTo(x + 1.6, y); b.arc(x, y, 1.6, 0, Math.PI * 2); } b.fill();
    // dashed grid axes + hub rings
    b.strokeStyle = "#3a3d44"; b.lineWidth = 1; b.setLineDash([7, 5]);
    [0.36, 0.66].forEach((u) => { b.beginPath(); b.moveTo(u * kurW, 0); b.lineTo(u * kurW, kurH); b.stroke(); });
    b.beginPath(); b.moveTo(0, kurH * 0.48); b.lineTo(kurW, kurH * 0.48); b.stroke(); b.setLineDash([]);
    b.strokeStyle = "#1e1e1e"; [0.22, 0.3].forEach((k) => { b.beginPath(); b.arc(kurW * 0.66, kurH * 0.48, Math.min(kurW, kurH) * k, 0, Math.PI * 2); b.stroke(); });
    route = routeIn(kurW, kurH);
  };
  const easeSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;
  const drawKur = (now) => {
    if (!baked) return;
    const r = Math.min(devicePixelRatio || 1, 2), ctx = kc.getContext("2d");
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, kc.width, kc.height); ctx.drawImage(baked, 0, 0);
    ctx.setTransform(r, 0, 0, r, 0, 0);
    // reticle chequer on the lattice
    if (reticle.heat > 0.01) {
      const ci = Math.round((reticle.x - PITCH / 2) / PITCH), cj = Math.round((reticle.y - PITCH / 2) / PITCH);
      const reach = 30 * reticle.spread + 3, cells = [];
      for (let k = -Math.ceil(reach); k <= Math.ceil(reach); k++) { const f = 1 - Math.abs(k) / reach; if (f > 0) { cells.push([ci + k, cj, f]); cells.push([ci, cj + k, f]); } }
      for (let a = -3; a <= 3; a++) for (let b2 = -3; b2 <= 3; b2++) { const d = Math.hypot(a, b2) / 4; if (d < 1) cells.push([ci + a, cj + b2, (1 - d) * (1 - d)]); }
      for (const [i, j, f] of cells) {
        const v = f * reticle.heat; if (v < 0.3) continue;
        const x = i * PITCH + PITCH / 2, y = j * PITCH + PITCH / 2;
        ctx.clearRect(x - 2.5, y - 2.5, 5, 5);
        if ((i + j) & 1) continue;
        const s = PITCH * (0.7 + 0.3 * clamp01((v - 0.3) / 0.7));
        ctx.fillStyle = v > 0.8 ? "#ffffff" : v > 0.5 ? rgba(BRIGHT, 1) : rgba(ACCENT, 1);
        ctx.fillRect(x - s / 2, y - s / 2, s, s);
      }
    }
    // the route, drawn up to the lap
    const dist = easeSine(lap) * route.total;
    const pts = []; for (let i = 0; i < route.pts.length; i++) { if (route.cum[i] <= dist) pts.push(route.pts[i]); else { const a = route.pts[i - 1], b2 = route.pts[i], k = (dist - route.cum[i - 1]) / (route.cum[i] - route.cum[i - 1]); pts.push([a[0] + (b2[0] - a[0]) * k, a[1] + (b2[1] - a[1]) * k]); break; } }
    const stroke = (from = 0) => { ctx.beginPath(); ctx.moveTo(pts[from][0], pts[from][1]); for (let i = from + 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke(); };
    ctx.lineCap = ctx.lineJoin = "round";
    // the planned route, faint
    ctx.strokeStyle = "rgb(255 255 255 / 0.12)"; ctx.lineWidth = 1; ctx.setLineDash([3, 5]); ctx.beginPath(); route.pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.setLineDash([]);
    if (pts.length > 1) {
      ctx.save(); ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = rgba(ACCENT, 0.06); ctx.lineWidth = 16; stroke();
      ctx.strokeStyle = rgba(ACCENT, 0.12); ctx.lineWidth = 7; stroke(); ctx.restore();
      ctx.strokeStyle = rgba(ACCENT, 1); ctx.lineWidth = 3; stroke();
      const head = Math.max(0, pts.length - 30), tip = pts[pts.length - 1];
      if (heat > 0.01 && pts.length - head > 1) {
        const g = ctx.createLinearGradient(pts[head][0], pts[head][1], tip[0], tip[1]);
        g.addColorStop(0, rgba(BRIGHT, 0)); g.addColorStop(1, `rgb(255 255 255 / ${0.95 * heat})`);
        ctx.strokeStyle = g; ctx.lineWidth = 1.4; stroke(head);
        ctx.save(); ctx.globalCompositeOperation = "lighter";
        const sp = ctx.createRadialGradient(tip[0], tip[1], 0, tip[0], tip[1], 14);
        sp.addColorStop(0, `rgb(255 255 255 / ${0.85 * heat})`); sp.addColorStop(0.35, rgba(BRIGHT, 0.4 * heat)); sp.addColorStop(1, rgba(ACCENT, 0));
        ctx.fillStyle = sp; ctx.beginPath(); ctx.arc(tip[0], tip[1], 14, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
    }
    // checkpoints
    route.P.forEach((p, i) => {
      const reached = dist >= route.cpD[i] - 1;
      mods[i] && mods[i].classList.toggle("hit", reached);
      ctx.fillStyle = reached ? rgba(ACCENT, 1) : "#090a0b"; ctx.strokeStyle = reached ? rgba(ACCENT, 1) : "rgb(255 255 255 / 0.5)";
      ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(Math.PI / 4); ctx.fillRect(-5, -5, 10, 10); ctx.strokeRect(-5, -5, 10, 10); ctx.restore();
      if (reached) {
        const age = clamp01((dist - route.cpD[i]) / 90);
        ctx.save(); ctx.globalCompositeOperation = "lighter";
        const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 12 + (1 - age) * 14);
        g.addColorStop(0, rgba(BRIGHT, 0.5 + 0.45 * (1 - age))); g.addColorStop(0.45, rgba(ACCENT, 0.3)); g.addColorStop(1, rgba(ACCENT, 0));
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p[0], p[1], 26, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        if (age < 1) { ctx.strokeStyle = rgba(BRIGHT, (1 - age) * 0.6); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(p[0], p[1], 9 + age * 20, 0, Math.PI * 2); ctx.stroke(); }
      }
      ctx.fillStyle = reached ? "#ffffff" : "rgb(255 255 255 / 0.45)"; ctx.font = "500 11px 'Space Grotesk', sans-serif";
      ctx.fillText("0" + (i + 1), p[0] + 12, p[1] - 10);
    });
  };
  let lastK = 0, lastFrame = 0;
  const kurTick = (now) => {
    const dt = lastFrame ? Math.min(0.1, (now - lastFrame) / 1000) : 0; lastFrame = now;
    if (lapStart && lap < 1) { lap = clamp01((now - lapStart) / 5200); if (lap >= 1) lapStart = now; }
    else if (lap >= 1 && heat > 0) { heat = Math.max(0, 1 - (now - lapStart) / 800); const c = 1 - heat; heat = 1 - (1 - Math.pow(1 - c, 3)); if (heat <= 0.001) { heat = 0; armed = true; } }
    const want = reticle.on && armed ? 0.95 : 0;
    reticle.heat += (want - reticle.heat) * (1 - Math.exp(-dt / (want > reticle.heat ? 0.14 : 0.3)));
    reticle.spread += ((reticle.on ? 1 : 0) - reticle.spread) * (1 - Math.exp(-dt / 0.38));
    if (now - lastK < 16) return; lastK = now; drawKur(now);
  };
  bakeKur(); drawKur(0);
  whileVisible(kc, kurTick);
  new IntersectionObserver(([e]) => { if (e.isIntersecting && !lapStart && !reduced) lapStart = performance.now(); }, { threshold: 0.35 }).observe(kur);
  if (finePointer && !reduced) {
    kur.addEventListener("pointermove", (e) => { const r = kc.getBoundingClientRect(); reticle.x = e.clientX - r.left; reticle.y = e.clientY - r.top; reticle.on = true; });
    kur.addEventListener("pointerleave", () => (reticle.on = false));
  }
  // the badge's meridian turns once every ten seconds
  const mer = document.getElementById("meridian");
  if (!reduced) whileVisible(mer, (t) => mer.setAttribute("rx", Math.max(0.5, Math.abs(Math.cos(((t % 10000) / 10000) * Math.PI * 2)) * 18).toFixed(2)));

  /* ---------- agenda timeline ---------- */
  const SESSIONS = [
    ["centre", null, "Hari 1", "08.00", "Kenapa caleg kalah", "Pembukaan.", "Membedah pola kekalahan caleg di pemilu terakhir, dan apa yang membedakan yang jadi."],
    ["side", "right", "Hari 1", "10.00", "Baca dapil"],
    ["centre", null, "Hari 1", "14.00", "Data & survei", "Angka sebelum langkah.", "Membaca survei, menentukan basis, dan menghitung suara yang realistis untuk kursi."],
    ["side", "left", "Hari 1", "19.00", "Malam simulasi"],
    ["centre", null, "Hari 2", "08.00", "Citra kandidat", "Wajah yang dipilih.", "Menyusun pesan, foto, dan cerita kandidat yang bisa dipercaya pemilih di dapil."],
    ["side", "right", "Hari 2", "13.00", "Mesin lapangan"],
    ["centre", null, "Hari 2", "16.00", "Rencana menang", "Pulang membawa rencana.", "Setiap peserta menyusun rencana kampanye dan kawal suara untuk dapilnya sendiri."],
  ];
  const rowsEl = document.getElementById("rows");
  const OUTLINE = "M13.6168 0.497469H697.378C700.858 0.497469 704.195 1.38786 706.655 2.97277C709.115 4.55769 710.498 6.70729 710.498 8.94869V411.208C710.498 413.449 709.115 415.599 706.655 417.183C704.195 418.768 700.858 419.659 697.378 419.659H460.249C454.073 419.659 447.976 420.555 442.411 422.281C436.847 424.008 431.958 426.519 428.107 429.63L399.246 452.95C395.559 455.928 390.878 458.333 385.55 459.986C380.223 461.639 374.385 462.497 368.472 462.497H13.6168C10.1373 462.497 6.80038 461.607 4.34003 460.022C1.87968 458.437 0.497469 456.288 0.497469 454.046V8.94869C0.497469 6.70729 1.87968 4.55769 4.34003 2.97277C6.80038 1.38786 10.1373 0.497469 13.6168 0.497469Z";
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  SESSIONS.forEach(([frame, align, day, time, title, lead, rest]) => {
    const row = document.createElement("div");
    row.className = `row ${frame}${align ? " " + align : ""}`;
    row.innerHTML = `<div class="ag-plate"><div class="plate-in"><div class="fill"></div><svg class="outline" viewBox="0 0 710.995 462.995" preserveAspectRatio="none" aria-hidden="true"><path d="${OUTLINE}"/></svg><div class="pl-body"><span class="pl-day">${day} · sesi</span><span class="pl-title">${esc(title)}</span></div></div></div>` +
      `<div class="time split letters" data-split="letters" data-stagger="26" aria-hidden="true">${day.replace("Hari ", "H")} · ${time}</div>` +
      (lead ? `<p class="ag-copy" data-rise style="--d:220ms"><b>${esc(lead)}</b> <span>${esc(rest)}</span></p>` : "");
    rowsEl.appendChild(row);
    const plate = row.querySelector(".ag-plate");
    plate.addEventListener("mouseenter", () => { document.getElementById("agenda").classList.add("dim"); row.classList.add("hot"); });
    plate.addEventListener("mouseleave", () => { document.getElementById("agenda").classList.remove("dim"); row.classList.remove("hot"); });
  });
  // split the new time labels too
  rowsEl.querySelectorAll(".time").forEach((el) => {
    const text = el.textContent; el.textContent = "";
    [...text].forEach((ch, i) => { const s = document.createElement("span"); s.className = "u"; s.textContent = ch === " " ? " " : ch; s.style.setProperty("--d", i * 26 + "ms"); el.appendChild(s); });
  });
  const rowIO = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    const row = e.target, t = row.querySelector(".time");
    t.classList.add("in"); row.querySelector(".ag-copy")?.classList.add("in");
    if (row.classList.contains("centre")) setTimeout(() => t.classList.add("settle"), 2200);
    rowIO.unobserve(row);
  }), { rootMargin: "0px 0px -25% 0px" });
  const rowList = [...rowsEl.children];
  rowList.forEach((r) => rowIO.observe(r));

  const rail = document.getElementById("rail"), railSvg = document.getElementById("railSvg");
  const railRun = document.getElementById("railRun"), railMark = document.getElementById("railMark"), railDash = document.getElementById("railDash");
  const narrow = matchMedia("(max-width: 1023px)");
  let railH = 0, rest = 0;
  const layoutRail = () => {
    railH = rail.clientHeight; railSvg.setAttribute("viewBox", `0 0 16 ${railH}`);
    const last = rowList[rowList.length - 1];
    rest = last.offsetTop + last.offsetHeight / 2 - 50 + (rowsEl.offsetTop - rail.offsetTop);
    railDash.setAttribute("y2", rest);
    const size = narrow.matches ? 20 : 9; railMark.setAttribute("x", -size / 2); railMark.setAttribute("y", -size / 2); railMark.setAttribute("width", size); railMark.setAttribute("height", size);
  };
  let railP = 0;
  const agenda = document.getElementById("agenda");
  const agTick = () => {
    const vh = innerHeight, r = rail.getBoundingClientRect();
    const target = clamp01((vh / 2 - r.top) / Math.max(1, r.height - vh / 2));
    railP += (target - railP) * 0.2;
    const run = railP * rest;
    railRun.setAttribute("height", run.toFixed(1));
    railMark.setAttribute("transform", `translate(8 ${run.toFixed(1)}) rotate(${((run / Math.max(1, rest)) * 1800).toFixed(1)})`);
    // three-layer parallax: plate, its time label, the copy
    if (!reduced && !phone.matches) for (const row of rowList) {
      const b = row.getBoundingClientRect();
      const k = clamp01((vh - b.top) / (vh + b.height)) * 2 - 1; // -1 entering, 1 leaving
      const pt = row.classList.contains("side") ? 60 : 20;
      const unit = innerWidth / 1440;
      const py = -k * pt * unit;
      row.querySelector(".plate-in").style.transform = `translateY(${py.toFixed(1)}px)`;
      row.querySelector(".time").style.marginTop = `${py.toFixed(1)}px`;
      const c = row.querySelector(".ag-copy"); if (c && !narrow.matches) c.style.marginTop = `${(-k * 110 * unit).toFixed(1)}px`;
    }
  };
  layoutRail(); addEventListener("resize", layoutRail);
  whileVisible(agenda, agTick);

  /* ---------- mentor & footer drift, live pulse, crawl ---------- */
  const mPhoto = document.getElementById("mPhoto"), fPhoto = document.getElementById("fPhoto");
  const mentor = document.getElementById("mentor"), foot = document.querySelector(".foot");
  const pulse = document.getElementById("pulse");
  const steps = [...document.querySelectorAll(".step")];
  whileVisible(mentor, (t) => {
    const b = mentor.getBoundingClientRect(), vh = innerHeight;
    if (!reduced) {
      const p = clamp01((vh - b.top) / (vh + b.height));
      mPhoto.style.setProperty("--py", `${(-p * 48 * innerWidth / 1440).toFixed(1)}px`);
      const v = (t % 3200) / 3200, e = 1 - (1 - v) * (1 - v);
      pulse.setAttribute("r", (5.5 + e * 5.5 * 3.4).toFixed(2)); pulse.setAttribute("stroke-opacity", (0.5 * (1 - e) * (1 - e)).toFixed(3));
      const c = ((t % 5200) / 5200) * 11.45;
      steps.forEach((s, i) => s.style.setProperty("--crawl", `${i === 0 ? 0 : -c}px`));
    }
  });
  whileVisible(foot, () => {
    if (reduced) return;
    const b = foot.getBoundingClientRect(), vh = innerHeight;
    const p = clamp01((vh - b.top) / b.height); // 0 → 1 as the page bottoms out
    fPhoto.style.setProperty("--py", `${((1 - p) * 60 * innerWidth / 1440).toFixed(1)}px`);
  });


  // a pinned layer taller than the screen sticks at its own foot, so none of it is hidden
  const pinTops = () => layers.slice(0, -1).forEach((l) => (l.style.top = Math.min(0, innerHeight - l.offsetHeight) + "px"));
  addEventListener("resize", () => { bakeKur(); drawKur(performance.now()); pinTops(); recede(); });
  pinTops(); recede();
}
