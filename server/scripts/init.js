#!/usr/bin/env node

/**
 * UrbanFlow Backend Initialization Script
 * Creates necessary directories and copies environment file
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 UrbanFlow Backend Initialization');
console.log('====================================\n');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  step: (msg) => console.log(`\n${colors.cyan}${msg}${colors.reset}`)
};

// Check if we're in the right directory
const currentDir = process.cwd();
if (!fs.existsSync(path.join(currentDir, 'package.json'))) {
  console.error('❌ Please run this script from the server directory');
  process.exit(1);
}

// Step 1: Create necessary directories
log.step('1. Creating directories...');
const dirs = ['data', 'logs', 'uploads'];

dirs.forEach(dir => {
  const dirPath = path.join(currentDir, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log.success(`Created directory: ${dir}`);
  } else {
    log.info(`Directory already exists: ${dir}`);
  }
});

// Step 2: Copy environment file
log.step('2. Setting up environment file...');
const envPath = path.join(currentDir, '.env');
const envExamplePath = path.join(currentDir, 'env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    try {
      fs.copyFileSync(envExamplePath, envPath);
      log.success('Created .env file from env.example template');
    } catch (error) {
      log.warning(`Failed to create .env file: ${error.message}`);
    }
  } else {
    log.warning('env.example file not found');
  }
} else {
  log.info('.env file already exists');
}

// Step 3: Display next steps
log.step('3. Initialization complete! Next steps:');
console.log(`
${colors.cyan}To start the development server:${colors.reset}
  npm run dev

${colors.cyan}To test the API:${colors.reset}
  # Health check
  curl http://localhost:3000/health
  
  # API info
  curl http://localhost:3000/api/v1

${colors.cyan}To seed sample data:${colors.reset}
  npm run seed

${colors.cyan}To run tests:${colors.reset}
  npm test

${colors.cyan}Server will be available at:${colors.reset}
  http://localhost:3000
`);

log.success('Setup completed successfully! 🎉');
console.log(`\n${colors.cyan}Happy coding! 🚀${colors.reset}\n`);
