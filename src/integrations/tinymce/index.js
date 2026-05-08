/**
 * Adaptador para TinyMCE — editor WYSIWYG profesional.
 *  https://www.tiny.cloud/
 *
 *   const { textarea, instancia } = await EditorRico({
 *     valor: '<p>Hola</p>',
 *     alCambiar: (html) => state.value = html,
 *     altura: 400,
 *   });
 *
 * NOTA: TinyMCE Cloud requiere API key gratuita (https://www.tiny.cloud/auth/signup/).
 * Pásala como `apiKey: 'TU_KEY'`. Sin key funciona pero muestra un aviso.
 */
import { cargarLib } from '../_loader.js';
import { estadoUi } from '../../store/ui.store.js';

const VERSION = '7.4.0';

const urlJs = (apiKey = 'no-api-key') =>
  `https://cdn.tiny.cloud/1/${apiKey}/tinymce/${VERSION}/tinymce.min.js`;

export const cargarTinyMCE = (apiKey) => cargarLib({
  scripts: urlJs(apiKey),
  global: 'tinymce',
});

const PLUGINS_BASE = [
  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
  'preview', 'anchor', 'searchreplace', 'visualblocks', 'code',
  'fullscreen', 'insertdatetime', 'media', 'table', 'wordcount',
];

const TOOLBAR = 'undo redo | blocks | bold italic underline strikethrough | ' +
  'forecolor backcolor | alignleft aligncenter alignright alignjustify | ' +
  'bullist numlist outdent indent | link image media table | code preview';

/**
 * @param {object} opts
 * @param {string}   [opts.valor='']
 * @param {Function} [opts.alCambiar]
 * @param {number}   [opts.altura=400]
 * @param {string}   [opts.apiKey='no-api-key']
 * @param {string[]} [opts.plugins]
 */
export const EditorRico = async ({
  valor = '',
  alCambiar,
  altura = 400,
  apiKey = 'no-api-key',
  plugins = PLUGINS_BASE,
} = {}) => {
  const tinymce = await cargarTinyMCE(apiKey);

  const textarea = document.createElement('textarea');
  textarea.value = valor;

  // Inicializar tras montar.
  const observador = new IntersectionObserver(async (entradas) => {
    if (entradas[0].isIntersecting) {
      observador.disconnect();
      await tinymce.init({
        target: textarea,
        height: altura,
        menubar: false,
        plugins,
        toolbar: TOOLBAR,
        skin: estadoUi.tema.peek() === 'dark' ? 'oxide-dark' : 'oxide',
        content_css: estadoUi.tema.peek() === 'dark' ? 'dark' : 'default',
        language: 'es',
        language_url: `https://cdn.jsdelivr.net/npm/tinymce-i18n@latest/langs/es.js`,
        setup: (editor) => {
          if (alCambiar) editor.on('Change KeyUp', () => alCambiar(editor.getContent()));
        },
      });
    }
  });
  observador.observe(textarea);

  return { textarea };
};
