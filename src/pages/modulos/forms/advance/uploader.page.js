/**
 * File uploader profesional — drag & drop nativo con previews por tipo.
 *
 * Soporta: imágenes (preview real), videos (poster del frame 1s + duración),
 * audio (player nativo), PDF/Word/Excel/PPT/CSV (badges de color por tipo),
 * código (badge con extensión), comprimidos, texto, genérico.
 */
import { crearEl } from '../../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../../components/ui/code-preview/code-preview.js';
import { corner5 } from '../../../../components/ui/card/card-decoraciones.js';
import { Campo, Stack, Grid2 } from '../_compartido.js';
import { Uploader } from '../_uploader.js';

export default async () => PaginaShowcase({
  titulo: 'File uploader',
  descripcion: 'Uploader profesional drag & drop vanilla JS — patrón Google Drive / OneDrive / Dropbox. Dos vistas con toggle (Grid de tiles cuadrados o Lista compacta), íconos tipo "papel doblado" con la extensión impresa para documentos, multi-select con checkboxes que aparecen al hover, bulk actions toolbar (eliminar seleccionados / quitar todos), preview real de imágenes con lightbox, poster auto-extraído de videos con duración, player nativo para audio, validación con razón específica de rechazo.',
  decoracion: corner5(),
  migas: [
    { etiqueta: 'Módulos', href: '#/modulos' },
    { etiqueta: 'Formularios', href: '#/modulos/forms' },
  ],
  hijos: [

    // ========== 1 ==========
    Seccion({
      titulo: '1 · Vista Grid — patrón Google Drive (default)',
      descripcion: 'Tiles cuadrados con thumbnail dominante. Para documentos se renderiza un ícono "papel doblado" con la extensión impresa en color (PDF rojo, Word azul, Excel verde, PPT naranja). Al hacer hover sobre un tile aparece el checkbox arriba-izq para multi-select y el botón × arriba-der. Selecciona varios → la toolbar superior cambia a "N seleccionados · Eliminar". Toggle Grid/Lista a la derecha.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { maxWidth: '720px' } }, [
          Campo({
            label: 'Adjuntar archivos',
            hint: 'Cualquier tipo · ideal para tickets de soporte, propuestas, expedientes',
            hijos: Uploader({
              multi: true, maxMb: 25, maxArchivos: 20, maxTotalMb: 200,
              vistaInicial: 'grid',
            }),
          }),
        ]),
        codigo: `import { Uploader } from '../_uploader.js';

Uploader({
  multi: true,
  vistaInicial: 'grid',     // 'grid' (Drive) | 'lista' (Notion)
  maxMb: 25,
  maxArchivos: 20,
  maxTotalMb: 200,
  onChange: (files) => subirAlServidor(files),
})`,
      })],
    }),

    // ========== 2 ==========
    Seccion({
      titulo: '2 · Vista Lista — para documentos / muchos archivos',
      descripcion: 'Variante horizontal compacta tipo Notion / Linear / GitHub Issues. Muestra más metadata (tamaño + tipo) por archivo en menos espacio vertical. Mejor cuando hay 10+ documentos o cuando el preview no es lo importante (PDFs, contratos).',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { maxWidth: '720px' } }, [
          Campo({
            label: 'Documentos del expediente',
            hint: 'PDF · DOC · XLS · PPT · TXT · CSV · MD · máx. 25 MB',
            hijos: Uploader({
              multi: true, maxMb: 25, maxArchivos: 50,
              accept: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.txt,.rtf,.md',
              vistaInicial: 'lista',
            }),
          }),
        ]),
        codigo: `Uploader({
  vistaInicial: 'lista',     // compacta horizontal
  accept: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.txt',
  multi: true,
  maxArchivos: 50,
})`,
      })],
    }),

    // ========== 3 ==========
    Seccion({
      titulo: '3 · Galería de fotos — Grid + lightbox',
      descripcion: 'Vista Grid forzada con `conToggleVista: false`. Click en el ícono 🔍 que aparece al hover → lightbox con la imagen a pantalla completa. Ideal para galerías de productos, evidencia fotográfica, portafolios.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { maxWidth: '720px' } }, [
          Campo({
            label: 'Galería de fotos',
            hint: 'JPG · PNG · WebP · GIF · AVIF · máx. 10 MB · hasta 24 fotos',
            hijos: Uploader({
              multi: true, maxMb: 10, maxArchivos: 24,
              accept: 'image/*',
              vistaInicial: 'grid', conToggleVista: false,
              textoArrastra: 'Arrastra tus fotos',
              textoClick: 'o búscalas en tu equipo',
            }),
          }),
        ]),
        codigo: `Uploader({
  accept: 'image/*',
  vistaInicial: 'grid',
  conToggleVista: false,    // fuerza grid (no permite cambiar a lista)
  maxArchivos: 24,
})`,
      })],
    }),

    // ========== 4 ==========
    Seccion({
      titulo: '4 · Avatar / banner — un solo archivo',
      descripcion: '`multi: false` reemplaza en lugar de acumular. Para avatares, fondos, logos, portadas — donde solo necesitas el último.',
      hijos: [VistaCodigo({
        vista: Grid2(
          Campo({
            label: 'Foto de perfil',
            hint: 'JPG/PNG cuadrada, mín 200×200',
            hijos: Uploader({
              multi: false, maxMb: 5, accept: 'image/jpeg,image/png',
              altura: 'compacto',
              textoArrastra: 'Arrastra tu foto',
            }),
          }),
          Campo({
            label: 'Banner del perfil',
            hint: 'JPG/PNG horizontal, recomendado 1500×500',
            hijos: Uploader({
              multi: false, maxMb: 8, accept: 'image/*',
              altura: 'compacto',
              textoArrastra: 'Arrastra tu banner',
            }),
          }),
        ),
        codigo: `Uploader({
  multi: false,                  // reemplaza en lugar de acumular
  accept: 'image/jpeg,image/png',
  maxMb: 5,
  altura: 'compacto',            // 'compacto' | 'normal' | 'grande'
})`,
      })],
    }),

    // ========== 5 ==========
    Seccion({
      titulo: '5 · Video / audio — preview con poster + player',
      descripcion: 'Para videos extrae el frame del segundo 1 con `<canvas>` y lo usa como poster + muestra la duración en la esquina del tile. Para audio renderiza un player nativo HTML5. Click en el tile de video → reproduce a pantalla completa en el lightbox.',
      hijos: [VistaCodigo({
        vista: Stack(
          Campo({
            label: 'Subir video',
            hint: 'MP4 · WebM · MOV · máx. 100 MB',
            hijos: Uploader({
              multi: false, maxMb: 100, accept: 'video/*',
            }),
          }),
          Campo({
            label: 'Subir audio (podcast / nota de voz)',
            hint: 'MP3 · WAV · OGG · M4A · máx. 50 MB',
            hijos: Uploader({
              multi: true, maxMb: 50, maxArchivos: 5, accept: 'audio/*',
              vistaInicial: 'lista',
            }),
          }),
        ),
        codigo: `Uploader({ accept: 'video/*', multi: false, maxMb: 100 })
// Extrae frame del segundo 1 como poster + muestra duración

Uploader({ accept: 'audio/*', multi: true, vistaInicial: 'lista' })
// Renderiza <audio controls> nativo en cada item`,
      })],
    }),

    // ========== 6 ==========
    Seccion({
      titulo: '6 · Código — para issues / repos / snippets',
      descripcion: 'Filtro a archivos de código. Cada extensión recibe su color (JS amarillo, TS azul, Python azul oscuro, Go cyan, Rust rojo, etc.). Útil para attach a issues, importar configs, subir snippets a docs.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { maxWidth: '640px' } }, [
          Campo({
            label: 'Adjuntar código fuente',
            hint: '.js .ts .jsx .tsx .py .go .rs .java .json .html .css .md',
            hijos: Uploader({
              multi: true, maxMb: 5, maxArchivos: 20,
              accept: '.js,.ts,.jsx,.tsx,.py,.go,.rs,.java,.json,.html,.css,.md,.yml,.yaml,.toml',
            }),
          }),
        ]),
        codigo: `Uploader({
  accept: '.js,.ts,.py,.go,.rs,.java,.json,.html,.css,.md',
  multi: true,
  maxArchivos: 20,
})`,
      })],
    }),

    // ========== 7 ==========
    Seccion({
      titulo: '7 · Compacto — para campos de chat o forms estrechos',
      descripcion: 'Variante mínima sin la lista (`conLista: false`) — solo el área de drop. Útil cuando la UI ya tiene su propio renderer de archivos adjuntos (chat, forum thread).',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { maxWidth: '420px' } }, [
          Campo({
            label: 'Adjuntar a este mensaje',
            hijos: Uploader({
              multi: true, maxMb: 10, altura: 'compacto', conLista: false,
              textoArrastra: 'Arrastra archivos al mensaje',
              textoClick: 'o haz click para buscar',
            }),
          }),
        ]),
        codigo: `Uploader({
  altura: 'compacto',
  conLista: false,        // tu UI maneja el listado
  onChange: (files) => attachToMessage(files),
})`,
      })],
    }),

  ],
});
