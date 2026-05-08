/**
 * Floating labels — patrón Material 3 / Stripe Checkout completo.
 * 6 componentes: Input, Password, Search, Textarea, Select, Numero.
 * Soporta validación, helper/error text, contador, iconos, sufijos, sizes.
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { corner2 } from '../../../components/ui/card/card-decoraciones.js';
import { Stack, Grid2 } from './_compartido.js';
import {
  FloatingInput, FloatingPassword, FloatingSearch,
  FloatingTextarea, FloatingSelect, FloatingNumero,
} from './_floating.js';

const Btn = (texto, variante = 'primary', extra = {}) => crearEl('button', {
  type: extra.type || 'button',
  class: ['btn', variante !== 'primary' && `btn--${variante}`],
  ...extra,
}, [texto]);

export default async () => PaginaShowcase({
  titulo: 'Floating labels',
  descripcion: 'Labels que flotan dentro del input cuando está vacío y se elevan + escalan al recibir focus o tener valor. Patrón Material 3 / Stripe Checkout. 6 componentes (Input/Password/Search/Textarea/Select/Numero) con todos los estados (válido/inválido/deshabilitado/readonly), tamaños sm/md/lg, iconos prefix, helper + error text, contador de caracteres, asterisco requerido y "(opcional)". Espacio compacto, transiciones suaves.',
  decoracion: corner2(),
  migas: [
    { etiqueta: 'Módulos', href: '#/modulos' },
    { etiqueta: 'Formularios', href: '#/modulos/forms' },
  ],
  hijos: [

    // ========== 1 ==========
    Seccion({
      titulo: '1 · Inputs base — todos los tipos HTML5',
      descripcion: 'El label vive dentro del input cuando está vacío. Al hacer focus o escribir algo, sube y se reduce a 78% cambiando de color al primary. Compatible con todos los `type` HTML5.',
      hijos: [VistaCodigo({
        vista: Grid2(
          FloatingInput({ label: 'Nombre completo' }),
          FloatingInput({ label: 'Email de trabajo', type: 'email' }),
          FloatingInput({ label: 'Teléfono', type: 'tel' }),
          FloatingInput({ label: 'URL del sitio', type: 'url' }),
          FloatingInput({ label: 'Empresa', value: 'Acme Inc.' }),
          FloatingInput({ label: 'Cargo' }),
        ),
        codigo: `import { FloatingInput } from './_floating.js';

FloatingInput({
  label: 'Nombre completo',
  type: 'text',
  value: '',
  onInput: (e) => setNombre(e.target.value),
})`,
      })],
    }),

    // ========== 2 ==========
    Seccion({
      titulo: '2 · Estados — válido · inválido · disabled · readonly',
      descripcion: 'Cuatro estados visuales con feedback inmediato. El borde del input + el color del label se ajustan según el estado.',
      hijos: [VistaCodigo({
        vista: Grid2(
          FloatingInput({ label: 'Default', placeholder: ' ' }),
          FloatingInput({ label: 'Con valor', value: 'María García' }),
          FloatingInput({ label: 'Válido', value: 'maria@empresa.com', valido: true, hint: 'Email disponible' }),
          FloatingInput({ label: 'Inválido', value: 'no-email', error: 'Formato de email no válido' }),
          FloatingInput({ label: 'Deshabilitado', value: 'No editable', deshabilitado: true }),
          FloatingInput({ label: 'Solo lectura', value: 'Maria García', readonly: true }),
        ),
        codigo: `FloatingInput({ label: 'Email', valido: true,  hint:  'Email disponible' })
FloatingInput({ label: 'Email', error: 'Formato no válido' })          // → invalido
FloatingInput({ label: 'ID',    deshabilitado: true })
FloatingInput({ label: 'ID',    readonly: true })`,
      })],
    }),

    // ========== 3 ==========
    Seccion({
      titulo: '3 · Tamaños — sm · md · lg',
      descripcion: 'Tres tamaños para diferentes contextos. `sm` para tablas/filtros densos, `md` (default) para forms estándar, `lg` para hero forms o landings.',
      hijos: [VistaCodigo({
        vista: Stack(
          FloatingInput({ label: 'Extra pequeño (sm)', tamano: 'sm' }),
          FloatingInput({ label: 'Mediano (md, default)' }),
          FloatingInput({ label: 'Grande (lg)', tamano: 'lg' }),
        ),
        codigo: `FloatingInput({ label: '...', tamano: 'sm' })
FloatingInput({ label: '...', tamano: 'md' })   // default
FloatingInput({ label: '...', tamano: 'lg' })`,
      })],
    }),

    // ========== 4 ==========
    Seccion({
      titulo: '4 · Con iconos prefix + sufijos',
      descripcion: 'Ícono al inicio (búsqueda, email, teléfono, etc.) o sufijo al final (botón clear, ojo de password, badges). Los componentes Password / Search / Numero ya traen su sufijo built-in.',
      hijos: [VistaCodigo({
        vista: Grid2(
          FloatingInput({ label: 'Email', type: 'email', icono: Icono('correo', { tamano: 14 }) }),
          FloatingInput({ label: 'Buscar productos', icono: Icono('busqueda', { tamano: 14 }) }),
          FloatingInput({ label: 'Sitio web', icono: Icono('utilidades', { tamano: 14 }), value: 'launchpad.dev' }),
          FloatingInput({ label: 'Ubicación', icono: Icono('pin', { tamano: 14 }) }),
        ),
        codigo: `FloatingInput({
  label: 'Email',
  type: 'email',
  icono: Icono('correo', { tamano: 14 }),
})`,
      })],
    }),

    // ========== 5 ==========
    Seccion({
      titulo: '5 · Password — con toggle de visibilidad',
      descripcion: 'Botón ojo a la derecha que muestra/oculta el password. Click toggle entre `type="password"` y `type="text"`. Atajo de A11y: el label del botón se actualiza ("Mostrar contraseña" / "Ocultar contraseña").',
      hijos: [VistaCodigo({
        vista: Stack(
          FloatingPassword({ label: 'Contraseña' }),
          FloatingPassword({ label: 'Confirmar contraseña', hint: 'Mínimo 8 caracteres con números y mayúsculas' }),
          FloatingPassword({ label: 'Contraseña actual', error: 'La contraseña no coincide' }),
        ),
        codigo: `import { FloatingPassword } from './_floating.js';

FloatingPassword({
  label: 'Contraseña',
  hint: 'Mínimo 8 caracteres',
  // o:  error: 'La contraseña no coincide'
})`,
      })],
    }),

    // ========== 6 ==========
    Seccion({
      titulo: '6 · Search — con clear button',
      descripcion: 'Búsqueda con ícono lupa a la izq + botón × a la der que aparece solo cuando hay texto. Click en × limpia el input y devuelve el foco. `onChange(valor)` reactivo.',
      hijos: [VistaCodigo({
        vista: (() => {
          const q = senal('');
          const eco = crearEl('div', { style: { fontSize: '12.5px', color: 'var(--muted-foreground)', marginBlockStart: '8px' } }, ['Tipea para ver el eco reactivo']);
          efecto(() => { eco.textContent = q.value ? `Buscando: "${q.value}"` : 'Tipea para ver el eco reactivo'; });
          return crearEl('div', { style: { maxWidth: '480px' } }, [
            FloatingSearch({ label: 'Buscar productos…', onChange: (v) => q.value = v }),
            eco,
          ]);
        })(),
        codigo: `import { FloatingSearch } from './_floating.js';

FloatingSearch({
  label: 'Buscar productos…',
  onChange: (valor) => filtrar(valor),
})`,
      })],
    }),

    // ========== 7 ==========
    Seccion({
      titulo: '7 · Textarea con auto-grow + contador',
      descripcion: 'Textarea con label flotante y opcional `autoGrow: true` (la altura se ajusta al contenido) + `contador + max` (muestra "12/200" abajo, se pone rojo al exceder).',
      hijos: [VistaCodigo({
        vista: Stack(
          FloatingTextarea({ label: 'Mensaje (estándar)', filas: 3 }),
          FloatingTextarea({
            label: 'Tweet (con contador)',
            contador: true, max: 280,
            hint: 'Comparte tu idea en máximo 280 caracteres',
          }),
          FloatingTextarea({
            label: 'Bio auto-expandible',
            autoGrow: true,
            value: 'Esta bio crece automáticamente mientras escribes.',
          }),
        ),
        codigo: `FloatingTextarea({
  label: 'Tweet',
  filas: 3,
  contador: true, max: 280,    // contador "0/280"
  autoGrow: true,              // altura crece con el contenido
})`,
      })],
    }),

    // ========== 8 ==========
    Seccion({
      titulo: '8 · Select nativo polished',
      descripcion: 'Select nativo (accesible, mobile-friendly) con label flotante. El placeholder es la opción inicial sin valor; al elegir cualquier opción el label sube. Para search/multi/agrupado avanzado usar `_select.js`.',
      hijos: [VistaCodigo({
        vista: Grid2(
          FloatingSelect({
            label: 'País',
            opciones: ['Perú', 'México', 'Colombia', 'Argentina', 'Chile', 'España'],
          }),
          FloatingSelect({
            label: 'Idioma', value: 'es',
            opciones: [
              { value: 'es', label: 'Español' },
              { value: 'en', label: 'English' },
              { value: 'pt', label: 'Português' },
              { value: 'fr', label: 'Français' },
            ],
          }),
        ),
        codigo: `FloatingSelect({
  label: 'País',
  opciones: ['Perú', 'México', 'Colombia', ...],
  // o: opciones: [{ value: 'es', label: 'Español' }]
  value: 'Perú',
})`,
      })],
    }),

    // ========== 9 ==========
    Seccion({
      titulo: '9 · Número con steppers + / −',
      descripcion: 'Input numérico con botones + / − a la derecha. Respeta `min`, `max`, `step`. Para sliders de rango ver Range Slider.',
      hijos: [VistaCodigo({
        vista: Grid2(
          FloatingNumero({ label: 'Cantidad', value: 1, min: 1, max: 99 }),
          FloatingNumero({ label: 'Edad', value: 25, min: 0, max: 120 }),
          FloatingNumero({ label: 'Precio (USD)', value: 49.99, min: 0, step: 0.01 }),
          FloatingNumero({ label: 'Personas', value: 2, min: 1, max: 20 }),
        ),
        codigo: `FloatingNumero({
  label: 'Cantidad',
  value: 1, min: 1, max: 99, step: 1,
  onChange: (n) => setCantidad(n),
})`,
      })],
    }),

    // ========== 10 ==========
    Seccion({
      titulo: '10 · Required + opcional + asterisco',
      descripcion: 'Marca campos requeridos con asterisco rojo o como "(opcional)" gris. Para forms con muchos campos donde algunos son opcionales.',
      hijos: [VistaCodigo({
        vista: Grid2(
          FloatingInput({ label: 'Nombre', requerido: true }),
          FloatingInput({ label: 'Email', requerido: true, type: 'email' }),
          FloatingInput({ label: 'Teléfono', opcional: true, type: 'tel' }),
          FloatingInput({ label: 'Empresa', opcional: true }),
        ),
        codigo: `FloatingInput({ label: 'Nombre', requerido: true })   // → "Nombre *"
FloatingInput({ label: 'Empresa', opcional: true })   // → "Empresa (opcional)"`,
      })],
    }),

    // ========== 11 ==========
    Seccion({
      titulo: '11 · Caso real — Login compacto',
      descripcion: 'Login form típico con floating labels, password con toggle, validación de error visible.',
      hijos: [VistaCodigo({
        vista: crearEl('form', {
          style: {
            maxWidth: '380px',
            display: 'flex', flexDirection: 'column', gap: 'var(--space-3)',
            padding: 'var(--space-5)',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
          },
          onSubmit: (e) => e.preventDefault(),
        }, [
          crearEl('h3', { style: { margin: 0, fontSize: '17px', fontWeight: 700 } }, ['Inicia sesión']),
          crearEl('p', { style: { margin: '0 0 var(--space-2)', fontSize: '13px', color: 'var(--muted-foreground)' } },
            ['Bienvenido de vuelta. Ingresa con tu cuenta.']),
          FloatingInput({
            label: 'Email', type: 'email', requerido: true,
            icono: Icono('correo', { tamano: 14 }),
          }),
          FloatingPassword({ label: 'Contraseña', requerido: true }),
          crearEl('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px' } }, [
            crearEl('label', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' } }, [
              crearEl('input', { type: 'checkbox', class: 'check-input check-input--sm' }),
              'Recordarme',
            ]),
            crearEl('a', { href: '#', style: { color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' } }, ['Olvidé mi contraseña']),
          ]),
          Btn('Iniciar sesión', 'primary', { type: 'submit', style: { marginBlockStart: '4px' } }),
        ]),
        codigo: `<form>
  <FloatingInput label="Email" requerido icono={Icono('correo')} />
  <FloatingPassword label="Contraseña" requerido />
  <button class="btn">Iniciar sesión</button>
</form>`,
      })],
    }),

    // ========== 12 ==========
    Seccion({
      titulo: '12 · Caso real — Checkout estilo Stripe',
      descripcion: 'Form de checkout con secciones, grid 2-col para campos cortos (CP/Ciudad), validación lista para conectar.',
      hijos: [VistaCodigo({
        vista: crearEl('form', {
          style: {
            maxWidth: '460px',
            display: 'flex', flexDirection: 'column', gap: 'var(--space-3)',
            padding: 'var(--space-5)',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
          },
          onSubmit: (e) => e.preventDefault(),
        }, [
          crearEl('div', { style: { fontSize: '11px', fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' } }, ['Datos de envío']),
          FloatingInput({ label: 'Nombre completo', requerido: true }),
          FloatingInput({ label: 'Email', type: 'email', requerido: true, icono: Icono('correo', { tamano: 14 }) }),
          FloatingInput({ label: 'Dirección', requerido: true, icono: Icono('pin', { tamano: 14 }) }),
          crearEl('div', { style: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-2)' } }, [
            FloatingInput({ label: 'Ciudad', requerido: true }),
            FloatingInput({ label: 'CP', requerido: true }),
          ]),
          FloatingSelect({
            label: 'País', requerido: true,
            opciones: ['Perú', 'México', 'Colombia', 'Argentina', 'Chile'],
          }),
          crearEl('div', { style: { fontSize: '11px', fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBlockStart: 'var(--space-2)' } }, ['Pago']),
          FloatingInput({ label: 'Número de tarjeta', requerido: true, icono: Icono('tarjeta', { tamano: 14 }) }),
          crearEl('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' } }, [
            FloatingInput({ label: 'MM/YY', requerido: true }),
            FloatingInput({ label: 'CVV', requerido: true }),
          ]),
          Btn('Pagar $49.99 USD', 'primary', { type: 'submit', style: { marginBlockStart: '6px' } }),
          crearEl('div', { style: { fontSize: '11.5px', color: 'var(--muted-foreground)', display: 'inline-flex', alignItems: 'center', gap: '5px', justifyContent: 'center' } }, [
            Icono('candado', { tamano: 11 }),
            'Procesado de forma segura por Stripe',
          ]),
        ]),
        codigo: `// Stripe-style checkout 100% floating labels — compacto y profesional`,
      })],
    }),

  ],
});
