/**
 * Plugins para Leaflet — markercluster (agrupar marcadores) y colorfilter (filtros de color).
 *  https://github.com/Leaflet/Leaflet.markercluster
 *  https://github.com/xtk93x/Leaflet.TileLayer.ColorFilter
 *
 *   await cargarMarkerCluster();
 *   const cluster = L.markerClusterGroup();
 *   cluster.addLayer(L.marker([lat, lng]));
 *   mapa.addLayer(cluster);
 */
import { cargarLib } from '../_loader.js';
import { cargarLeaflet } from '../leaflet/index.js';

const VERSION_CLUSTER = '1.5.3';
const VERSION_FILTER  = '1.2.5';

const URL_CLUSTER_CSS  = `https://cdn.jsdelivr.net/npm/leaflet.markercluster@${VERSION_CLUSTER}/dist/MarkerCluster.css`;
const URL_CLUSTER_DCSS = `https://cdn.jsdelivr.net/npm/leaflet.markercluster@${VERSION_CLUSTER}/dist/MarkerCluster.Default.css`;
const URL_CLUSTER_JS   = `https://cdn.jsdelivr.net/npm/leaflet.markercluster@${VERSION_CLUSTER}/dist/leaflet.markercluster.js`;
const URL_FILTER_JS    = 'https://cdn.jsdelivr.net/gh/xtk93x/Leaflet.TileLayer.ColorFilter@master/src/leaflet-tilelayer-colorfilter.min.js';

export const cargarMarkerCluster = async () => {
  await cargarLeaflet();
  await cargarLib({
    css: [URL_CLUSTER_CSS, URL_CLUSTER_DCSS],
    scripts: URL_CLUSTER_JS,
  });
  return window.L;
};

export const cargarTileColorFilter = async () => {
  await cargarLeaflet();
  await cargarLib({ scripts: URL_FILTER_JS });
  return window.L;
};
