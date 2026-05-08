import { crearEl } from '../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { Boton } from '../../../components/ui/button/button.js';
import { Avatar } from '../../../components/ui/avatar/avatar.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { notificar } from '../../../components/ui/toast/toast.js';
import { corner3 } from '../../../components/ui/card/card-decoraciones.js';

const fila = (...nodos) => crearEl('div', {
  style: { display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' },
}, nodos);

const FOTO = (n) => `./public/img/team/${n}.jpg`;
const PROD = (n) => `./public/img/products/${n}.jpg`;

export default async () => PaginaShowcase({
  titulo: 'Notificaciones (Toasts)',
  descripcion: 'Mensajes flotantes efímeros con icono semántico, borde lateral coloreado, barra de countdown que pausa al hover, animaciones direccionales, y soporte completo: 4 variantes + loading + 6 posiciones + acciones inline + avatar/imagen + auto-toggle con `notificar.promesa()`. Apilables y accesibles (`aria-live`).',
  decoracion: corner3(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    // ============== 1. VARIANTES ==============
    Seccion({
      titulo: '1 · Variantes semánticas',
      descripcion: '4 intenciones — éxito (verde · check), error (rojo · ×), advertencia (naranja · !), info (azul · ⓘ). Cada una con icono auto-asignado en círculo gradient + borde lateral 4px coloreado.',
      hijos: [VistaCodigo({
        vista: fila(
          Boton({ texto: 'Éxito',       variante: 'success',   onClick: () => notificar.exito('Datos guardados correctamente') }),
          Boton({ texto: 'Error',       variante: 'danger',    onClick: () => notificar.error('No se pudo conectar al servidor') }),
          Boton({ texto: 'Advertencia', variante: 'secondary', onClick: () => notificar.advertencia('Tienes cambios sin guardar') }),
          Boton({ texto: 'Info',        variante: 'ghost',     onClick: () => notificar.info('Sincronización en curso') }),
        ),
        codigo: `notificar.exito('Datos guardados')
notificar.error('No se pudo conectar')
notificar.advertencia('Cambios sin guardar')
notificar.info('Sincronizando…')`,
      })],
    }),

    // ============== 2. CON TÍTULO + MENSAJE ==============
    Seccion({
      titulo: '2 · Con título + mensaje rico',
      descripcion: 'Los toasts simples tienen sólo el `message`. Para más contexto, agrega `titulo` arriba (bold) y el mensaje debajo (muted). Útil cuando el evento necesita explicación.',
      hijos: [VistaCodigo({
        vista: fila(
          Boton({ texto: 'Pago confirmado', variante: 'success', onClick: () =>
            notificar.exito('Tu suscripción Pro está activa hasta el 7 de junio.', {
              titulo: 'Pago procesado · $19',
            }) }),
          Boton({ texto: 'Error de validación', variante: 'danger', onClick: () =>
            notificar.error('El email "test@" no es válido. Revisa el formato y vuelve a intentar.', {
              titulo: 'Formulario incompleto',
            }) }),
          Boton({ texto: 'Mantenimiento', variante: 'secondary', onClick: () =>
            notificar.info('El sistema estará offline el sábado de 02:00 a 04:00 (UTC).', {
              titulo: 'Mantenimiento programado',
            }) }),
        ),
        codigo: `notificar.exito('Tu suscripción Pro está activa…', {
  titulo: 'Pago procesado · $19',
})

notificar.error('El email "test@" no es válido.', {
  titulo: 'Formulario incompleto',
})`,
      })],
    }),

    // ============== 3. CON BARRA DE COUNTDOWN ==============
    Seccion({
      titulo: '3 · Con barra de countdown (pausa al hover)',
      descripcion: '`progreso: true` añade una barra inferior que se reduce mientras corre el timer. Pasa el mouse sobre el toast → la animación se pausa (no desaparece mientras lo lees).',
      hijos: [VistaCodigo({
        vista: fila(
          Boton({ texto: 'Toast con progreso', variante: 'primary', onClick: () =>
            notificar.exito('Pasa el mouse sobre el toast para pausar el countdown.', {
              titulo: 'Pausa al hover',
              progreso: true,
              duracion: 5000,
            }) }),
          Boton({ texto: 'Lento (10s)', variante: 'secondary', onClick: () =>
            notificar.info('Este toast dura 10 segundos.', { progreso: true, duracion: 10000 }) }),
        ),
        codigo: `notificar.exito('Pasa el mouse para pausar', {
  titulo: 'Pausa al hover',
  progreso: true,                         // ← barra inferior animada
  duracion: 5000,
})

// CSS: .toast--hover .toast__progreso { animation-play-state: paused; }`,
      })],
    }),

    // ============== 4. CON ACCIONES (UNDO / VER) ==============
    Seccion({
      titulo: '4 · Con acciones inline (Undo, Ver detalle)',
      descripcion: 'Patrón Gmail "Mensaje archivado · Deshacer". Botones inline que el usuario puede tocar antes que el toast desaparezca.',
      hijos: [VistaCodigo({
        vista: fila(
          Boton({ texto: 'Email archivado', variante: 'success', onClick: () =>
            notificar.exito('1 mensaje archivado.', {
              acciones: [
                { etiqueta: 'Deshacer', alClick: () => notificar.info('Restaurado a la bandeja') },
                { etiqueta: 'Ver',      alClick: () => notificar.info('Abriendo archivo…') },
              ],
              duracion: 6000,
              progreso: true,
            }) }),
          Boton({ texto: 'Eliminar proyecto', variante: 'danger', onClick: () =>
            notificar('Proyecto "Migration v2" enviado a papelera.', {
              tipo: 'warning',
              titulo: 'Eliminado',
              acciones: [
                { etiqueta: 'Deshacer', alClick: () => notificar.exito('Proyecto restaurado') },
                { etiqueta: 'Eliminar permanentemente', peligro: true, alClick: () => notificar.error('Eliminado para siempre') },
              ],
              duracion: 8000,
              progreso: true,
            }) }),
        ),
        codigo: `notificar.exito('1 mensaje archivado.', {
  acciones: [
    { etiqueta: 'Deshacer', alClick: () => restaurar() },
    { etiqueta: 'Ver',      alClick: () => abrir() },
  ],
  duracion: 6000,
  progreso: true,
})

// Acciones destructivas con peligro: true (color rojo)
{ etiqueta: 'Eliminar permanentemente', peligro: true, alClick: ... }`,
      })],
    }),

    // ============== 5. POSICIONES ==============
    Seccion({
      titulo: '5 · 6 posiciones disponibles',
      descripcion: 'Cada posición tiene su propia animación direccional (slides desde el borde). Default: `bottom-right`. Para apps móviles `top-center` funciona mejor; para success al guardar suele usarse `top-right`.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-2)' } }, [
          Boton({ texto: '↖ Top-left',     variante: 'secondary', onClick: () => notificar.info('Aparece arriba-izquierda', { posicion: 'top-left' }) }),
          Boton({ texto: '↑ Top-center',   variante: 'secondary', onClick: () => notificar.info('Aparece arriba-centro',   { posicion: 'top-center' }) }),
          Boton({ texto: '↗ Top-right',    variante: 'secondary', onClick: () => notificar.info('Aparece arriba-derecha',  { posicion: 'top-right' }) }),
          Boton({ texto: '↙ Bottom-left',  variante: 'secondary', onClick: () => notificar.info('Aparece abajo-izquierda', { posicion: 'bottom-left' }) }),
          Boton({ texto: '↓ Bottom-center', variante: 'secondary', onClick: () => notificar.info('Aparece abajo-centro',  { posicion: 'bottom-center' }) }),
          Boton({ texto: '↘ Bottom-right (default)', variante: 'primary', onClick: () => notificar.info('Aparece abajo-derecha (default)') }),
        ]),
        codigo: `notificar.info('Mensaje', { posicion: 'top-right' })

// 6 posiciones disponibles:
//   top-left · top-center · top-right
//   bottom-left · bottom-center · bottom-right (default)`,
      })],
    }),

    // ============== 6. CARGANDO + PROMESA ==============
    Seccion({
      titulo: '6 · Loading + promesa (auto-toggle)',
      descripcion: '`notificar.cargando()` lanza un toast con spinner sin auto-cierre. `notificar.promesa()` recibe una Promise y muestra "cargando…" → cambia a "éxito ✓" si resuelve o "error ×" si rechaza. Patrón usado por Vercel CLI / Linear / Stripe Dashboard.',
      hijos: [VistaCodigo({
        vista: fila(
          Boton({ texto: 'Loading básico (3s)', variante: 'primary', onClick: () => {
            const cerrar = notificar.cargando('Subiendo archivo…');
            setTimeout(() => { cerrar(); notificar.exito('Archivo subido correctamente'); }, 3000);
          } }),
          Boton({ texto: 'Promesa exitosa', variante: 'success', onClick: () => {
            notificar.promesa(
              new Promise((res) => setTimeout(() => res({ count: 142 }), 2200)),
              {
                cargando: 'Sincronizando con el servidor…',
                exito: ({ count }) => `Sincronizados ${count} registros`,
                error: 'Falló la sincronización',
              },
            );
          } }),
          Boton({ texto: 'Promesa fallida', variante: 'danger', onClick: () => {
            notificar.promesa(
              new Promise((_, rej) => setTimeout(() => rej(new Error('Timeout')), 2200)),
              { cargando: 'Conectando…', exito: 'Conectado', error: 'No se pudo conectar — timeout' },
            ).catch(() => {});
          } }),
        ),
        codigo: `// Loading manual
const cerrar = notificar.cargando('Subiendo archivo…');
await fetch(...);
cerrar();
notificar.exito('Archivo subido');

// Promesa — auto-toggle según resolve/reject
notificar.promesa(
  fetch('/api/sync').then(r => r.json()),
  {
    cargando: 'Sincronizando…',
    exito: ({ count }) => \`Sincronizados \${count} registros\`,
    error: 'Falló la sincronización',
  },
);`,
      })],
    }),

    // ============== 7. CON AVATAR (mensajes de usuario) ==============
    Seccion({
      titulo: '7 · Con avatar (mensaje de usuario)',
      descripcion: 'En vez del icono semántico, mostramos el avatar de la persona/servicio. Patrón Slack/Discord — notificación de un mensaje recibido.',
      hijos: [VistaCodigo({
        vista: fila(
          Boton({ texto: 'Mensaje de María', variante: 'secondary', onClick: () =>
            notificar('"Le agregué validación al form. ¿Lo revisamos juntos antes del merge?"', {
              titulo: 'María García te mencionó',
              avatar: Avatar({ nombre: 'María García', src: FOTO(1), tamano: 'md' }),
              acciones: [
                { etiqueta: 'Responder', alClick: () => {} },
                { etiqueta: 'Ver hilo',  alClick: () => {} },
              ],
              duracion: 8000,
              progreso: true,
            }) }),
          Boton({ texto: 'Solicitud de PR', variante: 'secondary', onClick: () =>
            notificar('Sara Chen pidió tu review en #142 — feat(auth): OAuth providers', {
              titulo: 'Review requested',
              avatar: Avatar({ nombre: 'Sara Chen', src: FOTO(2), tamano: 'md' }),
              acciones: [{ etiqueta: 'Revisar PR', alClick: () => {} }],
              duracion: 7000,
            }) }),
        ),
        codigo: `notificar('"Le agregué validación…"', {
  titulo: 'María García te mencionó',
  avatar: Avatar({ nombre, src, tamano: 'md' }),    // ← reemplaza el icono
  acciones: [{ etiqueta: 'Responder', alClick: ... }],
})`,
      })],
    }),

    // ============== 8. CON IMAGEN (e-commerce / order) ==============
    Seccion({
      titulo: '8 · Con imagen preview (e-commerce)',
      descripcion: '`imagen` agrega una thumbnail cuadrada (44px) al lado derecho. Patrón Amazon "Producto añadido al carrito" / Shopify order alerts.',
      hijos: [VistaCodigo({
        vista: fila(
          Boton({ texto: 'Añadido al carrito', variante: 'success', onClick: () =>
            notificar.exito('Sneakers Air Run · Talla 42', {
              titulo: 'Añadido al carrito',
              imagen: crearEl('img', { src: PROD(3), alt: '' }),
              acciones: [
                { etiqueta: 'Ver carrito',     alClick: () => {} },
                { etiqueta: 'Seguir comprando', alClick: () => {} },
              ],
              duracion: 6000,
              progreso: true,
            }) }),
          Boton({ texto: 'Pedido enviado', variante: 'primary', onClick: () =>
            notificar('Tu pedido #LP-2026-0428 está en camino. Llega entre el 9 y el 11 de mayo.', {
              titulo: 'Pedido enviado',
              imagen: crearEl('img', { src: PROD(1), alt: '' }),
              tipo: 'info',
              acciones: [{ etiqueta: 'Trackear', alClick: () => {} }],
              duracion: 7000,
            }) }),
        ),
        codigo: `notificar.exito('Sneakers Air Run · Talla 42', {
  titulo: 'Añadido al carrito',
  imagen: crearEl('img', { src: '/products/sneakers.jpg' }),  // ← thumb 44px
  acciones: [
    { etiqueta: 'Ver carrito',     alClick: () => {} },
    { etiqueta: 'Seguir comprando', alClick: () => {} },
  ],
})`,
      })],
    }),

    // ============== 9. PERSISTENTE (sin auto-cierre) ==============
    Seccion({
      titulo: '9 · Persistente (no auto-cierre)',
      descripcion: '`duracion: 0` deshabilita el auto-cierre. Para errores críticos o avisos que requieren acción del usuario obligatoria.',
      hijos: [VistaCodigo({
        vista: fila(
          Boton({ texto: 'Error crítico (persistente)', variante: 'danger', onClick: () =>
            notificar.error('La conexión con el servidor se perdió. Tus cambios no se han guardado.', {
              titulo: 'Sin conexión',
              duracion: 0,
              acciones: [
                { etiqueta: 'Reintentar',  alClick: () => notificar.exito('Conectado de nuevo') },
                { etiqueta: 'Trabajar offline', alClick: () => {} },
              ],
            }) }),
          Boton({ texto: 'Sesión por expirar', variante: 'warning', onClick: () =>
            notificar.advertencia('Tu sesión expira en 5 minutos. Guarda tus cambios o renueva ahora.', {
              titulo: 'Sesión por expirar',
              duracion: 0,
              acciones: [
                { etiqueta: 'Renovar sesión', alClick: () => notificar.exito('Sesión extendida 1 hora más') },
              ],
            }) }),
        ),
        codigo: `notificar.error('La conexión se perdió.', {
  titulo: 'Sin conexión',
  duracion: 0,                              // ← no auto-cierre
  acciones: [
    { etiqueta: 'Reintentar', alClick: reconectar },
  ],
})`,
      })],
    }),

    // ============== 10. APILABLES + STRESS TEST ==============
    Seccion({
      titulo: '10 · Apilables (stress test)',
      descripcion: 'Múltiples toasts se apilan automáticamente. Cada uno con su propia animación, countdown y posición de spawn.',
      hijos: [VistaCodigo({
        vista: fila(
          Boton({ texto: 'Subir 5 archivos', variante: 'primary', onClick: () => {
            ['mockup-1.png', 'mockup-2.png', 'mockup-3.png', 'roadmap-q3.pdf', 'kpis.xlsx'].forEach((m, i) => {
              setTimeout(() => notificar.info(`Subiendo ${m}…`, { progreso: true }), i * 280);
            });
            setTimeout(() => notificar.exito('5 archivos subidos correctamente', { progreso: true }), 1800);
          } }),
          Boton({ texto: 'Mix de tipos', variante: 'secondary', onClick: () => {
            notificar.info('Conectando…');
            setTimeout(() => notificar.exito('Conectado'), 600);
            setTimeout(() => notificar.advertencia('Latencia alta detectada'), 1200);
            setTimeout(() => notificar.error('Reconectando — perdimos paquetes'), 1800);
          } }),
        ),
        codigo: `// Apilables — cada toast es independiente
['archivo-1', 'archivo-2', 'archivo-3'].forEach((name, i) => {
  setTimeout(() => notificar.info(\`Subiendo \${name}…\`), i * 300);
});

// Cuando termina:
notificar.exito('Subida completa');`,
      })],
    }),

  ],
});
