/**
 * Validación — patrones profesionales de form validation vanilla JS.
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { corner4 } from '../../../components/ui/card/card-decoraciones.js';
import { Campo, Input, Stack, Grid2 } from './_compartido.js';
import {
  v, CampoValidado, CampoAsync, PasswordChecklist,
  ResumenErrores, crearFormValidator,
} from './_validacion.js';

// Helper botón
const Btn = (texto, variante = 'primary', extra = {}) => crearEl('button', {
  type: extra.type || 'button',
  class: ['btn', variante !== 'primary' && `btn--${variante}`],
  ...extra,
}, [texto]);

// "Servidor" simulado para async validation
const usuariosTomados = new Set(['admin', 'maria', 'carlos', 'launchpad', 'root', 'test']);
const verificarUsername = (val) => new Promise((resolve) => {
  setTimeout(() => {
    if (val.length < 3) resolve('Mínimo 3 caracteres');
    else if (!/^[a-z0-9_]+$/i.test(val)) resolve('Solo letras, números y guion bajo');
    else if (usuariosTomados.has(val.toLowerCase())) resolve('Username ya está en uso');
    else resolve(null);
  }, 600);
});

const emailsTomados = new Set(['admin@empresa.com', 'maria@launchpad.dev', 'soporte@stripe.com']);
const verificarEmail = (val) => new Promise((resolve) => {
  setTimeout(() => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) resolve('Formato de email no válido');
    else if (emailsTomados.has(val.toLowerCase())) resolve('Este email ya está registrado');
    else resolve(null);
  }, 700);
});

export default async () => PaginaShowcase({
  titulo: 'Validación',
  descripcion: 'Sistema completo vanilla JS — 15+ validadores reusables, estados visuales (pristine/validando/válido/inválido), validación async contra servidor con debounce y cancelación de requests obsoletos, password checklist con criterios en vivo, panel de resumen de errores con jump-links, FormValidator orchestrator con submit reactivo deshabilitado hasta que todo esté válido.',
  decoracion: corner4(),
  migas: [
    { etiqueta: 'Módulos', href: '#/modulos' },
    { etiqueta: 'Formularios', href: '#/modulos/forms' },
  ],
  hijos: [

    // ========== 1 ==========
    Seccion({
      titulo: '1 · Validators reusables — 15+ presets encadenables',
      descripcion: 'Funciones puras `(valor) → null | string` que devuelven el mensaje de error o `null` si pasa. Encadenables — el primero que falle gana. Cada campo muestra **badge verde con check** o **rojo con X** dentro del input.',
      hijos: [VistaCodigo({
        vista: Stack(
          CampoValidado({ label: 'Email (requerido + formato)', requerido: true,
            type: 'email', placeholder: 'tu@email.com',
            validar: [v.email()] }),
          CampoValidado({ label: 'Teléfono internacional',
            type: 'tel', placeholder: '+51 999 888 777',
            validar: [v.telefono()] }),
          CampoValidado({ label: 'Sitio web (URL)',
            type: 'url', placeholder: 'https://launchpad.dev',
            validar: [v.url()] }),
          CampoValidado({ label: 'Username (3-20, alfanumérico)', requerido: true,
            placeholder: 'mariag',
            hint: 'Tu URL pública será launchpad.dev/[username]',
            validar: [v.min(3), v.max(20), v.alfanumerico()] }),
          CampoValidado({ label: 'DNI Perú (8 dígitos)',
            placeholder: '12345678',
            validar: [v.dniPe()] }),
          CampoValidado({ label: 'Edad (rango 18-120)',
            type: 'number', placeholder: '25',
            validar: [v.entero(), v.rango(18, 120)] }),
        ),
        codigo: `import { CampoValidado, v } from './_validacion.js';

CampoValidado({
  label: 'Email',
  requerido: true,
  validar: [v.email()],          // o cualquier combo encadenable
})

// Validadores disponibles:
v.requerido(msg?)
v.email(msg?) · v.url() · v.telefono()
v.min(n) · v.max(n) · v.regex(re, msg)
v.numero() · v.entero() · v.rango(min, max)
v.letrasSolo() · v.alfanumerico()
v.dniPe()
v.fecha() · v.fechaFutura() · v.edadMinima(anios)
v.passwordFuerte()`,
      })],
    }),

    // ========== 2 ==========
    Seccion({
      titulo: '2 · Validación async — verificación contra "servidor" con debounce',
      descripcion: 'Para verificar disponibilidad de username/email contra el backend. Debounce 500ms para no spamear, **cancela requests viejos** si el usuario sigue tipeando, **spinner en el badge** mientras espera, "Disponible" verde si pasa. Prueba con `admin`, `maria`, `root` (tomados) o cualquier otro.',
      hijos: [VistaCodigo({
        vista: Stack(
          CampoAsync({
            label: 'Username (verificación en vivo)',
            placeholder: 'Empieza a tipear…',
            hint: '(Tomados: admin, maria, carlos, launchpad, root, test)',
            cargar: verificarUsername,
          }),
          CampoAsync({
            label: 'Email (verifica si ya está registrado)',
            placeholder: 'tu@empresa.com',
            hint: '(Tomados: admin@empresa.com, maria@launchpad.dev)',
            cargar: verificarEmail,
            debounceMs: 700,
          }),
        ),
        codigo: `import { CampoAsync } from './_validacion.js';

CampoAsync({
  label: 'Username',
  cargar: async (val) => {
    const r = await fetch(\`/api/check?u=\${val}\`);
    const data = await r.json();
    return data.disponible ? null : 'Username ya está en uso';
  },
  debounceMs: 500,             // espera antes de verificar
})

// El componente se encarga de:
//  - Mostrar spinner mientras verifica
//  - Cancelar requests obsoletos si el usuario sigue tipeando
//  - Mostrar "Disponible" en verde si pasa, error rojo si no`,
      })],
    }),

    // ========== 3 ==========
    Seccion({
      titulo: '3 · Password Checklist — criterios en vivo',
      descripcion: 'En lugar de mostrar UN error a la vez, lista **todos los criterios** y los marca con check verde a medida que se cumplen. Cada criterio cumple anima con scale + bounce. También incluye medidor de fuerza (4 barras) y toggle ojo para ver/ocultar.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { maxWidth: '480px' } }, [
          Campo({ label: 'Crea una contraseña fuerte',
            hijos: PasswordChecklist({}) }),
        ]),
        codigo: `import { PasswordChecklist } from './_validacion.js';

PasswordChecklist({
  conMedidor: true,            // 4 barras de fuerza arriba
})

// Criterios mostrados en vivo:
// ✓ Mínimo 8 caracteres
// ✓ Una mayúscula (A-Z)
// ○ Una minúscula (a-z)
// ○ Un número (0-9)
// ○ Un símbolo (!@#$%^&*)`,
      })],
    }),

    // ========== 4 ==========
    Seccion({
      titulo: '4 · Cross-field — passwords match',
      descripcion: 'Validar dos campos juntos: confirmación de contraseña, fechas inicio < fin, etc. Re-valida ambos cuando cualquiera cambia. Badge verde aparece solo cuando coinciden.',
      hijos: [VistaCodigo({
        vista: (() => {
          const wrap = crearEl('div', { style: { maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } });
          const pass = senal('');
          const conf = senal('');
          const error = senal(null);

          const validar = () => {
            if (!conf.peek()) error.value = null;
            else if (conf.peek() !== pass.peek()) error.value = 'Las contraseñas no coinciden';
            else error.value = null;
          };

          const inputPass = crearEl('input', {
            type: 'password', placeholder: '••••••••', class: 'input',
            onInput: (e) => { pass.value = e.target.value; validar(); },
          });
          const inputConf = crearEl('input', {
            type: 'password', placeholder: '••••••••', class: 'input',
            onInput: (e) => { conf.value = e.target.value; validar(); },
          });

          const badge = crearEl('span', { class: 'val-badge' });
          const inputConfWrap = crearEl('div', { class: 'val-wrap' }, [inputConf, badge]);
          const errEl = crearEl('div', { class: 'campo__error', style: { display: 'none' } });

          efecto(() => {
            inputConf.setAttribute('aria-invalid', error.value ? 'true' : null);
            inputConf.setAttribute('data-valido', conf.value && !error.value ? 'true' : null);
            badge.replaceChildren();
            badge.classList.remove('val-badge--ok', 'val-badge--err');
            if (error.value) {
              badge.appendChild(Icono('cerrar', { tamano: 14 }));
              badge.classList.add('val-badge--err');
              errEl.replaceChildren(Icono('alerta', { tamano: 12 }), error.value);
              errEl.style.display = 'flex';
            } else if (conf.value) {
              badge.appendChild(Icono('check', { tamano: 14 }));
              badge.classList.add('val-badge--ok');
              errEl.style.display = 'none';
            } else {
              errEl.style.display = 'none';
            }
          });

          wrap.appendChild(Campo({ label: 'Nueva contraseña', requerido: true, hijos: inputPass }));
          wrap.appendChild(crearEl('div', { class: 'campo' }, [
            crearEl('label', { class: 'campo__label' }, [
              'Confirma tu contraseña ',
              crearEl('span', { class: 'campo__label-required' }, ['*']),
            ]),
            inputConfWrap,
            errEl,
          ]));
          return wrap;
        })(),
        codigo: `// Validación cross-field — los dos passwords deben coincidir
const validar = () => {
  if (conf.value !== pass.value)
    setError('Las contraseñas no coinciden');
  else
    setError(null);
};

input1.onInput = (e) => { pass.value = e.target.value; validar(); };
input2.onInput = (e) => { conf.value = e.target.value; validar(); };`,
      })],
    }),

    // ========== 5 ==========
    Seccion({
      titulo: '5 · Resumen de errores — panel sticky con jump links',
      descripcion: 'Para forms largos: panel sticky en la parte superior que muestra **cuántos errores hay** y permite click para saltar a cada campo problemático. Aparece automáticamente cuando hay errores, desaparece cuando se resuelven.',
      hijos: [VistaCodigo({
        vista: (() => {
          const form = crearFormValidator();
          const wrap = crearEl('div', { style: { maxWidth: '500px' } });

          wrap.appendChild(ResumenErrores({ form }));

          wrap.appendChild(crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
            CampoValidado({ label: 'Nombre completo', requerido: true,
              placeholder: 'María García',
              registrar: form.registrar,
              validar: [v.min(3)] }),
            CampoValidado({ label: 'Email', requerido: true, type: 'email',
              placeholder: 'tu@empresa.com',
              registrar: form.registrar,
              validar: [v.email()] }),
            CampoValidado({ label: 'Teléfono', requerido: true,
              placeholder: '+51 999 888 777',
              registrar: form.registrar,
              validar: [v.telefono()] }),
            CampoValidado({ label: 'Edad', requerido: true,
              type: 'number', placeholder: '25',
              registrar: form.registrar,
              validar: [v.entero(), v.rango(18, 120)] }),
          ]));

          const btnSubmit = Btn('Crear cuenta', 'primary', {
            onClick: () => form.submit(),
            style: { marginBlockStart: 'var(--space-3)' },
          });
          efecto(() => {
            btnSubmit.disabled = !form.esValido.value;
          });
          wrap.appendChild(btnSubmit);

          return wrap;
        })(),
        codigo: `import { crearFormValidator, ResumenErrores, CampoValidado } from './_validacion.js';

const form = crearFormValidator();

<form>
  <ResumenErrores form={form} />        {/* sticky top */}

  <CampoValidado label="Nombre" registrar={form.registrar} ... />
  <CampoValidado label="Email"  registrar={form.registrar} ... />
  ...
  <button disabled={!form.esValido.value}
          onClick={() => form.submit()}>
    Crear cuenta
  </button>
</form>

// form.esValido.value es reactivo
// form.submit() fuerza validación + enfoca el primer error`,
      })],
    }),

    // ========== 6 ==========
    Seccion({
      titulo: '6 · Form completo orquestado — submit reactivo',
      descripcion: 'Combinación profesional: validators sincrónicos + async + checklist password + cross-field + ResumenErrores + submit deshabilitado reactivamente hasta que TODO esté válido. El patrón completo para signup/checkout production-ready.',
      hijos: [VistaCodigo({
        vista: (() => {
          const form = crearFormValidator();
          const wrap = crearEl('form', {
            style: { maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' },
            onSubmit: (e) => { e.preventDefault(); if (form.submit()) alert('✓ Form enviado!'); },
          });

          wrap.appendChild(ResumenErrores({ form }));

          wrap.appendChild(CampoValidado({
            label: 'Nombre completo', requerido: true, placeholder: 'María García',
            registrar: form.registrar, validar: [v.min(3), v.letrasSolo()],
          }));
          wrap.appendChild(CampoAsync({
            label: 'Username', placeholder: 'mariag', requerido: true,
            hint: 'Verificación en vivo (tomados: admin, maria, root)',
            registrar: form.registrar, cargar: verificarUsername,
          }));
          wrap.appendChild(CampoAsync({
            label: 'Email corporativo', placeholder: 'maria@empresa.com', requerido: true,
            hint: 'Verificación en vivo (tomado: admin@empresa.com)',
            registrar: form.registrar, cargar: verificarEmail,
          }));
          wrap.appendChild(Campo({ label: 'Contraseña', requerido: true,
            hijos: PasswordChecklist({ registrar: form.registrar }) }));

          const btn = Btn('Crear cuenta gratis', 'primary', {
            type: 'submit', style: { marginBlockStart: 'var(--space-2)' },
          });
          efecto(() => { btn.disabled = !form.esValido.value; });
          wrap.appendChild(btn);

          const estado = crearEl('div', {
            style: { fontSize: '11.5px', color: 'var(--muted-foreground)', textAlign: 'center', fontVariantNumeric: 'tabular-nums' },
          });
          efecto(() => {
            const errs = form.errores.value;
            estado.textContent = form.esValido.value
              ? '✓ Todos los campos válidos — listo para enviar'
              : `${errs.length} ${errs.length === 1 ? 'campo requiere atención' : 'campos requieren atención'}`;
            estado.style.color = form.esValido.value ? 'var(--color-success)' : 'var(--muted-foreground)';
          });
          wrap.appendChild(estado);

          return wrap;
        })(),
        codigo: `const form = crearFormValidator();

<form onSubmit={(e) => { e.preventDefault();
                        if (form.submit()) api.crearCuenta(); }}>
  <ResumenErrores form={form} />
  <CampoValidado label="Nombre" registrar={form.registrar}
                 validar={[v.min(3), v.letrasSolo()]} />
  <CampoAsync   label="Username" registrar={form.registrar}
                cargar={verificarUsername} />
  <CampoAsync   label="Email"    registrar={form.registrar}
                cargar={verificarEmail} />
  <PasswordChecklist registrar={form.registrar} />
  <button disabled={!form.esValido.value}>Crear cuenta</button>
</form>`,
      })],
    }),

    // ========== 7 ==========
    Seccion({
      titulo: '7 · Validar al perder foco vs en tiempo real',
      descripcion: 'Mejor UX: NO validar mientras el usuario tipea por primera vez (no molestar), validar al perder el foco (`onBlur`), y después validar en cada keystroke (`onInput`) para feedback inmediato cuando corrige.',
      hijos: [VistaCodigo({
        vista: Stack(
          CampoValidado({ label: 'Email — escribe algo, haz Tab para validar', type: 'email',
            placeholder: 'tu@email.com', validar: [v.email()] }),
          CampoValidado({ label: 'URL — mismo patrón', type: 'url',
            placeholder: 'https://launchpad.dev', validar: [v.url()] }),
        ),
        codigo: `// Patrón recomendado:
let tocado = false;

input.addEventListener('blur', () => {
  tocado = true;
  validar();              // primera validación al salir
});

input.addEventListener('input', () => {
  if (tocado) validar();  // re-valida en vivo solo después del primer blur
});`,
      })],
    }),

    // ========== 8 ==========
    Seccion({
      titulo: '8 · Estados visuales del badge — pristine · validando · OK · error',
      descripcion: 'Cada CampoValidado/CampoAsync muestra un badge circular dentro del input que comunica el estado actual. Animación pop con spring al cambiar a verde — feedback inmediato y satisfactorio.',
      hijos: [VistaCodigo({
        vista: Stack(
          Campo({ label: 'Pristine (sin tocar)', hint: 'Campo sin badge', hijos: Input({ placeholder: 'Aún no he tipeado…' }) }),
          Campo({ label: 'Validando (async pendiente)',
            hijos: crearEl('div', { class: 'val-wrap' }, [
              Input({ value: 'mariag' }),
              crearEl('span', { class: 'val-badge val-badge--load' }, [crearEl('span', { class: 'val-spinner' })]),
            ]) }),
          Campo({ label: 'Válido', hint: '✓ Disponible',
            hijos: crearEl('div', { class: 'val-wrap' }, [
              Input({ value: 'maria-garcia', valido: true }),
              crearEl('span', { class: 'val-badge val-badge--ok' }, [Icono('check', { tamano: 14 })]),
            ]) }),
          Campo({ label: 'Inválido', error: 'Username ya está en uso',
            hijos: crearEl('div', { class: 'val-wrap' }, [
              Input({ value: 'admin', invalido: true }),
              crearEl('span', { class: 'val-badge val-badge--err' }, [Icono('cerrar', { tamano: 14 })]),
            ]) }),
        ),
        codigo: `// 4 estados visuales:
// 1. Pristine     → sin badge (campo neutral)
// 2. Validando    → spinner azul (esperando respuesta del server)
// 3. Válido       → check verde con animación pop (spring)
// 4. Inválido     → X rojo + mensaje de error debajo`,
      })],
    }),

  ],
});
