import React, { useState } from 'react';
import { useI18n } from '../hooks/useI18n';
import {
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Copy,
  ChevronDown,
  Calendar,
  Check
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { cn } from '../utils/cn';

const BusinessReports: React.FC = () => {
  const { t, formatCurrency, formatNumber } = useI18n();
  const [activeView, setActiveView] = useState<'graph' | 'table'>('graph');

  // Example data that would normally come from an API
  const snapshotData = {
    totalOrderItems: "154,066",
    unitsOrdered: "174,714",
    orderedProductSales: "$19,701,989.13",
    avgUnitsPerOrder: "1.13",
    avgSalesPerOrder: "$127.88",
    timestamp: "12/30/2025, 11:32:21 PM PST"
  };

  const chartData = [
    { name: "Jan '25", units: 400, sales: 35000, lastYearUnits: 350, lastYearSales: 32000 },
    { name: "Feb '25", units: 300, sales: 28000, lastYearUnits: 280, lastYearSales: 25000 },
    { name: "Mar '25", units: 500, sales: 42000, lastYearUnits: 450, lastYearSales: 38000 },
    { name: "Apr '25", units: 450, sales: 38000, lastYearUnits: 420, lastYearSales: 35000 },
    { name: "May '25", units: 600, sales: 55000, lastYearUnits: 580, lastYearSales: 52000 },
    { name: "Jun '25", units: 800, sales: 72000, lastYearUnits: 750, lastYearSales: 68000 },
    { name: "Jul '25", units: 700, sales: 65000, lastYearUnits: 680, lastYearSales: 62000 },
    { name: "Aug '25", units: 650, sales: 58000, lastYearUnits: 600, lastYearSales: 55000 },
    { name: "Sep '25", units: 750, sales: 68000, lastYearUnits: 720, lastYearSales: 65000 },
    { name: "Oct '25", units: 900, sales: 82000, lastYearUnits: 850, lastYearSales: 78000 },
    { name: "Nov '25", units: 850, sales: 78000, lastYearUnits: 800, lastYearSales: 72000 },
    { name: "Dec '25", units: 1000, sales: 95000, lastYearUnits: 950, lastYearSales: 90000 },
    { name: "Jan '26", units: 800, sales: 80000, lastYearUnits: 780, lastYearSales: 76000 },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans antialiased text-[#232F3E]">
      <div className="max-w-[1550px] mx-auto pt-6 px-6">

        {/* HEADER SECTION (Top Bar) */}
        <div className="h-[50px] bg-white border-b border-gray-200 flex items-center justify-between px-6 mb-4 rounded-t-[3px]">
          <div className="flex items-baseline space-x-2">
            <h1 className="text-[24px] font-bold">{t('salesDashboardTitle')}</h1>
            <a href="#" className="text-[14px] text-[#008296] hover:underline">{t('learnMore')}</a>
          </div>
          <div className="flex space-x-2">
            <button className="w-[80px] h-8 bg-white border border-[#D5D9D9] text-[#565959] text-[13px] rounded-[3px] hover:bg-[#F7FAFA] shadow-sm flex items-center justify-center">
              {t('refresh')}
            </button>
            <button className="w-[80px] h-8 bg-[#008296] text-white text-[13px] font-medium rounded-[3px] hover:bg-[#007185] shadow-sm flex items-center justify-center">
              {t('download')}
            </button>
          </div>
        </div>

        {/* BUSINESS PERFORMANCE INSIGHTS SECTION */}
        <div className="bg-white p-5 mb-4 shadow-[0_1px_3px_rgba(0,0,0,0.1)] rounded-[3px] flex justify-between relative">
          <div className="flex items-start space-x-3">
            <Sparkles size={18} className="text-[#008296] mt-1" />
            <div>
              <h2 className="text-[14px] font-bold">{t('businessPerformanceInsights')}</h2>
              <p className="text-[13px] text-[#565959]">{t('allCaughtUp')}</p>
            </div>
          </div>
          <div className="absolute bottom-4 right-5 flex items-center space-x-3 text-[13px] text-[#565959]">
            <span>{t('helpImproveExperience')}</span>
            <div className="flex space-x-2 border-l pl-3">
              <ThumbsUp size={16} className="cursor-pointer hover:text-[#008296]" />
              <ThumbsDown size={16} className="cursor-pointer hover:text-[#008296]" />
              <Copy size={16} className="cursor-pointer hover:text-[#008296]" />
            </div>
          </div>
        </div>

        {/* FILTER BAR SECTION */}
        <div className="bg-[#EBEDED] px-6 py-4 mb-4 border-y border-gray-200">
          <div className="flex items-end gap-6 mb-3">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold text-[#565959] uppercase tracking-wider">{t('date')}</label>
              <div className="relative">
                <select className="w-[140px] pl-3 pr-8 py-1.5 bg-white border border-[#D5D9D9] text-[13px] rounded-[3px] appearance-none focus:border-[#008296] focus:ring-1 focus:ring-[#008296] outline-none shadow-sm">
                  <option>{t('custom')}</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#565959] pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold text-[#565959] uppercase tracking-wider">{t('salesBreakdown')}</label>
              <div className="relative">
                <select className="w-[180px] pl-3 pr-8 py-1.5 bg-white border border-[#D5D9D9] text-[13px] rounded-[3px] appearance-none focus:border-[#008296] focus:ring-1 focus:ring-[#008296] outline-none shadow-sm">
                  <option>{t('marketplaceTotal')}</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#565959] pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold text-[#565959] uppercase tracking-wider">{t('fulfillmentChannel')}</label>
              <div className="relative">
                <select className="w-[220px] pl-3 pr-8 py-1.5 bg-white border border-[#D5D9D9] text-[13px] rounded-[3px] appearance-none focus:border-[#008296] focus:ring-1 focus:ring-[#008296] outline-none shadow-sm">
                  <option>{t('bothAmazonAndSeller')}</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#565959] pointer-events-none" />
              </div>
            </div>

            <button className="h-[32px] px-6 bg-[#008296] text-white text-[13px] font-bold rounded-[3px] hover:bg-[#007185] shadow-sm">
              {t('apply')}
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white px-3 py-1.5 border border-[#D5D9D9] rounded-[3px] shadow-sm w-[150px]">
              <Calendar size={14} className="text-[#565959]" />
              <span className="text-[13px]">12/31/2024</span>
            </div>
            <div className="flex items-center space-x-2 bg-white px-3 py-1.5 border border-[#D5D9D9] rounded-[3px] shadow-sm w-[150px]">
              <Calendar size={14} className="text-[#565959]" />
              <span className="text-[13px]">12/31/2025</span>
            </div>
          </div>
        </div>

        {/* SALES SNAPSHOT SECTION */}
        <div className="mb-6">
          <div className="flex items-baseline space-x-2 mb-2">
            <h2 className="text-[18px] font-bold">{t('salesSnapshot')}</h2>
            <span className="text-[12px] text-[#565959]">{t('takenAt')} {snapshotData.timestamp}</span>
          </div>

          <div className="bg-white p-6 border-[2px] border-dashed border-[#FF6B6B] rounded-[8px] shadow-sm">
            <div className="grid grid-cols-5 gap-8">
              <div className="flex flex-col">
                <span className="text-[12px] text-[#565959] mb-1">{t('totalOrderItems')}</span>
                <span className="text-[24px] font-bold">{snapshotData.totalOrderItems}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] text-[#565959] mb-1">{t('unitsOrdered')}</span>
                <span className="text-[24px] font-bold">{snapshotData.unitsOrdered}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] text-[#565959] mb-1">{t('orderedProductSales')}</span>
                <span className="text-[24px] font-bold">{snapshotData.orderedProductSales}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] text-[#565959] mb-1">{t('avgUnitsOrderItem')}</span>
                <span className="text-[24px] font-bold">{snapshotData.avgUnitsPerOrder}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] text-[#565959] mb-1">{t('avgSalesOrderItem')}</span>
                <span className="text-[24px] font-bold">{snapshotData.avgSalesPerOrder}</span>
              </div>
            </div>
          </div>
        </div>

        {/* COMPARE SALES SECTION */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-[18px] font-bold">{t('compareSales')}</h2>
              <span className="text-[13px] text-[#FF6B6B] font-medium">(红色中文注释)</span>
            </div>
            <div className="flex border border-[#D5D9D9] rounded-[3px] overflow-hidden bg-white shadow-sm h-8">
              <button
                className={cn(
                  "px-4 text-[13px] font-bold border-r border-[#D5D9D9]",
                  activeView === 'graph' ? "bg-[#F0F2F2]" : "bg-white text-[#565959] hover:bg-[#F7FAFA]"
                )}
                onClick={() => setActiveView('graph')}
              >
                {t('graphView')}
              </button>
              <button
                className={cn(
                  "px-4 text-[13px]",
                  activeView === 'table' ? "bg-[#F0F2F2] font-bold" : "bg-white text-[#565959] hover:bg-[#F7FAFA]"
                )}
                onClick={() => setActiveView('table')}
              >
                {t('tableView')}
              </button>
            </div>
          </div>

          {activeView === 'graph' ? (
            <div className="grid grid-cols-2 gap-4">
              {/* LEFT CHART */}
              <div className="bg-white p-6 shadow-sm rounded-[3px] border border-gray-100 flex flex-col">
                <div className="flex h-full">
                  <div className="w-[40px] flex items-center justify-center">
                    <span className="text-[11px] uppercase text-[#565959] font-normal transform -rotate-90 whitespace-nowrap">
                      {t('unitsOrdered')}
                    </span>
                  </div>
                  <div className="flex-1 h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEEEEE" />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11, fill: '#565959' }}
                          dy={10}
                          interval={2}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11, fill: '#565959' }}
                          domain={[0, 1000]}
                          ticks={[0, 250, 500, 750, 1000]}
                        />
                        <Tooltip
                          formatter={(value: number) => [formatNumber(value), t('unitsOrdered')]}
                        />
                        <Line type="monotone" dataKey="units" stroke="#008296" strokeWidth={2} dot={false} activeDot={{ r: 4 }} name="Current" />
                        <Line type="monotone" dataKey="lastYearUnits" stroke="#E3E6E6" strokeWidth={2} dot={false} strokeDasharray="5 5" name="Last Year" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* RIGHT CHART */}
              <div className="bg-white p-6 shadow-sm rounded-[3px] border border-gray-100 flex flex-col">
                <div className="flex h-full">
                  <div className="w-[40px] flex items-center justify-center">
                    <span className="text-[11px] uppercase text-[#565959] font-normal transform -rotate-90 whitespace-nowrap">
                      {t('orderedProductSales')}
                    </span>
                  </div>
                  <div className="flex-1 h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEEEEE" />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11, fill: '#565959' }}
                          dy={10}
                          interval={2}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11, fill: '#565959' }}
                          tickFormatter={(value) => `${value / 1000}k`}
                          domain={[0, 100000]}
                          ticks={[0, 25000, 50000, 75000, 100000]}
                        />
                        <Tooltip
                          formatter={(value: number) => [formatCurrency(value), t('orderedProductSales')]}
                        />
                        <Line type="monotone" dataKey="sales" stroke="#008296" strokeWidth={2} dot={false} activeDot={{ r: 4 }} name="Current" />
                        <Line type="monotone" dataKey="lastYearSales" stroke="#E3E6E6" strokeWidth={2} dot={false} strokeDasharray="5 5" name="Last Year" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-20 border border-gray-100 rounded-[3px] text-center text-[#565959] text-[13px]">
              {t('tableViewContent')}
            </div>
          )}
        </div>

        {/* COMPARE SECTION (Bottom) */}
        <div className="bg-white p-6 shadow-sm rounded-[3px] flex items-start space-x-20 mb-10">
          <div className="flex flex-col">
            <span className="text-[18px] font-bold">{t('compareSales')}</span>
            <a href="#" className="text-[14px] text-[#008296] hover:underline font-medium">{t('whatsThis')}</a>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-4 h-4 bg-[#008296] rounded-[2px] flex items-center justify-center">
                <Check size={12} className="text-white" />
              </div>
              <span className="text-[14px] font-bold text-[#008296]">{t('selectedDateRange')}</span>
            </div>
            <div className="pl-6">
              <p className="text-[16px] text-[#0F1111] font-bold mb-1">{snapshotData.unitsOrdered} Units</p>
              <p className="text-[16px] text-[#0F1111] font-bold">{snapshotData.orderedProductSales}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessReports;