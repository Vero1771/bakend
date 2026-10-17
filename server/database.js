const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const seedProducts = require('../public/data/productos.json');

const categoryDescriptions = {
  Hogar: 'Objetos bonitos para disfrutar en casa.',
  Accesorios: 'Complementos para todos los días.',
  Bienestar: 'Pequeños momentos de cuidado personal.',
  Papelería: 'Ideas y detalles para escribir e inspirarse.'
};

const createDatabase = (databasePath = process.env.DATABASE_PATH || path.join(__dirname, '..', 'data', 'luma-market.sqlite')) => {
  if (databasePath !== ':memory:') {
    fs.mkdirSync(path.dirname(path.resolve(databasePath)), { recursive: true });
  }
  const db = new Database(databasePath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL COLLATE NOCASE UNIQUE,
      description TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      sku TEXT NOT NULL COLLATE NOCASE UNIQUE,
      category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
      price REAL NOT NULL CHECK (price >= 0),
      stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
      description TEXT NOT NULL DEFAULT '',
      image TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const categoryCount = db.prepare('SELECT COUNT(*) AS count FROM categories').get().count;

  if (categoryCount === 0) {
    const insertCategory = db.prepare('INSERT INTO categories (name, description) VALUES (?, ?)');
    const insertProduct = db.prepare(`
      INSERT INTO products (name, sku, category_id, price, stock, description, image)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const categoryIds = new Map();
    const seed = db.transaction(() => {
      const categoryNames = [...new Set(seedProducts.map(({ category }) => category))];

      categoryNames.forEach((name) => {
        const result = insertCategory.run(name, categoryDescriptions[name] || 'Productos de nuestra colección.');
        categoryIds.set(name, Number(result.lastInsertRowid));
      });

      seedProducts.forEach((product, index) => {
        insertProduct.run(
          product.name,
          `LUM-${String(product.id).padStart(3, '0')}`,
          categoryIds.get(product.category),
          product.price,
          [18, 12, 5, 24, 7, 3, 16, 2][index],
          product.description,
          product.image
        );
      });
    });

    seed();
  }

  return db;
};

module.exports = { createDatabase };
