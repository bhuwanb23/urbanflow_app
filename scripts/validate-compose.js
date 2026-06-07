#!/usr/bin/env node
/* eslint-disable */
/**
 * Validate docker-compose.yml is parseable and lists expected services.
 * Used locally and in CI to catch YAML syntax errors before docker compose up.
 */
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const file = path.join(__dirname, '..', 'docker-compose.yml');
try {
  const doc = yaml.load(fs.readFileSync(file, 'utf8'));
  const services = Object.keys(doc.services || {});
  if (!services.length) {
    console.error('  [validate-compose] no services defined in', file);
    process.exit(1);
  }
  for (const s of services) {
    const def = doc.services[s];
    if (!def.image && !def.build) {
      console.error(`  [validate-compose] service '${s}' has neither image nor build`);
      process.exit(1);
    }
  }
  console.log('  [validate-compose] OK — services:', services.join(', '));
  process.exit(0);
} catch (e) {
  console.error('  [validate-compose] PARSE ERROR:', e.message);
  process.exit(1);
}
