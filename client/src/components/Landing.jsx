import { ArrowUpRight, Boxes, ChartNoAxesCombined, Package, Sparkles, Tags, Truck } from 'lucide-react';

export default function Landing({ onStart }) {
  return (
    <div className="landing-page">
      <section className="landing-hero">
        <div className="landing-copy">
          <span className="welcome-kicker"><span className="welcome-dot" /> LUMA MARKET · ACTIVIDAD 3.1</span>
          <h2>Tu catálogo, <em>más simple.</em></h2>
          <p>Administra productos, categorías y proveedores desde un solo espacio, con datos sincronizados y una interfaz reactiva.</p>
          <button type="button" className="primary-button landing-cta" onClick={onStart}>Entrar al panel <ArrowUpRight size={16} /></button>
        </div>
        <div className="landing-visual" aria-hidden="true"><div className="landing-orbit orbit-one" /><div className="landing-orbit orbit-two" /><span><Sparkles size={42} /></span><strong>LM</strong></div>
      </section>
      <section className="landing-features">
        <article className="panel landing-feature"><Package size={22} /><strong>Inventario vivo</strong><span>Consulta existencias y valor por categoría.</span></article>
        <article className="panel landing-feature"><Tags size={22} /><strong>Catálogo ordenado</strong><span>Clasifica tu colección con categorías claras.</span></article>
        <article className="panel landing-feature"><Truck size={22} /><strong>Proveedores</strong><span>Centraliza contactos y condiciones de compra.</span></article>
      </section>
      <section className="landing-sections"><span>SEIS ESPACIOS DE TRABAJO</span><strong>Inicio · Panel · Productos · Categorías · Proveedores · Reportes</strong><ChartNoAxesCombined size={25} /></section>
    </div>
  );
}
