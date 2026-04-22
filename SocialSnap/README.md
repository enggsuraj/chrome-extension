# SocialSnap

Chrome extension that extracts social media profile links, email addresses, and phone numbers from any webpage — in one click.

## Features

- Detects 20+ platforms: Facebook, X/Twitter, Instagram, LinkedIn, YouTube, TikTok, GitHub, Reddit, Discord, Telegram, WhatsApp, Twitch, Medium, Dribbble, Behance, Threads, Mastodon, Spotify, SoundCloud, Vimeo, Pinterest, Snapchat.
- Pulls emails from visible text, `mailto:` links, and raw HTML.
- Collects phone numbers from `tel:` links and text (loose E.164-ish heuristic).
- Clean, modern dark UI with tabbed filters (All / Social / Emails / Phones).
- Live search, copy-one, copy-all visible, and JSON export.
- Click-through to open a profile, email, or dial the number.

## Install (developer mode)

1. Open `chrome://extensions`.
2. Enable **Developer mode** (top right).
3. Click **Load unpacked** and select the `SocialSnap/` folder.
4. Pin the SocialSnap icon from the puzzle menu for quick access.

## Usage

1. Navigate to any regular http(s) page.
2. Click the SocialSnap icon.
3. Use the tabs to filter by type, the search box to find a specific item, or the footer buttons to copy/export.

## Files

- `manifest.json` — MV3 manifest (needs `activeTab` + `scripting`).
- `popup.html` / `popup.css` / `popup.js` — extension popup UI.
- `icons/` — app icons (16, 32, 48, 128 PNG + source SVG).
- `scripts/build-webstore.sh` — builds a versioned `SocialSnap-webstore-v<version>.zip` upload package.
- `scripts/build-store-assets.sh` — regenerates all store screenshots and both promo tiles.
- `scripts/generate-store-icon.py` — regenerates the 128×128 store listing icon with recommended padding.
- `store-assets/STORE_LISTING.md` — paste-ready Chrome Web Store listing copy + permission justifications.
- `store-assets/icon-store-128.png` — 128×128 store listing icon (with 16px transparent padding).
- `store-assets/screenshots/` — 4 × 1280×800 PNGs ready to upload.
- `store-assets/promo/small-tile-440x280.png` — small promo tile.
- `store-assets/promo/marquee-1400x560.png` — marquee promo tile (for featured placement).
- `PRIVACY.md` / `privacy.html` — privacy policy (markdown + GitHub-Pages-ready HTML).

## Permissions

- `activeTab` + `scripting` — required to run the scanner in the current tab when you click the icon. No data leaves your browser. See [`PRIVACY.md`](./PRIVACY.md) for details.

## Publishing to the Chrome Web Store

```bash
# 1. Build the upload zip (reads the version from manifest.json)
bash scripts/build-webstore.sh

# 2. (Optional) Re-render listing screenshots + promo tile
bash scripts/build-store-assets.sh
```

Then follow [`store-assets/STORE_LISTING.md`](./store-assets/STORE_LISTING.md) — every field of the Developer Dashboard is pre-written there.

## Notes

- Chrome pages (`chrome://`, Web Store, etc.) can't be scripted and will be skipped with a friendly message.
- Phone detection is heuristic and may occasionally match long numeric strings that aren't phone numbers — use the search/filter to refine.
