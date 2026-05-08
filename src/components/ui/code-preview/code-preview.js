/**
 * VistaCodigo — bloque mostrador de un ejemplo (estilo Falcon).
 *
 * Layout:
 *   ┌── Tarjeta ─────────────────────────────────────────────┐
 *   │ Título del ejemplo            [Preview|Code]  [Copiar] │
 *   │ Descripción opcional                                   │
 *   ├────────────────────────────────────────────────────────┤
 *   │ Vista previa en vivo · ó · código fuente con highlight │
 *   └────────────────────────────────────────────────────────┘
 *
 * Reactividad: la pestaña activa vive en una `senal` local. Cambiar de pestaña
 * sólo togglea visibilidad — el preview NO se reconstruye, así no se pierde
 * el estado interactivo (acordeón abierto, formulario tipeado, etc.).
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';
import { Icono } from '../icon/icons.js';

const escaparHtml = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const PALABRAS_CLAVE = /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|class|extends|import|export|from|default|null|true|false|undefined|async|await|of|in|typeof|instanceof|this)\b/g;

const resaltar = (codigo) => {
  let html = escaparHtml(codigo);
  html = html.replace(/(\/\/[^\n]*)/g,                                   '<span class="vc__comentario">$1</span>');
  html = html.replace(/('[^'\n]*'|"[^"\n]*"|`[^`]*`)/g,                  '<span class="vc__cadena">$1</span>');
  html = html.replace(/\b(\d+(?:\.\d+)?)\b/g,                            '<span class="vc__numero">$1</span>');
  html = html.replace(PALABRAS_CLAVE,                                     '<span class="vc__keyword">$1</span>');
  html = html.replace(/(\w+)(?=\s*:)/g,                                   '<span class="vc__propiedad">$1</span>');
  return html;
};

const copiarPortapapeles = async (texto, btn) => {
  try {
    await navigator.clipboard.writeText(texto);
    btn.classList.add('vc__copiar--ok');
    btn.replaceChildren(Icono('check', { tamano: 14 }), document.createTextNode('Copiado'));
    setTimeout(() => {
      btn.classList.remove('vc__copiar--ok');
      btn.replaceChildren(Icono('descargar', { tamano: 14 }), document.createTextNode('Copiar'));
    }, 1500);
  } catch (_) {
    btn.textContent = 'Error';
  }
};

export const VistaCodigo = ({ vista, codigo = '', titulo, descripcion, lenguaje = 'js' } = {}) => {
  const pestana = senal('preview');

  // Tabs (estilo segmented compacto, top-right)
  const btnPreview = crearEl('button', {
    type: 'button', class: 'vc__tab',
    onClick: () => { pestana.value = 'preview'; },
  }, ['Vista previa']);
  const btnCodigo = crearEl('button', {
    type: 'button', class: 'vc__tab',
    onClick: () => { pestana.value = 'codigo'; },
  }, ['Código']);

  const btnCopiar = crearEl('button', {
    type: 'button', class: 'vc__copiar',
    title: 'Copiar al portapapeles',
    onClick: () => copiarPortapapeles(codigo, btnCopiar),
  }, [Icono('descargar', { tamano: 14 }), 'Copiar']);

  // Paneles
  const panelPreview = crearEl('div', { class: 'vc__panel vc__panel--preview' },
    Array.isArray(vista) ? vista : (vista ? [vista] : []));
  const panelCodigo = crearEl('div', { class: 'vc__panel vc__panel--codigo' }, [
    crearEl('span', { class: 'vc__lenguaje' }, [lenguaje]),
    crearEl('pre', { class: 'vc__pre scroll-discreto' }, [
      crearEl('code', { class: 'vc__code', innerHTML: resaltar(codigo) }),
    ]),
  ]);

  efecto(() => {
    const sel = pestana.value;
    btnPreview.setAttribute('aria-selected', String(sel === 'preview'));
    btnPreview.classList.toggle('vc__tab--activo', sel === 'preview');
    btnCodigo.setAttribute('aria-selected', String(sel === 'codigo'));
    btnCodigo.classList.toggle('vc__tab--activo', sel === 'codigo');
    panelPreview.style.display = sel === 'preview' ? 'flex'  : 'none';
    panelCodigo.style.display  = sel === 'codigo'  ? 'block' : 'none';
  });

  return crearEl('div', { class: 'vc' }, [
    crearEl('div', { class: 'vc__cabecera' }, [
      crearEl('div', { class: 'vc__titulo-bloque' }, [
        titulo && crearEl('h3', { class: 'vc__titulo' }, [titulo]),
        descripcion && crearEl('p', { class: 'vc__descripcion' },
          [typeof descripcion === 'string' ? descripcion : descripcion]),
      ]),
      crearEl('div', { class: 'vc__acciones' }, [
        crearEl('div', { class: 'vc__tabs', role: 'tablist' }, [btnPreview, btnCodigo]),
        btnCopiar,
      ]),
    ]),
    panelPreview,
    panelCodigo,
  ]);
};
