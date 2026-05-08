import { crearEl } from '../../../utils/helpers/dom.js';
import { Tarjeta } from '../../../components/ui/card/card.js';
import { Selector } from '../../../components/ui/select/select.js';
import { CampoFormulario } from '../../../components/forms/form-field/form-field.js';
import { TituloPagina } from '../../../components/common/page-title/page-title.js';
import { estadoUi } from '../../../store/ui.store.js';
import { CONFIG_APP } from '../../../config/app.config.js';
import { t } from '../../../i18n/index.js';

export default async () => crearEl('div', null, [
  TituloPagina({ titulo: t('nav.preferences'), subtitulo: 'Apariencia, idioma y dirección de lectura.' }),
  Tarjeta({
    hijos: crearEl('div', { class: 'flex flex-col gap-4' }, [
      CampoFormulario({
        etiqueta: 'Tema',
        control: Selector({
          opciones: [
            { value: 'light', label: 'Claro' },
            { value: 'dark', label: 'Oscuro' },
            { value: 'system', label: 'Sistema' },
            { value: 'high-contrast', label: 'Alto contraste' },
          ],
          value: estadoUi.tema.peek(),
          onChange: (v) => estadoUi.establecerTema(v),
        }),
      }),
      CampoFormulario({
        etiqueta: 'Idioma',
        control: Selector({
          opciones: CONFIG_APP.ui.idiomasSoportados.map(l => ({ value: l, label: l.toUpperCase() })),
          value: estadoUi.idioma.peek(),
          onChange: (v) => estadoUi.establecerIdioma(v),
        }),
      }),
      CampoFormulario({
        etiqueta: 'Dirección',
        control: Selector({
          opciones: [{ value: 'ltr', label: 'Izquierda a derecha' }, { value: 'rtl', label: 'Derecha a izquierda' }],
          value: estadoUi.direccion.peek(),
          onChange: (v) => estadoUi.establecerDireccion(v),
        }),
      }),
    ]),
  }),
]);
