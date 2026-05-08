import { crearEl } from '../../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../../components/ui/code-preview/code-preview.js';
import { Icono } from '../../../../components/ui/icon/icons.js';
import { corner4 } from '../../../../components/ui/card/card-decoraciones.js';
import { Check, CheckCard, Switch, Stack, Grid2 } from '../_compartido.js';

export default async () => PaginaShowcase({
  titulo: 'Checks · Radios · Switches',
  descripcion: 'Inputs binarios y de selección — checkbox tri-state (con :indeterminate), radio buttons, toggle switches y check-cards. Todos custom-styled, accesibles por teclado, con focus rings y animaciones.',
  decoracion: corner4(),
  migas: [
    { etiqueta: 'Módulos', href: '#/modulos' },
    { etiqueta: 'Formularios', href: '#/modulos/forms' },
  ],
  hijos: [

    Seccion({
      titulo: '1 · Checkbox básicos',
      descripcion: 'Custom-styled vía `appearance: none` + `:checked::after` con un check SVG. Soporta keyboard (Space toggle, Tab focus).',
      hijos: [VistaCodigo({
        vista: Stack(
          Check({ checked: true, label: 'Acepto los términos y condiciones' }),
          Check({ label: 'Suscribirme al newsletter mensual' }),
          Check({ checked: true, label: 'Recordar mi sesión', descripcion: 'Mantenerme conectado en este dispositivo' }),
          Check({ deshabilitado: true, label: 'Opción no disponible' }),
          Check({ checked: true, deshabilitado: true, label: 'Plan gratuito (incluido)', descripcion: 'No puedes desactivar features incluidas' }),
        ),
        codigo: `Check({ checked: true, label: 'Acepto los términos y condiciones' })
Check({ label: 'Newsletter', descripcion: 'Recibe novedades…' })
Check({ deshabilitado: true, label: 'No disponible' })`,
      })],
    }),

    Seccion({
      titulo: '2 · Checkbox indeterminate (tri-state)',
      descripcion: 'El estado intermedio aparece cuando algunos hijos están marcados (no todos). Patrón de "selección parcial" en file managers, tablas, etc.',
      hijos: [VistaCodigo({
        vista: (() => {
          const padre = crearEl('input', { type: 'checkbox', class: 'check-input' });
          padre.indeterminate = true;
          return Stack(
            crearEl('label', { class: 'check' }, [padre, crearEl('span', { class: 'check__label' }, [
              crearEl('span', { class: 'check__label-titulo' }, ['Seleccionar todos']),
              crearEl('span', { class: 'check__label-desc' }, ['2 de 4 marcados']),
            ])]),
            crearEl('div', { style: { paddingInlineStart: '28px', display: 'flex', flexDirection: 'column', gap: '8px' } }, [
              Check({ checked: true, label: 'Reporte trimestral.pdf' }),
              Check({ checked: true, label: 'Métricas Q3.xlsx' }),
              Check({ label: 'Presentación inversionistas.key' }),
              Check({ label: 'Hoja de ruta 2026.docx' }),
            ]),
          );
        })(),
        codigo: `// Estado indeterminate (no se setea via HTML, requiere JS)
const padre = <input type="checkbox" />;
padre.indeterminate = true;`,
      })],
    }),

    Seccion({
      titulo: '3 · Radios — selección única',
      descripcion: 'Mismo `name` agrupa los radios; solo uno puede estar activo. Para listas largas considera Select.',
      hijos: [VistaCodigo({
        vista: Grid2(
          crearEl('div', null, [
            crearEl('div', { style: { fontSize: 'var(--text-sm)', fontWeight: 600, marginBlockEnd: '10px' } }, ['Frecuencia de pago']),
            Stack(
              Check({ tipo: 'radio', name: 'frec', value: 'mensual', checked: true, label: 'Mensual', descripcion: '$29 / mes' }),
              Check({ tipo: 'radio', name: 'frec', value: 'anual', label: 'Anual', descripcion: '$290 / año (-17%)' }),
              Check({ tipo: 'radio', name: 'frec', value: 'lifetime', label: 'Lifetime', descripcion: 'Pago único $999' }),
            ),
          ]),
          crearEl('div', null, [
            crearEl('div', { style: { fontSize: 'var(--text-sm)', fontWeight: 600, marginBlockEnd: '10px' } }, ['Tema preferido']),
            Stack(
              Check({ tipo: 'radio', name: 'tema', value: 'auto', checked: true, label: 'Automático', descripcion: 'Sigue las preferencias del sistema' }),
              Check({ tipo: 'radio', name: 'tema', value: 'claro', label: 'Claro' }),
              Check({ tipo: 'radio', name: 'tema', value: 'oscuro', label: 'Oscuro' }),
            ),
          ]),
        ),
        codigo: `Check({ tipo: 'radio', name: 'frec', value: 'mensual', checked: true,
  label: 'Mensual', descripcion: '$29 / mes' })`,
      })],
    }),

    Seccion({
      titulo: '4 · Check-cards — selectables grandes',
      descripcion: 'Patrón de wizards / paywalls — la TODA la tarjeta es clickable, borde azul cuando está seleccionada, ícono opcional. Mejor que radios chicos para opciones importantes.',
      hijos: [VistaCodigo({
        vista: Grid2(
          CheckCard({ tipo: 'radio', name: 'plan', value: 'free', titulo: 'Free', descripcion: '1 usuario · 3 proyectos · soporte comunidad', icono: Icono('estrella', { tamano: 16 }) }),
          CheckCard({ tipo: 'radio', name: 'plan', value: 'pro', checked: true, titulo: 'Pro · $29/mes', descripcion: '10 usuarios · proyectos ilimitados · soporte 24h', icono: Icono('rocket', { tamano: 16 }) }),
          CheckCard({ tipo: 'radio', name: 'plan', value: 'team', titulo: 'Team · $99/mes', descripcion: 'Usuarios ilimitados · SSO · audit logs', icono: Icono('grupos', { tamano: 16 }) }),
          CheckCard({ tipo: 'radio', name: 'plan', value: 'ent', titulo: 'Enterprise', descripcion: 'Custom contract · dedicado · SLA 99.99%', icono: Icono('seguridad', { tamano: 16 }) }),
        ),
        codigo: `CheckCard({
  tipo: 'radio', name: 'plan', value: 'pro', checked: true,
  titulo: 'Pro · $29/mes',
  descripcion: '10 usuarios · proyectos ilimitados · soporte 24h',
  icono: Icono('rocket'),
})`,
      })],
    }),

    Seccion({
      titulo: '5 · Switches — toggles',
      descripcion: 'Para activar/desactivar features. La animación cubic-bezier(1.56) da el bounce sutil del thumb. Usa switches para acciones que se aplican inmediato; usa checkboxes para opciones que se confirman con submit.',
      hijos: [VistaCodigo({
        vista: Stack(
          Switch({ checked: true, label: 'Notificaciones por email', descripcion: 'Te enviaremos un resumen semanal' }),
          Switch({ label: 'Notificaciones push' }),
          Switch({ checked: true, label: 'Modo público', descripcion: 'Tu perfil será visible para cualquiera' }),
          Switch({ label: '2-factor authentication', descripcion: 'Recomendado para mayor seguridad' }),
          Switch({ checked: true, deshabilitado: true, label: 'API access', descripcion: 'Incluido en tu plan' }),
          Switch({ tamano: 'lg', checked: true, label: 'Switch grande', descripcion: 'Para preferencias críticas' }),
        ),
        codigo: `Switch({ checked: true, label: 'Notificaciones', descripcion: '...' })
Switch({ tamano: 'lg' })`,
      })],
    }),

    Seccion({
      titulo: '6 · Switch group — settings panel',
      descripcion: 'Un patrón típico de página de configuración — varios switches alineados en una tarjeta con divisores.',
      hijos: [VistaCodigo({
        vista: crearEl('div', {
          style: { maxWidth: '520px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' },
        }, [
          ['Email digest semanal',     'Resumen cada lunes a las 9am',  true],
          ['Recordatorios de tarea',    'Notifica 1h antes del deadline', true],
          ['Mentions en comentarios',   'Cuando alguien te @menciona',    true],
          ['Updates de producto',        'Anuncios de nuevas features',    false],
          ['Marketing emails',           'Newsletters y ofertas',          false],
        ].map(([t, d, on], i, arr) => crearEl('div', {
          style: {
            padding: '14px 18px',
            borderBlockEnd: i === arr.length - 1 ? 0 : '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
          },
        }, [
          crearEl('div', null, [
            crearEl('div', { style: { fontWeight: 600, fontSize: 'var(--text-sm)' } }, [t]),
            crearEl('div', { style: { fontSize: '12px', color: 'var(--muted-foreground)', marginBlockStart: '2px' } }, [d]),
          ]),
          Switch({ checked: on }),
        ]))),
        codigo: `// Settings panel pattern: lista de filas cada una con switch
<div class="settings-card">
  {items.map(it => (
    <div class="row">
      <div>{it.titulo + descripcion}</div>
      <Switch checked={it.activo} />
    </div>
  ))}
</div>`,
      })],
    }),

  ],
});
