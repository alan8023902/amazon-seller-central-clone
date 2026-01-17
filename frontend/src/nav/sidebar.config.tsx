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
  label: 'Reports',
  items: [
    {
      id: 'dashboards',
      label: 'Dashboards',
      path: '/app/business-reports',
      icon: <Activity size={12} />,
      children: [
        {
          id: 'sales-dashboard',
          label: 'Sales Dashboard',
          path: '/app/business-reports/sales-dashboard',
          activePrefix: '/app/business-reports'
        }
      ]
    },
    {
      id: 'business-reports',
      label: 'Business Reports',
      path: '/app/business-reports/by-date',
      icon: <FileText size={12} />,
      children: [
        {
          id: 'by-date',
          label: 'By Date',
          path: '/app/business-reports/by-date'
        }
      ]
    },
    {
      id: 'sales-and-traffic',
      label: 'Sales and Traffic',
      path: '/app/business-reports/sales-traffic',
      icon: <Activity size={12} />,
      children: [
        {
          id: 'detail-page-sales',
          label: 'Detail Page Sales and Traffic',
          path: '/app/business-reports/by-date/detail-page-sales'
        },
        {
          id: 'by-parent-item',
          label: '... By Parent Item',
          path: '/app/business-reports/sales-traffic/by-parent-item'
        },
        {
          id: 'by-child-item',
          label: '... By Child Item',
          path: '/app/business-reports/sales-traffic/by-child-item'
        }
      ]
    },
    {
      id: 'seller-performance',
      label: 'Seller Performance',
      path: '/app/business-reports/seller-performance',
      icon: <Activity size={12} />
    },
    {
      id: 'by-asin',
      label: 'By ASIN',
      path: '/app/business-reports/by-asin',
      icon: <Tag size={12} />,
      children: [
        {
          id: 'asin-detail-sales',
          label: 'Detail Page Sales and Traffic',
          path: '/app/business-reports/by-asin/detail-sales'
        }
      ]
    },
    {
      id: 'other',
      label: 'Other',
      path: '/app/business-reports/other',
      icon: <FileText size={12} />
    },
    {
      id: 'sales-by-month',
      label: 'Sales and Orders by Month',
      path: '/app/business-reports/sales-by-month',
      icon: <FileText size={12} />
    }
  ]
};

// Settings 侧边栏配置
export const settingsSidebar: SidebarConfig = {
  id: 'settings',
  label: 'Account Settings',
  items: [
    {
      id: 'account-overview',
      label: 'Account Overview',
      path: '/app/settings',
      icon: <Users size={12} />
    },
    {
      id: 'store-info',
      label: 'Store Info',
      path: '/app/settings/store-info',
      icon: <Package size={12} />
    },
    {
      id: 'business-info',
      label: 'Business Information',
      path: '/app/settings/business-info',
      icon: <FileText size={12} />
    },
    {
      id: 'payment-info',
      label: 'Payment Information',
      path: '/app/settings/payment-info',
      icon: <Tag size={12} />
    },
    {
      id: 'shipping-returns',
      label: 'Shipping and Returns',
      path: '/app/settings/shipping-returns',
      icon: <ShoppingCart size={12} />
    },
    {
      id: 'tax-info',
      label: 'Tax Information',
      path: '/app/settings/tax-info',
      icon: <FileText size={12} />
    },
    {
      id: 'account-management',
      label: 'Account Management',
      path: '/app/settings/account-management',
      icon: <Users size={12} />
    }
  ]
};

// Inventory 侧边栏配置
export const inventorySidebar: SidebarConfig = {
  id: 'inventory',
  label: 'Inventory',
  items: [
    {
      id: 'manage-all',
      label: 'Manage All Inventory',
      path: '/app/inventory',
      icon: <Package size={12} />
    },
    {
      id: 'add-products',
      label: 'Add Products',
      path: '/app/add-products',
      icon: <Package size={12} />
    },
    {
      id: 'fba-inventory',
      label: 'FBA Inventory',
      path: '/app/inventory/fba',
      icon: <Package size={12} />
    }
  ]
};

// Orders 侧边栏配置
export const ordersSidebar: SidebarConfig = {
  id: 'orders',
  label: 'Orders',
  items: [
    {
      id: 'manage-orders',
      label: 'Manage Orders',
      path: '/app/orders',
      icon: <ShoppingCart size={12} />
    },
    {
      id: 'returns',
      label: 'Returns',
      path: '/app/orders/returns',
      icon: <ShoppingCart size={12} />
    },
    {
      id: 'order-reports',
      label: 'Order Reports',
      path: '/app/orders/reports',
      icon: <FileText size={12} />
    }
  ]
};

// Ads 侧边栏配置
export const adsSidebar: SidebarConfig = {
  id: 'ads',
  label: 'Advertising',
  items: [
    {
      id: 'campaigns',
      label: 'Campaigns',
      path: '/app/ads',
      icon: <Tag size={12} />
    },
    {
      id: 'ad-groups',
      label: 'Ad Groups',
      path: '/app/ads/groups',
      icon: <Tag size={12} />
    },
    {
      id: 'keywords',
      label: 'Keywords',
      path: '/app/ads/keywords',
      icon: <Tag size={12} />
    }
  ]
};

// Performance 侧边栏配置
export const performanceSidebar: SidebarConfig = {
  id: 'performance',
  label: 'Performance',
  items: [
    {
      id: 'account-health',
      label: 'Account Health',
      path: '/app/performance',
      icon: <Activity size={12} />
    },
    {
      id: 'performance-notifications',
      label: 'Performance Notifications',
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
