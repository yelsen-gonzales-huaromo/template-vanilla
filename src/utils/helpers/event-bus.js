/**
 * Bus de eventos pub/sub ligero — desacopla módulos transversales
 * (enrutador → diseños, servicios → notificaciones, store → analítica).
 * Reemplaza los manejadores jQuery globales del template Falcon antiguo.
 */
const canales = new Map();

export const busEventos = {
  on(evento, manejador) {
    if (!canales.has(evento)) canales.set(evento, new Set());
    canales.get(evento).add(manejador);
    return () => busEventos.off(evento, manejador);
  },

  unaVez(evento, manejador) {
    const desuscribir = busEventos.on(evento, (...args) => {
      desuscribir();
      manejador(...args);
    });
    return desuscribir;
  },

  off(evento, manejador) {
    const conjunto = canales.get(evento);
    if (!conjunto) return;
    conjunto.delete(manejador);
    if (conjunto.size === 0) canales.delete(evento);
  },

  emitir(evento, datos) {
    const conjunto = canales.get(evento);
    if (!conjunto) return;
    for (const manejador of conjunto) {
      try { manejador(datos); }
      catch (err) { console.error(`[bus-eventos] manejador de "${evento}" lanzó error`, err); }
    }
  },

  limpiar() { canales.clear(); },
};

/** Catálogo de eventos transversales de la aplicación. */
export const EVENTOS_APP = Object.freeze({
  RUTA_CAMBIADA:    'app:ruta-cambiada',
  AUTH_INICIO:      'auth:inicio',
  AUTH_CIERRE:      'auth:cierre',
  AUTH_EXPIRADA:    'auth:expirada',
  TEMA_CAMBIADO:    'ui:tema-cambiado',
  BARRA_TOGGLE:     'ui:barra-toggle',
  AVISO_PUSH:       'ui:aviso-push',
  ERROR_CAPTURADO:  'error:capturado',
  HTTP_PETICION:    'http:peticion',
  HTTP_RESPUESTA:   'http:respuesta',
  HTTP_ERROR:       'http:error',
});
