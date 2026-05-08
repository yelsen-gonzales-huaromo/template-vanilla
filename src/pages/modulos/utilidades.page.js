// Página showcase de utilidades CSS y tokens del sistema de diseño.
import { crearEl } from '../../utils/helpers/dom.js';
import { TituloPagina } from '../../components/common/page-title/page-title.js';
import { Tarjeta } from '../../components/ui/card/card.js';

// Sección espaciado.
const tarjetaEspaciado = () => {
  const escalas = ['p-1', 'p-2', 'p-4', 'p-6', 'p-8'];

  const grid = crearEl(
    'div',
    {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: 'var(--space-4)',
      },
    },
    escalas.map((cls) =>
      crearEl(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-2)',
          },
        },
        [
          crearEl(
            'div',
            {
              className: cls,
              style: {
                border: '1px dashed var(--color-border)',
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-sm)',
              },
            },
            [
              crearEl(
                'div',
                {
                  style: {
                    width: '40px',
                    height: '40px',
                    background: 'var(--color-primary, #3b82f6)',
                    borderRadius: 'var(--radius-sm)',
                  },
                },
              ),
            ],
          ),
          crearEl('code', { className: 'text-xs' }, [cls]),
        ],
      ),
    ),
  );

  return Tarjeta({
    titulo: 'Espaciado',
    descripcion: 'Clases utilitarias de padding.',
    cuerpo: grid,
  });
};

// Sección colores.
const tarjetaColores = () => {
  const primarios = [100, 200, 300, 500, 900];
  const semanticos = ['success', 'warning', 'danger', 'info'];

  const fila = (titulo, swatches) =>
    crearEl(
      'div',
      { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' } },
      [
        crearEl('h4', { className: 'text-sm' }, [titulo]),
        crearEl(
          'div',
          {
            style: {
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: 'var(--space-3)',
            },
          },
          swatches,
        ),
      ],
    );

  const swatchesPrimarios = primarios.map((tono) =>
    crearEl(
      'div',
      {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-1)',
        },
      },
      [
        crearEl('div', {
          style: {
            height: '64px',
            borderRadius: 'var(--radius-md)',
            background: `var(--color-primary-${tono})`,
            border: '1px solid var(--color-border)',
          },
        }),
        crearEl('code', { className: 'text-xs' }, [`primary-${tono}`]),
      ],
    ),
  );

  const swatchesSemanticos = semanticos.map((nombre) =>
    crearEl(
      'div',
      {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-1)',
        },
      },
      [
        crearEl('div', {
          style: {
            height: '64px',
            borderRadius: 'var(--radius-md)',
            background: `var(--color-${nombre})`,
            border: '1px solid var(--color-border)',
          },
        }),
        crearEl('code', { className: 'text-xs' }, [nombre]),
      ],
    ),
  );

  const cuerpo = crearEl(
    'div',
    { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' } },
    [fila('Escala primaria', swatchesPrimarios), fila('Semánticos', swatchesSemanticos)],
  );

  return Tarjeta({
    titulo: 'Colores',
    descripcion: 'Paleta y colores con significado.',
    cuerpo,
  });
};

// Sección sombras.
const tarjetaSombras = () => {
  const sombras = ['--shadow-xs', '--shadow-sm', '--shadow', '--shadow-md', '--shadow-lg'];

  const grid = crearEl(
    'div',
    {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: 'var(--space-4)',
      },
    },
    sombras.map((token) =>
      crearEl(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-2)',
          },
        },
        [
          crearEl('div', {
            style: {
              width: '100%',
              height: '80px',
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-md)',
              boxShadow: `var(${token})`,
            },
          }),
          crearEl('code', { className: 'text-xs' }, [token]),
        ],
      ),
    ),
  );

  return Tarjeta({
    titulo: 'Sombras',
    descripcion: 'Elevaciones disponibles como tokens.',
    cuerpo: grid,
  });
};

// Sección tipografía.
const tarjetaTipografia = () => {
  const cuerpo = crearEl(
    'div',
    { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } },
    [
      crearEl('h1', null, ['Encabezado h1']),
      crearEl('h2', null, ['Encabezado h2']),
      crearEl('h3', null, ['Encabezado h3']),
      crearEl('h4', null, ['Encabezado h4']),
      crearEl('h5', null, ['Encabezado h5']),
      crearEl('h6', null, ['Encabezado h6']),
      crearEl('p', null, [
        'Párrafo de texto base. Diseñado para lectura cómoda con interlineado generoso.',
      ]),
      crearEl('p', { className: 'text-muted' }, ['Texto atenuado (text-muted).']),
      crearEl('p', { className: 'text-sm' }, ['Texto pequeño (text-sm).']),
      crearEl('p', { className: 'text-xs' }, ['Texto extra pequeño (text-xs).']),
    ],
  );

  return Tarjeta({
    titulo: 'Tipografía',
    descripcion: 'Jerarquía de encabezados y tamaños base.',
    cuerpo,
  });
};

// Sección radios.
const tarjetaRadios = () => {
  const radios = ['--radius-sm', '--radius', '--radius-md', '--radius-lg', '--radius-full'];

  const grid = crearEl(
    'div',
    {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: 'var(--space-4)',
      },
    },
    radios.map((token) =>
      crearEl(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-2)',
          },
        },
        [
          crearEl('div', {
            style: {
              width: '80px',
              height: '80px',
              background: 'var(--color-primary, #3b82f6)',
              borderRadius: `var(${token})`,
            },
          }),
          crearEl('code', { className: 'text-xs' }, [token]),
        ],
      ),
    ),
  );

  return Tarjeta({
    titulo: 'Radios',
    descripcion: 'Curvaturas estandarizadas de borde.',
    cuerpo: grid,
  });
};

export default async () => {
  const contenedor = crearEl('div', {
    style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' },
  });

  contenedor.appendChild(
    TituloPagina({
      titulo: 'Utilidades',
      descripcion: 'Tokens y clases base del sistema de diseño.',
    }),
  );

  contenedor.appendChild(tarjetaEspaciado());
  contenedor.appendChild(tarjetaColores());
  contenedor.appendChild(tarjetaSombras());
  contenedor.appendChild(tarjetaTipografia());
  contenedor.appendChild(tarjetaRadios());

  return contenedor;
};
