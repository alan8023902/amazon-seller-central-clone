import express, { Request, Response } from 'express';
import { dataService } from '../services/dataService';
import { StoreSchema, type Store, type ApiResponse } from '../types/index';
import { asyncHandler, createError } from '../middleware/errorHandler';

const router = express.Router();

// GET /api/store - Get store information
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const stores = await dataService.readData<Store>('stores');
  
  // For now, return the first store or create a default one
  let store = stores[0];
  
  if (!store) {
    store = await dataService.create<Store>('stores', {
      name: 'TYNBO Store',
      country: 'United States',
      currency_symbol: 'US$',
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

// PUT /api/store - Update store information
router.put('/', asyncHandler(async (req: Request, res: Response) => {
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

// GET /api/store/marketplaces - Get available marketplaces
router.get('/marketplaces', asyncHandler(async (req: Request, res: Response) => {
  const marketplaces = [
    { id: 'United States', name: 'United States', currency: 'USD', symbol: 'US$' },
    { id: 'Japan', name: 'Japan', currency: 'JPY', symbol: '¥' },
    { id: 'United Kingdom', name: 'United Kingdom', currency: 'GBP', symbol: '£' },
    { id: 'Germany', name: 'Germany', currency: 'EUR', symbol: '€' },
    { id: 'Europe', name: 'Europe', currency: 'EUR', symbol: '€' },
  ];
  
  const response: ApiResponse = {
    success: true,
    data: marketplaces,
  };
  
  res.json(response);
}));

export = router;