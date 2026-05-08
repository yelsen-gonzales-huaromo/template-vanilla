/**
 * Rating — sistema completo de valoración vanilla JS, 6 tipos.
 *
 *  1. Estrellas      — clásico ★ con half-star, hover preview, keyboard, etiquetas
 *  2. Caritas        — satisfaction emoji 😡 😞 😐 😊 😍 (5 niveles)
 *  3. Pulgares       — like / dislike binario o 3-state (👎 — 👍)
 *  4. NPS            — pills 0-10 con gradiente rojo → amarillo → verde
 *  5. Corazones      — ❤️ para wishlists / favoritos
 *  6. ResumenReviews — widget de display con promedio + histograma
 *
 * Todos integran con `data-valido`, `aria-*`, son accesibles con teclado y
 * usan callbacks `onChange(valor)` o `onChange(valor, opcion)`.
 */

import { crearEl } from '../../../utils/helpers/dom.js';
import { Icono } from '../../../components/ui/icon/icons.js';

const ETIQUETAS_5 = ['Pésimo', 'Malo', 'Regular', 'Bueno', 'Excelente'];

// ===========================================================================
//  1 · Estrellas — con soporte half-star (display) y hover preview (editable)
// ===========================================================================
export const Estrellas = ({
  valor = 0, max = 5,
  tamano = 22,
  soloLectura = false,
  conLabel = false,             // muestra "4/5" o "Bueno" al lado
  conEtiquetaTexto = false,     // muestra "Pésimo / Malo / …" en hover
  permitirMedio = false,        // habilita medias estrellas (solo display)
  onChange,
} = {}) => {
  let actual = valor;
  let hover = 0;
  const wrap = crearEl('div', { class: ['rating-estrellas', soloLectura && 'rating-estrellas--lectura'] });
  const stars = crearEl('div', {
    class: 'rating-estrellas__stars',
    style: { fontSize: `${tamano}px` },
  });

  const renderStar = (i) => {
    const cont = crearEl('button', {
      type: 'button',
      class: 'rating-estrellas__btn',
      'aria-label': `${i} de ${max}`,
      tabindex: soloLectura ? -1 : 0,
      disabled: soloLectura || null,
      onMouseEnter: soloLectura ? null : () => { hover = i; refresh(); },
      onMouseLeave: soloLectura ? null : () => { hover = 0; refresh(); },
      onClick: soloLectura ? null : () => { actual = i; refresh(); onChange && onChange(i); },
      onKeyDown: soloLectura ? null : (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); actual = Math.min(max, actual + 1); refresh(); onChange && onChange(actual); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); actual = Math.max(0, actual - 1); refresh(); onChange && onChange(actual); }
      },
    });
    // Star container con relleno parcial (para half-star en display)
    const fondo = Icono('estrella', { tamano, color: 'currentColor' });
    fondo.classList.add('rating-estrellas__fondo');
    const relleno = crearEl('span', { class: 'rating-estrellas__relleno' }, [
      Icono('estrella', { tamano }),
    ]);
    cont.appendChild(fondo);
    cont.appendChild(relleno);
    return cont;
  };

  const buttons = [];
  for (let i = 1; i <= max; i++) {
    const b = renderStar(i);
    stars.appendChild(b);
    buttons.push(b);
  }

  const lblTexto = conEtiquetaTexto || conLabel
    ? crearEl('span', { class: 'rating-estrellas__lbl' })
    : null;

  const refresh = () => {
    const v = hover || actual;
    buttons.forEach((b, idx) => {
      const i = idx + 1;
      const fillPct = soloLectura && permitirMedio
        ? Math.max(0, Math.min(1, v - (i - 1))) * 100
        : i <= v ? 100 : 0;
      b.querySelector('.rating-estrellas__relleno').style.width = `${fillPct}%`;
      b.classList.toggle('rating-estrellas__btn--hover', hover === i);
    });
    if (lblTexto) {
      if (conEtiquetaTexto && (hover || actual)) {
        const idx = (hover || actual) - 1;
        if (max === 5) lblTexto.textContent = ETIQUETAS_5[idx] || '';
        else lblTexto.textContent = `${hover || actual}/${max}`;
      } else if (conLabel) {
        lblTexto.textContent = actual > 0
          ? (permitirMedio ? actual.toFixed(1) : actual) + `/${max}`
          : 'Sin valoración';
      } else {
        lblTexto.textContent = '';
      }
    }
  };

  wrap.appendChild(stars);
  if (lblTexto) wrap.appendChild(lblTexto);
  refresh();
  return wrap;
};

// ===========================================================================
//  2 · Caritas — satisfaction emoji rating (5 niveles)
// ===========================================================================
const CARITAS = [
  { emoji: '😡', label: 'Muy malo',      color: '#ef4444' },
  { emoji: '😞', label: 'Malo',          color: '#f97316' },
  { emoji: '😐', label: 'Regular',       color: '#eab308' },
  { emoji: '😊', label: 'Bueno',         color: '#22c55e' },
  { emoji: '😍', label: 'Excelente',     color: '#10b981' },
];

export const Caritas = ({ valor = 0, onChange, conLabel = true } = {}) => {
  let actual = valor;
  const wrap = crearEl('div', { class: 'rating-caritas' });
  const fila = crearEl('div', { class: 'rating-caritas__fila' });
  const lbl = conLabel ? crearEl('div', { class: 'rating-caritas__lbl' }) : null;

  const refresh = () => {
    fila.querySelectorAll('.rating-caritas__btn').forEach((b, i) => {
      const sel = (i + 1) === actual;
      b.classList.toggle('rating-caritas__btn--sel', sel);
      if (sel) b.style.setProperty('--c-sel', CARITAS[i].color);
    });
    if (lbl) {
      lbl.textContent = actual > 0 ? CARITAS[actual - 1].label : 'Selecciona una opción';
      lbl.style.color = actual > 0 ? CARITAS[actual - 1].color : 'var(--muted-foreground)';
    }
  };

  CARITAS.forEach((c, i) => {
    fila.appendChild(crearEl('button', {
      type: 'button',
      class: 'rating-caritas__btn',
      title: c.label,
      onClick: () => { actual = i + 1; refresh(); onChange && onChange(actual, c); },
    }, [c.emoji]));
  });

  wrap.appendChild(fila);
  if (lbl) wrap.appendChild(lbl);
  refresh();
  return wrap;
};

// ===========================================================================
//  3 · Pulgares — binario o 3-state (👎 / null / 👍)
// ===========================================================================
export const Pulgares = ({ valor = 0, onChange, conConteo, counts } = {}) => {
  let actual = valor;   // -1, 0, 1
  const wrap = crearEl('div', { class: 'rating-pulgares' });

  const renderBtn = (val, icono, baseColor) => {
    const btn = crearEl('button', {
      type: 'button',
      class: ['rating-pulgares__btn', `rating-pulgares__btn--${val === 1 ? 'up' : 'down'}`],
      title: val === 1 ? 'Útil' : 'No útil',
      onClick: () => {
        actual = actual === val ? 0 : val;
        refresh();
        onChange && onChange(actual);
      },
    }, [
      Icono(icono, { tamano: 16 }),
      conConteo && counts && crearEl('span', { class: 'rating-pulgares__count' },
        [String(val === 1 ? counts.up : counts.down)]),
    ]);
    return btn;
  };

  const btnUp = renderBtn(1, 'pulgar_arriba');
  const btnDown = renderBtn(-1, 'pulgar_abajo');

  const refresh = () => {
    btnUp.classList.toggle('rating-pulgares__btn--activo', actual === 1);
    btnDown.classList.toggle('rating-pulgares__btn--activo', actual === -1);
  };

  wrap.appendChild(btnUp);
  wrap.appendChild(btnDown);
  refresh();
  return wrap;
};

// ===========================================================================
//  4 · NPS — pills 0-10 con gradiente rojo → amarillo → verde
// ===========================================================================
export const NPS = ({ valor = -1, onChange, conLabels = true } = {}) => {
  let actual = valor;
  const wrap = crearEl('div', { class: 'rating-nps' });
  const fila = crearEl('div', { class: 'rating-nps__fila' });

  const colorPara = (n) => {
    if (n <= 6) return '#ef4444';     // detractores
    if (n <= 8) return '#eab308';     // pasivos
    return '#22c55e';                 // promotores
  };

  for (let i = 0; i <= 10; i++) {
    const btn = crearEl('button', {
      type: 'button',
      class: 'rating-nps__btn',
      'data-n': String(i),
      title: i <= 6 ? 'Detractor' : i <= 8 ? 'Pasivo' : 'Promotor',
      style: { '--c': colorPara(i) },
      onClick: () => { actual = i; refresh(); onChange && onChange(i); },
    }, [String(i)]);
    fila.appendChild(btn);
  }

  const refresh = () => {
    fila.querySelectorAll('.rating-nps__btn').forEach((b) => {
      b.classList.toggle('rating-nps__btn--sel', +b.dataset.n === actual);
    });
  };

  wrap.appendChild(fila);
  if (conLabels) {
    wrap.appendChild(crearEl('div', { class: 'rating-nps__labels' }, [
      crearEl('span', null, ['Nada probable']),
      crearEl('span', null, ['Muy probable']),
    ]));
  }
  refresh();
  return wrap;
};

// ===========================================================================
//  5 · Corazones — clásico para favoritos / wishlists
// ===========================================================================
export const Corazones = ({ valor = 0, max = 5, tamano = 22, soloLectura = false, onChange } = {}) => {
  let actual = valor;
  let hover = 0;
  const wrap = crearEl('div', { class: 'rating-corazones', style: { fontSize: `${tamano}px` } });

  const refresh = () => {
    wrap.querySelectorAll('.rating-corazones__btn').forEach((b, idx) => {
      const i = idx + 1;
      b.classList.toggle('rating-corazones__btn--on', i <= (hover || actual));
      b.classList.toggle('rating-corazones__btn--hover', hover === i);
    });
  };

  for (let i = 1; i <= max; i++) {
    wrap.appendChild(crearEl('button', {
      type: 'button',
      class: 'rating-corazones__btn',
      title: `${i} corazones`,
      disabled: soloLectura || null,
      onMouseEnter: soloLectura ? null : () => { hover = i; refresh(); },
      onMouseLeave: soloLectura ? null : () => { hover = 0; refresh(); },
      onClick: soloLectura ? null : () => { actual = actual === i ? 0 : i; refresh(); onChange && onChange(actual); },
    }, [Icono('corazon', { tamano })]));
  }
  refresh();
  return wrap;
};

// ===========================================================================
//  6 · ResumenReviews — widget de display con promedio + histograma
// ===========================================================================
export const ResumenReviews = ({ promedio = 0, total = 0, distribucion = [0, 0, 0, 0, 0] } = {}) => {
  // distribucion: [conteo_1estrella, conteo_2..., ..., conteo_5estrellas]
  const totalDist = distribucion.reduce((s, n) => s + n, 0) || 1;
  const wrap = crearEl('div', { class: 'rating-resumen' });

  const izq = crearEl('div', { class: 'rating-resumen__izq' }, [
    crearEl('div', { class: 'rating-resumen__nota' }, [promedio.toFixed(1)]),
    Estrellas({ valor: promedio, soloLectura: true, permitirMedio: true, tamano: 18 }),
    crearEl('div', { class: 'rating-resumen__total' }, [`${total.toLocaleString()} reseñas`]),
  ]);

  const der = crearEl('div', { class: 'rating-resumen__hist' });
  for (let i = 5; i >= 1; i--) {
    const conteo = distribucion[i - 1] || 0;
    const pct = (conteo / totalDist) * 100;
    der.appendChild(crearEl('div', { class: 'rating-resumen__fila' }, [
      crearEl('span', { class: 'rating-resumen__num' }, [`${i} ★`]),
      crearEl('div', { class: 'rating-resumen__barra' }, [
        crearEl('div', { class: 'rating-resumen__barra-fill', style: { width: `${pct}%` } }),
      ]),
      crearEl('span', { class: 'rating-resumen__pct' }, [`${Math.round(pct)}%`]),
    ]));
  }

  wrap.appendChild(izq);
  wrap.appendChild(der);
  return wrap;
};
