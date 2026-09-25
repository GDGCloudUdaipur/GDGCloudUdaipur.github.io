/* ==========================================================================
   CCD Udaipur 2026 — interactions
   ========================================================================== */
(function () {
  "use strict";
  const D = window.CCD;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const h = (tag, attrs = {}, html = "") => {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === "class") e.className = v; else if (k === "style") e.style.cssText = v; else e.setAttribute(k, v);
    }
    if (html) e.innerHTML = html;
    return e;
  };
  const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = {
    get(k, d) { try { const v = localStorage.getItem("ccdudr:" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("ccdudr:" + k, JSON.stringify(v)); } catch (e) { /* private mode */ } },
  };
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const colorVar = (c) => `var(--${c || "ink"})`;

  /* ---------- dates ---------- */
  const START = new Date(D.event.start);
  const END = new Date(D.event.end);
  const DAY = D.event.start.slice(0, 10);
  const IST = "Asia/Kolkata";
  const fmt = (d, o) => new Intl.DateTimeFormat("en-IN", { timeZone: IST, ...o }).format(d);
  const dateLong = fmt(START, { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  const tRange = `${fmt(START, { hour: "numeric", minute: "2-digit", hour12: true })} – ${fmt(END, { hour: "numeric", minute: "2-digit", hour12: true })} IST`;
  const at = (hhmm) => new Date(`${DAY}T${hhmm}:00+05:30`);
  const istHour = (d = new Date()) => {
    const p = new Intl.DateTimeFormat("en-GB", { timeZone: IST, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).formatToParts(d);
    const g = (t) => +p.find((x) => x.type === t).value;
    return (g("hour") % 24) + g("minute") / 60 + g("second") / 3600;
  };
  const hhmm = (hr) => {
    const m = Math.round(hr * 60) % 1440;
    return String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0");
  };

  /* ---------- bindings ---------- */
  const binds = {
    dateLong, timeRange: tRange, venueName: D.venue.name, venueArea: D.venue.area, venueAddress: D.venue.address,
    expected: D.event.expected, summary: `${dateLong} · ${D.venue.confirmed ? D.venue.name + ", " : ""}${D.venue.area}`,
  };
  $$("[data-bind]").forEach((el) => {
    const k = el.dataset.bind;
    if (k === "tentative") { el.hidden = !!D.event.dateConfirmed; return; }
    if (binds[k] != null) el.textContent = binds[k];
  });
  $$("[data-link]").forEach((a) => {
    const url = D.links[a.dataset.link];
    if (url) a.href = url;
  });

  /* ---------- toast & confetti ---------- */
  let toastT;
  function toast(html, ms = 3200) {
    const t = $("#toast");
    t.innerHTML = html;
    t.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove("show"), ms);
  }
  function confetti() {
    if (reduced) return;
    const c = $("#confetti"), ctx = c.getContext("2d");
    c.width = innerWidth * devicePixelRatio; c.height = innerHeight * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    const cols = ["#4285f4", "#34a853", "#f9ab00", "#ea4335", "#f3a3c4"];
    const ps = Array.from({ length: 160 }, () => ({
      x: innerWidth / 2 + (Math.random() - 0.5) * 200, y: innerHeight * 0.35, vx: (Math.random() - 0.5) * 16, vy: Math.random() * -14 - 4,
      r: Math.random() * 6 + 4, c: cols[(Math.random() * cols.length) | 0], a: Math.random() * 6, va: (Math.random() - 0.5) * 0.3, petal: Math.random() < 0.35,
    }));
    let f = 0;
    (function tick() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ps.forEach((p) => {
        p.vy += 0.35; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.a += p.va;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c;
        if (p.petal) { ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r / 2.2, 0, 0, 7); ctx.fill(); } else ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2);
        ctx.restore();
      });
      if (++f < 200) requestAnimationFrame(tick); else ctx.clearRect(0, 0, innerWidth, innerHeight);
    })();
    setTimeout(() => { f = 999; ctx.clearRect(0, 0, innerWidth, innerHeight); }, 4500); // never leave confetti stuck
  }

  /* ---------- loader ---------- */
  (function loader() {
    const L = $("#loader");
    const seen = (() => { try { return sessionStorage.getItem("ccdudr:loaded"); } catch (e) { return null; } })();
    const done = () => {
      L.classList.add("done"); document.body.classList.remove("loading");
      try { sessionStorage.setItem("ccdudr:loaded", "1"); } catch (e) { /* ignore */ }
      $$(".hero .reveal").forEach((e) => e.classList.add("in"));
    };
    if (seen || reduced) { L.remove(); document.body.classList.remove("loading"); requestAnimationFrame(() => $$(".hero .reveal").forEach((e) => e.classList.add("in"))); return; }
    document.body.classList.add("loading");
    const msgs = ["Lighting the diyas", "Filling Lake Pichola", "Untying the shikaras", "Flying the kites", "Waking the builders"];
    let p = 0;
    const iv = setInterval(() => {
      p = Math.min(100, p + Math.random() * 9 + 3);
      $("#loaderPct").textContent = Math.floor(p);
      $("#loaderMsg").textContent = msgs[Math.min(msgs.length - 1, Math.floor(p / 21))];
      if (p >= 100) { clearInterval(iv); setTimeout(done, 250); }
    }, 70);
    $("#loaderSkip").onclick = () => { clearInterval(iv); done(); };
  })();

  /* ---------- theme ---------- */
  const root = document.documentElement;
  const mqDark = matchMedia("(prefers-color-scheme: dark)");
  function applyTheme(t) {
    root.dataset.theme = t;
    const dark = t === "dark" || (t === "auto" && mqDark.matches);
    document.body.dataset.dark = dark ? "1" : "0";
  }
  applyTheme(store.get("theme", "auto"));
  mqDark.addEventListener?.("change", () => applyTheme(root.dataset.theme));
  function toggleTheme() {
    const next = document.body.dataset.dark === "1" ? "light" : "dark";
    store.set("theme", next); applyTheme(next);
  }
  $("#themeBtn").onclick = toggleTheme;
  $("#mmTheme").onclick = toggleTheme;

  /* ---------- nav ---------- */
  const nav = $("#nav");
  const onScrollNav = () => nav.classList.toggle("scrolled", scrollY > 30);
  addEventListener("scroll", onScrollNav, { passive: true }); onScrollNav();
  const menu = $("#mobileMenu"), menuBtn = $("#menuBtn");
  menuBtn.onclick = () => { menu.hidden = !menu.hidden; menuBtn.setAttribute("aria-expanded", String(!menu.hidden)); };
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) { menu.hidden = true; menuBtn.setAttribute("aria-expanded", "false"); } });
  const navMap = new Map($$(".nav-links a").map((a) => [a.getAttribute("href").slice(1), a]));
  const navIO = new IntersectionObserver((ents) => ents.forEach((en) => {
    if (en.isIntersecting) { navMap.forEach((a) => a.classList.remove("active")); navMap.get(en.target.id)?.classList.add("active"); }
  }), { rootMargin: "-45% 0px -50% 0px" });
  navMap.forEach((_, id) => { const s = document.getElementById(id); if (s) navIO.observe(s); });

  /* ---------- reveal on scroll ---------- */
  const revealIO = new IntersectionObserver((ents) => ents.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("in"); revealIO.unobserve(en.target); }
  }), { rootMargin: "0px 0px -10% 0px" });
  const observeReveal = () => $$(".reveal:not(.in)").forEach((e) => { if (!e.closest(".hero")) revealIO.observe(e); });

  /* ---------- hero: live Udaipur sky ---------- */
  const heroEl = $("#top");
  const hero = UdaipurScene.build($("#heroScene"), { seed: 11, lotus: 0, lotusX: 1250 });
  const paintSky = (hr) => { const r = hero.setHour(hr); heroEl.dataset.sky = r.lum < 0.5 ? "dark" : "light"; };
  let scrubbing = false;
  const scrub = $("#skyScrub");
  function moodFor(hr) {
    if (hr < 5) return "Palace lit gold, the lake asleep";
    if (hr < 7.5) return "Mist and aarti at Gangaur Ghat";
    if (hr < 11) return "Shikaras heading out to Jag Mandir";
    if (hr < 16) return "Kites over the Old City rooftops";
    if (hr < 18.2) return "Golden hour on the Sajjangarh ridge";
    if (hr < 19.3) return "Sunset, and the palace lights up";
    return "Diyas on Pichola, fireworks overhead";
  }
  function tickClock() {
    const hr = istHour();
    $("#udrClock").textContent = hhmm(hr) + " IST";
    $("#udrMood").textContent = moodFor(hr);
    if (!scrubbing) { paintSky(hr); scrub.value = hr.toFixed(2); }
  }
  tickClock(); setInterval(tickClock, 20000);
  scrub.addEventListener("input", () => {
    scrubbing = true;
    const v = +scrub.value;
    paintSky(v);
    $("#udrMood").textContent = `${hhmm(v)} · ${moodFor(v)}`;
  });
  $("#skyLive").onclick = () => { scrubbing = false; tickClock(); };

  // Depth: the hills, palace and lake drift with the pointer
  if (!reduced && matchMedia("(pointer: fine)").matches) {
    let px = 0, py = 0, pending = false;
    heroEl.addEventListener("pointermove", (e) => {
      px = (e.clientX / innerWidth - 0.5) * -2; py = (e.clientY / innerHeight - 0.5) * -2;
      if (!pending) { pending = true; requestAnimationFrame(() => { pending = false; hero.parallax(px, py); }); }
    });
    heroEl.addEventListener("pointerleave", () => hero.parallax(0, 0));
  }

  // Patang-baazi: tap a kite to cut it loose
  $("#heroScene").addEventListener("click", (e) => {
    const k = e.target.closest(".kite");
    if (!k || k.classList.contains("cut")) return;
    k.style.setProperty("--kx", (Math.random() < 0.5 ? -1 : 1) * (160 + Math.random() * 200) + "px");
    k.classList.add("cut");
    const cut = $$(".kite.cut", hero.svg).length;
    toast(`<span lang="hi">वो काटा!</span> Kite cut · <b>${cut}/5</b>`);
    setTimeout(() => k.classList.remove("cut"), 9000);
  });

  // Toran: festive bunting of Google-colour pennants and marigolds
  function drawToran() {
    const el = $("#toran"), w = el.clientWidth || innerWidth, seg = 240, n = Math.ceil(w / 26);
    const y = (x) => 6 + 14 * Math.sin((Math.PI * (x % seg)) / seg);
    const cols = ["var(--blue)", "var(--green)", "var(--yellow)", "var(--red)"];
    let d = "M0 6", items = "";
    for (let x = 0; x <= w; x += 8) d += `L${x} ${y(x).toFixed(1)}`;
    for (let i = 0; i < n; i++) {
      const x = i * 26 + 13, top = y(x);
      if (i % 5 === 4) items += `<g class="marigold" style="animation-delay:${(-i * 0.3).toFixed(1)}s"><circle cx="${x}" cy="${top + 7}" r="5" fill="#f28c28"/><circle cx="${x}" cy="${top + 16}" r="4.5" fill="#f9ab00"/><circle cx="${x}" cy="${top + 24}" r="4" fill="#f28c28"/></g>`;
      else items += `<path class="pennant" style="animation-delay:${(-i * 0.37).toFixed(1)}s" d="M${x - 9} ${top.toFixed(1)}L${x + 9} ${top.toFixed(1)}L${x} ${(top + 26).toFixed(1)}Z" fill="${cols[i % 4]}"/>`;
    }
    el.innerHTML = `<svg viewBox="0 0 ${w} 70" preserveAspectRatio="none"><path class="string" d="${d}"/>${items}</svg>`;
  }
  drawToran();
  let toranT; addEventListener("resize", () => { clearTimeout(toranT); toranT = setTimeout(drawToran, 200); });

  // Scroll progress
  const prog = $("#progress i");
  const onProg = () => { const m = document.documentElement.scrollHeight - innerHeight; prog.style.transform = `scaleX(${m > 0 ? scrollY / m : 0})`; };
  addEventListener("scroll", onProg, { passive: true }); onProg();

  /* ---------- countdown ---------- */
  function tickCountdown() {
    const now = Date.now();
    let diff = Math.max(0, START - now);
    const d = Math.floor(diff / 864e5); diff -= d * 864e5;
    const hh = Math.floor(diff / 36e5); diff -= hh * 36e5;
    const m = Math.floor(diff / 6e4); diff -= m * 6e4;
    const s = Math.floor(diff / 1e3);
    const vals = { d, h: hh, m, s };
    $$("[data-countdown]").forEach((c) => {
      if (now >= START && now <= END) { c.innerHTML = `<span><b>Happening now</b></span>`; return; }
      if (now > END) { c.innerHTML = `<span><b>See you next year</b></span>`; return; }
      $$("[data-u]", c).forEach((b) => (b.textContent = String(vals[b.dataset.u]).padStart(2, "0")));
    });
  }
  tickCountdown(); setInterval(tickCountdown, 1000);

  /* ---------- calendar ---------- */
  const utc = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const eventLoc = D.venue.confirmed ? `${D.venue.name}, ${D.venue.area}` : D.venue.area;
  const gcal = (title, s, e, details, loc = eventLoc) =>
    `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${utc(s)}/${utc(e)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(loc)}`;
  const icsEsc = (s) => String(s).replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
  function ics(events, filename) {
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//GDG Cloud Udaipur//CCD Udaipur 2026//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH"];
    events.forEach((ev) => {
      lines.push("BEGIN:VEVENT", `UID:${ev.uid}@ccd-udaipur`, `DTSTAMP:${utc(new Date())}`, `DTSTART:${utc(ev.start)}`, `DTEND:${utc(ev.end)}`,
        `SUMMARY:${icsEsc(ev.title)}`, `DESCRIPTION:${icsEsc(ev.desc || "")}`, `LOCATION:${icsEsc(ev.loc || eventLoc)}`, "END:VEVENT");
    });
    lines.push("END:VCALENDAR");
    const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const a = h("a", { href: URL.createObjectURL(blob), download: filename });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }
  const mainDesc = `${D.event.name}. ${D.event.tagline} Register: ${D.links.register}`;
  $("#gcalLink").href = gcal(D.event.name, START, END, mainDesc);
  const addEventIcs = () => ics([{ uid: "ccd-main", start: START, end: END, title: D.event.name, desc: mainDesc }], "ccd-udaipur-2026.ics");
  $("#icsEvent").onclick = () => { addEventIcs(); $("#calMenu").hidden = true; };
  $("#addCal").onclick = (e) => { e.stopPropagation(); $("#calMenu").hidden = !$("#calMenu").hidden; };
  document.addEventListener("click", (e) => { if (!e.target.closest(".cal-menu")) $("#calMenu").hidden = true; });

  /* ---------- marquee ---------- */
  (function marquee() {
    const shapes = ["spark", "half", "flower", "star"];
    const big = ["Learn it", "Build it", "Ship it", "Celebrate it"];
    const small = ["Gemini", "AI agents", "Cloud Run", "BigQuery", "Firebase", "GKE", "Security", "ADK", "Community", "खम्मा घणी"];
    const mk = (arr, useShapes) => arr.map((t, i) => `<span>${useShapes ? `<svg><use href="#i-${shapes[i % 4]}"/></svg>` : "✦"} ${t.match(/[ऀ-ॿ]/) ? `<em class="deva">${t}</em>` : t}</span>`).join("");
    $("#mq1").innerHTML = mk([...big, ...big, ...big], true).repeat(2);
    $("#mq2").innerHTML = mk([...small, ...small], false).repeat(2);
  })();

  /* ---------- story (scroll-driven day) ---------- */
  const storyEl = $("#story");
  const story = UdaipurScene.build($("#storyScene"), { seed: 5, lotus: 1, lotusX: 360 });
  const chapters = $$(".chapter", storyEl);
  const hours = chapters.map((c) => +c.dataset.hour);
  story.setHour(hours[0]);
  let storyTick = false;
  function onStory() {
    storyTick = false;
    const vh = innerHeight;
    const top = storyEl.getBoundingClientRect().top;
    const f = Math.max(0, Math.min(chapters.length - 1, -top / vh));
    const i = Math.min(chapters.length - 2, Math.floor(f));
    const hr = hours[i] + (hours[i + 1] - hours[i]) * (f - i);
    story.setHour(hr);
    $("#storyClock").textContent = hhmm(hr);
    $("#storyBar").style.width = (f / (chapters.length - 1)) * 100 + "%";
  }
  addEventListener("scroll", () => { if (!storyTick) { storyTick = true; requestAnimationFrame(onStory); } }, { passive: true });
  onStory();
  const chIO = new IntersectionObserver((ents) => ents.forEach((en) => en.target.classList.toggle("in", en.isIntersecting)), { threshold: 0.35 });
  chapters.forEach((c) => chIO.observe(c));

  /* ---------- journey & stats ---------- */
  const shapeFor = { blue: "spark", green: "half", yellow: "flower", red: "star" };
  $("#journeyList").innerHTML = D.journey.map((j, i) => `
    <li class="reveal ${j.done ? "done" : ""} ${i === D.journey.length - 1 ? "final" : ""}" style="transition-delay:${i * 90}ms">
      <div class="j-dot"><svg><use href="#i-${shapeFor[j.color]}"/></svg></div>
      <span class="j-when">${esc(j.when)}</span>
      <h3>${esc(j.title)}</h3><span class="j-place">${esc(j.place)}</span>
      <p>${esc(j.text)}</p>
    </li>`).join("");
  $("#stats").innerHTML = D.stats.map((s) => `<div class="stat reveal"><b data-count="${s.value}" data-suffix="${esc(s.suffix)}">0</b><span>${esc(s.label)}</span></div>`).join("");
  const countIO = new IntersectionObserver((ents) => ents.forEach((en) => {
    if (!en.isIntersecting) return;
    const b = en.target, target = +b.dataset.count, suf = b.dataset.suffix, t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / 1400), e = 1 - Math.pow(1 - p, 3);
      b.textContent = Math.round(target * e).toLocaleString("en-IN") + suf;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step); countIO.unobserve(b);
    setTimeout(() => (b.textContent = target.toLocaleString("en-IN") + suf), 1600); // in case rAF is throttled
  }), { threshold: 0.6 });
  $$("[data-count]").forEach((b) => countIO.observe(b));

  /* ---------- formats ---------- */
  $("#formatsGrid").innerHTML = D.formats.map((f, i) => `
    <div class="format reveal" style="transition-delay:${(i % 3) * 80}ms"><span class="num">0${i + 1}</span>
      <svg><use href="#i-${f.icon}"/></svg><h3>${esc(f.title)}</h3><p>${esc(f.text)}</p></div>`).join("");

  /* ---------- agenda ---------- */
  const speakersById = Object.fromEntries(D.speakers.map((s) => [s.id, s]));
  let stars = new Set(store.get("stars", []));
  let track = "any", onlyMine = false, query = "";
  const filters = $("#trackFilters");
  filters.innerHTML = `<button class="chip" role="tab" aria-selected="true" data-track="any">All tracks</button>` +
    Object.entries(D.tracks).map(([k, t]) => `<button class="chip" role="tab" aria-selected="false" data-track="${k}" style="--c:${colorVar(t.color)}"><i></i>${esc(t.label)}</button>`).join("");
  filters.addEventListener("click", (e) => {
    const b = e.target.closest("[data-track]"); if (!b) return;
    track = b.dataset.track;
    $$("[data-track]", filters).forEach((x) => x.setAttribute("aria-selected", String(x === b)));
    renderAgenda();
  });
  $("#onlyMine").addEventListener("change", (e) => { onlyMine = e.target.checked; renderAgenda(); });
  $("#agendaSearch").addEventListener("input", (e) => { query = e.target.value.trim().toLowerCase(); renderAgenda(); });

  function speakerLabel(s) {
    const sp = speakersById[s.speaker];
    if (!sp) return "";
    return sp.name ? esc(sp.name) : `Sealed · ${esc(sp.hint)}`;
  }
  function renderAgenda() {
    const now = Date.now();
    const list = D.agenda.filter((s) =>
      (track === "any" || s.track === track || s.track === "all") &&
      (!onlyMine || stars.has(s.id)) &&
      (!query || (s.title + " " + s.desc + " " + (D.tracks[s.track]?.label || "")).toLowerCase().includes(query)));
    const groups = {};
    list.forEach((s) => (groups[s.start] = groups[s.start] || []).push(s));
    $("#agendaList").innerHTML = Object.keys(groups).sort().map((t) => `
      <div class="slot"><div class="slot-time">${t}<small>IST</small></div><div class="slot-items">
      ${groups[t].map((s) => {
        const tr = D.tracks[s.track];
        const live = now >= at(s.start) && now < at(s.end);
        const on = stars.has(s.id);
        return `<article class="session ${live ? "now" : ""}" id="session-${s.id}" style="--c:${colorVar(tr.color)}">
          <div class="s-meta"><span class="t">${esc(tr.label)}</span><span>${s.start}–${s.end}</span><span>${esc(s.room)}</span>${s.level ? `<span>${esc(s.level)}</span>` : ""}</div>
          <h3>${esc(s.title)}</h3><p>${esc(s.desc)}</p>
          <div class="s-foot">${s.speaker ? `<button data-speaker="${s.speaker}">${speakerLabel(s)}</button>` : ""}<button data-cal="${s.id}">+ Calendar</button></div>
          <button class="star-btn" data-star="${s.id}" aria-pressed="${on}" aria-label="${on ? "Remove from" : "Add to"} my agenda: ${esc(s.title)}">${on ? "★" : "☆"}</button>
        </article>`;
      }).join("")}</div></div>`).join("");
    $("#agendaEmpty").hidden = list.length > 0;
    $("#myCount").textContent = stars.size;
  }
  $("#agendaList").addEventListener("click", (e) => {
    const st = e.target.closest("[data-star]");
    if (st) {
      const id = st.dataset.star;
      stars.has(id) ? stars.delete(id) : stars.add(id);
      store.set("stars", [...stars]);
      renderAgenda();
      if (stars.has(id)) toast(`★ Added to <b>my agenda</b> · ${stars.size} saved`);
      return;
    }
    const cal = e.target.closest("[data-cal]");
    if (cal) { const s = D.agenda.find((x) => x.id === cal.dataset.cal); ics([sessionEvent(s)], `ccd-udaipur-${s.id}.ics`); return; }
    const sp = e.target.closest("[data-speaker]");
    if (sp) openSpeaker(sp.dataset.speaker);
  });
  const sessionEvent = (s) => ({ uid: s.id, start: at(s.start), end: at(s.end), title: `${s.title} · CCD Udaipur`, desc: s.desc, loc: `${s.room}, ${eventLoc}` });
  function exportMine() {
    if (!stars.size) { toast("Star a few sessions first, then export them."); document.getElementById("agenda").scrollIntoView(); return; }
    ics(D.agenda.filter((s) => stars.has(s.id)).map(sessionEvent), "my-ccd-udaipur-agenda.ics");
    toast(`Exported <b>${stars.size}</b> sessions to your calendar file`);
  }
  $("#exportMine").onclick = exportMine;
  const hasAgenda = D.agenda.length > 0;
  $("#agendaLive").hidden = !hasAgenda;
  $("#agendaTba").hidden = hasAgenda;
  if (hasAgenda) {
    $("#agendaTitle").innerHTML = "Plan <em>your day.</em>";
    $("#agendaLede").textContent = "Star the sessions you want and they're saved on this device. Export your picks to your calendar in one tap. On the day, this page shows what's live right now.";
    renderAgenda();
  }
  $("#tbaCal").onclick = () => { addEventIcs(); toast("Saved. <b>6 Dec 2026</b> is in your calendar file."); };
  $("#trackChips").innerHTML = Object.entries(D.tracks).filter(([k]) => k !== "all")
    .map(([, t]) => `<span class="chip" style="--c:${colorVar(t.color)}"><i></i>${esc(t.label)}</span>`).join("");

  // Live banner on the day
  function tickLive() {
    const now = Date.now();
    const b = $("#liveBanner");
    if (now < START - 36e5 || now > END) { b.hidden = true; return; }
    const cur = D.agenda.filter((s) => now >= at(s.start) && now < at(s.end));
    const next = D.agenda.find((s) => at(s.start) > now);
    b.hidden = false;
    b.innerHTML = cur.length ? `● Live now: <a href="#session-${cur[0].id}">${esc(cur[0].title)}</a>${cur.length > 1 ? ` +${cur.length - 1}` : ""}` :
      next ? `Up next at ${next.start}: <a href="#session-${next.id}">${esc(next.title)}</a>` : "";
  }
  tickLive(); setInterval(() => { tickLive(); if (hasAgenda) renderAgenda(); }, 60000);

  /* ---------- speakers: jharokha windows ---------- */
  const sealCols = ["blue", "green", "yellow", "red"];
  function speakerCard(s, i) {
    const c = s.seal || sealCols[i % 4];
    const inner = s.name && s.photo ? `<img src="${esc(s.photo)}" alt="${esc(s.name)}" loading="lazy">` : `<span class="jk-q">?</span>`;
    return `<button class="jk reveal ${s.name ? "revealed" : ""}" data-speaker="${esc(s.id)}" style="--c:${colorVar(c)};transition-delay:${(i % 4) * 70}ms">
      <div class="jk-frame"><div class="jk-window">${inner}</div><span class="jk-seal"><svg><use href="#i-${shapeFor[c] || "star"}"/></svg></span></div>
      <div class="jk-label">${s.name ? `<b>${esc(s.name)}</b><span>${esc([s.role, s.company].filter(Boolean).join(" · "))}</span>`
        : `<b>Revealing soon</b><span>Speaker ${String(i + 1).padStart(2, "0")}</span>`}</div></button>`;
  }
  const speakerList = D.speakers.length ? D.speakers
    : Array.from({ length: D.speakerSlots || 8 }, (_, i) => ({ id: "slot" + i, seal: sealCols[i % 4] }));
  speakerList.forEach((s) => (speakersById[s.id] = speakersById[s.id] || s));
  $("#speakerGrid").innerHTML = speakerList.map(speakerCard).join("") + `
    <a class="spk cfp reveal" data-link="cfp" href="${esc(D.links.cfp)}" target="_blank" rel="noopener">
      <svg style="width:44px;height:44px"><use href="#i-star"/></svg>
      <div><h3>Your window could be here.</h3><p>The call for speakers is open for talks, labs and lightning demos. First-time speakers welcome.</p></div>
      <span class="btn btn-light" style="margin-top:18px">Submit a session →</span></a>`;
  $("#speakerGrid").addEventListener("click", (e) => { const b = e.target.closest("button[data-speaker]"); if (b) openSpeaker(b.dataset.speaker); });
  function openSpeaker(id) {
    const s = speakersById[id]; if (!s) return;
    const sessions = D.agenda.filter((a) => a.speaker === id);
    const c = colorVar(s.seal || "red");
    const body = s.name
      ? `${s.photo ? `<img class="photo" style="width:120px;height:120px;border-radius:50%;object-fit:cover" src="${esc(s.photo)}" alt="">` : ""}
         <h3>${esc(s.name)}</h3><p class="muted">${esc([s.role, s.company].filter(Boolean).join(" · "))}</p><p style="margin-top:14px">${esc(s.bio || "")}</p>
         <p style="margin-top:14px">${Object.entries(s.links || {}).map(([k, v]) => `<a href="${esc(v)}" target="_blank" rel="noopener">${esc(k)}</a>`).join(" · ")}</p>`
      : `<div class="jk-seal" style="--c:${c};position:relative;left:auto;bottom:auto;transform:none;margin:0 auto;width:64px;height:64px"><svg style="width:32px;height:32px"><use href="#i-${shapeFor[s.seal] || "star"}"/></svg></div>
         <h3 style="text-align:center">Revealing soon</h3>
         <p style="text-align:center" class="muted">Speakers are announced over the coming weeks. Follow GDG Cloud Udaipur to hear the moment this window opens.</p>
         <p style="text-align:center;margin-top:18px"><a class="btn btn-dark btn-sm" href="${esc(D.links.community)}" target="_blank" rel="noopener">Get notified</a></p>`;
    $("#speakerModalBody").innerHTML = body + (sessions.length ? `<hr style="border:0;border-top:1px solid var(--line);margin:22px 0">
      ${sessions.map((a) => `<p><b>${esc(a.title)}</b><br><span class="muted">${a.start}–${a.end} · ${esc(a.room)}</span></p>`).join("<br>")}` : "");
    $("#speakerModal").showModal();
  }
  $("#speakerModal").addEventListener("click", (e) => { if (e.target.matches("[data-close], dialog")) e.currentTarget.close(); });

  /* ---------- Mewar × Google ---------- */
  const MW_ICONS = {
    lake: `<path d="M3 20c3-2 5-2 8 0s5 2 8 0 5-2 8 0M3 26c3-2 5-2 8 0s5 2 8 0 5-2 8 0"/><path d="M8 14h18V9l-3-3-3 3-3-4-3 4-3-3-3 3z"/><circle class="acc" cx="27" cy="5" r="2.5"/>`,
    boat: `<path d="M3 20q5 6 14 6t14-7q-7 2-14 2T3 20z"/><path d="M11 21v-9M23 21v-9"/><path class="acc" d="M8 12q9-6 18 0l-2 1.5q-7-4-14 0z"/><path d="M2 29h9M20 30h11"/>`,
    diya: `<path d="M6 21q11 8 22 0z"/><path class="acc" d="M17 6c4 4 4 8 0 11c-4-3-4-7 0-11z"/><path d="M3 29h28"/>`,
    puppet: `<path d="M17 2v6M11 2l3 8M23 2l-3 8"/><circle cx="17" cy="11" r="3"/><path class="acc" d="M12 15h10l3 11H9z"/><path d="M12 17l-4 5M22 17l4 5M14 26v5M20 26v5"/>`,
    ropeway: `<path d="M2 28L32 6"/><path d="M15 18.5v4"/><rect class="acc" x="11" y="22" width="9" height="7" rx="1.5"/><path d="M24 30l4-18 4 18"/>`,
    fort: `<path d="M3 30V14h4v-3h3v3h4v-3h3v3h4v-3h3v3h4v16z"/><path class="acc" d="M14 30v-7a3 3 0 0 1 6 0v7z"/><path d="M3 20h28"/>`,
  };
  $("#mewarGrid").innerHTML = D.mewar.map((m, i) => `
    <article class="mw reveal" style="--c:${colorVar(m.color)};transition-delay:${(i % 3) * 80}ms">
      <div class="mw-band"></div>
      <div class="mw-head"><span class="mw-icon"><svg viewBox="0 0 34 34">${MW_ICONS[m.icon] || ""}</svg></span><span class="mw-x">×</span><span class="mw-chip"><i></i>${esc(m.product)}</span></div>
      <h3>${esc(m.place)} <em>× ${esc(m.product)}</em></h3>
      <p>${esc(m.text)}</p>
    </article>`).join("");

  /* ---------- play tabs ---------- */
  const tabs = $$('[role="tab"]', $(".tabs"));
  function selectTab(id) {
    tabs.forEach((t) => {
      const on = t.id === id;
      t.setAttribute("aria-selected", String(on));
      $("#" + t.getAttribute("aria-controls")).hidden = !on;
    });
  }
  tabs.forEach((t) => t.addEventListener("click", () => selectTab(t.id)));
  $(".tabs").addEventListener("keydown", (e) => {
    const i = tabs.findIndex((t) => t.getAttribute("aria-selected") === "true");
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      const n = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
      selectTab(n.id); n.focus();
    }
  });

  /* ---------- Shahi Pass ---------- */
  const passForm = $("#passForm"), canvas = $("#passCanvas");
  let passId = null;
  const passData = () => {
    const f = new FormData(passForm);
    return { name: f.get("name") || "", persona: f.get("persona"), idea: f.get("idea") || "", date: fmt(START, { day: "numeric", month: "short" }), gold: hunt.found.size >= D.lakes.length };
  };
  const drawPass = async (final) => {
    const d = passData();
    if (!final && !d.name) d.name = "Your Name";
    passId = await ShahiPass.render(canvas, d);
  };
  passForm.addEventListener("input", () => drawPass(false));
  passForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    await drawPass(true);
    $("#passDownload").disabled = false; $("#passShare").disabled = false;
    toast(`Sealed. Your pass is <b>${passId}</b>`);
    confetti();
  });
  $("#passDownload").onclick = () => {
    const a = h("a", { href: canvas.toDataURL("image/png"), download: `shahi-pass-${passId}.png` });
    document.body.appendChild(a); a.click(); a.remove();
  };
  $("#passShare").onclick = async () => {
    const text = `I'm going to Cloud Community Days Udaipur 2026! ${D.links.register} #CCDUdaipur`;
    try {
      const blob = await new Promise((r) => canvas.toBlob(r, "image/png"));
      const file = new File([blob], `shahi-pass-${passId}.png`, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file], text }); return; }
      if (navigator.share) { await navigator.share({ text, url: location.href }); return; }
    } catch (e) { if (e.name === "AbortError") return; }
    await navigator.clipboard?.writeText(text);
    toast("Share text copied. Download the PNG and post it with #CCDUdaipur");
  };

  /* ---------- 30-minute hack ---------- */
  const pick = (a) => a[(Math.random() * a.length) | 0];
  let hackRolling = false;
  $("#hackRoll").onclick = () => {
    if (hackRolling) return;
    hackRolling = true;
    const card = $("#hackCard"); card.classList.add("rolling");
    let n = 0;
    const iv = setInterval(() => {
      const p = pick(D.hack.problems), t = pick(D.hack.tools), x = pick(D.hack.twists);
      $("#hkP").textContent = p; $("#hkT").textContent = t; $("#hkX").textContent = x;
      $("#hackText").innerHTML = `In 30 minutes, use <em>${esc(t)}</em> to ${esc(p)}.`;
      if (++n > (reduced ? 0 : 14)) { clearInterval(iv); card.classList.remove("rolling"); hackRolling = false; }
    }, 70);
  };
  const TOTAL = 30 * 60, CIRC = 2 * Math.PI * 52;
  let left = TOTAL, timerIv = null;
  function paintTimer() {
    $("#timerText").textContent = `${String(Math.floor(left / 60)).padStart(2, "0")}:${String(left % 60).padStart(2, "0")}`;
    const ring = $("#timerRing");
    ring.style.strokeDashoffset = String(CIRC * (1 - left / TOTAL));
    ring.style.stroke = left < 300 ? "var(--red)" : left < 600 ? "var(--yellow)" : "var(--green)";
  }
  $("#timerRing").style.strokeDasharray = String(CIRC);
  $("#hackStart").onclick = (e) => {
    const b = e.currentTarget;
    if (timerIv) { clearInterval(timerIv); timerIv = null; b.textContent = "Resume"; return; }
    if (left === 0) left = TOTAL;
    b.textContent = "Pause";
    timerIv = setInterval(() => {
      left = Math.max(0, left - 1); paintTimer();
      if (left === 0) { clearInterval(timerIv); timerIv = null; b.textContent = "Start 30:00"; toast("⏰ Time! Hands off the keyboard. Demo it."); confetti(); }
    }, 1000);
  };
  paintTimer();

  /* ---------- quiz ---------- */
  const quizEl = $("#quiz");
  let qi = 0, score = 0;
  function renderQ() {
    const q = D.quiz[qi];
    quizEl.innerHTML = `<div class="q-top"><span>Question ${qi + 1} / ${D.quiz.length}</span><span>Score ${score}</span></div>
      <div class="q-bar"><i style="width:${(qi / D.quiz.length) * 100}%"></i></div>
      <p class="q-text">${esc(q.q)}</p>
      <div class="q-opts">${q.o.map((o, i) => `<button class="q-opt" data-i="${i}"><b>${"ABCD"[i]}</b>${esc(o)}</button>`).join("")}</div>`;
  }
  function titleFor(s, n) {
    const r = s / n;
    if (r === 1) return ["Maharana of the Cloud", "Flawless. The lake bows to you."];
    if (r >= 0.8) return ["Keeper of Pichola", "Nearly perfect. Come defend your title at the live quiz."];
    if (r >= 0.5) return ["Boatman of Fateh Sagar", "Solid. A few sessions and you'll be steering the whole fleet."];
    return ["Chai-break Explorer", "Every builder starts somewhere. The Build Labs are made for you."];
  }
  function renderResult() {
    const best = Math.max(score, store.get("quizBest", 0));
    store.set("quizBest", best);
    const [t, l] = titleFor(score, D.quiz.length);
    quizEl.innerHTML = `<div class="q-result"><div class="score">${score}<span class="muted" style="font-size:40px">/${D.quiz.length}</span></div>
      <h3>${t}</h3><p class="muted">${l} Best on this device: ${best}.</p>
      <div class="cta-row center"><button class="btn btn-dark" id="qAgain">Play again</button><button class="btn btn-ghost" id="qShare">Share my score</button></div></div>`;
    if (score >= D.quiz.length * 0.8) confetti();
    $("#qAgain").onclick = () => { qi = 0; score = 0; D.quiz.sort(() => Math.random() - 0.5); renderQ(); };
    $("#qShare").onclick = async () => {
      const text = `I scored ${score}/${D.quiz.length} on Cloud Ka Sawaal and I'm "${t}" 🏰 Cloud Community Days Udaipur 2026 #CCDUdaipur`;
      try { if (navigator.share) { await navigator.share({ text, url: location.href }); return; } } catch (e) { if (e.name === "AbortError") return; }
      await navigator.clipboard?.writeText(text + " " + location.href);
      toast("Score copied to clipboard");
    };
  }
  quizEl.addEventListener("click", (e) => {
    const b = e.target.closest(".q-opt"); if (!b || b.disabled) return;
    const q = D.quiz[qi], i = +b.dataset.i;
    $$(".q-opt", quizEl).forEach((x) => (x.disabled = true));
    if (i === q.a) { b.classList.add("right"); score++; } else { b.classList.add("wrong"); $$(".q-opt", quizEl)[q.a].classList.add("right"); }
    setTimeout(() => { qi++; qi < D.quiz.length ? renderQ() : renderResult(); }, 950);
  });
  renderQ();

  /* ---------- explore ---------- */
  const kinds = [...new Set(D.explore.map((x) => x.kind))];
  const kindColor = { "Getting here": "blue", Eat: "red", See: "green", Stay: "yellow" };
  $("#exploreFilters").innerHTML = `<button class="chip on" data-kind="">Everything</button>` + kinds.map((k) => `<button class="chip" data-kind="${esc(k)}" style="--c:${colorVar(kindColor[k])}"><i></i>${esc(k)}</button>`).join("");
  $("#exploreGrid").innerHTML = D.explore.map((x, i) => `<div class="ex reveal" data-kind="${esc(x.kind)}" style="--c:${colorVar(kindColor[x.kind])}">
      <span class="kind">${esc(x.kind)}</span><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p>
      ${i === 7 ? `<svg class="egg lotus-egg mini" style="position:absolute;right:18px;bottom:16px" data-lake="4" tabindex="0" role="button" aria-label="A lotus"><use href="#i-lotus"/></svg>` : ""}</div>`).join("");
  $("#exploreFilters").addEventListener("click", (e) => {
    const b = e.target.closest("[data-kind]"); if (!b) return;
    $$("[data-kind]", $("#exploreFilters")).forEach((x) => x.classList.toggle("on", x === b));
    $$(".ex").forEach((c) => (c.hidden = !!b.dataset.kind && c.dataset.kind !== b.dataset.kind));
  });

  /* ---------- venue ---------- */
  const { lat, lng } = D.venue;
  const dz = D.venue.confirmed ? 0.008 : 0.04;
  $("#mapFrame").src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - dz * 1.4},${lat - dz},${lng + dz * 1.4},${lat + dz}&layer=mapnik${D.venue.confirmed ? `&marker=${lat},${lng}` : ""}`;
  $("#directions").href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(D.venue.confirmed ? `${D.venue.name}, ${D.venue.area}` : `${lat},${lng}`)}`;

  /* ---------- partners & team ---------- */
  $("#sponsorLogos").innerHTML = D.sponsors.map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener" title="${esc(s.name)} · ${esc(s.tier)}"><img src="${esc(s.logo)}" alt="${esc(s.name)}"></a>`).join("");
  $("#tiers").innerHTML = D.sponsorTiers.map((t) => {
    const taken = D.sponsors.filter((s) => s.tier === t.tier).length;
    return `<div class="tier reveal"><h3>${esc(t.tier)}</h3><span class="slots">${t.slots - taken} of ${t.slots} open</span>
      <ul>${t.perks.map((p) => `<li>${esc(p)}</li>`).join("")}</ul><div class="logo-slot"><span>your logo here</span></div></div>`;
  }).join("");
  $("#teamGrid").innerHTML = D.team.map((m) => `<a class="member" href="${esc(m.link || "#")}" target="_blank" rel="noopener">
      ${m.photo ? `<img src="${esc(m.photo)}" alt="" loading="lazy">` : ""}<b>${esc(m.name)}</b><span>${esc(m.role)}</span></a>`).join("");

  /* ---------- FAQ ---------- */
  $("#faqList").innerHTML = D.faq.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("");

  /* ---------- register scene ---------- */
  UdaipurScene.build($("#registerScene"), { seed: 3 }).setHour(20.3);

  /* ---------- share ---------- */
  $("#shareSite").onclick = async () => {
    const text = `${D.event.name}: ${D.event.tagline} Join me in the City of Lakes.`;
    try { if (navigator.share) { await navigator.share({ title: D.event.name, text, url: location.href }); return; } } catch (e) { if (e.name === "AbortError") return; }
    await navigator.clipboard?.writeText(`${text} ${location.href}`);
    toast("Link copied. Send it to your build buddy.");
  };

  /* ---------- seven lakes hunt ---------- */
  const hunt = { found: new Set(store.get("lakes", [])) };
  function paintHunt() {
    $("#huntRow").innerHTML = D.lakes.map((n, i) => `<span class="${hunt.found.has(i) ? "got" : ""}" title="${hunt.found.has(i) ? esc(n) : "?"}"><svg viewBox="-20 -24 40 32"><use href="#i-lotus"/></svg></span>`).join("");
    $("#huntCount").textContent = `${hunt.found.size}/${D.lakes.length}`;
    $$(".lotus-egg").forEach((e) => e.classList.toggle("found", hunt.found.has(+e.dataset.lake)));
    $("#goldNote").hidden = hunt.found.size < D.lakes.length;
  }
  function findLake(i) {
    if (hunt.found.has(i)) return;
    hunt.found.add(i); store.set("lakes", [...hunt.found]); paintHunt();
    if (hunt.found.size === D.lakes.length) {
      toast(`🪷 All seven lakes found! Your <b>Shahi Pass is now gold</b>.`, 5000); confetti(); drawPass(false);
    } else toast(`🪷 You found <b>${D.lakes[i]}</b> · ${hunt.found.size}/${D.lakes.length} lakes`);
  }
  document.addEventListener("click", (e) => { const l = e.target.closest(".lotus-egg"); if (l) findLake(+l.dataset.lake); });
  document.addEventListener("keydown", (e) => { const l = e.target.closest?.(".lotus-egg"); if (l && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); findLake(+l.dataset.lake); } });
  paintHunt();
  drawPass(false);

  /* ---------- command palette ---------- */
  const cmd = $("#cmd"), cmdIn = $("#cmdInput"), cmdList = $("#cmdList");
  const go = (id) => () => document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  const commands = [
    ...[["top", "Home"], ["story", "A day in Udaipur"], ["glory", "The glory of Mewar: Pratap & Chetak"], ["mewar", "Where Mewar meets Google"], ["places", "Iconic Udaipur"], ["dive", "Beneath the lake"], ["journey", "The road to CCD"], ["formats", "Formats"], ["agenda", "Agenda"], ["speakers", "Speakers"],
      ["play", "Play"], ["explore", "Explore Udaipur"], ["venue", "Venue & map"], ["partners", "Partners"], ["community", "Speak, volunteer, join"], ["faq", "FAQ"], ["register", "Register"]]
      .map(([id, label]) => ({ label, kind: "section", run: go(id) })),
    { label: "Buy tickets on KonfHub", kind: "action", run: () => open(D.links.tickets, "_blank", "noopener") },
    { label: "Open the GDG event page", kind: "action", run: () => open(D.links.event, "_blank", "noopener") },
    { label: "Add the event to my calendar", kind: "action", run: addEventIcs },
    { label: "Export my starred agenda", kind: "action", run: exportMine },
    { label: "Toggle day / night", kind: "action", run: toggleTheme },
    { label: "Make my Shahi Pass", kind: "play", run: () => { go("play")(); selectTab("tab-pass"); setTimeout(() => passForm.name.focus(), 500); } },
    { label: "Roll a 30-minute hack", kind: "play", run: () => { go("play")(); selectTab("tab-hack"); $("#hackRoll").click(); } },
    { label: "Play Cloud Ka Sawaal", kind: "play", run: () => { go("play")(); selectTab("tab-quiz"); } },
    { label: "Hint: where are the lotuses?", kind: "secret", run: () => toast("🪷 Look on the water, near a draft, in the city at night, by good questions and at the very bottom.", 5000) },
    ...D.agenda.map((s) => ({ label: s.title, kind: s.start, run: () => { go("session-" + s.id)(); const el = document.getElementById("session-" + s.id); el?.animate([{ boxShadow: "0 0 0 4px var(--yellow)" }, { boxShadow: "0 0 0 0 transparent" }], { duration: 1600 }); } })),
  ];
  let cmdSel = 0, cmdItems = [];
  function renderCmd() {
    const q = cmdIn.value.trim().toLowerCase();
    cmdItems = commands.filter((c) => !q || c.label.toLowerCase().includes(q) || c.kind.includes(q)).slice(0, 12);
    cmdSel = Math.min(cmdSel, Math.max(0, cmdItems.length - 1));
    cmdList.innerHTML = cmdItems.map((c, i) => `<li role="option" data-i="${i}" aria-selected="${i === cmdSel}"><span>${esc(c.label)}</span><small>${esc(c.kind)}</small></li>`).join("") || `<li>No match</li>`;
  }
  function openCmd() { cmdIn.value = ""; cmdSel = 0; renderCmd(); cmd.showModal(); cmdIn.focus(); }
  function runCmd(i) { const c = cmdItems[i]; if (!c) return; cmd.close(); c.run(); }
  $("#cmdBtn").onclick = openCmd;
  cmdIn.addEventListener("input", () => { cmdSel = 0; renderCmd(); });
  cmdIn.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { cmdSel = (cmdSel + 1) % cmdItems.length; renderCmd(); e.preventDefault(); }
    if (e.key === "ArrowUp") { cmdSel = (cmdSel - 1 + cmdItems.length) % cmdItems.length; renderCmd(); e.preventDefault(); }
    if (e.key === "Enter") runCmd(cmdSel);
  });
  cmdList.addEventListener("click", (e) => { const li = e.target.closest("[data-i]"); if (li) runCmd(+li.dataset.i); });
  cmd.addEventListener("click", (e) => { if (e.target === cmd) cmd.close(); });
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); cmd.open ? cmd.close() : openCmd(); }
    else if (e.key === "/" && !/input|textarea|select/i.test(document.activeElement.tagName) && !cmd.open) { e.preventDefault(); openCmd(); }
  });

  /* ---------- finish ---------- */
  observeReveal();
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol) && !/localhost|127\.0\.0\.1/.test(location.hostname)) {
    addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }
})();
