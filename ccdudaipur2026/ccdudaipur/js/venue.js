/* ==========================================================================
   The venue tour: The Third Space, Udaipur.
   An original drawing of the building, scroll-driven: the white jaali skin
   of cusped perforations, the curved balconies stepping out of the facade,
   the open rooftop frame with its sail canopies, the concrete pilotis, the
   corten lattice fence and the cypresses out front. Scroll and the day turns
   to night until the facade glows like a lantern, then the camera flies in
   through the entrance and into the theatre, where the ceiling stars come
   on, the step lights glow blue and the screen opens on CCD Udaipur.
   ========================================================================== */
(function () {
  "use strict";
  const f = (n) => Math.round(n * 10) / 10;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (t) => t * t * (3 - 2 * t);
  function rng(seed) { return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646; }
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, t) => "#" + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, "0")).join("");
  const mix3 = (a, b, c, t) => (t < 0.5 ? mix(a, b, t * 2) : mix(b, c, (t - 0.5) * 2));

  /* ---------- the outside ---------- */
  function exterior(id) {
    const r = rng(2023);
    const G = 860; // ground line
    const X0 = 300, X1 = 1240, TOP = 196, BASE = 760;

    // the jaali: a staggered field of cusped, leaf-shaped perforations
    const jaali = `<pattern id="${id}-jaali" width="22" height="22" patternUnits="userSpaceOnUse">
        <rect width="22" height="22" fill="var(--marble)"/>
        <path fill="var(--hole)" d="M5.5 2c2.4 2.2 2.4 4.6 0 7c-2.4-2.4-2.4-4.8 0-7z"/>
        <path fill="var(--hole)" d="M16.5 13c2.4 2.2 2.4 4.6 0 7c-2.4-2.4-2.4-4.8 0-7z"/>
        <path fill="var(--hole)" d="M16.5 3.2a2.2 2.2 0 1 1-.01 0zM5.5 14.2a2.2 2.2 0 1 1-.01 0z" opacity=".85"/>
      </pattern>
      <pattern id="${id}-seams" width="58.75" height="62.7" patternUnits="userSpaceOnUse" x="${X0}" y="${TOP}">
        <path d="M0 0H58.75M0 0V62.7" fill="none" stroke="var(--seam)" stroke-width="2.4"/>
      </pattern>
      <pattern id="${id}-fence" width="26" height="26" patternUnits="userSpaceOnUse">
        <path d="M0 0H26V26H0Z" fill="none" stroke="var(--corten)" stroke-width="5"/>
      </pattern>`;

    // balconies: three rows of curved boxes stepping out of the facade
    let balc = "", balcShadow = "", leds = "";
    const rows = [[214, 6, 175, 250, 132], [372, 6, 175, 250, 132], [534, 6, 160, 330, 118]];
    rows.forEach(([y, n, gap, x0, w], ri) => {
      for (let i = 0; i < n; i++) {
        const x = x0 + i * gap, h = ri === 2 ? 84 : 96, c = 26;
        balcShadow += `<rect x="${x + 4}" y="${y + h + 8}" width="${w + 26}" height="34" rx="16"/>`;
        balc += `<g class="tsx-balc">
          <path fill="url(#${id}-curveL)" d="M${x} ${y}Q${x - c} ${y + 2} ${x - c} ${y + 26}V${y + h}H${x}Z"/>
          <path fill="url(#${id}-jaali)" opacity=".55" d="M${x} ${y}Q${x - c} ${y + 2} ${x - c} ${y + 26}V${y + h}H${x}Z"/>
          <path fill="url(#${id}-curveR)" d="M${x + w} ${y}Q${x + w + c} ${y + 2} ${x + w + c} ${y + 26}V${y + h}H${x + w}Z"/>
          <path fill="url(#${id}-jaali)" opacity=".55" d="M${x + w} ${y}Q${x + w + c} ${y + 2} ${x + w + c} ${y + 26}V${y + h}H${x + w}Z"/>
          <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id}-jaali)"/>
          <rect class="tsx-glowbox" x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id}-boxglow)"/>
          <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" class="tsx-frame"/>
          <path class="tsx-soffit" d="M${x - c} ${y + h}H${x + w + c}V${y + h + 12}H${x - c}Z"/>
        </g>`;
        leds += `<path d="M${x + 10} ${y + 16}H${x + w - 10}"/>`;
      }
    });

    // rooftop: the open concrete frame and the jaali sails
    let frame = `<rect class="tsx-conc" x="${X0 - 6}" y="128" width="${X1 - X0 + 12}" height="18"/>`;
    for (let x = X0; x <= X1 + 1; x += (X1 - X0) / 6) frame += `<rect class="tsx-conc" x="${f(x - 7)}" y="146" width="14" height="${TOP - 146}"/>`;
    let sails = "";
    for (let i = 0; i < 6; i++) {
      const a = X0 + 20 + i * 155, b = a + 150;
      sails += `<path class="tsx-sail" fill="url(#${id}-jaali)" d="M${a} 128L${b} 128L${a + 128} 44Z"/><path class="tsx-sailframe" d="M${a} 128L${a + 128} 44L${b} 128M${a + 128} 44V128"/>`;
    }

    // ground floor: pilotis, the lit lobby and people
    let piloti = "";
    for (let x = X0 + 20; x < X1; x += 116) piloti += `<rect class="tsx-col" fill="url(#${id}-colg)" x="${x}" y="${BASE}" width="24" height="${G - BASE}"/>`;
    let people = "";
    [[560, "#f2b233", "#2e9b5c"], [640, "#c94a3a", ""], [905, "#3b6fd0", ""], [1010, "#efe6d6", "#4285f4"]].forEach(([x, c, bag]) => {
      people += `<g transform="translate(${x} ${G})"><g class="tsx-person"><circle cy="-58" r="7" fill="#3a2a20"/><path d="M-10 -48h20l5 48h-30z" fill="${c}"/>${bag ? `<rect x="8" y="-34" width="10" height="13" rx="2" fill="${bag}"/>` : ""}</g></g>`;
    });

    // the annex to the right, with a CCD banner
    const annex = `<rect x="${X1}" y="470" width="320" height="${BASE - 470}" fill="url(#${id}-jaali)"/>
      <rect x="${X1}" y="470" width="320" height="${BASE - 470}" fill="url(#${id}-seams)"/>
      <rect class="tsx-conc" x="${X1}" y="462" width="320" height="10"/>
      <rect class="tsx-glass" x="${X1}" y="${BASE}" width="320" height="${G - BASE}"/>
      <g class="tsx-banner" transform="translate(${X1 + 210} 490)"><rect width="74" height="200" rx="6" fill="#fff8ea"/>
        <rect width="18.5" height="8" fill="#4285f4"/><rect x="18.5" width="18.5" height="8" fill="#ea4335"/><rect x="37" width="18.5" height="8" fill="#f9ab00"/><rect x="55.5" width="18.5" height="8" fill="#34a853"/>
        <text x="37" y="60" text-anchor="middle" class="b1">CCD</text><text x="37" y="84" text-anchor="middle" class="b2">UDAIPUR</text><text x="37" y="150" text-anchor="middle" class="b3">20 DEC</text><text x="37" y="170" text-anchor="middle" class="b4">2026</text></g>`;

    // greenery and the street
    const cypress = (x, h) => `<g class="tsx-cypress" transform="translate(${x} ${G + 110})">
      ${Array.from({ length: 7 }, (_, k) => { const y = (-k * h) / 7, rw = (1 - k / 8) * h * 0.2; return `<ellipse cx="${f((r() - 0.5) * 6)}" cy="${f(y - h / 9)}" rx="${f(rw)}" ry="${f(h / 6)}"/>`; }).join("")}</g>`;
    let fronds = "";
    for (let i = 0; i < 16; i++) {
      const a = -Math.PI + (i / 15) * Math.PI, l = 130 + r() * 40;
      const ex = Math.cos(a) * l, ey = Math.sin(a) * l * 0.6 + 40;
      fronds += `<path d="M0 0Q${f(ex * 0.5)} ${f(ey * 0.4 - 50)} ${f(ex)} ${f(ey)}"/>`;
    }
    let stars = "";
    for (let i = 0; i < 60; i++) stars += `<circle cx="${f(r() * 1600)}" cy="${f(r() * 380)}" r="${f(0.6 + r())}"/>`;

    return `<svg class="tsx-svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustration of The Third Space, Udaipur: a white marble jaali facade with curved balconies that glows at night">
      <defs>
        ${jaali}
        <linearGradient id="${id}-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--sky1)"/><stop offset="1" style="stop-color:var(--sky2)"/></linearGradient>
        <linearGradient id="${id}-curveL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".28"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
        <linearGradient id="${id}-curveR" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".25"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient>
        <radialGradient id="${id}-boxglow"><stop offset="0" stop-color="#fffbe9" stop-opacity=".9"/><stop offset="1" stop-color="#ffe2a0" stop-opacity="0"/></radialGradient>
        <radialGradient id="${id}-lobby" cx=".5" cy=".7"><stop offset="0" stop-color="#fff2cc"/><stop offset="1" stop-color="#ffcf7a" stop-opacity=".2"/></radialGradient>
        <linearGradient id="${id}-colg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c9c7c2"/><stop offset=".5" stop-color="#a9a7a3"/><stop offset="1" stop-color="#878580"/></linearGradient>
        <filter id="${id}-blur" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="8"/></filter>
      </defs>
      <rect width="1600" height="1000" fill="url(#${id}-sky)"/>
      <g class="tsx-stars">${stars}</g>
      <circle class="tsx-sun" cx="190" cy="150" r="46"/>
      <circle class="tsx-moon" cx="1420" cy="120" r="30"/>
      <path class="tsx-hills" d="M1100 760L1180 640L1260 600L1330 520L1400 560L1470 500L1540 560L1600 540V760Z"/>
      <path class="tsx-hills" d="M0 760L60 690L140 720L220 660V760Z"/>
      <g class="tsx-flag"><path d="M150 860V620" stroke="#8a8d92" stroke-width="3"/><path d="M150 622h34v8h-34z" fill="#ff9933"/><path d="M150 630h34v8h-34z" fill="#fff"/><path d="M150 638h34v8h-34z" fill="#138808"/><circle cx="167" cy="634" r="2.6" fill="none" stroke="#000080" stroke-width=".8"/></g>
      ${sails}${frame}
      <rect class="tsx-wall" x="${X0}" y="${TOP}" width="${X1 - X0}" height="${BASE - TOP}"/>
      <rect x="${X0}" y="${TOP}" width="${X1 - X0}" height="${BASE - TOP}" fill="url(#${id}-jaali)"/>
      <rect x="${X0}" y="${TOP}" width="${X1 - X0}" height="${BASE - TOP}" fill="url(#${id}-seams)"/>
      ${annex}
      <g class="tsx-shadows" filter="url(#${id}-blur)">${balcShadow}</g>
      ${balc}
      <g class="tsx-leds">${leds}</g>
      <rect x="${X0}" y="${BASE}" width="${X1 - X0}" height="${G - BASE}" class="tsx-under"/>
      <rect x="${X0}" y="${BASE}" width="${X1 - X0}" height="${G - BASE}" fill="url(#${id}-lobby)" class="tsx-lobby"/>
      <rect class="tsx-conc" x="${X0}" y="${BASE - 6}" width="${X1 - X0}" height="12"/>
      ${piloti}
      ${people}
      <path class="tsx-pole" d="M1330 960V560M1312 580h36M1316 596h28"/>
      <path class="tsx-wires" d="M0 600Q660 650 1330 580Q1460 570 1600 590M0 620Q660 668 1330 596Q1460 588 1600 610"/>
      <rect class="tsx-paving" x="0" y="${G}" width="1600" height="40"/>
      <rect x="-20" y="${G - 70}" width="1640" height="74" fill="url(#${id}-fence)"/>
      <path class="tsx-fencetop" d="M-20 ${G - 70}H1620M-20 ${G + 4}H1620"/>
      <rect class="tsx-lawn" x="0" y="${G + 40}" width="1600" height="160"/>
      <g class="tsx-palm" transform="translate(1460 640)"><path class="trunk" d="M0 0C-6 120 6 240 -4 360"/><g class="fronds">${fronds}</g></g>
      ${cypress(120, 260)}${cypress(1200, 170)}${cypress(560, 120)}
    </svg>`;
  }

  /* ---------- the inside: the theatre ---------- */
  function interior(id) {
    const r = rng(77);
    let lights = "";
    for (let row = 0; row < 5; row++) {
      for (let c = 0; c < 6; c++) {
        const z = 1 + row * 0.75, x = 820 + ((c - 2.5) * 520) / z + (r() - 0.5) * 30, y = 330 - 300 / z;
        lights += `<g transform="translate(${f(x)} ${f(y)}) scale(${f(1.3 / z)})"><g class="tsx-star" style="animation-delay:${f(-r() * 3)}s"><circle r="40" fill="url(#${id}-spot)"/><path d="M0 -12L3 -3L12 0L3 3L0 12L-3 3L-12 0L-3 -3Z" fill="#fff6dc"/></g></g>`;
      }
    }
    // raked seating on the left, rising row by row
    let seats = "", steps = "";
    for (let i = 0; i < 11; i++) {
      const y = 760 - i * 46, xr = 640 - i * 38, sw = 44 - i * 1.6, sh = 34 - i * 1.1;
      seats += `<path class="tsx-tier" d="M-20 ${f(y + sh * 0.6)}H${xr + 30}V${f(y + sh * 0.6 + 46)}H-20Z"/>`;
      for (let x = xr - sw; x > -sw; x -= sw + 4) seats += `<rect class="tsx-seat" x="${f(x)}" y="${f(y)}" width="${f(sw)}" height="${f(sh)}" rx="${f(sw * 0.22)}"/><rect class="tsx-arm" x="${f(x + sw - 3)}" y="${f(y + sh * 0.45)}" width="4" height="${f(sh * 0.55)}" rx="2"/>`;
      steps += `<rect class="tsx-step" x="${xr + 8}" y="${f(y + sh * 0.6 + 8)}" width="20" height="5" rx="2"/><rect class="tsx-step" x="${xr + 8}" y="${f(y + sh * 0.6 + 30)}" width="20" height="5" rx="2"/>`;
    }
    let floor = "";
    for (let i = 0; i < 14; i++) floor += `<ellipse class="tsx-floorlight" cx="${f(760 + r() * 760)}" cy="${f(700 + r() * 260)}" rx="16" ry="6"/>`;
    // curved lounge benches up front with wooden seat blocks
    const bench = (o) => `<path class="tsx-bench" d="M${560 + o} 1010C${640 + o} 860 ${820 + o} 720 ${1040 + o} 650L${1070 + o} 662C${860 + o} 740 ${700 + o} 880 ${640 + o} 1010Z"/>`;
    let blocks = "";
    [[0.12, 0], [0.32, 0], [0.55, 0], [0.75, 0], [0.2, 120], [0.45, 120], [0.7, 120]].forEach(([t, o]) => {
      const x = lerp(600 + o, 1050 + o, t), y = lerp(990, 655, Math.pow(t, 0.8)), s = lerp(1.4, 0.45, t);
      blocks += `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})"><path class="tsx-block" d="M-34 -10H34V14H-34Z"/><path class="tsx-blocktop" d="M-34 -10L-24 -20H44L34 -10Z"/><circle cx="18" cy="-15" r="3" class="tsx-hole"/><circle cx="28" cy="-15" r="3" class="tsx-hole"/></g>`;
    });
    let dust = "";
    for (let i = 0; i < 26; i++) dust += `<circle class="tsx-dust" style="animation-delay:${f(-r() * 6)}s" cx="${f(200 + r() * 420)}" cy="${f(170 + r() * 300)}" r="${f(1 + r() * 1.6)}"/>`;

    return `<svg class="tsx-svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Inside the theatre at The Third Space: raked seats with blue step lights, star lights in the ceiling and the screen showing CCD Udaipur">
      <defs>
        <radialGradient id="${id}-spot"><stop offset="0" stop-color="#fff3cf" stop-opacity=".9"/><stop offset=".25" stop-color="#ffd88a" stop-opacity=".35"/><stop offset="1" stop-color="#ffd88a" stop-opacity="0"/></radialGradient>
        <linearGradient id="${id}-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05060a"/><stop offset="1" stop-color="#11141c"/></linearGradient>
        <linearGradient id="${id}-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2c33"/><stop offset="1" stop-color="#4a4c53"/></linearGradient>
        <linearGradient id="${id}-screen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b1a3a"/><stop offset=".6" stop-color="#14254f"/><stop offset="1" stop-color="#1e1440"/></linearGradient>
        <linearGradient id="${id}-beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#cfe3ff" stop-opacity=".5"/><stop offset="1" stop-color="#cfe3ff" stop-opacity="0"/></linearGradient>
        <radialGradient id="${id}-spill"><stop offset="0" stop-color="#7fa8ff" stop-opacity=".35"/><stop offset="1" stop-color="#7fa8ff" stop-opacity="0"/></radialGradient>
      </defs>
      <rect width="1600" height="1000" fill="url(#${id}-wall)"/>
      <path fill="url(#${id}-floor)" d="M0 1000V820L700 660L1600 640V1000Z"/>
      ${floor}
      <g class="tsx-ceiling">${lights}</g>
      <path class="tsx-panel" d="M1290 160V640M1360 150V650M1430 140V660M1500 130V670"/>
      <rect class="tsx-exit" x="1180" y="520" width="26" height="12" rx="2"/>
      <ellipse cx="960" cy="420" rx="560" ry="300" fill="url(#${id}-spill)" class="tsx-spillglow"/>
      <g class="tsx-screen">
        <rect x="660" y="250" width="600" height="320" rx="4" fill="#cfd4dc"/>
        <g class="tsx-show">
          <rect x="660" y="250" width="600" height="320" rx="4" fill="url(#${id}-screen)"/>
          <g transform="translate(724 300)">
            <use href="#i-spark" width="30" height="30"/><use href="#i-half" width="30" height="30" x="36"/><use href="#i-flower" width="30" height="30" x="72"/><use href="#i-star" width="30" height="30" x="108"/>
          </g>
          <text x="724" y="398" class="sc1">Cloud Community Days</text>
          <text x="724" y="450" class="sc2">Udaipur 2026</text>
          <rect x="724" y="472" width="70" height="5" fill="#4285f4"/><rect x="794" y="472" width="70" height="5" fill="#ea4335"/><rect x="864" y="472" width="70" height="5" fill="#f9ab00"/><rect x="934" y="472" width="70" height="5" fill="#34a853"/>
          <text x="724" y="514" class="sc3">KEYNOTE · SUN 20 DEC · THE THIRD SPACE</text>
        </g>
      </g>
      <path class="tsx-beam" fill="url(#${id}-beam)" d="M40 120L660 250L660 570Z"/>
      <g class="tsx-dusts">${dust}</g>
      ${seats}
      <g class="tsx-steps">${steps}</g>
      ${bench(0)}${bench(120)}
      ${blocks}
    </svg>`;
  }

  /* ---------- the scroll ---------- */
  function init() {
    const sec = document.getElementById("thirdspace");
    if (!sec) return;
    const ext = sec.querySelector("#tsxExt"), int = sec.querySelector("#tsxInt");
    const uid = "ts" + Math.random().toString(36).slice(2, 5);
    ext.innerHTML = exterior(uid + "e");
    int.innerHTML = interior(uid + "i");
    const esvg = ext.firstElementChild, isvg = int.firstElementChild;
    const flash = sec.querySelector(".tsx-flash");
    const cards = [...sec.querySelectorAll(".tsx-card")];
    const clock = sec.querySelector(".tsx-clock b");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cur = 0, running = false;
    // on tall phone screens, frame the theatre around the big screen
    function fitInterior() {
      const tall = innerWidth / Math.max(1, innerHeight) < 0.8;
      isvg.setAttribute("viewBox", tall ? "630 120 660 880" : "0 0 1600 1000");
      isvg.setAttribute("preserveAspectRatio", tall ? "xMidYMid meet" : "xMidYMid slice");
    }
    fitInterior();
    addEventListener("resize", fitInterior);

    function frame() {
      const rr = sec.getBoundingClientRect();
      const target = clamp(-rr.top / Math.max(1, rr.height - innerHeight), 0, 1);
      cur += (target - cur) * (reduced || Math.abs(target - cur) > 0.2 ? 1 : 0.12);
      const p = cur;

      // 1. afternoon to sunset to night
      const n = ease(clamp(p / 0.3, 0, 1));
      const s = esvg.style;
      s.setProperty("--sky1", mix3("#3f7fc8", "#4a3468", "#060a1a", n));
      s.setProperty("--sky2", mix3("#cfe4f6", "#f2a27a", "#18203e", n));
      s.setProperty("--marble", mix3("#f1f0ec", "#eadbd0", "#3d4458", n));
      s.setProperty("--hole", mix3("#59626e", "#6e5a5c", "#ffe7b0", n));
      s.setProperty("--seam", mix3("#d9d7d1", "#d4c3b6", "#2c3244", n));
      s.setProperty("--corten", mix3("#8a4526", "#7a3e26", "#1a1210", n));
      s.setProperty("--night", n.toFixed(3));
      clock.textContent = n < 0.25 ? "Afternoon" : n < 0.6 ? "Sunset" : "Night";

      // 2. fly in through the entrance
      const z = ease(clamp((p - 0.32) / 0.18, 0, 1));
      ext.style.transform = `scale(${f(1 + z * z * 4.5)})`;
      ext.style.opacity = f(1 - clamp((p - 0.46) / 0.05, 0, 1));
      flash.style.opacity = f(clamp(1 - Math.abs(p - 0.48) / 0.04, 0, 1) * 0.9);

      // 3. the theatre wakes up
      const inn = clamp((p - 0.46) / 0.06, 0, 1);
      const w = clamp((p - 0.52) / 0.33, 0, 1);
      int.style.opacity = f(inn);
      int.style.transform = `scale(${f(1.25 - 0.2 * ease(w))})`;
      const is = isvg.style;
      is.setProperty("--ceil", f(clamp(w / 0.3, 0, 1)));
      is.setProperty("--steps", f(clamp((w - 0.2) / 0.3, 0, 1)));
      is.setProperty("--beam", f(clamp((w - 0.4) / 0.3, 0, 1)));
      is.setProperty("--show", f(clamp((w - 0.5) / 0.35, 0, 1)));

      const phase = p < 0.3 ? 0 : p < 0.55 ? 1 : 2;
      cards.forEach((c, i) => c.classList.toggle("in", i === phase));
      if (running) requestAnimationFrame(frame);
    }
    new IntersectionObserver(([en]) => {
      const was = running;
      running = en.isIntersecting;
      sec.classList.toggle("paused", !running);
      if (running && !was) requestAnimationFrame(frame);
    }).observe(sec);
    frame();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
