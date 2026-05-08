import { crearEl } from '../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { Tooltip } from '../../../components/ui/tooltip/tooltip.js';
import { Boton } from '../../../components/ui/button/button.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { corner7 } from '../../../components/ui/card/card-decoraciones.js';

const fila = (...nodos) => crearEl('div', {
  style: { display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' },
}, nodos);

const stack = (...nodos) => crearEl('div', {
  style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' },
}, nodos);

// Helper: botón de icono compacto
const iconoBtn = (icono, label) => crearEl('button', {
  type: 'button',
  'aria-label': label,
  style: {
    width: '36px', height: '36px',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    color: 'var(--foreground)', cursor: 'pointer',
  },
}, [Icono(icono, { tamano: 16 })]);

const iconoInfo = () => crearEl('button', {
  type: 'button', 'aria-label': 'Ayuda',
  style: {
    width: '18px', height: '18px',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    background: 'transparent', border: 0, padding: 0,
    color: 'var(--muted-foreground)', cursor: 'help',
  },
}, [Icono('info', { tamano: 14 })]);

export default async () => PaginaShowcase({
  titulo: 'Tooltips',
  descripcion: 'Información contextual al hacer hover o ganar foco. CSS-only (sin JS), 4 posiciones, 3 temas (oscuro/claro/primary), tooltips ricos con título+descripción, atajos de teclado integrados, flecha indicadora opcional. Aparecen con escala suave + delay configurable. Accesibles vía teclado (focus-visible/within).',
  decoracion: corner7(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    // ============== 1. SOBRE BOTONES ==============
    Seccion({
      titulo: '1 · Sobre botones',
      descripcion: 'Texto corto descriptivo arriba del botón. Aparece al hover o cuando el botón gana foco con teclado.',
      hijos: [VistaCodigo({
        vista: fila(
          Tooltip({ texto: 'Editar entrada',           hijos: Boton({ texto: 'Editar',    variante: 'secondary' }) }),
          Tooltip({ texto: 'Eliminar definitivamente', hijos: Boton({ texto: 'Eliminar',  variante: 'danger' }) }),
          Tooltip({ texto: 'Compartir con tu equipo',  hijos: Boton({ texto: 'Compartir', variante: 'ghost' }) }),
          Tooltip({ texto: 'Duplicar este registro',   hijos: Boton({ texto: 'Duplicar',  variante: 'secondary' }) }),
        ),
        codigo: `Tooltip({
  texto: 'Editar entrada',
  hijos: Boton({ texto: 'Editar' }),
})`,
      })],
    }),

    // ============== 2. ICONOS EN TOOLBAR ==============
    Seccion({
      titulo: '2 · Iconos en toolbar (caso #1 de uso)',
      descripcion: 'El patrón canónico — los botones de icono SIN tooltip son inutilizables, el tooltip aclara qué hace cada uno.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: {
          display: 'inline-flex', gap: '4px', padding: 'var(--space-1)',
          background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
        } }, [
          Tooltip({ texto: 'Buscar',          hijos: iconoBtn('busqueda', 'Buscar') }),
          Tooltip({ texto: 'Notificaciones', hijos: iconoBtn('campana', 'Notificaciones') }),
          Tooltip({ texto: 'Configuración',  hijos: iconoBtn('utilidades', 'Configuración') }),
          Tooltip({ texto: 'Compartir',      hijos: iconoBtn('subir', 'Compartir') }),
          Tooltip({ texto: 'Descargar',      hijos: iconoBtn('descargar', 'Descargar') }),
          Tooltip({ texto: 'Cerrar sesión',  hijos: iconoBtn('cerrar_sesion', 'Cerrar sesión') }),
        ]),
        codigo: `Tooltip({
  texto: 'Buscar',
  hijos: iconoBtn('busqueda', 'Buscar'),     // botón con aria-label
})`,
      })],
    }),

    // ============== 3. CON ATAJOS DE TECLADO ==============
    Seccion({
      titulo: '3 · Con atajos de teclado (kbd)',
      descripcion: '`atajo: "⌘K"` agrega una pill `<kbd>` al lado del texto. Patrón Linear / VS Code / Notion — comunica "esto también está disponible con el teclado".',
      hijos: [VistaCodigo({
        vista: fila(
          Tooltip({ texto: 'Buscar',         atajo: '⌘K',     hijos: iconoBtn('busqueda', 'Buscar') }),
          Tooltip({ texto: 'Guardar',        atajo: '⌘S',     hijos: Boton({ texto: 'Guardar', variante: 'primary' }) }),
          Tooltip({ texto: 'Nuevo proyecto', atajo: '⌘⇧N',    hijos: Boton({ texto: 'Nuevo', variante: 'secondary' }) }),
          Tooltip({ texto: 'Eliminar',       atajo: 'Del',     hijos: iconoBtn('papelera', 'Eliminar') }),
          Tooltip({ texto: 'Deshacer',       atajo: '⌘Z',     hijos: iconoBtn('flechas_lr', 'Deshacer') }),
        ),
        codigo: `Tooltip({
  texto: 'Buscar',
  atajo: '⌘K',                              // ← pill kbd a la derecha
  hijos: botonBuscar,
})`,
      })],
    }),

    // ============== 4. POSICIONES ==============
    Seccion({
      titulo: '4 · 4 posiciones',
      descripcion: '`posicion: top` (default) · `bottom` · `left` · `right`. La animación de entrada se origina desde el lado opuesto al que apunta.',
      hijos: [VistaCodigo({
        vista: crearEl('div', {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, max-content)',
            gap: 'var(--space-6)',
            justifyContent: 'center',
            padding: 'var(--space-7) 0',
          },
        }, [
          Tooltip({ texto: 'Aparece arriba',     posicion: 'top',    hijos: Boton({ texto: 'Top ↑',    variante: 'secondary' }) }),
          Tooltip({ texto: 'Aparece abajo',      posicion: 'bottom', hijos: Boton({ texto: 'Bottom ↓', variante: 'secondary' }) }),
          Tooltip({ texto: 'Aparece izquierda',  posicion: 'left',   hijos: Boton({ texto: 'Left ←',   variante: 'secondary' }) }),
          Tooltip({ texto: 'Aparece derecha',    posicion: 'right',  hijos: Boton({ texto: 'Right →',  variante: 'secondary' }) }),
        ]),
        codigo: `Tooltip({ posicion: 'top',    hijos: ... })   // default
Tooltip({ posicion: 'bottom', hijos: ... })
Tooltip({ posicion: 'left',   hijos: ... })
Tooltip({ posicion: 'right',  hijos: ... })`,
      })],
    }),

    // ============== 5. TEMAS ==============
    Seccion({
      titulo: '5 · Temas (oscuro / claro / primary)',
      descripcion: 'Default `oscuro` (zinc 900) — máximo contraste. `claro` para fondos oscuros (modo dark del app). `primary` para tooltips de promoción/CTA.',
      hijos: [VistaCodigo({
        vista: fila(
          Tooltip({ texto: 'Tema oscuro (default)',  tema: 'oscuro',  hijos: Boton({ texto: 'Oscuro',  variante: 'secondary' }) }),
          Tooltip({ texto: 'Tema claro',             tema: 'claro',   hijos: Boton({ texto: 'Claro',   variante: 'secondary' }) }),
          Tooltip({ texto: 'Acento primary',         tema: 'primary', hijos: Boton({ texto: 'Primary', variante: 'secondary' }) }),
        ),
        codigo: `Tooltip({ tema: 'oscuro',  ... })   // default · zinc 900
Tooltip({ tema: 'claro',   ... })   // surface + border · para fondos oscuros
Tooltip({ tema: 'primary', ... })   // gradient azul · CTA / highlight`,
      })],
    }),

    // ============== 6. CON FLECHA ==============
    Seccion({
      titulo: '6 · Con flecha indicadora',
      descripcion: '`flecha: true` añade un pequeño triángulo apuntando al trigger. Visualmente conecta tooltip con su origen — útil cuando hay varios tooltips cercanos.',
      hijos: [VistaCodigo({
        vista: crearEl('div', {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, max-content)',
            gap: 'var(--space-6)',
            justifyContent: 'center',
            padding: 'var(--space-7) 0',
          },
        }, [
          Tooltip({ texto: 'Con flecha · top',    posicion: 'top',    flecha: true, hijos: Boton({ texto: 'Top',    variante: 'secondary' }) }),
          Tooltip({ texto: 'Con flecha · bottom', posicion: 'bottom', flecha: true, hijos: Boton({ texto: 'Bottom', variante: 'secondary' }) }),
          Tooltip({ texto: 'Con flecha · left',   posicion: 'left',   flecha: true, hijos: Boton({ texto: 'Left',   variante: 'secondary' }) }),
          Tooltip({ texto: 'Con flecha · right',  posicion: 'right',  flecha: true, hijos: Boton({ texto: 'Right',  variante: 'secondary' }) }),
        ]),
        codigo: `Tooltip({
  texto: 'Con flecha',
  flecha: true,                              // ← triángulo apuntando al trigger
  posicion: 'top',
})`,
      })],
    }),

    // ============== 7. RICO (TÍTULO + DESCRIPCIÓN) ==============
    Seccion({
      titulo: '7 · Rico — título + descripción multi-línea',
      descripcion: 'Cuando el contexto necesita más que una línea. `titulo` (bold arriba) + `descripcion` (texto debajo). El tooltip se vuelve multi-línea con `max-width: 220px`.',
      hijos: [VistaCodigo({
        vista: fila(
          Tooltip({
            titulo: 'Storage',
            descripcion: 'Has usado 1.2 GB de 2 GB. Cuando llegues al límite, te avisaremos por email con 7 días de antelación.',
            posicion: 'top', flecha: true,
            hijos: Boton({ texto: 'Storage info', variante: 'secondary' }),
          }),
          Tooltip({
            titulo: 'Plan Pro',
            descripcion: 'Proyectos ilimitados · 100 GB · Soporte prioritario en menos de 4 horas.',
            tema: 'primary',
            posicion: 'top', flecha: true,
            hijos: Boton({ texto: 'Upgrade', variante: 'primary' }),
          }),
          Tooltip({
            titulo: 'Conversión',
            descripcion: '4.78% en los últimos 7 días — un 32% mejor que el período anterior.',
            tema: 'claro',
            posicion: 'top', flecha: true,
            hijos: Boton({ texto: 'Ver métrica', variante: 'ghost' }),
          }),
        ),
        codigo: `Tooltip({
  titulo: 'Storage',
  descripcion: 'Has usado 1.2 GB de 2 GB. Cuando llegues al límite…',
  posicion: 'top', flecha: true,
  hijos: ...,
})`,
      })],
    }),

    // ============== 8. ICONO INFO (HELP CONTEXTUAL) ==============
    Seccion({
      titulo: '8 · Icono ⓘ — help contextual',
      descripcion: 'Pequeños iconos de ayuda al lado de labels o métricas. Patrón formularios complejos (Stripe checkout, Settings de admin).',
      hijos: [VistaCodigo({
        vista: stack(
          crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-sm)' } }, [
            crearEl('strong', null, ['MRR (Monthly Recurring Revenue)']),
            Tooltip({
              titulo: 'MRR',
              descripcion: 'Ingreso recurrente mensual normalizado. Suma de todas las suscripciones activas convertidas a su equivalente mensual.',
              posicion: 'right', flecha: true, hijos: iconoInfo(),
            }),
            crearEl('span', { style: { color: 'var(--muted-foreground)' } }, [':']),
            crearEl('strong', { style: { color: 'var(--color-success)' } }, ['$48,290']),
          ]),
          crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-sm)' } }, [
            crearEl('strong', null, ['Churn rate']),
            Tooltip({
              titulo: 'Churn rate',
              descripcion: 'Porcentaje de clientes que cancelaron en el período. Calculado como (cancelaciones / clientes al inicio) × 100.',
              posicion: 'right', flecha: true, hijos: iconoInfo(),
            }),
            crearEl('span', { style: { color: 'var(--muted-foreground)' } }, [':']),
            crearEl('strong', { style: { color: 'var(--color-danger)' } }, ['2.1%']),
          ]),
          crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-sm)' } }, [
            crearEl('strong', null, ['LTV / CAC']),
            Tooltip({
              titulo: 'LTV / CAC ratio',
              descripcion: 'Lifetime Value dividido por Customer Acquisition Cost. >3 indica salud financiera; <1 significa pérdida en cada cliente.',
              posicion: 'right', flecha: true, hijos: iconoInfo(),
            }),
            crearEl('span', { style: { color: 'var(--muted-foreground)' } }, [':']),
            crearEl('strong', null, ['4.2×']),
          ]),
        ),
        codigo: `crearEl('div', null, [
  crearEl('strong', null, ['Churn rate']),
  Tooltip({
    titulo: 'Churn rate',
    descripcion: 'Porcentaje de clientes que cancelaron…',
    posicion: 'right', flecha: true,
    hijos: iconoInfo(),                     // ← botón ⓘ pequeño
  }),
])`,
      })],
    }),

    // ============== 9. EN FORM FIELDS ==============
    Seccion({
      titulo: '9 · Sobre form fields (label + ayuda)',
      descripcion: 'Para campos con validaciones complejas, ayuda contextual al lado del label. El tooltip explica el formato esperado, restricciones, ejemplos.',
      hijos: [VistaCodigo({
        vista: stack(
          crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '320px' } }, [
            crearEl('label', { style: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--muted-foreground)' } }, [
              crearEl('span', null, ['API KEY']),
              Tooltip({
                titulo: 'API Key',
                descripcion: 'Genérala desde Settings → Developers → API. Tiene el formato sk_live_… o sk_test_… (32 caracteres). Trátala como una contraseña.',
                posicion: 'right', flecha: true, hijos: iconoInfo(),
              }),
            ]),
            crearEl('input', {
              type: 'text', placeholder: 'sk_live_…',
              style: { padding: '8px 12px', fontSize: 'var(--text-sm)', background: 'var(--background)', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' },
            }),
          ]),
          crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '320px' } }, [
            crearEl('label', { style: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--muted-foreground)' } }, [
              crearEl('span', null, ['WEBHOOK URL']),
              Tooltip({
                titulo: 'URL del webhook',
                descripcion: 'Debe ser HTTPS y devolver 200 dentro de 5s. Reintentamos hasta 3 veces con backoff exponencial.',
                posicion: 'right', flecha: true, hijos: iconoInfo(),
              }),
            ]),
            crearEl('input', {
              type: 'url', placeholder: 'https://midominio.com/hooks',
              style: { padding: '8px 12px', fontSize: 'var(--text-sm)', background: 'var(--background)', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' },
            }),
          ]),
        ),
        codigo: `crearEl('label', null, [
  'API KEY',
  Tooltip({
    titulo: 'API Key',
    descripcion: 'Genérala desde Settings → Developers…',
    posicion: 'right', flecha: true,
    hijos: iconoInfo(),
  }),
])`,
      })],
    }),

    // ============== 10. SOBRE ELEMENTOS GENÉRICOS ==============
    Seccion({
      titulo: '10 · Sobre cualquier elemento (texto truncado, links, badges)',
      descripcion: 'Tooltip envuelve un nodo arbitrario. Útil para mostrar el texto completo de algo truncado, info de versión en un link, definición de un badge.',
      hijos: [VistaCodigo({
        vista: stack(
          crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: 'var(--text-sm)' } }, [
            crearEl('span', null, ['Última versión:']),
            Tooltip({
              titulo: 'v2.4.1',
              descripcion: 'Released 7 mayo 2026 · Fix Safari, mejoras en performance del dashboard.',
              posicion: 'top', flecha: true,
              hijos: crearEl('a', { href: '#', style: { color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 } }, ['v2.4.1']),
            }),
          ]),
          crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)', maxWidth: '400px' } }, [
            crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, ['Email:']),
            Tooltip({
              texto: 'maria.garcia.fernandez@launchpad.dev',
              hijos: crearEl('span', {
                style: {
                  fontSize: 'var(--text-sm)', fontWeight: 500,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  maxWidth: '180px', display: 'inline-block', cursor: 'help',
                },
              }, ['maria.garcia.fernandez@launchpad.dev']),
            }),
          ]),
          crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' } }, [
            crearEl('span', null, ['Estado del servicio:']),
            Tooltip({
              texto: 'Todos los servicios operativos · 99.99% uptime',
              tema: 'claro', posicion: 'top', flecha: true,
              hijos: crearEl('span', {
                style: {
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '3px 10px',
                  background: 'color-mix(in srgb, var(--color-success) 14%, transparent)',
                  color: 'var(--color-success)',
                  borderRadius: '999px',
                  fontSize: 'var(--text-xs)', fontWeight: 600,
                  cursor: 'help',
                },
              }, [
                crearEl('span', { style: { width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-success)' } }),
                'Operativo',
              ]),
            }),
          ]),
        ),
        codigo: `// Texto truncado con ellipsis — el tooltip muestra el completo
Tooltip({
  texto: 'maria.garcia.fernandez@launchpad.dev',
  hijos: crearEl('span', { style: {
    overflow: 'hidden', textOverflow: 'ellipsis',
    maxWidth: '180px', cursor: 'help',
  } }, [emailLargo]),
})

// Tooltip rico sobre un link de versión
Tooltip({
  titulo: 'v2.4.1',
  descripcion: 'Released 7 mayo · Fix Safari…',
  hijos: crearEl('a', { href: '/changelog' }, ['v2.4.1']),
})`,
      })],
    }),

  ],
});
