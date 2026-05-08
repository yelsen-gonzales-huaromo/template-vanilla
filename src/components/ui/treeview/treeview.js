/**
 * Vista de árbol — navegación jerárquica recursiva con nodos expandibles.
 *
 *   VistaArbol({
 *     items: [
 *       { id, etiqueta, items?: [...], icono?, color?, badge?, tipo?,
 *         disabled?, seleccionable?, alClick? }
 *     ],
 *     iniciales: ['src', 'components'],          // ids inicialmente abiertos
 *     seleccionado: senal('app'),                // selección reactiva opcional
 *     conChecks: false,                          // checkboxes multi-select
 *     marcados: senal(new Set()),                // ids marcados (con conChecks)
 *     filtro: senal(''),                         // texto de filtro reactivo
 *     icono: 'auto' | (item) => nodo,            // override del icono
 *   })
 *
 * Tipos auto-mapeados a iconos:
 *   'carpeta' (default si tiene items) · 'js' · 'css' · 'html' · 'json' · 'md'
 *   'pdf' · 'img' · 'video' · 'archivo' (default si no tiene items)
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';
import { Icono } from '../icon/icons.js';

// Mapeo tipo → { icono, color }
const TIPOS = {
  carpeta:  { icono: 'panel',       color: 'var(--color-warning)' },
  js:       { icono: 'utilidades',  color: '#f7df1e' },
  ts:       { icono: 'utilidades',  color: '#3178c6' },
  css:      { icono: 'paleta',      color: '#1572b6' },
  html:     { icono: 'pagina',      color: '#e34f26' },
  json:     { icono: 'utilidades',  color: '#a3a3a3' },
  md:       { icono: 'pagina',      color: '#a3a3a3' },
  pdf:      { icono: 'pagina',      color: '#ef4444' },
  img:      { icono: 'iconos',      color: '#8b5cf6' },
  video:    { icono: 'proyectos',   color: '#06b6d4' },
  archivo:  { icono: 'pagina',      color: 'var(--muted-foreground)' },
};

// Detecta tipo por extensión si no se pasa explícito
const detectarTipo = (item) => {
  if (item.tipo) return item.tipo;
  if (item.items?.length) return 'carpeta';
  const m = (item.etiqueta || '').match(/\.([a-z0-9]+)$/i);
  return TIPOS[m?.[1]?.toLowerCase()] ? m[1].toLowerCase() : 'archivo';
};

// Colecta todos los ids del árbol que matcheen un texto
const buscarIds = (items, texto, ascendientes = new Set()) => {
  const matches = new Set();
  const path = [];
  const recorrer = (lista, padres) => {
    for (const it of lista) {
      const match = it.etiqueta.toLowerCase().includes(texto);
      if (match) {
        matches.add(it.id);
        padres.forEach((p) => ascendientes.add(p));
      }
      if (it.items?.length) recorrer(it.items, [...padres, it.id]);
    }
  };
  recorrer(items, path);
  return { matches, ascendientes };
};

// Resaltar coincidencia
const highlight = (texto, q) => {
  if (!q) return [texto];
  const idx = texto.toLowerCase().indexOf(q.toLowerCase());
  if (idx < 0) return [texto];
  return [
    texto.slice(0, idx),
    crearEl('mark', { class: 'arbol__match' }, [texto.slice(idx, idx + q.length)]),
    texto.slice(idx + q.length),
  ];
};

// ============================================================================
//  Render recursivo
// ============================================================================
const renderItem = (item, ctx, nivel = 0) => {
  const tieneHijos = item.items?.length > 0;
  const tipo = detectarTipo(item);
  const tipoInfo = TIPOS[tipo] || TIPOS.archivo;

  const checkbox = ctx.conChecks
    ? crearEl('input', {
        type: 'checkbox',
        class: 'arbol__check',
        onClick: (e) => {
          e.stopPropagation();
          const s = new Set(ctx.marcados.value);
          if (e.currentTarget.checked) {
            s.add(item.id);
            const marcarDescendientes = (it) => {
              it.items?.forEach((c) => { s.add(c.id); marcarDescendientes(c); });
            };
            marcarDescendientes(item);
          } else {
            s.delete(item.id);
            const desmarcarDescendientes = (it) => {
              it.items?.forEach((c) => { s.delete(c.id); desmarcarDescendientes(c); });
            };
            desmarcarDescendientes(item);
          }
          ctx.marcados.value = s;
        },
      })
    : null;

  // Etiqueta — node mutable que se actualiza con el highlight cuando cambia el filtro
  const etiquetaNodo = crearEl('span', { class: 'arbol__etiqueta' }, [item.etiqueta]);

  const cabezal = crearEl('button', {
    type: 'button',
    class: ['arbol__cabezal', tieneHijos && 'arbol__cabezal--rama',
            item.disabled && 'arbol__cabezal--disabled'],
    style: { paddingInlineStart: `${0.5 + nivel * 1.1}rem` },
    'data-id': item.id,
    onClick: () => {
      if (item.disabled) return;
      if (tieneHijos) ctx.alternar(item.id);
      if (ctx.seleccionado && (item.seleccionable !== false)) {
        ctx.seleccionado.value = item.id;
      }
      item.alClick?.(item);
    },
  }, [
    tieneHijos
      ? crearEl('span', { class: 'arbol__caret' }, [Icono('chevron_r', { tamano: 12 })])
      : crearEl('span', { class: 'arbol__hueco' }),
    checkbox,
    crearEl('span', {
      class: 'arbol__icon',
      style: { color: item.color || tipoInfo.color },
    }, [item.icono || Icono(tipoInfo.icono, { tamano: 14 })]),
    etiquetaNodo,
    item.meta && crearEl('span', { class: 'arbol__meta' }, [item.meta]),
    item.badge && crearEl('span', { class: 'arbol__badge' }, [item.badge]),
  ]);

  // Sincronización del estado activo
  if (ctx.seleccionado) {
    efecto(() => {
      cabezal.dataset.activo = String(ctx.seleccionado.value === item.id);
    });
  }
  // Sync del checkbox con el set de marcados
  if (checkbox) {
    efecto(() => {
      checkbox.checked = ctx.marcados.value.has(item.id);
    });
  }
  // Highlight reactivo de la etiqueta cuando cambia el filtro
  if (ctx.filtro) {
    efecto(() => {
      const q = ctx.filtro.value?.trim() || '';
      etiquetaNodo.replaceChildren(...(q ? highlight(item.etiqueta, q) : [document.createTextNode(item.etiqueta)]));
    });
  }

  const liItem = crearEl('li', {
    class: ['arbol__item', tieneHijos && 'arbol__item--rama'],
  }, [cabezal, tieneHijos ? crearEl('ul', { class: 'arbol__sub' },
    item.items.map((c) => renderItem(c, ctx, nivel + 1))) : null]);

  // Visibilidad reactiva (filtro)
  if (ctx.filtro) {
    efecto(() => {
      const q = ctx.filtro.value?.trim() || '';
      const m = ctx.match.value;
      const visible = !q || m.matches.has(item.id) || m.ascendientes.has(item.id);
      liItem.classList.toggle('arbol__item--oculto', !visible);
    });
  }

  // Estado abierto/cerrado reactivo (suma filter auto-open)
  if (tieneHijos) {
    efecto(() => {
      let abierto = ctx.abiertos.value.has(item.id);
      if (ctx.filtro?.value) {
        const m = ctx.match.value;
        if (m.ascendientes.has(item.id)) abierto = true;
      }
      liItem.dataset.abierto = String(abierto);
    });
  }
  return liItem;
};

// ============================================================================
//  Componente principal
// ============================================================================
export const VistaArbol = ({
  items = [], iniciales = [],
  seleccionado, conChecks = false, marcados,
  filtro,
} = {}) => {
  const abiertos = senal(new Set(iniciales));
  const alternar = (id) => {
    const s = new Set(abiertos.value);
    s.has(id) ? s.delete(id) : s.add(id);
    abiertos.value = s;
  };

  const _marcados = marcados || (conChecks ? senal(new Set()) : null);

  // `match` es una senal — cada item se subscribe a ella en sus propios efectos.
  // Cuando cambia el filtro, recalculamos matches y SETEAMOS la senal una vez.
  // Esto NO entra en bucle porque el efecto de abajo NO lee match.value (sólo escribe).
  const match = senal({ matches: new Set(), ascendientes: new Set() });

  const ctx = { abiertos, alternar, seleccionado, conChecks, marcados: _marcados, filtro, match };

  if (filtro) {
    efecto(() => {
      const q = filtro.value?.toLowerCase().trim() || '';
      match.value = q
        ? buscarIds(items, q)
        : { matches: new Set(), ascendientes: new Set() };
    });
  }

  return crearEl('ul', { class: 'arbol' },
    items.map((it) => renderItem(it, ctx)));
};
