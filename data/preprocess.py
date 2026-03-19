"""
UrbanFlow — GTFS Data Preprocessing Pipeline
============================================
Run this script after downloading BMTC and BMRCL GTFS zips.
Outputs clean JSON + CSV files ready for the UrbanFlow backend.

USAGE:
  pip install gtfs-kit pandas shapely tqdm
  python preprocess.py

INPUTS (place in ./raw/ folder):
  raw/bmtc.zip   — from https://github.com/Vonter/bmtc-gtfs
  raw/bmrcl.zip  — from DULT portal / community source

OUTPUTS (written to ./output/ folder):
  stops.json          — all stops with coords, type, name
  routes.json         — all routes with mode, color, fare
  schedule.json       — timetable per route
  shapes.json         — GPS polylines for map drawing
  transfers.json      — interchange points between modes
  search_index.json   — stop + route name search index for frontend
  summary.json        — stats (total routes, stops, etc.)
"""

import os
import json
import zipfile
import pandas as pd
from tqdm import tqdm

# ── Config ──────────────────────────────────────────────────────────────
RAW_DIR    = "./raw"
OUTPUT_DIR = "./output"
FEEDS = {
    "bus":   os.path.join(RAW_DIR, "bmtc.zip"),
    "metro": os.path.join(RAW_DIR, "bmrcl.zip"),
}
os.makedirs(OUTPUT_DIR, exist_ok=True)

# GTFS route_type codes → human readable
ROUTE_TYPE_MAP = {
    0: "tram",
    1: "metro",
    2: "rail",
    3: "bus",
    4: "ferry",
    5: "cable_car",
    11: "trolleybus",
    12: "monorail",
}

# Mode colors for frontend map rendering
MODE_COLORS = {
    "bus":   "#16a34a",   # green
    "metro": "#7c3aed",   # purple
    "rail":  "#2563eb",   # blue
    "walk":  "#6b7280",   # gray
}


# ── Helpers ──────────────────────────────────────────────────────────────

def read_gtfs_file(zip_path: str, filename: str) -> pd.DataFrame:
    """Read a single txt file from a GTFS zip into a DataFrame."""
    try:
        with zipfile.ZipFile(zip_path, "r") as z:
            with z.open(filename) as f:
                return pd.read_csv(f, dtype=str, low_memory=False)
    except KeyError:
        print(f"  [WARN] {filename} not found in {zip_path}")
        return pd.DataFrame()


def clean_str(val):
    if pd.isna(val):
        return None
    return str(val).strip()


def safe_float(val):
    try:
        return float(val)
    except Exception:
        return None


# ── Step 1: Load all feeds ────────────────────────────────────────────────

print("\n[1/7] Loading GTFS feeds...")

all_stops      = []
all_routes     = []
all_trips      = []
all_stop_times = []
all_shapes     = []
all_transfers  = []
all_fare_attr  = []
all_fare_rules = []

for mode, zip_path in FEEDS.items():
    if not os.path.exists(zip_path):
        print(f"  [SKIP] {zip_path} not found — skipping {mode}")
        continue

    print(f"  Loading {mode} from {zip_path}...")

    stops      = read_gtfs_file(zip_path, "stops.txt")
    routes     = read_gtfs_file(zip_path, "routes.txt")
    trips      = read_gtfs_file(zip_path, "trips.txt")
    stop_times = read_gtfs_file(zip_path, "stop_times.txt")
    shapes     = read_gtfs_file(zip_path, "shapes.txt")
    transfers  = read_gtfs_file(zip_path, "transfers.txt")
    fare_attr  = read_gtfs_file(zip_path, "fare_attributes.txt")
    fare_rules = read_gtfs_file(zip_path, "fare_rules.txt")

    # Tag each row with its mode
    for df in [stops, routes, trips, stop_times, shapes, transfers, fare_attr, fare_rules]:
        if not df.empty:
            df["_mode"] = mode

    all_stops.append(stops)
    all_routes.append(routes)
    all_trips.append(trips)
    all_stop_times.append(stop_times)
    all_shapes.append(shapes)
    all_transfers.append(transfers)
    all_fare_attr.append(fare_attr)
    all_fare_rules.append(fare_rules)

# Only concat if we have data
stops      = pd.concat([d for d in all_stops      if not d.empty], ignore_index=True) if any(not d.empty for d in all_stops) else pd.DataFrame()
routes     = pd.concat([d for d in all_routes     if not d.empty], ignore_index=True) if any(not d.empty for d in all_routes) else pd.DataFrame()
trips      = pd.concat([d for d in all_trips      if not d.empty], ignore_index=True) if any(not d.empty for d in all_trips) else pd.DataFrame()
stop_times = pd.concat([d for d in all_stop_times if not d.empty], ignore_index=True) if any(not d.empty for d in all_stop_times) else pd.DataFrame()
shapes_df  = pd.concat([d for d in all_shapes     if not d.empty], ignore_index=True) if any(not d.empty for d in all_shapes) else pd.DataFrame()
transfers  = pd.concat([d for d in all_transfers  if not d.empty], ignore_index=True) if any(not d.empty for d in all_transfers) else pd.DataFrame()
fare_attr  = pd.concat([d for d in all_fare_attr  if not d.empty], ignore_index=True) if any(not d.empty for d in all_fare_attr) else pd.DataFrame()
fare_rules = pd.concat([d for d in all_fare_rules if not d.empty], ignore_index=True) if any(not d.empty for d in all_fare_rules) else pd.DataFrame()

print(f"  Loaded: {len(stops)} stops, {len(routes)} routes, {len(trips)} trips")


# ── Step 2: Clean Stops ───────────────────────────────────────────────────

print("\n[2/7] Cleaning stops...")

stops = stops.dropna(subset=["stop_lat", "stop_lon"])
stops["stop_lat"] = stops["stop_lat"].apply(safe_float)
stops["stop_lon"] = stops["stop_lon"].apply(safe_float)

# Remove stops clearly outside Bengaluru bounding box
stops = stops[
    (stops["stop_lat"].between(12.7, 13.2)) &
    (stops["stop_lon"].between(77.3, 77.9))
]

# Remove duplicates by stop_id + mode
stops = stops.drop_duplicates(subset=["stop_id", "_mode"])

stops_out = []
for _, row in tqdm(stops.iterrows(), total=len(stops), desc="  stops"):
    stops_out.append({
        "id":       clean_str(row.get("stop_id")),
        "name":     clean_str(row.get("stop_name")),
        "lat":      row["stop_lat"],
        "lon":      row["stop_lon"],
        "mode":     row.get("_mode", "bus"),
        "code":     clean_str(row.get("stop_code")),
        "desc":     clean_str(row.get("stop_desc")),
        "color":    MODE_COLORS.get(row.get("_mode", "bus"), "#16a34a"),
    })

print(f"  Clean stops: {len(stops_out)}")


# ── Step 3: Clean Routes ──────────────────────────────────────────────────

print("\n[3/7] Cleaning routes...")

# Build fare lookup: route_id → min fare
fare_lookup = {}
if not fare_attr.empty and not fare_rules.empty:
    merged_fares = fare_rules.merge(
        fare_attr[["fare_id", "price", "currency_type", "_mode"]],
        on="fare_id", how="left"
    )
    merged_fares["price"] = merged_fares["price"].apply(safe_float)
    for route_id, grp in merged_fares.groupby("route_id"):
        fare_lookup[str(route_id)] = {
            "min_fare": round(grp["price"].min(), 2) if not grp["price"].isna().all() else None,
            "max_fare": round(grp["price"].max(), 2) if not grp["price"].isna().all() else None,
            "currency": clean_str(grp["currency_type"].iloc[0]),
        }

routes_out = []
for _, row in tqdm(routes.iterrows(), total=len(routes), desc="  routes"):
    route_id   = clean_str(row.get("route_id"))
    route_type = int(row["route_type"]) if clean_str(row.get("route_type")) else 3
    mode_name  = ROUTE_TYPE_MAP.get(route_type, "bus")

    routes_out.append({
        "id":         route_id,
        "short_name": clean_str(row.get("route_short_name")),
        "long_name":  clean_str(row.get("route_long_name")),
        "type":       route_type,
        "mode":       mode_name,
        "color":      f"#{clean_str(row.get('route_color')) or '16a34a'}",
        "text_color": f"#{clean_str(row.get('route_text_color')) or 'ffffff'}",
        "agency_id":  clean_str(row.get("agency_id")),
        "fare":       fare_lookup.get(route_id),
        "map_color":  MODE_COLORS.get(row.get("_mode", "bus"), "#16a34a"),
    })

print(f"  Clean routes: {len(routes_out)}")


# ── Step 4: Build Schedule ────────────────────────────────────────────────

print("\n[4/7] Building schedule (trip → stops → times)...")

# Merge trips with routes to get route_id on each trip
trips_merged = trips.merge(
    routes[["route_id", "route_short_name", "route_long_name", "_mode"]],
    on="route_id", how="left"
)

# Merge stop_times with trips
schedule_merged = stop_times.merge(
    trips_merged[["trip_id", "route_id", "route_short_name", "direction_id", "_mode"]],
    on="trip_id", how="left"
)

# Sort by trip + stop sequence
schedule_merged["stop_sequence"] = pd.to_numeric(
    schedule_merged.get("stop_sequence", pd.Series()), errors="coerce"
)
schedule_merged = schedule_merged.sort_values(["trip_id", "stop_sequence"])

# Group by route → list of trips → list of stops
schedule_out = {}
print("  Grouping by route...")

for route_id, grp in tqdm(schedule_merged.groupby("route_id"), desc="  routes"):
    trips_in_route = {}
    for trip_id, tgrp in grp.groupby("trip_id"):
        stops_in_trip = []
        for _, srow in tgrp.iterrows():
            stops_in_trip.append({
                "stop_id":    clean_str(srow.get("stop_id")),
                "arrival":    clean_str(srow.get("arrival_time")),
                "departure":  clean_str(srow.get("departure_time")),
                "sequence":   int(srow["stop_sequence"]) if not pd.isna(srow.get("stop_sequence")) else None,
            })
        trips_in_route[str(trip_id)] = {
            "direction": clean_str(tgrp.iloc[0].get("direction_id")),
            "stops":     stops_in_trip,
        }

    schedule_out[str(route_id)] = trips_in_route

print(f"  Schedule built for {len(schedule_out)} routes")


# ── Step 5: Build Shapes (map polylines) ─────────────────────────────────

print("\n[5/7] Building map shapes...")

shapes_out = {}
if not shapes_df.empty:
    shapes_df["shape_pt_sequence"] = pd.to_numeric(
        shapes_df.get("shape_pt_sequence", pd.Series()), errors="coerce"
    )
    shapes_df["shape_pt_lat"] = shapes_df["shape_pt_lat"].apply(safe_float)
    shapes_df["shape_pt_lon"] = shapes_df["shape_pt_lon"].apply(safe_float)
    shapes_df = shapes_df.dropna(subset=["shape_pt_lat", "shape_pt_lon"])
    shapes_df = shapes_df.sort_values(["shape_id", "shape_pt_sequence"])

    for shape_id, grp in tqdm(shapes_df.groupby("shape_id"), desc="  shapes"):
        coords = [[row["shape_pt_lon"], row["shape_pt_lat"]] for _, row in grp.iterrows()]
        shapes_out[str(shape_id)] = {
            "type":        "LineString",
            "coordinates": coords,
            "mode":        clean_str(grp.iloc[0].get("_mode")),
        }

print(f"  Shapes built: {len(shapes_out)}")


# ── Step 6: Build Transfers (interchange points) ──────────────────────────

print("\n[6/7] Building transfer points...")

transfers_out = []
if not transfers.empty:
    for _, row in transfers.iterrows():
        transfers_out.append({
            "from_stop_id": clean_str(row.get("from_stop_id")),
            "to_stop_id":   clean_str(row.get("to_stop_id")),
            "type":         clean_str(row.get("transfer_type")),
            "min_time_sec": safe_float(row.get("min_transfer_time")),
        })

print(f"  Transfers: {len(transfers_out)}")


# ── Step 7: Build Search Index ────────────────────────────────────────────

print("\n[7/7] Building search index...")

search_index = []

for s in stops_out:
    if s["name"]:
        search_index.append({
            "id":    s["id"],
            "name":  s["name"],
            "type":  "stop",
            "mode":  s["mode"],
            "lat":   s["lat"],
            "lon":   s["lon"],
        })

for r in routes_out:
    name = r["long_name"] or r["short_name"]
    if name:
        search_index.append({
            "id":   r["id"],
            "name": name,
            "type": "route",
            "mode": r["mode"],
        })

print(f"  Search index: {len(search_index)} entries")


# ── Write Outputs ─────────────────────────────────────────────────────────

print("\n Writing output files...")

def write_json(filename, data):
    path = os.path.join(OUTPUT_DIR, filename)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    size_kb = os.path.getsize(path) / 1024
    print(f"  {filename:30s} → {len(data) if isinstance(data, (list,dict)) else '?':>6} items  ({size_kb:.1f} KB)")

write_json("stops.json",        stops_out)
write_json("routes.json",       routes_out)
write_json("shapes.json",       shapes_out)
write_json("transfers.json",    transfers_out)
write_json("search_index.json", search_index)

# Schedule is large — write per-route files to avoid one giant JSON
schedule_dir = os.path.join(OUTPUT_DIR, "schedule")
os.makedirs(schedule_dir, exist_ok=True)
for route_id, trips_data in tqdm(schedule_out.items(), desc="  schedule files"):
    with open(os.path.join(schedule_dir, f"{route_id}.json"), "w") as f:
        json.dump(trips_data, f, ensure_ascii=False)
print(f"  schedule/          → {len(schedule_out)} files (one per route)")

# Summary
summary = {
    "total_stops":     len(stops_out),
    "total_routes":    len(routes_out),
    "total_shapes":    len(shapes_out),
    "total_transfers": len(transfers_out),
    "modes":           list(FEEDS.keys()),
    "city":            "Bengaluru",
    "bbox": {
        "min_lat": 12.7, "max_lat": 13.2,
        "min_lon": 77.3, "max_lon": 77.9,
    }
}
write_json("summary.json", summary)

print("\n✅ Preprocessing complete!")
print(f"   All files written to: {os.path.abspath(OUTPUT_DIR)}/")
print("\n   Next step → Load output/ into your UrbanFlow backend API")