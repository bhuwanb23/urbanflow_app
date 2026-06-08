# Data Changelog

| Date       | City      | Action                          | Files                                      | Source                                                                 |
|------------|-----------|---------------------------------|--------------------------------------------|------------------------------------------------------------------------|
| 2026-06-08 | Delhi     | Preprocessed GTFS → JSON        | stops(10815) routes(2439) shapes(36)       | `data/raw/delhi_gtfs.zip` via Open Transit Data                        |
| 2026-06-08 | Delhi     | Transfer detection              | 91 bus↔metro interchanges                  | Haversine grid-bucket (50m)                                            |
| 2026-06-08 | Bengaluru | Preprocessed GTFS → JSON        | stops(8540) routes(4283) shapes(7168)      | `data/raw/bengaluru_gtfs.zip` via BMTC / DULT                          |
| 2026-06-08 | Bengaluru | Transfer detection              | 0 (bus only — no metro GTFS yet)           | Haversine grid-bucket (50m)                                            |
| 2026-06-08 | Chennai   | Created stub GTFS               | stops(5) routes(3)                         | `backend/scripts/setup-chennai.js` (synthetic — not real MTC data)     |
| 2026-06-08 | Chennai   | Preprocessed stub → JSON        | stops(5) routes(3) shapes(0) transfers(0)  | `data/raw/chennai_gtfs.zip` (from stub)                                |
| 2026-06-08 | All       | Split shapes into per-shape dir | ~7200 individual JSON shape files          | `data/split_shapes_per_city.py` with `--city=` flag                    |
| 2026-06-08 | All       | Multi-city restructure          | Moved `data/output/` → `data/{city}/output/` | `backend/utils/cityManager.js` registration                           |
| 2026-06-08 | —         | Validation script               | `data/validate.js` walks all cities        | Summary table at server startup and on-demand via `npm run validate-data` |
