import { crearEl } from '../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { D3Chart, PALETA, MESES, ventasMensuales, usuariosActivos } from './_compartido.js';
import { corner6 } from '../../../components/ui/card/card-decoraciones.js';

export default async () => PaginaShowcase({
  titulo: 'D3.js',
  descripcion: 'D3 es la biblioteca low-level más potente para visualización de datos. No es un "constructor de charts" — es un toolkit para crear visualizaciones a medida con SVG/Canvas/WebGL: data joins, escalas, ejes, layouts (force, hierarchy, treemap, sankey…), interpolación y transiciones. Pesa ~280KB pero es modular (puedes importar sólo lo que uses con d3-array, d3-scale, etc.).',
  decoracion: corner6(),
  migas: [
    { etiqueta: 'Módulos', href: '#/modulos' },
    { etiqueta: 'Gráficos', href: '#/modulos/graficos' },
  ],
  hijos: [

    Seccion({
      titulo: '1 · Bar chart con escalas y ejes',
      descripcion: 'El "hello world" de D3: scaleBand para X, scaleLinear para Y, axisBottom/axisLeft, y barras con `enter().append()`. Animación inicial de altura.',
      hijos: [VistaCodigo({
        vista: D3Chart({
          alto: '340px',
          render: ({ d3, svg, w, h }) => {
            const margin = { top: 20, right: 24, bottom: 36, left: 50 };
            const width = w - margin.left - margin.right;
            const height = h - margin.top - margin.bottom;
            const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

            const x = d3.scaleBand().domain(MESES).range([0, width]).padding(0.3);
            const y = d3.scaleLinear().domain([0, d3.max(ventasMensuales) * 1.1]).range([height, 0]);

            const muted = getComputedStyle(document.documentElement).getPropertyValue('--muted-foreground').trim();
            g.append('g').attr('transform', `translate(0,${height})`)
              .call(d3.axisBottom(x).tickSize(0).tickPadding(10))
              .call((sel) => sel.selectAll('text').attr('fill', muted).attr('font-size', '11px'))
              .call((sel) => sel.selectAll('path').attr('stroke', 'rgba(120,120,120,0.2)'));
            g.append('g').call(d3.axisLeft(y).ticks(5).tickFormat((d) => d / 1000 + 'K').tickSize(-width))
              .call((sel) => sel.selectAll('text').attr('fill', muted).attr('font-size', '11px'))
              .call((sel) => sel.selectAll('line').attr('stroke', 'rgba(120,120,120,0.1)').attr('stroke-dasharray', '3 3'))
              .call((sel) => sel.selectAll('path').attr('stroke', 'transparent'));

            g.selectAll('rect.bar').data(ventasMensuales).enter().append('rect')
              .attr('class', 'bar')
              .attr('x', (_, i) => x(MESES[i]))
              .attr('y', height)
              .attr('width', x.bandwidth())
              .attr('height', 0)
              .attr('rx', 4)
              .attr('fill', PALETA[0])
              .transition().duration(800).delay((_, i) => i * 50)
              .attr('y', (d) => y(d))
              .attr('height', (d) => height - y(d));
          },
        }),
        codigo: `const x = d3.scaleBand().domain(meses).range([0, w]).padding(0.3);
const y = d3.scaleLinear().domain([0, d3.max(datos)]).range([h, 0]);

g.append('g').call(d3.axisBottom(x));
g.append('g').call(d3.axisLeft(y));

g.selectAll('rect').data(datos).enter().append('rect')
  .attr('x', (_, i) => x(meses[i]))
  .attr('y', d => y(d))
  .attr('width', x.bandwidth())
  .attr('height', d => h - y(d))
  .attr('fill', '#3b82f6');`,
      })],
    }),

    Seccion({
      titulo: '2 · Line chart con curva natural y área',
      descripcion: '`d3.line()` con curva `curveNatural` (más suave que `curveCatmullRom`) + un `d3.area()` debajo con gradiente que va hacia transparente.',
      hijos: [VistaCodigo({
        vista: D3Chart({
          alto: '340px',
          render: ({ d3, svg, w, h }) => {
            const margin = { top: 20, right: 24, bottom: 36, left: 50 };
            const width = w - margin.left - margin.right;
            const height = h - margin.top - margin.bottom;
            const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

            const x = d3.scaleLinear().domain([0, MESES.length - 1]).range([0, width]);
            const y = d3.scaleLinear().domain([0, d3.max(usuariosActivos) * 1.1]).range([height, 0]);

            // Gradient defs
            const defs = svg.append('defs');
            const grad = defs.append('linearGradient').attr('id', 'grad-d3-1').attr('x1', 0).attr('x2', 0).attr('y1', 0).attr('y2', 1);
            grad.append('stop').attr('offset', '0%').attr('stop-color', PALETA[0]).attr('stop-opacity', 0.5);
            grad.append('stop').attr('offset', '100%').attr('stop-color', PALETA[0]).attr('stop-opacity', 0);

            const area = d3.area()
              .x((_, i) => x(i))
              .y0(height)
              .y1((d) => y(d))
              .curve(d3.curveNatural);
            const line = d3.line()
              .x((_, i) => x(i))
              .y((d) => y(d))
              .curve(d3.curveNatural);

            const muted = getComputedStyle(document.documentElement).getPropertyValue('--muted-foreground').trim();
            g.append('g').attr('transform', `translate(0,${height})`)
              .call(d3.axisBottom(x).ticks(MESES.length).tickFormat((i) => MESES[i]).tickSize(0).tickPadding(10))
              .call((sel) => sel.selectAll('text').attr('fill', muted).attr('font-size', '11px'))
              .call((sel) => sel.selectAll('path').attr('stroke', 'rgba(120,120,120,0.2)'));
            g.append('g').call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat((d) => d / 1000 + 'K'))
              .call((sel) => sel.selectAll('text').attr('fill', muted).attr('font-size', '11px'))
              .call((sel) => sel.selectAll('line').attr('stroke', 'rgba(120,120,120,0.1)').attr('stroke-dasharray', '3 3'))
              .call((sel) => sel.selectAll('path').attr('stroke', 'transparent'));

            g.append('path').datum(usuariosActivos).attr('d', area).attr('fill', 'url(#grad-d3-1)');
            const path = g.append('path').datum(usuariosActivos).attr('d', line)
              .attr('fill', 'none').attr('stroke', PALETA[0]).attr('stroke-width', 3);

            // Animación de dibujo
            const len = path.node().getTotalLength();
            path.attr('stroke-dasharray', `${len} ${len}`).attr('stroke-dashoffset', len)
              .transition().duration(1500).attr('stroke-dashoffset', 0);

            // Puntos
            g.selectAll('circle').data(usuariosActivos).enter().append('circle')
              .attr('cx', (_, i) => x(i)).attr('cy', (d) => y(d))
              .attr('r', 0).attr('fill', PALETA[0]).attr('stroke', 'var(--background)').attr('stroke-width', 2)
              .transition().delay((_, i) => 1000 + i * 60).attr('r', 4);
          },
        }),
        codigo: `const line = d3.line()
  .x((_, i) => x(i))
  .y(d => y(d))
  .curve(d3.curveNatural);

const area = d3.area()
  .x((_, i) => x(i))
  .y0(height)
  .y1(d => y(d))
  .curve(d3.curveNatural);

g.append('path').datum(datos).attr('d', area).attr('fill', 'url(#grad)');
g.append('path').datum(datos).attr('d', line).attr('stroke', '#3b82f6');`,
      })],
    }),

    Seccion({
      titulo: '3 · Donut chart con d3.pie + d3.arc',
      descripcion: 'Layout `d3.pie()` calcula los ángulos; `d3.arc()` los convierte en SVG paths. Animación de entrada con interpolación de ángulos.',
      hijos: [VistaCodigo({
        vista: D3Chart({
          alto: '340px',
          render: ({ d3, svg, w, h }) => {
            const datos = [
              { etiqueta: 'Orgánico', valor: 42 },
              { etiqueta: 'Pago',     valor: 18 },
              { etiqueta: 'Referido', valor: 22 },
              { etiqueta: 'Email',    valor: 12 },
              { etiqueta: 'Social',   valor: 6 },
            ];
            const radio = Math.min(w, h) / 2 - 30;
            const g = svg.append('g').attr('transform', `translate(${w / 2},${h / 2})`);

            const pie = d3.pie().value((d) => d.valor).sort(null).padAngle(0.018);
            const arc = d3.arc().innerRadius(radio * 0.62).outerRadius(radio).cornerRadius(6);

            const arcs = g.selectAll('path').data(pie(datos)).enter().append('path')
              .attr('fill', (_, i) => PALETA[i])
              .attr('stroke', 'var(--background)')
              .attr('stroke-width', 2)
              .each(function (d) { this._actual = { startAngle: 0, endAngle: 0 }; })
              .transition().duration(900)
              .attrTween('d', function (d) {
                const i = d3.interpolate(this._actual, d);
                this._actual = i(1);
                return (t) => arc(i(t));
              });

            // Total al centro
            const total = d3.sum(datos, (d) => d.valor);
            g.append('text').attr('text-anchor', 'middle').attr('dy', '-0.2em')
              .attr('font-size', '34px').attr('font-weight', 800)
              .attr('fill', 'currentColor')
              .text(total + '%');
            g.append('text').attr('text-anchor', 'middle').attr('dy', '1.4em')
              .attr('font-size', '11px').attr('fill', 'currentColor').attr('opacity', 0.6)
              .text('TOTAL CANALES');
          },
        }),
        codigo: `const pie = d3.pie().value(d => d.valor).padAngle(0.02);
const arc = d3.arc()
  .innerRadius(radio * 0.62)        // donut
  .outerRadius(radio)
  .cornerRadius(6);                  // bordes redondeados

g.selectAll('path').data(pie(datos)).enter().append('path')
  .attr('d', arc)
  .attr('fill', (_, i) => PALETA[i]);`,
      })],
    }),

    Seccion({
      titulo: '4 · Force-directed graph (red de relaciones)',
      descripcion: 'Una de las cosas que sólo D3 hace bien: simulación de fuerzas con `d3.forceSimulation()`. Útil para mapas de relaciones, dependency graphs, redes sociales.',
      hijos: [VistaCodigo({
        vista: D3Chart({
          alto: '380px',
          render: ({ d3, svg, w, h }) => {
            const nodes = [
              { id: 'core',      grupo: 0, r: 28 },
              { id: 'auth',      grupo: 1, r: 20 },
              { id: 'db',        grupo: 1, r: 20 },
              { id: 'api',       grupo: 1, r: 20 },
              { id: 'cache',     grupo: 1, r: 16 },
              { id: 'queue',     grupo: 1, r: 16 },
              { id: 'frontend',  grupo: 2, r: 22 },
              { id: 'mobile',    grupo: 2, r: 22 },
              { id: 'analytics', grupo: 3, r: 18 },
              { id: 'logs',      grupo: 3, r: 16 },
              { id: 'cdn',       grupo: 4, r: 18 },
              { id: 'storage',   grupo: 4, r: 18 },
            ];
            const links = [
              { source: 'core', target: 'auth' }, { source: 'core', target: 'db' },
              { source: 'core', target: 'api' }, { source: 'core', target: 'cache' },
              { source: 'core', target: 'queue' }, { source: 'core', target: 'analytics' },
              { source: 'frontend', target: 'api' }, { source: 'frontend', target: 'cdn' },
              { source: 'mobile', target: 'api' }, { source: 'mobile', target: 'storage' },
              { source: 'analytics', target: 'logs' }, { source: 'api', target: 'cache' },
              { source: 'api', target: 'queue' }, { source: 'cdn', target: 'storage' },
            ];

            const sim = d3.forceSimulation(nodes)
              .force('link', d3.forceLink(links).id((d) => d.id).distance(70))
              .force('charge', d3.forceManyBody().strength(-260))
              .force('center', d3.forceCenter(w / 2, h / 2))
              .force('collide', d3.forceCollide().radius((d) => d.r + 6));

            const link = svg.append('g').attr('stroke', 'rgba(120,120,120,0.4)').attr('stroke-width', 1.5)
              .selectAll('line').data(links).enter().append('line');

            const node = svg.append('g').selectAll('g').data(nodes).enter().append('g').attr('cursor', 'grab');
            node.append('circle')
              .attr('r', (d) => d.r)
              .attr('fill', (d) => PALETA[d.grupo])
              .attr('stroke', 'var(--background)').attr('stroke-width', 2);
            node.append('text').text((d) => d.id)
              .attr('text-anchor', 'middle').attr('dy', '0.32em')
              .attr('font-size', '10px').attr('font-weight', 700)
              .attr('fill', '#fff').attr('pointer-events', 'none');

            node.call(d3.drag()
              .on('start', (e, d) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
              .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y; })
              .on('end', (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; }));

            sim.on('tick', () => {
              link.attr('x1', (d) => d.source.x).attr('y1', (d) => d.source.y)
                  .attr('x2', (d) => d.target.x).attr('y2', (d) => d.target.y);
              node.attr('transform', (d) => `translate(${d.x},${d.y})`);
            });
          },
        }),
        codigo: `const sim = d3.forceSimulation(nodes)
  .force('link', d3.forceLink(links).id(d => d.id).distance(70))
  .force('charge', d3.forceManyBody().strength(-260))
  .force('center', d3.forceCenter(w / 2, h / 2))
  .force('collide', d3.forceCollide().radius(d => d.r + 6));

sim.on('tick', () => {
  link.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
  node.attr('transform', d => \`translate(\${d.x},\${d.y})\`);
});

// Drag & drop interactivo
node.call(d3.drag().on('drag', ...));`,
      })],
    }),

    Seccion({
      titulo: '5 · Treemap — visualización de jerarquías',
      descripcion: '`d3.treemap()` particiona un rectángulo según los valores. Para mostrar tamaños relativos en datos jerárquicos: filesystem, presupuestos, market caps.',
      hijos: [VistaCodigo({
        vista: D3Chart({
          alto: '380px',
          render: ({ d3, svg, w, h }) => {
            const datos = {
              name: 'root',
              children: [
                { name: 'Frontend',   value: 38, hijos: [
                  { name: 'React',     value: 18 }, { name: 'Vue', value: 8 }, { name: 'Svelte', value: 6 }, { name: 'Angular', value: 6 },
                ]},
                { name: 'Backend',    value: 32, hijos: [
                  { name: 'Node',      value: 14 }, { name: 'Python', value: 10 }, { name: 'Go', value: 5 }, { name: 'Rust', value: 3 },
                ]},
                { name: 'Database',   value: 18, hijos: [
                  { name: 'PostgreSQL', value: 9 }, { name: 'MongoDB', value: 5 }, { name: 'Redis', value: 4 },
                ]},
                { name: 'Otros',      value: 12, hijos: [
                  { name: 'DevOps',    value: 6 }, { name: 'Security', value: 4 }, { name: 'Mobile', value: 2 },
                ]},
              ],
            };
            const flat = [];
            datos.children.forEach((c, i) => c.hijos.forEach((h) => flat.push({ ...h, padre: c.name, color: PALETA[i] })));

            const root = d3.hierarchy({ name: 'root', children: flat }).sum((d) => d.value).sort((a, b) => b.value - a.value);
            d3.treemap().size([w, h]).padding(3).round(true)(root);

            const cell = svg.selectAll('g').data(root.leaves()).enter().append('g')
              .attr('transform', (d) => `translate(${d.x0},${d.y0})`);
            cell.append('rect')
              .attr('width', (d) => d.x1 - d.x0)
              .attr('height', (d) => d.y1 - d.y0)
              .attr('fill', (d) => d.data.color || PALETA[0])
              .attr('rx', 6);
            cell.append('text').attr('x', 10).attr('y', 22)
              .attr('font-size', (d) => Math.min(14, (d.x1 - d.x0) / 5))
              .attr('font-weight', 700)
              .attr('fill', '#fff')
              .text((d) => d.data.name);
            cell.append('text').attr('x', 10).attr('y', 38)
              .attr('font-size', '11px').attr('fill', 'rgba(255,255,255,0.85)')
              .text((d) => d.data.value + '%');
          },
        }),
        codigo: `const root = d3.hierarchy(datos).sum(d => d.value).sort((a,b) => b.value - a.value);
d3.treemap().size([w, h]).padding(3).round(true)(root);

svg.selectAll('g').data(root.leaves()).enter().append('g')
  .attr('transform', d => \`translate(\${d.x0},\${d.y0})\`)
  .append('rect')
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => d.y1 - d.y0)
    .attr('fill', d => d.data.color);`,
      })],
    }),

    Seccion({
      titulo: '6 · Radial bar — métrica circular',
      descripcion: 'Barras dibujadas como anillos concéntricos. `d3.arc()` con startAngle/endAngle dinámicos. Look "Apple Health" / "GitHub contributions".',
      hijos: [VistaCodigo({
        vista: D3Chart({
          alto: '380px',
          render: ({ d3, svg, w, h }) => {
            const datos = [
              { etiqueta: 'Apertura',        valor: 78, max: 100 },
              { etiqueta: 'Click-through',   valor: 42, max: 100 },
              { etiqueta: 'Conversión',      valor: 18, max: 100 },
              { etiqueta: 'Retención',       valor: 65, max: 100 },
              { etiqueta: 'Engagement',      valor: 88, max: 100 },
            ];
            const r = Math.min(w, h) / 2 - 20;
            const g = svg.append('g').attr('transform', `translate(${w / 2},${h / 2})`);

            const escalaRadial = d3.scaleLinear().domain([0, 100]).range([0, Math.PI * 1.6]);
            const grosor = (r * 0.7) / datos.length;

            datos.forEach((d, i) => {
              const innerR = r - (i + 1) * grosor;
              const outerR = innerR + grosor * 0.78;

              // Track (fondo)
              g.append('path').attr('d', d3.arc()({
                innerRadius: innerR, outerRadius: outerR,
                startAngle: -Math.PI * 0.8, endAngle: Math.PI * 0.8,
              })).attr('fill', 'rgba(120,120,120,0.12)');

              // Valor
              g.append('path').attr('d', d3.arc().cornerRadius(grosor / 2)({
                innerRadius: innerR, outerRadius: outerR,
                startAngle: -Math.PI * 0.8,
                endAngle: -Math.PI * 0.8 + escalaRadial(d.valor),
              })).attr('fill', PALETA[i]);

              // Label
              g.append('text').attr('x', -(r * 0.95)).attr('y', -((i + 0.5) * grosor) + grosor / 2 + 4)
                .attr('font-size', '11px').attr('font-weight', 700).attr('fill', 'currentColor')
                .text(`${d.etiqueta} · ${d.valor}%`);
            });
          },
        }),
        codigo: `// Radial bar = arcos con cornerRadius redondeado
const escalaRadial = d3.scaleLinear().domain([0, 100]).range([0, Math.PI * 1.6]);

datos.forEach((d, i) => {
  g.append('path').attr('d', d3.arc().cornerRadius(grosor/2)({
    innerRadius: innerR, outerRadius: outerR,
    startAngle: -Math.PI * 0.8,
    endAngle: -Math.PI * 0.8 + escalaRadial(d.valor),
  })).attr('fill', PALETA[i]);
});`,
      })],
    }),

    Seccion({
      titulo: '7 · Stream graph — flujo temporal',
      descripcion: 'Variante del area stacked donde la base es móvil. Útil para visualizar evolución de categorías a lo largo del tiempo (música escuchada, tendencias web).',
      hijos: [VistaCodigo({
        vista: D3Chart({
          alto: '320px',
          render: ({ d3, svg, w, h }) => {
            const datos = MESES.map((m, i) => ({
              mes: i,
              Pop:        50 + Math.sin(i * 0.4) * 30 + Math.random() * 12,
              Rock:       30 + Math.cos(i * 0.5) * 18 + Math.random() * 10,
              Hip_Hop:    40 + Math.sin(i * 0.3 + 1) * 25 + Math.random() * 14,
              Electronic: 22 + Math.cos(i * 0.4 + 0.5) * 15 + Math.random() * 8,
              Jazz:       18 + Math.sin(i * 0.6 + 2) * 8 + Math.random() * 6,
            }));
            const claves = ['Pop', 'Rock', 'Hip_Hop', 'Electronic', 'Jazz'];

            const margin = { top: 20, right: 20, bottom: 36, left: 20 };
            const width = w - margin.left - margin.right;
            const height = h - margin.top - margin.bottom;
            const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

            const x = d3.scaleLinear().domain([0, MESES.length - 1]).range([0, width]);
            const stack = d3.stack().keys(claves).offset(d3.stackOffsetWiggle).order(d3.stackOrderInsideOut);
            const series = stack(datos);

            const yMax = d3.max(series, (s) => d3.max(s, (d) => d[1]));
            const yMin = d3.min(series, (s) => d3.min(s, (d) => d[0]));
            const y = d3.scaleLinear().domain([yMin, yMax]).range([height, 0]);

            const area = d3.area()
              .x((d) => x(d.data.mes))
              .y0((d) => y(d[0]))
              .y1((d) => y(d[1]))
              .curve(d3.curveBasis);

            g.selectAll('path').data(series).enter().append('path')
              .attr('d', area)
              .attr('fill', (_, i) => PALETA[i])
              .attr('opacity', 0.85);

            g.append('g').attr('transform', `translate(0,${height + 10})`)
              .selectAll('text').data(MESES).enter().append('text')
              .attr('x', (_, i) => x(i)).attr('text-anchor', 'middle')
              .attr('font-size', '10px').attr('fill', 'currentColor').attr('opacity', 0.6)
              .text((m) => m);
          },
        }),
        codigo: `// Stack offset wiggle = flujo "stream"
const stack = d3.stack()
  .keys(claves)
  .offset(d3.stackOffsetWiggle)         // ← lo que hace el efecto stream
  .order(d3.stackOrderInsideOut);

const area = d3.area()
  .x(d => x(d.data.mes))
  .y0(d => y(d[0]))
  .y1(d => y(d[1]))
  .curve(d3.curveBasis);`,
      })],
    }),

  ],
});
