# 修改点清单

## A. 文字层级调整
1. **顶部问候行**：字号从24px改为16px，取消加粗，文字颜色改为#002E35
2. **卡片标题**：确保字号16px，加粗，文字颜色#002E35
3. **Global Snapshot数字**：文字颜色改为#002E35

## B. 卡片容器形态
1. **圆角**：所有卡片使用3-4px圆角（rounded-sm）
2. **边框和阴影**：1px #D5D9D9边框，内部分割线#E7EAEA，最小阴影
3. **内边距**：调整为12-16px，提高信息密度

## C. Global Snapshot结构与细节
1. **顶部栏**：左侧标题加粗#002E35，右侧"Today so far"为12px灰色(#565959)，右上添加两个icon按钮
2. **指标格**：6个等宽列，使用竖分割线分隔，大数字28-32px bold #002E35
3. **次级指标**：3个指标呈底栏形态，更矮更紧凑

## D. 内容一致性
1. **Actions卡片**：每条包含主标题链接色(#007185)、副说明(12px灰)、右侧数字对齐和三点菜单
2. **消息和新闻卡片**：条目含标题/摘要/时间与互动图标，底部有"View all"链接
3. **Product Performance**：完整筛选条，表头12px bold，行高56-64px，Actions列为小下拉按钮

## E. 页面边距
1. **左右边距**：16-24px，使用px-4安全边距，无max-width限制

# 需要修改的文件列表
1. **d:\amazon-seller-central-clone\features\Dashboard.tsx**：主Dashboard组件

# 完整可覆盖的代码片段

```tsx
import React, { useMemo, useState } from 'react';
import { Search, MoreHorizontal, ChevronRight, ChevronDown, ChevronUp, Star, ShieldCheck, X } from 'lucide-react';
import { useStore } from '../store';
import { useI18n } from '../hooks/useI18n';

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

// ==================== 中文星级评分组件 ====================
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
      <span className="ml-1 text-[12px] font-bold text-[#002E35]">{rating.toFixed(2)}</span>
    </div>
  );
}

// ==================== Small UI helpers ====================
function TinySparkline() {
  return (
    <div className="mt-2">
      <div className="h-[46px] w-full border-b border-l border-gray-200 relative">
        <svg viewBox="0 0 300 60" className="w-full h-full overflow-visible">
          <path
            d="M0,50 L50,40 L100,20 L150,35 L200,10 L250,25 L300,18"
            fill="none"
            stroke="#007185"
            strokeWidth="2"
          />
          <circle cx="300" cy="18" r="3" fill="#007185" />
        </svg>
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-medium">
        <span>Dec 28</span>
        <span>Jan 3</span>
      </div>
    </div>
  );
}

function SelectMini({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[#F0F2F2] border border-[#D5D9D9] text-[12px] font-bold rounded-sm px-3 py-1.5 pr-8 shadow-sm hover:bg-[#E3E6E6] cursor-pointer appearance-none outline-none focus:border-[#007185] transition-colors"
      >
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={12} className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
    </div>
  );
}

// ==================== Dashboard ====================
export default function Dashboard() {
  const { session } = useStore();
  const { t } = useI18n();
  const [statusFilter, setStatusFilter] = useState(t('active'));
  const [query, setQuery] = useState("");
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => {
      const statusOk = statusFilter === t('all') ? true : p.listingStatus === statusFilter;
      const q = query.trim().toLowerCase();
      const queryOk = !q ? true : (p.title.toLowerCase().includes(q) || p.asin.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
      return statusOk && queryOk;
    });
  }, [statusFilter, query, t]);

  return (
    <div className="animate-fade-in min-h-screen pb-8 px-4">
      {/* Top Welcome Row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[16px] font-normal text-[#002E35]">
            {t('goodEvening')}
            <span className="ml-2 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-[13px] font-medium">{t('healthy')}</span>
            <ChevronRight size={16} className="inline ml-1 text-[#002E35]" />
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-[#D5D9D9] text-[#002E35] text-[13px] px-3 py-1.5 rounded-sm hover:bg-[#F7FAFA] transition-colors">
            {t('publishDemo')}
          </button>
          <button className="bg-white border border-[#D5D9D9] text-[#002E35] text-[13px] px-3 py-1.5 rounded-sm hover:bg-[#F7FAFA] transition-colors">
            {t('learnMoreInfo')}
          </button>
        </div>
      </div>

      {/* ==================== Main (2 columns) ====================
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
        {/* ========== LEFT COLUMN (320px) ========== */}
        <div className="flex flex-col gap-4">
          {/* Actions Card */}
          <div className="bg-white border border-[#D5D9D9] rounded-sm shadow-sm">
            <div className="p-3 border-b border-[#E7EAEA] flex justify-between items-center bg-[#F8F8F8]">
              <h3 className="font-bold text-[#002E35] text-[16px]">{t('actions')}</h3>
              <span className="bg-[#002E35] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">4</span>
            </div>
            <div>
              {ACTIONS.map((action, idx) => (
                <div
                  key={idx}
                  className="p-3 border-b border-[#F0F2F2] last:border-0 hover:bg-[#F7F8F8] cursor-pointer flex justify-between items-center group transition-colors"
                >
                  <div>
                    <div className="text-[#007185] text-[13px] font-medium group-hover:underline">{t(action.id)}</div>
                    <div className="text-[12px] text-[#565959] mt-0.5">{t(`${action.id}Sub`)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {action.count ? <span className="font-bold text-[#002E35]">{action.count}</span> : null}
                    <MoreHorizontal size={16} className="text-[#565959]" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Buyer Messages Card */}
          <div className="bg-white border border-[#D5D9D9] rounded-sm shadow-sm">
            <div className="p-3 border-b border-[#E7EAEA] bg-[#F8F8F8] flex justify-between items-center">
              <h3 className="font-bold text-[#002E35] text-[16px]">{t('messages')}</h3>
            </div>

            <div className="p-3 hover:bg-[#F7F8F8] cursor-pointer border-b border-[#F0F2F2] transition-colors">
              <div className="flex justify-between text-[12px] text-[#565959] mb-1">
                <span className="font-bold uppercase tracking-wider">Seller Forums</span>
                <span>2h ago</span>
              </div>
              <div className="text-[#002E35] text-[13px] font-medium mb-1">How to handle return requests for FBA?</div>
              <div className="flex items-center gap-4 text-[12px] text-[#565959]">
                <span className="flex items-center gap-1">👁️ 12</span>
                <span className="flex items-center gap-1">💬 2</span>
              </div>
            </div>

            <div className="p-3 border-t border-[#E7EAEA] bg-[#F8F8F8]">
              <a href="#" className="text-[#007185] text-[12px] font-bold hover:underline">{t('viewAllMessages')}</a>
            </div>
          </div>

          {/* Seller News Card */}
          <div className="bg-white border border-[#D5D9D9] rounded-sm shadow-sm">
            <div className="p-3 border-b border-[#E7EAEA] bg-[#F8F8F8] flex justify-between items-center">
              <h3 className="font-bold text-[#002E35] text-[16px]">{t('sellerNews')}</h3>
            </div>

            <div className="p-3 hover:bg-[#F7F8F8] cursor-pointer border-b border-[#F0F2F2] transition-colors">
              <div className="flex justify-between text-[12px] text-[#565959] mb-1">
                <span className="font-bold uppercase tracking-wider">Announcement</span>
                <span>1d ago</span>
              </div>
              <div className="text-[#002E35] text-[13px] font-medium mb-1">New FBA storage fees update for 2024</div>
              <div className="text-[12px] text-[#565959] mb-1">Amazon will be adjusting FBA storage fees starting January 1, 2024.</div>
              <div className="flex items-center gap-4 text-[12px] text-[#565959]">
                <span className="flex items-center gap-1">👁️ 456</span>
                <span className="flex items-center gap-1">💬 34</span>
              </div>
            </div>

            <div className="p-3 border-t border-[#E7EAEA] bg-[#F8F8F8]">
              <a href="#" className="text-[#007185] text-[12px] font-bold hover:underline">{t('viewAllNews')}</a>
            </div>
          </div>
        </div>

        {/* ========== RIGHT COLUMN (Remaining Width) ========== */}
        <div className="flex flex-col gap-4">
          {/* ==================== Global Snapshot (6 columns) ====================
          <div className="bg-white border border-[#D5D9D9] rounded-sm shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E7EAEA] bg-[#F8F8F8] flex items-center justify-between">
              <div className="font-bold text-[#002E35] text-[16px]">{t('globalSnapshot')}</div>
              <div className="flex items-center gap-3">
                <div className="text-[12px] text-[#565959] font-medium">{t('todaySoFar')}</div>
                <div className="flex items-center gap-2">
                  <button className="text-[#888C8C] hover:text-[#002E35] p-1 hover:bg-[#F0F2F2] rounded-sm transition-colors">
                    <span className="sr-only">{t('gridLayout')}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                    </svg>
                  </button>
                  <button className="text-[#888C8C] hover:text-[#002E35] p-1 hover:bg-[#F0F2F2] rounded-sm transition-colors">
                    <span className="sr-only">{t('settings')}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* 6-column layout for metrics */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-0">
              {/* Sales */}
              <div className="p-4 border-b md:border-b-0 md:border-r border-[#E7EAEA] flex flex-col">
                <div className="flex justify-between items-center">
                  <div className="text-[12px] text-[#565959] font-bold uppercase tracking-wider">{t('sales')}</div>
                  <ChevronDown size={12} className="text-[#888C8C]" />
                </div>
                <div className="text-[32px] font-black text-[#002E35] mt-1">US$49.95</div>
                <div className="text-[12px] text-[#565959] mt-1">{t('todaySoFar')}</div>
                <TinySparkline />
              </div>

              {/* Open Orders */}
              <div className="p-4 border-b md:border-b-0 md:border-r border-[#E7EAEA] flex flex-col">
                <div className="flex justify-between items-center">
                  <div className="text-[12px] text-[#565959] font-bold uppercase tracking-wider">{t('openOrders')}</div>
                  <ChevronDown size={12} className="text-[#888C8C]" />
                </div>
                <div className="text-[28px] font-black text-[#002E35] mt-1">6</div>
                <div className="mt-2 text-[12px] text-[#565959] space-y-1">
                  <div className="flex justify-between"><span className="text-[#565959]">{t('fbmUnshipped')}</span><span className="text-[#002E35] font-bold">10</span></div>
                  <div className="flex justify-between"><span className="text-[#565959]">{t('fbaInventory')}</span><span className="text-[#002E35] font-bold">400</span></div>
                </div>
              </div>

              {/* Buyer Messages */}
              <div className="p-4 border-b md:border-b-0 md:border-r border-[#E7EAEA] flex flex-col">
                <div className="flex justify-between items-center">
                  <div className="text-[12px] text-[#565959] font-bold uppercase tracking-wider">{t('buyerMessages')}</div>
                  <ChevronDown size={12} className="text-[#888C8C]" />
                </div>
                <div className="text-[28px] font-black text-[#002E35] mt-1">0</div>
                <div className="text-[12px] text-[#565959] mt-2">{t('pendingDisputes')}</div>
              </div>

              {/* Featured Offer */}
              <div className="p-4 border-b md:border-b-0 md:border-r border-[#E7EAEA] flex flex-col">
                <div className="flex justify-between items-center">
                  <div className="text-[12px] text-[#565959] font-bold uppercase tracking-wider">{t('featuredOffer')}</div>
                  <ChevronDown size={12} className="text-[#888C8C]" />
                </div>
                <div className="text-[28px] font-black text-[#002E35] mt-1">100%</div>
                <div className="text-[12px] text-[#565959] mt-2">Top ASIN 数量</div>
              </div>

              {/* Seller Feedback */}
              <div className="p-4 border-b md:border-b-0 md:border-r border-[#E7EAEA] flex flex-col">
                <div className="flex justify-between items-center">
                  <div className="text-[12px] text-[#565959] font-bold uppercase tracking-wider">{t('feedback')}</div>
                  <ChevronDown size={12} className="text-[#888C8C]" />
                </div>
                <div className="mt-1">
                  <StarRating rating={5} />
                </div>
                <div className="text-[12px] text-[#565959] mt-1">过去一年 (2 条评价)</div>
              </div>

              {/* Payments */}
              <div className="p-4 border-b md:border-b-0 flex flex-col">
                <div className="flex justify-between items-center">
                  <div className="text-[12px] text-[#565959] font-bold uppercase tracking-wider">{t('payments')}</div>
                  <ChevronDown size={12} className="text-[#888C8C]" />
                </div>
                <div className="text-[28px] font-black text-[#002E35] mt-1">US$5,228.31</div>
                <div className="text-[12px] text-[#565959] mt-2">{t('totalBalance')}</div>
              </div>
            </div>

            {/* Bottom 3 metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 border-t border-[#E7EAEA] bg-white">
              <div className="p-3 border-b md:border-b-0 md:border-r border-[#E7EAEA] flex justify-between items-center">
                <div>
                  <div className="text-[12px] text-[#565959]">{t('adSales')}</div>
                  <div className="text-[16px] font-bold text-[#002E35]">US$0.00</div>
                </div>
                <ChevronDown size={12} className="text-[#888C8C]" />
              </div>
              <div className="p-3 border-b md:border-b-0 md:border-r border-[#E7EAEA] flex justify-between items-center">
                <div>
                  <div className="text-[12px] text-[#565959]">{t('adImpressions')}</div>
                  <div className="text-[16px] font-bold text-[#002E35]">0</div>
                </div>
                <ChevronDown size={12} className="text-[#888C8C]" />
              </div>
              <div className="p-3 flex justify-between items-center">
                <div>
                  <div className="text-[12px] text-[#565959]">{t('inventoryPerformanceIndex')}</div>
                  <div className="text-[16px] font-bold text-[#002E35]">400</div>
                </div>
                <ChevronDown size={12} className="text-[#888C8C]" />
              </div>
            </div>
          </div>

          {/* ==================== Product Performance Table ====================
          <div className="bg-white border border-[#D5D9D9] rounded-sm shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E7EAEA] bg-[#F8F8F8]">
              <div className="font-bold text-[#002E35] text-[16px] mb-3">{t('productPerformance')}</div>

              {/* Filter Bar */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-[#565959] font-medium">{t('productStatus')}:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-[#888C8C] rounded-sm px-2 py-1 text-[12px] w-[100px] focus:border-[#007185] outline-none shadow-inner transition-colors bg-white"
                  >
                    <option value={t('active')}>{t('active')}</option>
                    <option value={t('inactive')}>{t('inactive')}</option>
                    <option value={t('all')}>{t('all')}</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-[#565959] font-medium">{t('frequentlyInteracted')}:</span>
                  <select
                    value="All"
                    onChange={() => {}}
                    className="border border-[#888C8C] rounded-sm px-2 py-1 text-[12px] w-[120px] focus:border-[#007185] outline-none shadow-inner transition-colors bg-white"
                  >
                    <option value="All">{t('all')}</option>
                    <option value="Frequently Interacted">{t('frequentlyInteracted')}</option>
                  </select>
                </div>

                <div className="relative w-[200px]">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('search')}
                    className="border border-[#888C8C] rounded-sm pl-3 pr-8 py-2 text-[12px] w-full focus:border-[#007185] outline-none shadow-inner transition-colors bg-white"
                  />
                  <Search className="absolute right-2 top-2.5 w-4 h-4 text-gray-500" />
                </div>

                <button className="bg-[#0F1111] text-white px-3 py-2 text-[12px] font-bold rounded-sm flex items-center gap-1 hover:bg-[#232F3E] transition-colors">
                  <Search className="w-4 h-4" />
                  <span>{t('search')}</span>
                </button>

                <div className="flex items-center gap-2 ml-auto">
                  <button className="text-[#888C8C] hover:text-[#002E35] p-1 hover:bg-[#F0F2F2] rounded-sm transition-colors">
                    <span className="sr-only">{t('moreOptions')}</span>
                    <MoreHorizontal size={16} />
                  </button>
                  <button className="text-[#888C8C] hover:text-[#002E35] p-1 hover:bg-[#F0F2F2] rounded-sm transition-colors">
                    <span className="sr-only">{t('collapse')}</span>
                    <ChevronUp size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-[13px] text-left">
                <thead className="text-[12px] text-[#565959] uppercase bg-[#F7F8F8] border-b border-[#E7EAEA]">
                  <tr>
                    <th className="px-4 py-3 font-bold tracking-wider">{t('productDetails')}</th>
                    <th className="px-4 py-3 font-bold tracking-wider">{t('listingStatus')}</th>
                    <th className="px-4 py-3 text-right font-bold tracking-wider">{t('sales')}</th>
                    <th className="px-4 py-3 text-right font-bold tracking-wider">{t('unitsSold')}</th>
                    <th className="px-4 py-3 text-right font-bold tracking-wider">{t('pageViews')}</th>
                    <th className="px-4 py-3 text-right font-bold tracking-wider">{t('inventoryColumn')}</th>
                    <th className="px-4 py-3 text-right font-bold tracking-wider">{t('price')}</th>
                    <th className="px-4 py-3 text-center font-bold tracking-wider">{t('action')}</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="border-b border-[#E7EAEA] hover:bg-[#F7F8F8] transition-colors" style={{ height: '64px' }}>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-6 h-6">
                            <Star size={16} className="text-[#D5D9D9]" />
                          </div>
                          <img
                            src={p.img}
                            alt="Product"
                            className="w-[40px] h-[40px] object-contain border border-[#E7EAEA] bg-white rounded-sm"
                          />
                          <div className="flex flex-col min-w-[280px] max-w-[420px]">
                            <a
                              href="#"
                              className="text-[#007185] font-medium hover:underline hover:text-[#C7511F] truncate text-[13px] transition-colors"
                              title={p.title}
                            >
                              {p.title}
                            </a>
                            <div className="text-[12px] text-[#565959] mt-0.5 truncate">{p.sku}</div>
                            <div className="text-[12px] text-[#565959] truncate">{p.asin}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-2">
                        <span className="text-[12px] font-bold text-[#002E35]">{p.listingStatus === t('active') ? t('active') : t('inactive')}</span>
                      </td>

                      <td className="px-4 py-2 text-right font-medium">{p.sales}</td>
                      <td className="px-4 py-2 text-right font-medium">{p.unitsSold}</td>
                      <td className="px-4 py-2 text-right font-medium">{p.pageViews > 0 ? p.pageViews.toLocaleString() : "--"}</td>
                      <td className="px-4 py-2 text-right font-medium">{p.inventory}</td>
                      <td className="px-4 py-2 text-right font-bold">{p.price}</td>

                      <td className="px-4 py-2 text-center">
                        <button className="bg-white border border-[#D5D9D9] rounded-sm px-3 py-1 shadow-sm hover:bg-[#F7F8F8] flex items-center justify-center mx-auto transition-colors">
                          <ChevronDown size={10} className="text-gray-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination - Single horizontal row layout */}
            <div className="p-3 border-t border-[#E7EAEA] bg-[#F8F8F8] flex items-center justify-between gap-4">
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
              <a href="#" className="text-[#007185] text-[13px] hover:underline flex items-center gap-1 transition-colors">
                {t('goToManageInventory')} <ChevronRight size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```