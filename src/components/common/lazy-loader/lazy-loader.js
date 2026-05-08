import { crearEl } from '../../../utils/helpers/dom.js';
import { Cargador } from '../../ui/spinner/spinner.js';

/**
 * Resuelve un componente async, mostrando un placeholder mientras carga.
 *   const nodo = await CargadorPerezoso({ cargar: () => import('./pesado.js') });
 */
export const CargadorPerezoso = async ({ cargar, placeholder } = {}) => {
  const alternativa = placeholder ?? crearEl('div', {
    style: { padding: 'var(--space-8)', display: 'flex', justifyContent: 'center' },
  }, [Cargador({ tamano: 'lg' })]);

  const contenedor = crearEl('div', null, [alternativa]);

  try {
    const modulo = await cargar();
    const componente = modulo.default || modulo;
    contenedor.replaceChildren(typeof componente === 'function' ? componente() : componente);
  } catch (err) {
    console.error('[cargador-perezoso]', err);
    contenedor.replaceChildren(crearEl('div', { class: 'text-danger' }, ['Error al cargar el módulo.']));
  }

  return contenedor;
};
