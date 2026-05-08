import { crearEl } from '../../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../../components/ui/code-preview/code-preview.js';
import { corner1 } from '../../../../components/ui/card/card-decoraciones.js';
import { Campo, Input, Textarea, Grid2, Stack } from '../_compartido.js';
import { ColorPicker, DatePicker, TimePicker, PhoneInput } from '../_pickers.js';

export default async () => PaginaShowcase({
  titulo: 'Form control',
  descripcion: 'Inputs base — text, email, password, number, search, url, tel, textarea — con tamaños xs/sm/md/lg/xl, estados (default, hover, focus, disabled, readonly, válido, inválido) y label + hint + error en cada campo. Cero JS, todo CSS. La base de cualquier form moderno.',
  decoracion: corner1(),
  migas: [
    { etiqueta: 'Módulos', href: '#/modulos' },
    { etiqueta: 'Formularios', href: '#/modulos/forms' },
  ],
  hijos: [

    // ========== 1. Tipos de input ==========
    Seccion({
      titulo: '1 · Tipos de input HTML5',
      descripcion: 'Cada `type` aporta validación nativa, teclado optimizado en móvil y autocompletado del browser. Úsalos siempre.',
      hijos: [VistaCodigo({
        vista: Grid2(
          Campo({ label: 'Texto',           hijos: Input({ type: 'text',     placeholder: 'Tu nombre' }) }),
          Campo({ label: 'Email',           hijos: Input({ type: 'email',    placeholder: 'tu@email.com' }) }),
          Campo({ label: 'Contraseña',      hijos: Input({ type: 'password', placeholder: '••••••••' }) }),
          Campo({ label: 'Número',          hijos: Input({ type: 'number',   placeholder: '0', min: 0, max: 100 }) }),
          Campo({ label: 'Búsqueda',        hijos: Input({ type: 'search',   placeholder: 'Buscar productos…' }) }),
          Campo({ label: 'URL',             hijos: Input({ type: 'url',      placeholder: 'https://launchpad.dev' }) }),
          Campo({ label: 'Teléfono',        hijos: PhoneInput({ pais: 'pe', placeholder: '999 888 777' }) }),
          Campo({ label: 'Fecha',           hijos: DatePicker({ placeholder: 'DD/MM/YYYY' }) }),
          Campo({ label: 'Hora (24h)',      hijos: TimePicker({ value: '14:30', formato: '24' }) }),
          Campo({ label: 'Hora (12h)',      hijos: TimePicker({ value: '14:30', formato: '12' }) }),
          Campo({ label: 'Color',           hijos: ColorPicker({ value: '#3b82f6' }) }),
        ),
        codigo: `Campo({ label: 'Email', hijos: Input({ type: 'email', placeholder: 'tu@email.com' }) })

// Pickers personalizados — click en cualquier parte abre el panel,
// edición directa con máscara (solo permite el formato), toggle 12/24h:
Campo({ label: 'Fecha', hijos: DatePicker({ placeholder: 'DD/MM/YYYY' }) })
Campo({ label: 'Hora',  hijos: TimePicker({ value: '14:30', formato: '24' }) })
Campo({ label: 'Color', hijos: ColorPicker({ value: '#3b82f6' }) })`,
      })],
    }),

    // ========== 2. Tamaños ==========
    Seccion({
      titulo: '2 · Tamaños — xs · sm · md · lg · xl',
      descripcion: '5 tamaños para diferentes contextos. xs/sm para tablas y filtros, md (default) para forms estándar, lg/xl para hero forms.',
      hijos: [VistaCodigo({
        vista: Stack(
          Campo({ label: 'Extra small (xs)', hijos: Input({ tamano: 'xs', placeholder: 'Filtro de tabla' }) }),
          Campo({ label: 'Small (sm)',       hijos: Input({ tamano: 'sm', placeholder: 'Compact form' }) }),
          Campo({ label: 'Medium (md) — default', hijos: Input({ tamano: 'md', placeholder: 'Standard form' }) }),
          Campo({ label: 'Large (lg)',       hijos: Input({ tamano: 'lg', placeholder: 'Hero form' }) }),
          Campo({ label: 'Extra large (xl)', hijos: Input({ tamano: 'xl', placeholder: 'Landing CTA' }) }),
        ),
        codigo: `Input({ tamano: 'xs' | 'sm' | 'md' | 'lg' | 'xl' })`,
      })],
    }),

    // ========== 3. Estados ==========
    Seccion({
      titulo: '3 · Estados visuales',
      descripcion: 'Default, focus, disabled, readonly, válido, inválido. Cada estado tiene su feedback visual con animaciones suaves.',
      hijos: [VistaCodigo({
        vista: Grid2(
          Campo({ label: 'Default',  hijos: Input({ placeholder: 'Listo para escribir' }) }),
          Campo({ label: 'Con valor', hijos: Input({ value: 'María García' }) }),
          Campo({ label: 'Disabled', hijos: Input({ value: 'No editable', deshabilitado: true }) }),
          Campo({ label: 'Read-only', hijos: Input({ value: 'Solo lectura', readonly: true }) }),
          Campo({
            label: 'Válido', hint: 'Email disponible',
            hijos: Input({ value: 'maria@launchpad.dev', valido: true }),
          }),
          Campo({
            label: 'Inválido', error: 'Este email ya está registrado',
            hijos: Input({ value: 'admin@launchpad.dev', invalido: true }),
          }),
        ),
        codigo: `Input({ valido: true })           // borde verde + ring verde al focus
Input({ invalido: true })         // borde rojo + ring rojo al focus
Input({ deshabilitado: true })    // gris, cursor not-allowed
Input({ readonly: true })         // gris pero seleccionable`,
      })],
    }),

    // ========== 4. Textareas ==========
    Seccion({
      titulo: '4 · Textareas',
      descripcion: 'Para texto multilinea. Tamaño configurable con `filas`. Resizable verticalmente por default.',
      hijos: [VistaCodigo({
        vista: Stack(
          Campo({
            label: 'Mensaje', hint: 'Cuéntanos cómo podemos ayudarte. Min. 20 caracteres.',
            hijos: Textarea({ filas: 4, placeholder: 'Escribe aquí…' }),
          }),
          Campo({
            label: 'Comentario corto',
            hijos: Textarea({ filas: 2, placeholder: 'Opcional' }),
          }),
        ),
        codigo: `Textarea({ filas: 4, placeholder: 'Escribe aquí…' })`,
      })],
    }),

    // ========== 5. Form completo de ejemplo ==========
    Seccion({
      titulo: '5 · Form completo — ejemplo de signup',
      descripcion: 'Combinando todos los elementos en un form real de registro. Aplicable a checkout, signup, onboarding.',
      hijos: [VistaCodigo({
        vista: crearEl('form', {
          style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', maxWidth: '440px' },
          onSubmit: (e) => e.preventDefault(),
        }, [
          Campo({ label: 'Nombre completo', requerido: true, hijos: Input({ placeholder: 'María García' }) }),
          Campo({
            label: 'Email de trabajo', requerido: true, hint: 'Lo usamos para enviarte el invoice mensual.',
            hijos: Input({ type: 'email', placeholder: 'maria@empresa.com' }),
          }),
          Campo({
            label: 'Contraseña', requerido: true, hint: 'Min. 8 caracteres con números y mayúsculas.',
            hijos: Input({ type: 'password', placeholder: '••••••••' }),
          }),
          Campo({ label: 'Empresa', opcional: true, hijos: Input({ placeholder: 'Acme Inc.' }) }),
          Campo({
            label: 'Cargo', opcional: true,
            hijos: Input({ placeholder: 'Founder, CTO, Lead Engineer…' }),
          }),
          crearEl('button', {
            type: 'submit',
            style: { padding: '10px 16px', background: 'var(--primary)', color: '#fff', border: 0, borderRadius: 'var(--radius)', fontSize: '14px', fontWeight: 600, cursor: 'pointer', marginBlockStart: '8px' },
          }, ['Crear cuenta gratis']),
        ]),
        codigo: `<form>
  <Campo label="Nombre" requerido hijos={Input(...)} />
  <Campo label="Email"  requerido hint="..." hijos={Input(...)} />
  <Campo label="Empresa" opcional  hijos={Input(...)} />
  <Boton type="submit">Crear cuenta</Boton>
</form>`,
      })],
    }),

  ],
});
