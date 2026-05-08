/**
 * Página compartida — restablecer contraseña con token (?token=...).
 * Las 3 variantes (simple/card/split) la usan con su layout propio.
 */
import { FormularioRestablecer } from '../../../components/auth/auth-forms.js';

export default async (ctx) => FormularioRestablecer({ token: ctx?.query?.token });
