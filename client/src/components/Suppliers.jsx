import { Building2, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useDebounce } from '../hooks.js';
import { useMemo, useState } from 'react';

export default function Suppliers({ suppliers, onCreate, onEdit, onDelete }) {
  const [search, setSearch] = useState('');
  const query = useDebounce(search);
  const visible = useMemo(() => suppliers.filter((supplier) => `${supplier.name} ${supplier.contact} ${supplier.email}`.toLowerCase().includes(query.toLowerCase())), [suppliers, query]);
  return (
    <div className="page-stack">
      <section className="entity-intro"><div><span className="panel-eyebrow">RED DE ABASTECIMIENTO</span><h2>Proveedores<span className="title-period">.</span></h2><p>Conserva tus contactos y condiciones de compra en un solo lugar.</p></div><button type="button" className="primary-button" onClick={onCreate}><Plus size={17} /> Nuevo proveedor</button></section>
      <section className="panel table-panel">
        <div className="table-toolbar"><div><h3>Todos los proveedores</h3><span>{visible.length} de {suppliers.length} registros</span></div><label className="table-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar proveedor..." aria-label="Buscar proveedores" /></label></div>
        <div className="table-scroll overflow-x-auto"><table className="data-table"><thead><tr><th>PROVEEDOR</th><th>CONTACTO</th><th>EMAIL</th><th>TELÉFONO</th><th>ACCIONES</th></tr></thead><tbody>
          {visible.map((supplier) => <tr key={supplier.id}><td><div className="table-product"><div className="product-thumb thumb-1"><Building2 size={19} /></div><div><strong>{supplier.name}</strong><span>{supplier.address || 'Sin dirección registrada'}</span></div></div></td><td>{supplier.contact}</td><td>{supplier.email}</td><td>{supplier.phone}</td><td><div className="row-actions"><button type="button" className="row-action" aria-label={`Editar ${supplier.name}`} onClick={() => onEdit(supplier)}><Pencil size={15} /></button><button type="button" className="row-action row-action-delete" aria-label={`Eliminar ${supplier.name}`} onClick={() => onDelete(supplier)}><Trash2 size={15} /></button></div></td></tr>)}
          {!visible.length && <tr><td colSpan="5"><div className="table-empty"><Search size={22} /><strong>No hay resultados</strong><span>Agrega un proveedor o cambia la búsqueda.</span></div></td></tr>}
        </tbody></table></div>
        <div className="table-footer"><span>Mostrando {visible.length} registros</span><span>Directorio de abastecimiento</span></div>
      </section>
    </div>
  );
}
