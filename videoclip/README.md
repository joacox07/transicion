# Videoclip «SEAMOS UNO» · Visita del Papa León XIV a la Argentina (2026)

Videoclip horizontal **1920×1080, 30 fps, 4:02** para YouTube, con la canción completa
(3:40) y los créditos al final. Todo está **ilustrado a mano en código** en estilo
*sketchbook*: tinta que "respira" como animación dibujada (a 15 dibujos por segundo),
acuarela y papel. La letra aparece sincronizada palabra por palabra.

## Archivos finales (`output/`)

| Archivo | Uso |
|---|---|
| `seamos-uno-videoclip.mp4` | Versión para subir a YouTube (máxima calidad, audio AAC 320k) |
| `seamos-uno-videoclip-liviano.mp4` | Versión liviana para WhatsApp / revisar en el celular |
| `miniatura.jpg` | Miniatura sugerida para YouTube |

## Sincronización de la letra

La canción se transcribió con Whisper (modelo *small*, sin conexión) para obtener el tiempo de
cada palabra; los tramos dudosos se volvieron a transcribir por separado. Los tiempos están en
`lyrics.json` (editable a mano: `w` = inicio de cada palabra, `end` = cuándo se retira el verso).
El mensaje de voz con las indicaciones está transcripto en `indicaciones-tia.md`.

## Guion de imágenes (sigue el guion de Marina)

| Tiempo | Verso | Imagen |
|---|---|---|
| 0:00 | (introducción) | Amanecer sobre la cordillera, sale el Sol de Mayo, palomas; título «SEAMOS UNO» y «Visita del Papa León XIV a la Argentina · 2026» |
| 0:28 | Desde las montañas hasta el mar | El Aconcagua; la cámara baja hasta la costa patagónica, el faro y una ballena |
| 0:33 | hay un pueblo queriendo despertar | Panorámica al amanecer: Buenos Aires y el Puente de la Mujer → Cerro de los Siete Colores y Purmamarca (Jujuy) → Garganta del Diablo, palmeras y tucán (Misiones) |
| 0:39 | hombres y mujeres de buena voluntad | La pampa en movimiento: un agricultor carpe, una mujer cosecha tomates, un chico corre, el gaucho lleva su caballo, otro carga un cajón de frutas; el tractor cruza al fondo, gira el molino |
| 0:44 | oyendo el llamado de su identidad | Vitral (estilo catedral de Rosario): Belgrano iza la bandera junto al río |
| 0:50 | Llega el sucesor del pescador | Barca y redes llenas de peces al amanecer; las llaves de Pedro en el cielo |
| 0:56 | el siervo de los siervos de Dios | Viernes Santo: figura de blanco, descalza, con la cruz al hombro; velas y arcos del Coliseo |
| 1:02 | Vamos a su encuentro creciendo en unidad | Peregrinación que crece por un camino hacia el sol |
| 1:07 | a escuchar al peregrino de la paz | Balcón con la figura de blanco bendiciendo; palomas; la gente con los brazos en alto |
| 1:13 | Como pueblo seamos uno | Plaza de Mayo: Casa Rosada, Pirámide, banderas |
| 1:18 | Como Iglesia seamos uno | Plaza de San Pedro colmada |
| 1:24 | Con María seamos uno | Basílica de Luján y la Virgen de Luján con peregrinos |
| 1:30 | Que en el Uno seamos uno | Eucaristía: custodia con rayos dorados; la luz da paso a la segunda parte |
| 1:40 | Abrid el corazón de par en par | Mano en el corazón frente a un lago patagónico |
| 1:46 | allí donde Dios quiere habitar | Oración al aire libre (retiro) junto a una cruz de madera |
| 1:52 | Desplegando toda nuestra humanidad | Olla/mesa solidaria con los más pequeños |
| 1:57 | el bien común podremos alcanzar | Una joven acompaña a un abuelo en la plaza |
| 2:03 | Sigamos los pasos de Jesús | Huellas en un sendero de montaña |
| 2:09 | con los ojos fijos en la Cruz | Cruz en la loma al atardecer |
| 2:14 | El amor y la verdad se encontrarán | Dos caminantes se encuentran en el puente |
| 2:20 | la justicia y la paz se abrazarán | Abrazo, arco iris y paloma con el olivo |
| 2:25 | Como pueblo seamos uno | Argentinos de todas las regiones, de la mano, al atardecer |
| 2:31 | Como Iglesia seamos uno | Capilla de pueblo, la campana y la comunidad |
| 2:37 | Con María seamos uno | Procesión nocturna con velas y la Virgen de Luján en andas |
| 2:42 | Que en el Uno seamos uno | Altar: el sacerdote eleva la Hostia, el cáliz, los vitrales |
| 2:49 | Familias… seamos uno | Tres generaciones de la mano, barrilete y perro |
| 2:54 | Consagrados… seamos uno | Sacerdotes, religiosas y frailes frente a la iglesia |
| 3:00 | Argentina… seamos uno | El mapa con sus regiones y su gente alrededor |
| 3:06 | En el Uno… seamos uno | Todos caminan desde los bordes hacia la luz de la Cruz |
| 3:12 | Como pueblo seamos uno | El papamóvil recorre la avenida (Obelisco), banderas y papelitos |
| 3:18 | Como Iglesia seamos uno | Gran misa al aire libre de noche, luces y velas |
| 3:23 | Con María seamos uno | El manto celeste y blanco de la Virgen se abre sobre su pueblo |
| 3:29 | Que en el Uno seamos uno | Mosaico con todas las escenas que se funden en la luz: «SEAMOS UNO» |
| 3:37 | (créditos) | Créditos con la foto del equipo de grabación al costado |

Sin rótulos ni carteles: cada lugar se reconoce por el dibujo (por ejemplo, la Basílica de Luján con sus
dos torres neogóticas, el rosetón y los tres portales).

El Papa y las personas aparecen siempre como figuras dibujadas (de espaldas, de lejos o
estilizadas), nunca como retrato.

## Cómo regenerarlo

```bash
bash videoclip/build.sh
```

- `lib.js`: primitivas de dibujo (personas con ropa y pelo, montañas, banderas, árboles, texturas).
- `scenes1.js`, `scenes2.js`, `scenes3.js`: una ilustración animada por verso.
- `clip.js`: línea de tiempo, cámara con paralaje, letra sincronizada, título y créditos.
- `sketchpost.py`: el acabado dibujado (tinta, acuarela, rayado, papel) con OpenCV.
- `render.mjs`: captura cada cuadro con Chromium y lo pasa al postproceso.
- `transcribe.mjs`: transcripción con Whisper (requiere los paquetes npm `@huggingface/transformers` y `sts-whisper-small`).

Para ver la animación en vivo con la música: `npx http-server videoclip` y abrir `index.html`
(o `index.html?t=90` para congelar un instante).
