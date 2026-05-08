import { crearEl } from '../../../utils/helpers/dom.js';
import { senal } from '../../../utils/helpers/reactive.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { BarraProgreso, BarraSegmentada, ProgresoCircular } from '../../../components/ui/progress/progress.js';
import { Boton } from '../../../components/ui/button/button.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { corner5 } from '../../../components/ui/card/card-decoraciones.js';

const stack = (...nodos) => crearEl('div', {
  style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', width: '100%' },
}, nodos);

const fila = (...nodos) => crearEl('div', {
  style: { display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' },
}, nodos);

// Helper: renderiza un par "label + barra" para casos como "Subiendo archivo"
const filaConLabel = (label, barra, derecha) => crearEl('div', {
  style: { display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' },
}, [
  crearEl('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' } }, [
    crearEl('span', { style: { color: 'var(--muted-foreground)' } }, [label]),
    derecha && crearEl('span', { style: { color: 'var(--foreground)', fontWeight: 600 } }, [derecha]),
  ]),
  barra,
]);

export default async () => {
  // Demos reactivas
  const valor = senal(35);
  const subida = senal(0);
  const subiendo = senal(false);
  const password = senal('');

  // Simulación de subida
  let timer;
  const empezarSubida = () => {
    if (subiendo.value) return;
    subiendo.value = true;
    subida.value = 0;
    timer = setInterval(() => {
      const incremento = Math.random() * 8 + 2;
      subida.value = Math.min(100, subida.value + incremento);
      if (subida.value >= 100) { clearInterval(timer); subiendo.value = false; }
    }, 200);
  };

  // Password strength helper
  const calcStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8)  score += 25;
    if (pwd.length >= 12) score += 15;
    if (/[A-Z]/.test(pwd)) score += 20;
    if (/[0-9]/.test(pwd)) score += 20;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 20;
    return Math.min(100, score);
  };
  const strengthInfo = senal({ valor: 0, label: 'Vacía', variante: 'muted' });
  const onPwdInput = (e) => {
    const v = e.currentTarget.value;
    password.value = v;
    const score = calcStrength(v);
    let label = 'Vacía', variante = 'danger';
    if (score === 0)        { label = 'Vacía'; variante = 'danger'; }
    else if (score < 35)    { label = 'Débil'; variante = 'danger'; }
    else if (score < 65)    { label = 'Regular'; variante = 'warning'; }
    else if (score < 90)    { label = 'Buena'; variante = 'info'; }
    else                    { label = 'Excelente'; variante = 'success'; }
    strengthInfo.value = { valor: score, label, variante };
  };

  return PaginaShowcase({
    titulo: 'Barra de progreso',
    descripcion: 'Indicador de progreso con valor reactivo. 5 variantes semánticas, 5 alturas, modo rayado animado, indeterminado (loading), buffer (estilo YouTube), segmentada multi-color y versión circular SVG. Valor reactivo via `senal` actualiza la barra automáticamente.',
    decoracion: corner5(),
    migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
    hijos: [

      // ============== 1. VARIANTES ==============
      Seccion({
        titulo: '1 · Variantes semánticas',
        descripcion: '5 colores que comunican significado: primary (default), success (completado), warning (atención), danger (crítico), info (informativo).',
        hijos: [VistaCodigo({
          vista: stack(
            filaConLabel('Primary',  BarraProgreso({ valor: 25, variante: 'primary', alto: 'lg' }), '25%'),
            filaConLabel('Success',  BarraProgreso({ valor: 55, variante: 'success', alto: 'lg' }), '55%'),
            filaConLabel('Warning',  BarraProgreso({ valor: 75, variante: 'warning', alto: 'lg' }), '75%'),
            filaConLabel('Danger',   BarraProgreso({ valor: 95, variante: 'danger',  alto: 'lg' }), '95%'),
            filaConLabel('Info',     BarraProgreso({ valor: 65, variante: 'info',    alto: 'lg' }), '65%'),
          ),
          codigo: `BarraProgreso({ valor: 25, variante: 'primary' })
BarraProgreso({ valor: 55, variante: 'success' })
BarraProgreso({ valor: 75, variante: 'warning' })
BarraProgreso({ valor: 95, variante: 'danger' })
BarraProgreso({ valor: 65, variante: 'info' })`,
        })],
      }),

      // ============== 2. ALTURAS ==============
      Seccion({
        titulo: '2 · Alturas',
        descripcion: '5 alturas: `xs` (4px) · `sm` (6px) · `md` (10px, default) · `lg` (14px) · `xl` (20px). Usa `xs/sm` para indicadores discretos y `lg/xl` cuando la barra es protagonista.',
        hijos: [VistaCodigo({
          vista: stack(
            filaConLabel('xs · 4px',  BarraProgreso({ valor: 60, alto: 'xs' })),
            filaConLabel('sm · 6px',  BarraProgreso({ valor: 60, alto: 'sm' })),
            filaConLabel('md · 10px', BarraProgreso({ valor: 60, alto: 'md' })),
            filaConLabel('lg · 14px', BarraProgreso({ valor: 60, alto: 'lg' })),
            filaConLabel('xl · 20px', BarraProgreso({ valor: 60, alto: 'xl' })),
          ),
          codigo: `BarraProgreso({ valor: 60, alto: 'xs' })   // 4px
BarraProgreso({ valor: 60, alto: 'sm' })   // 6px
BarraProgreso({ valor: 60, alto: 'md' })   // 10px (default)
BarraProgreso({ valor: 60, alto: 'lg' })   // 14px
BarraProgreso({ valor: 60, alto: 'xl' })   // 20px`,
        })],
      }),

      // ============== 3. CON ETIQUETA ==============
      Seccion({
        titulo: '3 · Con etiqueta de %',
        descripcion: '`etiqueta: true` añade el porcentaje a la derecha. `formato` permite custom labels (`"5 de 8 tareas"`, `"234 / 500 MB"`).',
        hijos: [VistaCodigo({
          vista: stack(
            BarraProgreso({ valor: 42, etiqueta: true, alto: 'md' }),
            BarraProgreso({ valor: 78, etiqueta: true, variante: 'success', alto: 'md',
              formato: (v) => `${v} de 100 tareas` }),
            BarraProgreso({ valor: 234, total: 500, etiqueta: true, variante: 'warning', alto: 'md',
              formato: (v, t) => `${v} / ${t} MB` }),
          ),
          codigo: `BarraProgreso({ valor: 42, etiqueta: true })           // "42%"

BarraProgreso({
  valor: 78, etiqueta: true,
  formato: (v) => \`\${v} de 100 tareas\`,                  // "78 de 100 tareas"
})

BarraProgreso({
  valor: 234, total: 500, etiqueta: true,
  formato: (v, t) => \`\${v} / \${t} MB\`,                   // "234 / 500 MB"
})`,
        })],
      }),

      // ============== 4. RAYADA + ANIMADA ==============
      Seccion({
        titulo: '4 · Rayada y animada',
        descripcion: 'Stripes diagonales (`rayada: true`) — patrón clásico de "trabajando…". Combinada con `animada: true` las stripes se mueven en loop.',
        hijos: [VistaCodigo({
          vista: stack(
            filaConLabel('Rayada estática',
              BarraProgreso({ valor: 70, rayada: true, variante: 'primary', alto: 'lg' })),
            filaConLabel('Rayada animada',
              BarraProgreso({ valor: 50, rayada: true, animada: true, variante: 'success', alto: 'lg' })),
            filaConLabel('Animada (warning)',
              BarraProgreso({ valor: 85, rayada: true, animada: true, variante: 'warning', alto: 'lg' })),
          ),
          codigo: `BarraProgreso({ valor: 70, rayada: true })
BarraProgreso({ valor: 50, rayada: true, animada: true })   // las rayas se mueven`,
        })],
      }),

      // ============== 5. INDETERMINADA (loading) ==============
      Seccion({
        titulo: '5 · Indeterminada (loading)',
        descripcion: 'Sin valor fijo — un haz de luz recorre la barra en loop. Para operaciones cuyo progreso no se puede medir (request a API, conexión inicial).',
        hijos: [VistaCodigo({
          vista: stack(
            filaConLabel('Cargando datos…',
              BarraProgreso({ indeterminada: true, variante: 'primary', alto: 'sm' })),
            filaConLabel('Sincronizando…',
              BarraProgreso({ indeterminada: true, variante: 'info', alto: 'md' })),
            filaConLabel('Procesando pago…',
              BarraProgreso({ indeterminada: true, variante: 'success', alto: 'lg' })),
          ),
          codigo: `BarraProgreso({ indeterminada: true })
// Sin 'valor' — el haz se mueve en loop infinito.
// Ideal para fetches sin %, polling, etc.`,
        })],
      }),

      // ============== 6. BUFFER (YouTube style) ==============
      Seccion({
        titulo: '6 · Con buffer (estilo YouTube)',
        descripcion: 'Dos capas: el `buffer` (lo descargado) en color tenue + el `valor` (lo reproducido) en color sólido. Patrón de reproductores de video.',
        hijos: [VistaCodigo({
          vista: stack(
            filaConLabel('Reproduciendo · 25%, buffer 60%',
              BarraProgreso({ valor: 25, buffer: 60, variante: 'primary', alto: 'sm' })),
            filaConLabel('45%, buffer 78%',
              BarraProgreso({ valor: 45, buffer: 78, variante: 'primary', alto: 'sm' })),
            filaConLabel('72%, buffer 95%',
              BarraProgreso({ valor: 72, buffer: 95, variante: 'primary', alto: 'sm' })),
          ),
          codigo: `BarraProgreso({ valor: 25, buffer: 60 })
// Capa interna 'buffer' (color tenue del primary)
// Capa principal 'valor' (color sólido)`,
        })],
      }),

      // ============== 7. SEGMENTADA (multi-color) ==============
      Seccion({
        titulo: '7 · Segmentada / multi-color',
        descripcion: 'Para visualizar la composición de un total — uso de almacenamiento, distribución de presupuesto, breakdown de tiempo. Una sola barra dividida en partes coloreadas con leyenda opcional.',
        hijos: [VistaCodigo({
          vista: stack(
            crearEl('div', { style: { fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', marginBlockEnd: 4 } },
              ['Almacenamiento — usando 1.78 GB de 2 GB']),
            BarraSegmentada({
              alto: 'lg',
              leyenda: true,
              segmentos: [
                { valor: 895, etiqueta: 'Documentos',  variante: 'primary' },
                { valor: 379, etiqueta: 'Sistema',     variante: 'info' },
                { valor: 192, etiqueta: 'Compartido',  variante: 'success' },
                { valor: 314, etiqueta: 'Cache',       variante: 'warning' },
                { valor: 224, etiqueta: 'Libre',       variante: 'muted' },
              ],
              total: 2000,
            }),
            crearEl('div', { style: { fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', marginBlockStart: 'var(--space-3)' } },
              ['Distribución de presupuesto Q3']),
            BarraSegmentada({
              alto: 'lg',
              leyenda: true,
              segmentos: [
                { valor: 35, etiqueta: 'Engineering', variante: 'primary' },
                { valor: 25, etiqueta: 'Marketing',   variante: 'violet' },
                { valor: 18, etiqueta: 'Sales',       variante: 'success' },
                { valor: 12, etiqueta: 'Operaciones', variante: 'warning' },
                { valor: 10, etiqueta: 'Otros',       variante: 'pink' },
              ],
              total: 100,
            }),
          ),
          codigo: `BarraSegmentada({
  alto: 'lg',
  leyenda: true,
  segmentos: [
    { valor: 895, etiqueta: 'Documentos',  variante: 'primary' },
    { valor: 379, etiqueta: 'Sistema',     variante: 'info' },
    { valor: 192, etiqueta: 'Compartido',  variante: 'success' },
    { valor: 314, etiqueta: 'Cache',       variante: 'warning' },
    { valor: 224, etiqueta: 'Libre',       variante: 'muted' },
  ],
  total: 2000,
})`,
        })],
      }),

      // ============== 8. CIRCULAR ==============
      Seccion({
        titulo: '8 · Circular (donut)',
        descripcion: 'Versión SVG con stroke-dasharray para llenar el círculo. Para dashboards y completion rings (Apple Watch style). Configurable `tamano`, `grosor`, `variante`.',
        hijos: [VistaCodigo({
          vista: fila(
            ProgresoCircular({ valor: 25, variante: 'danger',  tamano: 80 }),
            ProgresoCircular({ valor: 55, variante: 'warning', tamano: 80 }),
            ProgresoCircular({ valor: 78, variante: 'primary', tamano: 80 }),
            ProgresoCircular({ valor: 92, variante: 'success', tamano: 80 }),
            ProgresoCircular({ valor: 64, variante: 'info', tamano: 120, grosor: 12 }),
            // Custom format: storage style
            ProgresoCircular({
              valor: 1240, total: 2000, variante: 'warning',
              tamano: 120, grosor: 12,
              formato: (v) => `${(v/1000).toFixed(1)}GB`,
            }),
          ),
          codigo: `ProgresoCircular({ valor: 78, variante: 'primary', tamano: 80 })

ProgresoCircular({
  valor: 1240, total: 2000,
  tamano: 120, grosor: 12,
  formato: (v) => \`\${(v/1000).toFixed(1)}GB\`,    // "1.2GB" en el centro
})`,
        })],
      }),

      // ============== 9. CASOS DE USO REALES ==============
      Seccion({
        titulo: '9 · Casos de uso reales',
        descripcion: 'Patrones del día a día — subida de archivo simulada (con velocidad variable), strength meter de password en tiempo real, perfil de usuario completado.',
        hijos: [VistaCodigo({
          vista: stack(
            // 9a · Subida de archivo
            crearEl('div', { style: {
              padding: 'var(--space-3) var(--space-4)',
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
            } }, [
              crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)' } }, [
                crearEl('span', { style: {
                  width: '40px', height: '40px',
                  background: 'color-mix(in srgb, var(--primary) 14%, transparent)',
                  color: 'var(--primary)',
                  borderRadius: 'var(--radius)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                } }, [Icono('subir', { tamano: 18 })]),
                crearEl('div', { style: { flex: 1, minWidth: 0 } }, [
                  crearEl('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', marginBlockEnd: 4 } }, [
                    crearEl('span', { style: { fontWeight: 600 } }, ['video-presentacion-final.mp4']),
                    crearEl('span', { style: { color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' } }, ['142.6 MB']),
                  ]),
                  BarraProgreso({ valor: subida, etiqueta: true, variante: 'primary', alto: 'sm',
                    formato: (v) => `${Math.round(v)}%` }),
                ]),
                Boton({ texto: 'Subir', variante: 'primary', tamano: 'sm', onClick: empezarSubida }),
              ]),
            ]),

            // 9b · Password strength
            crearEl('div', { style: {
              padding: 'var(--space-3) var(--space-4)',
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              display: 'flex', flexDirection: 'column', gap: 'var(--space-2)',
            } }, [
              crearEl('label', { style: { display: 'flex', flexDirection: 'column', gap: 6 } }, [
                crearEl('span', { style: { fontSize: 'var(--text-sm)', fontWeight: 600 } }, ['Nueva contraseña']),
                crearEl('input', {
                  type: 'password', placeholder: 'Mínimo 8 caracteres',
                  onInput: onPwdInput,
                  style: {
                    padding: '8px 12px', fontSize: 'var(--text-sm)',
                    background: 'var(--background)', color: 'var(--foreground)',
                    border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                  },
                }),
              ]),
              filaConLabel(
                (() => {
                  const span = crearEl('span', null, [strengthInfo.peek().label]);
                  strengthInfo.subscribe((s) => { span.textContent = `Fuerza: ${s.label}`; });
                  return span;
                })(),
                (() => {
                  // Reactive bar — manually wire because variante changes
                  const wrap = crearEl('div', { style: { width: '100%' } });
                  strengthInfo.subscribe((s) => {
                    wrap.replaceChildren(
                      BarraProgreso({ valor: s.valor, variante: s.variante, alto: 'sm' }),
                    );
                  });
                  return wrap;
                })(),
              ),
            ]),

            // 9c · Perfil completado
            crearEl('div', { style: {
              padding: 'var(--space-4)',
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
            } }, [
              ProgresoCircular({ valor: 65, variante: 'primary', tamano: 64, grosor: 6 }),
              crearEl('div', { style: { flex: 1 } }, [
                crearEl('strong', { style: { fontSize: 'var(--text-base)', display: 'block' } }, ['Completa tu perfil']),
                crearEl('p', { style: { margin: '4px 0 0', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' } },
                  ['4 de 6 secciones completadas — añade tu foto y bio para llegar al 100%.']),
              ]),
              Boton({ texto: 'Completar', variante: 'primary', tamano: 'sm' }),
            ]),
          ),
          codigo: `// Subida reactiva con simulación
const subida = senal(0);
setInterval(() => {
  subida.value = Math.min(100, subida.value + Math.random() * 8);
}, 200);

BarraProgreso({ valor: subida, etiqueta: true, formato: v => \`\${Math.round(v)}%\` })

// Password strength — variante cambia según score
strengthInfo.subscribe(({ valor, variante }) => {
  wrap.replaceChildren(BarraProgreso({ valor, variante, alto: 'sm' }));
});`,
        })],
      }),

      // ============== 10. REACTIVA (controles manuales) ==============
      Seccion({
        titulo: '10 · Reactiva',
        descripcion: 'El prop `valor` puede ser una `senal` — la barra se actualiza sola al cambiarla. Sin re-render del componente.',
        hijos: [VistaCodigo({
          vista: stack(
            BarraProgreso({ valor, etiqueta: true, alto: 'lg' }),
            crearEl('div', { style: { display: 'flex', gap: 'var(--space-2)' } }, [
              Boton({ texto: '−10', variante: 'secondary', tamano: 'sm',
                onClick: () => { valor.value = Math.max(0, valor.value - 10); } }),
              Boton({ texto: '+10', variante: 'primary', tamano: 'sm',
                onClick: () => { valor.value = Math.min(100, valor.value + 10); } }),
              Boton({ texto: 'Reiniciar', variante: 'ghost', tamano: 'sm',
                onClick: () => { valor.value = 0; } }),
            ]),
          ),
          codigo: `const valor = senal(35);
BarraProgreso({ valor, etiqueta: true })

// Cualquier cambio reactivo a la señal actualiza la barra:
valor.value = 80;`,
        })],
      }),
    ],
  });
};
