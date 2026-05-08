/**
 * Wizard — 10 variantes profesionales para flujos multi-step.
 *
 *   1. WizardHorizontal     — stepper horizontal arriba con check + active (Stripe)
 *   2. WizardVertical       — stepper a la izquierda + form a la derecha (Linear)
 *   3. WizardProgreso       — barra slim arriba "Paso 3 de 5" (Typeform)
 *   4. WizardTabs           — tabs clicables, navegas libremente
 *   5. WizardCards          — grid de tarjetas para "elige una opción" por paso
 *   6. WizardChat           — conversacional, una pregunta a la vez (Calendly)
 *   7. WizardAcordeon       — vertical accordion (HubSpot Settings)
 *   8. WizardBranching      — paths según respuestas (paso.siguiente fn)
 *   9. WizardResumen        — último paso es review de todo lo capturado
 *  10. WizardCompacto       — modal compacto con vertical mini stepper
 *
 * API común:
 *   pasos: [{
 *     id, titulo, descripcion?, icono?,
 *     contenido: ({ datos, set }) => HTMLElement,   // función render
 *     validar?: (datos) => true | string,
 *     siguiente?: (datos) => idDelSiguiente,        // solo branching
 *   }]
 *   onComplete?: (datos) => void
 *   datos?: object inicial
 */

import { crearEl } from '../../../utils/helpers/dom.js';
import { Icono } from '../../../components/ui/icon/icons.js';

// ---------------------------------------------------------------------------
//  Helpers compartidos
// ---------------------------------------------------------------------------
const Btn = (texto, variante = 'primary', extra = {}) => crearEl('button', {
  type: extra.type || 'button',
  class: ['btn', variante !== 'primary' && `btn--${variante}`],
  ...extra,
}, [texto]);

const crearControlador = (pasos, datosIniciales = {}, opts = {}) => {
  const datos = { ...datosIniciales };
  let idxActual = 0;
  let historial = [0];   // para branching: pila de pasos visitados
  let direccion = 'der';  // 'der' (siguiente) | 'izq' (anterior)
  let completado = false;

  const ctrl = {
    get idx() { return idxActual; },
    get paso() { return pasos[idxActual]; },
    get datos() { return datos; },
    get direccion() { return direccion; },
    get completado() { return completado; },
    get esPrimero() { return historial.length === 1; },
    get esUltimo() { return idxActual === pasos.length - 1; },
    get total() { return pasos.length; },
    get historial() { return [...historial]; },
    set: (k, v) => { datos[k] = v; },
    siguiente: () => {
      const p = pasos[idxActual];
      if (p.validar) {
        const r = p.validar(datos);
        if (r !== true && r !== undefined) return { error: r };
      }
      direccion = 'der';
      let siguienteIdx = idxActual + 1;
      if (p.siguiente) {
        const idDest = p.siguiente(datos);
        const i = pasos.findIndex((x) => x.id === idDest);
        if (i >= 0) siguienteIdx = i;
      }
      if (siguienteIdx >= pasos.length) {
        completado = true;
        if (opts.onComplete) opts.onComplete(datos);
        return { completado: true };
      }
      idxActual = siguienteIdx;
      historial.push(idxActual);
      return { ok: true };
    },
    anterior: () => {
      if (historial.length <= 1) return;
      direccion = 'izq';
      historial.pop();
      idxActual = historial[historial.length - 1];
    },
    irA: (id) => {
      const i = pasos.findIndex((x) => x.id === id);
      if (i < 0) return;
      direccion = i > idxActual ? 'der' : 'izq';
      idxActual = i;
      if (!historial.includes(i)) historial.push(i);
    },
  };
  return ctrl;
};

// Lanza una pequeña explosión de confetti dentro del wrap (al completar)
export const lanzarConfetti = (wrap) => {
  const overlay = crearEl('div', { class: 'wiz-celebrar' });
  const colores = ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#a855f7', '#06b6d4'];
  for (let i = 0; i < 28; i++) {
    const dx = (Math.random() - 0.5) * 600;
    const dy = 100 + Math.random() * 300;
    const dr = (Math.random() * 720 - 360) + 'deg';
    const delay = Math.random() * 200;
    const p = crearEl('span', {
      class: 'wiz-celebrar__particula',
      style: {
        left: `${50 + (Math.random() - 0.5) * 20}%`,
        top: '20%',
        background: colores[i % colores.length],
        '--dx': `${dx}px`,
        '--dy': `${dy}px`,
        '--dr': dr,
        animationDelay: `${delay}ms`,
      },
    });
    overlay.appendChild(p);
  }
  wrap.appendChild(overlay);
  setTimeout(() => overlay.remove(), 2000);
};

// ===========================================================================
//  Stepper visuals (los wizards los reusan)
// ===========================================================================
const renderStepperHorizontal = (pasos, idx) =>
  crearEl('ol', { class: 'wiz-h__stepper' },
    pasos.map((p, i) => {
      const completo = i < idx, activo = i === idx;
      return crearEl('li', {
        class: ['wiz-h__paso', completo && 'wiz-h__paso--completo', activo && 'wiz-h__paso--activo'],
      }, [
        crearEl('div', { class: 'wiz-h__circulo' },
          [completo ? Icono('check', { tamano: 14 }) : String(i + 1)]),
        crearEl('div', { class: 'wiz-h__textos' }, [
          crearEl('div', { class: 'wiz-h__titulo' }, [p.titulo]),
          p.descripcion && crearEl('div', { class: 'wiz-h__desc' }, [p.descripcion]),
        ]),
      ]);
    }),
  );

const renderStepperVertical = (pasos, idx) =>
  crearEl('ol', { class: 'wiz-v__stepper' },
    pasos.map((p, i) => {
      const completo = i < idx, activo = i === idx;
      return crearEl('li', {
        class: ['wiz-v__paso', completo && 'wiz-v__paso--completo', activo && 'wiz-v__paso--activo'],
      }, [
        crearEl('div', { class: 'wiz-v__col' }, [
          crearEl('div', { class: 'wiz-v__circulo' }, [
            completo ? Icono('check', { tamano: 14 }) : String(i + 1),
          ]),
          i < pasos.length - 1 && crearEl('div', { class: 'wiz-v__linea' }),
        ]),
        crearEl('div', { class: 'wiz-v__cuerpo' }, [
          crearEl('div', { class: 'wiz-v__titulo' }, [p.titulo]),
          p.descripcion && crearEl('div', { class: 'wiz-v__desc' }, [p.descripcion]),
        ]),
      ]);
    }),
  );

const navegacion = (ctrl, render, opts = {}) => {
  const errBox = crearEl('div', { class: 'wiz-error' });
  const wrap = crearEl('div', { class: 'wiz-nav' }, [
    Btn('← Atrás', 'outline', {
      onClick: () => { ctrl.anterior(); render(); },
      disabled: ctrl.esPrimero || null,
    }),
    crearEl('span', { class: 'wiz-nav__paso' }, [`Paso ${ctrl.idx + 1} de ${ctrl.total}`]),
    Btn(ctrl.esUltimo ? (opts.textoFinal || 'Finalizar') : 'Siguiente →', 'primary', {
      onClick: () => {
        const r = ctrl.siguiente();
        if (r && r.error) { errBox.textContent = r.error; return; }
        errBox.textContent = '';
        if (r && r.completado && opts.contenedor) {
          lanzarConfetti(opts.contenedor);
        }
        render();
      },
    }),
  ]);
  return crearEl('div', null, [errBox, wrap]);
};

// ===========================================================================
//  1 · WizardHorizontal — stepper top con circulos + lineas
// ===========================================================================
export const WizardHorizontal = ({ pasos, datos = {}, onComplete } = {}) => {
  const wrap = crearEl('div', { class: 'wiz-h' });
  const ctrl = crearControlador(pasos, datos, { onComplete });

  const render = () => {
    wrap.replaceChildren(
      renderStepperHorizontal(pasos, ctrl.idx),
      crearEl('div', { class: 'wiz-h__panel' }, [
        crearEl('h3', { class: 'wiz-h__panel-titulo' }, [ctrl.paso.titulo]),
        ctrl.paso.descripcion && crearEl('p', { class: 'wiz-h__panel-desc' }, [ctrl.paso.descripcion]),
        ctrl.paso.contenido({ datos: ctrl.datos, set: ctrl.set }),
      ]),
      navegacion(ctrl, render, { contenedor: wrap }),
    );
  };
  render();
  return wrap;
};

// ===========================================================================
//  2 · WizardVertical — sidebar izq + form derecha
// ===========================================================================
export const WizardVertical = ({ pasos, datos = {}, onComplete } = {}) => {
  const wrap = crearEl('div', { class: 'wiz-v' });
  const ctrl = crearControlador(pasos, datos, { onComplete });

  const render = () => {
    wrap.replaceChildren(
      renderStepperVertical(pasos, ctrl.idx),
      crearEl('div', { class: 'wiz-v__panel' }, [
        crearEl('h3', { class: 'wiz-v__panel-titulo' }, [ctrl.paso.titulo]),
        ctrl.paso.descripcion && crearEl('p', { class: 'wiz-v__panel-desc' }, [ctrl.paso.descripcion]),
        ctrl.paso.contenido({ datos: ctrl.datos, set: ctrl.set }),
        navegacion(ctrl, render, { contenedor: wrap }),
      ]),
    );
  };
  render();
  return wrap;
};

// ===========================================================================
//  3 · WizardProgreso — barra slim arriba + "Paso N de M"
// ===========================================================================
export const WizardProgreso = ({ pasos, datos = {}, onComplete } = {}) => {
  const wrap = crearEl('div', { class: 'wiz-p' });
  const ctrl = crearControlador(pasos, datos, { onComplete });

  const render = () => {
    const pct = ((ctrl.idx + 1) / ctrl.total) * 100;
    wrap.replaceChildren(
      crearEl('div', { class: 'wiz-p__top' }, [
        crearEl('div', { class: 'wiz-p__meta' }, [
          crearEl('span', null, [`Paso ${ctrl.idx + 1} de ${ctrl.total}`]),
          crearEl('span', { class: 'wiz-p__meta-pct' }, [`${Math.round(pct)}%`]),
        ]),
        crearEl('div', { class: 'wiz-p__barra' }, [
          crearEl('div', { class: 'wiz-p__barra-fill', style: { width: `${pct}%` } }),
        ]),
      ]),
      crearEl('div', { class: 'wiz-p__panel' }, [
        crearEl('h3', { class: 'wiz-p__panel-titulo' }, [ctrl.paso.titulo]),
        ctrl.paso.descripcion && crearEl('p', { class: 'wiz-p__panel-desc' }, [ctrl.paso.descripcion]),
        ctrl.paso.contenido({ datos: ctrl.datos, set: ctrl.set }),
      ]),
      navegacion(ctrl, render, { contenedor: wrap }),
    );
  };
  render();
  return wrap;
};

// ===========================================================================
//  4 · WizardTabs — tabs clickeables (puede saltar libremente)
// ===========================================================================
export const WizardTabs = ({ pasos, datos = {}, onComplete } = {}) => {
  const wrap = crearEl('div', { class: 'wiz-t' });
  const ctrl = crearControlador(pasos, datos, { onComplete });

  const render = () => {
    wrap.replaceChildren(
      crearEl('div', { class: 'wiz-t__tabs', role: 'tablist' },
        pasos.map((p, i) => crearEl('button', {
          type: 'button',
          class: ['wiz-t__tab', i === ctrl.idx && 'wiz-t__tab--activa'],
          role: 'tab',
          onClick: () => { ctrl.irA(p.id); render(); },
        }, [
          crearEl('span', { class: 'wiz-t__tab-num' }, [String(i + 1)]),
          crearEl('span', { class: 'wiz-t__tab-lbl' }, [p.titulo]),
        ])),
      ),
      crearEl('div', { class: 'wiz-t__panel' }, [
        ctrl.paso.contenido({ datos: ctrl.datos, set: ctrl.set }),
      ]),
      navegacion(ctrl, render, { contenedor: wrap }),
    );
  };
  render();
  return wrap;
};

// ===========================================================================
//  5 · WizardCards — cada paso es un grid de tarjetas (elige una)
// ===========================================================================
//  Cada paso debe tener: pregunta, opciones: [{ id, titulo, desc, icono? }]
//  El componente guarda la selección en datos[paso.id]
// ===========================================================================
export const WizardCards = ({ pasos, datos = {}, onComplete } = {}) => {
  const wrap = crearEl('div', { class: 'wiz-c' });
  const ctrl = crearControlador(pasos, datos, { onComplete });

  const render = () => {
    const p = ctrl.paso;
    const seleccionado = ctrl.datos[p.id];
    wrap.replaceChildren(
      crearEl('div', { class: 'wiz-c__progreso' }, [
        ...pasos.map((_, i) => crearEl('span', {
          class: ['wiz-c__dot', i <= ctrl.idx && 'wiz-c__dot--on'],
        })),
      ]),
      crearEl('h3', { class: 'wiz-c__titulo' }, [p.titulo]),
      p.descripcion && crearEl('p', { class: 'wiz-c__desc' }, [p.descripcion]),
      crearEl('div', { class: 'wiz-c__grid' },
        (p.opciones || []).map((o) => crearEl('button', {
          type: 'button',
          class: ['wiz-c__card', seleccionado === o.id && 'wiz-c__card--sel'],
          onClick: () => { ctrl.set(p.id, o.id); render(); },
        }, [
          o.icono && crearEl('div', { class: 'wiz-c__card-icono' }, [o.icono]),
          crearEl('div', { class: 'wiz-c__card-titulo' }, [o.titulo]),
          o.desc && crearEl('div', { class: 'wiz-c__card-desc' }, [o.desc]),
        ])),
      ),
      navegacion(ctrl, render, { contenedor: wrap }),
    );
  };
  render();
  return wrap;
};

// ===========================================================================
//  6 · WizardChat — conversacional, una pregunta a la vez con animación slide
// ===========================================================================
export const WizardChat = ({ pasos, datos = {}, onComplete } = {}) => {
  const wrap = crearEl('div', { class: 'wiz-ch' });
  const ctrl = crearControlador(pasos, datos, { onComplete });

  const render = () => {
    const p = ctrl.paso;
    const slide = crearEl('div', {
      class: ['wiz-ch__slide', `wiz-ch__slide--enter-${ctrl.direccion}`],
    }, [
      crearEl('div', { class: 'wiz-ch__contador' }, [`Pregunta ${ctrl.idx + 1} de ${ctrl.total}`]),
      crearEl('h3', { class: 'wiz-ch__pregunta' }, [p.titulo]),
      p.descripcion && crearEl('p', { class: 'wiz-ch__desc' }, [p.descripcion]),
      crearEl('div', { class: 'wiz-ch__input-area' }, [p.contenido({ datos: ctrl.datos, set: ctrl.set })]),
      crearEl('div', { class: 'wiz-ch__acciones' }, [
        Btn(ctrl.esUltimo ? '✓ Finalizar' : 'Continuar →', 'primary', {
          onClick: () => {
            const r = ctrl.siguiente();
            if (r && r.error) return;
            if (r && r.completado) lanzarConfetti(wrap);
            render();
          },
        }),
        !ctrl.esPrimero && crearEl('button', {
          type: 'button',
          class: 'wiz-ch__back',
          onClick: () => { ctrl.anterior(); render(); },
        }, ['↑ Anterior pregunta']),
      ]),
    ]);
    wrap.replaceChildren(
      crearEl('div', { class: 'wiz-ch__progreso' }, [
        crearEl('div', {
          class: 'wiz-ch__progreso-fill',
          style: { width: `${((ctrl.idx + 1) / ctrl.total) * 100}%` },
        }),
      ]),
      slide,
    );
  };
  render();
  return wrap;
};

// ===========================================================================
//  7 · WizardAcordeon — vertical accordion, current expanded
// ===========================================================================
export const WizardAcordeon = ({ pasos, datos = {}, onComplete } = {}) => {
  const wrap = crearEl('div', { class: 'wiz-a' });
  const ctrl = crearControlador(pasos, datos, { onComplete });

  const render = () => {
    wrap.replaceChildren(...pasos.map((p, i) => {
      const completo = i < ctrl.idx, activo = i === ctrl.idx;
      const item = crearEl('div', {
        class: ['wiz-a__item', completo && 'wiz-a__item--completo', activo && 'wiz-a__item--activo'],
      }, [
        crearEl('button', {
          type: 'button',
          class: 'wiz-a__head',
          disabled: !completo && !activo,
          onClick: () => { if (completo) { ctrl.irA(p.id); render(); } },
        }, [
          crearEl('span', { class: 'wiz-a__circulo' },
            [completo ? Icono('check', { tamano: 14 }) : String(i + 1)]),
          crearEl('div', { class: 'wiz-a__head-textos' }, [
            crearEl('div', { class: 'wiz-a__titulo' }, [p.titulo]),
            p.descripcion && crearEl('div', { class: 'wiz-a__desc' }, [p.descripcion]),
          ]),
        ]),
        activo && crearEl('div', { class: 'wiz-a__cuerpo' }, [
          p.contenido({ datos: ctrl.datos, set: ctrl.set }),
          crearEl('div', { class: 'wiz-a__acciones' }, [
            !ctrl.esPrimero && Btn('Atrás', 'outline', {
              onClick: () => { ctrl.anterior(); render(); },
            }),
            Btn(ctrl.esUltimo ? 'Finalizar' : 'Continuar', 'primary', {
              onClick: () => {
                const r = ctrl.siguiente();
                if (r.error) return;
                if (r.completado) lanzarConfetti(wrap);
                render();
              },
            }),
          ]),
        ]),
      ]);
      return item;
    }));
  };
  render();
  return wrap;
};

// ===========================================================================
//  8 · WizardBranching — usa paso.siguiente(datos) → idDeOtroPaso
// ===========================================================================
//  Renderiza con stepper horizontal pero solo muestra los pasos visitados
//  (porque el path puede variar según las respuestas).
// ===========================================================================
export const WizardBranching = ({ pasos, datos = {}, onComplete } = {}) => {
  const wrap = crearEl('div', { class: 'wiz-h wiz-br' });
  const ctrl = crearControlador(pasos, datos, { onComplete });

  const render = () => {
    const visitados = ctrl.historial.map((i) => pasos[i]);
    wrap.replaceChildren(
      crearEl('ol', { class: 'wiz-h__stepper wiz-br__stepper' },
        visitados.map((p, i) => {
          const completo = i < visitados.length - 1;
          const activo = i === visitados.length - 1;
          return crearEl('li', {
            class: ['wiz-h__paso', completo && 'wiz-h__paso--completo', activo && 'wiz-h__paso--activo'],
          }, [
            crearEl('div', { class: 'wiz-h__circulo' },
              [completo ? Icono('check', { tamano: 14 }) : String(i + 1)]),
            crearEl('div', { class: 'wiz-h__textos' }, [
              crearEl('div', { class: 'wiz-h__titulo' }, [p.titulo]),
            ]),
          ]);
        }),
      ),
      crearEl('div', { class: 'wiz-h__panel' }, [
        crearEl('div', { class: 'wiz-br__badge' }, [
          Icono('asistente', { tamano: 12 }), ' Path adaptativo según tus respuestas',
        ]),
        crearEl('h3', { class: 'wiz-h__panel-titulo' }, [ctrl.paso.titulo]),
        ctrl.paso.descripcion && crearEl('p', { class: 'wiz-h__panel-desc' }, [ctrl.paso.descripcion]),
        ctrl.paso.contenido({ datos: ctrl.datos, set: ctrl.set }),
      ]),
      navegacion(ctrl, render, { contenedor: wrap }),
    );
  };
  render();
  return wrap;
};

// ===========================================================================
//  9 · WizardResumen — el último paso muestra resumen + edit per-paso
// ===========================================================================
//  Espera que la última definición de paso tenga `tipo: 'resumen'`. Itera
//  sobre los pasos previos y muestra los `datos[paso.id]` con un botón Editar.
// ===========================================================================
export const WizardResumen = ({ pasos, datos = {}, onComplete } = {}) => {
  const wrap = crearEl('div', { class: 'wiz-h wiz-r' });
  const ctrl = crearControlador(pasos, datos, { onComplete });

  const render = () => {
    const esResumen = ctrl.paso.tipo === 'resumen';
    let panel;
    if (esResumen) {
      const resumenItems = pasos.slice(0, -1).map((p) => crearEl('div', { class: 'wiz-r__fila' }, [
        crearEl('div', { class: 'wiz-r__fila-lbl' }, [p.titulo]),
        crearEl('div', { class: 'wiz-r__fila-val' },
          [(p.resumir ? p.resumir(ctrl.datos) : ctrl.datos[p.id] || '—')]),
        crearEl('button', {
          type: 'button', class: 'wiz-r__editar',
          onClick: () => { ctrl.irA(p.id); render(); },
        }, [Icono('editar', { tamano: 12 }), 'Editar']),
      ]));
      panel = crearEl('div', { class: 'wiz-h__panel' }, [
        crearEl('h3', { class: 'wiz-h__panel-titulo' }, [ctrl.paso.titulo]),
        ctrl.paso.descripcion && crearEl('p', { class: 'wiz-h__panel-desc' }, [ctrl.paso.descripcion]),
        crearEl('div', { class: 'wiz-r__lista' }, resumenItems),
      ]);
    } else {
      panel = crearEl('div', { class: 'wiz-h__panel' }, [
        crearEl('h3', { class: 'wiz-h__panel-titulo' }, [ctrl.paso.titulo]),
        ctrl.paso.descripcion && crearEl('p', { class: 'wiz-h__panel-desc' }, [ctrl.paso.descripcion]),
        ctrl.paso.contenido({ datos: ctrl.datos, set: ctrl.set }),
      ]);
    }
    wrap.replaceChildren(
      renderStepperHorizontal(pasos, ctrl.idx),
      panel,
      navegacion(ctrl, render, { contenedor: wrap, textoFinal: 'Confirmar y enviar' }),
    );
  };
  render();
  return wrap;
};

// ===========================================================================
//  10 · WizardCompacto — para modales / popovers, mini stepper vertical
// ===========================================================================
export const WizardCompacto = ({ pasos, datos = {}, onComplete } = {}) => {
  const wrap = crearEl('div', { class: 'wiz-cp' });
  const ctrl = crearControlador(pasos, datos, { onComplete });

  const render = () => {
    wrap.replaceChildren(
      // Mini header: dots + título actual
      crearEl('div', { class: 'wiz-cp__header' }, [
        crearEl('div', { class: 'wiz-cp__dots' },
          pasos.map((_, i) => crearEl('span', {
            class: ['wiz-cp__dot',
              i < ctrl.idx && 'wiz-cp__dot--ok',
              i === ctrl.idx && 'wiz-cp__dot--actual'],
          })),
        ),
        crearEl('div', { class: 'wiz-cp__head-textos' }, [
          crearEl('div', { class: 'wiz-cp__contador' }, [`Paso ${ctrl.idx + 1} de ${ctrl.total}`]),
          crearEl('div', { class: 'wiz-cp__titulo' }, [ctrl.paso.titulo]),
        ]),
      ]),
      crearEl('div', { class: 'wiz-cp__cuerpo' }, [
        ctrl.paso.contenido({ datos: ctrl.datos, set: ctrl.set }),
      ]),
      crearEl('div', { class: 'wiz-cp__acciones' }, [
        !ctrl.esPrimero && Btn('Atrás', 'ghost', {
          onClick: () => { ctrl.anterior(); render(); },
        }),
        crearEl('div', { style: { flex: 1 } }),
        Btn(ctrl.esUltimo ? 'Crear' : 'Siguiente', 'primary', {
          onClick: () => {
            const r = ctrl.siguiente();
            if (r.error) return;
            if (r.completado) lanzarConfetti(wrap);
            render();
          },
        }),
      ]),
    );
  };
  render();
  return wrap;
};
