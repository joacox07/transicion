/* Video de letra «SEAMOS UNO»: fondo azul fijo (el mismo de los créditos) y cada verso completo,
 * centrado y sincronizado con la voz. Título durante la introducción y los mismos créditos al final
 * (se renderizan hasta que quedan completos; después se empalma el tramo ya renderizado del videoclip).
 */
(() => {
  const FPS = 30;
  const CREDITS_AT = 216.8;       // igual que en clip.js
  const CLIP_DURATION = 242;      // duración del videoclip (define el movimiento de los créditos)
  const DURATION = 219.6;         // este render termina acá; el resto de los créditos se toma del videoclip

  const $ = (s, r = document) => r.querySelector(s);
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const prog = (t, a, b) => clamp((t - a) / (b - a));
  const E = { outCubic: x => 1 - Math.pow(1 - x, 3), inOutSine: x => -(Math.cos(Math.PI * x) - 1) / 2 };

  // ------------------------------------------------------------------ versos completos
  const LEAD = .35, FADE = .25, GAP_HOLD = 2.0;
  let V = [];
  function buildVerses() {
    const box = $('#verses');
    const lines = window.LYRICS.lines;
    V = lines.map((l, i) => {
      const el = document.createElement('div');
      el.className = 'verse' + (l.chorus ? ' chorus' : '');
      el.textContent = l.text;
      box.appendChild(el);
      return { el, a: l.w[0] - LEAD, end: l.end };
    });
    // cada verso queda en pantalla hasta que aparece el siguiente (salvo que haya una pausa larga)
    V.forEach((v, i) => {
      const nx = V[i + 1];
      v.b = nx && nx.a - v.end < GAP_HOLD ? nx.a : v.end;
    });
  }
  function renderVerses(t) {
    for (const v of V) {
      const vis = t >= v.a && t < v.b + FADE;
      if (!vis) { if (v._v) { v.el.style.visibility = 'hidden'; v._v = false; } continue; }
      if (!v._v) { v.el.style.visibility = 'visible'; v._v = true; }
      v.el.style.opacity = Math.min(prog(t, v.a, v.a + FADE), 1 - prog(t, v.b, v.b + FADE));
    }
  }

  // ------------------------------------------------------------------ título (idéntico al del videoclip)
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
    const v = E.outCubic(prog(t, 15.2, 16.8)), vout = E.inOutSine(prog(t, 24.6, 26.4));
    visit.style.opacity = v * (1 - vout); visit.style.transform = `translateY(${(1 - v) * 20}px)`;
    auth.style.opacity = E.outCubic(prog(t, 17.4, 18.8)) * (1 - vout);
  }

  // ------------------------------------------------------------------ créditos (misma lógica y tiempos que clip.js)
  function renderCredits(t) {
    const Cr = $('#credits');
    const vis = t > CREDITS_AT - .5; Cr.style.visibility = vis ? 'visible' : 'hidden';
    if (!vis) return;
    Cr.style.opacity = E.inOutSine(prog(t, CREDITS_AT, CREDITS_AT + 1.4)) * (1 - E.inOutSine(prog(t, CLIP_DURATION - 1.6, CLIP_DURATION)));
    const roll = $('#roll'), rh = roll.offsetHeight;
    const y0 = 1080, y1 = 540 - rh + 150;
    const p = prog(t, CREDITS_AT + .6, CLIP_DURATION - 3.2);
    roll.style.transform = `translateY(${lerp(y0, y1, p)}px)`;
    const ph = $('#photo'), pp = E.outCubic(prog(t, CREDITS_AT + 1.0, CREDITS_AT + 2.6));
    ph.style.opacity = pp;
    ph.style.transform = `translateY(${(1 - pp) * 40 + Math.sin((t - CREDITS_AT) * .6) * 4}px) rotate(${lerp(4, 2.2, pp)}deg)`;
  }

  function render(t) {
    renderTitle(t);
    renderVerses(t);
    renderCredits(t);
    $('#fade').style.opacity = 1 - E.inOutSine(prog(t, 0, 2.6));
  }

  async function ready() {
    $('#credit-sun').innerHTML = LIB.solDeMayo(0, 0, 16);
    window.LYRICS = await (await fetch('lyrics.json')).json();
    buildVerses();
    await document.fonts.ready;
    await Promise.all([...document.images].map(i => (i.complete ? i.decode().catch(() => {}) : new Promise(r => { i.onload = r; i.onerror = r; }))));
    render(0);
    window.READY = true;
    const q = new URLSearchParams(location.search);
    if (q.has('t')) render(parseFloat(q.get('t')));
  }
  window.render = render;
  window.LAYERS = () => {};        // todo es una sola capa (sin dibujado a mano)
  window.CLIP = { DURATION, FPS, CREDITS_AT };
  ready();
})();
