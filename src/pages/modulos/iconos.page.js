// Página galería de iconos Unicode/símbolos.
import { crearEl } from '../../utils/helpers/dom.js';
import { senal, efecto } from '../../utils/helpers/reactive.js';
import { TituloPagina } from '../../components/common/page-title/page-title.js';
import { Tarjeta } from '../../components/ui/card/card.js';
import { Campo } from '../../components/ui/input/input.js';

// Lista de iconos con nombre descriptivo para poder filtrar.
const ICONOS = [
  { glifo: '◈', nombre: 'rombo-punto' },
  { glifo: '◉', nombre: 'circulo-punto' },
  { glifo: '◊', nombre: 'rombo' },
  { glifo: '◌', nombre: 'circulo-discontinuo' },
  { glifo: '◐', nombre: 'media-luna' },
  { glifo: '☰', nombre: 'menu-cielo' },
  { glifo: '☯', nombre: 'yin-yang' },
  { glifo: '☼', nombre: 'sol' },
  { glifo: '☾', nombre: 'luna' },
  { glifo: '★', nombre: 'estrella' },
  { glifo: '✦', nombre: 'estrella-cuatro' },
  { glifo: '✧', nombre: 'estrella-vacia' },
  { glifo: '✓', nombre: 'check' },
  { glifo: '✗', nombre: 'cruz' },
  { glifo: '✚', nombre: 'mas-pesado' },
  { glifo: '✉', nombre: 'sobre' },
  { glifo: '⌂', nombre: 'casa' },
  { glifo: '⌘', nombre: 'comando' },
  { glifo: '⌥', nombre: 'opcion' },
  { glifo: '⌫', nombre: 'borrar' },
  { glifo: '⏱', nombre: 'cronometro' },
  { glifo: '⚙', nombre: 'engranaje' },
  { glifo: '⚒', nombre: 'martillos' },
  { glifo: '⚠', nombre: 'advertencia' },
  { glifo: '⛬', nombre: 'mapa-iglesia' },
  { glifo: '⛨', nombre: 'escudo' },
  { glifo: '⛭', nombre: 'engranaje-grande' },
  { glifo: '☷', nombre: 'tierra' },
  { glifo: '☶', nombre: 'montana' },
  { glifo: '☵', nombre: 'agua' },
  { glifo: '☴', nombre: 'viento' },
  { glifo: '☳', nombre: 'trueno' },
  { glifo: '☲', nombre: 'fuego' },
  { glifo: '☱', nombre: 'lago' },
  { glifo: '☰-cielo', nombre: 'cielo' },
  { glifo: '⊿', nombre: 'triangulo-recto' },
  { glifo: '⊟', nombre: 'menos-cuadrado' },
  { glifo: '⊞', nombre: 'mas-cuadrado' },
  { glifo: '⊕', nombre: 'mas-circulo' },
  { glifo: '⊗', nombre: 'cruz-circulo' },
  { glifo: '◰', nombre: 'cuadrado-superior-izquierda' },
  { glifo: '◱', nombre: 'cuadrado-inferior-izquierda' },
  { glifo: '◲', nombre: 'cuadrado-inferior-derecha' },
  { glifo: '◳', nombre: 'cuadrado-superior-derecha' },
  { glifo: '◯', nombre: 'circulo-grande' },
  { glifo: '◊', nombre: 'rombo-doble' },
  { glifo: '↑', nombre: 'flecha-arriba' },
  { glifo: '↓', nombre: 'flecha-abajo' },
  { glifo: '←', nombre: 'flecha-izquierda' },
  { glifo: '→', nombre: 'flecha-derecha' },
  { glifo: '↻', nombre: 'recargar-derecha' },
  { glifo: '↺', nombre: 'recargar-izquierda' },
  { glifo: '∅', nombre: 'vacio' },
  { glifo: '∞', nombre: 'infinito' },
  { glifo: '✱', nombre: 'asterisco-pesado' },
  { glifo: '✻', nombre: 'estrella-seis' },
  { glifo: '✼', nombre: 'estrella-ocho' },
  { glifo: '✿', nombre: 'flor' },
  { glifo: '❀', nombre: 'flor-blanca' },
  { glifo: '❄', nombre: 'copo-nieve' },
  { glifo: '❉', nombre: 'estrella-decorada' },
  { glifo: '❤', nombre: 'corazon' },
  { glifo: '♥', nombre: 'corazon-negro' },
  { glifo: '⚡', nombre: 'rayo' },
  { glifo: '⚓', nombre: 'ancla' },
  { glifo: '⛵', nombre: 'velero' },
  { glifo: '⛔', nombre: 'prohibido' },
];

export default async () => {
  const contenedor = crearEl('div', {
    style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' },
  });

  contenedor.appendChild(
    TituloPagina({
      titulo: 'Iconos',
      descripcion: 'Galería de símbolos Unicode disponibles sin librerías.',
    }),
  );

  const filtro = senal('');

  const buscador = crearEl(
    'div',
    {
      style: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: 'var(--space-4)',
      },
    },
    [
      Campo({
        type: 'search',
        placeholder: 'Buscar icono por nombre...',
        onInput: (e) => filtro.set(e.target.value),
        style: { maxWidth: '320px' },
      }),
    ],
  );

  const grid = crearEl('div', {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
      gap: 'var(--space-2)',
    },
  });

  const renderIconos = () => {
    const q = filtro.get().toLowerCase().trim();
    const filtrados = q
      ? ICONOS.filter((i) => i.nombre.toLowerCase().includes(q))
      : ICONOS;

    grid.replaceChildren(
      ...filtrados.map((icono) =>
        crearEl(
          'div',
          {
            style: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-1)',
              padding: 'var(--space-3)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-surface)',
              textAlign: 'center',
            },
            title: icono.nombre,
          },
          [
            crearEl('span', { style: { fontSize: '1.5rem', lineHeight: 1 } }, [icono.glifo]),
            crearEl(
              'span',
              {
                className: 'text-xs text-muted',
                style: { wordBreak: 'break-word' },
              },
              [icono.nombre],
            ),
          ],
        ),
      ),
    );

    if (filtrados.length === 0) {
      grid.appendChild(
        crearEl(
          'div',
          {
            style: {
              gridColumn: '1 / -1',
              padding: 'var(--space-6)',
              textAlign: 'center',
            },
            className: 'text-muted',
          },
          ['Sin coincidencias.'],
        ),
      );
    }
  };

  efecto(() => renderIconos());

  contenedor.appendChild(
    Tarjeta({
      titulo: 'Catálogo',
      descripcion: 'Filtra escribiendo el nombre del icono.',
      cuerpo: crearEl('div', null, [buscador, grid]),
    }),
  );

  return contenedor;
};
