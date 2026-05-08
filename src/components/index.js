/* Barrel de componentes — importa una vez, úsalos en cualquier sitio. */
export { Boton } from './ui/button/button.js';
export { Campo, AreaTexto } from './ui/input/input.js';
export { Selector } from './ui/select/select.js';
export { Insignia } from './ui/badge/badge.js';
export { Avatar } from './ui/avatar/avatar.js';
export { Cargador } from './ui/spinner/spinner.js';
export { Esqueleto } from './ui/skeleton/skeleton.js';
export { Modal } from './ui/modal/modal.js';
export { MenuDesplegable } from './ui/dropdown/dropdown.js';
export { Tabla } from './ui/table/table.js';
export { Paginacion } from './ui/pagination/pagination.js';
export { Tooltip } from './ui/tooltip/tooltip.js';
export { EstadoVacio } from './ui/empty-state/empty-state.js';
export { Tarjeta } from './ui/card/card.js';
export { notificar, iniciarNotificaciones } from './ui/toast/toast.js';

// Gráficos nativos (SVG)
export { GraficoLineas, GraficoBarras, GraficoDonut, GraficoSparkline, GraficoArea, GraficoProgreso } from './ui/chart/chart.js';

// KPI / metric cards
export { TarjetaKpi } from './ui/kpi-card/kpi-card.js';

// Formularios
export { CampoFormulario } from './forms/form-field/form-field.js';
export { EtiquetaFormulario } from './forms/form-label/form-label.js';
export { ErrorFormulario } from './forms/form-error/form-error.js';

// Comunes
export { LimiteError, instalarManejadoresErrores } from './common/error-boundary/error-boundary.js';
export { CargadorPerezoso } from './common/lazy-loader/lazy-loader.js';
export { TituloPagina } from './common/page-title/page-title.js';
export { RutaProtegida } from './common/protected-route/protected-route.js';
