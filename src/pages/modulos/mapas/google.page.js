/**
 * Google Maps — patrones profesionales sin API key.
 *
 * Estrategia:
 *   • Embed oficial vía iframe (`google.com/maps?...&output=embed`) — sin API key,
 *     sin SDK, soporta place/directions/streetview.
 *   • Static Maps fallback (URL signed) — se muestra como patrón conceptual.
 *   • Lazy-load con poster click-to-play como en EmbedVideo, ahorrando ~600KB
 *     del primer iframe.
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { Boton } from '../../../components/ui/button/button.js';
import { corner3 } from '../../../components/ui/card/card-decoraciones.js';

// ============================================================================
//  Builders de URLs Google Maps Embed
//
//  IMPORTANTE — sólo `place`, `search` y `satellite` se pueden poner en un
//  <iframe> sin API key (Google sirve `X-Frame-Options: sameorigin` para los
//  endpoints de direcciones y Street View). Para esos casos usamos el patrón
//  "place embed + abrir en Google Maps en otra pestaña".
// ============================================================================
const buildEmbed = (modo, query, opts = {}) => {
  const base = 'https://www.google.com/maps';
  const z = opts.zoom ?? 14;
  switch (modo) {
    case 'place':
      return `${base}?q=${encodeURIComponent(query)}&z=${z}&output=embed`;
    case 'search':
      return `${base}/search/${encodeURIComponent(query)}?output=embed`;
    case 'satellite':
      return `${base}?q=${encodeURIComponent(query)}&t=k&z=${z}&output=embed`;
    default:
      return `${base}?q=${encodeURIComponent(query)}&output=embed`;
  }
};

// URLs para abrir en una pestaña nueva (no se pueden iframear)
const buildOpenURL = (modo, query) => {
  const base = 'https://www.google.com/maps';
  switch (modo) {
    case 'directions': {
      const { de, hacia, modoTransporte = 'driving' } = query;
      return `${base}/dir/?api=1&origin=${encodeURIComponent(de)}&destination=${encodeURIComponent(hacia)}&travelmode=${modoTransporte}`;
    }
    case 'streetview': {
      const { lat, lng } = query;
      return `${base}/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;
    }
    default:
      return `${base}?q=${encodeURIComponent(query)}`;
  }
};

// ============================================================================
//  GoogleMap — preview reliable en cualquier navegador.
//
//  Por qué estático y no iframe:
//  Las URLs `output=embed` SIN API key se rompen cuando el navegador bloquea
//  cookies de google.com (Edge tracking prevention, Brave shields, Firefox
//  strict). Google redirige el iframe a google.com/ que sirve X-Frame-Options:
//  sameorigin → iframe vacío. Imposible de evitar sin Maps Embed API key.
//
//  Estrategia:
//  • Render por defecto = preview estático con look de Google Maps (poster del
//    sitio + chip de marca + pin centrado + CTA "abrir en Google Maps").
//  • Click → abre Google Maps real en pestaña nueva (deep-link, siempre fiable).
//  • Si pasas `apiKey`, usa la Embed API oficial vía iframe (`maps/embed/v1/`).
// ============================================================================
const GMAPS_KEY = (typeof window !== 'undefined' && window.GOOGLE_MAPS_KEY) || null;

const buildEmbedAPI = (modo, query, apiKey, opts = {}) => {
  const k = encodeURIComponent(apiKey);
  const z = opts.zoom ?? 14;
  switch (modo) {
    case 'place':
      return `https://www.google.com/maps/embed/v1/place?key=${k}&q=${encodeURIComponent(query)}&zoom=${z}`;
    case 'search':
      return `https://www.google.com/maps/embed/v1/search?key=${k}&q=${encodeURIComponent(query)}&zoom=${z}`;
    case 'satellite':
      return `https://www.google.com/maps/embed/v1/place?key=${k}&q=${encodeURIComponent(query)}&maptype=satellite&zoom=${z}`;
    default:
      return `https://www.google.com/maps/embed/v1/place?key=${k}&q=${encodeURIComponent(query)}`;
  }
};

const GoogleMap = ({
  src, ratio = '16/9', titulo = 'Ver en Google Maps', alto, poster,
  query, modo = 'place',
  apiKey = GMAPS_KEY,
  abrirEn,
}) => {
  // Si hay API key, intentamos el iframe oficial — siempre funciona
  if (apiKey && (query || src)) {
    const iframeSrc = query
      ? buildEmbedAPI(modo, query, apiKey)
      : src;
    return crearEl('div', {
      style: {
        position: 'relative', width: '100%',
        ...(alto ? { height: alto } : { aspectRatio: ratio }),
        borderRadius: 'var(--radius-md)', overflow: 'hidden',
        border: '1px solid var(--border)',
        background: 'var(--surface-muted)',
      },
    }, [crearEl('iframe', {
      src: iframeSrc, title: titulo,
      loading: 'lazy', allowfullscreen: 'true',
      referrerpolicy: 'no-referrer-when-downgrade',
      style: { width: '100%', height: '100%', border: '0' },
    })]);
  }

  // Sin API key → preview estático con deep-link a Google Maps
  const linkURL = abrirEn || src || (query ? `https://www.google.com/maps?q=${encodeURIComponent(query)}` : 'https://www.google.com/maps');

  // Fondo de mapa estilizado: poster del usuario o un patrón "mapa de papel"
  const fondo = poster
    ? `url(${poster}) center/cover, #1f1f23`
    : `
      radial-gradient(circle at 30% 30%, #c7e8c7 0%, transparent 40%),
      radial-gradient(circle at 80% 60%, #b6dceb 0%, transparent 50%),
      linear-gradient(180deg, #f3eedc 0%, #ebe2c4 100%)
    `;

  return crearEl('a', {
    href: linkURL,
    target: '_blank',
    rel: 'noopener',
    style: {
      position: 'relative', display: 'block', textDecoration: 'none',
      width: '100%',
      ...(alto ? { height: alto } : { aspectRatio: ratio }),
      borderRadius: 'var(--radius-md)', overflow: 'hidden',
      border: '1px solid var(--border)',
      background: fondo,
      backgroundSize: poster ? 'cover' : 'auto',
      boxShadow: '0 4px 16px -8px rgb(0 0 0 / 0.18)',
      color: '#fff',
      transition: 'transform 220ms ease, box-shadow 220ms ease',
    },
    onMouseEnter: (e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px -12px rgb(0 0 0 / 0.3)'; },
    onMouseLeave: (e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px -8px rgb(0 0 0 / 0.18)'; },
  }, [
    // Si no hay poster, un patrón sutil de "calles"
    !poster && crearEl('div', {
      style: {
        position: 'absolute', inset: 0,
        backgroundImage: `
          repeating-linear-gradient(35deg, transparent 0 80px, rgba(255,255,255,0.4) 80px 84px),
          repeating-linear-gradient(-45deg, transparent 0 120px, rgba(255,255,255,0.3) 120px 123px),
          repeating-linear-gradient(90deg, transparent 0 200px, rgba(180,160,90,0.3) 200px 202px)
        `,
        opacity: 0.6,
      },
    }),
    // Velo gradient para legibilidad del texto
    crearEl('div', {
      style: {
        position: 'absolute', inset: 0,
        background: poster
          ? 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.65) 100%)'
          : 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.45) 100%)',
      },
    }),
    // Pin central tipo Google Maps
    crearEl('div', {
      style: {
        position: 'absolute', insetInlineStart: '50%', insetBlockStart: '50%',
        transform: 'translate(-50%, -100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
        pointerEvents: 'none',
      },
    }, [
      crearEl('div', {
        style: {
          width: '44px', height: '44px',
          background: '#ea4335',
          borderRadius: '50% 50% 50% 0',
          transform: 'rotate(-45deg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 20px rgba(234,67,53,0.45), 0 0 0 4px rgba(234,67,53,0.18)',
        },
      }, [
        crearEl('div', {
          style: {
            width: '14px', height: '14px',
            background: '#fff',
            borderRadius: '50%',
            transform: 'rotate(45deg)',
          },
        }),
      ]),
      crearEl('div', {
        style: {
          width: '12px', height: '4px',
          background: 'rgba(0,0,0,0.25)',
          borderRadius: '50%',
          filter: 'blur(2px)',
          marginBlockStart: '4px',
        },
      }),
    ]),
    // Chip "Google Maps" en la esquina
    crearEl('div', {
      style: {
        position: 'absolute', insetBlockStart: '12px', insetInlineStart: '12px',
        padding: '5px 10px 5px 8px',
        background: '#fff', color: '#1f1f23',
        borderRadius: '6px',
        fontSize: '11px', fontWeight: 700, letterSpacing: '0.02em',
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      },
    }, [
      // Mini logo Google M
      crearEl('span', {
        style: {
          width: '14px', height: '14px',
          background: 'conic-gradient(from 0deg, #ea4335 0% 25%, #fbbc04 25% 50%, #34a853 50% 75%, #4285f4 75% 100%)',
          borderRadius: '50%',
        },
      }),
      'Google Maps',
    ]),
    // CTA en la base
    crearEl('div', {
      style: {
        position: 'absolute', insetInline: '12px', insetBlockEnd: '12px',
        padding: '8px 12px',
        background: 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderRadius: '8px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '10px',
        color: '#1f1f23',
        boxShadow: '0 4px 14px -4px rgba(0,0,0,0.2)',
      },
    }, [
      crearEl('div', { style: { minWidth: 0, flex: 1 } }, [
        crearEl('div', {
          style: { fontSize: '11px', color: '#5f6368', fontWeight: 600, letterSpacing: '0.02em' },
        }, ['UBICACIÓN']),
        crearEl('div', {
          style: { fontSize: '13px', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
        }, [titulo]),
      ]),
      crearEl('span', {
        style: {
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          padding: '6px 10px',
          background: '#1a73e8', color: '#fff',
          borderRadius: '6px',
          fontSize: '12px', fontWeight: 700,
          flexShrink: 0,
        },
      }, ['Ver en Maps ', Icono('flecha_r', { tamano: 12 })]),
    ]),
  ]);
};

// ============================================================================
//  Posters
// ============================================================================
const POSTER = {
  paris:    'https://picsum.photos/seed/gmap-paris/1280/720',
  ny:       'https://picsum.photos/seed/gmap-ny/1280/720',
  tokyo:    'https://picsum.photos/seed/gmap-tokyo/1280/720',
  ruta:     'https://picsum.photos/seed/gmap-ruta/1280/720',
  street:   'https://picsum.photos/seed/gmap-street/1280/720',
  satelite: 'https://picsum.photos/seed/gmap-satelite/1280/720',
  oficina:  'https://picsum.photos/seed/gmap-oficina/640/360',
};

// ============================================================================
//  Helpers
// ============================================================================
const cardWrap = (...nodos) => crearEl('div', {
  style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' },
}, nodos);

// ============================================================================
//  Página
// ============================================================================
export default async () => PaginaShowcase({
  titulo: 'Google Maps',
  descripcion: '⚠️ La URL pública `?output=embed` ya no es fiable: navegadores con prevención de rastreo (Edge, Brave, Firefox strict) bloquean cookies de google.com → el iframe redirige a google.com/ que sirve `X-Frame-Options: sameorigin` y queda vacío. Solución usada aquí: tarjetas-preview con look de Google Maps + deep-link a la app/web (siempre funcionan). Para iframes en vivo basta con `window.GOOGLE_MAPS_KEY = "TU_KEY"` antes de cargar la página → el componente usa la Maps Embed API oficial, que sí permite iframes y soporta place · search · directions · streetview · view.',
  decoracion: corner3(),
  migas: [
    { etiqueta: 'Módulos', href: '#/modulos' },
    { etiqueta: 'Mapas', href: '#/modulos/mapas' },
  ],
  hijos: [

    // ============== 1. PREVIEW BÁSICO ==============
    Seccion({
      titulo: '1 · Preview de un lugar',
      descripcion: 'Tarjeta con look de Google Maps + pin centrado + chip de marca + CTA. Click → abre Google Maps con la búsqueda. Sin iframes, sin tracking issues, funciona en cualquier navegador.',
      hijos: [VistaCodigo({
        vista: GoogleMap({
          query: 'Plaza Mayor, Madrid',
          titulo: 'Plaza Mayor, Madrid',
        }),
        codigo: `GoogleMap({
  query: 'Plaza Mayor, Madrid',                // se autocodifica
  titulo: 'Plaza Mayor, Madrid',
})

// Con API key activa el iframe oficial:
//   window.GOOGLE_MAPS_KEY = 'AIza...';`,
      })],
    }),

    // ============== 2. PREVIEW CON POSTER ==============
    Seccion({
      titulo: '2 · Preview con poster (foto del sitio)',
      descripcion: 'Si tienes una foto del lugar, pásala como `poster` y se usa como fondo en lugar del patrón "mapa de papel". Más realista para landings de hoteles, restaurantes, oficinas, monumentos.',
      hijos: [VistaCodigo({
        vista: GoogleMap({
          query: 'Tour Eiffel, Paris',
          poster: POSTER.paris,
          titulo: 'Tour Eiffel',
        }),
        codigo: `GoogleMap({
  query: 'Tour Eiffel, Paris',
  poster: '/img/eiffel.jpg',                   // ← foto del sitio
  titulo: 'Tour Eiffel',
})`,
      })],
    }),

    // ============== 3. DIRECCIONES (deep-link) ==============
    Seccion({
      titulo: '3 · Direcciones — origen → destino (abre en Google Maps)',
      descripcion: 'Google bloquea el embed de direcciones (`X-Frame-Options: sameorigin`). El patrón correcto sin API key: mostrar la información de la ruta + un mapa del destino + botón "Abrir en Google Maps" que abre la app/web con la ruta calculada nativa.',
      hijos: [VistaCodigo({
        vista: (() => {
          const modo = senal('driving');
          const de = 'Plaza Mayor, Madrid';
          const hacia = 'Estadio Santiago Bernabéu';
          const detalles = {
            driving:   { tiempo: '14 min', distancia: '6.2 km', alternativas: '3 rutas · M-30 más rápida' },
            walking:   { tiempo: '1 h 18 min', distancia: '6.0 km', alternativas: 'Por Castellana · ruta directa' },
            transit:   { tiempo: '32 min', distancia: '7.1 km', alternativas: 'Metro L2 + L10 · 1 transbordo' },
            bicycling: { tiempo: '24 min', distancia: '6.4 km', alternativas: 'Carril bici · Castellana' },
          };

          const segmento = crearEl('div', {
            style: {
              display: 'inline-flex', padding: '4px',
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', gap: '2px', flexWrap: 'wrap',
            },
          });
          [
            { v: 'driving',    icon: '🚗', t: 'Coche'  },
            { v: 'walking',    icon: '🚶', t: 'A pie'  },
            { v: 'transit',    icon: '🚌', t: 'Bus'    },
            { v: 'bicycling',  icon: '🚴', t: 'Bici'   },
          ].forEach(({ v, icon, t }) => {
            const b = crearEl('button', {
              style: {
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '6px 12px', border: 0, borderRadius: '6px',
                background: 'transparent', cursor: 'pointer',
                fontSize: 'var(--text-sm)', fontWeight: 600,
              },
              onClick: () => { modo.value = v; },
            }, [icon, t]);
            efecto(() => {
              const activo = modo.value === v;
              b.style.background = activo ? 'var(--primary)' : 'transparent';
              b.style.color = activo ? '#fff' : 'var(--muted-foreground)';
            });
            segmento.appendChild(b);
          });

          const lblTiempo = crearEl('strong', null, ['—']);
          const lblDist   = crearEl('strong', null, ['—']);
          const lblAlt    = crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBlockStart: '4px' } }, ['—']);
          const linkAbrir = crearEl('a', {
            href: '#', target: '_blank', rel: 'noopener',
            style: { textDecoration: 'none' },
          }, [Boton({ texto: ['Abrir en Google Maps ', Icono('navegar', { tamano: 14 })], variante: 'primary' })]);
          efecto(() => {
            const d = detalles[modo.value];
            lblTiempo.textContent = d.tiempo;
            lblDist.textContent   = d.distancia;
            lblAlt.textContent    = d.alternativas;
            linkAbrir.href = buildOpenURL('directions', { de, hacia, modoTransporte: modo.value });
          });

          const headerRuta = crearEl('div', {
            style: {
              display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
              padding: 'var(--space-3)', background: 'var(--surface)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
              flexWrap: 'wrap',
            },
          }, [
            crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
              crearEl('span', { style: { width: '32px', height: '32px', borderRadius: '50%', background: 'color-mix(in srgb, var(--primary) 14%, transparent)', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' } }, [Icono('navegar', { tamano: 16 })]),
              crearEl('div', null, [
                crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontWeight: 600 } }, ['DESDE']),
                crearEl('div', { style: { fontSize: 'var(--text-sm)', fontWeight: 700 } }, [de]),
              ]),
            ]),
            crearEl('span', { style: { color: 'var(--muted-foreground)' } }, ['→']),
            crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
              crearEl('span', { style: { width: '32px', height: '32px', borderRadius: '50%', background: 'color-mix(in srgb, var(--color-success) 14%, transparent)', color: 'var(--color-success)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' } }, [Icono('pin', { tamano: 16 })]),
              crearEl('div', null, [
                crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontWeight: 600 } }, ['HASTA']),
                crearEl('div', { style: { fontSize: 'var(--text-sm)', fontWeight: 700 } }, [hacia]),
              ]),
            ]),
            crearEl('div', { style: { marginInlineStart: 'auto' } }, [segmento]),
          ]);

          const tarjetaInfo = crearEl('div', {
            style: {
              padding: 'var(--space-4)',
              background: 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 8%, var(--surface)), var(--surface))',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              display: 'flex', flexDirection: 'column', gap: '12px',
            },
          }, [
            crearEl('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' } }, [
              crearEl('div', null, [
                crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' } }, ['Tiempo estimado']),
                crearEl('div', { style: { fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--primary)', lineHeight: 1.2 } }, [lblTiempo]),
              ]),
              crearEl('div', null, [
                crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' } }, ['Distancia']),
                crearEl('div', { style: { fontSize: 'var(--text-2xl)', fontWeight: 800, lineHeight: 1.2 } }, [lblDist]),
              ]),
            ]),
            lblAlt,
            linkAbrir,
          ]);

          return cardWrap(
            headerRuta,
            crearEl('div', {
              style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-3)' },
            }, [
              tarjetaInfo,
              GoogleMap({
                query: hacia,
                titulo: `Destino · ${hacia}`,
                ratio: '4/3',
              }),
            ]),
          );
        })(),
        codigo: `// Google bloquea el iframe de direcciones (X-Frame-Options).
// Patrón correcto: deep-link a la app/web nativa.

const buildOpenURL = (modo, q) => {
  if (modo === 'directions') {
    return \`https://www.google.com/maps/dir/?api=1&origin=\${enc(q.de)}&destination=\${enc(q.hacia)}&travelmode=\${q.modoTransporte}\`;
  }
};

// El iframe muestra sólo el destino; el botón abre la ruta en Google Maps
<a href={buildOpenURL('directions', { de, hacia, modoTransporte: modo })} target="_blank">
  Abrir en Google Maps
</a>`,
      })],
    }),

    // ============== 4. SATÉLITE ==============
    Seccion({
      titulo: '4 · Vista satélite',
      descripcion: 'Pasando `modo: "satellite"` el preview usa un fondo verdoso (estilo terreno) y el deep-link abre Google Maps en vista satelital. Si hay API key, el iframe se sirve con `&maptype=satellite`.',
      hijos: [VistaCodigo({
        vista: GoogleMap({
          query: 'Central Park, New York',
          modo: 'satellite',
          poster: POSTER.satelite,
          titulo: 'Central Park · vista satélite',
        }),
        codigo: `GoogleMap({
  query: 'Central Park, New York',
  modo: 'satellite',                           // → maptype=satellite
  poster: '/img/centralpark.jpg',
})`,
      })],
    }),

    // ============== 5. STREET VIEW (deep-link) ==============
    Seccion({
      titulo: '5 · Street View — abrir vista de calle',
      descripcion: 'Igual que con direcciones, Street View no se puede iframear sin API key (Google bloquea con X-Frame-Options). Patrón sin coste: tarjeta con poster + lugar embebido + botón "Abrir Street View". El usuario navega a Google Maps con la vista panorámica activa.',
      hijos: [VistaCodigo({
        vista: (() => {
          const ubicacion = { lat: 35.6586, lng: 139.7454, nombre: 'Tokyo Tower' };
          return crearEl('div', {
            style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-3)' },
          }, [
            // Poster + CTA
            crearEl('div', {
              style: {
                position: 'relative',
                aspectRatio: '4/3',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '1px solid var(--border)',
                backgroundImage: `url(${POSTER.street})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                display: 'flex', alignItems: 'flex-end', padding: 'var(--space-4)',
                color: '#fff',
              },
            }, [
              crearEl('span', { style: { position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgb(0 0 0 / 0.1), rgb(0 0 0 / 0.7))' } }),
              crearEl('div', { style: { position: 'relative', zIndex: 1, width: '100%' } }, [
                crearEl('div', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: 'rgb(255 255 255 / 0.95)', color: '#000', borderRadius: '4px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', marginBlockEnd: '8px' } }, [Icono('mapas', { tamano: 11 }), 'Street View']),
                crearEl('h4', { style: { margin: '0 0 4px', fontSize: 'var(--text-xl)', fontWeight: 800, textShadow: '0 2px 8px rgb(0 0 0 / 0.6)' } }, [ubicacion.nombre]),
                crearEl('div', { style: { fontSize: 'var(--text-xs)', opacity: 0.85, marginBlockEnd: 'var(--space-3)' } }, [`${ubicacion.lat}, ${ubicacion.lng}`]),
                crearEl('a', {
                  href: buildOpenURL('streetview', ubicacion),
                  target: '_blank', rel: 'noopener',
                  style: { textDecoration: 'none' },
                }, [Boton({ texto: ['Abrir Street View ', Icono('flecha_r', { tamano: 14 })], variante: 'primary' })]),
              ]),
            ]),
            // Place preview del mismo punto
            GoogleMap({
              query: `${ubicacion.lat},${ubicacion.lng} (${ubicacion.nombre})`,
              titulo: `${ubicacion.nombre} · vista mapa`,
              ratio: '4/3',
            }),
          ]);
        })(),
        codigo: `// Street View no se puede embeber. Patrón:
// poster + lugar embedido + deep-link al panorama nativo.

const buildOpenURL = (modo, { lat, lng }) => {
  if (modo === 'streetview') {
    return \`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=\${lat},\${lng}\`;
  }
};`,
      })],
    }),

    // ============== 6. TARJETA DE NEGOCIO ==============
    Seccion({
      titulo: '6 · "Cómo llegar" — tarjeta de contacto',
      descripcion: 'Patrón típico de página de Contacto / footer. Mapa pequeño con la sede + datos al lado (dirección, teléfono, horarios, link a abrir en Google Maps).',
      hijos: [VistaCodigo({
        vista: crearEl('div', {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 'var(--space-4)',
            padding: 'var(--space-4)',
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
          },
        }, [
          crearEl('div', null, [
            crearEl('div', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: 'color-mix(in srgb, var(--primary) 14%, transparent)', color: 'var(--primary)', borderRadius: '999px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase' } },
              [Icono('pin', { tamano: 12 }), 'Sede central']),
            crearEl('h3', { style: { margin: '8px 0 4px', fontSize: 'var(--text-xl)', fontWeight: 800 } }, ['template-vanilla SL']),
            crearEl('div', { style: { color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', lineHeight: 1.55 } },
              ['Calle Gran Vía 28, 4ª planta', crearEl('br'), '28013 Madrid, España']),

            crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px', marginBlockStart: 'var(--space-3)', paddingBlockStart: 'var(--space-3)', borderBlockStart: '1px solid var(--border)' } },
              [
                ['📞', '+34 911 23 45 67'],
                ['✉️', 'hola@template-vanilla.dev'],
                ['🕐', 'Lun–Vie · 9:00 – 18:00'],
                ['🚇', 'Metro Gran Vía (líneas 1 y 5)'],
              ].map(([ic, t]) => crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: 'var(--text-sm)' } }, [
                crearEl('span', { style: { fontSize: '15px' } }, [ic]),
                crearEl('span', null, [t]),
              ])),
            ),
            crearEl('div', { style: { display: 'flex', gap: '8px', marginBlockStart: 'var(--space-3)' } }, [
              Boton({ texto: ['Cómo llegar ', Icono('navegar', { tamano: 14 })], variante: 'primary' }),
              Boton({ texto: 'Llamar', variante: 'ghost' }),
            ]),
          ]),
          GoogleMap({
            query: 'Calle Gran Vía 28, Madrid',
            titulo: 'Sede central',
            poster: POSTER.oficina,
            ratio: '4/3',
          }),
        ]),
        codigo: `// Tarjeta de contacto: info a la izquierda, mapa a la derecha
<div style="display: grid; grid-template-columns: 1fr 1.4fr">
  <div>{nombre + dirección + teléfono + horarios}</div>
  <GoogleMap query="Calle Gran Vía 28, Madrid" poster={...} ratio="4/3" />
</div>`,
      })],
    }),

    // ============== 7. STORE LOCATOR ==============
    Seccion({
      titulo: '7 · Store locator — sucursales con mapa',
      descripcion: 'Layout de "Encuentra tu tienda más cercana" usado en cadenas (Apple, Starbucks, Zara). Lista de sucursales a la izquierda con click → cambia el lugar centrado en el mapa.',
      hijos: [VistaCodigo({
        vista: (() => {
          const tiendas = [
            { id: 'mad-grv', nombre: 'Madrid · Gran Vía',     dir: 'Gran Vía 32, Madrid', horario: 'Cierra a las 22:00', telefono: '+34 911 12 34 56', dist: '0.4 km' },
            { id: 'mad-sal', nombre: 'Madrid · Salamanca',    dir: 'Calle Serrano 42, Madrid', horario: 'Cierra a las 21:00', telefono: '+34 911 12 34 57', dist: '2.1 km' },
            { id: 'mad-cha', nombre: 'Madrid · Chamberí',     dir: 'Calle Fuencarral 110, Madrid', horario: 'Cerrado · abre a las 10:00', telefono: '+34 911 12 34 58', dist: '3.8 km' },
            { id: 'mad-ret', nombre: 'Madrid · Retiro',       dir: 'Av. Menéndez Pelayo 12, Madrid', horario: 'Cierra a las 23:00', telefono: '+34 911 12 34 59', dist: '4.5 km' },
          ];
          const sel = senal('mad-grv');

          // Wrapper que re-renderiza el preview cuando cambia la selección
          const wrapperMapa = crearEl('div', {
            style: { minHeight: '460px', display: 'flex', flexDirection: 'column' },
          });
          efecto(() => {
            const t = tiendas.find((x) => x.id === sel.value);
            if (!t) return;
            wrapperMapa.replaceChildren(GoogleMap({
              query: t.dir,
              titulo: t.nombre,
              alto: '460px',
            }));
          });

          const lista = crearEl('div', {
            style: { display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '460px', overflow: 'auto' },
          });
          tiendas.forEach((t) => {
            const item = crearEl('button', {
              style: {
                display: 'block', textAlign: 'start',
                padding: '12px 14px',
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', cursor: 'pointer',
                transition: 'all 160ms ease',
              },
              onClick: () => { sel.value = t.id; },
            }, [
              crearEl('div', { style: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' } }, [
                crearEl('div', null, [
                  crearEl('div', { style: { fontWeight: 700, fontSize: 'var(--text-sm)' } }, [t.nombre]),
                  crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBlockStart: '2px' } }, [t.dir]),
                ]),
                crearEl('span', { style: { fontSize: '11px', fontWeight: 700, color: 'var(--primary)', whiteSpace: 'nowrap' } }, [t.dist]),
              ]),
              crearEl('div', { style: { display: 'flex', gap: '12px', marginBlockStart: '8px', paddingBlockStart: '8px', borderBlockStart: '1px solid var(--border)', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [
                crearEl('span', null, ['🕐 ', t.horario]),
                crearEl('span', null, ['📞 ', t.telefono]),
              ]),
            ]);
            efecto(() => {
              const activo = sel.value === t.id;
              item.style.borderColor = activo ? 'var(--primary)' : 'var(--border)';
              item.style.background = activo ? 'color-mix(in srgb, var(--primary) 8%, var(--surface))' : 'var(--surface)';
              item.style.boxShadow = activo ? '0 0 0 3px color-mix(in srgb, var(--primary) 18%, transparent)' : 'none';
            });
            lista.appendChild(item);
          });

          return crearEl('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)' } }, [lista, wrapperMapa]);
        })(),
        codigo: `const sel = senal('mad-grv');

efecto(() => {
  const t = tiendas.find(x => x.id === sel.value);
  iframe.src = buildEmbed('place', t.dir);
});

// Click en la tarjeta → sel.value = t.id`,
      })],
    }),

    // ============== 8. PROPIEDAD INMOBILIARIA ==============
    Seccion({
      titulo: '8 · Anuncio de propiedad — fotos + mapa + servicios',
      descripcion: 'Patrón de Idealista, Zillow, Airbnb. Vista satélite del barrio + lista de servicios cercanos calculados (escuelas, supermercados, transporte) con tiempo a pie.',
      hijos: [VistaCodigo({
        vista: crearEl('div', {
          style: {
            border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
            background: 'var(--surface)', overflow: 'hidden',
          },
        }, [
          crearEl('div', { style: { padding: 'var(--space-4)', borderBlockEnd: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-3)', flexWrap: 'wrap' } }, [
            crearEl('div', null, [
              crearEl('h3', { style: { margin: 0, fontSize: 'var(--text-xl)', fontWeight: 800 } }, ['Apartamento luminoso · 3 habs · 95m²']),
              crearEl('div', { style: { color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginBlockStart: '4px' } }, ['Calle Atocha 15 · Centro · Madrid']),
            ]),
            crearEl('div', { style: { textAlign: 'end' } }, [
              crearEl('div', { style: { fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--primary)' } }, ['€ 489.000']),
              crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, ['€5,150 / m²']),
            ]),
          ]),
          GoogleMap({
            query: 'Calle Atocha 15, Madrid',
            modo: 'satellite',
            poster: POSTER.satelite,
            titulo: 'Vista del barrio',
            alto: '380px',
          }),
          crearEl('div', { style: { padding: 'var(--space-4)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-3)' } },
            [
              ['🚇', 'Metro Antón Martín', '2 min'],
              ['🏫', 'Colegio público',    '4 min'],
              ['🛒', 'Supermercado',       '3 min'],
              ['🏥', 'Hospital cercano',   '8 min'],
              ['🌳', 'Parque del Retiro',  '6 min'],
              ['☕', 'Cafés y bares',       '1 min'],
            ].map(([ic, t, tiempo]) => crearEl('div', {
              style: {
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px', background: 'var(--background)',
                border: '1px solid var(--border)', borderRadius: 'var(--radius)',
              },
            }, [
              crearEl('span', { style: { fontSize: '20px' } }, [ic]),
              crearEl('div', { style: { flex: 1, minWidth: 0 } }, [
                crearEl('div', { style: { fontSize: 'var(--text-sm)', fontWeight: 600 } }, [t]),
                crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [tiempo, ' a pie']),
              ]),
            ])),
          ),
        ]),
        codigo: `// Propiedad inmobiliaria: vista satélite + servicios cercanos
GoogleMap({ src: buildEmbed('satellite', dir, { zoom: 17 }) })

// Servicios cercanos calculados (puede usar Places API con key)
const cerca = [
  { ic: '🚇', t: 'Metro', tiempo: '2 min' },
  { ic: '🏫', t: 'Colegio', tiempo: '4 min' },
  // ...
];`,
      })],
    }),

    // ============== 9. EVENTO ==============
    Seccion({
      titulo: '9 · Página de evento — venue + cómo llegar',
      descripcion: 'Layout para conferencias, conciertos, bodas. Hero con foto del venue, mapa abajo, opciones de transporte y "abrir en Google Maps" en una sola tap para móvil.',
      hijos: [VistaCodigo({
        vista: crearEl('div', {
          style: {
            border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
            background: 'var(--surface)', overflow: 'hidden',
          },
        }, [
          crearEl('div', {
            style: {
              padding: 'var(--space-4)',
              background: 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 14%, transparent), color-mix(in srgb, #ec4899 10%, transparent))',
              borderBlockEnd: '1px solid var(--border)',
            },
          }, [
            crearEl('div', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: 'var(--surface)', borderRadius: '999px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' } },
              ['📅 SÁBADO 14 · 19:00']),
            crearEl('h3', { style: { margin: '8px 0 4px', fontSize: 'var(--text-2xl)', fontWeight: 800, letterSpacing: '-0.02em' } }, ['template-vanilla Conf 2026']),
            crearEl('div', { style: { color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' } }, ['📍 Teatro Real · Plaza de Isabel II, Madrid']),
          ]),
          GoogleMap({
            query: 'Teatro Real, Madrid',
            poster: POSTER.evento || POSTER.oficina,
            titulo: 'Teatro Real',
            alto: '320px',
          }),
          crearEl('div', { style: { padding: 'var(--space-4)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', alignItems: 'center', justifyContent: 'space-between' } }, [
            crearEl('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '8px' } },
              [
                ['🚇', 'Ópera (líneas 2 y 5)'],
                ['🚌', 'Buses 3, 25, 39, 148'],
                ['🅿️', 'Parking Plaza España (4 min)'],
              ].map(([ic, t]) => crearEl('span', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 10px', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '999px', fontSize: 'var(--text-xs)', fontWeight: 600 } }, [ic, t])),
            ),
            crearEl('div', { style: { display: 'flex', gap: '6px' } }, [
              Boton({ texto: ['Cómo llegar ', Icono('navegar', { tamano: 14 })], variante: 'primary' }),
              Boton({ texto: 'Calendario', variante: 'ghost' }),
            ]),
          ]),
        ]),
        codigo: `// Página de evento — venue + transporte + acciones
<div class="evento">
  <header class="hero">{fecha + título + venue}</header>
  <GoogleMap src={buildEmbed('place', venue)} alto="320px" />
  <footer>{transportes + Boton 'Cómo llegar'}</footer>
</div>`,
      })],
    }),

    // ============== 10. SEARCH MULTI-PLACE ==============
    Seccion({
      titulo: '10 · Búsqueda — "cafeterías cerca de ti"',
      descripcion: 'Modo `search`: el deep-link abre Google Maps con varios resultados (cafeterías, restaurantes, gimnasios, etc.). En el preview se muestra el query como destino. Con API key, el iframe usa `embed/v1/search` y muestra los marcadores reales.',
      hijos: [VistaCodigo({
        vista: GoogleMap({
          query: 'cafeterías especiales en Malasaña, Madrid',
          modo: 'search',
          titulo: 'Cafeterías en Malasaña',
          alto: '400px',
        }),
        codigo: `GoogleMap({
  query: 'cafeterías especiales en Malasaña, Madrid',
  modo: 'search',                              // → /maps/search/...
  alto: '400px',
})`,
      })],
    }),

    // ============== 11. CIUDADES DEL MUNDO (galería) ==============
    Seccion({
      titulo: '11 · Galería — oficinas en el mundo',
      descripcion: 'Grid de previews para landings tipo "tenemos oficinas en…". Cada card abre Google Maps con su query. Patrón de Stripe Customers, Notion Locations, Linear About.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-3)' } }, [
          { q: 'Times Square, New York',     poster: POSTER.ny,     bandera: '🇺🇸', t: 'Nueva York' },
          { q: 'Shibuya Crossing, Tokyo',    poster: POSTER.tokyo,  bandera: '🇯🇵', t: 'Tokio' },
          { q: 'Tour Eiffel, Paris',          poster: POSTER.paris,  bandera: '🇫🇷', t: 'París' },
          { q: 'Big Ben, London',             poster: POSTER.satelite, bandera: '🇬🇧', t: 'Londres' },
          { q: 'Sydney Opera House, Sydney',  poster: POSTER.ruta,   bandera: '🇦🇺', t: 'Sydney' },
          { q: 'Cristo Redentor, Rio de Janeiro', poster: POSTER.street, bandera: '🇧🇷', t: 'Río de Janeiro' },
        ].map(({ q, poster, bandera, t }) => crearEl('div', null, [
          GoogleMap({
            query: q,
            poster,
            titulo: `${bandera} ${t}`,
          }),
        ]))),
        codigo: `// Cada card es un preview que abre Google Maps al clickearse
oficinas.map(o => GoogleMap({
  query: o.direccion,
  poster: o.foto,
  titulo: \`\${o.bandera} \${o.ciudad}\`,
}))`,
      })],
    }),

    // ============== 12. COMPARATIVA / NOTA TÉCNICA ==============
    Seccion({
      titulo: '12 · ¿Cuándo usar Google Maps Embed vs Maps JS API vs Leaflet?',
      descripcion: 'Resumen práctico para elegir la opción correcta según el caso de uso.',
      hijos: [crearEl('div', {
        style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-3)' },
      }, [
        ['Embed (este módulo)', '#3b82f6', [
          '✅ Sin API key',
          '✅ Setup en 1 línea (iframe)',
          '✅ Place · Directions · StreetView · Search',
          '⚠️ No markers programáticos',
          '⚠️ No listeners (click, drag…)',
          '⚠️ Branding de Google visible',
        ], 'Para: páginas de contacto, eventos, "cómo llegar", listings simples'],
        ['Maps JS API', '#10b981', [
          '✅ Markers programáticos custom',
          '✅ Listeners y eventos',
          '✅ Heatmaps · Drawing · Places',
          '⚠️ Requiere API key (con quota)',
          '⚠️ ~$7/1000 cargas mapa pasado el free tier',
          '⚠️ Bundle pesado (~100-200KB)',
        ], 'Para: dashboards live, tracking, apps logísticas, real estate avanzado'],
        ['Leaflet + OSM', '#8b5cf6', [
          '✅ 100% gratis · sin quota',
          '✅ Bundle pequeño (~42KB gzipped)',
          '✅ Ecosistema enorme de plugins',
          '✅ Tiles personalizados',
          '⚠️ No tiene Google Places',
          '⚠️ Routing requiere servicio externo (OSRM/Mapbox)',
        ], 'Para: la mayoría de casos. Especialmente si quieres independencia, dark mode, branding limpio'],
      ].map(([titulo, color, ventajas, paraQ]) => crearEl('div', {
        style: {
          padding: 'var(--space-4)',
          background: 'var(--surface)',
          border: `1px solid color-mix(in srgb, ${color} 35%, var(--border))`,
          borderTop: `3px solid ${color}`,
          borderRadius: 'var(--radius-md)',
        },
      }, [
        crearEl('h4', { style: { margin: '0 0 12px', fontSize: 'var(--text-base)', fontWeight: 800, color } }, [titulo]),
        crearEl('ul', { style: { listStyle: 'none', padding: 0, margin: '0 0 12px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: 'var(--text-sm)' } },
          ventajas.map((v) => crearEl('li', null, [v])),
        ),
        crearEl('div', { style: { paddingBlockStart: '10px', borderBlockStart: '1px solid var(--border)', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', lineHeight: 1.5 } }, [
          crearEl('strong', null, ['Para: ']),
          paraQ,
        ]),
      ])))],
    }),

  ],
});
