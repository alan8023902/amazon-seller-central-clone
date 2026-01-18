import React from 'react';
import { Card, Row, Col, Statistic, Typography, Spin, Alert } from 'antd';
import { ShopOutlined, ProductOutlined, BarChartOutlined, UserOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { productApi, dashboardApi, salesApi } from '../services/api';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  // 获取产品统计
  const { data: productsData, isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['products-stats'],
    queryFn: () => productApi.getProducts({ limit: 100 }),
  });

  // 获取仪表板快照
  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useQuery({
    queryKey: ['dashboard-snapshot'],
    queryFn: () => dashboardApi.getSnapshot('1'),
  });

  // 获取销售快照
  const { data: salesData, isLoading: salesLoading, error: salesError } = useQuery({
    queryKey: ['sales-snapshot'],
    queryFn: () => salesApi.getSalesSnapshot('1'),
  });

  const isLoading = productsLoading || dashboardLoading || salesLoading;
  const hasError = productsError || dashboardError || salesError;

  if (hasError) {
    return (
      <div>
        <Title level={2}>管理后台概览</Title>
        <Alert
          message="API连接错误"
          description="无法连接到后端API服务器。请确保后端服务器正在运行在 http://localhost:3002"
          type="error"
          showIcon
        />
      </div>
    );
  }

  const activeProducts = productsData?.data?.filter((p: any) => p.status === 'Active').length || 0;
  const totalProducts = productsData?.data?.length || 0;
  const totalSales = salesData?.data?.total_order_items || 0;
  const totalOrders = dashboardData?.data?.open_orders || 0;

  return (
    <div>
      <Title level={2}>管理后台概览</Title>
      
      <Spin spinning={isLoading}>
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="店铺数量"
                value={1}
                prefix={<ShopOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="产品数量"
                value={totalProducts}
                prefix={<ProductOutlined />}
                valueStyle={{ color: '#1890ff' }}
                suffix={`(${activeProducts} 活跃)`}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="销售订单项"
                value={totalSales}
                prefix={<BarChartOutlined />}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="待处理订单"
                value={totalOrders}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Card title="快速操作" style={{ height: 300 }}>
              <p>• 管理产品信息和图片</p>
              <p>• 配置销售数据和图表</p>
              <p>• 设置店铺基本信息</p>
              <p>• 调整账户健康指标</p>
              <p>• 生成测试数据</p>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="系统状态" style={{ height: 300 }}>
              <p>✅ 后端API服务正常 (http://localhost:3002)</p>
              <p>✅ 数据库连接正常 ({totalProducts} 产品已加载)</p>
              <p>✅ 销售数据正常 ({totalSales} 订单项)</p>
              <p>✅ 前端应用正常</p>
              <div style={{ marginTop: 16, fontSize: '12px', color: '#666' }}>
                最后更新: {new Date().toLocaleString()}
              </div>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default Dashboard;