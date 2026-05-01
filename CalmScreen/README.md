# CalmScreen

> Easy on the eyes. All day.

A small, privacy-first Chrome extension that adds a warmth + brightness layer to your browser. Two sliders. Three presets. One per-site toggle. Nothing else.

## What it does

- **Warmth** — soft amber tint (mix-blend-mode multiply, like f.lux/Night Shift)
- **Brightness** — dim from 100% down to 50%
- **Day · Evening · Night** quick presets
- **Per-site off** — disable on the sites you don't want it
- **Floating pill** on every page, opens the same controls inline
- **Keyboard shortcut**: `⌥⇧C` toggles CalmScreen on the current site

That's it. No tracking, no servers, no schedule editor, no reader mode, no reminders. Just two knobs that work.

## Install (developer)

1. `python3 scripts/generate-icons.py` — produces `icons/icon-{16,32,48,128}.png`.
2. Open `chrome://extensions`, enable Developer Mode.
3. **Load unpacked** → pick this `CalmScreen/` folder.
4. Pin the toolbar icon.

## Project layout

```
CalmScreen/
├── manifest.json                # MV3
├── background.js                # SW: state, broadcast, command
├── content/content.js           # Visual filter applier (no on-page UI)
├── popup.html / .css / .js      # Toolbar popup (presets + sliders + site toggle)
├── privacy.html                 # Bundled privacy policy
├── icons/
│   ├── icon.svg
│   ├── icon-16.png  icon-32.png  icon-48.png  icon-128.png
├── scripts/
│   ├── generate-icons.py        # Pillow-based PNG generator
│   ├── build-store-assets.sh    # Headless Chrome → screenshot/promo PNGs
│   └── build-webstore.sh        # Builds dist/calmscreen-webstore.zip
├── store-assets/
│   ├── STORE_LISTING.md
│   ├── screenshots/   promo/
└── README.md  PRIVACY.md
```

## Build store assets

```bash
python3 scripts/generate-icons.py     # icons
scripts/build-store-assets.sh         # screenshots + promos
scripts/build-webstore.sh             # dist/calmscreen-webstore.zip
```

## Privacy

CalmScreen never sends data anywhere. No analytics, no telemetry, no remote calls. Everything lives in `chrome.storage.local`. See [PRIVACY.md](./PRIVACY.md).

## License

MIT.
