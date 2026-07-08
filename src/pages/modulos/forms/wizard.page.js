/**
 * Form wizards — 10 variantes profesionales para flujos multi-step.
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { corner4 } from '../../../components/ui/card/card-decoraciones.js';
import { Campo, Input, Textarea, Stack, Grid2, Switch } from './_compartido.js';
import {
  WizardHorizontal, WizardVertical, WizardProgreso, WizardTabs,
  WizardCards, WizardChat, WizardAcordeon, WizardBranching,
  WizardResumen, WizardCompacto,
} from './_wizard.js';

// ---------------------------------------------------------------------------
//  Pasos compartidos para wizards "estándar"
// ---------------------------------------------------------------------------
const pasoDatosBasicos = ({
  id: 'datos',
  titulo: 'Cuéntanos sobre ti',
  descripcion: 'Datos básicos para personalizar tu cuenta',
  contenido: ({ datos, set }) => Stack(
    Grid2(
      Campo({ label: 'Nombre', requerido: true,
        hijos: Input({ value: datos.nombre || 'María', onInput: (e) => set('nombre', e.target.value) }) }),
      Campo({ label: 'Apellido', requerido: true,
        hijos: Input({ value: datos.apellido || 'García', onInput: (e) => set('apellido', e.target.value) }) }),
    ),
    Campo({ label: 'Email', requerido: true,
      hijos: Input({ type: 'email', value: datos.email || 'maria@empresa.com', onInput: (e) => set('email', e.target.value) }) }),
  ),
  resumir: (datos) => `${datos.nombre || ''} ${datos.apellido || ''} · ${datos.email || ''}`,
});

const pasoEmpresa = ({
  id: 'empresa',
  titulo: 'Sobre tu empresa',
  descripcion: 'Información organizacional',
  contenido: ({ datos, set }) => Stack(
    Campo({ label: 'Nombre de la empresa',
      hijos: Input({ value: datos.empresa || 'Acme Inc.', onInput: (e) => set('empresa', e.target.value) }) }),
    Grid2(
      Campo({ label: 'Cargo',
        hijos: Input({ value: datos.cargo || 'CTO', onInput: (e) => set('cargo', e.target.value) }) }),
      Campo({ label: 'Tamaño',
        hijos: crearEl('select', { class: 'select', onChange: (e) => set('tamano', e.target.value) }, [
          crearEl('option', null, ['1-10']), crearEl('option', null, ['11-50']),
          crearEl('option', null, ['51-200']), crearEl('option', null, ['200+']),
        ]) }),
    ),
  ),
  resumir: (datos) => `${datos.empresa || '—'} · ${datos.cargo || '—'} · ${datos.tamano || '—'} empleados`,
});

const pasoPreferencias = ({
  id: 'prefs',
  titulo: 'Preferencias',
  descripcion: 'Personaliza tu experiencia',
  contenido: ({ datos, set }) => Stack(
    Switch({ label: 'Notificaciones por email', descripcion: 'Resumen semanal',
      checked: datos.notif !== false, onChange: (e) => set('notif', e.target.checked) }),
    Switch({ label: 'Marketing', descripcion: 'Tips, novedades',
      checked: datos.mkt || false, onChange: (e) => set('mkt', e.target.checked) }),
  ),
  resumir: (datos) => `${datos.notif !== false ? '✓' : '✗'} Notif · ${datos.mkt ? '✓' : '✗'} Marketing`,
});

const pasosBase = [pasoDatosBasicos, pasoEmpresa, pasoPreferencias];

export default async () => PaginaShowcase({
  titulo: 'Form wizards',
  descripcion: '10 variantes profesionales de wizards multi-step. Cada una pensada para un contexto distinto: onboarding clásico, settings, encuestas, signup, modal compacto, chat conversacional, acordeón vertical, paths adaptativos, resumen final. Todos vanilla JS, comparten el mismo controller (validación + navegación + datos) pero renderizan distinto.',
  decoracion: corner4(),
  migas: [
    { etiqueta: 'Módulos', href: '#/modulos' },
    { etiqueta: 'Formularios', href: '#/modulos/forms' },
  ],
  hijos: [

    // ========== 1 ==========
    Seccion({
      titulo: '1 · Horizontal — stepper top con check / activo (Stripe)',
      descripcion: 'El más reconocido. Círculos numerados conectados con líneas, completados en verde con ✓, activo en color primary con halo. Botones Atrás/Siguiente abajo + indicador "Paso N de M".',
      hijos: [VistaCodigo({
        vista: WizardHorizontal({ pasos: pasosBase }),
        codigo: `import { WizardHorizontal } from './_wizard.js';

WizardHorizontal({
  pasos: [
    { id: 'datos', titulo: 'Cuéntanos sobre ti',
      contenido: ({ datos, set }) => <form>...</form>,
      validar: (d) => d.nombre && d.email },
    { id: 'empresa', titulo: 'Sobre tu empresa', contenido: ... },
    { id: 'prefs',   titulo: 'Preferencias',     contenido: ... },
  ],
  onComplete: (datos) => api.crearCuenta(datos),
})`,
      })],
    }),

    // ========== 2 ==========
    Seccion({
      titulo: '2 · Vertical — sidebar izq + form derecha (Linear)',
      descripcion: 'Stepper a la izquierda con líneas verticales conectando los pasos, contenido a la derecha. Mejor para pantallas amplias y wizards con muchos pasos (4+).',
      hijos: [VistaCodigo({
        vista: WizardVertical({ pasos: pasosBase }),
        codigo: `WizardVertical({ pasos: [...] })

// Mismo API que WizardHorizontal — solo cambia el layout
// Mejor para 4+ pasos o cuando el contenido es largo`,
      })],
    }),

    // ========== 3 ==========
    Seccion({
      titulo: '3 · Progreso — barra slim + "Paso N de M" (Typeform)',
      descripcion: 'Sin stepper visual — solo una barra delgada arriba con el porcentaje. Más limpio cuando el usuario no necesita saber qué viene después.',
      hijos: [VistaCodigo({
        vista: WizardProgreso({ pasos: pasosBase }),
        codigo: `WizardProgreso({ pasos: [...] })
// Sin stepper — solo barra de progreso + "Paso 2 de 3 · 67%"`,
      })],
    }),

    // ========== 4 ==========
    Seccion({
      titulo: '4 · Tabs — navegación libre entre pasos',
      descripcion: 'Tabs horizontales clickeables. El usuario puede saltar a cualquier paso libremente. Útil para edit settings donde no hay un orden estricto.',
      hijos: [VistaCodigo({
        vista: WizardTabs({ pasos: pasosBase }),
        codigo: `WizardTabs({ pasos: [...] })
// Tabs clickeables — el usuario puede ir y venir libremente`,
      })],
    }),

    // ========== 5 ==========
    Seccion({
      titulo: '5 · Cards — grid de tarjetas para "elige una opción"',
      descripcion: 'Cada paso es una pregunta de selección única con tarjetas grandes. Patrón onboarding "¿Cuál es tu rol?" → "¿Para qué lo usarás?". Visualmente más rico que radio buttons.',
      hijos: [VistaCodigo({
        vista: WizardCards({
          pasos: [
            {
              id: 'rol', titulo: '¿Cuál es tu rol?',
              descripcion: 'Esto nos ayuda a personalizar tu dashboard.',
              opciones: [
                { id: 'dev', titulo: 'Developer', desc: 'Backend, frontend, fullstack', icono: Icono('codigo', { tamano: 20 }) },
                { id: 'pm', titulo: 'Product Manager', desc: 'Roadmap, especificaciones', icono: Icono('panel', { tamano: 20 }) },
                { id: 'design', titulo: 'Designer', desc: 'UI/UX, gráficos', icono: Icono('paleta', { tamano: 20 }) },
                { id: 'mkt', titulo: 'Marketing', desc: 'Growth, analytics', icono: Icono('analitica', { tamano: 20 }) },
              ],
              contenido: () => crearEl('div'),
            },
            {
              id: 'uso', titulo: '¿Para qué usarás template-vanilla?',
              opciones: [
                { id: 'personal', titulo: 'Proyecto personal', desc: 'Solo yo', icono: Icono('perfil', { tamano: 20 }) },
                { id: 'equipo', titulo: 'Equipo pequeño', desc: '2-10 personas', icono: Icono('crm', { tamano: 20 }) },
                { id: 'empresa', titulo: 'Empresa grande', desc: '10+ personas', icono: Icono('panel', { tamano: 20 }) },
              ],
              contenido: () => crearEl('div'),
            },
            {
              id: 'plan', titulo: '¿Qué plan te interesa?',
              opciones: [
                { id: 'free', titulo: 'Free', desc: '$0/mes · 1 proyecto', icono: Icono('check', { tamano: 20 }) },
                { id: 'pro', titulo: 'Pro', desc: '$29/mes · 10 proyectos', icono: Icono('estrella', { tamano: 20 }) },
                { id: 'team', titulo: 'Team', desc: '$99/mes · ilimitado', icono: Icono('crm', { tamano: 20 }) },
              ],
              contenido: () => crearEl('div'),
            },
          ],
        }),
        codigo: `WizardCards({
  pasos: [{
    id: 'rol', titulo: '¿Cuál es tu rol?',
    opciones: [
      { id: 'dev', titulo: 'Developer', desc: '...', icono: ... },
      { id: 'pm',  titulo: 'Product Manager', ... },
      ...
    ],
  }, ...],
})`,
      })],
    }),

    // ========== 6 ==========
    Seccion({
      titulo: '6 · Chat — conversacional, una pregunta por slide (Calendly)',
      descripcion: 'Una pregunta a la vez con animación de entrada. Pregunta grande, input simple, botón Continuar. Patrón Typeform / Calendly book a meeting.',
      hijos: [VistaCodigo({
        vista: WizardChat({
          pasos: [
            {
              id: 'nombre',
              titulo: '¿Cómo te llamas?',
              descripcion: 'Solo lo usamos para personalizar el saludo.',
              contenido: ({ datos, set }) => Input({
                placeholder: 'Tu nombre…', value: datos.nombre || '', tamano: 'lg',
                onInput: (e) => set('nombre', e.target.value),
              }),
            },
            {
              id: 'email',
              titulo: 'Genial. ¿Cuál es tu email?',
              descripcion: 'Te enviaremos la confirmación aquí.',
              contenido: ({ datos, set }) => Input({
                type: 'email', placeholder: 'tu@empresa.com',
                value: datos.email || '', tamano: 'lg',
                onInput: (e) => set('email', e.target.value),
              }),
            },
            {
              id: 'msg',
              titulo: '¿Sobre qué quieres hablar?',
              descripcion: 'Cualquier detalle ayuda a preparar la reunión.',
              contenido: ({ datos, set }) => Textarea({
                placeholder: 'Cuéntanos un poco…', value: datos.msg || '', filas: 4,
                onInput: (e) => set('msg', e.target.value),
              }),
            },
          ],
        }),
        codigo: `WizardChat({
  pasos: [
    { id: 'nombre', titulo: '¿Cómo te llamas?',
      contenido: ({ datos, set }) => Input({ ... }) },
    ...
  ],
})
// Cada paso aparece con animación slide + scale`,
      })],
    }),

    // ========== 7 ==========
    Seccion({
      titulo: '7 · Acordeón — vertical, sólo el activo expandido (HubSpot)',
      descripcion: 'Cada paso es un acordeón. El activo está expandido con su form, los completados se muestran colapsados con check verde y se pueden revisitar. Los pendientes están grises.',
      hijos: [VistaCodigo({
        vista: WizardAcordeon({ pasos: pasosBase }),
        codigo: `WizardAcordeon({ pasos: [...] })
// Vertical accordion — estilo HubSpot Settings / Stripe Account Setup`,
      })],
    }),

    // ========== 8 ==========
    Seccion({
      titulo: '8 · Branching — paths adaptativos según respuestas',
      descripcion: 'Cada paso puede definir `siguiente: (datos) => idDelSiguiente`. Si eliges "Empresa" vas al paso "Datos fiscales"; si eliges "Personal" saltas directo al final. El stepper solo muestra los pasos visitados.',
      hijos: [VistaCodigo({
        vista: WizardBranching({
          pasos: [
            {
              id: 'tipo',
              titulo: '¿Tipo de cuenta?',
              contenido: ({ datos, set }) => Stack(
                ...['personal', 'empresa'].map((t) => crearEl('label', {
                  style: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', cursor: 'pointer' },
                }, [
                  crearEl('input', {
                    type: 'radio', name: 'tipo', class: 'check-input check-input--radio',
                    checked: datos.tipo === t || null,
                    onChange: () => set('tipo', t),
                  }),
                  crearEl('div', null, [
                    crearEl('div', { style: { fontWeight: 600, fontSize: '13px' } }, [t === 'personal' ? 'Cuenta personal' : 'Cuenta empresa']),
                    crearEl('div', { style: { fontSize: '12px', color: 'var(--muted-foreground)' } }, [t === 'personal' ? 'Solo para mí' : 'Para mi organización con datos fiscales']),
                  ]),
                ])),
              ),
              siguiente: (datos) => datos.tipo === 'empresa' ? 'fiscal' : 'finalizar',
            },
            {
              id: 'fiscal',
              titulo: 'Datos fiscales',
              descripcion: 'Solo para cuenta empresa',
              contenido: ({ datos, set }) => Stack(
                Campo({ label: 'RUC / NIF',
                  hijos: Input({ value: datos.ruc || '', onInput: (e) => set('ruc', e.target.value) }) }),
                Campo({ label: 'Razón social',
                  hijos: Input({ value: datos.razon || '', onInput: (e) => set('razon', e.target.value) }) }),
              ),
            },
            {
              id: 'finalizar',
              titulo: 'Listo',
              contenido: ({ datos }) => crearEl('div', {
                style: { padding: '20px', background: 'color-mix(in srgb, var(--color-success) 10%, transparent)', borderRadius: 'var(--radius)', textAlign: 'center' },
              }, [
                crearEl('div', { style: { fontSize: '28px', marginBlockEnd: '8px' } }, ['🎉']),
                crearEl('div', { style: { fontWeight: 600 } }, [
                  datos.tipo === 'empresa'
                    ? `Cuenta empresa ${datos.razon ? `"${datos.razon}" ` : ''}lista para crear`
                    : 'Cuenta personal lista para crear',
                ]),
              ]),
            },
          ],
        }),
        codigo: `WizardBranching({
  pasos: [
    { id: 'tipo', ...,
      siguiente: (datos) =>
        datos.tipo === 'empresa' ? 'fiscal' : 'finalizar',  // ramificación
    },
    { id: 'fiscal', ... },        // solo para empresa
    { id: 'finalizar', ... },
  ],
})`,
      })],
    }),

    // ========== 9 ==========
    Seccion({
      titulo: '9 · Resumen — review final + edit per-paso',
      descripcion: 'El último paso es un resumen de todo lo capturado, agrupado por paso. Cada fila tiene un "Editar" que te lleva al paso correspondiente. Usado en checkouts, signup completo, formularios largos.',
      hijos: [VistaCodigo({
        vista: WizardResumen({
          pasos: [
            ...pasosBase,
            {
              id: 'resumen', tipo: 'resumen',
              titulo: 'Revisa tus datos',
              descripcion: 'Verifica que todo sea correcto antes de confirmar.',
            },
          ],
        }),
        codigo: `WizardResumen({
  pasos: [
    { id: 'datos', ..., resumir: (d) => \`\${d.nombre} · \${d.email}\` },
    { id: 'empresa', ..., resumir: ... },
    { id: 'prefs',  ..., resumir: ... },
    { id: 'resumen', tipo: 'resumen', titulo: 'Revisa tus datos' },
  ],
})`,
      })],
    }),

    // ========== 10 ==========
    Seccion({
      titulo: '10 · Compacto — para modal / popover (Linear "Create issue")',
      descripcion: 'Wizard mini para flujos en modal: header con dots de progreso (el actual es una píldora alargada), título arriba, contenido al medio, acciones abajo. Estilo "Create new project" en Linear.',
      hijos: [VistaCodigo({
        vista: WizardCompacto({
          pasos: [
            {
              id: 'nombre',
              titulo: 'Nombre del proyecto',
              contenido: ({ datos, set }) => Input({
                placeholder: 'Mi nuevo proyecto', value: datos.nombre || '',
                onInput: (e) => set('nombre', e.target.value),
              }),
            },
            {
              id: 'desc',
              titulo: 'Descripción (opcional)',
              contenido: ({ datos, set }) => Textarea({
                placeholder: '¿De qué se trata?', filas: 3, value: datos.desc || '',
                onInput: (e) => set('desc', e.target.value),
              }),
            },
            {
              id: 'visibilidad',
              titulo: '¿Quién puede verlo?',
              contenido: ({ datos, set }) => Stack(
                ...[['priv', 'Privado', 'Solo tú'], ['equipo', 'Equipo', 'Toda tu organización'], ['pub', 'Público', 'Cualquiera con el link']].map(([id, lbl, desc]) => crearEl('label', {
                  style: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', cursor: 'pointer' },
                }, [
                  crearEl('input', {
                    type: 'radio', name: 'vis',
                    class: 'check-input check-input--radio check-input--sm',
                    checked: datos.vis === id || null,
                    onChange: () => set('vis', id),
                  }),
                  crearEl('div', null, [
                    crearEl('div', { style: { fontSize: '13px', fontWeight: 600 } }, [lbl]),
                    crearEl('div', { style: { fontSize: '11.5px', color: 'var(--muted-foreground)' } }, [desc]),
                  ]),
                ])),
              ),
            },
          ],
        }),
        codigo: `WizardCompacto({
  pasos: [
    { id: 'nombre', titulo: 'Nombre del proyecto', contenido: ... },
    { id: 'desc',   titulo: 'Descripción',         contenido: ... },
    { id: 'visibilidad', titulo: '¿Quién puede verlo?', contenido: ... },
  ],
})

// Diseñado para encajar en modal de ~380px
// Estilo Linear "Create issue" / Notion "New page"`,
      })],
    }),

  ],
});
