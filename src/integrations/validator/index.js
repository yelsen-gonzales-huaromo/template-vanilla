/**
 * Adaptador para validator.js — validadores de cadenas (email, URL, IBAN, etc.).
 *  https://github.com/validatorjs/validator.js
 *
 * Nuestros `utils/validators/rules.js` cubren los casos básicos. validator.js
 * añade docenas de validadores especializados (creditcard, hexColor, locale, …).
 *
 *   const validator = await cargarValidator();
 *   if (validator.isCreditCard('4111-1111-1111-1111')) { ... }
 *   if (validator.isMobilePhone('+34600123456', 'es-ES')) { ... }
 */
import { cargarLib } from '../_loader.js';

const VERSION = '13.12.0';
const URL_JS = `https://cdn.jsdelivr.net/npm/validator@${VERSION}/validator.min.js`;

export const cargarValidator = () => cargarLib({ scripts: URL_JS, global: 'validator' });
