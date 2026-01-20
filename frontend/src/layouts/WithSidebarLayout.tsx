import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getSidebarByPath } from '../nav/sidebar.config';
import { cn } from '../utils/cn';

const WithSidebarLayout: React.FC = () => {
  const location = useLocation();
  const sidebarConfig = getSidebarByPath(location.pathname);

  return (
    <div className="flex">
      {/* Sidebar - only show if config exists */}
      {sidebarConfig && (
        <aside className="w-[260px] min-w-[260px] bg-[#EEF0F3] border-r border-gray-200 shrink-0">
          <Sidebar config={sidebarConfig} />
        </aside>
      )}

      {/* Main content */}
      <main
        className={cn(
          "flex-1 p-6",
          sidebarConfig ? "" : "w-full"
        )}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default WithSidebarLayout;