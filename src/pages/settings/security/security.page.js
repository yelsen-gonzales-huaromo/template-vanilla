import { crearEl } from '../../../utils/helpers/dom.js';
import { Tarjeta } from '../../../components/ui/card/card.js';
import { Campo } from '../../../components/ui/input/input.js';
import { Boton } from '../../../components/ui/button/button.js';
import { CampoFormulario } from '../../../components/forms/form-field/form-field.js';
import { TituloPagina } from '../../../components/common/page-title/page-title.js';
import * as servicioUsuarios from '../../../services/user.service.js';
import { estadoNotificaciones } from '../../../store/notifications.store.js';
import { t } from '../../../i18n/index.js';

export default async () => {
  const alEnviar = async (e) => {
    e.preventDefault();
    const v = Object.fromEntries(new FormData(e.target).entries());
    if (v.next !== v.confirm) return estadoNotificaciones.advertencia('Las contraseñas no coinciden.');
    try {
      await servicioUsuarios.cambiarContrasena(v.current, v.next);
      estadoNotificaciones.exito('Contraseña cambiada.');
      e.target.reset();
    } catch {
      estadoNotificaciones.error('No se pudo cambiar la contraseña.');
    }
  };

  return crearEl('div', null, [
    TituloPagina({ titulo: t('nav.security'), subtitulo: 'Cambia tu contraseña y revisa tus sesiones.' }),
    Tarjeta({
      titulo: 'Cambiar contraseña',
      hijos: crearEl('form', { onSubmit: alEnviar }, [
        CampoFormulario({ etiqueta: 'Contraseña actual', obligatorio: true, control: Campo({ name: 'current', type: 'password', required: true }) }),
        CampoFormulario({ etiqueta: 'Nueva contraseña',  obligatorio: true, control: Campo({ name: 'next',    type: 'password', required: true }) }),
        CampoFormulario({ etiqueta: 'Confirmar',         obligatorio: true, control: Campo({ name: 'confirm', type: 'password', required: true }) }),
        crearEl('div', { class: 'flex justify-end' }, [Boton({ texto: t('actions.save'), type: 'submit' })]),
      ]),
    }),
  ]);
};
