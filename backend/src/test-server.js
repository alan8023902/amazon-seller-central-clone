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

// Initialize mock data with seed data
let mockData = {
  stores: [...seedData.stores],
  products: [...seedData.products],
  globalSnapshot: { ...seedData.globalSnapshot },
  salesSnapshot: { ...seedData.salesSnapshot },
  dailySales: seedData.generateDailySales('1')
};

// Helper function to generate ID
const generateId = () => Date.now().toString();

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
  mockData.globalSnapshot = {
    ...mockData.globalSnapshot,
    ...req.body,
    updated_at: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: mockData.globalSnapshot
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