import { crearEl } from '../../../utils/helpers/dom.js';

export const TituloPagina = ({ titulo, subtitulo, acciones } = {}) =>
  crearEl('header', {
    style: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      gap: 'var(--space-4)', marginBottom: 'var(--space-6)', flexWrap: 'wrap',
    },
  }, [
    crearEl('div', null, [
      crearEl('h1', null, [titulo]),
      subtitulo && crearEl('p', { class: 'text-muted', style: { marginTop: 'var(--space-1)' } }, [subtitulo]),
    ]),
    acciones && crearEl('div', { class: 'flex gap-2' }, [acciones]),
  ]);
