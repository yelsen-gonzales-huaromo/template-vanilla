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

    /* ───────────── Panel promocional (lado izquierdo en split / card) ─────────
       Tres modos disponibles:
         • 'gradiente' (default) — color sólido o gradiente con bullets.
         • 'imagen'              — una sola imagen full bleed con overlay y texto.
         • 'carrusel'            — carrusel autoplay con varias diapositivas.

       Auto-resolución (cuando panelModo === 'auto'):
         - Si panelSlides.length > 1  → 'carrusel'
         - Si panelImagen está definido → 'imagen'
         - Si panelSlides.length === 1 → 'imagen' (con la única slide)
         - En cualquier otro caso       → 'gradiente'
    */
    panelModo:    'gradiente',              // 'auto' | 'gradiente' | 'imagen' | 'carrusel'
    panelImagen:  '',                       // URL absoluta o relativa (modo 'imagen')
    panelGradiente: null,                   // p.ej. 'linear-gradient(135deg, #0ea5e9, #6366f1)'
    panelSlides:  [],                       // [{ urlImg, titulo, sub }] (modo 'carrusel')
    panelTextoSobreImagen: true,            // muestra marca + lead encima de la imagen
    panelTitulo:  null,                     // headline del panel (default = app.tagline)
    panelLead:    null,                     // sub-headline (default = auth.trust_pitch)
    panelStats:   null,                     // [{ numero, etiqueta }] — 3 a 4 ítems en el pie
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

/* Deep merge sólo en el primer nivel — para que sobreescribir `auth.cabeceraToken`
   en index.html no borre `auth.panelModo` (y resto de defaults nuevos). */
const fundir = (base, sobre) => {
  const salida = { ...base };
  for (const [k, v] of Object.entries(sobre || {})) {
    if (v && typeof v === 'object' && !Array.isArray(v) && base[k] && typeof base[k] === 'object') {
      salida[k] = { ...base[k], ...v };
    } else {
      salida[k] = v;
    }
  }
  return salida;
};

export const CONFIG_APP = Object.freeze(fundir(
  POR_DEFECTO,
  typeof window !== 'undefined' && window.LAUNCHPAD_CONFIG ? window.LAUNCHPAD_CONFIG : {},
));
