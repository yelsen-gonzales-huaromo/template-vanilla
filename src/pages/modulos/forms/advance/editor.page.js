/**
 * Editor de DOCUMENTOS — un único editor potente, vanilla JS.
 * Tipo Google Docs / Notion: superficie tipo página, outline, tablas,
 * imágenes drag&drop, slash commands, imprimir/exportar.
 */
import { crearEl } from '../../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../../utils/helpers/reactive.js';
import { PaginaShowcase, Seccion } from '../../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../../components/ui/code-preview/code-preview.js';
import { corner3 } from '../../../../components/ui/card/card-decoraciones.js';
import { EditorDocumento } from '../_editor.js';

const HTML_INICIAL = `
<h1>Propuesta comercial — Q3 2026</h1>
<p>Este documento presenta el alcance, cronograma y entregables del proyecto. Puedes editarlo libremente — el editor soporta texto enriquecido, tablas, imágenes y bloques estructurales.</p>

<h2>1. Resumen ejecutivo</h2>
<p>El objetivo es <strong>migrar la plataforma legacy</strong> a una arquitectura moderna basada en módulos vanilla JS, eliminando dependencias pesadas y reduciendo el bundle inicial en un <em>62%</em>.</p>
<blockquote>Tip: presiona "/" en una línea vacía para ver el menú de bloques (slash commands).</blockquote>

<h2>2. Cronograma</h2>
<table class="editor-doc__tabla"><tbody>
  <tr><th>Fase</th><th>Duración</th><th>Entregable</th></tr>
  <tr><td>Discovery</td><td>2 semanas</td><td>Auditoría técnica + roadmap</td></tr>
  <tr><td>Diseño</td><td>3 semanas</td><td>Design system + wireframes</td></tr>
  <tr><td>Implementación</td><td>10 semanas</td><td>MVP funcional</td></tr>
  <tr><td>QA + lanzamiento</td><td>2 semanas</td><td>Producción</td></tr>
</tbody></table>

<h3>2.1 Hitos clave</h3>
<ul>
  <li><strong>Sprint 1</strong> — setup del repo + design tokens</li>
  <li><strong>Sprint 4</strong> — autenticación + perfiles</li>
  <li><strong>Sprint 7</strong> — dashboard analítico</li>
  <li><strong>Sprint 10</strong> — checkout + facturación</li>
</ul>

<h2>3. Stack técnico</h2>
<p>Usaremos vanilla JS con <code>contenteditable</code> nativo en lugar de TinyMCE para reducir el peso del bundle.</p>
<pre>// Ejemplo de uso del editor
import { EditorDocumento } from './_editor.js';

const ed = EditorDocumento({
  altura: 600,
  onChange: (html) => guardarBorrador(html),
});</pre>

<hr>
<p>Para más información contactar al equipo. <a href="mailto:proyectos@empresa.com">proyectos@empresa.com</a></p>
`.trim();

export default async () => PaginaShowcase({
  titulo: 'Editor de documentos',
  descripcion: 'Editor WYSIWYG completo tipo Google Docs / Notion — vanilla JS, sin TinyMCE. Una sola superficie tipo página con outline lateral, soporte para tablas (picker visual NxM), imágenes (URL · subida · drag & drop), slash commands ("/"), atajos completos, contador de palabras + tiempo de lectura, y botón de imprimir / exportar como PDF.',
  decoracion: corner3(),
  migas: [
    { etiqueta: 'Módulos', href: '#/modulos' },
    { etiqueta: 'Formularios', href: '#/modulos/forms' },
  ],
  hijos: [

    Seccion({
      titulo: '1 · Editor de documentos completo',
      descripcion: 'Una sola superficie potente. Toolbar con todo, página estilo Word/Docs en el centro, outline lateral con headings clickeables, footer con palabras + tiempo de lectura, botón de imprimir a la derecha. Arrastra una imagen al área de edición y se inserta en el cursor. Tipea "/" en una línea vacía para abrir el menú de bloques (Notion-style). Tipea ⌘K para insertar enlace.',
      hijos: [VistaCodigo({
        vista: EditorDocumento({
          altura: 620,
          valor: HTML_INICIAL,
        }),
        codigo: `import { EditorDocumento } from '../_editor.js';

EditorDocumento({
  altura: 620,
  valor: '<h1>Mi documento</h1><p>...</p>',
  onChange: (html) => guardarBorrador(html),
  conOutline: true,        // panel de navegación lateral
  conImprimir: true,       // botón de imprimir/exportar PDF
})

// Drag & drop de imágenes — funciona out-of-the-box
// Slash commands — tipea "/" en línea vacía
// Atajos — ⌘B, ⌘I, ⌘U, ⌘K, ⌘Z, ⌘⇧Z`,
      })],
    }),

    Seccion({
      titulo: '2 · Output reactivo en vivo',
      descripcion: 'El callback `onChange(html)` recibe el HTML del documento cada vez que cambia. Útil para auto-guardado en background, previsualización side-by-side o sincronización con un store.',
      hijos: [VistaCodigo({
        vista: (() => {
          const html = senal('<h2>Edita aquí</h2><p>El HTML aparece debajo.</p>');
          const out = crearEl('pre', {
            style: {
              margin: 0, padding: '12px 14px',
              background: 'var(--surface-muted)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              fontSize: '12px', lineHeight: 1.55,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              color: 'var(--foreground)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              maxHeight: '200px', overflow: 'auto',
            },
          });
          efecto(() => { out.textContent = html.value; });
          return crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px' } }, [
            EditorDocumento({
              altura: 360,
              valor: html.peek(),
              conOutline: false,
              conImprimir: false,
              onChange: (h) => html.value = h,
            }),
            crearEl('div', { style: { fontSize: '11px', fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' } }, ['HTML output']),
            out,
          ]);
        })(),
        codigo: `const html = senal('');

EditorDocumento({
  onChange: (h) => html.value = h,
})

// Reactivo — actualiza el preview con cada keystroke
efecto(() => { outputEl.textContent = html.value; });

// Para auto-guardado:
let timer;
EditorDocumento({
  onChange: (h) => {
    clearTimeout(timer);
    timer = setTimeout(() => guardarEnAPI(h), 1000);
  },
})`,
      })],
    }),

  ],
});
