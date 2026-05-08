/**
 * EditorDocumento — editor WYSIWYG de DOCUMENTOS, no solo texto.
 *
 * Inspiración: Google Docs / Notion / Linear. Vanilla JS, ~12 KB sin íconos.
 *
 * Features:
 *  - Superficie estilo página (max-width 820px, padding generoso, sombra)
 *  - Toolbar completa con íconos reales agrupados + active state detection
 *  - Selector de bloque (P/H1-H4) con preview tipográfico en el menú
 *  - Color de texto + popover con paleta
 *  - Tablas — picker visual NxM, añadir/eliminar fila/columna en contexto
 *  - Imágenes — URL, file picker (base64) y DRAG & DROP directo al editor
 *  - Slash command (`/`) — menú de bloques insertables al estilo Notion
 *  - Outline lateral — lista de headings clickeables que saltan a la sección
 *  - Footer: palabras · caracteres · tiempo de lectura
 *  - Botón imprimir / exportar (usa window.print con CSS print-only)
 *  - Atajos: ⌘B/⌘I/⌘U + ⌘K (link) + ⌘Z/⌘⇧Z (undo/redo)
 *  - Pegado limpio (sin estilos de Word/Notion)
 */

import { crearEl } from '../../../utils/helpers/dom.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { abrirPanel, cerrarPopoverActivo } from './_popover.js';

const COMANDOS_CON_ESTADO = ['bold', 'italic', 'underline', 'strikeThrough',
  'insertUnorderedList', 'insertOrderedList',
  'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'];

const COLORES = ['#0f172a', '#475569', '#94a3b8', '#ef4444', '#f97316', '#eab308',
                 '#22c55e', '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6',
                 '#a855f7', '#ec4899', '#f43f5e'];

const BLOQUES = [
  { value: 'p',  label: 'Párrafo' },
  { value: 'h1', label: 'Heading 1' },
  { value: 'h2', label: 'Heading 2' },
  { value: 'h3', label: 'Heading 3' },
  { value: 'h4', label: 'Heading 4' },
];

// Comandos del slash menu (`/`)
const COMANDOS_SLASH = [
  { id: 'h1', icono: 'titulo', label: 'Heading 1', desc: 'Sección grande', accion: (ed) => ed.aplicarBloque('h1') },
  { id: 'h2', icono: 'titulo', label: 'Heading 2', desc: 'Sub-sección', accion: (ed) => ed.aplicarBloque('h2') },
  { id: 'h3', icono: 'titulo', label: 'Heading 3', desc: 'Sub-sub-sección', accion: (ed) => ed.aplicarBloque('h3') },
  { id: 'ul', icono: 'lista_punto', label: 'Lista', desc: 'Lista con viñetas', accion: (ed) => ed.ejecutar('insertUnorderedList') },
  { id: 'ol', icono: 'lista_num', label: 'Lista numerada', desc: '1, 2, 3…', accion: (ed) => ed.ejecutar('insertOrderedList') },
  { id: 'quote', icono: 'cita', label: 'Cita', desc: 'Bloque destacado', accion: (ed) => ed.aplicarBloque('blockquote') },
  { id: 'code', icono: 'codigo_bloque', label: 'Bloque de código', desc: 'Texto en monoespaciado', accion: (ed) => ed.aplicarBloque('pre') },
  { id: 'hr', icono: 'hr', label: 'Separador', desc: 'Línea horizontal', accion: (ed) => ed.ejecutar('insertHorizontalRule') },
  { id: 'table', icono: 'tablas', label: 'Tabla', desc: 'Insertar 3×3 (puedes ajustar después)', accion: (ed) => ed.insertarTabla(3, 3) },
  { id: 'image', icono: 'imagen_mas', label: 'Imagen', desc: 'Desde URL o archivo', accion: (ed, ancla) => ed.abrirPopoverImagen(ancla) },
];

const PALABRAS_POR_MIN = 220;

// ---------------------------------------------------------------------------

export const EditorDocumento = ({
  valor = '',
  placeholder = 'Comienza a escribir o presiona "/" para insertar un bloque…',
  altura = 560,
  onChange,
  conOutline = true,
  conImprimir = true,
} = {}) => {
  const root = crearEl('div', { class: 'editor-doc' });
  const toolbar = crearEl('div', { class: 'editor-doc__toolbar', role: 'toolbar' });
  const cuerpo = crearEl('div', { class: 'editor-doc__cuerpo', style: { height: `${altura}px` } });
  const outline = conOutline ? crearEl('aside', { class: 'editor-doc__outline' }, [
    crearEl('div', { class: 'editor-doc__outline-titulo' }, ['Contenido']),
    crearEl('nav', { class: 'editor-doc__outline-lista' }),
  ]) : null;

  const pagina = crearEl('div', { class: 'editor-doc__pagina' });
  const editor = crearEl('div', {
    class: 'editor-doc__area',
    contentEditable: 'true',
    spellcheck: 'true',
    'data-placeholder': placeholder,
  });
  editor.innerHTML = valor || '';
  pagina.appendChild(editor);

  const scroll = crearEl('div', { class: 'editor-doc__scroll' }, [pagina]);
  if (outline) cuerpo.appendChild(outline);
  cuerpo.appendChild(scroll);

  const footer = crearEl('div', { class: 'editor-doc__footer' }, [
    crearEl('span', { class: 'editor-doc__footer-meta' }),
  ]);

  // -------------------------------------------------------------------------
  //  API interna que se pasa a los slash commands
  // -------------------------------------------------------------------------
  const api = {
    ejecutar: (cmd, val) => ejecutar(cmd, val),
    aplicarBloque: (b) => ejecutar(`formatBlock-${b}`),
    insertarTabla: (filas, cols) => insertarTabla(filas, cols),
    abrirPopoverImagen: (ancla) => abrirPopoverImagen(ancla),
  };

  // -------------------------------------------------------------------------
  //  Comandos
  // -------------------------------------------------------------------------
  const ejecutar = (cmd, valorCmd) => {
    editor.focus();
    if (cmd && cmd.startsWith('formatBlock-')) {
      const bloque = cmd.slice('formatBlock-'.length);
      document.execCommand('formatBlock', false, `<${bloque}>`);
    } else {
      document.execCommand(cmd, false, valorCmd);
    }
    refrescarEstados();
    emitir();
  };

  const emitir = () => {
    if (onChange) onChange(editor.innerHTML);
    actualizarFooter();
    actualizarOutline();
  };

  // -------------------------------------------------------------------------
  //  Toolbar — selector de bloque
  // -------------------------------------------------------------------------
  const bloqueSel = crearEl('button', {
    type: 'button',
    class: 'editor-doc__bloque',
    title: 'Tipo de bloque',
    onMouseDown: (e) => e.preventDefault(),
    onClick: () => abrirMenuBloque(bloqueSel),
  }, [
    crearEl('span', { class: 'editor-doc__bloque-lbl' }, ['Párrafo']),
    Icono('chevron_d', { tamano: 12 }),
  ]);
  const refrescarBloque = () => {
    const b = document.queryCommandValue('formatBlock').toLowerCase().replace(/[<>]/g, '');
    const item = BLOQUES.find((x) => x.value === b);
    bloqueSel.querySelector('.editor-doc__bloque-lbl').textContent = item ? item.label : 'Párrafo';
  };
  const abrirMenuBloque = (ancla) => {
    abrirPanel({
      ancla,
      claseExtra: 'editor-doc__menu-panel',
      contenido: crearEl('div', { class: 'editor-doc__menu' },
        BLOQUES.map((b) => crearEl('button', {
          type: 'button', class: 'editor-doc__menu-item',
          onMouseDown: (e) => e.preventDefault(),
          onClick: () => { api.aplicarBloque(b.value); cerrarPopoverActivo(); },
        }, [crearEl('span', { class: `editor-doc__menu-prev editor-doc__menu-prev--${b.value}` }, [b.label])])),
      ),
    });
  };

  // -------------------------------------------------------------------------
  //  Color, enlace e imagen
  // -------------------------------------------------------------------------
  const btnColor = crearEl('button', {
    type: 'button', class: 'editor-doc__btn editor-doc__btn--color', title: 'Color de texto',
    onMouseDown: (e) => e.preventDefault(),
    onClick: () => abrirPickerColor(btnColor),
  }, [
    crearEl('span', { class: 'editor-doc__color-letra' }, ['A']),
    crearEl('span', { class: 'editor-doc__color-barra', style: { background: '#ef4444' } }),
  ]);

  const abrirPickerColor = (ancla) => {
    abrirPanel({
      ancla, claseExtra: 'editor-doc__menu-panel',
      contenido: crearEl('div', { class: 'editor-doc__color-grid' },
        COLORES.map((c) => crearEl('button', {
          type: 'button', class: 'editor-doc__swatch', style: { background: c }, title: c,
          onMouseDown: (e) => e.preventDefault(),
          onClick: () => {
            ejecutar('foreColor', c);
            ancla.querySelector('.editor-doc__color-barra').style.background = c;
            cerrarPopoverActivo();
          },
        })),
      ),
    });
  };

  const abrirPopoverEnlace = (ancla) => {
    const sel = window.getSelection();
    const rango = sel.rangeCount ? sel.getRangeAt(0).cloneRange() : null;
    const input = crearEl('input', { type: 'url', class: 'input input--sm', placeholder: 'https://…', style: { width: '260px' } });
    const aplicar = () => {
      if (rango) { const s = window.getSelection(); s.removeAllRanges(); s.addRange(rango); }
      const url = input.value.trim();
      if (url) ejecutar('createLink', url);
      cerrarPopoverActivo();
    };
    const quitar = () => {
      if (rango) { const s = window.getSelection(); s.removeAllRanges(); s.addRange(rango); }
      ejecutar('unlink');
      cerrarPopoverActivo();
    };
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); aplicar(); } });
    abrirPanel({
      ancla, claseExtra: 'editor-doc__menu-panel',
      contenido: crearEl('div', { class: 'editor-doc__form-row' }, [
        input,
        crearEl('button', { type: 'button', class: 'btn', onClick: aplicar }, ['Aplicar']),
        crearEl('button', { type: 'button', class: 'btn btn--ghost', onClick: quitar }, ['Quitar']),
      ]),
    });
    requestAnimationFrame(() => input.focus());
  };

  const abrirPopoverImagen = (ancla) => {
    const sel = window.getSelection();
    const rango = sel.rangeCount ? sel.getRangeAt(0).cloneRange() : null;
    const inputUrl = crearEl('input', { type: 'url', class: 'input input--sm', placeholder: 'URL de la imagen', style: { width: '260px' } });
    const inputFile = crearEl('input', { type: 'file', accept: 'image/*', style: { display: 'none' } });
    const insertarUrl = (url) => {
      if (rango) { const s = window.getSelection(); s.removeAllRanges(); s.addRange(rango); }
      if (url) ejecutar('insertImage', url);
      cerrarPopoverActivo();
    };
    inputUrl.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); insertarUrl(inputUrl.value.trim()); } });
    inputFile.addEventListener('change', (e) => {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => insertarUrl(reader.result);
      reader.readAsDataURL(f);
    });
    abrirPanel({
      ancla, claseExtra: 'editor-doc__menu-panel',
      contenido: crearEl('div', { class: 'editor-doc__form-stack' }, [
        crearEl('div', { class: 'editor-doc__form-row' }, [
          inputUrl,
          crearEl('button', { type: 'button', class: 'btn', onClick: () => insertarUrl(inputUrl.value.trim()) }, ['Insertar URL']),
        ]),
        crearEl('div', { class: 'editor-doc__form-or' }, ['o']),
        crearEl('button', { type: 'button', class: 'btn btn--outline', onClick: () => inputFile.click() }, [
          Icono('imagen_mas', { tamano: 14 }), 'Subir desde tu equipo',
        ]),
        inputFile,
      ]),
    });
    requestAnimationFrame(() => inputUrl.focus());
  };

  // -------------------------------------------------------------------------
  //  Tabla — picker visual NxM
  // -------------------------------------------------------------------------
  const abrirPickerTabla = (ancla) => {
    const grid = crearEl('div', { class: 'editor-doc__tabla-grid' });
    const lbl = crearEl('div', { class: 'editor-doc__tabla-lbl' }, ['Selecciona el tamaño']);
    const FILAS = 8, COLS = 8;
    let actuales = { f: 0, c: 0 };
    for (let f = 1; f <= FILAS; f++) {
      for (let c = 1; c <= COLS; c++) {
        const cell = crearEl('div', {
          class: 'editor-doc__tabla-cell',
          'data-f': String(f), 'data-c': String(c),
          onMouseEnter: () => {
            actuales = { f, c };
            grid.querySelectorAll('.editor-doc__tabla-cell').forEach((n) => {
              const cf = +n.dataset.f, cc = +n.dataset.c;
              n.classList.toggle('editor-doc__tabla-cell--on', cf <= f && cc <= c);
            });
            lbl.textContent = `${f} × ${c}`;
          },
          onMouseDown: (e) => { e.preventDefault(); api.insertarTabla(f, c); cerrarPopoverActivo(); },
        });
        grid.appendChild(cell);
      }
    }
    abrirPanel({
      ancla, claseExtra: 'editor-doc__menu-panel',
      contenido: crearEl('div', { class: 'editor-doc__tabla-picker' }, [grid, lbl]),
    });
  };

  const insertarTabla = (filas, cols) => {
    editor.focus();
    let html = '<table class="editor-doc__tabla"><tbody>';
    for (let f = 0; f < filas; f++) {
      html += '<tr>';
      for (let c = 0; c < cols; c++) {
        html += f === 0 ? '<th><br></th>' : '<td><br></td>';
      }
      html += '</tr>';
    }
    html += '</tbody></table><p><br></p>';
    document.execCommand('insertHTML', false, html);
    emitir();
  };

  // -------------------------------------------------------------------------
  //  Slash commands (`/` al inicio de línea abre el menú)
  // -------------------------------------------------------------------------
  let slashAbierto = false;
  const abrirSlashMenu = () => {
    if (slashAbierto) return;
    const r = window.getSelection().getRangeAt(0).getBoundingClientRect();
    const ancla = crearEl('div', {
      style: {
        position: 'absolute',
        top: `${r.top + window.scrollY}px`,
        left: `${r.left + window.scrollX}px`,
        width: '1px', height: `${r.height || 18}px`,
        pointerEvents: 'none',
      },
    });
    document.body.appendChild(ancla);
    slashAbierto = true;

    const menu = crearEl('div', { class: 'editor-doc__slash' },
      COMANDOS_SLASH.map((c, i) => crearEl('button', {
        type: 'button',
        class: ['editor-doc__slash-item', i === 0 && 'editor-doc__slash-item--activa'],
        onMouseDown: (e) => e.preventDefault(),
        onClick: () => { borrarBarra(); c.accion(api, btnNull); cerrarPopoverActivo(); },
      }, [
        crearEl('span', { class: 'editor-doc__slash-ico' }, [Icono(c.icono, { tamano: 14 })]),
        crearEl('span', { class: 'editor-doc__slash-cuerpo' }, [
          crearEl('span', { class: 'editor-doc__slash-lbl' }, [c.label]),
          crearEl('span', { class: 'editor-doc__slash-desc' }, [c.desc]),
        ]),
      ])),
    );

    const btnNull = null;  // ancla para abrir popover de imagen — usa el botón si quisiera
    abrirPanel({
      ancla, contenido: menu, claseExtra: 'editor-doc__menu-panel',
      onCerrar: () => { slashAbierto = false; ancla.remove(); },
    });
  };

  const borrarBarra = () => {
    // Borra la "/" que el usuario tipeó para abrir el menú.
    document.execCommand('delete', false);
  };

  // -------------------------------------------------------------------------
  //  Botones de toolbar simples
  // -------------------------------------------------------------------------
  const botones = [];
  const crearBoton = (cmd, icono, titulo, onClick) => {
    const b = crearEl('button', {
      type: 'button',
      class: 'editor-doc__btn',
      title: titulo,
      'data-cmd': cmd,
      onMouseDown: (e) => e.preventDefault(),
      onClick: onClick || (() => ejecutar(cmd)),
    }, [Icono(icono, { tamano: 14 })]);
    botones.push(b);
    return b;
  };

  const sep = () => crearEl('span', { class: 'editor-doc__sep' });

  // -------------------------------------------------------------------------
  //  Construcción de toolbar
  // -------------------------------------------------------------------------
  toolbar.append(
    crearBoton('undo', 'deshacer', 'Deshacer (⌘Z)'),
    crearBoton('redo', 'rehacer', 'Rehacer (⌘⇧Z)'),
    sep(),
    bloqueSel,
    sep(),
    crearBoton('bold', 'negrita', 'Negrita (⌘B)'),
    crearBoton('italic', 'cursiva', 'Cursiva (⌘I)'),
    crearBoton('underline', 'subrayado', 'Subrayado (⌘U)'),
    crearBoton('strikeThrough', 'tachado', 'Tachado'),
    btnColor,
    sep(),
    crearBoton('insertUnorderedList', 'lista_punto', 'Lista'),
    crearBoton('insertOrderedList', 'lista_num', 'Lista numerada'),
    crearBoton('outdent', 'indent_menos', 'Disminuir sangría'),
    crearBoton('indent', 'indent_mas', 'Aumentar sangría'),
    sep(),
    crearBoton('justifyLeft', 'alinear_izq', 'Alinear izquierda'),
    crearBoton('justifyCenter', 'alinear_centro', 'Centrar'),
    crearBoton('justifyRight', 'alinear_der', 'Alinear derecha'),
    crearBoton('justifyFull', 'alinear_just', 'Justificar'),
    sep(),
    crearBoton('createLink', 'enlace', 'Insertar enlace (⌘K)', () => abrirPopoverEnlace(toolbar.querySelector('[data-cmd="createLink"]'))),
    crearBoton(null, 'imagen_mas', 'Insertar imagen', (e) => abrirPopoverImagen(e.currentTarget)),
    crearBoton(null, 'tablas', 'Insertar tabla', (e) => abrirPickerTabla(e.currentTarget)),
    crearBoton('formatBlock-blockquote', 'cita', 'Cita'),
    crearBoton('formatBlock-pre', 'codigo_bloque', 'Bloque de código'),
    crearBoton('insertHorizontalRule', 'hr', 'Línea horizontal'),
    sep(),
    crearBoton('removeFormat', 'borrar_formato', 'Limpiar formato'),
  );

  if (conImprimir) {
    toolbar.appendChild(crearEl('div', { class: 'editor-doc__toolbar-spacer' }));
    toolbar.appendChild(crearEl('button', {
      type: 'button',
      class: 'editor-doc__btn editor-doc__btn--accion',
      title: 'Imprimir / Exportar como PDF',
      onMouseDown: (e) => e.preventDefault(),
      onClick: () => imprimirDocumento(),
    }, [Icono('descargar', { tamano: 14 }), 'Imprimir']));
  }

  // -------------------------------------------------------------------------
  //  Active state + atajos + paste limpio + drag&drop de imágenes + slash
  // -------------------------------------------------------------------------
  const refrescarEstados = () => {
    botones.forEach((b) => {
      const cmd = b.dataset.cmd;
      if (!cmd || !COMANDOS_CON_ESTADO.includes(cmd)) return;
      try { b.classList.toggle('editor-doc__btn--activo', document.queryCommandState(cmd)); } catch {}
    });
    refrescarBloque();
  };
  document.addEventListener('selectionchange', () => {
    if (document.activeElement === editor) refrescarEstados();
  });

  editor.addEventListener('keydown', (e) => {
    const meta = e.metaKey || e.ctrlKey;
    if (meta && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      abrirPopoverEnlace(toolbar.querySelector('[data-cmd="createLink"]'));
    }
    // Slash command — solo si la línea está vacía
    if (e.key === '/' && !slashAbierto) {
      const sel = window.getSelection();
      if (sel.isCollapsed && sel.anchorNode) {
        const lineaActual = sel.anchorNode.textContent || '';
        if (lineaActual.trim() === '') {
          // Esperamos que el "/" se escriba, luego abrimos el menú
          setTimeout(() => abrirSlashMenu(), 0);
        }
      }
    }
  });

  editor.addEventListener('input', emitir);

  editor.addEventListener('paste', (e) => {
    e.preventDefault();
    const txt = (e.clipboardData || window.clipboardData).getData('text/plain');
    document.execCommand('insertText', false, txt);
  });

  // Drag & drop de imágenes (file → base64)
  editor.addEventListener('dragover', (e) => {
    if (e.dataTransfer && Array.from(e.dataTransfer.types || []).includes('Files')) {
      e.preventDefault();
      editor.classList.add('editor-doc__area--drag');
    }
  });
  editor.addEventListener('dragleave', () => editor.classList.remove('editor-doc__area--drag'));
  editor.addEventListener('drop', (e) => {
    editor.classList.remove('editor-doc__area--drag');
    const files = e.dataTransfer && e.dataTransfer.files;
    if (!files || files.length === 0) return;
    const img = Array.from(files).find((f) => f.type.startsWith('image/'));
    if (!img) return;
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = () => {
      editor.focus();
      // Coloca el cursor donde se hizo drop si el browser lo permite
      const range = document.caretRangeFromPoint?.(e.clientX, e.clientY);
      if (range) { const s = window.getSelection(); s.removeAllRanges(); s.addRange(range); }
      document.execCommand('insertImage', false, reader.result);
      emitir();
    };
    reader.readAsDataURL(img);
  });

  // -------------------------------------------------------------------------
  //  Outline (lista de headings con click → scroll)
  // -------------------------------------------------------------------------
  const actualizarOutline = () => {
    if (!outline) return;
    const lista = outline.querySelector('.editor-doc__outline-lista');
    lista.replaceChildren();
    const headings = editor.querySelectorAll('h1, h2, h3, h4');
    if (headings.length === 0) {
      lista.appendChild(crearEl('div', { class: 'editor-doc__outline-vacio' }, ['Aún no hay secciones. Usa H1, H2, H3 desde la toolbar para estructurar el documento.']));
      return;
    }
    headings.forEach((h, i) => {
      // Garantiza id único para anclar
      if (!h.id) h.id = `sec-${i}-${Math.random().toString(36).slice(2, 7)}`;
      lista.appendChild(crearEl('a', {
        href: `#${h.id}`,
        class: ['editor-doc__outline-item', `editor-doc__outline-item--${h.tagName.toLowerCase()}`],
        onClick: (e) => {
          e.preventDefault();
          h.scrollIntoView({ behavior: 'smooth', block: 'start' });
        },
      }, [h.textContent.slice(0, 60) || '(sin título)']));
    });
  };

  // -------------------------------------------------------------------------
  //  Footer (palabras / caracteres / tiempo de lectura)
  // -------------------------------------------------------------------------
  const actualizarFooter = () => {
    const txt = editor.innerText.trim();
    const palabras = txt ? txt.split(/\s+/).length : 0;
    const chars = txt.length;
    const minutos = Math.max(1, Math.round(palabras / PALABRAS_POR_MIN));
    footer.querySelector('.editor-doc__footer-meta').textContent =
      `${palabras} ${palabras === 1 ? 'palabra' : 'palabras'} · ${chars} caracteres · ~${minutos} min lectura`;
  };

  // -------------------------------------------------------------------------
  //  Imprimir / exportar
  // -------------------------------------------------------------------------
  const imprimirDocumento = () => {
    const w = window.open('', '_blank', 'width=900,height=700');
    if (!w) return;
    const css = Array.from(document.styleSheets).map((s) => {
      try { return Array.from(s.cssRules).map((r) => r.cssText).join('\n'); } catch { return ''; }
    }).join('\n');
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Documento</title>
      <style>${css}\nbody{margin:0;background:#fff;color:#0f172a}.editor-doc__pagina{box-shadow:none;border:0}@page{margin:18mm}</style></head>
      <body><div class="editor-doc__pagina">${editor.innerHTML}</div>
      <script>window.onload=()=>{window.print();setTimeout(()=>window.close(),300)}</script>
      </body></html>`);
    w.document.close();
  };

  // -------------------------------------------------------------------------
  //  Montaje final
  // -------------------------------------------------------------------------
  root.appendChild(toolbar);
  root.appendChild(cuerpo);
  root.appendChild(footer);
  requestAnimationFrame(() => { actualizarFooter(); actualizarOutline(); refrescarEstados(); });
  return root;
};
