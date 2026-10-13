const currencyFormatter = new Intl.NumberFormat("es-VE", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return entities[character];
  });

const formatPrice = (price) => currencyFormatter.format(price);

export const renderCategories = (products, select) => {
  const categories = [...new Set(products.map(({ category }) => category))].sort();
  select.innerHTML = [
    '<option value="all">Todas las categorías</option>',
    ...categories.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`)
  ].join("");
};

export const renderProducts = (products, grid, resultsCount) => {
  resultsCount.textContent = `${products.length} ${products.length === 1 ? "producto" : "productos"}`;

  if (products.length === 0) {
    grid.innerHTML = `
      <div class="empty-state product-empty">
        <span class="empty-state-icon" aria-hidden="true">⌕</span>
        <h3>No encontramos resultados</h3>
        <p>Prueba con otra búsqueda o cambia los filtros.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = products.map(({ id, name, category, price, description, image, color, badge }) => `
    <article class="product-card">
      <div class="product-image-wrap image-${escapeHtml(color)}">
        <img class="product-image" src="${escapeHtml(image)}" alt="${escapeHtml(name)}" loading="lazy" />
        ${badge ? `<span class="product-badge">${escapeHtml(badge)}</span>` : ""}
        <button class="quick-add" type="button" data-add-to-cart="${Number(id)}" aria-label="Agregar ${escapeHtml(name)} al carrito">
          <span aria-hidden="true">+</span>
        </button>
      </div>
      <div class="product-info">
        <div class="product-title-row"><h3>${escapeHtml(name)}</h3><span class="product-price">${formatPrice(price)}</span></div>
        <p class="product-description">${escapeHtml(description)}</p>
        <span class="product-category">${escapeHtml(category)}</span>
      </div>
    </article>
  `).join("");
};

export const renderCart = (cart, products, elements) => {
  const { items, subtotal, itemCount } = cart.reduce((summary, { productId, quantity }) => {
    const product = products.find(({ id }) => id === productId);

    if (!product) {
      return summary;
    }

    const { name, price, image } = product;
    summary.items.push({ productId, quantity, name, price, image });
    summary.subtotal += price * quantity;
    summary.itemCount += quantity;
    return summary;
  }, { items: [], subtotal: 0, itemCount: 0 });

  elements.cartItems.innerHTML = items.length
    ? items.map(({ productId, quantity, name, price, image }) => `
      <article class="cart-item">
        <img src="${escapeHtml(image)}" alt="" loading="lazy" />
        <div class="cart-item-details">
          <span class="cart-item-category">TU SELECCIÓN</span>
          <h3>${escapeHtml(name)}</h3>
          <span class="cart-item-price">${formatPrice(price)}</span>
        </div>
        <div class="quantity-control" aria-label="Cantidad de ${escapeHtml(name)}">
          <button type="button" data-cart-action="decrease" data-product-id="${Number(productId)}" aria-label="Disminuir cantidad">−</button>
          <span>${quantity}</span>
          <button type="button" data-cart-action="increase" data-product-id="${Number(productId)}" aria-label="Aumentar cantidad">+</button>
        </div>
        <button class="remove-item" type="button" data-cart-action="remove" data-product-id="${Number(productId)}" aria-label="Quitar ${escapeHtml(name)} del carrito">×</button>
      </article>
    `).join("")
    : `
      <div class="empty-state cart-empty">
        <span class="empty-state-icon" aria-hidden="true">♡</span>
        <h3>Tu carrito está esperando</h3>
        <p>Agrega algo bonito de la colección para empezar.</p>
        <a href="#catalogo">Volver a la tienda <span aria-hidden="true">→</span></a>
      </div>
    `;

  elements.cartCount.forEach((count) => {
    count.textContent = itemCount;
    count.classList.toggle("has-items", itemCount > 0);
  });
  elements.cartItemsLabel.textContent = `${itemCount} ${itemCount === 1 ? "producto" : "productos"}`;
  elements.cartSubtotal.textContent = formatPrice(subtotal);
  elements.cartTotal.textContent = formatPrice(subtotal);
  elements.checkout.disabled = itemCount === 0;
};
