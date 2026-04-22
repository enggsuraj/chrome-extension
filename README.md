# chrome-extension

A collection of Chrome extensions.

## Projects

### [SocialSnap](./SocialSnap)

Extract social media profile links, emails, and phone numbers from any webpage with one click. Manifest V3, modern AI-app styled popup with automatic dark mode.

- Per-platform profile classifier (YouTube channels, Instagram profiles, X handles, GitHub users, LinkedIn, Reddit, TikTok, Threads, and more)
- Email and phone extraction from page text + HTML
- Search and filter across categories
- One-click copy, open, export

See [SocialSnap/README.md](./SocialSnap/README.md) for install and usage.

### [QuickIP](./QuickIP)

Get your public IP address, current location, date, and time in one click. Manifest V3 Chrome extension with a lightweight popup.

- IP + geolocation from a free IP API
- Timezone-aware current time
- Prefetched on popup open for instant rendering
- Webpack build targeting `dist/`

See [QuickIP/Readme.MD](./QuickIP/Readme.MD) for build and install.

## Load any extension in Chrome

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select the project folder (e.g. `SocialSnap`, or `QuickIP/dist` after building).
