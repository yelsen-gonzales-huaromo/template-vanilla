import { crearEl } from '../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { Campo } from '../../../components/ui/input/input.js';
import { Boton } from '../../../components/ui/button/button.js';
import { Avatar } from '../../../components/ui/avatar/avatar.js';
import { Insignia } from '../../../components/ui/badge/badge.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { ComandoPaleta } from '../../../components/ui/command-palette/command-palette.js';
import { corner3 } from '../../../components/ui/card/card-decoraciones.js';

// ============================================================================
//  Helpers reusables
// ============================================================================

// Debounce — espera N ms después del último call para ejecutar fn
const debounce = (fn, ms = 300) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};

// Resaltar coincidencias — wrap matched chars en <mark>
const highlightMatch = (texto, query) => {
  if (!query) return [texto];
  const idx = texto.toLowerCase().indexOf(query.toLowerCase());
  if (idx < 0) return [texto];
  return [
    texto.slice(0, idx),
    crearEl('mark', { class: 'search-match' }, [texto.slice(idx, idx + query.length)]),
    texto.slice(idx + query.length),
  ];
};

// Container con borde estándar para los demos
const wrapperResultados = (estilos = {}) => ({
  style: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)', overflow: 'hidden',
    ...estilos,
  },
});

const FOTO = (n) => `./public/img/team/${n}.jpg`;

// Datasets mock
const FRUTAS = ['Manzana', 'Banana', 'Cereza', 'Damasco', 'Frambuesa', 'Granada', 'Mandarina', 'Naranja', 'Pera', 'Sandía', 'Uva', 'Kiwi'];

const PERSONAS = [
  { id: 1, nombre: 'María García',     email: 'maria@launchpad.dev',    rol: 'Diseñadora Senior',   dpto: 'Diseño',     foto: FOTO(1), estado: 'online' },
  { id: 2, nombre: 'Sara Chen',        email: 'sara@launchpad.dev',     rol: 'Frontend Engineer',   dpto: 'Engineering', foto: FOTO(2), estado: 'ausente' },
  { id: 3, nombre: 'Marcus Lee',       email: 'marcus@launchpad.dev',   rol: 'Backend Engineer',    dpto: 'Engineering', foto: FOTO(3), estado: 'online' },
  { id: 4, nombre: 'Lina Park',        email: 'lina@launchpad.dev',     rol: 'Data Analyst',        dpto: 'Data',       foto: FOTO(4), estado: 'ocupado' },
  { id: 5, nombre: 'Jorge Ramírez',    email: 'jorge@launchpad.dev',    rol: 'iOS Developer',       dpto: 'Mobile',     foto: FOTO(5), estado: 'offline' },
  { id: 6, nombre: 'Priya Patel',      email: 'priya@launchpad.dev',    rol: 'Eng Manager',         dpto: 'Engineering', foto: FOTO(6), estado: 'online' },
  { id: 7, nombre: 'Carlos Núñez',     email: 'carlos@launchpad.dev',   rol: 'DevOps Engineer',     dpto: 'Infra',      foto: FOTO(7), estado: 'online' },
  { id: 8, nombre: 'Eva Fernández',    email: 'eva@launchpad.dev',      rol: 'Product Designer',    dpto: 'Diseño',     foto: FOTO(8), estado: 'ausente' },
];

const PROYECTOS = [
  { id: 1, titulo: 'Launchpad Web',     desc: 'Frontend principal del producto' },
  { id: 2, titulo: 'Launchpad Mobile',  desc: 'App iOS / Android' },
  { id: 3, titulo: 'API Core',          desc: 'Backend Node.js + PostgreSQL' },
  { id: 4, titulo: 'Marketing Site',    desc: 'launchpad.dev landing y blog' },
  { id: 5, titulo: 'Documentación',     desc: 'docs.launchpad.dev — guías y API ref' },
];

const ARCHIVOS = [
  { id: 1, nombre: 'Propuesta-Q3.pdf',         tipo: 'pdf', tamano: '2.4 MB' },
  { id: 2, nombre: 'Roadmap.docx',             tipo: 'doc', tamano: '480 KB' },
  { id: 3, nombre: 'KPIs-finanzas.xlsx',       tipo: 'xls', tamano: '1.2 MB' },
  { id: 4, nombre: 'Mockup-dashboard.png',     tipo: 'img', tamano: '3.8 MB' },
];

// ============================================================================
//  1 · Filtro reactivo simple
// ============================================================================
const demoBasico = () => {
  const filtro = senal('');
  const lista = crearEl('ul', { style: { listStyle: 'none', margin: 0, padding: 0 } });

  efecto(() => {
    const q = filtro.value.trim().toLowerCase();
    const visibles = q ? FRUTAS.filter((f) => f.toLowerCase().includes(q)) : FRUTAS;
    if (!visibles.length) {
      lista.replaceChildren(crearEl('li', {
        style: { padding: 'var(--space-3)', textAlign: 'center', color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' },
      }, [`Sin coincidencias para "${q}"`]));
    } else {
      lista.replaceChildren(...visibles.map((f) => crearEl('li', {
        style: { padding: '8px var(--space-3)', fontSize: 'var(--text-sm)', borderBlockEnd: '1px solid var(--border)' },
      }, [f])));
    }
  });

  return crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' } }, [
    Campo({ type: 'search', placeholder: 'Buscar fruta…',
      onInput: (e) => { filtro.value = e.currentTarget.value; } }),
    crearEl('div', wrapperResultados(), [lista]),
  ]);
};

// ============================================================================
//  2 · Con highlight de coincidencias
// ============================================================================
const demoHighlight = () => {
  const filtro = senal('');
  const lista = crearEl('ul', { style: { listStyle: 'none', margin: 0, padding: 0 } });

  efecto(() => {
    const q = filtro.value.trim();
    const visibles = q ? FRUTAS.filter((f) => f.toLowerCase().includes(q.toLowerCase())) : FRUTAS;
    lista.replaceChildren(...(visibles.length
      ? visibles.map((f) => crearEl('li', {
          style: { padding: '8px var(--space-3)', fontSize: 'var(--text-sm)', borderBlockEnd: '1px solid var(--border)' },
        }, highlightMatch(f, q)))
      : [crearEl('li', {
          style: { padding: 'var(--space-3)', textAlign: 'center', color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' },
        }, [`Sin coincidencias para "${q}"`])]));
  });

  return crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' } }, [
    Campo({ type: 'search', placeholder: 'Tipea: "ana", "ce", "an"…',
      onInput: (e) => { filtro.value = e.currentTarget.value; } }),
    crearEl('div', wrapperResultados(), [lista]),
  ]);
};

// ============================================================================
//  3 · Con debounce (espera 350ms tras dejar de tipear)
// ============================================================================
const demoDebounce = () => {
  const filtro = senal('');
  const buscando = senal(false);

  const lista = crearEl('ul', { style: { listStyle: 'none', margin: 0, padding: 0 } });
  const indicador = crearEl('p', {
    style: { margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' },
  });

  const buscar = debounce((q) => {
    buscando.value = false;
    const visibles = q ? FRUTAS.filter((f) => f.toLowerCase().includes(q.toLowerCase())) : FRUTAS;
    lista.replaceChildren(...visibles.map((f) => crearEl('li', {
      style: { padding: '8px var(--space-3)', fontSize: 'var(--text-sm)', borderBlockEnd: '1px solid var(--border)' },
    }, highlightMatch(f, q))));
    indicador.textContent = `${visibles.length} resultado${visibles.length === 1 ? '' : 's'} para "${q}"`;
  }, 350);

  efecto(() => {
    if (filtro.value === '') {
      buscando.value = false;
      lista.replaceChildren(...FRUTAS.map((f) => crearEl('li', {
        style: { padding: '8px var(--space-3)', fontSize: 'var(--text-sm)', borderBlockEnd: '1px solid var(--border)' },
      }, [f])));
      indicador.textContent = 'Tipea para buscar (espera 350ms tras la última tecla)…';
      return;
    }
    buscando.value = true;
    indicador.textContent = `Buscando "${filtro.value}"…`;
    buscar(filtro.value);
  });

  return crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' } }, [
    Campo({ type: 'search', placeholder: 'Tipea rápido — verás "Buscando…" antes de los resultados',
      onInput: (e) => { filtro.value = e.currentTarget.value; } }),
    indicador,
    crearEl('div', wrapperResultados(), [lista]),
  ]);
};

// ============================================================================
//  4 · Con loading state (simula API request)
// ============================================================================
const demoLoading = () => {
  const filtro = senal('');
  const cargando = senal(false);
  const resultados = senal([]);

  const lista = crearEl('div');

  // Simulación: 600ms de "request" tras debounce
  const buscarRemoto = debounce((q) => {
    cargando.value = true;
    setTimeout(() => {
      resultados.value = q
        ? PERSONAS.filter((p) => p.nombre.toLowerCase().includes(q.toLowerCase()) ||
                                   p.email.toLowerCase().includes(q.toLowerCase()))
        : PERSONAS;
      cargando.value = false;
    }, 600);
  }, 350);

  efecto(() => {
    if (cargando.value) {
      lista.replaceChildren(crearEl('div', {
        style: {
          padding: 'var(--space-5)', textAlign: 'center',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)',
        },
      }, [
        crearEl('span', {
          style: {
            width: '14px', height: '14px',
            border: '2px solid color-mix(in srgb, var(--foreground) 15%, transparent)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          },
        }),
        'Buscando…',
      ]));
      return;
    }
    const items = resultados.value;
    if (!items.length && filtro.value) {
      lista.replaceChildren(crearEl('div', {
        style: { padding: 'var(--space-5)', textAlign: 'center', color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' },
      }, [`Sin resultados para "${filtro.value}"`]));
      return;
    }
    const q = filtro.value.trim();
    lista.replaceChildren(...(items.length ? items : PERSONAS).map((p) => crearEl('div', {
      style: {
        display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
        padding: 'var(--space-2) var(--space-3)',
        borderBlockEnd: '1px solid var(--border)',
      },
    }, [
      Avatar({ nombre: p.nombre, src: p.foto, tamano: 'sm' }),
      crearEl('div', { style: { flex: 1, minWidth: 0 } }, [
        crearEl('div', { style: { fontSize: 'var(--text-sm)', fontWeight: 600 } }, highlightMatch(p.nombre, q)),
        crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, highlightMatch(p.email, q)),
      ]),
    ])));
  });

  return crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' } }, [
    Campo({ type: 'search', placeholder: 'Buscar usuario (simula API con 600ms latencia)…',
      onInput: (e) => { filtro.value = e.currentTarget.value; buscarRemoto(filtro.value); } }),
    crearEl('div', wrapperResultados({ minHeight: '120px' }), [lista]),
  ]);
};

// ============================================================================
//  5 · Multi-campo (busca en nombre + email + rol + departamento)
// ============================================================================
const demoMultiCampo = () => {
  const filtro = senal('');
  const lista = crearEl('div');

  efecto(() => {
    const q = filtro.value.trim().toLowerCase();
    const visibles = q
      ? PERSONAS.filter((p) =>
          p.nombre.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.rol.toLowerCase().includes(q) ||
          p.dpto.toLowerCase().includes(q))
      : PERSONAS;

    if (!visibles.length) {
      lista.replaceChildren(crearEl('div', {
        style: { padding: 'var(--space-5)', textAlign: 'center', color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' },
      }, [`Sin resultados para "${q}"`]));
      return;
    }

    const q2 = filtro.value.trim();
    lista.replaceChildren(...visibles.map((p) => crearEl('div', {
      style: {
        display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
        padding: 'var(--space-3)', borderBlockEnd: '1px solid var(--border)',
      },
    }, [
      Avatar({ nombre: p.nombre, src: p.foto, tamano: 'md' }),
      crearEl('div', { style: { flex: 1, minWidth: 0 } }, [
        crearEl('div', { style: { fontSize: 'var(--text-sm)', fontWeight: 600 } }, highlightMatch(p.nombre, q2)),
        crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, highlightMatch(`${p.rol} · ${p.dpto}`, q2)),
      ]),
      crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } },
        highlightMatch(p.email, q2)),
    ])));
  });

  return crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' } }, [
    Campo({ type: 'search', placeholder: 'Busca por nombre, email, rol o departamento…',
      onInput: (e) => { filtro.value = e.currentTarget.value; } }),
    crearEl('div', wrapperResultados(), [lista]),
  ]);
};

// ============================================================================
//  6 · Con filtros combinados (texto + select + checkboxes)
// ============================================================================
const demoFiltros = () => {
  const filtro = senal('');
  const dpto = senal('');
  const estados = senal({ online: true, ausente: true, ocupado: true, offline: false });
  const lista = crearEl('div');

  efecto(() => {
    const q = filtro.value.trim().toLowerCase();
    const d = dpto.value;
    const e = estados.value;
    const visibles = PERSONAS.filter((p) => {
      const matchTexto = !q || p.nombre.toLowerCase().includes(q) || p.email.toLowerCase().includes(q);
      const matchDpto = !d || p.dpto === d;
      const matchEstado = e[p.estado];
      return matchTexto && matchDpto && matchEstado;
    });

    const colorEstado = {
      online: 'var(--color-success)', ausente: 'var(--color-warning)',
      ocupado: 'var(--color-danger)', offline: 'color-mix(in srgb, var(--foreground) 35%, transparent)',
    };

    if (!visibles.length) {
      lista.replaceChildren(crearEl('div', {
        style: { padding: 'var(--space-5)', textAlign: 'center', color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' },
      }, ['Sin resultados con esos filtros']));
      return;
    }
    lista.replaceChildren(...visibles.map((p) => crearEl('div', {
      style: {
        display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
        padding: 'var(--space-3)', borderBlockEnd: '1px solid var(--border)',
      },
    }, [
      crearEl('div', { style: { position: 'relative' } }, [
        Avatar({ nombre: p.nombre, src: p.foto, tamano: 'sm' }),
        crearEl('span', { style: {
          position: 'absolute', insetBlockEnd: 0, insetInlineEnd: 0,
          width: '8px', height: '8px', borderRadius: '50%',
          background: colorEstado[p.estado],
          border: '2px solid var(--surface)',
        } }),
      ]),
      crearEl('div', { style: { flex: 1 } }, [
        crearEl('div', { style: { fontSize: 'var(--text-sm)', fontWeight: 600 } }, [p.nombre]),
        crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [`${p.rol} · ${p.dpto}`]),
      ]),
    ])));
  });

  // UI controles
  const select = crearEl('select', {
    style: {
      padding: '8px 10px', fontSize: 'var(--text-sm)',
      background: 'var(--background)', color: 'var(--foreground)',
      border: '1px solid var(--border)', borderRadius: 'var(--radius)',
    },
    onChange: (e) => { dpto.value = e.currentTarget.value; },
  }, [
    crearEl('option', { value: '' }, ['Todos los departamentos']),
    ...['Diseño', 'Engineering', 'Data', 'Mobile', 'Infra'].map((d) => crearEl('option', { value: d }, [d])),
  ]);

  const checks = ['online', 'ausente', 'ocupado', 'offline'].map((est) => {
    const cb = crearEl('input', {
      type: 'checkbox', checked: estados.value[est] ? 'checked' : null,
      onChange: (e) => { estados.value = { ...estados.value, [est]: e.currentTarget.checked }; },
    });
    return crearEl('label', {
      style: { display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-xs)', cursor: 'pointer' },
    }, [cb, crearEl('span', null, [est])]);
  });

  return crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
    Campo({ type: 'search', placeholder: 'Buscar por nombre o email…',
      onInput: (e) => { filtro.value = e.currentTarget.value; } }),
    crearEl('div', { style: { display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' } }, [
      select,
      crearEl('div', { style: { display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' } }, checks),
    ]),
    crearEl('div', wrapperResultados(), [lista]),
  ]);
};

// ============================================================================
//  7 · Resultados agrupados (Personas / Proyectos / Archivos)
// ============================================================================
const demoAgrupados = () => {
  const filtro = senal('');
  const contenido = crearEl('div');

  efecto(() => {
    const q = filtro.value.trim().toLowerCase();

    const personasMatch = PERSONAS.filter((p) =>
      p.nombre.toLowerCase().includes(q) || p.email.toLowerCase().includes(q));
    const proyectosMatch = PROYECTOS.filter((p) =>
      p.titulo.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
    const archivosMatch = ARCHIVOS.filter((a) =>
      a.nombre.toLowerCase().includes(q));

    const grupos = [];
    const q2 = filtro.value.trim();

    if (!q) {
      contenido.replaceChildren(crearEl('div', {
        style: { padding: 'var(--space-5)', textAlign: 'center', color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' },
      }, ['Empieza a tipear para ver resultados agrupados por categoría']));
      return;
    }

    const totalMatches = personasMatch.length + proyectosMatch.length + archivosMatch.length;
    if (!totalMatches) {
      contenido.replaceChildren(crearEl('div', {
        style: { padding: 'var(--space-5)', textAlign: 'center', color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' },
      }, [`Sin resultados para "${q2}"`]));
      return;
    }

    if (personasMatch.length) {
      grupos.push(seccionGrupo('Personas', `${personasMatch.length}`, personasMatch.map((p) => crearEl('div', {
        style: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: '6px var(--space-3)' },
      }, [
        Avatar({ nombre: p.nombre, src: p.foto, tamano: 'xs' }),
        crearEl('div', { style: { flex: 1 } }, [
          crearEl('div', { style: { fontSize: 'var(--text-sm)' } }, highlightMatch(p.nombre, q2)),
          crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [p.rol]),
        ]),
      ]))));
    }
    if (proyectosMatch.length) {
      grupos.push(seccionGrupo('Proyectos', `${proyectosMatch.length}`, proyectosMatch.map((p) => crearEl('div', {
        style: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: '6px var(--space-3)' },
      }, [
        crearEl('span', { style: {
          width: '24px', height: '24px', borderRadius: 'var(--radius-sm)',
          background: 'color-mix(in srgb, var(--primary) 14%, transparent)',
          color: 'var(--primary)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        } }, [Icono('proyectos', { tamano: 12 })]),
        crearEl('div', { style: { flex: 1 } }, [
          crearEl('div', { style: { fontSize: 'var(--text-sm)' } }, highlightMatch(p.titulo, q2)),
          crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [p.desc]),
        ]),
      ]))));
    }
    if (archivosMatch.length) {
      const colorTipo = { pdf: '#ef4444', doc: '#3b82f6', xls: '#10b981', img: '#8b5cf6' };
      grupos.push(seccionGrupo('Archivos', `${archivosMatch.length}`, archivosMatch.map((a) => crearEl('div', {
        style: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: '6px var(--space-3)' },
      }, [
        crearEl('span', { style: {
          width: '24px', height: '24px', borderRadius: 'var(--radius-sm)',
          background: colorTipo[a.tipo], color: '#fff',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.5625rem', fontWeight: 700, textTransform: 'uppercase',
          flexShrink: 0,
        } }, [a.tipo]),
        crearEl('div', { style: { flex: 1 } }, [
          crearEl('div', { style: { fontSize: 'var(--text-sm)' } }, highlightMatch(a.nombre, q2)),
          crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [a.tamano]),
        ]),
      ]))));
    }

    contenido.replaceChildren(...grupos);
  });

  return crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' } }, [
    Campo({ type: 'search', placeholder: 'Buscar en todo el workspace (personas, proyectos, archivos)…',
      onInput: (e) => { filtro.value = e.currentTarget.value; } }),
    crearEl('div', wrapperResultados({ minHeight: '180px' }), [contenido]),
  ]);
};

// Helper para sección de grupo
const seccionGrupo = (titulo, count, items) => crearEl('div', null, [
  crearEl('div', {
    style: {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: 'var(--space-2) var(--space-3)',
      background: 'color-mix(in srgb, var(--foreground) 4%, transparent)',
      fontSize: '0.6875rem', fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.06em',
      color: 'var(--muted-foreground)',
    },
  }, [
    crearEl('span', null, [titulo]),
    crearEl('span', null, [count]),
  ]),
  crearEl('div', null, items),
]);

// ============================================================================
//  8 · Autocomplete con sugerencias (dropdown debajo del input)
// ============================================================================
const demoAutocomplete = () => {
  const filtro = senal('');
  const abierto = senal(false);
  const seleccionado = senal(0);

  const dropdown = crearEl('div', { style: {
    position: 'absolute', insetBlockStart: 'calc(100% + 4px)', insetInline: 0,
    background: 'var(--surface-elevated)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
    maxHeight: '240px', overflowY: 'auto', zIndex: 10, display: 'none',
  } });

  let sugerenciasActuales = [];

  const refrescar = () => {
    const q = filtro.value.trim().toLowerCase();
    if (!q) { dropdown.style.display = 'none'; return; }
    sugerenciasActuales = FRUTAS.filter((f) => f.toLowerCase().includes(q)).slice(0, 6);
    if (!sugerenciasActuales.length) {
      dropdown.style.display = 'block';
      dropdown.replaceChildren(crearEl('div', {
        style: { padding: 'var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', textAlign: 'center' },
      }, [`Sin sugerencias para "${q}"`]));
      return;
    }
    seleccionado.value = 0;
    dropdown.style.display = 'block';
    dropdown.replaceChildren(...sugerenciasActuales.map((f, i) => crearEl('div', {
      'data-i': String(i),
      style: { padding: '8px var(--space-3)', fontSize: 'var(--text-sm)', cursor: 'pointer' },
      onMouseenter: () => { seleccionado.value = i; },
      onClick: () => seleccionar(f),
    }, highlightMatch(f, filtro.value))));
  };

  efecto(() => {
    Array.from(dropdown.children).forEach((el, i) => {
      el.style.background = i === seleccionado.value
        ? 'color-mix(in srgb, var(--primary) 12%, transparent)' : '';
    });
  });

  const seleccionar = (txt) => {
    filtro.value = txt;
    input.value = txt;
    dropdown.style.display = 'none';
    abierto.value = false;
  };

  const input = crearEl('input', {
    type: 'search', placeholder: 'Tipea: Man, Ban, Cer… (↑↓ para navegar, Enter para seleccionar)',
    style: {
      width: '100%', padding: '10px 14px', fontSize: 'var(--text-sm)',
      background: 'var(--background)', color: 'var(--foreground)',
      border: '1px solid var(--border)', borderRadius: 'var(--radius)',
      fontFamily: 'inherit',
    },
    onInput: (e) => { filtro.value = e.currentTarget.value; refrescar(); },
    onFocus: () => { abierto.value = true; refrescar(); },
    onBlur: () => { setTimeout(() => { dropdown.style.display = 'none'; }, 150); },
    onKeydown: (e) => {
      if (!sugerenciasActuales.length) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); seleccionado.value = (seleccionado.value + 1) % sugerenciasActuales.length; }
      else if (e.key === 'ArrowUp') { e.preventDefault(); seleccionado.value = (seleccionado.value - 1 + sugerenciasActuales.length) % sugerenciasActuales.length; }
      else if (e.key === 'Enter') { e.preventDefault(); seleccionar(sugerenciasActuales[seleccionado.value]); }
      else if (e.key === 'Escape') { dropdown.style.display = 'none'; }
    },
  });

  return crearEl('div', { style: { position: 'relative' } }, [input, dropdown]);
};

// ============================================================================
//  9 · Recent searches + sugerencias
// ============================================================================
const demoRecientes = () => {
  const filtro = senal('');
  const recientes = senal(['React hooks', 'launchpad pricing', 'María García', 'cómo desplegar']);
  const dropdown = crearEl('div');

  efecto(() => {
    const q = filtro.value.trim();

    if (!q) {
      // Sin query: mostrar recientes + sugerencias rápidas
      dropdown.replaceChildren(
        seccionGrupo('Recientes', `${recientes.value.length}`,
          recientes.value.map((r) => crearEl('div', {
            style: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px var(--space-3)', cursor: 'pointer' },
            onClick: () => { filtro.value = r; input.value = r; },
          }, [
            Icono('reloj', { tamano: 14 }),
            crearEl('span', { style: { flex: 1, fontSize: 'var(--text-sm)' } }, [r]),
            crearEl('button', {
              type: 'button', 'aria-label': 'Quitar',
              style: { background: 'transparent', border: 0, cursor: 'pointer', color: 'var(--muted-foreground)' },
              onClick: (e) => {
                e.stopPropagation();
                recientes.value = recientes.value.filter((x) => x !== r);
              },
            }, [Icono('cerrar', { tamano: 14 })]),
          ]))),
        seccionGrupo('Sugerencias', '4',
          ['Documentación', 'Tutoriales', 'API reference', 'Discord community'].map((s) => crearEl('div', {
            style: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px var(--space-3)', cursor: 'pointer' },
          }, [
            Icono('brillos', { tamano: 14 }),
            crearEl('span', { style: { fontSize: 'var(--text-sm)' } }, [s]),
          ]))),
      );
      return;
    }

    // Con query: filtrar y permitir agregar a recientes al "buscar"
    const matches = [...PERSONAS, ...PROYECTOS].filter((it) =>
      (it.nombre || it.titulo).toLowerCase().includes(q.toLowerCase()));

    if (!matches.length) {
      dropdown.replaceChildren(crearEl('div', {
        style: { padding: 'var(--space-4)', textAlign: 'center', color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' },
      }, [`Sin resultados para "${q}"`]));
      return;
    }
    dropdown.replaceChildren(...matches.slice(0, 6).map((it) => crearEl('div', {
      style: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px var(--space-3)', cursor: 'pointer' },
    }, [
      Icono(it.nombre ? 'perfil' : 'proyectos', { tamano: 14 }),
      crearEl('span', { style: { fontSize: 'var(--text-sm)' } }, highlightMatch(it.nombre || it.titulo, q)),
    ])));
  });

  const input = Campo({ type: 'search', placeholder: 'Click aquí para ver recientes y sugerencias…',
    onInput: (e) => { filtro.value = e.currentTarget.value; } });

  return crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' } }, [
    input,
    crearEl('div', wrapperResultados({ minHeight: '200px' }), [dropdown]),
  ]);
};

// ============================================================================
//  Página
// ============================================================================
export default async () => PaginaShowcase({
  titulo: 'Búsqueda',
  descripcion: 'Patrones de búsqueda reactiva con `senal` + `efecto`. 9 patrones del mundo real: filtro live, highlight de coincidencias, debounce, loading state, multi-campo, filtros combinados, resultados agrupados, autocomplete con teclado, recientes + sugerencias, y command palette.',
  decoracion: corner3(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    Seccion({
      titulo: '1 · Filtro reactivo simple',
      descripcion: 'Tipear actualiza la lista al instante. Sin debounce — funciona perfecto para datasets pequeños (< 500 items) en memoria.',
      hijos: [VistaCodigo({
        vista: demoBasico(),
        codigo: `const filtro = senal('');

efecto(() => {
  const q = filtro.value.trim().toLowerCase();
  const visibles = q ? items.filter(i => i.toLowerCase().includes(q)) : items;
  lista.replaceChildren(...visibles.map(renderItem));
});

Campo({ type: 'search',
  onInput: e => { filtro.value = e.currentTarget.value; } })`,
      })],
    }),

    Seccion({
      titulo: '2 · Highlight de coincidencias',
      descripcion: 'Las letras que matchean se envuelven en `<mark>` con bg amarillo. Mucho más legible — el ojo encuentra el resultado correcto al instante.',
      hijos: [VistaCodigo({
        vista: demoHighlight(),
        codigo: `const highlightMatch = (texto, query) => {
  if (!query) return [texto];
  const idx = texto.toLowerCase().indexOf(query.toLowerCase());
  if (idx < 0) return [texto];
  return [
    texto.slice(0, idx),
    crearEl('mark', null, [texto.slice(idx, idx + query.length)]),
    texto.slice(idx + query.length),
  ];
};

// Render: spread los nodes en el item
crearEl('li', null, highlightMatch(fruta, query))`,
      })],
    }),

    Seccion({
      titulo: '3 · Con debounce (350ms)',
      descripcion: 'No filtra inmediatamente — espera 350ms tras la última tecla antes de ejecutar la búsqueda. Para datasets grandes o búsquedas costosas (regex complejas, fuzzy match).',
      hijos: [VistaCodigo({
        vista: demoDebounce(),
        codigo: `const debounce = (fn, ms = 300) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};

const buscar = debounce((q) => {
  // ejecutar búsqueda
  resultados.value = items.filter(...);
}, 350);

onInput: (e) => buscar(e.currentTarget.value)`,
      })],
    }),

    Seccion({
      titulo: '4 · Con loading state (simula API)',
      descripcion: 'Para búsquedas que llaman al backend. Spinner mientras esperamos, lista cuando llega. Combina debounce (no spammear el backend) + loading (UX).',
      hijos: [VistaCodigo({
        vista: demoLoading(),
        codigo: `const cargando = senal(false);
const resultados = senal([]);

const buscarRemoto = debounce(async (q) => {
  cargando.value = true;
  try {
    resultados.value = await fetch(\`/api/buscar?q=\${q}\`).then(r => r.json());
  } finally {
    cargando.value = false;
  }
}, 350);

efecto(() => {
  if (cargando.value) lista.replaceChildren(spinner);
  else lista.replaceChildren(...resultados.value.map(renderItem));
});`,
      })],
    }),

    Seccion({
      titulo: '5 · Multi-campo (busca en varias propiedades)',
      descripcion: 'Una sola query busca en `nombre`, `email`, `rol` y `departamento` simultáneamente. Usuario tipea "diseño" y aparecen las personas con ese departamento aunque su nombre no contenga la palabra.',
      hijos: [VistaCodigo({
        vista: demoMultiCampo(),
        codigo: `efecto(() => {
  const q = filtro.value.trim().toLowerCase();
  const visibles = personas.filter(p =>
    p.nombre.toLowerCase().includes(q) ||
    p.email.toLowerCase().includes(q)  ||
    p.rol.toLowerCase().includes(q)    ||
    p.dpto.toLowerCase().includes(q)
  );
});`,
      })],
    }),

    Seccion({
      titulo: '6 · Con filtros combinados',
      descripcion: 'Texto + dropdown de departamento + checkboxes de estado de presencia. Todos los filtros se combinan con AND. Patrón estándar de tablas/dashboards filtrables.',
      hijos: [VistaCodigo({
        vista: demoFiltros(),
        codigo: `const filtro  = senal('');
const dpto    = senal('');
const estados = senal({ online: true, ausente: true, ocupado: true, offline: false });

efecto(() => {
  const visibles = personas.filter(p => {
    const matchTexto  = !filtro.value || p.nombre.includes(filtro.value);
    const matchDpto   = !dpto.value || p.dpto === dpto.value;
    const matchEstado = estados.value[p.estado];
    return matchTexto && matchDpto && matchEstado;     // AND
  });
});`,
      })],
    }),

    Seccion({
      titulo: '7 · Resultados agrupados (Personas / Proyectos / Archivos)',
      descripcion: 'Una sola búsqueda global devuelve resultados de varias categorías agrupados con headers. Patrón Notion / Linear / Slack — el usuario no especifica QUÉ busca, sólo qué texto.',
      hijos: [VistaCodigo({
        vista: demoAgrupados(),
        codigo: `efecto(() => {
  const q = filtro.value.toLowerCase();

  const personasMatch = personas.filter(p => p.nombre.includes(q));
  const proyectosMatch = proyectos.filter(p => p.titulo.includes(q));
  const archivosMatch = archivos.filter(a => a.nombre.includes(q));

  contenido.replaceChildren(
    ...personasMatch.length  ? [seccionGrupo('Personas',  personasMatch)] : [],
    ...proyectosMatch.length ? [seccionGrupo('Proyectos', proyectosMatch)] : [],
    ...archivosMatch.length  ? [seccionGrupo('Archivos',  archivosMatch)] : [],
  );
});`,
      })],
    }),

    Seccion({
      titulo: '8 · Autocomplete (dropdown + teclado ↑↓ Enter)',
      descripcion: 'Sugerencias en un dropdown debajo del input. Navegación con `↑` / `↓`, seleccionar con `Enter`, cerrar con `Esc`. El item resaltado tiene fondo primary.',
      hijos: [VistaCodigo({
        vista: demoAutocomplete(),
        codigo: `onKeydown: (e) => {
  if (e.key === 'ArrowDown') { seleccionado.value = (seleccionado.value + 1) % sugerencias.length; }
  else if (e.key === 'ArrowUp') { seleccionado.value = (seleccionado.value - 1 + n) % n; }
  else if (e.key === 'Enter') { seleccionar(sugerencias[seleccionado.value]); }
  else if (e.key === 'Escape') { dropdown.style.display = 'none'; }
}`,
      })],
    }),

    Seccion({
      titulo: '9 · Recientes + sugerencias',
      descripcion: 'Cuando el input está vacío, muestra "Recientes" (con `×` para borrar individualmente) + "Sugerencias" (queries populares o links rápidos). Al tipear, cambia a resultados normales. Patrón Google search bar / Spotlight.',
      hijos: [VistaCodigo({
        vista: demoRecientes(),
        codigo: `efecto(() => {
  if (!filtro.value) {
    // Estado vacío: recientes + sugerencias
    dropdown.replaceChildren(
      seccionGrupo('Recientes',    recientes.value.map(renderReciente)),
      seccionGrupo('Sugerencias', sugerencias.map(renderSugerencia)),
    );
  } else {
    // Estado con query: resultados filtrados
    dropdown.replaceChildren(...matches.map(renderResultado));
  }
});`,
      })],
    }),

    Seccion({
      titulo: '10 · Command palette (⌘K)',
      descripcion: 'Búsqueda global con atajo de teclado. Combina autocomplete + agrupados + acciones rápidas. Ya integrado en Launchpad — disponible desde cualquier página.',
      hijos: [VistaCodigo({
        vista: Boton({
          texto: 'Abrir command palette',
          variante: 'primary',
          icono: Icono('busqueda', { tamano: 16 }),
          onClick: () => ComandoPaleta.abrir(),
        }),
        codigo: `import { ComandoPaleta } from '.../command-palette/command-palette.js';

ComandoPaleta.abrir()                          // imperativo

// O usar el atajo: ⌘K (Mac) / Ctrl+K (Win/Linux)
// Ya está enganchado globalmente en index.js`,
      })],
    }),

  ],
});
