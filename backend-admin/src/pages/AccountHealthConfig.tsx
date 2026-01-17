import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  InputNumber, 
  Button, 
  Space, 
  Typography, 
  Divider,
  Row,
  Col,
  message,
  Switch,
  Select,
  Tag
} from 'antd';
import { SaveOutlined, ReloadOutlined, WarningOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

interface AccountHealthData {
  overallHealthScore: number;
  policyCompliance: number;
  performanceMetrics: number;
  customerServiceMetrics: number;
  shippingPerformance: number;
  returnDefectRate: number;
  orderDefectRate: number;
  lateShipmentRate: number;
  preOrderCancellationRate: number;
  validTrackingRate: number;
  onTimeDeliveryRate: number;
  customerFeedbackScore: number;
  accountStatus: 'Healthy' | 'At Risk' | 'Critical';
  activeViolations: number;
  pendingActions: number;
}

const AccountHealthConfig: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [autoGenerate, setAutoGenerate] = useState(true);

  const defaultValues: AccountHealthData = {
    overallHealthScore: 85.2,
    policyCompliance: 92.1,
    performanceMetrics: 88.5,
    customerServiceMetrics: 91.3,
    shippingPerformance: 89.7,
    returnDefectRate: 2.1,
    orderDefectRate: 1.8,
    lateShipmentRate: 3.2,
    preOrderCancellationRate: 1.5,
    validTrackingRate: 98.5,
    onTimeDeliveryRate: 94.2,
    customerFeedbackScore: 4.3,
    accountStatus: 'Healthy',
    activeViolations: 0,
    pendingActions: 2
  };

  const handleSave = async (values: AccountHealthData) => {
    setLoading(true);
    try {
      // TODO: 调用API保存账户健康数据
      console.log('Saving Account Health data:', values);
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟API调用
      message.success('账户健康数据保存成功！');
    } catch (error) {
      message.error('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = () => {
    const generatedData = {
      overallHealthScore: Number((Math.random() * 30 + 70).toFixed(1)),
      policyCompliance: Number((Math.random() * 20 + 80).toFixed(1)),
      performanceMetrics: Number((Math.random() * 25 + 75).toFixed(1)),
      customerServiceMetrics: Number((Math.random() * 20 + 80).toFixed(1)),
      shippingPerformance: Number((Math.random() * 25 + 75).toFixed(1)),
      returnDefectRate: Number((Math.random() * 4 + 1).toFixed(1)),
      orderDefectRate: Number((Math.random() * 3 + 0.5).toFixed(1)),
      lateShipmentRate: Number((Math.random() * 5 + 1).toFixed(1)),
      preOrderCancellationRate: Number((Math.random() * 3 + 0.5).toFixed(1)),
      validTrackingRate: Number((Math.random() * 5 + 95).toFixed(1)),
      onTimeDeliveryRate: Number((Math.random() * 15 + 85).toFixed(1)),
      customerFeedbackScore: Number((Math.random() * 2 + 3).toFixed(1)),
      accountStatus: Math.random() > 0.7 ? 'At Risk' : 'Healthy' as any,
      activeViolations: Math.floor(Math.random() * 3),
      pendingActions: Math.floor(Math.random() * 5)
    };
    
    form.setFieldsValue(generatedData);
    message.success('已生成新的账户健康数据');
  };

  const resetToDefault = () => {
    form.setFieldsValue(defaultValues);
    message.info('已重置为默认值');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Healthy': return 'green';
      case 'At Risk': return 'orange';
      case 'Critical': return 'red';
      default: return 'default';
    }
  };

  return (
    <div>
      <Title level={2}>账户健康数据配置</Title>
      <Text type="secondary">
        配置账户健康相关的指标数据，这些数据将显示在前端的Account Health页面中。
      </Text>

      <Card style={{ marginTop: 16 }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>账户健康指标</Title>
          <Space>
            <Text>自动生成数据：</Text>
            <Switch 
              checked={autoGenerate} 
              onChange={setAutoGenerate}
              checkedChildren="开启"
              unCheckedChildren="关闭"
            />
            <Button icon={<ReloadOutlined />} onClick={handleGenerate}>
              生成随机数据
            </Button>
            <Button onClick={resetToDefault}>
              重置默认值
            </Button>
          </Space>
        </div>

        <Form
          form={form}
          layout="vertical"
          initialValues={defaultValues}
          onFinish={handleSave}
        >
          {/* 总体健康状态 */}
          <Card size="small" style={{ marginBottom: 16, backgroundColor: '#f8f9fa' }}>
            <Title level={5}>总体健康状态</Title>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Form.Item
                  label="总体健康评分"
                  name="overallHealthScore"
                  rules={[{ required: true, message: '请输入总体健康评分' }]}
                >
                  <InputNumber
                    min={0}
                    max={100}
                    step={0.1}
                    style={{ width: '100%' }}
                    addonAfter="%"
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label="账户状态"
                  name="accountStatus"
                  rules={[{ required: true, message: '请选择账户状态' }]}
                >
                  <Select style={{ width: '100%' }}>
                    <Option value="Healthy">
                      <Tag color="green">健康</Tag>
                    </Option>
                    <Option value="At Risk">
                      <Tag color="orange">有风险</Tag>
                    </Option>
                    <Option value="Critical">
                      <Tag color="red">严重</Tag>
                    </Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={8}>
                <Row gutter={8}>
                  <Col span={12}>
                    <Form.Item
                      label="活跃违规"
                      name="activeViolations"
                      rules={[{ required: true, message: '请输入活跃违规数量' }]}
                    >
                      <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        addonAfter="个"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="待处理事项"
                      name="pendingActions"
                      rules={[{ required: true, message: '请输入待处理事项数量' }]}
                    >
                      <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        addonAfter="个"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>

          {/* 详细指标 */}
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="政策合规性"
                name="policyCompliance"
                rules={[{ required: true, message: '请输入政策合规性评分' }]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  step={0.1}
                  style={{ width: '100%' }}
                  addonAfter="%"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="绩效指标"
                name="performanceMetrics"
                rules={[{ required: true, message: '请输入绩效指标评分' }]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  step={0.1}
                  style={{ width: '100%' }}
                  addonAfter="%"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="客户服务指标"
                name="customerServiceMetrics"
                rules={[{ required: true, message: '请输入客户服务指标评分' }]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  step={0.1}
                  style={{ width: '100%' }}
                  addonAfter="%"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="配送绩效"
                name="shippingPerformance"
                rules={[{ required: true, message: '请输入配送绩效评分' }]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  step={0.1}
                  style={{ width: '100%' }}
                  addonAfter="%"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="退货缺陷率"
                name="returnDefectRate"
                rules={[{ required: true, message: '请输入退货缺陷率' }]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  step={0.1}
                  style={{ width: '100%' }}
                  addonAfter="%"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="订单缺陷率"
                name="orderDefectRate"
                rules={[{ required: true, message: '请输入订单缺陷率' }]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  step={0.1}
                  style={{ width: '100%' }}
                  addonAfter="%"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="延迟发货率"
                name="lateShipmentRate"
                rules={[{ required: true, message: '请输入延迟发货率' }]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  step={0.1}
                  style={{ width: '100%' }}
                  addonAfter="%"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="预订取消率"
                name="preOrderCancellationRate"
                rules={[{ required: true, message: '请输入预订取消率' }]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  step={0.1}
                  style={{ width: '100%' }}
                  addonAfter="%"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="有效跟踪率"
                name="validTrackingRate"
                rules={[{ required: true, message: '请输入有效跟踪率' }]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  step={0.1}
                  style={{ width: '100%' }}
                  addonAfter="%"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="准时交付率"
                name="onTimeDeliveryRate"
                rules={[{ required: true, message: '请输入准时交付率' }]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  step={0.1}
                  style={{ width: '100%' }}
                  addonAfter="%"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="客户反馈评分"
                name="customerFeedbackScore"
                rules={[{ required: true, message: '请输入客户反馈评分' }]}
              >
                <InputNumber
                  min={1}
                  max={5}
                  step={0.1}
                  style={{ width: '100%' }}
                  addonAfter="/ 5.0"
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SaveOutlined />}
                loading={loading}
              >
                保存配置
              </Button>
              <Button onClick={() => form.resetFields()}>
                重置表单
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AccountHealthConfig;