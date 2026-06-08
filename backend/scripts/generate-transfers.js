/**
 * UrbanFlow — One-shot Transfer Generator
 * =========================================
 * Reads each city's stops.json, detects interchanges (stops from different
 * modes within ~50m), and writes transfers.json.
 *
 * USAGE:
 *   node scripts/generate-transfers.js                # all cities
 *   node scripts/generate-transfers.js --city=delhi
 *   node scripts/generate-transfers.js --city=bangalore
 *
 * This is a standalone fallback; the Python preprocess scripts now also
 * detect transfers during the full pipeline run.
 */

const fs = require('fs');
const path = require('path');

const CITIES = [
  { id: 'delhi',      dir: path.resolve(__dirname, '../../data/delhi/output') },
  { id: 'bangalore',  dir: path.resolve(__dirname, '../../data/bengaluru/output') },
  { id: 'chennai',    dir: path.resolve(__dirname, '../../data/chennai/output') },
];

function haversineMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dlat = toRad(lat2 - lat1);
  const dlon = toRad(lon2 - lon1);
  const a = Math.sin(dlat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dlon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function detectTransfers(stops) {
  const transfers = [];
  const seen = new Set();

  // Bucket by (round(lat, 2), round(lon, 2))
  const buckets = {};
  for (const s of stops) {
    const key = `${Math.round(s.lat * 100)},${Math.round(s.lon * 100)},${s.mode}`;
    if (!buckets[key]) buckets[key] = [];
    buckets[key].push(s);
  }

  const keys = Object.keys(buckets);
  for (let i = 0; i < keys.length; i++) {
    const [latStr, lonStr, modeA] = keys[i].split(',');
    for (let j = i + 1; j < keys.length; j++) {
      const [latStr2, lonStr2, modeB] = keys[j].split(',');
      // Must be same cell but different mode
      if (latStr !== latStr2 || lonStr !== lonStr2) continue;
      if (modeA === modeB) continue;

      for (const a of buckets[keys[i]]) {
        for (const b of buckets[keys[j]]) {
          if (haversineMeters(a.lat, a.lon, b.lat, b.lon) <= 50) {
            const pair = [a.id, b.id].sort().join('|');
            if (!seen.has(pair)) {
              seen.add(pair);
              transfers.push({
                from_stop_id: String(a.id),
                to_stop_id: String(b.id),
                type: '0',
                min_time_sec: 120,
              });
            }
          }
        }
      }
    }
  }

  return transfers;
}

const filterArg = process.argv.find(a => a.startsWith('--city='));
const filterCity = filterArg ? filterArg.split('=')[1] : null;
const citiesToProcess = filterCity
  ? CITIES.filter(c => c.id === filterCity)
  : CITIES;

for (const city of citiesToProcess) {
  const stopsPath = path.join(city.dir, 'stops.json');
  const transfersPath = path.join(city.dir, 'transfers.json');

  if (!fs.existsSync(stopsPath)) {
    console.log(`[SKIP] ${city.id}: stops.json not found in ${city.dir}`);
    continue;
  }

  const stops = JSON.parse(fs.readFileSync(stopsPath, 'utf-8'));
  console.log(`[INFO] ${city.id}: loaded ${stops.length} stops`);

  const transfers = detectTransfers(stops);
  fs.writeFileSync(transfersPath, JSON.stringify(transfers, null, 2), 'utf-8');
  console.log(`[ OK ] ${city.id}: wrote ${transfers.length} transfers to ${transfersPath}`);

  // Also update summary.json if it exists
  const summaryPath = path.join(city.dir, 'summary.json');
  if (fs.existsSync(summaryPath)) {
    const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'));
    summary.total_transfers = transfers.length;
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2) + '\n', 'utf-8');
    console.log(`[ OK ] ${city.id}: updated summary.json total_transfers → ${transfers.length}`);
  }
}
