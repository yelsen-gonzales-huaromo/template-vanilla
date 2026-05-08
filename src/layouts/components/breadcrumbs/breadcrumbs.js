/**
 * Migas (Breadcrumbs) — ruta jerárquica clickeable, profesional.
 *
 *   Migas({
 *     items: [
 *       { etiqueta: 'Inicio', href: '/', icono: Icono('panel') },
 *       { etiqueta: 'Componentes', href: '#/componentes' },
 *       { etiqueta: 'Migas' },                       // último: página actual
 *     ],
 *     separador: 'slash' | 'chevron' | 'flecha' | 'punto' | 'pipe',
 *     tamano:    'sm' | 'md' | 'lg',
 *     variante:  'plano' | 'pills' | 'bordeada',
 *     maxVisible: 4,                                 // colapsa con … si excede
 *     iconoInicio: true,                             // icono home en el primero
 *   })
 *
 * Item especial: pasa `dropdown: [...]` y se muestra un caret que abre menú
 * con sub-rutas (útil para breadcrumbs de e-commerce con categorías hermanas).
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { MenuDesplegable } from '../../../components/ui/dropdown/dropdown.js';

const SEPARADORES = {
  slash:   '/',
  chevron: '›',
  flecha:  '→',
  punto:   '·',
  pipe:    '|',
};

const renderItem = (item, esUltimo) => {
  const contenido = [
    item.icono && crearEl('span', { class: 'migas__icon', 'aria-hidden': 'true' }, [item.icono]),
    crearEl('span', { class: 'migas__texto' }, [item.etiqueta]),
  ];

  // Con dropdown — muestra caret y abre menú con hermanas
  if (item.dropdown?.length) {
    const trigger = crearEl('a', {
      href: esUltimo ? null : (item.href || '#'),
      class: ['migas__link', 'migas__link--dropdown'],
      'aria-current': esUltimo ? 'page' : null,
    }, [
      ...contenido,
      crearEl('span', { class: 'migas__caret', 'aria-hidden': 'true' }, [
        Icono('chevron_d', { tamano: 12 }),
      ]),
    ]);
    return MenuDesplegable({
      disparador: trigger, direccion: 'down', alineacion: 'start',
      items: item.dropdown.map((d) => ({
        etiqueta: d.etiqueta, icono: d.icono,
        alSeleccionar: () => { if (d.href) location.href = d.href; },
      })),
    });
  }

  if (item.href && !esUltimo) {
    return crearEl('a', { href: item.href, class: 'migas__link' }, contenido);
  }
  return crearEl('span', {
    class: 'migas__actual',
    'aria-current': esUltimo ? 'page' : null,
  }, contenido);
};

export const Migas = ({
  items = [],
  separador = 'slash',
  tamano = 'sm',
  variante = 'plano',
  maxVisible,
  iconoInicio = false,
} = {}) => {
  // Icono home en el primer item si se pide
  let lista = items.map((it, i) => {
    if (i === 0 && iconoInicio && !it.icono) {
      return { ...it, icono: Icono('panel', { tamano: 14 }) };
    }
    return it;
  });

  // Truncamiento: primero + … + últimos
  if (maxVisible && lista.length > maxVisible) {
    const primero = lista[0];
    const ultimos = lista.slice(-(maxVisible - 2));
    const ocultos = lista.slice(1, -(maxVisible - 2));
    lista = [primero, { _truncados: ocultos }, ...ultimos];
  }

  const sepChar = SEPARADORES[separador] || SEPARADORES.slash;

  const ol = crearEl('ol', { class: 'migas__lista' });
  lista.forEach((item, idx) => {
    const esUltimo = idx === lista.length - 1;

    if (item._truncados) {
      const trigger = crearEl('button', {
        type: 'button', class: 'migas__truncado',
        'aria-label': `Mostrar ${item._truncados.length} items ocultos`,
      }, ['…']);
      const drop = MenuDesplegable({
        disparador: trigger, direccion: 'down', alineacion: 'start',
        items: item._truncados.map((it) => ({
          etiqueta: it.etiqueta,
          alSeleccionar: () => { if (it.href) location.href = it.href; },
        })),
      });
      ol.appendChild(crearEl('li', { class: 'migas__item' }, [drop]));
    } else {
      ol.appendChild(crearEl('li', {
        class: ['migas__item', esUltimo && 'migas__item--actual'],
      }, [renderItem(item, esUltimo)]));
    }

    if (!esUltimo) {
      ol.appendChild(crearEl('li', {
        class: 'migas__separador', 'aria-hidden': 'true',
      }, [sepChar]));
    }
  });

  return crearEl('nav', {
    class: ['migas', `migas--${variante}`, `migas--${tamano}`, `migas--sep-${separador}`],
    'aria-label': 'Migas de pan',
  }, [ol]);
};
