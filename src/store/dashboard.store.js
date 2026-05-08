/**
 * Store reactivo compartido por TODOS los dashboards.
 *
 * Idea: el filtro de rango temporal vive una sola vez aquí — cualquier widget,
 * KPI o gráfica que dependa del rango se suscribe (vía `efecto`/`calculado`)
 * y se actualiza solo cuando el usuario cambia la selección. Así los 8
 * dashboards comparten estado sin acoplarse entre sí.
 */
import { senal, calculado } from '../utils/helpers/reactive.js';
import { almacenamientoLocal } from '../utils/helpers/storage.js';

const CLAVE_RANGO = 'launchpad.dashboard.rango';

/** Rangos disponibles — clave usada para mostrar / filtrar / persistir. */
export const RANGOS = Object.freeze({
  HOY:        { id: 'hoy',     etiqueta: 'Hoy',          dias: 1 },
  SEMANA:     { id: 'semana',  etiqueta: 'Esta semana',  dias: 7 },
  MES:        { id: 'mes',     etiqueta: 'Este mes',     dias: 30 },
  TRIMESTRE:  { id: 'trim',    etiqueta: 'Trimestre',    dias: 90 },
  ANIO:       { id: 'anio',    etiqueta: 'Año',          dias: 365 },
});

const rangoIdInicial = almacenamientoLocal.obtener(CLAVE_RANGO, 'mes');
const rangoInicial = Object.values(RANGOS).find(r => r.id === rangoIdInicial) || RANGOS.MES;

const rango = senal(rangoInicial);

// Persistir cambios.
rango.subscribe((r) => almacenamientoLocal.guardar(CLAVE_RANGO, r.id));

/** Etiqueta humana derivada del rango actual — útil para subtítulos. */
const etiquetaRango = calculado(() => `Últimos ${rango.value.dias} días`);

/** Rango anterior (para comparativas %): mismo número de días, justo antes. */
const ventana = calculado(() => {
  const ahora = Date.now();
  const ms = rango.value.dias * 24 * 60 * 60 * 1000;
  return {
    actual:   { desde: ahora - ms,         hasta: ahora },
    anterior: { desde: ahora - 2 * ms,     hasta: ahora - ms },
  };
});

export const estadoDashboard = {
  rango,
  etiquetaRango,
  ventana,
  /** Actualiza el rango por id (`'hoy' | 'semana' | 'mes' | 'trim' | 'anio'`). */
  cambiarRango(id) {
    const nuevo = Object.values(RANGOS).find(r => r.id === id);
    if (nuevo) rango.value = nuevo;
  },
};
