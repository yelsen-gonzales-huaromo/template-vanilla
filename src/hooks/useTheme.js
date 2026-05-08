import { estadoUi } from '../store/ui.store.js';

export const usarTema = () => ({
  tema: estadoUi.tema,
  direccion: estadoUi.direccion,
  establecerTema: estadoUi.establecerTema.bind(estadoUi),
  establecerDireccion: estadoUi.establecerDireccion.bind(estadoUi),
  alternar() {
    const siguiente = estadoUi.tema.peek() === 'dark' ? 'light' : 'dark';
    estadoUi.establecerTema(siguiente);
  },
});
