/**
 * Alerta — mensaje contextual destacado, profesional y configurable.
 *
 *   Alerta({
 *     variante: 'info' | 'success' | 'warning' | 'danger' | 'neutral',
 *     estilo:   'soft' | 'solido' | 'outline' | 'lateral',
 *     tamano:   'sm' | 'md' | 'lg',
 *     titulo,
 *     mensaje,                  // string o nodo
 *     icono,                    // override del icono por defecto
 *     avatar,                   // alternativa al icono (Avatar({...}))
 *     imagen,                   // url para variante banner
 *     acciones,                 // nodo (botones) — al final del mensaje
 *     descartable: false,       // muestra botón ✕
 *     alDescartar: () => {},
 *     progreso,                 // número 0-100 o `senal` — barra inferior
 *     redondeada: true,         // false para banner full-width sin radius
 *     compacta:   false,        // una sola línea sin título
 *   })
 *
 *   AlertaBanner({...})        — atajo para `redondeada: false` + tamano lg
 *   AlertaCompacta({...})      — atajo para `compacta: true` + tamano sm
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { efecto } from '../../../utils/helpers/reactive.js';
import { Icono } from '../icon/icons.js';

const ICONO_POR_VARIANTE = {
  info:    'info',
  success: 'check',
  warning: 'alerta',
  danger:  'alerta',
  neutral: 'info',
};

const esSenal = (v) => v && typeof v === 'object' && 'subscribe' in v && 'value' in v;

export const Alerta = ({
  variante = 'info',
  estilo = 'soft',
  tamano = 'md',
  titulo, mensaje,
  icono, avatar, imagen,
  acciones,
  descartable = false, alDescartar,
  progreso,
  redondeada = true,
  compacta = false,
} = {}) => {
  // Visual: icono / avatar / imagen
  let visual = null;
  if (avatar) {
    visual = crearEl('span', { class: 'alerta__visual alerta__visual--avatar' }, [avatar]);
  } else if (imagen) {
    visual = crearEl('span', { class: 'alerta__visual alerta__visual--imagen' }, [
      crearEl('img', { src: imagen, alt: '' }),
    ]);
  } else if (icono !== false) {
    const ic = icono || Icono(ICONO_POR_VARIANTE[variante] || 'info', { tamano: tamano === 'lg' ? 22 : 18 });
    visual = crearEl('span', { class: 'alerta__visual alerta__visual--icono', 'aria-hidden': 'true' }, [ic]);
  }

  // Botón cerrar
  const btnCerrar = descartable && crearEl('button', {
    type: 'button',
    class: 'alerta__cerrar',
    'aria-label': 'Cerrar',
    onClick: (e) => {
      const host = e.currentTarget.closest('.alerta');
      host?.classList.add('alerta--saliendo');
      setTimeout(() => { host?.remove(); alDescartar?.(); }, 200);
    },
  }, [Icono('cerrar', { tamano: 14 })]);

  // Cuerpo (título + mensaje + acciones)
  const cuerpo = crearEl('div', { class: 'alerta__cuerpo' }, [
    titulo && !compacta && crearEl('strong', { class: 'alerta__titulo' }, [titulo]),
    mensaje && crearEl('div', { class: 'alerta__mensaje' },
      [typeof mensaje === 'string' ? mensaje : mensaje]),
    acciones && crearEl('div', { class: 'alerta__acciones' }, [acciones]),
  ]);

  // Barra de progreso (opcional)
  let barra = null;
  if (progreso !== undefined && progreso !== null) {
    barra = crearEl('div', { class: 'alerta__progreso' }, [
      crearEl('div', { class: 'alerta__progreso-valor' }),
    ]);
    const aplicar = (v) => { barra.lastChild.style.width = `${Math.max(0, Math.min(100, v))}%`; };
    if (esSenal(progreso)) efecto(() => aplicar(progreso.value));
    else aplicar(progreso);
  }

  return crearEl('div', {
    class: [
      'alerta',
      `alerta--${variante}`,
      `alerta--${estilo}`,
      `alerta--${tamano}`,
      compacta && 'alerta--compacta',
      !redondeada && 'alerta--banner',
    ],
    role: variante === 'danger' ? 'alert' : 'status',
  }, [
    visual,
    cuerpo,
    btnCerrar,
    barra,
  ]);
};

export const AlertaBanner = (props = {}) =>
  Alerta({ ...props, redondeada: false, tamano: props.tamano || 'lg' });

export const AlertaCompacta = (props = {}) =>
  Alerta({ ...props, compacta: true, tamano: props.tamano || 'sm' });
