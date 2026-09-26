/* Escenas: introducción, estrofa 1 y estrofa 2 */
(() => {
  const { label, grass, hatch, bricks, windowBox, tree, ink, W, H, RNG, C, g, path, rect, circle, ellipse, line, poly, paper, layer, sky, glow, rays, solDeMayo, clouds, mountains, hills, waves, person, shade, crowd, flag, dove, cross, f1 } = LIB;
  const S = window.SCENES;
  const q = (s, sel) => s.el.querySelector(sel);
  const qa = (s, sel) => [...s.el.querySelectorAll(sel)];
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const pr = (t, a, b) => clamp((t - a) / (b - a));
  const ease = x => -(Math.cos(Math.PI * x) - 1) / 2;

  // ================================================================= INTRO (0 – 27.6)
  // De la noche al amanecer sobre la Argentina; sale el Sol de Mayo y cruzan palomas.
  S.push({
    id: 'intro', at: 0, cam: { x0: 0, y0: 420, z0: 1.08, x1: 0, y1: -40, z1: 1.0, ease: 'inOutSine' },
    build() {
      const r = RNG(11); let stars = '';
      for (let i = 0; i < 260; i++) stars += circle(r.range(-300, W + 300), r.range(-700, 620), r.range(.6, 2.4), '#fff', `opacity="${f1(r.range(.25, .95))}"`);
      return layer(0, sky([[0, '#060b1d'], [.45, '#16264a'], [.8, '#3a3f6e'], [1, '#6a5577']]) + `<g id="stars">${stars}</g>`) +
        layer(0, `<g id="dawn" opacity="0">${sky([[0, '#1c2f63'], [.35, '#4f5f99'], [.62, '#e39a82'], [.8, '#f8c98d'], [1, '#fde6b8']])}</g>`) +
        layer(.15, `<g id="sun">${glow(960, 700, 520, '#ffd98a', .75)}${rays(960, 700, 120, 1400, 36, '#fff1c9', .06, 5)}${solDeMayo(960, 700, 70)}</g>`) +
        layer(.3, paper(mountains(4, 700, 260, '#3b3f6b', { peaks: [[200, 430], [640, 330], [980, 250], [1380, 360], [1760, 420]], snow: { frac: .22, color: '#c9cde6', op: .9 } }))) +
        layer(.5, paper(hills(5, 800, 60, '#2d3558'))) +
        layer(.7, paper(hills(6, 900, 40, '#232a47') + waves(930, '#2a3c6a', { amp: 4, len: 90, x0: 1150, x1: W + 300 }))) +
        layer(.9, `<g id="doves">${[0, 1, 2, 3, 4].map(i => `<g class="dv" data-i="${i}">${dove(0, 0, .9 - i * .08, i)}</g>`).join('')}</g>`) +
        layer(1, paper(hills(7, 1010, 30, '#171c33') + grass(8, 160, -300, W + 300, 990, 1080, '#2a3456', .8) + path('M1180,1120 Q1500,860 2300,900 L2300,1400 L1180,1400Z', '#141a30') +
          g(person(1560, 925, 150, { color: '#0f1428', skin: '#0f1428', hair: '#0f1428', back: true, pose: 'stand' }) +
            person(1650, 918, 120, { color: '#0f1428', skin: '#0f1428', hair: '#0f1428', back: true, long: true, pose: 'hold' }) +
            person(1720, 915, 80, { color: '#0f1428', skin: '#0f1428', hair: '#0f1428', back: true }) +
            person(1800, 910, 158, { color: '#0f1428', skin: '#0f1428', hair: '#0f1428', back: true, pose: 'raise' }) +
            `<g id="iflag">${flag(1830, 700, 130, 84, 0, true, .1)}</g>`)));
    },
    update(t, u, p, s) {
      const k = ease(pr(t, 1.5, 20));
      q(s, '#iflag').innerHTML = flag(1830, 700 + 0, 130, 84, t * 3, true, .1);
      q(s, '#dawn').setAttribute('opacity', k);
      q(s, '#stars').setAttribute('opacity', 1 - k * .95);
      q(s, '#sun').setAttribute('transform', `translate(0 ${f1(460 - k * 840)})`);
      qa(s, '.dv').forEach((d, i) => {
        const tt = t - 14.5 - i * .55, x = -300 + tt * 230, y = 420 - i * 40 + Math.sin(tt * .8 + i) * 30;
        d.setAttribute('transform', `translate(${f1(x)} ${f1(y)}) scale(${tt > 0 ? 1 : 0})`);
        d.innerHTML = dove(0, 0, .9 - i * .08, t * 9 + i);
      });
    },
  });

  // ================================================================= E1 · L1  Desde las montañas hasta el mar (27.6)
  S.push({
    id: 'aconcagua', at: 27.6, cam: { x0: 120, y0: 760, z0: 1.05, x1: -80, y1: -320, z1: 1.0, ease: 'inOutCubic' },
    build() {
      return layer(0, sky([[0, '#6f9fd6'], [.5, '#bcd7ee'], [1, '#f7e3c4']])) +
        layer(.1, clouds(21, 7, -200, 200, '#fff', .75)) +
        layer(.35, label(1080, -150, 'Aconcagua', { sub: 'Mendoza · 6.961 m', rot: -3 })) +
        // Aconcagua: cumbre dominante con nieve
        layer(.35, paper(mountains(22, 420, 120, '#7d6f86', { peaks: [[-100, 120], [320, -40], [700, -260], [1010, -60], [1400, 40], [1900, 120]], snow: { frac: .34, color: '#f6f7fb' }, rough: .5 }))) +
        layer(.5, paper(mountains(23, 560, 80, '#9b7f6a', { peaks: [[0, 330], [500, 250], [1000, 330], [1500, 260], [2100, 340]], rough: .45 }))) +
        layer(.62, paper(hills(24, 700, 70, '#b99a6f') + hills(25, 780, 50, '#9fae6a')) + grass(27, 260, -300, W + 300, 790, 900, '#5f7a3a', .7) + [...Array(18)].map((_, i) => ellipse(-200 + i * 130, 812 + (i % 3) * 22, 26, 12, '#7f8f4a')).join('')) +
        // costa patagónica y mar
        layer(.8, paper(hills(26, 880, 40, '#c9b27f', { freq: .8 }) + path('M-300,960 L2220,960 L2220,1600 L-300,1600Z', '#d9c28f'))) +
        layer(.92, waves(1000, C.sea, { amp: 8, len: 160 }) + waves(1080, C.seaD, { amp: 10, len: 200, phase: 1 }) + `<g id="spark"></g>` +
          waves(1180, '#1a3f62', { amp: 12, len: 240, phase: 2 }) +
          // faro patagónico
          label(1200, 780, 'Mar Argentino', { sub: 'Patagonia', rot: 2 }) + paper(g(rect(1480, 820, 34, 150, '#f4efe6') + rect(1480, 850, 34, 18, '#c0413a') + rect(1480, 900, 34, 18, '#c0413a') + path('M1474,822 L1497,796 L1520,822Z', '#c0413a') + rect(1470, 966, 54, 12, '#6b5a48')))) +
        layer(.97, [...Array(10)].map((_, i) => ink(`M${-100 + i * 220},${1030 + (i % 3) * 50} q30,-10 60,0 q30,10 60,0`, 2, .45)).join('') + [...Array(5)].map((_, i) => ink(`M${300 + i * 260},${860 - i * 30} q14,-12 28,0 q14,-12 28,0`, 2.2, .7)).join('')) +
        layer(1, `<g id="whale">${path('M0,0 Q60,-40 140,-8 Q170,-2 190,-30 Q186,-6 200,10 Q170,4 140,14 Q60,30 0,0Z', '#1a3350')}</g>`);
    },
    update(t, u, p, s) {
      const w = q(s, '#whale'); const a = pr(u, 2.6, 5.4);
      w.setAttribute('transform', `translate(${f1(640 + a * 160)} ${f1(1150 - Math.sin(a * Math.PI) * 60)}) rotate(${f1(-12 + a * 24)})`);
      w.setAttribute('opacity', Math.sin(a * Math.PI));
    },
  });

  // ================================================================= E1 · L2  hay un pueblo queriendo despertar (33.35)
  // Panorámica al amanecer: Buenos Aires (Puente de la Mujer) → Quebrada de Humahuaca, Jujuy → Cataratas del Iguazú, Misiones
  const cardon = (x, y, h) => { const w = h * .13; return g(rect(x - w / 2, y - h, w, h, '#4f7a4a', `rx="${f1(w / 2)}"`) +
    path(`M${f1(x - w / 2)},${f1(y - h * .45)} q${f1(-w * 1.6)},0 ${f1(-w * 1.6)},${f1(-h * .25)} l0,${f1(-h * .12)}`, 'none', `stroke="#4f7a4a" stroke-width="${f1(w * .9)}" stroke-linecap="round"`) +
    path(`M${f1(x + w / 2)},${f1(y - h * .6)} q${f1(w * 1.4)},0 ${f1(w * 1.4)},${f1(-h * .2)} l0,${f1(-h * .08)}`, 'none', `stroke="#4f7a4a" stroke-width="${f1(w * .85)}" stroke-linecap="round"`) +
    ink(`M${f1(x - w * .2)},${f1(y - h + 4)} L${f1(x - w * .2)},${f1(y)} M${f1(x + w * .2)},${f1(y - h + 4)} L${f1(x + w * .2)},${f1(y)}`, 1.2, .45)); };
  const palm = (x, y, h, lean = 0) => { let fr = ''; for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + (i - 3.5) * .42; fr += path(`M0,0 Q${f1(Math.cos(a) * h * .3)},${f1(Math.sin(a) * h * .3 - 20)} ${f1(Math.cos(a) * h * .45)},${f1(Math.sin(a) * h * .45 + 30)}`, 'none', `stroke="${i % 2 ? '#2f6b3a' : '#3f7f45'}" stroke-width="${f1(h * .05)}" stroke-linecap="round"`); }
    return g(path(`M-6,0 Q${f1(lean * .5)},${f1(-h * .5)} ${f1(lean)},${f1(-h)} L${f1(lean + 8)},${f1(-h)} Q${f1(lean * .5 + 8)},${f1(-h * .5)} 6,0Z`, '#7a5a3a') + ink(`M0,-20 L${f1(lean * .15)},${f1(-h * .2)} M${f1(lean * .3)},${f1(-h * .35)} L${f1(lean * .45)},${f1(-h * .5)}`, 1.2, .5) + `<g transform="translate(${f1(lean + 4)},${f1(-h)})">${fr}</g>`, `transform="translate(${f1(x)},${f1(y)})"`); };
  const fern = (x, y, s2) => g([...Array(7)].map((_, i) => { const a = -Math.PI + i / 6 * Math.PI; return path(`M0,0 Q${f1(Math.cos(a) * 30)},${f1(Math.sin(a) * 50)} ${f1(Math.cos(a) * 60)},${f1(Math.sin(a) * 40 + 10)}`, 'none', 'stroke="#2f6b3a" stroke-width="7" stroke-linecap="round"'); }).join(''), `transform="translate(${f1(x)},${f1(y)}) scale(${s2})"`);
  S.push({
    id: 'despertar', at: 33.35, cam: { x0: 910, y0: 0, z0: 1.02, x1: -910, y1: -10, z1: 1.02, ease: 'inOutSine' },
    build() {
      const r = RNG(31);
      // --- Buenos Aires al amanecer: torres de Puerto Madero y el Puente de la Mujer
      let city = '';
      for (let i = 0; i < 18; i++) { const x = -640 + i * 56 + r.range(-8, 8), w = r.range(40, 62), h = r.range(120, 330); city += rect(x, 740 - h, w, h, shade('#6a6f96', r.range(-.15, .12))) + ink(`M${f1(x)},${f1(740 - h)} L${f1(x)},740`, 1.2, .4); for (let k = 0; k < 8; k++) if (r() < .55) city += rect(x + r.range(5, w - 11), 740 - r.range(18, h - 12), 6, 9, '#ffd98a', 'opacity=".9"'); }
      const puente = rect(-620, 790, 980, 14, '#f4efe6') + ink('M-620,790 L360,790 M-620,804 L360,804', 1.4, .6) +
        path('M-140,800 L-300,470 L-288,466 L-126,800Z', '#fbf8f1') + ink('M-140,800 L-300,470 L-288,466 L-126,800Z', 1.6, .7) +
        [...Array(9)].map((_, i) => line(-294 + i * 12, 478 + i * 24, -110 + i * 52, 792, '#f4efe6', 2)).join('');
      // --- Jujuy: Cerro de los Siete Colores con Purmamarca al pie
      const cerro = 'M330,780 L420,640 L500,600 L560,520 L620,470 L700,420 L760,400 L830,360 L880,380 L950,330 L1010,360 L1060,410 L1130,440 L1200,500 L1290,560 L1380,640 L1470,700 L1530,780Z';
      const vet = ['#b4533c', '#d98a52', '#9b7aa6', '#7f9a6e', '#e3b778', '#c4675a', '#c98fae', '#e8d3a8', '#a6543f', '#8e8fb0'];
      let bands = ''; let off = -700;
      for (let i = 0; off < 1400; i++) { const w = r.range(34, 70); bands += path(`M${f1(330 + off)},800 L${f1(330 + off + w)},800 L${f1(330 + off + w + 700)},300 L${f1(330 + off + 700)},300Z`, vet[i % vet.length]) + ink(`M${f1(330 + off)},800 L${f1(330 + off + 700)},300`, 1.3, .45); off += w; }
      let village = '';
      for (let i = 0; i < 9; i++) { const x = 520 + i * 92 + r.range(-10, 10), w = r.range(60, 84), h = r.range(44, 62); village += rect(x, 830 - h, w, h, shade('#c9a27a', r.range(-.12, .08))) + rect(x - 4, 830 - h - 8, w + 8, 10, '#8a6a4a') + rect(x + w * .4, 830 - 30, 14, 30, '#5a3b26') + ink(`M${f1(x)},${f1(830 - h)} L${f1(x + w)},${f1(830 - h)} L${f1(x + w)},830 L${f1(x)},830Z`, 1.2, .5); }
      const iglesia = rect(1000, 700, 110, 130, '#f7f2e6') + rect(1025, 620, 60, 90, '#f7f2e6') + path('M1020,620 L1055,590 L1090,620Z', '#c9a27a') + cross(1055, 590, 26, '#5a3b26', 4) + path('M1040,830 L1040,780 Q1055,764 1070,780 L1070,830Z', '#5a3b26') + rect(1045, 640, 20, 24, '#5a3b26') + ink('M1000,700 L1110,700 L1110,830 L1000,830Z M1025,620 L1085,620 L1085,700', 1.4, .6);
      // --- Misiones: Garganta del Diablo, tierra colorada, selva, bruma y arco iris
      let falls = '';
      for (let i = 0; i < 11; i++) {
        const fx = 1600 + i * 82 + r.range(-10, 10), fy = 505 + Math.abs(i - 5) * 10 + r.range(-6, 6), fh = 290 - Math.abs(i - 5) * 10, w1 = r.range(26, 58), w2 = w1 * r.range(1.3, 1.7);
        const d = `M${f1(fx)},${f1(fy)} Q${f1(fx + w1 / 2)},${f1(fy - 10)} ${f1(fx + w1)},${f1(fy)} Q${f1(fx + w1 + (w2 - w1) * .3)},${f1(fy + fh * .5)} ${f1(fx + w1 / 2 + w2 / 2)},${f1(fy + fh)} L${f1(fx + w1 / 2 - w2 / 2)},${f1(fy + fh)} Q${f1(fx - (w2 - w1) * .3)},${f1(fy + fh * .5)} ${f1(fx)},${f1(fy)}Z`;
        falls += path(d, '#eef7fa', 'class="fall"') + [...Array(5)].map((_, k) => { const xx = fx + w1 * (k + .5) / 5; return ink(`M${f1(xx)},${f1(fy + 8 + r.range(0, 20))} Q${f1(xx + r.range(-4, 4))},${f1(fy + fh * .5)} ${f1(xx + (xx - fx - w1 / 2) * .4)},${f1(fy + fh - r.range(10, 40))}`, 1.6, .35); }).join('') + ink(d, 1.6, .5);
      }
      const cliff = path('M1560,540 Q2020,470 2500,540 L2500,800 L1560,800Z', '#6b5a48') + hatch('M1560,540 Q2020,470 2500,540 L2500,800 L1560,800Z', { angle: 80, gap: 10, op: .25, bbox: [1550, 460, 2510, 810] });
      let jungle = ''; for (let i = 0; i < 26; i++) { const x = r.range(1540, 2560), y = r.range(440, 530); jungle += circle(x, y, r.range(30, 60), shade('#2f6b3a', r.range(-.2, .15))) + ink(`M${f1(x - 18)},${f1(y)} q9,-10 18,0 q9,10 18,0`, 1.3, .4); }
      const mist = [...Array(12)].map((_, i) => ellipse(1600 + i * 80, 790 + (i % 3) * 14, 90 + (i % 2) * 40, 44, '#ffffff', 'opacity=".6"')).join('');
      const rainbow = [0, 1, 2, 3, 4, 5].map(i => path(`M${1700 - i * 9},820 A${320 + i * 9},${240 + i * 9} 0 0 1 ${2340 + i * 9},820`, 'none', `stroke="${['#e98a7a', '#f2b632', '#ffe29a', '#8fb870', '#74acdf', '#9d8fd2'][i]}" stroke-width="9" opacity=".55"`)).join('');
      const toucan = g(ellipse(0, 0, 18, 26, '#1f1f24') + ellipse(2, -8, 10, 9, '#fbf3d0') + path('M8,-14 Q40,-18 46,-6 Q30,-4 8,-6Z', '#f08a24') + circle(4, -16, 2.5, '#1a120c') + line(-30, 26, 40, 30, '#5a3b26', 5), 'transform="translate(2440,640)"');
      return layer(0, sky([[0, '#f3a37c'], [.45, '#f8cf96'], [1, '#fdeccb']])) +
        layer(.08, glow(-200, 640, 700, '#fff0c0', .9) + circle(-200, 700, 90, '#fff3cf')) +
        layer(.3, paper(mountains(32, 640, 110, '#c7a7a0', { x0: -1200, x1: 3200, n: 12 }))) +
        layer(.6, city + puente + rect(-700, 800, 1080, 400, '#7f8fb8') + waves(830, '#95a6cc', { amp: 3, len: 60, x0: -700, x1: 380 }) +
          `<clipPath id="cerroC"><path d="${cerro}"/></clipPath><g clip-path="url(#cerroC)">${bands}</g>` + ink(cerro, 2.2, .75) +
          [...Array(12)].map((_, i) => ink(`M${440 + i * 90},${f1(560 + Math.abs(i - 6) * 26)} q${r.range(-10, 10)},60 ${r.range(-20, 20)},140`, 1.4, .35)).join('') +
          path('M300,780 Q900,760 1560,790 L1560,1200 L300,1200Z', '#c9a27a') + village + iglesia +
          path('M1500,800 Q2000,780 2600,800 L2600,1200 L1500,1200Z', '#b5532f') + jungle + cliff + falls + mist + rainbow + path('M1560,840 Q2040,820 2560,840 L2560,1000 L1560,1000Z', '#6f8a6a') + waves(850, '#88a484', { amp: 4, len: 50, x0: 1560, x1: 2560, bottom: 1000 }) +
          palm(1560, 900, 260, -30) + palm(2540, 910, 280, 40) + palm(2360, 930, 200, 20) + toucan +
          label(-160, 230, 'Buenos Aires', { sub: 'amanece sobre el río', rot: -4 }) +
          label(930, 200, 'Quebrada de Humahuaca', { sub: 'Jujuy', rot: -3 }) +
          label(2040, 270, 'Cataratas del Iguazú', { sub: 'Misiones', rot: 3 })) +
        layer(.85, cardon(470, 990, 190) + cardon(640, 1010, 150) + cardon(1280, 1000, 210) + cardon(1420, 990, 140) + fern(1640, 1010, 1.4) + fern(1820, 1030, 1.1) + fern(2300, 1020, 1.5)) +
        layer(1, paper(hills(34, 1040, 24, '#3b3326', { x0: -1400, x1: 3300 })) + grass(35, 300, -1400, 3300, 1030, 1090, '#2a2218', .7));
    },
    update(t, u, p, s) { qa(s, '.fall').forEach((f, i) => f.setAttribute('opacity', f1(.85 + .12 * Math.sin(t * 9 + i * 2)))); },
  });

  // ================================================================= E1 · L3  hombres y mujeres de buena voluntad (38.65)
  // Trabajo en el campo, todo en movimiento: carpida, cosecha, el gaucho con su caballo, el tractor, el molino
  function horseDraw(x, y, sc, ph, headBob = 0, tail = 0) {
    const leg = (lx, a, dark) => `<g transform="translate(${lx},-10) rotate(${f1(a)})">${rect(-7, 0, 14, 96, dark ? '#5a3a26' : '#6b4630', 'rx="5"')}${rect(-8, 86, 16, 10, '#2b1d14')}</g>`;
    const sw = Math.sin(ph) * 16;
    return `<g transform="translate(${f1(x)},${f1(y)}) scale(${sc})">` +
      leg(-52, sw, true) + leg(-30, -sw, false) + leg(44, -sw, true) + leg(62, sw, false) +
      `<g transform="rotate(${f1(tail)} -84 -24)">${path('M-88,-26 Q-112,4 -102,52 Q-92,20 -80,4Z', '#3a2618')}</g>` +
      ellipse(0, -22, 86, 36, '#7a5234') +
      `<g transform="rotate(${f1(headBob)} 60 -30)">${path('M48,-44 Q70,-100 96,-128 L122,-112 Q96,-80 78,-18Z', '#7a5234')}<g transform="translate(112,-120) rotate(28)">${ellipse(14, 0, 34, 15, '#7a5234')}${ellipse(40, 4, 11, 10, '#5a3a26')}${circle(8, -6, 3, '#1a120c')}</g>${path('M92,-136 L98,-156 L106,-134Z', '#5a3a26')}${path('M52,-46 Q70,-104 98,-132 L90,-126 Q64,-96 46,-40Z', '#3a2618')}</g>` +
      ink('M-86,-22 Q-80,-58 0,-58 Q40,-58 56,-50 M-86,-22 Q-84,14 -40,14 L50,12 Q80,4 80,-20', 1.8, .6) +
      path('M-30,-50 Q10,-62 40,-50 L36,-6 L-26,-6Z', '#8a3b2e', 'opacity=".9"') + ink('M-30,-50 Q10,-62 40,-50 L36,-6 L-26,-6Z', 1.4, .5) + '</g>';
  }
  S.push({
    id: 'campo', at: 38.65, cam: { x0: 110, y0: -70, z0: 1.1, x1: -110, y1: -90, z1: 1.17 },
    build() {
      const r = RNG(41); let wheat = '';
      for (let i = 0; i < 280; i++) { const x = r.range(-300, W + 300), y = r.range(900, 1110), h = r.range(26, 60); wheat += line(x, y, x + r.range(-6, 6), y - h, shade('#d9a441', r.range(-.2, .15)), 3) + ellipse(x, y - h, 3, 7, '#c98a2b'); }
      let rows = ''; for (let i = 0; i < 12; i++) { const x = 560 + i * 60; rows += path(`M${x},900 q-10,-26 0,-44 q10,18 0,44Z`, '#4f7a3a') + circle(x - 6, 872, 7, '#d9483a') + circle(x + 7, 884, 6, '#d9483a'); }
      const molino = g(line(0, 0, -40, -300, '#6b5a48', 6) + line(0, 0, 40, -300, '#6b5a48', 6) + line(-30, -80, 30, -80, '#6b5a48', 4) + line(-22, -160, 22, -160, '#6b5a48', 4) + line(-40, -300, 40, -300, '#6b5a48', 5) +
        `<g id="aspas" transform="translate(0,-320)">${[...Array(12)].map((_, i) => `<path d="M0,0 L${f1(Math.cos(i / 12 * 6.283 - .12) * 70)},${f1(Math.sin(i / 12 * 6.283 - .12) * 70)} L${f1(Math.cos(i / 12 * 6.283 + .12) * 70)},${f1(Math.sin(i / 12 * 6.283 + .12) * 70)}Z" fill="#d8d2c4" stroke="#2b211c" stroke-width="1.2" stroke-opacity=".6"/>`).join('')}${circle(0, 0, 8, '#6b5a48')}</g>` +
        path('M40,-320 L110,-330 L110,-310Z', '#b8413a') + ellipse(120, -10, 70, 18, '#8c96a4') + rect(50, -60, 140, 50, '#9aa4b2') + ink('M50,-60 L190,-60 M50,-35 L190,-35', 1.4, .5), 'transform="translate(1760,760) scale(.9)"');
      const fence = [...Array(22)].map((_, i) => rect(-200 + i * 110, 800, 8, 70, '#7a5a3a')).join('') + ink('M-200,815 L2220,810 M-200,840 L2220,835', 2, .55);
      return layer(0, sky([[0, '#6fa6e0'], [.55, '#cfe0ea'], [.8, '#f5dcaa'], [1, '#fbe7c0']])) +
        layer(.1, glow(1500, 520, 520, '#fff2c4', .9) + circle(1500, 520, 70, '#fff5d6')) +
        layer(.25, clouds(42, 5, 120, 380, '#fff', .8) + `<g id="birds"></g>`) +
        layer(.4, paper(hills(43, 700, 26, '#a9b36a')) + `<g id="tractor"></g>`) +
        layer(.5, molino) +
        layer(.55, paper(hills(44, 780, 20, '#c7a24c')) + fence + label(420, 470, 'la pampa', { sub: 'manos que trabajan la tierra', rot: -4, size: 66 })) +
        layer(.7, rows) +
        layer(.78, `<g id="people"></g>`) +
        layer(1, `<g id="wheat">${wheat}</g>` + grass(45, 200, -300, W + 300, 1000, 1090, '#8a6a2a', .7));
    },
    update(t, u, p, s) {
      q(s, '#aspas').setAttribute('transform', `translate(0,-320) rotate(${f1(u * 45)})`);
      q(s, '#wheat').setAttribute('transform', `translate(0,1100) skewX(${f1(Math.sin(t * 1.3) * 3)}) translate(0,-1100)`);
      // tractor que cruza al fondo levantando polvo
      const tx = -200 + u * 140, ty = 690;
      let tr = `<g transform="translate(${f1(tx)},${ty}) scale(.8)">${rect(0, -40, 90, 40, '#b8413a')}${rect(60, -70, 36, 32, '#b8413a')}${rect(66, -64, 22, 18, '#cfe2ef')}${line(20, -40, 14, -66, '#3a2c24', 4)}` +
        `<g transform="translate(20,0) rotate(${f1(u * 200)})">${circle(0, 0, 22, '#2b2b2b')}${ink('M-18,0 L18,0 M0,-18 L0,18', 3, .6)}</g><g transform="translate(80,4) rotate(${f1(u * 300)})">${circle(0, 0, 14, '#2b2b2b')}${ink('M-11,0 L11,0 M0,-11 L0,11', 2.4, .6)}</g></g>`;
      for (let i = 0; i < 6; i++) { const k = ((u * 1.5 + i / 6) % 1); tr += circle(tx - 10 - k * 90, ty - 8 - k * 30, 8 + k * 26, '#d9c79f', `opacity="${f1(.55 * (1 - k))}"`); }
      q(s, '#tractor').innerHTML = tr;
      let bd = ''; for (let i = 0; i < 5; i++) { const x = -100 + ((u * 110 + i * 170) % 2200), y = 200 + i * 26 + Math.sin(u * 2 + i) * 12, w = Math.sin(t * 9 + i) * 8; bd += ink(`M${f1(x - 14)},${f1(y - w)} Q${f1(x - 6)},${f1(y - 8)} ${f1(x)},${f1(y)} Q${f1(x + 6)},${f1(y - 8)} ${f1(x + 14)},${f1(y - w)}`, 2.6, .8); }
      q(s, '#birds').innerHTML = bd;
      // personas trabajando
      let pe = '';
      // 1) agricultor carpiendo con la azada
      { const x = 380, y = 1010, h = 300, uu = h / 100, lift = (Math.sin(t * 3.6) + 1) / 2, sy = y - 78 * uu;
        const h1 = [x + 12 * uu, sy + 22 * uu - 14 * uu * lift], h2 = [x + 22 * uu, sy + 30 * uu - 12 * uu * lift];
        const ang = Math.atan2(h2[1] - h1[1], h2[0] - h1[0]) + (.9 - lift * .9);
        const end = [h1[0] + Math.cos(ang) * 150, h1[1] + Math.sin(ang) * 150];
        pe += person(x, y, h, { color: '#3f6b8c', hat: '#d8c08a', skin: C.skin[1], legs: '#4a4038', jacket: '#6f5a44', armsPts: { l: [[14, 12], [h1[0] - (x - 10.8 * uu + 1.5 * uu), h1[1] - (sy + 1 * uu)].map(v => v / uu)], r: [[8, 16], [h2[0] - (x + 10.8 * uu - 1.5 * uu), h2[1] - (sy + 1 * uu)].map(v => v / uu)] } }) +
          line(h1[0] - Math.cos(ang) * 30, h1[1] - Math.sin(ang) * 30, end[0], end[1], '#7a5534', 7) + path(`M${f1(end[0])},${f1(end[1])} l${f1(Math.cos(ang + 1.57) * 30)},${f1(Math.sin(ang + 1.57) * 30)} l${f1(Math.cos(ang) * 10)},${f1(Math.sin(ang) * 10)}Z`, '#5a5a5a');
        if (lift < .15) for (let i = 0; i < 4; i++) pe += circle(end[0] + (i - 1.5) * 12, end[1] - 6 - i % 2 * 8, 5, '#8a6a3a', 'opacity=".7"'); }
      // 2) mujer cosechando tomates
      { const x = 780, y = 1020, h = 290, k = (Math.sin(t * 2.4) + 1) / 2;
        pe += ellipse(x - 60, y - 118, 56, 22, '#b07a3a') + ink(`M${x - 110},${y - 118} Q${x - 60},${y - 96} ${x - 10},${y - 118}`, 1.6, .6) + [...Array(6)].map((_, i) => circle(x - 94 + i * 14, y - 132, 9, '#d9483a')).join('') +
          person(x, y, h, { color: '#c0584a', style: 'bun', hair: C.hair[1], skin: C.skin[0], dress: true, armsPts: { l: [[-8, 14], [-18, 24]], r: [[8, 14 + k * 8], [14 + k * 6, 22 + k * 20]] } }) +
          circle(x + 10.8 * h / 100 + (14 + k * 6) * h / 100 - 1.5 * h / 100, y - 78 * h / 100 + (23 + k * 20) * h / 100, 9, '#d9483a'); }
      // 3) chico que corre y saluda
      { const cyc = (u * .35) % 2, dir = cyc < 1 ? 1 : -1, xx = 960 + (cyc < 1 ? cyc : 2 - cyc) * 180;
        pe += person(xx, 1040, 170, { color: '#d99a3c', pose: 'walk', phase: t * 12, skin: C.skin[3], style: 'curly', flip: dir < 0, armsPts: { l: [[-6, 14], [-4, 28]], r: [[8, -8], [10 + Math.sin(t * 8) * 4, -26]] } }); }
      // 4) gaucho que lleva el caballo de tiro
      { const walkX = 1330 - u * 22;
        pe += horseDraw(walkX + 170, 900, 1.35, t * 4, Math.sin(t * 2) * 4, Math.sin(t * 3) * 10) +
          person(walkX, 1010, 270, { color: '#8a3b2e', pose: 'walk', phase: t * 4, hat: '#2d241c', skin: C.skin[2], legs: '#e8e0d0', jacket: '#3a2c24', armsPts: { l: [[-6, 14], [-4, 28]], r: [[12, 8], [24, 6]] } }) +
          ink(`M${f1(walkX + 24 * 2.7 + 9)},${f1(1010 - 70 * 2.7)} Q${f1(walkX + 120)},${f1(1010 - 170)} ${f1(walkX + 170 + 150)},${f1(900 - 150)}`, 2, .8); }
      // 5) hombre que lleva un cajón de frutas caminando
      { const x = 1760 - u * 45, y = 1030, h = 290;
        pe += person(x, y, h, { color: '#5c6e9a', pose: 'walk', phase: t * 6, hair: C.hair[5], skin: C.skin[2], hat: '#c9b07a', flip: true, armsPts: { l: [[4, -14], [8, -30]], r: [[-4, -14], [-8, -30]] } }) +
          rect(x - 66, y - h - 34, 132, 58, '#a6793f', 'rx="6"') + ink(`M${f1(x - 66)},${f1(y - h - 14)} L${f1(x + 66)},${f1(y - h - 14)} M${f1(x - 66)},${f1(y - h + 6)} L${f1(x + 66)},${f1(y - h + 6)}`, 1.4, .5) + [...Array(5)].map((_, i) => circle(x - 44 + i * 22, y - h - 38, 11, ['#f2b632', '#e0913c', '#d9483a'][i % 3])).join(''); }
      q(s, '#people').innerHTML = pe;
    },
  });

  // ================================================================= E1 · L4  oyendo el llamado de su identidad (44.2)
  // Vitral (inspirado en los vitrales de la catedral de Rosario): Belgrano iza la bandera junto al río
  S.push({
    id: 'vitral', at: 44.2, cam: { x0: 0, y0: 40, z0: 1.12, x1: 0, y1: -20, z1: 1.0, ease: 'outQuad' },
    build() {
      const lead = '#1c1a22';
      const win = 'M600,1000 L600,420 Q600,120 960,60 Q1320,120 1320,420 L1320,1000Z';
      let glass = `<clipPath id="vw"><path d="${win}"/></clipPath><g clip-path="url(#vw)">`;
      // cielo en paneles
      const r = RNG(51); const cols = ['#74acdf', '#9cc4e8', '#5f98cf', '#b9d6f0', '#fbf8f1', '#8ab8e2'];
      for (let y = 40; y < 1000; y += 70) for (let x = 600; x < 1320; x += 90) glass += rect(x, y, 90, 70, r.pick(cols));
      glass += solDeMayo(1150, 260, 50, '#f2b632', '#c98a1b');
      glass += path('M600,760 Q800,700 960,740 Q1150,790 1320,720 L1320,1000 L600,1000Z', '#3f6fa8') + path('M600,820 Q820,780 960,810 Q1140,850 1320,800 L1320,1000 L600,1000Z', '#2f5b8e');
      glass += path('M600,880 L1320,860 L1320,1000 L600,1000Z', '#6b8f4a');
      // Belgrano (silueta) con la bandera en alto
      glass += person(880, 900, 330, { color: '#1f2c5a', pose: 'raise', skin: '#e7c3a1', hair: '#3b2a20', cape: '#2a3b70' });
      glass += line(1020, 900, 1040, 250, '#6b5a48', 10) + flag(1040, 250, 240, 150, 0, false, .08);
      glass += '</g>';
      // plomos del vitral
      let leads = `<g clip-path="url(#vw)" stroke="${lead}" stroke-width="7" fill="none" opacity=".9">`;
      for (let y = 110; y < 1000; y += 70) leads += `<path d="M600,${y + r.range(-8, 8)} L1320,${y + r.range(-8, 8)}"/>`;
      for (let x = 690; x < 1320; x += 90) leads += `<path d="M${x},40 L${x + r.range(-10, 10)},1000"/>`;
      leads += '</g>';
      const frame = `<path d="${win}" fill="none" stroke="#3a2e2a" stroke-width="40"/><path d="${win}" fill="none" stroke="#7a6655" stroke-width="12"/>`;
      return layer(0, rect(-300, -300, W + 600, H + 600, '#1d1a24') + glow(960, 500, 900, '#6b5a8a', .35)) +
        layer(.2, [...Array(10)].map((_, i) => rect(90 + i * 180, 0, 26, H, '#262230')).join('')) +
        layer(.6, glass + `<g opacity=".55" style="mix-blend-mode:screen">${leads}</g>` + leads + frame + `<g id="beams">${rays(960, 300, 300, 1600, 14, '#fff3d6', .10, 7)}</g>`) +
        layer(.8, glow(960, 1000, 520, '#ffe8b0', .35) + label(1600, 250, 'Manuel Belgrano', { sub: 'la Bandera · Rosario', rot: 4, color: '#f4e6c8' }));
    },
    update(t, u, p, s) { q(s, '#beams').setAttribute('opacity', .55 + .45 * Math.sin(u * 1.4)); },
  });

  // ================================================================= E2 · L5  Llega el sucesor del pescador (49.9)
  S.push({
    id: 'pescador', at: 49.9, cam: { x0: -120, y0: 20, z0: 1.0, x1: 120, y1: -10, z1: 1.1 },
    build() {
      const r = RNG(61);
      let net = '';
      for (let i = 0; i < 14; i++) net += `<path d="M${880 + i * 40},560 Q${900 + i * 38},760 ${800 + i * 46},960" stroke="#e8dcc0" stroke-width="2.5" fill="none" opacity=".8"/>`;
      for (let j = 0; j < 10; j++) net += `<path d="M${880 - j * 8},${590 + j * 40} Q1120,${600 + j * 40} ${1400 + j * 10},${580 + j * 42}" stroke="#e8dcc0" stroke-width="2.5" fill="none" opacity=".8"/>`;
      let fish = '';
      for (let i = 0; i < 12; i++) { const x = r.range(920, 1360), y = r.range(760, 940); fish += g(path('M0,0 q20,-12 40,0 q-20,12 -40,0z M40,0 l12,-9 l0,18z', '#cfe2ef'), `transform="translate(${f1(x)},${f1(y)}) rotate(${f1(r.range(-40, 40))})" class="fish"`); }
      const boat = path('M520,700 L1180,700 Q1140,800 1040,820 L640,820 Q560,800 520,700Z', '#6b4630') + ink('M540,735 L1165,735 M565,770 L1140,770 M600,800 L1090,800', 1.6, .55) + rect(520, 690, 660, 16, '#8a5a3b') + line(760, 700, 760, 330, '#5a3b26', 12) + path('M770,340 L770,660 L1000,660Z', '#efe3c8', 'opacity=".9"') + ink('M770,420 L850,660 M770,500 L920,660 M770,580 L960,660', 1.2, .4) + ink('M770,340 L770,660 L1000,660Z', 1.6, .6);
      const keys = g(`<g stroke="#ffe29a" stroke-width="10" fill="none" stroke-linecap="round"><path d="M-70,-70 L60,60 M40,40 l20,-4 M60,60 l-4,20"/><circle cx="-84" cy="-84" r="24"/><path d="M70,-70 L-60,60 M-40,40 l-20,-4 M-60,60 l4,20"/><circle cx="84" cy="-84" r="24"/></g>`, 'transform="translate(960,230) scale(1.1)" opacity=".5"');
      return layer(0, sky([[0, '#3d4f86'], [.5, '#e9a58a'], [.78, '#f8cf96'], [1, '#fbe3b8']])) +
        layer(.12, keys + glow(960, 560, 600, '#ffe4a8', .7)) +
        layer(.3, paper(hills(62, 600, 40, '#8b6a86')) + rect(-300, 600, W + 600, 600, '#e7a37e') + waves(612, '#d98c6e', { amp: 3, len: 70 })) +
        layer(.55, paper(boat) + person(700, 700, 190, { color: '#3f6b8c', pose: 'reach', back: true, skin: C.skin[2], hair: C.hair[1] }) +
          person(1040, 700, 180, { color: '#a9674a', pose: 'hold', back: true, skin: C.skin[1], hair: C.hair[0] })) +
        layer(.75, waves(800, '#c9765e', { amp: 8, len: 120 }) + g(net + fish, 'id="net"')) +
        layer(1, waves(990, '#a55a4a', { amp: 14, len: 220, phase: 1 }) + [...Array(12)].map((_, i) => ink(`M${-200 + i * 190},${1020 + (i % 3) * 30} q24,-8 48,0 q24,8 48,0`, 2, .4)).join(''));
    },
    update(t, u, p, s) { q(s, '#net').setAttribute('transform', `translate(0 ${f1(-u * 14)})`); },
  });

  // ================================================================= E2 · L6  el siervo de los siervos de Dios (55.5)
  // Viernes Santo: figura de blanco, descalza, con la cruz al hombro; arcos del Coliseo y velas
  S.push({
    id: 'siervo', at: 55.5, cam: { x0: 80, y0: 0, z0: 1.02, x1: -80, y1: -10, z1: 1.08 },
    build() {
      let arches = '';
      for (let row = 0; row < 3; row++) for (let i = 0; i < 16; i++) { const x = -200 + i * 150, y = 200 + row * 150; arches += path(`M${x},${y + 140} L${x},${y + 50} Q${x + 55},${y - 10} ${x + 110},${y + 50} L${x + 110},${y + 140}Z`, '#10162c'); }
      const colosseum = rect(-300, 180, W + 600, 480, '#3a3350') + bricks(-300, 180, W + 600, 480, { bw: 70, bh: 28, op: .3, seed: 73 }) + arches + ink('M-300,340 L2220,340 M-300,490 L2220,490 M-300,640 L2220,640', 2.4, .6);
      const r = RNG(71); let candles = '';
      for (let i = 0; i < 90; i++) { const x = r.range(-300, W + 300), y = r.range(760, 860); candles += g(glow(x, y - 14, 26, '#ffd98a', .7) + rect(x - 2, y - 10, 4, 14, '#f4efe6') + ellipse(x, y - 14, 3, 6, '#ffe7a0'), 'class="cd"'); }
      const walker = g(
        person(0, 0, 330, { color: C.robe, robe: true, pose: 'carry', skin: C.skin[0], hair: '#d8d2c8', cap: '#fbf8f1', back: true }) +
        // cruz de madera sobre el hombro
        `<g transform="translate(22,-260) rotate(28)">${rect(-12, -40, 24, 360, '#7a5534')}${rect(-90, 20, 180, 22, '#7a5534')}</g>` +
        // pies descalzos
        ellipse(-14, 2, 14, 6, C.skin[0]) + ellipse(16, 2, 14, 6, C.skin[0]), 'id="walker"');
      return layer(0, sky([[0, '#0b1024'], [.6, '#1d2345'], [1, '#2c2a4a']]) + circle(1560, 180, 60, '#f3efe0') + glow(1560, 180, 200, '#cfd6ff', .35)) +
        layer(.3, paper(colosseum)) +
        layer(.55, crowd(72, 60, -300, W + 300, 700, 820, 60, 110, { colors: ['#2b2f48', '#353a58', '#2a2d44'], pose: 'pray', children: .1, back: true }) + candles) +
        layer(.8, `<g transform="translate(980,930)">${walker}</g>`) +
        layer(1, rect(-300, 960, W + 600, 300, '#141627') + glow(980, 900, 380, '#fff4d6', .25) + label(420, 150, 'Viernes Santo', { sub: 'Vía Crucis', rot: -3, color: '#f4e6c8' }));
    },
    update(t, u, p, s) {
      const w = q(s, '#walker'); w.setAttribute('transform', `translate(${f1(-140 + u * 38)} ${f1(Math.abs(Math.sin(u * 2.2)) * -6)})`);
      qa(s, '.cd').forEach((c, i) => c.setAttribute('opacity', f1(.75 + .25 * Math.sin(t * 7 + i * 1.7))));
    },
  });

  // ================================================================= E2 · L7  Vamos a su encuentro creciendo en unidad (61.6)
  S.push({
    id: 'peregrinacion', at: 61.6, cam: { x0: 0, y0: -40, z0: 1.12, x1: 0, y1: 40, z1: .98, ease: 'inOutSine' },
    build() {
      const road = 'M860,560 Q900,620 820,700 Q700,820 760,920 Q820,1040 620,1300 L1340,1300 Q1140,1040 1120,920 Q1100,800 1000,700 Q940,620 900,560Z';
      const r = RNG(81); let walkers = '';
      const along = (k) => { // punto sobre el camino (0 lejos … 1 cerca)
        const pts = [[880, 560], [900, 620], [820, 700], [710, 820], [780, 920], [900, 1080], [980, 1300]];
        const f = k * (pts.length - 1), i = Math.min(pts.length - 2, Math.floor(f)), a = f - i;
        return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * a, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * a];
      };
      for (let i = 0; i < 120; i++) {
        const k = Math.pow(r(), .7), [x, y] = along(k), spread = 30 + k * 260;
        const h = 14 + k * 190;
        walkers += `<g class="wk" data-k="${f1(k * 1000) / 1000}" data-o="${f1(r.range(-1, 1) * spread)}" data-p="${f1(r() * 6)}" data-c="${r.pick(C.cloth)}" data-s="${r.pick(C.skin)}" data-h="${f1(h)}" data-fl="${r() < .12 ? 1 : 0}"></g>`;
      }
      return layer(0, sky([[0, '#5c8fcc'], [.55, '#f6c89a'], [1, '#fde6b8']])) +
        layer(.1, glow(960, 520, 700, '#fff0c4', .95) + rays(960, 540, 60, 1500, 30, '#fff6d8', .12, 6)) +
        layer(.3, paper(mountains(82, 560, 70, '#9a8fb0', { rough: .5 }))) +
        layer(.5, paper(hills(83, 600, 30, '#9fb070'))) +
        layer(.7, paper(hills(84, 760, 60, '#7fa060') + path(road, '#e8d3a8')) + ink(road, 1.8, .5) + grass(87, 200, -300, W + 300, 700, 860, '#4f7a47', .6)) +
        layer(.85, `<g id="walkers">${walkers}</g>`) +
        layer(1, paper(path('M-300,1100 Q300,980 700,1080 L700,1400 L-300,1400Z', '#4f7a47') + path('M1300,1080 Q1700,960 2220,1060 L2220,1400 L1300,1400Z', '#4f7a47')) + grass(85, 220, -300, 700, 1040, 1100, '#2f5a2f', .8) + grass(86, 220, 1300, 2220, 1020, 1100, '#2f5a2f', .8));
    },
    init(div) {},
    update(t, u, p, s) {
      if (!s._wk) s._wk = qa(s, '.wk').map(e => ({ e, k: +e.dataset.k, o: +e.dataset.o, p: +e.dataset.p, c: e.dataset.c, s: e.dataset.s, h: +e.dataset.h, fl: +e.dataset.fl }));
      const pts = [[880, 560], [900, 620], [820, 700], [710, 820], [780, 920], [900, 1080], [980, 1300]];
      const along = (k) => { const f = clamp(k) * (pts.length - 1), i = Math.min(pts.length - 2, Math.floor(f)), a = f - i; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * a, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * a]; };
      // la columna avanza hacia el horizonte y se van sumando personas
      const grow = .35 + .65 * pr(u, 0, 4.5);
      s._wk.sort((a, b) => a.k - b.k);
      let html = '';
      for (const w of s._wk) {
        const k = w.k - u * .035; if (k < 0) continue;
        if (w.k > grow) continue;
        const [x, y] = along(k); const h = 14 + k * 190;
        let fig = person(x + w.o * (k * .9 + .1), y, h, { color: w.c, skin: w.s, pose: 'walk', phase: t * 6 + w.p, back: true, hair: C.hair[Math.floor(w.p) % 6] });
        if (w.fl && h > 40) fig += flag(x + w.o * (k * .9 + .1) + h * .12, y - h * 1.35, h * .5, h * .32, t * 4 + w.p, true, .1);
        html = fig + html;
      }
      q(s, '#walkers').innerHTML = html;
    },
  });

  // ================================================================= E2 · L8  a escuchar al peregrino de la paz (66.8)
  S.push({
    id: 'balcon', at: 66.8, cam: { x0: 0, y0: -60, z0: 1.18, x1: 0, y1: 30, z1: 1.0, ease: 'inOutSine' },
    build() {
      let cols = '';
      for (let i = 0; i < 10; i++) cols += rect(160 + i * 170, 120, 56, 560, '#e9dfcc') + ink(`M${172 + i * 170},130 L${172 + i * 170},680 M${188 + i * 170},130 L${188 + i * 170},680 M${204 + i * 170},130 L${204 + i * 170},680`, 1.2, .3) + rect(150 + i * 170, 110, 76, 22, '#d8ccb4');
      const facade = rect(-300, 60, W + 600, 700, '#f1e6d2') + bricks(-300, 130, W + 600, 630, { bw: 90, bh: 36, op: .18, seed: 92 }) + rect(-300, 60, W + 600, 60, '#d8ccb4') + cols +
        // loggia central
        path('M780,700 L780,330 Q960,200 1140,330 L1140,700Z', '#2b2438') +
        rect(740, 640, 440, 40, '#d8ccb4') + path('M800,640 L1120,640 L1100,720 L820,720Z', '#b8323a') + path('M820,660 L1100,660', 'none', 'stroke="#ffd98a" stroke-width="4"');
      const pope = person(960, 650, 230, { color: C.robe, robe: true, pose: 'bless', skin: C.skin[0], hair: '#d8d2c8', cap: '#fbf8f1', back: true, cape: '#f7f4ee' });
      return layer(0, sky([[0, '#7fb0e0'], [1, '#e8f1f8']])) +
        layer(.2, paper(facade)) +
        layer(.35, g(pope, 'id="pope"') + glow(960, 480, 300, '#fff4d0', .45) + `<g id="brays">${rays(960, 450, 120, 1300, 24, '#fff7dc', .16, 6)}</g>`) +
        layer(.6, `<g id="doves"></g>`) +
        layer(.9, crowd(91, 70, -300, W + 300, 900, 1120, 150, 260, { back: true, pose: (r) => r.pick(['raise', 'wave', 'stand', 'raise']), children: 0 }));
    },
    update(t, u, p, s) {
      let d = '';
      for (let i = 0; i < 7; i++) { const tt = u - .8 - i * .25; if (tt < 0) continue; const x = 960 + (i - 3) * 70 + tt * (i - 3) * 90, y = 420 - tt * 130 - i * 12; d += dove(x, y, .7 + (i % 3) * .12, t * 10 + i); }
      q(s, '#doves').innerHTML = d;
      q(s, '#brays').setAttribute('transform', `rotate(${f1(u * 3)} 960 450)`);
    },
  });
})();
