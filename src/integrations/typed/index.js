/**
 * Adaptador para Typed.js — animación de texto que se "escribe".
 *  https://github.com/mattboldt/typed.js/
 *
 *   const { contenedor } = await TextoAnimado({
 *     frases: ['Bienvenido', 'a Launchpad', 'una plantilla nativa'],
 *     velocidad: 60,
 *   });
 */
import { cargarLib } from '../_loader.js';

const VERSION = '2.1.0';
const URL_JS = `https://cdn.jsdelivr.net/npm/typed.js@${VERSION}/dist/typed.umd.js`;

export const cargarTyped = () => cargarLib({ scripts: URL_JS, global: 'Typed' });

/**
 * @param {object} opts
 * @param {string[]} opts.frases
 * @param {number} [opts.velocidad=50]      ms por carácter al escribir.
 * @param {number} [opts.velocidadBorrar=30] ms por carácter al borrar.
 * @param {number} [opts.pausa=1500]         ms entre frases.
 * @param {boolean}[opts.bucle=true]
 */
export const TextoAnimado = async ({
  frases = [],
  velocidad = 50,
  velocidadBorrar = 30,
  pausa = 1500,
  bucle = true,
} = {}) => {
  const Typed = await cargarTyped();
  const contenedor = document.createElement('span');

  const instancia = new Typed(contenedor, {
    strings: frases,
    typeSpeed: velocidad,
    backSpeed: velocidadBorrar,
    backDelay: pausa,
    loop: bucle,
    showCursor: true,
    cursorChar: '|',
  });

  return { contenedor, instancia };
};
