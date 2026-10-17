const request = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers
    }
  });

  if (response.status === 204) return null;

  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || 'No se pudo completar la solicitud.');
  return payload;
};

const sendJson = (method, body) => ({
  method,
  body: JSON.stringify(body)
});

export const api = {
  dashboard: () => request('/api/dashboard'),
  products: () => request('/api/products'),
  categories: () => request('/api/categories'),
  createProduct: (product) => request('/api/products', sendJson('POST', product)),
  updateProduct: (id, product) => request(`/api/products/${id}`, sendJson('PUT', product)),
  deleteProduct: (id) => request(`/api/products/${id}`, { method: 'DELETE' }),
  createCategory: (category) => request('/api/categories', sendJson('POST', category)),
  updateCategory: (id, category) => request(`/api/categories/${id}`, sendJson('PUT', category)),
  deleteCategory: (id) => request(`/api/categories/${id}`, { method: 'DELETE' })
};
