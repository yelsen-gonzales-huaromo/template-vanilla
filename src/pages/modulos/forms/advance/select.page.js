/**
 * Selects modernos — 5 tipos para proyectos corporativos / alta carga de datos.
 *  1. SelectModerno    single + buscador opcional
 *  2. SelectAgrupado   con secciones tipo "Tarjetas / Wallets / Otros"
 *  3. SelectCombobox   input editable que filtra en tiempo real
 *  4. SelectMulti      multi con chips + buscador + clear all
 *  5. SelectAccion     botón compacto estilo "Export ▼"
 */
import { crearEl } from '../../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../../components/ui/code-preview/code-preview.js';
import { Icono } from '../../../../components/ui/icon/icons.js';
import { corner1 } from '../../../../components/ui/card/card-decoraciones.js';
import { Campo, Stack, Grid2 } from '../_compartido.js';
import {
  SelectModerno, SelectAgrupado, SelectCombobox, SelectMulti, SelectAccion,
} from '../_select.js';

// Datasets de ejemplo (alto volumen para que se note el buscador)
const PAISES = [
  'Argentina', 'Bolivia', 'Brasil', 'Chile', 'Colombia', 'Costa Rica', 'Cuba',
  'Ecuador', 'El Salvador', 'España', 'Estados Unidos', 'Guatemala', 'Honduras',
  'México', 'Nicaragua', 'Panamá', 'Paraguay', 'Perú', 'Puerto Rico',
  'República Dominicana', 'Uruguay', 'Venezuela',
].map((n) => ({ value: n.toLowerCase().replace(/\s+/g, '-'), label: n }));

const METODOS_PAGO = [
  {
    grupo: 'Tarjetas',
    opciones: [
      { value: 'visa-4242', label: 'Visa', descripcion: '•••• 4242 · vence 12/27' },
      { value: 'master-8856', label: 'Mastercard', descripcion: '•••• 8856 · vence 03/26' },
      { value: 'amex-1234', label: 'American Express', descripcion: '•••• 1234 · vence 09/28' },
    ],
  },
  {
    grupo: 'Wallets',
    opciones: [
      { value: 'paypal', label: 'PayPal', descripcion: 'maria@empresa.com' },
      { value: 'apple-pay', label: 'Apple Pay' },
      { value: 'google-pay', label: 'Google Pay' },
    ],
  },
  {
    grupo: 'Otros',
    opciones: [
      { value: 'transfer', label: 'Transferencia bancaria', descripcion: 'BCP, BBVA, Interbank' },
      { value: 'yape', label: 'Yape / Plin', descripcion: 'Walletes peruanas — instantáneo' },
    ],
  },
];

const USUARIOS = [
  { value: 'wade', label: 'Wade Cooper', descripcion: '@wadecooper' },
  { value: 'arlene', label: 'Arlene Mccoy', descripcion: '@arlenemccoy' },
  { value: 'devon', label: 'Devon Webb', descripcion: '@devonwebb' },
  { value: 'tom', label: 'Tom Cook', descripcion: '@tomcook' },
  { value: 'tanya', label: 'Tanya Fox', descripcion: '@tanyafox' },
  { value: 'hellen', label: 'Hellen Schmidt', descripcion: '@hellenschmidt' },
  { value: 'caroline', label: 'Caroline Schultz', descripcion: '@carolineschultz' },
  { value: 'mason', label: 'Mason Heaney', descripcion: '@masonheaney' },
  { value: 'claudie', label: 'Claudie Smitham', descripcion: '@claudiesmitham' },
  { value: 'emil', label: 'Emil Schaefer', descripcion: '@emilschaefer' },
].map((u) => ({
  ...u,
  avatar: crearEl('span', {}, [u.label.split(' ').map((p) => p[0]).join('').slice(0, 2)]),
}));

const FRAMEWORKS = [
  'JavaScript', 'TypeScript', 'React', 'Vue', 'Svelte', 'Solid', 'Angular',
  'Next.js', 'Remix', 'Astro', 'Nuxt', 'SvelteKit', 'Qwik',
  'Express', 'Fastify', 'Koa', 'NestJS', 'Hono',
  'Django', 'Flask', 'FastAPI', 'Rails', 'Laravel', 'Phoenix',
  'Go', 'Rust', 'Python', 'Java', 'Kotlin', 'Swift',
].map((n) => ({ value: n.toLowerCase().replace(/\./g, '').replace(/\s+/g, '-'), label: n }));

export default async () => PaginaShowcase({
  titulo: 'Selects',
  descripcion: 'Selects modernos — 5 variantes para proyectos corporativos: single con buscador, agrupado por categorías, combobox editable, multi con chips, y menú de acción compacto. Todo vanilla JS, panel flotante con popover manager (un solo abierto), navegación con ↑↓ + Enter, auto-flip si no cabe abajo.',
  decoracion: corner1(),
  migas: [
    { etiqueta: 'Módulos', href: '#/modulos' },
    { etiqueta: 'Formularios', href: '#/modulos/forms' },
  ],
  hijos: [

    // ========== 1. SelectModerno ==========
    Seccion({
      titulo: '1 · SelectModerno — single con buscador',
      descripcion: 'Reemplazo del `<select>` nativo. Panel flotante, búsqueda opcional, navegación con ↑↓, hereda el ancho del trigger, soporta cientos de opciones sin lag.',
      hijos: [VistaCodigo({
        vista: Grid2(
          Campo({ label: 'País (sin buscador)', hijos: SelectModerno({
            opciones: PAISES, value: 'peru', placeholder: 'Selecciona país…',
          })}),
          Campo({ label: 'Framework (con buscador)', hijos: SelectModerno({
            opciones: FRAMEWORKS, value: 'react', conBuscador: true, placeholder: 'Buscar framework…',
          })}),
        ),
        codigo: `SelectModerno({
  opciones: [{ value: 'pe', label: 'Perú' }, ...],
  value: 'pe',
  conBuscador: true,
  placeholder: 'Selecciona país…',
  onChange: (v, opcion) => console.log(v, opcion),
})`,
      })],
    }),

    // ========== 2. SelectAgrupado ==========
    Seccion({
      titulo: '2 · SelectAgrupado — secciones tipo "Tarjetas / Wallets"',
      descripcion: 'Agrupa opciones bajo categorías (estilo `<optgroup>` pero modernizado). Cada opción puede tener descripción adicional. El buscador filtra dentro de todos los grupos.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { maxWidth: '420px' } }, [
          Campo({ label: 'Método de pago', hijos: SelectAgrupado({
            opciones: METODOS_PAGO, placeholder: 'Selecciona método de pago…', conBuscador: true,
          })}),
        ]),
        codigo: `SelectAgrupado({
  opciones: [
    { grupo: 'Tarjetas', opciones: [
      { value: 'visa-4242', label: 'Visa', descripcion: '•••• 4242' },
      ...
    ]},
    { grupo: 'Wallets', opciones: [...] },
  ],
})`,
      })],
    }),

    // ========== 3. SelectCombobox ==========
    Seccion({
      titulo: '3 · SelectCombobox — input editable',
      descripcion: 'El input ES el buscador. Al focusear se abre el panel; al tipear se filtra en vivo. Útil para autocompletes (ciudades, productos, tags). Opcional: `permitirCustom` permite crear valores nuevos sobre la marcha.',
      hijos: [VistaCodigo({
        vista: Grid2(
          Campo({ label: 'Ciudad — autocomplete', hijos: SelectCombobox({
            opciones: PAISES, placeholder: 'Empieza a escribir…',
          })}),
          Campo({ label: 'Tag — permite crear nuevos', hint: 'Escribe algo que no existe → "Crear …"',
            hijos: SelectCombobox({
              opciones: FRAMEWORKS, placeholder: 'Buscar o crear tag…', permitirCustom: true,
            })}),
        ),
        codigo: `SelectCombobox({
  opciones: [...],
  placeholder: 'Buscar…',
  permitirCustom: true,            // crea valores nuevos
  onChange: (v) => ...,
})`,
      })],
    }),

    // ========== 4. SelectMulti ==========
    Seccion({
      titulo: '4 · SelectMulti — multi con chips dentro del input',
      descripcion: 'Los seleccionados se muestran como chips en el trigger. Botón × en cada chip para remover individualmente, botón × global a la derecha limpia todos. Buscador en el panel filtra opciones disponibles. Soporta `max` para limitar selecciones.',
      hijos: [VistaCodigo({
        vista: Stack(
          Campo({ label: 'Skills', hijos: SelectMulti({
            opciones: FRAMEWORKS, value: ['javascript', 'typescript', 'react'],
            placeholder: 'Selecciona habilidades…',
          })}),
          Campo({ label: 'Países (máx. 3)', hint: 'Solo permite 3 selecciones',
            hijos: SelectMulti({
              opciones: PAISES, value: ['peru', 'chile'], max: 3,
              placeholder: 'Hasta 3 países…',
            })}),
        ),
        codigo: `SelectMulti({
  opciones: [...],
  value: ['javascript', 'typescript'],
  max: 3,                          // límite opcional
  onChange: (valores, opciones) => ...,
})`,
      })],
    }),

    // ========== 5. SelectModerno con avatares (estilo user picker) ==========
    Seccion({
      titulo: '5 · User picker — avatares + descripción',
      descripcion: 'Cualquier select acepta `avatar` o `icono` y `descripcion` por opción. Útil para asignar usuarios, elegir cuentas, listar items con thumbnails.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { maxWidth: '380px' } }, [
          Campo({ label: 'Asignado a',
            hijos: SelectModerno({
              opciones: USUARIOS, value: 'tom', conBuscador: true,
              placeholder: 'Selecciona usuario…',
            })}),
        ]),
        codigo: `SelectModerno({
  opciones: USUARIOS.map(u => ({
    value: u.id,
    label: u.nombre,
    descripcion: u.handle,         // se muestra debajo del label
    avatar: crearEl('img', { src: u.foto }),  // o iniciales
  })),
})`,
      })],
    }),

    // ========== 6. SelectAccion ==========
    Seccion({
      titulo: '6 · SelectAccion — botón con menú (Export ▼)',
      descripcion: 'Para acciones rápidas tipo dropdown menu en toolbars: descargar como JSON/CSV/PDF, ordenar por…, ver como…. Tres variantes (ghost, outline, primary) y dos tamaños.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' } }, [
          SelectAccion({
            etiqueta: 'CSV', value: 'csv', icono: Icono('descargar', { tamano: 14 }),
            opciones: [
              { value: 'json', label: 'JSON' }, { value: 'xml', label: 'XML' },
              { value: 'csv', label: 'CSV' }, { value: 'txt', label: 'TXT' },
              { value: 'xlsx', label: 'MS Excel' }, { value: 'pdf', label: 'PDF' },
            ],
            variante: 'outline',
          }),
          SelectAccion({
            etiqueta: 'Ordenar', icono: Icono('ordenar', { tamano: 14 }),
            opciones: [
              { value: 'fecha-desc', label: 'Más recientes primero' },
              { value: 'fecha-asc', label: 'Más antiguos primero' },
              { value: 'nombre-asc', label: 'Alfabético A-Z' },
              { value: 'nombre-desc', label: 'Alfabético Z-A' },
            ],
            variante: 'ghost',
          }),
          SelectAccion({
            etiqueta: 'Crear', icono: Icono('mas', { tamano: 14 }),
            opciones: [
              { value: 'doc', label: 'Documento' },
              { value: 'sheet', label: 'Hoja de cálculo' },
              { value: 'slide', label: 'Presentación' },
              { value: 'form', label: 'Formulario' },
            ],
            variante: 'primary',
          }),
        ]),
        codigo: `SelectAccion({
  etiqueta: 'Export',
  icono: Icono('descargar'),
  opciones: [
    { value: 'csv', label: 'CSV' },
    { value: 'pdf', label: 'PDF' },
    ...
  ],
  variante: 'outline',   // 'ghost' | 'outline' | 'primary'
  onChange: (v) => exportarComo(v),
})`,
      })],
    }),

  ],
});
