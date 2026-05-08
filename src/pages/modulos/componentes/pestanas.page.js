import { crearEl } from '../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { Pestanas } from '../../../components/ui/tabs/tabs.js';
import { Insignia } from '../../../components/ui/badge/badge.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { corner2 } from '../../../components/ui/card/card-decoraciones.js';

const lorem = (txt) => crearEl('p', {
  style: { margin: 0, color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', lineHeight: 1.6 },
}, [txt]);

const items = [
  { id: 'p',  etiqueta: 'Perfil',         contenido: lorem('Información personal del usuario y sus preferencias.') },
  { id: 's',  etiqueta: 'Seguridad',      contenido: lorem('Contraseña, doble factor y dispositivos autorizados.') },
  { id: 'n',  etiqueta: 'Notificaciones', contenido: lorem('Configuración de avisos por email y push.'),
    badge: Insignia({ texto: '3', variante: 'danger' }) },
];

const itemsConIconos = [
  { id: 'h', etiqueta: 'Inicio',    icono: Icono('panel',     { tamano: 14 }), contenido: lorem('Panel principal con KPIs y actividad reciente.') },
  { id: 'a', etiqueta: 'Analítica', icono: Icono('analitica', { tamano: 14 }), contenido: lorem('Sesiones, conversiones y embudo de ventas.') },
  { id: 'c', etiqueta: 'Equipo',    icono: Icono('grupos',    { tamano: 14 }), contenido: lorem('Miembros del equipo, roles y permisos.') },
  { id: 'd', etiqueta: 'Archivado', icono: Icono('papelera',  { tamano: 14 }), contenido: lorem('Sin items archivados.'), deshabilitado: true },
];

export default async () => PaginaShowcase({
  titulo: 'Pestañas',
  descripcion: 'Navegación entre paneles dentro de la misma página. 5 variantes visuales (`underline`, `pills`, `segmented`, `lateral`, `cards`), soporte de iconos, badges, items deshabilitados y panel inicial controlable.',
  decoracion: corner2(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    // ============== UNDERLINE ==============
    Seccion({
      titulo: 'Underline (default)',
      descripcion: 'Variante minimalista con barra inferior bajo el tab activo. La más usada — encaja en cualquier dashboard.',
      hijos: [VistaCodigo({
        vista: Pestanas({ items }),
        codigo: `Pestanas({
  items: [
    { id: 'p', etiqueta: 'Perfil',         contenido: nodo },
    { id: 's', etiqueta: 'Seguridad',      contenido: nodo },
    { id: 'n', etiqueta: 'Notificaciones', contenido: nodo,
      badge: Insignia({ texto: '3', variante: 'danger' }) },
  ],
})`,
      })],
    }),

    // ============== PILLS ==============
    Seccion({
      titulo: 'Pills',
      descripcion: 'Tabs como botones pill. Patrón usado por dashboards modernos (Linear, Vercel) para alternar entre vistas.',
      hijos: [VistaCodigo({
        vista: Pestanas({ variante: 'pills', items }),
        codigo: `Pestanas({ variante: 'pills', items: [...] })`,
      })],
    }),

    // ============== SEGMENTED (iOS) ==============
    Seccion({
      titulo: 'Segmented (estilo iOS)',
      descripcion: 'Inspirado en el segmented control de iOS. Ideal para alternar entre 2-4 opciones mutuamente excluyentes (Día / Semana / Mes).',
      hijos: [VistaCodigo({
        vista: Pestanas({ variante: 'segmented', items: [
          { id: 'd', etiqueta: 'Día',     contenido: lorem('Vista diaria con eventos hora a hora.') },
          { id: 'w', etiqueta: 'Semana',  contenido: lorem('Vista semanal con resumen agrupado.') },
          { id: 'm', etiqueta: 'Mes',     contenido: lorem('Vista mensual estilo calendario clásico.') },
        ]}),
        codigo: `Pestanas({
  variante: 'segmented',
  items: [
    { id: 'd', etiqueta: 'Día',    contenido: nodo },
    { id: 'w', etiqueta: 'Semana', contenido: nodo },
    { id: 'm', etiqueta: 'Mes',    contenido: nodo },
  ],
})`,
      })],
    }),

    // ============== LATERAL (vertical) ==============
    Seccion({
      titulo: 'Lateral (vertical)',
      descripcion: 'Tabs verticales a la izquierda, contenido a la derecha. Patrón macOS Preferences / configuración SaaS — ideal cuando hay 5+ secciones para no llenar el header.',
      hijos: [VistaCodigo({
        vista: Pestanas({ variante: 'lateral', items: [
          { id: 'g', etiqueta: 'General',        icono: Icono('utilidades', { tamano: 14 }), contenido: lorem('Configuración general del workspace.') },
          { id: 'p', etiqueta: 'Perfil',         icono: Icono('perfil',     { tamano: 14 }), contenido: lorem('Tu información personal y avatar.') },
          { id: 's', etiqueta: 'Seguridad',      icono: Icono('seguridad',  { tamano: 14 }), contenido: lorem('2FA, sesiones activas y dispositivos.') },
          { id: 'n', etiqueta: 'Notificaciones', icono: Icono('campana',    { tamano: 14 }), contenido: lorem('Email, push y SMS.') },
          { id: 'b', etiqueta: 'Facturación',    icono: Icono('precios',    { tamano: 14 }), contenido: lorem('Plan actual, métodos de pago, facturas.') },
          { id: 'i', etiqueta: 'Integraciones',  icono: Icono('utilidades', { tamano: 14 }), contenido: lorem('Slack, GitHub, Linear conectados.') },
        ]}),
        codigo: `Pestanas({
  variante: 'lateral',
  items: [
    { id: 'g', etiqueta: 'General',  icono: Icono('utilidades'), contenido: nodo },
    { id: 'p', etiqueta: 'Perfil',   icono: Icono('perfil'),     contenido: nodo },
    { id: 's', etiqueta: 'Seguridad', icono: Icono('seguridad'), contenido: nodo },
    // ...
  ],
})`,
      })],
    }),

    // ============== CARDS ==============
    Seccion({
      titulo: 'Cards (Notion / Stripe style)',
      descripcion: 'Cada tab es una tarjeta con borde y fondo. La activa lleva borde primary + sombra. Sensación de "items seleccionables" más que de "navegación".',
      hijos: [VistaCodigo({
        vista: Pestanas({ variante: 'cards', items: [
          { id: 'm', etiqueta: 'Mensual', contenido: lorem('Plan mensual — $19/mes, cancela cuando quieras.') },
          { id: 'a', etiqueta: 'Anual',   contenido: lorem('Plan anual — $190/año (ahorras 2 meses).') },
          { id: 'l', etiqueta: 'Lifetime', contenido: lorem('Pago único — $599. Acceso de por vida + actualizaciones.') },
        ]}),
        codigo: `Pestanas({
  variante: 'cards',
  items: [
    { id: 'm', etiqueta: 'Mensual',  contenido: nodo },
    { id: 'a', etiqueta: 'Anual',    contenido: nodo },
    { id: 'l', etiqueta: 'Lifetime', contenido: nodo },
  ],
})`,
      })],
    }),

    // ============== CON ICONOS ==============
    Seccion({
      titulo: 'Con iconos + items deshabilitados',
      descripcion: 'Cada tab puede llevar un `icono`. `deshabilitado: true` lo bloquea (atenuación + cursor). El icono se renderiza antes de la etiqueta.',
      hijos: [VistaCodigo({
        vista: Pestanas({ items: itemsConIconos }),
        codigo: `Pestanas({
  items: [
    { id: 'h', etiqueta: 'Inicio',    icono: Icono('panel'),     contenido: nodo },
    { id: 'a', etiqueta: 'Analítica', icono: Icono('analitica'), contenido: nodo },
    { id: 'd', etiqueta: 'Archivado', deshabilitado: true,        contenido: nodo },
  ],
})`,
      })],
    }),

    // ============== CON BADGES ==============
    Seccion({
      titulo: 'Con badges (contadores)',
      descripcion: 'Los badges suelen ser counts de items pendientes (mensajes no leídos, alertas, etc.). Usa `Insignia` con `variante: danger` para urgencia.',
      hijos: [VistaCodigo({
        vista: Pestanas({ items: [
          { id: 'i', etiqueta: 'Inbox',        contenido: lorem('14 mensajes — 3 sin leer'),
            badge: Insignia({ texto: '14', variante: 'primary' }) },
          { id: 'p', etiqueta: 'Pendientes',   contenido: lorem('Tareas que requieren tu atención'),
            badge: Insignia({ texto: '7', variante: 'warning' }) },
          { id: 'a', etiqueta: 'Alertas',      contenido: lorem('Errores críticos del sistema'),
            badge: Insignia({ texto: '!', variante: 'danger' }) },
          { id: 'r', etiqueta: 'Resueltos',    contenido: lorem('Items completados o archivados') },
        ]}),
        codigo: `Pestanas({
  items: [
    { id: 'i', etiqueta: 'Inbox',
      badge: Insignia({ texto: '14', variante: 'primary' }), contenido: nodo },
    { id: 'p', etiqueta: 'Pendientes',
      badge: Insignia({ texto: '7',  variante: 'warning' }), contenido: nodo },
    { id: 'a', etiqueta: 'Alertas',
      badge: Insignia({ texto: '!',  variante: 'danger'  }), contenido: nodo },
  ],
})`,
      })],
    }),

    // ============== INICIAL CONTROLADO ==============
    Seccion({
      titulo: 'Pestaña inicial',
      descripcion: '`inicial` selecciona qué pestaña aparece abierta al cargar. Si no se pasa, abre la primera. Útil para deep-linking (abrir directo en Seguridad desde una URL).',
      hijos: [VistaCodigo({
        vista: Pestanas({ inicial: 's', items }),
        codigo: `Pestanas({
  inicial: 's',                              // <- empieza en "Seguridad"
  items: [
    { id: 'p', etiqueta: 'Perfil',    contenido: nodo },
    { id: 's', etiqueta: 'Seguridad', contenido: nodo },
    { id: 'n', etiqueta: 'Notif.',    contenido: nodo },
  ],
})`,
      })],
    }),

  ],
});
