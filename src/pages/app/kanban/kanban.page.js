/**
 * Kanban — tablero profesional con DnD real, CRUD, detalle drawer, filtros,
 * stats y persistencia en localStorage. Inspirado en Linear / Trello / Notion.
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { estadoNotificaciones } from '../../../store/notifications.store.js';

import { Campo, Input, Textarea, Switch, Stack, Grid2 } from '../../modulos/forms/_compartido.js';
import { FloatingInput } from '../../modulos/forms/_floating.js';
import { DatePicker } from '../../modulos/forms/_pickers.js';
import { SelectModerno, SelectMulti, SelectSegmentado } from '../../modulos/forms/_select.js';

// ===========================================================================
//  Constantes y datos iniciales
// ===========================================================================
const STORAGE_KEY = 'template-vanilla:kanban:tablero';

const PRIORIDADES = [
  { value: 'critica', label: 'Crítica', color: '#ef4444' },
  { value: 'alta',    label: 'Alta',    color: '#f97316' },
  { value: 'media',   label: 'Media',   color: '#eab308' },
  { value: 'baja',    label: 'Baja',    color: '#10b981' },
];
const colorPrioridad = (p) => PRIORIDADES.find((x) => x.value === p)?.color || '#94a3b8';
const labelPrioridad = (p) => PRIORIDADES.find((x) => x.value === p)?.label || '—';

const ETIQUETAS_DISPONIBLES = [
  'Diseño', 'Backend', 'Frontend', 'DevOps', 'Docs', 'Producto', 'Seguridad',
  'Bug', 'Feature', 'Refactor', 'Test', 'Marketing',
];

const USUARIOS_DEMO = [
  { id: 'maria',    nombre: 'María García',    iniciales: 'MG', color: '#ec4899' },
  { id: 'carlos',   nombre: 'Carlos Mendoza',  iniciales: 'CM', color: '#8b5cf6' },
  { id: 'ana',      nombre: 'Ana López',       iniciales: 'AL', color: '#06b6d4' },
  { id: 'diego',    nombre: 'Diego Ramírez',   iniciales: 'DR', color: '#22c55e' },
  { id: 'lucia',    nombre: 'Lucía Torres',    iniciales: 'LT', color: '#f97316' },
];

const TABLERO_INICIAL = {
  columnas: [
    { id: 'pendiente', titulo: 'Por hacer',    color: '#64748b', wip: 0 },
    { id: 'progreso',  titulo: 'En progreso',  color: '#3b82f6', wip: 3 },
    { id: 'revision',  titulo: 'En revisión',  color: '#eab308', wip: 2 },
    { id: 'hecha',     titulo: 'Hechas',       color: '#22c55e', wip: 0 },
  ],
  tareas: [
    { id: 't1', col: 'pendiente', titulo: 'Diseñar wireframes del onboarding', desc: 'Crear flujos para los 4 pasos del registro inicial.', etiquetas: ['Diseño'], prioridad: 'alta',    asignados: ['maria', 'ana'], vence: '2026-05-20', checklist: [{ texto: 'Mood board', ok: true }, { texto: 'Wireframes lo-fi', ok: false }] },
    { id: 't2', col: 'pendiente', titulo: 'Definir esquema de la base de datos', desc: 'Modelo ER + migraciones iniciales.', etiquetas: ['Backend'], prioridad: 'media', asignados: ['carlos'], vence: '2026-05-15' },
    { id: 't3', col: 'pendiente', titulo: 'Investigación de competidores', desc: 'Analizar Linear, Notion y Asana.', etiquetas: ['Producto'], prioridad: 'baja', asignados: ['diego'] },

    { id: 't4', col: 'progreso', titulo: 'Implementar autenticación con OAuth', desc: 'Google + GitHub providers.', etiquetas: ['Backend', 'Seguridad'], prioridad: 'alta', asignados: ['carlos', 'ana'], vence: '2026-05-10' },
    { id: 't5', col: 'progreso', titulo: 'Migración del módulo de facturación', desc: 'De Stripe legacy a Stripe v3.', etiquetas: ['Backend'], prioridad: 'critica', asignados: ['carlos', 'maria', 'lucia'], vence: '2026-04-30' },

    { id: 't6', col: 'revision', titulo: 'Refactor del componente de tabla', desc: 'Aplicar nuevo design system.', etiquetas: ['Frontend'], prioridad: 'media', asignados: ['ana'], vence: '2026-05-25' },

    { id: 't7', col: 'hecha', titulo: 'Configurar CI/CD',                 desc: 'GitHub Actions + Vercel deploys.', etiquetas: ['DevOps'], prioridad: 'alta', asignados: ['diego'], vence: '2026-04-20' },
    { id: 't8', col: 'hecha', titulo: 'Documentar API pública',           desc: 'OpenAPI 3.0 + ejemplos.',          etiquetas: ['Docs'],   prioridad: 'media', asignados: ['ana', 'lucia'], vence: '2026-04-15' },
  ],
};

// ===========================================================================
//  Persistencia
// ===========================================================================
const cargar = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return TABLERO_INICIAL;
    const t = JSON.parse(raw);
    if (!t.columnas || !t.tareas) return TABLERO_INICIAL;
    return t;
  } catch { return TABLERO_INICIAL; }
};
const guardar = (t) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(t)); } catch {}
};

// ===========================================================================
//  Helpers
// ===========================================================================
const Btn = (texto, variante = 'primary', extra = {}) => crearEl('button', {
  type: extra.type || 'button',
  class: ['btn', variante !== 'primary' && `btn--${variante}`],
  ...extra,
}, [texto]);

const usuarioPorId = (id) => USUARIOS_DEMO.find((u) => u.id === id);

const AvatarStack = (idsAsignados, max = 3) => {
  const wrap = crearEl('div', { class: 'kb-avatars' });
  const arr = idsAsignados || [];
  const visibles = arr.slice(0, max);
  visibles.forEach((id) => {
    const u = usuarioPorId(id);
    if (!u) return;
    wrap.appendChild(crearEl('span', {
      class: 'kb-avatar', style: { background: u.color },
      title: u.nombre,
    }, [u.iniciales]));
  });
  if (arr.length > max) {
    wrap.appendChild(crearEl('span', { class: 'kb-avatar kb-avatar--mas' }, [`+${arr.length - max}`]));
  }
  return wrap;
};

const formatearFecha = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const dia = d.getDate();
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${dia} ${meses[d.getMonth()]}`;
};

const esVencida = (iso) => {
  if (!iso) return false;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return false;
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  return d < hoy;
};

const idUnico = () => 't' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

// ===========================================================================
//  Card de tarea
// ===========================================================================
const TarjetaTarea = (tarea, abrirDetalle) => {
  const card = crearEl('article', {
    class: 'kb-card',
    draggable: true,
    'data-id': tarea.id,
    onClick: () => abrirDetalle(tarea.id),
    onDragStart: (e) => {
      e.dataTransfer.setData('text/plain', tarea.id);
      e.dataTransfer.effectAllowed = 'move';
      card.classList.add('kb-card--drag');
    },
    onDragEnd: () => card.classList.remove('kb-card--drag'),
  });

  // Header con prioridad indicator + título
  const cuerpo = crearEl('div', { class: 'kb-card__cuerpo' });
  cuerpo.appendChild(crearEl('div', {
    class: 'kb-card__indicador',
    style: { background: colorPrioridad(tarea.prioridad) },
    title: labelPrioridad(tarea.prioridad),
  }));
  cuerpo.appendChild(crearEl('div', { class: 'kb-card__titulo' }, [tarea.titulo]));
  card.appendChild(cuerpo);

  // Etiquetas
  if (tarea.etiquetas && tarea.etiquetas.length) {
    card.appendChild(crearEl('div', { class: 'kb-card__tags' },
      tarea.etiquetas.map((et) => crearEl('span', { class: 'kb-tag' }, [et])),
    ));
  }

  // Footer: meta-info + avatares
  const footer = crearEl('div', { class: 'kb-card__footer' });
  const metas = crearEl('div', { class: 'kb-card__metas' });
  if (tarea.vence) {
    metas.appendChild(crearEl('span', {
      class: ['kb-meta', esVencida(tarea.vence) && 'kb-meta--alerta'],
    }, [Icono('calendario', { tamano: 11 }), formatearFecha(tarea.vence)]));
  }
  if (tarea.checklist && tarea.checklist.length) {
    const ok = tarea.checklist.filter((c) => c.ok).length;
    metas.appendChild(crearEl('span', { class: 'kb-meta' }, [
      Icono('check', { tamano: 11 }),
      `${ok}/${tarea.checklist.length}`,
    ]));
  }
  if (tarea.comentarios && tarea.comentarios.length) {
    metas.appendChild(crearEl('span', { class: 'kb-meta' }, [
      Icono('chat', { tamano: 11 }),
      String(tarea.comentarios.length),
    ]));
  }
  footer.appendChild(metas);
  if (tarea.asignados && tarea.asignados.length) {
    footer.appendChild(AvatarStack(tarea.asignados));
  }
  card.appendChild(footer);
  return card;
};

// ===========================================================================
//  Detail drawer (slide desde la derecha)
// ===========================================================================
const abrirDetalleDrawer = ({ tarea, columnas, onGuardar, onEliminar, onCerrar }) => {
  const overlay = crearEl('div', { class: 'kb-drawer-overlay', onClick: (e) => { if (e.target === overlay) cerrar(); } });
  const drawer = crearEl('aside', { class: 'kb-drawer' });

  let datos = { ...tarea };
  let checklist = [...(tarea.checklist || [])];

  const cerrar = () => {
    overlay.classList.remove('kb-drawer-overlay--abierto');
    drawer.classList.remove('kb-drawer--abierto');
    document.removeEventListener('keydown', onKey);
    setTimeout(() => { overlay.remove(); onCerrar && onCerrar(); }, 220);
  };
  const onKey = (e) => { if (e.key === 'Escape') cerrar(); };

  // Header
  const header = crearEl('div', { class: 'kb-drawer__head' }, [
    crearEl('div', { class: 'kb-drawer__head-info' }, [
      crearEl('span', { class: 'kb-drawer__id' }, [`#${tarea.id}`]),
      crearEl('span', { class: 'kb-drawer__sep' }, ['·']),
      crearEl('span', { class: 'kb-drawer__col' },
        [columnas.find((c) => c.id === datos.col)?.titulo || '—']),
    ]),
    crearEl('div', { class: 'kb-drawer__acciones' }, [
      crearEl('button', {
        type: 'button', class: 'kb-drawer__btn-icono', title: 'Eliminar',
        onClick: () => {
          if (confirm('¿Eliminar esta tarea?')) { onEliminar(tarea.id); cerrar(); }
        },
      }, [Icono('papelera', { tamano: 14 })]),
      crearEl('button', {
        type: 'button', class: 'kb-drawer__btn-icono', title: 'Cerrar (ESC)',
        onClick: cerrar,
      }, [Icono('cerrar', { tamano: 14 })]),
    ]),
  ]);

  // Inputs
  const inputTitulo = crearEl('input', {
    type: 'text', class: 'kb-drawer__titulo',
    value: datos.titulo,
    placeholder: 'Título de la tarea…',
    onInput: (e) => datos.titulo = e.target.value,
  });

  const txtDesc = crearEl('textarea', {
    class: 'input',
    rows: 4,
    placeholder: 'Descripción…',
    onInput: (e) => datos.desc = e.target.value,
  });
  txtDesc.value = datos.desc || '';

  // Checklist
  const renderChecklist = () => {
    const cont = drawer.querySelector('.kb-drawer__checklist');
    if (!cont) return;
    cont.replaceChildren();
    checklist.forEach((item, i) => {
      cont.appendChild(crearEl('label', { class: 'kb-checklist-item' }, [
        crearEl('input', {
          type: 'checkbox', class: 'check-input check-input--sm',
          checked: item.ok || null,
          onChange: (e) => { checklist[i].ok = e.target.checked; },
        }),
        crearEl('input', {
          type: 'text', class: 'kb-checklist-input',
          value: item.texto,
          onInput: (e) => { checklist[i].texto = e.target.value; },
        }),
        crearEl('button', {
          type: 'button', class: 'kb-checklist-quitar', title: 'Quitar',
          onClick: () => { checklist.splice(i, 1); renderChecklist(); },
        }, [Icono('cerrar', { tamano: 12 })]),
      ]));
    });
    cont.appendChild(crearEl('button', {
      type: 'button', class: 'kb-checklist-agregar',
      onClick: () => { checklist.push({ texto: 'Nuevo item', ok: false }); renderChecklist(); },
    }, [Icono('mas', { tamano: 12 }), 'Añadir item']));
  };

  // Cuerpo del drawer
  const cuerpo = crearEl('div', { class: 'kb-drawer__cuerpo' }, [
    inputTitulo,

    crearEl('div', { class: 'kb-drawer__seccion' }, [
      crearEl('div', { class: 'kb-drawer__lbl' }, ['Descripción']),
      txtDesc,
    ]),

    Grid2(
      Campo({ label: 'Estado', hijos: SelectModerno({
        value: datos.col,
        opciones: columnas.map((c) => ({ value: c.id, label: c.titulo })),
        onChange: (v) => datos.col = v,
      })}),
      Campo({ label: 'Prioridad', hijos: SelectModerno({
        value: datos.prioridad,
        opciones: PRIORIDADES.map((p) => ({ value: p.value, label: p.label })),
        onChange: (v) => datos.prioridad = v,
      })}),
    ),

    Grid2(
      Campo({ label: 'Fecha límite', hijos: DatePicker({
        value: datos.vence ? new Date(datos.vence) : null,
        onChange: (d) => { datos.vence = d ? d.toISOString().slice(0, 10) : null; },
      })}),
      Campo({ label: 'Asignados', hijos: SelectMulti({
        value: datos.asignados || [],
        opciones: USUARIOS_DEMO.map((u) => ({ value: u.id, label: u.nombre })),
        placeholder: 'Selecciona…',
        onChange: (vals) => datos.asignados = vals,
      })}),
    ),

    Campo({ label: 'Etiquetas', hijos: SelectMulti({
      value: datos.etiquetas || [],
      opciones: ETIQUETAS_DISPONIBLES.map((e) => ({ value: e, label: e })),
      placeholder: 'Selecciona etiquetas…',
      onChange: (vals) => datos.etiquetas = vals,
    })}),

    crearEl('div', { class: 'kb-drawer__seccion' }, [
      crearEl('div', { class: 'kb-drawer__lbl' }, ['Checklist']),
      crearEl('div', { class: 'kb-drawer__checklist' }),
    ]),
  ]);

  // Footer del drawer
  const footer = crearEl('div', { class: 'kb-drawer__pie' }, [
    Btn('Cancelar', 'outline', { onClick: cerrar }),
    Btn('Guardar', 'primary', {
      onClick: () => {
        if (!datos.titulo.trim()) {
          estadoNotificaciones.error('El título es requerido');
          return;
        }
        datos.checklist = checklist;
        onGuardar(datos);
        cerrar();
      },
    }),
  ]);

  drawer.appendChild(header);
  drawer.appendChild(cuerpo);
  drawer.appendChild(footer);
  overlay.appendChild(drawer);
  document.body.appendChild(overlay);
  document.addEventListener('keydown', onKey);
  renderChecklist();

  requestAnimationFrame(() => {
    overlay.classList.add('kb-drawer-overlay--abierto');
    drawer.classList.add('kb-drawer--abierto');
  });
};

// ===========================================================================
//  Página principal
// ===========================================================================
export default async () => {
  const tablero = senal(cargar());
  const filtroTexto = senal('');
  const filtroPrioridad = senal('todas');
  const filtroAsignado = senal('todos');

  efecto(() => guardar(tablero.value));

  const wrap = crearEl('div', { class: 'kb-pagina' });

  // -------------------------------------------------------------------------
  //  Helpers de mutación
  // -------------------------------------------------------------------------
  const mutar = (fn) => {
    const t = JSON.parse(JSON.stringify(tablero.peek()));
    fn(t);
    tablero.value = t;
  };

  const moverTarea = (idTarea, idCol, indiceDestino = -1) => {
    mutar((t) => {
      const i = t.tareas.findIndex((x) => x.id === idTarea);
      if (i < 0) return;
      const tarea = t.tareas.splice(i, 1)[0];
      tarea.col = idCol;
      if (indiceDestino === -1) {
        t.tareas.push(tarea);
      } else {
        // calcular posición real entre tareas de la misma columna
        const tareasCol = t.tareas.filter((x) => x.col === idCol);
        const refTarea = tareasCol[indiceDestino];
        if (refTarea) {
          const posReal = t.tareas.indexOf(refTarea);
          t.tareas.splice(posReal, 0, tarea);
        } else {
          t.tareas.push(tarea);
        }
      }
    });
  };

  const crearTarea = (idCol, titulo) => {
    mutar((t) => {
      t.tareas.push({
        id: idUnico(), col: idCol,
        titulo, desc: '',
        etiquetas: [], prioridad: 'media',
        asignados: [], checklist: [],
      });
    });
  };

  const actualizarTarea = (datos) => {
    mutar((t) => {
      const i = t.tareas.findIndex((x) => x.id === datos.id);
      if (i >= 0) t.tareas[i] = datos;
    });
    estadoNotificaciones.exito('Tarea actualizada');
  };

  const eliminarTarea = (id) => {
    mutar((t) => {
      t.tareas = t.tareas.filter((x) => x.id !== id);
    });
    estadoNotificaciones.exito('Tarea eliminada');
  };

  const crearColumna = () => {
    const titulo = prompt('Nombre de la nueva columna:');
    if (!titulo) return;
    mutar((t) => {
      t.columnas.push({
        id: 'c' + Date.now().toString(36),
        titulo, color: '#64748b', wip: 0,
      });
    });
  };

  const eliminarColumna = (id) => {
    const tareasEnCol = tablero.peek().tareas.filter((x) => x.col === id).length;
    if (tareasEnCol > 0 && !confirm(`Esta columna tiene ${tareasEnCol} tareas. ¿Eliminar de todas formas?`)) return;
    mutar((t) => {
      t.columnas = t.columnas.filter((c) => c.id !== id);
      t.tareas = t.tareas.filter((x) => x.col !== id);
    });
  };

  const abrirDetalle = (idTarea) => {
    const tarea = tablero.peek().tareas.find((x) => x.id === idTarea);
    if (!tarea) return;
    abrirDetalleDrawer({
      tarea,
      columnas: tablero.peek().columnas,
      onGuardar: actualizarTarea,
      onEliminar: eliminarTarea,
    });
  };

  // -------------------------------------------------------------------------
  //  Filtrado
  // -------------------------------------------------------------------------
  const tareasFiltradas = () => {
    const t = tablero.value.tareas;
    const q = filtroTexto.value.trim().toLowerCase();
    const p = filtroPrioridad.value;
    const a = filtroAsignado.value;
    return t.filter((x) => {
      if (q && !x.titulo.toLowerCase().includes(q) && !(x.desc || '').toLowerCase().includes(q)) return false;
      if (p !== 'todas' && x.prioridad !== p) return false;
      if (a !== 'todos' && !(x.asignados || []).includes(a)) return false;
      return true;
    });
  };

  // -------------------------------------------------------------------------
  //  Header (título + stats)
  // -------------------------------------------------------------------------
  const header = crearEl('div', { class: 'kb-header' });
  const headerInfo = crearEl('div', { class: 'kb-header__info' }, [
    crearEl('h1', null, ['Kanban']),
    crearEl('p', null, ['Arrastra tareas entre columnas. Click en una para editar todos los campos.']),
  ]);
  const stats = crearEl('div', { class: 'kb-stats' });
  efecto(() => {
    const ts = tablero.value.tareas;
    const total = ts.length;
    const vencidas = ts.filter((x) => esVencida(x.vence) && x.col !== 'hecha').length;
    const criticas = ts.filter((x) => x.prioridad === 'critica').length;
    stats.replaceChildren(
      crearEl('span', { class: 'kb-stat' }, [
        crearEl('strong', null, [String(total)]), ' tareas',
      ]),
      crearEl('span', { class: ['kb-stat', vencidas > 0 && 'kb-stat--alerta'] }, [
        crearEl('strong', null, [String(vencidas)]), ' vencidas',
      ]),
      crearEl('span', { class: 'kb-stat' }, [
        crearEl('strong', null, [String(criticas)]), ' críticas',
      ]),
    );
  });
  header.appendChild(headerInfo);
  header.appendChild(stats);

  // -------------------------------------------------------------------------
  //  Toolbar (búsqueda + filtros + nueva tarea)
  // -------------------------------------------------------------------------
  const toolbar = crearEl('div', { class: 'kb-toolbar' });

  const inputBuscar = crearEl('input', {
    type: 'search',
    placeholder: 'Buscar tareas…',
    class: 'input input--sm',
    onInput: (e) => filtroTexto.value = e.target.value,
  });
  toolbar.appendChild(crearEl('div', { class: 'kb-toolbar__buscar' }, [
    Icono('busqueda', { tamano: 14 }),
    inputBuscar,
  ]));

  toolbar.appendChild(SelectModerno({
    value: 'todas',
    opciones: [
      { value: 'todas', label: 'Todas las prioridades' },
      ...PRIORIDADES.map((p) => ({ value: p.value, label: p.label })),
    ],
    onChange: (v) => filtroPrioridad.value = v,
  }));

  toolbar.appendChild(SelectModerno({
    value: 'todos',
    conBuscador: true,
    opciones: [
      { value: 'todos', label: 'Todos los asignados' },
      ...USUARIOS_DEMO.map((u) => ({ value: u.id, label: u.nombre })),
    ],
    onChange: (v) => filtroAsignado.value = v,
  }));

  toolbar.appendChild(crearEl('div', { class: 'kb-toolbar__der' }, [
    Btn('+ Columna', 'outline', { onClick: crearColumna }),
  ]));

  // -------------------------------------------------------------------------
  //  Tablero (columnas)
  // -------------------------------------------------------------------------
  const board = crearEl('div', { class: 'kb-board' });

  const renderBoard = () => {
    const t = tablero.value;
    const tareasVisibles = tareasFiltradas();
    board.replaceChildren();

    t.columnas.forEach((col) => {
      const tareasCol = tareasVisibles.filter((x) => x.col === col.id);
      const sobreWip = col.wip > 0 && tareasCol.length > col.wip;

      const colEl = crearEl('section', {
        class: ['kb-col', sobreWip && 'kb-col--sobre-wip'],
        'data-col': col.id,
      });

      // Drag & drop sobre la columna
      colEl.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        colEl.classList.add('kb-col--drop');
        // Mostrar placeholder en la posición correcta
        const after = obtenerInsertarDespues(colEl, e.clientY);
        const placeholder = colEl.querySelector('.kb-card-ph') || crearEl('div', { class: 'kb-card-ph' });
        if (after == null) colEl.querySelector('.kb-col__lista').appendChild(placeholder);
        else colEl.querySelector('.kb-col__lista').insertBefore(placeholder, after);
      });
      colEl.addEventListener('dragleave', (e) => {
        if (!colEl.contains(e.relatedTarget)) {
          colEl.classList.remove('kb-col--drop');
          const ph = colEl.querySelector('.kb-card-ph');
          if (ph) ph.remove();
        }
      });
      colEl.addEventListener('drop', (e) => {
        e.preventDefault();
        colEl.classList.remove('kb-col--drop');
        const idTarea = e.dataTransfer.getData('text/plain');
        const ph = colEl.querySelector('.kb-card-ph');
        let indice = -1;
        if (ph) {
          const cards = Array.from(colEl.querySelectorAll('.kb-card'));
          indice = cards.findIndex((c) => c.compareDocumentPosition(ph) & Node.DOCUMENT_POSITION_PRECEDING);
          if (indice < 0) indice = cards.length;
          ph.remove();
        }
        moverTarea(idTarea, col.id, indice);
      });

      // Header de la columna
      const head = crearEl('header', { class: 'kb-col__head' }, [
        crearEl('div', { class: 'kb-col__head-titulo' }, [
          crearEl('span', { class: 'kb-col__dot', style: { background: col.color } }),
          crearEl('span', null, [col.titulo]),
          crearEl('span', { class: 'kb-col__count' }, [
            String(tareasCol.length) + (col.wip > 0 ? ` / ${col.wip}` : ''),
          ]),
        ]),
        crearEl('div', { class: 'kb-col__head-acciones' }, [
          crearEl('button', {
            type: 'button', class: 'kb-col__btn', title: 'Añadir tarea',
            onClick: () => abrirInlineCrear(col.id),
          }, [Icono('mas', { tamano: 14 })]),
          crearEl('button', {
            type: 'button', class: 'kb-col__btn', title: 'Eliminar columna',
            onClick: () => eliminarColumna(col.id),
          }, [Icono('papelera', { tamano: 13 })]),
        ]),
      ]);
      colEl.appendChild(head);

      // Lista de cards
      const lista = crearEl('div', { class: 'kb-col__lista' });
      tareasCol.forEach((tarea) => lista.appendChild(TarjetaTarea(tarea, abrirDetalle)));
      if (tareasCol.length === 0) {
        lista.appendChild(crearEl('div', { class: 'kb-col__vacio' }, ['Sin tareas']));
      }
      colEl.appendChild(lista);

      // Botón añadir abajo
      colEl.appendChild(crearEl('button', {
        type: 'button', class: 'kb-col__add',
        onClick: () => abrirInlineCrear(col.id),
      }, [Icono('mas', { tamano: 13 }), 'Añadir tarea']));

      board.appendChild(colEl);
    });
  };

  // Helper: encontrar dónde insertar la card según mouseY
  const obtenerInsertarDespues = (colEl, y) => {
    const cards = Array.from(colEl.querySelectorAll('.kb-card:not(.kb-card--drag)'));
    return cards.reduce((closest, card) => {
      const box = card.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) return { offset, elemento: card };
      return closest;
    }, { offset: Number.NEGATIVE_INFINITY, elemento: null }).elemento;
  };

  // Crear inline (input rápido sin drawer)
  const abrirInlineCrear = (idCol) => {
    const colEl = board.querySelector(`[data-col="${idCol}"]`);
    if (!colEl) return;
    const lista = colEl.querySelector('.kb-col__lista');
    const inlineWrap = crearEl('div', { class: 'kb-inline-crear' });
    const input = crearEl('textarea', {
      class: 'kb-inline-crear__input',
      placeholder: 'Título de la tarea…',
      rows: 2,
      onKeyDown: (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          confirmar();
        }
        if (e.key === 'Escape') cancelar();
      },
    });
    const acciones = crearEl('div', { class: 'kb-inline-crear__acciones' }, [
      Btn('Añadir', 'primary', { onClick: confirmar, type: 'button' }),
      crearEl('button', {
        type: 'button', class: 'kb-inline-crear__cancel',
        onClick: cancelar,
      }, [Icono('cerrar', { tamano: 14 })]),
    ]);
    function confirmar() {
      const titulo = input.value.trim();
      if (!titulo) { cancelar(); return; }
      crearTarea(idCol, titulo);
    }
    function cancelar() { inlineWrap.remove(); }
    inlineWrap.appendChild(input);
    inlineWrap.appendChild(acciones);
    lista.appendChild(inlineWrap);
    requestAnimationFrame(() => input.focus());
  };

  efecto(renderBoard);

  // -------------------------------------------------------------------------
  //  Montaje
  // -------------------------------------------------------------------------
  wrap.appendChild(header);
  wrap.appendChild(toolbar);
  wrap.appendChild(board);
  return wrap;
};
