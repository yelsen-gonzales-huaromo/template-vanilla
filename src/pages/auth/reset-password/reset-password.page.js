/**
 * /restablecer-contrasena (legacy) — delega en el formulario compartido.
 */
import { FormularioRestablecer } from '../../../components/auth/auth-forms.js';
import { aplicarPreset } from '../../../components/auth/auth-presets.js';

export default async (ctx) => {
  const { decoracion, lead } = aplicarPreset(ctx);
  return FormularioRestablecer({ token: ctx?.query?.token, decoracion, lead });
};
