import { crearEl } from '../../../utils/helpers/dom.js';
import { Tarjeta } from '../../../components/ui/card/card.js';
import { Boton } from '../../../components/ui/button/button.js';
import { RUTAS, NOMBRES_RUTAS } from '../../../config/routes.config.js';
import { t } from '../../../i18n/index.js';

export default async () => Tarjeta({
  hijos: crearEl('div', { class: 'text-center', style: { padding: 'var(--space-4)' } }, [
    crearEl('div', {
      style: {
        width: '4rem', height: '4rem',
        borderRadius: '50%',
        backgroundColor: 'var(--accent)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto var(--space-4)',
        fontSize: '1.5rem',
      },
    }, ['✉']),
    crearEl('h2', null, [t('auth.confirm_email_title')]),
    crearEl('p', { class: 'text-muted', style: { marginTop: 'var(--space-2)', marginBottom: 'var(--space-4)' } }, [
      t('auth.confirm_email_text'),
    ]),
    Boton({
      texto: t('actions.back'), variante: 'outline', bloque: true,
      onClick: () => location.assign(RUTAS[NOMBRES_RUTAS.INGRESAR]),
    }),
  ]),
});
