import { crearEl } from '../../../utils/helpers/dom.js';
import { senal } from '../../../utils/helpers/reactive.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import {
  Boton, GrupoBotones, BotonSplit, BotonFAB, BotonToggle,
} from '../../../components/ui/button/button.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { notificar } from '../../../components/ui/toast/toast.js';
import { corner2 } from '../../../components/ui/card/card-decoraciones.js';

const fila = (...n) => crearEl('div', {
  style: { display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', alignItems: 'center' },
}, n);

const stack = (...n) => crearEl('div', {
  style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' },
}, n);

const filaLabel = (label, nodo) => crearEl('div', {
  style: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' },
}, [
  crearEl('span', { style: { color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', minWidth: '90px' } }, [label]),
  nodo,
]);

export default async () => PaginaShowcase({
  titulo: 'Botones',
  descripcion: 'Sistema completo: 10 variantes × 4 estilos × 5 tamaños × 3 formas, con iconos, estados, FAB, toggle, grupo de botones unidos y botón split (acción + dropdown).',
  decoracion: corner2(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    // ============== 10 VARIANTES ==============
    Seccion({
      titulo: '10 variantes semánticas',
      descripcion: 'Cada variante comunica una intención distinta.',
      hijos: [VistaCodigo({
        vista: stack(
          fila(
            Boton({ texto: 'Primary',   variante: 'primary' }),
            Boton({ texto: 'Secondary', variante: 'secondary' }),
            Boton({ texto: 'Ghost',     variante: 'ghost' }),
            Boton({ texto: 'Outline',   variante: 'outline' }),
            Boton({ texto: 'Link',      variante: 'link' }),
          ),
          fila(
            Boton({ texto: 'Success', variante: 'success' }),
            Boton({ texto: 'Warning', variante: 'warning' }),
            Boton({ texto: 'Danger',  variante: 'danger' }),
            Boton({ texto: 'Info',    variante: 'info' }),
            Boton({ texto: 'Brand',   variante: 'brand' }),
          ),
        ),
        codigo: `Boton({ texto: 'Primary',   variante: 'primary' })
Boton({ texto: 'Secondary', variante: 'secondary' })
Boton({ texto: 'Ghost',     variante: 'ghost' })
Boton({ texto: 'Outline',   variante: 'outline' })
Boton({ texto: 'Link',      variante: 'link' })
Boton({ texto: 'Success',   variante: 'success' })
Boton({ texto: 'Warning',   variante: 'warning' })
Boton({ texto: 'Danger',    variante: 'danger' })
Boton({ texto: 'Info',      variante: 'info' })
Boton({ texto: 'Brand',     variante: 'brand' })   // gradiente`,
      })],
    }),

    // ============== 4 ESTILOS DE FILL ==============
    Seccion({
      titulo: '4 estilos de fill',
      descripcion: 'Sólido (default), Soft (suave), Outline (sólo borde), Ghost (sin bg). Combinables con cualquier variante.',
      hijos: [VistaCodigo({
        vista: stack(
          filaLabel('Sólido (default):',
            fila(
              Boton({ texto: 'Primary',  variante: 'primary' }),
              Boton({ texto: 'Success',  variante: 'success' }),
              Boton({ texto: 'Warning',  variante: 'warning' }),
              Boton({ texto: 'Danger',   variante: 'danger' }),
              Boton({ texto: 'Info',     variante: 'info' }),
            ),
          ),
          filaLabel('Soft:',
            fila(
              Boton({ texto: 'Primary', variante: 'primary', estilo: 'soft' }),
              Boton({ texto: 'Success', variante: 'success', estilo: 'soft' }),
              Boton({ texto: 'Warning', variante: 'warning', estilo: 'soft' }),
              Boton({ texto: 'Danger',  variante: 'danger',  estilo: 'soft' }),
              Boton({ texto: 'Info',    variante: 'info',    estilo: 'soft' }),
            ),
          ),
          filaLabel('Outline:',
            fila(
              Boton({ texto: 'Primary', variante: 'primary', estilo: 'outline' }),
              Boton({ texto: 'Success', variante: 'success', estilo: 'outline' }),
              Boton({ texto: 'Warning', variante: 'warning', estilo: 'outline' }),
              Boton({ texto: 'Danger',  variante: 'danger',  estilo: 'outline' }),
              Boton({ texto: 'Info',    variante: 'info',    estilo: 'outline' }),
            ),
          ),
        ),
        codigo: `Boton({ texto: 'Primary', variante: 'primary' })                    // sólido (default)
Boton({ texto: 'Primary', variante: 'primary', estilo: 'soft' })
Boton({ texto: 'Primary', variante: 'primary', estilo: 'outline' })
Boton({ texto: 'Primary', variante: 'primary', estilo: 'ghost' })`,
      })],
    }),

    // ============== TAMAÑOS ==============
    Seccion({
      titulo: '5 tamaños',
      hijos: [VistaCodigo({
        vista: fila(
          Boton({ texto: 'XS',  variante: 'primary', tamano: 'xs' }),
          Boton({ texto: 'SM',  variante: 'primary', tamano: 'sm' }),
          Boton({ texto: 'MD',  variante: 'primary', tamano: 'md' }),
          Boton({ texto: 'LG',  variante: 'primary', tamano: 'lg' }),
          Boton({ texto: 'XL',  variante: 'primary', tamano: 'xl' }),
        ),
        codigo: `Boton({ texto: 'XS', tamano: 'xs' })
Boton({ texto: 'SM', tamano: 'sm' })
Boton({ texto: 'MD', tamano: 'md' })   // default
Boton({ texto: 'LG', tamano: 'lg' })
Boton({ texto: 'XL', tamano: 'xl' })`,
      })],
    }),

    // ============== FORMAS ==============
    Seccion({
      titulo: 'Formas',
      hijos: [VistaCodigo({
        vista: fila(
          Boton({ texto: 'Rect (default)', variante: 'primary' }),
          Boton({ texto: 'Pill',           variante: 'primary', forma: 'pill' }),
          Boton({ texto: 'Cuadrado',       variante: 'primary', forma: 'cuadrado' }),
        ),
        codigo: `Boton({ texto: '...', forma: 'rect' })       // default
Boton({ texto: '...', forma: 'pill' })       // border-radius full
Boton({ texto: '...', forma: 'cuadrado' })   // esquinas mínimas`,
      })],
    }),

    // ============== CON ICONOS ==============
    Seccion({
      titulo: 'Con iconos',
      descripcion: 'Iconos a izquierda, derecha, ambos lados o sólo icono.',
      hijos: [VistaCodigo({
        vista: fila(
          Boton({ texto: 'Guardar',   icono: Icono('check', { tamano: 14 }), variante: 'primary' }),
          Boton({ texto: 'Continuar', iconoDerecha: Icono('flecha_r', { tamano: 14 }), variante: 'secondary' }),
          Boton({ texto: 'Descargar', icono: Icono('descargar', { tamano: 14 }), iconoDerecha: Icono('flecha_r', { tamano: 14 }) }),
          Boton({ icono: Icono('mas',       { tamano: 16 }), variante: 'primary',   'aria-label': 'Añadir' }),
          Boton({ icono: Icono('papelera',  { tamano: 16 }), variante: 'danger',    'aria-label': 'Eliminar' }),
          Boton({ icono: Icono('descargar', { tamano: 16 }), variante: 'ghost',     'aria-label': 'Descargar' }),
          Boton({ icono: Icono('preferencias', { tamano: 16 }), variante: 'outline', forma: 'pill', 'aria-label': 'Configuración' }),
        ),
        codigo: `Boton({ texto: 'Guardar',   icono: Icono('check') })
Boton({ texto: 'Continuar', iconoDerecha: Icono('flecha_r') })
Boton({ icono: Icono('mas'), 'aria-label': 'Añadir' })       // sólo icono`,
      })],
    }),

    // ============== ESTADOS ==============
    Seccion({
      titulo: 'Estados',
      hijos: [VistaCodigo({
        vista: fila(
          Boton({ texto: 'Default',       variante: 'primary' }),
          Boton({ texto: 'Cargando',      variante: 'primary', cargando: true }),
          Boton({ texto: 'Deshabilitado', variante: 'primary', deshabilitado: true }),
          Boton({ texto: 'Activo',        variante: 'secondary', activo: true }),
          Boton({ texto: 'Elevado',       variante: 'primary', elevado: true }),
        ),
        codigo: `Boton({ texto: 'Cargando',      cargando: true })
Boton({ texto: 'Deshabilitado', deshabilitado: true })
Boton({ texto: 'Activo',        activo: true })       // toggle pressed
Boton({ texto: 'Elevado',       elevado: true })      // sombra extra`,
      })],
    }),

    // ============== BLOQUE ==============
    Seccion({
      titulo: 'Bloque (full-width)',
      hijos: [VistaCodigo({
        vista: stack(
          Boton({ texto: 'Continuar al pago', variante: 'primary', bloque: true, icono: Icono('check', { tamano: 14 }) }),
          Boton({ texto: 'Cancelar suscripción', variante: 'danger', estilo: 'soft', bloque: true }),
        ),
        codigo: `Boton({ texto: 'Continuar al pago', variante: 'primary', bloque: true })
Boton({ texto: 'Cancelar', variante: 'danger', estilo: 'soft', bloque: true })`,
      })],
    }),

    // ============== GRUPO DE BOTONES ==============
    Seccion({
      titulo: 'Grupo de botones',
      descripcion: 'Botones unidos sin gap — perfecto para toolbars, segmented controls, alineación de texto.',
      hijos: [VistaCodigo({
        vista: stack(
          GrupoBotones({ items: [
            { texto: 'Izquierda',  icono: Icono('chevron_l', { tamano: 14 }) },
            { texto: 'Centro',     activo: true },
            { texto: 'Derecha',    iconoDerecha: Icono('chevron_r', { tamano: 14 }) },
          ]}),
          GrupoBotones({ tamano: 'sm', items: [
            { icono: Icono('chevron_l', { tamano: 12 }) },
            { icono: Icono('chevron_d', { tamano: 12 }) },
            { icono: Icono('chevron_r', { tamano: 12 }) },
          ]}),
          GrupoBotones({ vertical: true, items: [
            { texto: 'Día',     activo: true },
            { texto: 'Semana' },
            { texto: 'Mes' },
            { texto: 'Año' },
          ]}),
        ),
        codigo: `GrupoBotones({ items: [
  { texto: 'Izquierda', icono: Icono('chevron_l') },
  { texto: 'Centro',    activo: true },
  { texto: 'Derecha',   iconoDerecha: Icono('chevron_r') },
]})

GrupoBotones({ vertical: true, items: [...] })`,
      })],
    }),

    // ============== BOTÓN SPLIT ==============
    Seccion({
      titulo: 'Botón split',
      descripcion: 'Acción principal a la izquierda + caret con dropdown a la derecha. Útil para "Guardar / Guardar como…", "Crear / Crear desde plantilla…".',
      hijos: [VistaCodigo({
        vista: fila(
          BotonSplit({
            texto: 'Guardar',
            icono: Icono('check', { tamano: 14 }),
            variante: 'primary',
            alClick: () => notificar.exito('Guardado'),
            items: [
              { etiqueta: 'Guardar como…',   alSeleccionar: () => notificar.info('Guardar como') },
              { etiqueta: 'Guardar y cerrar', alSeleccionar: () => notificar.info('Guardar y cerrar') },
              { separador: true },
              { etiqueta: 'Exportar PDF',     alSeleccionar: () => notificar.info('Exportar PDF') },
            ],
          }),
          BotonSplit({
            texto: 'Publicar',
            variante: 'success', tamano: 'sm',
            alClick: () => notificar.exito('Publicado'),
            items: [
              { etiqueta: 'Publicar como borrador' },
              { etiqueta: 'Programar' },
            ],
          }),
        ),
        codigo: `BotonSplit({
  texto: 'Guardar',
  icono: Icono('check'),
  variante: 'primary',
  alClick: () => guardar(),
  items: [
    { etiqueta: 'Guardar como…',    alSeleccionar: () => {} },
    { etiqueta: 'Guardar y cerrar', alSeleccionar: () => {} },
    { separador: true },
    { etiqueta: 'Exportar PDF',     alSeleccionar: () => {} },
  ],
})`,
      })],
    }),

    // ============== TOGGLE ==============
    Seccion({
      titulo: 'Toggle (estado activo/inactivo)',
      descripcion: 'Mantiene estado interno con `senal`. Útil para favoritos, modo oscuro, modo edición.',
      hijos: [VistaCodigo({
        vista: fila(
          BotonToggle({ icono: Icono('estrella', { tamano: 14 }), texto: 'Favorito',
            alCambiar: (v) => notificar.info(`Favorito: ${v ? 'on' : 'off'}`) }),
          BotonToggle({ icono: Icono('corazon', { tamano: 14 }), texto: 'Me gusta', variante: 'ghost',
            alCambiar: () => {} }),
          BotonToggle({ icono: Icono('campana', { tamano: 14 }), variante: 'outline',
            alCambiar: () => {} }),
        ),
        codigo: `BotonToggle({
  icono: Icono('estrella'),
  texto: 'Favorito',
  alCambiar: (activo) => console.log(activo),
})

// O con senal externa para sincronizar con otros componentes:
const fav = senal(false);
BotonToggle({ valor: fav, texto: 'Favorito' })`,
      })],
    }),

    // ============== FAB ==============
    Seccion({
      titulo: 'FAB (Floating Action Button)',
      descripcion: 'Botón flotante circular con gradiente y sombra de marca. Acción primaria de la pantalla.',
      hijos: [VistaCodigo({
        vista: fila(
          BotonFAB({ icono: Icono('mas', { tamano: 18 }), tamano: 'sm',
            alClick: () => notificar.info('Crear') }),
          BotonFAB({ icono: Icono('mas', { tamano: 22 }),
            alClick: () => notificar.info('Crear') }),
          BotonFAB({ icono: Icono('mas', { tamano: 26 }), tamano: 'lg',
            alClick: () => notificar.info('Crear') }),
          BotonFAB({ icono: Icono('papelera', { tamano: 18 }), variante: 'danger',
            alClick: () => notificar.error('Eliminar') }),
          BotonFAB({ icono: Icono('check', { tamano: 18 }), variante: 'success',
            alClick: () => notificar.exito('OK') }),
        ),
        codigo: `BotonFAB({ icono: Icono('mas') })                         // tamaño md (default)
BotonFAB({ icono: Icono('mas'), tamano: 'lg' })
BotonFAB({ icono: Icono('papelera'), variante: 'danger' })

// FAB fijo en la esquina inferior derecha:
BotonFAB({
  icono: Icono('mas'),
  posicion: 'fija',
  alClick: () => crear(),
})`,
      })],
    }),

    // ============== CASOS DE USO ==============
    Seccion({
      titulo: 'Casos de uso comunes',
      hijos: [VistaCodigo({
        vista: stack(
          // Confirmación
          fila(
            Boton({ texto: 'Cancelar',  variante: 'ghost' }),
            Boton({ texto: 'Confirmar', variante: 'primary' }),
          ),
          // Destructiva con confirm
          fila(
            Boton({ texto: 'Cancelar',           variante: 'ghost' }),
            Boton({ texto: 'Sí, eliminar',       variante: 'danger', icono: Icono('papelera', { tamano: 14 }) }),
          ),
          // Hero CTA
          fila(
            Boton({ texto: 'Empezar gratis',     variante: 'primary',  tamano: 'lg', elevado: true,
                    iconoDerecha: Icono('flecha_r', { tamano: 16 }) }),
            Boton({ texto: 'Ver demo',           variante: 'outline',  tamano: 'lg' }),
          ),
          // Toolbar
          fila(
            GrupoBotones({ tamano: 'sm', items: [
              { icono: Icono('editar',     { tamano: 12 }), activo: true },
              { icono: Icono('descargar',  { tamano: 12 }) },
              { icono: Icono('subir',      { tamano: 12 }) },
              { icono: Icono('papelera',   { tamano: 12 }) },
            ]}),
          ),
        ),
        codigo: `// Confirmación
fila([Boton({ texto: 'Cancelar', variante: 'ghost' }),
      Boton({ texto: 'Confirmar', variante: 'primary' })])

// Hero CTA
Boton({ texto: 'Empezar gratis', tamano: 'lg', elevado: true,
  iconoDerecha: Icono('flecha_r') })

// Toolbar de iconos
GrupoBotones({ tamano: 'sm', items: [...] })`,
      })],
    }),
  ],
});
