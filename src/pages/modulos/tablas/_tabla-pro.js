/**
 * TablaPro — tabla profesional production-ready estilo TanStack / shadcn.
 *
 * Features:
 *   - Búsqueda en vivo
 *   - Filtros multi-select con dropdown + counts
 *   - Sorting click-on-header con flechas asc/desc
 *   - Bulk select con toolbar flotante compacta + acciones
 *   - Kebab menu (•••) por fila con acciones individuales
 *   - Column visibility toggle (View dropdown)
 *   - Paginación con page-size selector (10/15/20/50/100)
 *   - "Page X of Y" + first/prev/next/last buttons
 *   - La selección persiste entre páginas
 *
 *   TablaPro({
 *     filas,
 *     columnas: [
 *       { id, etiqueta, render?, sortable?, align?, oculta? }
 *     ],
 *     claveID: 'id',
 *     pageSize: 10,
 *     pageSizes: [10, 15, 20, 50, 100],
 *     conSearch: true,
 *     searchPlaceholder: 'Buscar…',
 *     filtros: [
 *       { id, label, opciones: [{ value, label, count? }] }
 *     ],
 *     accionesBulk: [{ id, label, icono, peligrosa?, onClick }],
 *     accionesFila: [{ id, label, icono, peligrosa?, atajo?, onClick }],
 *   })
 */
import { crearEl, alClickFuera } from '../../../utils/helpers/dom.js';
import { senal, efecto, calculado } from '../../../utils/helpers/reactive.js';
import { Icono } from '../../../components/ui/icon/icons.js';

// ============================================================================
//  POPOVER MANAGER global — solo un popover abierto a la vez en toda la página
//  + cierre con scroll, resize, Escape key.
// ============================================================================
let cerrarPopoverActivo = null;

const registrarPopover = (cerrarFn) => {
  // Si hay otro popover abierto, ciérralo antes
  if (cerrarPopoverActivo && cerrarPopoverActivo !== cerrarFn) {
    cerrarPopoverActivo();
  }
  cerrarPopoverActivo = cerrarFn;
};

const desregistrarPopover = (cerrarFn) => {
  if (cerrarPopoverActivo === cerrarFn) cerrarPopoverActivo = null;
};

// Listeners globales — se montan una sola vez
if (typeof window !== 'undefined' && !window.__tproPopoverInited) {
  window.__tproPopoverInited = true;
  // Resize: reposicionar es complejo, mejor cerrar
  window.addEventListener('resize', () => {
    cerrarPopoverActivo?.();
  });
  // Escape para cerrar
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrarPopoverActivo?.();
  });
  // No cerramos en scroll: los popovers usan position absolute con coords de
  // PÁGINA (no viewport) → scrollean naturalmente pegados a su trigger.
}

export const TablaPro = ({
  filas,
  columnas,
  claveID = 'id',
  pageSize = 10,
  pageSizes = [10, 15, 20, 50, 100],
  conSearch = true,
  searchPlaceholder = 'Buscar…',
  conColumnToggle = true,
  conBulkSelect = true,
  filtros = [],
  accionesBulk = [],
  accionesFila = [],
} = {}) => {
  const busqueda          = senal('');
  const ordenCol          = senal(null);
  const ordenDir          = senal('asc');
  const filtrosActivos    = senal({});                  // { filtroId: Set(values) }
  const seleccionados     = senal(new Set());
  const paginaActual      = senal(1);
  const tamanoPagina      = senal(pageSize);
  const colsOcultas       = senal(new Set(columnas.filter((c) => c.oculta).map((c) => c.id)));

  // ====================================================================
  //  DATOS DERIVADOS
  // ====================================================================
  const colsVisibles = calculado(() => columnas.filter((c) => !colsOcultas.value.has(c.id)));

  const filasFiltradas = calculado(() => {
    let out = filas;
    const q = busqueda.value.toLowerCase().trim();
    if (q) {
      out = out.filter((f) => Object.values(f).some((v) => String(v).toLowerCase().includes(q)));
    }
    Object.entries(filtrosActivos.value).forEach(([fid, valores]) => {
      if (!valores || valores.size === 0) return;
      out = out.filter((f) => valores.has(f[fid]));
    });
    if (ordenCol.value) {
      const dir = ordenDir.value === 'asc' ? 1 : -1;
      out = [...out].sort((a, b) => {
        const va = a[ordenCol.value], vb = b[ordenCol.value];
        if (va == null) return 1;
        if (vb == null) return -1;
        if (va < vb) return -dir;
        if (va > vb) return dir;
        return 0;
      });
    }
    return out;
  });

  const totalPaginas = calculado(() => Math.max(1, Math.ceil(filasFiltradas.value.length / tamanoPagina.value)));
  const filasPagina = calculado(() => {
    const p = Math.min(paginaActual.value, totalPaginas.value);
    if (paginaActual.peek() !== p) paginaActual.value = p;
    const desde = (p - 1) * tamanoPagina.value;
    return filasFiltradas.value.slice(desde, desde + tamanoPagina.value);
  });

  // ====================================================================
  //  HEADER: search + filtros + view
  // ====================================================================
  const head = crearEl('div', { class: 'tpro__head' });

  if (conSearch) {
    const input = crearEl('input', {
      type: 'search',
      placeholder: searchPlaceholder,
      onInput: (e) => { busqueda.value = e.currentTarget.value; paginaActual.value = 1; },
    });
    head.appendChild(crearEl('div', { class: 'tpro__search' }, [input]));
  }

  // Filter chips con dropdown
  filtros.forEach((f) => {
    const wrap = crearEl('div', { style: { position: 'relative' } });
    const chip = crearEl('button', { class: 'tpro__filtro-chip' });
    let dropdown = null;
    let cerrarFn = null;

    const renderChip = () => {
      const seleccion = filtrosActivos.value[f.id] || new Set();
      chip.innerHTML = '';
      const tieneSel = seleccion.size > 0;
      chip.dataset.activo = String(tieneSel);
      chip.appendChild(Icono(tieneSel ? 'check' : 'mas', { tamano: 13 }));
      chip.appendChild(crearEl('span', null, [f.label]));
      if (tieneSel) {
        const pills = crearEl('span', { class: 'tpro__filtro-chip__pills' });
        if (seleccion.size <= 2) {
          [...seleccion].forEach((v) => {
            const opt = f.opciones.find((o) => o.value === v);
            pills.appendChild(crearEl('span', { class: 'tpro__filtro-chip__pill' }, [opt?.label || v]));
          });
        } else {
          pills.appendChild(crearEl('span', { class: 'tpro__filtro-chip__pill' }, [`${seleccion.size} seleccionados`]));
        }
        chip.appendChild(pills);
      }
    };

    const abrirDropdown = () => {
      if (dropdown) return;
      dropdown = crearEl('div', { class: 'tpro__dropdown' });

      // Search input dentro del dropdown
      const buscadorOpts = senal('');
      const inputBusqueda = crearEl('input', {
        type: 'search',
        placeholder: f.label,
        class: 'tpro__dropdown-search',
        onClick: (e) => e.stopPropagation(),
        onInput: (e) => { buscadorOpts.value = e.currentTarget.value.toLowerCase(); },
      });
      dropdown.appendChild(crearEl('div', { class: 'tpro__dropdown-search-wrap' }, [
        Icono('busqueda', { tamano: 12 }),
        inputBusqueda,
      ]));

      const listaItems = crearEl('div', { class: 'tpro__dropdown-list' });
      dropdown.appendChild(listaItems);

      const renderItems = () => {
        const q = buscadorOpts.value;
        const seleccion = filtrosActivos.peek()[f.id] || new Set();
        const opcionesFiltradas = q ? f.opciones.filter((o) => o.label.toLowerCase().includes(q)) : f.opciones;
        listaItems.replaceChildren(
          ...(opcionesFiltradas.length === 0
            ? [crearEl('div', { style: { padding: '12px', textAlign: 'center', color: 'var(--muted-foreground)', fontSize: '12px' } }, ['Sin coincidencias'])]
            : opcionesFiltradas.map((opt) => {
                const item = crearEl('button', {
                  class: 'tpro__dropdown-item',
                  'data-activo': String(seleccion.has(opt.value)),
                  onClick: (e) => {
                    e.stopPropagation();
                    const sel = new Set(filtrosActivos.peek()[f.id] || []);
                    if (sel.has(opt.value)) sel.delete(opt.value);
                    else sel.add(opt.value);
                    filtrosActivos.value = { ...filtrosActivos.peek(), [f.id]: sel };
                    paginaActual.value = 1;
                    item.dataset.activo = String(sel.has(opt.value));
                    item.querySelector('.tpro__dropdown-item__check').replaceChildren(...(sel.has(opt.value) ? [Icono('check', { tamano: 10 })] : []));
                    renderChip();
                  },
                }, [
                  crearEl('span', { class: 'tpro__dropdown-item__check' }, [seleccion.has(opt.value) ? Icono('check', { tamano: 10 }) : null]),
                  opt.icono && crearEl('span', { style: { color: 'var(--muted-foreground)', display: 'inline-flex' } }, [Icono(opt.icono, { tamano: 13 })]),
                  crearEl('span', { style: { flex: 1, textAlign: 'start' } }, [opt.label]),
                  opt.count != null && crearEl('span', { class: 'tpro__dropdown-item__count' }, [String(opt.count)]),
                ]);
                return item;
              })),
        );
      };
      efecto(renderItems);

      // Limpiar (siempre visible cuando hay selección)
      const renderLimpiar = () => {
        const ya = dropdown.querySelector('.tpro__dropdown-divider');
        if (ya) ya.remove();
        const yaB = dropdown.querySelector('.tpro__dropdown-clear');
        if (yaB) yaB.remove();
        const seleccion = filtrosActivos.peek()[f.id] || new Set();
        if (seleccion.size === 0) return;
        dropdown.appendChild(crearEl('div', { class: 'tpro__dropdown-divider' }));
        dropdown.appendChild(crearEl('button', {
          class: 'tpro__dropdown-item tpro__dropdown-clear',
          style: { justifyContent: 'center', color: 'var(--muted-foreground)' },
          onClick: (e) => {
            e.stopPropagation();
            const f0 = { ...filtrosActivos.peek() };
            delete f0[f.id];
            filtrosActivos.value = f0;
            renderChip();
            cerrar();
          },
        }, ['Limpiar filtro']));
      };
      renderLimpiar();
      efecto(() => { filtrosActivos.value; renderLimpiar(); });

      wrap.appendChild(dropdown);
      setTimeout(() => inputBusqueda.focus(), 50);
      cerrarFn = alClickFuera(wrap, () => cerrar());
    };

    const cerrar = () => {
      if (!dropdown) return;
      dropdown.remove();
      dropdown = null;
      cerrarFn?.();
      cerrarFn = null;
      desregistrarPopover(cerrar);
    };

    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      if (dropdown) cerrar();
      else {
        registrarPopover(cerrar);
        abrirDropdown();
      }
    });

    wrap.appendChild(chip);
    head.appendChild(wrap);
    renderChip();
  });

  // Botón "View" — column toggle
  if (conColumnToggle) {
    const wrap = crearEl('div', { style: { position: 'relative', marginInlineStart: 'auto' } });
    const btn = crearEl('button', { class: 'tpro__view-btn' }, [
      Icono('panel_l', { tamano: 14 }),
      'Columnas',
    ]);
    let dropdown = null;
    let cerrarFn = null;
    const cerrar = () => {
      if (!dropdown) return;
      dropdown.remove();
      dropdown = null;
      cerrarFn?.();
      cerrarFn = null;
      desregistrarPopover(cerrar);
    };
    const abrir = () => {
      if (dropdown) return;
      registrarPopover(cerrar);
      dropdown = crearEl('div', { class: 'tpro__dropdown', style: { insetInlineStart: 'auto', insetInlineEnd: 0, minWidth: '180px' } });
      dropdown.appendChild(crearEl('div', {
        style: { padding: '6px 10px 8px', fontSize: '11px', fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' },
      }, ['Mostrar / Ocultar columnas']));
      columnas.forEach((c) => {
        if (c.id === '_select' || c.id === '_acciones') return;
        const oculta = colsOcultas.peek().has(c.id);
        const item = crearEl('button', {
          class: 'tpro__dropdown-item',
          'data-activo': String(!oculta),
          onClick: (e) => {
            e.stopPropagation();
            const cs = new Set(colsOcultas.peek());
            if (cs.has(c.id)) cs.delete(c.id); else cs.add(c.id);
            colsOcultas.value = cs;
            item.dataset.activo = String(!cs.has(c.id));
            const checkEl = item.querySelector('.tpro__dropdown-item__check');
            checkEl.replaceChildren(...(cs.has(c.id) ? [] : [Icono('check', { tamano: 10 })]));
          },
        }, [
          crearEl('span', { class: 'tpro__dropdown-item__check' }, [oculta ? null : Icono('check', { tamano: 10 })]),
          c.etiqueta,
        ]);
        dropdown.appendChild(item);
      });
      wrap.appendChild(dropdown);
      cerrarFn = alClickFuera(wrap, cerrar);
    };
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (dropdown) cerrar(); else abrir();
    });
    wrap.appendChild(btn);
    head.appendChild(wrap);
  }

  // ====================================================================
  //  TABLA
  // ====================================================================
  const wrapper = crearEl('div', { class: 'table-wrapper', style: { position: 'relative' } });
  const tabla = crearEl('table', { class: 'table' });
  const thead = crearEl('thead');
  const tbody = crearEl('tbody');
  tabla.appendChild(thead);
  tabla.appendChild(tbody);
  wrapper.appendChild(tabla);

  // Master checkbox
  const masterCheck = crearEl('input', {
    type: 'checkbox', class: 'tabla-check',
    onClick: () => {
      const idsPag = filasPagina.peek().map((f) => f[claveID]);
      const sel = new Set(seleccionados.peek());
      const todos = idsPag.length > 0 && idsPag.every((id) => sel.has(id));
      if (todos) idsPag.forEach((id) => sel.delete(id));
      else idsPag.forEach((id) => sel.add(id));
      seleccionados.value = sel;
    },
  });

  // Render header
  const renderHeader = () => {
    const cols = colsVisibles.value;
    thead.replaceChildren(crearEl('tr', null, [
      conBulkSelect && crearEl('th', { style: { width: '36px' } }, [masterCheck]),
      ...cols.map((c) => {
        if (c.sortable !== false && c.id !== '_acciones') {
          const orden = ordenCol.value === c.id ? ordenDir.value : null;
          const iconoOrden = orden === 'asc'
            ? Icono('chevron_u', { tamano: 14 })
            : orden === 'desc'
              ? Icono('chevron_d', { tamano: 14 })
              : Icono('chevron_v', { tamano: 14 });
          const lbl = crearEl('span', { class: 'tpro__th-sort' }, [
            c.etiqueta,
            crearEl('span', { class: 'tpro__th-sort-arrows' }, [iconoOrden]),
          ]);
          if (orden) lbl.dataset.orden = orden;
          return crearEl('th', {
            scope: 'col',
            style: c.thStyle,
            onClick: () => {
              if (ordenCol.peek() === c.id) {
                ordenDir.value = ordenDir.peek() === 'asc' ? 'desc' : 'asc';
              } else {
                ordenCol.value = c.id;
                ordenDir.value = 'asc';
              }
            },
          }, [lbl]);
        }
        return crearEl('th', { scope: 'col', style: c.thStyle }, [c.etiqueta]);
      }),
      accionesFila.length > 0 && crearEl('th', { style: { width: '40px' } }),
    ]));
  };
  efecto(renderHeader);

  // Master indeterminate
  efecto(() => {
    const idsPag = filasPagina.value.map((f) => f[claveID]);
    const sel = seleccionados.value;
    const todos = idsPag.length > 0 && idsPag.every((id) => sel.has(id));
    const algunos = idsPag.some((id) => sel.has(id));
    masterCheck.checked = todos;
    masterCheck.indeterminate = !todos && algunos;
  });

  // Render tbody
  efecto(() => {
    const cols = colsVisibles.value;
    const pag = filasPagina.value;
    const sel = seleccionados.value;
    if (pag.length === 0) {
      tbody.replaceChildren(crearEl('tr', null, [
        crearEl('td', { colspan: cols.length + (conBulkSelect ? 1 : 0) + (accionesFila.length > 0 ? 1 : 0), style: { padding: 'var(--space-6)', textAlign: 'center', color: 'var(--muted-foreground)' } }, [
          'Sin resultados.',
        ]),
      ]));
      return;
    }
    tbody.replaceChildren(...pag.map((fila) => {
      const id = fila[claveID];
      const seleccionada = sel.has(id);
      const tr = crearEl('tr', { class: seleccionada ? 'row--seleccionada' : '' });

      if (conBulkSelect) {
        const ck = crearEl('input', {
          type: 'checkbox', class: 'tabla-check',
          onClick: (e) => {
            e.stopPropagation();
            const s = new Set(seleccionados.peek());
            if (s.has(id)) s.delete(id); else s.add(id);
            seleccionados.value = s;
          },
        });
        ck.checked = seleccionada;
        tr.appendChild(crearEl('td', null, [ck]));
      }

      cols.forEach((c) => {
        const td = crearEl('td', { style: c.tdStyle }, [c.render ? c.render(fila) : fila[c.id]]);
        tr.appendChild(td);
      });

      if (accionesFila.length > 0) {
        const kebab = crearEl('button', {
          class: 'tpro__kebab',
          'aria-label': 'Más acciones',
          onClick: (e) => {
            e.stopPropagation();
            abrirKebabMenu(e.currentTarget, fila);
          },
        }, [crearEl('span', { style: { fontSize: '18px', lineHeight: 1, fontWeight: 700 } }, ['⋯'])]);
        tr.appendChild(crearEl('td', null, [kebab]));
      }

      return tr;
    }));
  });

  // ====================================================================
  //  KEBAB MENU
  // ====================================================================
  let kebabMenu = null;
  let cerrarKebabFn = null;
  const cerrarKebab = () => {
    if (!kebabMenu) return;
    kebabMenu.remove();
    kebabMenu = null;
    cerrarKebabFn?.();
    cerrarKebabFn = null;
    desregistrarPopover(cerrarKebab);
  };
  const abrirKebabMenu = (boton, fila) => {
    cerrarKebab();
    registrarPopover(cerrarKebab);
    const rect = boton.getBoundingClientRect();
    // Coords de PÁGINA (suma scrollY/scrollX) → el menú scrollea con la página
    const pageTop  = rect.top    + window.scrollY;
    const pageBot  = rect.bottom + window.scrollY;
    const pageLeft = rect.left   + window.scrollX;
    const pageRight = rect.right + window.scrollX;
    // Si el menú se sale por debajo del viewport, mostrarlo arriba del botón
    const menuAlto = Math.min(accionesFila.length * 36 + 8, 320);
    const espacioAbajo = window.innerHeight - rect.bottom;
    const arriba = espacioAbajo < menuAlto + 16;
    kebabMenu = crearEl('div', {
      class: 'tpro__kebab-menu',
      style: arriba
        ? { position: 'absolute', top: `${pageTop - menuAlto - 4}px`, left: `${pageRight - 180}px` }
        : { position: 'absolute', top: `${pageBot + 4}px`,            left: `${pageRight - 180}px` },
    }, accionesFila.map((a) => crearEl('button', {
      class: ['tpro__kebab-item', a.peligrosa && 'danger'],
      onClick: (e) => {
        e.stopPropagation();
        a.onClick?.(fila);
        cerrarKebab();
      },
    }, [
      a.icono && crearEl('span', { class: 'tpro__kebab-item__icono' }, [Icono(a.icono, { tamano: 14 })]),
      a.label,
      a.atajo && crearEl('span', { class: 'tpro__kebab-item__atajo' }, [a.atajo]),
    ])));
    document.body.appendChild(kebabMenu);
    cerrarKebabFn = alClickFuera(kebabMenu, cerrarKebab);
  };

  // ====================================================================
  //  BULK FLOATING TOOLBAR (se appendea al .tpro container más abajo)
  // ====================================================================
  let barraBulk = null;
  if (conBulkSelect && accionesBulk.length > 0) {
    barraBulk = crearEl('div', { class: 'tpro__bulk-floating' }, [
      crearEl('button', {
        class: 'tpro__bulk-floating__cerrar',
        'data-tooltip': 'Limpiar selección',
        'data-tooltip-placement': 'top',
        onClick: () => { seleccionados.value = new Set(); },
      }, [Icono('cerrar', { tamano: 14 })]),
      crearEl('div', { class: 'tpro__bulk-floating__count' }, [
        crearEl('span', { class: 'tpro__bulk-floating__count-badge bulk-count' }),
        crearEl('span', { class: 'bulk-label' }, ['seleccionados']),
      ]),
      crearEl('div', { class: 'tpro__bulk-floating__divider' }),
      ...accionesBulk.map((a) => crearEl('button', {
        class: ['tpro__bulk-floating__btn', a.peligrosa && 'danger'],
        'data-tooltip': a.label,
        'data-tooltip-placement': 'top',
        onClick: () => {
          const seleccion = filas.filter((f) => seleccionados.peek().has(f[claveID]));
          a.onClick?.(seleccion, () => { seleccionados.value = new Set(); });
        },
      }, [a.icono && Icono(a.icono, { tamano: 14 })])),
    ]);
    efecto(() => {
      const n = seleccionados.value.size;
      barraBulk.dataset.visible = String(n > 0);
      const badge = barraBulk.querySelector('.bulk-count');
      const lbl = barraBulk.querySelector('.bulk-label');
      if (badge) badge.textContent = String(n);
      if (lbl) lbl.textContent = n === 1 ? 'seleccionado' : 'seleccionados';
    });
  }

  // ====================================================================
  //  FOOTER:
  //    Izquierda: [10 ▼ Filas por página]
  //    Derecha:   [Página X de Y]  [« ‹ 1 2 3 › »]
  // ====================================================================
  const footer = crearEl('div', { class: 'tpro__footer' });

  // === IZQUIERDA: page-size selector ===
  const footerIzq = crearEl('div', { class: 'tpro__footer-grupo' });
  const sel = crearEl('select', {
    class: 'tpro__page-select',
    onChange: (e) => {
      tamanoPagina.value = parseInt(e.currentTarget.value, 10);
      paginaActual.value = 1;
    },
  }, pageSizes.map((n) => crearEl('option', { value: n, selected: n === pageSize }, [String(n)])));
  footerIzq.appendChild(sel);
  footerIzq.appendChild(crearEl('span', null, ['Filas por página']));
  footer.appendChild(footerIzq);

  // === DERECHA: Página X de Y · pagination buttons agrupados ===
  const footerDer = crearEl('div', { class: 'tpro__footer-derecha' });

  const lblPagina = crearEl('span');
  efecto(() => {
    lblPagina.textContent = `Página ${paginaActual.value} de ${totalPaginas.value}`;
  });
  footerDer.appendChild(lblPagina);

  const grupoPaginacion = crearEl('div', { class: 'tpro__footer-grupo' });
  const btnPrimera   = crearEl('button', { class: 'pag-btn', 'aria-label': 'Primera página', onClick: () => paginaActual.value = 1 }, ['«']);
  const btnAnterior  = crearEl('button', { class: 'pag-btn', 'aria-label': 'Anterior',       onClick: () => paginaActual.value = Math.max(1, paginaActual.peek() - 1) }, ['‹']);
  const btnSiguiente = crearEl('button', { class: 'pag-btn', 'aria-label': 'Siguiente',      onClick: () => paginaActual.value = Math.min(totalPaginas.peek(), paginaActual.peek() + 1) }, ['›']);
  const btnUltima    = crearEl('button', { class: 'pag-btn', 'aria-label': 'Última',          onClick: () => paginaActual.value = totalPaginas.peek() }, ['»']);
  grupoPaginacion.appendChild(btnPrimera);
  grupoPaginacion.appendChild(btnAnterior);
  // Ventana ±2 con elipsis
  const ventana = crearEl('div', { style: { display: 'inline-flex', gap: '4px' } });
  efecto(() => {
    const p = paginaActual.value, t = totalPaginas.value;
    const items = [];
    const start = Math.max(1, p - 2);
    const end = Math.min(t, p + 2);
    if (start > 1) { items.push(1); if (start > 2) items.push('…'); }
    for (let i = start; i <= end; i++) items.push(i);
    if (end < t) { if (end < t - 1) items.push('…'); items.push(t); }
    ventana.replaceChildren(...items.map((n) => n === '…'
      ? crearEl('span', { style: { width: '20px', textAlign: 'center', color: 'var(--muted-foreground)' } }, ['…'])
      : crearEl('button', { class: 'pag-btn', 'data-activo': String(n === p), onClick: () => paginaActual.value = n }, [String(n)])));
  });
  grupoPaginacion.appendChild(ventana);
  grupoPaginacion.appendChild(btnSiguiente);
  grupoPaginacion.appendChild(btnUltima);
  footerDer.appendChild(grupoPaginacion);

  footer.appendChild(footerDer);

  // Disable buttons en extremos
  efecto(() => {
    const p = paginaActual.value, t = totalPaginas.value;
    btnPrimera.disabled  = p === 1;
    btnAnterior.disabled = p === 1;
    btnSiguiente.disabled = p === t;
    btnUltima.disabled    = p === t;
  });

  return crearEl('div', { class: 'tpro' }, [head, wrapper, barraBulk, footer]);
};
