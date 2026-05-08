import { crearEl } from '../../../utils/helpers/dom.js';
import { senal } from '../../../utils/helpers/reactive.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import {
  Colapso, ColapsoFAQ, ColapsoLeerMas, ColapsoFiltro, ColapsoSeccion,
} from '../../../components/ui/collapse/collapse.js';
import { Boton } from '../../../components/ui/button/button.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { Insignia } from '../../../components/ui/badge/badge.js';
import { corner1 } from '../../../components/ui/card/card-decoraciones.js';

// ============================================================================
//  Helpers locales — solo para los demos
// ============================================================================
const checkbox = (etiqueta, count, marcado = false) => crearEl('label', {
  class: 'colapso-demo-check',
}, [
  crearEl('input', { type: 'checkbox', checked: marcado || null }),
  crearEl('span', null, [etiqueta]),
  count != null && crearEl('span', { class: 'colapso-demo-check__count' }, [`(${count})`]),
]);

const inputDemo = (label, placeholder = '') => crearEl('div', {
  style: { display: 'flex', flexDirection: 'column', gap: '4px' },
}, [
  crearEl('label', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontWeight: 600 } }, [label]),
  crearEl('input', {
    type: 'text', placeholder,
    style: {
      padding: '8px 12px', fontSize: 'var(--text-sm)',
      background: 'var(--background)', color: 'var(--foreground)',
      border: '1px solid var(--border)', borderRadius: 'var(--radius)',
    },
  }),
]);

// ============================================================================
//  1. Reactivo básico (toggle simple)
// ============================================================================
const ejemploReactivo = () => {
  const abierto = senal(false);
  return crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', width: '100%' } }, [
    Boton({
      texto: 'Mostrar / ocultar', variante: 'primary',
      onClick: () => { abierto.value = !abierto.value; },
    }),
    Colapso({
      abierto,
      hijos: 'Este contenido aparece y desaparece con una animación suave usando `grid-template-rows`. La transición no salta porque interpola el alto en lugar de animar `height` (que causa reflow brusco).',
    }),
  ]);
};

// ============================================================================
//  2. FAQ — preguntas frecuentes
// ============================================================================
const ejemploFAQ = () => crearEl('div', {
  style: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-5)',
  },
}, [
  ColapsoFAQ({
    pregunta: '¿Necesito un build step para usar Launchpad?',
    respuesta: 'No. Launchpad es JavaScript puro con módulos ES nativos — sólo abre `index.html` o sirve la carpeta con cualquier servidor estático. Sin webpack, sin vite, sin npm install.',
    inicial: true,
  }),
  ColapsoFAQ({
    pregunta: '¿Cómo manejo el estado reactivo?',
    respuesta: 'Con las primitivas `senal`, `efecto` y `calculado` que viven en `utils/helpers/reactive.js`. Una `senal` es un valor observable: cuando cambia, todos los `efecto` que la leen vuelven a ejecutarse automáticamente.',
  }),
  ColapsoFAQ({
    pregunta: '¿Puedo usar mis propios componentes?',
    respuesta: 'Sí — todos los helpers `crearEl` retornan nodos DOM normales. Mezclas Launchpad con tu código vanilla, con Web Components, o incluso con un fragmento de React/Vue montado dentro de un nodo (aunque pierdes la simplicidad).',
  }),
  ColapsoFAQ({
    pregunta: '¿Funciona en producción?',
    respuesta: 'Es producción-ready: compatibilidad con todos los browsers modernos (Chrome, Firefox, Safari, Edge ≥ 2020), tree-shakeable por módulos ES, y sin dependencias de runtime. Para dispositivos viejos podrías necesitar polyfills muy puntuales.',
  }),
  ColapsoFAQ({
    pregunta: '¿Cómo despliego el proyecto?',
    respuesta: 'Sube la carpeta a cualquier hosting estático: Netlify, Vercel, GitHub Pages, S3 + CloudFront, o tu propio nginx. No requiere Node.js en el servidor.',
  }),
]);

// ============================================================================
//  3. Filtros sidebar (e-commerce)
// ============================================================================
const ejemploFiltros = () => crearEl('div', { class: 'colapso-demo-filtros' }, [
  ColapsoFiltro({
    titulo: 'Categoría', count: 8,
    icono: Icono('iconos', { tamano: 14 }),
    inicial: true,
    hijos: crearEl('div', { class: 'colapso-demo-stack' }, [
      checkbox('Camisetas', 124, true),
      checkbox('Pantalones', 89),
      checkbox('Zapatillas', 56),
      checkbox('Accesorios', 31),
    ]),
  }),
  ColapsoFiltro({
    titulo: 'Marca', count: 5,
    icono: Icono('estrella', { tamano: 14 }),
    inicial: true,
    hijos: crearEl('div', { class: 'colapso-demo-stack' }, [
      checkbox('Nike', 45),
      checkbox('Adidas', 38, true),
      checkbox('Puma', 22),
      checkbox('Under Armour', 18),
      checkbox('Reebok', 12),
    ]),
  }),
  ColapsoFiltro({
    titulo: 'Precio',
    icono: Icono('precios', { tamano: 14 }),
    inicial: false,
    hijos: crearEl('div', { class: 'colapso-demo-stack' }, [
      checkbox('Menos de $50', 42),
      checkbox('$50 — $100', 67),
      checkbox('$100 — $200', 34),
      checkbox('$200 — $500', 18),
      checkbox('Más de $500', 6),
    ]),
  }),
  ColapsoFiltro({
    titulo: 'Talla',
    icono: Icono('densidad', { tamano: 14 }),
    inicial: false,
    hijos: crearEl('div', { class: 'colapso-demo-stack' }, [
      checkbox('XS', 14),
      checkbox('S', 28),
      checkbox('M', 56),
      checkbox('L', 47),
      checkbox('XL', 22),
    ]),
  }),
  ColapsoFiltro({
    titulo: 'Calificación',
    icono: Icono('estrella', { tamano: 14 }),
    inicial: false,
    hijos: crearEl('div', { class: 'colapso-demo-stack' }, [
      checkbox('★★★★★ (5)', 89),
      checkbox('★★★★ y más (4+)', 142),
      checkbox('★★★ y más (3+)', 178),
    ]),
  }),
]);

// ============================================================================
//  4. Ver más / Ver menos — descripción de producto
// ============================================================================
const ejemploLeerMas = () => crearEl('div', {
  style: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)', padding: 'var(--space-5)',
    maxWidth: '640px',
  },
}, [
  crearEl('strong', {
    style: { display: 'block', marginBlockEnd: 'var(--space-3)', fontSize: 'var(--text-lg)' },
  }, ['Mochila urbana resistente al agua']),
  ColapsoLeerMas({
    textoCorto: 'Diseñada para el día a día en la ciudad: compartimento acolchado para laptop de hasta 15", tela ripstop resistente al agua y correas ergonómicas. Capacidad de 22 litros…',
    textoCompleto: crearEl('span', null, [
      'Diseñada para el día a día en la ciudad: compartimento acolchado para laptop de hasta 15", tela ripstop resistente al agua y correas ergonómicas. Capacidad de 22 litros distribuida en un compartimento principal, dos bolsillos frontales con cremallera YKK, un bolsillo trasero antirrobo con espacio para pasaporte y tarjetas RFID-blocking, y dos bolsillos laterales de malla para botellas. ',
      crearEl('br'), crearEl('br'),
      'La espalda lleva acolchado de espuma EVA con canales de ventilación que reducen la transpiración hasta un 40% comparado con mochilas convencionales. Las correas son ajustables, llevan correa pectoral desmontable y la tela exterior es 100% poliéster reciclado certificado GRS. ',
      crearEl('br'), crearEl('br'),
      'Incluye garantía de por vida del fabricante contra defectos de costura y cremalleras. Disponible en negro, gris carbón, azul marino y verde oliva. Peso vacío: 980 g.',
    ]),
  }),
]);

// ============================================================================
//  5. Sección colapsable — formulario con datos opcionales
// ============================================================================
const ejemploSeccionForm = () => crearEl('div', {
  style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', maxWidth: '640px' },
}, [
  ColapsoSeccion({
    titulo: 'Información básica',
    subtitulo: 'Datos requeridos para crear la cuenta',
    icono: Icono('perfil', { tamano: 18 }),
    badge: Insignia({ texto: 'Requerido', variante: 'danger' }),
    inicial: true,
    hijos: [
      inputDemo('Nombre completo', 'María García'),
      inputDemo('Correo electrónico', 'maria@ejemplo.com'),
    ],
  }),
  ColapsoSeccion({
    titulo: 'Configuración avanzada',
    subtitulo: 'Opciones para usuarios técnicos',
    icono: Icono('utilidades', { tamano: 18 }),
    hijos: [
      inputDemo('API Key', 'sk_live_abc123…'),
      inputDemo('Webhook URL', 'https://midominio.com/webhook'),
      inputDemo('Timeout (ms)', '5000'),
    ],
  }),
  ColapsoSeccion({
    titulo: 'Notificaciones',
    subtitulo: 'Configura cuándo y cómo te contactamos',
    icono: Icono('campana', { tamano: 18 }),
    badge: Insignia({ texto: '3 activas', variante: 'success' }),
    hijos: [
      crearEl('label', { class: 'colapso-demo-check' }, [
        crearEl('input', { type: 'checkbox', checked: true }),
        crearEl('span', null, ['Email — Resumen semanal']),
      ]),
      crearEl('label', { class: 'colapso-demo-check' }, [
        crearEl('input', { type: 'checkbox', checked: true }),
        crearEl('span', null, ['Push — Alertas críticas']),
      ]),
      crearEl('label', { class: 'colapso-demo-check' }, [
        crearEl('input', { type: 'checkbox' }),
        crearEl('span', null, ['SMS — Códigos de verificación']),
      ]),
    ],
  }),
  ColapsoSeccion({
    titulo: 'Zona de peligro',
    subtitulo: 'Acciones irreversibles sobre la cuenta',
    icono: Icono('alerta', { tamano: 18 }),
    badge: Insignia({ texto: 'Cuidado', variante: 'warning' }),
    hijos: [
      crearEl('p', {
        style: { margin: 0, fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' },
      }, ['Cerrar la cuenta elimina permanentemente tus proyectos, equipos y datos asociados. No se puede deshacer.']),
      Boton({ texto: 'Eliminar cuenta', variante: 'danger' }),
    ],
  }),
]);

// ============================================================================
//  6. Sincronizado — varios botones controlan la misma señal
// ============================================================================
const ejemploSincronizado = () => {
  const abierto = senal(false);
  return crearEl('div', {
    style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', width: '100%' },
  }, [
    crearEl('div', { style: { display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' } }, [
      Boton({ texto: 'Abrir',  variante: 'success',   onClick: () => { abierto.value = true; } }),
      Boton({ texto: 'Cerrar', variante: 'danger',    onClick: () => { abierto.value = false; } }),
      Boton({ texto: 'Toggle', variante: 'secondary', onClick: () => { abierto.value = !abierto.value; } }),
    ]),
    Colapso({
      abierto,
      hijos: 'Tres botones controlan una sola `senal`. Como la apertura es estado externo (no interno del componente), puedes orquestar el panel desde cualquier parte de la app — incluso desde un atajo de teclado, un evento de WebSocket o el resultado de una llamada a la API.',
    }),
  ]);
};

// ============================================================================
//  Página
// ============================================================================
export default async () => PaginaShowcase({
  titulo: 'Colapso',
  descripcion: 'Show/hide reactivo con animación fluida (`grid-template-rows`). Más simple que Acordeón — un solo bloque controlado por una `senal`. Trae helpers para los patrones más comunes: FAQ, ver más, sidebar de filtros y secciones de formulario.',
  decoracion: corner1(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    // ============== 1. REACTIVO BÁSICO ==============
    Seccion({
      titulo: 'Reactivo (primitivo)',
      descripcion: 'El estado vive en una `senal`. Cualquier botón o evento externo puede alternarlo — el componente sólo refleja el valor.',
      hijos: [VistaCodigo({
        vista: ejemploReactivo(),
        codigo: `const abierto = senal(false);
Boton({ texto: 'Toggle', onClick: () => { abierto.value = !abierto.value; } })
Colapso({ abierto, hijos: 'contenido…' })`,
      })],
    }),

    // ============== 2. FAQ ==============
    Seccion({
      titulo: 'FAQ — Preguntas frecuentes',
      descripcion: '`ColapsoFAQ` — pregunta + chevron + respuesta. La primera abierta por defecto (`inicial: true`). Pensado para landing pages, secciones de ayuda y documentación.',
      hijos: [VistaCodigo({
        vista: ejemploFAQ(),
        codigo: `ColapsoFAQ({
  pregunta: '¿Necesito un build step?',
  respuesta: 'No. Es JS puro con módulos ES nativos…',
  inicial: true,                    // abre por defecto
})

ColapsoFAQ({
  pregunta: '¿Cómo manejo el estado?',
  respuesta: 'Con \`senal\`, \`efecto\` y \`calculado\`…',
})`,
      })],
    }),

    // ============== 3. SIDEBAR DE FILTROS ==============
    Seccion({
      titulo: 'Sidebar de filtros (e-commerce)',
      descripcion: '`ColapsoFiltro` — patrón Amazon / Mercado Libre. Cada categoría se colapsa independiente. Soporta `count` (badge con número), `icono` opcional e `inicial` para abrir/cerrar al cargar.',
      hijos: [VistaCodigo({
        vista: ejemploFiltros(),
        codigo: `ColapsoFiltro({
  titulo: 'Categoría',
  count: 8,                           // badge con count
  icono: Icono('iconos'),
  inicial: true,                      // abre por defecto
  hijos: crearEl('div', null, [
    checkbox('Camisetas', 124),
    checkbox('Pantalones', 89),
    ...
  ]),
})`,
      })],
    }),

    // ============== 4. VER MÁS / VER MENOS ==============
    Seccion({
      titulo: 'Ver más / Ver menos',
      descripcion: '`ColapsoLeerMas` — texto truncado que expande al click. Ideal para descripciones de producto, biografías, comentarios de usuario.',
      hijos: [VistaCodigo({
        vista: ejemploLeerMas(),
        codigo: `ColapsoLeerMas({
  textoCorto:    'Mochila urbana resistente al agua…',
  textoCompleto: 'Mochila urbana resistente al agua. Compartimento para laptop de 15", \\
                  dos bolsillos frontales, espalda con espuma EVA…',
  etiquetaAbrir:  'Ver más',          // opcional (default)
  etiquetaCerrar: 'Ver menos',
})`,
      })],
    }),

    // ============== 5. SECCIÓN DE FORMULARIO ==============
    Seccion({
      titulo: 'Sección colapsable de formulario',
      descripcion: '`ColapsoSeccion` — tarjeta con icono + título + subtítulo + badge + chevron. Para configuraciones avanzadas, datos opcionales, zonas de peligro. La sección activa cambia el color del borde.',
      hijos: [VistaCodigo({
        vista: ejemploSeccionForm(),
        codigo: `ColapsoSeccion({
  titulo: 'Configuración avanzada',
  subtitulo: 'Opciones para usuarios técnicos',
  icono: Icono('utilidades'),
  badge: Insignia({ texto: 'Opcional', variante: 'info' }),
  inicial: false,                     // cerrada al cargar
  hijos: [
    inputDemo('API Key'),
    inputDemo('Webhook URL'),
  ],
})`,
      })],
    }),

    // ============== 6. SINCRONIZADO ==============
    Seccion({
      titulo: 'Estado externo — múltiples controles',
      descripcion: 'La gracia de tener `abierto` como `senal` externa: cualquier número de botones u eventos pueden orquestar el panel desde fuera del componente.',
      hijos: [VistaCodigo({
        vista: ejemploSincronizado(),
        codigo: `const abierto = senal(false);

Boton({ texto: 'Abrir',  onClick: () => { abierto.value = true; } })
Boton({ texto: 'Cerrar', onClick: () => { abierto.value = false; } })
Boton({ texto: 'Toggle', onClick: () => { abierto.value = !abierto.value; } })

Colapso({ abierto, hijos: '…' })`,
      })],
    }),

  ],
});
