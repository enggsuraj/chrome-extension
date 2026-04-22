# SocialSnap — Chrome Web Store Listing

Everything you need to paste into the Chrome Web Store Developer Dashboard for **SocialSnap**.

> Developer Dashboard: https://chrome.google.com/webstore/devconsole

---

## 1. Basic information

| Field | Value |
|---|---|
| Name | `SocialSnap` |
| Version (from `manifest.json`) | `1.0.0` |
| Category (primary) | **Productivity** |
| Category (alt) | Social & Communication |
| Language | English (United States) |
| Visibility | Public |
| Distribution regions | All regions |
| Pricing | Free |

---

## 2. Short description (≤132 chars)

Use one of these — the first is preferred:

> Extract social profiles, emails, and phone numbers from any webpage with one click. Clean, fast, private. (118 chars)

Alternatives:

> Find every social link, email, and phone number on a page — with real profile detection, not just random URLs. (113 chars)

> One click. Every social profile, email, and phone on the current page. Search, copy, export. (94 chars)

---

## 3. Detailed description (long form)

Paste the following directly into the "Detailed description" field. Chrome Web Store supports plain text with simple line breaks; avoid Markdown syntax in the input field itself.

```
SocialSnap finds every social media profile, email, and phone number on the current webpage — instantly.

Built for creators, marketers, recruiters, researchers, and anyone who outgrew copy-pasting links one by one.


✦ WHY SOCIALSNAP

Most "link scrapers" dump every URL on a page at you. SocialSnap is different. It recognizes real profiles:

• YouTube channel URLs, not random video links
• Instagram profiles, not reels or posts
• X (Twitter) handles, not individual tweets
• LinkedIn people and companies, not job posts
• GitHub users and orgs, not issues or PRs
• Reddit subreddits and users, not single threads
• TikTok profiles, Threads, Pinterest, Dribbble, Behance, Medium, Mastodon, Snapchat, Telegram, WhatsApp, Twitch, Spotify, SoundCloud, Vimeo, Facebook pages, Discord invites — and more.

It also extracts every email address and phone number in the page text and HTML, not just mailto:/tel: links.


✦ WHAT YOU GET

• Grouped results — social profiles, emails, phones, cleanly separated
• Real handle extraction — sees "@yourname" or "r/subreddit", not just a URL
• Instant search — filter visible results by platform, handle, domain, or number
• One-click copy on every row, plus "Copy visible" to grab the whole filtered list
• Export JSON — piped straight into a spreadsheet, CRM, or script
• Beautiful, modern UI inspired by Linear, Raycast, and ChatGPT
• Automatic light and dark mode — follows your system theme
• Rescan button — click to re-run after the page updates


✦ PRIVACY — READ THIS FIRST

SocialSnap does not collect, store, or transmit any data. Ever.

• No analytics. No tracking. No background tasks. No servers.
• Scanning only happens when YOU click the extension icon.
• Scanning only reads the ACTIVE tab, one time, per click.
• All results stay in your browser and disappear when you close the popup.
• No account, no login, no permissions beyond what is strictly required.

Full privacy policy: https://enggsuraj.github.io/chrome-extension/SocialSnap/privacy.html


✦ PERMISSIONS EXPLAINED

• "activeTab" — Required to read the DOM of the page you are currently viewing, only at the moment you click the icon.
• "scripting" — Required to run a one-shot scanner in the active tab to collect links, emails, and phones from that page.

SocialSnap does NOT use: storage, cookies, history, tabs (listing or switching), host permissions for arbitrary sites, remote code, or any API that persists data.


✦ GREAT FOR

• Creators finding partnership / collab contacts on brand or agency sites
• Marketers doing outreach and link research
• Recruiters pulling candidate profiles and contact info
• Researchers aggregating links across long articles or directories
• Developers auditing author/contributor footprints on a project page
• Anyone who hates re-typing emails and phone numbers


✦ HOW TO USE

1. Pin SocialSnap to your Chrome toolbar.
2. Open any webpage.
3. Click the SocialSnap icon.
4. Results appear grouped by type. Use the tabs to filter, the search box to narrow, and the buttons to copy or export.


✦ FEEDBACK

Ideas, platform requests, or bug reports: open an issue at
https://github.com/enggsuraj/chrome-extension/issues

SocialSnap will stay free, fast, and private.
```

---

## 4. Graphic assets required by the store

| Asset | Size (px) | Required | File |
|---|---|---|---|
| Store icon | 128 × 128 | Yes | `SocialSnap/icons/icon-128.png` |
| Screenshot 1 | 1280 × 800 | Yes (at least one) | `store-assets/screenshots/01-hero-light.png` |
| Screenshot 2 | 1280 × 800 | Recommended | `store-assets/screenshots/02-hero-dark.png` |
| Screenshot 3 | 1280 × 800 | Recommended | `store-assets/screenshots/03-social-tab.png` |
| Screenshot 4 | 1280 × 800 | Recommended | `store-assets/screenshots/04-search.png` |
| Small promo tile | 440 × 280 | Recommended | `store-assets/promo/small-tile-440x280.png` |
| Marquee promo tile | 1400 × 560 (24-bit PNG, no alpha) | Optional (required for featured placement) | `store-assets/promo/marquee-1400x560.png` |

See `store-assets/screenshots/README.md` for how to regenerate.

---

## 5. Privacy tab (in the Dashboard)

### Single purpose description

> SocialSnap reads the current active tab once — only when the user clicks the toolbar icon — to extract publicly visible social media profile links, email addresses, and phone numbers from that page, and displays them in the popup. No data is stored, sent, or shared.

### Permission justifications

**`activeTab`**

> SocialSnap needs to read the DOM of the user's currently active tab to identify links, emails, and phone numbers visible on that page. The activeTab permission is only granted at the instant the user clicks the extension icon, and is automatically revoked when the tab changes. This scoped permission avoids requiring broad host access.

**`scripting`**

> SocialSnap uses chrome.scripting.executeScript to inject a single one-shot function into the active tab at the moment the user clicks the icon. That function reads the page's anchors, body text, and HTML in-memory to extract contact information, and returns the result synchronously to the popup. No script persists, no listeners are added, and no data is transmitted outside the browser.

### Data usage disclosures

- Does your extension collect or use any of the following user data? → **No**
- Personally identifiable information → No
- Health information → No
- Financial and payment information → No
- Authentication information → No
- Personal communications → No
- Location → No
- Web history → No
- User activity → No
- Website content → **No** (read transiently, never stored/transmitted)

### Certifications (check all)

- [x] I do not sell or transfer user data to third parties, outside of the approved use cases.
- [x] I do not use or transfer user data for purposes that are unrelated to my item's single purpose.
- [x] I do not use or transfer user data to determine creditworthiness or for lending purposes.

### Remote code use

- Does your extension execute remote code? → **No** (all code is bundled in the package)

### Privacy policy URL

> https://enggsuraj.github.io/chrome-extension/SocialSnap/privacy.html

*(Enable GitHub Pages on the `main` branch → root, then the `SocialSnap/PRIVACY.html` file at that path becomes publicly viewable.)*

---

## 6. Keywords / search terms to weave into the description

Already included naturally above, listed here for reference:

social media extractor, social profiles, email finder, phone number extractor, contact scraper, lead generation, outreach, YouTube channel finder, Instagram profile finder, LinkedIn extractor, X Twitter handle, GitHub user, Reddit user, TikTok, Threads, Pinterest, Dribbble, Behance, Medium, Mastodon, Snapchat, Telegram, WhatsApp, Twitch, Spotify, SoundCloud, Vimeo, Discord, contact export, JSON export, recruiter tool, marketer tool, creator economy.

---

## 7. Submission checklist

- [ ] $5 one-time developer fee paid at https://chrome.google.com/webstore/devconsole
- [ ] `SocialSnap-webstore-v1.0.0.zip` uploaded
- [ ] Name, short description, detailed description pasted
- [ ] Category set to **Productivity**
- [ ] Language set to **English (United States)**
- [ ] Icon 128 × 128 auto-detected from manifest
- [ ] At least one 1280 × 800 screenshot uploaded (use all four for stronger listing)
- [ ] Small promo tile 440 × 280 uploaded
- [ ] Marquee promo tile 1400 × 560 uploaded (recommended for featured placement)
- [ ] Single purpose description pasted
- [ ] `activeTab` justification pasted
- [ ] `scripting` justification pasted
- [ ] Data usage: all marked "No"
- [ ] Three certifications checked
- [ ] Remote code: "No"
- [ ] Privacy policy URL live at `https://enggsuraj.github.io/chrome-extension/SocialSnap/privacy.html`
- [ ] Distribution set to Public, All regions
- [ ] Submit for review
