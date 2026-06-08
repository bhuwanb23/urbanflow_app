/**
 * UrbanFlow — Per-City Data Pipeline Wrapper
 * ============================================
 * Spawns the correct preprocess_<city>.py for the given city.
 *
 * USAGE:
 *   node scripts/run-preprocess.js                      # uses ACTIVE_CITY env
 *   node scripts/run-preprocess.js --city=delhi
 *   node scripts/run-preprocess.js --city=bangalore
 *   node scripts/run-preprocess.js --city=chennai
 *
 * OUTPUT:
 *   data/<city>/output/build.log  — full stdout + stderr
 *   exit code 0 on success, 1 on failure
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const CITY = parseCityArg();
const DATA_DIR = path.resolve(__dirname, '../../data');
const PYTHON = process.env.PYTHON || 'python';

const SCRIPT_MAP = {
  delhi: 'preprocess_delhi.py',
  bangalore: 'preprocess.py',
  chennai: 'preprocess_chennai.py',
};

function parseCityArg() {
  const arg = process.argv.find(a => a.startsWith('--city='));
  if (arg) return arg.split('=')[1];
  return process.env.ACTIVE_CITY || 'delhi';
}

async function main() {
  const scriptName = SCRIPT_MAP[CITY];
  if (!scriptName) {
    console.error(`❌ Unknown city "${CITY}". Valid: ${Object.keys(SCRIPT_MAP).join(', ')}`);
    process.exit(1);
  }

  const scriptPath = path.join(DATA_DIR, scriptName);
  if (!fs.existsSync(scriptPath)) {
    console.error(`❌ Preprocess script not found: ${scriptPath}`);
    process.exit(1);
  }

  const outputDir = path.join(DATA_DIR, CITY, 'output');
  fs.mkdirSync(outputDir, { recursive: true });
  const logPath = path.join(outputDir, 'build.log');

  console.log(`🚀 Starting preprocessing for ${CITY}...`);
  console.log(`   Script: ${scriptName}`);
  console.log(`   Log:    ${logPath}`);
  console.log('');

  const child = spawn(PYTHON, [scriptPath], {
    cwd: DATA_DIR,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  const logStream = fs.createWriteStream(logPath, { flags: 'w' });
  child.stdout.pipe(logStream);
  child.stderr.pipe(logStream);

  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);

  return new Promise((resolve) => {
    child.on('close', (code) => {
      logStream.end();
      if (code === 0) {
        console.log(`\n✅ Preprocessing complete for ${CITY}. Log saved to ${logPath}`);
        resolve(0);
      } else {
        console.error(`\n❌ Preprocessing failed for ${CITY} (exit code ${code}). Check ${logPath}`);
        resolve(1);
      }
    });

    child.on('error', (err) => {
      logStream.end();
      console.error(`\n❌ Failed to start preprocess: ${err.message}`);
      resolve(1);
    });
  });
}

main().then((code) => process.exit(code));
