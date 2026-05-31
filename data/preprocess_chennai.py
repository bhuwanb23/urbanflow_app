"""
UrbanFlow Chennai — GTFS Data Preprocessing Pipeline
=====================================================
Processes MTC Chennai GTFS feed.

USAGE:
  pip install pandas tqdm
  python preprocess_chennai.py

INPUTS (place in ./chennai/raw/ folder):
  mtc_chennai.zip — from TransitLand or MTC

OUTPUTS (written to ./chennai/output/ folder):
  stops.json, routes.json, search_index.json, summary.json
  schedule/*.json, shapes/*.json
"""

import os, json, zipfile
import pandas as pd
from tqdm import tqdm

RAW_DIR    = "./chennai/raw"
OUTPUT_DIR = "./chennai/output"
FEED = os.path.join(RAW_DIR, "mtc_chennai.zip")
os.makedirs(OUTPUT_DIR, exist_ok=True)

ROUTE_TYPE_MAP = {0: "tram", 1: "metro", 2: "rail", 3: "bus", 4: "ferry", 5: "cable_car", 11: "trolleybus", 12: "monorail"}
MODE_COLORS = {"bus": "#f59e0b", "metro": "#7c3aed", "rail": "#2563eb", "walk": "#6b7280"}

def read_gtfs_file(zip_path, filename):
    try:
        with zipfile.ZipFile(zip_path, "r") as z:
            valid = [f for f in z.namelist() if not f.startswith("._") and f.endswith(filename)]
            if not valid:
                return pd.DataFrame()
            with z.open(valid[0]) as f:
                return pd.read_csv(f, dtype=str, low_memory=False)
    except (KeyError, FileNotFoundError):
        return pd.DataFrame()

def clean_str(val):
    if pd.isna(val): return None
    return str(val).strip()

def safe_float(val):
    try: return float(val)
    except: return None

print("\n[1/3] Loading Chennai GTFS feed...")
if not os.path.exists(FEED):
    print(f"  [WARN] {FEED} not found — using sample data from ./chennai/gtfs/")
    stops      = pd.read_csv("./chennai/gtfs/stops.txt", dtype=str)
    routes     = pd.read_csv("./chennai/gtfs/routes.txt", dtype=str)
    trips      = pd.read_csv("./chennai/gtfs/trips.txt", dtype=str)
    stop_times = pd.read_csv("./chennai/gtfs/stop_times.txt", dtype=str)
    shapes_df  = pd.DataFrame()
else:
    stops      = read_gtfs_file(FEED, "stops.txt")
    routes     = read_gtfs_file(FEED, "routes.txt")
    trips      = read_gtfs_file(FEED, "trips.txt")
    stop_times = read_gtfs_file(FEED, "stop_times.txt")
    shapes_df  = read_gtfs_file(FEED, "shapes.txt")

for df in [stops, routes, trips, stop_times, shapes_df]:
    if not df.empty:
        df["_mode"] = "bus"

stops = stops.dropna(subset=["stop_lat", "stop_lon"]) if not stops.empty else pd.DataFrame()
if not stops.empty:
    stops["stop_lat"] = stops["stop_lat"].apply(safe_float)
    stops["stop_lon"] = stops["stop_lon"].apply(safe_float)

print(f"  Loaded: {len(stops)} stops, {len(routes)} routes, {len(trips)} trips, {len(shapes_df)} shapes")

print("\n[2/3] Processing stops and routes...")
stops_out = []
if not stops.empty:
    for _, row in tqdm(stops.iterrows(), total=len(stops), desc="  stops"):
        stops_out.append({
            "id": clean_str(row.get("stop_id")), "name": clean_str(row.get("stop_name")),
            "lat": row["stop_lat"], "lon": row["stop_lon"],
            "mode": "bus", "code": clean_str(row.get("stop_code")),
            "desc": clean_str(row.get("stop_desc")), "color": "#f59e0b",
        })

routes_out = []
if not routes.empty:
    for _, row in tqdm(routes.iterrows(), total=len(routes), desc="  routes"):
        route_type = int(row["route_type"]) if clean_str(row.get("route_type")) else 3
        mode_name = ROUTE_TYPE_MAP.get(route_type, "bus")
        routes_out.append({
            "id": clean_str(row.get("route_id")), "short_name": clean_str(row.get("route_short_name")),
            "long_name": clean_str(row.get("route_long_name")), "type": route_type,
            "mode": mode_name, "color": f"#{clean_str(row.get('route_color')) or 'f59e0b'}",
            "text_color": f"#{clean_str(row.get('route_text_color')) or 'ffffff'}",
            "agency_id": clean_str(row.get("agency_id")),
        })

print(f"  Clean stops: {len(stops_out)}, routes: {len(routes_out)}")

print("\n[3/3] Building search index and outputs...")
search_index = []
for s in stops_out:
    if s["name"]:
        search_index.append({"id": s["id"], "name": s["name"], "type": "stop", "mode": "bus", "lat": s["lat"], "lon": s["lon"]})
for r in routes_out:
    name = r["long_name"] or r["short_name"]
    if name:
        search_index.append({"id": r["id"], "name": name, "type": "route", "mode": "bus"})

def write_json(filename, data):
    p = os.path.join(OUTPUT_DIR, filename)
    with open(p, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    sz = os.path.getsize(p) / 1024
    print(f"  {filename:30s} -> {len(data) if isinstance(data, (list,dict)) else '?':>6} items  ({sz:.1f} KB)")

write_json("stops.json", stops_out)
write_json("routes.json", routes_out)
write_json("search_index.json", search_index)

# Shapes from individual files if they exist
shape_files = []
shapes_dir_in = os.path.join(os.path.dirname(RAW_DIR), "shapes")
shapes_dir_out = os.path.join(OUTPUT_DIR, "shapes")
if os.path.isdir(shapes_dir_in):
    os.makedirs(shapes_dir_out, exist_ok=True)
    for fname in os.listdir(shapes_dir_in):
        if fname.endswith(".json"):
            with open(os.path.join(shapes_dir_in, fname), "r") as f:
                shape_data = json.load(f)
            with open(os.path.join(shapes_dir_out, fname), "w", encoding="utf-8") as f:
                json.dump(shape_data, f, ensure_ascii=False)
            shape_files.append(fname)
    print(f"  shapes/           -> {len(shape_files)} files copied")

# Schedule
schedule_out = {}
if not trips.empty and not stop_times.empty:
    merged = stop_times.merge(trips[["trip_id", "route_id", "direction_id"]], on="trip_id", how="left")
    merged["stop_sequence"] = pd.to_numeric(merged.get("stop_sequence", pd.Series()), errors="coerce")
    merged = merged.sort_values(["trip_id", "stop_sequence"])
    for route_id, grp in tqdm(merged.groupby("route_id"), desc="  schedule"):
        trips_in_route = {}
        for trip_id, tgrp in grp.groupby("trip_id"):
            stops_in_trip = []
            for _, srow in tgrp.iterrows():
                stops_in_trip.append({
                    "stop_id": clean_str(srow.get("stop_id")),
                    "arrival": clean_str(srow.get("arrival_time")),
                    "departure": clean_str(srow.get("departure_time")),
                    "sequence": int(srow["stop_sequence"]) if not pd.isna(srow.get("stop_sequence")) else None,
                })
            trips_in_route[str(trip_id)] = {"direction": clean_str(tgrp.iloc[0].get("direction_id")), "stops": stops_in_trip}
        schedule_out[str(route_id)] = trips_in_route

schedule_dir = os.path.join(OUTPUT_DIR, "schedule")
os.makedirs(schedule_dir, exist_ok=True)
for route_id, trips_data in schedule_out.items():
    with open(os.path.join(schedule_dir, f"{route_id}.json"), "w", encoding="utf-8") as f:
        json.dump(trips_data, f, ensure_ascii=False)
print(f"  schedule/         -> {len(schedule_out)} files")

summary = {
    "total_stops": len(stops_out), "total_routes": len(routes_out),
    "total_shapes": len(shape_files), "city": "Chennai",
    "bbox": {"min_lat": 12.91, "max_lat": 13.25, "min_lon": 80.16, "max_lon": 80.34}
}
with open(os.path.join(OUTPUT_DIR, "summary.json"), "w", encoding="utf-8") as f:
    json.dump(summary, f, ensure_ascii=False, indent=2)
print(f"  summary.json       -> {len(summary)} keys")

print("\n[OK] Chennai preprocessing complete!")
print(f"   All files written to: {os.path.abspath(OUTPUT_DIR)}/")
