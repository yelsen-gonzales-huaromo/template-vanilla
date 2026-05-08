import { crearEl } from '../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { Ancla, EnlaceCTA, EnlaceExterno, ListaEnlaces } from '../../../components/ui/anchor/anchor.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { corner1 } from '../../../components/ui/card/card-decoraciones.js';

const fila = (...n) => crearEl('div', {
  style: { display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' },
}, n);

const stack = (...n) => crearEl('div', {
  style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' },
}, n);

export default async () => PaginaShowcase({
  titulo: 'Ancla',
  descripcion: 'Enlaces (`<a>`) consistentes y accesibles. 7 variantes semánticas × 5 estilos de subrayado × 3 tamaños, con soporte de iconos, externos, CTAs animados y listas de enlaces.',
  decoracion: corner1(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    // ============== 7 VARIANTES ==============
    Seccion({
      titulo: '7 variantes semánticas',
      descripcion: 'Cada variante usa un color distinto vinculado a los tokens del tema.',
      hijos: [VistaCodigo({
        vista: fila(
          Ancla({ href: '#', texto: 'Primary',   variante: 'primary' }),
          Ancla({ href: '#', texto: 'Secondary', variante: 'secondary' }),
          Ancla({ href: '#', texto: 'Success',   variante: 'success' }),
          Ancla({ href: '#', texto: 'Warning',   variante: 'warning' }),
          Ancla({ href: '#', texto: 'Danger',    variante: 'danger' }),
          Ancla({ href: '#', texto: 'Info',      variante: 'info' }),
          Ancla({ href: '#', texto: 'Neutral',   variante: 'neutral' }),
        ),
        codigo: `Ancla({ href: '#', texto: 'Primary',   variante: 'primary' })
Ancla({ href: '#', texto: 'Success',   variante: 'success' })
Ancla({ href: '#', texto: 'Warning',   variante: 'warning' })
Ancla({ href: '#', texto: 'Danger',    variante: 'danger' })
Ancla({ href: '#', texto: 'Neutral',   variante: 'neutral' })`,
      })],
    }),

    // ============== 5 ESTILOS DE SUBRAYADO ==============
    Seccion({
      titulo: '5 estilos de subrayado',
      descripcion: '`subrayado-hover` (default), `subrayado` siempre, `plain`, `sin-subrayado`, y `animado` con línea que crece.',
      hijos: [VistaCodigo({
        vista: stack(
          fila(
            crearEl('span', { style: { color: 'var(--muted-foreground)', minWidth: '160px', fontSize: 'var(--text-xs)' } }, ['subrayado-hover (default):']),
            Ancla({ href: '#', texto: 'Pasa el cursor por encima', estilo: 'subrayado-hover' }),
          ),
          fila(
            crearEl('span', { style: { color: 'var(--muted-foreground)', minWidth: '160px', fontSize: 'var(--text-xs)' } }, ['subrayado siempre:']),
            Ancla({ href: '#', texto: 'Siempre con línea',         estilo: 'subrayado' }),
          ),
          fila(
            crearEl('span', { style: { color: 'var(--muted-foreground)', minWidth: '160px', fontSize: 'var(--text-xs)' } }, ['plain / sin-subrayado:']),
            Ancla({ href: '#', texto: 'Sin decoración',            estilo: 'plain' }),
          ),
          fila(
            crearEl('span', { style: { color: 'var(--muted-foreground)', minWidth: '160px', fontSize: 'var(--text-xs)' } }, ['animado:']),
            Ancla({ href: '#', texto: 'Línea que crece al hover', estilo: 'animado' }),
          ),
        ),
        codigo: `Ancla({ texto: '...', estilo: 'subrayado-hover' })  // default
Ancla({ texto: '...', estilo: 'subrayado' })
Ancla({ texto: '...', estilo: 'plain' })
Ancla({ texto: '...', estilo: 'sin-subrayado' })
Ancla({ texto: '...', estilo: 'animado' })`,
      })],
    }),

    // ============== TAMAÑOS ==============
    Seccion({
      titulo: 'Tres tamaños',
      hijos: [VistaCodigo({
        vista: fila(
          Ancla({ href: '#', texto: 'Pequeño', tamano: 'sm' }),
          Ancla({ href: '#', texto: 'Mediano', tamano: 'md' }),
          Ancla({ href: '#', texto: 'Grande',  tamano: 'lg' }),
          Ancla({ href: '#', texto: 'Pesado',  pesado: true }),
        ),
        codigo: `Ancla({ texto: 'Pequeño', tamano: 'sm' })
Ancla({ texto: 'Mediano', tamano: 'md' })  // default
Ancla({ texto: 'Grande',  tamano: 'lg' })
Ancla({ texto: 'Pesado',  pesado: true })`,
      })],
    }),

    // ============== CON ICONOS ==============
    Seccion({
      titulo: 'Con iconos',
      hijos: [VistaCodigo({
        vista: fila(
          Ancla({ href: '#', texto: 'Editar',    icono: Icono('editar', { tamano: 14 }) }),
          Ancla({ href: '#', texto: 'Descargar', icono: Icono('descargar', { tamano: 14 }) }),
          Ancla({ href: '#', texto: 'Compartir', icono: Icono('subir', { tamano: 14 }), variante: 'success' }),
          Ancla({ href: '#', texto: 'Eliminar',  icono: Icono('papelera', { tamano: 14 }), variante: 'danger' }),
          Ancla({ href: '#', texto: 'Ver más',   iconoDerecha: Icono('chevron_r', { tamano: 14 }) }),
        ),
        codigo: `Ancla({ texto: 'Editar',  icono: Icono('editar') })
Ancla({ texto: 'Ver más', iconoDerecha: Icono('chevron_r') })`,
      })],
    }),

    // ============== CTA ==============
    Seccion({
      titulo: 'CTA (Call to Action)',
      descripcion: 'Link con flecha que se desliza al hover. Útil para "Leer más", "Ver detalles", etc.',
      hijos: [VistaCodigo({
        vista: stack(
          EnlaceCTA({ href: '#', texto: 'Leer más' }),
          EnlaceCTA({ href: '#', texto: 'Ver el changelog completo', variante: 'success' }),
          EnlaceCTA({ href: '#', texto: 'Explorar el blog', tamano: 'lg' }),
        ),
        codigo: `EnlaceCTA({ href: '#', texto: 'Leer más' })
EnlaceCTA({ href: '#', texto: 'Ver el changelog', variante: 'success' })
EnlaceCTA({ href: '#', texto: 'Explorar el blog', tamano: 'lg' })`,
      })],
    }),

    // ============== EXTERNO ==============
    Seccion({
      titulo: 'Enlaces externos',
      descripcion: '`externo: true` añade `target="_blank"`, `rel="noopener noreferrer"` y un icono diagonal de salida.',
      hijos: [VistaCodigo({
        vista: stack(
          EnlaceExterno({ href: 'https://github.com', texto: 'GitHub' }),
          EnlaceExterno({ href: 'https://developer.mozilla.org', texto: 'Documentación de MDN', variante: 'info' }),
          EnlaceExterno({ href: '#', texto: 'Especificación oficial', estilo: 'animado' }),
        ),
        codigo: `EnlaceExterno({ href: 'https://github.com', texto: 'GitHub' })
// Equivalente a:
Ancla({ href: 'https://github.com', texto: 'GitHub', externo: true })`,
      })],
    }),

    // ============== INLINE EN TEXTO ==============
    Seccion({
      titulo: 'Inline en texto',
      descripcion: 'Enlaces dentro de un párrafo — heredan el tamaño del texto que los rodea.',
      hijos: [VistaCodigo({
        vista: crearEl('p', { style: { margin: 0, lineHeight: 1.7, fontSize: 'var(--text-base)' } }, [
          'Para empezar, lee nuestra ',
          Ancla({ href: '#', texto: 'política de privacidad', estilo: 'subrayado' }),
          ' o consulta los ',
          Ancla({ href: '#', texto: 'términos del servicio', estilo: 'subrayado' }),
          '. Si tienes dudas, ',
          Ancla({ href: 'mailto:soporte@launchpad.app', texto: 'escríbenos' }),
          ' o visita ',
          EnlaceExterno({ href: '#', texto: 'el centro de ayuda' }),
          '.',
        ]),
        codigo: `crearEl('p', null, [
  'Lee nuestra ',
  Ancla({ href: '#', texto: 'política', estilo: 'subrayado' }),
  ' o ',
  Ancla({ href: 'mailto:...', texto: 'escríbenos' }),
])`,
      })],
    }),

    // ============== DESHABILITADO ==============
    Seccion({
      titulo: 'Estados',
      hijos: [VistaCodigo({
        vista: fila(
          Ancla({ href: '#', texto: 'Normal' }),
          Ancla({ href: '#', texto: 'Deshabilitado', deshabilitado: true }),
          Ancla({ href: '#', texto: 'Pesado', pesado: true }),
          Ancla({ href: '#', texto: 'Animado pesado', estilo: 'animado', pesado: true, variante: 'success' }),
        ),
        codigo: `Ancla({ texto: 'Deshabilitado', deshabilitado: true })`,
      })],
    }),

    // ============== LISTAS (FOOTER / SIDEBAR) ==============
    Seccion({
      titulo: 'Listas de enlaces',
      descripcion: 'Helper `ListaEnlaces` para footers, sidebars o secciones de "links útiles".',
      hijos: [VistaCodigo({
        vista: crearEl('div', {
          style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-5)' },
        }, [
          ListaEnlaces({
            titulo: 'Producto',
            enlaces: [
              { texto: 'Características', href: '#' },
              { texto: 'Precios',         href: '#' },
              { texto: 'Changelog',       href: '#' },
              { texto: 'Roadmap',         href: '#' },
            ],
          }),
          ListaEnlaces({
            titulo: 'Recursos',
            enlaces: [
              { texto: 'Documentación', href: '#' },
              { texto: 'Blog',          href: '#' },
              { texto: 'Comunidad',     href: '#', externo: true },
              { texto: 'Soporte',       href: '#' },
            ],
          }),
          ListaEnlaces({
            titulo: 'Legal',
            enlaces: [
              { texto: 'Privacidad', href: '#' },
              { texto: 'Términos',   href: '#' },
              { texto: 'Cookies',    href: '#' },
              { texto: 'Licencias',  href: '#' },
            ],
          }),
        ]),
        codigo: `ListaEnlaces({
  titulo: 'Producto',
  enlaces: [
    { texto: 'Características', href: '#' },
    { texto: 'Precios',         href: '#' },
    { texto: 'Comunidad',       href: '#', externo: true },
  ],
})`,
      })],
    }),

    // ============== ESPECIALES (mailto, tel, anchor #) ==============
    Seccion({
      titulo: 'Tipos especiales',
      descripcion: '`mailto:`, `tel:`, anchors internos `#seccion`, skip-links de accesibilidad.',
      hijos: [VistaCodigo({
        vista: stack(
          Ancla({ href: 'mailto:hola@launchpad.app',
            texto: 'hola@launchpad.app',
            icono: Icono('correo', { tamano: 14 }) }),
          Ancla({ href: 'tel:+34123456789',
            texto: '+34 123 456 789',
            icono: Icono('campana', { tamano: 14 }), variante: 'success' }),
          Ancla({ href: '#variantes',
            texto: 'Saltar a la sección de variantes',
            iconoDerecha: Icono('chevron_d', { tamano: 14 }), variante: 'neutral' }),
          Ancla({ href: '#main',
            texto: 'Saltar al contenido principal',
            estilo: 'subrayado', tamano: 'sm', variante: 'neutral' }),
        ),
        codigo: `Ancla({ href: 'mailto:hola@launchpad.app', texto: '...' })
Ancla({ href: 'tel:+34123456789', texto: '...' })
Ancla({ href: '#variantes', texto: 'Saltar a sección...' })
Ancla({ href: '#main', texto: 'Saltar al contenido' })  // skip link`,
      })],
    }),
  ],
});
