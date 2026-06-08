"""
UrbanFlow Delhi — GTFS Data Preprocessing Pipeline
===================================================
Processes Delhi DTC/DIMTS bus + DMRC metro GTFS feeds.

USAGE:
  pip install pandas tqdm
  python preprocess_delhi.py

INPUTS (place in ./delhi/raw/ folder):
  delhi_bus.zip   — from Open Transit Data Delhi (OTD)
  delhi_metro.zip — from OTD DMRC portal

OUTPUTS (written to ./delhi/output/ folder):
  stops.json, routes.json, shapes.json, transfers.json
  search_index.json, summary.json, schedule/*.json
"""

import os
import json
import zipfile
import pandas as pd
from tqdm import tqdm

# ── Config ──────────────────────────────────────────────────────────────
RAW_DIR    = "./delhi/raw"
OUTPUT_DIR = "./delhi/output"
FEEDS = {
    "bus":   os.path.join(RAW_DIR, "delhi_bus.zip"),
    "metro": os.path.join(RAW_DIR, "delhi_metro.zip"),
}
os.makedirs(OUTPUT_DIR, exist_ok=True)

ROUTE_TYPE_MAP = {0: "tram", 1: "metro", 2: "rail", 3: "bus", 4: "ferry", 5: "cable_car", 11: "trolleybus", 12: "monorail"}

MODE_COLORS = {"bus": "#f59e0b", "metro": "#7c3aed", "rail": "#2563eb", "walk": "#6b7280"}


def read_gtfs_file(zip_path, filename):
    try:
        with zipfile.ZipFile(zip_path, "r") as z:
            # Filter out macOS metadata files
            valid_files = [f for f in z.namelist() if not f.startswith("._") and f == filename]
            if not valid_files:
                valid_files = [f for f in z.namelist() if f.endswith(filename)]
            if not valid_files:
                return pd.DataFrame()
            with z.open(valid_files[0]) as f:
                return pd.read_csv(f, dtype=str, low_memory=False)
    except (KeyError, FileNotFoundError):
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
print("\n[1/7] Loading Delhi GTFS feeds...")

all_stops, all_routes, all_trips, all_stop_times = [], [], [], []
all_shapes, all_transfers, all_fare_attr, all_fare_rules = [], [], [], []

for mode, zip_path in FEEDS.items():
    if not os.path.exists(zip_path):
        print(f"  [SKIP] {zip_path} not found")
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
    
    for df in [stops, routes, trips, stop_times, shapes, transfers, fare_attr, fare_rules]:
        if not df.empty:
            df["_mode"] = mode
    
    all_stops.append(stops); all_routes.append(routes); all_trips.append(trips); all_stop_times.append(stop_times)
    all_shapes.append(shapes); all_transfers.append(transfers); all_fare_attr.append(fare_attr); all_fare_rules.append(fare_rules)

stops      = pd.concat([d for d in all_stops      if not d.empty], ignore_index=True) if any(not d.empty for d in all_stops) else pd.DataFrame()
routes     = pd.concat([d for d in all_routes     if not d.empty], ignore_index=True) if any(not d.empty for d in all_routes) else pd.DataFrame()
trips      = pd.concat([d for d in all_trips      if not d.empty], ignore_index=True) if any(not d.empty for d in all_trips) else pd.DataFrame()
stop_times = pd.concat([d for d in all_stop_times if not d.empty], ignore_index=True) if any(not d.empty for d in all_stop_times) else pd.DataFrame()
shapes_df  = pd.concat([d for d in all_shapes     if not d.empty], ignore_index=True) if any(not d.empty for d in all_shapes) else pd.DataFrame()
transfers  = pd.concat([d for d in all_transfers  if not d.empty], ignore_index=True) if any(not d.empty for d in all_transfers) else pd.DataFrame()
fare_attr  = pd.concat([d for d in all_fare_attr  if not d.empty], ignore_index=True) if any(not d.empty for d in all_fare_attr) else pd.DataFrame()
fare_rules = pd.concat([d for d in all_fare_rules if not d.empty], ignore_index=True) if any(not d.empty for d in all_fare_rules) else pd.DataFrame()

print(f"  Loaded: {len(stops)} stops, {len(routes)} routes, {len(trips)} trips, {len(shapes_df)} shapes")


# ── Step 2: Clean Stops ───────────────────────────────────────────────────
print("\n[2/7] Cleaning stops...")
stops = stops.dropna(subset=["stop_lat", "stop_lon"])
stops["stop_lat"] = stops["stop_lat"].apply(safe_float)
stops["stop_lon"] = stops["stop_lon"].apply(safe_float)
# Filter to Delhi NCR bounding box
stops = stops[(stops["stop_lat"].between(28.3, 29.0)) & (stops["stop_lon"].between(76.7, 77.5))]
stops = stops.drop_duplicates(subset=["stop_id", "_mode"])

stops_out = []
for _, row in tqdm(stops.iterrows(), total=len(stops), desc="  stops"):
    stops_out.append({
        "id": clean_str(row.get("stop_id")), "name": clean_str(row.get("stop_name")),
        "lat": row["stop_lat"], "lon": row["stop_lon"],
        "mode": row.get("_mode", "bus"), "code": clean_str(row.get("stop_code")),
        "desc": clean_str(row.get("stop_desc")),
        "color": MODE_COLORS.get(row.get("_mode", "bus"), "#f59e0b"),
    })
print(f"  Clean stops: {len(stops_out)}")


# ── Step 3: Clean Routes ──────────────────────────────────────────────────
print("\n[3/7] Cleaning routes...")
fare_lookup = {}
if not fare_attr.empty and not fare_rules.empty:
    merged_fares = fare_rules.merge(fare_attr[["fare_id", "price", "currency_type", "_mode"]], on="fare_id", how="left")
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
        "id": route_id, "short_name": clean_str(row.get("route_short_name")),
        "long_name": clean_str(row.get("route_long_name")), "type": route_type,
        "mode": mode_name, "color": f"#{clean_str(row.get('route_color')) or 'f59e0b'}",
        "text_color": f"#{clean_str(row.get('route_text_color')) or 'ffffff'}",
        "agency_id": clean_str(row.get("agency_id")),
        "fare": fare_lookup.get(route_id),
        "map_color": MODE_COLORS.get(row.get("_mode", "bus"), "#f59e0b"),
    })
print(f"  Clean routes: {len(routes_out)}")


# ── Step 4: Build Schedule ────────────────────────────────────────────────
print("\n[4/7] Building schedule...")
trips_merged = trips.merge(routes[["route_id", "route_short_name", "route_long_name"]], on="route_id", how="left")
schedule_merged = stop_times.merge(trips_merged[["trip_id", "route_id", "route_short_name", "direction_id"]], on="trip_id", how="left")
schedule_merged["stop_sequence"] = pd.to_numeric(schedule_merged.get("stop_sequence", pd.Series()), errors="coerce")
schedule_merged = schedule_merged.sort_values(["trip_id", "stop_sequence"])

schedule_out = {}
for route_id, grp in tqdm(schedule_merged.groupby("route_id"), desc="  routes"):
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
print(f"  Schedule built for {len(schedule_out)} routes")


# ── Step 5: Build Shapes ──────────────────────────────────────────────────
print("\n[5/7] Building map shapes...")
shapes_out = {}
if not shapes_df.empty:
    shapes_df["shape_pt_sequence"] = pd.to_numeric(shapes_df.get("shape_pt_sequence", pd.Series()), errors="coerce")
    shapes_df["shape_pt_lat"] = shapes_df["shape_pt_lat"].apply(safe_float)
    shapes_df["shape_pt_lon"] = shapes_df["shape_pt_lon"].apply(safe_float)
    shapes_df = shapes_df.dropna(subset=["shape_pt_lat", "shape_pt_lon"])
    shapes_df = shapes_df.sort_values(["shape_id", "shape_pt_sequence"])
    for shape_id, grp in tqdm(shapes_df.groupby("shape_id"), desc="  shapes"):
        coords = [[row["shape_pt_lon"], row["shape_pt_lat"]] for _, row in grp.iterrows()]
        shapes_out[str(shape_id)] = {"type": "LineString", "coordinates": coords, "mode": clean_str(grp.iloc[0].get("_mode"))}
print(f"  Shapes built: {len(shapes_out)}")


# ── Step 6: Build Transfers ──────────────────────────────────────────────
print("\n[6/7] Building transfer points...")
transfers_out = []
if not transfers.empty:
    for _, row in transfers.iterrows():
        transfers_out.append({
            "from_stop_id": clean_str(row.get("from_stop_id")), "to_stop_id": clean_str(row.get("to_stop_id")),
            "type": clean_str(row.get("transfer_type")), "min_time_sec": safe_float(row.get("min_transfer_time")),
        })

# Auto-detect interchanges: stops from different modes within ~50m
def _haversine_km(lat1, lon1, lat2, lon2):
    from math import radians, cos, sin, sqrt, asin
    R = 6371
    dlat = radians(lat2 - lat1); dlon = radians(lon2 - lon1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    return 2 * R * asin(sqrt(a))

auto_count = 0
if "_mode" in stops.columns:
    seen = set()
    buckets = {}
    for _, s in stops.iterrows():
        key = (round(s["stop_lat"], 2), round(s["stop_lon"], 2), s["_mode"])
        buckets.setdefault(key, []).append(s)
    for (_, _, ma), sa in buckets.items():
        for (_, _, mb), sb in buckets.items():
            if ma >= mb:
                continue
            for a in sa:
                for b in sb:
                    dm = _haversine_km(a["stop_lat"], a["stop_lon"], b["stop_lat"], b["stop_lon"]) * 1000
                    if dm <= 50:
                        pk = tuple(sorted([a["stop_id"], b["stop_id"]]))
                        if pk not in seen:
                            seen.add(pk)
                            transfers_out.append({"from_stop_id": str(a["stop_id"]), "to_stop_id": str(b["stop_id"]), "type": "0", "min_time_sec": 120})
                            auto_count += 1

print(f"  Transfers (GTFS): {len(transfers_out) - auto_count}")
print(f"  Transfers (auto): {auto_count}")


# ── Step 7: Build Search Index ────────────────────────────────────────────
print("\n[7/7] Building search index...")
search_index = []
for s in stops_out:
    if s["name"]:
        search_index.append({"id": s["id"], "name": s["name"], "type": "stop", "mode": s["mode"], "lat": s["lat"], "lon": s["lon"]})
for r in routes_out:
    name = r["long_name"] or r["short_name"]
    if name:
        search_index.append({"id": r["id"], "name": name, "type": "route", "mode": r["mode"]})
print(f"  Search index: {len(search_index)} entries")


# ── Write Outputs ─────────────────────────────────────────────────────────
print("\n Writing output files...")

def write_json(filename, data):
    p = os.path.join(OUTPUT_DIR, filename)
    with open(p, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    sz = os.path.getsize(p) / 1024
    print(f"  {filename:30s} → {len(data) if isinstance(data, (list,dict)) else '?':>6} items  ({sz:.1f} KB)")

write_json("stops.json",        stops_out)
write_json("routes.json",       routes_out)
write_json("shapes.json",       shapes_out)
write_json("transfers.json",    transfers_out)
write_json("search_index.json", search_index)

schedule_dir = os.path.join(OUTPUT_DIR, "schedule")
os.makedirs(schedule_dir, exist_ok=True)
for route_id, trips_data in tqdm(schedule_out.items(), desc="  schedule files"):
    with open(os.path.join(schedule_dir, f"{route_id}.json"), "w", encoding="utf-8") as f:
        json.dump(trips_data, f, ensure_ascii=False)
print(f"  schedule/          -> {len(schedule_out)} files (one per route)")

# Split shapes into individual files (shapes.json is huge)
shapes_dir = os.path.join(OUTPUT_DIR, "shapes")
os.makedirs(shapes_dir, exist_ok=True)
for shape_id, shape_data in tqdm(shapes_out.items(), desc="  shape files"):
    safe_id = str(shape_id).replace("/", "_").replace("\\", "_").replace(" ", "_")
    with open(os.path.join(shapes_dir, f"{safe_id}.json"), "w", encoding="utf-8") as f:
        json.dump(shape_data, f, ensure_ascii=False)
# Remove big shapes.json
os.remove(os.path.join(OUTPUT_DIR, "shapes.json"))
print(f"  shapes/           -> {len(shapes_out)} individual files")

summary = {
    "total_stops": len(stops_out), "total_routes": len(routes_out),
    "total_shapes": len(shapes_out), "total_transfers": len(transfers_out),
    "modes": list(FEEDS.keys()), "city": "Delhi",
    "bbox": {"min_lat": 28.3, "max_lat": 29.0, "min_lon": 76.7, "max_lon": 77.5}
}
with open(os.path.join(OUTPUT_DIR, "summary.json"), "w", encoding="utf-8") as f:
    json.dump(summary, f, ensure_ascii=False, indent=2)
print(f"  summary.json       -> {len(summary)} keys")

print("\n[OK] Delhi preprocessing complete!")
print(f"   All files written to: {os.path.abspath(OUTPUT_DIR)}/")
