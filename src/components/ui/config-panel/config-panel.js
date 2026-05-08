import { crearEl, atraparFoco } from '../../../utils/helpers/dom.js';
import { Boton } from '../button/button.js';
import { Selector } from '../select/select.js';
import { Icono } from '../icon/icons.js';
import { estadoUi, FUENTES_DISPONIBLES } from '../../../store/ui.store.js';
import { CONFIG_APP } from '../../../config/app.config.js';


const TEMAS = [
  { id: 'light',  nombre: 'Claro',  icono: 'sol',     className: 'config-theme--light' },
  { id: 'dark',   nombre: 'Oscuro', icono: 'luna',    className: 'config-theme--dark'  },
  { id: 'system', nombre: 'Auto',   icono: 'monitor', className: 'config-theme--auto'  },
];

const COLORES_MARCA = [
  { id: 'blue',    nombre: 'Azul',     hex: '#3b82f6' },
  { id: 'indigo',  nombre: 'Índigo',   hex: '#6366f1' },
  { id: 'violet',  nombre: 'Violeta',  hex: '#8b5cf6' },
  { id: 'cyan',    nombre: 'Cian',     hex: '#06b6d4' },
  { id: 'emerald', nombre: 'Esmeralda',hex: '#10b981' },
  { id: 'amber',   nombre: 'Ámbar',    hex: '#f59e0b' },
  { id: 'rose',    nombre: 'Rosa',     hex: '#f43f5e' },
];

const DENSIDADES = [
  { id: 'compact',     nombre: 'Compacta'  },
  { id: 'comfortable', nombre: 'Cómoda'    },
  { id: 'spacious',    nombre: 'Espaciosa' },
];

const TAMANOS_FUENTE = [
  { id: 'sm', nombre: 'Pequeño', etiqueta: 'Aa' },
  { id: 'md', nombre: 'Mediano', etiqueta: 'Aa' },
  { id: 'lg', nombre: 'Grande',  etiqueta: 'Aa' },
];

const previewLineas = () => [
  crearEl('span', { class: 'config-theme__preview-line' }),
  crearEl('span', { class: 'config-theme__preview-line' }),
  crearEl('span', { class: 'config-theme__preview-line' }),
];

const switchToggle = (estaActivo, alCambiar) => {
  const el = crearEl('button', {
    type: 'button',
    class: 'switch',
    role: 'switch',
    'aria-pressed': estaActivo ? 'true' : 'false',
    onClick: () => {
      const nuevo = el.getAttribute('aria-pressed') !== 'true';
      el.setAttribute('aria-pressed', nuevo ? 'true' : 'false');
      alCambiar(nuevo);
    },
  });
  return el;
};

/** Tarjeta visual seleccionable (radio). */
const tarjetaVisual = ({ activa, alSeleccionar, preview, nombre, varianteClase, ariaLabel }) => {
  return crearEl('button', {
    type: 'button',
    role: 'radio',
    class: ['config-card', varianteClase],
    'aria-checked': activa ? 'true' : 'false',
    'aria-label': ariaLabel || nombre,
    onClick(e) {
      const grupo = e.currentTarget.parentElement;
      grupo.querySelectorAll('.config-card').forEach(c => c.setAttribute('aria-checked', 'false'));
      e.currentTarget.setAttribute('aria-checked', 'true');
      alSeleccionar();
    },
  }, [
    preview,
    crearEl('div', { class: 'config-card__name' }, [nombre]),
  ]);
};

/** Swatches de color circulares (selección única). */
const grupoColores = ({ opciones, valor, alCambiar, ariaLabel }) => {
  const grupo = crearEl('div', { class: 'config-colores', role: 'radiogroup', 'aria-label': ariaLabel });
  const botones = opciones.map((op) => {
    const btn = crearEl('button', {
      type: 'button',
      role: 'radio',
      class: 'config-color',
      title: op.nombre,
      'aria-label': op.nombre,
      'aria-checked': op.id === valor ? 'true' : 'false',
      style: { backgroundColor: op.hex },
      onClick: () => {
        botones.forEach(b => b.setAttribute('aria-checked', b === btn ? 'true' : 'false'));
        alCambiar(op.id);
      },
    });
    grupo.appendChild(btn);
    return btn;
  });
  return grupo;
};

/**
 * Panel de configuración deslizable. `PanelConfiguracion.abrir()`.
 */
export const PanelConfiguracion = {
  abrir() {
    let liberarFoco = null;

    const cerrar = () => {
      liberarFoco?.();
      backdrop.remove();
      panel.remove();
      document.removeEventListener('keydown', escHandler);
    };

    const escHandler = (e) => { if (e.key === 'Escape') cerrar(); };

    // ---------- Esquema de color (3 cards con preview) ----------
    const grupoTema = crearEl('div', {
      class: 'config-themes', role: 'radiogroup', 'aria-label': 'Esquema de color',
    });
    TEMAS.forEach((tema) => {
      const btn = crearEl('button', {
        type: 'button',
        role: 'radio',
        class: ['config-theme', tema.className],
        'aria-checked': estadoUi.tema.peek() === tema.id ? 'true' : 'false',
        'aria-label': tema.nombre,
        onClick: () => {
          grupoTema.querySelectorAll('.config-theme').forEach(b =>
            b.setAttribute('aria-checked', b === btn ? 'true' : 'false'));
          estadoUi.establecerTema(tema.id);
        },
      }, [
        crearEl('div', { class: 'config-theme__preview' }, [
          crearEl('div', { class: 'config-theme__preview-side' }),
          crearEl('div', { class: 'config-theme__preview-main' }, previewLineas()),
        ]),
        crearEl('div', { class: 'config-theme__name' }, [
          Icono(tema.icono, { tamano: 14 }),
          crearEl('span', null, [tema.nombre]),
        ]),
      ]);
      grupoTema.appendChild(btn);
    });

    // ---------- Color de marca (swatches) ----------
    const colores = grupoColores({
      opciones: COLORES_MARCA,
      valor: estadoUi.colorMarca.peek(),
      alCambiar: (id) => estadoUi.establecerColorMarca(id),
      ariaLabel: 'Color de marca',
    });

    // ---------- Densidad ----------
    const grupoDensidad = crearEl('div', {
      class: 'config-cards', role: 'radiogroup', 'aria-label': 'Densidad',
    });
    DENSIDADES.forEach((d) => {
      const preview = crearEl('div', { class: 'config-card__preview' }, [
        crearEl('span', { class: 'config-card__preview-line' }),
        crearEl('span', { class: 'config-card__preview-line' }),
        crearEl('span', { class: 'config-card__preview-line' }),
      ]);
      grupoDensidad.appendChild(tarjetaVisual({
        activa: estadoUi.densidad.peek() === d.id,
        alSeleccionar: () => estadoUi.establecerDensidad(d.id),
        preview, nombre: d.nombre,
        varianteClase: `config-card--${d.id}`,
      }));
    });

    // ---------- Tamaño de fuente ----------
    const grupoFuente = crearEl('div', {
      class: 'config-cards', role: 'radiogroup', 'aria-label': 'Tamaño de fuente',
    });
    TAMANOS_FUENTE.forEach((f) => {
      const preview = crearEl('div', { class: 'config-card__aa' }, [f.etiqueta]);
      grupoFuente.appendChild(tarjetaVisual({
        activa: estadoUi.tamanoFuente.peek() === f.id,
        alSeleccionar: () => estadoUi.establecerTamanoFuente(f.id),
        preview, nombre: f.nombre,
        varianteClase: `config-card--font-${f.id}`,
      }));
    });

    // ---------- Tipografía (Selector simple, como Idioma) ----------
    const selectorTipografia = Selector({
      opciones: FUENTES_DISPONIBLES.map(f => ({ value: f.id, label: f.nombre })),
      value: estadoUi.fuente.peek(),
      onChange: (v) => estadoUi.establecerFuente(v),
    });

    // ---------- Toggles ----------
    const switchRtl = switchToggle(estadoUi.direccion.peek() === 'rtl', (v) => {
      estadoUi.establecerDireccion(v ? 'rtl' : 'ltr');
    });
    const switchSidebar = switchToggle(estadoUi.barraFijada.peek(), (v) => {
      estadoUi.barraFijada.value = v;
    });

    // ---------- Idioma ----------
    const selectorIdioma = Selector({
      opciones: CONFIG_APP.ui.idiomasSoportados.map(l => ({
        value: l, label: l === 'es' ? 'Español' : 'English',
      })),
      value: estadoUi.idioma.peek(),
      onChange: (v) => estadoUi.establecerIdioma(v),
    });

    // ---------- Disposición de la navegación (3 cards visuales) ----------
    // Cada preset combina posición + estilo. UX más simple que dos dropdowns.
    const PRESETS_LAYOUT = [
      { id: 'insertada', nombre: 'Insertada',     posicion: 'vertical', estilo: 'default' },
      { id: 'flotante',  nombre: 'Flotante',      posicion: 'vertical', estilo: 'card' },
      { id: 'barra',     nombre: 'Barra Lateral', posicion: 'vertical', estilo: 'vibrant' },
    ];

    const presetActivo = () => {
      const pos = estadoUi.posicionNav.peek();
      const est = estadoUi.estiloSidebar.peek();
      return PRESETS_LAYOUT.find(p => p.posicion === pos && p.estilo === est)?.id || 'insertada';
    };

    const grupoLayouts = crearEl('div', {
      class: 'config-layouts', role: 'radiogroup', 'aria-label': 'Disposición de la navegación',
    });
    PRESETS_LAYOUT.forEach((preset) => {
      const preview = crearEl('div', { class: 'config-layout__preview' }, [
        crearEl('div', { class: 'config-layout__preview-sidebar' }),
        crearEl('div', { class: 'config-layout__preview-content' }),
      ]);
      const card = crearEl('button', {
        type: 'button',
        role: 'radio',
        class: ['config-layout', `config-layout--${preset.id}`],
        'aria-checked': presetActivo() === preset.id ? 'true' : 'false',
        'aria-label': preset.nombre,
        onClick(e) {
          grupoLayouts.querySelectorAll('.config-layout').forEach(c =>
            c.setAttribute('aria-checked', c === e.currentTarget ? 'true' : 'false'));
          estadoUi.establecerEstiloSidebar(preset.estilo);
          estadoUi.establecerPosicionNav(preset.posicion);
        },
      }, [preview, crearEl('div', { class: 'config-card__name' }, [preset.nombre])]);
      grupoLayouts.appendChild(card);
    });

    // ---------- Helper de sección con icono ----------
    const seccion = (icono, titulo, hint, contenido) => crearEl('section', { class: 'config-section' }, [
      crearEl('div', { class: 'config-section__label' }, [
        Icono(icono),
        crearEl('span', null, [titulo]),
      ]),
      hint && crearEl('div', { class: 'config-section__hint' }, [hint]),
      contenido,
    ]);

    // ---------- Estructura del panel ----------
    const panel = crearEl('aside', {
      class: 'config-panel',
      role: 'dialog',
      'aria-modal': 'true',
      'aria-labelledby': 'config-panel-title',
    }, [
      crearEl('header', { class: 'config-panel__header' }, [
        crearEl('div', null, [
          crearEl('div', { class: 'config-panel__title', id: 'config-panel-title' }, [
            Icono('ajustes', { tamano: 22 }),
            crearEl('span', null, ['Configuración']),
          ]),
          crearEl('div', { class: 'config-panel__subtitle' }, [
            'Personaliza apariencia, color, densidad e idioma.',
          ]),
        ]),
        crearEl('button', {
          class: 'config-panel__close',
          'aria-label': 'Cerrar',
          onClick: cerrar,
        }, [Icono('cerrar', { tamano: 18 })]),
      ]),
      crearEl('div', { class: 'config-panel__body scroll-discreto' }, [
        seccion('paleta',     'Esquema de color',  'Modo claro, oscuro o automático.', grupoTema),
        seccion('densidad',   'Densidad',          'Espaciado entre elementos.', grupoDensidad),
        seccion('texto_aa',   'Tamaño de fuente',  'Escala todo el sistema.', grupoFuente),
        seccion('paleta',     'Color de marca',    'Cambia el color principal en caliente.', colores),
        seccion('texto_aa',   'Tipografía',        'Familia tipográfica de toda la app.', selectorTipografia),
        seccion('panel',      'Disposición del menú', 'Elige cómo se distribuye sidebar + barra superior.', grupoLayouts),
        seccion('globo',      'Idioma',            null, selectorIdioma),

        crearEl('section', { class: 'config-section' }, [
          crearEl('div', { class: 'config-toggle' }, [
            crearEl('div', { style: { flex: 1 } }, [
              crearEl('div', { class: 'config-section__label' }, [
                Icono('flechas_lr'),
                crearEl('span', null, ['Modo RTL']),
              ]),
              crearEl('div', { class: 'config-section__hint', style: { margin: 0 } }, [
                'Lectura de derecha a izquierda.',
              ]),
            ]),
            switchRtl,
          ]),
          crearEl('div', { class: 'config-toggle' }, [
            crearEl('div', { style: { flex: 1 } }, [
              crearEl('div', { class: 'config-section__label' }, [
                Icono('panel'),
                crearEl('span', null, ['Barra lateral expandida']),
              ]),
              crearEl('div', { class: 'config-section__hint', style: { margin: 0 } }, [
                'Mostrar texto e items en el menú.',
              ]),
            ]),
            switchSidebar,
          ]),
        ]),

        Boton({
          texto: 'Restablecer valores por defecto',
          variante: 'outline',
          bloque: true,
          onClick: () => {
            estadoUi.establecerTema('system');
            estadoUi.establecerIdioma('es');
            estadoUi.establecerDireccion('ltr');
            estadoUi.establecerDensidad('comfortable');
            estadoUi.establecerTamanoFuente('md');
            estadoUi.establecerFuente('inter');
            estadoUi.establecerColorMarca('blue');
            estadoUi.establecerEstiloSidebar('default');
            estadoUi.barraFijada.value = true;
            cerrar();
            // Posición del nav al final para que el reload del layout sea el último
            estadoUi.establecerPosicionNav('vertical');
          },
        }),
      ]),
    ]);

    const backdrop = crearEl('div', {
      class: 'config-panel-backdrop',
      onClick: cerrar,
    });

    document.body.appendChild(backdrop);
    document.body.appendChild(panel);
    document.addEventListener('keydown', escHandler);
    liberarFoco = atraparFoco(panel);
    queueMicrotask(() => panel.querySelector('button')?.focus?.());

    return { cerrar };
  },
};
