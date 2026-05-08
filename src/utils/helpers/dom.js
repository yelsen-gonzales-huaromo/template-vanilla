/**
 * Ayudantes de DOM — sustituyen jQuery y los data-attributes de Bootstrap del template antiguo.
 * `crearEl` es una factoría tipo hyperscript; `montar` reemplaza limpiamente los hijos de un nodo.
 */

export const crearEl = (etiqueta, props, hijos = []) => {
  const el = document.createElement(etiqueta);

  for (const [clave, valor] of Object.entries(props || {})) {
    if (valor === null || valor === undefined || valor === false) continue;

    if (clave === 'class' || clave === 'className') {
      el.className = Array.isArray(valor) ? valor.filter(Boolean).join(' ') : valor;
    } else if (clave === 'style' && typeof valor === 'object') {
      Object.assign(el.style, valor);
    } else if (clave === 'dataset' && typeof valor === 'object') {
      Object.assign(el.dataset, valor);
    } else if (clave.startsWith('on') && typeof valor === 'function') {
      el.addEventListener(clave.slice(2).toLowerCase(), valor);
    } else if (clave === 'html') {
      el.innerHTML = valor;
    } else if (clave === 'ref' && typeof valor === 'function') {
      valor(el);
    } else if (clave in el) {
      try { el[clave] = valor; } catch { el.setAttribute(clave, valor); }
    } else {
      el.setAttribute(clave, valor);
    }
  }

  agregarHijos(el, hijos);
  return el;
};

const agregarHijos = (padre, hijos) => {
  const lista = Array.isArray(hijos) ? hijos : [hijos];
  for (const hijo of lista) {
    if (hijo === null || hijo === undefined || hijo === false) continue;
    if (Array.isArray(hijo)) { agregarHijos(padre, hijo); continue; }
    padre.appendChild(hijo instanceof Node ? hijo : document.createTextNode(String(hijo)));
  }
};

export const montar = (objetivo, nodo) => {
  const raiz = typeof objetivo === 'string' ? document.querySelector(objetivo) : objetivo;
  if (!raiz) return null;
  raiz.replaceChildren(nodo);
  return nodo;
};

export const $  = (selector, ctx = document) => ctx.querySelector(selector);
export const $$ = (selector, ctx = document) => Array.from(ctx.querySelectorAll(selector));

/** Atrapa el foco dentro de un contenedor — usado por Modal y MenuDesplegable (a11y). */
export const atraparFoco = (contenedor) => {
  const FOCUSEABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  const manejador = (e) => {
    if (e.key !== 'Tab') return;
    const enfocables = Array.from(contenedor.querySelectorAll(FOCUSEABLE)).filter(el => !el.hasAttribute('disabled'));
    if (enfocables.length === 0) return;
    const primero = enfocables[0];
    const ultimo  = enfocables[enfocables.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  };
  contenedor.addEventListener('keydown', manejador);
  return () => contenedor.removeEventListener('keydown', manejador);
};

/** Detección de click fuera del elemento — usado por MenuDesplegable, Popover, Modal. */
export const alClickFuera = (elemento, callback) => {
  const manejador = (e) => {
    if (!elemento.contains(e.target)) callback(e);
  };
  // diferimos al siguiente tick para que el click que abre no cierre inmediatamente.
  setTimeout(() => document.addEventListener('click', manejador), 0);
  return () => document.removeEventListener('click', manejador);
};
