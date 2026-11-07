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

    CREATE TABLE IF NOT EXISTS suppliers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL COLLATE NOCASE UNIQUE,
      contact TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL DEFAULT '',
      phone TEXT NOT NULL DEFAULT '',
      address TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
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

  const supplierCount = db.prepare('SELECT COUNT(*) AS count FROM suppliers').get().count;
  if (supplierCount === 0) {
    const insertSupplier = db.prepare('INSERT INTO suppliers (name, contact, email, phone, address) VALUES (?, ?, ?, ?, ?)');
    const seedSuppliers = [
      ['Casa Norte', 'María González', 'compras@casanorte.example', '+58 412-555-0182', 'Valera, Trujillo'],
      ['Taller Raíces', 'Luis Andrade', 'hola@tallarraices.example', '+58 414-555-0137', 'Mérida, Venezuela'],
      ['Detalles del Valle', 'Ana Peña', 'pedidos@detallesvalle.example', '+58 416-555-0104', 'Caracas, Venezuela']
    ];
    const seed = db.transaction(() => seedSuppliers.forEach((supplier) => insertSupplier.run(...supplier)));
    seed();
  }

  return db;
};

module.exports = { createDatabase };
