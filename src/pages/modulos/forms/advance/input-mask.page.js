/**
 * Input mask — vanilla JS sin dependencias.
 * Detección de marca de tarjeta + Luhn + validadores en vivo.
 */
import { crearEl } from '../../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../../utils/helpers/reactive.js';
import { PaginaShowcase, Seccion } from '../../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../../components/ui/code-preview/code-preview.js';
import { corner6 } from '../../../../components/ui/card/card-decoraciones.js';
import { Campo, Stack, Grid2 } from '../_compartido.js';
import { MaskedInput, CardInput, validadores } from '../_mascara.js';

export default async () => PaginaShowcase({
  titulo: 'Input mask',
  descripcion: 'Máscaras de formato vanilla JS — sin Inputmask (~25 KB) ni dependencias. El usuario tipea solo los caracteres significativos y los separadores (espacios, guiones, slashes, paréntesis) aparecen automáticamente. Validación en vivo con check verde / X rojo. Detección automática de marca de tarjeta (Visa/Mastercard/Amex/Discover/Diners/JCB/UnionPay) con logo SVG inline + algoritmo Luhn.',
  decoracion: corner6(),
  migas: [
    { etiqueta: 'Módulos', href: '#/modulos' },
    { etiqueta: 'Formularios', href: '#/modulos/forms' },
  ],
  hijos: [

    // ========== 1 ==========
    Seccion({
      titulo: '1 · Tarjeta de crédito — detección de marca + Luhn',
      descripcion: 'El input detecta la marca a medida que escribes (basado en el prefijo) y muestra el logo SVG en vivo. Visa empieza con 4, Mastercard con 5/2, Amex con 34/37, Discover con 6011/65… La máscara se ajusta automáticamente — Amex usa grupos 4-6-5 (15 dígitos), las demás 4-4-4-4 (16). Cuando el número está completo, se valida con el algoritmo Luhn y aparece check verde / X rojo.',
      hijos: [VistaCodigo({
        vista: (() => {
          const info = senal({ valida: false, marca: null, numero: '' });
          const eco = crearEl('div', {
            style: { fontSize: '12.5px', color: 'var(--muted-foreground)', marginBlockStart: '8px', fontVariantNumeric: 'tabular-nums' },
          });
          efecto(() => {
            const i = info.value;
            eco.textContent = i.numero
              ? `${i.marca || 'Sin detectar'} · ${i.numero.length} dígitos · ${i.valida ? 'Luhn ✓ válida' : 'Pendiente o inválida'}`
              : 'Prueba con 4242 4242 4242 4242 (Visa) · 5555 5555 5555 4444 (MC) · 3782 822463 10005 (Amex)';
          });
          return crearEl('div', { style: { maxWidth: '440px' } }, [
            Campo({
              label: 'Número de tarjeta',
              hijos: CardInput({ onChange: (i) => info.value = i }),
            }),
            eco,
          ]);
        })(),
        codigo: `import { CardInput } from '../_mascara.js';

CardInput({
  onChange: ({ numero, marca, valida, formato }) => {
    // numero: '4242424242424242'
    // marca: 'Visa'
    // valida: true (Luhn ✓)
    // formato: '4242 4242 4242 4242'
  },
})`,
      })],
    }),

    // ========== 2 ==========
    Seccion({
      titulo: '2 · Checkout completo — número + venc + CVV + ZIP',
      descripcion: 'Patrón estándar de checkout. CardInput auto-detecta la marca, vencimiento valida que sea fecha futura, CVV valida 3 o 4 dígitos. Cada uno con su badge de validación.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { maxWidth: '560px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' } }, [
          crearEl('div', { style: { gridColumn: '1 / -1' } }, [
            Campo({ label: 'Número de tarjeta', hijos: CardInput() }),
          ]),
          Campo({ label: 'Vencimiento', hijos: MaskedInput({
            mask: '99/99', placeholder: 'MM/YY', validador: validadores.fechaMMYY,
          })}),
          Campo({ label: 'CVV', hijos: MaskedInput({
            mask: '9999', placeholder: '123', validador: validadores.cvv,
          })}),
          Campo({ label: 'Código postal', hijos: MaskedInput({
            mask: '99999', placeholder: '15001',
            validador: (v) => v.length < 5 ? null : v.length === 5,
          })}),
        ]),
        codigo: `CardInput()                                       // marca + Luhn auto

MaskedInput({ mask: '99/99', validador: validadores.fechaMMYY })  // venc futura
MaskedInput({ mask: '9999',  validador: validadores.cvv })         // 3 o 4 dígitos`,
      })],
    }),

    // ========== 3 ==========
    Seccion({
      titulo: '3 · Teléfonos por país',
      descripcion: 'Cada país tiene su máscara. Los espacios y signos `+` aparecen automáticamente — el usuario solo tipea los dígitos.',
      hijos: [VistaCodigo({
        vista: Grid2(
          Campo({ label: 'Perú', hijos: MaskedInput({ mask: '+51 999 999 999', placeholder: '+51 999 888 777' }) }),
          Campo({ label: 'México', hijos: MaskedInput({ mask: '+52 99 9999 9999', placeholder: '+52 55 1234 5678' }) }),
          Campo({ label: 'España', hijos: MaskedInput({ mask: '+34 999 999 999', placeholder: '+34 612 345 678' }) }),
          Campo({ label: 'USA', hijos: MaskedInput({ mask: '+1 (999) 999-9999', placeholder: '+1 (555) 123-4567' }) }),
          Campo({ label: 'Argentina', hijos: MaskedInput({ mask: '+54 9 99 9999-9999', placeholder: '+54 9 11 1234-5678' }) }),
          Campo({ label: 'Brasil', hijos: MaskedInput({ mask: '+55 (99) 99999-9999', placeholder: '+55 (11) 91234-5678' }) }),
        ),
        codigo: `MaskedInput({ mask: '+51 999 999 999' })           // Perú
MaskedInput({ mask: '+1 (999) 999-9999' })          // USA
MaskedInput({ mask: '+55 (99) 99999-9999' })        // Brasil

// Convención: 9 = dígito · A = letra mayús · a = minús · n = alfanum · * = cualquiera
// Cualquier otro carácter es literal y se inserta automático`,
      })],
    }),

    // ========== 4 ==========
    Seccion({
      titulo: '4 · Documentos de identidad',
      descripcion: 'DNI Perú (8 dígitos), DNI España (8 dígitos + letra de control validada con módulo 23), CIF español, IBAN con validación módulo 97 real. Todos con badge de validación en vivo.',
      hijos: [VistaCodigo({
        vista: Grid2(
          Campo({ label: 'DNI Perú', hint: '8 dígitos numéricos',
            hijos: MaskedInput({ mask: '99999999', placeholder: '12345678', validador: validadores.dniPe }) }),
          Campo({ label: 'DNI España', hint: '8 dígitos + letra de control',
            hijos: MaskedInput({ mask: '99999999A', placeholder: '12345678Z', validador: validadores.dniEs }) }),
          Campo({ label: 'CIF', hint: 'Letra inicial + 8 dígitos',
            hijos: MaskedInput({ mask: 'A99999999', placeholder: 'B12345678' }) }),
          Campo({ label: 'IBAN España', hint: 'Validación con módulo 97',
            hijos: MaskedInput({
              mask: 'AA99 9999 9999 9999 9999 9999',
              placeholder: 'ES91 2100 0418 4502 0005 1332',
              validador: validadores.iban,
            }) }),
        ),
        codigo: `MaskedInput({ mask: '99999999A', validador: validadores.dniEs })
// Verifica letra de control con módulo 23

MaskedInput({
  mask: 'AA99 9999 9999 9999 9999 9999',
  validador: validadores.iban,    // módulo 97 real
})`,
      })],
    }),

    // ========== 5 ==========
    Seccion({
      titulo: '5 · Fechas y horas',
      descripcion: 'Fechas con validación de fecha REAL (29 de febrero solo en años bisiestos, 31 de junio rechazado, etc.). Para selección visual usar DatePicker / TimePicker.',
      hijos: [VistaCodigo({
        vista: Grid2(
          Campo({ label: 'Fecha (DD/MM/YYYY)',
            hijos: MaskedInput({ mask: '99/99/9999', placeholder: '15/03/2026', validador: validadores.fechaDDMMYYYY }) }),
          Campo({ label: 'Hora (HH:MM)',
            hijos: MaskedInput({ mask: '99:99', placeholder: '14:30',
              validador: (v) => {
                if (v.length < 5) return null;
                const m = v.match(/^(\d{2}):(\d{2})$/);
                return m && +m[1] >= 0 && +m[1] <= 23 && +m[2] >= 0 && +m[2] <= 59;
              },
            }) }),
          Campo({ label: 'Fecha + hora',
            hijos: MaskedInput({ mask: '99/99/9999 99:99', placeholder: '15/03/2026 14:30' }) }),
          Campo({ label: 'Año fiscal (Q9 9999)',
            hijos: MaskedInput({ mask: 'Q9 9999', placeholder: 'Q3 2026' }) }),
        ),
        codigo: `MaskedInput({
  mask: '99/99/9999',
  validador: validadores.fechaDDMMYYYY,   // valida fecha real
})

MaskedInput({ mask: 'Q9 9999' })   // 'Q' es literal automático`,
      })],
    }),

    // ========== 6 ==========
    Seccion({
      titulo: '6 · Códigos custom — SKU, ticket, license, tracking',
      descripcion: 'Cualquier patrón con tokens (`9` dígito, `A` mayús, `a` minús, `n` alfanum, `*` cualquiera). El resto son literales que se insertan automático mientras el usuario tipea solo lo significativo.',
      hijos: [VistaCodigo({
        vista: Grid2(
          Campo({ label: 'SKU producto', hint: '3 letras + 5 dígitos',
            hijos: MaskedInput({ mask: 'AAA-99999', placeholder: 'TEC-12345' }) }),
          Campo({ label: 'Ticket de soporte',
            hijos: MaskedInput({ mask: 'TKT-9999-AAAA', placeholder: 'TKT-1234-WXYZ' }) }),
          Campo({ label: 'Placa vehicular',
            hijos: MaskedInput({ mask: 'AAA-999', placeholder: 'ABC-123' }) }),
          Campo({ label: 'Tracking UPS',
            hijos: MaskedInput({ mask: '1Z 999 AA9 99 9999 9999', placeholder: '1Z 999 AA1 01 1234 5678' }) }),
          Campo({ label: 'MAC address',
            hijos: MaskedInput({ mask: 'nn:nn:nn:nn:nn:nn', placeholder: '00:1B:44:11:3A:B7' }) }),
          Campo({ label: 'IPv4',
            hijos: MaskedInput({ mask: '999.999.999.999', placeholder: '192.168.001.100' }) }),
        ),
        codigo: `// Tokens: 9 = dígito · A = mayús · a = minús · n = alfanum · * = cualquiera
MaskedInput({ mask: 'AAA-99999' })           // TEC-12345
MaskedInput({ mask: 'TKT-9999-AAAA' })       // TKT-1234-WXYZ
MaskedInput({ mask: 'nn:nn:nn:nn:nn:nn' })   // MAC: 00:1B:44:11:3A:B7
MaskedInput({ mask: '999.999.999.999' })     // IPv4`,
      })],
    }),

  ],
});
