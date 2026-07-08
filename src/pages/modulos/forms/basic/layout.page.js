/**
 * Form layouts — 8 patrones para proyectos corporativos.
 *  1. Vertical             → el más común, label arriba
 *  2. Horizontal            → label izquierda, input derecha (settings/admin)
 *  3. Grid 2-col            → pares de campos lado a lado
 *  4. Secciones con heading → forms largos divididos lógicamente
 *  5. Sidebar de info       → form + tarjeta de help (Stripe / Vercel)
 *  6. Settings con tabs     → tabs verticales a la izquierda, panel a la derecha
 *  7. Sticky footer         → footer flotante con acciones siempre visible
 *  8. Inline / filtros      → form en una sola línea (toolbars, filtros)
 */
import { crearEl } from '../../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../../components/ui/code-preview/code-preview.js';
import { Icono } from '../../../../components/ui/icon/icons.js';
import { corner6 } from '../../../../components/ui/card/card-decoraciones.js';
import { Campo, Input, Select, Textarea, Switch, InputGrupo, Stack } from '../_compartido.js';

// Helpers locales
const Btn = (texto, variante = 'primary', extra = {}) => crearEl('button', {
  type: extra.type || 'button',
  class: ['btn', variante !== 'primary' && `btn--${variante}`],
  ...extra,
}, [texto]);

const FormaCol = (...nodos) => crearEl('form', {
  class: 'layout-form',
  onSubmit: (e) => e.preventDefault(),
}, nodos);

const SeccionTitulo = (titulo, descripcion) => crearEl('div', { class: 'layout-seccion-head' }, [
  crearEl('h3', { class: 'layout-seccion-head__titulo' }, [titulo]),
  descripcion && crearEl('p', { class: 'layout-seccion-head__desc' }, [descripcion]),
]);

const Footer = (...botones) => crearEl('div', { class: 'layout-footer' }, botones);

export default async () => PaginaShowcase({
  titulo: 'Form layouts',
  descripcion: '8 patrones de organización de campos para proyectos corporativos: vertical, horizontal, grid 2-col, secciones con headings, sidebar de info, settings con tabs verticales, sticky footer y form inline. Cada uno apto para un contexto: settings, checkout, signup, profile, admin, filtros.',
  decoracion: corner6(),
  migas: [
    { etiqueta: 'Módulos', href: '#/modulos' },
    { etiqueta: 'Formularios', href: '#/modulos/forms' },
  ],
  hijos: [

    // ========== 1 ==========
    Seccion({
      titulo: '1 · Vertical (default)',
      descripcion: 'Label arriba, input abajo, campos apilados. El más común y accesible. Funciona en cualquier ancho.',
      hijos: [VistaCodigo({
        vista: FormaCol(
          Campo({ label: 'Nombre', requerido: true, hijos: Input({ placeholder: 'María García' }) }),
          Campo({ label: 'Email', requerido: true, hijos: Input({ type: 'email', placeholder: 'maria@template-vanilla.dev' }) }),
          Campo({ label: 'Mensaje', hijos: Textarea({ placeholder: '¿Cómo podemos ayudarte?', filas: 3 }) }),
          crearEl('div', { class: 'layout-acciones-inicio' }, [Btn('Enviar', 'primary', { type: 'submit' })]),
        ),
        codigo: `<form class="layout-form">
  <Campo label="Nombre" hijos={Input(...)} />
  <Campo label="Email"  hijos={Input(...)} />
  <Campo label="Mensaje" hijos={Textarea(...)} />
  <button class="btn">Enviar</button>
</form>`,
      })],
    }),

    // ========== 2 ==========
    Seccion({
      titulo: '2 · Horizontal — label izquierda',
      descripcion: 'Label a la izquierda con ancho fijo, input a la derecha ocupando el resto. Denso visualmente — ideal para settings pages y admin panels donde el usuario escanea rápido.',
      hijos: [VistaCodigo({
        vista: crearEl('form', { class: 'layout-form layout-form--horizontal', onSubmit: (e) => e.preventDefault() },
          [
            ['Nombre completo', 'María García'],
            ['Email de trabajo', 'maria@template-vanilla.dev'],
            ['Empresa', 'Acme Inc.'],
            ['Cargo', 'Founder · CTO'],
            ['Teléfono', '+51 999 888 777'],
          ].map(([etq, valor]) => crearEl('div', { class: 'layout-fila-h' }, [
            crearEl('label', { class: 'layout-fila-h__label' }, [etq]),
            Input({ value: valor }),
          ])).concat([
            Footer(Btn('Cancelar', 'outline'), Btn('Guardar', 'primary', { type: 'submit' })),
          ]),
        ),
        codigo: `<div class="layout-fila-h">
  <label>Nombre completo</label>
  <Input ... />
</div>
/* CSS:
.layout-fila-h {
  display: grid;
  grid-template-columns: 180px 1fr;
  align-items: center;
  gap: 16px;
  padding: 8px 0;
  border-bottom: 1px solid var(--border);
} */`,
      })],
    }),

    // ========== 3 ==========
    Seccion({
      titulo: '3 · Grid 2 columnas',
      descripcion: 'Pares de campos lado a lado (Nombre/Apellido, Ciudad/CP). Auto-fit colapsa a 1 columna en móvil. Para campos full-width usa `class="layout-full"`.',
      hijos: [VistaCodigo({
        vista: crearEl('form', { class: 'layout-form layout-form--grid', onSubmit: (e) => e.preventDefault() }, [
          Campo({ label: 'Nombre', hijos: Input({ placeholder: 'María' }) }),
          Campo({ label: 'Apellido', hijos: Input({ placeholder: 'García' }) }),
          Campo({ label: 'Email', hijos: Input({ type: 'email', placeholder: 'maria@template-vanilla.dev' }) }),
          Campo({ label: 'Teléfono', hijos: Input({ type: 'tel', placeholder: '+51 999 888 777' }) }),
          Campo({ label: 'Ciudad', hijos: Input({ placeholder: 'Lima' }) }),
          Campo({ label: 'Código postal', hijos: Input({ placeholder: '15001' }) }),
          crearEl('div', { class: 'layout-full' }, [
            Campo({ label: 'Dirección completa', hijos: Input({ placeholder: 'Av. Larco 1234, Miraflores' }) }),
          ]),
          crearEl('div', { class: 'layout-full layout-acciones-fin' }, [
            Btn('Cancelar', 'outline'), Btn('Guardar', 'primary', { type: 'submit' }),
          ]),
        ]),
        codigo: `<form class="layout-form layout-form--grid">
  <Campo label="Nombre" />
  <Campo label="Apellido" />
  <Campo label="Email" />
  <Campo label="Teléfono" />
  <div class="layout-full">
    <Campo label="Dirección" />
  </div>
</form>`,
      })],
    }),

    // ========== 4 ==========
    Seccion({
      titulo: '4 · Con secciones (headings)',
      descripcion: 'Para forms largos: dividir en grupos lógicos con heading + descripción. Patrón de checkout, profile completo, signup multi-paso en una sola página.',
      hijos: [VistaCodigo({
        vista: FormaCol(
          SeccionTitulo('Información de la cuenta', 'Datos básicos para identificarte en la plataforma.'),
          Campo({ label: 'Nombre', hijos: Input({ placeholder: 'María García' }) }),
          Campo({ label: 'Email', hijos: Input({ type: 'email', placeholder: 'maria@template-vanilla.dev' }) }),

          SeccionTitulo('Empresa', 'Cómo te identifica tu organización.'),
          Campo({ label: 'Empresa', hijos: Input({ placeholder: 'Acme Inc.' }) }),
          Campo({ label: 'Cargo', hijos: Input({ placeholder: 'CTO' }) }),
          Campo({ label: 'Tamaño', hijos: Select({ opciones: ['1-10 empleados', '11-50', '51-200', '201-1000', '1000+'] }) }),

          SeccionTitulo('Preferencias'),
          Switch({ checked: true, label: 'Notificaciones por email', descripcion: 'Resumen semanal de actividad' }),
          Switch({ label: 'Marketing emails', descripcion: 'Tips, novedades y casos de uso' }),

          Footer(Btn('Cancelar', 'outline'), Btn('Guardar cambios', 'primary', { type: 'submit' })),
        ),
        codigo: `<form>
  <SeccionTitulo titulo="Información de la cuenta" descripcion="..." />
  <Campo label="Nombre" />
  <Campo label="Email" />

  <SeccionTitulo titulo="Empresa" />
  <Campo label="Empresa" />
  ...
</form>`,
      })],
    }),

    // ========== 5 ==========
    Seccion({
      titulo: '5 · Two-column con sidebar de info',
      descripcion: 'Form a la izquierda, tarjeta de help a la derecha. Patrón Stripe Settings / Vercel Project Settings — el contexto siempre visible mientras llenas el form.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { class: 'layout-con-sidebar' }, [
          FormaCol(
            Campo({ label: 'Nombre del proyecto', hijos: Input({ placeholder: 'mi-proyecto' }) }),
            Campo({ label: 'URL del repositorio',
              hijos: InputGrupo({ prefix: Icono('utilidades', { tamano: 13 }), placeholder: 'github.com/usuario/repo' }) }),
            Campo({ label: 'Branch de producción',
              hijos: Select({ opciones: ['main', 'master', 'production', 'release'], value: 'main' }) }),
            Campo({ label: 'Variables de entorno',
              hint: 'Una por línea, formato KEY=value',
              hijos: Textarea({ placeholder: 'DATABASE_URL=postgres://…\nNODE_ENV=production', filas: 5 }) }),
            crearEl('div', { class: 'layout-acciones-inicio' }, [Btn('Crear proyecto', 'primary', { type: 'submit' })]),
          ),
          crearEl('aside', { class: 'layout-sidebar-info' }, [
            crearEl('h4', { class: 'layout-sidebar-info__titulo' }, [
              Icono('info', { tamano: 14 }), 'Necesitas ayuda?',
            ]),
            crearEl('p', { class: 'layout-sidebar-info__txt' }, ['Lee la guía de inicio rápido para configurar tu primer proyecto en 3 minutos.']),
            crearEl('a', { href: '#', class: 'layout-sidebar-info__link' }, ['Ver documentación →']),
          ]),
        ]),
        codigo: `<div class="layout-con-sidebar">
  <form>{...campos}</form>
  <aside class="layout-sidebar-info">
    {tarjeta de help / docs}
  </aside>
</div>`,
      })],
    }),

    // ========== 6 ==========
    Seccion({
      titulo: '6 · Settings con tabs verticales',
      descripcion: 'Patrón Linear / Notion / Stripe: navegación de secciones a la izquierda como tabs verticales, panel del form a la derecha. Para dashboards con muchas secciones de configuración.',
      hijos: [VistaCodigo({
        vista: (() => {
          const tabs = [
            { id: 'perfil', icono: 'perfil', label: 'Perfil', activa: true },
            { id: 'cuenta', icono: 'ajustes', label: 'Cuenta' },
            { id: 'notif', icono: 'campana', label: 'Notificaciones' },
            { id: 'seguridad', icono: 'candado', label: 'Seguridad' },
            { id: 'facturacion', icono: 'precios', label: 'Facturación' },
            { id: 'equipo', icono: 'crm', label: 'Equipo' },
          ];
          return crearEl('div', { class: 'layout-settings' }, [
            crearEl('nav', { class: 'layout-settings__nav' }, tabs.map((t) => crearEl('button', {
              type: 'button',
              class: ['layout-settings__tab', t.activa && 'layout-settings__tab--activa'],
            }, [Icono(t.icono, { tamano: 14 }), t.label]))),
            crearEl('div', { class: 'layout-settings__panel' }, [
              SeccionTitulo('Perfil', 'Esta información se mostrará públicamente en tu cuenta.'),
              FormaCol(
                Campo({ label: 'Nombre completo', hijos: Input({ value: 'María García' }) }),
                Campo({ label: 'Username', hijos: InputGrupo({ prefix: '@', placeholder: 'maria-garcia' }) }),
                Campo({ label: 'Bio', hint: 'Máximo 160 caracteres',
                  hijos: Textarea({ filas: 3, placeholder: 'Cuéntanos un poco sobre ti…' }) }),
                Campo({ label: 'Sitio web', hijos: Input({ type: 'url', placeholder: 'https://…' }) }),
                Footer(Btn('Cancelar', 'outline'), Btn('Guardar perfil', 'primary', { type: 'submit' })),
              ),
            ]),
          ]);
        })(),
        codigo: `<div class="layout-settings">
  <nav class="layout-settings__nav">
    <button class="layout-settings__tab--activa">Perfil</button>
    <button>Cuenta</button>
    ...
  </nav>
  <div class="layout-settings__panel">
    <SeccionTitulo titulo="Perfil" />
    <form>...</form>
  </div>
</div>`,
      })],
    }),

    // ========== 7 ==========
    Seccion({
      titulo: '7 · Sticky footer — acciones siempre visibles',
      descripcion: 'El footer con Cancelar/Guardar queda fijo al fondo del contenedor cuando el form es largo. Útil en wizards, modales largos, paneles laterales. El usuario nunca pierde el botón de acción.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { class: 'layout-sticky-cont' }, [
          crearEl('div', { class: 'layout-sticky-scroll' }, [
            crearEl('form', { class: 'layout-form', onSubmit: (e) => e.preventDefault() }, [
              SeccionTitulo('Datos personales'),
              Campo({ label: 'Nombre', hijos: Input({ value: 'María García' }) }),
              Campo({ label: 'Email', hijos: Input({ value: 'maria@template-vanilla.dev' }) }),
              Campo({ label: 'Teléfono', hijos: Input({ value: '+51 999 888 777' }) }),
              SeccionTitulo('Empresa'),
              Campo({ label: 'Empresa', hijos: Input({ value: 'Acme Inc.' }) }),
              Campo({ label: 'Cargo', hijos: Input({ value: 'CTO' }) }),
              Campo({ label: 'Tamaño', hijos: Select({ opciones: ['1-10', '11-50', '51-200', '201+'] }) }),
              SeccionTitulo('Dirección'),
              Campo({ label: 'Calle', hijos: Input({ value: 'Av. Larco 1234' }) }),
              Campo({ label: 'Distrito', hijos: Input({ value: 'Miraflores' }) }),
              Campo({ label: 'Ciudad', hijos: Input({ value: 'Lima' }) }),
            ]),
          ]),
          crearEl('div', { class: 'layout-sticky-footer' }, [
            crearEl('span', { class: 'layout-sticky-footer__hint' }, ['Cambios sin guardar']),
            crearEl('div', { class: 'layout-sticky-footer__btns' }, [
              Btn('Descartar', 'outline'),
              Btn('Guardar', 'primary', { type: 'submit' }),
            ]),
          ]),
        ]),
        codigo: `<div class="layout-sticky-cont">
  <div class="layout-sticky-scroll">
    {form scrolleable}
  </div>
  <div class="layout-sticky-footer">
    <span>Cambios sin guardar</span>
    <button class="btn">Guardar</button>
  </div>
</div>`,
      })],
    }),

    // ========== 8 ==========
    Seccion({
      titulo: '8 · Inline — filtros / toolbar',
      descripcion: 'Form en una sola línea para barras de filtros, búsquedas avanzadas, toolbars de tablas. Cada campo se ajusta al ancho de su contenido y se envuelven en móvil.',
      hijos: [VistaCodigo({
        vista: crearEl('form', { class: 'layout-inline', onSubmit: (e) => e.preventDefault() }, [
          Campo({ label: 'Estado', hijos: Select({ opciones: ['Todos', 'Activo', 'Pausado', 'Archivado'], value: 'Activo' }) }),
          Campo({ label: 'Categoría', hijos: Select({ opciones: ['Todas', 'Tarjetas', 'Wallets', 'Transferencias'] }) }),
          Campo({ label: 'Buscar',
            hijos: InputGrupo({ prefix: Icono('busqueda', { tamano: 13 }), placeholder: 'Nombre o ID…' }) }),
          crearEl('div', { class: 'layout-inline__acciones' }, [
            Btn('Limpiar', 'ghost'),
            Btn('Aplicar', 'primary', { type: 'submit' }),
          ]),
        ]),
        codigo: `<form class="layout-inline">
  <Campo label="Estado"    hijos={Select(...)} />
  <Campo label="Categoría" hijos={Select(...)} />
  <Campo label="Buscar"    hijos={InputGrupo(...)} />
  <div class="layout-inline__acciones">
    <button class="btn btn--ghost">Limpiar</button>
    <button class="btn">Aplicar</button>
  </div>
</form>`,
      })],
    }),

  ],
});
