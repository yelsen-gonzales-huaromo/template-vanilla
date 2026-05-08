import { crearEl } from '../../utils/helpers/dom.js';
import { TituloPagina } from '../../components/common/page-title/page-title.js';
import { Tarjeta } from '../../components/ui/card/card.js';
import { Tabla } from '../../components/ui/table/table.js';
import { Insignia } from '../../components/ui/badge/badge.js';
import { Paginacion } from '../../components/ui/pagination/pagination.js';
import { Boton } from '../../components/ui/button/button.js';
import { Campo } from '../../components/ui/input/input.js';
import { EstadoVacio } from '../../components/ui/empty-state/empty-state.js';
import { Esqueleto } from '../../components/ui/skeleton/skeleton.js';
import { senal, efecto } from '../../utils/helpers/reactive.js';
import { usarAntirebote } from '../../hooks/useDebounce.js';
import { usarPaginacion } from '../../hooks/usePagination.js';
import { formatearFecha } from '../../utils/formatters/date.js';
import { t } from '../../i18n/index.js';

const MOCK = Array.from({ length: 53 }, (_, i) => ({
  id: i + 1,
  nombre: `Informe ${String(i + 1).padStart(3, '0')}`,
  propietario: ['Ana', 'Carlos', 'María', 'Luis'][i % 4],
  estado: ['Listo', 'Pendiente', 'Error'][i % 3],
  actualizado: new Date(Date.now() - i * 3600_000).toISOString(),
}));

export default async () => {
  const busqueda = senal('');
  const aplazada = usarAntirebote(busqueda, 250);
  const cargando = senal(false);
  const paginacion = usarPaginacion({ total: MOCK.length, tamanoPagina: 10 });
  const host = crearEl('div');

  const renderTabla = () => {
    if (cargando.value) {
      host.replaceChildren(crearEl('div', { class: 'flex flex-col gap-2', style: { padding: 'var(--space-6)' } }, [
        Esqueleto({ variante: 'title' }),
        Esqueleto({ variante: 'text' }),
        Esqueleto({ variante: 'text' }),
        Esqueleto({ variante: 'text' }),
      ]));
      return;
    }
    const filtrados = MOCK.filter(r => !aplazada.value || r.nombre.toLowerCase().includes(aplazada.value.toLowerCase()));
    paginacion.cambiarTotal(filtrados.length);
    const trozo = filtrados.slice(paginacion.desplazamiento.value, paginacion.desplazamiento.value + paginacion.tamano.value);

    if (trozo.length === 0) {
      host.replaceChildren(EstadoVacio({ titulo: t('empty.no_results'), descripcion: 'Ajusta tu búsqueda o filtros.' }));
      return;
    }

    host.replaceChildren(Tabla({
      columnas: [
        { clave: 'nombre',       etiqueta: 'Nombre' },
        { clave: 'propietario',  etiqueta: 'Propietario' },
        { clave: 'estado',       etiqueta: 'Estado', render: r => Insignia({
            texto: r.estado,
            variante: r.estado === 'Listo' ? 'success' : r.estado === 'Error' ? 'danger' : 'warning',
          }) },
        { clave: 'actualizado',  etiqueta: 'Actualizado', render: r => formatearFecha(r.actualizado, { dateStyle: 'medium', timeStyle: 'short' }) },
      ],
      filas: trozo,
    }));
  };

  efecto(renderTabla);

  return crearEl('div', null, [
    TituloPagina({
      titulo: t('nav.reports'),
      subtitulo: 'Listado de reportes generados',
      acciones: Boton({ texto: 'Nuevo reporte', icono: '+' }),
    }),
    Tarjeta({
      accionCabecera: crearEl('div', { style: { width: '16rem' } }, [
        Campo({
          type: 'search',
          placeholder: t('actions.search') + '…',
          onInput: (v) => { busqueda.value = v; paginacion.irA(1); },
        }),
      ]),
      titulo: 'Reportes',
      hijos: crearEl('div', null, [
        host,
        crearEl('div', { class: 'flex justify-between items-center', style: { marginTop: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' } }, [
          crearEl('span', { class: 'text-sm text-muted' }, [`${MOCK.length} resultados`]),
          Paginacion({ paginacion }),
        ]),
      ]),
    }),
  ]);
};
