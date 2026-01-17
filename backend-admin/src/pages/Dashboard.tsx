import React from 'react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import { ShopOutlined, ProductOutlined, BarChartOutlined, UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  return (
    <div>
      <Title level={2}>管理后台概览</Title>
      
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
              value={5}
              prefix={<ProductOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="销售数据记录"
              value={30}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="活跃用户"
              value={1}
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
          </Card>
        </Col>
        <Col span={12}>
          <Card title="系统状态" style={{ height: 300 }}>
            <p>✅ 后端API服务正常</p>
            <p>✅ 数据库连接正常</p>
            <p>✅ 文件上传功能正常</p>
            <p>✅ 前端应用正常</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;