/**
 * Paginación — acepta una instancia de `usarPaginacion()` o los campos equivalentes.
 *
 *   Paginacion({ paginacion })                                    // default
 *   Paginacion({ paginacion, variante: 'pills' })                 // pill rounded
 *   Paginacion({ paginacion, variante: 'simple' })                // sólo prev/next + texto
 *   Paginacion({ paginacion, variante: 'compacta' })              // input "Página N de T"
 *   Paginacion({ paginacion, tamano: 'sm' })                      // sm | md | lg
 *   Paginacion({ paginacion, mostrarPrimeraUltima: true })        // ‹‹ ‹ 1 2 3 › ››
 *   Paginacion({ paginacion, siblings: 2 })                       // # páginas alrededor
 *
 * También exporta:
 *   InfoPaginacion        — "Mostrando 11-20 de 145"
 *   SelectorTamano        — dropdown "10 / 25 / 50 / 100"
 *   BarraPaginacion       — combo de info + selector + paginacion (tabla style)
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { Icono } from '../icon/icons.js';

const armarPaginas = (pagina, total, siblings = 1) => {
  // Ventana mínima: prev (1) + sib (siblings) + actual (1) + sib (siblings) + next (1) + 2 elipsis
  const minimo = siblings * 2 + 5;
  if (total <= minimo) return Array.from({ length: total }, (_, i) => i + 1);

  const izqInicio = Math.max(2, pagina - siblings);
  const derFin    = Math.min(total - 1, pagina + siblings);
  const mostrarElipsisIzq = izqInicio > 2;
  const mostrarElipsisDer = derFin < total - 1;

  // Cerca del inicio
  if (!mostrarElipsisIzq && mostrarElipsisDer) {
    const fin = 1 + siblings * 2 + 2;
    return [...Array.from({ length: fin }, (_, i) => i + 1), '…', total];
  }
  // Cerca del final
  if (mostrarElipsisIzq && !mostrarElipsisDer) {
    const inicio = total - (siblings * 2 + 2);
    return [1, '…', ...Array.from({ length: total - inicio + 1 }, (_, i) => inicio + i)];
  }
  // En el medio
  return [1, '…',
    ...Array.from({ length: derFin - izqInicio + 1 }, (_, i) => izqInicio + i),
    '…', total];
};

export const Paginacion = ({
  paginacion,
  variante = 'default',
  tamano = 'md',
  mostrarPrimeraUltima = false,
  siblings = 1,
} = {}) => {
  const raiz = crearEl('nav', {
    class: ['pagination', `pagination--${variante}`, tamano !== 'md' && `pagination--${tamano}`],
    'aria-label': 'Paginación',
  });

  const btn = (props, hijos) => crearEl('button', {
    type: 'button',
    class: ['pagination__btn'],
    ...props,
  }, hijos);

  const render = () => {
    raiz.replaceChildren();
    const total = paginacion.totalPaginas.value;
    const actual = paginacion.pagina.value;

    // ---- VARIANTE SIMPLE: sólo prev/next + "Página X de Y" ----
    if (variante === 'simple') {
      raiz.appendChild(btn({
        disabled: !paginacion.hayPrevia.value,
        'aria-label': 'Anterior',
        onClick: () => paginacion.anterior(),
      }, [Icono('chevron_l', { tamano: 14 }), crearEl('span', null, ['Anterior'])]));
      raiz.appendChild(crearEl('span', { class: 'pagination__indicador' },
        [`Página ${actual} de ${total}`]));
      raiz.appendChild(btn({
        disabled: !paginacion.hayProxima.value,
        'aria-label': 'Siguiente',
        onClick: () => paginacion.siguiente(),
      }, [crearEl('span', null, ['Siguiente']), Icono('chevron_r', { tamano: 14 })]));
      return;
    }

    // ---- VARIANTE COMPACTA: input para saltar + total ----
    if (variante === 'compacta') {
      raiz.appendChild(btn({
        disabled: !paginacion.hayPrevia.value,
        'aria-label': 'Anterior',
        onClick: () => paginacion.anterior(),
      }, [Icono('chevron_l', { tamano: 14 })]));

      const input = crearEl('input', {
        type: 'number', min: 1, max: total, value: String(actual),
        class: 'pagination__input',
        'aria-label': 'Ir a página',
        onChange: (e) => {
          const v = parseInt(e.currentTarget.value, 10);
          if (Number.isFinite(v)) paginacion.irA(v);
        },
      });
      raiz.appendChild(input);
      raiz.appendChild(crearEl('span', { class: 'pagination__indicador' }, [`de ${total}`]));

      raiz.appendChild(btn({
        disabled: !paginacion.hayProxima.value,
        'aria-label': 'Siguiente',
        onClick: () => paginacion.siguiente(),
      }, [Icono('chevron_r', { tamano: 14 })]));
      return;
    }

    // ---- VARIANTES default / pills / bordeada (similares en estructura) ----
    if (mostrarPrimeraUltima) {
      raiz.appendChild(btn({
        disabled: actual === 1,
        'aria-label': 'Primera página',
        onClick: () => paginacion.irA(1),
      }, [Icono('chevron_l', { tamano: 13 }), Icono('chevron_l', { tamano: 13, class: 'pagination__btn-stack' })]));
    }
    raiz.appendChild(btn({
      disabled: !paginacion.hayPrevia.value,
      'aria-label': 'Anterior',
      onClick: () => paginacion.anterior(),
    }, [Icono('chevron_l', { tamano: 14 })]));

    for (const p of armarPaginas(actual, total, siblings)) {
      if (p === '…') {
        raiz.appendChild(crearEl('span', { class: 'pagination__ellipsis' }, ['…']));
      } else {
        raiz.appendChild(btn({
          'aria-current': p === actual ? 'page' : null,
          onClick: () => paginacion.irA(p),
        }, [String(p)]));
      }
    }

    raiz.appendChild(btn({
      disabled: !paginacion.hayProxima.value,
      'aria-label': 'Siguiente',
      onClick: () => paginacion.siguiente(),
    }, [Icono('chevron_r', { tamano: 14 })]));
    if (mostrarPrimeraUltima) {
      raiz.appendChild(btn({
        disabled: actual === total,
        'aria-label': 'Última página',
        onClick: () => paginacion.irA(total),
      }, [Icono('chevron_r', { tamano: 13 }), Icono('chevron_r', { tamano: 13 })]));
    }
  };

  paginacion.pagina.subscribe(render);
  paginacion.totalPaginas.subscribe(render);
  return raiz;
};

// ============================================================================
//  InfoPaginacion — "Mostrando 11-20 de 145"
// ============================================================================
export const InfoPaginacion = ({ paginacion, etiqueta = 'elementos' } = {}) => {
  const span = crearEl('span', { class: 'pagination-info' });
  const refrescar = () => {
    const p = paginacion.pagina.value;
    const tam = paginacion.tamano.value;
    const total = paginacion.totalElementos.value;
    const desde = (p - 1) * tam + 1;
    const hasta = Math.min(p * tam, total);
    span.textContent = total === 0
      ? `Sin ${etiqueta}`
      : `Mostrando ${desde}–${hasta} de ${total} ${etiqueta}`;
  };
  paginacion.pagina.subscribe(refrescar);
  paginacion.tamano.subscribe(refrescar);
  paginacion.totalElementos.subscribe(refrescar);
  return span;
};

// ============================================================================
//  SelectorTamano — dropdown "10 · 25 · 50 · 100"
// ============================================================================
export const SelectorTamano = ({
  paginacion, opciones = [10, 25, 50, 100], etiqueta = 'por página',
} = {}) => {
  const select = crearEl('select', {
    class: 'pagination-selector',
    'aria-label': 'Items por página',
    onChange: (e) => paginacion.cambiarTamano(parseInt(e.currentTarget.value, 10)),
  }, opciones.map((n) => crearEl('option', {
    value: String(n),
    selected: n === paginacion.tamano.value ? 'selected' : null,
  }, [String(n)])));

  return crearEl('label', { class: 'pagination-selector__wrap' }, [
    select,
    crearEl('span', null, [etiqueta]),
  ]);
};

// ============================================================================
//  BarraPaginacion — info + paginacion + selector (típica de tablas)
// ============================================================================
export const BarraPaginacion = ({
  paginacion,
  opcionesTamano = [10, 25, 50, 100],
  variante = 'default',
  etiqueta = 'elementos',
} = {}) => crearEl('div', { class: 'pagination-barra' }, [
  crearEl('div', { class: 'pagination-barra__izq' }, [
    SelectorTamano({ paginacion, opciones: opcionesTamano }),
  ]),
  crearEl('div', { class: 'pagination-barra__centro' }, [
    InfoPaginacion({ paginacion, etiqueta }),
  ]),
  crearEl('div', { class: 'pagination-barra__der' }, [
    Paginacion({ paginacion, variante }),
  ]),
]);
