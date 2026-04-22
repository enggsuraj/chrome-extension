#!/usr/bin/env bash
# Build a clean Chrome Web Store upload zip for SocialSnap.
# Usage: bash scripts/build-webstore.sh  (run from SocialSnap/ or project root)

set -euo pipefail

# Resolve the SocialSnap directory regardless of where the script is invoked.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$EXT_DIR"

VERSION=$(grep -E '"version"' manifest.json | head -1 | sed -E 's/.*"version"[[:space:]]*:[[:space:]]*"([^"]+)".*/\1/')
OUT="SocialSnap-webstore-v${VERSION}.zip"

rm -f SocialSnap-webstore.zip "$OUT"

zip -r "$OUT" \
  manifest.json \
  popup.html \
  popup.css \
  popup.js \
  icons/icon-16.png \
  icons/icon-32.png \
  icons/icon-48.png \
  icons/icon-128.png \
  -x "*.DS_Store" "__MACOSX*"

# Also publish a stable filename alongside the versioned one.
cp "$OUT" SocialSnap-webstore.zip

echo ""
echo "Built: $EXT_DIR/$OUT"
echo "Alias: $EXT_DIR/SocialSnap-webstore.zip"
echo ""
unzip -l "$OUT"
