import React, { useState, useEffect } from 'react';
import { useI18n } from '../hooks/useI18n';
import { useStore } from '../store';
import { apiGet } from '../config/api';
import {
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { cn } from '../utils/cn';
import styles from './BusinessReports.module.css';
import CustomDateDropdown from '../components/CustomDateDropdown';
import DatePicker from '../components/DatePicker';

const BusinessReports: React.FC = () => {
  const { t, formatCurrency, formatNumber } = useI18n();
  const { currentStore } = useStore();
  const [activeView, setActiveView] = useState<'graph' | 'table'>('graph');
  const [startDate, setStartDate] = useState('12/31/2024');
  const [endDate, setEndDate] = useState('12/31/2025');
  const [chartData, setChartData] = useState<any[]>([]);
  const [snapshotData, setSnapshotData] = useState({
    totalOrderItems: "154,066",
    unitsOrdered: "174,714",
    orderedProductSales: "$19,701,989.13",
    avgUnitsPerOrder: "1.13",
    avgSalesPerOrder: "$127.88",
    timestamp: "12/30/2025, 11:32:21 PM PST"
  });
  const [loading, setLoading] = useState(false);

  // Load chart data from backend
  const loadChartData = async (start?: string, end?: string) => {
    if (!currentStore?.id) return;

    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (start) params.append('startDate', start);
      if (end) params.append('endDate', end);
      
      const response = await apiGet(`/api/sales/chart-data/${currentStore.id}?${params.toString()}`);
      if (response.success && response.data && response.data.length > 0) {
        // Format the data for chart display
        const formattedData = response.data.map((item: any, index: number) => {
          const date = new Date(item.date);
          const monthName = date.toLocaleString('en-US', { month: 'short' });
          const year = date.getFullYear().toString().slice(2);
          
          // Show month label only on the 1st of each month
          const isFirstOfMonth = date.getDate() === 1;
          const displayName = isFirstOfMonth ? `${monthName} '${year}` : '';
          
          return {
            name: displayName,
            date: date.toLocaleDateString(),
            units: item.units || 0,
            sales: item.sales || 0,
            lastYearUnits: item.lastYearUnits || 0,
            lastYearSales: item.lastYearSales || 0,
          };
        });
        setChartData(formattedData);
      } else {
        // Fallback to generated data if no backend data
        generateFallbackChartData();
      }
    } catch (error) {
      console.error('Failed to load chart data:', error);
      // Fallback to generated data
      generateFallbackChartData();
    } finally {
      setLoading(false);
    }
  };

  // Generate fallback chart data if API fails
  const generateFallbackChartData = () => {
    const data = [];
    
    // Generate daily data for 13 months to create dense chart like the image
    const startDate = new Date('2025-01-01');
    const endDate = new Date('2026-01-31');
    
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const monthName = currentDate.toLocaleString('en-US', { month: 'short' });
      const year = currentDate.getFullYear().toString().slice(2);
      
      // Show month label only on the 1st of each month
      const isFirstOfMonth = currentDate.getDate() === 1;
      const displayName = isFirstOfMonth ? `${monthName} '${year}` : '';

      // Random "spiky" data with more variation to match the image
      const baseUnit = 500;
      const baseSales = 50000;
      const variance = 0.8; // Increased variance for more spiky appearance

      data.push({
        name: displayName,
        date: currentDate.toLocaleDateString(),
        units: Math.floor(baseUnit * (0.5 + Math.random() * variance * 2)),
        sales: Math.floor(baseSales * (0.5 + Math.random() * variance * 2)),
        lastYearUnits: Math.floor(baseUnit * 0.9 * (0.5 + Math.random() * variance * 2)),
        lastYearSales: Math.floor(baseSales * 0.9 * (0.5 + Math.random() * variance * 2)),
      });

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setChartData(data);
  };

  // Handle Apply button click
  const handleApplyFilters = async () => {
    if (!currentStore?.id) {
      console.error('No store selected');
      return;
    }

    // Convert date format from MM/DD/YYYY to YYYY-MM-DD for API
    const formatDateForAPI = (dateStr: string) => {
      const [month, day, year] = dateStr.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };

    try {
      setLoading(true);
      const apiStartDate = formatDateForAPI(startDate);
      const apiEndDate = formatDateForAPI(endDate);
      
      console.log('Applying filters:', { startDate, endDate, apiStartDate, apiEndDate });
      
      // Update chart data for the selected date range
      await loadChartData(apiStartDate, apiEndDate);
      
      // Optionally update snapshot data to reflect the selected date range
      // This would require a backend endpoint that calculates snapshot for date range
      console.log('Filters applied successfully');
    } catch (error) {
      console.error('Failed to apply filters:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format date for display in compare legend
  const formatDateForDisplay = (dateStr: string) => {
    const [month, day, year] = dateStr.split('/');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${parseInt(day)}, ${year}`;
  };

  // Load sales snapshot data from backend
  useEffect(() => {
    const loadSnapshotData = async () => {
      if (!currentStore?.id) return;

      try {
        setLoading(true);
        const response = await apiGet(`/api/sales/snapshot/${currentStore.id}`);
        if (response.success && response.data) {
          const data = response.data;
          setSnapshotData({
            totalOrderItems: new Intl.NumberFormat('en-US').format(data.total_order_items),
            unitsOrdered: new Intl.NumberFormat('en-US').format(data.units_ordered),
            orderedProductSales: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(data.ordered_product_sales),
            avgUnitsPerOrder: data.avg_units_per_order_item.toFixed(2),
            avgSalesPerOrder: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(data.avg_sales_per_order_item),
            timestamp: new Date(data.snapshot_time).toLocaleString('en-US', {
              timeZone: 'America/Los_Angeles',
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              timeZoneName: 'short'
            })
          });
        }
      } catch (error) {
        console.error('Failed to load sales snapshot data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSnapshotData();
    // Load initial chart data
    generateFallbackChartData();
  }, [currentStore]);

  return (
    <div className={cn(styles.businessReports, styles.pageContainer)}>
      {/* HEADER SECTION */}
      <div className={styles.pageHeader}>
        <div className="flex items-center">
          <h1 className={styles.pageTitle}>{t('salesDashboardTitle')}</h1>
          <a href="#" className={styles.learnMoreLink}>Learn more</a>
        </div>
        <div className={styles.headerButtons}>
          <button className={styles.btnRefresh}>
            {t('refresh')}
          </button>
          <button className={styles.btnDownload}>
            {t('download')}
          </button>
        </div>
      </div>

      {/* BUSINESS PERFORMANCE INSIGHTS */}
      <div className={styles.insightsCard}>
        <div className={styles.insightsHeader}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#147C8F" xmlns="http://www.w3.org/2000/svg" className={styles.sparkleIcon}>
            {/* Big star - left-center */}
            <path d="M8 4L10 9.5L15.5 11L10 12.5L8 18L6 12.5L0.5 11L6 9.5L8 4Z" />
            {/* Small star - top-right */}
            <path d="M19 3L19.8 5.2L22 6L19.8 6.8L19 9L18.2 6.8L16 6L18.2 5.2L19 3Z" />
          </svg>
          <div>
            <h2 className={styles.insightsTitle}>{t('businessPerformanceInsights')}</h2>
            <p className={styles.insightsText}>{t('allCaughtUp')}</p>
          </div>
        </div>
        <div className={styles.feedbackSection}>
          <span className={styles.feedbackText}>Help improve this experience</span>
          <div className={styles.feedbackIcons}>
            <ThumbsUp className={styles.feedbackIcon} />
            <ThumbsDown className={styles.feedbackIcon} />
            <div className={styles.separator} />
            <Copy className={styles.feedbackIcon} />
          </div>
        </div>
      </div>

      {/* FILTER BAR SECTION */}
      <div className={styles.filtersContainer}>
        <div className={styles.filterRow}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>{t('date')}</label>
            <div className={styles.datePicker}>
              <CustomDateDropdown />
              <div className={styles.dateInputsRow}>
                <DatePicker value={startDate} onChange={setStartDate} />
                <DatePicker value={endDate} onChange={setEndDate} />
              </div>
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>{t('salesBreakdown')}</label>
            <select className={styles.filterSelect}>
              <option>{t('marketplaceTotal')}</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>{t('fulfillmentChannel')}</label>
            <select className={styles.filterSelect}>
              <option>{t('bothAmazonAndSeller')}</option>
            </select>
          </div>

          <button className={styles.btnApply} onClick={handleApplyFilters}>
            {t('apply')}
          </button>
        </div>
      </div>

      {/* SALES SNAPSHOT SECTION */}
      <div className={styles.snapshotSection}>
        <div className={styles.snapshotHeader}>
          <h2 className={styles.snapshotTitle}>{t('salesSnapshot')}</h2>
          <span className={styles.snapshotTimestamp}>{t('takenAt')} {snapshotData.timestamp}</span>
        </div>

        <div className={styles.metricsRow}>
          <div className={styles.metricItem}>
            <div className={styles.metricLabel}>{t('totalOrderItems')}</div>
            <div className={styles.metricValue}>{snapshotData.totalOrderItems}</div>
          </div>
          <div className={styles.metricItem}>
            <div className={styles.metricLabel}>{t('unitsOrdered')}</div>
            <div className={styles.metricValue}>{snapshotData.unitsOrdered}</div>
          </div>
          <div className={styles.metricItem}>
            <div className={styles.metricLabel}>{t('orderedProductSales')}</div>
            <div className={styles.metricValue}>{snapshotData.orderedProductSales}</div>
          </div>
          <div className={styles.metricItem}>
            <div className={styles.metricLabel}>{t('avgUnitsOrderItem')}</div>
            <div className={styles.metricValue}>{snapshotData.avgUnitsPerOrder}</div>
          </div>
          <div className={styles.metricItem}>
            <div className={styles.metricLabel}>{t('avgSalesOrderItem')}</div>
            <div className={styles.metricValue}>{snapshotData.avgSalesPerOrder}</div>
          </div>
        </div>
      </div>

      {/* COMPARE SALES SECTION */}
      <div className={styles.compareSection}>
        <div className={styles.compareHeader}>
          <h2 className={styles.compareTitle}>{t('compareSales')}</h2>
          <div className={styles.viewToggle}>
            <button
              className={cn(styles.viewBtn, activeView === 'graph' && styles.active)}
              onClick={() => setActiveView('graph')}
            >
              {t('graphView')}
            </button>
            <button
              className={cn(styles.viewBtn, activeView === 'table' && styles.active)}
              onClick={() => setActiveView('table')}
            >
              {t('tableView')}
            </button>
          </div>
        </div>

        {activeView === 'graph' ? (
          <>
            <div className={styles.chartsContainer}>
              {/* Units Ordered Chart */}
              <div className={styles.chartWrapper}>
                <div className="absolute left-[-15px] top-1/2 -translate-y-1/2 -rotate-90 text-[9px] text-[#565959] font-normal uppercase tracking-wider">
                  {t('unitsOrdered')}
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 25, right: 5, left: 15, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="0" vertical={false} horizontal={true} stroke="#d0d0d0" strokeWidth={1} />
                    <XAxis
                      dataKey="name"
                      axisLine={true}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#565959' }}
                      interval="preserveStartEnd"
                      stroke="#e0e0e0"
                      angle={0}
                      textAnchor="middle"
                      tickFormatter={(value) => value || ''}
                    />
                    <YAxis
                      axisLine={true}
                      tickLine={true}
                      tick={{ fontSize: 10, fill: '#565959' }}
                      domain={[0, 'auto']}
                      stroke="#e0e0e0"
                      includeHidden={true}
                    />
                    <ReferenceLine y={0} stroke="#d0d0d0" strokeWidth={1} />
                    <Tooltip
                      formatter={(value: number) => [formatNumber(value), t('unitsOrdered')]}
                      labelFormatter={(label, payload) => {
                        if (payload && payload[0]) {
                          return payload[0].payload.date;
                        }
                        return label;
                      }}
                    />
                    <Line 
                      type="linear" 
                      dataKey="units" 
                      stroke="#008296" 
                      strokeWidth={0.8} 
                      dot={false} 
                      activeDot={{ r: 2 }}
                      connectNulls={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* 中间分割线 */}
              <div className={styles.chartDivider}></div>

              {/* Ordered Product Sales Chart */}
              <div className={styles.chartWrapper}>
                <div className="absolute left-[-35px] top-1/2 -translate-y-1/2 -rotate-90 text-[9px] text-[#565959] font-normal uppercase tracking-wider">
                  {t('orderedProductSales')}
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 25, right: 5, left: 25, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="0" vertical={false} horizontal={true} stroke="#d0d0d0" strokeWidth={1} />
                    <XAxis
                      dataKey="name"
                      axisLine={true}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#565959' }}
                      interval="preserveStartEnd"
                      stroke="#e0e0e0"
                      angle={0}
                      textAnchor="middle"
                      tickFormatter={(value) => value || ''}
                    />
                    <YAxis
                      axisLine={true}
                      tickLine={true}
                      tick={{ fontSize: 10, fill: '#565959' }}
                      tickFormatter={(value) => `${value / 1000}k`}
                      domain={[0, 'auto']}
                      stroke="#e0e0e0"
                      includeHidden={true}
                    />
                    <ReferenceLine y={0} stroke="#d0d0d0" strokeWidth={1} />
                    <Tooltip
                      formatter={(value: number) => [formatCurrency(value), t('orderedProductSales')]}
                      labelFormatter={(label, payload) => {
                        if (payload && payload[0]) {
                          return payload[0].payload.date;
                        }
                        return label;
                      }}
                    />
                    <Line 
                      type="linear" 
                      dataKey="sales" 
                      stroke="#008296" 
                      strokeWidth={0.8} 
                      dot={false} 
                      activeDot={{ r: 2 }}
                      connectNulls={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        ) : (
          <div className="p-20 text-center border rounded-[3px] text-[#565959]">
            {t('tableViewContent')}
          </div>
        )}

        {/* COMPARE LEGEND SECTION */}
        <div className={styles.compareLegend}>
          <div>
            <span className={styles.compareLabel}>{t('compare')}</span>
            <a href="#" className={styles.whatsThisLink}>{t('whatsThis')}</a>
          </div>
          <div className={styles.compareCheckbox}>
            <div className="w-4 h-4 border-2 border-[#007185] rounded-[2px] bg-[#007185] flex items-center justify-center mt-1">
              <Check size={12} className="text-white" />
            </div>
            <div>
              <span className={styles.checkboxLabel}>{t('selectedDateRange')}</span>
              <div className={styles.checkboxValues}>
                {formatDateForDisplay(startDate)} - {formatDateForDisplay(endDate)}<br />
                {snapshotData.unitsOrdered} Units<br />
                {snapshotData.orderedProductSales}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessReports;
