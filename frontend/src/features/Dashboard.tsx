import React, { useMemo, useState, useEffect } from 'react';
import { Search, MoreHorizontal, ChevronDown, ChevronRight, Star } from 'lucide-react';
import { useStore } from '../store';
import { useI18n } from '../hooks/useI18n';
import { ActionsCard, CommunicationsCard } from './LeftColumnComponents';
import { storeApi, type StoreData, type DashboardData } from '../services/storeApi';

// ==================== Mock Data ====================
const ACTIONS = [
  { id: "shipmentPerformance", count: null },
  { id: "shipOrders", count: 10 },
  { id: "reviewReturns", count: 2 },
  { id: "fixStrandedInventory", count: null },
];

type ProductRow = {
  id: number;
  title: string;
  sku: string;
  asin: string;
  listingStatus: 'Active' | 'Inactive';
  sales: string;
  unitsSold: number;
  pageViews: number;
  inventory: string;
  price: string;
  img: string;
};

const MOCK_PRODUCTS: ProductRow[] = [
  {
    id: 1,
    title: "Lace Things for Women Bralette",
    sku: "SKU: TYNBO-LACE-001",
    asin: "ASIN: B08F765432",
    listingStatus: "Active",
    sales: "US$822",
    unitsSold: 21,
    pageViews: 298,
    inventory: "66 可售数量",
    price: "US$39.99",
    img: "https://m.media-amazon.com/images/I/71tJkM8vDVL._AC_UY218_.jpg",
  },
  {
    id: 2,
    title: "Easy Soft Stretch Womens Underwear",
    sku: "SKU: TYNBO-UNDER-002",
    asin: "ASIN: B08G876543",
    listingStatus: "Active",
    sales: "US$160",
    unitsSold: 16,
    pageViews: 0,
    inventory: "102 可售数量",
    price: "US$5.99",
    img: "https://m.media-amazon.com/images/I/51p+sM-iXRL._AC_UY218_.jpg",
  },
  {
    id: 3,
    title: "Easy Soft Stretch Womens Underwear",
    sku: "SKU: TYNBO-UNDER-003",
    asin: "ASIN: B08H987654",
    listingStatus: "Active",
    sales: "US$146",
    unitsSold: 18,
    pageViews: 0,
    inventory: "106 可售数量",
    price: "US$5.99",
    img: "https://m.media-amazon.com/images/I/61f8g9h0iJL._AC_UY218_.jpg",
  },
  {
    id: 4,
    title: "Underwear for Women Cotton High",
    sku: "SKU: TYNBO-UNDER-004",
    asin: "ASIN: B08I098765",
    listingStatus: "Active",
    sales: "US$107",
    unitsSold: 12,
    pageViews: 0,
    inventory: "83 可售数量",
    price: "US$5.99",
    img: "https://m.media-amazon.com/images/I/61s+N9rK-xL._AC_UY218_.jpg",
  },
  {
    id: 5,
    title: "Lace Things for Women Bralette",
    sku: "SKU: TYNBO-LACE-002",
    asin: "ASIN: B08J109876",
    listingStatus: "Active",
    sales: "US$101",
    unitsSold: 10,
    pageViews: 0,
    inventory: "126 可售数量",
    price: "US$19.99",
    img: "https://m.media-amazon.com/images/I/81M51+d85EL._AC_UY218_.jpg",
  },
];

// ==================== Star Rating Component ====================
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star 
          key={i} 
          size={16} 
          className={i < rating ? "fill-[#FFA41C] text-[#FFA41C]" : "text-[#D5D9D9]"} 
        />
      ))}
      <span className="ml-1 text-[16px] font-bold text-[#007185]">{rating.toFixed(2)}</span>
    </div>
  );
}

// ==================== Sparkline Component ====================
function TinySparkline() {
  return (
    <div className="mt-2 ml-0">
      <div className="h-[44px] w-full relative">
        <svg viewBox="0 0 300 60" className="w-full h-full overflow-visible">
          {/* Y-axis ticks */}
          <g className="text-[9px] text-[#565959]">
            <text x="-5" y="10" textAnchor="end">100</text>
            <text x="-5" y="30" textAnchor="end">50</text>
            <text x="-5" y="50" textAnchor="end">0</text>
          </g>
          
          {/* Grid lines */}
          <line x1="0" y1="10" x2="300" y2="10" stroke="#E7EAEA" strokeWidth="1" opacity="0.5" />
          <line x1="0" y1="30" x2="300" y2="30" stroke="#E7EAEA" strokeWidth="1" opacity="0.5" />
          <line x1="0" y1="50" x2="300" y2="50" stroke="#E7EAEA" strokeWidth="1" opacity="0.5" />
          
          {/* Left border */}
          <line x1="0" y1="0" x2="0" y2="60" stroke="#E7EAEA" strokeWidth="1" />
          
          {/* Main line */}
          <path
            d="M0,50 L50,40 L100,20 L150,35 L200,10 L250,25 L300,18"
            fill="none"
            stroke="#007185"
            strokeWidth="1"
          />
          <circle cx="300" cy="18" r="2" fill="#007185" />
        </svg>
      </div>
      <div className="flex justify-between text-[11px] text-[#565959] mt-1">
        <span>Jan 1</span>
        <span>4</span>
        <span>7</span>
      </div>
    </div>
  );
}

// ==================== Dashboard ====================
export default function Dashboard() {
  const { session } = useStore();
  const { t } = useI18n();
  const [statusFilter, setStatusFilter] = useState(t('active'));
  const [interactionFilter, setInteractionFilter] = useState('Frequently interacted');
  const [query, setQuery] = useState("");
  
  // State for API data
  const [currentStore, setCurrentStore] = useState<StoreData | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load store and dashboard data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Find current store by name (fallback to first store)
        const stores = await storeApi.getStores();
        const store = stores.find(s => s.name === session.store) || stores[0];
        
        if (!store) {
          throw new Error('No stores found');
        }
        
        setCurrentStore(store);
        
        // Load dashboard data for the store
        const dashboard = await storeApi.getDashboardData(store.id);
        setDashboardData(dashboard);
        
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [session.store]);

  // Get currency symbol from current store or fallback to marketplace configs
  const marketplaceConfigs = {
    'United States': '$',
    'Japan': '¥',
    'United Kingdom': '£',
    'Germany': '€',
    'Europe': '€'
  };
  
  const currencySymbol = currentStore?.currency_symbol || marketplaceConfigs[session.marketplace] || '$';

  // Use dashboard data from API or fallback to mock data
  const products = dashboardData?.inventory || MOCK_PRODUCTS.map(p => ({
    ...p,
    sales: p.sales.replace('US$', currencySymbol),
    price: p.price.replace('US$', currencySymbol)
  }));

  const filteredProducts = useMemo(() => {
    return products.filter((p: any) => {
      const statusOk = statusFilter === t('all') ? true : p.listingStatus === statusFilter || p.status === statusFilter;
      const q = query.trim().toLowerCase();
      const queryOk = !q ? true : (
        (p.title || p.name || '').toLowerCase().includes(q) || 
        (p.asin || '').toLowerCase().includes(q) || 
        (p.sku || '').toLowerCase().includes(q)
      );
      return statusOk && queryOk;
    });
  }, [products, statusFilter, query, t]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-amazon-teal border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-white border rounded-sm shadow-sm min-h-[400px]">
        <h1 className="text-2xl font-black text-amazon-text mb-4">Dashboard Error</h1>
        <p className="text-amazon-error">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-amazon-teal text-white rounded hover:bg-amazon-headerTeal"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in min-h-screen pb-8">
      {/* Top Welcome Row */}
      <div className="mb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1 whitespace-nowrap">
            <span className="text-[16px] font-normal text-[#0F1111] leading-[24px]">Good evening, your account health is</span>
            <span className="ml-2 bg-[#E6F0CE] text-[#507F00] px-2 py-0.5 rounded-full text-[12px] font-semibold">Healthy</span>
            <ChevronRight size={12} className="ml-1 text-[#507F00] align-baseline" />
          </div>
          <div className="inline-flex gap-2">
            <button className="h-7 px-3 text-[12px] font-medium text-[#007185] bg-white border border-[#D5DBDB] rounded-[3px] hover:bg-[#F7F8F8] transition-colors">
              Launch Tour
            </button>
            <button className="h-7 px-3 text-[12px] font-medium text-[#007185] bg-white border border-[#D5DBDB] rounded-[3px] hover:bg-[#F7F8F8] transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* ==================== Main (2 columns) ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-[264px_1fr] gap-4">
        {/* ========== LEFT COLUMN (264px) ========== */}
        <div className="flex flex-col gap-4">
          {/* Actions Card */}
          <ActionsCard />
          
          {/* Communications Card */}
          <CommunicationsCard />
        </div>

        {/* ========== RIGHT COLUMN (Remaining Width) ========== */}
        <div className="flex flex-col gap-4">
          {/* ==================== Global Snapshot ==================== */}
          <div className="bg-white border border-[#E3E6E6] rounded-md p-0 shadow-sm overflow-hidden">
            {/* Title Bar */}
            <div className="flex justify-between items-center px-3 py-2">
              <h3 className="text-[14px] font-medium text-[#007185]">Global Snapshot</h3>
              <div className="flex items-center gap-1">
                {/* Expand Icon */}
                <button className="w-[24px] h-[24px] flex items-center justify-center text-[#565959] hover:bg-[#F0F2F2] transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 21l-6-6m0 0l-6 6m6-6V3m0 18h6" />
                  </svg>
                </button>
                {/* Sliders Icon */}
                <button className="w-[24px] h-[24px] flex items-center justify-center text-[#565959] hover:bg-[#F0F2F2] transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" y1="21" x2="4" y2="14" />
                    <line x1="4" y1="10" x2="4" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12" y2="3" />
                    <line x1="20" y1="21" x2="20" y2="16" />
                    <line x1="20" y1="12" x2="20" y2="3" />
                    <line x1="1" y1="14" x2="7" y2="14" />
                    <line x1="9" y1="8" x2="15" y2="8" />
                    <line x1="17" y1="16" x2="23" y2="16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Column Headers */}
            <div className="grid grid-cols-1 lg:grid-cols-6">
              <div className="lg:border-r border-[#E3E6E6] px-3 py-1.5 text-[12px] font-semibold text-[#007185] flex justify-between items-center">
                Sales
                <ChevronDown size={12} className="text-[#888C8C]" />
              </div>
              <div className="lg:border-r border-[#E3E6E6] px-3 py-1.5 text-[12px] font-semibold text-[#007185] flex justify-between items-center">
                Open Orders
                <ChevronDown size={12} className="text-[#888C8C]" />
              </div>
              <div className="lg:border-r border-[#E3E6E6] px-3 py-1.5 text-[12px] font-semibold text-[#007185] flex justify-between items-center">
                Buyer Messages
                <ChevronDown size={12} className="text-[#888C8C]" />
              </div>
              <div className="lg:border-r border-[#E3E6E6] px-3 py-1.5 text-[12px] font-semibold text-[#007185] flex justify-between items-center">
                Featured Offer %
                <ChevronDown size={12} className="text-[#888C8C]" />
              </div>
              <div className="lg:border-r border-[#E3E6E6] px-3 py-1.5 text-[12px] font-semibold text-[#007185] flex justify-between items-center">
                Seller Feedback
                <ChevronDown size={12} className="text-[#888C8C]" />
              </div>
              <div className="px-3 py-1.5 text-[12px] font-semibold text-[#007185] flex justify-between items-center">
                Payments
                <ChevronDown size={12} className="text-[#888C8C]" />
              </div>
            </div>

            {/* Upper Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-6">
              <div className="lg:border-r border-[#E3E6E6] px-3 py-2">
                <div className="text-[22px] font-bold text-[#002E35] mb-0.5">{currencySymbol}{dashboardData?.salesToday?.toFixed(2) || '49.95'}</div>
                <div className="text-[11px] text-[#565959]">Today so far</div>
              </div>
              <div className="lg:border-r border-[#E3E6E6] px-3 py-2">
                <div className="text-[22px] font-bold text-[#002E35] mb-0.5">{dashboardData?.openOrders || 6}</div>
                <div className="text-[11px] text-[#565959]">Total Count</div>
              </div>
              <div className="lg:border-r border-[#E3E6E6] px-3 py-2">
                <div className="text-[22px] font-bold text-[#002E35] mb-0.5">{dashboardData?.messages || 0}</div>
                <div className="text-[11px] text-[#565959]">Cases requiring attention</div>
              </div>
              <div className="lg:border-r border-[#E3E6E6] px-3 py-2">
                <div className="text-[22px] font-bold text-[#002E35] mb-0.5">100%</div>
                <div className="text-[11px] text-[#565959]">2 days ago</div>
              </div>
              <div className="lg:border-r border-[#E3E6E6] px-3 py-2">
                <div className="flex items-center mb-0.5">
                  <StarRating rating={5} />
                </div>
                <div className="text-[11px] text-[#565959]">Past Year (2)</div>
              </div>
              <div className="px-3 py-2">
                <div className="text-[22px] font-bold text-[#002E35] mb-0.5">{currencySymbol}{dashboardData?.salesSnapshot?.orderedProductSales?.toFixed(2) || '228.31'}</div>
                <div className="text-[11px] text-[#565959]">Total Balance</div>
              </div>
            </div>

            {/* Horizontal Divider (贯穿 6 列) */}
            <div className="border-t border-[#E3E6E6] my-0"></div>

            {/* Lower Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-6 pb-3">
              <div className="lg:border-r border-[#E3E6E6] px-3 py-1.5">
                <TinySparkline />
              </div>
              <div className="lg:border-r border-[#E3E6E6] px-3 py-1.5">
                <div className="space-y-1.5 text-[12px]">
                  <div className="flex justify-between items-center">
                    <span className="text-[#565959]">FBM Unshipped</span>
                    <span className="text-[#007185] font-medium">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#565959]">FBM Pending</span>
                    <span className="text-[#007185] font-medium">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#565959]">FBA Pending</span>
                    <span className="text-[#007185] font-medium">6</span>
                  </div>
                </div>
              </div>
              <div className="lg:border-r border-[#E3E6E6] px-3 py-1.5">
                <div className="flex justify-between items-center mb-1">
                  <div className="text-[12px] text-[#007185]">Inventory Performance Index</div>
                  <ChevronDown size={12} className="text-[#888C8C]" />
                </div>
                <div className="flex justify-between items-center">
                  <div></div>
                  <div className="text-right">
                    <div className="text-[14px] font-bold text-[#007185]">400</div>
                    <div className="text-[12px] text-[#565959]">Current</div>
                  </div>
                </div>
              </div>
              <div className="lg:border-r border-[#E3E6E6] px-3 py-1.5">
                <div className="text-[12px] text-[#007185] mb-1">Global Promotions Sales</div>
                <div className="text-[12px] text-[#565959] mb-1">No data available</div>
                <a href="#" className="text-[12px] text-[#007185] hover:underline">Learn More</a>
              </div>
              <div className="lg:border-r border-[#E3E6E6] px-3 py-1.5">
                <div className="flex justify-between items-center mb-1">
                  <div className="text-[12px] font-semibold text-[#007185]">Ad Sales</div>
                  <ChevronDown size={12} className="text-[#888C8C]" />
                </div>
                <div className="text-[16px] font-bold text-[#007185] mb-0.5">{currencySymbol}0.00</div>
                <div className="text-[12px] text-[#565959]">Today so far</div>
              </div>
              <div className="px-3 py-1.5">
                <div className="flex justify-between items-center mb-1">
                  <div className="text-[12px] font-semibold text-[#007185]">Ad Impressions</div>
                  <ChevronDown size={12} className="text-[#888C8C]" />
                </div>
                <div className="text-[16px] font-bold text-[#007185] mb-0.5">0</div>
                <div className="text-[12px] text-[#565959]">Today so far</div>
              </div>
            </div>
          </div>

          {/* ==================== Product Performance Table ==================== */}
          <div className="bg-white border border-[#E3E6E6] rounded-[8px] p-[16px] shadow-none">
            {/* Header with controls */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-medium text-amazon-headerTeal">{t('productPerformance')}</h3>
                <div className="w-4 h-4 rounded-full border-2 border-[#D5D9D9] flex items-center justify-center">
                  <span className="text-[10px] text-[#565959] font-medium">!</span>
                </div>
                <div className="text-[12px] text-[#565959]">Last 30 days</div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-[#D5D9D9] text-[12px] rounded-sm px-3 py-1.5 pr-8 hover:bg-[#F0F2F2] cursor-pointer appearance-none outline-none focus:border-[#007185] transition-colors"
                >
                  <option value={t('active')}>{t('active')}</option>
                  <option value={t('inactive')}>{t('inactive')}</option>
                  <option value={t('all')}>{t('all')}</option>
                </select>
                
                <select
                  value={interactionFilter}
                  onChange={(e) => setInteractionFilter(e.target.value)}
                  className="bg-white border border-[#D5D9D9] text-[12px] rounded-sm px-3 py-1.5 pr-8 hover:bg-[#F0F2F2] cursor-pointer appearance-none outline-none focus:border-[#007185] transition-colors"
                >
                  <option value="Frequently interacted">{t('frequentlyInteracted')}</option>
                  <option value="Recently added">{t('recentlyAdded')}</option>
                  <option value="All products">{t('allProducts')}</option>
                </select>
                
                <div className="relative">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('search')}
                    className="border border-[#D5D9D9] rounded-sm pl-3 pr-8 py-1.5 text-[12px] w-[180px] h-[32px] focus:border-[#007185] outline-none transition-colors bg-white"
                  />
                  <Search className="absolute right-2 top-2.5 w-4 h-4 text-gray-500" />
                </div>
                
                <button className="p-1.5 text-[#888C8C] hover:text-[#002E35] hover:bg-[#F0F2F2] rounded-sm transition-colors">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-[13px] text-left">
                <thead className="text-[12px] text-[#565959] bg-[#F7F8FA] border-b border-[#E3E6E6]">
                  <tr>
                    <th className="px-4 py-3 font-medium">{t('productDetails')}</th>
                    <th className="px-4 py-3 font-medium">{t('listingStatus')}</th>
                    <th className="px-4 py-3 text-right font-medium">{t('sales')}</th>
                    <th className="px-4 py-3 text-right font-medium">{t('unitsSold')}</th>
                    <th className="px-4 py-3 text-right font-medium">{t('pageViews')}</th>
                    <th className="px-4 py-3 text-right font-medium">{t('inventoryColumn')}</th>
                    <th className="px-4 py-3 text-right font-medium">{t('price')}</th>
                    <th className="px-4 py-3 text-center font-medium">{t('action')}</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((p: any, index: number) => (
                    <tr key={p.id || index} className="border-b border-[#E3E6E6] hover:bg-[#F7F8F8] transition-colors">
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-6 h-6">
                            <Star size={16} className="text-[#D5D9D9]" />
                          </div>
                          <img
                            src={p.image || p.img || 'https://via.placeholder.com/40'}
                            alt="Product"
                            className="w-[40px] h-[40px] object-contain border border-[#E7EAEA] bg-white rounded-sm"
                          />
                          <div className="flex flex-col min-w-[280px] max-w-[420px]">
                            <a
                              href="#"
                              className="text-[#007185] font-medium hover:underline hover:text-[#C7511F] truncate text-[13px] transition-colors"
                              title={p.name || p.title}
                            >
                              {p.name || p.title}
                            </a>
                            <div className="text-[12px] text-[#565959] mt-0.5 truncate">SKU: {p.sku}</div>
                            <div className="text-[12px] text-[#565959] truncate">ASIN: {p.asin}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-2">
                        <span className="text-[12px] font-semibold text-[#0F1111]">
                          {(p.status || p.listingStatus) === 'Active' ? t('active') : t('inactive')}
                        </span>
                      </td>

                      <td className="px-4 py-2 text-right font-normal">
                        {currencySymbol}{typeof p.sales === 'string' ? p.sales.replace(/[^0-9.]/g, '') : (p.sales_amount || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-right font-normal">{p.unitsSold || p.units_sold || 0}</td>
                      <td className="px-4 py-2 text-right font-normal">{(p.pageViews || 0) > 0 ? (p.pageViews || 0).toLocaleString() : "--"}</td>
                      <td className="px-4 py-2 text-right font-normal">
                        {typeof p.inventory === 'string' ? p.inventory : `${p.inventory || p.units || 0} 可售数量`}
                      </td>
                      <td className="px-4 py-2 text-right font-normal">
                        {currencySymbol}{typeof p.price === 'string' ? p.price.replace(/[^0-9.]/g, '') : (p.price || 0).toFixed(2)}
                      </td>

                      <td className="px-4 py-2 text-center">
                        <button className="p-1 text-[#888C8C] hover:text-[#002E35] hover:bg-[#F0F2F2] rounded-sm transition-colors border border-[#D5D9D9]">
                          <ChevronDown size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination - Single horizontal row layout */}
            <div className="p-3 border-t border-[#E3E6E6] bg-[#F8F8F8] flex items-center justify-between gap-4 mt-4">
              {/* Results info */}
              <div className="text-[12px] text-[#565959]">
                {t('showItems', { from: 1, to: 5, total: 16 })}
              </div>
              
              {/* Pagination buttons */}
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 text-[12px] font-medium text-[#007185] bg-white border border-[#D5D9D9] rounded-sm hover:bg-[#F7F8F8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled>
                  &lt;
                </button>
                <button className="px-3 py-1 text-[12px] font-bold text-white bg-[#007185] border border-[#007185] rounded-sm hover:bg-[#005F6B] transition-colors">
                  1
                </button>
                <button className="px-3 py-1 text-[12px] font-medium text-[#007185] bg-white border border-[#D5D9D9] rounded-sm hover:bg-[#F7F8F8] transition-colors">
                  2
                </button>
                <button className="px-3 py-1 text-[12px] font-medium text-[#007185] bg-white border border-[#D5D9D9] rounded-sm hover:bg-[#F7F8F8] transition-colors">
                  3
                </button>
                <button className="px-3 py-1 text-[12px] font-medium text-[#007185] bg-white border border-[#D5D9D9] rounded-sm hover:bg-[#F7F8F8] transition-colors">
                  4
                </button>
                <button className="px-3 py-1 text-[12px] font-medium text-[#007185] bg-white border border-[#D5D9D9] rounded-sm hover:bg-[#F7F8F8] transition-colors">
                  &gt;
                </button>
              </div>
              
              {/* Go to Manage All Inventory button */}
              <button className="px-3 py-1 text-[12px] font-medium text-[#007185] bg-white border border-[#D5D9D9] rounded-sm hover:bg-[#F7F8F8] transition-colors">
                {t('goToManageInventory')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}