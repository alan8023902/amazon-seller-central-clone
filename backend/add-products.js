const { execSync } = require('child_process');
const path = require('path');

// Run the TypeScript file using ts-node
try {
  console.log('Adding realistic products to all stores...');
  
  const scriptPath = path.join(__dirname, 'src/utils/addRealisticProducts.ts');
  const command = `npx ts-node -e "
    import { addRealisticProductsToAllStores } from './src/utils/addRealisticProducts';
    addRealisticProductsToAllStores().then(() => {
      console.log('Products added successfully!');
      process.exit(0);
    }).catch((error) => {
      console.error('Error adding products:', error);
      process.exit(1);
    });
  "`;
  
  execSync(command, { 
    stdio: 'inherit',
    cwd: __dirname
  });
  
} catch (error) {
  console.error('Failed to add products:', error);
  process.exit(1);
}