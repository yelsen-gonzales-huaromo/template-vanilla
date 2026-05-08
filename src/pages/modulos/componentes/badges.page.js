import { crearEl } from '../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { Insignia } from '../../../components/ui/badge/badge.js';
import { Avatar } from '../../../components/ui/avatar/avatar.js';
import { Boton } from '../../../components/ui/button/button.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { corner3 } from '../../../components/ui/card/card-decoraciones.js';

const fila = (...n) => crearEl('div', {
  style: { display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', alignItems: 'center' },
}, n);

const filaG = (...n) => crearEl('div', {
  style: { display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' },
}, n);

export default async () => PaginaShowcase({
  titulo: 'Insignias',
  descripcion: 'Etiquetas pequeñas para destacar estado, conteos o categorías. 7 variantes × 3 estilos × 3 tamaños, con soporte de iconos, punto de estado, pulso animado, contador numérico y descarte.',
  decoracion: corner3(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    // ============== 7 VARIANTES SEMÁNTICAS ==============
    Seccion({
      titulo: '7 variantes semánticas',
      descripcion: 'Cada variante usa un color del sistema. La default queda en gris neutral.',
      hijos: [VistaCodigo({
        vista: fila(
          Insignia({ texto: 'Default' }),
          Insignia({ texto: 'Primary', variante: 'primary' }),
          Insignia({ texto: 'Success', variante: 'success' }),
          Insignia({ texto: 'Warning', variante: 'warning' }),
          Insignia({ texto: 'Danger',  variante: 'danger' }),
          Insignia({ texto: 'Info',    variante: 'info' }),
          Insignia({ texto: 'Muted',   variante: 'muted' }),
        ),
        codigo: `Insignia({ texto: 'Default' })
Insignia({ texto: 'Primary', variante: 'primary' })
Insignia({ texto: 'Success', variante: 'success' })
Insignia({ texto: 'Warning', variante: 'warning' })
Insignia({ texto: 'Danger',  variante: 'danger' })
Insignia({ texto: 'Info',    variante: 'info' })
Insignia({ texto: 'Muted',   variante: 'muted' })`,
      })],
    }),

    // ============== 3 ESTILOS ==============
    Seccion({
      titulo: '3 estilos visuales',
      descripcion: 'Soft (default), Sólido (fondo lleno), Outline (sólo borde).',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
          fila(
            crearEl('span', { style: { color: 'var(--muted-foreground)', minWidth: '70px', fontSize: 'var(--text-xs)' } }, ['Soft:']),
            Insignia({ texto: 'Primary', variante: 'primary' }),
            Insignia({ texto: 'Success', variante: 'success' }),
            Insignia({ texto: 'Warning', variante: 'warning' }),
            Insignia({ texto: 'Danger',  variante: 'danger' }),
            Insignia({ texto: 'Info',    variante: 'info' }),
          ),
          fila(
            crearEl('span', { style: { color: 'var(--muted-foreground)', minWidth: '70px', fontSize: 'var(--text-xs)' } }, ['Sólido:']),
            Insignia({ texto: 'Primary', variante: 'primary', estilo: 'solido' }),
            Insignia({ texto: 'Success', variante: 'success', estilo: 'solido' }),
            Insignia({ texto: 'Warning', variante: 'warning', estilo: 'solido' }),
            Insignia({ texto: 'Danger',  variante: 'danger',  estilo: 'solido' }),
            Insignia({ texto: 'Info',    variante: 'info',    estilo: 'solido' }),
          ),
          fila(
            crearEl('span', { style: { color: 'var(--muted-foreground)', minWidth: '70px', fontSize: 'var(--text-xs)' } }, ['Outline:']),
            Insignia({ texto: 'Primary', variante: 'primary', estilo: 'outline' }),
            Insignia({ texto: 'Success', variante: 'success', estilo: 'outline' }),
            Insignia({ texto: 'Warning', variante: 'warning', estilo: 'outline' }),
            Insignia({ texto: 'Danger',  variante: 'danger',  estilo: 'outline' }),
            Insignia({ texto: 'Info',    variante: 'info',    estilo: 'outline' }),
          ),
        ]),
        codigo: `Insignia({ texto: '...', variante: 'success', estilo: 'soft' })    // default
Insignia({ texto: '...', variante: 'success', estilo: 'solido' })
Insignia({ texto: '...', variante: 'success', estilo: 'outline' })`,
      })],
    }),

    // ============== TAMAÑOS ==============
    Seccion({
      titulo: 'Tres tamaños',
      hijos: [VistaCodigo({
        vista: filaG(
          Insignia({ texto: 'XS', variante: 'primary', tamano: 'xs' }),
          Insignia({ texto: 'SM (default)', variante: 'primary', tamano: 'sm' }),
          Insignia({ texto: 'MD', variante: 'primary', tamano: 'md' }),
        ),
        codigo: `Insignia({ texto: 'XS', tamano: 'xs' })
Insignia({ texto: 'SM', tamano: 'sm' })  // default
Insignia({ texto: 'MD', tamano: 'md' })`,
      })],
    }),

    // ============== FORMA ==============
    Seccion({
      titulo: 'Forma',
      descripcion: 'Pill (default) o cuadrada con esquinas suaves.',
      hijos: [VistaCodigo({
        vista: filaG(
          Insignia({ texto: 'Pill', variante: 'primary' }),
          Insignia({ texto: 'Cuadrada', variante: 'primary', forma: 'cuadrada' }),
          Insignia({ texto: 'BETA', variante: 'warning', forma: 'cuadrada', tamano: 'xs' }),
          Insignia({ texto: 'v1.2.3', variante: 'muted', forma: 'cuadrada' }),
        ),
        codigo: `Insignia({ texto: 'Pill', forma: 'pill' })            // default
Insignia({ texto: 'Cuadrada', forma: 'cuadrada' })
Insignia({ texto: 'BETA', forma: 'cuadrada', tamano: 'xs' })`,
      })],
    }),

    // ============== CON PUNTO ==============
    Seccion({
      titulo: 'Con punto indicador',
      descripcion: 'Estado en línea: en vivo, ocupado, ausente, sin red.',
      hijos: [VistaCodigo({
        vista: fila(
          Insignia({ texto: 'En vivo',  variante: 'success', punto: true }),
          Insignia({ texto: 'Ocupado',  variante: 'danger',  punto: true }),
          Insignia({ texto: 'Ausente',  variante: 'warning', punto: true }),
          Insignia({ texto: 'Sin red',  variante: 'muted',   punto: true }),
          Insignia({ texto: 'Online',   variante: 'success', punto: true, estilo: 'outline' }),
        ),
        codigo: `Insignia({ texto: 'En vivo', variante: 'success', punto: true })
Insignia({ texto: 'Ocupado', variante: 'danger',  punto: true })`,
      })],
    }),

    // ============== PULSANTE (LIVE) ==============
    Seccion({
      titulo: 'Pulsante (live status)',
      descripcion: '`pulsante: true` añade una onda animada al punto — ideal para indicar estados en tiempo real.',
      hijos: [VistaCodigo({
        vista: filaG(
          Insignia({ texto: 'En vivo',     variante: 'success', punto: true, pulsante: true }),
          Insignia({ texto: 'Streaming',   variante: 'danger',  punto: true, pulsante: true, tamano: 'md' }),
          Insignia({ texto: 'Sincronizando',variante: 'info',   punto: true, pulsante: true }),
          Insignia({ texto: 'Procesando',  variante: 'warning', punto: true, pulsante: true }),
        ),
        codigo: `Insignia({ texto: 'En vivo', variante: 'success', punto: true, pulsante: true })
// El punto pulsa con una onda de color que se expande`,
      })],
    }),

    // ============== CON ICONO ==============
    Seccion({
      titulo: 'Con icono',
      descripcion: 'Cualquier nodo (típicamente un Icono) a la izquierda del texto.',
      hijos: [VistaCodigo({
        vista: filaG(
          Insignia({ texto: 'Verificado',  variante: 'success', icono: Icono('check', { tamano: 12 }) }),
          Insignia({ texto: 'Premium',     variante: 'warning', icono: Icono('estrella', { tamano: 12 }) }),
          Insignia({ texto: 'Privado',     variante: 'muted',   icono: Icono('candado', { tamano: 12 }) }),
          Insignia({ texto: 'Tendencia',   variante: 'danger',  icono: Icono('flecha_r', { tamano: 12 }) }),
          Insignia({ texto: 'Pro',         variante: 'primary', estilo: 'solido', icono: Icono('estrella', { tamano: 12 }) }),
        ),
        codigo: `Insignia({ texto: 'Verificado', variante: 'success', icono: Icono('check') })
Insignia({ texto: 'Premium',    variante: 'warning', icono: Icono('estrella') })
Insignia({ texto: 'Pro',        estilo: 'solido', icono: Icono('estrella') })`,
      })],
    }),

    // ============== CONTADOR NUMÉRICO ==============
    Seccion({
      titulo: 'Contador numérico',
      descripcion: '`contador: true` los hace circulares y compactos — perfectos para badges de notificaciones.',
      hijos: [VistaCodigo({
        vista: filaG(
          // Contador puro
          Insignia({ texto: '8',   variante: 'danger',  estilo: 'solido', contador: true }),
          Insignia({ texto: '24',  variante: 'primary', estilo: 'solido', contador: true }),
          Insignia({ texto: '99+', variante: 'warning', estilo: 'solido', contador: true }),
          Insignia({ texto: '3',   variante: 'success', estilo: 'solido', contador: true, tamano: 'md' }),
          // Sobre avatar
          crearEl('div', { style: { position: 'relative', display: 'inline-block' } }, [
            Avatar({ nombre: 'María L.', tamano: 'md' }),
            crearEl('span', { style: { position: 'absolute', top: '-4px', right: '-4px' } }, [
              Insignia({ texto: '7', variante: 'danger', estilo: 'solido', contador: true, tamano: 'xs' }),
            ]),
          ]),
          // Sobre boton
          crearEl('div', { style: { position: 'relative', display: 'inline-block' } }, [
            Boton({ icono: Icono('campana', { tamano: 16 }), variante: 'secondary', 'aria-label': 'Notificaciones' }),
            crearEl('span', { style: { position: 'absolute', top: '-4px', right: '-4px' } }, [
              Insignia({ texto: '12', variante: 'danger', estilo: 'solido', contador: true, tamano: 'xs' }),
            ]),
          ]),
        ),
        codigo: `Insignia({ texto: '8',   contador: true, estilo: 'solido', variante: 'danger' })
Insignia({ texto: '99+', contador: true, estilo: 'solido', variante: 'warning' })

// Sobre avatar / botón
crearEl('div', { style: { position: 'relative' } }, [
  Avatar({ ... }),
  crearEl('span', { style: { position: 'absolute', top: -4, right: -4 } }, [
    Insignia({ texto: '7', contador: true, tamano: 'xs' }),
  ]),
])`,
      })],
    }),

    // ============== DESCARTABLES ==============
    Seccion({
      titulo: 'Descartables (con ✕)',
      descripcion: '`descartable: true` añade un botón pequeño que las elimina con animación. Útil para chips/tags removibles.',
      hijos: [VistaCodigo({
        vista: fila(
          Insignia({ texto: 'JavaScript', variante: 'primary', descartable: true }),
          Insignia({ texto: 'TypeScript', variante: 'info',    descartable: true }),
          Insignia({ texto: 'React',      variante: 'success', descartable: true }),
          Insignia({ texto: 'Node',       variante: 'warning', descartable: true }),
          Insignia({ texto: 'Tag', tamano: 'md', variante: 'primary', estilo: 'solido', descartable: true }),
        ),
        codigo: `Insignia({
  texto: 'JavaScript',
  variante: 'primary',
  descartable: true,
  alDescartar: () => console.log('quitada'),
})`,
      })],
    }),

    // ============== EN CONTEXTO ==============
    Seccion({
      titulo: 'En contexto',
      descripcion: 'Las insignias funcionan bien dentro de texto, listas, headers, botones.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
          fila(
            crearEl('span', null, ['Notificaciones ']),
            Insignia({ texto: '8', variante: 'danger', estilo: 'solido', contador: true }),
          ),
          fila(
            crearEl('span', null, ['Plan ']),
            Insignia({ texto: 'PRO', variante: 'primary', icono: Icono('estrella', { tamano: 12 }) }),
          ),
          fila(
            crearEl('span', null, ['Versión ']),
            Insignia({ texto: 'v1.2.3-beta', variante: 'muted', forma: 'cuadrada' }),
          ),
          fila(
            crearEl('span', null, ['Estado del servicio ']),
            Insignia({ texto: 'Operacional', variante: 'success', punto: true, pulsante: true }),
          ),
          fila(
            crearEl('h3', { style: { margin: 0, fontSize: 'var(--text-base)' } }, ['Mi proyecto ']),
            Insignia({ texto: 'NUEVO', variante: 'success', tamano: 'xs', forma: 'cuadrada' }),
            Insignia({ texto: 'Beta',  variante: 'warning', tamano: 'xs' }),
          ),
        ]),
        codigo: `// Inline con texto
crearEl('span', null, ['Notificaciones ',
  Insignia({ texto: '8', contador: true })])

// Junto a heading
crearEl('h3', null, ['Mi proyecto ',
  Insignia({ texto: 'NUEVO', tamano: 'xs' })])`,
      })],
    }),

    // ============== GALERÍA COMPLETA ==============
    Seccion({
      titulo: 'Combinaciones útiles',
      descripcion: 'Patrones reales que probablemente uses todos los días.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' } }, [
          filaG(
            Insignia({ texto: 'NUEVO',     variante: 'success', tamano: 'xs', forma: 'cuadrada' }),
            Insignia({ texto: 'BETA',      variante: 'warning', tamano: 'xs', forma: 'cuadrada' }),
            Insignia({ texto: 'DEPRECATED',variante: 'danger',  tamano: 'xs', forma: 'cuadrada' }),
            Insignia({ texto: 'PRO',       variante: 'primary', tamano: 'xs', forma: 'cuadrada', estilo: 'solido' }),
            Insignia({ texto: 'FREE',      variante: 'muted',   tamano: 'xs', forma: 'cuadrada' }),
          ),
          filaG(
            Insignia({ texto: 'En vivo',   variante: 'success', punto: true, pulsante: true }),
            Insignia({ texto: 'Privado',   variante: 'muted',   icono: Icono('candado', { tamano: 12 }) }),
            Insignia({ texto: 'Verificado',variante: 'info',    icono: Icono('check', { tamano: 12 }) }),
            Insignia({ texto: 'Trending',  variante: 'danger',  icono: Icono('estrella', { tamano: 12 }) }),
          ),
          filaG(
            Insignia({ texto: '12', contador: true, variante: 'danger', estilo: 'solido' }),
            Insignia({ texto: '99+', contador: true, variante: 'primary', estilo: 'solido' }),
            Insignia({ texto: '3', contador: true, variante: 'success', estilo: 'solido', tamano: 'md' }),
          ),
        ]),
        codigo: `// Etiquetas de status
Insignia({ texto: 'NUEVO',  forma: 'cuadrada', tamano: 'xs', variante: 'success' })
Insignia({ texto: 'BETA',   forma: 'cuadrada', tamano: 'xs', variante: 'warning' })

// Estados live
Insignia({ texto: 'En vivo', punto: true, pulsante: true, variante: 'success' })

// Contadores
Insignia({ texto: '99+', contador: true, estilo: 'solido', variante: 'primary' })`,
      })],
    }),
  ],
});
