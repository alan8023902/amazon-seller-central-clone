
import React, { useState } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  ChevronDown, RefreshCw
} from 'lucide-react';
import { Button } from '../components/UI';
import { useStore } from '../store';
import { marketplaceConfigs } from '../i18n';
import { useI18n } from '../hooks/useI18n';
import { cn } from '../utils/cn';

const BusinessReports: React.FC = () => {
  const { dashboard, session } = useStore();
  const { t } = useI18n();
  const [viewMode, setViewMode] = useState<'graph' | 'table'>('graph');
  const [dateRange, setDateRange] = useState('Today');
  
  const currentMkt = (marketplaceConfigs as any)[session.marketplace] || marketplaceConfigs['United States'];
  const currencySymbol = currentMkt.currency;

  const menuTree = [
    { title: 'Dashboards', items: [t('salesDashboard')], active: true },
    { title: 'By Date', items: ['Sales and Traffic', 'Detail Page Sales and Traffic', 'Seller Performance'] },
    { title: 'By ASIN', items: ['Detail Page Sales and Traffic', 'Detail Page Sales and Traffic by Parent Item', 'Detail Page Sales and Traffic by Child Item'] },
    { title: 'Other', items: ['Sales and Orders by Month'] },
  ];

  const asinTabs = [
    { id: 'decliningSales', label: t('decliningSales') },
    { id: 'increasingSales', label: t('increasingSales') },
    { id: 'decliningTraffic', label: t('decliningTraffic') },
    { id: 'belowMarket', label: t('belowMarket') },
    { id: 'topSales', label: t('topSales') }
  ];

  return (
    <div className="flex gap-6 animate-in fade-in duration-500 pb-20">
      {/* Sidebar - Report Tree */}
      <aside className="w-64 shrink-0 hidden lg:block">
        <div className="bg-white border border-amazon-border rounded-sm shadow-sm overflow-hidden sticky top-32">
          <div className="bg-gray-100 px-4 py-2 border-b border-amazon-border text-[10px] font-black uppercase tracking-widest text-gray-500">
            {t('reports')}
          </div>
          <div className="py-2">
            {menuTree.map((section, idx) => (
              <div key={idx} className="mb-2">
                <div className="px-4 py-1 text-[11px] font-black uppercase text-amazon-teal/80 tracking-tight">
                  {section.title}
                </div>
                {section.items.map(item => (
                  <div 
                    key={item} 
                    className={cn(
                      "px-6 py-2 text-xs-amz cursor-pointer hover:bg-gray-50 flex justify-between items-center group",
                      (item === t('salesDashboard') || item === 'Sales Dashboard') ? "bg-blue-50/50 text-amazon-teal font-bold border-l-[3px] border-amazon-teal" : "text-gray-600"
                    )}
                  >
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Title & Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-amazon-text tracking-tight">{t('salesDashboard')}</h1>
            <a href="#" className="text-xs-amz text-amazon-link hover:underline">{t('learnMore')}</a>
          </div>
          <div className="flex items-center gap-2">
             <button className="flex items-center gap-1.5 border border-gray-300 bg-white px-3 py-1 text-xs-amz rounded-sm hover:bg-gray-50 shadow-sm font-bold transition-colors">
               <RefreshCw size={12} className="text-gray-500" /> {t('refresh')}
             </button>
             <button className="flex items-center gap-1.5 border border-gray-300 bg-white px-3 py-1 text-xs-amz rounded-sm hover:bg-gray-50 shadow-sm font-bold transition-colors">
               {t('download')} <ChevronDown size={12} className="text-gray-400" />
             </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-gray-100 p-4 border border-amazon-border rounded-sm flex flex-wrap items-end gap-4 shadow-sm">
           <div className="flex flex-col gap-1">
              <label className="text-[11px] font-black text-gray-500 uppercase">{t('date')}</label>
              <div className="relative">
                <select 
                  className="bg-white border border-gray-300 rounded-sm px-3 py-1.5 text-xs-amz font-bold pr-10 appearance-none min-w-[180px] shadow-inner outline-none focus:border-amazon-teal"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option>Today - 1/3/2026</option>
                  <option>Yesterday - 1/2/2026</option>
                  <option>Week to date</option>
                  <option>Month to date</option>
                  <option>Year to date</option>
                  <option value="Custom">Custom</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
              </div>
           </div>
           
           <div className="flex flex-col gap-1">
              <label className="text-[11px] font-black text-gray-500 uppercase">{t('salesBreakdown')}</label>
              <div className="relative">
                <select className="bg-white border border-gray-300 rounded-sm px-3 py-1.5 text-xs-amz font-bold pr-10 appearance-none min-w-[180px] shadow-inner outline-none focus:border-amazon-teal">
                  <option>Marketplace total</option>
                  <option>Amazon</option>
                  <option>Non-Amazon</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
              </div>
           </div>

           <Button className="w-auto px-6 h-8.5 font-bold shadow-md">{t('apply')}</Button>
        </div>

        {/* Sales Snapshot Metrics */}
        <div className="bg-white border border-amazon-border rounded-sm shadow-sm overflow-hidden">
           <div className="px-4 py-2 border-b border-amazon-border bg-gray-50/50">
              <h2 className="text-base font-bold text-amazon-text tracking-tight">Sales Snapshot</h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-5 divide-x divide-gray-100">
              <div className="p-4">
                 <div className="text-[11px] text-gray-500 font-bold mb-1">{t('totalOrderItems')}</div>
                 <div className="text-xl font-black">248</div>
              </div>
              <div className="p-4">
                 <div className="text-[11px] text-gray-500 font-bold mb-1">{t('unitsOrdered')}</div>
                 <div className="text-xl font-black">192,260</div>
              </div>
              <div className="p-4">
                 <div className="text-[11px] text-gray-500 font-bold mb-1">{t('orderedProductSales')}</div>
                 <div className="text-xl font-black">{currencySymbol}18,657,478.98</div>
              </div>
              <div className="p-4">
                 <div className="text-[11px] text-gray-500 font-bold mb-1">{t('avgUnitsOrderItem')}</div>
                 <div className="text-xl font-black">1.14</div>
              </div>
              <div className="p-4">
                 <div className="text-[11px] text-gray-500 font-bold mb-1">{t('avgSalesOrderItem')}</div>
                 <div className="text-xl font-black">{currencySymbol}110.29</div>
              </div>
           </div>
        </div>

        {/* Comparison Chart */}
        <div className="bg-white border border-amazon-border rounded-sm shadow-sm overflow-hidden">
           <div className="px-4 py-2 border-b border-amazon-border flex justify-between items-center bg-gray-50/50">
              <h2 className="text-base font-bold text-amazon-text">{t('compareSales')}</h2>
              <div className="flex bg-white border border-gray-300 rounded-sm overflow-hidden">
                <button 
                  onClick={() => setViewMode('graph')}
                  className={cn("px-3 py-1 text-[11px] font-bold border-r transition-colors", viewMode === 'graph' ? "bg-amazon-teal text-white border-amazon-teal" : "text-gray-600 hover:bg-gray-50")}
                >{t('graphView')}</button>
                <button 
                  onClick={() => setViewMode('table')}
                  className={cn("px-3 py-1 text-[11px] font-bold transition-colors", viewMode === 'table' ? "bg-amazon-teal text-white border-amazon-teal" : "text-gray-600 hover:bg-gray-50")}
                >{t('tableView')}</button>
              </div>
           </div>
           
           <div className="p-6">
             {viewMode === 'graph' ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dashboard.salesHistory}>
                      <defs>
                        <linearGradient id="colorToday" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#007185" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#007185" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="time" fontSize={10} axisLine={false} tickLine={false} dy={10} stroke="#565959" />
                      <YAxis fontSize={10} axisLine={false} tickLine={false} dx={-5} stroke="#565959" />
                      <Tooltip 
                        contentStyle={{ borderRadius: '2px', border: '1px solid #d5d9d9', fontSize: '11px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                      />
                      <Area type="monotone" dataKey="today" name="This Year" stroke="#007185" strokeWidth={2} fillOpacity={1} fill="url(#colorToday)" />
                      <Area type="monotone" dataKey="lastYear" name="Last Year" stroke="#f0c14b" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
             ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs-amz text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b font-black uppercase text-[10px] tracking-widest text-gray-500">
                        <th className="px-4 py-3">Time Period</th>
                        <th className="px-4 py-3 text-right">This Year Sales</th>
                        <th className="px-4 py-3 text-right">Last Year Sales</th>
                        <th className="px-4 py-3 text-right">Growth %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {dashboard.salesHistory.map(row => (
                        <tr key={row.time} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-bold">{row.time}</td>
                          <td className="px-4 py-3 text-right">{currencySymbol}{row.today.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right">{currencySymbol}{row.lastYear.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right text-amazon-success font-bold">
                            {(((row.today - row.lastYear) / row.lastYear) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             )}
           </div>
        </div>

        {/* ASIN Performance Deep Dive */}
        <div className="space-y-3 pt-6">
           <div className="flex items-center justify-between px-1">
             <h2 className="text-lg font-bold text-amazon-text uppercase tracking-tight">{t('deepDiveAsin')}</h2>
             <button className="text-xs-amz text-amazon-link hover:underline font-bold">{t('hideAsins')}</button>
           </div>
           
           <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {asinTabs.map((tab, idx) => (
                <button 
                  key={tab.id} 
                  className={cn(
                    "px-4 py-1.5 rounded-full border text-[11px] font-bold whitespace-nowrap transition-all",
                    idx === 0 ? "bg-amazon-teal text-white border-amazon-teal" : "bg-white text-gray-600 border-gray-300 hover:border-amazon-teal"
                  )}
                >
                  {tab.label}
                </button>
              ))}
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dashboard.inventory.slice(0, 2).map(item => (
                <div key={item.id} className="bg-white border border-amazon-border rounded-sm p-4 flex gap-4 shadow-sm group hover:shadow-md transition-all">
                  <div className="w-20 h-20 bg-gray-50 border rounded-sm flex items-center justify-center shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs-amz font-bold text-amazon-link hover:underline truncate mb-1">{item.name}</h3>
                    <div className="text-[10px] text-gray-400 font-bold mb-3 uppercase tracking-tight">ASIN: {item.asin}</div>
                    <div className="text-xs-amz text-gray-600 leading-snug mb-4">
                      Recent metrics indicate performance changes for this item in the {session.marketplace} marketplace.
                    </div>
                    <Button variant="white" className="w-auto px-6 h-7 text-[11px] font-black uppercase tracking-widest shadow-sm">View Details</Button>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessReports;
