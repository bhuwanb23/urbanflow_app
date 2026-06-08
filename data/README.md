# UrbanFlow Data

Raw GTFS feeds → preprocessed JSON per city, consumed by the backend API.

## Directory Layout

```
data/
├── README.md
├── CHANGELOG.md
├── .gitignore
├── requirements.txt
├── preprocess.py               # Bengaluru (BMTC bus + BMRCL metro)
├── preprocess_delhi.py         # Delhi (DTC bus + DMRC metro)
├── preprocess_chennai.py       # Chennai (MTC bus) — still a stub
├── split_shapes.py             # Bengaluru back-compat shape splitter
├── raw/
│   ├── bmtc.zip                # Bengaluru bus (from BMTC / Vonter mirror)
│   └── (bmrcl.zip)             # Bengaluru metro — TODO: source from BMRCL portal
├── bengaluru/
│   └── output/                 # Preprocessed JSON (8540 stops, 4283 routes)
│       ├── stops.json
│       ├── routes.json
│       ├── shapes/             # Per-shape files (7168 files)
│       ├── schedule/           # Per-route schedule files
│       ├── transfers.json
│       ├── search_index.json
│       ├── summary.json
│       └── build.log           # Last preprocess run log
├── delhi/
│   └── output/                 # Preprocessed JSON (10815 stops, 2439 routes)
└── chennai/
    └── output/                 # Preprocessed JSON (5 stops, 3 routes — STUB only)
```

## Preprocessing

Install Python deps once:

```bash
pip install -r data/requirements.txt
```

Run via the backend npm command:

```bash
cd backend
npm run preprocess                     # uses ACTIVE_CITY env (default: delhi)
npm run preprocess -- --city=delhi     # explicit: Delhi
npm run preprocess -- --city=bangalore # Bengaluru
npm run preprocess -- --city=chennai   # Chennai (stub only)
```

Or directly with Python:

```bash
cd data
python preprocess.py                   # Bengaluru
python preprocess_delhi.py             # Delhi
python preprocess_chennai.py           # Chennai
```

Each run writes a `build.log` into the city's `output/` directory.

## Raw Data Sources

| City | Mode | Source | URL |
|------|------|--------|-----|
| Delhi | Bus + Metro | Open Transit Data Delhi | https://otd.delhi.gov.in |
| Bengaluru | Bus only | BMTC (Vonter mirror) | https://github.com/Vonter/bmtc-gtfs |
| Bengaluru | Metro | BMRCL portal | TBD — TransitLand or BMRCL developer portal |
| Chennai | Bus | MTC / TransitLand | TBD — TransitLand |

## Freshness

Data is refreshed manually on an ad-hoc basis. See `CHANGELOG.md` for the last-updated date per city. In production, schedule a weekly cron job:

```bash
cd /opt/urbanflow && npm run preprocess -- --city=delhi
```

## Validation

```bash
# Coming soon: npm run validate-data
# Walks all city output dirs and prints a summary table
```
