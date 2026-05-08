import { PaginaShowcase, Seccion } from '../../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../../components/ui/code-preview/code-preview.js';
import { Echart, opcionesBase, merge, PALETA } from '../_compartido.js';
import { corner6 } from '../../../../components/ui/card/card-decoraciones.js';

const DATOS = [
  { value: 42, name: 'Orgánico' },
  { value: 18, name: 'Pago' },
  { value: 22, name: 'Referido' },
  { value: 12, name: 'Email' },
  { value: 6,  name: 'Social' },
];

export default async () => PaginaShowcase({
  titulo: 'ECharts · Pastel / Donut',
  descripcion: 'Pie y donut charts. Muestran proporciones de un total. Pro tip: úsalos cuando hay ≤6 categorías y el orden importa — para más, prefiere una barra horizontal apilada.',
  decoracion: corner6(),
  migas: [
    { etiqueta: 'Módulos', href: '#/modulos' },
    { etiqueta: 'Gráficos', href: '#/modulos/graficos' },
  ],
  hijos: [

    Seccion({
      titulo: '1 · Pie básico',
      descripcion: 'Pastel clásico. Etiquetas externas con líneas conectoras.',
      hijos: [VistaCodigo({
        vista: Echart({
          alto: '380px',
          opcion: merge(opcionesBase(), {
            tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
            series: [{
              type: 'pie', radius: '70%',
              data: DATOS,
              label: { color: 'inherit' },
              labelLine: { lineStyle: { color: 'rgba(120,120,120,0.4)' } },
              emphasis: { itemStyle: { shadowBlur: 18, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.2)' } },
            }],
            xAxis: undefined, yAxis: undefined, grid: undefined, legend: undefined,
          }),
        }),
        codigo: `series: [{
  type: 'pie',
  radius: '70%',
  data: [
    { value: 42, name: 'Orgánico' },
    { value: 18, name: 'Pago' },
  ],
}]`,
      })],
    }),

    Seccion({
      titulo: '2 · Donut con texto central',
      descripcion: 'Donut con `radius: ["55%", "85%"]` y un texto centrado mostrando el total. Patrón de Stripe Dashboard / Mixpanel.',
      hijos: [VistaCodigo({
        vista: Echart({
          alto: '400px',
          opcion: merge(opcionesBase(), {
            tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
            graphic: [
              { type: 'text', left: 'center', top: '46%', style: { text: '100%', fontSize: 36, fontWeight: 800, fill: 'currentColor' } },
              { type: 'text', left: 'center', top: '58%', style: { text: 'TOTAL TRÁFICO', fontSize: 11, fill: 'currentColor', opacity: 0.6 } },
            ],
            series: [{
              type: 'pie', radius: ['55%', '85%'], avoidLabelOverlap: false,
              padAngle: 3, itemStyle: { borderRadius: 8 },
              data: DATOS, label: { show: false },
              emphasis: { label: { show: true, fontSize: 14, fontWeight: 700 } },
            }],
            xAxis: undefined, yAxis: undefined, grid: undefined, legend: undefined,
          }),
        }),
        codigo: `series: [{
  type: 'pie', radius: ['55%', '85%'],         // donut grande
  padAngle: 3,                                  // separación entre slices
  itemStyle: { borderRadius: 8 },               // bordes redondeados
}],
graphic: [                                      // texto al centro
  { type: 'text', style: { text: '100%', fontSize: 36 } },
]`,
      })],
    }),

    Seccion({
      titulo: '3 · Half donut (semicírculo)',
      descripcion: 'Donut de 180°. Útil cuando lo importante es el "% completado" o "score" sobre un máximo. Combina con un texto central.',
      hijos: [VistaCodigo({
        vista: Echart({
          alto: '320px',
          opcion: merge(opcionesBase(), {
            tooltip: { trigger: 'item' },
            graphic: [
              { type: 'text', left: 'center', top: '60%', style: { text: '78%', fontSize: 42, fontWeight: 800, fill: 'currentColor' } },
              { type: 'text', left: 'center', top: '78%', style: { text: 'CONVERSIÓN', fontSize: 11, fill: 'currentColor', opacity: 0.6 } },
            ],
            series: [{
              type: 'pie', radius: ['55%', '90%'], center: ['50%', '78%'],
              startAngle: 180, endAngle: 360,
              padAngle: 0, itemStyle: { borderRadius: 0 },
              data: [
                { value: 78, name: 'Completado', itemStyle: { color: PALETA[0] } },
                { value: 22, name: 'Restante',   itemStyle: { color: 'rgba(120,120,120,0.15)' } },
              ],
              label: { show: false },
            }],
            xAxis: undefined, yAxis: undefined, grid: undefined, legend: undefined,
          }),
        }),
        codigo: `series: [{
  type: 'pie',
  radius: ['55%', '90%'],
  startAngle: 180, endAngle: 360,             // semicírculo
  data: [
    { value: 78, name: 'Completado' },
    { value: 22, name: 'Restante' },
  ],
}]`,
      })],
    }),

    Seccion({
      titulo: '4 · Rose chart (Nightingale)',
      descripcion: 'Variante donde el RADIO de cada slice es proporcional al valor (no el ángulo). Más visualmente impactante. Inventado por Florence Nightingale en 1858.',
      hijos: [VistaCodigo({
        vista: Echart({
          alto: '380px',
          opcion: merge(opcionesBase(), {
            tooltip: { trigger: 'item' },
            series: [{
              type: 'pie', radius: [40, 160],
              roseType: 'area',
              itemStyle: { borderRadius: 8 },
              data: [
                { value: 92, name: 'Lima' },
                { value: 78, name: 'Madrid' },
                { value: 64, name: 'NYC' },
                { value: 56, name: 'Tokio' },
                { value: 48, name: 'Paris' },
                { value: 40, name: 'Berlín' },
                { value: 32, name: 'Sydney' },
                { value: 24, name: 'CDMX' },
              ],
            }],
            xAxis: undefined, yAxis: undefined, grid: undefined, legend: undefined,
          }),
        }),
        codigo: `series: [{
  type: 'pie',
  radius: [40, 160],
  roseType: 'area',                            // ← lo que da el efecto Rose
  itemStyle: { borderRadius: 8 },
  data: [...],
}]`,
      })],
    }),

    Seccion({
      titulo: '5 · Sunburst (donut anidado / jerarquía)',
      descripcion: 'Datos jerárquicos en anillos concéntricos. Cada nivel es un layer del árbol. Ideal para filesystem, organigramas, presupuestos.',
      hijos: [VistaCodigo({
        vista: Echart({
          alto: '420px',
          opcion: merge(opcionesBase(), {
            tooltip: { trigger: 'item' },
            series: [{
              type: 'sunburst',
              data: [
                {
                  name: 'Frontend', itemStyle: { color: PALETA[0] },
                  children: [
                    { name: 'React',  value: 22 },
                    { name: 'Vue',    value: 12 },
                    { name: 'Svelte', value: 8 },
                    { name: 'Angular', value: 6 },
                  ],
                },
                {
                  name: 'Backend', itemStyle: { color: PALETA[3] },
                  children: [
                    { name: 'Node.js', value: 16 },
                    { name: 'Python',  value: 12 },
                    { name: 'Go',      value: 6 },
                    { name: 'Rust',    value: 4 },
                  ],
                },
                {
                  name: 'Database', itemStyle: { color: PALETA[1] },
                  children: [
                    { name: 'PostgreSQL', value: 10 },
                    { name: 'MongoDB',    value: 6 },
                    { name: 'Redis',      value: 4 },
                  ],
                },
                {
                  name: 'DevOps', itemStyle: { color: PALETA[5] },
                  children: [
                    { name: 'Docker',     value: 8 },
                    { name: 'Kubernetes', value: 5 },
                    { name: 'Terraform',  value: 3 },
                  ],
                },
              ],
              radius: ['10%', '90%'],
              label: { rotate: 'radial', fontSize: 11 },
              emphasis: { focus: 'ancestor' },
            }],
            xAxis: undefined, yAxis: undefined, grid: undefined, legend: undefined,
          }),
        }),
        codigo: `series: [{
  type: 'sunburst',
  radius: ['10%', '90%'],
  data: [
    { name: 'Frontend', children: [{ name: 'React', value: 22 }, ...] },
    { name: 'Backend',  children: [...] },
  ],
}]`,
      })],
    }),

    Seccion({
      titulo: '6 · Pie con labels destacadas + leyenda',
      descripcion: 'Diseño "marketing pie" — números grandes en cada slice + leyenda lateral con porcentajes.',
      hijos: [VistaCodigo({
        vista: Echart({
          alto: '380px',
          opcion: merge(opcionesBase(), {
            tooltip: { trigger: 'item' },
            legend: { orient: 'vertical', left: 'right', top: 'center', formatter: (n) => {
              const item = DATOS.find((d) => d.name === n);
              return `${n}  ${item.value}%`;
            } },
            series: [{
              type: 'pie', radius: ['40%', '78%'], center: ['38%', '50%'],
              padAngle: 2, itemStyle: { borderRadius: 6 },
              data: DATOS,
              label: { show: true, fontSize: 14, fontWeight: 700, color: '#fff', formatter: '{c}%' },
              labelLayout: { hideOverlap: true },
            }],
            xAxis: undefined, yAxis: undefined, grid: undefined,
          }),
        }),
        codigo: `legend: {
  orient: 'vertical', left: 'right',
  formatter: n => \`\${n}  \${dato.valor}%\`,
},
series: [{
  type: 'pie', radius: ['40%', '78%'],
  center: ['38%', '50%'],                      // pie a la izquierda
  label: { show: true, formatter: '{c}%', color: '#fff' },
}]`,
      })],
    }),

  ],
});
