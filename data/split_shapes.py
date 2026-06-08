"""
UrbanFlow — Split large shapes.json into per-shape files
=========================================================
shapes.json is 120MB — too large to serve directly.
This script splits it into individual files, one per shape_id.

USAGE:
    python split_shapes.py
    # optional env override:
    CITY=bengaluru python split_shapes.py   # writes to bengaluru/output/shapes/

DEFAULT INPUT:  bengaluru/output/shapes.json   (back-compat with v1 layout)
DEFAULT OUTPUT: bengaluru/output/shapes/
"""

import os
import json
from tqdm import tqdm

CITY = os.environ.get("CITY", "bengaluru")
INPUT_FILE  = f"./{CITY}/output/shapes.json"
OUTPUT_DIR  = f"./{CITY}/output/shapes"

os.makedirs(OUTPUT_DIR, exist_ok=True)

print("Loading shapes.json (this may take a moment at 120MB)...")
with open(INPUT_FILE, "r", encoding="utf-8") as f:
    shapes = json.load(f)

print(f"Splitting {len(shapes)} shapes into individual files...")

for shape_id, shape_data in tqdm(shapes.items(), desc="Writing"):
    # sanitize shape_id for use as filename
    safe_id = str(shape_id).replace("/", "_").replace("\\", "_").replace(" ", "_")
    out_path = os.path.join(OUTPUT_DIR, f"{safe_id}.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(shape_data, f, ensure_ascii=False)

# Delete the big original file
os.remove(INPUT_FILE)

print(f"\n[OK] Done! {len(shapes)} shape files written to {OUTPUT_DIR}/")
print("   Original shapes.json deleted.")
print("\n   Now fetch shapes on demand:")
print("   GET /api/shapes/:shape_id  → loads only that route's path")