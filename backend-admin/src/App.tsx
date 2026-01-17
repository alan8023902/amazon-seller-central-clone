import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout, Menu, Typography } from 'antd';
import { 
  DashboardOutlined, 
  ShopOutlined, 
  ProductOutlined, 
  BarChartOutlined,
  HeartOutlined,
  SettingOutlined 
} from '@ant-design/icons';
import Dashboard from './pages/Dashboard';
import StoreSettings from './pages/StoreSettings';
import ProductManagement from './pages/ProductManagement';
import SalesDataConfig from './pages/SalesDataConfig';
import CXHealthConfig from './pages/CXHealthConfig';
import AccountHealthConfig from './pages/AccountHealthConfig';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const menuItems = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: '仪表盘',
  },
  {
    key: 'store',
    icon: <ShopOutlined />,
    label: '店铺设置',
  },
  {
    key: 'products',
    icon: <ProductOutlined />,
    label: '产品管理',
  },
  {
    key: 'sales',
    icon: <BarChartOutlined />,
    label: '销售数据',
  },
  {
    key: 'cx-health',
    icon: <HeartOutlined />,
    label: 'CX健康',
  },
  {
    key: 'account-health',
    icon: <SettingOutlined />,
    label: '账户健康',
  },
];

function App() {
  const [selectedKey, setSelectedKey] = React.useState('dashboard');

  const handleMenuClick = (e: any) => {
    setSelectedKey(e.key);
  };

  const renderContent = () => {
    switch (selectedKey) {
      case 'dashboard':
        return <Dashboard />;
      case 'store':
        return <StoreSettings />;
      case 'products':
        return <ProductManagement />;
      case 'sales':
        return <SalesDataConfig />;
      case 'cx-health':
        return <CXHealthConfig />;
      case 'account-health':
        return <AccountHealthConfig />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: '#232F3E', 
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center'
      }}>
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          Amazon Seller Central - 数据管理后台
        </Title>
      </Header>
      
      <Layout>
        <Sider width={250} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={handleMenuClick}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
          />
        </Sider>
        
        <Layout style={{ padding: '24px' }}>
          <Content
            style={{
              background: '#fff',
              padding: 24,
              margin: 0,
              minHeight: 280,
              borderRadius: 8,
            }}
          >
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default App;