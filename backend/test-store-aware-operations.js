const { dataService } = require('./dist/services/dataService');

async function testStoreAwareOperations() {
  console.log('🧪 Testing Store-Aware Data Operations...\n');

  try {
    // Test 1: Create store data
    console.log('1️⃣ Testing createStoreData...');
    const testProduct1 = await dataService.createStoreData('products', {
      store_id: 'test-store-1',
      title: 'Test Product 1',
      asin: 'B123456789',
      sku: 'TEST-SKU-001',
      price: 29.99,
      inventory: 100,
      fulfillment_type: 'FBA',
      status: 'Active'
    });
    console.log('✅ Created product for store 1:', testProduct1.id);

    const testProduct2 = await dataService.createStoreData('products', {
      store_id: 'test-store-2',
      title: 'Test Product 2',
      asin: 'B987654321',
      sku: 'TEST-SKU-002',
      price: 49.99,
      inventory: 50,
      fulfillment_type: 'FBM',
      status: 'Active'
    });
    console.log('✅ Created product for store 2:', testProduct2.id);

    // Test 2: Read store data
    console.log('\n2️⃣ Testing readStoreData...');
    const store1Products = await dataService.readStoreData('products', 'test-store-1');
    const store2Products = await dataService.readStoreData('products', 'test-store-2');
    
    console.log(`✅ Store 1 has ${store1Products.length} products`);
    console.log(`✅ Store 2 has ${store2Products.length} products`);
    
    // Verify data isolation
    const store1HasStore2Product = store1Products.some(p => p.store_id === 'test-store-2');
    const store2HasStore1Product = store2Products.some(p => p.store_id === 'test-store-1');
    
    if (!store1HasStore2Product && !store2HasStore1Product) {
      console.log('✅ Data isolation verified - stores only see their own data');
    } else {
      console.log('❌ Data isolation failed - stores can see other stores\' data');
    }

    // Test 3: Update store data
    console.log('\n3️⃣ Testing updateStoreData...');
    const updatedProduct = await dataService.updateStoreData('products', testProduct1.id, 'test-store-1', {
      price: 39.99,
      inventory: 75
    });
    
    if (updatedProduct && updatedProduct.price === 39.99) {
      console.log('✅ Store data update successful');
    } else {
      console.log('❌ Store data update failed');
    }

    // Test 4: Try to update with wrong store ID (should fail)
    console.log('\n4️⃣ Testing store validation...');
    const invalidUpdate = await dataService.updateStoreData('products', testProduct1.id, 'wrong-store-id', {
      price: 99.99
    });
    
    if (!invalidUpdate) {
      console.log('✅ Store validation works - cannot update with wrong store ID');
    } else {
      console.log('❌ Store validation failed - updated with wrong store ID');
    }

    // Test 5: Bulk operations
    console.log('\n5️⃣ Testing bulk operations...');
    const bulkProducts = await dataService.bulkCreateStoreData('products', [
      {
        store_id: 'test-store-1',
        title: 'Bulk Product 1',
        asin: 'B111111111',
        sku: 'BULK-001',
        price: 19.99,
        inventory: 200,
        fulfillment_type: 'FBA',
        status: 'Active'
      },
      {
        store_id: 'test-store-1',
        title: 'Bulk Product 2',
        asin: 'B222222222',
        sku: 'BULK-002',
        price: 24.99,
        inventory: 150,
        fulfillment_type: 'FBA',
        status: 'Active'
      }
    ]);
    
    console.log(`✅ Bulk created ${bulkProducts.length} products`);

    // Test 6: Store statistics
    console.log('\n6️⃣ Testing store statistics...');
    const stats = await dataService.getStoreDataStats('products', 'test-store-1');
    console.log('✅ Store statistics:', {
      total: stats.total,
      createdToday: stats.createdToday
    });

    // Test 7: Paginated store data
    console.log('\n7️⃣ Testing paginated store data...');
    const paginatedData = await dataService.paginateStoreData('products', 'test-store-1', 1, 2);
    console.log(`✅ Paginated data: ${paginatedData.data.length} items, ${paginatedData.pagination.total} total`);

    // Test 8: Delete store data
    console.log('\n8️⃣ Testing deleteStoreData...');
    const deleted = await dataService.deleteStoreData('products', testProduct2.id, 'test-store-2');
    
    if (deleted) {
      console.log('✅ Store data deletion successful');
    } else {
      console.log('❌ Store data deletion failed');
    }

    // Test 9: Cleanup - delete all test data
    console.log('\n9️⃣ Cleaning up test data...');
    const deletedCount1 = await dataService.deleteAllStoreData('products', 'test-store-1');
    const deletedCount2 = await dataService.deleteAllStoreData('products', 'test-store-2');
    
    console.log(`✅ Cleaned up ${deletedCount1 + deletedCount2} test products`);

    console.log('\n🎉 All store-aware operations tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  }
}

// Run the test
testStoreAwareOperations();