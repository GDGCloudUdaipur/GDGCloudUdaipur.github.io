/* ==========================================================================
   Shahi Pass — a royal farman drawn on canvas, downloadable as PNG.
   ========================================================================== */
(function () {
  const C = { blue: "#4285f4", green: "#34a853", yellow: "#f9ab00", red: "#ea4335", ink: "#1c1712", saffron: "#f28c28", gold: "#b8862b" };
  const FONT = '"Outfit", system-ui, sans-serif';
  const DEVA = '"Yatra One", serif';
  const MONO = '"JetBrains Mono", monospace';

  function hash(s) {
    let h = 2166136261;
    for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
    return Math.abs(h);
  }

  // Cusped (multifoil) Rajput arch path.
  function archPath(ctx, x, y, w, h) {
    const lobes = 7, r = w / (lobes * 2);
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x, y + r * 3.2);
    // shoulders
    ctx.quadraticCurveTo(x, y + r * 1.2, x + r * 1.4, y + r * 1.4);
    for (let i = 1; i < lobes - 1; i++) {
      const cx = x + r * 2 * i + r;
      const lift = Math.sin((Math.PI * i) / (lobes - 1)) * r * 1.6;
      ctx.arc(cx, y + r * 1.6 - lift, r, Math.PI * 0.95, Math.PI * 0.05, false);
    }
    ctx.quadraticCurveTo(x + w, y + r * 1.2, x + w, y + r * 3.2);
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
  }

  function shape(ctx, kind, x, y, s) {
    ctx.save();
    ctx.translate(x, y);
    if (kind === "spark") {
      ctx.fillStyle = C.blue; ctx.beginPath(); ctx.arc(0, 0, s, 0, 7); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.beginPath();
      const k = s * 0.62;
      ctx.moveTo(0, -k); ctx.quadraticCurveTo(k * 0.12, -k * 0.12, k, 0); ctx.quadraticCurveTo(k * 0.12, k * 0.12, 0, k);
      ctx.quadraticCurveTo(-k * 0.12, k * 0.12, -k, 0); ctx.quadraticCurveTo(-k * 0.12, -k * 0.12, 0, -k); ctx.fill();
    } else if (kind === "half") {
      ctx.fillStyle = C.green; ctx.beginPath(); ctx.arc(0, 0, s, 0, 7); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(0, s * 0.08, s * 0.62, Math.PI, 0); ctx.fill();
    } else if (kind === "flower") {
      ctx.fillStyle = C.yellow;
      for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4; ctx.beginPath(); ctx.arc(Math.cos(a) * s * 0.6, Math.sin(a) * s * 0.6, s * 0.4, 0, 7); ctx.fill(); }
      ctx.beginPath(); ctx.arc(0, 0, s * 0.62, 0, 7); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(0, 0, s * 0.4, 0, 7); ctx.fill();
    } else {
      ctx.strokeStyle = C.red; ctx.lineWidth = s * 0.32;
      for (let i = 0; i < 3; i++) { const a = (i * Math.PI) / 3 + Math.PI / 2; ctx.beginPath(); ctx.moveTo(Math.cos(a) * s, Math.sin(a) * s); ctx.lineTo(-Math.cos(a) * s, -Math.sin(a) * s); ctx.stroke(); }
    }
    ctx.restore();
  }

  function wrap(ctx, text, x, y, maxW, lh, maxLines = 3) {
    const words = text.split(/\s+/);
    let line = "", lines = [];
    for (const w of words) {
      const test = line ? line + " " + w : w;
      if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test;
    }
    if (line) lines.push(line);
    if (lines.length > maxLines) { lines = lines.slice(0, maxLines); lines[maxLines - 1] += "…"; }
    lines.forEach((l, i) => ctx.fillText(l, x, y + i * lh));
    return lines.length;
  }

  function skyline(ctx, x, y, w, h) {
    // sky
    const g = ctx.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, "#6a3d8c"); g.addColorStop(0.55, "#f28b5d"); g.addColorStop(1, "#fde2b0");
    ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
    // sun
    ctx.fillStyle = "rgba(255,214,120,.9)"; ctx.beginPath(); ctx.arc(x + w * 0.3, y + h * 0.62, 46, 0, 7); ctx.fill();
    // hills
    ctx.fillStyle = "#7a5078"; ctx.beginPath(); ctx.moveTo(x, y + h * 0.7);
    [[0.12, 0.58], [0.22, 0.64], [0.3, 0.44], [0.42, 0.6], [0.58, 0.55], [0.72, 0.64], [0.86, 0.56], [1, 0.62]].forEach(([a, b]) => ctx.lineTo(x + w * a, y + h * b));
    ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); ctx.fill();
    // palace silhouette
    const base = y + h * 0.82;
    ctx.fillStyle = "#2a1c30";
    const blocks = [[0.46, 0.06, 0.1], [0.52, 0.08, 0.16], [0.6, 0.05, 0.24], [0.65, 0.1, 0.18], [0.75, 0.06, 0.27], [0.81, 0.1, 0.19], [0.91, 0.07, 0.13]];
    blocks.forEach(([a, bw, bh]) => {
      ctx.fillRect(x + w * a, base - h * bh, w * bw, h * bh);
      ctx.beginPath(); ctx.arc(x + w * (a + bw / 2), base - h * bh, w * bw * 0.28, Math.PI, 0); ctx.fill();
    });
    ctx.fillRect(x + w * 0.44, base - h * 0.05, w * 0.56, h * 0.05);
    // Jag Mandir
    ctx.fillRect(x + w * 0.1, base - h * 0.05, w * 0.22, h * 0.05);
    ctx.beginPath(); ctx.arc(x + w * 0.21, base - h * 0.05, w * 0.03, Math.PI, 0); ctx.fill();
    // lit windows
    ctx.fillStyle = "#ffc857";
    for (let i = 0; i < 26; i++) {
      const bx = x + w * (0.47 + ((i * 37) % 50) / 100), by = base - h * (0.04 + ((i * 13) % 17) / 100);
      ctx.fillRect(bx, by, 5, 8);
    }
    // water
    const wg = ctx.createLinearGradient(0, base, 0, y + h);
    wg.addColorStop(0, "#6d3f6f"); wg.addColorStop(1, "#3b2552");
    ctx.fillStyle = wg; ctx.fillRect(x, base, w, y + h - base);
    ctx.strokeStyle = "rgba(255,200,120,.55)"; ctx.lineWidth = 3;
    for (let i = 0; i < 9; i++) { const yy = base + 12 + i * 11; ctx.beginPath(); ctx.moveTo(x + w * (0.2 + (i % 3) * 0.2), yy); ctx.lineTo(x + w * (0.3 + (i % 3) * 0.2), yy); ctx.stroke(); }
  }

  function draw(canvas, data) {
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const gold = !!data.gold;
    const P = window.CCD.personas[data.persona] || window.CCD.personas.ai;

    // paper
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, gold ? "#fbeab8" : "#fbf2de"); bg.addColorStop(1, gold ? "#efcf7f" : "#f1e2c2");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    // paper grain
    let seed = 42;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    ctx.fillStyle = "rgba(120, 90, 40, .06)";
    for (let i = 0; i < 1800; i++) ctx.fillRect(rnd() * W, rnd() * H, 2, 2);

    // borders
    const frame = gold ? C.gold : C.ink;
    ctx.strokeStyle = frame; ctx.lineWidth = 6; ctx.strokeRect(34, 34, W - 68, H - 68);
    ctx.lineWidth = 2; ctx.strokeRect(50, 50, W - 100, H - 100);
    // corner lotuses
    [[50, 50], [W - 50, 50], [50, H - 50], [W - 50, H - 50]].forEach(([cx, cy], i) => {
      ctx.save(); ctx.translate(cx, cy); ctx.rotate((i * Math.PI) / 2);
      ctx.fillStyle = [C.blue, C.green, C.yellow, C.red][i];
      ctx.beginPath(); ctx.arc(0, 0, 13, 0, 7); ctx.fill(); ctx.restore();
    });

    // arch window with skyline
    const ax = 150, ay = 110, aw = W - 300, ah = 470;
    ctx.save(); archPath(ctx, ax, ay, aw, ah); ctx.clip(); skyline(ctx, ax, ay, aw, ah); ctx.restore();
    ctx.strokeStyle = frame; ctx.lineWidth = 5; archPath(ctx, ax, ay, aw, ah); ctx.stroke();
    ctx.lineWidth = 2; archPath(ctx, ax - 16, ay - 16, aw + 32, ah + 16); ctx.stroke();

    // title
    ctx.textAlign = "center"; ctx.fillStyle = C.ink;
    ctx.font = `64px ${DEVA}`; ctx.fillText("शाही परवाना", W / 2, 668);
    ctx.font = `600 22px ${MONO}`; ctx.fillStyle = gold ? "#7a5613" : "#6b5a44";
    ctx.fillText(gold ? "GOLDEN SHAHI PASS · CCD UDAIPUR 2026" : "SHAHI PASS · CCD UDAIPUR 2026", W / 2, 712);

    // name
    ctx.fillStyle = "#6b5a44"; ctx.font = `400 28px ${FONT}`;
    ctx.fillText("By order of the lake, this farman invites", W / 2, 780);
    ctx.fillStyle = C.ink;
    let size = 84; ctx.font = `700 ${size}px ${FONT}`;
    const name = (data.name || "A Builder").trim();
    while (ctx.measureText(name).width > W - 240 && size > 40) { size -= 4; ctx.font = `700 ${size}px ${FONT}`; }
    ctx.fillText(name, W / 2, 870);

    // persona
    ctx.font = `600 40px ${FONT}`; ctx.fillStyle = gold ? "#8a5a00" : C.saffron;
    ctx.fillText(P.title, W / 2, 936);
    ctx.font = `400 26px ${FONT}`; ctx.fillStyle = "#4a3f33";
    wrap(ctx, P.line, W / 2, 980, W - 280, 36, 2);

    // idea
    if (data.idea) {
      ctx.font = `italic 500 27px ${FONT}`; ctx.fillStyle = C.ink;
      wrap(ctx, `“${data.idea.trim()}”`, W / 2, 1068, W - 300, 36, 2);
    }

    // details row
    const id = (data.passId && data.passId.trim()) ? data.passId.trim() : ("CCD-UDR-26-" + String(hash(name.toLowerCase()) % 10000).padStart(4, "0"));
    const cells = [["DATE", data.date], ["GATE", "Tripolia"], ["SEAT", "Unclaimed"], ["PASS", id]];
    const top = 1150, cw = (W - 200) / 4;
    ctx.strokeStyle = "rgba(28,23,18,.25)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(100, top - 34); ctx.lineTo(W - 100, top - 34); ctx.stroke();
    cells.forEach(([k, v], i) => {
      const cx = 100 + cw * i + cw / 2;
      ctx.font = `600 16px ${MONO}`; ctx.fillStyle = "#8a7a62"; ctx.fillText(k, cx, top);
      if (i === 3) {
        let pSize = 20;
        ctx.font = `600 ${pSize}px ${MONO}`;
        while (ctx.measureText(v).width > cw - 8 && pSize > 11) {
          pSize -= 1;
          ctx.font = `600 ${pSize}px ${MONO}`;
        }
        ctx.fillStyle = C.ink; ctx.fillText(v, cx, top + 36);
      } else {
        ctx.font = `600 25px ${FONT}`; ctx.fillStyle = C.ink; ctx.fillText(v, cx, top + 36);
      }
    });

    // footer brand
    ["spark", "half", "flower", "star"].forEach((k, i) => shape(ctx, k, W / 2 - 66 + i * 44, 1256, 15));
    ctx.font = `500 20px ${FONT}`; ctx.fillStyle = "#6b5a44";
    ctx.fillText("GDG Cloud Udaipur  ·  #CCDUdaipur", W / 2, 1298);

    // wax seal
    ctx.save(); ctx.translate(W - 150, 640); ctx.rotate(-0.2);
    ctx.fillStyle = gold ? C.gold : "#b3261e";
    ctx.beginPath();
    for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2, r = i % 2 ? 60 : 68; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,.25)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, 46, 0, 7); ctx.stroke();
    ctx.fillStyle = "#fff5e0"; ctx.beginPath();
    for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2 - Math.PI / 2, r = i % 2 ? 11 : 30; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
    ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.textAlign = "start";
    return id;
  }

  async function render(canvas, data) {
    try {
      await Promise.all([
        document.fonts.load(`64px "Yatra One"`, "शाही"),
        document.fonts.load(`700 80px "Outfit"`),
        document.fonts.load(`600 20px "JetBrains Mono"`),
      ]);
    } catch (e) { /* fall back to system fonts */ }
    return draw(canvas, data);
  }

  window.ShahiPass = { render };
})();
