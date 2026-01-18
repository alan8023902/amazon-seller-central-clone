
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserSession, DashboardState, Marketplace, Language, Store } from './types';
import { salesDashboardData } from './mock/salesDashboard';

interface AppStore {
  session: UserSession;
  dashboard: DashboardState;
  setSession: (session: Partial<UserSession>) => void;
  setMarketplace: (m: Marketplace) => void;
  setLanguage: (l: Language) => void;
  setStore: (s: Store) => void;
  logout: () => void;
  importData: (data: Partial<DashboardState>) => void;
  updateDashboardByMarketplace: (m: Marketplace) => void;
}

const initialDashboard: DashboardState = {
  salesToday: 569.72,
  openOrders: 49,
  messages: 0,
  salesHistory: [
    { time: 'Dec 28', today: 1200000, lastYear: 1000000 },
    { time: 'Dec 29', today: 1800000, lastYear: 1500000 },
    { time: 'Dec 30', today: 1400000, lastYear: 1200000 },
    { time: 'Dec 31', today: 900000, lastYear: 800000 },
    { time: 'Jan 1', today: 1100000, lastYear: 1400000 },
    { time: 'Jan 2', today: 2800000, lastYear: 2200000 },
    { time: 'Jan 3', today: 4200000, lastYear: 3100000 },
  ],
  inventory: [
    { id: '1', name: '[Built-in Apps] 5G WiFi Bluetooth Smart Projector 4K Support', sku: 'PRJ-4K-ULTRA', asin: 'B0CP5W1RXV', status: 'Active', price: 138.98, units: 215, image: 'https://m.media-amazon.com/images/I/71YyW3mI-iL._AC_SL1500_.jpg' },
    { id: '2', name: 'XBJ Wireless Mini Projector with WiFi, 4K Support Outdoor Movie', sku: 'MSE-ERG-BT', asin: 'B0CQHRQNDT', status: 'Active', price: 29.98, units: 168, image: 'https://m.media-amazon.com/images/I/61Nl-HhDsyL._AC_SL1500_.jpg' },
    { id: '3', name: 'Mechanical Gaming Keyboard - RGB Backlit, Blue Switches', sku: 'KBD-GAM-RGB', asin: 'B0CP9WTC5N', status: 'Active', price: 67.98, units: 132, image: 'https://m.media-amazon.com/images/I/71cnd7plSjL._AC_SL1500_.jpg' },
  ],
  orders: [],
  salesSnapshot: {
    totalOrderItems: 248,
    unitsOrdered: 192260,
    orderedProductSales: 18657478.98,
    avgUnitsOrderItem: 1.14,
    avgSalesOrderItem: 110.29
  }
};

export const useStore = create<AppStore>()(
  persist(
    (set) => ({
      session: {
        email: '519798002@qq.com',
        isLoggedIn: false,
        step: 'email',
        marketplace: 'United States',
        // 根据浏览器语言自动检测默认语言
        language: navigator.language.includes('zh') ? 'zh-CN' : 'en-US',
        store: 'Store 1',
      },
      dashboard: initialDashboard,
      setSession: (newSession) => set((state) => ({ session: { ...state.session, ...newSession } })),
      setMarketplace: (m) => set((state) => {
        // Update marketplace and refresh dashboard data
        const mktData = salesDashboardData[m] || salesDashboardData['United States'];
        return {
          session: { ...state.session, marketplace: m },
          dashboard: { ...state.dashboard, ...mktData }
        };
      }),
      setLanguage: (l) => set((state) => {
        console.log('Language changed to:', l);
        return { session: { ...state.session, language: l } };
      }),
      setStore: (s) => set((state) => ({ session: { ...state.session, store: s } })),
      logout: () => set({ session: { email: '', isLoggedIn: false, step: 'email', marketplace: 'United States', language: 'en-US', store: 'Store 1' } }),
      importData: (data) => set((state) => ({ dashboard: { ...state.dashboard, ...data } })),
      updateDashboardByMarketplace: (m) => set((state) => {
        const mktData = salesDashboardData[m] || salesDashboardData['United States'];
        return {
          dashboard: { ...state.dashboard, ...mktData }
        };
      }),
    }),
    { name: 'amazon-seller-central-storage' }
  )
);
