/**
 * Adaptador para Plyr — reproductor de audio/vídeo accesible.
 *  https://plyr.io/
 *
 *   const { contenedor, instancia } = await Reproductor({
 *     tipo: 'video',
 *     url: 'video.mp4',
 *     poster: 'poster.jpg',
 *   });
 */
import { cargarLib } from '../_loader.js';

const VERSION = '3.7.8';
const URL_CSS = `https://cdn.jsdelivr.net/npm/plyr@${VERSION}/dist/plyr.css`;
const URL_JS  = `https://cdn.jsdelivr.net/npm/plyr@${VERSION}/dist/plyr.min.js`;

export const cargarPlyr = () => cargarLib({
  css: URL_CSS,
  scripts: URL_JS,
  global: 'Plyr',
});

/**
 * @param {object} opts
 * @param {'video'|'audio'} opts.tipo
 * @param {string} opts.url
 * @param {string} [opts.poster]
 * @param {string} [opts.tipoMime]   — 'video/mp4', 'video/webm', etc.
 */
export const Reproductor = async ({ tipo = 'video', url, poster, tipoMime } = {}) => {
  const Plyr = await cargarPlyr();
  const wrapper = document.createElement('div');

  if (tipo === 'video') {
    wrapper.innerHTML = `
      <video playsinline controls ${poster ? `poster="${poster}"` : ''}>
        <source src="${url}" ${tipoMime ? `type="${tipoMime}"` : ''} />
      </video>
    `;
  } else {
    wrapper.innerHTML = `
      <audio controls>
        <source src="${url}" ${tipoMime ? `type="${tipoMime}"` : ''} />
      </audio>
    `;
  }

  const elemento = wrapper.firstElementChild;
  const instancia = new Plyr(elemento, {
    i18n: {
      restart: 'Reiniciar', rewind: 'Atrás', play: 'Reproducir',
      pause: 'Pausa', fastForward: 'Adelantar', seek: 'Buscar',
      played: 'Reproducido', currentTime: 'Tiempo actual', duration: 'Duración',
      volume: 'Volumen', mute: 'Silenciar', unmute: 'Activar audio',
      enableCaptions: 'Subtítulos', disableCaptions: 'Quitar subtítulos',
      enterFullscreen: 'Pantalla completa', exitFullscreen: 'Salir',
      settings: 'Ajustes', speed: 'Velocidad', normal: 'Normal',
      quality: 'Calidad', loop: 'Repetir',
    },
  });

  return { contenedor: wrapper, instancia };
};
