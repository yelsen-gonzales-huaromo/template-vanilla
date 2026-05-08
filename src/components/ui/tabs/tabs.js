/**
 * Pestañas — navegación entre paneles, con `senal` reactiva interna.
 *
 *   Pestanas({
 *     items: [
 *       { id: 'a', etiqueta: 'Inicio',  contenido: nodo },
 *       { id: 'b', etiqueta: 'Detalles', contenido: nodo, deshabilitado: true },
 *     ],
 *     inicial: 'a',
 *     variante: 'underline' | 'pills' | 'segmented' | 'lateral' | 'cards',  // default: underline
 *   })
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';

export const Pestanas = ({
  items = [], inicial, variante = 'underline',
} = {}) => {
  const activo = senal(inicial || items[0]?.id);

  const tabs = items.map((it) => {
    const btn = crearEl('button', {
      type: 'button',
      role: 'tab',
      class: 'pestanas__tab',
      'aria-selected': 'false',
      disabled: it.deshabilitado || null,
      onClick: () => { if (!it.deshabilitado) activo.value = it.id; },
    }, [
      it.icono,
      crearEl('span', null, [it.etiqueta]),
      it.badge,
    ]);
    return { id: it.id, btn };
  });

  const paneles = items.map((it) => crearEl('div', {
    role: 'tabpanel',
    class: 'pestanas__panel',
    'data-id': it.id,
  }, [it.contenido]));

  efecto(() => {
    const sel = activo.value;
    tabs.forEach(({ id, btn }) => {
      btn.setAttribute('aria-selected', String(id === sel));
      btn.classList.toggle('pestanas__tab--activo', id === sel);
    });
    paneles.forEach((p) => { p.style.display = p.dataset.id === sel ? '' : 'none'; });
  });

  return crearEl('div', { class: ['pestanas', `pestanas--${variante}`] }, [
    crearEl('div', { class: 'pestanas__lista', role: 'tablist' }, tabs.map((t) => t.btn)),
    crearEl('div', { class: 'pestanas__paneles' }, paneles),
  ]);
};
