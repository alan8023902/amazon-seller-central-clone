
import React from 'react';
import { Upload, FileText, Download, HelpCircle, AlertCircle, Clock, ChevronRight } from 'lucide-react';
import { Card, Button } from '../components/UI';

const AddProductsUpload: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-20">
      <h1 className="text-2xl font-bold mb-6">Add Products via Upload</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="border border-amazon-teal bg-blue-50/50 p-4 rounded-sm">
          <div className="text-xs font-black uppercase tracking-widest text-amazon-teal mb-2">Step 1</div>
          <h3 className="font-bold text-sm-amz mb-1">Download Inventory File</h3>
          <p className="text-[11px] text-gray-600 mb-4">Choose the categories you want to list in.</p>
          <Button variant="white" className="h-8 py-0 font-bold text-xs">Choose Category</Button>
        </div>
        <div className="border border-gray-200 p-4 rounded-sm opacity-50">
          <div className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Step 2</div>
          <h3 className="font-bold text-sm-amz mb-1">Fill out Template</h3>
          <p className="text-[11px] text-gray-600">Open in Excel and fill in product details.</p>
        </div>
        <div className="border border-gray-200 p-4 rounded-sm opacity-50">
          <div className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Step 3</div>
          <h3 className="font-bold text-sm-amz mb-1">Upload Your File</h3>
          <p className="text-[11px] text-gray-600">Check for errors before submitting.</p>
        </div>
      </div>

      <Card className="mb-8">
        <h2 className="text-lg font-bold mb-4">Upload your Inventory File</h2>
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 flex flex-col items-center justify-center bg-gray-50 hover:bg-white hover:border-amazon-teal transition-all cursor-pointer group">
           <Upload className="text-gray-300 group-hover:text-amazon-teal mb-4" size={48} />
           <p className="text-sm-amz font-bold text-gray-500 group-hover:text-amazon-text">Drag and drop your file here</p>
           <p className="text-xs text-gray-400 mt-1">Accepts .xls, .xlsx, .txt, .csv formats</p>
           <Button className="w-auto px-8 mt-6 font-bold">Select File</Button>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs-amz text-gray-500">
           <AlertCircle size={14} className="text-amazon-teal" />
           <span>We recommend uploading no more than 5,000 items per file for faster processing.</span>
        </div>
      </Card>

      <Card title="Spreadsheet Upload Status" className="!p-0 overflow-hidden shadow-sm">
        <table className="w-full text-xs-amz">
          <thead>
            <tr className="bg-gray-100 border-b text-gray-600 font-bold uppercase text-[10px]">
              <th className="px-6 py-3 text-left">Batch ID</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-right">Items</th>
              <th className="px-6 py-3 text-left">Submitted</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="px-6 py-4 font-bold text-amazon-link">50129384756</td>
              <td className="px-6 py-4">
                 <div className="flex items-center gap-2">
                    <Clock size={14} className="text-blue-500" />
                    <span>In Progress (45%)</span>
                 </div>
              </td>
              <td className="px-6 py-4 text-right">120</td>
              <td className="px-6 py-4">Today, 11:30 AM</td>
              <td className="px-6 py-4 text-center">
                 <button className="text-gray-400 font-bold cursor-not-allowed" disabled>Processing...</button>
              </td>
            </tr>
            <tr className="bg-gray-50/30">
              <td className="px-6 py-4 font-bold text-amazon-link">50128991234</td>
              <td className="px-6 py-4">
                 <div className="flex items-center gap-2 text-green-600">
                    <FileText size={14} />
                    <span className="font-bold">Done</span>
                 </div>
              </td>
              <td className="px-6 py-4 text-right">85</td>
              <td className="px-6 py-4">Mar 12, 2024</td>
              <td className="px-6 py-4 text-center">
                 <button className="text-amazon-link font-bold hover:underline flex items-center justify-center gap-1 mx-auto">
                    <Download size={14} /> Report
                 </button>
              </td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default AddProductsUpload;
