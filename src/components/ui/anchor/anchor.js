/**
 * Ancla — enlace `<a>` con variantes, estilos y tamaños consistentes.
 *
 *   Ancla({
 *     href,
 *     texto,                 // string  (también acepta `hijos` con nodos)
 *     hijos,                 // alternativa a texto: array de nodos
 *     variante: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral',
 *     estilo:   'plain' | 'subrayado' | 'subrayado-hover' | 'sin-subrayado' | 'animado',
 *     tamano:   'sm' | 'md' | 'lg',
 *     icono,                 // nodo a la izquierda
 *     iconoDerecha,          // nodo a la derecha
 *     externo: false,        // true → target=_blank + icono de salida
 *     pesado:  false,        // bold
 *     deshabilitado: false,
 *     onClick,
 *     ...resto,              // se aplica al <a>
 *   })
 *
 * Atajos:
 *   EnlaceCTA({ href, texto })       — link con flecha animada
 *   EnlaceExterno({ href, texto })   — link a sitio externo
 *   ListaEnlaces({ enlaces })        — lista vertical de links (footer/sidebar)
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { Icono } from '../icon/icons.js';

export const Ancla = ({
  href = '#',
  texto, hijos,
  variante = 'primary',
  estilo = 'subrayado-hover',
  tamano = 'md',
  icono, iconoDerecha,
  externo = false,
  pesado = false,
  deshabilitado = false,
  onClick,
  ...resto
} = {}) => {
  const ext = externo ? {
    target: '_blank',
    rel: 'noopener noreferrer',
  } : {};
  const iconoExterno = externo
    ? crearEl('span', { class: 'ancla__icon-externo', 'aria-hidden': 'true' }, [
        Icono('flecha_r', { tamano: 12 }),
      ])
    : null;

  const contenido = [
    icono && crearEl('span', { class: 'ancla__icon', 'aria-hidden': 'true' }, [icono]),
    crearEl('span', { class: 'ancla__texto' }, hijos || (texto ? [texto] : [])),
    iconoDerecha && crearEl('span', { class: 'ancla__icon-d', 'aria-hidden': 'true' }, [iconoDerecha]),
    iconoExterno,
  ];

  return crearEl('a', {
    href: deshabilitado ? null : href,
    class: [
      'ancla',
      `ancla--${variante}`,
      `ancla--${estilo}`,
      `ancla--${tamano}`,
      pesado && 'ancla--pesado',
      deshabilitado && 'ancla--deshabilitado',
      externo && 'ancla--externo',
    ],
    'aria-disabled': deshabilitado || null,
    onClick: deshabilitado ? (e) => e.preventDefault() : onClick,
    ...ext,
    ...resto,
  }, contenido);
};

/** CTA: link con flecha → animada al hover */
export const EnlaceCTA = ({ href = '#', texto, ...resto } = {}) =>
  Ancla({
    href, texto,
    estilo: 'plain',
    pesado: true,
    iconoDerecha: Icono('flecha_r', { tamano: 14 }),
    class: 'ancla--cta',
    ...resto,
  });

/** Externo: con icono de salida + target=_blank */
export const EnlaceExterno = (props = {}) =>
  Ancla({ externo: true, ...props });

/** Lista vertical de links (footer/sidebar) */
export const ListaEnlaces = ({ enlaces = [], titulo, tamano = 'md' } = {}) =>
  crearEl('div', { class: 'lista-enlaces' }, [
    titulo && crearEl('h4', { class: 'lista-enlaces__titulo' }, [titulo]),
    crearEl('ul', { class: 'lista-enlaces__lista' },
      enlaces.map((e) => crearEl('li', null, [
        Ancla({
          href: e.href,
          texto: e.texto,
          variante: 'neutral',
          estilo: 'plain',
          tamano,
          icono: e.icono,
          iconoDerecha: e.iconoDerecha,
          externo: e.externo,
          ...e,
        }),
      ])),
    ),
  ]);
