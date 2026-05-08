/**
 * Chat — sistema de mensajería profesional con 3 variantes visuales:
 *   - WhatsApp:  bubbles verde/gris, palomitas, pegadas a su lado
 *   - Messenger: bubbles azul circular, reacciones, look más juvenil
 *   - Workspace: estilo Slack/Linear, sin bubbles, plano profesional
 *
 * Multi-channel (WhatsApp, Messenger, Telegram, Email, Interno) + bots
 * con quick replies + status indicators + attachments + reactions +
 * typing indicator + drawer de detalle + responsive mobile-first.
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { EmojiPicker } from '../../modulos/forms/_emoji.js';

// ===========================================================================
//  Catálogo de canales (multi-canal: WhatsApp, Messenger, Email, etc.)
// ===========================================================================
const CANALES = [
  { id: 'todos',     label: 'Todos',     icono: 'rejilla9',  color: '#3b82f6' },
  { id: 'whatsapp',  label: 'WhatsApp',  icono: 'chat',      color: '#25d366', emoji: 'WA' },
  { id: 'messenger', label: 'Messenger', icono: 'chat',      color: '#0084ff', emoji: 'MS' },
  { id: 'telegram',  label: 'Telegram',  icono: 'enlace',    color: '#0088cc', emoji: 'TG' },
  { id: 'email',     label: 'Email',     icono: 'correo',    color: '#ea4335', emoji: 'EM' },
  { id: 'interno',   label: 'Equipo',    icono: 'crm',       color: '#8b5cf6', emoji: 'IN' },
];

const colorCanal = (id) => CANALES.find((c) => c.id === id)?.color || '#64748b';
const labelCanal = (id) => CANALES.find((c) => c.id === id)?.label || id;

// ===========================================================================
//  Datos demo — conversaciones (con variedad de canales)
// ===========================================================================
const CONVERSACIONES_DEMO = [
  {
    id: 'c1', canal: 'whatsapp',
    contacto: { nombre: 'Ana García', avatar: 'AG', color: '#ec4899', telefono: '+51 999 888 777', online: true, escribiendo: false },
    estado: 'abierta', etiquetas: ['cliente-vip'], asignado: 'Tú',
    sinLeer: 2, fijada: true,
    ultimoMensaje: '¿Tienes 5 min ahora?',
    fecha: '10:32',
    mensajes: [
      { id: 'm1', autor: 'ellos', texto: 'Hola! Vi su catálogo y me interesa el plan Pro 🙌', hora: '10:14', estado: 'leido' },
      { id: 'm2', autor: 'yo', texto: '¡Hola Ana! Te puedo ayudar con eso. ¿Para cuántos usuarios?', hora: '10:15', estado: 'leido' },
      { id: 'm3', autor: 'ellos', texto: 'Para unos 8 personas en mi equipo', hora: '10:18', estado: 'leido' },
      { id: 'm4', autor: 'yo', texto: 'Perfecto, el plan Pro cubre eso. ¿Te paso una demo?', hora: '10:20', estado: 'leido', reacciones: ['👍'] },
      { id: 'm5', autor: 'ellos', tipo: 'imagen', url: 'https://picsum.photos/seed/cat/400/300', hora: '10:25', estado: 'leido' },
      { id: 'm6', autor: 'ellos', texto: 'Te paso una captura del flujo que necesitamos automatizar', hora: '10:25', estado: 'leido' },
      { id: 'm7', autor: 'yo', texto: '¡Perfecto! Eso lo cubrimos sin problema 💪', hora: '10:28', estado: 'leido' },
      { id: 'm8', autor: 'ellos', texto: '¿Tienes 5 min ahora? Quería revisar las métricas en vivo.', hora: '10:32', estado: 'enviado' },
    ],
  },
  {
    id: 'c2', canal: 'messenger',
    contacto: { nombre: 'Carlos Mendoza', avatar: 'CM', color: '#8b5cf6', online: false, ultVisto: 'Hace 1h' },
    estado: 'pendiente', etiquetas: ['soporte'], asignado: 'María',
    sinLeer: 0,
    ultimoMensaje: 'Perfecto, gracias!',
    fecha: '09:48',
    mensajes: [
      { id: 'm1', autor: 'ellos', texto: 'Hola, no me llega el email de verificación', hora: '09:30', estado: 'leido' },
      { id: 'm2', autor: 'bot', texto: '¡Hola Carlos! Soy el asistente automático. ¿Podrías confirmar tu email?', hora: '09:30', estado: 'leido', botName: 'Asistente IA' },
      { id: 'm3', autor: 'ellos', texto: 'carlos@empresa.com', hora: '09:31', estado: 'leido' },
      { id: 'm4', autor: 'bot', texto: 'Encontré tu cuenta. Te reenvié el email — revisa la bandeja de spam también.', hora: '09:31', estado: 'leido', botName: 'Asistente IA' },
      { id: 'm5', autor: 'ellos', texto: 'Perfecto, gracias!', hora: '09:48', estado: 'leido', reacciones: ['❤️'] },
    ],
  },
  {
    id: 'c3', canal: 'telegram',
    contacto: { nombre: 'María Rodríguez', avatar: 'MR', color: '#06b6d4', online: true },
    estado: 'abierta', etiquetas: ['proveedor'], asignado: 'Tú',
    sinLeer: 0,
    ultimoMensaje: 'Te paso el documento.',
    fecha: 'Ayer',
    mensajes: [
      { id: 'm1', autor: 'ellos', texto: 'Hola, te envío la propuesta actualizada', hora: 'Ayer 16:22', estado: 'leido' },
      { id: 'm2', autor: 'ellos', tipo: 'archivo', nombre: 'Propuesta_Q3_v2.pdf', tamano: '2.4 MB', hora: 'Ayer 16:22', estado: 'leido' },
      { id: 'm3', autor: 'yo', texto: 'Genial, lo revisaré ahora', hora: 'Ayer 16:30', estado: 'leido' },
      { id: 'm4', autor: 'ellos', texto: 'Te paso el documento.', hora: 'Ayer 17:00', estado: 'leido' },
    ],
  },
  {
    id: 'c4', canal: 'email',
    contacto: { nombre: 'Equipo de Producto', avatar: 'EP', color: '#22c55e', online: false, esGrupo: true },
    estado: 'abierta', etiquetas: ['interno'], asignado: 'Equipo',
    sinLeer: 5,
    ultimoMensaje: 'Reunión a las 4pm',
    fecha: 'Ayer',
    mensajes: [
      { id: 'm1', autor: 'ellos', texto: 'Reunión a las 4pm en la sala grande', hora: 'Ayer 11:00', estado: 'leido' },
    ],
  },
  {
    id: 'c5', canal: 'whatsapp',
    contacto: { nombre: 'Luis Fernández', avatar: 'LF', color: '#f97316', online: false, ultVisto: 'Hace 2 días' },
    estado: 'resuelta', etiquetas: ['cliente'], asignado: 'Diego',
    sinLeer: 0,
    ultimoMensaje: 'Listo el deploy a staging.',
    fecha: 'Lun',
    mensajes: [
      { id: 'm1', autor: 'ellos', texto: 'Listo el deploy a staging.', hora: 'Lun 15:00', estado: 'leido' },
    ],
  },
  {
    id: 'c6', canal: 'whatsapp',
    contacto: { nombre: 'Distribuidora Lima SAC', avatar: 'DL', color: '#0ea5e9', online: true, esEmpresa: true },
    estado: 'abierta', etiquetas: ['proveedor', 'urgente'], asignado: 'Tú',
    sinLeer: 1,
    ultimoMensaje: 'Confirmamos el pedido para el viernes',
    fecha: '14:20',
    mensajes: [
      { id: 'm1', autor: 'ellos', texto: 'Buenas tardes, confirmamos el pedido para el viernes', hora: '14:20', estado: 'enviado' },
    ],
  },
];

const QUICK_REPLIES = [
  '¡Gracias por contactarnos!',
  '¿En qué podemos ayudarte?',
  'Te respondemos en breve',
  'Compártenos tu correo',
];

// ===========================================================================
//  Helpers
// ===========================================================================
const Avatar = ({ nombre, color, tamano = 40, esGrupo = false }) => crearEl('div', {
  class: 'ch-avatar',
  style: {
    width: `${tamano}px`, height: `${tamano}px`,
    background: color,
    fontSize: `${Math.round(tamano * 0.36)}px`,
  },
}, [
  esGrupo ? Icono('crm', { tamano: Math.round(tamano * 0.5) }) : nombre,
]);

const StatusDot = (estado) => {
  if (estado === 'enviando') return Icono('reloj', { tamano: 11 });
  if (estado === 'enviado') return crearEl('span', { class: 'ch-tick' }, ['✓']);
  if (estado === 'entregado') return crearEl('span', { class: 'ch-tick' }, ['✓✓']);
  if (estado === 'leido') return crearEl('span', { class: 'ch-tick ch-tick--leido' }, ['✓✓']);
  return null;
};

const CanalBadge = (canalId) => {
  const c = CANALES.find((x) => x.id === canalId);
  if (!c || canalId === 'todos') return null;
  return crearEl('span', {
    class: 'ch-canal-badge',
    style: { background: c.color },
    title: c.label,
  }, [c.emoji]);
};

const EstadoBadge = (estado) => crearEl('span', {
  class: ['ch-estado', `ch-estado--${estado}`],
}, [estado]);

// ===========================================================================
//  Página principal
// ===========================================================================
export default async () => {
  const variante = senal('whatsapp');           // 'whatsapp' | 'messenger' | 'workspace'
  const canalActivo = senal('todos');
  const idActiva = senal(CONVERSACIONES_DEMO[0].id);
  const filtroBusqueda = senal('');
  const conversaciones = senal(JSON.parse(JSON.stringify(CONVERSACIONES_DEMO)));
  const escribiendo = senal(false);
  const drawerAbierto = senal(false);
  const mobileVista = senal('lista');           // 'lista' | 'conv' (solo móvil)

  const wrap = crearEl('div', { class: 'ch-pagina' });
  efecto(() => {
    wrap.dataset.variante = variante.value;
    wrap.dataset.mobile = mobileVista.value;
  });

  // -------------------------------------------------------------------------
  //  Header de la página (titulo + variant switcher)
  // -------------------------------------------------------------------------
  const header = crearEl('div', { class: 'ch-page-header' }, [
    crearEl('div', null, [
      crearEl('h1', null, ['Mensajería']),
      crearEl('p', null, ['Centraliza WhatsApp, Messenger, Email y chats internos en una sola bandeja.']),
    ]),
    crearEl('div', { class: 'ch-variantes' },
      [
        { id: 'whatsapp',  label: 'WhatsApp' },
        { id: 'messenger', label: 'Messenger' },
        { id: 'workspace', label: 'Workspace' },
      ].map((v) => {
        const btn = crearEl('button', {
          type: 'button', class: 'ch-variantes__btn',
          onClick: () => { variante.value = v.id; },
        }, [v.label]);
        efecto(() => btn.classList.toggle('ch-variantes__btn--activa', variante.value === v.id));
        return btn;
      }),
    ),
  ]);

  // -------------------------------------------------------------------------
  //  Sidebar de canales (vertical, izquierda)
  // -------------------------------------------------------------------------
  const channelsBar = crearEl('aside', { class: 'ch-channels' });
  CANALES.forEach((c) => {
    const total = c.id === 'todos' ? null : conversaciones.peek().filter((x) => x.canal === c.id).length;
    const sinLeer = (c.id === 'todos'
      ? conversaciones.peek().reduce((s, x) => s + x.sinLeer, 0)
      : conversaciones.peek().filter((x) => x.canal === c.id).reduce((s, x) => s + x.sinLeer, 0));
    const btn = crearEl('button', {
      type: 'button', class: 'ch-channel',
      title: c.label,
      onClick: () => { canalActivo.value = c.id; },
    }, [
      crearEl('span', { class: 'ch-channel__ico', style: { '--c': c.color } }, [
        c.id === 'todos' ? Icono('rejilla9', { tamano: 18 }) :
        c.id === 'email' ? Icono('correo', { tamano: 18 }) :
        c.id === 'telegram' ? Icono('enlace', { tamano: 18 }) :
        c.id === 'interno' ? Icono('crm', { tamano: 18 }) :
        Icono('chat', { tamano: 18 }),
      ]),
      crearEl('span', { class: 'ch-channel__lbl' }, [c.label]),
      sinLeer > 0 && crearEl('span', { class: 'ch-channel__count' }, [String(sinLeer)]),
    ]);
    efecto(() => btn.classList.toggle('ch-channel--activo', canalActivo.value === c.id));
    channelsBar.appendChild(btn);
  });

  // -------------------------------------------------------------------------
  //  Lista de conversaciones (filtrable)
  // -------------------------------------------------------------------------
  const listaWrap = crearEl('div', { class: 'ch-lista' });

  const renderLista = () => {
    listaWrap.replaceChildren();
    // Search bar
    const busqueda = crearEl('div', { class: 'ch-lista__buscar' }, [
      Icono('busqueda', { tamano: 14 }),
      crearEl('input', {
        type: 'search', class: 'input input--sm',
        placeholder: 'Buscar conversación o contacto…',
        value: filtroBusqueda.peek(),
        onInput: (e) => { filtroBusqueda.value = e.target.value; renderLista(); },
      }),
    ]);
    listaWrap.appendChild(busqueda);

    const items = crearEl('div', { class: 'ch-lista__items' });
    const q = filtroBusqueda.value.trim().toLowerCase();
    const filtradas = conversaciones.value.filter((c) => {
      if (canalActivo.value !== 'todos' && c.canal !== canalActivo.value) return false;
      if (q && !c.contacto.nombre.toLowerCase().includes(q) && !c.ultimoMensaje.toLowerCase().includes(q)) return false;
      return true;
    });

    if (filtradas.length === 0) {
      items.appendChild(crearEl('div', { class: 'ch-lista__vacio' }, [
        Icono('busqueda', { tamano: 28 }),
        crearEl('p', null, ['Sin resultados']),
      ]));
    } else {
      // Fijadas primero
      const ordenadas = [...filtradas].sort((a, b) => (b.fijada ? 1 : 0) - (a.fijada ? 1 : 0));
      ordenadas.forEach((c) => items.appendChild(renderItemLista(c)));
    }
    listaWrap.appendChild(items);
  };

  const renderItemLista = (c) => {
    const item = crearEl('button', {
      type: 'button',
      class: ['ch-conv', c.id === idActiva.value && 'ch-conv--activa'],
      onClick: () => {
        idActiva.value = c.id;
        // Marcar como leída
        const ts = JSON.parse(JSON.stringify(conversaciones.peek()));
        const t = ts.find((x) => x.id === c.id);
        if (t) t.sinLeer = 0;
        conversaciones.value = ts;
        mobileVista.value = 'conv';
      },
    }, [
      crearEl('div', { class: 'ch-conv__avatar' }, [
        Avatar({ nombre: c.contacto.avatar, color: c.contacto.color, tamano: 44, esGrupo: c.contacto.esGrupo }),
        c.contacto.online && crearEl('span', { class: 'ch-conv__online' }),
        CanalBadge(c.canal),
      ]),
      crearEl('div', { class: 'ch-conv__cuerpo' }, [
        crearEl('div', { class: 'ch-conv__head' }, [
          crearEl('span', { class: 'ch-conv__nombre' }, [
            c.fijada && crearEl('span', { class: 'ch-conv__pin', title: 'Fijada' }, [Icono('marcador', { tamano: 11 })]),
            c.contacto.nombre,
          ]),
          crearEl('span', { class: 'ch-conv__hora' }, [c.fecha]),
        ]),
        crearEl('div', { class: 'ch-conv__sub' }, [
          crearEl('span', { class: 'ch-conv__msg' }, [c.ultimoMensaje]),
          c.sinLeer > 0
            ? crearEl('span', { class: 'ch-conv__badge' }, [String(c.sinLeer)])
            : null,
        ]),
        c.etiquetas && c.etiquetas.length > 0 && crearEl('div', { class: 'ch-conv__tags' },
          c.etiquetas.map((t) => crearEl('span', { class: ['ch-tag', `ch-tag--${t}`] }, [t])),
        ),
      ]),
    ]);
    return item;
  };

  efecto(renderLista);

  // -------------------------------------------------------------------------
  //  Vista de conversación (mensajes + composer + header)
  // -------------------------------------------------------------------------
  const convWrap = crearEl('section', { class: 'ch-conv-vista' });

  const renderConv = () => {
    const c = conversaciones.value.find((x) => x.id === idActiva.value);
    if (!c) {
      convWrap.replaceChildren(crearEl('div', { class: 'ch-vacio' }, [
        Icono('chat', { tamano: 48 }),
        crearEl('p', null, ['Selecciona una conversación para empezar']),
      ]));
      return;
    }

    // ===== Header =====
    const header = crearEl('header', { class: 'ch-conv-vista__head' }, [
      crearEl('button', {
        type: 'button', class: 'ch-back', title: 'Volver',
        onClick: () => mobileVista.value = 'lista',
      }, [Icono('chevron_l', { tamano: 18 })]),
      crearEl('div', { class: 'ch-conv-vista__avatar' }, [
        Avatar({ nombre: c.contacto.avatar, color: c.contacto.color, tamano: 38, esGrupo: c.contacto.esGrupo }),
        c.contacto.online && crearEl('span', { class: 'ch-conv__online ch-conv__online--md' }),
      ]),
      crearEl('div', { class: 'ch-conv-vista__info' }, [
        crearEl('div', { class: 'ch-conv-vista__nombre' }, [
          c.contacto.nombre,
          CanalBadge(c.canal),
        ]),
        crearEl('div', { class: 'ch-conv-vista__estado' }, [
          c.contacto.online ? 'en línea' :
          c.contacto.escribiendo ? 'escribiendo…' :
          (c.contacto.ultVisto || 'desconectado'),
        ]),
      ]),
      crearEl('div', { class: 'ch-conv-vista__acciones' }, [
        crearEl('button', { type: 'button', class: 'ch-icon-btn', title: 'Llamada de voz' }, [Icono('reloj', { tamano: 16 })]),
        crearEl('button', { type: 'button', class: 'ch-icon-btn', title: 'Videollamada' }, [Icono('monitor_play', { tamano: 16 })]),
        crearEl('button', { type: 'button', class: 'ch-icon-btn', title: 'Buscar' }, [Icono('busqueda', { tamano: 16 })]),
        crearEl('button', {
          type: 'button', class: 'ch-icon-btn', title: 'Información del contacto',
          onClick: () => drawerAbierto.value = !drawerAbierto.peek(),
        }, [Icono('info', { tamano: 16 })]),
      ]),
    ]);

    // ===== Mensajes =====
    const hilo = crearEl('div', { class: 'ch-mensajes' });
    let ultimaFecha = '';
    c.mensajes.forEach((m, i) => {
      // Separador de fecha (simple — extraer del 'hora' si tiene 'Ayer' o 'Lun')
      const fechaSep = m.hora.includes('Ayer') ? 'Ayer' : (m.hora.match(/^(Lun|Mar|Mié|Jue|Vie|Sáb|Dom)/) || [])[0];
      if (fechaSep && fechaSep !== ultimaFecha) {
        hilo.appendChild(crearEl('div', { class: 'ch-fecha-sep' }, [crearEl('span', null, [fechaSep])]));
        ultimaFecha = fechaSep;
      } else if (i === 0) {
        hilo.appendChild(crearEl('div', { class: 'ch-fecha-sep' }, [crearEl('span', null, ['Hoy'])]));
        ultimaFecha = 'Hoy';
      }
      hilo.appendChild(renderMensaje(m, c));
    });

    // Typing indicator
    if (escribiendo.value) {
      hilo.appendChild(crearEl('div', { class: 'ch-msg ch-msg--ellos' }, [
        crearEl('div', { class: 'ch-bubble ch-bubble--typing' }, [
          crearEl('span', { class: 'ch-dot' }), crearEl('span', { class: 'ch-dot' }), crearEl('span', { class: 'ch-dot' }),
        ]),
      ]));
    }

    // ===== Quick replies (sugeridas para bots) =====
    const quickReplies = crearEl('div', { class: 'ch-quick' },
      QUICK_REPLIES.map((q) => crearEl('button', {
        type: 'button', class: 'ch-quick__btn',
        onClick: () => enviarMensaje(q),
      }, [q])),
    );

    // ===== Composer =====
    const ta = crearEl('textarea', {
      class: 'ch-composer__input',
      placeholder: 'Escribe un mensaje…',
      rows: 1,
      onInput: (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
      },
      onKeyDown: (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          if (ta.value.trim()) { enviarMensaje(ta.value); ta.value = ''; ta.style.height = 'auto'; }
        }
      },
    });

    const composer = crearEl('div', { class: 'ch-composer' }, [
      crearEl('button', { type: 'button', class: 'ch-composer__btn', title: 'Adjuntar archivo' }, [Icono('imagen_mas', { tamano: 18 })]),
      EmojiPicker({
        triggerEtq: '😊', tamano: 'sm',
        onPick: (e) => { ta.value += e; ta.focus(); },
      }),
      crearEl('button', { type: 'button', class: 'ch-composer__btn', title: 'Plantillas' }, [Icono('texto_aa', { tamano: 18 })]),
      ta,
      crearEl('button', { type: 'button', class: 'ch-composer__btn', title: 'Nota de voz' }, [Icono('volumen', { tamano: 18 })]),
      crearEl('button', {
        type: 'button', class: 'ch-composer__send',
        title: 'Enviar (Enter)',
        onClick: () => { if (ta.value.trim()) { enviarMensaje(ta.value); ta.value = ''; ta.style.height = 'auto'; } },
      }, [Icono('navegar', { tamano: 16 })]),
    ]);

    convWrap.replaceChildren(header, hilo, quickReplies, composer);

    // Auto-scroll al final
    requestAnimationFrame(() => { hilo.scrollTop = hilo.scrollHeight; });
  };

  // -------------------------------------------------------------------------
  //  Render de un mensaje (cambia según variante)
  // -------------------------------------------------------------------------
  const renderMensaje = (m, conv) => {
    const esYo = m.autor === 'yo';
    const esBot = m.autor === 'bot';
    const wrap = crearEl('div', {
      class: ['ch-msg', esYo ? 'ch-msg--yo' : 'ch-msg--ellos', esBot && 'ch-msg--bot'],
    });

    // Avatar (en variante workspace se muestra al lado de cada mensaje)
    if (!esYo && variante.value === 'workspace') {
      wrap.appendChild(Avatar({
        nombre: esBot ? '🤖' : conv.contacto.avatar,
        color: esBot ? '#a855f7' : conv.contacto.color,
        tamano: 32,
      }));
    }

    const cuerpo = crearEl('div', { class: 'ch-msg__cuerpo' });

    // Header del mensaje (solo workspace)
    if (variante.value === 'workspace') {
      cuerpo.appendChild(crearEl('div', { class: 'ch-msg__head' }, [
        crearEl('span', { class: 'ch-msg__autor' }, [
          esYo ? 'Tú' : (esBot ? (m.botName || 'Bot') : conv.contacto.nombre),
        ]),
        esBot && crearEl('span', { class: 'ch-msg__bot-tag' }, ['BOT']),
        crearEl('span', { class: 'ch-msg__hora' }, [m.hora]),
      ]));
    }

    // Bubble / contenido
    const bubble = crearEl('div', { class: 'ch-bubble' });

    if (esBot && variante.value !== 'workspace') {
      bubble.appendChild(crearEl('div', { class: 'ch-bubble__bot-tag' }, [
        Icono('asistente', { tamano: 11 }), m.botName || 'Bot',
      ]));
    }

    if (m.tipo === 'imagen') {
      bubble.appendChild(crearEl('img', {
        class: 'ch-bubble__img',
        src: m.url, alt: 'Adjunto',
      }));
    } else if (m.tipo === 'archivo') {
      bubble.appendChild(crearEl('div', { class: 'ch-bubble__archivo' }, [
        crearEl('div', { class: 'ch-bubble__archivo-ico' }, [Icono('reportes', { tamano: 22 })]),
        crearEl('div', { class: 'ch-bubble__archivo-info' }, [
          crearEl('div', { class: 'ch-bubble__archivo-nombre' }, [m.nombre]),
          crearEl('div', { class: 'ch-bubble__archivo-meta' }, [m.tamano]),
        ]),
        crearEl('button', { type: 'button', class: 'ch-bubble__archivo-dl', title: 'Descargar' }, [Icono('descargar', { tamano: 14 })]),
      ]));
    } else {
      bubble.appendChild(crearEl('span', { class: 'ch-bubble__texto' }, [m.texto]));
    }

    // Footer del bubble (hora + status, sólo en variantes whatsapp/messenger)
    if (variante.value !== 'workspace') {
      bubble.appendChild(crearEl('span', { class: 'ch-bubble__meta' }, [
        m.hora,
        esYo && StatusDot(m.estado),
      ]));
    }

    cuerpo.appendChild(bubble);

    // Reacciones
    if (m.reacciones && m.reacciones.length) {
      cuerpo.appendChild(crearEl('div', { class: 'ch-msg__reacciones' },
        m.reacciones.map((e) => crearEl('span', { class: 'ch-reaccion' }, [e])),
      ));
    }

    wrap.appendChild(cuerpo);
    return wrap;
  };

  // -------------------------------------------------------------------------
  //  Acciones
  // -------------------------------------------------------------------------
  const enviarMensaje = (texto) => {
    const ts = JSON.parse(JSON.stringify(conversaciones.peek()));
    const c = ts.find((x) => x.id === idActiva.peek());
    if (!c) return;
    const ahora = new Date();
    const hora = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;
    c.mensajes.push({
      id: 'm' + Date.now(), autor: 'yo', texto, hora, estado: 'enviando',
    });
    c.ultimoMensaje = texto;
    c.fecha = hora;
    conversaciones.value = ts;

    // Simular cambio de estado
    setTimeout(() => actualizarEstadoUltimo('enviado'), 400);
    setTimeout(() => actualizarEstadoUltimo('entregado'), 1200);
    setTimeout(() => actualizarEstadoUltimo('leido'), 2500);
  };

  const actualizarEstadoUltimo = (estado) => {
    const ts = JSON.parse(JSON.stringify(conversaciones.peek()));
    const c = ts.find((x) => x.id === idActiva.peek());
    if (!c || c.mensajes.length === 0) return;
    c.mensajes[c.mensajes.length - 1].estado = estado;
    conversaciones.value = ts;
  };

  // -------------------------------------------------------------------------
  //  Drawer de detalle del contacto
  // -------------------------------------------------------------------------
  const drawer = crearEl('aside', { class: 'ch-drawer' });
  const renderDrawer = () => {
    const c = conversaciones.value.find((x) => x.id === idActiva.value);
    if (!c) return;
    drawer.replaceChildren(
      crearEl('div', { class: 'ch-drawer__head' }, [
        crearEl('h3', null, ['Información']),
        crearEl('button', {
          type: 'button', class: 'ch-icon-btn',
          onClick: () => drawerAbierto.value = false,
        }, [Icono('cerrar', { tamano: 16 })]),
      ]),
      crearEl('div', { class: 'ch-drawer__cuerpo' }, [
        // Hero
        crearEl('div', { class: 'ch-drawer__hero' }, [
          Avatar({ nombre: c.contacto.avatar, color: c.contacto.color, tamano: 80, esGrupo: c.contacto.esGrupo }),
          crearEl('h4', null, [c.contacto.nombre]),
          c.contacto.telefono && crearEl('p', null, [c.contacto.telefono]),
          crearEl('div', { class: 'ch-drawer__chips' }, [
            crearEl('span', { class: 'ch-chip', style: { background: colorCanal(c.canal), color: '#fff' } }, [labelCanal(c.canal)]),
            EstadoBadge(c.estado),
          ]),
        ]),
        // Acciones rápidas
        crearEl('div', { class: 'ch-drawer__acciones' }, [
          crearEl('button', { type: 'button', class: 'ch-drawer__accion' }, [Icono('reloj', { tamano: 16 }), 'Llamar']),
          crearEl('button', { type: 'button', class: 'ch-drawer__accion' }, [Icono('monitor_play', { tamano: 16 }), 'Video']),
          crearEl('button', { type: 'button', class: 'ch-drawer__accion' }, [Icono('marcador', { tamano: 16 }), 'Fijar']),
          crearEl('button', { type: 'button', class: 'ch-drawer__accion' }, [Icono('volumen_mute', { tamano: 16 }), 'Silenciar']),
        ]),
        // Detalles
        crearEl('div', { class: 'ch-drawer__seccion' }, [
          crearEl('div', { class: 'ch-drawer__lbl' }, ['Asignado a']),
          crearEl('div', { class: 'ch-drawer__valor' }, [c.asignado || '—']),
        ]),
        crearEl('div', { class: 'ch-drawer__seccion' }, [
          crearEl('div', { class: 'ch-drawer__lbl' }, ['Etiquetas']),
          crearEl('div', { class: 'ch-conv__tags' },
            (c.etiquetas || []).map((t) => crearEl('span', { class: ['ch-tag', `ch-tag--${t}`] }, [t])),
          ),
        ]),
        crearEl('div', { class: 'ch-drawer__seccion' }, [
          crearEl('div', { class: 'ch-drawer__lbl' }, ['Notas internas']),
          crearEl('textarea', {
            class: 'input', rows: 4,
            placeholder: 'Notas privadas (no visibles para el contacto)…',
          }),
        ]),
        crearEl('div', { class: 'ch-drawer__seccion' }, [
          crearEl('div', { class: 'ch-drawer__lbl' }, ['Conversación']),
          crearEl('div', { class: 'ch-drawer__stats' }, [
            crearEl('div', null, [
              crearEl('strong', null, [String(c.mensajes.length)]),
              crearEl('span', null, ['Mensajes']),
            ]),
            crearEl('div', null, [
              crearEl('strong', null, [c.contacto.online ? 'Activo' : 'Offline']),
              crearEl('span', null, ['Estado']),
            ]),
          ]),
        ]),
      ]),
    );
  };

  efecto(() => {
    drawer.classList.toggle('ch-drawer--abierto', drawerAbierto.value);
    if (drawerAbierto.value) renderDrawer();
  });

  efecto(renderConv);

  // -------------------------------------------------------------------------
  //  Montaje
  // -------------------------------------------------------------------------
  wrap.appendChild(header);
  wrap.appendChild(crearEl('div', { class: 'ch-cuerpo' }, [
    channelsBar,
    listaWrap,
    convWrap,
    drawer,
  ]));
  return wrap;
};
