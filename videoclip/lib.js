/* Biblioteca de ilustración «papel recortado» para el videoclip Seamos Uno.
 * Todo se dibuja como SVG a 1920x1080. Cada escena se arma con capas (depth 0 = fondo, 1 = frente)
 * que luego la cámara mueve con paralaje.
 */
const W = 1920, H = 1080;

// ------------------------------------------------------------------ azar determinista
function RNG(seed) {
  let a = seed >>> 0;
  const r = () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  r.range = (a, b) => a + (b - a) * r();
  r.pick = arr => arr[Math.floor(r() * arr.length)];
  return r;
}
const f1 = v => Math.round(v * 10) / 10;

// ------------------------------------------------------------------ paleta
const C = {
  celeste: '#74acdf', celesteD: '#4f86c0', celesteL: '#b9d6f0', white: '#fbf8f1', gold: '#f2b632', goldD: '#c98a1b', goldL: '#ffe29a',
  night: '#16264a', navy: '#22386a', dusk: '#3d4f86', rose: '#e9a58a', peach: '#f6c89a', cream: '#fbeed7',
  earth: '#8a5a3b', earthD: '#5e3c28', green: '#5f8f5a', greenD: '#3f6b43', greenL: '#8fb870', sea: '#2f6f9a', seaD: '#1f4f75',
  stone: '#b9a78f', stoneD: '#8c7a66', wine: '#8e2f3a', robe: '#f4f1ea', skin: ['#e7c3a1', '#d9a882', '#c28e6a', '#a8714f', '#f0d2b4'],
  hair: ['#3b2a20', '#5a3b26', '#2a211c', '#7a5534', '#b89060', '#d8d2c8'],
  cloth: ['#c0584a', '#3f6b8c', '#6c8f5a', '#d99a3c', '#7d5a8c', '#a9674a', '#4f7f7a', '#c9a24a', '#5c6e9a', '#b85c75'],
};

// ------------------------------------------------------------------ primitivas
const g = (inner, attrs = '') => `<g ${attrs}>${inner}</g>`;
const path = (d, fill, extra = '') => `<path d="${d}" fill="${fill}" ${extra}/>`;
const rect = (x, y, w, h, fill, extra = '') => `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" fill="${fill}" ${extra}/>`;
const circle = (x, y, r, fill, extra = '') => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="${fill}" ${extra}/>`;
const ellipse = (x, y, rx, ry, fill, extra = '') => `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${fill}" ${extra}/>`;
const line = (x1, y1, x2, y2, stroke, w, extra = '') => `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" ${extra}/>`;
const poly = (pts, stroke, w, extra = '') => `<polyline points="${pts.map(p => p.map(f1).join(',')).join(' ')}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;

/** sombra de papel: el mismo contenido desplazado y oscurecido */
function paper(inner, dx = 7, dy = 9, op = .22) {
  if (window.SKETCH) return inner;  // en el estilo dibujado no hay sombras de papel recortado
  const dark = inner.replace(/<defs>.*?<\/defs>/g, '').replace(/fill="(?!none)[^"]*"/g, 'fill="#241407"').replace(/stroke="(?!none)[^"]*"/g, 'stroke="#241407"');
  return `<g transform="translate(${dx},${dy})" opacity="${op}">${dark}</g>${inner}`;
}

/** capa con profundidad (0 fondo … 1 frente) */
const layer = (depth, inner, extra = '') => `<g class="L" data-d="${depth}" ${extra}>${inner}</g>`;

// ------------------------------------------------------------------ cielo y luz
let _gid = 0;
function sky(stops, id) {
  id = id || 'sky' + (_gid++);
  const st = stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('');
  return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${st}</linearGradient></defs>` + rect(-400, -400, W + 800, H + 800, `url(#${id})`);
}
function glow(x, y, r, color, op = .8) {
  const id = 'gl' + (_gid++);
  return `<defs><radialGradient id="${id}"><stop offset="0" stop-color="${color}" stop-opacity="${op}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient></defs>` + circle(x, y, r, `url(#${id})`);
}
function rays(x, y, r1, r2, n, color, op = .25, width = 6, rot = 0) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + rot * Math.PI / 180, w = (width / 360) * Math.PI * 2 / 2;
    const p = (ang, r) => `${f1(x + Math.cos(ang) * r)},${f1(y + Math.sin(ang) * r)}`;
    d += `M${p(a - w * .15, r1)}L${p(a - w, r2)}L${p(a + w, r2)}L${p(a + w * .15, r1)}Z`;
  }
  return path(d, color, `opacity="${op}"`);
}
/** Sol de Mayo simplificado (rayos rectos y flamígeros alternados) */
function solDeMayo(x, y, r, color = C.gold, dark = C.goldD) {
  let d = '';
  for (let i = 0; i < 32; i++) {
    const a = i / 32 * Math.PI * 2, R = r * (i % 2 ? 1.95 : 1.75);
    if (i % 2 === 0) {
      const w = .055; d += `M${f1(x + Math.cos(a - w) * r)},${f1(y + Math.sin(a - w) * r)}L${f1(x + Math.cos(a) * R)},${f1(y + Math.sin(a) * R)}L${f1(x + Math.cos(a + w) * r)},${f1(y + Math.sin(a + w) * r)}Z`;
    } else {
      const m = r + (R - r) * .5, w = .06;
      d += `M${f1(x + Math.cos(a - w) * r)},${f1(y + Math.sin(a - w) * r)}Q${f1(x + Math.cos(a + .09) * m)},${f1(y + Math.sin(a + .09) * m)} ${f1(x + Math.cos(a) * R)},${f1(y + Math.sin(a) * R)}Q${f1(x + Math.cos(a - .09) * m)},${f1(y + Math.sin(a - .09) * m)} ${f1(x + Math.cos(a + w) * r)},${f1(y + Math.sin(a + w) * r)}Z`;
    }
  }
  return path(d, color) + circle(x, y, r, color) + circle(x, y, r * .82, 'none', `stroke="${dark}" stroke-width="${r * .06}" opacity=".5"`);
}
function clouds(seed, n, y0, y1, color, op = .9, scale = 1) {
  const r = RNG(seed); let s = '';
  for (let i = 0; i < n; i++) {
    const x = r.range(-200, W + 200), y = r.range(y0, y1), w = r.range(160, 360) * scale;
    let d = `M${f1(x - w / 2)},${f1(y)}`;
    const bumps = 4 + Math.floor(r() * 3);
    for (let b = 0; b < bumps; b++) {
      const bx = x - w / 2 + (b + 1) * w / (bumps + 1), bh = r.range(.2, .45) * w;
      d += `Q${f1(bx - w / (bumps + 1) / 2)},${f1(y - bh)} ${f1(bx)},${f1(y - bh * .55)}`;
    }
    d += `Q${f1(x + w / 2 + 20)},${f1(y - 20)} ${f1(x + w / 2)},${f1(y)}Z`;
    s += path(d, color, `opacity="${op}"`) + `<path d="M${f1(x - w * .35)},${f1(y - 6)} Q${f1(x)},${f1(y - 14)} ${f1(x + w * .35)},${f1(y - 6)}" fill="none" stroke="#8fa6c0" stroke-width="2" opacity="${op * .5}"/>`;
  }
  return s;
}

// ------------------------------------------------------------------ terreno
/** cordillera facetada: picos + aristas irregulares + cara en sombra + nieve de borde dentado */
function mountains(seed, baseY, amp, color, { rough = .5, x0 = -300, x1 = W + 300, peaks = null, snow = null, n = 7, shadeOp = .2, jag = .06 } = {}) {
  const r = RNG(seed);
  if (!peaks) {
    peaks = [];
    const step = (x1 - x0) / n;
    for (let i = 0; i < n; i++) peaks.push([x0 + step * (i + .5) + r.range(-step * .25, step * .25), baseY - amp * r.range(.45, 1)]);
  }
  // valles entre picos
  const key = [[x0, baseY - amp * .15]];
  peaks.forEach((p, i) => {
    if (i > 0) { const q = peaks[i - 1]; key.push([(q[0] + p[0]) / 2 + r.range(-40, 40), Math.max(q[1], p[1]) + (baseY - Math.max(q[1], p[1])) * r.range(.25, .6)]); }
    key.push(p);
  });
  key.push([x1, baseY - amp * .15]);
  // aristas: subdivisión con desplazamiento proporcional al tramo
  let pts = key;
  for (let k = 0; k < 5; k++) {
    const np = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
      const [ax, ay] = pts[i - 1], [bx, by] = pts[i], len = Math.hypot(bx - ax, by - ay);
      np.push([(ax + bx) / 2 + r.range(-len, len) * jag * .5, (ay + by) / 2 + r.range(-len, len) * jag * (rough * 2)]); np.push([bx, by]);
    }
    pts = np;
  }
  const d = `M${x0},${H + 400}` + pts.map(([x, y]) => `L${f1(x)},${f1(y)}`).join('') + `L${x1},${H + 400}Z`;
  const cid = 'mc' + seed + '_' + (_gid++);
  let s = path(d, color) + `<clipPath id="${cid}"><path d="${d}"/></clipPath><g clip-path="url(#${cid})">`;
  // cara en sombra: desde cada pico hacia el valle derecho
  peaks.forEach((p, i) => {
    const nx = i < peaks.length - 1 ? (p[0] + peaks[i + 1][0]) / 2 : p[0] + 400;
    s += path(`M${f1(p[0])},${f1(p[1])} L${f1(nx + 60)},${f1(baseY + 60)} L${f1(p[0] + (nx - p[0]) * .08)},${f1(baseY + 60)}Z`, '#000', `opacity="${shadeOp}"`);
  });
  if (snow) {
    peaks.forEach((p, i) => {
      const depth = (baseY - p[1]) * (snow.frac ?? .3); if (depth < 12) return;
      const wdt = depth * 2.2; let zz = `M${f1(p[0] - wdt)},${f1(p[1] - 60)} L${f1(p[0] + wdt)},${f1(p[1] - 60)}`;
      const m = 14;
      for (let k = m; k >= 0; k--) { const x = p[0] - wdt + (2 * wdt) * k / m; const edge = 1 - Math.abs(k / m - .5) * 2; zz += ` L${f1(x)},${f1(p[1] + depth * (.35 + .65 * edge) * (k % 2 ? r.range(.55, .8) : r.range(.9, 1.15)))}`; }
      s += path(zz + 'Z', snow.color, `opacity="${snow.op ?? 1}"`);
      s += path(`M${f1(p[0])},${f1(p[1])} L${f1(p[0] + wdt)},${f1(p[1] + depth * 1.2)} L${f1(p[0] + depth * .1)},${f1(p[1] + depth * 1.2)}Z`, '#5a6a9a', `opacity="${(snow.op ?? 1) * .22}"`);
    });
  }
  return s + '</g>';
}
/** colinas suaves */
function hills(seed, baseY, amp, color, { freq = 1, x0 = -300, x1 = W + 300 } = {}) {
  const r = RNG(seed); const k = [r.range(.8, 1.4) * freq, r.range(2, 3) * freq, r.range(4, 6) * freq], ph = [r() * 6, r() * 6, r() * 6];
  let d = `M${x0},${H + 400}`;
  for (let x = x0; x <= x1; x += 20) {
    const u = x / W * Math.PI * 2;
    const y = baseY - amp * (.55 * Math.sin(u * k[0] + ph[0]) + .3 * Math.sin(u * k[1] + ph[1]) + .15 * Math.sin(u * k[2] + ph[2]));
    d += `L${x},${f1(y)}`;
  }
  return path(d + `L${x1},${H + 400}Z`, color);
}
function waves(y, color, { amp = 10, len = 140, phase = 0, x0 = -300, x1 = W + 300, bottom = H + 400 } = {}) {
  let d = `M${x0},${bottom}L${x0},${y}`;
  for (let x = x0; x <= x1; x += 10) d += `L${x},${f1(y + Math.sin((x / len) * Math.PI * 2 + phase) * amp)}`;
  return path(d + `L${x1},${bottom}Z`, color);
}

// ------------------------------------------------------------------ personas (dibujadas, sin rostro)
const INK = '#2b211c';
/** trazo fino de tinta (detalle a mano) */
const ink = (d, w = 1.4, op = .8) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${f1(w)}" stroke-linecap="round" stroke-linejoin="round" opacity="${op}"/>`;
/**
 * person(x, y, h, o): pies en (x,y), altura h.
 * o.pose: 'stand' | 'walk' | 'pray' | 'kneel' | 'raise' | 'bless' | 'heart' | 'reach' | 'carry' | 'wave' | 'hold'
 * o.robe (túnica larga) · o.dress (pollera) · o.jacket (color de saco abierto) · o.style ('short'|'long'|'bun'|'curly'|'bald')
 * o.color, o.skin, o.hair, o.back (de espaldas), o.flip, o.cap, o.hat, o.cape, o.veil, o.legs, o.sleeve, o.shoes, o.phase
 */
function person(x, y, h, o = {}) {
  const u = h / 100, col = o.color || '#555', skin = o.skin || C.skin[0], hair = o.hair || C.hair[0];
  const det = h > 55;                                  // con detalles sólo si la figura es visible
  const iw = Math.max(.8, Math.min(2.2, u * .9));      // grosor del trazo de detalle
  const lw = 7.8 * u, aw = 6.2 * u, pose = o.pose || 'stand', ph = o.phase || 0;
  const kneel = pose === 'kneel' || pose === 'pray';
  const dy = kneel ? 22 * u : 0;
  const hy = y - 91 * u + dy, hr = 8.4 * u;            // cabeza
  const sy = y - 78 * u + dy, sx = 10.8 * u;           // hombros
  const hipY = y - 44 * u + dy;
  const style = o.style || (o.long ? 'long' : 'short');
  const dark = shade(col, -.22), legCol = o.legs || (o.dress ? skin : shade(col, -.35)), shoe = o.shoes || '#3a2c24';
  let out = '';
  // ---- pelo largo por detrás del cuerpo
  if (!o.noHair && (style === 'long')) out += path(`M${f1(x - hr * 1.1)},${f1(hy)}Q${f1(x - hr * 1.5)},${f1(hy + hr * 2.4)} ${f1(x - hr * .7)},${f1(hy + hr * 2.9)}L${f1(x + hr * .7)},${f1(hy + hr * 2.9)}Q${f1(x + hr * 1.5)},${f1(hy + hr * 2.4)} ${f1(x + hr * 1.1)},${f1(hy)}Z`, hair);
  // ---- piernas y calzado
  if (!o.robe) {
    if (kneel) {
      out += poly([[x - 3 * u, hipY], [x - 4 * u, y - 4 * u], [x + 14 * u, y - 2 * u]], legCol, lw) + poly([[x + 3 * u, hipY], [x + 2 * u, y - 5 * u], [x + 18 * u, y - 3 * u]], legCol, lw) +
        ellipse(x + 18 * u, y - 3 * u, 4.5 * u, 3 * u, shoe);
    } else {
      const sw = pose === 'walk' ? Math.sin(ph) * 9 * u : 2.5 * u;
      const top = o.dress ? y - 30 * u : hipY;
      const l1 = [[x - 3.2 * u, top], [x - 3.2 * u - sw * .5, y - 22 * u], [x - 3.2 * u - sw, y - 2 * u]], l2 = [[x + 3.2 * u, top], [x + 3.2 * u + sw * .5, y - 22 * u], [x + 3.2 * u + sw, y - 2 * u]];
      out += poly(l1, legCol, o.dress ? lw * .7 : lw) + poly(l2, shade(legCol, -.08), o.dress ? lw * .7 : lw);
      out += ellipse(l1[2][0] - 1.5 * u, y - 1.2 * u, 5 * u, 2.6 * u, shoe) + ellipse(l2[2][0] + 1.5 * u, y - 1.2 * u, 5 * u, 2.6 * u, shoe);
      if (det && !o.dress) out += ink(`M${f1(x)},${f1(hipY + 2 * u)} L${f1(x + sw * .1)},${f1(y - 26 * u)}`, iw, .45);
    }
  } else if (!kneel) {
    out += ellipse(x - 4 * u, y - 1 * u, 5 * u, 2.4 * u, o.shoes || shoe) + ellipse(x + 5 * u, y - 1 * u, 5 * u, 2.4 * u, o.shoes || shoe);
  }
  // ---- cuerpo (torso + pollera/túnica)
  const hem = o.robe ? (kneel ? y - 2 * u : y - 2 * u) : o.dress ? y - 28 * u : hipY + 6 * u;
  const hw = o.robe ? 15.5 * u : o.dress ? 16 * u : 11.8 * u;
  const waist = hipY - 4 * u;
  const wx = o.robe ? sx + 1 * u : o.dress ? 9.5 * u : sx - .6 * u;
  const bodyD = `M${f1(x - sx)},${f1(sy + 3 * u)}Q${f1(x - sx)},${f1(sy - 2 * u)} ${f1(x - sx + 5 * u)},${f1(sy - 3 * u)}L${f1(x + sx - 5 * u)},${f1(sy - 3 * u)}Q${f1(x + sx)},${f1(sy - 2 * u)} ${f1(x + sx)},${f1(sy + 3 * u)}L${f1(x + wx)},${f1(waist)}L${f1(x + hw)},${f1(hem)}L${f1(x - hw)},${f1(hem)}L${f1(x - wx)},${f1(waist)}Z`;
  out += path(bodyD, col);
  // mitad derecha en sombra (la luz viene de la izquierda)
  out += path(`M${f1(x + 2 * u)},${f1(sy - 3 * u)}L${f1(x + sx - 5 * u)},${f1(sy - 3 * u)}Q${f1(x + sx)},${f1(sy - 2 * u)} ${f1(x + sx)},${f1(sy + 3 * u)}L${f1(x + wx)},${f1(waist)}L${f1(x + hw)},${f1(hem)}L${f1(x + 3 * u)},${f1(hem)}Z`, dark, 'opacity=".5"');
  if (o.jacket && !o.robe) {
    out += path(`M${f1(x - sx)},${f1(sy + 3 * u)}L${f1(x - 2 * u)},${f1(sy - 2 * u)}L${f1(x - 4 * u)},${f1(hem)}L${f1(x - hw - .5 * u)},${f1(hem)}Z`, o.jacket) + path(`M${f1(x + sx)},${f1(sy + 3 * u)}L${f1(x + 2 * u)},${f1(sy - 2 * u)}L${f1(x + 4 * u)},${f1(hem)}L${f1(x + hw + .5 * u)},${f1(hem)}Z`, shade(o.jacket, -.15));
  }
  if (o.cape) out += path(`M${f1(x - sx - 2 * u)},${f1(sy + 2 * u)}Q${f1(x)},${f1(sy - 8 * u)} ${f1(x + sx + 2 * u)},${f1(sy + 2 * u)}L${f1(x + sx + 3 * u)},${f1(sy + 18 * u)}Q${f1(x)},${f1(sy + 24 * u)} ${f1(x - sx - 3 * u)},${f1(sy + 18 * u)}Z`, o.cape);
  if (det) {
    // cuello, cinturón, pliegues
    if (!o.back && !o.robe) out += ink(`M${f1(x - 3.5 * u)},${f1(sy - 2.5 * u)} L${f1(x)},${f1(sy + 3 * u)} L${f1(x + 3.5 * u)},${f1(sy - 2.5 * u)}`, iw, .7);
    if (!o.robe && !o.dress) out += ink(`M${f1(x - sx + .6 * u)},${f1(waist + 1 * u)} Q${f1(x)},${f1(waist + 2.2 * u)} ${f1(x + sx - .6 * u)},${f1(waist + 1 * u)}`, iw, .55);
    if (o.robe) out += ink(`M${f1(x - 5 * u)},${f1(sy + 20 * u)} Q${f1(x - 7 * u)},${f1(hem - 20 * u)} ${f1(x - 9 * u)},${f1(hem - 1 * u)} M${f1(x + 4 * u)},${f1(sy + 26 * u)} Q${f1(x + 5 * u)},${f1(hem - 20 * u)} ${f1(x + 8 * u)},${f1(hem - 1 * u)}`, iw, .45);
    if (o.dress) out += ink(`M${f1(x - 6 * u)},${f1(waist + 4 * u)} L${f1(x - 10 * u)},${f1(hem - 1 * u)} M${f1(x + 3 * u)},${f1(waist + 4 * u)} L${f1(x + 5 * u)},${f1(hem - 1 * u)}`, iw, .4);
    out += ink(bodyD, iw * .9, .55);
  }
  if (o.veil) out += path(`M${f1(x - hr * 1.3)},${f1(hy + 2 * u)}Q${f1(x - hr * 1.35)},${f1(hy - hr * 1.55)} ${f1(x)},${f1(hy - hr * 1.4)}Q${f1(x + hr * 1.35)},${f1(hy - hr * 1.55)} ${f1(x + hr * 1.3)},${f1(hy + 2 * u)}L${f1(x + sx + 2 * u)},${f1(sy + 14 * u)}L${f1(x - sx - 2 * u)},${f1(sy + 14 * u)}Z`, o.veil) + (det ? ink(`M${f1(x - hr * 1.3)},${f1(hy + 2 * u)} L${f1(x - sx - 2 * u)},${f1(sy + 14 * u)}`, iw, .5) : '');
  // ---- brazos
  const L = [x - sx + 1.5 * u, sy + 1 * u], R = [x + sx - 1.5 * u, sy + 1 * u];
  const sl = o.sleeve || o.jacket || col;
  const A = (pts, c = sl) => poly(pts, c, aw) + (det ? `<polyline points="${pts.map(p => p.map(f1).join(',')).join(' ')}" fill="none" stroke="${INK}" stroke-width="${f1(iw * .8)}" stroke-linecap="round" stroke-linejoin="round" opacity=".35"/>` : '');
  const hand = (p) => circle(p[0], p[1], aw * .58, skin);
  const s = pose === 'walk' ? Math.sin(ph) * 8 * u : 0;
  const armsFor = {
    stand: () => { const a = [[L[0] - 2 * u, L[1] + 16 * u], [L[0] - 1 * u, L[1] + 32 * u]], b = [[R[0] + 2 * u, R[1] + 16 * u], [R[0] + 1 * u, R[1] + 32 * u]]; return A([L, ...a]) + A([R, ...b], shade(sl, -.12)) + hand(a[1]) + hand(b[1]); },
    walk: () => { const a = [[L[0] - 1 * u + s, L[1] + 16 * u], [L[0] + s * 1.6, L[1] + 31 * u]], b = [[R[0] + 1 * u - s, R[1] + 16 * u], [R[0] - s * 1.6, R[1] + 31 * u]]; return A([L, ...a]) + A([R, ...b], shade(sl, -.12)) + hand(a[1]) + hand(b[1]); },
    pray: () => { const m = [x, sy + 12 * u]; return A([L, [L[0] + 1 * u, L[1] + 15 * u], m]) + A([R, [R[0] - 1 * u, R[1] + 15 * u], m], shade(sl, -.12)) + path(`M${f1(m[0] - 2.6 * u)},${f1(m[1] + 2 * u)}L${f1(m[0])},${f1(m[1] - 7.5 * u)}L${f1(m[0] + 2.6 * u)},${f1(m[1] + 2 * u)}Z`, skin); },
    kneel: () => armsFor.pray(),
    raise: () => { const a = [[L[0] - 9 * u, L[1] - 12 * u], [L[0] - 14 * u, L[1] - 28 * u]], b = [[R[0] + 9 * u, R[1] - 12 * u], [R[0] + 14 * u, R[1] - 28 * u]]; return A([L, ...a]) + A([R, ...b], shade(sl, -.12)) + hand(a[1]) + hand(b[1]); },
    bless: () => { const a = [[L[0] - 2 * u, L[1] + 16 * u], [L[0] - 1 * u, L[1] + 32 * u]], b = [[R[0] + 10 * u, R[1] - 6 * u], [R[0] + 13 * u, R[1] - 22 * u]]; return A([L, ...a]) + A([R, ...b], shade(sl, -.12)) + hand(a[1]) + hand(b[1]); },
    heart: () => { const m = [x - 3 * u, sy + 9 * u]; const b = [[R[0] + 2 * u, R[1] + 16 * u], [R[0] + 1 * u, R[1] + 32 * u]]; return A([R, ...b], shade(sl, -.12)) + hand(b[1]) + A([L, [L[0] + 3 * u, L[1] + 14 * u], m]) + hand(m); },
    reach: () => { const a = [[L[0] - 2 * u, L[1] + 16 * u], [L[0] - 1 * u, L[1] + 32 * u]], b = [[R[0] + 12 * u, R[1] + 6 * u], [R[0] + 24 * u, R[1] + 10 * u]]; return A([L, ...a]) + A([R, ...b], shade(sl, -.12)) + hand(a[1]) + hand(b[1]); },
    hold: () => { const a = [[L[0] - 6 * u, L[1] + 14 * u], [L[0] - 16 * u, L[1] + 22 * u]], b = [[R[0] + 6 * u, R[1] + 14 * u], [R[0] + 16 * u, R[1] + 22 * u]]; return A([L, ...a]) + A([R, ...b], shade(sl, -.12)) + hand(a[1]) + hand(b[1]); },
    wave: () => { const a = [[L[0] - 2 * u, L[1] + 16 * u], [L[0] - 1 * u, L[1] + 32 * u]], b = [[R[0] + 9 * u, R[1] - 10 * u], [R[0] + 10 * u + Math.sin(ph * 2) * 5 * u, R[1] - 27 * u]]; return A([L, ...a]) + A([R, ...b], shade(sl, -.12)) + hand(a[1]) + hand(b[1]); },
    carry: () => { const a = [[L[0] + 4 * u, L[1] + 12 * u], [R[0] + 1 * u, R[1] - 3 * u]], b = [[R[0] + 5 * u, R[1] + 10 * u], [R[0] + 4 * u, R[1] - 5 * u]]; return A([L, ...a]) + A([R, ...b], shade(sl, -.12)) + hand(a[1]) + hand(b[1]); },
  };
  // brazos a medida (para animar trabajos): o.armsPts = { l: [[dx,dy],[dx,dy]], r: [...] } en unidades de altura/100 desde cada hombro
  if (o.armsPts) armsFor.custom = () => { const a = o.armsPts.l.map(([dx, dy2]) => [L[0] + dx * u, L[1] + dy2 * u]), b = o.armsPts.r.map(([dx, dy2]) => [R[0] + dx * u, R[1] + dy2 * u]); return A([R, ...b], shade(sl, -.12)) + hand(b[b.length - 1]) + A([L, ...a]) + hand(a[a.length - 1]); };
  const arms = (armsFor[o.armsPts ? 'custom' : pose] || armsFor.stand)();
  // ---- cuello y cabeza
  let head = rect(x - 2.4 * u, hy + hr * .6, 4.8 * u, 5 * u, shade(skin, -.08)) + circle(x, hy, hr, skin);
  if (!o.back && det) head += ellipse(x - hr * .98, hy + 1 * u, 1.6 * u, 2.4 * u, shade(skin, -.1)) + ellipse(x + hr * .98, hy + 1 * u, 1.6 * u, 2.4 * u, shade(skin, -.1));
  if (!o.noHair && style !== 'bald') {
    if (o.back) head += circle(x, hy - .3 * u, hr * 1.04, hair) + (det ? ink(`M${f1(x - hr * .5)},${f1(hy - hr * .6)} Q${f1(x)},${f1(hy + hr * .2)} ${f1(x + hr * .1)},${f1(hy + hr * .9)} M${f1(x + hr * .4)},${f1(hy - hr * .7)} Q${f1(x + hr * .6)},${f1(hy)} ${f1(x + hr * .7)},${f1(hy + hr * .7)}`, iw * .8, .45) : '');
    else head += path(`M${f1(x - hr * 1.07)},${f1(hy + 1.5 * u)}Q${f1(x - hr * 1.15)},${f1(hy - hr * 1.3)} ${f1(x)},${f1(hy - hr * 1.12)}Q${f1(x + hr * 1.15)},${f1(hy - hr * 1.3)} ${f1(x + hr * 1.07)},${f1(hy + 1.5 * u)}Q${f1(x + hr * .5)},${f1(hy - hr * .5)} ${f1(x - hr * .2)},${f1(hy - hr * .35)}Q${f1(x - hr * .8)},${f1(hy - hr * .2)} ${f1(x - hr * 1.07)},${f1(hy + 1.5 * u)}Z`, hair);
    if (style === 'bun') head += circle(x + (o.back ? 0 : hr * .3), hy - hr * 1.15, hr * .5, hair);
    if (style === 'curly') for (let i = 0; i < 7; i++) { const a2 = Math.PI + i / 6 * Math.PI; head += circle(x + Math.cos(a2) * hr * 1.02, hy + Math.sin(a2) * hr * 1.02, hr * .36, hair); }
  }
  if (o.cap) head += path(`M${f1(x - hr * .78)},${f1(hy - hr * .45)}Q${f1(x)},${f1(hy - hr * 1.38)} ${f1(x + hr * .78)},${f1(hy - hr * .45)}Z`, o.cap) + (det ? ink(`M${f1(x - hr * .78)},${f1(hy - hr * .45)} Q${f1(x)},${f1(hy - hr * 1.38)} ${f1(x + hr * .78)},${f1(hy - hr * .45)}Z`, iw * .7, .4) : '');
  if (o.hat) head += ellipse(x, hy - hr * .55, hr * 1.85, hr * .34, o.hat) + path(`M${f1(x - hr * .92)},${f1(hy - hr * .5)}Q${f1(x)},${f1(hy - hr * 1.95)} ${f1(x + hr * .92)},${f1(hy - hr * .5)}Z`, o.hat) + (det ? ink(`M${f1(x - hr * 1.85)},${f1(hy - hr * .55)} Q${f1(x)},${f1(hy - hr * .15)} ${f1(x + hr * 1.85)},${f1(hy - hr * .55)}`, iw, .6) : '');
  if (h > 120 && !o.back) {  // rostro mínimo de cuaderno: ojos, sonrisa y mejillas
    const e = hr * .3, ey = hy + hr * .05;
    head += circle(x - e, ey, Math.max(.7, hr * .075), INK, 'opacity=".75"') + circle(x + e, ey, Math.max(.7, hr * .075), INK, 'opacity=".75"') +
      ink(`M${f1(x - hr * .28)},${f1(hy + hr * .42)} Q${f1(x)},${f1(hy + hr * .62)} ${f1(x + hr * .28)},${f1(hy + hr * .42)}`, iw * .7, .7) +
      circle(x - hr * .55, hy + hr * .35, hr * .16, '#e88f7a', 'opacity=".35"') + circle(x + hr * .55, hy + hr * .35, hr * .16, '#e88f7a', 'opacity=".35"');
  }
  if (det) head += ink(`M${f1(x - hr)},${f1(hy)} A${f1(hr)},${f1(hr)} 0 1 0 ${f1(x + hr)},${f1(hy)} A${f1(hr)},${f1(hr)} 0 1 0 ${f1(x - hr)},${f1(hy)}`, iw * .8, .4);
  out += head + arms;
  const flip = o.flip ? `transform="translate(${f1(2 * x)},0) scale(-1,1)"` : '';
  return `<g ${flip}>${out}</g>`;
}
/** aclara/oscurece un color hex */
function shade(hex, k) {
  if (hex.length === 4) hex = '#' + [...hex.slice(1)].map(c => c + c).join('');
  const n = parseInt(hex.slice(1), 16); let r = n >> 16, g2 = n >> 8 & 255, b = n & 255;
  const f = v => Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k);
  return '#' + [f(r), f(g2), f(b)].map(v => v.toString(16).padStart(2, '0')).join('');
}
/** multitud en una franja (atrás más chicos) */
function crowd(seed, n, x0, x1, yBack, yFront, hBack, hFront, o = {}) {
  const r = RNG(seed); const ps = [];
  for (let i = 0; i < n; i++) {
    const k = Math.pow(r(), .8); // 0 atrás … 1 adelante
    const y = yBack + (yFront - yBack) * k, h = (hBack + (hFront - hBack) * k) * r.range(.82, 1.08);
    ps.push({ x: r.range(x0, x1), y, h, k, i });
  }
  ps.sort((a, b) => a.y - b.y);
  return ps.map(p => {
    const child = r() < (o.children ?? .15);
    const hh = child ? p.h * .62 : p.h;
    const fog = o.fog ? (1 - p.k) * o.fog : 0;
    const col = shade(r.pick(o.colors || C.cloth), fog);
    const pose = typeof o.pose === 'function' ? o.pose(r, p) : (o.pose || r.pick(['stand', 'stand', 'wave', 'raise']));
    const st = r.pick(['short', 'long', 'long', 'bun', 'curly', 'short']);
    return person(p.x, p.y, hh, { color: col, skin: shade(r.pick(C.skin), fog), hair: shade(r.pick(C.hair), fog), pose, back: o.back, style: st, dress: !child && r() < .25, jacket: r() < .25 ? shade(r.pick(C.cloth), fog - .1) : null, legs: r() < .5 ? shade('#3f4a66', fog) : null, phase: r() * 6, flip: r() < .5 });
  }).join('');
}
/** bandera argentina ondeando (w x h, asta a la izquierda) */
function flag(x, y, w, h, phase = 0, pole = true, amp = .06) {
  const pts = n => { const a = []; for (let i = 0; i <= n; i++) a.push(i / n); return a; };
  const P = (u, v) => [x + u * w, y + v * h + Math.sin(u * 5 + phase) * h * amp * u * 2];
  const band = (v0, v1, col) => path(`M${pts(16).map(u => P(u, v0).map(f1).join(',')).join('L')}L${pts(16).reverse().map(u => P(u, v1).map(f1).join(',')).join('L')}Z`, col);
  const [sx, sy] = P(.5, .5);
  return (pole ? line(x, y - 4, x, y + h * 4, '#6b5a48', Math.max(3, h * .06)) : '') +
    band(0, 1 / 3, C.celeste) + band(1 / 3, 2 / 3, C.white) + band(2 / 3, 1, C.celeste) + circle(sx, sy, h * .09, C.gold);
}
function dove(x, y, s, flap = 0, color = '#fff') {
  const wy = Math.sin(flap) * 14 * s;
  return `<g transform="translate(${f1(x)},${f1(y)}) scale(${s})">` +
    path(`M-30,0Q-10,-8 10,-4Q22,-12 30,-8Q26,-2 18,0Q10,8 -8,8Q-20,6 -30,0Z`, color) +
    path(`M-6,-2Q-2,${f1(-26 - wy)} 16,${f1(-40 - wy)}Q8,${f1(-18 - wy * .5)} 6,-2Z`, color, 'opacity=".95"') +
    path(`M-4,0Q-18,${f1(-20 + wy)} -34,${f1(-28 + wy)}Q-22,${f1(-10 + wy * .5)} -8,2Z`, shade(color, -.08)) + '</g>';
}
function cross(x, y, h, color, w = null) {
  w = w || h * .09; const arm = h * .62;
  return rect(x - w / 2, y - h, w, h, color) + rect(x - arm / 2, y - h * .76, arm, w, color);
}


// ------------------------------------------------------------------ detalles a mano (cuaderno)
/** matas de pasto: pequeños trazos en V dentro de una franja */
function grass(seed, n, x0, x1, y0, y1, color = '#4a6b3a', op = .6) {
  const r = RNG(seed); let d = '';
  for (let i = 0; i < n; i++) {
    const x = r.range(x0, x1), k = r(), y = y0 + (y1 - y0) * k, hh = 5 + k * 16;
    d += `M${f1(x - hh * .4)},${f1(y - hh)} L${f1(x)},${f1(y)} L${f1(x + hh * .1)},${f1(y - hh * 1.2)} M${f1(x)},${f1(y)} L${f1(x + hh * .5)},${f1(y - hh * .9)} `;
  }
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="round" opacity="${op}"/>`;
}
/** rayado a mano dentro de un contorno (clip) */
let _hid = 0;
function hatch(clipD, { angle = 35, gap = 9, w = 1.2, op = .45, color = INK, bbox = [-300, -300, W + 300, H + 300] } = {}) {
  const id = 'hc' + (_hid++); const [x0, y0, x1, y1] = bbox;
  const a = angle * Math.PI / 180, L = Math.hypot(x1 - x0, y1 - y0);
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2; let d = '';
  for (let k = -L / 2; k < L / 2; k += gap) {
    const px = cx + Math.cos(a + Math.PI / 2) * k, py = cy + Math.sin(a + Math.PI / 2) * k;
    d += `M${f1(px - Math.cos(a) * L / 2)},${f1(py - Math.sin(a) * L / 2)} L${f1(px + Math.cos(a) * L / 2)},${f1(py + Math.sin(a) * L / 2)} `;
  }
  return `<clipPath id="${id}"><path d="${clipD}"/></clipPath><path d="${d}" clip-path="url(#${id})" fill="none" stroke="${color}" stroke-width="${w}" opacity="${op}"/>`;
}
/** ladrillos / sillares a mano en un rectángulo */
function bricks(x, y, w, h, { bw = 46, bh = 20, op = .28, seed = 1 } = {}) {
  const r = RNG(seed); let d = '';
  for (let yy = y + bh, row = 0; yy < y + h; yy += bh, row++) {
    d += `M${f1(x)},${f1(yy + r.range(-1, 1))} L${f1(x + w)},${f1(yy + r.range(-1, 1))} `;
    for (let xx = x + (row % 2 ? bw / 2 : 0); xx < x + w; xx += bw) if (r() < .8) d += `M${f1(xx)},${f1(yy - bh)} L${f1(xx + r.range(-1, 1))},${f1(yy)} `;
  }
  return `<path d="${d}" fill="none" stroke="${INK}" stroke-width="1.1" opacity="${op}"/>`;
}
/** ventana con marco, vidrio y reflejo */
function windowBox(x, y, w, h, { glass = '#9cc4e8', frame = '#fbf8f1', arch = false } = {}) {
  const top = arch ? `M${x},${y + w / 2} Q${x},${y} ${x + w / 2},${y} Q${x + w},${y} ${x + w},${y + w / 2}` : `M${x},${y} L${x + w},${y}`;
  const d = `${top} L${x + w},${y + h} L${x},${y + h}Z`;
  return path(d, glass) + path(`M${x + w * .15},${y + h * .85} L${x + w * .55},${y + h * .25}`, 'none', `stroke="#fff" stroke-width="${f1(w * .08)}" opacity=".45"`) +
    `<path d="${d} M${x + w / 2},${y + (arch ? w * .15 : 0)} L${x + w / 2},${y + h} M${x},${y + h * .55} L${x + w},${y + h * .55}" fill="none" stroke="${frame}" stroke-width="${f1(Math.max(2, w * .08))}"/>` +
    ink(d, 1.3, .6) + rect(x - 4, y + h, w + 8, 6, frame);
}
/** follaje de árbol con trazos de lápiz */
function tree(x, y, s, c, seed = 1) {
  const r = RNG(seed); let blobs = '', scrib = '';
  const pts = [[0, -250, 110], [-80, -200, 80], [80, -190, 85], [-40, -300, 70], [50, -290, 72]];
  pts.forEach(([bx, by, br]) => { blobs += circle(bx, by, br, shade(c, r.range(-.12, .1))); });
  for (let i = 0; i < 26; i++) { const a = r() * 6.28, rr = r.range(20, 120), bx = Math.cos(a) * rr, by = -240 + Math.sin(a) * rr * .8; scrib += `M${f1(bx)},${f1(by)} q6,-8 12,0 q6,8 12,0 `; }
  return g(rect(-12, -200, 24, 210, '#6b4630') + ink('M-4,-10 L-2,-150 M5,-40 L4,-120', 1.2, .45) + ink('M0,-150 L-40,-200 M2,-160 L36,-205', 3, .5) +
    blobs + `<path d="${scrib}" fill="none" stroke="${shade(c, -.4)}" stroke-width="1.6" opacity=".35"/>`, `transform="translate(${f1(x)},${f1(y)}) scale(${s})"`);
}


/** rótulo manuscrito (cuaderno de viaje) con subrayado y flechita opcional */
function label(x, y, text, { size = 74, rot = -3, arrow = null, color = '#2b211c', sub = null } = {}) {
  const w = text.length * size * .42;
  let s = `<g transform="translate(${f1(x)},${f1(y)}) rotate(${rot})">` +
    `<text x="0" y="0" text-anchor="middle" font-family="Caveat" font-weight="700" font-size="${size}" fill="${color}">${text}</text>` +
    `<path d="M${f1(-w / 2)},${f1(size * .22)} Q0,${f1(size * .34)} ${f1(w / 2)},${f1(size * .18)}" fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round" opacity=".8"/>`;
  if (sub) s += `<text x="0" y="${f1(size * .95)}" text-anchor="middle" font-family="Caveat" font-weight="600" font-size="${f1(size * .62)}" fill="${color}" opacity=".85">${sub}</text>`;
  if (arrow) { const [ax, ay] = arrow; s += `<path d="M${f1(ax > 0 ? w / 2 + 10 : -w / 2 - 10)},${f1(-size * .2)} Q${f1(ax * .6)},${f1(ay * .2 - size * .6)} ${f1(ax)},${f1(ay)}" fill="none" stroke="${color}" stroke-width="2.6" stroke-linecap="round"/><path d="M${f1(ax - 12)},${f1(ay - 12)} L${f1(ax)},${f1(ay)} L${f1(ax + (ax > 0 ? -2 : 14))},${f1(ay - 18)}" fill="none" stroke="${color}" stroke-width="2.6" stroke-linecap="round"/>`; }
  return s + '</g>';
}

// ------------------------------------------------------------------ texturas globales (una sola vez)
function paperTexture(seed = 3) {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const x = cv.getContext('2d'); const img = x.createImageData(W, H); const r = RNG(seed);
  for (let i = 0; i < img.data.length; i += 4) { const v = 128 + (r() - .5) * 46; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
  x.putImageData(img, 0, 0);
  // fibras
  x.globalAlpha = .07; x.strokeStyle = '#000';
  for (let i = 0; i < 900; i++) { x.beginPath(); const a = r() * 6.28, l = r.range(8, 40), px = r() * W, py = r() * H; x.moveTo(px, py); x.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l); x.lineWidth = r.range(.4, 1.2); x.stroke(); }
  return cv.toDataURL('image/jpeg', .9);
}

window.LIB = { label, grass, hatch, bricks, windowBox, tree, ink, INK, W, H, RNG, C, g, path, rect, circle, ellipse, line, poly, paper, layer, sky, glow, rays, solDeMayo, clouds, mountains, hills, waves, person, shade, crowd, flag, dove, cross, paperTexture, f1 };
