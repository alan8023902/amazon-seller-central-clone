import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  message, 
  Table, 
  Modal, 
  Space,
  Popconfirm,
  Switch,
  Tooltip,
  Typography
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SaveOutlined, 
  ReloadOutlined,
  CopyOutlined 
} from '@ant-design/icons';
import { api } from '../services/api';

const { Text } = Typography;

interface User {
  id: string;
  username: string;
  password: string;
  email?: string;
  phone?: string;
  otpCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3002/api/users');
      const result = await response.json();
      if (result.success) {
        setUsers(result.data);
      }
    } catch (error) {
      message.error('加载用户列表失败');
      console.error('Load users error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      const url = editingUser 
        ? `http://localhost:3002/api/users/${editingUser.id}`
        : 'http://localhost:3002/api/users';
      
      const method = editingUser ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();
      
      if (result.success) {
        message.success(editingUser ? '用户更新成功！' : '用户创建成功！');
        setModalVisible(false);
        setEditingUser(null);
        form.resetFields();
        loadUsers();
      } else {
        message.error(result.message || '操作失败');
      }
    } catch (error) {
      message.error('操作失败，请重试');
      console.error('Save user error:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshOTP = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:3002/api/users/${userId}/refresh-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (result.success) {
        message.success('验证码已刷新！');
        loadUsers(); // 重新加载用户列表
      } else {
        message.error(result.message || '刷新失败');
      }
    } catch (error) {
      message.error('刷新失败，请重试');
      console.error('Refresh OTP error:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success('验证码已复制到剪贴板');
    }).catch(() => {
      message.error('复制失败');
    });
  };

  const handleDelete = async (userId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3002/api/users/${userId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.success) {
        message.success('用户删除成功！');
        loadUsers();
      } else {
        message.error(result.message || '删除失败');
      }
    } catch (error) {
      message.error('删除失败，请重试');
      console.error('Delete user error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue({
      username: user.username,
      email: user.email,
      phone: user.phone,
      isActive: user.isActive,
    });
    setModalVisible(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    form.setFieldsValue({ isActive: true });
    setModalVisible(true);
  };

  const columns = [
    {
      title: '用户名 (邮箱/手机)',
      dataIndex: 'username',
      key: 'username',
      render: (username: string, record: User) => (
        <div>
          <div className="font-medium">{username}</div>
          <div className="text-xs text-gray-500">
            {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username) ? '邮箱' : '手机号'}
          </div>
        </div>
      ),
    },
    {
      title: '联系方式',
      key: 'contact',
      render: (_, record: User) => (
        <div className="text-sm">
          {record.email && <div>📧 {record.email}</div>}
          {record.phone && <div>📱 {record.phone}</div>}
        </div>
      ),
    },
    {
      title: '验证码',
      dataIndex: 'otpCode',
      key: 'otpCode',
      render: (otpCode: string, record: User) => (
        <div className="flex items-center gap-2">
          <Text code copyable={{ text: otpCode, onCopy: () => message.success('验证码已复制') }}>
            {otpCode}
          </Text>
          <Tooltip title="刷新验证码">
            <Button 
              type="text" 
              size="small"
              icon={<ReloadOutlined />}
              onClick={() => refreshOTP(record.id)}
            />
          </Tooltip>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <span style={{ color: isActive ? '#52c41a' : '#ff4d4f' }}>
          {isActive ? '启用' : '禁用'}
        </span>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record: User) => (
        <Space>
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个用户吗？"
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
      <div style={{ marginBottom: 24 }}>
        <h2>前端用户管理</h2>
        <p style={{ color: '#666' }}>
          管理前端登录用户的账号密码和验证码，用户可以使用这些账号登录前端系统。每个用户都有专属的6位数验证码，可以点击刷新按钮重新生成。
        </p>
      </div>

      <Card 
        title="用户列表" 
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAdd}
          >
            添加用户
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      <Modal
        title={editingUser ? '编辑用户' : '添加用户'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingUser(null);
          form.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={{ isActive: true }}
        >
          <Form.Item
            label="用户名 (邮箱或手机号)"
            name="username"
            rules={[
              { required: true, message: '请输入邮箱或手机号' },
              {
                pattern: /^([^\s@]+@[^\s@]+\.[^\s@]+|(\+\d{1,3}[- ]?)?\d{10,})$/,
                message: '请输入有效的邮箱地址或手机号码'
              }
            ]}
          >
            <Input placeholder="请输入邮箱或手机号" />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[
              { required: !editingUser, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' },
            ]}
          >
            <Input.Password 
              placeholder={editingUser ? '留空则不修改密码' : '请输入密码'} 
            />
          </Form.Item>

          <Form.Item
            label="备用邮箱"
            name="email"
            rules={[
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input placeholder="备用邮箱（可选）" />
          </Form.Item>

          <Form.Item
            label="备用手机号"
            name="phone"
            rules={[
              {
                pattern: /^(\+\d{1,3}[- ]?)?\d{10,}$/,
                message: '请输入有效的手机号码'
              }
            ]}
          >
            <Input placeholder="备用手机号（可选）" />
          </Form.Item>

          <Form.Item
            label="状态"
            name="isActive"
            valuePropName="checked"
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                取消
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                icon={<SaveOutlined />}
              >
                {editingUser ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;