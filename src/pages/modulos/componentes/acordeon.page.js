import { crearEl } from '../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { Acordeon } from '../../../components/ui/accordion/accordion.js';
import { Insignia } from '../../../components/ui/badge/badge.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { corner1 } from '../../../components/ui/card/card-decoraciones.js';

const lorem = (txt) => crearEl('p', { style: { margin: 0 } }, [txt]);

const FAQ = [
  { id: 'a', titulo: '¿Qué es template-vanilla?',
    contenido: 'Una plantilla admin construida en JavaScript vanilla con primitivas reactivas propias (sin frameworks).' },
  { id: 'b', titulo: '¿Necesita build?',
    contenido: 'No. Funciona directamente abriendo el index.html — usa ES modules nativos y CSS imports.' },
  { id: 'c', titulo: '¿Cómo cambio el tema?',
    contenido: 'Toca el icono de sol/luna en la barra superior, o abre el panel de configuración (engranaje).' },
];

export default async () => PaginaShowcase({
  titulo: 'Acordeón',
  descripcion: 'Secciones colapsables con 4 variantes visuales, 3 tamaños, soporte de iconos, subtítulos, badges, items deshabilitados y modo único o múltiple. Animadas con `grid-template-rows` para una transición fluida sin saltos.',
  decoracion: corner1(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    // ============== DEFAULT ==============
    Seccion({
      titulo: 'Default · múltiples abiertos',
      descripcion: 'Variante base con borde envolvente y separadores entre items.',
      hijos: [VistaCodigo({
        vista: Acordeon({ iniciales: ['a'], items: FAQ }),
        codigo: `Acordeon({
  iniciales: ['a'],
  items: [
    { id: 'a', titulo: '¿Qué es template-vanilla?', contenido: '...' },
    { id: 'b', titulo: '¿Necesita build?',    contenido: '...' },
    { id: 'c', titulo: '¿Cómo cambio el tema?', contenido: '...' },
  ],
})`,
      })],
    }),

    // ============== ÚNICO ==============
    Seccion({
      titulo: 'Único panel abierto',
      descripcion: '`unico: true` cierra los demás al abrir uno (estilo FAQ tradicional).',
      hijos: [VistaCodigo({
        vista: Acordeon({ unico: true, iniciales: ['1'], items: [
          { id: '1', titulo: 'Sección 1', contenido: 'Sólo esta sección puede estar abierta a la vez.' },
          { id: '2', titulo: 'Sección 2', contenido: 'Al hacer click, esta se abre y la anterior se cierra automáticamente.' },
          { id: '3', titulo: 'Sección 3', contenido: 'Útil para FAQs o para limitar el espacio vertical.' },
        ]}),
        codigo: `Acordeon({ unico: true, iniciales: ['1'], items: [...] })`,
      })],
    }),

    // ============== CON ICONOS + SUBTÍTULOS ==============
    Seccion({
      titulo: 'Con iconos, subtítulos y badges',
      descripcion: 'Cada item puede llevar `icono`, `subtitulo` y `badge` para enriquecer la cabecera.',
      hijos: [VistaCodigo({
        vista: Acordeon({ iniciales: ['perfil'], items: [
          { id: 'perfil', titulo: 'Información personal', subtitulo: 'Nombre, email, teléfono',
            icono: Icono('perfil', { tamano: 18 }),
            contenido: 'Datos básicos asociados a tu cuenta. Sólo tú y los administradores pueden verlos.' },
          { id: 'seg', titulo: 'Seguridad', subtitulo: 'Contraseña y doble factor',
            icono: Icono('seguridad', { tamano: 18 }),
            badge: Insignia({ texto: 'Recomendado', variante: 'warning' }),
            contenido: 'Activa la autenticación en dos pasos para añadir una capa extra de protección.' },
          { id: 'avi', titulo: 'Avisos', subtitulo: 'Email y notificaciones push',
            icono: Icono('campana', { tamano: 18 }),
            badge: Insignia({ texto: '3 nuevos', variante: 'primary' }),
            contenido: 'Configura qué eventos disparan emails o notificaciones push en tu dispositivo.' },
        ]}),
        codigo: `Acordeon({
  items: [
    {
      id: 'perfil',
      titulo: 'Información personal',
      subtitulo: 'Nombre, email, teléfono',
      icono: Icono('perfil'),
      contenido: '...',
    },
    {
      id: 'seg',
      titulo: 'Seguridad',
      icono: Icono('seguridad'),
      badge: Insignia({ texto: 'Recomendado', variante: 'warning' }),
      contenido: '...',
    },
  ],
})`,
      })],
    }),

    // ============== VARIANTE FLUSH ==============
    Seccion({
      titulo: 'Variante flush',
      descripcion: 'Sin bordes externos. Útil cuando el acordeón ya vive dentro de una tarjeta o panel.',
      hijos: [VistaCodigo({
        vista: Acordeon({ variante: 'flush', items: FAQ }),
        codigo: `Acordeon({ variante: 'flush', items: [...] })`,
      })],
    }),

    // ============== VARIANTE BORDEADA ==============
    Seccion({
      titulo: 'Variante bordeada por intención',
      descripcion: 'Borde lateral coloreado por item — comunica visualmente la categoría/prioridad.',
      hijos: [VistaCodigo({
        vista: Acordeon({ variante: 'bordeada', iniciales: ['ok'], items: [
          { id: 'ok',   titulo: 'Operación exitosa', color: 'success', icono: Icono('check', { tamano: 18 }),
            contenido: 'Tu cambio se aplicó correctamente. Puedes verlo reflejado en el panel principal.' },
          { id: 'warn', titulo: 'Atención requerida', color: 'warning', icono: Icono('alerta', { tamano: 18 }),
            contenido: 'Hay items que requieren tu revisión antes de continuar con el deploy.' },
          { id: 'err',  titulo: 'Error crítico', color: 'danger', icono: Icono('alerta', { tamano: 18 }),
            contenido: 'La acción falló. Revisa el log de errores y verifica permisos.' },
          { id: 'info', titulo: 'Información', color: 'info', icono: Icono('info', { tamano: 18 }),
            contenido: 'Mantenimiento programado para el jueves a las 23:00.' },
        ]}),
        codigo: `Acordeon({
  variante: 'bordeada',
  items: [
    { id: 'ok',   titulo: '...', color: 'success', icono: Icono('check'),  contenido: '...' },
    { id: 'warn', titulo: '...', color: 'warning', icono: Icono('alerta'), contenido: '...' },
    { id: 'err',  titulo: '...', color: 'danger',  icono: Icono('alerta'), contenido: '...' },
    { id: 'info', titulo: '...', color: 'info',    icono: Icono('info'),   contenido: '...' },
  ],
})`,
      })],
    }),

    // ============== VARIANTE CON CARDS ==============
    Seccion({
      titulo: 'Variante con cards',
      descripcion: 'Cada item es una tarjeta independiente con sombra. El item abierto se eleva visualmente.',
      hijos: [VistaCodigo({
        vista: Acordeon({ variante: 'con-cards', iniciales: ['plan-pro'], items: [
          { id: 'plan-free', titulo: 'Plan Free',  subtitulo: '$0/mes',  icono: Icono('estrella', { tamano: 18 }),
            contenido: 'Hasta 3 proyectos. Soporte vía comunidad. Backups semanales.' },
          { id: 'plan-pro',  titulo: 'Plan Pro',   subtitulo: '$19/mes', icono: Icono('estrella', { tamano: 18 }),
            badge: Insignia({ texto: 'Popular', variante: 'primary' }),
            contenido: 'Proyectos ilimitados. Soporte prioritario por chat. Backups diarios. Métricas avanzadas.' },
          { id: 'plan-team', titulo: 'Plan Team',  subtitulo: '$49/mes/usuario', icono: Icono('grupos', { tamano: 18 }),
            contenido: 'Todo lo de Pro + colaboración en equipo, roles y permisos, auditoría completa.' },
        ]}),
        codigo: `Acordeon({ variante: 'con-cards', items: [...] })`,
      })],
    }),

    // ============== ICONO MÁS/MENOS ==============
    Seccion({
      titulo: 'Indicador más/menos',
      descripcion: '`iconoExpandir: "mas-menos"` reemplaza el chevron por un + que se transforma en − cuando se abre.',
      hijos: [VistaCodigo({
        vista: Acordeon({ iconoExpandir: 'mas-menos', items: FAQ }),
        codigo: `Acordeon({ iconoExpandir: 'mas-menos', items: [...] })`,
      })],
    }),

    // ============== TAMAÑOS ==============
    Seccion({
      titulo: 'Tamaños',
      descripcion: '`tamano: "sm" | "md" | "lg"` ajusta padding y tipografía.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' } }, [
          Acordeon({ tamano: 'sm', items: [{ id: 's1', titulo: 'Tamaño pequeño', contenido: 'Compacto, ideal para sidebars o paneles densos.' }]}),
          Acordeon({ tamano: 'md', items: [{ id: 's2', titulo: 'Tamaño mediano (default)', contenido: 'Balance entre densidad y legibilidad.' }]}),
          Acordeon({ tamano: 'lg', items: [{ id: 's3', titulo: 'Tamaño grande', subtitulo: 'Con más respiración', contenido: 'Padding generoso, ideal para hero sections o landing pages.' }]}),
        ]),
        codigo: `Acordeon({ tamano: 'sm', items: [...] })
Acordeon({ tamano: 'md', items: [...] })  // default
Acordeon({ tamano: 'lg', items: [...] })`,
      })],
    }),

    // ============== ITEMS DESHABILITADOS ==============
    Seccion({
      titulo: 'Items deshabilitados',
      descripcion: 'Marca `deshabilitado: true` para items que existen pero el usuario no puede expandir.',
      hijos: [VistaCodigo({
        vista: Acordeon({ items: [
          { id: 'd1', titulo: 'Disponible',                contenido: 'Este item se puede expandir normalmente.' },
          { id: 'd2', titulo: 'Bloqueado · Plan Pro',      deshabilitado: true,
            badge: Insignia({ texto: 'Pro', variante: 'muted' }),
            contenido: 'No accesible.' },
          { id: 'd3', titulo: 'Bloqueado · Pendiente verificación', deshabilitado: true,
            icono: Icono('candado', { tamano: 18 }),
            contenido: 'No accesible.' },
        ]}),
        codigo: `Acordeon({ items: [
  { id: 'd1', titulo: 'Disponible',  contenido: '...' },
  { id: 'd2', titulo: 'Bloqueado',   deshabilitado: true,
    badge: Insignia({ texto: 'Pro' }) },
]})`,
      })],
    }),

    // ============== ANIDADO ==============
    Seccion({
      titulo: 'Acordeón anidado',
      descripcion: 'Acordeones dentro de acordeones — el `contenido` acepta cualquier nodo.',
      hijos: [VistaCodigo({
        vista: Acordeon({ iniciales: ['n1'], items: [
          { id: 'n1', titulo: 'Configuración avanzada', icono: Icono('preferencias', { tamano: 18 }),
            contenido: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' } }, [
              lorem('Estas opciones afectan el comportamiento global de la app.'),
              Acordeon({ variante: 'flush', tamano: 'sm', items: [
                { id: 'n1a', titulo: 'Notificaciones por email',  contenido: 'Recibe un resumen diario de tu actividad.' },
                { id: 'n1b', titulo: 'Modo desarrollador',        contenido: 'Muestra logs adicionales en consola.' },
                { id: 'n1c', titulo: 'Beta features',             contenido: 'Activa funciones experimentales.' },
              ]}),
            ]),
          },
          { id: 'n2', titulo: 'Permisos del equipo', icono: Icono('grupos', { tamano: 18 }),
            contenido: 'Gestión de roles y accesos granulares por miembro.' },
        ]}),
        codigo: `Acordeon({ items: [
  {
    id: 'n1',
    titulo: 'Configuración avanzada',
    contenido: crearEl('div', null, [
      'Texto introductorio…',
      Acordeon({ variante: 'flush', tamano: 'sm', items: [...] }),  // nested
    ]),
  },
]})`,
      })],
    }),

    // ============== CONTENIDO RICO ==============
    Seccion({
      titulo: 'Contenido rico',
      descripcion: '`contenido` acepta cualquier nodo — listas, formularios, imágenes, otros componentes.',
      hijos: [VistaCodigo({
        vista: Acordeon({ items: [
          { id: 'r1', titulo: 'Lista de tareas',
            contenido: crearEl('ul', { style: { margin: 0, paddingInlineStart: '1.2rem' } }, [
              crearEl('li', null, ['Diseñar arquitectura del módulo']),
              crearEl('li', null, ['Implementar componentes base']),
              crearEl('li', null, ['Documentar API pública']),
              crearEl('li', null, ['Tests E2E + visual regression']),
            ]),
          },
          { id: 'r2', titulo: 'Formulario inline',
            contenido: crearEl('div', { style: { display: 'flex', gap: 'var(--space-2)' } }, [
              crearEl('input', { type: 'email', placeholder: 'tu@email.com',
                style: { flex: 1, padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--surface)', color: 'var(--foreground)' } }),
              crearEl('button', { type: 'button',
                style: { padding: '8px 16px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontWeight: '500', cursor: 'pointer' } },
                ['Suscribirme']),
            ]),
          },
        ]}),
        codigo: `Acordeon({ items: [
  { id: 'r1', titulo: 'Lista', contenido: crearEl('ul', null, [...]) },
  { id: 'r2', titulo: 'Form',  contenido: crearEl('div', null, [input, btn]) },
]})`,
      })],
    }),
  ],
});
