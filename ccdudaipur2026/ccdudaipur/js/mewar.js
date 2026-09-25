/* ==========================================================================
   The glory of Mewar: Haldighati, 1576.
   A scroll-driven film. The camera opens close on Maharana Pratap, pulls
   back to reveal Chetak, and the pair gallop across the yellow earth of
   Haldighati past Chittor, the Vijay Stambh, the walls of Kumbhalgarh and
   the war elephants. At the stream the scene drops into slow motion for
   Chetak's leap, with his reflection in the water, the splash on take-off
   and dust on landing. It ends with Chetak rearing against the sun and
   settling into the pose of the Moti Magri memorial.
   ========================================================================== */
(function () {
  "use strict";
  const NS = "http://www.w3.org/2000/svg";
  const f = (n) => Math.round(n * 10) / 10;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (t) => t * t * (3 - 2 * t);
  function rng(seed) { return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646; }

  const W = 1600, H = 900, G = 800, WATER = G + 8;
  // scroll progress -> distance travelled across the land (stage units)
  const DIST = [[0, 0], [0.08, 0], [0.56, 5200], [0.78, 5900], [0.86, 6800], [1, 6800]];
  const P_GO = 0.08, LEAP0 = 0.56, LEAP1 = 0.78, REAR0 = 0.86, STAT0 = 0.93;
  const STRIDE = 380, JUMP = 170;
  const table = (tbl, p) => {
    for (let i = 0; i < tbl.length - 1; i++) {
      const [a, va] = tbl[i], [b, vb] = tbl[i + 1];
      if (p <= b) return lerp(va, vb, clamp((p - a) / (b - a || 1), 0, 1));
    }
    return tbl[tbl.length - 1][1];
  };

  /* ---------- the land ---------- */
  function ridge(r, width, base, amp, peaks, jitter, bottom) {
    const a = r() * 6, b = r() * 6, c = r() * 6, pts = [];
    for (let x = -200; x <= width + 60; x += 24) {
      const n = (Math.sin(x * 0.0035 + a) + Math.sin(x * 0.009 + b) * 0.5 + Math.sin(x * 0.027 + c) * 0.25) / 1.75;
      let y = base - amp * (n * 0.5 + 0.5) + (r() - 0.5) * jitter;
      peaks.forEach(([px, py, pw]) => { y = Math.min(y, base - (base - py) * Math.exp(-(((x - px) / pw) ** 2)) + (r() - 0.5) * jitter * 0.5); });
      pts.push([x, y]);
    }
    return { d: `M-200 ${bottom}L${pts.map(([x, y]) => `${x} ${f(y)}`).join("L")}L${width + 60} ${bottom}Z`, pts };
  }
  const yAt = (pts, x) => pts.reduce((a, p) => (Math.abs(p[0] - x) < Math.abs(a[0] - x) ? p : a), pts[0])[1];

  function acacia(x, y, s) {
    return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})"><path class="trunk" d="M0 0C2 -14 -2 -26 -8 -36M0 -18C6 -26 12 -32 18 -36"/>
      <ellipse cx="-8" cy="-40" rx="26" ry="7"/><ellipse cx="16" cy="-40" rx="20" ry="6"/><ellipse cx="4" cy="-46" rx="22" ry="6"/></g>`;
  }
  function vijayStambh(x, base, s) {
    let t = "";
    for (let i = 0; i < 9; i++) {
      const w = 28 - i * 1.3, y = base - (i + 1) * 17;
      t += `<rect x="${f(x - w / 2)}" y="${f(y)}" width="${f(w)}" height="17"/><rect x="${f(x - w / 2 - 3)}" y="${f(y)}" width="${f(w + 6)}" height="2.4"/>`;
    }
    const top = base - 9 * 17;
    t += `<rect x="${x - 17}" y="${top - 4}" width="34" height="4"/><path d="M${x - 14} ${top - 4}Q${x} ${top - 26} ${x + 14} ${top - 4}Z"/>`;
    return `<g transform="translate(${x} ${base}) scale(${s}) translate(${-x} ${-base})">${t}</g>`;
  }
  function fortWall(pts, every) {
    let bastions = "";
    pts.forEach(([x, y], i) => { if (i % every === 0) bastions += `<path d="M${x - 9} ${f(y + 2)}V${f(y - 14)}a9 9 0 0 1 18 0V${f(y + 2)}Z"/>`; });
    return `<g class="kumbhal"><path class="wallline" d="M${pts.map(([x, y]) => `${x} ${f(y - 2)}`).join("L")}"/>${bastions}</g>`;
  }
  // a war elephant with a howdah and canopy, seen far off in the dust
  function elephant(x, y, s, flip) {
    return `<g class="gl-ele" transform="translate(${f(x)} ${f(y)}) scale(${flip ? -s : s} ${s})">
      <path d="M-62 0L-62 -44C-70 -86 -34 -108 8 -106C40 -104 60 -90 66 -70C78 -68 88 -56 86 -40C84 -24 84 -8 90 2L80 4C72 -10 72 -24 70 -36L62 -30L60 0L44 0L42 -28L-18 -30L-20 0L-36 0L-38 -28L-46 -30L-46 0Z"/>
      <path d="M-40 -104h76v-14h-76z"/><path class="pole" d="M-34 -118v-24M30 -118v-24M-2 -170v-26"/>
      <path d="M-46 -142Q-2 -182 42 -142Z"/><path class="pennant" d="M-2 -196l26 8l-26 8z"/>
    </g>`;
  }
  function mewarFlag(x, base, h) {
    return `<g class="gl-flag" transform="translate(${f(x)} ${f(base)})"><path class="pole" d="M0 0V${-h}"/>
      <g class="gl-pennant"><path d="M0 ${-h}L${f(h * 0.46)} ${-h + 14}L0 ${-h + 28}Z" fill="#f47b1c"/><circle cx="${f(h * 0.13)}" cy="${-h + 14}" r="5" fill="#ffd36b"/></g></g>`;
  }

  function build(el) {
    const r = rng(1576);
    const id = "gl" + Math.random().toString(36).slice(2, 6);
    const MAX = 6800;
    const wide = (d) => W + MAX * d + 400;

    // grass and pebble texture for the earth, cached by the browser as a tile
    let tile = "", peb = "";
    const rt = rng(18);
    for (let i = 0; i < 80; i++) {
      const x = rt() * 420, y = rt() * 180, l = 5 + rt() * 14;
      tile += `M${f(x)} ${f(y)}l${f(-l * 0.3)} ${f(-l)}M${f(x)} ${f(y)}l${f(l * 0.25)} ${f(-l * 0.85)}`;
    }
    for (let i = 0; i < 26; i++) peb += `<ellipse cx="${f(rt() * 420)}" cy="${f(rt() * 180)}" rx="${f(2 + rt() * 4)}" ry="${f(1.2 + rt() * 2)}"/>`;
    // foreground tufts of dry grass: blades fanning out from a clump
    let fore = "";
    for (let i = 0; i < 9; i++) {
      const bx = 20 + i * 40 + rt() * 20, blades = 5 + Math.floor(rt() * 5);
      for (let k = 0; k < blades; k++) {
        const a = (-0.9 + (k / (blades - 1)) * 1.8) + (rt() - 0.5) * 0.3, h = 26 + rt() * 34, w = 2.2 + rt() * 1.6;
        const tx = bx + Math.sin(a) * h, ty = 80 - Math.cos(a) * h, cx = bx + Math.sin(a) * h * 0.35, cy = 80 - Math.cos(a) * h * 0.6;
        fore += `M${f(bx - w)} 80Q${f(cx)} ${f(cy)} ${f(tx)} ${f(ty)}Q${f(cx + w)} ${f(cy)} ${f(bx + w)} 80Z`;
      }
    }

    // far: Chittor on its mesa with the Vijay Stambh
    const far = `<path class="ridge r4" d="${ridge(r, wide(0.04), 660, 60, [], 10, 780).d}"/>
      <g class="mesa"><path d="M620 700L700 594L740 582L1560 578L1620 594L1710 700Z"/>
      ${Array.from({ length: 16 }, (_, i) => `<path d="M${720 + i * 56} 584v-14a8 8 0 0 1 16 0v14Z"/>`).join("")}
      <path d="M712 584H1590V576H712Z"/>${vijayStambh(1160, 580, 1.15)}
      <path d="M860 580v-40h40v40ZM1380 580v-30h70v30Z"/><path d="M1390 550q25 -22 50 0Z"/></g>`;
    const aravalli = ridge(r, wide(0.09), 700, 90, [[500, 556, 130], [2000, 580, 170]], 14, 800);
    const wallR = ridge(r, wide(0.18), 722, 70, [[900, 612, 180], [2300, 630, 220]], 10, 820);
    const mid = ridge(r, wide(0.36), 752, 44, [], 10, 840);
    let midStuff = "";
    for (let x = 0; x < wide(0.36); x += 90 + r() * 150) midStuff += acacia(x, yAt(mid.pts, x) + 4, 0.7 + r() * 0.6);
    [[1250, 0.62, 0], [1520, 0.5, 1], [3000, 0.66, 0]].forEach(([x, s, fl]) => { midStuff += elephant(x, yAt(mid.pts, x) + 6, s, fl); });
    for (let x = 700; x < wide(0.36); x += 520 + r() * 420) midStuff += mewarFlag(x, yAt(mid.pts, x) + 4, 90 + r() * 30);

    let dust = "";
    for (let i = 0; i < 16; i++) dust += `<ellipse class="gl-cloud" style="animation-delay:${f(-r() * 20)}s" cx="${f(r() * wide(0.6))}" cy="${f(640 + r() * 120)}" rx="${f(160 + r() * 240)}" ry="${f(40 + r() * 50)}" fill="url(#${id}-dust)"/>`;

    // Haldighati: haldi-yellow earth, the track, rocks and trees
    const gw = wide(1);
    let ground = `<rect x="-400" y="718" width="${gw}" height="200" fill="url(#${id}-earth)"/>
      <rect x="-400" y="718" width="${gw}" height="200" fill="url(#${id}-grass)"/>
      <path class="track" d="M-400 786H${gw}V822H-400Z"/>`;
    for (let i = 0; i < 70; i++) {
      const x = r() * gw, y = 728 + r() * 170, s = 6 + r() * 24;
      if (y > 780 && y < 830) continue;
      ground += `<path class="rock" d="M${f(x - s)} ${f(y)}Q${f(x - s * 0.8)} ${f(y - s * 0.9)} ${f(x)} ${f(y - s)}Q${f(x + s * 0.9)} ${f(y - s * 0.8)} ${f(x + s)} ${f(y)}Z"/>`;
    }
    for (let x = 80; x < gw; x += 300 + r() * 360) ground += acacia(x, 742 + r() * 18, 1.3 + r() * 0.7);

    // the stream Chetak leaps over
    const WP = "M-150 726L-14 726C60 758 120 790 140 802C170 832 220 872 262 912L-196 912C-172 862 -150 830 -140 802C-142 780 -148 752 -150 726Z";
    let reeds = "";
    for (let i = 0; i < 26; i++) {
      const side = i % 2, k = r(), y = 732 + k * 170;
      const x = side ? lerp(-12, 250, k) + 10 : lerp(-152, -190, k) - 8;
      reeds += `M${f(x)} ${f(y)}q${f(-3 + r() * 6)} -14 ${f(-2 + r() * 4)} -26`;
    }
    const stream = `<g class="gl-stream">
      <path class="bank" d="M-176 726L-150 726C-148 752 -142 780 -140 802C-150 830 -172 862 -196 912L-226 912C-200 862 -178 828 -164 800C-168 776 -174 750 -176 726Z"/>
      <path class="bank" d="M-14 726L10 726C84 758 144 790 166 802C198 832 248 872 292 912L262 912C220 872 170 832 140 802C120 790 60 758 -14 726Z"/>
      <path fill="url(#${id}-water)" d="${WP}"/>
      <g clip-path="url(#${id}-wclip)"><g class="gl-refl"><use href="#${id}-horse"/></g>
        <rect x="-240" y="720" width="560" height="200" fill="url(#${id}-ripple)" opacity=".35"/></g>
      <path class="glint" d="M-60 744h40M20 772h60M-110 806h70M40 836h80M-150 868h90M120 884h60M-40 896h70"/>
      <path class="rock" d="M-128 760q14 -22 34 -6q-6 10 -34 6ZM150 852q18 -26 42 -4q-10 12 -42 4ZM-30 880q12 -16 30 -4q-8 8 -30 4Z"/>
      <path class="reeds" d="${reeds}"/>
    </g>`;

    el.innerHTML = `<svg class="glory-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Maharana Pratap on Chetak, masked with an elephant's trunk, riding across the yellow earth of Haldighati and leaping a stream">
      <defs>
        <linearGradient id="${id}-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1535"/><stop offset=".38" stop-color="#7c3552"/><stop offset=".66" stop-color="#e57a45"/><stop offset=".86" stop-color="#ffc97e"/><stop offset="1" stop-color="#ffe2a8"/></linearGradient>
        <linearGradient id="${id}-earth" x1="0" y1="718" x2="0" y2="918" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#e2b04c"/><stop offset=".4" stop-color="#c8902f"/><stop offset="1" stop-color="#6f4518"/></linearGradient>
        <linearGradient id="${id}-water" x1="0" y1="726" x2="0" y2="912" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f6c58f"/><stop offset=".35" stop-color="#8fa9c2"/><stop offset="1" stop-color="#1f4262"/></linearGradient>
        <radialGradient id="${id}-sun"><stop offset="0" stop-color="#fff7da"/><stop offset=".22" stop-color="#ffd78a" stop-opacity=".95"/><stop offset="1" stop-color="#ff8a3d" stop-opacity="0"/></radialGradient>
        <radialGradient id="${id}-dust"><stop offset="0" stop-color="#f3cf92" stop-opacity=".5"/><stop offset="1" stop-color="#f3cf92" stop-opacity="0"/></radialGradient>
        <radialGradient id="${id}-shadow"><stop offset="0" stop-color="#3a1f08" stop-opacity=".55"/><stop offset="1" stop-color="#3a1f08" stop-opacity="0"/></radialGradient>
        <radialGradient id="${id}-vig" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#140a04" stop-opacity="0"/><stop offset="1" stop-color="#140a04" stop-opacity=".75"/></radialGradient>
        <pattern id="${id}-grass" width="420" height="180" patternUnits="userSpaceOnUse" y="718"><path d="${tile}" stroke="#7d5520" stroke-opacity=".45" stroke-width="1.3" fill="none"/><g fill="#8a6230" opacity=".35">${peb}</g></pattern>
        <pattern id="${id}-fore" width="400" height="80" patternUnits="userSpaceOnUse" y="842"><path d="${fore}" fill="#3a2008" fill-opacity=".85"/></pattern>
        <pattern id="${id}-ripple" width="70" height="9" patternUnits="userSpaceOnUse"><rect width="70" height="1.6" y="4" fill="#fff" opacity=".5"/></pattern>
        <clipPath id="${id}-wclip"><path d="${WP}"/></clipPath>
      </defs>
      <rect x="-400" y="-400" width="${W + 800}" height="${H + 800}" fill="url(#${id}-sky)"/>
      <g class="gl-sun" transform="translate(1180 600)">
        <g class="gl-rays">${Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2, b = a + 0.1; return `<path d="M0 0L${f(Math.cos(a) * 1500)} ${f(Math.sin(a) * 1500)}L${f(Math.cos(b) * 1500)} ${f(Math.sin(b) * 1500)}Z"/>`; }).join("")}</g>
        <circle r="360" fill="url(#${id}-sun)"/><circle r="78" fill="#ffe9b4"/>
      </g>
      <g class="gl-sky-clouds">${[[300, 200, 1.4], [980, 150, 1], [1400, 300, 1.2], [620, 380, 0.8]].map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse rx="170" ry="12"/><ellipse cx="-40" cy="-8" rx="90" ry="12"/><ellipse cx="60" cy="-6" rx="110" ry="10"/></g>`).join("")}</g>
      <g class="gl-birds">${[0, 1, 2, 3, 4, 5].map((i) => `<path class="gl-bird" style="animation-delay:${-i * 0.2}s" d="M${240 + i * 26} ${200 + (i % 2) * 14}q7 -7 14 0q7 -7 14 0"/>`).join("")}</g>
      <g class="gl-l" data-d="0.04">${far}</g>
      <g class="gl-l" data-d="0.09"><path class="ridge r3" d="${aravalli.d}"/></g>
      <g class="gl-l" data-d="0.18"><path class="ridge r2" d="${wallR.d}"/>${fortWall(wallR.pts, 7)}</g>
      <rect class="gl-haze" x="-400" y="540" width="${W + 800}" height="260"/>
      <g class="gl-l" data-d="0.36"><path class="ridge r1" d="${mid.d}"/><g class="gl-mid">${midStuff}</g></g>
      <g class="gl-l" data-d="0.6">${dust}</g>
      <g class="gl-l ground" data-d="1">${ground}<g class="gl-streamwrap">${stream}</g><g class="gl-parts"></g></g>
      <ellipse class="gl-shadow" cx="0" cy="${G + 10}" rx="200" ry="20" fill="url(#${id}-shadow)"/>
      <g class="gl-horse" id="${id}-horse"><g class="ck">${window.ChetakArt.markup(id + "c")}</g></g>
      <g class="gl-l fore" data-d="1.5"><rect x="-400" y="842" width="${wide(1.5)}" height="80" fill="url(#${id}-fore)"/></g>
      <rect class="gl-vig" x="-400" y="-400" width="${W + 800}" height="${H + 800}" fill="url(#${id}-vig)"/>
    </svg>`;

    const svg = el.firstElementChild;
    return {
      svg, layers: [...svg.querySelectorAll(".gl-l")], ground: svg.querySelector(".gl-l.ground"),
      stream: svg.querySelector(".gl-streamwrap"), refl: svg.querySelector(".gl-refl"), parts: svg.querySelector(".gl-parts"),
      horse: svg.querySelector(".gl-horse"), ck: svg.querySelector(".ck"), shadow: svg.querySelector(".gl-shadow"),
      sun: svg.querySelector(".gl-sun"), vig: svg.querySelector(".gl-vig"),
    };
  }

  /* ---------- particles: dust from hooves, spray from the stream ---------- */
  function Particles(group) {
    const pool = [];
    for (let i = 0; i < 90; i++) {
      const c = document.createElementNS(NS, "circle");
      c.setAttribute("r", "0");
      group.appendChild(c);
      pool.push({ c, life: 0 });
    }
    let n = 0;
    return {
      emit(x, y, kind, count) {
        for (let k = 0; k < count; k++) {
          const p = pool[n++ % pool.length];
          const water = kind === "water";
          Object.assign(p, {
            kind, x: x + (Math.random() - 0.5) * 30, y: y - Math.random() * 6,
            vx: water ? -2 - Math.random() * 5 : -1.2 - Math.random() * 2.4, vy: water ? -4 - Math.random() * 6 : -0.4 - Math.random() * 1,
            r: water ? 1.6 + Math.random() * 3 : 6 + Math.random() * 10, life: 1, g: water ? 0.32 : 0,
          });
          p.c.setAttribute("class", water ? "pt-water" : "pt-dust");
        }
      },
      step(dt) {
        let alive = 0;
        pool.forEach((p) => {
          if (p.life <= 0) return;
          alive++;
          p.life -= dt * (p.kind === "water" ? 0.8 : 0.9);
          p.vy += p.g; p.x += p.vx; p.y += p.vy;
          if (p.kind !== "water") p.r += 0.45;
          if (p.life <= 0 || p.y > 930) { p.life = 0; p.c.setAttribute("r", "0"); return; }
          p.c.setAttribute("cx", f(p.x)); p.c.setAttribute("cy", f(p.y)); p.c.setAttribute("r", f(p.r));
          p.c.style.opacity = f(Math.max(0, p.life) * (p.kind === "water" ? 0.9 : 0.55));
        });
        return alive;
      },
    };
  }

  /* ---------- the film ---------- */
  function init() {
    const sec = document.getElementById("glory");
    const host = document.getElementById("gloryScene");
    const A = window.ChetakArt;
    if (!sec || !host || !A) return;
    const D = window.CCD;
    const S = build(host);
    const rig = A.rig(S.ck);
    const parts = Particles(S.parts);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let fx0 = 0, fy0 = 0, vw = W, vh = H, hs = 1, streamX = 0;
    const horseX = (p) => fx0 + vw * (0.2 + 0.42 * ease(clamp((p - P_GO) / (REAR0 - P_GO), 0, 1)));
    function measure() {
      const w = host.clientWidth || 1, h = host.clientHeight || 1, a = w / h;
      if (a >= W / H) { vw = W; vh = W / a; } else { vh = H; vw = H * a; }
      fx0 = (W - vw) / 2; fy0 = H - vh;
      hs = clamp(vw / 1350, 0.44, 1.15);
      const pa = LEAP0 + 0.46 * (LEAP1 - LEAP0);
      streamX = horseX(pa) + table(DIST, pa);
      S.stream.setAttribute("transform", `translate(${f(streamX)} 0)`);
    }
    function camera(z, tx, ty) {
      const cw = vw / z, ch = vh / z, k = 1 - 1 / z;
      let cx = lerp(fx0 + vw / 2, tx, k), cy = lerp(fy0 + vh / 2, ty, k);
      cx = clamp(cx, fx0 + cw / 2, fx0 + vw - cw / 2);
      cy = clamp(cy, fy0 + ch / 2, fy0 + vh - ch / 2);
      S.svg.setAttribute("viewBox", `${f(cx - cw / 2)} ${f(cy - ch / 2)} ${f(cw)} ${f(ch)}`);
    }

    // overlays
    const intro = document.getElementById("gloryIntro");
    const card = document.getElementById("gloryCard");
    const rail = document.getElementById("gloryRail");
    const leapT = document.getElementById("leapTitle");
    rail.innerHTML = D.glory.map((g, i) => `<li data-i="${i}"><span>${g.when}</span></li>`).join("");
    const railItems = [...rail.children];
    let shown = -2, cardT;
    function showCard(i) {
      if (i === shown) return;
      shown = i;
      card.classList.remove("in");
      clearTimeout(cardT);
      if (i < 0) return;
      cardT = setTimeout(() => {
        const g = D.glory[i];
        card.innerHTML = `<span class="gc-when">${g.when}</span><h3>${g.title}</h3><p>${g.text}</p>`;
        card.classList.add("in");
      }, 200);
    }

    let target = 0, cur = 0, running = false, last = 0, ySm = 0, lastGround = 0, prevLT = 0;
    const prevPhase = {};
    const progress = () => {
      const r = sec.getBoundingClientRect();
      return clamp(-r.top / Math.max(1, r.height - innerHeight), 0, 1);
    };

    function frame(t) {
      const dt = Math.min(0.05, (t - last) / 1000 || 0.016); last = t;
      target = progress();
      // follow the scroll smoothly, but catch up fast after a big jump (nav links, keyboard)
      const gap = Math.abs(target - cur);
      cur += (target - cur) * (reduced || window.__gloryInstant ? 1 : gap > 0.12 ? 0.3 : 0.09);
      const p = cur;
      const dist = table(DIST, p);
      S.layers.forEach((g) => g.setAttribute("transform", `translate(${f(-dist * +g.dataset.d)} 0)`));
      S.sun.setAttribute("transform", `translate(${f(1180 - p * 140)} ${f(590 + p * 70)})`);

      // Chetak's pose for this moment of the film
      const x = horseX(p);
      const phi = (dist + x - horseX(0)) / (STRIDE * hs);
      const run = A.gallop(phi);
      let st, lt = -1;
      if (p < P_GO + 0.05) {
        const idle = { ...A.STAND, stance: ["hf", "hn", "ff", "fn"], neck: A.STAND.neck + Math.sin(t / 900) * 2.5, head: 48 + Math.sin(t / 650) * 2.5, tail: -62 + Math.sin(t / 800) * 5 };
        st = A.mix(idle, run, ease(clamp((p - P_GO + 0.01) / 0.05, 0, 1)));
      } else if (p < LEAP0) {
        st = run;
      } else if (p < LEAP1) {
        lt = (p - LEAP0) / (LEAP1 - LEAP0);
        st = A.leap(lt);
        if (lt < 0.08) st = A.mix(run, st, ease(lt / 0.08));
        if (lt > 0.92) st = A.mix(st, run, ease((lt - 0.92) / 0.08));
      } else if (p < REAR0) {
        st = run;
      } else if (p < STAT0) {
        const rear = { ...A.REAR, stance: ["hf", "hn"] };
        const paw = Math.sin(t / 240);
        rear.legs = { ...rear.legs, fn: [rear.legs.fn[0] + paw * 10, rear.legs.fn[1] - paw * 14, rear.legs.fn[2]], ff: [rear.legs.ff[0] - paw * 8, rear.legs.ff[1] + paw * 10, rear.legs.ff[2]] };
        st = A.mix(run, rear, ease(clamp((p - REAR0) / 0.035, 0, 1)));
      } else {
        const rear = { ...A.REAR, stance: ["hf", "hn"] };
        const statue = { ...A.STATUE, stance: ["hf", "hn", "ff"], head: A.STATUE.head + Math.sin(t / 900) * 1.5 };
        st = A.mix(rear, statue, ease(clamp((p - STAT0) / 0.035, 0, 1)));
      }
      rig.apply(st);

      // keep the planted hooves on the ground; fly during the leap
      const g0 = A.ground(st);
      if (g0 != null) lastGround = g0;
      const yOff = lastGround - (st.air || 0) * JUMP;
      ySm = reduced ? yOff : ySm + (yOff - ySm) * 0.5;
      S.horse.setAttribute("transform", `translate(${f(x)} ${f(G + ySm * hs)}) scale(${f(hs)})`);

      // shadow on the ground, reflection in the stream
      const gx = x + dist, overWater = Math.abs(gx - streamX) < 170;
      const air = clamp(-(ySm - lastGround) / JUMP, 0, 1);
      S.shadow.setAttribute("transform", `translate(${f(x)} 0) scale(${f(hs * (1 - air * 0.5))} 1)`);
      S.shadow.style.opacity = f((1 - air * 0.7) * (overWater ? 0.15 : 1));
      if (Math.abs(gx - streamX) < 1100) {
        S.refl.style.display = "";
        S.refl.setAttribute("transform", `translate(${f(dist - streamX)} ${2 * WATER}) scale(1 -1)`);
      } else S.refl.style.display = "none";

      // dust at every hoof strike, spray at take-off, dust on landing
      if (!reduced) {
        const hv = A.hooves(st);
        const toGround = (k) => [x + hv[k][0] * hs + dist, G + (ySm + hv[k][1]) * hs];
        if (lt < 0 && p > P_GO + 0.02 && p < REAR0) {
          for (const k of ["hf", "hn", "ff", "fn"]) {
            const ph = ((phi - A.OFF[k]) % 1 + 1) % 1;
            if (prevPhase[k] != null && prevPhase[k] > 0.85 && ph < 0.15) { const [hx, hy] = toGround(k); parts.emit(hx, hy, "dust", 2); }
            prevPhase[k] = ph;
          }
        }
        if (lt >= 0) {
          if (prevLT < 0.12 && lt >= 0.12) { ["hf", "hn"].forEach((k) => { const [hx, hy] = toGround(k); parts.emit(hx, hy, "water", 18); parts.emit(hx, hy, "dust", 3); }); }
          if (lt > 0.16 && lt < 0.44 && Math.random() < 0.3) { const [hx, hy] = toGround("hn"); parts.emit(hx, hy, "water", 1); }
          if (prevLT < 0.8 && lt >= 0.8) { ["ff", "fn"].forEach((k) => { const [hx, hy] = toGround(k); parts.emit(hx, hy, "dust", 6); }); }
          prevLT = lt;
        } else prevLT = p < LEAP0 ? 0 : 1;
        parts.step(dt);
        S.parts.setAttribute("transform", `translate(${f(-dist)} 0)`);
      }

      // camera: open close on Pratap, lean in for the leap, settle for the finale
      let z = 1, tx = fx0 + vw / 2, ty = fy0 + vh / 2;
      if (p < P_GO + 0.02) {
        z = lerp(3.2, 1, ease(clamp(p / (P_GO + 0.02), 0, 1)));
        tx = x + 20 * hs; ty = G + (ySm - 368) * hs;
      } else if (lt >= 0) {
        // lean in, keeping Chetak low and right so the title has the sky
        z = 1 + 0.24 * Math.sin(Math.PI * lt);
        tx = x - 90 * hs; ty = G + (ySm - 330) * hs;
      } else if (p > REAR0) {
        z = 1 + 0.16 * ease(clamp((p - REAR0) / 0.08, 0, 1));
        tx = x; ty = G - 230 * hs;
      }
      camera(z, tx, ty);

      // words
      intro.style.opacity = f(1 - ease(clamp(p / 0.06, 0, 1)));
      intro.style.transform = `translateY(${f(-p * 400)}px)`;
      const ls = lt >= 0 ? Math.sin(Math.PI * lt) : 0;
      leapT.style.opacity = f(clamp(ls * 1.8 - 0.3, 0, 1));
      leapT.style.transform = `scale(${f(0.94 + ls * 0.06)})`;
      S.vig.style.opacity = f(0.35 + ls * 0.65);
      let idx = -1;
      D.glory.forEach((g, i) => { if (p >= g.at) idx = i; });
      showCard(p < 0.07 || ls > 0.35 ? -1 : idx);
      railItems.forEach((li, i) => { li.classList.toggle("on", i === idx); li.classList.toggle("done", i < idx); });
      sec.style.setProperty("--gp", p.toFixed(3));

      if (running) requestAnimationFrame(frame);
    }

    measure();
    addEventListener("resize", measure);
    new IntersectionObserver(([en]) => {
      const was = running;
      running = en.isIntersecting;
      sec.classList.toggle("paused", !running);
      if (running && !was) { last = performance.now(); requestAnimationFrame(frame); }
    }).observe(sec);
    frame(performance.now());
  }

  window.MewarArt = { init };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
