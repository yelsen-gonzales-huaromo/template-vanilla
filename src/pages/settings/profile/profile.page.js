/**
 * Perfil — página profesional con hero + tabs verticales + form completo.
 * Inspirado en Stripe Settings / Linear Profile / GitHub Settings.
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { estadoAuth } from '../../../store/auth.store.js';
import { estadoNotificaciones } from '../../../store/notifications.store.js';

import { Campo, Input, Textarea, Stack, Grid2, Switch } from '../../modulos/forms/_compartido.js';
import { FloatingInput, FloatingSelect } from '../../modulos/forms/_floating.js';
import { DatePicker, PhoneInput } from '../../modulos/forms/_pickers.js';
import { SelectModerno } from '../../modulos/forms/_select.js';
import { Uploader } from '../../modulos/forms/_uploader.js';

const Btn = (texto, variante = 'primary', extra = {}) => crearEl('button', {
  type: extra.type || 'button',
  class: ['btn', variante !== 'primary' && `btn--${variante}`],
  ...extra,
}, [texto]);

// ---------------------------------------------------------------------------
//  Hero header — banner gradient + avatar + nombre + acciones
// ---------------------------------------------------------------------------
const Hero = (u) => crearEl('div', { class: 'perfil-hero' }, [
  crearEl('div', { class: 'perfil-hero__banner' }),
  crearEl('div', { class: 'perfil-hero__cuerpo' }, [
    crearEl('div', { class: 'perfil-hero__avatar' }, [
      (u.nombre || u.name || 'U').slice(0, 2).toUpperCase(),
      crearEl('button', {
        type: 'button',
        class: 'perfil-hero__avatar-edit',
        title: 'Cambiar foto',
      }, [Icono('camara', { tamano: 14 }) || Icono('imagen_mas', { tamano: 14 })]),
    ]),
    crearEl('div', { class: 'perfil-hero__info' }, [
      crearEl('div', { class: 'perfil-hero__nombre' }, [
        u.nombre || u.name || 'Sin nombre',
        crearEl('span', { class: 'perfil-hero__verificado', title: 'Cuenta verificada' }, [
          Icono('check', { tamano: 14 }),
        ]),
      ]),
      crearEl('div', { class: 'perfil-hero__email' }, [u.email || '—']),
      crearEl('div', { class: 'perfil-hero__chips' }, [
        crearEl('span', { class: 'perfil-hero__chip perfil-hero__chip--pro' }, [Icono('estrella', { tamano: 11 }), 'Plan Pro']),
        crearEl('span', { class: 'perfil-hero__chip' }, [Icono('reloj', { tamano: 11 }), 'Miembro desde 2024']),
        crearEl('span', { class: 'perfil-hero__chip' }, [Icono('pin', { tamano: 11 }), 'Lima, Perú']),
      ]),
    ]),
    crearEl('div', { class: 'perfil-hero__acciones' }, [
      Btn('Ver perfil público', 'outline', { onClick: () => window.open('#', '_blank') }),
      Btn('Compartir', 'primary'),
    ]),
  ]),
]);

// ---------------------------------------------------------------------------
//  Tab content builders
// ---------------------------------------------------------------------------
const seccionPersonal = (u) => Stack(
  crearEl('div', { class: 'perfil-seccion__head' }, [
    crearEl('h3', null, ['Información personal']),
    crearEl('p', null, ['Esta información aparece públicamente en tu perfil.']),
  ]),
  Grid2(
    FloatingInput({ label: 'Nombre', value: u.nombre || u.name || 'María', requerido: true }),
    FloatingInput({ label: 'Apellido', value: u.apellido || 'García', requerido: true }),
  ),
  FloatingInput({ label: 'Correo electrónico', type: 'email', value: u.email || 'maria@template-vanilla.dev', requerido: true,
    icono: Icono('correo', { tamano: 14 }) }),
  Campo({ label: 'Teléfono', hijos: PhoneInput({ pais: 'pe', placeholder: '999 888 777' }) }),
  Grid2(
    Campo({ label: 'Fecha de nacimiento', hijos: DatePicker({ placeholder: 'DD/MM/YYYY' }) }),
    Campo({ label: 'Género', hijos: SelectModerno({
      placeholder: 'Selecciona…',
      opciones: [
        { value: 'f', label: 'Femenino' },
        { value: 'm', label: 'Masculino' },
        { value: 'nb', label: 'No binario' },
        { value: 'o', label: 'Prefiero no decir' },
      ],
    }) }),
  ),
  Campo({ label: 'Bio', hint: 'Máximo 280 caracteres',
    hijos: Textarea({ filas: 3, placeholder: 'Cuéntanos sobre ti…',
      value: 'Senior frontend engineer apasionada por la UX y las animaciones suaves.' }) }),
  Campo({ label: 'Foto de perfil', hint: 'JPG / PNG · cuadrada, mín. 200×200 · máx. 5 MB',
    hijos: Uploader({ multi: false, maxMb: 5, accept: 'image/*', altura: 'compacto', conLista: false,
      textoArrastra: 'Arrastra tu foto aquí' }) }),
  crearEl('div', { class: 'perfil-acciones' }, [
    Btn('Cancelar', 'outline'),
    Btn('Guardar cambios', 'primary', { type: 'submit' }),
  ]),
);

const seccionEmpresa = () => Stack(
  crearEl('div', { class: 'perfil-seccion__head' }, [
    crearEl('h3', null, ['Información laboral']),
    crearEl('p', null, ['Tu rol en la empresa actual.']),
  ]),
  FloatingInput({ label: 'Empresa', value: 'Acme Inc.', icono: Icono('utilidades', { tamano: 14 }) }),
  Grid2(
    FloatingInput({ label: 'Cargo', value: 'CTO' }),
    Campo({ label: 'Departamento', hijos: SelectModerno({
      value: 'eng',
      opciones: [
        { value: 'eng', label: 'Engineering' },
        { value: 'prod', label: 'Product' },
        { value: 'des', label: 'Design' },
        { value: 'mkt', label: 'Marketing' },
        { value: 'sales', label: 'Sales' },
      ],
    }) }),
  ),
  Grid2(
    FloatingInput({ label: 'Sitio web', type: 'url', value: 'https://template-vanilla.dev',
      icono: Icono('utilidades', { tamano: 14 }) }),
    FloatingInput({ label: 'LinkedIn', value: 'maria-garcia',
      icono: Icono('crm', { tamano: 14 }) }),
  ),
  FloatingInput({ label: 'Dirección de la oficina', value: 'Av. Larco 1234, Miraflores, Lima',
    icono: Icono('pin', { tamano: 14 }) }),
  crearEl('div', { class: 'perfil-acciones' }, [
    Btn('Cancelar', 'outline'),
    Btn('Guardar cambios', 'primary', { type: 'submit' }),
  ]),
);

const seccionVerificacion = () => {
  const verifItem = ({ icono, titulo, desc, estado }) => crearEl('div', {
    class: ['perfil-verif', estado === 'ok' && 'perfil-verif--ok', estado === 'pendiente' && 'perfil-verif--pendiente'],
  }, [
    crearEl('div', { class: 'perfil-verif__ico' }, [Icono(icono, { tamano: 18 })]),
    crearEl('div', { class: 'perfil-verif__cuerpo' }, [
      crearEl('div', { class: 'perfil-verif__titulo' }, [titulo]),
      crearEl('div', { class: 'perfil-verif__desc' }, [desc]),
    ]),
    estado === 'ok'
      ? crearEl('span', { class: 'perfil-verif__badge perfil-verif__badge--ok' }, [Icono('check', { tamano: 12 }), 'Verificado'])
      : Btn(estado === 'pendiente' ? 'Verificar ahora' : 'Pendiente', 'outline'),
  ]);

  return Stack(
    crearEl('div', { class: 'perfil-seccion__head' }, [
      crearEl('h3', null, ['Verificación de identidad']),
      crearEl('p', null, ['Verifica tus datos para desbloquear todas las funciones de la plataforma.']),
    ]),
    crearEl('div', { class: 'perfil-verif-lista' }, [
      verifItem({ icono: 'correo', titulo: 'Correo electrónico', desc: 'maria@template-vanilla.dev', estado: 'ok' }),
      verifItem({ icono: 'reloj', titulo: 'Teléfono', desc: '+51 999 888 777', estado: 'ok' }),
      verifItem({ icono: 'tarjeta', titulo: 'Documento de identidad', desc: 'DNI peruano · 8 dígitos', estado: 'pendiente' }),
      verifItem({ icono: 'utilidades', titulo: 'Dirección postal', desc: 'Verificación con código por correo físico', estado: 'pendiente' }),
      verifItem({ icono: 'crm', titulo: 'Cuenta bancaria', desc: 'Para retiros y pagos', estado: 'pendiente' }),
    ]),
  );
};

const seccionPlan = () => Stack(
  crearEl('div', { class: 'perfil-seccion__head' }, [
    crearEl('h3', null, ['Plan y facturación']),
    crearEl('p', null, ['Gestiona tu suscripción y métodos de pago.']),
  ]),
  crearEl('div', { class: 'perfil-plan' }, [
    crearEl('div', { class: 'perfil-plan__head' }, [
      crearEl('div', null, [
        crearEl('span', { class: 'perfil-plan__badge' }, [Icono('estrella', { tamano: 12 }), 'Plan Pro']),
        crearEl('div', { class: 'perfil-plan__nombre' }, ['Pro mensual']),
        crearEl('div', { class: 'perfil-plan__desc' }, ['Renueva el 15 de cada mes · próxima factura $29.00']),
      ]),
      crearEl('div', { class: 'perfil-plan__precio' }, [
        crearEl('span', { class: 'perfil-plan__moneda' }, ['$']),
        '29',
        crearEl('span', { class: 'perfil-plan__periodo' }, ['/mes']),
      ]),
    ]),
    crearEl('ul', { class: 'perfil-plan__features' }, [
      ['10 proyectos activos', true],
      ['Hasta 50 colaboradores', true],
      ['Soporte por email 24/7', true],
      ['SSO + auditoría', false],
      ['CSM dedicado', false],
    ].map(([f, ok]) => crearEl('li', { class: ok ? 'perfil-plan__on' : 'perfil-plan__off' }, [
      Icono(ok ? 'check' : 'cerrar', { tamano: 12 }), f,
    ]))),
    crearEl('div', { class: 'perfil-plan__acciones' }, [
      Btn('Cambiar de plan', 'primary'),
      Btn('Cancelar suscripción', 'ghost'),
    ]),
  ]),
);

const seccionPreferencias = () => Stack(
  crearEl('div', { class: 'perfil-seccion__head' }, [
    crearEl('h3', null, ['Preferencias rápidas']),
    crearEl('p', null, ['Para configuración avanzada visita Ajustes.']),
  ]),
  crearEl('div', { class: 'perfil-prefs' }, [
    Switch({ label: 'Hacer perfil público', descripcion: 'Cualquiera puede ver tu perfil en template-vanilla.dev/maria', checked: true }),
    Switch({ label: 'Mostrar email en perfil', descripcion: 'Tu email es visible para otros usuarios', checked: false }),
    Switch({ label: 'Permitir mensajes directos', descripcion: 'Otros usuarios pueden enviarte DMs', checked: true }),
    Switch({ label: 'Notificaciones por email', descripcion: 'Resumen semanal de actividad', checked: true }),
  ]),
);

// ---------------------------------------------------------------------------
//  Página
// ---------------------------------------------------------------------------
const TABS = [
  { id: 'personal',     label: 'Personal',      icono: 'perfil',     render: seccionPersonal },
  { id: 'empresa',      label: 'Empresa',       icono: 'crm',        render: seccionEmpresa },
  { id: 'verificacion', label: 'Verificación',  icono: 'check',      render: seccionVerificacion },
  { id: 'plan',         label: 'Plan',          icono: 'estrella',   render: seccionPlan },
  { id: 'preferencias', label: 'Preferencias',  icono: 'ajustes',    render: seccionPreferencias },
];

export default async () => {
  const u = estadoAuth.usuario.peek() || { nombre: 'María García', email: 'maria@template-vanilla.dev' };
  const tabActiva = senal('personal');

  const wrap = crearEl('div', { class: 'perfil-pagina' });

  const onSubmit = (e) => {
    e.preventDefault();
    estadoNotificaciones.exito('Cambios guardados correctamente.');
  };

  const renderContenido = () => {
    const tab = TABS.find((t) => t.id === tabActiva.value);
    return crearEl('form', { onSubmit, class: 'perfil-form' }, [tab.render(u)]);
  };

  // Tabs verticales
  const nav = crearEl('nav', { class: 'perfil-tabs' });
  TABS.forEach((t) => {
    const btn = crearEl('button', {
      type: 'button',
      class: 'perfil-tab',
      onClick: () => { tabActiva.value = t.id; },
    }, [Icono(t.icono, { tamano: 15 }), t.label]);
    efecto(() => {
      btn.classList.toggle('perfil-tab--activa', tabActiva.value === t.id);
    });
    nav.appendChild(btn);
  });

  const panel = crearEl('div', { class: 'perfil-panel' });
  efecto(() => {
    panel.replaceChildren(renderContenido());
  });

  wrap.appendChild(Hero(u));
  wrap.appendChild(crearEl('div', { class: 'perfil-cuerpo' }, [
    nav,
    panel,
  ]));
  return wrap;
};
