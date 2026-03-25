import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============== Auth API ==============
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  getMe: () => api.get('/auth/me'),
  
  getUsers: () => api.get('/auth/users'),
  
  createAdmin: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/create-admin', data),
};

// ============== Categories API ==============
export const categoriesAPI = {
  getAll: () => api.get('/categories/'),
  
  getById: (id: number) => api.get(`/categories/${id}`),
  
  create: (data: { name: string; description?: string }) =>
    api.post('/categories/', data),
  
  update: (id: number, data: { name?: string; description?: string }) =>
    api.put(`/categories/${id}`, data),
  
  delete: (id: number) => api.delete(`/categories/${id}`),
};

// ============== Products API ==============
export const productsAPI = {
  getAll: (params?: { category_id?: number; search?: string; skip?: number; limit?: number }) =>
    api.get('/products/', { params }),
  
  getById: (id: number) => api.get(`/products/${id}`),
  
  create: (data: FormData) =>
    api.post('/products/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  update: (id: number, data: FormData) =>
    api.put(`/products/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  delete: (id: number) => api.delete(`/products/${id}`),
};

// ============== Cart API ==============
export const cartAPI = {
  getCart: () => api.get('/cart/'),
  
  addItem: (data: { product_id: number; quantity: number }) =>
    api.post('/cart/', data),
  
  updateItem: (itemId: number, data: { quantity: number }) =>
    api.put(`/cart/${itemId}`, data),
  
  removeItem: (itemId: number) => api.delete(`/cart/${itemId}`),
  
  clearCart: () => api.delete('/cart/'),
};

// ============== Orders API ==============
export const ordersAPI = {
  getMyOrders: () => api.get('/orders/'),
  
  getAllOrders: () => api.get('/orders/admin/orders'),
  
  getById: (id: number) => api.get(`/orders/${id}`),
  
  create: (data: {
    items: { product_id: number; quantity: number }[];
    delivery_address?: string;
    phone_number?: string;
    notes?: string;
  }) => api.post('/orders/', data),
  
  updateStatus: (id: number, data: { status: string }) =>
    api.put(`/orders/${id}/status`, data),
  
  getStats: () => api.get('/orders/admin/stats'),
};

export default api;
