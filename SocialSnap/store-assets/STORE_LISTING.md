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

> Find social profiles, emails, and phone numbers on the current page — real profile detection, not raw URLs. (108 chars)

> One click. Every social profile, email, and phone on the current page. Search, copy, export. (94 chars)

---

## 3. Detailed description (long form)

Paste the following directly into the "Detailed description" field. Chrome Web Store supports plain text with simple line breaks; avoid Markdown syntax in the input field itself.

```
SocialSnap finds the social profiles, email addresses, and phone numbers on the current webpage — instantly, with one click.

Built for creators, marketers, recruiters, and researchers who outgrew copy-pasting links one by one.


✦ WHAT MAKES IT DIFFERENT

Most link scrapers dump every URL on a page at you. SocialSnap recognizes real profiles instead of raw URLs:

• It distinguishes a channel page from a single video.
• It distinguishes a profile from an individual post, tweet, or reel.
• It distinguishes a user or company page from a job post, issue, or thread.
• It pulls clean handles like "@yourname" or "r/subreddit" from the link itself.

It works across the major social, video, audio, design, writing, and messaging networks, and it also extracts every email address and phone number found in the page text — not only the ones inside mailto: or tel: links.


✦ WHAT YOU GET

• Grouped results — social profiles, emails, and phone numbers cleanly separated.
• Instant search — filter visible results by platform, handle, domain, or number.
• One-click copy on every row, plus "Copy visible" to grab the whole filtered list.
• Export to JSON — pipe straight into a spreadsheet, CRM, or script.
• Clean, modern UI with automatic light and dark mode that follows your system.
• Rescan button — re-run after the page updates.


✦ PRIVACY

SocialSnap does not collect, store, or transmit any data.

• No analytics, no tracking, no background tasks, no servers.
• Scanning only runs when you click the toolbar icon.
• Scanning only reads the active tab, one time, per click.
• Results stay in your browser and disappear when you close the popup.
• No account, no login.

Full privacy policy: https://enggsuraj.github.io/chrome-extension/SocialSnap/privacy.html


✦ PERMISSIONS

• "activeTab" — read the DOM of the tab you are currently viewing, only at the moment you click the icon.
• "scripting" — run a one-shot scanner in that tab to collect links, emails, and phones, then return the result to the popup.

SocialSnap does not use storage, cookies, history, broad host permissions, or remote code.


✦ HOW TO USE

1. Pin SocialSnap to your Chrome toolbar.
2. Open any webpage.
3. Click the SocialSnap icon.
4. Use the tabs to switch between profiles, emails, and phones; use search to narrow; use the buttons to copy or export.


✦ FEEDBACK

Ideas or bug reports: https://github.com/enggsuraj/chrome-extension/issues

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

## 4a. Additional fields (Store listing tab)

| Field | Value |
|---|---|
| Official URL | *Leave blank* (no Search-Console-verified domain) |
| Homepage URL | `https://github.com/enggsuraj/chrome-extension/tree/main/SocialSnap` |
| Support URL | `https://github.com/enggsuraj/chrome-extension/issues` |

*Homepage URL can be upgraded later to `https://enggsuraj.github.io/chrome-extension/SocialSnap/` once a GitHub Pages landing page is added.*

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

## 6. Submission checklist

- [ ] $5 one-time developer fee paid at https://chrome.google.com/webstore/devconsole
- [ ] `SocialSnap-webstore-v1.0.0.zip` uploaded
- [ ] Name, short description, detailed description pasted
- [ ] Category set to **Productivity**
- [ ] Language set to **English (United States)**
- [ ] Icon 128 × 128 auto-detected from manifest
- [ ] At least one 1280 × 800 screenshot uploaded (use all four for stronger listing)
- [ ] Small promo tile 440 × 280 uploaded
- [ ] Marquee promo tile 1400 × 560 uploaded (recommended for featured placement)
- [ ] Homepage URL set to `https://github.com/enggsuraj/chrome-extension/tree/main/SocialSnap`
- [ ] Support URL set to `https://github.com/enggsuraj/chrome-extension/issues`
- [ ] Single purpose description pasted
- [ ] `activeTab` justification pasted
- [ ] `scripting` justification pasted
- [ ] Data usage: all marked "No"
- [ ] Three certifications checked
- [ ] Remote code: "No"
- [ ] Privacy policy URL live at `https://enggsuraj.github.io/chrome-extension/SocialSnap/privacy.html`
- [ ] Distribution set to Public, All regions
- [ ] Submit for review
