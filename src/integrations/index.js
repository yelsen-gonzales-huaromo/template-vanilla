/**
 * Punto único de importación para los adaptadores de librerías de terceros.
 * Importa SÓLO los que uses; cada uno hace lazy-load de su lib desde CDN
 * la primera vez que se invoca.
 *
 *   import { SelectorFecha, Mapa, DragDrop } from '../integrations/index.js';
 */

// ===== Esenciales =====
export { SelectorFecha,         cargarFlatpickr }   from './flatpickr/index.js';
export { Mapa,                  cargarLeaflet }     from './leaflet/index.js';
export { DragDrop,              cargarSortable }    from './sortable/index.js';
export { Contador, aplicarContadores, cargarCountUp } from './countup/index.js';
export { cargarDayjs }                              from './dayjs/index.js';
export { Carrusel,              cargarSwiper }      from './swiper/index.js';
export { activarLightbox, cerrarLightbox, cargarGLightbox } from './glightbox/index.js';
export { SelectorAvanzado,      cargarChoices }     from './choices/index.js';
export { RangoSlider,           cargarNoUiSlider }  from './nouislider/index.js';
export { aplicarMascara, aplicarMascarasGlobales, cargarInputmask } from './inputmask/index.js';

// ===== Gráficos avanzados =====
export { GraficoChartJs,        cargarChartJs }     from './chartjs/index.js';
export { GraficoECharts,        cargarECharts }     from './echarts/index.js';
export { cargarD3 }                                 from './d3/index.js';

// ===== Tablas y listas =====
export { TablaAvanzada,         cargarDataTables }  from './datatables/index.js';
export { ListaBuscable,         cargarListJs }      from './list-js/index.js';

// ===== Calendario completo =====
export { CalendarioCompleto,    cargarFullCalendar } from './fullcalendar/index.js';

// ===== Mapas (plugins) =====
export { cargarMarkerCluster, cargarTileColorFilter } from './leaflet-plugins/index.js';

// ===== Multimedia =====
export { Reproductor,           cargarPlyr }        from './plyr/index.js';
export { Animacion,             cargarLottie }      from './lottie/index.js';

// ===== Subida de archivos =====
export { ZonaSubida,            cargarDropzone }    from './dropzone/index.js';

// ===== Editor / código =====
export { EditorRico,            cargarTinyMCE }     from './tinymce/index.js';
export { ResaltarCodigo, aplicarResaltado, cargarPrism } from './prism/index.js';

// ===== Otros =====
export { SelectorEmoji,         cargarEmojiMart }   from './emoji-mart/index.js';
export { activarFontAwesome, Icono }                from './fontawesome/index.js';
export { Valoracion,            cargarRater }       from './rater/index.js';
export { aplicarScrollbar,      cargarSimpleBar }   from './simplebar/index.js';
export { TextoAnimado,          cargarTyped }       from './typed/index.js';
export { cargarValidator }                          from './validator/index.js';
export { anchorearTitulos,      cargarAnchorJs }    from './anchorjs/index.js';
