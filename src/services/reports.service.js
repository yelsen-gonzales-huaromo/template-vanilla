import { clienteHttp } from './http/client.js';

export const resumen = (rango = '30d') =>
  clienteHttp.get('/reports/summary', { params: { range: rango } });

export const listar = (parametros = {}) =>
  clienteHttp.get('/reports', { params: parametros });

export const exportarCsv = async (id) => {
  const blob = await fetch(`${clienteHttp.baseUrl || ''}/reports/${id}/export`, { credentials: 'same-origin' })
    .then(r => r.blob());
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `reporte-${id}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
