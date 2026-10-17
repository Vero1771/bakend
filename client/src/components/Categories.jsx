import { ArrowUpRight, FolderOpen, Package, Pencil, Plus, Tags, Trash2 } from 'lucide-react';

const palette = ['#70876a', '#c88f69', '#7896a0', '#a49b72', '#a68389'];

export default function Categories({ categories, onCreate, onEdit, onDelete }) {
  return (
    <div className="page-stack">
      <section className="entity-intro">
        <div>
          <span className="panel-eyebrow">ORDENA TU CATÁLOGO</span>
          <h2>Categorías<span className="title-period">.</span></h2>
          <p>Una buena organización hace más fácil encontrar cada cosa.</p>
        </div>
        <button type="button" className="primary-button" onClick={onCreate}><Plus size={17} /> Nueva categoría</button>
      </section>

      <section className="category-summary">
        <div className="category-summary-icon"><Tags size={19} /></div>
        <div><strong>{categories.length} categorías</strong><span>Organizan los productos de tu tienda.</span></div>
        <div className="category-summary-count"><span>{categories.reduce((sum, category) => sum + category.productCount, 0)}</span> productos organizados</div>
      </section>

      {categories.length ? (
        <section className="category-grid grid gap-3" aria-label="Listado de categorías">
          {categories.map((category, index) => (
            <article className="panel category-card" key={category.id}>
              <div className="category-card-top">
                <span className="category-card-icon" style={{ color: palette[index % palette.length], backgroundColor: `${palette[index % palette.length]}17` }}>
                  <FolderOpen size={20} strokeWidth={1.8} />
                </span>
                <div className="row-actions">
                  <button type="button" className="row-action" aria-label={`Editar categoría ${category.name}`} onClick={() => onEdit(category)}><Pencil size={15} /></button>
                  <button
                    type="button"
                    className="row-action row-action-delete"
                    aria-label={`Eliminar categoría ${category.name}`}
                    title={category.productCount ? 'Mueve o elimina sus productos antes de eliminarla' : 'Eliminar categoría'}
                    disabled={category.productCount > 0}
                    onClick={() => onDelete(category)}
                  ><Trash2 size={15} /></button>
                </div>
              </div>
              <span className="category-card-index">COLECCIÓN / {String(index + 1).padStart(2, '0')}</span>
              <h3>{category.name}</h3>
              <p>{category.description || 'Todavía no tiene una descripción.'}</p>
              <div className="category-card-footer">
                <span><Package size={15} /> {category.productCount} {category.productCount === 1 ? 'producto' : 'productos'}</span>
                <span className="category-card-arrow"><ArrowUpRight size={15} /></span>
              </div>
            </article>
          ))}
          <button type="button" className="category-add-card" onClick={onCreate}>
            <span><Plus size={20} /></span><strong>Crear otra categoría</strong><small>Organiza un nuevo grupo de productos</small>
          </button>
        </section>
      ) : (
        <div className="panel category-empty"><FolderOpen size={30} /><h3>Aún no hay categorías</h3><p>Crea tu primera categoría para organizar el catálogo.</p><button type="button" className="primary-button" onClick={onCreate}><Plus size={16} /> Crear categoría</button></div>
      )}

      <div className="inline-notice"><Tags size={16} /> Para mantener organizado el catálogo, una categoría con productos no se puede eliminar.</div>
    </div>
  );
}
