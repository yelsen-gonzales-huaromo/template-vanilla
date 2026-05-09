/**
 * Auth screens — pantallas no-formulario (confirmar correo, sesión cerrada,
 * pantalla de bloqueo). Comparten estética con auth-forms.
 *
 *   PantallaConfirmar({ correo, rutaIngreso })
 *   PantallaSalir({ rutaIngreso })
 *   FormularioBloqueo({ usuario, rutaPanel })
 */
import { crearEl } from '../../utils/helpers/dom.js';
import { senal } from '../../utils/helpers/reactive.js';
import { Boton } from '../ui/button/button.js';
import { Avatar } from '../ui/avatar/avatar.js';
import { FloatingPassword } from '../../pages/modulos/forms/_floating.js';

/* Wrapper para FloatingPassword: añade name/required/autocomplete/autofocus
   sobre el <input> interno sin modificar el componente original. */
const ContrasenaCampo = (opciones = {}) => {
  const { name, required, autocomplete, autofocus, onInput, ...rest } = opciones;
  const wrap = FloatingPassword(rest);
  const input = wrap.querySelector('input');
  if (input) {
    if (name) input.name = name;
    if (required) input.required = true;
    if (autocomplete) input.setAttribute('autocomplete', autocomplete);
    if (autofocus) input.autofocus = true;
    if (onInput) input.addEventListener('input', onInput);
  }
  return wrap;
};
import { estadoAuth } from '../../store/auth.store.js';
import { navegarA } from '../../router/index.js';
import { RUTAS, NOMBRES_RUTAS } from '../../config/routes.config.js';
import { t } from '../../i18n/index.js';
import { mostrarIntro } from '../../utils/helpers/intro.js';

/* SVG ilustración: sobre con check (modernización del icono ✉ usado antes). */
const SvgSobreCheck = () => {
  const svg = `
    <svg width="88" height="88" viewBox="0 0 88 88" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="sobre-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"  stop-color="#60a5fa"/>
          <stop offset="100%" stop-color="#1d4ed8"/>
        </linearGradient>
      </defs>
      <rect x="10" y="22" width="68" height="44" rx="6" fill="none" stroke="url(#sobre-grad)" stroke-width="3"/>
      <path d="M12 26 L44 50 L76 26" fill="none" stroke="url(#sobre-grad)" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="68" cy="60" r="14" fill="url(#sobre-grad)"/>
      <path d="M61 60 L66 65 L75 56" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  return crearEl('div', { class: 'auth-ilustracion', html: svg });
};

const SvgSesionCerrada = () => {
  const svg = `
    <svg width="88" height="88" viewBox="0 0 88 88" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="salir-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"  stop-color="#10b981"/>
          <stop offset="100%" stop-color="#059669"/>
        </linearGradient>
      </defs>
      <circle cx="44" cy="44" r="36" fill="none" stroke="url(#salir-grad)" stroke-width="3"/>
      <path d="M30 44 L40 54 L60 32" fill="none" stroke="url(#salir-grad)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  return crearEl('div', { class: 'auth-ilustracion', html: svg });
};

/* ────────────────────────────────────────────────────────────────────────
   Confirmar correo
   ──────────────────────────────────────────────────────────────────────── */

export const PantallaConfirmar = ({
  correo,
  rutaIngreso = RUTAS[NOMBRES_RUTAS.INGRESAR],
  decoracion = null,
  titulo,
  lead,
} = {}) => crearEl('div', { class: 'auth-contenido auth-contenido--centrada' }, [
  decoracion || SvgSobreCheck(),
  crearEl('h1', { class: 'auth-cabecera__titulo' }, [titulo || t('auth.confirm_email_title')]),
  crearEl('p', { class: 'auth-lead' }, [
    lead || t('auth.confirm_email_text'),
    correo && crearEl('span', { class: 'auth-correo-resalt' }, [` ${correo}`]),
  ]),
  crearEl('div', { class: 'auth-acciones' }, [
    Boton({
      texto: t('actions.back'), variante: 'outline', bloque: true,
      onClick: () => navegarA(rutaIngreso),
    }),
  ]),
  crearEl('p', { class: 'auth-pie auth-pie--centrado' }, [
    '¿No te llegó? ',
    crearEl('a', { href: '#', class: 'auth-enlace' }, ['Reenviar enlace']),
  ]),
]);

/* ────────────────────────────────────────────────────────────────────────
   Sesión cerrada
   ──────────────────────────────────────────────────────────────────────── */

export const PantallaSalir = ({
  rutaIngreso = RUTAS[NOMBRES_RUTAS.INGRESAR],
  decoracion = null,
  titulo,
  lead,
} = {}) => crearEl('div', { class: 'auth-contenido auth-contenido--centrada' }, [
  decoracion || SvgSesionCerrada(),
  crearEl('h1', { class: 'auth-cabecera__titulo' }, [titulo || t('auth.logout_title')]),
  crearEl('p', { class: 'auth-lead' }, [lead || t('auth.logout_text')]),
  crearEl('div', { class: 'auth-acciones' }, [
    Boton({
      texto: t('auth.logout_back_to_login'), bloque: true,
      onClick: () => navegarA(rutaIngreso),
    }),
  ]),
]);

/* ────────────────────────────────────────────────────────────────────────
   Bloqueo de pantalla
   ──────────────────────────────────────────────────────────────────────── */

export const FormularioBloqueo = ({
  rutaPanel = RUTAS[NOMBRES_RUTAS.PANEL],
  decoracion = null,
  lead,
} = {}) => {
  const u = estadoAuth.usuario.peek() || { nombre: 'Usuario', email: '' };
  const enviando = senal(false);

  const alEnviar = async (e) => {
    e.preventDefault();
    enviando.value = true;
    // Demo: cualquier contraseña pasa. En producción aquí va la verificación real.
    setTimeout(() => {
      enviando.value = false;
      mostrarIntro({ duracion: 500 });
      navegarA(rutaPanel);
    }, 250);
  };

  const btnEnviar = Boton({ texto: t('auth.unlock'), bloque: true, type: 'submit' });
  enviando.subscribe(v => {
    btnEnviar.setAttribute('aria-busy', String(v));
    btnEnviar.disabled = v;
    btnEnviar.classList.toggle('is-loading', v);
  });

  return crearEl('div', { class: 'auth-contenido auth-contenido--centrada' }, [
    decoracion,
    crearEl('div', { class: 'auth-bloqueo__avatar' }, [
      Avatar({ nombre: u.nombre, tamano: 'xl' }),
    ]),
    crearEl('h1', { class: 'auth-cabecera__titulo' }, [u.nombre]),
    crearEl('p', { class: 'auth-lead' }, [lead || u.email || t('auth.lock_screen')]),

    crearEl('form', { onSubmit: alEnviar, class: 'auth-form auth-form--bloqueo' }, [
      ContrasenaCampo({
        label: t('auth.password'),
        name: 'password', autocomplete: 'current-password',
        required: true, autofocus: true,
      }),
      btnEnviar,
    ]),

    crearEl('p', { class: 'auth-pie auth-pie--centrado' }, [
      crearEl('a', {
        href: RUTAS[NOMBRES_RUTAS.INGRESAR], class: 'auth-enlace auth-enlace--menor',
      }, ['Cambiar de cuenta']),
    ]),
  ]);
};
