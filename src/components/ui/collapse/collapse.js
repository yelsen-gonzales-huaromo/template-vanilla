/**
 * Colapso — show/hide reactivo con animación suave (grid-template-rows).
 * Más simple que Acordeón: un solo bloque, controlado por una `senal`.
 *
 *   const abierto = senal(false);
 *   Colapso({ abierto, hijos: nodo })
 *
 * También se exportan helpers para patrones del mundo real:
 *   - ColapsoFAQ        → pregunta + chevron + respuesta
 *   - ColapsoLeerMas    → texto truncado con "Ver más / Ver menos"
 *   - ColapsoFiltro     → sección de filtros tipo sidebar (Amazon / Mercado Libre)
 *   - ColapsoSeccion    → título + sub + chevron + cuerpo (configuración avanzada)
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';
import { Icono } from '../icon/icons.js';

// ============================================================================
//  Colapso base — primitivo
// ============================================================================
export const Colapso = ({ abierto, hijos, sinEstilos = false } = {}) => {
  const cuerpo = crearEl('div', { class: 'colapso__cuerpo' }, [
    crearEl('div', {
      class: ['colapso__contenido', sinEstilos && 'colapso__contenido--limpio'],
    }, [hijos]),
  ]);
  const host = crearEl('div', { class: 'colapso' }, [cuerpo]);
  efecto(() => { host.dataset.abierto = String(abierto.value); });
  return host;
};

// ============================================================================
//  ColapsoFAQ — pregunta + respuesta. Para FAQs y help docs.
// ============================================================================
export const ColapsoFAQ = ({ pregunta, respuesta, inicial = false } = {}) => {
  const abierto = senal(inicial);
  const host = crearEl('div', { class: 'colapso-faq' }, [
    crearEl('button', {
      type: 'button', class: 'colapso-faq__cabezal',
      'aria-expanded': String(inicial),
      onClick: (e) => {
        abierto.value = !abierto.value;
        e.currentTarget.setAttribute('aria-expanded', String(abierto.value));
      },
    }, [
      crearEl('span', { class: 'colapso-faq__pregunta' }, [pregunta]),
      crearEl('span', { class: 'colapso-faq__chevron', 'aria-hidden': 'true' },
        [Icono('chevron_d', { tamano: 18 })]),
    ]),
    Colapso({
      abierto,
      sinEstilos: true,
      hijos: crearEl('div', { class: 'colapso-faq__respuesta' },
        typeof respuesta === 'string' ? [respuesta] : [respuesta]),
    }),
  ]);
  efecto(() => { host.dataset.abierto = String(abierto.value); });
  return host;
};

// ============================================================================
//  ColapsoLeerMas — texto largo truncado. Para descripciones de producto, bios.
// ============================================================================
export const ColapsoLeerMas = ({
  textoCorto, textoCompleto,
  etiquetaAbrir = 'Ver más', etiquetaCerrar = 'Ver menos',
} = {}) => {
  const abierto = senal(false);
  const corto = crearEl('p', { class: 'colapso-leer-mas__corto' }, [textoCorto]);
  const completo = crearEl('p', { class: 'colapso-leer-mas__completo' }, [textoCompleto]);

  const colapsable = Colapso({ abierto, sinEstilos: true, hijos: completo });

  const enlace = crearEl('button', {
    type: 'button', class: 'colapso-leer-mas__enlace',
    onClick: () => { abierto.value = !abierto.value; },
  }, [
    crearEl('span', { class: 'colapso-leer-mas__etiqueta' }),
    crearEl('span', { class: 'colapso-leer-mas__icono', 'aria-hidden': 'true' },
      [Icono('chevron_d', { tamano: 14 })]),
  ]);

  const etiqueta = enlace.querySelector('.colapso-leer-mas__etiqueta');

  efecto(() => {
    const v = abierto.value;
    enlace.dataset.abierto = String(v);
    etiqueta.textContent = v ? etiquetaCerrar : etiquetaAbrir;
    corto.style.display = v ? 'none' : '';
  });

  return crearEl('div', { class: 'colapso-leer-mas' }, [corto, colapsable, enlace]);
};

// ============================================================================
//  ColapsoFiltro — sección de filtros tipo sidebar (Amazon, Mercado Libre).
//  Lleva título arriba con count opcional + cuerpo colapsable.
// ============================================================================
export const ColapsoFiltro = ({
  titulo, hijos, count, inicial = true, icono = null,
} = {}) => {
  const abierto = senal(inicial);
  const host = crearEl('div', { class: 'colapso-filtro' }, [
    crearEl('button', {
      type: 'button', class: 'colapso-filtro__cabezal',
      'aria-expanded': String(inicial),
      onClick: (e) => {
        abierto.value = !abierto.value;
        e.currentTarget.setAttribute('aria-expanded', String(abierto.value));
      },
    }, [
      icono && crearEl('span', { class: 'colapso-filtro__icono', 'aria-hidden': 'true' }, [icono]),
      crearEl('span', { class: 'colapso-filtro__titulo' }, [titulo]),
      count != null && crearEl('span', { class: 'colapso-filtro__count' }, [String(count)]),
      crearEl('span', { class: 'colapso-filtro__chevron', 'aria-hidden': 'true' },
        [Icono('chevron_d', { tamano: 16 })]),
    ]),
    Colapso({
      abierto,
      sinEstilos: true,
      hijos: crearEl('div', { class: 'colapso-filtro__cuerpo' },
        typeof hijos === 'string' ? [hijos] : [hijos]),
    }),
  ]);
  efecto(() => { host.dataset.abierto = String(abierto.value); });
  return host;
};

// ============================================================================
//  ColapsoSeccion — header con título + subtítulo + chevron, cuerpo colapsable.
//  Para "Configuración avanzada", "Datos opcionales", etc. en formularios.
// ============================================================================
export const ColapsoSeccion = ({
  titulo, subtitulo, hijos, inicial = false, icono = null, badge = null,
} = {}) => {
  const abierto = senal(inicial);
  const host = crearEl('div', { class: 'colapso-seccion' }, [
    crearEl('button', {
      type: 'button', class: 'colapso-seccion__cabezal',
      'aria-expanded': String(inicial),
      onClick: (e) => {
        abierto.value = !abierto.value;
        e.currentTarget.setAttribute('aria-expanded', String(abierto.value));
      },
    }, [
      icono && crearEl('span', { class: 'colapso-seccion__icono', 'aria-hidden': 'true' }, [icono]),
      crearEl('span', { class: 'colapso-seccion__textos' }, [
        crearEl('span', { class: 'colapso-seccion__titulo' }, [titulo]),
        subtitulo && crearEl('span', { class: 'colapso-seccion__subtitulo' }, [subtitulo]),
      ]),
      badge && crearEl('span', { class: 'colapso-seccion__badge' }, [badge]),
      crearEl('span', { class: 'colapso-seccion__chevron', 'aria-hidden': 'true' },
        [Icono('chevron_d', { tamano: 18 })]),
    ]),
    Colapso({
      abierto,
      sinEstilos: true,
      hijos: crearEl('div', { class: 'colapso-seccion__cuerpo' },
        Array.isArray(hijos) ? hijos : [hijos]),
    }),
  ]);
  efecto(() => { host.dataset.abierto = String(abierto.value); });
  return host;
};
