/**
 * Sortable — drag-and-drop usando HTML5 nativo (sin librerías).
 * Estado reactivo del orden via `senal`.
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { Avatar } from '../../../components/ui/avatar/avatar.js';
import { Insignia } from '../../../components/ui/badge/badge.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { corner5 } from '../../../components/ui/card/card-decoraciones.js';

const FOTO = (n) => `./public/img/team/${n}.jpg`;
const GAL  = (n) => `./public/img/gallery/${n}.jpg`;

// ============================================================================
//  Estado global de drag — para transferir entre listas/columnas
//  Guarda la "ubicación" de origen del item arrastrado.
// ============================================================================
let _arrastre = null;

// ============================================================================
//  1 · Lista simple reordenable (handle full-row)
// ============================================================================
const demoBasico = () => {
  const items = senal(['Diseñar arquitectura', 'Implementar router', 'Crear componentes UI', 'Tests E2E', 'Deploy a staging']);
  let idxOrigen = -1;
  const lista = crearEl('ul', { style: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' } });

  efecto(() => {
    lista.replaceChildren(...items.value.map((it, i) => crearEl('li', {
      draggable: 'true',
      style: {
        display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
        padding: 'var(--space-2) var(--space-3)',
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', cursor: 'grab',
        fontSize: 'var(--text-sm)', color: 'var(--foreground)',
        transition: 'background 180ms, opacity 180ms',
      },
      onDragstart: (e) => {
        idxOrigen = i;
        e.currentTarget.style.opacity = '0.4';
      },
      onDragend: (e) => { e.currentTarget.style.opacity = '1'; idxOrigen = -1; },
      onDragover: (e) => {
        e.preventDefault();
        e.currentTarget.style.background = 'color-mix(in srgb, var(--primary) 8%, var(--surface))';
      },
      onDragleave: (e) => { e.currentTarget.style.background = 'var(--surface)'; },
      onDrop: (e) => {
        e.preventDefault();
        e.currentTarget.style.background = 'var(--surface)';
        if (idxOrigen < 0 || idxOrigen === i) return;
        const arr = [...items.value];
        const [movido] = arr.splice(idxOrigen, 1);
        arr.splice(i, 0, movido);
        items.value = arr;
        idxOrigen = -1;
      },
    }, [
      crearEl('span', { style: { color: 'var(--muted-foreground)', display: 'inline-flex' } },
        [Icono('densidad', { tamano: 14 })]),
      crearEl('span', null, [it]),
    ])));
  });
  return lista;
};

// ============================================================================
//  2 · Con drag handle (sólo el icono inicia el drag)
// ============================================================================
const demoHandle = () => {
  const items = senal([
    { texto: 'Revisar mockups del Q3',     prioridad: 'Alta' },
    { texto: 'Sincronizar con backend',     prioridad: 'Media' },
    { texto: 'Escribir docs API',           prioridad: 'Baja' },
    { texto: 'Demo viernes',                prioridad: 'Alta' },
    { texto: 'Cleanup de issues legacy',    prioridad: 'Baja' },
  ]);
  let idxOrigen = -1;
  const lista = crearEl('ul', { style: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' } });

  const colorPri = { Alta: 'danger', Media: 'warning', Baja: 'muted' };

  efecto(() => {
    lista.replaceChildren(...items.value.map((it, i) => {
      const li = crearEl('li', {
        style: {
          display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
          padding: 'var(--space-2) var(--space-3)',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          fontSize: 'var(--text-sm)', color: 'var(--foreground)',
          transition: 'background 180ms, opacity 180ms',
        },
        // El item NO es draggable — lo es sólo el handle
        onDragover: (e) => {
          e.preventDefault();
          e.currentTarget.style.background = 'color-mix(in srgb, var(--primary) 8%, var(--surface))';
        },
        onDragleave: (e) => { e.currentTarget.style.background = 'var(--surface)'; },
        onDrop: (e) => {
          e.preventDefault();
          e.currentTarget.style.background = 'var(--surface)';
          if (idxOrigen < 0 || idxOrigen === i) return;
          const arr = [...items.value];
          const [movido] = arr.splice(idxOrigen, 1);
          arr.splice(i, 0, movido);
          items.value = arr;
        },
      }, [
        crearEl('span', {
          draggable: 'true',
          style: {
            color: 'var(--muted-foreground)', cursor: 'grab',
            padding: '4px', borderRadius: 'var(--radius-sm)',
          },
          onMouseenter: (e) => { e.currentTarget.style.background = 'var(--muted)'; },
          onMouseleave: (e) => { e.currentTarget.style.background = ''; },
          onDragstart: (e) => {
            idxOrigen = i;
            li.style.opacity = '0.4';
            // Set a custom drag image (el item completo)
            e.dataTransfer.setDragImage(li, 0, 0);
          },
          onDragend: () => { li.style.opacity = '1'; idxOrigen = -1; },
        }, [Icono('densidad', { tamano: 14 })]),
        crearEl('input', {
          type: 'checkbox', style: { accentColor: 'var(--primary)', cursor: 'pointer' },
        }),
        crearEl('span', { style: { flex: 1 } }, [it.texto]),
        Insignia({ texto: it.prioridad, variante: colorPri[it.prioridad] }),
      ]);
      return li;
    }));
  });
  return lista;
};

// ============================================================================
//  3 · Kanban (3 columnas con drag entre ellas)
// ============================================================================
const demoKanban = () => {
  const tareas = {
    todo:  senal([
      { id: 1, titulo: 'Diseñar onboarding',     etiqueta: 'Diseño',      tag: 'primary' },
      { id: 2, titulo: 'Implementar OAuth',       etiqueta: 'Engineering', tag: 'info' },
      { id: 3, titulo: 'Escribir blog post Q3',   etiqueta: 'Marketing',   tag: 'warning' },
    ]),
    doing: senal([
      { id: 4, titulo: 'Migración a v2 del API',  etiqueta: 'Engineering', tag: 'info' },
      { id: 5, titulo: 'A/B test pricing',         etiqueta: 'Marketing',   tag: 'warning' },
    ]),
    done:  senal([
      { id: 6, titulo: 'Deploy de staging',        etiqueta: 'DevOps',      tag: 'success' },
      { id: 7, titulo: 'Crear logo nuevo',          etiqueta: 'Diseño',      tag: 'primary' },
    ]),
  };

  const COLUMNAS = [
    { id: 'todo',  titulo: 'Por hacer',  color: 'var(--color-warning)' },
    { id: 'doing', titulo: 'En progreso', color: 'var(--primary)' },
    { id: 'done',  titulo: 'Hecho',       color: 'var(--color-success)' },
  ];

  const renderColumna = (cfg) => {
    const lista = crearEl('div', {
      style: {
        display: 'flex', flexDirection: 'column', gap: '6px',
        minHeight: '200px',
        padding: '6px',
        borderRadius: 'var(--radius)',
        transition: 'background 180ms',
      },
      onDragover: (e) => {
        e.preventDefault();
        e.currentTarget.style.background = 'color-mix(in srgb, var(--primary) 6%, transparent)';
      },
      onDragleave: (e) => { e.currentTarget.style.background = ''; },
      onDrop: (e) => {
        e.preventDefault();
        e.currentTarget.style.background = '';
        if (!_arrastre) return;
        // Sacar de la columna origen
        const origenLista = tareas[_arrastre.colId];
        const origenArr = [...origenLista.value];
        const [movido] = origenArr.splice(_arrastre.idx, 1);
        origenLista.value = origenArr;
        // Insertar al final de la columna destino (si es la misma, en pos calculada)
        const destLista = tareas[cfg.id];
        if (_arrastre.colId === cfg.id) {
          // Mismo destino: insertar al final
          destLista.value = [...destLista.value, movido];
        } else {
          destLista.value = [...destLista.value, movido];
        }
        _arrastre = null;
      },
    });

    efecto(() => {
      lista.replaceChildren(...tareas[cfg.id].value.map((t, i) => crearEl('div', {
        draggable: 'true',
        style: {
          padding: 'var(--space-3)',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', cursor: 'grab',
          display: 'flex', flexDirection: 'column', gap: '6px',
          transition: 'opacity 180ms, transform 180ms',
        },
        onDragstart: (e) => {
          _arrastre = { colId: cfg.id, idx: i };
          e.currentTarget.style.opacity = '0.4';
          // Permitir drop entre items del mismo column también — onDragover en el item
        },
        onDragend: (e) => { e.currentTarget.style.opacity = '1'; },
        onDragover: (e) => { e.preventDefault(); e.stopPropagation(); },
        onDrop: (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!_arrastre) return;
          const origenLista = tareas[_arrastre.colId];
          const destLista = tareas[cfg.id];
          // Mover dentro de la misma columna (reordenar)
          if (_arrastre.colId === cfg.id) {
            if (_arrastre.idx === i) { _arrastre = null; return; }
            const arr = [...destLista.value];
            const [movido] = arr.splice(_arrastre.idx, 1);
            arr.splice(i, 0, movido);
            destLista.value = arr;
          } else {
            // Mover entre columnas: insertar antes del item donde se soltó
            const origenArr = [...origenLista.value];
            const [movido] = origenArr.splice(_arrastre.idx, 1);
            origenLista.value = origenArr;
            const destArr = [...destLista.value];
            destArr.splice(i, 0, movido);
            destLista.value = destArr;
          }
          _arrastre = null;
        },
      }, [
        crearEl('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)' } }, [
          Insignia({ texto: t.etiqueta, variante: t.tag }),
          crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontVariantNumeric: 'tabular-nums' } }, [`#${t.id}`]),
        ]),
        crearEl('p', { style: { margin: 0, fontSize: 'var(--text-sm)', fontWeight: 500 } }, [t.titulo]),
      ])));
    });

    const contadorEl = crearEl('span', {
      style: {
        fontSize: 'var(--text-xs)', fontWeight: 700,
        padding: '2px 8px', borderRadius: '999px',
        background: `color-mix(in srgb, ${cfg.color} 14%, transparent)`,
        color: cfg.color,
      },
    });
    efecto(() => { contadorEl.textContent = String(tareas[cfg.id].value.length); });

    return crearEl('div', {
      style: {
        flex: 1, minWidth: '200px',
        background: 'color-mix(in srgb, var(--foreground) 3%, var(--surface))',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-3)',
        display: 'flex', flexDirection: 'column', gap: 'var(--space-2)',
      },
    }, [
      crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
        crearEl('span', { style: { width: '8px', height: '8px', borderRadius: '50%', background: cfg.color } }),
        crearEl('strong', { style: { fontSize: 'var(--text-sm)', fontWeight: 600 } }, [cfg.titulo]),
        contadorEl,
      ]),
      lista,
    ]);
  };

  return crearEl('div', {
    style: { display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' },
  }, COLUMNAS.map(renderColumna));
};

// ============================================================================
//  4 · Lista priorizada con números (top 5 ranking)
// ============================================================================
const demoRanking = () => {
  const items = senal([
    { texto: 'Bohemian Rhapsody',  artista: 'Queen' },
    { texto: 'Stairway to Heaven', artista: 'Led Zeppelin' },
    { texto: 'Hotel California',    artista: 'Eagles' },
    { texto: 'Imagine',             artista: 'John Lennon' },
    { texto: 'Smells Like Teen Spirit', artista: 'Nirvana' },
  ]);
  let idxOrigen = -1;
  const lista = crearEl('ul', { style: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' } });

  efecto(() => {
    lista.replaceChildren(...items.value.map((it, i) => {
      const colorMedalla = i === 0 ? 'linear-gradient(135deg,#fbbf24,#f59e0b)'
        : i === 1 ? 'linear-gradient(135deg,#cbd5e1,#94a3b8)'
        : i === 2 ? 'linear-gradient(135deg,#fb923c,#ea580c)'
        : 'color-mix(in srgb, var(--foreground) 6%, transparent)';
      const colorNumero = i < 3 ? '#fff' : 'var(--muted-foreground)';
      return crearEl('li', {
        draggable: 'true',
        style: {
          display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
          padding: 'var(--space-2) var(--space-3)',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', cursor: 'grab',
          transition: 'opacity 180ms',
        },
        onDragstart: (e) => { idxOrigen = i; e.currentTarget.style.opacity = '0.4'; },
        onDragend: (e) => { e.currentTarget.style.opacity = '1'; idxOrigen = -1; },
        onDragover: (e) => e.preventDefault(),
        onDrop: (e) => {
          e.preventDefault();
          if (idxOrigen < 0 || idxOrigen === i) return;
          const arr = [...items.value];
          const [movido] = arr.splice(idxOrigen, 1);
          arr.splice(i, 0, movido);
          items.value = arr;
        },
      }, [
        crearEl('span', {
          style: {
            width: '32px', height: '32px',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '50%', background: colorMedalla,
            color: colorNumero, fontWeight: 700, fontSize: 'var(--text-sm)',
            fontVariantNumeric: 'tabular-nums', flexShrink: 0,
          },
        }, [String(i + 1)]),
        crearEl('div', { style: { flex: 1 } }, [
          crearEl('div', { style: { fontSize: 'var(--text-sm)', fontWeight: 600 } }, [it.texto]),
          crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [it.artista]),
        ]),
        crearEl('span', { style: { color: 'var(--muted-foreground)' } }, [Icono('densidad', { tamano: 14 })]),
      ]);
    }));
  });
  return lista;
};

// ============================================================================
//  5 · Galería de imágenes reordenable
// ============================================================================
const demoGaleria = () => {
  const items = senal([2, 3, 2006, 2007, 2008, 2010].map((n) => ({ id: n, src: GAL(n) })));
  let idxOrigen = -1;

  const grid = crearEl('div', {
    style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 'var(--space-2)' },
  });

  efecto(() => {
    grid.replaceChildren(...items.value.map((it, i) => {
      const card = crearEl('div', {
        draggable: 'true',
        style: {
          position: 'relative',
          aspectRatio: '1/1',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          cursor: 'grab',
          transition: 'transform 180ms, opacity 180ms, box-shadow 180ms',
        },
        onDragstart: (e) => {
          idxOrigen = i;
          e.currentTarget.style.opacity = '0.4';
          e.currentTarget.style.transform = 'scale(0.95)';
        },
        onDragend: (e) => {
          e.currentTarget.style.opacity = '1';
          e.currentTarget.style.transform = '';
          idxOrigen = -1;
        },
        onDragover: (e) => {
          e.preventDefault();
          if (idxOrigen >= 0 && idxOrigen !== i) {
            e.currentTarget.style.boxShadow = '0 0 0 3px var(--primary)';
          }
        },
        onDragleave: (e) => { e.currentTarget.style.boxShadow = ''; },
        onDrop: (e) => {
          e.preventDefault();
          e.currentTarget.style.boxShadow = '';
          if (idxOrigen < 0 || idxOrigen === i) return;
          const arr = [...items.value];
          const [movido] = arr.splice(idxOrigen, 1);
          arr.splice(i, 0, movido);
          items.value = arr;
        },
      }, [
        crearEl('img', {
          src: it.src, alt: '', loading: 'lazy', draggable: 'false',
          style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' },
        }),
        // Badge de posición
        crearEl('span', {
          style: {
            position: 'absolute', insetBlockStart: '8px', insetInlineStart: '8px',
            width: '24px', height: '24px',
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
            color: '#fff', borderRadius: '50%',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 'var(--text-xs)', fontWeight: 700,
            fontVariantNumeric: 'tabular-nums',
          },
        }, [String(i + 1)]),
      ]);
      return card;
    }));
  });
  return grid;
};

// ============================================================================
//  6 · Inbox/email reordenable con avatares
// ============================================================================
const demoInbox = () => {
  const items = senal([
    { autor: 'Emma Watson',     foto: FOTO(1), asunto: 'Re: Propuesta de diseño',    tiempo: 'Hace 2m', noLeido: true },
    { autor: 'Marcus Lee',      foto: FOTO(2), asunto: 'Reunión semanal',             tiempo: 'Hace 1h', noLeido: true },
    { autor: 'GitHub',          foto: FOTO(3), asunto: '[launchpad] PR #142 abierto', tiempo: 'Hace 3h' },
    { autor: 'María García',    foto: FOTO(4), asunto: 'Aprobación Q3 lista',         tiempo: 'Ayer' },
    { autor: 'Sara Chen',       foto: FOTO(5), asunto: 'Mockups para revisar',        tiempo: '2 días' },
  ]);
  let idxOrigen = -1;
  const lista = crearEl('ul', { style: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '4px' } });

  efecto(() => {
    lista.replaceChildren(...items.value.map((it, i) => crearEl('li', {
      draggable: 'true',
      style: {
        display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
        padding: 'var(--space-2) var(--space-3)',
        background: it.noLeido ? 'color-mix(in srgb, var(--primary) 4%, var(--surface))' : 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', cursor: 'grab',
        transition: 'opacity 180ms, background 180ms',
      },
      onDragstart: (e) => { idxOrigen = i; e.currentTarget.style.opacity = '0.4'; },
      onDragend: (e) => { e.currentTarget.style.opacity = '1'; idxOrigen = -1; },
      onDragover: (e) => e.preventDefault(),
      onDrop: (e) => {
        e.preventDefault();
        if (idxOrigen < 0 || idxOrigen === i) return;
        const arr = [...items.value];
        const [movido] = arr.splice(idxOrigen, 1);
        arr.splice(i, 0, movido);
        items.value = arr;
      },
    }, [
      crearEl('span', { style: { color: 'var(--muted-foreground)' } }, [Icono('densidad', { tamano: 14 })]),
      Avatar({ nombre: it.autor, src: it.foto, tamano: 'sm' }),
      crearEl('div', { style: { flex: 1, minWidth: 0 } }, [
        crearEl('div', { style: { fontSize: 'var(--text-sm)', fontWeight: it.noLeido ? 700 : 500 } }, [it.autor]),
        crearEl('div', { style: {
          fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        } }, [it.asunto]),
      ]),
      crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', flexShrink: 0 } }, [it.tiempo]),
      it.noLeido && crearEl('span', { style: {
        width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', flexShrink: 0,
      } }),
    ])));
  });
  return lista;
};

// ============================================================================
//  Página
// ============================================================================
export default async () => PaginaShowcase({
  titulo: 'Sortable',
  descripcion: 'Drag-and-drop reordenable con HTML5 Drag API nativo. Sin librerías externas — el orden vive en una `senal` y `efecto` re-renderiza la lista. 6 patrones reales: lista simple, drag handle aislado, Kanban con drag entre columnas, ranking numerado, galería de imágenes y bandeja de email.',
  decoracion: corner5(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    Seccion({
      titulo: '1 · Lista simple',
      descripcion: 'Toda la fila es draggable. Mientras arrastras el item se atenúa al 40%, el destino se resalta en azul. La fuente única de verdad es la `senal items` — `efecto` re-renderiza al cambiar.',
      hijos: [VistaCodigo({
        vista: demoBasico(),
        codigo: `const items = senal([...]);
let idxOrigen = -1;

efecto(() => lista.replaceChildren(...items.value.map((it, i) => crearEl('li', {
  draggable: 'true',
  onDragstart: () => { idxOrigen = i; },
  onDragover:  e => e.preventDefault(),
  onDrop: () => {
    if (idxOrigen < 0 || idxOrigen === i) return;
    const arr = [...items.value];
    const [movido] = arr.splice(idxOrigen, 1);
    arr.splice(i, 0, movido);
    items.value = arr;                          // ← muta senal, dispara re-render
  },
}, [it]))));`,
      })],
    }),

    Seccion({
      titulo: '2 · Con drag handle aislado',
      descripcion: 'Sólo el icono `≡` inicia el drag — el resto del item es interactivo (checkbox, click). Patrón obligatorio cuando la fila tiene controles propios. Usa `e.dataTransfer.setDragImage(li, 0, 0)` para que la imagen del drag sea la fila completa, no el handle.',
      hijos: [VistaCodigo({
        vista: demoHandle(),
        codigo: `// El <li> NO es draggable; sólo el handle
crearEl('li', {
  // sin draggable
  onDragover: e => e.preventDefault(),
  onDrop:     handleDrop,
}, [
  crearEl('span', {
    draggable: 'true',                          // ← sólo el handle
    onDragstart: (e) => {
      idxOrigen = i;
      e.dataTransfer.setDragImage(li, 0, 0);    // ← imagen del drag = la fila entera
    },
  }, [Icono('densidad')]),
  Checkbox(),
  texto,
  Insignia({ texto: prioridad }),
])`,
      })],
    }),

    Seccion({
      titulo: '3 · Kanban (drag entre columnas)',
      descripcion: '3 columnas (Por hacer · En progreso · Hecho). Arrastra cualquier card entre columnas o reordena dentro de la misma. El estado vive en 3 senales independientes; el contador de cada columna se actualiza solo.',
      hijos: [VistaCodigo({
        vista: demoKanban(),
        codigo: `// 3 senales independientes
const tareas = {
  todo:  senal([...]),
  doing: senal([...]),
  done:  senal([...]),
};

// Estado global de drag — guarda { colId, idx } del origen
let _arrastre = null;

// onDrop en una card destino:
const origenLista = tareas[_arrastre.colId];
const destLista   = tareas[cfg.id];

if (_arrastre.colId === cfg.id) {
  // Mismo column → reordenar
  const arr = [...destLista.value];
  const [m] = arr.splice(_arrastre.idx, 1);
  arr.splice(i, 0, m);
  destLista.value = arr;
} else {
  // Cambio de column → quitar de origen, insertar en destino
  origenLista.value = origenLista.value.filter((_, k) => k !== _arrastre.idx);
  const dest = [...destLista.value];
  dest.splice(i, 0, item);
  destLista.value = dest;
}`,
      })],
    }),

    Seccion({
      titulo: '4 · Ranking numerado (Top 5)',
      descripcion: 'Cada item lleva un círculo con su posición. Top 3 reciben medallas (oro/plata/bronce). Patrón Spotify "Top tracks", concursos, leaderboards.',
      hijos: [VistaCodigo({
        vista: demoRanking(),
        codigo: `// Color de medalla según posición
const colorMedalla = i === 0 ? 'gold-gradient'
  : i === 1 ? 'silver-gradient'
  : i === 2 ? 'bronze-gradient'
  : 'plain-gray';

crearEl('span', {
  style: { background: colorMedalla, color: i < 3 ? '#fff' : 'gray' }
}, [String(i + 1)])`,
      })],
    }),

    Seccion({
      titulo: '5 · Galería de imágenes',
      descripcion: 'Grid reordenable de fotos. El destino se resalta con `box-shadow: 0 0 0 3px var(--primary)`. Badge con la posición numérica en cada esquina. `pointerEvents: none` en el `<img>` para evitar que el browser intente arrastrar la imagen nativamente.',
      hijos: [VistaCodigo({
        vista: demoGaleria(),
        codigo: `crearEl('div', { draggable: 'true' }, [
  crearEl('img', {
    src,
    draggable: 'false',                         // ← previene drag nativo del <img>
    style: { pointerEvents: 'none' },
  }),
  crearEl('span', { /* badge con índice */ }),
])

onDragover: (e) => {
  e.preventDefault();
  e.currentTarget.style.boxShadow = '0 0 0 3px var(--primary)';   // resalta destino
}`,
      })],
    }),

    Seccion({
      titulo: '6 · Bandeja de email reordenable',
      descripcion: 'Reordenar mensajes manualmente (custom prioridad por usuario). Los no-leídos llevan fondo sutil + bold + dot azul. Pattern Gmail / Linear inbox.',
      hijos: [VistaCodigo({
        vista: demoInbox(),
        codigo: `crearEl('li', {
  draggable: 'true',
  style: {
    background: it.noLeido
      ? 'color-mix(in srgb, var(--primary) 4%, var(--surface))'
      : 'var(--surface)',
  },
}, [
  Avatar({ src }),
  crearEl('div', { style: { fontWeight: it.noLeido ? 700 : 500 } }, [autor]),
  crearEl('div', null, [asunto]),
  crearEl('span', null, [tiempo]),
  it.noLeido && dotAzul,
])`,
      })],
    }),

  ],
});
