/**
 * Email · Inbox — listado profesional con cabecera "Inbox · 2 new messages",
 * buscador a la derecha, toolbar (With selected · Archive · Span · Delete · Order by)
 * y paginación inferior tipo "1-10 of 253".
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';
import { Sidebar, CORREOS, navegarLectura, SVG } from './_email-shell.js';

const SVG_BUSCAR  = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>`;
const SVG_INBOX_H = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>`;
const SVG_PIN     = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="17" x2="12" y2="22"/><path d="M9 10V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6l3 3v2H6v-2z"/></svg>`;
const SVG_CARET   = `<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;
const SVG_PREV    = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
const SVG_NEXT    = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;

const SVG_STAR_ON  = `<svg viewBox="0 0 24 24" width="16" height="16" fill="#f59e0b" stroke="#f59e0b" stroke-width="1.5" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
const SVG_STAR_OFF = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;

export default async () => {
  const seleccionados = senal(new Set());
  const todoSel       = senal(false);
  const filtro        = senal('');

  /* ── Cabecera principal: "Inbox · (2 new messages)" + buscador ── */
  const titulo = crearEl('div', { class: 'em-titlebar' }, [
    crearEl('div', { class: 'em-titlebar__h' }, [
      crearEl('span', { class: 'em-titlebar__ico', html: SVG_INBOX_H }),
      crearEl('h1', { class: 'em-titlebar__h1' }, ['Inbox']),
      crearEl('span', { class: 'em-titlebar__sub' }, ['(2 new messages)']),
    ]),
    crearEl('div', { class: 'em-search' }, [
      crearEl('input', {
        type: 'search', class: 'em-search__input', placeholder: 'Search mail…',
        onInput: (e) => { filtro.value = e.target.value.toLowerCase(); },
      }),
      crearEl('button', { class: 'em-search__btn', 'aria-label': 'Buscar', html: SVG_BUSCAR }),
    ]),
  ]);

  /* ── Toolbar (With selected, Archive, Span, Delete, Order by) ── */
  const chkAll = crearEl('input', {
    type: 'checkbox', class: 'em-tb2__chk',
    onChange: (e) => {
      todoSel.value = e.target.checked;
      const s = new Set();
      if (e.target.checked) CORREOS.forEach(c => s.add(c.id));
      seleccionados.value = s;
      // refresca todas las filas
      lista.querySelectorAll('.em-row__chk').forEach(c => { c.checked = e.target.checked; });
      lista.querySelectorAll('.em-row').forEach(r => r.classList.toggle('em-row--sel', e.target.checked));
    },
  });
  const dropBtn = (texto) => crearEl('button', {
    type: 'button', class: 'em-tb2__btn em-tb2__btn--drop',
  }, [texto, crearEl('span', { class: 'em-tb2__caret', html: SVG_CARET })]);
  const txtBtn = (texto) => crearEl('button', { type: 'button', class: 'em-tb2__btn' }, [texto]);

  const toolbar = crearEl('div', { class: 'em-tb2' }, [
    crearEl('div', { class: 'em-tb2__izq' }, [
      crearEl('label', { class: 'em-tb2__chk-wrap', 'aria-label': 'Seleccionar todos' }, [chkAll]),
      dropBtn('With selected'),
      crearEl('div', { class: 'em-tb2__group' }, [
        txtBtn('Archive'),
        txtBtn('Span'),
        txtBtn('Delete'),
      ]),
      dropBtn('Order by'),
    ]),
    crearEl('div', { class: 'em-tb2__der' }, [
      crearEl('span', { class: 'em-tb2__rango' }, [`1-${CORREOS.length} of 253`]),
      crearEl('div', { class: 'em-tb2__pag' }, [
        crearEl('button', { class: 'em-tb2__pag-btn', 'aria-label': 'Anterior', html: SVG_PREV }),
        crearEl('button', { class: 'em-tb2__pag-btn', 'aria-label': 'Siguiente', html: SVG_NEXT }),
      ]),
    ]),
  ]);

  /* ── Lista de correos ── */
  const construirFila = (m) => {
    const chk = crearEl('input', {
      type: 'checkbox', class: 'em-row__chk',
      onClick: (e) => e.stopPropagation(),
      onChange: (e) => {
        const s = new Set(seleccionados.value);
        if (e.target.checked) s.add(m.id);
        else s.delete(m.id);
        seleccionados.value = s;
        fila.classList.toggle('em-row--sel', e.target.checked);
      },
    });
    const star = crearEl('button', {
      type: 'button', class: 'em-row__star',
      onClick: (e) => {
        e.stopPropagation();
        m.starred = !m.starred;
        star.innerHTML = m.starred ? SVG_STAR_ON : SVG_STAR_OFF;
      },
    });
    star.innerHTML = m.starred ? SVG_STAR_ON : SVG_STAR_OFF;

    const fila = crearEl('div', {
      class: ['em-row', m.activo && 'em-row--sel'],
      onClick: () => navegarLectura(m.id),
    }, [
      crearEl('div', { class: 'em-row__izq' }, [chk, star]),
      crearEl('div', { class: 'em-row__centro' }, [
        crearEl('strong', { class: 'em-row__remit' }, [m.remitente]),
        crearEl('span', { class: 'em-row__preview' }, [m.preview]),
      ]),
      crearEl('div', { class: 'em-row__der' }, [
        m.adjuntos && crearEl('span', { class: 'em-row__clip', html: SVG_PIN, 'aria-label': 'Tiene adjunto' }),
        crearEl('span', { class: 'em-row__fecha' }, [m.fecha]),
      ]),
    ]);
    if (m.activo) chk.checked = true;
    return fila;
  };
  const lista = crearEl('div', { class: 'em-list' }, CORREOS.map(construirFila));

  return crearEl('div', { class: 'em-pagina' }, [
    crearEl('div', { class: 'em-pagina__layout' }, [
      Sidebar({ activo: 'inbox' }),
      crearEl('section', { class: 'em-main' }, [
        titulo,
        toolbar,
        lista,
      ]),
    ]),
  ]);
};
