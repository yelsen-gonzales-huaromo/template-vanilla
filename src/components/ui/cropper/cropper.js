/**
 * RecortadorImagen — UI completa para recortar y convertir imágenes.
 *
 *   RecortadorImagen({
 *     formatos: ['webp', 'jpeg', 'png', 'avif'],  // formatos a ofrecer
 *     formatoDefault: 'webp',                      // formato seleccionado
 *     calidad: 0.85,                               // calidad para formatos lossy
 *     anchoSugerido: 800,                          // ancho inicial
 *     proporcion: 'libre',                         // 'libre' | '1:1' | '4:3' | '16:9' | '3:4' | '9:16'
 *     alExportar: ({ blob, formato, ancho, alto, tamano }) => {},
 *   })
 *
 * Características:
 *  - Acepta cualquier formato de entrada que el navegador pueda decodificar
 *    (jpg, png, webp, gif, bmp, avif, heic en Safari, svg).
 *  - Conversión a webp / jpeg / png / avif (cuando el navegador soporta encode).
 *  - Comparación de tamaño antes/después.
 *  - Slider de calidad para lossy (JPEG / WebP / AVIF).
 *  - Descarga directa o callback `alExportar` con blob.
 *  - Light + dark mode vía tokens.
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';
import { Boton } from '../button/button.js';
import { activarCropper } from '../../../integrations/cropper/index.js';

/* Mime + extensión por formato. */
const FORMATOS = {
  webp: { mime: 'image/webp', ext: 'webp', lossy: true,  label: 'WebP' },
  jpeg: { mime: 'image/jpeg', ext: 'jpg',  lossy: true,  label: 'JPEG' },
  png:  { mime: 'image/png',  ext: 'png',  lossy: false, label: 'PNG'  },
  avif: { mime: 'image/avif', ext: 'avif', lossy: true,  label: 'AVIF' },
};

const PROPORCIONES = {
  libre:  NaN,
  '1:1':  1,
  '4:3':  4 / 3,
  '16:9': 16 / 9,
  '3:4':  3 / 4,
  '9:16': 9 / 16,
};

/* Tamaño legible: 1234 → "1.2 KB". */
const formatearTamano = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

/* Detecta si el navegador puede ENCODEAR un formato (decode siempre se intenta). */
const puedeEncodear = async (mime) => {
  try {
    const c = document.createElement('canvas');
    c.width = c.height = 1;
    const blob = await new Promise(r => c.toBlob(r, mime, 0.5));
    return blob && blob.type === mime;
  } catch { return false; }
};

export const RecortadorImagen = ({
  formatos = ['webp', 'jpeg', 'png'],
  formatoDefault = 'webp',
  calidad = 0.85,
  anchoSugerido = 800,
  proporcion = 'libre',
  alExportar,
} = {}) => {
  /* ── Estado reactivo ── */
  const archivoOrig = senal(null);              // File original
  const fmtSel      = senal(formatoDefault);    // formato seleccionado
  const calSel      = senal(calidad);           // 0..1
  const propSel     = senal(proporcion);        // libre/1:1/...
  const anchoSel    = senal(anchoSugerido);     // px de salida
  const exportado   = senal(null);              // { blob, url, ancho, alto, formato }
  const procesando  = senal(false);
  const formatosDisp = senal([]);               // formatos realmente soportados

  /* ── Sondeo inicial: qué formatos puede encodear este navegador ── */
  Promise.all(formatos.map(async (f) => {
    const info = FORMATOS[f];
    if (!info) return null;
    const ok = info.mime === 'image/png' || await puedeEncodear(info.mime);
    return ok ? f : null;
  })).then(arr => {
    formatosDisp.value = arr.filter(Boolean);
    // Si el formato default no está disponible, salta al primero soportado.
    if (!formatosDisp.value.includes(fmtSel.value) && formatosDisp.value.length) {
      fmtSel.value = formatosDisp.value[0];
    }
  });

  /* ── Refs DOM y instancia de Cropper ── */
  let imgEl = null;
  let cropper = null;
  const lienzoRef = crearEl('div', { class: 'recortador__lienzo' });
  const placeholder = crearEl('div', { class: 'recortador__placeholder' }, [
    crearEl('span', { html: SVG_IMAGEN, 'aria-hidden': 'true' }),
    crearEl('p', null, ['Selecciona una imagen para empezar']),
    crearEl('small', null, ['Soporta JPG, PNG, WebP, AVIF, GIF, BMP, SVG']),
  ]);
  lienzoRef.appendChild(placeholder);

  /* ── Carga del archivo ── */
  const cargarArchivo = async (file) => {
    archivoOrig.value = file;
    if (cropper) { cropper.destroy(); cropper = null; }
    lienzoRef.replaceChildren();

    const url = URL.createObjectURL(file);
    imgEl = crearEl('img', { src: url, alt: file.name, class: 'recortador__img' });
    lienzoRef.appendChild(imgEl);

    // Espera a que cargue para inicializar el cropper
    await new Promise((res) => {
      if (imgEl.complete) res();
      else imgEl.addEventListener('load', res, { once: true });
    });

    cropper = await activarCropper(imgEl, {
      aspectRatio: PROPORCIONES[propSel.value],
    });
  };

  /* ── Reaplicar proporción al cambiar select ── */
  efecto(() => {
    if (!cropper) return;
    cropper.setAspectRatio(PROPORCIONES[propSel.value]);
  });

  /* ── Exportar (recortar + convertir + comprimir) ── */
  const exportar = async () => {
    if (!cropper) return;
    procesando.value = true;
    try {
      const fmtInfo = FORMATOS[fmtSel.value];
      const canvas = cropper.getCroppedCanvas({
        width: anchoSel.value,
        imageSmoothingQuality: 'high',
      });
      const blob = await new Promise((r) =>
        canvas.toBlob(r, fmtInfo.mime, fmtInfo.lossy ? calSel.value : undefined),
      );
      // Si el navegador no aceptó el mime pedido (e.g. AVIF), cae a JPEG.
      const real = blob || await new Promise((r) => canvas.toBlob(r, 'image/jpeg', calSel.value));
      const url = URL.createObjectURL(real);
      const prev = exportado.value;
      exportado.value = {
        blob: real,
        url,
        ancho: canvas.width,
        alto: canvas.height,
        formato: real.type,
        tamano: real.size,
      };
      if (prev?.url) URL.revokeObjectURL(prev.url);
      alExportar?.(exportado.value);
    } finally {
      procesando.value = false;
    }
  };

  /* ── Descargar ── */
  const descargar = () => {
    const e = exportado.value;
    if (!e) return;
    const nombre = (archivoOrig.value?.name || 'imagen').replace(/\.[^.]+$/, '');
    const ext = (e.formato.split('/')[1] || 'bin').replace('jpeg', 'jpg');
    const a = crearEl('a', { href: e.url, download: `${nombre}.${ext}` });
    document.body.appendChild(a); a.click(); a.remove();
  };

  /* ── Reset ── */
  const reiniciar = () => {
    if (cropper) cropper.reset();
  };
  const rotar = (deg) => cropper?.rotate(deg);
  const voltearH = () => cropper?.scaleX(-(cropper.getData().scaleX || 1));
  const voltearV = () => cropper?.scaleY(-(cropper.getData().scaleY || 1));

  /* ── DOM: input file + barra de herramientas ── */
  const inputArchivo = crearEl('input', {
    type: 'file',
    accept: 'image/*',
    class: 'recortador__file',
    onChange: (e) => {
      const f = e.target.files?.[0];
      if (f) cargarArchivo(f);
    },
  });

  const btnElegir = crearEl('label', { class: 'recortador__elegir-wrap' }, [
    inputArchivo,
    crearEl('span', { class: 'recortador__elegir' }, ['Elegir archivo']),
    crearEl('span', { class: 'recortador__nombre' }, ['Sin archivo']),
  ]);
  efecto(() => {
    const lbl = btnElegir.querySelector('.recortador__nombre');
    lbl.textContent = archivoOrig.value?.name || 'Sin archivo';
  });

  /* Selectores: formato, calidad, proporción, ancho */
  const construirSelectFormato = () => {
    const sel = crearEl('select', {
      class: 'recortador__select',
      onChange: (e) => { fmtSel.value = e.target.value; },
    });
    efecto(() => {
      sel.replaceChildren(
        ...formatosDisp.value.map(f => crearEl('option', {
          value: f, selected: f === fmtSel.value || null,
        }, [FORMATOS[f].label])),
      );
    });
    return sel;
  };

  const inputCalidad = crearEl('input', {
    type: 'range', min: '0.3', max: '1', step: '0.05',
    value: String(calSel.value),
    class: 'recortador__range',
    onInput: (e) => { calSel.value = parseFloat(e.target.value); },
  });
  const calLabel = crearEl('span', { class: 'recortador__valor' }, []);
  efecto(() => {
    calLabel.textContent = `${Math.round(calSel.value * 100)}%`;
    // Si el formato es lossless (PNG), el slider se desactiva visualmente.
    const lossy = FORMATOS[fmtSel.value]?.lossy;
    inputCalidad.disabled = !lossy;
    inputCalidad.parentElement?.classList.toggle('recortador__campo--off', !lossy);
  });

  const selProp = crearEl('select', {
    class: 'recortador__select',
    onChange: (e) => { propSel.value = e.target.value; },
  }, Object.keys(PROPORCIONES).map(k => crearEl('option', {
    value: k, selected: k === propSel.value || null,
  }, [k === 'libre' ? 'Libre' : k])));

  const inputAncho = crearEl('input', {
    type: 'number', min: '50', step: '10',
    value: String(anchoSel.value),
    class: 'recortador__num',
    onInput: (e) => { anchoSel.value = parseInt(e.target.value, 10) || 0; },
  });

  /* Acciones */
  const btnRecortar = Boton({
    texto: 'Recortar y convertir',
    variante: 'primary',
    onClick: exportar,
  });
  efecto(() => {
    btnRecortar.disabled = !archivoOrig.value || procesando.value;
    btnRecortar.classList.toggle('is-loading', procesando.value);
  });

  /* Vista del resultado */
  const resultadoVista = crearEl('div', { class: 'recortador__resultado' });
  efecto(() => {
    const e = exportado.value;
    if (!e) {
      resultadoVista.replaceChildren(
        crearEl('div', { class: 'recortador__resultado-vacio' }, [
          'El resultado aparecerá aquí',
        ]),
      );
      return;
    }
    const orig = archivoOrig.value?.size || 0;
    const ahorro = orig ? Math.max(0, ((orig - e.tamano) / orig) * 100) : 0;
    resultadoVista.replaceChildren(
      crearEl('img', { src: e.url, class: 'recortador__resultado-img', alt: 'Resultado' }),
      crearEl('div', { class: 'recortador__resultado-meta' }, [
        crearEl('div', null, [
          crearEl('strong', null, [`${e.ancho}×${e.alto}`]),
          ` · ${e.formato.replace('image/', '').toUpperCase()}`,
        ]),
        crearEl('div', { class: 'recortador__resultado-tamano' }, [
          formatearTamano(e.tamano),
          orig && crearEl('span', { class: 'recortador__resultado-ahorro' }, [
            ` · −${ahorro.toFixed(0)}% vs original (${formatearTamano(orig)})`,
          ]),
        ]),
        crearEl('div', { class: 'recortador__resultado-acciones' }, [
          Boton({ texto: 'Descargar', variante: 'primary', tamano: 'sm', onClick: descargar }),
        ]),
      ]),
    );
  });

  /* Toolbar de transformación */
  const Toolbar = () => crearEl('div', { class: 'recortador__toolbar' }, [
    Boton({ texto: '⟲ −90°', variante: 'ghost', tamano: 'sm', onClick: () => rotar(-90) }),
    Boton({ texto: '⟳ +90°', variante: 'ghost', tamano: 'sm', onClick: () => rotar(90) }),
    Boton({ texto: '⇿ Voltear', variante: 'ghost', tamano: 'sm', onClick: voltearH }),
    Boton({ texto: '⇕ Voltear', variante: 'ghost', tamano: 'sm', onClick: voltearV }),
    Boton({ texto: '↺ Reiniciar', variante: 'ghost', tamano: 'sm', onClick: reiniciar }),
  ]);

  /* Construcción final */
  return crearEl('div', { class: 'recortador' }, [
    // Cabecera con file picker
    crearEl('div', { class: 'recortador__cabecera' }, [btnElegir]),

    // Lienzo + toolbar
    lienzoRef,
    Toolbar(),

    // Configuración: 4 campos en grid
    crearEl('div', { class: 'recortador__config' }, [
      campo('Formato', construirSelectFormato()),
      campo('Calidad', crearEl('div', { class: 'recortador__campo-fila' }, [inputCalidad, calLabel])),
      campo('Proporción', selProp),
      campo('Ancho (px)', inputAncho),
    ]),

    // Acciones
    crearEl('div', { class: 'recortador__acciones' }, [btnRecortar]),

    // Resultado
    crearEl('h4', { class: 'recortador__h4' }, ['Resultado']),
    resultadoVista,
  ]);
};

const campo = (etiqueta, control) => crearEl('label', { class: 'recortador__campo' }, [
  crearEl('span', { class: 'recortador__campo-etiqueta' }, [etiqueta]),
  control,
]);

const SVG_IMAGEN = `
<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor"
     stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <rect x="3" y="3" width="18" height="18" rx="2" />
  <circle cx="8.5" cy="8.5" r="1.5" />
  <path d="m21 15-5-5L5 21" />
</svg>`;
