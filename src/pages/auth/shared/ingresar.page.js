/**
 * Página compartida — formulario de ingreso. Reutilizada por simple/card/split.
 */
import { FormularioIngresar } from '../../../components/auth/auth-forms.js';
import { aplicarPreset } from '../../../components/auth/auth-presets.js';

export default async (ctx) => {
  const { decoracion, lead, compacto, socialesEstilo, pistaAbajo } = aplicarPreset(ctx);
  return FormularioIngresar({ decoracion, lead, compacto, socialesEstilo, pistaAbajo });
};
