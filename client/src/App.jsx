import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { Bell, Check, ChevronRight, CircleAlert, Command, LoaderCircle, Menu, Plus, RefreshCw, Search, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { api } from './api.js';
import { clearNotice, setCatalog, setError, setLoading, setNotice, setPage, setSearch } from './store.js';
import { useFetch, useLocalStorage, useMediaQuery } from './hooks.js';
import Sidebar from './components/Sidebar.jsx';
import Landing from './components/Landing.jsx';
import Products from './components/Products.jsx';
import Categories from './components/Categories.jsx';
import Suppliers from './components/Suppliers.jsx';
import Reports from './components/Reports.jsx';
import EntityModal from './components/EntityModal.jsx';

const pageTitles = { landing: 'Inicio', dashboard: 'Panel general', products: 'Productos', categories: 'Categorías', suppliers: 'Proveedores', reports: 'Reportes' };
const Dashboard = lazy(() => import('./components/Dashboard.jsx'));

export default function App() {
  const dispatch = useDispatch();
  const { activePage, products, categories, suppliers, dashboard, loading, error: loadError, search, notice } = useSelector((state) => state.catalog);
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lastPage, setLastPage] = useLocalStorage('luma-last-page', 'landing');
  const isCompact = useMediaQuery('(max-width: 1023px)');
  const loadRequest = useCallback(async () => {
    const [nextProducts, nextCategories, nextSuppliers, nextDashboard] = await Promise.all([api.products(), api.categories(), api.suppliers(), api.dashboard()]);
    return { products: nextProducts, categories: nextCategories, suppliers: nextSuppliers, dashboard: nextDashboard };
  }, []);
  const { execute: fetchCatalog } = useFetch(loadRequest);

  const loadData = useCallback(async ({ silent = false } = {}) => {
    if (!silent) dispatch(setLoading(true));
    try { dispatch(setCatalog(await fetchCatalog())); }
    catch (loadErrorValue) { dispatch(setError(loadErrorValue.message)); }
  }, [dispatch, fetchCatalog]);

  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => {
    if (activePage !== 'landing') setLastPage(activePage);
    if (notice) {
      const timeout = window.setTimeout(() => dispatch(clearNotice()), 3600);
      return () => window.clearTimeout(timeout);
    }
    return undefined;
  }, [activePage, dispatch, notice, setLastPage]);

  const navigate = (page) => { dispatch(setPage(page)); dispatch(setSearch('')); setSidebarOpen(false); };
  const openCreate = (type) => setModal({ type, item: null });
  const openEdit = (type, item) => setModal({ type, item });
  const closeModal = useCallback(() => { if (!saving) setModal(null); }, [saving]);
  const saveEntity = async (payload) => {
    setSaving(true);
    try {
      const type = modal.type;
      const item = modal.item;
      if (type === 'product') item ? await api.updateProduct(item.id, payload) : await api.createProduct(payload);
      if (type === 'category') item ? await api.updateCategory(item.id, payload) : await api.createCategory(payload);
      if (type === 'supplier') item ? await api.updateSupplier(item.id, payload) : await api.createSupplier(payload);
      setModal(null);
      dispatch(setNotice({ type: 'success', message: `${type === 'product' ? 'Producto' : type === 'category' ? 'Categoría' : 'Proveedor'} guardado correctamente.` }));
      await loadData({ silent: true });
    } finally { setSaving(false); }
  };
  const deleteEntity = async (type, item) => {
    if (!window.confirm(`¿Seguro que deseas eliminar “${item.name}”? Esta acción no se puede deshacer.`)) return;
    try {
      if (type === 'product') await api.deleteProduct(item.id);
      if (type === 'category') await api.deleteCategory(item.id);
      if (type === 'supplier') await api.deleteSupplier(item.id);
      dispatch(setNotice({ type: 'success', message: 'Registro eliminado correctamente.' }));
      await loadData({ silent: true });
    } catch (deleteError) { dispatch(setNotice({ type: 'error', message: deleteError.message })); }
  };
  const quickSearch = (event) => { dispatch(setSearch(event.target.value)); if (activePage !== 'products') navigate('products'); };
  const activeTitle = pageTitles[activePage];
  const compactClass = isCompact ? 'is-compact' : '';
  const landingLastPage = useMemo(() => pageTitles[lastPage] ? lastPage : 'dashboard', [lastPage]);

  return <div className={`app-shell min-h-screen bg-[#f6f7f4] text-[#292e28] ${compactClass}`}>
    <Sidebar activePage={activePage} onNavigate={navigate} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    <main className="main-area">
      <header className="topbar"><button className="icon-button mobile-menu" type="button" aria-label="Abrir menú" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button><div className="breadcrumbs flex items-center gap-2"><span>Espacio de trabajo</span><ChevronRight size={15} /><strong>{activeTitle}</strong></div><div className="topbar-actions"><label className="global-search"><Search size={16} /><input value={search} onChange={quickSearch} placeholder="Buscar producto..." aria-label="Buscar productos" /><kbd><Command size={11} /> K</kbd></label><button className="icon-button topbar-bell" type="button" aria-label="Estado del panel" title="Panel conectado a la base de datos local"><Bell size={18} /><span /></button><div className="topbar-avatar" title="Verónica Andrade">VA</div></div></header>
      <div className="main-content">
        <div className="page-heading"><div><span className="date-label">LUMA MARKET <i /> ACTIVIDAD 3.1</span><h1>{activeTitle}</h1></div><div className="page-heading-actions"><span className="sync-label"><span /> Guardado en la base de datos</span>{activePage === 'products' && <button className="primary-button" type="button" onClick={() => openCreate('product')}><Plus size={16} /> Nuevo producto</button>}{activePage === 'categories' && <button className="primary-button" type="button" onClick={() => openCreate('category')}><Plus size={16} /> Nueva categoría</button>}{activePage === 'suppliers' && <button className="primary-button" type="button" onClick={() => openCreate('supplier')}><Plus size={16} /> Nuevo proveedor</button>}</div></div>
        {loadError && <div className="load-error" role="alert"><CircleAlert size={18} /><div><strong>No se pudo cargar el dashboard</strong><span>{loadError}</span></div><button className="secondary-button" type="button" onClick={() => loadData()}><RefreshCw size={14} /> Reintentar</button></div>}
        {loading ? <div className="loading-state flex min-h-[390px] flex-col items-center justify-center gap-3 text-[#83907b]"><LoaderCircle className="animate-spin" size={26} /><span>Preparando tu espacio...</span></div> : <Suspense fallback={<div className="loading-state">Cargando la vista...</div>}>
          {activePage === 'landing' && <Landing onStart={() => navigate(landingLastPage)} />}
          {activePage === 'dashboard' && <Dashboard data={dashboard} products={products} onNavigate={navigate} />}
          {activePage === 'products' && <Products products={products} categories={categories} search={search} onSearch={(value) => dispatch(setSearch(value))} onCreate={() => openCreate('product')} onEdit={(item) => openEdit('product', item)} onDelete={(item) => deleteEntity('product', item)} />}
          {activePage === 'categories' && <Categories categories={categories} onCreate={() => openCreate('category')} onEdit={(item) => openEdit('category', item)} onDelete={(item) => deleteEntity('category', item)} />}
          {activePage === 'suppliers' && <Suppliers suppliers={suppliers} onCreate={() => openCreate('supplier')} onEdit={(item) => openEdit('supplier', item)} onDelete={(item) => deleteEntity('supplier', item)} />}
          {activePage === 'reports' && <Reports dashboard={dashboard} products={products} />}
        </Suspense>}
      </div>
      <footer className="main-footer"><span>Hecho con cuidado para Luma Market <span className="footer-heart">♥</span></span><button type="button" onClick={() => loadData({ silent: true })}><RefreshCw size={13} /> Actualizar datos</button></footer>
    </main>
    {modal && <EntityModal type={modal.type} item={modal.item} categories={categories} onClose={closeModal} onSave={saveEntity} saving={saving} />}
    {notice && <div className={`toast toast-${notice.type}`} role="status"><span>{notice.type === 'success' ? <Check size={16} /> : <X size={16} />}</span><p>{notice.message}</p><button type="button" aria-label="Cerrar aviso" onClick={() => dispatch(clearNotice())}><X size={15} /></button></div>}
  </div>;
}
