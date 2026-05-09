/**
 * Cropper — recortar imágenes y convertir entre formatos. Usa Cropper.js
 * (lazy CDN) + canvas.toBlob para encodear a WebP/JPEG/PNG/AVIF.
 *
 * El componente acepta JPG, PNG, WebP, AVIF, GIF, BMP, SVG, HEIC (en navegadores
 * que soporten su decodificación) y devuelve un Blob convertido al formato
 * elegido, comprimido con la calidad seleccionada. Ideal para subir a APIs
 * que esperan WebP/JPEG ligero, evitando que el usuario suba un PNG de 5 MB.
 */
import { crearEl } from '../../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../../components/ui/code-preview/code-preview.js';
import { RecortadorImagen } from '../../../../components/ui/cropper/cropper.js';
import { corner3 } from '../../../../components/ui/card/card-decoraciones.js';

export default async () => PaginaShowcase({
  titulo: 'Recortador de imágenes',
  descripcion:
    'Herramienta completa para recortar y convertir imágenes en el navegador. ' +
    'Acepta JPG, PNG, WebP, AVIF, GIF, BMP y SVG. Recorta, rota, voltea, fija ' +
    'la proporción y exporta al formato más ligero (WebP recomendado) con ' +
    'compresión configurable. Devuelve un Blob listo para subir a tu API ' +
    'sin que el usuario tenga que pre-procesar nada — útil para avatares, ' +
    'banners, fotos de producto, documentos, etc.',
  decoracion: corner3(),
  migas: [
    { etiqueta: 'Módulos', href: '#/modulos/formularios' },
    { etiqueta: 'Formularios', href: '#/modulos/formularios' },
  ],
  hijos: [

    Seccion({
      titulo: '1 · Recortador completo (todos los formatos)',
      descripcion:
        'Variante por defecto: ofrece WebP, JPEG y PNG. WebP suele dar el ' +
        'menor tamaño con calidad equivalente — es el default y es el formato ' +
        '"más compatible y liviano" para web (Chrome/Edge/Firefox/Safari ≥14). ' +
        'PNG se usa cuando necesitas transparencia sin pérdida; JPEG cuando ' +
        'tu backend aún no acepta WebP. La barra de herramientas permite ' +
        'rotar 90°, voltear horizontal/vertical y reiniciar el recorte. ' +
        'El bloque inferior muestra dimensiones, formato real, peso del Blob ' +
        'y % de ahorro vs el original.',
      hijos: [VistaCodigo({
        vista: RecortadorImagen({
          formatos: ['webp', 'jpeg', 'png'],
          formatoDefault: 'webp',
          calidad: 0.85,
          anchoSugerido: 800,
          proporcion: 'libre',
        }),
        codigo: `import { RecortadorImagen } from '...';

RecortadorImagen({
  formatos: ['webp', 'jpeg', 'png'],   // formatos de salida
  formatoDefault: 'webp',              // recomendado para web
  calidad: 0.85,                       // 0..1 para JPEG/WebP
  anchoSugerido: 800,                  // px de salida
  proporcion: 'libre',                 // 'libre' | '1:1' | '16:9' | …
  alExportar: ({ blob, formato, ancho, alto, tamano }) => {
    // Sube blob a tu API:
    const fd = new FormData();
    fd.append('foto', blob, \`avatar.\${ext}\`);
    fetch('/api/usuarios/avatar', { method: 'POST', body: fd });
  },
})`,
      })],
    }),

    Seccion({
      titulo: '2 · Avatar cuadrado 1:1 (con AVIF)',
      descripcion:
        'Bloqueando proporción a 1:1 obligas al usuario a recortar un cuadrado ' +
        '— ideal para avatares. AVIF está incluido en `formatos`: si el ' +
        'navegador del usuario lo soporta para encode, sale en la lista; si ' +
        'no, simplemente no aparece. AVIF da hasta 50% menos peso que WebP ' +
        'a calidad similar pero su soporte de encoding en navegador es ' +
        'reciente (Chromium 105+).',
      hijos: [VistaCodigo({
        vista: RecortadorImagen({
          formatos: ['webp', 'avif', 'jpeg', 'png'],
          formatoDefault: 'webp',
          calidad: 0.82,
          anchoSugerido: 400,
          proporcion: '1:1',
        }),
        codigo: `RecortadorImagen({
  formatos: ['webp', 'avif', 'jpeg', 'png'],
  formatoDefault: 'webp',
  proporcion: '1:1',                   // bloquea cuadrado
  anchoSugerido: 400,                  // avatar 400x400
})`,
      })],
    }),

    Seccion({
      titulo: '3 · Banner 16:9 (callback en vez de descarga)',
      descripcion:
        'En vez de dejar al usuario descargar manualmente, capturas el blob ' +
        'con `alExportar` y lo subes directo a tu backend o lo guardas en ' +
        'IndexedDB para uso offline. Aquí simulamos eco con un toast.',
      hijos: [VistaCodigo({
        vista: RecortadorImagen({
          formatos: ['webp', 'jpeg'],
          formatoDefault: 'webp',
          calidad: 0.8,
          anchoSugerido: 1280,
          proporcion: '16:9',
          alExportar: ({ blob, ancho, alto }) => {
            const t = crearEl('div', {
              style: {
                position: 'fixed', insetBlockEnd: '20px', insetInlineEnd: '20px',
                padding: '10px 14px', background: 'var(--surface-elevated)',
                border: '1px solid var(--border-strong)', borderRadius: 'var(--radius)',
                fontSize: 'var(--text-sm)', color: 'var(--foreground)',
                boxShadow: '0 8px 24px rgb(0 0 0 / 0.18)', zIndex: '9999',
              },
            }, [`✓ Blob listo: ${ancho}×${alto}, ${(blob.size / 1024).toFixed(1)} KB`]);
            document.body.appendChild(t);
            setTimeout(() => t.remove(), 3000);
          },
        }),
        codigo: `RecortadorImagen({
  proporcion: '16:9',
  anchoSugerido: 1280,
  alExportar: ({ blob, ancho, alto, tamano }) => {
    // sube a tu API directamente
    const fd = new FormData();
    fd.append('banner', blob, 'banner.webp');
    fetch('/api/banners', { method: 'POST', body: fd });
  },
})`,
      })],
    }),

  ],
});
