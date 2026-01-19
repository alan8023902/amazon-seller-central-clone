import React, { useState, useMemo } from 'react';
import { RefreshCw, Download, Calendar, ChevronDown, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useStore } from '../store';
import { marketplaceConfigs } from '../i18n';
import { useI18n } from '../hooks/useI18n';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, 
  Tooltip, Legend, ReferenceLine 
} from 'recharts';

// Mock data generation function
const generateMockData = (startDate: Date, endDate: Date, totalUnits: number, totalSales: number) => {
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const data = [];
  
  // Seeded random for consistent results
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };
  
  // Calculate daily average
  const avgUnits = totalUnits / days;
  const avgSales = totalSales / days;
  
  // Generate data for each day
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    // Generate random fluctuations around the average
    const unitRandom = seededRandom(i + 123);
    const salesRandom = seededRandom(i + 456);
    
    // Create values with some variation
    const units = Math.round(avgUnits * (0.8 + (unitRandom * 0.4)));
    const sales = Math.round(avgSales * (0.8 + (salesRandom * 0.4)));
    
    // Generate comparison values (last year same period)
    const lastYearUnits = Math.round(units * (0.9 + (seededRandom(i + 789) * 0.2)));
    const lastYearSales = Math.round(sales * (0.9 + (seededRandom(i + 987) * 0.2)));
    
    data.push({
      date: date.toISOString().split('T')[0],
      units,
      sales,
      lastYearUnits,
      lastYearSales
    });
  }
  
  return data;
};

const BusinessReports: React.FC = () => {
  const { session } = useStore();
  const { t } = useI18n();
  const [activeView, setActiveView] = useState<'graph' | 'table'>('graph');
  
  const currencySymbol = marketplaceConfigs[session.marketplace].symbol;
  const currency = marketplaceConfigs[session.marketplace].currency;
  
  // Generate mock data for the charts
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  const endDate = new Date();
  const mockData = useMemo(() => {
    return generateMockData(startDate, endDate, 10000, 500000);
  }, []);

  // Format numbers with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };
  
  // Format currency
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(num);
  };

  return (
    <div className="max-w-full">
      {/* A. Top Banner removed */}
      
      {/* B. Page title row */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-normal text-[#0F1111]">{t('salesDashboardTitle')}</h1>
          <a href="#" className="text-sm text-[#007185] hover:underline">{t('learnMore')}</a>
        </div>
        <div className="flex space-x-3">
          <button className="h-8 px-4 border border-[#007185] bg-white text-[#007185] rounded-sm text-sm flex items-center space-x-2 hover:bg-[#F0F9F0]">
            <RefreshCw size={14} />
            <span>{t('refresh')}</span>
          </button>
          <button className="h-8 px-4 bg-[#007185] text-white rounded-sm text-sm flex items-center space-x-2 hover:bg-[#005F6B]">
            <Download size={14} />
            <span>{t('download')}</span>
          </button>
        </div>
      </div>
      
      {/* C. Business Performance Insights */}
      <div className="bg-white border border-[#D5D9D9] rounded-sm mb-6">
        <div className="p-4">
          <h2 className="text-lg font-medium text-[#0F1111] mb-3">{t('businessPerformanceInsights')}</h2>
          <p className="text-sm text-[#0F1111] mb-4">
            {t('allCaughtUp')}
          </p>
          <div className="flex justify-between items-center">
            <div></div>
            <div className="text-xs text-[#565959] flex items-center space-x-2">
              <span>{t('helpImproveExperience')}</span>
              <button className="text-xs text-[#007185] hover:underline flex items-center space-x-1">
                <ThumbsUp size={12} />
                <ThumbsDown size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* D. Filters bar */}
      <div className="bg-[#f2f3f3] border border-[#D5D9D9] rounded-sm p-4 mb-6">
        <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
          {/* Date filter */}
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-medium text-[#565959] uppercase">{t('date')}</label>
            <div className="flex items-center space-x-3">
              <select className="h-7 px-2 border border-[#D5D9D9] rounded-sm text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#007185]">
                <option>{t('custom')}</option>
                <option>{t('last30DaysReport')}</option>
                <option>{t('last90Days')}</option>
                <option>{t('last6Months')}</option>
                <option>{t('lastYear')}</option>
              </select>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Calendar size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#565959]" />
                  <input 
                    type="date" 
                    className="h-7 pl-7 pr-2 border border-[#D5D9D9] rounded-sm text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#007185]"
                    defaultValue={startDate.toISOString().split('T')[0]}
                  />
                </div>
                <span className="text-sm text-[#565959]">{t('to')}</span>
                <div className="relative">
                  <Calendar size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#565959]" />
                  <input 
                    type="date" 
                    className="h-7 pl-7 pr-2 border border-[#D5D9D9] rounded-sm text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#007185]"
                    defaultValue={endDate.toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Sales breakdown filter */}
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-medium text-[#565959] uppercase">{t('salesBreakdown')}</label>
            <select className="h-7 px-2 border border-[#D5D9D9] rounded-sm text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#007185]">
              <option>{t('marketplaceTotal')}</option>
              <option>{t('byAsin')}</option>
              <option>{t('byCategory')}</option>
              <option>{t('bySku')}</option>
            </select>
          </div>
          
          {/* Fulfillment channel filter */}
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-medium text-[#565959] uppercase">{t('fulfillmentChannel')}</label>
            <select className="h-7 px-2 border border-[#D5D9D9] rounded-sm text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#007185]">
              <option>{t('bothAmazonAndSeller')}</option>
              <option>{t('amazonFulfilled')}</option>
              <option>{t('sellerFulfilled')}</option>
            </select>
          </div>
          
          {/* Apply button */}
          <button className="h-7 px-4 bg-[#007185] text-white rounded-sm text-sm font-medium hover:bg-[#005F6B]">
            {t('apply')}
          </button>
        </div>
      </div>
      
      {/* E. Sales Snapshot */}
      <div className="bg-white border border-[#D5D9D9] rounded-sm mb-6">
        <div className="bg-[#F8F8F8] border-b border-[#D5D9D9] px-4 py-3 flex justify-between items-center">
          <h2 className="text-base font-medium text-[#0F1111]">{t('salesSnapshot')}</h2>
          <p className="text-xs text-[#565959]">{t('takenAt')} 10:30 AM PST</p>
        </div>
        <div className="grid grid-cols-5 gap-0">
          {/* Total Order Items */}
          <div className="border-r border-[#D5D9D9] p-4 text-center">
            <div className="text-xs text-[#565959] mb-2">{t('totalOrderItems')}</div>
            <div className="text-2xl font-medium text-[#0F1111]">248</div>
          </div>
          
          {/* Units Ordered */}
          <div className="border-r border-[#D5D9D9] p-4 text-center">
            <div className="text-xs text-[#565959] mb-2">{t('unitsOrdered')}</div>
            <div className="text-2xl font-medium text-[#0F1111]">{formatNumber(192260)}</div>
          </div>
          
          {/* Ordered Product Sales */}
          <div className="border-r border-[#D5D9D9] p-4 text-center">
            <div className="text-xs text-[#565959] mb-2">{t('orderedProductSales')}</div>
            <div className="text-2xl font-medium text-[#0F1111]">{formatCurrency(18657478)}</div>
          </div>
          
          {/* Avg Units/Order Item */}
          <div className="border-r border-[#D5D9D9] p-4 text-center">
            <div className="text-xs text-[#565959] mb-2">{t('avgUnitsOrderItem')}</div>
            <div className="text-2xl font-medium text-[#0F1111]">1.14</div>
          </div>
          
          {/* Avg Sales/Order Item */}
          <div className="p-4 text-center">
            <div className="text-xs text-[#565959] mb-2">{t('avgSalesOrderItem')}</div>
            <div className="text-2xl font-medium text-[#0F1111]">{formatCurrency(110.29)}</div>
          </div>
        </div>
      </div>
      
      {/* F. Compare Sales */}
      <div className="bg-[#EBF7FF] p-4 mb-6">
        <div className="bg-white border border-[#D5D9D9] rounded-sm">
          <div className="bg-[#F8F8F8] border-b border-[#D5D9D9] px-4 py-3 flex justify-between items-center">
            <h2 className="text-base font-medium text-[#0F1111]">{t('compareSales')}</h2>
            <div className="flex border border-[#D5D9D9] rounded-sm overflow-hidden">
              <button 
                className={`px-3 py-1 text-sm ${activeView === 'graph' ? 'bg-[#007185] text-white' : 'bg-white text-[#0F1111]'}`}
                onClick={() => setActiveView('graph')}
              >
                {t('graphView')}
              </button>
              <button 
                className={`px-3 py-1 text-sm ${activeView === 'table' ? 'bg-[#007185] text-white' : 'bg-white text-[#0F1111]'}`}
                onClick={() => setActiveView('table')}
              >
                {t('tableView')}
              </button>
            </div>
          </div>
          
          <div className="p-4">
            {activeView === 'graph' ? (
              <div className="grid grid-cols-2 gap-6">
                {/* Units Ordered Chart */}
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E3E6E6" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }} 
                        tickLine={{ stroke: '#D5D9D9' }}
                        axisLine={{ stroke: '#D5D9D9' }}
                        interval="preserveStartEnd"
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }} 
                        tickLine={{ stroke: '#D5D9D9' }}
                        axisLine={{ stroke: '#D5D9D9' }}
                        tickFormatter={formatNumber}
                      />
                      <Tooltip 
                        formatter={(value: number) => [formatNumber(value), 'Units']}
                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="units" 
                        stroke="#007185" 
                        strokeWidth={2} 
                        dot={false} 
                        activeDot={{ r: 6 }} 
                        name={t('currentPeriod')}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="lastYearUnits" 
                        stroke="#FF9900" 
                        strokeWidth={2} 
                        dot={false} 
                        activeDot={{ r: 6 }} 
                        name={t('lastYear')}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Ordered Product Sales Chart */}
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E3E6E6" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }} 
                        tickLine={{ stroke: '#D5D9D9' }}
                        axisLine={{ stroke: '#D5D9D9' }}
                        interval="preserveStartEnd"
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }} 
                        tickLine={{ stroke: '#D5D9D9' }}
                        axisLine={{ stroke: '#D5D9D9' }}
                        tickFormatter={(value) => `$${formatNumber(value)}`}
                      />
                      <Tooltip 
                        formatter={(value: number) => [formatCurrency(value), 'Sales']}
                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#007185" 
                        strokeWidth={2} 
                        dot={false} 
                        activeDot={{ r: 6 }} 
                        name={t('currentPeriod')}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="lastYearSales" 
                        stroke="#FF9900" 
                        strokeWidth={2} 
                        dot={false} 
                        activeDot={{ r: 6 }} 
                        name={t('lastYear')}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              // Table view placeholder
              <div className="h-[300px] flex items-center justify-center text-sm text-[#565959]">
                {t('tableViewContent')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessReports;