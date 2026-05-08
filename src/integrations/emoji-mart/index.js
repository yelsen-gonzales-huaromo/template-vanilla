/**
 * Adaptador para Emoji Mart — picker de emoji.
 *  https://github.com/missive/emoji-mart
 *
 *   const { contenedor } = await SelectorEmoji({
 *     alSeleccionar: (emoji) => insertarEnTextarea(emoji.native),
 *   });
 */
import { cargarLib, cargarScript } from '../_loader.js';

const VERSION_DATA = '14';
const VERSION = '5.6.0';
const URL_DATA = `https://cdn.jsdelivr.net/npm/@emoji-mart/data@${VERSION_DATA}`;
const URL_JS   = `https://cdn.jsdelivr.net/npm/emoji-mart@${VERSION}/dist/browser.js`;

let datos = null;

export const cargarEmojiMart = async () => {
  await cargarLib({ scripts: URL_JS, global: 'EmojiMart' });
  if (!datos) {
    const resp = await fetch(URL_DATA);
    datos = await resp.json();
  }
  return window.EmojiMart;
};

/**
 * @param {object} opts
 * @param {Function} opts.alSeleccionar  — (emoji) => void  (emoji.native = '😀')
 * @param {string}   [opts.tema='auto']  — 'light' | 'dark' | 'auto'
 * @param {string}   [opts.locale='es']
 */
export const SelectorEmoji = async ({ alSeleccionar, tema = 'auto', locale = 'es' } = {}) => {
  const EmojiMart = await cargarEmojiMart();
  const contenedor = document.createElement('div');

  new EmojiMart.Picker({
    parent: contenedor,
    data: datos,
    theme: tema,
    locale,
    onEmojiSelect: alSeleccionar,
  });

  return { contenedor };
};
