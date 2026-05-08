/**
 * Helpers compartidos para las páginas de Tablas: cell renderers, datasets
 * realistas, sparkline SVG inline.
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { Icono } from '../../../components/ui/icon/icons.js';

// ============================================================================
//  Cell renderers reutilizables
// ============================================================================

// Persona: avatar + nombre + email
export const cellPersona = ({ nombre, email, avatar, color }) => crearEl('div', { class: 'cell-persona' }, [
  crearEl('span', {
    class: 'cell-persona__av',
    style: avatar ? { backgroundImage: `url(${avatar})`, backgroundSize: 'cover', backgroundPosition: 'center' } : color ? { background: color } : null,
  }, [!avatar && (nombre.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase())]),
  crearEl('div', { class: 'cell-persona__txt' }, [
    crearEl('span', { class: 'cell-persona__nombre' }, [nombre]),
    email && crearEl('span', { class: 'cell-persona__sub' }, [email]),
  ]),
]);

// Tag de estado coloreado
export const cellTag = (texto, variante = 'default') => crearEl('span', {
  class: ['cell-tag', variante !== 'default' && `cell-tag--${variante}`],
}, [texto]);

// Estado con punto + label (más sutil que un tag)
export const cellEstado = (texto, color = 'var(--muted-foreground)') => crearEl('div', {
  style: { display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 500 },
}, [
  crearEl('span', { style: { width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 } }),
  texto,
]);

// Mini barra de progreso
export const cellBarra = (valor, max = 100, color = 'linear-gradient(90deg, var(--primary), #8b5cf6)') => crearEl('div', { class: 'cell-bar' }, [
  crearEl('div', { class: 'cell-bar__track' }, [
    crearEl('div', { class: 'cell-bar__fill', style: { width: `${(valor / max) * 100}%`, background: color } }),
  ]),
  crearEl('span', null, [`${Math.round((valor / max) * 100)}%`]),
]);

// Dinero formateado
export const cellMoney = (valor, moneda = 'USD') => {
  const f = new Intl.NumberFormat('en-US', { style: 'currency', currency: moneda, maximumFractionDigits: 0 });
  return crearEl('span', { class: 'cell-money' }, [f.format(valor)]);
};

// Delta vs período previo
export const cellDelta = (valor, suffix = '%') => {
  const positivo = valor >= 0;
  return crearEl('span', {
    style: { display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '12px', fontWeight: 700, color: positivo ? '#10b981' : '#ef4444' },
  }, [positivo ? '↑' : '↓', `${Math.abs(valor)}${suffix}`]);
};

// Sparkline SVG inline
export const cellSparkline = (valores, color = 'var(--primary)') => {
  const min = Math.min(...valores);
  const max = Math.max(...valores);
  const rng = Math.max(1, max - min);
  const w = 80, h = 24;
  const stepX = w / (valores.length - 1);
  const puntos = valores.map((v, i) => `${i * stepX},${h - ((v - min) / rng) * h}`).join(' ');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'cell-spark');
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.setAttribute('preserveAspectRatio', 'none');
  const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  polyline.setAttribute('points', puntos);
  polyline.setAttribute('fill', 'none');
  polyline.setAttribute('stroke', color === 'var(--primary)' ? '#3b82f6' : color);
  polyline.setAttribute('stroke-width', '1.5');
  polyline.setAttribute('stroke-linecap', 'round');
  polyline.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(polyline);
  return svg;
};

// Acciones: 3 mini-botones (ver/editar/borrar)
export const cellAcciones = (callbacks = {}) => crearEl('div', { class: 'cell-acciones' }, [
  callbacks.onVer && crearEl('button', { 'aria-label': 'Ver', title: 'Ver', onClick: callbacks.onVer }, [Icono('ojo', { tamano: 14 })]),
  callbacks.onEditar && crearEl('button', { 'aria-label': 'Editar', title: 'Editar', onClick: callbacks.onEditar }, [Icono('editar', { tamano: 14 })]),
  callbacks.onBorrar && crearEl('button', { class: 'danger', 'aria-label': 'Borrar', title: 'Borrar', onClick: callbacks.onBorrar }, [Icono('papelera', { tamano: 14 })]),
]);

// Stars rating
export const cellRating = (valor, max = 5) => {
  const wrap = crearEl('div', { style: { display: 'inline-flex', gap: '1px', color: '#f59e0b' } });
  for (let i = 1; i <= max; i++) {
    wrap.appendChild(crearEl('span', { style: { fontSize: '14px', opacity: i <= valor ? 1 : 0.25 } }, ['★']));
  }
  return wrap;
};

// Avatar group (varios overlapping)
export const cellAvatarGrupo = (personas) => {
  const wrap = crearEl('div', { style: { display: 'inline-flex' } });
  personas.slice(0, 4).forEach((p, i) => {
    wrap.appendChild(crearEl('span', {
      style: {
        width: '24px', height: '24px', borderRadius: '50%',
        background: p.color || 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        color: '#fff', fontSize: '10px', fontWeight: 700,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        border: '2px solid var(--card)',
        marginInlineStart: i === 0 ? 0 : '-8px',
        zIndex: personas.length - i,
      },
    }, [p.nombre.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()]));
  });
  if (personas.length > 4) {
    wrap.appendChild(crearEl('span', {
      style: {
        width: '24px', height: '24px', borderRadius: '50%',
        background: 'var(--muted)', color: 'var(--muted-foreground)',
        fontSize: '10px', fontWeight: 700,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        border: '2px solid var(--card)',
        marginInlineStart: '-8px',
      },
    }, [`+${personas.length - 4}`]));
  }
  return wrap;
};

// ============================================================================
//  Datasets de ejemplo realistas
// ============================================================================

const NOMBRES = ['Carlos Méndez', 'María García', 'Diego Ramos', 'Ana Torres', 'Pablo Soto', 'Lucía Paredes', 'Jorge Huamán', 'Rosa Cárdenas', 'Luis Vega', 'Patricia León', 'Raúl Castillo', 'Sandra Pérez', 'Alex Romero', 'Camila Díaz', 'Miguel Ángel', 'Daniela Quispe', 'Roberto Silva', 'Elena Núñez', 'Fernando Olivares', 'Valentina Cruz', 'Hugo Ramírez', 'Isabela Mora', 'Eduardo Salas', 'Gabriela Rojas', 'Nicolás Ortiz'];
const EMPRESAS = ['Acme Inc.', 'Globex Corp.', 'Northwind Ltd.', 'Stark Industries', 'Wayne Enterprises', 'Initech', 'Pied Piper', 'Hooli', 'Aperture Labs', 'Cyberdyne', 'Tyrell Corp.', 'Soylent Co.', 'Massive Dynamic', 'Black Mesa', 'Umbrella Corp.', 'Rekall', 'Vandelay Industries', 'Wonka SA', 'OsCorp', 'LexCorp'];
const PROYECTOS = ['Onboarding v2', 'Migration to Postgres', 'API redesign', 'Mobile app launch', 'SOC2 audit', 'Cohort analysis Q4', 'Pricing experiment', 'Help center revamp', 'Internal dashboard', 'Email templates rework', 'Search v3', 'Realtime collab', 'Auth refactor', 'Billing portal', 'Performance push'];
const ROLES = ['Founder', 'CTO', 'Lead Engineer', 'Senior FE', 'BE Engineer', 'Designer', 'Product Manager', 'QA Engineer', 'DevOps', 'Data Scientist', 'CS Manager', 'Marketing'];
const DEPARTAMENTOS = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'Operations', 'Customer Success'];
const PAISES = ['🇵🇪 Perú', '🇲🇽 México', '🇨🇴 Colombia', '🇦🇷 Argentina', '🇨🇱 Chile', '🇪🇸 España', '🇺🇸 USA', '🇧🇷 Brasil', '🇩🇪 Alemania', '🇫🇷 Francia'];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(min + Math.random() * (max - min + 1));

// 50 empleados sintéticos
export const generarEmpleados = (n = 50) => {
  const out = [];
  const colores = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#84cc16'];
  for (let i = 0; i < n; i++) {
    const nombre = NOMBRES[i % NOMBRES.length] + (i >= NOMBRES.length ? ` ${i}` : '');
    out.push({
      id: 1000 + i,
      nombre,
      email: nombre.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z.]/g, '') + '@launchpad.dev',
      rol: pick(ROLES),
      departamento: pick(DEPARTAMENTOS),
      pais: pick(PAISES),
      salario: randInt(40, 240) * 1000,
      nivel: pick(['Junior', 'Mid', 'Senior', 'Staff', 'Principal']),
      estado: Math.random() > 0.85 ? 'inactivo' : Math.random() > 0.3 ? 'activo' : 'baja',
      fechaIngreso: `202${randInt(0, 4)}-${String(randInt(1, 12)).padStart(2, '0')}-${String(randInt(1, 28)).padStart(2, '0')}`,
      color: colores[i % colores.length],
      productividad: randInt(45, 100),
      sparkline: Array.from({ length: 12 }, () => randInt(20, 100)),
    });
  }
  return out;
};

// 30 órdenes/transacciones
export const generarOrdenes = (n = 30) => {
  const estados = [
    { id: 'completada', label: 'Completada', tag: 'ok' },
    { id: 'pendiente',  label: 'Pendiente',  tag: 'warn' },
    { id: 'enviada',    label: 'Enviada',    tag: 'info' },
    { id: 'cancelada',  label: 'Cancelada',  tag: 'err' },
    { id: 'reembolso',  label: 'Reembolso',  tag: 'purple' },
  ];
  const out = [];
  for (let i = 0; i < n; i++) {
    const estado = pick(estados);
    out.push({
      id: `ORD-${10000 + i}`,
      cliente: NOMBRES[i % NOMBRES.length],
      empresa: pick(EMPRESAS),
      monto: randInt(50, 8500),
      productos: randInt(1, 12),
      pais: pick(PAISES),
      fecha: `2025-${String(randInt(1, 12)).padStart(2, '0')}-${String(randInt(1, 28)).padStart(2, '0')}`,
      estado: estado.id,
      estadoLabel: estado.label,
      estadoTag: estado.tag,
      metodo: pick(['Visa •••• 4242', 'Mastercard •••• 8856', 'PayPal', 'Transferencia', 'Stripe']),
    });
  }
  return out;
};

// 20 proyectos con asignados, progreso, deadline
export const generarProyectos = (n = 20) => {
  const empleados = generarEmpleados(15);
  const out = [];
  const prioridades = ['baja', 'media', 'alta', 'critica'];
  for (let i = 0; i < n; i++) {
    const asignados = [];
    const m = randInt(1, 6);
    for (let j = 0; j < m; j++) asignados.push(empleados[(i + j) % empleados.length]);
    out.push({
      id: `PROJ-${100 + i}`,
      nombre: pick(PROYECTOS) + (i >= PROYECTOS.length ? ` ${i}` : ''),
      cliente: pick(EMPRESAS),
      progreso: randInt(0, 100),
      prioridad: pick(prioridades),
      asignados,
      lider: pick(empleados),
      fechaLimite: `2025-${String(randInt(1, 12)).padStart(2, '0')}-${String(randInt(1, 28)).padStart(2, '0')}`,
      presupuesto: randInt(5, 280) * 1000,
      tareas: { total: randInt(8, 40), completadas: 0 },
    });
    out[i].tareas.completadas = Math.floor(out[i].tareas.total * (out[i].progreso / 100));
  }
  return out;
};

// Tareas estilo TanStack demo
const TASK_PALABRAS = ['Auctus', 'Bardus', 'Minus', 'Pariatur', 'Vobis', 'Solitudo', 'Tamquam', 'Admoneo', 'Vehemens', 'Suscipit', 'Toties', 'Desidero', 'Tollo', 'Allatus', 'Blanditiis', 'Caute', 'Delibero', 'Degenero', 'Deputo', 'Veritas', 'Vinculum', 'Expedita', 'Casus', 'Supplanto', 'Corona', 'Deserunt', 'Calamitas', 'Considero', 'Soleo', 'Vester', 'Ducimus', 'Aequus', 'Minima', 'Possimus', 'Vilis', 'Cuppedia', 'Celo', 'Alter', 'Depereo', 'Nihil', 'Denique', 'Acer', 'Corrumpo', 'Cupio', 'Peccatus', 'Spectaculum', 'Tumultus', 'Tergum', 'Cui', 'Thalassinus', 'Carus', 'Uberrime', 'Crapula', 'Damnatio', 'Tristis', 'Correptius', 'Adhaero', 'Itaque', 'Defendo', 'Solutio', 'Cohaero', 'Baiulus', 'Brevis', 'Animadverto', 'Adfero', 'Adeo', 'Callide', 'Calco', 'Quibusdam', 'Vapulus'];
export const generarTasks = (n = 100) => {
  const tipos = [
    { id: 'documentacion', label: 'Documentación' },
    { id: 'error',         label: 'Error' },
    { id: 'caracteristica', label: 'Característica' },
  ];
  const estados = [
    { id: 'cancelado',  label: 'Cancelado',  icon: 'cerrar' },
    { id: 'completado', label: 'Completado', icon: 'check' },
    { id: 'pendiente',  label: 'Pendiente',  icon: 'reloj' },
    { id: 'progreso',   label: 'En progreso', icon: 'reloj' },
  ];
  const prioridades = [
    { id: 'baja',  label: 'Baja',  icon: 'flecha_d' },
    { id: 'media', label: 'Media', icon: 'flecha_r' },
    { id: 'alta',  label: 'Alta',  icon: 'flecha_u' },
  ];
  const out = [];
  for (let i = 0; i < n; i++) {
    const tipo = pick(tipos);
    const estado = pick(estados);
    const prioridad = pick(prioridades);
    const palabras = randInt(6, 12);
    const titulo = Array.from({ length: palabras }, () => TASK_PALABRAS[Math.floor(Math.random() * TASK_PALABRAS.length)]).join(' ').toLowerCase().replace(/^./, (c) => c.toUpperCase()) + '.';
    out.push({
      id: `TASK-${randInt(1000, 9999)}`,
      tipo: tipo.id,
      tipoLabel: tipo.label,
      titulo,
      estado: estado.id,
      estadoLabel: estado.label,
      estadoIcon: estado.icon,
      prioridad: prioridad.id,
      prioridadLabel: prioridad.label,
      prioridadIcon: prioridad.icon,
    });
  }
  return out;
};

// Productos / inventario
export const generarProductos = (n = 25) => {
  const cats = ['Laptops', 'Monitores', 'Periféricos', 'Audio', 'Almacenamiento', 'Redes', 'Accesorios'];
  const marcas = ['Apple', 'Logitech', 'Dell', 'HP', 'Sony', 'Samsung', 'Razer', 'Anker', 'Bose', 'WD'];
  const out = [];
  for (let i = 0; i < n; i++) {
    const categoria = pick(cats);
    const stock = randInt(0, 320);
    out.push({
      sku: `SKU-${String(10000 + i).slice(0, 5)}`,
      nombre: `${pick(marcas)} ${categoria.slice(0, -1)} v${randInt(2, 8)}`,
      categoria,
      precio: randInt(20, 2400),
      stock,
      stockEstado: stock === 0 ? 'agotado' : stock < 20 ? 'bajo' : stock < 100 ? 'medio' : 'alto',
      vendidos: randInt(50, 4500),
      rating: +(3 + Math.random() * 2).toFixed(1),
      sparkline: Array.from({ length: 12 }, () => randInt(20, 100)),
    });
  }
  return out;
};
