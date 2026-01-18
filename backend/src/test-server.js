const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const seedData = require('./seed-data');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

// Helper function to generate ID
const generateId = () => Date.now().toString();

// Helper function to generate OTP code
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Initialize mock data with seed data
let mockData = {
  stores: [...seedData.stores],
  products: [...seedData.products],
  globalSnapshot: { ...seedData.globalSnapshot },
  salesSnapshot: { ...seedData.salesSnapshot },
  dailySales: seedData.generateDailySales('1'),
  users: [
    {
      id: '1',
      username: 'demo@example.com',
      password: 'demo123',
      email: 'demo@example.com',
      phone: '',
      otpCode: generateOTP(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      username: 'test@example.com',
      password: 'test123',
      email: 'test@example.com',
      phone: '',
      otpCode: generateOTP(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      username: '+8613800138000',
      password: 'phone123',
      email: '',
      phone: '+8613800138000',
      otpCode: generateOTP(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
};

// Root endpoint - API information
app.get('/', (req, res) => {
  res.json({
    name: 'Amazon Seller Central Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      store: '/api/store',
      products: '/api/products',
      sales: '/api/sales/*',
      dashboard: '/api/dashboard/*'
    },
    documentation: 'API服务器正在运行。请访问具体的API端点。',
    admin_interface: 'http://localhost:3001',
    frontend_app: 'http://localhost:3000'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Store endpoints
app.get('/api/store', (req, res) => {
  res.json({
    success: true,
    data: mockData.stores[0]
  });
});

app.put('/api/store', (req, res) => {
  const updateData = req.body;
  mockData.stores[0] = {
    ...mockData.stores[0],
    ...updateData,
    updated_at: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: mockData.stores[0]
  });
});

// Product endpoints
app.get('/api/products', (req, res) => {
  const { search, status, page = 1, limit = 10 } = req.query;
  let products = [...mockData.products];
  
  // Apply filters
  if (search) {
    const searchLower = search.toLowerCase();
    products = products.filter(p => 
      p.title.toLowerCase().includes(searchLower) ||
      p.sku.toLowerCase().includes(searchLower) ||
      p.asin.toLowerCase().includes(searchLower)
    );
  }
  
  if (status && status !== 'All') {
    products = products.filter(p => p.status === status);
  }
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedProducts = products.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: paginatedProducts,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: products.length,
      totalPages: Math.ceil(products.length / limit)
    }
  });
});

app.get('/api/products/:id', (req, res) => {
  const product = mockData.products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }
  
  res.json({
    success: true,
    data: product
  });
});

app.post('/api/products', (req, res) => {
  const newProduct = {
    id: generateId(),
    store_id: req.body.store_id || '1',
    ...req.body,
    sales_amount: 0,
    units_sold: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  mockData.products.push(newProduct);
  
  res.status(201).json({
    success: true,
    data: newProduct
  });
});

app.put('/api/products/:id', (req, res) => {
  const productIndex = mockData.products.findIndex(p => p.id === req.params.id);
  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }
  
  mockData.products[productIndex] = {
    ...mockData.products[productIndex],
    ...req.body,
    updated_at: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: mockData.products[productIndex]
  });
});

app.delete('/api/products/:id', (req, res) => {
  const productIndex = mockData.products.findIndex(p => p.id === req.params.id);
  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }
  
  mockData.products.splice(productIndex, 1);
  
  res.json({
    success: true,
    message: 'Product deleted successfully'
  });
});

// Sales endpoints
app.get('/api/sales/snapshot/:storeId', (req, res) => {
  res.json({
    success: true,
    data: mockData.salesSnapshot
  });
});

app.put('/api/sales/snapshot/:storeId', (req, res) => {
  mockData.salesSnapshot = {
    ...mockData.salesSnapshot,
    ...req.body,
    snapshot_time: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: mockData.salesSnapshot
  });
});

app.get('/api/sales/daily/:storeId', (req, res) => {
  const { startDate, endDate, limit = 30 } = req.query;
  let dailySales = [...mockData.dailySales];
  
  // Apply date filters if provided
  if (startDate) {
    dailySales = dailySales.filter(sale => sale.sale_date >= startDate);
  }
  if (endDate) {
    dailySales = dailySales.filter(sale => sale.sale_date <= endDate);
  }
  
  // Limit results
  dailySales = dailySales.slice(0, parseInt(limit));
  
  res.json({
    success: true,
    data: dailySales
  });
});

app.post('/api/sales/generate-daily/:storeId', (req, res) => {
  const { days = 30 } = req.body;
  const newDailySales = seedData.generateDailySales(req.params.storeId);
  
  // Replace existing daily sales data
  mockData.dailySales = newDailySales.slice(0, days);
  
  res.json({
    success: true,
    message: `Generated ${mockData.dailySales.length} days of sales data`,
    data: mockData.dailySales
  });
});

app.get('/api/sales/chart-data/:storeId', (req, res) => {
  const { period = '30d' } = req.query;
  let chartData = mockData.dailySales.map(sale => ({
    date: sale.sale_date,
    sales: sale.sales_amount,
    units: sale.units_ordered
  }));
  
  // Sort by date
  chartData.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  res.json({
    success: true,
    data: chartData
  });
});

// Dashboard endpoints
app.get('/api/dashboard/snapshot/:storeId', (req, res) => {
  res.json({
    success: true,
    data: mockData.globalSnapshot
  });
});

app.put('/api/dashboard/snapshot/:storeId', (req, res) => {
  // 处理前端发送的嵌套数据结构
  const { sales, orders, messages, featuredOffer, feedback, payments, ads, inventory } = req.body;
  
  // 转换为后端的扁平结构
  const updateData = {};
  if (sales) {
    updateData.sales_amount = sales.todaySoFar;
  }
  if (orders) {
    updateData.open_orders = orders.totalCount;
  }
  if (messages) {
    updateData.buyer_messages = messages.casesRequiringAttention;
  }
  if (featuredOffer) {
    updateData.featured_offer_percent = featuredOffer.percentage;
  }
  if (feedback) {
    updateData.seller_feedback_rating = feedback.rating;
    updateData.seller_feedback_count = feedback.count;
  }
  if (ads) {
    updateData.ad_sales = ads.sales;
    updateData.ad_impressions = ads.impressions;
  }
  
  mockData.globalSnapshot = {
    ...mockData.globalSnapshot,
    ...updateData,
    updated_at: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: mockData.globalSnapshot
  });
});

// 新增：Dashboard配置API
app.get('/api/dashboard/config/:storeId', (req, res) => {
  res.json({
    success: true,
    data: {
      globalSnapshot: mockData.globalSnapshot,
      welcomeBanner: {
        greeting: 'Good evening',
        healthStatus: 'Healthy',
        healthColor: '#507F00',
        showTour: true,
        showLearnMore: true
      }
    }
  });
});

app.put('/api/dashboard/config/:storeId', (req, res) => {
  const { globalSnapshot, welcomeBanner } = req.body;
  
  if (globalSnapshot) {
    mockData.globalSnapshot = {
      ...mockData.globalSnapshot,
      ...globalSnapshot,
      updated_at: new Date().toISOString()
    };
  }
  
  res.json({
    success: true,
    message: 'Dashboard configuration updated successfully',
    data: {
      globalSnapshot: mockData.globalSnapshot,
      welcomeBanner: welcomeBanner || {
        greeting: 'Good evening',
        healthStatus: 'Healthy',
        healthColor: '#507F00',
        showTour: true,
        showLearnMore: true
      }
    }
  });
});

app.get('/api/dashboard/products/:storeId', (req, res) => {
  const { limit = 5 } = req.query;
  const topProducts = mockData.products
    .filter(p => p.status === 'Active')
    .sort((a, b) => b.sales_amount - a.sales_amount)
    .slice(0, parseInt(limit));
  
  res.json({
    success: true,
    data: topProducts
  });
});

app.get('/api/dashboard/actions/:storeId', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        type: 'inventory_low',
        title: 'Low inventory alert',
        description: '3 products have low inventory',
        priority: 'high',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        type: 'review_response',
        title: 'Customer review needs response',
        description: '2 reviews are awaiting response',
        priority: 'medium',
        created_at: new Date().toISOString()
      }
    ]
  });
});

app.get('/api/dashboard/communications/:storeId', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        type: 'forum_post',
        title: 'New seller performance standards',
        date: new Date().toISOString().split('T')[0],
        views: 1234,
        comments: 56
      },
      {
        id: '2',
        type: 'news',
        title: 'Holiday selling tips and best practices',
        date: new Date().toISOString().split('T')[0],
        views: 987,
        comments: 23
      }
    ]
  });
});

app.get('/api/dashboard/health/:storeId', (req, res) => {
  res.json({
    success: true,
    data: {
      overall_score: 85.2,
      policy_compliance: 92.1,
      performance_metrics: 88.5,
      customer_service: 91.3,
      account_status: 'Healthy',
      active_violations: 0,
      pending_actions: 2
    }
  });
});

// User management endpoints
app.get('/api/users', (req, res) => {
  res.json({
    success: true,
    data: mockData.users
  });
});

app.get('/api/users/:id', (req, res) => {
  const user = mockData.users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  res.json({
    success: true,
    data: user
  });
});

app.post('/api/users', (req, res) => {
  const { username, password, email, phone, isActive = true } = req.body;
  
  // 验证用户名是邮箱或手机号
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);
  const isPhone = /^(\+\d{1,3}[- ]?)?\d{10,}$/.test(username);
  
  if (!isEmail && !isPhone) {
    return res.status(400).json({
      success: false,
      message: '用户名必须是有效的邮箱地址或手机号码'
    });
  }
  
  // Check if username already exists
  const existingUser = mockData.users.find(u => u.username === username);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: '该邮箱或手机号已存在'
    });
  }
  
  const newUser = {
    id: generateId(),
    username,
    password,
    email: isEmail ? username : (email || ''),
    phone: isPhone ? username : (phone || ''),
    otpCode: generateOTP(),
    isActive,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  mockData.users.push(newUser);
  
  res.status(201).json({
    success: true,
    data: newUser,
    message: '用户创建成功'
  });
});

app.put('/api/users/:id', (req, res) => {
  const userIndex = mockData.users.findIndex(u => u.id === req.params.id);
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  const { username, password, email, phone, isActive } = req.body;
  const existingUser = mockData.users[userIndex];
  
  // 如果更新用户名，验证格式
  if (username && username !== existingUser.username) {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);
    const isPhone = /^(\+\d{1,3}[- ]?)?\d{10,}$/.test(username);
    
    if (!isEmail && !isPhone) {
      return res.status(400).json({
        success: false,
        message: '用户名必须是有效的邮箱地址或手机号码'
      });
    }
    
    // Check if username is taken by another user
    const duplicateUser = mockData.users.find(u => u.username === username && u.id !== req.params.id);
    if (duplicateUser) {
      return res.status(400).json({
        success: false,
        message: '该邮箱或手机号已存在'
      });
    }
  }
  
  // Update user data
  const updatedUsername = username || existingUser.username;
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updatedUsername);
  const isPhone = /^(\+\d{1,3}[- ]?)?\d{10,}$/.test(updatedUsername);
  
  mockData.users[userIndex] = {
    ...existingUser,
    username: updatedUsername,
    password: password || existingUser.password,
    email: isEmail ? updatedUsername : (email !== undefined ? email : existingUser.email),
    phone: isPhone ? updatedUsername : (phone !== undefined ? phone : existingUser.phone),
    isActive: isActive !== undefined ? isActive : existingUser.isActive,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: mockData.users[userIndex],
    message: '用户更新成功'
  });
});

app.delete('/api/users/:id', (req, res) => {
  const userIndex = mockData.users.findIndex(u => u.id === req.params.id);
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  mockData.users.splice(userIndex, 1);
  
  res.json({
    success: true,
    message: '用户删除成功'
  });
});

// User authentication endpoint for frontend
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = mockData.users.find(u => 
    u.username === username && 
    u.password === password && 
    u.isActive
  );
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: '用户名或密码错误'
    });
  }
  
  // Return user info without password
  const { password: _, ...userInfo } = user;
  
  res.json({
    success: true,
    data: {
      user: userInfo,
      token: 'mock-jwt-token-' + user.id
    },
    message: '登录成功'
  });
});

// OTP verification endpoint
app.post('/api/auth/verify-otp', (req, res) => {
  const { username, otp } = req.body;
  
  const user = mockData.users.find(u => 
    u.username === username && 
    u.isActive
  );
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: '用户不存在'
    });
  }
  
  if (user.otpCode !== otp) {
    return res.status(401).json({
      success: false,
      message: '验证码错误'
    });
  }
  
  res.json({
    success: true,
    message: '验证码验证成功'
  });
});

// Refresh OTP code endpoint
app.post('/api/users/:id/refresh-otp', (req, res) => {
  const userIndex = mockData.users.findIndex(u => u.id === req.params.id);
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  const newOTP = generateOTP();
  mockData.users[userIndex].otpCode = newOTP;
  mockData.users[userIndex].updatedAt = new Date().toISOString();
  
  res.json({
    success: true,
    data: {
      otpCode: newOTP
    },
    message: '验证码已刷新'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`📦 Available endpoints:`);
  console.log(`   GET  /api/health`);
  console.log(`   GET  /api/store`);
  console.log(`   PUT  /api/store`);
  console.log(`   GET  /api/products`);
  console.log(`   POST /api/products`);
  console.log(`   GET  /api/products/:id`);
  console.log(`   PUT  /api/products/:id`);
  console.log(`   DELETE /api/products/:id`);
  console.log(`   GET  /api/sales/snapshot/:storeId`);
  console.log(`   PUT  /api/sales/snapshot/:storeId`);
  console.log(`   GET  /api/sales/daily/:storeId`);
  console.log(`   POST /api/sales/generate-daily/:storeId`);
  console.log(`   GET  /api/sales/chart-data/:storeId`);
  console.log(`   GET  /api/dashboard/snapshot/:storeId`);
  console.log(`   PUT  /api/dashboard/snapshot/:storeId`);
  console.log(`   GET  /api/dashboard/products/:storeId`);
  console.log(`   GET  /api/dashboard/actions/:storeId`);
  console.log(`   GET  /api/dashboard/communications/:storeId`);
  console.log(`   GET  /api/dashboard/health/:storeId`);
  console.log(`📊 Mock data loaded: ${mockData.products.length} products, ${mockData.dailySales.length} daily sales records`);
});

module.exports = app;