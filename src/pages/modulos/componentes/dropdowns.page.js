import { crearEl } from '../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { MenuDesplegable } from '../../../components/ui/dropdown/dropdown.js';
import { Boton } from '../../../components/ui/button/button.js';
import { Avatar } from '../../../components/ui/avatar/avatar.js';
import { Insignia } from '../../../components/ui/badge/badge.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { notificar } from '../../../components/ui/toast/toast.js';
import { corner1 } from '../../../components/ui/card/card-decoraciones.js';

// ============================================================================
//  Helpers locales
// ============================================================================
const fila = (...nodos) => crearEl('div', {
  style: { display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' },
}, nodos);

// Botón sólo-icono (kebab/3-puntos)
const botonIcono = (nombreIcono, etiquetaAria = 'Más opciones') => crearEl('button', {
  type: 'button',
  'aria-label': etiquetaAria,
  style: {
    width: '36px', height: '36px',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    background: 'transparent', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    color: 'var(--foreground)', cursor: 'pointer',
  },
}, [Icono(nombreIcono, { tamano: 16 })]);

// Item con avatar (para notificaciones y miembros)
const itemAvatar = ({ nombre, src, mensaje, tiempo, noLeida, alClick }) => crearEl('button', {
  type: 'button',
  class: ['dropdown__item-avatar', noLeida && 'dropdown__item-avatar--no-leida'],
  onClick: alClick,
}, [
  Avatar({ nombre, src, tamano: 'sm' }),
  crearEl('div', { class: 'dropdown__item-avatar__cuerpo' }, [
    crearEl('div', { class: 'dropdown__item-avatar__texto' }, mensaje),
    crearEl('span', { class: 'dropdown__item-avatar__tiempo' }, [tiempo]),
  ]),
]);

// ============================================================================
//  1. BÁSICO — acciones contextuales
// ============================================================================
const ejemploBasico = () => fila(
  MenuDesplegable({
    disparador: Boton({ texto: 'Acciones', variante: 'primary',
      iconoDerecha: Icono('chevron_d', { tamano: 14 }) }),
    items: [
      { etiqueta: 'Ver detalles', icono: Icono('ojo',     { tamano: 16 }), alSeleccionar: () => notificar.info('Ver detalles') },
      { etiqueta: 'Editar',       icono: Icono('editar',  { tamano: 16 }), alSeleccionar: () => notificar.info('Editar') },
      { etiqueta: 'Duplicar',     icono: Icono('mas',     { tamano: 16 }), alSeleccionar: () => notificar.info('Duplicar') },
      { etiqueta: 'Compartir',    icono: Icono('subir',   { tamano: 16 }), alSeleccionar: () => notificar.info('Compartir') },
      { separador: true },
      { etiqueta: 'Eliminar', peligro: true, icono: Icono('papelera', { tamano: 16 }),
        alSeleccionar: () => notificar.error('Eliminado') },
    ],
  }),
);

// ============================================================================
//  2. CON DESCRIPCIÓN Y ATAJOS (Linear / Notion style)
// ============================================================================
const ejemploAtajos = () => fila(
  MenuDesplegable({
    ancho: '20rem',
    disparador: Boton({ texto: 'Insertar', variante: 'secondary',
      iconoDerecha: Icono('chevron_d', { tamano: 14 }) }),
    items: [
      { grupo: 'Bloques' },
      { etiqueta: 'Texto', descripcion: 'Párrafo simple',
        icono: Icono('texto_aa', { tamano: 16 }), atajo: 'Ctrl T',
        alSeleccionar: () => notificar.info('Texto') },
      { etiqueta: 'Encabezado', descripcion: 'Título de sección',
        icono: Icono('formularios', { tamano: 16 }), atajo: 'Ctrl H',
        alSeleccionar: () => notificar.info('Encabezado') },
      { etiqueta: 'Lista', descripcion: 'Items con bullet',
        icono: Icono('densidad', { tamano: 16 }), atajo: 'Ctrl L',
        alSeleccionar: () => notificar.info('Lista') },
      { separador: true },
      { grupo: 'Multimedia' },
      { etiqueta: 'Imagen', descripcion: 'JPG, PNG, GIF, WebP',
        icono: Icono('iconos', { tamano: 16 }), atajo: 'Ctrl I',
        alSeleccionar: () => notificar.info('Imagen') },
      { etiqueta: 'Vídeo', descripcion: 'YouTube, Vimeo o subir',
        icono: Icono('proyectos', { tamano: 16 }), deshabilitado: true,
        alSeleccionar: () => {} },
    ],
  }),
);

// ============================================================================
//  3. SOLO ICONO — kebab (3 puntos verticales / horizontales)
// ============================================================================
const ejemploKebab = () => fila(
  // 3 puntos verticales (kebab)
  MenuDesplegable({
    disparador: botonIcono('chevron_v', 'Más acciones'),
    items: [
      { etiqueta: 'Marcar como favorito', icono: Icono('estrella',  { tamano: 16 }), alSeleccionar: () => notificar.info('Marcado') },
      { etiqueta: 'Archivar',             icono: Icono('descargar', { tamano: 16 }), alSeleccionar: () => notificar.info('Archivado') },
      { etiqueta: 'Reportar',             icono: Icono('alerta',    { tamano: 16 }), alSeleccionar: () => notificar.advertencia('Reportado') },
      { separador: true },
      { etiqueta: 'Eliminar', peligro: true,
        icono: Icono('papelera', { tamano: 16 }),
        alSeleccionar: () => notificar.error('Eliminado') },
    ],
  }),
  // Botón "..." horizontal
  MenuDesplegable({
    disparador: botonIcono('utilidades', 'Opciones'),
    items: [
      { etiqueta: 'Exportar PDF',    icono: Icono('descargar', { tamano: 16 }) },
      { etiqueta: 'Exportar CSV',    icono: Icono('descargar', { tamano: 16 }) },
      { etiqueta: 'Exportar JSON',   icono: Icono('descargar', { tamano: 16 }) },
    ],
  }),
);

// ============================================================================
//  4. PERFIL DE USUARIO (estilo Vercel / GitHub)
// ============================================================================
const ejemploPerfil = () => {
  const encabezado = crearEl('div', { class: 'dropdown__user-card' }, [
    Avatar({ nombre: 'María García', tamano: 'md' }),
    crearEl('div', { class: 'dropdown__user-text' }, [
      crearEl('strong', null, ['María García']),
      crearEl('span', null, ['maria@launchpad.dev']),
    ]),
  ]);
  const pie = crearEl('div', { class: 'dropdown__pie' }, [
    'Versión 1.0.0 · ',
    crearEl('a', { href: '#' }, ['Notas de versión']),
  ]);
  return fila(
    MenuDesplegable({
      ancho: '17rem',
      encabezado,
      pie,
      disparador: crearEl('button', {
        type: 'button',
        style: {
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '4px 10px 4px 4px', background: 'var(--surface)',
          border: '1px solid var(--border)', borderRadius: '999px',
          cursor: 'pointer',
        },
      }, [
        Avatar({ nombre: 'María García', tamano: 'sm' }),
        crearEl('span', { style: { fontSize: 'var(--text-sm)', fontWeight: 600 } }, ['María']),
        Icono('chevron_d', { tamano: 14 }),
      ]),
      items: [
        { separador: true },
        { etiqueta: 'Mi perfil',     icono: Icono('perfil',       { tamano: 16 }), atajo: '⌘P' },
        { etiqueta: 'Configuración', icono: Icono('utilidades',   { tamano: 16 }), atajo: '⌘,' },
        { etiqueta: 'Equipo',        icono: Icono('grupos',       { tamano: 16 }) },
        { etiqueta: 'Facturación',   icono: Icono('precios',      { tamano: 16 }) },
        { separador: true },
        { etiqueta: 'Centro de ayuda', icono: Icono('faq',        { tamano: 16 }) },
        { etiqueta: 'Atajos',          icono: Icono('utilidades', { tamano: 16 }), atajo: '?' },
        { separador: true },
        { etiqueta: 'Cerrar sesión', icono: Icono('cerrar_sesion', { tamano: 16 }), peligro: true,
          alSeleccionar: () => notificar.info('Sesión cerrada') },
      ],
    }),
  );
};

// ============================================================================
//  5. SELECTOR CON CHECK (radio — ordenar por)
// ============================================================================
const ejemploSelectorOrden = () => {
  const orden = senal('reciente');
  const opciones = [
    { id: 'reciente',   etiqueta: 'Más reciente primero' },
    { id: 'antiguo',    etiqueta: 'Más antiguo primero' },
    { id: 'alfabetico', etiqueta: 'Alfabético (A → Z)' },
    { id: 'precio_asc', etiqueta: 'Precio ascendente' },
    { id: 'precio_desc', etiqueta: 'Precio descendente' },
  ];

  // Construimos dinámicamente — al cambiar la senal, el menú próximo abre con
  // el seleccionado actualizado. (Usamos una factoría que se invoca al render).
  const construir = () => MenuDesplegable({
    ancho: '15rem',
    disparador: Boton({
      texto: `Ordenar: ${opciones.find((o) => o.id === orden.value).etiqueta}`,
      variante: 'secondary',
      iconoDerecha: Icono('chevron_d', { tamano: 14 }),
    }),
    items: [
      { grupo: 'Ordenar por' },
      ...opciones.map((o) => ({
        etiqueta: o.etiqueta,
        seleccionado: orden.value === o.id,
        alSeleccionar: () => {
          orden.value = o.id;
          // Re-render: reemplazamos el wrapper para que el botón muestre el nuevo texto
          const nuevo = construir();
          host.replaceWith(nuevo);
          host = nuevo;
        },
      })),
    ],
  });
  let host = construir();
  return fila(host);
};

// ============================================================================
//  6. NOTIFICACIONES
// ============================================================================
const ejemploNotificaciones = () => {
  const encabezado = crearEl('div', {
    style: {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: 'var(--space-2) var(--space-3)',
      borderBlockEnd: '1px solid var(--border)',
      marginInline: 'calc(-1 * var(--space-1))',
      marginBlockStart: 'calc(-1 * var(--space-1))',
    },
  }, [
    crearEl('strong', { style: { fontSize: 'var(--text-sm)' } }, ['Notificaciones']),
    Insignia({ texto: '3 nuevas', variante: 'primary' }),
  ]);

  const pie = crearEl('div', { class: 'dropdown__pie' }, [
    crearEl('a', { href: '#' }, ['Ver todas las notificaciones']),
  ]);

  return fila(
    MenuDesplegable({
      ancho: '22rem',
      encabezado, pie,
      disparador: botonIcono('campana', 'Notificaciones'),
      items: [
        { grupo: 'Hoy' },
        {
          etiqueta: itemAvatar({
            nombre: 'Emma Watson', noLeida: true,
            mensaje: [crearEl('strong', null, ['Emma Watson']), ' respondió tu comentario: "Hola mundo 😍"'],
            tiempo: 'Hace 2 minutos',
          }),
          cerrarAlSeleccionar: false,
        },
        {
          etiqueta: itemAvatar({
            nombre: 'Albert Brooks', noLeida: true,
            mensaje: [crearEl('strong', null, ['Albert Brooks']), ' reaccionó a tu publicación con ❤️'],
            tiempo: 'Hace 9 horas',
          }),
          cerrarAlSeleccionar: false,
        },
        {
          etiqueta: itemAvatar({
            nombre: 'Sistema', noLeida: true,
            mensaje: ['El forecast hoy muestra una mínima de 20℃ en California 🌤️'],
            tiempo: 'Hace 1 día',
          }),
          cerrarAlSeleccionar: false,
        },
        { grupo: 'Anteriores' },
        {
          etiqueta: itemAvatar({
            nombre: 'University of Oxford',
            mensaje: [crearEl('strong', null, ['Oxford']), ' creó el evento: "Causal Inference 2026"'],
            tiempo: 'Hace 1 semana',
          }),
          cerrarAlSeleccionar: false,
        },
        {
          etiqueta: itemAvatar({
            nombre: 'James Cameron',
            mensaje: [crearEl('strong', null, ['James Cameron']), ' te invitó a unirte al grupo: UNICEF'],
            tiempo: 'Hace 2 días',
          }),
          cerrarAlSeleccionar: false,
        },
      ],
    }),
  );
};

// ============================================================================
//  7. TEMA (light / dark / auto)
// ============================================================================
const ejemploTema = () => {
  const tema = senal('auto');
  const opciones = [
    { id: 'light', etiqueta: 'Claro',    icono: Icono('sol',     { tamano: 16 }) },
    { id: 'dark',  etiqueta: 'Oscuro',   icono: Icono('luna',    { tamano: 16 }) },
    { id: 'auto',  etiqueta: 'Sistema',  icono: Icono('monitor', { tamano: 16 }) },
  ];

  const iconoBoton = { light: 'sol', dark: 'luna', auto: 'monitor' };

  const construir = () => MenuDesplegable({
    ancho: '13rem',
    disparador: botonIcono(iconoBoton[tema.value], 'Tema'),
    items: opciones.map((o) => ({
      etiqueta: o.etiqueta,
      icono: o.icono,
      seleccionado: tema.value === o.id,
      alSeleccionar: () => {
        tema.value = o.id;
        notificar.info(`Tema: ${o.etiqueta}`);
        const nuevo = construir();
        host.replaceWith(nuevo);
        host = nuevo;
      },
    })),
  });
  let host = construir();
  return fila(host);
};

// ============================================================================
//  8. IDIOMAS (con banderas emoji)
// ============================================================================
const ejemploIdiomas = () => {
  const idioma = senal('es');
  const idiomas = [
    { id: 'es', bandera: '🇪🇸', etiqueta: 'Español' },
    { id: 'en', bandera: '🇬🇧', etiqueta: 'English' },
    { id: 'fr', bandera: '🇫🇷', etiqueta: 'Français' },
    { id: 'de', bandera: '🇩🇪', etiqueta: 'Deutsch' },
    { id: 'pt', bandera: '🇵🇹', etiqueta: 'Português' },
    { id: 'ja', bandera: '🇯🇵', etiqueta: '日本語' },
    { id: 'zh', bandera: '🇨🇳', etiqueta: '中文' },
  ];

  const construir = () => {
    const sel = idiomas.find((i) => i.id === idioma.value);
    return MenuDesplegable({
      ancho: '15rem',
      disparador: Boton({
        variante: 'secondary',
        texto: ` ${sel.bandera}  ${sel.etiqueta}`,
        iconoDerecha: Icono('chevron_d', { tamano: 14 }),
      }),
      items: [
        { grupo: 'Idioma' },
        ...idiomas.map((i) => ({
          etiqueta: i.etiqueta,
          icono: crearEl('span', { class: 'dropdown__bandera' }, [i.bandera]),
          seleccionado: idioma.value === i.id,
          alSeleccionar: () => {
            idioma.value = i.id;
            const nuevo = construir();
            host.replaceWith(nuevo);
            host = nuevo;
          },
        })),
      ],
    });
  };
  let host = construir();
  return fila(host);
};

// ============================================================================
//  9. BÚSQUEDA INTERNA (cuerpo libre con input + lista filtrada)
// ============================================================================
const ejemploBusqueda = () => {
  const filtro = senal('');
  const proyectos = [
    { id: 1, nombre: 'Launchpad Web',     desc: 'Frontend principal' },
    { id: 2, nombre: 'Launchpad Mobile',  desc: 'App iOS / Android' },
    { id: 3, nombre: 'API Core',          desc: 'Backend Node.js' },
    { id: 4, nombre: 'API Auth',          desc: 'OAuth + sesiones' },
    { id: 5, nombre: 'Marketing Site',    desc: 'launchpad.dev' },
    { id: 6, nombre: 'Documentación',     desc: 'docs.launchpad.dev' },
    { id: 7, nombre: 'Status page',       desc: 'status.launchpad.dev' },
    { id: 8, nombre: 'Admin Dashboard',   desc: 'Panel interno' },
  ];

  const lista = crearEl('div', { style: { maxHeight: '280px', overflowY: 'auto', padding: 'var(--space-1)' } });

  const buscador = crearEl('div', { class: 'dropdown__buscador' }, [
    crearEl('input', {
      type: 'search', placeholder: 'Buscar proyecto…',
      onInput: (e) => { filtro.value = e.currentTarget.value; },
      onClick: (e) => e.stopPropagation(),
    }),
  ]);

  efecto(() => {
    const q = filtro.value.toLowerCase().trim();
    const visibles = q
      ? proyectos.filter((p) => p.nombre.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q))
      : proyectos;
    lista.replaceChildren(
      ...visibles.map((p) => crearEl('button', {
        type: 'button', class: 'dropdown__item',
        onClick: () => notificar.info(`Abierto: ${p.nombre}`),
      }, [
        Icono('proyectos', { tamano: 16 }),
        crearEl('span', { class: 'dropdown__item-textos' }, [
          crearEl('span', { class: 'dropdown__item-etiqueta' }, [p.nombre]),
          crearEl('span', { class: 'dropdown__item-desc' }, [p.desc]),
        ]),
      ])),
      ...(visibles.length === 0
        ? [crearEl('div', { style: { padding: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', textAlign: 'center' } }, [`Sin resultados para "${q}"`])]
        : []),
    );
  });

  return fila(
    MenuDesplegable({
      ancho: '22rem',
      cuerpo: crearEl('div', null, [buscador, lista]),
      disparador: Boton({
        texto: 'Cambiar proyecto',
        variante: 'secondary',
        icono: Icono('proyectos', { tamano: 16 }),
        iconoDerecha: Icono('chevron_d', { tamano: 14 }),
      }),
    }),
  );
};

// ============================================================================
//  10. CONFIRMACIÓN INLINE (eliminar)
// ============================================================================
const ejemploConfirmacion = () => {
  let menu;
  const cuerpo = crearEl('div', { class: 'dropdown__confirmar' }, [
    crearEl('p', { class: 'dropdown__confirmar-mensaje' }, [
      '¿Eliminar este proyecto? Esta acción no se puede deshacer y borrará todos los datos asociados.',
    ]),
    crearEl('div', { class: 'dropdown__confirmar-acciones' }, [
      Boton({ texto: 'Cancelar', variante: 'ghost', tamano: 'sm',
        onClick: () => menu._menu.cerrar() }),
      Boton({ texto: 'Sí, eliminar', variante: 'danger', tamano: 'sm',
        onClick: () => { notificar.error('Proyecto eliminado'); menu._menu.cerrar(); } }),
    ]),
  ]);
  menu = MenuDesplegable({
    ancho: '20rem',
    cuerpo,
    disparador: Boton({
      texto: 'Eliminar proyecto',
      variante: 'danger', tamano: 'sm',
      icono: Icono('papelera', { tamano: 14 }),
    }),
  });
  return fila(menu);
};

// ============================================================================
//  11. DIRECCIONES (compacto — 4 direcciones)
// ============================================================================
const ejemploDirecciones = () => fila(
  MenuDesplegable({
    disparador: Boton({ texto: 'Down ↓', variante: 'secondary' }),
    direccion: 'down', alineacion: 'start',
    items: [{ etiqueta: 'Opción A' }, { etiqueta: 'Opción B' }, { etiqueta: 'Opción C' }],
  }),
  MenuDesplegable({
    disparador: Boton({ texto: 'Up ↑', variante: 'secondary' }),
    direccion: 'up', alineacion: 'start',
    items: [{ etiqueta: 'Opción A' }, { etiqueta: 'Opción B' }, { etiqueta: 'Opción C' }],
  }),
  MenuDesplegable({
    disparador: Boton({ texto: 'Right →', variante: 'secondary' }),
    direccion: 'right', alineacion: 'start',
    items: [{ etiqueta: 'Opción A' }, { etiqueta: 'Opción B' }, { etiqueta: 'Opción C' }],
  }),
  MenuDesplegable({
    disparador: Boton({ texto: 'Left ←', variante: 'secondary' }),
    direccion: 'left', alineacion: 'start',
    items: [{ etiqueta: 'Opción A' }, { etiqueta: 'Opción B' }, { etiqueta: 'Opción C' }],
  }),
);

// ============================================================================
//  Página
// ============================================================================
export default async () => PaginaShowcase({
  titulo: 'Menús desplegables',
  descripcion: 'Listas de acciones contextuales. Portaleados a `<body>` con `position: fixed` para escapar de cualquier stacking context. Soportan dirección (4), alineación, items con icono / descripción / atajo / selección, encabezado y cuerpo libre. Sólo un menú abierto a la vez (singleton).',
  decoracion: corner1(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    // ============== 1. BÁSICO ==============
    Seccion({
      titulo: 'Básico — acciones contextuales',
      descripcion: 'Items con icono opcional, separadores y un item destructivo (`peligro: true`). Toda acción cierra el menú al hacer click.',
      hijos: [VistaCodigo({
        vista: ejemploBasico(),
        codigo: `MenuDesplegable({
  disparador: Boton({ texto: 'Acciones' }),
  items: [
    { etiqueta: 'Ver detalles', icono: Icono('ojo'),     alSeleccionar: () => {} },
    { etiqueta: 'Editar',       icono: Icono('editar'),  alSeleccionar: () => {} },
    { etiqueta: 'Duplicar',     icono: Icono('mas'),     alSeleccionar: () => {} },
    { separador: true },
    { etiqueta: 'Eliminar', peligro: true,
      icono: Icono('papelera'), alSeleccionar: () => {} },
  ],
})`,
      })],
    }),

    // ============== 2. CON DESCRIPCIÓN Y ATAJOS ==============
    Seccion({
      titulo: 'Con descripción y atajos (Linear / Notion)',
      descripcion: 'Items con `descripcion` (texto secundario debajo de la etiqueta), `atajo` de teclado (renderizado como `<kbd>`) y `deshabilitado`. Patrón usado por command palettes y editores de bloques.',
      hijos: [VistaCodigo({
        vista: ejemploAtajos(),
        codigo: `MenuDesplegable({
  ancho: '20rem',
  items: [
    { grupo: 'Bloques' },
    { etiqueta: 'Texto', descripcion: 'Párrafo simple',
      icono: Icono('texto_aa'), atajo: 'Ctrl T' },
    { etiqueta: 'Encabezado', descripcion: 'Título de sección',
      icono: Icono('formularios'), atajo: 'Ctrl H' },
    { separador: true },
    { etiqueta: 'Vídeo', descripcion: 'YouTube, Vimeo',
      icono: Icono('proyectos'), deshabilitado: true },
  ],
})`,
      })],
    }),

    // ============== 3. KEBAB (3 PUNTOS) ==============
    Seccion({
      titulo: 'Botón kebab (sólo icono)',
      descripcion: 'El disparador puede ser cualquier nodo — un botón cuadrado con el icono `chevron_v` (3 puntos verticales) es el patrón estándar para "más acciones" en filas de tablas y cards.',
      hijos: [VistaCodigo({
        vista: ejemploKebab(),
        codigo: `// Cualquier nodo sirve como disparador
const botonKebab = crearEl('button', {
  'aria-label': 'Más acciones',
  style: { width: '36px', height: '36px', /* ... */ },
}, [Icono('chevron_v', { tamano: 16 })]);

MenuDesplegable({
  disparador: botonKebab,
  items: [
    { etiqueta: 'Marcar favorito', icono: Icono('estrella') },
    { etiqueta: 'Archivar',         icono: Icono('descargar') },
    { separador: true },
    { etiqueta: 'Eliminar', peligro: true,
      icono: Icono('papelera') },
  ],
})`,
      })],
    }),

    // ============== 4. PERFIL DE USUARIO ==============
    Seccion({
      titulo: 'Perfil de usuario (Vercel / GitHub)',
      descripcion: 'Encabezado con avatar + email arriba, items con iconos y atajos, footer con versión y enlace. Patrón canónico de los menús de cuenta en SaaS modernos.',
      hijos: [VistaCodigo({
        vista: ejemploPerfil(),
        codigo: `MenuDesplegable({
  ancho: '17rem',
  encabezado: crearEl('div', { class: 'dropdown__user-card' }, [
    Avatar({ nombre: 'María García' }),
    crearEl('div', { class: 'dropdown__user-text' }, [
      crearEl('strong', null, ['María García']),
      crearEl('span',   null, ['maria@launchpad.dev']),
    ]),
  ]),
  pie: crearEl('div', { class: 'dropdown__pie' }, [
    'Versión 1.0.0 · ', crearEl('a', { href: '#' }, ['Notas']),
  ]),
  items: [
    { separador: true },
    { etiqueta: 'Mi perfil',     icono: Icono('perfil'),     atajo: '⌘P' },
    { etiqueta: 'Configuración', icono: Icono('utilidades'), atajo: '⌘,' },
    { separador: true },
    { etiqueta: 'Cerrar sesión', peligro: true,
      icono: Icono('cerrar_sesion') },
  ],
})`,
      })],
    }),

    // ============== 5. SELECTOR CON CHECK ==============
    Seccion({
      titulo: 'Selector con check (radio — ordenar por)',
      descripcion: '`seleccionado: true` en un item le añade un check al final + fondo sutil. Sólo uno debería estar marcado a la vez (radio-style). El texto del botón también se actualiza con la selección.',
      hijos: [VistaCodigo({
        vista: ejemploSelectorOrden(),
        codigo: `const orden = senal('reciente');

MenuDesplegable({
  disparador: Boton({ texto: \`Ordenar: \${textoActual}\` }),
  items: [
    { grupo: 'Ordenar por' },
    { etiqueta: 'Más reciente',
      seleccionado: orden.value === 'reciente',
      alSeleccionar: () => { orden.value = 'reciente'; rerender(); } },
    { etiqueta: 'Más antiguo',
      seleccionado: orden.value === 'antiguo',
      alSeleccionar: () => { orden.value = 'antiguo'; rerender(); } },
  ],
})`,
      })],
    }),

    // ============== 6. NOTIFICACIONES ==============
    Seccion({
      titulo: 'Notificaciones (con avatares y "no leídas")',
      descripcion: 'Encabezado con título + badge de cuenta, items custom con avatar + texto + tiempo, y los no-leídos se diferencian con fondo sutil + dot azul. `cerrarAlSeleccionar: false` deja el menú abierto al click para que el usuario pueda revisar varias.',
      hijos: [VistaCodigo({
        vista: ejemploNotificaciones(),
        codigo: `MenuDesplegable({
  ancho: '22rem',
  encabezado: <header con título + Insignia>,
  pie: crearEl('div', { class: 'dropdown__pie' }, [
    crearEl('a', { href: '#' }, ['Ver todas']),
  ]),
  items: [
    { grupo: 'Hoy' },
    { etiqueta: itemAvatar({ nombre, mensaje, tiempo, noLeida: true }),
      cerrarAlSeleccionar: false },
    // ... más items
  ],
})`,
      })],
    }),

    // ============== 7. TEMA ==============
    Seccion({
      titulo: 'Selector de tema (claro / oscuro / sistema)',
      descripcion: 'Patrón clásico — 3 opciones con icono distintivo y check sobre la activa. El icono del botón cambia según la selección.',
      hijos: [VistaCodigo({
        vista: ejemploTema(),
        codigo: `const tema = senal('auto');

MenuDesplegable({
  disparador: botonIcono('monitor', 'Tema'),
  items: [
    { etiqueta: 'Claro',   icono: Icono('sol'),     seleccionado: tema.value === 'light' },
    { etiqueta: 'Oscuro',  icono: Icono('luna'),    seleccionado: tema.value === 'dark' },
    { etiqueta: 'Sistema', icono: Icono('monitor'), seleccionado: tema.value === 'auto' },
  ],
})`,
      })],
    }),

    // ============== 8. IDIOMAS ==============
    Seccion({
      titulo: 'Selector de idioma (con banderas)',
      descripcion: 'Banderas como emoji al inicio, etiqueta nativa del idioma, check sobre el activo. Funciona offline (no carga assets externos).',
      hijos: [VistaCodigo({
        vista: ejemploIdiomas(),
        codigo: `const idiomas = [
  { id: 'es', bandera: '🇪🇸', etiqueta: 'Español' },
  { id: 'en', bandera: '🇬🇧', etiqueta: 'English' },
  { id: 'fr', bandera: '🇫🇷', etiqueta: 'Français' },
  // ...
];

MenuDesplegable({
  disparador: Boton({ texto: \`\${actual.bandera}  \${actual.etiqueta}\` }),
  items: [
    { grupo: 'Idioma' },
    ...idiomas.map(i => ({
      etiqueta: i.etiqueta,
      icono: crearEl('span', { class: 'dropdown__bandera' }, [i.bandera]),
      seleccionado: idioma.value === i.id,
    })),
  ],
})`,
      })],
    }),

    // ============== 9. BÚSQUEDA INTERNA ==============
    Seccion({
      titulo: 'Búsqueda interna (cuerpo libre)',
      descripcion: 'En lugar de `items`, le pasamos un `cuerpo` con un input + lista filtrada reactivamente con `senal`. Útil para command palettes (cambiar proyecto, asignar a usuario, mover a carpeta).',
      hijos: [VistaCodigo({
        vista: ejemploBusqueda(),
        codigo: `const filtro = senal('');
const lista = crearEl('div');

efecto(() => {
  const q = filtro.value.toLowerCase();
  lista.replaceChildren(
    ...proyectos
      .filter(p => p.nombre.toLowerCase().includes(q))
      .map(p => crearEl('button', { class: 'dropdown__item' }, [...]))
  );
});

MenuDesplegable({
  ancho: '22rem',
  cuerpo: crearEl('div', null, [
    crearEl('div', { class: 'dropdown__buscador' }, [
      crearEl('input', { type: 'search',
        onInput: e => { filtro.value = e.currentTarget.value; },
      }),
    ]),
    lista,
  ]),
  disparador: Boton({ texto: 'Cambiar proyecto' }),
})`,
      })],
    }),

    // ============== 10. CONFIRMACIÓN INLINE ==============
    Seccion({
      titulo: 'Confirmación destructiva inline',
      descripcion: 'Para acciones peligrosas — abrimos un mini-form con mensaje de advertencia y dos botones. La API imperativa `menu._menu.cerrar()` permite cerrar el dropdown desde dentro de los handlers.',
      hijos: [VistaCodigo({
        vista: ejemploConfirmacion(),
        codigo: `let menu;
const cuerpo = crearEl('div', { class: 'dropdown__confirmar' }, [
  crearEl('p', null, ['¿Eliminar este proyecto? Esta acción no se puede deshacer.']),
  crearEl('div', { class: 'dropdown__confirmar-acciones' }, [
    Boton({ texto: 'Cancelar', variante: 'ghost',
      onClick: () => menu._menu.cerrar() }),
    Boton({ texto: 'Sí, eliminar', variante: 'danger',
      onClick: () => { eliminar(); menu._menu.cerrar(); } }),
  ]),
]);

menu = MenuDesplegable({ cuerpo, disparador: ... });`,
      })],
    }),

    // ============== 11. DIRECCIONES ==============
    Seccion({
      titulo: 'Direcciones (4) y alineación',
      descripcion: '`direccion`: down (default), up, right, left. `alineacion`: start | end (alinea con el inicio o fin del disparador).',
      hijos: [VistaCodigo({
        vista: ejemploDirecciones(),
        codigo: `MenuDesplegable({ direccion: 'down',  alineacion: 'start', items })
MenuDesplegable({ direccion: 'up',    alineacion: 'start', items })
MenuDesplegable({ direccion: 'right', alineacion: 'start', items })
MenuDesplegable({ direccion: 'left',  alineacion: 'start', items })`,
      })],
    }),

  ],
});
