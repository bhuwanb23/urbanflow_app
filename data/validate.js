/**
 * UrbanFlow Data Validator
 * =========================
 * Walks each city's output directory and prints a validation table.
 *
 * USAGE:
 *   node data/validate.js                            # check all cities
 *   node data/validate.js delhi                      # check one city
 *   node data/validate.js --json                     # JSON output
 *
 * EXIT CODE: 0 if all cities have valid data, 1 otherwise
 */

const fs = require('fs');
const path = require('path');

const CITIES = [
  { id: 'delhi',      name: 'Delhi NCR',       dir: 'delhi/output' },
  { id: 'bangalore',  name: 'Bengaluru',        dir: 'bengaluru/output' },
  { id: 'chennai',    name: 'Chennai',           dir: 'chennai/output' },
];

const DATA_DIR = path.resolve(__dirname);

function listFiles(dir) {
  try {
    return fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  } catch {
    return [];
  }
}

function countFiles(dir) {
  try {
    return fs.readdirSync(dir).length;
  } catch {
    return 0;
  }
}

function readSummary(dir) {
  const summaryPath = path.join(dir, 'summary.json');
  try {
    return JSON.parse(fs.readFileSync(summaryPath, 'utf-8'));
  } catch {
    return null;
  }
}

function checkDir(dir) {
  try {
    return fs.statSync(dir).isDirectory();
  } catch {
    return false;
  }
}

function validate() {
  const results = [];

  for (const city of CITIES) {
    const outputDir = path.join(DATA_DIR, city.dir);
    const shapesDir = path.join(outputDir, 'shapes');
    const scheduleDir = path.join(outputDir, 'schedule');

    const hasOutput = checkDir(outputDir);
    const summary = hasOutput ? readSummary(outputDir) : null;
    const stopsExist = hasOutput && listFiles(outputDir).includes('stops.json');
    const routesExist = hasOutput && listFiles(outputDir).includes('routes.json');
    const transfersExist = hasOutput && listFiles(outputDir).includes('transfers.json');
    const searchIdxExist = hasOutput && listFiles(outputDir).includes('search_index.json');
    const shapeCount = checkDir(shapesDir) ? countFiles(shapesDir) : 0;
    const scheduleCount = checkDir(scheduleDir) ? countFiles(scheduleDir) : 0;

    const isFullyValid = hasOutput && stopsExist && routesExist && searchIdxExist;
    const isStub = city.id === 'chennai' && summary &&
      summary.total_stops <= 10 && summary.total_routes <= 5;

    results.push({
      ...city,
      hasOutput,
      summary,
      stopsExist,
      routesExist,
      transfersExist,
      searchIdxExist,
      shapeCount,
      scheduleCount,
      valid: isFullyValid,
      stub: isStub,
    });
  }

  return results;
}

function printTable(results) {
  const header = `${pad('City', 14)} ${pad('Stops', 7)} ${pad('Routes', 7)} ${pad('Shapes', 7)} ${pad('Sched', 7)} ${pad('Transf', 7)} ${pad('Status', 10)}`;
  const sep = '-'.repeat(header.length);

  console.log(`\n  ${header}`);
  console.log(`  ${sep}`);

  let allValid = true;
  for (const r of results) {
    const status = !r.hasOutput ? 'MISSING' :
      r.stub ? 'STUB' :
      r.valid ? 'OK' : 'INCOMPLETE';
    if (!r.valid && !r.stub) allValid = false;

    console.log(
      `  ${pad(r.name, 14)} ` +
      `${pad(r.summary ? String(r.summary.total_stops) : '-', 7)} ` +
      `${pad(r.summary ? String(r.summary.total_routes) : '-', 7)} ` +
      `${pad(r.shapeCount ? String(r.shapeCount) : r.summary ? String(r.summary.total_shapes) : '-', 7)} ` +
      `${pad(String(r.scheduleCount), 7)} ` +
      `${pad(r.summary ? String(r.summary.total_transfers ?? 0) : '-', 7)} ` +
      `${pad(status, 10)}`
    );
  }

  console.log(`  ${sep}\n`);
  return allValid;
}

function pad(s, n) { return (s + '').padEnd(n); }

const isJson = process.argv.includes('--json');
const filterId = process.argv.slice(2).find(a => !a.startsWith('--'));
const results = validate();
const filtered = filterId ? results.filter(r => r.id === filterId) : results;

if (isJson) {
  console.log(JSON.stringify(filtered, null, 2));
} else {
  const ok = printTable(filtered);
  process.exit(ok ? 0 : 1);
}
