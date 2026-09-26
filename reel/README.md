# Reel · Misión Rosario (Eutrapelia × Familias Peregrinas)

Video vertical **1080×1920, 30 fps, 45 s** para Instagram Reels / TikTok / Shorts, hecho
a partir de las fotos del producto. Todo está animado en código (HTML/CSS/JS renderizado
cuadro por cuadro con Chromium) y la música es original, sintetizada, sin derechos de autor.

## Archivos finales (`output/`)

| Archivo | Uso |
|---|---|
| `mision-rosario-reel.mp4` | Reel con música, audio normalizado a −14 LUFS |
| `mision-rosario-reel-sin-audio.mp4` | Misma edición sin música, para usar un audio en tendencia de Instagram |
| `portada.jpg` | Portada sugerida («Tu familia tiene una misión») |

## Guion (compás de 2,5 s a 96 BPM, cada corte cae en el tiempo fuerte)

| Tiempo | Escena |
|---|---|
| 0:00 – 0:03.7 | **Gancho.** Acercamiento a la Virgen de la caja con partículas doradas: «Eutrapelia presenta · Tu familia tiene una *misión*». |
| 0:03.7 – 0:08.7 | Apertura en iris a papel. Se dibuja el rosario del logo **Misión Rosario** y aparece la frase «Con María, volvemos a mirar y escuchar a Jesús, para llevar su vida al mundo». |
| 0:08.7 – 0:12.5 | **Caja en 3D**: gira desde el lomo hasta el frente, con reflejo de luz. «Cartas para rezar el Rosario *en familia*». |
| 0:12.5 – 0:15 | Las cartas se abren en abanico: «Los *20 misterios* del Rosario» + etiquetas de colores. |
| 0:15 – 0:25 | Una carta por misterio, con el día en que se reza y un detalle resaltado: Gozosos (imagen para contemplar), Luminosos (el Evangelio), Dolorosos (oración breve), Gloriosos (una Palabra para guardar). |
| 0:25 – 0:30 | «Y además»: carta *¿Por qué rezar el Rosario HOY?* y *Letanías de la Virgen*, con la cita «La familia que reza unida, permanece unida». |
| 0:30 – 0:35 | **Atril de madera** con las fotos reales (frente y perfil). |
| 0:35 – 0:38.7 | Una propuesta de **Eutrapelia**: «Unir la alegría del juego con el desarrollo de la virtud». |
| 0:38.7 – 0:45 | **Cierre**: caja flotando con rayos de luz, «Conseguilo en **eutrapelia.com.ar**», logos Eutrapelia + Familias Peregrinas. |

Todos los textos quedan dentro de la zona segura de Reels (sin tapar con la interfaz
de arriba, abajo ni los botones laterales). Se puede comprobar con `index.html?guides`.

## Texto sugerido para la publicación

> 📿 **Misión Rosario** · Cartas para rezar el Rosario en familia.
> Los 20 misterios con una imagen para contemplar, el Evangelio y una oración breve,
> + ¿Por qué rezar el Rosario hoy? + Letanías de la Virgen + atril de madera.
>
> «Con María, volvemos a mirar y escuchar a Jesús, para llevar su vida al mundo».
>
> 👉 Conseguilo en **eutrapelia.com.ar**
>
> #MisiónRosario #Rosario #RosarioEnFamilia #Eutrapelia #FamiliasPeregrinas #VirgenMaría #FeCatólica #JuegosCatólicos #CatequesisFamiliar

## Cómo regenerarlo

```bash
bash reel/build.sh
```

- `prepare_assets.py`: endereza en perspectiva cada carta, la caja y el lomo; extrae los logos
  impresos como máscaras limpias; genera la textura de papel. Las esquinas de cada carta están
  en `assets/cards.json`.
- `music.py`: compone la banda sonora (colchón, celesta, bajo, latido, campanitas y whooshes
  sincronizados con cada carta).
- `index.html` + `reel.js`: la animación; `render(t)` es una función pura del tiempo.
  Abrí `index.html` con un servidor local (`npx http-server reel`) para verla en vivo,
  o `index.html?t=20` para congelar un instante.
- `render.mjs`: renderiza cada cuadro con Playwright y lo codifica con ffmpeg
  (`--stills 1,5,20` para capturas sueltas).

Para cambiar un texto, editá el `data-lines` correspondiente en `index.html`
(`|` = salto de línea, `*palabra*` = cursiva dorada) y volvé a correr `build.sh`.
