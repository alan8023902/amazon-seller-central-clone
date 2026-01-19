import express, { Request, Response } from 'express';
import { dataService } from '../services/dataService';
import { StoreSchema, type Store, type ApiResponse } from '../types/index';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { validateStoreAccess, optionalStoreValidation } from '../middleware/storeValidation';

const router = express.Router();

// GET /api/stores/marketplaces - Get available marketplaces (must be before /:id route)
router.get('/marketplaces', asyncHandler(async (req: Request, res: Response) => {
  const marketplaces = [
    { id: 'United States', name: 'United States', currency: 'USD', symbol: '$' },
    { id: 'Japan', name: 'Japan', currency: 'JPY', symbol: '¥' },
    { id: 'United Kingdom', name: 'United Kingdom', currency: 'GBP', symbol: '£' },
    { id: 'Germany', name: 'Germany', currency: 'EUR', symbol: '€' },
    { id: 'Europe', name: 'Europe', currency: 'EUR', symbol: '€' },
  ];
  
  const response: ApiResponse<typeof marketplaces> = {
    success: true,
    data: marketplaces,
    message: 'Available marketplaces retrieved successfully'
  };
  
  res.json(response);
}));

// GET /api/stores - Get all stores
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const stores = await dataService.readData<Store>('stores');
  
  const response: ApiResponse<Store[]> = {
    success: true,
    data: stores,
    message: `Retrieved ${stores.length} stores`
  };
  
  res.json(response);
}));

// POST /api/stores - Create new store
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  // Validate request body
  const storeData = StoreSchema.omit({ 
    id: true, 
    created_at: true, 
    updated_at: true 
  }).parse(req.body);
  
  // Create new store
  const newStore = await dataService.create<Store>('stores', {
    ...storeData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  
  const response: ApiResponse<Store> = {
    success: true,
    data: newStore,
    message: 'Store created successfully',
  };
  
  res.status(201).json(response);
}));

// GET /api/stores/:id/summary - Get store statistics and summary (must be before /:id route)
router.get('/:id/summary', validateStoreAccess, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const store = req.storeContext?.store;
  
  if (!store) {
    throw createError('Store not found', 404);
  }
  
  // Get store-specific data counts
  // Note: These will be enhanced when we implement store-aware data filtering
  const [products, orders, sales] = await Promise.all([
    dataService.readData('products'),
    dataService.readData('orders'),
    dataService.readData('sales')
  ]);
  
  // For now, return total counts (will be filtered by store_id in future tasks)
  const summary = {
    store: {
      id: store.id,
      name: store.name,
      marketplace: store.country,
      currency_symbol: store.currency_symbol,
      is_active: store.is_active,
      created_at: store.created_at
    },
    statistics: {
      total_products: products.length,
      total_orders: orders.length,
      total_sales_records: sales.length,
      last_updated: new Date().toISOString()
    },
    health: {
      status: store.is_active ? 'active' : 'inactive',
      data_integrity: 'good', // Placeholder for future data validation
      last_sync: new Date().toISOString()
    }
  };
  
  const response: ApiResponse<typeof summary> = {
    success: true,
    data: summary,
    message: 'Store summary retrieved successfully',
  };
  
  res.json(response);
}));

// GET /api/stores/:id - Get specific store by ID
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const stores = await dataService.readData<Store>('stores');
  const store = stores.find(s => s.id === id);
  
  if (!store) {
    throw createError('Store not found', 404);
  }
  
  const response: ApiResponse<Store> = {
    success: true,
    data: store,
  };
  
  res.json(response);
}));

// PUT /api/stores/:id - Update specific store
router.put('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  // Validate request body
  const updateData = StoreSchema.partial().omit({ 
    id: true, 
    created_at: true 
  }).parse({
    ...req.body,
    updated_at: new Date().toISOString(),
  });
  
  const updatedStore = await dataService.update<Store>('stores', id, updateData);
  
  if (!updatedStore) {
    throw createError('Store not found', 404);
  }
  
  const response: ApiResponse<Store> = {
    success: true,
    data: updatedStore,
    message: 'Store updated successfully',
  };
  
  res.json(response);
}));

// DELETE /api/stores/:id - Delete specific store
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  // Check if store exists
  const stores = await dataService.readData<Store>('stores');
  const store = stores.find(s => s.id === id);
  
  if (!store) {
    throw createError('Store not found', 404);
  }
  
  // Delete the store
  const deleted = await dataService.delete('stores', id);
  
  if (!deleted) {
    throw createError('Failed to delete store', 500);
  }
  
  // TODO: In a future task, we'll implement cascade deletion of store-related data
  // For now, we just delete the store record
  
  const response: ApiResponse<null> = {
    success: true,
    data: null,
    message: `Store '${store.name}' deleted successfully`,
  };
  
  res.json(response);
}));

// Legacy endpoints for backward compatibility
// GET /api/store - Get first store (deprecated, use GET /api/stores)
router.get('/legacy', asyncHandler(async (req: Request, res: Response) => {
  const stores = await dataService.readData<Store>('stores');
  
  // For backward compatibility, return the first store or create a default one
  let store = stores[0];
  
  if (!store) {
    store = await dataService.create<Store>('stores', {
      name: 'TYNBO Store',
      country: 'United States',
      currency_symbol: '$',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }
  
  const response: ApiResponse<Store> = {
    success: true,
    data: store,
  };
  
  res.json(response);
}));

// PUT /api/store - Update first store (deprecated, use PUT /api/stores/:id)
router.put('/legacy', asyncHandler(async (req: Request, res: Response) => {
  const stores = await dataService.readData<Store>('stores');
  let store = stores[0];
  
  if (!store) {
    throw createError('Store not found', 404);
  }
  
  // Validate request body
  const updateData = StoreSchema.partial().parse({
    ...req.body,
    updated_at: new Date().toISOString(),
  });
  
  const updatedStore = await dataService.update<Store>('stores', store.id, updateData);
  
  if (!updatedStore) {
    throw createError('Failed to update store', 500);
  }
  
  const response: ApiResponse<Store> = {
    success: true,
    data: updatedStore,
    message: 'Store updated successfully',
  };
  
  res.json(response);
}));

export = router;