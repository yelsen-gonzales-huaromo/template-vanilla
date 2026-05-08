import { crearEl } from '../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import {
  FondoVideo, FondoImagen, FondoColor, FondoGradiente, FondoPatron,
} from '../../../components/ui/background/background.js';
import { Boton } from '../../../components/ui/button/button.js';
import { corner3 } from '../../../components/ui/card/card-decoraciones.js';

const heroTexto = (titulo, sub) => crearEl('div', null, [
  crearEl('h2', { style: { margin: 0, fontSize: 'var(--text-3xl)', fontWeight: 700, letterSpacing: '-0.02em' } }, [titulo]),
  sub && crearEl('p', { style: { margin: 'var(--space-2) 0 var(--space-3)', opacity: 0.92, fontSize: 'var(--text-base)' } }, [sub]),
  Boton({ texto: 'Comenzar', variante: 'primary' }),
]);

export default async () => PaginaShowcase({
  titulo: 'Fondo (Background)',
  descripcion: 'Secciones hero con fondo de video, imagen, color, gradiente o patrón. El contenido (título, subtítulo, CTA) flota encima con un overlay opcional para asegurar legibilidad.',
  decoracion: corner3(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    Seccion({
      titulo: 'Fondo de video',
      descripcion: 'Video en autoplay/loop/muted detrás del contenido. Funciona en todos los navegadores modernos sin librerías.',
      hijos: [VistaCodigo({
        vista: FondoVideo({
          src: './public/video/beach.mp4',
          alto: '320px',
          overlay: 0.45,
          hijos: heroTexto('Video Background', 'Auto-play, loop y muted — sin librerías externas.'),
        }),
        codigo: `FondoVideo({
  src: '/public/video/beach.mp4',
  alto: '320px',
  overlay: 0.45,
  hijos: [titulo, subtitulo, Boton({...})],
})`,
      })],
    }),

    Seccion({
      titulo: 'Fondo de imagen',
      descripcion: 'Imagen estática con `background-size: cover`. El overlay oscurece para que el texto sea legible sobre cualquier foto.',
      hijos: [VistaCodigo({
        vista: FondoImagen({
          src: './public/img/illustrations/corner-4.png',
          alto: '280px',
          overlay: 0.55,
          hijos: heroTexto('Image Background', 'Cualquier imagen como fondo, con overlay automático.'),
        }),
        codigo: `FondoImagen({
  src: '/img/hero.jpg',
  alto: '280px',
  overlay: 0.55,
  hijos: [titulo, subtitulo, Boton({...})],
})`,
      })],
    }),

    Seccion({
      titulo: 'Fondo de color y gradiente',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' } }, [
          FondoColor({
            color: 'var(--primary)',
            hijos: heroTexto('Color sólido', 'Cuando todo lo que necesitas es un color de marca.'),
          }),
          FondoGradiente({
            gradiente: 'linear-gradient(135deg, #f43f5e 0%, #8b5cf6 50%, #3b82f6 100%)',
            hijos: heroTexto('Gradiente', 'Tres colores combinados con cubic-bezier.'),
          }),
        ]),
        codigo: `FondoColor({ color: 'var(--primary)', hijos: nodo })

FondoGradiente({
  gradiente: 'linear-gradient(135deg, #f43f5e 0%, #8b5cf6 50%, #3b82f6 100%)',
  hijos: nodo,
})`,
      })],
    }),

    Seccion({
      titulo: 'Patrones',
      descripcion: 'Patrones decorativos sutiles generados con `background-image` (sin imágenes externas).',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-3)' } }, [
          FondoPatron({ tipo: 'puntos',
            hijos: crearEl('div', null, [
              crearEl('h3', { style: { margin: 0, fontSize: 'var(--text-xl)', fontWeight: 700 } }, ['Puntos']),
              crearEl('p', { style: { margin: 0, color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' } }, ['radial-gradient']),
            ]),
          }),
          FondoPatron({ tipo: 'lineas',
            hijos: crearEl('div', null, [
              crearEl('h3', { style: { margin: 0, fontSize: 'var(--text-xl)', fontWeight: 700 } }, ['Líneas']),
              crearEl('p', { style: { margin: 0, color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' } }, ['repeating-linear-gradient']),
            ]),
          }),
          FondoPatron({ tipo: 'cuadricula',
            hijos: crearEl('div', null, [
              crearEl('h3', { style: { margin: 0, fontSize: 'var(--text-xl)', fontWeight: 700 } }, ['Cuadrícula']),
              crearEl('p', { style: { margin: 0, color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' } }, ['linear-gradient × 2']),
            ]),
          }),
        ]),
        codigo: `FondoPatron({ tipo: 'puntos',     hijos: nodo })
FondoPatron({ tipo: 'lineas',     hijos: nodo })
FondoPatron({ tipo: 'cuadricula', hijos: nodo })`,
      })],
    }),
  ],
});
