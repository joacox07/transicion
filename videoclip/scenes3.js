/* Escenas: estribillo 2, coda (Familias / Consagrados / Argentina / En el Uno) y estribillo final */
(() => {
  const { grass, hatch, bricks, windowBox, tree, ink, W, H, RNG, C, g, path, rect, circle, ellipse, line, poly, paper, layer, sky, glow, rays, solDeMayo, clouds, mountains, hills, waves, person, shade, crowd, flag, dove, cross, f1 } = LIB;
  const S = window.SCENES;
  const { q, qa, pr, ease, clamp } = window.SC;
  const virgenLujan = window.virgenLujan, monstrance = window.monstrance;
  const flagsSpec = (seed, n, x0, x1, y0, y1, s0, s1) => { const r = RNG(seed); return [...Array(n)].map(() => { const k = r(); return { x: r.range(x0, x1), y: y0 + (y1 - y0) * k, s: s0 + (s1 - s0) * k, p: r() * 6 }; }).sort((a, b) => a.y - b.y); };
  const drawFlags = (spec, t) => spec.map(f => flag(f.x, f.y, f.s * 1.55, f.s, t * 3.2 + f.p, true, .1)).join('');
  const stars = (seed, n, y1 = 700) => { const r = RNG(seed); let s = ''; for (let i = 0; i < n; i++) s += circle(r.range(-300, W + 300), r.range(-300, y1), r.range(.8, 2.4), '#fff', `opacity="${f1(r.range(.3, .9))}"`); return s; };

  /** personajes típicos de las regiones */
  const gaucho = (x, y, h, o = {}) => person(x, y, h, { color: '#8a3b2e', hat: '#2d241c', legs: '#e8e0d0', skin: C.skin[2], ...o }) + path(`M${x - h * .15},${y - h * .76} L${x + h * .15},${y - h * .76} L${x + h * .2},${y - h * .5} L${x - h * .2},${y - h * .5}Z`, '#c0584a', 'opacity=".9"') + ink(`M${x - h * .15},${y - h * .6} L${x + h * .15},${y - h * .6}`, 1.4, .6);
  const colla = (x, y, h, o = {}) => person(x, y, h, { color: '#c9423a', dress: true, style: 'long', hair: '#1f1612', skin: C.skin[3], hat: '#3a2c24', ...o }) + path(`M${x - h * .13},${y - h * .78} L${x + h * .13},${y - h * .78} L${x + h * .16},${y - h * .55} L${x - h * .16},${y - h * .55}Z`, '#2f7a6a') + ink(`M${x - h * .12},${y - h * .72} L${x + h * .12},${y - h * .72} M${x - h * .14},${y - h * .64} L${x + h * .14},${y - h * .64}`, 2, .7);

  // ================================================================= C2 · Como pueblo (145.1) — de la mano, a lo largo del horizonte
  S.push({
    id: 'manos', at: 145.1, cam: { x0: 220, y0: 10, z0: 1.08, x1: -220, y1: 0, z1: 1.0 },
    build() {
      const figs = [
        (x) => gaucho(x, 900, 250), (x) => colla(x, 905, 230), (x) => person(x, 900, 240, { color: '#f4f4f4', skin: C.skin[0], hair: C.hair[3], style: 'bun', dress: true, legs: '#f4f4f4' }),
        (x) => person(x, 905, 150, { color: '#f2b632', skin: C.skin[1], style: 'curly' }), (x) => person(x, 900, 255, { color: '#3f6b8c', skin: C.skin[2], hat: '#f2b632', jacket: '#e0913c' }),
        (x) => person(x, 900, 230, { color: '#7d5a8c', skin: C.skin[4], hair: '#e8e4dc', style: 'bun', dress: true }), (x) => person(x, 905, 160, { color: '#6c8f5a', skin: C.skin[0], style: 'long', dress: true }),
        (x) => person(x, 900, 250, { color: '#1f1f24', robe: true, skin: C.skin[1], hair: C.hair[0] }) + rect(x - 4, 900 - 250 * .8, 8, 6, '#fff'), (x) => person(x, 900, 245, { color: '#b85c75', skin: C.skin[3], style: 'long', jacket: '#5c6e9a' }),
        (x) => person(x, 905, 140, { color: '#74acdf', skin: C.skin[2], style: 'short' }), (x) => gaucho(x, 900, 240, { color: '#3f5a8c' }), (x) => colla(x, 905, 225, { color: '#7d5a8c' }),
        (x) => person(x, 900, 250, { color: '#c0584a', skin: C.skin[1], hat: '#d8c08a', legs: '#4a4038' }), (x) => person(x, 905, 150, { color: '#d99a3c', skin: C.skin[4], style: 'bun', dress: true }),
      ];
      let row = ''; const xs = figs.map((_, i) => -260 + i * 185);
      figs.forEach((f, i) => { row += f(xs[i]); });
      for (let i = 0; i < xs.length - 1; i++) row += poly([[xs[i] + 20, 900 - 150], [xs[i] + 90, 900 - 110], [xs[i + 1] - 20, 900 - 150]], '#c79a70', 10) + circle(xs[i] + 92, 900 - 112, 7, C.skin[i % 5]);
      return layer(0, sky([[0, '#2f3f78'], [.4, '#c2687a'], [.7, '#f3a36b'], [1, '#fbd48c']])) +
        layer(.1, glow(960, 780, 700, '#ffd08a', .95) + circle(960, 800, 120, '#ffe0a8')) +
        layer(.3, clouds(211, 7, 150, 480, '#f4a58a', .55, 1.3)) +
        layer(.45, paper(mountains(212, 820, 140, '#6a4a6a', { n: 8, shadeOp: .25 }))) +
        layer(.62, paper(hills(213, 900, 30, '#4a3450')) + grass(214, 240, -300, W + 300, 890, 1000, '#2a1a30', .7)) +
        layer(.85, paper(row)) +
        layer(1, paper(path('M-300,1060 Q960,1000 2220,1060 L2220,1400 L-300,1400Z', '#2a1a2e')));
    },
  });

  // ================================================================= C2 · Como Iglesia (150.9) — capilla de pueblo
  S.push({
    id: 'capilla', at: 150.9, cam: { x0: -60, y0: 0, z0: 1.12, x1: 60, y1: -10, z1: 1.0 },
    build() {
      const chapel = rect(760, 380, 400, 360, '#f7f2e6') + path('M740,390 L960,230 L1180,390Z', '#c9594a') + ink('M740,390 L960,230 L1180,390', 2, .6) +
        rect(900, 150, 120, 240, '#f7f2e6') + path('M890,150 L960,70 L1030,150Z', '#c9594a') + cross(960, 70, 50, '#3a2c24', 6) +
        path('M925,200 L925,170 Q960,140 995,170 L995,200Z', '#3a2c24') + `<g id="bell" transform="translate(960,172)">${path('M-14,0 Q-14,-18 0,-20 Q14,-18 14,0 L18,8 L-18,8Z', '#c98a1b')}</g>` +
        path('M915,740 L915,600 Q960,550 1005,600 L1005,740Z', '#7a5534') + ink('M960,570 L960,740', 1.6, .6) + circle(960, 470, 40, '#74acdf') + ink('M920,470 L1000,470 M960,430 L960,510', 1.6, .6) +
        windowBox(800, 520, 50, 90, { glass: '#9cc4e8', frame: '#fbf8f1', arch: true }) + windowBox(1070, 520, 50, 90, { glass: '#9cc4e8', frame: '#fbf8f1', arch: true }) +
        ink('M760,380 L760,740 M1160,380 L1160,740', 2, .5) + hatch('M1100,390 L1160,390 L1160,740 L1100,740Z', { angle: 70, gap: 8, op: .3, bbox: [1090, 380, 1170, 750] });
      const people = [
        person(960, 800, 220, { color: '#1f1f24', robe: true, pose: 'wave', skin: C.skin[1], hair: C.hair[0] }),
        person(700, 900, 260, { color: '#3f6b8c', pose: 'wave', skin: C.skin[2], jacket: '#6f5a44' }), person(790, 910, 170, { color: '#f2b632', pose: 'raise', skin: C.skin[0], style: 'curly' }),
        person(1210, 905, 250, { color: '#b85c75', pose: 'hold', skin: C.skin[3], style: 'long', dress: true }), person(1300, 915, 150, { color: '#6c8f5a', pose: 'wave', skin: C.skin[4], style: 'bun' }),
        person(1420, 900, 240, { color: '#8e8a7a', pose: 'stand', skin: C.skin[1], hair: '#e8e4dc', style: 'bald' }) + line(1450, 780, 1460, 900, '#5a3b26', 6),
        person(520, 905, 245, { color: '#c0584a', pose: 'stand', skin: C.skin[0], style: 'bun', hair: '#e8e4dc', dress: true }), person(430, 915, 150, { color: '#74acdf', pose: 'raise', skin: C.skin[2] }),
      ].join('');
      return layer(0, sky([[0, '#8fc0e8'], [.6, '#dfeef5'], [1, '#f6efd8']])) +
        layer(.12, clouds(221, 6, 60, 300, '#fff', .9)) +
        layer(.3, paper(hills(222, 700, 50, '#a9c07a')) + tree(260, 740, .9, '#5a8a4a', 1) + tree(1700, 750, 1.0, '#4b7a4a', 2)) +
        layer(.5, paper(chapel) + rect(-300, 740, W + 600, 600, '#e3cfa6') + grass(223, 200, -300, 700, 740, 900, '#6a7a3a', .6) + grass(224, 200, 1220, 2220, 740, 900, '#6a7a3a', .6)) +
        layer(.8, paper(people)) +
        layer(1, `<g id="notes"></g>`);
    },
    update(t, u, p, s) {
      q(s, '#bell').setAttribute('transform', `translate(960,172) rotate(${f1(Math.sin(u * 5) * 22)})`);
      let n = ''; for (let i = 0; i < 6; i++) { const k = (u * .35 + i / 6) % 1; n += g(ink('M0,0 L0,-22 L10,-18', 2.2, .7 * Math.sin(k * Math.PI)) + ellipse(-4, 0, 6, 4.5, '#2b211c', `opacity="${f1(.7 * Math.sin(k * Math.PI))}"`), `transform="translate(${f1(1000 + i * 40 + Math.sin(k * 6 + i) * 30)},${f1(160 - k * 150)})"`); }
      q(s, '#notes').innerHTML = n;
    },
  });

  // ================================================================= C2 · Con María (156.6) — procesión nocturna con velas
  S.push({
    id: 'procesion', at: 156.6, cam: { x0: 120, y0: 0, z0: 1.05, x1: -120, y1: -10, z1: 1.1 },
    build() {
      const r = RNG(231);
      let houses = ''; for (let i = 0; i < 14; i++) { const x = -300 + i * 190, h = r.range(160, 260); houses += rect(x, 700 - h, 170, h, shade('#2a2f4a', r.range(-.15, .15))) + path(`M${x - 10},${700 - h} L${x + 85},${700 - h - 60} L${x + 180},${700 - h}Z`, '#1f2338') + (r() < .7 ? rect(x + 60, 700 - h + 50, 40, 50, '#ffcf7a', 'opacity=".85"') : ''); }
      let cands = ''; for (let i = 0; i < 110; i++) { const x = r.range(-300, W + 300), y = r.range(720, 1100); if (Math.abs(x - 960) < 190 && y < 960) continue; cands += `<g class="cn" data-i="${i}">${glow(x, y - 14, 30 + (y - 700) * .05, '#ffd98a', .75)}${rect(x - 2, y - 10, 4, 16, '#f4efe6')}${ellipse(x, y - 15, 3, 6, '#ffe7a0')}</g>`; }
      const litter = rect(760, 880, 400, 26, '#7a5534') + ink('M760,880 L1160,880 M760,906 L1160,906', 1.6, .6) + rect(780, 760, 360, 120, '#f4efe6') + ink('M780,760 L1140,760', 1.4, .4) +
        [...Array(12)].map((_, i) => circle(800 + i * 30, 870, 9, ['#fff', '#74acdf', '#f4a8b8'][i % 3])).join('');
      const bearers = [700, 850, 1070, 1220].map((x, i) => person(x, 1060, 260, { color: C.cloth[i + 1], back: true, pose: 'carry', skin: C.skin[i], hair: C.hair[i] })).join('');
      return layer(0, sky([[0, '#0b1230'], [.6, '#1d2750'], [1, '#34315a']]) + stars(232, 200)) +
        layer(.1, circle(1520, 160, 50, '#f3efe0') + glow(1520, 160, 180, '#cfd6ff', .3)) +
        layer(.35, paper(houses) + rect(-300, 700, W + 600, 600, '#2a2840')) +
        layer(.55, crowd(233, 70, -300, W + 300, 720, 820, 60, 120, { back: true, pose: 'pray', colors: ['#3a3f5e', '#4a4566', '#3e3a55'], children: .1 })) +
        layer(.7, paper(virgenLujan(960, 770, 330) + litter) + glow(960, 620, 360, '#fff2c8', .45)) +
        layer(.8, cands) +
        layer(.95, paper(bearers));
    },
    update(t, u, p, s) { qa(s, '.cn').forEach((c, i) => c.setAttribute('opacity', f1(.72 + .28 * Math.sin(t * 7 + i * 1.9)))); },
  });

  // ================================================================= C2 · Que en el Uno (162.5) — altar y cáliz
  S.push({
    id: 'altar', at: 162.5, cam: { x0: 0, y0: 40, z0: 1.0, x1: 0, y1: -40, z1: 1.18, ease: 'inOutSine' },
    build() {
      const vitral = (x) => `<g transform="translate(${x},0)">${path('M-80,560 L-80,240 Q0,120 80,240 L80,560Z', '#3a4f86')}${[...Array(12)].map((_, i) => rect(-80 + (i % 4) * 40, 240 + Math.floor(i / 4) * 107, 40, 107, ['#c9423a', '#f2b632', '#74acdf', '#6c8f5a', '#9d8fd2'][i % 5], 'opacity=".85"')).join('')}${ink('M-80,560 L-80,240 Q0,120 80,240 L80,560Z M-40,240 L-40,560 M0,180 L0,560 M40,240 L40,560 M-80,347 L80,347 M-80,454 L80,454', 3, .8)}</g>`;
      const chalice = path('M920,640 Q920,720 960,730 Q1000,720 1000,640Z', C.gold) + rect(955, 730, 10, 40, C.goldD) + ellipse(960, 772, 36, 10, C.gold) + ink('M920,640 Q920,720 960,730 Q1000,720 1000,640Z', 1.6, .6);
      const priest = person(960, 1160, 520, { color: '#f7f4ee', robe: true, back: true, pose: 'raise', skin: C.skin[1], hair: C.hair[0], cape: '#e9d7a8' });
      return layer(0, rect(-300, -300, W + 600, H + 600, '#2a1d22') + glow(960, 420, 1000, '#8a5a3a', .6)) +
        layer(.2, vitral(420) + vitral(1500) + cross(960, 560, 380, '#6b4630', 30) + glow(960, 300, 300, '#ffe2a0', .4)) +
        layer(.45, paper(rect(560, 760, 800, 34, '#e9dfcc') + rect(600, 794, 720, 300, '#f4efe6') + rect(600, 794, 720, 36, '#c9a24a') + ink('M600,830 L1320,830', 1.4, .5) + cross(960, 1040, 140, '#c9a24a', 14)) +
          [640, 760, 1160, 1280].map((x, i) => rect(x - 7, 660, 14, 100, '#f4efe6') + `<g class="fl2" data-i="${i}">${glow(x, 648, 36, '#ffd98a', .9)}${ellipse(x, 648, 5, 11, '#ffe7a0')}</g>`).join('') + chalice) +
        layer(.75, `<g id="host">${glow(960, 330, 200, '#fff4d0', .9)}${circle(960, 330, 62, '#fffaf0')}${ink('M960,300 L960,360 M935,322 L985,322', 2.4, .35)}${circle(960, 330, 62, 'none', 'stroke="#e8dcc0" stroke-width="3"')}${rays(960, 330, 70, 520, 28, '#fff2c0', .35, 4)}</g>`) +
        layer(.95, priest);
    },
    update(t, u, p, s) {
      q(s, '#host').setAttribute('transform', `translate(0 ${f1(40 - ease(pr(u, 0, 2.5)) * 40)})`);
      qa(s, '.fl2').forEach((f, i) => f.setAttribute('opacity', f1(.8 + .2 * Math.sin(t * 8 + i))));
    },
  });

  // ================================================================= CODA · Familias (168.7)
  S.push({
    id: 'familias', at: 168.7, cam: { x0: -120, y0: 0, z0: 1.1, x1: 80, y1: -10, z1: 1.0 },
    build() {
      const fam = person(620, 960, 300, { color: '#8e8a7a', skin: C.skin[1], hair: '#e8e4dc', style: 'bald', pose: 'hold' }) + line(560, 820, 548, 960, '#5a3b26', 7) +
        person(760, 960, 290, { color: '#b85c75', skin: C.skin[0], hair: '#e8e4dc', style: 'bun', dress: true, pose: 'hold' }) +
        person(900, 965, 170, { color: '#f2b632', skin: C.skin[0], style: 'curly', pose: 'hold' }) +
        person(1040, 960, 330, { color: '#3f6b8c', skin: C.skin[2], hair: C.hair[0], pose: 'hold', jacket: '#6f5a44' }) +
        person(1180, 960, 315, { color: '#c0584a', skin: C.skin[3], hair: C.hair[1], style: 'long', dress: true, pose: 'hold' }) +
        person(1300, 965, 150, { color: '#6c8f5a', skin: C.skin[3], style: 'short', pose: 'raise' });
      const dog = g(ellipse(0, 0, 40, 20, '#a8714f') + circle(38, -16, 14, '#a8714f') + path('M40,-26 L50,-40 L54,-22Z', '#7a5534') + rect(-30, 10, 8, 26, '#a8714f') + rect(22, 10, 8, 26, '#a8714f') + ink('M-40,-4 Q-60,-20 -56,-34', 5, .8) + circle(44, -18, 2.5, '#1a120c'), 'transform="translate(1440,925)"');
      return layer(0, sky([[0, '#86b7e6'], [.55, '#fbd9a6'], [1, '#fdecc8']])) +
        layer(.1, glow(1500, 420, 520, '#fff2c4', .9) + clouds(251, 6, 80, 320, '#fff', .8)) +
        layer(.3, `<g id="kite"></g>`) +
        layer(.45, paper(hills(252, 780, 50, '#9fc07a')) + tree(300, 800, .8, '#4b7a4a', 3) + tree(1720, 790, .9, '#5a8a4a', 4)) +
        layer(.7, paper(path('M-300,980 Q960,860 2220,980 L2220,1400 L-300,1400Z', '#7fae5a')) + grass(253, 320, -300, W + 300, 900, 1080, '#4f7a3a', .7) + [...Array(40)].map((_, i) => { const r2 = RNG(254 + i); return circle(r2.range(-300, W + 300), r2.range(960, 1080), 5, r2.pick(['#fff', '#ffd98a', '#f4a8b8'])); }).join('')) +
        layer(.85, paper(fam + dog));
    },
    update(t, u, p, s) {
      const kx = 1330 + Math.sin(u * .9) * 60, ky = 260 + Math.cos(u * 1.3) * 30;
      q(s, '#kite').innerHTML = ink(`M1300,812 Q${f1((1300 + kx) / 2 + 60)},${f1((812 + ky) / 2)} ${f1(kx)},${f1(ky + 50)}`, 1.6, .8) +
        g(path('M0,-50 L36,0 L0,50 L-36,0Z', '#74acdf') + path('M0,-50 L0,50 M-36,0 L36,0', 'none', 'stroke="#fff" stroke-width="4"') + ink('M0,-50 L36,0 L0,50 L-36,0Z', 1.6, .7) + ink(`M0,50 q-12,20 0,40 q12,20 0,40`, 2, .7), `transform="translate(${f1(kx)},${f1(ky)}) rotate(${f1(Math.sin(u * 2) * 12)})"`);
    },
  });

  // ================================================================= CODA · Consagrados (174.0)
  S.push({
    id: 'consagrados', at: 174.0, cam: { x0: 60, y0: 20, z0: 1.12, x1: -60, y1: 0, z1: 1.0 },
    build() {
      const facade = rect(360, 160, 1200, 640, '#efe4cf') + bricks(360, 160, 1200, 640, { bw: 70, bh: 30, op: .18, seed: 261 }) + path('M340,170 L960,20 L1580,170Z', '#d8c9ad') + ink('M340,170 L960,20 L1580,170Z', 2, .6) + circle(960, 110, 44, '#74acdf') + ink('M916,110 L1004,110 M960,66 L960,154', 1.6, .6) +
        [480, 700, 1220, 1440].map(x => windowBox(x - 40, 280, 80, 150, { glass: '#8fa9c8', frame: '#fbf3e4', arch: true })).join('') + path('M860,800 L860,560 Q960,460 1060,560 L1060,800Z', '#7a5534') + ink('M960,500 L960,800', 2, .6);
      const sisters = (x, y, h, c = '#1f2438') => person(x, y, h, { color: c, robe: true, veil: c, skin: C.skin[0], noHair: true, pose: 'wave' }) + path(`M${x - h * .06},${y - h * .83} L${x + h * .06},${y - h * .83} L${x + h * .05},${y - h * .76} L${x - h * .05},${y - h * .76}Z`, '#fff');
      const priest = (x, y, h, o = {}) => person(x, y, h, { color: '#1f1f24', robe: true, skin: C.skin[1], hair: C.hair[0], ...o }) + rect(x - h * .03, y - h * .82, h * .06, h * .03, '#fff');
      const friar = (x, y, h) => person(x, y, h, { color: '#6b4630', robe: true, skin: C.skin[2], hair: C.hair[1], style: 'bald', pose: 'hold' }) + ink(`M${x - h * .15},${y - h * .45} L${x + h * .15},${y - h * .45} M${x + h * .08},${y - h * .45} L${x + h * .1},${y - h * .2}`, 3, .8);
      const group = priest(560, 1000, 330, { pose: 'wave' }) + sisters(720, 1010, 310) + friar(880, 1005, 320) + sisters(1030, 1010, 300, '#f4f1ea') + priest(1180, 1000, 340, { pose: 'raise' }) + sisters(1340, 1010, 305, '#5a6e9a') + priest(1490, 1005, 320, { pose: 'hold', style: 'bald' }) + friar(420, 1010, 300);
      return layer(0, sky([[0, '#88b4e0'], [1, '#f4ead4']])) +
        layer(.12, glow(960, 100, 700, '#fff6d8', .7)) +
        layer(.35, paper(facade) + rect(-300, 800, W + 600, 600, '#d8cab0') + [...Array(8)].map((_, i) => ink(`M-300,${820 + i * 40} L2220,${820 + i * 40}`, 1.2, .25)).join('')) +
        layer(.55, tree(180, 820, 1.1, '#4b7a4a', 5) + tree(1760, 830, 1.2, '#5a8a4a', 6)) +
        layer(.8, paper(group)) +
        layer(1, `<g id="conf"></g>`);
    },
    update(t, u, p, s) {
      let c = ''; for (let i = 0; i < 40; i++) { const r2 = RNG(262 + i), x = r2.range(0, W), k = (u * .18 + r2()) % 1; c += rect(x + Math.sin(u * 2 + i) * 30, -40 + k * 1150, 10, 16, r2.pick([C.celeste, '#fff', C.gold]), `transform="rotate(${f1(u * 90 + i * 30)} ${f1(x)} ${f1(-40 + k * 1150)})" opacity=".9"`); }
      q(s, '#conf').innerHTML = c;
    },
  });

  // ================================================================= CODA · Argentina (180.2) — el mapa con su gente
  const AR = [[-66.2, -21.8], [-64.3, -22.4], [-62.8, -22.0], [-61.0, -23.8], [-58.4, -24.8], [-57.6, -25.4], [-55.8, -27.3], [-54.6, -25.6], [-53.7, -26.2], [-53.8, -27.2], [-55.7, -28.1], [-56.9, -30.1], [-57.6, -30.2], [-58.2, -32.4], [-58.4, -33.9], [-57.2, -35.3], [-56.7, -36.4], [-57.5, -38.1], [-59.0, -38.8], [-61.9, -38.9], [-62.3, -40.6], [-65.0, -40.8], [-65.1, -42.0], [-63.6, -42.6], [-64.9, -42.9], [-65.3, -44.9], [-67.3, -45.9], [-66.2, -47.1], [-65.9, -47.8], [-67.6, -49.3], [-68.3, -50.1], [-69.0, -51.6], [-68.4, -52.3], [-69.9, -52.0], [-72.3, -51.6], [-73.3, -50.5], [-72.6, -48.8], [-72.0, -47.8], [-71.8, -46.0], [-71.6, -44.0], [-71.8, -42.2], [-71.9, -40.5], [-71.4, -38.0], [-70.9, -36.3], [-70.0, -34.0], [-70.2, -32.5], [-70.5, -30.5], [-69.8, -28.5], [-68.4, -26.9], [-68.6, -24.8], [-67.2, -23.3], [-67.0, -22.8]];
  const TF = [[-68.6, -52.6], [-66.5, -53.8], [-65.1, -54.9], [-66.5, -55.0], [-68.6, -54.9]];
  const proj = ([lo, la]) => [960 + (lo + 63.5) * 21, 70 + (-la - 22) * 25.5];
  const polyD = pts => 'M' + pts.map(p => proj(p).map(f1).join(',')).join('L') + 'Z';
  S.push({
    id: 'argentina', at: 180.2, cam: { x0: 0, y0: 30, z0: 1.12, x1: 0, y1: -10, z1: .98, ease: 'inOutSine' },
    build() {
      const d = polyD(AR) + polyD(TF);
      const icon = (lo, la, inner) => { const [x, y] = proj([lo, la]); return `<g transform="translate(${f1(x)},${f1(y)})">${inner}</g>`; };
      const icons = icon(-65.5, -23.2, [0, 1, 2, 3, 4].map(i => path(`M${-34 + i * 4},${10 - i * 6} Q0,${-20 - i * 5} ${34 - i * 4},${10 - i * 6}Z`, ['#b85a4a', '#d98a52', '#8e6fa0', '#6f9a6a', '#e0b86a'][i])).join('')) +
        icon(-54.4, -25.7, rect(-24, -16, 48, 30, '#e9f4f8') + ink('M-16,-14 L-16,12 M-4,-14 L-4,12 M8,-14 L8,12', 1.6, .6) + circle(-30, -18, 14, '#2f6b3a') + circle(28, -20, 14, '#2f6b3a')) +
        icon(-69.9, -32.65, path('M-30,14 L0,-34 L30,14Z', '#8d86a8') + path('M-10,-18 L0,-34 L10,-18 L4,-14 L-2,-20 L-6,-15Z', '#fff') + ink('M-30,14 L0,-34 L30,14', 1.6, .7)) +
        icon(-58.4, -34.6, path('M-6,14 L-3,-40 L3,-40 L6,14Z', '#f4efe6') + path('M-3,-40 L0,-48 L3,-40Z', '#f4efe6') + ink('M-6,14 L-3,-40 L0,-48 L3,-40 L6,14', 1.4, .7)) +
        icon(-64.4, -42.6, path('M-36,0 Q-10,-18 20,-6 Q30,-2 38,-12 Q36,0 44,8 Q30,6 20,6 Q-10,14 -36,0Z', '#2f4f75') + ink('M-36,0 Q-10,-18 20,-6', 1.4, .6)) +
        icon(-73, -50.0, path('M-30,10 L-20,-20 L-4,-6 L8,-26 L26,10Z', '#cfe8f4') + ink('M-30,10 L-20,-20 L-4,-6 L8,-26 L26,10', 1.4, .7)) +
        icon(-60.5, -27.5, rect(-4, -30, 8, 36, '#3f6b43', 'rx="4"') + ink('M-4,-14 q-12,0 -12,-14 M4,-20 q12,0 12,-12', 7, .9));
      const ring = [...Array(18)].map((_, i) => { const a = Math.PI * .08 + i / 17 * Math.PI * .84; const x = 960 + Math.cos(a + Math.PI) * 720 * -1, y = 1080 - Math.sin(a) * 180; return person(x, y + 40, 170, { color: C.cloth[i % 10], skin: C.skin[i % 5], hair: C.hair[i % 6], style: ['long', 'short', 'bun', 'curly'][i % 4], pose: i % 3 ? 'raise' : 'wave', dress: i % 4 === 1 }); }).join('');
      return layer(0, sky([[0, '#16264a'], [.5, '#2c4f86'], [1, '#6fa3dc']])) +
        layer(.1, glow(960, 120, 520, '#ffe2a0', .6) + g(solDeMayo(960, 120, 46), 'id="sol"')) +
        layer(.4, `<clipPath id="arc"><path d="${d}"/></clipPath>` + path(d, C.celesteL) +
          `<g clip-path="url(#arc)">${rect(0, 0, W, 330, C.celeste)}${rect(0, 330, W, 280, '#fbf8f1')}${rect(0, 610, W, 600, C.celeste)}</g>` +
          ink(d, 3, .85) + icons + [...Array(5)].map((_, i) => { const [x, y] = proj([-60 + i * .8, -33 - i * 2.5]); return circle(x, y, 7, '#c9423a') + ink(`M${f1(x)},${f1(y)} m-10,0 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0`, 1.4, .6); }).join('')) +
        layer(.85, paper(ring));
    },
    update(t, u, p, s) { q(s, '#sol').setAttribute('transform', `rotate(${f1(u * 6)} 960 120)`); },
  });

  // ================================================================= CODA · En el Uno (185.7) — todos convergen en la luz
  S.push({
    id: 'enel_uno', at: 185.7, cam: { x0: 0, y0: 0, z0: 1.0, x1: 0, y1: -30, z1: 1.16, ease: 'inOutSine' },
    build() {
      return layer(0, sky([[0, '#f6c79a'], [.5, '#fde2b8'], [1, '#fff4de']])) +
        layer(.12, glow(960, 470, 900, '#fff6d8', 1) + `<g id="rr2">${rays(960, 470, 80, 1600, 36, '#fff', .35, 6)}</g>`) +
        layer(.35, paper(hills(271, 740, 40, '#c9b07a'))) +
        layer(.5, paper(path('M560,900 Q960,560 1360,900Z', '#b89868')) + cross(960, 560, 240, '#6b4630', 20) + ink('M954,340 L954,550 M966,330 L966,540', 1.2, .5)) +
        layer(.75, `<g id="conv"></g>`) +
        layer(1, grass(272, 260, -300, W + 300, 960, 1090, '#8a6a3a', .7));
    },
    init(div) {},
    update(t, u, p, s) {
      q(s, '#rr2').setAttribute('transform', `rotate(${f1(u * 3)} 960 470)`);
      if (!s._cv) { const r = RNG(273); s._cv = [...Array(46)].map((_, i) => ({ side: i % 2 ? 1 : -1, sx: r.range(.9, 1.5), y: r.range(840, 1060), d: r.range(0, .35), c: r.pick(C.cloth), sk: r.pick(C.skin), st: r.pick(['short', 'long', 'bun', 'curly']), h: r.range(120, 230), dr: r() < .3 })); }
      const k = ease(pr(u, 0, 5.6));
      let html = '';
      s._cv.slice().sort((a, b) => a.y - b.y).forEach(c => {
        const kk = clamp((k - c.d) / (1 - c.d));
        const x = 960 + c.side * (W * .5 * c.sx) * (1 - kk * .82), y = c.y - kk * (c.y - 860) * .6, h = c.h * (1 - kk * .35);
        html += person(x, y, h, { color: c.c, skin: c.sk, style: c.st, dress: c.dr, pose: kk < .98 ? 'walk' : 'raise', phase: t * 6 + c.y, back: true, flip: c.side > 0 });
      });
      q(s, '#conv').innerHTML = html;
    },
  });

  // ================================================================= C3 · Como pueblo (191.7) — el papamóvil recorre la avenida
  const fl3 = flagsSpec(281, 30, -300, W + 300, 600, 1000, 36, 110);
  S.push({
    id: 'papamovil', at: 191.7, cam: { x0: 0, y0: 0, z0: 1.05, x1: 0, y1: -10, z1: 1.12 },
    build() {
      const r = RNG(282);
      let bld = ''; for (let i = 0; i < 12; i++) { const x = -300 + i * 210, h = r.range(260, 420); bld += rect(x, 600 - h, 190, h, shade('#c9b8a4', r.range(-.15, .1))) + [...Array(12)].map((_, k) => windowBox(x + 20 + (k % 3) * 58, 600 - h + 30 + Math.floor(k / 3) * 70, 30, 42, { glass: '#8fa9c8', frame: '#efe6d8' })).join(''); }
      const obelisco = path('M940,600 L950,150 L970,150 L980,600Z', '#f4efe6') + path('M950,150 L960,120 L970,150Z', '#f4efe6') + ink('M940,600 L950,150 L960,120 L970,150 L980,600', 1.6, .6) + rect(956, 250, 8, 14, '#3a2c24');
      return layer(0, sky([[0, '#8fc0e8'], [1, '#eef4f6']])) +
        layer(.2, paper(bld) + paper(obelisco)) +
        layer(.4, rect(-300, 600, W + 600, 600, '#9a9aa4') + path('M860,600 L1060,600 L1500,1200 L420,1200Z', '#b0b0b8') + [...Array(8)].map((_, i) => rect(954, 640 + i * 60 + i * i * 4, 12, 30 + i * 4, '#fff')).join('')) +
        layer(.55, crowd(283, 80, -300, 760, 620, 1000, 70, 220, { pose: r => r.pick(['wave', 'raise', 'raise']), children: .15 }) + crowd(284, 80, 1160, W + 300, 620, 1000, 70, 220, { pose: r => r.pick(['wave', 'raise', 'raise']), children: .15 })) +
        layer(.7, `<g id="pmovil"></g>`) +
        layer(.9, `<g id="flags3"></g><g id="papel"></g>`);
    },
    update(t, u, p, s) {
      const k = ease(pr(u, 0, 6)), y = 640 + k * 300, sc = .5 + k * .7;
      q(s, '#pmovil').innerHTML = `<g transform="translate(960,${f1(y)}) scale(${f1(sc)})">` +
        rect(-150, -60, 300, 110, '#f7f5f0') + rect(-110, -200, 220, 140, '#dfeef7', 'opacity=".75"') + ink('M-110,-200 L110,-200 L110,-60 L-110,-60Z M-150,-60 L150,-60 L150,50 L-150,50Z', 2, .7) +
        person(0, -60, 150, { color: '#f7f4ee', robe: true, pose: 'wave', phase: t * 3, skin: C.skin[0], hair: '#d8d2c8', cap: '#fbf8f1', back: true }) +
        circle(-100, 50, 30, '#2b2b2b') + circle(100, 50, 30, '#2b2b2b') + rect(-150, 0, 300, 10, '#f2b632') + '</g>';
      q(s, '#flags3').innerHTML = drawFlags(fl3, t);
      let pp = ''; for (let i = 0; i < 60; i++) { const r2 = RNG(285 + i), x = r2.range(-100, W + 100), kk = (u * .2 + r2()) % 1; pp += rect(x + Math.sin(u * 2 + i) * 30, -40 + kk * 1150, 9, 13, '#fff', `transform="rotate(${f1(u * 120 + i * 40)} ${f1(x)} ${f1(-40 + kk * 1150)})" opacity=".95"`); }
      q(s, '#papel').innerHTML = pp;
    },
  });

  // ================================================================= C3 · Como Iglesia (197.5) — gran misa al aire libre
  S.push({
    id: 'misa', at: 197.5, cam: { x0: 0, y0: -40, z0: 1.15, x1: 0, y1: 30, z1: .98, ease: 'inOutSine' },
    build() {
      const r = RNG(291);
      let lights = ''; for (let i = 0; i < 500; i++) { const y = r.range(620, 1100), x = r.range(-300, W + 300); lights += circle(x, y, 1.5 + (y - 600) * .006, r.pick(['#ffe7a0', '#fff', '#ffd98a']), `opacity="${f1(r.range(.5, 1))}" class="lt"`); }
      const stage = path('M560,620 L1360,620 L1420,700 L500,700Z', '#e9e2d4') + rect(500, 700, 920, 40, '#c9bfae') + path('M600,620 L600,300 L1320,300 L1320,620', 'none', 'stroke="#d8d0c0" stroke-width="16"') + path('M580,300 Q960,200 1340,300', 'none', 'stroke="#f4efe6" stroke-width="22"') +
        cross(960, 610, 280, '#fbf8f1', 22) + rect(820, 560, 280, 60, '#f4efe6') + ink('M820,560 L1100,560 L1100,620 L820,620Z', 1.6, .6) + person(960, 560, 90, { color: '#f7f4ee', robe: true, pose: 'raise', skin: C.skin[0], hair: '#d8d2c8', cap: '#fbf8f1' }) +
        rect(360, 360, 180, 110, '#2f3a5e') + rect(1380, 360, 180, 110, '#2f3a5e') + ink('M360,360 L540,360 L540,470 L360,470Z M1380,360 L1560,360 L1560,470 L1380,470Z', 1.6, .6) + cross(450, 450, 70, '#fbf8f1', 8) + cross(1470, 450, 70, '#fbf8f1', 8);
      return layer(0, sky([[0, '#070d24'], [.6, '#1a2350'], [1, '#2e2e5a']]) + stars(292, 180, 500)) +
        layer(.2, `<g id="beams">${[-1, 1].map(sd => [0, 1, 2].map(i => path(`M${960 + sd * (380 + i * 60)},700 L${960 + sd * (80 + i * 260)},-200 L${960 + sd * (200 + i * 260)},-200Z`, '#fff4d0', 'opacity=".12"')).join('')).join('')}</g>`) +
        layer(.4, paper(stage) + glow(960, 480, 520, '#fff0c8', .45)) +
        layer(.7, lights) +
        layer(.95, crowd(293, 40, -300, W + 300, 1060, 1160, 200, 260, { back: true, pose: r => r.pick(['raise', 'pray', 'stand']), colors: ['#2a2f4a', '#353a58', '#2a2d44', '#3a3350'], children: .1 }));
    },
    update(t, u, p, s) {
      q(s, '#beams').setAttribute('transform', `rotate(${f1(Math.sin(u * .8) * 4)} 960 700)`);
      if (!s._lt) s._lt = qa(s, '.lt').filter((_, i) => i % 3 === 0);
      s._lt.forEach((c, i) => c.setAttribute('opacity', f1(.55 + .45 * Math.sin(t * 5 + i))));
    },
  });

  // ================================================================= C3 · Con María (203.0) — el manto de la Virgen sobre su pueblo
  S.push({
    id: 'manto', at: 203.0, cam: { x0: 0, y0: 40, z0: 1.12, x1: 0, y1: -20, z1: 1.0, ease: 'inOutSine' },
    build() {
      const mantle = path('M960,180 Q560,420 180,1000 L1740,1000 Q1360,420 960,180Z', C.celeste, 'opacity=".9"') + path('M960,260 Q720,470 480,1000 L1440,1000 Q1200,470 960,260Z', '#fbf8f1', 'opacity=".92"') +
        ink('M960,180 Q560,420 180,1000 M960,180 Q1360,420 1740,1000 M960,260 Q720,470 480,1000 M960,260 Q1200,470 1440,1000', 2.4, .6) +
        [...Array(26)].map((_, i) => { const r2 = RNG(301 + i); return path('M0,-9 L2.6,-2.6 L9,0 L2.6,2.6 L0,9 L-2.6,2.6 L-9,0 L-2.6,-2.6Z', C.gold, `transform="translate(${f1(r2.range(260, 1660))},${f1(r2.range(560, 980))})"`); }).join('');
      return layer(0, sky([[0, '#0f1a3c'], [.5, '#2a3f78'], [1, '#6a7fb8']]) + stars(302, 220, 900)) +
        layer(.2, glow(960, 300, 700, '#fff0c8', .55)) +
        layer(.45, `<g id="mantle">${mantle}</g>`) +
        layer(.55, paper(virgenLujan(960, 560, 420))) +
        layer(.85, crowd(303, 70, -300, W + 300, 900, 1120, 110, 250, { back: true, pose: r => r.pick(['raise', 'pray', 'stand', 'raise']), children: .2 }));
    },
    update(t, u, p, s) { const k = ease(pr(u, 0, 3)); q(s, '#mantle').setAttribute('transform', `translate(960 180) scale(${f1(.35 + k * .65)} ${f1(.5 + k * .5)}) translate(-960 -180)`); },
  });

  // ================================================================= C3 · Que en el Uno (208.7 → fin) — mosaico de todo el clip que se funde en la luz
  const MOS = ['aconcagua', 'despertar', 'campo', 'vitral', 'pescador', 'siervo', 'peregrinacion', 'balcon', 'plaza', 'sanpedro', 'lujan', 'eucaristia', 'corazon', 'habitar', 'humanidad', 'biencomun', 'pasos', 'cruz', 'encuentro', 'abrazo', 'manos', 'capilla', 'procesion', 'familias', 'consagrados', 'argentina', 'papamovil', 'misa'];
  window.MOSAIC_IDS = MOS;
  S.push({
    id: 'final', at: 208.7, noSketch: true, cam: { x0: 0, y0: 0, z0: 1, x1: 0, y1: 0, z1: 1, ease: 'inOutSine' },
    build() {
      const cols = 7, rows = 4, tw = 250, th = 141, gap = 12;
      const x0 = 960 - (cols * tw + (cols - 1) * gap) / 2, y0 = 540 - (rows * th + (rows - 1) * gap) / 2;
      let tiles = '';
      MOS.forEach((id, i) => {
        const c = i % cols, r2 = Math.floor(i / cols), x = x0 + c * (tw + gap), y = y0 + r2 * (th + gap);
        tiles += `<g class="tile" data-i="${i}" data-x="${f1(x + tw / 2)}" data-y="${f1(y + th / 2)}"><image href="assets/mosaic/${id}.jpg" x="${f1(x)}" y="${f1(y)}" width="${tw}" height="${th}" preserveAspectRatio="xMidYMid slice"/>${rect(x, y, tw, th, 'none', 'stroke="#fbf6ea" stroke-width="6"')}</g>`;
      });
      return layer(0, rect(-300, -300, W + 600, H + 600, '#1a2446') + glow(960, 540, 900, '#ffe6b0', .35)) +
        layer(.6, `<g id="tiles">${tiles}</g>`) +
        layer(1, `<g id="light">${glow(960, 540, 1400, '#fff6dc', 1)}${rays(960, 540, 60, 1600, 36, '#fff', .5, 6)}</g>` + `<g id="ttl" opacity="0"><text x="960" y="560" text-anchor="middle" font-family="Crimson Pro" font-weight="700" font-size="150" letter-spacing="24" fill="#8a6a2e">SEAMOS UNO</text>${solDeMayo(960, 330, 40)}</g>`);
    },
    update(t, u, p, s) {
      if (!s._tl) s._tl = qa(s, '.tile').map(e => ({ e, i: +e.dataset.i, x: +e.dataset.x, y: +e.dataset.y }));
      const conv = ease(pr(t, 212.2, 215.6));
      s._tl.forEach(o => {
        const a = ease(pr(t, 208.8 + o.i * .09, 209.6 + o.i * .09));
        const tx = (960 - o.x) * conv, ty = (540 - o.y) * conv, sc = (.4 + .6 * a) * (1 - conv * .8);
        o.e.setAttribute('transform', `translate(${f1(o.x + tx)} ${f1(o.y + ty)}) scale(${f1(sc)}) rotate(${f1((1 - a) * (o.i % 2 ? 8 : -8))}) translate(${f1(-o.x)} ${f1(-o.y)})`);
        o.e.setAttribute('opacity', f1(a * (1 - conv * .6)));
      });
      q(s, '#light').setAttribute('opacity', f1(ease(pr(t, 213.6, 216.2))));
      q(s, '#ttl').setAttribute('opacity', f1(ease(pr(t, 214.6, 216.0)) * (1 - pr(t, 219, 221))));
    },
  });
})();
