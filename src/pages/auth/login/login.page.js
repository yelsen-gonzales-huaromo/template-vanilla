import { crearEl } from '../../../utils/helpers/dom.js';
import { senal } from '../../../utils/helpers/reactive.js';
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
  const enviando = senal(false);

  const alEnviar = async (e) => {
    e.preventDefault();
    const formulario = new FormData(e.target);
    const valores = Object.fromEntries(formulario.entries());

    const { valido, errores } = validarFormulario(valores, {
      email:    [obligatorio(), correoRegla()],
      password: [obligatorio(), longitudMinima(6)],
    });
    if (!valido) {
      const primero = Object.values(errores)[0];
      estadoNotificaciones.advertencia(typeof primero === 'string' ? primero : primero.key);
      return;
    }

    enviando.value = true;
    try {
      await auth.iniciarSesion({ email: valores.email, password: valores.password });
      navegarA(RUTAS[NOMBRES_RUTAS.PANEL]);
    } catch (err) {
      estadoNotificaciones.error(err?.message || 'Credenciales incorrectas.');
    } finally {
      enviando.value = false;
    }
  };

  const btnEnviar = Boton({ texto: t('auth.login'), bloque: true, type: 'submit' });
  enviando.subscribe(v => {
    btnEnviar.setAttribute('aria-busy', String(v));
    btnEnviar.disabled = v;
  });

  return Tarjeta({
    titulo: t('auth.login'),
    subtitulo: t('auth.welcome_back'),
    hijos: crearEl('form', { novalidate: true, onSubmit: alEnviar }, [
      CampoFormulario({
        etiqueta: t('auth.email'),
        obligatorio: true,
        control: Campo({ name: 'email', type: 'email', autocomplete: 'email', required: true }),
      }),
      CampoFormulario({
        etiqueta: t('auth.password'),
        obligatorio: true,
        control: Campo({ name: 'password', type: 'password', autocomplete: 'current-password', required: true }),
      }),
      crearEl('div', { style: { display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--space-4)' } }, [
        crearEl('a', { href: RUTAS[NOMBRES_RUTAS.RECUPERAR], class: 'text-sm' }, [t('auth.forgot_password')]),
      ]),
      btnEnviar,
      crearEl('p', { class: 'text-sm text-muted text-center', style: { marginTop: 'var(--space-4)' } }, [
        `${t('auth.no_account')} `,
        crearEl('a', { href: RUTAS[NOMBRES_RUTAS.REGISTRAR], class: 'text-primary' }, [t('auth.register')]),
      ]),
    ]),
  });
};
