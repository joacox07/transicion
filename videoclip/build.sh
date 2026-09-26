#!/usr/bin/env bash
# Genera el videoclip completo «SEAMOS UNO» (1920x1080, 30 fps).
set -euo pipefail
cd "$(dirname "$0")"

pip install -q numpy pillow imageio-ffmpeg opencv-python-headless
FFMPEG=$(python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")
mkdir -p build output

# 1) audio: canción completa + cierre instrumental (inicio de la misma canción, más suave) bajo los créditos
"$FFMPEG" -y -loglevel error -i assets/seamos-uno.mp3 -i assets/seamos-uno.mp3 -filter_complex \
  "[1:a]atrim=1:24,asetpts=PTS-STARTPTS,volume=0.55,afade=t=in:d=1.8,afade=t=out:st=19.2:d=3.8,adelay=218600|218600[b];[0:a][b]amix=inputs=2:normalize=0:duration=longest,atrim=0:242,aresample=48000[a]" \
  -map "[a]" -c:a pcm_s16le build/audio.wav

# 2) miniaturas del mosaico final (cuadros de cada escena)
node render.mjs --mosaic
python3 -c "
from PIL import Image; import glob, os
for f in glob.glob('assets/mosaic/*.png'):
    Image.open(f).convert('RGB').resize((500, 282), Image.LANCZOS).save(f[:-4] + '.jpg', quality=88); os.remove(f)"

# 3) cuadros: ilustración (Chromium) + dibujado a mano (sketchpost.py), en tres tramos en paralelo
node render.mjs --post --from 0 --to 81 & node render.mjs --post --from 81 --to 162 & node render.mjs --post --from 162 --to 242 & wait
printf "file 'part-0-81.mp4'\nfile 'part-81-162.mp4'\nfile 'part-162-242.mp4'\n" > build/parts.txt
"$FFMPEG" -y -loglevel error -f concat -safe 0 -i build/parts.txt -c copy build/frames.mp4

# 4) mezcla final
"$FFMPEG" -y -loglevel error -i build/frames.mp4 -i build/audio.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -ar 48000 \
  -movflags +faststart -shortest output/seamos-uno-videoclip.mp4
"$FFMPEG" -y -loglevel error -i output/seamos-uno-videoclip.mp4 -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p -c:a aac -b:a 160k \
  -movflags +faststart output/seamos-uno-videoclip-liviano.mp4
"$FFMPEG" -y -loglevel error -ss 8.5 -i output/seamos-uno-videoclip.mp4 -frames:v 1 -q:v 2 output/miniatura.jpg
echo "Listo -> videoclip/output/"
