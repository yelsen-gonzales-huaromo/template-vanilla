/**
 * Helpers compartidos para las páginas de Font Awesome / Bootstrap / Feather /
 * Material Symbols. Todas necesitan: hero stats · catálogo filtrable · recipes
 * (sidebar/botones/KPI/estado/toolbar) · selector de tamaño · click-to-copy.
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { Boton } from '../../../components/ui/button/button.js';

// ============================================================================
//  HeroBanner — top de cada página con paleta + stats + install snippet
// ============================================================================
export const HeroBanner = ({
  marca,
  color,
  paleta,
  version,
  totalIconos,
  licencia,
  pesoCdn,
  install,
  preview,
} = {}) => crearEl('div', {
  style: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 'var(--space-4)',
    padding: 'var(--space-5)',
    background: paleta || `linear-gradient(135deg, color-mix(in srgb, ${color} 14%, transparent), color-mix(in srgb, ${color} 4%, transparent))`,
    borderRadius: 'var(--radius-md)',
    border: `1px solid color-mix(in srgb, ${color} 22%, var(--border))`,
  },
}, [
  crearEl('div', null, [
    crearEl('div', { style: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: color, color: '#fff', borderRadius: '999px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' } },
      [marca]),
    crearEl('h2', { style: { margin: '12px 0 6px', fontSize: 'var(--text-2xl)', fontWeight: 800, letterSpacing: '-0.02em' } }, [marca, ' ', crearEl('span', { style: { color: 'var(--muted-foreground)', fontWeight: 600 } }, ['v' + version])]),
    crearEl('div', { style: { color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', lineHeight: 1.55, marginBlockEnd: 'var(--space-3)' } }, [install.descripcion]),
    crearEl('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [
      crearEl('span', null, ['📦 ', crearEl('strong', { style: { color: 'var(--foreground)' } }, [String(totalIconos), ' iconos'])]),
      crearEl('span', null, ['⚖️ ', crearEl('strong', { style: { color: 'var(--foreground)' } }, [licencia])]),
      crearEl('span', null, ['📊 ', crearEl('strong', { style: { color: 'var(--foreground)' } }, [pesoCdn])]),
    ]),
  ]),
  crearEl('div', null, [
    crearEl('div', { style: { fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBlockEnd: '8px' } },
      ['Instalación']),
    crearEl('pre', {
      style: {
        margin: 0, padding: 'var(--space-3)',
        background: '#0f172a', color: '#e2e8f0',
        borderRadius: 'var(--radius)',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: '12px',
        lineHeight: 1.5,
        overflow: 'auto',
      },
    }, [
      crearEl('span', { style: { color: '#64748b' } }, ['<!-- via CDN -->\n']),
      install.snippet + '\n\n',
      crearEl('span', { style: { color: '#64748b' } }, ['<!-- uso -->\n']),
      install.uso,
    ]),
    preview && crearEl('div', {
      style: {
        marginBlockStart: 'var(--space-3)',
        padding: 'var(--space-3)',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        display: 'flex', flexWrap: 'wrap', gap: '12px',
        alignItems: 'center', justifyContent: 'center',
      },
    }, preview),
  ]),
]);

// ============================================================================
//  RecipeShelf — caja con título + cuerpo del ejemplo de uso
// ============================================================================
export const Receta = ({ titulo, descripcion, hijo }) => crearEl('div', {
  style: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-3) var(--space-4)',
    display: 'flex', flexDirection: 'column', gap: '10px',
  },
}, [
  crearEl('div', null, [
    crearEl('div', { style: { fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' } }, [titulo]),
    descripcion && crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBlockStart: '2px' } }, [descripcion]),
  ]),
  hijo,
]);

// ============================================================================
//  Catálogo filtrable + selector de tamaño + click-to-copy
//
//  iconos: array de nombres (string)
//  render(nombre, tamano) => HTMLElement       — pinta el icono dado
//  obtenerCodigo(nombre)  => string            — texto que se copia al click
// ============================================================================
export const Catalogo = ({
  iconos,
  render,
  obtenerCodigo,
  variantes,                     // [{ id, etiqueta, render? }]
  variantePorDefecto,
  color,
}) => {
  const filtro = senal('');
  const tamano = senal(28);
  const variante = senal(variantePorDefecto || (variantes?.[0]?.id ?? null));
  const copiado = senal(null);

  const TAMANOS = [16, 20, 24, 28, 32, 40, 48];

  // ----- Header con búsqueda + tamaño + variante -----
  const inputBusqueda = crearEl('input', {
    type: 'search',
    placeholder: `Buscar entre ${iconos.length} iconos…`,
    value: '',
    style: {
      flex: 1, minWidth: '180px',
      padding: '8px 12px',
      background: 'var(--background)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      fontSize: 'var(--text-sm)', color: 'var(--foreground)',
      outline: 'none',
    },
    onInput: (e) => { filtro.value = e.currentTarget.value.toLowerCase(); },
  });

  const selectorTamano = crearEl('div', {
    style: {
      display: 'inline-flex', padding: '3px',
      background: 'var(--background)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', gap: '2px',
    },
  });
  TAMANOS.forEach((s) => {
    const b = crearEl('button', {
      style: {
        border: 0, padding: '5px 10px', borderRadius: '5px',
        background: 'transparent', cursor: 'pointer',
        fontSize: '12px', fontWeight: 700,
        color: 'var(--muted-foreground)',
        fontVariantNumeric: 'tabular-nums',
      },
      onClick: () => { tamano.value = s; },
    }, [String(s)]);
    efecto(() => {
      const activo = tamano.value === s;
      b.style.background = activo ? color : 'transparent';
      b.style.color = activo ? '#fff' : 'var(--muted-foreground)';
    });
    selectorTamano.appendChild(b);
  });

  let selectorVar = null;
  if (variantes && variantes.length > 1) {
    selectorVar = crearEl('div', {
      style: {
        display: 'inline-flex', padding: '3px',
        background: 'var(--background)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', gap: '2px',
      },
    });
    variantes.forEach((v) => {
      const b = crearEl('button', {
        style: {
          border: 0, padding: '6px 12px', borderRadius: '5px',
          background: 'transparent', cursor: 'pointer',
          fontSize: '12px', fontWeight: 700,
          color: 'var(--muted-foreground)',
        },
        onClick: () => { variante.value = v.id; },
      }, [v.etiqueta]);
      efecto(() => {
        const activo = variante.value === v.id;
        b.style.background = activo ? color : 'transparent';
        b.style.color = activo ? '#fff' : 'var(--muted-foreground)';
      });
      selectorVar.appendChild(b);
    });
  }

  const header = crearEl('div', {
    style: {
      display: 'flex', flexWrap: 'wrap', gap: '8px',
      alignItems: 'center', marginBlockEnd: 'var(--space-3)',
    },
  }, [inputBusqueda, selectorVar, selectorTamano]);

  // ----- Grid -----
  const grid = crearEl('div', {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
      gap: '6px',
      maxHeight: '520px',
      overflow: 'auto',
      padding: '4px',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface)',
    },
  });

  const contadorResultados = crearEl('div', {
    style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBlockStart: '6px' },
  }, [`Mostrando ${iconos.length} de ${iconos.length}`]);

  // ----- Renderizar grid -----
  const construirGrid = () => {
    const q = filtro.value.trim();
    const lista = q
      ? iconos.filter((n) => n.toLowerCase().includes(q))
      : iconos;
    contadorResultados.textContent = `Mostrando ${lista.length} de ${iconos.length}`;

    grid.replaceChildren(...lista.slice(0, 600).map((nombre) => {
      const renderer = (variantes?.find((v) => v.id === variante.value)?.render) || render;
      const iconoEl = renderer(nombre, tamano.value);
      const codigo = obtenerCodigo(nombre, variante.value);

      const cel = crearEl('button', {
        type: 'button', title: codigo,
        style: {
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: '6px',
          padding: '12px 6px',
          background: 'transparent', border: '1px solid transparent',
          borderRadius: 'var(--radius)', cursor: 'pointer',
          color: 'var(--foreground)',
          transition: 'all 140ms ease',
          minHeight: '78px',
        },
        onMouseEnter: (e) => { e.currentTarget.style.background = `color-mix(in srgb, ${color} 8%, transparent)`; e.currentTarget.style.borderColor = `color-mix(in srgb, ${color} 30%, var(--border))`; },
        onMouseLeave: (e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; },
        onClick: () => {
          navigator.clipboard?.writeText(codigo).catch(() => {});
          copiado.value = nombre;
          setTimeout(() => { if (copiado.peek() === nombre) copiado.value = null; }, 1200);
        },
      }, [
        iconoEl,
        crearEl('span', {
          style: { fontSize: '10.5px', color: 'var(--muted-foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' },
        }, [nombre]),
      ]);

      efecto(() => {
        if (copiado.value === nombre) {
          cel.style.background = `color-mix(in srgb, var(--color-success) 18%, transparent)`;
          cel.style.borderColor = 'var(--color-success)';
        }
      });

      return cel;
    }));

    if (lista.length === 0) {
      grid.replaceChildren(crearEl('div', {
        style: { gridColumn: '1 / -1', padding: 'var(--space-5)', textAlign: 'center', color: 'var(--muted-foreground)' },
      }, ['Sin resultados para "', q, '"']));
    }
  };

  efecto(() => {
    filtro.value; tamano.value; variante.value;
    construirGrid();
  });

  // Toast feedback al copiar
  const toastCopiado = crearEl('div', {
    style: {
      position: 'fixed',
      insetBlockEnd: '24px', insetInlineStart: '50%',
      transform: 'translateX(-50%) translateY(20px)',
      padding: '10px 16px',
      background: '#0f172a', color: '#fff',
      borderRadius: 'var(--radius)',
      fontSize: 'var(--text-sm)', fontWeight: 600,
      boxShadow: '0 12px 32px -8px rgba(0,0,0,0.3)',
      opacity: 0,
      transition: 'opacity 200ms ease, transform 200ms ease',
      pointerEvents: 'none',
      zIndex: 9999,
    },
  }, ['']);
  efecto(() => {
    if (copiado.value) {
      toastCopiado.textContent = `📋 Copiado: ${obtenerCodigo(copiado.value, variante.value)}`;
      toastCopiado.style.opacity = '1';
      toastCopiado.style.transform = 'translateX(-50%) translateY(0)';
    } else {
      toastCopiado.style.opacity = '0';
      toastCopiado.style.transform = 'translateX(-50%) translateY(20px)';
    }
  });
  if (!document.body.contains(toastCopiado)) document.body.appendChild(toastCopiado);

  return crearEl('div', null, [header, grid, contadorResultados]);
};

// ============================================================================
//  Recipes pre-armados (mocks de UI con iconos)
// ============================================================================

// Sidebar con icono+label
export const RecipeSidebar = ({ render, items, color }) => crearEl('div', {
  style: {
    width: '100%', maxWidth: '260px',
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)', padding: 'var(--space-2)',
    display: 'flex', flexDirection: 'column', gap: '2px',
  },
}, items.map((it, i) => crearEl('div', {
  style: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '8px 10px', borderRadius: 'var(--radius)',
    background: i === 0 ? `color-mix(in srgb, ${color} 14%, transparent)` : 'transparent',
    color: i === 0 ? color : 'var(--foreground)',
    fontSize: 'var(--text-sm)', fontWeight: i === 0 ? 700 : 500,
  },
}, [
  render(it.icono, 16),
  it.etiqueta,
  it.badge && crearEl('span', { style: { marginInlineStart: 'auto', padding: '1px 8px', background: color, color: '#fff', borderRadius: '999px', fontSize: '10px', fontWeight: 800 } }, [it.badge]),
])));

// Grupo de botones con icono
export const RecipeBotones = ({ render, items, color }) => crearEl('div', {
  style: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
}, items.map((it) => crearEl('button', {
  style: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    padding: '8px 14px',
    background: it.primario ? color : 'var(--surface)',
    color: it.primario ? '#fff' : 'var(--foreground)',
    border: it.primario ? '1px solid transparent' : '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    fontSize: 'var(--text-sm)', fontWeight: 600, cursor: 'pointer',
  },
}, [render(it.icono, 14), it.etiqueta])));

// KPI cards con icono header
export const RecipeKPI = ({ render, items, color }) => crearEl('div', {
  style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-3)' },
}, items.map((it) => crearEl('div', {
  style: {
    padding: 'var(--space-3) var(--space-4)',
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    display: 'flex', flexDirection: 'column', gap: '8px',
  },
}, [
  crearEl('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } }, [
    crearEl('span', {
      style: { width: '36px', height: '36px', borderRadius: '8px', background: `color-mix(in srgb, ${it.color || color} 16%, transparent)`, color: it.color || color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
    }, [render(it.icono, 18)]),
    crearEl('span', { style: { fontSize: '11px', fontWeight: 700, color: it.delta?.startsWith('+') ? '#10b981' : it.delta?.startsWith('-') ? '#ef4444' : 'var(--muted-foreground)' } }, [it.delta || '']),
  ]),
  crearEl('div', null, [
    crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontWeight: 600 } }, [it.label]),
    crearEl('div', { style: { fontSize: 'var(--text-xl)', fontWeight: 800, lineHeight: 1.2 } }, [it.valor]),
  ]),
])));

// Status badges
export const RecipeBadges = ({ render }) => crearEl('div', {
  style: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
}, [
  ['#10b981', 'Activo', 'check'],
  ['#f59e0b', 'Pendiente', 'reloj'],
  ['#ef4444', 'Rechazado', 'cerrar'],
  ['#3b82f6', 'En revisión', 'ojo'],
  ['#8b5cf6', 'Premium', 'estrella'],
].map(([col, t, ic]) => crearEl('span', {
  style: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: `color-mix(in srgb, ${col} 16%, transparent)`, color: col, borderRadius: '999px', fontSize: '12px', fontWeight: 700 },
}, [render(ic, 12), t])));

// Toolbar
export const RecipeToolbar = ({ render, items, color }) => crearEl('div', {
  style: {
    display: 'inline-flex', padding: '4px',
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', gap: '2px',
  },
}, items.map((it, i) => crearEl('button', {
  style: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: '34px', height: '34px',
    background: i === 0 ? `color-mix(in srgb, ${color} 14%, transparent)` : 'transparent',
    color: i === 0 ? color : 'var(--foreground)',
    border: 0, borderRadius: '6px', cursor: 'pointer',
  },
  title: it.titulo,
}, [render(it.icono, 16)])));

// Empty state
export const RecipeEmptyState = ({ render, icono, titulo, descripcion, color }) => crearEl('div', {
  style: {
    padding: 'var(--space-6)',
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    textAlign: 'center',
  },
}, [
  crearEl('div', {
    style: { width: '64px', height: '64px', borderRadius: '999px', margin: '0 auto var(--space-3)', background: `color-mix(in srgb, ${color} 14%, transparent)`, color, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  }, [render(icono, 28)]),
  crearEl('h4', { style: { margin: '0 0 4px', fontSize: 'var(--text-base)', fontWeight: 700 } }, [titulo]),
  crearEl('div', { style: { color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' } }, [descripcion]),
]);

// Notificación pill
export const RecipeNotificacion = ({ render, color }) => crearEl('div', {
  style: {
    display: 'flex', alignItems: 'flex-start', gap: '12px',
    padding: 'var(--space-3) var(--space-4)',
    background: `color-mix(in srgb, ${color} 8%, var(--surface))`,
    border: `1px solid color-mix(in srgb, ${color} 25%, var(--border))`,
    borderInlineStart: `4px solid ${color}`,
    borderRadius: 'var(--radius-md)',
  },
}, [
  crearEl('span', {
    style: { width: '32px', height: '32px', borderRadius: '50%', background: color, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  }, [render('alerta', 16)]),
  crearEl('div', { style: { flex: 1 } }, [
    crearEl('div', { style: { fontWeight: 700, fontSize: 'var(--text-sm)' } }, ['Nueva actualización disponible']),
    crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBlockStart: '2px' } }, ['Versión 2.4 lista. Reinicia para aplicar los cambios.']),
  ]),
]);

// Tamaños comparativa
export const SeccionTamanos = ({ render, icono, color }) => crearEl('div', {
  style: {
    display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
    padding: 'var(--space-4)',
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    flexWrap: 'wrap',
  },
}, [12, 16, 20, 24, 32, 40, 48, 64].map((s) => crearEl('div', {
  style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: '60px' },
}, [
  crearEl('div', { style: { color, height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, [render(icono, s)]),
  crearEl('span', { style: { fontSize: '11px', color: 'var(--muted-foreground)', fontVariantNumeric: 'tabular-nums', fontWeight: 700 } }, [s, 'px']),
])));

// Colores
export const SeccionColores = ({ render, icono }) => crearEl('div', {
  style: {
    display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)',
    padding: 'var(--space-4)',
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    alignItems: 'center', justifyContent: 'center',
  },
}, [
  ['Primary',  'var(--primary)'],
  ['Success',  '#10b981'],
  ['Warning',  '#f59e0b'],
  ['Danger',   '#ef4444'],
  ['Info',     '#06b6d4'],
  ['Purple',   '#8b5cf6'],
  ['Gradient', 'linear-gradient(135deg, #06b6d4, #8b5cf6)'],
].map(([nombre, col]) => crearEl('div', {
  style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: '70px' },
}, [
  crearEl('div', {
    style: {
      width: '52px', height: '52px',
      borderRadius: '999px',
      background: col.startsWith('linear') ? col : `color-mix(in srgb, ${col} 14%, transparent)`,
      color: col.startsWith('linear') ? '#fff' : col,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
  }, [render(icono, 22)]),
  crearEl('span', { style: { fontSize: '11px', color: 'var(--muted-foreground)', fontWeight: 700 } }, [nombre]),
])));
