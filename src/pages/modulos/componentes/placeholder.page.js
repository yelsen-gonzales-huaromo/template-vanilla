import { crearEl } from '../../../utils/helpers/dom.js';
import { senal } from '../../../utils/helpers/reactive.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { Esqueleto } from '../../../components/ui/skeleton/skeleton.js';
import { Tarjeta } from '../../../components/ui/card/card.js';
import { Boton } from '../../../components/ui/button/button.js';
import { corner4 } from '../../../components/ui/card/card-decoraciones.js';

const grid = (cols, ...n) => crearEl('div', {
  style: { display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(${cols}, 1fr))`, gap: 'var(--space-4)' },
}, n);

const stack = (...n) => crearEl('div', {
  style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' },
}, n);

const card = (hijos) => crearEl('div', {
  style: {
    padding: 'var(--space-4)',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
  },
}, [hijos]);

// ============================================================================
//  Patrones reusables
// ============================================================================

// Comentario / actividad (avatar + nombre + texto)
const skeletonComentario = (anim = 'shimmer') => crearEl('div', {
  style: { display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' },
}, [
  Esqueleto({ variante: 'circle', ancho: '40px', alto: '40px', animacion: anim }),
  crearEl('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' } }, [
    Esqueleto({ variante: 'subtitle', ancho: '35%', animacion: anim }),
    Esqueleto({ variante: 'text', animacion: anim }),
    Esqueleto({ variante: 'text', ancho: '85%', animacion: anim }),
  ]),
]);

// Post / artículo (image + title + excerpt)
const skeletonPost = (anim = 'shimmer') => stack(
  Esqueleto({ variante: 'thumbnail', animacion: anim }),
  Esqueleto({ variante: 'title', ancho: '80%', animacion: anim }),
  Esqueleto({ lineas: 3, animacion: anim }),
);

// Producto e-commerce (imagen cuadrada + nombre + precio)
const skeletonProducto = (anim = 'shimmer') => stack(
  Esqueleto({ variante: 'square', animacion: anim }),
  Esqueleto({ variante: 'subtitle', ancho: '70%', animacion: anim }),
  crearEl('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, [
    Esqueleto({ variante: 'text', ancho: '40%', animacion: anim }),
    Esqueleto({ variante: 'chip', animacion: anim }),
  ]),
);

// Fila de tabla / inbox (icono + texto + meta)
const skeletonFila = (anim = 'shimmer') => crearEl('div', {
  style: {
    display: 'flex', gap: 'var(--space-3)', alignItems: 'center',
    padding: 'var(--space-3) 0',
    borderBlockEnd: '1px solid var(--border)',
  },
}, [
  Esqueleto({ variante: 'circle', ancho: '32px', alto: '32px', animacion: anim }),
  crearEl('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' } }, [
    Esqueleto({ variante: 'subtitle', ancho: '30%', animacion: anim }),
    Esqueleto({ variante: 'text', ancho: '60%', animacion: anim }),
  ]),
  Esqueleto({ variante: 'text', ancho: '60px', animacion: anim }),
]);

// KPI card (label + número grande)
const skeletonKpi = (anim = 'shimmer') => card(stack(
  crearEl('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, [
    Esqueleto({ variante: 'text', ancho: '50%', animacion: anim }),
    Esqueleto({ variante: 'circle', ancho: '24px', alto: '24px', animacion: anim }),
  ]),
  Esqueleto({ variante: 'title', ancho: '60%', alto: '32px', animacion: anim }),
  Esqueleto({ variante: 'chip', animacion: anim }),
));

// Form (label + input)
const skeletonCampoForm = (anim = 'shimmer') => crearEl('div', {
  style: { display: 'flex', flexDirection: 'column', gap: '6px' },
}, [
  Esqueleto({ variante: 'text', ancho: '20%', animacion: anim }),
  Esqueleto({ alto: '38px', ancho: '100%', animacion: anim }),
]);

// ============================================================================
//  Demo: skeleton → contenido real (toggle)
// ============================================================================
const demoCargando = () => {
  const cargando = senal(true);
  const contenedor = crearEl('div', { style: { width: '100%' } });

  const renderEsqueleto = () => card(crearEl('div', { style: { display: 'flex', gap: 'var(--space-3)' } }, [
    Esqueleto({ variante: 'circle', ancho: '48px', alto: '48px' }),
    crearEl('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' } }, [
      Esqueleto({ variante: 'subtitle', ancho: '40%' }),
      Esqueleto({ variante: 'text' }),
      Esqueleto({ variante: 'text', ancho: '75%' }),
    ]),
  ]));

  const renderReal = () => card(crearEl('div', { style: { display: 'flex', gap: 'var(--space-3)' } }, [
    crearEl('div', {
      style: {
        width: '48px', height: '48px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
        color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700,
      },
    }, ['MG']),
    crearEl('div', { style: { flex: 1 } }, [
      crearEl('strong', { style: { display: 'block', marginBlockEnd: 4 } }, ['María García']),
      crearEl('p', { style: { margin: 0, color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', lineHeight: 1.55 } },
        ['Acabo de subir el mockup final del dashboard. Le agregué los KPIs que pediste y el filtro lateral. Mira si te encaja.']),
    ]),
  ]));

  const refrescar = () => contenedor.replaceChildren(cargando.value ? renderEsqueleto() : renderReal());
  refrescar();

  return stack(
    crearEl('div', { style: { display: 'flex', gap: 'var(--space-2)' } }, [
      Boton({ texto: 'Mostrar skeleton', variante: 'secondary', tamano: 'sm',
        onClick: () => { cargando.value = true; refrescar(); } }),
      Boton({ texto: 'Mostrar contenido', variante: 'primary', tamano: 'sm',
        onClick: () => { cargando.value = false; refrescar(); } }),
    ]),
    contenedor,
  );
};

export default async () => PaginaShowcase({
  titulo: 'Placeholders / Esqueletos',
  descripcion: 'Marcadores con shimmer animation que ocupan el espacio del contenido real mientras carga. Mucho mejor que un spinner suelto — comunican la estructura que viene, reducen percepción de espera y evitan layout shift al cargar.',
  decoracion: corner4(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    // ============== 1. VARIANTES ==============
    Seccion({
      titulo: '1 · Variantes (formas básicas)',
      descripcion: '9 formas predefinidas que cubren los bloques más comunes — texto, títulos, círculos (avatares), cuadrados, cards, botones, thumbnails, chips.',
      hijos: [VistaCodigo({
        vista: stack(
          crearEl('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' } }, [
            // Textos
            stack(
              crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontWeight: 600 } }, ['Texto']),
              Esqueleto({ variante: 'title', ancho: '70%' }),
              Esqueleto({ variante: 'subtitle' }),
              Esqueleto({ variante: 'text' }),
              Esqueleto({ variante: 'text', ancho: '85%' }),
            ),
            // Avatares + medios
            stack(
              crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontWeight: 600 } }, ['Medios']),
              crearEl('div', { style: { display: 'flex', gap: 'var(--space-2)', alignItems: 'center' } }, [
                Esqueleto({ variante: 'circle', ancho: '32px', alto: '32px' }),
                Esqueleto({ variante: 'circle', ancho: '48px', alto: '48px' }),
                Esqueleto({ variante: 'circle', ancho: '64px', alto: '64px' }),
              ]),
              crearEl('div', { style: { display: 'flex', gap: 'var(--space-2)' } }, [
                Esqueleto({ variante: 'square', ancho: '60px' }),
                Esqueleto({ variante: 'thumbnail', ancho: '120px' }),
              ]),
            ),
            // Cards / botones
            stack(
              crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontWeight: 600 } }, ['Cards / botones / chips']),
              Esqueleto({ variante: 'card', alto: '80px' }),
              crearEl('div', { style: { display: 'flex', gap: 'var(--space-2)' } }, [
                Esqueleto({ variante: 'button' }),
                Esqueleto({ variante: 'button', ancho: '4rem' }),
              ]),
              crearEl('div', { style: { display: 'flex', gap: 'var(--space-2)' } }, [
                Esqueleto({ variante: 'chip' }),
                Esqueleto({ variante: 'chip', ancho: '5rem' }),
                Esqueleto({ variante: 'chip', ancho: '3rem' }),
              ]),
            ),
          ]),
        ),
        codigo: `Esqueleto({ variante: 'title' })       // 24px alto
Esqueleto({ variante: 'subtitle' })    // 16px alto
Esqueleto({ variante: 'text' })        // 12px alto
Esqueleto({ variante: 'circle', ancho: '48px', alto: '48px' })
Esqueleto({ variante: 'square', ancho: '60px' })
Esqueleto({ variante: 'thumbnail' })   // aspect-ratio 4/3
Esqueleto({ variante: 'card', alto: '80px' })
Esqueleto({ variante: 'button' })      // pill 36px
Esqueleto({ variante: 'chip' })        // pill 20px`,
      })],
    }),

    // ============== 2. SHORTCUT LINEAS ==============
    Seccion({
      titulo: '2 · Shortcut: múltiples líneas',
      descripcion: '`lineas: N` genera N líneas de texto — la última sale más corta (60%) para look natural. Mucho más limpio que escribir 3-4 esqueletos manualmente.',
      hijos: [VistaCodigo({
        vista: grid('200px',
          card(stack(Esqueleto({ variante: 'title', ancho: '70%' }), Esqueleto({ lineas: 2 }))),
          card(stack(Esqueleto({ variante: 'title', ancho: '70%' }), Esqueleto({ lineas: 3 }))),
          card(stack(Esqueleto({ variante: 'title', ancho: '70%' }), Esqueleto({ lineas: 5 }))),
        ),
        codigo: `Esqueleto({ lineas: 3 })
// Genera 3 líneas — la última al 60% para que parezca natural

// Equivalente a:
[1, 2, 3].map((i) => Esqueleto({
  variante: 'text',
  ancho: i === 3 ? '60%' : null,
}))`,
      })],
    }),

    // ============== 3. AVATAR + TEXTO ==============
    Seccion({
      titulo: '3 · Comentario / actividad (avatar + texto)',
      descripcion: 'Patrón canónico para feeds, comentarios, actividad reciente. Avatar circular a la izquierda, nombre + texto a la derecha.',
      hijos: [VistaCodigo({
        vista: card(stack(
          skeletonComentario(),
          crearEl('div', { style: { borderBlockStart: '1px solid var(--border)', paddingBlockStart: 'var(--space-3)' } },
            [skeletonComentario()]),
          crearEl('div', { style: { borderBlockStart: '1px solid var(--border)', paddingBlockStart: 'var(--space-3)' } },
            [skeletonComentario()]),
        )),
        codigo: `crearEl('div', { style: { display: 'flex', gap: 'var(--space-3)' } }, [
  Esqueleto({ variante: 'circle', ancho: '40px', alto: '40px' }),
  crearEl('div', { style: { flex: 1 } }, [
    Esqueleto({ variante: 'subtitle', ancho: '35%' }),
    Esqueleto({ lineas: 2 }),
  ]),
])`,
      })],
    }),

    // ============== 4. POSTS / ARTÍCULOS ==============
    Seccion({
      titulo: '4 · Posts / artículos (blog grid)',
      descripcion: 'Imagen hero + título + excerpt — feed de blog, marketplace de cursos, lista de artículos. La proporción 4:3 del thumbnail evita layout shift cuando carga la imagen real.',
      hijos: [VistaCodigo({
        vista: grid('220px',
          card(skeletonPost()),
          card(skeletonPost()),
          card(skeletonPost()),
        ),
        codigo: `// Helper reusable
const skeletonPost = () => stack(
  Esqueleto({ variante: 'thumbnail' }),     // imagen 4:3
  Esqueleto({ variante: 'title', ancho: '80%' }),
  Esqueleto({ lineas: 3 }),
);`,
      })],
    }),

    // ============== 5. PRODUCTO E-COMMERCE ==============
    Seccion({
      titulo: '5 · Productos e-commerce',
      descripcion: 'Imagen cuadrada + nombre + precio + chip de descuento. Para catálogos, marketplace, listas de productos. Proporción 1:1 standard de e-commerce.',
      hijos: [VistaCodigo({
        vista: grid('180px',
          card(skeletonProducto()),
          card(skeletonProducto()),
          card(skeletonProducto()),
          card(skeletonProducto()),
        ),
        codigo: `const skeletonProducto = () => stack(
  Esqueleto({ variante: 'square' }),         // imagen 1:1
  Esqueleto({ variante: 'subtitle', ancho: '70%' }),
  crearEl('div', { style: { display: 'flex', justifyContent: 'space-between' } }, [
    Esqueleto({ variante: 'text', ancho: '40%' }),  // precio
    Esqueleto({ variante: 'chip' }),                // descuento
  ]),
);`,
      })],
    }),

    // ============== 6. LISTA / TABLA ==============
    Seccion({
      titulo: '6 · Lista / inbox / tabla',
      descripcion: 'Filas con icono + texto + meta a la derecha. Para inbox, listas de tareas, filas de tabla, miembros de equipo. Importante mostrar 5-10 filas para sentir "lleno".',
      hijos: [VistaCodigo({
        vista: card(crearEl('div', null, [
          ...Array.from({ length: 6 }, () => skeletonFila()),
        ])),
        codigo: `const skeletonFila = () => crearEl('div', {
  style: { display: 'flex', gap: 'var(--space-3)', alignItems: 'center',
    padding: 'var(--space-3) 0', borderBlockEnd: '1px solid var(--border)' },
}, [
  Esqueleto({ variante: 'circle', ancho: '32px', alto: '32px' }),
  crearEl('div', { style: { flex: 1 } }, [
    Esqueleto({ variante: 'subtitle', ancho: '30%' }),
    Esqueleto({ variante: 'text', ancho: '60%' }),
  ]),
  Esqueleto({ variante: 'text', ancho: '60px' }),  // meta (tiempo, badge)
])

// Render N filas:
Array.from({ length: 6 }, () => skeletonFila())`,
      })],
    }),

    // ============== 7. DASHBOARD ==============
    Seccion({
      titulo: '7 · Dashboard completo (KPIs + chart + lista)',
      descripcion: 'Cuando el dashboard entero está cargando, la estructura ya está visible. El usuario sabe qué viene — KPIs arriba, gráfico al medio, lista de actividad debajo.',
      hijos: [VistaCodigo({
        vista: stack(
          // Row de KPIs
          grid('200px',
            skeletonKpi(),
            skeletonKpi(),
            skeletonKpi(),
            skeletonKpi(),
          ),
          // Chart + actividad lateral
          crearEl('div', {
            style: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-4)' },
          }, [
            // Chart card
            card(stack(
              crearEl('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, [
                Esqueleto({ variante: 'subtitle', ancho: '30%' }),
                crearEl('div', { style: { display: 'flex', gap: 'var(--space-1)' } }, [
                  Esqueleto({ variante: 'chip', ancho: '3rem' }),
                  Esqueleto({ variante: 'chip', ancho: '3rem' }),
                  Esqueleto({ variante: 'chip', ancho: '3rem' }),
                ]),
              ]),
              Esqueleto({ alto: '180px', animacion: 'shimmer' }),
            )),
            // Lista actividad
            card(stack(
              Esqueleto({ variante: 'subtitle', ancho: '60%' }),
              ...Array.from({ length: 4 }, () => crearEl('div', {
                style: { display: 'flex', gap: 'var(--space-2)', alignItems: 'center' },
              }, [
                Esqueleto({ variante: 'circle', ancho: '24px', alto: '24px' }),
                crearEl('div', { style: { flex: 1 } }, [
                  Esqueleto({ variante: 'text', ancho: '70%' }),
                ]),
              ])),
            )),
          ]),
        ),
        codigo: `// Layout entero del dashboard como skeleton
stack(
  grid('200px',                                // 4 KPIs
    skeletonKpi(), skeletonKpi(), skeletonKpi(), skeletonKpi(),
  ),
  crearEl('div', { style: { display: 'grid', gridTemplateColumns: '2fr 1fr' } }, [
    chartCard,                                 // 2/3 del ancho
    activityList,                              // 1/3 del ancho
  ]),
)`,
      })],
    }),

    // ============== 8. FORMULARIO ==============
    Seccion({
      titulo: '8 · Formulario',
      descripcion: 'Cuando un form se carga con datos del backend (editar perfil, configuración prefilled). Cada campo: label + input.',
      hijos: [VistaCodigo({
        vista: card(stack(
          Esqueleto({ variante: 'title', ancho: '50%' }),
          crearEl('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' } }, [
            skeletonCampoForm(),
            skeletonCampoForm(),
          ]),
          skeletonCampoForm(),
          skeletonCampoForm(),
          crearEl('div', { style: { display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end', paddingBlockStart: 'var(--space-2)' } }, [
            Esqueleto({ variante: 'button' }),
            Esqueleto({ variante: 'button' }),
          ]),
        )),
        codigo: `const skeletonCampoForm = () => crearEl('div', null, [
  Esqueleto({ variante: 'text', ancho: '20%' }),     // label
  Esqueleto({ alto: '38px' }),                       // input
])`,
      })],
    }),

    // ============== 9. ANIMACIONES ==============
    Seccion({
      titulo: '9 · 3 animaciones — shimmer · pulse · wave',
      descripcion: '`shimmer` (default) — gradient horizontal en loop, el más usado. `pulse` — opacidad oscilante, más sutil. `wave` — onda travelling sobre fondo plano, estilo Material Design.',
      hijos: [VistaCodigo({
        vista: grid('220px',
          card(stack(
            crearEl('span', { style: { fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--muted-foreground)' } }, ['shimmer (default)']),
            skeletonComentario('shimmer'),
          )),
          card(stack(
            crearEl('span', { style: { fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--muted-foreground)' } }, ['pulse']),
            skeletonComentario('pulse'),
          )),
          card(stack(
            crearEl('span', { style: { fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--muted-foreground)' } }, ['wave']),
            skeletonComentario('wave'),
          )),
        ),
        codigo: `Esqueleto({ animacion: 'shimmer' })  // default · gradient horizontal
Esqueleto({ animacion: 'pulse' })    // sutil · opacity oscilante
Esqueleto({ animacion: 'wave' })     // explícito · onda travelling
Esqueleto({ animacion: 'none' })     // sin animación (estados estáticos)

// Respeta prefers-reduced-motion automáticamente:
// los usuarios con esa preferencia ven los skeletons sin animación.`,
      })],
    }),

    // ============== 10. TOGGLE INTERACTIVO ==============
    Seccion({
      titulo: '10 · Toggle: skeleton ↔ contenido real',
      descripcion: 'Comparativa lado-a-lado del antes/después. La estructura del skeleton replica exactamente la del contenido para que NO haya layout shift cuando llegue el real.',
      hijos: [VistaCodigo({
        vista: demoCargando(),
        codigo: `const cargando = senal(true);

// Mismo layout — sólo cambia el contenido interno
const render = () => cargando.value ? renderEsqueleto() : renderReal();

// Cuando los datos llegan:
fetch('/api/data').then(() => { cargando.value = false; });`,
      })],
    }),

  ],
});
