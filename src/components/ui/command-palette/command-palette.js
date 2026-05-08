import { crearEl } from '../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';
import { Icono } from '../icon/icons.js';
import { navegarA } from '../../../router/index.js';
import { RUTAS } from '../../../config/routes.config.js';
import { SECCIONES } from '../../../config/navigation.config.js';
import { t } from '../../../i18n/index.js';

/* =============================================================================
   Command Palette — modal centrado tipo Linear/GitHub/Vercel.
   Se abre con ⌘K / Ctrl+K o llamando ComandoPaleta.abrir().
   Lista los items del sidebar agrupados por sección con búsqueda en vivo y
   navegación por teclado (↑↓ Enter Esc). Click fuera o Esc para cerrar.
   ========================================================================== */

let _instancia = null;

/* Aplana SECCIONES → lista de items con grupo asociado. */
const aplanarItems = () => {
  const items = [];
  let grupoActual = '';
  for (const s of SECCIONES) {
    if (s.grupo) { grupoActual = t(s.grupo) || s.grupo; continue; }
    if (!s.items) continue;
    const seccionEtq = t(s.etiqueta) || s.etiqueta;
    for (const it of s.items) {
      items.push({
        etiqueta: t(it.etiqueta) || it.etiqueta,
        ruta: it.ruta,
        path: RUTAS[it.ruta],
        seccion: seccionEtq,
        grupo: grupoActual,
        icono: s.icono,
      });
    }
  }
  return items;
};

const filtrarItems = (items, q) => {
  const ql = q.trim().toLowerCase();
  if (!ql) return items;
  return items.filter(i =>
    i.etiqueta.toLowerCase().includes(ql) ||
    i.seccion.toLowerCase().includes(ql) ||
    i.grupo.toLowerCase().includes(ql)
  );
};

const construirInstancia = () => {
  const abierto = senal(false);
  const consulta = senal('');
  const indiceActivo = senal(0);
  const items = aplanarItems();

  // ---- Input de búsqueda ----
  const input = crearEl('input', {
    type: 'text',
    class: 'cmd-palette__input',
    placeholder: 'Escribe un comando o busca…',
    'aria-label': 'Buscar',
    onInput: (e) => {
      consulta.value = e.target.value;
      indiceActivo.value = 0;
    },
  });

  // ---- Botón cerrar ----
  const btnCerrar = crearEl('button', {
    type: 'button',
    class: 'cmd-palette__close',
    'aria-label': 'Cerrar',
    onClick: () => cerrar(),
  }, [Icono('cerrar', { tamano: 16 })]);

  // ---- Lista de resultados (host reactivo) ----
  const listaHost = crearEl('div', { class: 'cmd-palette__results scroll-discreto', role: 'listbox' });

  // ---- Estado vacío ----
  const vacio = crearEl('div', { class: 'cmd-palette__empty' }, [
    'Sin resultados.',
  ]);

  // Renderiza la lista filtrada agrupada por sección.
  const renderLista = () => {
    const filtrados = filtrarItems(items, consulta.value);
    if (filtrados.length === 0) {
      listaHost.replaceChildren(vacio);
      return;
    }
    // Agrupar por seccion preservando orden
    const grupos = new Map();
    filtrados.forEach((it, idx) => {
      const clave = it.grupo || it.seccion;
      if (!grupos.has(clave)) grupos.set(clave, []);
      grupos.get(clave).push({ ...it, idx });
    });

    const fragmentos = [];
    grupos.forEach((lista, etqGrupo) => {
      fragmentos.push(crearEl('div', { class: 'cmd-palette__group' }, [etqGrupo]));
      lista.forEach((it) => {
        const fila = crearEl('button', {
          type: 'button',
          class: 'cmd-palette__item',
          'data-idx': String(it.idx),
          'aria-selected': String(it.idx === indiceActivo.value),
          onClick: () => seleccionarItem(it),
          onMouseEnter: () => { indiceActivo.value = it.idx; },
        }, [
          crearEl('span', { class: 'cmd-palette__item-icon', 'aria-hidden': 'true' }, [
            Icono('chevron_r', { tamano: 14 }),
          ]),
          crearEl('span', { class: 'cmd-palette__item-text' }, [
            it.seccion !== it.etiqueta
              ? crearEl('span', { class: 'cmd-palette__item-section' }, [it.seccion, ' › '])
              : null,
            it.etiqueta,
          ]),
        ]);
        fragmentos.push(fila);
      });
    });
    listaHost.replaceChildren(...fragmentos);
  };

  efecto(renderLista);

  // ---- Selección de un item ----
  const seleccionarItem = (it) => {
    if (!it?.path) return;
    cerrar();
    navegarA(it.path);
  };

  // ---- Navegación por teclado dentro del input ----
  input.addEventListener('keydown', (e) => {
    const filtrados = filtrarItems(items, consulta.value);
    if (filtrados.length === 0) return;
    const total = filtrados.length;
    const indiceEnFiltrados = filtrados.findIndex(f => f.idx === indiceActivo.value);
    const cur = indiceEnFiltrados >= 0 ? indiceEnFiltrados : 0;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      indiceActivo.value = filtrados[(cur + 1) % total].idx;
      enfocarItemActivo();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      indiceActivo.value = filtrados[(cur - 1 + total) % total].idx;
      enfocarItemActivo();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      seleccionarItem(filtrados[cur]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cerrar();
    }
  });

  const enfocarItemActivo = () => {
    const el = listaHost.querySelector(`[data-idx="${indiceActivo.value}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  };

  // ---- Estructura DOM ----
  const palette = crearEl('div', { class: 'cmd-palette', role: 'dialog', 'aria-modal': 'true' }, [
    crearEl('header', { class: 'cmd-palette__head' }, [
      crearEl('span', { class: 'cmd-palette__head-icon', 'aria-hidden': 'true' }, [
        Icono('busqueda', { tamano: 16 }),
      ]),
      input,
      btnCerrar,
    ]),
    listaHost,
  ]);

  const backdrop = crearEl('div', {
    class: 'cmd-palette__backdrop scroll-discreto',
    onClick: (e) => { if (e.target === backdrop) cerrar(); },
  }, [palette]);

  // ---- Abrir / cerrar ----
  const abrir = () => {
    if (abierto.peek()) return;
    abierto.value = true;
    document.body.appendChild(backdrop);
    document.body.style.overflow = 'hidden';
    consulta.value = '';
    indiceActivo.value = 0;
    input.value = '';
    requestAnimationFrame(() => input.focus());
  };

  const cerrar = () => {
    if (!abierto.peek()) return;
    abierto.value = false;
    document.body.style.overflow = '';
    backdrop.remove();
  };

  return { abrir, cerrar, estaAbierto: () => abierto.peek() };
};

/* ----------------------------------------------------------------------------
   API pública + atajo global ⌘K / Ctrl+K (registrado una sola vez)
   -------------------------------------------------------------------------- */
const obtenerInstancia = () => {
  if (!_instancia) _instancia = construirInstancia();
  return _instancia;
};

let _atajoInstalado = false;
const instalarAtajoGlobal = () => {
  if (_atajoInstalado || typeof document === 'undefined') return;
  _atajoInstalado = true;
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      ComandoPaleta.alternar();
    }
  });
};
instalarAtajoGlobal();

export const ComandoPaleta = {
  abrir() { obtenerInstancia().abrir(); },
  cerrar() { _instancia?.cerrar(); },
  alternar() {
    const inst = obtenerInstancia();
    if (inst.estaAbierto()) inst.cerrar();
    else inst.abrir();
  },
};
