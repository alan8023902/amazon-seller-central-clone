// Simple seed data for the mock backend
const seedData = {
  stores: [
    {
      id: '1',
      name: 'TYNBO Store',
      country: 'United States',
      currency_symbol: 'US$',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ],
  
  products: [
    {
      id: '1',
      store_id: '1',
      title: 'Lace Things for Women Bralette',
      sku: 'TYNBO-LACE-001',
      asin: 'B08F765432',
      price: 39.99,
      inventory: 66,
      status: 'Active',
      image_url: 'https://m.media-amazon.com/images/I/71tJkM8vDVL._AC_UY218_.jpg',
      sales_amount: 822.00,
      units_sold: 21,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      store_id: '1',
      title: 'Easy Soft Stretch Womens Underwear',
      sku: 'TYNBO-UNDER-002',
      asin: 'B08G876543',
      price: 5.99,
      inventory: 102,
      status: 'Active',
      image_url: 'https://m.media-amazon.com/images/I/51p+sM-iXRL._AC_UY218_.jpg',
      sales_amount: 160.00,
      units_sold: 16,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      store_id: '1',
      title: 'Easy Soft Stretch Womens Underwear',
      sku: 'TYNBO-UNDER-003',
      asin: 'B08H987654',
      price: 5.99,
      inventory: 106,
      status: 'Active',
      image_url: 'https://m.media-amazon.com/images/I/61f8g9h0iJL._AC_UY218_.jpg',
      sales_amount: 146.00,
      units_sold: 18,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '4',
      store_id: '1',
      title: 'Underwear for Women Cotton High',
      sku: 'TYNBO-UNDER-004',
      asin: 'B08I098765',
      price: 5.99,
      inventory: 83,
      status: 'Active',
      image_url: 'https://m.media-amazon.com/images/I/61s+N9rK-xL._AC_UY218_.jpg',
      sales_amount: 107.00,
      units_sold: 12,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '5',
      store_id: '1',
      title: 'Lace Things for Women Bralette',
      sku: 'TYNBO-LACE-002',
      asin: 'B08J109876',
      price: 19.99,
      inventory: 126,
      status: 'Active',
      image_url: 'https://m.media-amazon.com/images/I/81M51+d85EL._AC_UY218_.jpg',
      sales_amount: 101.00,
      units_sold: 10,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '6',
      store_id: '1',
      title: 'Wireless Bluetooth Headphones',
      sku: 'TYNBO-AUDIO-001',
      asin: 'B08K210987',
      price: 79.99,
      inventory: 45,
      status: 'Active',
      image_url: 'https://via.placeholder.com/150x150?text=Headphones',
      sales_amount: 1599.80,
      units_sold: 20,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '7',
      store_id: '1',
      title: 'Smart Fitness Tracker',
      sku: 'TYNBO-FITNESS-001',
      asin: 'B08L321098',
      price: 49.99,
      inventory: 0,
      status: 'Inactive',
      image_url: 'https://via.placeholder.com/150x150?text=Fitness+Tracker',
      sales_amount: 999.80,
      units_sold: 20,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '8',
      store_id: '1',
      title: 'Portable Bluetooth Speaker',
      sku: 'TYNBO-AUDIO-002',
      asin: 'B08M432109',
      price: 29.99,
      inventory: 78,
      status: 'Active',
      image_url: 'https://via.placeholder.com/150x150?text=Speaker',
      sales_amount: 599.80,
      units_sold: 20,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '9',
      store_id: '1',
      title: 'USB-C Charging Cable',
      sku: 'TYNBO-CABLE-001',
      asin: 'B08N543210',
      price: 12.99,
      inventory: 200,
      status: 'Active',
      image_url: 'https://via.placeholder.com/150x150?text=USB+Cable',
      sales_amount: 389.70,
      units_sold: 30,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '10',
      store_id: '1',
      title: 'Phone Case Clear Protective',
      sku: 'TYNBO-CASE-001',
      asin: 'B08O654321',
      price: 8.99,
      inventory: 150,
      status: 'Active',
      image_url: 'https://via.placeholder.com/150x150?text=Phone+Case',
      sales_amount: 269.70,
      units_sold: 30,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ],
  
  globalSnapshot: {
    id: '1',
    store_id: '1',
    sales_amount: 49.95,
    open_orders: 6,
    buyer_messages: 0,
    featured_offer_percent: 100,
    seller_feedback_rating: 5.00,
    seller_feedback_count: 2,
    returns_refunds: 0,
    policy_violations: 0,
    ad_spend: 12.34,
    ad_sales: 67.89,
    ad_impressions: 1234,
    updated_at: new Date().toISOString()
  },
  
  salesSnapshot: {
    id: '1',
    store_id: '1',
    total_order_items: 248,
    units_ordered: 192260,
    ordered_product_sales: 18657478,
    avg_units_per_order: 1.14,
    avg_sales_per_order: 110.29,
    snapshot_time: new Date().toISOString()
  },
  
  // Generate daily sales data for the last 30 days
  generateDailySales: function(storeId) {
    const dailySales = [];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      // Generate realistic sales data with some randomness
      const baseSales = 15000 + Math.random() * 10000;
      const baseUnits = 300 + Math.random() * 200;
      
      dailySales.push({
        id: `daily_${i + 1}`,
        store_id: storeId,
        sale_date: date.toISOString().split('T')[0],
        sales_amount: Math.round(baseSales),
        units_ordered: Math.round(baseUnits),
        created_at: new Date().toISOString()
      });
    }
    
    return dailySales;
  }
};

module.exports = seedData;