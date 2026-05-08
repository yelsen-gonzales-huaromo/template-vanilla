import { crearEl } from '../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { corner6 } from '../../../components/ui/card/card-decoraciones.js';

const FOTO = (n) => `./public/img/gallery/${n}.jpg`;

const grid = (cols, ...n) => crearEl('div', {
  style: { display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(${cols}, 1fr))`, gap: 'var(--space-4)' },
}, n);

// Helper base — figura con imagen + caption
const figura = ({ src, caption, fig, atribucion, icono }) => crearEl('figure', {
  style: { margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' },
}, [
  crearEl('img', {
    src, alt: caption,
    style: { width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 'var(--radius-md)' },
  }),
  crearEl('figcaption', {
    style: {
      display: 'flex', alignItems: 'flex-start', gap: '6px',
      fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)',
      lineHeight: 1.5,
    },
  }, [
    icono && crearEl('span', { style: { color: 'var(--muted-foreground)', flexShrink: 0, marginBlockStart: '2px' } },
      [Icono(icono, { tamano: 14 })]),
    crearEl('div', { style: { flex: 1 } }, [
      fig && crearEl('strong', { style: { color: 'var(--foreground)', marginInlineEnd: '6px' } }, [`${fig}.`]),
      caption,
      atribucion && crearEl('span', { style: {
        display: 'block', marginBlockStart: '4px', fontStyle: 'italic',
        fontSize: 'var(--text-xs)', opacity: 0.85,
      } }, [`— ${atribucion}`]),
    ]),
  ]),
]);

// Figura con zoom on hover
const figuraZoom = ({ src, caption }) => {
  const imagen = crearEl('img', {
    src, alt: caption, loading: 'lazy',
    style: {
      width: '100%', aspectRatio: '4/3', objectFit: 'cover',
      transition: 'transform 480ms cubic-bezier(0.16, 1, 0.3, 1)',
      display: 'block',
    },
  });
  const wrap = crearEl('div', {
    style: {
      borderRadius: 'var(--radius-md)', overflow: 'hidden',
      border: '1px solid var(--border)',
    },
    onMouseenter: () => { imagen.style.transform = 'scale(1.06)'; },
    onMouseleave: () => { imagen.style.transform = ''; },
  }, [imagen]);
  return crearEl('figure', { style: { margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' } }, [
    wrap,
    crearEl('figcaption', {
      style: { fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', textAlign: 'center' },
    }, [caption]),
  ]);
};

export default async () => PaginaShowcase({
  titulo: 'Figuras',
  descripcion: 'Imagen + caption asociado semánticamente con `<figure>` + `<figcaption>`. Útil para galerías ilustradas, documentación, casos de estudio, comparativas. 6 patrones: básica, numerada, con icono, con atribución, comparación lado a lado y con zoom on hover.',
  decoracion: corner6(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    // ============== BÁSICA ==============
    Seccion({
      titulo: '1 · Galería simple',
      descripcion: 'Imagen + caption centrado debajo. La estructura semántica `<figure>/<figcaption>` ayuda a screen readers y SEO a entender la relación.',
      hijos: [VistaCodigo({
        vista: grid('220px',
          figura({ src: FOTO(2),    caption: 'Construye más rápido sin frameworks' }),
          figura({ src: FOTO(3),    caption: 'Reactividad nativa con señales y efectos' }),
          figura({ src: FOTO(2006), caption: 'Tema dual claro / oscuro coordinados' }),
        ),
        codigo: `crearEl('figure', null, [
  crearEl('img', { src, alt: caption }),
  crearEl('figcaption', null, [caption]),
])`,
      })],
    }),

    // ============== NUMERADAS ==============
    Seccion({
      titulo: '2 · Numeradas (Fig. 1, Fig. 2…)',
      descripcion: 'Para documentación técnica, papers, manuales — el lector puede referenciar "ver Fig. 3" desde el cuerpo del texto.',
      hijos: [VistaCodigo({
        vista: grid('240px',
          figura({ src: FOTO(2007), fig: 'Fig. 1', caption: 'Arquitectura del sistema reactivo — `senal` ↔ `efecto`.' }),
          figura({ src: FOTO(2008), fig: 'Fig. 2', caption: 'Flujo de datos entre componentes y stores.' }),
          figura({ src: FOTO(2010), fig: 'Fig. 3', caption: 'Render pipeline con View Transitions API.' }),
        ),
        codigo: `figura({
  src,
  fig: 'Fig. 1',                              // <- número de figura
  caption: 'Arquitectura del sistema…',
})`,
      })],
    }),

    // ============== CON ICONO ==============
    Seccion({
      titulo: '3 · Con icono contextual',
      descripcion: 'Un icono al inicio del caption refuerza el tipo de figura — `info`, `alerta`, `check`, `estrella`. Útil para diferenciar visualmente capturas de UI vs ejemplos vs warnings.',
      hijos: [VistaCodigo({
        vista: grid('240px',
          figura({ src: FOTO(2),    icono: 'info',     caption: 'Vista del dashboard principal con widgets configurables.' }),
          figura({ src: FOTO(2007), icono: 'alerta',   caption: 'Estado de error cuando la API no responde — fallback gracioso.' }),
          figura({ src: FOTO(3),    icono: 'check',    caption: 'Confirmación visual cuando el form se valida correctamente.' }),
        ),
        codigo: `figura({ src, icono: 'info',  caption: '...' })  // azul
figura({ src, icono: 'alerta', caption: '...' })  // warning
figura({ src, icono: 'check',  caption: '...' })  // success`,
      })],
    }),

    // ============== CON ATRIBUCIÓN ==============
    Seccion({
      titulo: '4 · Con atribución / fuente',
      descripcion: 'Cuando uses fotos de stock, capturas de otras apps o gráficos de un paper. El crédito va en cursiva debajo del caption — formato editorial.',
      hijos: [VistaCodigo({
        vista: grid('240px',
          figura({
            src: FOTO(2010), fig: 'Fig. 1',
            caption: 'Vista panorámica de Vestrahorn, Islandia.',
            atribucion: 'Foto de Lukasz Szmigiel · Unsplash',
          }),
          figura({
            src: FOTO(2006),
            caption: 'Atardecer de invierno desde la cabaña.',
            atribucion: 'Cortesía del archivo nacional · Dominio público',
          }),
          figura({
            src: FOTO(2008),
            caption: 'Equipo fotográfico vintage de los 80s.',
            atribucion: 'Colección personal · 2024',
          }),
        ),
        codigo: `figura({
  src, caption: '...',
  atribucion: 'Foto de Lukasz Szmigiel · Unsplash',
})`,
      })],
    }),

    // ============== COMPARACIÓN LADO A LADO ==============
    Seccion({
      titulo: '5 · Comparación side-by-side',
      descripcion: 'Para "antes / después", "modo claro / oscuro", "v1 / v2". Dos figuras en grid 1:1 con captions que indican qué es cada uno.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: {
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)',
          padding: 'var(--space-3)', background: 'var(--surface)',
          border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
        } }, [
          figura({
            src: FOTO(2007), fig: 'Antes',
            caption: 'Dashboard v1 — layout vertical denso, sin filtros.',
          }),
          figura({
            src: FOTO(2008), fig: 'Después',
            caption: 'Dashboard v2 — sidebar con secciones, filtros laterales.',
          }),
        ]),
        codigo: `crearEl('div', { style: {
  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)',
} }, [
  figura({ src: antes,  fig: 'Antes',   caption: '...' }),
  figura({ src: despues, fig: 'Después', caption: '...' }),
])`,
      })],
    }),

    // ============== CON ZOOM ON HOVER ==============
    Seccion({
      titulo: '6 · Con zoom on hover',
      descripcion: 'Al pasar el cursor, la imagen escala 1.06× con transición suave. Patrón típico de portfolios y galerías editoriales — invita a explorar sin abrir nada.',
      hijos: [VistaCodigo({
        vista: grid('220px',
          figuraZoom({ src: FOTO(2),    caption: 'Café nocturno con neón urbano' }),
          figuraZoom({ src: FOTO(3),    caption: 'Reflejos en gafas de sol' }),
          figuraZoom({ src: FOTO(2007), caption: 'Cámara analógica vintage' }),
          figuraZoom({ src: FOTO(2010), caption: 'Skyline al anochecer' }),
        ),
        codigo: `// Wrapper con overflow:hidden + img con transition transform
crearEl('div', {
  style: { borderRadius: 'var(--radius-md)', overflow: 'hidden' },
  onMouseenter: () => { img.style.transform = 'scale(1.06)'; },
  onMouseleave: () => { img.style.transform = ''; },
}, [crearEl('img', { src, style: { transition: 'transform 480ms ...' } })])`,
      })],
    }),

  ],
});
