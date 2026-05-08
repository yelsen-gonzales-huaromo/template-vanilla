import { crearEl } from '../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { Insignia } from '../../../components/ui/badge/badge.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { corner5 } from '../../../components/ui/card/card-decoraciones.js';

const grid = (cols, ...n) => crearEl('div', {
  style: { display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(${cols}, 1fr))`, gap: 'var(--space-3)' },
}, n);

// Imágenes reales del catálogo
const FOTO  = (n) => `./public/img/gallery/${n}.jpg`;
const PROD  = (n) => `./public/img/products/${n}.jpg`;

const img = (src, estilo) => crearEl('img', {
  src, alt: '', loading: 'lazy',
  style: { width: '100%', display: 'block', ...estilo },
});

export default async () => PaginaShowcase({
  titulo: 'Imágenes',
  descripcion: 'Estilos comunes de presentación de imágenes — bordes redondeados, circular, con sombra, aspect ratios fijos, overlays con gradient, badges superpuestos, skeleton de carga y manejo de errores. Sin librerías externas.',
  decoracion: corner5(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    // ============== ESTILOS BÁSICOS ==============
    Seccion({
      titulo: '1 · Estilos básicos',
      descripcion: 'Bordes redondeados, círculo perfecto (con `aspect-ratio: 1/1` + `object-fit: cover`), sombra elevada, doble borde con outline.',
      hijos: [VistaCodigo({
        vista: grid('180px',
          img(FOTO(2), { borderRadius: 'var(--radius-md)', aspectRatio: '4/3', objectFit: 'cover' }),
          img(FOTO(3), { borderRadius: '50%', aspectRatio: '1/1', objectFit: 'cover' }),
          img(FOTO(2006), { borderRadius: 'var(--radius-md)', aspectRatio: '4/3', objectFit: 'cover',
            boxShadow: 'var(--shadow-lg)' }),
          img(FOTO(2007), { borderRadius: 'var(--radius-md)', aspectRatio: '4/3', objectFit: 'cover',
            border: '4px solid var(--surface)', outline: '1px solid var(--border)' }),
        ),
        codigo: `// Redondeada
crearEl('img', { src, style: { borderRadius: 'var(--radius-md)' } })

// Circular (cuadrada con border-radius 50%)
crearEl('img', { src, style: {
  borderRadius: '50%', aspectRatio: '1/1', objectFit: 'cover',
}})

// Con sombra
crearEl('img', { src, style: { boxShadow: 'var(--shadow-lg)' } })

// Doble borde (frame estilo Polaroid)
crearEl('img', { src, style: {
  border: '4px solid var(--surface)',
  outline: '1px solid var(--border)',
}})`,
      })],
    }),

    // ============== ASPECT RATIOS ==============
    Seccion({
      titulo: '2 · Aspect ratios fijos',
      descripcion: '`aspect-ratio` mantiene la proporción aunque el ancho del container cambie. Patrones comunes: `1/1` (cuadrado · Instagram), `4/3` (foto clásica), `16/9` (video), `21/9` (cinema), `3/4` (retrato).',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--space-2)' } }, [
          crearEl('div', null, [
            img(FOTO(2), { aspectRatio: '1/1', objectFit: 'cover', borderRadius: 'var(--radius)' }),
            crearEl('p', { style: { margin: '6px 0 0', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', textAlign: 'center' } }, ['1:1 · Square']),
          ]),
          crearEl('div', null, [
            img(FOTO(3), { aspectRatio: '4/3', objectFit: 'cover', borderRadius: 'var(--radius)' }),
            crearEl('p', { style: { margin: '6px 0 0', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', textAlign: 'center' } }, ['4:3']),
          ]),
          crearEl('div', null, [
            img(FOTO(2006), { aspectRatio: '16/9', objectFit: 'cover', borderRadius: 'var(--radius)' }),
            crearEl('p', { style: { margin: '6px 0 0', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', textAlign: 'center' } }, ['16:9 · Video']),
          ]),
          crearEl('div', null, [
            img(FOTO(2010), { aspectRatio: '21/9', objectFit: 'cover', borderRadius: 'var(--radius)' }),
            crearEl('p', { style: { margin: '6px 0 0', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', textAlign: 'center' } }, ['21:9 · Cinema']),
          ]),
          crearEl('div', null, [
            img(FOTO(2007), { aspectRatio: '3/4', objectFit: 'cover', borderRadius: 'var(--radius)' }),
            crearEl('p', { style: { margin: '6px 0 0', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', textAlign: 'center' } }, ['3:4 · Portrait']),
          ]),
        ]),
        codigo: `crearEl('img', { src, style: {
  aspectRatio: '16/9',          // o '1/1', '4/3', '21/9', '3/4'
  objectFit: 'cover',           // recorta para llenar
  borderRadius: 'var(--radius)',
}})`,
      })],
    }),

    // ============== OVERLAY CON GRADIENT ==============
    Seccion({
      titulo: '3 · Con overlay (gradient)',
      descripcion: 'Para texto encima de la imagen sin perder legibilidad. Gradient de transparente a oscuro desde un borde — abajo (caption), arriba (categoría), centro (CTA destacado).',
      hijos: [VistaCodigo({
        vista: grid('220px',
          // Overlay abajo (caption)
          crearEl('div', { style: { position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden' } }, [
            img(FOTO(2), { aspectRatio: '4/3', objectFit: 'cover' }),
            crearEl('div', { style: {
              position: 'absolute', insetBlockEnd: 0, insetInline: 0,
              padding: 'var(--space-4) var(--space-3) var(--space-3)',
              background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.85))',
              color: '#fff',
            } }, [
              crearEl('strong', { style: { fontSize: 'var(--text-base)', display: 'block' } }, ['Construye más rápido']),
              crearEl('span', { style: { fontSize: 'var(--text-xs)', opacity: 0.85 } }, ['Sin frameworks']),
            ]),
          ]),
          // Overlay arriba (categoría)
          crearEl('div', { style: { position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden' } }, [
            img(FOTO(2006), { aspectRatio: '4/3', objectFit: 'cover' }),
            crearEl('div', { style: {
              position: 'absolute', insetBlockStart: 0, insetInline: 0,
              padding: 'var(--space-3)',
              background: 'linear-gradient(180deg, rgba(0,0,0,0.7), transparent)',
              color: '#fff',
            } }, [
              crearEl('span', { style: { fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 } },
                ['Tutorial']),
            ]),
          ]),
          // Overlay centro (CTA)
          crearEl('div', { style: { position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden' } }, [
            img(FOTO(3), { aspectRatio: '4/3', objectFit: 'cover' }),
            crearEl('div', { style: {
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            } }, [
              crearEl('div', { style: {
                width: '60px', height: '60px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.95)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                color: '#000',
              } }, [Icono('flecha_r', { tamano: 24 })]),
            ]),
          ]),
        ),
        codigo: `// Overlay abajo (caption)
crearEl('div', { style: { position: 'relative', overflow: 'hidden' } }, [
  crearEl('img', { src, style: { ... } }),
  crearEl('div', { style: {
    position: 'absolute', insetBlockEnd: 0, insetInline: 0,
    padding: 'var(--space-4)',
    background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.85))',
    color: '#fff',
  } }, [titulo, sub]),
])`,
      })],
    }),

    // ============== BADGES SUPERPUESTOS ==============
    Seccion({
      titulo: '4 · Con badges superpuestos',
      descripcion: 'Para etiquetar productos — descuentos, "nuevo", "agotado", categoría, rating. Posicionado absoluto con z-index 1 sobre la imagen.',
      hijos: [VistaCodigo({
        vista: grid('200px',
          // Producto con descuento
          crearEl('div', { style: { position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--surface)' } }, [
            img(PROD(1), { aspectRatio: '1/1', objectFit: 'cover' }),
            crearEl('span', { style: {
              position: 'absolute', insetBlockStart: 'var(--space-2)', insetInlineStart: 'var(--space-2)',
            } }, [Insignia({ texto: '-30%', variante: 'danger' })]),
          ]),
          // Nuevo
          crearEl('div', { style: { position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--surface)' } }, [
            img(PROD(2), { aspectRatio: '1/1', objectFit: 'cover' }),
            crearEl('span', { style: {
              position: 'absolute', insetBlockStart: 'var(--space-2)', insetInlineStart: 'var(--space-2)',
            } }, [Insignia({ texto: 'Nuevo', variante: 'success' })]),
          ]),
          // Bestseller
          crearEl('div', { style: { position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--surface)' } }, [
            img(PROD(3), { aspectRatio: '1/1', objectFit: 'cover' }),
            crearEl('span', { style: {
              position: 'absolute', insetBlockStart: 'var(--space-2)', insetInlineEnd: 'var(--space-2)',
            } }, [Insignia({ texto: '★ Top', variante: 'warning' })]),
          ]),
          // Agotado (con overlay)
          crearEl('div', { style: { position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--surface)' } }, [
            img(PROD(4), { aspectRatio: '1/1', objectFit: 'cover', filter: 'grayscale(0.7)' }),
            crearEl('div', { style: {
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(0,0,0,0.45)', color: '#fff',
              fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
              fontSize: 'var(--text-sm)',
            } }, ['Agotado']),
          ]),
        ),
        codigo: `crearEl('div', { style: { position: 'relative' } }, [
  crearEl('img', { src }),
  crearEl('span', { style: {
    position: 'absolute',
    insetBlockStart: 'var(--space-2)',
    insetInlineStart: 'var(--space-2)',
  } }, [Insignia({ texto: '-30%', variante: 'danger' })]),
])`,
      })],
    }),

    // ============== LAZY LOAD CON PLACEHOLDER ==============
    Seccion({
      titulo: '5 · Lazy load con placeholder',
      descripcion: '`loading="lazy"` carga la imagen sólo cuando entra al viewport. Mientras tanto un fondo blur+gradient simula la carga sin "salto" de layout (gracias al aspect-ratio).',
      hijos: [VistaCodigo({
        vista: grid('220px',
          ...[2, 3, 2006, 2010].map((n) => crearEl('div', { style: {
            position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden',
            aspectRatio: '4/3',
            background: 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 14%, transparent), color-mix(in srgb, #8b5cf6 14%, transparent))',
          } }, [
            crearEl('img', {
              src: FOTO(n), alt: '', loading: 'lazy',
              style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
            }),
          ])),
        ),
        codigo: `crearEl('div', { style: {
  aspectRatio: '4/3',
  background: 'linear-gradient(135deg, ...)',  // placeholder visible
  overflow: 'hidden',
} }, [
  crearEl('img', {
    src, loading: 'lazy',                       // ← navegador difiere la carga
    style: { width: '100%', height: '100%', objectFit: 'cover' },
  }),
])`,
      })],
    }),

    // ============== ERROR FALLBACK ==============
    Seccion({
      titulo: '6 · Manejo de error (broken image)',
      descripcion: 'Cuando una imagen falla en cargar, evita el icono roto del browser. `onError` cambia el src a un placeholder o muestra un nodo alternativo.',
      hijos: [VistaCodigo({
        vista: grid('220px',
          // Imagen rota → placeholder con icono
          crearEl('div', { style: {
            aspectRatio: '4/3', borderRadius: 'var(--radius-md)',
            background: 'color-mix(in srgb, var(--foreground) 6%, transparent)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '8px', color: 'var(--muted-foreground)',
            border: '1px dashed var(--border)',
          } }, [
            Icono('iconos', { tamano: 32 }),
            crearEl('span', { style: { fontSize: 'var(--text-xs)' } }, ['Sin imagen']),
          ]),
          // Imagen rota con onError
          crearEl('img', {
            src: './public/img/no-existe.jpg', alt: 'Demo broken',
            style: { width: '100%', aspectRatio: '4/3', objectFit: 'cover',
              borderRadius: 'var(--radius-md)' },
            onError: (e) => {
              e.currentTarget.style.display = 'none';
              const fallback = crearEl('div', { style: {
                width: '100%', aspectRatio: '4/3', borderRadius: 'var(--radius-md)',
                background: 'color-mix(in srgb, var(--color-danger) 8%, transparent)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: '6px', color: 'var(--color-danger)',
                border: '1px dashed color-mix(in srgb, var(--color-danger) 35%, transparent)',
              } }, [
                Icono('alerta', { tamano: 24 }),
                crearEl('span', { style: { fontSize: 'var(--text-xs)', fontWeight: 600 } }, ['Error al cargar']),
              ]);
              e.currentTarget.parentNode.appendChild(fallback);
            },
          }),
          // Imagen OK (control)
          img(FOTO(2), { aspectRatio: '4/3', objectFit: 'cover', borderRadius: 'var(--radius-md)' }),
        ),
        codigo: `crearEl('img', {
  src,
  onError: (e) => {
    // Reemplaza el broken icon por un placeholder
    e.currentTarget.style.display = 'none';
    e.currentTarget.parentNode.appendChild(placeholderNode);
  },
})`,
      })],
    }),

    // ============== SKELETON LOADER ==============
    Seccion({
      titulo: '7 · Skeleton loader',
      descripcion: 'Mientras la imagen carga, un placeholder con shimmer animation indica al usuario que algo viene. Mejor que pantalla blanca o icono roto temporal.',
      hijos: [VistaCodigo({
        vista: grid('220px',
          crearEl('div', {
            style: {
              aspectRatio: '4/3', borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(90deg, color-mix(in srgb, var(--foreground) 8%, transparent), color-mix(in srgb, var(--foreground) 14%, transparent), color-mix(in srgb, var(--foreground) 8%, transparent))',
              backgroundSize: '200% 100%',
              animation: 'avatar-skeleton 1.4s ease-in-out infinite',
            },
          }),
          crearEl('div', {
            style: {
              aspectRatio: '4/3', borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(90deg, color-mix(in srgb, var(--foreground) 8%, transparent), color-mix(in srgb, var(--foreground) 14%, transparent), color-mix(in srgb, var(--foreground) 8%, transparent))',
              backgroundSize: '200% 100%',
              animation: 'avatar-skeleton 1.4s ease-in-out infinite',
            },
          }),
          crearEl('div', {
            style: {
              aspectRatio: '4/3', borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(90deg, color-mix(in srgb, var(--foreground) 8%, transparent), color-mix(in srgb, var(--foreground) 14%, transparent), color-mix(in srgb, var(--foreground) 8%, transparent))',
              backgroundSize: '200% 100%',
              animation: 'avatar-skeleton 1.4s ease-in-out infinite',
            },
          }),
        ),
        codigo: `crearEl('div', { style: {
  aspectRatio: '4/3',
  background: 'linear-gradient(90deg, gris-claro, gris-medio, gris-claro)',
  backgroundSize: '200% 100%',
  animation: 'avatar-skeleton 1.4s ease-in-out infinite',
}})

@keyframes avatar-skeleton {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}`,
      })],
    }),

  ],
});
