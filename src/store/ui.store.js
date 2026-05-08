import { senal } from '../utils/helpers/reactive.js';
import { almacenamientoLocal } from '../utils/helpers/storage.js';
import { busEventos, EVENTOS_APP } from '../utils/helpers/event-bus.js';
import { CLAVES_ALMACENAMIENTO } from '../utils/constants/index.js';
import { CONFIG_APP } from '../config/app.config.js';

// ===== Señales reactivas =====
const tema          = senal(CONFIG_APP.ui.temaPorDefecto);
const idioma        = senal(CONFIG_APP.ui.idiomaPorDefecto);
const direccion     = senal(CONFIG_APP.ui.direccion);
const barraAbierta  = senal(true);
const barraFijada   = senal(true);
const posicionNav   = senal('vertical');     // 'vertical' | 'top' | 'combo'
const estiloSidebar = senal('default');      // 'default' | 'transparent' | 'inverted' | 'card' | 'vibrant'
const densidad      = senal('comfortable');   // 'compact' | 'comfortable' | 'spacious'
const tamanoFuente  = senal('md');            // 'sm' | 'md' | 'lg'
const fuente        = senal('inter');         // ver FUENTES_DISPONIBLES
const colorMarca    = senal('blue');          // 'blue' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'violet' | 'cyan'

/**
 * Catálogo de fuentes disponibles. `googleFont` = `null` para fuentes nativas
 * que no necesitan carga externa.
 */
export const FUENTES_DISPONIBLES = [
  { id: 'inter',       nombre: 'Inter',          googleFont: 'Inter:wght@400;500;600;700;800' },
  { id: 'system',      nombre: 'Sistema',         googleFont: null },
  { id: 'roboto',      nombre: 'Roboto',          googleFont: 'Roboto:wght@400;500;700' },
  { id: 'poppins',     nombre: 'Poppins',         googleFont: 'Poppins:wght@400;500;600;700' },
  { id: 'dmsans',      nombre: 'DM Sans',         googleFont: 'DM+Sans:wght@400;500;700' },
  { id: 'sourcesans',  nombre: 'Source Sans',     googleFont: 'Source+Sans+3:wght@400;600;700' },
  { id: 'ibm',         nombre: 'IBM Plex Sans',   googleFont: 'IBM+Plex+Sans:wght@400;500;600' },
  { id: 'nunito',      nombre: 'Nunito',          googleFont: 'Nunito:wght@400;600;700' },
  { id: 'georgia',     nombre: 'Georgia',         googleFont: null },
  { id: 'playfair',    nombre: 'Playfair',        googleFont: 'Playfair+Display:wght@400;700' },
  { id: 'jetbrains',   nombre: 'JetBrains Mono',  googleFont: 'JetBrains+Mono:wght@400;500;700' },
];

const fuentesCargadas = new Set(['inter']); // Inter viene en index.html
const cargarGoogleFont = (id) => {
  if (fuentesCargadas.has(id)) return;
  const def = FUENTES_DISPONIBLES.find(f => f.id === id);
  if (!def || !def.googleFont) { fuentesCargadas.add(id); return; }
  if (document.querySelector(`link[data-font="${id}"]`)) { fuentesCargadas.add(id); return; }
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.dataset.font = id;
  link.href = `https://fonts.googleapis.com/css2?family=${def.googleFont}&display=swap`;
  document.head.appendChild(link);
  fuentesCargadas.add(id);
};

// ===== Aplicadores DOM =====
let _temporizadorTema = null;
const aplicarTema = (siguiente) => {
  const resuelto = siguiente === 'system'
    ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : siguiente;

  // Activa transición global SOLO durante el cambio. Una clase en <html>
  // dispara una regla CSS que aplica `transition: bg/border/color/...` con
  // !important a TODOS los elementos. Tras la duración, se remueve para que
  // los componentes recuperen sus transiciones normales (hover rápido, etc.)
  const html = document.documentElement;
  html.classList.add('cambio-tema');
  html.setAttribute('data-theme', resuelto);
  clearTimeout(_temporizadorTema);
  _temporizadorTema = setTimeout(() => {
    html.classList.remove('cambio-tema');
  }, 550);  // un poco más que --transition-tema (500ms) para asegurar fin
};

const aplicarDireccion = (siguiente) => document.documentElement.setAttribute('dir', siguiente);
const aplicarIdioma    = (siguiente) => document.documentElement.setAttribute('lang', siguiente);

const aplicarDensidad = (siguiente) => {
  if (siguiente === 'comfortable') document.documentElement.removeAttribute('data-density');
  else                              document.documentElement.setAttribute('data-density', siguiente);
};

const aplicarTamanoFuente = (siguiente) => {
  if (siguiente === 'md') document.documentElement.removeAttribute('data-font-size');
  else                     document.documentElement.setAttribute('data-font-size', siguiente);
};

const aplicarColorMarca = (siguiente) => {
  if (siguiente === 'blue') document.documentElement.removeAttribute('data-accent');
  else                       document.documentElement.setAttribute('data-accent', siguiente);
};

const aplicarFuente = (siguiente) => {
  cargarGoogleFont(siguiente);
  if (siguiente === 'inter') document.documentElement.removeAttribute('data-font');
  else                        document.documentElement.setAttribute('data-font', siguiente);
};

const aplicarPosicionNav = (siguiente) => {
  document.documentElement.setAttribute('data-nav-pos', siguiente);
};

const aplicarEstiloSidebar = (siguiente) => {
  if (siguiente === 'default') document.documentElement.removeAttribute('data-sidebar-style');
  else                          document.documentElement.setAttribute('data-sidebar-style', siguiente);
};

/**
 * Las CSS transitions sobre tokens (--transition-tema en transitions.css) ya
 * dan un fade suave al cambiar tema/color/densidad/fuente. NO usamos
 * `document.startViewTransition` aquí porque captura un snapshot completo
 * de la página (incluyendo modales abiertos) y produce un parpadeo cuando
 * el usuario cambia configuración con el panel abierto.
 *
 * View Transitions sí se usa — solo en el router, para crossfade entre páginas.
 */

export const estadoUi = {
  tema, idioma, direccion, barraAbierta, barraFijada,
  posicionNav, estiloSidebar,
  densidad, tamanoFuente, fuente, colorMarca,

  hidratar() {
    tema.value         = almacenamientoLocal.obtener(CLAVES_ALMACENAMIENTO.TEMA, tema.value);
    idioma.value       = almacenamientoLocal.obtener(CLAVES_ALMACENAMIENTO.IDIOMA, idioma.value);
    direccion.value    = almacenamientoLocal.obtener(CLAVES_ALMACENAMIENTO.DIRECCION, direccion.value);
    barraAbierta.value = almacenamientoLocal.obtener(CLAVES_ALMACENAMIENTO.ESTADO_BARRA, true);
    posicionNav.value  = almacenamientoLocal.obtener(CLAVES_ALMACENAMIENTO.POSICION_NAV, posicionNav.value);
    estiloSidebar.value= almacenamientoLocal.obtener(CLAVES_ALMACENAMIENTO.ESTILO_SIDEBAR, estiloSidebar.value);
    densidad.value     = almacenamientoLocal.obtener(CLAVES_ALMACENAMIENTO.DENSIDAD, densidad.value);
    tamanoFuente.value = almacenamientoLocal.obtener(CLAVES_ALMACENAMIENTO.TAMANO_FUENTE, tamanoFuente.value);
    fuente.value       = almacenamientoLocal.obtener(CLAVES_ALMACENAMIENTO.FUENTE, fuente.value);
    colorMarca.value   = almacenamientoLocal.obtener(CLAVES_ALMACENAMIENTO.COLOR_MARCA, colorMarca.value);

    aplicarTema(tema.value);
    aplicarDireccion(direccion.value);
    aplicarIdioma(idioma.value);
    aplicarDensidad(densidad.value);
    aplicarTamanoFuente(tamanoFuente.value);
    aplicarFuente(fuente.value);
    aplicarColorMarca(colorMarca.value);
    aplicarPosicionNav(posicionNav.value);
    aplicarEstiloSidebar(estiloSidebar.value);

    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (tema.value === 'system') aplicarTema('system');
    });
  },

  establecerTema(siguiente) {
    tema.value = siguiente;
    almacenamientoLocal.guardar(CLAVES_ALMACENAMIENTO.TEMA, siguiente);
    aplicarTema(siguiente);
    busEventos.emitir(EVENTOS_APP.TEMA_CAMBIADO, siguiente);
  },

  establecerIdioma(siguiente) {
    idioma.value = siguiente;
    almacenamientoLocal.guardar(CLAVES_ALMACENAMIENTO.IDIOMA, siguiente);
    aplicarIdioma(siguiente);
  },

  establecerDireccion(siguiente) {
    direccion.value = siguiente;
    almacenamientoLocal.guardar(CLAVES_ALMACENAMIENTO.DIRECCION, siguiente);
    aplicarDireccion(siguiente);
  },

  establecerDensidad(siguiente) {
    densidad.value = siguiente;
    almacenamientoLocal.guardar(CLAVES_ALMACENAMIENTO.DENSIDAD, siguiente);
    aplicarDensidad(siguiente);
  },

  establecerTamanoFuente(siguiente) {
    tamanoFuente.value = siguiente;
    almacenamientoLocal.guardar(CLAVES_ALMACENAMIENTO.TAMANO_FUENTE, siguiente);
    aplicarTamanoFuente(siguiente);
  },

  establecerFuente(siguiente) {
    fuente.value = siguiente;
    almacenamientoLocal.guardar(CLAVES_ALMACENAMIENTO.FUENTE, siguiente);
    aplicarFuente(siguiente);
  },

  establecerColorMarca(siguiente) {
    colorMarca.value = siguiente;
    almacenamientoLocal.guardar(CLAVES_ALMACENAMIENTO.COLOR_MARCA, siguiente);
    aplicarColorMarca(siguiente);
  },

  alternarBarra() {
    barraAbierta.value = !barraAbierta.value;
    almacenamientoLocal.guardar(CLAVES_ALMACENAMIENTO.ESTADO_BARRA, barraAbierta.value);
    busEventos.emitir(EVENTOS_APP.BARRA_TOGGLE, barraAbierta.value);
  },

  establecerPosicionNav(siguiente) {
    posicionNav.value = siguiente;
    almacenamientoLocal.guardar(CLAVES_ALMACENAMIENTO.POSICION_NAV, siguiente);
    aplicarPosicionNav(siguiente);
    // El shell del layout cambia (sidebar vs top) → re-render forzado.
    busEventos.emitir('app:relayout');
  },

  establecerEstiloSidebar(siguiente) {
    estiloSidebar.value = siguiente;
    almacenamientoLocal.guardar(CLAVES_ALMACENAMIENTO.ESTILO_SIDEBAR, siguiente);
    aplicarEstiloSidebar(siguiente);
  },
};
