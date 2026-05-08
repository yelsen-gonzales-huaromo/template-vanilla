import { crearEl } from '../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { Avatar } from '../../../components/ui/avatar/avatar.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { corner7 } from '../../../components/ui/card/card-decoraciones.js';

const fila = (...nodos) => crearEl('div', {
  style: { display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' },
}, nodos);

// Para los demos con foto real, usamos las imágenes del catálogo de Falcon
const FOTO = (n) => `./public/img/team/${n}.jpg`;

export default async () => PaginaShowcase({
  titulo: 'Avatares',
  descripcion: 'Representación visual del usuario — iniciales coloreadas o foto. 6 tamaños, 2 formas (circular / cuadrado), indicador de estado (online / ausente / ocupado / offline), badge superpuesto, ring de selección, color auto-asignado por hash del nombre y skeleton de carga.',
  decoracion: corner7(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    // ============== TAMAÑOS ==============
    Seccion({
      titulo: '1 · Tamaños',
      descripcion: '6 tamaños — `xs` (24px), `sm` (28px), `md` (40px, default), `lg` (56px), `xl` (80px), `2xl` (112px). El tamaño de la fuente se calcula automáticamente.',
      hijos: [VistaCodigo({
        vista: fila(
          Avatar({ nombre: 'Ana Becker',         tamano: 'xs' }),
          Avatar({ nombre: 'Carlos Diaz',         tamano: 'sm' }),
          Avatar({ nombre: 'Eva Fernández',       tamano: 'md' }),
          Avatar({ nombre: 'Gonzalo Hernández',   tamano: 'lg' }),
          Avatar({ nombre: 'Inés Jiménez',        tamano: 'xl' }),
          Avatar({ nombre: 'Karla López',         tamano: '2xl' }),
        ),
        codigo: `Avatar({ nombre: 'Ana Becker',  tamano: 'xs' })   // 24px
Avatar({ nombre: 'Carlos Diaz', tamano: 'sm' })   // 28px
Avatar({ nombre: 'Eva F.',      tamano: 'md' })   // 40px (default)
Avatar({ nombre: 'Gonzalo H.',  tamano: 'lg' })   // 56px
Avatar({ nombre: 'Inés J.',     tamano: 'xl' })   // 80px
Avatar({ nombre: 'Karla L.',    tamano: '2xl' })  // 112px`,
      })],
    }),

    // ============== COLOR POR HASH ==============
    Seccion({
      titulo: '2 · Color por hash del nombre',
      descripcion: 'Cuando no hay imagen, el gradient se asigna determinísticamente según el hash del nombre — la misma persona siempre tiene el mismo color sin tener que guardarlo. 8 gradientes en la paleta.',
      hijos: [VistaCodigo({
        vista: fila(
          ...['Ana Becker', 'Carlos Diaz', 'Eva Fernández', 'Gonzalo Hernández',
              'Inés Jiménez', 'Karla López', 'Marcos Núñez', 'Olga Pérez',
              'Quique Ramírez', 'Sofía Torres', 'Ulises Vega', 'Wendy Yáñez']
            .map((n) => Avatar({ nombre: n, tamano: 'lg' })),
        ),
        codigo: `// El gradient sale de un hash del nombre — consistente sin storage
Avatar({ nombre: 'Ana Becker' })       // → gradient cyan→azul
Avatar({ nombre: 'Eva Fernández' })    // → gradient amarillo→naranja
// (mismo nombre = mismo color, siempre)`,
      })],
    }),

    // ============== CON FOTO ==============
    Seccion({
      titulo: '3 · Con foto',
      descripcion: 'Si pasas `src`, se usa la foto. Si la imagen falla, el browser muestra el `alt` (que cae al `nombre`) — pero NO hace fallback a iniciales (sería un re-render).',
      hijos: [VistaCodigo({
        vista: fila(
          Avatar({ nombre: 'María García', src: FOTO(1), tamano: 'lg' }),
          Avatar({ nombre: 'Sara Chen',    src: FOTO(2), tamano: 'lg' }),
          Avatar({ nombre: 'Marcus Lee',   src: FOTO(3), tamano: 'lg' }),
          Avatar({ nombre: 'Lina Park',    src: FOTO(4), tamano: 'lg' }),
          Avatar({ nombre: 'Sin foto',     tamano: 'lg' }),
        ),
        codigo: `Avatar({ nombre: 'María García', src: '/img/team/1.jpg', tamano: 'lg' })`,
      })],
    }),

    // ============== ESTADO (presencia) ==============
    Seccion({
      titulo: '4 · Estado (online / ausente / ocupado / offline)',
      descripcion: 'Dot indicator en la esquina inferior derecha — patrón Slack / Discord para presencia en tiempo real. Verde = online, naranja = ausente, rojo = ocupado, gris = offline.',
      hijos: [VistaCodigo({
        vista: fila(
          Avatar({ nombre: 'María',  src: FOTO(1), tamano: 'lg', estado: 'online' }),
          Avatar({ nombre: 'Sara',   src: FOTO(2), tamano: 'lg', estado: 'ausente' }),
          Avatar({ nombre: 'Marcus', src: FOTO(3), tamano: 'lg', estado: 'ocupado' }),
          Avatar({ nombre: 'Lina',   src: FOTO(4), tamano: 'lg', estado: 'offline' }),
          // sin foto + estado
          Avatar({ nombre: 'Quique Ramírez', tamano: 'lg', estado: 'online' }),
        ),
        codigo: `Avatar({ nombre, src, tamano: 'lg',
  estado: 'online'    // verde
})

// Variantes: 'online' | 'ausente' | 'ocupado' | 'offline'`,
      })],
    }),

    // ============== BADGE OVERLAY ==============
    Seccion({
      titulo: '5 · Con badge superpuesto',
      descripcion: 'Para mostrar count de notificaciones, mensajes nuevos, o ícono de acción. El `badge` acepta cualquier nodo — número, ícono, emoji.',
      hijos: [VistaCodigo({
        vista: fila(
          Avatar({ nombre: 'María', src: FOTO(1), tamano: 'lg', badge: '3' }),
          Avatar({ nombre: 'Sara',  src: FOTO(2), tamano: 'lg', badge: '12' }),
          Avatar({ nombre: 'Marcus', src: FOTO(3), tamano: 'lg', badge: '99+' }),
          Avatar({ nombre: 'Lina', src: FOTO(4), tamano: 'lg',
            badge: Icono('mas', { tamano: 12 }) }),
          Avatar({ nombre: 'Karla', tamano: 'lg', badge: '⭐' }),
        ),
        codigo: `Avatar({ nombre, src, badge: '3' })                    // count
Avatar({ nombre, src, badge: Icono('mas', { tamano: 12 }) }) // ícono
Avatar({ nombre, src, badge: '⭐' })                          // emoji`,
      })],
    }),

    // ============== FORMA CUADRADA ==============
    Seccion({
      titulo: '6 · Forma circular vs cuadrada',
      descripcion: 'Para personas usa `circular` (default — humano). Para entidades (empresas, workspaces, productos) usa `cuadrado` con border-radius suave — sensación de "logo".',
      hijos: [VistaCodigo({
        vista: fila(
          // Circular (personas)
          Avatar({ nombre: 'Ana Becker',  tamano: 'lg' }),
          Avatar({ nombre: 'Carlos Diaz', tamano: 'lg' }),
          // Cuadrado (entidades)
          Avatar({ nombre: 'Acme',         tamano: 'lg', forma: 'cuadrado' }),
          Avatar({ nombre: 'Linear',       tamano: 'lg', forma: 'cuadrado' }),
          Avatar({ nombre: 'Vercel',       tamano: 'lg', forma: 'cuadrado' }),
          Avatar({ nombre: 'Notion',       tamano: 'lg', forma: 'cuadrado' }),
        ),
        codigo: `Avatar({ nombre: 'Ana',     tamano: 'lg' })                       // circular
Avatar({ nombre: 'Acme',    tamano: 'lg', forma: 'cuadrado' })       // workspace`,
      })],
    }),

    // ============== RING (seleccionado) ==============
    Seccion({
      titulo: '7 · Ring (seleccionado / activo)',
      descripcion: '`ring: true` agrega un borde primary alrededor — útil para indicar selección en pickers, miembros activos, o el avatar del usuario actual.',
      hijos: [VistaCodigo({
        vista: fila(
          Avatar({ nombre: 'Ana B.',   tamano: 'lg', ring: true }),
          Avatar({ nombre: 'Carlos D.', tamano: 'lg' }),
          Avatar({ nombre: 'Eva F.',    tamano: 'lg' }),
          Avatar({ nombre: 'Gonzalo H.', tamano: 'lg' }),
          Avatar({ nombre: 'Inés J.',   tamano: 'lg' }),
        ),
        codigo: `Avatar({ nombre, tamano: 'lg', ring: true })
// box-shadow doble — gap interno + borde primary externo`,
      })],
    }),

    // ============== STACK / GRUPO ==============
    Seccion({
      titulo: '8 · Stack — grupo de colaboradores',
      descripcion: 'Para mostrar varios miembros en poco espacio. El último avatar se superpone con margin negativo. Hover eleva al primer plano. El "+N más" indica miembros ocultos.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' } }, [
          // Stack de fotos
          crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)' } }, [
            crearEl('div', { class: 'avatar-stack' }, [
              Avatar({ nombre: 'María',  src: FOTO(1), tamano: 'md' }),
              Avatar({ nombre: 'Sara',   src: FOTO(2), tamano: 'md' }),
              Avatar({ nombre: 'Marcus', src: FOTO(3), tamano: 'md' }),
              Avatar({ nombre: 'Lina',   src: FOTO(4), tamano: 'md' }),
              Avatar({ nombre: '+ 12', tamano: 'md', coloreado: 'manual' }),
            ]),
            crearEl('span', { style: { fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' } },
              ['Equipo de diseño · 16 personas']),
          ]),
          // Stack con iniciales (sin fotos)
          crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)' } }, [
            crearEl('div', { class: 'avatar-stack' }, [
              Avatar({ nombre: 'Ana Becker',         tamano: 'sm' }),
              Avatar({ nombre: 'Carlos Diaz',        tamano: 'sm' }),
              Avatar({ nombre: 'Eva Fernández',      tamano: 'sm' }),
              Avatar({ nombre: 'Gonzalo Hernández',  tamano: 'sm' }),
            ]),
            crearEl('span', { style: { fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' } },
              ['Asignados · 4 personas']),
          ]),
        ]),
        codigo: `crearEl('div', { class: 'avatar-stack' }, [
  Avatar({ nombre: 'María',  src: FOTO(1) }),
  Avatar({ nombre: 'Sara',   src: FOTO(2) }),
  Avatar({ nombre: 'Marcus', src: FOTO(3) }),
  Avatar({ nombre: 'Lina',   src: FOTO(4) }),
  Avatar({ nombre: '+ 12' }),
])`,
      })],
    }),

    // ============== SKELETON ==============
    Seccion({
      titulo: '9 · Skeleton (loading)',
      descripcion: 'Mientras la foto carga o el usuario aún no se resolvió, muestra un placeholder con shimmer animation. Usa la clase `avatar--skeleton` directamente.',
      hijos: [VistaCodigo({
        vista: fila(
          crearEl('span', { class: 'avatar avatar--skeleton avatar--sm' }),
          crearEl('span', { class: 'avatar avatar--skeleton' }),
          crearEl('span', { class: 'avatar avatar--skeleton avatar--lg' }),
          crearEl('span', { class: 'avatar avatar--skeleton avatar--xl' }),
          crearEl('span', { class: 'avatar avatar--skeleton avatar--2xl' }),
        ),
        codigo: `crearEl('span', { class: 'avatar avatar--skeleton avatar--lg' })
// gradient horizontal animado en loop`,
      })],
    }),

  ],
});
