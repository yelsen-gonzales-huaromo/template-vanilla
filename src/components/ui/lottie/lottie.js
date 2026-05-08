/**
 * Lottie — wrapper sobre `lottie-web` (Airbnb), 100% LOCAL, sin CDN.
 *
 *   Lottie({ src: './public/lottie/Loading.json' })
 *   Lottie({ src: '...', alto: '200px', loop: false, autoplay: true, hover: true })
 *
 * El script `lottie.min.js` vive en /public/vendor/ y se carga UNA sola vez
 * de forma lazy. Una vez cargado, todas las animaciones se reproducen sin
 * tocar la red — sin tracking-prevention ni dependencias externas.
 */
import { crearEl } from '../../../utils/helpers/dom.js';

const RUTA_SCRIPT = './public/vendor/lottie.min.js';

let _scriptCargado = false;
let _promesaCarga = null;

const cargarLottieWeb = () => {
  if (_scriptCargado) return Promise.resolve();
  if (_promesaCarga) return _promesaCarga;
  _promesaCarga = new Promise((resolve, reject) => {
    if (window.lottie || window.bodymovin) {
      _scriptCargado = true;
      resolve();
      return;
    }
    const s = document.createElement('script');
    s.src = RUTA_SCRIPT;
    s.async = true;
    s.onload = () => { _scriptCargado = true; resolve(); };
    s.onerror = () => reject(new Error('No se pudo cargar lottie-web local'));
    document.head.appendChild(s);
  });
  return _promesaCarga;
};

const aviso = (host, texto) => {
  host.replaceChildren(crearEl('div', {
    style: {
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)',
      padding: 'var(--space-2)', textAlign: 'center',
    },
  }, [texto]));
};

export const Lottie = ({
  src,
  alto = '180px',
  ancho = '100%',
  autoplay = true,
  loop = true,
  velocidad = 1,
  hover = false,
  alError,
} = {}) => {
  const host = crearEl('div', {
    class: 'lottie-host',
    style: {
      width: ancho, height: alto,
      display: 'inline-block', position: 'relative',
    },
  });

  // Placeholder mientras carga
  const placeholder = crearEl('div', {
    class: 'lottie-placeholder',
    style: {
      width: '100%', height: '100%',
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface-muted)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)',
    },
  }, ['…']);
  host.appendChild(placeholder);

  cargarLottieWeb()
    .then(() => {
      const lottie = window.lottie || window.bodymovin;
      if (!lottie) { aviso(host, '⚠ lottie-web no disponible'); alError?.(); return; }

      host.replaceChildren();
      const anim = lottie.loadAnimation({
        container: host,
        renderer: 'svg',
        loop,
        autoplay: hover ? false : autoplay,
        path: src,
      });
      anim.setSpeed(velocidad);

      anim.addEventListener('data_failed', () => {
        aviso(host, '⚠ No se pudo cargar el JSON');
        alError?.();
      });

      if (hover) {
        host.addEventListener('mouseenter', () => anim.play());
        host.addEventListener('mouseleave', () => anim.stop());
      }
    })
    .catch(() => {
      aviso(host, '⚠ No se pudo cargar lottie-web');
      alError?.();
    });

  return host;
};
