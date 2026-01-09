
import React from 'react';
import { MessageCircle, AlertTriangle, HelpCircle, Search, Filter } from 'lucide-react';
import { Card, Button } from '../components/UI';
import { useI18n } from '../hooks/useI18n';

const VoiceOfTheCustomer: React.FC = () => {
  const { t } = useI18n();
  const products = [
    { id: '1', name: 'Ultra High-Def 4K Smart Projector', health: 'Poor', ncx: '8.4%', returns: 12, reason: 'Defective/Does not work' },
    { id: '2', name: 'Wireless Ergonomic Vertical Mouse', health: 'Good', ncx: '1.2%', returns: 2, reason: 'Accidental order' },
    { id: '3', name: 'Mechanical Gaming Keyboard', health: 'Fair', ncx: '3.5%', returns: 5, reason: 'Better price available' },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('voc')}</h1>
        <button className="flex items-center gap-1 text-xs-amz text-amazon-link font-bold hover:underline">
          <HelpCircle size={14} /> How is health calculated?
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Excellent', count: 12, color: 'text-green-600', bg: 'bg-green-100' },
          { label: 'Good', count: 5, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Fair', count: 2, color: 'text-yellow-600', bg: 'bg-yellow-100' },
          { label: 'Poor', count: 1, color: 'text-red-600', bg: 'bg-red-100' },
        ].map(status => (
          <div key={status.label} className={`${status.bg} p-4 rounded-sm border border-transparent hover:border-gray-300 transition-all cursor-pointer`}>
            <div className={`text-2xl font-black ${status.color}`}>{status.count}</div>
            <div className="text-xs-amz font-bold text-gray-700 uppercase">{status.label}</div>
          </div>
        ))}
      </div>

      <Card className="!p-0 overflow-hidden shadow-md">
        <div className="p-4 border-b bg-gray-50 flex flex-wrap items-center justify-between gap-4">
          <div className="relative">
            <input className="border border-gray-300 rounded-sm py-1.5 pl-10 pr-4 text-sm-amz w-80 amz-input-focus" placeholder="Search by name or ASIN" />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-xs-amz text-gray-500">Filter by CX Health: <span className="font-bold text-amazon-text">All</span></span>
            <Button variant="white" className="w-auto px-4 h-8 font-bold text-xs flex items-center gap-2">
               <Filter size={14} /> Filter
            </Button>
          </div>
        </div>

        <table className="w-full text-xs-amz">
          <thead>
            <tr className="bg-white border-b text-gray-500 font-bold uppercase text-[10px] tracking-wider">
              <th className="px-6 py-4 text-left">Product Details</th>
              <th className="px-6 py-4 text-left">CX Health</th>
              <th className="px-6 py-4 text-right">NCX Rate</th>
              <th className="px-6 py-4 text-right">Returns</th>
              <th className="px-6 py-4 text-left">Top Return Reason</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-5 max-w-xs">
                  <div className="text-amazon-link font-bold truncate">{p.name}</div>
                  <div className="text-[10px] text-gray-400">ASIN: B00X{p.id}YZ</div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      p.health === 'Poor' ? 'bg-red-500' : 
                      p.health === 'Fair' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <span className="font-bold">{p.health}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-right font-bold">{p.ncx}</td>
                <td className="px-6 py-5 text-right font-bold">{p.returns}</td>
                <td className="px-6 py-5">
                   <div className="flex items-center gap-2 text-gray-600 italic">
                      {p.health === 'Poor' ? <AlertTriangle size={14} className="text-red-500" /> : <MessageCircle size={14} />}
                      {p.reason}
                   </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <button className="text-amazon-link font-bold hover:underline">View details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default VoiceOfTheCustomer;
