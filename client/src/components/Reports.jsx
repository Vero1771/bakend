import { BarChart3, CircleDollarSign, FileText, PackageCheck } from 'lucide-react';

export default function Reports({ dashboard, products }) {
  const stats = dashboard?.stats || {};
  const reportCards = [
    ['Valor de inventario', `$${Number(stats.inventoryValue || 0).toLocaleString('es-VE')}`, CircleDollarSign],
    ['Unidades disponibles', Number(stats.unitsInStock || 0).toLocaleString('es-VE'), PackageCheck],
    ['Productos para revisar', Number(stats.lowStockCount || 0).toLocaleString('es-VE'), BarChart3]
  ];
  return <div className="page-stack"><section className="entity-intro"><div><span className="panel-eyebrow">DECISIONES CON DATOS</span><h2>Reportes<span className="title-period">.</span></h2><p>Una lectura rápida para planear las próximas compras.</p></div><span className="report-date"><FileText size={16} /> Resumen actualizado</span></section><section className="stats-grid">{reportCards.map(([label, value, Icon]) => <article className="stat-card" key={label}><div className="stat-card-top"><span className="stat-label">{label}</span><span className="stat-icon stat-icon-sage"><Icon size={18} /></span></div><strong className="stat-value">{value}</strong><div className="stat-foot"><span>Desde tu inventario actual</span></div></article>)}</section><section className="panel report-list"><div className="panel-heading"><div><span className="panel-eyebrow">ALERTAS</span><h3>Productos con stock bajo</h3></div></div>{products.filter(({ stock }) => stock <= 5).map((product) => <div className="recent-row" key={product.id}><div className="recent-product-copy"><strong>{product.name}</strong><span>{product.sku} · quedan {product.stock} unidades</span></div><span className="stock-badge stock-badge-low">Revisar</span></div>)}{!products.some(({ stock }) => stock <= 5) && <div className="empty-inline">No hay alertas de inventario.</div>}</section></div>;
}
