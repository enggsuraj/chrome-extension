#!/usr/bin/env bash
# Render every *.html in store-assets/{screenshots,promo} into a same-named PNG
# using headless Chrome. Output dimensions:
#   - screenshots: 1280x800 (Chrome Web Store recommended)
#   - small tile:  440x280
#   - marquee:     1400x560
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

CHROME="${CHROME_BIN:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
if [[ ! -x "$CHROME" ]]; then
  CHROME="$(command -v google-chrome || command -v chrome || command -v chromium || true)"
fi
if [[ -z "$CHROME" || ! -x "$CHROME" ]]; then
  echo "Could not find Chrome. Set CHROME_BIN env var to your Chrome executable."
  exit 1
fi

PORT=8801
python3 -m http.server "$PORT" --directory "$ROOT" >/dev/null 2>&1 &
SPID=$!
trap 'kill $SPID 2>/dev/null || true' EXIT
sleep 0.5

render() {
  local input="$1" output="$2" w="$3" h="$4"
  echo "  rendering ${input} → ${output} (${w}x${h})"
  "$CHROME" \
    --headless=new --hide-scrollbars --no-sandbox --disable-gpu \
    --window-size="${w},${h}" \
    --screenshot="$output" \
    "http://localhost:${PORT}/${input}" >/dev/null 2>&1
}

echo "→ Screenshots (1280x800)"
for src in store-assets/screenshots/*.html; do
  base="$(basename "$src" .html)"
  [[ "$base" == "preview-page" ]] && continue
  render "$src" "store-assets/screenshots/${base}.png" 1280 800
done

echo "→ Small tile (440x280)"
render "store-assets/promo/small-tile-440x280.html" \
       "store-assets/promo/small-tile-440x280.png" 440 280

echo "→ Marquee (1400x560)"
render "store-assets/promo/marquee-1400x560.html" \
       "store-assets/promo/marquee-1400x560.png" 1400 560

echo "Done."
ls -lh store-assets/screenshots/*.png store-assets/promo/*.png
