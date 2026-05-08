import { crearEl } from '../../../utils/helpers/dom.js';
import { Tarjeta } from '../../../components/ui/card/card.js';
import { Campo } from '../../../components/ui/input/input.js';
import { Boton } from '../../../components/ui/button/button.js';
import { Avatar } from '../../../components/ui/avatar/avatar.js';
import { CampoFormulario } from '../../../components/forms/form-field/form-field.js';
import { estadoAuth } from '../../../store/auth.store.js';
import { navegarA } from '../../../router/index.js';
import { RUTAS, NOMBRES_RUTAS } from '../../../config/routes.config.js';
import { t } from '../../../i18n/index.js';

export default async () => {
  const u = estadoAuth.usuario.peek() || { nombre: 'Usuario' };

  const alEnviar = (e) => {
    e.preventDefault();
    navegarA(RUTAS[NOMBRES_RUTAS.PANEL]);
  };

  return Tarjeta({
    hijos: crearEl('div', { class: 'text-center' }, [
      crearEl('div', { style: { display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-4)' } }, [
        Avatar({ nombre: u.nombre, tamano: 'xl' }),
      ]),
      crearEl('h2', null, [t('auth.lock_screen')]),
      crearEl('p', { class: 'text-muted', style: { marginBottom: 'var(--space-4)' } }, [
        `Sesión bloqueada de ${u.nombre}. Introduce tu contraseña para continuar.`,
      ]),
      crearEl('form', { onSubmit: alEnviar, class: 'text-start' }, [
        CampoFormulario({
          etiqueta: t('auth.password'),
          obligatorio: true,
          control: Campo({ name: 'password', type: 'password', autocomplete: 'current-password', required: true }),
        }),
        Boton({ texto: t('auth.unlock'), bloque: true, type: 'submit' }),
      ]),
    ]),
  });
};
