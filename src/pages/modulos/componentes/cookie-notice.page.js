import { crearEl } from '../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { AvisoCookies, AvisoCookiesGDPR } from '../../../components/ui/cookie-notice/cookie-notice.js';
import { corner1 } from '../../../components/ui/card/card-decoraciones.js';

// Marco que simula un viewport para previsualizar banners flotantes/fixed.
const marcoPreview = (etiqueta, hijo, alto = '280px') => crearEl('div', {
  class: 'cookie-marco',
  style: { minHeight: alto },
}, [
  crearEl('div', { class: 'cookie-marco__etiqueta' }, [etiqueta]),
  hijo,
]);

const iconoCookieFalcon = () => crearEl('img', {
  src: './public/img/icons/cookie-1.png',
  alt: 'cookie',
});

export default async () => PaginaShowcase({
  titulo: 'Aviso de cookies',
  descripcion: 'Banner de consentimiento con persistencia en `localStorage`. Soporta posición inline, flotante (esquina), banner superior/inferior y modo GDPR con preferencias granulares por categoría. Pasa `ignorarPersistencia: true` para previsualizarlo siempre.',
  decoracion: corner1(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    // ============== 1. BANNER INLINE SIMPLE ==============
    Seccion({
      titulo: 'Banner inline (simple)',
      descripcion: 'Versión más compacta. Encaja al final de un layout o dentro de una página. Sin posicionamiento fixed.',
      hijos: [VistaCodigo({
        vista: AvisoCookies({ ignorarPersistencia: true }),
        codigo: `AvisoCookies({
  mensaje: 'Usamos cookies para mejorar tu experiencia.',
  textoAceptar: 'Aceptar',
  textoRechazar: 'Rechazar',
  alAceptar:  () => {},
  alRechazar: () => {},
})`,
      })],
    }),

    // ============== 2. CON ICONO + ENLACE ==============
    Seccion({
      titulo: 'Con icono + enlace de política',
      descripcion: 'Versión visual con la galleta de Falcon como icono y enlace a "Política de privacidad". Patrón más amigable para landings y portales B2C.',
      hijos: [VistaCodigo({
        vista: AvisoCookies({
          ignorarPersistencia: true,
          mensaje: 'Usamos cookies de terceros para personalizar contenido, anuncios y analizar el tráfico.',
          icono: iconoCookieFalcon(),
          enlace: { texto: 'Política de privacidad', href: '#' },
          textoAceptar: 'Aceptar todo',
          textoRechazar: 'Sólo necesarias',
        }),
        codigo: `AvisoCookies({
  mensaje: 'Usamos cookies de terceros para personalizar contenido…',
  icono: crearEl('img', { src: '/img/icons/cookie.png', alt: 'cookie' }),
  enlace: { texto: 'Política de privacidad', href: '/legal/privacidad' },
  textoAceptar:  'Aceptar todo',
  textoRechazar: 'Sólo necesarias',
})`,
      })],
    }),

    // ============== 3. GDPR COMPLETO ==============
    Seccion({
      titulo: 'GDPR — Preferencias granulares',
      descripcion: 'Banner GDPR-compliant: el usuario decide qué categorías de cookies acepta. "Necesarias" siempre activas (no se pueden desmarcar). Las preferencias se guardan en `localStorage` como JSON.',
      hijos: [VistaCodigo({
        vista: AvisoCookiesGDPR({
          ignorarPersistencia: true,
          alGuardar: (preferencias) => console.log('Cookies:', preferencias),
        }),
        codigo: `AvisoCookiesGDPR({
  titulo: 'Tu privacidad importa',
  mensaje: 'Usamos cookies para mejorar la experiencia…',
  enlace: { texto: 'Política de privacidad', href: '/legal' },
  categorias: [
    { id: 'necesarias',  titulo: 'Necesarias',  requerido: true,
      descripcion: 'Imprescindibles…' },
    { id: 'funcionales', titulo: 'Funcionales',
      descripcion: 'Recordar preferencias…' },
    { id: 'analytics',   titulo: 'Estadísticas',
      descripcion: 'Métricas anónimas…' },
    { id: 'marketing',   titulo: 'Marketing',
      descripcion: 'Publicidad personalizada…' },
  ],
  alGuardar: (prefs) => {
    // prefs = { necesarias: true, funcionales: false, analytics: true, ... }
  },
})`,
      })],
    }),

    // ============== 4. TOAST FLOTANTE (ESQUINA) ==============
    Seccion({
      titulo: 'Toast flotante (esquina inferior derecha)',
      descripcion: 'Variante discreta — vive en una esquina sin bloquear el contenido. Usada por blogs y dashboards. La preview usa un marco con `position: relative`; en producción el banner es `position: fixed` al body.',
      hijos: [VistaCodigo({
        vista: marcoPreview('Vista previa de página',
          AvisoCookies({
            ignorarPersistencia: true,
            simulado: true,
            posicion: 'flotante-bd',
            icono: iconoCookieFalcon(),
            mensaje: 'Sólo guardamos lo esencial para que el sitio funcione bien.',
            enlace: { texto: 'Saber más', href: '#' },
            textoAceptar: 'Entendido',
            textoRechazar: 'No, gracias',
          }),
        ),
        codigo: `AvisoCookies({
  posicion: 'flotante-bd',           // 'flotante-bi' para esquina izquierda
  icono: crearEl('img', { src: '/img/cookie.png' }),
  mensaje: 'Sólo guardamos lo esencial…',
  enlace: { texto: 'Saber más', href: '/legal' },
  textoAceptar:  'Entendido',
  textoRechazar: 'No, gracias',
})

// posicion: fixed bottom-end; max-width 380px`,
      })],
    }),

    // ============== 5. BANNER SUPERIOR ==============
    Seccion({
      titulo: 'Banner superior (compacto)',
      descripcion: 'Barra fina en la parte superior — patrón usado por sitios de noticias y B2B. Sin border-radius, ocupa todo el ancho. Ideal cuando no quieres tapar el contenido principal.',
      hijos: [VistaCodigo({
        vista: marcoPreview('Vista previa de página',
          AvisoCookies({
            ignorarPersistencia: true,
            simulado: true,
            posicion: 'top',
            variante: 'compacto',
            mensaje: 'Este sitio usa cookies para analítica anónima.',
            enlace: { texto: 'Más información', href: '#' },
            textoAceptar: 'Aceptar',
            textoRechazar: 'Rechazar',
          }),
        ),
        codigo: `AvisoCookies({
  posicion: 'top',                   // banner pegado arriba
  variante: 'compacto',              // padding y tipografía reducidos
  mensaje: 'Este sitio usa cookies para analítica anónima.',
  enlace: { texto: 'Más información', href: '#' },
})`,
      })],
    }),

    // ============== 6. BANNER INFERIOR ==============
    Seccion({
      titulo: 'Banner inferior (full-width)',
      descripcion: 'Barra completa en la parte inferior — patrón clásico tipo Google / Wikipedia. Ocupa todo el ancho de la ventana.',
      hijos: [VistaCodigo({
        vista: marcoPreview('Vista previa de página',
          AvisoCookies({
            ignorarPersistencia: true,
            simulado: true,
            posicion: 'bottom',
            icono: iconoCookieFalcon(),
            mensaje: 'Tu privacidad es importante. Usamos cookies para mejorar la experiencia y entender cómo se usa el sitio.',
            enlace: { texto: 'Política de cookies', href: '#' },
            textoAceptar: 'Aceptar todo',
            textoRechazar: 'Sólo esenciales',
          }),
        ),
        codigo: `AvisoCookies({
  posicion: 'bottom',                // barra inferior full-width
  icono: cookieIcon,
  mensaje: 'Tu privacidad es importante…',
  enlace: { texto: 'Política de cookies', href: '/cookies' },
  textoAceptar:  'Aceptar todo',
  textoRechazar: 'Sólo esenciales',
})`,
      })],
    }),

  ],
});
