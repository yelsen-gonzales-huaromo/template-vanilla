import { crearEl } from '../../../utils/helpers/dom.js';
import { senal } from '../../../utils/helpers/reactive.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { BarraInferior } from '../../../components/ui/bottom-bar/bottom-bar.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { corner7 } from '../../../components/ui/card/card-decoraciones.js';

// Configuración base de items reutilizable
const ICONOS = ['panel', 'correo', 'chat', 'campana', 'perfil'];
const LABELS = ['Inicio', 'Inbox', 'Chat', 'Avisos', 'Perfil'];

const itemsConActivo = (idxActivo, opciones = {}) =>
  ICONOS.map((ic, i) => ({
    icono: Icono(ic, { tamano: 18 }),
    etiqueta: LABELS[i],
    activo: i === idxActivo,
    ...(opciones.badges?.[i] != null ? { badge: opciones.badges[i] } : {}),
    ...(opciones.puntos?.[i] ? { punto: true } : {}),
  }));

// Demo reactivo: clickear un item lo activa
const demo = (props = {}) => {
  const activo = senal(0);
  const host = crearEl('div', { style: { display: 'flex', justifyContent: 'center', padding: 'var(--space-3) 0' } });
  const items = (i) => ICONOS.map((ic, idx) => ({
    icono: Icono(ic, { tamano: 18 }),
    etiqueta: LABELS[idx],
    activo: i === idx,
    badge: props.badges?.[idx],
    punto: props.puntos?.[idx],
    alClick: () => { activo.value = idx; render(); },
  }));
  const render = () => host.replaceChildren(BarraInferior({ ...props, items: items(activo.value) }));
  render();
  return host;
};

// Demo con FAB central
const demoFab = (props = {}) => {
  const activo = senal(0);
  const host = crearEl('div', { style: { display: 'flex', justifyContent: 'center', padding: 'var(--space-3) 0' } });
  const items = (i) => [
    { icono: Icono('panel',  { tamano: 18 }), etiqueta: 'Inicio',  activo: i === 0, alClick: () => { activo.value = 0; render(); } },
    { icono: Icono('correo', { tamano: 18 }), etiqueta: 'Inbox',   activo: i === 1, badge: 4, alClick: () => { activo.value = 1; render(); } },
    { destacado: true, icono: Icono('mas', { tamano: 22 }), alClick: () => {} },
    { icono: Icono('campana',{ tamano: 18 }), etiqueta: 'Avisos',  activo: i === 3, punto: true, alClick: () => { activo.value = 3; render(); } },
    { icono: Icono('perfil', { tamano: 18 }), etiqueta: 'Perfil',  activo: i === 4, alClick: () => { activo.value = 4; render(); } },
  ];
  const render = () => host.replaceChildren(BarraInferior({ ...props, items: items(activo.value) }));
  render();
  return host;
};

export default async () => PaginaShowcase({
  titulo: 'Barra inferior',
  descripcion: 'Navegación móvil estilo iOS/Android con 4 variantes visuales, 4 tipos de indicador de activo, soporte de badges, puntos de notificación y botón central destacado (FAB).',
  decoracion: corner7(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    // ============== ESTÁNDAR ==============
    Seccion({
      titulo: 'Estándar',
      descripcion: 'Versión por defecto con borde + indicador de fondo en el item activo.',
      hijos: [VistaCodigo({
        vista: demo({ badges: [null, 4, null, null, null] }),
        codigo: `BarraInferior({
  items: [
    { icono: Icono('panel'),    etiqueta: 'Inicio', activo: true },
    { icono: Icono('correo'),   etiqueta: 'Inbox',  badge: 4 },
    { icono: Icono('chat'),     etiqueta: 'Chat' },
    { icono: Icono('campana'),  etiqueta: 'Avisos' },
    { icono: Icono('perfil'),   etiqueta: 'Perfil' },
  ],
})`,
      })],
    }),

    // ============== FLOTANTE ==============
    Seccion({
      titulo: 'Flotante',
      descripcion: '`flotante: true` añade sombra grande y elimina el borde — perfecto para una barra que "flota" sobre el contenido.',
      hijos: [VistaCodigo({
        vista: demo({ flotante: true, badges: [null, 4, null, null, null] }),
        codigo: `BarraInferior({ flotante: true, items: [...] })`,
      })],
    }),

    // ============== CRISTAL (frosted glass) ==============
    Seccion({
      titulo: 'Cristal (frosted glass)',
      descripcion: 'Backdrop blur + saturación. Funciona mejor sobre fondos coloridos o con imagen detrás.',
      hijos: [VistaCodigo({
        vista: crearEl('div', {
          style: {
            background: 'linear-gradient(135deg,#3b82f6,#8b5cf6,#ec4899)',
            padding: 'var(--space-6) 0',
            borderRadius: 'var(--radius-md)',
            display: 'flex', justifyContent: 'center',
          },
        }, [demo({ variante: 'cristal', badges: [null, 4, null, null, null] }).querySelector('nav') || demo({ variante: 'cristal' })]),
        codigo: `BarraInferior({ variante: 'cristal', items: [...] })
// Backdrop blur — usar sobre fondos no monocromáticos`,
      })],
    }),

    // ============== INDICADORES DE ACTIVO ==============
    Seccion({
      titulo: 'Tipos de indicador de activo',
      descripcion: '4 formas de marcar el item activo: fondo (default), línea, punto o ninguno (sólo cambio de color).',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
          crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)' } }, [
            crearEl('span', { style: { color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', minWidth: '90px' } }, ['fondo (default):']),
            demo({ indicador: 'fondo' }),
          ]),
          crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)' } }, [
            crearEl('span', { style: { color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', minWidth: '90px' } }, ['linea:']),
            demo({ indicador: 'linea' }),
          ]),
          crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)' } }, [
            crearEl('span', { style: { color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', minWidth: '90px' } }, ['punto:']),
            demo({ indicador: 'punto' }),
          ]),
          crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)' } }, [
            crearEl('span', { style: { color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', minWidth: '90px' } }, ['ninguno:']),
            demo({ indicador: 'ninguno' }),
          ]),
        ]),
        codigo: `BarraInferior({ indicador: 'fondo',   items: [...] })  // default
BarraInferior({ indicador: 'linea',   items: [...] })
BarraInferior({ indicador: 'punto',   items: [...] })
BarraInferior({ indicador: 'ninguno', items: [...] })`,
      })],
    }),

    // ============== COMPACTA / MINIMAL ==============
    Seccion({
      titulo: 'Compacta y minimal',
      descripcion: 'Compacta: sólo iconos con borde. Minimal: sin contenedor, sólo iconos espaciados.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
          demo({ variante: 'compacta', badges: [null, 4, null, null, null], puntos: [false, false, false, true, false] }),
          demo({ variante: 'minimal' }),
        ]),
        codigo: `BarraInferior({ variante: 'compacta', items: [...] })  // sólo iconos
BarraInferior({ variante: 'minimal',  items: [...] })  // sin contenedor`,
      })],
    }),

    // ============== CON BADGES Y PUNTOS ==============
    Seccion({
      titulo: 'Con badges y puntos de notificación',
      descripcion: '`badge` para conteos numéricos, `punto: true` para notificación silenciosa sin número.',
      hijos: [VistaCodigo({
        vista: demo({
          badges: [null, 4, '12', '99+', null],
          puntos: [false, false, false, false, true],
        }),
        codigo: `items: [
  { icono: ..., etiqueta: 'Inicio' },
  { icono: ..., etiqueta: 'Inbox',  badge: 4 },
  { icono: ..., etiqueta: 'Chat',   badge: '12' },
  { icono: ..., etiqueta: 'Avisos', badge: '99+' },
  { icono: ..., etiqueta: 'Perfil', punto: true },  // sólo punto, sin número
]`,
      })],
    }),

    // ============== CON FAB CENTRAL ==============
    Seccion({
      titulo: 'Con botón central destacado (FAB)',
      descripcion: '`destacado: true` en un item lo convierte en un FAB circular centrado que sobresale — patrón clásico de apps de creación (publicar, capturar, agregar).',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
          demoFab({ flotante: true }),
          demoFab({ variante: 'cristal' }),
        ]),
        codigo: `BarraInferior({
  flotante: true,
  items: [
    { icono: Icono('panel'),  etiqueta: 'Inicio', activo: true },
    { icono: Icono('correo'), etiqueta: 'Inbox',  badge: 4 },
    { destacado: true, icono: Icono('mas') },          // FAB central
    { icono: Icono('campana'),etiqueta: 'Avisos', punto: true },
    { icono: Icono('perfil'), etiqueta: 'Perfil' },
  ],
})`,
      })],
    }),

    // ============== ITEM DESHABILITADO ==============
    Seccion({
      titulo: 'Items deshabilitados',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { display: 'flex', justifyContent: 'center', padding: 'var(--space-3) 0' } }, [
          BarraInferior({ items: [
            { icono: Icono('panel',   { tamano: 18 }), etiqueta: 'Inicio',  activo: true },
            { icono: Icono('correo',  { tamano: 18 }), etiqueta: 'Inbox',   badge: 4 },
            { icono: Icono('chat',    { tamano: 18 }), etiqueta: 'Chat',    deshabilitado: true },
            { icono: Icono('campana', { tamano: 18 }), etiqueta: 'Avisos' },
            { icono: Icono('perfil',  { tamano: 18 }), etiqueta: 'Perfil' },
          ]}),
        ]),
        codigo: `{ icono: ..., etiqueta: 'Chat', deshabilitado: true }`,
      })],
    }),

    // ============== CASOS DE USO ==============
    Seccion({
      titulo: 'Casos de uso típicos',
      descripcion: 'Configuraciones que probablemente uses en apps reales.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' } }, [
          // Social app
          crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' } }, [
            crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, ['Social app — con FAB para publicar']),
            crearEl('div', { style: { display: 'flex', justifyContent: 'center' } }, [
              demoFab({ flotante: true }),
            ]),
          ]),
          // Mensajería
          crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' } }, [
            crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, ['App de mensajería — indicador línea']),
            crearEl('div', { style: { display: 'flex', justifyContent: 'center' } }, [
              demo({ indicador: 'linea', badges: [null, 7, '23', null, null] }),
            ]),
          ]),
          // Compacta admin
          crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' } }, [
            crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, ['Admin compacta — sólo iconos']),
            crearEl('div', { style: { display: 'flex', justifyContent: 'center' } }, [
              demo({ variante: 'compacta', flotante: true }),
            ]),
          ]),
        ]),
        codigo: `// Social: FAB central para publicar
BarraInferior({ flotante: true, items: [..., { destacado: true }, ...] })

// Mensajería: indicador línea + badges grandes
BarraInferior({ indicador: 'linea', items: [...] })

// Admin compacta: sólo iconos
BarraInferior({ variante: 'compacta', flotante: true, items: [...] })`,
      })],
    }),
  ],
});
