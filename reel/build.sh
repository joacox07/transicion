#!/usr/bin/env bash
# Genera el Reel completo: recursos -> música -> cuadros -> MP4 final con audio.
set -euo pipefail
cd "$(dirname "$0")"

pip install -q pillow numpy imageio-ffmpeg
FFMPEG=$(python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")

python3 prepare_assets.py
python3 music.py
# tres tramos en paralelo (cada uno arranca en un cuadro clave) y concatenación sin recodificar
node render.mjs --from 0 --to 15 & node render.mjs --from 15 --to 30 & node render.mjs --from 30 --to 45 & wait
printf "file 'part-0-15.mp4'\nfile 'part-15-30.mp4'\nfile 'part-30-45.mp4'\n" > build/parts.txt
"$FFMPEG" -y -loglevel error -f concat -safe 0 -i build/parts.txt -c copy build/frames.mp4

mkdir -p output
# Mezcla final: audio normalizado a -14 LUFS (estándar de Instagram/Reels), AAC 48 kHz.
"$FFMPEG" -y -loglevel error -i build/frames.mp4 -i build/music.wav \
  -map 0:v -map 1:a -c:v copy \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11" -ar 48000 -c:a aac -b:a 256k \
  -movflags +faststart -shortest output/mision-rosario-reel.mp4

# Versión sin música (por si se quiere usar un audio en tendencia desde Instagram)
"$FFMPEG" -y -loglevel error -i build/frames.mp4 -c:v copy -an -movflags +faststart output/mision-rosario-reel-sin-audio.mp4

# Portada sugerida (cuadro con el título del gancho)
"$FFMPEG" -y -loglevel error -ss 2.2 -i build/frames.mp4 -frames:v 1 -q:v 2 output/portada.jpg

echo "Listo -> reel/output/"
