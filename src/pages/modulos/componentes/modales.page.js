import { crearEl } from '../../../utils/helpers/dom.js';
import { senal } from '../../../utils/helpers/reactive.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { Boton } from '../../../components/ui/button/button.js';
import { Modal } from '../../../components/ui/modal/modal.js';
import { Campo } from '../../../components/ui/input/input.js';
import { Avatar } from '../../../components/ui/avatar/avatar.js';
import { Insignia } from '../../../components/ui/badge/badge.js';
import { Pestanas } from '../../../components/ui/tabs/tabs.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { notificar } from '../../../components/ui/toast/toast.js';
import { corner6 } from '../../../components/ui/card/card-decoraciones.js';

// ============================================================================
//  Helpers genéricos
// ============================================================================
const fila = (...n) => crearEl('div', {
  style: { display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' },
}, n);

// Pie con dos botones (cancelar + acción primaria)
const piePar = (cancelarTxt, primaryTxt, primaryVar = 'primary', primaryClick) => {
  let cerrar;
  const pie = crearEl('div', { style: { display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' } }, [
    Boton({ texto: cancelarTxt, variante: 'ghost', onClick: () => cerrar?.() }),
    Boton({ texto: primaryTxt,  variante: primaryVar, onClick: () => { primaryClick?.(); cerrar?.(); } }),
  ]);
  pie.__bind = (fnCerrar) => { cerrar = fnCerrar; };
  return pie;
};

const campoConLabel = (label, props = {}) => crearEl('label', {
  style: { display: 'flex', flexDirection: 'column', gap: '6px' },
}, [
  crearEl('span', { style: { fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--muted-foreground)' } }, [label]),
  Campo(props),
]);

// Cuerpo tipo "alerta" con icono circular + título + mensaje
const cuerpoAlerta = ({ icono, color, titulo, mensaje, extras }) => crearEl('div', { class: 'modal-alerta' }, [
  crearEl('div', { class: ['modal-alerta__icono', `modal-alerta__icono--${color}`] },
    [Icono(icono, { tamano: 28 })]),
  crearEl('strong', { class: 'modal-alerta__titulo' }, [titulo]),
  crearEl('p', { class: 'modal-alerta__mensaje' }, [mensaje]),
  extras,
]);

// ============================================================================
//  GRUPO 1 — Alertas y confirmaciones
// ============================================================================
const abrirEliminar = () => {
  const pie = piePar('Cancelar', 'Sí, eliminar', 'danger',
    () => notificar.error('Cuenta eliminada (demo)'));
  const { cerrar } = Modal.abrir({
    tamano: 'sm',
    cuerpo: cuerpoAlerta({
      icono: 'alerta', color: 'danger',
      titulo: '¿Eliminar tu cuenta?',
      mensaje: 'Esta acción es permanente. Perderás acceso a todos tus proyectos y archivos asociados.',
    }),
    pie,
  });
  pie.__bind(cerrar);
};

const abrirGuardar = () => {
  let cerrar;
  const pie = crearEl('div', { style: { display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' } }, [
    Boton({ texto: 'Cancelar',  variante: 'ghost',     onClick: () => cerrar() }),
    Boton({ texto: 'Descartar', variante: 'secondary', onClick: () => { notificar.info('Cambios descartados'); cerrar(); } }),
    Boton({ texto: 'Guardar',   variante: 'primary',   onClick: () => { notificar.exito('Cambios guardados'); cerrar(); } }),
  ]);
  ({ cerrar } = Modal.abrir({
    tamano: 'sm',
    cuerpo: cuerpoAlerta({
      icono: 'info', color: 'warning',
      titulo: 'Tienes cambios sin guardar',
      mensaje: 'Si sales ahora perderás los cambios. ¿Quieres guardar antes?',
    }),
    pie,
  }));
};

const abrirInfo = () => {
  const pie = piePar('Cerrar', 'Entendido', 'primary');
  const { cerrar } = Modal.abrir({
    tamano: 'sm',
    cuerpo: cuerpoAlerta({
      icono: 'info', color: 'info',
      titulo: 'Mantenimiento programado',
      mensaje: 'El sistema estará offline el sábado de 02:00 a 04:00 (UTC). Avisa a tu equipo con tiempo.',
    }),
    pie,
  });
  pie.__bind(cerrar);
};

const abrirExito = () => {
  let cerrar;
  const pie = crearEl('div', { style: { display: 'flex', gap: 'var(--space-2)', justifyContent: 'center' } }, [
    Boton({ texto: 'Continuar', variante: 'success', onClick: () => cerrar() }),
  ]);
  ({ cerrar } = Modal.abrir({
    tamano: 'sm',
    cuerpo: cuerpoAlerta({
      icono: 'check', color: 'success',
      titulo: '¡Pago procesado!',
      mensaje: 'Recibirás un email con la factura en los próximos minutos. Tu plan Pro ya está activo.',
    }),
    pie,
  }));
};

const abrirError = () => {
  const pie = piePar('Cerrar', 'Reintentar', 'danger',
    () => notificar.advertencia('Reintentando…'));
  const { cerrar } = Modal.abrir({
    tamano: 'sm',
    cuerpo: cuerpoAlerta({
      icono: 'cerrar', color: 'danger',
      titulo: 'Error al procesar el pago',
      mensaje: 'Tu tarjeta fue rechazada por el banco. Verifica los datos o usa otro método.',
    }),
    pie,
  });
  pie.__bind(cerrar);
};

// ============================================================================
//  GRUPO 2 — Formularios
// ============================================================================
const abrirNuevoProyecto = () => {
  const pie = piePar('Cancelar', 'Crear proyecto', 'primary',
    () => notificar.exito('Proyecto creado'));
  const { cerrar } = Modal.abrir({
    titulo: 'Nuevo proyecto',
    cuerpo: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
      campoConLabel('Nombre del proyecto', { placeholder: 'Ej. template-vanilla Web' }),
      campoConLabel('Descripción (opcional)', { placeholder: 'Breve descripción' }),
      crearEl('label', { style: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)' } }, [
        crearEl('input', { type: 'checkbox' }),
        crearEl('span', null, ['Hacer privado este proyecto']),
      ]),
    ]),
    pie,
  });
  pie.__bind(cerrar);
};

const abrirEditarPerfil = () => {
  const pie = piePar('Cancelar', 'Guardar cambios', 'primary',
    () => notificar.exito('Perfil actualizado'));
  const { cerrar } = Modal.abrir({
    titulo: 'Editar perfil',
    tamano: 'lg',
    cuerpo: crearEl('div', { style: { display: 'flex', gap: 'var(--space-5)' } }, [
      crearEl('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' } }, [
        Avatar({ nombre: 'María García', tamano: 'xl' }),
        Boton({ texto: 'Cambiar foto', variante: 'ghost', tamano: 'sm' }),
      ]),
      crearEl('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
        crearEl('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' } }, [
          campoConLabel('Nombre',   { value: 'María' }),
          campoConLabel('Apellido', { value: 'García' }),
        ]),
        campoConLabel('Email', { type: 'email', value: 'maria@template-vanilla.dev' }),
        campoConLabel('Bio',   { placeholder: 'Cuéntanos sobre ti…' }),
        campoConLabel('Sitio web', { type: 'url', placeholder: 'https://' }),
      ]),
    ]),
    pie,
  });
  pie.__bind(cerrar);
};

const abrirCambiarPassword = () => {
  const pie = piePar('Cancelar', 'Actualizar contraseña', 'primary',
    () => notificar.exito('Contraseña actualizada'));
  const { cerrar } = Modal.abrir({
    titulo: 'Cambiar contraseña',
    tamano: 'sm',
    cuerpo: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
      campoConLabel('Contraseña actual', { type: 'password', placeholder: '••••••••' }),
      campoConLabel('Nueva contraseña',  { type: 'password', placeholder: 'Mínimo 8 caracteres' }),
      campoConLabel('Confirmar nueva',   { type: 'password', placeholder: 'Repite la contraseña' }),
      crearEl('p', { style: { margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } },
        ['Usa al menos 8 caracteres, una mayúscula y un número.']),
    ]),
    pie,
  });
  pie.__bind(cerrar);
};

const abrirInvitar = () => {
  const pie = piePar('Cancelar', 'Enviar invitación', 'primary',
    () => notificar.exito('Invitación enviada'));
  const { cerrar } = Modal.abrir({
    titulo: 'Invitar a tu equipo',
    cuerpo: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
      campoConLabel('Email', { type: 'email', placeholder: 'compi@empresa.com' }),
      crearEl('label', { style: { display: 'flex', flexDirection: 'column', gap: '6px' } }, [
        crearEl('span', { style: { fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--muted-foreground)' } }, ['Rol']),
        crearEl('select', { style: {
          padding: '8px 12px', fontSize: 'var(--text-sm)',
          background: 'var(--background)', color: 'var(--foreground)',
          border: '1px solid var(--border)', borderRadius: 'var(--radius)',
        } }, [
          crearEl('option', null, ['Visualizador — sólo lectura']),
          crearEl('option', null, ['Editor — puede modificar contenido']),
          crearEl('option', null, ['Administrador — control total']),
        ]),
      ]),
    ]),
    pie,
  });
  pie.__bind(cerrar);
};

const abrirCrearEvento = () => {
  const pie = piePar('Cancelar', 'Crear evento', 'primary',
    () => notificar.exito('Evento creado'));
  const { cerrar } = Modal.abrir({
    titulo: 'Nuevo evento',
    cuerpo: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
      campoConLabel('Título', { placeholder: 'Reunión semanal' }),
      crearEl('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' } }, [
        campoConLabel('Fecha', { type: 'date' }),
        campoConLabel('Hora',  { type: 'time' }),
      ]),
      campoConLabel('Lugar / link', { placeholder: 'Sala de juntas o https://meet…' }),
      campoConLabel('Notas',         { placeholder: 'Agenda, recordatorios…' }),
    ]),
    pie,
  });
  pie.__bind(cerrar);
};

// ============================================================================
//  GRUPO 3 — Drawers / paneles laterales
// ============================================================================
const abrirDrawerDerecha = () => {
  const pie = piePar('Limpiar', 'Aplicar filtros', 'primary',
    () => notificar.exito('Filtros aplicados'));
  const { cerrar } = Modal.abrir({
    titulo: 'Filtros',
    posicion: 'derecha',
    cuerpo: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' } }, [
      crearEl('div', null, [
        crearEl('strong', { style: { fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--muted-foreground)', letterSpacing: '0.06em' } }, ['Categoría']),
        crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px', marginBlockStart: '8px' } }, [
          ['Camisetas (124)', 'Pantalones (89)', 'Zapatillas (56)', 'Accesorios (31)'].map((t) => crearEl('label', { style: { display: 'flex', gap: '8px', alignItems: 'center', fontSize: 'var(--text-sm)' } }, [
            crearEl('input', { type: 'checkbox' }),
            crearEl('span', null, [t]),
          ])),
        ].flat()),
      ]),
      crearEl('div', null, [
        crearEl('strong', { style: { fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--muted-foreground)', letterSpacing: '0.06em' } }, ['Precio']),
        crearEl('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBlockStart: '8px' } }, [
          campoConLabel('Mínimo', { type: 'number', placeholder: '0' }),
          campoConLabel('Máximo', { type: 'number', placeholder: '500' }),
        ]),
      ]),
      crearEl('div', null, [
        crearEl('strong', { style: { fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--muted-foreground)', letterSpacing: '0.06em' } }, ['Talla']),
        crearEl('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBlockStart: '8px' } },
          ['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((t) => Boton({ texto: t, variante: 'ghost', tamano: 'sm' }))),
      ]),
    ]),
    pie,
  });
  pie.__bind(cerrar);
};

const abrirDrawerIzquierda = () => {
  let cerrar;
  const itemNav = (icono, etiqueta, activo) => crearEl('button', {
    type: 'button',
    style: {
      display: 'flex', alignItems: 'center', gap: '12px',
      width: '100%', padding: '10px 14px',
      background: activo ? 'color-mix(in srgb, var(--primary) 12%, transparent)' : 'transparent',
      color: activo ? 'var(--primary)' : 'var(--foreground)',
      border: 0, borderRadius: 'var(--radius)',
      fontSize: 'var(--text-sm)', fontWeight: activo ? 600 : 500,
      textAlign: 'start', cursor: 'pointer',
    },
    onClick: () => { notificar.info(`Ir a ${etiqueta}`); cerrar(); },
  }, [Icono(icono, { tamano: 18 }), crearEl('span', null, [etiqueta])]);

  ({ cerrar } = Modal.abrir({
    titulo: 'template-vanilla',
    posicion: 'izquierda',
    tamano: 'sm',
    cuerpo: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px' } }, [
      itemNav('panel',      'Dashboard', true),
      itemNav('proyectos',  'Proyectos'),
      itemNav('eventos',    'Calendario'),
      itemNav('chat',       'Mensajes'),
      itemNav('grupos',     'Equipo'),
      itemNav('analitica',  'Analítica'),
      crearEl('hr', { style: { border: 0, borderTop: '1px solid var(--border)', margin: '8px 0' } }),
      itemNav('utilidades', 'Configuración'),
      itemNav('faq',        'Centro de ayuda'),
      itemNav('cerrar_sesion', 'Cerrar sesión'),
    ]),
  }));
};

const abrirDrawerArriba = () => {
  let cerrar;
  ({ cerrar } = Modal.abrir({
    titulo: '🔔 3 nuevas notificaciones',
    posicion: 'arriba',
    cuerpo: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' } }, [
      ['Emma respondió tu comentario', 'GitHub abrió PR #142', 'Nuevo evento mañana: "Sprint planning"'].map((msg) => crearEl('div', {
        style: {
          display: 'flex', gap: '12px', alignItems: 'center',
          padding: 'var(--space-3)', background: 'var(--surface)',
          border: '1px solid var(--border)', borderRadius: 'var(--radius)',
        },
      }, [
        crearEl('span', { style: { width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' } }),
        crearEl('span', { style: { flex: 1, fontSize: 'var(--text-sm)' } }, [msg]),
        crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, ['Hace 2 min']),
      ])),
    ].flat()),
    pie: Boton({ texto: 'Ver todas', variante: 'ghost', bloque: true,
      onClick: () => { notificar.info('Abriendo todas'); cerrar(); } }),
  }));
};

const abrirDrawerAbajo = () => {
  let cerrar;
  const accion = (icono, etiqueta, color) => crearEl('button', {
    type: 'button',
    style: {
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
      padding: 'var(--space-4)',
      background: 'transparent', border: 0, cursor: 'pointer',
      borderRadius: 'var(--radius)',
    },
    onClick: () => { notificar.info(etiqueta); cerrar(); },
  }, [
    crearEl('div', {
      style: {
        width: '48px', height: '48px',
        background: `color-mix(in srgb, ${color} 15%, transparent)`,
        color, borderRadius: '50%',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      },
    }, [Icono(icono, { tamano: 22 })]),
    crearEl('span', { style: { fontSize: 'var(--text-xs)', fontWeight: 600 } }, [etiqueta]),
  ]);

  ({ cerrar } = Modal.abrir({
    titulo: 'Compartir',
    posicion: 'abajo',
    cuerpo: crearEl('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-2)' } }, [
      accion('correo',     'Email',        'var(--primary)'),
      accion('chat',       'Mensaje',      'var(--color-success)'),
      accion('subir',      'Subir',        'var(--color-info)'),
      accion('descargar',  'Descargar',    'var(--color-warning)'),
      accion('editar',     'Editar',       '#8b5cf6'),
      accion('estrella',   'Favorito',     '#f59e0b'),
      accion('papelera',   'Eliminar',     'var(--color-danger)'),
      accion('utilidades', 'Más opciones', 'var(--muted-foreground)'),
    ]),
  }));
};

// ============================================================================
//  GRUPO 4 — Wizards / multi-step (4 variantes)
//  Cada indicador retorna un nodo con .actualizar(actual, total) — actualiza
//  el DOM en su sitio (sin re-crear) para que las transiciones CSS disparen.
// ============================================================================
const construirWizardBase = ({ totalPasos, render, crearIndicador, titulo, alFinalizar }) => {
  const paso = senal(1);
  const indicador = crearIndicador(totalPasos);
  const contenido = crearEl('div', { id: 'wz-content' }, [render(paso.value)]);
  const cuerpo = crearEl('div', null, [indicador, contenido]);

  let cerrar;
  const pie = crearEl('div', { style: { display: 'flex', gap: 'var(--space-2)', justifyContent: 'space-between', width: '100%' } });

  const refrescar = () => {
    indicador.actualizar(paso.value, totalPasos);          // <- in-place: anima
    contenido.replaceChildren(render(paso.value));
    pie.replaceChildren(
      Boton({
        texto: paso.value === 1 ? 'Cancelar' : 'Atrás',
        variante: 'ghost',
        onClick: () => { if (paso.value === 1) cerrar(); else { paso.value--; refrescar(); } },
      }),
      Boton({
        texto: paso.value === totalPasos ? 'Finalizar' : 'Siguiente',
        variante: 'primary',
        onClick: () => {
          if (paso.value === totalPasos) { alFinalizar?.(); cerrar(); }
          else { paso.value++; refrescar(); }
        },
      }),
    );
  };
  // Estado inicial: arrancar todo en paso 1
  indicador.actualizar(paso.value, totalPasos);
  refrescar();
  ({ cerrar } = Modal.abrir({ titulo, cuerpo, pie, tamano: 'lg' }));
};

// Variante 1 — Dots (la transición de color es por CSS)
const crearDots = (total) => {
  const dots = Array.from({ length: total }, () => crearEl('span', { class: 'modal-pasos__punto' }));
  const host = crearEl('div', { class: 'modal-pasos' }, dots);
  host.actualizar = (actual) => {
    dots.forEach((d, i) => {
      d.dataset.activo     = String(i + 1 === actual);
      d.dataset.completado = String(i + 1 < actual);
    });
  };
  return host;
};

// Variante 2 — Stepper horizontal (líneas se llenan animadas via ::before scaleX)
const crearStepperH = (total, labels = []) => {
  const pasos = [];
  const lineas = [];
  const nodos = [];
  for (let i = 1; i <= total; i++) {
    const num = crearEl('span', { class: 'modal-stepper__num' });
    const lbl = labels[i - 1] && crearEl('span', { class: 'modal-stepper__label' }, [labels[i - 1]]);
    const paso = crearEl('div', { class: 'modal-stepper__paso' },
      [num, lbl].filter(Boolean));
    pasos.push({ paso, num });
    nodos.push(paso);
    if (i < total) {
      const linea = crearEl('div', { class: 'modal-stepper__linea' });
      lineas.push(linea); nodos.push(linea);
    }
  }
  const host = crearEl('div', { class: 'modal-stepper' }, nodos);
  host.actualizar = (actual) => {
    pasos.forEach(({ paso, num }, i) => {
      const idx = i + 1;
      paso.dataset.activo     = String(idx === actual);
      paso.dataset.completado = String(idx < actual);
      num.textContent = idx < actual ? '✓' : String(idx);
    });
    lineas.forEach((l, i) => { l.dataset.completada = String(i + 1 < actual); });
  };
  return host;
};

// Variante 4 — Progress bar (el width transitiona por CSS, no recreamos el fill)
const crearProgreso = (_total) => {
  const fill = crearEl('div', { class: 'modal-progreso__fill', style: { width: '0%' } });
  const host = crearEl('div', { class: 'modal-progreso' }, [fill]);
  host.actualizar = (actual, total) => {
    // setTimeout 0 para que el frame inicial se renderice con 0% antes de animar
    requestAnimationFrame(() => { fill.style.width = `${(actual / total) * 100}%`; });
  };
  return host;
};

const renderPasoGenerico = (paso) => {
  if (paso === 1) return crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
    crearEl('h3', { style: { margin: 0 } }, ['Cuéntanos sobre ti']),
    campoConLabel('Nombre completo', { placeholder: 'María García' }),
    campoConLabel('Cargo',           { placeholder: 'Product Designer' }),
  ]);
  if (paso === 2) return crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
    crearEl('h3', { style: { margin: 0 } }, ['Tu equipo']),
    campoConLabel('Empresa',           { placeholder: 'Acme Inc.' }),
    campoConLabel('Tamaño del equipo', { placeholder: '1-10, 10-50, 50+' }),
  ]);
  if (paso === 3) return crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
    crearEl('h3', { style: { margin: 0 } }, ['Preferencias']),
    campoConLabel('Zona horaria', { placeholder: 'Madrid (UTC+1)' }),
    campoConLabel('Idioma',       { placeholder: 'Español' }),
  ]);
  return crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', textAlign: 'center', alignItems: 'center' } }, [
    crearEl('div', { class: 'modal-alerta__icono modal-alerta__icono--success' }, [Icono('check', { tamano: 28 })]),
    crearEl('h3', { style: { margin: 0 } }, ['¡Todo listo!']),
    crearEl('p', { style: { margin: 0, color: 'var(--muted-foreground)' } }, ['Tu cuenta está configurada.']),
  ]);
};

const abrirWizardDots = () => construirWizardBase({
  totalPasos: 4,
  crearIndicador: (t) => crearDots(t),
  render: renderPasoGenerico,
  titulo: 'Configuración (dots)',
  alFinalizar: () => notificar.exito('Configuración completada'),
});

const abrirWizardStepperH = () => construirWizardBase({
  totalPasos: 4,
  crearIndicador: (t) => crearStepperH(t, ['Cuenta', 'Equipo', 'Preferencias', 'Listo']),
  render: renderPasoGenerico,
  titulo: 'Configuración (stepper horizontal)',
  alFinalizar: () => notificar.exito('Configuración completada'),
});

const abrirWizardProgreso = () => construirWizardBase({
  totalPasos: 4,
  crearIndicador: (t) => crearProgreso(t),
  render: renderPasoGenerico,
  titulo: 'Configuración (progress bar)',
  alFinalizar: () => notificar.exito('Configuración completada'),
});

// Variante 3 — Stepper vertical (steps a la izquierda, contenido a la derecha)
const abrirWizardVertical = () => {
  const paso = senal(1);
  const totalPasos = 4;
  const labels = [
    { titulo: 'Cuenta',       sub: 'Tu información personal' },
    { titulo: 'Equipo',       sub: 'Empresa y tamaño' },
    { titulo: 'Preferencias', sub: 'Idioma y zona horaria' },
    { titulo: 'Listo',        sub: 'Confirmación final' },
  ];

  // Creamos los pasos una sola vez y los actualizamos in-place para que las
  // transiciones (línea conectora ::after que se llena, color del número) corran.
  const pasoNodos = labels.map((l) => {
    const num = crearEl('span', { class: 'modal-wizard-vertical__num' });
    const titulo = crearEl('span', { class: 'modal-wizard-vertical__titulo' }, [l.titulo]);
    const nodo = crearEl('div', { class: 'modal-wizard-vertical__paso' }, [
      num,
      crearEl('div', { class: 'modal-wizard-vertical__textos' }, [
        titulo,
        crearEl('span', { class: 'modal-wizard-vertical__sub' }, [l.sub]),
      ]),
    ]);
    return { nodo, num };
  });
  const pasosHost = crearEl('div', { class: 'modal-wizard-vertical__pasos' },
    pasoNodos.map((p) => p.nodo));

  const actualizarPasos = () => {
    pasoNodos.forEach(({ nodo, num }, i) => {
      const idx = i + 1;
      nodo.dataset.activo     = String(idx === paso.value);
      nodo.dataset.completado = String(idx < paso.value);
      num.textContent = idx < paso.value ? '✓' : String(idx);
    });
  };

  const contenido = crearEl('div', null, [renderPasoGenerico(paso.value)]);
  const cuerpo = crearEl('div', { class: 'modal-wizard-vertical' }, [pasosHost, contenido]);

  let cerrar;
  const pie = crearEl('div', { style: { display: 'flex', gap: 'var(--space-2)', justifyContent: 'space-between', width: '100%' } });
  const refrescar = () => {
    actualizarPasos();
    contenido.replaceChildren(renderPasoGenerico(paso.value));
    pie.replaceChildren(
      Boton({ texto: paso.value === 1 ? 'Cancelar' : 'Atrás', variante: 'ghost',
        onClick: () => { if (paso.value === 1) cerrar(); else { paso.value--; refrescar(); } } }),
      Boton({ texto: paso.value === totalPasos ? 'Finalizar' : 'Siguiente', variante: 'primary',
        onClick: () => {
          if (paso.value === totalPasos) { notificar.exito('Configuración completada'); cerrar(); }
          else { paso.value++; refrescar(); }
        } }),
    );
  };
  refrescar();
  ({ cerrar } = Modal.abrir({ titulo: 'Configuración (stepper vertical)', cuerpo, pie, tamano: 'lg' }));
};

// ============================================================================
//  GRUPO 5 — Detalle / preview
// ============================================================================
const abrirVerImagen = () => {
  let cerrar;
  const close = crearEl('button', {
    type: 'button', class: 'modal-lightbox-close',
    'aria-label': 'Cerrar', onClick: () => cerrar(),
  }, [Icono('cerrar', { tamano: 20 })]);
  const cuerpo = crearEl('div', {
    style: {
      position: 'relative', width: 'fit-content', maxWidth: '100%', margin: '0 auto',
    },
  }, [
    close,
    crearEl('img', {
      src: './public/img/gallery/2010.jpg',
      alt: 'Vista previa',
      style: { display: 'block', maxWidth: '100%', maxHeight: '80vh', borderRadius: 'var(--radius-md)' },
    }),
  ]);
  const resultado = Modal.abrir({ cuerpo, tamano: 'lg' });
  cerrar = resultado.cerrar;
  resultado.elemento.classList.add('modal--limpio');
};

const abrirDetalleProducto = () => {
  const pie = piePar('Cerrar', 'Añadir al carrito', 'primary',
    () => notificar.exito('Añadido al carrito'));
  const { cerrar } = Modal.abrir({
    tamano: 'lg',
    cuerpo: crearEl('div', { style: { display: 'grid', gridTemplateColumns: '240px 1fr', gap: 'var(--space-5)' } }, [
      crearEl('img', {
        src: './public/img/products/3.jpg', alt: 'Sneakers',
        style: { width: '100%', height: '240px', objectFit: 'cover', borderRadius: 'var(--radius-md)' },
      }),
      crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
        crearEl('div', { style: { display: 'flex', gap: 'var(--space-2)' } }, [
          Insignia({ texto: 'Nuevo', variante: 'success' }),
          Insignia({ texto: 'Free shipping', variante: 'info' }),
        ]),
        crearEl('strong', { style: { fontSize: 'var(--text-2xl)' } }, ['Sneakers Air Run']),
        crearEl('p', { style: { margin: 0, color: 'var(--muted-foreground)', lineHeight: 1.5 } },
          ['Suela de espuma adaptable, máxima ventilación. Diseñadas para corredores que buscan velocidad.']),
        crearEl('div', { style: { fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--primary)' } }, ['$129']),
        crearEl('div', { style: { display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' } },
          ['38', '39', '40', '41', '42', '43'].map((talla) => crearEl('button', {
            type: 'button',
            style: {
              minWidth: '40px', padding: '8px 12px',
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', cursor: 'pointer',
            },
          }, [talla])),
        ),
      ]),
    ]),
    pie,
  });
  pie.__bind(cerrar);
};

const abrirPerfilUsuario = () => {
  let cerrar;
  const pie = crearEl('div', { style: { display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' } }, [
    Boton({ texto: 'Cerrar',  variante: 'ghost',     onClick: () => cerrar() }),
    Boton({ texto: 'Mensaje', variante: 'secondary', onClick: () => { notificar.info('Abriendo chat'); cerrar(); } }),
    Boton({ texto: 'Seguir',  variante: 'primary',   onClick: () => { notificar.exito('Ahora sigues a Sara'); cerrar(); } }),
  ]);
  ({ cerrar } = Modal.abrir({
    tamano: 'sm',
    cuerpo: crearEl('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)', textAlign: 'center', padding: 'var(--space-2)' } }, [
      Avatar({ nombre: 'Sara Chen', tamano: 'xl' }),
      crearEl('strong', { style: { fontSize: 'var(--text-xl)' } }, ['Sara Chen']),
      crearEl('p', { style: { margin: 0, color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' } },
        ['Senior Product Designer · Diseño en San Francisco']),
      crearEl('div', { style: { display: 'flex', gap: 'var(--space-5)', marginBlockStart: 'var(--space-2)' } }, [
        ['1.2k|Seguidores', '340|Siguiendo', '86|Proyectos'].map((s) => {
          const [n, l] = s.split('|');
          return crearEl('div', null, [
            crearEl('strong', { style: { display: 'block', fontSize: 'var(--text-xl)' } }, [n]),
            crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [l]),
          ]);
        }),
      ].flat()),
    ]),
    pie,
  }));
};

const abrirDetallePedido = () => {
  const pie = piePar('Cerrar', 'Descargar factura', 'primary',
    () => notificar.info('Descargando factura'));
  const items = [
    { nombre: 'Camiseta verano',   cant: 2, precio: 29.90 },
    { nombre: 'Pantalón slim fit', cant: 1, precio: 59.00 },
    { nombre: 'Sneakers running',  cant: 1, precio: 129.00 },
  ];
  const total = items.reduce((s, it) => s + it.cant * it.precio, 0);
  const { cerrar } = Modal.abrir({
    titulo: 'Pedido #LP-2026-0428',
    cuerpo: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
      crearEl('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' } }, [
        crearEl('span', { style: { color: 'var(--muted-foreground)' } }, ['Estado']),
        Insignia({ texto: 'Enviado', variante: 'success' }),
      ]),
      crearEl('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' } }, [
        crearEl('span', { style: { color: 'var(--muted-foreground)' } }, ['Tracking']),
        crearEl('span', null, ['SP-49283492']),
      ]),
      crearEl('hr', { style: { border: 0, borderTop: '1px solid var(--border)', margin: 0 } }),
      ...items.map((it) => crearEl('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' } }, [
        crearEl('span', null, [`${it.cant} × ${it.nombre}`]),
        crearEl('span', { style: { fontVariantNumeric: 'tabular-nums' } }, [`$${(it.cant * it.precio).toFixed(2)}`]),
      ])),
      crearEl('hr', { style: { border: 0, borderTop: '1px solid var(--border)', margin: 0 } }),
      crearEl('div', { style: { display: 'flex', justifyContent: 'space-between', fontWeight: 700 } }, [
        crearEl('span', null, ['Total']),
        crearEl('span', { style: { fontVariantNumeric: 'tabular-nums' } }, [`$${total.toFixed(2)}`]),
      ]),
    ]),
    pie,
  });
  pie.__bind(cerrar);
};

// ============================================================================
//  GRUPO 6 — Selección / pickers
// ============================================================================
const abrirSelectorFecha = () => {
  const pie = piePar('Cancelar', 'Aplicar', 'primary',
    () => notificar.info('Rango aplicado'));
  const { cerrar } = Modal.abrir({
    titulo: 'Seleccionar rango de fechas',
    tamano: 'sm',
    cuerpo: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
      crearEl('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' } }, [
        campoConLabel('Desde', { type: 'date' }),
        campoConLabel('Hasta', { type: 'date' }),
      ]),
      crearEl('div', { style: { display: 'flex', gap: '6px', flexWrap: 'wrap' } },
        ['Hoy', 'Ayer', 'Últimos 7 días', 'Últimos 30 días', 'Este mes', 'Mes anterior']
          .map((p) => Boton({ texto: p, variante: 'ghost', tamano: 'xs' }))),
    ]),
    pie,
  });
  pie.__bind(cerrar);
};

const abrirSelectorColor = () => {
  const colores = [
    '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#64748b',
    '#1d4ed8', '#7c3aed', '#be185d', '#dc2626', '#d97706', '#059669', '#0891b2', '#475569',
  ];
  const elegido = senal(colores[0]);
  const grid = crearEl('div', { class: 'modal-color-picker' });
  const refrescar = () => grid.replaceChildren(...colores.map((c) => crearEl('button', {
    type: 'button', class: 'modal-color-picker__swatch',
    'data-activo': String(c === elegido.value),
    style: { background: c }, 'aria-label': c,
    onClick: () => { elegido.value = c; refrescar(); },
  })));
  refrescar();

  const pie = piePar('Cancelar', 'Aplicar color', 'primary',
    () => notificar.exito(`Color ${elegido.value} aplicado`));
  const { cerrar } = Modal.abrir({
    titulo: 'Selecciona un color',
    tamano: 'sm',
    cuerpo: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
      grid,
      campoConLabel('Color personalizado', { value: elegido.value, placeholder: '#000000' }),
    ]),
    pie,
  });
  pie.__bind(cerrar);
};

const abrirAsignarUsuario = () => {
  const personas = [
    { nombre: 'Sara Chen',     email: 'sara@template-vanilla.dev',    rol: 'Designer' },
    { nombre: 'Marcus Lee',    email: 'marcus@template-vanilla.dev',  rol: 'Engineer' },
    { nombre: 'Priya Patel',   email: 'priya@template-vanilla.dev',   rol: 'Eng Manager' },
    { nombre: 'Jorge Ramírez', email: 'jorge@template-vanilla.dev',   rol: 'iOS Dev' },
    { nombre: 'Lina Kowalski', email: 'lina@template-vanilla.dev',    rol: 'Data Analyst' },
  ];
  const elegido = senal(null);
  const lista = crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '320px', overflowY: 'auto' } });
  const refrescar = (filtro = '') => {
    const q = filtro.toLowerCase().trim();
    const visibles = q
      ? personas.filter((p) => p.nombre.toLowerCase().includes(q) || p.email.toLowerCase().includes(q))
      : personas;
    lista.replaceChildren(...visibles.map((p) => crearEl('div', {
      class: 'modal-persona',
      onClick: () => { elegido.value = p.email; refrescar(filtro); },
    }, [
      Avatar({ nombre: p.nombre, tamano: 'sm' }),
      crearEl('div', { class: 'modal-persona__cuerpo' }, [
        crearEl('span', { class: 'modal-persona__nombre' }, [p.nombre]),
        crearEl('span', { class: 'modal-persona__email' }, [`${p.email} · ${p.rol}`]),
      ]),
      elegido.value === p.email
        ? crearEl('span', { class: 'modal-persona__check' }, [Icono('check', { tamano: 18 })])
        : null,
    ])));
  };
  refrescar();

  const pie = piePar('Cancelar', 'Asignar', 'primary',
    () => notificar.exito(`Asignado a ${elegido.value || 'nadie'}`));
  const { cerrar } = Modal.abrir({
    titulo: 'Asignar a usuario',
    cuerpo: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' } }, [
      Campo({ placeholder: 'Buscar por nombre o email…', onInput: (e) => refrescar(e.currentTarget.value) }),
      lista,
    ]),
    pie,
  });
  pie.__bind(cerrar);
};

const abrirCompartir = () => {
  const pie = piePar('Cerrar', 'Copiar enlace', 'primary',
    () => notificar.exito('Enlace copiado'));
  const { cerrar } = Modal.abrir({
    titulo: 'Compartir documento',
    cuerpo: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
      crearEl('div', { style: { display: 'flex', gap: 'var(--space-2)' } }, [
        Campo({ value: 'https://template-vanilla.dev/d/abc-xyz-123', style: { flex: 1 } }),
        Boton({ texto: 'Copiar', variante: 'secondary', onClick: () => notificar.exito('Copiado') }),
      ]),
      crearEl('label', { style: { display: 'flex', flexDirection: 'column', gap: '6px' } }, [
        crearEl('span', { style: { fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--muted-foreground)' } }, ['Acceso del enlace']),
        crearEl('select', { style: {
          padding: '8px 12px', fontSize: 'var(--text-sm)',
          background: 'var(--background)', color: 'var(--foreground)',
          border: '1px solid var(--border)', borderRadius: 'var(--radius)',
        } }, [
          crearEl('option', null, ['🔒 Sólo personas invitadas']),
          crearEl('option', null, ['🔗 Cualquiera con el enlace puede ver']),
          crearEl('option', null, ['✏️ Cualquiera con el enlace puede editar']),
        ]),
      ]),
    ]),
    pie,
  });
  pie.__bind(cerrar);
};

// ============================================================================
//  GRUPO 7 — Configuración con tabs (horizontales y laterales)
// ============================================================================
const abrirTabsHorizontales = () => {
  const pie = piePar('Cerrar', 'Guardar', 'primary',
    () => notificar.exito('Configuración guardada'));
  const tabs = Pestanas({
    variante: 'underline',
    items: [
      { id: 'general', etiqueta: 'General',
        contenido: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
          campoConLabel('Nombre del workspace', { value: 'Acme Inc.' }),
          campoConLabel('URL personalizada',     { value: 'acme.template-vanilla.dev' }),
        ]) },
      { id: 'miembros',     etiqueta: 'Miembros',
        contenido: crearEl('p', { style: { color: 'var(--muted-foreground)' } }, ['Lista de los 12 miembros del workspace…']) },
      { id: 'facturacion',  etiqueta: 'Facturación',
        contenido: crearEl('p', { style: { color: 'var(--muted-foreground)' } }, ['Plan Pro · próximo cargo el 15 de mayo · $19']) },
      { id: 'integraciones', etiqueta: 'Integraciones',
        contenido: crearEl('p', { style: { color: 'var(--muted-foreground)' } }, ['Slack, GitHub, Linear conectados.']) },
    ],
  });
  const { cerrar } = Modal.abrir({
    titulo: 'Configuración del workspace',
    tamano: 'lg',
    cuerpo: tabs,
    pie,
  });
  pie.__bind(cerrar);
};

const abrirTabsLaterales = () => {
  const tabActivo = senal('cuenta');
  const items = [
    { id: 'cuenta',       icono: 'perfil',     etiqueta: 'Cuenta' },
    { id: 'seguridad',    icono: 'seguridad',  etiqueta: 'Seguridad' },
    { id: 'notificaciones', icono: 'campana',  etiqueta: 'Notificaciones' },
    { id: 'apariencia',   icono: 'paleta',     etiqueta: 'Apariencia' },
    { id: 'idioma',       icono: 'globo',      etiqueta: 'Idioma' },
    { id: 'facturacion',  icono: 'precios',    etiqueta: 'Facturación' },
    { id: 'integraciones', icono: 'utilidades', etiqueta: 'Integraciones' },
  ];

  const renderContenido = () => {
    const t = tabActivo.value;
    const titulos = {
      cuenta:        'Información de la cuenta',
      seguridad:     'Seguridad y autenticación',
      notificaciones: 'Preferencias de notificación',
      apariencia:    'Tema y apariencia',
      idioma:        'Idioma y región',
      facturacion:   'Plan y facturación',
      integraciones: 'Integraciones conectadas',
    };
    const contenidos = {
      cuenta: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
        campoConLabel('Nombre',  { value: 'María García' }),
        campoConLabel('Email',   { type: 'email', value: 'maria@template-vanilla.dev' }),
        campoConLabel('Cargo',   { value: 'Product Designer' }),
      ]),
      seguridad: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
        crearEl('p', { style: { margin: 0, color: 'var(--muted-foreground)' } }, ['Activa la autenticación de dos factores y revisa tus sesiones activas.']),
        Boton({ texto: 'Activar 2FA', variante: 'primary' }),
      ]),
      notificaciones: crearEl('p', { style: { color: 'var(--muted-foreground)' } }, ['Email semanal · alertas push · sin SMS']),
      apariencia:    crearEl('p', { style: { color: 'var(--muted-foreground)' } }, ['Tema actual: oscuro. Acento: azul.']),
      idioma:        crearEl('p', { style: { color: 'var(--muted-foreground)' } }, ['Español (España) · Madrid (UTC+1)']),
      facturacion:   crearEl('p', { style: { color: 'var(--muted-foreground)' } }, ['Plan Pro · $19/mes · próximo cargo 15 de mayo']),
      integraciones: crearEl('p', { style: { color: 'var(--muted-foreground)' } }, ['Slack · GitHub · Linear conectados.']),
    };
    return crearEl('div', null, [
      crearEl('h3', { style: { margin: '0 0 var(--space-3)' } }, [titulos[t]]),
      contenidos[t],
    ]);
  };

  const cuerpo = crearEl('div', { class: 'modal-tabs-lateral' }, [
    crearEl('nav', { class: 'modal-tabs-lateral__nav' },
      items.map((it) => crearEl('button', {
        type: 'button', class: 'modal-tabs-lateral__tab',
        'data-activo': String(it.id === tabActivo.value),
        onClick: () => { tabActivo.value = it.id; refrescar(); },
      }, [Icono(it.icono, { tamano: 16 }), crearEl('span', null, [it.etiqueta])])),
    ),
    crearEl('div', { class: 'modal-tabs-lateral__contenido', id: 'tabs-lat-cont' }, [renderContenido()]),
  ]);

  const refrescar = () => {
    cuerpo.querySelectorAll('.modal-tabs-lateral__tab').forEach((t, i) => {
      t.dataset.activo = String(items[i].id === tabActivo.value);
    });
    cuerpo.querySelector('#tabs-lat-cont').replaceChildren(renderContenido());
  };

  const pie = piePar('Cerrar', 'Guardar', 'primary',
    () => notificar.exito('Cambios guardados'));
  const { cerrar } = Modal.abrir({
    titulo: 'Configuración',
    tamano: 'lg',
    cuerpo,
    pie,
  });
  pie.__bind(cerrar);
};

// ============================================================================
//  GRUPO 8 — Casos especiales
// ============================================================================
const abrirBienvenida = () => {
  let cerrar;
  const pie = crearEl('div', { style: { display: 'flex', gap: 'var(--space-2)', justifyContent: 'space-between', width: '100%' } }, [
    Boton({ texto: 'Saltar tour', variante: 'ghost',   onClick: () => cerrar() }),
    Boton({ texto: 'Empezar',     variante: 'primary', onClick: () => { notificar.info('Comenzando tour'); cerrar(); } }),
  ]);
  ({ cerrar } = Modal.abrir({
    tamano: 'sm',
    cuerpo: crearEl('div', null, [
      crearEl('div', { class: 'modal-hero' }, [
        crearEl('div', { class: 'modal-hero__icono' }, [Icono('brillos', { tamano: 32 })]),
        crearEl('strong', { style: { fontSize: 'var(--text-xl)', fontWeight: 700 } }, ['¡Bienvenido a template-vanilla!']),
        crearEl('p', { style: { margin: 0, fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' } },
          ['Estamos contentos de tenerte aquí. Te guiamos en 30 segundos.']),
      ]),
      crearEl('ul', { style: { margin: 0, padding: '0 0 0 20px', display: 'flex', flexDirection: 'column', gap: '8px' } }, [
        crearEl('li', null, ['Crea tu primer proyecto y arrastra tus archivos.']),
        crearEl('li', null, ['Invita a tu equipo — el plan gratuito incluye 5 personas.']),
        crearEl('li', null, ['Personaliza el dashboard con widgets que te sirvan.']),
      ]),
    ]),
    pie,
  }));
};

const abrirSeleccionPlan = () => {
  const seleccionado = senal('pro');
  const planes = [
    { id: 'free', nombre: 'Gratis', precio: '$0',  desc: 'Hasta 3 proyectos · 1 GB · Comunidad' },
    { id: 'pro',  nombre: 'Pro',    precio: '$19', desc: 'Proyectos ilimitados · 100 GB · Soporte prioritario' },
    { id: 'team', nombre: 'Team',   precio: '$49', desc: 'Pro + 10 usuarios · SSO · Roles avanzados' },
  ];
  const grid = crearEl('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)' } });
  const refrescar = () => grid.replaceChildren(...planes.map((p) => crearEl('div', {
    class: 'modal-plan',
    'data-activo': String(seleccionado.value === p.id),
    onClick: () => { seleccionado.value = p.id; refrescar(); },
  }, [
    crearEl('strong', { class: 'modal-plan__nombre' }, [p.nombre]),
    crearEl('span', { class: 'modal-plan__precio' }, [p.precio,
      crearEl('span', { style: { fontSize: 'var(--text-xs)', fontWeight: 400, color: 'var(--muted-foreground)' } }, [' /mes'])]),
    crearEl('p', { class: 'modal-plan__desc' }, [p.desc]),
  ])));
  refrescar();

  const pie = piePar('Cancelar', 'Cambiar plan', 'primary',
    () => notificar.exito(`Plan ${planes.find((p) => p.id === seleccionado.value).nombre} seleccionado`));
  const { cerrar } = Modal.abrir({
    titulo: 'Elige un plan', tamano: 'lg', cuerpo: grid, pie,
  });
  pie.__bind(cerrar);
};

const abrirCheckout = () => {
  const pie = piePar('Cancelar', 'Pagar $129', 'primary',
    () => notificar.exito('Pago procesado'));
  const { cerrar } = Modal.abrir({
    titulo: 'Confirmar pago',
    cuerpo: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
      crearEl('div', { class: 'modal-tarjeta-pago' }, [
        crearEl('div', { class: 'modal-tarjeta-pago__brand' }, ['VISA']),
        crearEl('div', { style: { flex: 1 } }, [
          crearEl('div', { style: { fontSize: 'var(--text-sm)', fontWeight: 600 } }, ['•••• •••• •••• 4242']),
          crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, ['Vence 12/27']),
        ]),
        Boton({ texto: 'Cambiar', variante: 'ghost', tamano: 'sm' }),
      ]),
      crearEl('div', { style: { padding: 'var(--space-3)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' } }, [
        crearEl('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', marginBlockEnd: '6px' } }, [
          crearEl('span', { style: { color: 'var(--muted-foreground)' } }, ['Subtotal']),
          crearEl('span', null, ['$120.00']),
        ]),
        crearEl('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', marginBlockEnd: '6px' } }, [
          crearEl('span', { style: { color: 'var(--muted-foreground)' } }, ['Impuestos']),
          crearEl('span', null, ['$9.00']),
        ]),
        crearEl('hr', { style: { border: 0, borderTop: '1px solid var(--border)', margin: '8px 0' } }),
        crearEl('div', { style: { display: 'flex', justifyContent: 'space-between', fontWeight: 700 } }, [
          crearEl('span', null, ['Total']),
          crearEl('span', null, ['$129.00']),
        ]),
      ]),
    ]),
    pie,
  });
  pie.__bind(cerrar);
};

const abrirTerminos = () => {
  const pie = piePar('Rechazar', 'Aceptar términos', 'primary',
    () => notificar.exito('Términos aceptados'));
  const { cerrar } = Modal.abrir({
    titulo: 'Términos y condiciones',
    tamano: 'lg',
    cuerpo: crearEl('div', { style: { fontSize: 'var(--text-sm)', lineHeight: 1.6, color: 'var(--muted-foreground)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
      ['1. Aceptación', '2. Cuenta de usuario', '3. Privacidad', '4. Pago y facturación', '5. Contenido del usuario', '6. Limitación de responsabilidad', '7. Cambios a los términos'].map((t) => crearEl('div', null, [
        crearEl('h3', { style: { color: 'var(--foreground)', margin: '0 0 var(--space-1)' } }, [t]),
        crearEl('p', { style: { margin: 0 } },
          ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.']),
      ])),
    ].flat()),
    pie,
  });
  pie.__bind(cerrar);
};

const abrirSesionExpirada = () => {
  let cerrar;
  const pie = crearEl('div', { style: { display: 'flex', gap: 'var(--space-2)', justifyContent: 'center', width: '100%' } }, [
    Boton({ texto: 'Iniciar sesión de nuevo', variante: 'primary', bloque: true,
      onClick: () => { notificar.info('Redirigiendo…'); cerrar(); } }),
  ]);
  ({ cerrar } = Modal.abrir({
    tamano: 'sm', cerrarConFondo: false,
    cuerpo: cuerpoAlerta({
      icono: 'reloj', color: 'warning',
      titulo: 'Tu sesión ha expirado',
      mensaje: 'Por seguridad cerramos tu sesión después de 30 minutos sin actividad. Inicia sesión de nuevo para continuar.',
    }),
    pie,
  }));
};

const abrirFullscreen = () => {
  let cerrar;
  const pie = crearEl('div', { style: { display: 'flex', gap: 'var(--space-2)', justifyContent: 'space-between', width: '100%', alignItems: 'center' } }, [
    crearEl('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } },
      ['Última edición: hace 2 minutos · auto-guardado activo']),
    crearEl('div', { style: { display: 'flex', gap: 'var(--space-2)' } }, [
      Boton({ texto: 'Compartir', variante: 'ghost',     icono: Icono('subir',     { tamano: 16 }) }),
      Boton({ texto: 'Exportar',  variante: 'secondary', icono: Icono('descargar', { tamano: 16 }) }),
      Boton({ texto: 'Guardar',   variante: 'primary',
        onClick: () => { notificar.exito('Mockup guardado'); cerrar(); } }),
    ]),
  ]);
  ({ cerrar } = Modal.abrir({
    tamano: 'fullscreen',
    titulo: 'Editor de mockup — proyecto-2026.fig',
    cuerpo: crearEl('div', { style: { height: '100%', display: 'grid', gridTemplateColumns: '240px 1fr 280px', gap: 'var(--space-3)', minHeight: '60vh' } }, [
      crearEl('div', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)' } }, [
        crearEl('strong', { style: { fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--muted-foreground)' } }, ['Capas']),
        crearEl('p', { style: { margin: 'var(--space-2) 0 0', color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' } }, ['Header · Hero · Features · CTA · Footer']),
      ]),
      crearEl('div', { style: { background: 'color-mix(in srgb, var(--foreground) 4%, var(--background))', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-foreground)' } }, ['Canvas (vista del editor)']),
      crearEl('div', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)' } }, [
        crearEl('strong', { style: { fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--muted-foreground)' } }, ['Propiedades']),
        crearEl('p', { style: { margin: 'var(--space-2) 0 0', color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' } }, ['Posición, tamaño, color, sombra…']),
      ]),
    ]),
    pie,
  }));
};

// ============================================================================
//  Página
// ============================================================================
export default async () => PaginaShowcase({
  titulo: 'Modales',
  descripcion: 'Diálogos centrados con backdrop. Portal a `document.body`, atrapan el foco, ESC para cerrar, click fuera por defecto. Soportan tamaños (sm/md/lg/xl/fullscreen) y posición (`centro` default · `derecha`/`izquierda`/`arriba`/`abajo` para drawers).',
  decoracion: corner6(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    // ============== 1. ALERTAS ==============
    Seccion({
      titulo: '1 · Alertas y confirmaciones',
      descripcion: 'Modal corto centrado con icono coloreado + título + mensaje. 5 patrones que cubren el 80% de los casos: destructivo, advertencia, info, éxito, error.',
      hijos: [VistaCodigo({
        vista: fila(
          Boton({ texto: 'Eliminar (destructivo)', variante: 'danger',    onClick: abrirEliminar }),
          Boton({ texto: 'Guardar / descartar',     variante: 'secondary', onClick: abrirGuardar }),
          Boton({ texto: 'Información',             variante: 'secondary', onClick: abrirInfo }),
          Boton({ texto: 'Éxito',                   variante: 'success',   onClick: abrirExito }),
          Boton({ texto: 'Error',                   variante: 'secondary', onClick: abrirError }),
        ),
        codigo: `Modal.abrir({
  tamano: 'sm',
  cuerpo: cuerpoAlerta({
    icono: 'alerta', color: 'danger',
    titulo: '¿Eliminar tu cuenta?',
    mensaje: 'Esta acción es permanente.',
  }),
  pie: piePar('Cancelar', 'Sí, eliminar', 'danger', onConfirm),
})`,
      })],
    }),

    // ============== 2. FORMULARIOS ==============
    Seccion({
      titulo: '2 · Formularios (crear / editar)',
      descripcion: 'El cuerpo acepta formularios completos. Casos típicos: crear recurso, editar perfil con avatar, cambiar contraseña, invitar usuario por email, agendar evento.',
      hijos: [VistaCodigo({
        vista: fila(
          Boton({ texto: 'Nuevo proyecto',     variante: 'primary',   onClick: abrirNuevoProyecto }),
          Boton({ texto: 'Editar perfil',      variante: 'secondary', onClick: abrirEditarPerfil }),
          Boton({ texto: 'Cambiar contraseña', variante: 'secondary', onClick: abrirCambiarPassword }),
          Boton({ texto: 'Invitar usuario',    variante: 'secondary', onClick: abrirInvitar }),
          Boton({ texto: 'Crear evento',       variante: 'secondary', onClick: abrirCrearEvento }),
        ),
        codigo: `Modal.abrir({
  titulo: 'Nuevo proyecto',
  cuerpo: crearEl('div', null, [
    campoConLabel('Nombre',      { placeholder: 'Ej. template-vanilla Web' }),
    campoConLabel('Descripción', { placeholder: 'Breve descripción' }),
  ]),
  pie: piePar('Cancelar', 'Crear proyecto', 'primary', onCrear),
})`,
      })],
    }),

    // ============== 3. DRAWERS LATERALES ==============
    Seccion({
      titulo: '3 · Drawers / paneles laterales',
      descripcion: 'Modales que entran desde un borde de la ventana. Pasa `posicion: derecha | izquierda | arriba | abajo`. Útiles para filtros (derecha), menú móvil (izquierda), notificaciones (arriba) y action sheets (abajo).',
      hijos: [VistaCodigo({
        vista: fila(
          Boton({ texto: 'Drawer derecha (filtros)',     variante: 'secondary', onClick: abrirDrawerDerecha }),
          Boton({ texto: 'Drawer izquierda (nav móvil)',  variante: 'secondary', onClick: abrirDrawerIzquierda }),
          Boton({ texto: 'Drawer arriba (notificaciones)', variante: 'secondary', onClick: abrirDrawerArriba }),
          Boton({ texto: 'Drawer abajo (action sheet)',  variante: 'secondary', onClick: abrirDrawerAbajo }),
        ),
        codigo: `Modal.abrir({
  titulo: 'Filtros',
  posicion: 'derecha',                   // derecha | izquierda | arriba | abajo
  cuerpo: <contenido>,
  pie: <botones>,
})

// El drawer entra animado desde el borde correspondiente.
// Ancho default: 28rem para laterales · 80vh max para arriba/abajo.
// Tamaños sm/lg/xl ajustan el ancho del drawer lateral.`,
      })],
    }),

    // ============== 4. WIZARDS ==============
    Seccion({
      titulo: '4 · Wizards / multi-step (4 variantes)',
      descripcion: 'Indicadores de progreso para configuración paso a paso. 4 estilos visuales según el contexto: dots minimalistas, stepper horizontal con números, stepper vertical (steps a la izquierda, contenido a la derecha) y progress bar superior.',
      hijos: [VistaCodigo({
        vista: fila(
          Boton({ texto: 'Wizard · dots',              variante: 'primary',   onClick: abrirWizardDots }),
          Boton({ texto: 'Wizard · stepper horizontal', variante: 'secondary', onClick: abrirWizardStepperH }),
          Boton({ texto: 'Wizard · stepper vertical',   variante: 'secondary', onClick: abrirWizardVertical }),
          Boton({ texto: 'Wizard · progress bar',       variante: 'secondary', onClick: abrirWizardProgreso }),
        ),
        codigo: `// Helper genérico construirWizardBase({ totalPasos, render, indicador, … })
// Las 4 variantes sólo difieren en el "indicador":

indicadorDots(actual, total)         // <span class="modal-pasos__punto" data-activo>
indicadorStepperH(actual, total, labels)  // ① ── ② ── ③ con etiquetas
indicadorVertical(...)                // pasos en columna a la izquierda
indicadorProgreso(actual, total)     // barra arriba con width: %

// Cada paso renderiza su propio contenido — igual de flexible.`,
      })],
    }),

    // ============== 5. DETALLE / PREVIEW ==============
    Seccion({
      titulo: '5 · Detalle / preview',
      descripcion: 'Para mostrar información detallada — imágenes en lightbox (sin chrome), fichas de producto, perfiles de usuario con stats, detalle de pedidos con line items.',
      hijos: [VistaCodigo({
        vista: fila(
          Boton({ texto: 'Imagen (lightbox)',  variante: 'secondary', onClick: abrirVerImagen }),
          Boton({ texto: 'Detalle de producto', variante: 'secondary', onClick: abrirDetalleProducto }),
          Boton({ texto: 'Perfil de usuario',   variante: 'secondary', onClick: abrirPerfilUsuario }),
          Boton({ texto: 'Detalle de pedido',   variante: 'secondary', onClick: abrirDetallePedido }),
        ),
        codigo: `// Lightbox sin header — clase .modal--limpio quita el chrome
const { cerrar, elemento } = Modal.abrir({
  cuerpo: crearEl('div', { style: { width: 'fit-content', margin: '0 auto' } }, [
    closeButton, img,
  ]),
});
elemento.classList.add('modal--limpio');`,
      })],
    }),

    // ============== 6. PICKERS ==============
    Seccion({
      titulo: '6 · Selección / pickers',
      descripcion: 'Diálogos para elegir un valor — fechas con presets rápidos, color picker (16 swatches + custom), asignar a usuario (lista filtrable), compartir documento (link + permisos).',
      hijos: [VistaCodigo({
        vista: fila(
          Boton({ texto: 'Selector de fecha',  variante: 'secondary', onClick: abrirSelectorFecha }),
          Boton({ texto: 'Selector de color',  variante: 'secondary', onClick: abrirSelectorColor }),
          Boton({ texto: 'Asignar a usuario',  variante: 'secondary', onClick: abrirAsignarUsuario }),
          Boton({ texto: 'Compartir documento', variante: 'secondary', onClick: abrirCompartir }),
        ),
        codigo: `// Color picker con grid de swatches reactivos
const elegido = senal('#3b82f6');
const grid = crearEl('div', { class: 'modal-color-picker' });

const refrescar = () => grid.replaceChildren(...colores.map(c => crearEl('button', {
  class: 'modal-color-picker__swatch',
  'data-activo': String(c === elegido.value),
  style: { background: c },
  onClick: () => { elegido.value = c; refrescar(); },
})));`,
      })],
    }),

    // ============== 7. CONFIGURACIÓN CON TABS ==============
    Seccion({
      titulo: '7 · Configuración con tabs',
      descripcion: 'Para paneles de settings con varias secciones. Dos layouts: tabs horizontales arriba (Pestañas component) o tabs laterales tipo macOS Preferences (sidebar vertical con icono + label, contenido a la derecha).',
      hijos: [VistaCodigo({
        vista: fila(
          Boton({ texto: 'Tabs horizontales (arriba)',  variante: 'secondary', onClick: abrirTabsHorizontales }),
          Boton({ texto: 'Tabs laterales (sidebar)',     variante: 'primary',   onClick: abrirTabsLaterales }),
        ),
        codigo: `// Tabs laterales con grid 200px + 1fr
const cuerpo = crearEl('div', { class: 'modal-tabs-lateral' }, [
  crearEl('nav', { class: 'modal-tabs-lateral__nav' },
    items.map(it => crearEl('button', {
      class: 'modal-tabs-lateral__tab',
      'data-activo': String(it.id === tabActivo.value),
      onClick: () => { tabActivo.value = it.id; refrescar(); },
    }, [Icono(it.icono), it.etiqueta])),
  ),
  crearEl('div', { class: 'modal-tabs-lateral__contenido' }, [renderContenido()]),
]);`,
      })],
    }),

    // ============== 8. ESPECIALES ==============
    Seccion({
      titulo: '8 · Casos especiales',
      descripcion: 'Patrones más complejos — bienvenida con hero gradient, selección de plan, checkout, sesión expirada (no se cierra con click fuera), términos largos con scroll y editor en pantalla completa.',
      hijos: [VistaCodigo({
        vista: fila(
          Boton({ texto: 'Bienvenida (welcome)', variante: 'primary',   onClick: abrirBienvenida }),
          Boton({ texto: 'Selección de plan',     variante: 'secondary', onClick: abrirSeleccionPlan }),
          Boton({ texto: 'Pago / checkout',       variante: 'secondary', onClick: abrirCheckout }),
          Boton({ texto: 'Términos largos',       variante: 'secondary', onClick: abrirTerminos }),
          Boton({ texto: 'Sesión expirada',       variante: 'warning',   onClick: abrirSesionExpirada }),
          Boton({ texto: 'Pantalla completa',     variante: 'secondary', onClick: abrirFullscreen }),
        ),
        codigo: `// Modal bloqueante (no cierra con click fuera)
Modal.abrir({
  tamano: 'sm',
  cerrarConFondo: false,                   // <- bloquea click-outside
  cuerpo: cuerpoAlerta({
    icono: 'reloj', color: 'warning',
    titulo: 'Tu sesión ha expirado',
    mensaje: 'Inicia sesión de nuevo para continuar.',
  }),
  pie: Boton({ texto: 'Iniciar sesión', variante: 'primary', bloque: true }),
})`,
      })],
    }),

    // ============== 9. TAMAÑOS ==============
    Seccion({
      titulo: '9 · Tamaños',
      descripcion: '`tamano` controla el `max-width`: `sm` (24rem · ~384px), `md` (32rem · 512px, default), `lg` (48rem · 768px), `xl` (64rem · 1024px) y `fullscreen` (100vw × 100vh, sin border-radius).',
      hijos: [VistaCodigo({
        vista: fila(
          Boton({ texto: 'sm — Pequeño', variante: 'secondary',
            onClick: () => Modal.abrir({ titulo: 'Modal sm', tamano: 'sm',
              cuerpo: crearEl('p', { style: { margin: 0 } },
                ['Versión compacta — 24rem (~384px). Para confirmaciones y alertas.']) }) }),
          Boton({ texto: 'md — Mediano (default)', variante: 'secondary',
            onClick: () => Modal.abrir({ titulo: 'Modal md',
              cuerpo: crearEl('p', { style: { margin: 0 } },
                ['Tamaño por defecto — 32rem (~512px). Mayoría de los casos.']) }) }),
          Boton({ texto: 'lg — Grande', variante: 'secondary',
            onClick: () => Modal.abrir({ titulo: 'Modal lg', tamano: 'lg',
              cuerpo: crearEl('p', { style: { margin: 0 } },
                ['Más espacio — 48rem (~768px). Formularios largos, layouts en columnas.']) }) }),
          Boton({ texto: 'xl — Extra grande', variante: 'secondary',
            onClick: () => Modal.abrir({ titulo: 'Modal xl', tamano: 'xl',
              cuerpo: crearEl('p', { style: { margin: 0 } },
                ['Máximo ancho — 64rem (~1024px). Tablas, dashboards embebidos.']) }) }),
          Boton({ texto: 'fullscreen', variante: 'secondary',
            onClick: () => Modal.abrir({ titulo: 'Modal fullscreen', tamano: 'fullscreen',
              cuerpo: crearEl('p', { style: { margin: 0 } },
                ['100vw × 100vh. Editores complejos, herramientas tipo Figma.']) }) }),
        ),
        codigo: `Modal.abrir({ tamano: 'sm',         cuerpo: nodo })   // 24rem
Modal.abrir({ tamano: 'md',         cuerpo: nodo })   // 32rem (default)
Modal.abrir({ tamano: 'lg',         cuerpo: nodo })   // 48rem
Modal.abrir({ tamano: 'xl',         cuerpo: nodo })   // 64rem
Modal.abrir({ tamano: 'fullscreen', cuerpo: nodo })   // 100vw × 100vh`,
      })],
    }),

  ],
});
