/**
 * Aviso — alertas modales animadas (estilo SweetAlert2, vanilla, sin libs).
 *
 *   Aviso.info({ titulo, mensaje })          // icono "i" azul
 *   Aviso.exito({ titulo, mensaje })         // check verde animado
 *   Aviso.error({ titulo, mensaje })         // ✕ rojo animado
 *   Aviso.aviso({ titulo, mensaje })         // ⚠ ámbar animado
 *   Aviso.pregunta({ titulo, mensaje })      // ? gris
 *
 *   await Aviso.confirmar({                  // promesa: true/false
 *     titulo: '¿Estás seguro?',
 *     mensaje: 'No podrás revertir esta acción.',
 *     txtConfirmar: 'Sí, eliminar',
 *     txtCancelar:  'Cancelar',
 *     varianteConfirmar: 'danger',
 *   });
 *
 *   Aviso.imagen({                           // modal con imagen arriba
 *     urlImg: '/img.jpg', titulo: 'Sweet!', mensaje: '...',
 *   });
 *
 *   Aviso.html({                             // HTML libre + botones custom
 *     titulo: 'HTML example',
 *     html: '<b>negrita</b>, <a href="#">link</a>',
 *     botones: [
 *       { texto: '👍 Great!', variante: 'success', alClick: () => {} },
 *       { texto: '👎', variante: 'outline' },
 *     ],
 *   });
 *
 *   Aviso.autoCierre({                       // se cierra solo con progress bar
 *     titulo: 'Auto close alert!',
 *     ms: 2500,
 *   });
 *
 * Cada llamada devuelve `{ cerrar }`. `confirmar` además devuelve una Promesa
 * que resuelve a `true` (confirmado) o `false` (cancelado / cerrado).
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { Modal } from '../modal/modal.js';
import { Boton } from '../button/button.js';

/* ─── Iconos animados (SVG inline) ────────────────────────────────────────
   Cada uno es un círculo + figura interior. La animación de entrada vive
   en el CSS via @keyframes. */
const SVG_INFO = `
  <svg class="aviso-icono__svg" viewBox="0 0 80 80" aria-hidden="true">
    <circle class="aviso-icono__anillo" cx="40" cy="40" r="36" fill="none" stroke-width="3"/>
    <line x1="40" y1="32" x2="40" y2="56" stroke-width="4" stroke-linecap="round"/>
    <circle cx="40" cy="22" r="3.5" />
  </svg>`;

const SVG_EXITO = `
  <svg class="aviso-icono__svg" viewBox="0 0 80 80" aria-hidden="true">
    <circle class="aviso-icono__anillo" cx="40" cy="40" r="36" fill="none" stroke-width="3"/>
    <path class="aviso-icono__check" d="M24 42 L36 54 L58 30"
          fill="none" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

const SVG_ERROR = `
  <svg class="aviso-icono__svg" viewBox="0 0 80 80" aria-hidden="true">
    <circle class="aviso-icono__anillo" cx="40" cy="40" r="36" fill="none" stroke-width="3"/>
    <line class="aviso-icono__x1" x1="28" y1="28" x2="52" y2="52" stroke-width="4" stroke-linecap="round"/>
    <line class="aviso-icono__x2" x1="52" y1="28" x2="28" y2="52" stroke-width="4" stroke-linecap="round"/>
  </svg>`;

const SVG_AVISO = `
  <svg class="aviso-icono__svg" viewBox="0 0 80 80" aria-hidden="true">
    <circle class="aviso-icono__anillo" cx="40" cy="40" r="36" fill="none" stroke-width="3"/>
    <line x1="40" y1="26" x2="40" y2="44" stroke-width="4" stroke-linecap="round"/>
    <circle cx="40" cy="54" r="3.5" />
  </svg>`;

const SVG_PREGUNTA = `
  <svg class="aviso-icono__svg" viewBox="0 0 80 80" aria-hidden="true">
    <circle class="aviso-icono__anillo" cx="40" cy="40" r="36" fill="none" stroke-width="3"/>
    <text x="40" y="52" text-anchor="middle"
          font-family="system-ui, sans-serif" font-size="36" font-weight="700"
          fill="currentColor">?</text>
  </svg>`;

const ICONOS = {
  info:     SVG_INFO,
  exito:    SVG_EXITO,
  error:    SVG_ERROR,
  aviso:    SVG_AVISO,
  pregunta: SVG_PREGUNTA,
};

/* ─── Construcción del cuerpo ─────────────────────────────────────────────
   Una function que arma todo el cuerpo del modal con icono + título +
   mensaje + (opcional) imagen arriba + (opcional) HTML libre. */
const construirCuerpo = ({ tipo, titulo, mensaje, urlImg, html, footer }) => {
  const partes = [];

  if (urlImg) {
    partes.push(crearEl('div', { class: 'aviso__imagen' }, [
      crearEl('img', { src: urlImg, alt: '' }),
    ]));
  } else if (tipo && ICONOS[tipo]) {
    partes.push(crearEl('div', {
      class: ['aviso-icono', `aviso-icono--${tipo}`],
      html: ICONOS[tipo],
    }));
  }

  if (titulo) {
    partes.push(crearEl('h2', { class: 'aviso__titulo' }, [titulo]));
  }
  if (html !== undefined) {
    partes.push(crearEl('div', { class: 'aviso__mensaje', html }));
  } else if (mensaje) {
    partes.push(crearEl('p', { class: 'aviso__mensaje' }, [mensaje]));
  }
  if (footer) {
    partes.push(crearEl('div', { class: 'aviso__footer' }, [footer]));
  }

  return crearEl('div', { class: 'aviso' }, partes);
};

/* ─── Helper de apertura básico ──────────────────────────────────────────── */
const abrirAviso = ({ tipo, titulo, mensaje, urlImg, html, botones, footer, autoCierreMs, alCerrar }) => {
  const cuerpo = construirCuerpo({ tipo, titulo, mensaje, urlImg, html, footer });

  // Pie con botones custom (o default "OK")
  const btnNodes = (botones || [{ texto: 'OK', variante: 'primary', cierra: true }]).map(b => {
    const btn = Boton({
      texto: b.texto,
      variante: b.variante || 'primary',
      onClick: () => {
        if (b.alClick) b.alClick();
        if (b.cierra !== false) ref.cerrar();
      },
    });
    return btn;
  });
  const pie = crearEl('div', { class: 'aviso__acciones' }, btnNodes);

  // Auto-cierre con barra de progreso
  let barra = null;
  if (autoCierreMs) {
    barra = crearEl('div', { class: 'aviso__progreso' }, [
      crearEl('div', { class: 'aviso__progreso-valor', style: { animationDuration: `${autoCierreMs}ms` } }),
    ]);
  }

  const ref = Modal.abrir({
    cuerpo: crearEl('div', null, [cuerpo, barra, pie]),
    tamano: 'sm',
    alCerrar,
  });

  // Si auto-cierre activo, programa el close
  if (autoCierreMs) {
    setTimeout(() => ref.cerrar(), autoCierreMs);
  }
  return ref;
};

/* ─── API pública ───────────────────────────────────────────────────────── */
export const Aviso = {
  info({ titulo = 'Información', mensaje = '', textoOk = 'OK' } = {}) {
    return abrirAviso({
      tipo: 'info', titulo, mensaje,
      botones: [{ texto: textoOk, variante: 'primary', cierra: true }],
    });
  },

  exito({ titulo = '¡Listo!', mensaje = '', textoOk = 'OK' } = {}) {
    return abrirAviso({
      tipo: 'exito', titulo, mensaje,
      botones: [{ texto: textoOk, variante: 'success', cierra: true }],
    });
  },

  error({ titulo = 'Oops…', mensaje = 'Algo salió mal.', textoOk = 'Cerrar', enlaceFooter } = {}) {
    return abrirAviso({
      tipo: 'error', titulo, mensaje,
      botones: [{ texto: textoOk, variante: 'warning', cierra: true }],
      footer: enlaceFooter ? crearEl('a', {
        href: enlaceFooter.href || '#', class: 'aviso__footer-enlace',
        target: enlaceFooter.target || '_self',
      }, [enlaceFooter.texto || '¿Por qué tengo este problema?']) : null,
    });
  },

  aviso({ titulo = '¡Atención!', mensaje = '', textoOk = 'OK' } = {}) {
    return abrirAviso({
      tipo: 'aviso', titulo, mensaje,
      botones: [{ texto: textoOk, variante: 'warning', cierra: true }],
    });
  },

  pregunta({ titulo = '¿En serio?', mensaje = '', textoOk = 'OK' } = {}) {
    return abrirAviso({
      tipo: 'pregunta', titulo, mensaje,
      botones: [{ texto: textoOk, variante: 'primary', cierra: true }],
    });
  },

  /** Modal con imagen custom arriba (no usa icono). */
  imagen({ urlImg, titulo = '', mensaje = '', textoOk = 'OK' } = {}) {
    return abrirAviso({
      urlImg, titulo, mensaje,
      botones: [{ texto: textoOk, variante: 'info', cierra: true }],
    });
  },

  /** HTML libre + botones custom. */
  html({ titulo = '', html = '', botones, urlImg } = {}) {
    return abrirAviso({ urlImg, titulo, html, botones });
  },

  /**
   * Confirmación con dos botones. Devuelve Promise<boolean>: true si el
   * usuario confirmó, false si canceló o cerró el modal.
   */
  confirmar({
    titulo = '¿Estás seguro?',
    mensaje = 'No podrás revertir esta acción.',
    txtConfirmar = 'Sí, hacerlo',
    txtCancelar = 'Cancelar',
    varianteConfirmar = 'danger',
    tipo = 'aviso',
  } = {}) {
    return new Promise((resolve) => {
      let resuelto = false;
      const resolver = (v) => {
        if (resuelto) return;
        resuelto = true;
        resolve(v);
      };
      abrirAviso({
        tipo, titulo, mensaje,
        botones: [
          { texto: txtCancelar,  variante: 'secondary', cierra: true, alClick: () => resolver(false) },
          { texto: txtConfirmar, variante: varianteConfirmar, cierra: true, alClick: () => resolver(true) },
        ],
        alCerrar: () => resolver(false),
      });
    });
  },

  /**
   * Modal que se cierra solo después de `ms` milisegundos. Muestra una barra
   * de progreso animada por CSS para indicar el countdown.
   */
  autoCierre({ titulo = '', mensaje = '', ms = 2500, tipo = 'info' } = {}) {
    return abrirAviso({
      tipo: tipo === 'none' ? null : tipo,
      titulo, mensaje,
      botones: [],            // sin botones — cierra solo
      autoCierreMs: ms,
    });
  },
};
