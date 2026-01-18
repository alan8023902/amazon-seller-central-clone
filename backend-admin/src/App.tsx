import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout, Menu, Typography, Button, message } from 'antd';
import { 
  DashboardOutlined, 
  ShopOutlined, 
  ProductOutlined, 
  BarChartOutlined,
  HeartOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined
} from '@ant-design/icons';
import LoginForm from './components/LoginForm';
import Dashboard from './pages/Dashboard';
import StoreSettings from './pages/StoreSettings';
import ProductManagement from './pages/ProductManagement';
import SalesDataConfig from './pages/SalesDataConfig';
import CXHealthConfig from './pages/CXHealthConfig';
import AccountHealthConfig from './pages/AccountHealthConfig';
import DashboardConfig from './pages/DashboardConfig';
import UserManagement from './pages/UserManagement';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const menuItems = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: '仪表盘',
  },
  {
    key: 'dashboard-config',
    icon: <SettingOutlined />,
    label: 'Dashboard配置',
  },
  {
    key: 'user-management',
    icon: <UserOutlined />,
    label: '用户管理',
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');

  // 默认账号密码
  const defaultCredentials = {
    username: 'admin',
    password: 'admin123'
  };

  const handleLogin = async (credentials: { username: string; password: string; captcha: string }) => {
    // 简单的账号密码验证
    if (credentials.username === defaultCredentials.username && 
        credentials.password === defaultCredentials.password) {
      setIsLoggedIn(true);
      setCurrentUser(credentials.username);
      message.success('登录成功！');
    } else {
      message.error('用户名或密码错误！');
      throw new Error('Login failed');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser('');
    setSelectedKey('dashboard');
    message.success('已退出登录');
  };

  // 如果未登录，显示登录页面
  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const handleMenuClick = (e: any) => {
    setSelectedKey(e.key);
  };

  const renderContent = () => {
    switch (selectedKey) {
      case 'dashboard':
        return <Dashboard />;
      case 'dashboard-config':
        return <DashboardConfig />;
      case 'user-management':
        return <UserManagement />;
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
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          Amazon Seller Central - 数据管理后台
        </Title>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: 'white' }}>
            <UserOutlined /> {currentUser}
          </span>
          <Button 
            type="text" 
            icon={<LogoutOutlined />} 
            onClick={handleLogout}
            style={{ color: 'white' }}
          >
            退出
          </Button>
        </div>
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