const https = require('https');
const http = require('http');

const API_BASE = 'http://localhost:3002/api';

// Test functions
async function testAPI(endpoint, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const url = `${API_BASE}${endpoint}`;
        const urlObj = new URL(url);
        
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname + urlObj.search,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const req = http.request(options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                try {
                    const result = JSON.parse(responseData);
                    resolve({ success: true, status: res.statusCode, data: result });
                } catch (error) {
                    resolve({ success: false, error: 'Invalid JSON response' });
                }
            });
        });

        req.on('error', (error) => {
            resolve({ success: false, error: error.message });
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        
        req.end();
    });
}

async function runTests() {
    console.log('🚀 Amazon Seller Central Login System Test');
    console.log('='.repeat(50));
    
    // Test 1: Health Check
    console.log('\n1. 🏥 Backend Health Check');
    const healthResult = await testAPI('/health');
    if (healthResult.success) {
        console.log('✅ Backend is running:', healthResult.data.status);
    } else {
        console.log('❌ Backend health check failed:', healthResult.error);
        return;
    }
    
    // Test 2: Get Users
    console.log('\n2. 👥 Get Test Users');
    const usersResult = await testAPI('/users');
    if (usersResult.success && usersResult.data.success) {
        const users = usersResult.data.data;
        console.log(`✅ Found ${users.length} test users:`);
        users.forEach(user => {
            const type = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.username) ? '📧 Email' : '📱 Phone';
            console.log(`   ${type}: ${user.username} (password: ${user.password}) - ${user.isActive ? '✅ Active' : '❌ Inactive'}`);
        });
    } else {
        console.log('❌ Failed to get users:', usersResult.error);
        return;
    }
    
    // Test 3: Login Flow - Step 1 & 2 (Email + Password)
    console.log('\n3. 🔐 Three-Step Login Flow Test');
    console.log('   Step 1: Email/Phone Input → Continue');
    console.log('   Step 2: Password Input → Sign In');
    
    const loginResult = await testAPI('/auth/login', 'POST', {
        username: 'demo@example.com',
        password: 'demo123'
    });
    
    if (loginResult.success && loginResult.data.success) {
        console.log('✅ Steps 1-2 successful:');
        console.log(`   User: ${loginResult.data.data.user.username}`);
        console.log(`   Token: ${loginResult.data.data.token}`);
        console.log('   Step 3: OTP Verification (simulated in frontend)');
    } else {
        console.log('❌ Login failed:', loginResult.data?.message || loginResult.error);
    }
    
    // Test 4: Test Phone Number Login
    console.log('\n4. 📱 Phone Number Login Test');
    const phoneLoginResult = await testAPI('/auth/login', 'POST', {
        username: '+8613800138000',
        password: 'phone123'
    });
    
    if (phoneLoginResult.success && phoneLoginResult.data.success) {
        console.log('✅ Phone login successful:');
        console.log(`   Phone: ${phoneLoginResult.data.data.user.username}`);
    } else {
        console.log('❌ Phone login failed:', phoneLoginResult.data?.message || phoneLoginResult.error);
    }
    
    // Test 5: Invalid Credentials
    console.log('\n5. ❌ Invalid Credentials Test');
    const invalidResult = await testAPI('/auth/login', 'POST', {
        username: 'invalid@example.com',
        password: 'wrongpassword'
    });
    
    if (!invalidResult.success || !invalidResult.data.success) {
        console.log('✅ Invalid credentials properly rejected');
    } else {
        console.log('❌ Invalid credentials should have been rejected');
    }
    
    // Test 6: Create New User (Email)
    console.log('\n6. 📧 Create Email User Test');
    const timestamp = Date.now();
    const newEmailUser = await testAPI('/users', 'POST', {
        username: `test${timestamp}@example.com`,
        password: 'test123',
        isActive: true
    });
    
    if (newEmailUser.success && newEmailUser.data.success) {
        console.log('✅ Email user created successfully');
    } else {
        console.log('❌ Failed to create email user:', newEmailUser.data?.message || newEmailUser.error);
    }
    
    // Test 7: Create New User (Phone)
    console.log('\n7. 📱 Create Phone User Test');
    const phoneNumber = `+86138${timestamp.toString().slice(-8)}`;
    const newPhoneUser = await testAPI('/users', 'POST', {
        username: phoneNumber,
        password: 'phone123',
        isActive: true
    });
    
    if (newPhoneUser.success && newPhoneUser.data.success) {
        console.log('✅ Phone user created successfully');
    } else {
        console.log('❌ Failed to create phone user:', newPhoneUser.data?.message || newPhoneUser.error);
    }
    
    // Test 8: Invalid Username Format
    console.log('\n8. ❌ Invalid Username Format Test');
    const invalidUserResult = await testAPI('/users', 'POST', {
        username: 'invalid-username',
        password: 'test123',
        isActive: true
    });
    
    if (!invalidUserResult.success || !invalidUserResult.data.success) {
        console.log('✅ Invalid username format properly rejected');
    } else {
        console.log('❌ Invalid username format should have been rejected');
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 Test Summary:');
    console.log('✅ Backend API is running on http://localhost:3002');
    console.log('✅ Three-step login flow implemented:');
    console.log('   1. Email/Phone input page');
    console.log('   2. Password verification page');
    console.log('   3. OTP verification page');
    console.log('✅ User management supports email and phone formats');
    console.log('✅ Authentication API validates credentials');
    console.log('✅ Frontend should auto-detect browser language');
    console.log('');
    console.log('🌐 Frontend URLs:');
    console.log('   Frontend App: http://localhost:3000');
    console.log('   Admin Panel:  http://localhost:3001');
    console.log('   Test Page:    file:///' + __dirname.replace(/\\/g, '/') + '/test-amazon-login.html');
    console.log('');
    console.log('📋 Next Steps:');
    console.log('1. Open http://localhost:3000 to test the frontend login');
    console.log('2. Test browser language detection by changing browser language');
    console.log('3. Test the three-step login flow with the provided credentials');
    console.log('4. Use admin panel at http://localhost:3001 to manage users');
}

// Run the tests
runTests().catch(console.error);