/**
 * Chat — UI profesional inspirada en plantillas modernas (perfil + rol,
 * tabs con icono, avatares en cada burbuja, header con video/llamada/añadir,
 * input con emoji + adjuntar + voz + send circular, badges multicolor).
 *
 * Layout 2 columnas (sidebar + panel). Reactivo, persistente en localStorage.
 * Theme-aware vía tokens.
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';

/* ─── Constantes ───────────────────────────────────────────────────────── */
const STORAGE_KEY = 'launchpad:chat:v2';
const YO = { id: 'yo', nombre: 'Amiah Burton', rol: 'Software Developer', color: '#a78bfa' };
const HOY = () => new Date().toISOString().slice(0, 10);

/* ─── Datos demo ───────────────────────────────────────────────────────── */
const CONTACTOS = [
  { id: 'mariana', nombre: 'Mariana Zenha',  rol: 'Front-end Developer', online: true,  color: '#ec4899', badgeColor: '#3b82f6' },
  { id: 'john1',   nombre: 'John Doe',       rol: 'Product Manager',     online: true,  color: '#f97316', badgeColor: '#3b82f6' },
  { id: 'carl',    nombre: 'Carl Henson',    rol: 'Designer',            online: false, color: '#8b5cf6', badgeColor: '#ec4899' },
  { id: 'john2',   nombre: 'John Doe',       rol: 'Backend Engineer',    online: false, color: '#0ea5e9', badgeColor: null },
  { id: 'jensen',  nombre: 'Jensen Combs',   rol: 'iOS Developer',       online: true,  color: '#22c55e', badgeColor: null },
  { id: 'yaretzi', nombre: 'Yaretzi Mayo',   rol: 'Marketing Lead',      online: false, color: '#ef4444', badgeColor: null },
  { id: 'lucia',   nombre: 'Lucía Pérez',    rol: 'QA Engineer',         online: true,  color: '#06b6d4', badgeColor: null },
];

const MENSAJES_DEMO = {
  mariana: [
    { autor: 'mariana', texto: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', hora: '8:12 PM', dia: HOY() },
    { autor: 'yo',      texto: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry printing and typesetting industry.', hora: '8:13 PM', dia: HOY() },
    { autor: 'yo',      texto: 'Lorem Ipsum.', hora: '8:13 PM', dia: HOY() },
    { autor: 'mariana', texto: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', hora: '8:15 PM', dia: HOY() },
    { autor: 'yo',      texto: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry printing and typesetting industry.', hora: '8:16 PM', dia: HOY() },
  ],
  john1:   [
    { autor: 'john1', texto: 'Hi, How are you?', hora: '4:32 PM', dia: HOY() },
    { autor: 'yo',    texto: 'Bien, gracias. ¿Tú?', hora: '4:33 PM', dia: HOY() },
    { autor: 'john1', texto: 'Todo perfecto. Mañana revisamos los mockups?', hora: '4:35 PM', dia: HOY() },
    { autor: 'john1', texto: '👀', hora: '4:35 PM', dia: HOY() },
    { autor: 'john1', texto: '¿Te paso el link?', hora: '4:36 PM', dia: HOY() },
  ],
  carl:    [
    { autor: 'carl', tipo: 'foto', texto: '📷 Photo', hora: '05:20 PM', dia: HOY() },
    { autor: 'carl', texto: '¿Qué te parece esta paleta?', hora: '05:24 PM', dia: HOY() },
  ],
  john2:   [{ autor: 'john2', texto: 'Hi, How are you?', hora: 'Yesterday', dia: HOY() }],
  jensen:  [{ autor: 'jensen', tipo: 'video', texto: '🎥 Video', hora: '2 days ago', dia: HOY() }],
  yaretzi: [{ autor: 'yaretzi', texto: 'Confirmamos campaña Q3?', hora: '4 week ago', dia: HOY() }],
  lucia:   [{ autor: 'lucia', texto: 'Probaré el flow esta tarde 🚀', hora: '10:02 AM', dia: HOY() }],
};

/* Cuántos sin leer simulamos por contacto (para los badges) */
const SIN_LEER_DEMO = { john1: 5, carl: 3 };

/* ─── SVG icons inline ─────────────────────────────────────────────────── */
const SVG = {
  buscar:   `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>`,
  config:   `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.36.16.68.4 1 1z"/></svg>`,
  chats:    `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  llamada:  `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  contactos:`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  video:    `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`,
  phone:    `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  userPlus: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>`,
  emoji:    `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
  clip:     `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>`,
  mic:      `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`,
  send:     `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  foto:     `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>`,
  videoTipo:`<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>`,
};

/* ─── Helpers UI ───────────────────────────────────────────────────────── */
const Avatar = ({ nombre, color, online, tamano = 44 }) => {
  const iniciales = nombre.split(/\s+/).slice(0, 2).map(p => p[0]).join('').toUpperCase();
  return crearEl('div', {
    class: ['ch-av', online && 'ch-av--online'],
    style: { width: `${tamano}px`, height: `${tamano}px`, background: color || '#94a3b8' },
  }, [
    crearEl('span', { class: 'ch-av__t' }, [iniciales]),
  ]);
};

const Icono = (svg, cls = 'ch-i') => crearEl('span', { class: cls, html: svg, 'aria-hidden': 'true' });

/* Persistencia */
const cargarEstado = () => {
  try { const r = localStorage.getItem(STORAGE_KEY); if (r) return JSON.parse(r); } catch {}
  return { activoId: 'mariana', mensajes: MENSAJES_DEMO };
};
const guardarEstado = (e) => localStorage.setItem(STORAGE_KEY, JSON.stringify(e));

/* ─── Página ───────────────────────────────────────────────────────────── */
export default async () => {
  const persisted = cargarEstado();
  const tabActiva = senal('chats');
  const activoId  = senal(persisted.activoId || 'mariana');
  const mensajes  = senal({ ...MENSAJES_DEMO, ...(persisted.mensajes || {}) });
  const sinLeer   = senal({ ...SIN_LEER_DEMO });
  const filtro    = senal('');

  efecto(() => guardarEstado({ activoId: activoId.value, mensajes: mensajes.value }));

  /* ── Cabecera del usuario activo (yo) ── */
  const cabYo = crearEl('header', { class: 'ch-side__yo' }, [
    crearEl('div', { class: 'ch-side__yo-info' }, [
      Avatar({ nombre: YO.nombre, color: YO.color, online: true, tamano: 44 }),
      crearEl('div', { class: 'ch-side__yo-textos' }, [
        crearEl('strong', { class: 'ch-side__yo-nombre' }, [YO.nombre]),
        crearEl('span',   { class: 'ch-side__yo-rol' }, [YO.rol]),
      ]),
    ]),
    crearEl('button', { class: 'ch-iconbtn ch-iconbtn--mute', 'aria-label': 'Configuración' }, [Icono(SVG.config)]),
  ]);

  /* ── Buscador ── */
  const inputBuscar = crearEl('input', {
    type: 'search', class: 'ch-buscar__input', placeholder: 'Search here…',
    onInput: (e) => { filtro.value = e.target.value.toLowerCase(); },
  });
  const buscador = crearEl('div', { class: 'ch-buscar' }, [
    inputBuscar,
    crearEl('button', { class: 'ch-buscar__btn', 'aria-label': 'Buscar', html: SVG.buscar }),
  ]);

  /* ── Tabs (botones con icono) ── */
  const tabBtn = (id, icono, etiqueta) => {
    const b = crearEl('button', {
      class: 'ch-tab', onClick: () => { tabActiva.value = id; },
    }, [Icono(icono, 'ch-i'), crearEl('span', null, [etiqueta])]);
    efecto(() => b.classList.toggle('ch-tab--activa', tabActiva.value === id));
    return b;
  };
  const tabs = crearEl('nav', { class: 'ch-tabs', role: 'tablist' }, [
    tabBtn('chats',     SVG.chats,    'Chats'),
    tabBtn('calls',     SVG.llamada,  'Calls'),
    tabBtn('contacts',  SVG.contactos,'Contacts'),
  ]);

  /* ── Lista de conversaciones ── */
  const listaCont = crearEl('div', { class: 'ch-lista', role: 'tabpanel' });

  const renderLista = () => {
    let fuente = CONTACTOS;
    const f = filtro.value.trim();
    if (f) fuente = fuente.filter(x => x.nombre.toLowerCase().includes(f));

    listaCont.replaceChildren(
      crearEl('h4', { class: 'ch-lista__titulo' }, ['Recent chats']),
      ...fuente.map((p) => {
        const ms = mensajes.value[p.id] || [];
        const ult = ms[ms.length - 1];
        const sl = sinLeer.value[p.id] || 0;

        // Icono de tipo en el preview (foto/video)
        const previewNodos = [];
        if (ult?.tipo === 'foto')  previewNodos.push(Icono(SVG.foto, 'ch-conv__t'), crearEl('span', null, ['Photo']));
        else if (ult?.tipo === 'video') previewNodos.push(Icono(SVG.videoTipo, 'ch-conv__t'), crearEl('span', null, ['Video']));
        else previewNodos.push(crearEl('span', null, [ult?.texto || '—']));

        const item = crearEl('button', {
          class: ['ch-conv', activoId.value === p.id && 'ch-conv--activa'],
          onClick: () => {
            activoId.value = p.id;
            const sl2 = { ...sinLeer.value }; delete sl2[p.id];
            sinLeer.value = sl2;
          },
        }, [
          Avatar({ nombre: p.nombre, color: p.color, online: p.online, tamano: 44 }),
          crearEl('div', { class: 'ch-conv__textos' }, [
            crearEl('strong', { class: 'ch-conv__nombre' }, [p.nombre]),
            crearEl('span', { class: 'ch-conv__preview' }, previewNodos),
          ]),
          crearEl('div', { class: 'ch-conv__meta' }, [
            crearEl('span', { class: 'ch-conv__hora' }, [ult?.hora || '']),
            sl > 0 && crearEl('span', {
              class: 'ch-conv__badge',
              style: { background: p.badgeColor || 'var(--primary)' },
            }, [String(sl)]),
          ]),
        ]);
        return item;
      }),
    );
  };
  efecto(renderLista);

  /* ── Panel derecho ── */
  const buscarPersona = (id) => CONTACTOS.find(x => x.id === id) || CONTACTOS[0];

  /* Cabecera del chat activo */
  const cabActiva = crearEl('header', { class: 'ch-main__head' });
  efecto(() => {
    const p = buscarPersona(activoId.value);
    cabActiva.replaceChildren(
      crearEl('div', { class: 'ch-main__head-info' }, [
        Avatar({ nombre: p.nombre, color: p.color, online: p.online, tamano: 44 }),
        crearEl('div', null, [
          crearEl('strong', { class: 'ch-main__head-nombre' }, [p.nombre]),
          crearEl('span',   { class: 'ch-main__head-rol' }, [p.rol]),
        ]),
      ]),
      crearEl('div', { class: 'ch-main__head-acciones' }, [
        crearEl('button', { class: 'ch-iconbtn ch-iconbtn--mute', 'aria-label': 'Videollamada' }, [Icono(SVG.video)]),
        crearEl('button', { class: 'ch-iconbtn ch-iconbtn--mute', 'aria-label': 'Llamada' }, [Icono(SVG.phone)]),
        crearEl('button', { class: 'ch-iconbtn ch-iconbtn--mute', 'aria-label': 'Añadir' }, [Icono(SVG.userPlus)]),
      ]),
    );
  });

  /* Mensajes */
  const listaMsj = crearEl('div', { class: 'ch-msj scroll-discreto' });

  const renderMensajes = () => {
    const id = activoId.value;
    const p = buscarPersona(id);
    const yoCol = YO.color;
    const lista = mensajes.value[id] || [];
    const nodos = [];

    lista.forEach((m) => {
      const yo = m.autor === 'yo';
      const av = yo
        ? Avatar({ nombre: YO.nombre, color: yoCol, online: true, tamano: 36 })
        : Avatar({ nombre: p.nombre, color: p.color, online: p.online, tamano: 36 });

      const burbuja = crearEl('div', {
        class: ['ch-bubble', yo ? 'ch-bubble--yo' : 'ch-bubble--ellos'],
      }, [
        crearEl('p', { class: 'ch-bubble__txt' }, [m.texto]),
      ]);

      const fila = crearEl('div', {
        class: ['ch-fila', yo ? 'ch-fila--yo' : 'ch-fila--ellos'],
      }, [
        av,
        crearEl('div', { class: 'ch-fila__cuerpo' }, [
          burbuja,
          crearEl('span', { class: 'ch-fila__hora' }, [m.hora]),
        ]),
      ]);
      nodos.push(fila);
    });

    listaMsj.replaceChildren(...nodos);
    requestAnimationFrame(() => { listaMsj.scrollTop = listaMsj.scrollHeight; });
  };
  efecto(renderMensajes);

  /* Input + Send */
  const inputMsj = crearEl('input', {
    type: 'text', class: 'ch-input', placeholder: 'Type a message',
    onKeyDown: (e) => { if (e.key === 'Enter') enviar(); },
  });
  const enviar = () => {
    const txt = inputMsj.value.trim();
    if (!txt) return;
    const id = activoId.value;
    const ahora = new Date();
    const h = ahora.getHours(), m = ahora.getMinutes();
    const hh = h % 12 || 12; const ampm = h < 12 ? 'AM' : 'PM';
    const hora = `${hh}:${String(m).padStart(2, '0')} ${ampm}`;
    const ms = [...(mensajes.value[id] || []), { autor: 'yo', texto: txt, hora, dia: HOY() }];
    mensajes.value = { ...mensajes.value, [id]: ms };
    inputMsj.value = '';
  };

  const barraInput = crearEl('footer', { class: 'ch-footer' }, [
    crearEl('button', { class: 'ch-iconbtn ch-iconbtn--mute', 'aria-label': 'Emoji', type: 'button' }, [Icono(SVG.emoji)]),
    crearEl('button', { class: 'ch-iconbtn ch-iconbtn--mute', 'aria-label': 'Adjuntar', type: 'button' }, [Icono(SVG.clip)]),
    crearEl('button', { class: 'ch-iconbtn ch-iconbtn--mute', 'aria-label': 'Voz', type: 'button' }, [Icono(SVG.mic)]),
    inputMsj,
    crearEl('button', {
      class: 'ch-send', type: 'button', onClick: enviar, 'aria-label': 'Enviar',
    }, [Icono(SVG.send)]),
  ]);

  /* Composición final */
  const sidebar = crearEl('aside', { class: 'ch-side' }, [cabYo, buscador, tabs, listaCont]);
  const main = crearEl('section', { class: 'ch-main' }, [cabActiva, listaMsj, barraInput]);

  return crearEl('div', { class: 'ch-pagina' }, [
    crearEl('div', { class: 'ch-pagina__layout' }, [sidebar, main]),
  ]);
};
