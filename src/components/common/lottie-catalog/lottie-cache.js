/**
 * Caché local de animaciones Lottie — funciona como "descarga automática".
 *
 * Estrategia:
 *   1) Primera vez que se pide una URL → la fetcha del CDN y guarda el JSON
 *      en `localStorage` bajo una clave hash de la URL.
 *   2) Próximas veces (incluso entre sesiones / reloads) → la sirve del caché
 *      como `Blob URL` local. NO depende del CDN.
 *
 * Resultado: una vez visto el catálogo una vez, **todas las animaciones
 * funcionan offline aunque LottieFiles se caiga o invalide URLs**.
 *
 * Límite: localStorage acepta ~5MB. 30 animaciones × 30KB avg ≈ 900KB → cabe.
 *
 * API:
 *   await obtenerLottieCacheado(url)  → string (URL local Blob, o la original
 *                                       si fetch falla y no hay caché)
 *   precargarLotties([url1, url2…], onProgreso) → Promise<{ ok, fail }>
 *   estadoLottieCache(url) → 'cached' | 'remoto' | 'fallido'
 */

const PREFIJO = 'launchpad.lottie.';
const PREFIJO_FALLO = 'launchpad.lottie.fail.';

const hashUrl = (url) => {
  // Hash simple determinístico (FNV-1a básico) — suficiente para clave única.
  let h = 0x811c9dc5;
  for (let i = 0; i < url.length; i++) {
    h ^= url.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
};

const claveCache = (url) => PREFIJO + hashUrl(url);
const claveFallo = (url) => PREFIJO_FALLO + hashUrl(url);

/** Crea una Blob URL local a partir del JSON cacheado. */
const aBlobUrl = (jsonTexto) => {
  const blob = new Blob([jsonTexto], { type: 'application/json' });
  return URL.createObjectURL(blob);
};

/** Devuelve el estado del caché para una URL. */
export const estadoLottieCache = (url) => {
  try {
    if (localStorage.getItem(claveCache(url))) return 'cached';
    if (localStorage.getItem(claveFallo(url))) return 'fallido';
    return 'remoto';
  } catch (_) { return 'remoto'; }
};

/** Limpia todo el caché Lottie (útil para forzar re-descarga). */
export const limpiarLottieCache = () => {
  try {
    const claves = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(PREFIJO) || k?.startsWith(PREFIJO_FALLO)) claves.push(k);
    }
    claves.forEach((k) => localStorage.removeItem(k));
  } catch (_) {}
};

/**
 * Resuelve una URL de Lottie. Si ya está cacheada, devuelve Blob URL local.
 * Si no, intenta fetchear, cachear y devolver Blob URL. Si falla, devuelve la
 * URL original (deja que el player lo intente directamente).
 */
export const obtenerLottieCacheado = async (url) => {
  if (!url) return url;
  try {
    const cacheado = localStorage.getItem(claveCache(url));
    if (cacheado) return aBlobUrl(cacheado);
  } catch (_) {}

  try {
    const resp = await fetch(url, { mode: 'cors' });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const texto = await resp.text();
    // Validación mínima: debe parsear como JSON
    JSON.parse(texto);
    try { localStorage.setItem(claveCache(url), texto); } catch (_) {
      // localStorage lleno — borra fallos y reintenta
      try {
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const k = localStorage.key(i);
          if (k?.startsWith(PREFIJO_FALLO)) localStorage.removeItem(k);
        }
        localStorage.setItem(claveCache(url), texto);
      } catch (_) {}
    }
    try { localStorage.removeItem(claveFallo(url)); } catch (_) {}
    return aBlobUrl(texto);
  } catch (e) {
    try { localStorage.setItem(claveFallo(url), '1'); } catch (_) {}
    return url;  // fallback: dejar que el player intente directamente
  }
};

/**
 * Pre-cargar muchas URLs en paralelo (limitado para no saturar la red).
 * `onProgreso(hechas, total, urlActual, ok)` se llama tras cada una.
 */
export const precargarLotties = async (urls, onProgreso, concurrencia = 4) => {
  const cola = [...urls];
  let ok = 0, fail = 0, hechas = 0;
  const total = urls.length;

  const trabajador = async () => {
    while (cola.length) {
      const url = cola.shift();
      try {
        const cacheado = localStorage.getItem(claveCache(url));
        if (cacheado) { ok++; }
        else {
          const resp = await fetch(url, { mode: 'cors' });
          if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
          const texto = await resp.text();
          JSON.parse(texto);
          localStorage.setItem(claveCache(url), texto);
          localStorage.removeItem(claveFallo(url));
          ok++;
        }
        hechas++;
        onProgreso?.(hechas, total, url, true);
      } catch (e) {
        try { localStorage.setItem(claveFallo(url), '1'); } catch (_) {}
        fail++; hechas++;
        onProgreso?.(hechas, total, url, false);
      }
    }
  };

  await Promise.all(Array.from({ length: concurrencia }, trabajador));
  return { ok, fail, total };
};

/** Tamaño aproximado del caché Lottie en bytes. */
export const tamanoLottieCache = () => {
  try {
    let bytes = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(PREFIJO) && !k.startsWith(PREFIJO_FALLO)) {
        const v = localStorage.getItem(k);
        if (v) bytes += k.length + v.length;
      }
    }
    return bytes;
  } catch (_) { return 0; }
};
