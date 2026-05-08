/**
 * Ajustes — página profesional con sidebar de tabs + paneles configurables.
 * Inspirado en Linear Settings / Notion Settings / GitHub Settings.
 *
 * Secciones:
 *  - Apariencia (tema, color, densidad)
 *  - Notificaciones (email, push, sms con granularidad)
 *  - Privacidad (visibilidad, search engines, data export)
 *  - Idioma & Región
 *  - Conexiones (Google, GitHub, Slack, Linear)
 *  - Sesiones activas
 *  - Danger zone (logout all, delete account)
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { estadoUi } from '../../../store/ui.store.js';
import { estadoNotificaciones } from '../../../store/notifications.store.js';

import { Campo, Switch, Stack, Grid2 } from '../../modulos/forms/_compartido.js';
import { FloatingInput, FloatingPassword, FloatingSelect } from '../../modulos/forms/_floating.js';
import { ColorPicker } from '../../modulos/forms/_pickers.js';
import { SelectModerno, SelectSegmentado } from '../../modulos/forms/_select.js';

const Btn = (texto, variante = 'primary', extra = {}) => crearEl('button', {
  type: extra.type || 'button',
  class: ['btn', variante !== 'primary' && `btn--${variante}`],
  ...extra,
}, [texto]);

const SeccionHead = (titulo, descripcion) => crearEl('div', { class: 'aj-head' }, [
  crearEl('h3', null, [titulo]),
  descripcion && crearEl('p', null, [descripcion]),
]);

// ---------------------------------------------------------------------------
//  SECCIÓN: Apariencia
// ---------------------------------------------------------------------------
const seccionApariencia = () => {
  const previewTema = (modo) => crearEl('div', { class: ['aj-tema-preview', `aj-tema-preview--${modo}`] }, [
    crearEl('div', { class: 'aj-tema-preview__sb' }),
    crearEl('div', { class: 'aj-tema-preview__main' }, [
      crearEl('div', { class: 'aj-tema-preview__bar' }),
      crearEl('div', { class: 'aj-tema-preview__line' }),
      crearEl('div', { class: 'aj-tema-preview__line aj-tema-preview__line--cort' }),
    ]),
  ]);

  const cards = ['light', 'dark', 'auto'].map((modo) => {
    const card = crearEl('label', { class: 'aj-tema-card' }, [
      crearEl('input', {
        type: 'radio', name: 'tema', value: modo,
        class: 'aj-tema-card__radio',
        checked: estadoUi.tema.peek() === modo || null,
        onChange: () => estadoUi.establecerTema(modo),
      }),
      previewTema(modo),
      crearEl('div', { class: 'aj-tema-card__nombre' }, [
        modo === 'light' ? 'Claro' : modo === 'dark' ? 'Oscuro' : 'Auto (sistema)',
      ]),
    ]);
    return card;
  });

  return Stack(
    SeccionHead('Apariencia', 'Personaliza el tema, el color de marca y la densidad de la interfaz.'),
    Campo({ label: 'Tema',
      hijos: crearEl('div', { class: 'aj-tema-cards' }, cards) }),
    Campo({ label: 'Color de marca', hint: 'Se aplica en botones, links y acentos en toda la app.',
      hijos: crearEl('div', { style: { maxWidth: '320px' } }, [
        ColorPicker({ value: '#3b82f6' }),
      ]) }),
    Campo({ label: 'Densidad',
      hijos: SelectSegmentado({
        value: 'comoda',
        opciones: [
          { value: 'compacta', label: 'Compacta' },
          { value: 'comoda', label: 'Cómoda' },
          { value: 'amplia', label: 'Amplia' },
        ],
      }) }),
    Campo({ label: 'Tamaño de fuente',
      hijos: SelectSegmentado({
        value: 'm',
        opciones: [
          { value: 's', label: 'S' },
          { value: 'm', label: 'M' },
          { value: 'l', label: 'L' },
          { value: 'xl', label: 'XL' },
        ],
      }) }),
    Campo({ label: 'Animaciones',
      hijos: Stack(
        Switch({ label: 'Habilitar animaciones de UI', descripcion: 'Transiciones suaves en menús, modales y panels', checked: true }),
        Switch({ label: 'Reducir movimiento', descripcion: 'Respeta `prefers-reduced-motion` del sistema', checked: false }),
      ) }),
  );
};

// ---------------------------------------------------------------------------
//  SECCIÓN: Notificaciones
// ---------------------------------------------------------------------------
const seccionNotificaciones = () => {
  const filaNotif = (titulo, desc, defaults) => crearEl('div', { class: 'aj-notif-fila' }, [
    crearEl('div', { class: 'aj-notif-fila__cuerpo' }, [
      crearEl('div', { class: 'aj-notif-fila__titulo' }, [titulo]),
      crearEl('div', { class: 'aj-notif-fila__desc' }, [desc]),
    ]),
    crearEl('div', { class: 'aj-notif-fila__canales' }, [
      crearEl('label', { class: 'aj-notif-canal' }, [
        Switch({ checked: defaults[0] || null, tamano: 'sm' }),
        crearEl('span', null, ['Email']),
      ]),
      crearEl('label', { class: 'aj-notif-canal' }, [
        Switch({ checked: defaults[1] || null, tamano: 'sm' }),
        crearEl('span', null, ['Push']),
      ]),
      crearEl('label', { class: 'aj-notif-canal' }, [
        Switch({ checked: defaults[2] || null, tamano: 'sm' }),
        crearEl('span', null, ['SMS']),
      ]),
    ]),
  ]);

  return Stack(
    SeccionHead('Notificaciones', 'Elige qué eventos quieres recibir y por qué canal.'),
    crearEl('div', { class: 'aj-notif-tabla' }, [
      crearEl('div', { class: 'aj-notif-tabla__head' }, [
        crearEl('div', null, ['Tipo de notificación']),
        crearEl('div', null, ['Canales']),
      ]),
      filaNotif('Mensajes directos', 'Cuando alguien te envía un DM', [true, true, false]),
      filaNotif('Menciones', 'Cuando te mencionan con @ en un comentario', [true, true, false]),
      filaNotif('Asignaciones', 'Cuando te asignan un task o issue', [true, true, false]),
      filaNotif('Comentarios en tus posts', 'Respuestas a contenido que creaste', [true, false, false]),
      filaNotif('Resumen semanal', 'Reporte de actividad cada lunes', [true, false, false]),
      filaNotif('Marketing', 'Tips, novedades, casos de éxito', [false, false, false]),
      filaNotif('Alertas de seguridad', 'Login desde un nuevo dispositivo', [true, true, true]),
    ]),
    crearEl('div', { class: 'aj-acciones' }, [
      Btn('Restablecer defaults', 'outline'),
      Btn('Guardar preferencias', 'primary', { type: 'submit' }),
    ]),
  );
};

// ---------------------------------------------------------------------------
//  SECCIÓN: Privacidad y seguridad
// ---------------------------------------------------------------------------
const seccionPrivacidad = () => Stack(
  SeccionHead('Privacidad y seguridad', 'Controla quién ve tu información y cómo se usa.'),
  Campo({ label: 'Visibilidad del perfil',
    hijos: SelectModerno({
      value: 'pub',
      opciones: [
        { value: 'pub', label: 'Público', descripcion: 'Cualquiera puede verlo' },
        { value: 'red', label: 'Red', descripcion: 'Solo personas que sigues o te siguen' },
        { value: 'priv', label: 'Privado', descripcion: 'Solo tú' },
      ],
    }) }),
  Stack(
    Switch({ label: 'Aparecer en buscadores', descripcion: 'Permite que Google y otros buscadores indexen tu perfil', checked: true }),
    Switch({ label: 'Permitir mensajes de cualquier usuario', descripcion: 'Si lo desactivas, solo te pueden escribir tus contactos', checked: true }),
    Switch({ label: 'Mostrar última actividad', descripcion: 'Otros pueden ver cuándo estuviste activo por última vez', checked: false }),
    Switch({ label: 'Análisis y telemetría', descripcion: 'Ayuda a mejorar el producto compartiendo datos anónimos de uso', checked: true }),
  ),
  SeccionHead('Sesión y dispositivos'),
  Stack(
    Switch({ label: 'Doble factor (2FA)', descripcion: 'Requiere código adicional al iniciar sesión', checked: true }),
    Switch({ label: 'Cerrar sesión automática tras 30 días de inactividad', checked: true }),
  ),
  Campo({ label: 'Cambiar contraseña',
    hijos: Stack(
      FloatingPassword({ label: 'Contraseña actual' }),
      FloatingPassword({ label: 'Contraseña nueva' }),
      FloatingPassword({ label: 'Confirma contraseña nueva' }),
    ) }),
  crearEl('div', { class: 'aj-acciones' }, [
    Btn('Guardar cambios', 'primary', { type: 'submit' }),
  ]),
);

// ---------------------------------------------------------------------------
//  SECCIÓN: Idioma & Región
// ---------------------------------------------------------------------------
const seccionIdioma = () => Stack(
  SeccionHead('Idioma y región', 'Cómo se muestran los textos, fechas y números.'),
  Grid2(
    Campo({ label: 'Idioma de la interfaz',
      hijos: SelectModerno({
        value: estadoUi.idioma.peek(),
        opciones: [
          { value: 'es', label: 'Español' },
          { value: 'en', label: 'English' },
          { value: 'pt', label: 'Português' },
          { value: 'fr', label: 'Français' },
        ],
        onChange: (v) => estadoUi.establecerIdioma(v),
      }) }),
    Campo({ label: 'Zona horaria',
      hijos: SelectModerno({
        value: 'lima',
        conBuscador: true,
        opciones: [
          { value: 'lima', label: 'America/Lima (UTC-5)' },
          { value: 'mexico', label: 'America/Mexico_City (UTC-6)' },
          { value: 'bogota', label: 'America/Bogota (UTC-5)' },
          { value: 'madrid', label: 'Europe/Madrid (UTC+1)' },
          { value: 'ny', label: 'America/New_York (UTC-5)' },
          { value: 'tokyo', label: 'Asia/Tokyo (UTC+9)' },
        ],
      }) }),
    Campo({ label: 'Formato de fecha',
      hijos: SelectModerno({
        value: 'dmy',
        opciones: [
          { value: 'dmy', label: 'DD/MM/YYYY (15/05/2026)' },
          { value: 'mdy', label: 'MM/DD/YYYY (05/15/2026)' },
          { value: 'ymd', label: 'YYYY-MM-DD (2026-05-15)' },
        ],
      }) }),
    Campo({ label: 'Formato de hora',
      hijos: SelectSegmentado({
        value: '24',
        opciones: [
          { value: '12', label: '12 hr (2:30 PM)' },
          { value: '24', label: '24 hr (14:30)' },
        ],
      }) }),
    Campo({ label: 'Moneda',
      hijos: SelectModerno({
        value: 'pen',
        opciones: [
          { value: 'pen', label: 'PEN — Sol peruano' },
          { value: 'usd', label: 'USD — Dólar estadounidense' },
          { value: 'eur', label: 'EUR — Euro' },
          { value: 'mxn', label: 'MXN — Peso mexicano' },
        ],
      }) }),
    Campo({ label: 'Primer día de la semana',
      hijos: SelectSegmentado({
        value: 'lun',
        opciones: [
          { value: 'lun', label: 'Lunes' },
          { value: 'dom', label: 'Domingo' },
        ],
      }) }),
  ),
  crearEl('div', { class: 'aj-acciones' }, [
    Btn('Guardar cambios', 'primary', { type: 'submit' }),
  ]),
);

// ---------------------------------------------------------------------------
//  SECCIÓN: Conexiones (cuentas vinculadas)
// ---------------------------------------------------------------------------
const seccionConexiones = () => {
  const conexion = ({ logo, nombre, desc, conectado, cuenta }) => crearEl('div', { class: 'aj-conexion' }, [
    crearEl('div', { class: ['aj-conexion__logo', `aj-conexion__logo--${logo}`] }, [logo[0].toUpperCase()]),
    crearEl('div', { class: 'aj-conexion__cuerpo' }, [
      crearEl('div', { class: 'aj-conexion__nombre' }, [nombre]),
      crearEl('div', { class: 'aj-conexion__desc' }, [conectado ? `Conectado como ${cuenta}` : desc]),
    ]),
    conectado
      ? Btn('Desconectar', 'outline')
      : Btn('Conectar', 'primary'),
  ]);

  return Stack(
    SeccionHead('Cuentas conectadas', 'Vincula servicios externos para iniciar sesión y sincronizar datos.'),
    crearEl('div', { class: 'aj-conexiones' }, [
      conexion({ logo: 'google', nombre: 'Google', desc: 'Inicia sesión con tu cuenta de Google', conectado: true, cuenta: 'maria@empresa.com' }),
      conexion({ logo: 'github', nombre: 'GitHub', desc: 'Importa repositorios y sincroniza issues', conectado: true, cuenta: '@maria-garcia' }),
      conexion({ logo: 'slack', nombre: 'Slack', desc: 'Recibe notificaciones en tu workspace', conectado: false }),
      conexion({ logo: 'linear', nombre: 'Linear', desc: 'Sincroniza tasks bidireccionales', conectado: false }),
      conexion({ logo: 'figma', nombre: 'Figma', desc: 'Embebe diseños en tus documentos', conectado: false }),
      conexion({ logo: 'notion', nombre: 'Notion', desc: 'Importa páginas y bases de datos', conectado: false }),
    ]),
  );
};

// ---------------------------------------------------------------------------
//  SECCIÓN: Sesiones activas
// ---------------------------------------------------------------------------
const seccionSesiones = () => {
  const sesion = ({ dispositivo, ubicacion, ultima, actual }) => crearEl('div', { class: ['aj-sesion', actual && 'aj-sesion--actual'] }, [
    crearEl('div', { class: 'aj-sesion__ico' }, [Icono('panel', { tamano: 18 })]),
    crearEl('div', { class: 'aj-sesion__cuerpo' }, [
      crearEl('div', { class: 'aj-sesion__head' }, [
        crearEl('span', { class: 'aj-sesion__dispositivo' }, [dispositivo]),
        actual && crearEl('span', { class: 'aj-sesion__badge' }, ['Esta sesión']),
      ]),
      crearEl('div', { class: 'aj-sesion__meta' }, [`${ubicacion} · ${ultima}`]),
    ]),
    !actual && Btn('Cerrar sesión', 'outline'),
  ]);

  return Stack(
    SeccionHead('Sesiones activas', 'Dispositivos donde has iniciado sesión recientemente.'),
    crearEl('div', { class: 'aj-sesiones' }, [
      sesion({ dispositivo: 'Chrome · Windows 11', ubicacion: 'Lima, PE', ultima: 'Activa ahora', actual: true }),
      sesion({ dispositivo: 'Safari · iPhone 15 Pro', ubicacion: 'Lima, PE', ultima: 'Hace 2 horas' }),
      sesion({ dispositivo: 'Edge · MacBook Pro', ubicacion: 'Cusco, PE', ultima: 'Hace 3 días' }),
      sesion({ dispositivo: 'Firefox · Linux', ubicacion: 'Madrid, ES', ultima: 'Hace 2 semanas' }),
    ]),
    Btn('Cerrar todas las otras sesiones', 'outline'),
  );
};

// ---------------------------------------------------------------------------
//  SECCIÓN: Danger zone
// ---------------------------------------------------------------------------
const seccionDanger = () => Stack(
  SeccionHead('Zona peligrosa', 'Acciones irreversibles. Procede con cuidado.'),
  crearEl('div', { class: 'aj-danger' }, [
    crearEl('div', { class: 'aj-danger__item' }, [
      crearEl('div', null, [
        crearEl('div', { class: 'aj-danger__titulo' }, ['Exportar todos mis datos']),
        crearEl('div', { class: 'aj-danger__desc' }, ['Descarga un ZIP con todo tu contenido (perfil, posts, mensajes, archivos). Recibirás un email cuando esté listo.']),
      ]),
      Btn('Solicitar export', 'outline'),
    ]),
    crearEl('div', { class: 'aj-danger__item' }, [
      crearEl('div', null, [
        crearEl('div', { class: 'aj-danger__titulo' }, ['Pausar cuenta temporalmente']),
        crearEl('div', { class: 'aj-danger__desc' }, ['Tu perfil deja de ser visible y no podrás iniciar sesión. Puedes reactivarla en cualquier momento.']),
      ]),
      Btn('Pausar cuenta', 'outline'),
    ]),
    crearEl('div', { class: 'aj-danger__item aj-danger__item--rojo' }, [
      crearEl('div', null, [
        crearEl('div', { class: 'aj-danger__titulo' }, ['Eliminar cuenta permanentemente']),
        crearEl('div', { class: 'aj-danger__desc' }, ['Borra tu perfil, todo tu contenido y revoca todos los accesos. Esta acción NO se puede deshacer.']),
      ]),
      Btn('Eliminar mi cuenta', 'danger'),
    ]),
  ]),
);

// ---------------------------------------------------------------------------
//  Página principal
// ---------------------------------------------------------------------------
const TABS = [
  { id: 'apariencia',     label: 'Apariencia',       icono: 'paleta',   render: seccionApariencia },
  { id: 'notificaciones', label: 'Notificaciones',   icono: 'campana',  render: seccionNotificaciones },
  { id: 'privacidad',     label: 'Privacidad',       icono: 'candado',  render: seccionPrivacidad },
  { id: 'idioma',         label: 'Idioma & Región',  icono: 'globo',    render: seccionIdioma },
  { id: 'conexiones',     label: 'Conexiones',       icono: 'enlace',   render: seccionConexiones },
  { id: 'sesiones',       label: 'Sesiones',         icono: 'reloj',    render: seccionSesiones },
  { id: 'danger',         label: 'Zona peligrosa',   icono: 'alerta',   render: seccionDanger },
];

export default async () => {
  const tabActiva = senal('apariencia');

  const onSubmit = (e) => {
    e.preventDefault();
    estadoNotificaciones.exito('Cambios guardados.');
  };

  const wrap = crearEl('div', { class: 'aj-pagina' });

  // Header
  wrap.appendChild(crearEl('div', { class: 'aj-header' }, [
    crearEl('h1', null, ['Ajustes']),
    crearEl('p', null, ['Personaliza tu experiencia, gestiona tu cuenta y configura tu privacidad.']),
  ]));

  // Tabs verticales sidebar
  const nav = crearEl('nav', { class: 'aj-tabs' });
  TABS.forEach((t) => {
    const btn = crearEl('button', {
      type: 'button',
      class: ['aj-tab', t.id === 'danger' && 'aj-tab--peligro'],
      onClick: () => { tabActiva.value = t.id; },
    }, [Icono(t.icono, { tamano: 15 }), t.label]);
    efecto(() => {
      btn.classList.toggle('aj-tab--activa', tabActiva.value === t.id);
    });
    nav.appendChild(btn);
  });

  const panel = crearEl('div', { class: 'aj-panel' });
  efecto(() => {
    const tab = TABS.find((t) => t.id === tabActiva.value);
    panel.replaceChildren(crearEl('form', { onSubmit, class: 'aj-form' }, [tab.render()]));
  });

  wrap.appendChild(crearEl('div', { class: 'aj-cuerpo' }, [nav, panel]));
  return wrap;
};
