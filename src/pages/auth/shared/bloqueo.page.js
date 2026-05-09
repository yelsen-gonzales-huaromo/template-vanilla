/**
 * Página compartida — pantalla de bloqueo.
 */
import { FormularioBloqueo } from '../../../components/auth/auth-screens.js';
import { aplicarPreset } from '../../../components/auth/auth-presets.js';

export default async (ctx) => {
  const { decoracion } = aplicarPreset(ctx);
  return FormularioBloqueo({ decoracion });
};
