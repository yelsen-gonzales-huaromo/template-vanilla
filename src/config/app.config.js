/**
 * Configuración de la aplicación.
 * Leemos de `window.LAUNCHPAD_CONFIG` (definido inline en index.html) para que
 * el código sea 100% vanilla sin depender de un bundler. El backend (Razor,
 * Spring, Blade…) puede sobreescribir estos valores antes de cargar main.js.
 */
const POR_DEFECTO = {
  nombre:  'Launchpad',
  version: '1.0.0',
  ambiente: 'development',

  api: {
    urlBase: '/api',
    tiempoEspera: 15000,
  },

  auth: {
    cabeceraToken: 'Authorization',
    prefijoToken:  'Bearer',
    margenRenovacionSeg: 60,
  },

  ui: {
    temaPorDefecto:    'system',
    idiomaPorDefecto:  'es',
    idiomasSoportados: ['es', 'en'],
    direccion: 'ltr',
  },

  caracteristicas: {
    pwa: false,
    analitica: false,
  },

  modoDemo: true,
};

export const CONFIG_APP = Object.freeze({
  ...POR_DEFECTO,
  ...(typeof window !== 'undefined' && window.LAUNCHPAD_CONFIG ? window.LAUNCHPAD_CONFIG : {}),
});
