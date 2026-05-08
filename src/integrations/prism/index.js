/**
 * Adaptador para Prism.js — resaltado de sintaxis de código.
 *  https://prismjs.com/
 *
 *   const bloque = ResaltarCodigo({
 *     codigo: 'const x = 42;',
 *     lenguaje: 'javascript',
 *   });
 *   contenedor.appendChild(bloque);
 *
 *   // O para resaltar todos los <code class="language-X"> ya en el DOM:
 *   await aplicarResaltado();
 */
import { cargarLib } from '../_loader.js';
import { estadoUi } from '../../store/ui.store.js';

const VERSION = '1.29.0';
const URL_CSS_LIGHT = `https://cdn.jsdelivr.net/npm/prismjs@${VERSION}/themes/prism.min.css`;
const URL_CSS_DARK  = `https://cdn.jsdelivr.net/npm/prismjs@${VERSION}/themes/prism-tomorrow.min.css`;
const URL_JS = `https://cdn.jsdelivr.net/npm/prismjs@${VERSION}/prism.min.js`;
const URL_AUTOLOADER = `https://cdn.jsdelivr.net/npm/prismjs@${VERSION}/plugins/autoloader/prism-autoloader.min.js`;

export const cargarPrism = async () => {
  const tema = estadoUi.tema.peek();
  await cargarLib({
    css: tema === 'dark' ? URL_CSS_DARK : URL_CSS_LIGHT,
    scripts: URL_JS,
    global: 'Prism',
  });
  await cargarLib({ scripts: URL_AUTOLOADER }).catch(() => {});
  return window.Prism;
};

/**
 * Construye un bloque `<pre><code>` con el lenguaje indicado.
 */
export const ResaltarCodigo = ({ codigo, lenguaje = 'javascript' } = {}) => {
  const pre = document.createElement('pre');
  pre.className = `language-${lenguaje}`;
  const code = document.createElement('code');
  code.className = `language-${lenguaje}`;
  code.textContent = codigo;
  pre.appendChild(code);
  cargarPrism().then(P => P.highlightElement(code));
  return pre;
};

/** Aplica resaltado a todos los `<code class="language-..">` existentes. */
export const aplicarResaltado = async (raiz = document) => {
  const Prism = await cargarPrism();
  Prism.highlightAllUnder(raiz);
};
