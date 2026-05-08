/**
 * Scrollspy — resalta el item de nav según la sección visible.
 * Usa IntersectionObserver (no `scroll` listener) — más eficiente y reactivo.
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { corner6 } from '../../../components/ui/card/card-decoraciones.js';

// ============================================================================
//  Helper: hook reusable de scrollspy
// ============================================================================
const usarScrollspy = ({ panel, threshold = 0.4 }) => {
  const activo = senal(null);
  const observer = new IntersectionObserver((entries) => {
    const visibles = entries.filter((e) => e.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (visibles[0]) activo.value = visibles[0].target.dataset.id;
  }, { root: panel, threshold });
  requestAnimationFrame(() => {
    const items = panel.querySelectorAll('[data-id]');
    items.forEach((s) => observer.observe(s));
    if (items[0]) activo.value = items[0].dataset.id;
  });
  return activo;
};

// Helper: progreso de scroll (0..1) de un panel
const usarScrollProgreso = (panel) => {
  const progreso = senal(0);
  const calcular = () => {
    const max = panel.scrollHeight - panel.clientHeight;
    progreso.value = max > 0 ? panel.scrollTop / max : 0;
  };
  panel.addEventListener('scroll', calcular, { passive: true });
  requestAnimationFrame(calcular);
  return progreso;
};

// ============================================================================
//  Cuerpo lorem reusable para los demos
// ============================================================================
const lorem = (titulo, parrafos = 2) => crearEl('section', {
  'data-id': titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  style: { paddingBlock: 'var(--space-2) var(--space-6)' },
}, [
  crearEl('h3', { style: { margin: '0 0 var(--space-2)', fontSize: 'var(--text-base)' } }, [titulo]),
  ...Array.from({ length: parrafos }, () => crearEl('p', {
    style: { margin: '0 0 var(--space-2)', color: 'var(--muted-foreground)', lineHeight: 1.6 },
  }, [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. ' +
    'Cras venenatis euismod malesuada. Nullam ac erat ante. Sed sapien quam. Curabitur vehicula viverra urna. ' +
    'Praesent vitae nisi sed quam ornare sodales. Donec eu metus ut nibh tempor ultricies.',
  ])),
]);

const SECCIONES_BASICAS = ['Introducción', 'Arquitectura', 'Componentes', 'Temas', 'Internacionalización'];
const slugify = (txt) => txt.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-');

// ============================================================================
//  Demo 1 — TOC sidebar clásico
// ============================================================================
const demoBasico = () => {
  const panel = crearEl('div', {
    class: 'scroll-discreto',
    style: {
      maxHeight: '320px', overflowY: 'auto', padding: 'var(--space-3)',
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
    },
  }, SECCIONES_BASICAS.map((t) => lorem(t, 2)));

  const activo = usarScrollspy({ panel });

  const navItems = SECCIONES_BASICAS.map((t) => {
    const id = slugify(t);
    return crearEl('a', {
      href: `#${id}`,
      style: {
        display: 'block', padding: '6px var(--space-3)',
        fontSize: 'var(--text-sm)', textDecoration: 'none',
        borderRadius: 'var(--radius-sm)',
        transition: 'background-color var(--transition-fast), color var(--transition-fast)',
        color: 'var(--muted-foreground)',
      },
      onClick: (e) => {
        e.preventDefault();
        panel.querySelector(`[data-id="${id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      },
    }, [t]);
  });

  efecto(() => {
    navItems.forEach((el, i) => {
      const esta = slugify(SECCIONES_BASICAS[i]) === activo.value;
      el.style.background = esta ? 'color-mix(in srgb, var(--primary) 12%, transparent)' : 'transparent';
      el.style.color = esta ? 'var(--primary)' : 'var(--muted-foreground)';
      el.style.fontWeight = esta ? '600' : '400';
    });
  });

  return crearEl('div', {
    style: { display: 'grid', gridTemplateColumns: '160px 1fr', gap: 'var(--space-4)' },
  }, [
    crearEl('nav', {
      style: { display: 'flex', flexDirection: 'column', gap: '2px', position: 'sticky', top: 0 },
    }, navItems),
    panel,
  ]);
};

// ============================================================================
//  Demo 2 — Con sub-secciones anidadas (TOC jerárquico)
// ============================================================================
const demoAnidado = () => {
  const SECCIONES = [
    { titulo: 'Empezando', sub: ['Instalación', 'Primer proyecto', 'Estructura de carpetas'] },
    { titulo: 'Componentes', sub: ['Botones', 'Formularios', 'Modales'] },
    { titulo: 'Avanzado',  sub: ['Reactividad', 'Routing', 'Performance'] },
  ];
  // Aplanar para el panel
  const todos = SECCIONES.flatMap((s) => [s.titulo, ...s.sub]);

  const panel = crearEl('div', {
    class: 'scroll-discreto',
    style: {
      maxHeight: '360px', overflowY: 'auto', padding: 'var(--space-3)',
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
    },
  }, todos.map((t) => lorem(t, 1)));

  const activo = usarScrollspy({ panel });

  const navNodos = [];
  const linkParaId = new Map();

  SECCIONES.forEach((s) => {
    const idPadre = slugify(s.titulo);
    const link = crearEl('a', {
      href: `#${idPadre}`,
      style: {
        display: 'block', padding: '6px var(--space-3)',
        fontSize: 'var(--text-sm)', fontWeight: 600,
        textDecoration: 'none', color: 'var(--foreground)',
        borderRadius: 'var(--radius-sm)',
      },
      onClick: (e) => {
        e.preventDefault();
        panel.querySelector(`[data-id="${idPadre}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      },
    }, [s.titulo]);
    navNodos.push(link);
    linkParaId.set(idPadre, link);

    s.sub.forEach((sub) => {
      const idSub = slugify(sub);
      const linkSub = crearEl('a', {
        href: `#${idSub}`,
        style: {
          display: 'block', padding: '5px var(--space-3) 5px var(--space-5)',
          fontSize: 'var(--text-sm)', textDecoration: 'none',
          color: 'var(--muted-foreground)',
          borderInlineStart: '2px solid var(--border)',
          marginInlineStart: 'var(--space-3)',
        },
        onClick: (e) => {
          e.preventDefault();
          panel.querySelector(`[data-id="${idSub}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        },
      }, [sub]);
      navNodos.push(linkSub);
      linkParaId.set(idSub, linkSub);
    });
  });

  efecto(() => {
    linkParaId.forEach((el, id) => {
      const esta = id === activo.value;
      el.style.color = esta ? 'var(--primary)' : el.style.fontWeight === '600' ? 'var(--foreground)' : 'var(--muted-foreground)';
      el.style.fontWeight = esta ? '700' : (el.dataset.padre === '1' ? '600' : '400');
      if (el.style.borderInlineStart) {
        el.style.borderInlineStartColor = esta ? 'var(--primary)' : 'var(--border)';
      }
    });
  });

  return crearEl('div', {
    style: { display: 'grid', gridTemplateColumns: '200px 1fr', gap: 'var(--space-4)' },
  }, [
    crearEl('nav', {
      style: { display: 'flex', flexDirection: 'column', gap: '2px', position: 'sticky', top: 0 },
    }, navNodos),
    panel,
  ]);
};

// ============================================================================
//  Demo 3 — Numbered (1.1, 1.2 estilo manual / docs académicas)
// ============================================================================
const demoNumerado = () => {
  const CAPITULOS = [
    { num: '1', titulo: 'Introducción' },
    { num: '2', titulo: 'Conceptos fundamentales' },
    { num: '3', titulo: 'Implementación' },
    { num: '4', titulo: 'Optimización' },
    { num: '5', titulo: 'Conclusiones' },
  ];

  const panel = crearEl('div', {
    class: 'scroll-discreto',
    style: {
      maxHeight: '320px', overflowY: 'auto', padding: 'var(--space-3)',
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
    },
  }, CAPITULOS.map((c) => crearEl('section', {
    'data-id': slugify(`${c.num}-${c.titulo}`),
    style: { paddingBlock: 'var(--space-2) var(--space-6)' },
  }, [
    crearEl('h3', { style: { margin: '0 0 var(--space-2)', fontSize: 'var(--text-base)' } }, [
      crearEl('span', { style: {
        color: 'var(--muted-foreground)', marginInlineEnd: '8px',
        fontVariantNumeric: 'tabular-nums', fontWeight: 400,
      } }, [c.num + '.']),
      c.titulo,
    ]),
    crearEl('p', { style: { margin: 0, color: 'var(--muted-foreground)', lineHeight: 1.6 } }, [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum.',
    ]),
  ])));

  const activo = usarScrollspy({ panel });

  const navItems = CAPITULOS.map((c) => {
    const id = slugify(`${c.num}-${c.titulo}`);
    return crearEl('a', {
      href: `#${id}`,
      style: {
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '7px var(--space-2)',
        fontSize: 'var(--text-sm)', textDecoration: 'none',
        borderRadius: 'var(--radius-sm)',
        color: 'var(--muted-foreground)',
      },
      onClick: (e) => {
        e.preventDefault();
        panel.querySelector(`[data-id="${id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      },
    }, [
      crearEl('span', {
        style: {
          width: '24px', height: '24px',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: 'color-mix(in srgb, var(--foreground) 6%, transparent)',
          borderRadius: '50%',
          fontSize: '0.6875rem', fontWeight: 700,
          fontVariantNumeric: 'tabular-nums',
          flexShrink: 0,
        },
      }, [c.num]),
      crearEl('span', null, [c.titulo]),
    ]);
  });

  efecto(() => {
    navItems.forEach((el, i) => {
      const esta = slugify(`${CAPITULOS[i].num}-${CAPITULOS[i].titulo}`) === activo.value;
      el.style.color = esta ? 'var(--primary)' : 'var(--muted-foreground)';
      el.style.fontWeight = esta ? '600' : '400';
      const dot = el.querySelector('span');
      if (dot) {
        dot.style.background = esta ? 'var(--primary)' : 'color-mix(in srgb, var(--foreground) 6%, transparent)';
        dot.style.color = esta ? '#fff' : 'inherit';
      }
    });
  });

  return crearEl('div', {
    style: { display: 'grid', gridTemplateColumns: '200px 1fr', gap: 'var(--space-4)' },
  }, [
    crearEl('nav', { style: { display: 'flex', flexDirection: 'column', gap: '2px' } }, navItems),
    panel,
  ]);
};

// ============================================================================
//  Demo 4 — Progress bar superior (avance del scroll)
// ============================================================================
const demoProgressBar = () => {
  const panel = crearEl('div', {
    class: 'scroll-discreto',
    style: {
      maxHeight: '300px', overflowY: 'auto', padding: 'var(--space-3)',
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
    },
  }, [...SECCIONES_BASICAS, ...SECCIONES_BASICAS].map((t, i) => lorem(`${t} ${i + 1}`, 2)));

  const progreso = usarScrollProgreso(panel);

  const fill = crearEl('div', {
    style: {
      height: '3px',
      background: 'linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6)',
      borderRadius: '999px',
      transition: 'width 80ms linear',
      width: '0%',
    },
  });
  efecto(() => { fill.style.width = `${progreso.value * 100}%`; });

  const barra = crearEl('div', {
    style: {
      height: '3px', background: 'color-mix(in srgb, var(--foreground) 8%, transparent)',
      borderRadius: '999px', overflow: 'hidden',
      marginBlockEnd: 'var(--space-2)',
    },
  }, [fill]);

  return crearEl('div', null, [barra, panel]);
};

// ============================================================================
//  Demo 5 — Reading progress percentage (pill flotante)
// ============================================================================
const demoReadingProgress = () => {
  const panel = crearEl('div', {
    class: 'scroll-discreto',
    style: {
      maxHeight: '320px', overflowY: 'auto', padding: 'var(--space-3)',
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      position: 'relative',
    },
  }, SECCIONES_BASICAS.map((t) => lorem(t, 3)));

  const progreso = usarScrollProgreso(panel);

  const pill = crearEl('div', {
    style: {
      position: 'absolute',
      insetBlockStart: 'var(--space-3)', insetInlineEnd: 'var(--space-3)',
      padding: '6px 12px',
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
      color: '#fff', fontSize: 'var(--text-xs)', fontWeight: 600,
      borderRadius: '999px',
      fontVariantNumeric: 'tabular-nums',
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      pointerEvents: 'none',
    },
  });
  efecto(() => {
    pill.replaceChildren(
      Icono('reloj', { tamano: 12 }),
      crearEl('span', null, [`${Math.round(progreso.value * 100)}% leído`]),
    );
  });

  return crearEl('div', { style: { position: 'relative' } }, [panel, pill]);
};

// ============================================================================
//  Demo 6 — Section dots (Apple landing style)
// ============================================================================
const demoDots = () => {
  const panel = crearEl('div', {
    class: 'scroll-discreto',
    style: {
      maxHeight: '320px', overflowY: 'auto', padding: 'var(--space-3) var(--space-4)',
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
    },
  }, SECCIONES_BASICAS.map((t) => lorem(t, 2)));

  const activo = usarScrollspy({ panel });

  const dots = SECCIONES_BASICAS.map((t) => {
    const id = slugify(t);
    return crearEl('button', {
      type: 'button',
      'aria-label': t, title: t,
      style: {
        width: '10px', height: '10px',
        borderRadius: '50%',
        background: 'color-mix(in srgb, var(--foreground) 18%, transparent)',
        border: 0, cursor: 'pointer', padding: 0,
        transition: 'background 200ms, transform 200ms',
      },
      onClick: () => panel.querySelector(`[data-id="${id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    });
  });

  efecto(() => {
    dots.forEach((d, i) => {
      const esta = slugify(SECCIONES_BASICAS[i]) === activo.value;
      d.style.background = esta ? 'var(--primary)' : 'color-mix(in srgb, var(--foreground) 18%, transparent)';
      d.style.transform = esta ? 'scale(1.5)' : 'scale(1)';
    });
  });

  return crearEl('div', {
    style: { display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 'var(--space-4)', alignItems: 'start' },
  }, [
    crearEl('div', {
      style: {
        display: 'flex', flexDirection: 'column', gap: 'var(--space-3)',
        padding: 'var(--space-3)', position: 'sticky', top: 0,
        alignItems: 'center', justifyContent: 'center',
      },
    }, dots),
    panel,
  ]);
};

// ============================================================================
//  Demo 7 — Floating TOC (Stripe docs style — sticky a la derecha)
// ============================================================================
const demoFloatingToc = () => {
  const SECCIONES = [
    { titulo: 'Introducción' }, { titulo: 'Quickstart' }, { titulo: 'Autenticación' },
    { titulo: 'Endpoints' }, { titulo: 'Webhooks' }, { titulo: 'Errores' }, { titulo: 'Versionado' },
  ];

  const panel = crearEl('div', {
    class: 'scroll-discreto',
    style: {
      maxHeight: '380px', overflowY: 'auto', padding: 'var(--space-4)',
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
    },
  }, SECCIONES.map((s) => lorem(s.titulo, 2)));

  const activo = usarScrollspy({ panel });

  const toc = crearEl('nav', {
    style: {
      position: 'sticky', top: 0,
      padding: 'var(--space-3)',
      borderInlineStart: '1px solid var(--border)',
    },
  }, [
    crearEl('span', {
      style: {
        display: 'block',
        fontSize: 'var(--text-xs)', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.06em',
        color: 'var(--muted-foreground)',
        marginBlockEnd: 'var(--space-2)',
      },
    }, ['En esta página']),
    ...SECCIONES.map((s) => {
      const id = slugify(s.titulo);
      const link = crearEl('a', {
        href: `#${id}`,
        style: {
          display: 'block',
          padding: '4px 0',
          fontSize: 'var(--text-xs)',
          color: 'var(--muted-foreground)',
          textDecoration: 'none',
          transition: 'color 180ms, transform 180ms',
        },
        onClick: (e) => {
          e.preventDefault();
          panel.querySelector(`[data-id="${id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        },
      }, [s.titulo]);
      link.dataset.id = id;
      return link;
    }),
  ]);

  efecto(() => {
    toc.querySelectorAll('a').forEach((a) => {
      const esta = a.dataset.id === activo.value;
      a.style.color = esta ? 'var(--primary)' : 'var(--muted-foreground)';
      a.style.fontWeight = esta ? '600' : '400';
      a.style.transform = esta ? 'translateX(2px)' : '';
    });
  });

  return crearEl('div', {
    style: { display: 'grid', gridTemplateColumns: '1fr 200px', gap: 'var(--space-3)' },
  }, [panel, toc]);
};

// ============================================================================
//  Página
// ============================================================================
export default async () => PaginaShowcase({
  titulo: 'Scrollspy',
  descripcion: 'Resalta el item del nav según la sección visible. Usa `IntersectionObserver` (no `scroll` listener) — más eficiente y reactivo. 7 patrones: TOC sidebar, anidado, numerado, progress bar, reading %, dots Apple-style y floating TOC.',
  decoracion: corner6(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    // ============== 1. TOC SIDEBAR BÁSICO ==============
    Seccion({
      titulo: '1 · TOC sidebar (básico)',
      descripcion: 'Nav vertical a la izquierda + contenido scrolleable a la derecha. Click en cualquier item hace smooth scroll a esa sección. La sección visible resalta automáticamente.',
      hijos: [VistaCodigo({
        vista: demoBasico(),
        codigo: `// Hook reusable
const usarScrollspy = ({ panel, threshold = 0.4 }) => {
  const activo = senal(null);
  const observer = new IntersectionObserver((entries) => {
    const visibles = entries.filter(e => e.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (visibles[0]) activo.value = visibles[0].target.dataset.id;
  }, { root: panel, threshold });
  panel.querySelectorAll('[data-id]').forEach(s => observer.observe(s));
  return activo;
};

// Uso
const activo = usarScrollspy({ panel });
efecto(() => { /* resaltar item activo en el nav */ });`,
      })],
    }),

    // ============== 2. ANIDADO ==============
    Seccion({
      titulo: '2 · Con sub-secciones anidadas',
      descripcion: 'TOC jerárquico con 2 niveles — secciones padre en bold + sub-items con indent y borde lateral. Cada sub-item es independiente en el scrollspy.',
      hijos: [VistaCodigo({
        vista: demoAnidado(),
        codigo: `const SECCIONES = [
  { titulo: 'Empezando',  sub: ['Instalación', 'Primer proyecto', 'Estructura'] },
  { titulo: 'Componentes', sub: ['Botones', 'Formularios', 'Modales'] },
  { titulo: 'Avanzado',    sub: ['Reactividad', 'Routing', 'Performance'] },
];

// Render: padres en font-weight 600, sub-items con borderInlineStart
crearEl('a', { style: {
  paddingInlineStart: 'var(--space-5)',
  borderInlineStart: '2px solid var(--border)',
} }, [sub])`,
      })],
    }),

    // ============== 3. NUMERADO ==============
    Seccion({
      titulo: '3 · Capítulos numerados',
      descripcion: 'Estilo manual / docs académicas — cada capítulo tiene un número en círculo. El círculo activo cambia a color primary con texto blanco.',
      hijos: [VistaCodigo({
        vista: demoNumerado(),
        codigo: `const CAPITULOS = [
  { num: '1', titulo: 'Introducción' },
  { num: '2', titulo: 'Conceptos fundamentales' },
  // ...
];

crearEl('a', null, [
  crearEl('span', { style: {
    width: '24px', height: '24px', borderRadius: '50%',
    background: esActivo ? 'var(--primary)' : 'rgba(0,0,0,0.06)',
    color: esActivo ? '#fff' : 'inherit',
  } }, [c.num]),
  crearEl('span', null, [c.titulo]),
])`,
      })],
    }),

    // ============== 4. PROGRESS BAR ==============
    Seccion({
      titulo: '4 · Progress bar superior',
      descripcion: 'Barra fina arriba del contenido que avanza con el scroll (0-100%). Patrón clásico de blogs y documentación largos — comunica cuánto te falta sin TOC.',
      hijos: [VistaCodigo({
        vista: demoProgressBar(),
        codigo: `const usarScrollProgreso = (panel) => {
  const progreso = senal(0);
  panel.addEventListener('scroll', () => {
    const max = panel.scrollHeight - panel.clientHeight;
    progreso.value = max > 0 ? panel.scrollTop / max : 0;
  }, { passive: true });
  return progreso;
};

// Render
const fill = crearEl('div', { style: {
  background: 'linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6)',
  height: '3px',
} });
efecto(() => { fill.style.width = \`\${progreso.value * 100}%\`; });`,
      })],
    }),

    // ============== 5. READING % ==============
    Seccion({
      titulo: '5 · Reading progress (pill flotante)',
      descripcion: 'Pill semi-transparente con backdrop-blur en la esquina mostrando el % leído. Patrón Medium / Dev.to — más sutil que la barra superior.',
      hijos: [VistaCodigo({
        vista: demoReadingProgress(),
        codigo: `// Pill absoluta sobre el panel scrolleable
crearEl('div', { style: {
  position: 'absolute', insetBlockStart: 12, insetInlineEnd: 12,
  padding: '6px 12px',
  background: 'rgba(0,0,0,0.7)',
  backdropFilter: 'blur(8px)',
  color: '#fff',
  borderRadius: '999px',
} }, [\`\${Math.round(progreso.value * 100)}% leído\`])`,
      })],
    }),

    // ============== 6. DOTS APPLE STYLE ==============
    Seccion({
      titulo: '6 · Section dots (Apple landing)',
      descripcion: 'Puntos verticales pequeños — el activo crece (`scale(1.5)`) y cambia a primary. Sin etiquetas (los tooltips muestran el nombre al hover). Para landings con pocas secciones grandes.',
      hijos: [VistaCodigo({
        vista: demoDots(),
        codigo: `const dots = SECCIONES.map(t => crearEl('button', {
  'aria-label': t, title: t,                  // tooltip nativo
  style: { width: '10px', height: '10px', borderRadius: '50%' },
  onClick: () => panel.querySelector(\`[data-id="\${slugify(t)}"]\`)
    ?.scrollIntoView({ behavior: 'smooth' }),
}));

efecto(() => {
  dots.forEach((d, i) => {
    const esta = slugify(SECCIONES[i]) === activo.value;
    d.style.background = esta ? 'var(--primary)' : 'rgba(0,0,0,0.18)';
    d.style.transform = esta ? 'scale(1.5)' : 'scale(1)';
  });
});`,
      })],
    }),

    // ============== 7. FLOATING TOC ==============
    Seccion({
      titulo: '7 · Floating TOC (Stripe docs)',
      descripcion: '"En esta página" pegado a la derecha del contenido — sticky, font small, con borde izquierdo separador. La sección activa lleva color primary + ligero `translateX(2px)`.',
      hijos: [VistaCodigo({
        vista: demoFloatingToc(),
        codigo: `crearEl('nav', { style: {
  position: 'sticky', top: 0,
  borderInlineStart: '1px solid var(--border)',
  padding: 'var(--space-3)',
} }, [
  crearEl('span', null, ['EN ESTA PÁGINA']),    // pequeño label uppercase
  ...secciones.map(s => crearEl('a', {
    style: {
      fontSize: 'var(--text-xs)',
      color: esActiva ? 'var(--primary)' : 'var(--muted-foreground)',
      transform: esActiva ? 'translateX(2px)' : '',
    },
  }, [s.titulo])),
])`,
      })],
    }),

  ],
});
