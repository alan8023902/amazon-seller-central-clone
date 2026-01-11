import React, { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import {
  Menu,
  Bell, // 之后会不用也行，你可以删掉
  Settings,
  ChevronDown,
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
import { Marketplace, Language } from "../types";

type MenuItem = {
  label: string;
  path: string;
  // 可选：用于更宽泛的激活匹配（比如 business reports 匹配整个 /app/business-reports/*）
  activePrefix?: string;
};

const MainLayout: React.FC = () => {
  const { session, logout, setMarketplace, setLanguage } = useStore();
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMktOpen, setIsMktOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const mktRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mktRef.current && !mktRef.current.contains(event.target as Node)) setIsMktOpen(false);
      if (langRef.current && !langRef.current.contains(event.target as Node)) setIsLangOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems: MenuItem[] = [
    { label: "Dashboard", path: "/app/dashboard" },
    { label: "Manage All Inventory", path: "/app/inventory" },
    { label: "Manage Orders", path: "/app/orders" },
    { label: "Campaign Manager", path: "/app/ads" },
    { label: "Shipments", path: "/app/shipments" },
    { label: "Account Health", path: "/app/account-health" },
    { label: "Performance Notifications", path: "/app/performance-notifications" },
    { label: "Add Products", path: "/app/add-products" },
    { label: "Manage Stores", path: "/app/stores" },
    {
      label: "Business Reports",
      path: "/app/business-reports/sales-dashboard",
      activePrefix: "/app/business-reports",
    },
    { label: "Voice of the Customer", path: "/app/voc" },
    { label: "Analytics", path: "/app/analytics" },
    { label: "Product Opportunities", path: "/app/product-opportunities" },

    // ✅ 真实里有（先占位，不影响现有功能）
    { label: "Add Products via Upload", path: "/app/add-products-upload" },
    { label: "View Selling Applications", path: "/app/selling-applications" },
  ];


  // ========= Layout width rule =========
  // Dashboard: centered with side gutters
  // Other pages: full width
  const isDashboard = location.pathname === "/app/dashboard";

  const forceFullWidthPages = [
    "/app/inventory",
    "/app/orders",
    "/app/business-reports",
  ];

  const useFullWidth =
    forceFullWidthPages.some((p) => location.pathname.startsWith(p)) ||
    !isDashboard;


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
      {/* ✅ 真实更扁：48px 高度；中间搜索不抢宽；logo 稍微缩小 */}
{/* HEADER - Amazon Deep Teal */}
      <header className="sticky top-0 bg-amazon-headerTeal h-11 flex items-center px-2 z-[60] text-white shadow-[inset_0_-1px_0_rgba(255,255,255,0.10)]">
        {/* Left */}
        <div className="flex items-center h-full shrink-0">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-1 hover:bg-white/10 rounded mr-2 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={16} />
          </button>

          <div
            className="cursor-pointer mr-3 flex items-center leading-none"
            onClick={() => navigate("/app/dashboard")}
          >
            <ConsoleLogo />
          </div>

          {/* divider | */}
          <span className="text-white/55 text-[11px] leading-none mx-2 select-none">|</span>

          {/* Marketplace Switcher */}
          <div className="relative" ref={mktRef}>
            <div
              onClick={() => setIsMktOpen(!isMktOpen)}
              className={cn(
                "h-full flex items-center px-1 cursor-pointer transition-colors",
                isMktOpen && "bg-white/5"
              )}
            >
              <div
                className={cn(
                  "h-[20px] flex items-center gap-2 px-2 rounded-[2px]",
                  "bg-white text-[#0F1111] border border-[rgba(255,255,255,0.65)]",
                  "shadow-[0_0_0_1px_rgba(0,0,0,0.05)]"
                )}
              >
                <span className="text-[11px] font-bold leading-none uppercase tracking-tight">
                  EnShZhiXun
                </span>
                <span className="text-[11px] leading-none opacity-60">|</span>
                <span className="text-[11px] font-bold leading-none flex items-center gap-1">
                  {session.marketplace}
                  <ChevronDown
                    size={12}
                    className={cn("opacity-70 transition-transform", isMktOpen && "rotate-180")}
                  />
                </span>
              </div>
            </div>

            {isMktOpen && (
              <div className="absolute top-11 left-0 w-64 bg-white shadow-xl border border-gray-200 py-2 rounded-b-sm animate-in fade-in slide-in-from-top-1 z-[100]">
                <div className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b mb-1">
                  {t("selectMarketplace")}
                </div>
                {Object.keys(marketplaceConfigs).map((mktKey) => (
                  <div
                    key={mktKey}
                    onClick={() => {
                      setMarketplace(mktKey as Marketplace);
                      setIsMktOpen(false);
                    }}
                    className="px-4 py-2.5 hover:bg-gray-100 flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{marketplaceConfigs[mktKey].flag}</span>
                      <span
                        className={cn(
                          "text-sm-amz font-medium text-amazon-text",
                          session.marketplace === mktKey && "font-black text-amazon-teal"
                        )}
                      >
                        {mktKey}
                      </span>
                    </div>
                    {session.marketplace === mktKey && (
                      <Check size={16} className="text-amazon-teal" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center - Search */}
        {/* Center - Search (Amazon-style, denser) */}
        <div className="flex-1 flex justify-center px-2">
          {/* 真实偏短 */}
          <div className="w-full max-w-[340px]">
            <div
              className="
                flex w-full
                h-[31px]
                rounded-[2px]
                overflow-hidden
                border border-[rgba(255,255,255,0.16)]
              "
              style={{ backgroundColor: "rgba(18,120,128,0.42)" }}
            >
              {/* Input */}
              <input
                className="
                  w-full h-full
                  px-3
                  text-[12px]
                  text-white
                  bg-transparent
                  outline-none
                  placeholder:text-white/80
                  leading-[31px]
                "
                placeholder="Search"
              />

              {/* Button */}
              <button
                className="w-[36px] h-full flex items-center justify-center hover:brightness-95"
                style={{ backgroundColor: "rgba(18,120,128,0.82)" }}
                aria-label="Search"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
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
        </div>



        {/* Right */}
        <div className="flex items-center gap-1 h-full shrink-0">
          {/* New Seller Central toggle */}
          <div className="flex items-center gap-2 px-1 py-0">
            <div className="w-7 h-4 rounded-full bg-white/20 relative">
              <div className="w-3 h-3 rounded-full bg-white absolute top-0.5 left-0.5" />
            </div>

            <span className="text-[11px] font-bold text-gray-100 whitespace-nowrap">
              New Seller Central
            </span>

            <button
              className="w-6 h-6 rounded-[2px] flex items-center justify-center hover:bg-white/10"
              aria-label="Add"
              title="Add"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 5v14M5 12h14"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>


          {/* Star */}
          <button className="p-2 hover:bg-white/10 rounded transition-colors" title="Favorites" aria-label="Favorites">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 2.8l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.9 6.6 19.7l1-6.1-4.4-4.3 6.1-.9L12 2.8z"
                stroke="white"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
          </button>


          {/* Mail */}
          <button className="p-2 hover:bg-white/10 rounded transition-colors" title="Messages">
            <Mail size={16} />
          </button>

          {/* Settings */}
          <button
            className="p-2 hover:bg-white/10 rounded transition-colors"
            onClick={() => navigate("/app/settings")}
            title="Settings"
          >
            <Settings size={16} />
          </button>

          {/* Language */}
          <div className="relative h-full" ref={langRef}>
            <div
              onClick={() => setIsLangOpen(!isLangOpen)}
              className={cn(
                "h-full flex items-center px-2 hover:bg-white/10 cursor-pointer transition-colors rounded",
                isLangOpen && "bg-white/10"
              )}
            >
              <span className="text-[11px] font-bold uppercase leading-none">{session.language}</span>
              <ChevronDown
                size={12}
                className={cn("ml-1 opacity-60 transition-transform", isLangOpen && "rotate-180")}
              />
            </div>

            {isLangOpen && (
              <div className="absolute top-11 right-0 w-48 bg-white shadow-xl border border-gray-200 py-2 rounded-b-sm animate-in fade-in slide-in-from-top-1 z-[100]">
                <div className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b mb-1">
                  {t("selectLanguage")}
                </div>
                {[
                  { code: "EN" as Language, label: "English" },
                  { code: "ZH" as Language, label: "Chinese (Simplified)" },
                ].map((lang) => (
                  <div
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsLangOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 flex items-center justify-between cursor-pointer"
                  >
                    <span
                      className={cn(
                        "text-sm-amz font-medium text-amazon-text",
                        session.language === lang.code && "font-black text-amazon-teal"
                      )}
                    >
                      {lang.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Help (top right, icon only) */}
          <button
            className="h-full flex items-center px-2 text-[11px] font-bold text-gray-200 hover:text-white hover:bg-white/10 rounded transition-colors"
            onClick={() => navigate("/app/help")}
          >
            Help
          </button>

        </div>
      </header>


      {/* SUB-MENU (深色二级菜单) */}
      <nav className="sticky top-11 bg-amazon-subHeaderDark h-9 flex items-center px-3 shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)] z-50 text-white">
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


            <button className="flex items-center px-3 py-1 text-[11px] font-bold text-gray-300 hover:text-white transition-colors bg-white/5 rounded-[2px] border border-white/10">
              Edit
            </button>


            {/* ✅ SubHeader 末尾不放 Help（真实没有） */}
          </div>
        </div>
      </nav>


      <main
        className={cn(
          "px-4 py-3 min-h-[calc(100vh-120px)]",
          useFullWidth ? "w-full" : "max-w-[1440px] mx-auto"
        )}
      >

        <Outlet />
      </main>

      <footer className="mt-20 border-t bg-white py-12 text-center border-gray-200">
        <div className="flex justify-center gap-8 text-[12px] font-bold text-amazon-link mb-4">
          <a href="#" className="hover:underline">
            Conditions of Use
          </a>
          <a href="#" className="hover:underline">
            Privacy Notice
          </a>
          <a href="#" className="hover:underline">
            Help
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
