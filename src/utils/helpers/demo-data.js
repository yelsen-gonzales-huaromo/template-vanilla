/**
 * Generadores de datos de demo — produce datos realistas en español sin librerías externas.
 * Útil para pintar dashboards, listas y formularios cuando no hay backend conectado.
 */

const NOMBRES = ['Ana', 'Carlos', 'María', 'Luis', 'Sofía', 'Diego', 'Lucía', 'Pablo', 'Elena', 'Mateo', 'Valeria', 'Andrés', 'Camila', 'Joaquín', 'Isabela'];
const APELLIDOS = ['García', 'Martínez', 'Rodríguez', 'López', 'Hernández', 'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores', 'Rivera', 'Gómez', 'Díaz', 'Reyes', 'Cruz'];
const EMPRESAS = ['Acme Corp', 'Globex SA', 'Soylent Inc.', 'Initech', 'Umbrella', 'Cyberdyne', 'Stark Industries', 'Wayne Enterprises', 'Wonka', 'Monsters Inc.'];
const CIUDADES = ['Madrid', 'Barcelona', 'Bogotá', 'Ciudad de México', 'Lima', 'Buenos Aires', 'Santiago', 'Quito', 'Panamá', 'Montevideo'];
const PRODUCTOS = ['Auriculares Bluetooth', 'Cámara DSLR', 'Reloj inteligente', 'Mouse ergonómico', 'Teclado mecánico', 'Monitor 4K', 'Tablet 10"', 'Altavoz portátil', 'Disco SSD 1TB', 'Cargador USB-C', 'Webcam HD', 'Smartphone'];
const ESTADOS_PEDIDO = ['Pendiente', 'Pagado', 'Enviado', 'Entregado', 'Devuelto', 'Cancelado'];
const ETIQUETAS_VARIANTE = { 'Pendiente': 'warning', 'Pagado': 'info', 'Enviado': 'info', 'Entregado': 'success', 'Devuelto': 'danger', 'Cancelado': 'danger' };
const PRIORIDADES = ['Baja', 'Media', 'Alta', 'Crítica'];

const azar = (max) => Math.floor(Math.random() * max);
const elegir = (arr) => arr[azar(arr.length)];

export const personaAzar = () => {
  const nombre = elegir(NOMBRES);
  const apellido = elegir(APELLIDOS);
  return {
    id: crypto.randomUUID?.() || String(Date.now() + Math.random()),
    nombre: `${nombre} ${apellido}`,
    correo: `${nombre.toLowerCase()}.${apellido.toLowerCase()}@ejemplo.com`,
    telefono: `+34 ${600 + azar(99)} ${100 + azar(900)} ${100 + azar(900)}`,
    ciudad: elegir(CIUDADES),
    empresa: elegir(EMPRESAS),
    avatar: '',
  };
};

export const usuarios = (n = 12) => Array.from({ length: n }, () => personaAzar());

export const productos = (n = 12) => Array.from({ length: n }, (_, i) => ({
  id: 1000 + i,
  sku: `SKU-${(1000 + i).toString().padStart(4, '0')}`,
  nombre: PRODUCTOS[i % PRODUCTOS.length],
  precio: 20 + azar(480),
  stock: azar(150),
  categoria: ['Electrónica', 'Hogar', 'Oficina', 'Audio', 'Vídeo'][i % 5],
  rating: (3 + Math.random() * 2).toFixed(1),
  estado: azar(10) > 1 ? 'Activo' : 'Agotado',
}));

export const pedidos = (n = 16) => Array.from({ length: n }, (_, i) => {
  const estado = elegir(ESTADOS_PEDIDO);
  return {
    id: 4800 + i,
    cliente: personaAzar().nombre,
    fecha: new Date(Date.now() - azar(30) * 86400000).toISOString(),
    total: 50 + azar(950),
    items: 1 + azar(8),
    estado,
    estadoVariante: ETIQUETAS_VARIANTE[estado],
  };
});

export const tickets = (n = 20) => Array.from({ length: n }, (_, i) => ({
  id: `T-${5000 + i}`,
  asunto: ['No puedo acceder a mi cuenta', 'Pago duplicado', 'Pregunta sobre devolución', 'Error en la factura', 'Solicitud de presupuesto', 'Problema con la entrega'][i % 6],
  cliente: personaAzar().nombre,
  prioridad: elegir(PRIORIDADES),
  estado: ['Abierto', 'En progreso', 'Cerrado', 'Pendiente'][i % 4],
  agente: elegir(NOMBRES),
  creado: new Date(Date.now() - azar(20) * 86400000).toISOString(),
}));

export const mensajes = (n = 12) => Array.from({ length: n }, (_, i) => ({
  id: i,
  de: personaAzar(),
  asunto: ['Reunión de equipo', 'Propuesta comercial', 'Recordatorio: factura pendiente', 'Bienvenida al equipo', 'Actualización del proyecto', 'Calendario semanal'][i % 6],
  preview: 'Hola, te envío esto para confirmarte que…',
  fecha: new Date(Date.now() - azar(10) * 86400000).toISOString(),
  leido: i % 3 === 0,
  destacado: i % 5 === 0,
}));

export const eventos = (n = 8) => Array.from({ length: n }, (_, i) => {
  const futuro = new Date(Date.now() + (i + 1) * 86400000 + azar(20) * 3600000);
  return {
    id: i,
    titulo: ['Demo del producto', 'Reunión de planeación', 'Webinar de seguridad', 'Off-site del equipo', 'Conferencia anual', 'Lanzamiento beta'][i % 6],
    fecha: futuro.toISOString(),
    duracion: [30, 60, 90][i % 3],
    asistentes: 3 + azar(20),
    color: ['#3b82f6', '#16a34a', '#d97706', '#dc2626', '#a855f7'][i % 5],
  };
});

export const cursos = (n = 9) => Array.from({ length: n }, (_, i) => ({
  id: i,
  titulo: ['Fundamentos de JavaScript moderno', 'Diseño UX para productos digitales', 'Marketing en redes sociales', 'Liderazgo y equipos remotos', 'Excel avanzado', 'Python para análisis de datos', 'Diseño UI con Figma', 'SEO técnico', 'Gestión ágil con Scrum'][i],
  instructor: elegir(NOMBRES) + ' ' + elegir(APELLIDOS),
  duracion: 4 + azar(30),
  estudiantes: 100 + azar(900),
  rating: (3.8 + Math.random() * 1.2).toFixed(1),
  precio: [49, 79, 99, 149][i % 4],
  categoria: ['Desarrollo', 'Diseño', 'Marketing', 'Negocio', 'Datos'][i % 5],
  thumbnail: `linear-gradient(135deg, hsl(${i * 40}, 70%, 50%), hsl(${i * 40 + 30}, 70%, 35%))`,
}));

export const tareasKanban = () => ({
  porHacer: [
    { id: 1, titulo: 'Diseñar wireframes del onboarding', etiquetas: ['Diseño'], prioridad: 'Alta', asignados: 2 },
    { id: 2, titulo: 'Definir esquema de la base de datos', etiquetas: ['Backend'], prioridad: 'Media', asignados: 1 },
    { id: 3, titulo: 'Investigación de competidores', etiquetas: ['Producto'], prioridad: 'Baja', asignados: 1 },
  ],
  enProgreso: [
    { id: 4, titulo: 'Implementar autenticación con OAuth', etiquetas: ['Backend', 'Seguridad'], prioridad: 'Alta', asignados: 2 },
    { id: 5, titulo: 'Migración del módulo de facturación', etiquetas: ['Backend'], prioridad: 'Crítica', asignados: 3 },
  ],
  enRevision: [
    { id: 6, titulo: 'Refactor del componente de tabla', etiquetas: ['Frontend'], prioridad: 'Media', asignados: 1 },
  ],
  hechas: [
    { id: 7, titulo: 'Configurar CI/CD', etiquetas: ['DevOps'], prioridad: 'Alta', asignados: 1 },
    { id: 8, titulo: 'Documentar API pública', etiquetas: ['Docs'], prioridad: 'Media', asignados: 2 },
  ],
});

export const conversacionesChat = () => [
  { id: 1, contacto: 'Ana García', mensaje: '¿Tienes 5 min ahora?', fecha: '10:32', noLeidos: 2, en_linea: true },
  { id: 2, contacto: 'Carlos Martínez', mensaje: 'Perfecto, gracias!', fecha: '09:48', noLeidos: 0, en_linea: true },
  { id: 3, contacto: 'María Rodríguez', mensaje: 'Te paso el documento.', fecha: 'Ayer', noLeidos: 0, en_linea: false },
  { id: 4, contacto: 'Equipo de Producto', mensaje: 'Reunión a las 4pm', fecha: 'Ayer', noLeidos: 5, en_linea: true },
  { id: 5, contacto: 'Luis Fernández', mensaje: 'Listo el deploy a staging.', fecha: 'Lun', noLeidos: 0, en_linea: false },
];

export const noticias = (n = 8) => Array.from({ length: n }, (_, i) => ({
  id: i,
  autor: personaAzar(),
  contenido: [
    'Acabo de cerrar el cliente del trimestre 🎉',
    '¿Alguien recomienda un buen libro sobre arquitectura de software?',
    'Compartiendo nuestro nuevo whitepaper sobre seguridad zero-trust.',
    'Llegamos al MVP en tiempo récord. Felicidades al equipo.',
    'Seguimos contratando ingenieros senior. Pasen el dato.',
    'Demo en vivo este viernes a las 16h. ¡Inscríbanse!',
    'Aprendizaje del sprint: la importancia de los design reviews.',
    'Lanzamos el plan gratuito para startups. Compártanlo.',
  ][i % 8],
  fecha: new Date(Date.now() - azar(48) * 3600000).toISOString(),
  likes: azar(80),
  comentarios: azar(20),
}));

/** Genera una serie temporal de N puntos para sparklines/gráficos. */
export const serie = (n = 12, base = 40, jitter = 25) =>
  Array.from({ length: n }, () => Math.max(0, base + (Math.random() - 0.4) * jitter * 2));

export const distribucion = (n = 5) => Array.from({ length: n }, () => 10 + azar(80));
