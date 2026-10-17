LUMA MARKET - ACTIVIDAD 2
DASHBOARD PARA ADMINISTRAR PRODUCTOS Y CATEGORÍAS

Repositorio: https://github.com/Vero1771/bakend

VIDEOS DE YOUTUBE
Actividad 1.1: https://youtu.be/SyOJ8updclQ?si=mPbfGsknvLC5qCw2
Actividad 2: [AGREGAR EL ENLACE CUANDO SE PUBLIQUE EL VIDEO]

DATOS ACADÉMICOS
Estudiante: Verónica Juliana Andrade Peña
Universidad: Universidad Valle del Momboy
Carrera: Ingeniería de computación
Materia: Front End II (Programación de sistemas)
Docente: Anggelo Huz
Participación: Individual

SOBRE ESTA VERSIÓN
Esta actividad continúa el proyecto Luma Market. Ahora incluye un dashboard
para consultar el inventario y administrar productos y categorías. Se pueden
crear, editar y eliminar ambas entidades. Los cambios se guardan en una base
de datos SQLite. La tienda de la primera actividad se conserva en
http://localhost:3000/actividad-1.

REQUISITOS
- Node.js 22.12 o posterior y npm.
- Un navegador moderno.

DESARROLLO LOCAL
1. Abre una terminal en la carpeta del proyecto.
2. Instala las dependencias: npm install
3. Inicia el frontend y el backend: npm run dev
4. Abre el dashboard en http://localhost:5173.

Vite sirve React durante el desarrollo y envía las solicitudes /api al servidor
Express, que se inicia en el puerto 3000.

EJECUCIÓN DE PRODUCCIÓN EN LA COMPUTADORA
1. Ejecuta npm install.
2. Ejecuta npm start. Este comando genera la versión de React y después inicia
   Express.
3. Abre http://localhost:3000.

PRUEBAS
Ejecuta npm test para probar la API y las operaciones CRUD. npm run build
comprueba que el dashboard se compile para producción.

BASE DE DATOS
No necesitas instalar SQLite por separado. El backend crea la base de datos en
data/luma-market.sqlite al iniciar y agrega productos y categorías de ejemplo
la primera vez. La carpeta data se queda en la computadora y no se sube a GitHub.
No hacen falta contraseñas ni claves de API.

ARCHIVOS PRINCIPALES
- client/src/App.jsx: estado general y coordinación de las pantallas.
- client/src/components/: sidebar, dashboard, tablas y formularios reutilizables.
- client/src/styles.css: estilos y utilidades de Tailwind CSS.
- server/database.js: tablas, conexión SQLite y datos iniciales.
- server/api.js: API REST para el dashboard, productos y categorías.
- test/api.test.js: pruebas de la API y de las operaciones CRUD.
- public/data/productos.json: datos que se usan para preparar el inventario inicial.
- app.js: configuración de Express y montaje de la API.
- vite.config.mjs: configuración de React, Tailwind y proxy de desarrollo.

PARTICIPACIÓN Y USO DE HERRAMIENTAS
La actividad se presenta de forma individual. Utilicé herramientas de
inteligencia artificial como apoyo durante la preparación y revisión del
proyecto. Como estudiante, debo revisar y probar el código y explicar su
funcionamiento durante la sustentación.

VIDEO DE LA ACTIVIDAD 2
Al publicar el video en YouTube, agrega las etiquetas #univalledelmomboy y
#tareaUVM. Muestra los datos académicos, demuestra el dashboard y explica los
formularios, las tablas, React, la API de Express y la base SQLite. Reemplaza
arriba el texto pendiente por el enlace del video.
