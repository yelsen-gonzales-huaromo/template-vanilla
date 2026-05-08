import { crearEl } from '../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';
import { Tarjeta } from '../../../components/ui/card/card.js';
import { Campo } from '../../../components/ui/input/input.js';
import { Selector } from '../../../components/ui/select/select.js';
import { Boton } from '../../../components/ui/button/button.js';
import { CampoFormulario } from '../../../components/forms/form-field/form-field.js';
import { estadoNotificaciones } from '../../../store/notifications.store.js';
import { t } from '../../../i18n/index.js';

const PASOS = [
  { id: 'cuenta',    titulo: 'Cuenta' },
  { id: 'personal',  titulo: 'Personal' },
  { id: 'organizacion', titulo: 'Organización' },
  { id: 'confirmacion', titulo: 'Confirmar' },
];

export default async () => {
  const pasoActual = senal(0);
  const datos = senal({});

  const indicadores = crearEl('ol', {
    style: {
      display: 'flex', gap: 'var(--space-2)', justifyContent: 'space-between',
      marginBottom: 'var(--space-6)', listStyle: 'none', padding: 0,
    },
  });
  PASOS.forEach((p, idx) => {
    const li = crearEl('li', {
      style: {
        flex: 1, textAlign: 'center', padding: 'var(--space-2)',
        borderBlockEnd: '3px solid var(--border)',
        fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)',
        transition: 'all var(--transition-fast)',
      },
    }, [
      crearEl('div', { style: { fontWeight: 600 } }, [`${idx + 1}. ${p.titulo}`]),
    ]);
    indicadores.appendChild(li);
  });
  efecto(() => {
    Array.from(indicadores.children).forEach((li, idx) => {
      const activo = idx === pasoActual.value;
      const pasado = idx < pasoActual.value;
      li.style.borderBlockEndColor = activo || pasado ? 'var(--primary)' : 'var(--border)';
      li.style.color = activo ? 'var(--primary)' : pasado ? 'var(--foreground)' : 'var(--muted-foreground)';
    });
  });

  const cuerpo = crearEl('div');
  const renderPaso = () => {
    switch (pasoActual.value) {
      case 0: return crearEl('div', null, [
        CampoFormulario({ etiqueta: t('auth.email'), obligatorio: true, control: Campo({ name: 'email', type: 'email', value: datos.value.email || '' }) }),
        CampoFormulario({ etiqueta: t('auth.password'), obligatorio: true, control: Campo({ name: 'password', type: 'password', value: datos.value.password || '' }) }),
      ]);
      case 1: return crearEl('div', null, [
        CampoFormulario({ etiqueta: 'Nombre', obligatorio: true, control: Campo({ name: 'nombre', value: datos.value.nombre || '' }) }),
        CampoFormulario({ etiqueta: 'Apellidos', obligatorio: true, control: Campo({ name: 'apellidos', value: datos.value.apellidos || '' }) }),
        CampoFormulario({ etiqueta: 'Teléfono', control: Campo({ name: 'telefono', value: datos.value.telefono || '' }) }),
      ]);
      case 2: return crearEl('div', null, [
        CampoFormulario({ etiqueta: 'Empresa', control: Campo({ name: 'empresa', value: datos.value.empresa || '' }) }),
        CampoFormulario({ etiqueta: 'Tamaño',
          control: Selector({ name: 'tamano',
            opciones: [{ value: 'pequeno', label: '1-10 personas' }, { value: 'mediano', label: '11-50' }, { value: 'grande', label: '50+' }],
            placeholder: 'Selecciona…',
            value: datos.value.tamano || '',
          }),
        }),
        CampoFormulario({ etiqueta: 'Industria', control: Campo({ name: 'industria', value: datos.value.industria || '' }) }),
      ]);
      case 3: return crearEl('div', null, [
        crearEl('p', { class: 'text-muted', style: { marginBottom: 'var(--space-3)' } }, ['Revisa tus datos antes de finalizar:']),
        ...Object.entries(datos.value).map(([k, v]) =>
          crearEl('div', { style: { display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', borderBlockEnd: '1px solid var(--border)' } }, [
            crearEl('span', { class: 'text-muted text-sm' }, [k]),
            crearEl('span', { class: 'font-medium' }, [String(v).slice(0, 32)]),
          ])
        ),
      ]);
    }
  };

  efecto(() => {
    cuerpo.replaceChildren(renderPaso());
  });

  const guardarPaso = () => {
    const inputs = cuerpo.querySelectorAll('input, select, textarea');
    const fragmento = {};
    inputs.forEach(i => { if (i.name) fragmento[i.name] = i.value; });
    datos.value = { ...datos.value, ...fragmento };
  };

  return Tarjeta({
    titulo: 'Asistente de registro',
    subtitulo: 'Configura tu cuenta en cuatro pasos.',
    hijos: crearEl('div', null, [
      indicadores,
      crearEl('form', {
        onSubmit: (e) => {
          e.preventDefault();
          guardarPaso();
          if (pasoActual.value < PASOS.length - 1) pasoActual.value++;
          else estadoNotificaciones.exito('Cuenta creada correctamente.');
        },
      }, [
        cuerpo,
        crearEl('div', { style: { display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-6)', gap: 'var(--space-2)' } }, [
          Boton({
            texto: t('actions.prev'), variante: 'ghost',
            type: 'button',
            deshabilitado: pasoActual.value === 0,
            onClick: () => { guardarPaso(); pasoActual.value--; },
          }),
          Boton({
            texto: pasoActual.value === PASOS.length - 1 ? t('actions.confirm') : t('actions.next'),
            type: 'submit',
          }),
        ]),
      ]),
    ]),
  });
};
