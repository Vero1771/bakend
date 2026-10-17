const express = require('express');

const productSelect = `
  SELECT p.id, p.name, p.sku, p.category_id AS categoryId,
    c.name AS categoryName, p.price, p.stock, p.description, p.image,
    p.created_at AS createdAt, p.updated_at AS updatedAt
  FROM products p
  JOIN categories c ON c.id = p.category_id
`;

const categorySelect = `
  SELECT c.id, c.name, c.description, c.created_at AS createdAt,
    COUNT(p.id) AS productCount
  FROM categories c
  LEFT JOIN products p ON p.category_id = c.id
`;

const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key);

const readProduct = (body) => {
  const { name, sku, categoryId, price, stock, description = '', image = '' } = body;
  const normalized = {
    name: typeof name === 'string' ? name.trim() : '',
    sku: typeof sku === 'string' ? sku.trim().toUpperCase() : '',
    categoryId: Number(categoryId),
    price: Number(price),
    stock: Number(stock),
    description: typeof description === 'string' ? description.trim() : '',
    image: typeof image === 'string' ? image.trim() : ''
  };
  const errors = [];

  if (!normalized.name || normalized.name.length > 100) errors.push('El nombre es obligatorio y no puede superar 100 caracteres.');
  if (!/^[A-Z0-9-]{3,24}$/.test(normalized.sku)) errors.push('El SKU debe tener entre 3 y 24 letras, números o guiones.');
  if (!Number.isInteger(normalized.categoryId) || normalized.categoryId < 1) errors.push('Selecciona una categoría válida.');
  if (!Number.isFinite(normalized.price) || normalized.price < 0) errors.push('El precio debe ser un número igual o mayor a cero.');
  if (!Number.isInteger(normalized.stock) || normalized.stock < 0) errors.push('El inventario debe ser un entero igual o mayor a cero.');
  if (normalized.description.length > 500) errors.push('La descripción no puede superar 500 caracteres.');

  if (normalized.image) {
    try {
      const imageUrl = new URL(normalized.image);
      if (!['http:', 'https:'].includes(imageUrl.protocol)) errors.push('La imagen debe usar una URL HTTP o HTTPS.');
    } catch {
      errors.push('La URL de la imagen no es válida.');
    }
  }

  return { product: normalized, errors };
};

const readCategory = (body) => {
  const category = {
    name: typeof body.name === 'string' ? body.name.trim() : '',
    description: typeof body.description === 'string' ? body.description.trim() : ''
  };
  const errors = [];

  if (!category.name || category.name.length > 60) errors.push('El nombre es obligatorio y no puede superar 60 caracteres.');
  if (category.description.length > 240) errors.push('La descripción no puede superar 240 caracteres.');

  return { category, errors };
};

const handleDatabaseError = (res, error) => {
  if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    return res.status(409).json({ error: 'Ya existe un registro con ese nombre o SKU.' });
  }
  if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY' ||
      (error.code === 'SQLITE_CONSTRAINT_TRIGGER' && error.message.includes('FOREIGN KEY constraint failed'))) {
    return res.status(409).json({ error: 'La categoría tiene productos asignados y no se puede eliminar.' });
  }
  console.error('Error de base de datos:', error);
  return res.status(500).json({ error: 'No se pudo completar la operación en la base de datos.' });
};

const createApiRouter = (db) => {
  const router = express.Router();

  router.get('/dashboard', (req, res) => {
    const summary = db.prepare(`
      SELECT COUNT(*) AS productCount,
        COALESCE(SUM(price * stock), 0) AS inventoryValue,
        COALESCE(SUM(stock), 0) AS unitsInStock,
        COALESCE(SUM(CASE WHEN stock <= 5 THEN 1 ELSE 0 END), 0) AS lowStockCount,
        COALESCE(SUM(CASE WHEN stock = 0 THEN 1 ELSE 0 END), 0) AS outOfStockCount
      FROM products
    `).get();
    const categoryCount = db.prepare('SELECT COUNT(*) AS count FROM categories').get().count;
    const inventoryByCategory = db.prepare(`
      SELECT c.name AS category,
        COUNT(p.id) AS productCount,
        COALESCE(SUM(p.price * p.stock), 0) AS inventoryValue
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id
      GROUP BY c.id, c.name
      ORDER BY inventoryValue DESC
    `).all();
    const recentProducts = db.prepare(`${productSelect} ORDER BY p.updated_at DESC, p.id DESC LIMIT 5`).all();

    res.json({
      stats: { ...summary, categoryCount },
      inventoryByCategory,
      recentProducts
    });
  });

  router.get('/products', (req, res) => {
    const products = db.prepare(`${productSelect} ORDER BY p.created_at DESC, p.id DESC`).all();
    res.json(products);
  });

  router.post('/products', (req, res) => {
    const { product, errors } = readProduct(req.body || {});
    if (errors.length) return res.status(400).json({ error: errors[0], details: errors });

    try {
      const result = db.prepare(`
        INSERT INTO products (name, sku, category_id, price, stock, description, image)
        VALUES (@name, @sku, @categoryId, @price, @stock, @description, @image)
      `).run(product);
      const created = db.prepare(`${productSelect} WHERE p.id = ?`).get(result.lastInsertRowid);
      return res.status(201).json(created);
    } catch (error) {
      return handleDatabaseError(res, error);
    }
  });

  router.put('/products/:id', (req, res) => {
    const id = Number(req.params.id);
    const { product, errors } = readProduct(req.body || {});
    if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: 'Identificador de producto inválido.' });
    if (errors.length) return res.status(400).json({ error: errors[0], details: errors });

    try {
      const result = db.prepare(`
        UPDATE products SET name=@name, sku=@sku, category_id=@categoryId,
          price=@price, stock=@stock, description=@description, image=@image,
          updated_at=CURRENT_TIMESTAMP
        WHERE id=@id
      `).run({ ...product, id });
      if (result.changes === 0) return res.status(404).json({ error: 'No se encontró el producto.' });
      return res.json(db.prepare(`${productSelect} WHERE p.id = ?`).get(id));
    } catch (error) {
      return handleDatabaseError(res, error);
    }
  });

  router.delete('/products/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: 'Identificador de producto inválido.' });
    try {
      const result = db.prepare('DELETE FROM products WHERE id = ?').run(id);
      if (result.changes === 0) return res.status(404).json({ error: 'No se encontró el producto.' });
      return res.status(204).end();
    } catch (error) {
      return handleDatabaseError(res, error);
    }
  });

  router.get('/categories', (req, res) => {
    const categories = db.prepare(`${categorySelect} GROUP BY c.id ORDER BY c.name COLLATE NOCASE`).all();
    res.json(categories);
  });

  router.post('/categories', (req, res) => {
    const { category, errors } = readCategory(req.body || {});
    if (errors.length) return res.status(400).json({ error: errors[0], details: errors });

    try {
      const result = db.prepare('INSERT INTO categories (name, description) VALUES (@name, @description)').run(category);
      return res.status(201).json(db.prepare(`${categorySelect} WHERE c.id = ? GROUP BY c.id`).get(result.lastInsertRowid));
    } catch (error) {
      return handleDatabaseError(res, error);
    }
  });

  router.put('/categories/:id', (req, res) => {
    const id = Number(req.params.id);
    const { category, errors } = readCategory(req.body || {});
    if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: 'Identificador de categoría inválido.' });
    if (errors.length) return res.status(400).json({ error: errors[0], details: errors });

    try {
      const result = db.prepare('UPDATE categories SET name=@name, description=@description WHERE id=@id')
        .run({ ...category, id });
      if (result.changes === 0) return res.status(404).json({ error: 'No se encontró la categoría.' });
      return res.json(db.prepare(`${categorySelect} WHERE c.id = ? GROUP BY c.id`).get(id));
    } catch (error) {
      return handleDatabaseError(res, error);
    }
  });

  router.delete('/categories/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: 'Identificador de categoría inválido.' });
    try {
      const result = db.prepare('DELETE FROM categories WHERE id = ?').run(id);
      if (result.changes === 0) return res.status(404).json({ error: 'No se encontró la categoría.' });
      return res.status(204).end();
    } catch (error) {
      return handleDatabaseError(res, error);
    }
  });

  return router;
};

module.exports = createApiRouter;
