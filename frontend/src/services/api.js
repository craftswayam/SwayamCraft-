const API_BASE = '/api';

export const getAuthToken = () => localStorage.getItem('swayamcraft_token');
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('swayamcraft_token', token);
  } else {
    localStorage.removeItem('swayamcraft_token');
  }
};

export const getStoredUser = () => {
  const user = localStorage.getItem('swayamcraft_user');
  try {
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
};

export const setStoredUser = (user) => {
  if (user) {
    localStorage.setItem('swayamcraft_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('swayamcraft_user');
  }
};

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Handle FormData upload
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.message || (typeof data?.error === 'string' ? data.error : 'Request failed');
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getProfile: () => request('/auth/me'),

  // Catalog
  getProducts: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request(`/products${qs}`);
  },
  getProductById: (id) => request(`/products/${id}`),
  getCategories: () => request('/categories'),

  // Customer Cart
  getCart: () => request('/cart'),
  addToCart: (item) => request('/cart/items', { method: 'POST', body: JSON.stringify(item) }),
  updateCartQuantity: (id, quantity) => request(`/cart/items/${id}?quantity=${quantity}`, { method: 'PUT' }),
  removeFromCart: (id) => request(`/cart/items/${id}`, { method: 'DELETE' }),
  clearCart: () => request('/cart', { method: 'DELETE' }),

  // Orders
  checkout: (orderData) => request('/orders/checkout', { method: 'POST', body: JSON.stringify(orderData) }),
  getCustomerOrders: () => request('/orders'),
  getOrderById: (id) => request(`/orders/${id}`),
  trackOrder: (orderNumber) => request(`/orders/track/${orderNumber}`),

  // Seller / Admin Management
  adminGetProducts: () => request('/admin/products'),
  adminCreateProduct: (productData) => request('/admin/products', { method: 'POST', body: JSON.stringify(productData) }),
  adminUpdateProduct: (id, productData) => request(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(productData) }),
  adminUpdatePrice: (id, priceData) => request(`/admin/products/${id}/price`, { method: 'PATCH', body: JSON.stringify(priceData) }),
  adminUpdateStock: (id, stockData) => request(`/admin/products/${id}/stock`, { method: 'PATCH', body: JSON.stringify(stockData) }),
  adminDeleteProduct: (id) => request(`/admin/products/${id}`, { method: 'DELETE' }),
  adminUploadImage: (formData) => request('/admin/products/upload-image', { method: 'POST', body: formData }),
  adminGetOrders: () => request('/admin/orders'),
  adminUpdateOrderStatus: (id, statusData) => request(`/admin/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify(statusData) }),
  adminGetReports: () => request('/admin/reports/dashboard'),
};
