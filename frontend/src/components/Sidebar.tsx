import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, ChevronDown, X } from 'lucide-react';
import { SidebarConfig, SidebarMenuItem } from '../nav/sidebar.config.tsx';
import { useI18n } from '../hooks/useI18n';
import { cn } from '../utils/cn';

interface SidebarProps {
  config: SidebarConfig;
}

const Sidebar: React.FC<SidebarProps> = ({ config }) => {
  const location = useLocation();
  const { t } = useI18n();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  // 检查菜单项是否激活
  const isActive = (item: SidebarMenuItem): boolean => {
    if (item.activePrefix) {
      return location.pathname.startsWith(item.activePrefix);
    }
    return location.pathname === item.path;
  };

  // 切换菜单项的展开状态
  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // 渲染菜单项
  const renderMenuItem = (item: SidebarMenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isItemActive = isActive(item);
    const isSectionExpanded = expandedSections[item.id] || hasChildren && item.children.some(child => isActive(child));

    return (
      <div key={item.id}>
        <div
          className={cn(
            'flex items-center justify-between px-4 py-2 text-sm cursor-pointer transition-all border-l-[3px]',
            isItemActive
              ? 'bg-white text-amazon-teal font-bold border-amazon-teal'
              : 'text-gray-600 border-transparent hover:bg-gray-100 hover:text-amazon-link'
          )}
          style={{ paddingLeft: `${level * 16}px` }}
        >
          <Link
            to={item.path}
            className="flex items-center gap-2 flex-1"
          >
            {item.icon && <span className="text-gray-400">{item.icon}</span>}
            <span className={cn('truncate', isItemActive && 'font-bold')}>{t(item.label)}</span>
          </Link>

          {hasChildren && (
            <button
              onClick={() => toggleSection(item.id)}
              className="text-gray-400 hover:text-amazon-teal"
            >
              {isSectionExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </button>
          )}
        </div>

        {hasChildren && isSectionExpanded && (
          <div>
            {item.children?.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#EEF0F3] border-r border-gray-200 overflow-hidden">
      {/* 顶部关闭行 */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center">
        <button className="flex items-center gap-2 text-sm font-bold uppercase text-gray-700 hover:text-amazon-teal transition-colors">
          <X size={14} />
          <span>{t('closeReportsMenu')}</span>
        </button>
      </div>
      
      {/* 菜单内容 */}
      <div className="py-2">
        {config.items.map(item => renderMenuItem(item))}
      </div>
    </div>
  );
};

export default Sidebar;
