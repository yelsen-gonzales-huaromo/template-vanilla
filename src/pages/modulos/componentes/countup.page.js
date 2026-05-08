import { crearEl } from '../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { Contador } from '../../../components/ui/countup/countup.js';
import { GraficoLineas } from '../../../components/ui/chart/chart.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { formatearNumero, formatearMoneda, formatearBytes } from '../../../utils/formatters/number.js';
import { corner4 } from '../../../components/ui/card/card-decoraciones.js';

// ============================================================================
//  Helpers locales
// ============================================================================
const fila = (...n) => crearEl('div', {
  style: { display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', width: '100%' },
}, n);

const iconoCircular = (nombre, color = 'primary', tamano = 18) => crearEl('span', {
  class: ['contador-icono', `contador-icono--${color}`],
}, [Icono(nombre, { tamano })]);

const delta = (valor, dir = 'up') => crearEl('span', {
  class: ['contador-delta', `contador-delta--${dir}`],
}, [
  dir === 'up'   ? '↑' : dir === 'down' ? '↓' : '—',
  ' ', valor,
]);

// ----- Tarjeta KPI básica con valor + título + sub -----
const tarjetaKpi = ({ titulo, contador, sub, deltaNodo, color = 'primary', icono }) => crearEl('div', {
  class: 'contador-tarjeta',
}, [
  crearEl('div', { class: 'contador-tarjeta__top' }, [
    crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0, flex: 1 } }, [
      crearEl('p', { class: 'contador-tarjeta__titulo' }, [titulo]),
      crearEl('strong', {
        class: 'contador-tarjeta__valor',
        style: { color: `var(--${color === 'primary' ? 'primary' : `color-${color}`})` },
      }, [contador]),
    ]),
    icono && iconoCircular(icono, color),
  ]),
  deltaNodo,
  sub && crearEl('p', { class: 'contador-tarjeta__sub' }, [sub]),
]);

// ----- Strip de stats con divisores -----
const stripCelda = (titulo, contador, sub, color = 'foreground') => crearEl('div', {
  class: 'contador-strip__celda',
}, [
  crearEl('p', { class: 'contador-tarjeta__titulo' }, [titulo]),
  crearEl('strong', {
    class: 'contador-tarjeta__valor',
    style: { color: color === 'foreground' ? 'var(--foreground)' : `var(--${color})` },
  }, [contador]),
  sub && crearEl('p', { class: 'contador-tarjeta__sub' }, [sub]),
]);

// ----- Hero stat (estilo landing "4968 New Learners") -----
const heroStat = ({ icono, color, contador, label, sub }) => crearEl('div', {
  class: 'contador-hero-stats__celda',
}, [
  crearEl('div', {
    class: 'contador-hero-stats__icono',
    style: { background: `color-mix(in srgb, var(--color-${color}) 14%, transparent)`, color: `var(--color-${color})` },
  }, [Icono(icono, { tamano: 24 })]),
  crearEl('span', { class: 'contador-hero-stats__valor' }, [contador]),
  crearEl('span', { class: 'contador-hero-stats__label' }, [label]),
  sub && crearEl('span', { class: 'contador-hero-stats__sub' }, [sub]),
]);

// ----- Barra de progreso animada que se llena con el contador -----
const barraProgresoAnim = (porcentaje, color = 'var(--primary)') => {
  const fill = crearEl('div', { class: 'contador-progreso-barra__fill',
    style: { width: '0%', background: color } });
  // Disparamos la animación cuando el elemento entra al viewport
  const barra = crearEl('div', { class: 'contador-progreso-barra' }, [fill]);
  const io = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting) {
      requestAnimationFrame(() => { fill.style.width = `${porcentaje}%`; });
      io.disconnect();
    }
  });
  requestAnimationFrame(() => io.observe(barra));
  return barra;
};

// ============================================================================
//  Página
// ============================================================================
export default async () => PaginaShowcase({
  titulo: 'Contador animado',
  descripcion: 'Anima de `desde` a `hasta` cuando el elemento entra al viewport (IntersectionObserver). Easing ease-out cubic. Soporta prefijo, sufijo, decimales y formato custom — números enteros, monedas, porcentajes, bytes y duraciones. Sólo arranca una vez.',
  decoracion: corner4(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    // ============== 1. TIPOS BÁSICOS ==============
    Seccion({
      titulo: 'Tipos de número',
      descripcion: 'Enteros, decimales, monedas, porcentajes, abreviaciones (K/M) y bytes. El `formato` recibe el valor actual y retorna el string a mostrar.',
      hijos: [VistaCodigo({
        vista: fila(
          tarjetaKpi({ titulo: 'Entero', contador: Contador({ hasta: 12480, formato: formatearNumero }), color: 'primary' }),
          tarjetaKpi({ titulo: 'Decimal', contador: Contador({ hasta: 4.78, duracion: 1800, formato: (n) => n.toFixed(2), sufijo: '%' }), color: 'info' }),
          tarjetaKpi({ titulo: 'Moneda', contador: Contador({ hasta: 89234, formato: formatearMoneda }), color: 'success' }),
          tarjetaKpi({ titulo: 'Abreviado', contador: Contador({ hasta: 82.18, duracion: 2000, formato: (n) => n.toFixed(2), prefijo: '$', sufijo: 'M' }), color: 'warning' }),
          tarjetaKpi({ titulo: 'Bytes', contador: Contador({ hasta: 1775060000, duracion: 1800, formato: (n) => formatearBytes(n) }), color: 'danger' }),
        ),
        codigo: `// Entero
Contador({ hasta: 12480, formato: formatearNumero })

// Decimal con sufijo
Contador({ hasta: 4.78, formato: n => n.toFixed(2), sufijo: '%' })

// Moneda
Contador({ hasta: 89234, formato: formatearMoneda })

// Abreviado
Contador({ hasta: 82.18, formato: n => n.toFixed(2), prefijo: '$', sufijo: 'M' })

// Bytes
Contador({ hasta: 1775060000, formato: formatearBytes })`,
      })],
    }),

    // ============== 2. KPI CON DELTA (vs período anterior) ==============
    Seccion({
      titulo: 'KPIs con delta (vs mes anterior)',
      descripcion: 'Patrón clásico de dashboard: número actual + badge con la variación porcentual respecto al período anterior. Verde para subida, rojo para bajada.',
      hijos: [VistaCodigo({
        vista: fila(
          tarjetaKpi({
            titulo: 'Clientes', icono: 'clientes', color: 'warning',
            contador: Contador({ hasta: 58.386, duracion: 1600, formato: (n) => n.toFixed(2), sufijo: 'k' }),
            deltaNodo: delta('0.23%', 'down'),
            sub: 'vs 58.521 mes anterior',
          }),
          tarjetaKpi({
            titulo: 'Pedidos', icono: 'pedidos', color: 'info',
            contador: Contador({ hasta: 23.434, duracion: 1600, formato: (n) => n.toFixed(2), sufijo: 'k' }),
            deltaNodo: delta('0.0%', 'flat'),
            sub: 'vs 23.421 mes anterior',
          }),
          tarjetaKpi({
            titulo: 'Ingresos', icono: 'precios', color: 'success',
            contador: Contador({ hasta: 43594, duracion: 1600, prefijo: '$', formato: formatearNumero }),
            deltaNodo: delta('9.54%', 'up'),
            sub: 'vs $39.795 mes anterior',
          }),
          tarjetaKpi({
            titulo: 'Conversión', icono: 'analitica', color: 'primary',
            contador: Contador({ hasta: 28.5, duracion: 1600, formato: (n) => n.toFixed(2), sufijo: '%' }),
            deltaNodo: delta('29.4%', 'up'),
            sub: 'vs 22.0% mes anterior',
          }),
        ),
        codigo: `tarjetaKpi({
  titulo: 'Ingresos', icono: 'precios', color: 'success',
  contador: Contador({ hasta: 43594, prefijo: '$', formato: formatearNumero }),
  deltaNodo: delta('9.54%', 'up'),         // 'up' | 'down' | 'flat'
  sub: 'vs $39.795 mes anterior',
})`,
      })],
    }),

    // ============== 3. KPI CON SPARKLINE ==============
    Seccion({
      titulo: 'KPIs con mini-gráfico (sparkline)',
      descripcion: 'Número grande + sparkline SVG con la tendencia reciente. El gráfico contextualiza el número y se ve elegante en grids de dashboards.',
      hijos: [VistaCodigo({
        vista: fila(
          crearEl('div', { class: 'contador-tarjeta' }, [
            crearEl('div', { class: 'contador-tarjeta__top' }, [
              crearEl('p', { class: 'contador-tarjeta__titulo' }, ['Ventas semanales']),
              delta('3.5%', 'up'),
            ]),
            crearEl('strong', { class: 'contador-tarjeta__valor' }, [
              Contador({ hasta: 47, prefijo: '$', sufijo: 'K', formato: (n) => Math.round(n).toString() }),
            ]),
            GraficoLineas({ datos: [12, 18, 15, 22, 28, 32, 47], ancho: 280, alto: 56, color: 'var(--color-success)' }),
          ]),
          crearEl('div', { class: 'contador-tarjeta' }, [
            crearEl('div', { class: 'contador-tarjeta__top' }, [
              crearEl('p', { class: 'contador-tarjeta__titulo' }, ['Total pedidos']),
              delta('13.6%', 'up'),
            ]),
            crearEl('strong', { class: 'contador-tarjeta__valor' }, [
              Contador({ hasta: 58.4, formato: (n) => n.toFixed(1), sufijo: 'K' }),
            ]),
            GraficoLineas({ datos: [20, 35, 42, 100, 120], ancho: 280, alto: 56, color: 'var(--primary)' }),
          ]),
          crearEl('div', { class: 'contador-tarjeta' }, [
            crearEl('div', { class: 'contador-tarjeta__top' }, [
              crearEl('p', { class: 'contador-tarjeta__titulo' }, ['Usuarios activos']),
              delta('8.2%', 'up'),
            ]),
            crearEl('strong', { class: 'contador-tarjeta__valor' }, [
              Contador({ hasta: 765, sufijo: 'k', formato: formatearNumero }),
            ]),
            GraficoLineas({ datos: [3, 7, 6, 8, 5, 12, 11], ancho: 280, alto: 56, color: 'var(--color-info)' }),
          ]),
        ),
        codigo: `crearEl('div', { class: 'contador-tarjeta' }, [
  crearEl('p', { class: 'contador-tarjeta__titulo' }, ['Ventas semanales']),
  Contador({ hasta: 47, prefijo: '$', sufijo: 'K' }),
  GraficoLineas({
    datos: [12, 18, 15, 22, 28, 32, 47],
    ancho: 280, alto: 56,
    color: 'var(--color-success)',
  }),
])`,
      })],
    }),

    // ============== 4. KPI CON PROGRESO A META ==============
    Seccion({
      titulo: 'KPIs con progreso hacia una meta',
      descripcion: 'Número grande + barra de progreso que se llena hacia el objetivo. Útil para metas de ventas, almacenamiento usado, suscripciones activas vs límite.',
      hijos: [VistaCodigo({
        vista: fila(
          crearEl('div', { class: 'contador-tarjeta' }, [
            crearEl('div', { class: 'contador-tarjeta__top' }, [
              crearEl('p', { class: 'contador-tarjeta__titulo' }, ['Meta mensual']),
              crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, ['$80.000']),
            ]),
            crearEl('strong', { class: 'contador-tarjeta__valor' }, [
              Contador({ hasta: 64320, prefijo: '$', formato: formatearNumero }),
            ]),
            barraProgresoAnim(80.4, 'var(--primary)'),
            crearEl('p', { class: 'contador-tarjeta__sub' }, [
              Contador({ hasta: 80.4, formato: (n) => n.toFixed(1) }),
              '% del objetivo',
            ]),
          ]),
          crearEl('div', { class: 'contador-tarjeta' }, [
            crearEl('div', { class: 'contador-tarjeta__top' }, [
              crearEl('p', { class: 'contador-tarjeta__titulo' }, ['Almacenamiento']),
              crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, ['2 GB']),
            ]),
            crearEl('strong', { class: 'contador-tarjeta__valor' }, [
              Contador({ hasta: 1775.06, duracion: 1800, formato: (n) => n.toFixed(2), sufijo: ' MB' }),
            ]),
            barraProgresoAnim(86.7, 'var(--color-warning)'),
            crearEl('p', { class: 'contador-tarjeta__sub' }, ['Quedan 224 MB libres']),
          ]),
          crearEl('div', { class: 'contador-tarjeta' }, [
            crearEl('div', { class: 'contador-tarjeta__top' }, [
              crearEl('p', { class: 'contador-tarjeta__titulo' }, ['Suscripciones']),
              crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, ['1.000 plan Pro']),
            ]),
            crearEl('strong', { class: 'contador-tarjeta__valor' }, [
              Contador({ hasta: 423, formato: formatearNumero }),
            ]),
            barraProgresoAnim(42.3, 'var(--color-success)'),
            crearEl('p', { class: 'contador-tarjeta__sub' }, ['42% del cupo asignado']),
          ]),
        ),
        codigo: `// Barra animada que se sincroniza con el contador
crearEl('div', { class: 'contador-tarjeta' }, [
  Contador({ hasta: 64320, prefijo: '$', formato: formatearNumero }),
  barraProgresoAnim(80.4, 'var(--primary)'),
  crearEl('p', null, [
    Contador({ hasta: 80.4, formato: n => n.toFixed(1) }),
    '% del objetivo',
  ]),
])`,
      })],
    }),

    // ============== 5. STRIP DE STATS DIVIDIDOS ==============
    Seccion({
      titulo: 'Strip de estadísticas (Falcon-style)',
      descripcion: 'Grid de 6 stats divididos por borders — patrón muy común en dashboards de e-commerce. Cada celda muestra título, valor y comparación.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { class: 'contador-strip' }, [
          stripCelda('Pedidos',
            Contador({ hasta: 15450, formato: formatearNumero }),
            crearEl('span', null, ['13.675 ', delta('21.8%', 'up')]),
          ),
          stripCelda('Items vendidos',
            Contador({ hasta: 1054, formato: formatearNumero }),
            crearEl('span', null, ['892 ', delta('18.2%', 'up')]),
            'color-warning',
          ),
          stripCelda('Reembolsos',
            Contador({ hasta: 145.65, formato: (n) => n.toFixed(2), prefijo: '$' }),
            crearEl('span', null, ['$132.40 ', delta('9.9%', 'up')]),
            'color-success',
          ),
          stripCelda('Venta bruta',
            Contador({ hasta: 100.26, formato: (n) => n.toFixed(2), prefijo: '$' }),
            crearEl('span', null, ['$109.65 ', delta('8.6%', 'down')]),
            'color-danger',
          ),
          stripCelda('Envíos',
            Contador({ hasta: 365.53, formato: (n) => n.toFixed(2), prefijo: '$' }),
            crearEl('span', null, ['$300.20 ', delta('21.8%', 'up')]),
            'color-success',
          ),
          stripCelda('En proceso',
            Contador({ hasta: 861, formato: formatearNumero }),
            crearEl('span', null, ['724 ', delta('18.9%', 'up')]),
            'color-info',
          ),
        ]),
        codigo: `crearEl('div', { class: 'contador-strip' }, [
  stripCelda('Pedidos',
    Contador({ hasta: 15450, formato: formatearNumero }),
    crearEl('span', null, ['13.675 ', delta('21.8%', 'up')]),
  ),
  stripCelda('Items vendidos',
    Contador({ hasta: 1054 }),
    crearEl('span', null, ['892 ', delta('18.2%', 'up')]),
  ),
  // ... 4 más
])`,
      })],
    }),

    // ============== 6. HERO STATS LANDING ==============
    Seccion({
      titulo: 'Hero stats (landing page)',
      descripcion: 'Bloque de 4 estadísticas destacadas para landings — ej. "4968 New Learners". Cada una con icono circular + número grande + label + comparación. Patrón usado por Coursera, Udemy, edX.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { class: 'contador-hero-stats' }, [
          heroStat({
            icono: 'estudiante', color: 'primary',
            contador: Contador({ hasta: 4968, formato: formatearNumero }),
            label: 'Nuevos estudiantes', sub: '4.203 el mes anterior',
          }),
          heroStat({
            icono: 'cursos', color: 'info',
            contador: Contador({ hasta: 324, formato: formatearNumero }),
            label: 'Nuevos instructores', sub: '301 el mes anterior',
          }),
          heroStat({
            icono: 'lms', color: 'success',
            contador: Contador({ hasta: 3712, formato: formatearNumero }),
            label: 'Cursos publicados', sub: '2.779 el mes anterior',
          }),
          heroStat({
            icono: 'precios', color: 'warning',
            contador: Contador({ hasta: 1054, formato: formatearNumero }),
            label: 'Reembolsos', sub: '1.201 el mes anterior',
          }),
        ]),
        codigo: `crearEl('div', { class: 'contador-hero-stats' }, [
  heroStat({
    icono: 'estudiante', color: 'primary',
    contador: Contador({ hasta: 4968 }),
    label: 'Nuevos estudiantes',
    sub: '4.203 el mes anterior',
  }),
  // ... 3 más con icono + color distintos
])`,
      })],
    }),

    // ============== 7. LIVE COUNTER (USUARIOS EN TIEMPO REAL) ==============
    Seccion({
      titulo: 'Live counter — usuarios activos',
      descripcion: 'Número grande sobre fondo gradient con dot pulsante rojo. Para "users online ahora", "pedidos en vivo", "viewers en streaming". Inspirado en analytics dashboards.',
      hijos: [VistaCodigo({
        vista: fila(
          crearEl('div', { class: 'contador-live', style: { flex: 1, minWidth: '280px' } }, [
            crearEl('span', { class: 'contador-live__hint' }, [
              crearEl('span', { class: 'contador-live__dot', 'aria-hidden': 'true' }),
              'En vivo · usuarios activos',
            ]),
            crearEl('span', { class: 'contador-live__valor' }, [
              Contador({ hasta: 1247, duracion: 2200, formato: formatearNumero }),
            ]),
            crearEl('p', { style: { margin: 0, fontSize: 'var(--text-xs)', opacity: 0.85 } },
              ['Picos en hora punta: 2.890']),
          ]),
          crearEl('div', {
            class: 'contador-live',
            style: {
              flex: 1, minWidth: '280px',
              background: 'linear-gradient(135deg, var(--color-success), color-mix(in srgb, var(--color-success) 60%, #000))',
            },
          }, [
            crearEl('span', { class: 'contador-live__hint' }, [
              crearEl('span', { class: 'contador-live__dot', 'aria-hidden': 'true' }),
              'En vivo · pedidos hoy',
            ]),
            crearEl('span', { class: 'contador-live__valor' }, [
              Contador({ hasta: 8423, duracion: 2200, formato: formatearNumero }),
            ]),
            crearEl('p', { style: { margin: 0, fontSize: 'var(--text-xs)', opacity: 0.85 } },
              ['Promedio diario: 7.150']),
          ]),
        ),
        codigo: `crearEl('div', { class: 'contador-live' }, [
  crearEl('span', { class: 'contador-live__hint' }, [
    crearEl('span', { class: 'contador-live__dot' }),  // pulso rojo animado
    'En vivo · usuarios activos',
  ]),
  crearEl('span', { class: 'contador-live__valor' }, [
    Contador({ hasta: 1247, duracion: 2200, formato: formatearNumero }),
  ]),
])`,
      })],
    }),

    // ============== 8. COMPARATIVA ANTES / DESPUÉS ==============
    Seccion({
      titulo: 'Comparativa antes / después',
      descripcion: 'Muestra el valor anterior tachado + flecha + valor nuevo. Útil para casos de éxito, mejoras de performance, optimizaciones.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
          crearEl('div', { class: 'contador-comparativa' }, [
            crearEl('div', { class: 'contador-comparativa__bloque' }, [
              crearEl('p', { class: 'contador-tarjeta__titulo' }, ['Tiempo de carga (antes)']),
              crearEl('strong', { class: ['contador-tarjeta__valor', 'contador-comparativa__antes-valor'] }, [
                Contador({ hasta: 4.8, duracion: 1200, formato: (n) => n.toFixed(1), sufijo: ' s' }),
              ]),
            ]),
            crearEl('span', { class: 'contador-comparativa__flecha' }, ['→']),
            crearEl('div', { class: 'contador-comparativa__bloque' }, [
              crearEl('p', { class: 'contador-tarjeta__titulo' }, ['Tiempo de carga (ahora)']),
              crearEl('strong', {
                class: 'contador-tarjeta__valor',
                style: { color: 'var(--color-success)' },
              }, [
                Contador({ hasta: 0.9, duracion: 1800, formato: (n) => n.toFixed(1), sufijo: ' s' }),
              ]),
            ]),
            crearEl('div', { style: { textAlign: 'end', minWidth: '90px' } }, [
              delta('81.3%', 'up'),
              crearEl('p', { class: 'contador-tarjeta__sub', style: { marginBlockStart: '4px' } }, ['más rápido']),
            ]),
          ]),
          crearEl('div', { class: 'contador-comparativa' }, [
            crearEl('div', { class: 'contador-comparativa__bloque' }, [
              crearEl('p', { class: 'contador-tarjeta__titulo' }, ['Conversiones (Q1)']),
              crearEl('strong', { class: ['contador-tarjeta__valor', 'contador-comparativa__antes-valor'] }, [
                Contador({ hasta: 1840, duracion: 1200, formato: formatearNumero }),
              ]),
            ]),
            crearEl('span', { class: 'contador-comparativa__flecha' }, ['→']),
            crearEl('div', { class: 'contador-comparativa__bloque' }, [
              crearEl('p', { class: 'contador-tarjeta__titulo' }, ['Conversiones (Q2)']),
              crearEl('strong', {
                class: 'contador-tarjeta__valor',
                style: { color: 'var(--primary)' },
              }, [
                Contador({ hasta: 3275, duracion: 1800, formato: formatearNumero }),
              ]),
            ]),
            crearEl('div', { style: { textAlign: 'end', minWidth: '90px' } }, [
              delta('78.0%', 'up'),
              crearEl('p', { class: 'contador-tarjeta__sub', style: { marginBlockStart: '4px' } }, ['vs Q1']),
            ]),
          ]),
        ]),
        codigo: `crearEl('div', { class: 'contador-comparativa' }, [
  bloque('Antes', Contador({ hasta: 4.8, sufijo: ' s' }), { tachado: true }),
  '→',
  bloque('Ahora', Contador({ hasta: 0.9, sufijo: ' s' }), { color: 'success' }),
  delta('81.3%', 'up'),
])`,
      })],
    }),

    // ============== 9. CONTADORES SIMPLES INLINE (texto) ==============
    Seccion({
      titulo: 'Inline en texto (testimonios, copy)',
      descripcion: 'El contador es un `<span>` — funciona perfecto incrustado dentro de un párrafo o un titular sin estructura de tarjeta.',
      hijos: [VistaCodigo({
        vista: crearEl('div', {
          style: {
            padding: 'var(--space-5)', background: 'var(--surface)',
            border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
            textAlign: 'center', maxWidth: '720px', margin: '0 auto',
          },
        }, [
          crearEl('h2', { style: { margin: 0, fontSize: 'var(--text-2xl)', lineHeight: 1.4 } }, [
            'Más de ',
            crearEl('strong', { style: { color: 'var(--primary)' } }, [
              Contador({ hasta: 12500, duracion: 1800, formato: formatearNumero }),
            ]),
            ' equipos confían en nosotros para procesar ',
            crearEl('strong', { style: { color: 'var(--color-success)' } }, [
              Contador({ hasta: 4.2, duracion: 1800, formato: (n) => n.toFixed(1), prefijo: '$', sufijo: 'B' }),
            ]),
            ' al año con un uptime del ',
            crearEl('strong', { style: { color: 'var(--color-info)' } }, [
              Contador({ hasta: 99.99, duracion: 1800, formato: (n) => n.toFixed(2), sufijo: '%' }),
            ]),
            '.',
          ]),
        ]),
        codigo: `crearEl('h2', null, [
  'Más de ',
  crearEl('strong', null, [
    Contador({ hasta: 12500, formato: formatearNumero }),
  ]),
  ' equipos confían en nosotros para procesar ',
  crearEl('strong', null, [
    Contador({ hasta: 4.2, formato: n => n.toFixed(1), prefijo: '$', sufijo: 'B' }),
  ]),
  ' al año.',
])`,
      })],
    }),

    // ============== 10. DURACIÓN PERSONALIZADA ==============
    Seccion({
      titulo: 'Duración personalizada',
      descripcion: '`duracion` controla los milisegundos del tween (default 1400ms). Más largo = más drama. Más corto = sensación de inmediatez.',
      hijos: [VistaCodigo({
        vista: fila(
          tarjetaKpi({
            titulo: 'Rápido (600ms)', icono: 'reloj', color: 'success',
            contador: Contador({ hasta: 250, duracion: 600, formato: formatearNumero }),
            sub: 'Ideal para datos pequeños',
          }),
          tarjetaKpi({
            titulo: 'Normal (1400ms)', icono: 'reloj', color: 'primary',
            contador: Contador({ hasta: 8540, duracion: 1400, formato: formatearNumero }),
            sub: 'Default — equilibrio drama / rapidez',
          }),
          tarjetaKpi({
            titulo: 'Lento (3000ms)', icono: 'reloj', color: 'warning',
            contador: Contador({ hasta: 1500000, duracion: 3000, formato: formatearNumero }),
            sub: 'Drama para números grandes',
          }),
        ),
        codigo: `Contador({ hasta: 250, duracion: 600 })       // rápido — 0.6s
Contador({ hasta: 8540, duracion: 1400 })     // default
Contador({ hasta: 1500000, duracion: 3000 })  // lento — 3s de drama`,
      })],
    }),

  ],
});
