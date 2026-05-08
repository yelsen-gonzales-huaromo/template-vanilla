/**
 * Acordeón — secciones colapsables con múltiples variantes y opciones.
 *
 *   Acordeon({
 *     variante: 'default' | 'flush' | 'bordeada' | 'con-cards',
 *     tamano:   'sm' | 'md' | 'lg',
 *     unico:    boolean,                 // sólo uno abierto a la vez
 *     iconoExpandir: 'chevron' | 'mas-menos' | 'flecha',
 *     iniciales: [ids],                  // ids inicialmente abiertos
 *     items: [
 *       {
 *         id, titulo, contenido,
 *         icono?,                         // nodo (Icono('...')) en la cabecera
 *         subtitulo?,                     // texto pequeño bajo el título
 *         badge?,                         // nodo (Insignia({...}))
 *         color?: 'primary'|'success'|'warning'|'danger'|'info',
 *         deshabilitado?: boolean,
 *       },
 *     ],
 *     onChange?: (idsAbiertos: Set<string>) => void,
 *   })
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';
import { Icono } from '../icon/icons.js';

const ICONO_EXPANDIR = {
  chevron:    () => Icono('chevron_d', { tamano: 16 }),
  'mas-menos': null,  // se renderizan dos spans para animar el toggle
  flecha:     () => Icono('flecha_r', { tamano: 14 }),
};

const renderIconoToggle = (tipo) => {
  if (tipo === 'mas-menos') {
    return crearEl('span', { class: 'acordeon__mm', 'aria-hidden': 'true' }, [
      crearEl('span', { class: 'acordeon__mm-h' }),
      crearEl('span', { class: 'acordeon__mm-v' }),
    ]);
  }
  const factory = ICONO_EXPANDIR[tipo] || ICONO_EXPANDIR.chevron;
  return crearEl('span', { class: 'acordeon__icon-toggle', 'aria-hidden': 'true' }, [factory()]);
};

export const Acordeon = ({
  items = [],
  variante = 'default',
  tamano = 'md',
  unico = false,
  iconoExpandir = 'chevron',
  iniciales = [],
  onChange,
} = {}) => {
  const abiertos = senal(new Set(iniciales));

  const togglear = (id, deshabilitado) => {
    if (deshabilitado) return;
    const s = new Set(abiertos.value);
    if (s.has(id)) s.delete(id);
    else {
      if (unico) s.clear();
      s.add(id);
    }
    abiertos.value = s;
    onChange?.(s);
  };

  const elementos = items.map((it) => {
    const cuerpo = crearEl('div', { class: 'acordeon__cuerpo' }, [
      crearEl('div', { class: 'acordeon__contenido' },
        typeof it.contenido === 'string' ? [it.contenido] : [it.contenido]),
    ]);

    const tituloBloque = crearEl('span', { class: 'acordeon__titulo-bloque' }, [
      crearEl('span', { class: 'acordeon__titulo' }, [it.titulo]),
      it.subtitulo && crearEl('span', { class: 'acordeon__subtitulo' }, [it.subtitulo]),
    ]);

    const cabezal = crearEl('button', {
      type: 'button',
      class: ['acordeon__cabezal', it.deshabilitado && 'acordeon__cabezal--deshabilitado'],
      'aria-expanded': 'false',
      disabled: it.deshabilitado || null,
      onClick: () => togglear(it.id, it.deshabilitado),
    }, [
      it.icono && crearEl('span', { class: 'acordeon__icono', 'aria-hidden': 'true' }, [it.icono]),
      tituloBloque,
      it.badge && crearEl('span', { class: 'acordeon__badge-slot' }, [it.badge]),
      renderIconoToggle(iconoExpandir),
    ]);

    const item = crearEl('div', {
      class: ['acordeon__item', it.color && `acordeon__item--${it.color}`],
      'data-id': it.id,
    }, [cabezal, cuerpo]);
    return { id: it.id, item, cabezal, deshabilitado: it.deshabilitado };
  });

  efecto(() => {
    const s = abiertos.value;
    elementos.forEach(({ id, item, cabezal }) => {
      const abierto = s.has(id);
      item.dataset.abierto = String(abierto);
      cabezal.setAttribute('aria-expanded', String(abierto));
    });
  });

  return crearEl('div', {
    class: ['acordeon', `acordeon--${variante}`, `acordeon--${tamano}`,
            iconoExpandir === 'mas-menos' && 'acordeon--mm'],
    role: 'region',
  }, elementos.map((e) => e.item));
};
