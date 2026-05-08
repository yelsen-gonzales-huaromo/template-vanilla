import { crearEl } from '../../../utils/helpers/dom.js';
import { senal } from '../../../utils/helpers/reactive.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { Alerta, AlertaBanner, AlertaCompacta } from '../../../components/ui/alert/alert.js';
import { Boton } from '../../../components/ui/button/button.js';
import { Avatar } from '../../../components/ui/avatar/avatar.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { corner4 } from '../../../components/ui/card/card-decoraciones.js';

const stack = (...n) => crearEl('div',
  { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', width: '100%' } },
  n);

export default async () => PaginaShowcase({
  titulo: 'Alertas',
  descripcion: 'Mensajes contextuales destacados con 5 variantes semánticas × 4 estilos visuales × 3 tamaños. Soportan título, mensaje, icono custom, avatar, acciones inline, descarte animado, barra de progreso y modo banner full-width.',
  decoracion: corner4(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    // ============== 5 VARIANTES SEMÁNTICAS ==============
    Seccion({
      titulo: '5 variantes semánticas',
      descripcion: 'Info, éxito, advertencia, peligro y neutral — cada una con icono apropiado por defecto.',
      hijos: [VistaCodigo({
        vista: stack(
          Alerta({ variante: 'info',    titulo: 'Información',  mensaje: 'Esta semana hay mantenimiento programado el jueves a las 23:00.' }),
          Alerta({ variante: 'success', titulo: 'Operación exitosa', mensaje: 'Tu pedido se procesó correctamente.' }),
          Alerta({ variante: 'warning', titulo: 'Atención',     mensaje: 'Tu plan vence en 5 días — renueva para mantener el servicio.' }),
          Alerta({ variante: 'danger',  titulo: 'Error',        mensaje: 'No se pudo conectar con el servidor. Verifica tu conexión.' }),
          Alerta({ variante: 'neutral', titulo: 'Aviso',        mensaje: 'Mensaje neutral sin connotación semántica fuerte.' }),
        ),
        codigo: `Alerta({ variante: 'info',    titulo: 'Información',  mensaje: '...' })
Alerta({ variante: 'success', titulo: 'Operación exitosa', mensaje: '...' })
Alerta({ variante: 'warning', titulo: 'Atención',     mensaje: '...' })
Alerta({ variante: 'danger',  titulo: 'Error',        mensaje: '...' })
Alerta({ variante: 'neutral', titulo: 'Aviso',        mensaje: '...' })`,
      })],
    }),

    // ============== ESTILO SOLID ==============
    Seccion({
      titulo: 'Estilo sólido',
      descripcion: 'Fondo lleno con texto blanco — máximo impacto visual.',
      hijos: [VistaCodigo({
        vista: stack(
          Alerta({ estilo: 'solido', variante: 'info',    titulo: 'Información',  mensaje: 'Mensaje sobre fondo lleno.' }),
          Alerta({ estilo: 'solido', variante: 'success', titulo: 'Listo',        mensaje: 'Operación completada.' }),
          Alerta({ estilo: 'solido', variante: 'warning', titulo: 'Atención',     mensaje: 'Hay algo que requiere tu revisión.' }),
          Alerta({ estilo: 'solido', variante: 'danger',  titulo: 'Crítico',      mensaje: 'Acción inmediata requerida.' }),
        ),
        codigo: `Alerta({ estilo: 'solido', variante: 'success', titulo: '...', mensaje: '...' })`,
      })],
    }),

    // ============== ESTILO OUTLINE ==============
    Seccion({
      titulo: 'Estilo outline',
      descripcion: 'Sólo borde — discreto, ideal cuando quieres mantener jerarquía visual.',
      hijos: [VistaCodigo({
        vista: stack(
          Alerta({ estilo: 'outline', variante: 'info',    mensaje: 'Outline simple sin título.' }),
          Alerta({ estilo: 'outline', variante: 'success', titulo: 'Sincronizado', mensaje: 'Todos los cambios están guardados.' }),
          Alerta({ estilo: 'outline', variante: 'warning', mensaje: 'Hay items sin guardar.' }),
        ),
        codigo: `Alerta({ estilo: 'outline', variante: 'info', mensaje: '...' })`,
      })],
    }),

    // ============== ESTILO LATERAL ==============
    Seccion({
      titulo: 'Estilo lateral',
      descripcion: 'Borde grueso a la izquierda + fondo muy sutil — comunica jerarquía sin competir con otros elementos.',
      hijos: [VistaCodigo({
        vista: stack(
          Alerta({ estilo: 'lateral', variante: 'info',    titulo: 'Tip',         mensaje: 'Puedes usar `⌘K` para abrir el command palette desde cualquier página.' }),
          Alerta({ estilo: 'lateral', variante: 'success', titulo: 'Resuelto',    mensaje: 'El issue #4821 fue marcado como resuelto.' }),
          Alerta({ estilo: 'lateral', variante: 'warning', titulo: 'Deprecation', mensaje: 'La API v1 dejará de funcionar el 1 de junio. Migra a v2.' }),
          Alerta({ estilo: 'lateral', variante: 'danger',  titulo: 'Breaking',    mensaje: 'Cambios incompatibles con tu versión actual.' }),
        ),
        codigo: `Alerta({ estilo: 'lateral', variante: 'info', titulo: 'Tip', mensaje: '...' })`,
      })],
    }),

    // ============== TAMAÑOS ==============
    Seccion({
      titulo: 'Tres tamaños',
      hijos: [VistaCodigo({
        vista: stack(
          Alerta({ tamano: 'sm', variante: 'info',    mensaje: 'Tamaño pequeño — para sidebars o paneles densos.' }),
          Alerta({ tamano: 'md', variante: 'success', titulo: 'Mediano', mensaje: 'Tamaño por defecto, balance entre densidad y legibilidad.' }),
          Alerta({ tamano: 'lg', variante: 'warning', titulo: 'Grande',  mensaje: 'Tamaño grande para hero sections o avisos críticos del sistema.' }),
        ),
        codigo: `Alerta({ tamano: 'sm', mensaje: '...' })
Alerta({ tamano: 'md', titulo: '...', mensaje: '...' })   // default
Alerta({ tamano: 'lg', titulo: '...', mensaje: '...' })`,
      })],
    }),

    // ============== DESCARTABLES ==============
    Seccion({
      titulo: 'Descartables',
      descripcion: '`descartable: true` añade un botón ✕ que las elimina con animación corta.',
      hijos: [VistaCodigo({
        vista: stack(
          Alerta({ variante: 'info',    descartable: true, mensaje: 'Click en ✕ para cerrar.' }),
          Alerta({ variante: 'success', descartable: true, titulo: 'Listo', mensaje: 'Ya puedes continuar con el siguiente paso.' }),
          Alerta({ estilo: 'solido', variante: 'danger', descartable: true, titulo: 'Error', mensaje: 'Algo falló — descártame cuando lo resuelvas.' }),
        ),
        codigo: `Alerta({
  variante: 'success',
  descartable: true,
  titulo: '...',
  mensaje: '...',
  alDescartar: () => console.log('cerrada'),
})`,
      })],
    }),

    // ============== CON ACCIONES ==============
    Seccion({
      titulo: 'Con acciones inline',
      descripcion: 'Botones de acción dentro del mensaje — reduce los clics necesarios para resolver el aviso.',
      hijos: [VistaCodigo({
        vista: stack(
          Alerta({
            variante: 'warning', titulo: 'Tu plan vence pronto',
            mensaje: 'Renueva ahora para evitar interrupciones del servicio.',
            acciones: crearEl('div', null, [
              Boton({ texto: 'Renovar', variante: 'primary', tamano: 'sm' }),
              Boton({ texto: 'Más tarde', variante: 'ghost', tamano: 'sm' }),
            ]),
          }),
          Alerta({
            estilo: 'lateral', variante: 'info', titulo: 'Nueva versión disponible',
            mensaje: 'La versión 2.4.0 incluye mejoras de rendimiento y nuevos componentes.',
            acciones: Boton({ texto: 'Ver changelog', variante: 'secondary', tamano: 'sm', iconoDerecha: Icono('flecha_r', { tamano: 14 }) }),
          }),
          Alerta({
            estilo: 'solido', variante: 'success', titulo: '¡Pedido confirmado!',
            mensaje: 'Tu pedido #4821 está siendo procesado. Te enviaremos un email cuando salga.',
            acciones: crearEl('div', null, [
              Boton({ texto: 'Ver pedido', variante: 'secondary', tamano: 'sm' }),
              Boton({ texto: 'Seguir comprando', variante: 'ghost', tamano: 'sm' }),
            ]),
            descartable: true,
          }),
        ),
        codigo: `Alerta({
  variante: 'warning',
  titulo: 'Tu plan vence pronto',
  mensaje: '...',
  acciones: crearEl('div', null, [
    Boton({ texto: 'Renovar', variante: 'primary', tamano: 'sm' }),
    Boton({ texto: 'Más tarde', variante: 'ghost', tamano: 'sm' }),
  ]),
})`,
      })],
    }),

    // ============== CON AVATAR ==============
    Seccion({
      titulo: 'Con avatar',
      descripcion: 'En lugar del icono semántico, una imagen o iniciales — útil para mensajes con autoría humana.',
      hijos: [VistaCodigo({
        vista: stack(
          Alerta({
            variante: 'info', avatar: Avatar({ nombre: 'María López', tamano: 'md' }),
            titulo: 'María L. te mencionó en un comentario',
            mensaje: '"Revisa el último commit, creo que rompe la build de producción 🙃"',
            acciones: Boton({ texto: 'Ver hilo', variante: 'primary', tamano: 'sm' }),
          }),
          Alerta({
            estilo: 'lateral', variante: 'success',
            avatar: Avatar({ nombre: 'Carlos R.', tamano: 'md' }),
            titulo: 'Carlos aprobó tu PR #142',
            mensaje: 'Listo para merge a main. Buen trabajo en la refactorización.',
          }),
        ),
        codigo: `Alerta({
  variante: 'info',
  avatar: Avatar({ nombre: 'María López' }),
  titulo: 'María L. te mencionó',
  mensaje: '...',
  acciones: Boton({...}),
})`,
      })],
    }),

    // ============== COMPACTAS ==============
    Seccion({
      titulo: 'Compactas',
      descripcion: 'Una sola línea, sin título — perfectas para validación de formularios o estados breves.',
      hijos: [VistaCodigo({
        vista: stack(
          AlertaCompacta({ variante: 'success', mensaje: 'Email enviado correctamente.' }),
          AlertaCompacta({ variante: 'warning', mensaje: 'Hay 2 cambios sin guardar.' }),
          AlertaCompacta({ variante: 'danger',  mensaje: 'Contraseña incorrecta. Intenta de nuevo.' }),
          AlertaCompacta({ variante: 'info',    mensaje: 'Conectado al servidor.', descartable: true }),
        ),
        codigo: `AlertaCompacta({ variante: 'success', mensaje: 'Email enviado correctamente.' })
AlertaCompacta({ variante: 'danger',  mensaje: 'Contraseña incorrecta.' })`,
      })],
    }),

    // ============== BANNER FULL-WIDTH ==============
    Seccion({
      titulo: 'Banner full-width',
      descripcion: 'Sin border-radius, sin bordes laterales — para anuncios que cruzan toda la página (cabecera de app, mantenimiento programado, etc.).',
      hijos: [VistaCodigo({
        vista: stack(
          AlertaBanner({
            estilo: 'solido', variante: 'info',
            titulo: 'Mantenimiento programado',
            mensaje: 'El sistema estará en mantenimiento el jueves de 23:00 a 01:00.',
            acciones: Boton({ texto: 'Más detalles', variante: 'secondary', tamano: 'sm' }),
            descartable: true,
          }),
          AlertaBanner({
            variante: 'warning',
            mensaje: 'Estás en modo lectura — no podrás editar hasta que confirmes tu email.',
            acciones: Boton({ texto: 'Reenviar email', variante: 'primary', tamano: 'sm' }),
          }),
        ),
        codigo: `AlertaBanner({
  estilo: 'solido', variante: 'info',
  titulo: 'Mantenimiento programado',
  mensaje: '...',
  acciones: Boton({ texto: 'Más detalles' }),
  descartable: true,
})`,
      })],
    }),

    // ============== CON BARRA DE PROGRESO ==============
    Seccion({
      titulo: 'Con barra de progreso',
      descripcion: 'Útil para indicar tiempo restante (auto-cerrar en N segundos), upload progress, o cuotas.',
      hijos: [VistaCodigo({
        vista: stack(
          Alerta({ variante: 'info', titulo: 'Subiendo archivos…',
            mensaje: '3 de 5 archivos completados. Por favor espera.',
            progreso: 60 }),
          Alerta({ variante: 'warning', titulo: 'Cuota mensual',
            mensaje: 'Has usado 850 de 1000 créditos disponibles.',
            progreso: 85 }),
          Alerta({ estilo: 'solido', variante: 'success',
            titulo: 'Sincronización casi completa',
            mensaje: 'Faltan pocos elementos por procesar.',
            progreso: 92 }),
        ),
        codigo: `Alerta({
  variante: 'info',
  titulo: 'Subiendo archivos…',
  mensaje: '3 de 5 completados',
  progreso: 60,           // 0-100 estático
})

// O reactivo con senal:
const pct = senal(0);
Alerta({ progreso: pct, ... })
pct.value = 50;  // la barra se anima sola`,
      })],
    }),

    // ============== SIN ICONO ==============
    Seccion({
      titulo: 'Sin icono',
      descripcion: '`icono: false` lo elimina por completo, dejando sólo el texto.',
      hijos: [VistaCodigo({
        vista: stack(
          Alerta({ variante: 'info',    icono: false, mensaje: 'Mensaje sin icono — sólo texto.' }),
          Alerta({ variante: 'success', icono: false, titulo: 'Sin visual', mensaje: 'Funciona también con título.' }),
          Alerta({ estilo: 'lateral', variante: 'warning', icono: false, mensaje: 'Lateral sin icono mantiene el borde de color.' }),
        ),
        codigo: `Alerta({ variante: 'info', icono: false, mensaje: '...' })`,
      })],
    }),

    // ============== ICONO CUSTOM ==============
    Seccion({
      titulo: 'Icono custom',
      descripcion: 'Pasa cualquier nodo (típicamente otro `Icono`) para reemplazar el icono por defecto.',
      hijos: [VistaCodigo({
        vista: stack(
          Alerta({ variante: 'info',    icono: Icono('estrella',  { tamano: 18 }), titulo: 'Pro tip',  mensaje: 'Usa atajos de teclado para navegar más rápido.' }),
          Alerta({ variante: 'success', icono: Icono('descargar', { tamano: 18 }), titulo: 'Backup listo', mensaje: 'Tu backup mensual está disponible para descarga.' }),
          Alerta({ variante: 'warning', icono: Icono('reloj',     { tamano: 18 }), titulo: 'Tiempo agotándose', mensaje: 'Quedan 2 minutos para finalizar la sesión.' }),
        ),
        codigo: `Alerta({
  variante: 'info',
  icono: Icono('estrella'),
  titulo: 'Pro tip',
  mensaje: '...',
})`,
      })],
    }),
  ],
});
