
import React from 'react';
import { ShieldCheck, ChevronRight, ChevronDown } from 'lucide-react';
import { Card, Button } from '../components/UI';
import { useI18n } from '../hooks/useI18n';

const AccountHealth: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Page Title */}
      <h1 className="text-2xl font-black text-amazon-text uppercase tracking-tight mb-4">{t('accountHealth')}</h1>
      
      {/* Intro Paragraph */}
      <p className="text-sm-amz text-amazon-secondaryText leading-relaxed mb-6">
        Your account health is measured against performance targets and policies. Maintain a healthy account to avoid restrictions. 
        <a href="#" className="text-amazon-link font-bold hover:underline ml-1">Contact emergency support</a> if you need immediate assistance.
      </p>

      {/* Top Section */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        {/* Center Banner: Account Health Assurance */}
        <div className="col-span-12 lg:col-span-8">
          <Card className="!p-6 flex items-center gap-4">
            <div className="text-amazon-teal">
              <ShieldCheck size={48} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-amazon-text mb-2">Account Health Assurance</h2>
              <p className="text-sm-amz text-amazon-secondaryText leading-relaxed mb-3">
                Protect your account from unexpected disruptions with our comprehensive health monitoring program.
              </p>
              <a href="#" className="text-amazon-link font-bold hover:underline flex items-center gap-1">
                See what it takes to qualify <ChevronRight size={14} />
              </a>
            </div>
          </Card>
        </div>
        
        {/* Right-side Help Card */}
        <div className="col-span-12 lg:col-span-4">
          <Card className="!p-6">
            <h2 className="text-lg font-bold text-amazon-text mb-2">Need help?</h2>
            <p className="text-sm-amz text-amazon-secondaryText leading-relaxed mb-4">
              Our support team is available to assist you with account health questions and concerns.
            </p>
            <Button variant="yellow" className="w-full">
              Contact Us
            </Button>
          </Card>
        </div>
      </div>

      {/* Main Content: 3-column Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Card: Customer Service Performance */}
        <div className="col-span-12 lg:col-span-4">
          <Card title="Customer Service Performance" className="h-full">
            <div className="space-y-6">
              {/* Order Defect Rate */}
              <div>
                <h3 className="text-sm-amz font-bold text-amazon-text mb-2">Order Defect Rate</h3>
                <p className="text-xs-amz text-amazon-secondaryText mb-4">Target: under 1%</p>
                
                {/* Comparison Table */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-sm p-3">
                    <p className="text-xs-amz text-amazon-secondaryText mb-1">Seller Fulfilled</p>
                    <p className="text-lg font-bold text-amazon-text">3%</p>
                  </div>
                  <div className="bg-gray-50 rounded-sm p-3">
                    <p className="text-xs-amz text-amazon-secondaryText mb-1">Fulfilled by Amazon</p>
                    <p className="text-lg font-bold text-amazon-text">2%</p>
                  </div>
                </div>
                
                {/* Metrics Breakdown */}
                <p className="text-xs-amz text-amazon-secondaryText mb-2">
                  Order Defect Rate consists of three different metrics:
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm-amz text-amazon-secondaryText">Negative feedback</p>
                    <p className="text-sm-amz font-bold text-amazon-text">0%</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm-amz text-amazon-secondaryText">A-to-z Guarantee claims</p>
                    <p className="text-sm-amz font-bold text-amazon-text">0%</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm-amz text-amazon-secondaryText">Chargeback claims</p>
                    <p className="text-sm-amz font-bold text-amazon-text">0%</p>
                  </div>
                </div>
                
                {/* View Details Link */}
                <a href="#" className="text-amazon-link font-bold hover:underline text-sm-amz">
                  View details
                </a>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Middle Card: Policy Compliance */}
        <div className="col-span-12 lg:col-span-4">
          <Card 
            title="Policy Compliance" 
            className="h-full" 
            headerAction={
              <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-bold">
                Healthy
              </span>
            }
          >
            <div className="space-y-6">
              {/* Account Health Rating */}
              <div>
                <h3 className="text-sm-amz font-bold text-amazon-text mb-2">Account Health Rating</h3>
                <p className="text-3xl font-bold text-amazon-text mb-4">982</p>
                
                {/* Horizontal Scale Bar */}
                <div className="relative">
                  <div className="w-full h-4 bg-gray-200 rounded-sm overflow-hidden">
                    <div className="h-full bg-amazon-teal rounded-sm" style={{ width: '98.2%' }}></div>
                  </div>
                  <div className="flex justify-between mt-1 text-[10px] text-amazon-secondaryText">
                    <span>0</span>
                    <span>100</span>
                    <span>200</span>
                    <span>1000</span>
                  </div>
                </div>
              </div>
              
              {/* All Issues List */}
              <div>
                <h3 className="text-sm-amz font-bold text-amazon-text mb-3">All Issues</h3>
                <div className="space-y-2 mb-4">
                  {[
                    'Product Policy Violations',
                    'Listing Policy Violations',
                    'Intellectual Property Violations',
                    'Customer Product Reviews',
                    'Other Policy Violations'
                  ].map((issue, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <p className="text-sm-amz text-amazon-secondaryText">{issue}</p>
                      <p className="text-sm-amz font-bold text-amazon-text">0</p>
                    </div>
                  ))}
                </div>
                
                {/* View All Link */}
                <a href="#" className="text-amazon-link font-bold hover:underline text-sm-amz">
                  View all(0)
                </a>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Right Card: Shipping Performance */}
        <div className="col-span-12 lg:col-span-4">
          <Card 
            title="Shipping Performance" 
            className="h-full" 
            headerAction={
              <div className="flex items-center gap-1 text-amazon-link font-bold text-sm-amz cursor-pointer hover:underline">
                Seller Fulfilled <ChevronDown size={14} />
              </div>
            }
          >
            <div className="space-y-4">
              {/* Metrics List */}
              {[
                { name: 'Late Shipment Rate', value: '0%', target: 'under 4%', period: '30 days' },
                { name: 'Pre-fulfillment Cancel Rate', value: '0%', target: 'under 2.5%', period: '7 days' },
                { name: 'Valid Tracking Rate', value: '99%', target: 'over 95%', period: '30 days' },
                { name: 'On-time Delivery Rate', value: 'N/A', target: 'over 90%', period: '' }
              ].map((metric, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm-amz font-medium text-amazon-text">{metric.name}</p>
                    {metric.period && (
                      <p className="text-[10px] text-amazon-secondaryText">Target: {metric.target}, {metric.period}</p>
                    )}
                    {!metric.period && (
                      <p className="text-[10px] text-amazon-secondaryText">Target: {metric.target}</p>
                    )}
                  </div>
                  <p className="text-sm-amz font-bold text-amazon-text">{metric.value}</p>
                </div>
              ))}
              
              {/* Bottom Links */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <a href="#" className="text-amazon-link font-bold hover:underline text-sm-amz block">
                  View details
                </a>
                <a href="#" className="text-amazon-link font-bold hover:underline text-sm-amz block">
                  View shipping eligibilities here
                </a>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccountHealth;
