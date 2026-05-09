/**
 * Página compartida — formulario de registro. Reutilizada por simple/card/split.
 */
import { FormularioRegistrar } from '../../../components/auth/auth-forms.js';
import { aplicarPreset } from '../../../components/auth/auth-presets.js';

export default async (ctx) => {
  const { decoracion, lead, compacto, socialesEstilo, pistaAbajo } = aplicarPreset(ctx);
  return FormularioRegistrar({ decoracion, lead, compacto, socialesEstilo, pistaAbajo });
};
