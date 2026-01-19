const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Helper function to write JSON files
async function writeJsonFile(filename, data) {
  try {
    const filePath = path.join(__dirname, '../data', filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
}

// Helper function to read JSON files
async function readJsonFile(filename) {
  try {
    const filePath = path.join(__dirname, '../data', filename);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
}

// Store routes
app.get('/api/stores', async (req, res) => {
  try {
    const stores = await readJsonFile('stores.json');
    res.json({
      success: true,
      data: stores,
      pagination: {
        page: 1,
        limit: 10,
        total: stores.length,
        totalPages: Math.ceil(stores.length / 10)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch stores' });
  }
});

app.get('/api/stores/:id', async (req, res) => {
  try {
    const stores = await readJsonFile('stores.json');
    const store = stores.find(s => s.id === req.params.id);
    if (!store) {
      return res.status(404).json({ success: false, error: 'Store not found' });
    }
    res.json({ success: true, data: store });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch store' });
  }
});

// Products routes
app.get('/api/products', async (req, res) => {
  try {
    let products = await readJsonFile('products.json');
    
    // Filter by store_id if provided
    if (req.query.store_id) {
      products = products.filter(p => p.store_id === req.query.store_id);
    }
    
    // Filter by status
    if (req.query.status && req.query.status !== 'All') {
      products = products.filter(p => p.status === req.query.status);
    }
    
    // Filter by search term
    if (req.query.search) {
      const searchLower = req.query.search.toLowerCase();
      products = products.filter(p => 
        (p.title && p.title.toLowerCase().includes(searchLower)) ||
        (p.asin && p.asin.toLowerCase().includes(searchLower)) ||
        (p.sku && p.sku.toLowerCase().includes(searchLower))
      );
    }
    
    // Ensure all products have required fields with defaults
    products = products.map(p => ({
      ...p,
      price: p.price || 0,
      sales_amount: p.sales_amount || 0,
      inventory: p.inventory || 0,
      units_sold: p.units_sold || 0,
      status: p.status || 'Active'
    }));
    
    res.json({
      success: true,
      data: products,
      pagination: {
        page: 1,
        limit: 10,
        total: products.length,
        totalPages: Math.ceil(products.length / 10)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
});

// Create product endpoint
app.post('/api/products', async (req, res) => {
  try {
    const products = await readJsonFile('products.json');
    const newProduct = {
      id: Date.now().toString(),
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    products.push(newProduct);
    const success = await writeJsonFile('products.json', products);
    
    if (success) {
      res.json({
        success: true,
        data: newProduct
      });
    } else {
      res.status(500).json({ success: false, error: 'Failed to save product' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create product' });
  }
});

// Update product endpoint
app.put('/api/products/:id', async (req, res) => {
  try {
    const products = await readJsonFile('products.json');
    const productIndex = products.findIndex(p => p.id === req.params.id);
    
    if (productIndex === -1) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    products[productIndex] = {
      ...products[productIndex],
      ...req.body,
      updated_at: new Date().toISOString()
    };
    
    const success = await writeJsonFile('products.json', products);
    
    if (success) {
      res.json({
        success: true,
        data: products[productIndex]
      });
    } else {
      res.status(500).json({ success: false, error: 'Failed to update product' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update product' });
  }
});

// Delete product endpoint
app.delete('/api/products/:id', async (req, res) => {
  try {
    const products = await readJsonFile('products.json');
    const filteredProducts = products.filter(p => p.id !== req.params.id);
    
    if (filteredProducts.length === products.length) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    const success = await writeJsonFile('products.json', filteredProducts);
    
    if (success) {
      res.json({ success: true, message: 'Product deleted successfully' });
    } else {
      res.status(500).json({ success: false, error: 'Failed to delete product' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete product' });
  }
});

// Product image upload endpoint
app.post('/api/products/:id/image', async (req, res) => {
  try {
    // For now, return a mock response since we don't have multer configured
    const imageUrl = `/uploads/product-${req.params.id}-${Date.now()}.jpg`;
    
    res.json({
      success: true,
      data: {
        imageUrl: imageUrl
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to upload image' });
  }
});

// Dashboard data endpoint
app.get('/api/dashboard/:storeId', async (req, res) => {
  try {
    const [salesSnapshots, dailySales, products] = await Promise.all([
      readJsonFile('sales_snapshots.json'),
      readJsonFile('daily_sales.json'),
      readJsonFile('products.json')
    ]);
    
    const snapshot = salesSnapshots.find(s => s.store_id === req.params.storeId);
    const storeDailySales = dailySales.filter(s => s.store_id === req.params.storeId);
    const storeProducts = products.filter(p => p.store_id === req.params.storeId);
    
    // Get recent sales data for chart
    const recentSales = storeDailySales
      .slice(-7) // Last 7 days
      .map(day => ({
        time: new Date(day.sale_date || day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        today: day.sales_amount || 0,
        lastYear: (day.sales_amount || 0) * (0.8 + Math.random() * 0.4) // Simulate last year data
      }));
    
    // Calculate today's sales
    const today = new Date().toISOString().split('T')[0];
    const todaySales = storeDailySales.find(s => (s.sale_date || s.date) === today);
    
    const dashboardData = {
      salesToday: todaySales?.sales_amount || Math.floor(Math.random() * 1000) + 100,
      openOrders: Math.floor(Math.random() * 50) + 10,
      messages: Math.floor(Math.random() * 5),
      salesHistory: recentSales.length > 0 ? recentSales : [
        { time: 'Jan 12', today: 1200, lastYear: 1000 },
        { time: 'Jan 13', today: 1800, lastYear: 1500 },
        { time: 'Jan 14', today: 1400, lastYear: 1200 },
        { time: 'Jan 15', today: 900, lastYear: 800 },
        { time: 'Jan 16', today: 1100, lastYear: 1400 },
        { time: 'Jan 17', today: 2800, lastYear: 2200 },
        { time: 'Jan 18', today: 4200, lastYear: 3100 },
      ],
      inventory: storeProducts.map(p => ({
        id: p.id,
        name: p.title || p.name,
        sku: p.sku,
        asin: p.asin,
        status: p.status,
        price: p.price || 0,
        units: p.inventory || 0,
        image: p.image_url || 'https://via.placeholder.com/150'
      })),
      orders: [],
      salesSnapshot: {
        totalOrderItems: snapshot?.total_order_items || 0,
        unitsOrdered: snapshot?.units_ordered || 0,
        orderedProductSales: snapshot?.ordered_product_sales || 0,
        avgUnitsOrderItem: snapshot?.avg_units_per_order || 0,
        avgSalesOrderItem: snapshot?.avg_sales_per_order || 0
      }
    };
    
    console.log(`Dashboard data for store ${req.params.storeId}:`, {
      salesToday: dashboardData.salesToday,
      openOrders: dashboardData.openOrders,
      inventoryCount: dashboardData.inventory.length,
      snapshotExists: !!snapshot
    });
    
    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch dashboard data' });
  }
});

// Sales snapshot endpoint
app.get('/api/sales/snapshot/:storeId', async (req, res) => {
  try {
    const salesSnapshots = await readJsonFile('sales_snapshots.json');
    const snapshot = salesSnapshots.find(s => s.store_id === req.params.storeId);
    
    if (!snapshot) {
      return res.status(404).json({ success: false, error: 'Sales snapshot not found for this store' });
    }
    
    res.json({
      success: true,
      data: snapshot
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch sales snapshot' });
  }
});

// Daily sales endpoint
app.get('/api/sales/daily/:storeId', async (req, res) => {
  try {
    const dailySales = await readJsonFile('daily_sales.json');
    const storeSales = dailySales.filter(s => s.store_id === req.params.storeId);
    
    // Sort by date
    storeSales.sort((a, b) => new Date(a.sale_date || a.date).getTime() - new Date(b.sale_date || b.date).getTime());
    
    res.json({
      success: true,
      data: storeSales
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch daily sales data' });
  }
});

// VOC data endpoint
app.get('/api/voc/data/:storeId', async (req, res) => {
  try {
    let vocData = await readJsonFile('voc_data.json');
    vocData = vocData.filter(v => v.store_id === req.params.storeId);
    
    // Create default VOC data if none exists
    if (vocData.length === 0) {
      const defaultVocData = [
        {
          id: `voc-${Date.now()}-1`,
          store_id: req.params.storeId,
          product_name: 'Wireless Bluetooth Headphones',
          asin: 'B012345678',
          sku_status: 'Active',
          fulfillment: 'Amazon Fulfillment',
          dissatisfaction_rate: 1.2,
          dissatisfaction_orders: 15,
          total_orders: 1250,
          rating: 4.5,
          return_rate: 2.3,
          main_negative_reason: 'Battery life insufficient',
          last_updated: '2026-01-12',
          satisfaction_status: 'Good',
          is_out_of_stock: false,
          image: 'https://via.placeholder.com/50',
        },
        {
          id: `voc-${Date.now()}-2`,
          store_id: req.params.storeId,
          product_name: 'Smart Home Security Camera',
          asin: 'B087654321',
          sku_status: 'Active',
          fulfillment: 'Seller Fulfillment',
          dissatisfaction_rate: 5.8,
          dissatisfaction_orders: 42,
          total_orders: 724,
          rating: 3.8,
          return_rate: 4.1,
          main_negative_reason: 'Connection unstable',
          last_updated: '2026-01-13',
          satisfaction_status: 'Average',
          is_out_of_stock: false,
          image: 'https://via.placeholder.com/50',
        }
      ];
      
      vocData = defaultVocData;
    }
    
    res.json({
      success: true,
      data: vocData
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch VOC data' });
  }
});

// VOC summary endpoint
app.get('/api/voc/summary/:storeId', async (req, res) => {
  try {
    let vocData = await readJsonFile('voc_data.json');
    vocData = vocData.filter(v => v.store_id === req.params.storeId);
    
    // Calculate summary statistics
    const summary = vocData.reduce((acc, item) => {
      const status = item.satisfaction_status || 'Average';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    
    // Ensure all status categories exist
    const defaultSummary = {
      'Excellent': 0,
      'Good': 0,
      'Average': 0,
      'Poor': 0,
      'Very Poor': 0,
      ...summary
    };
    
    res.json({
      success: true,
      data: defaultSummary
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch VOC summary' });
  }
});

// Missing endpoints for admin panel

// Dashboard config endpoint
app.get('/api/dashboard/config/:storeId', async (req, res) => {
  try {
    const [salesSnapshots, dailySales] = await Promise.all([
      readJsonFile('sales_snapshots.json'),
      readJsonFile('daily_sales.json')
    ]);
    
    const snapshot = salesSnapshots.find(s => s.store_id === req.params.storeId);
    const storeDailySales = dailySales.filter(s => s.store_id === req.params.storeId);
    
    const config = {
      store_id: req.params.storeId,
      snapshot: snapshot || {
        total_order_items: 0,
        units_ordered: 0,
        ordered_product_sales: 0,
        avg_units_per_order: 0,
        avg_sales_per_order: 0
      },
      dailySales: storeDailySales.slice(-30) // Last 30 days
    };
    
    res.json({
      success: true,
      data: config
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch dashboard config' });
  }
});

// Dashboard snapshot endpoint (different from sales snapshot)
app.get('/api/dashboard/snapshot/:storeId', async (req, res) => {
  try {
    const [salesSnapshots, products] = await Promise.all([
      readJsonFile('sales_snapshots.json'),
      readJsonFile('products.json')
    ]);
    
    const snapshot = salesSnapshots.find(s => s.store_id === req.params.storeId);
    const storeProducts = products.filter(p => p.store_id === req.params.storeId);
    
    const dashboardSnapshot = {
      store_id: req.params.storeId,
      total_products: storeProducts.length,
      active_products: storeProducts.filter(p => p.status === 'Active').length,
      total_sales: snapshot?.ordered_product_sales || 0,
      total_orders: snapshot?.total_order_items || 0,
      avg_order_value: snapshot?.avg_sales_per_order || 0,
      last_updated: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: dashboardSnapshot
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch dashboard snapshot' });
  }
});

// Users endpoint for admin panel
app.get('/api/users', async (req, res) => {
  try {
    // Mock users data since we don't have a users.json file
    const users = [
      {
        id: '1',
        name: 'Admin User',
        email: 'admin@technego.com',
        role: 'admin',
        status: 'active',
        created_at: '2026-01-01T00:00:00Z',
        last_login: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Store Manager',
        email: 'manager@technego.com',
        role: 'manager',
        status: 'active',
        created_at: '2026-01-05T00:00:00Z',
        last_login: '2026-01-17T10:30:00Z'
      }
    ];
    
    res.json({
      success: true,
      data: users,
      pagination: {
        page: 1,
        limit: 10,
        total: users.length,
        totalPages: 1
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch users' });
  }
});

// Store endpoint (singular) - different from stores (plural)
app.get('/api/store', async (req, res) => {
  try {
    const stores = await readJsonFile('stores.json');
    // Return the first store as default or based on query params
    const defaultStore = stores[0] || {
      id: '1',
      name: 'Default Store',
      marketplace: 'United States',
      currency: 'USD',
      status: 'active'
    };
    
    res.json({
      success: true,
      data: defaultStore
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch store' });
  }
});

// Update sales snapshot endpoint
app.put('/api/sales/snapshot/:storeId', async (req, res) => {
  try {
    const salesSnapshots = await readJsonFile('sales_snapshots.json');
    const snapshotIndex = salesSnapshots.findIndex(s => s.store_id === req.params.storeId);
    
    if (snapshotIndex === -1) {
      // Create new snapshot if doesn't exist
      const newSnapshot = {
        id: Date.now().toString(),
        store_id: req.params.storeId,
        ...req.body,
        updated_at: new Date().toISOString()
      };
      salesSnapshots.push(newSnapshot);
    } else {
      // Update existing snapshot
      salesSnapshots[snapshotIndex] = {
        ...salesSnapshots[snapshotIndex],
        ...req.body,
        updated_at: new Date().toISOString()
      };
    }
    
    const success = await writeJsonFile('sales_snapshots.json', salesSnapshots);
    
    if (success) {
      res.json({
        success: true,
        data: salesSnapshots[snapshotIndex] || salesSnapshots[salesSnapshots.length - 1]
      });
    } else {
      res.status(500).json({ success: false, error: 'Failed to update sales snapshot' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update sales snapshot' });
  }
});

// Generate daily sales data endpoint
app.post('/api/sales/generate-daily/:storeId', async (req, res) => {
  try {
    const { startDate, endDate, totalSales, totalUnits, volatility = 0.3 } = req.body;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    const dailySales = await readJsonFile('daily_sales.json');
    
    // Remove existing data for this store and date range
    const filteredSales = dailySales.filter(s => 
      s.store_id !== req.params.storeId || 
      new Date(s.sale_date || s.date) < start || 
      new Date(s.sale_date || s.date) > end
    );
    
    // Generate new daily data
    const newDailyData = [];
    const avgDailySales = totalSales / days;
    const avgDailyUnits = totalUnits / days;
    
    for (let i = 0; i < days; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      
      // Add some randomness based on volatility
      const salesMultiplier = 1 + (Math.random() - 0.5) * volatility * 2;
      const unitsMultiplier = 1 + (Math.random() - 0.5) * volatility * 2;
      
      const dailyRecord = {
        id: `daily-${req.params.storeId}-${currentDate.toISOString().split('T')[0]}`,
        store_id: req.params.storeId,
        sale_date: currentDate.toISOString().split('T')[0],
        date: currentDate.toISOString().split('T')[0], // For compatibility
        sales_amount: Math.round(avgDailySales * salesMultiplier * 100) / 100,
        units_sold: Math.round(avgDailyUnits * unitsMultiplier),
        orders_count: Math.round((avgDailyUnits * unitsMultiplier) / (1 + Math.random() * 2)),
        created_at: new Date().toISOString()
      };
      
      newDailyData.push(dailyRecord);
    }
    
    // Combine and save
    const allDailySales = [...filteredSales, ...newDailyData];
    const success = await writeJsonFile('daily_sales.json', allDailySales);
    
    if (success) {
      res.json({
        success: true,
        data: newDailyData,
        message: `Generated ${newDailyData.length} days of sales data`
      });
    } else {
      res.status(500).json({ success: false, error: 'Failed to save daily sales data' });
    }
  } catch (error) {
    console.error('Generate daily sales error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate daily sales data' });
  }
});

// Update dashboard config endpoint
app.put('/api/dashboard/config/:storeId', async (req, res) => {
  try {
    // For now, just return success since we don't have a specific config file
    res.json({
      success: true,
      data: {
        store_id: req.params.storeId,
        ...req.body,
        updated_at: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update dashboard config' });
  }
});

// Update dashboard snapshot endpoint
app.put('/api/dashboard/snapshot/:storeId', async (req, res) => {
  try {
    // For now, just return success since dashboard snapshot is calculated dynamically
    res.json({
      success: true,
      data: {
        store_id: req.params.storeId,
        ...req.body,
        updated_at: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update dashboard snapshot' });
  }
});

// Account Health endpoints
app.get('/api/account-health/:storeId', async (req, res) => {
  try {
    const accountHealthData = await readJsonFile('account_health.json');
    const storeHealth = accountHealthData.find(ah => ah.store_id === req.params.storeId);
    
    if (!storeHealth) {
      return res.status(404).json({ success: false, error: 'Account health data not found for this store' });
    }
    
    res.json({
      success: true,
      data: storeHealth
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch account health data' });
  }
});

app.put('/api/account-health/:storeId', async (req, res) => {
  try {
    const accountHealthData = await readJsonFile('account_health.json');
    const healthIndex = accountHealthData.findIndex(ah => ah.store_id === req.params.storeId);
    
    if (healthIndex === -1) {
      // Create new account health record
      const newHealth = {
        id: `ah-${Date.now()}`,
        store_id: req.params.storeId,
        ...req.body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      accountHealthData.push(newHealth);
    } else {
      // Update existing record
      accountHealthData[healthIndex] = {
        ...accountHealthData[healthIndex],
        ...req.body,
        updated_at: new Date().toISOString()
      };
    }
    
    const success = await writeJsonFile('account_health.json', accountHealthData);
    
    if (success) {
      res.json({
        success: true,
        data: accountHealthData[healthIndex] || accountHealthData[accountHealthData.length - 1]
      });
    } else {
      res.status(500).json({ success: false, error: 'Failed to update account health data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update account health data' });
  }
});

// Selling Applications endpoints
app.get('/api/selling-applications/:storeId', async (req, res) => {
  try {
    let applications = await readJsonFile('selling_applications.json');
    applications = applications.filter(app => app.store_id === req.params.storeId);
    
    // Filter by status if provided
    if (req.query.status && req.query.status !== 'All') {
      applications = applications.filter(app => app.status === req.query.status);
    }
    
    // Filter by search term
    if (req.query.search) {
      const searchLower = req.query.search.toLowerCase();
      applications = applications.filter(app => 
        (app.brand && app.brand.toLowerCase().includes(searchLower)) ||
        (app.category && app.category.toLowerCase().includes(searchLower)) ||
        (app.type && app.type.toLowerCase().includes(searchLower)) ||
        (app.id && app.id.toLowerCase().includes(searchLower))
      );
    }
    
    res.json({
      success: true,
      data: applications,
      pagination: {
        page: 1,
        limit: 10,
        total: applications.length,
        totalPages: Math.ceil(applications.length / 10)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch selling applications' });
  }
});

app.post('/api/selling-applications', async (req, res) => {
  try {
    const applications = await readJsonFile('selling_applications.json');
    const newApplication = {
      id: `APP-${Date.now()}`,
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    applications.push(newApplication);
    const success = await writeJsonFile('selling_applications.json', applications);
    
    if (success) {
      res.json({
        success: true,
        data: newApplication
      });
    } else {
      res.status(500).json({ success: false, error: 'Failed to save selling application' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create selling application' });
  }
});

app.put('/api/selling-applications/:id', async (req, res) => {
  try {
    const applications = await readJsonFile('selling_applications.json');
    const appIndex = applications.findIndex(app => app.id === req.params.id);
    
    if (appIndex === -1) {
      return res.status(404).json({ success: false, error: 'Selling application not found' });
    }
    
    applications[appIndex] = {
      ...applications[appIndex],
      ...req.body,
      updated_at: new Date().toISOString()
    };
    
    const success = await writeJsonFile('selling_applications.json', applications);
    
    if (success) {
      res.json({
        success: true,
        data: applications[appIndex]
      });
    } else {
      res.status(500).json({ success: false, error: 'Failed to update selling application' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update selling application' });
  }
});

// Legal Entity endpoints
app.get('/api/legal-entity/:storeId', async (req, res) => {
  try {
    const legalEntityData = await readJsonFile('legal_entity.json');
    const storeLegalEntity = legalEntityData.find(le => le.store_id === req.params.storeId);
    
    if (!storeLegalEntity) {
      return res.status(404).json({ success: false, error: 'Legal entity data not found for this store' });
    }
    
    res.json({
      success: true,
      data: storeLegalEntity
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch legal entity data' });
  }
});

app.put('/api/legal-entity/:storeId', async (req, res) => {
  try {
    const legalEntityData = await readJsonFile('legal_entity.json');
    const entityIndex = legalEntityData.findIndex(le => le.store_id === req.params.storeId);
    
    if (entityIndex === -1) {
      // Create new legal entity record
      const newEntity = {
        id: `le-${Date.now()}`,
        store_id: req.params.storeId,
        ...req.body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      legalEntityData.push(newEntity);
    } else {
      // Update existing record
      legalEntityData[entityIndex] = {
        ...legalEntityData[entityIndex],
        ...req.body,
        updated_at: new Date().toISOString()
      };
    }
    
    const success = await writeJsonFile('legal_entity.json', legalEntityData);
    
    if (success) {
      res.json({
        success: true,
        data: legalEntityData[entityIndex] || legalEntityData[legalEntityData.length - 1]
      });
    } else {
      res.status(500).json({ success: false, error: 'Failed to update legal entity data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update legal entity data' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Working server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🏪 Stores API: http://localhost:${PORT}/api/stores`);
  console.log(`📦 Products API: http://localhost:${PORT}/api/products`);
  console.log(`📊 Dashboard API: http://localhost:${PORT}/api/dashboard/:storeId`);
  console.log(`💰 Sales API: http://localhost:${PORT}/api/sales/snapshot/:storeId`);
  console.log(`🗣️ VOC API: http://localhost:${PORT}/api/voc/data/:storeId`);
});