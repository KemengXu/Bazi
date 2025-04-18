#!/usr/bin/env node

/**
 * This script prepares the server for deployment to Render.com
 * It prints out instructions for manual steps that may be required
 */

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('=== Preparing Bazi Server for Render.com Deployment ===');
console.log('\nVerification steps:');
console.log('1. Checking package.json...');

try {
  const packageJson = require('./package.json');
  let needsUpdate = false;
  
  if (!packageJson.scripts || !packageJson.scripts.start) {
    console.log('❌ package.json is missing a "start" script.');
    needsUpdate = true;
  } else {
    console.log('✅ package.json has a "start" script.');
  }
  
  if (!packageJson.engines || !packageJson.engines.node) {
    console.log('❌ package.json is missing the "engines" field with "node" version.');
    needsUpdate = true;
  } else {
    console.log('✅ package.json has "engines" field with "node" version.');
  }
  
  if (needsUpdate) {
    console.log('\nPlease update your package.json by adding:');
    console.log(`
  "scripts": {
    "start": "node try.js"
  },
  "engines": {
    "node": ">=14.0.0"
  }`);
  }
} catch (error) {
  console.error('Error reading package.json:', error.message);
}

console.log('\n2. Checking server port configuration...');
try {
  const content = fs.readFileSync(join(__dirname, 'try.js'), 'utf-8');
  
  if (content.includes('process.env.PORT')) {
    console.log('✅ try.js uses process.env.PORT for dynamic port assignment.');
  } else {
    console.log('❌ try.js does not use process.env.PORT. Update the server to use:');
    console.log('const PORT = process.env.PORT || 8080;');
    console.log('And update the listen() call to use this PORT variable.');
  }
} catch (error) {
  console.error('Error reading try.js:', error.message);
}

console.log('\n=== Deployment Instructions ===');
console.log(`
1. Make sure your code is committed to your Git repository
2. Go to Render.com and create a new Web Service
3. Connect your Git repository
4. Configure as follows:
   - Name: bazi-server (or your preferred name)
   - Environment: Node
   - Build Command: npm install
   - Start Command: npm start
5. Click "Create Web Service"
6. After deployment, copy the service URL
7. Update the frontend .env.production file with:
   VITE_APP_API_URL=your-render-service-url
`);

console.log('=== End of Preparation ==='); 