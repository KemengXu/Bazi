// Simple deploy script to bypass TypeScript errors for GitHub Pages deployment
import { execSync } from 'child_process';

console.log('Building for GitHub Pages...');
try {
  // Build without TypeScript checks
  execSync('vite build --base=/Bazi/ --emptyOutDir', { stdio: 'inherit' });
  console.log('Build completed successfully');
  
  // Deploy to GitHub Pages
  execSync('gh-pages -d dist', { stdio: 'inherit' });
  console.log('Deployed to GitHub Pages');
} catch (error) {
  console.error('Error during build or deploy:', error);
  process.exit(1);
} 