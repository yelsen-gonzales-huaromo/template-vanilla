/**
 * Email · Lectura — vista profesional con estrella+asunto a la izquierda,
 * acciones share/print/delete a la derecha, fila "John Doe to me · fecha"
 * y sección de adjuntos con tamaño de archivo.
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { Sidebar, CORREOS } from './_email-shell.js';

const SVG_STAR    = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
const SVG_STAR_ON = `<svg viewBox="0 0 24 24" width="18" height="18" fill="#f59e0b" stroke="#f59e0b" stroke-width="1.5" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
const SVG_SHARE   = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`;
const SVG_PRINT   = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>`;
const SVG_TRASH   = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`;
const SVG_CARET   = `<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;
const SVG_FILE    = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;

const CUERPO_DEMO = `
<p>Hello,</p>
<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
<p>Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna.</p>
<p><strong>Regards,</strong><br/>John Doe</p>
`;

const ADJUNTOS = [
  { nombre: 'Reference.zip',    tamano: '5.10 MB' },
  { nombre: 'Instructions.zip', tamano: '3.15 MB' },
  { nombre: 'Team-list.pdf',    tamano: '4.5 MB' },
];

export default async (ctx) => {
  const id = ctx?.query?.id || 'm7';
  const correo = CORREOS.find(c => c.id === id) || CORREOS.find(c => c.id === 'm7') || CORREOS[0];

  /* ─── Topbar (estrella + asunto + acciones) ─── */
  const topbar = crearEl('div', { class: 'em-leer__top' }, [
    crearEl('div', { class: 'em-leer__top-izq' }, [
      crearEl('button', {
        class: 'em-leer__star', 'aria-label': 'Destacar',
        html: correo.starred ? SVG_STAR_ON : SVG_STAR,
      }),
      crearEl('h1', { class: 'em-leer__asunto' }, [correo.asunto || 'New Project']),
    ]),
    crearEl('div', { class: 'em-leer__top-der' }, [
      crearEl('button', { class: 'em-iconbtn', 'aria-label': 'Compartir', html: SVG_SHARE }),
      crearEl('button', { class: 'em-iconbtn', 'aria-label': 'Imprimir', html: SVG_PRINT }),
      crearEl('button', { class: 'em-iconbtn', 'aria-label': 'Eliminar', html: SVG_TRASH }),
    ]),
  ]);

  /* ─── Fila del remitente ─── */
  const remitente = correo.remitente || 'John Doe';
  const iniciales = remitente.split(/\s+/).slice(0, 2).map(p => p[0]).join('').toUpperCase();
  const filaRem = crearEl('div', { class: 'em-leer__rem' }, [
    crearEl('div', { class: 'em-leer__rem-izq' }, [
      crearEl('span', { class: 'em-leer__rem-av', style: { background: '#a78bfa' } }, [iniciales]),
      crearEl('strong', { class: 'em-leer__rem-nombre' }, [remitente]),
      crearEl('span', { class: 'em-leer__rem-to' }, ['to']),
      crearEl('button', { class: 'em-leer__rem-btn' }, [
        'me',
        crearEl('span', { class: 'em-leer__rem-caret', html: SVG_CARET }),
      ]),
    ]),
    crearEl('span', { class: 'em-leer__rem-fecha' }, ['Nov 20, 11:20']),
  ]);

  /* ─── Adjuntos ─── */
  const tamanoTotal = '12,44 KB';
  const adjBlock = crearEl('div', { class: 'em-leer__adj' }, [
    crearEl('h4', { class: 'em-leer__adj-tit' }, [
      `Attachments (${ADJUNTOS.length} files, ${tamanoTotal})`,
    ]),
    crearEl('div', { class: 'em-leer__adj-list' },
      ADJUNTOS.map(a => crearEl('a', {
        href: '#', class: 'em-leer__adj-item',
        onClick: (e) => e.preventDefault(),
      }, [
        crearEl('span', { class: 'em-leer__adj-ico', html: SVG_FILE }),
        crearEl('span', { class: 'em-leer__adj-nombre' }, [a.nombre]),
        crearEl('span', { class: 'em-leer__adj-size' }, [`(${a.tamano})`]),
      ])),
    ),
  ]);

  return crearEl('div', { class: 'em-pagina' }, [
    crearEl('div', { class: 'em-pagina__layout' }, [
      Sidebar({ activo: 'inbox' }),
      crearEl('section', { class: 'em-main' }, [
        crearEl('article', { class: 'em-leer' }, [
          topbar,
          filaRem,
          crearEl('div', { class: 'em-leer__cuerpo', html: CUERPO_DEMO }),
          adjBlock,
        ]),
      ]),
    ]),
  ]);
};
