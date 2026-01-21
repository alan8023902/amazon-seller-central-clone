import express from 'express';
import { dataService } from '../services/dataService';
import { 
  SalesSnapshotSchema,
  DailySalesSchema,
  type SalesSnapshot, 
  type DailySales,
  type ApiResponse,
  type SalesDateRange
} from '../types/index';
import { asyncHandler, createError } from '../middleware/errorHandler';

const router = express.Router();

// GET /api/sales?store_id=:storeId - Get sales data by store (for admin compatibility)
router.get('/', asyncHandler(async (req, res) => {
  const { store_id } = req.query;
  
  if (!store_id) {
    throw createError('store_id query parameter is required', 400);
  }
  
  // Redirect to snapshot endpoint for now
  let snapshots = await dataService.findByStoreId<SalesSnapshot>('sales_snapshots', store_id as string);
  let snapshot = snapshots[0];
  
  // Create default snapshot if none exists
  if (!snapshot) {
    snapshot = await dataService.create<SalesSnapshot>('sales_snapshots', {
      store_id: store_id as string,
      total_order_items: 248,
      units_ordered: 192260,
      ordered_product_sales: 18657478,
      avg_units_per_order: 1.14,
      avg_sales_per_order: 110.29,
      snapshot_time: new Date().toISOString(),
    });
  }
  
  const response: ApiResponse<SalesSnapshot> = {
    success: true,
    data: snapshot,
  };
  
  res.json(response);
}));

// GET /api/sales/snapshot/:storeId - Get sales snapshot
router.get('/snapshot/:storeId', asyncHandler(async (req, res) => {
  const { storeId } = req.params;
  
  let snapshots = await dataService.findByStoreId<SalesSnapshot>('sales_snapshots', storeId);
  let snapshot = snapshots[0];
  
  // Create default snapshot if none exists
  if (!snapshot) {
    snapshot = await dataService.create<SalesSnapshot>('sales_snapshots', {
      store_id: storeId,
      total_order_items: 248,
      units_ordered: 192260,
      ordered_product_sales: 18657478,
      avg_units_per_order: 1.14,
      avg_sales_per_order: 110.29,
      snapshot_time: new Date().toISOString(),
    });
  }
  
  const response: ApiResponse<SalesSnapshot> = {
    success: true,
    data: snapshot,
  };
  
  res.json(response);
}));

// PUT /api/sales/snapshot/:storeId - Update sales snapshot
router.put('/snapshot/:storeId', asyncHandler(async (req, res) => {
  const { storeId } = req.params;
  
  const updateData = SalesSnapshotSchema.partial().parse({
    ...req.body,
    snapshot_time: new Date().toISOString(),
  });
  
  let snapshots = await dataService.findByStoreId<SalesSnapshot>('sales_snapshots', storeId);
  let snapshot = snapshots[0];
  
  if (!snapshot) {
    // Create new snapshot with default values
    snapshot = await dataService.create<SalesSnapshot>('sales_snapshots', {
      store_id: storeId,
      total_order_items: updateData.total_order_items || 0,
      units_ordered: updateData.units_ordered || 0,
      ordered_product_sales: updateData.ordered_product_sales || 0,
      avg_units_per_order: updateData.avg_units_per_order || 0,
      avg_sales_per_order: updateData.avg_sales_per_order || 0,
      snapshot_time: new Date().toISOString(),
    });
  } else {
    // Update existing snapshot
    const updatedSnapshot = await dataService.update<SalesSnapshot>('sales_snapshots', snapshot.id, updateData);
    if (!updatedSnapshot) {
      throw createError('Failed to update sales snapshot', 500);
    }
    snapshot = updatedSnapshot;
  }
  
  if (!snapshot) {
    throw createError('Failed to update sales snapshot', 500);
  }
  
  const response: ApiResponse<SalesSnapshot> = {
    success: true,
    data: snapshot,
    message: 'Sales snapshot updated successfully',
  };
  
  res.json(response);
}));

// GET /api/sales/daily/:storeId - Get daily sales data
router.get('/daily/:storeId', asyncHandler(async (req, res) => {
  const { storeId } = req.params;
  const { startDate, endDate } = req.query as unknown as SalesDateRange;
  
  let dailySales = await dataService.findByStoreId<DailySales>('daily_sales', storeId);
  
  // Filter by date range if provided
  if (startDate && endDate) {
    dailySales = dailySales.filter(sale => {
      const saleDate = new Date(sale.sale_date);
      return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
    });
  }
  
  // Sort by date
  dailySales.sort((a, b) => new Date(a.sale_date).getTime() - new Date(b.sale_date).getTime());
  
  const response: ApiResponse<DailySales[]> = {
    success: true,
    data: dailySales,
  };
  
  res.json(response);
}));

// POST /api/sales/generate-daily/:storeId - Generate daily sales data
router.post('/generate-daily/:storeId', asyncHandler(async (req, res) => {
  const { storeId } = req.params;
  const { startDate, endDate, totalSales, totalUnits, volatility = 0.3 } = req.body;
  
  if (!startDate || !endDate || !totalSales || !totalUnits) {
    throw createError('Missing required parameters: startDate, endDate, totalSales, totalUnits', 400);
  }
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  // Clear existing data for this date range
  const existingData = await dataService.findByStoreId<DailySales>('daily_sales', storeId);
  const filteredData = existingData.filter(sale => {
    const saleDate = new Date(sale.sale_date);
    return saleDate < start || saleDate > end;
  });
  
  // Generate new daily data
  const avgSales = totalSales / days;
  const avgUnits = totalUnits / days;
  const generatedData: DailySales[] = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    
    // Add some randomness based on volatility
    const salesMultiplier = 1 + (Math.random() - 0.5) * volatility;
    const unitsMultiplier = 1 + (Math.random() - 0.5) * volatility;
    
    const dailySale = await dataService.create<DailySales>('daily_sales', {
      store_id: storeId,
      sale_date: date.toISOString().split('T')[0],
      sales_amount: Math.round(avgSales * salesMultiplier),
      units_ordered: Math.round(avgUnits * unitsMultiplier),
    });
    
    generatedData.push(dailySale);
  }
  
  // Save all data back
  const allData = [...filteredData, ...generatedData];
  await dataService.writeData('daily_sales', allData);
  
  const response: ApiResponse<DailySales[]> = {
    success: true,
    data: generatedData,
    message: `Generated ${generatedData.length} days of sales data`,
  };
  
  res.json(response);
}));

// GET /api/sales/chart-data/:storeId - Get formatted chart data
router.get('/chart-data/:storeId', asyncHandler(async (req, res) => {
  const { storeId } = req.params;
  const { startDate, endDate } = req.query as unknown as SalesDateRange;
  
  let dailySales = await dataService.findByStoreId<DailySales>('daily_sales', storeId);
  
  // Filter by date range if provided
  if (startDate && endDate) {
    dailySales = dailySales.filter(sale => {
      const saleDate = new Date(sale.sale_date);
      return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
    });
  }
  
  // Sort by date and format for charts
  const chartData = dailySales
    .sort((a, b) => new Date(a.sale_date).getTime() - new Date(b.sale_date).getTime())
    .map(sale => ({
      date: sale.sale_date,
      units: sale.units_ordered,
      sales: sale.sales_amount,
      // Generate comparison data (mock last year data)
      lastYearUnits: Math.round(sale.units_ordered * (0.9 + Math.random() * 0.2)),
      lastYearSales: Math.round(sale.sales_amount * (0.9 + Math.random() * 0.2)),
    }));
  
  const response: ApiResponse = {
    success: true,
    data: chartData,
  };
  
  res.json(response);
}));

// GET /api/sales/snapshot/:storeId - Get sales snapshot data
router.get('/snapshot/:storeId', asyncHandler(async (req, res) => {
  const { storeId } = req.params;
  
  try {
    // Read sales snapshot data directly from JSON file
    const filePath = require('path').join(__dirname, '../../data/sales_snapshots.json');
    const salesSnapshotsData = require('fs-extra').readJsonSync(filePath);
    
    // Find snapshot for the specific store
    let storeSnapshot = salesSnapshotsData.find((snapshot: any) => snapshot.store_id === storeId);
    
    // If store snapshot not found, create default data
    if (!storeSnapshot) {
      console.log(`Creating default sales snapshot data for store: ${storeId}`);
      
      storeSnapshot = {
        id: require('crypto').randomUUID(),
        store_id: storeId,
        total_order_items: 154066,
        units_ordered: 174714,
        ordered_product_sales: 19701989.13,
        avg_units_per_order_item: 1.13,
        avg_sales_per_order_item: 127.88,
        snapshot_time: new Date().toISOString()
      };
      
      // Add to array and save
      salesSnapshotsData.push(storeSnapshot);
      require('fs-extra').writeJsonSync(filePath, salesSnapshotsData, { spaces: 2 });
    }
    
    const response: ApiResponse<any> = {
      success: true,
      data: storeSnapshot,
    };
    
    res.json(response);
  } catch (error) {
    console.error('Sales snapshot error:', error);
    throw createError('Failed to fetch sales snapshot data', 500);
  }
}));

// PUT /api/sales/snapshot/:storeId - Update sales snapshot data
router.put('/snapshot/:storeId', asyncHandler(async (req, res) => {
  const { storeId } = req.params;
  const { 
    total_order_items, 
    units_ordered, 
    ordered_product_sales, 
    avg_units_per_order_item, 
    avg_sales_per_order_item,
    snapshot_time 
  } = req.body;
  
  try {
    // Read sales snapshot data directly from JSON file
    const filePath = require('path').join(__dirname, '../../data/sales_snapshots.json');
    const salesSnapshotsData = require('fs-extra').readJsonSync(filePath);
    
    // Find existing snapshot or create new one
    const existingIndex = salesSnapshotsData.findIndex((snapshot: any) => snapshot.store_id === storeId);
    
    const updatedSnapshot = {
      id: existingIndex >= 0 ? salesSnapshotsData[existingIndex].id : require('crypto').randomUUID(),
      store_id: storeId,
      total_order_items: parseInt(total_order_items) || 0,
      units_ordered: parseInt(units_ordered) || 0,
      ordered_product_sales: parseFloat(ordered_product_sales) || 0,
      avg_units_per_order_item: parseFloat(avg_units_per_order_item) || 0,
      avg_sales_per_order_item: parseFloat(avg_sales_per_order_item) || 0,
      snapshot_time: snapshot_time || new Date().toISOString()
    };
    
    if (existingIndex >= 0) {
      // Update existing
      salesSnapshotsData[existingIndex] = updatedSnapshot;
    } else {
      // Add new
      salesSnapshotsData.push(updatedSnapshot);
    }
    
    // Save the updated data
    require('fs-extra').writeJsonSync(filePath, salesSnapshotsData, { spaces: 2 });
    
    const response: ApiResponse<any> = {
      success: true,
      data: updatedSnapshot,
      message: 'Sales snapshot data updated successfully',
    };
    
    res.json(response);
  } catch (error) {
    console.error('Sales snapshot update error:', error);
    throw createError('Failed to update sales snapshot data', 500);
  }
}));

export = router;