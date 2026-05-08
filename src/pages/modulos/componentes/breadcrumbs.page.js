import { crearEl } from '../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { Migas } from '../../../layouts/components/breadcrumbs/breadcrumbs.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { corner3 } from '../../../components/ui/card/card-decoraciones.js';

const stack = (...n) => crearEl('div', {
  style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' },
}, n);

const filaLabel = (label, nodo) => crearEl('div', {
  style: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' },
}, [
  crearEl('span', { style: { color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', minWidth: '90px' } }, [label]),
  nodo,
]);

const items3 = [
  { etiqueta: 'Inicio', href: '/' },
  { etiqueta: 'Componentes', href: '#/modulos/componentes' },
  { etiqueta: 'Migas' },
];

const items5 = [
  { etiqueta: 'Inicio',      href: '/' },
  { etiqueta: 'E-commerce',  href: '#' },
  { etiqueta: 'Productos',   href: '#' },
  { etiqueta: 'Cámaras',     href: '#' },
  { etiqueta: 'Sony A7 IV' },
];

const itemsLarga = [
  { etiqueta: 'Inicio',      href: '/' },
  { etiqueta: 'E-commerce',  href: '#' },
  { etiqueta: 'Productos',   href: '#' },
  { etiqueta: 'Electrónica', href: '#' },
  { etiqueta: 'Cámaras',     href: '#' },
  { etiqueta: 'Mirrorless',  href: '#' },
  { etiqueta: 'Sony',        href: '#' },
  { etiqueta: 'Sony A7 IV' },
];

export default async () => PaginaShowcase({
  titulo: 'Migas (Breadcrumbs)',
  descripcion: 'Ruta jerárquica clickeable. 3 variantes visuales × 5 separadores × 3 tamaños, con soporte de iconos, dropdown en items con hermanas, y truncamiento automático cuando hay muchos niveles.',
  decoracion: corner3(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    // ============== BÁSICO ==============
    Seccion({
      titulo: 'Básico',
      descripcion: 'El último item se marca como página actual (`aria-current="page"`).',
      hijos: [VistaCodigo({
        vista: Migas({ items: items3 }),
        codigo: `Migas({ items: [
  { etiqueta: 'Inicio',       href: '/' },
  { etiqueta: 'Componentes',  href: '#/modulos/componentes' },
  { etiqueta: 'Migas' },                       // último: sin href = página actual
]})`,
      })],
    }),

    // ============== 5 SEPARADORES ==============
    Seccion({
      titulo: '5 separadores',
      descripcion: 'Distintos caracteres separadores para combinar con el resto del diseño.',
      hijos: [VistaCodigo({
        vista: stack(
          filaLabel('slash (default):', Migas({ items: items3, separador: 'slash' })),
          filaLabel('chevron:',         Migas({ items: items3, separador: 'chevron' })),
          filaLabel('flecha:',          Migas({ items: items3, separador: 'flecha' })),
          filaLabel('punto:',           Migas({ items: items3, separador: 'punto' })),
          filaLabel('pipe:',            Migas({ items: items3, separador: 'pipe' })),
        ),
        codigo: `Migas({ items: [...], separador: 'slash' })   // default · / / /
Migas({ items: [...], separador: 'chevron' }) // › › ›
Migas({ items: [...], separador: 'flecha' })  // → → →
Migas({ items: [...], separador: 'punto' })   // · · ·
Migas({ items: [...], separador: 'pipe' })    // | | |`,
      })],
    }),

    // ============== TAMAÑOS ==============
    Seccion({
      titulo: 'Tres tamaños',
      hijos: [VistaCodigo({
        vista: stack(
          filaLabel('sm (default):', Migas({ items: items3, tamano: 'sm' })),
          filaLabel('md:',           Migas({ items: items3, tamano: 'md' })),
          filaLabel('lg:',           Migas({ items: items3, tamano: 'lg' })),
        ),
        codigo: `Migas({ items: [...], tamano: 'sm' })   // default
Migas({ items: [...], tamano: 'md' })
Migas({ items: [...], tamano: 'lg' })`,
      })],
    }),

    // ============== VARIANTES VISUALES ==============
    Seccion({
      titulo: '3 variantes visuales',
      descripcion: 'Plano (default), pills (cada item en pastilla, sin separadores), bordeada (contenedor con borde).',
      hijos: [VistaCodigo({
        vista: stack(
          filaLabel('plano:',    Migas({ items: items3, variante: 'plano' })),
          filaLabel('pills:',    Migas({ items: items3, variante: 'pills' })),
          filaLabel('bordeada:', Migas({ items: items3, variante: 'bordeada', separador: 'chevron' })),
        ),
        codigo: `Migas({ items: [...], variante: 'plano' })     // default
Migas({ items: [...], variante: 'pills' })     // pastillas, sin separadores
Migas({ items: [...], variante: 'bordeada' })  // contenedor con borde`,
      })],
    }),

    // ============== CON ICONOS ==============
    Seccion({
      titulo: 'Con iconos',
      descripcion: 'Cada item acepta un `icono`, o usa `iconoInicio: true` para inyectar el icono home automáticamente al primero.',
      hijos: [VistaCodigo({
        vista: stack(
          filaLabel('iconoInicio:', Migas({ items: items5, separador: 'chevron', iconoInicio: true })),
          filaLabel('iconos custom:', Migas({
            separador: 'chevron',
            items: [
              { etiqueta: 'Inicio',     href: '/',   icono: Icono('panel',     { tamano: 14 }) },
              { etiqueta: 'Productos',  href: '#',   icono: Icono('productos', { tamano: 14 }) },
              { etiqueta: 'Cámaras',    href: '#',   icono: Icono('monitor',   { tamano: 14 }) },
              { etiqueta: 'Sony A7 IV',              icono: Icono('estrella',  { tamano: 14 }) },
            ],
          })),
        ),
        codigo: `Migas({ items: [...], iconoInicio: true })  // home automático

Migas({ items: [
  { etiqueta: 'Inicio',     href: '/', icono: Icono('panel') },
  { etiqueta: 'Productos',  href: '#', icono: Icono('productos') },
  { etiqueta: 'Sony A7 IV',            icono: Icono('estrella') },
]})`,
      })],
    }),

    // ============== TRUNCAMIENTO ==============
    Seccion({
      titulo: 'Truncamiento (rutas profundas)',
      descripcion: 'Con `maxVisible: N`, items intermedios se colapsan en un botón `…` que abre dropdown con los ocultos. Mantiene el primero y los últimos visibles.',
      hijos: [VistaCodigo({
        vista: stack(
          filaLabel(`Sin truncar (${itemsLarga.length}):`,
            Migas({ items: itemsLarga, separador: 'chevron' })),
          filaLabel('maxVisible: 4',
            Migas({ items: itemsLarga, separador: 'chevron', maxVisible: 4 })),
          filaLabel('maxVisible: 5',
            Migas({ items: itemsLarga, separador: 'chevron', maxVisible: 5 })),
        ),
        codigo: `// Ruta de 8 niveles
Migas({ items: itemsLarga, separador: 'chevron', maxVisible: 4 })
// Resultado: Inicio › … › Sony › Sony A7 IV
// Click en … abre dropdown con los ocultos`,
      })],
    }),

    // ============== ITEMS CON DROPDOWN ==============
    Seccion({
      titulo: 'Items con dropdown (hermanas)',
      descripcion: 'Pasa `dropdown: [...]` a un item — aparece un caret que abre menú con sus hermanas. Útil para navegar entre categorías al mismo nivel sin retroceder.',
      hijos: [VistaCodigo({
        vista: Migas({
          separador: 'chevron',
          items: [
            { etiqueta: 'Inicio', href: '/' },
            { etiqueta: 'E-commerce', href: '#' },
            {
              etiqueta: 'Cámaras', href: '#',
              dropdown: [
                { etiqueta: 'Mirrorless', href: '#' },
                { etiqueta: 'DSLR',       href: '#' },
                { etiqueta: 'Compactas',  href: '#' },
                { etiqueta: 'Acción',     href: '#' },
              ],
            },
            { etiqueta: 'Sony A7 IV' },
          ],
        }),
        codigo: `Migas({ items: [
  { etiqueta: 'Inicio', href: '/' },
  { etiqueta: 'E-commerce', href: '#' },
  {
    etiqueta: 'Cámaras', href: '#',
    dropdown: [
      { etiqueta: 'Mirrorless', href: '#' },
      { etiqueta: 'DSLR',       href: '#' },
      { etiqueta: 'Compactas',  href: '#' },
    ],
  },
  { etiqueta: 'Sony A7 IV' },
]})`,
      })],
    }),

    // ============== CASOS DE USO ==============
    Seccion({
      titulo: 'Casos de uso típicos',
      hijos: [VistaCodigo({
        vista: stack(
          filaLabel('Admin / docs:',
            Migas({ items: items3, separador: 'chevron', iconoInicio: true })),
          filaLabel('E-commerce:',
            Migas({ items: items5, separador: 'chevron', maxVisible: 4 })),
          filaLabel('Compacta pills:',
            Migas({ items: items3, variante: 'pills', tamano: 'sm' })),
          filaLabel('Hero / landing:',
            Migas({ items: [
              { etiqueta: 'Inicio', href: '/', icono: Icono('panel', { tamano: 16 }) },
              { etiqueta: 'Blog',    href: '#' },
              { etiqueta: '¿Cómo construimos Launchpad?' },
            ], separador: 'flecha', tamano: 'lg' })),
        ),
        codigo: `// Admin con icono home
Migas({ items: [...], iconoInicio: true, separador: 'chevron' })

// E-commerce con truncamiento
Migas({ items: [...], maxVisible: 4, separador: 'chevron' })

// Compacta en pills
Migas({ items: [...], variante: 'pills' })

// Hero / landing grande con flecha
Migas({ items: [...], separador: 'flecha', tamano: 'lg' })`,
      })],
    }),
  ],
});
