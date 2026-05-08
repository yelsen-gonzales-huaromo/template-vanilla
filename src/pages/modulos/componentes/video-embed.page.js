import { crearEl } from '../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { EmbedVideo, TarjetaVideo, GaleriaVideos } from '../../../components/ui/video/video.js';
import { Boton } from '../../../components/ui/button/button.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { corner7 } from '../../../components/ui/card/card-decoraciones.js';

// ============================================================================
//  URLs públicas embebibles (todas verificadas como `allow-embed`)
// ============================================================================
const VIDEO = {
  ytCostaRica:   'https://www.youtube.com/watch?v=LXb3EKWsInQ',         // 4K nature
  ytBunny:       'https://www.youtube.com/watch?v=aqz-KE-bpKQ',         // Big Buck Bunny
  ytSintel:      'https://www.youtube.com/watch?v=eRsGyueVLvQ',         // Sintel (Blender)
  ytTearsSteel:  'https://www.youtube.com/watch?v=R6MlUcmOul8',         // Tears of Steel
  ytNature:      'https://www.youtube.com/watch?v=DTOzc1tdxqk',         // Nature 4K
  ytMeAtZoo:     'https://www.youtube.com/watch?v=jNQXAC9IVRw',         // Primer video de YouTube
  vimeoBunny:    'https://vimeo.com/76979871',                          // Big Buck Bunny en Vimeo
  loomDemo:      'https://www.loom.com/share/2fefe8bb01a14e3691d27baf17c92e44',
  streamable:    'https://streamable.com/moo',                          // demo public
};

const POSTER = {
  hero:    'https://picsum.photos/seed/launchpad-hero/1280/720',
  webinar: 'https://picsum.photos/seed/launchpad-webinar/640/360',
  curso:   'https://picsum.photos/seed/launchpad-curso/640/360',
  tutorial:'https://picsum.photos/seed/launchpad-tutorial/640/360',
  evento:  'https://picsum.photos/seed/launchpad-evento/640/360',
  demo:    'https://picsum.photos/seed/launchpad-demo/640/360',
  podcast: 'https://picsum.photos/seed/launchpad-podcast/640/360',
  noticia: 'https://picsum.photos/seed/launchpad-noticia/640/360',
  marketing:'https://picsum.photos/seed/launchpad-marketing/1280/720',
  docs:    'https://picsum.photos/seed/launchpad-docs/640/360',
  social:  'https://picsum.photos/seed/launchpad-social/640/640',
};

// ============================================================================
//  Helpers presentación
// ============================================================================
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
  titulo: 'Videos embebidos',
  descripcion: 'Embedding profesional de YouTube, Vimeo, Loom, Wistia y Streamable. Auto-detección de proveedor por URL, aspect-ratio fijo (16/9 · 4/3 · 1/1 · 9/16 · 21/9), modo lazy con poster click-to-play (ahorra ~500KB de iframe inicial), parámetros como autoplay/mute, galerías estilo YouTube, layouts de webinar/curso/podcast.',
  decoracion: corner7(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    // ============== 1. YOUTUBE BÁSICO ==============
    Seccion({
      titulo: '1 · YouTube — embebido directo',
      descripcion: 'El proveedor se detecta automáticamente por la URL. El componente extrae el ID, normaliza la URL al endpoint `/embed/` y aplica `rel=0&modestbranding=1` para una experiencia más limpia (sin sugerencias de otros canales al final).',
      hijos: [VistaCodigo({
        vista: EmbedVideo({
          src: VIDEO.ytCostaRica,
          titulo: 'Costa Rica en 4K · 60fps HDR',
        }),
        codigo: `EmbedVideo({
  src: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
  // proveedor se autodetecta: 'youtube'
  // ratio: '16/9' por default
})`,
      })],
    }),

    // ============== 2. LAZY POSTER (CLICK TO PLAY) ==============
    Seccion({
      titulo: '2 · Lazy load con poster (click to play)',
      descripcion: 'Modo `lazy: true` + `poster` muestra una imagen estática + botón play. Solo carga el iframe cuando el usuario hace click → ahorra **~500KB** de JS por video y mejora CLS y LCP. Patrón usado en Vercel, Stripe, Linear y casi todos los SaaS modernos.',
      hijos: [VistaCodigo({
        vista: EmbedVideo({
          src: VIDEO.ytBunny,
          poster: POSTER.hero,
          titulo: 'Cómo construir tu primera app en 90 segundos',
          lazy: true,
        }),
        codigo: `EmbedVideo({
  src: 'https://www.youtube.com/watch?v=...',
  poster: '/img/poster.jpg',                    // ← imagen previa
  titulo: 'Cómo construir tu primera app',
  lazy: true,                                   // click-to-play
})`,
      })],
    }),

    // ============== 3. VARIOS PROVEEDORES ==============
    Seccion({
      titulo: '3 · Multi-proveedor (mismo componente)',
      descripcion: 'YouTube, Vimeo y Loom — todos con el mismo componente. Cada uno se autodetecta y se embebe usando su URL canónica. El badge en la esquina indica el proveedor; el botón de play hereda el color de marca de cada plataforma.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' } }, [
          EmbedVideo({ src: VIDEO.ytSintel, poster: POSTER.tutorial, titulo: 'YouTube · Sintel', lazy: true }),
          EmbedVideo({ src: VIDEO.vimeoBunny, poster: POSTER.curso, titulo: 'Vimeo · Big Buck Bunny', lazy: true }),
          EmbedVideo({ src: VIDEO.loomDemo, poster: POSTER.demo, titulo: 'Loom · grabación de pantalla', lazy: true }),
        ]),
        codigo: `// Mismo componente — el proveedor se detecta por URL
EmbedVideo({ src: 'https://www.youtube.com/watch?v=...' })
EmbedVideo({ src: 'https://vimeo.com/76979871' })
EmbedVideo({ src: 'https://www.loom.com/share/abc123' })
EmbedVideo({ src: 'https://www.wistia.com/medias/xyz' })
EmbedVideo({ src: 'https://streamable.com/abc' })`,
      })],
    }),

    // ============== 4. ASPECT RATIOS ==============
    Seccion({
      titulo: '4 · Aspect ratios (16/9 · 4/3 · 1/1 · 9/16)',
      descripcion: 'El parámetro `ratio` controla la proporción del wrapper. Útil para Reels (9/16), formato cuadrado de Instagram (1/1) o videos clásicos (4/3). El iframe se ajusta automáticamente sin scrollbars.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)', alignItems: 'start' } }, [
          crearEl('div', null, [
            crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontWeight: 700, marginBlockEnd: '8px' } }, ['16/9 · estándar']),
            EmbedVideo({ src: VIDEO.ytCostaRica, poster: POSTER.webinar, titulo: 'Widescreen', lazy: true, ratio: '16/9' }),
          ]),
          crearEl('div', null, [
            crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontWeight: 700, marginBlockEnd: '8px' } }, ['4/3 · clásico']),
            EmbedVideo({ src: VIDEO.ytBunny, poster: POSTER.evento, titulo: 'Tradicional', lazy: true, ratio: '4/3' }),
          ]),
          crearEl('div', null, [
            crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontWeight: 700, marginBlockEnd: '8px' } }, ['1/1 · cuadrado']),
            EmbedVideo({ src: VIDEO.ytSintel, poster: POSTER.podcast, titulo: 'Square IG', lazy: true, ratio: '1/1' }),
          ]),
          crearEl('div', null, [
            crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontWeight: 700, marginBlockEnd: '8px' } }, ['9/16 · Reels / Shorts']),
            EmbedVideo({ src: VIDEO.ytNature, poster: POSTER.demo, titulo: 'Vertical', lazy: true, ratio: '9/16' }),
          ]),
        ]),
        codigo: `EmbedVideo({ src, ratio: '16/9' })  // estándar
EmbedVideo({ src, ratio: '4/3' })   // clásico
EmbedVideo({ src, ratio: '1/1' })   // cuadrado / Instagram
EmbedVideo({ src, ratio: '9/16' })  // Reels / Shorts`,
      })],
    }),

    // ============== 5. HERO LANDING ==============
    Seccion({
      titulo: '5 · Hero landing — video + CTA al lado',
      descripcion: 'Patrón clásico de landing pages SaaS. Texto persuasivo + video demo. Lazy poster reduce el peso inicial. Vercel, Linear y Stripe usan exactamente este layout.',
      hijos: [VistaCodigo({
        vista: crearEl('div', {
          style: {
            padding: 'var(--space-5) var(--space-4)',
            background: 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 8%, transparent), color-mix(in srgb, #8b5cf6 6%, transparent))',
            borderRadius: 'var(--radius-md)',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.4fr)',
            gap: 'var(--space-5)',
            alignItems: 'center',
          },
        }, [
          crearEl('div', null, [
            crearEl('span', { style: { fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em' } }, ['NUEVO · v2.4']),
            crearEl('h2', { style: { margin: '12px 0', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15 } },
              ['Tu equipo, ', crearEl('span', { style: { background: 'linear-gradient(90deg, #06b6d4, #8b5cf6)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' } }, ['más rápido.'])]),
            crearEl('p', { style: { color: 'var(--muted-foreground)', fontSize: 'var(--text-base)', lineHeight: 1.55, marginBlockEnd: 'var(--space-4)' } },
              ['Mira en 90 segundos cómo Launchpad reemplaza 4 herramientas. Sin instalar nada.']),
            crearEl('div', { style: { display: 'flex', gap: 'var(--space-2)' } }, [
              Boton({ texto: 'Empezar gratis →', variante: 'primary' }),
              Boton({ texto: 'Hablar con ventas', variante: 'ghost' }),
            ]),
          ]),
          EmbedVideo({
            src: VIDEO.ytCostaRica,
            poster: POSTER.hero,
            titulo: 'Demo en 90 segundos',
            lazy: true,
          }),
        ]),
        codigo: `// Hero con video demo a la derecha
crearEl('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1.4fr' } }, [
  crearEl('div', null, [ /* CTA + texto */ ]),
  EmbedVideo({ src, poster, lazy: true }),
])`,
      })],
    }),

    // ============== 6. GALERÍA YOUTUBE-STYLE ==============
    Seccion({
      titulo: '6 · Galería estilo YouTube (TarjetaVideo + GaleriaVideos)',
      descripcion: 'Para canales corporativos, listas de cursos, biblioteca de webinars. Cards con hover, badges (DIRECTO · NUEVO · PREMIUM), duración overlay y meta-data.',
      hijos: [VistaCodigo({
        vista: GaleriaVideos({
          columnas: 3,
          items: [
            { poster: POSTER.webinar,  titulo: 'Webinar: Reactividad en Vanilla JS sin frameworks', autor: 'Launchpad', vistas: '12K vistas · hace 2 días', duracion: '54:12', badge: { tipo: 'directo', texto: '● DIRECTO' } },
            { poster: POSTER.curso,    titulo: 'Curso completo: Componentes UI desde cero',         autor: 'María García', vistas: '8.4K vistas · hace 1 semana', duracion: '2:14:30', badge: { tipo: 'premium', texto: 'PREMIUM' } },
            { poster: POSTER.tutorial, titulo: 'Tutorial: Patrón Portal con vanilla JS',            autor: 'Carlos Méndez', vistas: '4.1K vistas · hace 3 días', duracion: '12:48', badge: { tipo: 'nuevo', texto: 'NUEVO' } },
            { poster: POSTER.demo,     titulo: 'Demo en vivo: De Figma a producción en 30min',       autor: 'Launchpad', vistas: '2.8K vistas · hoy', duracion: '32:15' },
            { poster: POSTER.evento,   titulo: 'Conferencia LA Tech 2026 — keynote completo',       autor: 'LA Tech', vistas: '24K vistas · hace 1 mes', duracion: '1:08:42' },
            { poster: POSTER.podcast,  titulo: 'Podcast #14: El futuro del desarrollo web',          autor: 'Tech Pals', vistas: '6.2K vistas · hace 5 días', duracion: '48:20' },
          ],
        }),
        codigo: `GaleriaVideos({
  columnas: 3,
  items: [
    { poster, titulo, autor, vistas, duracion: '54:12', badge: { tipo: 'directo', texto: '● DIRECTO' } },
    { poster, titulo, autor, vistas, duracion: '2:14:30', badge: { tipo: 'premium', texto: 'PREMIUM' } },
    { poster, titulo, autor, vistas, duracion: '12:48', badge: { tipo: 'nuevo', texto: 'NUEVO' } },
  ],
})`,
      })],
    }),

    // ============== 7. CURSO ONLINE ==============
    Seccion({
      titulo: '7 · Plataforma de cursos — video + capítulos',
      descripcion: 'Layout típico de Udemy, Coursera o Skillshare. Video grande + lista de lecciones a la derecha con duración, completado y la lección activa resaltada.',
      hijos: [VistaCodigo({
        vista: crearEl('div', {
          style: {
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
            gap: 'var(--space-4)',
            alignItems: 'start',
          },
        }, [
          crearEl('div', null, [
            EmbedVideo({
              src: VIDEO.ytSintel,
              poster: POSTER.curso,
              titulo: '03 · Reactividad con señales',
              lazy: true,
            }),
            crearEl('h3', { style: { margin: '12px 0 4px', fontSize: 'var(--text-lg)', fontWeight: 700 } }, ['03 · Reactividad con señales']),
            crearEl('p', { style: { margin: 0, color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' } }, ['Lección 3 de 24 · 12 minutos · María García']),
          ]),
          crearEl('div', {
            style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', maxHeight: '460px', display: 'flex', flexDirection: 'column' },
          }, [
            crearEl('div', { style: { padding: 'var(--space-3)', borderBottom: '1px solid var(--border)' } }, [
              crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' } }, ['MÓDULO 2 · 8 lecciones']),
              crearEl('div', { style: { fontSize: 'var(--text-sm)', fontWeight: 700, marginBlockStart: '4px' } }, ['Fundamentos de Launchpad']),
            ]),
            crearEl('div', { style: { overflow: 'auto', flex: 1 } },
              [
                { n: 1, t: 'Setup del proyecto', d: '8:24', estado: 'ok' },
                { n: 2, t: 'crearEl y composición', d: '15:10', estado: 'ok' },
                { n: 3, t: 'Reactividad con señales', d: '12:00', estado: 'activo' },
                { n: 4, t: 'Efectos y subscripciones', d: '9:45', estado: '' },
                { n: 5, t: 'Computed values', d: '7:32', estado: '' },
                { n: 6, t: 'Patrón store global', d: '14:18', estado: '' },
                { n: 7, t: 'Lifecycle de componentes', d: '11:50', estado: '' },
                { n: 8, t: 'Quiz: 10 preguntas', d: '5:00', estado: '', tipo: 'quiz' },
              ].map((l) => crearEl('div', {
                style: {
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: 'var(--space-3)',
                  borderBottom: '1px solid var(--border)',
                  background: l.estado === 'activo' ? 'color-mix(in srgb, var(--primary) 8%, transparent)' : 'transparent',
                  cursor: 'pointer',
                },
              }, [
                crearEl('span', {
                  style: {
                    width: '22px', height: '22px', borderRadius: '50%',
                    background: l.estado === 'ok' ? 'var(--color-success)'
                              : l.estado === 'activo' ? 'var(--primary)'
                              : 'color-mix(in srgb, var(--muted-foreground) 18%, transparent)',
                    color: '#fff',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '11px', fontWeight: 700,
                  },
                }, [l.estado === 'ok' ? Icono('check', { tamano: 12 }) : String(l.n)]),
                crearEl('div', { style: { flex: 1, minWidth: 0 } }, [
                  crearEl('div', {
                    style: { fontSize: 'var(--text-sm)', fontWeight: l.estado === 'activo' ? 700 : 500, color: l.estado === 'activo' ? 'var(--primary)' : 'var(--foreground)' },
                  }, [l.t]),
                  crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: '6px', marginBlockStart: '2px' } }, [
                    l.tipo === 'quiz' ? '📝 Quiz' : Icono('reproducir', { tamano: 10 }),
                    l.d,
                  ]),
                ]),
              ])),
            ),
          ]),
        ]),
        codigo: `// Layout: video principal + sidebar de capítulos
<div style="display: grid; grid-template-columns: 2fr 1fr">
  <EmbedVideo poster={...} lazy />
  <aside>{lecciones.map(l => <Leccion ... />)}</aside>
</div>`,
      })],
    }),

    // ============== 8. WEBINAR / LIVE ==============
    Seccion({
      titulo: '8 · Webinar / Live — video + chat lateral',
      descripcion: 'Layout típico de transmisiones en vivo (Twitch, YouTube Live, Zoom Webinar). Video amplio + chat scrolleable + indicador de viewers + badge "● EN VIVO" con pulse.',
      hijos: [VistaCodigo({
        vista: crearEl('div', {
          style: {
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 2.4fr) minmax(0, 1fr)',
            gap: 'var(--space-4)',
            background: '#0a0a0a',
            padding: 'var(--space-3)',
            borderRadius: 'var(--radius-md)',
          },
        }, [
          crearEl('div', null, [
            EmbedVideo({
              src: VIDEO.ytTearsSteel,
              poster: POSTER.webinar,
              titulo: 'Webinar: Q&A con el equipo de Launchpad',
              lazy: true,
            }),
            crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', marginBlockStart: '12px', color: '#fff', flexWrap: 'wrap' } }, [
              crearEl('span', {
                style: {
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '4px 10px',
                  background: '#ef4444',
                  borderRadius: '4px',
                  fontSize: '11px', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase',
                  animation: 'video-pulse 2s ease infinite',
                },
              }, ['● EN VIVO']),
              crearEl('span', { style: { fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)' } }, ['1,247 espectadores']),
              crearEl('span', { style: { fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)' } }, ['comenzó hace 14 min']),
            ]),
            crearEl('h3', { style: { margin: '12px 0 4px', color: '#fff', fontSize: 'var(--text-xl)', fontWeight: 700 } }, ['Q&A con el equipo de Launchpad']),
            crearEl('div', { style: { color: 'rgba(255,255,255,0.6)', fontSize: 'var(--text-sm)' } }, ['Maria García · Carlos Méndez · 32 likes']),
          ]),
          crearEl('div', {
            style: {
              background: 'rgb(20 20 23 / 0.8)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgb(255 255 255 / 0.08)',
              display: 'flex', flexDirection: 'column',
            },
          }, [
            crearEl('div', { style: { padding: '10px 14px', borderBottom: '1px solid rgb(255 255 255 / 0.08)', color: '#fff', fontSize: 'var(--text-sm)', fontWeight: 700 } }, ['💬 Chat en vivo']),
            crearEl('div', { style: { flex: 1, padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: 'var(--text-sm)', overflow: 'auto', minHeight: '180px' } },
              [
                ['#06b6d4', 'maria_dev', '¡Hola! 👋'],
                ['#f59e0b', 'mod', '¿La grabación quedará disponible?'],
                ['#10b981', 'launchpad_team', 'Sí, todos los registrados la reciben mañana 📩'],
                ['#8b5cf6', 'carlos_g', '¿Soporte para SSR cuando?'],
                ['#ec4899', 'pixelpat', 'Esto se ve genial 🔥'],
                ['#06b6d4', 'newbie_99', '¿Qué editor usan?'],
                ['#10b981', 'launchpad_team', '@newbie_99 VS Code + extensión propia'],
              ].map(([color, user, msg]) => crearEl('div', { style: { lineHeight: 1.45, color: 'rgba(255,255,255,0.92)' } }, [
                crearEl('strong', { style: { color, marginInlineEnd: '6px', fontWeight: 700 } }, [user, ':']),
                msg,
              ])),
            ),
            crearEl('div', { style: { padding: '8px 10px', borderTop: '1px solid rgb(255 255 255 / 0.08)', display: 'flex', gap: '6px' } }, [
              crearEl('input', {
                placeholder: 'Escribe un mensaje…',
                style: {
                  flex: 1, padding: '8px 12px',
                  background: 'rgb(255 255 255 / 0.06)',
                  border: '1px solid rgb(255 255 255 / 0.12)',
                  borderRadius: '6px', color: '#fff', fontSize: 'var(--text-sm)',
                },
              }),
              crearEl('button', { style: { padding: '8px 14px', background: 'var(--primary)', color: '#fff', border: 0, borderRadius: '6px', fontSize: 'var(--text-sm)', fontWeight: 600, cursor: 'pointer' } }, ['Enviar']),
            ]),
          ]),
        ]),
        codigo: `// Webinar / live — video + chat
<div style="display: grid; grid-template-columns: 2.4fr 1fr">
  <EmbedVideo poster lazy />
  <aside class="chat">{mensajes}</aside>
</div>`,
      })],
    }),

    // ============== 9. TESTIMONIO / CASO DE ÉXITO ==============
    Seccion({
      titulo: '9 · Testimonio en video — caso de éxito B2B',
      descripcion: 'Patrón B2B clásico. Foto + comilla + nombre/cargo + métricas + video. Usado por Stripe, Figma y casi todos los SaaS para landing de "Customers".',
      hijos: [VistaCodigo({
        vista: crearEl('div', {
          style: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--space-5)',
            alignItems: 'center',
            padding: 'var(--space-5)',
            background: 'var(--surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
          },
        }, [
          crearEl('div', null, [
            crearEl('div', { style: { fontSize: '48px', lineHeight: 1, color: 'var(--primary)', marginBlockEnd: '8px', fontFamily: 'serif' } }, ['"']),
            crearEl('p', { style: { fontSize: 'var(--text-lg)', lineHeight: 1.5, fontWeight: 500, marginBlockEnd: 'var(--space-4)' } },
              ['Pasamos de tardar 3 semanas a tardar 3 días en lanzar features. Launchpad es ahora parte central de cómo trabajamos.']),
            crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } }, [
              crearEl('img', {
                src: 'https://i.pravatar.cc/64?img=47',
                style: { width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' },
              }),
              crearEl('div', null, [
                crearEl('div', { style: { fontWeight: 700 } }, ['Ana Torres']),
                crearEl('div', { style: { fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' } }, ['Head of Engineering · Acme Corp']),
              ]),
            ]),
            crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: '14px', marginBlockStart: 'var(--space-4)', paddingBlockStart: 'var(--space-3)', borderTop: '1px solid var(--border)' } }, [
              crearEl('div', null, [
                crearEl('div', { style: { fontWeight: 800, fontSize: 'var(--text-xl)' } }, ['7×']),
                crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, ['más rápido']),
              ]),
              crearEl('div', null, [
                crearEl('div', { style: { fontWeight: 800, fontSize: 'var(--text-xl)' } }, ['$200K']),
                crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, ['ahorrados/año']),
              ]),
              crearEl('div', null, [
                crearEl('div', { style: { fontWeight: 800, fontSize: 'var(--text-xl)' } }, ['98%']),
                crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, ['satisfacción']),
              ]),
            ]),
          ]),
          EmbedVideo({
            src: VIDEO.ytNature,
            poster: POSTER.evento,
            titulo: 'Ana Torres — caso de éxito',
            lazy: true,
          }),
        ]),
        codigo: `// Testimonio: comilla + foto + cargo + métricas + video
<div style="display: grid; grid-template-columns: 1fr 1fr">
  <div>{quote + autor + métricas}</div>
  <EmbedVideo poster lazy />
</div>`,
      })],
    }),

    // ============== 10. DOCS / TUTORIAL CON TIMESTAMPS ==============
    Seccion({
      titulo: '10 · Documentación con timestamps clickeables',
      descripcion: 'Patrón de docs.stripe.com / docs.shopify.com / Linear changelog. Video arriba + lista de timestamps abajo. Cada timestamp es un link clickable que en producción haría seek al segundo.',
      hijos: [VistaCodigo({
        vista: card(
          crearEl('div', { style: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-3)', marginBlockEnd: 'var(--space-3)', flexWrap: 'wrap' } }, [
            crearEl('div', null, [
              crearEl('div', { style: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 10px', background: 'color-mix(in srgb, var(--primary) 12%, transparent)', borderRadius: '999px', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--primary)', marginBlockEnd: '8px' } }, [Icono('pagina', { tamano: 12 }), 'GUÍA DE INICIO']),
              crearEl('h3', { style: { margin: '0 0 4px', fontSize: 'var(--text-xl)', fontWeight: 800 } }, ['Configura autenticación en 5 pasos']),
              crearEl('div', { style: { fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' } }, ['Walkthrough completo · 8 minutos · Actualizado hace 3 días']),
            ]),
            crearEl('div', { style: { display: 'inline-flex', gap: '6px' } }, [
              crearEl('button', { style: { padding: '6px 10px', background: 'var(--surface-muted)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: 'var(--text-xs)', cursor: 'pointer', display: 'inline-flex', gap: '4px', alignItems: 'center' } },
                [Icono('marcador', { tamano: 12 }), 'Guardar']),
              crearEl('button', { style: { padding: '6px 10px', background: 'var(--surface-muted)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: 'var(--text-xs)', cursor: 'pointer', display: 'inline-flex', gap: '4px', alignItems: 'center' } },
                [Icono('compartir', { tamano: 12 }), 'Compartir']),
            ]),
          ]),
          EmbedVideo({
            src: VIDEO.ytBunny,
            poster: POSTER.docs,
            titulo: 'Configura autenticación',
            lazy: true,
          }),
          crearEl('div', { style: { marginBlockStart: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' } }, [
            crearEl('div', { style: { fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBlockEnd: '10px' } }, ['📌 EN ESTE VIDEO']),
            crearEl('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '6px', fontSize: 'var(--text-sm)' } },
              [
                ['00:00', 'Introducción', 'info'],
                ['01:24', 'Crear app en el dashboard', ''],
                ['02:48', 'Configurar callbacks', ''],
                ['04:15', 'Manejo de tokens JWT', ''],
                ['05:42', 'Refresh tokens automáticos', ''],
                ['07:10', 'Listo · próximos pasos', 'check'],
              ].map(([t, txt, ic]) => crearEl('button', {
                style: {
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '8px 10px', borderRadius: '6px',
                  background: 'transparent', border: 0,
                  color: 'var(--foreground)', fontSize: 'var(--text-sm)',
                  cursor: 'pointer', textAlign: 'start',
                  transition: 'background 120ms ease',
                },
                onMouseEnter: (e) => { e.currentTarget.style.background = 'var(--muted)'; },
                onMouseLeave: (e) => { e.currentTarget.style.background = 'transparent'; },
              }, [
                crearEl('span', { style: { fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--primary)', fontWeight: 700, minWidth: '46px' } }, [t]),
                ic && Icono(ic === 'check' ? 'check' : 'info', { tamano: 14 }),
                crearEl('span', null, [txt]),
              ])),
            ),
          ]),
        ),
        codigo: `// Docs / tutorial con timestamps clickeables
EmbedVideo({ src, poster, lazy: true })

const timestamps = [
  { t: '00:00', label: 'Introducción' },
  { t: '01:24', label: 'Crear app' },
  { t: '02:48', label: 'Configurar callbacks' },
  // ...
];
{timestamps.map(({t, label}) =>
  <button onClick={() => seek(t)}>{t} · {label}</button>)}`,
      })],
    }),

    // ============== 11. SOCIAL MEDIA EMBED CARD ==============
    Seccion({
      titulo: '11 · Tarjeta tipo red social (Twitter / Instagram)',
      descripcion: 'Video embebido dentro de una tarjeta de post estilo Twitter/X o Instagram. Avatar + handle + acciones (like/retweet/share) + reproducir cuadrado.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { maxWidth: '520px', margin: '0 auto' } }, [
          crearEl('article', {
            style: {
              border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
              background: 'var(--surface)', overflow: 'hidden',
            },
          }, [
            // Cabecera
            crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', padding: 'var(--space-3)' } }, [
              crearEl('img', { src: 'https://i.pravatar.cc/40?img=12', style: { width: '40px', height: '40px', borderRadius: '50%' } }),
              crearEl('div', { style: { flex: 1 } }, [
                crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: '4px' } }, [
                  crearEl('strong', { style: { fontSize: 'var(--text-sm)' } }, ['Launchpad']),
                  crearEl('span', { style: { color: 'var(--primary)', display: 'inline-flex' } }, [Icono('check', { tamano: 14 })]),
                  crearEl('span', { style: { fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' } }, ['@launchpad_dev · 2h']),
                ]),
              ]),
              crearEl('button', { style: { background: 'transparent', border: 0, color: 'var(--muted-foreground)', cursor: 'pointer', padding: '4px' } }, ['•••']),
            ]),
            // Texto del post
            crearEl('div', { style: { padding: '0 var(--space-3) var(--space-3)', fontSize: 'var(--text-sm)', lineHeight: 1.55 } },
              ['🎬 Demo del nuevo motor de transiciones — 60fps en cualquier device.', crearEl('br'), crearEl('span', { style: { color: 'var(--primary)' } }, ['#launchpad #vanillaJS #webdev'])]),
            // Video cuadrado
            EmbedVideo({
              src: VIDEO.ytBunny,
              poster: POSTER.social,
              titulo: 'Demo motor de transiciones',
              lazy: true,
              ratio: '1/1',
            }),
            // Acciones
            crearEl('div', { style: { display: 'flex', justifyContent: 'space-around', padding: '8px 12px', borderTop: '1px solid var(--border)', color: 'var(--muted-foreground)' } },
              [
                ['chat', '142'],
                ['compartir', '38'],
                ['corazon', '1.2K'],
                ['marcador', ''],
              ].map(([ic, n]) => crearEl('button', {
                style: {
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  background: 'transparent', border: 0, color: 'inherit',
                  fontSize: 'var(--text-sm)', cursor: 'pointer', padding: '4px 8px', borderRadius: '6px',
                },
              }, [Icono(ic, { tamano: 16 }), n])),
            ),
          ]),
        ]),
        codigo: `// Card social con video cuadrado
<article class="post-card">
  <header>{avatar + handle + tiempo}</header>
  <p>{texto del post}</p>
  <EmbedVideo src={...} ratio="1/1" lazy />
  <footer>{acciones}</footer>
</article>`,
      })],
    }),

    // ============== 12. ANUNCIO / RELEASE NOTES ==============
    Seccion({
      titulo: '12 · Banner de release / anuncio importante',
      descripcion: 'Pattern para changelogs, release notes o anuncios destacados (estilo Linear changelog, Vercel ship). Video grande con highlight de versión + CTA debajo.',
      hijos: [VistaCodigo({
        vista: crearEl('div', {
          style: {
            position: 'relative',
            border: '1px solid color-mix(in srgb, var(--primary) 25%, var(--border))',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            background: 'linear-gradient(180deg, color-mix(in srgb, var(--primary) 6%, transparent), transparent 30%)',
          },
        }, [
          crearEl('div', {
            style: {
              padding: 'var(--space-4)',
              display: 'flex', flexWrap: 'wrap',
              alignItems: 'center', justifyContent: 'space-between',
              gap: 'var(--space-3)',
              borderBlockEnd: '1px solid var(--border)',
            },
          }, [
            crearEl('div', null, [
              crearEl('span', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 10px', background: 'var(--primary)', color: '#fff', borderRadius: '999px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase' } }, ['● RELEASE 2.4']),
              crearEl('h3', { style: { margin: '8px 0 2px', fontSize: 'var(--text-xl)', fontWeight: 800 } }, ['Modo Concurrent + 38 mejoras']),
              crearEl('div', { style: { fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' } }, ['Lanzado el 7 de mayo · 4 minutos · @maria_garcia']),
            ]),
            crearEl('div', { style: { display: 'flex', gap: '8px' } }, [
              Boton({ texto: 'Notas completas →', variante: 'primary' }),
              Boton({ texto: 'Discutir en GitHub', variante: 'ghost' }),
            ]),
          ]),
          EmbedVideo({
            src: VIDEO.ytSintel,
            poster: POSTER.marketing,
            titulo: 'Release 2.4 — todo lo nuevo',
            lazy: true,
          }),
          crearEl('div', { style: { padding: 'var(--space-3) var(--space-4)', borderBlockStart: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)', fontSize: 'var(--text-sm)' } }, [
            crearEl('div', { style: { display: 'flex', gap: '14px', color: 'var(--muted-foreground)' } }, [
              crearEl('span', { style: { display: 'inline-flex', gap: '4px', alignItems: 'center' } }, [Icono('pulgar_arriba', { tamano: 14 }), '423']),
              crearEl('span', { style: { display: 'inline-flex', gap: '4px', alignItems: 'center' } }, [Icono('chat', { tamano: 14 }), '47 comentarios']),
              crearEl('span', { style: { display: 'inline-flex', gap: '4px', alignItems: 'center' } }, [Icono('compartir', { tamano: 14 }), 'Compartir']),
            ]),
            crearEl('div', { style: { color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' } }, ['💎 Highlights: View Transitions · Custom Elements · Bundle 18% más liviano']),
          ]),
        ]),
        codigo: `// Release banner — anuncio destacado
<div class="release-banner">
  <header>
    <Badge>v2.4</Badge>
    <h3>Modo Concurrent + 38 mejoras</h3>
    <Boton>Notas completas</Boton>
  </header>
  <EmbedVideo src={...} poster={...} lazy />
  <footer>{likes + comentarios + highlights}</footer>
</div>`,
      })],
    }),

    // ============== 13. PARÁMETROS DE EMBED ==============
    Seccion({
      titulo: '13 · Parámetros del embed (autoplay · mute · ratio)',
      descripcion: 'Para hero videos auto-play silenciosos (típico landing) usa `autoplay: true` + `mute: true` (los navegadores requieren mute para autoplay). Sin lazy ya que el video debe arrancar inmediatamente.',
      hijos: [VistaCodigo({
        vista: card(
          crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontWeight: 700, marginBlockEnd: '12px' } }, ['HERO LANDING — AUTO-PLAY MUTED']),
          EmbedVideo({
            src: VIDEO.ytCostaRica,
            ratio: '16/9',
            poster: POSTER.hero,
            lazy: true,
            titulo: 'Demo continuo',
          }),
          crearEl('div', { style: { marginBlockStart: '12px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' } },
            ['Para un hero de fondo: ', crearEl('code', { style: { background: 'var(--muted)', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' } }, ['{ autoplay: true, mute: true, lazy: false }'])]),
        ),
        codigo: `EmbedVideo({
  src: 'https://www.youtube.com/watch?v=...',
  autoplay: true,                    // arranca solo
  mute: true,                        // requerido por navegadores
  ratio: '16/9',
})

// Proveedores autodetectados:
// youtube · vimeo · loom · wistia · streamable
// dailymotion · twitch · tiktok`,
      })],
    }),

  ],
});
