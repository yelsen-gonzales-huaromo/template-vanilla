/**
 * Página compartida — flujo "olvidé mi contraseña". El preset adapta el visual
 * a la variante (simple/card/split).
 */
import { FormularioRecuperar } from '../../../components/auth/auth-forms.js';
import { aplicarPreset } from '../../../components/auth/auth-presets.js';

export default async (ctx) => {
  const { decoracion, lead } = aplicarPreset(ctx);
  return FormularioRecuperar({ decoracion, lead });
};
