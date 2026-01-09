
import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, Bell, MessageSquare, Settings, ChevronDown, 
  Search as SearchIcon, Edit2, HelpCircle, Check
} from 'lucide-react';
import { useStore } from '../store';
import { useI18n } from '../hooks/useI18n';
import { cn } from '../utils/cn';
import { marketplaceConfigs } from '../i18n';
import { ConsoleLogo } from '../components/UI';
import { Marketplace, Language } from '../types';

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
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { label: t('dashboard'), path: '/app/dashboard' },
    { label: t('inventory'), path: '/app/inventory' },
    { label: t('orders'), path: '/app/orders' },
    { label: t('ads'), path: '/app/ads' },
    { label: t('shipments'), path: '/app/shipments' },
    { label: t('performance'), path: '/app/account-health' },
    { label: t('reports'), path: '/app/business-reports/sales-dashboard' },
    { label: t('voc'), path: '/app/voc' },
    { label: t('analytics'), path: '/app/analytics' },
    { label: t('stores'), path: '/app/stores' },
  ];

  const currentMkt = marketplaceConfigs[session.marketplace] || marketplaceConfigs['United States'];

  return (
    <div className="min-h-screen bg-amazon-bg font-sans text-amazon-text select-none">
      {/* 黑色最顶栏 - 1:1 配色 #131921 */}
      <header className="bg-amazon-darker h-14 flex items-center px-4 justify-between sticky top-0 z-[60] text-white">
        <div className="flex items-center h-full">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded mr-2 transition-colors">
            <Menu size={24} />
          </button>
          
          <ConsoleLogo className="cursor-pointer mr-6" onClick={() => navigate('/app/dashboard')} />
          
          {/* Marketplace Switcher */}
          <div className="relative h-full" ref={mktRef}>
            <div 
              onClick={() => setIsMktOpen(!isMktOpen)}
              className={cn(
                "h-full flex items-center px-3 hover:bg-white/10 cursor-pointer border-l border-white/10 transition-colors",
                isMktOpen && "bg-white/10"
              )}
            >
              <div className="flex flex-col">
                <span className="text-[12px] font-bold flex items-center gap-1.5 whitespace-nowrap">
                  <span className="opacity-90">EnShZhiXun</span>
                  <span className="opacity-40">|</span>
                  <span className="flex items-center gap-1">
                    <span className="text-[14px]">{currentMkt.flag}</span>
                    <span>{session.marketplace}</span>
                  </span>
                  <ChevronDown size={12} className={cn("opacity-60 transition-transform", isMktOpen && "rotate-180")} />
                </span>
              </div>
            </div>

            {isMktOpen && (
              <div className="absolute top-14 left-0 w-64 bg-white shadow-xl border border-gray-200 py-2 rounded-b-sm animate-in fade-in slide-in-from-top-1 z-[100]">
                <div className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b mb-1">{t('selectMarketplace')}</div>
                {Object.keys(marketplaceConfigs).map(mktKey => (
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
                      <span className={cn("text-sm-amz font-medium text-amazon-text", session.marketplace === mktKey && "font-black text-amazon-teal")}>
                        {mktKey}
                      </span>
                    </div>
                    {session.marketplace === mktKey && <Check size={16} className="text-amazon-teal" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 动态搜索框 */}
        <div className="flex-1 max-w-xl px-12 hidden lg:block">
          <div className="relative group">
            <div className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-amazon-text z-10">
              <SearchIcon size={16} />
            </div>
            <input 
              className="w-full bg-[#37475a] text-white rounded-[2px] h-9 pl-10 pr-4 text-[14px] focus:bg-white focus:text-amazon-text outline-none border border-transparent amz-input-focus transition-all placeholder:text-gray-400" 
              placeholder={t('searchSellerCentral')} 
            />
          </div>
        </div>

        {/* 右侧工具栏 */}
        <div className="flex items-center gap-0.5 h-full">
           <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full mx-2 border border-white/10">
              <div className="w-2 h-2 rounded-full bg-amazon-success animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest">{t('nextGenSelling')}</span>
           </div>
           
           <div className="p-2.5 hover:bg-white/10 cursor-pointer relative group transition-colors">
             <Bell size={20} className="group-hover:scale-105" />
             <span className="absolute top-2 right-2 bg-amazon-error text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold border border-amazon-darker">3</span>
           </div>
           
           <div className="p-2.5 hover:bg-white/10 cursor-pointer hidden sm:block transition-colors">
             <MessageSquare size={20} />
           </div>

           {/* Language Selector */}
           <div className="relative h-full" ref={langRef}>
             <div 
               onClick={() => setIsLangOpen(!isLangOpen)}
               className={cn(
                 "h-full flex items-center px-3 hover:bg-white/10 cursor-pointer transition-colors whitespace-nowrap",
                 isLangOpen && "bg-white/10"
               )}
             >
                <span className="text-[12px] font-black uppercase">{session.language.split('-')[1]}</span>
                <ChevronDown size={12} className={cn("ml-1 opacity-50 transition-transform", isLangOpen && "rotate-180")} />
             </div>
             
             {isLangOpen && (
               <div className="absolute top-14 right-0 w-32 bg-white shadow-xl border border-gray-200 py-2 rounded-b-sm animate-in fade-in slide-in-from-top-1 z-[100]">
                 {[
                   { label: 'English', code: 'en-US' },
                   { label: '简体中文', code: 'zh-CN' }
                 ].map(lang => (
                   <div 
                     key={lang.code}
                     onClick={() => {
                       setLanguage(lang.code as Language);
                       setIsLangOpen(false);
                     }}
                     className="px-4 py-2 hover:bg-gray-100 flex items-center justify-between cursor-pointer group"
                   >
                     <span className={cn("text-sm-amz font-medium text-amazon-text", session.language === lang.code && "font-black text-amazon-teal")}>
                       {lang.label}
                     </span>
                   </div>
                 ))}
               </div>
             )}
           </div>

           <div className="p-2.5 hover:bg-white/10 cursor-pointer transition-colors"><Settings size={20} /></div>
           
           <div className="border-l border-white/10 h-8 mx-2"></div>
           
           <button onClick={logout} className="text-[10px] font-black text-gray-400 hover:text-white uppercase tracking-widest px-2 transition-colors">
             {t('logout')}
           </button>
        </div>
      </header>

      {/* 蓝绿色二级菜单 */}
      <nav className="bg-amazon-dark h-10 flex items-center px-4 shadow-md sticky top-14 z-50 text-gray-200 border-t border-white/5">
        <div className="flex h-full w-full items-center justify-between text-[13px] font-bold">
          <div className="flex h-full items-center overflow-x-auto no-scrollbar">
            {menuItems.map(item => (
              <div 
                key={item.path} 
                onClick={() => navigate(item.path)} 
                className={cn(
                  "px-4 h-full flex items-center cursor-pointer hover:text-white border-b-[3px] transition-all whitespace-nowrap", 
                  location.pathname.includes(item.path) ? "border-amazon-teal text-white bg-white/5" : "border-transparent text-gray-300"
                )}
              >
                {item.label}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-gray-400 ml-4 whitespace-nowrap">
             <button className="hover:text-white flex items-center gap-1.5 transition-colors bg-white/5 px-2.5 py-1 rounded-sm border border-white/10">
                <Edit2 size={12} /> {t('edit')}
             </button>
             <button className="hover:text-white flex items-center gap-1 transition-colors">
               <HelpCircle size={14} /> {t('help')}
             </button>
          </div>
        </div>
      </nav>

      <main className="p-6 max-w-[1440px] mx-auto min-h-[calc(100vh-160px)]">
        {location.pathname === '/app/dashboard' && (
           <div className="flex justify-end gap-2 mb-4">
              <button className="bg-white border border-gray-300 px-3 py-1 rounded-[2px] text-[11px] font-bold hover:bg-gray-50 flex items-center gap-1 shadow-sm">Launch Tour <ChevronDown size={12}/></button>
              <button className="bg-white border border-gray-300 px-3 py-1 rounded-[2px] text-[11px] font-bold hover:bg-gray-50 shadow-sm">{t('learnMore')}</button>
           </div>
        )}
        <Outlet />
      </main>

      <footer className="mt-20 border-t bg-white py-12 text-center border-gray-200">
        <div className="flex justify-center gap-8 text-[12px] font-bold text-amazon-link mb-4">
           <a href="#" className="hover:underline">Conditions of Use</a>
           <a href="#" className="hover:underline">Privacy Notice</a>
           <a href="#" className="hover:underline">Help</a>
        </div>
        <p className="text-[11px] text-gray-500 font-medium">© 1999-2025, Amazon.com, Inc. or its affiliates. Amazon, Amazon Seller Central and all related logos are trademarks of Amazon.com, Inc. or its affiliates.</p>
      </footer>
    </div>
  );
};

export default MainLayout;
