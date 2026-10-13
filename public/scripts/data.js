export const loadProducts = async () => {
  const response = await fetch("/data/productos.json");

  if (!response.ok) {
    throw new Error(`No fue posible cargar los productos (${response.status}).`);
  }

  const products = await response.json();

  if (!Array.isArray(products)) {
    throw new Error("El archivo de productos tiene un formato inválido.");
  }

  return products;
};
