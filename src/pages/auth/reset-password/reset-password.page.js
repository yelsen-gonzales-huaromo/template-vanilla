import { crearEl } from '../../../utils/helpers/dom.js';
import { Tarjeta } from '../../../components/ui/card/card.js';
import { Campo } from '../../../components/ui/input/input.js';
import { Boton } from '../../../components/ui/button/button.js';
import { CampoFormulario } from '../../../components/forms/form-field/form-field.js';
import { usarAutenticacion } from '../../../hooks/useAuth.js';
import { navegarA } from '../../../router/index.js';
import { RUTAS, NOMBRES_RUTAS } from '../../../config/routes.config.js';
import { t } from '../../../i18n/index.js';
import { estadoNotificaciones } from '../../../store/notifications.store.js';

export default async (ctx) => {
  const auth = usarAutenticacion();

  const alEnviar = async (e) => {
    e.preventDefault();
    const { password, confirm } = Object.fromEntries(new FormData(e.target).entries());
    if (password !== confirm) {
      estadoNotificaciones.advertencia('Las contraseñas no coinciden.');
      return;
    }
    await auth.restablecerContrasena(ctx.query?.token, password);
    navegarA(RUTAS[NOMBRES_RUTAS.INGRESAR]);
  };

  return Tarjeta({
    titulo: t('auth.reset_password'),
    hijos: crearEl('form', { onSubmit: alEnviar }, [
      CampoFormulario({ etiqueta: t('auth.password'),         obligatorio: true, control: Campo({ name: 'password', type: 'password', required: true }) }),
      CampoFormulario({ etiqueta: t('auth.password_confirm'), obligatorio: true, control: Campo({ name: 'confirm',  type: 'password', required: true }) }),
      Boton({ texto: t('actions.confirm'), bloque: true, type: 'submit' }),
    ]),
  });
};
