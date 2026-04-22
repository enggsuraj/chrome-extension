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
- `icons/icon.svg` — app icon.

## Permissions

- `activeTab` + `scripting` — required to run the scanner in the current tab when you click the icon. No data leaves your browser.

## Notes

- Chrome pages (`chrome://`, Web Store, etc.) can't be scripted and will be skipped with a friendly message.
- Phone detection is heuristic and may occasionally match long numeric strings that aren't phone numbers — use the search/filter to refine.
