/* ==========================================================================
   Maharana Pratap on Chetak — an original, rigged digital illustration.
   Drawn from the traditional iconography of Mewar rather than any single
   picture: Pratap in a steel kulah helmet wrapped in a saffron safa with a
   jewelled sarpech and kalgi, a mail aventail, the sweeping Rajput moustache,
   pearl strands, a blue-steel armoured jama with a char-aina chest plate, a
   saffron kamarbandh, bhala spear and dhal shield; Chetak as the blue-white
   "neela" horse wearing the gaj-mukh elephant-trunk mask of Haldighati.

   The horse is rigged like a real one: every leg has three segments
   (forearm or gaskin, cannon, pastern and hoof) posed by keyframes for a
   four-beat gallop, the leap, a rear and the Moti Magri statue pose, and
   forward kinematics keeps the hooves planted on the ground.
   ========================================================================== */
(function () {
  "use strict";
  const f = (n) => Math.round(n * 10) / 10;
  const R = Math.PI / 180;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (t) => t * t * (3 - 2 * t);
  function rng(seed) { return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646; }

  /* ---------- skeleton ---------- */
  const LEN = { f: [62, 46, 26], h: [58, 54, 26] };
  const LEGS = {
    hf: { h: 1, far: 1, px: -110, py: -130 },
    ff: { h: 0, far: 1, px: 94, py: -136 },
    hn: { h: 1, far: 0, px: -98, py: -128 },
    fn: { h: 0, far: 0, px: 106, py: -134 },
  };
  const NECK = [86, -232], POLL = [168, -354], TAIL = [-152, -238], SEAT = [-6, -262];
  const HAND = [60, -54], BIT = [86, 28], SHOULDER = [18, -92];

  const BODY = "M64 -254C30 -250 -20 -244 -62 -248C-94 -252 -124 -258 -146 -246C-164 -234 -170 -206 -162 -182C-156 -160 -146 -140 -128 -124C-118 -116 -104 -112 -90 -114C-74 -118 -58 -124 -40 -124C-4 -120 46 -116 82 -122C98 -125 110 -130 118 -140C132 -154 142 -172 140 -192C138 -210 124 -226 102 -236C88 -244 76 -252 64 -254Z";
  const NECKP = "M58 -252C78 -286 108 -322 146 -348C158 -356 170 -358 180 -352C186 -340 186 -326 182 -314C172 -290 158 -254 146 -206C140 -192 132 -182 122 -176C118 -206 96 -230 58 -252Z";
  const HEADP = "M0 0C8 -5 16 -6 24 -5C44 -3 66 0 82 4C94 7 104 10 108 16C112 22 110 29 104 31C100 33 96 35 92 34C88 36 84 35 82 32C72 34 58 36 48 38C38 46 26 52 16 50C6 48 0 40 -2 30C-3 20 -4 8 0 0Z";
  const FACE = "M12 -146C18 -148 26 -148 30 -146C32 -143 34 -141 34 -139C34 -137 33 -136 33.5 -135C36 -132 39 -128 41.5 -125.5C42.5 -124.5 42 -122.5 40.5 -122C39.5 -121.5 38.5 -121.5 38 -120.5C37.5 -119.5 38.5 -118.5 38.3 -117.3C38 -116.4 36.8 -116 36.6 -115.4C37.2 -114.6 37.4 -113.6 36.6 -112.8C35.6 -112 35.2 -111 36 -109.5C36.4 -107 34.6 -104.6 31 -103.8C27 -103 22 -102.5 17 -102C13 -104 11 -110 10.5 -118C10 -128 10.5 -138 12 -146Z";

  /* ---------- paint ---------- */
  function defs(id) {
    const lg = (n, stops, v = "0 0 0 1", extra = "") => {
      const [x1, y1, x2, y2] = v.split(" ");
      return `<linearGradient id="${id}-${n}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"${extra}>${stops.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op != null ? ` stop-opacity="${op}"` : ""}/>`).join("")}</linearGradient>`;
    };
    const rg = (n, c, o) => `<radialGradient id="${id}-${n}"><stop offset="0" stop-color="${c}" stop-opacity="${o}"/><stop offset=".55" stop-color="${c}" stop-opacity="${f(o * 0.42)}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`;
    return `<defs>
      ${lg("coat", [[0, "#ffffff"], [0.35, "#f1f5f9"], [0.62, "#dae2eb"], [0.84, "#adbccc"], [1, "#8698ae"]], "0 -372 0 -108", ' gradientUnits="userSpaceOnUse"')}
      ${lg("headc", [[0, "#fdfeff"], [0.55, "#e0e7ee"], [1, "#a7b6c6"]])}
      ${lg("leg", [[0, "#7f93aa"], [0.35, "#c1ccd8"], [0.7, "#edf1f5"], [1, "#fbfcfd"]], "0 0 1 0")}
      ${lg("legfar", [[0, "#53657b"], [0.5, "#8496aa"], [1, "#adbccb"]], "0 0 1 0")}
      ${lg("hoof", [[0, "#6d737b"], [1, "#25282c"]])}
      ${lg("saffron", [[0, "#ffbe5c"], [0.5, "#f47b1c"], [1, "#b3420b"]])}
      ${lg("gold", [[0, "#fff3c0"], [0.45, "#e2b24e"], [1, "#8f5f17"]], "0 0 1 1")}
      ${lg("steel", [[0, "#ffffff"], [0.3, "#d4dbe2"], [0.7, "#8593a2"], [1, "#4f5b68"]], "0 0 1 1")}
      ${lg("skin", [[0, "#e2a878"], [0.6, "#b87c4d"], [1, "#8a5530"]], "0 0 1 1")}
      ${lg("coatb", [[0, "#a6b8cb"], [0.45, "#62788f"], [1, "#2f4155"]], "0 0 1 1")}
      ${lg("coatbd", [[0, "#6f849b"], [1, "#27374a"]], "0 0 1 1")}
      ${lg("cloth", [[0, "#d33a2f"], [1, "#6b130f"]])}
      ${lg("trouser", [[0, "#fffaf0"], [1, "#c9baa0"]], "0 0 1 1")}
      ${lg("leather", [[0, "#704829"], [1, "#2b1a0e"]])}
      ${lg("shade", [[0, "#000", 0], [1, "#0b1320", 0.45]])}
      <radialGradient id="${id}-shield" cx=".38" cy=".35" r=".75"><stop offset="0" stop-color="#7a5230"/><stop offset=".7" stop-color="#3a2413"/><stop offset="1" stop-color="#1f130a"/></radialGradient>
      ${rg("shd", "#3a4d66", 0.55)}${rg("hl", "#ffffff", 0.95)}${rg("warm", "#ffbf78", 0.75)}${rg("skd", "#5a2e14", 0.45)}${rg("muz", "#4f5a68", 0.6)}
      <pattern id="${id}-dapple" width="22" height="19" patternUnits="userSpaceOnUse" patternTransform="rotate(14)"><circle cx="11" cy="9.5" r="6.2" fill="none" stroke="#7a8da4" stroke-opacity=".2" stroke-width="3.4"/></pattern>
      <pattern id="${id}-mail" width="3.2" height="3.2" patternUnits="userSpaceOnUse"><rect width="3.2" height="3.2" fill="#a2acb7"/><circle cx="1.6" cy="1.6" r="1.05" fill="none" stroke="#56616d" stroke-width=".65"/></pattern>
      <pattern id="${id}-brocade" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#9a1d18"/><path d="M6 1.5c1.8 2.4 1.8 5 0 7.5c-1.8-2.5-1.8-5.1 0-7.5z" fill="#e6b54e" opacity=".55"/><circle cx="0" cy="0" r="1.2" fill="#e6b54e" opacity=".5"/><circle cx="12" cy="12" r="1.2" fill="#e6b54e" opacity=".5"/></pattern>
      <pattern id="${id}-emb" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(24)"><path d="M1.5 7c1.8-4.6 5.6-4.6 5.6-.9c0 1.8-1.8 2.7-2.7.9" fill="none" stroke="#d3deea" stroke-opacity=".38" stroke-width=".6"/></pattern>
      <clipPath id="${id}-bodyclip"><path d="${BODY}"/></clipPath>
      <clipPath id="${id}-neckclip"><path d="${NECKP}"/></clipPath>
      <clipPath id="${id}-headclip"><path d="${HEADP}"/></clipPath>
      <clipPath id="${id}-faceclip"><path d="${FACE}"/></clipPath>
    </defs>`;
  }

  /* ---------- legs: three segments each ---------- */
  function leg(id, key) {
    const L = LEGS[key], len = L.h ? LEN.h : LEN.f;
    const fill = `url(#${id}-${L.far ? "legfar" : "leg"})`;
    const upper = L.h
      ? `<path fill="${fill}" d="M-19 -18C-22 6 -14 32 -10 50C-9 55 -9 58 -9 58L9 58C10 52 12 44 14 34C18 16 21 -2 19 -18Z"/><path class="ck-line" d="M-12 0C-8 16 -6 32 -5 50"/>`
      : `<path fill="${fill}" d="M-15 -12C-18 8 -14 30 -10 50C-9 56 -9 60 -9 62L9 62C9 58 10 54 11 48C14 30 17 10 14 -12Z"/><path class="ck-line" d="M8 -4C10 14 8 34 6 50"/>`;
    const joint = L.h
      ? `<ellipse cx="0" cy="0" rx="10" ry="9" fill="${fill}"/><path fill="${fill}" d="M-6 -8C-17 -9 -20 2 -12 10L-3 6Z"/>`
      : `<ellipse cx="0" cy="1" rx="10.5" ry="9.5" fill="${fill}"/>`;
    const c = len[1];
    return `<g class="ck-leg ${L.far ? "far" : "near"}" data-leg="${key}">
      ${upper}
      <g class="s2">${joint}
        <path fill="${fill}" d="M-8 -2C-7 ${f(c * 0.3)} -7 ${f(c * 0.65)} -7 ${c}L7 ${c}C7 ${f(c * 0.65)} 8 ${f(c * 0.3)} 9 -2Z"/>
        <path class="tendon" d="M-6 6V${c - 4}"/>
        <g class="s3">
          <ellipse cx="0" cy="0" rx="9" ry="8" fill="${fill}"/>
          <path class="feather" d="M-8 2c-4 4 -6 9 -5 14M-6 4c-3 5 -3 9 -1 13M-9 0c-5 3 -8 7 -8 12"/>
          <path fill="${fill}" d="M-7 0C-7 6 -6 12 -5 16L6 16C6 12 7 6 7 0Z"/>
          <g transform="translate(0 15) rotate(32)"><path fill="url(#${id}-hoof)" d="M-7 0L7 0L10.5 11L-10.5 11Z"/><path class="coronet" d="M-7.5 1H7.5"/></g>
        </g>
      </g>
    </g>`;
  }

  /* ---------- hair: procedural mane and tail strands ---------- */
  const HAIR = ["#fbfdff", "#eef2f6", "#dce4ec", "#c5d0dc", "#a9b8c8"];
  function strand(x, y, th, len, wave, w, fill) {
    const cx = Math.cos(th), sy = Math.sin(th), nx = -sy, ny = cx;
    const ex = x + cx * len, ey = y + sy * len;
    const mx = (x + ex) / 2 + nx * wave, my = (y + ey) / 2 + ny * wave;
    return `<path fill="${fill}" d="M${f(x + nx * w / 2)} ${f(y + ny * w / 2)}Q${f(mx + nx * w / 3)} ${f(my + ny * w / 3)} ${f(ex)} ${f(ey)}Q${f(mx - nx * w / 3)} ${f(my - ny * w / 3)} ${f(x - nx * w / 2)} ${f(y - ny * w / 2)}Z"/>`;
  }
  function mane(r) {
    const cub = (t) => {
      const u = 1 - t;
      return [u * u * u * 58 + 3 * u * u * t * 78 + 3 * u * t * t * 108 + t * t * t * 146, -(u * u * u * 252 + 3 * u * u * t * 286 + 3 * u * t * t * 322 + t * t * t * 348)];
    };
    let back = "", front = "";
    for (let i = 0; i < 52; i++) {
      const s = i / 51;
      const [x, y] = s < 0.88 ? cub(s / 0.88) : [146 + ((s - 0.88) / 0.12) * 22, -348 - ((s - 0.88) / 0.12) * 7];
      const len = 30 + 30 * Math.sin(Math.PI * Math.min(1, s * 1.1)) + r() * 16;
      back += strand(x - 2, y + 2, (160 + (r() - 0.5) * 24) * R, len * 0.9, (r() - 0.5) * 12, 5, "#98a9bc");
      front += strand(x, y + r() * 5, (156 + (r() - 0.5) * 30) * R, len, (r() - 0.5) * 14, 3 + r() * 3.5, HAIR[Math.floor(r() * HAIR.length)]);
    }
    return `<g class="ck-mane"><g opacity=".9">${back}</g>${front}</g>`;
  }
  function tail(id, r) {
    let hair = "";
    for (let i = 0; i < 40; i++) {
      hair += strand(-20 - r() * 10, 4 + r() * 10, (176 + (r() - 0.5) * 32) * R, 92 + r() * 74, (r() - 0.5) * 26, 3 + r() * 3.5, i < 10 ? "#9aabbd" : HAIR[Math.floor(r() * HAIR.length)]);
    }
    return `<g class="ck-tail"><g class="ck-tail-hair">${hair}</g>
      <path fill="url(#${id}-headc)" d="M6 -8C-8 -10 -22 -4 -32 8L-24 16C-16 6 -6 2 8 4Z"/></g>`;
  }

  /* ---------- body, neck and head ---------- */
  function body(id) {
    return `<path fill="url(#${id}-coat)" d="${BODY}"/>
    <g clip-path="url(#${id}-bodyclip)">
      <path fill="url(#${id}-dapple)" d="${BODY}"/>
      <ellipse cx="-10" cy="-116" rx="164" ry="38" fill="url(#${id}-shd)"/>
      <ellipse cx="112" cy="-132" rx="36" ry="26" fill="url(#${id}-shd)"/>
      <ellipse cx="-158" cy="-166" rx="26" ry="66" fill="url(#${id}-shd)"/>
      <ellipse cx="-62" cy="-168" rx="46" ry="28" fill="url(#${id}-shd)" opacity=".45"/>
      <ellipse cx="-30" cy="-246" rx="124" ry="18" fill="url(#${id}-hl)"/>
      <ellipse cx="-118" cy="-214" rx="46" ry="38" fill="url(#${id}-hl)" opacity=".75"/>
      <ellipse cx="96" cy="-204" rx="38" ry="30" fill="url(#${id}-hl)" opacity=".6"/>
      <ellipse cx="142" cy="-172" rx="16" ry="42" fill="url(#${id}-warm)"/>
    </g>
    <path class="ck-line" d="M70 -238C90 -210 104 -180 112 -150M112 -150C100 -146 88 -150 80 -160M-120 -246C-104 -216 -100 -186 -110 -150M-150 -214C-136 -196 -126 -176 -124 -150M-104 -150C-96 -140 -92 -132 -94 -122"/>
    <path class="ck-line faint" d="M10 -200C12 -180 16 -160 22 -140M-12 -204C-10 -184 -6 -164 0 -144M32 -198C34 -178 38 -158 44 -140"/>
    <path class="ck-rim" d="M140 -192C142 -172 132 -154 118 -140"/>`;
  }

  function head(id, r) {
    let forelock = "";
    for (let i = 0; i < 9; i++) forelock += strand(2 + r() * 8, -4 + r() * 4, (28 + r() * 30) * R, 16 + r() * 12, (r() - 0.5) * 6, 2.6, HAIR[Math.floor(r() * 3)]);
    return `
      <path fill="url(#${id}-legfar)" d="M8 -2C4 -14 4 -26 10 -36C16 -28 20 -16 18 -4Z"/>
      <path fill="url(#${id}-headc)" d="${HEADP}"/>
      <g clip-path="url(#${id}-headclip)">
        <ellipse cx="22" cy="38" rx="26" ry="20" fill="url(#${id}-shd)"/>
        <ellipse cx="62" cy="38" rx="32" ry="9" fill="url(#${id}-shd)" opacity=".7"/>
        <ellipse cx="58" cy="2" rx="46" ry="7" fill="url(#${id}-hl)"/>
        <ellipse cx="100" cy="24" rx="18" ry="14" fill="url(#${id}-muz)"/>
        <ellipse cx="106" cy="16" rx="8" ry="18" fill="url(#${id}-warm)"/>
      </g>
      <path class="ck-line" d="M18 24C30 20 46 22 60 26M10 30C18 40 30 44 42 42"/>
      <path fill="url(#${id}-headc)" d="M-2 -2C-8 -14 -10 -26 -6 -37C2 -29 8 -16 10 -4Z"/>
      <path class="ck-line" d="M-4 -8C-6 -18 -6 -26 -5 -31"/>
      <g transform="translate(26 10)">
        <ellipse rx="6.2" ry="4.6" fill="#1a1e25"/><ellipse cx="1" cy=".4" rx="3.6" ry="3" fill="#3a2a1e"/>
        <ellipse cx="-1.6" cy="-1.6" rx="1.8" ry="1.3" fill="#fff" opacity=".9"/>
        <path d="M-7.4 -2C-3 -6.4 3 -6.4 7.4 -3" stroke="#66778a" stroke-width="1.3" fill="none"/>
        <path d="M-6 3C-2 5.6 3 5.4 6.4 3" stroke="#8a9aae" stroke-width=".9" fill="none"/>
      </g>
      <path fill="#343c48" d="M95 14C99 12 104 14 104.5 18C102.5 20.5 98 20.5 95.5 18.5Z"/>
      <path class="ck-line" d="M104 30C98 31 92 30 86 27"/>
      <!-- gaj-mukh: the elephant-trunk mask -->
      <path fill="url(#${id}-brocade)" d="M28 -6C48 -4 72 0 94 6C104 9 110 16 108 24L96 26C82 22 62 16 42 14C34 12 28 6 28 -6Z"/>
      <path fill="none" stroke="url(#${id}-gold)" stroke-width="2.4" d="M28 -6C48 -4 72 0 94 6C104 9 110 16 108 24L96 26C82 22 62 16 42 14C34 12 28 6 28 -6Z"/>
      <g fill="url(#${id}-gold)"><circle cx="46" cy="4" r="2.4"/><circle cx="62" cy="7" r="2.4"/><circle cx="78" cy="11" r="2.4"/><circle cx="92" cy="15" r="2.2"/></g>
      <g fill="#c6302a"><circle cx="46" cy="4" r="1"/><circle cx="62" cy="7" r="1"/><circle cx="78" cy="11" r="1"/></g>
      <path fill="url(#${id}-brocade)" d="M98 24C106 42 110 62 112 80C113 92 118 98 126 96C132 94 133 86 127 85C123 87 120 85 120 79C118 60 115 40 110 22Z"/>
      <path fill="none" stroke="url(#${id}-gold)" stroke-width="2" d="M98 24C106 42 110 62 112 80C113 92 118 98 126 96C132 94 133 86 127 85C123 87 120 85 120 79C118 60 115 40 110 22"/>
      <path fill="none" stroke="url(#${id}-gold)" stroke-width="2.2" d="M100 36l12 -2M104 50l11 -1M108 64l10 0M110 78l9 1"/>
      <path fill="#fff6e4" stroke="#b9a684" stroke-width=".8" d="M92 32C98 42 108 48 120 48C110 44 102 38 98 30Z"/>
      <g fill="none" stroke="#3a2414" stroke-width="3.2" stroke-linecap="round">
        <path d="M6 -2C16 8 40 22 84 28"/><path d="M2 4C8 5 14 6 20 6"/><path d="M68 4C70 14 72 24 72 32"/><path d="M2 6C-2 18 -2 30 2 40"/>
      </g>
      <circle cx="86" cy="28" r="4.4" fill="none" stroke="url(#${id}-gold)" stroke-width="2"/>
      <g fill="url(#${id}-gold)"><circle cx="6" cy="-1" r="3.2"/><circle cx="68" cy="6" r="3"/><circle cx="12" cy="5.4" r="1.6"/><circle cx="17" cy="6" r="1.6"/></g>
      <path fill="url(#${id}-gold)" d="M-1 -4C-6 -18 -2 -32 8 -40C4 -30 4 -18 6 -6Z"/>
      <g class="ck-forelock">${forelock}</g>`;
  }

  function neck(id, r) {
    let bells = "";
    [[80, -226], [92, -216], [104, -208], [116, -200], [128, -194]].forEach(([x, y]) => {
      bells += `<g transform="translate(${x} ${y + 5})"><circle r="3.6" fill="url(#${id}-gold)"/><path d="M-1.6 1.4h3.2" stroke="#6b4a12" stroke-width=".8"/></g>`;
    });
    return `<g class="ck-neck">
      <path fill="url(#${id}-coat)" d="${NECKP}"/>
      <g clip-path="url(#${id}-neckclip)">
        <path fill="url(#${id}-dapple)" d="${NECKP}"/>
        <ellipse cx="166" cy="-262" rx="20" ry="64" fill="url(#${id}-shd)" transform="rotate(-18 166 -262)"/>
        <ellipse cx="104" cy="-300" rx="64" ry="13" fill="url(#${id}-hl)" transform="rotate(-42 104 -300)"/>
        <ellipse cx="180" cy="-300" rx="10" ry="48" fill="url(#${id}-warm)" transform="rotate(-18 180 -300)"/>
      </g>
      <path class="ck-line" d="M178 -312C168 -286 156 -254 146 -214"/>
      <path fill="none" stroke="url(#${id}-gold)" stroke-width="3" d="M72 -236C94 -216 118 -200 136 -192"/>
      ${bells}
      ${mane(r)}
      <g class="ck-head" transform="translate(${POLL[0]} ${POLL[1]}) rotate(46)">${head(id, r)}</g>
    </g>`;
  }

  /* ---------- tack ---------- */
  function tack(id) {
    const JH = "M-72 -252C-30 -258 20 -256 54 -248C60 -226 62 -196 60 -168C30 -158 -22 -158 -76 -168C-78 -198 -76 -228 -72 -252Z";
    let fringe = "";
    for (let x = -74; x <= 58; x += 5) {
      const y = -168 + 10 * Math.pow(Math.abs(x + 8) / 66, 2) * -1 + 8;
      fringe += `M${x} ${f(y)}v7`;
    }
    const cord = (x1, x2, col) => `<path stroke="${col}" stroke-width="2.2" fill="none" d="M${x1} ${f(-165 + Math.abs(x1 + 8) * 0.05)}L${x2} ${f(-165 + Math.abs(x2 + 8) * 0.05)}"/>`;
    return `
      <path fill="url(#${id}-brocade)" d="${JH}"/>
      <path fill="url(#${id}-shade)" d="${JH}"/>
      <path fill="none" stroke="url(#${id}-gold)" stroke-width="5" d="${JH}"/>
      <path fill="none" stroke="#f3cf73" stroke-width="1.2" d="M-64 -244C-28 -249 18 -247 46 -241C51 -222 53 -196 51 -176C24 -168 -20 -168 -68 -176C-70 -200 -68 -226 -64 -244Z"/>
      <path stroke="url(#${id}-gold)" stroke-width="2" fill="none" d="${fringe}"/>
      ${cord(-72, -40, "#4285f4")}${cord(-40, -8, "#34a853")}${cord(-8, 24, "#f9ab00")}${cord(24, 56, "#ea4335")}
      <path fill="url(#${id}-leather)" d="M-36 -256C-32 -278 28 -280 42 -256L38 -250L-30 -250Z"/>
      <path fill="none" stroke="url(#${id}-gold)" stroke-width="2.6" d="M34 -262C40 -272 48 -272 50 -262M-32 -258C-36 -268 -40 -270 -44 -266"/>
      <path fill="none" stroke="url(#${id}-leather)" stroke-width="7" d="M34 -250C36 -210 36 -170 32 -122"/>
      <rect x="28" y="-190" width="10" height="12" rx="2" fill="none" stroke="url(#${id}-gold)" stroke-width="2"/>
      <path fill="none" stroke="url(#${id}-leather)" stroke-width="6" stroke-linecap="round" d="M46 -246C84 -236 124 -212 140 -186"/>
      <path fill="none" stroke="url(#${id}-leather)" stroke-width="5" stroke-linecap="round" d="M-40 -252C-86 -256 -128 -256 -152 -240"/>
      <g fill="url(#${id}-gold)">
        <circle cx="72" cy="-238" r="4.6"/><circle cx="98" cy="-226" r="4.6"/><circle cx="120" cy="-210" r="4.6"/><circle cx="134" cy="-196" r="4"/>
        <circle cx="-64" cy="-254" r="2.6"/><circle cx="-88" cy="-256" r="2.6"/><circle cx="-112" cy="-254" r="2.6"/><circle cx="-134" cy="-248" r="2.6"/>
      </g>
      <g stroke="#c6302a" stroke-width="2.4" stroke-linecap="round" fill="none"><path d="M98 -222v10M120 -206v10M72 -234v9"/></g>`;
  }

  /* ---------- Maharana Pratap ---------- */
  function rider(id) {
    const g = (n) => `url(#${id}-${n})`;
    // spear: the hand grips at (84,-82); u is the shaft direction
    const ux = 0.969, uy = -0.248, nx = 0.248, ny = 0.969, hx = 84, hy = -82;
    const P = (k, s = 0) => `${f(hx + ux * k + nx * s)} ${f(hy + uy * k + ny * s)}`;
    return `
      <circle cx="-20" cy="-78" r="26" fill="${g("shield")}"/>
      <circle cx="-20" cy="-78" r="26" fill="none" stroke="${g("gold")}" stroke-width="3"/>
      <circle cx="-20" cy="-78" r="21" fill="none" stroke="#e7b957" stroke-width=".8" opacity=".6"/>
      <g fill="${g("gold")}"><circle cx="-28" cy="-86" r="3.2"/><circle cx="-12" cy="-86" r="3.2"/><circle cx="-28" cy="-70" r="3.2"/><circle cx="-12" cy="-70" r="3.2"/><circle cx="-20" cy="-78" r="4.2"/></g>
      <path fill="${g("coatbd")}" d="M30 -86C40 -74 50 -64 60 -58L56 -50C44 -56 34 -66 24 -76Z"/>
      <circle cx="60" cy="-54" r="5" fill="${g("skin")}"/>
      <g class="ck-sash"><path fill="${g("saffron")}" d="M-22 -16C-46 -20 -72 -14 -94 -2C-78 -4 -62 -6 -48 -8C-66 0 -80 10 -92 22C-68 12 -44 -2 -22 -8Z"/></g>
      <path fill="${g("coatb")}" d="M-22 -12C-28 -40 -26 -70 -14 -92C-4 -104 20 -108 34 -98C42 -80 42 -50 30 -12Z"/>
      <path fill="url(#${id}-emb)" d="M-22 -12C-28 -40 -26 -70 -14 -92C-4 -104 20 -108 34 -98C42 -80 42 -50 30 -12Z"/>
      <path fill="${g("coatb")}" d="M-20 -14C-32 4 -46 22 -60 30C-32 32 0 28 38 22C30 10 24 -2 24 -14Z"/>
      <path fill="url(#${id}-emb)" d="M-20 -14C-32 4 -46 22 -60 30C-32 32 0 28 38 22C30 10 24 -2 24 -14Z"/>
      <path fill="none" stroke="#1f2c3b" stroke-opacity=".35" stroke-width="1.1" d="M-30 0L-44 24M-14 -4L-22 26M2 -6L0 26M18 -8L20 22"/>
      <path fill="none" stroke="${g("gold")}" stroke-width="1.8" d="M-60 30C-32 32 0 28 38 22"/>
      <path fill="${g("trouser")}" d="M-10 -14C10 -10 30 4 46 24L38 38C22 22 4 12 -14 4Z"/>
      <path fill="${g("trouser")}" d="M46 24C45 42 41 58 37 74L25 74C29 58 32 42 34 30Z"/>
      <path fill="#6b1d1d" d="M22 70L42 70C50 72 56 70 60 62C60 72 56 80 48 81L20 81Z"/>
      <path fill="none" stroke="${g("gold")}" stroke-width="1.6" d="M24 75H46M58 63c2 -3 4 -3 5 -1"/>
      <path fill="none" stroke="${g("gold")}" stroke-width="3" d="M24 84H48"/><path fill="none" stroke="${g("leather")}" stroke-width="2.4" d="M36 84L32 46"/>
      <path fill="none" stroke="#4a1414" stroke-width="7" stroke-linecap="round" d="M-4 -6C-26 8 -48 20 -72 26"/>
      <path fill="none" stroke="${g("gold")}" stroke-width="7" stroke-linecap="round" d="M-70 25.6l-8 3"/>
      <path fill="none" stroke="${g("gold")}" stroke-width="3" stroke-linecap="round" d="M0 -10l6 -8M-4 -12l10 4"/>
      <path fill="${g("saffron")}" d="M-24 -22C-2 -26 22 -26 34 -20L32 -6C20 -12 -2 -12 -24 -8Z"/>
      <path fill="none" stroke="#9c3a08" stroke-opacity=".6" stroke-width="1" d="M-22 -18C0 -21 20 -21 33 -16M-22 -13C0 -16 20 -16 32 -11"/>
      <path fill="${g("gold")}" d="M26 -26l4 -8l3 8l-1 12h-5z"/>
      <path fill="${g("steel")}" d="M8 -80L32 -76L30 -44L6 -48Z"/>
      <path fill="none" stroke="${g("gold")}" stroke-width="1.8" d="M8 -80L32 -76L30 -44L6 -48Z"/>
      <g transform="translate(19 -62)"><circle r="5" fill="${g("gold")}"/><path d="M0 -8V-5M0 5V8M-8 0H-5M5 0H8M-5.6 -5.6l2 2M3.6 3.6l2 2M-5.6 5.6l2 -2M3.6 -3.6l2 -2" stroke="#e8b84e" stroke-width="1.2"/><circle r="2.2" fill="#c6302a"/></g>
      <path fill="url(#${id}-mail)" d="M-6 -103C-12 -96 -15 -88 -13 -82C3 -78 25 -80 40 -88.6C38.4 -95.6 34.6 -101 30.4 -103.4C20 -99.8 7.4 -99.6 -6 -103Z"/>
      <path fill="${g("shade")}" d="M-6 -103C-12 -96 -15 -88 -13 -82C3 -78 25 -80 40 -88.6C38.4 -95.6 34.6 -101 30.4 -103.4C20 -99.8 7.4 -99.6 -6 -103Z"/>
      <path fill="none" stroke="#fffaf0" stroke-width="3" stroke-linecap="round" stroke-dasharray=".1 4.4" d="M6 -96C12 -82 22 -74 36 -80"/>
      <path fill="none" stroke="#fffaf0" stroke-width="2.6" stroke-linecap="round" stroke-dasharray=".1 4" d="M4 -94C8 -74 20 -64 38 -72"/>
      <g transform="translate(22 -67)"><path d="M0 -3l3 4l-3 4l-3 -4z" fill="${g("gold")}"/><circle r="1.5" fill="#1f8a4c"/></g>
      <path fill="url(#${id}-mail)" d="M5.4 -150C1.2 -136 0 -118 2.6 -100C10 -95 20 -94 28 -97.5C21 -101.6 15 -106 12 -113C9.4 -122 8.8 -136 10.6 -148Z"/>
      <path fill="${g("shade")}" d="M5.4 -150C1.2 -136 0 -118 2.6 -100C10 -95 20 -94 28 -97.5C21 -101.6 15 -106 12 -113C9.4 -122 8.8 -136 10.6 -148Z"/>
      <path fill="none" stroke="#5f6b78" stroke-width=".9" d="M2.6 -100C10 -95 20 -94 28 -97.5"/>
      <ellipse cx="8.4" cy="-127" rx="3.2" ry="5" fill="${g("skin")}"/>
      <circle cx="8.8" cy="-120.4" r="3.4" fill="none" stroke="${g("gold")}" stroke-width="1.5"/><circle cx="8.8" cy="-116.8" r="1.7" fill="#fffaf0"/>
      <path fill="${g("skin")}" d="${FACE}"/>
      <g clip-path="url(#${id}-faceclip)">
        <ellipse cx="18" cy="-118" rx="11" ry="10" fill="url(#${id}-skd)"/>
        <ellipse cx="14" cy="-136" rx="6" ry="10" fill="url(#${id}-skd)" opacity=".7"/>
        <ellipse cx="27" cy="-128" rx="6" ry="4" fill="url(#${id}-warm)"/>
        <ellipse cx="40" cy="-124" rx="3.4" ry="7" fill="url(#${id}-warm)"/>
      </g>
      <path fill="none" stroke="#ffd29a" stroke-width="1.1" stroke-opacity=".75" stroke-linecap="round" d="M30 -146C32 -143 34 -141 34 -139C34 -137 33 -136 33.5 -135C36 -132 39 -128 41.5 -125.5C42.5 -124.5 42 -122.5 40.5 -122"/>
      <path fill="none" stroke="#6e3b1d" stroke-opacity=".45" stroke-width=".9" d="M33.6 -134.5C36 -131.4 38.6 -128.2 40.4 -126M37.6 -123.6C38.6 -124.4 39.8 -124.2 40.4 -123.2"/>
      <path fill="none" stroke="#7a3b28" stroke-width="1" d="M38.3 -117.3C37.2 -117 36.6 -116.3 36.6 -115.4"/>
      <path fill="#f4eadd" d="M27.5 -135.2C29.2 -136.6 31.6 -136.8 33.2 -135.6C31.8 -134.2 29.6 -133.8 27.5 -135.2Z"/>
      <circle cx="31.3" cy="-135.3" r="1.2" fill="#24160c"/><circle cx="31.7" cy="-135.7" r=".4" fill="#fff"/>
      <path fill="none" stroke="#1a110b" stroke-width="1" stroke-linecap="round" d="M27 -135.4C29 -137.4 32 -137.6 33.6 -135.8"/>
      <path fill="none" stroke="#1a110b" stroke-width="2" stroke-linecap="round" d="M25.6 -139.4C28.4 -141 32 -141.2 35 -139.6"/>
      <path fill="#171009" d="M9.8 -146C13 -142 14.6 -136 14.4 -130C14.2 -127.6 13.4 -126 12.4 -125C11.6 -128 11 -132 10.4 -136C10 -139.6 9.6 -143 9.8 -146Z"/>
      <path fill="#171009" d="M39 -120C36 -117.5 31 -116.8 26 -117.5C20 -118.4 15 -121 12.5 -125C11 -127.5 11.2 -130.5 13 -132.5C13.2 -129.8 14.6 -127.4 17 -126C21 -123.8 27 -123.2 32 -123C35 -122.8 37.5 -122 39 -120Z"/>
      <path fill="#171009" d="M13 -132.5C11 -135 11.6 -138.5 14.6 -139.6C13.4 -137.6 13.6 -135.4 15 -133.6Z"/>
      <path fill="#171009" d="M40 -120.6C44 -119.2 47.6 -120.6 49 -124.4C49.8 -126.6 49 -128.6 47.6 -129.4C48 -126.8 46.4 -123.8 42.6 -122.4Z"/>
      <path fill="none" stroke="#5b4636" stroke-width=".45" stroke-opacity=".8" d="M36 -121C30 -120 22 -120.6 16 -124M34 -122.4C28 -121.8 21 -122.4 15 -127M42 -121.6C45 -121.4 47 -123 48 -126"/>
      <path fill="${g("steel")}" d="M6 -156C6 -171 14 -180 24.5 -180.5C35 -181 43.5 -172 43.5 -156Z"/>
      <path fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="1.4" stroke-linecap="round" d="M13 -165C15.5 -171.5 20 -175.2 26 -176"/>
      <path fill="none" stroke="${g("gold")}" stroke-width="1.1" d="M8 -160C18 -163 32 -163 42 -160"/>
      <path fill="${g("steel")}" d="M23 -180L24.5 -199L26 -180Z"/>
      <path fill="${g("gold")}" d="M21 -180.5h7l-1 -3h-5z"/><circle cx="24.5" cy="-199" r="1.5" fill="${g("gold")}"/>
      <g class="ck-turra"><path fill="${g("saffron")}" d="M6 -155C1 -152 -2.6 -145 -3.4 -136C-3.8 -130 -2.8 -125 -1 -121C.6 -128 2 -136 4.4 -143C5.4 -146 6.4 -149 7.4 -151Z"/><path fill="none" stroke="#9c3a08" stroke-opacity=".5" stroke-width=".7" d="M3.4 -150C1 -144 -.4 -136 -1 -127"/></g>
      <path fill="${g("saffron")}" d="M4.5 -158C16 -165.5 33 -166 45.5 -158.5L46 -147C33.5 -154.5 16.5 -154.8 4.2 -147.8Z"/>
      <path fill="none" stroke="#9c3a08" stroke-opacity=".6" stroke-width=".8" d="M5 -155C16 -161.5 33 -162 45.6 -155.2M5 -151.4C16 -158 33 -158.4 45.8 -151.4"/>
      <path fill="none" stroke="#ffd08a" stroke-width=".9" d="M8 -156.6C18 -161.4 30 -162 40 -159.4"/>
      <g class="ck-kalgi"><path fill="#fffaf2" stroke="#d8c9ae" stroke-width=".5" d="M44.6 -160.4C45 -170 49.2 -178.6 56 -182.6C51.2 -175.6 48.4 -168 47.2 -160.2Z"/></g>
      <path fill="${g("gold")}" d="M42 -149.5C40.4 -154 41.2 -158.4 44.4 -160.6C46.6 -157.4 46.8 -153.4 45 -149.6Z"/>
      <circle cx="43.6" cy="-154.4" r="1.2" fill="#c01f2e"/><circle cx="43.8" cy="-157.8" r=".9" fill="#1f8a4c"/>
      <g class="ck-arm">
        <path fill="none" stroke="#4a2e1a" stroke-width="4.2" stroke-linecap="round" d="M${P(-196)}L${P(122)}"/>
        <path fill="${g("steel")}" d="M${P(-200, -2.4)}L${P(-196, -2.4)}L${P(-196, 2.4)}L${P(-200, 2.4)}Z"/>
        <path fill="${g("steel")}" stroke="#4f5b68" stroke-width=".6" d="M${P(120)}Q${P(132, 8)} ${P(164)}Q${P(132, -8)} ${P(120)}Z"/>
        <path fill="none" stroke="#fff" stroke-opacity=".6" stroke-width=".8" d="M${P(124)}L${P(158)}"/>
        <path fill="none" stroke="#c6302a" stroke-width="2.4" stroke-linecap="round" d="M${P(120)}c-2 8 -4 14 -8 18M${P(121)}c0 8 -2 15 -4 20"/>
        <path fill="${g("coatb")}" d="M12 -100C28 -94 42 -82 50 -68L40 -60C32 -74 22 -84 6 -88Z"/>
        <path fill="url(#${id}-mail)" d="M10 -100C20 -97 28 -92 32 -86L22 -80C18 -86 12 -90 4 -92Z"/>
        <path fill="none" stroke="${g("gold")}" stroke-width="4" d="M31 -86l8 10"/>
        <path fill="${g("coatb")}" d="M46 -72C58 -76 70 -82 80 -88L84 -78C72 -72 60 -64 48 -60Z"/>
        <path fill="${g("steel")}" d="M62 -80L78 -88L81 -79L66 -72Z"/>
        <path fill="none" stroke="${g("gold")}" stroke-width="1.2" d="M62 -80L78 -88L81 -79L66 -72Z"/>
        <path fill="${g("skin")}" d="M79 -90C85 -92 90 -88 90 -82C90 -76 86 -74 82 -76C80 -80 78 -86 79 -90Z"/>
        <path fill="none" stroke="#6e3b1d" stroke-opacity=".6" stroke-width=".7" d="M84 -89.4C86 -86 86.4 -82 85 -78.6M87.4 -88C88.8 -84.8 88.8 -81 87.6 -78"/>
      </g>`;
  }

  function markup(id) {
    const r = rng(1576);
    return `${defs(id)}
    <g class="ck-body">
      ${leg(id, "hf")}${leg(id, "ff")}
      <g class="ck-tailwrap" transform="translate(${TAIL[0]} ${TAIL[1]}) rotate(-20)">${tail(id, r)}</g>
      ${body(id)}
      ${neck(id, r)}
      ${tack(id)}
      ${leg(id, "hn")}${leg(id, "fn")}
      <g class="ck-rider" transform="translate(${SEAT[0]} ${SEAT[1]})">${rider(id)}</g>
      <path class="ck-reins" d=""/>
    </g>`;
  }

  /* ---------- poses ---------- */
  // Absolute segment angles in degrees (0 = straight down, negative = swung forward)
  const STAND = { legs: { hf: [20, -6, -25], hn: [24, -4, -25], ff: [2, 0, -25], fn: [-2, 0, -25] }, pitch: 0, pv: [0, -170], neck: -4, head: 48, tail: -62, rider: 2, spear: -6 };
  const STATUE = { legs: { hf: [18, -6, -25], hn: [26, -2, -25], ff: [4, 0, -25], fn: [-58, 62, 92] }, pitch: -7, pv: [-104, -2], neck: -14, head: 36, tail: -55, rider: 0, spear: -16 };
  const REAR = { legs: { hf: [52, 34, 6], hn: [58, 40, 10], ff: [-62, 96, 126], fn: [-44, 82, 110] }, pitch: -30, pv: [-104, -2], neck: -18, head: 26, tail: -34, rider: 20, spear: -20 };

  // Four-beat gallop keyframes per leg: [t, upper, cannon, pastern], t = 0 at touchdown
  const GF = [[0, -26, -30, -30], [0.1, -10, -10, -45], [0.2, 8, 8, -62], [0.32, 28, 32, 5], [0.42, 20, 95, 140], [0.55, -20, 80, 120], [0.7, -48, 5, 40], [0.85, -45, -40, -20]];
  const GH = [[0, -12, -28, -30], [0.12, 6, -10, -50], [0.24, 26, 8, -55], [0.36, 48, 42, 5], [0.48, 42, 20, 60], [0.6, 10, -40, 20], [0.75, -20, -70, -20], [0.9, -24, -45, -30]];
  const OFF = { hf: 0, hn: 0.1, ff: 0.3, fn: 0.4 };
  const STANCE = 0.34;
  const wrap = (t) => ((t % 1) + 1) % 1;
  function sample(keys, t) {
    t = wrap(t);
    let i = keys.length - 1;
    for (let k = 0; k < keys.length; k++) if (keys[k][0] <= t) i = k;
    const a = keys[i], b = keys[(i + 1) % keys.length];
    const tb = b[0] <= a[0] ? b[0] + 1 : b[0];
    const u = ease((t - a[0]) / (tb - a[0]));
    return [lerp(a[1], b[1], u), lerp(a[2], b[2], u), lerp(a[3], b[3], u)];
  }
  function gallop(phi) {
    const T = Math.PI * 2, legs = {}, stance = [];
    for (const k in OFF) {
      legs[k] = sample(LEGS[k].h ? GH : GF, phi - OFF[k]);
      if (wrap(phi - OFF[k]) < STANCE) stance.push(k);
    }
    const pitch = 4 * Math.sin(T * (phi - 0.25));
    return { legs, stance, pitch, pv: [0, -170], neck: 8 + 5 * Math.sin(T * (phi - 0.3)), head: 40 + 5 * Math.sin(T * (phi - 0.35)), tail: -14 + 6 * Math.sin(T * phi), rider: 8 - pitch * 0.7, spear: -2 + 2 * Math.sin(T * phi) };
  }

  // The leap: [t, pose]
  const LEAPK = [
    [0.0, { legs: { hf: [-10, -30, -30], hn: [-4, -34, -32], ff: [-26, -28, -26], fn: [-30, -24, -22] }, pitch: -4, neck: 4, head: 40, tail: -14, rider: 8, spear: -2 }],
    [0.12, { legs: { hf: [30, 24, -38], hn: [36, 30, -30], ff: [-66, 88, 118], fn: [-72, 94, 124] }, pitch: -20, neck: -8, head: 30, tail: -6, rider: 20, spear: -10 }],
    [0.28, { legs: { hf: [52, 54, 28], hn: [58, 60, 34], ff: [-84, 100, 130], fn: [-88, 104, 134] }, pitch: -14, neck: -4, head: 34, tail: 4, rider: 16, spear: -14 }],
    [0.46, { legs: { hf: [54, 72, 62], hn: [58, 76, 66], ff: [-80, 96, 122], fn: [-84, 98, 126] }, pitch: -2, neck: 2, head: 40, tail: 8, rider: 6, spear: -16 }],
    [0.62, { legs: { hf: [22, -26, 20], hn: [18, -32, 14], ff: [-46, -18, -8], fn: [-40, -24, -14] }, pitch: 12, neck: 8, head: 50, tail: 2, rider: -6, spear: -10 }],
    [0.8, { legs: { hf: [-4, -58, -12], hn: [-8, -62, -16], ff: [-12, -8, -40], fn: [-4, -2, -44] }, pitch: 18, neck: 10, head: 56, tail: -6, rider: -12, spear: -4 }],
    [1.0, { legs: { hf: [-14, -34, -30], hn: [-10, -30, -32], ff: [14, 12, -52], fn: [20, 16, -56] }, pitch: 6, neck: 6, head: 46, tail: -12, rider: 2, spear: 0 }],
  ];
  const AIR0 = 0.14, AIR1 = 0.82;
  function leap(t) {
    t = clamp(t, 0, 1);
    let i = 0;
    while (i < LEAPK.length - 2 && LEAPK[i + 1][0] <= t) i++;
    const [ta, a] = LEAPK[i], [tb, b] = LEAPK[i + 1];
    const st = mix({ pv: [0, -170], ...a }, { pv: [0, -170], ...b }, ease((t - ta) / (tb - ta)));
    st.air = t > AIR0 && t < AIR1 ? Math.sin((Math.PI * (t - AIR0)) / (AIR1 - AIR0)) : 0;
    st.stance = t <= AIR0 ? ["hf", "hn"] : t >= AIR1 ? ["ff", "fn"] : [];
    return st;
  }

  function mix(a, b, t) {
    const legs = {};
    for (const k of ["hf", "hn", "ff", "fn"]) legs[k] = a.legs[k].map((v, i) => lerp(v, b.legs[k][i], t));
    const n = (k, d) => lerp(a[k] ?? d, b[k] ?? d, t);
    const pa = a.pv || [0, -170], pb = b.pv || [0, -170];
    return {
      legs, pitch: n("pitch", 0), neck: n("neck", 0), head: n("head", 46), tail: n("tail", -20), rider: n("rider", 0), spear: n("spear", 0),
      pv: [lerp(pa[0], pb[0], t), lerp(pa[1], pb[1], t)], stance: t < 0.5 ? a.stance : b.stance, air: lerp(a.air || 0, b.air || 0, t),
    };
  }

  /* ---------- forward kinematics ---------- */
  const rot = (x, y, a, cx = 0, cy = 0) => {
    const c = Math.cos(a * R), s = Math.sin(a * R), dx = x - cx, dy = y - cy;
    return [cx + dx * c - dy * s, cy + dx * s + dy * c];
  };
  function hooves(st) {
    const out = {};
    for (const k in LEGS) {
      const L = LEGS[k], len = L.h ? LEN.h : LEN.f;
      let x = L.px, y = L.py;
      st.legs[k].forEach((a, i) => { x += -Math.sin(a * R) * len[i]; y += Math.cos(a * R) * len[i]; });
      out[k] = rot(x, y + 6, st.pitch || 0, st.pv[0], st.pv[1]);
    }
    return out;
  }
  // how far to lift the horse so its planted hooves touch y = 0
  function ground(st) {
    const hv = hooves(st);
    const keys = st.stance && st.stance.length ? st.stance : null;
    if (!keys) return null;
    return -Math.max(...keys.map((k) => hv[k][1]));
  }

  /* ---------- rig ---------- */
  function rig(root) {
    const q = (s) => root.querySelector(s);
    const legs = {};
    root.querySelectorAll(".ck-leg").forEach((g) => { legs[g.dataset.leg] = { g, s2: g.querySelector(".s2"), s3: g.querySelector(".s3") }; });
    const el = { body: q(".ck-body"), neck: q(".ck-neck"), head: q(".ck-head"), tail: q(".ck-tailwrap"), rider: q(".ck-rider"), arm: q(".ck-arm"), reins: q(".ck-reins") };
    return {
      apply(st) {
        for (const k in legs) {
          const L = LEGS[k], len = L.h ? LEN.h : LEN.f, [a, b, c] = st.legs[k], o = legs[k];
          o.g.setAttribute("transform", `translate(${L.px} ${L.py}) rotate(${f(a)})`);
          o.s2.setAttribute("transform", `translate(0 ${len[0]}) rotate(${f(b - a)})`);
          o.s3.setAttribute("transform", `translate(0 ${len[1]}) rotate(${f(c - b)})`);
        }
        el.body.setAttribute("transform", `rotate(${f(st.pitch)} ${f(st.pv[0])} ${f(st.pv[1])})`);
        el.neck.setAttribute("transform", `rotate(${f(st.neck)} ${NECK[0]} ${NECK[1]})`);
        el.head.setAttribute("transform", `translate(${POLL[0]} ${POLL[1]}) rotate(${f(st.head)})`);
        el.tail.setAttribute("transform", `translate(${TAIL[0]} ${TAIL[1]}) rotate(${f(st.tail)})`);
        el.rider.setAttribute("transform", `translate(${SEAT[0]} ${SEAT[1]}) rotate(${f(st.rider)})`);
        el.arm.setAttribute("transform", `rotate(${f(st.spear)} ${SHOULDER[0]} ${SHOULDER[1]})`);
        // reins run from Pratap's hand to the bit, wherever both happen to be
        const hand = rot(HAND[0], HAND[1], st.rider);
        const hx = SEAT[0] + hand[0], hy = SEAT[1] + hand[1];
        const bh = rot(BIT[0], BIT[1], st.head);
        const bn = rot(POLL[0] + bh[0], POLL[1] + bh[1], st.neck, NECK[0], NECK[1]);
        el.reins.setAttribute("d", `M${f(hx)} ${f(hy)}Q${f((hx + bn[0]) / 2)} ${f((hy + bn[1]) / 2 + 22)} ${f(bn[0])} ${f(bn[1])}`);
      },
    };
  }

  window.ChetakArt = { markup, rig, gallop, leap, mix, hooves, ground, STAND, STATUE, REAR, LEGS, STANCE, OFF };
})();
