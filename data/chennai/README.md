# Chennai GTFS Data

This directory will contain Chennai MTC (Metropolitan Transport Corporation) GTFS data.

## Directory Structure

```
chennai/
├── gtfs/              # Static GTFS schedule data
│   ├── agency.txt
│   ├── stops.txt
│   ├── routes.txt
│   ├── trips.txt
│   ├── stop_times.txt
│   └── calendar.txt
└── shapes/            # Route shape data
    └── [shape_id].json
```

## Data Sources

### Option 1: Open Government Data
- **Portal:** [data.gov.in](https://data.gov.in)
- **Dataset:** Chennai MTC Bus Routes and Stops
- **Format:** CSV/GTFS

### Option 2: GTFS-RT Feed
- **Provider:** Chennai Smart City
- **API:** (To be configured)
- **Documentation:** TBD

## Status

📋 **TODO:**
1. Download GTFS data from source
2. Place files in `gtfs/` directory
3. Run preprocessing script
4. Test with backend API

## Preprocessing

Run the GTFS preprocessing script:

```bash
cd backend
npm run preprocess:chennai
```

## Testing

After adding data, test with:

```bash
curl http://localhost:3000/api/v1/cities/chennai
```
