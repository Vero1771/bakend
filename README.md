# Luma Market — Actividad 2

Dashboard para consultar y administrar el inventario de la tienda Luma Market.
Es la continuación del catálogo de la actividad 1.1.

**Repositorio:** [github.com/Vero1771/bakend](https://github.com/Vero1771/bakend)

**Actividad 1.1 — video:** [YouTube](https://youtu.be/SyOJ8updclQ?si=mPbfGsknvLC5qCw2)

**Actividad 2 — video:** pendiente de publicar

## Qué permite hacer

- Consultar indicadores del inventario y gráficos por categoría.
- Crear, editar y eliminar productos y categorías.
- Buscar productos en la tabla.
- Controlar precios y existencias; el dashboard destaca los productos con pocas unidades.
- Conservar los cambios en SQLite, incluso después de cerrar el servidor.
- Abrir la tienda de la actividad anterior en `/actividad-1`.

## Herramientas

- React y Vite para la interfaz.
- Tailwind CSS y estilos adaptables para la presentación.
- Express para el backend y la API REST.
- SQLite mediante `better-sqlite3`.
- Node.js 22.12 o posterior.

## Ejecutar en desarrollo

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`. Vite sirve React y envía `/api` a Express en el
puerto 3000.

## Ejecutar la versión de producción localmente

```bash
npm install
npm start
```

El comando `npm start` compila primero la aplicación React y luego inicia
Express. Abre `http://localhost:3000`.

Las pruebas y compilación se pueden ejecutar por separado:

```bash
npm test
npm run build
```

No hay que instalar SQLite por separado ni configurar claves. En el primer
arranque, Express crea `data/luma-market.sqlite` y carga los ocho productos de
ejemplo y sus categorías. La base local y `node_modules` están excluidos de Git.

## Organización del código

- `client/src/App.jsx`: estado de React, carga de datos y acciones CRUD.
- `client/src/components/`: navegación, indicadores, gráficos, tablas y formularios.
- `client/src/api.js`: solicitudes de la interfaz a la API.
- `client/src/styles.css`: Tailwind CSS y estilos del dashboard.
- `server/database.js`: esquema, persistencia y datos iniciales SQLite.
- `server/api.js`: endpoints, validación y operaciones CRUD.
- `test/api.test.js`: pruebas de API y base de datos.
- `public/data/productos.json`: productos iniciales para crear el inventario.
- `app.js`: servidor Express, API y archivos estáticos.

## API principal

| Método | Ruta | Acción |
| --- | --- | --- |
| `GET` | `/api/dashboard` | Indicadores, gráficos y productos recientes |
| `GET`, `POST` | `/api/products` | Listar y crear productos |
| `PUT`, `DELETE` | `/api/products/:id` | Actualizar o eliminar un producto |
| `GET`, `POST` | `/api/categories` | Listar y crear categorías |
| `PUT`, `DELETE` | `/api/categories/:id` | Actualizar o eliminar una categoría |

El servidor impide eliminar una categoría que todavía tenga productos asociados.
La interfaz también desactiva esa opción para evitar errores.

## Datos académicos

- **Universidad:** Universidad Valle del Momboy
- **Carrera:** Ingeniería de computación
- **Materia:** Front End II (Programación de sistemas)
- **Docente:** Anggelo Huz
- **Estudiante:** Verónica Juliana Andrade Peña
- **Participación:** individual

Utilicé herramientas de inteligencia artificial como apoyo durante la
preparación y revisión. Como estudiante, me corresponde comprender, probar y
explicar el proyecto en la sustentación.

## Video de la actividad 2

Al publicar el video, agrega las etiquetas `#univalledelmomboy` y `#tareaUVM`,
y reemplaza el enlace pendiente de arriba y el de `readme.txt`.
