import { crearEl } from '../../../utils/helpers/dom.js';
import { efecto } from '../../../utils/helpers/reactive.js';
import { Avatar } from '../../../components/ui/avatar/avatar.js';
import { MenuDesplegable } from '../../../components/ui/dropdown/dropdown.js';
import { PanelConfiguracion } from '../../../components/ui/config-panel/config-panel.js';
import { ComandoPaleta } from '../../../components/ui/command-palette/command-palette.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { estadoUi } from '../../../store/ui.store.js';
import { estadoAuth } from '../../../store/auth.store.js';
import { estadoInbox } from '../../../store/inbox.store.js';
import { usarAutenticacion } from '../../../hooks/useAuth.js';
import { usarTema } from '../../../hooks/useTheme.js';
import { navegarA } from '../../../router/index.js';
import { RUTAS, NOMBRES_RUTAS } from '../../../config/routes.config.js';
import { t } from '../../../i18n/index.js';
import { PanelNotificaciones } from './notifications-panel.js';
import { PanelAplicaciones } from './apps-panel.js';

const N = NOMBRES_RUTAS;

/**
 * Header compacto (referencia: Shadcn admin / Vercel):
 *   [☰] [🔍 Buscar… ⌘K]               [☾] [⚙] [▦ Apps] [🔔] [Avatar]
 *
 * La búsqueda es un botón que abre el command palette (⌘K). Apps abre un
 * launcher 9-tile, Notif abre un dropdown con notificaciones, y el Avatar
 * abre el menú de cuenta. NO sticky — scrollea con el contenido.
 */
export const BarraSuperior = () => {
  const { cerrarSesion } = usarAutenticacion();
  const { alternar: alternarTema } = usarTema();

  // ---- Toggle sidebar ----
  const btnMenu = crearEl('button', {
    class: 'navbar__icon-btn', 'aria-label': 'Alternar navegación',
    onClick: () => {
      if (matchMedia('(max-width: 1023.98px)').matches) {
        estadoUi.alternarBarra();
      } else {
        estadoUi.barraFijada.value = !estadoUi.barraFijada.peek();
      }
    },
  }, [Icono('panel_l')]);

  // ---- Búsqueda → abre el command palette (⌘K) ----
  const esMac = /Mac|iPhone|iPad/i.test(navigator.platform);
  const btnBuscar = crearEl('button', {
    type: 'button',
    class: 'navbar__search',
    'aria-label': 'Buscar',
    onClick: () => ComandoPaleta.abrir(),
  }, [
    crearEl('span', { class: 'navbar__search-icon', 'aria-hidden': 'true' }, [
      Icono('busqueda', { tamano: 16 }),
    ]),
    crearEl('span', { class: 'navbar__search-text' }, [t('actions.search') + '…']),
    crearEl('kbd', { class: 'navbar__search-kbd', 'aria-hidden': 'true' }, [
      esMac ? '⌘K' : 'Ctrl K',
    ]),
  ]);

  // ---- Tema (icono cambia con el modo activo) ----
  const btnTema = crearEl('button', {
    class: 'navbar__icon-btn', 'aria-label': 'Cambiar tema', onClick: alternarTema,
  });
  const refrescarIconoTema = () => {
    btnTema.replaceChildren(Icono(estadoUi.tema.peek() === 'dark' ? 'sol' : 'luna'));
  };
  refrescarIconoTema();
  estadoUi.tema.subscribe(refrescarIconoTema);

  // ---- Configuración ----
  const btnConfig = crearEl('button', {
    class: 'navbar__icon-btn', 'aria-label': 'Configuración',
    onClick: () => PanelConfiguracion.abrir(),
  }, [Icono('ajustes')]);

  // ---- Aplicaciones (launcher rico estilo Falcon) ----
  const btnApps = crearEl('button', {
    type: 'button',
    class: 'navbar__icon-btn',
    'aria-label': 'Aplicaciones',
  }, [Icono('rejilla9')]);

  const appsConMenu = MenuDesplegable({
    disparador: btnApps,
    direccion: 'down',
    alineacion: 'end',
    cuerpo: PanelAplicaciones(),
  });

  // ---- Notificaciones (panel rico con NUEVAS / ANTERIORES) ----
  // Badge reactivo: muestra la cuenta de no-leídas. Se oculta si está en 0.
  const badgeCount = crearEl('span', {
    class: 'navbar__count',
    'aria-live': 'polite',
    'aria-label': 'Notificaciones sin leer',
  });
  efecto(() => {
    const n = estadoInbox.totalNoLeidas.value;
    badgeCount.textContent = n > 9 ? '9+' : String(n);
    badgeCount.style.display = n > 0 ? '' : 'none';
  });

  const btnNotif = crearEl('button', {
    type: 'button',
    class: 'navbar__icon-btn', 'aria-label': 'Notificaciones',
  }, [
    Icono('campana'),
    badgeCount,
  ]);
  const notifConMenu = MenuDesplegable({
    disparador: btnNotif,
    direccion: 'down',
    alineacion: 'end',
    cuerpo: PanelNotificaciones(),
  });

  // ---- Avatar usuario con dropdown ----
  const u = estadoAuth.usuario.peek();
  const nombreU = u?.nombre || u?.name || 'Invitado';
  const btnUsuario = crearEl('button', {
    type: 'button',
    class: 'navbar__avatar-btn',
    'aria-label': 'Cuenta',
  }, [
    Avatar({ nombre: nombreU, tamano: 'sm' }),
  ]);

  const cardUsuario = crearEl('div', { class: 'dropdown__user-card' }, [
    Avatar({ nombre: nombreU, tamano: 'sm' }),
    crearEl('div', { class: 'dropdown__user-text' }, [
      crearEl('strong', null, [nombreU]),
      crearEl('span', null, [u?.email || nombreU]),
    ]),
  ]);

  const usuarioConMenu = MenuDesplegable({
    disparador: btnUsuario,
    direccion: 'down',
    alineacion: 'end',
    encabezado: cardUsuario,
    items: [
      { separador: true },
      { etiqueta: t('nav.profile'),         icono: Icono('perfil',       { tamano: 16 }), alSeleccionar: () => navegarA(RUTAS[N.PERFIL]) },
      { etiqueta: t('nav.security'),        icono: Icono('seguridad',    { tamano: 16 }), alSeleccionar: () => navegarA(RUTAS[N.SEGURIDAD]) },
      { etiqueta: t('nav.preferences'),     icono: Icono('preferencias', { tamano: 16 }), alSeleccionar: () => navegarA(RUTAS[N.PREFERENCIAS]) },
      { separador: true },
      { etiqueta: t('auth.lock_screen'),    icono: Icono('candado',       { tamano: 16 }), alSeleccionar: () => navegarA(RUTAS[N.BLOQUEO]) },
      { etiqueta: t('actions.logout'),      icono: Icono('cerrar_sesion', { tamano: 16 }), peligro: true,
        alSeleccionar: async () => {
          await cerrarSesion();
          navegarA(RUTAS[N.INGRESAR]);
        } },
    ],
  });

  return crearEl('header', { class: 'navbar', role: 'banner' }, [
    crearEl('div', { class: 'navbar__left' }, [btnMenu, btnBuscar]),
    crearEl('div', { class: 'navbar__right' }, [
      btnTema,
      btnConfig,
      appsConMenu,
      notifConMenu,
      usuarioConMenu,
    ]),
  ]);
};
