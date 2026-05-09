/**
 * Email · Compose — formulario "New message" con To / Cc (chips) / Subject /
 * editor con toolbar de formato + textarea + Send / Cancel + status footer
 * (lines · words · cursor).
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';
import { navegarA } from '../../../router/index.js';
import { Sidebar } from './_email-shell.js';

/* ─── Iconos del toolbar de formato ───────────────────────────────────── */
const SVG = {
  bold:   `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>`,
  italic: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>`,
  heading:`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4v16M18 4v16M6 12h12"/></svg>`,
  quote:  `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>`,
  list:   `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
  olist:  `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>`,
  link:   `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  img:    `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  preview:`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  split:  `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/></svg>`,
  full:   `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`,
  help:   `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  pencil: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>`,
};

const tbBtn = (svg, etiqueta) => crearEl('button', {
  type: 'button', class: 'em-comp__tb-btn', 'aria-label': etiqueta, html: svg, title: etiqueta,
});

export default async () => {
  /* ─── Estado ─── */
  const para     = senal('');
  const cc       = senal(['Alaska', 'Victoria']);
  const subject  = senal('');
  const cuerpo   = senal('');

  /* ─── To input ─── */
  const inputTo = crearEl('input', {
    type: 'email', class: 'em-comp__input', placeholder: ' ',
    onInput: (e) => { para.value = e.target.value; },
  });

  /* ─── Cc con chips dinámicos ─── */
  const ccArea = crearEl('div', { class: 'em-comp__chips' });
  const inputCc = crearEl('input', {
    type: 'text', class: 'em-comp__chip-input',
    placeholder: cc.value.length ? '' : 'Añadir destinatario',
    onKeyDown: (e) => {
      if (e.key === 'Enter' && e.target.value.trim()) {
        e.preventDefault();
        cc.value = [...cc.value, e.target.value.trim()];
        e.target.value = '';
      } else if (e.key === 'Backspace' && !e.target.value && cc.value.length) {
        cc.value = cc.value.slice(0, -1);
      }
    },
  });
  efecto(() => {
    const chips = cc.value.map((nombre, i) => crearEl('span', { class: 'em-comp__chip' }, [
      crearEl('button', {
        type: 'button', class: 'em-comp__chip-x', 'aria-label': `Quitar ${nombre}`,
        onClick: () => { cc.value = cc.value.filter((_, j) => j !== i); },
      }, ['×']),
      nombre,
    ]));
    ccArea.replaceChildren(...chips, inputCc);
    inputCc.placeholder = cc.value.length ? '' : 'Añadir destinatario';
  });

  /* ─── Subject ─── */
  const inputSubj = crearEl('input', {
    type: 'text', class: 'em-comp__input', placeholder: ' ',
    onInput: (e) => { subject.value = e.target.value; },
  });

  /* ─── Toolbar de formato ─── */
  const toolbarFmt = crearEl('div', { class: 'em-comp__tb' }, [
    crearEl('div', { class: 'em-comp__tb-grupo' }, [
      tbBtn(SVG.bold,    'Bold'),
      tbBtn(SVG.italic,  'Italic'),
      tbBtn(SVG.heading, 'Heading'),
    ]),
    crearEl('div', { class: 'em-comp__tb-grupo' }, [
      tbBtn(SVG.quote, 'Quote'),
      tbBtn(SVG.list,  'Lista'),
      tbBtn(SVG.olist, 'Lista numerada'),
    ]),
    crearEl('div', { class: 'em-comp__tb-grupo' }, [
      tbBtn(SVG.link, 'Link'),
      tbBtn(SVG.img,  'Imagen'),
    ]),
    crearEl('div', { class: 'em-comp__tb-grupo' }, [
      tbBtn(SVG.preview, 'Preview'),
      tbBtn(SVG.split,   'Split'),
      tbBtn(SVG.full,    'Pantalla completa'),
    ]),
    tbBtn(SVG.help, 'Ayuda'),
  ]);

  /* ─── Textarea con contador ─── */
  const ta = crearEl('textarea', {
    class: 'em-comp__textarea', rows: '14',
    onInput: (e) => { cuerpo.value = e.target.value; },
  });
  const status = crearEl('div', { class: 'em-comp__status' });
  efecto(() => {
    const v = cuerpo.value || '';
    const lines = v.split('\n').length;
    const words = v.trim() ? v.trim().split(/\s+/).length : 0;
    status.replaceChildren(
      crearEl('span', null, [`lines: ${lines}`]),
      crearEl('span', null, [`words: ${words}`]),
      crearEl('span', null, [`${lines}:1`]),
    );
  });

  /* ─── Acciones ─── */
  const btnSend = crearEl('button', {
    type: 'button', class: 'em-comp__send',
    onClick: () => {
      // En real iría a una API. Por ahora redirigimos al inbox.
      navegarA('/app/email');
    },
  }, ['Send']);
  const btnCancel = crearEl('button', {
    type: 'button', class: 'em-comp__cancel',
    onClick: () => navegarA('/app/email'),
  }, ['Cancel']);

  /* ─── Composición ─── */
  return crearEl('div', { class: 'em-pagina' }, [
    crearEl('div', { class: 'em-pagina__layout' }, [
      Sidebar({ activo: 'inbox' }),
      crearEl('section', { class: 'em-main' }, [
        crearEl('div', { class: 'em-comp' }, [
          crearEl('header', { class: 'em-comp__head' }, [
            crearEl('span', { class: 'em-comp__head-ico', html: SVG.pencil }),
            crearEl('h2', { class: 'em-comp__h2' }, ['New message']),
          ]),

          crearEl('div', { class: 'em-comp__campo' }, [
            crearEl('label', { class: 'em-comp__label' }, ['To:']),
            inputTo,
          ]),
          crearEl('div', { class: 'em-comp__campo' }, [
            crearEl('label', { class: 'em-comp__label' }, ['Cc']),
            ccArea,
          ]),
          crearEl('div', { class: 'em-comp__campo' }, [
            crearEl('label', { class: 'em-comp__label' }, ['Subject']),
            inputSubj,
          ]),

          crearEl('div', { class: 'em-comp__editor' }, [
            toolbarFmt,
            ta,
            status,
          ]),

          crearEl('div', { class: 'em-comp__acciones' }, [btnSend, btnCancel]),
        ]),
      ]),
    ]),
  ]);
};
