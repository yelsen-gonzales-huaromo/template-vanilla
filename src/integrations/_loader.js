/**
 * Cargador lazy de scripts y CSS de terceros.
 *
 * Cada adaptador en `src/integrations/<lib>/` lo usa para descargar su lib
 * desde CDN sólo cuando hace falta (la primera vez que se monta el componente
 * que la necesita). Las llamadas posteriores reutilizan la misma promesa.
 *
 * Si quieres trabajar offline, sustituye las URLs CDN en cada adaptador por
 * rutas locales tipo `./vendor/<lib>/...`.
 */

const cargas = new Map();

/** Carga un script JS UMD/IIFE. Devuelve una promesa que resuelve cuando está listo. */
export const cargarScript = (url, { defer = false, attrs = {} } = {}) => {
  if (cargas.has(url)) return cargas.get(url);

  const promesa = new Promise((resolver, rechazar) => {
    if (document.querySelector(`script[data-src="${url}"]`)) {
      // Ya estaba en el DOM (otra promesa lo cargó). Esperamos al evento load.
      return resolver();
    }

    const s = document.createElement('script');
    s.src = url;
    s.dataset.src = url;
    s.defer = defer;
    s.async = true;
    Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
    s.onload = () => resolver();
    s.onerror = () => rechazar(new Error(`No se pudo cargar el script: ${url}`));
    document.head.appendChild(s);
  });

  cargas.set(url, promesa);
  return promesa;
};

/** Inserta una hoja de estilo. Idempotente. */
export const cargarCss = (url) => {
  if (document.querySelector(`link[data-src="${url}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  link.dataset.src = url;
  document.head.appendChild(link);
};

/** Espera a que `window[clave]` esté definido (algunos scripts UMD demoran). */
export const esperarGlobal = async (clave, timeoutMs = 5000) => {
  const inicio = Date.now();
  while (typeof window[clave] === 'undefined') {
    if (Date.now() - inicio > timeoutMs) {
      throw new Error(`Timeout esperando "window.${clave}"`);
    }
    await new Promise(r => setTimeout(r, 30));
  }
  return window[clave];
};

/**
 * Helper compuesto: carga CSS (puede ser array) y luego scripts en orden.
 * Retorna `window[claveGlobal]` cuando todo está listo.
 *
 *   const flatpickr = await cargarLib({
 *     css: 'https://.../flatpickr.min.css',
 *     scripts: ['https://.../flatpickr.min.js'],
 *     global: 'flatpickr',
 *   });
 */
export const cargarLib = async ({ css = [], scripts = [], global }) => {
  const cssArr     = Array.isArray(css)     ? css     : [css];
  const scriptsArr = Array.isArray(scripts) ? scripts : [scripts];

  cssArr.forEach(cargarCss);

  // Scripts en SERIE (algunos dependen del anterior).
  for (const url of scriptsArr) {
    await cargarScript(url);
  }

  if (global) return esperarGlobal(global);
};
