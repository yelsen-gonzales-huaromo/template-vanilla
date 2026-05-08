import { senal, calculado } from '../utils/helpers/reactive.js';

export const usarPaginacion = ({ total = 0, tamanoPagina = 10, paginaInicial = 1 } = {}) => {
  const pagina = senal(paginaInicial);
  const tamano = senal(tamanoPagina);
  const totalElementos = senal(total);

  const totalPaginas = calculado(() => Math.max(1, Math.ceil(totalElementos.value / tamano.value)));
  const desplazamiento = calculado(() => (pagina.value - 1) * tamano.value);
  const hayProxima = calculado(() => pagina.value < totalPaginas.value);
  const hayPrevia = calculado(() => pagina.value > 1);

  return {
    pagina, tamano, totalElementos, totalPaginas, desplazamiento, hayProxima, hayPrevia,
    siguiente() { if (pagina.value < totalPaginas.value) pagina.value++; },
    anterior()  { if (pagina.value > 1) pagina.value--; },
    irA(p)        { pagina.value = Math.min(Math.max(1, p), totalPaginas.value); },
    cambiarTamano(n) { tamano.value = n; pagina.value = 1; },
    cambiarTotal(n)  { totalElementos.value = n; },
  };
};
