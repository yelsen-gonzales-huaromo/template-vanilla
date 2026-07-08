import { crearEl } from '../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { ListaGrupo } from '../../../components/ui/list-group/list-group.js';
import { Insignia } from '../../../components/ui/badge/badge.js';
import { Avatar } from '../../../components/ui/avatar/avatar.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { Boton } from '../../../components/ui/button/button.js';
import { corner2 } from '../../../components/ui/card/card-decoraciones.js';

// ============================================================================
//  Helpers locales — layouts para el contenido de cada item
// ============================================================================
const fila = (etq, badge) => crearEl('span', {
  style: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', width: '100%', justifyContent: 'space-between' },
}, [crearEl('span', null, [etq]), badge]);

const itemConfig = ({ icono, color, titulo, sub, accion }) => crearEl('div', { class: 'lg-item-config' }, [
  crearEl('div', {
    class: 'lg-item-config__icono',
    style: {
      background: `color-mix(in srgb, var(--color-${color}) 14%, transparent)`,
      color: `var(--color-${color})`,
    },
  }, [Icono(icono, { tamano: 18 })]),
  crearEl('div', { class: 'lg-item-config__textos' }, [
    crearEl('span', { class: 'lg-item-config__titulo' }, [titulo]),
    crearEl('span', { class: 'lg-item-config__sub' }, [sub]),
  ]),
  accion,
]);

const itemMensaje = ({ avatar, autor, asunto, preview, tiempo, noLeido }) => crearEl('div', {
  class: ['lg-mensaje', noLeido && 'lg-mensaje--no-leido'],
}, [
  Avatar({ nombre: autor, src: avatar, tamano: 'md' }),
  crearEl('div', { class: 'lg-mensaje__cuerpo' }, [
    crearEl('div', { class: 'lg-mensaje__cabezal' }, [
      crearEl('span', { class: 'lg-mensaje__autor' }, [autor]),
      crearEl('span', { class: 'lg-mensaje__tiempo' }, [tiempo]),
    ]),
    asunto && crearEl('span', {
      style: { fontSize: 'var(--text-sm)', fontWeight: noLeido ? 600 : 500, color: 'var(--foreground)' },
    }, [asunto]),
    crearEl('span', { class: 'lg-mensaje__preview' }, [preview]),
  ]),
  noLeido && crearEl('span', { class: 'lg-mensaje__dot', 'aria-label': 'No leído' }),
]);

const itemMiembro = ({ nombre, rol, estado, accion }) => crearEl('div', { class: 'lg-miembro' }, [
  crearEl('div', { class: 'lg-miembro__avatar', 'data-estado': estado || null }, [
    Avatar({ nombre, tamano: 'md' }),
  ]),
  crearEl('div', { class: 'lg-miembro__cuerpo' }, [
    crearEl('span', { class: 'lg-miembro__nombre' }, [nombre]),
    crearEl('span', { class: 'lg-miembro__rol' }, [rol]),
  ]),
  accion,
]);

const itemArchivo = ({ tipo, nombre, tamano, fecha, accion }) => crearEl('div', { class: 'lg-archivo' }, [
  crearEl('div', { class: 'lg-archivo__icono', 'data-tipo': tipo }, [tipo]),
  crearEl('div', { class: 'lg-archivo__cuerpo' }, [
    crearEl('span', { class: 'lg-archivo__nombre' }, [nombre]),
    crearEl('span', { class: 'lg-archivo__meta' }, [`${tamano} · ${fecha}`]),
  ]),
  accion,
]);

const itemTarea = ({ texto, hecha, prioridad, fecha }) => {
  const cb = crearEl('input', {
    type: 'checkbox', class: 'lg-tarea__check',
    checked: hecha ? 'checked' : null,
    onChange: (e) => {
      const span = e.currentTarget.parentElement.querySelector('.lg-tarea__texto');
      span.classList.toggle('lg-tarea__texto--hecho', e.currentTarget.checked);
    },
  });
  return crearEl('div', { class: 'lg-tarea' }, [
    cb,
    crearEl('span', {
      class: ['lg-tarea__texto', hecha && 'lg-tarea__texto--hecho'],
    }, [texto]),
    prioridad && Insignia({ texto: prioridad,
      variante: prioridad === 'Alta' ? 'danger' : prioridad === 'Media' ? 'warning' : 'muted' }),
    fecha && crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [fecha]),
  ]);
};

const itemRanking = ({ pos, titulo, sub, valor }) => crearEl('div', {
  class: 'lg-ranking', 'data-top': pos <= 3 ? String(pos) : null,
}, [
  crearEl('span', { class: 'lg-ranking__pos' }, [String(pos)]),
  crearEl('div', { class: 'lg-ranking__cuerpo' }, [
    crearEl('span', { class: 'lg-ranking__titulo' }, [titulo]),
    crearEl('span', { class: 'lg-ranking__sub' }, [sub]),
  ]),
  crearEl('span', { class: 'lg-ranking__valor' }, [valor]),
]);

const itemServicio = ({ nombre, estado, uptime }) => crearEl('div', { class: 'lg-servicio' }, [
  crearEl('span', { class: 'lg-servicio__dot', 'data-estado': estado }),
  crearEl('span', { class: 'lg-servicio__nombre' }, [nombre]),
  crearEl('span', { class: 'lg-servicio__uptime' }, [uptime]),
]);

const botonIcono = (nombre, etiqueta = '') => crearEl('button', {
  type: 'button', 'aria-label': etiqueta,
  style: {
    width: '32px', height: '32px',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    background: 'transparent', border: 0,
    borderRadius: 'var(--radius-sm)',
    color: 'var(--muted-foreground)', cursor: 'pointer',
  },
  onClick: (e) => e.stopPropagation(),
}, [Icono(nombre, { tamano: 16 })]);

// ============================================================================
//  Página
// ============================================================================
export default async () => PaginaShowcase({
  titulo: 'Lista de grupo',
  descripcion: 'Lista vertical de items relacionados con divisores. Soporta items clickeables, item activo, headers de sección, badges, variantes (`flush`, `cards`) y tamaños. El `contenido` acepta cualquier nodo — total libertad de layout interno.',
  decoracion: corner2(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    // ============== 1. BÁSICA ==============
    Seccion({
      titulo: 'Básica',
      descripcion: 'Items simples con divisores. El primer caso de uso — listas de lectura sin interacción.',
      hijos: [VistaCodigo({
        vista: ListaGrupo({ items: [
          { contenido: 'Cras justo odio' },
          { contenido: 'Dapibus ac facilisis in' },
          { contenido: 'Morbi leo risus' },
          { contenido: 'Porta ac consectetur ac' },
          { contenido: 'Vestibulum at eros' },
        ]}),
        codigo: `ListaGrupo({ items: [
  { contenido: 'Cras justo odio' },
  { contenido: 'Dapibus ac facilisis in' },
  { contenido: 'Morbi leo risus' },
]})`,
      })],
    }),

    // ============== 2. CON ITEM ACTIVO + CLICKEABLES (sidebar) ==============
    Seccion({
      titulo: 'Item activo + clickeables (sidebar)',
      descripcion: 'Patrón clásico de navegación — el item con `activo: true` se resalta. `alClick` marca el item como clickeable (cursor + hover).',
      hijos: [VistaCodigo({
        vista: ListaGrupo({ items: [
          { contenido: 'Inicio',     activo: true, alClick: () => {} },
          { contenido: 'Bandeja',    alClick: () => {} },
          { contenido: 'Enviados',   alClick: () => {} },
          { contenido: 'Borradores', alClick: () => {} },
          { contenido: 'Papelera',   alClick: () => {} },
        ]}),
        codigo: `ListaGrupo({ items: [
  { contenido: 'Inicio',     activo: true, alClick: () => {} },
  { contenido: 'Bandeja',    alClick: () => {} },
  { contenido: 'Enviados',   alClick: () => {} },
]})`,
      })],
    }),

    // ============== 3. CON BADGES (counts) ==============
    Seccion({
      titulo: 'Con badges (contadores)',
      descripcion: 'Etiqueta + count en el extremo derecho. Patrón típico para inbox, tags, categorías.',
      hijos: [VistaCodigo({
        vista: ListaGrupo({ items: [
          { contenido: fila('Inbox',      Insignia({ texto: '14',  variante: 'primary' })), alClick: () => {} },
          { contenido: fila('Pendientes', Insignia({ texto: '3',   variante: 'warning' })), alClick: () => {} },
          { contenido: fila('Archivados', Insignia({ texto: '120', variante: 'muted' })),   alClick: () => {} },
          { contenido: fila('Spam',       Insignia({ texto: '!',   variante: 'danger' })),  alClick: () => {} },
        ]}),
        codigo: `ListaGrupo({ items: [
  { contenido: fila('Inbox',      Insignia({ texto: '14', variante: 'primary' })) },
  { contenido: fila('Pendientes', Insignia({ texto: '3',  variante: 'warning' })) },
  { contenido: fila('Archivados', Insignia({ texto: '120', variante: 'muted' })) },
]})`,
      })],
    }),

    // ============== 4. CON ICONO + DESCRIPCIÓN (settings) ==============
    Seccion({
      titulo: 'Con icono + descripción (configuración)',
      descripcion: 'Cada fila lleva icono coloreado, título y subtítulo. Útil para páginas de settings, integraciones, módulos disponibles.',
      hijos: [VistaCodigo({
        vista: ListaGrupo({ items: [
          { contenido: itemConfig({
            icono: 'campana', color: 'primary',
            titulo: 'Notificaciones',
            sub: 'Email, push y SMS — configura qué eventos te alertan',
            accion: Icono('chevron_r', { tamano: 16 }),
          }), alClick: () => {} },
          { contenido: itemConfig({
            icono: 'seguridad', color: 'success',
            titulo: 'Privacidad y seguridad',
            sub: '2FA, sesiones activas, datos personales',
            accion: Icono('chevron_r', { tamano: 16 }),
          }), alClick: () => {} },
          { contenido: itemConfig({
            icono: 'precios', color: 'warning',
            titulo: 'Facturación',
            sub: 'Plan actual, métodos de pago, historial de facturas',
            accion: Icono('chevron_r', { tamano: 16 }),
          }), alClick: () => {} },
          { contenido: itemConfig({
            icono: 'utilidades', color: 'info',
            titulo: 'Integraciones',
            sub: 'Slack, GitHub, Linear, Notion y más',
            accion: Icono('chevron_r', { tamano: 16 }),
          }), alClick: () => {} },
          { contenido: itemConfig({
            icono: 'alerta', color: 'danger',
            titulo: 'Eliminar cuenta',
            sub: 'Acción permanente — borra todos tus proyectos y datos',
            accion: Icono('chevron_r', { tamano: 16 }),
          }), alClick: () => {} },
        ]}),
        codigo: `ListaGrupo({ items: [
  { contenido: itemConfig({
      icono: 'campana', color: 'primary',
      titulo: 'Notificaciones',
      sub: 'Email, push y SMS …',
      accion: Icono('chevron_r'),
    }), alClick: () => {} },
  // ...
]})`,
      })],
    }),

    // ============== 5. BANDEJA DE MENSAJES ==============
    Seccion({
      titulo: 'Bandeja de mensajes',
      descripcion: 'Avatar + remitente + asunto + preview + tiempo + dot azul si no leído. Patrón Gmail/Linear/Slack.',
      hijos: [VistaCodigo({
        vista: ListaGrupo({ items: [
          { contenido: itemMensaje({
            autor: 'Emma Watson', noLeido: true,
            asunto: 'Re: Propuesta de diseño',
            preview: 'Excelente trabajo en los mockups, una sola pregunta sobre el flujo de checkout…',
            tiempo: 'Hace 2 min',
          }), alClick: () => {} },
          { contenido: itemMensaje({
            autor: 'Albert Brooks', noLeido: true,
            asunto: 'Reunión semanal — agenda',
            preview: 'Hola equipo, mañana revisaremos los KPIs del Q2 y la roadmap del Q3…',
            tiempo: 'Hace 1 h',
          }), alClick: () => {} },
          { contenido: itemMensaje({
            autor: 'GitHub',
            asunto: '[template-vanilla] Pull request #142 abierto',
            preview: 'feat(carousel): add dynamic heights and gallery variant',
            tiempo: 'Hace 3 h',
          }), alClick: () => {} },
          { contenido: itemMensaje({
            autor: 'María García',
            asunto: 'Aprobación de presupuesto Q3',
            preview: 'Revisé los números con finance — todo aprobado para arrancar el lunes',
            tiempo: 'Ayer',
          }), alClick: () => {} },
          { contenido: itemMensaje({
            autor: 'Linear',
            asunto: 'LAU-234 asignada a ti',
            preview: 'Implement dropdown selector in dashboard filters',
            tiempo: '2 días',
          }), alClick: () => {} },
        ]}),
        codigo: `ListaGrupo({ items: [
  { contenido: itemMensaje({
      autor: 'Emma Watson',
      asunto: 'Re: Propuesta de diseño',
      preview: 'Excelente trabajo en los mockups…',
      tiempo: 'Hace 2 min',
      noLeido: true,
    }), alClick: () => abrirHilo() },
  // ...
]})`,
      })],
    }),

    // ============== 6. LISTA DE MIEMBROS ==============
    Seccion({
      titulo: 'Equipo / miembros con estado',
      descripcion: 'Avatar con dot de estado (online/ausente/ocupado/offline) + nombre + rol + acción rápida. Patrón Slack/Discord.',
      hijos: [VistaCodigo({
        vista: ListaGrupo({ items: [
          { header: 'En línea (3)' },
          { contenido: itemMiembro({
            nombre: 'Sara Chen', rol: 'Product Designer · Diseño',
            estado: 'online',
            accion: Boton({ texto: 'Mensaje', variante: 'ghost', tamano: 'sm' }),
          }), alClick: () => {} },
          { contenido: itemMiembro({
            nombre: 'Marcus Lee', rol: 'Senior Engineer · Backend',
            estado: 'online',
            accion: Boton({ texto: 'Mensaje', variante: 'ghost', tamano: 'sm' }),
          }), alClick: () => {} },
          { contenido: itemMiembro({
            nombre: 'Priya Patel', rol: 'Engineering Manager',
            estado: 'ocupado',
            accion: Boton({ texto: 'Mensaje', variante: 'ghost', tamano: 'sm' }),
          }), alClick: () => {} },
          { header: 'Ausentes (2)' },
          { contenido: itemMiembro({
            nombre: 'Jorge Ramírez', rol: 'iOS Developer',
            estado: 'ausente',
            accion: Boton({ texto: 'Mensaje', variante: 'ghost', tamano: 'sm' }),
          }), alClick: () => {} },
          { contenido: itemMiembro({
            nombre: 'Lina Kowalski', rol: 'Data Analyst',
            estado: 'offline',
            accion: Boton({ texto: 'Mensaje', variante: 'ghost', tamano: 'sm' }),
          }), alClick: () => {} },
        ]}),
        codigo: `ListaGrupo({ items: [
  { header: 'En línea (3)' },                        // separador con label
  { contenido: itemMiembro({
      nombre: 'Sara Chen', rol: 'Product Designer',
      estado: 'online',                              // online | ausente | ocupado | offline
      accion: Boton({ texto: 'Mensaje', variante: 'ghost' }),
    }), alClick: () => {} },
  // ...
]})`,
      })],
    }),

    // ============== 7. ARCHIVOS ==============
    Seccion({
      titulo: 'Archivos / documentos',
      descripcion: 'Icono coloreado por tipo + nombre + meta (tamaño · fecha) + acción descargar. Para drives, gestores documentales.',
      hijos: [VistaCodigo({
        vista: ListaGrupo({
          variante: 'cards',
          items: [
            { contenido: itemArchivo({
              tipo: 'pdf', nombre: 'Propuesta-2026-Q3.pdf',
              tamano: '2.4 MB', fecha: 'Hace 2 horas',
              accion: botonIcono('descargar', 'Descargar'),
            }), alClick: () => {} },
            { contenido: itemArchivo({
              tipo: 'doc', nombre: 'Roadmap-engineering.docx',
              tamano: '480 KB', fecha: 'Ayer',
              accion: botonIcono('descargar', 'Descargar'),
            }), alClick: () => {} },
            { contenido: itemArchivo({
              tipo: 'xls', nombre: 'KPIs-Q2-final.xlsx',
              tamano: '1.2 MB', fecha: 'Hace 3 días',
              accion: botonIcono('descargar', 'Descargar'),
            }), alClick: () => {} },
            { contenido: itemArchivo({
              tipo: 'img', nombre: 'mockup-dashboard-v3.png',
              tamano: '3.8 MB', fecha: 'Hace 1 semana',
              accion: botonIcono('descargar', 'Descargar'),
            }), alClick: () => {} },
            { contenido: itemArchivo({
              tipo: 'zip', nombre: 'template-vanilla-assets.zip',
              tamano: '24.6 MB', fecha: 'Hace 2 semanas',
              accion: botonIcono('descargar', 'Descargar'),
            }), alClick: () => {} },
          ],
        }),
        codigo: `ListaGrupo({
  variante: 'cards',                          // cada item con su propio borde
  items: [
    { contenido: itemArchivo({
        tipo: 'pdf',                          // pdf | doc | xls | img | zip
        nombre: 'Propuesta-2026-Q3.pdf',
        tamano: '2.4 MB', fecha: 'Hace 2 horas',
        accion: botonIcono('descargar'),
      }), alClick: () => {} },
    // ...
  ],
})`,
      })],
    }),

    // ============== 8. TAREAS / CHECKLIST ==============
    Seccion({
      titulo: 'Checklist / tareas',
      descripcion: 'Checkbox + tarea + prioridad + fecha. El check tacha el texto al click. Patrón Things/Todoist.',
      hijos: [VistaCodigo({
        vista: ListaGrupo({ items: [
          { contenido: itemTarea({ texto: 'Revisar mockups del flujo de onboarding',
            prioridad: 'Alta', fecha: 'Hoy' }) },
          { contenido: itemTarea({ texto: 'Aprobar la propuesta de diseño del Q3',
            prioridad: 'Alta', fecha: 'Mañana' }) },
          { contenido: itemTarea({ texto: 'Sincronizar con el equipo de backend',
            prioridad: 'Media', fecha: 'Miércoles' }) },
          { contenido: itemTarea({ texto: 'Escribir la postmortem del incidente del lunes',
            hecha: true, prioridad: 'Media', fecha: 'Vie' }) },
          { contenido: itemTarea({ texto: 'Responder los emails pendientes',
            hecha: true, prioridad: 'Baja' }) },
          { contenido: itemTarea({ texto: 'Pedir feedback al equipo de soporte',
            prioridad: 'Baja' }) },
        ]}),
        codigo: `ListaGrupo({ items: [
  { contenido: itemTarea({
      texto: 'Revisar mockups del onboarding',
      prioridad: 'Alta',                    // Alta | Media | Baja
      fecha: 'Hoy',
    }) },
  { contenido: itemTarea({
      texto: 'Sincronizar con backend',
      hecha: true,                          // tachado al cargar
      prioridad: 'Media',
    }) },
]})`,
      })],
    }),

    // ============== 9. RANKING (TOP 10) ==============
    Seccion({
      titulo: 'Ranking — Top tracks (Spotify-style)',
      descripcion: 'Posición numerada con medalla en top 3 (oro/plata/bronce) + título + sub + valor. Patrón típico de música, videojuegos, leaderboards.',
      hijos: [VistaCodigo({
        vista: ListaGrupo({ items: [
          { contenido: itemRanking({ pos: 1, titulo: 'Bohemian Rhapsody',  sub: 'Queen',           valor: '2.4B' }) },
          { contenido: itemRanking({ pos: 2, titulo: 'Stairway to Heaven', sub: 'Led Zeppelin',    valor: '1.8B' }) },
          { contenido: itemRanking({ pos: 3, titulo: 'Hotel California',   sub: 'Eagles',          valor: '1.5B' }) },
          { contenido: itemRanking({ pos: 4, titulo: 'Sweet Child o Mine', sub: 'Guns N\' Roses',  valor: '1.3B' }) },
          { contenido: itemRanking({ pos: 5, titulo: 'Smells Like Teen Spirit', sub: 'Nirvana',    valor: '1.2B' }) },
          { contenido: itemRanking({ pos: 6, titulo: 'Imagine',             sub: 'John Lennon',    valor: '980M' }) },
          { contenido: itemRanking({ pos: 7, titulo: 'Billie Jean',         sub: 'Michael Jackson',valor: '870M' }) },
        ]}),
        codigo: `ListaGrupo({ items: [
  { contenido: itemRanking({
      pos: 1,                                // 1, 2, 3 reciben medalla
      titulo: 'Bohemian Rhapsody', sub: 'Queen',
      valor: '2.4B',
    }) },
  // ...
]})`,
      })],
    }),

    // ============== 10. ESTADO DE SERVICIOS ==============
    Seccion({
      titulo: 'Estado de servicios (status page)',
      descripcion: 'Dot coloreado con halo + nombre + uptime. Verde (ok), naranja (warn), rojo (down). Patrón status.example.com.',
      hijos: [VistaCodigo({
        vista: ListaGrupo({ items: [
          { contenido: itemServicio({ nombre: 'API Core',       estado: 'ok',   uptime: '99.99% · 90 días' }) },
          { contenido: itemServicio({ nombre: 'API Auth',       estado: 'ok',   uptime: '99.97% · 90 días' }) },
          { contenido: itemServicio({ nombre: 'Web Dashboard',  estado: 'ok',   uptime: '99.99% · 90 días' }) },
          { contenido: itemServicio({ nombre: 'CDN Assets',     estado: 'warn', uptime: '99.42% · 90 días — degradado' }) },
          { contenido: itemServicio({ nombre: 'Email outbound', estado: 'down', uptime: '97.21% · 90 días — caído' }) },
          { contenido: itemServicio({ nombre: 'Webhooks',       estado: 'ok',   uptime: '99.95% · 90 días' }) },
          { contenido: itemServicio({ nombre: 'Search index',   estado: 'ok',   uptime: '100.00% · 90 días' }) },
        ]}),
        codigo: `ListaGrupo({ items: [
  { contenido: itemServicio({ nombre: 'API Core', estado: 'ok',   uptime: '99.99%' }) },
  { contenido: itemServicio({ nombre: 'CDN',       estado: 'warn', uptime: '99.42% — degradado' }) },
  { contenido: itemServicio({ nombre: 'Email',     estado: 'down', uptime: '97.21% — caído' }) },
]})`,
      })],
    }),

    // ============== 11. VARIANTE FLUSH (sin bordes externos) ==============
    Seccion({
      titulo: 'Variante `flush` (sin bordes externos)',
      descripcion: 'Encaja en sidebars y dentro de cards donde el contenedor ya tiene su propio borde.',
      hijos: [VistaCodigo({
        vista: crearEl('div', {
          style: {
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', padding: 'var(--space-2)',
            maxWidth: '320px',
          },
        }, [
          ListaGrupo({
            variante: 'flush',
            items: [
              { contenido: 'Dashboard', activo: true, alClick: () => {} },
              { contenido: 'Proyectos',                alClick: () => {} },
              { contenido: 'Equipo',                   alClick: () => {} },
              { contenido: 'Configuración',            alClick: () => {} },
            ],
          }),
        ]),
        codigo: `// Encaja dentro de un card o sidebar (el padre ya tiene borde)
ListaGrupo({
  variante: 'flush',                        // sin border ni radius del contenedor
  items: [
    { contenido: 'Dashboard', activo: true, alClick: () => {} },
    { contenido: 'Proyectos',               alClick: () => {} },
    { contenido: 'Equipo',                  alClick: () => {} },
  ],
})`,
      })],
    }),

  ],
});
