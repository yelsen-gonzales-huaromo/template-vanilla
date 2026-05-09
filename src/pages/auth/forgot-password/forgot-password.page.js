/**
 * /recuperar-contrasena (legacy) — delega en el formulario compartido.
 */
import { FormularioRecuperar } from '../../../components/auth/auth-forms.js';
import { aplicarPreset } from '../../../components/auth/auth-presets.js';

export default async (ctx) => {
  const { decoracion, lead } = aplicarPreset(ctx);
  return FormularioRecuperar({ decoracion, lead });
};
