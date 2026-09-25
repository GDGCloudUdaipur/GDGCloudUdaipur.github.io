/* ==========================================================================
   Moti: the Udaipur bot.
   An original little robot in a leheriya safa (turban) with a Google-colour
   kalgi and a proper Rajput moustache. Moti floats around the site, reacts
   to each section (waves in the hero, salutes Mewar, dives with goggles
   under the lake, cheers at the ticket counter) and follows your cursor.
   ========================================================================== */
(function () {
  const D = window.CCD;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const store = {
    get(k, d) { try { const v = localStorage.getItem("ccdudr:" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("ccdudr:" + k, JSON.stringify(v)); } catch (e) { /* ignore */ } },
  };

  const ART = `
  <svg class="moti-svg" viewBox="-60 -86 120 170" aria-hidden="true">
    <defs>
      <pattern id="leheriya" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
        <rect width="16" height="4" fill="#4285f4"/><rect y="4" width="16" height="4" fill="#34a853"/><rect y="8" width="16" height="4" fill="#f9ab00"/><rect y="12" width="16" height="4" fill="#ea4335"/>
      </pattern>
      <radialGradient id="moti-shell" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#e6ebf1"/><stop offset="1" stop-color="#b8c3cf"/></radialGradient>
      <radialGradient id="moti-thrust"><stop offset="0" stop-color="#fff4c2"/><stop offset=".4" stop-color="#f9ab00" stop-opacity=".8"/><stop offset="1" stop-color="#ea4335" stop-opacity="0"/></radialGradient>
    </defs>
    <ellipse class="m-shadow" cx="0" cy="80" rx="26" ry="5"/>
    <g class="m-float">
      <g class="m-thrust"><ellipse cx="0" cy="54" rx="12" ry="18" fill="url(#moti-thrust)"/></g>
      <g class="m-arm m-arm-l"><rect x="-44" y="10" width="12" height="30" rx="6" fill="url(#moti-shell)" stroke="#9aa7b4"/><circle cx="-38" cy="42" r="6" fill="#4285f4"/></g>
      <g class="m-body">
        <rect x="-28" y="4" width="56" height="46" rx="20" fill="url(#moti-shell)" stroke="#9aa7b4"/>
        <g class="m-dots"><circle cx="-12" cy="26" r="4" fill="#4285f4"/><circle cx="-4" cy="26" r="4" fill="#ea4335"/><circle cx="4" cy="26" r="4" fill="#f9ab00"/><circle cx="12" cy="26" r="4" fill="#34a853"/></g>
      </g>
      <g class="m-arm m-arm-r"><rect x="32" y="10" width="12" height="30" rx="6" fill="url(#moti-shell)" stroke="#9aa7b4"/><circle cx="38" cy="42" r="6" fill="#34a853"/></g>
      <g class="m-head">
        <rect x="-34" y="-44" width="68" height="50" rx="22" fill="url(#moti-shell)" stroke="#9aa7b4"/>
        <rect class="m-visor" x="-26" y="-34" width="52" height="28" rx="14" fill="#16202e"/>
        <g class="m-eyes"><rect class="m-eye" x="-15" y="-27" width="9" height="13" rx="4.5" fill="#8ff0ff"/><rect class="m-eye" x="6" y="-27" width="9" height="13" rx="4.5" fill="#8ff0ff"/></g>
        <g class="m-goggles"><circle cx="-10" cy="-20" r="12" fill="rgba(143,240,255,.25)" stroke="#f9ab00" stroke-width="3"/><circle cx="10" cy="-20" r="12" fill="rgba(143,240,255,.25)" stroke="#f9ab00" stroke-width="3"/><path d="M-34 -22h4M30 -22h4" stroke="#f9ab00" stroke-width="3"/><path d="M26 -30q14 -10 14 -30" stroke="#4285f4" stroke-width="5" fill="none" stroke-linecap="round"/></g>
        <path class="m-stache" d="M0 -2C-6 -6 -14 -6 -20 -2C-24 0 -28 -2 -29 -6C-27 0 -22 4 -14 3C-8 2 -3 0 0 -2C3 0 8 2 14 3C22 4 27 0 29 -6C28 -2 24 0 20 -2C14 -6 6 -6 0 -2Z" fill="#2b1a10"/>
        <g class="m-turban">
          <path d="M-38 -40C-40 -70 -14 -84 6 -80C28 -78 42 -62 38 -40C24 -48 -20 -50 -38 -40Z" fill="url(#leheriya)" stroke="#8a5a1c" stroke-width="1.2"/>
          <path d="M-36 -48C-18 -58 18 -60 38 -46M-30 -60C-12 -70 14 -72 32 -60" stroke="rgba(255,255,255,.55)" stroke-width="2" fill="none"/>
          <path class="m-turra" d="M34 -52C48 -52 56 -42 54 -26C52 -34 46 -42 36 -44Z" fill="url(#leheriya)" stroke="#8a5a1c" stroke-width="1"/>
          <g class="m-kalgi"><path d="M-6 -78C-10 -92 -4 -104 6 -108C2 -98 2 -88 4 -78Z" fill="#fffaf0" stroke="#d9a441"/>
            <circle cx="-2" cy="-76" r="3.2" fill="#4285f4"/><circle cx="5" cy="-76" r="3.2" fill="#ea4335"/><circle cx="-2" cy="-69" r="3.2" fill="#f9ab00"/><circle cx="5" cy="-69" r="3.2" fill="#34a853"/></g>
        </g>
      </g>
      <g class="m-bubbles"><circle cx="30" cy="-60" r="4"/><circle cx="36" cy="-76" r="3"/><circle cx="32" cy="-90" r="2"/></g>
    </g>
  </svg>`;

  function init() {
    if (store.get("botHidden", false)) return mountLauncher();
    const el = document.createElement("div");
    el.className = "moti";
    el.innerHTML = `<button class="moti-btn" aria-label="Moti, the Udaipur bot. Click for a tip.">${ART}</button>
      <div class="moti-say" role="status" aria-live="polite"></div>
      <button class="moti-x" aria-label="Hide Moti">×</button>`;
    document.body.appendChild(el);
    const say = el.querySelector(".moti-say");
    const eyes = el.querySelector(".m-eyes");
    let sayT, mood = "", lastKey = "";

    function speak(text, ms = 4200) {
      say.textContent = text;
      el.classList.add("talking");
      clearTimeout(sayT);
      sayT = setTimeout(() => el.classList.remove("talking"), ms);
    }
    function setMood(m) {
      if (m === mood) return;
      el.classList.remove("m-" + mood);
      mood = m;
      if (m) el.classList.add("m-" + m);
    }

    // Moti changes sides and mood with each section
    const MOODS = { top: "wave", glory: "salute", dive: "dive", register: "cheer", play: "wave", places: "look" };
    const LEFT = new Set(["places", "agenda", "explore", "faq"]);
    const seen = new Set();
    const io = new IntersectionObserver((ents) => {
      ents.forEach((en) => {
        if (!en.isIntersecting) return;
        const key = en.target.id;
        if (key === lastKey) return;
        lastKey = key;
        el.classList.toggle("left", LEFT.has(key));
        setMood(MOODS[key] || "");
        const lines = D.bot[key];
        if (lines && !seen.has(key)) {
          seen.add(key);
          speak(lines[Math.floor(Math.random() * lines.length)]);
        }
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    Object.keys(D.bot).forEach((k) => { const s = document.getElementById(k); if (s) io.observe(s); });

    // eyes follow the pointer
    addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height * 0.35);
      const d = Math.hypot(dx, dy) || 1;
      eyes.setAttribute("transform", `translate(${((dx / d) * 4).toFixed(1)} ${((dy / d) * 3).toFixed(1)})`);
    }, { passive: true });

    // lean into the scroll
    let lastY = scrollY, tilt = 0, raf = 0;
    addEventListener("scroll", () => {
      const v = scrollY - lastY; lastY = scrollY;
      tilt = Math.max(-14, Math.min(14, v * 0.4));
      el.style.setProperty("--tilt", tilt.toFixed(1) + "deg");
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setTimeout(() => el.style.setProperty("--tilt", "0deg"), 140));
    }, { passive: true });

    // click: a spin and a line
    el.querySelector(".moti-btn").addEventListener("click", () => {
      el.classList.remove("spin"); void el.offsetWidth; el.classList.add("spin");
      const pool = D.bot.click;
      speak(pool[Math.floor(Math.random() * pool.length)], 3200);
    });
    el.querySelector(".moti-x").addEventListener("click", () => {
      store.set("botHidden", true);
      el.classList.add("bye");
      setTimeout(() => { el.remove(); mountLauncher(); }, 500);
    });

    // every so often Moti takes a lap around the screen
    if (!reduced) {
      setInterval(() => {
        // stay out of the way of the pinned films
        if (document.hidden || el.classList.contains("talking") || ["glory", "places", "dive"].includes(lastKey)) return;
        el.classList.remove("lap"); void el.offsetWidth; el.classList.add("lap");
        setTimeout(() => el.classList.remove("lap"), 5200);
      }, 26000);
    }
    setTimeout(() => el.classList.add("in"), 1400);
  }

  function mountLauncher() {
    const b = document.createElement("button");
    b.className = "moti-launch";
    b.setAttribute("aria-label", "Bring back Moti, the Udaipur bot");
    b.innerHTML = `<span></span><span></span><span></span><span></span>`;
    b.onclick = () => { store.set("botHidden", false); b.remove(); init(); };
    document.body.appendChild(b);
  }

  window.MotiBot = { init };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
