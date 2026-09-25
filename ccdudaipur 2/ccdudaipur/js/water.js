/* ==========================================================================
   City of Lakes: the whole site sits under a thin layer of water.
   - A WebGL caustics layer (light dancing on a lake bed) behind the page,
     with rings that spread from the cursor and from every click.
   - A stronger caustics layer inside "Beneath the lake".
   - Material-style ink ripples on every button.
   - Bubbles, fish and floating product orbs for the dive section.
   ========================================================================== */
(function () {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }`;
  const FRAG = `
    precision mediump float;
    uniform vec2 uRes; uniform float uTime; uniform vec3 uColor; uniform float uAlpha; uniform float uScale; uniform float uShift;
    uniform vec4 uRip[8];
    float wave(vec2 p, float t){
      return (sin(p.x*1.7 + t*1.1 + sin(p.y*1.3 + t*.7))
            + sin(p.y*2.1 - t*.9 + sin(p.x*1.9 - t*.6))
            + sin((p.x+p.y)*1.3 + t*.8)) / 3.;
    }
    void main(){
      vec2 frag = gl_FragCoord.xy;
      vec2 p = frag / uRes.y * uScale + vec2(0., uShift);
      float t = uTime * .55;
      float ring = 0.;
      for (int i = 0; i < 8; i++) {
        vec4 r = uRip[i];
        float age = uTime - r.z;
        if (age < 0. || age > 3.5 || r.w <= 0.) continue;
        vec2 d = (frag - r.xy) / uRes.y;
        float dist = length(d);
        float w = exp(-pow((dist - age * .32) * 26., 2.)) * exp(-age * 1.3) * r.w;
        ring += w;
        p += normalize(d + 1e-4) * w * .3;
      }
      float a = wave(p, t), b = wave(p * 1.6 + 3.1, t * 1.3);
      float c = pow(clamp(1. - abs(a - b) * 2.4, 0., 1.), 6.);
      float light = clamp(c * .95 + ring * .7, 0., 1.);
      gl_FragColor = vec4(uColor * light, light) * uAlpha;
    }`;

  function Caustics(canvas, opts) {
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, antialias: false, alpha: true });
    if (!gl) return null;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    const U = (n) => gl.getUniformLocation(prog, n);
    const u = { res: U("uRes"), time: U("uTime"), color: U("uColor"), alpha: U("uAlpha"), scale: U("uScale"), shift: U("uShift"), rip: U("uRip") };
    const rip = new Float32Array(32);
    let ri = 0, t0 = performance.now(), running = false, visible = true;
    const q = opts.quality || 0.5;
    const self = {
      color: opts.color, alpha: opts.alpha, scale: opts.scale || 6, shift: 0,
      resize() {
        const w = canvas.clientWidth, h = canvas.clientHeight;
        canvas.width = Math.max(1, Math.round(w * q)); canvas.height = Math.max(1, Math.round(h * q));
        gl.viewport(0, 0, canvas.width, canvas.height);
      },
      ripple(x, y, amp = 1) {
        const r = canvas.getBoundingClientRect();
        const now = (performance.now() - t0) / 1000;
        rip.set([(x - r.left) * q, (r.height - (y - r.top)) * q, now, amp], (ri++ % 8) * 4);
      },
      draw() {
        const time = (performance.now() - t0) / 1000;
        gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform2f(u.res, canvas.width, canvas.height);
        gl.uniform1f(u.time, reduced ? 3 : time);
        gl.uniform3fv(u.color, self.color);
        gl.uniform1f(u.alpha, self.alpha);
        gl.uniform1f(u.scale, self.scale);
        gl.uniform1f(u.shift, self.shift);
        gl.uniform4fv(u.rip, rip);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      },
      start() {
        if (running || reduced) { self.draw(); return; }
        running = true;
        const loop = () => { if (!running) return; if (visible && !document.hidden) self.draw(); requestAnimationFrame(loop); };
        requestAnimationFrame(loop);
      },
      stop() { running = false; },
      setVisible(v) { visible = v; },
    };
    self.resize();
    addEventListener("resize", self.resize);
    return self;
  }

  function isDark() { return document.body.dataset.dark === "1"; }

  function init() {
    /* ---- the lake under the whole page ---- */
    const bg = document.getElementById("causticsBg");
    let global = null;
    if (bg) {
      global = Caustics(bg, { color: [0.1, 0.45, 0.62], alpha: 0.16, scale: 5, quality: 0.5 });
      if (global) {
        const theme = () => {
          global.color = isDark() ? [0.45, 0.78, 1.0] : [0.08, 0.42, 0.6];
          global.alpha = isDark() ? 0.2 : 0.14;
        };
        theme();
        new MutationObserver(theme).observe(document.body, { attributes: true, attributeFilter: ["data-dark"] });
        addEventListener("scroll", () => { global.shift = scrollY * 0.0012; }, { passive: true });
        global.start();
      } else bg.remove();
    }

    /* ---- the lake bed in "Beneath the lake" ---- */
    const dc = document.getElementById("diveCaustics");
    let dive = null;
    if (dc) {
      dive = Caustics(dc, { color: [0.75, 0.95, 1.0], alpha: 0.55, scale: 4, quality: 0.5 });
      if (dive) {
        new IntersectionObserver(([en]) => { en.isIntersecting ? dive.start() : dive.stop(); }).observe(dc);
      } else dc.remove();
    }

    /* ---- cursor & click ripples ---- */
    let lx = -999, ly = -999, lt = 0;
    addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      const now = performance.now();
      if (now - lt < 90 || Math.hypot(e.clientX - lx, e.clientY - ly) < 40) return;
      lx = e.clientX; ly = e.clientY; lt = now;
      global && global.ripple(e.clientX, e.clientY, 0.45);
      dive && dive.ripple(e.clientX, e.clientY, 0.6);
    }, { passive: true });
    addEventListener("pointerdown", (e) => {
      global && global.ripple(e.clientX, e.clientY, 1.3);
      dive && dive.ripple(e.clientX, e.clientY, 1.4);
    }, { passive: true });

    /* ---- Material ink ripple on buttons ---- */
    document.addEventListener("pointerdown", (e) => {
      const b = e.target.closest(".btn, .chip, .tabs button, .q-opt, .orb");
      if (!b) return;
      const r = b.getBoundingClientRect();
      const s = document.createElement("span");
      const size = Math.max(r.width, r.height) * 2.2;
      s.className = "ink";
      s.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
      b.appendChild(s);
      setTimeout(() => s.remove(), 700);
    });

    /* ---- bubbles and fish for the dive ---- */
    const bub = document.getElementById("diveBubbles");
    if (bub) {
      let h = "";
      for (let i = 0; i < 38; i++) {
        const s = 4 + Math.random() * 18;
        h += `<i style="left:${(Math.random() * 100).toFixed(1)}%;width:${s.toFixed(0)}px;height:${s.toFixed(0)}px;animation-duration:${(7 + Math.random() * 10).toFixed(1)}s;animation-delay:${(-Math.random() * 14).toFixed(1)}s;--sway:${(Math.random() * 40 - 20).toFixed(0)}px"></i>`;
      }
      bub.innerHTML = h;
    }
    const fish = document.getElementById("diveFish");
    if (fish) {
      const colors = ["#f28c28", "#f9ab00", "#e9eef2", "#ea4335", "#9fd3e6"];
      let h = "";
      for (let i = 0; i < 9; i++) {
        const c = colors[i % colors.length], s = 0.6 + Math.random() * 0.9, rev = i % 3 === 0;
        h += `<svg class="fish${rev ? " rev" : ""}" viewBox="-40 -16 80 32" style="top:${(12 + Math.random() * 70).toFixed(0)}%;width:${(60 * s).toFixed(0)}px;animation-duration:${(18 + Math.random() * 20).toFixed(0)}s;animation-delay:${(-Math.random() * 30).toFixed(0)}s">
          <path d="M-30 0C-18 -14 10 -14 22 0C10 14 -18 14 -30 0Z" fill="${c}"/><path class="tail" d="M-28 0L-40 -11L-38 0L-40 11Z" fill="${c}"/>
          <path d="M-4 -10C0 -16 8 -16 10 -10Z" fill="${c}" opacity=".7"/><circle cx="12" cy="-3" r="2.4" fill="#0b1c2c"/><path d="M4 -8C6 -3 6 3 4 8" stroke="rgba(0,0,0,.2)" fill="none"/></svg>`;
      }
      fish.innerHTML = h;
    }

    window.CityOfLakes = { global, dive };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
