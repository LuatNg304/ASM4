const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 1. Install and Build Backend
console.log('Building backend...');
execSync('npm install', { cwd: path.join(__dirname, 'BE'), stdio: 'inherit' });
execSync('npm run build', { cwd: path.join(__dirname, 'BE'), stdio: 'inherit' });

// 2. Install and Build Frontend
console.log('Building frontend...');
execSync('npm install', { cwd: path.join(__dirname, 'my-app'), stdio: 'inherit' });
execSync('npm run build', { cwd: path.join(__dirname, 'my-app'), stdio: 'inherit' });

// 3. Copy frontend build to root dist folder
console.log('Copying frontend build to root dist...');
const srcDist = path.join(__dirname, 'my-app', 'dist');
const destDist = path.join(__dirname, 'dist');

if (fs.existsSync(destDist)) {
  fs.rmSync(destDist, { recursive: true, force: true });
}
fs.mkdirSync(destDist, { recursive: true });

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}
copyRecursiveSync(srcDist, destDist);
console.log('Build completed successfully!');
