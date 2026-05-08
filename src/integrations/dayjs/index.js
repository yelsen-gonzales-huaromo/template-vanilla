/**
 * Adaptador para Day.js — manipulación de fechas (alternativa ligera a moment).
 *  https://day.js.org/
 *
 *   const dayjs = await cargarDayjs();
 *   dayjs('2026-05-01').format('DD MMMM YYYY');   // → "01 mayo 2026"
 *   dayjs().add(7, 'day').toDate();
 *
 * Ya tenemos `formatearFecha` con Intl nativo. Day.js es útil cuando necesitas
 * aritmética de fechas compleja (`add`, `subtract`, `diff`, `isBetween`, etc.).
 */
import { cargarLib, cargarScript } from '../_loader.js';

const VERSION = '1.11.13';
const URL_JS         = `https://cdn.jsdelivr.net/npm/dayjs@${VERSION}/dayjs.min.js`;
const URL_LOCALE_ES  = `https://cdn.jsdelivr.net/npm/dayjs@${VERSION}/locale/es.js`;
const URL_RELATIVE   = `https://cdn.jsdelivr.net/npm/dayjs@${VERSION}/plugin/relativeTime.js`;
const URL_DURATION   = `https://cdn.jsdelivr.net/npm/dayjs@${VERSION}/plugin/duration.js`;

let listo = null;

/** Carga dayjs con plugins esenciales y locale español. */
export const cargarDayjs = async () => {
  if (listo) return listo;

  listo = (async () => {
    const dayjs = await cargarLib({ scripts: URL_JS, global: 'dayjs' });
    await cargarScript(URL_LOCALE_ES).catch(() => {});
    await cargarScript(URL_RELATIVE).catch(() => {});
    await cargarScript(URL_DURATION).catch(() => {});

    if (window.dayjs_plugin_relativeTime) dayjs.extend(window.dayjs_plugin_relativeTime);
    if (window.dayjs_plugin_duration)     dayjs.extend(window.dayjs_plugin_duration);
    dayjs.locale('es');

    return dayjs;
  })();

  return listo;
};
