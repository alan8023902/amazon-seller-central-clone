
import React from 'react';
import { Card, Button } from '../components/UI';
import { ShieldCheck, MapPin, CheckCircle2, Info } from 'lucide-react';

const LegalEntity: React.FC = () => {
  return (
    <div className="max-w-3xl animate-in fade-in duration-300">
      <h1 className="text-[22px] font-bold text-[#0F1111] mb-6 uppercase tracking-tight">Legal Entity</h1>

      <div className="space-y-6">
        <Card title="Business Identity Status">
           <div className="p-2">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-[#F7FFF7] rounded-full flex items-center justify-center border border-[#007600]/20">
                    <CheckCircle2 className="text-[#007600]" size={28} />
                 </div>
                 <div>
                    <div className="text-[16px] font-bold text-[#007600]">Verified</div>
                    <div className="text-[12px] text-[#565959]">Last updated: Jan 04, 2026</div>
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1 text-[11px] font-bold text-[#565959] uppercase">Legal Business Name</div>
                    <div className="col-span-2 text-[13px] font-bold text-[#0F1111]">EnShZhiXun Technology Co., Ltd.</div>
                 </div>
                 <div className="grid grid-cols-3 gap-4 border-t border-[#F0F2F2] pt-4">
                    <div className="col-span-1 text-[11px] font-bold text-[#565959] uppercase">Address</div>
                    <div className="col-span-2 text-[13px] text-[#565959] leading-relaxed">
                       <span className="font-bold text-[#0F1111]">Shiyan Street, Industrial Park Area 3</span><br />
                       Building 8, Suite 304<br />
                       Guangdong Province, 518000<br />
                       China
                    </div>
                 </div>
                 <div className="grid grid-cols-3 gap-4 border-t border-[#F0F2F2] pt-4">
                    <div className="col-span-1 text-[11px] font-bold text-[#565959] uppercase">Registration Number</div>
                    <div className="col-span-2 text-[13px] font-bold text-[#0F1111]">91440300MA5EXXXX7Y</div>
                 </div>
              </div>

              <div className="mt-10">
                 <Button variant="white" className="w-auto px-10 font-bold h-9 shadow-sm border-[#ADB1B8]">Update Legal Entity</Button>
              </div>
           </div>
        </Card>

        <div className="bg-[#F0F9FF] border border-amazon-teal/20 p-4 rounded-[4px] flex items-start gap-3">
           <Info className="text-amazon-teal shrink-0 mt-0.5" size={18} />
           <div>
              <p className="text-[13px] font-bold text-[#0F1111]">Why is this information important?</p>
              <p className="text-[12px] text-[#565959] mt-1 leading-relaxed">
                 To comply with global tax and financial regulations, Amazon must verify your legal identity. 
                 Any changes to your legal name or address will trigger a new verification process, during which your account access may be limited.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LegalEntity;
