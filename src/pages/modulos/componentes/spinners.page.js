import { crearEl } from '../../../utils/helpers/dom.js';
import { senal } from '../../../utils/helpers/reactive.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { Cargador, OverlayCarga } from '../../../components/ui/spinner/spinner.js';
import { Boton } from '../../../components/ui/button/button.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { notificar } from '../../../components/ui/toast/toast.js';
import { corner4 } from '../../../components/ui/card/card-decoraciones.js';

const fila = (...n) => crearEl('div', {
  style: { display: 'flex', gap: 'var(--space-6)', alignItems: 'center', flexWrap: 'wrap' },
}, n);

const stack = (...n) => crearEl('div', {
  style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' },
}, n);

const chip = (label) => crearEl('div', {
  style: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
    minWidth: '80px',
  },
}, [
  crearEl('span', { style: {
    fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)',
    fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
  } }, [label]),
]);

const variante = (etq, nodo) => crearEl('div', {
  style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', minWidth: '90px' },
}, [
  nodo,
  crearEl('span', { style: {
    fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)',
    fontWeight: 600,
  } }, [etq]),
]);

// ============================================================================
//  Demo: botón con loading state
// ============================================================================
const demoBotonLoading = () => {
  const cargando = senal(false);
  const btn = crearEl('button', {
    type: 'button',
    style: {
      display: 'inline-flex', alignItems: 'center', gap: '8px',
      padding: '8px 16px',
      background: 'var(--primary)', color: '#fff',
      border: 0, borderRadius: 'var(--radius)',
      fontSize: 'var(--text-sm)', fontWeight: 600, cursor: 'pointer',
      minWidth: '140px', justifyContent: 'center',
    },
    onClick: () => {
      if (cargando.value) return;
      cargando.value = true;
      btn.disabled = true;
      btn.style.opacity = '0.7';
      btn.replaceChildren(
        Cargador({ tamano: 'sm', color: 'white' }),
        crearEl('span', null, ['Procesando…']),
      );
      setTimeout(() => {
        cargando.value = false;
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.replaceChildren(
          Icono('check', { tamano: 14 }),
          crearEl('span', null, ['Guardar cambios']),
        );
        notificar.exito('¡Guardado!');
      }, 1800);
    },
  }, [
    Icono('check', { tamano: 14 }),
    crearEl('span', null, ['Guardar cambios']),
  ]);
  return btn;
};

// ============================================================================
//  Demo: card con overlay de carga
// ============================================================================
const demoOverlay = () => {
  const cargando = senal(false);
  const card = crearEl('div', {
    style: {
      position: 'relative',
      padding: 'var(--space-5)',
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      minHeight: '180px',
    },
  }, [
    crearEl('strong', { style: { display: 'block', fontSize: 'var(--text-base)', marginBlockEnd: 'var(--space-2)' } }, ['Reporte de ventas Q3']),
    crearEl('p', { style: { margin: '0 0 var(--space-3)', color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' } },
      ['Click "Refrescar datos" para simular una request al backend que toma 2 segundos. El overlay con backdrop blur cubre la card mientras carga.']),
    crearEl('div', { style: { display: 'flex', gap: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [
      crearEl('span', null, ['Total: $48,290']),
      crearEl('span', null, ['Pedidos: 1,247']),
      crearEl('span', null, ['Conversión: 4.7%']),
    ]),
  ]);

  const accionar = () => {
    if (cargando.value) return;
    cargando.value = true;
    const overlay = OverlayCarga({ texto: 'Refrescando datos…', variante: 'circular', tamano: 'lg' });
    card.appendChild(overlay);
    setTimeout(() => {
      overlay.remove();
      cargando.value = false;
      notificar.exito('Datos actualizados');
    }, 2000);
  };

  return stack(
    Boton({ texto: 'Refrescar datos', variante: 'primary', tamano: 'sm',
      icono: Icono('analitica', { tamano: 14 }),
      onClick: accionar }),
    card,
  );
};

// ============================================================================
//  Demo: pantalla completa
// ============================================================================
const demoPantallaCompleta = () => Boton({
  texto: 'Mostrar overlay de pantalla completa',
  variante: 'secondary',
  onClick: () => {
    const overlay = crearEl('div', {
      style: {
        position: 'fixed', inset: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 'var(--space-3)',
        zIndex: 9999,
      },
    }, [
      Cargador({ variante: 'ring', tamano: 'xl', color: 'white' }),
      crearEl('p', { style: { color: '#fff', fontSize: 'var(--text-base)', fontWeight: 500 } },
        ['Sincronizando con el servidor…']),
      crearEl('p', { style: { margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: 'var(--text-xs)' } },
        ['Esto cierra automáticamente en 2.5s']),
    ]);
    document.body.appendChild(overlay);
    setTimeout(() => overlay.remove(), 2500);
  },
});

// ============================================================================
//  Página
// ============================================================================
export default async () => PaginaShowcase({
  titulo: 'Spinners',
  descripcion: 'Indicadores visuales de operaciones en curso. 6 variantes (`circular`, `puntos`, `pulso`, `barras`, `radial`, `ring`), 5 tamaños, colores semánticos y patrones de uso real (botón loading, overlay de card, pantalla completa). Para datasets vacíos usa esqueletos en su lugar (página Placeholder).',
  decoracion: corner4(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    // ============== 1. VARIANTES ==============
    Seccion({
      titulo: '1 · Variantes',
      descripcion: '6 estilos distintos. `circular` es el clásico (border ring rotando) — el más reconocible. `puntos` y `barras` son menos invasivos visualmente. `pulso` y `radial` se ven más modernos.',
      hijos: [VistaCodigo({
        vista: fila(
          variante('circular', Cargador({ variante: 'circular', tamano: 'lg' })),
          variante('puntos',   Cargador({ variante: 'puntos',   tamano: 'lg' })),
          variante('pulso',    Cargador({ variante: 'pulso',    tamano: 'lg' })),
          variante('barras',   Cargador({ variante: 'barras',   tamano: 'lg' })),
          variante('radial',   Cargador({ variante: 'radial',   tamano: 'lg' })),
          variante('ring',     Cargador({ variante: 'ring',     tamano: 'lg' })),
        ),
        codigo: `Cargador({ variante: 'circular' })   // border ring (default)
Cargador({ variante: 'puntos' })     // 3 dots bouncing
Cargador({ variante: 'pulso' })      // círculo pulsante
Cargador({ variante: 'barras' })     // equalizer
Cargador({ variante: 'radial' })     // gradient sweep
Cargador({ variante: 'ring' })       // doble anillo`,
      })],
    }),

    // ============== 2. TAMAÑOS ==============
    Seccion({
      titulo: '2 · Tamaños',
      descripcion: '`xs` (10px) para inline en texto, `sm` (14px) para botones, `md` (20px, default), `lg` (32px) para overlays, `xl` (48px) para pantalla completa.',
      hijos: [VistaCodigo({
        vista: fila(
          variante('xs', Cargador({ tamano: 'xs' })),
          variante('sm', Cargador({ tamano: 'sm' })),
          variante('md', Cargador({ tamano: 'md' })),
          variante('lg', Cargador({ tamano: 'lg' })),
          variante('xl', Cargador({ tamano: 'xl' })),
        ),
        codigo: `Cargador({ tamano: 'xs' })   // 10px — inline en texto
Cargador({ tamano: 'sm' })   // 14px — botones
Cargador({ tamano: 'md' })   // 20px (default)
Cargador({ tamano: 'lg' })   // 32px — overlays de card
Cargador({ tamano: 'xl' })   // 48px — pantalla completa`,
      })],
    }),

    // ============== 3. COLORES ==============
    Seccion({
      titulo: '3 · Colores semánticos',
      descripcion: 'El color comunica el contexto de la operación. `primary` (default — neutro), `success` (post-acción positiva), `warning` (operación lenta o riesgosa), `danger` (delete confirm), `white` (sobre fondos oscuros).',
      hijos: [VistaCodigo({
        vista: fila(
          variante('primary', Cargador({ tamano: 'lg' })),
          variante('success', Cargador({ tamano: 'lg', color: 'success' })),
          variante('warning', Cargador({ tamano: 'lg', color: 'warning' })),
          variante('danger',  Cargador({ tamano: 'lg', color: 'danger' })),
          variante('info',    Cargador({ tamano: 'lg', color: 'info' })),
          crearEl('div', {
            style: {
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', minWidth: '90px',
              padding: 'var(--space-3)', background: '#0a0a0a', borderRadius: 'var(--radius)',
            },
          }, [
            Cargador({ tamano: 'lg', color: 'white' }),
            crearEl('span', { style: { fontSize: 'var(--text-xs)', color: '#fff', fontWeight: 600 } }, ['white']),
          ]),
        ),
        codigo: `Cargador({ color: 'primary' })   // default
Cargador({ color: 'success' })   // verde
Cargador({ color: 'warning' })   // naranja
Cargador({ color: 'danger' })    // rojo
Cargador({ color: 'info' })      // celeste
Cargador({ color: 'white' })     // sobre fondos oscuros`,
      })],
    }),

    // ============== 4. CON ETIQUETA INLINE ==============
    Seccion({
      titulo: '4 · Con etiqueta inline',
      descripcion: 'Spinner + texto al lado en una sola línea. Ideal para indicar qué está pasando en pequeños espacios (footers, status bars, mini cards).',
      hijos: [VistaCodigo({
        vista: stack(
          Cargador({ variante: 'circular', tamano: 'sm', etiqueta: 'Cargando…' }),
          Cargador({ variante: 'puntos',   tamano: 'sm', etiqueta: 'Sincronizando con el servidor' }),
          Cargador({ variante: 'pulso',    tamano: 'sm', etiqueta: 'Procesando 24 archivos…', color: 'warning' }),
          Cargador({ variante: 'circular', tamano: 'sm', etiqueta: 'Guardado', color: 'success' }),
        ),
        codigo: `Cargador({ tamano: 'sm', etiqueta: 'Cargando…' })

Cargador({
  variante: 'puntos', tamano: 'sm',
  etiqueta: 'Sincronizando con el servidor',
})

Cargador({
  variante: 'pulso', tamano: 'sm',
  etiqueta: 'Procesando 24 archivos…',
  color: 'warning',
})`,
      })],
    }),

    // ============== 5. EN BOTÓN ==============
    Seccion({
      titulo: '5 · En botón (estado loading)',
      descripcion: 'Click en el botón → se reemplaza el icono por un spinner + cambia el texto a "Procesando…" + se deshabilita. Patrón canónico de submit. Tras 1.8s vuelve al estado normal.',
      hijos: [VistaCodigo({
        vista: demoBotonLoading(),
        codigo: `const cargando = senal(false);

const btn = crearEl('button', {
  onClick: () => {
    if (cargando.value) return;
    cargando.value = true;
    btn.disabled = true;
    btn.replaceChildren(
      Cargador({ tamano: 'sm', color: 'white' }),
      crearEl('span', null, ['Procesando…']),
    );

    await guardar();

    cargando.value = false;
    btn.disabled = false;
    btn.replaceChildren(/* contenido normal */);
  },
});`,
      })],
    }),

    // ============== 6. OVERLAY DE CARD ==============
    Seccion({
      titulo: '6 · Overlay de card / sección',
      descripcion: '`OverlayCarga` se posiciona absoluto cubriendo el container padre con `backdrop-filter: blur(4px)` + spinner centrado + texto. La card mantiene su altura, el contenido sigue ahí pero se oscurece y desenfoca.',
      hijos: [VistaCodigo({
        vista: demoOverlay(),
        codigo: `const card = crearEl('div', {
  style: { position: 'relative' },                  // ← clave: relative
}, [...contenido]);

// Al hacer fetch:
const overlay = OverlayCarga({
  texto: 'Refrescando datos…',
  variante: 'circular',
  tamano: 'lg',
});
card.appendChild(overlay);

await fetch('/api/datos');

overlay.remove();   // listo`,
      })],
    }),

    // ============== 7. PANTALLA COMPLETA ==============
    Seccion({
      titulo: '7 · Pantalla completa',
      descripcion: 'Para operaciones bloqueantes (login, sync inicial, transferencia crítica). Fondo negro con backdrop-blur, spinner XL en blanco, texto principal + sub. Patrón "stop-the-world" — usar con moderación.',
      hijos: [VistaCodigo({
        vista: demoPantallaCompleta(),
        codigo: `const overlay = crearEl('div', { style: {
  position: 'fixed', inset: 0,
  background: 'rgba(0, 0, 0, 0.75)',
  backdropFilter: 'blur(8px)',
  zIndex: 9999,
} }, [
  Cargador({ variante: 'ring', tamano: 'xl', color: 'white' }),
  crearEl('p', null, ['Sincronizando con el servidor…']),
]);
document.body.appendChild(overlay);

await sincronizar();
overlay.remove();`,
      })],
    }),

    // ============== 8. INLINE EN TEXTO ==============
    Seccion({
      titulo: '8 · Inline en texto',
      descripcion: '`tamano: xs` (10px) cabe perfecto entre palabras. Para indicar live updates o estados dentro de párrafos sin romper el flow.',
      hijos: [VistaCodigo({
        vista: stack(
          crearEl('p', { style: {
            margin: 0, fontSize: 'var(--text-sm)', color: 'var(--foreground)',
            display: 'inline-flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap',
          } }, [
            'Procesando 24 archivos ',
            Cargador({ variante: 'circular', tamano: 'xs' }),
            ' — quedan aproximadamente 12 segundos.',
          ]),
          crearEl('p', { style: {
            margin: 0, fontSize: 'var(--text-sm)', color: 'var(--foreground)',
            display: 'inline-flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap',
          } }, [
            'Conectado a ',
            crearEl('strong', null, ['acme-prod']),
            Cargador({ variante: 'pulso', tamano: 'xs', color: 'success' }),
          ]),
          crearEl('p', { style: {
            margin: 0, fontSize: 'var(--text-sm)', color: 'var(--foreground)',
            display: 'inline-flex', alignItems: 'center', gap: '6px',
          } }, [
            Cargador({ variante: 'puntos', tamano: 'xs' }),
            crearEl('em', { style: { color: 'var(--muted-foreground)' } }, ['María García está escribiendo…']),
          ]),
        ),
        codigo: `// Cargador inline dentro de un párrafo
crearEl('p', { style: { display: 'inline-flex', alignItems: 'center' } }, [
  'Procesando 24 archivos ',
  Cargador({ tamano: 'xs' }),
  ' — quedan ~12 segundos.',
])

// Connection status indicator
crearEl('p', null, [
  'Conectado a ', crearEl('strong', null, ['acme-prod']),
  Cargador({ variante: 'pulso', tamano: 'xs', color: 'success' }),
])`,
      })],
    }),

  ],
});
