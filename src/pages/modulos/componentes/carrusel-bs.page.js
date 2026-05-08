import { crearEl } from '../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { Carrusel, CarruselGaleria } from '../../../components/ui/carousel/carousel.js';
import { corner3 } from '../../../components/ui/card/card-decoraciones.js';

// ----- Slide hero (imagen full + overlay + texto al pie) -----
// Llena toda la altura del carrusel (height:100%) — la altura la fija el `Carrusel({ altura })`.
const slideHero = (urlImagen, titulo, sub) => crearEl('div', {
  style: {
    position: 'relative', width: '100%', height: '100%',
    backgroundImage: `url('${urlImagen}')`,
    backgroundSize: 'cover', backgroundPosition: 'center',
  },
}, [
  crearEl('div', { style: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.7) 100%)',
  } }),
  crearEl('div', { style: {
    position: 'relative', padding: 'clamp(var(--space-3), 4vw, var(--space-6)) clamp(var(--space-3), 4vw, var(--space-5))',
    color: '#fff', height: '100%', boxSizing: 'border-box',
    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    gap: 'var(--space-1)',
  } }, [
    crearEl('strong', { style: { fontSize: 'clamp(var(--text-base), 2.4vw, var(--text-xl))', fontWeight: 700 } }, [titulo]),
    crearEl('p', { style: { margin: 0, opacity: 0.9, fontSize: 'clamp(var(--text-xs), 1.6vw, var(--text-sm))' } }, [sub]),
  ]),
]);

// ----- Slide tipo testimonial / quote (gradiente sólido) -----
const slideTestimonial = (titulo, mensaje, color) => crearEl('div', {
  style: {
    width: '100%', height: '100%',
    padding: 'clamp(var(--space-3), 4vw, var(--space-6))',
    background: color, color: '#fff',
    display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'var(--space-2)',
    textAlign: 'center', boxSizing: 'border-box',
  },
}, [
  crearEl('strong', { style: { fontSize: 'clamp(var(--text-lg), 3vw, var(--text-2xl))', fontWeight: 700 } }, [titulo]),
  crearEl('p', { style: { margin: 0, opacity: 0.9, fontSize: 'clamp(var(--text-sm), 1.8vw, var(--text-base))' } }, [mensaje]),
]);

// ----- Slide tarjeta de producto (imagen + texto al lado) -----
const slideProducto = (titulo, sub, urlImg) => crearEl('div', {
  style: {
    width: '100%', height: '100%',
    padding: 'clamp(var(--space-3), 3vw, var(--space-5))',
    display: 'flex', alignItems: 'center', gap: 'clamp(var(--space-3), 3vw, var(--space-5))',
    background: 'var(--surface)', boxSizing: 'border-box',
  },
}, [
  crearEl('img', { src: urlImg, alt: titulo,
    style: { width: 'clamp(96px, 18vw, 160px)', height: 'clamp(96px, 18vw, 160px)',
             objectFit: 'cover', borderRadius: 'var(--radius-md)', flexShrink: 0 } }),
  crearEl('div', { style: { minWidth: 0 } }, [
    crearEl('strong', { style: { display: 'block', fontSize: 'clamp(var(--text-base), 2.2vw, var(--text-xl))', fontWeight: 700 } }, [titulo]),
    crearEl('p', { style: { margin: 'var(--space-2) 0 0', color: 'var(--muted-foreground)',
                            fontSize: 'clamp(var(--text-xs), 1.6vw, var(--text-sm))' } }, [sub]),
  ]),
]);

export default async () => PaginaShowcase({
  titulo: 'Carrusel',
  descripcion: 'Slider horizontal con autoplay, indicadores (dots) y controles (flechas). Reactivo con `senal` interna — los slides se mueven con `transform: translateX` para suavidad. Sin librerías externas.',
  decoracion: corner3(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    // ============== HERO CON IMAGEN ==============
    Seccion({
      titulo: 'Hero con imagen + overlay',
      descripcion: 'Slides full-width con imagen de fondo, gradient overlay y texto al pie. Para landings y banners. Altura `380px` — equilibrio entre presencia y ahorro de espacio.',
      hijos: [VistaCodigo({
        vista: Carrusel({
          autoPlay: true, intervalo: 5000, altura: 'clamp(220px, 32vw, 380px)',
          slides: [
            slideHero('./public/img/gallery/2.jpg',    'Construye más rápido', 'Sin frameworks ni build steps'),
            slideHero('./public/img/gallery/3.jpg',    'Reactividad nativa',    'Senales y efectos puros'),
            slideHero('./public/img/gallery/2006.jpg', 'Tema dual',             'Claro y oscuro coordinados'),
          ],
        }),
        codigo: `Carrusel({
  autoPlay: true,
  intervalo: 5000,
  altura: 'clamp(220px, 32vw, 380px)',  // responsive
  slides: [
    slideHero(urlImg, titulo, subtitulo),
    slideHero(urlImg, titulo, subtitulo),
    slideHero(urlImg, titulo, subtitulo),
  ],
})`,
      })],
    }),

    // ============== TESTIMONIOS / GRADIENTES ==============
    Seccion({
      titulo: 'Slides de color (testimonios)',
      descripcion: 'Cards de gradiente con texto centrado — ideal para hero rotativos en landings. Altura compacta `280px` porque el contenido es sólo texto.',
      hijos: [VistaCodigo({
        vista: Carrusel({
          autoPlay: true, intervalo: 4500, altura: 'clamp(180px, 24vw, 280px)',
          slides: [
            slideTestimonial('"Limpio y rápido"', '— María L., Frontend',     'linear-gradient(135deg,#3b82f6,#1d4ed8)'),
            slideTestimonial('"Sin librerías"',    '— Carlos R., Tech Lead',   'linear-gradient(135deg,#10b981,#059669)'),
            slideTestimonial('"Tema dual nice"',   '— Ana T., Diseñadora UX',  'linear-gradient(135deg,#8b5cf6,#6d28d9)'),
          ],
        }),
        codigo: `Carrusel({
  autoPlay: true, intervalo: 4500,
  altura: 'clamp(180px, 24vw, 280px)',
  slides: [
    slideTestimonial('"Limpio y rápido"', '— María L.', gradiente1),
    slideTestimonial('"Sin librerías"',    '— Carlos R.', gradiente2),
  ],
})`,
      })],
    }),

    // ============== SIN AUTOPLAY ==============
    Seccion({
      titulo: 'Control manual (sin autoplay)',
      descripcion: '`autoPlay: false` desactiva el avance automático. El usuario navega con flechas o dots. Altura `340px` — mediana, cómoda para lectura sin presión.',
      hijos: [VistaCodigo({
        vista: Carrusel({
          autoPlay: false, altura: 'clamp(200px, 28vw, 340px)',
          slides: [
            slideHero('./public/img/gallery/4.jpg',    'Slide 1', 'Click flechas o dots para avanzar'),
            slideHero('./public/img/gallery/2007.jpg', 'Slide 2', 'Sin auto-play — control total'),
            slideHero('./public/img/gallery/2010.jpg', 'Slide 3', 'Útil para tutoriales paso-a-paso'),
          ],
        }),
        codigo: `Carrusel({ autoPlay: false, altura: 'clamp(200px, 28vw, 340px)', slides: [...] })`,
      })],
    }),

    // ============== SIN DOTS — con imágenes ==============
    Seccion({
      titulo: 'Sólo flechas (sin dots)',
      descripcion: '`indicadores: false` oculta los dots inferiores. Altura `360px` para tutoriales paso-a-paso.',
      hijos: [VistaCodigo({
        vista: Carrusel({
          autoPlay: false, indicadores: false, altura: 'clamp(220px, 30vw, 360px)',
          slides: [
            slideHero('./public/img/gallery/2000.jpg', 'Paso 1 · Crea tu cuenta',          'Sólo necesitas un email válido'),
            slideHero('./public/img/gallery/2001.jpg', 'Paso 2 · Verifica tu email',       'Te enviamos un código de 6 dígitos'),
            slideHero('./public/img/gallery/2008.jpg', 'Paso 3 · Empieza a usar Launchpad','Tu equipo ya puede colaborar contigo'),
          ],
        }),
        codigo: `Carrusel({ autoPlay: false, indicadores: false, altura: 'clamp(220px, 30vw, 360px)', slides: [...] })`,
      })],
    }),

    // ============== SIN FLECHAS — con imágenes ==============
    Seccion({
      titulo: 'Sólo dots (sin flechas)',
      descripcion: '`controles: false` oculta las flechas. Ideal para móvil o cuando se prefiere navegación por gestos. Altura `320px` compacta.',
      hijos: [VistaCodigo({
        vista: Carrusel({
          autoPlay: true, controles: false, altura: 'clamp(200px, 26vw, 320px)',
          slides: [
            slideHero('./public/img/gallery/5.jpg',    'Hot deal',  '50% off este mes'),
            slideHero('./public/img/gallery/2007.jpg', 'Plan Pro',  'Funciones ilimitadas'),
            slideHero('./public/img/gallery/2008.jpg', 'Soporte',   'Respuesta en 1 hora'),
          ],
        }),
        codigo: `Carrusel({ autoPlay: true, controles: false, altura: 'clamp(200px, 26vw, 320px)', slides: [...] })`,
      })],
    }),

    // ============== PRODUCTOS ==============
    Seccion({
      titulo: 'Slides de productos',
      descripcion: 'Cards horizontales con imagen + título + descripción — para featured products, casos de éxito. Altura `300px` ajustada al contenido (imagen 160px + padding).',
      hijos: [VistaCodigo({
        vista: Carrusel({
          autoPlay: true, intervalo: 5000, altura: 'clamp(220px, 26vw, 320px)',
          slides: [
            slideProducto('Camiseta verano',     'Algodón orgánico, fit relajado, 4 colores disponibles.', './public/img/products/1.jpg'),
            slideProducto('Pantalón slim fit',   'Corte moderno con tejido stretch para todo el día.',     './public/img/products/2.jpg'),
            slideProducto('Sneakers running',    'Suela de espuma adaptable y máxima ventilación.',         './public/img/products/3.jpg'),
            slideProducto('Mochila urbana',      'Diseño minimalista con compartimento para laptop 15".',  './public/img/products/4.jpg'),
          ],
        }),
        codigo: `Carrusel({
  altura: 'clamp(220px, 26vw, 320px)',
  slides: [
    slideProducto(titulo, descripcion, urlImg),
    ...
  ],
})`,
      })],
    }),

    // ============== INTERVALO PERSONALIZADO — con imágenes ==============
    Seccion({
      titulo: 'Intervalo personalizado',
      descripcion: '`intervalo` controla los milisegundos entre slides en autoplay (default 4000ms). Altura `520px` — la más alta del set para que las fotos panorámicas respiren.',
      hijos: [VistaCodigo({
        vista: Carrusel({
          autoPlay: true, intervalo: 7000, altura: 'clamp(280px, 42vw, 520px)',
          slides: [
            slideHero('./public/img/gallery/2010.jpg', 'Lento y sereno',   'Cambia cada 7 segundos'),
            slideHero('./public/img/gallery/2006.jpg', 'Tiempo para leer', 'Útil en banners con texto largo'),
            slideHero('./public/img/gallery/3.jpg',    'Menos agresivo',   'Mejor experiencia de lectura'),
          ],
        }),
        codigo: `Carrusel({
  autoPlay: true,
  intervalo: 7000,                              // 7 segundos por slide
  altura: 'clamp(280px, 42vw, 520px)',          // la más alta — para fotos panorámicas
  slides: [...],
})`,
      })],
    }),

    // ============== GALERÍA CON THUMBNAILS ==============
    Seccion({
      titulo: 'Galería con thumbnails',
      descripcion: 'Hero grande arriba + tira de miniaturas clickeables abajo. Click en cualquier thumb la promueve al hero. Estilo galería de producto / portfolio (Amazon, Shopify).',
      hijos: [VistaCodigo({
        vista: CarruselGaleria({
          altura: 'clamp(260px, 38vw, 480px)',
          items: [
            { urlImg: './public/img/gallery/2.jpg',    titulo: 'Neón urbano',       sub: 'Detrás del cristal de un café nocturno' },
            { urlImg: './public/img/gallery/3.jpg',    titulo: 'Reflejos',          sub: 'Luces, gafas y la ciudad de fondo' },
            { urlImg: './public/img/gallery/2008.jpg', titulo: 'Cámara analógica', sub: 'Revive el grano del fotograma' },
            { urlImg: './public/img/gallery/2007.jpg', titulo: 'City lens',         sub: 'Vista a través de un objetivo' },
            { urlImg: './public/img/gallery/2010.jpg', titulo: 'Skyline noche',     sub: 'La ciudad nunca duerme' },
          ],
        }),
        codigo: `CarruselGaleria({
  altura: 'clamp(260px, 38vw, 480px)',
  items: [
    { urlImg, titulo, sub },
    { urlImg, titulo, sub },
    ...
  ],
})`,
      })],
    }),
  ],
});
