/**
 * Card patterns — colección de patrones de tarjeta reutilizables.
 *
 * Cada función exportada es un componente independiente con su propia API.
 * Construidos sobre el componente base `Tarjeta` + componentes UI existentes.
 *
 * Categorías:
 *   • KPI:       KpiCard, KpiSparkline, KpiProgreso
 *   • Perfil:    PerfilCard, ContactoCard, TestimonialCard, PerfilCoverCard
 *   • E-com:     ProductoCard, PedidoCard
 *   • SaaS:      PlanCard, SuscripcionCard, EstadoCard
 *   • Contenido: ArticuloCard, ImagenSuperiorCard, ImagenOverlayCard, HeroCornerCard, HeroIlustracionCard
 *   • Feed:      ActividadCard, NotificacionCard
 *   • Tarea:     ProyectoCard, EventoCard, ArchivoCard, LogroCard
 *   • Otros:     PanelAccionesRapidas, ComparativaCard
 *
 *   import { KpiCard, ProductoCard, PerfilCard } from '.../card-patterns.js';
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { Tarjeta } from '../card/card.js';
import { Boton } from '../button/button.js';
import { Insignia } from '../badge/badge.js';
import { Avatar } from '../avatar/avatar.js';
import { BarraProgreso } from '../progress/progress.js';
import { Icono } from '../icon/icons.js';
import { GraficoLineas } from '../chart/chart.js';

const fila = (...n) => crearEl('div', { style: { display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' } }, n);

const iconoCircular = (nombreIcono, color) => crearEl('div', {
  style: {
    width: '40px', height: '40px', borderRadius: '10px',
    background: `color-mix(in srgb, ${color} 14%, transparent)`,
    color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
}, [Icono(nombreIcono, { tamano: 20 })]);

/* ===========================================================================
   KPI / MÉTRICAS
   =========================================================================== */
export const KpiCard = ({
  titulo, valor, delta, tendencia = 'up',
  icono = 'analitica', color = 'var(--primary)',
} = {}) => Tarjeta({
  hijos: crearEl('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' } }, [
    iconoCircular(icono, color),
    crearEl('div', { style: { flex: 1, minWidth: 0 } }, [
      crearEl('p', { style: { margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' } }, [titulo]),
      crearEl('strong', { style: { fontSize: 'var(--text-2xl)', display: 'block', lineHeight: 1.1, marginBlockStart: '4px' } }, [valor]),
      delta && crearEl('div', {
        style: {
          fontSize: 'var(--text-xs)',
          color: tendencia === 'up' ? 'var(--color-success)' : 'var(--color-danger)',
          marginBlockStart: '4px',
        },
      }, [
        `${tendencia === 'up' ? '↑' : '↓'} ${delta}`,
        crearEl('span', { style: { color: 'var(--muted-foreground)', marginInlineStart: '4px' } }, ['vs mes ant.']),
      ]),
    ]),
  ]),
});

export const KpiSparkline = ({ titulo, valor, datos = [], color = 'var(--primary)' } = {}) => Tarjeta({
  hijos: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' } }, [
    crearEl('p', { style: { margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' } }, [titulo]),
    crearEl('strong', { style: { fontSize: 'var(--text-2xl)', lineHeight: 1.1 } }, [valor]),
    GraficoLineas({ datos, ancho: 240, alto: 50, color }),
  ]),
});

export const KpiProgreso = ({ titulo, valor, progreso, total, color = 'primary' } = {}) => Tarjeta({
  hijos: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' } }, [
    crearEl('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' } }, [
      crearEl('p', { style: { margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' } }, [titulo]),
      crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [`${progreso}/${total}`]),
    ]),
    crearEl('strong', { style: { fontSize: 'var(--text-2xl)', lineHeight: 1.1 } }, [valor]),
    BarraProgreso({ valor: (progreso / total) * 100, alto: 'sm', variante: color }),
  ]),
});

/* ===========================================================================
   PERFIL / TESTIMONIO
   =========================================================================== */
export const PerfilCard = ({ nombre, rol, stats = [], acciones = [] } = {}) => Tarjeta({
  variante: 'flotante',
  hijos: crearEl('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2)' } }, [
    Avatar({ nombre, tamano: 'xl' }),
    crearEl('strong', { style: { fontSize: 'var(--text-base)' } }, [nombre]),
    crearEl('p', { style: { margin: 0, color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' } }, [rol]),
    stats.length > 0 && crearEl('div', { style: { display: 'flex', gap: 'var(--space-3)', marginBlockStart: 'var(--space-2)' } },
      stats.map((s) => crearEl('div', { style: { textAlign: 'center' } }, [
        crearEl('strong', { style: { display: 'block' } }, [s.valor]),
        crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [s.etiqueta]),
      ])),
    ),
    acciones.length > 0 && fila(...acciones),
  ]),
});

export const ContactoCard = ({ nombre, rol, email, telefono, foto } = {}) => Tarjeta({
  hijos: crearEl('div', { style: { display: 'flex', gap: 'var(--space-3)' } }, [
    foto
      ? crearEl('img', { src: foto, alt: nombre,
          style: { width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 } })
      : Avatar({ nombre, tamano: 'lg' }),
    crearEl('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' } }, [
      crearEl('strong', null, [nombre]),
      rol && crearEl('span', { style: { color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' } }, [rol]),
      crearEl('div', { style: { display: 'flex', gap: 'var(--space-3)', marginBlockStart: 'var(--space-2)', flexWrap: 'wrap' } }, [
        email && fila(Icono('correo',  { tamano: 14 }), crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [email])),
        telefono && fila(Icono('campana', { tamano: 14 }), crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [telefono])),
      ]),
    ]),
  ]),
});

export const TestimonialCard = ({ texto, nombre, rol, foto } = {}) => Tarjeta({
  variante: 'acento',
  hijos: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
    crearEl('div', { style: { fontSize: '2rem', color: 'var(--primary)', lineHeight: 1 } }, ['"']),
    crearEl('p', { style: { margin: 0, fontStyle: 'italic', lineHeight: 1.6 } }, [texto]),
    crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', paddingBlockStart: 'var(--space-2)', borderTop: '1px solid var(--border)' } }, [
      foto
        ? crearEl('img', { src: foto, alt: nombre,
            style: { width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' } })
        : Avatar({ nombre, tamano: 'sm' }),
      crearEl('div', null, [
        crearEl('strong', { style: { display: 'block', fontSize: 'var(--text-sm)' } }, [nombre]),
        crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [rol]),
      ]),
    ]),
  ]),
});

export const PerfilCoverCard = ({
  nombre, rol, foto, coverGradient = 'linear-gradient(135deg,#3b82f6,#8b5cf6,#ec4899)',
  acciones = [],
} = {}) => Tarjeta({
  hijos: crearEl('div', { style: { margin: 'calc(-1 * var(--space-5))', display: 'flex', flexDirection: 'column' } }, [
    crearEl('div', { style: { height: '90px', background: coverGradient } }),
    crearEl('div', { style: { padding: 'var(--space-4)', textAlign: 'center', marginTop: '-32px' } }, [
      crearEl('div', { style: { display: 'inline-block', border: '3px solid var(--surface)', borderRadius: '50%' } },
        [foto
          ? crearEl('img', { src: foto, alt: nombre,
              style: { width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', display: 'block' } })
          : Avatar({ nombre, tamano: 'lg' })]),
      crearEl('strong', { style: { display: 'block', marginBlockStart: 'var(--space-2)' } }, [nombre]),
      rol && crearEl('span', { style: { fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' } }, [rol]),
      acciones.length > 0 && crearEl('div', { style: { display: 'flex', gap: 'var(--space-2)', justifyContent: 'center', marginBlockStart: 'var(--space-3)' } }, acciones),
    ]),
  ]),
});

/* ===========================================================================
   E-COMMERCE
   =========================================================================== */
export const ProductoCard = ({
  titulo, precio, precioOrig, rating = 0, descuento, urlImg, alAgregar, alFavorito,
} = {}) => Tarjeta({
  hijos: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' } }, [
    crearEl('div', {
      style: {
        position: 'relative', aspectRatio: '1', borderRadius: 'var(--radius)', overflow: 'hidden',
        background: 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 18%, var(--surface)), color-mix(in srgb, var(--color-info) 18%, var(--surface)))',
      },
    }, [
      urlImg && crearEl('img', { src: urlImg, alt: titulo,
        style: { width: '100%', height: '100%', objectFit: 'cover' } }),
      descuento && crearEl('span', { style: { position: 'absolute', top: '8px', left: '8px' } }, [
        Insignia({ texto: `-${descuento}%`, variante: 'danger', estilo: 'solido' }),
      ]),
      crearEl('button', {
        type: 'button', 'aria-label': 'Favorito',
        onClick: alFavorito,
        style: {
          position: 'absolute', top: '8px', right: '8px', width: '32px', height: '32px',
          borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ef4444',
        },
      }, [Icono('corazon', { tamano: 16 })]),
    ]),
    crearEl('strong', { style: { fontSize: 'var(--text-sm)', lineHeight: 1.3 } }, [titulo]),
    rating > 0 && fila(
      ...Array.from({ length: 5 }, (_, i) => crearEl('span', {
        style: { color: i < rating ? 'var(--color-warning)' : 'var(--border-strong)', fontSize: '12px' },
      }, ['★'])),
      crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [`(${rating}.0)`]),
    ),
    fila(
      crearEl('strong', { style: { fontSize: 'var(--text-lg)', color: 'var(--foreground)' } }, [precio]),
      precioOrig && crearEl('s', { style: { color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' } }, [precioOrig]),
    ),
    Boton({
      texto: 'Añadir al carrito', variante: 'primary', tamano: 'sm', bloque: true,
      icono: Icono('carrito', { tamano: 14 }),
      onClick: alAgregar,
    }),
  ]),
});

export const PedidoCard = ({ numero, fecha, items = [], total, estado } = {}) => Tarjeta({
  hijos: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
    crearEl('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' } }, [
      crearEl('div', null, [
        crearEl('strong', { style: { fontSize: 'var(--text-sm)' } }, [`Pedido ${numero}`]),
        crearEl('p', { style: { margin: '2px 0 0', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [fecha]),
      ]),
      estado && Insignia({ texto: estado.texto, variante: estado.variante, punto: true }),
    ]),
    crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px' } },
      items.map((it) => crearEl('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' } }, [
        crearEl('span', null, [`${it.cantidad}× ${it.nombre}`]),
        crearEl('span', { style: { color: 'var(--muted-foreground)' } }, [it.precio]),
      ])),
    ),
    crearEl('div', { style: { display: 'flex', justifyContent: 'space-between', paddingBlockStart: 'var(--space-2)', borderTop: '1px solid var(--border)', fontWeight: 600 } }, [
      crearEl('span', null, ['Total']),
      crearEl('span', null, [total]),
    ]),
  ]),
});

/* ===========================================================================
   SaaS / PLANES
   =========================================================================== */
export const PlanCard = ({
  titulo, precio, periodo = 'mes', descripcion = '',
  features = [], popular = false, alElegir,
} = {}) => Tarjeta({
  variante: popular ? 'acento' : 'default',
  hijos: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
    popular && Insignia({ texto: 'POPULAR', variante: 'primary', estilo: 'solido', tamano: 'xs', forma: 'cuadrada' }),
    crearEl('div', null, [
      crearEl('h3', { style: { margin: 0, fontSize: 'var(--text-lg)', fontWeight: 600 } }, [titulo]),
      descripcion && crearEl('p', { style: { margin: '4px 0 0', color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' } }, [descripcion]),
    ]),
    crearEl('div', null, [
      crearEl('strong', { style: { fontSize: '2.25rem', lineHeight: 1, fontWeight: 700 } }, [precio]),
      crearEl('span', { style: { color: 'var(--muted-foreground)', marginInlineStart: '4px' } }, [`/${periodo}`]),
    ]),
    Boton({
      texto: popular ? 'Empezar ahora' : 'Elegir plan',
      variante: popular ? 'primary' : 'secondary', bloque: true, onClick: alElegir,
    }),
    features.length > 0 && crearEl('ul', {
      style: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px',
               paddingBlockStart: 'var(--space-2)', borderTop: '1px solid var(--border)' },
    }, features.map((f) => crearEl('li', { style: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)' } }, [
      crearEl('span', { style: { color: 'var(--color-success)' } }, [Icono('check', { tamano: 14 })]),
      f,
    ]))),
  ]),
});

export const SuscripcionCard = ({
  titulo, precio, renovacion, usos = [], acciones = [],
} = {}) => Tarjeta({
  variante: 'destacada destacada-info',
  titulo,
  subtitulo: renovacion && `Renueva ${renovacion}`,
  accionCabecera: precio && Insignia({ texto: precio, variante: 'primary' }),
  hijos: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } },
    usos.map((u) => crearEl('div', null, [
      fila(
        crearEl('span', { style: { fontSize: 'var(--text-sm)' } }, [u.etiqueta]),
        crearEl('span', { style: { marginInlineStart: 'auto', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [u.detalle]),
      ),
      BarraProgreso({ valor: u.porcentaje, alto: 'sm', variante: u.variante || 'primary' }),
    ])),
  ),
  pie: acciones.length > 0 ? fila(...acciones) : null,
});

export const EstadoCard = ({ servicio, estado, metricas, iconoEstado } = {}) => {
  const variantesIcono = { success: 'check', warning: 'alerta', danger: 'alerta', info: 'preferencias' };
  const colorIcono = `var(--color-${estado.variante === 'success' ? 'success' : estado.variante === 'warning' ? 'warning' : estado.variante === 'danger' ? 'danger' : 'info'})`;
  return Tarjeta({
    hijos: crearEl('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, [
      crearEl('div', null, [
        Insignia({ texto: estado.texto, variante: estado.variante, punto: true, pulsante: true }),
        crearEl('strong', { style: { display: 'block', marginBlockStart: 'var(--space-2)', fontSize: 'var(--text-base)' } }, [servicio]),
        metricas && crearEl('p', { style: { margin: '2px 0 0', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [metricas]),
      ]),
      crearEl('div', { style: { fontSize: '2rem', color: colorIcono } },
        [Icono(iconoEstado || variantesIcono[estado.variante] || 'info', { tamano: 28 })]),
    ]),
  });
};

/* ===========================================================================
   CONTENIDO / IMAGEN
   =========================================================================== */
export const ArticuloCard = ({ titulo, excerpt, autor, fecha, categoria, urlImg } = {}) => Tarjeta({
  hijos: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' } }, [
    urlImg
      ? crearEl('img', { src: urlImg, alt: titulo,
          style: { aspectRatio: '16/9', borderRadius: 'var(--radius)', objectFit: 'cover', width: '100%' } })
      : crearEl('div', { style: {
          aspectRatio: '16/9', borderRadius: 'var(--radius)',
          background: 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 30%, transparent), color-mix(in srgb, var(--color-info) 30%, transparent))',
        } }),
    categoria && fila(Insignia({ texto: categoria, variante: 'primary', tamano: 'xs', forma: 'cuadrada' })),
    crearEl('strong', { style: { fontSize: 'var(--text-base)', lineHeight: 1.3 } }, [titulo]),
    excerpt && crearEl('p', { style: { margin: 0, color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', lineHeight: 1.5 } }, [excerpt]),
    crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', paddingBlockStart: 'var(--space-2)', borderTop: '1px solid var(--border)' } }, [
      Avatar({ nombre: autor, tamano: 'sm' }),
      crearEl('div', { style: { flex: 1 } }, [
        crearEl('span', { style: { fontSize: 'var(--text-sm)', fontWeight: 500 } }, [autor]),
        crearEl('span', { style: { display: 'block', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [fecha]),
      ]),
    ]),
  ]),
});

export const ImagenSuperiorCard = ({ urlImg, titulo, sub, alAccion, textoBoton = 'Ir a detalle' } = {}) => Tarjeta({
  hijos: crearEl('div', null, [
    crearEl('img', { src: urlImg, alt: titulo,
      style: {
        width: 'calc(100% + 2 * var(--space-5))',
        marginInline: 'calc(-1 * var(--space-5))',
        marginBlockStart: 'calc(-1 * var(--space-5))',
        aspectRatio: '4/3', objectFit: 'cover', display: 'block',
      } }),
    crearEl('h3', { style: { margin: 'var(--space-3) 0 var(--space-1)', fontSize: 'var(--text-base)', fontWeight: 600 } }, [titulo]),
    sub && crearEl('p', { style: { margin: '0 0 var(--space-3)', color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' } }, [sub]),
    Boton({ texto: textoBoton, variante: 'primary', tamano: 'sm', onClick: alAccion }),
  ]),
});

export const ImagenOverlayCard = ({ urlImg, titulo, sub, alClick } = {}) =>
  crearEl('div', {
    style: {
      position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      aspectRatio: '16/9', background: 'var(--surface-muted)',
      cursor: alClick ? 'pointer' : 'default',
    },
    onClick: alClick,
  }, [
    crearEl('img', { src: urlImg, alt: titulo,
      style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' } }),
    crearEl('div', { style: { position: 'absolute', inset: 0,
      background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.85) 100%)' } }),
    crearEl('div', {
      style: { position: 'absolute', insetInline: 0, insetBlockEnd: 0, padding: 'var(--space-4)', color: '#fff' },
    }, [
      crearEl('h3', { style: { margin: 0, fontSize: 'var(--text-lg)', fontWeight: 700 } }, [titulo]),
      sub && crearEl('p', { style: { margin: '4px 0 0', fontSize: 'var(--text-sm)', opacity: 0.9, lineHeight: 1.5 } }, [sub]),
    ]),
  ]);

export const HeroCornerCard = ({
  decoracion, titulo, descripcion, acciones = [], badge, maxWidth = '70%',
} = {}) => Tarjeta({
  variante: 'acento',
  decoracion,
  hijos: crearEl('div', { style: { padding: 'var(--space-2)', maxWidth } }, [
    badge && fila(badge),
    crearEl('h3', { style: { margin: badge ? 'var(--space-2) 0 0' : 0, fontSize: 'var(--text-xl)', fontWeight: 700 } }, [titulo]),
    descripcion && crearEl('p', { style: { margin: 'var(--space-2) 0 var(--space-3)', color: 'var(--muted-foreground)' } }, [descripcion]),
    acciones.length > 0 && fila(...acciones),
  ]),
});

export const HeroIlustracionCard = ({ urlIlustracion, titulo, descripcion, acciones = [] } = {}) => Tarjeta({
  hijos: crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)' } }, [
    crearEl('img', { src: urlIlustracion, alt: '',
      style: { width: '120px', height: 'auto', flexShrink: 0 } }),
    crearEl('div', null, [
      crearEl('h3', { style: { margin: 0, fontSize: 'var(--text-lg)', fontWeight: 700 } }, [titulo]),
      descripcion && crearEl('p', { style: { margin: '6px 0 var(--space-2)', color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' } }, [descripcion]),
      acciones.length > 0 && fila(...acciones),
    ]),
  ]),
});

/* ===========================================================================
   FEED / NOTIFICACIONES
   =========================================================================== */
export const ActividadCard = ({ avatar, accion, sub, tiempo, accionInline, foto } = {}) => Tarjeta({
  variante: 'sin-borde',
  hijos: crearEl('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' } }, [
    foto
      ? crearEl('img', { src: foto, alt: avatar,
          style: { width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 } })
      : Avatar({ nombre: avatar, tamano: 'md' }),
    crearEl('div', { style: { flex: 1 } }, [
      crearEl('p', { style: { margin: 0, fontSize: 'var(--text-sm)' } }, [
        crearEl('strong', null, [avatar]),
        ` ${accion}`,
      ]),
      sub && crearEl('p', { style: { margin: '2px 0 0', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' } }, [sub]),
      tiempo && crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [tiempo]),
    ]),
    accionInline,
  ]),
});

export const NotificacionCard = ({ foto, autor, accion, cita, icono = 'chat', tiempo } = {}) => Tarjeta({
  variante: 'compacto',
  hijos: crearEl('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' } }, [
    foto
      ? crearEl('img', { src: foto, alt: autor,
          style: { width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 } })
      : Avatar({ nombre: autor, tamano: 'md' }),
    crearEl('div', { style: { flex: 1, minWidth: 0 } }, [
      crearEl('p', { style: { margin: 0, fontSize: 'var(--text-sm)', lineHeight: 1.4 } }, [
        crearEl('strong', null, [autor]),
        ' ',
        crearEl('span', { style: { color: 'var(--muted-foreground)' } }, [accion]),
        ' ',
        cita && crearEl('span', null, [cita]),
      ]),
      tiempo && crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: '6px', marginBlockStart: '4px', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [
        Icono(icono, { tamano: 12 }),
        tiempo,
      ]),
    ]),
  ]),
});

/* ===========================================================================
   TAREAS / ARCHIVOS / EVENTOS / LOGROS
   =========================================================================== */
export const ProyectoCard = ({ titulo, descripcion, progreso = 0, miembros = [], fechaLimite, estado } = {}) => Tarjeta({
  hijos: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
    crearEl('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' } }, [
      crearEl('div', null, [
        crearEl('strong', { style: { fontSize: 'var(--text-base)' } }, [titulo]),
        descripcion && crearEl('p', { style: { margin: '4px 0 0', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' } }, [descripcion]),
      ]),
      estado && Insignia({ texto: estado.texto, variante: estado.variante, estilo: 'soft' }),
    ]),
    crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px' } }, [
      crearEl('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [
        crearEl('span', null, ['Progreso']),
        crearEl('span', null, [`${progreso}%`]),
      ]),
      BarraProgreso({ valor: progreso, alto: 'sm', variante: progreso >= 80 ? 'success' : 'primary' }),
    ]),
    crearEl('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, [
      crearEl('div', { style: { display: 'flex' } },
        miembros.map((m, i) => crearEl('div', {
          style: { marginInlineStart: i === 0 ? 0 : '-8px', border: '2px solid var(--surface)', borderRadius: '50%' },
        }, [Avatar({ nombre: m, tamano: 'sm' })])),
      ),
      fechaLimite && crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [`📅 ${fechaLimite}`]),
    ]),
  ]),
});

export const EventoCard = ({ mes, dia, titulo, hora, lugar, color = 'var(--color-danger)' } = {}) => Tarjeta({
  hijos: crearEl('div', { style: { display: 'flex', gap: 'var(--space-3)' } }, [
    crearEl('div', {
      style: {
        flexShrink: 0, width: '60px', height: '70px',
        borderRadius: 'var(--radius)', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', border: '1px solid var(--border)',
      },
    }, [
      crearEl('div', { style: {
        background: color, color: '#fff', textAlign: 'center', padding: '4px 0',
        fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
      } }, [mes]),
      crearEl('div', { style: {
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.5rem', fontWeight: 700, color: 'var(--foreground)', background: 'var(--surface)',
      } }, [String(dia)]),
    ]),
    crearEl('div', { style: { flex: 1, minWidth: 0 } }, [
      crearEl('strong', { style: { fontSize: 'var(--text-sm)' } }, [titulo]),
      hora && crearEl('p', { style: { margin: '4px 0 0', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [`⏰ ${hora}`]),
      lugar && crearEl('p', { style: { margin: '2px 0 0', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [`📍 ${lugar}`]),
    ]),
  ]),
});

export const ArchivoCard = ({ nombre, tamanoMb, tipo = 'doc', fecha, alDescargar } = {}) => {
  const colores = { pdf: '#ef4444', doc: '#3b82f6', xls: '#22c55e', img: '#8b5cf6', zip: '#f59e0b' };
  return Tarjeta({
    variante: 'compacto',
    hijos: crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)' } }, [
      crearEl('div', { style: {
        width: '40px', height: '48px', borderRadius: '6px',
        background: `color-mix(in srgb, ${colores[tipo] || '#64748b'} 14%, transparent)`,
        color: colores[tipo] || '#64748b',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase',
      } }, [tipo]),
      crearEl('div', { style: { flex: 1, minWidth: 0 } }, [
        crearEl('strong', { style: { display: 'block', fontSize: 'var(--text-sm)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, [nombre]),
        crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [`${tamanoMb} MB · ${fecha}`]),
      ]),
      Boton({
        icono: Icono('descargar', { tamano: 14 }),
        variante: 'ghost', tamano: 'sm', soloIcono: true,
        'aria-label': 'Descargar', onClick: alDescargar,
      }),
    ]),
  });
};

export const LogroCard = ({
  emoji = '🏆', etiqueta, titulo, descripcion, color = 'success',
} = {}) => Tarjeta({
  variante: `destacada destacada-${color}`,
  hijos: crearEl('div', { style: { textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' } }, [
    crearEl('div', { style: { fontSize: '3rem' } }, [emoji]),
    etiqueta && Insignia({ texto: etiqueta, variante: color, estilo: 'solido', tamano: 'xs', forma: 'cuadrada' }),
    crearEl('strong', { style: { fontSize: 'var(--text-base)' } }, [titulo]),
    descripcion && crearEl('p', { style: { margin: 0, color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' } }, [descripcion]),
  ]),
});

/* ===========================================================================
   OTROS
   =========================================================================== */
export const PanelAccionesRapidas = ({ titulo = 'Acciones rápidas', subtitulo, acciones = [] } = {}) => Tarjeta({
  titulo, subtitulo,
  hijos: crearEl('div', { style: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 'var(--space-2)',
  } }, acciones.map((a) => crearEl('button', {
    type: 'button',
    onClick: a.alClick,
    style: {
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
      padding: 'var(--space-3) var(--space-2)',
      background: 'transparent', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)', cursor: 'pointer',
      color: 'var(--foreground)',
      transition: 'background-color 150ms, border-color 150ms',
    },
    onMouseenter: (e) => { e.currentTarget.style.background = 'var(--muted)'; },
    onMouseleave: (e) => { e.currentTarget.style.background = 'transparent'; },
  }, [
    crearEl('span', { style: {
      width: '40px', height: '40px', borderRadius: '50%',
      background: `color-mix(in srgb, ${a.color} 14%, transparent)`,
      color: a.color,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    } }, [Icono(a.icono, { tamano: 18 })]),
    crearEl('span', { style: { fontSize: 'var(--text-xs)', fontWeight: 500 } }, [a.etiqueta]),
  ]))),
});

export const ComparativaCard = ({ titulo, antes, despues, flecha = '→' } = {}) => Tarjeta({
  titulo,
  hijos: crearEl('div', {
    style: { display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 'var(--space-4)', alignItems: 'center' },
  }, [
    crearEl('div', null, [
      crearEl('strong', { style: { color: 'var(--color-danger)' } }, ['ANTES']),
      crearEl('p', { style: { margin: '4px 0 0', fontSize: 'var(--text-2xl)', fontWeight: 700 } }, [antes.valor]),
      antes.detalle && crearEl('span', { style: { fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' } }, [antes.detalle]),
    ]),
    crearEl('div', { style: { fontSize: '2rem', color: 'var(--color-success)' } }, [flecha]),
    crearEl('div', null, [
      crearEl('strong', { style: { color: 'var(--color-success)' } }, ['DESPUÉS']),
      crearEl('p', { style: { margin: '4px 0 0', fontSize: 'var(--text-2xl)', fontWeight: 700 } }, [despues.valor]),
      despues.detalle && crearEl('span', { style: { fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' } }, [despues.detalle]),
    ]),
  ]),
});

export const PromoCard = ({ emoji = '🚀', titulo, descripcion, acciones = [] } = {}) => Tarjeta({
  variante: 'brand',
  hijos: crearEl('div', { style: { padding: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' } }, [
    emoji && crearEl('div', { style: { fontSize: '3rem' } }, [emoji]),
    crearEl('div', { style: { flex: 1 } }, [
      crearEl('strong', { style: { fontSize: 'var(--text-lg)', display: 'block' } }, [titulo]),
      descripcion && crearEl('p', { style: { margin: '4px 0 0', opacity: 0.9, fontSize: 'var(--text-sm)' } }, [descripcion]),
    ]),
    ...acciones,
  ]),
});
