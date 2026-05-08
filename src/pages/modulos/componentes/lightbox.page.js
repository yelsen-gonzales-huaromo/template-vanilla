import { crearEl } from '../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { Modal } from '../../../components/ui/modal/modal.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { corner1 } from '../../../components/ui/card/card-decoraciones.js';

const FOTO = (n) => `./public/img/gallery/${n}.jpg`;

const GALERIA = [
  { src: FOTO(2),    titulo: 'Neón urbano',    sub: 'Café nocturno · Berlín · 35mm' },
  { src: FOTO(3),    titulo: 'Reflejos',       sub: 'Composición con gafas y luces' },
  { src: FOTO(2006), titulo: 'Atardecer',      sub: 'Cabaña al norte · invierno' },
  { src: FOTO(2007), titulo: 'Vintage',        sub: 'Olympus OM-1 de 1973' },
  { src: FOTO(2008), titulo: 'Cámara analógica', sub: 'Revive el grano del fotograma' },
  { src: FOTO(2010), titulo: 'Skyline',        sub: 'Vista panorámica al anochecer' },
];

// ============================================================================
//  Lightbox simple (sin navegación)
// ============================================================================
const abrirLightboxSimple = (src) => {
  let cerrar;
  const close = crearEl('button', {
    type: 'button', class: 'modal-lightbox-close',
    'aria-label': 'Cerrar', onClick: () => cerrar(),
  }, [Icono('cerrar', { tamano: 20 })]);
  const cuerpo = crearEl('div', {
    style: { position: 'relative', width: 'fit-content', maxWidth: '100%', margin: '0 auto' },
  }, [
    close,
    crearEl('img', { src, alt: 'Vista ampliada',
      style: { display: 'block', maxWidth: '100%', maxHeight: '80vh', borderRadius: 'var(--radius-md)' } }),
  ]);
  const r = Modal.abrir({ cuerpo, tamano: 'lg' });
  cerrar = r.cerrar;
  r.elemento.classList.add('modal--limpio');
};

// ============================================================================
//  Lightbox con navegación (prev / next + teclado)
// ============================================================================
const abrirLightboxNav = (items, indiceInicial = 0) => {
  const indice = senal(indiceInicial);

  const imgEl = crearEl('img', {
    style: { display: 'block', maxWidth: '100%', maxHeight: '70vh',
      borderRadius: 'var(--radius-md)', transition: 'opacity 200ms' },
  });
  const captionEl = crearEl('div', {
    style: {
      marginBlockStart: 'var(--space-3)',
      padding: 'var(--space-3) var(--space-4)',
      background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(10px)',
      color: '#fff', borderRadius: 'var(--radius-md)',
      textAlign: 'center', maxWidth: '600px', margin: 'var(--space-3) auto 0',
    },
  });
  const contadorEl = crearEl('span', {
    style: {
      position: 'absolute', insetBlockStart: 'var(--space-3)', insetInlineStart: 'var(--space-3)',
      padding: '4px 10px',
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
      color: '#fff', borderRadius: '999px',
      fontSize: 'var(--text-xs)', fontWeight: 600,
      fontVariantNumeric: 'tabular-nums',
    },
  });

  const renderActual = () => {
    const it = items[indice.value];
    imgEl.src = it.src;
    imgEl.alt = it.titulo;
    captionEl.replaceChildren(
      crearEl('strong', { style: { fontSize: 'var(--text-base)', display: 'block' } }, [it.titulo]),
      crearEl('span', { style: { fontSize: 'var(--text-xs)', opacity: 0.85 } }, [it.sub]),
    );
    contadorEl.textContent = `${indice.value + 1} / ${items.length}`;
  };
  renderActual();

  const ir = (delta) => {
    indice.value = (indice.value + delta + items.length) % items.length;
    renderActual();
  };

  const btnNav = (direccion, lado) => crearEl('button', {
    type: 'button', 'aria-label': direccion === 'prev' ? 'Anterior' : 'Siguiente',
    style: {
      position: 'absolute', insetBlockStart: '50%', transform: 'translateY(-50%)',
      [lado]: 'var(--space-3)',
      width: '48px', height: '48px', borderRadius: '50%',
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
      color: '#fff', border: 0, cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      transition: 'background 180ms',
    },
    onMouseenter: (e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.85)'; },
    onMouseleave: (e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.6)'; },
    onClick: () => ir(direccion === 'prev' ? -1 : 1),
  }, [Icono(direccion === 'prev' ? 'chevron_l' : 'chevron_r', { tamano: 22 })]);

  let cerrar;
  const close = crearEl('button', {
    type: 'button', class: 'modal-lightbox-close',
    'aria-label': 'Cerrar', onClick: () => cerrar(),
  }, [Icono('cerrar', { tamano: 20 })]);

  const cuerpo = crearEl('div', null, [
    crearEl('div', {
      style: { position: 'relative', width: 'fit-content', maxWidth: '100%', margin: '0 auto' },
    }, [
      close, contadorEl, imgEl,
      btnNav('prev', 'insetInlineStart'),
      btnNav('next', 'insetInlineEnd'),
    ]),
    captionEl,
  ]);

  const onKey = (e) => {
    if (e.key === 'ArrowLeft')  ir(-1);
    if (e.key === 'ArrowRight') ir(1);
  };
  document.addEventListener('keydown', onKey);

  const r = Modal.abrir({
    cuerpo, tamano: 'xl',
    alCerrar: () => document.removeEventListener('keydown', onKey),
  });
  cerrar = r.cerrar;
  r.elemento.classList.add('modal--limpio');
};

// ============================================================================
//  Lightbox con thumbnails strip (galería de producto)
// ============================================================================
const abrirLightboxGaleria = (items, indiceInicial = 0) => {
  const indice = senal(indiceInicial);
  const heroImg = crearEl('img', {
    style: { display: 'block', maxWidth: '100%', maxHeight: '60vh',
      borderRadius: 'var(--radius-md)', margin: '0 auto', transition: 'opacity 200ms' },
  });

  const tira = crearEl('div', {
    style: {
      display: 'grid', gridTemplateColumns: `repeat(${items.length}, 1fr)`,
      gap: 'var(--space-2)', marginBlockStart: 'var(--space-3)', maxWidth: '700px', margin: 'var(--space-3) auto 0',
    },
  });
  const thumbs = items.map((it, i) => {
    const t = crearEl('button', {
      type: 'button',
      style: {
        padding: 0, border: '2px solid transparent',
        borderRadius: 'var(--radius)', overflow: 'hidden',
        cursor: 'pointer', background: 'transparent',
        opacity: 0.55, aspectRatio: '4/3',
        transition: 'opacity 200ms, border-color 200ms',
      },
      onClick: () => { indice.value = i; refrescar(); },
    }, [
      crearEl('img', { src: it.src, alt: it.titulo,
        style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' } }),
    ]);
    return t;
  });
  tira.replaceChildren(...thumbs);

  const refrescar = () => {
    const it = items[indice.value];
    heroImg.src = it.src;
    heroImg.alt = it.titulo;
    thumbs.forEach((t, i) => {
      const activo = i === indice.value;
      t.style.opacity = activo ? '1' : '0.55';
      t.style.borderColor = activo ? 'var(--primary)' : 'transparent';
    });
  };
  refrescar();

  let cerrar;
  const close = crearEl('button', {
    type: 'button', class: 'modal-lightbox-close',
    'aria-label': 'Cerrar', onClick: () => cerrar(),
  }, [Icono('cerrar', { tamano: 20 })]);

  const cuerpo = crearEl('div', null, [
    crearEl('div', { style: { position: 'relative' } }, [close, heroImg]),
    tira,
  ]);

  const r = Modal.abrir({ cuerpo, tamano: 'xl' });
  cerrar = r.cerrar;
  r.elemento.classList.add('modal--limpio');
};

// ============================================================================
//  Helpers de presentación
// ============================================================================
const grid = (cols, ...n) => crearEl('div', {
  style: { display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(${cols}, 1fr))`, gap: 'var(--space-2)' },
}, n);

const miniatura = (it, onClick, opts = {}) => crearEl('button', {
  type: 'button',
  style: {
    padding: 0, border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', overflow: 'hidden',
    cursor: 'zoom-in', background: 'transparent',
    aspectRatio: opts.aspectRatio || '4/3',
    transition: 'transform 200ms, box-shadow 200ms',
  },
  onMouseenter: (e) => { e.currentTarget.style.transform = 'scale(1.03)';
    e.currentTarget.style.boxShadow = 'var(--shadow-md)'; },
  onMouseleave: (e) => { e.currentTarget.style.transform = '';
    e.currentTarget.style.boxShadow = ''; },
  onClick,
}, [
  crearEl('img', { src: it.src, alt: it.titulo, loading: 'lazy',
    style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' } }),
]);

// Masonry — alturas variadas
const masonryItem = (it, alturaRem, onClick) => crearEl('button', {
  type: 'button',
  style: {
    padding: 0, border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', overflow: 'hidden',
    cursor: 'zoom-in', background: 'transparent',
    height: `${alturaRem}rem`,
    transition: 'transform 200ms, box-shadow 200ms',
    width: '100%',
  },
  onMouseenter: (e) => { e.currentTarget.style.transform = 'scale(1.02)';
    e.currentTarget.style.boxShadow = 'var(--shadow-md)'; },
  onMouseleave: (e) => { e.currentTarget.style.transform = '';
    e.currentTarget.style.boxShadow = ''; },
  onClick,
}, [
  crearEl('img', { src: it.src, alt: it.titulo, loading: 'lazy',
    style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' } }),
]);

export default async () => PaginaShowcase({
  titulo: 'Lightbox',
  descripcion: 'Visor de imágenes en pantalla completa. Reusa el componente `Modal` con la clase `modal--limpio` (sin chrome). 4 patrones: simple, con navegación prev/next + teclado, masonry de alturas variadas y galería con thumbnails (estilo Amazon/Shopify).',
  decoracion: corner1(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    // ============== SIMPLE ==============
    Seccion({
      titulo: '1 · Simple — click para ampliar',
      descripcion: 'Click en cualquier miniatura abre la imagen ampliada en un modal sin chrome. ESC o click fuera cierran.',
      hijos: [VistaCodigo({
        vista: grid('140px',
          ...GALERIA.map((it) => miniatura(it, () => abrirLightboxSimple(it.src))),
        ),
        codigo: `const abrirLightbox = (src) => {
  const r = Modal.abrir({
    tamano: 'lg',
    cuerpo: crearEl('div', null, [
      closeButton,
      crearEl('img', { src, style: { maxHeight: '80vh' } }),
    ]),
  });
  r.elemento.classList.add('modal--limpio');   // sin chrome
};`,
      })],
    }),

    // ============== CON NAVEGACIÓN ==============
    Seccion({
      titulo: '2 · Con navegación (prev / next + teclado)',
      descripcion: 'Flechas laterales para navegar. Teclas ← / → del teclado también funcionan. Caption con título + descripción debajo de la imagen. Contador "3 / 6" en la esquina.',
      hijos: [VistaCodigo({
        vista: grid('140px',
          ...GALERIA.map((it, i) => miniatura(it, () => abrirLightboxNav(GALERIA, i))),
        ),
        codigo: `const indice = senal(0);

// Flechas + teclas ← / → cambian el índice
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft')  ir(-1);
  if (e.key === 'ArrowRight') ir(1);
});

const ir = (delta) => {
  indice.value = (indice.value + delta + items.length) % items.length;
  renderActual();   // actualiza img.src + caption + contador
};`,
      })],
    }),

    // ============== MASONRY ==============
    Seccion({
      titulo: '3 · Masonry (alturas variadas)',
      descripcion: 'Para portfolios y galerías editoriales — las imágenes mantienen su proporción original distribuidas en columnas. Usamos `column-count` de CSS — sin librerías.',
      hijos: [VistaCodigo({
        vista: crearEl('div', {
          style: { columnCount: 3, columnGap: 'var(--space-2)', breakInside: 'avoid' },
        }, GALERIA.map((it, i) => crearEl('div', {
          style: { breakInside: 'avoid', marginBlockEnd: 'var(--space-2)' },
        }, [masonryItem(it, [10, 14, 11, 15, 12, 13][i] || 12, () => abrirLightboxNav(GALERIA, i))]))),
        codigo: `// Masonry CSS-only con column-count
crearEl('div', { style: {
  columnCount: 3,
  columnGap: 'var(--space-2)',
  breakInside: 'avoid',
} }, items.map(it => crearEl('div', { style: {
  breakInside: 'avoid',                         // <- evita cortar items entre columnas
  marginBlockEnd: 'var(--space-2)',
} }, [imagenConAlturaPropia])))`,
      })],
    }),

    // ============== CON THUMBNAILS STRIP ==============
    Seccion({
      titulo: '4 · Con thumbnails (galería de producto)',
      descripcion: 'Hero grande arriba + tira de thumbnails clickeables abajo. Click en cualquier thumb cambia la imagen principal con highlight (border + opacity). Patrón Amazon, Shopify, portfolios fotográficos.',
      hijos: [VistaCodigo({
        vista: grid('140px',
          ...GALERIA.map((it, i) => miniatura(it, () => abrirLightboxGaleria(GALERIA, i))),
        ),
        codigo: `// Hero img + tira de thumbnails reactiva
const indice = senal(0);
const heroImg = crearEl('img');
const thumbs = items.map((it, i) => crearEl('button', {
  onClick: () => { indice.value = i; refrescar(); },
}, [crearEl('img', { src: it.src })]));

const refrescar = () => {
  heroImg.src = items[indice.value].src;
  thumbs.forEach((t, i) => {
    const activo = i === indice.value;
    t.style.borderColor = activo ? 'var(--primary)' : 'transparent';
    t.style.opacity = activo ? '1' : '0.55';
  });
};`,
      })],
    }),

  ],
});
