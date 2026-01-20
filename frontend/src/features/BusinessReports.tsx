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
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          {/* Date filter */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-bold text-[#0F1111] whitespace-nowrap">{t('date')}:</label>
            <div className="flex items-center border border-[#D5D9D9] rounded-sm bg-white overflow-hidden shadow-sm h-8">
              <select className="pl-2 pr-8 border-none text-[13px] bg-white focus:outline-none appearance-none cursor-pointer min-w-[120px] h-full">
                <option>{t('custom')}</option>
                <option>{t('last30DaysReport')}</option>
                <option>{t('last90Days')}</option>
                <option>{t('last6Months')}</option>
                <option>{t('lastYear')}</option>
              </select>
              <div className="flex items-center h-full px-2 border-l border-[#D5D9D9] bg-[#F0F2F2] pointer-events-none">
                <ChevronDown size={14} className="text-[#565959]" />
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-white border border-[#D5D9D9] rounded-sm px-2 h-8 shadow-sm">
              <div className="flex items-center h-full">
                <input
                  type="date"
                  className="h-full border-none text-[13px] bg-transparent focus:outline-none w-32"
                  defaultValue={startDate.toISOString().split('T')[0]}
                />
                <Calendar size={14} className="ml-1 text-[#565959]" />
              </div>
              <span className="text-[13px] text-[#565959]">{t('to')}</span>
              <div className="flex items-center h-full border-none">
                <input
                  type="date"
                  className="h-full border-none text-[13px] bg-transparent focus:outline-none w-32"
                  defaultValue={endDate.toISOString().split('T')[0]}
                />
                <Calendar size={14} className="ml-1 text-[#565959]" />
              </div>
            </div>
          </div>

          <div className="h-8 w-[1px] bg-[#D5D9D9] hidden md:block"></div>

          {/* Sales breakdown filter */}
          <div className="flex items-center space-x-2">
            <label className="text-[13px] font-bold text-[#0F1111] whitespace-nowrap">{t('salesBreakdown')}:</label>
            <select className="h-8 px-2 border border-[#D5D9D9] rounded-sm text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-[#007185] min-w-[150px]">
              <option>{t('marketplaceTotal')}</option>
              <option>{t('byAsin')}</option>
              <option>{t('byCategory')}</option>
              <option>{t('bySku')}</option>
            </select>
          </div>

          {/* Fulfillment channel filter */}
          <div className="flex items-center space-x-2">
            <label className="text-[13px] font-bold text-[#0F1111] whitespace-nowrap">{t('fulfillmentChannel')}:</label>
            <select className="h-8 px-2 border border-[#D5D9D9] rounded-sm text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-[#007185] min-w-[150px]">
              <option>{t('bothAmazonAndSeller')}</option>
              <option>{t('amazonFulfilled')}</option>
              <option>{t('sellerFulfilled')}</option>
            </select>
          </div>

          {/* Apply button */}
          <button className="h-8 px-6 bg-[#007185] text-white rounded-sm text-[13px] font-bold hover:bg-[#005F6B] shadow-sm ml-auto">
            {t('apply')}
          </button>
        </div>
      </div>

      {/* E. Sales Snapshot */}
      <div className="bg-white border border-[#D5D9D9] rounded-sm mb-6 overflow-hidden">
        <div className="bg-[#F8F8F8] border-b border-[#D5D9D9] px-4 py-2">
          <p className="text-[12px] text-[#0F1111]">
            {t('salesSnapshot')} {t('takenAtHeader')} 12/30/2025, 11:32:21 PM PST
          </p>
        </div>
        <div className="grid grid-cols-5 divide-x divide-transparent px-2 py-4">
          <div className="px-4 border-r border-[#D5D9D9]">
            <div className="text-[12px] text-[#565959] mb-1 leading-tight">{t('totalOrderItems')}</div>
            <div className="text-2xl font-normal text-[#0F1111] leading-none">248</div>
          </div>
          <div className="px-4 border-r border-[#D5D9D9]">
            <div className="text-[12px] text-[#565959] mb-1 leading-tight">{t('unitsOrderedHeader')}</div>
            <div className="text-2xl font-normal text-[#0F1111] leading-none">{formatNumber(192260)}</div>
          </div>
          <div className="px-4 border-r border-[#D5D9D9]">
            <div className="text-[12px] text-[#565959] mb-1 leading-tight">{t('orderedProductSalesHeader')}</div>
            <div className="text-2xl font-normal text-[#0F1111] leading-none">{formatCurrency(18657478)}</div>
          </div>
          <div className="px-4 border-r border-[#D5D9D9]">
            <div className="text-[12px] text-[#565959] mb-1 leading-tight">{t('avgUnitsOrderItem')}</div>
            <div className="text-2xl font-normal text-[#0F1111] leading-none">1.14</div>
          </div>
          <div className="px-4">
            <div className="text-[12px] text-[#565959] mb-1 leading-tight">{t('avgSalesOrderItem')}</div>
            <div className="text-2xl font-normal text-[#0F1111] leading-none">{formatCurrency(110.29)}</div>
          </div>
        </div>
      </div>

      {/* F. Compare Sales */}
      <div className="bg-white border border-[#D5D9D9] rounded-sm mb-6">
        <div className="bg-[#F8F8F8] border-b border-[#D5D9D9] px-4 py-2 flex justify-between items-center">
          <h2 className="text-[13px] font-bold text-[#0F1111]">{t('compareSales')}</h2>
          <div className="flex border border-[#D5D9D9] rounded-sm overflow-hidden bg-white shadow-sm">
            <button
              className={`px-3 py-1 text-[13px] ${activeView === 'graph' ? 'bg-[#007185] text-white' : 'text-[#0F1111] hover:bg-gray-50'}`}
              onClick={() => setActiveView('graph')}
            >
              {t('graphView')}
            </button>
            <button
              className={`px-3 py-1 text-[13px] border-l border-[#D5D9D9] ${activeView === 'table' ? 'bg-[#007185] text-white' : 'text-[#0F1111] hover:bg-gray-50'}`}
              onClick={() => setActiveView('table')}
            >
              {t('tableView')}
            </button>
          </div>
        </div>

        <div className="p-0 bg-[#E7F4F4]">
          {activeView === 'graph' ? (
            <div className="flex flex-col">
              {/* Stats Bar */}
              <div className="flex border-b border-[#D5D9D9] px-6 py-4 items-center">
                <div className="flex flex-col pr-8 border-r border-[#D5D9D9] min-w-[100px]">
                  <span className="text-[16px] font-bold text-[#0F1111]">Compare</span>
                  <span className="text-[12px] text-[#007185] cursor-pointer hover:underline">What's this?</span>
                </div>
                <div className="flex items-center px-8 space-x-3">
                  <div className="flex h-5 items-center">
                    <input type="checkbox" checked readOnly className="h-4 w-4 text-[#007185] border-[#D5D9D9] rounded-sm cursor-pointer" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] text-[#007185] font-bold leading-tight">Selected date range</span>
                    <span className="text-[13px] text-[#0F1111] font-bold leading-tight">174,714 Units</span>
                    <span className="text-[13px] text-[#0F1111] font-bold leading-tight">$19,701,989.13</span>
                  </div>
                </div>
                <div className="mx-8 h-10 w-[1px] bg-[#D5D9D9]"></div>
                <div className="flex items-center px-2 flex-grow">
                  {/* Spacing or other blocks */}
                </div>
              </div>

              {/* Chart Section */}
              <div className="px-8 py-10">
                <div className="h-[300px] w-full bg-[#E7F4F4]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockData} margin={{ top: 10, right: 30, left: 30, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="0" vertical={false} stroke="#D5D9D9" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 13, fill: '#0F1111' }}
                        tickLine={false}
                        axisLine={{ stroke: '#D5D9D9' }}
                        dy={10}
                      />
                      <YAxis
                        tick={{ fontSize: 13, fill: '#0F1111' }}
                        tickLine={false}
                        axisLine={false}
                        label={{ value: 'Units ordered', angle: -90, position: 'outsideLeft', offset: -25, fontSize: 13, fill: '#0F1111' }}
                      />
                      <Tooltip
                        contentStyle={{ fontSize: '12px', borderRadius: '2px', border: '1px solid #D5D9D9' }}
                        formatter={(value: number) => [formatNumber(value), 'Units']}
                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                      />
                      <Line
                        type="linear"
                        dataKey="units"
                        stroke="#008296"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: '#008296' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Legend Block */}
              <div className="px-8 pb-10 flex space-x-12">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 mt-1 border border-[#D5D9D9] bg-white flex items-center justify-center p-[2px]">
                    <div className="w-full h-full bg-[#008296]"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[14px] font-bold text-[#0F1111]">Selected date range</span>
                    <span className="text-[13px] text-[#565959]">12/30/2025 - 01/01/2026</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 mt-1 border border-[#D5D9D9] bg-white flex items-center justify-center p-[2px]">
                    <div className="w-full h-[2px] bg-[#FF9900]"></div>
                  </div>
                  <div className="flex flex-col text-[#565959] opacity-70">
                    <span className="text-[14px] font-bold">Compare to: None selected</span>
                  </div>
                </div>
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
  );
};

export default BusinessReports;