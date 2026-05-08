import { crearEl } from '../../../utils/helpers/dom.js';
import { iniciales } from '../../../utils/formatters/string.js';

/**
 * Avatar — representación visual de un usuario.
 *
 *   Avatar({
 *     nombre, src?, alt?,
 *     tamano: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl',
 *     forma:  'circular' (default) | 'cuadrado',
 *     estado: 'online' | 'ausente' | 'ocupado' | 'offline',  // dot indicator
 *     ring:   boolean,                                        // borde primary (seleccionado)
 *     badge:  nodo opcional (count, ícono +, etc.) — se posiciona arriba-derecha
 *     coloreado: 'auto' (default) — color por hash del nombre
 *   })
 */

// Paleta de gradientes — color consistente por hash del nombre
const PALETA = [
  'linear-gradient(135deg, #06b6d4, #1d4ed8)',
  'linear-gradient(135deg, #10b981, #059669)',
  'linear-gradient(135deg, #f59e0b, #d97706)',
  'linear-gradient(135deg, #ef4444, #b91c1c)',
  'linear-gradient(135deg, #8b5cf6, #6d28d9)',
  'linear-gradient(135deg, #ec4899, #be185d)',
  'linear-gradient(135deg, #14b8a6, #0f766e)',
  'linear-gradient(135deg, #6366f1, #4338ca)',
];

const colorPorNombre = (nombre) => {
  let h = 0;
  for (let i = 0; i < nombre.length; i++) h = (h << 5) - h + nombre.charCodeAt(i);
  return PALETA[Math.abs(h) % PALETA.length];
};

export const Avatar = ({
  nombre = '', src = '', tamano = 'md', alt,
  forma = 'circular', estado, ring = false, badge,
  coloreado = 'auto',
  ...resto
} = {}) => {
  const cls = [
    'avatar',
    tamano !== 'md' && `avatar--${tamano}`,
    forma !== 'circular' && `avatar--${forma}`,
    ring && 'avatar--ring',
    estado && 'avatar--con-estado',
  ];

  const estilo = (!src && coloreado === 'auto' && nombre)
    ? { background: colorPorNombre(nombre) }
    : null;

  const interior = src
    ? [crearEl('img', { src, alt: alt || nombre, loading: 'lazy' })]
    : [iniciales(nombre)];

  // Si hay estado o badge, envolvemos en un wrapper para posicionar relativo
  if (estado || badge) {
    const av = crearEl('span', {
      class: cls, style: estilo,
      'aria-label': src ? null : nombre,
      role: src ? null : 'img',
    }, interior);
    return crearEl('span', { class: 'avatar-wrap', ...resto }, [
      av,
      estado && crearEl('span', { class: ['avatar__estado', `avatar__estado--${estado}`],
        'aria-label': estado }),
      badge && crearEl('span', { class: 'avatar__badge' }, [badge]),
    ]);
  }

  return crearEl('span', {
    class: cls, style: estilo,
    'aria-label': src ? null : nombre,
    role: src ? null : 'img',
    ...resto,
  }, interior);
};
