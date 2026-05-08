/**
 * Pickers personalizados — ColorPicker, DatePicker, TimePicker.
 *
 *  Comportamiento común:
 *   - Click en CUALQUIER parte del input (incluido el icono trigger) abre el panel.
 *   - El panel flotante hereda el ANCHO del input (responsive: input ancho → panel ancho).
 *   - Edición directa: se puede tipear el valor en el input además de usar el panel.
 *   - Aspecto flotante moderno (sombra grande + fondo translúcido + animación entrada).
 *   - Cierre con click-fuera, ESC y resize.
 *   - position: absolute con coordenadas de página (rect.top + window.scrollY) para
 *     sobrevivir al scroll del viewport (no salta como con position: fixed).
 */

import { crearEl } from '../../../utils/helpers/dom.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { PAISES, buscarPais } from './_paises.js';
import { cargarFlagIcons } from '../../../integrations/flag-icons/index.js';
import { abrirPanel, cerrarPopoverActivo } from './_popover.js';

// Bloquea cualquier carácter que no encaje en la regex provista — tanto al
// tipear como al pegar (paste). Las teclas de control (backspace, flechas,
// tab, ctrl+x/c/v/z/y) no se ven afectadas. La regex se evalúa por carácter.
const filtrarTeclas = (input, getRegex) => {
  input.addEventListener('beforeinput', (e) => {
    if (!e.data) return;             // borrar / autocomplete vacío
    const regex = getRegex();
    for (const c of e.data) {
      if (!regex.test(c)) { e.preventDefault(); return; }
    }
  });
};

// Crea wrapper [input + icon trigger] que abre el panel al click en cualquier parte.
const crearTrigger = ({ icono, valor, placeholder, abrir, onInput, deshabilitado, valido, invalido }) => {
  const input = crearEl('input', {
    type: 'text',
    class: 'input',
    value: valor || '',
    placeholder: placeholder || '',
    disabled: deshabilitado || null,
    'data-valido': valido || null,
    'aria-invalid': invalido || null,
    onInput: (e) => onInput && onInput(e.target.value, e),
    onKeyDown: (e) => {
      if (e.key === 'Enter') { e.preventDefault(); abrir(); }
      if (e.key === 'Escape') cerrarPopoverActivo();
    },
  });
  // Span (no <button>) para evitar doble-disparo: la apertura la maneja
  // el onMouseDown del wrap. El span sigue siendo accesible por el input.
  const trigger = crearEl('span', {
    class: 'picker-trigger__icono',
    'aria-hidden': 'true',
  }, [icono]);

  const wrap = crearEl('div', {
    class: 'picker-trigger',
    onMouseDown: (e) => {
      // Click en cualquier parte del wrap (input o icono) abre el panel.
      // Si el panel ya está abierto y se clickea el input para editar,
      // no lo cerramos — dejamos que el browser maneje el foco/cursor.
      if (e.target === input && document.activeElement === input) return;
      e.preventDefault();
      input.focus();
      abrir();
    },
  }, [input, trigger]);

  return { wrap, input };
};

// ===========================================================================
//  COLOR PICKER
// ===========================================================================
const PALETA = [
  // Vibrant tints
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
  '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#64748b',
  // Pastels
  '#fecaca', '#fed7aa', '#fde68a', '#fef08a', '#bbf7d0', '#bfdbfe',
  '#c7d2fe', '#ddd6fe', '#fbcfe8', '#fecdd3', '#e2e8f0', '#1e293b',
];

const validarHex = (v) => /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v);
const normalizarHex = (v) => {
  if (!v) return '#000000';
  let h = v.startsWith('#') ? v : '#' + v;
  if (h.length === 4) h = '#' + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
  return h.toLowerCase();
};

export const ColorPicker = ({ value = '#3b82f6', onChange, placeholder = '#000000', deshabilitado } = {}) => {
  let valor = normalizarHex(value);
  let inputRef = null;
  let triggerMuestraRef = null;   // square en el icono del input (siempre visible)
  let panelMuestraRef = null;     // preview grande dentro del panel (cuando está abierto)
  let panelRef = null;
  let inputHexRef = null;

  const setValor = (v, sincronizarInput = true) => {
    if (!validarHex(v)) return;
    valor = normalizarHex(v);
    if (sincronizarInput && inputRef) inputRef.value = valor;
    if (triggerMuestraRef) triggerMuestraRef.style.background = valor;
    if (panelMuestraRef && panelMuestraRef.isConnected) panelMuestraRef.style.background = valor;
    if (inputHexRef && inputHexRef.isConnected && document.activeElement !== inputHexRef) inputHexRef.value = valor;
    if (panelRef && panelRef.isConnected) panelRef.querySelectorAll('.color-swatch').forEach((s) => {
      s.classList.toggle('color-swatch--activo', s.dataset.hex === valor);
    });
    onChange && onChange(valor);
  };

  const abrir = () => {
    const swatches = PALETA.map((hex) => crearEl('button', {
      type: 'button',
      class: ['color-swatch', hex === valor && 'color-swatch--activo'],
      style: { background: hex },
      'data-hex': hex,
      'aria-label': hex,
      onClick: (e) => { e.preventDefault(); setValor(hex); },
    }));

    const inputNativo = crearEl('input', {
      type: 'color',
      class: 'color-nativo',
      value: valor,
      onInput: (e) => setValor(e.target.value),
    });

    inputHexRef = crearEl('input', {
      type: 'text',
      class: 'input input--sm',
      value: valor,
      maxlength: 7,
      style: { fontFamily: 'monospace', textAlign: 'center' },
      onInput: (e) => {
        if (validarHex(e.target.value)) setValor(e.target.value, true);
      },
    });

    panelRef = crearEl('div', { class: 'picker-panel__contenido color-panel' }, [
      crearEl('div', { class: 'color-panel__head' }, [
        crearEl('div', { class: 'color-panel__preview', style: { background: valor }, ref: (n) => { panelMuestraRef = n; } }),
        crearEl('label', { class: 'color-panel__nativo' }, [
          inputNativo,
          'Personalizar',
        ]),
        inputHexRef,
      ]),
      crearEl('div', { class: 'color-panel__sep' }, ['Paleta sugerida']),
      crearEl('div', { class: 'color-swatches' }, swatches),
    ]);

    abrirPanel({ ancla: wrap, contenido: panelRef, onCerrar: () => { panelMuestraRef = null; inputHexRef = null; panelRef = null; } });
  };

  const { wrap, input } = crearTrigger({
    icono: crearEl('span', { class: 'color-trigger__muestra', style: { background: valor }, ref: (n) => { triggerMuestraRef = n; } }),
    valor,
    placeholder,
    deshabilitado,
    abrir,
    onInput: (v) => { if (validarHex(v)) setValor(v, false); },
  });
  inputRef = input;
  inputRef.classList.add('input--mono');

  return wrap;
};

// ===========================================================================
//  DATE PICKER
// ===========================================================================
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const MESES_CORTO = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
// Lunes primero — convención hispana / ISO 8601.
const DIAS_CORTO = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

const formatearFecha = (d) => {
  if (!d) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};
const parsearFecha = (s) => {
  if (!s) return null;
  const m1 = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m1) {
    const d = new Date(+m1[3], +m1[2] - 1, +m1[1]);
    return isNaN(d) ? null : d;
  }
  const m2 = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m2) {
    const d = new Date(+m2[1], +m2[2] - 1, +m2[3]);
    return isNaN(d) ? null : d;
  }
  return null;
};

export const DatePicker = ({ value, onChange, placeholder = 'DD/MM/YYYY', deshabilitado, minDate, maxDate } = {}) => {
  let fecha = value instanceof Date ? value : parsearFecha(value);
  let cursorMes = fecha ? new Date(fecha.getFullYear(), fecha.getMonth(), 1) : new Date();
  cursorMes.setDate(1);
  let vista = 'dias';   // 'dias' | 'meses' | 'anos'
  let inputRef = null;
  let panelRef = null;

  const setFecha = (d, sincronizarInput = true) => {
    fecha = d;
    if (sincronizarInput && inputRef) inputRef.value = formatearFecha(d);
    onChange && onChange(d);
  };

  // Cuerpo según la vista actual: días | meses | años
  const renderCuerpo = () => {
    if (!panelRef) return;
    const cuerpo = panelRef.querySelector('.date-panel__cuerpo');
    const btnMes = panelRef.querySelector('.date-panel__btn-mes');
    const btnAno = panelRef.querySelector('.date-panel__btn-ano');

    btnMes.textContent = MESES[cursorMes.getMonth()];
    btnAno.textContent = String(cursorMes.getFullYear());
    btnMes.classList.toggle('date-panel__btn-titulo--activo', vista === 'meses');
    btnAno.classList.toggle('date-panel__btn-titulo--activo', vista === 'anos');

    cuerpo.replaceChildren();

    if (vista === 'dias') {
      const grid = crearEl('div', { class: 'date-grid' });
      DIAS_CORTO.forEach((d) => grid.appendChild(crearEl('div', { class: 'date-grid__dow' }, [d])));

      const primero = new Date(cursorMes.getFullYear(), cursorMes.getMonth(), 1);
      const offset = (primero.getDay() + 6) % 7; // L=0, D=6
      const ultimoDia = new Date(cursorMes.getFullYear(), cursorMes.getMonth() + 1, 0).getDate();
      const hoy = new Date(); hoy.setHours(0, 0, 0, 0);

      const ultimoMesAnt = new Date(cursorMes.getFullYear(), cursorMes.getMonth(), 0).getDate();
      for (let i = offset - 1; i >= 0; i--) {
        grid.appendChild(crearEl('button', { type: 'button', class: 'date-cell date-cell--otro', tabindex: -1 }, [String(ultimoMesAnt - i)]));
      }
      for (let dia = 1; dia <= ultimoDia; dia++) {
        const d = new Date(cursorMes.getFullYear(), cursorMes.getMonth(), dia);
        const esHoy = d.getTime() === hoy.getTime();
        const sel = fecha && d.getFullYear() === fecha.getFullYear() && d.getMonth() === fecha.getMonth() && d.getDate() === fecha.getDate();
        const fueraMin = minDate && d < new Date(minDate);
        const fueraMax = maxDate && d > new Date(maxDate);
        grid.appendChild(crearEl('button', {
          type: 'button',
          class: ['date-cell', esHoy && 'date-cell--hoy', sel && 'date-cell--sel'],
          disabled: (fueraMin || fueraMax) || null,
          onClick: (e) => { e.preventDefault(); setFecha(d); renderCuerpo(); cerrarPopoverActivo(); },
        }, [String(dia)]));
      }
      const restante = 42 - (offset + ultimoDia);
      for (let i = 1; i <= restante; i++) {
        grid.appendChild(crearEl('button', { type: 'button', class: 'date-cell date-cell--otro', tabindex: -1 }, [String(i)]));
      }
      cuerpo.appendChild(grid);
    }

    if (vista === 'meses') {
      const grid = crearEl('div', { class: 'date-meses' });
      for (let m = 0; m < 12; m++) {
        const sel = m === cursorMes.getMonth();
        grid.appendChild(crearEl('button', {
          type: 'button',
          class: ['date-mes-cell', sel && 'date-mes-cell--sel'],
          onClick: (e) => {
            e.preventDefault();
            cursorMes = new Date(cursorMes.getFullYear(), m, 1);
            vista = 'dias'; renderCuerpo();
          },
        }, [MESES_CORTO[m]]));
      }
      cuerpo.appendChild(grid);
    }

    if (vista === 'anos') {
      const grid = crearEl('div', { class: 'date-anos' });
      const anoBase = Math.floor(cursorMes.getFullYear() / 12) * 12;
      for (let i = 0; i < 12; i++) {
        const a = anoBase + i;
        const sel = a === cursorMes.getFullYear();
        grid.appendChild(crearEl('button', {
          type: 'button',
          class: ['date-mes-cell', sel && 'date-mes-cell--sel'],
          onClick: (e) => {
            e.preventDefault();
            cursorMes = new Date(a, cursorMes.getMonth(), 1);
            vista = 'meses'; renderCuerpo();
          },
        }, [String(a)]));
      }
      cuerpo.appendChild(grid);
    }
  };

  // Las flechas avanzan 1 mes en vista días, 1 año en meses, 12 años en años.
  const navegar = (dir) => {
    if (vista === 'dias') cursorMes = new Date(cursorMes.getFullYear(), cursorMes.getMonth() + dir, 1);
    else if (vista === 'meses') cursorMes = new Date(cursorMes.getFullYear() + dir, cursorMes.getMonth(), 1);
    else cursorMes = new Date(cursorMes.getFullYear() + 12 * dir, cursorMes.getMonth(), 1);
    renderCuerpo();
  };

  const abrir = () => {
    if (fecha) cursorMes = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
    vista = 'dias';
    panelRef = crearEl('div', { class: 'picker-panel__contenido date-panel' }, [
      crearEl('div', { class: 'date-panel__head' }, [
        crearEl('button', {
          type: 'button', class: 'date-panel__nav', 'aria-label': 'Anterior',
          onClick: (e) => { e.preventDefault(); navegar(-1); },
        }, [Icono('chevron_l', { tamano: 14 })]),
        crearEl('div', { class: 'date-panel__titulo' }, [
          crearEl('button', {
            type: 'button', class: 'date-panel__btn-titulo date-panel__btn-mes',
            onClick: (e) => { e.preventDefault(); vista = vista === 'meses' ? 'dias' : 'meses'; renderCuerpo(); },
          }),
          crearEl('button', {
            type: 'button', class: 'date-panel__btn-titulo date-panel__btn-ano',
            onClick: (e) => { e.preventDefault(); vista = vista === 'anos' ? 'dias' : 'anos'; renderCuerpo(); },
          }),
        ]),
        crearEl('button', {
          type: 'button', class: 'date-panel__nav', 'aria-label': 'Siguiente',
          onClick: (e) => { e.preventDefault(); navegar(1); },
        }, [Icono('chevron_r', { tamano: 14 })]),
      ]),
      crearEl('div', { class: 'date-panel__cuerpo' }),
      crearEl('div', { class: 'date-panel__pie' }, [
        crearEl('button', {
          type: 'button', class: 'date-panel__link',
          onClick: (e) => { e.preventDefault(); setFecha(null); cerrarPopoverActivo(); },
        }, ['Borrar']),
        crearEl('button', {
          type: 'button', class: 'date-panel__link',
          onClick: (e) => {
            e.preventDefault();
            const h = new Date(); h.setHours(0, 0, 0, 0);
            cursorMes = new Date(h.getFullYear(), h.getMonth(), 1);
            vista = 'dias'; setFecha(h); renderCuerpo();
          },
        }, ['Hoy']),
      ]),
    ]);
    renderCuerpo();
    abrirPanel({ ancla: wrap, contenido: panelRef, onCerrar: () => { panelRef = null; } });
  };

  const { wrap, input } = crearTrigger({
    icono: Icono('calendario', { tamano: 16 }),
    valor: formatearFecha(fecha),
    placeholder,
    deshabilitado,
    abrir,
    onInput: (v) => {
      const d = parsearFecha(v);
      if (d) { fecha = d; cursorMes = new Date(d.getFullYear(), d.getMonth(), 1); onChange && onChange(d); if (panelRef && panelRef.isConnected) renderGrid(); }
    },
  });
  inputRef = input;
  // Máscara: solo dígitos y `/`. Máx 10 chars (DD/MM/YYYY).
  inputRef.maxLength = 10;
  filtrarTeclas(inputRef, () => /[\d/]/);

  return wrap;
};

// ===========================================================================
//  TIME PICKER  (con switch 12h / 24h)
// ===========================================================================
const formatearHora24 = (h, m) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
const formatearHora12 = (h, m) => {
  const sufijo = h >= 12 ? 'PM' : 'AM';
  let h12 = h % 12; if (h12 === 0) h12 = 12;
  return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${sufijo}`;
};
const parsearHora = (s) => {
  if (!s) return null;
  const limpio = s.trim().toUpperCase();
  // 12h: HH:MM AM/PM
  const m12 = limpio.match(/^(\d{1,2}):(\d{1,2})\s*(AM|PM)$/);
  if (m12) {
    let h = +m12[1]; const m = +m12[2]; const sf = m12[3];
    if (h < 1 || h > 12 || m < 0 || m > 59) return null;
    if (sf === 'PM' && h !== 12) h += 12;
    if (sf === 'AM' && h === 12) h = 0;
    return { h, m };
  }
  // 24h: HH:MM
  const m24 = limpio.match(/^(\d{1,2}):(\d{1,2})$/);
  if (m24) {
    const h = +m24[1]; const m = +m24[2];
    if (h < 0 || h > 23 || m < 0 || m > 59) return null;
    return { h, m };
  }
  return null;
};

export const TimePicker = ({ value, onChange, placeholder, deshabilitado, formato = '24' } = {}) => {
  let fmt = formato === '12' ? '12' : '24';
  let estado = parsearHora(value) || { h: 12, m: 0 };
  let inputRef = null;
  let panelRef = null;

  const formatear = () => fmt === '12' ? formatearHora12(estado.h, estado.m) : formatearHora24(estado.h, estado.m);

  const setHora = (parcial, sincronizarInput = true) => {
    estado = { ...estado, ...parcial };
    if (sincronizarInput && inputRef) inputRef.value = formatear();
    if (panelRef) renderListas();
    onChange && onChange({ ...estado, formato: fmt });
  };

  // Centra un botón dentro de su columna SIN tocar el scroll de la página.
  // (el scrollIntoView nativo escala todos los ancestros scrolleables.)
  const centrarEnColumna = (col, btn) => {
    if (!col || !btn) return;
    col.scrollTop = btn.offsetTop - (col.clientHeight - btn.offsetHeight) / 2;
  };

  const renderListas = () => {
    if (!panelRef) return;
    const colHora = panelRef.querySelector('.time-col--hora');
    const colMin = panelRef.querySelector('.time-col--min');
    const colSf = panelRef.querySelector('.time-col--sf');
    if (!colHora) return;

    colHora.replaceChildren();
    const max = fmt === '12' ? 12 : 24;
    const inicio = fmt === '12' ? 1 : 0;
    let horaMostrar = estado.h;
    if (fmt === '12') {
      horaMostrar = estado.h % 12; if (horaMostrar === 0) horaMostrar = 12;
    }
    let btnHoraSel = null;
    for (let h = inicio; h < inicio + max; h++) {
      const valorH = h;
      const seleccionado = valorH === horaMostrar;
      const btn = crearEl('button', {
        type: 'button',
        class: ['time-cell', seleccionado && 'time-cell--sel'],
        onClick: (e) => {
          e.preventDefault();
          if (fmt === '12') {
            const sf = estado.h >= 12 ? 'PM' : 'AM';
            let real = valorH % 12; if (sf === 'PM') real += 12;
            setHora({ h: real });
          } else {
            setHora({ h: valorH });
          }
        },
      }, [String(valorH).padStart(2, '0')]);
      colHora.appendChild(btn);
      if (seleccionado) btnHoraSel = btn;
    }

    colMin.replaceChildren();
    let btnMinSel = null;
    for (let m = 0; m < 60; m += 5) {
      const sel = m === estado.m;
      const btn = crearEl('button', {
        type: 'button',
        class: ['time-cell', sel && 'time-cell--sel'],
        onClick: (e) => { e.preventDefault(); setHora({ m }); },
      }, [String(m).padStart(2, '0')]);
      colMin.appendChild(btn);
      if (sel) btnMinSel = btn;
    }

    if (colSf) {
      colSf.replaceChildren();
      const esPM = estado.h >= 12;
      ['AM', 'PM'].forEach((sf) => {
        const sel = (sf === 'PM') === esPM;
        colSf.appendChild(crearEl('button', {
          type: 'button',
          class: ['time-cell', sel && 'time-cell--sel'],
          onClick: (e) => {
            e.preventDefault();
            const h = estado.h % 12;
            setHora({ h: sf === 'PM' ? h + 12 : h });
          },
        }, [sf]));
      });
    }

    // Solo centra DENTRO de la columna; nunca afecta al scroll del documento.
    requestAnimationFrame(() => {
      centrarEnColumna(colHora, btnHoraSel);
      centrarEnColumna(colMin, btnMinSel);
    });
  };

  const construirPanel = () => {
    panelRef = crearEl('div', { class: 'picker-panel__contenido time-panel' }, [
      crearEl('div', { class: 'time-panel__formato' }, [
        crearEl('span', { class: 'time-panel__lbl' }, ['Formato']),
        crearEl('div', { class: 'time-toggle' }, [
          crearEl('button', {
            type: 'button',
            class: ['time-toggle__btn', fmt === '12' && 'time-toggle__btn--activo'],
            onClick: (e) => { e.preventDefault(); fmt = '12'; reconstruir(); },
          }, ['12 hr']),
          crearEl('button', {
            type: 'button',
            class: ['time-toggle__btn', fmt === '24' && 'time-toggle__btn--activo'],
            onClick: (e) => { e.preventDefault(); fmt = '24'; reconstruir(); },
          }, ['24 hr']),
        ]),
      ]),
      crearEl('div', { class: 'time-cols' }, [
        crearEl('div', { class: 'time-col time-col--hora', 'aria-label': 'Hora' }),
        crearEl('div', { class: 'time-col time-col--min', 'aria-label': 'Minuto' }),
        fmt === '12' && crearEl('div', { class: 'time-col time-col--sf', 'aria-label': 'AM/PM' }),
      ]),
      crearEl('div', { class: 'time-panel__pie' }, [
        crearEl('button', {
          type: 'button', class: 'date-panel__btn',
          onClick: (e) => {
            e.preventDefault();
            const n = new Date();
            setHora({ h: n.getHours(), m: Math.round(n.getMinutes() / 5) * 5 });
          },
        }, ['Ahora']),
        crearEl('button', {
          type: 'button', class: 'date-panel__btn date-panel__btn--primario',
          onClick: (e) => { e.preventDefault(); cerrarPopoverActivo(); },
        }, ['Listo']),
      ]),
    ]);
    renderListas();
  };

  const aplicarMascara = () => {
    if (!inputRef) return;
    inputRef.maxLength = fmt === '12' ? 8 : 5;     // '02:30 PM' vs '14:30'
  };

  const reconstruir = () => {
    if (!panelRef || !panelRef.parentNode) return;
    const padre = panelRef.parentNode;
    construirPanel();
    padre.replaceChildren(panelRef);
    if (inputRef) inputRef.value = formatear();
    aplicarMascara();
  };

  const abrir = () => {
    construirPanel();
    abrirPanel({ ancla: wrap, contenido: panelRef, onCerrar: () => { panelRef = null; } });
  };

  const ph = placeholder || (fmt === '12' ? 'HH:MM AM/PM' : 'HH:MM');
  const { wrap, input } = crearTrigger({
    icono: Icono('reloj', { tamano: 16 }),
    valor: value ? formatear() : '',
    placeholder: ph,
    deshabilitado,
    abrir,
    onInput: (v) => {
      const p = parsearHora(v);
      if (p) { estado = p; if (panelRef && panelRef.isConnected) renderListas(); onChange && onChange({ ...estado, formato: fmt }); }
    },
  });
  inputRef = input;
  // Máscara dinámica: 24h → solo dígitos y `:`; 12h → además espacio y A/P/M.
  // La regex se reevalúa cada keystroke para que el toggle 12/24 no rompa nada.
  filtrarTeclas(inputRef, () => fmt === '12' ? /[\d:\sAPMapm]/ : /[\d:]/);
  aplicarMascara();

  return wrap;
};

// ===========================================================================
//  PHONE INPUT  (con selector de país + bandera + auto-prefix)
// ===========================================================================
const Bandera = (iso) => crearEl('span', { class: `fi fi-${iso} phone-bandera` });

export const PhoneInput = ({ value = '', pais = 'pe', onChange, placeholder, deshabilitado, valido, invalido } = {}) => {
  // Carga el CSS de banderas cuando se monta el primer PhoneInput.
  cargarFlagIcons();

  let paisActual = buscarPais(pais);
  let panelRef = null;
  let banderaRef = null;
  let dialRef = null;
  let inputRef = null;

  // Formato visual: agrupa los dígitos en bloques de 3 (estilo internacional).
  const formatearTel = (s) => {
    const d = s.replace(/\D/g, '');
    return d.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
  };

  const setPais = (p) => {
    paisActual = p;
    if (banderaRef) {
      banderaRef.className = `fi fi-${p.iso} phone-bandera`;
    }
    if (dialRef) dialRef.textContent = `+${p.dial}`;
    cerrarPopoverActivo();
    if (inputRef) inputRef.focus();
    onChange && onChange({ pais: p, numero: inputRef ? inputRef.value : '', completo: `+${p.dial} ${inputRef ? inputRef.value : ''}` });
  };

  const renderLista = (filtro = '') => {
    if (!panelRef) return;
    const lista = panelRef.querySelector('.phone-lista');
    lista.replaceChildren();
    const q = filtro.trim().toLowerCase();
    const filtrados = q
      ? PAISES.filter((p) => p.nombre.toLowerCase().includes(q) || p.dial.includes(q.replace('+', '')) || p.iso.includes(q))
      : PAISES;

    if (filtrados.length === 0) {
      lista.appendChild(crearEl('div', { class: 'phone-lista__vacio' }, ['Sin resultados']));
      return;
    }

    filtrados.forEach((p) => {
      lista.appendChild(crearEl('button', {
        type: 'button',
        class: ['phone-opt', p.iso === paisActual.iso && 'phone-opt--sel'],
        onClick: (e) => { e.preventDefault(); setPais(p); },
      }, [
        crearEl('span', { class: `fi fi-${p.iso}` }),
        crearEl('span', { class: 'phone-opt__nombre' }, [p.nombre]),
        crearEl('span', { class: 'phone-opt__dial' }, [`+${p.dial}`]),
      ]));
    });
  };

  const abrir = () => {
    const buscador = crearEl('input', {
      type: 'text',
      class: 'input input--sm phone-buscador',
      placeholder: 'Buscar país o código…',
      onInput: (e) => renderLista(e.target.value),
    });

    panelRef = crearEl('div', { class: 'picker-panel__contenido phone-panel' }, [
      buscador,
      crearEl('div', { class: 'phone-lista' }),
    ]);
    renderLista('');
    abrirPanel({ ancla: trigger, contenido: panelRef, onCerrar: () => { panelRef = null; } });
    requestAnimationFrame(() => buscador.focus());
  };

  // Trigger izquierdo: bandera + dial code + chevron. Click abre selector.
  const trigger = crearEl('button', {
    type: 'button',
    class: 'phone-trigger',
    'aria-label': 'Seleccionar país',
    disabled: deshabilitado || null,
    onClick: (e) => { e.preventDefault(); abrir(); },
  }, [
    Bandera(paisActual.iso),
    crearEl('span', { class: 'phone-dial', ref: (n) => { dialRef = n; } }, [`+${paisActual.dial}`]),
    Icono('chevron_d', { tamano: 12 }),
  ]);
  banderaRef = trigger.querySelector('.phone-bandera');

  inputRef = crearEl('input', {
    type: 'tel',
    class: 'input phone-numero',
    placeholder: placeholder || '999 888 777',
    value: formatearTel(value),
    disabled: deshabilitado || null,
    'data-valido': valido || null,
    'aria-invalid': invalido || null,
    onInput: (e) => {
      const original = e.target.value;
      const formateado = formatearTel(original);
      if (formateado !== original) {
        const pos = e.target.selectionStart;
        const diff = formateado.length - original.length;
        e.target.value = formateado;
        const nueva = Math.max(0, pos + diff);
        e.target.setSelectionRange(nueva, nueva);
      }
      onChange && onChange({ pais: paisActual, numero: formateado, completo: `+${paisActual.dial} ${formateado}` });
    },
  });
  // Máscara: solo dígitos y espacios.
  filtrarTeclas(inputRef, () => /[\d\s]/);

  return crearEl('div', {
    class: ['phone-input', invalido && 'phone-input--invalido', valido && 'phone-input--valido', deshabilitado && 'phone-input--deshabilitado'],
  }, [trigger, inputRef]);
};
