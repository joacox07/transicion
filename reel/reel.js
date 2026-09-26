/* Misión Rosario · Reel vertical 1080x1920
 * Toda la animación es una función pura del tiempo: render(t).
 * Así cada cuadro se puede renderizar de forma determinista (render.mjs) o previsualizar en vivo.
 */
(() => {
  const DURATION = 45;
  const FPS = 30;

  // ------------------------------------------------------------------ utilidades
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const prog = (t, a, b) => clamp((t - a) / (b - a));
  const E = {
    lin: x => x,
    outQuad: x => 1 - (1 - x) * (1 - x),
    outCubic: x => 1 - Math.pow(1 - x, 3),
    inCubic: x => x * x * x,
    inOutCubic: x => (x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
    inOutSine: x => -(Math.cos(Math.PI * x) - 1) / 2,
    outExpo: x => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x)),
    outBack: (x, s = 1.55) => 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2),
  };
  /** opacidad con entrada y salida */
  const win = (t, a, b, fi = .4, fo = .4) => Math.min(E.inOutSine(prog(t, a, a + fi)), 1 - E.inOutSine(prog(t, b - fo, b)));
  const set = (el, o) => { for (const k in o) el.style[k] = o[k]; };
  const show = (el, op) => { el.style.opacity = op; el.style.visibility = op <= 0.001 ? 'hidden' : 'visible'; };

  // ------------------------------------------------------------------ texto palabra por palabra
  function buildLines(el) {
    const lines = el.dataset.lines.split('|');
    let em = false;
    el.innerHTML = lines.map(line => line.split(' ').map(tok => {
      const open = tok.startsWith('*'); const close = tok.endsWith('*');
      if (open) em = true;
      const word = tok.replace(/\*/g, '');
      const html = em ? `<em class="w">${word}</em>` : `<span class="w">${word}</span>`;
      if (close) em = false;
      return html;
    }).join(' ')).join('<br>');
    el._w = $$('.w', el);
  }
  function words(el, t, start, { stagger = .1, dur = .55, dy = 34, blur = 8, ease = E.outCubic } = {}) {
    el._w.forEach((w, i) => {
      const p = ease(prog(t, start + i * stagger, start + i * stagger + dur));
      w.style.opacity = p;
      w.style.transform = `translateY(${(1 - p) * dy}px)`;
      w.style.filter = p < 1 ? `blur(${(1 - p) * blur}px)` : 'none';
    });
  }
  function fadeUp(el, t, start, dur = .5, dy = 24) {
    const p = E.outCubic(prog(t, start, start + dur));
    el.style.opacity = p; el.style.transform = `translateY(${(1 - p) * dy}px)`;
    return p;
  }

  // ------------------------------------------------------------------ misterios (S5)
  const MYST = [
    { k: 'goz', name: 'Misterios Gozosos', days: 'lunes y sábados', color: 'var(--goz)', tint: '63,120,192',
      cap: 'Una *imagen* para contemplar', hl: [.03, .21, .97, .765] },
    { k: 'lum', name: 'Misterios Luminosos', days: 'jueves', color: 'var(--lum)', tint: '95,132,102',
      cap: 'El *Evangelio* de cada misterio', hl: [.035, .84, .965, .985] },
    { k: 'dol', name: 'Misterios Dolorosos', days: 'martes y viernes', color: 'var(--dol)', tint: '163,58,53',
      cap: 'Una *oración breve*|para rezar en familia', hl: [.035, .762, .965, .84] },
    { k: 'glo', name: 'Misterios Gloriosos', days: 'miércoles y domingos', color: 'var(--glo)', tint: '168,132,58',
      cap: 'Una *Palabra* para guardar|en el corazón', hl: [.035, .163, .965, .232] },
  ];
  const T5 = 15, SLOT = 2.5;

  function buildMysteries() {
    const s5 = $('#s5');
    MYST.forEach((m, i) => {
      $('#tint-' + m.k).style.background =
        `radial-gradient(ellipse 90% 60% at 50% 45%, rgba(${m.tint},.34), rgba(${m.tint},.10) 60%, rgba(${m.tint},0) 100%)`;
      const g = document.createElement('div');
      g.className = 'layer'; g.id = 'm-' + m.k;
      const [x0, y0, x1, y1] = m.hl.map((v, j) => v * (j % 2 ? 914 : 640));
      const r = 26;
      g.innerHTML = `
        <div class="m-pill"><span style="background:${m.color}">${m.name.toUpperCase()}</span></div>
        <div class="m-days">${m.days}</div>
        <div class="card m-card"><img src="assets/cut/card-${m.k}.jpg" alt=""><div class="sheen"></div>
          <svg class="hl" viewBox="0 0 640 914">
            <path class="dim" fill="rgba(25,15,5,.42)" fill-rule="evenodd"
              d="M0 0H640V914H0Z M${x0 + r} ${y0} H${x1 - r} Q${x1} ${y0} ${x1} ${y0 + r} V${y1 - r} Q${x1} ${y1} ${x1 - r} ${y1} H${x0 + r} Q${x0} ${y1} ${x0} ${y1 - r} V${y0 + r} Q${x0} ${y0} ${x0 + r} ${y0} Z"/>
            <rect class="ring" x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" rx="${r}" fill="none"
              stroke="#f2d38c" stroke-width="7" style="filter:drop-shadow(0 0 8px rgba(255,215,130,.9))"/>
          </svg></div>
        <div class="m-cap" data-lines="${m.cap}"></div>`;
      s5.appendChild(g);
      m.el = g; m.pill = $('.m-pill span', g); m.daysEl = $('.m-days', g); m.card = $('.card', g);
      m.sheen = $('.sheen', g); m.dim = $('.dim', g); m.ring = $('.ring', g); m.cap = $('.m-cap', g);
      m.tintEl = $('#tint-' + m.k);
      buildLines(m.cap);
      const len = 2 * ((x1 - x0) + (y1 - y0));
      m.ringLen = len; m.ring.style.strokeDasharray = `${len} ${len}`;
    });
  }

  function renderMystery(m, i, t) {
    const T0 = T5 + i * SLOT; const u = t - T0;
    const vis = u > -0.3 && u < SLOT + 0.35;
    m.el.style.visibility = vis ? 'visible' : 'hidden';
    m.tintEl.style.opacity = win(t, T0 - .25, T0 + SLOT + .25, .5, .5);
    if (!vis) return;
    // píldora + días
    const pin = E.outBack(prog(u, 0, .45)); const pout = E.inCubic(prog(u, SLOT - .3, SLOT));
    set(m.pill, { opacity: Math.min(prog(u, 0, .25), 1 - pout), transform: `scale(${lerp(.7, 1, pin)}) translateY(${-pout * 20}px)` });
    set(m.daysEl, { opacity: Math.min(prog(u, .2, .5), 1 - pout), transform: `translateY(${(1 - E.outCubic(prog(u, .2, .6))) * 14}px)` });
    // carta
    const ein = E.outCubic(prog(u, -.2, .55));
    const eout = E.inCubic(prog(u, SLOT - .3, SLOT + .3));
    const hold = prog(u, .55, SLOT - .3);
    const x = lerp(860, 0, ein) - eout * 980;
    const y = (1 - ein) * 60 + eout * 40;
    const rz = lerp(14, -1.4, ein) + hold * 2.4 - eout * 16;
    const ry = lerp(-28, 0, ein) + eout * 18;
    const sc = 1 + hold * .025;
    set(m.card, { transform: `perspective(2200px) translate(${x}px,${y}px) rotateY(${ry}deg) rotate(${rz}deg) scale(${sc})` });
    m.sheen.style.backgroundPosition = `${lerp(120, -60, prog(u, .1, 1.1))}% 0`;
    // resaltado
    const hp = E.inOutCubic(prog(u, .7, 1.25));
    m.ring.style.strokeDashoffset = m.ringLen * (1 - hp);
    m.ring.style.opacity = Math.min(prog(u, .7, .8), 1 - prog(u, SLOT - .45, SLOT - .25));
    m.dim.style.opacity = E.inOutSine(prog(u, .75, 1.2)) * (1 - prog(u, SLOT - .45, SLOT - .25));
    // leyenda
    words(m.cap, t, T0 + .75, { stagger: .07, dur: .45, dy: 26, blur: 6 });
    m.cap.style.opacity = 1 - pout;
  }

  // ------------------------------------------------------------------ polvo dorado
  function mulberry32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const rnd = mulberry32(20260926);
  const DUST = Array.from({ length: 90 }, () => ({
    x: rnd() * 1080, y: rnd() * 2100, sp: 18 + rnd() * 55, amp: 8 + rnd() * 30, f: .2 + rnd() * .6,
    ph: rnd() * 6.28, r: 1.2 + Math.pow(rnd(), 3) * 5.5, tw: .6 + rnd() * 2.2,
  }));
  let dctx;
  function renderDust(t, amount, mode) {
    dctx.clearRect(0, 0, 1080, 1920);
    if (amount <= 0) return;
    dctx.globalCompositeOperation = mode;
    for (const p of DUST) {
      const y = ((p.y - t * p.sp) % 2100 + 2100) % 2100 - 90;
      const x = p.x + Math.sin(t * p.f + p.ph) * p.amp;
      const a = amount * (.35 + .65 * (.5 + .5 * Math.sin(t * p.tw + p.ph)));
      const R = p.r * 3.2;
      const g = dctx.createRadialGradient(x, y, 0, x, y, R);
      g.addColorStop(0, `rgba(255,236,180,${a})`);
      g.addColorStop(.35, `rgba(240,200,110,${a * .55})`);
      g.addColorStop(1, 'rgba(240,200,110,0)');
      dctx.fillStyle = g; dctx.beginPath(); dctx.arc(x, y, R, 0, 6.2832); dctx.fill();
    }
  }

  // ------------------------------------------------------------------ init
  let S = {};
  function init() {
    $$('[data-lines]').forEach(buildLines);
    buildMysteries();
    dctx = $('#dust').getContext('2d');
    S = {
      s1: $('#s1'), s2: $('#s2'), s3: $('#s3'), s4: $('#s4'), s5: $('#s5'), s6: $('#s6'), s7: $('#s7'), s8: $('#s8'), s9: $('#s9'),
      art: $('#s1-art'), s1k: $('#s1-kicker'), s1t: $('#s1-title'),
      logo: $('#s2-logo'), lText: $('#s2-logo .text'), lRos: $('#s2-rosary-mask'), s2line: [$('#s2-line-l'), $('#s2-line-r')],
      s2cross: $('#s2-crossmark'), s2tag: $('#s2-tag'),
      s3k: $('#s3-kicker'), s3t: $('#s3-title'), boxScene: $('#box-scene'), box: $('#box'), floor: $('#box-floor'),
      fShade: $('.f-front .shade'), rShade: $('.f-right .shade'), lShade: $('.f-left .shade'), tShade: $('.f-top .shade'), glint: $('.f-front .glint'),
      s4k: $('#s4-kicker'), s4t: $('#s4-title'), fan: $$('#fan .card'), chips: $$('#s4-chips .chip'),
      s6k: $('#s6-kicker'), s6t: $('#s6-title'), cPorq: $('#c-porq'), cLet: $('#c-let'), bubble: $('#bubble'),
      s7k: $('#s7-kicker'), s7t: $('#s7-title'), photo: $('#photo'), ph1: $('#ph1'), ph2: $('#ph2'),
      ph1i: $('#ph1 img'), ph2i: $('#ph2 img'), pc1: $('#pchip1'), pc2: $('#pchip2'),
      s8k: $('#s8-kicker'), s8logo: $('#s8-logo'), s8line: $('#s8-line'), s8t: $('#s8-title'),
      rays: $('#rays'), ctaBox: $('#cta-box'), ctaGlint: $('#cta-box .glint'), ctaPre: $('#cta-pre'), ctaUrl: $('#cta-url span'),
      ctaLogos: $('#cta-logos'), ctaEnd: $('#cta-end'),
      glow: $('#glow'), flash: $('#flash'), vignette: $('#vignette'),
    };
    // guías de zona segura
    if (location.search.includes('guides')) document.body.classList.add('guides');
    S.s2line.forEach(p => { const L = p.getTotalLength(); p.style.strokeDasharray = `${L} ${L}`; p._L = L; });
  }

  // ------------------------------------------------------------------ render(t)
  function render(t) {
    // ================= S1 · gancho (0 – 3.75)
    {
      const vis = t < 4.3; S.s1.style.visibility = vis ? 'visible' : 'hidden';
      if (vis) {
        const e = E.outQuad(prog(t, 0, 4.2));
        const s = lerp(1.5, 1.06, e), fx = 1087, fy = 564, X = 540, Y = lerp(700, 590, e);
        set(S.art, {
          transform: `translate(${X - fx * s}px,${Y - fy * s}px) scale(${s})`,
          filter: `blur(${lerp(7, 0, E.outCubic(prog(t, 0, .8)))}px) brightness(${lerp(.8, 1, prog(t, 0, 1))}) saturate(1.05)`,
        });
        const k = E.outCubic(prog(t, .3, 1));
        set(S.s1k, { opacity: k * (1 - prog(t, 3.1, 3.5)), letterSpacing: `${lerp(.55, .28, k)}em` });
        words(S.s1t, t, .5, { stagger: .14, dur: .6, dy: 44, blur: 12 });
        const out = E.inCubic(prog(t, 3.05, 3.6));
        set(S.s1t, { opacity: 1 - out, transform: `translateY(${-out * 40}px)` });
        // iris que abre hacia el papel
        const r = E.inOutCubic(prog(t, 3.3, 4.2)) * 1600 - 260;
        const m = t > 3.3 ? `radial-gradient(circle at 540px 860px, transparent ${Math.max(r, 0)}px, #000 ${Math.max(r, 0) + 260}px)` : 'none';
        S.s1.style.webkitMaskImage = m; S.s1.style.maskImage = m;
      }
    }

    // ================= S2 · logo + frase (3.75 – 8.75)
    {
      const op = t < 8 ? (t > 3.3 ? 1 : 0) : 1 - E.inOutSine(prog(t, 8.35, 8.85));
      show(S.s2, op);
      if (op > 0) {
        const outS = prog(t, 8.35, 8.85);
        S.s2.style.transform = `scale(${1 + outS * .04})`;
        S.s2.style.filter = outS > 0 ? `blur(${outS * 8}px)` : 'none';
        const lp = E.outCubic(prog(t, 3.95, 4.8));
        set(S.lText, { opacity: lp, transform: `scale(${lerp(.92, 1, lp)})`, filter: lp < 1 ? `blur(${(1 - lp) * 10}px)` : 'none' });
        const A = E.inOutCubic(prog(t, 4.1, 5.5)) * 362;
        const m = `conic-gradient(from 262deg at 52% 44%, #000 0deg, #000 ${Math.max(A - 10, 0)}deg, transparent ${A}deg)`;
        S.lRos.style.webkitMaskImage = m; S.lRos.style.maskImage = m;
        S.lRos.style.opacity = prog(t, 4.1, 4.25);
        const breathe = 1 + Math.sin((t - 5.5) * 1.6) * .006 * prog(t, 5.5, 6);
        S.logo.style.transform = `translateY(${(1 - lp) * 20}px) scale(${breathe})`;
        const lp2 = E.inOutCubic(prog(t, 5.35, 5.95));
        S.s2line.forEach(p => { p.style.strokeDashoffset = p._L * (1 - lp2); });
        const cp = E.outBack(prog(t, 5.55, 6.0), 2.2);
        set(S.s2cross, { opacity: prog(t, 5.55, 5.7), transform: `scale(${cp})`, transformOrigin: '180px 20px', transformBox: 'view-box' });
        words(S.s2tag, t, 5.7, { stagger: .095, dur: .55, dy: 26, blur: 7 });
      }
    }

    // ================= S3 · caja 3D (8.75 – 12.5)
    {
      const op = Math.min(E.inOutSine(prog(t, 8.55, 8.95)), 1 - prog(t, 12.55, 12.8));
      show(S.s3, op);
      if (op > 0) {
        const u = t - 8.75;
        fadeUp(S.s3k, t, 8.85, .5);
        words(S.s3t, t, 8.95, { stagger: .1, dur: .55, dy: 30, blur: 8 });
        const tout = E.inCubic(prog(t, 12.15, 12.5));
        S.s3k.style.opacity = Math.min(+S.s3k.style.opacity, 1 - tout);
        S.s3t.style.opacity = 1 - tout;
        const ein = E.outCubic(prog(u, 0, 1.05));
        let ry = u < 1.9 ? lerp(-86, -15, E.inOutCubic(prog(u, 0, 1.9))) : lerp(-15, -5, E.outQuad(prog(u, 1.9, 3.75)));
        const rx = lerp(-9, -4, prog(u, 0, 3.75));
        const bout = E.inCubic(prog(t, 12.1, 12.75));
        const ty = (1 - ein) * 420 + Math.sin(u * 1.9) * 7 + bout * 720;
        const sc = lerp(.92, 1, ein) * lerp(1, .72, bout);
        set(S.boxScene, { opacity: Math.min(prog(u, 0, .35), 1 - prog(t, 12.45, 12.75)), transform: `translateY(${ty}px) scale(${sc})` });
        S.box.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
        const rad = ry * Math.PI / 180;
        S.fShade.style.opacity = (1 - Math.cos(rad)) * .55;
        S.rShade.style.opacity = clamp(.05 + (1 - Math.sin(-rad)) * .45, 0, .6);
        S.lShade.style.opacity = .5; S.tShade.style.opacity = .05;
        S.glint.style.left = `${lerp(-60, 140, E.inOutSine(prog(t, 10.55, 11.45)))}%`;
        set(S.floor, { opacity: ein * (1 - bout), transform: `scaleX(${lerp(.6, 1, ein) * (1 - Math.abs(Math.sin(rad)) * .25)})` });
      }
    }

    // ================= S4 · abanico (12.5 – 15)
    {
      const op = Math.min(E.inOutSine(prog(t, 12.35, 12.65)), 1 - E.inOutSine(prog(t, 14.75, 15.1)));
      show(S.s4, op);
      if (op > 0) {
        fadeUp(S.s4k, t, 12.55, .45);
        words(S.s4t, t, 12.65, { stagger: .1, dur: .5, dy: 30, blur: 8 });
        const n = S.fan.length;
        S.fan.forEach((c, i) => {
          const p = prog(t, 12.5 + i * .06, 13.45 + i * .06);
          const sp = E.outBack(p, 1.3); const pe = E.outCubic(p);
          const ang = (-22 + i * (44 / (n - 1))) * sp;
          const out = E.inCubic(prog(t, 14.7 + (n - 1 - i) * .03, 15.1));
          c.style.transform = `translateY(${(1 - pe) * 620 - out * 90}px) rotate(${ang + Math.sin(t * 1.3 + i) * .6}deg) scale(${lerp(.82, 1, pe)})`;
          c.style.opacity = prog(p, 0, .15);
        });
        S.chips.forEach((c, i) => {
          const p = prog(t, 13.35 + i * .09, 13.8 + i * .09);
          set(c, { opacity: prog(p, 0, .3), transform: `scale(${lerp(.55, 1, E.outBack(p, 2))})` });
        });
      }
    }

    // ================= S5 · misterios (15 – 25)
    {
      const vis = t > 14.6 && t < 25.5; S.s5.style.visibility = vis ? 'visible' : 'hidden';
      MYST.forEach((m, i) => renderMystery(m, i, t));
    }

    // ================= S6 · extras (25 – 30)
    {
      const op = Math.min(E.inOutSine(prog(t, 24.85, 25.2)), 1 - E.inOutSine(prog(t, 29.6, 30.1)));
      show(S.s6, op);
      if (op > 0) {
        fadeUp(S.s6k, t, 25.0, .45);
        words(S.s6t, t, 25.1, { stagger: .075, dur: .5, dy: 26, blur: 7 });
        const a = E.outCubic(prog(t, 25.25, 26.0)), b = E.outCubic(prog(t, 25.42, 26.17));
        const fl = Math.sin(t * 1.4) * 5;
        const pz = E.inOutSine(prog(t, 26.25, 26.8));
        set(S.cPorq, { opacity: prog(t, 25.25, 25.4), transform: `translate(${(1 - a) * -120 + pz * 14}px,${(1 - a) * 760 + fl - pz * 10}px) rotate(${lerp(-20, -6, a) + pz * 3}deg) scale(${1 + pz * .05})`, zIndex: 2 });
        set(S.cLet, { opacity: prog(t, 25.42, 25.57), transform: `translate(${(1 - b) * 120}px,${(1 - b) * 760 - fl}px) rotate(${lerp(18, 6, b)}deg) scale(${1 - pz * .03})`, zIndex: 1 });
        $('.sheen', S.cPorq).style.backgroundPosition = `${lerp(120, -60, prog(t, 26.2, 27.1))}% 0`;
        $('.sheen', S.cLet).style.backgroundPosition = `${lerp(120, -60, prog(t, 25.6, 26.5))}% 0`;
        const bp = prog(t, 26.65, 27.2);
        set(S.bubble, { opacity: prog(bp, 0, .25), transform: `scale(${lerp(.5, 1, E.outBack(bp, 1.8))}) rotate(${(1 - E.outCubic(bp)) * -4}deg)`, transformOrigin: '190px 0px' });
      }
    }

    // ================= S7 · atril (30 – 35)
    {
      const op = Math.min(E.inOutSine(prog(t, 29.85, 30.2)), 1 - E.inOutSine(prog(t, 34.7, 35.15)));
      show(S.s7, op);
      if (op > 0) {
        fadeUp(S.s7k, t, 30.05, .45);
        words(S.s7t, t, 30.15, { stagger: .12, dur: .55, dy: 30, blur: 8 });
        const p = E.outCubic(prog(t, 29.95, 30.8));
        set(S.photo, { opacity: prog(t, 29.95, 30.25), transform: `translateY(${(1 - p) * 90}px) scale(${lerp(.93, 1, p)})` });
        S.ph1i.style.transform = `scale(${lerp(1.2, 1.04, E.outQuad(prog(t, 30, 33.1)))}) translate(0px,${lerp(26, 0, prog(t, 30, 33.1))}px)`;
        const x2 = E.inOutSine(prog(t, 32.45, 33.1));
        S.ph2.style.opacity = x2;
        S.ph2i.style.transform = `scale(${lerp(1.02, 1.14, prog(t, 32.45, 35.1))}) translate(${lerp(10, -14, prog(t, 32.45, 35.1))}px,0)`;
        const c1 = Math.min(E.outBack(prog(t, 30.75, 31.2), 1.6), 1 - E.inCubic(prog(t, 32.3, 32.6)));
        set(S.pc1, { opacity: Math.min(prog(t, 30.75, 30.95), 1 - prog(t, 32.3, 32.55)), transform: `translateY(${(1 - c1) * 30}px) scale(${lerp(.85, 1, clamp(c1, 0, 1.2))})` });
        const c2 = E.outBack(prog(t, 33.05, 33.5), 1.6);
        set(S.pc2, { opacity: Math.min(prog(t, 33.05, 33.25), 1 - prog(t, 34.6, 34.95)), transform: `translateY(${(1 - c2) * 30}px) scale(${lerp(.85, 1, c2)})` });
      }
    }

    // ================= S8 · Eutrapelia (35 – 38.75)
    {
      const op = Math.min(E.inOutSine(prog(t, 34.95, 35.3)), 1 - E.inOutSine(prog(t, 38.45, 38.9)));
      show(S.s8, op);
      if (op > 0) {
        fadeUp(S.s8k, t, 35.15, .45);
        const w = E.inOutCubic(prog(t, 35.35, 36.15));
        set(S.s8logo, { clipPath: `inset(-5% ${100 - w * 105}% -5% -5%)`, transform: `scale(${lerp(.95, 1, w)})`, opacity: prog(t, 35.35, 35.5) });
        S.s8line.style.transform = `scaleX(${E.outCubic(prog(t, 36.0, 36.55))})`;
        words(S.s8t, t, 36.15, { stagger: .085, dur: .5, dy: 28, blur: 7 });
      }
    }

    // ================= S9 · CTA (38.75 – 45)
    {
      const op = E.inOutSine(prog(t, 38.6, 39.0));
      show(S.s9, op);
      S.rays.style.opacity = E.inOutSine(prog(t, 38.7, 39.8)) * .9;
      S.rays.style.transform = `rotate(${t * 3.2}deg)`;
      S.rays.style.visibility = t > 38.6 ? 'visible' : 'hidden';
      if (op > 0) {
        const p = E.outCubic(prog(t, 38.8, 39.75));
        const fl = Math.sin((t - 39) * 1.5) * 8;
        set(S.ctaBox, { opacity: prog(t, 38.8, 39.05), transform: `translateY(${(1 - p) * 140 + fl}px) scale(${lerp(.86, 1, p)}) rotate(${lerp(-5, -1.2, p) + Math.sin(t * .9) * .6}deg)` });
        const g1 = prog(t, 39.8, 40.6), g2 = prog(t, 42.8, 43.6);
        S.ctaGlint.style.left = `${lerp(-60, 140, E.inOutSine(g1 < 1 ? g1 : g2))}%`;
        fadeUp(S.ctaPre, t, 39.55, .5, 20);
        const up = prog(t, 39.8, 40.35);
        set(S.ctaUrl, { opacity: prog(up, 0, .25), transform: `scale(${lerp(.6, 1, E.outBack(up, 1.9)) * (1 + Math.sin(Math.max(0, t - 41) * 3.2) * .012 * prog(t, 41, 41.4))})` });
        fadeUp(S.ctaLogos, t, 40.3, .6, 26);
        fadeUp(S.ctaEnd, t, 40.9, .7, 18);
      }
    }

    // ================= capas globales
    S.glow.style.opacity = t < 4 ? 0 : (t < 30 ? .85 : 1);
    S.flash.style.opacity = Math.max(
      .35 * (1 - prog(t, 3.9, 4.5)) * prog(t, 3.6, 3.9),
      .28 * (1 - prog(t, 38.8, 39.5)) * prog(t, 38.55, 38.8));
    const dustAmt = t < 4 ? .95 : (t > 38.7 ? .75 : .45);
    renderDust(t, dustAmt, t < 3.9 ? 'lighter' : 'source-over');
  }

  // ------------------------------------------------------------------ arranque
  async function ready() {
    init();
    await document.fonts.ready;
    await Promise.all($$('img').map(i => (i.complete ? i.decode().catch(() => {}) : new Promise(r => { i.onload = () => i.decode().then(r, r); i.onerror = r; }))));
    // precarga de imágenes usadas como máscara CSS
    await Promise.all(['logo-mision-rosario', 'logo-mision-texto', 'logo-eutrapelia', 'logo-familias', 'paper'].map(n => new Promise(r => {
      const im = new Image(); im.onload = r; im.onerror = r; im.src = `assets/cut/${n}.${n === 'paper' ? 'jpg' : 'png'}`;
    })));
    render(0);
    window.READY = true;
    const q = new URLSearchParams(location.search);
    if (q.has('t')) { render(parseFloat(q.get('t'))); return; }
    if (!q.has('render')) {  // vista previa en vivo
      const t0 = performance.now();
      const loop = () => { render(((performance.now() - t0) / 1000) % DURATION); requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
    }
  }
  window.render = t => render(t);
  window.REEL = { DURATION, FPS };
  ready();
})();
