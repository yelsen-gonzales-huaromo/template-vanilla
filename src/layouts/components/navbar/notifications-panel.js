/**
 * Panel de notificaciones (campana del navbar) — referencia: Falcon.
 *
 * Estructura:
 *   ┌────────────────────────────────────────┐
 *   │ Notifications      Marcar todas leídas │
 *   ├────────────────────────────────────────┤
 *   │ NUEVAS                                 │
 *   │  ◉ Emma Watson respondió...            │
 *   │     💬 Just now                        │
 *   │  ◉ Albert Brooks reaccionó...          │
 *   │     ❤ 9hr                              │
 *   ├────────────────────────────────────────┤
 *   │ ANTERIORES                             │
 *   │  ◐ El pronóstico hoy muestra...        │
 *   │     ☀ 1d                               │
 *   ├────────────────────────────────────────┤
 *   │             Ver todas                  │
 *   └────────────────────────────────────────┘
 *
 * Reactividad: el panel se construye una vez y un `efecto` rerenderiza la
 * lista cuando cambian `nuevas` / `anteriores`. Click en una entrada la
 * marca como leída → se mueve automáticamente de NUEVAS a ANTERIORES.
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { efecto } from '../../../utils/helpers/reactive.js';
import { Avatar } from '../../../components/ui/avatar/avatar.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { estadoInbox } from '../../../store/inbox.store.js';
import { cerrarMenuActivo } from '../../../components/ui/dropdown/dropdown.js';
import { formatearRelativo } from '../../../utils/formatters/date.js';

// Mapeo color → fondo de avatar (para iniciales).
const COLOR_AVATAR = {
  rose:    '#f43f5e',
  cyan:    '#06b6d4',
  emerald: '#10b981',
  amber:   '#f59e0b',
  violet:  '#8b5cf6',
  blue:    '#3b82f6',
};

const renderAvatar = (av) => {
  if (av?.tipo === 'icono') {
    return crearEl('div', {
      class: 'inbox__avatar inbox__avatar--icono',
      style: { backgroundColor: COLOR_AVATAR[av.color] || COLOR_AVATAR.blue },
    }, [Icono(av.valor, { tamano: 18 })]);
  }
  if (av?.tipo === 'iniciales') {
    return crearEl('div', {
      class: 'inbox__avatar inbox__avatar--iniciales',
      style: { backgroundColor: COLOR_AVATAR[av.color] || COLOR_AVATAR.blue },
    }, [av.valor]);
  }
  return Avatar({ nombre: 'Usuario', tamano: 'sm' });
};

const renderItem = (n) => {
  const fila = crearEl('button', {
    type: 'button',
    class: ['inbox__item', !n.leida && 'inbox__item--no-leida'],
    onClick: (e) => {
      e.stopPropagation();
      estadoInbox.marcarLeida(n.id);
      cerrarMenuActivo();
    },
  }, [
    renderAvatar(n.avatar),
    crearEl('div', { class: 'inbox__cuerpo' }, [
      crearEl('p', { class: 'inbox__texto' }, [
        crearEl('strong', null, [n.autor + ' ']),
        n.mensaje,
      ]),
      crearEl('div', { class: 'inbox__meta' }, [
        crearEl('span', { class: 'inbox__meta-icono', 'aria-hidden': 'true' }, [
          Icono(n.icono || 'chat', { tamano: 12 }),
        ]),
        crearEl('span', null, [formatearRelativo(new Date(n.fechaIso))]),
      ]),
    ]),
    !n.leida && crearEl('span', { class: 'inbox__punto', 'aria-label': 'Sin leer' }),
  ]);
  return fila;
};

const renderSeccion = (titulo, lista, vacioMsg) => {
  if (!lista.length) return null;
  return crearEl('div', { class: 'inbox__seccion' }, [
    crearEl('div', { class: 'inbox__seccion-titulo' }, [titulo]),
    ...lista.map(renderItem),
  ]);
};

export const PanelNotificaciones = () => {
  const lista = crearEl('div', { class: 'inbox__lista scroll-discreto' });

  efecto(() => {
    const nuevas = estadoInbox.nuevas.value;
    const anteriores = estadoInbox.anteriores.value;

    if (!nuevas.length && !anteriores.length) {
      lista.replaceChildren(crearEl('div', { class: 'inbox__vacio' }, [
        Icono('campana', { tamano: 28 }),
        crearEl('p', null, ['No tienes notificaciones']),
      ]));
      return;
    }

    lista.replaceChildren(
      ...[
        renderSeccion('NUEVAS', nuevas),
        renderSeccion('ANTERIORES', anteriores),
      ].filter(Boolean),
    );
  });

  const btnMarcarTodas = crearEl('button', {
    type: 'button',
    class: 'inbox__accion',
    onClick: (e) => {
      e.stopPropagation();
      estadoInbox.marcarTodasLeidas();
    },
  }, ['Marcar todas leídas']);

  const btnVerTodas = crearEl('button', {
    type: 'button',
    class: 'inbox__ver-todas',
    onClick: (e) => {
      e.stopPropagation();
      cerrarMenuActivo();
    },
  }, ['Ver todas']);

  return crearEl('div', { class: 'inbox' }, [
    crearEl('div', { class: 'inbox__cabecera' }, [
      crearEl('h3', { class: 'inbox__titulo' }, ['Notificaciones']),
      btnMarcarTodas,
    ]),
    lista,
  ]);
};
