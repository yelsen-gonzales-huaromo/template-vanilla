// Página showcase de tablas.
import { crearEl } from '../../utils/helpers/dom.js';
import { senal, efecto } from '../../utils/helpers/reactive.js';
import { TituloPagina } from '../../components/common/page-title/page-title.js';
import { Tarjeta } from '../../components/ui/card/card.js';
import { Boton } from '../../components/ui/button/button.js';
import { Campo } from '../../components/ui/input/input.js';
import { Tabla } from '../../components/ui/table/table.js';
import { Paginacion } from '../../components/ui/pagination/pagination.js';
import { MenuDesplegable } from '../../components/ui/dropdown/dropdown.js';
import { Insignia } from '../../components/ui/badge/badge.js';
import { notificar } from '../../components/ui/toast/toast.js';
import { usuarios, productos } from '../../utils/helpers/demo-data.js';
import { usarPaginacion } from '../../hooks/usePagination.js';

// Tabla básica.
const tarjetaBasica = () => {
  const datos = usuarios(8);
  const tabla = Tabla({
    datos,
    columnas: [
      { clave: 'nombre', titulo: 'Nombre' },
      { clave: 'correo', titulo: 'Correo' },
      { clave: 'ciudad', titulo: 'Ciudad' },
    ],
  });

  return Tarjeta({
    titulo: 'Tabla básica',
    descripcion: 'Lista simple sin interacción adicional.',
    cuerpo: tabla,
  });
};

// Tabla con paginación + búsqueda.
const tarjetaPaginada = () => {
  const datos = usuarios(40);
  const filtro = senal('');
  const filtrados = senal(datos);

  efecto(() => {
    const q = filtro.get().toLowerCase();
    filtrados.set(
      datos.filter(
        (u) =>
          u.nombre.toLowerCase().includes(q) ||
          u.correo.toLowerCase().includes(q) ||
          (u.ciudad || '').toLowerCase().includes(q),
      ),
    );
  });

  const paginacion = usarPaginacion(filtrados, { porPagina: 10 });

  const cabecera = crearEl(
    'div',
    {
      style: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: 'var(--space-3)',
      },
    },
    [
      Campo({
        type: 'search',
        placeholder: 'Buscar usuarios...',
        onInput: (e) => filtro.set(e.target.value),
        style: { maxWidth: '280px' },
      }),
    ],
  );

  const contenedorTabla = crearEl('div');
  efecto(() => {
    contenedorTabla.replaceChildren(
      Tabla({
        datos: paginacion.pagina.get(),
        columnas: [
          { clave: 'nombre', titulo: 'Nombre' },
          { clave: 'correo', titulo: 'Correo' },
          { clave: 'ciudad', titulo: 'Ciudad' },
          { clave: 'rol', titulo: 'Rol' },
        ],
      }),
    );
  });

  const paginador = crearEl('div', { style: { marginTop: 'var(--space-3)' } });
  efecto(() => {
    paginador.replaceChildren(
      Paginacion({
        paginaActual: paginacion.paginaActual.get(),
        totalPaginas: paginacion.totalPaginas.get(),
        alCambiar: (n) => paginacion.irA(n),
      }),
    );
  });

  return Tarjeta({
    titulo: 'Tabla con paginación + búsqueda',
    descripcion: 'Filtra y navega con teclado o ratón.',
    cuerpo: crearEl('div', null, [cabecera, contenedorTabla, paginador]),
  });
};

// Tabla con acciones.
const tarjetaAcciones = () => {
  const datos = productos(8);

  const renderAcciones = (fila) =>
    MenuDesplegable({
      disparador: Boton({ texto: 'Acciones', variante: 'ghost', tamano: 'sm' }),
      items: [
        { etiqueta: 'Ver', onClick: () => notificar.info(`Ver: ${fila.nombre}`) },
        { etiqueta: 'Editar', onClick: () => notificar.info(`Editar: ${fila.nombre}`) },
        {
          etiqueta: 'Eliminar',
          peligro: true,
          onClick: () => notificar.error(`Eliminado: ${fila.nombre}`),
        },
      ],
    });

  const renderEstado = (fila) =>
    Insignia({
      texto: fila.activo ? 'Activo' : 'Inactivo',
      variante: fila.activo ? 'success' : 'muted',
    });

  const tabla = Tabla({
    datos,
    columnas: [
      { clave: 'nombre', titulo: 'Producto' },
      { clave: 'sku', titulo: 'SKU' },
      { clave: 'precio', titulo: 'Precio', render: (f) => `$${f.precio}` },
      { clave: 'estado', titulo: 'Estado', render: renderEstado },
      { clave: 'acciones', titulo: '', render: renderAcciones },
    ],
  });

  return Tarjeta({
    titulo: 'Tabla con acciones',
    descripcion: 'Cada fila incluye un menú contextual.',
    cuerpo: tabla,
  });
};

export default async () => {
  const contenedor = crearEl('div', {
    style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' },
  });

  contenedor.appendChild(
    TituloPagina({
      titulo: 'Tablas',
      descripcion: 'Listados con filtrado, paginación y acciones.',
    }),
  );

  contenedor.appendChild(tarjetaBasica());
  contenedor.appendChild(tarjetaPaginada());
  contenedor.appendChild(tarjetaAcciones());

  return contenedor;
};
