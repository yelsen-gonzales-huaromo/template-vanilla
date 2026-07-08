/**
 * Catálogo de animaciones Lottie — clasificadas por uso.
 *
 * Los archivos viven en `/public/lottie/` (descargados manualmente desde
 * LottieFiles, IconScout, etc.). Cada item apunta al archivo local.
 *
 * Para añadir más:
 *   1) Descarga el .json desde la web
 *   2) Súbelo a /public/lottie/  (en la raíz, no en subcarpeta — el catálogo
 *      clasifica por nombre, no por carpeta)
 *   3) Añade aquí la entrada con `local: '/public/lottie/<archivo>.json'`
 */

// Ruta RELATIVA — la app vive en /template-vanilla/index.html, así que `./public/`
// resuelve correctamente a 127.0.0.1:5500/template-vanilla/public/lottie/...
const RUTA = './public/lottie/';

// Helper — encodea espacios y caracteres especiales para URL
const arch = (nombreArchivo) => `${RUTA}${encodeURIComponent(nombreArchivo)}`;

export const LOTTIE_CATALOGO = {

  // ─── LOADING / SPINNERS ────────────────────────────────────────────────
  loading: {
    titulo: 'Loading / Spinners',
    descripcion: 'Indicadores de trabajo en curso, carga, procesamiento.',
    items: [
      { id: 'simple-loading',     nombre: 'Simple loading',          local: arch('Simple Loading.json'), fondoBlanco: true },
      { id: 'loading',            nombre: 'Loading clásico',         local: arch('Loading.json') },
      { id: 'loading-anim',       nombre: 'Loading animation',       local: arch('Loading animation.json') },
      { id: 'loading-anim-low',   nombre: 'Loading (lowercase)',     local: arch('loading animation.json') },
      { id: 'loading-blue',       nombre: 'Loading azul',            local: arch('Loading animation blue.json') },
      { id: 'loading-circles',    nombre: 'Círculos',                local: arch('Loading circles.json') },
      { id: 'loading-gears',      nombre: 'Engranajes',              local: arch('Loading gears.json'), fondoBlanco: true },
      { id: 'sandy-loading',      nombre: 'Sandy loading',           local: arch('Sandy Loading.json') },
      { id: 'trail-loading',      nombre: 'Trail loading',           local: arch('Trail loading.json') },
      { id: 'geometric-loader',   nombre: 'Geometric shape',         local: arch('Geometric shape loader.json') },
      { id: 'material-wave',      nombre: 'Material wave',           local: arch('Material wave loading.json') },
      { id: 'abstract-isometric', nombre: 'Abstract isométrico',     local: arch('Abstract Isometric Loader #1.json') },
      { id: 'website-tab',        nombre: 'Website tab loading',     local: arch('Website Tab Loading Animation.json') },
      { id: 'ai-cpu',             nombre: 'AI CPU circuit',          local: arch('AI CPU circuit board loading animation.json') },
    ],
  },

  // ─── BÚSQUEDA ──────────────────────────────────────────────────────────
  busqueda: {
    titulo: 'Búsqueda',
    descripcion: 'Lupas, escaneo, filtrado.',
    items: [
      { id: 'searching-free',  nombre: 'Lupa buscando',     local: arch('Free Searching Animation.json') },
      { id: 'searching',       nombre: 'Searching',         local: arch('Searching Lottie.json') },
    ],
  },

  // ─── PREVIEW / ARCHIVOS ────────────────────────────────────────────────
  preview: {
    titulo: 'Preview / Archivos',
    descripcion: 'Documentos cargando, descargas, ubicación.',
    items: [
      { id: 'loading-files',  nombre: 'Cargando archivos',  local: arch('Loading Files.json') },
      { id: 'downloading',    nombre: 'Descargando',        local: arch('Downloading.json') },
      { id: 'location',       nombre: 'Ubicación cargando', local: arch('location loading.json') },
      { id: 'map-pin',        nombre: 'Map pin',            local: arch('Map pin location.json') },
      { id: 'loading-car',    nombre: 'Cargando (auto)',    local: arch('Loading_car.json') },
    ],
  },

  // ─── ESTADOS VACÍOS / 404 ──────────────────────────────────────────────
  vacio: {
    titulo: 'Estados vacíos / 404',
    descripcion: 'Errores 404, estados vacíos, sin datos.',
    items: [
      { id: 'empty-state',   nombre: 'Empty state',         local: arch('empty loading state.json') },
      { id: 'error-404',     nombre: 'Error 404',           local: arch('Error 404.json') },
      { id: '404-astronaut', nombre: '404 astronauta',      local: arch('404 error lost in space astronaut.json') },
      { id: '404-cat',       nombre: '404 con gato',        local: arch('404 error page with cat.json') },
      { id: 'error-flat',    nombre: 'Error (flat style)',  local: arch('Sign for error _ Flat style.json') },
    ],
  },

  // ─── ÉXITO ─────────────────────────────────────────────────────────────
  exito: {
    titulo: 'Éxito',
    descripcion: 'Confirmaciones, completado, check.',
    items: [
      { id: 'check',          nombre: 'Check animation',     local: arch('Check Animation.json'), fondoBlanco: true },
      { id: 'success',        nombre: 'Success',             local: arch('success.json') },
      { id: 'loading-success',nombre: 'Loading → success',   local: arch('Loading success.json') },
    ],
  },

  // ─── COMUNICACIÓN ──────────────────────────────────────────────────────
  comunicacion: {
    titulo: 'Comunicación',
    descripcion: 'Voz, audio, ondas, mensajería.',
    items: [
      { id: 'voice',         nombre: 'Voz',                local: arch('voice icon lottie animation.json') },
      { id: 'audio-wave',    nombre: 'Onda de audio',      local: arch('audio_wave2.json') },
    ],
  },

  // ─── RED ───────────────────────────────────────────────────────────────
  red: {
    titulo: 'Red / Conexión',
    descripcion: 'Antenas, señales, conexiones.',
    items: [
      { id: 'radio-tower',   nombre: 'Radio tower signal', local: arch('Radio Tower Signal.json') },
    ],
  },

  // ─── BIENVENIDA / HERO ─────────────────────────────────────────────────
  bienvenida: {
    titulo: 'Bienvenida / Hero',
    descripcion: 'Ilustraciones grandes para landings, onboarding y heros.',
    items: [
      { id: 'cosmos',           nombre: 'Cosmos',                local: arch('Cosmos.json') },
      { id: 'isometric-uiux',   nombre: 'UI/UX isométrico',      local: arch('Isometric animation for UIUX design landing page..json') },
      { id: 'mobile-dev',       nombre: 'Mobile dev concept',    local: arch('Mobile app development & concept user interface design uiux.json') },
      { id: 'ai-marketing',     nombre: 'AI marketing',          local: arch('Ai-powered marketing tools abstract.json') },
      { id: 'cloud-robotics',   nombre: 'Cloud robotics',        local: arch('Cloud robotics abstract.json') },
    ],
  },

  // ─── DECORACIÓN / DIVERSIÓN ────────────────────────────────────────────
  decoracion: {
    titulo: 'Decoración',
    descripcion: 'Animaciones lúdicas para empty states, easter eggs o secciones de marketing.',
    items: [
      { id: 'cat-playing',  nombre: 'Gato jugando',  local: arch('Cat playing animation.json') },
      { id: 'lovely-cats',  nombre: 'Gatitos',        local: arch('Lovely cats.json') },
      { id: 'coffee-break', nombre: 'Café break',     local: arch('coffee-break.json') },
    ],
  },
};

export const LOTTIE_TODAS = Object.entries(LOTTIE_CATALOGO).flatMap(([cat, sec]) =>
  sec.items.map((it) => ({ ...it, categoria: cat })),
);

// ============================================================================
//  Resolución — siempre usa local (los .json reales del usuario)
// ============================================================================
export const resolverFuenteLottie = async (item) => item.local;
