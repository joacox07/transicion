#!/usr/bin/env bash
# Video de letra: une los tramos renderizados (0 → 219,6 s) con los créditos cortados tal cual del
# videoclip ya renderizado (219,6 s → final) y le pone el mismo audio.
set -euo pipefail
cd "$(dirname "$0")"
FFMPEG=$(python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")
B=build
CLIP=${CLIP:-$B/seamos-uno-maxima.mp4}   # videoclip en máxima calidad (fuente de los créditos)
"$FFMPEG" -y -loglevel error \
  -i $B/letra-0-73.mp4 -i $B/letra-73-146.mp4 -i $B/letra-146-219.6.mp4 -ss 219.6 -i "$CLIP" \
  -filter_complex "[0:v]setpts=PTS-STARTPTS[a];[1:v]setpts=PTS-STARTPTS[b];[2:v]setpts=PTS-STARTPTS[c];[3:v]setpts=PTS-STARTPTS[d];[a][b][c][d]concat=n=4:v=1:a=0[v]" \
  -map "[v]" -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -profile:v high -r 30 \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 $B/letra-frames.mp4
mkdir -p output
"$FFMPEG" -y -loglevel error -i $B/letra-frames.mp4 -i $B/audio.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -ar 48000 \
  -movflags +faststart -shortest output/seamos-uno-letra.mp4
"$FFMPEG" -y -loglevel error -i output/seamos-uno-letra.mp4 -vf scale=1280:720 -c:v libx264 -preset slow -crf 25 -pix_fmt yuv420p \
  -c:a aac -b:a 128k -movflags +faststart output/seamos-uno-letra-whatsapp.mp4
ls -la output/seamos-uno-letra*.mp4
