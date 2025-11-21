// API Base URL - Update this to your backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// Helper function to handle API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  // Add auth token if available
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()
    
    if (!response.ok) {
      // Extract error message from backend response if available
      const errorMessage = data.message || data.error || `API Error: ${response.status} ${response.statusText}`
      const error = new Error(errorMessage)
      error.status = response.status
      throw error
    }
    
    return data
  } catch (error) {
    console.error('API Request Error:', error)
    // If it's already an Error object with a message, re-throw it
    if (error instanceof Error) {
      throw error
    }
    // Otherwise, wrap it in an Error
    throw new Error(error.message || 'An unexpected error occurred')
  }
}

// Products API
export const productsAPI = {
  // Get all products
  getAll: () => apiRequest('/products'),
  
  // Get product by ID
  getById: (id) => apiRequest(`/products/${id}`),
  
  // Get products by category
  getByCategory: (category) => apiRequest(`/products?category=${category}`),
  
  // Get featured products
  getFeatured: () => apiRequest('/products/featured'),
  
  // Create product (admin)
  create: (productData) => apiRequest('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  }),
  
  // Update product (admin)
  update: (id, productData) => apiRequest(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  }),
  
  // Delete product (admin)
  delete: (id) => apiRequest(`/products/${id}`, {
    method: 'DELETE',
  }),
}

// Addresses API
export const addressesAPI = {
  // Get all saved addresses for user
  getAll: () => apiRequest('/addresses'),
  
  // Get address by ID
  getById: (id) => apiRequest(`/addresses/${id}`),
  
  // Create new address
  create: (addressData) => apiRequest('/addresses', {
    method: 'POST',
    body: JSON.stringify(addressData),
  }),
  
  // Update address
  update: (id, addressData) => apiRequest(`/addresses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(addressData),
  }),
  
  // Delete address
  delete: (id) => apiRequest(`/addresses/${id}`, {
    method: 'DELETE',
  }),
  
  // Set default address
  setDefault: (id) => apiRequest(`/addresses/${id}/default`, {
    method: 'PUT',
  }),
}

// Cart API
export const cartAPI = {
  // Get user's cart
  get: () => apiRequest('/cart'),
  
  // Add item to cart
  addItem: (itemData) => apiRequest('/cart/items', {
    method: 'POST',
    body: JSON.stringify(itemData),
  }),
  
  // Update cart item
  updateItem: (itemId, quantity) => apiRequest(`/cart/items/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  }),
  
  // Remove item from cart
  removeItem: (itemId) => apiRequest(`/cart/items/${itemId}`, {
    method: 'DELETE',
  }),
  
  // Clear cart
  clear: () => apiRequest('/cart', {
    method: 'DELETE',
  }),
}

// Orders API
export const ordersAPI = {
  // Get all orders
  getAll: () => apiRequest('/orders'),
  
  // Get order by ID
  getById: (id) => apiRequest(`/orders/${id}`),
  
  // Create order
  create: (orderData) => apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
}

// Auth API
export const authAPI = {
  // Login
  login: (email, password) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  
  // Signup
  signup: (userData) => apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  // Logout
  logout: () => apiRequest('/auth/logout', {
    method: 'POST',
  }),
  
  // Get current user
  getCurrentUser: () => apiRequest('/auth/me'),
}

export default {
  products: productsAPI,
  addresses: addressesAPI,
  cart: cartAPI,
  orders: ordersAPI,
  auth: authAPI,
}

