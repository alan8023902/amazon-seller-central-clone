# Design Document

## Introduction

This document outlines the design for the Admin-Frontend Data Synchronization system that enables data consistency between the Amazon Seller Central Admin Interface (port 3001) and Frontend (port 3000) through page refresh synchronization. The system ensures that data modifications in the admin panel are reflected in the frontend when users refresh the page.

## Architecture Overview

### System Components

```
┌─────────────────┐    HTTP API     ┌─────────────────┐    HTTP API     ┌─────────────────┐
│   Frontend      │◄──────────────►│   Backend       │◄──────────────►│   Admin Panel   │
│   (Port 3000)   │                │   (Port 3002)   │                │   (Port 3001)   │
└─────────────────┘                └─────────────────┘                └─────────────────┘
        │                                   │                                   │
        │                                   │                                   │
        ▼                                   ▼                                   ▼
┌─────────────────┐                ┌─────────────────┐                ┌─────────────────┐
│   Zustand       │                │   JSON Files    │                │   Ant Design    │
│   Store         │                │   Database      │                │   Forms         │
└─────────────────┘                └─────────────────┘                └─────────────────┘
```

### Data Flow Architecture

```
Admin Panel Data Change → Backend API Update → JSON File Update → Frontend Page Refresh → Updated Data Display
```

## Technical Design

### 1. Store Context Management

#### Enhanced Store Selection
Both admin and frontend interfaces include store selection dropdowns that:
- Load available stores from backend API
- Maintain selected store in localStorage
- Filter all data requests by selected store ID
- Provide visual indication of current store

#### Store Context Implementation
```typescript
// Shared store context interface
interface StoreContext {
  id: string;
  name: string;
  marketplace: string;
  currency_symbol: string;
  is_active: boolean;
}

// Frontend store management
const useStore = create<AppStore>((set, get) => ({
  currentStore: null,
  selectedStoreId: localStorage.getItem('selectedStoreId') || '',
  
  setCurrentStore: (store: StoreContext) => {
    set({ currentStore: store, selectedStoreId: store.id });
    localStorage.setItem('selectedStoreId', store.id);
  },
  
  loadStoreData: async () => {
    const { selectedStoreId } = get();
    if (selectedStoreId) {
      // Load all store-specific data
      await Promise.all([
        loadDashboardData(selectedStoreId),
        loadProductsData(selectedStoreId),
        loadSalesData(selectedStoreId)
      ]);
    }
  }
}));
```

### 2. API Integration Layer

#### Backend API Endpoints
All API endpoints support store-based filtering:

```typescript
// Dashboard API
GET /api/dashboard/snapshot/:storeId
PUT /api/dashboard/snapshot/:storeId
GET /api/dashboard/config/:storeId
PUT /api/dashboard/config/:storeId

// Products API
GET /api/products?store_id=:storeId&page=1&limit=10
POST /api/products (with store_id in body)
PUT /api/products/:id (validates store ownership)
DELETE /api/products/:id (validates store ownership)

// Sales API
GET /api/sales/snapshot/:storeId
PUT /api/sales/snapshot/:storeId
GET /api/sales/daily/:storeId

// Store Management API
GET /api/stores
POST /api/stores
PUT /api/stores/:id
DELETE /api/stores/:id
```

#### Frontend API Service
```typescript
class BackendApiService {
  private baseURL = 'http://localhost:3002/api';
  
  async getDashboardData(storeId: string) {
    const response = await fetch(`${this.baseURL}/dashboard/snapshot/${storeId}`);
    return response.json();
  }
  
  async getProducts(storeId: string, params?: ProductFilters) {
    const queryParams = new URLSearchParams({ store_id: storeId, ...params });
    const response = await fetch(`${this.baseURL}/products?${queryParams}`);
    return response.json();
  }
  
  async updateDashboard(storeId: string, data: any) {
    const response = await fetch(`${this.baseURL}/dashboard/snapshot/${storeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
}
```

### 3. Data Synchronization Strategy

#### Page Refresh Synchronization
Instead of real-time updates, the system uses page refresh synchronization:

1. **Admin Interface Updates**: When data is modified in admin, it's saved to backend
2. **Backend Storage**: Data is persisted to JSON files immediately
3. **Frontend Refresh**: When frontend page is refreshed, it loads latest data from backend
4. **Store Context Persistence**: Selected store is maintained across refreshes

#### Data Loading Strategy
```typescript
// Frontend data loading on page load/refresh
useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Get current store from localStorage or Zustand
      const storeId = localStorage.getItem('selectedStoreId') || currentStore?.id;
      
      if (!storeId) {
        // Load stores and select first active store
        const stores = await backendApi.getStores();
        const activeStore = stores.find(s => s.is_active) || stores[0];
        if (activeStore) {
          setCurrentStore(activeStore);
          await loadStoreData(activeStore.id);
        }
      } else {
        await loadStoreData(storeId);
      }
    } catch (error) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };
  
  loadData();
}, []);
```

### 4. Red-Marked Field Implementation

Based on the reference images, the following fields require synchronization:

#### Dashboard Global Snapshot Fields
```typescript
interface GlobalSnapshotData {
  // Sales Column (Red-marked)
  sales_amount: number;
  
  // Orders Column (Red-marked)
  open_orders: number;
  fbm_unshipped: number;
  fbm_pending: number;
  fba_pending: number;
  
  // Messages Column (Red-marked)
  buyer_messages: number;
  inventory_performance_index: number;
  
  // Featured Offer Column (Red-marked)
  featured_offer_percent: number;
  
  // Feedback Column (Red-marked)
  seller_feedback_rating: number;
  seller_feedback_count: number;
  ad_sales: number;
  
  // Payments Column (Red-marked)
  payments_balance: number;
  ad_impressions: number;
}
```

#### Product Performance Fields
```typescript
interface ProductData {
  // Product Details (Red-marked)
  title: string;
  sku: string;
  asin: string;
  image_url?: string;
  
  // Status (Red-marked)
  status: 'Active' | 'Inactive';
  
  // Performance Metrics (Red-marked)
  sales_amount: number;
  units_sold: number;
  page_views: number;
  inventory: number;
  price: number;
}
```

### 5. Admin Interface Forms

#### Dashboard Configuration Form
```typescript
const DashboardConfigForm: React.FC = ({ storeId }) => {
  const [form] = Form.useForm();
  
  const handleSubmit = async (values: any) => {
    try {
      await backendApi.updateDashboard(storeId, values);
      message.success('Dashboard配置已更新！前端刷新后生效。');
    } catch (error) {
      message.error('更新失败');
    }
  };
  
  return (
    <Form form={form} onFinish={handleSubmit}>
      <Form.Item label="今日销售额" name="sales_amount">
        <InputNumber min={0} step={0.01} />
      </Form.Item>
      <Form.Item label="待处理订单" name="open_orders">
        <InputNumber min={0} />
      </Form.Item>
      {/* More form fields for all red-marked areas */}
    </Form>
  );
};
```

#### Product Management Form
```typescript
const ProductForm: React.FC = ({ storeId, product }) => {
  const [form] = Form.useForm();
  
  const handleSubmit = async (values: any) => {
    try {
      const data = { ...values, store_id: storeId };
      if (product) {
        await backendApi.updateProduct(product.id, data);
      } else {
        await backendApi.createProduct(data);
      }
      message.success('产品已保存！前端刷新后生效。');
    } catch (error) {
      message.error('保存失败');
    }
  };
  
  return (
    <Form form={form} onFinish={handleSubmit}>
      <Form.Item label="产品标题" name="title" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="SKU" name="sku" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      {/* More form fields */}
    </Form>
  );
};
```

### 6. Pagination Implementation

#### Synchronized Pagination
```typescript
const ProductTable: React.FC = ({ storeId }) => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  
  const loadProducts = async (page = 1, pageSize = 10) => {
    try {
      const response = await backendApi.getProducts(storeId, {
        page,
        limit: pageSize
      });
      
      setProducts(response.data);
      setPagination({
        current: page,
        pageSize,
        total: response.pagination.total
      });
    } catch (error) {
      message.error('加载产品失败');
    }
  };
  
  const handleTableChange = (paginationConfig: any) => {
    loadProducts(paginationConfig.current, paginationConfig.pageSize);
  };
  
  return (
    <Table
      dataSource={products}
      pagination={pagination}
      onChange={handleTableChange}
      // ... other props
    />
  );
};
```

### 7. Error Handling and Validation

#### Form Validation
```typescript
const validateStoreData = (data: any) => {
  const schema = z.object({
    name: z.string().min(1, '店铺名称不能为空'),
    marketplace: z.string(),
    currency_symbol: z.string(),
    // ... other validations
  });
  
  return schema.parse(data);
};
```

#### API Error Handling
```typescript
const handleApiError = (error: any) => {
  if (error.response?.status === 404) {
    message.error('数据不存在');
  } else if (error.response?.status === 400) {
    message.error('请求参数错误');
  } else {
    message.error('操作失败，请重试');
  }
};
```

### 8. Testing Strategy

#### Integration Testing
```typescript
describe('Data Synchronization', () => {
  test('Admin update reflects in frontend after refresh', async () => {
    // 1. Update data in admin
    await adminApi.updateDashboard(storeId, testData);
    
    // 2. Refresh frontend data
    const frontendData = await frontendApi.getDashboard(storeId);
    
    // 3. Verify data matches
    expect(frontendData.sales_amount).toBe(testData.sales_amount);
  });
  
  test('Store switching loads correct data', async () => {
    // 1. Switch to different store
    await switchStore(store2Id);
    
    // 2. Load data
    const data = await loadStoreData(store2Id);
    
    // 3. Verify store-specific data
    expect(data.store_id).toBe(store2Id);
  });
});
```

## Implementation Phases

### Phase 1: Core API Integration (Completed)
- ✅ Backend API endpoints for all data types
- ✅ Store-based data filtering
- ✅ JSON file storage system
- ✅ Basic error handling

### Phase 2: Frontend Integration (In Progress)
- ✅ Store context management
- ✅ API service integration
- ✅ Dashboard data loading
- 🔄 Product data synchronization
- 🔄 Sales data synchronization

### Phase 3: Admin Interface Enhancement (Next)
- 📋 Dashboard configuration forms
- 📋 Product management forms
- 📋 Sales data configuration
- 📋 Store management interface

### Phase 4: Testing and Validation (Final)
- 📋 Integration testing
- 📋 Data consistency validation
- 📋 User acceptance testing
- 📋 Performance optimization

## Success Metrics

### Functional Requirements
- ✅ Data modifications in admin appear in frontend after refresh
- ✅ Store switching works correctly in both interfaces
- ✅ Pagination maintains consistency across data changes
- 📋 All red-marked fields are editable in admin
- 📋 Image uploads sync correctly

### Performance Requirements
- ✅ API response time < 500ms
- ✅ Page load time < 2 seconds
- 📋 Support for 100+ products per store
- 📋 Efficient pagination for large datasets

This design provides a solid foundation for implementing data synchronization through page refresh, ensuring data consistency between the admin interface and frontend while maintaining good performance and user experience.