# Luma Market — Actividad 3.1

Aplicación web reactiva para administrar el catálogo y el inventario de Luma
Market. Incluye una landing page, seis secciones, tres entidades con CRUD,
Redux Toolkit, cinco hooks personalizados, backend propio en Express y
persistencia en SQLite.

## Video de demostración

- [Actividad 1.1](https://youtu.be/SyOJ8updclQ?si=mPbfGsknvLC5qCw2)
- [Actividad 2](https://youtu.be/OevVay7fHow)
- [Actividad 3.1](https://youtu.be/mqkcaSkZxto?si=3Pxb7nMT6crQn-pm)

## Tecnologías

- React 19, Vite y Tailwind CSS para la interfaz.
- Redux Toolkit y React Redux para el estado global.
- Cinco hooks propios: `useDebounce`, `useLocalStorage`, `useMediaQuery`,
  `useFetch` y `useForm`.
- Express y `better-sqlite3` para el backend y la API REST.
- Recharts para los gráficos del panel.
- Node.js 22.12 o posterior.

## Secciones y entidades

La aplicación navega sin React Router por estas seis secciones:

- Inicio, con la landing page.
- Panel general.
- Productos.
- Categorías.
- Proveedores.
- Reportes.

Productos, categorías y proveedores incluyen formularios, tablas y operaciones
crear, consultar, actualizar y eliminar. Los cambios se guardan en la base de
datos SQLite local.

## Ejecutar en desarrollo

```bash
npm install
npm run dev
```

Abre `http://localhost:5173` en el navegador. Vite ejecuta React y redirige las
solicitudes `/api` al backend Express en el puerto 3000.

## Ejecutar en producción local

```bash
npm install
npm start
```

Abre `http://localhost:3000`. La base de datos se crea automáticamente en
`data/luma-market.sqlite`; no es necesario instalar SQLite por separado.

## Verificar

```bash
npm test
npm run build
```

El video utiliza las etiquetas `#univalledelmomboy` y `#tareaUVM`.
