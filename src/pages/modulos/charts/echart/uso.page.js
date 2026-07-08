import { crearEl } from '../../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../../components/ui/code-preview/code-preview.js';
import { Echart, opcionesBase, merge, PALETA, MESES, ventasMensuales } from '../_compartido.js';
import { Icono } from '../../../../components/ui/icon/icons.js';
import { corner3 } from '../../../../components/ui/card/card-decoraciones.js';

export default async () => PaginaShowcase({
  titulo: 'ECharts · Cómo usar',
  descripcion: 'Guía práctica para integrar ECharts en template-vanilla: cargar la lib, crear instancias, montar lazy, hacer responsive, actualizar datos en vivo, sincronizar con tema oscuro/claro, escuchar eventos y los pitfalls comunes.',
  decoracion: corner3(),
  migas: [
    { etiqueta: 'Módulos', href: '#/modulos' },
    { etiqueta: 'Gráficos', href: '#/modulos/graficos' },
  ],
  hijos: [

    Seccion({
      titulo: '1 · Setup mínimo (3 líneas)',
      descripcion: 'El "hello world" más corto posible. ECharts ya está en el bundle de template-vanilla — sólo importas el adapter y le pasas un `option`.',
      hijos: [VistaCodigo({
        vista: Echart({
          alto: '260px',
          opcion: merge(opcionesBase(), {
            xAxis: { type: 'category', data: MESES },
            yAxis: { type: 'value' },
            series: [{ data: ventasMensuales, type: 'bar', itemStyle: { borderRadius: [6, 6, 0, 0], color: PALETA[0] } }],
          }),
        }),
        codigo: `import { GraficoECharts } from '.../integrations/echarts/index.js';

const { contenedor } = await GraficoECharts({
  opcion: {
    xAxis: { type: 'category', data: ['Ene', 'Feb', 'Mar'] },
    yAxis: { type: 'value' },
    series: [{ data: [120, 200, 150], type: 'bar' }],
  },
  alto: '300px',
});

document.querySelector('#mi-chart').appendChild(contenedor);`,
      })],
    }),

    Seccion({
      titulo: '2 · Patrón con `Echart()` lazy (recomendado)',
      descripcion: 'Para showcases con muchos charts, usa el helper `Echart` que solo inicializa cuando el div entra en viewport. Evita cargar el bundle hasta que se necesita.',
      hijos: [VistaCodigo({
        vista: crearEl('div', {
          style: {
            padding: 'var(--space-4)', background: 'var(--surface)',
            border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
            display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', justifyContent: 'center', minHeight: '180px',
          },
        }, [
          crearEl('span', { style: { color: 'var(--primary)' } }, [Icono('zoom_mas', { tamano: 36 })]),
          crearEl('div', { style: { fontWeight: 700 } }, ['Lazy init = bundle de ~1MB sólo se descarga al primer chart visible']),
          crearEl('div', { style: { fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' } }, ['IntersectionObserver dispara el init cuando entra en pantalla']),
        ]),
        codigo: `// helper en _compartido.js
import { cargarECharts } from '.../integrations/echarts/index.js';

export const Echart = ({ opcion, alto = '320px' }) => {
  const div = crearEl('div', { style: { width: '100%', height: alto } });

  const obs = new IntersectionObserver(async (entries) => {
    if (!entries[0].isIntersecting) return;
    obs.disconnect();
    const echarts = await cargarECharts();
    const inst = echarts.init(div);
    inst.setOption(opcion);
    new ResizeObserver(() => inst.resize()).observe(div);
  });
  obs.observe(div);

  return div;
};`,
      })],
    }),

    Seccion({
      titulo: '3 · Actualización en vivo (live data)',
      descripcion: 'Para datos que cambian — guarda la `instancia` y usa `setOption()` con merge automático. ECharts anima la transición.',
      hijos: [VistaCodigo({
        vista: (() => {
          const datos = MESES.map(() => Math.round(40 + Math.random() * 60));
          let inst = null;
          const div = Echart({
            alto: '260px',
            opcion: merge(opcionesBase(), {
              xAxis: { type: 'category', data: MESES, boundaryGap: false },
              yAxis: { type: 'value', max: 120 },
              series: [{ data: [...datos], type: 'line', smooth: true, showSymbol: false, lineStyle: { width: 3, color: PALETA[2] }, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: PALETA[2] + '99' }, { offset: 1, color: PALETA[2] + '00' }] } } }],
            }),
            evento: (echartsInstancia) => { inst = echartsInstancia; },
          });
          // Cada 1.5s, simula nuevo dato
          const intervalo = setInterval(() => {
            if (!inst) return;
            datos.shift(); datos.push(Math.round(40 + Math.random() * 60));
            inst.setOption({ series: [{ data: [...datos] }] });
          }, 1500);
          // Limpieza
          const obs = new MutationObserver(() => { if (!div.isConnected) { clearInterval(intervalo); obs.disconnect(); } });
          requestAnimationFrame(() => div.parentNode && obs.observe(div.parentNode, { childList: true, subtree: true }));
          return div;
        })(),
        codigo: `// El helper Echart expone la instancia via callback
const div = Echart({
  opcion,
  evento: (inst) => {
    // Live updates cada 1.5s
    setInterval(() => {
      datos.push(nuevoValor);
      inst.setOption({ series: [{ data: datos }] });
    }, 1500);
  },
});`,
      })],
    }),

    Seccion({
      titulo: '4 · Eventos (click, hover, brush)',
      descripcion: 'ECharts emite eventos: `click`, `mouseover`, `legendselectchanged`, `brushSelected`, `dataZoom`. Patrón típico: filtrar otra vista al hacer click.',
      hijos: [VistaCodigo({
        vista: (() => {
          const wrap = crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } });
          const log = crearEl('div', {
            style: {
              padding: '10px 14px',
              background: 'var(--background)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              fontSize: 'var(--text-sm)', fontFamily: 'monospace',
              color: 'var(--muted-foreground)',
              minHeight: '38px',
            },
          }, ['(click una barra)']);
          const chart = Echart({
            alto: '260px',
            opcion: merge(opcionesBase(), {
              xAxis: { type: 'category', data: MESES },
              yAxis: { type: 'value' },
              series: [{ data: ventasMensuales, type: 'bar', itemStyle: { borderRadius: [6, 6, 0, 0], color: PALETA[0] } }],
            }),
            evento: (inst) => {
              inst.on('click', (params) => {
                log.textContent = `[click] ${params.name} = $${params.value.toLocaleString()}`;
                log.style.color = 'var(--primary)';
              });
            },
          });
          wrap.appendChild(chart);
          wrap.appendChild(log);
          return wrap;
        })(),
        codigo: `inst.on('click', (params) => {
  console.log(params.name, params.value);
  // → "Mar 47500"
});

// Otros eventos útiles:
inst.on('mouseover', ...);
inst.on('legendselectchanged', ({ name, selected }) => ...);
inst.on('brushSelected', ({ batch }) => ...);
inst.on('datazoom', ({ start, end }) => ...);`,
      })],
    }),

    Seccion({
      titulo: '5 · Tema oscuro automático',
      descripcion: '`opcionesBase()` lee el tema actual de `estadoUi.tema` y devuelve colores apropiados. Para reactivar al cambio de tema, suscríbete y reaplica la opción.',
      hijos: [VistaCodigo({
        vista: crearEl('div', {
          style: {
            padding: 'var(--space-4)', background: 'var(--surface)',
            border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
            display: 'flex', gap: '16px', alignItems: 'center',
          },
        }, [
          crearEl('span', { style: { color: 'var(--primary)' } }, [Icono('luna', { tamano: 32 })]),
          crearEl('div', null, [
            crearEl('div', { style: { fontWeight: 700 } }, ['ECharts respeta el tema activo']),
            crearEl('div', { style: { fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' } }, ['Líneas, splits, axisLabels y tooltips se adaptan al modo claro/oscuro vía `estadoUi.tema`']),
          ]),
        ]),
        codigo: `import { estadoUi } from '.../store/ui.store.js';

// 1. opcionesBase() lee el tema actual
const opcion = merge(opcionesBase(), { ... });

// 2. Para reaccionar a cambios:
estadoUi.tema.subscribe((nuevoTema) => {
  inst.dispose();                                    // destruye la instancia
  inst = echarts.init(div, nuevoTema === 'dark' ? 'dark' : null);
  inst.setOption(merge(opcionesBase(), opcionUsuario));
});`,
      })],
    }),

    Seccion({
      titulo: '6 · Performance — 100K+ puntos',
      descripcion: 'Para datasets grandes, usa `large: true`, `progressive`, y `sampling` automático en líneas. ECharts maneja millones de puntos sin frame drops.',
      hijos: [VistaCodigo({
        vista: Echart({
          alto: '300px',
          opcion: merge(opcionesBase(), {
            xAxis: { type: 'value' },
            yAxis: { type: 'value' },
            dataZoom: [{ type: 'inside' }, { type: 'slider', height: 20, bottom: 8 }],
            grid: { bottom: 70 },
            series: [{
              type: 'scatter',
              data: Array.from({ length: 50000 }, () => [Math.random() * 100, Math.random() * 100]),
              large: true,                                  // ← clave para 50K+
              largeThreshold: 2000,
              progressive: 5000,
              progressiveThreshold: 5000,
              symbolSize: 3,
              itemStyle: { color: PALETA[2], opacity: 0.5 },
            }],
          }),
        }),
        codigo: `series: [{
  type: 'scatter',
  data: arrayDe50000Puntos,
  large: true,                                  // optimización para muchos puntos
  largeThreshold: 2000,
  progressive: 5000,                            // procesa en chunks
  progressiveThreshold: 5000,
  symbolSize: 3,
}],
dataZoom: [{ type: 'inside' }, { type: 'slider' }]`,
      })],
    }),

    Seccion({
      titulo: '7 · Responsive (resize observer)',
      descripcion: 'ECharts no se re-dimensiona solo. Conecta un `ResizeObserver` al contenedor para llamar `inst.resize()` en cada cambio.',
      hijos: [VistaCodigo({
        vista: crearEl('div', {
          style: {
            padding: 'var(--space-4)', background: 'var(--surface)',
            border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
            color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)',
          },
        }, ['El helper `Echart` ya conecta un `ResizeObserver` automáticamente. Si usas `GraficoECharts` directamente o `echarts.init()`, conéctalo manualmente:']),
        codigo: `// Manual
const inst = echarts.init(div);
inst.setOption(opcion);

// Re-render en cambios de tamaño del contenedor (sidebar collapse, ventana, ...)
new ResizeObserver(() => inst.resize()).observe(div);

// Para window-only:
window.addEventListener('resize', () => inst.resize());`,
      })],
    }),

    Seccion({
      titulo: '8 · Pitfalls comunes',
      descripcion: 'Errores que verás trabajando con ECharts y cómo solucionarlos.',
      hijos: [crearEl('div', {
        style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-3)' },
      }, [
        ['Chart vacío al cargar', 'El div no tiene height — ECharts mide su contenedor al `init()`. Asegura `height: 320px` (o lo que sea) ANTES de inicializar.', '#ef4444'],
        ['No actualiza al cambiar datos', 'Probablemente estás creando una instancia nueva en lugar de llamar `setOption()`. Guarda la referencia y reutilízala.', '#f59e0b'],
        ['Tooltip se corta', 'Pasa fuera del contenedor cuando hace hover en el borde. Usa `appendToBody: true` en tooltip o ajusta `position`.', '#06b6d4'],
        ['Mucha memoria con muchos charts', 'Llama `inst.dispose()` cuando el componente se desmonta. Si no, las instancias se acumulan.', '#8b5cf6'],
        ['Texto de leyenda recortado', 'Aumenta `grid.right` o `grid.bottom` para dejar espacio. ECharts no auto-calcula el espacio que toma la leyenda.', '#ec4899'],
        ['SetOption sobreescribe series', 'Por default `setOption()` hace merge inteligente, pero si quieres reemplazo total pasa `notMerge: true` como segundo arg.', '#10b981'],
      ].map(([titulo, desc, color]) => crearEl('div', {
        style: {
          padding: 'var(--space-3) var(--space-4)',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderInlineStart: `3px solid ${color}`,
          borderRadius: 'var(--radius-md)',
        },
      }, [
        crearEl('div', { style: { fontWeight: 700, fontSize: 'var(--text-sm)', marginBlockEnd: '4px' } }, [titulo]),
        crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', lineHeight: 1.55 } }, [desc]),
      ])))],
    }),

    Seccion({
      titulo: '9 · Checklist antes de prod',
      descripcion: '',
      hijos: [crearEl('div', {
        style: {
          padding: 'var(--space-4)',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          display: 'flex', flexDirection: 'column', gap: '8px',
        },
      }, [
        ['¿Lazy-load del bundle (~1MB) cuando el chart entra al viewport?'],
        ['¿`ResizeObserver` conectado para que el chart sea responsive?'],
        ['¿`inst.dispose()` cuando el componente se desmonta?'],
        ['¿Tema oscuro probado (no todos los charts heredan el tema automáticamente)?'],
        ['¿Tooltips legibles y formateados (números con `Intl.NumberFormat`, fechas con timezone)?'],
        ['¿Animaciones razonables? `animation: false` o `animationDuration: 300` para datasets grandes.'],
        ['¿Accesibilidad? Considera proveer la data en una tabla `<table>` oculta para screen readers.'],
        ['¿Empty states? Si la data viene vacía, no muestres un chart vacío — muestra un componente "Sin datos".'],
      ].map(([item]) => crearEl('div', { style: { display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'var(--text-sm)' } }, [
        crearEl('span', { style: { color: 'var(--color-success)', flexShrink: 0, marginBlockStart: '2px' } }, [Icono('check', { tamano: 16 })]),
        crearEl('span', null, [item]),
      ])))],
    }),

  ],
});
