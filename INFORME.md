# Informe de la e-actividad 1.1

> Antes de entregar, reemplaza todos los campos entre corchetes y confirma que los enlaces sean públicos y funcionen.

## Datos académicos

- **Universidad:** Universidad Valle del Momboy
- **Materia:** Front End II (Programación de sistemas)
- **Carrera:** Ingeniería de computación
- **Docente:** Anggelo Huz
- **Integrante:** Verónica Juliana Andrade Peña (trabajo individual)

## Enlaces de entrega

- **Repositorio de GitHub:** [Enlace público del repositorio]
- **Video de demostración en YouTube:** [Enlace del video]

## Descripción del proyecto

Luma Market es una aplicación web de una sola página (SPA) para consultar una
colección de productos y gestionar un carrito de compras. La búsqueda, el filtro
por categoría, el ordenamiento y los cambios en el carrito actualizan la interfaz
sin recargar la página. El botón de compra es únicamente demostrativo: no procesa
pagos.

Los precios incluidos son de ejemplo y están expresados en dólares
estadounidenses (USD).

## Participación del equipo

| Integrante | Participación |
| --- | --- |
| Verónica Juliana Andrade Peña | Responsable de la sustentación individual: comprobación de la aplicación y explicación de la carga de datos, el estado, los filtros y la actualización del carrito. |

## Herramientas y ejecución

Se utiliza Node.js con npm para ejecutar el servidor Express existente. No se
requiere una base de datos, una clave de API ni dependencias adicionales a las
definidas por el proyecto.

1. Instalar Node.js LTS.
2. En una terminal, abrir la carpeta raíz del proyecto.
3. Ejecutar `npm install` para instalar las dependencias.
4. Ejecutar `npm start` para iniciar el servidor.
5. Abrir `http://localhost:3000` en un navegador moderno.

El catálogo se obtiene con `fetch` desde `public/data/productos.json`, servido
por Express como un archivo estático local.

## Organización técnica

- `views/index.ejs` contiene la estructura de la página.
- `public/scripts/data.js` carga y valida los datos de productos de forma asíncrona.
- `public/scripts/ui.js` renderiza las tarjetas, categorías y carrito.
- `public/scripts/main.js` mantiene el estado, aplica filtros y procesa eventos.
- `public/data/productos.json` contiene los productos de ejemplo.
- `public/stylesheets/style.css` define los estilos adaptables a distintos tamaños.

La aplicación demuestra `const` y `let`, funciones flecha, módulos `import` y
`export`, destructuring, spread operator, template literals y los métodos
`map`, `filter`, `reduce` y `find`. La interfaz utiliza `fetch` con
`async/await`, delegación de eventos y actualizaciones dinámicas del DOM.

## Guion sugerido para el video

Presentar los datos académicos; mostrar la carga del catálogo, la búsqueda, el
filtro y el ordenamiento; agregar productos al carrito, cambiar cantidades y
quitar productos; finalmente, explicar los módulos y la participación
individual. Grabar la pantalla con un grabador de pantalla, comprobar el nivel
del audio y añadir `#univalledelmomboy` y `#tareaUVM` como etiquetas.
