/**
 * Registro de layouts — `montarDiseno(nombre, pagina, raiz)` envuelve el nodo de página
 * en el shell adecuado y lo monta en `raiz`. Los layouts se cargan de forma eager (son pequeños)
 * para que las transiciones de ruta sean ágiles.
 */
import { DisenoTablero } from './dashboard-layout/dashboard-layout.js';
import { DisenoAuth, DisenoAuthSimple, DisenoAuthCard, DisenoAuthSplit } from './auth-layout/auth-layout.js';
import { DisenoVacio } from './blank-layout/blank-layout.js';

const DISENOS = {
  dashboard: DisenoTablero,
  auth: DisenoAuth,
  'auth-simple': DisenoAuthSimple,
  'auth-card':   DisenoAuthCard,
  'auth-split':  DisenoAuthSplit,
  blank: DisenoVacio,
};

export const montarDiseno = (nombre, pagina, raiz) => {
  const Layout = DISENOS[nombre] || DisenoVacio;
  raiz.replaceChildren(Layout(pagina));
};
