/* ==========================================================================
   Iconic Udaipur: a horizontal gallery of code-drawn places.
   Fateh Sagar with the Maharana Pratap memorial on Moti Magri, Saheliyon ki
   Bari's fountains and marble elephants, the Jagdish temple, Sajjangarh at
   sunset and Bagore ki Haveli with Gangaur Ghat at night. Every scene has
   depth layers that drift as the gallery slides past.
   ========================================================================== */
(function () {
  const P = window.UdaipurScene.parts;
  const f = (n) => Math.round(n * 10) / 10;
  const W = 1200, H = 800;
  const GC = ["#4285f4", "#34a853", "#f9ab00", "#ea4335"];

  const defs = (id, sky, water) => `
    <linearGradient id="${id}-sky" x1="0" y1="0" x2="0" y2="1">${sky.map((c, i) => `<stop offset="${f(i / (sky.length - 1))}" stop-color="${c}"/>`).join("")}</linearGradient>
    ${water ? `<linearGradient id="${id}-water" x1="0" y1="0" x2="0" y2="1">${water.map((c, i) => `<stop offset="${f(i / (water.length - 1))}" stop-color="${c}"/>`).join("")}</linearGradient>` : ""}
    <radialGradient id="${id}-glow"><stop offset="0" stop-color="#fff6d8"/><stop offset=".3" stop-color="#ffd27a" stop-opacity=".75"/><stop offset="1" stop-color="#ff9a4a" stop-opacity="0"/></radialGradient>
    <filter id="${id}-soft"><feGaussianBlur stdDeviation="2"/></filter>
    <filter id="${id}-bronze"><feColorMatrix type="matrix" values=".34 .28 .12 0 .03  .23 .2 .08 0 .015  .12 .1 .05 0 0  0 0 0 1 0"/></filter>
    <filter id="${id}-wave" x="-5%" y="0" width="110%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.008 0.1" numOctaves="1" seed="4"/><feDisplacementMap in="SourceGraphic" scale="8"/></filter>`;

  const cloud = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse rx="80" ry="15"/><ellipse cx="-26" cy="-12" rx="34" ry="18"/><ellipse cx="16" cy="-18" rx="42" ry="25"/><ellipse cx="54" cy="-6" rx="30" ry="13"/></g>`;
  const L = (d, inner, cls = "") => `<g class="pl ${cls}" data-d="${d}">${inner}</g>`;

  /* ---------- Fateh Sagar & Moti Magri ---------- */
  function fatehsagar(id) {
    const r = P.rng(1687);
    const WL = 540;
    let lamps = "";
    for (let x = 30; x < W; x += 150) lamps += `<g class="lamp"><path class="post" d="M${x} 742V660"/><path d="M${x - 9} 660h18l-4 -16h-10z"/><circle class="lamp-glow" cx="${x}" cy="652" r="5"/></g>`;
    let rail = "";
    for (let x = 0; x < W; x += 24) rail += `<rect x="${x + 4}" y="720" width="10" height="22" rx="2"/>`;
    const moti = `M-60 ${WL}C40 ${WL - 60} 120 ${WL - 170} 230 ${WL - 196}C320 ${WL - 214} 420 ${WL - 120} 560 ${WL}Z`;
    return {
      vars: { "--pal": "#fbf4e8", "--palShade": "#d6c7b1", "--pline": "#3a3036", "--town": "#f3e6d2", "--line": "#3a3036", "--win": "#6d7f92", "--tree": "#4d7a45", "--night": "0" },
      svg: `<defs>${defs(id, ["#5ea8e0", "#a9d6f2", "#fbe7c8"], ["#77b7d8", "#2f7aa6", "#1b4f75"])}</defs>
      <rect width="${W}" height="${H}" fill="url(#${id}-sky)"/>
      <circle cx="980" cy="150" r="200" fill="url(#${id}-glow)" opacity=".7"/>
      ${L(0.05, `<g class="pc-cloud">${cloud(200, 120, 1)}${cloud(760, 80, 1.3)}${cloud(1080, 200, 0.8)}</g>`)}
      ${L(0.12, `<path fill="#a9bdcc" d="${P.ridge(r, 470, 70, [[900, 380, 160]], 10, WL)}"/>`)}
      ${L(0.25, `<path fill="#88a596" d="${P.ridge(r, 505, 40, [], 8, WL)}"/>`)}
      ${L(0.4, `<path fill="#6f8f5c" d="${moti}"/>${P.trees(r, 40, 470, WL - 10, 18)}
        <g class="memorial">
          <path fill="#e9dcc5" stroke="#7a6a58" d="M170 ${WL - 188}h120v12h-120zM184 ${WL - 204}h92v16h-92zM200 ${WL - 244}h60v40h-60z"/>
          <g class="statue" filter="url(#${id}-bronze)" transform="translate(234 ${WL - 244}) scale(.3)">${window.ChetakArt ? ChetakArt.markup(id + "s") : ""}</g>
        </g>`)}
      ${L(0.55, `
        <g class="island">
          <ellipse cx="760" cy="${WL + 6}" rx="190" ry="16" fill="#b9a88a" stroke="#6e5f48"/>
          ${P.trees(r, 610, 900, WL, 20)}${P.palm(640, WL, 60)}${P.palm(880, WL, 66)}${P.palm(760, WL - 4, 74)}
          ${P.chhatri(720, WL - 4, 30)}${P.chhatri(810, WL - 4, 22)}
          <path class="jet" d="M770 ${WL + 2}C770 ${WL - 60} 772 ${WL - 90} 776 ${WL - 96}"/><path class="jet j2" d="M770 ${WL + 2}C768 ${WL - 50} 760 ${WL - 76} 754 ${WL - 82}"/>
        </g>
        <g class="island"><ellipse cx="1080" cy="${WL + 4}" rx="70" ry="9" fill="#b9a88a" stroke="#6e5f48"/><path class="pal" d="M1050 ${WL}v-26h60v26z"/><path class="pal" d="M1060 ${WL - 26}a20 20 0 0 1 40 0z"/></g>`)}
      <rect y="${WL}" width="${W}" height="${H - WL}" fill="url(#${id}-water)"/>
      <g class="pc-refl" filter="url(#${id}-wave)" opacity=".35" transform="translate(0 ${WL * 2}) scale(1 -1)">
        <path fill="#6f8f5c" d="${moti}"/><ellipse cx="760" cy="${WL + 6}" rx="190" ry="16" fill="#4d7a45"/>
      </g>
      <g class="pc-glint">${Array.from({ length: 14 }, (_, i) => `<ellipse style="animation-delay:${f(-i * 0.3)}s" cx="${f(900 + (r() - 0.5) * (40 + i * 16))}" cy="${WL + 14 + i * 12}" rx="${f(14 + i * 2)}" ry="1.6"/>`).join("")}</g>
      ${L(0.8, `<g class="pc-boat" style="transform:translate(0,${WL + 90}px)"><g class="sail">${P.boat(GC[0])}</g></g><g class="pc-boat b2" style="transform:translate(0,${WL + 150}px)"><g class="sail">${P.boat(GC[3], true)}</g></g>`)}
      ${L(1.1, `<g class="prom"><rect y="742" width="${W}" height="60" fill="#c9b08c"/><rect y="716" width="${W}" height="6" fill="#e3d2b4"/>${rail}<rect y="740" width="${W}" height="6" fill="#e3d2b4"/>${lamps}
        <g class="camel" transform="translate(520 744)"><path d="M-60 0l6 -54M-40 0l2 -52M28 0l-4 -52M44 0l4 -52" class="leg-c"/><path class="camel-b" d="M-66 -52C-70 -80 -40 -104 -20 -84C-6 -110 22 -106 34 -80C50 -74 58 -60 62 -48L66 -64C68 -90 80 -110 96 -112C108 -112 114 -104 110 -96L92 -92C86 -80 82 -60 76 -44C66 -36 30 -40 -10 -42C-40 -44 -60 -44 -66 -52Z"/><path d="M-30 -86h40l-4 -10h-32z" fill="#c6302a"/></g>
      </g>`)}`,
      after(svg) {
        // the Moti Magri memorial: Chetak with a foreleg raised, Pratap with his spear
        const st = svg.querySelector(".statue");
        if (!st || !window.ChetakArt) return;
        const pose = { ...ChetakArt.STATUE, stance: ["hf", "hn", "ff"] };
        ChetakArt.rig(st).apply(pose);
        const lift = ChetakArt.ground(pose) || 0;
        st.setAttribute("transform", `translate(234 ${WL - 244 + lift * 0.3}) scale(.3)`);
      },
    };
  }

  /* ---------- Saheliyon ki Bari ---------- */
  function elephant(x, y, s, flip, id) {
    return `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})" class="marble-el">
      <path d="M-50 -20C-58 -60 -30 -86 10 -84C40 -82 58 -64 60 -40C62 -24 56 -10 50 0L36 0L34 -18L-10 -18L-14 0L-30 0L-34 -16C-44 -16 -48 -18 -50 -20Z"/>
      <path d="M38 -80C60 -94 88 -80 86 -56C84 -44 74 -38 64 -40Z"/>
      <path d="M44 -76C28 -76 22 -56 34 -44C42 -40 50 -46 52 -56Z" class="ear"/>
      <path d="M80 -60C94 -64 102 -84 98 -104C96 -112 102 -116 106 -110C110 -96 106 -70 88 -48Z"/>
      <path d="M76 -48C84 -44 92 -44 98 -48C90 -42 82 -40 74 -44Z" class="tusk-m"/>
      <circle cx="68" cy="-64" r="2" fill="#5a544a" stroke="none"/>
      <path class="spout" d="M104 -112Q150 -170 196 -40"/>
      <path class="spout s2" d="M104 -112Q140 -150 176 -46"/>
    </g>`;
  }
  function saheliyon(id) {
    const r = P.rng(1710);
    let niches = "", jets = "", lotus = "", flowers = "", bougain = "";
    for (let x = 30; x < W; x += 70) niches += P.arch(x, 330, 34, 60, "win gate");
    for (let i = 0; i < 12; i++) {
      const x = 180 + i * 76, h = 70 + (i % 3) * 30;
      jets += `<path class="jet" style="animation-delay:${f(-i * 0.13)}s" d="M${x} 586C${x} ${586 - h} ${x + 4} ${586 - h - 14} ${x + 10} ${586 - h - 6}"/><circle class="spray" style="animation-delay:${f(-i * 0.2)}s" cx="${x + 6}" cy="${586 - h - 12}" r="10"/>`;
    }
    for (let i = 0; i < 22; i++) {
      const x = 140 + r() * 920, y = 612 + r() * 70;
      lotus += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(12 + r() * 10)}" ry="${f(4 + r() * 2)}" fill="#3f7a44"/>${r() < 0.45 ? `<path d="M${f(x)} ${f(y - 2)}c-5 -6 -5 -12 0 -16c5 4 5 10 0 16z" fill="#f7a8c8"/>` : ""}`;
    }
    for (let i = 0; i < 90; i++) flowers += `<circle cx="${f(r() * W)}" cy="${f(742 + r() * 50)}" r="${f(3 + r() * 4)}" fill="${["#e63e5c", "#f9ab00", "#f7a8c8", "#ffffff", "#ea4335"][i % 5]}"/>`;
    for (let i = 0; i < 70; i++) bougain += `<circle cx="${f((i < 35 ? 20 : 1020) + r() * 160)}" cy="${f(250 + r() * 120)}" r="${f(5 + r() * 7)}" fill="${i % 3 ? "#d6337a" : "#f06aa6"}"/>`;
    return {
      vars: { "--pal": "#fdf8ef", "--palShade": "#dcd2c2", "--pline": "#4a4238", "--town": "#f6ecdc", "--line": "#4a4238", "--win": "#5e6f62", "--tree": "#3f6e3a", "--night": "0" },
      svg: `<defs>${defs(id, ["#7cc0ec", "#c3e4f6", "#f7f0dc"], ["#5fb3c9", "#2e8298", "#1c5a6a"])}</defs>
      <rect width="${W}" height="${H}" fill="url(#${id}-sky)"/>
      ${L(0.06, `<g class="pc-cloud">${cloud(300, 90, 1)}${cloud(900, 130, 1.2)}</g>`)}
      ${L(0.18, `<g fill="#2f5a34">${Array.from({ length: 16 }, (_, i) => `<circle cx="${f(i * 80 + r() * 30)}" cy="${f(260 + r() * 40)}" r="${f(60 + r() * 40)}"/>`).join("")}</g>${P.palm(160, 330, 140)}${P.palm(1040, 330, 150)}`)}
      ${L(0.35, `<rect class="pal" x="-10" y="310" width="${W + 20}" height="130"/>${P.kangura(-10, 310, W + 20, 8)}${niches}
        ${P.chhatri(600, 306, 90)}${P.chhatri(160, 306, 40)}${P.chhatri(1040, 306, 40)}${bougain}`)}
      ${L(0.6, `<path class="pal" d="M60 560H1140L1180 600H20Z"/><rect x="20" y="600" width="1160" height="110" fill="url(#${id}-water)"/>
        <path class="pc-shimmer" d="M120 640h80M400 626h120M760 660h90M980 632h70M300 690h110"/>
        ${lotus}
        <g class="pavilion"><rect class="pal" x="520" y="560" width="160" height="24"/>${P.chhatri(600, 560, 120, "pal", 70)}${P.onion(600, 470, 50)}</g>
        ${jets}`)}
      ${L(0.8, `${elephant(90, 610, 1, false, id)}${elephant(1110, 610, 1, true, id)}`)}
      ${L(1.1, `<rect y="730" width="${W}" height="80" fill="#4f7d3f"/><path d="M0 730q60 -18 120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0" fill="#5d8f47"/>${flowers}`)}`,
    };
  }

  /* ---------- Jagdish Temple ---------- */
  function shikhara(cx, base, w, h, cls = "stone") {
    let s = `<path class="${cls}" d="M${cx - w / 2} ${base}C${cx - w / 2 + 4} ${base - h * 0.55} ${cx - w * 0.22} ${base - h * 0.92} ${cx} ${base - h}C${cx + w * 0.22} ${base - h * 0.92} ${cx + w / 2 - 4} ${base - h * 0.55} ${cx + w / 2} ${base}Z"/>`;
    for (let i = 1; i < 8; i++) {
      const y = base - (h * i) / 8, k = 1 - Math.pow(i / 8, 1.6) * 0.8;
      s += `<path class="band" d="M${f(cx - (w / 2) * k)} ${f(y)}H${f(cx + (w / 2) * k)}"/>`;
    }
    s += `<path class="band" d="M${cx} ${base}V${base - h}"/>`;
    s += `<ellipse class="${cls}" cx="${cx}" cy="${base - h}" rx="${f(w * 0.16)}" ry="${f(w * 0.05)}"/><path class="gold" d="M${cx - 5} ${base - h - 4}q5 -16 10 0z"/>`;
    return s;
  }
  function jagdish(id) {
    const r = P.rng(1651);
    const B = 600;
    let steps = "";
    for (let i = 0; i < 12; i++) steps += `<path class="step-l" d="M${f(560 - i * 6)} ${f(B + i * 11)}H${f(640 + i * 6)}"/>`;
    const houses = [[-10, 120, 260, ""], [110, 90, 200, "chhatri"], [980, 110, 230, "twin"], [1090, 120, 280, ""]];
    return {
      vars: { "--pal": "#f3ead8", "--palShade": "#cfc0a4", "--pline": "#4a3c2c", "--town": "#e7eef5", "--line": "#3b3a44", "--win": "#50607a", "--tree": "#4d7a45", "--night": "0" },
      svg: `<defs>${defs(id, ["#6fb4e8", "#b8dcf3", "#fff0d6"])}
        <linearGradient id="${id}-stone" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#efe3cb"/><stop offset=".6" stop-color="#dccaa6"/><stop offset="1" stop-color="#b59f78"/></linearGradient></defs>
      <rect width="${W}" height="${H}" fill="url(#${id}-sky)"/>
      <g class="pc-rays" transform="translate(640 60)">${Array.from({ length: 10 }, (_, i) => `<path d="M0 0L${f(Math.cos(i * 0.3 + 0.3) * 1200)} ${f(Math.sin(i * 0.3 + 0.3) * 1200)}L${f(Math.cos(i * 0.3 + 0.36) * 1200)} ${f(Math.sin(i * 0.3 + 0.36) * 1200)}Z"/>`).join("")}</g>
      ${L(0.06, `<g class="pc-cloud">${cloud(220, 110, 1.1)}${cloud(1000, 70, 0.9)}</g>`)}
      ${L(0.3, houses.map(([x, w, h, roof]) => P.block(r, x, w, h, 680, roof, "town")).join(""))}
      ${L(0.5, `<g style="--stone:url(#${id}-stone)">
        <rect class="stone" x="360" y="${B - 60}" width="480" height="60"/>
        <path class="band" d="M360 ${B - 44}H840M360 ${B - 28}H840M360 ${B - 12}H840"/>
        ${Array.from({ length: 24 }, (_, i) => `<circle class="carve" cx="${372 + i * 20}" cy="${B - 36}" r="4"/>`).join("")}
        <rect class="stone" x="400" y="${B - 150}" width="210" height="90"/>
        ${[0, 1, 2, 3].map((i) => P.arch(420 + i * 48, B - 138, 28, 64, "win gate")).join("")}
        <path class="stone" d="M390 ${B - 150}L505 ${B - 250}L620 ${B - 150}Z"/>
        <path class="band" d="M420 ${B - 168}H590M440 ${B - 188}H570M462 ${B - 210}H548M484 ${B - 232}H526"/>
        ${P.onion(505, B - 246, 30, "stone")}
        <rect class="stone" x="610" y="${B - 170}" width="200" height="110"/>
        ${[0, 1, 2].map((i) => P.arch(628 + i * 58, B - 150, 30, 70, "win gate")).join("")}
        ${shikhara(640, B - 170, 70, 150)}${shikhara(780, B - 170, 70, 150)}
        ${shikhara(710, B - 170, 170, 420)}
        <path class="pole" d="M710 ${B - 596}V${B - 660}"/><path class="dhvaja" d="M710 ${B - 660}l46 12l-46 14z"/>
      </g>`)}
      ${L(0.7, `<path class="stone" style="--stone:url(#${id}-stone)" d="M540 ${B}H660L720 ${B + 140}H480Z"/>${steps}
        <g class="stone-el">${elephantStone(470, B + 130, false)}${elephantStone(730, B + 130, true)}</g>`)}
      ${L(0.9, `<rect y="740" width="${W}" height="60" fill="#8f8577"/><path d="M0 740H${W}" stroke="#6b6358" stroke-width="3"/>`)}
      ${L(0.25, P.birds().replace('class="birds"', 'class="birds pc-birds"'))}`,
    };
  }
  function elephantStone(x, y, flip) {
    return `<g transform="translate(${x} ${y}) scale(${flip ? -0.9 : 0.9} 0.9)">
      <rect x="-60" y="-20" width="130" height="20" class="plinth"/>
      <path d="M-50 -20C-58 -64 -30 -90 10 -88C40 -86 58 -66 60 -40C62 -30 58 -24 54 -20Z"/>
      <path d="M40 -84C60 -96 86 -84 84 -60C82 -40 76 -24 74 -20L64 -20C66 -30 66 -40 62 -44Z"/>
      <path d="M44 -78C30 -78 24 -58 34 -46C42 -42 50 -48 52 -58Z" class="ear"/>
      <rect x="-40" y="-60" width="80" height="26" class="howdah"/></g>`;
  }

  /* ---------- Sajjangarh at sunset ---------- */
  function sajjangarh(id) {
    const r = P.rng(1884);
    const peak = [560, 300];
    let rays = "";
    for (let i = 0; i < 14; i++) rays += `<path d="M0 0L${f(Math.cos((i / 14) * 6.28) * 1300)} ${f(Math.sin((i / 14) * 6.28) * 1300)}L${f(Math.cos((i / 14 + 0.02) * 6.28) * 1300)} ${f(Math.sin((i / 14 + 0.02) * 6.28) * 1300)}Z"/>`;
    return {
      vars: { "--pal": "#ffe2c2", "--palShade": "#d49c7c", "--pline": "#3a2230", "--town": "#e6bca0", "--line": "#2a1a22", "--win": "#6c4a52", "--tree": "#2a1c30", "--night": ".45" },
      svg: `<defs>${defs(id, ["#241a47", "#7a3a66", "#e0695f", "#ffb35c", "#ffe0a0"])}</defs>
      <rect width="${W}" height="${H}" fill="url(#${id}-sky)"/>
      <g class="pc-sun" transform="translate(900 470)"><g class="pc-rays">${rays}</g><circle r="260" fill="url(#${id}-glow)"/><circle r="64" fill="#ffe1a0"/></g>
      ${L(0.06, `<g class="pc-cloud pink">${cloud(260, 170, 1.4)}${cloud(1000, 250, 1.1)}${cloud(620, 110, 0.9)}</g>`)}
      ${L(0.12, `<path fill="#9a6985" d="${P.ridge(r, 520, 70, [], 12, H)}"/>`)}
      ${L(0.3, `<path fill="#6a4965" d="${P.ridge(r, 560, 60, [[peak[0], peak[1], 190]], 10, H)}"/>
        <path class="road" d="M200 800C320 700 300 640 420 600S520 470 540 ${peak[1] + 30}"/>
        <g class="sajjan-pal">${P.block(r, peak[0] - 90, 60, 60, peak[1] + 4, "chhatri")}${P.block(r, peak[0] - 30, 70, 104, peak[1] + 4, "dome")}${P.block(r, peak[0] + 40, 64, 70, peak[1] + 4, "twin")}
          ${P.kangura(peak[0] - 100, peak[1] + 4, 210, 6)}<rect class="pal" x="${peak[0] - 104}" y="${peak[1] + 4}" width="218" height="16"/></g>`)}
      ${L(0.5, `<path fill="#4a3150" d="${P.ridge(r, 640, 50, [], 10, H)}"/>`)}
      ${L(0.8, `<path fill="#2a1c30" d="${P.ridge(r, 720, 40, [], 8, H)}"/><g class="sil-trees" fill="#1c1224">${Array.from({ length: 9 }, (_, i) => `<g transform="translate(${60 + i * 140} ${705 + (i % 2) * 12})"><path d="M0 0v-30" stroke="#1c1224" stroke-width="4"/><ellipse cx="-8" cy="-34" rx="26" ry="8"/><ellipse cx="14" cy="-36" rx="20" ry="7"/></g>`).join("")}</g>`)}
      ${L(0.2, P.birds().replace('class="birds"', 'class="birds pc-birds"'))}`,
    };
  }

  /* ---------- Bagore ki Haveli & Gangaur Ghat at night ---------- */
  function bagore(id) {
    const r = P.rng(1751);
    const WL = 560;
    let stars = "";
    for (let i = 0; i < 90; i++) stars += `<circle cx="${f(r() * W)}" cy="${f(r() * 300)}" r="${f(0.5 + r() * 1.2)}"/>`;
    let people = "";
    for (let i = 0; i < 9; i++) { const x = 90 + i * 70 + r() * 20, y = WL - 20 + (i % 3) * 8; people += `<g transform="translate(${f(x)} ${f(y)})"><circle cy="-22" r="5"/><path d="M-6 0q6 -22 12 0z"/></g>`; }
    let streaks = "";
    for (let i = 0; i < 60; i++) streaks += `<rect class="streak" style="animation-delay:${f(-r() * 3)}s" x="${f(r() * W)}" y="${f(WL + 10 + r() * 200)}" width="${f(2 + r() * 3)}" height="${f(6 + r() * 16)}"/>`;
    const gx = 830, gw = 220, gt = WL - 200;
    return {
      vars: { "--pal": "#eab96a", "--palShade": "#a8783c", "--pline": "#5a3b18", "--town": "#2a2745", "--line": "#9aa3c9", "--win": "#2b2338", "--tree": "#0c1328", "--night": "1", "--glow": "1", "--diya": "1", "--water1": "#101c3c" },
      svg: `<defs>${defs(id, ["#040a20", "#0e1a40", "#23306a"], ["#132250", "#0a1330", "#050a1c"])}
        <radialGradient id="${id}-hglow"><stop offset="0" stop-color="#ffcf6e" stop-opacity=".5"/><stop offset="1" stop-color="#ff9f43" stop-opacity="0"/></radialGradient></defs>
      <rect width="${W}" height="${H}" fill="url(#${id}-sky)"/>
      <g fill="#fff" class="pc-stars">${stars}</g>
      <circle cx="180" cy="120" r="30" fill="#f7f2e2"/><circle cx="180" cy="120" r="90" fill="#fffbe8" opacity=".12"/>
      ${L(0.15, `<path fill="#141c3e" d="${P.ridge(r, 380, 60, [], 10, WL)}"/>`)}
      ${L(0.45, `<ellipse cx="420" cy="340" rx="420" ry="240" fill="url(#${id}-hglow)"/>
        ${P.block(r, 60, 150, 250, WL - 40, "twin")}${P.block(r, 210, 190, 300, WL - 40, "triple")}${P.block(r, 400, 150, 230, WL - 40, "dome")}${P.block(r, 550, 140, 180, WL - 40, "chhatri")}
        <rect class="town" x="${gx}" y="${gt}" width="${gw}" height="160"/>
        ${P.arch(gx + 20, WL - 130, 44, 90, "win lit") + P.arch(gx + 88, WL - 150, 48, 110, "win lit") + P.arch(gx + 156, WL - 130, 44, 90, "win lit")}
        ${P.chhatri(gx + 30, gt, 26, "town")}${P.chhatri(gx + gw / 2, gt, 40, "town")}${P.chhatri(gx + gw - 30, gt, 26, "town")}
        ${Array.from({ length: 6 }, (_, i) => `<rect class="town" x="${i * 6}" y="${WL - 40 + i * 7}" width="${W - i * 12}" height="7"/>`).join("")}
        <g class="aarti">${Array.from({ length: 22 }, (_, i) => `<path transform="translate(${30 + i * 52} ${WL - 26 + (i % 3) * 6})" d="M0 -9c3 3 3 6 0 8c-3 -2 -3 -5 0 -8z"/>`).join("")}</g>
        <g class="people" fill="#0a0f24">${people}</g>`)}
      <rect y="${WL}" width="${W}" height="${H - WL}" fill="url(#${id}-water)"/>
      <g opacity=".4" filter="url(#${id}-wave)" transform="translate(0 ${WL * 2 - 80}) scale(1 -1)"><ellipse cx="420" cy="340" rx="420" ry="240" fill="url(#${id}-hglow)"/></g>
      <g class="streaks">${streaks}</g>
      ${L(0.8, `<g class="diyas-b">${P.diyas(r)}</g><g class="pc-boat" style="transform:translate(0,${WL + 110}px)"><g class="sail">${P.boat(GC[2])}</g></g>`)}`,
    };
  }

  const SCENES = { fatehsagar, saheliyon, jagdish, sajjangarh, bagore };

  /* ---------- gallery ---------- */
  function init() {
    const D = window.CCD;
    const sec = document.getElementById("places");
    const rail = document.getElementById("placesRail");
    if (!sec || !rail) return;
    rail.innerHTML = D.places.map((p, i) => `
      <article class="place-card" tabindex="0" data-i="${i}">
        <div class="pc-frame"><div class="pc-scene"></div><span class="pc-num">0${i + 1}</span></div>
        <div class="pc-cap">
          <span class="pc-tag">${p.tag}</span>
          <h3>${p.name} <span lang="hi">${p.hi}</span></h3>
          <p>${p.text}</p>
          <a class="pc-map" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.q)}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" fill="#ea4335"/><circle cx="12" cy="9" r="2.6" fill="#fff"/></svg>Open in Google Maps</a>
        </div>
      </article>`).join("");

    const cards = [...rail.querySelectorAll(".place-card")];
    cards.forEach((c, i) => {
      const id = "pl" + i + Math.random().toString(36).slice(2, 5);
      const sc = SCENES[D.places[i].scene](id);
      const host = c.querySelector(".pc-scene");
      host.innerHTML = `<svg class="udaipur place-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${D.places[i].name}">${sc.svg}</svg>`;
      const svg = host.firstElementChild;
      Object.entries(sc.vars).forEach(([k, v]) => svg.style.setProperty(k, v));
      if (sc.after) sc.after(svg);
      c._layers = [...svg.querySelectorAll(".pl")];
    });

    const bar = sec.querySelector(".places-progress i");
    const count = sec.querySelector(".places-count b");
    let span = 0;
    function measure() {
      span = Math.max(0, rail.scrollWidth - innerWidth);
      sec.style.height = `${innerHeight + span + innerHeight * 0.25}px`;
    }
    let ticking = false;
    function update() {
      ticking = false;
      const r = sec.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height - innerHeight)));
      rail.style.transform = `translate3d(${f(-p * span)}px,0,0)`;
      if (bar) bar.style.transform = `scaleX(${p})`;
      let near = 0, best = 1e9;
      cards.forEach((c, i) => {
        const b = c.getBoundingClientRect();
        const off = (b.left + b.width / 2 - innerWidth / 2) / innerWidth;
        if (Math.abs(off) < best) { best = Math.abs(off); near = i; }
        if (b.right < -200 || b.left > innerWidth + 200) return;
        c._layers.forEach((g) => g.setAttribute("transform", `translate(${f(-off * 160 * +g.dataset.d)} 0)`));
        c.style.setProperty("--off", off.toFixed(3));
      });
      if (count) count.textContent = String(near + 1).padStart(2, "0");
    }
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    measure(); update();
    addEventListener("resize", () => { measure(); update(); });
    addEventListener("scroll", onScroll, { passive: true });
    // keyboard: focusing a card scrolls the page so it slides into view
    cards.forEach((c, i) => c.addEventListener("focus", () => {
      const top = sec.offsetTop + (span * i) / Math.max(1, cards.length - 1);
      scrollTo({ top, behavior: "smooth" });
    }));
    new IntersectionObserver(([en]) => sec.classList.toggle("paused", !en.isIntersecting)).observe(sec);
  }

  window.UdaipurPlaces = { init, SCENES };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
