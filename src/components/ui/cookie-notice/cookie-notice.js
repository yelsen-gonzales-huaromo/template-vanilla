/**
 * AvisoCookies — banner de consentimiento con persistencia en localStorage.
 *
 *   AvisoCookies({ alAceptar: () => {}, alRechazar: () => {} })
 *
 * Si ya se aceptó/rechazó (localStorage), no se muestra de nuevo.
 * Pasa `ignorarPersistencia: true` para previsualizarlo siempre.
 *
 * Props:
 *   mensaje                — texto principal
 *   icono                  — nodo opcional al inicio (imagen o SVG)
 *   enlace                 — { texto, href } enlace "Política de privacidad"
 *   posicion               — 'inline' (default) | 'flotante-bd' | 'flotante-bi' | 'top' | 'bottom'
 *   variante               — 'default' | 'compacto'
 *   simulado               — true para usar position:absolute (en showcase)
 *   textoAceptar/textoRechazar
 *   alAceptar/alRechazar
 *   ignorarPersistencia    — para previsualizar
 *
 * También se exporta:
 *   AvisoCookiesGDPR — versión GDPR-compliant con preferencias granulares
 *                      (necesarias / funcionales / analytics / marketing).
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';
import { almacenamientoLocal } from '../../../utils/helpers/storage.js';
import { Boton } from '../button/button.js';
import { Icono } from '../icon/icons.js';

const CLAVE = 'launchpad.cookies.aceptado';
const CLAVE_GDPR = 'launchpad.cookies.preferencias';

// ============================================================================
//  AvisoCookies — banner simple
// ============================================================================
export const AvisoCookies = ({
  mensaje = 'Usamos cookies para mejorar tu experiencia. Al continuar, aceptas su uso.',
  textoAceptar = 'Aceptar', textoRechazar = 'Rechazar',
  alAceptar, alRechazar, ignorarPersistencia = false,
  icono = null,
  enlace = null,                // { texto, href }
  posicion = 'inline',
  variante = 'default',
  simulado = false,
} = {}) => {
  if (!ignorarPersistencia && almacenamientoLocal.obtener(CLAVE)) return null;

  const enlaceNodo = enlace && crearEl('a', {
    href: enlace.href || '#',
    class: 'cookie-aviso__enlace',
    target: enlace.href ? '_blank' : null,
    rel: enlace.href ? 'noopener' : null,
  }, [enlace.texto, Icono('chevron_r', { tamano: 12 })]);

  const banner = crearEl('div', {
    class: ['cookie-aviso',
      `cookie-aviso--${variante}`,
      posicion !== 'inline' && `cookie-aviso--${posicion}`,
      simulado && 'cookie-aviso--simulado',
    ],
    role: 'dialog', 'aria-label': 'Aviso de cookies',
  }, [
    crearEl('div', { class: 'cookie-aviso__cuerpo' }, [
      icono && crearEl('div', { class: 'cookie-aviso__icono', 'aria-hidden': 'true' }, [icono]),
      crearEl('div', { class: 'cookie-aviso__texto-wrap' }, [
        crearEl('p', { class: 'cookie-aviso__texto' }, [mensaje]),
        enlaceNodo,
      ]),
      crearEl('div', { class: 'cookie-aviso__acciones' }, [
        Boton({
          texto: textoRechazar, variante: 'ghost', tamano: 'sm',
          onClick: () => {
            almacenamientoLocal.guardar(CLAVE, 'rechazado');
            banner.remove(); alRechazar?.();
          },
        }),
        Boton({
          texto: textoAceptar, variante: 'primary', tamano: 'sm',
          onClick: () => {
            almacenamientoLocal.guardar(CLAVE, 'aceptado');
            banner.remove(); alAceptar?.();
          },
        }),
      ]),
    ]),
  ]);
  return banner;
};

// ============================================================================
//  AvisoCookiesGDPR — versión completa con preferencias granulares
// ============================================================================
const CATEGORIAS_DEFAULT = [
  { id: 'necesarias', titulo: 'Necesarias',
    descripcion: 'Imprescindibles para que el sitio funcione (sesión, seguridad, idioma).',
    requerido: true },
  { id: 'funcionales', titulo: 'Funcionales',
    descripcion: 'Recordar preferencias de UI: tema, layout, filtros guardados.' },
  { id: 'analytics', titulo: 'Estadísticas',
    descripcion: 'Métricas anónimas de uso (páginas vistas, tiempo en sesión) para mejorar la experiencia.' },
  { id: 'marketing', titulo: 'Marketing',
    descripcion: 'Publicidad personalizada y seguimiento entre sitios para campañas.' },
];

export const AvisoCookiesGDPR = ({
  titulo = 'Tu privacidad importa',
  mensaje = 'Usamos cookies para mejorar la experiencia, medir el rendimiento y mostrarte contenido relevante. Tú decides qué categorías aceptar.',
  enlace = { texto: 'Política de privacidad', href: '#' },
  categorias = CATEGORIAS_DEFAULT,
  textoAceptarTodo = 'Aceptar todo',
  textoRechazarTodo = 'Rechazar todo',
  textoGuardar = 'Guardar selección',
  alGuardar, ignorarPersistencia = false,
  posicion = 'inline',
  simulado = false,
} = {}) => {
  if (!ignorarPersistencia && almacenamientoLocal.obtener(CLAVE_GDPR)) return null;

  const expandido = senal(false);
  const seleccion = senal(
    Object.fromEntries(categorias.map((c) => [c.id, !!c.requerido])),
  );

  const guardar = (valor) => {
    almacenamientoLocal.guardar(CLAVE_GDPR, valor);
    banner.remove();
    alGuardar?.(valor);
  };

  const aceptarTodo = () => {
    const todo = Object.fromEntries(categorias.map((c) => [c.id, true]));
    guardar(todo);
  };
  const rechazarTodo = () => {
    const min = Object.fromEntries(categorias.map((c) => [c.id, !!c.requerido]));
    guardar(min);
  };
  const guardarSeleccion = () => guardar({ ...seleccion.value });

  const filaCategoria = (cat) => {
    const id = `gdpr-${cat.id}-${Math.random().toString(36).slice(2, 7)}`;
    const cb = crearEl('input', {
      type: 'checkbox', id,
      class: 'cookie-gdpr__check',
      checked: seleccion.value[cat.id] ? 'checked' : null,
      disabled: cat.requerido ? 'disabled' : null,
      onChange: (e) => {
        seleccion.value = { ...seleccion.value, [cat.id]: e.currentTarget.checked };
      },
    });
    return crearEl('div', { class: 'cookie-gdpr__categoria' }, [
      crearEl('div', { class: 'cookie-gdpr__cat-cabezal' }, [
        crearEl('label', { for: id, class: 'cookie-gdpr__cat-titulo' }, [cat.titulo]),
        cat.requerido
          ? crearEl('span', { class: 'cookie-gdpr__cat-tag' }, ['Siempre activo'])
          : crearEl('label', { class: 'cookie-gdpr__switch', for: id }, [
              cb,
              crearEl('span', { class: 'cookie-gdpr__switch-track' }),
            ]),
      ]),
      crearEl('p', { class: 'cookie-gdpr__cat-desc' }, [cat.descripcion]),
      cat.requerido && cb,
    ]);
  };

  const detalles = crearEl('div', { class: 'cookie-gdpr__detalles' },
    categorias.map(filaCategoria));

  const botonExpandir = Boton({
    texto: 'Personalizar', variante: 'ghost', tamano: 'sm',
    onClick: () => { expandido.value = !expandido.value; },
  });

  efecto(() => {
    detalles.dataset.abierto = String(expandido.value);
    botonExpandir.textContent = expandido.value ? 'Ocultar opciones' : 'Personalizar';
  });

  const banner = crearEl('div', {
    class: ['cookie-gdpr',
      posicion !== 'inline' && `cookie-aviso--${posicion}`,
      simulado && 'cookie-aviso--simulado',
    ],
    role: 'dialog', 'aria-label': 'Preferencias de cookies',
  }, [
    crearEl('div', { class: 'cookie-gdpr__cabezal' }, [
      crearEl('div', { class: 'cookie-gdpr__icono', 'aria-hidden': 'true' }, [
        Icono('seguridad', { tamano: 22 }),
      ]),
      crearEl('div', { class: 'cookie-gdpr__textos' }, [
        crearEl('strong', { class: 'cookie-gdpr__titulo' }, [titulo]),
        crearEl('p', { class: 'cookie-gdpr__mensaje' }, [
          mensaje,
          enlace && ' ',
          enlace && crearEl('a', {
            href: enlace.href || '#',
            class: 'cookie-aviso__enlace',
            target: enlace.href ? '_blank' : null,
            rel: enlace.href ? 'noopener' : null,
          }, [enlace.texto, Icono('chevron_r', { tamano: 12 })]),
        ]),
      ]),
    ]),
    detalles,
    crearEl('div', { class: 'cookie-gdpr__acciones' }, [
      botonExpandir,
      crearEl('div', { class: 'cookie-gdpr__acciones-principal' }, [
        Boton({ texto: textoRechazarTodo, variante: 'secondary', tamano: 'sm', onClick: rechazarTodo }),
        Boton({ texto: textoGuardar,      variante: 'ghost',     tamano: 'sm', onClick: guardarSeleccion }),
        Boton({ texto: textoAceptarTodo,  variante: 'primary',   tamano: 'sm', onClick: aceptarTodo }),
      ]),
    ]),
  ]);
  return banner;
};
