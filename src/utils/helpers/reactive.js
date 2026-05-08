/**
 * Primitivas mínimas de reactividad — señales + computados + efectos.
 * Ofrecen al JS nativo la misma ergonomía que Vue/Solid sin framework.
 *
 *   const contador = senal(0);
 *   const doble    = calculado(() => contador.value * 2);
 *   efecto(() => render(contador.value));
 *   contador.value = 5; // "doble" se recalcula; el "efecto" se vuelve a ejecutar.
 *
 * Se usan en todo el código — los componentes se suscriben a los stores vía señales
 * y se re-renderizan automáticamente al cambiar el estado, reemplazando el sondeo
 * DOM de jQuery del template antiguo.
 */
let efectoActivo = null;
const pilaEfectos = [];

const rastrear = (suscriptores) => {
  if (efectoActivo) suscriptores.add(efectoActivo);
};

const disparar = (suscriptores) => {
  // Snapshot primero para permitir auto-desuscripción dentro del callback.
  for (const sub of [...suscriptores]) sub();
};

export const senal = (inicial) => {
  let valor = inicial;
  const subs = new Set();
  return {
    get value() { rastrear(subs); return valor; },
    set value(siguiente) {
      if (Object.is(siguiente, valor)) return;
      valor = siguiente;
      disparar(subs);
    },
    peek: () => valor,
    subscribe(fn) {
      const envuelto = () => fn(valor);
      subs.add(envuelto);
      fn(valor);
      return () => subs.delete(envuelto);
    },
  };
};

export const calculado = (fn) => {
  const salida = senal(undefined);
  efecto(() => { salida.value = fn(); });
  return {
    get value() { return salida.value; },
    peek: () => salida.peek(),
    subscribe: salida.subscribe,
  };
};

export const efecto = (fn) => {
  const ejecutar = () => {
    pilaEfectos.push(ejecutar);
    efectoActivo = ejecutar;
    try { fn(); }
    finally {
      pilaEfectos.pop();
      efectoActivo = pilaEfectos[pilaEfectos.length - 1] ?? null;
    }
  };
  ejecutar();
  return ejecutar;
};

/**
 * Proxy reactivo para estado tipo objeto — reactividad por propiedad.
 * Útil para stores; las señales son más simples para valores individuales.
 */
export const reactivo = (objetivo) => {
  const mapaSubs = new Map();
  const obtenerSubs = (clave) => {
    if (!mapaSubs.has(clave)) mapaSubs.set(clave, new Set());
    return mapaSubs.get(clave);
  };

  return new Proxy(objetivo, {
    get(obj, clave) {
      rastrear(obtenerSubs(clave));
      const v = obj[clave];
      return typeof v === 'object' && v !== null ? reactivo(v) : v;
    },
    set(obj, clave, valor) {
      if (Object.is(obj[clave], valor)) return true;
      obj[clave] = valor;
      disparar(obtenerSubs(clave));
      return true;
    },
  });
};
