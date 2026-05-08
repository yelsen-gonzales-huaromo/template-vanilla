/**
 * BarraProgreso — barra horizontal con valor reactivo opcional.
 *
 *   BarraProgreso({ valor: 65 })                              // estática
 *   BarraProgreso({ valor: senal, etiqueta: true })           // reactiva
 *   BarraProgreso({ valor: 80, variante: 'success', alto: 'sm', rayada: true })
 *   BarraProgreso({ indeterminada: true })                    // loading sin %
 *   BarraProgreso({ valor: 35, buffer: 60, etiqueta: true })  // tipo YouTube
 *
 * También exporta:
 *   BarraSegmentada — multi-color apilada (usar para storage, presupuesto, etc.)
 *   ProgresoCircular — donut/circle SVG (dashboards, completion rings)
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { efecto } from '../../../utils/helpers/reactive.js';

const esSenal = (v) => v && typeof v === 'object' && 'subscribe' in v && 'value' in v;

// ============================================================================
//  BarraProgreso (lineal)
// ============================================================================
export const BarraProgreso = ({
  valor = 0, total = 100, variante = 'primary', alto = 'md',
  etiqueta = false, formato, rayada = false, animada = false,
  indeterminada = false, buffer,
} = {}) => {
  const barra = crearEl('div', {
    class: ['barra-progreso__valor', `barra-progreso__valor--${variante}`,
            rayada && 'barra-progreso__valor--rayada',
            animada && 'barra-progreso__valor--animada',
            indeterminada && 'barra-progreso__valor--indeterminada'],
    role: 'progressbar',
    'aria-valuemin': '0',
    'aria-valuemax': String(total),
  });
  const bufferNodo = (buffer != null) && crearEl('div', { class: 'barra-progreso__buffer' });
  const lbl = etiqueta && crearEl('span', { class: 'barra-progreso__etiqueta' });

  const aplicar = (v) => {
    const pct = Math.max(0, Math.min(100, (v / total) * 100));
    barra.style.width = `${pct}%`;
    barra.setAttribute('aria-valuenow', String(v));
    if (lbl) lbl.textContent = formato ? formato(v, total, pct) : `${Math.round(pct)}%`;
  };

  if (indeterminada) {
    barra.style.width = '100%';
    barra.removeAttribute('aria-valuenow');
  } else if (esSenal(valor)) {
    efecto(() => aplicar(valor.value));
  } else {
    aplicar(valor);
  }

  if (bufferNodo) {
    const aplicarBuffer = (v) => {
      const pct = Math.max(0, Math.min(100, (v / total) * 100));
      bufferNodo.style.width = `${pct}%`;
    };
    if (esSenal(buffer)) efecto(() => aplicarBuffer(buffer.value));
    else aplicarBuffer(buffer);
  }

  const pista = crearEl('div', {
    class: ['barra-progreso', `barra-progreso--${alto}`],
  }, [bufferNodo, barra]);

  if (etiqueta) {
    return crearEl('div', { class: 'barra-progreso__wrap' }, [pista, lbl]);
  }
  return pista;
};

// ============================================================================
//  BarraSegmentada — multi-color apilada (storage, presupuesto, etc.)
//   segmentos: [{ valor: 30, variante: 'primary', etiqueta?: 'Apps' }, ...]
//   total: 100 (default)
// ============================================================================
export const BarraSegmentada = ({
  segmentos = [], total = 100, alto = 'md', leyenda = false,
} = {}) => {
  const sumaTotal = segmentos.reduce((s, x) => s + (x.valor || 0), 0);
  const totalEfectivo = total ?? sumaTotal;

  const partes = segmentos.map((seg) => {
    const pct = Math.max(0, Math.min(100, (seg.valor / totalEfectivo) * 100));
    return crearEl('div', {
      class: ['barra-segmentada__seg', `barra-segmentada__seg--${seg.variante || 'primary'}`],
      style: { width: `${pct}%` },
      role: 'progressbar', 'aria-valuenow': String(seg.valor), 'aria-valuemax': String(totalEfectivo),
      'aria-label': seg.etiqueta || '',
      title: seg.etiqueta ? `${seg.etiqueta}: ${seg.valor}` : null,
    });
  });

  const pista = crearEl('div', {
    class: ['barra-progreso', 'barra-segmentada', `barra-progreso--${alto}`],
  }, partes);

  if (!leyenda) return pista;

  const leyendaNodo = crearEl('div', { class: 'barra-segmentada__leyenda' },
    segmentos.map((seg) => crearEl('span', { class: 'barra-segmentada__leyenda-item' }, [
      crearEl('span', { class: ['barra-segmentada__leyenda-dot', `barra-segmentada__seg--${seg.variante || 'primary'}`] }),
      crearEl('span', null, [seg.etiqueta || '']),
      crearEl('span', { class: 'barra-segmentada__leyenda-valor' }, [String(seg.valor)]),
    ])),
  );

  return crearEl('div', { class: 'barra-segmentada__wrap' }, [pista, leyendaNodo]);
};

// ============================================================================
//  ProgresoCircular — donut/ring SVG con valor reactivo opcional.
//   tamano: px (default 80), grosor: stroke (default 8)
// ============================================================================
export const ProgresoCircular = ({
  valor = 0, total = 100, tamano = 80, grosor = 8,
  variante = 'primary', etiqueta = true, formato,
} = {}) => {
  const radio = (tamano - grosor) / 2;
  const circunferencia = 2 * Math.PI * radio;
  const cx = tamano / 2;
  const cy = tamano / 2;

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('width', String(tamano));
  svg.setAttribute('height', String(tamano));
  svg.setAttribute('viewBox', `0 0 ${tamano} ${tamano}`);
  svg.setAttribute('class', `progreso-circular progreso-circular--${variante}`);
  svg.setAttribute('role', 'progressbar');
  svg.setAttribute('aria-valuemin', '0');
  svg.setAttribute('aria-valuemax', String(total));

  const track = document.createElementNS(SVG_NS, 'circle');
  track.setAttribute('cx', String(cx));
  track.setAttribute('cy', String(cy));
  track.setAttribute('r', String(radio));
  track.setAttribute('class', 'progreso-circular__track');
  track.setAttribute('stroke-width', String(grosor));

  const fill = document.createElementNS(SVG_NS, 'circle');
  fill.setAttribute('cx', String(cx));
  fill.setAttribute('cy', String(cy));
  fill.setAttribute('r', String(radio));
  fill.setAttribute('class', 'progreso-circular__fill');
  fill.setAttribute('stroke-width', String(grosor));
  fill.setAttribute('stroke-dasharray', String(circunferencia));
  fill.setAttribute('stroke-dashoffset', String(circunferencia));
  fill.setAttribute('transform', `rotate(-90 ${cx} ${cy})`);

  svg.appendChild(track);
  svg.appendChild(fill);

  let labelEl = null;
  if (etiqueta) {
    labelEl = crearEl('span', { class: 'progreso-circular__etiqueta' });
  }

  const aplicar = (v) => {
    const pct = Math.max(0, Math.min(100, (v / total) * 100));
    fill.setAttribute('stroke-dashoffset', String(circunferencia * (1 - pct / 100)));
    svg.setAttribute('aria-valuenow', String(v));
    if (labelEl) labelEl.textContent = formato ? formato(v, total, pct) : `${Math.round(pct)}%`;
  };
  if (esSenal(valor)) efecto(() => aplicar(valor.value));
  else aplicar(valor);

  return crearEl('div', {
    class: 'progreso-circular__wrap',
    style: { width: `${tamano}px`, height: `${tamano}px` },
  }, [svg, labelEl]);
};
