import { crearEl } from '../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { TextoTipeado } from '../../../components/ui/typed-text/typed-text.js';
import { Boton } from '../../../components/ui/button/button.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { corner5 } from '../../../components/ui/card/card-decoraciones.js';

// ============================================================================
//  Helpers de presentación
// ============================================================================

// Hero centrado con gradient
const hero = (...nodos) => crearEl('div', {
  style: {
    padding: 'var(--space-5) var(--space-4)',
    background: 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 8%, transparent), color-mix(in srgb, #8b5cf6 8%, transparent))',
    borderRadius: 'var(--radius-md)',
    border: '1px solid color-mix(in srgb, var(--primary) 18%, var(--border))',
    textAlign: 'center',
    overflow: 'hidden',
  },
}, nodos);

// Container terminal-like
const terminal = (...nodos) => crearEl('div', {
  style: {
    padding: 'var(--space-3) var(--space-4)',
    background: '#0a0a0a',
    borderRadius: 'var(--radius-md)',
    border: '1px solid #27272a',
    fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)',
    fontSize: 'var(--text-sm)',
    color: '#10b981',
    lineHeight: 1.7,
  },
}, nodos);

// Container para chat AI
const chatAI = (...nodos) => crearEl('div', {
  style: {
    padding: 'var(--space-4)',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    gap: 'var(--space-3)',
    alignItems: 'flex-start',
  },
}, nodos);

// ============================================================================
//  Página
// ============================================================================
export default async () => PaginaShowcase({
  titulo: 'Texto tipeado',
  descripcion: 'Efecto máquina de escribir con cursor parpadeante. Ideal para hero sections, value propositions, loading states, prompts de terminal y simulación de chat AI. 4 cursores (line · block · underscore · none), 6 colores incluyendo gradient animado, control de loop, modo streaming sin borrado, y delay de inicio.',
  decoracion: corner5(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    // ============== 1. HERO LANDING (gradient) ==============
    Seccion({
      titulo: '1 · Hero landing — gradient sweep',
      descripcion: 'El texto tipeado lleva `color: gradient` que recorre cyan → azul → violeta → rosa en loop. Combinado con tipografía grande sobre un fondo gradient sutil = hero pattern de SaaS modernos.',
      hijos: [VistaCodigo({
        vista: hero(
          crearEl('p', { style: {
            margin: '0 0 var(--space-3)',
            fontSize: 'var(--text-xs)', fontWeight: 700,
            color: 'var(--muted-foreground)',
            textTransform: 'uppercase', letterSpacing: '0.1em',
          } }, ['TEMPLATE_VANILLA · Vanilla JS toolkit']),
          crearEl('h1', { style: {
            margin: '0 0 var(--space-3)',
            fontSize: 'clamp(1.75rem, 4vw, 3rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          } }, [
            'Construye apps ',
            TextoTipeado({
              frases: ['rápidas.', 'limpias.', 'reactivas.', 'sin frameworks.'],
              color: 'gradient',
              cursor: 'line',
              velocidadTipeo: 80,
              pausa: 1600,
            }),
          ]),
          crearEl('p', { style: {
            margin: '0 auto var(--space-4)',
            fontSize: 'var(--text-base)',
            color: 'var(--muted-foreground)',
            maxWidth: '560px',
            lineHeight: 1.55,
          } }, ['JavaScript moderno con primitivas reactivas nativas. Sin webpack, sin npm install, sin npm install otra vez.']),
          crearEl('div', { style: { display: 'inline-flex', gap: 'var(--space-2)' } }, [
            Boton({ texto: 'Empezar gratis →', variante: 'primary' }),
            Boton({ texto: 'Ver demo', variante: 'ghost' }),
          ]),
        ),
        codigo: `crearEl('h1', null, [
  'Construye apps ',
  TextoTipeado({
    frases: ['rápidas.', 'limpias.', 'reactivas.', 'sin frameworks.'],
    color: 'gradient',                          // ← cyan → azul → violeta → rosa
    velocidadTipeo: 80,
    pausa: 1600,
  }),
])`,
      })],
    }),

    // ============== 2. ROLES / PROFESIONES ==============
    Seccion({
      titulo: '2 · Multi-rol (developer portfolio)',
      descripcion: 'El clásico "Soy {Designer | Developer | Founder}" para portfolios y pages personales. Cursor block estilo terminal sobre el rol que rota.',
      hijos: [VistaCodigo({
        vista: crearEl('div', {
          style: {
            padding: 'var(--space-5) var(--space-4)',
            textAlign: 'center',
            background: 'radial-gradient(circle at 30% 20%, #1a1a1f 0%, #0a0a0a 60%)',
            borderRadius: 'var(--radius-md)',
            color: '#fff',
            border: '1px solid #1f1f23',
          },
        }, [
          crearEl('h2', { style: { margin: 0, fontSize: 'clamp(1.5rem, 3.2vw, 2.25rem)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 } }, [
            'Soy María García, ',
            TextoTipeado({
              frases: ['Diseñadora UX.', 'Frontend Engineer.', 'Founder de template-vanilla.', 'Ciclista de fin de semana.'],
              color: 'gradient',
              cursor: 'block',
              velocidadTipeo: 70,
              pausa: 1200,
            }),
          ]),
          crearEl('p', { style: { margin: 'var(--space-3) 0 0', color: 'rgba(255,255,255,0.6)', fontSize: 'var(--text-sm)' } },
            ['Lima → San Francisco · He fundado 2 productos · Y Combinator W22']),
        ]),
        codigo: `TextoTipeado({
  frases: ['Diseñadora UX.', 'Frontend Engineer.', 'Founder.', 'Y ciclista.'],
  color: 'gradient',
  cursor: 'block',                            // ← cuadrado tipo terminal
  velocidadTipeo: 70,
})`,
      })],
    }),

    // ============== 3. TERMINAL / CLI (block cursor) ==============
    Seccion({
      titulo: '3 · Terminal / CLI prompt (cursor block verde)',
      descripcion: 'Look terminal con monospace font + fondo negro + texto verde + cursor block. Para landings de devtools (Vercel, Railway, Fly.io) o demos de comandos.',
      hijos: [VistaCodigo({
        vista: terminal(
          crearEl('div', { style: { color: '#a3a3a3', marginBlockEnd: '6px' } }, ['~/proyectos/template-vanilla']),
          crearEl('div', null, [
            crearEl('span', { style: { color: '#10b981', marginInlineEnd: '8px' } }, ['$']),
            TextoTipeado({
              frases: [
                'npm install — instalando dependencias…',
                'npm run dev — servidor en :5173',
                'npm run build — bundle 32kb gzipped',
                'npm run deploy — deployed to template-vanilla.dev',
              ],
              cursor: 'block', color: 'foreground',
              velocidadTipeo: 50,
              pausa: 1800,
            }),
          ]),
        ),
        codigo: `// Terminal estética con monospace + texto verde + cursor block
crearEl('div', { style: { background: '#0a0a0a', fontFamily: 'monospace' } }, [
  '$ ',
  TextoTipeado({
    frases: ['npm install', 'npm run dev', 'npm run build'],
    cursor: 'block',
    color: 'foreground',
  }),
])`,
      })],
    }),

    // ============== 4. CHAT AI (sin borrar — streaming) ==============
    Seccion({
      titulo: '4 · Chat AI streaming (sin borrar)',
      descripcion: '`borrar: false` hace que cada frase se complete y la siguiente comience desde cero — simula la respuesta en streaming de un LLM. `loop: false` para que se detenga al final.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' } }, [
          // User message
          crearEl('div', { style: {
            alignSelf: 'flex-end',
            maxWidth: '80%',
            padding: '10px 14px',
            background: 'var(--primary)',
            color: '#fff',
            borderRadius: 'var(--radius-md) var(--radius-md) 4px var(--radius-md)',
            fontSize: 'var(--text-sm)',
          } }, ['¿Qué hace especial a template-vanilla?']),
          // AI response
          chatAI(
            crearEl('span', { style: {
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
              color: '#fff',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 'var(--text-sm)', fontWeight: 700, flexShrink: 0,
            } }, ['AI']),
            crearEl('div', { style: { flex: 1, fontSize: 'var(--text-sm)', lineHeight: 1.55 } }, [
              TextoTipeado({
                frases: [
                  'template-vanilla es un toolkit de JS vanilla con primitivas reactivas nativas.',
                  'No requiere build step ni npm install — funciona abriendo index.html.',
                  'Usa señales y efectos para reactividad sin overhead de virtual DOM.',
                  'Despliegas a cualquier host estático en segundos.',
                ],
                cursor: 'line', color: 'foreground',
                velocidadTipeo: 35,
                pausa: 1200,
                borrar: false,                // streaming
                loop: false,                  // se detiene al terminar
              }),
            ]),
          ),
        ]),
        codigo: `TextoTipeado({
  frases: ['Primera frase…', 'Segunda frase completa.', 'Última.'],
  borrar: false,                            // ← no borra, salta a la siguiente
  loop: false,                              // ← se detiene al terminar
  velocidadTipeo: 35,                       // velocidad realista de LLM
})`,
      })],
    }),

    // ============== 5. CURSOR VARIANTS ==============
    Seccion({
      titulo: '5 · Variantes de cursor',
      descripcion: 'Line (default — barra fina vertical), block (cuadrado terminal), underscore (línea inferior), none (sin cursor). Cada uno con animación de parpadeo independiente.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontSize: 'var(--text-lg)' } }, [
          crearEl('div', { style: { display: 'flex', alignItems: 'baseline', gap: 'var(--space-3)' } }, [
            crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', minWidth: '90px', fontWeight: 600 } }, ['LINE']),
            TextoTipeado({ frases: ['Cursor barra fina vertical'], cursor: 'line', loop: false }),
          ]),
          crearEl('div', { style: { display: 'flex', alignItems: 'baseline', gap: 'var(--space-3)' } }, [
            crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', minWidth: '90px', fontWeight: 600 } }, ['BLOCK']),
            TextoTipeado({ frases: ['Cursor cuadrado tipo terminal'], cursor: 'block', loop: false }),
          ]),
          crearEl('div', { style: { display: 'flex', alignItems: 'baseline', gap: 'var(--space-3)' } }, [
            crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', minWidth: '90px', fontWeight: 600 } }, ['UNDERSCORE']),
            TextoTipeado({ frases: ['Cursor línea inferior'], cursor: 'underscore', loop: false }),
          ]),
          crearEl('div', { style: { display: 'flex', alignItems: 'baseline', gap: 'var(--space-3)' } }, [
            crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', minWidth: '90px', fontWeight: 600 } }, ['NONE']),
            TextoTipeado({ frases: ['Sin cursor visible'], cursor: 'none', loop: false }),
          ]),
        ]),
        codigo: `TextoTipeado({ cursor: 'line' })          // | barra (default)
TextoTipeado({ cursor: 'block' })         // ▮ cuadrado terminal
TextoTipeado({ cursor: 'underscore' })    // _ línea inferior
TextoTipeado({ cursor: 'none' })          //   sin cursor`,
      })],
    }),

    // ============== 6. COLORES ==============
    Seccion({
      titulo: '6 · Colores del texto y cursor',
      descripcion: 'El texto puede ser `gradient` animado, `success`, `warning`, `danger` o `foreground`. El cursor hereda automáticamente.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontSize: 'var(--text-xl)', fontWeight: 700 } }, [
          TextoTipeado({ frases: ['Color primary (default)'],   color: 'primary',    loop: false }),
          TextoTipeado({ frases: ['Gradient animado neón'],     color: 'gradient',   loop: false }),
          TextoTipeado({ frases: ['Success — completado ✓'],    color: 'success',    loop: false }),
          TextoTipeado({ frases: ['Warning — atención requerida'], color: 'warning', loop: false }),
          TextoTipeado({ frases: ['Danger — error crítico'],    color: 'danger',     loop: false }),
          TextoTipeado({ frases: ['Foreground — texto base'],    color: 'foreground', loop: false }),
        ]),
        codigo: `TextoTipeado({ color: 'primary' })     // azul (default)
TextoTipeado({ color: 'gradient' })    // cyan → azul → violeta → rosa (animado)
TextoTipeado({ color: 'success' })     // verde
TextoTipeado({ color: 'warning' })     // naranja
TextoTipeado({ color: 'danger' })      // rojo
TextoTipeado({ color: 'foreground' })  // texto base`,
      })],
    }),

    // ============== 7. LOADING STATES ==============
    Seccion({
      titulo: '7 · Loading states con dots',
      descripcion: 'Para indicar progreso variable durante operaciones. Las "…" en cada frase + cursor parpadeante refuerzan la sensación de "trabajando".',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: {
          padding: 'var(--space-5)',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
        } }, [
          crearEl('span', { style: {
            width: '32px', height: '32px',
            border: '2px solid color-mix(in srgb, var(--primary) 20%, transparent)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            flexShrink: 0,
          } }),
          crearEl('div', { style: { fontSize: 'var(--text-base)', fontWeight: 500 } }, [
            TextoTipeado({
              frases: [
                'Conectando con el servidor…',
                'Descargando 142 archivos…',
                'Procesando datos…',
                'Optimizando imágenes…',
                'Casi listo, espera un momento…',
              ],
              velocidadTipeo: 50,
              pausa: 1500,
            }),
          ]),
        ]),
        codigo: `// Loading con secuencia de estados que rotan
TextoTipeado({
  frases: [
    'Conectando con el servidor…',
    'Descargando 142 archivos…',
    'Procesando datos…',
    'Casi listo…',
  ],
  velocidadTipeo: 50,
  pausa: 1500,
})`,
      })],
    }),

    // ============== 8. IDIOMAS / GLOBAL ==============
    Seccion({
      titulo: '8 · Multi-idioma (welcome)',
      descripcion: 'Saludos en distintos idiomas que rotan. Para landings con audiencia global. Cursor underscore (estilo retro) en color foreground.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: {
          padding: 'var(--space-5) var(--space-4)',
          background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-warning) 8%, transparent), color-mix(in srgb, var(--color-danger) 8%, transparent))',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center',
        } }, [
          crearEl('h2', { style: { margin: 0, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.02em' } }, [
            TextoTipeado({
              frases: ['¡Hola, mundo!', 'Hello, world!', 'Bonjour le monde!', 'こんにちは世界!', '안녕하세요!', 'Olá, mundo!', '你好，世界!'],
              cursor: 'underscore',
              color: 'foreground',
              velocidadTipeo: 80,
              pausa: 1400,
            }),
          ]),
          crearEl('p', { style: { margin: 'var(--space-3) 0 0', color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' } },
            ['Disponible en 7 idiomas · 38 países · 24/7']),
        ]),
        codigo: `TextoTipeado({
  frases: [
    '¡Hola, mundo!',
    'Hello, world!',
    'Bonjour le monde!',
    'こんにちは世界!',
    '안녕하세요!',
    'Olá, mundo!',
    '你好，世界!',
  ],
  cursor: 'underscore',
  color: 'foreground',
  velocidadTipeo: 80,
})`,
      })],
    }),

    // ============== 9. EMAIL SUBJECTS ==============
    Seccion({
      titulo: '9 · Email subjects rotando (inbox preview)',
      descripcion: 'Patrón empty state — "Tu inbox podría tener…" con asuntos rotando. Útil para onboarding de productos o explicar lo que va a llegar.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: {
          padding: 'var(--space-5)',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
        } }, [
          crearEl('span', { style: {
            width: '40px', height: '40px',
            background: 'color-mix(in srgb, var(--primary) 14%, transparent)',
            color: 'var(--primary)',
            borderRadius: 'var(--radius)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          } }, [Icono('correo', { tamano: 18 })]),
          crearEl('div', { style: { flex: 1, minWidth: 0 } }, [
            crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontWeight: 600, marginBlockEnd: 2 } }, ['DE: notificaciones@template-vanilla.dev']),
            crearEl('div', { style: { fontSize: 'var(--text-sm)', fontWeight: 600 } }, [
              TextoTipeado({
                frases: [
                  'Re: Propuesta de diseño Q3',
                  'María te asignó 3 tareas nuevas',
                  '[GitHub] Pull request #142 listo para revisar',
                  'Backup semanal completado · 14 GB',
                  'Reunión semanal mañana 10:00',
                ],
                velocidadTipeo: 40,
                pausa: 1800,
                color: 'foreground',
              }),
            ]),
          ]),
        ]),
        codigo: `TextoTipeado({
  frases: [
    'Re: Propuesta de diseño Q3',
    'María te asignó 3 tareas nuevas',
    '[GitHub] PR #142 listo para revisar',
    'Backup completado · 14 GB',
  ],
  velocidadTipeo: 40,
  pausa: 1800,
})`,
      })],
    }),

    // ============== 10. VELOCIDADES ==============
    Seccion({
      titulo: '10 · Comparativa de velocidades',
      descripcion: 'Misma frase con 3 velocidades distintas. Lento (120ms/char) genera tensión, rápido (25ms/char) se siente urgente, default (60ms) es lo natural.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontSize: 'var(--text-base)' } }, [
          crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)' } }, [
            crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', minWidth: '110px', fontWeight: 600 } }, ['LENTO · 120ms']),
            TextoTipeado({ frases: ['Cuento dramático y pausado'], velocidadTipeo: 120, pausa: 2000 }),
          ]),
          crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)' } }, [
            crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', minWidth: '110px', fontWeight: 600 } }, ['NORMAL · 60ms']),
            TextoTipeado({ frases: ['Velocidad cómoda de lectura'], velocidadTipeo: 60, pausa: 1400 }),
          ]),
          crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)' } }, [
            crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', minWidth: '110px', fontWeight: 600 } }, ['RÁPIDO · 25ms']),
            TextoTipeado({ frases: ['Sensación de urgencia y acción'], velocidadTipeo: 25, pausa: 1000 }),
          ]),
        ]),
        codigo: `TextoTipeado({
  frases: [...],
  velocidadTipeo: 120,                       // ms por carácter al tipear
  velocidadBorrado: 30,                      // ms por carácter al borrar
  pausa: 1400,                               // ms al final de cada frase
  delay: 200,                                // ms antes de empezar
})`,
      })],
    }),

  ],
});
