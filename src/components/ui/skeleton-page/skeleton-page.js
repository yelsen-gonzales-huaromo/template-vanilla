/**
 * EsqueletoPagina — placeholders a nivel de página, estilo "skeleton screen"
 * (YouTube / LinkedIn / Facebook). Se monta en el slot de la página mientras
 * el módulo lazy-importado de la ruta termina de descargarse y parsearse.
 *
 * Uso normal: el router lo invoca solo. NO hay que tocar cada página.
 *
 *   EsqueletoPagina('/panel/crm')        →  plantilla 'dashboard'
 *   EsqueletoPagina('/modulos/tablas/x') →  plantilla 'tabla'
 *   EsqueletoPagina(ruta, 'formulario')  →  override explícito
 *
 * Cómo elegir plantilla:
 *   1. Si pasas un nombre como 2º argumento, se usa ese.
 *   2. Si no, se resuelve por prefijo de ruta (PATRONES, primer match gana).
 *   3. Si nada empareja, fallback 'texto'.
 *
 * Para sobrescribir desde una ruta sin tocar la página, en routes.js:
 *   meta: { esqueleto: 'tabla' }
 *
 * Las plantillas componen el primitivo `Esqueleto` (shimmer) con la silueta
 * de cada tipo de página. El resultado coincide en estructura con la página
 * real para que el swap no provoque saltos de layout.
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { Esqueleto } from '../skeleton/skeleton.js';

/* ─────────────────────────────────────────────────────────────────────────
   Helpers internos — bloques compuestos reutilizables entre plantillas.
   ───────────────────────────────────────────────────────────────────────── */

const linea = (ancho, alto) => Esqueleto({ variante: 'text', ancho, alto });
const bloque = (alto = '8rem') => Esqueleto({ variante: 'card', alto });
const circ = (tam = '40px') => Esqueleto({ variante: 'circle', ancho: tam, alto: tam });
const pill = (ancho = '5rem') => Esqueleto({ variante: 'chip', ancho });
const boton = (ancho = '6rem') => Esqueleto({ variante: 'button', ancho });

/** Header genérico de página — título + subtítulo + acciones a la derecha. */
const Encabezado = ({ acciones = 2, ancho = '38%' } = {}) =>
  crearEl('div', { class: 'sk-header' }, [
    crearEl('div', { class: 'sk-header__textos' }, [
      Esqueleto({ variante: 'title', ancho }),
      Esqueleto({ variante: 'subtitle', ancho: '60%' }),
    ]),
    crearEl('div', { class: 'sk-header__acciones' },
      Array.from({ length: acciones }, () => boton())),
  ]);

/** Tarjeta KPI: icono + número + etiqueta + sparkline. */
const TarjetaKpi = () =>
  crearEl('div', { class: 'sk-card sk-kpi' }, [
    crearEl('div', { class: 'sk-kpi__head' }, [
      Esqueleto({ variante: 'square', ancho: '32px', alto: '32px' }),
      pill('3.5rem'),
    ]),
    Esqueleto({ variante: 'title', ancho: '55%' }),
    linea('70%'),
    Esqueleto({ variante: 'card', alto: '40px' }),  // sparkline
  ]);

/** Card genérica con cabecera + cuerpo. */
const TarjetaPanel = ({ alto = '18rem', cabecera = true } = {}) =>
  crearEl('div', { class: 'sk-card' }, [
    cabecera && crearEl('div', { class: 'sk-card__head' }, [
      crearEl('div', null, [
        Esqueleto({ variante: 'subtitle', ancho: '8rem' }),
        linea('12rem'),
      ]),
      pill('4rem'),
    ]),
    Esqueleto({ variante: 'card', alto }),
  ]);

/** Fila de tabla: N celdas de ancho variable. */
const FilaTabla = (n = 6) =>
  crearEl('div', { class: 'sk-tabla__fila' },
    Array.from({ length: n }, (_, i) => linea(
      i === 0 ? '40%' : i === n - 1 ? '30%' : i === 1 ? '70%' : '50%',
    )),
  );

/* ─────────────────────────────────────────────────────────────────────────
   Plantillas — cada una recibe `opts` opcionales y devuelve un nodo DOM.
   ───────────────────────────────────────────────────────────────────────── */

const PLANTILLAS = {
  /** Dashboard: header + 4 KPIs + grid 2/1 de gráficos + tabla. */
  dashboard: () => crearEl('div', { class: 'sk-page sk-page--dashboard' }, [
    Encabezado({ acciones: 3 }),
    crearEl('div', { class: 'sk-grid sk-grid--kpis' },
      Array.from({ length: 4 }, () => TarjetaKpi())),
    crearEl('div', { class: 'sk-grid sk-grid--2-1' }, [
      TarjetaPanel({ alto: '20rem' }),
      TarjetaPanel({ alto: '20rem' }),
    ]),
    TarjetaPanel({ alto: '14rem' }),
  ]),

  /** Tabla: header + barra de filtros + tabla de N filas × M columnas. */
  tabla: ({ filas = 8, columnas = 6 } = {}) => crearEl('div', { class: 'sk-page sk-page--tabla' }, [
    Encabezado({ acciones: 2 }),
    crearEl('div', { class: 'sk-card' }, [
      crearEl('div', { class: 'sk-tabla__filtros' }, [
        Esqueleto({ variante: 'card', alto: '38px', ancho: '18rem' }),
        boton('5rem'), boton('5rem'), boton('5rem'),
      ]),
      crearEl('div', { class: 'sk-tabla' }, [
        crearEl('div', { class: 'sk-tabla__cabecera' },
          Array.from({ length: columnas }, () => Esqueleto({ variante: 'subtitle', ancho: '60%' }))),
        ...Array.from({ length: filas }, () => FilaTabla(columnas)),
      ]),
      crearEl('div', { class: 'sk-tabla__paginador' }, [
        linea('8rem'),
        crearEl('div', { class: 'sk-tabla__paginador-btns' },
          Array.from({ length: 5 }, () => Esqueleto({ variante: 'square', ancho: '32px', alto: '32px' }))),
      ]),
    ]),
  ]),

  /** Formulario: header + card con grid de 2 columnas de campos + textarea + botones. */
  formulario: ({ campos = 8 } = {}) => crearEl('div', { class: 'sk-page sk-page--form' }, [
    Encabezado({ acciones: 1 }),
    crearEl('div', { class: 'sk-card' }, [
      crearEl('div', { class: 'sk-form__grid' },
        Array.from({ length: campos }, () => crearEl('div', { class: 'sk-form__campo' }, [
          linea('30%'),
          Esqueleto({ variante: 'card', alto: '40px' }),
        ]))),
      crearEl('div', { class: 'sk-form__campo sk-form__campo--full' }, [
        linea('20%'),
        Esqueleto({ variante: 'card', alto: '7rem' }),
      ]),
      crearEl('div', { class: 'sk-form__acciones' }, [
        boton('7rem'), boton('5rem'),
      ]),
    ]),
  ]),

  /** Chart: header + card con gráfico grande + leyenda. */
  chart: () => crearEl('div', { class: 'sk-page sk-page--chart' }, [
    Encabezado({ acciones: 2 }),
    crearEl('div', { class: 'sk-card' }, [
      crearEl('div', { class: 'sk-card__head' }, [
        crearEl('div', null, [
          Esqueleto({ variante: 'subtitle', ancho: '14rem' }),
          linea('20rem'),
        ]),
        crearEl('div', { class: 'sk-chart__leyenda' },
          Array.from({ length: 4 }, () => pill('4rem'))),
      ]),
      Esqueleto({ variante: 'card', alto: '24rem' }),
    ]),
  ]),

  /** Auth: card centrada con logo + 2 inputs + botón. */
  auth: () => crearEl('div', { class: 'sk-page sk-page--auth' }, [
    crearEl('div', { class: 'sk-card sk-auth__card' }, [
      crearEl('div', { class: 'sk-auth__marca' }, [circ('48px')]),
      Esqueleto({ variante: 'title', ancho: '60%' }),
      linea('80%'),
      crearEl('div', { class: 'sk-auth__campos' }, [
        Esqueleto({ variante: 'card', alto: '40px' }),
        Esqueleto({ variante: 'card', alto: '40px' }),
      ]),
      Esqueleto({ variante: 'button', ancho: '100%', alto: '42px' }),
      crearEl('div', { class: 'sk-auth__pie' }, [linea('70%')]),
    ]),
  ]),

  /** Chat: sidebar de conversaciones + área principal con burbujas. */
  chat: () => crearEl('div', { class: 'sk-page sk-page--chat' }, [
    crearEl('aside', { class: 'sk-chat__lista' }, [
      crearEl('div', { class: 'sk-chat__buscador' },
        [Esqueleto({ variante: 'card', alto: '36px' })]),
      ...Array.from({ length: 8 }, () => crearEl('div', { class: 'sk-chat__contacto' }, [
        circ('40px'),
        crearEl('div', { class: 'sk-chat__contacto-textos' }, [
          linea('60%'),
          linea('80%'),
        ]),
      ])),
    ]),
    crearEl('section', { class: 'sk-chat__hilo' }, [
      crearEl('header', { class: 'sk-chat__cabecera' }, [
        circ('36px'),
        crearEl('div', null, [linea('8rem'), linea('5rem')]),
      ]),
      crearEl('div', { class: 'sk-chat__mensajes' }, [
        crearEl('div', { class: 'sk-burbuja sk-burbuja--in' },
          [Esqueleto({ variante: 'card', alto: '3rem' })]),
        crearEl('div', { class: 'sk-burbuja sk-burbuja--out' },
          [Esqueleto({ variante: 'card', alto: '2.5rem' })]),
        crearEl('div', { class: 'sk-burbuja sk-burbuja--in' },
          [Esqueleto({ variante: 'card', alto: '4rem' })]),
        crearEl('div', { class: 'sk-burbuja sk-burbuja--out' },
          [Esqueleto({ variante: 'card', alto: '2rem' })]),
      ]),
      crearEl('div', { class: 'sk-chat__redactor' },
        [Esqueleto({ variante: 'card', alto: '48px' })]),
    ]),
  ]),

  /** Kanban: 4 columnas con N tarjetas. */
  kanban: ({ columnas = 4, tarjetas = 4 } = {}) => crearEl('div', { class: 'sk-page sk-page--kanban' }, [
    Encabezado({ acciones: 2, ancho: '20%' }),
    crearEl('div', { class: 'sk-kanban__columnas' },
      Array.from({ length: columnas }, () => crearEl('div', { class: 'sk-kanban__columna' }, [
        crearEl('div', { class: 'sk-kanban__columna-cabecera' }, [
          Esqueleto({ variante: 'subtitle', ancho: '60%' }),
          pill('2rem'),
        ]),
        ...Array.from({ length: tarjetas }, () => crearEl('div', { class: 'sk-card sk-kanban__tarjeta' }, [
          linea('80%'),
          Esqueleto({ variante: 'card', alto: '4rem' }),
          crearEl('div', { class: 'sk-kanban__tarjeta-pie' }, [
            circ('24px'),
            pill('3rem'),
          ]),
        ])),
      ]))),
  ]),

  /** Iconos: header + grilla densa de mini-cuadros. */
  iconos: ({ total = 60 } = {}) => crearEl('div', { class: 'sk-page sk-page--iconos' }, [
    Encabezado({ acciones: 1 }),
    crearEl('div', { class: 'sk-card' }, [
      crearEl('div', { class: 'sk-iconos__buscador' },
        [Esqueleto({ variante: 'card', alto: '40px', ancho: '20rem' })]),
      crearEl('div', { class: 'sk-iconos__grid' },
        Array.from({ length: total }, () => crearEl('div', { class: 'sk-iconos__celda' }, [
          Esqueleto({ variante: 'square', ancho: '32px', alto: '32px' }),
          linea('70%'),
        ]))),
    ]),
  ]),

  /** Componentes / módulos showcase: grilla de tarjetas medianas. */
  componentes: ({ tarjetas = 6 } = {}) => crearEl('div', { class: 'sk-page sk-page--componentes' }, [
    Encabezado({ acciones: 1 }),
    crearEl('div', { class: 'sk-grid sk-grid--cards' },
      Array.from({ length: tarjetas }, () => crearEl('div', { class: 'sk-card' }, [
        Esqueleto({ variante: 'subtitle', ancho: '40%' }),
        linea('80%'),
        Esqueleto({ variante: 'card', alto: '10rem' }),
        crearEl('div', { class: 'sk-card__pie' }, [boton('5rem'), pill('4rem')]),
      ]))),
  ]),

  /** Error: bloque centrado simple. */
  error: () => crearEl('div', { class: 'sk-page sk-page--error' }, [
    crearEl('div', { class: 'sk-error__caja' }, [
      Esqueleto({ variante: 'square', ancho: '120px', alto: '120px' }),
      Esqueleto({ variante: 'title', ancho: '50%' }),
      linea('70%'),
      linea('60%'),
      boton('8rem'),
    ]),
  ]),

  /** Texto: fallback genérico (header + párrafos). */
  texto: () => crearEl('div', { class: 'sk-page sk-page--texto' }, [
    Encabezado({ acciones: 0 }),
    crearEl('div', { class: 'sk-card' }, [
      Esqueleto({ lineas: 6 }),
      Esqueleto({ variante: 'card', alto: '12rem' }),
      Esqueleto({ lineas: 4 }),
    ]),
  ]),
};

/* ─────────────────────────────────────────────────────────────────────────
   Resolver — primer patrón que empareje gana. Orden = prioridad.
   ───────────────────────────────────────────────────────────────────────── */

const PATRONES = [
  // Auth (todas las variantes: planas, simple/card/split, asistente, bloqueo)
  [/^\/auth\b|^\/ingresar$|^\/registrar$|^\/recuperar|^\/restablecer|^\/confirmar-correo$|^\/bloqueo$|^\/asistente-registro$/, 'auth'],

  // Apps
  [/^\/app\/chat\b/,    'chat'],
  [/^\/app\/kanban\b/,  'kanban'],

  // Módulos showcase
  [/^\/modulos\/tablas\b/,                                   'tabla'],
  [/^\/modulos\/forms\b/,                                    'formulario'],
  [/^\/modulos\/charts\b|^\/modulos\/graficos\b|^\/modulos\/mapas\b/, 'chart'],
  [/^\/modulos\/iconos\b/,                                   'iconos'],
  [/^\/modulos\/componentes\b|^\/modulos\/utilidades\b|^\/modulos\/formularios\b|^\/modulos\/?$/, 'componentes'],

  // Settings / usuario / configuración / reportes (formularios extensos)
  [/^\/usuario\/|^\/configuracion\/|^\/reportes\b/,          'formulario'],

  // Errores
  [/^\/(401|403|404|500|503)$|^\/mantenimiento$|^\/offline$/, 'error'],

  // Dashboards (raíz, /panel, /panel/*)
  [/^\/$|^\/panel(\/|$)|^\/dashboard(\/|$)/,                 'dashboard'],
];

/** Resuelve el nombre de la plantilla a partir de la ruta lógica. */
export const resolverPlantilla = (ruta = '/') => {
  for (const [patron, nombre] of PATRONES) {
    if (patron.test(ruta)) return nombre;
  }
  return 'texto';
};

/* ─────────────────────────────────────────────────────────────────────────
   API pública.
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Devuelve el nodo DOM del esqueleto de página apropiado.
 *
 * @param {string} ruta            Ruta lógica (ej. '/panel/crm')
 * @param {string|object} override Nombre de plantilla (string) u opciones
 *                                 ({ plantilla, ...opts }) para sobrescribir.
 */
export const EsqueletoPagina = (ruta = '/', override = null) => {
  let plantilla, opts = {};

  if (typeof override === 'string') {
    plantilla = override;
  } else if (override && typeof override === 'object') {
    plantilla = override.plantilla || override.template;
    opts = override;
  }

  if (!plantilla || !PLANTILLAS[plantilla]) {
    plantilla = resolverPlantilla(ruta);
  }

  const nodo = PLANTILLAS[plantilla](opts);
  nodo.setAttribute('aria-busy', 'true');
  nodo.setAttribute('aria-live', 'polite');
  nodo.setAttribute('data-esqueleto', plantilla);
  return nodo;
};

/** Lista de plantillas disponibles (para uso programático). */
export const plantillasDisponibles = () => Object.keys(PLANTILLAS);
