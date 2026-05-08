import { crearEl } from '../../../utils/helpers/dom.js';
import { Tarjeta } from '../../../components/ui/card/card.js';
import { Campo } from '../../../components/ui/input/input.js';
import { Boton } from '../../../components/ui/button/button.js';
import { CampoFormulario } from '../../../components/forms/form-field/form-field.js';
import { usarAutenticacion } from '../../../hooks/useAuth.js';
import { RUTAS, NOMBRES_RUTAS } from '../../../config/routes.config.js';
import { t } from '../../../i18n/index.js';

export default async () => {
  const auth = usarAutenticacion();
  const alEnviar = async (e) => {
    e.preventDefault();
    const { email } = Object.fromEntries(new FormData(e.target).entries());
    if (email) await auth.recuperarContrasena(email);
  };

  return Tarjeta({
    titulo: t('auth.forgot_password'),
    subtitulo: 'Te enviaremos instrucciones por correo.',
    hijos: crearEl('form', { onSubmit: alEnviar }, [
      CampoFormulario({ etiqueta: t('auth.email'), obligatorio: true, control: Campo({ name: 'email', type: 'email', required: true }) }),
      Boton({ texto: t('actions.submit'), bloque: true, type: 'submit' }),
      crearEl('p', { class: 'text-sm text-muted text-center', style: { marginTop: 'var(--space-4)' } }, [
        crearEl('a', { href: RUTAS[NOMBRES_RUTAS.INGRESAR], class: 'text-primary' }, [t('actions.back')]),
      ]),
    ]),
  });
};
