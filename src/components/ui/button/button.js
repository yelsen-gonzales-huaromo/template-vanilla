/**
 * Botón profesional — sistema completo.
 *
 *   Boton({
 *     texto: 'Guardar',
 *     variante: 'primary' | 'secondary' | 'ghost' | 'outline' |
 *               'danger' | 'success' | 'warning' | 'info' | 'link' | 'brand',
 *     estilo:   'solido' | 'soft' | 'outline' | 'ghost',     // fill style
 *     tamano:   'xs' | 'sm' | 'md' | 'lg' | 'xl',
 *     forma:    'rect' | 'pill' | 'cuadrado',                 // border-radius
 *     icono, iconoDerecha,
 *     soloIcono: false,                                       // shortcut icon-only
 *     bloque: false,                                          // full-width
 *     activo: false,                                          // toggle state
 *     elevado: false,                                         // sombra extra
 *     cargando: false,
 *     deshabilitado: false,
 *     onClick,
 *   })
 *
 * Helpers:
 *   GrupoBotones({ items, variante, tamano, vertical })
 *   BotonSplit({ texto, icono, alClick, items })
 *   BotonFAB({ icono, posicion, alClick })
 *   BotonToggle({ texto, valor, alCambiar })
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';
import { Icono } from '../icon/icons.js';
import { MenuDesplegable } from '../dropdown/dropdown.js';

export const Boton = ({
  texto = '',
  variante = 'primary',
  estilo,
  tamano = 'md',
  forma = 'rect',
  type = 'button',
  bloque = false,
  icono = null,
  iconoDerecha = null,
  soloIcono = false,
  activo = false,
  elevado = false,
  cargando = false,
  deshabilitado = false,
  onClick,
  ...resto
} = {}) => {
  const esSoloIcono = soloIcono || (!texto && icono);

  const clases = [
    'btn',
    variante !== 'primary' && `btn--${variante}`,
    estilo && `btn--est-${estilo}`,
    tamano !== 'md' && `btn--${tamano}`,
    forma !== 'rect' && `btn--${forma}`,
    bloque && 'btn--block',
    esSoloIcono && 'btn--icon',
    activo && 'btn--activo',
    elevado && 'btn--elevado',
  ];

  const hijos = [];
  if (icono) hijos.push(typeof icono === 'string' ? crearEl('span', { html: icono }) : icono);
  if (texto) hijos.push(crearEl('span', { class: 'btn-text' }, [texto]));
  if (iconoDerecha) hijos.push(typeof iconoDerecha === 'string'
    ? crearEl('span', { html: iconoDerecha })
    : iconoDerecha);

  return crearEl('button', {
    type,
    class: clases,
    disabled: deshabilitado || cargando,
    'aria-busy': cargando || null,
    'aria-pressed': activo ? 'true' : null,
    onClick,
    ...resto,
  }, hijos);
};

/* ===========================================================================
   Grupo de botones (joined)
   =========================================================================== */
export const GrupoBotones = ({
  items = [],
  variante = 'secondary',
  tamano = 'md',
  vertical = false,
} = {}) =>
  crearEl('div', {
    class: ['btn-grupo', vertical && 'btn-grupo--vertical'],
    role: 'group',
  }, items.map((it) => Boton({
    variante: it.variante || variante,
    tamano: it.tamano || tamano,
    activo: it.activo,
    icono: it.icono,
    texto: it.texto,
    onClick: it.alClick,
  })));

/* ===========================================================================
   BotonSplit — acción principal + dropdown con más opciones
   =========================================================================== */
export const BotonSplit = ({
  texto, icono, variante = 'primary', tamano = 'md',
  alClick, items = [],
} = {}) => {
  const principal = Boton({
    texto, icono, variante, tamano,
    onClick: alClick,
    class: 'btn-split__principal',
  });
  const caret = Boton({
    icono: Icono('chevron_d', { tamano: tamano === 'sm' || tamano === 'xs' ? 12 : 14 }),
    variante, tamano, soloIcono: true,
    'aria-label': 'Más opciones', class: 'btn-split__caret',
  });
  return crearEl('div', { class: 'btn-split', role: 'group' }, [
    principal,
    MenuDesplegable({
      disparador: caret, direccion: 'down', alineacion: 'end', items,
    }),
  ]);
};

/* ===========================================================================
   FAB (Floating Action Button)
   =========================================================================== */
export const BotonFAB = ({
  icono, etiqueta,
  variante = 'primary',
  tamano = 'md',
  posicion = 'inline',
  alClick,
} = {}) =>
  crearEl('button', {
    type: 'button',
    class: [
      'btn-fab', `btn-fab--${variante}`, `btn-fab--${tamano}`,
      posicion === 'fija' && 'btn-fab--fijo',
    ],
    'aria-label': etiqueta || 'Acción',
    onClick: alClick,
  }, [
    crearEl('span', { class: 'btn-fab__icono', 'aria-hidden': 'true' }, [icono]),
  ]);

/* ===========================================================================
   BotonToggle — alterna estado activo/inactivo
   =========================================================================== */
export const BotonToggle = ({
  texto, icono,
  valor,
  inicial = false,
  variante = 'secondary',
  tamano = 'md',
  alCambiar,
} = {}) => {
  const estado = valor || senal(inicial);
  const btn = Boton({
    texto, icono, variante, tamano, activo: estado.value,
    onClick: () => {
      estado.value = !estado.value;
      alCambiar?.(estado.value);
    },
  });
  efecto(() => {
    btn.setAttribute('aria-pressed', String(estado.value));
    btn.classList.toggle('btn--activo', estado.value);
  });
  return btn;
};
