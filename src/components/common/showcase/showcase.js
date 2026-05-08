/**
 * Helpers para páginas tipo "showcase" de componentes (estilo Falcon).
 *
 *   PaginaShowcase   — wrapper con migas + intro card + lista de ejemplos
 *   Seccion          — agrupa hijos bajo un sub-encabezado opcional. Cuando
 *                      tiene UN único `VistaCodigo` como hijo, fusiona su
 *                      título dentro de la cabecera del card → estilo Falcon.
 *
 * El intro card usa la variante 'acento' del Tarjeta. Si pasas `decoracion`,
 * se renderiza como capa de fondo (equivalente al `bg-holder` de Falcon).
 *
 * Catálogo de decoraciones disponibles (importables desde card-decoraciones.js):
 *   esquinaCircular()   — círculos concéntricos
 *   esquinaOndas()      — capas curvas
 *   esquinaGeometrica() — triángulos/polígonos
 *   esquinaPuntos()     — dot-grid
 *   esquinaBlob()       — manchas orgánicas
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { Migas } from '../../../layouts/components/breadcrumbs/breadcrumbs.js';
import { Tarjeta } from '../../ui/card/card.js';

export const PaginaShowcase = ({
  titulo, descripcion, enlace, decoracion, migas = [], hijos = [],
} = {}) =>
  crearEl('div', { class: 'showcase' }, [
    Migas({ items: [{ etiqueta: 'Inicio', href: '/' }, ...migas, { etiqueta: titulo }] }),

    Tarjeta({
      variante: 'acento',
      decoracion,
      hijos: crearEl('div', { class: 'showcase__intro-cuerpo' }, [
        crearEl('h1', { class: 'showcase__intro-titulo' }, [titulo]),
        descripcion && crearEl('p', { class: 'showcase__intro-descripcion' }, [descripcion]),
        enlace && crearEl('a', {
          class: 'showcase__intro-enlace',
          href: enlace.href, target: '_blank', rel: 'noopener',
        }, [enlace.texto, ' ›']),
      ]),
    }),

    crearEl('div', { class: 'showcase__cuerpo' }, hijos),
  ]);

export const Seccion = ({ titulo, descripcion, hijos = [] } = {}) => {
  if (titulo && hijos.length === 1) {
    const unico = hijos[0];
    const esVistaCodigo = unico?.classList?.contains?.('vc');
    if (esVistaCodigo) {
      const tituloBloque = unico.querySelector('.vc__titulo-bloque');
      const yaTieneTitulo = tituloBloque?.querySelector('.vc__titulo');
      if (tituloBloque && !yaTieneTitulo) {
        tituloBloque.prepend(crearEl('h3', { class: 'vc__titulo' }, [titulo]));
        if (descripcion && !tituloBloque.querySelector('.vc__descripcion')) {
          tituloBloque.appendChild(crearEl('p', { class: 'vc__descripcion' }, [descripcion]));
        }
        return unico;
      }
    }
  }

  return crearEl('div', { class: 'showcase__seccion' }, [
    (titulo || descripcion) && crearEl('header', { class: 'showcase__seccion-cabecera' }, [
      titulo && crearEl('h2', { class: 'showcase__seccion-titulo' }, [titulo]),
      descripcion && crearEl('p', { class: 'showcase__seccion-descripcion' }, [descripcion]),
    ]),
    crearEl('div', { class: 'showcase__seccion-cuerpo' }, hijos),
  ]);
};
