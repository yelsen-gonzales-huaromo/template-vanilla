/**
 * Calendario profesional — múltiples modos y configuraciones.
 *
 *   Calendario({
 *     modo: 'dia' | 'rango' | 'multiple',
 *     valor,                    // senal — Date | {desde,hasta} | Date[]
 *     minFecha,                 // Date — no permitir antes
 *     maxFecha,                 // Date — no permitir después
 *     diasDeshabilitados,       // (Date) => boolean
 *     diasMarcados,             // [{ fecha: Date, color?: 'success'|'danger'|... }]
 *     tamano: 'sm' | 'md' | 'lg',
 *     mostrarSemanas: false,    // muestra columna nº semana
 *     localeMes: ...,           // 'es', 'en', etc.
 *   })
 *
 *   SelectorFecha({ valor, placeholder, ... })   — input + popover
 *   SelectorRango({ valor, ... })                 — dos inputs + popover
 *   PresetsRango({ alSeleccionar })               — botones Hoy/Semana/Mes…
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';
import { Boton } from '../button/button.js';
import { Icono } from '../icon/icons.js';

const MESES_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DIAS_ES  = ['L','M','X','J','V','S','D'];

const sonMismaFecha = (a, b) => a && b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const dentroDeRango = (fecha, desde, hasta) => {
  if (!desde || !hasta) return false;
  const t = fecha.getTime();
  return t >= desde.getTime() && t <= hasta.getTime();
};

const numeroSemana = (fecha) => {
  const d = new Date(Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()));
  const num = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - num);
  const inicioAnio = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - inicioAnio) / 86400000) + 1) / 7);
};

export const Calendario = ({
  modo = 'dia',
  valor,
  minFecha,
  maxFecha,
  diasDeshabilitados,
  diasMarcados = [],
  tamano = 'md',
  mostrarSemanas = false,
  localeMes = 'es',
  alCambiar,
} = {}) => {
  const cursor = senal(new Date());
  // Inicializar valor según modo
  const sel = valor || senal(
    modo === 'rango' ? { desde: null, hasta: null }
    : modo === 'multiple' ? []
    : null
  );

  // Estado interno para selección de rango (clic 1 vs clic 2)
  const seleccionandoFin = senal(false);

  const meses = localeMes === 'en'
    ? ['January','February','March','April','May','June','July','August','September','October','November','December']
    : MESES_ES;

  // Cabecera con navegación
  const cabezal = crearEl('div', { class: 'cal__cabezal' });
  const tituloMes = crearEl('button', {
    type: 'button', class: 'cal__titulo',
    onClick: () => { /* TODO: vista mes/año */ },
  });
  cabezal.append(
    Boton({ icono: Icono('chevron_l', { tamano: 14 }), variante: 'ghost', tamano: 'sm',
      'aria-label': 'Mes anterior',
      onClick: () => { const d = new Date(cursor.value); d.setMonth(d.getMonth() - 1); cursor.value = d; } }),
    tituloMes,
    Boton({ icono: Icono('chevron_r', { tamano: 14 }), variante: 'ghost', tamano: 'sm',
      'aria-label': 'Mes siguiente',
      onClick: () => { const d = new Date(cursor.value); d.setMonth(d.getMonth() + 1); cursor.value = d; } }),
  );

  // Grid días
  const gridCol = mostrarSemanas ? '32px repeat(7, 1fr)' : 'repeat(7, 1fr)';
  const grid = crearEl('div', { class: 'cal__grid', style: { gridTemplateColumns: gridCol } });

  const elegirDia = (fecha) => {
    if (modo === 'dia') {
      sel.value = fecha;
      alCambiar?.(fecha);
    } else if (modo === 'rango') {
      const r = sel.value || { desde: null, hasta: null };
      if (!r.desde || (r.desde && r.hasta) || seleccionandoFin.value === false) {
        // Inicia rango nuevo
        sel.value = { desde: fecha, hasta: null };
        seleccionandoFin.value = true;
      } else {
        // Cierra rango (asegurando orden)
        const desde = r.desde;
        const [a, b] = desde.getTime() <= fecha.getTime() ? [desde, fecha] : [fecha, desde];
        sel.value = { desde: a, hasta: b };
        seleccionandoFin.value = false;
        alCambiar?.(sel.value);
      }
    } else if (modo === 'multiple') {
      const lista = sel.value || [];
      const idx = lista.findIndex((d) => sonMismaFecha(d, fecha));
      sel.value = idx >= 0
        ? lista.filter((_, i) => i !== idx)
        : [...lista, fecha];
      alCambiar?.(sel.value);
    }
  };

  efecto(() => {
    const d = cursor.value;
    tituloMes.textContent = `${meses[d.getMonth()]} ${d.getFullYear()}`;
    grid.replaceChildren();

    // Cabecera de días (L M X J V S D)
    if (mostrarSemanas) grid.appendChild(crearEl('span', { class: 'cal__dow' }, ['#']));
    DIAS_ES.forEach((l) => grid.appendChild(crearEl('span', { class: 'cal__dow' }, [l])));

    const primero = new Date(d.getFullYear(), d.getMonth(), 1);
    const lunesPos = (primero.getDay() + 6) % 7;
    const totalDias = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();

    // Filas de 7 días — agrupadas para mostrar nº de semana opcional
    const semanas = [];
    let semana = [];
    // Espacios vacíos antes del día 1
    for (let i = 0; i < lunesPos; i++) semana.push(null);
    for (let n = 1; n <= totalDias; n++) {
      semana.push(new Date(d.getFullYear(), d.getMonth(), n));
      if (semana.length === 7) { semanas.push(semana); semana = []; }
    }
    if (semana.length) {
      while (semana.length < 7) semana.push(null);
      semanas.push(semana);
    }

    const hoy = new Date();
    const seleccion = sel.value;

    semanas.forEach((sem) => {
      if (mostrarSemanas) {
        const primerDia = sem.find((x) => x);
        grid.appendChild(crearEl('span', { class: 'cal__semana' },
          [primerDia ? String(numeroSemana(primerDia)) : '']));
      }
      sem.forEach((fecha) => {
        if (!fecha) { grid.appendChild(crearEl('span', { class: 'cal__hueco' })); return; }

        const esHoy = sonMismaFecha(fecha, hoy);
        const fueraMin = minFecha && fecha < minFecha;
        const fueraMax = maxFecha && fecha > maxFecha;
        const desh = fueraMin || fueraMax || diasDeshabilitados?.(fecha);
        const marcado = diasMarcados.find((m) => sonMismaFecha(m.fecha, fecha));

        // Estados de selección por modo
        let claseSel = '';
        if (modo === 'dia' && sonMismaFecha(seleccion, fecha)) {
          claseSel = 'cal__dia--seleccionado';
        } else if (modo === 'rango' && seleccion) {
          if (sonMismaFecha(seleccion.desde, fecha)) claseSel = 'cal__dia--seleccionado cal__dia--inicio';
          else if (sonMismaFecha(seleccion.hasta, fecha)) claseSel = 'cal__dia--seleccionado cal__dia--fin';
          else if (dentroDeRango(fecha, seleccion.desde, seleccion.hasta)) claseSel = 'cal__dia--rango';
        } else if (modo === 'multiple' && Array.isArray(seleccion) && seleccion.some((s) => sonMismaFecha(s, fecha))) {
          claseSel = 'cal__dia--seleccionado';
        }

        const btn = crearEl('button', {
          type: 'button',
          class: ['cal__dia', esHoy && 'cal__dia--hoy', desh && 'cal__dia--deshabilitado',
                  marcado && 'cal__dia--marcado',
                  marcado && `cal__dia--marca-${marcado.color || 'primary'}`,
                  claseSel],
          disabled: desh || null,
          'aria-label': fecha.toLocaleDateString(),
          onClick: () => elegirDia(fecha),
        }, [
          crearEl('span', { class: 'cal__dia-num' }, [String(fecha.getDate())]),
          marcado && crearEl('span', { class: 'cal__dia-dot', 'aria-hidden': 'true' }),
        ]);
        grid.appendChild(btn);
      });
    });
  });

  return crearEl('div', {
    class: ['cal', `cal--${tamano}`, `cal--modo-${modo}`],
  }, [cabezal, grid]);
};

/* ===========================================================================
   CalendarioCompleto — vista de scheduling tipo FullCalendar / Google Calendar
   Vistas: Mes (con eventos como bloques) y Agenda (lista cronológica)
   =========================================================================== */
const _mesNombre = (i, locale) => (locale === 'en'
  ? ['January','February','March','April','May','June','July','August','September','October','November','December']
  : MESES_ES)[i];

const _diasDOW_largos = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];

export const CalendarioCompleto = ({
  eventos = [],          // [{ id, titulo, inicio: Date, fin?, color }]
  vista = 'mes',         // 'mes' | 'agenda'
  cursor,                // senal opcional con el mes mostrado
  alClickEvento,
  alClickDia,
  localeMes = 'es',
  altura = '600px',
} = {}) => {
  const cur = cursor || senal(new Date());
  const vistaActual = senal(vista);

  // ---- Cabecera ----
  const titulo = crearEl('h3', { class: 'cal-x__titulo' });

  const btnHoy = Boton({
    texto: 'Hoy', variante: 'secondary', tamano: 'sm',
    onClick: () => { cur.value = new Date(); },
  });
  const btnPrev = Boton({
    icono: Icono('chevron_l', { tamano: 14 }), variante: 'ghost', tamano: 'sm',
    'aria-label': 'Anterior', soloIcono: true,
    onClick: () => {
      const d = new Date(cur.value);
      d.setMonth(d.getMonth() - 1);
      cur.value = d;
    },
  });
  const btnNext = Boton({
    icono: Icono('chevron_r', { tamano: 14 }), variante: 'ghost', tamano: 'sm',
    'aria-label': 'Siguiente', soloIcono: true,
    onClick: () => {
      const d = new Date(cur.value);
      d.setMonth(d.getMonth() + 1);
      cur.value = d;
    },
  });

  const botonVista = (id, label) => crearEl('button', {
    type: 'button', class: 'cal-x__vista-btn',
    'data-activo': String(vistaActual.value === id),
    onClick: () => { vistaActual.value = id; },
  }, [label]);
  const btnMes    = botonVista('mes',    'Mes');
  const btnAgenda = botonVista('agenda', 'Agenda');

  const cabecera = crearEl('div', { class: 'cal-x__cabecera' }, [
    crearEl('div', { class: 'cal-x__izq' }, [btnPrev, btnNext, btnHoy]),
    titulo,
    crearEl('div', { class: 'cal-x__vistas', role: 'tablist' }, [btnMes, btnAgenda]),
  ]);

  // ---- Cuerpo (cambia según vista) ----
  const cuerpo = crearEl('div', { class: 'cal-x__cuerpo', style: { minHeight: altura } });

  const eventosDelDia = (fecha) => eventos
    .filter((e) => sonMismaFecha(e.inicio, fecha))
    .sort((a, b) => a.inicio - b.inicio);

  const renderVistaMes = () => {
    cuerpo.replaceChildren();
    const d = cur.value;

    // Cabecera de DOW
    const dowHead = crearEl('div', { class: 'cal-x__dow' });
    _diasDOW_largos.forEach((l) => dowHead.appendChild(crearEl('span', { class: 'cal-x__dow-cell' }, [l])));
    cuerpo.appendChild(dowHead);

    // Grid de 6 semanas (incluye días del mes anterior/siguiente)
    const grid = crearEl('div', { class: 'cal-x__grid' });
    const primero = new Date(d.getFullYear(), d.getMonth(), 1);
    const lunesPos = (primero.getDay() + 6) % 7;
    const inicioGrid = new Date(primero);
    inicioGrid.setDate(inicioGrid.getDate() - lunesPos);

    const hoy = new Date();
    for (let i = 0; i < 42; i++) {
      const fecha = new Date(inicioGrid);
      fecha.setDate(inicioGrid.getDate() + i);
      const enMes = fecha.getMonth() === d.getMonth();
      const esHoy = sonMismaFecha(fecha, hoy);

      const celda = crearEl('div', {
        class: ['cal-x__celda', !enMes && 'cal-x__celda--otro-mes', esHoy && 'cal-x__celda--hoy'],
        onClick: () => alClickDia?.(fecha),
      });
      celda.appendChild(crearEl('span', { class: 'cal-x__num' }, [String(fecha.getDate())]));

      const dia = eventosDelDia(fecha);
      const visibles = dia.slice(0, 3);
      visibles.forEach((ev) => {
        const ebloque = crearEl('button', {
          type: 'button',
          class: ['cal-x__evento', ev.color && `cal-x__evento--${ev.color}`],
          title: ev.titulo,
          onClick: (e) => { e.stopPropagation(); alClickEvento?.(ev); },
        }, [
          ev.inicio && crearEl('span', { class: 'cal-x__evento-hora' }, [
            ev.inicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          ]),
          crearEl('span', { class: 'cal-x__evento-titulo' }, [ev.titulo]),
        ]);
        celda.appendChild(ebloque);
      });
      if (dia.length > 3) {
        celda.appendChild(crearEl('span', { class: 'cal-x__mas' }, [`+${dia.length - 3} más`]));
      }
      grid.appendChild(celda);
    }
    cuerpo.appendChild(grid);
  };

  const renderVistaAgenda = () => {
    cuerpo.replaceChildren();
    const d = cur.value;
    const inicioMes = new Date(d.getFullYear(), d.getMonth(), 1);
    const finMes    = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
    const eventosDelMes = eventos
      .filter((e) => e.inicio >= inicioMes && e.inicio <= finMes)
      .sort((a, b) => a.inicio - b.inicio);

    if (!eventosDelMes.length) {
      cuerpo.appendChild(crearEl('div', { class: 'cal-x__vacio' }, ['Sin eventos en este mes']));
      return;
    }

    // Agrupados por día
    const porDia = new Map();
    eventosDelMes.forEach((e) => {
      const k = `${e.inicio.getFullYear()}-${e.inicio.getMonth()}-${e.inicio.getDate()}`;
      if (!porDia.has(k)) porDia.set(k, { fecha: e.inicio, eventos: [] });
      porDia.get(k).eventos.push(e);
    });

    const lista = crearEl('ul', { class: 'cal-x__agenda' });
    [...porDia.values()].forEach((g) => {
      lista.appendChild(crearEl('li', { class: 'cal-x__agenda-dia' }, [
        crearEl('div', { class: 'cal-x__agenda-fecha' }, [
          crearEl('span', { class: 'cal-x__agenda-num' }, [String(g.fecha.getDate())]),
          crearEl('span', { class: 'cal-x__agenda-dow' },
            [_diasDOW_largos[(g.fecha.getDay() + 6) % 7]]),
        ]),
        crearEl('div', { class: 'cal-x__agenda-eventos' },
          g.eventos.map((ev) => crearEl('button', {
            type: 'button',
            class: ['cal-x__agenda-ev', ev.color && `cal-x__evento--${ev.color}`],
            onClick: () => alClickEvento?.(ev),
          }, [
            crearEl('span', { class: 'cal-x__agenda-hora' }, [
              ev.inicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            ]),
            crearEl('span', { class: 'cal-x__agenda-tit' }, [ev.titulo]),
          ])),
        ),
      ]));
    });
    cuerpo.appendChild(lista);
  };

  efecto(() => {
    titulo.textContent = `${_mesNombre(cur.value.getMonth(), localeMes)} ${cur.value.getFullYear()}`;
    btnMes.dataset.activo    = String(vistaActual.value === 'mes');
    btnAgenda.dataset.activo = String(vistaActual.value === 'agenda');
    if (vistaActual.value === 'mes') renderVistaMes();
    else renderVistaAgenda();
  });

  return crearEl('div', { class: 'cal-x' }, [cabecera, cuerpo]);
};

/* ===========================================================================
   PresetsRango — botones rápidos para rango de fechas
   =========================================================================== */
export const PresetsRango = ({ alSeleccionar } = {}) => {
  const hoy = new Date();
  const ayer = new Date(); ayer.setDate(hoy.getDate() - 1);
  const inicioSemana = new Date(); inicioSemana.setDate(hoy.getDate() - ((hoy.getDay() + 6) % 7));
  const inicioMes  = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const hace7      = new Date(); hace7.setDate(hoy.getDate() - 6);
  const hace30     = new Date(); hace30.setDate(hoy.getDate() - 29);
  const hace90     = new Date(); hace90.setDate(hoy.getDate() - 89);

  const presets = [
    { etiqueta: 'Hoy',           rango: { desde: hoy, hasta: hoy } },
    { etiqueta: 'Ayer',          rango: { desde: ayer, hasta: ayer } },
    { etiqueta: 'Esta semana',   rango: { desde: inicioSemana, hasta: hoy } },
    { etiqueta: 'Últimos 7 días',rango: { desde: hace7, hasta: hoy } },
    { etiqueta: 'Este mes',      rango: { desde: inicioMes, hasta: hoy } },
    { etiqueta: 'Últimos 30 días', rango: { desde: hace30, hasta: hoy } },
    { etiqueta: 'Últimos 90 días', rango: { desde: hace90, hasta: hoy } },
  ];

  return crearEl('div', { class: 'cal-presets' },
    presets.map((p) => Boton({
      texto: p.etiqueta, variante: 'ghost', tamano: 'sm',
      onClick: () => alSeleccionar?.(p.rango),
    })),
  );
};

/* ===========================================================================
   SelectorFecha — input + popover con Calendario
   =========================================================================== */
export const SelectorFecha = ({
  valor,
  placeholder = 'Selecciona una fecha',
  formato = (d) => d ? d.toLocaleDateString() : '',
  ...props
} = {}) => {
  const sel = valor || senal(null);
  const abierto = senal(false);

  const input = crearEl('input', {
    type: 'text', class: 'cal-selector__input', placeholder, readonly: 'true',
    onClick: () => { abierto.value = !abierto.value; },
  });
  efecto(() => { input.value = formato(sel.value); });

  const popover = crearEl('div', { class: 'cal-selector__popover' }, [
    Calendario({
      ...props,
      modo: 'dia',
      valor: sel,
      alCambiar: (d) => { sel.value = d; abierto.value = false; props.alCambiar?.(d); },
    }),
  ]);
  efecto(() => { popover.style.display = abierto.value ? 'block' : 'none'; });

  // Cerrar al click fuera
  const host = crearEl('div', { class: 'cal-selector' }, [
    crearEl('span', { class: 'cal-selector__icono', 'aria-hidden': 'true' }, [
      Icono('calendario', { tamano: 14 }),
    ]),
    input, popover,
  ]);
  document.addEventListener('click', (e) => {
    if (!host.contains(e.target)) abierto.value = false;
  });
  return host;
};

/* ===========================================================================
   SelectorRango — input + popover con Calendario en modo rango
   =========================================================================== */
export const SelectorRango = ({
  valor,
  formato = (d) => d ? d.toLocaleDateString() : '',
  conPresets = true,
  ...props
} = {}) => {
  const sel = valor || senal({ desde: null, hasta: null });
  const abierto = senal(false);

  const input = crearEl('input', {
    type: 'text', class: 'cal-selector__input', readonly: 'true',
    placeholder: 'Selecciona un rango',
    onClick: () => { abierto.value = !abierto.value; },
  });
  efecto(() => {
    const r = sel.value;
    input.value = r?.desde && r?.hasta
      ? `${formato(r.desde)} → ${formato(r.hasta)}`
      : r?.desde ? `${formato(r.desde)} → …` : '';
  });

  const cuerpo = crearEl('div', { class: 'cal-selector__cuerpo' });
  if (conPresets) {
    cuerpo.appendChild(PresetsRango({
      alSeleccionar: (rango) => { sel.value = rango; props.alCambiar?.(rango); },
    }));
  }
  cuerpo.appendChild(Calendario({
    ...props, modo: 'rango', valor: sel,
    alCambiar: (r) => { props.alCambiar?.(r); },
  }));

  const popover = crearEl('div', { class: 'cal-selector__popover cal-selector__popover--ancho' }, [cuerpo]);
  efecto(() => { popover.style.display = abierto.value ? 'block' : 'none'; });

  const host = crearEl('div', { class: 'cal-selector' }, [
    crearEl('span', { class: 'cal-selector__icono', 'aria-hidden': 'true' }, [
      Icono('calendario', { tamano: 14 }),
    ]),
    input, popover,
  ]);
  document.addEventListener('click', (e) => {
    if (!host.contains(e.target)) abierto.value = false;
  });
  return host;
};
