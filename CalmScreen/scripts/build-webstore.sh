#!/usr/bin/env bash
# Build a clean Chrome Web Store upload zip from the CalmScreen extension folder.
# The zip excludes build/dev assets (icons.svg, scripts, store-assets, docs).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

OUT_DIR="$ROOT/dist"
ZIP_NAME="calmscreen-webstore.zip"
ZIP_PATH="$OUT_DIR/$ZIP_NAME"

mkdir -p "$OUT_DIR"
rm -f "$ZIP_PATH"

# Verify the icon PNGs exist (Chrome refuses without them)
for sz in 16 48 128; do
  if [[ ! -f "icons/icon-${sz}.png" ]]; then
    echo "Missing icons/icon-${sz}.png. Run scripts/generate-icons.py first."
    exit 1
  fi
done

zip -r "$ZIP_PATH" \
  manifest.json \
  background.js \
  popup.html popup.css popup.js \
  privacy.html \
  content/ \
  icons/icon-16.png icons/icon-32.png icons/icon-48.png icons/icon-128.png \
  -x "*.DS_Store" -x "*/.*"

echo "Built: $ZIP_PATH"
unzip -l "$ZIP_PATH"
