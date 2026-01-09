
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  TrendingUp, AlertCircle, MessageCircle, ChevronRight, RefreshCw, 
  ShoppingBag, Star, Settings, ChevronDown
} from 'lucide-react';
import { useStore } from '../store';
import { Card } from '../components/UI';
import { useI18n } from '../hooks/useI18n';
import { fetchDashboardData } from '../services/api';
import { marketplaceConfigs } from '../i18n';
import { cn } from '../utils/cn';

const Dashboard: React.FC = () => {
  const { session } = useStore();
  const { t } = useI18n();
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['dashboard', session.marketplace],
    queryFn: fetchDashboardData
  });

  const currency = marketplaceConfigs[session.marketplace]?.currency || '$';

  if (isLoading || !dashboard) {
    return (
      <div className="h-[600px] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-amazon-teal border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-5 animate-fade-in">
      {/* Left Column: Actions */}
      <div className="col-span-12 lg:col-span-3 space-y-4">
        <div className="bg-white border border-amazon-border rounded-sm shadow-sm overflow-hidden">
          <div className="px-4 py-2 border-b border-amazon-border bg-gray-50 flex justify-between items-center">
            <span className="font-bold text-xs-amz uppercase tracking-tight">{t('actions')}</span>
            <span className="bg-amazon-dark text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">3</span>
          </div>
          <div className="p-3 space-y-3">
            <div className="p-3 border border-amazon-error/30 border-l-[4px] border-l-amazon-error bg-white rounded-sm group cursor-pointer hover:shadow-md transition-shadow">
               <div className="flex items-center gap-2 mb-1">
                  <AlertCircle size={16} className="text-amazon-error" />
                  <span className="font-black text-[13px] text-amazon-error underline uppercase">Re-activate account</span>
               </div>
               <p className="text-[11px] text-gray-600 leading-tight">Action required to continue selling in this marketplace.</p>
            </div>
            <div className="p-3 border border-amazon-error/30 border-l-[4px] border-l-amazon-error bg-white rounded-sm group cursor-pointer hover:shadow-md transition-shadow">
               <div className="flex items-center gap-2 mb-1">
                  <AlertCircle size={16} className="text-amazon-error" />
                  <span className="font-black text-[13px] text-amazon-error underline uppercase">Update deposit method</span>
               </div>
               <p className="text-[11px] text-gray-600 leading-tight">Valid deposit method is required for disbursements.</p>
            </div>
          </div>
        </div>
        
        <Card title={t('communications')} className="shadow-sm border-amazon-border">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs-amz group cursor-pointer">
              <div className="flex items-center gap-2">
                 <MessageCircle size={16} className="text-amazon-teal" />
                 <span className="font-bold text-amazon-link group-hover:underline">{t('messages')}</span>
              </div>
              <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-[10px] font-bold">0</span>
            </div>
            <div className="flex justify-between items-center text-xs-amz group cursor-pointer pt-3 border-t">
              <span className="text-amazon-link font-bold hover:underline">{t('sellerForums')}</span>
              <ChevronRight size={14} className="text-gray-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Right Column: Main Content */}
      <div className="col-span-12 lg:col-span-9 space-y-5">
        {/* Global Snapshot */}
        <div className="bg-white border border-amazon-border rounded-sm shadow-sm">
           <div className="px-4 py-2 border-b border-amazon-border flex justify-between items-center bg-gray-50">
              <span className="font-black text-xs-amz uppercase tracking-tight">{t('globalSnapshot')}</span>
              <div className="flex gap-2">
                 <button className="text-gray-400 hover:text-amazon-text"><RefreshCw size={14} /></button>
                 <button className="text-gray-400 hover:text-amazon-text"><Settings size={14} /></button>
              </div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-5 divide-x divide-gray-100">
              <div className="p-4 hover:bg-gray-50 cursor-pointer">
                 <div className="text-[10px] font-bold text-gray-500 uppercase mb-1">{t('salesToday')}</div>
                 <div className="text-xl font-black">{currency}{dashboard.salesToday.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                 <div className="text-[10px] text-amazon-success font-bold mt-1 uppercase flex items-center gap-0.5">
                    <TrendingUp size={10} /> +4.2%
                 </div>
              </div>
              <div className="p-4 hover:bg-gray-50 cursor-pointer">
                 <div className="text-[10px] font-bold text-gray-500 uppercase mb-1">{t('openOrders')}</div>
                 <div className="text-xl font-black">{dashboard.openOrders}</div>
                 <div className="text-[10px] text-gray-400 font-bold mt-1 uppercase">Total Count</div>
              </div>
              <div className="p-4 hover:bg-gray-50 cursor-pointer">
                 <div className="text-[10px] font-bold text-gray-500 uppercase mb-1">{t('messages')}</div>
                 <div className="text-xl font-black">{dashboard.messages}</div>
                 <div className="text-[10px] text-gray-400 font-bold mt-1 uppercase">Cases Required</div>
              </div>
              <div className="p-4 hover:bg-gray-50 cursor-pointer">
                 <div className="text-[10px] font-bold text-gray-500 uppercase mb-1">{t('featuredOffer')}</div>
                 <div className="text-xl font-black">98.2%</div>
                 <div className="text-[10px] text-amazon-success font-bold mt-1 uppercase">Excellent</div>
              </div>
              <div className="p-4 hover:bg-gray-50 cursor-pointer">
                 <div className="text-[10px] font-bold text-gray-500 uppercase mb-1">{t('feedback')}</div>
                 <div className="text-xl font-black flex items-center gap-1">
                    <Star size={16} fill="#FFD814" stroke="none" /> 4.90
                 </div>
                 <div className="text-[10px] text-gray-400 font-bold mt-1 uppercase">{t('past365')}</div>
              </div>
           </div>
        </div>

        {/* Main Product Table / Visual Placeholder */}
        <div className="bg-white border border-amazon-border rounded-sm shadow-sm overflow-hidden">
           <div className="px-4 py-3 border-b bg-white flex justify-between items-center">
              <h2 className="font-bold text-base-amz">{t('productPerformance')} <span className="text-xs font-normal text-gray-400 ml-1">{t('last30Days')}</span></h2>
              <div className="flex gap-4">
                 <div className="flex items-center gap-1 border rounded-sm px-2 py-0.5 text-xs text-gray-500 cursor-pointer hover:bg-gray-50">{t('active')} <ChevronDown size={12}/></div>
                 <div className="flex items-center gap-1 border rounded-sm px-2 py-0.5 text-xs text-gray-500 cursor-pointer hover:bg-gray-50">{t('frequentlyInteracted')} <ChevronDown size={12}/></div>
              </div>
           </div>
           <div className="p-20 text-center flex flex-col items-center">
              <ShoppingBag size={48} className="text-gray-100 mb-4" />
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Accessing Detailed Catalog Data...</p>
              <button className="mt-6 bg-amazon-dark text-white px-6 py-1.5 rounded-sm text-xs font-bold shadow-md hover:bg-amazon-dark/90 transition-colors">
                {t('manageInventory')}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
