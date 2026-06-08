# Adding a New City

This guide walks through adding **Hyderabad** as a 4th city. The same steps apply to any new city.

---

## Overview

Every city needs:

| Layer | What |
|---|---|
| Raw GTFS | `data/raw/hyderabad_gtfs.zip` |
| Preprocessor | `data/preprocess_hyderabad.py` |
| Output dir | `data/hyderabad/output/` |
| City registration | `backend/utils/cityManager.js` |
| Shape split | `data/split_shapes_per_city.py --city=hyderabad` |
| Transfer detection | `npm run generate-transfers -- --city=hyderabad` |
| Frontend name | `urbanflow_app/contexts/CityContext.js` (auto) |
| Acceptance test | `curl localhost:3000/api/v1/cities/hyderabad` |

---

## Step-by-Step

### 1. Obtain GTFS

Download Hyderabad TSRTC / HMRL GTFS and save to:

```bash
data/raw/hyderabad_gtfs.zip
```

Source options:
- **TSRTC buses**: check <https://www.tsrtc.telangana.gov.in> or <https://data.gov.in>
- **Hyderabad Metro (HMRL)**: may not be publicly available — file RTI or check HMRL website

### 2. Create Preprocessor

Copy an existing preprocessor:

```bash
cp data/preprocess_delhi.py data/preprocess_hyderabad.py
```

Edit the new file:
- Change the **CITY** constant to `hyderabad`
- Adjust source dirs to point at `data/raw/hyderabad_gtfs.zip`
- Update station whitelist if metro is included
- Adjust log markers to avoid confusion

Test it:

```bash
python data/preprocess_hyderabad.py
```

### 3. Validate Raw Data

Before running the preprocessor, verify the GTFS ZIP has the required files:

```bash
unzip -l data/raw/hyderabad_gtfs.zip | grep -E '\.txt$'
```

Required: `agency.txt`, `stops.txt`, `routes.txt`, `trips.txt`, `stop_times.txt`. Optional: `shapes.txt`, `transfers.txt`.

### 4. Register in cityManager

Open `backend/utils/cityManager.js` and add a new entry inside `this.cities = {}`:

```js
hyderabad: {
  id: 'hyderabad',
  name: 'Hyderabad',
  dataDir: path.join(baseDataDir, 'hyderabad', 'output'),
  staticDir: path.join(baseDataDir, 'hyderabad', 'output'),
  gtfsRtConfig: {
    enabled: true,
    source: 'hyderabad',
    apiUrl: process.env.HYDERABAD_API_URL || '',
    apiKey: process.env.HYDERABAD_API_KEY || '',
    vehiclePositionsUrl: process.env.HYDERABAD_VEHICLE_POSITIONS_URL || '',
    tripUpdatesUrl: process.env.HYDERABAD_TRIP_UPDATES_URL || '',
    alertsUrl: process.env.HYDERABAD_ALERTS_URL || '',
  },
},
```

> The order in which cities are defined also sets the default `getActiveCities()` order.

### 5. Run Shape Split

```bash
python data/split_shapes_per_city.py --city=hyderabad
```

### 6. Run Transfer Detection

```bash
npm run generate-transfers -- --city=hyderabad
```

This writes `transfers.json` and updates `summary.json`'s `total_transfers` field.

### 7. Set Active City (Optional)

```bash
export ACTIVE_CITY=hyderabad
```

The server defaults to `delhi` if `ACTIVE_CITY` is not set.

### 8. Restart Server & Verify

```bash
# In backend/
npm run dev
```

Verify:

```bash
curl http://localhost:3000/api/v1/cities
# Should list hyderabad with hasData: true
```

```bash
curl http://localhost:3000/api/v1/cities/hyderabad
# Should return city info with dataStatus details
```

### 9. Switch to New City

```bash
curl -X POST http://localhost:3000/api/v1/cities/switch \
  -H "Content-Type: application/json" \
  -d '{"cityId": "hyderabad"}'
```

Or on the frontend: tap the city name in ProfileScreen to cycle.

### 10. Run Data Validation

```bash
# From backend/
npm run validate-data -- --city=hyderabad
```

Or for all cities:

```bash
# From backend/
npm run validate-data
```

### 11. Commit

Commit all new files:

```bash
git add data/raw/hyderabad_*.zip  # only if small (<50 MB)
git add data/hyderabad/           # generated output files
git add data/preprocess_hyderabad.py
git add backend/utils/cityManager.js  # the registration line
```

Update `data/CHANGELOG.md` with the new row.

---

## Optional: API Keys

If the new city has GTFS-RT endpoints, add env vars:

```bash
HYDERABAD_API_URL=https://api.hyderabad.gov.in/realtime
HYDERABAD_API_KEY=your_key_here
```

And document them in `docs/API_KEYS.md`.

---

## Troubleshooting

| Symptom | Likely Cause |
|---|---|
| `city not found` in curl | `cityManager.js` registration is missing or the id doesn't match |
| `hasData: false` | Preprocessor didn't run, or output is in wrong directory |
| `0 stops, 0 routes` | GTFS ZIP is empty or corrupt — check with `unzip -l` |
| No shapes | GTFS didn't include `shapes.txt` — skip shape splitting |
| 0 transfers | Only one mode in the GTFS (e.g., bus only); or bucket radius is too small |
| Missing `summary.json` | Run preprocessor again — it writes the summary last |
| Frontend shows old city | Switch city via ProfileScreen or restart the app |
