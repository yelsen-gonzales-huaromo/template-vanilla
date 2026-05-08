import { crearEl } from '../../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../../components/ui/code-preview/code-preview.js';
import { cargarECharts } from '../../../../integrations/echarts/index.js';
import { opcionesBase, merge, PALETA } from '../_compartido.js';
import { estadoUi } from '../../../../store/ui.store.js';
import { corner4 } from '../../../../components/ui/card/card-decoraciones.js';

// GeoJSON del mundo (sirve como dataset standard de ECharts)
const URL_WORLD = 'https://cdn.jsdelivr.net/gh/apache/echarts@master/test/data/map/json/world.json';

let mundoCargado = null;
const asegurarMundo = async (echarts) => {
  if (mundoCargado) return mundoCargado;
  mundoCargado = fetch(URL_WORLD).then((r) => r.json()).then((json) => {
    echarts.registerMap('world', json);
    return json;
  });
  return mundoCargado;
};

// Helper específico para esta página: monta un map chart después de cargar el mundo
const EchartMapa = ({ opcion, alto = '480px' }) => {
  const div = crearEl('div', {
    style: {
      width: '100%', height: alto,
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
    },
  });

  let inited = false;
  const obs = new IntersectionObserver(async (entries) => {
    if (!entries[0].isIntersecting || inited) return;
    inited = true;
    obs.disconnect();
    const echarts = await cargarECharts();
    await asegurarMundo(echarts);
    const tema = estadoUi.tema.peek();
    const inst = echarts.init(div, tema === 'dark' ? 'dark' : null);
    inst.setOption(opcion);
    new ResizeObserver(() => inst.resize()).observe(div);
  });
  obs.observe(div);

  return div;
};

// Datos de ejemplo
const DATOS_PAISES = [
  { name: 'United States', value: 4500 }, { name: 'Brazil', value: 2400 },
  { name: 'India',          value: 1800 }, { name: 'Germany', value: 1650 },
  { name: 'China',          value: 3200 }, { name: 'Japan', value: 1450 },
  { name: 'United Kingdom', value: 1280 }, { name: 'France', value: 1180 },
  { name: 'Spain',          value: 920 },  { name: 'Mexico', value: 780 },
  { name: 'Argentina',      value: 540 },  { name: 'Colombia', value: 420 },
  { name: 'Peru',           value: 380 },  { name: 'Chile', value: 320 },
  { name: 'Australia',      value: 760 },  { name: 'Canada', value: 1140 },
  { name: 'South Africa',   value: 410 },  { name: 'Egypt', value: 280 },
  { name: 'Saudi Arabia',   value: 540 },  { name: 'Russia', value: 1280 },
  { name: 'Indonesia',      value: 980 },  { name: 'Korea', value: 720 },
];

// Coordenadas [lng, lat] de ciudades
const CIUDADES = {
  Lima:     [-77.04, -12.04],
  Madrid:   [-3.70, 40.41],
  NewYork:  [-74.00, 40.71],
  Tokyo:    [139.65, 35.67],
  London:   [-0.12, 51.50],
  Sydney:   [151.20, -33.86],
  SaoPaulo: [-46.63, -23.55],
  Singapore: [103.81, 1.35],
  Mumbai:   [72.87, 19.07],
  CDMX:     [-99.13, 19.43],
  Berlin:   [13.40, 52.52],
  Dubai:    [55.27, 25.20],
};

export default async () => PaginaShowcase({
  titulo: 'ECharts · Mapas geográficos',
  descripcion: 'Mapas con choropleth, bubble points, líneas de conexión y heatmaps. ECharts admite cualquier GeoJSON — el del mundo lo cargamos lazy desde CDN. Para mapas de país, departamentos o regiones, usa el GeoJSON correspondiente y `registerMap()`.',
  decoracion: corner4(),
  migas: [
    { etiqueta: 'Módulos', href: '#/modulos' },
    { etiqueta: 'Gráficos', href: '#/modulos/graficos' },
  ],
  hijos: [

    Seccion({
      titulo: '1 · Choropleth — usuarios por país',
      descripcion: 'Cada país coloreado según un valor. El `visualMap` da la escala de colores y permite filtrar drag con el slider.',
      hijos: [VistaCodigo({
        vista: EchartMapa({
          opcion: {
            ...opcionesBase(),
            tooltip: { trigger: 'item', formatter: (p) => p.value !== undefined ? `<strong>${p.name}</strong><br>${p.value.toLocaleString()} usuarios` : p.name },
            visualMap: {
              min: 0, max: 5000, left: 20, bottom: 20, calculable: true, orient: 'horizontal',
              inRange: { color: ['#e0e7ff', '#6366f1', '#312e81'] },
              textStyle: { color: 'inherit' },
            },
            series: [{
              type: 'map', map: 'world', roam: true,
              emphasis: { label: { show: true }, itemStyle: { areaColor: '#fbbf24' } },
              data: DATOS_PAISES,
              itemStyle: { borderColor: 'rgba(120,120,120,0.25)', borderWidth: 0.5, areaColor: 'rgba(120,120,120,0.06)' },
            }],
            xAxis: undefined, yAxis: undefined, grid: undefined, legend: undefined,
          },
        }),
        codigo: `// 1) Cargar GeoJSON
const json = await fetch(URL_WORLD).then(r => r.json());
echarts.registerMap('world', json);

// 2) Configurar series
{
  visualMap: { min: 0, max: 5000, inRange: { color: ['#e0e7ff', '#312e81'] } },
  series: [{
    type: 'map', map: 'world', roam: true,
    data: [{ name: 'United States', value: 4500 }, ...],
  }],
}`,
      })],
    }),

    Seccion({
      titulo: '2 · Bubbles sobre mapa (effectScatter)',
      descripcion: 'Puntos animados sobre coordenadas geográficas. `effectScatter` añade un ripple animado — perfecto para mostrar tráfico en vivo, sedes, eventos geo-localizados.',
      hijos: [VistaCodigo({
        vista: EchartMapa({
          opcion: {
            ...opcionesBase(),
            tooltip: { trigger: 'item' },
            geo: {
              map: 'world', roam: true,
              itemStyle: { areaColor: 'rgba(120,120,120,0.08)', borderColor: 'rgba(120,120,120,0.2)' },
              emphasis: { itemStyle: { areaColor: 'rgba(120,120,120,0.18)' } },
            },
            series: [{
              type: 'effectScatter', coordinateSystem: 'geo',
              data: Object.entries(CIUDADES).map(([n, c]) => ({ name: n, value: [...c, 200 + Math.random() * 800] })),
              symbolSize: (v) => Math.sqrt(v[2]) / 2,
              rippleEffect: { brushType: 'stroke', scale: 4 },
              itemStyle: { color: PALETA[0], shadowBlur: 12, shadowColor: PALETA[0] },
              emphasis: { scale: 1.4 },
            }],
            xAxis: undefined, yAxis: undefined, grid: undefined, legend: undefined,
          },
        }),
        codigo: `geo: { map: 'world', roam: true },
series: [{
  type: 'effectScatter',                       // ← ripple animado
  coordinateSystem: 'geo',
  data: [{ name: 'Lima', value: [-77.04, -12.04, 380] }],
  symbolSize: v => Math.sqrt(v[2]) / 2,
  rippleEffect: { brushType: 'stroke', scale: 4 },
}]`,
      })],
    }),

    Seccion({
      titulo: '3 · Líneas de conexión (rutas / vuelos)',
      descripcion: 'Tipo `lines` con coordenadas origen-destino + `effect` animado. Patrón clásico para rutas aéreas, redes globales, distribución logística.',
      hijos: [VistaCodigo({
        vista: EchartMapa({
          opcion: {
            ...opcionesBase(),
            tooltip: { trigger: 'item' },
            geo: {
              map: 'world', roam: true,
              itemStyle: { areaColor: 'rgba(120,120,120,0.08)', borderColor: 'rgba(120,120,120,0.2)' },
            },
            series: [
              {
                type: 'lines', coordinateSystem: 'geo', zlevel: 2,
                effect: { show: true, period: 4, trailLength: 0, symbol: 'arrow', symbolSize: 8, color: '#fff' },
                lineStyle: { color: PALETA[5], width: 1.5, opacity: 0.7, curveness: 0.3 },
                data: [
                  { coords: [CIUDADES.NewYork, CIUDADES.London] },
                  { coords: [CIUDADES.NewYork, CIUDADES.Madrid] },
                  { coords: [CIUDADES.NewYork, CIUDADES.SaoPaulo] },
                  { coords: [CIUDADES.London, CIUDADES.Dubai] },
                  { coords: [CIUDADES.London, CIUDADES.Singapore] },
                  { coords: [CIUDADES.Tokyo, CIUDADES.Sydney] },
                  { coords: [CIUDADES.Tokyo, CIUDADES.NewYork] },
                  { coords: [CIUDADES.Mumbai, CIUDADES.Singapore] },
                  { coords: [CIUDADES.Madrid, CIUDADES.Lima] },
                  { coords: [CIUDADES.Madrid, CIUDADES.CDMX] },
                  { coords: [CIUDADES.SaoPaulo, CIUDADES.Lima] },
                ],
              },
              {
                type: 'effectScatter', coordinateSystem: 'geo', zlevel: 3,
                data: Object.entries(CIUDADES).map(([n, c]) => ({ name: n, value: c })),
                symbolSize: 8,
                rippleEffect: { brushType: 'stroke', scale: 3 },
                itemStyle: { color: PALETA[0] },
              },
            ],
            xAxis: undefined, yAxis: undefined, grid: undefined, legend: undefined,
          },
        }),
        codigo: `series: [
  {
    type: 'lines',
    coordinateSystem: 'geo',
    effect: {                                  // ← arrow animado
      show: true, period: 4,
      symbol: 'arrow', symbolSize: 8,
    },
    data: [
      { coords: [[lng1, lat1], [lng2, lat2]] },
      ...
    ],
  },
  // + effectScatter para los puntos en cada extremo
]`,
      })],
    }),

    Seccion({
      titulo: '4 · Heatmap geográfico (densidad)',
      descripcion: 'Concentración de eventos sobre el mapa — útil para mostrar zonas calientes, tráfico, eventos. Usa `heatmap` sobre `coordinateSystem: geo`.',
      hijos: [VistaCodigo({
        vista: EchartMapa({
          opcion: {
            ...opcionesBase(),
            tooltip: { show: false },
            visualMap: {
              min: 0, max: 5, calculable: true, orient: 'horizontal', left: 20, bottom: 20,
              inRange: { color: ['#bfdbfe00', '#3b82f6', '#8b5cf6', '#ef4444'] },
              textStyle: { color: 'inherit' },
            },
            geo: {
              map: 'world', roam: true,
              itemStyle: { areaColor: 'rgba(120,120,120,0.08)', borderColor: 'rgba(120,120,120,0.2)' },
            },
            series: [{
              type: 'heatmap', coordinateSystem: 'geo', pointSize: 14, blurSize: 18,
              data: (() => {
                const out = [];
                Object.values(CIUDADES).forEach((c) => {
                  for (let i = 0; i < 12; i++) {
                    out.push([c[0] + (Math.random() - 0.5) * 20, c[1] + (Math.random() - 0.5) * 14, Math.random() * 5]);
                  }
                });
                return out;
              })(),
            }],
            xAxis: undefined, yAxis: undefined, grid: undefined, legend: undefined,
          },
        }),
        codigo: `series: [{
  type: 'heatmap',
  coordinateSystem: 'geo',
  pointSize: 14, blurSize: 18,
  data: [[lng, lat, intensidad], ...],
}]`,
      })],
    }),

    Seccion({
      titulo: '5 · Combinado: choropleth + bubbles',
      descripcion: 'El layer 1 colorea países por valor, el layer 2 superpone bubbles de ciudades específicas. Patrón "donde están y cuánto pesan".',
      hijos: [VistaCodigo({
        vista: EchartMapa({
          opcion: {
            ...opcionesBase(),
            tooltip: { trigger: 'item' },
            visualMap: {
              min: 0, max: 5000, left: 20, bottom: 20, calculable: true, orient: 'horizontal',
              inRange: { color: ['#dbeafe', '#3b82f6', '#1e3a8a'] },
              textStyle: { color: 'inherit' },
            },
            geo: {
              map: 'world', roam: true,
              itemStyle: { areaColor: 'rgba(120,120,120,0.08)', borderColor: 'rgba(120,120,120,0.2)' },
            },
            series: [
              {
                type: 'map', map: 'world', roam: true,
                data: DATOS_PAISES,
                geoIndex: 0,
              },
              {
                type: 'effectScatter', coordinateSystem: 'geo', zlevel: 2,
                data: Object.entries(CIUDADES).slice(0, 8).map(([n, c]) => ({ name: n, value: [...c, 200 + Math.random() * 800] })),
                symbolSize: (v) => Math.sqrt(v[2]) / 2,
                rippleEffect: { brushType: 'stroke', scale: 3 },
                itemStyle: { color: '#f97316', shadowBlur: 8, shadowColor: '#f97316' },
              },
            ],
            xAxis: undefined, yAxis: undefined, grid: undefined, legend: undefined,
          },
        }),
        codigo: `series: [
  // Layer 1 — coloreado por país
  { type: 'map', map: 'world', data: paisesConValor },
  // Layer 2 — bubbles sobre ciudades específicas
  { type: 'effectScatter', coordinateSystem: 'geo', data: ciudades },
]`,
      })],
    }),

  ],
});
