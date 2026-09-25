/* ==========================================================================
   Udaipur, drawn in code.
   Lake Pichola with the City Palace, the Lake Palace, Jag Mandir, Gangaur
   Ghat, Sajjangarh on the Aravallis and the Karni Mata ropeway. The scene
   can be set to any hour: dawn mist, kites at noon, sunset over the ridge,
   and a gold-lit palace with diyas and wedding-season fireworks at night.
   ========================================================================== */
(function () {
  const W = 1600, H = 760, WL = 520; // width, height, water line
  const GC = ["#4285f4", "#34a853", "#f9ab00", "#ea4335"];

  function rng(seed) {
    return function () {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
  }
  const f = (n) => Math.round(n * 10) / 10;

  /* ---------- architectural parts ---------- */
  const arch = (x, y, w, h, cls = "win") =>
    `<path class="${cls}" d="M${f(x)} ${f(y + h)}V${f(y + w / 2)}A${f(w / 2)} ${f(w / 2)} 0 0 1 ${f(x + w)} ${f(y + w / 2)}V${f(y + h)}Z"/>`;

  // Rajput kanguras: the rounded crenellations along every parapet
  function kangura(x, y, w, s = 6, cls = "pal") {
    const n = Math.max(1, Math.floor(w / (s * 1.7)));
    const step = w / n;
    let d = "";
    for (let i = 0; i < n; i++) {
      const cx = x + i * step + step / 2;
      d += `M${f(cx - s / 2)} ${f(y)}v${f(-s * 0.45)}a${f(s / 2)} ${f(s / 2)} 0 0 1 ${s} 0v${f(s * 0.45)}z`;
    }
    return `<path class="${cls}" d="${d}"/>`;
  }

  function chhatri(cx, base, w, cls = "pal", ph = w * 0.55) {
    const y0 = base - 3 - ph;
    const top = y0 - 3;
    return `<g class="${cls}">
      <rect x="${f(cx - w / 2 - 3)}" y="${f(base - 3)}" width="${f(w + 6)}" height="3"/>
      <path class="post" d="M${f(cx - w / 2 + 2)} ${f(base - 3)}V${f(y0)}M${f(cx + w / 2 - 2)} ${f(base - 3)}V${f(y0)}${w > 20 ? `M${f(cx)} ${f(base - 3)}V${f(y0)}` : ""}"/>
      <rect x="${f(cx - w / 2 - 4)}" y="${f(top)}" width="${f(w + 8)}" height="3"/>
      <path d="M${f(cx - w / 2)} ${f(top)}C${f(cx - w / 2)} ${f(top - w * 0.6)} ${f(cx - w * 0.15)} ${f(top - w * 0.75)} ${f(cx)} ${f(top - w * 0.9)}C${f(cx + w * 0.15)} ${f(top - w * 0.75)} ${f(cx + w / 2)} ${f(top - w * 0.6)} ${f(cx + w / 2)} ${f(top)}Z"/>
      <path class="post" d="M${f(cx)} ${f(top - w * 0.9)}v-6"/>
    </g>`;
  }

  function onion(cx, base, w, cls = "pal") {
    const b = base - 8;
    return `<g class="${cls}">
      <rect x="${f(cx - w / 2 - 2)}" y="${f(b)}" width="${f(w + 4)}" height="8"/>
      <path d="M${f(cx - w / 2)} ${f(b)}C${f(cx - w * 0.66)} ${f(b - w * 0.45)} ${f(cx - w * 0.3)} ${f(b - w * 0.8)} ${f(cx)} ${f(b - w * 1.05)}C${f(cx + w * 0.3)} ${f(b - w * 0.8)} ${f(cx + w * 0.66)} ${f(b - w * 0.45)} ${f(cx + w / 2)} ${f(b)}Z"/>
      <path class="post" d="M${f(cx)} ${f(b - w * 1.05)}v-12"/><circle cx="${f(cx)}" cy="${f(b - w * 1.05 - 14)}" r="2.4"/>
    </g>`;
  }

  // A jharokha: the projecting, canopied balcony of Rajput palaces
  function jharokha(cx, y, w, lit, cls = "pal") {
    const h = w * 0.8;
    return `<g class="${cls}">
      <path d="M${f(cx - w / 2 + 2)} ${f(y + h)}l4 7h${f(w - 12)}l4 -7z"/>
      <rect x="${f(cx - w / 2)}" y="${f(y)}" width="${f(w)}" height="${f(h)}"/>
      <path d="M${f(cx - w / 2 - 4)} ${f(y)}Q${f(cx)} ${f(y - w * 0.5)} ${f(cx + w / 2 + 4)} ${f(y)}Z"/>
    </g>${arch(cx - w * 0.28, y + h * 0.16, w * 0.56, h * 0.74, lit ? "win lit" : "win")}`;
  }

  function windowClass(r) {
    const roll = r();
    if (roll < 0.035) return "win a" + Math.floor(r() * 4);
    return roll < 0.5 ? "win lit" : "win";
  }

  // A palace block: storeys of arched windows, string courses, balconies and a roofline
  function block(r, x, w, h, base, roof, cls = "pal") {
    const top = base - h;
    let s = `<rect class="${cls}" x="${x}" y="${f(top)}" width="${w}" height="${f(h)}"/>`;
    s += `<rect class="shade" x="${f(x + w * 0.8)}" y="${f(top)}" width="${f(w * 0.2)}" height="${f(h)}"/>`;
    const floors = Math.max(1, Math.floor((h - 16) / 34));
    const cols = Math.max(1, Math.floor((w - 8) / 19));
    const gap = (w - cols * 9) / (cols + 1);
    for (let j = 0; j < floors; j++) {
      const fy = top + 12 + j * 34;
      if (j) s += `<path class="course" d="M${x} ${f(fy - 3)}H${x + w}"/>`;
      const jh = w > 58 && r() < 0.4 ? Math.floor(r() * cols) : -1;
      for (let i = 0; i < cols; i++) {
        const wx = x + gap + i * (9 + gap);
        if (i === jh) s += jharokha(wx + 4.5, fy + 2, 22, r() < 0.6, cls);
        else s += arch(wx, fy + 5, 9, 18, windowClass(r));
      }
    }
    s += `<rect class="${cls}" x="${x - 3}" y="${f(top - 4)}" width="${w + 6}" height="4"/>` + kangura(x, top - 4, w, 6, cls);
    const t = top - 4;
    if (roof === "chhatri") s += chhatri(x + w / 2, t, Math.min(26, w * 0.34), cls);
    if (roof === "twin") s += chhatri(x + w * 0.24, t, 18, cls) + chhatri(x + w * 0.76, t, 18, cls);
    if (roof === "triple") s += chhatri(x + w * 0.18, t, 16, cls) + chhatri(x + w * 0.5, t, 26, cls) + chhatri(x + w * 0.82, t, 16, cls);
    if (roof === "dome") s += onion(x + w / 2, t, Math.min(40, w * 0.62), cls);
    if (roof === "dome2") s += onion(x + w / 2, t, 34, cls) + chhatri(x + 10, t, 12, cls) + chhatri(x + w - 10, t, 12, cls);
    return s;
  }

  /* ---------- landmarks ---------- */
  function cityPalace(r, id) {
    const B = WL - 72;
    let s = `<ellipse class="flood" cx="1290" cy="340" rx="470" ry="290" fill="url(#${id}-flood)"/>`;
    // the fortified plinth rising straight out of the lake
    s += `<path class="pal" d="M972 ${WL}V${B}H1600V${WL}Z"/>`;
    for (let x = 996; x < 1600; x += 66) s += `<rect class="shade" x="${x}" y="${B}" width="7" height="72"/>`;
    for (let x = 986; x < 1590; x += 33) s += arch(x, WL - 34, 16, 34, "win gate");
    s += kangura(972, B, 628, 6);
    const blocks = [
      [990, 72, 130, "chhatri"], [1062, 92, 190, "twin"], [1154, 56, 262, "dome"], [1210, 122, 222, "triple"],
      [1332, 68, 292, "dome2"], [1400, 104, 236, "twin"], [1504, 52, 176, "chhatri"], [1556, 60, 140, "twin"],
    ];
    blocks.forEach(([x, w, h, roof]) => (s += block(r, x, w, h, B, roof)));
    // wedding lights strung along the parapet
    for (let x = 978; x < 1598; x += 11) s += `<circle class="bulb" cx="${x}" cy="${B - 3}" r="1.9" style="animation-delay:${f(-(x % 13) * 0.23)}s"/>`;
    for (let x = 1000; x < 1590; x += 16) s += `<circle class="bulb" cx="${x}" cy="${f(B - 140 + Math.sin(x / 40) * 4)}" r="1.5" style="animation-delay:${f(-(x % 11) * 0.3)}s"/>`;
    return `<g class="citypalace">${s}</g>`;
  }

  function lakePalace(r) {
    const B = WL - 6;
    let s = `<rect class="pal" x="620" y="${B}" width="360" height="6"/>`;
    s += `<path class="pal" d="M612 ${WL}l10 -6h356l10 6z"/>`;
    s += block(r, 640, 86, 50, B, "twin") + block(r, 726, 148, 78, B, "dome") + block(r, 874, 88, 56, B, "triple");
    for (let x = 628; x < 978; x += 12) s += `<circle class="bulb" cx="${x}" cy="${B - 2}" r="1.6" style="animation-delay:${f(-(x % 9) * 0.3)}s"/>`;
    return `<g class="lakepalace">${s}</g>`;
  }

  function jagMandir(r) {
    const B = WL - 4;
    let s = `<rect class="pal" x="430" y="${B}" width="176" height="4"/>`;
    s += block(r, 446, 144, 34, B, "") + onion(518, B - 38, 26) + chhatri(452, B - 38, 12) + chhatri(584, B - 38, 12);
    return `<g class="jagmandir">${s}</g>`;
  }

  function oldCity(r) {
    const B = WL - 44;
    let s = "";
    // Jagdish temple shikhara rising behind the rooftops
    const tx = 142, tb = B - 96;
    s += `<g class="town"><path d="M${tx - 30} ${tb}C${tx - 28} ${tb - 64} ${tx - 12} ${tb - 116} ${tx} ${tb - 132}C${tx + 12} ${tb - 116} ${tx + 28} ${tb - 64} ${tx + 30} ${tb}Z"/>
      <path class="course" d="M${tx - 22} ${tb - 30}H${tx + 22}M${tx - 15} ${tb - 66}H${tx + 15}M${tx - 8} ${tb - 98}H${tx + 8}"/>
      <circle cx="${tx}" cy="${tb - 136}" r="5"/><path class="post" d="M${tx} ${tb - 141}v-18"/></g>
      <path class="flag" d="M${tx} ${tb - 159}l20 6-20 6z"/>`;
    const houses = [[0, 58, 104, "chhatri"], [58, 46, 150, ""], [104, 70, 92, "twin"], [174, 58, 124, ""], [384, 70, 108, "chhatri"]];
    houses.forEach(([x, w, h, roof]) => (s += block(r, x, w, h, B, roof, "town")));
    // Gangaur Ghat's tripolia: the triple-arched gate onto the water
    const gx = 236, gw = 146, gh = 124, gt = B - gh;
    s += `<rect class="town" x="${gx}" y="${gt}" width="${gw}" height="${gh}"/><rect class="shade" x="${gx + gw * 0.84}" y="${gt}" width="${gw * 0.16}" height="${gh}"/>`;
    s += arch(gx + 14, B - 64, 30, 64, "win gate") + arch(gx + 56, B - 88, 34, 88, "win gate") + arch(gx + 102, B - 64, 30, 64, "win gate");
    s += `<rect class="town" x="${gx - 3}" y="${gt - 4}" width="${gw + 6}" height="4"/>` + kangura(gx, gt - 4, gw, 6, "town");
    s += chhatri(gx + 22, gt - 4, 18, "town") + chhatri(gx + gw / 2, gt - 4, 28, "town") + chhatri(gx + gw - 22, gt - 4, 18, "town");
    // ghat steps into the lake, with aarti lamps
    for (let i = 0; i < 6; i++) s += `<rect class="town step" x="${i * 4}" y="${f(B + i * 7.3)}" width="${470 - i * 6}" height="7.3"/>`;
    for (let x = 30; x < 440; x += 38) s += `<g class="aarti" transform="translate(${x} ${B + 16 + (x % 3) * 7})"><path d="M0 -8c3 3 3 6 0 8c-3 -2 -3 -5 0 -8z"/></g>`;
    return `<g class="oldcity">${s}</g>`;
  }

  function sajjangarh(px, py) {
    return `<g class="far-pal">
      <rect x="${px - 50}" y="${py - 28}" width="100" height="28"/><rect x="${px - 16}" y="${py - 58}" width="32" height="30"/>
      ${kangura(px - 50, py - 28, 100, 5, "far-pal")}
      ${onion(px, py - 58, 22, "far-pal")}${chhatri(px - 38, py - 28, 12, "far-pal")}${chhatri(px + 38, py - 28, 12, "far-pal")}
      ${[-40, -26, 18, 32].map((dx) => arch(px + dx, py - 22, 7, 13, "win lit")).join("")}
    </g>`;
  }

  function ropeway(id) {
    const a = [452, 470], b = [612, 300];
    const path = `M${a[0]} ${a[1]}L${b[0]} ${b[1] + 6}`;
    return `<g class="ropeway">
      <path class="cable" d="${path}M${a[0] + 4} ${a[1] + 3}L${b[0] + 4} ${b[1] + 9}"/>
      <g class="cabin-wrap">
        <g class="cabin"><path class="cable" d="M0 0v7"/><rect x="-7" y="7" width="14" height="11" rx="2" fill="${GC[3]}"/><rect x="-4.5" y="9.5" width="9" height="4" fill="#fff" opacity=".8"/></g>
        <animateMotion dur="34s" repeatCount="indefinite" calcMode="linear" keyPoints="0;1;1;0;0" keyTimes="0;.46;.5;.96;1" path="${path}"/>
      </g>
      <g class="cabin-wrap">
        <g class="cabin"><path class="cable" d="M0 0v7"/><rect x="-7" y="7" width="14" height="11" rx="2" fill="${GC[0]}"/><rect x="-4.5" y="9.5" width="9" height="4" fill="#fff" opacity=".8"/></g>
        <animateMotion dur="34s" begin="-17s" repeatCount="indefinite" calcMode="linear" keyPoints="0;1;1;0;0" keyTimes="0;.46;.5;.96;1" path="${path}"/>
      </g>
      ${chhatri(b[0], b[1] + 2, 16, "far-pal")}
    </g>`;
  }

  /* ---------- terrain ---------- */
  function ridge(r, base, amp, peaks, jitter, bottom = WL) {
    const a = r() * 6, b = r() * 6, c = r() * 6;
    const pts = [];
    for (let x = -40; x <= W + 40; x += 22) {
      const n = (Math.sin(x * 0.0042 + a) + Math.sin(x * 0.011 + b) * 0.5 + Math.sin(x * 0.029 + c) * 0.25) / 1.75;
      let y = base - amp * (n * 0.5 + 0.5) + (r() - 0.5) * jitter;
      peaks.forEach(([px, py, pw]) => {
        const g = base - (base - py) * Math.exp(-(((x - px) / pw) ** 2));
        y = Math.min(y, g + (r() - 0.5) * jitter * 0.6);
      });
      pts.push(`${x} ${f(y)}`);
    }
    return `M-40 ${bottom}L${pts.join("L")}L${W + 40} ${bottom}Z`;
  }

  function trees(r, x0, x1, y, size) {
    let s = "";
    for (let x = x0; x < x1; x += size * (0.9 + r() * 0.8)) {
      const rr = size * (0.5 + r() * 0.5);
      s += `<circle cx="${f(x)}" cy="${f(y - rr * 0.8)}" r="${f(rr)}"/><circle cx="${f(x + rr * 0.6)}" cy="${f(y - rr * 1.2)}" r="${f(rr * 0.7)}"/>`;
    }
    return `<g class="tree">${s}</g>`;
  }
  const palm = (x, y, h) => `<g class="palm"><path d="M${x} ${y}q4 ${-h / 2} -2 ${-h}"/><path d="M${x - 2} ${y - h}q-16 -2 -24 10M${x - 2} ${y - h}q14 -8 26 2M${x - 2} ${y - h}q-6 -14 -18 -16M${x - 2} ${y - h}q8 -14 20 -12M${x - 2} ${y - h}q2 8 -4 18"/></g>`;

  /* ---------- sky & water life ---------- */
  function kites(r) {
    const spots = [[150, 118, 0], [560, 70, 1], [820, 150, 2], [1060, 60, 3], [1470, 96, 1]];
    return `<g class="kites">${spots.map(([x, y, c], i) => {
      const sx = (r() - 0.5) * 160, sy = WL - 70 - y;
      return `<g class="kite" data-kite="${i}" transform="translate(${x} ${y})" role="button" aria-label="A kite over Udaipur">
        <g class="k-fly" style="animation-delay:${f(-i * 1.3)}s">
          <path class="k-string" d="M0 26Q${f(sx * 0.4)} ${f(sy * 0.55)} ${f(sx)} ${f(sy)}"/>
          <path d="M0 -24L17 0L0 26L-17 0Z" fill="${GC[c]}"/>
          <path d="M0 -24V26M-17 0H17" class="k-spine"/>
          <path d="M0 26l-5 9h10z M0 36l-4 7h8z" fill="${GC[(c + 2) % 4]}"/>
        </g></g>`;
    }).join("")}</g>`;
  }

  function fireworks() {
    const spots = [[1140, 140, 0, 0], [1390, 96, 2, 1.1], [880, 190, 3, 2.3], [1520, 190, 1, 0.6], [1260, 70, 0, 1.8], [700, 120, 2, 2.9]];
    return `<g class="fireworks">${spots.map(([x, y, c, d]) => {
      let rays = "";
      for (let i = 0; i < 20; i++) {
        const a = (i / 20) * Math.PI * 2, r1 = 8, r2 = 44 + (i % 3) * 6;
        rays += `M${f(Math.cos(a) * r1)} ${f(Math.sin(a) * r1)}L${f(Math.cos(a) * r2)} ${f(Math.sin(a) * r2)}`;
      }
      return `<g transform="translate(${x} ${y})"><g class="burst" style="--d:${d}s;stroke:${GC[c]}"><path d="${rays}"/><circle r="3" fill="#fff"/></g></g>`;
    }).join("")}</g>`;
  }

  function diyas(r) {
    let s = "";
    for (let i = 0; i < 22; i++) {
      const x = 80 + r() * 1440, y = WL + 36 + r() * 190;
      const k = 0.7 + (y - WL) / 260;
      s += `<g transform="translate(${f(x)} ${f(y)}) scale(${f(k)})"><g class="diya" style="animation-delay:${f(-r() * 4)}s">
        <ellipse class="d-glow" cx="0" cy="-6" rx="10" ry="12"/>
        <rect class="d-streak" x="-1" y="3" width="2" height="16"/>
        <path d="M-6 0q6 5 12 0z" fill="${GC[i % 4]}"/>
        <path class="flame" d="M0 -9c3 3 3 6 0 8c-3 -2 -3 -5 0 -8z"/></g></g>`;
    }
    return `<g class="diyas">${s}</g>`;
  }

  const boat = (color, rev) => `<g class="shikara"${rev ? ' transform="scale(-1 1)"' : ""}>
      <path class="wake" d="M-54 6L-120 -2M-54 9L-124 20M-80 3L-150 6"/>
      <path class="hull" d="M-52 0Q-40 13 0 13Q40 13 54 -3Q32 5 0 5Q-32 5 -52 0Z"/>
      <path class="post" d="M-24 4V-20M24 4V-20"/>
      <path class="canopy" style="fill:${color}" d="M-32 -20Q0 -34 32 -20L28 -16Q0 -26 -28 -16Z"/>
      <circle class="lantern" cx="0" cy="-12" r="3"/>
      <g class="rower"><circle cx="-40" cy="-12" r="3.4"/><path d="M-40 -8V2M-40 -4L-30 8"/></g>
    </g>`;

  function birds() {
    const v = [[0, 0], [-16, -8], [-16, 8], [-32, -16], [-32, 16], [-48, -22], [-48, 24]];
    return `<g class="birds"><g class="flock">${v.map(([x, y], i) =>
      `<path class="bird" style="animation-delay:${f(-i * 0.17)}s" d="M${x - 7} ${y}q3.5 -5 7 0q3.5 -5 7 0"/>`).join("")}</g></g>`;
  }

  const lotus = (x, y, idx) => `<g class="lotus-egg" data-lake="${idx}" transform="translate(${x} ${y})" tabindex="0" role="button" aria-label="A lotus on the lake">
      <ellipse class="pad" cx="0" cy="3" rx="22" ry="5"/>
      <path d="M0 0C-6 -6 -6 -14 0 -20C6 -14 6 -6 0 0Z"/><path d="M0 0C-10 -2 -16 -8 -16 -14C-8 -12 -3 -7 0 0Z"/><path d="M0 0C10 -2 16 -8 16 -14C8 -12 3 -7 0 0Z"/></g>`;

  /* ---------- assemble ---------- */
  function build(el, opts = {}) {
    const id = "u" + Math.random().toString(36).slice(2, 7);
    const r = rng(opts.seed || 7);
    const stars = Array.from({ length: 160 }, (_, i) =>
      `<circle${i % 5 === 0 ? ' class="tw"' : ""} style="animation-delay:${f(-r() * 4)}s" cx="${f(r() * (W + 800) - 400)}" cy="${f(r() * 1300 - 1000)}" r="${f(r() * 1.3 + 0.4)}"/>`).join("");
    const clouds = [[140, 120, 1], [980, 70, 1.3], [1380, 210, 0.8], [520, 230, 0.7], [300, -120, 1.2], [1200, -260, 1.4]].map(([x, y, s]) =>
      `<g class="cloud" transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="0" rx="80" ry="16"/><ellipse cx="-24" cy="-12" rx="34" ry="18"/><ellipse cx="18" cy="-18" rx="40" ry="24"/><ellipse cx="54" cy="-6" rx="30" ry="14"/></g>`).join("");

    const streaks = Array.from({ length: 70 }, () => {
      const onPal = r() < 0.72;
      const x = onPal ? 980 + r() * 610 : 626 + r() * 350;
      return `<rect class="streak" style="animation-delay:${f(-r() * 3)}s" x="${f(x)}" y="${f(WL + 6 + r() * 150)}" width="${f(2 + r() * 3)}" height="${f(6 + r() * 16)}"/>`;
    }).join("");
    const glints = Array.from({ length: 16 }, (_, i) =>
      `<ellipse style="animation-delay:${f(-r() * 2)}s" cx="${f((r() - 0.5) * (18 + i * 5))}" cy="${WL + 8 + i * 13}" rx="${f(10 + i * 2.2)}" ry="1.6"/>`).join("");

    const city = `
      <path class="h1" d="${ridge(r, 486, 18, [], 6)}"/>
      ${trees(r, 380, 640, WL - 6, 16)}${trees(r, 900, 985, WL - 30, 14)}${palm(412, WL - 12, 46)}${palm(612, WL - 14, 52)}${palm(930, WL - 40, 44)}
      ${oldCity(r)}${jagMandir(r)}${cityPalace(r, id)}${lakePalace(r)}`;

    el.innerHTML = `<svg class="udaipur" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" role="img" aria-label="Udaipur at Lake Pichola: the City Palace, the Lake Palace, Jag Mandir, Gangaur Ghat and Sajjangarh on the Aravalli hills">
      <defs>
        <linearGradient id="${id}-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--sky1)"/><stop offset=".62" style="stop-color:var(--sky2)"/><stop offset="1" style="stop-color:var(--sky3)"/></linearGradient>
        <linearGradient id="${id}-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--water1)"/><stop offset="1" style="stop-color:var(--water2)"/></linearGradient>
        <linearGradient id="${id}-haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--sky3)" stop-opacity="0"/><stop offset="1" style="stop-color:var(--sky3)" stop-opacity=".75"/></linearGradient>
        <linearGradient id="${id}-mist" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".55" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
        <radialGradient id="${id}-sun"><stop offset="0" stop-color="#fff8e0"/><stop offset=".35" style="stop-color:var(--sun)" stop-opacity=".7"/><stop offset="1" style="stop-color:var(--sun)" stop-opacity="0"/></radialGradient>
        <radialGradient id="${id}-moon"><stop offset="0" stop-color="#fffbe8" stop-opacity=".45"/><stop offset="1" stop-color="#fffbe8" stop-opacity="0"/></radialGradient>
        <radialGradient id="${id}-flood"><stop offset="0" stop-color="#ffcf6e" stop-opacity=".55"/><stop offset=".6" stop-color="#ff9f43" stop-opacity=".16"/><stop offset="1" stop-color="#ff9f43" stop-opacity="0"/></radialGradient>
        <pattern id="${id}-ripple" width="60" height="7" patternUnits="userSpaceOnUse"><rect width="60" height="3.6" fill="#fff"/><rect x="20" y="3.6" width="40" height="1.4" fill="#fff" opacity=".5"/></pattern>
        <mask id="${id}-mask"><rect class="ripple-rect" x="-400" y="${WL}" width="${W + 800}" height="${H}" fill="url(#${id}-ripple)"/></mask>
        <filter id="${id}-wave" x="-5%" y="0" width="110%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.006 0.09" numOctaves="1" seed="3"/><feDisplacementMap in="SourceGraphic" scale="9"/></filter>
        <filter id="${id}-soft"><feGaussianBlur stdDeviation="2.4"/></filter>
      </defs>
      <rect x="-400" y="-1100" width="${W + 800}" height="${H + 1100}" fill="url(#${id}-sky)"/>
      <g class="stars">${stars}</g>
      <g class="sun"><circle r="150" fill="url(#${id}-sun)"/><circle class="disc" r="34"/></g>
      <g class="moon"><circle r="90" fill="url(#${id}-moon)"/><circle class="disc" r="24"/><circle class="crater" cx="-7" cy="-5" r="4.5"/><circle class="crater" cx="8" cy="7" r="3"/></g>
      <g class="clouds" filter="url(#${id}-soft)">${clouds}</g>
      ${fireworks()}
      ${kites(r)}
      <g class="L L-far" data-depth="5">
        <path class="h4" d="${ridge(r, 340, 80, [[270, 176, 80], [1180, 230, 140]], 12)}"/>
        ${sajjangarh(270, 178)}
      </g>
      <rect class="haze" x="-400" y="200" width="${W + 800}" height="${WL - 200}" fill="url(#${id}-haze)"/>
      <g class="L L-mid" data-depth="10">
        <path class="h3" d="${ridge(r, 400, 56, [[612, 300, 70], [1460, 300, 120]], 10)}"/>
        ${ropeway(id)}
      </g>
      <rect class="haze" x="-400" y="330" width="${W + 800}" height="${WL - 330}" fill="url(#${id}-haze)" opacity=".6"/>
      <g class="L L-near" data-depth="15"><path class="h2" d="${ridge(r, 446, 34, [], 8)}"/></g>
      <rect class="mist" x="-400" y="${WL - 150}" width="${W + 800}" height="200" fill="url(#${id}-mist)"/>
      <g class="L L-city" data-depth="22"><g id="${id}-city">${city}</g></g>
      <rect class="water" x="-400" y="${WL}" width="${W + 800}" height="${H - WL + 10}" fill="url(#${id}-water)"/>
      <g class="reflection" mask="url(#${id}-mask)"><g filter="url(#${id}-wave)"><use href="#${id}-city" class="refl-use" transform="translate(0 ${WL * 2}) scale(1 -1)"/></g></g>
      <g class="streaks">${streaks}</g>
      <g class="glitter">${glints}</g>
      <g class="shimmer"><path d="M60 ${WL + 40}h90M260 ${WL + 76}h60M720 ${WL + 30}h120M800 ${WL + 96}h70M1180 ${WL + 66}h140M1420 ${WL + 118}h80M420 ${WL + 140}h110M1000 ${WL + 180}h90"/></g>
      ${diyas(r)}
      <g class="boats">
        <g class="lane" style="transform:translateY(${WL + 60}px)"><g class="sail s1">${boat(GC[3])}</g></g>
        <g class="lane" style="transform:translateY(${WL + 118}px)"><g class="sail s2">${boat(GC[0], true)}</g></g>
        <g class="lane" style="transform:translateY(${WL + 186}px) scale(1.25)"><g class="sail s3">${boat(GC[2])}</g></g>
      </g>
      ${birds()}
      ${opts.lotus != null ? lotus(opts.lotusX || 1320, WL + 200, opts.lotus) : ""}
    </svg>`;
    const svg = el.firstElementChild;
    const layers = [...svg.querySelectorAll(".L")];

    // Always show the whole lake: extend the sky upward on tall screens,
    // crop the sides only when the screen is very narrow.
    function fit() {
      const w = el.clientWidth || 1, h = el.clientHeight || 1;
      const vh = Math.max(H, Math.min(opts.maxH || 1250, (W * h) / w));
      svg.setAttribute("viewBox", `0 ${f(H - vh)} ${W} ${f(vh)}`);
    }
    fit();
    if ("ResizeObserver" in window) new ResizeObserver(fit).observe(el);

    // Save battery: freeze every animation while the scene is off-screen
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([en]) => {
        svg.classList.toggle("paused", !en.isIntersecting);
        try { en.isIntersecting ? svg.unpauseAnimations() : svg.pauseAnimations(); } catch (e) { /* SMIL unsupported */ }
      }).observe(el);
    }

    return {
      svg,
      setHour: (hr) => setHour(svg, hr),
      parallax(x, y) {
        layers.forEach((g) => {
          const d = +g.dataset.depth;
          g.setAttribute("transform", `translate(${f(x * d)} ${f(y * d * 0.35)})`);
        });
      },
    };
  }

  /* ---------- time of day ---------- */
  // colours: sky1 sky2 sky3 h4 h3 h2 h1 tree water1 water2 pal palShade pline town line win sun cloud glint bird
  // numbers: stars night day fireworks glow mist diya glitter cloudA birdA
  const CK = ["--sky1", "--sky2", "--sky3", "--h4", "--h3", "--h2", "--h1", "--tree", "--water1", "--water2", "--pal", "--palShade", "--pline", "--town", "--line", "--win", "--sun", "--cloud", "--glint", "--bird"];
  const NK = ["--stars", "--night", "--day", "--fw", "--glow", "--mist", "--diya", "--glitter", "--cloudA", "--birdA"];
  const NIGHT = [["#040920", "#0b1638", "#1b2654", "#141c3e", "#10173a", "#0d1331", "#0a0f28", "#0b1226", "#0e1a3a", "#050a1c", "#e4b367", "#a8783c", "#5a3b18", "#1f2544", "#8d96c0", "#231d33", "#ffb347", "#18213f", "#fff3c4", "#aab3d8"], [1, 1, 0, 0.7, 1, 0, 1, 0.35, 0.35, 0]];
  const KEYS = [
    [0, ...NIGHT],
    [4.8, ["#0e1440", "#2e2c66", "#8b5a7e", "#3a3566", "#312d5b", "#29264f", "#201e44", "#1a1b36", "#35355f", "#131433", "#d8b894", "#a68a79", "#4a3438", "#39335a", "#b9a8c6", "#2c2640", "#ff8a5c", "#584c7c", "#ffd9b0", "#d9cde3"], [0.55, 0.75, 0, 0, 0.6, 0.5, 0.6, 0.2, 0.5, 0.2]],
    [6.3, ["#6a87c4", "#f2a88e", "#ffd4a0", "#c8a3b3", "#b28fa4", "#9a7e93", "#7c6a7f", "#5d6b5f", "#d9a19a", "#7c7ea6", "#fbe8d9", "#d7b5ad", "#3b2c33", "#efd8ca", "#3b2c33", "#8b7486", "#ff9a57", "#ffcdb8", "#ffe2c0", "#3b2c33"], [0, 0.1, 0.3, 0, 0, 0.9, 0, 0.8, 0.8, 0.8]],
    [8, ["#79b3e8", "#c9e3f6", "#f8ebd8", "#b6c4d3", "#a3b6b6", "#8fa894", "#78937c", "#557a54", "#8cc3dd", "#3a82aa", "#fffaf2", "#e2dacb", "#2a262c", "#fbf1e2", "#2a262c", "#5f7489", "#ffd27a", "#ffffff", "#fff4d8", "#2a262c"], [0, 0, 1, 0, 0, 0.45, 0, 0.5, 0.85, 1]],
    [13, ["#3c9be5", "#9dcff3", "#e4f3fb", "#a8c2d6", "#95b4ae", "#82a689", "#6b9373", "#4b7a4c", "#56abd6", "#1b6d9b", "#ffffff", "#e4e0d8", "#1f1f24", "#fdf7ee", "#1f1f24", "#566d82", "#fff3b8", "#ffffff", "#ffffff", "#1f1f24"], [0, 0, 1, 0, 0, 0, 0, 0.45, 0.8, 1]],
    [16.4, ["#5c9ad6", "#f2cc8f", "#ffdc98", "#d6b797", "#c4a182", "#ab896b", "#8f7255", "#5f6d3e", "#e6b476", "#6b7c9a", "#fff0d4", "#e3c395", "#2c2016", "#f6e0bd", "#2c2016", "#7a5f45", "#ffbf47", "#fff0cf", "#fff0c0", "#2c2016"], [0, 0, 0.9, 0, 0, 0.08, 0, 0.9, 0.8, 1]],
    [17.9, ["#34437f", "#de6f78", "#ffae58", "#9a6985", "#825975", "#6a4965", "#533955", "#3e3645", "#ee9669", "#553b6b", "#ffd8ae", "#d49d78", "#2a1a22", "#e6bca0", "#2a1a22", "#6c4a52", "#ff7239", "#ff9f8a", "#ffc27a", "#2a1a22"], [0, 0.3, 0.35, 0, 0.25, 0.15, 0.2, 1, 0.75, 0.8]],
    [18.7, ["#151c4d", "#553b7a", "#d0686a", "#3a3461", "#312b54", "#282447", "#1f1c3b", "#1a1a30", "#62457a", "#1a1839", "#efc07a", "#bb8646", "#5b3d20", "#383257", "#b7a8c8", "#2d2540", "#ff5f37", "#5f4478", "#ffdca0", "#c8bbd8"], [0.35, 0.8, 0, 0.35, 0.85, 0, 0.75, 0.45, 0.5, 0.3]],
    [19.8, ["#050b24", "#101c46", "#26306a", "#151d40", "#11183b", "#0e1432", "#0b1029", "#0c1328", "#101c3c", "#060b1e", "#e8b86a", "#ab7a3d", "#5a3b18", "#211f40", "#909ac4", "#241e36", "#ffb347", "#1a2242", "#fff3c4", "#aab3d8"], [0.95, 1, 0, 1, 1, 0, 1, 0.4, 0.35, 0]],
    [24, ...NIGHT],
  ];

  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, t) => {
    const A = hex(a), B = hex(b);
    return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")).join("");
  };
  const lum = (h) => { const [r, g, b] = hex(h); return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; };

  function setHour(svg, hour) {
    hour = ((hour % 24) + 24) % 24;
    let i = 0;
    while (i < KEYS.length - 2 && KEYS[i + 1][0] <= hour) i++;
    const a = KEYS[i], b = KEYS[i + 1];
    const t = (hour - a[0]) / (b[0] - a[0]);
    const cols = CK.map((k, j) => mix(a[1][j], b[1][j], t));
    CK.forEach((k, j) => svg.style.setProperty(k, cols[j]));
    NK.forEach((k, j) => svg.style.setProperty(k, (a[2][j] + (b[2][j] - a[2][j]) * t).toFixed(3)));

    // Sun rises over the eastern Aravallis at ~6:40 and sets behind Sajjangarh at ~17:50
    const arc = (h, from, len, lift) => {
      const p = (h - from) / len;
      return { x: 1500 - p * 1300, y: 470 - Math.sin(Math.PI * Math.min(1, Math.max(0, p))) * lift, up: p > -0.04 && p < 1.04 };
    };
    const s = arc(hour, 6.1, 12.1, 420);
    const m = arc(hour < 12 ? hour + 24 : hour, 18.4, 12, 360);
    const sun = svg.querySelector(".sun"), moon = svg.querySelector(".moon");
    sun.setAttribute("transform", `translate(${f(s.x)} ${f(s.y)})`);
    sun.style.opacity = s.up ? 1 : 0;
    moon.setAttribute("transform", `translate(${f(m.x)} ${f(m.y)})`);
    moon.style.opacity = m.up ? 1 : 0;
    const gx = s.up ? s.x : m.x;
    svg.querySelector(".glitter").setAttribute("transform", `translate(${f(gx)} 0)`);
    return { lum: lum(cols[0]) * 0.55 + lum(cols[1]) * 0.45, night: +(a[2][1] + (b[2][1] - a[2][1]) * t).toFixed(2) };
  }

  window.UdaipurScene = {
    build, setHour,
    // Building blocks reused by the iconic-places gallery (js/places.js)
    parts: { rng, arch, kangura, chhatri, onion, jharokha, block, ridge, trees, palm, kites, birds, fireworks, diyas, boat },
  };
})();
