"""
UrbanFlow — Per-City Shape File Splitter
==========================================
Splits a city's large shapes.json into individual per-shape files
under shapes/<shape_id>.json for lazy loading by the backend.

USAGE:
    python split_shapes_per_city.py                    # default: ACTIVE_CITY or bengaluru
    python split_shapes_per_city.py --city=delhi
    python split_shapes_per_city.py --city=bangalore
    python split_shapes_per_city.py --city=chennai

INPUT:  data/<city>/output/shapes.json     (if it exists)
OUTPUT: data/<city>/output/shapes/*.json

If shapes.json does not exist (already split), the script prints
a message and exits cleanly.
"""

import os
import sys
import json

CITY = "bengaluru"

for arg in sys.argv[1:]:
    if arg.startswith("--city="):
        CITY = arg.split("=", 1)[1]
    elif arg.startswith("CITY="):
        CITY = arg.split("=", 1)[1]

CITY = os.environ.get("ACTIVE_CITY", os.environ.get("CITY", CITY))

BASE_DIR = os.path.join(os.path.dirname(__file__) or ".", CITY, "output")
INPUT_FILE = os.path.join(BASE_DIR, "shapes.json")
OUTPUT_DIR = os.path.join(BASE_DIR, "shapes")

if not os.path.exists(INPUT_FILE):
    print(f"[INFO] shapes.json not found at {INPUT_FILE}")
    existing = os.listdir(OUTPUT_DIR) if os.path.isdir(OUTPUT_DIR) else []
    if existing:
        print(f"   Shapes already split: {len(existing)} files in {OUTPUT_DIR}/")
    else:
        print(f"   No shape files found -- preprocess this city first.")
    sys.exit(0)

os.makedirs(OUTPUT_DIR, exist_ok=True)

print(f"Loading shapes.json for {CITY}...")
with open(INPUT_FILE, "r", encoding="utf-8") as f:
    shapes = json.load(f)

print(f"Splitting {len(shapes)} shapes into individual files...")

for shape_id, shape_data in shapes.items():
    safe_id = str(shape_id).replace("/", "_").replace("\\", "_").replace(" ", "_")
    out_path = os.path.join(OUTPUT_DIR, f"{safe_id}.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(shape_data, f, ensure_ascii=False)

os.remove(INPUT_FILE)
print(f"[OK] {len(shapes)} shape files written to {OUTPUT_DIR}/")
print(f"     Original shapes.json deleted.")
