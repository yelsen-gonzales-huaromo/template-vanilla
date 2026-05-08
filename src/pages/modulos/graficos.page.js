// Página showcase de gráficos disponibles en la plantilla.
import { crearEl } from '../../utils/helpers/dom.js';
import { TituloPagina } from '../../components/common/page-title/page-title.js';
import { Tarjeta } from '../../components/ui/card/card.js';
import {
  GraficoLineas,
  GraficoBarras,
  GraficoDonut,
  GraficoSparkline,
  GraficoProgreso,
} from '../../components/ui/chart/chart.js';
import { serie } from '../../utils/helpers/demo-data.js';

// Construye una sección dentro de una Tarjeta con título y contenido.
const seccionTarjeta = (titulo, descripcion, contenido) =>
  Tarjeta({
    titulo,
    descripcion,
    cuerpo: contenido,
  });

// Subsección "Líneas".
const seccionLineas = () => {
  const grafico = GraficoLineas({
    datos: serie(20),
    ancho: 600,
    alto: 200,
  });
  return seccionTarjeta(
    'Líneas',
    'Tendencia continua sobre un eje temporal.',
    crearEl('div', { style: { overflowX: 'auto' } }, [grafico]),
  );
};

// Subsección "Barras".
const seccionBarras = () => {
  const valores = [42, 67, 33, 89, 51, 73, 28];
  const etiquetas = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'];
  const grafico = GraficoBarras({
    valores,
    etiquetas,
    ancho: 600,
    alto: 220,
  });
  return seccionTarjeta(
    'Barras',
    'Comparación de valores discretos por categoría.',
    crearEl('div', { style: { overflowX: 'auto' } }, [grafico]),
  );
};

// Subsección "Donut" con 3 donut alineados en fila.
const seccionDonut = () => {
  const fila = crearEl(
    'div',
    {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 'var(--space-6)',
        justifyItems: 'center',
        alignItems: 'center',
      },
    },
    [25, 60, 88].map((valor) =>
      crearEl(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-2)',
          },
        },
        [
          GraficoDonut({ valor, total: 100, tamano: 140 }),
          crearEl(
            'span',
            { className: 'text-sm text-muted' },
            [`${valor}% completado`],
          ),
        ],
      ),
    ),
  );

  return seccionTarjeta(
    'Donut',
    'Indicador circular de progreso o composición.',
    fila,
  );
};

// Subsección "Progreso" con 4 barras horizontales.
const seccionProgreso = () => {
  const items = [
    { etiqueta: 'Ventas', valor: 40 },
    { etiqueta: 'Marketing', valor: 65 },
    { etiqueta: 'Soporte', valor: 82 },
    { etiqueta: 'Desarrollo', valor: 95 },
  ];

  const lista = crearEl(
    'div',
    {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
      },
    },
    items.map((item) =>
      crearEl(
        'div',
        {
          style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' },
        },
        [
          crearEl(
            'div',
            {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 'var(--text-sm)',
              },
            },
            [
              crearEl('span', null, [item.etiqueta]),
              crearEl('span', { className: 'text-muted' }, [`${item.valor}%`]),
            ],
          ),
          GraficoProgreso({ valor: item.valor, total: 100 }),
        ],
      ),
    ),
  );

  return seccionTarjeta(
    'Progreso',
    'Barras lineales horizontales para indicar avance.',
    lista,
  );
};

// Subsección "Sparklines" con 6 sparklines pequeños.
const seccionSparklines = () => {
  const fila = crearEl(
    'div',
    {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: 'var(--space-4)',
      },
    },
    Array.from({ length: 6 }).map(() =>
      crearEl(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-1)',
            alignItems: 'center',
          },
        },
        [
          GraficoSparkline({ datos: serie(10), ancho: 100, alto: 32 }),
          crearEl('span', { className: 'text-xs text-muted' }, ['Tendencia']),
        ],
      ),
    ),
  );

  return seccionTarjeta(
    'Sparklines',
    'Mini gráficos en línea, ideales para tarjetas KPI.',
    fila,
  );
};

export default async () => {
  const contenedor = crearEl('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-6)',
    },
  });

  contenedor.appendChild(
    TituloPagina({
      titulo: 'Gráficos',
      descripcion: 'Catálogo de visualizaciones nativas SVG.',
    }),
  );

  // Filas en grid 2 columnas para las primeras visualizaciones.
  const filaSuperior = crearEl(
    'div',
    {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--space-6)',
      },
    },
    [seccionLineas(), seccionBarras()],
  );
  contenedor.appendChild(filaSuperior);

  contenedor.appendChild(seccionDonut());

  const filaInferior = crearEl(
    'div',
    {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--space-6)',
      },
    },
    [seccionProgreso(), seccionSparklines()],
  );
  contenedor.appendChild(filaInferior);

  return contenedor;
};
