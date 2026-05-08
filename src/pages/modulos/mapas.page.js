// Página showcase de mapas (placeholders sin librerías externas).
import { crearEl } from '../../utils/helpers/dom.js';
import { senal, efecto } from '../../utils/helpers/reactive.js';
import { TituloPagina } from '../../components/common/page-title/page-title.js';
import { Tarjeta } from '../../components/ui/card/card.js';
import { Campo } from '../../components/ui/input/input.js';
import { Insignia } from '../../components/ui/badge/badge.js';

const UBICACIONES = [
  {
    ciudad: 'Madrid, España',
    lat: 40.4168,
    lng: -3.7038,
    descripcion: 'Capital y centro financiero ibérico.',
  },
  {
    ciudad: 'Ciudad de México, México',
    lat: 19.4326,
    lng: -99.1332,
    descripcion: 'Megaurbe latinoamericana.',
  },
  {
    ciudad: 'Buenos Aires, Argentina',
    lat: -34.6037,
    lng: -58.3816,
    descripcion: 'Puerto y capital austral.',
  },
  {
    ciudad: 'Bogotá, Colombia',
    lat: 4.711,
    lng: -74.0721,
    descripcion: 'Ciudad andina sobre la sabana.',
  },
  {
    ciudad: 'Santiago, Chile',
    lat: -33.4489,
    lng: -70.6693,
    descripcion: 'Al pie de la cordillera.',
  },
];

const SUGERENCIAS = [
  'Calle Gran Vía 28, Madrid',
  'Avenida Reforma 222, CDMX',
  'Av. Corrientes 1234, Buenos Aires',
  'Carrera 7 #71-21, Bogotá',
  'Av. Providencia 1208, Santiago',
];

const tarjetaMapaGlobal = () => {
  // Placeholder visual del mapa.
  const placeholder = crearEl(
    'div',
    {
      style: {
        position: 'relative',
        height: '320px',
        borderRadius: 'var(--radius-md)',
        background: 'linear-gradient(135deg, #1e3a8a, #0f172a)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        color: 'white',
      },
    },
    [
      // Decoración SVG sencilla simulando continentes.
      (() => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 600 320');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.style.position = 'absolute';
        svg.style.inset = '0';
        svg.style.opacity = '0.35';

        const polys = [
          '80,80 160,60 200,110 160,170 100,180',
          '230,90 320,70 360,130 300,200 240,180',
          '380,100 470,90 510,140 480,200 410,210',
          '180,220 260,210 280,270 200,290',
          '420,230 500,220 520,280 460,300',
        ];
        polys.forEach((p) => {
          const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
          poly.setAttribute('points', p);
          poly.setAttribute('fill', '#60a5fa');
          svg.appendChild(poly);
        });
        return svg;
      })(),
      crearEl(
        'div',
        {
          style: {
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
          },
        },
        [
          crearEl('div', { style: { fontSize: '3rem' } }, ['🌍']),
          crearEl('div', { style: { fontSize: 'var(--text-lg)', marginTop: 'var(--space-2)' } }, [
            'Mapa interactivo',
          ]),
        ],
      ),
    ],
  );

  return Tarjeta({
    titulo: 'Mapa global (placeholder)',
    descripcion: 'Reemplaza por Leaflet o Mapbox en producción.',
    cuerpo: placeholder,
  });
};

const tarjetaMarcadores = () => {
  const lista = crearEl(
    'ul',
    {
      style: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
      },
    },
    UBICACIONES.map((u) =>
      crearEl(
        'li',
        {
          style: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--space-3)',
            padding: 'var(--space-3)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-surface)',
          },
        },
        [
          crearEl('span', { style: { fontSize: '1.25rem' } }, ['📍']),
          crearEl('div', { style: { flex: 1 } }, [
            crearEl(
              'div',
              {
                style: {
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                },
              },
              [
                crearEl('strong', null, [u.ciudad]),
                Insignia({
                  texto: `${u.lat.toFixed(2)}, ${u.lng.toFixed(2)}`,
                  variante: 'muted',
                }),
              ],
            ),
            crearEl('div', { className: 'text-sm text-muted' }, [u.descripcion]),
          ]),
        ],
      ),
    ),
  );

  return Tarjeta({
    titulo: 'Marcadores',
    descripcion: 'Cinco ubicaciones con coordenadas y descripción.',
    cuerpo: lista,
  });
};

const tarjetaGeocodificacion = () => {
  const consulta = senal('');
  const sugerenciasDom = crearEl('ul', {
    style: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-1)',
    },
  });

  efecto(() => {
    const q = consulta.get().toLowerCase().trim();
    const items = q
      ? SUGERENCIAS.filter((s) => s.toLowerCase().includes(q))
      : SUGERENCIAS;

    sugerenciasDom.replaceChildren(
      ...items.map((s) =>
        crearEl(
          'li',
          {
            style: {
              padding: 'var(--space-2) var(--space-3)',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              cursor: 'pointer',
            },
          },
          [crearEl('span', { style: { marginRight: 'var(--space-2)' } }, ['🔎']), s],
        ),
      ),
    );
  });

  const cuerpo = crearEl(
    'div',
    { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } },
    [
      Campo({
        type: 'search',
        placeholder: 'Escribe una dirección...',
        onInput: (e) => consulta.set(e.target.value),
      }),
      sugerenciasDom,
    ],
  );

  return Tarjeta({
    titulo: 'Geocodificación',
    descripcion: 'Búsqueda con sugerencias simuladas.',
    cuerpo,
  });
};

export default async () => {
  const contenedor = crearEl('div', {
    style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' },
  });

  contenedor.appendChild(
    TituloPagina({
      titulo: 'Mapas',
      descripcion: 'Plantillas de integración cartográfica.',
    }),
  );

  // Aviso informativo.
  contenedor.appendChild(
    crearEl(
      'div',
      {
        style: {
          padding: 'var(--space-3) var(--space-4)',
          borderRadius: 'var(--radius-md)',
          background: 'var(--color-info-soft, rgba(59,130,246,0.1))',
          color: 'var(--color-info, #3b82f6)',
          fontSize: 'var(--text-sm)',
        },
      },
      [
        'Para integrar Leaflet/Mapbox, usa el evento ',
        crearEl('code', null, ['cuandoMontado']),
        ' y carga la librería externa.',
      ],
    ),
  );

  contenedor.appendChild(tarjetaMapaGlobal());
  contenedor.appendChild(tarjetaMarcadores());
  contenedor.appendChild(tarjetaGeocodificacion());

  return contenedor;
};
