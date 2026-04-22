# SocialSnap — Chrome Web Store assets

Everything needed to submit SocialSnap to the Chrome Web Store.

## Files

```
store-assets/
├── STORE_LISTING.md              # Paste-ready listing copy + permission justifications
├── screenshots/
│   ├── frame.css                 # Stage layout (1280×800 marketing frame)
│   ├── popup-preview.html        # The real popup pre-rendered with sample data
│   ├── 01-hero-light.html        # Marketing page → capture as 01-hero-light.png
│   ├── 02-hero-dark.html
│   ├── 03-social-tab.html
│   ├── 04-search.html
│   ├── 01-hero-light.png         # 1280×800 — upload to Chrome Web Store
│   ├── 02-hero-dark.png          # 1280×800
│   ├── 03-social-tab.png         # 1280×800
│   └── 04-search.png             # 1280×800
└── promo/
    ├── small-tile-440x280.html
    └── small-tile-440x280.png    # 440×280 — upload as "Small promo tile"
```

## How the screenshots work

Each `0X-*.html` stage uses `frame.css` for a 1280×800 "marketing" canvas with copy on the left and an `<iframe>` on the right that loads the **real** `popup.html` / `popup.css` via `popup-preview.html`.

`popup-preview.html` is a static-render variant of the popup that accepts query params:

| Param | Values | Purpose |
|---|---|---|
| `theme` | `light`, `dark` | Force light or dark mode regardless of system pref |
| `tab` | `all`, `social`, `email`, `phone` | Which stat tab is active |
| `q` | any string | Pre-fill the search input and filter the visible list |
| `host` | any string | The subtitle under "SocialSnap" (fake page host) |
| `toast` | `1` | Show a "Copied to clipboard" toast |

Because the iframe loads the real `../../popup.css`, the screenshot styling always matches the shipping extension.

## Regenerate all assets

```bash
bash SocialSnap/scripts/build-store-assets.sh
```

This script:
1. Spins up `python3 -m http.server 8787` in the SocialSnap folder.
2. Uses headless Chrome (`/Applications/Google Chrome.app`) at exact `--window-size=1280,800` / `440,280` to capture each stage.
3. Writes PNGs in place, overwriting the old ones.
4. Kills the HTTP server on exit.

## Customizing

- Edit `screenshots/frame.css` to tweak typography, gradients, or layout of the marketing stage.
- Edit the `SAMPLE` array inside `screenshots/popup-preview.html` to change the fake data shown in the popup.
- Change the taglines by editing `screenshots/0X-*.html`.
- Re-run the build script to re-render all PNGs.
