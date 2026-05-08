import { crearEl } from '../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { Boton } from '../../../components/ui/button/button.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { corner7 } from '../../../components/ui/card/card-decoraciones.js';

const FOTO  = (n) => `./public/img/gallery/${n}.jpg`;
const PROD  = (n) => `./public/img/products/${n}.jpg`;

const grid = (cols, ...n) => crearEl('div', {
  style: { display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(${cols}, 1fr))`, gap: 'var(--space-3)' },
}, n);

// ============================================================================
//  Variante 1 — Overlay clásico (fade in completo)
// ============================================================================
const hoverOverlay = (urlImagen, titulo, sub) => {
  const overlay = crearEl('div', {
    style: {
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 'var(--space-2)',
      background: 'rgba(0,0,0,0.65)',
      opacity: 0, transition: 'opacity 240ms ease',
      color: '#fff', textAlign: 'center', padding: 'var(--space-3)',
    },
  }, [
    crearEl('strong', { style: { fontSize: 'var(--text-base)' } }, [titulo]),
    crearEl('p', { style: { margin: 0, fontSize: 'var(--text-sm)', opacity: 0.85 } }, [sub]),
    Boton({ texto: 'Ver más', variante: 'primary', tamano: 'sm' }),
  ]);
  return crearEl('div', {
    style: {
      position: 'relative', overflow: 'hidden', cursor: 'pointer',
      borderRadius: 'var(--radius-md)', border: '1px solid var(--border)',
      aspectRatio: '4/3',
    },
    onMouseenter: () => { overlay.style.opacity = '1'; },
    onMouseleave: () => { overlay.style.opacity = '0'; },
  }, [
    crearEl('img', { src: urlImagen, alt: titulo,
      style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' } }),
    overlay,
  ]);
};

// ============================================================================
//  Variante 2 — Zoom de imagen (Ken Burns effect)
// ============================================================================
const hoverZoom = (urlImagen, titulo) => {
  const imagen = crearEl('img', {
    src: urlImagen, alt: titulo,
    style: {
      width: '100%', height: '100%', objectFit: 'cover',
      transition: 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1)',
      display: 'block',
    },
  });
  const caption = crearEl('div', {
    style: {
      position: 'absolute', insetBlockEnd: 0, insetInline: 0,
      padding: 'var(--space-3)',
      background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.85))',
      color: '#fff',
    },
  }, [crearEl('strong', { style: { fontSize: 'var(--text-base)' } }, [titulo])]);

  return crearEl('div', {
    style: {
      position: 'relative', overflow: 'hidden', cursor: 'pointer',
      borderRadius: 'var(--radius-md)', aspectRatio: '4/3',
    },
    onMouseenter: () => { imagen.style.transform = 'scale(1.12)'; },
    onMouseleave: () => { imagen.style.transform = ''; },
  }, [imagen, caption]);
};

// ============================================================================
//  Variante 3 — Slide desde abajo (info aparece desde el borde)
// ============================================================================
const hoverSlide = (urlImagen, titulo, sub) => {
  const info = crearEl('div', {
    style: {
      position: 'absolute', insetBlockEnd: 0, insetInline: 0,
      padding: 'var(--space-4) var(--space-3)',
      background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.92))',
      color: '#fff',
      transform: 'translateY(40%)',
      transition: 'transform 360ms cubic-bezier(0.16, 1, 0.3, 1)',
    },
  }, [
    crearEl('strong', { style: { fontSize: 'var(--text-base)', display: 'block' } }, [titulo]),
    crearEl('p', { style: { margin: '4px 0 0', fontSize: 'var(--text-xs)', opacity: 0.9 } }, [sub]),
  ]);
  return crearEl('div', {
    style: {
      position: 'relative', overflow: 'hidden', cursor: 'pointer',
      borderRadius: 'var(--radius-md)', aspectRatio: '4/3',
    },
    onMouseenter: () => { info.style.transform = 'translateY(0)'; },
    onMouseleave: () => { info.style.transform = 'translateY(40%)'; },
  }, [
    crearEl('img', { src: urlImagen, alt: titulo,
      style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' } }),
    info,
  ]);
};

// ============================================================================
//  Variante 4 — Blur + escala (foco en CTA central)
// ============================================================================
const hoverBlur = (urlImagen, etiquetaCTA, iconoCTA) => {
  const imagen = crearEl('img', {
    src: urlImagen, alt: '',
    style: {
      width: '100%', height: '100%', objectFit: 'cover',
      transition: 'filter 320ms ease, transform 600ms cubic-bezier(0.16, 1, 0.3, 1)',
      display: 'block',
    },
  });
  const cta = crearEl('div', {
    style: {
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: 0, transition: 'opacity 240ms ease',
    },
  }, [
    crearEl('div', {
      style: {
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        padding: '10px 20px',
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '999px',
        color: '#000', fontWeight: 600, fontSize: 'var(--text-sm)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      },
    }, [Icono(iconoCTA, { tamano: 16 }), crearEl('span', null, [etiquetaCTA])]),
  ]);
  return crearEl('div', {
    style: {
      position: 'relative', overflow: 'hidden', cursor: 'pointer',
      borderRadius: 'var(--radius-md)', aspectRatio: '4/3',
    },
    onMouseenter: () => {
      imagen.style.filter = 'blur(4px) brightness(0.7)';
      imagen.style.transform = 'scale(1.05)';
      cta.style.opacity = '1';
    },
    onMouseleave: () => {
      imagen.style.filter = '';
      imagen.style.transform = '';
      cta.style.opacity = '0';
    },
  }, [imagen, cta]);
};

// ============================================================================
//  Variante 5 — Play button (video preview)
// ============================================================================
const hoverPlay = (urlImagen, titulo, duracion) => {
  const play = crearEl('div', {
    style: {
      position: 'absolute', insetBlockStart: '50%', insetInlineStart: '50%',
      transform: 'translate(-50%, -50%) scale(0.85)',
      width: '64px', height: '64px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.95)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      color: '#000',
      transition: 'transform 280ms cubic-bezier(0.16, 1, 0.3, 1), background 200ms',
      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    },
  }, [Icono('flecha_r', { tamano: 26 })]);
  const tag = crearEl('span', {
    style: {
      position: 'absolute', insetBlockStart: 'var(--space-2)', insetInlineEnd: 'var(--space-2)',
      padding: '3px 8px',
      background: 'rgba(0,0,0,0.7)', color: '#fff',
      borderRadius: 'var(--radius-sm)',
      fontSize: 'var(--text-xs)', fontWeight: 600,
      fontVariantNumeric: 'tabular-nums',
    },
  }, [duracion]);
  const tit = crearEl('div', {
    style: {
      position: 'absolute', insetBlockEnd: 0, insetInline: 0,
      padding: 'var(--space-3)',
      background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.85))',
      color: '#fff', fontSize: 'var(--text-sm)', fontWeight: 600,
    },
  }, [titulo]);

  return crearEl('div', {
    style: {
      position: 'relative', overflow: 'hidden', cursor: 'pointer',
      borderRadius: 'var(--radius-md)', aspectRatio: '16/9',
    },
    onMouseenter: () => {
      play.style.transform = 'translate(-50%, -50%) scale(1)';
      play.style.background = '#fff';
    },
    onMouseleave: () => {
      play.style.transform = 'translate(-50%, -50%) scale(0.85)';
      play.style.background = 'rgba(255,255,255,0.95)';
    },
  }, [
    crearEl('img', { src: urlImagen, alt: titulo,
      style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' } }),
    tag, play, tit,
  ]);
};

// ============================================================================
//  Variante 6 — Acciones múltiples (toolbar al hover)
// ============================================================================
const hoverAcciones = (urlImagen, titulo) => {
  const toolbar = crearEl('div', {
    style: {
      position: 'absolute', insetBlockStart: 'var(--space-2)', insetInlineEnd: 'var(--space-2)',
      display: 'inline-flex', gap: '4px',
      padding: '4px',
      background: 'rgba(0,0,0,0.7)',
      borderRadius: '999px',
      backdropFilter: 'blur(8px)',
      transform: 'translateY(-8px)',
      opacity: 0,
      transition: 'opacity 220ms, transform 220ms',
    },
  }, [
    ...['estrella', 'descargar', 'subir', 'utilidades'].map((ic) => crearEl('button', {
      type: 'button',
      style: {
        width: '30px', height: '30px',
        background: 'transparent', border: 0,
        borderRadius: '50%',
        color: '#fff', cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 180ms',
      },
      onMouseenter: (e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; },
      onMouseleave: (e) => { e.currentTarget.style.background = ''; },
    }, [Icono(ic, { tamano: 14 })])),
  ]);
  return crearEl('div', {
    style: {
      position: 'relative', overflow: 'hidden', cursor: 'pointer',
      borderRadius: 'var(--radius-md)', aspectRatio: '4/3',
      border: '1px solid var(--border)',
    },
    onMouseenter: () => { toolbar.style.opacity = '1'; toolbar.style.transform = 'translateY(0)'; },
    onMouseleave: () => { toolbar.style.opacity = '0'; toolbar.style.transform = 'translateY(-8px)'; },
  }, [
    crearEl('img', { src: urlImagen, alt: titulo,
      style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' } }),
    toolbar,
  ]);
};

export default async () => PaginaShowcase({
  titulo: 'Hoverbox',
  descripcion: 'Imagen que revela información o acciones al pasar el cursor. 6 variantes de animación: overlay completo, zoom Ken Burns, slide desde abajo, blur con CTA, video play y toolbar de acciones. Sin librerías — sólo CSS transitions controladas con `onMouseenter/leave`.',
  decoracion: corner7(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    Seccion({
      titulo: '1 · Overlay clásico (fade)',
      descripcion: 'El overlay oscuro hace fade-in y revela título + descripción + CTA centrados. El más usado en galerías de portfolio o catálogos de productos.',
      hijos: [VistaCodigo({
        vista: grid('220px',
          hoverOverlay(FOTO(2),    'Plan Pro',     'Funciones avanzadas para equipos'),
          hoverOverlay(FOTO(3),    'Plan Team',    'Hasta 50 usuarios'),
          hoverOverlay(FOTO(2006), 'Enterprise',   'Soporte dedicado 24/7'),
        ),
        codigo: `crearEl('div', {
  style: { position: 'relative', overflow: 'hidden' },
  onMouseenter: () => { overlay.style.opacity = '1'; },
  onMouseleave: () => { overlay.style.opacity = '0'; },
}, [
  crearEl('img', { src }),
  crearEl('div', { style: {
    position: 'absolute', inset: 0,
    background: 'rgba(0,0,0,0.65)',
    opacity: 0, transition: 'opacity 240ms',
  } }, [titulo, sub, boton]),
])`,
      })],
    }),

    Seccion({
      titulo: '2 · Zoom de imagen (Ken Burns)',
      descripcion: 'La imagen escala 1.12× sin que el container crezca (overflow:hidden). El caption con gradient queda fijo. Sensación cinematográfica.',
      hijos: [VistaCodigo({
        vista: grid('220px',
          hoverZoom(FOTO(2),    'Construye más rápido'),
          hoverZoom(FOTO(2007), 'Cámara analógica'),
          hoverZoom(FOTO(2010), 'Skyline al anochecer'),
        ),
        codigo: `// Imagen escala dentro del wrapper con overflow:hidden
crearEl('div', {
  style: { overflow: 'hidden' },
  onMouseenter: () => { img.style.transform = 'scale(1.12)'; },
  onMouseleave: () => { img.style.transform = ''; },
}, [
  crearEl('img', { style: { transition: 'transform 600ms cubic-bezier(...)' } }),
])`,
      })],
    }),

    Seccion({
      titulo: '3 · Slide desde abajo',
      descripcion: 'La info empieza parcialmente oculta (translateY 40%) y se desliza al hover. Ideal cuando el título principal SIEMPRE debe ser visible y los detalles aparecen on-demand.',
      hijos: [VistaCodigo({
        vista: grid('220px',
          hoverSlide(FOTO(2),    'Café nocturno',   'Tomada en Berlín · 35mm'),
          hoverSlide(FOTO(2008), 'Vintage gear',     'Olympus OM-1 de 1973'),
          hoverSlide(FOTO(3),    'Luces y reflejos', 'Composición urbana'),
        ),
        codigo: `// Info siempre visible parcialmente, sube al hover
const info = crearEl('div', { style: {
  position: 'absolute', insetBlockEnd: 0,
  transform: 'translateY(40%)',                // ← oculta 40% por defecto
  transition: 'transform 360ms ease',
}}, [titulo, sub]);

onMouseenter: () => { info.style.transform = 'translateY(0)'; }`,
      })],
    }),

    Seccion({
      titulo: '4 · Blur + CTA flotante',
      descripcion: 'La imagen se desenfoca y oscurece ligeramente — el ojo va a la pill flotante con el CTA. Genial para "Ver detalles", "Comprar", "Leer más" cuando hay muchas imágenes en grid.',
      hijos: [VistaCodigo({
        vista: grid('220px',
          hoverBlur(PROD(1), 'Ver producto', 'flecha_r'),
          hoverBlur(PROD(2), 'Añadir al carrito', 'mas'),
          hoverBlur(PROD(3), 'Leer más', 'ojo'),
        ),
        codigo: `onMouseenter: () => {
  img.style.filter = 'blur(4px) brightness(0.7)';
  img.style.transform = 'scale(1.05)';
  cta.style.opacity = '1';                  // pill aparece centrada
}

// CTA: pill blanca con icono + label, box-shadow elevado
crearEl('div', { style: {
  background: 'rgba(255,255,255,0.95)',
  borderRadius: '999px',
  padding: '10px 20px',
} }, [Icono('flecha_r'), 'Ver producto'])`,
      })],
    }),

    Seccion({
      titulo: '5 · Video play (preview)',
      descripcion: 'Botón circular de play centrado + tag con duración en la esquina + título con gradient abajo. Al hover, el play crece (`scale(0.85)` → `scale(1)`). Patrón YouTube / Vimeo.',
      hijos: [VistaCodigo({
        vista: grid('300px',
          hoverPlay(FOTO(2010), 'Tour por Islandia en 4K', '12:34'),
          hoverPlay(FOTO(2006), 'Tutorial: configurar Launchpad', '8:20'),
          hoverPlay(FOTO(3),    'Detrás de cámaras del shoot urbano', '5:47'),
        ),
        codigo: `// Botón play: empieza scale(0.85), crece al hover
const play = crearEl('div', { style: {
  width: '64px', height: '64px',
  borderRadius: '50%',
  background: 'rgba(255,255,255,0.95)',
  transform: 'translate(-50%, -50%) scale(0.85)',
  transition: 'transform 280ms cubic-bezier(...)',
} }, [Icono('flecha_r')]);

onMouseenter: () => {
  play.style.transform = 'translate(-50%, -50%) scale(1)';
}`,
      })],
    }),

    Seccion({
      titulo: '6 · Toolbar de acciones',
      descripcion: 'Una pill con varios iconos aparece desde arriba al hover — favorito, descargar, compartir, más opciones. Patrón de gestores de archivos (Drive, Dropbox).',
      hijos: [VistaCodigo({
        vista: grid('220px',
          hoverAcciones(FOTO(2),    'Café nocturno'),
          hoverAcciones(FOTO(2007), 'Cámara vintage'),
          hoverAcciones(FOTO(3),    'Reflejos'),
          hoverAcciones(FOTO(2010), 'Skyline'),
        ),
        codigo: `// Toolbar pill con varios iconos
const toolbar = crearEl('div', { style: {
  position: 'absolute', insetBlockStart: 'var(--space-2)', insetInlineEnd: 'var(--space-2)',
  background: 'rgba(0,0,0,0.7)',
  borderRadius: '999px',
  backdropFilter: 'blur(8px)',                  // glassmorphism
  transform: 'translateY(-8px)',
  opacity: 0,
} }, ['estrella', 'descargar', 'subir', 'utilidades'].map(...));

onMouseenter: () => {
  toolbar.style.opacity = '1';
  toolbar.style.transform = 'translateY(0)';
}`,
      })],
    }),

  ],
});
