#!/usr/bin/env bash
# Une los tramos renderizados (incluidos los re-renders parciales) y mezcla el audio final.
set -euo pipefail
cd "$(dirname "$0")"
FFMPEG=$(python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")
B=build
# tramo: archivo  inicio-dentro-del-archivo  fin-dentro-del-archivo   (tiempos del videoclip entre corchetes)
"$FFMPEG" -y -loglevel error \
  -i $B/partA-0-81.mp4 -i $B/partB-81-91.mp4 -i $B/part-81-162.mp4 -i $B/part-162-242.mp4 -i $B/partC-188-217.mp4 \
  -filter_complex "\
[0:v]trim=0:81,setpts=PTS-STARTPTS[a];\
[1:v]trim=0:10,setpts=PTS-STARTPTS[b];\
[2:v]trim=10:81,setpts=PTS-STARTPTS[c];\
[3:v]trim=0:26,setpts=PTS-STARTPTS[d];\
[4:v]trim=0:29,setpts=PTS-STARTPTS[e];\
[3:v]trim=55:80,setpts=PTS-STARTPTS[f];\
[a][b][c][d][e][f]concat=n=6:v=1:a=0[v]" \
  -map "[v]" -c:v libx264 -preset slow -crf 16 -pix_fmt yuv420p -profile:v high -r 30 \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 $B/frames.mp4
mkdir -p output
"$FFMPEG" -y -loglevel error -i $B/frames.mp4 -i $B/audio.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -ar 48000 \
  -movflags +faststart -shortest output/seamos-uno-videoclip.mp4
"$FFMPEG" -y -loglevel error -i output/seamos-uno-videoclip.mp4 -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p -c:a aac -b:a 160k \
  -movflags +faststart output/seamos-uno-videoclip-liviano.mp4
"$FFMPEG" -y -loglevel error -ss 8.5 -i output/seamos-uno-videoclip.mp4 -frames:v 1 -q:v 2 output/miniatura.jpg
ls -la output
