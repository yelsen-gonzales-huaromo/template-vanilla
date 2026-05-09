/**
 * Página compartida — pantalla "Has cerrado sesión".
 */
import { PantallaSalir } from '../../../components/auth/auth-screens.js';
import { aplicarPreset } from '../../../components/auth/auth-presets.js';

export default async (ctx) => {
  const { decoracion } = aplicarPreset(ctx);
  return PantallaSalir({ decoracion });
};
