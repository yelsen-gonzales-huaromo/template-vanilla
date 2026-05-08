/**
 * EmojiPicker — picker vanilla JS sin dependencias.
 *
 *  - 320+ emojis curados en 9 categorías
 *  - Tab "Recientes" con localStorage (24 últimos usados)
 *  - Grid 8 columnas, hover scale, click rápido
 *  - Usa el popover manager (un solo abierto a la vez, sobrevive al scroll,
 *    auto-flip arriba si no cabe abajo, click-fuera/ESC cierra)
 *  - Patrón consistente con pickers/selects: el panel hereda min-width
 *
 * Uso:
 *    import { EmojiPicker } from './_emoji.js';
 *    EmojiPicker({ onPick: (emoji) => textarea.value += emoji });
 */

import { crearEl } from '../../../utils/helpers/dom.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { abrirPanel, cerrarPopoverActivo } from './_popover.js';

// ---------------------------------------------------------------------------
//  Catálogo de emojis (curado, ~320)
// ---------------------------------------------------------------------------
const CATEGORIAS = [
  { id: 'recientes', label: 'Recientes', icono: '🕒' },
  { id: 'caras',     label: 'Caras',     icono: '😀' },
  { id: 'gestos',    label: 'Gestos',    icono: '👋' },
  { id: 'corazon',   label: 'Corazón',   icono: '❤️' },
  { id: 'animales',  label: 'Animales',  icono: '🐶' },
  { id: 'comida',    label: 'Comida',    icono: '🍎' },
  { id: 'viajes',    label: 'Viajes',    icono: '🚗' },
  { id: 'objetos',   label: 'Objetos',   icono: '💻' },
  { id: 'simbolos',  label: 'Símbolos',  icono: '✅' },
  { id: 'banderas',  label: 'Banderas',  icono: '🚩' },
];

const EMOJIS = {
  caras:     ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','😉','😊','😇','🥰','😍','🤩','😘','😗','☺️','😚','😙','🥲','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔','🤐','🤨','😐','😑','😶','😏','😒','🙄','😬','🤥','😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤮','🥵','🥶','🥴','😵','🤯','🤠','🥳','😎','🤓','🧐','😺','😸','😹','😻','😼','😽','🙀','😿','😾'],
  gestos:    ['👋','🤚','🖐','✋','🖖','👌','🤏','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️','👍','👎','👊','✊','🤛','🤜','👏','🙌','👐','🤲','🤝','🙏','💪','🦾','🦵','🦿','🦶','👂','🦻','👃','🧠','🫀','🫁','🦷','🦴','👀','👁','👅','👄'],
  corazon:   ['❤️','🧡','💛','💚','💙','💜','🤎','🖤','🤍','💔','❣️','💕','💞','💓','💗','💖','💘','💝','💟','♥️','💌','💋','💯','💢','💥','💫','💦','💨','🕳','💣','💬','💭','💤'],
  animales:  ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐻‍❄️','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🙈','🙉','🙊','🐒','🦄','🐔','🐧','🐦','🐤','🦅','🦉','🦇','🐺','🐗','🐴','🦓','🦒','🐘','🦏','🦛','🐪','🦘','🐃','🐂','🐄','🐎','🐖','🐏','🐑','🦙','🐐','🦌','🐕','🐩','🐈','🐓','🦃','🦚','🦜','🦢','🦩','🕊','🐝','🐛','🦋','🐌','🐞','🐜','🪲','🦂','🕷','🦗','🦟','🐢','🐍','🦎','🐙','🦑','🦐','🦞','🦀','🐡','🐠','🐟','🐬','🐳','🐋','🦈','🐊','🐅','🐆','🦓','🦍','🦧'],
  comida:    ['🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🍆','🥑','🥦','🥬','🥒','🌶','🫑','🌽','🥕','🫒','🧄','🧅','🥔','🍠','🥐','🥯','🍞','🥖','🥨','🧀','🥚','🍳','🧈','🥞','🧇','🥓','🥩','🍗','🍖','🌭','🍔','🍟','🍕','🥪','🥙','🧆','🌮','🌯','🫔','🥗','🥘','🍝','🍜','🍲','🍛','🍣','🍱','🥟','🦪','🍤','🍙','🍚','🍘','🍥','🥠','🥮','🍢','🍡','🍧','🍨','🍦','🥧','🧁','🍰','🎂','🍮','🍭','🍬','🍫','🍿','🍩','🍪','🌰','🥜','🍯','🥛','🍼','☕','🍵','🧋','🥤','🍶','🍺','🍻','🥂','🍷','🥃','🍸','🍹','🧉'],
  viajes:    ['🚗','🚕','🚙','🚌','🚎','🏎','🚓','🚑','🚒','🚐','🛻','🚚','🚛','🚜','🛴','🚲','🛵','🏍','🛺','🚨','🚔','🚍','🚘','🚖','🚡','🚠','🚟','🚃','🚋','🚞','🚝','🚄','🚅','🚈','🚂','🚆','🚇','🚊','🚉','✈️','🛫','🛬','🛩','💺','🛰','🚀','🛸','🚁','🛶','⛵','🚤','🛥','🛳','⛴','🚢','⚓','⛽','🚧','🚦','🚥','🗺','🗿','🗽','🗼','🏰','🏯','🏟','🎡','🎢','🎠','⛲','⛱','🏖','🏝','⛰','🌋','🗻','🏕','⛺'],
  objetos:   ['💻','⌨️','🖥','🖨','🖱','🖲','💽','💾','💿','📀','🧮','🎥','📽','🎞','📞','☎️','📟','📠','📺','📻','🎙','🎚','🎛','🧭','⏱','⏲','⏰','🕰','⌛','⏳','📡','🔋','🔌','💡','🔦','🕯','🪔','🧯','🛢','💸','💵','💴','💶','💷','💰','💳','💎','⚖️','🪃','🏹','🛠','🔧','🔨','⚒','🪓','🔩','⚙️','🪤','🧱','📦','📫','📮','✉️','📧','📩','📨','📤','📥','📜','📃','📄','📑','📊','📈','📉','📋','📌','📍','📎','🖇','🔖','🔗'],
  simbolos:  ['✅','❌','⛔','🚫','💯','✔️','❎','✖️','➕','➖','➗','♾','™','©','®','〰️','💱','💲','⚕️','♻️','⚜️','🔱','📛','🔰','⭕','✳️','✴️','❇️','#️⃣','*️⃣','0️⃣','1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟','⬆️','↗️','➡️','↘️','⬇️','↙️','⬅️','↖️','↕️','↔️','↩️','↪️','⤴️','⤵️','🔃','🔄','🔙','🔚','🔛','🔜','🔝'],
  banderas:  ['🇵🇪','🇲🇽','🇨🇴','🇦🇷','🇨🇱','🇪🇸','🇺🇸','🇨🇦','🇧🇷','🇪🇨','🇻🇪','🇧🇴','🇵🇾','🇺🇾','🇨🇺','🇩🇴','🇬🇹','🇭🇳','🇸🇻','🇳🇮','🇨🇷','🇵🇦','🇵🇷','🇫🇷','🇩🇪','🇮🇹','🇵🇹','🇬🇧','🇮🇪','🇳🇱','🇧🇪','🇨🇭','🇦🇹','🇸🇪','🇳🇴','🇫🇮','🇩🇰','🇮🇸','🇨🇿','🇵🇱','🇷🇺','🇺🇦','🇯🇵','🇰🇷','🇨🇳','🇮🇳','🇦🇺','🇳🇿','🇿🇦','🇪🇬','🇲🇦','🇳🇬','🇰🇪','🇸🇦','🇦🇪','🇮🇱','🇹🇷','🇹🇭','🇸🇬','🇵🇭','🇲🇾','🇮🇩','🇻🇳'],
};

// ---------------------------------------------------------------------------
//  Recientes (localStorage)
// ---------------------------------------------------------------------------
const STORAGE_KEY = 'launchpad:emojis-recientes';
const MAX_RECIENTES = 32;

const leerRecientes = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
};
const guardarReciente = (emoji) => {
  const lista = leerRecientes().filter((e) => e !== emoji);
  lista.unshift(emoji);
  if (lista.length > MAX_RECIENTES) lista.length = MAX_RECIENTES;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(lista)); } catch {}
};

// ---------------------------------------------------------------------------
//  Componente principal
// ---------------------------------------------------------------------------
export const EmojiPicker = ({
  onPick,
  triggerEtq = '😊',
  tamano = 'md',     // 'sm' | 'md'
} = {}) => {
  let panelRef = null;
  let trigger = null;
  let tabActiva = leerRecientes().length > 0 ? 'recientes' : 'caras';

  const renderGrid = () => {
    if (!panelRef) return;
    const grid = panelRef.querySelector('.emoji-grid');
    grid.replaceChildren();
    const lista = tabActiva === 'recientes' ? leerRecientes() : (EMOJIS[tabActiva] || []);
    if (lista.length === 0) {
      grid.appendChild(crearEl('div', { class: 'emoji-vacio' }, [
        tabActiva === 'recientes' ? 'Aún no has usado emojis. Tu historial aparecerá aquí.' : 'Sin emojis en esta categoría.',
      ]));
      return;
    }
    lista.forEach((emoji) => {
      grid.appendChild(crearEl('button', {
        type: 'button',
        class: 'emoji-cell',
        title: emoji,
        onMouseDown: (e) => e.preventDefault(),
        onClick: (e) => {
          e.preventDefault();
          guardarReciente(emoji);
          if (onPick) onPick(emoji);
          cerrarPopoverActivo();
        },
      }, [emoji]));
    });
  };

  const refrescarTabs = () => {
    if (!panelRef) return;
    panelRef.querySelectorAll('.emoji-tab').forEach((t) => {
      t.classList.toggle('emoji-tab--activa', t.dataset.cat === tabActiva);
    });
  };

  const abrir = () => {
    const tabs = crearEl('div', { class: 'emoji-tabs' },
      CATEGORIAS.map((c) => crearEl('button', {
        type: 'button',
        class: ['emoji-tab', c.id === tabActiva && 'emoji-tab--activa'],
        title: c.label,
        'data-cat': c.id,
        onMouseDown: (e) => e.preventDefault(),
        onClick: (e) => { e.preventDefault(); tabActiva = c.id; refrescarTabs(); renderGrid(); },
      }, [c.icono])),
    );

    panelRef = crearEl('div', { class: 'picker-panel__contenido emoji-panel' }, [
      tabs,
      crearEl('div', { class: 'emoji-grid' }),
    ]);
    renderGrid();
    abrirPanel({ ancla: trigger, contenido: panelRef, claseExtra: 'emoji-panel-wrap', onCerrar: () => { panelRef = null; } });
  };

  trigger = crearEl('button', {
    type: 'button',
    class: ['emoji-trigger', `emoji-trigger--${tamano}`],
    title: 'Insertar emoji',
    'aria-label': 'Insertar emoji',
    onMouseDown: (e) => e.preventDefault(),
    onClick: (e) => { e.preventDefault(); panelRef ? cerrarPopoverActivo() : abrir(); },
  }, [triggerEtq]);

  return trigger;
};

// ---------------------------------------------------------------------------
//  Reactions bar — emoji + contador, click toggle, "+" abre el picker
// ---------------------------------------------------------------------------
export const ReactionsBar = ({
  reacciones = [],   // [{ emoji, count, hasReacted }]
  onToggle,          // (emoji, nuevaCantidad) => void
} = {}) => {
  const wrap = crearEl('div', { class: 'react-bar' });

  // Cada chip mantiene `btn` como variable local — el click se reasocia al
  // crear el reemplazo (nuevo crearChip dentro del listener).
  const crearChip = (r) => {
    const btn = crearEl('button', {
      type: 'button',
      class: ['react-chip', r.hasReacted && 'react-chip--activa'],
      'data-e': r.emoji,
    }, [
      crearEl('span', { class: 'react-chip__emoji' }, [r.emoji]),
      crearEl('span', { class: 'react-chip__count' }, [String(r.count)]),
    ]);
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      r.hasReacted = !r.hasReacted;
      r.count += r.hasReacted ? 1 : -1;
      const nuevo = crearChip(r);
      btn.replaceWith(nuevo);
      onToggle && onToggle(r.emoji, r.count);
    });
    return btn;
  };

  reacciones.forEach((r) => wrap.appendChild(crearChip(r)));

  // Botón "+" (abre el picker para añadir reacciones nuevas)
  const adder = EmojiPicker({
    triggerEtq: '+',
    tamano: 'sm',
    onPick: (emoji) => {
      const existente = wrap.querySelector(`.react-chip[data-e="${CSS.escape(emoji)}"]`);
      if (existente) {
        existente.click();   // toggle si ya existe
      } else {
        const nuevoChip = crearChip({ emoji, count: 1, hasReacted: true });
        wrap.insertBefore(nuevoChip, adder);
        onToggle && onToggle(emoji, 1);
      }
    },
  });
  adder.classList.add('react-add');

  wrap.appendChild(adder);
  return wrap;
};
