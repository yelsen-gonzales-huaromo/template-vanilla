import { crearEl } from '../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import {
  Paginacion, InfoPaginacion, SelectorTamano, BarraPaginacion,
} from '../../../components/ui/pagination/pagination.js';
import { Avatar } from '../../../components/ui/avatar/avatar.js';
import { Insignia } from '../../../components/ui/badge/badge.js';
import { usarPaginacion } from '../../../hooks/usePagination.js';
import { corner1 } from '../../../components/ui/card/card-decoraciones.js';

const stack = (...n) => crearEl('div', {
  style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' },
}, n);

const fila = (...n) => crearEl('div', {
  style: { display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' },
}, n);

// ============================================================================
//  Helper — paginación + indicador de "Página X de Y · N elementos"
// ============================================================================
const conIndicador = (paginacion, total, vista) => {
  const indicador = crearEl('p', {
    style: { margin: 'var(--space-2) 0 0', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' },
  });
  efecto(() => {
    indicador.textContent = `Página ${paginacion.pagina.value} de ${paginacion.totalPaginas.value} · ${total} elementos`;
  });
  return crearEl('div', null, [vista, indicador]);
};

// ============================================================================
//  Demo: lista de usuarios paginada (caso de uso real con tabla)
// ============================================================================
const generarUsuarios = (n) => Array.from({ length: n }, (_, i) => ({
  id: i + 1,
  nombre: ['Ana Becker', 'Carlos Diaz', 'Eva Fernández', 'Gonzalo H.', 'Inés Jiménez',
           'Karla L.', 'Marcos N.', 'Olga Pérez', 'Quique R.', 'Sofía Torres'][i % 10],
  email: `usuario${i + 1}@template-vanilla.dev`,
  rol: ['Admin', 'Editor', 'Viewer'][i % 3],
  estado: i % 7 === 0 ? 'Inactivo' : 'Activo',
}));

const tablaUsuarios = () => {
  const TODOS = generarUsuarios(143);
  const paginacion = usarPaginacion({ total: TODOS.length, tamanoPagina: 10 });

  const tbody = crearEl('tbody');

  efecto(() => {
    const desde = paginacion.desplazamiento.value;
    const tam = paginacion.tamano.value;
    const slice = TODOS.slice(desde, desde + tam);
    tbody.replaceChildren(...slice.map((u) => crearEl('tr', null, [
      crearEl('td', null, [crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } }, [
        Avatar({ nombre: u.nombre, tamano: 'sm' }),
        crearEl('div', null, [
          crearEl('div', { style: { fontWeight: 600, fontSize: 'var(--text-sm)' } }, [u.nombre]),
          crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [u.email]),
        ]),
      ])]),
      crearEl('td', null, [u.rol]),
      crearEl('td', null, [Insignia({ texto: u.estado, variante: u.estado === 'Activo' ? 'success' : 'muted' })]),
    ])));
  });

  const tabla = crearEl('table', {
    style: {
      width: '100%', borderCollapse: 'collapse',
      fontSize: 'var(--text-sm)',
    },
  }, [
    crearEl('thead', { style: { textAlign: 'start' } }, [
      crearEl('tr', null, [
        crearEl('th', { style: { padding: 'var(--space-3)', borderBlockEnd: '1px solid var(--border)', textAlign: 'start', fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--muted-foreground)', letterSpacing: '0.06em' } }, ['Usuario']),
        crearEl('th', { style: { padding: 'var(--space-3)', borderBlockEnd: '1px solid var(--border)', textAlign: 'start', fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--muted-foreground)', letterSpacing: '0.06em' } }, ['Rol']),
        crearEl('th', { style: { padding: 'var(--space-3)', borderBlockEnd: '1px solid var(--border)', textAlign: 'start', fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--muted-foreground)', letterSpacing: '0.06em' } }, ['Estado']),
      ]),
    ]),
    tbody,
  ]);

  // Estilos extra para tbody filas
  efecto(() => {
    tbody.querySelectorAll('td').forEach((td) => {
      td.style.padding = 'var(--space-3)';
      td.style.borderBlockEnd = '1px solid var(--border)';
    });
  });

  return crearEl('div', {
    style: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
    },
  }, [
    tabla,
    crearEl('div', { style: { padding: '0 var(--space-3)' } }, [
      BarraPaginacion({ paginacion, opcionesTamano: [5, 10, 25, 50] }),
    ]),
  ]);
};

// ============================================================================
//  Página
// ============================================================================
export default async () => {
  // Crear instancias separadas para cada sección (cada una con su estado)
  const p1 = usarPaginacion({ total: 30, tamanoPagina: 10 });
  const p2 = usarPaginacion({ total: 250, tamanoPagina: 10, paginaInicial: 12 });
  const p3 = usarPaginacion({ total: 50, tamanoPagina: 5 });

  const pPills    = usarPaginacion({ total: 100, tamanoPagina: 10, paginaInicial: 4 });
  const pBordeada = usarPaginacion({ total: 100, tamanoPagina: 10, paginaInicial: 4 });
  const pSm = usarPaginacion({ total: 50, tamanoPagina: 10, paginaInicial: 2 });
  const pMd = usarPaginacion({ total: 50, tamanoPagina: 10, paginaInicial: 2 });
  const pLg = usarPaginacion({ total: 50, tamanoPagina: 10, paginaInicial: 2 });
  const pPrimUlt = usarPaginacion({ total: 500, tamanoPagina: 10, paginaInicial: 25 });
  const pSiblings = usarPaginacion({ total: 200, tamanoPagina: 10, paginaInicial: 10 });

  const pSimple = usarPaginacion({ total: 80, tamanoPagina: 10, paginaInicial: 3 });
  const pCompacta = usarPaginacion({ total: 500, tamanoPagina: 10, paginaInicial: 42 });

  const pSelector = usarPaginacion({ total: 145, tamanoPagina: 10 });
  const pInfo = usarPaginacion({ total: 145, tamanoPagina: 10, paginaInicial: 3 });

  const pBarra = usarPaginacion({ total: 245, tamanoPagina: 25 });

  return PaginaShowcase({
    titulo: 'Paginación',
    descripcion: 'Navegación entre páginas de un dataset largo. Hook reactivo `usarPaginacion()` + componente `Paginacion` con 4 variantes visuales (default · pills · bordeada · simple · compacta), 3 tamaños, jump-to-edge, selector de items por página, info textual y barra completa estilo tabla.',
    decoracion: corner1(),
    migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
    hijos: [

      // ============== 1. POCAS PÁGINAS ==============
      Seccion({
        titulo: '1 · Pocas páginas',
        descripcion: 'Cuando hay 7 páginas o menos, todas se muestran sin elipsis.',
        hijos: [VistaCodigo({
          vista: conIndicador(p1, 30, Paginacion({ paginacion: p1 })),
          codigo: `const paginacion = usarPaginacion({ total: 30, tamanoPagina: 10 });
Paginacion({ paginacion })

// Acceso al estado: paginacion.pagina.value, paginacion.desplazamiento.value
// Acciones: paginacion.siguiente() · anterior() · irA(n) · cambiarTamano(n)`,
        })],
      }),

      // ============== 2. MUCHAS PÁGINAS (ELIPSIS) ==============
      Seccion({
        titulo: '2 · Muchas páginas con elipsis',
        descripcion: 'Cuando hay más páginas de las que caben, se condensa con `…` mostrando primera, última, y vecinas de la actual.',
        hijos: [VistaCodigo({
          vista: conIndicador(p2, 250, Paginacion({ paginacion: p2 })),
          codigo: `usarPaginacion({ total: 250, tamanoPagina: 10, paginaInicial: 12 })

// Visual: 1 … 11 [12] 13 … 25
// Cuando estás cerca del inicio:  [1] 2 3 4 5 … 25
// Cuando estás cerca del final:   1 … 21 22 23 24 [25]`,
        })],
      }),

      // ============== 3. VARIANTES VISUALES ==============
      Seccion({
        titulo: '3 · Variantes visuales',
        descripcion: '`default` (botones cuadrados separados), `pills` (rounded), `bordeada` (un solo grupo unido tipo Bootstrap).',
        hijos: [VistaCodigo({
          vista: stack(
            crearEl('div', null, [
              crearEl('p', { style: { margin: '0 0 var(--space-2)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase' } }, ['Default']),
              Paginacion({ paginacion: p1 }),
            ]),
            crearEl('div', null, [
              crearEl('p', { style: { margin: '0 0 var(--space-2)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase' } }, ['Pills']),
              Paginacion({ paginacion: pPills, variante: 'pills' }),
            ]),
            crearEl('div', null, [
              crearEl('p', { style: { margin: '0 0 var(--space-2)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase' } }, ['Bordeada (grupo unido)']),
              Paginacion({ paginacion: pBordeada, variante: 'bordeada' }),
            ]),
          ),
          codigo: `Paginacion({ paginacion })                         // default — botones separados
Paginacion({ paginacion, variante: 'pills' })       // rounded
Paginacion({ paginacion, variante: 'bordeada' })    // un solo grupo unido`,
        })],
      }),

      // ============== 4. TAMAÑOS ==============
      Seccion({
        titulo: '4 · Tamaños',
        descripcion: '`sm` (28px) para tablas densas o footers, `md` (36px, default), `lg` (44px) para presentaciones o usuarios mayores.',
        hijos: [VistaCodigo({
          vista: stack(
            Paginacion({ paginacion: pSm, tamano: 'sm' }),
            Paginacion({ paginacion: pMd }),
            Paginacion({ paginacion: pLg, tamano: 'lg' }),
          ),
          codigo: `Paginacion({ paginacion, tamano: 'sm' })   // 28px
Paginacion({ paginacion })                  // md (default · 36px)
Paginacion({ paginacion, tamano: 'lg' })   // 44px`,
        })],
      }),

      // ============== 5. PRIMERA / ÚLTIMA ==============
      Seccion({
        titulo: '5 · Con primera / última (jump-to-edge)',
        descripcion: 'Para datasets grandes — botones extra `‹‹` `››` que saltan al principio o al final. Útil cuando el usuario está en la página 50 de 500 y quiere volver al inicio rápido.',
        hijos: [VistaCodigo({
          vista: conIndicador(pPrimUlt, 500,
            Paginacion({ paginacion: pPrimUlt, mostrarPrimeraUltima: true })),
          codigo: `Paginacion({
  paginacion,
  mostrarPrimeraUltima: true,           // ‹‹ ‹ … 24 25 26 … › ››
})`,
        })],
      }),

      // ============== 6. SIBLINGS (control de densidad) ==============
      Seccion({
        titulo: '6 · Siblings (densidad de páginas)',
        descripcion: '`siblings` controla cuántas páginas se muestran a cada lado de la actual. Default 1 (compacto). Sube a 2-3 si quieres ver más contexto.',
        hijos: [VistaCodigo({
          vista: stack(
            crearEl('div', null, [
              crearEl('p', { style: { margin: '0 0 6px', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, ['siblings: 1 (default)']),
              Paginacion({ paginacion: pSiblings, siblings: 1 }),
            ]),
            crearEl('div', null, [
              crearEl('p', { style: { margin: '0 0 6px', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, ['siblings: 2']),
              Paginacion({ paginacion: pSiblings, siblings: 2 }),
            ]),
            crearEl('div', null, [
              crearEl('p', { style: { margin: '0 0 6px', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, ['siblings: 3']),
              Paginacion({ paginacion: pSiblings, siblings: 3 }),
            ]),
          ),
          codigo: `Paginacion({ paginacion, siblings: 1 })   // 1 … 9 [10] 11 … 20 (default)
Paginacion({ paginacion, siblings: 2 })   // 1 … 8 9 [10] 11 12 … 20
Paginacion({ paginacion, siblings: 3 })   // 1 … 7 8 9 [10] 11 12 13 … 20`,
        })],
      }),

      // ============== 7. SIMPLE (prev/next + texto) ==============
      Seccion({
        titulo: '7 · Simple (prev/next + texto)',
        descripcion: 'Sólo botones de anterior / siguiente + indicador "Página X de Y". Patrón Linear / Notion / GitHub Issues — no quieren números porque tienen scroll infinito o pocos pasos.',
        hijos: [VistaCodigo({
          vista: Paginacion({ paginacion: pSimple, variante: 'simple' }),
          codigo: `Paginacion({ paginacion, variante: 'simple' })

// Visual:  ‹ Anterior   Página 3 de 8   Siguiente ›`,
        })],
      }),

      // ============== 8. COMPACTA (input para saltar) ==============
      Seccion({
        titulo: '8 · Compacta (input para saltar)',
        descripcion: 'Input numérico para saltar a una página específica. Útil para datasets enormes (500+ páginas) donde tipear el número es más rápido que clickear.',
        hijos: [VistaCodigo({
          vista: Paginacion({ paginacion: pCompacta, variante: 'compacta' }),
          codigo: `Paginacion({ paginacion, variante: 'compacta' })

// Visual:  ‹  [42]  de 50  ›
// Editar el input dispara paginacion.irA(n)`,
        })],
      }),

      // ============== 9. INFO + SELECTOR ==============
      Seccion({
        titulo: '9 · Info textual y selector de tamaño',
        descripcion: '`InfoPaginacion` muestra "Mostrando 11–20 de 145". `SelectorTamano` permite cambiar items por página (10/25/50/100). Ambos reactivos al mismo `paginacion`.',
        hijos: [VistaCodigo({
          vista: stack(
            crearEl('div', null, [
              crearEl('p', { style: { margin: '0 0 6px', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase' } }, ['Info']),
              InfoPaginacion({ paginacion: pInfo }),
            ]),
            crearEl('div', null, [
              crearEl('p', { style: { margin: '0 0 6px', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase' } }, ['Selector']),
              SelectorTamano({ paginacion: pSelector }),
            ]),
            crearEl('div', null, [
              crearEl('p', { style: { margin: '0 0 6px', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase' } }, ['Combinados']),
              fila(
                SelectorTamano({ paginacion: pSelector }),
                Paginacion({ paginacion: pSelector, tamano: 'sm' }),
                InfoPaginacion({ paginacion: pSelector }),
              ),
            ]),
          ),
          codigo: `// Info textual
InfoPaginacion({ paginacion, etiqueta: 'usuarios' })
// → "Mostrando 11–20 de 145 usuarios"

// Selector de tamaño
SelectorTamano({
  paginacion,
  opciones: [10, 25, 50, 100],
})
// Cambiar el select dispara paginacion.cambiarTamano(n) — resetea a página 1`,
        })],
      }),

      // ============== 10. BARRA COMPLETA ==============
      Seccion({
        titulo: '10 · Barra completa (estilo tabla)',
        descripcion: '`BarraPaginacion` combina los 3 elementos: selector a la izquierda, info al centro, paginación a la derecha. Layout responsivo — en móvil se apila vertical.',
        hijos: [VistaCodigo({
          vista: BarraPaginacion({ paginacion: pBarra, opcionesTamano: [10, 25, 50, 100] }),
          codigo: `BarraPaginacion({
  paginacion,
  opcionesTamano: [10, 25, 50, 100],
  variante: 'default',                     // default | pills | bordeada
})

// Layout: [selector] [info al centro] [paginación a la derecha]`,
        })],
      }),

      // ============== 11. TABLA REAL ==============
      Seccion({
        titulo: '11 · Caso real — tabla de usuarios paginada',
        descripcion: '143 usuarios mockeados con `usarPaginacion()`. Cambiar el selector de items per page resetea a la página 1. El `efecto` re-renderiza el `tbody` con el slice correcto cuando cambia la página o el tamaño.',
        hijos: [VistaCodigo({
          vista: tablaUsuarios(),
          codigo: `const TODOS = await fetch('/api/usuarios').then(r => r.json());
const paginacion = usarPaginacion({ total: TODOS.length, tamanoPagina: 10 });

// Re-renderiza tbody cuando cambia la página o tamaño
efecto(() => {
  const slice = TODOS.slice(
    paginacion.desplazamiento.value,
    paginacion.desplazamiento.value + paginacion.tamano.value
  );
  tbody.replaceChildren(...slice.map(renderFila));
});

// Footer del card
BarraPaginacion({ paginacion, opcionesTamano: [5, 10, 25, 50] })`,
        })],
      }),
    ],
  });
};
