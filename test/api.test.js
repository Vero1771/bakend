const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');
const createApp = require('../app');
const { createDatabase } = require('../server/database');

let database;
let server;
let baseUrl;

before(async () => {
  database = createDatabase(':memory:');
  server = createApp({ database }).listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  database.close();
});

const jsonRequest = (url, method = 'GET', body) => fetch(`${baseUrl}${url}`, {
  method,
  headers: body ? { 'Content-Type': 'application/json' } : {},
  body: body ? JSON.stringify(body) : undefined
});

test('dashboard reports the seeded inventory and category totals', async () => {
  const response = await fetch(`${baseUrl}/api/dashboard`);
  const dashboard = await response.json();

  assert.equal(response.status, 200);
  assert.equal(dashboard.stats.productCount, 8);
  assert.equal(dashboard.stats.categoryCount, 4);
  assert.equal(dashboard.stats.unitsInStock, 87);
  assert.equal(dashboard.inventoryByCategory.length, 4);
});

test('product and category endpoints support validated CRUD operations', async () => {
  const categoryResponse = await jsonRequest('/api/categories', 'POST', {
    name: 'Pruebas',
    description: 'Categoría creada por las pruebas.'
  });
  const category = await categoryResponse.json();
  assert.equal(categoryResponse.status, 201);
  assert.equal(category.productCount, 0);

  const productPayload = {
    name: 'Producto de prueba',
    sku: 'TEST-001',
    categoryId: category.id,
    price: 12.5,
    stock: 6,
    description: 'Descripción de prueba.',
    image: ''
  };
  const createResponse = await jsonRequest('/api/products', 'POST', productPayload);
  const product = await createResponse.json();
  assert.equal(createResponse.status, 201);
  assert.equal(product.categoryName, 'Pruebas');

  const duplicateResponse = await jsonRequest('/api/products', 'POST', productPayload);
  assert.equal(duplicateResponse.status, 409);

  const invalidResponse = await jsonRequest('/api/products', 'POST', { ...productPayload, stock: -1 });
  assert.equal(invalidResponse.status, 400);

  const updateResponse = await jsonRequest(`/api/products/${product.id}`, 'PUT', {
    ...productPayload,
    name: 'Producto actualizado',
    stock: 3
  });
  const updatedProduct = await updateResponse.json();
  assert.equal(updateResponse.status, 200);
  assert.equal(updatedProduct.name, 'Producto actualizado');
  assert.equal(updatedProduct.stock, 3);

  const updateCategoryResponse = await jsonRequest(`/api/categories/${category.id}`, 'PUT', {
    name: 'Colección de prueba',
    description: 'Descripción actualizada.'
  });
  assert.equal(updateCategoryResponse.status, 200);
  assert.equal((await updateCategoryResponse.json()).productCount, 1);

  const categoryInUseResponse = await jsonRequest(`/api/categories/${category.id}`, 'DELETE');
  assert.equal(categoryInUseResponse.status, 409);

  const deleteProductResponse = await jsonRequest(`/api/products/${product.id}`, 'DELETE');
  assert.equal(deleteProductResponse.status, 204);

  const deleteCategoryResponse = await jsonRequest(`/api/categories/${category.id}`, 'DELETE');
  assert.equal(deleteCategoryResponse.status, 204);

  const refreshedDashboard = await (await fetch(`${baseUrl}/api/dashboard`)).json();
  assert.equal(refreshedDashboard.stats.productCount, 8);
  assert.equal(refreshedDashboard.stats.categoryCount, 4);
});

test('API returns JSON errors for missing routes and malformed requests', async () => {
  const missing = await fetch(`${baseUrl}/api/not-a-route`);
  assert.equal(missing.status, 404);
  assert.equal((await missing.json()).error, 'Ruta de API no encontrada.');

  const malformed = await fetch(`${baseUrl}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{"name":'
  });
  assert.equal(malformed.status, 400);
  assert.equal(typeof (await malformed.json()).error, 'string');
});
