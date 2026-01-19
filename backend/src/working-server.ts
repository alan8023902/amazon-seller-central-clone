import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs/promises';

const app = express();
const PORT = 3003;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Helper function to read JSON files
async function readJsonFile(filename: string) {
  try {
    const filePath = path.join(__dirname, '../data', filename);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
}

// Helper function to write JSON files
async function writeJsonFile(filename: string, data: any) {
  try {
    const filePath = path.join(__dirname, '../data', filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
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
    const store = stores.find((s: any) => s.id === req.params.id);
    if (!store) {
      return res.status(404).json({ success: false, error: 'Store not found' });
    }
    return res.json({ success: true, data: store });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch store' });
  }
});

// Products routes
app.get('/api/products', async (req, res) => {
  try {
    let products = await readJsonFile('products.json');
    
    // Filter by store_id if provided
    if (req.query.store_id) {
      products = products.filter((p: any) => p.store_id === req.query.store_id);
    }
    
    // Filter by status
    if (req.query.status && req.query.status !== 'All') {
      products = products.filter((p: any) => p.status === req.query.status);
    }
    
    // Filter by search term
    if (req.query.search) {
      const searchLower = (req.query.search as string).toLowerCase();
      products = products.filter((p: any) => 
        p.title?.toLowerCase().includes(searchLower) ||
        p.asin?.toLowerCase().includes(searchLower) ||
        p.sku?.toLowerCase().includes(searchLower)
      );
    }
    
    // Ensure all products have required fields with defaults
    products = products.map((p: any) => ({
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

// Dashboard data endpoint
app.get('/api/dashboard/:storeId', async (req, res) => {
  try {
    const [salesSnapshots, dailySales, products] = await Promise.all([
      readJsonFile('sales_snapshots.json'),
      readJsonFile('daily_sales.json'),
      readJsonFile('products.json')
    ]);
    
    const snapshot = salesSnapshots.find((s: any) => s.store_id === req.params.storeId);
    const storeDailySales = dailySales.filter((s: any) => s.store_id === req.params.storeId);
    const storeProducts = products.filter((p: any) => p.store_id === req.params.storeId);
    
    // Get recent sales data for chart
    const recentSales = storeDailySales
      .slice(-7) // Last 7 days
      .map((day: any) => ({
        time: new Date(day.sale_date || day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        today: day.sales_amount || 0,
        lastYear: (day.sales_amount || 0) * (0.8 + Math.random() * 0.4) // Simulate last year data
      }));
    
    // Calculate today's sales
    const today = new Date().toISOString().split('T')[0];
    const todaySales = storeDailySales.find((s: any) => (s.sale_date || s.date) === today);
    
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
      inventory: storeProducts.slice(0, 3).map((p: any) => ({
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
    const snapshot = salesSnapshots.find((s: any) => s.store_id === req.params.storeId);
    
    if (!snapshot) {
      return res.status(404).json({ success: false, error: 'Sales snapshot not found for this store' });
    }
    
    return res.json({
      success: true,
      data: snapshot
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch sales snapshot' });
  }
});

// Daily sales endpoint
app.get('/api/sales/daily/:storeId', async (req, res) => {
  try {
    const dailySales = await readJsonFile('daily_sales.json');
    const storeSales = dailySales.filter((s: any) => s.store_id === req.params.storeId);
    
    // Sort by date
    storeSales.sort((a: any, b: any) => new Date(a.sale_date || a.date).getTime() - new Date(b.sale_date || b.date).getTime());
    
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
    vocData = vocData.filter((v: any) => v.store_id === req.params.storeId);
    
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

export default app;