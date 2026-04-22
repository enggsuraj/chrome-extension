#!/usr/bin/env bash
# Regenerate SocialSnap Chrome Web Store screenshots and the promo tile.
# Usage:
#   bash scripts/build-store-assets.sh        # from SocialSnap/
#   bash SocialSnap/scripts/build-store-assets.sh   # from project root
#
# Requirements: Google Chrome installed at /Applications/Google Chrome.app, python3 on PATH.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$EXT_DIR"

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PORT=8787
SHOTS_DIR="store-assets/screenshots"
PROMO_DIR="store-assets/promo"

if [[ ! -x "$CHROME" ]]; then
  echo "Error: Google Chrome not found at $CHROME" >&2
  exit 1
fi

# Start a local HTTP server in the background, kill it on exit.
python3 -m http.server "$PORT" >/dev/null 2>&1 &
SERVER_PID=$!
trap 'kill $SERVER_PID >/dev/null 2>&1 || true' EXIT
sleep 0.8

# Verify the server is up.
if ! curl -sf "http://localhost:$PORT/$SHOTS_DIR/01-hero-light.html" >/dev/null; then
  echo "Error: local HTTP server did not come up on port $PORT" >&2
  exit 1
fi

mkdir -p "$SHOTS_DIR" "$PROMO_DIR"

echo "Generating 1280x800 screenshots..."
for shot in 01-hero-light 02-hero-dark 03-social-tab 04-search; do
  "$CHROME" --headless=new --hide-scrollbars --no-sandbox --disable-gpu \
    --window-size=1280,800 \
    --screenshot="$SHOTS_DIR/$shot.png" \
    "http://localhost:$PORT/$SHOTS_DIR/$shot.html" >/dev/null 2>&1
  printf "  %s\n" "$SHOTS_DIR/$shot.png"
done

echo "Generating 440x280 promo tile..."
"$CHROME" --headless=new --hide-scrollbars --no-sandbox --disable-gpu \
  --window-size=440,280 \
  --screenshot="$PROMO_DIR/small-tile-440x280.png" \
  "http://localhost:$PORT/$PROMO_DIR/small-tile-440x280.html" >/dev/null 2>&1
printf "  %s\n" "$PROMO_DIR/small-tile-440x280.png"

echo ""
echo "Done. Files:"
ls -1 "$SHOTS_DIR"/*.png "$PROMO_DIR"/*.png
