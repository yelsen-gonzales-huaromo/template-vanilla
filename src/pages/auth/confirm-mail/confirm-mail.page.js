/**
 * /confirmar-correo (legacy) — delega en la pantalla compartida.
 */
import { PantallaConfirmar } from '../../../components/auth/auth-screens.js';
import { aplicarPreset } from '../../../components/auth/auth-presets.js';

export default async (ctx) => {
  const { decoracion } = aplicarPreset(ctx);
  return PantallaConfirmar({ correo: ctx?.query?.email, decoracion });
};
