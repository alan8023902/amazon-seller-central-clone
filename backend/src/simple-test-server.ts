import express from 'express';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import { dataService } from './services/dataService';
import { Product } from './types/index';

const app = express();
const PORT = 3003;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, GIF, and WebP images are allowed'));
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Simple store routes for testing
app.get('/api/stores', async (req, res) => {
  try {
    const stores = await dataService.readData('stores');
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

app.post('/api/stores', async (req, res) => {
  try {
    const storeData = {
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const store = await dataService.create('stores', storeData);
    res.status(201).json({
      success: true,
      data: store,
      message: 'Store created successfully'
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      error: 'Failed to create store',
      message: error.message 
    });
  }
});

app.get('/api/stores/:id', async (req, res) => {
  try {
    const store = await dataService.findById('stores', req.params.id);
    if (!store) {
      return res.status(404).json({ success: false, error: 'Store not found' });
    }
    return res.json({ success: true, data: store });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch store' });
  }
});

app.put('/api/stores/:id', async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updated_at: new Date().toISOString(),
    };
    
    const store = await dataService.update('stores', req.params.id, updateData);
    if (!store) {
      return res.status(404).json({ success: false, error: 'Store not found' });
    }
    
    return res.json({
      success: true,
      data: store,
      message: 'Store updated successfully'
    });
  } catch (error: any) {
    return res.status(400).json({ 
      success: false, 
      error: 'Failed to update store',
      message: error.message 
    });
  }
});

app.delete('/api/stores/:id', async (req, res) => {
  try {
    const deleted = await dataService.delete('stores', req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Store not found' });
    }
    
    // Delete associated data
    const collections = ['products', 'daily_sales', 'sales_snapshots', 'global_snapshots', 'account_health', 'legal_entity', 'voc_data'];
    const deletedCounts: Record<string, number> = {};
    
    for (const collection of collections) {
      deletedCounts[collection] = await dataService.deleteAllStoreData(collection, req.params.id);
    }
    
    return res.json({
      success: true,
      message: 'Store and all associated data deleted successfully',
      data: { deleted_data: deletedCounts }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to delete store' });
  }
});

// Simple product routes for testing
app.get('/api/products', async (req, res) => {
  try {
    let products = await dataService.readData('products');
    
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

app.post('/api/products', async (req, res) => {
  try {
    const productData = {
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const product = await dataService.create('products', productData);
    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      error: 'Failed to create product',
      message: error.message 
    });
  }
});

// PUT /api/products/:id - Update product
app.put('/api/products/:id', async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updated_at: new Date().toISOString(),
    };
    
    const product = await dataService.update('products', req.params.id, updateData);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    return res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error: any) {
    return res.status(400).json({ 
      success: false, 
      error: 'Failed to update product',
      message: error.message 
    });
  }
});

// DELETE /api/products/:id - Delete product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const deleted = await dataService.delete('products', req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    return res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to delete product' });
  }
});

// POST /api/products/:id/image - Upload product image
app.post('/api/products/:id/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image file provided' });
    }
    
    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ success: false, error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed' });
    }
    
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (req.file.size > maxSize) {
      return res.status(400).json({ success: false, error: 'File size too large. Maximum size is 5MB' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    
    const product = await dataService.update<Product>('products', req.params.id, {
      image_url: imageUrl,
      updated_at: new Date().toISOString(),
    });
    
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    return res.json({
      success: true,
      data: { 
        imageUrl,
        imageFilename: req.file.originalname,
        imageSize: req.file.size
      },
      message: 'Image uploaded successfully',
    });
  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to upload image',
      message: error.message 
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Sales data endpoints
app.get('/api/sales/snapshot/:storeId', async (req, res) => {
  try {
    const salesSnapshots = await dataService.readData('sales_snapshots');
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

app.get('/api/sales/daily/:storeId', async (req, res) => {
  try {
    const dailySales = await dataService.readData('daily_sales');
    const storeSales = dailySales.filter((s: any) => s.store_id === req.params.storeId);
    
    // Sort by date
    storeSales.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    res.json({
      success: true,
      data: storeSales
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch daily sales data' });
  }
});

// Dashboard data endpoint
app.get('/api/dashboard/:storeId', async (req, res) => {
  try {
    const [salesSnapshots, dailySales, products] = await Promise.all([
      dataService.readData('sales_snapshots'),
      dataService.readData('daily_sales'),
      dataService.readData('products')
    ]);
    
    const snapshot = salesSnapshots.find((s: any) => s.store_id === req.params.storeId);
    const storeDailySales = dailySales.filter((s: any) => s.store_id === req.params.storeId);
    const storeProducts = products.filter((p: any) => p.store_id === req.params.storeId);
    
    // Get recent sales data for chart
    const recentSales = storeDailySales
      .slice(-7) // Last 7 days
      .map((day: any) => ({
        time: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        today: day.sales_amount,
        lastYear: day.sales_amount * (0.8 + Math.random() * 0.4) // Simulate last year data
      }));
    
    // Calculate today's sales
    const today = new Date().toISOString().split('T')[0];
    const todaySales = storeDailySales.find((s: any) => s.date === today);
    
    const dashboardData = {
      salesToday: (todaySales as any)?.sales_amount || 0,
      openOrders: Math.floor(Math.random() * 50) + 10, // Random orders
      messages: Math.floor(Math.random() * 5), // Random messages
      salesHistory: recentSales,
      inventory: storeProducts.slice(0, 3).map((p: any) => ({ // Top 3 products
        id: p.id,
        name: p.title,
        sku: p.sku,
        asin: p.asin,
        status: p.status,
        price: p.price,
        units: p.inventory,
        image: p.image_url || 'https://via.placeholder.com/150'
      })),
      orders: [], // Empty for now
      salesSnapshot: snapshot || {
        totalOrderItems: 0,
        unitsOrdered: 0,
        orderedProductSales: 0,
        avgUnitsOrderItem: 0,
        avgSalesOrderItem: 0
      }
    };
    
    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch dashboard data' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Simple test server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🏪 Stores API: http://localhost:${PORT}/api/stores`);
  console.log(`📦 Products API: http://localhost:${PORT}/api/products`);
  console.log(`🗣️ VOC API: http://localhost:${PORT}/api/voc`);
});

// VOC (Voice of Customer) endpoints
app.get('/api/voc/data/:storeId', async (req, res) => {
  try {
    let vocData = await dataService.readData('voc_data');
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
        },
        {
          id: `voc-${Date.now()}-3`,
          store_id: req.params.storeId,
          product_name: 'Portable External SSD 1TB',
          asin: 'B098765432',
          sku_status: 'Active',
          fulfillment: 'Amazon Fulfillment',
          dissatisfaction_rate: 0.5,
          dissatisfaction_orders: 8,
          total_orders: 1600,
          rating: 4.9,
          return_rate: 1.2,
          main_negative_reason: 'None',
          last_updated: '2026-01-11',
          satisfaction_status: 'Excellent',
          is_out_of_stock: false,
          image: 'https://via.placeholder.com/50',
        },
        {
          id: `voc-${Date.now()}-4`,
          store_id: req.params.storeId,
          product_name: 'Electric Toothbrush with UV Sanitizer',
          asin: 'B076543210',
          sku_status: 'Active',
          fulfillment: 'Amazon Fulfillment',
          dissatisfaction_rate: 8.9,
          dissatisfaction_orders: 67,
          total_orders: 753,
          rating: 3.2,
          return_rate: 6.5,
          main_negative_reason: 'Product quality issues',
          last_updated: '2026-01-13',
          satisfaction_status: 'Very Poor',
          is_out_of_stock: false,
          image: 'https://via.placeholder.com/50',
        },
        {
          id: `voc-${Date.now()}-5`,
          store_id: req.params.storeId,
          product_name: 'Wireless Charging Pad',
          asin: 'B065432109',
          sku_status: 'Active',
          fulfillment: 'Seller Fulfillment',
          dissatisfaction_rate: 3.4,
          dissatisfaction_orders: 23,
          total_orders: 676,
          rating: 4.1,
          return_rate: 3.0,
          main_negative_reason: 'Slow charging speed',
          last_updated: '2026-01-12',
          satisfaction_status: 'Average',
          is_out_of_stock: true,
          image: 'https://via.placeholder.com/50',
        },
      ];
      
      // Save default data
      const allVocData = await dataService.readData('voc_data');
      await dataService.writeData('voc_data', [...allVocData, ...defaultVocData]);
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

app.get('/api/voc/summary/:storeId', async (req, res) => {
  try {
    let vocData = await dataService.readData('voc_data');
    vocData = vocData.filter((v: any) => v.store_id === req.params.storeId);
    
    // Calculate satisfaction summary
    const summary = {
      'Excellent': vocData.filter((item: any) => item.satisfaction_status === 'Excellent').length,
      'Good': vocData.filter((item: any) => item.satisfaction_status === 'Good').length,
      'Average': vocData.filter((item: any) => item.satisfaction_status === 'Average').length,
      'Poor': vocData.filter((item: any) => item.satisfaction_status === 'Poor').length,
      'Very Poor': vocData.filter((item: any) => item.satisfaction_status === 'Very Poor').length,
    };
    
    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch VOC summary' });
  }
});

export default app;