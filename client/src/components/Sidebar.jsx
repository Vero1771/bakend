import {
  ArrowUpRight,
  ChartNoAxesCombined,
  LayoutDashboard,
  Package,
  PanelLeftClose,
  Tags,
  X
} from 'lucide-react';

const navigation = [
  { id: 'dashboard', label: 'Panel general', icon: LayoutDashboard },
  { id: 'products', label: 'Productos', icon: Package },
  { id: 'categories', label: 'Categorías', icon: Tags }
];

export default function Sidebar({ activePage, onNavigate, open, onClose }) {
  return (
    <>
      {open && <button className="sidebar-scrim lg:hidden" type="button" aria-label="Cerrar menú" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand">
          <a className="brand-lockup inline-flex items-center gap-2.5" href="/" onClick={(event) => { event.preventDefault(); onNavigate('dashboard'); }}>
            <span className="brand-mark">l</span>
            <span className="brand-word">luma<span>market</span></span>
          </a>
          <button className="icon-button sidebar-close lg:hidden" type="button" aria-label="Cerrar menú" onClick={onClose}>
            <X size={18} />
          </button>
          <span className="sidebar-workspace">ADMINISTRACIÓN</span>
        </div>

        <div className="sidebar-nav-label">ESPACIO DE TRABAJO</div>
        <nav className="sidebar-nav" aria-label="Navegación del dashboard">
          {navigation.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className={`nav-item flex items-center gap-3 rounded-md px-3 text-left transition-colors hover:bg-[#f6f7f3] ${activePage === id ? 'nav-item-active' : ''}`}
              aria-current={activePage === id ? 'page' : undefined}
              onClick={() => { onNavigate(id); onClose(); }}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
              {id === 'products' && <span className="nav-dot" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-spacer" />
        <div className="sidebar-help">
          <div className="help-icon"><ChartNoAxesCombined size={17} /></div>
          <p>Todo en orden</p>
          <span>Tu inventario, bajo control.</span>
          <span className="help-decoration" aria-hidden="true"><ArrowUpRight size={42} /></span>
        </div>

        <a className="store-link" href="/actividad-1" target="_blank" rel="noreferrer">
          <span>Ver tienda anterior</span>
          <ArrowUpRight size={15} />
        </a>

        <div className="sidebar-profile">
          <div className="profile-avatar">VA</div>
          <div className="profile-copy">
            <strong>Verónica Andrade</strong>
            <span>Administradora</span>
          </div>
          <PanelLeftClose className="profile-menu-icon" size={17} />
        </div>
      </aside>
    </>
  );
}
