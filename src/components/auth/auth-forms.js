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
import { Campo } from '../ui/input/input.js';
import { Boton } from '../ui/button/button.js';
import { CampoFormulario } from '../forms/form-field/form-field.js';
import { usarAutenticacion } from '../../hooks/useAuth.js';
import {
  validarFormulario, obligatorio, correo as correoRegla, longitudMinima,
} from '../../utils/validators/rules.js';
import { navegarA } from '../../router/index.js';
import { RUTAS, NOMBRES_RUTAS } from '../../config/routes.config.js';
import { t } from '../../i18n/index.js';
import { estadoNotificaciones } from '../../store/notifications.store.js';
import { mostrarIntro } from '../../utils/helpers/intro.js';
import { BotonesSociales, DivisorO, FuerzaContrasena } from './auth-elements.js';

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

/* ────────────────────────────────────────────────────────────────────────
   Ingresar (login)
   ──────────────────────────────────────────────────────────────────────── */

export const FormularioIngresar = ({
  rutaRegistro = RUTAS[NOMBRES_RUTAS.REGISTRAR],
  rutaRecuperar = RUTAS[NOMBRES_RUTAS.RECUPERAR],
  rutaExito = RUTAS[NOMBRES_RUTAS.PANEL],
  ocultarSociales = false,
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

  return crearEl('div', { class: 'auth-contenido' }, [
    Cabecera({
      titulo: t('auth.login'),
      derecha: crearEl('span', { class: 'auth-cabecera__pista' }, [
        `${t('auth.no_account')} `,
        enlace(t('auth.register'), rutaRegistro),
      ]),
    }),

    crearEl('form', { novalidate: true, onSubmit: alEnviar, class: 'auth-form' }, [
      CampoFormulario({
        etiqueta: t('auth.email'),
        obligatorio: true,
        control: Campo({
          name: 'email', type: 'email', autocomplete: 'email', required: true,
          placeholder: 'tucorreo@empresa.com',
        }),
      }),
      CampoFormulario({
        etiqueta: t('auth.password'),
        obligatorio: true,
        control: Campo({
          name: 'password', type: 'password', autocomplete: 'current-password',
          required: true, placeholder: '••••••••',
        }),
      }),

      filaEntreCentros(
        recordarme(),
        enlace(t('auth.forgot_password'), rutaRecuperar, { class: 'auth-enlace--menor' }),
      ),

      btnEnviar,
    ]),

    !ocultarSociales && DivisorO(),
    !ocultarSociales && BotonesSociales(),
  ]);
};

/* ────────────────────────────────────────────────────────────────────────
   Registrar
   ──────────────────────────────────────────────────────────────────────── */

export const FormularioRegistrar = ({
  rutaIngreso = RUTAS[NOMBRES_RUTAS.INGRESAR],
  rutaExito   = RUTAS[NOMBRES_RUTAS.PANEL],
  ocultarSociales = false,
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

  return crearEl('div', { class: 'auth-contenido' }, [
    Cabecera({
      titulo: t('auth.create_account_title') || t('auth.register'),
      derecha: crearEl('span', { class: 'auth-cabecera__pista' }, [
        `${t('auth.have_account')} `,
        enlace(t('auth.login'), rutaIngreso),
      ]),
    }),

    crearEl('form', { novalidate: true, onSubmit: alEnviar, class: 'auth-form' }, [
      CampoFormulario({
        etiqueta: t('auth.name'),
        obligatorio: true,
        control: Campo({ name: 'name', type: 'text', autocomplete: 'name', required: true, placeholder: 'María Pérez' }),
      }),
      CampoFormulario({
        etiqueta: t('auth.email'),
        obligatorio: true,
        control: Campo({ name: 'email', type: 'email', autocomplete: 'email', required: true, placeholder: 'tucorreo@empresa.com' }),
      }),
      CampoFormulario({
        etiqueta: t('auth.password'),
        obligatorio: true,
        control: Campo({
          name: 'password', type: 'password', autocomplete: 'new-password',
          required: true, placeholder: 'Mínimo 8 caracteres', onInput: onPwdInput,
        }),
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

      btnEnviar,
    ]),

    !ocultarSociales && DivisorO(),
    !ocultarSociales && BotonesSociales(),
  ]);
};

/* ────────────────────────────────────────────────────────────────────────
   Recuperar contraseña
   ──────────────────────────────────────────────────────────────────────── */

export const FormularioRecuperar = ({
  rutaIngreso = RUTAS[NOMBRES_RUTAS.INGRESAR],
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
    Cabecera({ titulo: t('auth.forgot_password').replace(/\?$/, '') }),

    crearEl('p', { class: 'auth-lead' }, [t('auth.we_will_email')]),

    crearEl('form', { novalidate: true, onSubmit: alEnviar, class: 'auth-form' }, [
      CampoFormulario({
        etiqueta: t('auth.email'),
        obligatorio: true,
        control: Campo({ name: 'email', type: 'email', autocomplete: 'email', required: true, placeholder: 'tucorreo@empresa.com' }),
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
    Cabecera({ titulo: t('auth.reset_password') }),

    crearEl('form', { novalidate: true, onSubmit: alEnviar, class: 'auth-form' }, [
      CampoFormulario({
        etiqueta: t('auth.password'),
        obligatorio: true,
        control: Campo({
          name: 'password', type: 'password', autocomplete: 'new-password', required: true,
          placeholder: 'Nueva contraseña', onInput: e => fuerza.evaluar(e.target.value),
        }),
      }),
      fuerza.nodo,
      CampoFormulario({
        etiqueta: t('auth.password_confirm'),
        obligatorio: true,
        control: Campo({
          name: 'confirm', type: 'password', autocomplete: 'new-password',
          required: true, placeholder: 'Repite la contraseña',
        }),
      }),
      btnEnviar,
    ]),
  ]);
};
