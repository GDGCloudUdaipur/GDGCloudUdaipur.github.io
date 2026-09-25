/* ==========================================================================
   Premium motion layer.
   Word-by-word heading reveals, water reflections under big titles, scroll
   parallax, the hero's scroll-out, magnetic buttons, a Google-colour cursor
   ring, the product orbs and the sunken treasure chest.
   ========================================================================== */
(function () {
  const D = window.CCD;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(pointer: fine)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- split headings into rising words ---------- */
  function split(el) {
    if (el.dataset.split) return;
    el.dataset.split = "1";
    let n = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((c) => {
        if (c.nodeType === 3) {
          const frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const w = document.createElement("span"); w.className = "w";
            const i = document.createElement("span"); i.textContent = part; i.style.setProperty("--d", `${n++ * 55}ms`);
            w.appendChild(i); frag.appendChild(w);
          });
          c.replaceWith(frag);
        } else if (c.nodeType === 1 && c.tagName !== "BR" && !c.classList.contains("w")) walk(c);
      });
    };
    walk(el);
    el.classList.add("split");
  }
  const heads = $$(".section-head h2, .glory-head h2, .dive-head h2, .places-head h2, .register h2");
  heads.forEach((h) => { if (h.classList.contains("reflect")) h.dataset.text = h.textContent.trim(); split(h); });
  const hio = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); hio.unobserve(en.target); } }), { rootMargin: "0px 0px -12% 0px" });
  heads.forEach((h) => (reduced ? h.classList.add("in") : hio.observe(h)));

  /* ---------- product orbs ---------- */
  const ICON = {
    gemini: `<defs><linearGradient id="og-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4285f4"/><stop offset=".6" stop-color="#9b72cb"/><stop offset="1" stop-color="#d96570"/></linearGradient></defs><path d="M20 3C21 12 28 19 37 20C28 21 21 28 20 37C19 28 12 21 3 20C12 19 19 12 20 3Z" fill="url(#og-g)"/>`,
    cloud: `<path d="M11 30h19a7 7 0 0 0 0-14a10 10 0 0 0-19-2a8 8 0 0 0 0 16z" fill="none" stroke-width="3.4" stroke-linecap="round"/><path d="M11 30h9" stroke="#34a853" stroke-width="3.4"/><path d="M20 30h10a7 7 0 0 0 5-2" stroke="#4285f4" stroke-width="3.4" fill="none"/><path d="M36 22a7 7 0 0 0-6-6" stroke="#f9ab00" stroke-width="3.4" fill="none"/><path d="M30 16a10 10 0 0 0-19-2a8 8 0 0 0-4 12" stroke="#ea4335" stroke-width="3.4" fill="none"/>`,
    vertex: `<g fill="#4285f4"><circle cx="20" cy="8" r="4"/><circle cx="8" cy="28" r="4"/><circle cx="32" cy="28" r="4"/></g><path d="M20 12L10 25M20 12L30 25M12 28H28" stroke="#669df6" stroke-width="2.6"/><circle cx="20" cy="22" r="3.4" fill="#34a853"/>`,
    firebase: `<path d="M20 36c-8 0-13-5-13-12c0-6 4-9 6-15c2 4 3 6 5 7c1-5 4-9 8-12c-1 6 1 9 4 13c2 3 3 5 3 8c0 6-5 11-13 11z" fill="#f9ab00"/><path d="M20 36c-5 0-8-3-8-7c0-4 3-6 5-10c1 3 3 4 4 5c2-2 3-4 4-6c1 3 3 5 3 9c0 5-4 9-8 9z" fill="#ea4335"/>`,
    bigquery: `<circle cx="17" cy="17" r="11" fill="none" stroke="#4285f4" stroke-width="3.4"/><path d="M25 25l9 9" stroke="#4285f4" stroke-width="4" stroke-linecap="round"/><path d="M12 22v-4M17 22v-9M22 22v-6" stroke="#669df6" stroke-width="2.8" stroke-linecap="round"/>`,
    run: `<path d="M8 10l11 10l-11 10z" fill="#4285f4"/><path d="M20 10l11 10l-11 10z" fill="#669df6"/>`,
    gke: `<circle cx="20" cy="20" r="11" fill="none" stroke="#4285f4" stroke-width="3"/><circle cx="20" cy="20" r="3.6" fill="#4285f4"/><g stroke="#4285f4" stroke-width="2.6" stroke-linecap="round">${[0, 1, 2, 3, 4, 5, 6].map((i) => { const a = (i / 7) * Math.PI * 2; return `<path d="M${(20 + Math.cos(a) * 4).toFixed(1)} ${(20 + Math.sin(a) * 4).toFixed(1)}L${(20 + Math.cos(a) * 16).toFixed(1)} ${(20 + Math.sin(a) * 16).toFixed(1)}"/>`; }).join("")}</g>`,
    android: `<rect x="11" y="4" width="18" height="32" rx="4" fill="none" stroke="#34a853" stroke-width="3"/><rect x="14" y="8" width="12" height="20" rx="1.5" fill="#34a853" opacity=".3"/><circle cx="20" cy="32" r="1.6" fill="#34a853"/>`,
    flutter: `<path d="M24 4L8 20l5 5L34 4z" fill="#669df6"/><path d="M24 19L14 29l10 9h10l-10-9l10-10z" fill="#4285f4"/>`,
    maps: `<path d="M20 36s11-11 11-19a11 11 0 0 0-22 0c0 8 11 19 11 19z" fill="#ea4335"/><circle cx="20" cy="17" r="4.4" fill="#fff"/><path d="M6 36h28" stroke="#34a853" stroke-width="3" stroke-linecap="round"/>`,
    adk: `<rect x="9" y="12" width="22" height="18" rx="6" fill="none" stroke="#4285f4" stroke-width="3"/><circle cx="16" cy="21" r="2.4" fill="#34a853"/><circle cx="24" cy="21" r="2.4" fill="#34a853"/><path d="M20 12V6M17 5h6" stroke="#ea4335" stroke-width="2.6" stroke-linecap="round"/><path d="M5 20h4M31 20h4" stroke="#f9ab00" stroke-width="2.6" stroke-linecap="round"/>`,
    colab: `<path d="M17 14a8 8 0 1 0 0 12" fill="none" stroke="#f9ab00" stroke-width="4" stroke-linecap="round"/><path d="M23 14a8 8 0 1 1 0 12" fill="none" stroke="#f28c28" stroke-width="4" stroke-linecap="round"/>`,
  };
  const orbs = $("#orbs");
  if (orbs) {
    orbs.innerHTML = D.products.map((p, i) => `
      <button class="orb" style="--i:${i};--dur:${(5 + (i % 4) * 0.9).toFixed(1)}s" data-speed="${(((i % 3) - 1) * 0.06).toFixed(2)}" aria-label="${esc(p.name)}: ${esc(p.line)}">
        <span class="orb-glass"><svg viewBox="0 0 40 40">${ICON[p.id] || ""}</svg></span>
        <b>${esc(p.name)}</b><small>${esc(p.line)}</small>
      </button>`).join("");
    orbs.addEventListener("click", (e) => {
      const o = e.target.closest(".orb"); if (!o) return;
      o.classList.remove("pop"); void o.offsetWidth; o.classList.add("pop");
    });
  }

  /* ---------- the sunken chest: tickets ---------- */
  const chest = $("#chest");
  if (chest) {
    new IntersectionObserver(([en]) => { if (en.isIntersecting) chest.classList.add("glow"); }, { threshold: 0.6 }).observe(chest);
    chest.addEventListener("click", (e) => {
      if (!chest.classList.contains("open")) {
        e.preventDefault();
        chest.classList.add("open");
        chest.querySelector(".chest-cta").textContent = "Your ticket is waiting on KonfHub →";
      }
    });
  }

  /* ---------- scroll parallax ---------- */
  const para = $$("[data-speed]");
  const hero = $("#top"), heroScene = $("#heroScene"), heroInner = $(".hero-inner"), toran = $("#toran");
  let ticking = false;
  function onScroll() {
    ticking = false;
    const vh = innerHeight;
    if (!reduced) {
      para.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const off = (r.top + r.height / 2 - vh / 2) * +el.dataset.speed;
        el.style.translate = `0 ${off.toFixed(1)}px`;
      });
      if (hero) {
        const p = Math.min(1, Math.max(0, scrollY / hero.offsetHeight));
        if (p < 1) {
          heroScene.style.transform = `scale(${(1 + p * 0.12).toFixed(4)}) translateY(${(p * 40).toFixed(1)}px)`;
          heroInner.style.transform = `translateY(${(-p * 120).toFixed(1)}px)`;
          heroInner.style.opacity = (1 - p * 1.3).toFixed(3);
          if (toran) toran.style.transform = `translateY(${(-p * 60).toFixed(1)}px)`;
        }
      }
    }
  }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- magnetic buttons ---------- */
  if (fine && !reduced) {
    $$(".btn-dark, .btn-light, .nav .btn").forEach((b) => {
      b.addEventListener("pointermove", (e) => {
        const r = b.getBoundingClientRect();
        b.style.translate = `${((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1)}px ${((e.clientY - r.top - r.height / 2) * 0.25).toFixed(1)}px`;
      });
      b.addEventListener("pointerleave", () => { b.style.translate = ""; });
    });
  }

  /* ---------- cursor ring ---------- */
  if (fine && !reduced) {
    const ring = document.createElement("div");
    ring.className = "cursor-ring";
    document.body.appendChild(ring);
    let x = -100, y = -100, cx = -100, cy = -100;
    addEventListener("pointermove", (e) => { x = e.clientX; y = e.clientY; ring.classList.add("on"); }, { passive: true });
    document.addEventListener("pointerleave", () => ring.classList.remove("on"));
    document.addEventListener("pointerover", (e) => ring.classList.toggle("hover", !!e.target.closest("a, button, [role=button], input, select, .place-card")));
    (function loop() {
      cx += (x - cx) * 0.2; cy += (y - cy) * 0.2;
      ring.style.transform = `translate(${cx.toFixed(1)}px, ${cy.toFixed(1)}px)`;
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- pause heavy CSS animation when off-screen ---------- */
  const pio = new IntersectionObserver((ents) => ents.forEach((en) => en.target.classList.toggle("paused", !en.isIntersecting)));
  $$(".dive, .marquee, .register, .story").forEach((s) => pio.observe(s));
})();
