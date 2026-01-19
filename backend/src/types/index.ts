import { z } from 'zod';

// Marketplace types
export type Marketplace = 'United States' | 'Japan' | 'United Kingdom' | 'Germany' | 'Europe';

// Store Schema
export const StoreSchema = z.object({
  id: z.string(),
  name: z.string(),
  country: z.string().default('United States'),
  currency_symbol: z.string().default('$'),
  is_active: z.boolean().default(true),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Store = z.infer<typeof StoreSchema>;

// Global Snapshot Schema
export const GlobalSnapshotSchema = z.object({
  id: z.string(),
  store_id: z.string(),
  sales_amount: z.number().default(0),
  open_orders: z.number().int().default(0),
  buyer_messages: z.number().int().default(0),
  featured_offer_percent: z.number().int().default(100),
  seller_feedback_rating: z.number().default(5.00),
  seller_feedback_count: z.number().int().default(0),
  payments_balance: z.number().default(0),
  fbm_unshipped: z.number().int().default(0),
  fbm_pending: z.number().int().default(0),
  fba_pending: z.number().int().default(0),
  inventory_performance_index: z.number().int().default(400),
  ad_sales: z.number().default(0),
  ad_impressions: z.number().int().default(0),
  updated_at: z.string(),
});

export type GlobalSnapshot = z.infer<typeof GlobalSnapshotSchema>;

// Product Schema
export const ProductSchema = z.object({
  id: z.string(),
  store_id: z.string(),
  title: z.string(),
  asin: z.string(),
  sku: z.string(),
  image_url: z.string().optional(),
  price: z.number(),
  inventory: z.number().int().default(0),
  fulfillment_type: z.enum(['FBA', 'FBM']).default('FBA'),
  status: z.enum(['Active', 'Inactive']).default('Active'),
  sales_amount: z.number().default(0),
  units_sold: z.number().int().default(0),
  page_views: z.number().int().default(0),
  // CX Health related
  ncx_rate: z.number().default(0),
  ncx_orders: z.number().int().default(0),
  total_orders: z.number().int().default(0),
  star_rating: z.number().default(0),
  cx_health_status: z.enum(['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent']).default('Good'),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Product = z.infer<typeof ProductSchema>;

// Sales Snapshot Schema
export const SalesSnapshotSchema = z.object({
  id: z.string(),
  store_id: z.string(),
  total_order_items: z.number().int().default(0),
  units_ordered: z.number().int().default(0),
  ordered_product_sales: z.number().default(0),
  avg_units_per_order: z.number().default(0),
  avg_sales_per_order: z.number().default(0),
  snapshot_time: z.string(),
});

export type SalesSnapshot = z.infer<typeof SalesSnapshotSchema>;

// Daily Sales Schema
export const DailySalesSchema = z.object({
  id: z.string(),
  store_id: z.string(),
  sale_date: z.string(),
  units_ordered: z.number().int().default(0),
  sales_amount: z.number().default(0),
});

export type DailySales = z.infer<typeof DailySalesSchema>;

// CX Health Summary Schema
export const CXHealthSummarySchema = z.object({
  id: z.string(),
  store_id: z.string(),
  very_poor_count: z.number().int().default(0),
  poor_count: z.number().int().default(0),
  fair_count: z.number().int().default(0),
  good_count: z.number().int().default(0),
  excellent_count: z.number().int().default(0),
  updated_at: z.string(),
});

export type CXHealthSummary = z.infer<typeof CXHealthSummarySchema>;

// Account Health Schema
export const AccountHealthSchema = z.object({
  id: z.string(),
  store_id: z.string(),
  // Customer Service Performance
  order_defect_rate_seller: z.number().default(0),
  order_defect_rate_fba: z.number().default(0),
  negative_feedback_rate: z.number().default(0),
  a2z_claims_rate: z.number().default(0),
  chargeback_rate: z.number().default(0),
  // Policy Compliance
  account_health_rating: z.number().int().default(1000),
  ip_violations: z.number().int().default(0),
  product_auth_complaints: z.number().int().default(0),
  listing_violations: z.number().int().default(0),
  // Shipping Performance
  late_shipment_rate: z.number().default(0),
  cancel_rate: z.number().default(0),
  valid_tracking_rate: z.number().default(99),
  updated_at: z.string(),
});

export type AccountHealth = z.infer<typeof AccountHealthSchema>;

// Legal Entity Schema
export const LegalEntitySchema = z.object({
  id: z.string(),
  store_id: z.string(),
  business_name: z.string().optional(),
  address_line1: z.string().optional(),
  address_line2: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  postal_code: z.string().optional(),
  updated_at: z.string(),
});

export type LegalEntity = z.infer<typeof LegalEntitySchema>;

// Forum Post Schema
export const ForumPostSchema = z.object({
  id: z.string(),
  store_id: z.string(),
  title: z.string(),
  post_date: z.string(),
  views: z.number().int().default(0),
  comments: z.number().int().default(0),
  post_type: z.enum(['FORUM', 'NEWS']).default('FORUM'),
  likes: z.number().int().default(0),
});

export type ForumPost = z.infer<typeof ForumPostSchema>;

// Voice of Customer (VOC) Data Schema
export const VocDataSchema = z.object({
  id: z.string(),
  store_id: z.string(),
  product_name: z.string(),
  asin: z.string(),
  sku_status: z.enum(['Active', 'Inactive']).default('Active'),
  fulfillment: z.string(),
  dissatisfaction_rate: z.number(),
  dissatisfaction_orders: z.number().int(),
  total_orders: z.number().int(),
  rating: z.number(),
  return_rate: z.number(),
  main_negative_reason: z.string(),
  last_updated: z.string(),
  satisfaction_status: z.enum(['Excellent', 'Good', 'Average', 'Poor', 'Very Poor']),
  is_out_of_stock: z.boolean().default(false),
  image: z.string().optional(),
});

export type VocData = z.infer<typeof VocDataSchema>;

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Request types
export interface ProductFilters {
  status?: 'Active' | 'Inactive' | 'All';
  search?: string;
  page?: number;
  limit?: number;
}

export interface SalesDateRange {
  startDate: string;
  endDate: string;
}