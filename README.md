# Luma Market Dashboard

Aplicación web para consultar y administrar el inventario de Luma Market.
Permite gestionar productos y categorías, y guarda los cambios en una base de
datos SQLite local.

## Tecnologías

- React y Tailwind CSS para la interfaz.
- Express para el backend y la API.
- SQLite para guardar los datos.
- Node.js 22.12 o posterior.

## Ejecutar

```bash
npm install
npm run dev
```

Abre `http://localhost:5173` en el navegador. Para iniciar la versión de
producción local, ejecuta `npm start` y abre `http://localhost:3000`.

Las pruebas se ejecutan con `npm test`. La base de datos se crea
automáticamente en `data/luma-market.sqlite` y permanece en la computadora.
