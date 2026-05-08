/**
 * Enrutador SPA ligero con HASH routing (`#/panel` en vez de `/panel`).
 *
 * Por qué hash: funciona en CUALQUIER servidor estático sin configurar fallback
 * (Live Server, python http.server, S3, GitHub Pages, nginx sin reglas...).
 * Internamente seguimos trabajando con paths "/panel/crm" — sólo la URL en la
 * barra del navegador lleva el `#`. Si más adelante despliegas detrás de un
 * backend con fallback (Spring Boot, ASP.NET, Laravel), puedes cambiar a History
 * API en una sola función sin tocar las rutas ni los componentes.
 */
import { rutas } from './routes.js';
import { busEventos, EVENTOS_APP } from '../utils/helpers/event-bus.js';
import { senal } from '../utils/helpers/reactive.js';
import { montarDiseno } from '../layouts/index.js';
import { CONFIG_APP } from '../config/app.config.js';

const rutaActual = senal(null);

/** Lee la ruta lógica (sin `#`) desde `location.hash`. */
const leerRutaDeUrl = () => {
  let bruto = window.location.hash || '';
  if (bruto.startsWith('#')) bruto = bruto.slice(1);
  if (!bruto) return { ruta: '/', qs: '' };
  if (!bruto.startsWith('/')) bruto = '/' + bruto;
  const [ruta, qs] = bruto.split('?');
  return { ruta: ruta || '/', qs: qs || '' };
};

const emparejarRuta = (ruta) => {
  const exacta = rutas.find(r => r.path === ruta);
  if (exacta) return exacta;
  return rutas.find(r => r.path === '*');
};

const parsearQuery = (busqueda) => {
  const params = {};
  new URLSearchParams(busqueda).forEach((v, k) => { params[k] = v; });
  return params;
};

const renderError = (raiz, mensaje) => {
  raiz.innerHTML = `<div style="padding:2rem;text-align:center;color:var(--color-danger)">
    <h2>Error</h2><p>${mensaje}</p></div>`;
};

let manejandoCambio = false;

const manejarCambioRuta = async () => {
  // Evita re-entradas (las redirecciones encadenadas modifican el hash y disparan hashchange).
  if (manejandoCambio) return;
  manejandoCambio = true;

  try {
    const { ruta, qs } = leerRutaDeUrl();
    const query = parsearQuery(qs);
    const definicion = emparejarRuta(ruta);

    if (!definicion) return;
    if (definicion.redirect) {
      manejandoCambio = false;
      return navegarA(definicion.redirect, { reemplazar: true });
    }

    const ctx = { path: ruta, query, name: definicion.name, meta: definicion.meta || {} };

    for (const guardia of definicion.guards || []) {
      const resultado = await guardia(ctx);
      const destino = resultado?.redireccion || resultado?.redirect;
      if (destino) {
        manejandoCambio = false;
        return navegarA(destino, { reemplazar: true, query: resultado.query });
      }
    }

    document.title = `${definicion.meta?.title ? definicion.meta.title + ' · ' : ''}${CONFIG_APP.nombre}`;

    const app = document.getElementById('app');
    if (!app) return;

    try {
      const modulo = await definicion.component();
      const renderPagina = modulo.default || modulo.render || modulo[Object.keys(modulo)[0]];
      const nodo = await renderPagina(ctx);
      // Wrapper que captura errores síncronos de montaje — antes los tragaba la View Transition.
      const aplicar = () => {
        try {
          montarDiseno(definicion.layout || 'blank', nodo, app);
        } catch (errMonto) {
          console.error('[enrutador] error montando la página', errMonto);
          renderError(app, `Error al montar: ${errMonto.message || errMonto}`);
        }
      };
      // View Transitions API: crossfade fluido cuando el navegador la soporta.
      // Si una nueva navegación llega antes que termine la anterior, el browser
      // aborta con `InvalidStateError`. Sólo silenciamos errores de ABORTO,
      // no de bugs reales (esos los reporta el catch interno de aplicar).
      if (typeof document.startViewTransition === 'function') {
        try {
          const t = document.startViewTransition(aplicar);
          const silenciarAborto = (e) => {
            if (e?.name === 'AbortError' || e?.name === 'InvalidStateError') return;
            console.error('[enrutador] view-transition error', e);
          };
          t.updateCallbackDone?.catch?.(silenciarAborto);
          t.ready?.catch?.(silenciarAborto);
          t.finished?.catch?.(silenciarAborto);
        } catch (_) {
          aplicar();
        }
      } else {
        aplicar();
      }
    } catch (err) {
      console.error('[enrutador] fallo al cargar la ruta', err);
      renderError(app, `No se pudo cargar la página: ${err.message || err}`);
      busEventos.emitir(EVENTOS_APP.ERROR_CAPTURADO, err);
    }

    rutaActual.value = ctx;
    busEventos.emitir(EVENTOS_APP.RUTA_CAMBIADA, ctx);
  } finally {
    manejandoCambio = false;
  }
};

/** Navega a la ruta indicada (formato lógico: "/panel/crm"). */
export const navegarA = (ruta, { reemplazar = false, query } = {}) => {
  let destino = ruta;
  if (query && Object.keys(query).length > 0) {
    destino += '?' + new URLSearchParams(query).toString();
  }
  const nuevoHash = '#' + destino;

  if (reemplazar) {
    history.replaceState({}, '', nuevoHash);
    return manejarCambioRuta();
  }

  if (nuevoHash === location.hash) {
    // Mismo destino — el setter de location.hash no dispararía hashchange.
    return manejarCambioRuta();
  }

  // Cambiar location.hash dispara `hashchange` automáticamente, que llama a manejarCambioRuta.
  location.hash = destino;
};

export const iniciarEnrutador = () => {
  window.addEventListener('hashchange', manejarCambioRuta);

  // Cuando cambia la posición de la nav (vertical/top/combo), el shell completo
  // cambia, así que re-ejecutamos el handler de la ruta actual.
  busEventos.on('app:relayout', () => manejarCambioRuta());

  // Intercepta clicks en anchors locales para mantener navegación SPA.
  document.addEventListener('click', (e) => {
    const enlace = e.target.closest('a[href]');
    if (!enlace) return;
    let href = enlace.getAttribute('href');
    if (!href) return;
    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (enlace.target === '_blank' || enlace.hasAttribute('download')) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    // Soportamos hrefs con prefijo "/" (forma lógica) o "#/" (hash explícito).
    if (href.startsWith('/') || href.startsWith('#/')) {
      e.preventDefault();
      const ruta = href.startsWith('#') ? href.slice(1) : href;
      navegarA(ruta);
    }
    // Anclas tipo "#seccion" (sin barra) se dejan al navegador para scroll nativo.
  });

  // Si no hay hash al cargar, sembramos uno para que la primera resolución funcione.
  if (!window.location.hash || window.location.hash === '#') {
    history.replaceState({}, '', '#/');
  }

  return manejarCambioRuta();
};

export const usarRuta = () => rutaActual;
