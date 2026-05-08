/**
 * Contador animado — anima de `desde` a `hasta` durante `duracion` ms cuando
 * el elemento entra al viewport (vía IntersectionObserver).
 *
 *   Contador({ hasta: 12480, formato: (n) => formatearNumero(n) })
 */
import { crearEl } from '../../../utils/helpers/dom.js';

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

export const Contador = ({
  desde = 0, hasta = 100, duracion = 1400, formato = (n) => Math.round(n).toLocaleString(),
  prefijo = '', sufijo = '',
} = {}) => {
  const span = crearEl('span', { class: 'contador' }, [`${prefijo}${formato(desde)}${sufijo}`]);

  let arrancado = false;
  const arrancar = () => {
    if (arrancado) return;
    arrancado = true;
    const inicio = performance.now();
    const tick = (ahora) => {
      const t = Math.min(1, (ahora - inicio) / duracion);
      const valor = desde + (hasta - desde) * easeOutCubic(t);
      span.textContent = `${prefijo}${formato(valor)}${sufijo}`;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting) { arrancar(); observer.disconnect(); }
  });
  // El observer arranca cuando el elemento se monta — usamos requestAnimationFrame
  // para asegurar que el DOM esté listo.
  requestAnimationFrame(() => observer.observe(span));

  return span;
};
