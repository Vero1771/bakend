import { loadProducts } from "./data.js";
import { renderCart, renderCategories, renderProducts } from "./ui.js";

const state = {
  products: [],
  cart: [],
  filters: {
    search: "",
    category: "all",
    sort: "featured"
  }
};

const normalizeText = (text) =>
  text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es");

const elements = {
  productGrid: document.querySelector("[data-product-grid]"),
  resultsCount: document.querySelector("[data-results-count]"),
  status: document.querySelector("[data-status]"),
  checkoutStatus: document.querySelector("[data-checkout-status]"),
  searchForm: document.querySelector("[data-search-form]"),
  search: document.querySelector("[data-search]"),
  category: document.querySelector("[data-category]"),
  sort: document.querySelector("[data-sort]"),
  cartItems: document.querySelector("[data-cart-items]"),
  cartItemsLabel: document.querySelector("[data-cart-items-label]"),
  cartSubtotal: document.querySelector("[data-cart-subtotal]"),
  cartTotal: document.querySelector("[data-cart-total]"),
  cartCount: document.querySelectorAll("[data-cart-count]"),
  checkout: document.querySelector("[data-checkout]")
};

const getVisibleProducts = () => {
  const { search, category, sort } = state.filters;
  const searchTerm = normalizeText(search.trim());

  const visibleProducts = state.products.filter(({ name, description, category: productCategory }) => {
    const matchesSearch = normalizeText(`${name} ${description}`).includes(searchTerm);
    const matchesCategory = category === "all" || productCategory === category;
    return matchesSearch && matchesCategory;
  });

  if (sort === "price-asc") {
    return [...visibleProducts].sort((first, second) => first.price - second.price);
  }
  if (sort === "price-desc") {
    return [...visibleProducts].sort((first, second) => second.price - first.price);
  }
  if (sort === "name") {
    return [...visibleProducts].sort((first, second) => first.name.localeCompare(second.name, "es"));
  }

  return visibleProducts;
};

const updateView = () => {
  renderProducts(getVisibleProducts(), elements.productGrid, elements.resultsCount);
  renderCart(state.cart, state.products, elements);
};

const showStatus = (message, isError = false) => {
  elements.status.textContent = message;
  elements.status.hidden = false;
  elements.status.classList.toggle("status-error", isError);
};

const addToCart = (productId) => {
  const product = state.products.find(({ id }) => id === productId);

  if (!product) {
    showStatus("No pudimos agregar ese producto. Inténtalo de nuevo.", true);
    return;
  }

  const existingItem = state.cart.find(({ productId: id }) => id === productId);
  state.cart = existingItem
    ? state.cart.map((item) => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item)
    : [...state.cart, { productId, quantity: 1 }];

  elements.status.hidden = true;
  elements.checkoutStatus.hidden = true;
  updateView();
};

const changeCartQuantity = (productId, action) => {
  const item = state.cart.find(({ productId: id }) => id === productId);

  if (!item) {
    showStatus("Ese producto ya no está en el carrito.", true);
    return;
  }

  if (action === "remove") {
    state.cart = state.cart.filter(({ productId: id }) => id !== productId);
  } else if (action === "decrease" && item.quantity === 1) {
    state.cart = state.cart.filter(({ productId: id }) => id !== productId);
  } else {
    const quantityChange = action === "increase" ? 1 : -1;
    state.cart = state.cart.map((cartItem) => cartItem.productId === productId
      ? { ...cartItem, quantity: cartItem.quantity + quantityChange }
      : cartItem);
  }

  elements.checkoutStatus.hidden = true;
  updateView();
};

elements.searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  state.filters.search = elements.search.value;
  updateView();
});

elements.search.addEventListener("input", () => {
  state.filters.search = elements.search.value;
  updateView();
});

elements.category.addEventListener("change", () => {
  state.filters.category = elements.category.value;
  updateView();
});

elements.sort.addEventListener("change", () => {
  state.filters.sort = elements.sort.value;
  updateView();
});

elements.productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add-to-cart]");

  if (button) {
    addToCart(Number(button.dataset.addToCart));
  }
});

elements.cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-cart-action]");

  if (button) {
    changeCartQuantity(Number(button.dataset.productId), button.dataset.cartAction);
  }
});

document.querySelector("[data-scroll-cart]").addEventListener("click", () => {
  document.querySelector("#carrito").scrollIntoView({ behavior: "smooth" });
});

elements.checkout.addEventListener("click", () => {
  elements.checkoutStatus.textContent = "Esta es una demostración: el pago no se procesa.";
  elements.checkoutStatus.hidden = false;
});

const initialize = async () => {
  try {
    state.products = await loadProducts();
    renderCategories(state.products, elements.category);
    updateView();
  } catch (error) {
    console.error("Error al inicializar el catálogo:", error);
    showStatus("No se pudo cargar la colección. Verifica tu conexión e inténtalo de nuevo.", true);
    elements.resultsCount.textContent = "Colección no disponible";
  }
};

initialize();
