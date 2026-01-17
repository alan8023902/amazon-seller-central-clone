import React from 'react';
import { Card, Form, Input, Select, Button, message, Typography } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storeApi } from '../services/api';

const { Title } = Typography;
const { Option } = Select;

const StoreSettings: React.FC = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: store, isLoading } = useQuery({
    queryKey: ['store'],
    queryFn: storeApi.getStore,
  });

  const updateStoreMutation = useMutation({
    mutationFn: storeApi.updateStore,
    onSuccess: () => {
      message.success('店铺信息更新成功！');
      queryClient.invalidateQueries({ queryKey: ['store'] });
    },
    onError: () => {
      message.error('更新失败，请重试');
    },
  });

  const handleSubmit = (values: any) => {
    updateStoreMutation.mutate(values);
  };

  React.useEffect(() => {
    if (store) {
      form.setFieldsValue(store);
    }
  }, [store, form]);

  return (
    <div>
      <Title level={2}>店铺设置</Title>
      
      <Card title="基本信息" loading={isLoading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            label="店铺名称"
            name="name"
            rules={[{ required: true, message: '请输入店铺名称' }]}
          >
            <Input placeholder="请输入店铺名称" />
          </Form.Item>

          <Form.Item
            label="国家/地区"
            name="country"
            rules={[{ required: true, message: '请选择国家/地区' }]}
          >
            <Select placeholder="请选择国家/地区">
              <Option value="United States">United States</Option>
              <Option value="Japan">Japan</Option>
              <Option value="United Kingdom">United Kingdom</Option>
              <Option value="Germany">Germany</Option>
              <Option value="Europe">Europe</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="货币符号"
            name="currency_symbol"
            rules={[{ required: true, message: '请输入货币符号' }]}
          >
            <Input placeholder="如: US$, ¥, £, €" />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit"
              loading={updateStoreMutation.isPending}
            >
              保存设置
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default StoreSettings;