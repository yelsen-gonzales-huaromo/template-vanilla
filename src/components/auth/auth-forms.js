/**
 * Auth forms — formularios reutilizables por las 3 variantes (simple/card/split).
 * Devuelven nodos DOM "limpios" (sin tarjeta exterior). El layout o la página
 * compositora decide el chrome (card / sin card / dentro de modal).
 *
 *   FormularioIngresar({ rutaRegistro, rutaRecuperar, alExito })
 *   FormularioRegistrar({ rutaIngreso, alExito })
 *   FormularioRecuperar({ rutaIngreso })
 *   FormularioRestablecer({ token, alExito })
 *
 * Notas:
 * - Mantiene la lógica que ya tenían las páginas legacy (validación, demo mode,
 *   navegación post-éxito y el overlay "Iniciando…" tras login/registro).
 * - Lookups i18n con fallback string si la clave no existe todavía.
 * - Submit deshabilitado mientras se envía + ARIA aria-busy.
 */
import { crearEl } from '../../utils/helpers/dom.js';
import { senal } from '../../utils/helpers/reactive.js';
import { Boton } from '../ui/button/button.js';
import {
  FloatingInput,
  FloatingPassword,
} from '../../pages/modulos/forms/_floating.js';

/* FloatingPassword sólo acepta props decorativas (label/hint/error/etc.).
   Para los atributos de form (name, required, autocomplete, onInput) que
   necesitamos en auth, envolvemos el resultado y aplicamos los attrs sobre
   el <input> interno. NO modifica el componente original. */
const ContrasenaCampo = (opciones = {}) => {
  const { name, required, autocomplete, onInput, ...rest } = opciones;
  const wrap = FloatingPassword(rest);
  const input = wrap.querySelector('input');
  if (input) {
    if (name) input.name = name;
    if (required) input.required = true;
    if (autocomplete) input.setAttribute('autocomplete', autocomplete);
    if (onInput) input.addEventListener('input', onInput);
  }
  return wrap;
};
import { usarAutenticacion } from '../../hooks/useAuth.js';
import {
  validarFormulario, obligatorio, correo as correoRegla, longitudMinima,
} from '../../utils/validators/rules.js';
import { navegarA } from '../../router/index.js';
import { RUTAS, NOMBRES_RUTAS } from '../../config/routes.config.js';
import { t } from '../../i18n/index.js';
import { estadoNotificaciones } from '../../store/notifications.store.js';
import { mostrarIntro } from '../../utils/helpers/intro.js';
import {
  BotonesSociales,
  BotonesSocialesCirculares,
  DivisorO,
  FuerzaContrasena,
} from './auth-elements.js';

/* ────────────────────────────────────────────────────────────────────────
   Helpers internos
   ──────────────────────────────────────────────────────────────────────── */

const recordarme = () => crearEl('label', { class: 'auth-checkbox' }, [
  crearEl('input', { type: 'checkbox', name: 'recordarme', defaultChecked: true }),
  crearEl('span', null, [t('auth.remember_me')]),
]);

const enlace = (texto, href, extra = {}) => crearEl('a', {
  href, class: ['auth-enlace', extra.class].filter(Boolean).join(' '),
}, [texto]);

const filaEntreCentros = (izq, der) => crearEl('div', { class: 'auth-fila-entre' }, [izq, der]);

/** Cabecera estándar del formulario (título + acción a la derecha). */
const Cabecera = ({ titulo, derecha }) => crearEl('header', { class: 'auth-cabecera' }, [
  crearEl('h1', { class: 'auth-cabecera__titulo' }, [titulo]),
  derecha && crearEl('div', { class: 'auth-cabecera__derecha' }, [derecha]),
]);

/** Lead bajo el título — descripción corta opcional. */
const Lead = (texto) => texto ? crearEl('p', { class: 'auth-lead' }, [texto]) : null;

/* SVG de Google para el botón compacto (mismo que BotonesSociales). */
const SVG_GOOGLE_INLINE = `
  <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-hidden="true">
    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.255h2.908c1.702-1.567 2.684-3.875 2.684-6.612z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.255c-.806.54-1.836.86-3.048.86-2.345 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
    <path fill="#FBBC05" d="M3.964 10.713a5.41 5.41 0 0 1 0-3.426V4.957H.957a9.005 9.005 0 0 0 0 8.086l3.007-2.33z"/>
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.346l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.957L3.964 7.29C4.672 5.163 6.655 3.58 9 3.58z"/>
  </svg>`;

/** Botón compacto de "Continuar con Google" — usado side-by-side con el primario. */
const BotonGoogleCompacto = (etiqueta) => {
  const btn = crearEl('button', {
    type: 'button',
    class: 'auth-social-compacto auth-social--google',
    'data-proveedor': 'google',
  });
  btn.innerHTML = `${SVG_GOOGLE_INLINE}<span>${etiqueta}</span>`;
  return btn;
};

/* ────────────────────────────────────────────────────────────────────────
   Ingresar (login)
   ──────────────────────────────────────────────────────────────────────── */

export const FormularioIngresar = ({
  rutaRegistro = RUTAS[NOMBRES_RUTAS.REGISTRAR],
  rutaRecuperar = RUTAS[NOMBRES_RUTAS.RECUPERAR],
  rutaExito = RUTAS[NOMBRES_RUTAS.PANEL],
  ocultarSociales = false,
  decoracion = null,
  lead = null,
  titulo,
  compacto = false,
  socialesEstilo = 'grid',  // 'grid' | 'circulos'
  pistaAbajo = false,        // Estilo Metoxi: "¿No tienes cuenta?" debajo del botón
} = {}) => {
  const auth = usarAutenticacion();
  const enviando = senal(false);

  const alEnviar = async (e) => {
    e.preventDefault();
    const valores = Object.fromEntries(new FormData(e.target).entries());
    const { valido, errores } = validarFormulario(valores, {
      email:    [obligatorio(), correoRegla()],
      password: [obligatorio(), longitudMinima(6)],
    });
    if (!valido) {
      const primero = Object.values(errores)[0];
      estadoNotificaciones.advertencia(typeof primero === 'string' ? primero : primero.key);
      return;
    }

    enviando.value = true;
    try {
      await auth.iniciarSesion({ email: valores.email, password: valores.password });
      mostrarIntro({ duracion: 700 });
      navegarA(rutaExito);
    } catch (err) {
      estadoNotificaciones.error(err?.message || 'Credenciales incorrectas.');
    } finally {
      enviando.value = false;
    }
  };

  const btnEnviar = Boton({ texto: t('auth.login'), bloque: true, type: 'submit' });
  enviando.subscribe(v => {
    btnEnviar.setAttribute('aria-busy', String(v));
    btnEnviar.disabled = v;
    btnEnviar.classList.toggle('is-loading', v);
  });

  const buildPista = () => crearEl('span', null, [
    `${t('auth.no_account')} `,
    enlace(t('auth.register'), rutaRegistro),
  ]);

  return crearEl('div', { class: 'auth-contenido' }, [
    decoracion,
    Cabecera({
      titulo: titulo || t('auth.login'),
      derecha: pistaAbajo ? null : crearEl('span', { class: 'auth-cabecera__pista' }, [
        `${t('auth.no_account')} `,
        enlace(t('auth.register'), rutaRegistro),
      ]),
    }),
    Lead(lead),

    crearEl('form', { novalidate: true, onSubmit: alEnviar, class: 'auth-form' }, [
      FloatingInput({
        label: t('auth.email'), requerido: true,
        name: 'email', type: 'email', autoComplete: 'email', required: true,
      }),
      ContrasenaCampo({
        label: t('auth.password'),
        name: 'password', autocomplete: 'current-password', required: true,
      }),

      filaEntreCentros(
        recordarme(),
        enlace(t('auth.forgot_password'), rutaRecuperar, { class: 'auth-enlace--menor' }),
      ),

      // Modo compacto (NobleUI-style): primario + Google side-by-side. Sin divisor.
      compacto
        ? crearEl('div', { class: 'auth-acciones-compactas' }, [
            btnEnviar,
            !ocultarSociales && BotonGoogleCompacto('Google'),
          ])
        : btnEnviar,
    ]),

    // Pista bajo el botón (estilo Metoxi)
    pistaAbajo && crearEl('p', { class: 'auth-pista-bajo' }, [buildPista()]),

    !compacto && !ocultarSociales && DivisorO({ texto: socialesEstilo === 'circulos' ? 'O' : undefined }),
    !compacto && !ocultarSociales && (socialesEstilo === 'circulos' ? BotonesSocialesCirculares() : BotonesSociales()),
  ]);
};

/* ────────────────────────────────────────────────────────────────────────
   Registrar
   ──────────────────────────────────────────────────────────────────────── */

export const FormularioRegistrar = ({
  rutaIngreso = RUTAS[NOMBRES_RUTAS.INGRESAR],
  rutaExito   = RUTAS[NOMBRES_RUTAS.PANEL],
  ocultarSociales = false,
  decoracion = null,
  lead = null,
  titulo,
  compacto = false,
  socialesEstilo = 'grid',
  pistaAbajo = false,
} = {}) => {
  const auth = usarAutenticacion();
  const enviando = senal(false);
  const fuerza = FuerzaContrasena();

  const onPwdInput = (e) => fuerza.evaluar(e.target.value);

  const alEnviar = async (e) => {
    e.preventDefault();
    const valores = Object.fromEntries(new FormData(e.target).entries());
    const { valido, errores } = validarFormulario(valores, {
      name:     [obligatorio()],
      email:    [obligatorio(), correoRegla()],
      password: [obligatorio(), longitudMinima(8)],
    });
    if (!valido) {
      const primero = Object.values(errores)[0];
      estadoNotificaciones.advertencia(typeof primero === 'string' ? primero : primero.key);
      return;
    }
    if (!valores.terms) {
      estadoNotificaciones.advertencia('Debes aceptar los términos para continuar.');
      return;
    }

    enviando.value = true;
    try {
      await auth.registrar(valores);
      mostrarIntro({ duracion: 700 });
      navegarA(rutaExito);
    } catch (err) {
      estadoNotificaciones.error(err?.message || 'No se pudo crear la cuenta.');
    } finally {
      enviando.value = false;
    }
  };

  const btnEnviar = Boton({ texto: t('auth.register'), bloque: true, type: 'submit' });
  enviando.subscribe(v => {
    btnEnviar.setAttribute('aria-busy', String(v));
    btnEnviar.disabled = v;
    btnEnviar.classList.toggle('is-loading', v);
  });

  const buildPistaR = () => crearEl('span', null, [
    `${t('auth.have_account')} `,
    enlace(t('auth.login'), rutaIngreso),
  ]);

  return crearEl('div', { class: 'auth-contenido' }, [
    decoracion,
    Cabecera({
      titulo: titulo || t('auth.create_account_title') || t('auth.register'),
      derecha: pistaAbajo ? null : crearEl('span', { class: 'auth-cabecera__pista' }, [
        `${t('auth.have_account')} `,
        enlace(t('auth.login'), rutaIngreso),
      ]),
    }),
    Lead(lead),

    crearEl('form', { novalidate: true, onSubmit: alEnviar, class: 'auth-form' }, [
      FloatingInput({
        label: t('auth.name'), requerido: true,
        name: 'name', type: 'text', autoComplete: 'name', required: true,
      }),
      FloatingInput({
        label: t('auth.email'), requerido: true,
        name: 'email', type: 'email', autoComplete: 'email', required: true,
      }),
      ContrasenaCampo({
        label: t('auth.password'),
        name: 'password', autocomplete: 'new-password', required: true,
        onInput: onPwdInput,
      }),
      fuerza.nodo,

      crearEl('label', { class: 'auth-checkbox auth-checkbox--terms' }, [
        crearEl('input', { type: 'checkbox', name: 'terms', value: '1' }),
        crearEl('span', null, [
          `${t('auth.accept_terms_pre')} `,
          enlace(t('auth.terms'), '#'),
          ` ${t('auth.and')} `,
          enlace(t('auth.privacy'), '#'),
          '.',
        ]),
      ]),

      // Modo compacto (NobleUI-style): primario + Google side-by-side. Sin divisor.
      compacto
        ? crearEl('div', { class: 'auth-acciones-compactas' }, [
            btnEnviar,
            !ocultarSociales && BotonGoogleCompacto('Google'),
          ])
        : btnEnviar,
    ]),

    pistaAbajo && crearEl('p', { class: 'auth-pista-bajo' }, [buildPistaR()]),

    !compacto && !ocultarSociales && DivisorO({ texto: socialesEstilo === 'circulos' ? 'O' : undefined }),
    !compacto && !ocultarSociales && (socialesEstilo === 'circulos' ? BotonesSocialesCirculares() : BotonesSociales()),
  ]);
};

/* ────────────────────────────────────────────────────────────────────────
   Recuperar contraseña
   ──────────────────────────────────────────────────────────────────────── */

export const FormularioRecuperar = ({
  rutaIngreso = RUTAS[NOMBRES_RUTAS.INGRESAR],
  decoracion = null,
  lead = null,
  titulo,
} = {}) => {
  const auth = usarAutenticacion();
  const enviando = senal(false);

  const alEnviar = async (e) => {
    e.preventDefault();
    const { email } = Object.fromEntries(new FormData(e.target).entries());
    if (!email) return;
    enviando.value = true;
    try {
      await auth.recuperarContrasena(email);
      estadoNotificaciones.exito('Si el correo existe, te llegará un enlace en breve.');
    } catch (err) {
      estadoNotificaciones.error(err?.message || 'No se pudo procesar la solicitud.');
    } finally {
      enviando.value = false;
    }
  };

  const btnEnviar = Boton({ texto: t('auth.send_reset_link'), bloque: true, type: 'submit' });
  enviando.subscribe(v => {
    btnEnviar.setAttribute('aria-busy', String(v));
    btnEnviar.disabled = v;
    btnEnviar.classList.toggle('is-loading', v);
  });

  return crearEl('div', { class: 'auth-contenido' }, [
    decoracion,
    Cabecera({ titulo: titulo || t('auth.forgot_password').replace(/\?$/, '') }),

    crearEl('p', { class: 'auth-lead' }, [lead || t('auth.we_will_email')]),

    crearEl('form', { novalidate: true, onSubmit: alEnviar, class: 'auth-form' }, [
      FloatingInput({
        label: t('auth.email'), requerido: true,
        name: 'email', type: 'email', autoComplete: 'email', required: true,
      }),
      btnEnviar,
    ]),

    crearEl('div', { class: 'auth-pie' }, [
      enlace(`← ${t('actions.back')}`, rutaIngreso),
    ]),
  ]);
};

/* ────────────────────────────────────────────────────────────────────────
   Restablecer contraseña (con token en query)
   ──────────────────────────────────────────────────────────────────────── */

export const FormularioRestablecer = ({
  token,
  rutaIngreso = RUTAS[NOMBRES_RUTAS.INGRESAR],
  decoracion = null,
  lead = null,
  titulo,
} = {}) => {
  const auth = usarAutenticacion();
  const enviando = senal(false);
  const fuerza = FuerzaContrasena();

  const alEnviar = async (e) => {
    e.preventDefault();
    const { password, confirm } = Object.fromEntries(new FormData(e.target).entries());
    if (password !== confirm) {
      estadoNotificaciones.advertencia('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 8) {
      estadoNotificaciones.advertencia('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    enviando.value = true;
    try {
      await auth.restablecerContrasena(token, password);
      estadoNotificaciones.exito('Contraseña actualizada. Inicia sesión.');
      navegarA(rutaIngreso);
    } catch (err) {
      estadoNotificaciones.error(err?.message || 'No se pudo restablecer la contraseña.');
    } finally {
      enviando.value = false;
    }
  };

  const btnEnviar = Boton({ texto: t('actions.confirm'), bloque: true, type: 'submit' });
  enviando.subscribe(v => {
    btnEnviar.setAttribute('aria-busy', String(v));
    btnEnviar.disabled = v;
    btnEnviar.classList.toggle('is-loading', v);
  });

  return crearEl('div', { class: 'auth-contenido' }, [
    decoracion,
    Cabecera({ titulo: titulo || t('auth.reset_password') }),
    Lead(lead),

    crearEl('form', { novalidate: true, onSubmit: alEnviar, class: 'auth-form' }, [
      ContrasenaCampo({
        label: t('auth.password'),
        name: 'password', autocomplete: 'new-password', required: true,
        onInput: e => fuerza.evaluar(e.target.value),
      }),
      fuerza.nodo,
      ContrasenaCampo({
        label: t('auth.password_confirm'),
        name: 'confirm', autocomplete: 'new-password', required: true,
      }),
      btnEnviar,
    ]),
  ]);
};
