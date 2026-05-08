import { crearEl } from '../../../utils/helpers/dom.js';
import { senal } from '../../../utils/helpers/reactive.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { Popover } from '../../../components/ui/popover/popover.js';
import { Boton } from '../../../components/ui/button/button.js';
import { Avatar } from '../../../components/ui/avatar/avatar.js';
import { Insignia } from '../../../components/ui/badge/badge.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { notificar } from '../../../components/ui/toast/toast.js';
import { corner3 } from '../../../components/ui/card/card-decoraciones.js';

const fila = (...n) => crearEl('div', {
  style: { display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', justifyContent: 'center', padding: 'var(--space-6) 0' },
}, n);

const FOTO = (n) => `./public/img/team/${n}.jpg`;

// ============================================================================
//  Cuerpos compositivos para los popovers
// ============================================================================

// Lista de opciones (mini menu)
const cuerpoMenu = (cerrarFn) => crearEl('div', {
  style: { display: 'flex', flexDirection: 'column', gap: '2px', margin: 'calc(-1 * var(--space-2)) calc(-1 * var(--space-1))' },
}, [
  ['Renombrar', 'Duplicar', 'Mover a…', 'Compartir', 'Archivar'].map((t, i) => crearEl('button', {
    type: 'button',
    style: {
      display: 'flex', alignItems: 'center', gap: '8px',
      padding: '7px 10px', background: 'transparent', border: 0,
      borderRadius: 'var(--radius-sm)', cursor: 'pointer',
      fontSize: 'var(--text-sm)', color: 'var(--foreground)',
      textAlign: 'start', fontFamily: 'inherit',
    },
    onMouseenter: (e) => { e.currentTarget.style.background = 'var(--muted)'; },
    onMouseleave: (e) => { e.currentTarget.style.background = ''; },
    onClick: () => { notificar.info(t); cerrarFn?.(); },
  }, [
    Icono(['editar', 'mas', 'flecha_r', 'subir', 'descargar'][i], { tamano: 14 }),
    crearEl('span', null, [t]),
  ])),
].flat());

// Filtros inline (form rápido)
const cuerpoFiltros = () => crearEl('div', {
  style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' },
}, [
  ['Activos', 'Archivados', 'Borrados', 'Compartidos'].map((t) => crearEl('label', {
    style: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)', cursor: 'pointer' },
  }, [
    crearEl('input', { type: 'checkbox', checked: t === 'Activos' || t === 'Compartidos' }),
    crearEl('span', null, [t]),
  ])),
].flat());

// Stats / KPI mini-card
const cuerpoStats = () => crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' } }, [
  crearEl('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' } }, [
    crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, ['Sesiones (7d)']),
    crearEl('strong', { style: { fontSize: 'var(--text-base)', fontVariantNumeric: 'tabular-nums' } }, ['12,480']),
  ]),
  crearEl('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' } }, [
    crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, ['Conversión']),
    crearEl('strong', { style: { fontSize: 'var(--text-base)', color: 'var(--color-success)' } }, ['↑ 4.78%']),
  ]),
  crearEl('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' } }, [
    crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, ['Tasa de rebote']),
    crearEl('strong', { style: { fontSize: 'var(--text-base)', color: 'var(--color-danger)' } }, ['↓ 32.1%']),
  ]),
]);

// Perfil de usuario (hover card style — Twitter / GitHub)
const cuerpoPerfil = () => crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' } }, [
  crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)' } }, [
    Avatar({ nombre: 'María García', src: FOTO(1), tamano: 'lg' }),
    crearEl('div', { style: { flex: 1, minWidth: 0 } }, [
      crearEl('strong', { style: { fontSize: 'var(--text-base)', display: 'block' } }, ['María García']),
      crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, ['@mariagarcia · Senior Designer']),
    ]),
  ]),
  crearEl('p', { style: { margin: 0, fontSize: 'var(--text-sm)', color: 'var(--foreground)', lineHeight: 1.5 } },
    ['Diseñando productos digitales que dan ganas de usar. Café, vinilos, ciclismo.']),
  crearEl('div', { style: { display: 'flex', gap: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [
    crearEl('span', null, [crearEl('strong', { style: { color: 'var(--foreground)' } }, ['1.2k']), ' seguidores']),
    crearEl('span', null, [crearEl('strong', { style: { color: 'var(--foreground)' } }, ['340']), ' siguiendo']),
  ]),
]);

// Help / FAQ inline
const cuerpoHelp = () => crearEl('div', { style: { fontSize: 'var(--text-sm)', lineHeight: 1.55, color: 'var(--foreground)' } }, [
  crearEl('p', { style: { margin: '0 0 var(--space-2)' } },
    ['Tu plan ', crearEl('strong', null, ['Pro']), ' incluye 100 GB de storage. Cuando te acerques al límite, te avisaremos por email con 7 días de anticipación.']),
  crearEl('p', { style: { margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } },
    ['¿Necesitas más? Contacta a soporte para upgradeear a Team.']),
]);

// ============================================================================
//  Página
// ============================================================================
export default async () => PaginaShowcase({
  titulo: 'Popovers',
  descripcion: 'Como tooltip pero activado por click — permite contenido rico (formularios, listas, perfiles, stats). Portaleados a `<body>`, singleton (sólo uno abierto a la vez), 4 posiciones, flecha indicadora opcional, tema claro/oscuro y footer con acciones.',
  decoracion: corner3(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    // ============== 1. BÁSICO ==============
    Seccion({
      titulo: '1 · Básico',
      descripcion: 'Un disparador (cualquier nodo) + título + contenido (string o nodo). Click en el botón abre, click fuera o ESC cierra.',
      hijos: [VistaCodigo({
        vista: fila(
          Popover({
            disparador: Boton({ texto: 'Click aquí', variante: 'primary' }),
            titulo: 'Atajos',
            contenido: 'Usa ⌘K para abrir el command palette desde cualquier página. ⌘/ para ver todos los atajos disponibles.',
          }),
        ),
        codigo: `Popover({
  disparador: Boton({ texto: 'Click aquí' }),
  titulo: 'Atajos',
  contenido: 'Usa ⌘K para abrir el command palette.',
})`,
      })],
    }),

    // ============== 2. CON FLECHA ==============
    Seccion({
      titulo: '2 · Con flecha indicadora',
      descripcion: '`flecha: true` añade un triángulo apuntando al disparador — visualmente más obvio cuál botón originó el popover. La flecha se reposiciona automáticamente cuando el popover se ajusta al viewport.',
      hijos: [VistaCodigo({
        vista: fila(
          Popover({
            disparador: Boton({ texto: 'Top + flecha',    variante: 'secondary' }),
            posicion: 'top', flecha: true,
            titulo: 'Posición top',
            contenido: 'Aparece arriba con flecha apuntando al botón.',
          }),
          Popover({
            disparador: Boton({ texto: 'Bottom + flecha', variante: 'secondary' }),
            posicion: 'bottom', flecha: true,
            titulo: 'Posición bottom',
            contenido: 'Aparece abajo con flecha apuntando al botón.',
          }),
          Popover({
            disparador: Boton({ texto: 'Left + flecha',   variante: 'secondary' }),
            posicion: 'left', flecha: true,
            contenido: 'Aparece a la izquierda con flecha.',
          }),
          Popover({
            disparador: Boton({ texto: 'Right + flecha',  variante: 'secondary' }),
            posicion: 'right', flecha: true,
            contenido: 'Aparece a la derecha con flecha.',
          }),
        ),
        codigo: `Popover({
  disparador: Boton({ texto: 'Click' }),
  posicion: 'top',                          // top | bottom | left | right
  flecha: true,                             // ← triangulito apuntando al trigger
  contenido: '...',
})`,
      })],
    }),

    // ============== 3. POSICIONES (sin flecha) ==============
    Seccion({
      titulo: '3 · 4 posiciones',
      descripcion: 'Si el popover no cabe en la posición indicada (bordes del viewport), se ajusta automáticamente al máximo permitido sin desbordar.',
      hijos: [VistaCodigo({
        vista: fila(
          Popover({ posicion: 'top',    disparador: Boton({ texto: 'Top',    variante: 'secondary' }), contenido: 'Aparece arriba del disparador.' }),
          Popover({ posicion: 'bottom', disparador: Boton({ texto: 'Bottom', variante: 'secondary' }), contenido: 'Aparece debajo.' }),
          Popover({ posicion: 'left',   disparador: Boton({ texto: 'Left',   variante: 'secondary' }), contenido: 'A la izquierda.' }),
          Popover({ posicion: 'right',  disparador: Boton({ texto: 'Right',  variante: 'secondary' }), contenido: 'A la derecha.' }),
        ),
        codigo: `Popover({ posicion: 'top'    | 'bottom' | 'left' | 'right', ... })`,
      })],
    }),

    // ============== 4. CON FOOTER (acciones) ==============
    Seccion({
      titulo: '4 · Con footer (botones de acción)',
      descripcion: 'El prop `pie` añade un footer con botones — patrón confirmación, save changes, etc. La API `_popover.cerrar()` permite cerrar desde dentro de los handlers.',
      hijos: [VistaCodigo({
        vista: (() => {
          let pop;
          const pie = crearEl('div', { style: { display: 'flex', gap: '6px' } }, [
            Boton({ texto: 'Cancelar', variante: 'ghost', tamano: 'sm', onClick: () => pop._popover.cerrar() }),
            Boton({ texto: 'Sí, eliminar', variante: 'danger', tamano: 'sm',
              onClick: () => { notificar.error('Proyecto eliminado'); pop._popover.cerrar(); } }),
          ]);
          pop = Popover({
            disparador: Boton({ texto: 'Eliminar proyecto', variante: 'danger', tamano: 'sm' }),
            posicion: 'bottom', flecha: true,
            titulo: '¿Estás seguro?',
            contenido: 'Esta acción es permanente. Perderás todos los archivos y miembros del proyecto.',
            pie,
          });
          return fila(pop);
        })(),
        codigo: `let pop;
const pie = crearEl('div', null, [
  Boton({ texto: 'Cancelar', onClick: () => pop._popover.cerrar() }),
  Boton({ texto: 'Sí, eliminar', variante: 'danger',
    onClick: () => { eliminar(); pop._popover.cerrar(); } }),
]);
pop = Popover({
  disparador: Boton({ texto: 'Eliminar', variante: 'danger' }),
  titulo: '¿Estás seguro?',
  contenido: 'Acción permanente.',
  pie,                                        // ← footer con acciones
})`,
      })],
    }),

    // ============== 5. MENU DE OPCIONES ==============
    Seccion({
      titulo: '5 · Menú de opciones',
      descripcion: 'Usar el popover como mini-menú desplegable — alternativa al `MenuDesplegable` cuando quieres más control sobre el contenido.',
      hijos: [VistaCodigo({
        vista: (() => {
          let pop;
          pop = Popover({
            disparador: Boton({ texto: 'Acciones ⋯', variante: 'secondary' }),
            posicion: 'bottom', flecha: true,
            ancho: '12rem',
            contenido: cuerpoMenu(() => pop._popover.cerrar()),
          });
          return fila(pop);
        })(),
        codigo: `Popover({
  disparador: Boton({ texto: 'Acciones ⋯' }),
  posicion: 'bottom',
  ancho: '12rem',
  contenido: crearEl('div', null, items.map(item => crearEl('button', {
    onClick: () => { item.accion(); pop._popover.cerrar(); },
  }, [Icono(item.icono), item.etiqueta]))),
})`,
      })],
    }),

    // ============== 6. FILTROS INLINE ==============
    Seccion({
      titulo: '6 · Filtros / form inline',
      descripcion: 'Para filtrar listados sin abrir un modal completo. El popover queda abierto mientras el usuario tipea/selecciona. `cerrarConClickFuera: false` evita cierres accidentales.',
      hijos: [VistaCodigo({
        vista: (() => {
          let pop;
          const pie = crearEl('div', { style: { display: 'flex', gap: '6px' } }, [
            Boton({ texto: 'Limpiar', variante: 'ghost', tamano: 'sm' }),
            Boton({ texto: 'Aplicar', variante: 'primary', tamano: 'sm',
              onClick: () => { notificar.exito('Filtros aplicados'); pop._popover.cerrar(); } }),
          ]);
          pop = Popover({
            disparador: Boton({ texto: '⏷ Filtrar', variante: 'secondary' }),
            posicion: 'bottom', flecha: true,
            ancho: '14rem',
            titulo: 'Filtrar por estado',
            contenido: cuerpoFiltros(),
            pie,
          });
          return fila(pop);
        })(),
        codigo: `Popover({
  disparador: Boton({ texto: '⏷ Filtrar' }),
  titulo: 'Filtrar por estado',
  contenido: form,                            // checkboxes, selects, etc.
  pie: [Boton('Limpiar'), Boton('Aplicar')],
})`,
      })],
    }),

    // ============== 7. STATS / MINI KPIs ==============
    Seccion({
      titulo: '7 · Stats / mini-KPIs',
      descripcion: 'Hover sobre un dato para ver el desglose. Patrón usado por dashboards (Stripe, Linear) — el popover muestra contexto sin que el usuario tenga que navegar a otra página.',
      hijos: [VistaCodigo({
        vista: fila(
          Popover({
            disparador: crearEl('button', {
              type: 'button',
              style: {
                padding: '6px 12px',
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                fontSize: 'var(--text-sm)', color: 'var(--foreground)', fontFamily: 'inherit',
              },
            }, [Icono('analitica', { tamano: 14 }), 'Ver métricas']),
            posicion: 'bottom', flecha: true,
            ancho: '18rem',
            titulo: 'Resumen de la semana',
            contenido: cuerpoStats(),
          }),
        ),
        codigo: `Popover({
  disparador: botonInline,
  titulo: 'Resumen de la semana',
  contenido: crearEl('div', null, [
    fila('Sesiones', '12,480'),
    fila('Conversión', '↑ 4.78%'),
    fila('Tasa de rebote', '↓ 32.1%'),
  ]),
})`,
      })],
    }),

    // ============== 8. PERFIL HOVER CARD ==============
    Seccion({
      titulo: '8 · Perfil de usuario (hover card)',
      descripcion: 'Click en el avatar/nombre revela info del usuario sin navegar. Patrón Twitter / GitHub / Linear.',
      hijos: [VistaCodigo({
        vista: fila(
          Popover({
            disparador: crearEl('button', {
              type: 'button',
              style: {
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '4px 10px 4px 4px',
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: '999px', cursor: 'pointer',
                fontFamily: 'inherit',
              },
            }, [
              Avatar({ nombre: 'María', src: FOTO(1), tamano: 'sm' }),
              crearEl('span', { style: { fontSize: 'var(--text-sm)', fontWeight: 600 } }, ['@mariagarcia']),
            ]),
            posicion: 'bottom', flecha: true,
            ancho: '20rem',
            contenido: cuerpoPerfil(),
            pie: crearEl('div', { style: { display: 'flex', gap: '6px', flex: 1 } }, [
              Boton({ texto: 'Mensaje', variante: 'ghost',   tamano: 'sm' }),
              Boton({ texto: 'Seguir',  variante: 'primary', tamano: 'sm' }),
            ]),
          }),
        ),
        codigo: `Popover({
  disparador: botonAvatar,
  ancho: '20rem',
  contenido: crearEl('div', null, [
    crearEl('div', null, [Avatar(...), nombre + handle]),
    crearEl('p', null, [bio]),
    statsLinea,
  ]),
  pie: [Boton('Mensaje'), Boton('Seguir')],
})`,
      })],
    }),

    // ============== 9. HELP / TOOLTIP RICO ==============
    Seccion({
      titulo: '9 · Help / explicación contextual',
      descripcion: 'Un icono ⓘ junto a un campo o métrica que abre explicación. Mejor que un tooltip cuando el texto es largo o tiene formato.',
      hijos: [VistaCodigo({
        vista: fila(
          crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)' } }, [
            crearEl('span', null, ['Storage usado: 78 GB / 100 GB']),
            Popover({
              disparador: crearEl('button', {
                type: 'button',
                'aria-label': 'Ayuda',
                style: {
                  width: '20px', height: '20px',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  background: 'transparent', border: 0, padding: 0,
                  borderRadius: '50%', cursor: 'pointer',
                  color: 'var(--muted-foreground)',
                },
              }, [Icono('info', { tamano: 16 })]),
              posicion: 'right', flecha: true,
              ancho: '18rem',
              titulo: '¿Cómo se calcula?',
              contenido: cuerpoHelp(),
            }),
          ]),
        ),
        codigo: `crearEl('div', null, [
  crearEl('span', null, ['Storage usado: 78 GB / 100 GB']),
  Popover({
    disparador: iconoInfo,                    // botón circular con ⓘ
    posicion: 'right',
    titulo: '¿Cómo se calcula?',
    contenido: explicacionLarga,
  }),
])`,
      })],
    }),

    // ============== 10. TEMA OSCURO ==============
    Seccion({
      titulo: '10 · Tema oscuro forzado',
      descripcion: '`tema: oscuro` invierte el popover (negro sobre claro o claro sobre claro). Útil para popovers sobre fondos coloreados (hero gradients, banners) donde el tema claro no contrasta bien.',
      hijos: [VistaCodigo({
        vista: crearEl('div', {
          style: {
            padding: 'var(--space-6) 0',
            display: 'flex', justifyContent: 'center', gap: 'var(--space-3)', flexWrap: 'wrap',
            background: 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 12%, transparent), color-mix(in srgb, #8b5cf6 12%, transparent))',
            borderRadius: 'var(--radius-md)',
          },
        }, [
          Popover({
            disparador: Boton({ texto: 'Tema claro', variante: 'secondary' }),
            posicion: 'bottom', flecha: true,
            titulo: 'Default',
            contenido: 'Popover con tema claro estándar.',
          }),
          Popover({
            disparador: Boton({ texto: 'Tema oscuro', variante: 'primary' }),
            posicion: 'bottom', flecha: true, tema: 'oscuro',
            titulo: 'Inverso',
            contenido: 'Popover con tema oscuro forzado — útil sobre fondos coloreados.',
          }),
        ]),
        codigo: `Popover({
  disparador, contenido,
  tema: 'oscuro',                             // 'claro' (default) | 'oscuro'
})`,
      })],
    }),

    // ============== 11. ANCHO CUSTOM ==============
    Seccion({
      titulo: '11 · Ancho personalizado',
      descripcion: '`ancho` override del min/max-width default (14rem-22rem). Para contenido que necesita más espacio (formularios, tablas mini, listas largas).',
      hijos: [VistaCodigo({
        vista: fila(
          Popover({
            disparador: Boton({ texto: 'Estrecho (12rem)', variante: 'secondary' }),
            posicion: 'bottom', ancho: '12rem',
            contenido: 'Popover compacto.',
          }),
          Popover({
            disparador: Boton({ texto: 'Default', variante: 'secondary' }),
            posicion: 'bottom',
            contenido: 'Popover con ancho default (14-22rem).',
          }),
          Popover({
            disparador: Boton({ texto: 'Ancho (28rem)', variante: 'secondary' }),
            posicion: 'bottom', ancho: '28rem',
            contenido: 'Popover ancho — útil para formularios o listas largas que requieren más espacio horizontal sin desbordar a varias líneas.',
          }),
        ),
        codigo: `Popover({ ancho: '12rem',  ... })   // estrecho
Popover({                ... })   // default · 14-22rem
Popover({ ancho: '28rem', ... })  // ancho`,
      })],
    }),

  ],
});
