import { crearEl } from '../../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../../components/ui/code-preview/code-preview.js';
import { Icono } from '../../../../components/ui/icon/icons.js';
import { corner2 } from '../../../../components/ui/card/card-decoraciones.js';
import { Campo, Input, InputGrupo, Stack, Grid2 } from '../_compartido.js';

export default async () => PaginaShowcase({
  titulo: 'Input group',
  descripcion: 'Inputs con prefix/suffix integrados — íconos, texto, botones, badges. El borde y focus se comparten entre todos los addons. Para currency inputs, password con toggle, búsqueda con icono, URL con dominio fijo, etc.',
  decoracion: corner2(),
  migas: [
    { etiqueta: 'Módulos', href: '#/modulos' },
    { etiqueta: 'Formularios', href: '#/modulos/forms' },
  ],
  hijos: [

    Seccion({
      titulo: '1 · Prefix con ícono',
      descripcion: 'El patrón más común — ícono al inicio del input. Click + focus se comparten para que sienta como un solo elemento.',
      hijos: [VistaCodigo({
        vista: Stack(
          Campo({ label: 'Buscar',
            hijos: InputGrupo({ prefix: Icono('busqueda', { tamano: 14 }), type: 'search', placeholder: 'Productos, clientes, pedidos…' }),
          }),
          Campo({ label: 'Email',
            hijos: InputGrupo({ prefix: Icono('correo', { tamano: 14 }), type: 'email', placeholder: 'tu@email.com' }),
          }),
          Campo({ label: 'Ubicación',
            hijos: InputGrupo({ prefix: Icono('pin', { tamano: 14 }), placeholder: 'Lima, Perú' }),
          }),
        ),
        codigo: `InputGrupo({
  prefix: Icono('busqueda', { tamano: 14 }),
  placeholder: 'Buscar…',
  type: 'search',
})`,
      })],
    }),

    Seccion({
      titulo: '2 · Suffix con ícono o texto',
      descripcion: 'Para mostrar unidad, monedas, dominios, o acciones. El addon de la derecha tiene su propio borde divisorio.',
      hijos: [VistaCodigo({
        vista: Stack(
          Campo({ label: 'Precio',
            hijos: InputGrupo({ prefix: '$', suffix: 'USD', type: 'number', value: '49.99', placeholder: '0.00' }),
          }),
          Campo({ label: 'Peso',
            hijos: InputGrupo({ suffix: 'kg', type: 'number', value: '12.5', placeholder: '0' }),
          }),
          Campo({ label: 'URL del subdominio',
            hijos: InputGrupo({ suffix: '.launchpad.dev', placeholder: 'mi-empresa' }),
          }),
          Campo({ label: 'API key',
            hijos: InputGrupo({ prefix: Icono('candado', { tamano: 13 }), suffix: crearEl('button', { onClick: () => {} }, [Icono('copia', { tamano: 13 }), 'Copiar']), value: 'sk_live_••••••••••••f9ab', readonly: true }),
          }),
        ),
        codigo: `// Suffix puede ser texto, ícono o un botón
InputGrupo({ prefix: '$', suffix: 'USD', type: 'number' })
InputGrupo({ suffix: '.launchpad.dev' })
InputGrupo({ prefix: Icono('candado'), suffix: <button>Copiar</button> })`,
      })],
    }),

    Seccion({
      titulo: '3 · Password con toggle de visibilidad',
      descripcion: 'Botón al final que alterna entre `password` y `text`. UX estándar de signup forms.',
      hijos: [VistaCodigo({
        vista: (() => {
          const wrap = crearEl('div', { style: { maxWidth: '400px' } });
          let visible = false;
          let input;
          let icono;
          const render = () => {
            input = Input({
              type: visible ? 'text' : 'password',
              value: 'M1Contraseña$ecreta',
            });
            icono = crearEl('button', {
              type: 'button',
              style: { background: 'transparent', border: 0, cursor: 'pointer', color: 'var(--muted-foreground)', display: 'inline-flex', padding: '4px' },
              onClick: () => { visible = !visible; render(); },
            }, [Icono(visible ? 'ojo' : 'ojo', { tamano: 14 })]);
            const grupo = crearEl('div', { class: 'input-grupo' }, [
              input,
              crearEl('span', { class: 'input-grupo__addon input-grupo__addon--ghost' }, [icono]),
            ]);
            wrap.replaceChildren(Campo({
              label: 'Contraseña',
              hint: visible ? 'Tu contraseña es visible' : 'Click en el ojo para mostrar/ocultar',
              hijos: grupo,
            }));
          };
          render();
          return wrap;
        })(),
        codigo: `let visible = false;
const toggle = () => {
  visible = !visible;
  input.type = visible ? 'text' : 'password';
};
InputGrupo({
  type: 'password',
  suffix: <button onClick={toggle}>{Icono('ojo')}</button>,
})`,
      })],
    }),

    Seccion({
      titulo: '4 · Search con shortcut hint (⌘K)',
      descripcion: 'Patrón Linear / Notion — input de búsqueda con un atajo de teclado a la derecha. Indica que también funciona con teclado.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { maxWidth: '480px' } }, [
          InputGrupo({
            prefix: Icono('busqueda', { tamano: 14 }),
            suffix: crearEl('kbd', {
              style: { padding: '2px 6px', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '11px', fontWeight: 600, fontFamily: 'inherit', color: 'var(--muted-foreground)' },
            }, ['⌘ K']),
            type: 'search',
            placeholder: 'Buscar todo…',
          }),
        ]),
        codigo: `InputGrupo({
  prefix: Icono('busqueda'),
  suffix: <kbd>⌘ K</kbd>,
  type: 'search',
})`,
      })],
    }),

    Seccion({
      titulo: '5 · Estados con grupo (válido / inválido)',
      descripcion: 'El borde rojo/verde se aplica a todo el grupo. Ideal para validation feedback.',
      hijos: [VistaCodigo({
        vista: Stack(
          Campo({ label: 'Email — disponible', hint: '✓ Este email está disponible',
            hijos: InputGrupo({ prefix: Icono('correo', { tamano: 14 }), suffix: Icono('check', { tamano: 14 }), value: 'yo@launchpad.dev', valido: true }),
          }),
          Campo({ label: 'Subdominio — ocupado', error: 'Ya existe una cuenta con este subdominio',
            hijos: InputGrupo({ suffix: '.launchpad.dev', value: 'acme', invalido: true }),
          }),
        ),
        codigo: `InputGrupo({ valido: true,    suffix: Icono('check') })
InputGrupo({ invalido: true,  prefix: Icono('alerta') })`,
      })],
    }),

    Seccion({
      titulo: '6 · Tarjeta de crédito',
      descripcion: 'El input principal con suffix de logos de marcas. Patrón Stripe Checkout / Square.',
      hijos: [VistaCodigo({
        vista: Grid2(
          Campo({ label: 'Número de tarjeta',
            hijos: InputGrupo({
              prefix: Icono('tarjeta', { tamano: 14 }),
              suffix: crearEl('div', { style: { display: 'inline-flex', gap: '4px' } }, [
                crearEl('span', { style: { padding: '1px 5px', background: '#1a1f71', color: '#fff', fontSize: '9px', fontWeight: 800, borderRadius: '3px', fontFamily: 'serif' } }, ['VISA']),
                crearEl('span', { style: { padding: '1px 5px', background: '#eb001b', color: '#fff', fontSize: '9px', fontWeight: 800, borderRadius: '3px' } }, ['MC']),
                crearEl('span', { style: { padding: '1px 5px', background: '#016fd0', color: '#fff', fontSize: '9px', fontWeight: 800, borderRadius: '3px' } }, ['AMEX']),
              ]),
              placeholder: '1234 5678 9012 3456',
            }),
          }),
          Campo({ label: 'CVV', hijos: InputGrupo({ suffix: Icono('candado', { tamano: 13 }), placeholder: '123' }) }),
        ),
        codigo: `InputGrupo({
  prefix: Icono('tarjeta'),
  suffix: <div>{logos VISA, MC, AMEX}</div>,
  placeholder: '1234 5678 9012 3456',
})`,
      })],
    }),

    Seccion({
      titulo: '7 · Combinaciones avanzadas',
      descripcion: 'Múltiples addons + botones inline para casos pro: voucher input, OTP, coupon, transfer.',
      hijos: [VistaCodigo({
        vista: Stack(
          Campo({ label: 'Código de descuento',
            hijos: InputGrupo({
              prefix: Icono('estrella', { tamano: 13 }),
              suffix: crearEl('button', { style: { padding: '0 12px', background: 'var(--primary)', color: '#fff', border: 0, borderRadius: 0, fontWeight: 600, fontSize: '12px', cursor: 'pointer' } }, ['Aplicar']),
              placeholder: 'WELCOME20',
            }),
          }),
          Campo({ label: 'Transferencia (IBAN)',
            hijos: InputGrupo({
              prefix: 'IBAN',
              suffix: crearEl('button', { style: { background: 'transparent', border: 0, color: 'var(--primary)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600 } }, [Icono('check', { tamano: 12 }), 'Verificar']),
              placeholder: 'PE12 3456 7890 1234 5678',
            }),
          }),
        ),
        codigo: `InputGrupo({
  prefix: 'IBAN',
  suffix: <button onClick={verificar}>Verificar</button>,
  placeholder: 'PE12 3456 7890 1234 5678',
})`,
      })],
    }),

  ],
});
