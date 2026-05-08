import { crearEl } from '../../../utils/helpers/dom.js';
import { GraficoSparkline } from '../chart/chart.js';

/**
 * Tarjeta KPI — patrón típico de dashboards.
 * Acepta etiqueta, valor, delta (cambio %), sparkline opcional e icono.
 */
export const TarjetaKpi = ({
  etiqueta,
  valor,
  delta,
  tendencia = 'neutral',
  icono,
  sparkline,
  pista,
  color,
} = {}) => crearEl('article', { class: 'kpi-card' }, [
  crearEl('div', { class: 'kpi-card__head' }, [
    crearEl('div', null, [
      crearEl('div', { class: 'kpi-card__label' }, [etiqueta]),
      crearEl('div', { class: 'kpi-card__value', style: color ? { color } : null }, [valor]),
    ]),
    icono && crearEl('div', {
      class: 'kpi-card__icon',
      'aria-hidden': 'true',
      style: color ? { backgroundColor: 'var(--accent)', color } : null,
    }, [typeof icono === 'string' ? crearEl('span', { html: icono }) : icono]),
  ]),
  sparkline && sparkline.length > 0 && crearEl('div', { class: 'kpi-card__sparkline' }, [
    GraficoSparkline({ datos: sparkline, ancho: 200, alto: 28, color }),
  ]),
  (delta || pista) && crearEl('div', { class: 'kpi-card__foot' }, [
    delta && crearEl('span', {
      class: ['kpi-card__delta', tendencia === 'up' && 'kpi-card__delta--up', tendencia === 'down' && 'kpi-card__delta--down'],
    }, [
      tendencia === 'up' ? '↑ ' : tendencia === 'down' ? '↓ ' : '',
      delta,
    ]),
    pista && crearEl('span', null, [pista]),
  ]),
]);
