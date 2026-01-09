
import React from 'react';
import { AlertTriangle, ChevronRight, CheckCircle2, ShieldCheck, Globe, Clock, BarChart2, Info } from 'lucide-react';
import { Card } from '../components/UI';
import { useI18n } from '../hooks/useI18n';
import { cn } from '../utils/cn';

const AccountHealth: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between mb-8 px-1">
        <h1 className="text-2xl font-black text-amazon-text uppercase tracking-tight">{t('accountHealth')}</h1>
        <div className="flex gap-6 items-center text-xs-amz font-black text-amazon-link uppercase tracking-widest">
           <button className="flex items-center gap-1.5 hover:underline"><ShieldCheck size={14} className="text-amazon-teal" /> Global Policies</button>
           <button className="flex items-center gap-1.5 hover:underline"><Info size={14} /> Help Center</button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Top Banner Status */}
        <div className="col-span-12">
          <Card className="!p-8 border-l-[10px] border-l-amazon-success bg-green-50/30 shadow-xl border-amazon-border">
            <div className="flex items-start gap-6">
              <div className="p-3 bg-white rounded-full shadow-md border border-amazon-success/20">
                <CheckCircle2 className="text-amazon-success shrink-0" size={40} />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-black text-green-900 tracking-tight uppercase mb-1">Account Health Rating: <span className="text-amazon-success">Healthy</span></h2>
                <p className="text-sm-amz text-green-800 leading-relaxed max-w-2xl font-medium opacity-80">
                  Your account is in good standing. You are consistently meeting all performance targets across all customer experience metrics and policy compliance checks. No immediate actions required.
                </p>
                <div className="mt-6 flex gap-3">
                   <div className="bg-white/60 px-4 py-2 rounded-sm border border-green-200 text-xs font-black text-green-800 uppercase tracking-widest shadow-sm">Rating: 248 / 1000</div>
                   <div className="bg-white/60 px-4 py-2 rounded-sm border border-green-200 text-xs font-black text-green-800 uppercase tracking-widest shadow-sm">Risk: Low</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Triple Columns for Metrics */}
        <div className="col-span-12 lg:col-span-4">
          <Card title={t('customerService')} className="shadow-amz-card h-full border-amazon-border">
             <div className="space-y-8">
                <div>
                   <div className="flex justify-between text-xs-amz mb-2.5 font-black uppercase tracking-tight">
                      <span className="text-amazon-secondaryText">Order Defect Rate</span>
                      <span className="text-amazon-success">0.12%</span>
                   </div>
                   <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden shadow-inner">
                      <div className="bg-amazon-success h-full w-[12%] transition-all duration-1000" />
                   </div>
                   <div className="flex justify-between mt-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      <span>Target: &lt; 1%</span>
                      <span>Excellent</span>
                   </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-gray-100">
                   {[
                     { label: 'Negative Feedback', val: '0.04%' },
                     { label: 'A-to-z Claims', val: '0.08%' },
                     { label: 'Chargeback Claims', val: '0.00%' },
                   ].map(m => (
                     <div key={m.label} className="flex justify-between text-xs-amz group cursor-pointer">
                        <span className="text-gray-600 group-hover:text-amazon-text font-medium">{m.label}</span>
                        <span className="font-black text-amazon-text">{m.val}</span>
                     </div>
                   ))}
                </div>

                <div className="pt-6 border-t border-gray-100">
                   <button className="w-full py-2.5 text-xs-amz font-black text-amazon-link hover:underline uppercase tracking-widest flex items-center justify-center gap-2 bg-gray-50 rounded-sm border border-gray-200 hover:bg-white transition-colors">
                      View defect reports <ChevronRight size={14} />
                   </button>
                </div>
             </div>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <Card title={t('policyCompliance')} className="shadow-amz-card h-full border-amazon-border">
             <div className="space-y-1 bg-gray-50/50 rounded-sm border border-gray-100 overflow-hidden">
                {[
                  { label: 'Intellectual Property Violations', value: 0 },
                  { label: 'Product Authenticity Complaints', value: 0 },
                  { label: 'Product Safety Issues', value: 0 },
                  { label: 'Listing Policy Violations', value: 0 },
                  { label: 'Restricted Product Policy', value: 0 },
                  { label: 'Customer Reviews Policy', value: 0 },
                  { label: 'Other Policy Violations', value: 0 },
                ].map((item, idx) => (
                  <div key={item.label} className={cn(
                    "flex justify-between items-center px-4 py-3 text-xs-amz transition-colors cursor-pointer",
                    idx % 2 === 0 ? "bg-white/80" : "bg-transparent",
                    "hover:bg-blue-50/40"
                  )}>
                    <span className="text-gray-700 font-medium">{item.label}</span>
                    <span className="font-black text-amazon-success bg-green-100 px-2 py-0.5 rounded-sm min-w-[24px] text-center">{item.value}</span>
                  </div>
                ))}
             </div>
             <div className="mt-6 text-[11px] text-amazon-secondaryText leading-relaxed flex items-start gap-2 italic font-medium px-2">
                <Info size={14} className="text-amazon-teal shrink-0 mt-0.5" />
                Compliance with these policies is critical to maintain your selling privileges on Amazon.
             </div>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <Card title={t('shippingPerformance')} className="shadow-amz-card h-full border-amazon-border">
             <div className="space-y-8">
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-gray-50 rounded-sm border border-gray-100">
                      <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Late Shipment</div>
                      <div className="text-2xl font-black text-amazon-text">0.0%</div>
                      <div className="text-[9px] font-bold text-amazon-success uppercase mt-1">Target: &lt; 4%</div>
                   </div>
                   <div className="p-4 bg-gray-50 rounded-sm border border-gray-100">
                      <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Valid Tracking</div>
                      <div className="text-2xl font-black text-amazon-success">100%</div>
                      <div className="text-[9px] font-bold text-amazon-success uppercase mt-1">Target: &gt; 95%</div>
                   </div>
                </div>

                <div className="space-y-4 pt-4">
                   <div className="flex justify-between items-center text-xs-amz p-3 bg-blue-50/30 border border-blue-100 rounded-sm">
                      <div className="flex items-center gap-2.5">
                         <Clock size={16} className="text-amazon-teal" />
                         <span className="font-black text-amazon-text uppercase tracking-tight">On-Time Delivery</span>
                      </div>
                      <span className="font-black text-amazon-text">98.4%</span>
                   </div>
                   <div className="flex justify-between items-center text-xs-amz p-3 bg-blue-50/30 border border-blue-100 rounded-sm">
                      <div className="flex items-center gap-2.5">
                         <Globe size={16} className="text-amazon-teal" />
                         <span className="font-black text-amazon-text uppercase tracking-tight">Pre-fulfillment Cancel</span>
                      </div>
                      <span className="font-black text-amazon-text">0.0%</span>
                   </div>
                </div>
                
                <div className="pt-6 border-t border-gray-100">
                  <button className="w-full text-xs-amz font-black text-amazon-link hover:underline uppercase tracking-[0.15em] flex items-center justify-center gap-2 py-2">
                     <BarChart2 size={16} /> Advanced Analytics ›
                  </button>
                </div>
             </div>
          </Card>
        </div>

        {/* Action Needed Card */}
        <div className="col-span-12">
          <div className="bg-white border-2 border-dashed border-amazon-orange/30 p-8 rounded-sm shadow-inner flex flex-col md:flex-row items-center gap-8 group cursor-pointer hover:bg-orange-50/10 transition-colors">
             <div className="p-5 bg-amazon-orange/10 rounded-full border border-amazon-orange/20 group-hover:scale-110 transition-transform">
                <AlertTriangle className="text-amazon-orange" size={36} />
             </div>
             <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg-amz font-black text-amazon-orange uppercase tracking-tight mb-2">Operational Insight Detected</h3>
                <p className="text-sm-amz text-gray-700 leading-relaxed max-w-3xl font-medium">
                  We've noticed a slight fluctuation in negative feedback for the <b>"Ultra High-Def 4K Smart Projector"</b> product line. While your current account health remains <span className="text-amazon-success font-black">HEALTHY</span>, we recommend reviewing customer comments in the <b>Voice of the Customer</b> dashboard to mitigate potential policy warnings.
                </p>
             </div>
             <button className="px-8 py-3 bg-amazon-orange text-white text-xs font-black uppercase tracking-widest rounded-sm shadow-md hover:bg-amazon-orange/90 transition-all active:translate-y-px h-auto">
                Review Voice of Customer
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountHealth;
