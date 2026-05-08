/**
 * Carrusel — slider horizontal con auto-play, indicadores y controles.
 * Usa transform: translateX para suavidad. Reactivo con `senal`.
 *
 *   Carrusel({
 *     slides: [nodo1, nodo2, nodo3],
 *     autoPlay: true, intervalo: 4000, indicadores: true, controles: true,
 *     pausarEnHover: true,           // pausa al pasar el cursor (default true)
 *   })
 *
 * Lifecycle:
 *   • setInterval se limpia automáticamente cuando el carrusel sale del DOM
 *     (MutationObserver) — sin leaks aunque tengas 10 carruseles en una página.
 *   • Auto-pause cuando el carrusel sale del viewport (IntersectionObserver) —
 *     no consume CPU si no se está viendo.
 *   • Auto-pause en hover para que el usuario pueda leer el slide actual.
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';
import { Icono } from '../icon/icons.js';

export const Carrusel = ({
  slides = [], autoPlay = false, intervalo = 4000,
  indicadores = true, controles = true,
  pausarEnHover = true,
  altura,                          // ej. '320px' | '480px' | '60vh' — opcional
  indiceCompartido,                // senal externa opcional (para sync con thumbs)
} = {}) => {
  const indice = indiceCompartido || senal(0);
  const total = slides.length;

  const pista = crearEl('div', { class: 'carrusel__pista' },
    slides.map((s) => crearEl('div', { class: 'carrusel__slide' }, [s])),
  );

  efecto(() => {
    pista.style.transform = `translateX(-${indice.value * 100}%)`;
  });

  const ir = (n) => { indice.value = ((n % total) + total) % total; };

  // Controles
  const btnPrev = controles && crearEl('button', {
    type: 'button', class: 'carrusel__btn carrusel__btn--prev',
    'aria-label': 'Anterior', onClick: () => ir(indice.value - 1),
  }, [Icono('chevron_l', { tamano: 18 })]);
  const btnNext = controles && crearEl('button', {
    type: 'button', class: 'carrusel__btn carrusel__btn--next',
    'aria-label': 'Siguiente', onClick: () => ir(indice.value + 1),
  }, [Icono('chevron_r', { tamano: 18 })]);

  // Indicadores
  let dots = null;
  if (indicadores) {
    const puntos = slides.map((_, i) => crearEl('button', {
      type: 'button', class: 'carrusel__dot', 'aria-label': `Ir al slide ${i + 1}`,
      onClick: () => ir(i),
    }));
    dots = crearEl('div', { class: 'carrusel__dots' }, puntos);
    efecto(() => {
      puntos.forEach((p, i) => p.classList.toggle('carrusel__dot--activo', i === indice.value));
    });
  }

  // height (no min-height) — los hijos con height:100% sólo resuelven contra una altura
  // "definida"; min-height no cuenta como tal y el contenido colapsa.
  const host = crearEl('div', {
    class: 'carrusel',
    style: altura ? { height: altura } : null,
  }, [
    crearEl('div', { class: 'carrusel__viewport', style: altura ? { height: altura } : null },
      [pista]),
    btnPrev, btnNext, dots,
  ]);

  // ---- Auto-play con cleanup automático -------------------------------------
  if (autoPlay && total > 1) {
    let timer = null;
    let visible = true;
    let hovered = false;

    const tick = () => {
      // Sólo avanza si NO estamos pausados (visible + sin hover)
      if (visible && !hovered) ir(indice.value + 1);
    };
    const arrancar = () => { if (!timer) timer = setInterval(tick, intervalo); };
    const parar    = () => { if (timer) { clearInterval(timer); timer = null; } };

    arrancar();

    // Pausa al hover (legibilidad)
    if (pausarEnHover) {
      host.addEventListener('mouseenter', () => { hovered = true; });
      host.addEventListener('mouseleave', () => { hovered = false; });
    }

    // Pausa cuando el carrusel sale del viewport (perf)
    const ioViewport = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? true;
    }, { threshold: 0.1 });
    ioViewport.observe(host);

    // Cleanup cuando el carrusel se elimina del DOM
    const cleanupCuandoSalga = new MutationObserver(() => {
      if (!host.isConnected) {
        parar();
        ioViewport.disconnect();
        cleanupCuandoSalga.disconnect();
      }
    });
    // Observa el padre (cuando el padre cambia hijos, revisa si seguimos)
    requestAnimationFrame(() => {
      if (host.parentNode) {
        cleanupCuandoSalga.observe(host.parentNode, { childList: true });
      }
    });
  }

  return host;
};

/* ===========================================================================
   CarruselGaleria — hero grande + tira de thumbnails clickeables debajo
   Estilo galería de producto (Amazon, Shopify, portfolios).
   =========================================================================== */
export const CarruselGaleria = ({
  items = [],                  // [{ urlImg, titulo?, sub? }]
  altura = '480px',
  autoPlay = false,
  intervalo = 5000,
} = {}) => {
  const indice = senal(0);

  // Slides hero — imagen full + overlay + texto al pie. height: 100% llena el carrusel.
  const slides = items.map((it) => crearEl('div', {
    style: {
      position: 'relative', width: '100%', height: '100%',
      backgroundImage: `url('${it.urlImg}')`,
      backgroundSize: 'cover', backgroundPosition: 'center',
    },
  }, [
    (it.titulo || it.sub) && crearEl('div', { style: {
      position: 'absolute', inset: 0,
      background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.75) 100%)',
    } }),
    (it.titulo || it.sub) && crearEl('div', { style: {
      position: 'absolute', insetInline: 0, insetBlockEnd: 0,
      padding: 'clamp(var(--space-3), 4vw, var(--space-6)) clamp(var(--space-3), 4vw, var(--space-5))',
      color: '#fff',
    } }, [
      it.titulo && crearEl('strong', { style: { fontSize: 'clamp(var(--text-lg), 2.6vw, var(--text-2xl))', fontWeight: 700, display: 'block' } }, [it.titulo]),
      it.sub && crearEl('p', { style: { margin: '6px 0 0', opacity: 0.9, fontSize: 'clamp(var(--text-sm), 1.8vw, var(--text-base))' } }, [it.sub]),
    ]),
  ]));

  // Carrusel principal — sin dots (los reemplazan los thumbs)
  const carruselHero = Carrusel({
    slides, altura, autoPlay, intervalo,
    indicadores: false, controles: true,
    indiceCompartido: indice,
  });

  // Tira de thumbnails clickeables
  const thumbs = items.map((it, i) => {
    const t = crearEl('button', {
      type: 'button',
      class: ['carrusel-galeria__thumb'],
      'data-activo': String(i === indice.value),
      onClick: () => { indice.value = i; },
    }, [
      crearEl('img', { src: it.urlImg, alt: it.titulo || `Slide ${i + 1}`,
        style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' } }),
    ]);
    return t;
  });
  const tira = crearEl('div', { class: 'carrusel-galeria__thumbs' }, thumbs);

  // Sincroniza el highlight del thumb activo
  efecto(() => {
    thumbs.forEach((t, i) => { t.dataset.activo = String(i === indice.value); });
  });

  return crearEl('div', { class: 'carrusel-galeria' }, [carruselHero, tira]);
};
