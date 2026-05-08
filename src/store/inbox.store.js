/**
 * Store reactivo del INBOX de notificaciones del navbar (panel de la campana).
 * No confundir con `notifications.store.js` (toasts efímeros).
 *
 * Cada notificación: { id, autor, avatar, mensaje, icono, fechaIso, leida }
 * Las señales `nuevas` / `anteriores` se calculan a partir de `items` y la
 * marca temporal — el panel se suscribe y se re-renderiza solo.
 */
import { senal, calculado } from '../utils/helpers/reactive.js';
import { idUnico } from '../utils/helpers/uid.js';

const ahora = () => new Date().toISOString();
const haceMs = (ms) => new Date(Date.now() - ms).toISOString();

// Mock inicial — 5 notificaciones representativas (3 nuevas, 2 anteriores).
const items = senal([
  {
    id: idUnico('n'),
    autor: 'Emma Watson',
    avatar: { tipo: 'iniciales', valor: 'EW', color: 'rose' },
    mensaje: 'respondió a tu comentario: "Hello world 🥰"',
    icono: 'chat',
    fechaIso: haceMs(60_000),  // ahora
    leida: false,
  },
  {
    id: idUnico('n'),
    autor: 'Albert Brooks',
    avatar: { tipo: 'iniciales', valor: 'AB', color: 'cyan' },
    mensaje: 'reaccionó al estado de Mia',
    icono: 'corazon',
    fechaIso: haceMs(9 * 3600_000),  // 9h
    leida: false,
  },
  {
    id: idUnico('n'),
    autor: 'Sistema',
    avatar: { tipo: 'icono', valor: 'campana', color: 'emerald' },
    mensaje: 'Tu informe semanal está listo',
    icono: 'reportes',
    fechaIso: haceMs(11 * 3600_000),  // 11h
    leida: false,
  },
  {
    id: idUnico('n'),
    autor: 'Pronóstico',
    avatar: { tipo: 'icono', valor: 'sol', color: 'amber' },
    mensaje: 'Hoy se prevé una mínima de 20°C en California',
    icono: 'sol',
    fechaIso: haceMs(24 * 3600_000),  // 1d
    leida: true,
  },
  {
    id: idUnico('n'),
    autor: 'María L.',
    avatar: { tipo: 'iniciales', valor: 'ML', color: 'violet' },
    mensaje: 'te asignó el ticket #4821',
    icono: 'soporte',
    fechaIso: haceMs(2 * 24 * 3600_000),  // 2d
    leida: true,
  },
]);

// Una notificación es "nueva" si lleva menos de 12h y no está marcada como leída.
const UMBRAL_NUEVA_MS = 12 * 3600_000;

const nuevas = calculado(() =>
  items.value.filter((n) => !n.leida && (Date.now() - new Date(n.fechaIso).getTime()) < UMBRAL_NUEVA_MS)
);
const anteriores = calculado(() =>
  items.value.filter((n) => n.leida || (Date.now() - new Date(n.fechaIso).getTime()) >= UMBRAL_NUEVA_MS)
);
const totalNoLeidas = calculado(() => items.value.filter((n) => !n.leida).length);
const haySinLeer = calculado(() => totalNoLeidas.value > 0);

export const estadoInbox = {
  items,
  nuevas,
  anteriores,
  totalNoLeidas,
  haySinLeer,

  marcarLeida(id) {
    items.value = items.value.map((n) => (n.id === id ? { ...n, leida: true } : n));
  },

  marcarTodasLeidas() {
    items.value = items.value.map((n) => ({ ...n, leida: true }));
  },

  push(notificacion) {
    const entrada = {
      id: idUnico('n'),
      fechaIso: ahora(),
      leida: false,
      ...notificacion,
    };
    items.value = [entrada, ...items.value];
    return entrada.id;
  },

  eliminar(id) {
    items.value = items.value.filter((n) => n.id !== id);
  },
};
