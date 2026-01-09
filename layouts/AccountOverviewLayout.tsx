
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useI18n } from '../hooks/useI18n';
import { cn } from '../utils/cn';
import { AlertTriangle } from 'lucide-react';

const AccountOverviewLayout: React.FC = () => {
  const { t } = useI18n();

  const navItems = [
    { label: t('storeStatus'), path: '/app/settings/store-status' },
    { label: t('paymentInfo'), path: '/app/settings/payment-info' },
    { label: t('businessInfo'), path: '/app/settings/business-info' },
    { label: t('shippingReturns'), path: '/app/settings/shipping-returns' },
    { label: t('taxInfo'), path: '/app/settings/tax-info' },
    { label: t('accountManagement'), path: '/app/settings/account-management' },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      {/* Warning Banner */}
      <div className="mb-6 bg-amazon-yellow/10 border border-amazon-yellowBorder/50 p-4 rounded-sm flex items-start gap-3 shadow-sm">
        <AlertTriangle className="text-amazon-orange shrink-0 mt-0.5" size={18} />
        <div>
          <p className="text-sm font-bold text-amazon-text">{t('limitedAccessWarning')}</p>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Left Sidebar */}
        <aside className="w-64 shrink-0">
          <div className="bg-white border border-amazon-border rounded-sm shadow-sm overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b border-amazon-border text-[11px] font-black uppercase tracking-widest text-gray-500">
              {t('accountOverview')}
            </div>
            <nav className="py-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "block px-4 py-2.5 text-xs-amz font-medium border-l-[3px] transition-colors",
                      isActive
                        ? "bg-blue-50 text-amazon-teal border-amazon-teal font-bold"
                        : "text-gray-600 border-transparent hover:bg-gray-50"
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Area */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AccountOverviewLayout;
