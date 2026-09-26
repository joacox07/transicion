/* Escenas: estribillo 1, estrofa 3 y estrofa 4 */
(() => {
  const { grass, hatch, bricks, windowBox, tree, ink, W, H, RNG, C, g, path, rect, circle, ellipse, line, poly, paper, layer, sky, glow, rays, solDeMayo, clouds, mountains, hills, waves, person, shade, crowd, flag, dove, cross, f1 } = LIB;
  const S = window.SCENES;
  const q = (s, sel) => s.el.querySelector(sel);
  const qa = (s, sel) => [...s.el.querySelectorAll(sel)];
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const pr = (t, a, b) => clamp((t - a) / (b - a));
  const ease = x => -(Math.cos(Math.PI * x) - 1) / 2;
  window.SC = { q, qa, pr, ease, clamp };

  /** banderas que flamean: se regeneran en cada cuadro */
  const flagsSpec = (seed, n, x0, x1, y0, y1, s0, s1) => { const r = RNG(seed); return [...Array(n)].map(() => { const k = r(); return { x: r.range(x0, x1), y: y0 + (y1 - y0) * k, s: s0 + (s1 - s0) * k, p: r() * 6 }; }).sort((a, b) => a.y - b.y); };
  const drawFlags = (spec, t) => spec.map(f => flag(f.x, f.y, f.s * 1.55, f.s, t * 3.2 + f.p, true, .1)).join('');

  /** Virgen de Luján estilizada: manto triangular celeste y blanco, corona de rayos */
  function virgenLujan(x, y, h) {
    const w = h * .62;
    return g(
      glow(x, y - h * .55, h * .9, '#fff2c8', .55) +
      rays(x, y - h * .9, h * .12, h * .5, 24, '#ffd98a', .75, 5) +
      path(`M${x},${y - h * .92} L${x + w / 2},${y} L${x - w / 2},${y}Z`, '#f8f4ea') +
      path(`M${x},${y - h * .8} L${x + w * .42},${y} L${x + w * .18},${y} L${x},${y - h * .55} L${x - w * .18},${y} L${x - w * .42},${y}Z`, C.celeste) +
      path(`M${x - w * .5},${y} L${x + w * .5},${y} L${x + w * .44},${y + h * .08} L${x - w * .44},${y + h * .08}Z`, '#e9d7a8') +
      circle(x, y - h * .8, h * .07, '#e7c3a1') + path(`M${x - h * .08},${y - h * .83} Q${x},${y - h * .98} ${x + h * .08},${y - h * .83} L${x + h * .09},${y - h * .72} L${x - h * .09},${y - h * .72}Z`, '#f8f4ea') +
      path(`M${x - h * .07},${y - h * .9} L${x - h * .07},${y - h * .99} L${x - h * .035},${y - h * .94} L${x},${y - h * 1.0} L${x + h * .035},${y - h * .94} L${x + h * .07},${y - h * .99} L${x + h * .07},${y - h * .9}Z`, C.gold) +
      path(`M${x - h * .05},${y - h * .64} L${x},${y - h * .7} L${x + h * .05},${y - h * .64} L${x},${y - h * .6}Z`, '#f3e3c3') +
      path(`M${x - w * .1},${y - h * .3} L${x + w * .1},${y - h * .3} L${x + w * .06},${y - h * .1} L${x - w * .06},${y - h * .1}Z`, C.celesteD, 'opacity=".5"'));
  }
  window.virgenLujan = virgenLujan;

  /** custodia (hostia en sol dorado) */
  function monstrance(x, y, s) {
    return g(
      rays(x, y, 60 * s, 250 * s, 32, C.gold, 1, 5) + rays(x, y, 60 * s, 190 * s, 32, C.goldL, 1, 5, 5.6) +
      circle(x, y, 92 * s, C.goldD) + circle(x, y, 80 * s, C.gold) + circle(x, y, 62 * s, '#fffaf0') + circle(x, y, 62 * s, 'none', `stroke="#e8dcc0" stroke-width="${2 * s}"`) +
      cross(x, y + 30 * s, 50 * s, '#efe4cc', 6 * s) +
      rect(x - 9 * s, y + 92 * s, 18 * s, 150 * s, C.goldD) + ellipse(x, y + 150 * s, 26 * s, 12 * s, C.gold) +
      path(`M${x - 90 * s},${y + 300 * s} Q${x},${y + 230 * s} ${x + 90 * s},${y + 300 * s}Z`, C.goldD) + cross(x, y - 250 * s, 70 * s, C.gold, 12 * s));
  }
  window.monstrance = monstrance;

  // ================================================================= C1 · Como pueblo seamos uno (72.5) — Plaza de Mayo
  const fl1 = flagsSpec(101, 26, -200, W + 200, 640, 900, 40, 110);
  S.push({
    id: 'plaza', at: 72.5, cam: { x0: -60, y0: 20, z0: 1.12, x1: 60, y1: -10, z1: 1.0 },
    build() {
      let arches = '';
      for (let i = 0; i < 9; i++) arches += path(`M${620 + i * 80},560 L${620 + i * 80},480 Q${655 + i * 80},440 ${690 + i * 80},480 L${690 + i * 80},560Z`, '#c98f86');
      const casa = rect(560, 300, 800, 300, '#e7aaa0') + rect(560, 290, 800, 20, '#d6958b') + arches + rect(900, 200, 120, 110, '#e7aaa0') + path('M890,200 L960,150 L1030,200Z', '#d6958b') + rect(1340, 330, 220, 270, '#e2a397') +
        [...Array(9)].map((_, i) => windowBox(628 + i * 80, 340, 44, 70, { glass: '#8fa9c8', frame: '#f4e2dc', arch: true })).join('') + [...Array(3)].map((_, i) => windowBox(1370 + i * 66, 370, 40, 64, { glass: '#8fa9c8', frame: '#f4e2dc' })).join('') +
        windowBox(935, 230, 50, 60, { glass: '#8fa9c8', frame: '#f4e2dc', arch: true }) + rect(900, 424, 120, 10, '#c98f86') + ink('M900,424 L1020,424 M906,424 L906,440 M1014,424 L1014,440', 1.6, .6) +
        ink('M560,310 L1360,310 M560,430 L1360,430', 1.4, .45) + line(960, 150, 960, 90, '#6b5a48', 4) + flag(960, 92, 60, 38, 0, false);
      const piramide = rect(250, 640, 90, 30, '#f4efe6') + path('M262,640 L277,340 L313,340 L328,640Z', '#f7f3ea') + ink('M266,560 L324,560 M270,480 L320,480 M273,410 L317,410', 1.4, .5) + solDeMayo(295, 600, 12) + rect(270, 330, 50, 14, '#e9e2d4') + person(295, 332, 70, { color: '#f7f3ea', skin: '#f7f3ea', hair: '#f7f3ea', robe: true, pose: 'raise' });
      return layer(0, sky([[0, '#6fa3dc'], [.6, '#bcd7ee'], [1, '#f3e6cf']])) +
        layer(.12, clouds(102, 6, 60, 260, '#fff', .8)) +
        layer(.3, paper(casa) + rect(-300, 598, W + 600, 20, '#b8ad9c')) +
        layer(.45, paper(piramide) + rect(-300, 640, W + 600, 600, '#cfc4b2') + [...Array(14)].map((_, i) => ink(`M${-300 + i * 180},640 L${-900 + i * 300},1200`, 1.2, .3)).join('') + [...Array(6)].map((_, i) => ink(`M-300,${680 + i * 70} L2220,${680 + i * 70}`, 1.2, .25)).join('')) +
        layer(.75, crowd(103, 170, -300, W + 300, 650, 1080, 40, 190, { back: true, pose: r => r.pick(['raise', 'wave', 'stand', 'raise', 'stand']), children: .15 }) + `<g id="flags"></g>`) +
        layer(1, glow(960, 300, 700, '#fff6dc', .25));
    },
    update(t, u, p, s) { q(s, '#flags').innerHTML = drawFlags(fl1, t); },
  });

  // ================================================================= C1 · Como Iglesia seamos uno (78.3) — plaza de San Pedro
  S.push({
    id: 'sanpedro', at: 78.3, cam: { x0: 0, y0: -40, z0: 1.0, x1: 0, y1: 20, z1: 1.12, ease: 'inOutSine' },
    build() {
      const stone = '#efe6d4', stoneD = '#d8ccb4';
      const dome = path('M760,300 Q760,120 960,90 Q1160,120 1160,300Z', '#dfe4e8') + rect(750, 290, 420, 40, stoneD) + path('M940,92 L960,40 L980,92Z', stone) + circle(960, 36, 10, '#e9c46a') +
        [...Array(9)].map((_, i) => line(790 + i * 42.5, 300, 900 + i * 15, 110, '#c8ced6', 3)).join('');
      let facCols = ''; for (let i = 0; i < 10; i++) facCols += rect(620 + i * 72, 380, 30, 230, '#e5dac5');
      const facade = rect(590, 330, 740, 280, stone) + rect(580, 320, 760, 30, stoneD) + facCols + [...Array(9)].map((_, i) => windowBox(655 + i * 72, 400, 22, 44, { glass: '#7a7060', frame: '#efe6d4', arch: true })).join('') + windowBox(935, 360, 50, 30, { glass: '#5f6a7a', frame: '#efe6d4', arch: true }) + path('M900,610 L900,500 Q960,460 1020,500 L1020,610Z', '#8a7a66') +
        [...Array(13)].map((_, i) => person(608 + i * 58, 330, 28, { color: stone, skin: stone, hair: stone, robe: true, pose: 'stand' })).join('');
      let colon = '';
      for (let side of [-1, 1]) for (let i = 0; i < 16; i++) { const a = i / 15, x = 960 + side * (380 + a * 560), y = 610 + Math.sin(a * Math.PI * .9) * 190; colon += rect(x - 10, y - 90 + a * 20, 20, 90 - a * 20 + 10, stoneD) ; }
      const colonnade = path('M590,560 Q260,640 330,800 L420,800 Q380,660 620,610Z', stone) + path('M1330,560 Q1660,640 1590,800 L1500,800 Q1540,660 1300,610Z', stone) + colon;
      const obelisk = path('M946,860 L952,560 L968,560 L974,860Z', '#e9e0cc') + path('M952,560 L960,540 L968,560Z', '#e9e0cc') + cross(960, 540, 22, C.gold, 3);
      return layer(0, sky([[0, '#8fb9e6'], [.6, '#f4dcb8'], [1, '#fbe9cc']])) +
        layer(.1, glow(960, 150, 600, '#fff4d8', .6)) +
        layer(.3, paper(dome + facade)) +
        layer(.5, paper(colonnade) + path('M300,640 Q960,560 1620,640 L1800,1200 L120,1200Z', '#d9ccb3') + ellipse(960, 860, 700, 150, '#cfc0a4')) +
        layer(.62, paper(obelisk)) +
        layer(.78, crowd(111, 260, 160, 1760, 700, 1000, 14, 60, { pose: r => r.pick(['stand', 'raise', 'wave']), children: .1 })) +
        layer(1, crowd(112, 50, -300, W + 300, 1040, 1160, 180, 240, { back: true, pose: r => r.pick(['raise', 'wave', 'stand']), children: 0 }));
    },
  });

  // ================================================================= C1 · Con María seamos uno (83.9) — Basílica de Luján
  S.push({
    id: 'lujan', at: 83.9, cam: { x0: 90, y0: 0, z0: 1.08, x1: -60, y1: -20, z1: 1.0 },
    build() {
      const b = '#e6e1d8', bd = '#c9c1b3';
      const spire = x => rect(x - 55, 260, 110, 400, b) + bricks(x - 55, 270, 110, 390, { bw: 36, bh: 18, op: .22, seed: x }) + ink(`M${x - 55},260 L${x},20 L${x + 55},260 M${x - 28},150 L${x + 28},150`, 1.4, .5) + path(`M${x - 55},260 L${x},20 L${x + 55},260Z`, bd) + path(`M${x - 30},340 L${x - 30},300 Q${x},270 ${x + 30},300 L${x + 30},340Z`, '#6d7a9a') + cross(x, 20, 40, '#b8ad9c', 6) +
        [...Array(3)].map((_, i) => path(`M${x - 40 + i * 30},${660 - 60} l0,-110 q15,-20 30,0 l0,110z`, '#8c93aa')).join('');
      const basilica = spire(760) + spire(1160) + rect(815, 330, 290, 330, b) + path('M815,330 L960,190 L1105,330Z', bd) + circle(960, 390, 62, '#5f7fb8') + circle(960, 390, 62, 'none', `stroke="${bd}" stroke-width="10"`) +
        [...Array(8)].map((_, i) => line(960, 390, 960 + Math.cos(i / 8 * 6.283) * 60, 390 + Math.sin(i / 8 * 6.283) * 60, bd, 4)).join('') +
        path('M900,660 L900,520 Q960,460 1020,520 L1020,660Z', '#6b5a48') + rect(640, 650, 640, 30, bd);
      return layer(0, sky([[0, '#5b86c5'], [.55, '#c9b7d9'], [1, '#f7dcc0']])) +
        layer(.1, glow(960, 300, 700, '#fff0cf', .55) + clouds(121, 5, 80, 300, '#fff', .6)) +
        layer(.35, paper(basilica) + rect(-300, 676, W + 600, 600, '#c6b89e')) +
        layer(.55, `<g id="lflags"></g>`) +
        layer(.7, crowd(122, 90, -300, W + 300, 700, 900, 40, 120, { back: true, pose: 'walk', colors: [C.celeste, '#fbf8f1', ...C.cloth.slice(0, 5)] })) +
        layer(.9, paper(virgenLujan(330, 1020, 520)) + glow(330, 760, 380, '#fff4d0', .4)) +
        layer(1, crowd(123, 18, 700, W + 300, 1060, 1140, 200, 250, { back: true, pose: r => r.pick(['pray', 'raise', 'stand']), children: .2, colors: [C.celeste, C.celesteD, '#fbf8f1', '#d6d0c4'] }));
    },
  });

  S.find(x => x.id === 'lujan').update = (t, u, p, s) => {
    q(s, '#lflags').innerHTML = [...Array(8)].map((_, i) => { const x = -160 + i * 300 + (i > 3 ? 260 : 0); return line(x, 420, x, 720, '#6b5a48', 6) + flag(x, 420, 120, 78, t * 3 + i, false, .1); }).join('');
  };

  // ================================================================= C1 · Que en el Uno seamos uno (89.7 → 100.3) — Eucaristía
  S.push({
    id: 'eucaristia', at: 89.7, cam: { x0: 0, y0: 30, z0: 1.0, x1: 0, y1: -60, z1: 1.28, ease: 'inOutSine' },
    build() {
      return layer(0, rect(-300, -300, W + 600, H + 600, '#1c1420') + glow(960, 420, 1100, '#7a4a3a', .6)) +
        layer(.15, `<g id="rr">${rays(960, 420, 120, 1600, 40, '#ffd98a', .12, 5)}</g>` + glow(960, 420, 700, '#ffe2a0', .55)) +
        layer(.4, [...Array(6)].map((_, i) => { const x = 520 + i * 176; return rect(x - 8, 560, 16, 120, '#f4efe6') + g(glow(x, 548, 40, '#ffd98a', .8) + ellipse(x, 548, 6, 12, '#ffe7a0'), `class="fl" data-i="${i}"`); }).join('') +
          paper(rect(420, 680, 1080, 40, '#e9dfcc') + rect(460, 720, 1000, 300, '#f4efe6') + rect(460, 720, 1000, 30, '#c9a24a') + cross(960, 980, 150, '#c9a24a', 14))) +
        layer(.55, monstrance(960, 420, 1.0)) +
        layer(.85, [...Array(7)].map((_, i) => person(200 + i * 250 + (i % 2) * 40, 1120, 240, { color: shade(C.cloth[i], -.55), skin: '#3a2a22', hair: '#1f1612', pose: 'kneel', back: true })).join('')) +
        layer(1, `<g id="white">${rect(-300, -300, W + 600, H + 600, '#fffaf0')}</g>`);
    },
    update(t, u, p, s) {
      q(s, '#rr').setAttribute('transform', `rotate(${f1(u * 2.4)} 960 420)`);
      qa(s, '.fl').forEach((f, i) => f.setAttribute('opacity', f1(.8 + .2 * Math.sin(t * 8 + i))));
      // al final (interludio) la luz blanca invade el cuadro y da paso a la estrofa 3
      q(s, '#white').setAttribute('opacity', f1(ease(pr(t, 97.6, 100.4)) * .92));
    },
  });

  // ================================================================= E3 · Abrid el corazón de par en par (100.3) — lago patagónico
  S.push({
    id: 'corazon', at: 100.3, xf: 1.4, cam: { x0: -80, y0: 0, z0: 1.12, x1: 60, y1: 0, z1: 1.0 },
    build() {
      const heart = 'M0,12 C0,-6 -24,-10 -24,6 C-24,20 -6,30 0,40 C6,30 24,20 24,6 C24,-10 0,-6 0,12Z';
      return layer(0, sky([[0, '#f3b48a'], [.45, '#f9d8a8'], [1, '#fdf0d6']])) +
        layer(.1, glow(1300, 470, 520, '#fff4d0', .9) + circle(1300, 470, 60, '#fff6dc')) +
        layer(.3, paper(mountains(131, 560, 230, '#8d86a8', { n: 6, snow: { frac: .28, color: '#f8f6f2' } }))) +
        layer(.45, paper(mountains(132, 600, 120, '#6f7fa0', { n: 8 }))) +
        layer(.55, rect(-300, 600, W + 600, 600, '#7ea6c8') + g([...Array(14)].map((_, i) => line(-200 + i * 170, 640 + (i % 4) * 40, -120 + i * 170, 640 + (i % 4) * 40, '#e9f2f8', 3, 'opacity=".6"')).join(''), 'id="shimmer"') + path('M1300,610 L1240,900 L1360,900Z', '#fff4d6', 'opacity=".25"')) +
        layer(.75, grass(133, 260, -300, W + 300, 900, 1080, '#2f4f2a', .7) + paper(path('M-300,900 Q300,820 900,880 Q1200,920 1500,860 L2220,900 L2220,1300 L-300,1300Z', '#4f6f47') + [...Array(8)].map((_, i) => g(path('M0,0 L-40,-120 L-10,-120 L-50,-210 L-20,-210 L-45,-300 L0,-380 L45,-300 L20,-210 L50,-210 L10,-120 L40,-120Z', '#2f5a3a') + rect(-8, 0, 16, 30, '#5a3b26'), `transform="translate(${-200 + i * 110},${900 + (i % 3) * 20}) scale(${.7 + (i % 3) * .15})"`)).join(''))) +
        layer(.95, person(1240, 1130, 470, { color: '#7d5a8c', pose: 'heart', long: true, hair: C.hair[1], skin: C.skin[1] }) + `<g id="hglow">${glow(1218, 824, 130, '#ffcf7a', .95)}${path(heart, '#ff9f7a', 'transform="translate(1218,800) scale(1.7)"')}</g>`);
    },
    update(t, u, p, s) {
      const k = .5 + .5 * Math.sin(u * 3.2);
      q(s, '#hglow').setAttribute('opacity', f1(pr(u, .6, 1.6) * (.65 + .35 * k)));
      q(s, '#shimmer').setAttribute('transform', `translate(${f1(Math.sin(u) * 20)} 0)`);
    },
  });

  // ================================================================= E3 · allí donde Dios quiere habitar (105.8) — retiro al aire libre
  S.push({
    id: 'habitar', at: 105.8, cam: { x0: 40, y0: 20, z0: 1.0, x1: -40, y1: -10, z1: 1.1 },
    build() {
      const r = RNG(141);
      const tr = (x, y, s) => tree(x, y + 40, s * .9, '#4b7a4a', x);
      let flowers = ''; for (let i = 0; i < 160; i++) flowers += circle(r.range(-300, W + 300), r.range(820, 1100), r.range(3, 6), r.pick(['#fff4e0', '#ffd98a', '#f4a8b8', '#c9b8f0']));
      return layer(0, sky([[0, '#9cc4e8'], [.6, '#e9f0d8'], [1, '#f6efd6']])) +
        layer(.15, glow(960, 180, 700, '#fff8dc', .95) + `<g id="beams">${rays(960, -200, 200, 1800, 12, '#fffbe8', .22, 4)}</g>`) +
        layer(.35, paper(hills(142, 640, 50, '#9fc07a'))) +
        layer(.5, paper(tr(200, 760, 1.2) + tr(1720, 780, 1.3) + tr(1500, 720, .9) + tr(420, 700, .8)) + paper(hills(143, 760, 30, '#86b066'))) +
        layer(.65, paper(g(rect(946, 560, 28, 240, '#8a5a3b') + rect(890, 610, 140, 26, '#8a5a3b'))) + ellipse(960, 800, 90, 16, '#6c8f5a')) +
        layer(.8, person(700, 960, 220, { color: '#c0584a', pose: 'kneel', back: true, long: true, hair: C.hair[3], skin: C.skin[0] }) +
          person(900, 990, 240, { color: '#3f6b8c', pose: 'kneel', back: true, skin: C.skin[2], hair: C.hair[0] }) +
          person(1120, 975, 200, { color: '#d99a3c', pose: 'kneel', back: true, long: true, hair: C.hair[4], skin: C.skin[4] }) +
          person(1300, 950, 150, { color: '#4f7f7a', pose: 'kneel', back: true, skin: C.skin[1], hair: C.hair[1] })) +
        layer(1, flowers + grass(144, 300, -300, W + 300, 820, 1090, '#4f7a3a', .7));
    },
    update(t, u, p, s) { q(s, '#beams').setAttribute('opacity', f1(.7 + .3 * Math.sin(u * 1.3))); },
  });

  // ================================================================= E3 · Desplegando toda nuestra humanidad (111.5) — pequeños y solidaridad
  S.push({
    id: 'humanidad', at: 111.5, cam: { x0: -60, y0: 0, z0: 1.06, x1: 60, y1: 0, z1: 1.0 },
    build() {
      const r = RNG(151);
      let bunting = ''; for (let i = 0; i < 24; i++) { const x = -200 + i * 100, y = 180 + Math.sin(i / 24 * Math.PI) * 60; bunting += path(`M${x},${y} L${x + 90},${y + (i % 2 ? 6 : -6)} L${x + 45},${y + 60}Z`, r.pick([C.celeste, '#fbf8f1', C.gold, '#e98a7a', '#8fb870'])); }
      const table = rect(420, 760, 1080, 30, '#a6793f') + path('M410,752 L1510,752 L1530,850 L390,850Z', '#f4efe6') + hatch('M410,752 L1510,752 L1530,850 L390,850Z', { angle: 0, gap: 18, color: '#d9534a', op: .5, w: 5, bbox: [380, 740, 1540, 860] }) + hatch('M410,752 L1510,752 L1530,850 L390,850Z', { angle: 90, gap: 18, color: '#d9534a', op: .5, w: 5, bbox: [380, 740, 1540, 860] }) + rect(440, 790, 20, 200, '#7a5534') + rect(1460, 790, 20, 200, '#7a5534') +
        [...Array(7)].map((_, i) => ellipse(520 + i * 150, 750, 46, 14, '#f4efe6') + ellipse(520 + i * 150, 744, 36, 8, '#e0a45a')).join('') + ellipse(960, 736, 70, 26, '#c98a3b');
      return layer(0, sky([[0, '#f5c99a'], [1, '#fdecd0']])) +
        layer(.2, paper(rect(-300, 300, W + 600, 480, '#e6c9a0') + bricks(-300, 300, W + 600, 480, { bw: 60, bh: 26, op: .15, seed: 152 }) + [...Array(6)].map((_, i) => windowBox(-100 + i * 380, 400, 150, 200, { glass: '#a9c8de', frame: '#fbf3e4' }) + rect(-110 + i * 380, 606, 170, 30, '#b8674a') + [...Array(4)].map((_, k) => circle(-90 + i * 380 + k * 44, 598, 16, ['#e05a5a', '#f2b632', '#e98ab0', '#fff'][k])).join('')).join(''))) +
        layer(.4, `<g id="bunt">${bunting}</g>`) +
        layer(.6, person(560, 900, 290, { color: '#5c6e9a', pose: 'hold', skin: C.skin[2], hair: C.hair[0] }) + person(1360, 900, 280, { color: '#b85c75', pose: 'hold', long: true, skin: C.skin[0], hair: C.hair[3] }) + person(960, 890, 290, { color: '#6c8f5a', pose: 'reach', skin: C.skin[3], hair: C.hair[1] })) +
        layer(.75, paper(table)) +
        layer(.95, [...Array(6)].map((_, i) => person(520 + i * 180, 1000 + (i % 2) * 20, 170, { color: C.cloth[(i + 3) % 10], pose: i % 2 ? 'raise' : 'reach', back: true, long: i % 2 === 0, skin: C.skin[i % 5], hair: C.hair[i % 5] })).join(''));
    },
    update(t, u, p, s) { q(s, '#bunt').setAttribute('transform', `translate(0 ${f1(Math.sin(u * 1.5) * 6)})`); },
  });

  // ================================================================= E3 · el bien común podremos alcanzar (117.0) — joven acompaña a un anciano
  S.push({
    id: 'biencomun', at: 117.0, cam: { x0: 80, y0: 0, z0: 1.0, x1: -80, y1: -10, z1: 1.08 },
    build() {
      const r = RNG(161);
      let leaves = ''; for (let i = 0; i < 70; i++) leaves += ellipse(r.range(-300, W + 300), r.range(-60, 1100), 8, 4, r.pick(['#e0913c', '#c9602f', '#f2b632', '#b8412f']), `class="lf" data-i="${i}"`);
      const tr = (x, y, s, c) => tree(x, y, s, c, x);
      const bench = rect(1320, 820, 260, 18, '#7a5534') + rect(1320, 780, 260, 14, '#7a5534') + rect(1340, 838, 12, 60, '#3b2a20') + rect(1550, 838, 12, 60, '#3b2a20');
      const elder = person(0, 0, 330, { color: '#8e8a7a', pose: 'stand', skin: C.skin[1], hair: '#e8e4dc', flip: true }) + line(-48, -160, -62, 0, '#5a3b26', 8);
      const young = person(100, 0, 350, { color: '#c0584a', pose: 'reach', skin: C.skin[0], hair: C.hair[1], long: true, flip: true });
      return layer(0, sky([[0, '#f2c28a'], [1, '#fbe6c4']])) +
        layer(.2, paper(tr(200, 700, 1.1, '#d9822b') + tr(700, 680, .9, '#e5a23a') + tr(1250, 690, 1.0, '#c9602f') + tr(1750, 700, 1.2, '#e0913c'))) +
        layer(.45, rect(-300, 700, W + 600, 600, '#9fae6a') + path('M-300,860 Q600,800 1100,870 Q1600,940 2220,860 L2220,960 Q1600,1040 1100,970 Q600,900 -300,960Z', '#e3cfa6')) +
        layer(.6, paper(bench) + rect(1080, 520, 12, 340, '#2f3440') + path('M1060,520 L1112,520 L1100,480 L1072,480Z', '#2f3440') + glow(1086, 505, 60, '#ffe7a0', .6) + grass(162, 240, -300, W + 300, 720, 870, '#5f7a3a', .6)) +
        layer(.8, `<g id="pair">${young}${elder}</g>`) +
        layer(1, leaves);
    },
    update(t, u, p, s) {
      q(s, '#pair').setAttribute('transform', `translate(${f1(700 + u * 26)} ${f1(990 + Math.abs(Math.sin(u * 2)) * -3)})`);
      qa(s, '.lf').forEach((l, i) => { const k = (u * .12 + i * .037) % 1; l.setAttribute('transform', `translate(${f1(Math.sin(u + i) * 40)} ${f1(k * 300)}) rotate(${f1(u * 60 + i * 20)})`); });
    },
  });

  // ================================================================= E4 · Sigamos los pasos de Jesús (122.8) — huellas en el sendero
  S.push({
    id: 'pasos', at: 122.8, cam: { x0: 0, y0: 260, z0: 1.12, x1: 0, y1: -120, z1: 1.0, ease: 'inOutCubic' },
    build() {
      let prints = '';
      for (let i = 0; i < 26; i++) {
        const k = i / 25, x = 960 + Math.sin(k * 5) * 220 * (1 - k * .6) + (i % 2 ? 22 : -22) * (1 - k * .7), y = 1300 - k * 780, s = 1.4 - k * 1.1;
        prints += g(ellipse(0, 0, 14, 26, '#b58a5a') + circle(-8, -30, 5, '#b58a5a') + circle(0, -34, 5, '#b58a5a') + circle(8, -30, 5, '#b58a5a'), `transform="translate(${f1(x)},${f1(y)}) scale(${f1(s)}) rotate(${f1(Math.cos(k * 5) * 20)})" class="fp" data-i="${i}"`);
      }
      return layer(0, sky([[0, '#88b4e0'], [.6, '#f8d8a8'], [1, '#fcecc8']])) +
        layer(.15, glow(960, 300, 600, '#fff4d0', .8)) +
        layer(.3, paper(mountains(171, 520, 260, '#9d8fb2', { n: 5, snow: { frac: .25, color: '#fbf8f1' } }))) +
        layer(.5, paper(hills(172, 620, 60, '#c8a878'))) +
        layer(.75, paper(path('M-300,700 Q960,560 2220,700 L2220,1500 L-300,1500Z', '#e8cf9f')) + [...Array(40)].map((_, i) => { const r2 = RNG(173 + i); const x = r2.range(-300, W + 300), y = r2.range(700, 1300); return Math.abs(x - 960) < 260 ? '' : ellipse(x, y, r2.range(10, 30), r2.range(6, 14), '#b8a58a'); }).join('') + grass(174, 200, -300, 600, 700, 1300, '#8a7a4a', .6) + grass(175, 200, 1320, 2220, 700, 1300, '#8a7a4a', .6) + prints) +
        layer(.85, g(person(0, 0, 90, { color: C.robe, robe: true, back: true, pose: 'walk', skin: C.skin[1], hair: C.hair[1] }), 'id="walker"'));
    },
    update(t, u, p, s) {
      qa(s, '.fp').forEach(f => f.setAttribute('opacity', f1(pr(u, (25 - f.dataset.i) * .12 - .4, (25 - f.dataset.i) * .12))));
      q(s, '#walker').innerHTML = person(960 + Math.sin(.9 * 5) * 60, 560 - u * 6, 80, { color: C.robe, robe: true, back: true, pose: 'walk', phase: t * 5, skin: C.skin[1], hair: C.hair[1] });
    },
  });

  // ================================================================= E4 · con los ojos fijos en la Cruz (128.5)
  S.push({
    id: 'cruz', at: 128.5, cam: { x0: 0, y0: -30, z0: 1.0, x1: 0, y1: 40, z1: 1.14, ease: 'inOutSine' },
    build() {
      return layer(0, sky([[0, '#3d4f86'], [.4, '#c46f6a'], [.7, '#f2a36b'], [1, '#fcd79a']])) +
        layer(.1, glow(960, 640, 800, '#ffd28a', .9) + circle(960, 700, 110, '#ffe2a8')) +
        layer(.25, clouds(181, 6, 180, 420, '#f7b89a', .55, 1.4)) +
        layer(.4, paper(hills(182, 760, 50, '#7a4a5a'))) +
        layer(.6, paper(path('M200,1100 Q700,560 960,520 Q1260,560 1760,1100Z', '#4a2f40')) + `<g transform="translate(960,560)">${cross(0, 0, 420, '#3a2418', 34)}${ink('M-6,-400 L-6,-10 M6,-380 L6,-20 M-120,-310 L120,-310', 1.2, .5)}</g>` + grass(183, 160, 300, 1600, 600, 1000, '#2a1a24', .7) + `<g id="cr">${rays(960, 330, 60, 900, 28, '#ffe9b8', .12, 5)}</g>`) +
        layer(.95, path('M-300,1000 Q400,940 900,1010 L900,1400 L-300,1400Z', '#1f1420') + person(420, 1010, 260, { color: '#1f1420', skin: '#1f1420', hair: '#1f1420', pose: 'raise', back: true }));
    },
    update(t, u, p, s) { q(s, '#cr').setAttribute('transform', `rotate(${f1(u * 2)} 960 330)`); },
  });

  // ================================================================= E4 · El amor y la verdad se encontrarán (134.3) — dos caminos que se unen
  S.push({
    id: 'encuentro', at: 134.3, cam: { x0: 0, y0: 0, z0: 1.12, x1: 0, y1: 0, z1: 1.0 },
    build() {
      const bridge = path('M500,720 Q960,560 1420,720 L1420,745 Q960,590 500,745Z', '#6b4630') + [...Array(12)].map((_, i) => { const x = 540 + i * 76, y = 720 - Math.sin((x - 500) / 920 * Math.PI) * 150; return line(x, y - 5, x, y - 55, '#6b4630', 5); }).join('') +
        path('M500,672 Q960,508 1420,672', 'none', 'stroke="#6b4630" stroke-width="7"');
      return layer(0, sky([[0, '#f1b27f'], [.5, '#fad9a6'], [1, '#fdf1d8']])) +
        layer(.1, glow(960, 520, 520, '#fff7dc', 1)) +
        layer(.3, paper(hills(191, 700, 60, '#a88fa0'))) +
        layer(.45, rect(-300, 730, W + 600, 600, '#8fb3d0') + waves(760, '#a9c6de', { amp: 4, len: 80 })) +
        layer(.6, paper(bridge) + paper(path('M-300,700 Q200,660 520,720 L520,1300 L-300,1300Z', '#7c9a5a') + path('M1400,720 Q1720,660 2220,700 L2220,1300 L1400,1300Z', '#7c9a5a'))) +
        layer(.62, grass(192, 200, -300, 520, 720, 1080, '#3f6a2f', .7) + grass(193, 200, 1400, 2220, 720, 1080, '#3f6a2f', .7) + `<g id="pl"></g>`) +
        layer(.62, `<g id="pr"></g>`) +
        layer(.9, `<g id="lights"></g>`);
    },
    update(t, u, p, s) {
      const a = ease(pr(u, 0, 4.4));
      const xl = 600 + a * 300, xr = 1320 - a * 300, yb = x => 720 - Math.sin((x - 500) / 920 * Math.PI) * 150;
      q(s, '#pl').innerHTML = person(xl, yb(xl), 150, { color: '#c0584a', pose: a < 1 ? 'walk' : 'reach', phase: t * 6, skin: C.skin[0], hair: C.hair[3], long: true });
      q(s, '#pr').innerHTML = person(xr, yb(xr), 160, { color: '#3f6b8c', pose: a < 1 ? 'walk' : 'reach', phase: t * 6 + 1, skin: C.skin[2], hair: C.hair[0], flip: true });
      const L = pr(u, 1.5, 5); q(s, '#lights').innerHTML = glow(960, yb(960) - 90, 60 + L * 260, '#ffe6a8', .6 * L);
    },
  });

  // ================================================================= E4 · la justicia y la paz se abrazarán (139.6)
  S.push({
    id: 'abrazo', at: 139.6, cam: { x0: 0, y0: 20, z0: 1.0, x1: 0, y1: -20, z1: 1.12 },
    build() {
      const olive = g(line(0, 0, 60, -8, '#6b8f4a', 4) + [...Array(5)].map((_, i) => ellipse(12 + i * 11, -4 + (i % 2 ? -8 : 8), 9, 4, '#8fb870')).join(''), 'transform="translate(20,6)"');
      return layer(0, sky([[0, '#8fc0e8'], [.55, '#e8eef0'], [1, '#fbefd8']])) +
        layer(.1, glow(960, 420, 700, '#fff8e0', .95) + `<g opacity=".35">${[0, 1, 2, 3, 4, 5].map(i => path(`M${260 - i * 12},900 A${700 + i * 26},${700 + i * 26} 0 0 1 ${1660 + i * 12},900`, 'none', `stroke="${['#e98a7a', '#f2b632', '#ffe29a', '#8fb870', '#74acdf', '#9d8fd2'][i]}" stroke-width="14"`)).join('')}</g>`) +
        layer(.35, paper(hills(201, 820, 40, '#9fc07a')) + grass(202, 300, -300, W + 300, 800, 1080, '#5f8a3a', .6)) +
        layer(.7, paper(path('M500,1100 Q960,780 1420,1100Z', '#6f9a5a')) +
          person(920, 900, 260, { color: '#7d5a8c', pose: 'hold', skin: C.skin[1], hair: C.hair[0] }) + person(1010, 900, 250, { color: '#d99a3c', pose: 'hold', skin: C.skin[3], hair: C.hair[1], long: true, flip: true })) +
        layer(.9, `<g id="dove"></g>`);
    },
    update(t, u, p, s) {
      const a = pr(u, .2, 5.2), x = 300 + a * 1300, y = 380 - Math.sin(a * Math.PI) * 180;
      q(s, '#dove').innerHTML = `<g transform="translate(${f1(x)},${f1(y)})">${dove(0, 0, 1.6, t * 7)}${g(line(0, 0, 60, -8, '#6b8f4a', 4) + [...Array(5)].map((_, i) => ellipse(12 + i * 11, -4 + (i % 2 ? -8 : 8), 9, 4, '#8fb870')).join(''), 'transform="translate(40,4)"')}</g>`;
    },
  });
})();
