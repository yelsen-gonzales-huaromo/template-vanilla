/**
 * RangoSlider — slider vanilla JS sin noUiSlider (~30 KB).
 *
 *  - Single value (1 handle) o dual range (min/max con 2 handles)
 *  - Tooltips opcionales (sobre cada handle, siempre visibles o on-hover)
 *  - Pips (marcas en el track) — modo 'steps' o 'values'
 *  - Formatter custom para tooltip (currency, %, fechas, etc.)
 *  - Step variable, snap automático
 *  - Pointer events (mouse + touch unificados)
 *  - Teclado: ←/→ mueven el handle activo en pasos
 *  - onChange callback con valores actuales
 */

import { crearEl } from '../../../utils/helpers/dom.js';

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const aPasos = (n, step) => step ? Math.round(n / step) * step : n;

const fmtPct = (val, min, max) => ((val - min) / (max - min)) * 100;

export const RangoSlider = ({
  start,                              // [n] o [min, max]
  min = 0, max = 100, step,
  tooltips = true,                    // true | 'hover' | false
  pips,                               // { mode: 'steps' | 'values', density?: 100, valores?: [n, n, …] }
  format = { to: (v) => v, from: (v) => v },
  onChange,
} = {}) => {
  const dual = Array.isArray(start) && start.length === 2;
  let valores = dual ? [...start] : [start[0] ?? start ?? min];
  if (!Array.isArray(valores)) valores = [valores];

  const wrap = crearEl('div', { class: ['slider', dual && 'slider--dual'] });
  const track = crearEl('div', { class: 'slider__track' });
  const fill = crearEl('div', { class: 'slider__fill' });
  track.appendChild(fill);
  wrap.appendChild(track);

  const handles = valores.map((v, i) => {
    const handle = crearEl('div', {
      class: 'slider__handle',
      tabindex: 0,
      role: 'slider',
      'aria-valuemin': min, 'aria-valuemax': max, 'aria-valuenow': v,
      'data-idx': String(i),
    });
    if (tooltips) {
      const tip = crearEl('div', {
        class: ['slider__tip', tooltips === 'hover' && 'slider__tip--hover'],
      });
      handle.appendChild(tip);
    }
    track.appendChild(handle);
    return handle;
  });

  // Pips
  if (pips) {
    const pipsCont = crearEl('div', { class: 'slider__pips' });
    let valoresPips = [];
    if (pips.valores) {
      valoresPips = pips.valores;
    } else if (pips.mode === 'steps' && step) {
      for (let v = min; v <= max; v += step) valoresPips.push(v);
    } else {
      // density default: 5 pips equiespaciados
      const n = pips.density ? Math.floor(100 / pips.density) + 1 : 5;
      for (let i = 0; i < n; i++) valoresPips.push(min + ((max - min) * i) / (n - 1));
    }
    valoresPips.forEach((v) => {
      const pct = fmtPct(v, min, max);
      pipsCont.appendChild(crearEl('div', {
        class: 'slider__pip',
        style: { left: `${pct}%` },
      }, [
        crearEl('div', { class: 'slider__pip-mark' }),
        crearEl('div', { class: 'slider__pip-label' }, [String(format.to ? format.to(v) : v)]),
      ]));
    });
    wrap.appendChild(pipsCont);
  }

  const refrescar = () => {
    if (dual) {
      const [a, b] = valores;
      const lo = Math.min(a, b), hi = Math.max(a, b);
      const pctA = fmtPct(lo, min, max);
      const pctB = fmtPct(hi, min, max);
      fill.style.left = `${pctA}%`;
      fill.style.width = `${pctB - pctA}%`;
    } else {
      const pct = fmtPct(valores[0], min, max);
      fill.style.left = `0%`;
      fill.style.width = `${pct}%`;
    }
    valores.forEach((v, i) => {
      const pct = fmtPct(v, min, max);
      handles[i].style.left = `${pct}%`;
      handles[i].setAttribute('aria-valuenow', v);
      const tip = handles[i].querySelector('.slider__tip');
      if (tip) tip.textContent = String(format.to ? format.to(v) : v);
    });
    if (onChange) onChange(dual ? [...valores] : valores[0]);
  };

  // -------------------------------------------------------------------------
  //  Drag con pointer events (mouse + touch unificados)
  // -------------------------------------------------------------------------
  let dragIdx = -1;

  const valorDesdeEvento = (e) => {
    const rect = track.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = clamp(x / rect.width, 0, 1);
    let v = min + pct * (max - min);
    v = aPasos(v, step);
    return clamp(v, min, max);
  };

  const onPointerDown = (e) => {
    // Encuentra el handle más cercano si se hace click en el track (no en handle)
    let idx = +e.currentTarget.dataset?.idx;
    if (Number.isNaN(idx)) {
      const v = valorDesdeEvento(e);
      let mejor = 0, dMin = Infinity;
      valores.forEach((val, i) => {
        const d = Math.abs(val - v);
        if (d < dMin) { dMin = d; mejor = i; }
      });
      idx = mejor;
      valores[idx] = v;
      refrescar();
    }
    dragIdx = idx;
    handles[idx].classList.add('slider__handle--activo');
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
    e.preventDefault();
  };

  const onPointerMove = (e) => {
    if (dragIdx < 0) return;
    const v = valorDesdeEvento(e);
    valores[dragIdx] = v;
    refrescar();
  };

  const onPointerUp = () => {
    if (dragIdx >= 0) handles[dragIdx].classList.remove('slider__handle--activo');
    dragIdx = -1;
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
  };

  handles.forEach((h) => h.addEventListener('pointerdown', onPointerDown));
  track.addEventListener('pointerdown', (e) => {
    // Click en el track (no en handle) → mover handle más cercano
    if (e.target.closest('.slider__handle')) return;
    onPointerDown(e);
  });

  // -------------------------------------------------------------------------
  //  Teclado
  // -------------------------------------------------------------------------
  handles.forEach((h, i) => {
    h.addEventListener('keydown', (e) => {
      const inc = step || (max - min) / 100;
      let v = valores[i];
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') v += inc;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') v -= inc;
      else if (e.key === 'Home') v = min;
      else if (e.key === 'End') v = max;
      else return;
      e.preventDefault();
      valores[i] = clamp(aPasos(v, step), min, max);
      refrescar();
    });
  });

  refrescar();
  return wrap;
};

// Helpers de formato comunes
export const fmt = {
  moneda: (codigo = 'PEN', maxDec = 0) => ({
    to: (v) => new Intl.NumberFormat('es-PE', {
      style: 'currency', currency: codigo, maximumFractionDigits: maxDec,
    }).format(v),
    from: (v) => parseFloat(String(v).replace(/[^\d.-]/g, '')) || 0,
  }),
  porcentaje: (decimales = 0) => ({
    to: (v) => `${Number(v).toFixed(decimales)}%`,
    from: (v) => parseFloat(String(v).replace('%', '')) || 0,
  }),
  numero: (sufijo = '') => ({
    to: (v) => `${Math.round(v).toLocaleString('es-PE')}${sufijo}`,
    from: (v) => parseFloat(String(v).replace(/[^\d.-]/g, '')) || 0,
  }),
};
