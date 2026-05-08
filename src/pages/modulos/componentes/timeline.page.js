import { crearEl } from '../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { LineaTiempo, LineaTiempoHorizontal } from '../../../components/ui/timeline/timeline.js';
import { Avatar } from '../../../components/ui/avatar/avatar.js';
import { Insignia } from '../../../components/ui/badge/badge.js';
import { Boton } from '../../../components/ui/button/button.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { corner6 } from '../../../components/ui/card/card-decoraciones.js';

const FOTO = (n) => `./public/img/team/${n}.jpg`;

export default async () => PaginaShowcase({
  titulo: 'Línea de tiempo',
  descripcion: 'Eventos cronológicos. 5 variantes visuales (default cards · centrada zigzag · compacta densa · glass con gradient · simple sin chrome) + horizontal para steps. Cada item soporta icono coloreado con gradient, avatar, badges, mensaje, archivos adjuntos y acciones inline. Hover lifts cards con sombra.',
  decoracion: corner6(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    // ============== 1. HISTORIAL DE PEDIDO (default cards) ==============
    Seccion({
      titulo: '1 · Historial de pedido (cards default)',
      descripcion: 'Variante default — cada evento vive en su propia card con borde y hover lift. Iconos grandes (40px) con gradient + sombra coloreada para que destaquen del fondo. Hover sube la card con `translateY(-1px)` y la sombra crece.',
      hijos: [VistaCodigo({
        vista: LineaTiempo({ items: [
          { fecha: 'Hoy · 09:42', titulo: 'Entregado',     mensaje: 'El paquete fue entregado en recepción a J. Martínez.', icono: Icono('check', { tamano: 14 }), color: 'success' },
          { fecha: 'Hoy · 06:11', titulo: 'En reparto',    mensaje: 'Tu pedido está saliendo del almacén local — llegará entre 09:00 y 12:00.', icono: Icono('flecha_r', { tamano: 14 }), color: 'info' },
          { fecha: 'Ayer 22:30',  titulo: 'En tránsito',   mensaje: 'En el centro de distribución de Madrid.', icono: Icono('reloj', { tamano: 14 }), color: 'primary' },
          { fecha: '04 may',      titulo: 'Empaquetado',   mensaje: 'Se preparó el envío en el almacén central.', icono: Icono('productos', { tamano: 14 }) },
          { fecha: '04 may',      titulo: 'Pedido recibido', mensaje: 'Confirmación enviada a tu correo.', icono: Icono('correo', { tamano: 14 }) },
        ]}),
        codigo: `LineaTiempo({ items: [
  { fecha: 'Hoy · 09:42', titulo: 'Entregado',
    mensaje: 'El paquete fue entregado…',
    icono: Icono('check'), color: 'success' },
  // ... más estados
]})

// Cada item es una card con hover lift + sombra coloreada del icono`,
      })],
    }),

    // ============== 2. ACTIVITY FEED CON AVATARES ==============
    Seccion({
      titulo: '2 · Activity feed (con avatares)',
      descripcion: 'En vez del icono coloreado, cada item lleva el avatar de quien ejecutó la acción. Los badges Insignia comunican el tipo de evento (PR abierto, asignación, etc.). Patrón GitHub / Linear / Slack.',
      hijos: [VistaCodigo({
        vista: LineaTiempo({ items: [
          {
            fecha: 'hace 5 min',
            avatar: Avatar({ nombre: 'María García', src: FOTO(1), tamano: 'md' }),
            titulo: 'María García asignó esta tarea a Sara',
            etiqueta: Insignia({ texto: 'Asignación', variante: 'primary' }),
          },
          {
            fecha: 'hace 12 min',
            avatar: Avatar({ nombre: 'Marcus Lee', src: FOTO(2), tamano: 'md' }),
            titulo: 'Marcus Lee comentó',
            mensaje: '"Le agregué validación al form de email — ahora rechaza dominios temporales como mailinator. ¿Lo revisamos juntos antes del merge?"',
          },
          {
            fecha: 'hace 1 h',
            avatar: Avatar({ nombre: 'Sara Chen', src: FOTO(3), tamano: 'md' }),
            titulo: 'Sara Chen abrió el PR #142',
            mensaje: '12 archivos cambiados',
            etiqueta: Insignia({ texto: 'PR abierto', variante: 'success' }),
            adjuntos: [
              { icono: Icono('pagina', { tamano: 12 }), nombre: 'feat: validar email', tamano: '+384' },
            ],
          },
          {
            fecha: 'hace 3 h',
            avatar: Avatar({ nombre: 'Lina Park', src: FOTO(4), tamano: 'md' }),
            titulo: 'Lina Park cerró 3 issues',
            mensaje: '#188 fix tooltip · #190 update deps · #191 lint warnings',
          },
          {
            fecha: 'ayer',
            avatar: Avatar({ nombre: 'Jorge R.', src: FOTO(5), tamano: 'md' }),
            titulo: 'Jorge R. creó un nuevo proyecto',
            mensaje: 'Migration to v2 API · 24 tareas pendientes',
            etiqueta: Insignia({ texto: 'Nuevo', variante: 'info' }),
          },
        ]}),
        codigo: `LineaTiempo({ items: [
  {
    fecha: 'hace 5 min',
    avatar: Avatar({ nombre, src }),                  // ← reemplaza el icono
    titulo: 'María García asignó esta tarea a Sara',
    etiqueta: Insignia({ texto: 'Asignación' }),
  },
]})`,
      })],
    }),

    // ============== 3. AUDIT LOG (compacta densa) ==============
    Seccion({
      titulo: '3 · Audit log (variante compacta)',
      descripcion: '`variante: compacta` — sin cards, dots de 14px, fechas más naturales. Para listas largas donde la densidad importa más que la jerarquía visual (logs, changelogs, eventos del sistema).',
      hijos: [VistaCodigo({
        vista: LineaTiempo({
          variante: 'compacta',
          items: [
            { fecha: 'hace 2 min',  titulo: 'María L. aprobó factura #4821',          mensaje: 'Importe: $1,420 · Status: Pagado', color: 'success' },
            { fecha: 'hace 14 min', titulo: 'Carlos R. subió un documento',           mensaje: 'contrato-acme-q3-2026.pdf · 2.4 MB', color: 'info' },
            { fecha: 'hace 1 h',    titulo: 'Backup automatizado completado',         mensaje: '14 GB respaldados a S3 · 3m 42s', color: 'primary' },
            { fecha: 'hace 3 h',    titulo: 'Ana T. cambió permisos del rol Editor', mensaje: 'Removió: delete_users · Añadió: read_billing', color: 'warning' },
            { fecha: 'hace 5 h',    titulo: 'Sistema reinició servicios',             mensaje: 'API · Database · Redis · Downtime: 47 segundos', color: 'danger' },
            { fecha: 'ayer',        titulo: 'Cron job de limpieza ejecutado',         mensaje: 'Eliminados 1,242 archivos temporales > 30 días', color: 'primary' },
            { fecha: '03 may',      titulo: 'Deploy a producción exitoso',            mensaje: 'v2.4.1 · Sin downtime · Smoke tests OK', color: 'success' },
          ],
        }),
        codigo: `LineaTiempo({
  variante: 'compacta',                    // sin cards · dots 14px
  items: [
    { fecha: 'hace 2 min', titulo: 'María L. aprobó factura',
      color: 'success' },
    { fecha: 'hace 14 min', titulo: 'Carlos R. subió documento',
      color: 'info' },
  ],
})`,
      })],
    }),

    // ============== 4. ROADMAP CON FUTUROS ==============
    Seccion({
      titulo: '4 · Roadmap con eventos futuros (pendiente: true)',
      descripcion: 'Los eventos completados llevan icono filled con gradient + sombra. Los futuros usan `pendiente: true` que cambia el icono a outline dashed con texto atenuado al 70%.',
      hijos: [VistaCodigo({
        vista: LineaTiempo({ items: [
          { fecha: 'Q1 2026 · ✓',  titulo: 'Lanzamiento v1.0', color: 'success',
            mensaje: '4,500 usuarios beta convertidos a paid. NPS 72.', icono: Icono('check', { tamano: 14 }) },
          { fecha: 'Q2 2026 · ✓',  titulo: 'Expansión a LATAM', color: 'success',
            mensaje: 'Localización ES/PT + payment processors regionales (Mercado Pago, PIX).', icono: Icono('globo', { tamano: 14 }) },
          { fecha: 'Q3 2026 · en curso', titulo: 'API pública v2', color: 'primary',
            mensaje: 'Webhooks, OAuth 2.0, SDK oficiales (Node, Python, Go). Beta privada en julio.', icono: Icono('utilidades', { tamano: 14 }) },
          { fecha: 'Q4 2026', titulo: 'App móvil nativa', pendiente: true,
            mensaje: 'iOS y Android con sincronización offline-first. Beta en TestFlight.', icono: Icono('proyectos', { tamano: 14 }) },
          { fecha: 'Q1 2027', titulo: 'Marketplace de plugins', pendiente: true,
            mensaje: 'La comunidad publica extensiones. Revenue share 70/30.', icono: Icono('iconos', { tamano: 14 }) },
        ]}),
        codigo: `// Eventos futuros con pendiente: true
{
  fecha: 'Q4 2026',
  titulo: 'App móvil nativa',
  pendiente: true,                         // outline dashed + texto al 70%
  icono: Icono('proyectos'),
}`,
      })],
    }),

    // ============== 5. MILESTONES CENTRADA (zigzag) ==============
    Seccion({
      titulo: '5 · Milestones (variante centrada — zigzag)',
      descripcion: '`variante: centrada` alterna izquierda/derecha. Línea conectora con gradient (primary → muted). En móvil colapsa a una sola columna para que los textos no se aplasten.',
      hijos: [VistaCodigo({
        vista: LineaTiempo({
          variante: 'centrada',
          items: [
            { fecha: '2018', titulo: 'Fundación', mensaje: 'Tres co-founders, una garage en Lima. Bootstrapped.',
              color: 'primary', icono: Icono('brillos', { tamano: 14 }) },
            { fecha: '2020', titulo: 'Series A', mensaje: '$8M para escalar el equipo de engineering.',
              color: 'success', icono: Icono('precios', { tamano: 14 }) },
            { fecha: '2022', titulo: 'Expansión LATAM', mensaje: 'Oficinas en CDMX, Bogotá y Buenos Aires.',
              color: 'info', icono: Icono('globo', { tamano: 14 }) },
            { fecha: '2024', titulo: 'Adquisición de Quantix', mensaje: 'Integramos su tecnología de ML al producto core.',
              color: 'warning', icono: Icono('mas', { tamano: 14 }) },
            { fecha: '2026', titulo: 'IPO', mensaje: 'Listada en NASDAQ con ticker $LCHP.',
              color: 'success', icono: Icono('check', { tamano: 14 }) },
          ],
        }),
        codigo: `LineaTiempo({
  variante: 'centrada',                    // ← alterna left/right
  items: [
    { fecha: '2018', titulo: 'Fundación', color: 'primary' },
    { fecha: '2020', titulo: 'Series A',  color: 'success' },
  ],
})`,
      })],
    }),

    // ============== 6. NOTIFICACIONES CON ACCIONES (default) ==============
    Seccion({
      titulo: '6 · Notificaciones con acciones inline',
      descripcion: 'Cada item tiene avatar de servicio (Stripe, GitHub, Sistema), mensaje rico, badges Insignia y botones de acción inline. Hover destaca la card con borde primary.',
      hijos: [VistaCodigo({
        vista: LineaTiempo({ items: [
          {
            fecha: 'hace 5 min',
            avatar: Avatar({ nombre: 'Stripe', tamano: 'md', forma: 'cuadrado' }),
            titulo: 'Pago recibido — $129.00 USD',
            mensaje: 'María García pagó la factura #4821 con tarjeta •••• 4242.',
            etiqueta: Insignia({ texto: 'Confirmado', variante: 'success' }),
            acciones: [
              Boton({ texto: 'Ver factura', variante: 'secondary', tamano: 'sm' }),
              Boton({ texto: 'Reembolsar',  variante: 'ghost',     tamano: 'sm' }),
            ],
          },
          {
            fecha: 'hace 1 h',
            avatar: Avatar({ nombre: 'GitHub', tamano: 'md', forma: 'cuadrado' }),
            titulo: 'Pull request listo para revisión',
            mensaje: 'Sara Chen pidió tu review en #142 — feat(auth): OAuth providers',
            etiqueta: Insignia({ texto: 'Review', variante: 'primary' }),
            acciones: [
              Boton({ texto: 'Revisar PR', variante: 'primary', tamano: 'sm' }),
              Boton({ texto: 'Más tarde',  variante: 'ghost',   tamano: 'sm' }),
            ],
          },
          {
            fecha: 'hace 3 h',
            avatar: Avatar({ nombre: 'Sistema', tamano: 'md', forma: 'cuadrado' }),
            titulo: 'Backup semanal completado',
            mensaje: '14.2 GB respaldados a S3. Próximo backup automático: domingo 03:00.',
            adjuntos: [
              { icono: Icono('descargar', { tamano: 11 }), nombre: 'backup-2026-w19.tar.gz', tamano: '14.2 GB' },
            ],
          },
        ]}),
        codigo: `{
  fecha: 'hace 5 min',
  avatar: Avatar({ nombre, forma: 'cuadrado' }),
  titulo: 'Pago recibido — $129.00',
  mensaje: 'María García pagó la factura…',
  etiqueta: Insignia({ texto: 'Confirmado', variante: 'success' }),
  adjuntos: [{ icono, nombre, tamano }],
  acciones: [Boton('Ver factura'), Boton('Reembolsar')],
}`,
      })],
    }),

    // ============== 7. GLASS — sobre gradient ==============
    Seccion({
      titulo: '7 · Glass (cards translúcidas sobre gradient)',
      descripcion: '`variante: glass` — fondo con gradient azul/violeta + cards translúcidas con `backdrop-filter: blur(8px)`. Patrón usado por landings de productos premium para "nuestro recorrido" o feature highlights.',
      hijos: [VistaCodigo({
        vista: LineaTiempo({
          variante: 'glass',
          items: [
            { fecha: 'Lanzamiento', titulo: 'Producto v1', color: 'primary',
              mensaje: 'Lanzamos con 50 usuarios beta. Las primeras 24h fueron tensas.', icono: Icono('brillos', { tamano: 14 }) },
            { fecha: '6 meses', titulo: '10K usuarios activos', color: 'success',
              mensaje: 'Hit de Product Hunt + viral en HN. Crecimiento orgánico al 38% mensual.', icono: Icono('analitica', { tamano: 14 }) },
            { fecha: '1 año', titulo: 'Series A · $12M', color: 'success',
              mensaje: 'Sequoia liderando la ronda. 4 nuevas oficinas en Latam.', icono: Icono('precios', { tamano: 14 }) },
            { fecha: 'Hoy', titulo: '500K usuarios · 38 países', color: 'warning',
              mensaje: 'Estamos donde imaginamos llegar en 5 años.', icono: Icono('estrella', { tamano: 14 }) },
          ],
        }),
        codigo: `LineaTiempo({
  variante: 'glass',                       // gradient bg + cards translúcidas
  items: [...],
})

/* CSS:
.linea-tiempo--glass {
  background: linear-gradient(135deg,
    color-mix(in srgb, var(--primary) 10%, transparent),
    color-mix(in srgb, #8b5cf6 10%, transparent));
}
.linea-tiempo--glass .linea-tiempo__cuerpo {
  backdrop-filter: blur(8px);
} */`,
      })],
    }),

    // ============== 8. SIMPLE — sin chrome ==============
    Seccion({
      titulo: '8 · Simple (sin cards) — version history',
      descripcion: '`variante: simple` quita el background y borde de cada item. Patrón minimalista para changelogs, version pickers, listas de cambios.',
      hijos: [VistaCodigo({
        vista: LineaTiempo({
          variante: 'simple',
          items: [
            { fecha: 'Hoy', titulo: 'v2.4.1', mensaje: 'Fix: el botón de exportar no respondía en Safari.',
              color: 'success', icono: Icono('check', { tamano: 14 }) },
            { fecha: 'Ayer', titulo: 'v2.4.0', mensaje: 'Soporte de webhooks. Mejoras en el dashboard.',
              color: 'primary', icono: Icono('mas', { tamano: 14 }) },
            { fecha: '02 may', titulo: 'v2.3.2', mensaje: 'Performance: reducimos el time-to-interactive en 40%.',
              color: 'info', icono: Icono('reloj', { tamano: 14 }) },
            { fecha: '28 abr',  titulo: 'v2.3.1', mensaje: 'Hotfix de seguridad — actualiza inmediatamente.',
              color: 'danger', icono: Icono('alerta', { tamano: 14 }) },
            { fecha: '21 abr',  titulo: 'v2.3.0', mensaje: 'Multi-workspace + roles avanzados.',
              color: 'primary', icono: Icono('grupos', { tamano: 14 }) },
          ],
        }),
        codigo: `LineaTiempo({
  variante: 'simple',                      // sin cards, sólo texto
  items: [
    { fecha: 'Hoy',  titulo: 'v2.4.1', mensaje: 'Fix Safari…', color: 'success' },
    { fecha: 'Ayer', titulo: 'v2.4.0', mensaje: 'Webhooks…',   color: 'primary' },
  ],
})`,
      })],
    }),

    // ============== 9. CV / RESUME ==============
    Seccion({
      titulo: '9 · CV / Resume timeline',
      descripcion: 'Cada item es un trabajo o estudio. Período + empresa + rol + descripción + badge "Actual" en el primero. Patrón LinkedIn / portfolio personal.',
      hijos: [VistaCodigo({
        vista: LineaTiempo({ items: [
          {
            fecha: '2024 — Presente',
            titulo: 'Senior Designer · Acme Corp',
            etiqueta: Insignia({ texto: 'Actual', variante: 'success' }),
            mensaje: 'Liderando el rediseño del producto principal. Equipo de 4 designers + 12 engineers.',
            icono: Icono('estrella', { tamano: 14 }), color: 'primary',
          },
          {
            fecha: '2021 — 2024',
            titulo: 'Product Designer · Stripe',
            mensaje: 'Diseñé el dashboard de Stripe Atlas y el flujo de onboarding internacional. Reduje el time-to-first-payment de 14 a 4 días.',
            icono: Icono('comercio', { tamano: 14 }),
          },
          {
            fecha: '2018 — 2021',
            titulo: 'UI Designer · Figma (early team)',
            mensaje: 'Entré como #34. Trabajé en Auto Layout, Variants y el sistema de plugins. La app pasó de 100k a 4M usuarios.',
            icono: Icono('iconos', { tamano: 14 }),
          },
          {
            fecha: '2015 — 2018',
            titulo: 'BFA Diseño Gráfico · Parsons',
            mensaje: 'Especialización en interaction design. Tesis sobre accesibilidad en interfaces de productividad.',
            icono: Icono('estudiante', { tamano: 14 }),
          },
        ]}),
        codigo: `LineaTiempo({ items: [
  {
    fecha: '2024 — Presente',
    titulo: 'Senior Designer · Acme Corp',
    etiqueta: Insignia({ texto: 'Actual', variante: 'success' }),
    mensaje: 'Liderando el rediseño…',
    color: 'primary',
  },
]})`,
      })],
    }),

    // ============== 10. HORIZONTAL (order tracking) ==============
    Seccion({
      titulo: '10 · Horizontal — order tracking / wizard steps',
      descripcion: '`LineaTiempoHorizontal` muestra pasos secuenciales. Completados con gradient verde + sombra, activo con ring primary + scale(1.05), futuros grises. Línea conectora con `scaleX(0→1)` cuando se completa.',
      hijos: [VistaCodigo({
        vista: LineaTiempoHorizontal({
          pasos: [
            { titulo: 'Pedido', mensaje: 'Recibido', icono: Icono('check', { tamano: 18 }), completado: true },
            { titulo: 'Pago',   mensaje: 'Confirmado', icono: Icono('check', { tamano: 18 }), completado: true },
            { titulo: 'Empaquetado', mensaje: 'En almacén', icono: Icono('check', { tamano: 18 }), completado: true },
            { titulo: 'En camino',   mensaje: 'Tracking activo', icono: Icono('flecha_r', { tamano: 18 }), activo: true },
            { titulo: 'Entregado',   mensaje: 'Pendiente' },
          ],
        }),
        codigo: `LineaTiempoHorizontal({
  pasos: [
    { titulo: 'Pedido',     completado: true, icono: Icono('check') },
    { titulo: 'Pago',       completado: true, icono: Icono('check') },
    { titulo: 'En camino',  activo: true,    icono: Icono('flecha_r') },
    { titulo: 'Entregado' },                 // futuro · gris
  ],
})`,
      })],
    }),

  ],
});
