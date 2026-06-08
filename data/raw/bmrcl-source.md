# BMRCL (Bengaluru Metro) GTFS Source

BMRCL metro GTFS data is not yet available as a public download.

## Potential Sources

| Source | URL | Status |
|--------|-----|--------|
| TransitLand | https://www.transit.land/ | Check for BMRCL feed |
| BMRCL Official | https://bmrcl.co.in/ | Developer portal TBD |
| DULT | https://dult.in/ | Karnataka govt transit portal |
| OpenStreetMap | https://wiki.openstreetmap.org/wiki/Bangalore_Metro | Community-sourced |

## How to Add

1. Download the GTFS zip from one of the sources above
2. Save to `data/raw/bmrcl.zip`
3. Run: `npm run preprocess -- --city=bangalore`
4. Verify: `node data/validate.js bangalore`

## Note

The Bengaluru summary.json lists mode "metro" in anticipation of this data.
Until `bmrcl.zip` is present, transfer detection will report 0 interchanges.
