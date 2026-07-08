/**
 * Auth presets — mapeo central de "qué visual mostrar" en cada combinación de
 * (variante × página). Devuelve:
 *
 *   {
 *     decoracion,   // nodo HeroDecoracion para la cabecera del formulario
 *     lead,         // sub-texto opcional bajo el título
 *     titulo,       // override de título (se mantiene default si no se da)
 *     panel,        // override del PanelPromo (sólo card/split): { urlImg, titulo, sub }
 *   }
 *
 * La idea: cada variante usa un lenguaje visual distinto.
 *
 *   • simple    → card centrada limpia + Lottie pequeño en cabecera
 *   • card      → card horizontal; el panel lateral usa imagen de la galería
 *   • split     → panel hero full-height con imagen + halo del color de marca
 *   • asistente → wizard con Lottie hero
 *   • modal     → modal con Lottie hero
 *
 * Para tema claro/oscuro: el HeroDecoracion usa fondos que mezclan
 * `var(--primary)` con transparencia, así heredan el accent activo y el modo.
 * Las imágenes del panel usan velo negro semitransparente que funciona en
 * ambos temas.
 */
import {
  HeroDecoracion,
  establecerPresetPanel,
  establecerFondoSimple,
} from './auth-elements.js';
import { LOTTIE_TODAS } from '../common/lottie-catalog/lottie-catalog.js';

/* Resolver: id del catálogo → URL del JSON local. */
const _porId = new Map();
LOTTIE_TODAS.forEach((it) => _porId.set(it.id, it.local));

const lottieSrc = (id) => _porId.get(id) || null;

/* Imagen de fondo del panel — galería pública. Cada página usa una distinta
 * para que la plantilla luzca variada. Si tu proyecto reemplaza las imágenes,
 * ajusta esta tabla.
 */
const IMG = (n) => `./public/img/generic/${n}`;

/* ─────────────────────────────────────────────────────────────────────────
   Tabla por página (sin variar por simple/card/split). Tono y lottie son
   inherentes a la acción; lo que cambia entre variantes es CÓMO se muestran.
   ───────────────────────────────────────────────────────────────────────── */
/* `fondoSimple`: si está definido, la variante simple usa esa imagen como
 * background de toda la página (con velo) — así no todas las pantallas se
 * ven sobre el fondo dark plano. Algunas páginas lo dejan como `null` para
 * variar (cae al gradiente del tema). */
const POR_PAGINA = {
  ingresar: {
    lottieId: 'success',
    tono: 'marca',
    imagen: IMG('bg-1.jpg'),
    fondoSimple: IMG('bg-1.jpg'),
    panelTitulo: 'Bienvenido de nuevo',
    panelSub: 'Tu panel te está esperando — accede con seguridad y continúa donde lo dejaste.',
    leadSimple: 'Inicia sesión con tu correo o un proveedor externo.',
  },
  registrar: {
    lottieId: 'loading-success',
    tono: 'exito',
    imagen: IMG('bg-2.jpg'),
    fondoSimple: IMG('bg-2.jpg'),
    panelTitulo: 'Únete a template-vanilla',
    panelSub: 'Crea tu cuenta y empieza a desplegar interfaces empresariales en minutos.',
    leadSimple: 'Tu equipo en producción en menos de 5 minutos.',
  },
  recuperar: {
    lottieId: 'searching-free',
    tono: 'info',
    imagen: IMG('19.jpg'),
    fondoSimple: null,
    panelTitulo: '¿Olvidaste la contraseña?',
    panelSub: 'No te preocupes — te enviaremos un enlace seguro para recuperarla.',
    leadSimple: 'Te enviaremos un enlace para crear una nueva contraseña.',
  },
  restablecer: {
    lottieId: 'check',
    tono: 'exito',
    imagen: IMG('14.jpg'),
    fondoSimple: null,
    panelTitulo: 'Crea una nueva contraseña',
    panelSub: 'Elige algo difícil de adivinar pero fácil de recordar para ti.',
    leadSimple: 'Define una contraseña nueva y vuelve al panel.',
  },
  confirmar: {
    lottieId: 'voice',
    tono: 'aviso',
    imagen: IMG('11.jpg'),
    fondoSimple: IMG('11.jpg'),
    panelTitulo: 'Revisa tu correo',
    panelSub: 'Te enviamos un enlace de confirmación. Haz clic en él para activar tu cuenta.',
    leadSimple: null,
  },
  salir: {
    lottieId: 'check',
    tono: 'neutro',
    imagen: IMG('3.jpg'),
    fondoSimple: IMG('3.jpg'),
    panelTitulo: 'Hasta pronto',
    panelSub: 'Tu sesión se cerró correctamente. Vuelve cuando quieras.',
    leadSimple: null,
  },
  bloqueo: {
    lottieId: 'audio-wave',
    tono: 'marca',
    imagen: IMG('5.jpg'),
    fondoSimple: null,
    panelTitulo: 'Pantalla bloqueada',
    panelSub: 'Por seguridad cerramos esta sesión. Confirma tu contraseña para continuar.',
    leadSimple: null,
  },
  asistente: {
    lottieId: 'cosmos',
    tono: 'marca',
    imagen: IMG('bg-1.jpg'),
    fondoSimple: null,
    panelTitulo: 'Asistente de registro',
    panelSub: 'Configura tu cuenta paso a paso — datos, organización y confirmación.',
    leadSimple: null,
  },
  modal: {
    lottieId: 'mobile-dev',
    tono: 'info',
    imagen: IMG('bg-2.jpg'),
    fondoSimple: null,
    panelTitulo: 'Auth dentro de un modal',
    panelSub: 'Ideal cuando un visitante pulsa una acción protegida sin abandonar la página.',
    leadSimple: null,
  },
};

/* ─────────────────────────────────────────────────────────────────────────
   Detección de variante (simple/card/split) a partir del path o el nombre.
   ───────────────────────────────────────────────────────────────────────── */
const detectarVariante = (ctx = {}) => {
  const p = ctx.path || '';
  const n = ctx.name || '';
  if (p.includes('/auth/simple/') || n.startsWith('auth-simple')) return 'simple';
  if (p.includes('/auth/card/')   || n.startsWith('auth-card'))   return 'card';
  if (p.includes('/auth/split/')  || n.startsWith('auth-split'))  return 'split';
  if (n === 'asistente-registro' || p.includes('/asistente'))     return 'asistente';
  if (n === 'auth-modal' || p.includes('/auth/modal'))            return 'modal';
  // Rutas planas legacy (/ingresar, /registrar...) → split
  return 'split';
};

/* Detección de página por nombre de ruta. */
const detectarPagina = (ctx = {}) => {
  const n = ctx.name || '';
  if (n.endsWith('-ingresar')   || n === 'ingresar')   return 'ingresar';
  if (n.endsWith('-registrar')  || n === 'registrar')  return 'registrar';
  if (n.endsWith('-recuperar')  || n === 'recuperar')  return 'recuperar';
  if (n.endsWith('-restablecer')|| n === 'restablecer')return 'restablecer';
  if (n.endsWith('-confirmar')  || n === 'confirmar-correo') return 'confirmar';
  if (n.endsWith('-salir')      || n === 'salir')      return 'salir';
  if (n.endsWith('-bloqueo')    || n === 'bloqueo')    return 'bloqueo';
  if (n === 'asistente-registro') return 'asistente';
  if (n === 'auth-modal') return 'modal';
  return 'ingresar';
};

/* ─────────────────────────────────────────────────────────────────────────
   Construcción del preset por (variante, página).

   Política de heros (decisión visual):
   • simple/card/split → SIN hero circular en el form. La página queda limpia
     (estilo NobleUI). El panel lateral (card/split) ya aporta el visual.
   • asistente → hero grande (130px) — añade contexto al wizard.
   • modal     → hero grande sin-fondo (140-200px) — landing del demo.
   ───────────────────────────────────────────────────────────────────────── */
const buildHero = (info, variante) => {
  const conf = {
    simple:    null,                                    // sin hero
    card:      null,                                    // sin hero
    split:     null,                                    // sin hero
    asistente: { alto: 130, forma: 'circulo' },
    modal:     { alto: 140, forma: 'sin-fondo' },
  }[variante];
  if (!conf) return null;

  const src = lottieSrc(info.lottieId);
  if (!src) return null;
  return HeroDecoracion({
    tipo: 'lottie', src,
    alto: conf.alto, forma: conf.forma, tono: info.tono,
  });
};

export const obtenerPreset = (ctx = {}) => {
  const variante = detectarVariante(ctx);
  const pagina = detectarPagina(ctx);
  const info = POR_PAGINA[pagina] || POR_PAGINA.ingresar;

  const decoracion = buildHero(info, variante);
  // Lead bajo el título (sub-texto). En card/split lo escondemos porque el
  // panel ya cuenta la historia y el form se quiere limpio.
  const lead = (variante === 'simple' || variante === 'modal')
    ? info.leadSimple
    : null;

  // Sólo card y split inyectan imagen al panel.
  // En card el panel es FOTO LIMPIA (sin overlay de texto) — estilo NobleUI.
  // En split el panel es hero full con texto encima (más amplio, hay espacio).
  let panel = null;
  if (variante === 'card') {
    panel = { urlImg: info.imagen, mostrarTexto: false };
  } else if (variante === 'split') {
    panel = { urlImg: info.imagen, titulo: info.panelTitulo, sub: info.panelSub };
  }

  // Variante card → forms en modo compacto: primario + 1 social side-by-side.
  const compacto = (variante === 'card');

  // Fondo de imagen (sólo simple). null = sin fondo (fallback al gradiente).
  const fondoSimple = (variante === 'simple') ? (info.fondoSimple || null) : null;

  // Estilo de los sociales. Simple usa 3 círculos icon-only (estilo Metoxi).
  // Otros (split) usan el grid pill (default 'grid').
  const socialesEstilo = (variante === 'simple') ? 'circulos' : 'grid';

  // Estilo Metoxi: la pista "¿No tienes cuenta?" va DEBAJO del botón.
  const pistaAbajo = (variante === 'simple');

  return { variante, pagina, decoracion, lead, panel, info, compacto, fondoSimple, socialesEstilo, pistaAbajo };
};

/**
 * Aplica el preset al estado de módulo (side-effects para el layout):
 *   - inyecta el override del PanelPromo (card/split)
 *   - inyecta el fondoSimple (variante simple)
 * Devuelve el preset para que la página use `decoracion`, `lead`, `compacto`.
 *
 * Esto evita que cada página tenga que importar y llamar manualmente los
 * `establecer*` por separado.
 */
export const aplicarPreset = (ctx = {}) => {
  const preset = obtenerPreset(ctx);
  if (preset.panel) establecerPresetPanel(preset.panel);
  if (preset.fondoSimple) establecerFondoSimple(preset.fondoSimple);
  return preset;
};
