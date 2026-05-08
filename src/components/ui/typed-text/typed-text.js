/**
 * TextoTipeado — efecto máquina de escribir.
 *
 *   TextoTipeado({ frases: ['Hola', 'Mundo'] })
 *   TextoTipeado({ frases: [...], cursor: 'block', color: 'gradient' })
 *   TextoTipeado({ frases: [...], loop: false, borrar: false, delay: 500 })
 *
 * Props:
 *   frases           — array de strings a tipear
 *   velocidadTipeo   — ms por carácter al tipear (default 60)
 *   velocidadBorrado — ms por carácter al borrar (default 30)
 *   pausa            — ms al final de cada frase (default 1400)
 *   delay            — ms antes de empezar (default 200)
 *   loop             — true (default) | false (para al terminar)
 *   borrar           — true (default) | false (no borra, salta a la siguiente)
 *   cursor           — 'line' (default) | 'block' | 'underscore' | 'none'
 *   color            — 'primary' (default) | 'gradient' | 'success' | 'danger' | 'warning' | 'foreground'
 */
import { crearEl } from '../../../utils/helpers/dom.js';

export const TextoTipeado = ({
  frases = [],
  velocidadTipeo = 60, velocidadBorrado = 30, pausa = 1400, delay = 200,
  loop = true, borrar = true,
  cursor = 'line', color = 'primary',
} = {}) => {
  const span = crearEl('span', { class: ['tipeado__texto', color !== 'primary' && `tipeado__texto--${color}`] });
  const cursorNodo = cursor !== 'none'
    ? crearEl('span', { class: ['tipeado__cursor', `tipeado__cursor--${cursor}`, color !== 'primary' && `tipeado__cursor--c-${color}`], 'aria-hidden': 'true' })
    : null;
  const host = crearEl('span', { class: 'tipeado' }, [span, cursorNodo]);

  let idx = 0, sub = 0, borrando = false, detenido = false;

  const ciclo = () => {
    if (detenido) return;
    const frase = frases[idx] || '';

    if (!borrando) {
      sub++;
      span.textContent = frase.slice(0, sub);
      if (sub === frase.length) {
        // Frase completa
        if (!loop && idx === frases.length - 1) {
          // Última frase y sin loop → detener
          detenido = true;
          host.classList.add('tipeado--terminado');
          return;
        }
        if (!borrar) {
          // Salta a la siguiente sin borrar (como streaming)
          setTimeout(() => {
            sub = 0;
            idx = (idx + 1) % frases.length;
            ciclo();
          }, pausa);
          return;
        }
        borrando = true;
        setTimeout(ciclo, pausa);
        return;
      }
      setTimeout(ciclo, velocidadTipeo);
    } else {
      sub--;
      span.textContent = frase.slice(0, sub);
      if (sub === 0) {
        borrando = false;
        idx = (idx + 1) % frases.length;
      }
      setTimeout(ciclo, velocidadBorrado);
    }
  };
  setTimeout(ciclo, delay);

  // Cleanup: detener timer cuando el host sale del DOM
  const observer = new MutationObserver(() => {
    if (!host.isConnected) {
      detenido = true;
      observer.disconnect();
    }
  });
  requestAnimationFrame(() => {
    if (host.parentNode) observer.observe(host.parentNode, { childList: true, subtree: true });
  });

  return host;
};
