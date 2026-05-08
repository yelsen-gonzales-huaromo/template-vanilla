/**
 * Cargador — indicadores visuales de carga.
 *
 *   Cargador()                                      // circular default
 *   Cargador({ variante: 'puntos' })                // 3 dots bouncing
 *   Cargador({ tamano: 'lg', color: 'success' })
 *   Cargador({ etiqueta: 'Cargando…' })             // texto inline
 *
 * Variantes:
 *   circular  — border ring rotando (default)
 *   puntos    — 3 dots bounce
 *   pulso     — círculo pulsante
 *   barras    — 3 barras equalizer
 *   radial    — gradient radial sweep
 *   ring      — doble anillo rotando
 *
 * Tamaños:  xs · sm · md · lg · xl
 * Colores:  primary · success · warning · danger · white · current (hereda)
 *
 * También exporta:
 *   OverlayCarga — overlay absoluto con backdrop blur sobre un container
 */
import { crearEl } from '../../../utils/helpers/dom.js';

export const Cargador = ({
  tamano = 'md', variante = 'circular', color = 'primary',
  etiqueta,
} = {}) => {
  let inner;

  if (variante === 'puntos') {
    inner = crearEl('span', {
      class: ['spinner', `spinner--${variante}`, tamano !== 'md' && `spinner--${tamano}`,
              color !== 'primary' && `spinner--c-${color}`],
      role: 'status', 'aria-label': etiqueta || 'Cargando',
    }, [
      crearEl('span', { class: 'spinner__dot' }),
      crearEl('span', { class: 'spinner__dot' }),
      crearEl('span', { class: 'spinner__dot' }),
    ]);
  } else if (variante === 'barras') {
    inner = crearEl('span', {
      class: ['spinner', `spinner--${variante}`, tamano !== 'md' && `spinner--${tamano}`,
              color !== 'primary' && `spinner--c-${color}`],
      role: 'status', 'aria-label': etiqueta || 'Cargando',
    }, [
      crearEl('span', { class: 'spinner__bar' }),
      crearEl('span', { class: 'spinner__bar' }),
      crearEl('span', { class: 'spinner__bar' }),
    ]);
  } else if (variante === 'ring') {
    inner = crearEl('span', {
      class: ['spinner', `spinner--${variante}`, tamano !== 'md' && `spinner--${tamano}`,
              color !== 'primary' && `spinner--c-${color}`],
      role: 'status', 'aria-label': etiqueta || 'Cargando',
    }, [
      crearEl('span', { class: 'spinner__ring' }),
      crearEl('span', { class: 'spinner__ring' }),
    ]);
  } else {
    // circular | pulso | radial — single element
    inner = crearEl('span', {
      class: ['spinner', `spinner--${variante}`, tamano !== 'md' && `spinner--${tamano}`,
              color !== 'primary' && `spinner--c-${color}`],
      role: 'status', 'aria-label': etiqueta || 'Cargando',
    });
  }

  if (etiqueta) {
    return crearEl('span', { class: 'spinner-wrap' }, [
      inner,
      crearEl('span', { class: 'spinner-wrap__txt' }, [etiqueta]),
    ]);
  }
  return inner;
};

// ============================================================================
//  OverlayCarga — cubre un container con backdrop blur + spinner centrado
// ============================================================================
export const OverlayCarga = ({
  texto = 'Cargando…', variante = 'circular', tamano = 'lg', tema = 'claro',
} = {}) => crearEl('div', {
  class: ['spinner-overlay', tema === 'oscuro' && 'spinner-overlay--oscuro'],
  role: 'status',
  'aria-busy': 'true',
  'aria-label': texto,
}, [
  crearEl('div', { class: 'spinner-overlay__contenido' }, [
    Cargador({ variante, tamano,
      color: tema === 'oscuro' ? 'white' : 'primary' }),
    texto && crearEl('span', { class: 'spinner-overlay__texto' }, [texto]),
  ]),
]);
