// Store-specific API service
const API_BASE_URL = 'http://localhost:3002/api';

export interface StoreData {
  id: string;
  name: string;
  marketplace: string;
  currency_symbol: string;
}

export interface DashboardData {
  salesToday: number;
  openOrders: number;
  messages: number;
  salesHistory: Array<{
    time: string;
    today: number;
    lastYear: number;
  }>;
  inventory: Array<{
    id: string;
    name: string;
    sku: string;
    asin: string;
    status: string;
    price: number;
    units: number;
    image: string;
  }>;
  orders: any[];
  salesSnapshot: {
    totalOrderItems: number;
    unitsOrdered: number;
    orderedProductSales: number;
    avgUnitsOrderItem: number;
    avgSalesOrderItem: number;
  };
}

export interface Product {
  id: string;
  store_id: string;
  title: string;
  sku: string;
  asin: string;
  price: number;
  inventory: number;
  status: 'Active' | 'Inactive';
  sales_amount: number;
  units_sold: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface SalesSnapshot {
  store_id: string;
  total_order_items: number;
  units_ordered: number;
  ordered_product_sales: number;
  avg_units_per_order: number;
  avg_sales_per_order: number;
}

export interface DailySales {
  store_id: string;
  date: string;
  sales_amount: number;
  units_sold: number;
  orders_count: number;
}

class StoreApiService {
  // Get all stores
  async getStores(): Promise<StoreData[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/stores`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Failed to fetch stores:', error);
      throw error;
    }
  }

  // Get store by ID
  async getStore(storeId: string): Promise<StoreData | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/stores/${storeId}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Failed to fetch store:', error);
      throw error;
    }
  }

  // Get dashboard data for a specific store
  async getDashboardData(storeId: string): Promise<DashboardData> {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/${storeId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      throw error;
    }
  }

  // Get products for a specific store
  async getProducts(storeId: string, filters?: { status?: string; search?: string }): Promise<Product[]> {
    try {
      const params = new URLSearchParams({ store_id: storeId });
      if (filters?.status && filters.status !== 'All') {
        params.append('status', filters.status);
      }
      if (filters?.search) {
        params.append('search', filters.search);
      }

      const response = await fetch(`${API_BASE_URL}/products?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw error;
    }
  }

  // Get sales snapshot for a specific store
  async getSalesSnapshot(storeId: string): Promise<SalesSnapshot | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/sales/snapshot/${storeId}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Failed to fetch sales snapshot:', error);
      throw error;
    }
  }

  // Get daily sales data for a specific store
  async getDailySales(storeId: string): Promise<DailySales[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/sales/daily/${storeId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Failed to fetch daily sales:', error);
      throw error;
    }
  }

  // Find store by name
  async findStoreByName(storeName: string): Promise<StoreData | null> {
    try {
      const stores = await this.getStores();
      return stores.find(store => store.name === storeName) || null;
    } catch (error) {
      console.error('Failed to find store by name:', error);
      return null;
    }
  }
}

export const storeApi = new StoreApiService();