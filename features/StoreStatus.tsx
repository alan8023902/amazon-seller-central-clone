
import React from 'react';
import { useI18n } from '../hooks/useI18n';
import { Card } from '../components/UI';
import { CheckCircle2, Globe, HelpCircle, ExternalLink } from 'lucide-react';
import { cn } from '../utils/cn';

const StoreStatus: React.FC = () => {
  const { t } = useI18n();

  const regions = [
    {
      name: t('americas'),
      marketplaces: [
        { name: 'United States', status: 'Active' },
        { name: 'Canada', status: 'Active' },
        { name: 'Mexico', status: 'Active' },
        { name: 'Brazil', status: 'Inactive' },
      ]
    },
    {
      name: t('europe'),
      marketplaces: [
        { name: 'United Kingdom', status: 'Active' },
        { name: 'Germany', status: 'Active' },
        { name: 'France', status: 'Active' },
        { name: 'Italy', status: 'Active' },
        { name: 'Spain', status: 'Active' },
      ]
    },
    {
      name: t('asiaPacific'),
      marketplaces: [
        { name: 'Japan', status: 'Active' },
        { name: 'Australia', status: 'Active' },
        { name: 'Singapore', status: 'Active' },
      ]
    }
  ];

  const services = [
    { name: 'Selling on Amazon', status: 'Active', count: 16 },
    { name: 'Amazon Pay', status: 'Active', count: 1 },
    { name: 'Sponsored Products', status: 'Active', count: 16 },
    { name: 'Customer Service by Amazon', status: 'Active', count: 1 },
    { name: 'Fulfillment by Amazon', status: 'Active', count: 16 },
    { name: 'Amazon Business (B2B)', status: 'Active', count: 16 },
    { name: 'VAT Services on Amazon', status: 'Active', count: 8 },
  ];

  return (
    <div className="grid grid-cols-12 gap-6 pb-12">
      {/* Left Card: Listing Status */}
      <div className="col-span-12 lg:col-span-7">
        <Card 
          title={t('listingStatus')} 
          className="h-full border-amazon-border"
          headerAction={<button className="text-xs-amz text-amazon-link font-bold hover:underline">{t('vacationSettings')}</button>}
        >
          <p className="text-xs-amz text-amazon-secondaryText mb-6 leading-relaxed">
            If you're going on vacation, or if you want to temporarily remove your open listings from the Amazon website, use this feature to change your listing status. <a href="#" className="text-amazon-link hover:underline">Learn more about listing status for vacation, holidays, and other absences.</a>
          </p>
          
          <div className="space-y-8">
            {regions.map((region) => (
              <div key={region.name}>
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 border-b pb-1">{region.name}</h3>
                <div className="divide-y divide-gray-50">
                  {region.marketplaces.map((mkt) => (
                    <div key={mkt.name} className="flex items-center justify-between py-3 group">
                      <div className="flex items-center gap-3">
                        <Globe size={16} className="text-gray-300 group-hover:text-amazon-teal transition-colors" />
                        <span className="text-sm-amz font-bold text-amazon-text">{mkt.name}</span>
                      </div>
                      <div className="flex items-center gap-12">
                        <div className="flex items-center gap-2">
                           <div className={cn("w-2 h-2 rounded-full", mkt.status === 'Active' ? 'bg-amazon-success' : 'bg-gray-300')} />
                           <span className={cn(
                             "text-xs font-black uppercase tracking-widest",
                             mkt.status === 'Active' ? 'text-amazon-success' : 'text-gray-400'
                           )}>
                             {mkt.status === 'Active' ? t('statusActive') : t('statusInactive')}
                           </span>
                        </div>
                        <button className="text-[11px] font-black text-amazon-link hover:underline uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Going on vacation? ›</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Right Card: Manage Your Services */}
      <div className="col-span-12 lg:col-span-5">
        <Card 
          title={t('manageServices')} 
          className="h-full border-amazon-border"
          headerAction={<HelpCircle size={14} className="text-gray-400 cursor-pointer" />}
        >
          <p className="text-xs-amz text-amazon-secondaryText mb-6 leading-relaxed">
            You can manage your existing services and register for new services to grow your business.
          </p>

          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.name} className="flex flex-col py-3 border-b last:border-0 border-gray-50 group">
                <div className="flex items-center justify-between mb-1">
                   <span className="text-sm-amz font-black text-amazon-text group-hover:text-amazon-teal transition-colors">{service.name}</span>
                   <div className="flex items-center gap-1.5 bg-green-50 px-2 py-0.5 rounded-sm border border-green-100 shadow-sm">
                     <CheckCircle2 size={10} className="text-amazon-success" />
                     <span className="text-[9px] font-black text-amazon-success uppercase tracking-widest">{t('registered')}</span>
                   </div>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-[11px] text-gray-500 font-medium">Registered in {service.count} marketplaces</span>
                   <button className="text-[10px] text-amazon-link font-black hover:underline uppercase tracking-tighter">Manage ›</button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 p-5 bg-gray-50 rounded-sm border border-gray-200 border-dashed text-center group cursor-pointer hover:bg-white transition-all">
             <div className="text-xs-amz font-black text-amazon-link uppercase tracking-widest group-hover:scale-105 transition-transform">Register for more services ›</div>
             <p className="text-[10px] text-gray-400 mt-2">Explore advertising, fulfillment, and global selling programs.</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StoreStatus;
