# Design Document

## Introduction

This document outlines the design for the Real-Time Data Synchronization system that enables immediate data synchronization between the Amazon Seller Central Admin Interface (port 3001) and Frontend (port 3000). The system ensures that any data modifications in the admin panel are instantly reflected in the frontend without manual page refresh, supporting multi-store management with proper store context switching and pagination.

## Architecture Overview

### System Components

```
┌─────────────────┐    WebSocket    ┌─────────────────┐    HTTP API    ┌─────────────────┐
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
Admin Panel Data Change → Backend API → WebSocket Broadcast → Frontend Update → UI Refresh
                                    ↓
                              JSON File Update
                                    ↓
                              Store Context Sync
```

## Technical Design

### 1. WebSocket Communication Layer

#### Backend WebSocket Server
```typescript
// backend/src/services/websocketService.ts
import { WebSocketServer } from 'ws';
import { Server } from 'http';

interface SyncMessage {
  type: 'data_update' | 'store_switch' | 'bulk_update';
  storeId: string;
  dataType: 'products' | 'dashboard' | 'sales' | 'account_health' | 'legal_entity' | 'voc_data';
  data: any;
  timestamp: number;
  userId?: string;
}

class WebSocketSyncService {
  private wss: WebSocketServer;
  private clients: Map<string, WebSocket> = new Map();
  
  initialize(server: Server) {
    this.wss = new WebSocketServer({ server });
    this.setupConnectionHandling();
  }
  
  broadcastDataUpdate(message: SyncMessage) {
    // Broadcast to all connected clients
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
  
  broadcastStoreSwitch(storeId: string, storeData: any) {
    const message: SyncMessage = {
      type: 'store_switch',
      storeId,
      dataType: 'dashboard',
      data: storeData,
      timestamp: Date.now()
    };
    this.broadcastDataUpdate(message);
  }
}
```

#### Frontend WebSocket Client
```typescript
// frontend/src/services/websocketService.ts
class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;
  
  connect() {
    this.ws = new WebSocket('ws://localhost:3002');
    this.setupEventHandlers();
  }
  
  private setupEventHandlers() {
    this.ws.onmessage = (event) => {
      const message: SyncMessage = JSON.parse(event.data);
      this.handleSyncMessage(message);
    };
    
    this.ws.onclose = () => {
      this.handleReconnection();
    };
  }
  
  private handleSyncMessage(message: SyncMessage) {
    switch (message.type) {
      case 'data_update':
        this.updateStoreData(message);
        break;
      case 'store_switch':
        this.switchStoreContext(message);
        break;
      case 'bulk_update':
        this.handleBulkUpdate(message);
        break;
    }
  }
}
```

### 2. Store Context Management

#### Enhanced Zustand Store
```typescript
// frontend/src/store.ts - Enhanced version
interface AppStore {
  // Existing properties...
  
  // Real-time sync properties
  syncStatus: 'connected' | 'disconnected' | 'reconnecting';
  lastSyncTime: number | null;
  pendingUpdates: SyncMessage[];
  
  // WebSocket service
  websocketService: WebSocketClient;
  
  // Enhanced actions
  initializeSync: () => void;
  handleDataSync: (message: SyncMessage) => void;
  forceSyncRefresh: () => Promise<void>;
  queuePendingUpdate: (message: SyncMessage) => void;
  processPendingUpdates: () => void;
}

const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // ... existing state
      
      syncStatus: 'disconnected',
      lastSyncTime: null,
      pendingUpdates: [],
      websocketService: new WebSocketClient(),
      
      initializeSync: () => {
        const { websocketService } = get();
        websocketService.connect();
        websocketService.onMessage = (message) => {
          get().handleDataSync(message);
        };
      },
      
      handleDataSync: (message: SyncMessage) => {
        const { currentStore } = get();
        
        // Only process messages for current store
        if (message.storeId !== currentStore?.id) return;
        
        switch (message.dataType) {
          case 'products':
            set((state) => ({
              dashboard: {
                ...state.dashboard,
                inventory: message.data
              },
              lastSyncTime: message.timestamp
            }));
            break;
            
          case 'dashboard':
            set((state) => ({
              dashboard: {
                ...state.dashboard,
                ...message.data
              },
              lastSyncTime: message.timestamp
            }));
            break;
            
          // Handle other data types...
        }
      }
    })
  )
);
```

### 3. Admin Panel Integration

#### Enhanced API Service with Sync Triggers
```typescript
// backend-admin/src/services/api.ts - Enhanced version
class ApiService {
  private websocketService: WebSocketSyncService;
  
  async updateProduct(id: string, data: any) {
    // Update data via API
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    // Trigger WebSocket sync
    if (result.success) {
      this.websocketService.broadcastDataUpdate({
        type: 'data_update',
        storeId: data.store_id,
        dataType: 'products',
        data: result.data,
        timestamp: Date.now()
      });
    }
    
    return result;
  }
  
  async updateDashboardSnapshot(storeId: string, data: any) {
    const response = await fetch(`${API_BASE}/dashboard/snapshot/${storeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    // Trigger sync for dashboard data
    if (result.success) {
      this.websocketService.broadcastDataUpdate({
        type: 'data_update',
        storeId,
        dataType: 'dashboard',
        data: result.data,
        timestamp: Date.now()
      });
    }
    
    return result;
  }
}
```

### 4. Red-Marked Data Field Analysis

Based on the reference images in `.kiro/specs/images/`, the following data fields require synchronization:

#### Dashboard Global Snapshot (Red-marked areas)
- **Sales Column**: `sales_amount`, `todaySoFar`
- **Open Orders Column**: `open_orders`, `fbm_unshipped`, `fbm_pending`, `fba_pending`
- **Buyer Messages Column**: `buyer_messages`, `inventory_performance_index`
- **Featured Offer Column**: `featured_offer_percent`, `global_promotions_sales`
- **Seller Feedback Column**: `seller_feedback_rating`, `seller_feedback_count`, `ad_sales`
- **Payments Column**: `payments_balance`, `ad_impressions`

#### Product Performance Table (Red-marked areas)
- **Product Details**: `title`, `sku`, `asin`, `image_url`
- **Listing Status**: `status` (Active/Inactive)
- **Sales**: `sales_amount`
- **Units Sold**: `units_sold`
- **Page Views**: `page_views`
- **Inventory**: `inventory` count
- **Price**: `price`

#### Store Information (Red-marked areas)
- **Store Name**: `name`
- **Marketplace**: `marketplace`
- **Currency**: `currency_symbol`
- **Business Type**: `business_type`
- **Contact Information**: `contact_email`, `contact_phone`

### 5. Pagination Synchronization

#### Enhanced Pagination Component
```typescript
// frontend/src/components/SyncedPagination.tsx
interface SyncedPaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  storeId: string;
}

const SyncedPagination: React.FC<SyncedPaginationProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  storeId
}) => {
  const { websocketService } = useStore();
  
  useEffect(() => {
    // Listen for pagination updates from admin
    const handlePaginationSync = (message: SyncMessage) => {
      if (message.type === 'data_update' && message.storeId === storeId) {
        // Recalculate pagination if total items changed
        const newTotalPages = Math.ceil(message.data.total / pageSize);
        if (currentPage > newTotalPages) {
          onPageChange(Math.max(1, newTotalPages));
        }
      }
    };
    
    websocketService.onMessage = handlePaginationSync;
    
    return () => {
      websocketService.onMessage = null;
    };
  }, [currentPage, pageSize, storeId]);
  
  return (
    <div className="pagination-controls">
      {/* Pagination UI */}
    </div>
  );
};
```

### 6. Error Handling and Recovery

#### Connection Recovery System
```typescript
// frontend/src/services/syncRecoveryService.ts
class SyncRecoveryService {
  private retryAttempts = 0;
  private maxRetries = 5;
  private backoffMultiplier = 1.5;
  
  async handleConnectionLoss() {
    this.retryAttempts++;
    
    if (this.retryAttempts <= this.maxRetries) {
      const delay = Math.pow(this.backoffMultiplier, this.retryAttempts) * 1000;
      
      setTimeout(() => {
        this.attemptReconnection();
      }, delay);
    } else {
      this.fallbackToPolling();
    }
  }
  
  private async attemptReconnection() {
    try {
      const { websocketService } = useStore.getState();
      await websocketService.connect();
      
      // Sync any missed updates
      await this.syncMissedUpdates();
      
      this.retryAttempts = 0;
    } catch (error) {
      this.handleConnectionLoss();
    }
  }
  
  private async fallbackToPolling() {
    // Implement polling fallback for critical data
    setInterval(async () => {
      await this.pollForUpdates();
    }, 30000); // Poll every 30 seconds
  }
}
```

### 7. Performance Optimization

#### Data Compression and Batching
```typescript
// backend/src/services/syncOptimizationService.ts
class SyncOptimizationService {
  private pendingUpdates: Map<string, SyncMessage[]> = new Map();
  private batchTimeout: NodeJS.Timeout | null = null;
  
  queueUpdate(message: SyncMessage) {
    const key = `${message.storeId}-${message.dataType}`;
    
    if (!this.pendingUpdates.has(key)) {
      this.pendingUpdates.set(key, []);
    }
    
    this.pendingUpdates.get(key)!.push(message);
    
    // Debounce batch processing
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
    }
    
    this.batchTimeout = setTimeout(() => {
      this.processBatch();
    }, 500); // 500ms debounce
  }
  
  private processBatch() {
    this.pendingUpdates.forEach((updates, key) => {
      if (updates.length > 0) {
        // Merge updates and send single message
        const mergedUpdate = this.mergeUpdates(updates);
        this.websocketService.broadcastDataUpdate(mergedUpdate);
      }
    });
    
    this.pendingUpdates.clear();
    this.batchTimeout = null;
  }
}
```

## Implementation Strategy

### Phase 1: Core Infrastructure
1. **WebSocket Server Setup** - Implement basic WebSocket server in backend
2. **Frontend WebSocket Client** - Create WebSocket client service
3. **Basic Message Handling** - Implement core message types and handlers

### Phase 2: Data Synchronization
1. **Dashboard Sync** - Implement Global Snapshot synchronization
2. **Product Sync** - Implement Product Performance Table synchronization
3. **Store Context Sync** - Implement store switching synchronization

### Phase 3: Advanced Features
1. **Pagination Sync** - Implement synchronized pagination
2. **Error Recovery** - Implement connection recovery and fallback mechanisms
3. **Performance Optimization** - Implement batching and compression

### Phase 4: Testing and Validation
1. **Unit Tests** - Test individual sync components
2. **Integration Tests** - Test end-to-end sync workflows
3. **Performance Tests** - Test under load and with large datasets

## Data Models

### Sync Message Schema
```typescript
interface SyncMessage {
  type: 'data_update' | 'store_switch' | 'bulk_update' | 'connection_status';
  storeId: string;
  dataType: 'products' | 'dashboard' | 'sales' | 'account_health' | 'legal_entity' | 'voc_data' | 'store_info';
  data: any;
  timestamp: number;
  userId?: string;
  batchId?: string;
  sequenceNumber?: number;
}
```

### Store Context Schema
```typescript
interface StoreContext {
  id: string;
  name: string;
  marketplace: string;
  currency_symbol: string;
  is_active: boolean;
  last_sync_time: number;
  sync_status: 'synced' | 'pending' | 'error';
}
```

## Security Considerations

### Authentication and Authorization
- WebSocket connections require valid session tokens
- Store-level access control for data synchronization
- Rate limiting for sync operations

### Data Validation
- All sync messages validated against schemas
- Sanitization of user input before broadcasting
- Integrity checks for critical data updates

## Monitoring and Logging

### Sync Operation Monitoring
- Real-time sync success/failure rates
- Connection health monitoring
- Performance metrics (latency, throughput)

### Error Logging
- Detailed error logs for failed sync operations
- Connection failure tracking
- Data consistency validation logs

## Testing Strategy

### Unit Testing
- WebSocket service functionality
- Message handling and validation
- Store context management

### Integration Testing
- End-to-end sync workflows
- Multi-store context switching
- Error recovery scenarios

### Performance Testing
- Large dataset synchronization
- Concurrent user scenarios
- Network failure recovery

This design provides a comprehensive foundation for implementing real-time data synchronization between the admin interface and frontend, ensuring data consistency and optimal user experience across the Amazon Seller Central clone system.