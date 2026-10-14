LUMA MARKET - CATÁLOGO INTERACTIVO

Repositorio: https://github.com/Vero1771/bakend
Video de la demostración: [AGREGAR EL ENLACE DE YOUTUBE AL PUBLICARLO]

DATOS ACADÉMICOS
Estudiante: Verónica Juliana Andrade Peña
Universidad: Universidad Valle del Momboy
Carrera: Ingeniería de computación
Materia: Front End II (Programación de sistemas)
Docente: Anggelo Huz
Participacion: Individual

SOBRE EL PROYECTO
Luma Market es un catálogo web donde se pueden buscar productos, filtrarlos
por categoría y ordenar la lista. También permite agregarlos a un carrito,
cambiar las cantidades y ver el total sin recargar la página.

Los productos y sus precios son ejemplos para la actividad. El botón de compra
es demostrativo; la aplicación no procesa pagos. Los precios están expresados
en dólares estadounidenses (USD).

CÓMO EJECUTARLO
Necesitas instalar Node.js LTS. Después:

1. Abre una terminal en la carpeta del proyecto.
2. Ejecuta: npm install
3. Inicia el servidor: npm start
4. Abre http://localhost:3000 en el navegador.

Los productos se cargan desde public/data/productos.json. No hace falta crear
una base de datos ni configurar una clave de API.

ARCHIVOS PRINCIPALES
- views/index.ejs: contenido de la pagina.
- public/stylesheets/style.css: estilos para escritorio y movil.
- public/data/productos.json: productos de ejemplo.
- public/scripts/data.js: carga los datos con fetch y async/await.
- public/scripts/ui.js: muestra las tarjetas y el carrito.
- public/scripts/main.js: maneja el estado, los filtros y los eventos.

En el código se usan módulos de JavaScript, funciones flecha, const y let,
destructuring, spread operator, template literals y los métodos map, filter,
reduce y find. Los cambios del catálogo y del carrito se reflejan en la página
sin volver a cargarla.

PARTICIPACIÓN Y USO DE HERRAMIENTAS
La actividad se presenta de forma individual. Utilicé herramientas de
inteligencia artificial como apoyo durante la preparación y revisión del
proyecto. Como estudiante, me corresponde revisar el código, probar la
aplicación y explicar su funcionamiento en la sustentación.

VIDEO
Al subir la demostración a YouTube, agrega las etiquetas
#univalledelmomboy y #tareaUVM y reemplaza arriba el texto pendiente por el
enlace del video. En la grabación, presenta los datos académicos, muestra las
funciones principales y explica los módulos del proyecto.
