import React, { useState, useEffect } from 'react';
import { useI18n } from '../hooks/useI18n';
import { useStore } from '../store';
import { apiGet } from '../config/api';
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
import styles from './BusinessReports.module.css';

const BusinessReports: React.FC = () => {
  const { t, formatCurrency, formatNumber } = useI18n();
  const { currentStore } = useStore();
  const [activeView, setActiveView] = useState<'graph' | 'table'>('graph');
  const [snapshotData, setSnapshotData] = useState({
    totalOrderItems: "154,066",
    unitsOrdered: "174,714",
    orderedProductSales: "$19,701,989.13",
    avgUnitsPerOrder: "1.13",
    avgSalesPerOrder: "$127.88",
    timestamp: "12/30/2025, 11:32:21 PM PST"
  });
  const [loading, setLoading] = useState(false);

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
  }, [currentStore]);


  // More granular data for "spiky" look
  const chartData = [
    { name: "Jan '25", units: 400, sales: 35000, lastYearUnits: 350, lastYearSales: 32000 },
    { name: "", units: 650, sales: 58000, lastYearUnits: 420, lastYearSales: 35000 },
    { name: "", units: 300, sales: 28000, lastYearUnits: 400, lastYearSales: 38000 },
    { name: "Feb '25", units: 450, sales: 42000, lastYearUnits: 280, lastYearSales: 25000 },
    { name: "", units: 800, sales: 72000, lastYearUnits: 550, lastYearSales: 50000 },
    { name: "", units: 250, sales: 22000, lastYearUnits: 300, lastYearSales: 28000 },
    { name: "Mar '25", units: 500, sales: 45000, lastYearUnits: 450, lastYearSales: 38000 },
    { name: "", units: 700, sales: 65000, lastYearUnits: 600, lastYearSales: 55000 },
    { name: "", units: 400, sales: 35000, lastYearUnits: 420, lastYearSales: 40000 },
    { name: "Apr '25", units: 450, sales: 42000, lastYearUnits: 420, lastYearSales: 35000 },
    { name: "", units: 900, sales: 85000, lastYearUnits: 700, lastYearSales: 60000 },
    { name: "", units: 550, sales: 50000, lastYearUnits: 600, lastYearSales: 55000 },
    { name: "May '25", units: 600, sales: 55000, lastYearUnits: 580, lastYearSales: 52000 },
    { name: "", units: 350, sales: 32000, lastYearUnits: 400, lastYearSales: 38000 },
    { name: "", units: 750, sales: 68000, lastYearUnits: 650, lastYearSales: 60000 },
    { name: "Jun '25", units: 800, sales: 72000, lastYearUnits: 750, lastYearSales: 68000 },
    { name: "", units: 400, sales: 38000, lastYearUnits: 450, lastYearSales: 42000 },
    { name: "", units: 600, sales: 55000, lastYearUnits: 550, lastYearSales: 50000 },
    { name: "Jul '25", units: 700, sales: 65000, lastYearUnits: 680, lastYearSales: 62000 },
    { name: "", units: 300, sales: 28000, lastYearUnits: 350, lastYearSales: 32000 },
    { name: "", units: 550, sales: 52000, lastYearUnits: 600, lastYearSales: 55000 },
    { name: "Aug '25", units: 650, sales: 58000, lastYearUnits: 600, lastYearSales: 55000 },
    { name: "", units: 850, sales: 78000, lastYearUnits: 800, lastYearSales: 72000 },
    { name: "", units: 450, sales: 42000, lastYearUnits: 500, lastYearSales: 45000 },
    { name: "Sep '25", units: 750, sales: 68000, lastYearUnits: 720, lastYearSales: 65000 },
    { name: "", units: 350, sales: 32000, lastYearUnits: 400, lastYearSales: 36000 },
    { name: "", units: 600, sales: 55000, lastYearUnits: 580, lastYearSales: 52000 },
    { name: "Oct '25", units: 900, sales: 82000, lastYearUnits: 850, lastYearSales: 78000 },
    { name: "", units: 550, sales: 50000, lastYearUnits: 600, lastYearSales: 55000 },
    { name: "", units: 750, sales: 68000, lastYearUnits: 700, lastYearSales: 62000 },
    { name: "Nov '25", units: 850, sales: 78000, lastYearUnits: 800, lastYearSales: 72000 },
    { name: "", units: 450, sales: 42000, lastYearUnits: 500, lastYearSales: 48000 },
    { name: "", units: 650, sales: 58000, lastYearUnits: 600, lastYearSales: 55000 },
    { name: "Dec '25", units: 1000, sales: 95000, lastYearUnits: 950, lastYearSales: 90000 },
  ];

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
          <Sparkles size={15} className={styles.sparkleIcon} />
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
              <select className={styles.filterSelect}>
                <option>Custom</option>
              </select>
              <div className={styles.dateInputsRow}>
                <div className={styles.dateInputWrapper}>
                  <Calendar size={14} className={styles.calendarIconLeft} />
                  <input type="text" className={styles.dateInputBare} defaultValue="12/31/2024" />
                </div>
                <div className={styles.dateInputWrapper}>
                  <Calendar size={14} className={styles.calendarIconLeft} />
                  <input type="text" className={styles.dateInputBare} defaultValue="12/31/2025" />
                </div>
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

          <button className={styles.btnApply}>
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
          <div className={styles.chartsContainer}>
            {/* Units Ordered Chart */}
            <div className={styles.chartWrapper}>
              <div className="absolute left-[-30px] top-1/2 -translate-y-1/2 -rotate-90 text-[11px] text-[#565959] font-bold uppercase tracking-wider">
                {t('unitsOrdered')}
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEEEEE" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#565959' }}
                    interval={0}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#565959' }}
                    domain={[0, 1000]}
                  />
                  <Tooltip
                    formatter={(value: number) => [formatNumber(value), t('unitsOrdered')]}
                  />
                  <Line type="monotone" dataKey="units" stroke="#008296" strokeWidth={1.5} dot={false} activeDot={{ r: 4 }} />
                  <Line type="monotone" dataKey="lastYearUnits" stroke="#E3E6E6" strokeWidth={1.5} dot={false} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Ordered Product Sales Chart */}
            <div className={styles.chartWrapper}>
              <div className="absolute left-[-30px] top-1/2 -translate-y-1/2 -rotate-90 text-[11px] text-[#565959] font-bold uppercase tracking-wider">
                {t('orderedProductSales')}
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEEEEE" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#565959' }}
                    interval={0}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#565959' }}
                    tickFormatter={(value) => `${value / 1000}k`}
                    domain={[0, 100000]}
                  />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), t('orderedProductSales')]}
                  />
                  <Line type="monotone" dataKey="sales" stroke="#008296" strokeWidth={1.5} dot={false} activeDot={{ r: 4 }} />
                  <Line type="monotone" dataKey="lastYearSales" stroke="#E3E6E6" strokeWidth={1.5} dot={false} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
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
                Dec 1, 2024 - Dec 31, 2024<br />
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
