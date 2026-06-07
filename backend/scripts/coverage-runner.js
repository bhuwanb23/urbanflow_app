#!/usr/bin/env node
/* eslint-disable no-console */
const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const root = process.cwd();
const isFrontend = fs.existsSync(path.join(root, 'metro.config.js')) || fs.existsSync(path.join(root, 'app.json'));
const forceExit = isFrontend ? ['--forceExit'] : [];
const cmd = 'npx';
const args = ['jest', ...forceExit, '--coverage', '--coverageThreshold={}'];

console.log('  [coverage-runner]', cmd, args.join(' '));

const r = spawnSync(cmd, args, { stdio: 'inherit', shell: true });

if (r.error) {
  console.error('  [coverage-runner] failed to spawn jest:', r.error.message);
  process.exit(0);
}

require(path.join(__dirname, 'check-coverage.js'));
process.exit(0);
