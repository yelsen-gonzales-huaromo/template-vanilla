/**
 * Date & Time pickers — usando los componentes custom (`_pickers.js`).
 * Mismos pickers que en `basic/form-control` pero con casos avanzados:
 *  basic, datetime combinado, time con 12/24h, restricciones min/max,
 *  edición directa, validación y rango de fechas vía dos DatePickers ligados.
 */
import { crearEl } from '../../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../../utils/helpers/reactive.js';
import { PaginaShowcase, Seccion } from '../../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../../components/ui/code-preview/code-preview.js';
import { corner2 } from '../../../../components/ui/card/card-decoraciones.js';
import { Campo, Stack, Grid2 } from '../_compartido.js';
import { DatePicker, TimePicker } from '../_pickers.js';

export default async () => PaginaShowcase({
  titulo: 'Date & Time pickers',
  descripcion: 'Selectores de fecha y hora 100% custom — panel flotante con popover manager, navegación rápida (click en mes/año salta a la vista de meses/años), edición directa con máscara que solo permite el formato, toggle 12 hr / 24 hr en el time picker. Cero dependencias externas, integrados con el design system.',
  decoracion: corner2(),
  migas: [
    { etiqueta: 'Módulos', href: '#/modulos' },
    { etiqueta: 'Formularios', href: '#/modulos/forms' },
  ],
  hijos: [

    // ========== 1 ==========
    Seccion({
      titulo: '1 · Date picker básico',
      descripcion: 'Click en cualquier parte del input (incluido el icono) abre el panel. Click en "Mayo" o "2026" en el header → vista de meses / años para navegación rápida. También se puede tipear DD/MM/YYYY directo (máscara bloquea caracteres inválidos).',
      hijos: [VistaCodigo({
        vista: Grid2(
          Campo({ label: 'Fecha de nacimiento',
            hijos: DatePicker({ placeholder: 'DD/MM/YYYY' }) }),
          Campo({ label: 'Fecha del evento', hint: 'Pre-cargada con valor inicial',
            hijos: DatePicker({ value: new Date(), placeholder: 'DD/MM/YYYY' }) }),
        ),
        codigo: `import { DatePicker } from '../_pickers.js';

DatePicker({
  value: new Date(),                  // o 'DD/MM/YYYY' string
  placeholder: 'DD/MM/YYYY',
  onChange: (fecha) => console.log(fecha),
})`,
      })],
    }),

    // ========== 2 ==========
    Seccion({
      titulo: '2 · Date + Time combinados',
      descripcion: 'Para reuniones, deadlines, scheduling. Dos pickers independientes lado a lado — más flexible que un widget combinado y permite que el usuario edite cada parte por separado.',
      hijos: [VistaCodigo({
        vista: (() => {
          const fecha = senal(new Date());
          const hora  = senal({ h: 14, m: 30, formato: '24' });
          const lbl = crearEl('span', { style: { fontSize: '12.5px', color: 'var(--muted-foreground)', fontVariantNumeric: 'tabular-nums' } });
          efecto(() => {
            const f = fecha.value;
            const h = hora.value;
            if (!f) { lbl.textContent = 'Sin fecha'; return; }
            const dd = String(f.getDate()).padStart(2, '0');
            const mm = String(f.getMonth() + 1).padStart(2, '0');
            const hh = String(h.h).padStart(2, '0');
            const mn = String(h.m).padStart(2, '0');
            lbl.textContent = `Fecha+hora ISO: ${f.getFullYear()}-${mm}-${dd}T${hh}:${mn}`;
          });
          return Stack(
            Grid2(
              Campo({ label: 'Fecha', hijos: DatePicker({
                value: fecha.peek(), onChange: (d) => fecha.value = d,
              })}),
              Campo({ label: 'Hora (24h)', hijos: TimePicker({
                value: '14:30', formato: '24',
                onChange: (h) => hora.value = h,
              })}),
            ),
            lbl,
          );
        })(),
        codigo: `const fecha = senal(new Date());
const hora  = senal({ h: 14, m: 30 });

DatePicker({ value: fecha.peek(), onChange: d => fecha.value = d });
TimePicker({ value: '14:30', formato: '24',
             onChange: h => hora.value = h });`,
      })],
    }),

    // ========== 3 ==========
    Seccion({
      titulo: '3 · Time picker — 24h y 12h con AM/PM',
      descripcion: 'El TimePicker tiene un toggle 12 hr / 24 hr dentro del panel. En 12h aparece una columna AM/PM extra. La máscara del input cambia dinámicamente: 24h solo acepta dígitos y `:`; 12h además acepta espacio y A/P/M.',
      hijos: [VistaCodigo({
        vista: Grid2(
          Campo({ label: 'Hora 24 hr', hint: 'Formato HH:MM',
            hijos: TimePicker({ value: '09:15', formato: '24' }) }),
          Campo({ label: 'Hora 12 hr', hint: 'Formato HH:MM AM/PM',
            hijos: TimePicker({ value: '02:30', formato: '12' }) }),
        ),
        codigo: `TimePicker({ value: '14:30', formato: '24' })  // HH:MM
TimePicker({ value: '02:30', formato: '12' })  // HH:MM AM/PM
// Toggle dentro del panel cambia entre formatos en vivo`,
      })],
    }),

    // ========== 4 ==========
    Seccion({
      titulo: '4 · Con restricciones (min / max)',
      descripcion: 'Limita el rango de fechas seleccionables. Las fechas fuera del rango aparecen deshabilitadas en el calendario y no se pueden seleccionar.',
      hijos: [VistaCodigo({
        vista: Grid2(
          Campo({ label: 'Solo fechas futuras', hint: 'Desde hoy en adelante',
            hijos: DatePicker({ minDate: new Date() }) }),
          Campo({ label: 'Próximos 30 días', hint: 'Hoy + 30 días máximo',
            hijos: DatePicker({
              minDate: new Date(),
              maxDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            }) }),
        ),
        codigo: `DatePicker({ minDate: new Date() })            // hoy →
DatePicker({                                       // ventana de 30 días
  minDate: new Date(),
  maxDate: new Date(Date.now() + 30 * 86400000),
})`,
      })],
    }),

    // ========== 5 ==========
    Seccion({
      titulo: '5 · Rango de fechas — dos pickers ligados',
      descripcion: 'Para reservar hoteles, definir period filters, vacaciones. Dos DatePickers donde el inicio limita el mínimo del fin (no puedes elegir un fin anterior al inicio). Con cálculo automático de noches/días.',
      hijos: [VistaCodigo({
        vista: (() => {
          const inicio = senal(new Date());
          const fin = senal(new Date(Date.now() + 7 * 86400000));
          const lbl = crearEl('span', { style: { fontSize: '12.5px', color: 'var(--primary)', fontWeight: 600 } });
          let dpFin;
          efecto(() => {
            const i = inicio.value, f = fin.value;
            if (!i || !f) { lbl.textContent = ''; return; }
            const dias = Math.round((f - i) / 86400000);
            lbl.textContent = `${dias} ${dias === 1 ? 'noche' : 'noches'}`;
          });
          dpFin = DatePicker({
            value: fin.peek(),
            minDate: inicio.peek(),
            onChange: (d) => fin.value = d,
          });
          return Stack(
            Grid2(
              Campo({ label: 'Check-in',
                hijos: DatePicker({
                  value: inicio.peek(),
                  onChange: (d) => {
                    inicio.value = d;
                    // Si el fin queda antes del nuevo inicio, lo ajustamos
                    if (fin.peek() && d && fin.peek() < d) fin.value = d;
                  },
                }) }),
              Campo({ label: 'Check-out', hint: 'Mínimo: el día de check-in',
                hijos: dpFin }),
            ),
            lbl,
          );
        })(),
        codigo: `const inicio = senal(...);
const fin    = senal(...);

DatePicker({
  value: inicio.peek(),
  onChange: (d) => {
    inicio.value = d;
    if (fin.peek() < d) fin.value = d;   // auto-ajusta el fin
  },
})
DatePicker({
  value: fin.peek(),
  minDate: inicio.peek(),                 // bloquea fechas previas
  onChange: (d) => fin.value = d,
})`,
      })],
    }),

    // ========== 6 ==========
    Seccion({
      titulo: '6 · Edición directa con máscara',
      descripcion: 'No es obligatorio abrir el panel — el usuario puede tipear la fecha directamente en el input. La máscara `beforeinput` bloquea cualquier carácter que no sea dígito o `/`. Cuando el formato es válido (DD/MM/YYYY), se sincroniza con el panel.',
      hijos: [VistaCodigo({
        vista: (() => {
          const fecha = senal(null);
          const hora = senal(null);
          const eco = crearEl('span', { style: { fontSize: '12.5px', color: 'var(--muted-foreground)', fontVariantNumeric: 'tabular-nums' } });
          efecto(() => {
            const f = fecha.value;
            const h = hora.value;
            const partes = [];
            if (f) partes.push(`Fecha: ${f.toLocaleDateString('es-PE')}`);
            if (h) partes.push(`Hora: ${String(h.h).padStart(2, '0')}:${String(h.m).padStart(2, '0')}`);
            eco.textContent = partes.length ? partes.join(' · ') : 'Tipea o abre el panel para empezar';
          });
          return Stack(
            Grid2(
              Campo({ label: 'Fecha (puedes tipear)',
                hijos: DatePicker({ placeholder: 'DD/MM/YYYY', onChange: (d) => fecha.value = d }) }),
              Campo({ label: 'Hora (puedes tipear)',
                hijos: TimePicker({ placeholder: 'HH:MM', formato: '24', onChange: (h) => hora.value = h }) }),
            ),
            eco,
          );
        })(),
        codigo: `// Máscara automática:
//  Date: solo dígitos y '/' — máx 10 chars (DD/MM/YYYY)
//  Time 24h: solo dígitos y ':' — máx 5 chars (HH:MM)
//  Time 12h: además espacio y A/P/M — máx 8 chars
DatePicker({ onChange: (d) => fecha = d })
TimePicker({ onChange: (h) => hora = h })`,
      })],
    }),

  ],
});
