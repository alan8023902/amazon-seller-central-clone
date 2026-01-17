import axios from 'axios';

const API_BASE_URL = 'http://localhost:3002/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response.data;
  },
  (error) => {
    console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`, error.response?.data);
    return Promise.reject(error);
  }
);

// Store API
export const storeApi = {
  getStore: async () => {
    const response = await api.get('/store');
    return response.data;
  },
  
  updateStore: async (data: any) => {
    const response = await api.put('/store', data);
    return response.data;
  },
  
  getMarketplaces: async () => {
    const response = await api.get('/store/marketplaces');
    return response.data;
  },
};

// Product API
export const productApi = {
  getProducts: async (params?: any) => {
    const response = await api.get('/products', { params });
    return response;
  },
  
  getProduct: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  
  createProduct: async (data: any) => {
    const response = await api.post('/products', data);
    return response.data;
  },
  
  updateProduct: async (id: string, data: any) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },
  
  deleteProduct: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response;
  },
  
  uploadProductImage: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post(`/products/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  bulkCreateProducts: async (products: any[]) => {
    const response = await api.post('/products/bulk', { products });
    return response.data;
  },
};

// Sales API
export const salesApi = {
  getSalesSnapshot: async (storeId: string) => {
    const response = await api.get(`/sales/snapshot/${storeId}`);
    return response.data;
  },
  
  updateSalesSnapshot: async (storeId: string, data: any) => {
    const response = await api.put(`/sales/snapshot/${storeId}`, data);
    return response.data;
  },
  
  getDailySales: async (storeId: string, params?: any) => {
    const response = await api.get(`/sales/daily/${storeId}`, { params });
    return response.data;
  },
  
  generateDailySales: async (storeId: string, data: any) => {
    const response = await api.post(`/sales/generate-daily/${storeId}`, data);
    return response.data;
  },
  
  getChartData: async (storeId: string, params?: any) => {
    const response = await api.get(`/sales/chart-data/${storeId}`, { params });
    return response.data;
  },
};

// Dashboard API
export const dashboardApi = {
  getSnapshot: async (storeId: string) => {
    const response = await api.get(`/dashboard/snapshot/${storeId}`);
    return response.data;
  },
  
  updateSnapshot: async (storeId: string, data: any) => {
    const response = await api.put(`/dashboard/snapshot/${storeId}`, data);
    return response.data;
  },
  
  getProducts: async (storeId: string, params?: any) => {
    const response = await api.get(`/dashboard/products/${storeId}`, { params });
    return response.data;
  },
  
  getActions: async (storeId: string) => {
    const response = await api.get(`/dashboard/actions/${storeId}`);
    return response.data;
  },
  
  getCommunications: async (storeId: string) => {
    const response = await api.get(`/dashboard/communications/${storeId}`);
    return response.data;
  },
  
  getHealth: async (storeId: string) => {
    const response = await api.get(`/dashboard/health/${storeId}`);
    return response.data;
  },
};

export default api;