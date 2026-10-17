import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import {
  Bell,
  Check,
  ChevronRight,
  CircleAlert,
  Command,
  LoaderCircle,
  Menu,
  Plus,
  RefreshCw,
  Search,
  X
} from 'lucide-react';
import { api } from './api.js';
import Sidebar from './components/Sidebar.jsx';
import Products from './components/Products.jsx';
import Categories from './components/Categories.jsx';
import EntityModal from './components/EntityModal.jsx';

const pageTitles = { dashboard: 'Panel general', products: 'Productos', categories: 'Categorías' };
const Dashboard = lazy(() => import('./components/Dashboard.jsx'));

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [notice, setNotice] = useState(null);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const loadData = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setLoadError('');
    try {
      const [nextProducts, nextCategories, nextDashboard] = await Promise.all([
        api.products(),
        api.categories(),
        api.dashboard()
      ]);
      setProducts(nextProducts);
      setCategories(nextCategories);
      setDashboard(nextDashboard);
    } catch (error) {
      setLoadError(error.message);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!notice) return undefined;
    const timeout = window.setTimeout(() => setNotice(null), 3600);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const openCreate = (type) => setModal({ type, item: null });
  const openEdit = (type, item) => setModal({ type, item });
  const closeModal = useCallback(() => {
    if (!saving) setModal(null);
  }, [saving]);

  const saveEntity = async (payload) => {
    setSaving(true);
    try {
      const entityName = modal.type === 'product' ? 'Producto' : 'Categoría';
      const action = modal.item ? 'actualizad' : 'cread';
      if (modal.type === 'product') {
        if (modal.item) await api.updateProduct(modal.item.id, payload);
        else await api.createProduct(payload);
      } else if (modal.item) {
        await api.updateCategory(modal.item.id, payload);
      } else {
        await api.createCategory(payload);
      }
      setModal(null);
      setNotice({ type: 'success', message: `${entityName} ${action}${modal.type === 'product' ? 'o' : 'a'} correctamente.` });
      await loadData({ silent: true });
    } finally {
      setSaving(false);
    }
  };

  const deleteEntity = async (type, item) => {
    const entityName = type === 'product' ? 'el producto' : 'la categoría';
    if (!window.confirm(`¿Seguro que deseas eliminar ${entityName} “${item.name}”? Esta acción no se puede deshacer.`)) return;

    try {
      if (type === 'product') await api.deleteProduct(item.id);
      else await api.deleteCategory(item.id);
      setNotice({ type: 'success', message: `Se eliminó ${type === 'product' ? 'el producto' : 'la categoría'} correctamente.` });
      await loadData({ silent: true });
    } catch (error) {
      setNotice({ type: 'error', message: error.message });
    }
  };

  const navigate = (page) => {
    setActivePage(page);
    setSearch('');
  };

  const quickSearch = (event) => {
    setSearch(event.target.value);
    if (activePage !== 'products') setActivePage('products');
  };

  const handleHeaderSearch = (event) => {
    if (event.key === 'Escape') setSearch('');
    if (event.key === 'Enter') event.currentTarget.blur();
  };

  const activeTitle = pageTitles[activePage];

  return (
    <div className="app-shell min-h-screen bg-[#f6f7f4] text-[#292e28]">
      <Sidebar activePage={activePage} onNavigate={navigate} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu" type="button" aria-label="Abrir menú" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
          <div className="breadcrumbs flex items-center gap-2"><span>Espacio de trabajo</span><ChevronRight size={15} /><strong>{activeTitle}</strong></div>
          <div className="topbar-actions">
            <label className="global-search"><Search size={16} /><input value={search} onChange={quickSearch} onKeyDown={handleHeaderSearch} placeholder="Buscar producto..." aria-label="Buscar productos" /><kbd><Command size={11} /> K</kbd></label>
            <button className="icon-button topbar-bell" type="button" aria-label="Estado del panel" title="Panel conectado a la base de datos local"><Bell size={18} /><span /></button>
            <div className="topbar-avatar" title="Verónica Andrade">VA</div>
          </div>
        </header>

        <div className="main-content">
          <div className="page-heading">
            <div><span className="date-label">LUMA MARKET <i /> PANEL DE CONTROL</span><h1>{activeTitle}</h1></div>
            <div className="page-heading-actions">
              <span className="sync-label"><span /> Guardado en la base de datos</span>
              {activePage === 'products' && <button className="primary-button" type="button" onClick={() => openCreate('product')}><Plus size={16} /> Nuevo producto</button>}
              {activePage === 'categories' && <button className="primary-button" type="button" onClick={() => openCreate('category')}><Plus size={16} /> Nueva categoría</button>}
            </div>
          </div>

          {loadError && (
            <div className="load-error" role="alert">
              <CircleAlert size={18} /><div><strong>No se pudo cargar el dashboard</strong><span>{loadError}</span></div>
              <button className="secondary-button" type="button" onClick={() => loadData()}><RefreshCw size={14} /> Reintentar</button>
            </div>
          )}

          {loading ? (
            <div className="loading-state flex min-h-[390px] flex-col items-center justify-center gap-3 text-[#83907b]"><LoaderCircle className="animate-spin" size={26} /><span>Preparando tu espacio...</span></div>
          ) : dashboard && (
            <>
              <Suspense fallback={<div className="loading-state flex min-h-[390px] flex-col items-center justify-center gap-3 text-[#83907b]"><LoaderCircle className="animate-spin" size={26} /><span>Cargando la vista...</span></div>}>
                {activePage === 'dashboard' && <Dashboard data={dashboard} products={products} onNavigate={navigate} />}
                {activePage === 'products' && (
                  <Products
                    products={products}
                    categories={categories}
                    search={search}
                    onSearch={setSearch}
                    onCreate={() => openCreate('product')}
                    onEdit={(item) => openEdit('product', item)}
                    onDelete={(item) => deleteEntity('product', item)}
                  />
                )}
                {activePage === 'categories' && (
                  <Categories
                    categories={categories}
                    onCreate={() => openCreate('category')}
                    onEdit={(item) => openEdit('category', item)}
                    onDelete={(item) => deleteEntity('category', item)}
                  />
                )}
              </Suspense>
            </>
          )}
        </div>

        <footer className="main-footer">
          <span>Hecho con cuidado para Luma Market <span className="footer-heart">♥</span></span>
          <button type="button" onClick={() => loadData({ silent: true })}><RefreshCw size={13} /> Actualizar datos</button>
        </footer>
      </main>

      {modal && <EntityModal type={modal.type} item={modal.item} categories={categories} onClose={closeModal} onSave={saveEntity} saving={saving} />}
      {notice && (
        <div className={`toast toast-${notice.type}`} role="status">
          <span>{notice.type === 'success' ? <Check size={16} /> : <X size={16} />}</span>
          <p>{notice.message}</p>
          <button type="button" aria-label="Cerrar aviso" onClick={() => setNotice(null)}><X size={15} /></button>
        </div>
      )}
    </div>
  );
}
