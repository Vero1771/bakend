import { useMemo } from 'react';
import { ArrowDownWideNarrow, ArrowUpRight, MoreHorizontal, Package, Pencil, Plus, Search, SlidersHorizontal, Trash2 } from 'lucide-react';

const currency = new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

function StockBadge({ stock }) {
  if (stock === 0) return <span className="stock-badge stock-badge-empty"><i /> Sin stock</span>;
  if (stock <= 5) return <span className="stock-badge stock-badge-low"><i /> Bajo · {stock}</span>;
  return <span className="stock-badge stock-badge-ok"><i /> En stock · {stock}</span>;
}

export default function Products({ products, categories, search, onSearch, onCreate, onEdit, onDelete }) {
  const visibleProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('es');
    return products.filter(({ name, sku, categoryName }) =>
      `${name} ${sku} ${categoryName}`.toLocaleLowerCase('es').includes(query)
    );
  }, [products, search]);

  return (
    <div className="page-stack">
      <section className="entity-intro">
        <div>
          <span className="panel-eyebrow">TU COLECCIÓN</span>
          <h2>Productos<span className="title-period">.</span></h2>
          <p>Organiza tus productos y mantén tu inventario al día.</p>
        </div>
        <button type="button" className="primary-button" onClick={onCreate}><Plus size={17} /> Agregar producto</button>
      </section>

      <section className="panel table-panel">
        <div className="table-toolbar">
          <div><h3>Todos los productos</h3><span>{visibleProducts.length} de {products.length} registros</span></div>
          <div className="table-tools">
            <label className="table-search">
              <Search size={16} />
              <input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Buscar producto..." aria-label="Buscar productos" />
            </label>
            <button className="subtle-button" type="button" onClick={() => onSearch('')}><SlidersHorizontal size={15} /> <span>Limpiar</span></button>
          </div>
        </div>

        <div className="table-scroll overflow-x-auto">
          <table className="data-table">
            <thead><tr>
              <th>PRODUCTO</th><th>SKU</th><th>CATEGORÍA</th><th>PRECIO</th>
              <th>INVENTARIO</th><th className="actions-heading">ACCIONES</th>
            </tr></thead>
            <tbody>
              {visibleProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="table-product">
                      <div className={`product-thumb thumb-${product.categoryId % 4}`}>
                        {product.image ? <img src={product.image} alt="" loading="lazy" /> : <Package size={19} />}
                      </div>
                      <div><strong>{product.name}</strong><span>{product.description || 'Sin descripción'}</span></div>
                    </div>
                  </td>
                  <td><span className="sku-text">{product.sku}</span></td>
                  <td><span className="category-pill"><i />{product.categoryName}</span></td>
                  <td><strong className="table-price">{currency.format(product.price)}</strong></td>
                  <td><StockBadge stock={product.stock} /></td>
                  <td>
                    <div className="row-actions">
                      <button type="button" className="row-action" aria-label={`Editar ${product.name}`} onClick={() => onEdit(product)}><Pencil size={15} /></button>
                      <button type="button" className="row-action row-action-delete" aria-label={`Eliminar ${product.name}`} onClick={() => onDelete(product)}><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!visibleProducts.length && <tr><td colSpan="6"><div className="table-empty"><Search size={22} /><strong>No hay resultados</strong><span>Prueba otra búsqueda o agrega un producto nuevo.</span></div></td></tr>}
            </tbody>
          </table>
        </div>
        <div className="table-footer"><span>Mostrando {visibleProducts.length} registros</span><span><ArrowDownWideNarrow size={14} /> Ordenado por más reciente</span></div>
      </section>

      {categories.length === 0 && (
        <div className="inline-notice"><ArrowUpRight size={16} /> Primero crea una categoría para poder agregar productos.</div>
      )}
    </div>
  );
}
