/** Generador de identificadores estables y resistentes a colisiones — para ARIA y DOM. */
let contador = 0;
export const idUnico = (prefijo = 'id') => `${prefijo}-${(++contador).toString(36)}-${Date.now().toString(36)}`;
