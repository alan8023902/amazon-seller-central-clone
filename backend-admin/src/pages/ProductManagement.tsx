import React, { useState } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Input, 
  Select, 
  Modal, 
  Form, 
  InputNumber, 
  message,
  Popconfirm,
  Typography,
  Tag
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '../services/api';

const { Title } = Typography;
const { Option } = Select;

interface Product {
  id: string;
  title: string;
  sku: string;
  asin: string;
  price: number;
  inventory: number;
  status: 'Active' | 'Inactive';
  image_url?: string;
  sales_amount: number;
  units_sold: number;
}

const ProductManagement: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  // 获取产品列表
  const { data: productsResponse, isLoading } = useQuery({
    queryKey: ['products', { search: searchText, status: statusFilter }],
    queryFn: () => productApi.getProducts({ 
      search: searchText || undefined,
      status: statusFilter === 'All' ? undefined : statusFilter as any
    }),
  });

  // 创建产品
  const createProductMutation = useMutation({
    mutationFn: productApi.createProduct,
    onSuccess: () => {
      message.success('产品创建成功！');
      setIsModalVisible(false);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: () => {
      message.error('创建失败，请重试');
    },
  });

  // 更新产品
  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      productApi.updateProduct(id, data),
    onSuccess: () => {
      message.success('产品更新成功！');
      setIsModalVisible(false);
      setEditingProduct(null);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: () => {
      message.error('更新失败，请重试');
    },
  });

  // 删除产品
  const deleteProductMutation = useMutation({
    mutationFn: productApi.deleteProduct,
    onSuccess: () => {
      message.success('产品删除成功！');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: () => {
      message.error('删除失败，请重试');
    },
  });

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    deleteProductMutation.mutate(id);
  };

  const handleSubmit = (values: any) => {
    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data: values });
    } else {
      createProductMutation.mutate({
        ...values,
        store_id: '1', // 默认店铺ID
      });
    }
  };

  const columns = [
    {
      title: '图片',
      dataIndex: 'image_url',
      key: 'image_url',
      width: 80,
      render: (url: string) => (
        url ? (
          <img 
            src={url} 
            alt="Product" 
            style={{ width: 50, height: 50, objectFit: 'cover' }}
          />
        ) : (
          <div style={{ 
            width: 50, 
            height: 50, 
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            无图
          </div>
        )
      ),
    },
    {
      title: '产品名称',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
    },
    {
      title: 'ASIN',
      dataIndex: 'asin',
      key: 'asin',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: '库存',
      dataIndex: 'inventory',
      key: 'inventory',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Active' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: '销售额',
      dataIndex: 'sales_amount',
      key: 'sales_amount',
      render: (amount: number) => `$${amount.toFixed(2)}`,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Product) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个产品吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="link" 
              danger 
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>产品管理</Title>
      
      {/* 搜索和筛选 */}
      <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
        <Input
          placeholder="搜索产品名称、SKU或ASIN"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 120 }}
        >
          <Option value="All">全部状态</Option>
          <Option value="Active">活跃</Option>
          <Option value="Inactive">非活跃</Option>
        </Select>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingProduct(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          新增产品
        </Button>
      </div>

      {/* 产品表格 */}
      <Table
        columns={columns}
        dataSource={productsResponse?.data || []}
        loading={isLoading}
        rowKey="id"
        pagination={{
          total: productsResponse?.pagination?.total || 0,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
        }}
      />

      {/* 新增/编辑产品模态框 */}
      <Modal
        title={editingProduct ? '编辑产品' : '新增产品'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingProduct(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="产品名称"
            name="title"
            rules={[{ required: true, message: '请输入产品名称' }]}
          >
            <Input placeholder="请输入产品名称" />
          </Form.Item>

          <Form.Item
            label="SKU"
            name="sku"
            rules={[{ required: true, message: '请输入SKU' }]}
          >
            <Input placeholder="请输入SKU" />
          </Form.Item>

          <Form.Item
            label="ASIN"
            name="asin"
            rules={[{ required: true, message: '请输入ASIN' }]}
          >
            <Input placeholder="请输入ASIN" />
          </Form.Item>

          <Form.Item
            label="价格"
            name="price"
            rules={[{ required: true, message: '请输入价格' }]}
          >
            <InputNumber
              placeholder="请输入价格"
              min={0}
              step={0.01}
              style={{ width: '100%' }}
              prefix="$"
            />
          </Form.Item>

          <Form.Item
            label="库存"
            name="inventory"
            rules={[{ required: true, message: '请输入库存数量' }]}
          >
            <InputNumber
              placeholder="请输入库存数量"
              min={0}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="状态"
            name="status"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="Active">活跃</Option>
              <Option value="Inactive">非活跃</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={createProductMutation.isPending || updateProductMutation.isPending}
              >
                {editingProduct ? '更新' : '创建'}
              </Button>
              <Button onClick={() => {
                setIsModalVisible(false);
                setEditingProduct(null);
                form.resetFields();
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManagement;