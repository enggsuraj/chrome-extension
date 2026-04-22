# SocialSnap — Privacy Policy

_Last updated: 2026-04-23_

Short version: **SocialSnap does not collect, store, sell, share, or transmit any of your data. Ever.** Everything the extension does happens inside your browser, on the tab you are currently looking at, only at the moment you click the toolbar icon.

If you want the long version, read on.

---

## 1. Who this policy applies to

This policy applies to the **SocialSnap** Chrome extension (the "Extension") published at the Chrome Web Store by the developer (the "Developer"). It does not apply to any website you visit, nor to Google Chrome itself, nor to any third-party service you independently log in to.

## 2. What the Extension does

SocialSnap extracts publicly visible **social media profile links, email addresses, and phone numbers** from the webpage you are currently viewing. It displays those results inside its own popup window. That is its entire purpose.

## 3. What data is collected

**None.** Specifically:

- The Extension does not send any data to the Developer or to any third party.
- The Extension does not use remote servers, analytics, telemetry, error reporting, or advertising SDKs.
- The Extension does not use cookies, `chrome.storage`, `localStorage`, `sessionStorage`, or IndexedDB.
- The Extension does not read or store your browsing history.
- The Extension does not read any tab other than the single tab active at the moment you click its toolbar icon.
- The Extension does not listen in the background. It has no background service worker.

## 4. What happens when you click the icon

1. You click the SocialSnap toolbar icon.
2. The popup opens and requests a one-time scan of the current active tab.
3. A small scanner function runs once inside that tab, reads the page's `<a>` tags, body text, and HTML in memory, identifies social profile URLs, emails, and phone numbers, and returns the result to the popup.
4. The popup displays the result.
5. When you close the popup, everything is discarded.

No part of this process writes anything to disk. No part of this process sends anything over the network. The network tab in DevTools will confirm this.

## 5. Permissions used and why

| Permission | Purpose |
|---|---|
| `activeTab` | Allows the Extension to read the DOM of the single tab you are currently viewing, **only at the moment you click the icon**. Chrome automatically revokes this the instant the tab changes. |
| `scripting` | Allows the Extension to inject its one-shot scanner function into that active tab via `chrome.scripting.executeScript`. The injected function runs once and returns synchronously. |

The Extension does **not** request: `storage`, `cookies`, `history`, `tabs` (listing/switching), `webRequest`, `webNavigation`, `downloads`, `notifications`, host permissions for arbitrary sites, or any other permission.

## 6. Remote code

The Extension does not execute remote code. All JavaScript, HTML, CSS, and icons are bundled inside the published package. Nothing is loaded from an external server at runtime.

## 7. Third-party services

None. SocialSnap does not integrate with any third-party API, SDK, or service.

## 8. Cookies and tracking technologies

None. The Extension does not set, read, or share cookies, pixels, fingerprints, or device identifiers.

## 9. Children's privacy

Because SocialSnap collects no data, it collects no data from children. The Extension is not directed at children under 13.

## 10. Data security

There is no user data to secure, because none leaves your device. The source code is open at <https://github.com/enggsuraj/chrome-extension/tree/main/SocialSnap> so anyone can verify this claim.

## 11. Your rights

Because nothing is collected, there is nothing to access, correct, delete, export, or opt out of. You can uninstall the Extension at any time from `chrome://extensions` and all related state disappears immediately.

## 12. Changes to this policy

If the Extension ever gains a feature that would change these answers — for example, optional cloud sync that requires opt-in — this policy will be updated before that feature ships, and the "Last updated" date above will change.

## 13. Contact

Questions, concerns, or verification requests:

- Open a public issue: <https://github.com/enggsuraj/chrome-extension/issues>
- Repository: <https://github.com/enggsuraj/chrome-extension>

---

By installing or using SocialSnap, you acknowledge that you have read and understood this Privacy Policy.
