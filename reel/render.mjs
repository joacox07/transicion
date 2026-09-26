// Renderiza el Reel cuadro por cuadro con Chromium (Playwright) y lo codifica con ffmpeg.
//
//   node reel/render.mjs                       -> reel/build/frames.mp4 (video sin audio)
//   node reel/render.mjs --stills 1,5.2,20     -> reel/build/still-<t>.png
//   node reel/render.mjs --from 10 --to 12     -> sólo un tramo (para revisar)
//
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn, execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const globalRoot = execSync('npm root -g').toString().trim();
const { chromium } = require(path.join(globalRoot, 'playwright'));

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BUILD = path.join(HERE, 'build');
fs.mkdirSync(BUILD, { recursive: true });

const args = process.argv.slice(2);
const opt = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
const FFMPEG = process.env.FFMPEG || execSync(`python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())"`).toString().trim();

// --- servidor estático mínimo (las máscaras CSS necesitan http, no file://)
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  const p = path.join(HERE, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(HERE) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}/index.html?render${args.includes('--guides') ? '&guides' : ''}`;

const browser = await chromium.launch({ args: ['--force-color-profile=srgb', '--disable-lcd-text', '--font-render-hinting=none'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
page.on('console', m => console.log('[page]', m.text()));
page.on('pageerror', e => console.error('[page error]', e));
await page.goto(base);
await page.waitForFunction(() => window.READY === true, null, { timeout: 60000 });
const { DURATION, FPS } = await page.evaluate(() => window.REEL);
const stage = await page.$('#stage');

const shot = async t => {
  await page.evaluate(t => window.render(t), t);
  await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
  return stage.screenshot({ type: 'png', animations: 'disabled' });
};

if (opt('--stills')) {
  for (const t of opt('--stills').split(',').map(Number)) {
    fs.writeFileSync(path.join(BUILD, `still-${t.toFixed(2)}.png`), await shot(t));
    console.log('still', t);
  }
} else {
  const from = parseFloat(opt('--from') ?? 0), to = parseFloat(opt('--to') ?? DURATION);
  const out = opt('--out') || path.join(BUILD, from === 0 && to === DURATION ? 'frames.mp4' : `part-${from}-${to}.mp4`);
  const ff = spawn(FFMPEG, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-pix_fmt', 'yuv420p', '-profile:v', 'high',
    '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const n0 = Math.round(from * FPS), n1 = Math.round(to * FPS);
  const t0 = Date.now();
  for (let i = n0; i < n1; i++) {
    const buf = await shot(i / FPS);
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 30 === 0) console.log(`frame ${i}/${n1}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  console.log('ok ->', out);
}
await browser.close();
server.close();
