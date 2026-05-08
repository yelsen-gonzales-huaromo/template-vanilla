/**
 * Uploader profesional — drag & drop con dos vistas (Grid / Lista),
 * íconos tipo "papel doblado" para documentos, multi-select con checkboxes,
 * bulk actions toolbar y previews por tipo.
 *
 * Inspiración:
 *  - Vista Grid → Google Drive / OneDrive / Dropbox (tiles cuadrados)
 *  - Vista Lista → Notion / Linear / GitHub Issues (compacto horizontal)
 *  - Ícono documento → "paper-fold" con extensión impresa
 *  - Multi-select → checkbox al hover, bulk bar superior
 *
 * Tipos detectados:
 *   imagen / video / audio / pdf / word / excel / ppt / csv / texto /
 *   código (js, ts, py, go, rs, java, json, html, css, md, etc.) /
 *   comprimido (zip, rar, 7z, tar, gz) / genérico
 */

import { crearEl } from '../../../utils/helpers/dom.js';
import { Icono } from '../../../components/ui/icon/icons.js';

// ---------------------------------------------------------------------------
//  Detección de tipo
// ---------------------------------------------------------------------------
const EXT_KIND = {
  doc:{kind:'word',label:'DOC',color:'#2b5cb8'}, docx:{kind:'word',label:'DOCX',color:'#2b5cb8'},
  rtf:{kind:'word',label:'RTF',color:'#2b5cb8'},
  xls:{kind:'excel',label:'XLS',color:'#1e7e3e'}, xlsx:{kind:'excel',label:'XLSX',color:'#1e7e3e'},
  csv:{kind:'excel',label:'CSV',color:'#1e7e3e'},
  ppt:{kind:'ppt',label:'PPT',color:'#c54a1c'}, pptx:{kind:'ppt',label:'PPTX',color:'#c54a1c'},
  pdf:{kind:'pdf',label:'PDF',color:'#dc2626'},
  txt:{kind:'texto',label:'TXT',color:'#64748b'}, md:{kind:'texto',label:'MD',color:'#475569'},
  js:{kind:'codigo',label:'JS',color:'#eab308'}, ts:{kind:'codigo',label:'TS',color:'#3178c6'},
  jsx:{kind:'codigo',label:'JSX',color:'#61dafb'}, tsx:{kind:'codigo',label:'TSX',color:'#3178c6'},
  py:{kind:'codigo',label:'PY',color:'#3776ab'}, go:{kind:'codigo',label:'GO',color:'#00add8'},
  rs:{kind:'codigo',label:'RS',color:'#dea584'}, java:{kind:'codigo',label:'JAVA',color:'#b07219'},
  json:{kind:'codigo',label:'JSON',color:'#475569'}, html:{kind:'codigo',label:'HTML',color:'#e34f26'},
  css:{kind:'codigo',label:'CSS',color:'#1572b6'}, yml:{kind:'codigo',label:'YML',color:'#cb171e'},
  yaml:{kind:'codigo',label:'YAML',color:'#cb171e'}, toml:{kind:'codigo',label:'TOML',color:'#9c4221'},
  zip:{kind:'zip',label:'ZIP',color:'#92400e'}, rar:{kind:'zip',label:'RAR',color:'#92400e'},
  '7z':{kind:'zip',label:'7Z',color:'#92400e'}, tar:{kind:'zip',label:'TAR',color:'#92400e'},
  gz:{kind:'zip',label:'GZ',color:'#92400e'},
};

const detectarTipo = (file) => {
  const mime = file.type || '';
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  if (mime.startsWith('image/')) return { kind: 'imagen', label: ext.toUpperCase() || 'IMG', color: '#0ea5e9' };
  if (mime.startsWith('video/')) return { kind: 'video',  label: ext.toUpperCase() || 'VID', color: '#a855f7' };
  if (mime.startsWith('audio/')) return { kind: 'audio',  label: ext.toUpperCase() || 'AUD', color: '#f59e0b' };
  if (EXT_KIND[ext]) return EXT_KIND[ext];
  return { kind: 'generico', label: ext.toUpperCase() || 'FILE', color: '#64748b' };
};

const formatBytes = (b) => {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  if (b < 1024 * 1024 * 1024) return `${(b / (1024 * 1024)).toFixed(1)} MB`;
  return `${(b / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

// ---------------------------------------------------------------------------
//  "Paper-fold" icon — un SVG con esquina doblada y la extensión impresa
//  (Patrón Google Drive / OneDrive / Dropbox para tiles de documentos)
// ---------------------------------------------------------------------------
const paperIcon = (info, { tamano = 'md' } = {}) => {
  // tamano: 'sm' (32) | 'md' (52) | 'lg' (72)
  const dims = { sm: 32, md: 52, lg: 72 }[tamano] || 52;
  const radio = dims * 0.08;
  const fold = dims * 0.32;
  const w = dims * 0.78;
  const h = dims;
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('width', w); svg.setAttribute('height', h);
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.classList.add('upl-paper');

  // Cuerpo del documento
  const body = document.createElementNS(ns, 'path');
  body.setAttribute('d',
    `M${radio} 0 H${w - fold} L${w} ${fold} V${h - radio}
     a${radio} ${radio} 0 0 1 -${radio} ${radio}
     H${radio} a${radio} ${radio} 0 0 1 -${radio} -${radio}
     V${radio} a${radio} ${radio} 0 0 1 ${radio} -${radio}Z`,
  );
  body.setAttribute('fill', 'var(--surface)');
  body.setAttribute('stroke', 'var(--border)');
  body.setAttribute('stroke-width', '1');
  svg.appendChild(body);

  // Esquina doblada
  const corner = document.createElementNS(ns, 'path');
  corner.setAttribute('d', `M${w - fold} 0 V${fold} H${w} L${w - fold} 0Z`);
  corner.setAttribute('fill', 'color-mix(in srgb, var(--foreground) 8%, var(--surface))');
  corner.setAttribute('stroke', 'var(--border)');
  corner.setAttribute('stroke-width', '1');
  svg.appendChild(corner);

  // Banda inferior con la extensión
  const bandH = dims * 0.26;
  const band = document.createElementNS(ns, 'rect');
  band.setAttribute('x', 0);
  band.setAttribute('y', h - bandH - radio);
  band.setAttribute('width', w);
  band.setAttribute('height', bandH);
  band.setAttribute('fill', info.color);
  svg.appendChild(band);

  // Texto de la extensión
  const txt = document.createElementNS(ns, 'text');
  txt.setAttribute('x', w / 2);
  txt.setAttribute('y', h - radio - bandH / 2);
  txt.setAttribute('text-anchor', 'middle');
  txt.setAttribute('dominant-baseline', 'central');
  txt.setAttribute('fill', '#fff');
  txt.setAttribute('font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace');
  txt.setAttribute('font-weight', '700');
  txt.setAttribute('font-size', String(dims * 0.18));
  txt.setAttribute('letter-spacing', '0.03em');
  txt.textContent = info.label.length > 5 ? info.label.slice(0, 4) : info.label;
  svg.appendChild(txt);

  return svg;
};

// ---------------------------------------------------------------------------
//  Lightbox
// ---------------------------------------------------------------------------
const abrirLightbox = (url, nombre, tipo = 'imagen') => {
  const overlay = crearEl('div', {
    class: 'upl-lightbox',
    onClick: (e) => { if (e.target === overlay) cerrar(); },
  });
  const onKey = (e) => { if (e.key === 'Escape') cerrar(); };
  const cerrar = () => {
    overlay.classList.remove('upl-lightbox--abierto');
    document.removeEventListener('keydown', onKey);
    setTimeout(() => overlay.remove(), 200);
  };
  const cuerpo = tipo === 'video'
    ? crearEl('video', { src: url, controls: true, autoplay: true, class: 'upl-lightbox__media' })
    : crearEl('img', { src: url, class: 'upl-lightbox__media', alt: nombre });
  overlay.appendChild(crearEl('button', {
    type: 'button', class: 'upl-lightbox__cerrar', onClick: cerrar,
    'aria-label': 'Cerrar',
  }, [Icono('cerrar', { tamano: 18 })]));
  overlay.appendChild(cuerpo);
  overlay.appendChild(crearEl('div', { class: 'upl-lightbox__nombre' }, [nombre]));
  document.body.appendChild(overlay);
  document.addEventListener('keydown', onKey);
  requestAnimationFrame(() => overlay.classList.add('upl-lightbox--abierto'));
};

// ---------------------------------------------------------------------------
//  Helpers para extracción de poster de video
// ---------------------------------------------------------------------------
const extraerPoster = (file, callback) => {
  const url = URL.createObjectURL(file);
  const v = document.createElement('video');
  v.src = url; v.muted = true; v.preload = 'metadata';
  v.addEventListener('loadedmetadata', () => {
    v.currentTime = Math.min(1, v.duration / 4);
  });
  v.addEventListener('seeked', () => {
    const c = document.createElement('canvas');
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext('2d').drawImage(v, 0, 0);
    c.toBlob((blob) => {
      const dur = v.duration;
      const mins = Math.floor(dur / 60);
      const secs = Math.floor(dur % 60);
      callback(blob ? URL.createObjectURL(blob) : null, `${mins}:${String(secs).padStart(2, '0')}`, url);
    });
  }, { once: true });
};

// ---------------------------------------------------------------------------
//  Componente principal
// ---------------------------------------------------------------------------
export const Uploader = ({
  multi = true,
  accept,
  maxMb = 25,
  maxArchivos = 20,
  maxTotalMb,
  altura = 'normal',         // 'compacto' | 'normal' | 'grande'
  conLista = true,
  vistaInicial = 'grid',     // 'grid' | 'lista'
  conToggleVista = true,
  onChange,
  textoArrastra = 'Arrastra archivos aquí',
  textoClick = 'haz click para buscar',
} = {}) => {
  let archivos = [];          // [{ id, file, info, posterUrl?, posterDur? }]
  let rechazados = [];
  let seleccionados = new Set();
  let vista = vistaInicial;

  const wrap = crearEl('div', { class: 'upl-wrap' });
  const inputFile = crearEl('input', {
    type: 'file', multiple: multi, accept,
    style: { display: 'none' },
    onChange: (e) => { agregar([...e.target.files]); e.target.value = ''; },
  });

  // Validación
  const matchAccept = (file) => {
    if (!accept) return true;
    const tokens = accept.split(',').map((t) => t.trim().toLowerCase());
    const mime = (file.type || '').toLowerCase();
    const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();
    return tokens.some((t) => {
      if (t.endsWith('/*')) return mime.startsWith(t.slice(0, -1));
      if (t.startsWith('.')) return ext === t;
      return mime === t;
    });
  };
  const validar = (f) => {
    if (!matchAccept(f)) return `Tipo no permitido (${f.type || 'sin tipo'})`;
    if (f.size > maxMb * 1024 * 1024) return `Excede ${maxMb} MB`;
    return null;
  };

  // Agregar / remover
  let _id = 0;
  const agregar = (files) => {
    rechazados = [];
    const nuevos = [];
    for (const f of files) {
      const err = validar(f);
      if (err) { rechazados.push({ file: f, error: err }); continue; }
      const item = { id: ++_id, file: f, info: detectarTipo(f) };
      // Pre-extrae poster si es video
      if (item.info.kind === 'video') {
        extraerPoster(f, (posterUrl, dur, srcUrl) => {
          item.posterUrl = posterUrl;
          item.posterDur = dur;
          item.srcUrl = srcUrl;
          render();
        });
      }
      nuevos.push(item);
    }
    if (multi) {
      let resultado = [...archivos, ...nuevos];
      if (resultado.length > maxArchivos) {
        rechazados.push({ file: { name: `${resultado.length - maxArchivos} archivos extra` }, error: `Máximo ${maxArchivos} archivos` });
        resultado = resultado.slice(0, maxArchivos);
      }
      if (maxTotalMb) {
        const total = resultado.reduce((s, x) => s + x.file.size, 0);
        if (total > maxTotalMb * 1024 * 1024) {
          rechazados.push({ file: { name: 'tamaño total' }, error: `Excede ${maxTotalMb} MB acumulados` });
          let acc = 0; const final = [];
          for (const x of resultado) {
            if (acc + x.file.size <= maxTotalMb * 1024 * 1024) { final.push(x); acc += x.file.size; }
          }
          archivos = final;
        } else { archivos = resultado; }
      } else { archivos = resultado; }
    } else {
      archivos = nuevos.slice(0, 1);
    }
    render();
    onChange && onChange(archivos.map((x) => x.file));
  };
  const remover = (id) => {
    archivos = archivos.filter((x) => x.id !== id);
    seleccionados.delete(id);
    render();
    onChange && onChange(archivos.map((x) => x.file));
  };
  const limpiar = () => {
    archivos = []; rechazados = []; seleccionados = new Set();
    render();
    onChange && onChange([]);
  };
  const removerSeleccionados = () => {
    archivos = archivos.filter((x) => !seleccionados.has(x.id));
    seleccionados = new Set();
    render();
    onChange && onChange(archivos.map((x) => x.file));
  };
  const toggleSel = (id) => {
    if (seleccionados.has(id)) seleccionados.delete(id);
    else seleccionados.add(id);
    render();
  };
  const selTodo = () => {
    if (seleccionados.size === archivos.length) seleccionados = new Set();
    else seleccionados = new Set(archivos.map((x) => x.id));
    render();
  };

  // Drop area
  const dropArea = crearEl('div', {
    class: ['upl-drop', `upl-drop--${altura}`],
    onClick: (e) => {
      if (e.target.closest('.upl-toolbar, .upl-item, .upl-tile')) return;
      inputFile.click();
    },
    onDragOver: (e) => { e.preventDefault(); dropArea.classList.add('upl-drop--activa'); },
    onDragLeave: (e) => {
      if (!dropArea.contains(e.relatedTarget)) dropArea.classList.remove('upl-drop--activa');
    },
    onDrop: (e) => {
      e.preventDefault();
      dropArea.classList.remove('upl-drop--activa');
      agregar([...e.dataTransfer.files]);
    },
  });
  const hint = (() => {
    const partes = [`máx. ${maxMb} MB cada uno`];
    if (multi) partes.push(`hasta ${maxArchivos} archivos`);
    if (maxTotalMb) partes.push(`${maxTotalMb} MB total`);
    if (accept) partes.push(`tipos: ${accept}`);
    return partes.join(' · ');
  })();
  dropArea.appendChild(crearEl('div', { class: 'upl-drop__contenido' }, [
    crearEl('div', { class: 'upl-drop__icono' }, [Icono('subir', { tamano: 22 })]),
    crearEl('div', { class: 'upl-drop__titulo' }, [textoArrastra]),
    crearEl('div', { class: 'upl-drop__sub' }, [
      'o ', crearEl('span', { class: 'upl-drop__link' }, [textoClick]),
    ]),
    crearEl('div', { class: 'upl-drop__hint' }, [hint]),
  ]));

  // Toolbar (resumen + bulk + view toggle)
  const toolbar = crearEl('div', { class: 'upl-toolbar' });
  const lista = crearEl('div', { class: ['upl-render', `upl-render--${vista}`] });
  const errores = crearEl('div', { class: 'upl-errores' });

  // -------------------------------------------------------------------------
  //  Tile (vista grid) — patrón Google Drive
  // -------------------------------------------------------------------------
  const tileView = (item) => {
    const sel = seleccionados.has(item.id);
    const tile = crearEl('div', {
      class: ['upl-tile', sel && 'upl-tile--sel', `upl-tile--${item.info.kind}`],
      onClick: (e) => { if (e.target.closest('.upl-tile__check, .upl-tile__quitar, .upl-tile__zoom')) return; if (seleccionados.size > 0) toggleSel(item.id); },
    });

    // Checkbox visual (visible al hover o cuando hay selección)
    tile.appendChild(crearEl('label', {
      class: ['upl-tile__check', sel && 'upl-tile__check--on'],
      onClick: (e) => e.stopPropagation(),
    }, [
      crearEl('input', {
        type: 'checkbox', checked: sel || null,
        onChange: () => toggleSel(item.id),
      }),
    ]));

    // Botón quitar (X arriba-derecha)
    tile.appendChild(crearEl('button', {
      type: 'button',
      class: 'upl-tile__quitar',
      title: 'Quitar',
      onClick: (e) => { e.stopPropagation(); remover(item.id); },
    }, [Icono('cerrar', { tamano: 14 })]));

    // Preview
    const previewBox = crearEl('div', { class: 'upl-tile__preview' });
    if (item.info.kind === 'imagen') {
      const url = URL.createObjectURL(item.file);
      const img = crearEl('img', {
        src: url, class: 'upl-tile__img',
        onError: () => {
          // Fallback al ícono papel si la imagen no se puede cargar
          img.replaceWith(paperIcon(item.info, { tamano: 'lg' }));
        },
      });
      previewBox.appendChild(img);
      previewBox.classList.add('upl-tile__preview--media');
      // Badge de extensión sobrepuesto (esquina inferior izq) — útil cuando
      // la imagen es muy oscura o cuando el usuario necesita ver el formato.
      previewBox.appendChild(crearEl('span', {
        class: 'upl-tile__ext-badge',
        style: { background: item.info.color },
      }, [item.info.label]));
      previewBox.appendChild(crearEl('button', {
        type: 'button', class: 'upl-tile__zoom',
        title: 'Ver',
        onClick: (e) => { e.stopPropagation(); abrirLightbox(url, item.file.name); },
      }, [Icono('zoom_mas', { tamano: 14 })]));
    } else if (item.info.kind === 'video') {
      previewBox.classList.add('upl-tile__preview--media', 'upl-tile__preview--video');
      if (item.posterUrl) previewBox.style.backgroundImage = `url(${item.posterUrl})`;
      previewBox.appendChild(crearEl('span', { class: 'upl-tile__play' }, [Icono('reproducir', { tamano: 22 })]));
      if (item.posterDur) previewBox.appendChild(crearEl('span', { class: 'upl-tile__dur' }, [item.posterDur]));
      previewBox.appendChild(crearEl('button', {
        type: 'button', class: 'upl-tile__zoom',
        title: 'Reproducir',
        onClick: (e) => { e.stopPropagation(); if (item.srcUrl) abrirLightbox(item.srcUrl, item.file.name, 'video'); },
      }, [Icono('reproducir', { tamano: 14 })]));
    } else if (item.info.kind === 'audio') {
      previewBox.classList.add('upl-tile__preview--audio');
      previewBox.appendChild(crearEl('audio', { src: URL.createObjectURL(item.file), controls: true, preload: 'metadata' }));
    } else {
      // Documento → paper-fold icon
      previewBox.appendChild(paperIcon(item.info, { tamano: 'lg' }));
    }
    tile.appendChild(previewBox);

    // Info abajo
    tile.appendChild(crearEl('div', { class: 'upl-tile__info' }, [
      crearEl('div', { class: 'upl-tile__nombre', title: item.file.name }, [item.file.name]),
      crearEl('div', { class: 'upl-tile__meta' }, [`${item.info.label} · ${formatBytes(item.file.size)}`]),
    ]));

    return tile;
  };

  // -------------------------------------------------------------------------
  //  Item (vista lista)
  // -------------------------------------------------------------------------
  const itemView = (item) => {
    const sel = seleccionados.has(item.id);
    const fila = crearEl('div', {
      class: ['upl-item', sel && 'upl-item--sel'],
    }, [
      crearEl('label', {
        class: ['upl-item__check', sel && 'upl-item__check--on'],
        onClick: (e) => e.stopPropagation(),
      }, [
        crearEl('input', { type: 'checkbox', checked: sel || null, onChange: () => toggleSel(item.id) }),
      ]),
    ]);

    const previewBox = crearEl('div', { class: 'upl-item__preview' });
    if (item.info.kind === 'imagen') {
      const url = URL.createObjectURL(item.file);
      previewBox.classList.add('upl-item__preview--media');
      previewBox.appendChild(crearEl('img', {
        src: url, class: 'upl-item__img',
        onClick: () => abrirLightbox(url, item.file.name),
      }));
    } else if (item.info.kind === 'video') {
      previewBox.classList.add('upl-item__preview--media');
      if (item.posterUrl) previewBox.style.backgroundImage = `url(${item.posterUrl})`;
      previewBox.style.backgroundColor = '#000';
      previewBox.appendChild(crearEl('span', { class: 'upl-tile__play upl-tile__play--sm' }, [Icono('reproducir', { tamano: 14 })]));
      if (item.srcUrl) previewBox.addEventListener('click', () => abrirLightbox(item.srcUrl, item.file.name, 'video'));
    } else if (item.info.kind === 'audio') {
      previewBox.classList.add('upl-item__preview--audio');
      previewBox.appendChild(crearEl('audio', { src: URL.createObjectURL(item.file), controls: true, preload: 'metadata' }));
    } else {
      previewBox.classList.add('upl-item__preview--doc');
      previewBox.appendChild(paperIcon(item.info, { tamano: 'md' }));
    }
    fila.appendChild(previewBox);

    fila.appendChild(crearEl('div', { class: 'upl-item__cuerpo' }, [
      crearEl('div', { class: 'upl-item__nombre' }, [item.file.name]),
      crearEl('div', { class: 'upl-item__meta' }, [
        formatBytes(item.file.size), ' · ', item.info.label || 'archivo',
      ]),
      crearEl('div', { class: 'upl-progress' }, [crearEl('div', { class: 'upl-progress__barra', style: { width: '100%' } })]),
    ]));

    fila.appendChild(crearEl('button', {
      type: 'button', class: 'upl-item__quitar', title: 'Quitar',
      onClick: (e) => { e.stopPropagation(); remover(item.id); },
    }, [Icono('cerrar', { tamano: 14 })]));

    return fila;
  };

  // -------------------------------------------------------------------------
  //  Render
  // -------------------------------------------------------------------------
  const render = () => {
    if (!conLista) return;
    lista.replaceChildren();
    lista.className = `upl-render upl-render--${vista}`;
    archivos.forEach((item) => {
      lista.appendChild(vista === 'grid' ? tileView(item) : itemView(item));
    });

    errores.replaceChildren();
    rechazados.forEach((r) => {
      errores.appendChild(crearEl('div', { class: 'upl-error' }, [
        Icono('alerta', { tamano: 12 }),
        crearEl('span', null, [crearEl('strong', null, [r.file.name]), ` — ${r.error}`]),
      ]));
    });

    toolbar.replaceChildren();
    if (archivos.length === 0) return;

    const total = archivos.reduce((s, x) => s + x.file.size, 0);
    const izq = crearEl('div', { class: 'upl-toolbar__izq' });
    if (multi) {
      izq.appendChild(crearEl('label', { class: 'upl-toolbar__sel-todo' }, [
        crearEl('input', {
          type: 'checkbox',
          checked: seleccionados.size === archivos.length || null,
          onChange: () => selTodo(),
          // estado indeterminate cuando hay algunos pero no todos
          ref: (n) => { n.indeterminate = seleccionados.size > 0 && seleccionados.size < archivos.length; },
        }),
        seleccionados.size > 0
          ? `${seleccionados.size} seleccionado${seleccionados.size === 1 ? '' : 's'}`
          : `${archivos.length} ${archivos.length === 1 ? 'archivo' : 'archivos'} · ${formatBytes(total)}`,
      ]));
    } else {
      izq.appendChild(crearEl('span', { class: 'upl-toolbar__resumen' },
        [`${archivos.length} archivo · ${formatBytes(total)}`]));
    }
    toolbar.appendChild(izq);

    const der = crearEl('div', { class: 'upl-toolbar__der' });
    if (seleccionados.size > 0) {
      der.appendChild(crearEl('button', {
        type: 'button', class: 'upl-toolbar__btn upl-toolbar__btn--danger',
        onClick: () => removerSeleccionados(),
      }, [Icono('papelera', { tamano: 12 }), `Eliminar ${seleccionados.size}`]));
    } else {
      der.appendChild(crearEl('button', {
        type: 'button', class: 'upl-toolbar__btn',
        onClick: () => limpiar(),
      }, [Icono('papelera', { tamano: 12 }), 'Quitar todos']));
    }
    if (conToggleVista) {
      der.appendChild(crearEl('div', { class: 'upl-vista-toggle' }, [
        crearEl('button', {
          type: 'button',
          class: ['upl-vista-toggle__btn', vista === 'grid' && 'upl-vista-toggle__btn--on'],
          title: 'Vista cuadrícula',
          onClick: () => { vista = 'grid'; render(); },
        }, [Icono('panel', { tamano: 13 })]),
        crearEl('button', {
          type: 'button',
          class: ['upl-vista-toggle__btn', vista === 'lista' && 'upl-vista-toggle__btn--on'],
          title: 'Vista lista',
          onClick: () => { vista = 'lista'; render(); },
        }, [Icono('densidad', { tamano: 13 })]),
      ]));
    }
    toolbar.appendChild(der);
  };

  wrap.appendChild(inputFile);
  wrap.appendChild(dropArea);
  if (conLista) {
    wrap.appendChild(toolbar);
    wrap.appendChild(lista);
    wrap.appendChild(errores);
  }
  return wrap;
};
