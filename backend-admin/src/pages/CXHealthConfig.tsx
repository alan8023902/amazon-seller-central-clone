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
  Switch
} from 'antd';
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface CXHealthData {
  customerSatisfactionScore: number;
  responseTime: number;
  resolutionRate: number;
  feedbackScore: number;
  communicationQuality: number;
  issueEscalationRate: number;
  customerRetentionRate: number;
  supportTicketsVolume: number;
  averageHandlingTime: number;
  firstContactResolution: number;
}

const CXHealthConfig: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [autoGenerate, setAutoGenerate] = useState(true);

  const defaultValues: CXHealthData = {
    customerSatisfactionScore: 4.2,
    responseTime: 2.5,
    resolutionRate: 85.6,
    feedbackScore: 4.1,
    communicationQuality: 4.3,
    issueEscalationRate: 12.4,
    customerRetentionRate: 92.1,
    supportTicketsVolume: 156,
    averageHandlingTime: 18.5,
    firstContactResolution: 78.9
  };

  const handleSave = async (values: CXHealthData) => {
    setLoading(true);
    try {
      // TODO: 调用API保存CX健康数据
      console.log('Saving CX Health data:', values);
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟API调用
      message.success('CX健康数据保存成功！');
    } catch (error) {
      message.error('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = () => {
    const generatedData = {
      customerSatisfactionScore: Number((Math.random() * 2 + 3).toFixed(1)),
      responseTime: Number((Math.random() * 5 + 1).toFixed(1)),
      resolutionRate: Number((Math.random() * 20 + 75).toFixed(1)),
      feedbackScore: Number((Math.random() * 2 + 3).toFixed(1)),
      communicationQuality: Number((Math.random() * 2 + 3).toFixed(1)),
      issueEscalationRate: Number((Math.random() * 15 + 5).toFixed(1)),
      customerRetentionRate: Number((Math.random() * 15 + 85).toFixed(1)),
      supportTicketsVolume: Math.floor(Math.random() * 200 + 100),
      averageHandlingTime: Number((Math.random() * 20 + 10).toFixed(1)),
      firstContactResolution: Number((Math.random() * 25 + 65).toFixed(1))
    };
    
    form.setFieldsValue(generatedData);
    message.success('已生成新的CX健康数据');
  };

  const resetToDefault = () => {
    form.setFieldsValue(defaultValues);
    message.info('已重置为默认值');
  };

  return (
    <div>
      <Title level={2}>CX健康数据配置</Title>
      <Text type="secondary">
        配置客户体验健康相关的指标数据，这些数据将显示在前端的Account Health页面中。
      </Text>

      <Card style={{ marginTop: 16 }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>CX健康指标</Title>
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
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="客户满意度评分"
                name="customerSatisfactionScore"
                rules={[{ required: true, message: '请输入客户满意度评分' }]}
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

            <Col span={12}>
              <Form.Item
                label="平均响应时间"
                name="responseTime"
                rules={[{ required: true, message: '请输入平均响应时间' }]}
              >
                <InputNumber
                  min={0}
                  step={0.1}
                  style={{ width: '100%' }}
                  addonAfter="小时"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="问题解决率"
                name="resolutionRate"
                rules={[{ required: true, message: '请输入问题解决率' }]}
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
                label="反馈评分"
                name="feedbackScore"
                rules={[{ required: true, message: '请输入反馈评分' }]}
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

            <Col span={12}>
              <Form.Item
                label="沟通质量评分"
                name="communicationQuality"
                rules={[{ required: true, message: '请输入沟通质量评分' }]}
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

            <Col span={12}>
              <Form.Item
                label="问题升级率"
                name="issueEscalationRate"
                rules={[{ required: true, message: '请输入问题升级率' }]}
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
                label="客户保留率"
                name="customerRetentionRate"
                rules={[{ required: true, message: '请输入客户保留率' }]}
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
                label="支持工单数量"
                name="supportTicketsVolume"
                rules={[{ required: true, message: '请输入支持工单数量' }]}
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
                label="平均处理时间"
                name="averageHandlingTime"
                rules={[{ required: true, message: '请输入平均处理时间' }]}
              >
                <InputNumber
                  min={0}
                  step={0.1}
                  style={{ width: '100%' }}
                  addonAfter="分钟"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="首次联系解决率"
                name="firstContactResolution"
                rules={[{ required: true, message: '请输入首次联系解决率' }]}
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

export default CXHealthConfig;