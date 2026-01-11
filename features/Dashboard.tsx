import React, { useMemo, useState } from 'react';
import { Search, MoreHorizontal, ChevronRight, ChevronDown, Star } from 'lucide-react';

// ==================== Mock Data ====================
const ACTIONS = [
  { title: "Shipment performance", sub: "1 total in last 120 days", count: null },
  { title: "Ship orders", sub: "10 orders to confirm or ship", count: 10 },
  { title: "Review open returns", sub: "2 requests", count: 2 },
  { title: "Fix stranded inventory", sub: "186 total stranded", count: null },
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
    title: "[Built-in Apps] 5G WiFi Bluetooth Projector 4k Supported",
    sku: "SKU: TYX-PJ-5GWIFI",
    asin: "ASIN: B09X1Z342K",
    listingStatus: "Active",
    sales: "$7,132",
    unitsSold: 215,
    pageViews: 3175,
    inventory: "381 FBA",
    price: "$38.98",
    img: "https://m.media-amazon.com/images/I/61s+N9rK-xL._AC_UY218_.jpg",
  },
  {
    id: 2,
    title: "Mini Projector for iPhone, 1080P Supported Portable",
    sku: "SKU: PJ-MINI-1080P",
    asin: "ASIN: B08W5F4291",
    listingStatus: "Active",
    sales: "$6,568",
    unitsSold: 59,
    pageViews: 3059,
    inventory: "437 FBA",
    price: "$118.98",
    img: "https://m.media-amazon.com/images/I/71tJkM8vDVL._AC_UY218_.jpg",
  },
  {
    id: 3,
    title: "Projector with WiFi & Bluetooth, 4K Support",
    sku: "SKU: PJ-WIFI-BT-4K",
    asin: "ASIN: B09Y5Z123X",
    listingStatus: "Active",
    sales: "$5,773",
    unitsSold: 168,
    pageViews: 2693,
    inventory: "139 FBA",
    price: "$29.98",
    img: "https://m.media-amazon.com/images/I/81M51+d85EL._AC_UY218_.jpg",
  },
  {
    id: 4,
    title: "Mini Projector with WiFi, Portable Outdoor",
    sku: "SKU: PJ-OUTDOOR-MINI",
    asin: "ASIN: B07Z123456",
    listingStatus: "Active",
    sales: "$4,594",
    unitsSold: 132,
    pageViews: 3454,
    inventory: "472 FBA",
    price: "$29.98",
    img: "https://m.media-amazon.com/images/I/51p+sM-iXRL._AC_UY218_.jpg",
  },
  {
    id: 5,
    title: "[Built-in Apps] 5G WiFi Bluetooth Projector",
    sku: "SKU: PJ-APPS-5G",
    asin: "ASIN: B08X987654",
    listingStatus: "Active",
    sales: "$3,166",
    unitsSold: 92,
    pageViews: 1357,
    inventory: "81 FBA",
    price: "$37.98",
    img: "https://m.media-amazon.com/images/I/61f8g9h0iJL._AC_UY218_.jpg",
  },
];

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
        className="bg-[#F0F2F2] border border-amazon-border text-[12px] font-bold rounded-sm px-3 py-1.5 pr-8 shadow-sm hover:bg-[#E3E6E6] cursor-pointer appearance-none outline-none focus:border-amazon-teal transition-colors"
      >
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={12} className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
    </div>
  );
}

// ==================== Dashboard ====================
export default function Dashboard() {
  const [statusFilter, setStatusFilter] = useState("Active");
  const [freqFilter, setFreqFilter] = useState("Frequently interacted");
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => {
      const statusOk = statusFilter === "All" ? true : p.listingStatus === statusFilter;
      const q = query.trim().toLowerCase();
      const queryOk = !q ? true : (p.title.toLowerCase().includes(q) || p.asin.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
      return statusOk && queryOk;
    });
  }, [statusFilter, query]);

  return (
    <div className="animate-fade-in">

      {/* ==================== Main (2 columns) ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5">

        {/* ========== LEFT ========== */}
        <div className="flex flex-col gap-4">

          {/* Actions */}
          <div className="bg-white border border-amazon-border rounded-sm shadow-sm">
            <div className="p-3 border-b border-amazon-border flex justify-between items-center bg-[#F8F8F8]">
              <h3 className="font-bold text-amazon-text text-sm-amz">Actions</h3>
              <span className="bg-black text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">4</span>
            </div>
            <div>
              {ACTIONS.map((action, idx) => (
                <div
                  key={idx}
                  className="p-3 border-b border-gray-100 last:border-0 hover:bg-amazon-hoverRow cursor-pointer flex justify-between items-center group transition-colors"
                >
                  <div>
                    <div className="text-amazon-link text-sm-amz font-medium group-hover:underline">{action.title}</div>
                    <div className="text-xs text-amazon-secondaryText mt-0.5">{action.sub}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {action.count ? <span className="font-bold text-sm-amz">{action.count}</span> : null}
                    <MoreHorizontal size={16} className="text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Communications */}
          <div className="bg-white border border-amazon-border rounded-sm shadow-sm">
            <div className="p-3 border-b border-amazon-border bg-[#F8F8F8]">
              <h3 className="font-bold text-amazon-text text-sm-amz">Communications</h3>
            </div>

            <div className="p-3 hover:bg-amazon-hoverRow cursor-pointer border-b border-gray-100 transition-colors">
              <div className="flex justify-between text-[10px] text-amazon-secondaryText mb-1">
                <span className="font-bold uppercase tracking-wider">Seller Forums</span>
                <span>2h ago</span>
              </div>
              <div className="text-amazon-link text-sm-amz hover:underline">How to handle return requests for FBA?</div>
            </div>

            <div className="p-3 hover:bg-amazon-hoverRow cursor-pointer transition-colors">
              <div className="flex justify-between text-[10px] text-amazon-secondaryText mb-1">
                <span className="font-bold uppercase tracking-wider">Seller News</span>
                <span>1d ago</span>
              </div>
              <div className="text-amazon-link text-sm-amz hover:underline">New FBA storage fees update for 2024</div>
            </div>
          </div>

        </div>

        {/* ========== RIGHT ========== */}
        <div className="flex flex-col gap-5">

          {/* ==================== Global Snapshot (Real-like multi columns) ==================== */}
          <div className="bg-white border border-amazon-border rounded-sm shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-amazon-border bg-[#F8F8F8] flex items-center justify-between">
              <div className="font-bold text-amazon-text text-sm-amz">Global Snapshot</div>
              <div className="text-[11px] text-amazon-secondaryText font-medium">Today so far</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
              {/* Sales */}
              <div className="p-4 border-b md:border-b-0 md:border-r border-gray-100">
                <div className="text-[11px] text-amazon-secondaryText font-bold uppercase tracking-wider">Sales</div>
                <div className="text-[18px] font-black text-amazon-text mt-1">$569.72</div>
                <TinySparkline />
              </div>

              {/* Open Orders */}
              <div className="p-4 border-b md:border-b-0 md:border-r border-gray-100">
                <div className="text-[11px] text-amazon-secondaryText font-bold uppercase tracking-wider">Open Orders</div>
                <div className="text-[18px] font-black text-amazon-text mt-1">49</div>
                <div className="mt-2 text-[11px] text-amazon-secondaryText space-y-1">
                  <div className="flex justify-between"><span>FBM Unshipped</span><span className="text-amazon-text font-bold">10</span></div>
                  <div className="flex justify-between"><span>FBM Pending</span><span className="text-amazon-text font-bold">2</span></div>
                  <div className="flex justify-between"><span>FBA Pending</span><span className="text-amazon-text font-bold">37</span></div>
                </div>
              </div>

              {/* Buyer Messages */}
              <div className="p-4 border-b md:border-b-0 md:border-r border-gray-100">
                <div className="text-[11px] text-amazon-secondaryText font-bold uppercase tracking-wider">Buyer Messages</div>
                <div className="text-[18px] font-black text-amazon-text mt-1">0</div>
                <div className="text-[11px] text-amazon-secondaryText mt-2">Cases requiring attention</div>
              </div>

              {/* Featured Offer */}
              <div className="p-4 border-b md:border-b-0 md:border-r border-gray-100">
                <div className="text-[11px] text-amazon-secondaryText font-bold uppercase tracking-wider">Featured Offer %</div>
                <div className="text-[18px] font-black text-amazon-text mt-1">96%</div>
                <div className="text-[11px] text-amazon-secondaryText mt-2">Top ASIN count</div>
              </div>

              {/* Seller Feedback */}
              <div className="p-4">
                <div className="text-[11px] text-amazon-secondaryText font-bold uppercase tracking-wider">Seller Feedback</div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className="fill-[#f3a847] text-[#f3a847]" />
                    ))}
                  </div>
                  <div className="text-[18px] font-black text-amazon-text">4.60</div>
                </div>
                <div className="text-[11px] text-amazon-secondaryText mt-2">Global Promotions Sales</div>
              </div>
            </div>

            {/* Bottom rows */}
            <div className="grid grid-cols-1 md:grid-cols-3 border-t border-amazon-border bg-white">
              <div className="p-3 border-b md:border-b-0 md:border-r border-gray-100">
                <div className="text-[11px] text-amazon-secondaryText">Ad Sales</div>
                <div className="text-sm-amz font-bold text-amazon-text">$0.00</div>
              </div>
              <div className="p-3 border-b md:border-b-0 md:border-r border-gray-100">
                <div className="text-[11px] text-amazon-secondaryText">Ad Impressions</div>
                <div className="text-sm-amz font-bold text-amazon-text">0</div>
              </div>
              <div className="p-3">
                <div className="text-[11px] text-amazon-secondaryText">Inventory Performance Index</div>
                <div className="text-sm-amz font-bold text-amazon-text">407</div>
              </div>
            </div>
          </div>

          {/* ==================== Product Performance (Real-like) ==================== */}
          <div className="bg-white border border-amazon-border rounded-sm shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-amazon-border bg-[#F8F8F8] flex items-center justify-between">
              <div className="font-bold text-amazon-text text-sm-amz">Product Performance</div>

              <div className="flex items-center gap-2">
                <SelectMini value={statusFilter} onChange={setStatusFilter} options={["Active", "Inactive", "All"]} />
                <SelectMini value={freqFilter} onChange={setFreqFilter} options={["Frequently interacted", "All products"]} />

                <div className="relative">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search"
                    className="border border-[#888C8C] rounded-sm pl-3 pr-8 py-1.5 text-xs-amz w-[200px] focus:border-amazon-teal outline-none shadow-inner transition-colors bg-white"
                  />
                  <Search className="absolute right-2 top-2 w-3.5 h-3.5 text-gray-500" />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm-amz text-left">
                <thead className="text-[11px] text-amazon-secondaryText uppercase bg-[#F8F8F8] border-b border-amazon-border">
                  <tr>
                    <th className="px-4 py-2.5 font-black tracking-wider">Product details</th>
                    <th className="px-4 py-2.5 font-black tracking-wider">Listing status</th>
                    <th className="px-4 py-2.5 text-right font-black tracking-wider">Sales</th>
                    <th className="px-4 py-2.5 text-right font-black tracking-wider">Units sold</th>
                    <th className="px-4 py-2.5 text-right font-black tracking-wider">Page views</th>
                    <th className="px-4 py-2.5 text-right font-black tracking-wider">Inventory</th>
                    <th className="px-4 py-2.5 text-right font-black tracking-wider">Price</th>
                    <th className="px-4 py-2.5 text-center font-black tracking-wider">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="border-b border-gray-100 hover:bg-amazon-hoverRow transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.img}
                            alt="Product"
                            className="w-[50px] h-[50px] object-contain border border-gray-200 bg-white rounded-sm"
                          />
                          <div className="flex flex-col min-w-[280px] max-w-[420px]">
                            <a
                              href="#"
                              className="text-amazon-link font-medium hover:underline hover:text-[#C7511F] truncate text-sm-amz transition-colors"
                              title={p.title}
                            >
                              {p.title}
                            </a>
                            <div className="text-[11px] text-amazon-secondaryText mt-0.5 truncate">{p.sku}</div>
                            <div className="text-[11px] text-amazon-secondaryText truncate">{p.asin}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="text-xs-amz font-black text-amazon-success">Active</span>
                      </td>

                      <td className="px-4 py-3 text-right font-medium">{p.sales}</td>
                      <td className="px-4 py-3 text-right font-medium">{p.unitsSold}</td>
                      <td className="px-4 py-3 text-right font-medium">{p.pageViews.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-medium">{p.inventory}</td>
                      <td className="px-4 py-3 text-right font-bold">{p.price}</td>

                      <td className="px-4 py-3 text-center">
                        <button className="bg-white border border-amazon-border rounded-sm px-3 py-1 shadow-sm hover:bg-amazon-hoverRow flex items-center justify-center mx-auto transition-colors">
                          <span className="text-[11px] font-bold">Actions</span>
                          <ChevronDown size={10} className="ml-1 text-gray-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 text-center border-t border-amazon-border bg-[#FAFAFA]">
              <a href="#" className="text-amazon-link text-xs-amz font-bold hover:underline flex items-center justify-center gap-1 transition-colors">
                Go to Manage All Inventory <ChevronRight size={12} />
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
