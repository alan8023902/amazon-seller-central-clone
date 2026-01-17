
import React from 'react';
import { HelpCircle, Search, Download } from 'lucide-react';
import { Card } from '../components/UI';
import { useI18n } from '../hooks/useI18n';

// Star Rating Component
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-xs font-medium text-gray-600">{rating.toFixed(1)}</span>
    </div>
  );
};

// Colored Pill Component
const StatusPill: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case '极差':
        return 'bg-red-100 text-red-700';
      case '不合格':
        return 'bg-orange-100 text-orange-700';
      case '一般':
        return 'bg-yellow-100 text-yellow-700';
      case '良好':
        return 'bg-green-100 text-green-700';
      case '极好':
        return 'bg-green-200 text-green-800';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
      {status}
    </span>
  );
};

const VoiceOfTheCustomer: React.FC = () => {
  const { t } = useI18n();

  // Mock data for satisfaction summary
  const satisfactionSummary = [
    { status: '极好', count: 5, color: 'bg-green-200 text-green-800' },
    { status: '良好', count: 8, color: 'bg-green-100 text-green-700' },
    { status: '一般', count: 3, color: 'bg-yellow-100 text-yellow-700' },
    { status: '不合格', count: 2, color: 'bg-orange-100 text-orange-700' },
    { status: '极差', count: 1, color: 'bg-red-100 text-red-700' },
  ];

  // Mock data for offer listings (13 rows)
  const offerListings = [
    {
      id: 1,
      image: 'https://via.placeholder.com/50',
      productName: 'Wireless Bluetooth Headphones',
      asin: 'B012345678',
      skuStatus: '在售',
      fulfillment: '亚马逊物流',
      dissatisfactionRate: '1.2%',
      dissatisfactionOrders: 15,
      totalOrders: 1250,
      rating: 4.5,
      returnRate: '2.3%',
      mainNegativeReason: '电池续航不足',
      lastUpdated: '2026-01-12',
      satisfactionStatus: '良好',
      isOutOfStock: false
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/50',
      productName: 'Smart Home Security Camera',
      asin: 'B087654321',
      skuStatus: '在售',
      fulfillment: '卖家自配送',
      dissatisfactionRate: '5.8%',
      dissatisfactionOrders: 42,
      totalOrders: 724,
      rating: 3.8,
      returnRate: '4.1%',
      mainNegativeReason: '连接不稳定',
      lastUpdated: '2026-01-13',
      satisfactionStatus: '一般',
      isOutOfStock: false
    },
    {
      id: 3,
      image: 'https://via.placeholder.com/50',
      productName: 'Portable External SSD 1TB',
      asin: 'B098765432',
      skuStatus: '在售',
      fulfillment: '亚马逊物流',
      dissatisfactionRate: '0.5%',
      dissatisfactionOrders: 8,
      totalOrders: 1600,
      rating: 4.9,
      returnRate: '1.2%',
      mainNegativeReason: '无',
      lastUpdated: '2026-01-11',
      satisfactionStatus: '极好',
      isOutOfStock: false
    },
    {
      id: 4,
      image: 'https://via.placeholder.com/50',
      productName: 'Electric Toothbrush with UV Sanitizer',
      asin: 'B076543210',
      skuStatus: '在售',
      fulfillment: '亚马逊物流',
      dissatisfactionRate: '8.9%',
      dissatisfactionOrders: 67,
      totalOrders: 753,
      rating: 3.2,
      returnRate: '6.5%',
      mainNegativeReason: '产品质量问题',
      lastUpdated: '2026-01-13',
      satisfactionStatus: '极差',
      isOutOfStock: false
    },
    {
      id: 5,
      image: 'https://via.placeholder.com/50',
      productName: 'Wireless Charging Pad',
      asin: 'B065432109',
      skuStatus: '在售',
      fulfillment: '卖家自配送',
      dissatisfactionRate: '3.4%',
      dissatisfactionOrders: 23,
      totalOrders: 676,
      rating: 4.1,
      returnRate: '3.0%',
      mainNegativeReason: '充电速度慢',
      lastUpdated: '2026-01-12',
      satisfactionStatus: '合格',
      isOutOfStock: true
    },
    {
      id: 6,
      image: 'https://via.placeholder.com/50',
      productName: 'Fitness Tracker Watch',
      asin: 'B054321098',
      skuStatus: '在售',
      fulfillment: '亚马逊物流',
      dissatisfactionRate: '2.1%',
      dissatisfactionOrders: 34,
      totalOrders: 1619,
      rating: 4.4,
      returnRate: '2.8%',
      mainNegativeReason: '屏幕易刮花',
      lastUpdated: '2026-01-11',
      satisfactionStatus: '良好',
      isOutOfStock: false
    },
    {
      id: 7,
      image: 'https://via.placeholder.com/50',
      productName: 'Smart WiFi Router',
      asin: 'B043210987',
      skuStatus: '在售',
      fulfillment: '卖家自配送',
      dissatisfactionRate: '6.7%',
      dissatisfactionOrders: 52,
      totalOrders: 776,
      rating: 3.5,
      returnRate: '5.2%',
      mainNegativeReason: '设置复杂',
      lastUpdated: '2026-01-13',
      satisfactionStatus: '不合格',
      isOutOfStock: false
    },
    {
      id: 8,
      image: 'https://via.placeholder.com/50',
      productName: 'Waterproof Bluetooth Speaker',
      asin: 'B032109876',
      skuStatus: '在售',
      fulfillment: '亚马逊物流',
      dissatisfactionRate: '1.8%',
      dissatisfactionOrders: 27,
      totalOrders: 1498,
      rating: 4.6,
      returnRate: '2.1%',
      mainNegativeReason: '音质一般',
      lastUpdated: '2026-01-12',
      satisfactionStatus: '良好',
      isOutOfStock: false
    },
    {
      id: 9,
      image: 'https://via.placeholder.com/50',
      productName: 'USB-C Hub Multiport Adapter',
      asin: 'B021098765',
      skuStatus: '在售',
      fulfillment: '亚马逊物流',
      dissatisfactionRate: '0.9%',
      dissatisfactionOrders: 12,
      totalOrders: 1333,
      rating: 4.8,
      returnRate: '1.5%',
      mainNegativeReason: '无',
      lastUpdated: '2026-01-11',
      satisfactionStatus: '极好',
      isOutOfStock: false
    },
    {
      id: 10,
      image: 'https://via.placeholder.com/50',
      productName: 'Gaming Mouse with RGB Lighting',
      asin: 'B010987654',
      skuStatus: '在售',
      fulfillment: '卖家自配送',
      dissatisfactionRate: '4.3%',
      dissatisfactionOrders: 31,
      totalOrders: 721,
      rating: 4.0,
      returnRate: '3.8%',
      mainNegativeReason: '按键不灵敏',
      lastUpdated: '2026-01-13',
      satisfactionStatus: '一般',
      isOutOfStock: false
    },
    {
      id: 11,
      image: 'https://via.placeholder.com/50',
      productName: 'Reusable Silicone Food Storage Bags',
      asin: 'B009876543',
      skuStatus: '在售',
      fulfillment: '亚马逊物流',
      dissatisfactionRate: '1.5%',
      dissatisfactionOrders: 21,
      totalOrders: 1400,
      rating: 4.5,
      returnRate: '2.0%',
      mainNegativeReason: '密封性能差',
      lastUpdated: '2026-01-12',
      satisfactionStatus: '良好',
      isOutOfStock: false
    },
    {
      id: 12,
      image: 'https://via.placeholder.com/50',
      productName: 'LED Desk Lamp with USB Charging',
      asin: 'B097654321',
      skuStatus: '在售',
      fulfillment: '卖家自配送',
      dissatisfactionRate: '2.7%',
      dissatisfactionOrders: 19,
      totalOrders: 704,
      rating: 4.2,
      returnRate: '2.9%',
      mainNegativeReason: '灯光刺眼',
      lastUpdated: '2026-01-11',
      satisfactionStatus: '合格',
      isOutOfStock: false
    },
    {
      id: 13,
      image: 'https://via.placeholder.com/50',
      productName: 'Portable Power Bank 20000mAh',
      asin: 'B086543210',
      skuStatus: '在售',
      fulfillment: '亚马逊物流',
      dissatisfactionRate: '0.7%',
      dissatisfactionOrders: 10,
      totalOrders: 1428,
      rating: 4.7,
      returnRate: '1.3%',
      mainNegativeReason: '无',
      lastUpdated: '2026-01-13',
      satisfactionStatus: '极好',
      isOutOfStock: false
    }
  ];

  return (
    <div className="animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">买家之声</h1>
        <div className="flex items-center text-sm text-gray-600">
          <p>查看您商品的买家满意度状况，了解造成负面买家体验的主要原因，并采取措施改进。</p>
          <a href="#" className="ml-2 text-amazon-link font-medium hover:underline">
            了解更多信息
          </a>
        </div>
      </div>

      {/* Satisfaction Summary Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">您商品的买家满意度状况明细</h2>
          <a href="#" className="flex items-center text-sm text-amazon-link font-medium hover:underline">
            <HelpCircle size={14} className="mr-1" />
            如何衡量买家满意度状况？
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {satisfactionSummary.map((item, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-sm p-4">
              <div className="flex justify-between items-center mb-2">
                <StatusPill status={item.status} />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{item.count}</div>
              <a href="#" className="text-sm text-amazon-link font-medium hover:underline">
                查看商品信息
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Filter/Search Bar */}
      <div className="bg-white border border-gray-200 rounded-sm p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search Input */}
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              placeholder="搜索商品名称、ASIN"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-amazon-orange"
            />
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          {/* Search Button */}
          <button className="px-4 py-2 bg-amazon-orange text-white text-sm font-medium rounded-sm hover:bg-amazon-orange-dark">
            搜索
          </button>
          
          {/* Dropdown Filters */}
          <div className="flex gap-3 flex-wrap">
            <select className="px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-amazon-orange">
              <option>筛选条件</option>
              <option>选项 1</option>
              <option>选项 2</option>
            </select>
            
            <select className="px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-amazon-orange">
              <option>订单配送方</option>
              <option>亚马逊物流</option>
              <option>卖家自配送</option>
            </select>
            
            <select className="px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-amazon-orange">
              <option>买家满意度状况</option>
              <option>极好</option>
              <option>良好</option>
              <option>一般</option>
              <option>不合格</option>
              <option>极差</option>
            </select>
            
            <select className="px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-amazon-orange">
              <option>上次更新时间</option>
              <option>过去 7 天</option>
              <option>过去 30 天</option>
              <option>过去 90 天</option>
            </select>
          </div>
          
          {/* Action Buttons */}
          <div className="ml-auto flex gap-3">
            <button className="px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-sm hover:bg-gray-50">
              清除筛选条件
            </button>
            <button className="px-4 py-2 bg-amazon-orange text-white text-sm font-medium rounded-sm hover:bg-amazon-orange-dark flex items-center">
              <Download size={14} className="mr-1" />
              下载数据
            </button>
          </div>
        </div>
      </div>

      {/* Offer Listings Table */}
      <Card className="!p-0 overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">13 Offer Listings</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="border-b">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">图片</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">商品名称/ASIN</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU 状况</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">订单配送方</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">买家不满意率</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">买家不满意订单</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">订单总数</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">星级评定</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">退货率</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">造成负面买家体验的主要原因</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">上次更新时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">买家满意度状况</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">已显示缺货标记</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {offerListings.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {/* Image */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <img src={item.image} alt={item.productName} className="w-10 h-10 object-cover rounded-sm border border-gray-200" />
                  </td>
                  
                  {/* Product Name/ASIN */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <a href="#" className="text-amazon-link font-medium hover:underline">
                        {item.productName}
                      </a>
                    </div>
                    <div className="text-xs text-gray-500">{item.asin}</div>
                  </td>
                  
                  {/* SKU Status */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{item.skuStatus}</span>
                  </td>
                  
                  {/* Fulfillment */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{item.fulfillment}</span>
                  </td>
                  
                  {/* Dissatisfaction Rate */}
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-medium text-gray-900">{item.dissatisfactionRate}</span>
                  </td>
                  
                  {/* Dissatisfaction Orders */}
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-medium text-gray-900">{item.dissatisfactionOrders}</span>
                  </td>
                  
                  {/* Total Orders */}
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-medium text-gray-900">{item.totalOrders}</span>
                  </td>
                  
                  {/* Rating */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <StarRating rating={item.rating} />
                  </td>
                  
                  {/* Return Rate */}
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-medium text-gray-900">{item.returnRate}</span>
                  </td>
                  
                  {/* Main Negative Reason */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{item.mainNegativeReason}</span>
                  </td>
                  
                  {/* Last Updated */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{item.lastUpdated}</span>
                  </td>
                  
                  {/* Satisfaction Status */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <StatusPill status={item.satisfactionStatus} />
                  </td>
                  
                  {/* Out of Stock */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{item.isOutOfStock ? '是' : '否'}</span>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <button className="text-amazon-link font-medium hover:underline text-sm">
                      查看详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default VoiceOfTheCustomer;
