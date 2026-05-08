import { crearEl } from '../../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../../utils/helpers/reactive.js';
import { PaginaShowcase, Seccion } from '../../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../../components/ui/code-preview/code-preview.js';
import { corner5 } from '../../../../components/ui/card/card-decoraciones.js';
import { Campo, Stack, Grid2 } from '../_compartido.js';

// Helper que sincroniza la CSS var `--valor` (porcentaje) en cada cambio
// para que el track de WebKit muestre la parte recorrida en color primary.
// Firefox usa ::-moz-range-progress nativo y no necesita esto.
const actualizarProgreso = (input) => {
  const min = parseFloat(input.min) || 0;
  const max = parseFloat(input.max) || 100;
  const val = parseFloat(input.value);
  const pct = ((val - min) / (max - min)) * 100;
  input.style.setProperty('--valor', `${pct}%`);
};

const RangeNativo = ({ min = 0, max = 100, step = 1, value = 50, onInput, deshabilitado } = {}) => {
  const input = crearEl('input', {
    type: 'range', min, max, step, value,
    class: 'range',
    disabled: deshabilitado || null,
    onInput: (e) => { actualizarProgreso(e.target); onInput && onInput(e); },
  });
  // Pinta el progreso inicial antes de que el usuario interactúe.
  requestAnimationFrame(() => actualizarProgreso(input));
  return input;
};

export default async () => PaginaShowcase({
  titulo: 'Range — sliders nativos',
  descripcion: 'Range inputs HTML5 con custom styling — track con `appearance: none`, thumb circular con border-color del primary, hover scale, focus ring. Para sliders avanzados (rango doble, marcadores, formato custom) ver "Range slider" en advance.',
  decoracion: corner5(),
  migas: [
    { etiqueta: 'Módulos', href: '#/modulos' },
    { etiqueta: 'Formularios', href: '#/modulos/forms' },
  ],
  hijos: [

    Seccion({
      titulo: '1 · Range básico',
      descripcion: 'El input más simple. Track horizontal + thumb circular. Mantén click + flecha izq/der para mover de a 1.',
      hijos: [VistaCodigo({
        vista: (() => {
          const valor = senal(35);
          const valor2 = senal(70);
          const valor3 = senal(0.5);
          const lbl = (s) => { const e = crearEl('span', { style: { fontWeight: 700, color: 'var(--primary)', fontVariantNumeric: 'tabular-nums' } }); efecto(() => { e.textContent = s.value; }); return e; };

          return Stack(
            Campo({ label: ['Volumen: ', lbl(valor)],
              hijos: RangeNativo({ value: valor.peek(), onInput: (e) => valor.value = parseInt(e.target.value) }),
            }),
            Campo({ label: ['Brillo: ', lbl(valor2), '%'],
              hijos: RangeNativo({ value: valor2.peek(), onInput: (e) => valor2.value = parseInt(e.target.value) }),
            }),
            Campo({ label: ['Opacidad: ', lbl(valor3)],
              hijos: RangeNativo({ min: 0, max: 1, step: 0.05, value: valor3.peek(), onInput: (e) => valor3.value = parseFloat(e.target.value).toFixed(2) }),
            }),
          );
        })(),
        codigo: `<input type="range" class="range" min="0" max="100" value="35"
       onInput={(e) => setValor(e.target.value)} />`,
      })],
    }),

    Seccion({
      titulo: '2 · Con marcadores (datalist)',
      descripcion: 'Agrega `<datalist>` con `<option>` para mostrar tick marks visuales. Snapping automático del browser.',
      hijos: [VistaCodigo({
        vista: (() => {
          const v = senal(2);
          const labels = ['Mínimo', 'Bajo', 'Medio', 'Alto', 'Máximo'];
          const lblEl = crearEl('span', { style: { fontWeight: 700, color: 'var(--primary)' } });
          efecto(() => { lblEl.textContent = labels[v.value]; });
          return Campo({ label: ['Nivel de calidad: ', lblEl],
            hijos: crearEl('div', null, [
              RangeNativo({ min: 0, max: 4, step: 1, value: 2,
                onInput: (e) => v.value = parseInt(e.target.value),
              }),
              crearEl('div', { class: 'range-marcas' }, labels.map((l) => crearEl('span', null, [l]))),
            ]),
          });
        })(),
        codigo: `<input type="range" min="0" max="4" step="1" list="calidad-marcas">
<datalist id="calidad-marcas">
  <option>Mínimo</option><option>Bajo</option>...
</datalist>`,
      })],
    }),

    Seccion({
      titulo: '3 · Con prefix/suffix de unidades',
      descripcion: 'Patrón típico de calculadoras y filtros — el valor se renderiza al lado del slider con la unidad apropiada.',
      hijos: [VistaCodigo({
        vista: (() => {
          const precio = senal(450);
          const distancia = senal(15);
          const lbl1 = crearEl('span', { style: { fontWeight: 700 } });
          const lbl2 = crearEl('span', { style: { fontWeight: 700 } });
          efecto(() => { lbl1.textContent = `$${precio.value.toLocaleString()}`; });
          efecto(() => { lbl2.textContent = `${distancia.value} km`; });

          return Stack(
            Campo({ label: ['Presupuesto máximo: ', lbl1, ' / mes'],
              hijos: RangeNativo({ min: 100, max: 2000, step: 50, value: precio.peek(), onInput: (e) => precio.value = parseInt(e.target.value) }),
            }),
            Campo({ label: ['Radio de búsqueda: ', lbl2],
              hijos: RangeNativo({ min: 1, max: 50, value: distancia.peek(), onInput: (e) => distancia.value = parseInt(e.target.value) }),
            }),
          );
        })(),
        codigo: `// El valor se sincroniza con un span al lado del label
const precio = senal(450);
efecto(() => { lblEl.textContent = '$' + precio.value; });`,
      })],
    }),

    Seccion({
      titulo: '4 · Estados',
      descripcion: 'Default, focus (anillo azul), disabled. El thumb crece al hover (scale 1.15) para indicar que es draggable.',
      hijos: [VistaCodigo({
        vista: Grid2(
          Campo({ label: 'Default', hijos: RangeNativo({ value: 60 }) }),
          Campo({ label: 'Disabled', hijos: RangeNativo({ value: 60, deshabilitado: true }) }),
        ),
        codigo: `<input type="range" class="range" disabled />`,
      })],
    }),

  ],
});
