/**
 * Asistente de registro — wizard de 4 pasos.
 *
 * Devuelve un fragmento `auth-contenido` (sin Tarjeta interior) para
 * componerse limpio dentro de cualquiera de los 3 layouts de auth. El
 * layout aporta el chrome (marca, fondo, panel promocional). El wizard
 * sólo aporta el stepper, el formulario por paso y la navegación.
 *
 * El indicador es un stepper moderno (círculos + línea de progreso + check
 * en pasos completados). El estado vive en una `senal` y se persiste entre
 * pasos para que volver atrás muestre lo introducido.
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';
import { Campo } from '../../../components/ui/input/input.js';
import { Selector } from '../../../components/ui/select/select.js';
import { Boton } from '../../../components/ui/button/button.js';
import { CampoFormulario } from '../../../components/forms/form-field/form-field.js';
import { estadoNotificaciones } from '../../../store/notifications.store.js';
import { mostrarIntro } from '../../../utils/helpers/intro.js';
import { navegarA } from '../../../router/index.js';
import { RUTAS, NOMBRES_RUTAS } from '../../../config/routes.config.js';
import { t } from '../../../i18n/index.js';
import { aplicarPreset } from '../../../components/auth/auth-presets.js';

const PASOS = [
  { id: 'cuenta',       titulo: 'Cuenta',       descripcion: 'Tus credenciales' },
  { id: 'personal',     titulo: 'Personal',     descripcion: 'Datos básicos' },
  { id: 'organizacion', titulo: 'Organización', descripcion: 'Sobre tu empresa' },
  { id: 'confirmar',    titulo: 'Confirmar',    descripcion: 'Revisa y termina' },
];

/* Etiquetas humanas para el resumen del paso final. */
const ETIQUETAS = {
  email: 'Correo electrónico', password: 'Contraseña',
  nombre: 'Nombre', apellidos: 'Apellidos', telefono: 'Teléfono',
  empresa: 'Empresa', tamano: 'Tamaño', industria: 'Industria',
};
const TAMANOS = {
  pequeno: '1 – 10 personas', mediano: '11 – 50 personas', grande: '50+ personas',
};

const ocultar = (clave, valor) => clave === 'password' ? '••••••••' : valor;
const formatear = (clave, valor) => {
  if (clave === 'tamano' && TAMANOS[valor]) return TAMANOS[valor];
  return ocultar(clave, valor);
};

export default async (ctx) => {
  const { decoracion } = aplicarPreset(ctx);

  const pasoActual = senal(0);
  const datos = senal({});

  /* ─────────────────────── Stepper moderno ─────────────────────── */
  const indicadores = crearEl('ol', { class: 'wizard-pasos', 'aria-label': 'Progreso del registro' });
  PASOS.forEach((p, idx) => {
    const numero = crearEl('span', { class: 'wizard-paso__numero', 'aria-hidden': 'true' }, [String(idx + 1)]);
    const li = crearEl('li', { class: 'wizard-paso', 'data-idx': idx }, [
      numero,
      crearEl('span', { class: 'wizard-paso__textos' }, [
        crearEl('span', { class: 'wizard-paso__titulo' }, [p.titulo]),
        crearEl('span', { class: 'wizard-paso__desc' },   [p.descripcion]),
      ]),
    ]);
    indicadores.appendChild(li);
  });

  efecto(() => {
    Array.from(indicadores.children).forEach((li, idx) => {
      const activo = idx === pasoActual.value;
      const completado = idx < pasoActual.value;
      li.classList.toggle('wizard-paso--activo', activo);
      li.classList.toggle('wizard-paso--completado', completado);
      const num = li.querySelector('.wizard-paso__numero');
      // Tick para los pasos completados.
      num.textContent = completado ? '' : String(idx + 1);
      if (completado) num.classList.add('wizard-paso__numero--check');
      else num.classList.remove('wizard-paso__numero--check');
      li.setAttribute('aria-current', activo ? 'step' : 'false');
    });
  });

  /* ─────────────────────── Cuerpo del paso ─────────────────────── */
  const cuerpo = crearEl('div', { class: 'wizard-cuerpo' });

  const renderPaso = () => {
    const d = datos.value;
    switch (pasoActual.value) {
      case 0: return [
        CampoFormulario({ etiqueta: t('auth.email'), obligatorio: true,
          control: Campo({ name: 'email', type: 'email', autocomplete: 'email', value: d.email || '', placeholder: 'tucorreo@empresa.com', required: true }) }),
        CampoFormulario({ etiqueta: t('auth.password'), obligatorio: true,
          control: Campo({ name: 'password', type: 'password', autocomplete: 'new-password', value: d.password || '', placeholder: 'Mínimo 8 caracteres', required: true }) }),
      ];
      case 1: return [
        crearEl('div', { class: 'wizard-grid-2' }, [
          CampoFormulario({ etiqueta: 'Nombre', obligatorio: true,
            control: Campo({ name: 'nombre', value: d.nombre || '', placeholder: 'María', required: true }) }),
          CampoFormulario({ etiqueta: 'Apellidos', obligatorio: true,
            control: Campo({ name: 'apellidos', value: d.apellidos || '', placeholder: 'Pérez García', required: true }) }),
        ]),
        CampoFormulario({ etiqueta: 'Teléfono',
          control: Campo({ name: 'telefono', type: 'tel', autocomplete: 'tel', value: d.telefono || '', placeholder: '+34 600 000 000' }) }),
      ];
      case 2: return [
        CampoFormulario({ etiqueta: 'Empresa',
          control: Campo({ name: 'empresa', value: d.empresa || '', placeholder: 'Acme S.A.' }) }),
        crearEl('div', { class: 'wizard-grid-2' }, [
          CampoFormulario({ etiqueta: 'Tamaño',
            control: Selector({ name: 'tamano',
              opciones: [
                { value: 'pequeno', label: '1 – 10 personas' },
                { value: 'mediano', label: '11 – 50 personas' },
                { value: 'grande',  label: '50+ personas' },
              ],
              placeholder: 'Selecciona…',
              value: d.tamano || '',
            }) }),
          CampoFormulario({ etiqueta: 'Industria',
            control: Campo({ name: 'industria', value: d.industria || '', placeholder: 'Tecnología' }) }),
        ]),
      ];
      case 3: {
        const filas = Object.entries(datos.value)
          .filter(([_, v]) => v !== '' && v != null)
          .map(([k, v]) => crearEl('div', { class: 'wizard-resumen__fila' }, [
            crearEl('span', { class: 'wizard-resumen__clave' }, [ETIQUETAS[k] || k]),
            crearEl('span', { class: 'wizard-resumen__valor' }, [String(formatear(k, v)).slice(0, 64)]),
          ]));
        return [
          crearEl('p', { class: 'auth-lead' }, ['Revisa los datos antes de finalizar:']),
          crearEl('div', { class: 'wizard-resumen' },
            filas.length ? filas : [crearEl('p', { class: 'wizard-resumen__vacio' }, ['No hay datos previos para mostrar.'])]),
        ];
      }
    }
  };

  efecto(() => { cuerpo.replaceChildren(...renderPaso()); });

  /* ─────────────────────── Persistencia entre pasos ───────────────────── */
  const guardarPaso = () => {
    const inputs = cuerpo.querySelectorAll('input, select, textarea');
    const fragmento = {};
    inputs.forEach(i => { if (i.name) fragmento[i.name] = i.value; });
    datos.value = { ...datos.value, ...fragmento };
  };

  /* ─────────────────────── Botones (reactivos) ────────────────────────── */
  const btnAnterior = Boton({
    texto: t('actions.prev'), variante: 'ghost', type: 'button',
    onClick: () => { if (pasoActual.value > 0) { guardarPaso(); pasoActual.value--; } },
  });
  const btnSiguiente = Boton({ texto: t('actions.next'), type: 'submit' });

  efecto(() => {
    btnAnterior.disabled = pasoActual.value === 0;
    btnAnterior.classList.toggle('is-disabled', pasoActual.value === 0);
    const ultimo = pasoActual.value === PASOS.length - 1;
    const etiqueta = ultimo ? t('actions.confirm') : t('actions.next');
    const span = btnSiguiente.querySelector('.btn-text');
    if (span) span.textContent = etiqueta;
    else btnSiguiente.textContent = etiqueta;
  });

  const alEnviar = (e) => {
    e.preventDefault();
    guardarPaso();
    if (pasoActual.value < PASOS.length - 1) {
      pasoActual.value++;
      cuerpo.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }
    estadoNotificaciones.exito('Cuenta creada correctamente.');
    mostrarIntro({ duracion: 700 });
    navegarA(RUTAS[NOMBRES_RUTAS.PANEL]);
  };

  /* ─────────────────────── Composición final ─────────────────────────── */
  return crearEl('div', { class: 'auth-contenido auth-wizard' }, [
    decoracion,
    crearEl('header', { class: 'auth-cabecera auth-cabecera--centrada' }, [
      crearEl('div', null, [
        crearEl('h1', { class: 'auth-cabecera__titulo' }, ['Asistente de registro']),
        crearEl('p',  { class: 'auth-lead' }, ['Configura tu cuenta en cuatro pasos.']),
      ]),
    ]),

    indicadores,

    crearEl('form', { class: 'auth-form auth-form--wizard', onSubmit: alEnviar, novalidate: true }, [
      cuerpo,
      crearEl('div', { class: 'wizard-acciones' }, [btnAnterior, btnSiguiente]),
    ]),
  ]);
};
