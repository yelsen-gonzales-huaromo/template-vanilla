// Página showcase de tipos de formulario y validaciones.
import { crearEl } from '../../utils/helpers/dom.js';
import { senal, efecto } from '../../utils/helpers/reactive.js';
import { TituloPagina } from '../../components/common/page-title/page-title.js';
import { Tarjeta } from '../../components/ui/card/card.js';
import { Boton } from '../../components/ui/button/button.js';
import { Campo, AreaTexto } from '../../components/ui/input/input.js';
import { Selector } from '../../components/ui/select/select.js';
import { CampoFormulario } from '../../components/forms/form-field/form-field.js';
import { notificar } from '../../components/ui/toast/toast.js';
import {
  obligatorio,
  correo as reglaCorreo,
  longitudMinima,
  validarFormulario,
} from '../../utils/validators/rules.js';

// Tarjeta 1: Campos básicos.
const tarjetaBasicos = () => {
  const formulario = crearEl(
    'form',
    {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
      },
      onsubmit: (e) => {
        e.preventDefault();
        notificar.exito('Formulario enviado');
      },
    },
    [
      CampoFormulario({
        etiqueta: 'Nombre',
        hijos: Campo({ name: 'nombre', placeholder: 'Tu nombre completo' }),
      }),
      CampoFormulario({
        etiqueta: 'Email',
        hijos: Campo({ name: 'email', type: 'email', placeholder: 'tu@correo.com' }),
      }),
      CampoFormulario({
        etiqueta: 'Mensaje',
        hijos: AreaTexto({ name: 'mensaje', placeholder: 'Escribe tu mensaje...', filas: 4 }),
      }),
      CampoFormulario({
        etiqueta: 'País',
        hijos: Selector({
          name: 'pais',
          opciones: [
            { valor: 'mx', etiqueta: 'México' },
            { valor: 'es', etiqueta: 'España' },
            { valor: 'ar', etiqueta: 'Argentina' },
            { valor: 'co', etiqueta: 'Colombia' },
          ],
        }),
      }),
      crearEl('div', { style: { display: 'flex', justifyContent: 'flex-end' } }, [
        Boton({ texto: 'Enviar', variante: 'primary', tipo: 'submit' }),
      ]),
    ],
  );

  return Tarjeta({
    titulo: 'Campos básicos',
    descripcion: 'Inputs habituales con etiquetas.',
    cuerpo: formulario,
  });
};

// Tarjeta 2: Validación en vivo.
const tarjetaValidacion = () => {
  const valores = senal({ email: '', clave: '' });
  const errores = senal({});

  const reglas = {
    email: [obligatorio('El email es obligatorio'), reglaCorreo('Email no válido')],
    clave: [
      obligatorio('La contraseña es obligatoria'),
      longitudMinima(8, 'Mínimo 8 caracteres'),
    ],
  };

  const validar = () => {
    errores.set(validarFormulario(valores.get(), reglas));
  };

  const campoConError = (clave, etiqueta, atributos) => {
    const input = Campo({
      name: clave,
      ...atributos,
      onInput: (e) => {
        valores.set({ ...valores.get(), [clave]: e.target.value });
        validar();
      },
    });
    const mensajeError = crearEl('div', {
      className: 'text-xs',
      style: { color: 'var(--color-danger)', minHeight: '1em' },
    });

    efecto(() => {
      const err = errores.get()[clave];
      mensajeError.textContent = err || '';
    });

    return CampoFormulario({
      etiqueta,
      hijos: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' } }, [
        input,
        mensajeError,
      ]),
    });
  };

  const formulario = crearEl(
    'form',
    {
      style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' },
      onsubmit: (e) => {
        e.preventDefault();
        validar();
        if (Object.keys(errores.get()).length === 0) {
          notificar.exito('Formulario enviado');
        } else {
          notificar.error('Revisa los errores antes de enviar');
        }
      },
    },
    [
      campoConError('email', 'Email', { type: 'email', placeholder: 'tu@correo.com' }),
      campoConError('clave', 'Contraseña', { type: 'password', placeholder: '••••••••' }),
      crearEl('div', { style: { display: 'flex', justifyContent: 'flex-end' } }, [
        Boton({ texto: 'Acceder', variante: 'primary', tipo: 'submit' }),
      ]),
    ],
  );

  return Tarjeta({
    titulo: 'Validación en vivo',
    descripcion: 'Reglas reactivas mientras escribes.',
    cuerpo: formulario,
  });
};

// Tarjeta 3: Tipos avanzados.
const tarjetaAvanzados = () => {
  const grid = crearEl(
    'div',
    {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--space-4)',
      },
    },
    [
      CampoFormulario({ etiqueta: 'Archivo', hijos: Campo({ type: 'file' }) }),
      CampoFormulario({ etiqueta: 'Fecha', hijos: Campo({ type: 'date' }) }),
      CampoFormulario({ etiqueta: 'Hora', hijos: Campo({ type: 'time' }) }),
      CampoFormulario({ etiqueta: 'Color', hijos: Campo({ type: 'color', valor: '#3b82f6' }) }),
      CampoFormulario({ etiqueta: 'Rango', hijos: Campo({ type: 'range', min: 0, max: 100, valor: 50 }) }),
      CampoFormulario({ etiqueta: 'Búsqueda', hijos: Campo({ type: 'search', placeholder: 'Buscar...' }) }),
    ],
  );

  return Tarjeta({
    titulo: 'Tipos avanzados',
    descripcion: 'Inputs especializados nativos del navegador.',
    cuerpo: grid,
  });
};

// Tarjeta 4: Layouts.
const tarjetaLayouts = () => {
  const gridDoble = crearEl('div', null, [
    crearEl('h4', { className: 'text-sm', style: { marginBottom: 'var(--space-3)' } }, ['Grid (2 columnas)']),
    crearEl(
      'div',
      {
        style: {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-3)',
          marginBottom: 'var(--space-6)',
        },
      },
      [
        CampoFormulario({ etiqueta: 'Nombre', hijos: Campo({ placeholder: 'Juan' }) }),
        CampoFormulario({ etiqueta: 'Apellidos', hijos: Campo({ placeholder: 'Pérez' }) }),
        CampoFormulario({ etiqueta: 'Ciudad', hijos: Campo({ placeholder: 'Madrid' }) }),
        CampoFormulario({ etiqueta: 'CP', hijos: Campo({ placeholder: '28001' }) }),
      ],
    ),
    crearEl('h4', { className: 'text-sm', style: { marginBottom: 'var(--space-3)' } }, ['Stacked']),
    crearEl(
      'div',
      { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } },
      [
        CampoFormulario({ etiqueta: 'Asunto', hijos: Campo({ placeholder: 'Motivo del contacto' }) }),
        CampoFormulario({ etiqueta: 'Detalle', hijos: AreaTexto({ filas: 3 }) }),
      ],
    ),
  ]);

  return Tarjeta({
    titulo: 'Layouts',
    descripcion: 'Formularios en cuadrícula y apilados.',
    cuerpo: gridDoble,
  });
};

export default async () => {
  const contenedor = crearEl('div', {
    style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' },
  });

  contenedor.appendChild(
    TituloPagina({
      titulo: 'Formularios',
      descripcion: 'Patrones comunes de captura de datos.',
    }),
  );

  contenedor.appendChild(
    crearEl(
      'div',
      {
        style: {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-6)',
        },
      },
      [tarjetaBasicos(), tarjetaValidacion(), tarjetaAvanzados(), tarjetaLayouts()],
    ),
  );

  return contenedor;
};
