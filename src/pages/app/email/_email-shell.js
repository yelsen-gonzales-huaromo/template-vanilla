/**
 * Shell del módulo Email — Mail Service header, Compose, nav, labels (tags),
 * toolbar de la inbox. Reutilizado por email/read/compose.
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { navegarA } from '../../../router/index.js';

/* ─── Datos demo ───────────────────────────────────────────────────────── */
export const CARPETAS = [
  { id: 'inbox',     etiqueta: 'Inbox',       icono: SVG('inbox'),     contador: 2,  contadorTipo: 'rojo',  ruta: '#/app/email' },
  { id: 'sent',      etiqueta: 'Sent Mail',   icono: SVG('mail-out') },
  { id: 'important', etiqueta: 'Important',   icono: SVG('briefcase'), contador: 4,  contadorTipo: 'gris' },
  { id: 'draft',     etiqueta: 'Drafts',      icono: SVG('file') },
  { id: 'tags',      etiqueta: 'Tags',        icono: SVG('star') },
  { id: 'trash',     etiqueta: 'Trash',       icono: SVG('trash') },
];

export const ETIQUETAS = [
  { id: 'important',   nombre: 'Important',   color: '#f59e0b' },
  { id: 'business',    nombre: 'Business',    color: '#8b5cf6' },
  { id: 'inspiration', nombre: 'Inspiration', color: '#10b981' },
];

/* Correos demo — más expresivos y con flag de adjunto */
export const CORREOS = [
  { id: 'm1',  remitente: 'Cedric Kelly',    starred: false, adjuntos: false, fecha: '08 Jan',
    asunto: 'Urgent',
    preview: 'You forgot your keys in the class room, please come imediatly! Urgent - You forgot your keys in the class room, please come im…',
    activo: true },
  { id: 'm2',  remitente: 'Haley Kennedy',   starred: false, adjuntos: true,  fecha: '12 Jan',
    asunto: 'Justice system',
    preview: 'In the criminal justice system, the people are represented by two separate yet equally important groups. The police who investigate …',
    activo: true },
  { id: 'm3',  remitente: 'Bradley Greer',   starred: false, adjuntos: true,  fecha: '14 Jan',
    asunto: 'Tootsie Roll',
    preview: 'The world looks mighty good to me, cause Tootsie Rolls are all I see. Whatever it is I think I see, becomes a Tootsie Roll to me! Tootsie …' },
  { id: 'm4',  remitente: 'Brenden Wagner',  starred: true,  adjuntos: true,  fecha: '28 Jan',
    asunto: 'Highlander',
    preview: 'I am Duncan Macleod, born 400 years ago in the Highlands of Scotland. I am Immortal, and I am not alone. For centuries, we have wait…' },
  { id: 'm5',  remitente: 'Bruno Nash',      starred: false, adjuntos: false, fecha: '05 Feb',
    asunto: 'Imagination',
    preview: 'You unlock this door with the key of imagination. Beyond it is another dimension: a dimension of sound, a dimension of sight, a dimension …' },
  { id: 'm6',  remitente: 'Sonya Frost',     starred: false, adjuntos: false, fecha: '13 Feb',
    asunto: 'Hall of Justice',
    preview: 'Gathered together from the cosmic reaches of the universe, here in this great Hall of Justice, are the most powerful forces of good ever as…' },
  { id: 'm7',  remitente: 'Caesar Vance',    starred: false, adjuntos: true,  fecha: '20 Feb',
    asunto: 'New Project',
    preview: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium…' },
  { id: 'm8',  remitente: 'Doris Wilder',    starred: false, adjuntos: false, fecha: '22 Feb',
    asunto: 'Coffee break',
    preview: '¿Te apuntas mañana al café de las 10? Tengo cosas para contarte sobre el roadmap.' },
  { id: 'm9',  remitente: 'Gloria Little',   starred: true,  adjuntos: true,  fecha: '03 Mar',
    asunto: 'Q1 Wrap-up',
    preview: 'Here are the highlights from the quarter — please review the attached spreadsheets before our 1:1.' },
  { id: 'm10', remitente: 'Herman Lopez',    starred: false, adjuntos: false, fecha: '11 Mar',
    asunto: 'Sales pipeline',
    preview: 'Pipeline tracking is up 18% — let me know if you want a deep dive on the channel mix.' },
];

/* ─── Iconos SVG inline ────────────────────────────────────────────────── */
function SVG(nombre) {
  const m = {
    'inbox':      `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>`,
    'mail-out':   `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9z"/></svg>`,
    'briefcase':  `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
    'file':       `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
    'star':       `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    'trash':      `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
    'tag':        `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`,
  };
  return m[nombre] || '';
}

/* ─── Sidebar (Mail Service + Compose + Nav + Labels) ──────────────────── */
export const Sidebar = ({ activo = 'inbox', onCompose } = {}) => {
  const navItems = CARPETAS.map(c => {
    const activoFlag = c.id === activo;
    const a = crearEl('a', {
      href: c.ruta || '#',
      class: ['em-side__item', activoFlag && 'em-side__item--activo'],
      onClick: c.ruta ? null : (e) => e.preventDefault(),
    }, [
      crearEl('span', { class: 'em-side__item-ico', html: c.icono }),
      crearEl('span', { class: 'em-side__item-txt' }, [c.etiqueta]),
      c.contador && crearEl('span', {
        class: ['em-side__item-num', `em-side__item-num--${c.contadorTipo || 'gris'}`],
      }, [String(c.contador)]),
    ]);
    return a;
  });

  const labels = ETIQUETAS.map(e => crearEl('a', {
    href: '#', class: 'em-side__label',
    onClick: (ev) => ev.preventDefault(),
  }, [
    crearEl('span', {
      class: 'em-side__label-ico',
      style: { color: e.color },
      html: SVG('tag'),
    }),
    crearEl('span', { class: 'em-side__label-txt' }, [e.nombre]),
  ]));

  return crearEl('aside', { class: 'em-side' }, [
    crearEl('div', { class: 'em-side__brand' }, [
      crearEl('h2', { class: 'em-side__brand-tit' }, ['Mail Service']),
      crearEl('span', { class: 'em-side__brand-sub' }, ['amiahburton@gmail.com']),
    ]),
    crearEl('button', {
      type: 'button',
      class: 'em-side__compose',
      onClick: onCompose || (() => navegarA('/app/email/compose')),
    }, ['Compose Email']),
    crearEl('nav', { class: 'em-side__nav' }, navItems),
    crearEl('div', { class: 'em-side__labels-wrap' }, [
      crearEl('h4', { class: 'em-side__h4' }, ['Labels']),
      crearEl('div', { class: 'em-side__labels' }, labels),
    ]),
  ]);
};

export { SVG };
export const navegarLectura = (id) => navegarA(`/app/email/leer?id=${id}`);
