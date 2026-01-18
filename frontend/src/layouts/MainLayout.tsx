import React, { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import {
  Menu,
  Bell, // 之后会不用也行，你可以删掉
  Settings,
  ChevronDown,
  ChevronRight,
  Edit2,
  HelpCircle,
  Check,
  X,
  Star,
  Mail,
  MoreHorizontal,
} from "lucide-react";

import { useStore } from "../store";
import { useI18n } from "../hooks/useI18n";
import { cn } from "../utils/cn";
import { marketplaceConfigs } from "../i18n";
import { ConsoleLogo } from "../components/UI";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { Marketplace, Language, Store } from "../types";

type MenuItem = {
  label: string;
  path: string;
  // 可选：用于更宽泛的激活匹配（比如 business reports 匹配整个 /app/business-reports/*）
  activePrefix?: string;
};

const MainLayout: React.FC = () => {
  const { session, logout, setMarketplace, setLanguage, setStore } = useStore();
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMktOpen, setIsMktOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(false);

  const mktRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const storeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mktRef.current && !mktRef.current.contains(event.target as Node)) setIsMktOpen(false);
      if (langRef.current && !langRef.current.contains(event.target as Node)) setIsLangOpen(false);
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) setIsSettingsOpen(false);
      if (storeRef.current && !storeRef.current.contains(event.target as Node)) setIsStoreOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems: MenuItem[] = [
    { label: t('dashboard'), path: "/app/dashboard" },
    { label: t('manageAllInventory'), path: "/app/inventory" },
    { label: t('manageOrders'), path: "/app/orders" },
    { label: t('campaignManager'), path: "/app/ads" },
    { label: t('shipments'), path: "/app/shipments" },
    { label: t('accountHealth'), path: "/app/account-health" },
    { label: t('performanceNotifications'), path: "/app/performance-notifications" },
    { label: t('addProducts'), path: "/app/add-products" },
    { label: t('manageStores'), path: "/app/stores" },
    {
      label: t('businessReports'),
      path: "/app/business-reports/sales-dashboard",
      activePrefix: "/app/business-reports",
    },
    { label: t('voc'), path: "/app/voc" },
    { label: t('analytics'), path: "/app/analytics" },
    { label: t('productOpportunities'), path: "/app/product-opportunities" },

    // ✅ 真实里有（先占位，不影响现有功能）
    { label: t('addProductsUpload'), path: "/app/add-products-upload" },
    { label: t('sellingApps'), path: "/app/selling-applications" },
  ];


  // ========= Layout width rule =========
  // All pages use full-width layout except Dashboard
  const forceFullWidthPages = [
    "/app/inventory",
    "/app/orders",
    "/app/business-reports",
    // Dashboard uses custom width with 200px margins
  ];

  const useFullWidth =
    forceFullWidthPages.some((p) => location.pathname.startsWith(p));


  // ========= Active match =========
  const isMenuActive = (item: MenuItem) => {
    if (item.activePrefix) return location.pathname.startsWith(item.activePrefix);
    // dashboard 用精确匹配，其他用 startsWith 避免 includes 误伤
    if (item.path === "/app/dashboard") return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  // ========= Menu link class =========
  const navLinkClass = (active: boolean, variant: "top" | "drawer") => {
    if (variant === "top") {
      // 顶部二级菜单（深色底）- 更紧凑（高度/字重/间距）
      return cn(
        "px-2 h-full flex items-center whitespace-nowrap border-b-[3px] transition-colors text-[12px] font-medium",
        active
          ? "border-amazon-teal bg-white/5 text-white"
          : "border-transparent text-gray-300 hover:text-white"
      );
    }

    // 左侧抽屉菜单（白底）
    // ✅ 关键：不要用 h-full / border-b / flex，否则会把每个菜单撑满整个抽屉高度
    return cn(
      "block w-full px-4 py-2 text-[13px] leading-5 text-gray-900 hover:bg-gray-100",
      active ? "font-semibold bg-gray-100" : ""
    );
  };

  return (
    <div className="amz-console min-h-screen flex flex-col">
      {/* GLOBAL DRAWER (LEFT MENU) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[100] transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        >
          <div
            className="w-72 h-full bg-white shadow-2xl animate-in slide-in-from-left duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-amazon-headerTeal h-12 px-3 flex items-center justify-between text-white">
              <div className="scale-[0.92] origin-left leading-none">
                <ConsoleLogo />
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="hover:bg-white/10 p-1 rounded"
              >
                <X size={22} />
              </button>
            </div>

            <nav className="overflow-y-auto h-[calc(100vh-48px)] py-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={navLinkClass(isMenuActive(item), "drawer")}
                >
                  {item.label}
                </Link>
              ))}

              <div className="h-px bg-gray-100 my-4" />

              <button
                onClick={() => {
                  navigate("/app/settings");
                  setIsSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-100"
              >
                <Settings size={18} />
                Account Info
              </button>

              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-2 text-[13px] font-medium text-amazon-error hover:bg-red-50"
              >
                <X size={18} />
                Sign Out
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* HEADER - Amazon Deep Teal */}
      <header className="sticky top-0 bg-amazon-headerTeal h-[41px] flex items-center px-2 z-[60] text-white shadow-[inset_0_-1px_0_rgba(255,255,255,0.10)]">
        {/* Left */}
        <div className="flex items-center h-full shrink-0">
          {/* Hamburger button */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="w-[32px] h-full flex items-center justify-center hover:bg-white/10 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={16} />
          </button>

          {/* Vertical divider - smaller gap before, larger gap after */}
          <div className="h-[24px] w-[1px] bg-white/20 ml-0.5 mr-2" />

          {/* Brand logo - consistent gap from divider */}
          <div
            className="cursor-pointer flex items-center leading-none"
            onClick={() => navigate("/app/dashboard")}
          >
            <ConsoleLogo />
          </div>

          {/* Vertical divider - larger gap before, even larger gap after */}
          <div className="h-[24px] w-[1px] bg-white/20 ml-3 mr-3" />

          {/* Store + Marketplace selector combined - consistent gap from divider */}
          <div className="relative">
            <div
              onClick={() => {
                setIsStoreOpen(!isStoreOpen);
                setIsMktOpen(false);
              }}
              className={cn(
                "flex items-center px-2 cursor-pointer transition-colors",
                isStoreOpen && "bg-white/5"
              )}
              style={{ height: '24px', backgroundColor: 'rgba(255,255,255,0.95)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '2px' }}
            >
              <span className="text-[11px] font-bold text-[#0F1111]">TechNestGo</span>
              <span className="text-[11px] text-[#888C8C] mx-1">|</span>
              <span className="text-[11px] font-bold text-[#0F1111] flex items-center gap-1">
                {session.marketplace}
                <ChevronDown size={12} className="text-[#888C8C]" />
              </span>
            </div>

            {isStoreOpen && (
              <div className="absolute top-8 left-0 w-64 bg-white shadow-xl border border-gray-200 py-2 rounded-b-sm animate-in fade-in slide-in-from-top-1 z-[100]">
                <div className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b mb-1">
                  {t("selectStore")}
                </div>
                {(['Store 1', 'Store 2', 'Store 3'] as const).map((store) => (
                  <div
                    key={store}
                    onClick={() => {
                      setStore(store);
                      setIsStoreOpen(false);
                    }}
                    className="px-4 py-2.5 hover:bg-gray-100 flex items-center justify-between cursor-pointer group"
                  >
                    <span
                      className={cn(
                        "text-sm-amz font-medium text-amazon-text",
                        session.store === store && "font-black text-amazon-teal"
                      )}
                    >
                      {store}
                    </span>
                    {session.store === store && (
                      <Check size={16} className="text-amazon-teal" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center - Search */}
        <div className="flex-1 flex justify-center px-2">
          <div className="w-full max-w-[340px] flex items-center">
            {/* Input */}
            <input
              className="w-full h-[28px] px-3 text-[12px] text-white outline-none placeholder:text-white/80 border border-[rgba(255,255,255,0.16)] rounded-l-[2px]"
              placeholder="Search"
              style={{ backgroundColor: "rgba(18,120,128,0.42)" }}
            />

            {/* Button - separate but visually connected */}
            <button
              className="w-[36px] h-[28px] flex items-center justify-center border border-l-0 border-[rgba(255,255,255,0.16)] rounded-r-[2px] hover:brightness-95"
              aria-label="Search"
              style={{ backgroundColor: "rgba(18,120,128,0.82)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 21l-4.3-4.3m1.8-5.2a7 7 0 11-14 0 7 7 0 0114 0z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>



        {/* Right */}
        <div className="flex items-center gap-3 h-full shrink-0">
          {/* 1. small toggle switch */}
          <div className="flex items-center gap-1 px-1">
            <div className="w-7 h-4 rounded-full bg-white/20 relative">
              <div className="w-3 h-3 rounded-full bg-white absolute top-0.5 left-0.5" />
            </div>
          </div>

          {/* 2. text label: "New Seller Central" */}
          <span className="text-[11px] font-bold text-gray-100 whitespace-nowrap">
            New Seller Central
          </span>

          {/* 3. star icon button */}
          <button className="w-[28px] h-[28px] flex items-center justify-center hover:bg-white/10 rounded transition-colors" title="Favorites" aria-label="Favorites">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 2.8l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.9 6.6 19.7l1-6.1-4.4-4.3 6.1-.9L12 2.8z"
                stroke="white"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* 4. mail icon button */}
          <button className="w-[28px] h-[28px] flex items-center justify-center hover:bg-white/10 rounded transition-colors" title="Messages" aria-label="Messages">
            <Mail size={16} />
          </button>

          {/* 5. gear icon button */}
          <div className="relative" ref={settingsRef}>
            <button
              className="w-[28px] h-[28px] flex items-center justify-center hover:bg-white/10 rounded transition-colors"
              title="Settings"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              aria-label="Settings"
            >
              <Settings size={16} />
            </button>
            {/* Settings dropdown menu */}
            {isSettingsOpen && (
              <div className="absolute right-0 top-11 w-64 bg-white shadow-xl border border-gray-200 py-2 rounded-sm animate-in fade-in slide-in-from-top-1 z-[100]">
                <div className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b mb-1">{t('accountManagement')}</div>
                <button onClick={() => navigate("/app/settings/store-info")} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between cursor-pointer text-sm-amz font-medium text-amazon-text">
                  <span>{t('accountOverview')}</span>
                  <ChevronRight size={14} className="text-gray-400" />
                </button>
                <button onClick={() => navigate("/app/settings")} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between cursor-pointer text-sm-amz font-medium text-amazon-text">
                  <span>Manage Accounts</span>
                  <ChevronRight size={14} className="text-gray-400" />
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm-amz font-medium text-amazon-text cursor-pointer">
                  Notification Preferences
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm-amz font-medium text-amazon-text cursor-pointer">
                  Login Settings
                </button>
                <button onClick={() => navigate("/app/settings/shipping-returns")} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm-amz font-medium text-amazon-text cursor-pointer">
                  {t('shippingReturns')}
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm-amz font-medium text-amazon-text cursor-pointer">
                  Gift Options
                </button>
                <button onClick={() => navigate("/app/settings/shipping-returns")} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm-amz font-medium text-amazon-text cursor-pointer">
                  Shipping Settings
                </button>
                <button onClick={() => navigate("/app/settings/tax-info")} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm-amz font-medium text-amazon-text cursor-pointer">
                  {t('taxInfo')}
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm-amz font-medium text-amazon-text cursor-pointer">
                  User Permissions
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm-amz font-medium text-amazon-text cursor-pointer">
                  Fulfillment by Amazon
                </button>
                <div className="h-px bg-gray-100 my-2" />
                <button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm-amz font-medium text-amazon-error cursor-pointer">
                  {t('logout')}
                </button>
              </div>
            )}
          </div>

          {/* 6. language selector: "EN" with caret */}
          <LanguageSwitcher />

          {/* 7. text: "Help" */}
          <button
            className="h-full flex items-center px-2 text-[11px] font-bold text-gray-200 hover:text-white hover:bg-white/10 rounded transition-colors"
            onClick={() => navigate("/app/help")}
            aria-label="Help"
          >
            Help
          </button>

        </div>
      </header>


      {/* SUB-MENU (深色二级菜单) */}
      <nav className="sticky top-[41px] bg-amazon-subHeaderDark h-9 flex items-center px-3 border-t border-[rgba(0,0,0,0.2)] shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)] z-50 text-white">
        <div className="flex h-full w-full items-center justify-between">
          <div className="flex h-full items-center overflow-x-auto no-scrollbar scroll-smooth">
            {/* ✅ 左侧小图标（靠近真实那种“菜单标识”） */}
            <span className="mr-2 inline-flex items-center justify-center w-6 h-6 rounded-[2px] hover:bg-white/10">
              {/* 白色“便签/书签”图标，右下有小尾巴 */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M7 4.8h10c.7 0 1.2.5 1.2 1.2v14.2l-6-2.7-6 2.7V6c0-.7.5-1.2 1.2-1.2z"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                {/* 右下“小尾巴/折角”效果（轻微强调） */}
                <path
                  d="M18.2 17.6l-6-2.7-6 2.7"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  opacity="0.9"
                />
              </svg>
            </span>


            {menuItems.map((item) => (
              <Link key={item.path} to={item.path} className={navLinkClass(isMenuActive(item), "top")}>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-4 whitespace-nowrap">
            {/* ✅ Edit 前的三个点 */}
            <button
              className="w-8 h-7 flex items-center justify-center rounded-[2px] hover:bg-white/10 transition-colors"
              aria-label="More"
              title="More"
            >
              <MoreHorizontal size={16} className="opacity-90" />
            </button>


            <button className="flex items-center px-3 py-0 h-[22px] text-[11px] font-bold text-gray-300 hover:text-white transition-colors bg-white/5 rounded-[2px] border border-white/10">
              {t('edit')}
            </button>


            {/* ✅ SubHeader 末尾不放 Help（真实没有） */}
          </div>
        </div>
      </nav>


      {/* Main content will be rendered by child layouts (WithSidebarLayout or direct routes) */}
      <main className={cn(
        'flex-1 py-4',
        location.pathname === '/app/dashboard' 
          ? 'dashboard-container px-0' // 左右各125px留白，通过max-width和margin实现
          : 'max-w-full px-5' // 左右各20px留白
      )}>
        <Outlet />
      </main>

      <footer className="mt-20 border-t bg-white py-12 text-center border-gray-200">
        <div className="flex justify-center gap-8 text-[12px] font-bold text-amazon-link mb-4">
          <a href="#" className="hover:underline">
            {t('termsCondition')}
          </a>
          <a href="#" className="hover:underline">
            {t('privacyNotice')}
          </a>
          <a href="#" className="hover:underline">
            {t('help')}
          </a>
        </div>
        <p className="text-[11px] text-gray-500 font-medium">
          © 1999-2025, Amazon.com, Inc. or its affiliates. Amazon, Amazon Seller Central and all
          related logos are trademarks of Amazon.com, Inc. or its affiliates.
        </p>
      </footer>
    </div>
  );
};

export default MainLayout;
