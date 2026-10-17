import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  CircleDollarSign,
  Package,
  Tags
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

const currency = new Intl.NumberFormat('es-VE', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
});

const number = new Intl.NumberFormat('es-VE');
const chartColors = ['#627b60', '#b8c5a9', '#d5a47f', '#a5b8bd', '#dfc89e'];

function StatCard({ label, value, note, icon: Icon, tone, trend, trendUp }) {
  return (
    <article className="stat-card transition-transform duration-200 hover:-translate-y-0.5">
      <div className="stat-card-top">
        <span className="stat-label">{label}</span>
        <span className={`stat-icon stat-icon-${tone}`}><Icon size={18} strokeWidth={1.8} /></span>
      </div>
      <strong className="stat-value">{value}</strong>
      <div className="stat-foot">
        {trend && <span className={`stat-trend ${trendUp ? 'trend-up' : 'trend-down'}`}>
          {trendUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{trend}
        </span>}
        <span>{note}</span>
      </div>
    </article>
  );
}

const shortCurrency = (value) => value >= 1000 ? `$${(value / 1000).toFixed(1)}k` : `$${Math.round(value)}`;

export default function Dashboard({ data, products, onNavigate }) {
  const { stats, inventoryByCategory, recentProducts } = data;
  const lowStockProducts = products.filter(({ stock }) => stock <= 5);

  return (
    <div className="page-stack">
      <section className="welcome-banner">
        <div className="welcome-copy">
          <span className="welcome-kicker"><span className="welcome-dot" /> RESUMEN DE TU TIENDA</span>
          <h2>Un buen día para <em>crecer.</em></h2>
          <p>Tu espacio está en orden. Aquí tienes lo que sucede hoy en Luma Market.</p>
          <button type="button" className="welcome-action" onClick={() => onNavigate('products')}>
            Explorar productos <ArrowUpRight size={15} />
          </button>
        </div>
        <div className="welcome-art" aria-hidden="true">
          <span className="art-circle art-circle-back" />
          <span className="art-circle art-circle-front" />
          <span className="art-plant-stem"><i /><i /><i /></span>
          <span className="art-vase"><i /></span>
          <span className="art-spark art-spark-one">✳</span>
          <span className="art-spark art-spark-two">✦</span>
        </div>
        <span className="welcome-count">L / 01</span>
      </section>

      <section className="stats-grid" aria-label="Indicadores principales">
        <StatCard label="Productos activos" value={number.format(stats.productCount)} note="en tu catálogo" icon={Package} tone="sage" />
        <StatCard label="Categorías" value={number.format(stats.categoryCount)} note="grupos organizados" icon={Tags} tone="peach" />
        <StatCard label="Valor del inventario" value={currency.format(stats.inventoryValue)} note={`${number.format(stats.unitsInStock)} unidades disponibles`} icon={CircleDollarSign} tone="blue" />
        <StatCard label="Stock por revisar" value={number.format(stats.lowStockCount)} note={`${number.format(stats.outOfStockCount)} sin existencias`} icon={AlertTriangle} tone="yellow" />
      </section>

      <section className="charts-grid">
        <article className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-eyebrow">VISTA GENERAL</span>
              <h3>Valor por categoría</h3>
            </div>
            <span className="panel-caption"><span className="caption-dot" /> Valor en inventario</span>
          </div>
          {inventoryByCategory.length ? (
            <div className="bar-chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inventoryByCategory} margin={{ top: 10, right: 8, left: -18, bottom: 0 }} barSize={31}>
                  <CartesianGrid vertical={false} stroke="#eeefe9" />
                  <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fill: '#858a80', fontSize: 11 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a0a49b', fontSize: 10 }} tickFormatter={shortCurrency} />
                  <Tooltip
                    cursor={{ fill: '#f5f6f1' }}
                    formatter={(value) => [currency.format(value), 'Inventario']}
                    contentStyle={{ border: '1px solid #e9eae3', borderRadius: 10, fontSize: 12, boxShadow: '0 8px 24px #28351c14' }}
                  />
                  <Bar dataKey="inventoryValue" fill="#71856a" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : <div className="chart-empty">Agrega categorías para ver el resumen.</div>}
          <div className="chart-footer"><span><Boxes size={14} /> Datos actualizados desde tu inventario</span><span>USD</span></div>
        </article>

        <article className="panel category-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-eyebrow">TU CATÁLOGO</span>
              <h3>Productos por categoría</h3>
            </div>
          </div>
          {inventoryByCategory.length ? (
            <>
              <div className="donut-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={inventoryByCategory} dataKey="productCount" nameKey="category" innerRadius={55} outerRadius={78} paddingAngle={4} stroke="none">
                      {inventoryByCategory.map((entry, index) => <Cell key={entry.category} fill={chartColors[index % chartColors.length]} />)}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} productos`, 'Categoría']} contentStyle={{ border: '1px solid #e9eae3', borderRadius: 10, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="donut-center"><strong>{stats.productCount}</strong><span>productos</span></div>
              </div>
              <div className="category-legend">
                {inventoryByCategory.map((item, index) => (
                  <div className="legend-row" key={item.category}>
                    <span className="legend-swatch" style={{ backgroundColor: chartColors[index % chartColors.length] }} />
                    <span className="legend-name">{item.category}</span>
                    <strong>{item.productCount}</strong>
                  </div>
                ))}
              </div>
            </>
          ) : <div className="chart-empty">Agrega categorías para ver el resumen.</div>}
        </article>
      </section>

      <section className="bottom-grid">
        <article className="panel recent-panel">
          <div className="panel-heading">
            <div><span className="panel-eyebrow">AL DÍA</span><h3>Actualizados recientemente</h3></div>
            <button className="text-action" type="button" onClick={() => onNavigate('products')}>Ver catálogo <ArrowUpRight size={14} /></button>
          </div>
          <div className="recent-list">
            {recentProducts.length ? recentProducts.slice(0, 4).map((product) => (
              <div className="recent-row" key={product.id}>
                <div className={`product-thumb thumb-${product.categoryId % 4}`}>
                  {product.image ? <img src={product.image} alt="" loading="lazy" /> : <Package size={18} />}
                </div>
                <div className="recent-product-copy"><strong>{product.name}</strong><span>{product.sku} · {product.categoryName}</span></div>
                <strong className="recent-price">{currency.format(product.price)}</strong>
              </div>
            )) : <div className="empty-inline">Todavía no hay productos en el catálogo.</div>}
          </div>
        </article>

        <article className="panel stock-panel">
          <div className="panel-heading">
            <div><span className="panel-eyebrow">ATENCIÓN</span><h3>Inventario bajo</h3></div>
            <span className="stock-count">{lowStockProducts.length}</span>
          </div>
          {lowStockProducts.length ? (
            <div className="stock-list">
              {lowStockProducts.slice(0, 4).map((product) => (
                <div className="stock-row" key={product.id}>
                  <span className={`stock-indicator ${product.stock === 0 ? 'stock-empty' : ''}`} />
                  <div><strong>{product.name}</strong><span>{product.sku}</span></div>
                  <span className={`stock-quantity ${product.stock === 0 ? 'stock-zero' : ''}`}>
                    {product.stock === 0 ? 'Agotado' : `${product.stock} uds.`}
                  </span>
                </div>
              ))}
            </div>
          ) : <div className="stock-empty-state"><span>✓</span><p>Todo bien por aquí.</p><small>No hay productos con stock bajo.</small></div>}
          <button className="stock-link" type="button" onClick={() => onNavigate('products')}>Revisar inventario <ArrowUpRight size={14} /></button>
        </article>
      </section>
    </div>
  );
}
