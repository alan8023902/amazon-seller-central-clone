import { ReactNode } from 'react';
import { Activity, FileText, Package, ShoppingCart, Tag, Users } from 'lucide-react';

// 定义侧边栏菜单项类型
export interface SidebarMenuItem {
  id: string;
  label: string;
  path: string;
  icon?: ReactNode;
  children?: SidebarMenuItem[];
  activePrefix?: string;
}

// 定义侧边栏配置类型
export interface SidebarConfig {
  id: string;
  label: string;
  items: SidebarMenuItem[];
}

// Reports 侧边栏配置
export const reportsSidebar: SidebarConfig = {
  id: 'reports',
  label: 'reports',
  items: [
    {
      id: 'dashboards',
      label: 'dashboards',
      path: '/app/business-reports',
      icon: <Activity size={12} />,
      children: [
        {
          id: 'sales-dashboard',
          label: 'salesDashboard',
          path: '/app/business-reports/sales-dashboard',
          activePrefix: '/app/business-reports'
        }
      ]
    },
    {
      id: 'business-reports',
      label: 'businessReports',
      path: '/app/business-reports/by-date',
      icon: <FileText size={12} />,
      children: [
        {
          id: 'by-date',
          label: 'byDate',
          path: '/app/business-reports/by-date'
        }
      ]
    },
    {
      id: 'sales-and-traffic',
      label: 'salesAndTraffic',
      path: '/app/business-reports/sales-traffic',
      icon: <Activity size={12} />,
      children: [
        {
          id: 'detail-page-sales',
          label: 'detailPageSales',
          path: '/app/business-reports/by-date/detail-page-sales'
        },
        {
          id: 'by-parent-item',
          label: 'byParentItem',
          path: '/app/business-reports/sales-traffic/by-parent-item'
        },
        {
          id: 'by-child-item',
          label: 'byChildItem',
          path: '/app/business-reports/sales-traffic/by-child-item'
        }
      ]
    },
    {
      id: 'seller-performance',
      label: 'sellerPerformance',
      path: '/app/business-reports/seller-performance',
      icon: <Activity size={12} />
    },
    {
      id: 'by-asin',
      label: 'byAsin',
      path: '/app/business-reports/by-asin',
      icon: <Tag size={12} />,
      children: [
        {
          id: 'asin-detail-sales',
          label: 'asinDetailSales',
          path: '/app/business-reports/by-asin/detail-sales'
        }
      ]
    },
    {
      id: 'other',
      label: 'other',
      path: '/app/business-reports/other',
      icon: <FileText size={12} />
    },
    {
      id: 'sales-by-month',
      label: 'salesByMonth',
      path: '/app/business-reports/sales-by-month',
      icon: <FileText size={12} />
    }
  ]
};

// Settings 侧边栏配置
export const settingsSidebar: SidebarConfig = {
  id: 'settings',
  label: 'accountSettings',
  items: [
    {
      id: 'account-overview',
      label: 'accountOverview',
      path: '/app/settings',
      icon: <Users size={12} />
    },
    {
      id: 'store-info',
      label: 'storeInfo',
      path: '/app/settings/store-info',
      icon: <Package size={12} />
    },
    {
      id: 'business-info',
      label: 'businessInfo',
      path: '/app/settings/business-info',
      icon: <FileText size={12} />
    },
    {
      id: 'payment-info',
      label: 'paymentInfo',
      path: '/app/settings/payment-info',
      icon: <Tag size={12} />
    },
    {
      id: 'shipping-returns',
      label: 'shippingReturns',
      path: '/app/settings/shipping-returns',
      icon: <ShoppingCart size={12} />
    },
    {
      id: 'tax-info',
      label: 'taxInfo',
      path: '/app/settings/tax-info',
      icon: <FileText size={12} />
    },
    {
      id: 'account-management',
      label: 'accountManagement',
      path: '/app/settings/account-management',
      icon: <Users size={12} />
    }
  ]
};

// Inventory 侧边栏配置
export const inventorySidebar: SidebarConfig = {
  id: 'inventory',
  label: 'inventory',
  items: [
    {
      id: 'manage-all',
      label: 'manageAllInventory',
      path: '/app/inventory',
      icon: <Package size={12} />
    },
    {
      id: 'add-products',
      label: 'addProducts',
      path: '/app/add-products',
      icon: <Package size={12} />
    },
    {
      id: 'fba-inventory',
      label: 'fbaInventory',
      path: '/app/inventory/fba',
      icon: <Package size={12} />
    }
  ]
};

// Orders 侧边栏配置
export const ordersSidebar: SidebarConfig = {
  id: 'orders',
  label: 'orders',
  items: [
    {
      id: 'manage-orders',
      label: 'manageOrders',
      path: '/app/orders',
      icon: <ShoppingCart size={12} />
    },
    {
      id: 'returns',
      label: 'returns',
      path: '/app/orders/returns',
      icon: <ShoppingCart size={12} />
    },
    {
      id: 'order-reports',
      label: 'orderReports',
      path: '/app/orders/reports',
      icon: <FileText size={12} />
    }
  ]
};

// Ads 侧边栏配置
export const adsSidebar: SidebarConfig = {
  id: 'ads',
  label: 'advertising',
  items: [
    {
      id: 'campaigns',
      label: 'campaigns',
      path: '/app/ads',
      icon: <Tag size={12} />
    },
    {
      id: 'ad-groups',
      label: 'adGroups',
      path: '/app/ads/groups',
      icon: <Tag size={12} />
    },
    {
      id: 'keywords',
      label: 'keywords',
      path: '/app/ads/keywords',
      icon: <Tag size={12} />
    }
  ]
};

// Performance 侧边栏配置
export const performanceSidebar: SidebarConfig = {
  id: 'performance',
  label: 'performance',
  items: [
    {
      id: 'account-health',
      label: 'accountHealth',
      path: '/app/performance',
      icon: <Activity size={12} />
    },
    {
      id: 'performance-notifications',
      label: 'performanceNotifications',
      path: '/app/performance-notifications',
      icon: <Activity size={12} />
    }
  ]
};

// 根据路径获取对应的侧边栏配置
export const getSidebarByPath = (path: string): SidebarConfig | null => {
  if (path.startsWith('/app/business-reports')) {
    return reportsSidebar;
  }
  if (path.startsWith('/app/settings')) {
    return settingsSidebar;
  }
  if (path.startsWith('/app/inventory')) {
    return inventorySidebar;
  }
  if (path.startsWith('/app/orders')) {
    return ordersSidebar;
  }
  if (path.startsWith('/app/ads')) {
    return adsSidebar;
  }
  if (path.startsWith('/app/performance')) {
    return performanceSidebar;
  }
  return null;
};
