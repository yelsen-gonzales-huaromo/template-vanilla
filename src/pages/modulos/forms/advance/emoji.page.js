/**
 * Emoji button — picker vanilla JS sin dependencias.
 */
import { crearEl } from '../../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../../utils/helpers/reactive.js';
import { PaginaShowcase, Seccion } from '../../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../../components/ui/code-preview/code-preview.js';
import { Icono } from '../../../../components/ui/icon/icons.js';
import { corner4 } from '../../../../components/ui/card/card-decoraciones.js';
import { Campo, Stack, Input } from '../_compartido.js';
import { EmojiPicker, ReactionsBar } from '../_emoji.js';

export default async () => PaginaShowcase({
  titulo: 'Emoji button',
  descripcion: 'Picker de emojis vanilla JS — 320+ emojis curados en 9 categorías + tab "Recientes" con localStorage. Tabs, grid 8 columnas, hover scale, popover manager (un solo abierto a la vez, sobrevive al scroll, auto-flip si no cabe abajo). Reacciones tipo Slack/GitHub Issues con toggle y contador. Sin dependencias externas.',
  decoracion: corner4(),
  migas: [
    { etiqueta: 'Módulos', href: '#/modulos' },
    { etiqueta: 'Formularios', href: '#/modulos/forms' },
  ],
  hijos: [

    Seccion({
      titulo: '1 · Botón emoji junto a textarea — patrón chat',
      descripcion: 'Pattern Slack/WhatsApp/Teams — el picker está al lado del input. Click en el 😊 abre el panel; click en un emoji lo inserta en el cursor del textarea (o al final si no hay foco) y se guarda en "Recientes" automáticamente.',
      hijos: [VistaCodigo({
        vista: (() => {
          const textarea = crearEl('textarea', {
            class: 'input',
            placeholder: 'Escribe un mensaje…',
            rows: 3,
            style: { resize: 'none' },
          });
          const btnEnviar = crearEl('button', {
            type: 'button',
            class: 'btn',
            disabled: true,
          }, [Icono('correo', { tamano: 14 }), 'Enviar']);
          textarea.addEventListener('input', () => {
            btnEnviar.disabled = textarea.value.trim() === '';
          });
          return crearEl('div', { style: { maxWidth: '560px' } }, [
            crearEl('div', { style: { display: 'flex', gap: '8px', alignItems: 'flex-start' } }, [
              crearEl('div', { style: { flex: 1 } }, [textarea]),
              EmojiPicker({
                onPick: (emoji) => {
                  // Inserta en la posición del cursor
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  textarea.value = textarea.value.slice(0, start) + emoji + textarea.value.slice(end);
                  textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
                  textarea.focus();
                  textarea.dispatchEvent(new Event('input', { bubbles: true }));
                },
              }),
            ]),
            crearEl('div', { style: { display: 'flex', justifyContent: 'flex-end', marginBlockStart: '8px' } }, [btnEnviar]),
          ]);
        })(),
        codigo: `import { EmojiPicker } from '../_emoji.js';

EmojiPicker({
  onPick: (emoji) => {
    // Inserta en la posición del cursor del textarea
    const s = textarea.selectionStart;
    textarea.value = textarea.value.slice(0, s) + emoji + textarea.value.slice(s);
    textarea.focus();
  },
})`,
      })],
    }),

    Seccion({
      titulo: '2 · Reactions bar — patrón GitHub Issues / Slack',
      descripcion: 'Lista de emojis con contador. Click en un chip toggle tu reacción (incrementa/decrementa el count). El botón "+" punteado abre el picker para añadir reacciones nuevas. Los activos se resaltan con color primary.',
      hijos: [VistaCodigo({
        vista: ReactionsBar({
          reacciones: [
            { emoji: '👍', count: 12, hasReacted: true },
            { emoji: '❤️', count: 5, hasReacted: false },
            { emoji: '🎉', count: 3, hasReacted: false },
            { emoji: '🚀', count: 8, hasReacted: true },
            { emoji: '👀', count: 2, hasReacted: false },
          ],
          onToggle: (emoji, n) => console.log('toggle', emoji, '→', n),
        }),
        codigo: `import { ReactionsBar } from '../_emoji.js';

ReactionsBar({
  reacciones: [
    { emoji: '👍', count: 12, hasReacted: true  },
    { emoji: '❤️', count: 5,  hasReacted: false },
    { emoji: '🎉', count: 3,  hasReacted: false },
  ],
  onToggle: (emoji, nuevoCount) => api.reaccionar(post, emoji),
})`,
      })],
    }),

    Seccion({
      titulo: '3 · Status — emoji + texto (estilo Slack/Linear)',
      descripcion: 'Selector de estado con emoji + frase corta. El emoji actual aparece a la izquierda del input — click sobre él para cambiarlo. Útil para perfiles de usuario, channels de Slack, status en Linear.',
      hijos: [VistaCodigo({
        vista: (() => {
          const emoji = senal('🚀');
          const texto = senal('En modo build profundo');
          const eco = crearEl('div', {
            style: {
              fontSize: '12.5px', color: 'var(--muted-foreground)',
              marginBlockStart: '8px', fontVariantNumeric: 'tabular-nums',
            },
          });
          efecto(() => { eco.textContent = `Estado: ${emoji.value}  ${texto.value}`; });

          const input = crearEl('input', {
            class: 'input',
            value: texto.peek(),
            placeholder: '¿Qué estás haciendo?',
            style: { border: 0, padding: 0, background: 'transparent', flex: 1, fontSize: '13.5px' },
            onInput: (e) => texto.value = e.target.value,
          });

          const emojiBtn = EmojiPicker({
            triggerEtq: emoji.peek(),
            tamano: 'sm',
            onPick: (e) => { emoji.value = e; emojiBtn.textContent = e; },
          });
          emojiBtn.style.fontSize = '16px';

          const grupo = crearEl('div', {
            style: {
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '8px 8px 8px 6px',
              background: 'var(--surface)',
              border: '1px solid var(--input)',
              borderRadius: 'var(--radius)',
              maxWidth: '380px', width: '100%',
            },
          }, [emojiBtn, input]);

          return Campo({ label: 'Estado actual', hijos: crearEl('div', null, [grupo, eco]) });
        })(),
        codigo: `const emoji = senal('🚀');
const texto = senal('');

EmojiPicker({
  triggerEtq: emoji.peek(),
  tamano: 'sm',
  onPick: (e) => emoji.value = e,
})

<input class="input" placeholder="¿Qué estás haciendo?"
       onInput={e => texto.value = e.target.value} />`,
      })],
    }),

    Seccion({
      titulo: '4 · Botones inline — varios tamaños',
      descripcion: 'El picker tiene 2 tamaños: `md` (38 px, default) para barras de chat y formularios, y `sm` (28 px circular) para reacciones inline o toolbars compactos. Comparte el mismo panel y catálogo.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' } }, [
          EmojiPicker({ tamano: 'md' }),
          EmojiPicker({ tamano: 'sm' }),
          EmojiPicker({ tamano: 'sm', triggerEtq: '➕' }),
          crearEl('span', { style: { fontSize: '12.5px', color: 'var(--muted-foreground)' } }, ['md (default) · sm circular · sm con icono custom']),
        ]),
        codigo: `EmojiPicker({ tamano: 'md' })                         // 38px cuadrado
EmojiPicker({ tamano: 'sm' })                         // 28px círculo
EmojiPicker({ tamano: 'sm', triggerEtq: '➕' })         // icono custom`,
      })],
    }),

  ],
});
