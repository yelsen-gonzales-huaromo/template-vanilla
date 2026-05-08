/**
 * Banco completo de iconos — layout limpio sin alertas redundantes.
 *
 * Estructura:
 *   [Tabs principales: Lottie / SVG / SVG animados]
 *   [Toolbar combinado: search + chips de categoría en una fila]
 *   [Grid filtrable]
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { Pestanas } from '../../../components/ui/tabs/tabs.js';
import { Insignia } from '../../../components/ui/badge/badge.js';
import { notificar } from '../../../components/ui/toast/toast.js';
import { Lottie } from '../../../components/ui/lottie/lottie.js';
import {
  ANIMACIONES_PRO, TODAS_PRO,
} from '../../../components/common/animations-pro/animations-pro.js';
import {
  LOTTIE_CATALOGO, LOTTIE_TODAS, resolverFuenteLottie,
} from '../../../components/common/lottie-catalog/lottie-catalog.js';
import {
  SVG_ICONOS_PRO, SVG_TODOS,
} from '../../../components/common/svg-icons-pro/svg-icons-pro.js';
import { corner2 } from '../../../components/ui/card/card-decoraciones.js';

// ============================================================================
//  Cards
// ============================================================================
const cardLottie = (item) => {
  const lienzo = crearEl('div', { class: 'ap-card__lienzo' });
  const codigo = `LottieIcon('${item.id}', { tamano: 64 })`;
  const card = crearEl('button', {
    type: 'button', class: 'ap-card', 'data-tipo': 'lottie',
    'data-fondo-blanco': item.fondoBlanco ? 'true' : null,
    title: 'Click para copiar el código',
    onClick: async () => {
      try {
        await navigator.clipboard.writeText(codigo);
        card.classList.add('ap-card--copiado');
        notificar.exito(`Copiado: ${item.id}`);
        setTimeout(() => card.classList.remove('ap-card--copiado'), 1200);
      } catch (_) { notificar.error('No se pudo copiar'); }
    },
  }, [
    lienzo,
    crearEl('div', { class: 'ap-card__cuerpo' }, [
      crearEl('strong', { class: 'ap-card__nombre' }, [item.nombre]),
      crearEl('code', { class: 'ap-card__id' }, [item.id]),
    ]),
  ]);

  let montado = false;
  const observer = new IntersectionObserver(async (entries) => {
    if (entries[0]?.isIntersecting && !montado) {
      montado = true; observer.disconnect();
      const src = await resolverFuenteLottie(item);
      lienzo.appendChild(Lottie({ src, alto: '100%', ancho: '100%', loop: true, autoplay: true }));
    }
  }, { threshold: 0.1 });
  requestAnimationFrame(() => observer.observe(card));
  return card;
};

const cardSvgEstatico = (item) => {
  const codigo = `IconoPro('${item.id}', { tamano: 32 })`;
  return crearEl('button', {
    type: 'button', class: 'ap-card', 'data-tipo': 'svg',
    title: 'Click para copiar el código',
    onClick: async () => {
      try {
        await navigator.clipboard.writeText(codigo);
        notificar.exito(`Copiado: ${item.id}`);
      } catch (_) { notificar.error('No se pudo copiar'); }
    },
  }, [
    crearEl('div', { class: 'ap-card__lienzo' }, [
      crearEl('img', { src: item.src, alt: item.nombre, style: { maxWidth: '64px', maxHeight: '64px' } }),
    ]),
    crearEl('div', { class: 'ap-card__cuerpo' }, [
      crearEl('strong', { class: 'ap-card__nombre' }, [item.nombre]),
      crearEl('code', { class: 'ap-card__id' }, [item.id]),
    ]),
  ]);
};

const camelCase = (id) => id.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const cardSvgAnimado = (item) => {
  const codigo = `import { ${camelCase(item.id)} } from '.../animations-pro.js';\nhost.appendChild(${camelCase(item.id)}());`;
  return crearEl('button', {
    type: 'button', class: 'ap-card', 'data-tipo': 'svg-anim',
    title: 'Click para copiar el código',
    onClick: async () => {
      try {
        await navigator.clipboard.writeText(codigo);
        notificar.exito(`Copiado: ${item.id}`);
      } catch (_) { notificar.error('No se pudo copiar'); }
    },
  }, [
    crearEl('div', { class: 'ap-card__lienzo' }, [item.factory()]),
    crearEl('div', { class: 'ap-card__cuerpo' }, [
      crearEl('strong', { class: 'ap-card__nombre' }, [item.nombre]),
      crearEl('code', { class: 'ap-card__id' }, [item.id]),
    ]),
  ]);
};

// ============================================================================
//  Bloque "fuente": toolbar combinado (search + chips de categoría) + grid
// ============================================================================
const bloqueFuente = ({ catalogo, todasItems, hacerCard, mapearItem }) => {
  const filtro    = senal('');
  const categoria = senal('todas');

  const grid = crearEl('div', { class: 'ap-grid' });

  efecto(() => {
    const cat = categoria.value;
    const q   = filtro.value.trim().toLowerCase();

    const fuente = cat === 'todas'
      ? todasItems
      : (catalogo[cat]?.items || []).map((it) => ({ ...it, categoria: cat }));

    const conMap = mapearItem ? fuente.map(mapearItem) : fuente;
    const visibles = q
      ? conMap.filter((it) =>
          it.nombre.toLowerCase().includes(q) ||
          it.id.toLowerCase().includes(q))
      : conMap;

    if (!visibles.length) {
      grid.replaceChildren(crearEl('div', { class: 'ap-grid__vacio' },
        [`Sin coincidencias para "${q}"`]));
    } else {
      grid.replaceChildren(...visibles.map(hacerCard));
    }
  });

  // Chips reactivos
  const chips = crearEl('div', { class: 'ap-chips', role: 'tablist' });
  const refrescarActivo = () => {
    chips.querySelectorAll('.ap-chip').forEach((c) => {
      c.dataset.activo = String(c.dataset.id === categoria.value);
    });
  };
  const chip = (id, label, count) => crearEl('button', {
    type: 'button', class: 'ap-chip', role: 'tab',
    'data-id': id, 'data-activo': String(id === categoria.value),
    onClick: () => { categoria.value = id; refrescarActivo(); },
  }, [
    crearEl('span', null, [label]),
    crearEl('span', { class: 'ap-chip__count' }, [String(count)]),
  ]);

  chips.appendChild(chip('todas', 'Todas', todasItems.length));
  Object.entries(catalogo).forEach(([key, sec]) => {
    chips.appendChild(chip(key, sec.titulo, sec.items.length));
  });

  const buscador = crearEl('input', {
    type: 'search', class: 'ap-buscador',
    placeholder: 'Buscar por nombre o id…',
    onInput: (e) => { filtro.value = e.currentTarget.value; },
  });

  return crearEl('div', { class: 'ap-fuente' }, [
    crearEl('div', { class: 'ap-fuente__toolbar' }, [
      buscador,
      chips,
    ]),
    grid,
  ]);
};

// ============================================================================
//  Página
// ============================================================================
export default async () => {
  const tabsPrincipales = Pestanas({
    variante: 'underline',
    items: [
      {
        id: 'lottie', etiqueta: 'Lottie animados',
        contenido: bloqueFuente({
          catalogo: LOTTIE_CATALOGO,
          todasItems: LOTTIE_TODAS,
          hacerCard: cardLottie,
        }),
        badge: Insignia({ texto: String(LOTTIE_TODAS.length), variante: 'success' }),
      },
      {
        id: 'svg', etiqueta: 'SVG',
        contenido: bloqueFuente({
          catalogo: SVG_ICONOS_PRO,
          todasItems: SVG_TODOS,
          hacerCard: cardSvgEstatico,
          mapearItem: (it) => ({
            ...it,
            src: it.src || (it.archivo ? `./public/img/icons/${it.archivo}` : null),
          }),
        }),
        badge: Insignia({ texto: String(SVG_TODOS.length), variante: 'primary' }),
      },
      {
        id: 'svg-animados', etiqueta: 'SVG animados',
        contenido: bloqueFuente({
          catalogo: ANIMACIONES_PRO,
          todasItems: TODAS_PRO,
          hacerCard: cardSvgAnimado,
        }),
        badge: Insignia({ texto: String(TODAS_PRO.length), variante: 'warning' }),
      },
    ],
  });

  return PaginaShowcase({
    titulo: 'Banco de iconos',
    descripcion: `${LOTTIE_TODAS.length + SVG_TODOS.length + TODAS_PRO.length} iconos en 3 fuentes — Lottie animados, SVG estáticos y SVG animados propios. Todo offline, sin red. Click en cualquier card para copiar el código de uso.`,
    decoracion: corner2(),
    migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
    hijos: [
      Seccion({ hijos: [tabsPrincipales] }),

      Seccion({
        titulo: 'Cómo usar',
        hijos: [crearEl('div', { class: 'ap-howto' }, [
          crearEl('pre', { class: 'ap-codigo' }, [
            crearEl('code', null, [
`// Lottie por id (busca en el catálogo)
import { LottieIcon } from '.../components/ui/lottie/lottie-icon.js';
container.appendChild(LottieIcon('searching-free', { tamano: 80 }));

// SVG estático por id
import { IconoPro } from '.../components/common/svg-icons-pro/svg-icons-pro.js';
boton.appendChild(IconoPro('cloud-upload', { tamano: 24 }));

// SVG animado propio
import { rocketLaunch } from '.../animations-pro.js';
hero.appendChild(rocketLaunch());`,
            ]),
          ]),
        ])],
      }),
    ],
  });
};
