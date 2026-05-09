/**
 * /auth/modal — página demo: el formulario de auth dentro de un Modal.
 * Útil cuando un visitante pulsa una acción protegida y queremos pedirle
 * credenciales sin sacarlo de la página actual.
 *
 * Esta página vive en el layout 'blank', así que no hereda el chrome de auth.
 * Construimos a mano: hero lottie, headline + lead, dos CTAs (ingresar y
 * registrar) y un par de "features" en grid. Todo theme-aware.
 */
import { crearEl } from '../../utils/helpers/dom.js';
import { Boton } from '../../components/ui/button/button.js';
import { Modal } from '../../components/ui/modal/modal.js';
import {
  MarcaAuth,
  HeroDecoracion,
} from '../../components/auth/auth-elements.js';
import { FormularioIngresar, FormularioRegistrar } from '../../components/auth/auth-forms.js';
import { aplicarPreset } from '../../components/auth/auth-presets.js';
import { busEventos, EVENTOS_APP } from '../../utils/helpers/event-bus.js';
import { LOTTIE_TODAS } from '../../components/common/lottie-catalog/lottie-catalog.js';
import { t } from '../../i18n/index.js';

const _porId = new Map();
LOTTIE_TODAS.forEach((it) => _porId.set(it.id, it.local));

const decoracionPequena = (id, alto = 110, tono = 'marca') => {
  const src = _porId.get(id);
  if (!src) return null;
  return HeroDecoracion({ tipo: 'lottie', src, alto, tono, forma: 'circulo' });
};

const abrirModalAuth = (modo = 'ingresar') => {
  // Decoración pequeña dentro del modal (lottie hero pero más compacto).
  const heroIngreso = decoracionPequena('success', 110, 'marca');
  const heroRegistro = decoracionPequena('loading-success', 110, 'exito');

  const cuerpo = crearEl('div', { class: 'auth-modal-cuerpo' }, [
    modo === 'registrar'
      ? FormularioRegistrar({ decoracion: heroRegistro })
      : FormularioIngresar({ decoracion: heroIngreso }),
  ]);
  const ref = Modal.abrir({ titulo: '', cuerpo, tamano: 'md' });

  // Si el form dispara una navegación (login/registro exitoso), el router
  // reemplaza el contenido de #app pero el modal vive en <body>. Lo cerramos
  // al primer cambio de ruta para que no quede pegado.
  const off = busEventos.on(EVENTOS_APP.RUTA_CAMBIADA, () => {
    ref.cerrar();
    off?.();
  });
  return ref;
};

const Caracteristica = ({ icono, titulo, sub }) =>
  crearEl('div', { class: 'auth-modal-pagina__feat' }, [
    crearEl('span', { class: 'auth-modal-pagina__feat-ico', html: icono, 'aria-hidden': 'true' }),
    crearEl('div', null, [
      crearEl('strong', { class: 'auth-modal-pagina__feat-tit' }, [titulo]),
      crearEl('p', { class: 'auth-modal-pagina__feat-sub' }, [sub]),
    ]),
  ]);

export default async (ctx) => {
  const { info } = aplicarPreset(ctx);
  const heroSrc = _porId.get(info?.lottieId || 'mobile-dev');

  const btnIngresar = Boton({
    texto: t('auth.modal_open') || 'Abrir modal de ingreso',
    variante: 'primary',
    onClick: () => abrirModalAuth('ingresar'),
  });
  const btnRegistrar = Boton({
    texto: t('auth.register'),
    variante: 'outline',
    onClick: () => abrirModalAuth('registrar'),
  });

  const hero = heroSrc
    ? HeroDecoracion({ tipo: 'lottie', src: heroSrc, alto: 200, tono: 'info', forma: 'sin-fondo' })
    : null;

  return crearEl('div', { class: 'auth-modal-pagina' }, [
    crearEl('div', { class: 'auth-modal-pagina__cabecera' }, [
      MarcaAuth({ tamano: 'lg' }),
    ]),

    hero,

    crearEl('h1', { class: 'auth-modal-pagina__h1' }, ['Auth dentro de un modal']),
    crearEl('p', { class: 'auth-modal-pagina__lead' }, [
      t('auth.modal_intro') ||
      'Demo: el flujo de autenticación se puede mostrar dentro de un modal cuando el visitante intenta una acción protegida sin abandonar la página.',
    ]),

    crearEl('div', { class: 'auth-modal-pagina__acciones' }, [
      btnIngresar,
      btnRegistrar,
    ]),

    /* Tres tarjetas pequeñas de "qué incluye" — visualmente más rica que el
       botón solo. Iconos como SVG inline, theme-aware vía currentColor. */
    crearEl('div', { class: 'auth-modal-pagina__feats' }, [
      Caracteristica({
        icono: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
        titulo: 'Conexión segura',
        sub: 'Cifrado en tránsito y validación lado servidor.',
      }),
      Caracteristica({
        icono: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.36.16.68.4 1 1z"/></svg>`,
        titulo: 'Sin abandonar la página',
        sub: 'Gating de acciones sin perder el contexto del usuario.',
      }),
      Caracteristica({
        icono: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
        titulo: 'Tema claro / oscuro',
        sub: 'Hereda colores, iconos y tipografía del tema activo.',
      }),
    ]),
  ]);
};
