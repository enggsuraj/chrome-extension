// CalmScreen — content script (minimal, headless).
// Applies the eye-comfort filter directly to <html>. No on-page UI of any
// kind. All controls live in the toolbar popup.

(() => {
  if (window.__calmscreen_loaded__) return;
  window.__calmscreen_loaded__ = true;

  // Run in every frame (top + iframes) so embedded content is also tinted.
  let eff = null;
  let styleObserver = null;

  // ---------- Visual layer ----------
  // The filter is set via inline style + !important on <html>. That covers:
  //   • the html element's own background (visible when body is shorter than viewport)
  //   • elements appended outside <body> (React portals, modal containers)
  //   • position:fixed children
  // Inline style with !important is the strongest possible CSS application —
  // basically nothing on the page can override it.
  function buildFilterCSS(values) {
    const b = clamp(values.brightness, 0.1, 1.05);
    const w = clamp(values.warmth, 0, 1);
    // sepia + hue-rotate + saturate together emulate a low-color-temperature
    // amber filter (like f.lux at "Recommended Color"):
    //   sepia       adds the warm cast
    //   hue-rotate  shifts the cast from yellow-brown toward amber/orange
    //   saturate    keeps colors lively despite sepia's washing-out effect
    const sepia = (w * 0.7).toFixed(3);
    const hue = (-w * 25).toFixed(2);
    const sat = (1 + w * 0.2).toFixed(3);
    return `brightness(${b.toFixed(3)}) sepia(${sepia}) hue-rotate(${hue}deg) saturate(${sat})`;
  }

  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

  function applyVisual() {
    if (!eff || !eff.values) return;
    const html = document.documentElement;
    if (!html) return;

    // Disconnect the style observer around our own write, otherwise the write
    // itself triggers the observer and we end up in a per-frame rAF loop. The
    // queue is cleared by disconnect(), so any records we generated here are
    // not delivered after we re-observe.
    if (styleObserver) styleObserver.disconnect();
    try {
      if (!eff.enabled) {
        html.style.removeProperty("filter");
      } else {
        html.style.setProperty("filter", buildFilterCSS(eff.values), "important");
      }
    } finally {
      if (styleObserver) {
        styleObserver.observe(html, { attributes: true, attributeFilter: ["style"] });
      }
    }
  }

  // Inject a tiny stylesheet that smooths out filter changes.
  function ensureTransitionStyle() {
    if (document.getElementById("calmscreen-transition")) return;
    const style = document.createElement("style");
    style.id = "calmscreen-transition";
    style.textContent =
      "html { transition: filter 600ms cubic-bezier(0.4, 0, 0.2, 1) !important; }";
    (document.head || document.documentElement).appendChild(style);
  }

  // Some SPAs aggressively reset html.style. Watch only for that — narrow
  // observer keeps overhead near zero on busy pages.
  function watchPage() {
    const html = document.documentElement;
    if (!html) return;

    styleObserver = new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type === "attributes" && m.attributeName === "style") {
          requestAnimationFrame(applyVisual);
          return;
        }
      }
    });
    styleObserver.observe(html, { attributes: true, attributeFilter: ["style"] });
  }

  // ---------- Background round-trip ----------
  // Iframes can't trust `location.hostname` for the per-site decision (it's
  // the iframe's own host, not the top frame's). The background uses
  // `sender.tab.url`, which is always the top frame's URL, so always go
  // through it.
  function requestState(attempt = 0) {
    try {
      chrome.runtime.sendMessage({ type: "getState" }, (res) => {
        if (chrome.runtime.lastError) {
          if (attempt < 3) setTimeout(() => requestState(attempt + 1), 250);
          return;
        }
        if (res?.eff) {
          eff = res.eff;
          applyVisual();
        }
      });
    } catch {
      // Extension was unloaded / context invalidated. Nothing to do.
    }
  }

  // ---------- Boot ----------
  function boot() {
    try {
      ensureTransitionStyle();
      watchPage();
    } catch (e) {
      console.warn("[CalmScreen] boot failed:", e);
      return;
    }
    requestState();
  }

  if (document.documentElement) boot();
  else window.addEventListener("DOMContentLoaded", boot, { once: true });

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg?.type === "apply" && msg.eff) {
      eff = msg.eff;
      applyVisual();
    }
  });

  // chrome.tabs.sendMessage from background only reliably reaches the top
  // frame. We backstop with chrome.storage.onChanged, which fires in every
  // frame. Iframes can't determine the right eff themselves — re-request
  // from background so they get the top-frame's resolved state.
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !changes.state) return;
    requestState();
  });
})();
