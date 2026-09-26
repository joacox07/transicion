/* Videoclip «SEAMOS UNO» · motor de la línea de tiempo.
 * render(t) es una función pura del tiempo: escenas ilustradas con cámara y paralaje,
 * letra sincronizada palabra por palabra, título inicial y créditos finales.
 */
(() => {
  const { W, H } = LIB;
  const FPS = 30;
  const XF = 0.9;                 // duración del fundido entre escenas
  const CREDITS_AT = 216.8;       // cuando termina la voz
  const DURATION = 242;           // canción (220.4 s) + cierre instrumental para los créditos

  // ------------------------------------------------------------------ utilidades
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const prog = (t, a, b) => clamp((t - a) / (b - a));
  const E = {
    outCubic: x => 1 - Math.pow(1 - x, 3), inOutSine: x => -(Math.cos(Math.PI * x) - 1) / 2,
    inOutCubic: x => (x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2), outQuad: x => 1 - (1 - x) * (1 - x),
  };

  // ------------------------------------------------------------------ escenas
  let scenes = [];
  function buildScenes() {
    const defs = window.SCENES;
    const stage = $('#scenes');
    defs.sort((a, b) => a.at - b.at);
    defs.forEach((s, i) => {
      s.end = i < defs.length - 1 ? defs[i + 1].at + XF : DURATION;
      const div = document.createElement('div');
      div.className = 'scene'; div.id = 'sc-' + s.id;
      div.innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice"><g class="skg"${window.SKETCH_FILTER && !s.noSketch ? ' filter="url(#sk0)"' : ''}>${s.build()}</g></svg>`;
      stage.appendChild(div);
      s.el = div; s.svg = $('svg', div); s.skg = $('.skg', div);
      if (window.SKETCH_FILTER && !s.noSketch) {  // el fondo (cielo, luces) va con acuarela sola, sin trazo de tinta
        const bg = document.createElementNS('http://www.w3.org/2000/svg', 'g'); bg.setAttribute('filter', 'url(#skw0)');
        s.svg.insertBefore(bg, s.skg);
        $$('g.L', s.skg).filter(el => parseFloat(el.dataset.d) <= (s.bgDepth ?? .15) && el.parentNode === s.skg && !el.dataset.ink).forEach(el => bg.appendChild(el));
        s.bgk = bg;
      }
      s.layers = $$('g.L', div).map(el => ({ el, d: parseFloat(el.dataset.d) }));
      s.cam = Object.assign({ x0: 0, y0: 0, z0: 1, x1: 0, y1: 0, z1: 1.06, ease: 'inOutSine' }, s.cam || {});
      if (s.init) s.init(div);
    });
    scenes = defs;
  }
  function renderScene(s, t) {
    const vis = t >= s.at - .001 && t < s.end;
    if (!vis) { if (s._v) { s.el.style.display = 'none'; s._v = false; } return; }
    if (!s._v) { s.el.style.display = 'block'; s._v = true; }
    const first = s === scenes[0];
    const op = first ? 1 : E.inOutSine(prog(t, s.at, s.at + (s.xf || XF)));
    s.el.style.opacity = op;
    const p = E[s.cam.ease](prog(t, s.at, s.end));
    const cx = lerp(s.cam.x0, s.cam.x1, p), cy = lerp(s.cam.y0, s.cam.y1, p), z = lerp(s.cam.z0, s.cam.z1, p);
    for (const L of s.layers) {
      const k = .25 + .75 * L.d, zz = 1 + (z - 1) * (.35 + .65 * L.d);
      L.el.setAttribute('transform', `translate(${960 + cx * k} ${540 + cy * k}) scale(${zz}) translate(-960 -540)`);
    }
    if (s.update) s.update(t, t - s.at, p, s);
    if (window.SKETCH_FILTER && !s.noSketch) { const k = Math.floor(t * FPS / 4) % window.SKETCH_N; if (s._k !== k) { s.skg.setAttribute('filter', `url(#sk${k})`); s.bgk.setAttribute('filter', `url(#skw${k})`); s._k = k; } }
  }

  // ------------------------------------------------------------------ letra
  let LY = [];
  function buildLyrics() {
    const box = $('#lyrics');
    LY = window.LYRICS.lines.map(l => {
      const words = l.text.split(' ');
      if (words.length !== l.w.length) console.error('palabras/tiempos no coinciden en verso', l.id);
      const el = document.createElement('div');
      el.className = 'lyr' + (l.chorus ? ' chorus' : '');
      el.innerHTML = words.map(w => {
        const key = /^(seamos|uno[.,]?)$/i.test(w.replace(/[…]/g, ''));
        return `<span class="lw${l.chorus && key ? ' key' : ''}">${w}</span>`;
      }).join(' ');
      box.appendChild(el);
      return { ...l, el, spans: $$('.lw', el) };
    });
  }
  function renderLyrics(t) {
    for (const l of LY) {
      const a = l.w[0] - .35, b = l.end;
      const vis = t > a - .01 && t < b + .01;
      if (!vis) { if (l._v) { l.el.style.visibility = 'hidden'; l._v = false; } continue; }
      if (!l._v) { l.el.style.visibility = 'visible'; l._v = true; }
      const pin = E.outCubic(prog(t, a, a + .45)), pout = E.inOutSine(prog(t, b - .45, b));
      l.el.style.opacity = pin * (1 - pout);
      l.el.style.transform = `translateY(${(1 - pin) * 18 - pout * 10}px)`;
      l.spans.forEach((s, i) => {
        const q = prog(t, l.w[i] - .12, l.w[i] + .28);
        s.style.opacity = .5 + .5 * q;
        s.style.setProperty('--lit', q);
      });
    }
  }

  // ------------------------------------------------------------------ título inicial y créditos
  function renderTitle(t) {
    const T = $('#title');
    const vis = t < 27.8; T.style.visibility = vis ? 'visible' : 'hidden';
    if (!vis) return;
    const a = E.outCubic(prog(t, 3.2, 6.2)), out = E.inOutSine(prog(t, 12.6, 14.2));
    const main = $('#t-main'), sub = $('#t-sub'), line = $('#t-line'), auth = $('#t-auth'), visit = $('#t-visit');
    main.style.opacity = a * (1 - out);
    main.style.letterSpacing = `${lerp(.5, .16, a)}em`;
    main.style.filter = a < 1 ? `blur(${(1 - a) * 10}px)` : 'none';
    line.style.transform = `scaleX(${E.outCubic(prog(t, 5.2, 6.8))})`; line.style.opacity = 1 - out;
    sub.style.opacity = E.outCubic(prog(t, 6.2, 7.6)) * (1 - out);
    // segundo bloque: la visita
    const v = E.outCubic(prog(t, 15.2, 16.8)), vout = E.inOutSine(prog(t, 24.6, 26.4));
    visit.style.opacity = v * (1 - vout); visit.style.transform = `translateY(${(1 - v) * 20}px)`;
    auth.style.opacity = E.outCubic(prog(t, 17.4, 18.8)) * (1 - vout);
  }
  function renderCredits(t) {
    const Cr = $('#credits');
    const vis = t > CREDITS_AT - .5; Cr.style.visibility = vis ? 'visible' : 'hidden';
    if (!vis) return;
    Cr.style.opacity = E.inOutSine(prog(t, CREDITS_AT, CREDITS_AT + 1.4)) * (1 - E.inOutSine(prog(t, DURATION - 1.6, DURATION)));
    const roll = $('#roll'), rh = roll.offsetHeight;
    // el rollo sube desde abajo del cuadro hasta que el último renglón queda centrado
    const y0 = 1080, y1 = 540 - rh + 150;
    const p = prog(t, CREDITS_AT + .6, DURATION - 3.2);
    roll.style.transform = `translateY(${lerp(y0, y1, p)}px)`;
    const ph = $('#photo'), pp = E.outCubic(prog(t, CREDITS_AT + 1.0, CREDITS_AT + 2.6));
    ph.style.opacity = pp;
    ph.style.transform = `translateY(${(1 - pp) * 40 + Math.sin((t - CREDITS_AT) * .6) * 4}px) rotate(${lerp(4, 2.2, pp)}deg)`;
  }

  // ------------------------------------------------------------------ render
  function render(t) {
    for (const s of scenes) renderScene(s, t);
    renderLyrics(t);
    renderTitle(t);
    renderCredits(t);
    // oscurecido inferior para leer la letra (sólo cuando hay verso en pantalla)
    let lyr = 0; for (const l of LY) lyr = Math.max(lyr, Math.min(prog(t, l.w[0] - .9, l.w[0] - .3), 1 - prog(t, l.end, l.end + .6)));
    $('#shade').style.opacity = t > CREDITS_AT ? 0 : .55 + .45 * lyr;
    // fundido desde negro al inicio
    $('#fade').style.opacity = 1 - E.inOutSine(prog(t, 0, 2.6));
  }

  async function ready() {
    $('#grain').style.backgroundImage = `url(${LIB.paperTexture()})`;
    window.LYRICS = await (await fetch('lyrics.json')).json();
    buildScenes();
    buildLyrics();
    await document.fonts.ready;
    await Promise.all($$('img').map(i => (i.complete ? i.decode().catch(() => {}) : new Promise(r => { i.onload = r; i.onerror = r; }))));
    if (location.search.includes('clean')) ['#lyrics', '#title', '#shade', '#credits', '#fade'].forEach(sel => { $(sel).style.display = 'none'; });
    render(0);
    window.READY = true;
    const q = new URLSearchParams(location.search);
    if (q.has('t')) { render(parseFloat(q.get('t'))); return; }
    if (!q.has('render')) {
      const audio = $('#audio'); const start = parseFloat(q.get('start') || 0);
      audio.currentTime = start; audio.play().catch(() => {});
      const loop = () => { render(audio.currentTime); requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
    }
  }
  /** modo de captura para el postproceso: 'scene' = sólo ilustración; 'over' = letra, títulos y créditos con fondo transparente */
  window.LAYERS = mode => {
    const A = mode === 'scene';
    $('#scenes').style.visibility = A ? 'visible' : 'hidden';
    ['#shade', '#title', '#lyrics', '#credits', '#fade'].forEach(sel => { $(sel).style.display = A ? 'none' : ''; });
    ['#grain', '#vignette'].forEach(sel => { $(sel).style.display = 'none'; });
    const bg = A ? '' : 'transparent';
    $('#stage').style.background = bg; document.body.style.background = bg; document.documentElement.style.background = bg;
  };
  window.render = render;
  window.CLIP = { DURATION, FPS, CREDITS_AT };
  ready();
})();
