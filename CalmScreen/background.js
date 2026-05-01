// CalmScreen — service worker (minimal).
// Owns the canonical state, broadcasts changes to all tabs, handles the single
// keyboard command. No alarms, no schedules, no per-tab transient state.

const DEFAULTS = {
  values: {
    brightness: 1.0,   // 0.5 .. 1.0
    warmth: 0,         // 0   .. 1
  },
  preset: "day",       // "day" | "evening" | "night" | "custom"
  perOriginDisabled: {}, // { "github.com": true }
};

const PRESETS = {
  day:     { brightness: 1.00, warmth: 0.00 },
  evening: { brightness: 0.92, warmth: 0.45 },
  night:   { brightness: 0.80, warmth: 0.85 },
};

// ---------- Storage ----------
async function getState() {
  const { state } = await chrome.storage.local.get("state");
  if (!state) return structuredClone(DEFAULTS);
  return {
    ...DEFAULTS,
    ...state,
    values: { ...DEFAULTS.values, ...(state.values || {}) },
    perOriginDisabled: { ...(state.perOriginDisabled || {}) },
  };
}

async function setState(next) {
  await chrome.storage.local.set({ state: next });
  return next;
}

// ---------- Origin extraction ----------
function originOf(url) {
  try {
    const u = new URL(url);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.hostname.replace(/^www\./, "");
  } catch { return null; }
}

// ---------- Effective settings for an origin ----------
function effectiveFor(state, origin) {
  const enabled = origin ? !state.perOriginDisabled[origin] : true;
  return {
    enabled,
    preset: state.preset,
    values: { ...state.values },
  };
}

// ---------- Broadcast ----------
async function broadcastToAll() {
  const state = await getState();
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (!tab.id) continue;
    const origin = originOf(tab.url);
    if (!origin) continue;
    const eff = effectiveFor(state, origin);
    chrome.tabs.sendMessage(tab.id, { type: "apply", eff }).catch(() => {});
  }
}

async function pushToTab(tabId) {
  const tab = await chrome.tabs.get(tabId).catch(() => null);
  if (!tab) return;
  const origin = originOf(tab.url);
  if (!origin) return;
  const state = await getState();
  const eff = effectiveFor(state, origin);
  chrome.tabs.sendMessage(tabId, { type: "apply", eff }).catch(() => {});
}

// ---------- Inject content into already-open tabs on install ----------
async function injectIntoOpenTabs() {
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (!tab.id || !tab.url) continue;
    if (!/^https?:/.test(tab.url)) continue;
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content/content.js"],
    }).catch(() => {});
  }
}

chrome.runtime.onInstalled.addListener(async () => {
  await injectIntoOpenTabs();
  broadcastToAll();
});

chrome.runtime.onStartup.addListener(() => {
  broadcastToAll();
});

chrome.tabs.onUpdated.addListener((tabId, info) => {
  if (info.status === "loading" || info.status === "complete") {
    pushToTab(tabId);
  }
});

// ---------- Message hub ----------
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    try {
      switch (msg.type) {
        case "getState": {
          const state = await getState();
          let origin = null;
          if (sender.tab?.url) origin = originOf(sender.tab.url);
          else {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            origin = originOf(tab?.url || "");
          }
          const eff = origin ? effectiveFor(state, origin) : effectiveFor(state, null);
          sendResponse({ state, origin, eff });
          return;
        }
        case "setValues": {
          const state = await getState();
          const next = {
            ...state,
            preset: msg.preset || "custom",
            values: { ...state.values, ...(msg.values || {}) },
          };
          await setState(next);
          broadcastToAll();
          sendResponse({ ok: true });
          return;
        }
        case "applyPreset": {
          const state = await getState();
          const v = PRESETS[msg.preset];
          if (!v) { sendResponse({ ok: false }); return; }
          const next = { ...state, preset: msg.preset, values: { ...v } };
          await setState(next);
          broadcastToAll();
          sendResponse({ ok: true });
          return;
        }
        case "setSiteDisabled": {
          const state = await getState();
          const perOriginDisabled = { ...state.perOriginDisabled };
          if (msg.disabled) perOriginDisabled[msg.origin] = true;
          else delete perOriginDisabled[msg.origin];
          await setState({ ...state, perOriginDisabled });
          broadcastToAll();
          sendResponse({ ok: true });
          return;
        }
      }
    } catch (e) {
      sendResponse({ ok: false, error: e.message });
    }
  })();
  return true;
});

// ---------- Keyboard command: toggle this site ----------
chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "toggle-site") return;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;
  const origin = originOf(tab.url);
  if (!origin) return;
  const state = await getState();
  const isDisabled = !!state.perOriginDisabled[origin];
  const perOriginDisabled = { ...state.perOriginDisabled };
  if (isDisabled) delete perOriginDisabled[origin];
  else perOriginDisabled[origin] = true;
  await setState({ ...state, perOriginDisabled });
  broadcastToAll();
});
