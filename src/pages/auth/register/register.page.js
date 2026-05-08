import { crearEl } from '../../../utils/helpers/dom.js';
import { Tarjeta } from '../../../components/ui/card/card.js';
import { Campo } from '../../../components/ui/input/input.js';
import { Boton } from '../../../components/ui/button/button.js';
import { CampoFormulario } from '../../../components/forms/form-field/form-field.js';
import { usarAutenticacion } from '../../../hooks/useAuth.js';
import { validarFormulario, obligatorio, correo as correoRegla, longitudMinima } from '../../../utils/validators/rules.js';
import { navegarA } from '../../../router/index.js';
import { RUTAS, NOMBRES_RUTAS } from '../../../config/routes.config.js';
import { t } from '../../../i18n/index.js';
import { estadoNotificaciones } from '../../../store/notifications.store.js';

export default async () => {
  const auth = usarAutenticacion();

  const alEnviar = async (e) => {
    e.preventDefault();
    const valores = Object.fromEntries(new FormData(e.target).entries());

    const { valido, errores } = validarFormulario(valores, {
      name:     [obligatorio()],
      email:    [obligatorio(), correoRegla()],
      password: [obligatorio(), longitudMinima(8)],
    });
    if (!valido) {
      const primero = Object.values(errores)[0];
      estadoNotificaciones.advertencia(typeof primero === 'string' ? primero : primero.key);
      return;
    }

    try {
      await auth.registrar(valores);
      navegarA(RUTAS[NOMBRES_RUTAS.PANEL]);
    } catch (err) {
      estadoNotificaciones.error(err?.message || 'No se pudo crear la cuenta.');
    }
  };

  return Tarjeta({
    titulo: t('auth.register'),
    subtitulo: t('auth.create_account_cta'),
    hijos: crearEl('form', { onSubmit: alEnviar }, [
      CampoFormulario({ etiqueta: 'Nombre', obligatorio: true, control: Campo({ name: 'name', required: true }) }),
      CampoFormulario({ etiqueta: t('auth.email'), obligatorio: true, control: Campo({ name: 'email', type: 'email', required: true }) }),
      CampoFormulario({ etiqueta: t('auth.password'), obligatorio: true, control: Campo({ name: 'password', type: 'password', required: true }) }),
      Boton({ texto: t('auth.register'), bloque: true, type: 'submit' }),
      crearEl('p', { class: 'text-sm text-muted text-center', style: { marginTop: 'var(--space-4)' } }, [
        `${t('auth.have_account')} `,
        crearEl('a', { href: RUTAS[NOMBRES_RUTAS.INGRESAR], class: 'text-primary' }, [t('auth.login')]),
      ]),
    ]),
  });
};
