import { crearEl } from '../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { ReproductorVideo } from '../../../components/ui/video/video.js';
import { Boton } from '../../../components/ui/button/button.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { corner1 } from '../../../components/ui/card/card-decoraciones.js';

// ============================================================================
//  Sources de demo (videos públicos / open source)
// ============================================================================
const VIDEO = {
  bunny:    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  elephant: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  forBigger:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  joyride:  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
};
const POSTER = {
  bunny:    'https://picsum.photos/seed/bunny-poster/1280/720',
  elephant: 'https://picsum.photos/seed/elephant-poster/1280/720',
  forBigger:'https://picsum.photos/seed/forbigger-poster/1280/720',
  joyride:  'https://picsum.photos/seed/joyride-poster/1280/720',
};

const card = (...nodos) => crearEl('div', {
  style: {
    padding: 'var(--space-4)',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
  },
}, nodos);

// ============================================================================
//  Página
// ============================================================================
export default async () => PaginaShowcase({
  titulo: 'Reproductor de video custom',
  descripcion: 'Reproductor personalizado sobre `<video>` HTML5 nativo — alternativa cero-dependencias a Plyr.js (~50KB). Controles propios con seek bar reactiva, hover scrubber con tooltip de tiempo, buffer indicator, volumen con slider expandible, menú de velocidades, picture-in-picture, fullscreen, capítulos como markers en la barra y spinner de buffering.',
  decoracion: corner1(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    // ============== 1. REPRODUCTOR PRINCIPAL ==============
    Seccion({
      titulo: '1 · Reproductor con todos los controles',
      descripcion: 'Set completo: play/pause central + en barra, seek con tooltip de tiempo en hover, buffer progress, retroceder/avanzar 10s, volumen expandible, velocidad (0.5× → 2×), PiP y fullscreen. Hover sobre el video revela los controles con animación.',
      hijos: [VistaCodigo({
        vista: ReproductorVideo({
          src: VIDEO.bunny,
          poster: POSTER.bunny,
          titulo: 'Big Buck Bunny',
          autor: 'Blender Foundation · 2008',
        }),
        codigo: `ReproductorVideo({
  src: '/videos/big-buck-bunny.mp4',
  poster: '/posters/bbb.jpg',
  titulo: 'Big Buck Bunny',
  autor: 'Blender Foundation · 2008',
  // velocidades, autoplay, loop, mute, ratio configurables
})`,
      })],
    }),

    // ============== 2. CON CAPÍTULOS ==============
    Seccion({
      titulo: '2 · Capítulos marcados en la seek bar',
      descripcion: 'Para tutoriales y documentales, los `capitulos` aparecen como pequeños ticks en la barra de progreso. El usuario puede saltar a cada uno haciendo click en el track. Idéntico al patrón de YouTube y Vimeo.',
      hijos: [VistaCodigo({
        vista: ReproductorVideo({
          src: VIDEO.elephant,
          poster: POSTER.elephant,
          titulo: 'Capítulos · 4 secciones',
          autor: 'Tutorial completo · 9:56',
          capitulos: [
            { t: 0,    label: 'Introducción' },
            { t: 60,   label: 'Setup del proyecto' },
            { t: 180,  label: 'Implementación' },
            { t: 360,  label: 'Conclusiones' },
          ],
        }),
        codigo: `ReproductorVideo({
  src, poster, titulo,
  capitulos: [
    { t: 0,   label: 'Introducción' },
    { t: 60,  label: 'Setup' },                  // ← marker en 1:00
    { t: 180, label: 'Implementación' },         // ← marker en 3:00
    { t: 360, label: 'Conclusiones' },
  ],
})`,
      })],
    }),

    // ============== 3. RATIOS Y TAMAÑOS ==============
    Seccion({
      titulo: '3 · Aspect ratios — vertical (Reels) y cuadrado',
      descripcion: 'El reproductor se adapta a `9/16` para historias / Reels o `1/1` para Instagram. Mantiene controles legibles porque la barra siempre se ancla al fondo.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', alignItems: 'start' } }, [
          crearEl('div', null, [
            crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontWeight: 700, marginBlockEnd: '8px' } }, ['9/16 · STORIES / REELS']),
            crearEl('div', { style: { maxWidth: '280px' } }, [
              ReproductorVideo({
                src: VIDEO.forBigger,
                poster: POSTER.forBigger,
                ratio: '9/16',
                titulo: 'Behind the scenes',
              }),
            ]),
          ]),
          crearEl('div', null, [
            crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontWeight: 700, marginBlockEnd: '8px' } }, ['1/1 · INSTAGRAM SQUARE']),
            crearEl('div', { style: { maxWidth: '420px' } }, [
              ReproductorVideo({
                src: VIDEO.joyride,
                poster: POSTER.joyride,
                ratio: '1/1',
                titulo: 'Anuncio cuadrado',
              }),
            ]),
          ]),
        ]),
        codigo: `ReproductorVideo({ src, ratio: '9/16' })  // vertical
ReproductorVideo({ src, ratio: '1/1' })   // cuadrado`,
      })],
    }),

    // ============== 4. CURSO ONLINE ==============
    Seccion({
      titulo: '4 · Plataforma de cursos — video + lecciones + tabs',
      descripcion: 'Layout completo de Udemy/Coursera. Reproductor principal con capítulos, lista lateral de lecciones con progreso y tabs debajo (Resumen · Notas · Recursos · Comentarios).',
      hijos: [VistaCodigo({
        vista: crearEl('div', {
          style: {
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 2.4fr) minmax(0, 1fr)',
            gap: 'var(--space-4)',
          },
        }, [
          // Columna principal
          crearEl('div', null, [
            ReproductorVideo({
              src: VIDEO.bunny,
              poster: POSTER.bunny,
              titulo: '04 · Patrones avanzados con señales',
              autor: 'María García · Lección 4 de 12',
              capitulos: [
                { t: 0,    label: 'Intro' },
                { t: 45,   label: 'computed()' },
                { t: 120,  label: 'efectos anidados' },
                { t: 240,  label: 'Cleanup' },
                { t: 380,  label: 'Resumen' },
              ],
            }),
            // Tabs simulados
            crearEl('div', {
              style: { display: 'flex', gap: 'var(--space-4)', borderBottom: '1px solid var(--border)', marginBlockStart: 'var(--space-4)' },
            },
              ['Resumen', 'Notas', 'Recursos', 'Comentarios (24)', 'Quiz'].map((t, i) => crearEl('button', {
                style: {
                  padding: '12px 0',
                  background: 'transparent', border: 0,
                  fontSize: 'var(--text-sm)', fontWeight: i === 0 ? 700 : 500,
                  color: i === 0 ? 'var(--primary)' : 'var(--muted-foreground)',
                  borderBottom: i === 0 ? '2px solid var(--primary)' : '2px solid transparent',
                  cursor: 'pointer',
                  marginBlockEnd: '-1px',
                },
              }, [t])),
            ),
            crearEl('div', { style: { paddingBlock: 'var(--space-4)', fontSize: 'var(--text-sm)', lineHeight: 1.6, color: 'var(--muted-foreground)' } },
              ['En esta lección exploramos cómo combinar computed values con efectos para construir UIs reactivas sin sobre-renders. Veremos el patrón de "derivar antes de rastrear", el uso de peek() y cómo evitar loops infinitos con dependencias circulares…']),
          ]),
          // Sidebar lecciones
          crearEl('div', {
            style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' },
          }, [
            crearEl('div', { style: { padding: 'var(--space-3)', borderBottom: '1px solid var(--border)' } }, [
              crearEl('div', { style: { fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' } }, ['CONTENIDO DEL CURSO']),
              crearEl('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBlockStart: '6px' } }, [
                crearEl('div', { style: { fontSize: 'var(--text-sm)', fontWeight: 700 } }, ['12 lecciones · 2h 14m']),
                crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--color-success)', fontWeight: 700 } }, ['33% completado']),
              ]),
              crearEl('div', { style: { height: '4px', borderRadius: '999px', background: 'var(--muted)', overflow: 'hidden', marginBlockStart: '8px' } }, [
                crearEl('div', { style: { width: '33%', height: '100%', background: 'linear-gradient(90deg, var(--color-success), var(--primary))' } }),
              ]),
            ]),
            crearEl('div', null,
              [
                ['ok', 1, 'Setup del proyecto', '8:24'],
                ['ok', 2, 'crearEl y composición', '15:10'],
                ['ok', 3, 'Reactividad básica', '12:00'],
                ['activo', 4, 'Patrones avanzados', '18:45'],
                ['', 5, 'Computed values', '7:32'],
                ['', 6, 'Patrón store global', '14:18'],
                ['lock', 7, 'Bonus: Server-side', '9:00'],
              ].map(([estado, n, t, d]) => crearEl('div', {
                style: {
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: 'var(--space-3)',
                  borderBottom: '1px solid var(--border)',
                  background: estado === 'activo' ? 'color-mix(in srgb, var(--primary) 8%, transparent)' : 'transparent',
                  cursor: estado === 'lock' ? 'not-allowed' : 'pointer',
                  opacity: estado === 'lock' ? 0.5 : 1,
                },
              }, [
                crearEl('span', {
                  style: {
                    width: '22px', height: '22px', borderRadius: '50%',
                    background: estado === 'ok' ? 'var(--color-success)'
                              : estado === 'activo' ? 'var(--primary)'
                              : estado === 'lock' ? 'var(--muted)'
                              : 'color-mix(in srgb, var(--muted-foreground) 18%, transparent)',
                    color: estado === 'lock' ? 'var(--muted-foreground)' : '#fff',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '11px', fontWeight: 700,
                  },
                }, [estado === 'ok' ? Icono('check', { tamano: 12 }) : estado === 'lock' ? Icono('candado', { tamano: 11 }) : String(n)]),
                crearEl('div', { style: { flex: 1, minWidth: 0 } }, [
                  crearEl('div', { style: { fontSize: 'var(--text-sm)', fontWeight: estado === 'activo' ? 700 : 500, color: estado === 'activo' ? 'var(--primary)' : 'var(--foreground)' } }, [t]),
                  crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBlockStart: '2px' } }, [d]),
                ]),
              ])),
            ),
          ]),
        ]),
        codigo: `ReproductorVideo({
  src, poster, titulo, autor,
  capitulos: [
    { t: 0,   label: 'Intro' },
    { t: 45,  label: 'computed()' },
    { t: 120, label: 'efectos anidados' },
    { t: 240, label: 'Cleanup' },
  ],
})`,
      })],
    }),

    // ============== 5. POST DE BLOG / ARTÍCULO ==============
    Seccion({
      titulo: '5 · Embebido en post de blog',
      descripcion: 'Reproductor inline en el flujo de un artículo, con caption descriptivo abajo. Patrón Substack / Medium / Hashnode.',
      hijos: [VistaCodigo({
        vista: card(
          crearEl('article', { style: { maxWidth: '720px', margin: '0 auto' } }, [
            crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBlockEnd: '6px' } }, ['ARTÍCULO · 6 MIN DE LECTURA']),
            crearEl('h2', { style: { margin: '0 0 12px', fontSize: 'var(--text-2xl)', fontWeight: 800, lineHeight: 1.2 } }, ['Cómo construimos un reproductor de video sin dependencias']),
            crearEl('p', { style: { color: 'var(--muted-foreground)', fontSize: 'var(--text-base)', lineHeight: 1.65, marginBlockEnd: '20px' } },
              ['La mayoría de proyectos que necesitan un reproductor recurren a Plyr o Video.js, pero ambos pesan entre 50KB y 200KB. Si solo necesitas controles básicos sobre `<video>` puedes hacerlo todo en ~6KB de JS vanilla. Aquí va una demo:']),
            ReproductorVideo({
              src: VIDEO.elephant,
              poster: POSTER.elephant,
              titulo: 'Demo del reproductor custom',
              autor: 'En vivo dentro del artículo',
            }),
            crearEl('p', { style: { color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', fontStyle: 'italic', marginBlock: '8px 24px', textAlign: 'center' } },
              ['↑ El mismo reproductor que verías en producción, sin npm install.']),
            crearEl('p', { style: { color: 'var(--foreground)', fontSize: 'var(--text-base)', lineHeight: 1.65 } },
              ['Lo interesante es que la API del browser para `<video>` es muy completa. Solo necesitas escuchar `timeupdate`, `progress`, `play`, `pause`, `volumechange` y reaccionar con tu propio UI. Cero magia.']),
          ]),
        ),
        codigo: `// Embedido inline en artículo
<article>
  <h2>{titulo}</h2>
  <p>{intro}</p>
  <ReproductorVideo src={...} poster={...} />
  <p><em>↑ caption</em></p>
  <p>{continuación del texto}</p>
</article>`,
      })],
    }),

    // ============== 6. AUTOPLAY HERO BACKGROUND ==============
    Seccion({
      titulo: '6 · Hero background loop (autoplay + mute + loop)',
      descripcion: 'Para landings cinematográficas. Video se reproduce solo, en silencio (requerimiento de los browsers), en loop, con texto sobreimpreso. Sin controles para no distraer (`controles: false`).',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden' } }, [
          ReproductorVideo({
            src: VIDEO.joyride,
            poster: POSTER.joyride,
            ratio: '21/9',
            controles: false,
            autoplay: true,
            mute: true,
            loop: true,
          }),
          // Overlay con CTA
          crearEl('div', {
            style: {
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, transparent 0%, rgb(0 0 0 / 0.65) 100%)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
              padding: 'var(--space-6)',
              color: '#fff',
              textAlign: 'center',
              pointerEvents: 'none',
            },
          }, [
            crearEl('h2', { style: { margin: '0 0 8px', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.02em', textShadow: '0 4px 16px rgb(0 0 0 / 0.5)' } },
              ['El producto que tu equipo merece.']),
            crearEl('p', { style: { margin: '0 0 16px', fontSize: 'var(--text-lg)', opacity: 0.92, textShadow: '0 2px 8px rgb(0 0 0 / 0.5)' } },
              ['Diseñado para escalar. Construido para durar.']),
            crearEl('div', { style: { display: 'inline-flex', gap: '10px', pointerEvents: 'auto' } }, [
              Boton({ texto: 'Ver demo', variante: 'primary' }),
            ]),
          ]),
        ]),
        codigo: `ReproductorVideo({
  src, poster,
  ratio: '21/9',
  controles: false,                 // sin barra
  autoplay: true,                   // arranca solo
  mute: true,                       // silenciado (requerido)
  loop: true,                       // reinicia al terminar
})`,
      })],
    }),

    // ============== 7. PODCAST / AUDIO-FIRST ==============
    Seccion({
      titulo: '7 · Podcast — video + transcripción',
      descripcion: 'Layout vertical para episodios de podcast con video. Player arriba + transcripción navegable abajo. Click en cualquier párrafo navega al timestamp (en producción).',
      hijos: [VistaCodigo({
        vista: card(
          crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: '14px', marginBlockEnd: '14px' } }, [
            crearEl('div', { style: { width: '64px', height: '64px', borderRadius: '12px', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff' } },
              [Icono('chat', { tamano: 28 })]),
            crearEl('div', null, [
              crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' } }, ['EPISODIO #14']),
              crearEl('h3', { style: { margin: '4px 0 0', fontSize: 'var(--text-lg)', fontWeight: 700 } }, ['El futuro del desarrollo web sin frameworks']),
              crearEl('div', { style: { fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' } }, ['Tech Pals · 48 min · 6 días atrás']),
            ]),
          ]),
          ReproductorVideo({
            src: VIDEO.forBigger,
            poster: POSTER.forBigger,
            titulo: 'Episodio 14',
          }),
          crearEl('div', { style: { marginBlockStart: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' } }, [
            crearEl('div', { style: { fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBlockEnd: '10px' } }, ['📝 TRANSCRIPCIÓN · CLICK EN UN PÁRRAFO PARA SALTAR']),
            crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', fontSize: 'var(--text-sm)', lineHeight: 1.55 } },
              [
                ['00:12', 'María', 'Bienvenidos al episodio 14. Hoy hablamos sobre por qué cada vez más equipos están volviendo a JavaScript vanilla…'],
                ['01:24', 'Carlos', 'Yo creo que es una reacción natural al tamaño de los bundles. Tener que mandarle al usuario 200KB de framework antes de que vea algo es absurdo.'],
                ['02:48', 'María', 'Y no es solo eso — la API del browser ha mejorado tanto en los últimos 5 años que muchas cosas que antes requerían librería ahora son nativas.'],
                ['04:15', 'Carlos', 'Exacto. View Transitions API, Constructable Stylesheets, signals que vienen en propuesta…'],
              ].map(([t, q, txt]) => crearEl('div', { style: { display: 'flex', gap: '10px', cursor: 'pointer', padding: '8px', borderRadius: '6px' } }, [
                crearEl('span', { style: { fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--primary)', fontWeight: 700, minWidth: '46px', flexShrink: 0 } }, [t]),
                crearEl('div', null, [
                  crearEl('span', { style: { fontWeight: 700, color: 'var(--foreground)', marginInlineEnd: '6px' } }, [q + ':']),
                  crearEl('span', { style: { color: 'var(--muted-foreground)' } }, [txt]),
                ]),
              ])),
            ),
          ]),
        ),
        codigo: `// Podcast con transcripción navegable
ReproductorVideo({ src, poster, titulo })
+ <div>{transcripcion.map(({timestamp, hablante, texto}) =>
    <p onClick={() => seek(timestamp)}>{...}</p>)}</div>`,
      })],
    }),

    // ============== 8. PRODUCT TOUR ==============
    Seccion({
      titulo: '8 · Product tour — wizard con 3 videos',
      descripcion: 'Onboarding interactivo. Pasos numerados arriba, video del paso activo en el centro, navegación abajo. Patrón usado por Notion, Linear y Figma para tutoriales.',
      hijos: [VistaCodigo({
        vista: card(
          crearEl('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBlockEnd: 'var(--space-4)' } }, [
            crearEl('div', { style: { display: 'flex', gap: '10px', alignItems: 'center' } },
              [1, 2, 3].map((n) => crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } }, [
                crearEl('div', {
                  style: {
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: n === 1 ? 'var(--primary)' : 'var(--muted)',
                    color: n === 1 ? '#fff' : 'var(--muted-foreground)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 'var(--text-sm)',
                  },
                }, [String(n)]),
                n < 3 && crearEl('div', { style: { width: '40px', height: '2px', background: 'var(--border)' } }),
              ])),
            ),
            crearEl('div', { style: { fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontWeight: 600 } }, ['Paso 1 de 3']),
          ]),
          crearEl('h3', { style: { margin: '0 0 4px', fontSize: 'var(--text-xl)', fontWeight: 700 } }, ['Crea tu primer proyecto']),
          crearEl('p', { style: { color: 'var(--muted-foreground)', margin: '0 0 var(--space-3)', fontSize: 'var(--text-sm)' } }, ['En 90 segundos te mostramos cómo crear, configurar y desplegar tu primer proyecto desde cero.']),
          ReproductorVideo({
            src: VIDEO.bunny,
            poster: POSTER.bunny,
            titulo: 'Paso 1: Crear proyecto',
          }),
          crearEl('div', { style: { display: 'flex', justifyContent: 'space-between', marginBlockStart: 'var(--space-4)' } }, [
            Boton({ texto: '← Anterior', variante: 'ghost' }),
            crearEl('div', { style: { display: 'flex', gap: '8px' } }, [
              Boton({ texto: 'Saltar tutorial', variante: 'ghost' }),
              Boton({ texto: 'Siguiente →', variante: 'primary' }),
            ]),
          ]),
        ),
        codigo: `// Wizard / onboarding con video por paso
const pasos = [
  { titulo: 'Crear proyecto', src: 'tour-1.mp4' },
  { titulo: 'Añadir colaboradores', src: 'tour-2.mp4' },
  { titulo: 'Desplegar', src: 'tour-3.mp4' },
];
ReproductorVideo({ src: pasos[indice].src, ... })`,
      })],
    }),

    // ============== 9. COMPARATIVA ==============
    Seccion({
      titulo: '9 · Comparativa side-by-side (antes / después)',
      descripcion: 'Para mostrar cambios, mejoras o demostraciones A/B. Dos reproductores sincronizados visualmente con etiquetas claras. Patrón usado en case studies de optimización (rendimiento, conversión, etc.).',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' } }, [
          crearEl('div', null, [
            crearEl('div', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: 'color-mix(in srgb, var(--color-danger) 15%, transparent)', color: 'var(--color-danger)', borderRadius: '999px', fontSize: 'var(--text-xs)', fontWeight: 700, marginBlockEnd: '8px' } }, ['● ANTES · v1.2']),
            ReproductorVideo({
              src: VIDEO.elephant,
              poster: POSTER.elephant,
              titulo: 'Flujo legacy',
            }),
            crearEl('div', { style: { marginBlockStart: '10px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' } }, ['Tiempo de checkout: ', crearEl('strong', { style: { color: 'var(--color-danger)' } }, ['4:32 min'])]),
          ]),
          crearEl('div', null, [
            crearEl('div', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: 'color-mix(in srgb, var(--color-success) 15%, transparent)', color: 'var(--color-success)', borderRadius: '999px', fontSize: 'var(--text-xs)', fontWeight: 700, marginBlockEnd: '8px' } }, ['● DESPUÉS · v2.0']),
            ReproductorVideo({
              src: VIDEO.joyride,
              poster: POSTER.joyride,
              titulo: 'Flujo rediseñado',
            }),
            crearEl('div', { style: { marginBlockStart: '10px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' } }, ['Tiempo de checkout: ', crearEl('strong', { style: { color: 'var(--color-success)' } }, ['1:18 min']), ' · -71%']),
          ]),
        ]),
        codigo: `// Antes / después
<div style="display: grid; grid-template-columns: 1fr 1fr">
  <div>
    <Badge tipo="danger">ANTES</Badge>
    <ReproductorVideo src={antes} />
  </div>
  <div>
    <Badge tipo="success">DESPUÉS</Badge>
    <ReproductorVideo src={despues} />
  </div>
</div>`,
      })],
    }),

    // ============== 10. CONFIGURACIONES ==============
    Seccion({
      titulo: '10 · Configuraciones y atributos',
      descripcion: 'Controles totalmente opcionales. `velocidades` define el menú de speed, `loop` reinicia al terminar, `controles: false` lo deja sin barra (útil para hero backgrounds).',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' } }, [
          crearEl('div', null, [
            crearEl('div', { style: { fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--muted-foreground)', marginBlockEnd: '8px' } }, ['LOOP + MUTE']),
            ReproductorVideo({
              src: VIDEO.bunny,
              poster: POSTER.bunny,
              ratio: '4/3',
              loop: true,
              mute: true,
              titulo: 'Bucle silencioso',
            }),
          ]),
          crearEl('div', null, [
            crearEl('div', { style: { fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--muted-foreground)', marginBlockEnd: '8px' } }, ['VELOCIDADES CUSTOM']),
            ReproductorVideo({
              src: VIDEO.elephant,
              poster: POSTER.elephant,
              ratio: '4/3',
              velocidades: [1, 1.5, 2, 3],
              titulo: 'Sin slow-motion',
            }),
          ]),
        ]),
        codigo: `ReproductorVideo({
  src,
  ratio: '16/9',                       // o '4/3', '1/1', '9/16', '21/9'
  poster: '/poster.jpg',
  titulo: 'Mi video',
  autor: 'Autor opcional',
  capitulos: [{ t: 60, label: 'Inicio' }, ...],
  velocidades: [0.5, 0.75, 1, 1.25, 1.5, 2],
  loop: false,
  autoplay: false,
  mute: false,
  controles: true,                     // false = sin barra (hero)
})`,
      })],
    }),

  ],
});
