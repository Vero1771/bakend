LUMA MARKET - CATALOGO INTERACTIVO

INFORMACION A COMPLETAR ANTES DE ENTREGAR
Repositorio de GitHub: [PEGAR AQUI EL ENLACE DEL REPOSITORIO]
Video de YouTube: [PEGAR AQUI EL ENLACE DEL VIDEO]
Integrante: Verónica Juliana Andrade Peña (participación individual)
Universidad: Universidad Valle del Momboy
Materia: Front End II (Programación de sistemas)
Carrera: Ingeniería de computación
Docente: Anggelo Huz

DESCRIPCION
Aplicacion web de una sola pagina (SPA) para explorar un catalogo de productos.
Permite buscar, filtrar por categoria, ordenar por precio o nombre y administrar
un carrito con cantidades y totales actualizados al instante. La compra es una
demostracion y no procesa pagos.

REQUISITOS
- Node.js LTS y npm.
- Un navegador moderno con soporte para modulos ES.

INSTALACION Y EJECUCION
1. Abrir una terminal en la carpeta raiz del proyecto.
2. Instalar las dependencias del servidor: npm install
3. Iniciar la aplicacion: npm start
4. Abrir http://localhost:3000 en el navegador.

No se necesita configurar una base de datos ni una clave de API. Los productos
se cargan desde public/data/productos.json mediante fetch. Los precios de
demostracion estan expresados en dolares estadounidenses (USD).

ESTRUCTURA DEL FRONTEND
- views/index.ejs: estructura HTML de la pagina.
- public/stylesheets/style.css: estilos adaptables a movil y escritorio.
- public/data/productos.json: datos locales del catalogo.
- public/scripts/data.js: carga asincrona de productos.
- public/scripts/ui.js: renderizado del catalogo y del carrito.
- public/scripts/main.js: estado, filtros y eventos de usuario.

CONCEPTOS DE JAVASCRIPT UTILIZADOS
Los modulos usan import/export, const/let, funciones flecha, destructuring,
template literals y spread operator. La aplicacion tambien emplea map, filter,
reduce, find, fetch con async/await, event listeners y delegacion de eventos.

VIDEO
Al publicar el video, agregar las etiquetas #univalledelmomboy y #tareaUVM.
El video debe mostrar los datos de la institucion, materia, carrera, integrante
y docente; demostrar el uso de la aplicacion y explicar sus modulos principales.
