/* Estilo «sketchbook»: postproceso SVG aplicado a cada escena.
 * - trazo de tinta a mano: bordes detectados en la imagen, engrosados y desplazados con ruido
 * - rellenos en acuarela: colores aclarados, algo desaturados, con granulado de papel
 * - sombreado a lápiz (rayado) en las zonas oscuras
 * - «boil»: el dibujo tiembla levemente cambiando de semilla cada 4 cuadros, como animación a mano
 */
(() => {
  window.SKETCH = true;
  // en modo «post» el dibujado se aplica fuera del navegador (sketchpost.py, mucho más rápido)
  window.SKETCH_FILTER = !location.search.includes('post');
  const N = 3;

  // trama de rayado a lápiz (tile 28x28)
  const cv = document.createElement('canvas'); cv.width = cv.height = 28;
  const x = cv.getContext('2d');
  x.strokeStyle = 'rgba(60,45,38,.55)'; x.lineWidth = 1.3; x.lineCap = 'round';
  for (let i = -28; i < 56; i += 7) { x.beginPath(); x.moveTo(i, 28); x.lineTo(i + 28, 0); x.stroke(); }
  const hatch = cv.toDataURL('image/png');


  // ---- ruido precalculado: una textura por semilla, se escala con interpolación suave
  function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  /** ruido suave RGBA: w x h de salida, cells = tamaño de la grilla base (más chico = más suave), octaves */
  function noiseURL(seed, w, h, cells, octaves = 2, alphaMode = false) {
    const out = document.createElement('canvas'); out.width = w; out.height = h; const o = out.getContext('2d');
    o.fillStyle = '#808080'; o.fillRect(0, 0, w, h);
    const r = rng(seed); let amp = 1, tot = 0;
    for (let k = 0; k < octaves; k++) {
      const cw = Math.max(2, Math.round(cells * Math.pow(2, k))), ch = Math.max(2, Math.round(cw * h / w));
      const c = document.createElement('canvas'); c.width = cw; c.height = ch; const x = c.getContext('2d');
      const img = x.createImageData(cw, ch);
      for (let i = 0; i < img.data.length; i += 4) { img.data[i] = r() * 255; img.data[i + 1] = r() * 255; img.data[i + 2] = r() * 255; img.data[i + 3] = 255; }
      x.putImageData(img, 0, 0);
      o.globalAlpha = amp / (tot + amp); o.imageSmoothingEnabled = true; o.imageSmoothingQuality = 'high';
      o.drawImage(c, 0, 0, w, h); tot += amp; amp *= .5;
    }
    if (alphaMode) { const d = o.getImageData(0, 0, w, h); for (let i = 0; i < d.data.length; i += 4) { d.data[i + 3] = d.data[i]; } o.putImageData(d, 0, 0); }
    return out.toDataURL('image/png');
  }
  const NZ = [...Array(3)].map((_, k) => ({
    warp: noiseURL(11 + k * 7, 480, 270, 30, 2),
    warp2: noiseURL(5 + k * 3, 960, 540, 86, 1),
    warp3: noiseURL(40 + k, 480, 270, 58, 2),
    pn: noiseURL(2 + k, 1920, 1080, 1152, 1),
    bl: noiseURL(31 + k, 320, 180, 21, 3),
  }));
  const img = (href, res) => `<feImage href="${href}" x="-40" y="-40" width="2000" height="1160" preserveAspectRatio="none" result="${res}"/>`;
  const filt = k => `
  <filter id="sk${k}" filterUnits="userSpaceOnUse" x="-40" y="-40" width="2000" height="1160" color-interpolation-filters="sRGB">
    ${img(NZ[k].warp, "warp")}
    <feDisplacementMap in="SourceGraphic" in2="warp" scale="8" xChannelSelector="R" yChannelSelector="G" result="wob"/>
    <feFlood flood-color="#8a8a8a" result="fl"/>
    <feComposite in="wob" in2="fl" operator="over" result="flat"/>
    <feColorMatrix in="flat" type="matrix" values=".3 .59 .11 0 0  .3 .59 .11 0 0  .3 .59 .11 0 0  0 0 0 1 0" result="gray0"/>
    <feGaussianBlur in="gray0" stdDeviation="2.2" result="gray"/>
    <feConvolveMatrix in="gray" order="3" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" preserveAlpha="true" result="e1"/>
    <feComponentTransfer in="gray" result="inv"><feFuncR type="table" tableValues="1 0"/><feFuncG type="table" tableValues="1 0"/><feFuncB type="table" tableValues="1 0"/></feComponentTransfer>
    <feConvolveMatrix in="inv" order="3" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" preserveAlpha="true" result="e2"/>
    <feComposite in="e1" in2="e2" operator="arithmetic" k2="1" k3="1" result="e"/>
    <feColorMatrix in="e" type="matrix" values="0 0 0 0 .13  0 0 0 0 .10  0 0 0 0 .09  7 7 7 0 -.55" result="ink0"/>
    <feMorphology in="ink0" operator="dilate" radius=".35" result="ink1"/>
    ${img(NZ[k].warp2, "warp2")}
    <feDisplacementMap in="ink1" in2="warp2" scale="4.5" xChannelSelector="R" yChannelSelector="G" result="ink2"/>
    ${img(NZ[k].pn, "pn")}
    <feColorMatrix in="pn" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1.8 0 0 0 1.6" result="pmask"/>
    <feComposite in="ink2" in2="pmask" operator="in" result="ink"/>
    ${img(NZ[k].warp3, "warp3")}
    <feDisplacementMap in="wob" in2="warp3" scale="14" xChannelSelector="G" yChannelSelector="R" result="bleed"/>
    <feColorMatrix in="bleed" type="saturate" values=".92" result="sat"/>
    <feComponentTransfer in="sat" result="wash"><feFuncR type="linear" slope=".86" intercept=".13"/><feFuncG type="linear" slope=".86" intercept=".12"/><feFuncB type="linear" slope=".86" intercept=".10"/></feComponentTransfer>
    ${img(NZ[k].bl, "bl")}
    <feColorMatrix in="bl" type="matrix" values=".22 0 0 0 .8  .22 0 0 0 .795  .22 0 0 0 .79  0 0 0 0 1" result="blot"/>
    <feBlend in="wash" in2="blot" mode="multiply" result="wc0"/>
    <feComposite in="wc0" in2="bleed" operator="in" result="wc"/>
    <feImage href="${hatch}" x="0" y="0" width="28" height="28" result="ht"/>
    <feTile in="ht" result="hatchT"/>
    <feColorMatrix in="gray" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2.4 -2.4 -2.4 0 1.05" result="dark"/>
    <feComposite in="dark" in2="SourceAlpha" operator="in" result="darkA"/>
    <feComposite in="hatchT" in2="darkA" operator="in" result="hatch"/>
    <feMerge><feMergeNode in="wc"/><feMergeNode in="hatch"/><feMergeNode in="ink"/></feMerge>
  </filter>`;

  const washF = k => `
  <filter id="skw${k}" filterUnits="userSpaceOnUse" x="-40" y="-40" width="2000" height="1160" color-interpolation-filters="sRGB">
    <feColorMatrix in="SourceGraphic" type="saturate" values=".92" result="sat"/>
    <feComponentTransfer in="sat" result="wash"><feFuncR type="linear" slope=".86" intercept=".13"/><feFuncG type="linear" slope=".86" intercept=".12"/><feFuncB type="linear" slope=".86" intercept=".10"/></feComponentTransfer>
    ${img(NZ[k].bl, "bl")}
    <feColorMatrix in="bl" type="matrix" values=".24 0 0 0 .78  .24 0 0 0 .775  .24 0 0 0 .77  0 0 0 0 1" result="blot"/>
    <feBlend in="wash" in2="blot" mode="multiply" result="w0"/>
    <feComposite in="w0" in2="SourceGraphic" operator="in"/>
  </filter>`;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', 0); svg.setAttribute('height', 0); svg.style.position = 'absolute';
  svg.innerHTML = `<defs>${[...Array(N)].map((_, k) => filt(k) + washF(k)).join('')}</defs>`;
  document.body.appendChild(svg);
  window.SKETCH_N = N;
})();
