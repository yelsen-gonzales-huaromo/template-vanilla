import { crearEl } from '../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { Tarjeta } from '../../../components/ui/card/card.js';
import { Boton } from '../../../components/ui/button/button.js';
import { Insignia } from '../../../components/ui/badge/badge.js';
import { Avatar } from '../../../components/ui/avatar/avatar.js';
import { BarraProgreso } from '../../../components/ui/progress/progress.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { GraficoLineas, GraficoBarras, GraficoDonut } from '../../../components/ui/chart/chart.js';
import { serie } from '../../../utils/helpers/demo-data.js';
import {
  corner1, corner2, corner3, corner4, corner5, corner6, corner7,
} from '../../../components/ui/card/card-decoraciones.js';

const grid2 = (...n) => crearEl('div', { class: 'showcase__grid-2' }, n);
const grid3 = (...n) => crearEl('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-3)' } }, n);
const grid4 = (...n) => crearEl('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' } }, n);
const fila  = (...n) => crearEl('div', { style: { display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' } }, n);

const cuerpoDemo = (txt = 'Cuerpo de la tarjeta — adaptable a cualquier contenido.') =>
  crearEl('p', { style: { margin: 0, color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' } }, [txt]);

const iconoCircular = (icono, color) => crearEl('div', {
  style: {
    width: '40px', height: '40px', borderRadius: '10px',
    background: `color-mix(in srgb, ${color} 14%, transparent)`,
    color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
}, [Icono(icono, { tamano: 20 })]);

// ============================================================================
//  KPI / STATS variantes
// ============================================================================
const kpiSimple = (titulo, valor, delta, tendencia, icono, color) => Tarjeta({
  hijos: crearEl('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' } }, [
    iconoCircular(icono, color),
    crearEl('div', { style: { flex: 1, minWidth: 0 } }, [
      crearEl('p', { style: { margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' } }, [titulo]),
      crearEl('strong', { style: { fontSize: 'var(--text-2xl)', display: 'block', lineHeight: 1.1, marginBlockStart: '4px' } }, [valor]),
      crearEl('div', { style: { fontSize: 'var(--text-xs)', color: tendencia === 'up' ? 'var(--color-success)' : 'var(--color-danger)', marginBlockStart: '4px' } }, [
        `${tendencia === 'up' ? '↑' : '↓'} ${delta}`,
        crearEl('span', { style: { color: 'var(--muted-foreground)', marginInlineStart: '4px' } }, ['vs mes ant.']),
      ]),
    ]),
  ]),
});

const kpiConSparkline = (titulo, valor, datos, color) => Tarjeta({
  hijos: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' } }, [
    crearEl('p', { style: { margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' } }, [titulo]),
    crearEl('strong', { style: { fontSize: 'var(--text-2xl)', lineHeight: 1.1 } }, [valor]),
    GraficoLineas({ datos, ancho: 240, alto: 50, color }),
  ]),
});

const kpiConProgreso = (titulo, valor, progreso, total, color) => Tarjeta({
  hijos: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' } }, [
    crearEl('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' } }, [
      crearEl('p', { style: { margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' } }, [titulo]),
      crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [`${progreso}/${total}`]),
    ]),
    crearEl('strong', { style: { fontSize: 'var(--text-2xl)', lineHeight: 1.1 } }, [valor]),
    BarraProgreso({ valor: (progreso / total) * 100, alto: 'sm', variante: color }),
  ]),
});

// ============================================================================
//  USER / TESTIMONIAL
// ============================================================================
const cardPerfil = (nombre, rol, stats) => Tarjeta({
  variante: 'flotante',
  hijos: crearEl('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2)' } }, [
    Avatar({ nombre, tamano: 'xl' }),
    crearEl('strong', { style: { fontSize: 'var(--text-base)' } }, [nombre]),
    crearEl('p', { style: { margin: 0, color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' } }, [rol]),
    crearEl('div', { style: { display: 'flex', gap: 'var(--space-3)', marginBlockStart: 'var(--space-2)' } },
      stats.map((s) => crearEl('div', { style: { textAlign: 'center' } }, [
        crearEl('strong', { style: { display: 'block' } }, [s.valor]),
        crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [s.etiqueta]),
      ])),
    ),
    fila(
      Boton({ texto: 'Seguir', variante: 'primary', tamano: 'sm' }),
      Boton({ texto: 'Mensaje', variante: 'secondary', tamano: 'sm' }),
    ),
  ]),
});

const cardContacto = (nombre, rol, email, telefono) => Tarjeta({
  hijos: crearEl('div', { style: { display: 'flex', gap: 'var(--space-3)' } }, [
    Avatar({ nombre, tamano: 'lg' }),
    crearEl('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' } }, [
      crearEl('strong', null, [nombre]),
      crearEl('span', { style: { color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' } }, [rol]),
      crearEl('div', { style: { display: 'flex', gap: 'var(--space-3)', marginBlockStart: 'var(--space-2)', flexWrap: 'wrap' } }, [
        fila(Icono('correo', { tamano: 14 }), crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [email])),
        fila(Icono('campana', { tamano: 14 }), crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [telefono])),
      ]),
    ]),
  ]),
});

const cardTestimonial = (texto, nombre, rol) => Tarjeta({
  variante: 'acento',
  hijos: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
    crearEl('div', { style: { fontSize: '2rem', color: 'var(--primary)', lineHeight: 1 } }, ['"']),
    crearEl('p', { style: { margin: 0, fontStyle: 'italic', lineHeight: 1.6 } }, [texto]),
    crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', paddingBlockStart: 'var(--space-2)', borderTop: '1px solid var(--border)' } }, [
      Avatar({ nombre, tamano: 'sm' }),
      crearEl('div', null, [
        crearEl('strong', { style: { display: 'block', fontSize: 'var(--text-sm)' } }, [nombre]),
        crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [rol]),
      ]),
    ]),
  ]),
});

// ============================================================================
//  PRODUCT (e-commerce)
// ============================================================================
const cardProducto = (titulo, precio, precioOrig, rating, descuento, urlImg) => Tarjeta({
  hijos: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' } }, [
    crearEl('div', { style: { position: 'relative', aspectRatio: '1', borderRadius: 'var(--radius)', overflow: 'hidden',
                              background: 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 18%, var(--surface)), color-mix(in srgb, var(--color-info) 18%, var(--surface)))' } }, [
      urlImg && crearEl('img', { src: urlImg, alt: titulo, style: { width: '100%', height: '100%', objectFit: 'cover' } }),
      descuento && crearEl('span', { style: { position: 'absolute', top: '8px', left: '8px' } }, [
        Insignia({ texto: `-${descuento}%`, variante: 'danger', estilo: 'solido' }),
      ]),
      crearEl('button', { type: 'button', 'aria-label': 'Favorito',
        style: { position: 'absolute', top: '8px', right: '8px', width: '32px', height: '32px',
          borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ef4444' } },
        [Icono('corazon', { tamano: 16 })]),
    ]),
    crearEl('strong', { style: { fontSize: 'var(--text-sm)', lineHeight: 1.3 } }, [titulo]),
    fila(
      ...Array.from({ length: 5 }, (_, i) => crearEl('span', {
        style: { color: i < rating ? 'var(--color-warning)' : 'var(--border-strong)', fontSize: '12px' },
      }, ['★'])),
      crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [`(${rating}.0)`]),
    ),
    fila(
      crearEl('strong', { style: { fontSize: 'var(--text-lg)', color: 'var(--foreground)' } }, [precio]),
      precioOrig && crearEl('s', { style: { color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' } }, [precioOrig]),
    ),
    Boton({ texto: 'Añadir al carrito', variante: 'primary', tamano: 'sm', bloque: true,
            icono: Icono('carrito', { tamano: 14 }) }),
  ]),
});

// ============================================================================
//  PRICING
// ============================================================================
const cardPlan = ({ titulo, precio, periodo, descripcion, features, popular, variante = 'default' }) => Tarjeta({
  variante: popular ? 'acento' : variante,
  hijos: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
    popular && Insignia({ texto: 'POPULAR', variante: 'primary', estilo: 'solido', tamano: 'xs', forma: 'cuadrada' }),
    crearEl('div', null, [
      crearEl('h3', { style: { margin: 0, fontSize: 'var(--text-lg)', fontWeight: 600 } }, [titulo]),
      crearEl('p', { style: { margin: '4px 0 0', color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' } }, [descripcion]),
    ]),
    crearEl('div', null, [
      crearEl('strong', { style: { fontSize: '2.25rem', lineHeight: 1, fontWeight: 700 } }, [precio]),
      crearEl('span', { style: { color: 'var(--muted-foreground)', marginInlineStart: '4px' } }, [`/${periodo}`]),
    ]),
    Boton({ texto: popular ? 'Empezar ahora' : 'Elegir plan',
      variante: popular ? 'primary' : 'secondary', bloque: true }),
    crearEl('ul', { style: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px', paddingBlockStart: 'var(--space-2)', borderTop: '1px solid var(--border)' } },
      features.map((f) => crearEl('li', { style: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)' } }, [
        crearEl('span', { style: { color: 'var(--color-success)' } }, [Icono('check', { tamano: 14 })]),
        f,
      ])),
    ),
  ]),
});

// ============================================================================
//  BLOG / ARTICLE
// ============================================================================
const cardArticulo = (titulo, excerpt, autor, fecha, categoria, urlImg) => Tarjeta({
  hijos: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' } }, [
    urlImg
      ? crearEl('img', { src: urlImg, alt: titulo,
          style: { aspectRatio: '16/9', width: '100%', objectFit: 'cover', borderRadius: 'var(--radius)' } })
      : crearEl('div', { style: { aspectRatio: '16/9', borderRadius: 'var(--radius)',
          background: 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 30%, transparent), color-mix(in srgb, var(--color-info) 30%, transparent))' } }),
    fila(Insignia({ texto: categoria, variante: 'primary', tamano: 'xs', forma: 'cuadrada' })),
    crearEl('strong', { style: { fontSize: 'var(--text-base)', lineHeight: 1.3 } }, [titulo]),
    crearEl('p', { style: { margin: 0, color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', lineHeight: 1.5 } }, [excerpt]),
    crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', paddingBlockStart: 'var(--space-2)', borderTop: '1px solid var(--border)' } }, [
      Avatar({ nombre: autor, tamano: 'sm' }),
      crearEl('div', { style: { flex: 1 } }, [
        crearEl('span', { style: { fontSize: 'var(--text-sm)', fontWeight: 500 } }, [autor]),
        crearEl('span', { style: { display: 'block', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [fecha]),
      ]),
    ]),
  ]),
});

// ============================================================================
//  ACTIVITY / NOTIFICATION
// ============================================================================
const cardActividad = (avatarNombre, accion, sub, tiempo, accionInline) => Tarjeta({
  variante: 'sin-borde',
  hijos: crearEl('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' } }, [
    Avatar({ nombre: avatarNombre, tamano: 'md' }),
    crearEl('div', { style: { flex: 1 } }, [
      crearEl('p', { style: { margin: 0, fontSize: 'var(--text-sm)' } }, [
        crearEl('strong', null, [avatarNombre]),
        ` ${accion}`,
      ]),
      sub && crearEl('p', { style: { margin: '2px 0 0', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' } }, [sub]),
      crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [tiempo]),
    ]),
    accionInline,
  ]),
});

// ============================================================================
//  FILES
// ============================================================================
const cardArchivo = (nombre, tamanoMb, tipo, fecha) => {
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
      Boton({ icono: Icono('descargar', { tamano: 14 }), variante: 'ghost', tamano: 'sm', soloIcono: true, 'aria-label': 'Descargar' }),
    ]),
  });
};

// ============================================================================
//  PROJECT / TASK
// ============================================================================
const cardProyecto = (titulo, descripcion, progreso, miembros, fechaLimite, estado) => Tarjeta({
  hijos: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
    crearEl('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' } }, [
      crearEl('div', null, [
        crearEl('strong', { style: { fontSize: 'var(--text-base)' } }, [titulo]),
        crearEl('p', { style: { margin: '4px 0 0', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' } }, [descripcion]),
      ]),
      Insignia({ texto: estado.texto, variante: estado.variante, estilo: 'soft' }),
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
          style: {
            marginInlineStart: i === 0 ? 0 : '-8px',
            border: '2px solid var(--surface)', borderRadius: '50%',
          },
        }, [Avatar({ nombre: m, tamano: 'sm' })])),
      ),
      crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [`📅 ${fechaLimite}`]),
    ]),
  ]),
});

// ============================================================================
//  EVENT
// ============================================================================
const cardEvento = (mes, dia, titulo, hora, lugar) => Tarjeta({
  hijos: crearEl('div', { style: { display: 'flex', gap: 'var(--space-3)' } }, [
    crearEl('div', { style: {
      flexShrink: 0, width: '60px', height: '70px',
      borderRadius: 'var(--radius)', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      border: '1px solid var(--border)',
    } }, [
      crearEl('div', { style: {
        background: 'var(--color-danger)', color: '#fff',
        textAlign: 'center', padding: '4px 0', fontSize: '0.7rem',
        fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
      } }, [mes]),
      crearEl('div', { style: {
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.5rem', fontWeight: 700, color: 'var(--foreground)',
        background: 'var(--surface)',
      } }, [String(dia)]),
    ]),
    crearEl('div', { style: { flex: 1, minWidth: 0 } }, [
      crearEl('strong', { style: { fontSize: 'var(--text-sm)' } }, [titulo]),
      crearEl('p', { style: { margin: '4px 0 0', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [`⏰ ${hora}`]),
      crearEl('p', { style: { margin: '2px 0 0', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [`📍 ${lugar}`]),
    ]),
  ]),
});

// ============================================================================
//  ORDER / INVOICE
// ============================================================================
const cardPedido = (numero, fecha, items, total, estado) => Tarjeta({
  hijos: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
    crearEl('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' } }, [
      crearEl('div', null, [
        crearEl('strong', { style: { fontSize: 'var(--text-sm)' } }, [`Pedido ${numero}`]),
        crearEl('p', { style: { margin: '2px 0 0', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [fecha]),
      ]),
      Insignia({ texto: estado.texto, variante: estado.variante, punto: true }),
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

// ============================================================================
//  PROMO / CTA BANNER
// ============================================================================
const cardPromo = () => Tarjeta({
  variante: 'brand',
  hijos: crearEl('div', { style: { padding: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' } }, [
    crearEl('div', { style: { fontSize: '3rem' } }, ['🚀']),
    crearEl('div', { style: { flex: 1 } }, [
      crearEl('strong', { style: { fontSize: 'var(--text-lg)', display: 'block' } }, ['Upgrade a Pro']),
      crearEl('p', { style: { margin: '4px 0 0', opacity: 0.9, fontSize: 'var(--text-sm)' } }, ['Funciones ilimitadas, soporte prioritario, 50% off este mes.']),
    ]),
    Boton({ texto: 'Ver planes', variante: 'secondary' }),
  ]),
});

// ============================================================================
//  PÁGINA
// ============================================================================
export default async () => PaginaShowcase({
  titulo: 'Tarjetas',
  descripcion: 'Contenedor estructurado con 9 variantes visuales + 13 patrones reales para sistemas de producción — KPIs, perfiles, productos, pricing, blog, actividad, archivos, proyectos, eventos, pedidos y más.',
  decoracion: corner5(),
  ilustracion: null,
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    // ============== VARIANTES VISUALES ==============
    Seccion({
      titulo: 'Galería de variantes',
      descripcion: 'Cada variante cambia bordes, sombras o fondo. Combínalas con la misma estructura base.',
      hijos: [VistaCodigo({
        vista: grid3(
          Tarjeta({ titulo: 'Default',  subtitulo: 'Borde sutil + sombra leve',  hijos: cuerpoDemo() }),
          Tarjeta({ variante: 'flotante', titulo: 'Flotante', subtitulo: 'Sombra fuerte, hover eleva', hijos: cuerpoDemo() }),
          Tarjeta({ variante: 'acento', titulo: 'Acento', subtitulo: 'Glow radial estilo Falcon', hijos: cuerpoDemo() }),
          Tarjeta({ variante: 'compacto', titulo: 'Compacto', subtitulo: 'Paddings reducidos', hijos: cuerpoDemo() }),
          Tarjeta({ variante: 'sin-borde', titulo: 'Sin borde', subtitulo: 'Sólo fondo', hijos: cuerpoDemo() }),
          Tarjeta({ variante: 'destacada', titulo: 'Destacada', subtitulo: 'Borde de acento', hijos: cuerpoDemo() }),
          Tarjeta({ variante: 'vidrio', titulo: 'Vidrio', subtitulo: 'Frosted glass', hijos: cuerpoDemo() }),
          Tarjeta({ variante: 'lineas', titulo: 'Líneas', subtitulo: 'Patrón cuadrícula', hijos: cuerpoDemo() }),
          Tarjeta({ variante: 'brand', titulo: 'Marca', subtitulo: 'Gradiente de marca', hijos: cuerpoDemo() }),
        ),
        codigo: `Tarjeta({ variante: 'flotante' | 'acento' | 'compacto' | 'sin-borde' |
                    'destacada' | 'vidrio' | 'lineas' | 'brand', ... })`,
      })],
    }),

    // ============== KPIS / STATS ==============
    Seccion({
      titulo: 'KPI / métricas (4 estilos)',
      descripcion: 'Patrones para dashboards: simple con icono, con sparkline, con barra de progreso, comparativa.',
      hijos: [VistaCodigo({
        vista: grid4(
          kpiSimple('Ingresos',     '$89,234', '+12.4%', 'up',   'analitica',  'var(--color-success)'),
          kpiSimple('Sesiones',     '12,480',  '+8.1%',  'up',   'panel',      'var(--primary)'),
          kpiSimple('Tickets',      '34',      '−12%',   'down', 'alerta',     'var(--color-warning)'),
          kpiSimple('Conversión',   '4.78%',   '+0.4%',  'up',   'estrella',   'var(--color-info)'),
        ),
        codigo: `// KPI con icono + delta
Tarjeta({ hijos: [iconoCircular, valor + label, delta + tendencia] })`,
      })],
    }),

    Seccion({
      titulo: 'KPI con visualización',
      descripcion: 'Sparkline (tendencia mini) o barra de progreso (uso vs cuota).',
      hijos: [VistaCodigo({
        vista: grid3(
          kpiConSparkline('Visitas únicas', '94.1K', serie(20, 80, 30), 'var(--primary)'),
          kpiConSparkline('Revenue (semanal)', '$12.4K', serie(7, 100, 40), 'var(--color-success)'),
          kpiConProgreso('Almacenamiento usado', '68 GB', 68, 100, 'primary'),
        ),
        codigo: `// Con sparkline
Tarjeta({ hijos: [titulo, valor, GraficoLineas({ datos, ancho: 240, alto: 50 })] })

// Con progreso
Tarjeta({ hijos: [titulo, valor, BarraProgreso({ valor: 68 })] })`,
      })],
    }),

    // ============== PERFILES / TESTIMONIOS ==============
    Seccion({
      titulo: 'Perfiles y testimonios',
      descripcion: 'Para páginas de equipo, "about", testimonios de clientes en landings.',
      hijos: [VistaCodigo({
        vista: grid3(
          cardPerfil('María López', 'Diseñadora UX', [
            { valor: '12.4K', etiqueta: 'Seguidores' },
            { valor: '320',   etiqueta: 'Posts' },
            { valor: '4.9',   etiqueta: 'Rating' },
          ]),
          cardContacto('Carlos Ruiz', 'Tech Lead · Equipo Backend', 'carlos@launchpad.app', '+34 611 222 333'),
          cardTestimonial(
            'Migrar a Launchpad redujo nuestro time-to-market a la mitad. Los componentes simplemente funcionan.',
            'Ana Torres', 'CTO · Acme Corp',
          ),
        ),
        codigo: `// Perfil compacto con stats + acciones
Tarjeta({ variante: 'flotante', hijos: [Avatar, nombre, rol, stats, [Boton, Boton]] })

// Contacto: avatar + datos clickables (mailto/tel)
Tarjeta({ hijos: [Avatar, nombre, rol, [email, telefono]] })

// Testimonial con quote
Tarjeta({ variante: 'acento', hijos: ['"', texto, [Avatar, nombre]] })`,
      })],
    }),

    // ============== PRODUCTO / E-COMMERCE ==============
    Seccion({
      titulo: 'Productos (e-commerce)',
      descripcion: 'Imagen + título + rating + precio + descuento + botón compra. El patrón clásico.',
      hijos: [VistaCodigo({
        vista: grid4(
          cardProducto('Sony A7 IV Mirrorless', '$2,499', '$2,799', 5, 11, null),
          cardProducto('AirPods Pro 2nd Gen',   '$199',   '$249',   4, 20, null),
          cardProducto('MacBook Pro 14" M3',    '$1,599', null,     5, null, null),
          cardProducto('Sony WH-1000XM5',       '$348',   '$399',   4, 13, null),
        ),
        codigo: `// Producto con imagen, rating, precio, descuento, favorito y CTA
Tarjeta({ hijos: [
  imagenConBadgeDescuento + botonFavorito,
  titulo,
  estrellasRating,
  precio + precioOriginal,
  Boton({ texto: 'Añadir al carrito', bloque: true }),
]})`,
      })],
    }),

    // ============== PRICING ==============
    Seccion({
      titulo: 'Pricing (planes)',
      descripcion: 'Para landings de SaaS — el plan "popular" se destaca con la variante acento.',
      hijos: [VistaCodigo({
        vista: grid3(
          cardPlan({
            titulo: 'Free', precio: '$0', periodo: 'mes',
            descripcion: 'Perfecto para empezar.',
            features: ['Hasta 3 proyectos', 'Soporte vía comunidad', 'Backups semanales'],
          }),
          cardPlan({
            titulo: 'Pro', precio: '$19', periodo: 'mes', popular: true,
            descripcion: 'Para equipos pequeños.',
            features: ['Proyectos ilimitados', 'Soporte prioritario', 'Backups diarios', 'Métricas avanzadas'],
          }),
          cardPlan({
            titulo: 'Enterprise', precio: '$99', periodo: 'mes',
            descripcion: 'Para grandes equipos.',
            features: ['Todo lo de Pro', 'SSO/SAML', 'Auditoría completa', 'Soporte 24/7', 'SLA 99.9%'],
          }),
        ),
        codigo: `cardPlan({
  titulo: 'Pro',
  precio: '$19', periodo: 'mes',
  popular: true,                         // Marca "POPULAR" + variante acento
  features: ['Proyectos ilimitados', 'Soporte prioritario', ...],
})`,
      })],
    }),

    // ============== ARTICLE / BLOG ==============
    Seccion({
      titulo: 'Blog / artículos',
      descripcion: 'Cover + categoría + título + excerpt + autor con fecha. Patrón de revistas online.',
      hijos: [VistaCodigo({
        vista: grid3(
          cardArticulo('Cómo construimos un design system desde cero',
            'Las decisiones, los errores y los patrones que descubrimos en el camino.',
            'María L.', '12 abr 2026', 'Diseño',  './public/img/gallery/3.jpg'),
          cardArticulo('Reactividad sin frameworks',
            'Construyendo primitivas reactivas (senal, efecto, calculado) en vanilla JS.',
            'Carlos R.', '8 abr 2026', 'Ingeniería', './public/img/gallery/2006.jpg'),
          cardArticulo('De Falcon a Launchpad',
            'Migrando una plantilla Bootstrap a vanilla JS modular sin perder calidad visual.',
            'Ana T.', '2 abr 2026', 'Producto',  './public/img/gallery/2010.jpg'),
        ),
        codigo: `cardArticulo({
  cover: imagen, categoria: 'Diseño',
  titulo, excerpt, autor, fecha,
})`,
      })],
    }),

    // ============== ACTIVIDAD / NOTIFICACIÓN ==============
    Seccion({
      titulo: 'Actividad / feed',
      descripcion: 'Para timelines de actividad, notificaciones inline, social feeds.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px' } }, [
          cardActividad('María L.', 'aprobó tu pull request', '#142 · feat(auth): add 2FA flow', 'hace 2 min',
            Boton({ texto: 'Ver', variante: 'secondary', tamano: 'sm' })),
          cardActividad('Carlos R.', 'mencionó tu nombre en un comentario',
            '"Sería bueno revisar la lógica del fallback aquí"', 'hace 14 min', null),
          cardActividad('Ana T.', 'subió un nuevo documento', 'Plan-Q2-2026.pdf', 'hace 1 hora',
            Boton({ icono: Icono('descargar', { tamano: 14 }), variante: 'ghost', tamano: 'sm', soloIcono: true, 'aria-label': 'Descargar' })),
        ]),
        codigo: `// Patrón: avatar + acción + sub + tiempo + acción inline opcional
Tarjeta({ variante: 'sin-borde', hijos: [Avatar, accion, sub, tiempo, accionInline] })`,
      })],
    }),

    // ============== ARCHIVOS ==============
    Seccion({
      titulo: 'Archivos / documentos',
      descripcion: 'Para gestores de archivos, attachments, recientes.',
      hijos: [VistaCodigo({
        vista: grid2(
          cardArchivo('Plan-financiero-2026.pdf',     '2.4', 'pdf', '12 abr'),
          cardArchivo('Reporte-mensual.xlsx',          '1.1', 'xls', 'hace 2 días'),
          cardArchivo('Logo-launchpad-final.png',      '0.8', 'img', 'hace 1 semana'),
          cardArchivo('Brief-cliente.docx',            '0.5', 'doc', '5 abr'),
          cardArchivo('Backup-2026-04-01.zip',         '128', 'zip', '1 abr'),
          cardArchivo('Presentacion-board.pdf',        '4.2', 'pdf', '28 mar'),
        ),
        codigo: `cardArchivo({
  nombre, tamanoMb, tipo: 'pdf' | 'doc' | 'xls' | 'img' | 'zip',
  fecha,
})`,
      })],
    }),

    // ============== PROYECTOS / TASK ==============
    Seccion({
      titulo: 'Proyectos / tareas',
      descripcion: 'Para project management — Trello, Notion, Linear style.',
      hijos: [VistaCodigo({
        vista: grid2(
          cardProyecto('Migración a Launchpad',
            'Reescribir todos los componentes en vanilla JS reactivo.',
            68, ['María L.', 'Carlos R.', 'Ana T.'], '12 jun',
            { texto: 'En curso', variante: 'primary' }),
          cardProyecto('Diseño nuevo onboarding',
            'Reducir el tiempo del primer-uso a menos de 60 segundos.',
            92, ['Sofía B.', 'Diego H.'], '5 may',
            { texto: 'Casi listo', variante: 'success' }),
          cardProyecto('Auditoría de seguridad',
            'Revisión completa de auth, sesiones y permisos.',
            25, ['Hugo G.'], '30 abr',
            { texto: 'Atrasado', variante: 'danger' }),
          cardProyecto('Rediseño dashboard',
            'Modernizar las gráficas y reducir noise visual.',
            45, ['María L.', 'Pablo M.', 'Lucia R.', 'Roberto S.'], '15 may',
            { texto: 'En revisión', variante: 'warning' }),
        ),
        codigo: `cardProyecto({
  titulo, descripcion, progreso: 0-100,
  miembros: [nombres],
  fechaLimite,
  estado: { texto, variante },
})`,
      })],
    }),

    // ============== EVENTOS ==============
    Seccion({
      titulo: 'Eventos / citas',
      descripcion: 'Bloque de fecha tipo cuaderno + detalles. Para calendarios de equipo, conferencias, agenda.',
      hijos: [VistaCodigo({
        vista: grid2(
          cardEvento('MAY', 12, 'Standup semanal del equipo', '09:00 - 09:30', 'Sala A · Online'),
          cardEvento('MAY', 14, 'Demo a clientes Q2',         '11:00 - 12:00', 'Zoom'),
          cardEvento('MAY', 18, 'Workshop: Vanilla JS',       '14:00 - 17:00', 'Aula 3 · Madrid'),
          cardEvento('MAY', 25, 'Cierre de sprint',           '17:00 - 18:00', 'Sala B'),
        ),
        codigo: `cardEvento({
  mes: 'MAY', dia: 12,
  titulo: 'Standup semanal',
  hora: '09:00 - 09:30',
  lugar: 'Sala A · Online',
})`,
      })],
    }),

    // ============== PEDIDOS ==============
    Seccion({
      titulo: 'Pedidos / órdenes',
      descripcion: 'Resumen de pedido para historial de compras o panel admin.',
      hijos: [VistaCodigo({
        vista: grid2(
          cardPedido('#4821', '12 mayo · 14:30',
            [
              { cantidad: 2, nombre: 'AirPods Pro',  precio: '$398' },
              { cantidad: 1, nombre: 'MagSafe Charger', precio: '$39' },
            ],
            '$437', { texto: 'Entregado', variante: 'success' }),
          cardPedido('#4822', '13 mayo · 09:12',
            [
              { cantidad: 1, nombre: 'MacBook Pro 14"', precio: '$1,599' },
              { cantidad: 1, nombre: 'AppleCare+',     precio: '$199' },
            ],
            '$1,798', { texto: 'En camino', variante: 'primary' }),
          cardPedido('#4823', '13 mayo · 15:48',
            [{ cantidad: 1, nombre: 'iPad Air M2', precio: '$799' }],
            '$799', { texto: 'Procesando', variante: 'warning' }),
          cardPedido('#4824', '14 mayo · 11:03',
            [{ cantidad: 3, nombre: 'Camiseta XL', precio: '$57' }],
            '$57', { texto: 'Cancelado', variante: 'danger' }),
        ),
        codigo: `cardPedido({
  numero: '#4821', fecha,
  items: [{ cantidad, nombre, precio }, ...],
  total: '$437',
  estado: { texto: 'Entregado', variante: 'success' },
})`,
      })],
    }),

    // ============== PROMO / CTA ==============
    Seccion({
      titulo: 'Promo / CTA banner',
      descripcion: 'Banner ancho con call-to-action — para upgrade prompts, anuncios, alertas top-of-page.',
      hijos: [VistaCodigo({
        vista: cardPromo(),
        codigo: `Tarjeta({
  variante: 'brand',                       // gradiente de marca
  hijos: [emoji + texto + Boton({ texto: 'Ver planes' })],
})`,
      })],
    }),

    // ============== GALLERY (hero + thumbnails) ==============
    Seccion({
      titulo: 'Galería (hero + thumbnails)',
      descripcion: 'Una imagen grande arriba + tira de miniaturas debajo. Click en cualquier thumb la promueve a hero. Patrón clásico de e-commerce, portfolios, álbumes.',
      hijos: [VistaCodigo({
        vista: (() => {
          const imgs = [
            './public/img/gallery/2.jpg',
            './public/img/gallery/3.jpg',
            './public/img/gallery/4.jpg',
            './public/img/gallery/5.jpg',
            './public/img/gallery/2000.jpg',
            './public/img/gallery/2001.jpg',
          ];
          const hero = crearEl('img', {
            src: imgs[0], alt: 'Hero',
            style: {
              width: '100%', aspectRatio: '21/9', objectFit: 'cover',
              borderRadius: 'var(--radius-md)', display: 'block',
              transition: 'opacity 200ms',
            },
          });
          const thumbs = imgs.map((url, i) => {
            const t = crearEl('button', {
              type: 'button',
              style: {
                flex: 1, aspectRatio: '1', padding: 0, border: 'none',
                background: 'transparent', cursor: 'pointer', borderRadius: 'var(--radius)',
                overflow: 'hidden', position: 'relative',
                outline: i === 0 ? '2px solid var(--primary)' : '2px solid transparent',
                outlineOffset: '2px',
                transition: 'outline-color 150ms',
              },
              onClick: () => {
                hero.style.opacity = '0';
                setTimeout(() => {
                  hero.src = url;
                  hero.style.opacity = '1';
                }, 200);
                thumbs.forEach((tt) => { tt.style.outline = '2px solid transparent'; });
                t.style.outline = '2px solid var(--primary)';
              },
            }, [
              crearEl('img', { src: url, alt: '',
                style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' } }),
            ]);
            return t;
          });
          return crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
            hero,
            crearEl('div', {
              style: { display: 'flex', gap: 'var(--space-2)' },
            }, thumbs),
          ]);
        })(),
        codigo: `// Galería reactiva: thumbnails que actualizan el hero
const hero = crearEl('img', { src: imgs[0] });
const thumbs = imgs.map((url, i) => crearEl('button', {
  onClick: () => { hero.src = url; },
}, [crearEl('img', { src: url })]));

container.append(hero, divDeThumbs);`,
      })],
    }),

    // ============== GRID MASONRY ==============
    Seccion({
      titulo: 'Grid masonry de imágenes',
      descripcion: 'Layout en grilla con alturas variables — para portfolios, Instagram-style, Pinterest. Cada imagen se ajusta a su aspect-ratio natural.',
      hijos: [VistaCodigo({
        vista: crearEl('div', {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: 'var(--space-2)',
          },
        }, [
          ...['2.jpg', '3.jpg', '4.jpg', '5.jpg', '2000.jpg', '2001.jpg', '2006.jpg', '2007.jpg', '2008.jpg', '2010.jpg']
            .map((f, i) => crearEl('div', {
              style: {
                aspectRatio: i % 3 === 0 ? '1/1.5' : i % 2 === 0 ? '1' : '4/3',
                borderRadius: 'var(--radius)', overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 200ms, box-shadow 200ms',
              },
              onMouseenter: (e) => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; },
              onMouseleave: (e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; },
            }, [
              crearEl('img', {
                src: `./public/img/gallery/${f}`, alt: '',
                style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
              }),
            ])),
        ]),
        codigo: `crearEl('div', {
  style: { display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: 'var(--space-2)' },
}, imagenes.map((url, i) => crearEl('div', {
  style: { aspectRatio: i % 3 === 0 ? '1/1.5' : '1' },
}, [crearEl('img', { src: url })])))`,
      })],
    }),

    // ============== CON IMAGEN SUPERIOR (Bootstrap classic) ==============
    Seccion({
      titulo: 'Con imagen superior',
      descripcion: 'Imagen arriba ocupando todo el ancho + cuerpo abajo. El patrón clásico de Bootstrap card — para blogs, portfolios, productos.',
      hijos: [VistaCodigo({
        vista: grid3(
          ...[
            { src: './public/img/products/1.jpg', titulo: 'Camiseta verano', sub: 'Algodón orgánico, fit relajado.' },
            { src: './public/img/products/3.jpg', titulo: 'Sneakers running', sub: 'Suela de espuma adaptable.' },
            { src: './public/img/team/1.jpg',     titulo: 'Sofia García',     sub: 'CEO @ Acme Inc.' },
          ].map((it) => Tarjeta({
            hijos: crearEl('div', null, [
              crearEl('img', {
                src: it.src, alt: it.titulo,
                style: {
                  width: 'calc(100% + 2 * var(--space-5))',
                  marginInline: 'calc(-1 * var(--space-5))',
                  marginBlockStart: 'calc(-1 * var(--space-5))',
                  aspectRatio: '4/3',
                  objectFit: 'cover',
                  display: 'block',
                  borderStartStartRadius: 'inherit',
                  borderStartEndRadius: 'inherit',
                },
              }),
              crearEl('h3', { style: { margin: 'var(--space-3) 0 var(--space-1)', fontSize: 'var(--text-base)', fontWeight: 600 } }, [it.titulo]),
              crearEl('p', { style: { margin: '0 0 var(--space-3)', color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' } }, [it.sub]),
              Boton({ texto: 'Ir a detalle', variante: 'primary', tamano: 'sm' }),
            ]),
          })),
        ),
        codigo: `Tarjeta({ hijos: [
  // Imagen full-width que sobresale del padding del card
  crearEl('img', {
    src: '/public/img/...',
    style: {
      width: 'calc(100% + 2 * var(--space-5))',
      marginInline: 'calc(-1 * var(--space-5))',
      marginBlockStart: 'calc(-1 * var(--space-5))',
      aspectRatio: '4/3', objectFit: 'cover',
    },
  }),
  titulo, descripcion, Boton,
]})`,
      })],
    }),

    // ============== IMAGE OVERLAY (texto sobre imagen) ==============
    Seccion({
      titulo: 'Imagen con texto superpuesto',
      descripcion: 'Imagen como fondo + título y descripción superpuestos abajo con gradient. Para hero cards con foco visual fuerte.',
      hijos: [VistaCodigo({
        vista: grid2(
          ...[
            { src: './public/img/gallery/2008.jpg', titulo: 'Camara analógica',
              sub: 'Revive la magia del fotograma con cámaras vintage cuidadosamente restauradas.' },
            { src: './public/img/gallery/2001.jpg', titulo: 'Mochila urbana',
              sub: 'Diseño minimalista con compartimentos amplios para tu día a día.' },
          ].map((it) => crearEl('div', {
            style: {
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              aspectRatio: '16/9',
              background: 'var(--surface-muted)',
              cursor: 'pointer',
            },
          }, [
            crearEl('img', { src: it.src, alt: it.titulo,
              style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' } }),
            crearEl('div', {
              style: {
                position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.85) 100%)',
              },
            }),
            crearEl('div', {
              style: {
                position: 'absolute', insetInline: 0, insetBlockEnd: 0,
                padding: 'var(--space-4)',
                color: '#fff',
              },
            }, [
              crearEl('h3', { style: { margin: 0, fontSize: 'var(--text-lg)', fontWeight: 700 } }, [it.titulo]),
              crearEl('p', { style: { margin: '4px 0 0', fontSize: 'var(--text-sm)', opacity: 0.9, lineHeight: 1.5 } }, [it.sub]),
            ]),
          ])),
        ),
        codigo: `crearEl('div', {
  style: { position: 'relative', borderRadius: 'var(--radius-lg)',
           overflow: 'hidden', aspectRatio: '16/9' },
}, [
  imagen,
  divOverlayGradient,                     // gradient transparent → black 85%
  divTextoAbsoluteBottom,                 // título + descripción superpuestos
])`,
      })],
    }),

    // ============== NOTIFICACIÓN INLINE COMPACTA ==============
    Seccion({
      titulo: 'Notificación inline (compacta)',
      descripcion: 'Avatar + texto inline + meta línea con icono. Para listas de notificaciones, comentarios, menciones — más compacto que actividad.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', maxWidth: '500px' } }, [
          ...[
            { foto: '1.jpg', autor: 'Emma Watson', accion: 'respondió a tu comentario:',
              cita: '"Nice Dashboard 🥰"', icono: 'chat', tiempo: 'Just now' },
            { foto: '2.jpg', autor: 'Carlos Ruiz', accion: 'te mencionó en',
              cita: '"#design-system"', icono: 'campana', tiempo: 'hace 5 min' },
            { foto: '3.jpg', autor: 'María L.',     accion: 'reaccionó a tu post:',
              cita: '🔥 "Build sin frameworks"', icono: 'corazon', tiempo: 'hace 1 hora' },
          ].map((n) => Tarjeta({
            variante: 'compacto',
            hijos: crearEl('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' } }, [
              crearEl('img', { src: `./public/img/team/${n.foto}`, alt: n.autor,
                style: { width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 } }),
              crearEl('div', { style: { flex: 1, minWidth: 0 } }, [
                crearEl('p', { style: { margin: 0, fontSize: 'var(--text-sm)', lineHeight: 1.4 } }, [
                  crearEl('strong', null, [n.autor]),
                  ' ',
                  crearEl('span', { style: { color: 'var(--muted-foreground)' } }, [n.accion]),
                  ' ',
                  n.cita,
                ]),
                crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: '6px', marginBlockStart: '4px', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [
                  Icono(n.icono, { tamano: 12 }),
                  n.tiempo,
                ]),
              ]),
            ]),
          })),
        ]),
        codigo: `Tarjeta({ variante: 'compacto', hijos: [
  imgRedonda,
  crearEl('p', null, [
    crearEl('strong', null, [autor]),
    accion + cita,
  ]),
  fila([Icono(tipoIcono), tiempo]),
]})`,
      })],
    }),

    // ============== HEADER DE PÁGINA INLINE ==============
    Seccion({
      titulo: 'Header de página (inline)',
      descripcion: 'Mismo patrón que el intro de cada page, pero como tarjeta usable inline dentro de un dashboard.',
      hijos: [VistaCodigo({
        vista: Tarjeta({
          variante: 'acento', decoracion: corner6(),
          hijos: crearEl('div', { style: { padding: 'var(--space-2)', maxWidth: '70%' } }, [
            crearEl('h2', { style: { margin: 0, fontSize: 'var(--text-2xl)', fontWeight: 700, letterSpacing: '-0.02em' } }, ['Page Title']),
            crearEl('p', { style: { margin: 'var(--space-2) 0 var(--space-3)', color: 'var(--muted-foreground)', lineHeight: 1.6 } },
              ['The page header is a nice little feature to add appropriate spacing around the headings on a page. This is particularly helpful on a web page where you may have several post titles and need a way to add distinction to each of them.']),
            crearEl('a', { href: '#', style: { color: 'var(--primary)', fontSize: 'var(--text-sm)', fontWeight: 500, textDecoration: 'none' } },
              ['Get Started ›']),
          ]),
        }),
        codigo: `Tarjeta({
  variante: 'acento',
  decoracion: corner6(),
  hijos: [titulo + descripcion + linkCTA],
})`,
      })],
    }),

    // ============== HERO CARDS CON CORNER (estilo intro) ==============
    Seccion({
      titulo: 'Hero cards con esquina decorativa',
      descripcion: 'Mismo patrón visual que el intro de cada página — `decoracion: cornerN()` añade la imagen esquinera. Para callouts, secciones destacadas, banners de bienvenida.',
      hijos: [VistaCodigo({
        vista: grid2(
          Tarjeta({
            variante: 'acento', decoracion: corner1(),
            hijos: crearEl('div', { style: { padding: 'var(--space-2)', maxWidth: '70%' } }, [
              crearEl('h3', { style: { margin: 0, fontSize: 'var(--text-xl)', fontWeight: 700 } }, ['Bienvenida 👋']),
              crearEl('p', { style: { margin: 'var(--space-2) 0 var(--space-3)', color: 'var(--muted-foreground)' } },
                ['Empieza con un tour rápido de las funciones principales.']),
              fila(
                Boton({ texto: 'Iniciar tour', variante: 'primary', tamano: 'sm' }),
                Boton({ texto: 'Saltar', variante: 'ghost', tamano: 'sm' }),
              ),
            ]),
          }),
          Tarjeta({
            variante: 'acento', decoracion: corner4(),
            hijos: crearEl('div', { style: { padding: 'var(--space-2)', maxWidth: '70%' } }, [
              crearEl('h3', { style: { margin: 0, fontSize: 'var(--text-xl)', fontWeight: 700 } }, ['Mantenimiento']),
              crearEl('p', { style: { margin: 'var(--space-2) 0 var(--space-3)', color: 'var(--muted-foreground)' } },
                ['Jueves 23:00 — interrupción esperada de 30 min.']),
              Boton({ texto: 'Más detalles', variante: 'secondary', tamano: 'sm', iconoDerecha: Icono('flecha_r', { tamano: 14 }) }),
            ]),
          }),
          Tarjeta({
            variante: 'acento', decoracion: corner6(),
            hijos: crearEl('div', { style: { padding: 'var(--space-2)', maxWidth: '65%' } }, [
              fila(Insignia({ texto: 'NUEVO', variante: 'success', estilo: 'solido', tamano: 'xs', forma: 'cuadrada' })),
              crearEl('h3', { style: { margin: 'var(--space-2) 0 0', fontSize: 'var(--text-xl)', fontWeight: 700 } }, ['Reportes avanzados']),
              crearEl('p', { style: { margin: 'var(--space-2) 0 var(--space-3)', color: 'var(--muted-foreground)' } },
                ['Genera reportes custom con cualquier filtro de tu base de datos.']),
              Boton({ texto: 'Probar ahora', variante: 'primary', tamano: 'sm' }),
            ]),
          }),
          Tarjeta({
            variante: 'acento', decoracion: corner3(),
            hijos: crearEl('div', { style: { padding: 'var(--space-2)', maxWidth: '70%' } }, [
              crearEl('h3', { style: { margin: 0, fontSize: 'var(--text-xl)', fontWeight: 700 } }, ['Plan Pro']),
              crearEl('p', { style: { margin: 'var(--space-2) 0 var(--space-3)', color: 'var(--muted-foreground)' } },
                ['Desbloquea funciones ilimitadas. 50% off el primer mes.']),
              Boton({ texto: 'Upgrade', variante: 'brand', tamano: 'sm' }),
            ]),
          }),
        ),
        codigo: `import { corner1, corner4, corner6 } from '.../card-decoraciones.js';

Tarjeta({
  variante: 'acento',
  decoracion: corner1(),                   // imagen esquina
  hijos: [titulo, descripcion, botones],
})`,
      })],
    }),

    // ============== HERO CON ILUSTRACIÓN COMPLETA (PNG) ==============
    Seccion({
      titulo: 'Hero con ilustración grande',
      descripcion: 'Cuando quieres impacto visual fuerte — onboarding, secciones destacadas de dashboards, vacíos.',
      hijos: [VistaCodigo({
        vista: grid2(
          Tarjeta({
            hijos: crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)' } }, [
              crearEl('img', { src: './public/img/illustrations/reports-greeting.png',
                alt: 'Reports', style: { width: '120px', height: 'auto', flexShrink: 0 } }),
              crearEl('div', null, [
                crearEl('h3', { style: { margin: 0, fontSize: 'var(--text-lg)', fontWeight: 700 } }, ['Tu reporte está listo']),
                crearEl('p', { style: { margin: '6px 0 var(--space-2)', color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' } },
                  ['Hemos analizado las métricas de los últimos 30 días.']),
                Boton({ texto: 'Ver reporte', variante: 'primary', tamano: 'sm', iconoDerecha: Icono('flecha_r', { tamano: 14 }) }),
              ]),
            ]),
          }),
          Tarjeta({
            hijos: crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)' } }, [
              crearEl('img', { src: './public/img/illustrations/ticket-welcome.png',
                alt: 'Tickets', style: { width: '120px', height: 'auto', flexShrink: 0 } }),
              crearEl('div', null, [
                crearEl('h3', { style: { margin: 0, fontSize: 'var(--text-lg)', fontWeight: 700 } }, ['¡Sin tickets pendientes!']),
                crearEl('p', { style: { margin: '6px 0 var(--space-2)', color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' } },
                  ['Tu equipo respondió a todos los tickets del día.']),
                Boton({ texto: 'Ver historial', variante: 'secondary', tamano: 'sm' }),
              ]),
            ]),
          }),
        ),
        codigo: `Tarjeta({ hijos: [
  imagenIlustracion,
  [titulo + descripcion + Boton],
]})`,
      })],
    }),

    // ============== PROFILE CON COVER IMAGE ==============
    Seccion({
      titulo: 'Profile con cover banner',
      descripcion: 'Banner colorido + avatar superpuesto. Para perfiles públicos, dashboards de usuario.',
      hijos: [VistaCodigo({
        vista: grid3(
          Tarjeta({
            hijos: crearEl('div', { style: { margin: 'calc(-1 * var(--space-5))', display: 'flex', flexDirection: 'column' } }, [
              crearEl('div', { style: {
                height: '90px',
                background: 'linear-gradient(135deg,#3b82f6,#8b5cf6,#ec4899)',
              } }),
              crearEl('div', { style: { padding: 'var(--space-4)', textAlign: 'center', marginTop: '-32px' } }, [
                crearEl('div', { style: { display: 'inline-block', border: '3px solid var(--surface)', borderRadius: '50%' } }, [
                  Avatar({ nombre: 'Sofia García', tamano: 'lg' }),
                ]),
                crearEl('strong', { style: { display: 'block', marginBlockStart: 'var(--space-2)' } }, ['Sofia García']),
                crearEl('span', { style: { fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' } }, ['CEO @ Acme']),
                crearEl('div', { style: { display: 'flex', gap: 'var(--space-2)', justifyContent: 'center', marginBlockStart: 'var(--space-3)' } }, [
                  Boton({ texto: 'Mensaje', variante: 'primary', tamano: 'sm' }),
                  Boton({ texto: 'Ver perfil', variante: 'secondary', tamano: 'sm' }),
                ]),
              ]),
            ]),
          }),
          Tarjeta({
            hijos: crearEl('div', { style: { margin: 'calc(-1 * var(--space-5))', display: 'flex', flexDirection: 'column' } }, [
              crearEl('div', { style: {
                height: '90px',
                background: 'linear-gradient(135deg,#10b981,#06b6d4)',
              } }),
              crearEl('div', { style: { padding: 'var(--space-4)', textAlign: 'center', marginTop: '-32px' } }, [
                crearEl('div', { style: { display: 'inline-block', border: '3px solid var(--surface)', borderRadius: '50%' } }, [
                  Avatar({ nombre: 'Diego H.', tamano: 'lg' }),
                ]),
                crearEl('strong', { style: { display: 'block', marginBlockStart: 'var(--space-2)' } }, ['Diego Hernández']),
                crearEl('span', { style: { fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' } }, ['Product Designer']),
                crearEl('div', { style: { display: 'flex', gap: 'var(--space-2)', justifyContent: 'center', marginBlockStart: 'var(--space-3)' } }, [
                  Boton({ texto: 'Seguir', variante: 'primary', tamano: 'sm' }),
                ]),
              ]),
            ]),
          }),
          Tarjeta({
            hijos: crearEl('div', { style: { margin: 'calc(-1 * var(--space-5))', display: 'flex', flexDirection: 'column' } }, [
              crearEl('div', { style: {
                height: '90px',
                background: 'linear-gradient(135deg,#f59e0b,#ef4444)',
              } }),
              crearEl('div', { style: { padding: 'var(--space-4)', textAlign: 'center', marginTop: '-32px' } }, [
                crearEl('div', { style: { display: 'inline-block', border: '3px solid var(--surface)', borderRadius: '50%' } }, [
                  Avatar({ nombre: 'Lucia R.', tamano: 'lg' }),
                ]),
                crearEl('strong', { style: { display: 'block', marginBlockStart: 'var(--space-2)' } }, ['Lucia Romero']),
                crearEl('span', { style: { fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' } }, ['Frontend Lead']),
                crearEl('div', { style: { display: 'flex', gap: 'var(--space-2)', justifyContent: 'center', marginBlockStart: 'var(--space-3)' } }, [
                  Boton({ texto: 'Conectar', variante: 'primary', tamano: 'sm' }),
                ]),
              ]),
            ]),
          }),
        ),
        codigo: `Tarjeta({ hijos: [
  divCoverGradient,                        // banner colorido 90px
  divConAvatarSuperpuesto + nombre + rol + botones,
]})`,
      })],
    }),

    // ============== PANELES FLOTANTES ==============
    Seccion({
      titulo: 'Panels flotantes',
      descripcion: 'Variante `flotante` con sombra fuerte — "tarjetas que flotan sobre la página". Hover las eleva 3px.',
      hijos: [VistaCodigo({
        vista: grid3(
          Tarjeta({
            variante: 'flotante',
            hijos: crearEl('div', null, [
              fila(iconoCircular('carrito', 'var(--primary)'), null),
              crearEl('strong', { style: { display: 'block', marginBlockStart: 'var(--space-2)', fontSize: 'var(--text-base)' } }, ['Carrito']),
              crearEl('p', { style: { margin: '4px 0 var(--space-3)', color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' } }, ['3 productos · $437']),
              Boton({ texto: 'Ir al checkout', variante: 'primary', tamano: 'sm', bloque: true }),
            ]),
          }),
          Tarjeta({
            variante: 'flotante',
            hijos: crearEl('div', null, [
              fila(iconoCircular('campana', 'var(--color-warning)'), null),
              crearEl('strong', { style: { display: 'block', marginBlockStart: 'var(--space-2)', fontSize: 'var(--text-base)' } }, ['Avisos pendientes']),
              crearEl('p', { style: { margin: '4px 0 var(--space-3)', color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' } }, ['Tienes 12 notificaciones por revisar.']),
              Boton({ texto: 'Ver todas', variante: 'secondary', tamano: 'sm', bloque: true }),
            ]),
          }),
          Tarjeta({
            variante: 'flotante',
            hijos: crearEl('div', null, [
              fila(iconoCircular('descargar', 'var(--color-success)'), null),
              crearEl('strong', { style: { display: 'block', marginBlockStart: 'var(--space-2)', fontSize: 'var(--text-base)' } }, ['Backup listo']),
              crearEl('p', { style: { margin: '4px 0 var(--space-3)', color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' } }, ['Tu backup mensual está disponible.']),
              Boton({ texto: 'Descargar (12 GB)', variante: 'success', tamano: 'sm', bloque: true }),
            ]),
          }),
        ),
        codigo: `Tarjeta({ variante: 'flotante', hijos: [
  iconoCircularDeColor + titulo + descripcion + Boton,
]})`,
      })],
    }),

    // ============== PRODUCTOS CON IMAGEN REAL ==============
    Seccion({
      titulo: 'Productos con imagen real',
      descripcion: 'Mismas tarjetas que e-commerce pero con fotos. Imágenes de `public/img/products/`.',
      hijos: [VistaCodigo({
        vista: grid4(
          cardProducto('Camiseta verano',     '$29',  '$45',  4, 35, './public/img/products/1.jpg'),
          cardProducto('Pantalón slim fit',   '$59',  null,   5, null, './public/img/products/2.jpg'),
          cardProducto('Sneakers running',    '$89',  '$120', 5, 25, './public/img/products/3.jpg'),
          cardProducto('Mochila urbana',      '$69',  '$95',  4, 27, './public/img/products/4.jpg'),
        ),
        codigo: `cardProducto({
  titulo, precio, precioOrig, rating, descuento,
  urlImg: './public/img/products/1.jpg',
})`,
      })],
    }),

    // ============== EQUIPO CON FOTOS REALES ==============
    Seccion({
      titulo: 'Equipo (fotos reales)',
      descripcion: 'Cards de miembros del equipo con fotos de `public/img/team/`. Para "Sobre nosotros", páginas de equipo.',
      hijos: [VistaCodigo({
        vista: grid4(
          ...[
            { foto: '1.jpg', nombre: 'Sofia G.',  rol: 'CEO',           color: '#3b82f6' },
            { foto: '2.jpg', nombre: 'Carlos R.', rol: 'CTO',           color: '#10b981' },
            { foto: '3.jpg', nombre: 'María L.',  rol: 'Designer',      color: '#f59e0b' },
            { foto: '4.jpg', nombre: 'Diego H.',  rol: 'Frontend Lead', color: '#ef4444' },
          ].map((m) => Tarjeta({
            variante: 'flotante',
            hijos: crearEl('div', { style: { textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' } }, [
              crearEl('img', { src: `./public/img/team/${m.foto}`, alt: m.nombre,
                style: { width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover',
                         margin: '0 auto', border: `3px solid ${m.color}` } }),
              crearEl('strong', { style: { fontSize: 'var(--text-base)' } }, [m.nombre]),
              crearEl('span', { style: { color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' } }, [m.rol]),
              fila(
                Boton({ icono: Icono('correo', { tamano: 14 }), variante: 'ghost',  tamano: 'sm', soloIcono: true, 'aria-label': 'Email' }),
                Boton({ icono: Icono('chat',   { tamano: 14 }), variante: 'ghost',  tamano: 'sm', soloIcono: true, 'aria-label': 'Chat' }),
                Boton({ icono: Icono('perfil', { tamano: 14 }), variante: 'ghost',  tamano: 'sm', soloIcono: true, 'aria-label': 'Perfil' }),
              ),
            ]),
          })),
        ),
        codigo: `Tarjeta({ variante: 'flotante', hijos: [
  imgRedonda + nombre + rol + iconosSociales,
]})`,
      })],
    }),

    // ============== ACHIEVEMENT / BADGE UNLOCKED ==============
    Seccion({
      titulo: 'Logro desbloqueado',
      descripcion: 'Para gamification, milestones, logros del usuario.',
      hijos: [VistaCodigo({
        vista: grid3(
          Tarjeta({
            variante: 'destacada destacada-success',
            hijos: crearEl('div', { style: { textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' } }, [
              crearEl('div', { style: { fontSize: '3rem' } }, ['🏆']),
              Insignia({ texto: 'NUEVO LOGRO', variante: 'success', estilo: 'solido', tamano: 'xs', forma: 'cuadrada' }),
              crearEl('strong', { style: { fontSize: 'var(--text-base)' } }, ['Primera milla']),
              crearEl('p', { style: { margin: 0, color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' } }, ['Completaste tu primera tarea con éxito.']),
            ]),
          }),
          Tarjeta({
            variante: 'destacada destacada-warning',
            hijos: crearEl('div', { style: { textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' } }, [
              crearEl('div', { style: { fontSize: '3rem' } }, ['🔥']),
              Insignia({ texto: 'STREAK', variante: 'warning', estilo: 'solido', tamano: 'xs', forma: 'cuadrada' }),
              crearEl('strong', { style: { fontSize: 'var(--text-base)' } }, ['7 días seguidos']),
              crearEl('p', { style: { margin: 0, color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' } }, ['Mantén la racha — sigue así.']),
            ]),
          }),
          Tarjeta({
            variante: 'destacada destacada-info',
            hijos: crearEl('div', { style: { textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' } }, [
              crearEl('div', { style: { fontSize: '3rem' } }, ['⭐']),
              Insignia({ texto: 'ESTRELLA', variante: 'info', estilo: 'solido', tamano: 'xs', forma: 'cuadrada' }),
              crearEl('strong', { style: { fontSize: 'var(--text-base)' } }, ['100 reseñas 5★']),
              crearEl('p', { style: { margin: 0, color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' } }, ['Tus clientes te aman.']),
            ]),
          }),
        ),
        codigo: `Tarjeta({ variante: 'destacada destacada-success', hijos: [
  emojiGrande + Insignia + titulo + descripcion,
]})`,
      })],
    }),

    // ============== STATUS / MONITORING ==============
    Seccion({
      titulo: 'Status / monitoring',
      descripcion: 'Para health checks, status pages, dashboards de uptime. Punto pulsante = en vivo.',
      hijos: [VistaCodigo({
        vista: grid2(
          Tarjeta({
            hijos: crearEl('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, [
              crearEl('div', null, [
                fila(
                  Insignia({ texto: 'Operacional', variante: 'success', punto: true, pulsante: true }),
                ),
                crearEl('strong', { style: { display: 'block', marginBlockStart: 'var(--space-2)', fontSize: 'var(--text-base)' } }, ['API Principal']),
                crearEl('p', { style: { margin: '2px 0 0', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, ['Latencia: 120ms · Uptime 99.99%']),
              ]),
              crearEl('div', { style: { fontSize: '2rem', color: 'var(--color-success)' } }, [Icono('check', { tamano: 28 })]),
            ]),
          }),
          Tarjeta({
            hijos: crearEl('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, [
              crearEl('div', null, [
                fila(
                  Insignia({ texto: 'Degradado', variante: 'warning', punto: true, pulsante: true }),
                ),
                crearEl('strong', { style: { display: 'block', marginBlockStart: 'var(--space-2)', fontSize: 'var(--text-base)' } }, ['CDN Imágenes']),
                crearEl('p', { style: { margin: '2px 0 0', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, ['Latencia: 850ms · 5% errores']),
              ]),
              crearEl('div', { style: { fontSize: '2rem', color: 'var(--color-warning)' } }, [Icono('alerta', { tamano: 28 })]),
            ]),
          }),
          Tarjeta({
            hijos: crearEl('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, [
              crearEl('div', null, [
                fila(
                  Insignia({ texto: 'Caído', variante: 'danger', punto: true, pulsante: true }),
                ),
                crearEl('strong', { style: { display: 'block', marginBlockStart: 'var(--space-2)', fontSize: 'var(--text-base)' } }, ['Servicio de Email']),
                crearEl('p', { style: { margin: '2px 0 0', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, ['Investigando · desde 14:32']),
              ]),
              crearEl('div', { style: { fontSize: '2rem', color: 'var(--color-danger)' } }, [Icono('alerta', { tamano: 28 })]),
            ]),
          }),
          Tarjeta({
            hijos: crearEl('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, [
              crearEl('div', null, [
                fila(
                  Insignia({ texto: 'Mantenimiento', variante: 'info', punto: true, pulsante: true }),
                ),
                crearEl('strong', { style: { display: 'block', marginBlockStart: 'var(--space-2)', fontSize: 'var(--text-base)' } }, ['Base de datos']),
                crearEl('p', { style: { margin: '2px 0 0', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, ['Migración programada · ETA 30 min']),
              ]),
              crearEl('div', { style: { fontSize: '2rem', color: 'var(--color-info)' } }, [Icono('preferencias', { tamano: 28 })]),
            ]),
          }),
        ),
        codigo: `Tarjeta({ hijos: [
  Insignia({ punto: true, pulsante: true, variante: 'success' }),  // dot animado
  servicio + métricas,
  iconoEstado,
]})`,
      })],
    }),

    // ============== SUBSCRIPTION CON USAGE ==============
    Seccion({
      titulo: 'Suscripción con uso',
      descripcion: 'Plan actual + métricas de consumo. Para SaaS, dashboards de cuenta.',
      hijos: [VistaCodigo({
        vista: grid2(
          Tarjeta({
            variante: 'destacada destacada-info',
            titulo: 'Plan Pro',
            subtitulo: 'Renueva el 12 de junio',
            accionCabecera: Insignia({ texto: '$19/mes', variante: 'primary' }),
            hijos: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
              crearEl('div', null, [
                fila(
                  crearEl('span', { style: { fontSize: 'var(--text-sm)' } }, ['Almacenamiento']),
                  crearEl('span', { style: { marginInlineStart: 'auto', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, ['68 / 100 GB']),
                ),
                BarraProgreso({ valor: 68, alto: 'sm' }),
              ]),
              crearEl('div', null, [
                fila(
                  crearEl('span', { style: { fontSize: 'var(--text-sm)' } }, ['API requests']),
                  crearEl('span', { style: { marginInlineStart: 'auto', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, ['840K / 1M']),
                ),
                BarraProgreso({ valor: 84, alto: 'sm', variante: 'warning' }),
              ]),
              crearEl('div', null, [
                fila(
                  crearEl('span', { style: { fontSize: 'var(--text-sm)' } }, ['Usuarios del equipo']),
                  crearEl('span', { style: { marginInlineStart: 'auto', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, ['12 / 25']),
                ),
                BarraProgreso({ valor: 48, alto: 'sm', variante: 'success' }),
              ]),
            ]),
            pie: fila(
              Boton({ texto: 'Gestionar plan', variante: 'primary',   tamano: 'sm' }),
              Boton({ texto: 'Ver factura',    variante: 'secondary', tamano: 'sm' }),
            ),
          }),
          Tarjeta({
            titulo: 'Espacio de trabajo',
            subtitulo: 'Acme Corp · Plan Enterprise',
            accionCabecera: Insignia({ texto: 'Activo', variante: 'success', punto: true, pulsante: true }),
            hijos: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
              fila(
                crearEl('div', { style: { textAlign: 'center', flex: 1, padding: 'var(--space-3)', background: 'var(--surface-muted)', borderRadius: 'var(--radius)' } }, [
                  crearEl('strong', { style: { display: 'block', fontSize: 'var(--text-xl)' } }, ['247']),
                  crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, ['Proyectos']),
                ]),
                crearEl('div', { style: { textAlign: 'center', flex: 1, padding: 'var(--space-3)', background: 'var(--surface-muted)', borderRadius: 'var(--radius)' } }, [
                  crearEl('strong', { style: { display: 'block', fontSize: 'var(--text-xl)' } }, ['1.2K']),
                  crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, ['Miembros']),
                ]),
                crearEl('div', { style: { textAlign: 'center', flex: 1, padding: 'var(--space-3)', background: 'var(--surface-muted)', borderRadius: 'var(--radius)' } }, [
                  crearEl('strong', { style: { display: 'block', fontSize: 'var(--text-xl)' } }, ['99.9%']),
                  crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, ['Uptime']),
                ]),
              ),
            ]),
          }),
        ),
        codigo: `Tarjeta({
  variante: 'destacada destacada-info',
  titulo: 'Plan Pro',
  accionCabecera: Insignia({ texto: '$19/mes' }),
  hijos: [BarraProgreso × N],
  pie: [Boton({ texto: 'Gestionar' })],
})`,
      })],
    }),

    // ============== QUICK ACTIONS PANEL ==============
    Seccion({
      titulo: 'Panel de acciones rápidas',
      descripcion: 'Grid de iconos para acceso rápido. Patrón típico de admin dashboards.',
      hijos: [VistaCodigo({
        vista: Tarjeta({
          titulo: 'Acciones rápidas',
          subtitulo: 'Lo que más usas',
          hijos: crearEl('div', { style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: 'var(--space-2)',
          } },
            [
              { icono: 'mas',          etiqueta: 'Crear proyecto', color: '#3b82f6' },
              { icono: 'subir',        etiqueta: 'Subir archivo',  color: '#10b981' },
              { icono: 'invitar',      etiqueta: 'Invitar miembro',color: '#f59e0b' },
              { icono: 'reportes',     etiqueta: 'Generar reporte',color: '#8b5cf6' },
              { icono: 'preferencias', etiqueta: 'Configuración',  color: '#06b6d4' },
              { icono: 'descargar',    etiqueta: 'Exportar datos', color: '#ef4444' },
            ].map((a) => crearEl('button', {
              type: 'button',
              style: {
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                padding: 'var(--space-3) var(--space-2)',
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
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
            ])),
          ),
        }),
        codigo: `Tarjeta({
  titulo: 'Acciones rápidas',
  hijos: gridDeAccionesConIconoYLabel,
})`,
      })],
    }),

    // ============== COMPARACIÓN ==============
    Seccion({
      titulo: 'Comparativa',
      descripcion: 'Para A/B, antes/después, comparar planes/productos.',
      hijos: [VistaCodigo({
        vista: Tarjeta({
          titulo: 'Antes vs después · Migración a Launchpad',
          hijos: crearEl('div', { style: { display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 'var(--space-4)', alignItems: 'center' } }, [
            crearEl('div', null, [
              crearEl('strong', { style: { color: 'var(--color-danger)' } }, ['ANTES']),
              crearEl('p', { style: { margin: '4px 0 0', fontSize: 'var(--text-2xl)', fontWeight: 700 } }, ['38 KB']),
              crearEl('span', { style: { fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' } }, ['Bundle minificado']),
            ]),
            crearEl('div', { style: { fontSize: '2rem', color: 'var(--color-success)' } }, ['→']),
            crearEl('div', null, [
              crearEl('strong', { style: { color: 'var(--color-success)' } }, ['DESPUÉS']),
              crearEl('p', { style: { margin: '4px 0 0', fontSize: 'var(--text-2xl)', fontWeight: 700 } }, ['12 KB']),
              crearEl('span', { style: { fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' } }, ['−68% menos peso']),
            ]),
          ]),
        }),
        codigo: `Tarjeta({ titulo: 'Antes vs después', hijos: [
  divIzq + arrow + divDer,
]})`,
      })],
    }),

    // ============== DESTACADAS POR INTENCIÓN ==============
    Seccion({
      titulo: 'Destacadas por intención',
      descripcion: 'La variante `destacada` acepta un color modificador (`success`, `warning`, `danger`, `info`) que cambia el borde lateral.',
      hijos: [VistaCodigo({
        vista: grid2(
          Tarjeta({ variante: 'destacada destacada-success', titulo: 'Operación exitosa',  hijos: cuerpoDemo('Tu cambio se aplicó correctamente.') }),
          Tarjeta({ variante: 'destacada destacada-warning', titulo: 'Atención',           hijos: cuerpoDemo('Hay items que requieren tu revisión.') }),
          Tarjeta({ variante: 'destacada destacada-danger',  titulo: 'Error crítico',      hijos: cuerpoDemo('La acción falló — revisa el log.') }),
          Tarjeta({ variante: 'destacada destacada-info',    titulo: 'Información',        hijos: cuerpoDemo('Mantenimiento programado el jueves.') }),
        ),
        codigo: `Tarjeta({ variante: 'destacada destacada-success', ... })`,
      })],
    }),
  ],
});
