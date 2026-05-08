/**
 * Video — embebido de iframe (YouTube/Vimeo/Loom/Wistia/etc.) y reproductor
 * personalizado sobre `<video>` nativo.
 *
 * Exports:
 *   EmbedVideo({ src, proveedor?, ratio?, titulo?, poster?, lazy?, autoplay?, mute? })
 *   ReproductorVideo({ src, poster?, ratio?, captions?, capitulos?, titulo?, autor?, sobreposicion? })
 *   GaleriaVideos({ items, columnas? })
 *   TarjetaVideo({ poster, titulo, autor?, duracion?, vistas?, badge?, alClick? })
 *
 * Proveedores soportados (autodetectados por URL):
 *   youtube · vimeo · loom · wistia · dailymotion · streamable · twitch · tiktok
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { Icono } from '../icon/icons.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';

// ============================================================================
//  Detectores de proveedores → URL embed canónica
// ============================================================================
const detectarProveedor = (url) => {
  if (/youtube\.com|youtu\.be/.test(url))  return 'youtube';
  if (/vimeo\.com/.test(url))              return 'vimeo';
  if (/loom\.com/.test(url))               return 'loom';
  if (/wistia\.com|wistia\.net/.test(url)) return 'wistia';
  if (/dailymotion\.com|dai\.ly/.test(url))return 'dailymotion';
  if (/streamable\.com/.test(url))         return 'streamable';
  if (/twitch\.tv/.test(url))              return 'twitch';
  if (/tiktok\.com/.test(url))             return 'tiktok';
  return 'desconocido';
};

const aEmbed = (url, proveedor, opts = {}) => {
  const { autoplay = false, mute = false } = opts;
  switch (proveedor) {
    case 'youtube': {
      const m = url.match(/(?:v=|\/embed\/|youtu\.be\/|\/shorts\/)([\w-]{11})/);
      const id = m?.[1];
      if (!id) return url;
      const params = new URLSearchParams({
        rel: '0', modestbranding: '1', playsinline: '1',
        ...(autoplay ? { autoplay: '1' } : {}),
        ...(mute ? { mute: '1' } : {}),
      });
      return `https://www.youtube.com/embed/${id}?${params}`;
    }
    case 'vimeo': {
      const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
      const id = m?.[1];
      if (!id) return url;
      const params = new URLSearchParams({
        title: '0', byline: '0', portrait: '0',
        ...(autoplay ? { autoplay: '1' } : {}),
        ...(mute ? { muted: '1' } : {}),
      });
      return `https://player.vimeo.com/video/${id}?${params}`;
    }
    case 'loom': {
      const m = url.match(/loom\.com\/(?:share|embed)\/([\w]+)/);
      const id = m?.[1];
      return id ? `https://www.loom.com/embed/${id}` : url;
    }
    case 'streamable': {
      const m = url.match(/streamable\.com\/([\w-]+)/);
      const id = m?.[1];
      return id ? `https://streamable.com/e/${id}` : url;
    }
    default:
      return url;
  }
};

const formatTiempo = (s) => {
  if (!isFinite(s) || s < 0) s = 0;
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    : `${m}:${String(sec).padStart(2, '0')}`;
};

// ============================================================================
//  EmbedVideo — wrapper de iframe con aspect-ratio + poster click-to-play
// ============================================================================
export const EmbedVideo = ({
  src,
  proveedor,
  ratio = '16/9',
  titulo = 'Video',
  poster,
  lazy = false,
  autoplay = false,
  mute = false,
} = {}) => {
  const prov = proveedor || detectarProveedor(src);
  const embedSrc = aEmbed(src, prov, { autoplay, mute });

  const wrapper = crearEl('div', {
    class: ['video-embed', `video-embed--${prov}`],
    style: { aspectRatio: ratio },
    'data-proveedor': prov,
  });

  // Modo lazy con poster click-to-play
  if (lazy && poster) {
    const overlay = crearEl('button', {
      type: 'button',
      class: 'video-embed__poster',
      style: { backgroundImage: `url(${poster})` },
      'data-prov': prov,
      'aria-label': `Reproducir ${titulo}`,
      onClick: () => {
        const iframe = crearEl('iframe', {
          src: aEmbed(src, prov, { autoplay: true, mute }),
          title: titulo,
          allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
          allowfullscreen: 'true',
          loading: 'lazy',
          class: 'video-embed__iframe',
        });
        wrapper.replaceChildren(iframe);
      },
    }, [
      crearEl('span', { class: 'video-embed__poster-velo' }),
      crearEl('span', { class: ['video-embed__play', `video-embed__play--${prov}`] }, [
        Icono('reproducir', { tamano: 28 }),
      ]),
      crearEl('span', { class: 'video-embed__poster-titulo' }, [titulo]),
    ]);
    wrapper.appendChild(overlay);
  } else {
    wrapper.appendChild(crearEl('iframe', {
      src: embedSrc,
      title: titulo,
      allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
      allowfullscreen: 'true',
      loading: lazy ? 'lazy' : 'eager',
      class: 'video-embed__iframe',
    }));
  }

  return wrapper;
};

// ============================================================================
//  ReproductorVideo — controles custom sobre <video>
// ============================================================================
export const ReproductorVideo = ({
  src,
  tipo = 'video/mp4',
  poster,
  ratio = '16/9',
  titulo,
  autor,
  capitulos = [],
  velocidades = [0.5, 0.75, 1, 1.25, 1.5, 2],
  loop = false,
  autoplay = false,
  mute = false,
  controles = true,
} = {}) => {
  const reproduciendo = senal(false);
  const tiempo  = senal(0);
  const total   = senal(0);
  const buffer  = senal(0);
  const volumen = senal(mute ? 0 : 1);
  const muteado = senal(mute);
  const velocidad = senal(1);
  const fullscreen = senal(false);
  const menuVel = senal(false);
  const cargando = senal(true);

  const video = crearEl('video', {
    class: 'video-player__media',
    poster,
    preload: 'metadata',
    playsinline: 'true',
    loop: loop || undefined,
    autoplay: autoplay || undefined,
    muted: mute || undefined,
    onLoadedMetadata: (e) => { total.value = e.currentTarget.duration; cargando.value = false; },
    onTimeUpdate: (e) => { tiempo.value = e.currentTarget.currentTime; },
    onProgress: (e) => {
      const v = e.currentTarget;
      if (v.buffered.length > 0) buffer.value = v.buffered.end(v.buffered.length - 1);
    },
    onPlay: () => { reproduciendo.value = true; },
    onPause: () => { reproduciendo.value = false; },
    onWaiting: () => { cargando.value = true; },
    onPlaying: () => { cargando.value = false; },
    onVolumeChange: (e) => {
      volumen.value = e.currentTarget.volume;
      muteado.value = e.currentTarget.muted;
    },
    onClick: () => togglePlay(),
  }, [
    crearEl('source', { src, type: tipo }),
    'Tu navegador no soporta video HTML5.',
  ]);

  const togglePlay = () => video.paused ? video.play() : video.pause();
  const toggleMute = () => { video.muted = !video.muted; };
  const setVol = (v) => { video.muted = v === 0; video.volume = v; };
  const setVel = (v) => { video.playbackRate = v; velocidad.value = v; menuVel.value = false; };
  const seek = (s) => { video.currentTime = s; };
  const seekRelativo = (delta) => { video.currentTime = Math.max(0, Math.min(video.duration || 0, video.currentTime + delta)); };

  // ===== Construcción de controles =====
  const btnPlay = crearEl('button', {
    type: 'button', class: 'video-player__btn video-player__btn--principal',
    'aria-label': 'Reproducir / Pausar',
    onClick: togglePlay,
  }, [Icono('reproducir', { tamano: 18 })]);
  efecto(() => {
    btnPlay.replaceChildren(Icono(reproduciendo.value ? 'pausa' : 'reproducir', { tamano: 18 }));
  });

  const btnRetro = crearEl('button', {
    type: 'button', class: 'video-player__btn',
    'aria-label': 'Retroceder 10 segundos', title: 'Retroceder 10s',
    onClick: () => seekRelativo(-10),
  }, [Icono('retroceder_10', { tamano: 18 })]);

  const btnAvanzar = crearEl('button', {
    type: 'button', class: 'video-player__btn',
    'aria-label': 'Avanzar 10 segundos', title: 'Avanzar 10s',
    onClick: () => seekRelativo(10),
  }, [Icono('avanzar_10', { tamano: 18 })]);

  // ===== Barra de progreso =====
  const progresoRelleno = crearEl('div', { class: 'video-player__seek-fill' });
  const progresoBuffer  = crearEl('div', { class: 'video-player__seek-buffer' });
  const progresoBolita  = crearEl('div', { class: 'video-player__seek-thumb' });

  // Capítulos como markers en la barra
  const marcadoresCap = crearEl('div', { class: 'video-player__seek-caps' });
  if (capitulos.length > 0) {
    efecto(() => {
      const dur = total.value || 1;
      marcadoresCap.replaceChildren(
        ...capitulos.map((c) => crearEl('span', {
          class: 'video-player__cap-tick',
          style: { insetInlineStart: `${(c.t / dur) * 100}%` },
          title: c.label,
        })),
      );
    });
  }

  const seekTooltip = crearEl('div', { class: 'video-player__seek-tip' }, ['0:00']);

  const seekTrack = crearEl('div', { class: 'video-player__seek-track' }, [
    progresoBuffer, progresoRelleno, marcadoresCap, progresoBolita, seekTooltip,
  ]);

  const seekContenedor = crearEl('div', {
    class: 'video-player__seek',
    onClick: (e) => {
      const rect = seekTrack.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      seek(ratio * (total.value || 0));
    },
    onMouseMove: (e) => {
      const rect = seekTrack.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const ratio = x / rect.width;
      const t = ratio * (total.value || 0);
      seekTooltip.style.insetInlineStart = `${(ratio * 100).toFixed(2)}%`;
      seekTooltip.textContent = formatTiempo(t);
      seekTooltip.dataset.visible = 'true';
    },
    onMouseLeave: () => { seekTooltip.dataset.visible = 'false'; },
  }, [seekTrack]);

  efecto(() => {
    const dur = total.value || 1;
    progresoRelleno.style.transform = `scaleX(${tiempo.value / dur})`;
    progresoBuffer.style.transform  = `scaleX(${buffer.value / dur})`;
    progresoBolita.style.insetInlineStart = `${(tiempo.value / dur) * 100}%`;
  });

  // ===== Tiempos =====
  const lblTiempo = crearEl('span', { class: 'video-player__tiempo' }, ['0:00 / 0:00']);
  efecto(() => {
    lblTiempo.textContent = `${formatTiempo(tiempo.value)} / ${formatTiempo(total.value)}`;
  });

  // ===== Volumen =====
  const inputVol = crearEl('input', {
    type: 'range', min: 0, max: 1, step: 0.01, value: 1,
    class: 'video-player__vol-slider',
    'aria-label': 'Volumen',
    onInput: (e) => setVol(parseFloat(e.currentTarget.value)),
  });
  efecto(() => {
    inputVol.value = muteado.value ? 0 : volumen.value;
    const pct = (muteado.value ? 0 : volumen.value) * 100;
    inputVol.style.background = `linear-gradient(90deg, #fff ${pct}%, rgba(255,255,255,0.25) ${pct}%)`;
  });

  const btnVol = crearEl('button', {
    type: 'button', class: 'video-player__btn',
    'aria-label': 'Silenciar / activar audio',
    onClick: toggleMute,
  }, [Icono('volumen', { tamano: 18 })]);
  efecto(() => {
    const ic = muteado.value || volumen.value === 0
      ? 'volumen_mute'
      : volumen.value < 0.5 ? 'volumen_bajo' : 'volumen';
    btnVol.replaceChildren(Icono(ic, { tamano: 18 }));
  });

  const grupoVolumen = crearEl('div', { class: 'video-player__vol' }, [btnVol, inputVol]);

  // ===== Velocidad menu =====
  const btnVel = crearEl('button', {
    type: 'button', class: 'video-player__btn video-player__btn--text',
    'aria-label': 'Velocidad de reproducción',
    onClick: (e) => { e.stopPropagation(); menuVel.value = !menuVel.value; },
  }, ['1×']);
  efecto(() => {
    btnVel.textContent = `${velocidad.value}×`;
  });

  const menuVelocidades = crearEl('div', { class: 'video-player__menu' },
    velocidades.map((v) => {
      const item = crearEl('button', {
        type: 'button', class: 'video-player__menu-item',
        onClick: (e) => { e.stopPropagation(); setVel(v); },
      }, [`${v}×`, crearEl('span', { class: 'video-player__menu-check' }, [Icono('check', { tamano: 14 })])]);
      efecto(() => { item.dataset.activo = String(velocidad.value === v); });
      return item;
    }),
  );
  efecto(() => { menuVelocidades.dataset.abierto = String(menuVel.value); });

  const grupoVel = crearEl('div', { class: 'video-player__menu-wrap' }, [btnVel, menuVelocidades]);

  // ===== Fullscreen =====
  const btnFs = crearEl('button', {
    type: 'button', class: 'video-player__btn',
    'aria-label': 'Pantalla completa',
    onClick: () => {
      if (!document.fullscreenElement) host.requestFullscreen?.();
      else document.exitFullscreen?.();
    },
  }, [Icono('pantalla_completa', { tamano: 18 })]);

  const btnPip = crearEl('button', {
    type: 'button', class: 'video-player__btn',
    'aria-label': 'Picture in picture', title: 'Picture in picture',
    onClick: () => {
      if (document.pictureInPictureElement) document.exitPictureInPicture?.();
      else video.requestPictureInPicture?.();
    },
  }, [Icono('pip', { tamano: 18 })]);

  // ===== Spinner de carga sobre el video =====
  const spinnerCarga = crearEl('div', { class: 'video-player__cargando' }, [
    crearEl('span', { class: 'video-player__cargando-aro' }),
  ]);
  efecto(() => { spinnerCarga.dataset.visible = String(cargando.value && reproduciendo.value); });

  // ===== Botón play central (cuando está pausado) =====
  const playCentral = crearEl('button', {
    type: 'button',
    class: 'video-player__play-central',
    'aria-label': 'Reproducir',
    onClick: togglePlay,
  }, [Icono('reproducir', { tamano: 32 })]);
  efecto(() => { playCentral.dataset.visible = String(!reproduciendo.value); });

  // ===== Header opcional =====
  const cabezal = (titulo || autor)
    ? crearEl('div', { class: 'video-player__cabezal' }, [
        titulo && crearEl('div', { class: 'video-player__titulo' }, [titulo]),
        autor && crearEl('div', { class: 'video-player__autor' }, [autor]),
      ])
    : null;

  // ===== Ensamblado de la barra de controles =====
  const barra = controles ? crearEl('div', { class: 'video-player__controles' }, [
    crearEl('div', { class: 'video-player__fila-progreso' }, [
      seekContenedor,
      lblTiempo,
    ]),
    crearEl('div', { class: 'video-player__fila-botones' }, [
      crearEl('div', { class: 'video-player__grupo-izq' }, [btnRetro, btnPlay, btnAvanzar, grupoVolumen]),
      crearEl('div', { class: 'video-player__grupo-der' }, [grupoVel, btnPip, btnFs]),
    ]),
  ]) : null;

  const host = crearEl('div', {
    class: 'video-player',
    style: { aspectRatio: ratio },
    onFullscreenChange: () => { fullscreen.value = !!document.fullscreenElement; },
  }, [video, cabezal, spinnerCarga, playCentral, barra]);

  efecto(() => { host.dataset.reproduciendo = String(reproduciendo.value); });
  document.addEventListener('fullscreenchange', () => { fullscreen.value = !!document.fullscreenElement; });
  efecto(() => { host.dataset.fullscreen = String(fullscreen.value); });

  // Cerrar menú velocidad al hacer click fuera
  document.addEventListener('click', (e) => {
    if (!host.contains(e.target)) menuVel.value = false;
  });

  return host;
};

// ============================================================================
//  TarjetaVideo — Card estilo YouTube/Vimeo (poster + meta)
// ============================================================================
export const TarjetaVideo = ({
  poster, titulo, autor, duracion, vistas, badge, alClick,
} = {}) => {
  return crearEl('article', {
    class: 'video-card',
    onClick: alClick,
    role: alClick ? 'button' : undefined,
    tabindex: alClick ? '0' : undefined,
  }, [
    crearEl('div', { class: 'video-card__media', style: { backgroundImage: `url(${poster})` } }, [
      badge && crearEl('span', { class: ['video-card__badge', `video-card__badge--${badge.tipo || 'default'}`] }, [badge.texto]),
      duracion && crearEl('span', { class: 'video-card__duracion' }, [duracion]),
      crearEl('span', { class: 'video-card__hover-play' }, [Icono('reproducir', { tamano: 22 })]),
    ]),
    crearEl('div', { class: 'video-card__cuerpo' }, [
      crearEl('h3', { class: 'video-card__titulo' }, [titulo]),
      (autor || vistas) && crearEl('div', { class: 'video-card__meta' }, [
        autor,
        autor && vistas && ' · ',
        vistas,
      ]),
    ]),
  ]);
};

// ============================================================================
//  GaleriaVideos — grid responsive de TarjetaVideo
// ============================================================================
export const GaleriaVideos = ({ items = [], columnas = 3 } = {}) => {
  return crearEl('div', {
    class: 'video-galeria',
    style: { '--video-galeria-cols': columnas },
  }, items.map((it) => TarjetaVideo(it)));
};
