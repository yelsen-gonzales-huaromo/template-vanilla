/**
 * Selects modernos — 5 tipos para proyectos corporativos.
 *
 *   1. SelectModerno    — single, custom panel, opcional con buscador
 *   2. SelectAgrupado   — single con secciones (optgroup) tipo "Tarjetas / Wallets"
 *   3. SelectCombobox   — el input ES el buscador; teclear filtra y abre el panel
 *   4. SelectMulti      — multi-select con chips dentro del input + clear all
 *   5. SelectRico       — opciones con avatar/icono + título + subtítulo (handle/email)
 *   6. SelectAccion     — botón con menú desplegable (Export → JSON/CSV/PDF…)
 *
 * Todos comparten:
 *  - Panel flotante con popover manager (un solo abierto a la vez)
 *  - Panel hereda min-width del trigger
 *  - Cierre con click-fuera, ESC, resize; auto-flip si no cabe abajo
 *  - Navegación con flechas ↑↓, selección con Enter, Escape cierra
 *  - Highlight de la opción activa al hover/teclado
 *
 * Las opciones aceptan formas flexibles:
 *   string                                       → { value: s, label: s }
 *   { value, label, descripcion?, icono?, avatar?, deshabilitado?, grupo? }
 *   { grupo: 'Tarjetas', opciones: [...] }       → grupo con sus hijos
 */

import { crearEl } from '../../../utils/helpers/dom.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { abrirPanel, cerrarPopoverActivo } from './_popover.js';

// ---------------------------------------------------------------------------
//  Helpers internos
// ---------------------------------------------------------------------------
const normalizarOpcion = (o) => typeof o === 'string' ? { value: o, label: o } : o;
const aplanar = (opciones) => {
  // Devuelve [{ ...opcion, _grupo? }] descartando los headers de grupo.
  const out = [];
  for (const o of opciones || []) {
    if (o && o.opciones) {
      o.opciones.forEach((sub) => out.push({ ...normalizarOpcion(sub), _grupo: o.grupo }));
    } else {
      out.push(normalizarOpcion(o));
    }
  }
  return out;
};

// Resalta el substring que matchea el filtro dentro del label.
const resaltar = (texto, filtro) => {
  if (!filtro) return texto;
  const i = texto.toLowerCase().indexOf(filtro.toLowerCase());
  if (i < 0) return texto;
  return [
    texto.slice(0, i),
    crearEl('mark', { class: 'sel-mark' }, [texto.slice(i, i + filtro.length)]),
    texto.slice(i + filtro.length),
  ];
};

// Crea una fila de opción reutilizable (con icono/avatar/descripcion opcionales).
const crearFila = ({ opcion, seleccionado, activa, multi, mostrarCheck, filtro, onSelect }) => {
  const hijos = [];
  if (opcion.avatar) {
    hijos.push(crearEl('span', { class: 'sel-opt__avatar' }, [opcion.avatar]));
  } else if (opcion.icono) {
    hijos.push(crearEl('span', { class: 'sel-opt__icono' }, [opcion.icono]));
  }
  hijos.push(crearEl('span', { class: 'sel-opt__cuerpo' }, [
    crearEl('span', { class: 'sel-opt__label' }, resaltar(opcion.label, filtro)),
    opcion.descripcion && crearEl('span', { class: 'sel-opt__desc' }, [opcion.descripcion]),
  ]));
  if (mostrarCheck && seleccionado) {
    hijos.push(crearEl('span', { class: 'sel-opt__check' }, [Icono('check', { tamano: 14 })]));
  }
  if (multi) {
    hijos.unshift(crearEl('span', {
      class: ['sel-opt__cbox', seleccionado && 'sel-opt__cbox--on'],
    }, [seleccionado ? Icono('check', { tamano: 11 }) : null]));
  }
  return crearEl('button', {
    type: 'button',
    class: ['sel-opt', seleccionado && 'sel-opt--sel', activa && 'sel-opt--activa', opcion.deshabilitado && 'sel-opt--desh'],
    'data-value': String(opcion.value),
    disabled: opcion.deshabilitado || null,
    onClick: (e) => { e.preventDefault(); if (!opcion.deshabilitado) onSelect(opcion); },
    onMouseEnter: (e) => {
      // Limpia clase activa de los hermanos y la pone aquí.
      const padre = e.currentTarget.parentNode;
      padre.querySelectorAll('.sel-opt--activa').forEach((n) => n.classList.remove('sel-opt--activa'));
      e.currentTarget.classList.add('sel-opt--activa');
    },
  }, hijos);
};

// ===========================================================================
//  1 · SelectModerno  —  single, custom panel, buscador opcional
// ===========================================================================
export const SelectModerno = ({
  opciones = [], value, onChange, placeholder = 'Selecciona…',
  conBuscador = false, deshabilitado, valido, invalido,
} = {}) => {
  const planas = aplanar(opciones);
  let valorActual = value !== undefined ? planas.find((o) => o.value === value) : null;
  let panelRef = null;
  let triggerRef = null;
  let labelRef = null;

  const setValor = (opcion) => {
    valorActual = opcion;
    if (labelRef) {
      labelRef.textContent = opcion ? opcion.label : '';
      labelRef.classList.toggle('sel-trigger__placeholder', !opcion);
      if (!opcion) labelRef.textContent = placeholder;
    }
    cerrarPopoverActivo();
    onChange && onChange(opcion ? opcion.value : null, opcion);
  };

  const renderLista = (filtro = '') => {
    if (!panelRef) return;
    const lista = panelRef.querySelector('.sel-lista');
    lista.replaceChildren();

    const q = filtro.trim().toLowerCase();
    const filtradas = q ? planas.filter((o) => o.label.toLowerCase().includes(q)) : planas;

    if (filtradas.length === 0) {
      lista.appendChild(crearEl('div', { class: 'sel-vacio' }, ['Sin resultados']));
      return;
    }

    let primeraActiva = true;
    filtradas.forEach((o) => {
      const fila = crearFila({
        opcion: o,
        seleccionado: valorActual && valorActual.value === o.value,
        activa: primeraActiva,
        mostrarCheck: true,
        filtro: q,
        onSelect: (op) => setValor(op),
      });
      lista.appendChild(fila);
      primeraActiva = false;
    });
  };

  const navegarTeclado = (e) => {
    const lista = panelRef && panelRef.querySelector('.sel-lista');
    if (!lista) return;
    const opts = Array.from(lista.querySelectorAll('.sel-opt:not(.sel-opt--desh)'));
    if (opts.length === 0) return;
    const idx = opts.findIndex((n) => n.classList.contains('sel-opt--activa'));
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = opts[(idx + 1) % opts.length];
      opts.forEach((n) => n.classList.remove('sel-opt--activa'));
      next.classList.add('sel-opt--activa');
      next.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = opts[(idx - 1 + opts.length) % opts.length];
      opts.forEach((n) => n.classList.remove('sel-opt--activa'));
      prev.classList.add('sel-opt--activa');
      prev.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const activo = lista.querySelector('.sel-opt--activa');
      if (activo) activo.click();
    }
  };

  const abrir = () => {
    let buscador = null;
    const partes = [];
    if (conBuscador) {
      buscador = crearEl('input', {
        type: 'text',
        class: 'input input--sm sel-buscador',
        placeholder: 'Buscar…',
        onInput: (e) => renderLista(e.target.value),
        onKeyDown: navegarTeclado,
      });
      partes.push(buscador);
    }
    const lista = crearEl('div', { class: 'sel-lista' });
    partes.push(lista);

    panelRef = crearEl('div', { class: 'picker-panel__contenido sel-panel' }, partes);
    renderLista('');
    abrirPanel({ ancla: triggerRef, contenido: panelRef, onCerrar: () => { panelRef = null; } });
    if (buscador) requestAnimationFrame(() => buscador.focus());
  };

  triggerRef = crearEl('button', {
    type: 'button',
    class: ['sel-trigger', valido && 'sel-trigger--valido', invalido && 'sel-trigger--invalido'],
    disabled: deshabilitado || null,
    'aria-haspopup': 'listbox',
    onClick: (e) => { e.preventDefault(); abrir(); },
    onKeyDown: (e) => {
      if (!panelRef && (e.key === 'ArrowDown' || e.key === 'Enter')) { e.preventDefault(); abrir(); }
      else if (panelRef) navegarTeclado(e);
    },
  }, [
    crearEl('span', {
      class: ['sel-trigger__label', !valorActual && 'sel-trigger__placeholder'],
      ref: (n) => { labelRef = n; },
    }, [valorActual ? valorActual.label : placeholder]),
    Icono('chevron_d', { tamano: 14, clase: 'sel-trigger__chev' }),
  ]);
  return triggerRef;
};

// ===========================================================================
//  2 · SelectAgrupado  —  single con secciones (optgroup)
// ===========================================================================
export const SelectAgrupado = ({
  opciones = [], value, onChange, placeholder = 'Selecciona…',
  conBuscador = true, deshabilitado, valido, invalido,
} = {}) => {
  const planas = aplanar(opciones);
  let valorActual = value !== undefined ? planas.find((o) => o.value === value) : null;
  let panelRef = null;
  let triggerRef = null;
  let labelRef = null;

  const setValor = (opcion) => {
    valorActual = opcion;
    if (labelRef) {
      labelRef.textContent = opcion ? opcion.label : placeholder;
      labelRef.classList.toggle('sel-trigger__placeholder', !opcion);
    }
    cerrarPopoverActivo();
    onChange && onChange(opcion ? opcion.value : null, opcion);
  };

  const renderLista = (filtro = '') => {
    if (!panelRef) return;
    const lista = panelRef.querySelector('.sel-lista');
    lista.replaceChildren();
    const q = filtro.trim().toLowerCase();

    const grupos = [];
    for (const item of opciones) {
      if (item && item.opciones) {
        const visibles = item.opciones
          .map(normalizarOpcion)
          .filter((o) => !q || o.label.toLowerCase().includes(q));
        if (visibles.length) grupos.push({ titulo: item.grupo, opciones: visibles });
      } else {
        const op = normalizarOpcion(item);
        if (!q || op.label.toLowerCase().includes(q)) {
          grupos.push({ titulo: null, opciones: [op] });
        }
      }
    }

    if (grupos.length === 0) {
      lista.appendChild(crearEl('div', { class: 'sel-vacio' }, ['Sin resultados']));
      return;
    }

    let primeraActiva = true;
    grupos.forEach((g) => {
      if (g.titulo) {
        lista.appendChild(crearEl('div', { class: 'sel-grupo' }, [g.titulo]));
      }
      g.opciones.forEach((o) => {
        const fila = crearFila({
          opcion: o,
          seleccionado: valorActual && valorActual.value === o.value,
          activa: primeraActiva,
          mostrarCheck: true,
          filtro: q,
          onSelect: setValor,
        });
        lista.appendChild(fila);
        primeraActiva = false;
      });
    });
  };

  const abrir = () => {
    const partes = [];
    let buscador = null;
    if (conBuscador) {
      buscador = crearEl('input', {
        type: 'text',
        class: 'input input--sm sel-buscador',
        placeholder: 'Buscar…',
        onInput: (e) => renderLista(e.target.value),
      });
      partes.push(buscador);
    }
    partes.push(crearEl('div', { class: 'sel-lista' }));
    panelRef = crearEl('div', { class: 'picker-panel__contenido sel-panel' }, partes);
    renderLista('');
    abrirPanel({ ancla: triggerRef, contenido: panelRef, onCerrar: () => { panelRef = null; } });
    if (buscador) requestAnimationFrame(() => buscador.focus());
  };

  triggerRef = crearEl('button', {
    type: 'button',
    class: ['sel-trigger', valido && 'sel-trigger--valido', invalido && 'sel-trigger--invalido'],
    disabled: deshabilitado || null,
    onClick: (e) => { e.preventDefault(); abrir(); },
  }, [
    crearEl('span', {
      class: ['sel-trigger__label', !valorActual && 'sel-trigger__placeholder'],
      ref: (n) => { labelRef = n; },
    }, [valorActual ? valorActual.label : placeholder]),
    Icono('chevron_d', { tamano: 14, clase: 'sel-trigger__chev' }),
  ]);
  return triggerRef;
};

// ===========================================================================
//  3 · SelectCombobox  —  el input ES el buscador (typeahead, in-place edit)
// ===========================================================================
export const SelectCombobox = ({
  opciones = [], value, onChange, placeholder = 'Buscar…',
  permitirCustom = false, deshabilitado, valido, invalido,
} = {}) => {
  const planas = aplanar(opciones);
  let valorActual = value !== undefined ? planas.find((o) => o.value === value) : null;
  let panelRef = null;
  let inputRef = null;
  let wrapRef = null;

  const setValor = (opcion) => {
    valorActual = opcion;
    if (inputRef) inputRef.value = opcion ? opcion.label : '';
    cerrarPopoverActivo();
    onChange && onChange(opcion ? opcion.value : null, opcion);
  };

  const renderLista = (filtro = '') => {
    if (!panelRef) return;
    const lista = panelRef.querySelector('.sel-lista');
    lista.replaceChildren();
    const q = filtro.trim().toLowerCase();
    const filtradas = q ? planas.filter((o) => o.label.toLowerCase().includes(q)) : planas;

    if (filtradas.length === 0) {
      if (permitirCustom && q) {
        lista.appendChild(crearFila({
          opcion: { value: filtro, label: `Crear "${filtro}"`, _custom: true },
          activa: true,
          mostrarCheck: false,
          filtro: '',
          onSelect: () => setValor({ value: filtro, label: filtro }),
        }));
      } else {
        lista.appendChild(crearEl('div', { class: 'sel-vacio' }, ['Sin resultados']));
      }
      return;
    }

    let primeraActiva = true;
    filtradas.forEach((o) => {
      lista.appendChild(crearFila({
        opcion: o,
        seleccionado: valorActual && valorActual.value === o.value,
        activa: primeraActiva,
        mostrarCheck: true,
        filtro: q,
        onSelect: setValor,
      }));
      primeraActiva = false;
    });
  };

  const navegarTeclado = (e) => {
    if (!panelRef) {
      if (e.key === 'ArrowDown') { e.preventDefault(); abrir(); }
      return;
    }
    const lista = panelRef.querySelector('.sel-lista');
    const opts = Array.from(lista.querySelectorAll('.sel-opt:not(.sel-opt--desh)'));
    if (opts.length === 0) return;
    const idx = opts.findIndex((n) => n.classList.contains('sel-opt--activa'));
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = opts[(idx + 1) % opts.length];
      opts.forEach((n) => n.classList.remove('sel-opt--activa'));
      next.classList.add('sel-opt--activa');
      next.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = opts[(idx - 1 + opts.length) % opts.length];
      opts.forEach((n) => n.classList.remove('sel-opt--activa'));
      prev.classList.add('sel-opt--activa');
      prev.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const activo = lista.querySelector('.sel-opt--activa');
      if (activo) activo.click();
    }
  };

  const abrir = () => {
    if (panelRef) return;
    panelRef = crearEl('div', { class: 'picker-panel__contenido sel-panel sel-panel--combobox' }, [
      crearEl('div', { class: 'sel-lista' }),
    ]);
    renderLista(inputRef ? inputRef.value : '');
    abrirPanel({ ancla: wrapRef, contenido: panelRef, onCerrar: () => { panelRef = null; } });
  };

  inputRef = crearEl('input', {
    type: 'text',
    class: ['input', valido && 'input--valido', invalido && 'input--invalido'],
    placeholder,
    value: valorActual ? valorActual.label : '',
    disabled: deshabilitado || null,
    'data-valido': valido || null,
    'aria-invalid': invalido || null,
    autocomplete: 'off',
    onFocus: abrir,
    onInput: (e) => {
      if (!panelRef) abrir();
      else renderLista(e.target.value);
    },
    onKeyDown: navegarTeclado,
  });

  const chev = crearEl('span', {
    class: 'picker-trigger__icono',
    onMouseDown: (e) => {
      e.preventDefault();
      if (panelRef) cerrarPopoverActivo();
      else { inputRef.focus(); abrir(); }
    },
  }, [Icono('chevron_d', { tamano: 14 })]);

  wrapRef = crearEl('div', { class: 'picker-trigger sel-combobox' }, [inputRef, chev]);
  return wrapRef;
};

// ===========================================================================
//  4 · SelectMulti  —  multi-select con chips dentro del input
// ===========================================================================
export const SelectMulti = ({
  opciones = [], value = [], onChange, placeholder = 'Selecciona varias…',
  conBuscador = true, deshabilitado, valido, invalido, max,
} = {}) => {
  const planas = aplanar(opciones);
  let seleccionados = new Set(value);
  let panelRef = null;
  let triggerRef = null;
  let chipsRef = null;

  const emitir = () => {
    const arr = Array.from(seleccionados);
    onChange && onChange(arr, planas.filter((o) => seleccionados.has(o.value)));
  };

  const renderTrigger = () => {
    if (!chipsRef) return;
    chipsRef.replaceChildren();
    if (seleccionados.size === 0) {
      chipsRef.appendChild(crearEl('span', { class: 'sel-trigger__placeholder' }, [placeholder]));
      return;
    }
    planas.filter((o) => seleccionados.has(o.value)).forEach((o) => {
      chipsRef.appendChild(crearEl('span', { class: 'sel-chip' }, [
        o.label,
        crearEl('button', {
          type: 'button',
          class: 'sel-chip__x',
          'aria-label': `Quitar ${o.label}`,
          onClick: (e) => {
            e.preventDefault(); e.stopPropagation();
            seleccionados.delete(o.value);
            renderTrigger();
            if (panelRef) renderLista(panelRef.querySelector('.sel-buscador')?.value || '');
            emitir();
          },
        }, [Icono('cerrar', { tamano: 10 })]),
      ]));
    });
  };

  const renderLista = (filtro = '') => {
    if (!panelRef) return;
    const lista = panelRef.querySelector('.sel-lista');
    lista.replaceChildren();
    const q = filtro.trim().toLowerCase();
    const filtradas = q ? planas.filter((o) => o.label.toLowerCase().includes(q)) : planas;

    if (filtradas.length === 0) {
      lista.appendChild(crearEl('div', { class: 'sel-vacio' }, ['Sin resultados']));
      return;
    }

    let primeraActiva = true;
    filtradas.forEach((o) => {
      const sel = seleccionados.has(o.value);
      const tope = max && !sel && seleccionados.size >= max;
      const fila = crearFila({
        opcion: { ...o, deshabilitado: o.deshabilitado || tope },
        seleccionado: sel,
        activa: primeraActiva,
        multi: true,
        filtro: q,
        onSelect: (op) => {
          if (sel) seleccionados.delete(op.value);
          else if (!tope) seleccionados.add(op.value);
          renderTrigger();
          renderLista(filtro);
          emitir();
        },
      });
      lista.appendChild(fila);
      primeraActiva = false;
    });
  };

  const abrir = () => {
    const partes = [];
    let buscador = null;
    if (conBuscador) {
      buscador = crearEl('input', {
        type: 'text',
        class: 'input input--sm sel-buscador',
        placeholder: 'Buscar…',
        onInput: (e) => renderLista(e.target.value),
      });
      partes.push(buscador);
    }
    partes.push(crearEl('div', { class: 'sel-lista' }));
    panelRef = crearEl('div', { class: 'picker-panel__contenido sel-panel' }, partes);
    renderLista('');
    abrirPanel({ ancla: triggerRef, contenido: panelRef, onCerrar: () => { panelRef = null; } });
    if (buscador) requestAnimationFrame(() => buscador.focus());
  };

  triggerRef = crearEl('div', {
    class: ['sel-trigger', 'sel-trigger--multi', valido && 'sel-trigger--valido', invalido && 'sel-trigger--invalido', deshabilitado && 'sel-trigger--desh'],
    tabindex: deshabilitado ? -1 : 0,
    onClick: (e) => { if (deshabilitado) return; if (e.target.closest('.sel-chip__x')) return; abrir(); },
  }, [
    crearEl('div', { class: 'sel-trigger__chips', ref: (n) => { chipsRef = n; } }),
    crearEl('div', { class: 'sel-trigger__acciones' }, [
      seleccionados.size > 0 && crearEl('button', {
        type: 'button',
        class: 'sel-trigger__limpiar',
        'aria-label': 'Limpiar todo',
        onClick: (e) => {
          e.preventDefault(); e.stopPropagation();
          seleccionados.clear(); renderTrigger();
          if (panelRef) renderLista(panelRef.querySelector('.sel-buscador')?.value || '');
          emitir();
        },
      }, [Icono('cerrar', { tamano: 12 })]),
      Icono('chevron_d', { tamano: 14, clase: 'sel-trigger__chev' }),
    ]),
  ]);
  renderTrigger();
  return triggerRef;
};

// ===========================================================================
//  5 · SelectSegmentado  —  pills horizontales tipo iOS (2-5 opciones)
//      Ideal para Light/Dark/Auto, Day/Week/Month, On/Off, etc.
// ===========================================================================
export const SelectSegmentado = ({
  opciones = [], value, onChange, deshabilitado, tamano = 'md',
} = {}) => {
  const planas = aplanar(opciones);
  let valorActual = value !== undefined ? value : (planas[0] && planas[0].value);

  const wrap = crearEl('div', {
    class: ['sel-seg', `sel-seg--${tamano}`, deshabilitado && 'sel-seg--desh'],
    role: 'tablist',
  });

  const refresh = () => {
    wrap.querySelectorAll('.sel-seg__btn').forEach((b) => {
      b.classList.toggle('sel-seg__btn--activo', b.dataset.value === String(valorActual));
      b.setAttribute('aria-selected', b.dataset.value === String(valorActual));
    });
  };

  planas.forEach((o) => {
    wrap.appendChild(crearEl('button', {
      type: 'button',
      class: 'sel-seg__btn',
      role: 'tab',
      'data-value': String(o.value),
      disabled: deshabilitado || o.deshabilitado || null,
      onClick: (e) => {
        e.preventDefault();
        valorActual = o.value;
        refresh();
        onChange && onChange(o.value, o);
      },
    }, [
      o.icono && crearEl('span', { class: 'sel-seg__ico' }, [o.icono]),
      o.label,
    ]));
  });
  refresh();
  return wrap;
};

// ===========================================================================
//  6 · SelectCascada  —  encadenado: País → Estado → Ciudad
//      `niveles` define cada nivel y cómo obtener las opciones del siguiente.
// ===========================================================================
export const SelectCascada = ({
  niveles = [],          // [{ label, opciones: ([prevSel]) => [...] }]
  value = [],            // valores iniciales por nivel
  onChange,
  conBuscador = true,
} = {}) => {
  let seleccionados = [...value];   // un valor por nivel

  const wrap = crearEl('div', { class: 'sel-cascada' });

  const renderNivel = (idx) => {
    // Borra los siguientes (cascada al cambiar un nivel superior)
    seleccionados = seleccionados.slice(0, idx + 1);
    Array.from(wrap.querySelectorAll('.sel-cascada__nivel')).forEach((n, i) => {
      if (i > idx) n.remove();
    });

    const def = niveles[idx];
    if (!def) return;

    const prev = seleccionados.slice(0, idx);
    const opciones = typeof def.opciones === 'function' ? def.opciones(prev) : def.opciones;

    const contenedor = crearEl('div', { class: 'sel-cascada__nivel' }, [
      crearEl('div', { class: 'sel-cascada__lbl' }, [def.label]),
      SelectModerno({
        opciones,
        value: seleccionados[idx],
        placeholder: def.placeholder || `Selecciona ${def.label.toLowerCase()}…`,
        conBuscador,
        onChange: (v) => {
          seleccionados[idx] = v;
          renderNivel(idx + 1);
          onChange && onChange([...seleccionados]);
        },
      }),
    ]);
    wrap.appendChild(contenedor);
  };

  for (let i = 0; i < niveles.length; i++) {
    if (i === 0 || seleccionados[i - 1]) renderNivel(i);
  }
  return wrap;
};

// ===========================================================================
//  7 · SelectRueda  —  wheel picker iOS-style (compact, scroll para elegir)
// ===========================================================================
export const SelectRueda = ({
  opciones = [], value, onChange, alto = 160, etiqueta,
} = {}) => {
  const planas = aplanar(opciones);
  const ALTURA_ITEM = 32;
  let idxSel = Math.max(0, planas.findIndex((o) => o.value === value));
  if (idxSel < 0) idxSel = 0;

  const lista = crearEl('div', { class: 'sel-rueda__lista' });
  planas.forEach((o, i) => {
    lista.appendChild(crearEl('button', {
      type: 'button',
      class: 'sel-rueda__item',
      'data-idx': String(i),
      style: { height: `${ALTURA_ITEM}px` },
      onClick: (e) => { e.preventDefault(); seleccionar(i); },
    }, [o.label]));
  });

  const wrap = crearEl('div', {
    class: 'sel-rueda',
    style: { height: `${alto}px` },
  }, [
    crearEl('div', { class: 'sel-rueda__highlight', style: { height: `${ALTURA_ITEM}px` } }),
    lista,
    etiqueta && crearEl('div', { class: 'sel-rueda__lbl' }, [etiqueta]),
  ]);

  // El padding superior/inferior centra el primero y el último.
  const padding = (alto - ALTURA_ITEM) / 2;
  lista.style.paddingBlock = `${padding}px`;

  const seleccionar = (i, sincronizarScroll = true) => {
    if (i < 0 || i >= planas.length) return;
    idxSel = i;
    lista.querySelectorAll('.sel-rueda__item').forEach((n, k) => {
      n.classList.toggle('sel-rueda__item--sel', k === i);
    });
    if (sincronizarScroll) {
      lista.scrollTo({ top: i * ALTURA_ITEM, behavior: 'smooth' });
    }
    onChange && onChange(planas[i].value, planas[i]);
  };

  // Snap al ítem más cercano al detener el scroll.
  let scrollTimer;
  lista.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const idx = Math.round(lista.scrollTop / ALTURA_ITEM);
      seleccionar(idx, false);
      lista.scrollTo({ top: idx * ALTURA_ITEM, behavior: 'smooth' });
    }, 100);
  });

  // Posición inicial — sin animación.
  requestAnimationFrame(() => {
    lista.scrollTop = idxSel * ALTURA_ITEM;
    seleccionar(idxSel, false);
  });

  return wrap;
};

// ===========================================================================
//  8 · SelectAsync  —  busca con servidor (debounce) — para datasets enormes
//      `cargar(query)` debe devolver una Promise<opcion[]>.
// ===========================================================================
export const SelectAsync = ({
  cargar,                        // async (query) => opcion[]
  value, onChange, placeholder = 'Buscar…',
  debounceMs = 280,
  vacio = 'Empieza a tipear para buscar…',
  deshabilitado, valido, invalido,
} = {}) => {
  let valorActual = value || null;
  let panelRef = null;
  let inputRef = null;
  let wrapRef = null;
  let timer;
  let ultimaQuery = '';

  const setValor = (opcion) => {
    valorActual = opcion;
    if (inputRef) inputRef.value = opcion ? opcion.label : '';
    cerrarPopoverActivo();
    onChange && onChange(opcion ? opcion.value : null, opcion);
  };

  const buscar = async (q) => {
    if (!panelRef) return;
    ultimaQuery = q;
    const lista = panelRef.querySelector('.sel-lista');
    if (!q.trim()) {
      lista.replaceChildren(crearEl('div', { class: 'sel-vacio' }, [vacio]));
      return;
    }
    lista.replaceChildren(crearEl('div', { class: 'sel-vacio sel-vacio--cargando' }, [
      crearEl('span', { class: 'sel-spinner' }), 'Buscando…',
    ]));
    try {
      const resultado = await cargar(q);
      // Solo aplica si la query sigue siendo la actual (ignora respuestas viejas).
      if (q !== ultimaQuery || !panelRef) return;
      lista.replaceChildren();
      if (!resultado || resultado.length === 0) {
        lista.appendChild(crearEl('div', { class: 'sel-vacio' }, ['Sin resultados']));
        return;
      }
      let primeraActiva = true;
      resultado.map(normalizarOpcion).forEach((o) => {
        lista.appendChild(crearFila({
          opcion: o,
          seleccionado: valorActual && valorActual.value === o.value,
          activa: primeraActiva,
          mostrarCheck: true,
          filtro: q,
          onSelect: setValor,
        }));
        primeraActiva = false;
      });
    } catch (err) {
      lista.replaceChildren(crearEl('div', { class: 'sel-vacio sel-vacio--error' }, ['Error al cargar — intenta de nuevo']));
    }
  };

  const abrir = () => {
    if (panelRef) return;
    panelRef = crearEl('div', { class: 'picker-panel__contenido sel-panel sel-panel--combobox' }, [
      crearEl('div', { class: 'sel-lista' }, [
        crearEl('div', { class: 'sel-vacio' }, [vacio]),
      ]),
    ]);
    abrirPanel({ ancla: wrapRef, contenido: panelRef, onCerrar: () => { panelRef = null; clearTimeout(timer); } });
    if (inputRef && inputRef.value.trim()) buscar(inputRef.value);
  };

  inputRef = crearEl('input', {
    type: 'text',
    class: ['input', valido && 'input--valido', invalido && 'input--invalido'],
    placeholder,
    value: valorActual ? valorActual.label : '',
    disabled: deshabilitado || null,
    autocomplete: 'off',
    onFocus: abrir,
    onInput: (e) => {
      if (!panelRef) abrir();
      clearTimeout(timer);
      const q = e.target.value;
      timer = setTimeout(() => buscar(q), debounceMs);
    },
  });

  const chev = crearEl('span', {
    class: 'picker-trigger__icono',
    onMouseDown: (e) => {
      e.preventDefault();
      if (panelRef) cerrarPopoverActivo();
      else { inputRef.focus(); abrir(); }
    },
  }, [Icono('chevron_d', { tamano: 14 })]);

  wrapRef = crearEl('div', { class: 'picker-trigger sel-combobox' }, [inputRef, chev]);
  return wrapRef;
};

// ===========================================================================
//  9 · SelectTags  —  input que convierte texto en tags (Enter / coma)
// ===========================================================================
export const SelectTags = ({
  value = [],                   // string[]
  onChange, placeholder = 'Tipea y presiona Enter…',
  sugerencias = [],             // opciones que se muestran al focusear (autocomplete)
  max,
  deshabilitado, valido, invalido,
} = {}) => {
  let tags = [...value];
  let panelRef = null;
  let inputRef = null;
  let chipsRef = null;
  let wrapRef = null;

  const emitir = () => onChange && onChange([...tags]);

  const renderChips = () => {
    if (!chipsRef) return;
    chipsRef.replaceChildren();
    tags.forEach((t, i) => {
      chipsRef.appendChild(crearEl('span', { class: 'sel-chip' }, [
        t,
        crearEl('button', {
          type: 'button',
          class: 'sel-chip__x',
          'aria-label': `Quitar ${t}`,
          onClick: (e) => {
            e.preventDefault(); e.stopPropagation();
            tags.splice(i, 1);
            renderChips(); emitir();
          },
        }, [Icono('cerrar', { tamano: 10 })]),
      ]));
    });
    if (chipsRef.lastChild !== inputRef) chipsRef.appendChild(inputRef);
  };

  const agregarTag = (raw) => {
    const t = raw.trim();
    if (!t) return;
    if (tags.includes(t)) return;
    if (max && tags.length >= max) return;
    tags.push(t);
    inputRef.value = '';
    renderChips(); emitir();
    if (panelRef) renderSugerencias('');
  };

  const renderSugerencias = (filtro) => {
    if (!panelRef) return;
    const lista = panelRef.querySelector('.sel-lista');
    lista.replaceChildren();
    const planas = aplanar(sugerencias);
    const q = filtro.trim().toLowerCase();
    const disponibles = planas.filter((o) => !tags.includes(o.label) && (!q || o.label.toLowerCase().includes(q)));
    if (disponibles.length === 0) return; // sin sugerencias → no mostramos panel vacío
    disponibles.forEach((o, i) => {
      lista.appendChild(crearFila({
        opcion: o,
        activa: i === 0,
        mostrarCheck: false,
        filtro: q,
        onSelect: (op) => agregarTag(op.label),
      }));
    });
  };

  const abrir = () => {
    if (panelRef || sugerencias.length === 0) return;
    panelRef = crearEl('div', { class: 'picker-panel__contenido sel-panel sel-panel--combobox' }, [
      crearEl('div', { class: 'sel-lista' }),
    ]);
    renderSugerencias(inputRef.value);
    abrirPanel({ ancla: wrapRef, contenido: panelRef, onCerrar: () => { panelRef = null; } });
  };

  inputRef = crearEl('input', {
    type: 'text',
    class: 'sel-tags__input',
    placeholder: tags.length === 0 ? placeholder : '',
    disabled: deshabilitado || null,
    onFocus: () => sugerencias.length && abrir(),
    onInput: (e) => {
      if (panelRef) renderSugerencias(e.target.value);
      else if (sugerencias.length) abrir();
    },
    onKeyDown: (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        agregarTag(inputRef.value);
      } else if (e.key === 'Backspace' && !inputRef.value && tags.length) {
        tags.pop(); renderChips(); emitir();
      }
    },
    onBlur: () => {
      // Confirma el tag al perder el foco si el usuario tipeó algo.
      if (inputRef.value.trim()) agregarTag(inputRef.value);
    },
  });

  wrapRef = crearEl('div', {
    class: ['sel-trigger', 'sel-trigger--multi', 'sel-tags', valido && 'sel-trigger--valido', invalido && 'sel-trigger--invalido', deshabilitado && 'sel-trigger--desh'],
    onClick: (e) => {
      // Click en el wrap (no en chip ni en x) enfoca el input.
      if (e.target.closest('.sel-chip')) return;
      inputRef.focus();
    },
  }, [
    crearEl('div', { class: 'sel-trigger__chips', ref: (n) => { chipsRef = n; } }),
  ]);
  renderChips();
  return wrapRef;
};

// ===========================================================================
//  10 · SelectAccion  —  botón con menú desplegable (Export → JSON/CSV/PDF)
// ===========================================================================
export const SelectAccion = ({
  etiqueta = 'Acciones', opciones = [], value, icono, onChange,
  variante = 'ghost',  // 'ghost' | 'outline' | 'primary'
  tamano = 'md',       // 'sm' | 'md'
} = {}) => {
  const planas = aplanar(opciones);
  let valorActual = value !== undefined ? planas.find((o) => o.value === value) : null;
  let panelRef = null;
  let triggerRef = null;
  let lblRef = null;

  const setValor = (opcion) => {
    valorActual = opcion;
    if (lblRef) lblRef.textContent = opcion ? opcion.label : etiqueta;
    cerrarPopoverActivo();
    onChange && onChange(opcion ? opcion.value : null, opcion);
  };

  const renderLista = () => {
    if (!panelRef) return;
    const lista = panelRef.querySelector('.sel-lista');
    lista.replaceChildren();
    let primeraActiva = true;
    planas.forEach((o) => {
      lista.appendChild(crearFila({
        opcion: o,
        seleccionado: valorActual && valorActual.value === o.value,
        activa: primeraActiva,
        mostrarCheck: true,
        filtro: '',
        onSelect: setValor,
      }));
      primeraActiva = false;
    });
  };

  const abrir = () => {
    panelRef = crearEl('div', { class: 'picker-panel__contenido sel-panel sel-panel--accion' }, [
      crearEl('div', { class: 'sel-lista' }),
    ]);
    renderLista();
    abrirPanel({ ancla: triggerRef, contenido: panelRef, onCerrar: () => { panelRef = null; } });
  };

  triggerRef = crearEl('button', {
    type: 'button',
    class: ['sel-accion', `sel-accion--${variante}`, `sel-accion--${tamano}`],
    onClick: (e) => { e.preventDefault(); panelRef ? cerrarPopoverActivo() : abrir(); },
  }, [
    icono && crearEl('span', { class: 'sel-accion__icono' }, [icono]),
    crearEl('span', {
      class: 'sel-accion__lbl',
      ref: (n) => { lblRef = n; },
    }, [valorActual ? valorActual.label : etiqueta]),
    Icono('chevron_d', { tamano: 12, clase: 'sel-accion__chev' }),
  ]);
  return triggerRef;
};
