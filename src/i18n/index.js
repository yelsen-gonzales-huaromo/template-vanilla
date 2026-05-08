/**
 * i18n ligero — diccionarios JSON cargados con `fetch` (compatible vanilla).
 * Soporta dot-paths e interpolación `{var}`. Reactivo: `t()` se re-resuelve al cambiar idioma.
 */
import { senal, efecto } from '../utils/helpers/reactive.js';
import { estadoUi } from '../store/ui.store.js';
import { CONFIG_APP } from '../config/app.config.js';

const diccionarios = new Map();
const listo = senal(false);

// Resolución de URL relativa al script para que funcione bajo cualquier base.
const URL_BASE = new URL('.', import.meta.url);

const cargadores = {
  es: () => fetch(new URL('./es/common.json', URL_BASE)).then(r => r.json()),
  en: () => fetch(new URL('./en/common.json', URL_BASE)).then(r => r.json()),
};

const resolverClave = (dicc, clave) =>
  clave.split('.').reduce((acc, parte) => (acc && acc[parte] !== undefined ? acc[parte] : undefined), dicc);

const interpolar = (cadena, params = {}) =>
  String(cadena).replace(/\{(\w+)\}/g, (_, k) => params[k] ?? `{${k}}`);

export const iniciarI18n = async () => {
  await cargarIdioma(estadoUi.idioma.peek());
  efecto(() => { cargarIdioma(estadoUi.idioma.value); });
  listo.value = true;
};

export const cargarIdioma = async (locale) => {
  if (!CONFIG_APP.ui.idiomasSoportados.includes(locale)) return;
  if (diccionarios.has(locale)) return;
  try {
    const dicc = await cargadores[locale]();
    diccionarios.set(locale, dicc);
  } catch (err) {
    console.warn(`[i18n] no se pudo cargar el diccionario "${locale}"`, err);
  }
};

export const t = (clave, params) => {
  const locale = estadoUi.idioma.value;
  const dicc = diccionarios.get(locale) || diccionarios.get(CONFIG_APP.ui.idiomaPorDefecto) || {};
  const crudo = resolverClave(dicc, clave);
  if (crudo === undefined) return clave;
  return params ? interpolar(crudo, params) : crudo;
};

export const tx = (clave) => {
  if (!clave) return '';
  if (typeof clave === 'string') return t(clave);
  return t(clave.key, clave.params);
};

export { listo as i18nListo };
