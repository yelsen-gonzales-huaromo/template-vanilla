/**
 * Select — 5 tipos modernos para proyectos corporativos.
 * (Reemplaza al `<select>` nativo, que tiene UX limitada y no se puede estilizar
 *  consistentemente entre navegadores.)
 */
import { crearEl } from '../../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../../components/ui/code-preview/code-preview.js';
import { Icono } from '../../../../components/ui/icon/icons.js';
import { corner3 } from '../../../../components/ui/card/card-decoraciones.js';
import { Campo, Stack, Grid2 } from '../_compartido.js';
import {
  SelectModerno, SelectAgrupado, SelectCombobox, SelectMulti, SelectAccion,
  SelectSegmentado, SelectCascada, SelectRueda, SelectAsync, SelectTags,
} from '../_select.js';

// ---------------------------------------------------------------------------
//  Datasets
// ---------------------------------------------------------------------------
const PAISES = [
  'Argentina', 'Bolivia', 'Brasil', 'Chile', 'Colombia', 'Costa Rica',
  'Ecuador', 'El Salvador', 'España', 'Estados Unidos', 'Guatemala',
  'México', 'Nicaragua', 'Panamá', 'Paraguay', 'Perú', 'Puerto Rico',
  'República Dominicana', 'Uruguay', 'Venezuela',
].map((n) => ({ value: n.toLowerCase().replace(/\s+/g, '-'), label: n }));

const IDIOMAS = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
  { value: 'pt', label: 'Português' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
  { value: 'ja', label: '日本語' },
  { value: 'zh', label: '中文' },
];

const PLANES = [
  { value: 'free', label: 'Free', descripcion: '$0/mes · 1 proyecto · soporte comunidad' },
  { value: 'pro', label: 'Pro', descripcion: '$29/mes · 10 proyectos · soporte por email' },
  { value: 'team', label: 'Team', descripcion: '$99/mes · ilimitado · SSO + auditoría' },
  { value: 'ent', label: 'Enterprise', descripcion: 'Personalizado · SLA 99.99% · CSM dedicado' },
];

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
      { value: 'transfer', label: 'Transferencia bancaria', descripcion: 'BCP · BBVA · Interbank' },
      { value: 'yape', label: 'Yape / Plin', descripcion: 'Wallets peruanas — instantáneo' },
    ],
  },
];

const SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Vue', 'Svelte', 'Solid', 'Angular',
  'Next.js', 'Remix', 'Astro', 'Nuxt', 'SvelteKit', 'Qwik',
  'Express', 'Fastify', 'NestJS', 'Hono',
  'Django', 'Flask', 'FastAPI', 'Rails', 'Laravel',
  'Go', 'Rust', 'Python', 'Java', 'Kotlin', 'Swift',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch',
  'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Terraform',
].map((n) => ({ value: n.toLowerCase().replace(/\./g, '').replace(/\s+/g, '-'), label: n }));

const USUARIOS = [
  { value: 'wade', label: 'Wade Cooper', descripcion: '@wadecooper' },
  { value: 'arlene', label: 'Arlene Mccoy', descripcion: '@arlenemccoy' },
  { value: 'devon', label: 'Devon Webb', descripcion: '@devonwebb' },
  { value: 'tom', label: 'Tom Cook', descripcion: '@tomcook' },
  { value: 'tanya', label: 'Tanya Fox', descripcion: '@tanyafox' },
  { value: 'hellen', label: 'Hellen Schmidt', descripcion: '@hellenschmidt' },
  { value: 'caroline', label: 'Caroline Schultz', descripcion: '@carolineschultz' },
  { value: 'mason', label: 'Mason Heaney', descripcion: '@masonheaney' },
].map((u) => ({
  ...u,
  avatar: crearEl('span', {}, [u.label.split(' ').map((p) => p[0]).join('').slice(0, 2)]),
}));

export default async () => PaginaShowcase({
  titulo: 'Select',
  descripcion: 'Selects modernos vanilla JS — 5 tipos para proyectos corporativos: single con buscador, agrupado por categorías, combobox editable, multi con chips, y menú de acción. Panel flotante con popover manager (un solo abierto a la vez), navegación con ↑↓ + Enter, auto-flip si no cabe abajo, hereda el ancho del trigger. Reemplazo directo del `<select>` nativo.',
  decoracion: corner3(),
  migas: [
    { etiqueta: 'Módulos', href: '#/modulos' },
    { etiqueta: 'Formularios', href: '#/modulos/forms' },
  ],
  hijos: [

    // ========== 1. SelectModerno ==========
    Seccion({
      titulo: '1 · Single — con o sin buscador',
      descripcion: 'Reemplazo directo del `<select>`. Click abre el panel; con `conBuscador: true` se agrega un input de filtro arriba (ideal para listas con +20 opciones).',
      hijos: [VistaCodigo({
        vista: Grid2(
          Campo({ label: 'País (sin buscador)', hijos: SelectModerno({
            opciones: PAISES, value: 'peru', placeholder: 'Selecciona país…',
          })}),
          Campo({ label: 'Idioma', hijos: SelectModerno({
            opciones: IDIOMAS, value: 'es',
          })}),
          Campo({ label: 'Skills (con buscador)', hijos: SelectModerno({
            opciones: SKILLS, value: 'react', conBuscador: true, placeholder: 'Buscar tecnología…',
          })}),
          Campo({ label: 'Plan (con descripción)', hijos: SelectModerno({
            opciones: PLANES, value: 'pro', placeholder: 'Elige plan…',
          })}),
        ),
        codigo: `SelectModerno({
  opciones: [{ value: 'pe', label: 'Perú' }, ...],
  value: 'pe',
  conBuscador: true,
  onChange: (v, opcion) => console.log(v, opcion),
})`,
      })],
    }),

    // ========== 2. SelectAgrupado ==========
    Seccion({
      titulo: '2 · Agrupado — secciones tipo "Tarjetas / Wallets"',
      descripcion: 'Cada opción se categoriza bajo un grupo. El buscador filtra dentro de todos los grupos a la vez. Cada opción puede llevar `descripcion`.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { maxWidth: '420px' } }, [
          Campo({ label: 'Método de pago', hijos: SelectAgrupado({
            opciones: METODOS_PAGO, placeholder: 'Selecciona método…', conBuscador: true,
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
  conBuscador: true,
})`,
      })],
    }),

    // ========== 3. SelectCombobox ==========
    Seccion({
      titulo: '3 · Combobox — input editable',
      descripcion: 'El input ES el buscador. Focus abre el panel; tipear filtra en vivo y resalta el match. Con `permitirCustom: true` aparece "Crear …" para valores nuevos — ideal para tags.',
      hijos: [VistaCodigo({
        vista: Grid2(
          Campo({ label: 'Ciudad — autocomplete', hijos: SelectCombobox({
            opciones: PAISES, placeholder: 'Empieza a escribir…',
          })}),
          Campo({ label: 'Tag — permite crear', hint: 'Escribe algo nuevo → "Crear …"',
            hijos: SelectCombobox({
              opciones: SKILLS, placeholder: 'Buscar o crear tag…', permitirCustom: true,
            })}),
        ),
        codigo: `SelectCombobox({
  opciones: [...],
  permitirCustom: true,            // permite crear valores nuevos
  onChange: (v) => ...,
})`,
      })],
    }),

    // ========== 4. SelectMulti ==========
    Seccion({
      titulo: '4 · Multi — chips dentro del input',
      descripcion: 'Selecciones se muestran como chips removibles. × por chip y × global a la derecha. Soporta `max` para limitar la cantidad de selecciones. Cada opción muestra un checkbox visual en el panel.',
      hijos: [VistaCodigo({
        vista: Stack(
          Campo({ label: 'Skills', hijos: SelectMulti({
            opciones: SKILLS, value: ['javascript', 'typescript', 'react'],
            placeholder: 'Selecciona habilidades…',
          })}),
          Campo({ label: 'Países preferidos (máx. 3)', hint: 'Solo permite 3 selecciones',
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

    // ========== 5. User picker (avatares) ==========
    Seccion({
      titulo: '5 · User picker — avatares + descripción',
      descripcion: 'Cualquier select acepta `avatar` (o `icono`) y `descripcion` por opción. Patrón clásico para asignar usuarios, elegir cuentas, o cualquier lista con thumbnails.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { maxWidth: '380px' } }, [
          Campo({ label: 'Asignado a', hijos: SelectModerno({
            opciones: USUARIOS, value: 'tom', conBuscador: true,
            placeholder: 'Selecciona usuario…',
          })}),
        ]),
        codigo: `SelectModerno({
  opciones: usuarios.map(u => ({
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
      titulo: '6 · Acción — botón con menú (Export ▼)',
      descripcion: 'Para acciones rápidas en toolbars: descargar como JSON/CSV/PDF, ordenar por…, ver como…. Tres variantes (ghost · outline · primary) y dos tamaños (sm · md).',
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

    // ========== 7. SelectSegmentado ==========
    Seccion({
      titulo: '7 · Segmentado — pills tipo iOS (Light/Dark/Auto)',
      descripcion: 'Para 2-5 opciones cuando todas deben ser visibles a la vez. Pattern típico: tema (light/dark/auto), vista (día/semana/mes), formato (lista/cards/tabla). Cero clicks para ver las opciones.',
      hijos: [VistaCodigo({
        vista: Stack(
          Campo({ label: 'Tema', hijos: SelectSegmentado({
            value: 'auto',
            opciones: [
              { value: 'light', label: 'Claro' },
              { value: 'dark', label: 'Oscuro' },
              { value: 'auto', label: 'Auto' },
            ],
          })}),
          Campo({ label: 'Vista del calendario', hijos: SelectSegmentado({
            value: 'semana',
            opciones: [
              { value: 'dia', label: 'Día' },
              { value: 'semana', label: 'Semana' },
              { value: 'mes', label: 'Mes' },
              { value: 'ano', label: 'Año' },
            ],
          })}),
          Campo({ label: 'Tamaños', hijos: crearEl('div', { style: { display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' } }, [
            SelectSegmentado({ tamano: 'sm', value: 'b', opciones: [{ value: 'a', label: 'XS' }, { value: 'b', label: 'S' }, { value: 'c', label: 'M' }] }),
            SelectSegmentado({ tamano: 'md', value: 'b', opciones: [{ value: 'a', label: 'Lista' }, { value: 'b', label: 'Cards' }, { value: 'c', label: 'Tabla' }] }),
            SelectSegmentado({ tamano: 'lg', value: 'on', opciones: [{ value: 'on', label: 'Activo' }, { value: 'off', label: 'Inactivo' }] }),
          ])}),
        ),
        codigo: `SelectSegmentado({
  value: 'auto',
  opciones: [
    { value: 'light', label: 'Claro' },
    { value: 'dark', label: 'Oscuro' },
    { value: 'auto', label: 'Auto' },
  ],
  tamano: 'md',                    // 'sm' | 'md' | 'lg'
  onChange: (v) => setTema(v),
})`,
      })],
    }),

    // ========== 8. SelectCascada ==========
    Seccion({
      titulo: '8 · Cascada — encadenado País → Estado → Ciudad',
      descripcion: 'Niveles dependientes: cuando cambias el padre, los hijos se borran y la siguiente columna recarga sus opciones. Cada nivel puede traer sus opciones de un dataset estático o de una API.',
      hijos: [VistaCodigo({
        vista: SelectCascada({
          niveles: [
            { label: 'País', opciones: [
              { value: 'pe', label: 'Perú' }, { value: 'mx', label: 'México' }, { value: 'co', label: 'Colombia' },
            ]},
            { label: 'Departamento', opciones: ([pais]) => ({
              pe: [{ value: 'lima', label: 'Lima' }, { value: 'cusco', label: 'Cusco' }, { value: 'arequipa', label: 'Arequipa' }, { value: 'trujillo', label: 'La Libertad' }],
              mx: [{ value: 'cdmx', label: 'CDMX' }, { value: 'jalisco', label: 'Jalisco' }, { value: 'nl', label: 'Nuevo León' }],
              co: [{ value: 'bogota', label: 'Bogotá' }, { value: 'antioquia', label: 'Antioquia' }, { value: 'valle', label: 'Valle del Cauca' }],
            }[pais] || [])},
            { label: 'Distrito', opciones: ([_, depto]) => ({
              lima: [{ value: 'miraflores', label: 'Miraflores' }, { value: 'sanisidro', label: 'San Isidro' }, { value: 'barranco', label: 'Barranco' }, { value: 'surco', label: 'Surco' }],
              cusco: [{ value: 'wanchaq', label: 'Wánchaq' }, { value: 'sansebastian', label: 'San Sebastián' }],
              cdmx: [{ value: 'roma', label: 'Roma' }, { value: 'condesa', label: 'Condesa' }, { value: 'polanco', label: 'Polanco' }],
              bogota: [{ value: 'chapinero', label: 'Chapinero' }, { value: 'usaquen', label: 'Usaquén' }],
            }[depto] || [])},
          ],
          value: ['pe', 'lima', 'miraflores'],
        }),
        codigo: `SelectCascada({
  niveles: [
    { label: 'País', opciones: [...] },
    { label: 'Departamento',
      opciones: ([pais]) => departamentosDe(pais) },
    { label: 'Distrito',
      opciones: ([_, depto]) => distritosDe(depto) },
  ],
  value: ['pe', 'lima', 'miraflores'],
  onChange: (vals) => console.log(vals),
})`,
      })],
    }),

    // ========== 9. SelectRueda ==========
    Seccion({
      titulo: '9 · Rueda — wheel picker iOS-style',
      descripcion: 'Compacto pero permite muchas opciones — el usuario hace scroll dentro de la rueda y se hace snap al ítem central. Útil para fechas, cantidades, hora, edad. Ocupa poco espacio.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { display: 'flex', gap: '12px', maxWidth: '420px' } }, [
          crearEl('div', { style: { flex: 1 } }, [SelectRueda({
            etiqueta: 'Día', value: 15,
            opciones: Array.from({ length: 31 }, (_, i) => ({ value: i + 1, label: String(i + 1).padStart(2, '0') })),
          })]),
          crearEl('div', { style: { flex: 1 } }, [SelectRueda({
            etiqueta: 'Mes', value: 5,
            opciones: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].map((m, i) => ({ value: i + 1, label: m })),
          })]),
          crearEl('div', { style: { flex: 1 } }, [SelectRueda({
            etiqueta: 'Año', value: 2026,
            opciones: Array.from({ length: 50 }, (_, i) => ({ value: 2000 + i, label: String(2000 + i) })),
          })]),
        ]),
        codigo: `SelectRueda({
  etiqueta: 'Día',
  value: 15,
  alto: 160,
  opciones: Array.from({ length: 31 }, (_, i) => ({
    value: i + 1, label: String(i + 1).padStart(2, '0'),
  })),
  onChange: (v) => ...,
})`,
      })],
    }),

    // ========== 10. SelectAsync ==========
    Seccion({
      titulo: '10 · Async — busca en el servidor con debounce',
      descripcion: 'Para datasets enormes que no caben en memoria (10k+ items, base de productos completa, usuarios de toda la empresa). Recibe `cargar(query)` que devuelve una Promise. Debounce 280ms por defecto. Spinner mientras carga, "Sin resultados" si vuelve vacío, ignora respuestas viejas si llega una nueva.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { maxWidth: '420px' } }, [
          Campo({ label: 'Buscar producto en el catálogo',
            hint: 'Simulado: 600ms de latencia. Tipea "lap", "tel", "audi", etc.',
            hijos: SelectAsync({
              placeholder: 'Tipea para buscar productos…',
              cargar: async (q) => {
                await new Promise((r) => setTimeout(r, 600));
                const todos = [
                  { value: 'lap-1', label: 'Laptop Dell XPS 15', descripcion: 'Intel i7 · 16 GB · S/. 5,499' },
                  { value: 'lap-2', label: 'Laptop MacBook Air M3', descripcion: '13" · 8 GB · S/. 4,899' },
                  { value: 'lap-3', label: 'Laptop Lenovo ThinkPad', descripcion: 'Ryzen 7 · 32 GB · S/. 6,200' },
                  { value: 'tel-1', label: 'Teléfono iPhone 15 Pro', descripcion: '256 GB · S/. 4,999' },
                  { value: 'tel-2', label: 'Teléfono Samsung Galaxy S24', descripcion: '512 GB · S/. 4,200' },
                  { value: 'tel-3', label: 'Teléfono Pixel 8', descripcion: '128 GB · S/. 2,800' },
                  { value: 'audi-1', label: 'Audífonos AirPods Pro', descripcion: 'ANC · S/. 999' },
                  { value: 'audi-2', label: 'Audífonos Sony WH-1000XM5', descripcion: 'Wireless · S/. 1,399' },
                  { value: 'mon-1', label: 'Monitor LG UltraFine 27"', descripcion: '4K · USB-C · S/. 2,100' },
                  { value: 'mon-2', label: 'Monitor Dell 34" curvo', descripcion: 'UWQHD · S/. 2,800' },
                ];
                return todos.filter((p) => p.label.toLowerCase().includes(q.toLowerCase()) || p.descripcion.toLowerCase().includes(q.toLowerCase()));
              },
            })}),
        ]),
        codigo: `SelectAsync({
  cargar: async (query) => {
    const r = await fetch(\`/api/productos?q=\${query}\`);
    return r.json();   // [{ value, label, descripcion? }, ...]
  },
  debounceMs: 280,
  vacio: 'Empieza a tipear…',
})`,
      })],
    }),

    // ========== 11. SelectTags ==========
    Seccion({
      titulo: '11 · Tags input — Enter o coma para agregar',
      descripcion: 'Convierte texto libre en tags removibles. Enter o coma confirma; Backspace en input vacío elimina el último. Opcional: pasar `sugerencias` para mostrar autocomplete al focusear.',
      hijos: [VistaCodigo({
        vista: Stack(
          Campo({ label: 'Tags libres', hint: 'Tipea, presiona Enter o coma',
            hijos: SelectTags({
              value: ['javascript', 'react', 'css'],
              placeholder: 'Agregar tag…',
            })}),
          Campo({ label: 'Tags con autocomplete', hint: 'Tipea para ver sugerencias o Enter para crear nueva',
            hijos: SelectTags({
              value: ['React'],
              max: 5,
              sugerencias: SKILLS,
              placeholder: 'Buscar o crear tag…',
            })}),
        ),
        codigo: `SelectTags({
  value: ['javascript', 'react'],
  sugerencias: [...],              // autocomplete opcional
  max: 5,                          // límite opcional
  onChange: (tags) => ...,
})`,
      })],
    }),

    // ========== 12. Estados ==========
    Seccion({
      titulo: '12 · Estados — válido · inválido · disabled',
      descripcion: 'Los selects soportan los mismos estados que los inputs vía props `valido`, `invalido`, `deshabilitado`.',
      hijos: [VistaCodigo({
        vista: Grid2(
          Campo({ label: 'Default', hijos: SelectModerno({ opciones: IDIOMAS, value: 'es' }) }),
          Campo({ label: 'Disabled', hijos: SelectModerno({ opciones: IDIOMAS, value: 'es', deshabilitado: true }) }),
          Campo({ label: 'Válido', hint: 'Selección correcta',
            hijos: SelectModerno({ opciones: IDIOMAS, value: 'es', valido: true }) }),
          Campo({ label: 'Inválido', error: 'Este campo es obligatorio',
            hijos: SelectModerno({ opciones: IDIOMAS, placeholder: 'Sin elegir', invalido: true }) }),
        ),
        codigo: `SelectModerno({ opciones: [...], deshabilitado: true })
SelectModerno({ opciones: [...], valido: true })
SelectModerno({ opciones: [...], invalido: true })`,
      })],
    }),

  ],
});
