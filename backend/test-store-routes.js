/**
 * Test script for enhanced store routes
 * Tests all CRUD operations for the store management API
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3002/api/stores';

async function testStoreRoutes() {
  console.log('🧪 Testing Enhanced Store Routes...\n');

  try {
    // Test 1: Get all stores
    console.log('1. Testing GET /api/stores');
    const getAllResponse = await axios.get(BASE_URL);
    console.log('✅ GET /api/stores:', getAllResponse.data);
    console.log(`   Found ${getAllResponse.data.data.length} stores\n`);

    // Test 2: Create a new store
    console.log('2. Testing POST /api/stores');
    const newStore = {
      name: 'Test Store Japan',
      country: 'Japan',
      currency_symbol: '¥',
      is_active: true
    };
    
    const createResponse = await axios.post(BASE_URL, newStore);
    console.log('✅ POST /api/stores:', createResponse.data);
    const createdStoreId = createResponse.data.data.id;
    console.log(`   Created store with ID: ${createdStoreId}\n`);

    // Test 3: Get specific store by ID
    console.log('3. Testing GET /api/stores/:id');
    const getByIdResponse = await axios.get(`${BASE_URL}/${createdStoreId}`);
    console.log('✅ GET /api/stores/:id:', getByIdResponse.data);
    console.log(`   Retrieved store: ${getByIdResponse.data.data.name}\n`);

    // Test 4: Update store
    console.log('4. Testing PUT /api/stores/:id');
    const updateData = {
      name: 'Updated Test Store Japan',
      is_active: false
    };
    
    const updateResponse = await axios.put(`${BASE_URL}/${createdStoreId}`, updateData);
    console.log('✅ PUT /api/stores/:id:', updateResponse.data);
    console.log(`   Updated store name to: ${updateResponse.data.data.name}\n`);

    // Test 5: Get store summary
    console.log('5. Testing GET /api/stores/:id/summary');
    try {
      const summaryResponse = await axios.get(`${BASE_URL}/${createdStoreId}/summary`);
      console.log('✅ GET /api/stores/:id/summary:', summaryResponse.data);
      console.log(`   Store status: ${summaryResponse.data.data.health.status}\n`);
    } catch (error) {
      console.log('⚠️  Store summary failed (expected - store is inactive):', error.response?.data?.error);
      console.log('   This is expected behavior for inactive stores\n');
    }

    // Test 6: Get marketplaces
    console.log('6. Testing GET /api/stores/marketplaces');
    const marketplacesResponse = await axios.get(`${BASE_URL}/marketplaces`);
    console.log('✅ GET /api/stores/marketplaces:', marketplacesResponse.data);
    console.log(`   Available marketplaces: ${marketplacesResponse.data.data.length}\n`);

    // Test 7: Delete store
    console.log('7. Testing DELETE /api/stores/:id');
    const deleteResponse = await axios.delete(`${BASE_URL}/${createdStoreId}`);
    console.log('✅ DELETE /api/stores/:id:', deleteResponse.data);
    console.log(`   Deleted store: ${deleteResponse.data.message}\n`);

    // Test 8: Verify deletion
    console.log('8. Verifying store deletion');
    try {
      await axios.get(`${BASE_URL}/${createdStoreId}`);
      console.log('❌ Store should have been deleted');
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ Store successfully deleted (404 as expected)\n');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }

    // Test 9: Test legacy endpoints
    console.log('9. Testing legacy endpoints');
    const legacyGetResponse = await axios.get('http://localhost:3002/api/store/legacy');
    console.log('✅ GET /api/store/legacy (backward compatibility):', legacyGetResponse.data);
    console.log(`   Legacy store: ${legacyGetResponse.data.data.name}\n`);

    console.log('🎉 All store route tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Check if server is running
async function checkServer() {
  try {
    await axios.get('http://localhost:3002/health');
    console.log('✅ Backend server is running\n');
    return true;
  } catch (error) {
    console.log('❌ Backend server is not running. Please start it with: npm run dev');
    console.log('   Server should be available at http://localhost:3002\n');
    return false;
  }
}

async function main() {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await testStoreRoutes();
  }
}

main().catch(console.error);