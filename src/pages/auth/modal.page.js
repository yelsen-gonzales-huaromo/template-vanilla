/**
 * /auth/modal — página demo: el formulario de auth dentro de un Modal.
 * Útil cuando un visitante pulsa una acción protegida y queremos pedirle
 * credenciales sin sacarlo de la página actual.
 *
 * Esta página vive en el layout 'blank' (no auth-*), porque parte del demo
 * es mostrar que el modal aparece sobre cualquier contenido.
 */
import { crearEl } from '../../utils/helpers/dom.js';
import { Boton } from '../../components/ui/button/button.js';
import { Modal } from '../../components/ui/modal/modal.js';
import { MarcaAuth } from '../../components/auth/auth-elements.js';
import { FormularioIngresar, FormularioRegistrar } from '../../components/auth/auth-forms.js';
import { busEventos, EVENTOS_APP } from '../../utils/helpers/event-bus.js';
import { t } from '../../i18n/index.js';

const abrirModalAuth = (modo = 'ingresar') => {
  const cuerpo = crearEl('div', { class: 'auth-modal-cuerpo' }, [
    modo === 'registrar' ? FormularioRegistrar() : FormularioIngresar(),
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

export default async () => {
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

  return crearEl('div', { class: 'auth-modal-pagina' }, [
    MarcaAuth({ tamano: 'lg' }),
    crearEl('h1', { class: 'auth-modal-pagina__h1' }, ['Auth dentro de un modal']),
    crearEl('p', { class: 'auth-modal-pagina__lead' }, [
      t('auth.modal_intro') ||
      'Demo: el flujo de autenticación se puede mostrar dentro de un modal cuando el visitante intenta una acción protegida sin abandonar la página.',
    ]),
    crearEl('div', { class: 'auth-modal-pagina__acciones' }, [
      btnIngresar,
      btnRegistrar,
    ]),
  ]);
};
