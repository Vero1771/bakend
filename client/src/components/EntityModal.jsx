import { useEffect, useState } from 'react';
import { ImagePlus, LoaderCircle, Package, Tags, X } from 'lucide-react';

const blankProduct = {
  name: '',
  sku: '',
  categoryId: '',
  price: '',
  stock: '',
  description: '',
  image: ''
};

const blankCategory = { name: '', description: '' };

export default function EntityModal({ type, item, categories, onClose, onSave, saving }) {
  const isProduct = type === 'product';
  const [form, setForm] = useState(isProduct ? blankProduct : blankCategory);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(item
      ? isProduct
        ? {
            name: item.name,
            sku: item.sku,
            categoryId: String(item.categoryId),
            price: String(item.price),
            stock: String(item.stock),
            description: item.description || '',
            image: item.image || ''
          }
        : { name: item.name, description: item.description || '' }
      : isProduct
        ? { ...blankProduct, categoryId: categories[0] ? String(categories[0].id) : '' }
        : blankCategory);
    setError('');
  }, [item, isProduct, categories]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !saving) onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, saving]);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const payload = isProduct
      ? { ...form, categoryId: Number(form.categoryId), price: Number(form.price), stock: Number(form.stock) }
      : form;

    try {
      await onSave(payload);
    } catch (saveError) {
      setError(saveError.message);
    }
  };

  const TitleIcon = isProduct ? Package : Tags;

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) onClose(); }}>
      <section className="entity-modal" role="dialog" aria-modal="true" aria-labelledby="entity-modal-title">
        <div className="modal-heading">
          <div className={`modal-heading-icon ${isProduct ? 'modal-icon-product' : 'modal-icon-category'}`}><TitleIcon size={20} /></div>
          <div><span className="panel-eyebrow">{item ? 'EDITAR REGISTRO' : 'NUEVO REGISTRO'}</span><h2 id="entity-modal-title">{item ? 'Actualizar' : 'Agregar'} {isProduct ? 'producto' : 'categoría'}</h2></div>
          <button className="icon-button modal-close" type="button" aria-label="Cerrar formulario" onClick={onClose} disabled={saving}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          {isProduct ? (
            <>
              <div className="form-grid">
                <label className="form-field form-field-wide"><span>Nombre del producto <b>*</b></span><input autoFocus required maxLength="100" name="name" value={form.name} onChange={updateField} placeholder="Ej. Jarrón Bruma" /></label>
                <label className="form-field"><span>SKU / Código <b>*</b></span><input required maxLength="24" name="sku" value={form.sku} onChange={updateField} placeholder="LUM-009" /></label>
                <label className="form-field"><span>Categoría <b>*</b></span><select required name="categoryId" value={form.categoryId} onChange={updateField}><option value="" disabled>Selecciona una</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
                <label className="form-field"><span>Precio (USD) <b>*</b></span><div className="input-prefix"><span>$</span><input required min="0" step="0.01" type="number" name="price" value={form.price} onChange={updateField} placeholder="0.00" /></div></label>
                <label className="form-field"><span>Unidades disponibles <b>*</b></span><input required min="0" step="1" type="number" name="stock" value={form.stock} onChange={updateField} placeholder="0" /></label>
                <label className="form-field form-field-wide"><span>Descripción</span><textarea maxLength="500" rows="3" name="description" value={form.description} onChange={updateField} placeholder="Describe brevemente este producto..." /></label>
                <label className="form-field form-field-wide"><span>Imagen (URL)</span><div className="input-prefix input-image"><ImagePlus size={16} /><input type="url" name="image" value={form.image} onChange={updateField} placeholder="https://..." /></div></label>
              </div>
            </>
          ) : (
            <div className="form-grid">
              <label className="form-field form-field-wide"><span>Nombre de la categoría <b>*</b></span><input autoFocus required maxLength="60" name="name" value={form.name} onChange={updateField} placeholder="Ej. Decoración" /></label>
              <label className="form-field form-field-wide"><span>Descripción</span><textarea maxLength="240" rows="4" name="description" value={form.description} onChange={updateField} placeholder="¿Qué productos pertenecen a esta categoría?" /></label>
              <p className="form-hint form-field-wide">Las categorías con productos asignados no se pueden eliminar hasta mover o quitar esos productos.</p>
            </div>
          )}

          {error && <div className="form-error" role="alert">{error}</div>}

          <div className="modal-footer">
            <button className="secondary-button" type="button" onClick={onClose} disabled={saving}>Cancelar</button>
            <button className="primary-button" type="submit" disabled={saving || (isProduct && categories.length === 0)}>
              {saving ? <LoaderCircle className="animate-spin" size={16} /> : <TitleIcon size={16} />}
              {saving ? 'Guardando...' : item ? 'Guardar cambios' : `Crear ${isProduct ? 'producto' : 'categoría'}`}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
