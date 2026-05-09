/**
 * LineaTiempo — lista de eventos cronológicos.
 *
 *   LineaTiempo({
 *     variante: 'default' | 'centrada' | 'compacta' | 'glass' | 'simple'
 *             | 'tarjetas'  // estilo pro: titulo + fecha en la misma fila (derecha)
 *             | 'alterna',  // como 'tarjetas' pero alternando izq/der (línea central)
 *     items: [
 *       {
 *         fecha: '12 mar',                  // texto (en 'tarjetas'/'alterna' va inline)
 *         titulo: 'Pedido recibido',
 *         mensaje: '...' | nodo,
 *         icono: Icono('check'),            // dentro del punto coloreado
 *         color: 'primary' | 'success' | 'warning' | 'danger' | 'info',
 *         pendiente: true,                  // outline en vez de relleno (eventos futuros)
 *         avatar: nodo,                     // reemplaza el punto por un avatar
 *         etiqueta: nodo,                   // badge inline después del título
 *         acciones: [boton1, boton2],       // botones de acción al pie
 *         adjuntos: [{ nombre, tamano }],   // archivos/links
 *       },
 *     ],
 *   })
 *
 * Para timeline horizontal (orden tracking, wizard steps), usar `LineaTiempoHorizontal`.
 */
import { crearEl } from '../../../utils/helpers/dom.js';

/* En las variantes 'tarjetas' y 'alterna' la fecha va inline a la derecha
   del título (no arriba como un eyebrow). Esto da un look más limpio y
   profesional, idéntico a los ejemplos clásicos de timeline. */
const FECHA_INLINE = new Set(['tarjetas', 'alterna']);

const renderItem = (it, variante) => {
  const fechaInline = FECHA_INLINE.has(variante);

  const cabezal = (it.titulo || it.etiqueta || (fechaInline && it.fecha))
    && crearEl('div', { class: 'linea-tiempo__cabezal' }, [
      it.titulo && crearEl('h4', { class: 'linea-tiempo__titulo' }, [it.titulo]),
      it.etiqueta && crearEl('span', { class: 'linea-tiempo__etiqueta' }, [it.etiqueta]),
      fechaInline && it.fecha && crearEl('span', { class: 'linea-tiempo__fecha-inline' }, [it.fecha]),
    ]);

  return crearEl('li', {
    class: ['linea-tiempo__item', it.pendiente && 'linea-tiempo__item--pendiente'],
  }, [
    // Punto / avatar
    it.avatar
      ? crearEl('span', { class: 'linea-tiempo__avatar' }, [it.avatar])
      : crearEl('span', {
          class: [
            'linea-tiempo__punto',
            it.color && `linea-tiempo__punto--${it.color}`,
            it.pendiente && 'linea-tiempo__punto--pendiente',
          ],
          'aria-hidden': 'true',
        }, [it.icono]),
    // Cuerpo
    crearEl('div', { class: 'linea-tiempo__cuerpo' }, [
      // Fecha "eyebrow" sólo en variantes que NO la pintan inline
      !fechaInline && it.fecha && crearEl('span', { class: 'linea-tiempo__fecha' }, [it.fecha]),
      cabezal,
      it.mensaje && crearEl('p', { class: 'linea-tiempo__mensaje' },
        [typeof it.mensaje === 'string' ? it.mensaje : it.mensaje]),
      it.adjuntos && it.adjuntos.length && crearEl('div', { class: 'linea-tiempo__adjuntos' },
        it.adjuntos.map((a) => crearEl('span', { class: 'linea-tiempo__adjunto' }, [
          a.icono, crearEl('span', null, [a.nombre]),
          a.tamano && crearEl('span', { class: 'linea-tiempo__adjunto-tam' }, [a.tamano]),
        ]))),
      it.acciones && it.acciones.length && crearEl('div', { class: 'linea-tiempo__acciones' }, it.acciones),
    ]),
  ]);
};

export const LineaTiempo = ({ items = [], variante = 'default' } = {}) => crearEl('ol', {
  class: ['linea-tiempo', `linea-tiempo--${variante}`],
}, items.map((it) => renderItem(it, variante)));

// ============================================================================
//  LineaTiempoHorizontal — para steps de checkout, order tracking
//   pasos: [{ titulo, mensaje?, icono?, color?, completado?, activo? }]
// ============================================================================
export const LineaTiempoHorizontal = ({ pasos = [] } = {}) => crearEl('ol', {
  class: 'linea-tiempo-h',
}, pasos.map((p, i) => {
  const nodos = [
    crearEl('div', {
      class: [
        'linea-tiempo-h__paso',
        p.completado && 'linea-tiempo-h__paso--completado',
        p.activo && 'linea-tiempo-h__paso--activo',
        p.color && `linea-tiempo-h__paso--${p.color}`,
      ],
    }, [
      crearEl('span', { class: 'linea-tiempo-h__punto' }, [p.icono || crearEl('span', null, [String(i + 1)])]),
      crearEl('div', { class: 'linea-tiempo-h__textos' }, [
        p.titulo && crearEl('strong', { class: 'linea-tiempo-h__titulo' }, [p.titulo]),
        p.mensaje && crearEl('span', { class: 'linea-tiempo-h__mensaje' }, [p.mensaje]),
      ]),
    ]),
  ];
  if (i < pasos.length - 1) {
    nodos.push(crearEl('span', {
      class: ['linea-tiempo-h__linea', p.completado && 'linea-tiempo-h__linea--completada'],
    }));
  }
  return crearEl('li', { class: 'linea-tiempo-h__item' }, nodos);
}));
