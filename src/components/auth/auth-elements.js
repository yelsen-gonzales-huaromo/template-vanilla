/**
 * Auth elements — bloques de UI compartidos por las 3 variantes (simple/card/split)
 * y la versión modal. Modernización del kit de Falcon: SVG inline, gradientes
 * sutiles, foco accesible, dark-mode out-of-the-box vía tokens.
 *
 *   MarcaAuth({ tamano })          — logo + nombre de la app
 *   BotonesSociales()              — Google / Apple / Microsoft (hookup pendiente)
 *   DivisorO({ texto })            — línea horizontal con texto al medio
 *   PanelPromo({ titulo, items })  — panel de promesa de valor para split/card
 *   FuerzaContrasena(seqInput)     — barra de strength reactiva
 */
import { crearEl } from '../../utils/helpers/dom.js';
import { CONFIG_APP } from '../../config/app.config.js';
import { t } from '../../i18n/index.js';
import { Carrusel } from '../ui/carousel/carousel.js';

/** Marca: cuadrado con gradiente + nombre. Mismo lenguaje visual del .boot. */
export const MarcaAuth = ({ tamano = 'md', soloIcono = false } = {}) => {
  const tamanos = { sm: 28, md: 36, lg: 44 };
  const px = tamanos[tamano] || 36;
  return crearEl('a', { href: '#/', class: ['auth-marca', `auth-marca--${tamano}`], 'aria-label': CONFIG_APP.nombre }, [
    crearEl('span', {
      class: 'auth-marca__cuadro',
      style: { width: `${px}px`, height: `${px}px` },
      'aria-hidden': 'true',
    }),
    !soloIcono && crearEl('span', { class: 'auth-marca__nombre' }, [CONFIG_APP.nombre]),
  ]);
};

/* SVGs inline — más nítidos que iconos por web font y sin descargar nada. */
const SVG_GOOGLE = `
  <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" width="18" height="18" aria-hidden="true">
    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.255h2.908c1.702-1.567 2.684-3.875 2.684-6.612z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.255c-.806.54-1.836.86-3.048.86-2.345 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
    <path fill="#FBBC05" d="M3.964 10.713a5.41 5.41 0 0 1 0-3.426V4.957H.957a9.005 9.005 0 0 0 0 8.086l3.007-2.33z"/>
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.346l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.957L3.964 7.29C4.672 5.163 6.655 3.58 9 3.58z"/>
  </svg>`;

const SVG_APPLE = `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="18" height="18" aria-hidden="true" fill="currentColor">
    <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12-1.03.42-2.18 1.073-2.93.74-.84 2.05-1.59 3.09-1.72zM20.5 17.27c-.55 1.27-.81 1.84-1.51 2.97-.99 1.55-2.39 3.48-4.13 3.49-1.55.01-1.95-1.01-4.06-1-2.11.01-2.55 1.02-4.1 1.01-1.74-.02-3.07-1.76-4.06-3.31-2.78-4.34-3.07-9.43-1.36-12.13.85-1.34 2.2-2.13 3.46-2.13 1.29 0 2.1.71 3.16.71 1.04 0 1.66-.71 3.15-.71 1.13 0 2.32.62 3.17 1.69-2.79 1.53-2.34 5.52.49 6.41z"/>
  </svg>`;

const SVG_MICROSOFT = `
  <svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" width="18" height="18" aria-hidden="true">
    <rect x="1"  y="1"  width="9"  height="9"  fill="#F25022"/>
    <rect x="11" y="1"  width="9"  height="9"  fill="#7FBA00"/>
    <rect x="1"  y="11" width="9"  height="9"  fill="#00A4EF"/>
    <rect x="11" y="11" width="9"  height="9"  fill="#FFB900"/>
  </svg>`;

const botonSocial = (nombre, svg, etiqueta) => {
  const btn = crearEl('button', {
    type: 'button',
    class: ['auth-social', `auth-social--${nombre}`],
    'data-proveedor': nombre,
  });
  btn.innerHTML = `${svg}<span>${etiqueta}</span>`;
  return btn;
};

/** Botones sociales modernos — Google, Apple, Microsoft. */
export const BotonesSociales = () => crearEl('div', { class: 'auth-social-grid' }, [
  botonSocial('google',    SVG_GOOGLE,    t('auth.social_google')),
  botonSocial('apple',     SVG_APPLE,     t('auth.social_apple')),
  botonSocial('microsoft', SVG_MICROSOFT, t('auth.social_microsoft')),
]);

/** Divisor "o continúa con". */
export const DivisorO = ({ texto } = {}) => crearEl('div', { class: 'auth-divisor', role: 'separator' }, [
  crearEl('span', { class: 'auth-divisor__texto' }, [texto || t('auth.or_continue_with')]),
]);

/* ─────────────────────────────────────────────────────────────────────────
   PanelPromo — panel decorativo de los layouts auth-card / auth-split.
   Soporta 3 modos: gradiente (default), imagen única, carrusel auto-play.
   La elección se basa en CONFIG_APP.auth.panel* (ver app.config.js).
   ───────────────────────────────────────────────────────────────────────── */

const cfgAuth = () => CONFIG_APP.auth || {};

/** Resuelve el modo a usar. Si panelModo === 'auto', decide según config. */
const resolverModoPanel = () => {
  const a = cfgAuth();
  if (a.panelModo && a.panelModo !== 'auto') return a.panelModo;
  if (Array.isArray(a.panelSlides) && a.panelSlides.length > 1) return 'carrusel';
  if (a.panelImagen) return 'imagen';
  if (Array.isArray(a.panelSlides) && a.panelSlides.length === 1) return 'imagen';
  return 'gradiente';
};

/** Imagen + overlay + (opcional) texto encima. */
const PanelPromoImagen = ({ urlImg, titulo, sub, mostrarTexto = true, compacto = false }) =>
  crearEl('aside', {
    class: ['auth-promo', 'auth-promo--imagen', compacto && 'auth-promo--compacto'],
    style: { backgroundImage: `url('${urlImg}')` },
    'aria-hidden': 'true',
  }, [
    crearEl('div', { class: 'auth-promo__velo' }),
    mostrarTexto && crearEl('div', { class: 'auth-promo__contenido' }, [
      crearEl('div', { class: 'auth-promo__marca' }, [
        crearEl('span', { class: 'auth-promo__marca-cuadro', 'aria-hidden': 'true' }),
        crearEl('span', { class: 'auth-promo__marca-nombre' }, [CONFIG_APP.nombre]),
      ]),
      crearEl('div', { class: 'auth-promo__cuerpo' }, [
        crearEl('h2', { class: 'auth-promo__titulo' }, [titulo || t('app.tagline')]),
        sub && crearEl('p', { class: 'auth-promo__lead' }, [sub]),
      ]),
      crearEl('div', { class: 'auth-promo__pie' }, [
        crearEl('div', { class: 'auth-promo__seguridad' }, [
          crearEl('span', { html: '🔒', 'aria-hidden': 'true' }),
          t('auth.secure_pitch'),
        ]),
        crearEl('div', { class: 'auth-promo__version' }, [`v${CONFIG_APP.version}`]),
      ]),
    ]),
  ]);

/** Carrusel auto-play como panel promocional. */
const PanelPromoCarrusel = ({ slides, compacto = false }) => {
  const ds = slides.map(s => crearEl('div', {
    class: 'auth-promo-slide',
    style: { backgroundImage: `url('${s.urlImg}')` },
  }, [
    crearEl('div', { class: 'auth-promo-slide__velo' }),
    (s.titulo || s.sub) && crearEl('div', { class: 'auth-promo-slide__textos' }, [
      s.titulo && crearEl('h3', { class: 'auth-promo-slide__titulo' }, [s.titulo]),
      s.sub && crearEl('p', { class: 'auth-promo-slide__sub' }, [s.sub]),
    ]),
  ]));

  const carrusel = Carrusel({
    slides: ds, autoPlay: true, intervalo: 5500,
    indicadores: true, controles: false, pausarEnHover: true,
  });

  return crearEl('aside', {
    class: ['auth-promo', 'auth-promo--carrusel', compacto && 'auth-promo--compacto'],
    'aria-hidden': 'true',
  }, [carrusel]);
};

/** Panel enterprise — fondo oscuro con burbujas animadas, headline grande,
 *  stats en el pie. Estilo "CPU Connect / Notion / Linear". CSS-only. */
const PanelPromoGradiente = ({ compacto = false }) => {
  const a = cfgAuth();

  // Stats (configurable). Defaults representan el pitch de Launchpad.
  const stats = Array.isArray(a.panelStats) && a.panelStats.length > 0
    ? a.panelStats
    : [
        { numero: '119+', etiqueta: 'PÁGINAS' },
        { numero: '41',   etiqueta: 'COMPONENTES' },
        { numero: '0',    etiqueta: 'BUILD STEP' },
      ];

  // Headline configurable (con defaults).
  const titulo = a.panelTitulo || t('app.tagline');
  const lead   = a.panelLead   || t('auth.trust_pitch');

  // 6 burbujas con clases distintas — cada una tiene su propio delay/duración
  // en el CSS. Diferentes tamaños y posiciones se distribuyen orgánicamente.
  const burbujas = crearEl('div', { class: 'auth-promo__burbujas', 'aria-hidden': 'true' },
    Array.from({ length: 6 }, (_, i) => crearEl('span', { class: `auth-promo__burbuja auth-promo__burbuja--${i + 1}` })),
  );

  return crearEl('aside', {
    class: ['auth-promo', 'auth-promo--enterprise', compacto && 'auth-promo--compacto'],
    style: a.panelGradiente ? { background: a.panelGradiente } : null,
    'aria-hidden': 'true',
  }, [
    crearEl('div', { class: 'auth-promo__patron' }),
    burbujas,

    crearEl('div', { class: 'auth-promo__contenido' }, [
      crearEl('div', { class: 'auth-promo__marca' }, [
        crearEl('span', { class: 'auth-promo__marca-cuadro', 'aria-hidden': 'true' }),
        crearEl('span', { class: 'auth-promo__marca-nombre' }, [CONFIG_APP.nombre]),
      ]),

      crearEl('div', { class: 'auth-promo__cuerpo' }, [
        crearEl('h2', { class: 'auth-promo__titulo' }, [titulo]),
        !compacto && crearEl('p', { class: 'auth-promo__lead' }, [lead]),
      ]),

      // Stats: 3 columnas separadas por línea vertical
      !compacto && crearEl('div', { class: 'auth-promo__stats' },
        stats.slice(0, 4).map(s => crearEl('div', { class: 'auth-promo__stat' }, [
          crearEl('span', { class: 'auth-promo__stat-numero' }, [s.numero]),
          crearEl('span', { class: 'auth-promo__stat-etiqueta' }, [s.etiqueta]),
        ])),
      ),

      compacto && crearEl('div', { class: 'auth-promo__pie' }, [
        crearEl('div', { class: 'auth-promo__seguridad' }, [
          crearEl('span', { html: '🔒', 'aria-hidden': 'true' }),
          t('auth.secure_pitch'),
        ]),
        crearEl('div', { class: 'auth-promo__version' }, [`v${CONFIG_APP.version}`]),
      ]),
    ]),
  ]);
};

/** Panel promocional — selector según config. */
export const PanelPromo = ({ compacto = false } = {}) => {
  const modo = resolverModoPanel();
  const a = cfgAuth();

  if (modo === 'imagen') {
    const slide = (Array.isArray(a.panelSlides) && a.panelSlides[0]) || {};
    const urlImg = a.panelImagen || slide.urlImg;
    if (urlImg) {
      return PanelPromoImagen({
        urlImg,
        titulo: slide.titulo,
        sub: slide.sub,
        mostrarTexto: a.panelTextoSobreImagen !== false,
        compacto,
      });
    }
  }

  if (modo === 'carrusel' && Array.isArray(a.panelSlides) && a.panelSlides.length > 0) {
    return PanelPromoCarrusel({ slides: a.panelSlides, compacto });
  }

  return PanelPromoGradiente({ compacto });
};

/** Barra reactiva de fuerza de contraseña.
 *  Devuelve un nodo y una función para actualizarlo desde un input. */
export const FuerzaContrasena = () => {
  const barra = crearEl('div', { class: 'auth-fuerza' }, [
    crearEl('div', { class: 'auth-fuerza__pista' }, [
      crearEl('span', { class: 'auth-fuerza__bloque' }),
      crearEl('span', { class: 'auth-fuerza__bloque' }),
      crearEl('span', { class: 'auth-fuerza__bloque' }),
      crearEl('span', { class: 'auth-fuerza__bloque' }),
    ]),
    crearEl('span', { class: 'auth-fuerza__etiqueta', 'aria-live': 'polite' }, ['']),
  ]);

  const evaluar = (valor = '') => {
    let p = 0;
    if (valor.length >= 6)  p++;
    if (valor.length >= 10) p++;
    if (/[A-Z]/.test(valor) && /[a-z]/.test(valor)) p++;
    if (/\d/.test(valor) && /[^A-Za-z0-9]/.test(valor)) p++;

    barra.dataset.fuerza = p;
    const etiquetas = ['', 'Débil', 'Aceptable', 'Buena', 'Excelente'];
    barra.querySelector('.auth-fuerza__etiqueta').textContent = valor ? etiquetas[p] : '';
  };

  return { nodo: barra, evaluar };
};
