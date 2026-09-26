// Transcribe un audio en español con Whisper small (ONNX, sin conexión).
//   ASR_DIR=<carpeta con node_modules de @huggingface/transformers y sts-whisper-small>
//   node videoclip/transcribe.mjs <audio> <salida.json> [--words] [--from s] [--to s]
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';

const [, , input, out, ...rest] = process.argv;
const opt = k => { const i = rest.indexOf(k); return i >= 0 ? rest[i + 1] : undefined; };
const ASR = process.env.ASR_DIR;
const require = createRequire(path.join(ASR, 'package.json'));
const { pipeline, env } = await import(require.resolve('@huggingface/transformers'));
env.allowRemoteModels = false;
env.localModelPath = path.join(ASR, 'node_modules/sts-whisper-small/models');

const FFMPEG = execSync(`python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())"`).toString().trim();
const ss = opt('--from') ? `-ss ${opt('--from')}` : '';
const to = opt('--to') ? `-to ${opt('--to')}` : '';
const raw = execSync(`"${FFMPEG}" -v error ${ss} ${to} -i "${input}" -ac 1 -ar 16000 -f f32le -`, { maxBuffer: 1 << 30 });
const audio = new Float32Array(raw.buffer, raw.byteOffset, raw.byteLength / 4);

const asr = await pipeline('automatic-speech-recognition', 'Xenova/whisper-small', { dtype: 'q8' });
const t0 = Date.now();
const res = await asr(audio, {
  language: 'spanish', task: 'transcribe',
  chunk_length_s: 30, stride_length_s: 5,
  return_timestamps: rest.includes('--words') ? 'word' : true,
});
res.offset = parseFloat(opt('--from') || 0);
fs.writeFileSync(out, JSON.stringify(res, null, 1));
console.log(res.text);
console.error(`(${((Date.now() - t0) / 1000).toFixed(0)} s)`);
