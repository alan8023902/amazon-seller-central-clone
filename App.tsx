
import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useStore } from './store';
import MainLayout from './layouts/MainLayout';
import { LoginEmail, LoginPassword, LoginOTP, RegisterPage } from './features/AuthPages';
import Dashboard from './features/Dashboard';
import BusinessReports from './features/BusinessReports';
import Inventory from './features/Inventory';
import AccountHealth from './features/AccountHealth';
import ManageOrders from './features/ManageOrders';
import AddProducts from './features/AddProducts';
import CampaignManager from './features/CampaignManager';
import Shipments from './features/Shipments';
import PerformanceNotifications from './features/PerformanceNotifications';
import SellingApplications from './features/SellingApplications';
import VoiceOfTheCustomer from './features/VoiceOfTheCustomer';
import AddProductsUpload from './features/AddProductsUpload';
import ProductOpportunities from './features/ProductOpportunities';
import Analytics from './features/Analytics';
import ManageStores from './features/ManageStores';
import DevData from './features/DevData';
import AccountOverviewLayout from './layouts/AccountOverviewLayout';
import StoreStatus from './features/StoreStatus';
import BusinessInfo from './features/BusinessInfo';
import Verification from './features/Verification';
import PaymentInfo from './features/PaymentInfo';
import TaxInfo from './features/TaxInfo';
import MerchantToken from './features/MerchantToken';
import LegalEntity from './features/LegalEntity';

// Route Guard Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useStore(state => state.session);
  const location = useLocation();

  if (!session.isLoggedIn) {
    return <Navigate to="/auth/login-email" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const Placeholder = ({ name }: { name: string }) => (
  <div className="p-8 bg-white border rounded-sm animate-in fade-in zoom-in-95 duration-200 shadow-sm min-h-[400px]">
    <h1 className="text-2xl font-black text-amazon-text mb-4 uppercase tracking-tight">{name}</h1>
    <p className="text-amazon-secondaryText leading-relaxed font-medium">This functional module is currently under development in the sandbox environment. Please refer to the official Seller Central documentation for production use cases.</p>
    <div className="mt-12 p-6 border border-dashed border-gray-200 rounded-sm bg-gray-50 flex flex-col items-center">
       <div className="w-12 h-12 border-4 border-amazon-teal border-t-transparent rounded-full animate-spin mb-4"></div>
       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mock Service Initializing...</span>
    </div>
  </div>
);

const Loading = () => (
  <div className="flex items-center justify-center min-h-screen bg-amazon-bg">
    <div className="w-12 h-12 border-4 border-amazon-teal border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  const location = useLocation();
  const isAuth = location.pathname.startsWith("/auth");
  return (
    <div className={isAuth ? "amz-auth" : "amz-console"}>
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Auth Routes */}
        <Route path="/auth/login-email" element={<LoginEmail />} />
        <Route path="/auth/login-password" element={<LoginPassword />} />
        <Route path="/auth/login-otp" element={<LoginOTP />} />
        <Route path="/auth/register" element={<RegisterPage />} />

        {/* Protected App Routes */}
        <Route path="/app" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="orders" element={<ManageOrders />} />
          <Route path="ads" element={<CampaignManager />} />
          <Route path="shipments" element={<Shipments />} />
          <Route path="account-health" element={<AccountHealth />} />
          <Route path="performance-notifications" element={<PerformanceNotifications />} />
          <Route path="add-products" element={<AddProducts />} />
          <Route path="stores" element={<ManageStores />} />
          <Route path="business-reports/sales-dashboard" element={<BusinessReports />} />
          <Route path="voc" element={<VoiceOfTheCustomer />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="product-opportunities" element={<ProductOpportunities />} />
          <Route path="add-products-upload" element={<AddProductsUpload />} />
          <Route path="selling-apps" element={<SellingApplications />} />
          <Route path="verification" element={<Verification />} />
          <Route path="dev-data" element={<DevData />} />
          
          {/* Account Settings Sub-routes */}
          <Route path="settings" element={<AccountOverviewLayout />}>
            <Route index element={<Navigate to="store-status" replace />} />
            <Route path="store-status" element={<StoreStatus />} />
            <Route path="business-info" element={<BusinessInfo />} />
            <Route path="business-info/address" element={<Verification />} />
            <Route path="business-info/token" element={<MerchantToken />} />
            <Route path="business-info/legal" element={<LegalEntity />} />
            <Route path="business-info/:sub" element={<Placeholder name="Business Info Detail" />} />
            <Route path="payment-info" element={<PaymentInfo />} />
            <Route path="shipping-returns" element={<Placeholder name="Shipping and Returns" />} />
            <Route path="tax-info" element={<TaxInfo />} />
            <Route path="account-management" element={<Placeholder name="Account Management" />} />
          </Route>
        </Route>

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
      </Routes>
    </Suspense>
    </div>
  );
}

export default App;
