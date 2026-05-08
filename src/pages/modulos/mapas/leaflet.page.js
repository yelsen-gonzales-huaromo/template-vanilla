/**
 * Leaflet — showcase completo con OpenStreetMap (sin API key).
 *
 * Cubre: básico · marcadores con popups · custom DivIcons · clusters ·
 * polilíneas/rutas · círculos/heatmap visual · capas (tile providers) ·
 * vuelo a ubicación · sidebar de búsqueda interactivo · dark mode ·
 * dashboard de delivery · choropleth-like · streetview-like (Mapillary).
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { cargarLeaflet } from '../../../integrations/leaflet/index.js';
import { cargarMarkerCluster } from '../../../integrations/leaflet-plugins/index.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { Boton } from '../../../components/ui/button/button.js';
import { corner4 } from '../../../components/ui/card/card-decoraciones.js';

// ============================================================================
//  Helpers
// ============================================================================

// Crea un contenedor div con altura fija que monta un mapa Leaflet cuando entra
// en viewport. Devuelve { contenedor, listo: Promise<L.Map> }.
const montarMapa = ({
  alto = '380px',
  centro = [40.4168, -3.7038],
  zoom = 12,
  scrollWheelZoom = false,
  tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  tileOpts = { attribution: '© OpenStreetMap', maxZoom: 19 },
} = {}) => {
  const contenedor = crearEl('div', {
    style: {
      width: '100%', height: alto,
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      border: '1px solid var(--border)',
      background: 'var(--surface-muted)',
    },
  });

  const listo = new Promise((resolve) => {
    const observador = new IntersectionObserver(async (entradas) => {
      if (!entradas[0].isIntersecting) return;
      observador.disconnect();
      const L = await cargarLeaflet();
      const mapa = L.map(contenedor, { scrollWheelZoom }).setView(centro, zoom);
      L.tileLayer(tileUrl, tileOpts).addTo(mapa);
      // Espera al primer paint para que las tiles tengan tamaño correcto
      requestAnimationFrame(() => mapa.invalidateSize());
      resolve({ L, mapa });
    });
    observador.observe(contenedor);
  });

  return { contenedor, listo };
};

// DivIcon SVG personalizado (estilo Vercel/Linear pin con halo)
const pinSVG = (color = '#3b82f6', emoji) => `
  <div style="position: relative; display: inline-flex; align-items: center; justify-content: center;">
    <div style="
      width: 32px; height: 32px;
      background: ${color};
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 8px 24px ${color}66, 0 0 0 4px ${color}22;
      display: flex; align-items: center; justify-content: center;
    ">
      <span style="
        transform: rotate(45deg);
        font-size: 16px; line-height: 1;
        color: #fff; font-weight: 700;
      ">${emoji || ''}</span>
    </div>
    <div style="
      position: absolute; bottom: -4px; left: 50%;
      width: 14px; height: 4px;
      background: rgba(0,0,0,0.18);
      border-radius: 50%;
      transform: translateX(-50%);
      filter: blur(2px);
    "></div>
  </div>
`;

// Card-shell para los previews (sin reborde extra: el wrapper ya pone fondo)
const wrap = (...nodos) => crearEl('div', {
  style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' },
}, nodos);

// ============================================================================
//  Página
// ============================================================================
export default async () => PaginaShowcase({
  titulo: 'Leaflet',
  descripcion: 'Mapas interactivos con OpenStreetMap (sin API key, gratis e ilimitado). Lazy-load del bundle de Leaflet (~42KB gzipped) sólo cuando un mapa entra en viewport · marcadores custom con DivIcon HTML · clustering automático · múltiples tile providers (claro · dark · satélite · acuarela) · controles de zoom · popups con HTML rico · polilíneas para rutas · vuelo animado a coordenadas · sincronización con UI reactiva.',
  decoracion: corner4(),
  migas: [
    { etiqueta: 'Módulos', href: '#/modulos' },
    { etiqueta: 'Mapas', href: '#/modulos/mapas' },
  ],
  hijos: [

    // ============== 1. BÁSICO ==============
    Seccion({
      titulo: '1 · Mapa básico — OpenStreetMap',
      descripcion: 'El mínimo necesario: un contenedor con altura fija + tile layer de OSM. El bundle de Leaflet se carga lazy desde unpkg cuando el mapa entra en viewport, por lo que la primera carga de la página no pesa.',
      hijos: [VistaCodigo({
        vista: (() => {
          const { contenedor } = montarMapa({ centro: [40.4168, -3.7038], zoom: 13 });
          return contenedor;
        })(),
        codigo: `import { cargarLeaflet } from '.../integrations/leaflet/index.js';

const L = await cargarLeaflet();
const mapa = L.map(div).setView([40.4168, -3.7038], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap',
  maxZoom: 19,
}).addTo(mapa);`,
      })],
    }),

    // ============== 2. MARCADORES CON POPUP ==============
    Seccion({
      titulo: '2 · Marcadores con popup HTML rico',
      descripcion: 'Cada marker abre un popup con HTML libre — útil para fichas de tienda, detalles de ubicación, fotos miniatura. El click cierra otros popups por defecto.',
      hijos: [VistaCodigo({
        vista: (() => {
          const { contenedor, listo } = montarMapa({ centro: [40.4168, -3.7038], zoom: 12 });
          listo.then(({ L, mapa }) => {
            const lugares = [
              { lat: 40.4168, lng: -3.7038, t: 'Madrid · oficina central',  d: 'Calle Gran Vía 28', tipo: '🏢 Oficina' },
              { lat: 40.4196, lng: -3.6929, t: 'Almacén Retiro',            d: 'Av. Menéndez Pelayo 1', tipo: '📦 Almacén' },
              { lat: 40.4530, lng: -3.6884, t: 'Punto de recogida Chamartín', d: 'Plaza Castilla 3', tipo: '📍 Recogida' },
            ];
            lugares.forEach(({ lat, lng, t, d, tipo }) => {
              L.marker([lat, lng]).addTo(mapa).bindPopup(`
                <div style="min-width: 180px; font-family: inherit;">
                  <div style="font-size: 11px; color: #6b7280; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase;">${tipo}</div>
                  <div style="font-weight: 700; margin: 4px 0 2px;">${t}</div>
                  <div style="font-size: 13px; color: #4b5563;">${d}</div>
                </div>
              `);
            });
          });
          return contenedor;
        })(),
        codigo: `lugares.forEach(({ lat, lng, titulo, descripcion }) => {
  L.marker([lat, lng])
    .addTo(mapa)
    .bindPopup(\`<strong>\${titulo}</strong><br>\${descripcion}\`);
});`,
      })],
    }),

    // ============== 3. CUSTOM PINS ==============
    Seccion({
      titulo: '3 · Marcadores personalizados (DivIcon SVG)',
      descripcion: 'Reemplaza el pin azul por defecto con HTML libre. Cada categoría tiene su color y emoji. La sombra y el halo se logran con `box-shadow` y un pseudo-element de blur.',
      hijos: [VistaCodigo({
        vista: (() => {
          const { contenedor, listo } = montarMapa({ centro: [40.4168, -3.7038], zoom: 13 });
          listo.then(({ L, mapa }) => {
            const lugares = [
              { lat: 40.4168, lng: -3.7038, color: '#3b82f6', emoji: '☕', t: 'Café Acme' },
              { lat: 40.4145, lng: -3.6936, color: '#10b981', emoji: '🌳', t: 'Parque del Retiro' },
              { lat: 40.4232, lng: -3.7128, color: '#f59e0b', emoji: '🍕', t: 'Pizzería Bella' },
              { lat: 40.4220, lng: -3.7050, color: '#8b5cf6', emoji: '🎬', t: 'Cine Capitol' },
              { lat: 40.4181, lng: -3.6961, color: '#ec4899', emoji: '🛍️', t: 'Tienda VIP' },
            ];
            lugares.forEach(({ lat, lng, color, emoji, t }) => {
              const icon = L.divIcon({
                html: pinSVG(color, emoji),
                className: '', iconSize: [32, 36], iconAnchor: [16, 36], popupAnchor: [0, -36],
              });
              L.marker([lat, lng], { icon }).addTo(mapa).bindPopup(`<strong>${t}</strong>`);
            });
          });
          return contenedor;
        })(),
        codigo: `const icon = L.divIcon({
  html: \`<div style="background: \${color}; border-radius: 50% 50% 50% 0; ...">
            \${emoji}
          </div>\`,
  className: '',
  iconSize: [32, 36],
  iconAnchor: [16, 36],
});
L.marker([lat, lng], { icon }).addTo(mapa);`,
      })],
    }),

    // ============== 4. CLUSTERS ==============
    Seccion({
      titulo: '4 · Clustering — agrupar 200 marcadores',
      descripcion: 'Con muchos puntos, los marcadores se agrupan automáticamente y se separan al hacer zoom. Plugin oficial `Leaflet.markercluster`. Ideal para tiendas físicas, listas de eventos, sucursales bancarias.',
      hijos: [VistaCodigo({
        vista: (() => {
          const { contenedor, listo } = montarMapa({ centro: [40.4168, -3.7038], zoom: 11 });
          listo.then(async ({ mapa }) => {
            const L = await cargarMarkerCluster();
            const cluster = L.markerClusterGroup({ showCoverageOnHover: false });
            // 200 puntos pseudo-aleatorios alrededor de Madrid
            for (let i = 0; i < 200; i++) {
              const lat = 40.4168 + (Math.random() - 0.5) * 0.18;
              const lng = -3.7038 + (Math.random() - 0.5) * 0.22;
              cluster.addLayer(L.marker([lat, lng]).bindPopup(`Punto #${i + 1}`));
            }
            mapa.addLayer(cluster);
          });
          return contenedor;
        })(),
        codigo: `import { cargarMarkerCluster } from '.../integrations/leaflet-plugins/index.js';

const L = await cargarMarkerCluster();
const cluster = L.markerClusterGroup();
puntos.forEach(p => cluster.addLayer(L.marker([p.lat, p.lng])));
mapa.addLayer(cluster);`,
      })],
    }),

    // ============== 5. RUTA / POLILÍNEA ==============
    Seccion({
      titulo: '5 · Ruta dibujada (Polyline)',
      descripcion: 'Dibuja una secuencia de puntos como ruta. Útil para entregas, recorridos turísticos, tracking de un vehículo. Acepta opciones de color, peso y dasharray para diferentes estilos.',
      hijos: [VistaCodigo({
        vista: (() => {
          const { contenedor, listo } = montarMapa({ centro: [40.4168, -3.7038], zoom: 13 });
          listo.then(({ L, mapa }) => {
            const ruta = [
              [40.4168, -3.7038], [40.4145, -3.6936], [40.4181, -3.6961],
              [40.4232, -3.7128], [40.4280, -3.7062], [40.4220, -3.7050],
            ];
            // Línea principal
            L.polyline(ruta, { color: '#3b82f6', weight: 5, opacity: 0.9 }).addTo(mapa);
            // Marker inicio (verde)
            L.marker(ruta[0], {
              icon: L.divIcon({ html: pinSVG('#10b981', '🟢'), className: '', iconSize: [32, 36], iconAnchor: [16, 36] }),
            }).addTo(mapa).bindPopup('<strong>Salida · 09:00</strong>');
            // Marker fin (rojo)
            L.marker(ruta[ruta.length - 1], {
              icon: L.divIcon({ html: pinSVG('#ef4444', '🏁'), className: '', iconSize: [32, 36], iconAnchor: [16, 36] }),
            }).addTo(mapa).bindPopup('<strong>Llegada · 09:42</strong>');
            mapa.fitBounds(L.polyline(ruta).getBounds(), { padding: [40, 40] });
          });
          return contenedor;
        })(),
        codigo: `const ruta = [[lat1,lng1], [lat2,lng2], ...];
L.polyline(ruta, { color: '#3b82f6', weight: 5 }).addTo(mapa);
L.marker(ruta[0]).addTo(mapa).bindPopup('Salida');
L.marker(ruta.at(-1)).addTo(mapa).bindPopup('Llegada');
mapa.fitBounds(L.polyline(ruta).getBounds(), { padding: [40, 40] });`,
      })],
    }),

    // ============== 6. CÍRCULOS / RADIOS DE COBERTURA ==============
    Seccion({
      titulo: '6 · Círculos · radios de cobertura',
      descripcion: 'Útil para mostrar zonas de delivery, áreas de servicio, geofences. Los radios se especifican en metros (no píxeles) — escalan con el zoom como los polígonos reales.',
      hijos: [VistaCodigo({
        vista: (() => {
          const { contenedor, listo } = montarMapa({ centro: [40.4168, -3.7038], zoom: 12 });
          listo.then(({ L, mapa }) => {
            const zonas = [
              { c: [40.4168, -3.7038], r: 1500, color: '#3b82f6', n: 'Centro · 30 min' },
              { c: [40.4280, -3.6800], r: 1200, color: '#10b981', n: 'Salamanca · 45 min' },
              { c: [40.4050, -3.7250], r: 1800, color: '#f59e0b', n: 'Latina · 60 min' },
            ];
            zonas.forEach(({ c, r, color, n }) => {
              L.circle(c, { radius: r, color, fillColor: color, fillOpacity: 0.18, weight: 2 })
                .addTo(mapa).bindPopup(`<strong>${n}</strong><br>Radio: ${r}m`);
            });
          });
          return contenedor;
        })(),
        codigo: `L.circle([lat, lng], {
  radius: 1500,                              // metros
  color: '#3b82f6',
  fillColor: '#3b82f6',
  fillOpacity: 0.18,
}).addTo(mapa).bindPopup('Zona de delivery 30 min');`,
      })],
    }),

    // ============== 7. CAPAS / TILE PROVIDERS ==============
    Seccion({
      titulo: '7 · Capas alternativas — claro · oscuro · satélite · vintage',
      descripcion: 'Cada esquina muestra el mismo punto de Madrid con un proveedor de tiles distinto. Todos gratis y sin API key. Para producción puedes combinarlos con `L.control.layers()` para que el usuario alterne.',
      hijos: [VistaCodigo({
        vista: (() => {
          const grid = crearEl('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-3)' } });
          const proveedores = [
            { nombre: 'OpenStreetMap',
              url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
              attr: '© OpenStreetMap' },
            { nombre: 'CartoDB Voyager (claro)',
              url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
              attr: '© Carto' },
            { nombre: 'CartoDB Dark Matter',
              url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
              attr: '© Carto' },
            { nombre: 'Stamen Watercolor',
              url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg',
              attr: '© Stamen Design' },
          ];
          proveedores.forEach(({ nombre, url, attr }) => {
            const cell = crearEl('div', null, [
              crearEl('div', { style: { fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--muted-foreground)', marginBlockEnd: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' } }, [nombre]),
            ]);
            const { contenedor } = montarMapa({ alto: '220px', centro: [40.4168, -3.7038], zoom: 12, tileUrl: url, tileOpts: { attribution: attr, maxZoom: 18 } });
            cell.appendChild(contenedor);
            grid.appendChild(cell);
          });
          return grid;
        })(),
        codigo: `// Ejemplos de tile providers (todos gratis, sin API key):
const PROVIDERS = {
  osm:        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  carto:      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
  cartoDark:  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
  watercolor: 'https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg',
};
L.tileLayer(PROVIDERS.cartoDark, { maxZoom: 18 }).addTo(mapa);`,
      })],
    }),

    // ============== 8. SIDEBAR INTERACTIVA · CIUDADES ==============
    Seccion({
      titulo: '8 · Sidebar reactiva — vuelo a la ciudad seleccionada',
      descripcion: 'Click en una ciudad de la lista → el mapa hace `flyTo` con animación. La selección se sincroniza con una `senal` reactiva, demostrando integración Leaflet ↔ estado.',
      hijos: [VistaCodigo({
        vista: (() => {
          const ciudades = [
            { id: 'mad', nombre: 'Madrid',         pais: '🇪🇸 España',   coord: [40.4168, -3.7038], desc: 'Capital ibérica · 3.3M hab.' },
            { id: 'cdmx', nombre: 'Ciudad de México', pais: '🇲🇽 México',  coord: [19.4326, -99.1332], desc: 'Megaurbe latina · 9.2M hab.' },
            { id: 'bue', nombre: 'Buenos Aires',   pais: '🇦🇷 Argentina', coord: [-34.6037, -58.3816], desc: 'Puerto austral · 3.1M hab.' },
            { id: 'bog', nombre: 'Bogotá',         pais: '🇨🇴 Colombia',  coord: [4.711, -74.0721], desc: 'Sabana andina · 8M hab.' },
            { id: 'scl', nombre: 'Santiago',       pais: '🇨🇱 Chile',     coord: [-33.4489, -70.6693], desc: 'Al pie de la cordillera · 6.2M hab.' },
            { id: 'lim', nombre: 'Lima',           pais: '🇵🇪 Perú',      coord: [-12.0464, -77.0428], desc: 'Costa pacífica · 10M hab.' },
          ];
          const seleccion = senal('mad');

          const { contenedor: mapaDiv, listo } = montarMapa({ alto: '420px', centro: ciudades[0].coord, zoom: 5 });
          let mapaRef = null;
          listo.then(({ L, mapa }) => {
            mapaRef = mapa;
            ciudades.forEach((c) => {
              const icon = L.divIcon({ html: pinSVG('#3b82f6'), className: '', iconSize: [32, 36], iconAnchor: [16, 36], popupAnchor: [0, -36] });
              L.marker(c.coord, { icon }).addTo(mapa).bindPopup(`<strong>${c.nombre}</strong><br>${c.desc}`);
            });
          });

          efecto(() => {
            const sel = ciudades.find((c) => c.id === seleccion.value);
            if (sel && mapaRef) mapaRef.flyTo(sel.coord, 11, { duration: 1.4 });
          });

          const lista = crearEl('div', {
            style: { display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '420px', overflow: 'auto' },
          });
          ciudades.forEach((c) => {
            const item = crearEl('button', {
              style: {
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 12px',
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer', textAlign: 'start',
                transition: 'background 160ms ease, border-color 160ms ease',
              },
              onClick: () => { seleccion.value = c.id; },
            }, [
              crearEl('span', {
                style: { width: '28px', height: '28px', borderRadius: '50%', background: 'color-mix(in srgb, var(--primary) 14%, transparent)', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
              }, [Icono('pin', { tamano: 14 })]),
              crearEl('div', { style: { flex: 1, minWidth: 0 } }, [
                crearEl('div', { style: { fontWeight: 700, fontSize: 'var(--text-sm)' } }, [c.nombre]),
                crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBlockStart: '2px' } }, [c.pais, ' · ', c.desc]),
              ]),
              Icono('chevron_r', { tamano: 14 }),
            ]);
            efecto(() => {
              const activo = seleccion.value === c.id;
              item.style.background = activo ? 'color-mix(in srgb, var(--primary) 10%, transparent)' : 'transparent';
              item.style.borderColor = activo ? 'var(--primary)' : 'var(--border)';
            });
            lista.appendChild(item);
          });

          return crearEl('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)' } }, [lista, mapaDiv]);
        })(),
        codigo: `const seleccion = senal('mad');

ciudades.forEach(c => L.marker(c.coord).addTo(mapa).bindPopup(c.nombre));

efecto(() => {
  const sel = ciudades.find(c => c.id === seleccion.value);
  mapa.flyTo(sel.coord, 11, { duration: 1.4 });
});

// Click en sidebar → seleccion.value = c.id;`,
      })],
    }),

    // ============== 9. DASHBOARD DELIVERY ==============
    Seccion({
      titulo: '9 · Dashboard de delivery — tracking en tiempo real',
      descripcion: 'Layout de dashboard logístico: mapa con la flota + panel lateral con KPIs y lista de pedidos activos. Cada repartidor es un pin con su estado (en ruta · entregando · descansando).',
      hijos: [VistaCodigo({
        vista: (() => {
          const repartidores = [
            { id: 1, nombre: 'Carlos M.', estado: 'ruta',       color: '#3b82f6', emoji: '🛵', coord: [40.4168, -3.7038], pedidos: 3 },
            { id: 2, nombre: 'Lucía P.',  estado: 'entregando', color: '#10b981', emoji: '📦', coord: [40.4280, -3.6800], pedidos: 1 },
            { id: 3, nombre: 'Diego R.',  estado: 'ruta',       color: '#3b82f6', emoji: '🛵', coord: [40.4050, -3.7250], pedidos: 2 },
            { id: 4, nombre: 'Ana T.',    estado: 'descanso',   color: '#94a3b8', emoji: '☕', coord: [40.4232, -3.7128], pedidos: 0 },
            { id: 5, nombre: 'Pablo S.',  estado: 'entregando', color: '#10b981', emoji: '📦', coord: [40.4145, -3.6936], pedidos: 1 },
          ];

          const { contenedor: mapaDiv, listo } = montarMapa({ alto: '440px', centro: [40.4168, -3.7038], zoom: 12 });
          listo.then(({ L, mapa }) => {
            repartidores.forEach((r) => {
              const icon = L.divIcon({ html: pinSVG(r.color, r.emoji), className: '', iconSize: [32, 36], iconAnchor: [16, 36], popupAnchor: [0, -36] });
              L.marker(r.coord, { icon }).addTo(mapa).bindPopup(`<strong>${r.nombre}</strong><br>${r.pedidos} pedidos activos`);
            });
          });

          const panel = crearEl('div', {
            style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', height: '440px', overflow: 'auto' },
          }, [
            // KPIs
            crearEl('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' } }, [
              ['Activos', '5', 'var(--primary)'],
              ['En ruta', '3', '#10b981'],
              ['Pedidos', '7', '#f59e0b'],
              ['Descanso', '1', '#94a3b8'],
            ].map(([t, v, c]) => crearEl('div', {
              style: { padding: '10px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' },
            }, [
              crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontWeight: 600 } }, [t]),
              crearEl('div', { style: { fontSize: 'var(--text-xl)', fontWeight: 800, color: c, lineHeight: 1.2 } }, [v]),
            ]))),
            // Lista
            crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px' } },
              repartidores.map((r) => crearEl('div', {
                style: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' },
              }, [
                crearEl('span', {
                  style: { width: '32px', height: '32px', borderRadius: '50%', background: r.color, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 },
                }, [r.emoji]),
                crearEl('div', { style: { flex: 1, minWidth: 0 } }, [
                  crearEl('div', { style: { fontSize: 'var(--text-sm)', fontWeight: 700 } }, [r.nombre]),
                  crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [
                    r.estado === 'ruta' ? '🛣️ en ruta' : r.estado === 'entregando' ? '📦 entregando' : '☕ descanso',
                  ]),
                ]),
                crearEl('span', {
                  style: { padding: '2px 8px', background: 'color-mix(in srgb, var(--primary) 14%, transparent)', color: 'var(--primary)', borderRadius: '999px', fontSize: '11px', fontWeight: 700 },
                }, [r.pedidos, ' pedidos']),
              ])),
            ),
          ]);

          return crearEl('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' } }, [mapaDiv, panel]);
        })(),
        codigo: `// Cada repartidor es un divIcon coloreado por estado
repartidores.forEach(r => {
  const icon = L.divIcon({ html: pinSVG(r.color, r.emoji), ... });
  L.marker(r.coord, { icon }).addTo(mapa)
    .bindPopup(\`<strong>\${r.nombre}</strong><br>\${r.pedidos} pedidos\`);
});`,
      })],
    }),

    // ============== 10. CONTROLES PERSONALIZADOS ==============
    Seccion({
      titulo: '10 · Controles externos · zoom · centrar · capa',
      descripcion: 'Botones HTML normales que llaman a la API de Leaflet. Esto demuestra que el mapa es totalmente programable desde fuera — no necesitas usar `L.control` para todo.',
      hijos: [VistaCodigo({
        vista: (() => {
          const { contenedor: mapaDiv, listo } = montarMapa({ alto: '380px', centro: [40.4168, -3.7038], zoom: 13 });
          let mapaRef = null;
          let capaActual = null;
          let LRef = null;

          const setCapa = (url) => {
            if (!mapaRef || !LRef) return;
            if (capaActual) mapaRef.removeLayer(capaActual);
            capaActual = LRef.tileLayer(url, { maxZoom: 19 }).addTo(mapaRef);
          };

          listo.then(({ L, mapa }) => {
            mapaRef = mapa; LRef = L;
          });

          const btn = (icono, texto, onClick) => crearEl('button', {
            style: {
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '8px 12px',
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', cursor: 'pointer',
              fontSize: 'var(--text-sm)', fontWeight: 600,
              color: 'var(--foreground)',
            },
            onClick,
          }, [icono && Icono(icono, { tamano: 14 }), texto]);

          const barra = crearEl('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBlockEnd: 'var(--space-2)' } }, [
            btn('zoom_mas', 'Zoom +', () => mapaRef?.zoomIn()),
            btn('zoom_menos', 'Zoom -', () => mapaRef?.zoomOut()),
            btn('navegar', 'Centrar Madrid', () => mapaRef?.flyTo([40.4168, -3.7038], 13, { duration: 1.2 })),
            btn('navegar', 'Centrar NYC', () => mapaRef?.flyTo([40.7128, -74.0060], 13, { duration: 1.5 })),
            btn('capas', 'Claro',   () => setCapa('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png')),
            btn('capas', 'Oscuro',  () => setCapa('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png')),
          ]);

          return wrap(barra, mapaDiv);
        })(),
        codigo: `// Controles HTML llamando a la API de Leaflet
<button onClick={() => mapa.zoomIn()}>+</button>
<button onClick={() => mapa.zoomOut()}>-</button>
<button onClick={() => mapa.flyTo([40.71, -74.00], 13, { duration: 1.5 })}>NYC</button>
<button onClick={() => cambiarTileLayer(URL_DARK)}>Modo oscuro</button>`,
      })],
    }),

    // ============== 11. DARK MODE ==============
    Seccion({
      titulo: '11 · Mapa dark — UI nocturna',
      descripcion: 'Para apps con tema oscuro o dashboards de monitoreo (NOC, security ops). Tile layer Carto Dark Matter + popups con backdrop oscuro.',
      hijos: [VistaCodigo({
        vista: (() => {
          const { contenedor, listo } = montarMapa({
            alto: '380px', centro: [40.4168, -3.7038], zoom: 13,
            tileUrl: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
            tileOpts: { attribution: '© Carto · OSM', maxZoom: 18 },
          });
          listo.then(({ L, mapa }) => {
            const colores = ['#22d3ee', '#a78bfa', '#f472b6'];
            const lugares = [
              { lat: 40.4168, lng: -3.7038, t: 'Sede principal',  emoji: '🏢' },
              { lat: 40.4280, lng: -3.6800, t: 'Datacenter EU-1', emoji: '💾' },
              { lat: 40.4050, lng: -3.7250, t: 'Edge node',       emoji: '⚡' },
            ];
            lugares.forEach((p, i) => {
              const icon = L.divIcon({ html: pinSVG(colores[i % colores.length], p.emoji), className: '', iconSize: [32, 36], iconAnchor: [16, 36] });
              L.marker([p.lat, p.lng], { icon }).addTo(mapa).bindPopup(`<strong>${p.t}</strong>`);
            });
          });
          return contenedor;
        })(),
        codigo: `L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
  { attribution: '© Carto', maxZoom: 18 },
).addTo(mapa);

// Pins en colores neón sobre fondo oscuro
const COLORES_NEON = ['#22d3ee', '#a78bfa', '#f472b6'];`,
      })],
    }),

    // ============== 12. SCROLL ZOOM + FULLSCREEN ==============
    Seccion({
      titulo: '12 · Scroll-zoom + botón fullscreen',
      descripcion: 'Por defecto desactivamos el scroll-zoom para que la página pueda scrollear pasando por encima. Para mapas grandes (página dedicada, drilling) puedes habilitarlo + fullscreen para inmersión.',
      hijos: [VistaCodigo({
        vista: (() => {
          const { contenedor: mapaDiv, listo } = montarMapa({ alto: '380px', centro: [40.4168, -3.7038], zoom: 13, scrollWheelZoom: true });
          listo.then(({ L, mapa }) => {
            L.marker([40.4168, -3.7038]).addTo(mapa).bindPopup('Madrid centro');
          });
          const fsBtn = Boton({
            texto: ['Pantalla completa ', Icono('pantalla_completa', { tamano: 14 })],
            variante: 'ghost',
            onClick: () => {
              if (!document.fullscreenElement) mapaDiv.requestFullscreen?.();
              else document.exitFullscreen?.();
            },
          });
          return wrap(
            crearEl('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' } }, [
              crearEl('div', { style: { fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' } }, ['🖱️ Mueve la rueda sobre el mapa para hacer zoom']),
              fsBtn,
            ]),
            mapaDiv,
          );
        })(),
        codigo: `// scrollWheelZoom: true habilita el zoom con rueda
L.map(div, { scrollWheelZoom: true }).setView(centro, 13);

// Fullscreen del contenedor del mapa
btn.onclick = () => mapaDiv.requestFullscreen();`,
      })],
    }),

    // ========================================================================
    //  RASTREO DE FLOTAS — sección dedicada (5 patrones logísticos completos)
    // ========================================================================

    // ============== 13. FLOTA EN VIVO ==============
    Seccion({
      titulo: '13 · Rastreo de flota en vivo (Lima)',
      descripcion: 'Dashboard logístico con 12 unidades posicionadas y simulación de movimiento cada 3s. Cada bus tiene su estado (en ruta · detenido · mantenimiento · fuera de servicio) reflejado en color y emoji. Panel lateral con KPIs · totales por estado · unidad seleccionada con popup en el mapa.',
      hijos: [VistaCodigo({
        vista: (() => {
          const flota = [
            { id: 'B-101', placa: 'AGT-101', conductor: 'Carlos Mendoza',  ruta: 'Lima → Callao',     estado: 'ruta',     coord: [-12.0464, -77.0428], vel: 42, pasajeros: 28, color: '#3b82f6' },
            { id: 'B-102', placa: 'AGT-102', conductor: 'Lucía Paredes',   ruta: 'Lima → SJL',        estado: 'ruta',     coord: [-12.0220, -77.0140], vel: 38, pasajeros: 32, color: '#3b82f6' },
            { id: 'B-103', placa: 'AGT-103', conductor: 'Diego Ramos',     ruta: 'Lima → Comas',      estado: 'detenido', coord: [-11.9460, -77.0589], vel: 0,  pasajeros: 18, color: '#f59e0b' },
            { id: 'B-104', placa: 'AGT-104', conductor: 'Ana Torres',      ruta: 'Lima → Ate',        estado: 'ruta',     coord: [-12.0260, -76.9418], vel: 51, pasajeros: 41, color: '#3b82f6' },
            { id: 'B-105', placa: 'AGT-105', conductor: 'Pablo Soto',      ruta: 'Lima → Surco',      estado: 'mantenimiento', coord: [-12.1390, -77.0090], vel: 0, pasajeros: 0, color: '#94a3b8' },
            { id: 'B-106', placa: 'AGT-106', conductor: 'María Quispe',    ruta: 'Lima → VES',        estado: 'ruta',     coord: [-12.2169, -76.9335], vel: 45, pasajeros: 36, color: '#3b82f6' },
            { id: 'B-107', placa: 'AGT-107', conductor: 'Jorge Huamán',    ruta: 'Lima → Independencia', estado: 'ruta',  coord: [-12.0014, -77.0589], vel: 33, pasajeros: 22, color: '#3b82f6' },
            { id: 'B-108', placa: 'AGT-108', conductor: 'Rosa Cárdenas',   ruta: 'Lima → Chorrillos', estado: 'ruta',     coord: [-12.1830, -77.0150], vel: 48, pasajeros: 30, color: '#3b82f6' },
            { id: 'B-109', placa: 'AGT-109', conductor: 'Luis Vega',       ruta: 'Lima → Miraflores', estado: 'detenido', coord: [-12.1213, -77.0298], vel: 0,  pasajeros: 12, color: '#f59e0b' },
            { id: 'B-110', placa: 'AGT-110', conductor: 'Patricia León',   ruta: 'Lima → Magdalena',  estado: 'ruta',     coord: [-12.0900, -77.0700], vel: 36, pasajeros: 24, color: '#3b82f6' },
            { id: 'B-111', placa: 'AGT-111', conductor: 'Sandra Pérez',    ruta: 'Lima → La Molina',  estado: 'ruta',     coord: [-12.0790, -76.9420], vel: 52, pasajeros: 27, color: '#3b82f6' },
            { id: 'B-112', placa: 'AGT-112', conductor: 'Raúl Castillo',   ruta: 'Lima → SMP',        estado: 'fuera',    coord: [-11.9710, -77.0860], vel: 0,  pasajeros: 0, color: '#ef4444' },
          ];
          const seleccion = senal('B-101');

          const { contenedor: mapaDiv, listo } = montarMapa({ alto: '500px', centro: [-12.0464, -77.0428], zoom: 11 });
          const markersById = new Map();

          listo.then(({ L, mapa }) => {
            flota.forEach((b) => {
              const emoji = b.estado === 'mantenimiento' ? '🔧' : b.estado === 'fuera' ? '⛔' : b.estado === 'detenido' ? '⏸️' : '🚌';
              const icon = L.divIcon({ html: pinSVG(b.color, emoji), className: '', iconSize: [32, 36], iconAnchor: [16, 36], popupAnchor: [0, -36] });
              const m = L.marker(b.coord, { icon }).addTo(mapa).bindPopup(`
                <div style="min-width: 220px; font-family: inherit;">
                  <div style="font-size: 11px; color: #6b7280; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase;">UNIDAD ${b.id} · ${b.placa}</div>
                  <div style="font-weight: 700; margin: 4px 0 2px; font-size: 14px;">${b.conductor}</div>
                  <div style="font-size: 12px; color: #4b5563; margin-bottom: 8px;">${b.ruta}</div>
                  <div style="display: flex; gap: 12px; padding-top: 8px; border-top: 1px solid #e5e7eb; font-size: 12px;">
                    <div><strong>${b.vel}</strong> km/h</div>
                    <div><strong>${b.pasajeros}</strong> pasajeros</div>
                  </div>
                </div>
              `);
              markersById.set(b.id, m);
            });

            // Simulación: cada 3s mover los que están en ruta (~50m) — sólo para demo visual
            const tick = () => {
              flota.forEach((b) => {
                if (b.estado !== 'ruta') return;
                b.coord = [b.coord[0] + (Math.random() - 0.5) * 0.002, b.coord[1] + (Math.random() - 0.5) * 0.002];
                markersById.get(b.id)?.setLatLng(b.coord);
              });
            };
            const intervalo = setInterval(tick, 3000);
            // Limpieza si el contenedor sale del DOM
            const obs = new MutationObserver(() => {
              if (!mapaDiv.isConnected) { clearInterval(intervalo); obs.disconnect(); }
            });
            requestAnimationFrame(() => mapaDiv.parentNode && obs.observe(mapaDiv.parentNode, { childList: true, subtree: true }));
          });

          // Reactividad: abrir popup del seleccionado
          efecto(() => {
            const m = markersById.get(seleccion.value);
            if (m) m.openPopup();
          });

          // KPIs
          const totales = {
            ruta:           flota.filter((b) => b.estado === 'ruta').length,
            detenido:       flota.filter((b) => b.estado === 'detenido').length,
            mantenimiento:  flota.filter((b) => b.estado === 'mantenimiento').length,
            fuera:          flota.filter((b) => b.estado === 'fuera').length,
            totalPasajeros: flota.reduce((acc, b) => acc + b.pasajeros, 0),
            promedioVel:    Math.round(flota.filter((b) => b.estado === 'ruta').reduce((acc, b) => acc + b.vel, 0) / Math.max(1, flota.filter((b) => b.estado === 'ruta').length)),
          };

          const kpis = crearEl('div', {
            style: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px' },
          }, [
            ['🚌 En ruta',     String(totales.ruta),          '#3b82f6'],
            ['⏸️ Detenidos',    String(totales.detenido),      '#f59e0b'],
            ['🔧 Mantenim.',   String(totales.mantenimiento), '#94a3b8'],
            ['⛔ Fuera',        String(totales.fuera),         '#ef4444'],
            ['👥 Pasajeros',   String(totales.totalPasajeros), '#10b981'],
            ['⚡ Vel. media',   `${totales.promedioVel} km/h`, '#8b5cf6'],
          ].map(([t, v, c]) => crearEl('div', {
            style: { padding: '10px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', borderTop: `2px solid ${c}` },
          }, [
            crearEl('div', { style: { fontSize: '11px', color: 'var(--muted-foreground)', fontWeight: 600 } }, [t]),
            crearEl('div', { style: { fontSize: 'var(--text-lg)', fontWeight: 800, lineHeight: 1.2, color: c } }, [v]),
          ])));

          // Lista de unidades
          const lista = crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '320px', overflow: 'auto', paddingInlineEnd: '4px' } });
          flota.forEach((b) => {
            const item = crearEl('button', {
              style: {
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '8px 10px', textAlign: 'start',
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', cursor: 'pointer',
                transition: 'all 160ms ease',
              },
              onClick: () => { seleccion.value = b.id; },
            }, [
              crearEl('span', { style: { width: '28px', height: '28px', borderRadius: '50%', background: b.color, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, flexShrink: 0 } },
                [b.estado === 'ruta' ? '🚌' : b.estado === 'detenido' ? '⏸' : b.estado === 'mantenimiento' ? '🔧' : '⛔']),
              crearEl('div', { style: { flex: 1, minWidth: 0 } }, [
                crearEl('div', { style: { fontSize: 'var(--text-xs)', fontWeight: 700, display: 'flex', justifyContent: 'space-between', gap: '6px' } }, [
                  crearEl('span', null, [b.id, ' · ', b.placa]),
                  crearEl('span', { style: { color: 'var(--muted-foreground)' } }, [b.vel ? `${b.vel} km/h` : '0']),
                ]),
                crearEl('div', { style: { fontSize: '11px', color: 'var(--muted-foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, [b.ruta]),
              ]),
            ]);
            efecto(() => {
              const activo = seleccion.value === b.id;
              item.style.borderColor = activo ? b.color : 'var(--border)';
              item.style.background = activo ? `color-mix(in srgb, ${b.color} 10%, var(--surface))` : 'var(--surface)';
              item.style.boxShadow = activo ? `0 0 0 3px color-mix(in srgb, ${b.color} 18%, transparent)` : 'none';
            });
            lista.appendChild(item);
          });

          const panel = crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [kpis, lista]);

          return crearEl('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' } }, [mapaDiv, panel]);
        })(),
        codigo: `// Cada unidad tiene un marker que se actualiza con setLatLng()
const markersById = new Map();
flota.forEach(b => {
  const m = L.marker(b.coord, { icon: pinIcon(b.color, b.emoji) })
    .addTo(mapa).bindPopup(\`...\`);
  markersById.set(b.id, m);
});

// Cada 3s actualizar coordenadas (en producción vendrían de WebSocket / SSE)
setInterval(() => {
  flota.forEach(b => {
    if (b.estado === 'ruta') markersById.get(b.id)?.setLatLng(b.nuevasCoords);
  });
}, 3000);`,
      })],
    }),

    // ============== 14. RUTAS INTERPROVINCIALES ==============
    Seccion({
      titulo: '14 · Rutas interprovinciales (Perú)',
      descripcion: 'Polilíneas largas para rutas reales del Perú: Lima→Trujillo (560 km), Lima→Arequipa (1009 km), Lima→Cusco (1100 km). Cada ruta tiene paraderos intermedios (Chimbote · Ica · Nasca · Abancay) marcados como puntos. Selector arriba para enfocar la ruta seleccionada.',
      hijos: [VistaCodigo({
        vista: (() => {
          const rutas = [
            {
              id: 'lima-tru',
              nombre: 'Lima → Trujillo',
              color: '#3b82f6',
              distancia: '560 km',
              tiempo: '8h 30min',
              precio: 'S/ 75',
              puntos: [
                [-12.0464, -77.0428], [-11.7390, -77.1500], [-11.0937, -77.6320],
                [-10.0530, -78.4400], [-9.0890, -78.5780], [-8.5360, -78.7820], [-8.1116, -79.0289],
              ],
              paraderos: [
                { c: [-11.7390, -77.1500], n: 'Chancay'   },
                { c: [-11.0937, -77.6320], n: 'Huacho'    },
                { c: [-9.0890, -78.5780],  n: 'Chimbote' },
                { c: [-8.5360, -78.7820],  n: 'Trujillo NORTE' },
              ],
            },
            {
              id: 'lima-aqp',
              nombre: 'Lima → Arequipa',
              color: '#10b981',
              distancia: '1009 km',
              tiempo: '15h 45min',
              precio: 'S/ 130',
              puntos: [
                [-12.0464, -77.0428], [-12.5650, -76.6280], [-13.4230, -76.1320],
                [-14.0680, -75.7280], [-14.8350, -74.9370], [-15.4030, -74.5500],
                [-16.4090, -71.5375],
              ],
              paraderos: [
                { c: [-13.4230, -76.1320], n: 'Ica'    },
                { c: [-14.8350, -74.9370], n: 'Nasca' },
                { c: [-15.4030, -74.5500], n: 'Chala' },
              ],
            },
            {
              id: 'lima-cuz',
              nombre: 'Lima → Cusco',
              color: '#f59e0b',
              distancia: '1100 km',
              tiempo: '21h 00min',
              precio: 'S/ 165',
              puntos: [
                [-12.0464, -77.0428], [-12.5650, -76.6280], [-13.4230, -76.1320],
                [-14.0680, -75.7280], [-14.5670, -74.6100], [-13.6360, -72.8810], [-13.5320, -71.9675],
              ],
              paraderos: [
                { c: [-13.4230, -76.1320], n: 'Ica'      },
                { c: [-14.0680, -75.7280], n: 'Pisco'    },
                { c: [-13.6360, -72.8810], n: 'Abancay' },
              ],
            },
          ];

          const sel = senal('lima-tru');

          const { contenedor: mapaDiv, listo } = montarMapa({ alto: '500px', centro: [-12.5, -76.0], zoom: 6 });
          const polylinesById = new Map();
          let mapaRef = null, LRef = null;

          listo.then(({ L, mapa }) => {
            mapaRef = mapa; LRef = L;
            rutas.forEach((r) => {
              const linea = L.polyline(r.puntos, { color: r.color, weight: 4, opacity: 0.85 }).addTo(mapa);
              polylinesById.set(r.id, linea);
              // Origen y fin
              const inicio = L.divIcon({ html: pinSVG(r.color, '🚏'), className: '', iconSize: [32, 36], iconAnchor: [16, 36] });
              L.marker(r.puntos[0], { icon: inicio }).addTo(mapa).bindPopup(`<strong>Origen · ${r.nombre.split(' → ')[0]}</strong>`);
              const fin = L.divIcon({ html: pinSVG(r.color, '🏁'), className: '', iconSize: [32, 36], iconAnchor: [16, 36] });
              L.marker(r.puntos.at(-1), { icon: fin }).addTo(mapa).bindPopup(`<strong>Destino · ${r.nombre.split(' → ')[1]}</strong>`);
              // Paraderos intermedios
              r.paraderos.forEach((p) => {
                L.circleMarker(p.c, { radius: 5, color: r.color, fillColor: '#fff', fillOpacity: 1, weight: 3 })
                  .addTo(mapa).bindPopup(`<strong>${p.n}</strong><br>Parada técnica`);
              });
            });
          });

          efecto(() => {
            const r = rutas.find((x) => x.id === sel.value);
            if (r && mapaRef && LRef) {
              const bounds = LRef.polyline(r.puntos).getBounds();
              mapaRef.flyToBounds(bounds, { padding: [60, 60], duration: 1.4 });
            }
          });

          // Selector de rutas
          const tabs = crearEl('div', {
            style: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
          });
          rutas.forEach((r) => {
            const btn = crearEl('button', {
              style: {
                display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px',
                padding: '12px 14px', minWidth: '180px',
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', cursor: 'pointer', textAlign: 'start',
                transition: 'all 160ms ease',
              },
              onClick: () => { sel.value = r.id; },
            }, [
              crearEl('span', { style: { fontSize: 'var(--text-sm)', fontWeight: 700 } }, [r.nombre]),
              crearEl('span', { style: { fontSize: '11px', color: 'var(--muted-foreground)', display: 'flex', gap: '8px' } }, [
                crearEl('span', null, ['📏 ', r.distancia]),
                crearEl('span', null, ['⏱️ ', r.tiempo]),
                crearEl('span', null, ['💵 ', r.precio]),
              ]),
            ]);
            efecto(() => {
              const activo = sel.value === r.id;
              btn.style.borderColor = activo ? r.color : 'var(--border)';
              btn.style.background = activo ? `color-mix(in srgb, ${r.color} 10%, var(--surface))` : 'var(--surface)';
              btn.style.boxShadow = activo ? `0 0 0 3px color-mix(in srgb, ${r.color} 18%, transparent)` : 'none';
            });
            tabs.appendChild(btn);
          });

          return wrap(tabs, mapaDiv);
        })(),
        codigo: `// Polilíneas largas para rutas interprovinciales
rutas.forEach(r => {
  L.polyline(r.puntos, { color: r.color, weight: 4 }).addTo(mapa);
  // Paraderos como circle markers
  r.paraderos.forEach(p =>
    L.circleMarker(p.c, { radius: 5, color: r.color, fillColor: '#fff', weight: 3 })
      .addTo(mapa).bindPopup(p.nombre));
});

// Click en tab → flyToBounds del polyline
mapa.flyToBounds(L.polyline(r.puntos).getBounds(), { padding: [60, 60] });`,
      })],
    }),

    // ============== 15. TIPOS DE RUTA ==============
    Seccion({
      titulo: '15 · Clasificación de rutas — corta · media · larga',
      descripcion: 'Tres mapas comparativos para mostrar visualmente la magnitud de cada tipo de servicio. Cortas (urbanas <50 km · 1h) · Medias (regionales 50-300 km · 1-5h) · Largas (interprovinciales 300+ km · 5h+). Cada una con su color y zoom apropiado.',
      hijos: [VistaCodigo({
        vista: (() => {
          const tipos = [
            {
              titulo: 'Ruta corta · urbana',
              etiqueta: '< 50 km · ~1h',
              color: '#10b981',
              centro: [-12.0900, -77.0300], zoom: 11,
              ruta: [[-12.0464, -77.0428], [-12.0750, -77.0750], [-12.1213, -77.0298], [-12.1390, -77.0090]],
              n: 'Lima Centro → Chorrillos',
            },
            {
              titulo: 'Ruta media · regional',
              etiqueta: '50–300 km · 1–5h',
              color: '#f59e0b',
              centro: [-12.6, -76.6], zoom: 8,
              ruta: [[-12.0464, -77.0428], [-12.5650, -76.6280], [-13.4230, -76.1320]],
              n: 'Lima → Ica',
            },
            {
              titulo: 'Ruta larga · interprovincial',
              etiqueta: '300+ km · 5h+',
              color: '#ef4444',
              centro: [-13.0, -73.5], zoom: 6,
              ruta: [[-12.0464, -77.0428], [-13.4230, -76.1320], [-14.0680, -75.7280], [-13.6360, -72.8810], [-13.5320, -71.9675]],
              n: 'Lima → Cusco',
            },
          ];

          const grid = crearEl('div', {
            style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-3)' },
          });

          tipos.forEach((t) => {
            const cell = crearEl('div', {
              style: {
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderTop: `3px solid ${t.color}`, borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
              },
            }, [
              crearEl('div', { style: { padding: '10px 14px' } }, [
                crearEl('div', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 8px', background: `color-mix(in srgb, ${t.color} 14%, transparent)`, color: t.color, borderRadius: '999px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' } }, [t.etiqueta]),
                crearEl('h4', { style: { margin: '6px 0 2px', fontSize: 'var(--text-base)', fontWeight: 700 } }, [t.titulo]),
                crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [t.n]),
              ]),
            ]);

            const { contenedor, listo } = montarMapa({ alto: '220px', centro: t.centro, zoom: t.zoom });
            listo.then(({ L, mapa }) => {
              L.polyline(t.ruta, { color: t.color, weight: 4, opacity: 0.9 }).addTo(mapa);
              const ic1 = L.divIcon({ html: pinSVG(t.color, '🚏'), className: '', iconSize: [28, 32], iconAnchor: [14, 32] });
              const ic2 = L.divIcon({ html: pinSVG(t.color, '🏁'), className: '', iconSize: [28, 32], iconAnchor: [14, 32] });
              L.marker(t.ruta[0], { icon: ic1 }).addTo(mapa);
              L.marker(t.ruta.at(-1), { icon: ic2 }).addTo(mapa);
            });
            cell.appendChild(contenedor);
            grid.appendChild(cell);
          });
          return grid;
        })(),
        codigo: `// Clasificación de rutas:
// • Corta:  < 50 km · urbana    · zoom 11
// • Media:  50-300 km · regional · zoom 8
// • Larga:  300+ km · interprov. · zoom 6

// Mismo componente con configuración distinta:
tipos.forEach(t => {
  L.polyline(t.ruta, { color: t.color, weight: 4 }).addTo(mapa);
  L.marker(t.ruta[0]).addTo(mapa);
  L.marker(t.ruta.at(-1)).addTo(mapa);
});`,
      })],
    }),

    // ============== 16. INCIDENTES ==============
    Seccion({
      titulo: '16 · Incidentes — bloqueos · accidentes · desvíos',
      descripcion: 'Mapa de incidentes activos en una región, con feed de alertas en tiempo real al lado. Cada tipo de incidente tiene su color y emoji. Click en una alerta del feed → centra el mapa en ese punto y abre el popup. Patrón usado por Waze, Google Maps Traffic, apps de delivery.',
      hijos: [VistaCodigo({
        vista: (() => {
          const incidentes = [
            { id: 'inc-1', tipo: 'accidente',  color: '#ef4444', emoji: '🚑', titulo: 'Accidente con heridos', desc: 'Av. Javier Prado · 2 vehículos involucrados', hace: 'hace 8 min',  coord: [-12.0900, -77.0050], severidad: 'alta' },
            { id: 'inc-2', tipo: 'bloqueo',    color: '#f59e0b', emoji: '🚧', titulo: 'Vía bloqueada',         desc: 'Av. Tacna · manifestación en curso',         hace: 'hace 22 min', coord: [-12.0464, -77.0345], severidad: 'media' },
            { id: 'inc-3', tipo: 'desvio',     color: '#8b5cf6', emoji: '↩️', titulo: 'Desvío temporal',       desc: 'Av. Brasil · obras hasta el lunes',          hace: 'hace 1h',     coord: [-12.0750, -77.0510], severidad: 'baja' },
            { id: 'inc-4', tipo: 'congestion', color: '#06b6d4', emoji: '🚗', titulo: 'Tráfico denso',         desc: 'Vía Expresa · velocidad 12 km/h',            hace: 'hace 2 min',  coord: [-12.0950, -77.0250], severidad: 'media' },
            { id: 'inc-5', tipo: 'accidente',  color: '#ef4444', emoji: '🚑', titulo: 'Volcadura camión',      desc: 'Carretera Central km 18 · sentido este',     hace: 'hace 18 min', coord: [-12.0190, -76.9700], severidad: 'alta' },
            { id: 'inc-6', tipo: 'bloqueo',    color: '#f59e0b', emoji: '🚧', titulo: 'Pista cerrada',         desc: 'Av. Universitaria · tramo 800m',             hace: 'hace 4h',     coord: [-12.0240, -77.0850], severidad: 'media' },
          ];
          const seleccion = senal(null);

          const { contenedor: mapaDiv, listo } = montarMapa({
            alto: '480px', centro: [-12.0560, -77.0400], zoom: 12,
            tileUrl: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
            tileOpts: { attribution: '© Carto · OSM', maxZoom: 19 },
          });
          const markers = new Map();
          let mapaRef = null;

          listo.then(({ L, mapa }) => {
            mapaRef = mapa;
            incidentes.forEach((inc) => {
              const icon = L.divIcon({ html: pinSVG(inc.color, inc.emoji), className: '', iconSize: [36, 40], iconAnchor: [18, 40], popupAnchor: [0, -40] });
              const m = L.marker(inc.coord, { icon }).addTo(mapa).bindPopup(`
                <div style="min-width: 220px; font-family: inherit;">
                  <div style="font-size: 11px; color: ${inc.color}; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase;">${inc.tipo} · ${inc.severidad}</div>
                  <div style="font-weight: 700; margin: 4px 0 2px; font-size: 14px;">${inc.titulo}</div>
                  <div style="font-size: 12px; color: #4b5563;">${inc.desc}</div>
                  <div style="font-size: 11px; color: #9ca3af; margin-top: 6px;">⏱️ ${inc.hace}</div>
                </div>
              `);
              // Halo pulsante para severidad alta
              if (inc.severidad === 'alta') {
                L.circleMarker(inc.coord, { radius: 22, color: inc.color, fillColor: inc.color, fillOpacity: 0.12, weight: 0, className: 'incidente-pulso' }).addTo(mapa);
              }
              markers.set(inc.id, m);
            });
          });

          efecto(() => {
            if (!seleccion.value || !mapaRef) return;
            const inc = incidentes.find((x) => x.id === seleccion.value);
            if (inc) {
              mapaRef.flyTo(inc.coord, 14, { duration: 1.2 });
              setTimeout(() => markers.get(inc.id)?.openPopup(), 600);
            }
          });

          // Feed lateral
          const feed = crearEl('div', {
            style: { display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '480px', overflow: 'auto', paddingInlineEnd: '4px' },
          }, [
            crearEl('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', paddingBlockEnd: '8px', borderBlockEnd: '1px solid var(--border)', marginBlockEnd: '6px' } }, [
              crearEl('div', { style: { fontSize: 'var(--text-xs)', fontWeight: 800, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' } }, ['🚨 ', incidentes.length, ' alertas activas']),
              crearEl('span', { style: { display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 800, color: '#ef4444', padding: '2px 6px', background: 'color-mix(in srgb, #ef4444 14%, transparent)', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.04em' } }, ['● en vivo']),
            ]),
            ...incidentes.map((inc) => {
              const item = crearEl('button', {
                style: {
                  display: 'flex', alignItems: 'flex-start', gap: '10px',
                  padding: '10px', textAlign: 'start',
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderInlineStart: `3px solid ${inc.color}`,
                  borderRadius: 'var(--radius)', cursor: 'pointer',
                  transition: 'all 160ms ease',
                },
                onClick: () => { seleccion.value = inc.id; },
              }, [
                crearEl('span', { style: { fontSize: '20px', flexShrink: 0 } }, [inc.emoji]),
                crearEl('div', { style: { flex: 1, minWidth: 0 } }, [
                  crearEl('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' } }, [
                    crearEl('span', { style: { fontSize: 'var(--text-sm)', fontWeight: 700 } }, [inc.titulo]),
                    crearEl('span', { style: { fontSize: '10px', color: inc.color, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' } }, [inc.severidad]),
                  ]),
                  crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBlockStart: '2px' } }, [inc.desc]),
                  crearEl('div', { style: { fontSize: '11px', color: 'var(--muted-foreground)', marginBlockStart: '4px' } }, ['⏱️ ', inc.hace]),
                ]),
              ]);
              efecto(() => {
                const activo = seleccion.value === inc.id;
                item.style.background = activo ? `color-mix(in srgb, ${inc.color} 10%, var(--surface))` : 'var(--surface)';
                item.style.boxShadow = activo ? `0 0 0 3px color-mix(in srgb, ${inc.color} 18%, transparent)` : 'none';
              });
              return item;
            }),
          ]);

          return crearEl('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' } }, [mapaDiv, feed]);
        })(),
        codigo: `// Cada incidente tiene su color/emoji por tipo
const TIPOS = {
  accidente:  { color: '#ef4444', emoji: '🚑' },
  bloqueo:    { color: '#f59e0b', emoji: '🚧' },
  desvio:     { color: '#8b5cf6', emoji: '↩️' },
  congestion: { color: '#06b6d4', emoji: '🚗' },
};

// Severidad alta → halo pulsante
if (inc.severidad === 'alta') {
  L.circleMarker(inc.coord, { radius: 22, color, fillOpacity: 0.12 }).addTo(mapa);
}

// Click en el feed → flyTo + openPopup
seleccion.value = inc.id;
efecto(() => mapa.flyTo(inc.coord, 14));`,
      })],
    }),

    // ============== 17. SEDES GLOBALES (drill-down empresarial) ==============
    Seccion({
      titulo: '17 · Sedes globales — drill-down con clusters',
      descripcion: 'Patrón de "tenemos oficinas en X países" con drill-down jerárquico. Vista mundo: clusters grandes coloreados por tamaño (verde 100+, naranja 25+, amarillo 10+, azul individual). Click en un cluster → zoom suave a la región y desagregación automática. Click en un pin individual → tarjeta de empresa con dirección, teléfono, horario y CTA. ~165 oficinas distribuidas mundialmente.',
      hijos: [VistaCodigo({
        vista: (() => {
          // ----- Generación de ~165 oficinas distribuidas mundialmente -----
          // Cada zona define un centro + un radio + nombres + cantidad
          const NOMBRES = ['Apex', 'Northwind', 'Acme', 'Globex', 'Initech', 'Stark', 'Wayne', 'Vandelay', 'Pied Piper', 'Hooli', 'Wonka', 'Cyberdyne', 'Tyrell', 'Soylent', 'Massive Dynamic', 'Aperture', 'Black Mesa', 'Umbrella', 'Oscorp', 'Rekall'];
          const CALLES = ['Av. Principal', 'Calle Mayor', 'Main St.', 'Park Ave.', 'High St.', 'Market Sq.', 'Broadway', 'Rue de la Paix', 'Königsallee', 'Av. Reforma'];
          const SUFIJOS = ['Inc.', 'Corp.', 'SL', 'GmbH', 'Ltd.', 'SA', 'LLC', 'KK', 'BV', 'AG'];
          let nextId = 1;

          const generarOficinas = (centro, radio, n, ciudad) => {
            const out = [];
            for (let i = 0; i < n; i++) {
              const angle = Math.random() * Math.PI * 2;
              const r = Math.random() * radio;
              const lat = centro[0] + (Math.cos(angle) * r) / 111;
              const lng = centro[1] + (Math.sin(angle) * r) / (111 * Math.cos(centro[0] * Math.PI / 180));
              const nom = NOMBRES[Math.floor(Math.random() * NOMBRES.length)];
              const calle = CALLES[Math.floor(Math.random() * CALLES.length)];
              const sufijo = SUFIJOS[Math.floor(Math.random() * SUFIJOS.length)];
              out.push({
                id: nextId++,
                empresa: `${nom} ${sufijo}`,
                direccion: `${calle} ${100 + Math.floor(Math.random() * 800)}, ${ciudad}`,
                ciudad,
                lat, lng,
                empleados: 5 + Math.floor(Math.random() * 200),
                telefono: '+' + (1 + Math.floor(Math.random() * 99)) + ' ' + Math.floor(Math.random() * 900 + 100) + ' ' + Math.floor(Math.random() * 9000 + 1000),
              });
            }
            return out;
          };

          const oficinas = [
            // Norteamérica
            ...generarOficinas([40.7128, -74.0060], 0.4, 18, 'New York'),
            ...generarOficinas([34.0522, -118.2437], 0.5, 8, 'Los Angeles'),
            ...generarOficinas([41.8781, -87.6298], 0.3, 7, 'Chicago'),
            ...generarOficinas([37.7749, -122.4194], 0.3, 5, 'San Francisco'),
            ...generarOficinas([43.6532, -79.3832], 0.4, 4, 'Toronto'),
            // Europa
            ...generarOficinas([51.5074, -0.1278], 0.3, 18, 'London'),
            ...generarOficinas([48.8566, 2.3522], 0.3, 12, 'Paris'),
            ...generarOficinas([52.5200, 13.4050], 0.3, 10, 'Berlin'),
            ...generarOficinas([40.4168, -3.7038], 0.3, 8, 'Madrid'),
            ...generarOficinas([41.9028, 12.4964], 0.3, 6, 'Roma'),
            ...generarOficinas([52.3676, 4.9041], 0.2, 5, 'Amsterdam'),
            ...generarOficinas([47.3769, 8.5417], 0.2, 4, 'Zürich'),
            ...generarOficinas([55.6761, 12.5683], 0.2, 3, 'Copenhague'),
            ...generarOficinas([59.3293, 18.0686], 0.2, 3, 'Estocolmo'),
            // LatAm
            ...generarOficinas([19.4326, -99.1332], 0.4, 7, 'Ciudad de México'),
            ...generarOficinas([-23.5505, -46.6333], 0.4, 8, 'São Paulo'),
            ...generarOficinas([-34.6037, -58.3816], 0.3, 5, 'Buenos Aires'),
            ...generarOficinas([-12.0464, -77.0428], 0.4, 9, 'Lima'),
            ...generarOficinas([-33.4489, -70.6693], 0.3, 4, 'Santiago de Chile'),
            ...generarOficinas([4.7110, -74.0721], 0.3, 4, 'Bogotá'),
            // Asia
            ...generarOficinas([35.6762, 139.6503], 0.3, 9, 'Tokio'),
            ...generarOficinas([1.3521, 103.8198], 0.2, 5, 'Singapur'),
            ...generarOficinas([22.3193, 114.1694], 0.2, 4, 'Hong Kong'),
            ...generarOficinas([19.0760, 72.8777], 0.4, 5, 'Mumbai'),
            ...generarOficinas([31.2304, 121.4737], 0.3, 4, 'Shanghái'),
            ...generarOficinas([37.5665, 126.9780], 0.2, 3, 'Seúl'),
            // Oceanía
            ...generarOficinas([-33.8688, 151.2093], 0.3, 4, 'Sydney'),
            ...generarOficinas([-37.8136, 144.9631], 0.3, 2, 'Melbourne'),
            // África / Oriente Medio
            ...generarOficinas([-26.2041, 28.0473], 0.3, 4, 'Johannesburgo'),
            ...generarOficinas([-33.9249, 18.4241], 0.3, 3, 'Ciudad del Cabo'),
            ...generarOficinas([30.0444, 31.2357], 0.3, 2, 'El Cairo'),
            ...generarOficinas([25.2048, 55.2708], 0.2, 3, 'Dubái'),
          ];

          const conteo = senal({ ciudad: null });

          // Estilo para popups custom (inline para no tocar main.css)
          const estilosPopup = `
            .leaflet-popup-content-wrapper.popup-sede {
              background: #1f2937; color: #fff;
              border-radius: 10px; padding: 0;
              box-shadow: 0 18px 40px -12px rgba(0,0,0,0.45);
            }
            .leaflet-popup-content-wrapper.popup-sede .leaflet-popup-content {
              margin: 14px 16px; font-family: inherit;
            }
            .leaflet-popup-tip-container .leaflet-popup-tip { background: #1f2937; }
            .leaflet-popup-close-button { color: #9ca3af !important; padding: 6px 8px !important; }
            .leaflet-popup-close-button:hover { color: #fff !important; }
            .cluster-sede {
              display: flex; align-items: center; justify-content: center;
              border-radius: 50%; color: #fff; font-weight: 800;
              font-family: inherit;
              border: 4px solid rgba(255,255,255,0.85);
              box-shadow: 0 4px 14px rgba(0,0,0,0.18);
            }
          `;
          if (!document.getElementById('leaflet-sedes-styles')) {
            const styleEl = crearEl('style', { id: 'leaflet-sedes-styles' });
            styleEl.textContent = estilosPopup;
            document.head.appendChild(styleEl);
          }

          const { contenedor: mapaDiv, listo } = montarMapa({
            alto: '540px',
            centro: [25, 10], zoom: 2,
            tileUrl: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
            tileOpts: { attribution: '© Carto · OSM', maxZoom: 19, minZoom: 2 },
          });

          listo.then(async ({ mapa }) => {
            const L = await cargarMarkerCluster();

            // Cluster con colores por tamaño (verde >=100, naranja >=25, amarillo >=10, azul resto)
            const cluster = L.markerClusterGroup({
              showCoverageOnHover: false,
              spiderfyOnMaxZoom: true,
              chunkedLoading: true,
              maxClusterRadius: 60,
              iconCreateFunction: (c) => {
                const n = c.getChildCount();
                let bg, size;
                if (n >= 100)      { bg = '#10b981'; size = 64; }
                else if (n >= 25)  { bg = '#f97316'; size = 56; }
                else if (n >= 10)  { bg = '#fbbf24'; size = 48; }
                else               { bg = '#3b82f6'; size = 40; }
                return L.divIcon({
                  html: `<div class="cluster-sede" style="width:${size}px; height:${size}px; background:${bg}; font-size:${n >= 100 ? 17 : 15}px;">${n}</div>`,
                  className: '',
                  iconSize: [size, size],
                });
              },
            });

            // Pin individual estilo Google Maps (azul corporativo)
            const pinSede = L.divIcon({
              html: `
                <svg width="28" height="36" viewBox="0 0 28 36" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 0C6.27 0 0 6.27 0 14c0 9.5 14 22 14 22s14-12.5 14-22c0-7.73-6.27-14-14-14z" fill="#1d4ed8"/>
                  <circle cx="14" cy="13" r="5" fill="#fff"/>
                </svg>
              `,
              className: '',
              iconSize: [28, 36],
              iconAnchor: [14, 36],
              popupAnchor: [0, -32],
            });

            oficinas.forEach((o) => {
              const popupHTML = `
                <div style="min-width: 220px;">
                  <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                    <span style="display:inline-flex; width:28px; height:28px; border-radius:6px; background:#1d4ed8; color:#fff; align-items:center; justify-content:center; font-weight:800; font-size:12px;">${o.empresa.slice(0, 2).toUpperCase()}</span>
                    <strong style="font-size:14px; line-height:1.2;">${o.empresa}</strong>
                  </div>
                  <div style="font-size:12.5px; color:#cbd5e1; line-height:1.45;">${o.direccion}</div>
                  <div style="display:flex; gap:10px; margin-top:10px; padding-top:10px; border-top:1px solid rgba(255,255,255,0.08); font-size:11.5px; color:#94a3b8;">
                    <span>👥 ${o.empleados} emp.</span>
                    <span>📞 ${o.telefono}</span>
                  </div>
                </div>
              `;
              const m = L.marker([o.lat, o.lng], { icon: pinSede });
              m.bindPopup(popupHTML, { className: 'popup-sede', maxWidth: 280 });
              cluster.addLayer(m);
            });

            mapa.addLayer(cluster);

            // Botones de "vuelo rápido" a una región
            const regiones = [
              { id: 'mundo',   t: '🌍 Mundo',     coord: [25, 10],         z: 2  },
              { id: 'norteam', t: '🇺🇸 Norteamérica', coord: [40, -95],   z: 4  },
              { id: 'europa',  t: '🇪🇺 Europa',     coord: [50, 10],       z: 4  },
              { id: 'latam',   t: '🌎 LatAm',      coord: [-15, -60],      z: 3  },
              { id: 'asia',    t: '🌏 Asia',       coord: [25, 110],       z: 3  },
              { id: 'oceania', t: '🇦🇺 Oceanía',   coord: [-30, 145],     z: 4  },
              { id: 'africa',  t: '🌍 África',     coord: [0, 25],         z: 3  },
            ];

            const barra = mapaDiv.parentElement?.querySelector('.barra-regiones');
            barra?.querySelectorAll('button').forEach((btn, idx) => {
              btn.addEventListener('click', () => {
                const r = regiones[idx];
                mapa.flyTo(r.coord, r.z, { duration: 1.6 });
              });
            });

            requestAnimationFrame(() => mapa.invalidateSize());
          });

          // Barra superior con regiones + total
          const total = oficinas.length;
          const totalPais = {
            'Norteamérica': oficinas.filter((o) => ['New York', 'Los Angeles', 'Chicago', 'San Francisco', 'Toronto'].includes(o.ciudad)).length,
            'Europa':       oficinas.filter((o) => ['London', 'Paris', 'Berlin', 'Madrid', 'Roma', 'Amsterdam', 'Zürich', 'Copenhague', 'Estocolmo'].includes(o.ciudad)).length,
            'LatAm':        oficinas.filter((o) => ['Ciudad de México', 'São Paulo', 'Buenos Aires', 'Lima', 'Santiago de Chile', 'Bogotá'].includes(o.ciudad)).length,
            'Asia':         oficinas.filter((o) => ['Tokio', 'Singapur', 'Hong Kong', 'Mumbai', 'Shanghái', 'Seúl'].includes(o.ciudad)).length,
            'Oceanía':      oficinas.filter((o) => ['Sydney', 'Melbourne'].includes(o.ciudad)).length,
            'África/MO':    oficinas.filter((o) => ['Johannesburgo', 'Ciudad del Cabo', 'El Cairo', 'Dubái'].includes(o.ciudad)).length,
          };

          const barraRegiones = crearEl('div', {
            class: 'barra-regiones',
            style: {
              display: 'flex', flexWrap: 'wrap', gap: '6px',
              padding: 'var(--space-3)',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              alignItems: 'center', justifyContent: 'space-between',
            },
          }, [
            crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } }, [
              crearEl('div', null, [
                crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' } }, ['SEDES GLOBALES']),
                crearEl('div', { style: { fontSize: 'var(--text-xl)', fontWeight: 800 } }, [total, ' oficinas en ', Object.values(totalPais).filter(Boolean).length, ' regiones']),
              ]),
            ]),
            crearEl('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '4px' } },
              [
                ['🌍 Mundo'],
                ['🇺🇸 Norteamérica'],
                ['🇪🇺 Europa'],
                ['🌎 LatAm'],
                ['🌏 Asia'],
                ['🇦🇺 Oceanía'],
                ['🌍 África'],
              ].map(([t]) => crearEl('button', {
                style: {
                  padding: '6px 10px',
                  background: 'var(--background)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)', cursor: 'pointer',
                  fontSize: 'var(--text-xs)', fontWeight: 600,
                  color: 'var(--foreground)',
                },
              }, [t])),
            ),
          ]);

          // Leyenda de cluster colors
          const leyenda = crearEl('div', {
            style: {
              display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)',
              padding: '10px var(--space-3)',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-xs)',
              alignItems: 'center',
            },
          }, [
            crearEl('span', { style: { fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' } }, ['Leyenda:']),
            ...[
              ['#10b981', '100+ oficinas'],
              ['#f97316', '25–99'],
              ['#fbbf24', '10–24'],
              ['#3b82f6', '1–9'],
            ].map(([color, t]) => crearEl('span', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px' } }, [
              crearEl('span', { style: { width: '14px', height: '14px', borderRadius: '50%', background: color, border: '2px solid rgba(255,255,255,0.85)', boxShadow: '0 2px 4px rgba(0,0,0,0.15)' } }),
              t,
            ])),
          ]);

          return wrap(barraRegiones, mapaDiv, leyenda);
        })(),
        codigo: `// Drill-down empresarial: cluster con colores por tamaño + popup card
const cluster = L.markerClusterGroup({
  iconCreateFunction: (c) => {
    const n = c.getChildCount();
    const bg = n >= 100 ? '#10b981'      // verde
             : n >= 25  ? '#f97316'      // naranja
             : n >= 10  ? '#fbbf24'      // amarillo
             :            '#3b82f6';     // azul
    return L.divIcon({
      html: \`<div class="cluster-sede" style="background:\${bg}">\${n}</div>\`,
      iconSize: [size, size],
    });
  },
});

oficinas.forEach(o => {
  const m = L.marker([o.lat, o.lng], { icon: pinSede });
  m.bindPopup(\`
    <strong>\${o.empresa}</strong>
    <div>\${o.direccion}</div>
    <div>👥 \${o.empleados} · 📞 \${o.telefono}</div>
  \`, { className: 'popup-sede' });
  cluster.addLayer(m);
});

mapa.addLayer(cluster);

// Vuelo rápido a una región
mapa.flyTo([50, 10], 4, { duration: 1.6 });`,
      })],
    }),

    // ============== 18. VISTA MÓVIL ==============
    Seccion({
      titulo: '18 · Vista móvil — bottom sheet con mapa',
      descripcion: 'Mockup del mismo dashboard pero en móvil: mapa a pantalla completa + sheet inferior con la lista expandible. Patrón usado por Uber, Cabify, InDriver, Waze. Click en una unidad de la lista hace `flyTo` y los KPIs siguen visibles en la parte superior.',
      hijos: [VistaCodigo({
        vista: (() => {
          const buses = [
            { id: 'B-201', estado: 'ruta',     placa: 'AGT-201', conductor: 'C. Mendoza',  vel: 42, color: '#3b82f6', coord: [-12.0464, -77.0428] },
            { id: 'B-202', estado: 'ruta',     placa: 'AGT-202', conductor: 'L. Paredes',  vel: 38, color: '#3b82f6', coord: [-12.0220, -77.0140] },
            { id: 'B-203', estado: 'detenido', placa: 'AGT-203', conductor: 'D. Ramos',    vel: 0,  color: '#f59e0b', coord: [-11.9460, -77.0589] },
            { id: 'B-204', estado: 'ruta',     placa: 'AGT-204', conductor: 'A. Torres',   vel: 51, color: '#3b82f6', coord: [-12.0260, -76.9418] },
            { id: 'B-205', estado: 'ruta',     placa: 'AGT-205', conductor: 'M. Quispe',   vel: 45, color: '#3b82f6', coord: [-12.2169, -76.9335] },
          ];
          const sel = senal('B-201');

          // Mapa: lo creamos primero (con altura explícita en px, no %, para que
          // Leaflet inicialice con dimensiones correctas)
          const mapaWrapper = crearEl('div', {
            style: {
              position: 'absolute', inset: 0,
              borderRadius: '24px', overflow: 'hidden',
              zIndex: 0,
            },
          });
          const { contenedor: mapaDiv, listo } = montarMapa({
            alto: '100%', centro: [-12.05, -77.02], zoom: 12,
            tileUrl: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
            tileOpts: { attribution: '© Carto', maxZoom: 19 },
          });
          mapaDiv.style.borderRadius = '0';
          mapaDiv.style.border = '0';
          mapaDiv.style.height = '100%';
          mapaWrapper.appendChild(mapaDiv);

          const mks = new Map();
          let mapaRef = null;
          listo.then(({ L, mapa }) => {
            mapaRef = mapa;
            buses.forEach((b) => {
              const ic = L.divIcon({ html: pinSVG(b.color, '🚌'), className: '', iconSize: [30, 34], iconAnchor: [15, 34] });
              mks.set(b.id, L.marker(b.coord, { icon: ic }).addTo(mapa).bindPopup(`<strong>${b.id}</strong> · ${b.conductor}`));
            });
            requestAnimationFrame(() => mapa.invalidateSize());
            setTimeout(() => mapa.invalidateSize(), 300);
          });

          efecto(() => {
            const b = buses.find((x) => x.id === sel.value);
            if (b && mapaRef) {
              mapaRef.flyTo(b.coord, 14, { duration: 1.2 });
              setTimeout(() => mks.get(b.id)?.openPopup(), 500);
            }
          });

          // Topbar (encima del mapa — z-index alto que supera las leaflet panes)
          const topbar = crearEl('div', {
            style: {
              position: 'absolute', insetInline: 0, insetBlockStart: 0,
              padding: '40px 16px 10px',
              background: 'rgba(255, 255, 255, 0.94)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              borderBlockEnd: '1px solid rgba(0,0,0,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: '8px',
              zIndex: 1000,
              color: '#0f172a',
            },
          }, [
            crearEl('div', null, [
              crearEl('div', { style: { fontSize: '10px', color: '#6b7280', fontWeight: 700, letterSpacing: '0.06em' } }, ['FLOTA · LIMA']),
              crearEl('div', { style: { fontSize: '14px', fontWeight: 800, marginBlockStart: '2px' } }, ['12 unidades activas']),
            ]),
            crearEl('span', { style: { display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', background: '#10b981', color: '#fff', borderRadius: '999px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' } }, ['● live']),
          ]);

          // Notch
          const notch = crearEl('div', {
            style: {
              position: 'absolute',
              insetInlineStart: '50%', insetBlockStart: '10px',
              transform: 'translateX(-50%)',
              width: '90px', height: '22px',
              background: '#000',
              borderRadius: '999px',
              zIndex: 2000,
              pointerEvents: 'none',
            },
          });

          // Bottom sheet
          const sheet = crearEl('div', {
            style: {
              position: 'absolute', insetInline: 0, insetBlockEnd: 0,
              height: '54%',
              background: 'var(--background)',
              borderRadius: '20px 20px 0 0',
              boxShadow: '0 -12px 40px -10px rgba(0,0,0,0.35)',
              display: 'flex', flexDirection: 'column',
              zIndex: 1500,
              overflow: 'hidden',
              borderBlockStart: '1px solid var(--border)',
            },
          });
          sheet.appendChild(crearEl('div', {
            style: {
              width: '40px', height: '4px',
              background: 'var(--border)',
              borderRadius: '999px',
              margin: '8px auto 4px',
              flexShrink: 0,
            },
          }));
          sheet.appendChild(crearEl('div', {
            style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', padding: '4px 14px 10px', borderBlockEnd: '1px solid var(--border)', flexShrink: 0 },
          }, [
            ['9', 'En ruta', '#3b82f6'],
            ['2', 'Detenidos', '#f59e0b'],
            ['1', 'Mantenim.', '#94a3b8'],
          ].map(([v, l, c]) => crearEl('div', { style: { padding: '6px 8px', background: 'var(--surface)', borderRadius: 'var(--radius)', textAlign: 'center', border: '1px solid var(--border)' } }, [
            crearEl('div', { style: { fontSize: '17px', fontWeight: 800, color: c, lineHeight: 1.1 } }, [v]),
            crearEl('div', { style: { fontSize: '10px', color: 'var(--muted-foreground)', marginBlockStart: '2px' } }, [l]),
          ]))));
          const listaSheet = crearEl('div', {
            style: { flex: 1, minHeight: 0, overflow: 'auto', padding: '8px 12px 12px', display: 'flex', flexDirection: 'column', gap: '6px' },
          });
          buses.forEach((b) => {
            const item = crearEl('button', {
              style: {
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '8px 10px',
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', cursor: 'pointer', textAlign: 'start',
                transition: 'all 160ms ease', flexShrink: 0,
              },
              onClick: () => { sel.value = b.id; },
            }, [
              crearEl('span', {
                style: { width: '32px', height: '32px', borderRadius: '50%', background: b.color, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 },
              }, [b.estado === 'ruta' ? '🚌' : '⏸']),
              crearEl('div', { style: { flex: 1, minWidth: 0 } }, [
                crearEl('div', { style: { display: 'flex', justifyContent: 'space-between', gap: '8px' } }, [
                  crearEl('span', { style: { fontSize: '12px', fontWeight: 800 } }, [b.id]),
                  crearEl('span', { style: { fontSize: '11px', fontWeight: 700, color: b.estado === 'ruta' ? '#10b981' : '#f59e0b' } }, [b.vel ? `${b.vel} km/h` : 'parado']),
                ]),
                crearEl('div', { style: { fontSize: '10px', color: 'var(--muted-foreground)' } }, [b.placa, ' · ', b.conductor]),
              ]),
              Icono('chevron_r', { tamano: 12 }),
            ]);
            efecto(() => {
              const activo = sel.value === b.id;
              item.style.borderColor = activo ? b.color : 'var(--border)';
              item.style.background = activo ? `color-mix(in srgb, ${b.color} 10%, var(--surface))` : 'var(--surface)';
            });
            listaSheet.appendChild(item);
          });
          sheet.appendChild(listaSheet);

          // Pantalla = container relativo con todos los hijos absolutos
          const pantalla = crearEl('div', {
            style: {
              position: 'relative',
              width: '100%', height: '100%',
              borderRadius: '24px',
              overflow: 'hidden',
              background: 'var(--surface-muted)',
              isolation: 'isolate',
            },
          }, [mapaWrapper, topbar, sheet, notch]);

          // Frame del teléfono — usamos box-sizing: border-box para que el padding
          // no infle la altura
          const frame = crearEl('div', {
            style: {
              position: 'relative',
              width: '380px', maxWidth: '100%',
              height: '700px',
              margin: '0 auto',
              background: '#000',
              borderRadius: '36px',
              padding: '10px',
              boxSizing: 'border-box',
              boxShadow: '0 30px 60px -20px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,0,0,0.05)',
              overflow: 'hidden',
            },
          }, [pantalla]);

          return frame;
        })(),
        codigo: `// Vista móvil = mapa fullscreen + bottom sheet
<div class="mobile-frame">
  <div class="topbar">{12 unidades · live}</div>
  <Mapa fullscreen tileLayer="carto-voyager" />
  <BottomSheet>
    <KPIs />
    <ListaBuses onClick={b => sel.value = b.id} />
  </BottomSheet>
</div>

// Click en lista → mapa.flyTo + openPopup`,
      })],
    }),

  ],
});
