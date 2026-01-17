
export type Marketplace = 'United States' | 'Japan' | 'United Kingdom' | 'Germany' | 'Europe';
export type Language = 'en-US' | 'zh-CN';
export type Store = 'Store 1' | 'Store 2' | 'Store 3';

export interface UserSession {
  email: string;
  isLoggedIn: boolean;
  step: 'email' | 'password' | 'otp' | 'done';
  marketplace: Marketplace;
  language: Language;
  store: Store;
}

export interface SalesHistoryPoint {
  time: string;
  today: number;
  lastYear: number;
}

export interface InventoryItem {
  id: string;
  image: string;
  name: string;
  sku: string;
  asin: string;
  status: 'Active' | 'Inactive' | 'Out of Stock';
  price: number;
  units: number;
}

export interface OrderItem {
  id: string;
  date: string;
  status: 'Unshipped' | 'Shipped' | 'Cancelled' | 'Pending';
  buyerName: string;
  total: number;
  quantity: number;
  productName: string;
  asin: string;
}

export interface DashboardState {
  salesToday: number;
  openOrders: number;
  messages: number;
  salesHistory: SalesHistoryPoint[];
  inventory: InventoryItem[];
  orders: OrderItem[];
  salesSnapshot: {
    totalOrderItems: number;
    unitsOrdered: number;
    orderedProductSales: number;
    avgUnitsOrderItem: number;
    avgSalesOrderItem: number;
  };
}
