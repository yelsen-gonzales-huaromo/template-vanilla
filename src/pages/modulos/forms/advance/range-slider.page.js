/**
 * Range slider — vanilla JS (sin noUiSlider).
 * Single, dual, tooltips, pips, formatters de moneda/%/número.
 */
import { crearEl } from '../../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../../utils/helpers/reactive.js';
import { PaginaShowcase, Seccion } from '../../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../../components/ui/code-preview/code-preview.js';
import { corner7 } from '../../../../components/ui/card/card-decoraciones.js';
import { Campo, Stack } from '../_compartido.js';
import { RangoSlider, fmt } from '../_slider.js';

export default async () => PaginaShowcase({
  titulo: 'Range slider',
  descripcion: 'Sliders avanzados vanilla JS — sin noUiSlider (~30 KB) ni dependencias. Single value o rango doble (min/max), tooltips siempre o on-hover, pips (marcas en el track), formatters built-in (moneda, %, número con separadores). Pointer events unificados (mouse + touch), navegación con teclado (←/→/Home/End), accesible con ARIA.',
  decoracion: corner7(),
  migas: [
    { etiqueta: 'Módulos', href: '#/modulos' },
    { etiqueta: 'Formularios', href: '#/modulos/forms' },
  ],
  hijos: [

    // ========== 1 ==========
    Seccion({
      titulo: '1 · Slider simple — single value con tooltip',
      descripcion: 'Una handle, tooltip permanente arriba que muestra el valor formateado. Drag con mouse, touch en móvil, o teclado (←/→). Click en el track salta la handle al punto.',
      hijos: [VistaCodigo({
        vista: (() => {
          const v = senal(65);
          const eco = crearEl('span', { style: { fontSize: '12.5px', color: 'var(--primary)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' } });
          efecto(() => { eco.textContent = `${v.value}%`; });
          return crearEl('div', { style: { maxWidth: '440px' } }, [
            Campo({ label: ['Brillo de pantalla — ', eco],
              hijos: RangoSlider({
                start: [65], min: 0, max: 100, step: 1,
                tooltips: true,
                format: fmt.porcentaje(),
                onChange: (val) => v.value = val,
              }),
            }),
          ]);
        })(),
        codigo: `import { RangoSlider, fmt } from '../_slider.js';

RangoSlider({
  start: [65], min: 0, max: 100, step: 1,
  tooltips: true,
  format: fmt.porcentaje(),
  onChange: (v) => setBrillo(v),
})`,
      })],
    }),

    // ========== 2 ==========
    Seccion({
      titulo: '2 · Rango doble — min/max',
      descripcion: 'Dos handles para definir un rango (precio mín/máx, edad, fecha desde/hasta). El track entre las handles se rellena en color primary. Click en el track salta la handle más cercana.',
      hijos: [VistaCodigo({
        vista: (() => {
          const precio = senal([200, 800]);
          const edad = senal([18, 35]);
          const eco1 = crearEl('span', { style: { fontSize: '12.5px', color: 'var(--primary)', fontWeight: 600 } });
          const eco2 = crearEl('span', { style: { fontSize: '12.5px', color: 'var(--primary)', fontWeight: 600 } });
          efecto(() => { eco1.textContent = `$${precio.value[0]} – $${precio.value[1]}`; });
          efecto(() => { eco2.textContent = `${edad.value[0]} – ${edad.value[1]} años`; });
          return crearEl('div', { style: { maxWidth: '480px' } }, [
            Stack(
              Campo({ label: ['Rango de precio — ', eco1],
                hijos: RangoSlider({
                  start: [200, 800], min: 0, max: 1000, step: 10,
                  tooltips: true,
                  format: fmt.moneda('USD'),
                  onChange: (v) => precio.value = v,
                }),
              }),
              Campo({ label: ['Edad — ', eco2],
                hijos: RangoSlider({
                  start: [18, 35], min: 18, max: 65, step: 1,
                  tooltips: true,
                  onChange: (v) => edad.value = v,
                }),
              }),
            ),
          ]);
        })(),
        codigo: `RangoSlider({
  start: [200, 800],            // [min, max] → dual handle
  min: 0, max: 1000, step: 10,
  tooltips: true,
  format: fmt.moneda('USD'),
  onChange: ([lo, hi]) => filtrarPrecio(lo, hi),
})`,
      })],
    }),

    // ========== 3 ==========
    Seccion({
      titulo: '3 · Con pips (marcas en el track)',
      descripcion: 'Marcas visuales con etiqueta. `mode: "steps"` muestra una marca por cada step, `valores: [n, n, n]` permite marcas custom. Útil para escalas semánticas (S/M/L/XL, calificaciones).',
      hijos: [VistaCodigo({
        vista: (() => {
          const cal = senal(3);
          const eco = crearEl('span', { style: { fontSize: '12.5px', color: 'var(--primary)', fontWeight: 600 } });
          const labels = ['', 'Muy baja', 'Baja', 'Media', 'Alta', 'Muy alta'];
          efecto(() => { eco.textContent = `${cal.value} ★ — ${labels[cal.value]}`; });
          return crearEl('div', { style: { maxWidth: '500px' } }, [
            Stack(
              Campo({ label: ['Calificación — ', eco],
                hijos: RangoSlider({
                  start: [3], min: 1, max: 5, step: 1,
                  tooltips: true,
                  pips: { mode: 'steps' },
                  onChange: (v) => cal.value = v,
                }),
              }),
              Campo({ label: 'Talla',
                hijos: RangoSlider({
                  start: [2], min: 0, max: 4, step: 1,
                  pips: { valores: [0, 1, 2, 3, 4] },
                  format: { to: (v) => ['XS', 'S', 'M', 'L', 'XL'][Math.round(v)] || '' },
                  tooltips: true,
                }),
              }),
            ),
          ]);
        })(),
        codigo: `RangoSlider({
  start: [3], min: 1, max: 5, step: 1,
  pips: { mode: 'steps' },        // una marca por step
  // o:  pips: { valores: [0, 25, 50, 75, 100] }
})

// Custom labels:
RangoSlider({
  start: [2], min: 0, max: 4,
  format: { to: v => ['XS','S','M','L','XL'][Math.round(v)] },
})`,
      })],
    }),

    // ========== 4 ==========
    Seccion({
      titulo: '4 · Formatters de moneda',
      descripcion: 'Helpers built-in: `fmt.moneda(codigo, decimales)`, `fmt.porcentaje(decimales)`, `fmt.numero(sufijo)`. Usan `Intl.NumberFormat` nativo para localización correcta.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { maxWidth: '500px' } }, [
          Stack(
            Campo({ label: 'Presupuesto mensual (PEN)', hint: 'Cuánto puedes gastar al mes',
              hijos: RangoSlider({
                start: [25000], min: 1000, max: 100000, step: 500,
                tooltips: true, format: fmt.moneda('PEN'),
              }),
            }),
            Campo({ label: 'Conversión USD',
              hijos: RangoSlider({
                start: [3500], min: 0, max: 10000, step: 100,
                tooltips: true, format: fmt.moneda('USD'),
              }),
            }),
            Campo({ label: 'Visitas mensuales',
              hijos: RangoSlider({
                start: [50000], min: 0, max: 1000000, step: 1000,
                tooltips: true, format: fmt.numero(' visitas'),
              }),
            }),
          ),
        ]),
        codigo: `import { fmt } from '../_slider.js';

RangoSlider({ format: fmt.moneda('PEN') })           // S/ 25,000
RangoSlider({ format: fmt.moneda('USD', 2) })        // $1,234.50
RangoSlider({ format: fmt.porcentaje(1) })           // 65.5%
RangoSlider({ format: fmt.numero(' visitas') })      // 50,000 visitas

// O custom:
RangoSlider({
  format: {
    to: v => v + ' km',
    from: v => parseFloat(v),
  },
})`,
      })],
    }),

    // ========== 5 ==========
    Seccion({
      titulo: '5 · Caso real — panel de filtros tipo Airbnb',
      descripcion: 'Combinando varios sliders en un panel de filtros. Cada uno con su formatter apropiado: precio en moneda, habitaciones con pips por step, distancia con sufijo "km".',
      hijos: [VistaCodigo({
        vista: (() => {
          const precio = senal([40, 350]);
          const habs = senal([1, 4]);
          const dist = senal(10);
          const eco = crearEl('div', { style: { padding: '10px 12px', background: 'color-mix(in srgb, var(--primary) 8%, transparent)', borderRadius: '6px', fontSize: '12px', color: 'var(--foreground)', fontVariantNumeric: 'tabular-nums', marginBlockStart: '12px' } });
          efecto(() => {
            eco.textContent = `Filtrando: $${precio.value[0]}-$${precio.value[1]} · ${habs.value[0]}-${habs.value[1]} habs · radio ${dist.value} km`;
          });
          return crearEl('div', {
            style: {
              maxWidth: '460px',
              padding: 'var(--space-4) var(--space-5)',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
            },
          }, [
            crearEl('h4', {
              style: { margin: '0 0 var(--space-3)', fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted-foreground)' },
            }, ['Filtros']),
            Stack(
              Campo({ label: 'Precio por noche',
                hijos: RangoSlider({
                  start: [40, 350], min: 0, max: 500, step: 10,
                  tooltips: true, format: fmt.moneda('USD'),
                  onChange: (v) => precio.value = v,
                }),
              }),
              Campo({ label: 'Habitaciones',
                hijos: RangoSlider({
                  start: [1, 4], min: 1, max: 8, step: 1,
                  tooltips: true,
                  pips: { mode: 'steps' },
                  onChange: (v) => habs.value = v,
                }),
              }),
              Campo({ label: 'Distancia al centro',
                hijos: RangoSlider({
                  start: [10], min: 1, max: 50, step: 1,
                  tooltips: true, format: fmt.numero(' km'),
                  onChange: (v) => dist.value = v,
                }),
              }),
            ),
            eco,
          ]);
        })(),
        codigo: `<aside class="filtros">
  <RangoSlider start={[40, 350]} min={0} max={500}
               format={fmt.moneda('USD')} onChange={setPrecio} />
  <RangoSlider start={[1, 4]} min={1} max={8} step={1}
               pips={{ mode: 'steps' }} onChange={setHabs} />
  <RangoSlider start={[10]} min={1} max={50}
               format={fmt.numero(' km')} onChange={setDist} />
</aside>`,
      })],
    }),

  ],
});
