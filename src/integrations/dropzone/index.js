/**
 * Adaptador para Dropzone — subida de archivos con drag & drop.
 *  https://www.dropzone.dev/
 *
 *   const { contenedor, instancia } = await ZonaSubida({
 *     url: '/api/uploads',
 *     maxArchivos: 5,
 *     tiposPermitidos: 'image/*,.pdf',
 *     alSubirCompleto: (archivo, respuesta) => console.log(archivo, respuesta),
 *   });
 */
import { cargarLib } from '../_loader.js';

const VERSION = '6.0.0-beta.2';
const URL_CSS = `https://cdn.jsdelivr.net/npm/dropzone@${VERSION}/dist/dropzone.css`;
const URL_JS  = `https://cdn.jsdelivr.net/npm/dropzone@${VERSION}/dist/dropzone-min.js`;

export const cargarDropzone = () => cargarLib({
  css: URL_CSS,
  scripts: URL_JS,
  global: 'Dropzone',
});

/**
 * @param {object} opts
 * @param {string}   opts.url             — endpoint de subida.
 * @param {number}   [opts.maxArchivos=10]
 * @param {number}   [opts.maxMb=10]
 * @param {string}   [opts.tiposPermitidos] — '.pdf,.docx' o 'image/*'
 * @param {Function} [opts.alSubirCompleto] — (archivo, respuesta) => void
 * @param {Function} [opts.alError]
 */
export const ZonaSubida = async ({
  url,
  maxArchivos = 10,
  maxMb = 10,
  tiposPermitidos,
  alSubirCompleto,
  alError,
} = {}) => {
  const Dropzone = await cargarDropzone();
  Dropzone.autoDiscover = false;

  const contenedor = document.createElement('form');
  contenedor.className = 'dropzone';
  contenedor.action = url;
  contenedor.innerHTML = `
    <div class="dz-message" data-dz-message>
      <span style="font-size: 2rem; display: block; margin-bottom: var(--space-2);">📁</span>
      <strong>Arrastra archivos aquí</strong>
      <p class="text-sm text-muted" style="margin-top: var(--space-1);">
        o haz clic para seleccionar
      </p>
    </div>
  `;

  const instancia = new Dropzone(contenedor, {
    url,
    maxFiles: maxArchivos,
    maxFilesize: maxMb,
    acceptedFiles: tiposPermitidos,
    addRemoveLinks: true,
    dictRemoveFile: 'Eliminar',
    dictCancelUpload: 'Cancelar',
    dictFileTooBig: `El archivo supera el tamaño máximo de ${maxMb} MB`,
    dictInvalidFileType: 'Tipo de archivo no permitido',
    dictMaxFilesExceeded: `Máximo ${maxArchivos} archivos`,
    dictDefaultMessage: '',
  });

  if (alSubirCompleto) instancia.on('success', (archivo, resp) => alSubirCompleto(archivo, resp));
  if (alError)         instancia.on('error',   (archivo, msg)  => alError(archivo, msg));

  return { contenedor, instancia };
};
