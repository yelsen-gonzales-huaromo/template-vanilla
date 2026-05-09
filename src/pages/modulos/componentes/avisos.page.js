/**
 * Avisos modales (SweetAlert2-style) — popups con iconos animados, sin libs.
 *
 * Demo de los 9 tipos: info, exito, error, aviso, pregunta, confirmar (async),
 * imagen, html (libre + botones custom) y autoCierre (con progress bar).
 */
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { Boton } from '../../../components/ui/button/button.js';
import { Aviso } from '../../../components/ui/aviso/aviso.js';
import { crearEl } from '../../../utils/helpers/dom.js';
import { corner4 } from '../../../components/ui/card/card-decoraciones.js';

const Fila = (...nodos) => crearEl('div', {
  style: { display: 'flex', flexWrap: 'wrap', gap: '12px' },
}, nodos);

export default async () => PaginaShowcase({
  titulo: 'Avisos modales animados',
  descripcion:
    'Alertas tipo SweetAlert2 escritas en vanilla — iconos animados con SVG ' +
    'puro (anillo se dibuja, check se traza, X se cruza), barra de progreso ' +
    'para auto-cierre y promesas para confirmaciones. Funciona dentro del ' +
    'componente Modal existente, así heredas focus-trap, ESC para cerrar y ' +
    'click-fuera. Theme-aware (claro / oscuro) por tokens.',
  decoracion: corner4(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    Seccion({
      titulo: '1 · Tipos básicos (info / éxito / error / aviso / pregunta)',
      descripcion: 'Cinco variantes con icono animado distinto. Cada una abre una promesa-libre sobre Modal con un solo botón "OK".',
      hijos: [VistaCodigo({
        vista: Fila(
          Boton({ texto: 'Info',     variante: 'primary',   onClick: () => Aviso.info({ titulo: '¡Hola!', mensaje: 'Esto es información útil.' }) }),
          Boton({ texto: 'Éxito',    variante: 'success',   onClick: () => Aviso.exito({ titulo: '¡Operación correcta!', mensaje: 'Tu cambio se guardó sin problemas.' }) }),
          Boton({ texto: 'Error',    variante: 'danger',    onClick: () => Aviso.error({ titulo: 'Oops…', mensaje: 'Algo salió mal.', enlaceFooter: { texto: '¿Por qué tengo este problema?', href: '#' } }) }),
          Boton({ texto: 'Aviso',    variante: 'warning',   onClick: () => Aviso.aviso({ titulo: '¡Atención!', mensaje: 'Revisa los datos antes de continuar.' }) }),
          Boton({ texto: 'Pregunta', variante: 'secondary', onClick: () => Aviso.pregunta({ titulo: '¿Internet?', mensaje: '¿Esa cosa todavía existe?' }) }),
        ),
        codigo: `import { Aviso } from '../components/ui/aviso/aviso.js';

Aviso.info({  titulo: '¡Hola!',  mensaje: 'Esto es información útil.' });
Aviso.exito({ titulo: '¡Listo!', mensaje: 'Cambio guardado.' });
Aviso.error({ titulo: 'Oops…',   mensaje: 'Algo salió mal.',
              enlaceFooter: { texto: '¿Por qué?', href: '/help' } });
Aviso.aviso({ titulo: '¡Atención!', mensaje: 'Revisa antes de continuar.' });
Aviso.pregunta({ titulo: '¿En serio?' });`,
      })],
    }),

    Seccion({
      titulo: '2 · Confirmar (async / promesa)',
      descripcion: 'Devuelve `Promise<boolean>` — `true` si confirma, `false` si cancela o cierra. Ideal para borrados, cambios destructivos, etc. El botón principal usa `varianteConfirmar` (por defecto `danger`).',
      hijos: [VistaCodigo({
        vista: Fila(
          Boton({
            texto: 'Eliminar registro', variante: 'danger',
            onClick: async () => {
              const ok = await Aviso.confirmar({
                titulo: '¿Estás seguro?',
                mensaje: 'No podrás revertir esta acción.',
                txtConfirmar: 'Sí, eliminar',
                txtCancelar:  'No, cancelar',
                varianteConfirmar: 'danger',
              });
              if (ok) Aviso.exito({ titulo: 'Eliminado', mensaje: 'El registro fue eliminado correctamente.' });
            },
          }),
          Boton({
            texto: 'Aceptar términos', variante: 'primary',
            onClick: async () => {
              const ok = await Aviso.confirmar({
                tipo: 'pregunta',
                titulo: '¿Aceptas los términos?',
                mensaje: 'Al aceptar, tu cuenta queda activa.',
                txtConfirmar: 'Acepto',
                txtCancelar:  'Más tarde',
                varianteConfirmar: 'primary',
              });
              if (ok) Aviso.exito({ titulo: 'Cuenta activa' });
            },
          }),
        ),
        codigo: `const ok = await Aviso.confirmar({
  titulo: '¿Estás seguro?',
  mensaje: 'No podrás revertir esta acción.',
  txtConfirmar: 'Sí, eliminar',
  txtCancelar:  'No, cancelar',
  varianteConfirmar: 'danger',
});
if (ok) await api.eliminar(id);`,
      })],
    }),

    Seccion({
      titulo: '3 · Imagen custom arriba',
      descripcion: 'En vez de un icono animado, muestra una imagen (foto, ilustración, etc.) en la cabecera del modal. Ideal para agradecimientos, banners de cumpleaños, etc.',
      hijos: [VistaCodigo({
        vista: Fila(
          Boton({
            texto: 'Modal con imagen', variante: 'info',
            onClick: () => Aviso.imagen({
              urlImg: './public/img/generic/2.jpg',
              titulo: 'Sweet!',
              mensaje: 'Modal con una imagen custom.',
              textoOk: 'OK',
            }),
          }),
        ),
        codigo: `Aviso.imagen({
  urlImg: '/public/img/generic/2.jpg',
  titulo: 'Sweet!',
  mensaje: 'Modal con una imagen custom.',
});`,
      })],
    }),

    Seccion({
      titulo: '4 · HTML libre + botones custom',
      descripcion: 'Para casos donde necesitas formato rico (negritas, links, listas) o varios botones con acciones distintas. Cada botón puede declarar `variante`, `alClick` y si `cierra` el modal o no.',
      hijos: [VistaCodigo({
        vista: Boton({
          texto: 'HTML example', variante: 'primary',
          onClick: () => Aviso.html({
            titulo: 'HTML example',
            html: 'Puedes usar <b>texto en negrita</b>, <a href="#">enlaces</a> y otros tags HTML.',
            botones: [
              { texto: '👍 ¡Genial!', variante: 'success', alClick: () => Aviso.exito({ titulo: '¡Gracias!' }) },
              { texto: '👎',          variante: 'danger',  alClick: () => Aviso.aviso({ titulo: '¡Lo sentimos!' }) },
            ],
          }),
        }),
        codigo: `Aviso.html({
  titulo: 'HTML example',
  html:   'Puedes usar <b>negrita</b>, <a href="#">links</a>, etc.',
  botones: [
    { texto: '👍 ¡Genial!', variante: 'success',
      alClick: () => Aviso.exito({ titulo: '¡Gracias!' }) },
    { texto: '👎',          variante: 'danger' },
  ],
});`,
      })],
    }),

    Seccion({
      titulo: '5 · Auto-cierre con barra de progreso',
      descripcion: 'Modal que se cierra solo después de N milisegundos. Una barra inferior muestra el countdown visual con animación CSS-only (sin setInterval). El tipo del icono es opcional (`tipo: "none"` lo oculta).',
      hijos: [VistaCodigo({
        vista: Fila(
          Boton({
            texto: 'Auto-cierre 2s', variante: 'primary',
            onClick: () => Aviso.autoCierre({
              titulo: '¡Auto close alert!',
              mensaje: 'Me cerraré en 2 segundos.',
              ms: 2000,
              tipo: 'none',
            }),
          }),
          Boton({
            texto: 'Toast con icono 3s', variante: 'success',
            onClick: () => Aviso.autoCierre({
              titulo: 'Guardado',
              mensaje: 'Los cambios se aplicaron.',
              ms: 3000,
              tipo: 'exito',
            }),
          }),
        ),
        codigo: `Aviso.autoCierre({
  titulo: '¡Auto close alert!',
  mensaje: 'Me cerraré en 2 segundos.',
  ms: 2000,
  tipo: 'none',         // 'info' | 'exito' | 'error' | 'aviso' | 'pregunta' | 'none'
});`,
      })],
    }),

  ],
});
