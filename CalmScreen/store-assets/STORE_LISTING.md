# CalmScreen — Chrome Web Store listing

## Name (≤ 45 chars)
**CalmScreen — Eye Comfort**

## Short description (≤ 132 chars)
Two sliders, three presets, eye comfort on every site. Brightness + warmth. 100% local. No accounts. No tracking.

## Category
Productivity

## Language
English

---

## Detailed description

> Easy on the eyes. All day.

CalmScreen is the eye-comfort layer Chrome should have shipped with — kept small on purpose.

**Two sliders. Three presets. One per-site toggle. Nothing else.**

### What you get

🎚 **Brightness** — gently dim any tab from 100% all the way down to 10%, in 1% steps.

🌅 **Warmth** — soft amber tint that takes the harsh blue out of long sessions. Same idea as f.lux / Night Shift, except per-tab and on demand.

☀️🌅🌙 **Day · Evening · Night presets** — one tap each. Day is neutral. Evening is warm. Night is deep amber with low brightness.

🌐 **Per-site off** — websites where you don't want any tint (banking, design tools, video)? One tap on the header switch and CalmScreen leaves that site alone. Forever.

⌨️ **Keyboard shortcut** — `⌥⇧C` toggles CalmScreen on the current site, instantly.

### Power-user touches in the popup

- Scroll-wheel over a slider for ±1% nudges (`Shift` for ±5%).
- Double-click a slider to reset it to default.
- Arrow keys work too — focus a slider and tap ←/→.

### Headless on the page

CalmScreen does **not** add any floating button, banner, or panel to the websites you visit. The page stays exactly as the site designer intended — just calmer to look at. All controls live in the toolbar popup.

### What you don't get

- No tracking. No analytics. No telemetry. No "anonymous usage data".
- No servers. No accounts. No sign-in. No newsletter.
- No upsells. No ads. No "premium" tier.
- No reader mode, no schedule editor, no reminders, no focus mode. We removed every "feature" that didn't pay rent.

### Permissions, explained

- `storage` — to remember your slider values and per-site toggles, locally.
- `scripting`, `activeTab`, `<all_urls>` — to apply the brightness + warmth filter on the page you're viewing.

CalmScreen does not read or transmit page contents. It only applies a CSS filter on top of the rendered page.

---

## Why us

Most "eye-care" extensions either bury you in settings or paywall the actual feature. CalmScreen is the in-between: two knobs, three presets, zero strings.

If you read for a living, write for a living, or just spend too many hours in a tab, CalmScreen will quietly become one of the best things you have installed.

---

## Justification (for review)

**Why `<all_urls>` host permissions?**
CalmScreen needs to apply its visual layer to whatever website the user is currently looking at. Without `<all_urls>`, the extension would have to ask permission tab-by-tab, which defeats the purpose of a continuous comfort layer.

**Why `storage`?**
To save the user's brightness, warmth, current preset, and per-site disable list locally between sessions. No cloud sync.

**Why `scripting` + `activeTab`?**
On install, CalmScreen programmatically injects its content script into already-open tabs (otherwise a fresh install wouldn't apply the filter until each tab is reloaded). After that, the manifest's `content_scripts` declaration handles all future navigations.

**Single purpose**
The extension does one thing: dim and warm web pages to reduce eye strain.

**Data handling**
None. No data leaves the browser. No analytics, no telemetry, no remote calls. All settings live in `chrome.storage.local`.
