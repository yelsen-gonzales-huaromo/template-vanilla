/**
 * Rating — sistema completo de valoración con 6 tipos.
 */
import { crearEl } from '../../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../../utils/helpers/reactive.js';
import { PaginaShowcase, Seccion } from '../../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../../components/ui/code-preview/code-preview.js';
import { corner1 } from '../../../../components/ui/card/card-decoraciones.js';
import { Campo, Stack, Grid2 } from '../_compartido.js';
import {
  Estrellas, Caritas, Pulgares, NPS, Corazones, ResumenReviews,
} from '../_rating.js';

export default async () => PaginaShowcase({
  titulo: 'Rating',
  descripcion: 'Sistema de valoración vanilla JS — 6 tipos para distintos contextos: Estrellas (con half-star), Caritas (satisfaction emoji), Pulgares (like/dislike), NPS (0-10 con gradiente rojo→verde), Corazones (favoritos), y widget Resumen con histograma de distribución. Todos accesibles con teclado, callbacks `onChange`, modos editable / solo-lectura.',
  decoracion: corner1(),
  migas: [
    { etiqueta: 'Módulos', href: '#/modulos' },
    { etiqueta: 'Formularios', href: '#/modulos/forms' },
  ],
  hijos: [

    // ========== 1 ==========
    Seccion({
      titulo: '1 · Estrellas — clásico ★ con hover preview + etiquetas',
      descripcion: 'El patrón más reconocido. Hover muestra preview con scale 1.18, click confirma. `conEtiquetaTexto: true` muestra "Pésimo / Malo / Regular / Bueno / Excelente" según la posición. Navegación con ←/→ desde el teclado.',
      hijos: [VistaCodigo({
        vista: Stack(
          Campo({ label: 'Califica el producto', hijos: Estrellas({ valor: 4, conLabel: true }) }),
          Campo({ label: 'Calidad del servicio (con etiquetas)',
            hijos: Estrellas({ valor: 0, conEtiquetaTexto: true }) }),
          Campo({ label: 'Recomendarías? (1-10)',
            hijos: Estrellas({ valor: 7, max: 10, conLabel: true, tamano: 18 }) }),
          Campo({ label: 'Tamaño grande',
            hijos: Estrellas({ valor: 5, tamano: 32 }) }),
        ),
        codigo: `import { Estrellas } from '../_rating.js';

Estrellas({
  valor: 4,
  max: 5,                       // o 10
  tamano: 22,
  conEtiquetaTexto: true,       // 'Pésimo' / 'Malo' / 'Regular' / 'Bueno' / 'Excelente'
  onChange: (v) => api.calificar(v),
})`,
      })],
    }),

    // ========== 2 ==========
    Seccion({
      titulo: '2 · Solo lectura con half-star — display de reviews',
      descripcion: 'Para mostrar valoraciones con decimales (4.5, 3.7…). El relleno de cada estrella se hace con porcentaje vía `width`, así soporta cualquier fracción. Usado en e-commerce, listings de productos, hoteles.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '560px' } },
          [
            ['MacBook Pro 14"',  4.8, 1284],
            ['AirPods Pro',      4.6, 892],
            ['iPad Air M2',      4.5, 654],
            ['HomePod mini',     3.7, 234],
            ['Apple Watch Ultra',4.9, 442],
          ].map(([prod, rating, n]) => crearEl('div', {
            style: {
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 14px', background: 'var(--surface)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius)',
            },
          }, [
            crearEl('span', { style: { fontWeight: 600, fontSize: '13px' } }, [prod]),
            crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } }, [
              Estrellas({ valor: rating, soloLectura: true, permitirMedio: true, tamano: 16 }),
              crearEl('span', { style: { fontSize: '12px', color: 'var(--muted-foreground)', fontVariantNumeric: 'tabular-nums' } },
                [`${rating} (${n.toLocaleString()})`]),
            ]),
          ])),
        ),
        codigo: `Estrellas({
  valor: 4.5,                   // valor decimal
  soloLectura: true,
  permitirMedio: true,          // habilita el relleno parcial
  tamano: 16,
})`,
      })],
    }),

    // ========== 3 ==========
    Seccion({
      titulo: '3 · Caritas — satisfaction survey 😡😞😐😊😍',
      descripcion: 'Patrón típico de encuestas post-compra, soporte, NPS visual. Las caras inactivas están en grayscale + opacity bajo; al hover y al seleccionar se restaura el color y aparece el borde + label en el color de la emoción.',
      hijos: [VistaCodigo({
        vista: (() => {
          const v = senal(0);
          const eco = crearEl('div', { style: { fontSize: '12.5px', color: 'var(--muted-foreground)', marginBlockStart: '8px' } }, ['Selecciona tu satisfacción']);
          efecto(() => { eco.textContent = v.value > 0 ? `Nivel seleccionado: ${v.value}/5` : 'Selecciona tu satisfacción'; });
          return crearEl('div', { style: { textAlign: 'center', maxWidth: '420px' } }, [
            crearEl('h4', { style: { margin: '0 0 12px', fontSize: '14px', fontWeight: 600 } }, ['¿Cómo fue tu experiencia?']),
            Caritas({ valor: 0, onChange: (n) => v.value = n }),
            eco,
          ]);
        })(),
        codigo: `import { Caritas } from '../_rating.js';

Caritas({
  valor: 0,
  conLabel: true,               // muestra "Bueno" debajo
  onChange: (nivel, opcion) => {
    // nivel: 1-5
    // opcion: { emoji: '😊', label: 'Bueno', color: '#22c55e' }
  },
})`,
      })],
    }),

    // ========== 4 ==========
    Seccion({
      titulo: '4 · Pulgares — like / dislike con conteo',
      descripcion: 'Patrón YouTube / GitHub / Stack Overflow para feedback rápido. 3-state: 👍 / sin selección / 👎. Click en el activo lo desselecciona. Opcionalmente muestra el conteo agregado.',
      hijos: [VistaCodigo({
        vista: Stack(
          crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } }, [
            crearEl('span', { style: { fontSize: '13px', color: 'var(--muted-foreground)' } }, ['¿Te resultó útil esta respuesta?']),
            Pulgares({ valor: 1, conConteo: true, counts: { up: 142, down: 8 } }),
          ]),
          crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } }, [
            crearEl('span', { style: { fontSize: '13px', color: 'var(--muted-foreground)' } }, ['¿Recomendarías este producto?']),
            Pulgares({ valor: 0, conConteo: true, counts: { up: 87, down: 15 } }),
          ]),
        ),
        codigo: `import { Pulgares } from '../_rating.js';

Pulgares({
  valor: 1,                     // -1 (dislike) | 0 | 1 (like)
  conConteo: true,
  counts: { up: 142, down: 8 },
  onChange: (v) => api.votar(v),
})`,
      })],
    }),

    // ========== 5 ==========
    Seccion({
      titulo: '5 · NPS — Net Promoter Score (0-10)',
      descripcion: 'La métrica estándar para medir lealtad de cliente. 0-6 detractores (rojo), 7-8 pasivos (amarillo), 9-10 promotores (verde). El color del pill se ajusta automáticamente. Usado por Apple, Slack, Notion, etc.',
      hijos: [VistaCodigo({
        vista: (() => {
          const v = senal(-1);
          const interpretacion = crearEl('div', { style: { fontSize: '12.5px', marginBlockStart: '8px', fontWeight: 600 } });
          efecto(() => {
            const n = v.value;
            if (n < 0) { interpretacion.textContent = ''; return; }
            if (n <= 6) { interpretacion.textContent = '⚠️ Detractor — necesita mejora urgente'; interpretacion.style.color = '#ef4444'; }
            else if (n <= 8) { interpretacion.textContent = '➖ Pasivo — satisfecho pero no leal'; interpretacion.style.color = '#eab308'; }
            else { interpretacion.textContent = '🎉 Promotor — recomendará activamente'; interpretacion.style.color = '#22c55e'; }
          });
          return crearEl('div', { style: { maxWidth: '480px' } }, [
            crearEl('h4', { style: { margin: '0 0 12px', fontSize: '14px', fontWeight: 600 } }, [
              '¿Qué tan probable es que recomiendes Launchpad a un colega?',
            ]),
            NPS({ onChange: (n) => v.value = n }),
            interpretacion,
          ]);
        })(),
        codigo: `import { NPS } from '../_rating.js';

NPS({
  conLabels: true,              // 'Nada probable' / 'Muy probable'
  onChange: (n) => {
    // n: 0-10
    // 0-6: detractor · 7-8: pasivo · 9-10: promotor
    api.guardarNPS(n);
  },
})`,
      })],
    }),

    // ========== 6 ==========
    Seccion({
      titulo: '6 · Corazones — favoritos / wishlist',
      descripcion: 'Patrón Spotify / Tinder / Pinterest. Click toggle (re-click deselecciona). Usado para favoritos, wishlists, "me gusta". El SVG del corazón se rellena cuando está activo (color rosa).',
      hijos: [VistaCodigo({
        vista: Stack(
          Campo({ label: 'Tu calificación de la canción', hijos: Corazones({ valor: 3, max: 5 }) }),
          Campo({ label: 'Single heart (favorito)', hijos: Corazones({ valor: 1, max: 1, tamano: 28 }) }),
          Campo({ label: 'Display reviews (sólo lectura)',
            hijos: Corazones({ valor: 4, max: 5, soloLectura: true, tamano: 18 }) }),
        ),
        codigo: `import { Corazones } from '../_rating.js';

Corazones({ valor: 3, max: 5, onChange: setFavorito })

// Como toggle de favorito (un solo corazón):
Corazones({ valor: 1, max: 1, tamano: 28, onChange: setFav })`,
      })],
    }),

    // ========== 7 ==========
    Seccion({
      titulo: '7 · Widget de resumen con histograma — Amazon style',
      descripcion: 'Para mostrar el promedio + total + distribución de cada nivel de estrellas (cuántas reseñas son 5★, 4★, etc.). El patrón clásico de Amazon, Booking, Trustpilot.',
      hijos: [VistaCodigo({
        vista: ResumenReviews({
          promedio: 4.6,
          total: 1284,
          distribucion: [12, 24, 65, 230, 953],   // [1★, 2★, 3★, 4★, 5★]
        }),
        codigo: `import { ResumenReviews } from '../_rating.js';

ResumenReviews({
  promedio: 4.6,
  total: 1284,
  distribucion: [12, 24, 65, 230, 953],
  // ↑ conteo por nivel: [1★, 2★, 3★, 4★, 5★]
})`,
      })],
    }),

    // ========== 8 ==========
    Seccion({
      titulo: '8 · Caso real — review form completo',
      descripcion: 'Combinación de varios sistemas en un form de review tipo Trustpilot / Stripe Reviews. Caritas para satisfacción general (visual y rápido), estrellas para criterios específicos, textarea + botón de enviar.',
      hijos: [VistaCodigo({
        vista: (() => {
          const cal = senal(0);
          const ent = senal(0);
          const ate = senal(0);
          const sat = senal(0);
          const btnSubmit = crearEl('button', {
            class: 'btn',
            disabled: true,
            style: { alignSelf: 'flex-start' },
          }, ['Publicar review']);
          efecto(() => {
            btnSubmit.disabled = !(cal.value && ent.value && ate.value && sat.value);
          });
          return crearEl('div', {
            style: {
              maxWidth: '500px',
              padding: 'var(--space-4) var(--space-5)',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              display: 'flex', flexDirection: 'column', gap: 'var(--space-3)',
            },
          }, [
            crearEl('h4', { style: { margin: 0, fontSize: '15px', fontWeight: 700 } }, ['¿Cómo te fue con tu pedido?']),

            crearEl('div', null, [
              crearEl('div', { style: { fontSize: '13px', fontWeight: 500, marginBlockEnd: '8px' } }, ['Satisfacción general']),
              Caritas({ onChange: (n) => sat.value = n }),
            ]),

            Campo({ label: 'Calidad del producto',
              hijos: Estrellas({ conEtiquetaTexto: true, onChange: (n) => cal.value = n }) }),
            Campo({ label: 'Tiempo de entrega',
              hijos: Estrellas({ conEtiquetaTexto: true, onChange: (n) => ent.value = n }) }),
            Campo({ label: 'Atención al cliente',
              hijos: Estrellas({ conEtiquetaTexto: true, onChange: (n) => ate.value = n }) }),

            Campo({ label: 'Cuéntanos más (opcional)',
              hijos: crearEl('textarea', { class: 'input', placeholder: '¿Qué fue lo que más te gustó?', rows: 3, style: { resize: 'vertical' } }) }),
            btnSubmit,
          ]);
        })(),
        codigo: `<form>
  <Caritas    onChange={setSat} />
  <Estrellas  label="Calidad" conEtiquetaTexto onChange={setCal} />
  <Estrellas  label="Entrega" conEtiquetaTexto onChange={setEnt} />
  <Textarea   placeholder="¿Qué fue lo que más te gustó?" />
  <Boton disabled={!todosCompletos}>Publicar review</Boton>
</form>`,
      })],
    }),

  ],
});
