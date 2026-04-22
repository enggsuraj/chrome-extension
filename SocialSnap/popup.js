/* SocialSnap — popup script
 * Injects a scanner into the active tab, parses the returned payload,
 * and renders a grouped, filterable list of social profiles, emails, and phones.
 */

const SOCIAL_PLATFORMS = [
  { key: "facebook",   label: "Facebook",   host: /(^|\.)facebook\.com$/i,   letter: "f" },
  { key: "twitter",    label: "X / Twitter", host: /(^|\.)(twitter\.com|x\.com)$/i, letter: "X" },
  { key: "instagram",  label: "Instagram",  host: /(^|\.)instagram\.com$/i,  letter: "I" },
  { key: "linkedin",   label: "LinkedIn",   host: /(^|\.)linkedin\.com$/i,   letter: "in" },
  { key: "youtube",    label: "YouTube",    host: /(^|\.)(youtube\.com|youtu\.be)$/i, letter: "YT" },
  { key: "tiktok",     label: "TikTok",     host: /(^|\.)tiktok\.com$/i,     letter: "TT" },
  { key: "github",     label: "GitHub",     host: /(^|\.)github\.com$/i,     letter: "Gh" },
  { key: "pinterest",  label: "Pinterest",  host: /(^|\.)pinterest\.[a-z.]+$/i, letter: "P" },
  { key: "reddit",     label: "Reddit",     host: /(^|\.)reddit\.com$/i,     letter: "R" },
  { key: "discord",    label: "Discord",    host: /(^|\.)(discord\.gg|discord\.com)$/i, letter: "Dc" },
  { key: "telegram",   label: "Telegram",   host: /(^|\.)(t\.me|telegram\.me|telegram\.org)$/i, letter: "Tg" },
  { key: "whatsapp",   label: "WhatsApp",   host: /(^|\.)(wa\.me|whatsapp\.com)$/i, letter: "W" },
  { key: "snapchat",   label: "Snapchat",   host: /(^|\.)snapchat\.com$/i,   letter: "Sc" },
  { key: "twitch",     label: "Twitch",     host: /(^|\.)twitch\.tv$/i,      letter: "Tw" },
  { key: "medium",     label: "Medium",     host: /(^|\.)medium\.com$/i,     letter: "M" },
  { key: "dribbble",   label: "Dribbble",   host: /(^|\.)dribbble\.com$/i,   letter: "Dr" },
  { key: "behance",    label: "Behance",    host: /(^|\.)behance\.net$/i,    letter: "Be" },
  { key: "threads",    label: "Threads",    host: /(^|\.)threads\.net$/i,    letter: "Th" },
  { key: "mastodon",   label: "Mastodon",   host: /(^|\.)(mastodon\.(social|online|world)|mstdn\.social)$/i, letter: "Ma" },
  { key: "spotify",    label: "Spotify",    host: /(^|\.)spotify\.com$/i,    letter: "Sp" },
  { key: "soundcloud", label: "SoundCloud", host: /(^|\.)soundcloud\.com$/i, letter: "Sd" },
  { key: "vimeo",      label: "Vimeo",      host: /(^|\.)vimeo\.com$/i,      letter: "V" },
];

const state = {
  results: { social: [], email: [], phone: [] },
  filter: "all",
  query: "",
};

const els = {
  host: document.getElementById("pageHost"),
  loading: document.getElementById("loading"),
  results: document.getElementById("results"),
  countAll: document.getElementById("countAll"),
  countSocial: document.getElementById("countSocial"),
  countEmail: document.getElementById("countEmail"),
  countPhone: document.getElementById("countPhone"),
  search: document.getElementById("searchInput"),
  rescan: document.getElementById("rescanBtn"),
  copyAll: document.getElementById("copyAllBtn"),
  export: document.getElementById("exportBtn"),
  toast: document.getElementById("toast"),
  stats: document.querySelectorAll(".stat"),
};

/* -------------------- Scanner (runs in page context) -------------------- */
function pageScanner() {
  const text = document.body ? document.body.innerText || "" : "";
  const html = document.documentElement ? document.documentElement.outerHTML : "";

  const anchorHrefs = new Set(
    Array.from(document.querySelectorAll("a[href]"))
      .map((a) => a.href)
      .filter(Boolean)
  );

  // Also pull bare URLs from visible text (profiles often printed as plain text)
  const urlRegex = /https?:\/\/[^\s<>"'()\]]+/gi;
  (text.match(urlRegex) || []).forEach((u) => anchorHrefs.add(u.replace(/[.,;!?)]+$/, "")));
  // ...and from the raw HTML (meta/JSON-LD/etc.) — capped for perf
  const htmlUrls = html.match(urlRegex) || [];
  for (let i = 0; i < Math.min(htmlUrls.length, 2000); i++) {
    anchorHrefs.add(htmlUrls[i].replace(/[.,;!?)"]+$/, ""));
  }

  const anchors = Array.from(anchorHrefs).map((href) => ({ href }));

  // Emails: from text + mailto links + raw HTML
  const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
  const emails = new Set();
  (text.match(emailRegex) || []).forEach((e) => emails.add(e.toLowerCase()));
  (html.match(emailRegex) || []).forEach((e) => emails.add(e.toLowerCase()));
  document.querySelectorAll('a[href^="mailto:" i]').forEach((a) => {
    const v = decodeURIComponent(a.getAttribute("href").slice(7).split("?")[0]).trim();
    if (v) emails.add(v.toLowerCase());
  });

  // Phones: tel: links + text heuristics
  const phones = new Set();
  document.querySelectorAll('a[href^="tel:" i]').forEach((a) => {
    const v = decodeURIComponent(a.getAttribute("href").slice(4)).trim();
    if (v) phones.add(v);
  });
  const phoneRegex = /(\+?\d{1,3}[\s.-]?)?(\(?\d{2,4}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{3,4}/g;
  (text.match(phoneRegex) || []).forEach((raw) => {
    const digits = raw.replace(/\D/g, "");
    if (digits.length >= 8 && digits.length <= 15) phones.add(raw.trim());
  });

  return {
    url: location.href,
    host: location.hostname,
    anchors,
    emails: Array.from(emails),
    phones: Array.from(phones),
  };
}

/* ----------------------------- Classification ---------------------------- */
/* Reserved first-path segments that are NOT profiles (per platform). */
const RESERVED = {
  instagram: new Set(["p","reel","reels","tv","explore","accounts","direct","about","developer","legal","web","tags","locations","challenge","press","ads","help","session","privacy","terms","api"]),
  twitter: new Set(["home","explore","notifications","messages","i","search","hashtag","compose","intent","settings","share","logout","login","signup","tos","privacy","about","help","download","jobs","following","followers","topics","lists","bookmarks","moments","account","share-tweet"]),
  facebook: new Set(["watch","groups","events","marketplace","photo.php","story.php","reel","reels","sharer","login","help","policy","policies","privacy","ads","adsmanager","business","gaming","notifications","messages","settings","me","home.php","games","saved","memories","search","friends","lite","bookmarks","checkpoint","recover","photo","story","video","photos","videos","dialog","plugins","tr","tr.php","login.php","recover","legal","terms","events.php","fb.me","watch_videos"]),
  github: new Set(["orgs","settings","marketplace","topics","trending","collections","events","notifications","issues","pulls","explore","new","login","join","about","features","pricing","enterprise","security","contact","customer-stories","sponsors","readme","home","watching","stars","discussions","codespaces","apps","search","organizations","logout","sessions","site","site-map","logos","press","careers","nonprofit","education","solutions","git-guides","premium-support","readme-pro","marketplace","blog","events"]),
  pinterest: new Set(["pin","search","ideas","business","settings","login","signup","today","categories","news_hub","videos","explore","trends","discover","about","press","help","terms","privacy","policies"]),
  twitch: new Set(["directory","p","videos","settings","subscriptions","following","drops","creatorcamp","turbo","login","signup","downloads","search","wallet","friends","inventory","jobs","store","prime","broadcast","a","company","press","help","terms","privacy"]),
  soundcloud: new Set(["tracks","stream","you","discover","charts","search","upload","pages","premium","pro","mobile","terms","imprint","cookies","signin","signup","feed","library","settings","notifications","messages","popular","trending","jobs","about","press","contact","help","forgotpassword"]),
  vimeo: new Set(["watch","features","upload","categories","ondemand","stock","log_in","join","plans","enterprise","search","live","manage","settings","help","blog","jobs","about","press","terms","privacy","cookie_policy","cookie_list","cookies","legal","copyright","guidelines"]),
  dribbble: new Set(["shots","jobs","designers","stories","about","pricing","search","signup","session","hiring","tags","teams","resources","advertising","legal","terms","privacy","help"]),
  behance: new Set(["gallery","galleries","joblist","jobs","search","explore","assets","hire","portfolio","features","new","login","signin","signup","join","about","press","terms","privacy","help","hireme","for_you","feed","notifications","messages","settings"]),
  medium: new Set(["p","topic","tag","search","stories","plans","me","new-story","new-stories","about","jobs","press","privacy","terms","policy","help","membership","creators","business"]),
  tiktok: new Set(["tag","discover","foryou","upload","following","live","music","search","about","business","legal","safety","community-guidelines","copyright","trending","explore","friends","feed"]),
  snapchat: new Set(["add","discover","spotlight","snapcodes","support","privacy","community","safety","about","ads","news","press"]),
  threads: new Set(["search","login","signup","about","help","terms","privacy","explore"]),
};

function toProfile(platform, url) {
  const parts = url.pathname.split("/").filter(Boolean);
  const host = url.hostname.toLowerCase();
  const first = (parts[0] || "").toLowerCase();
  const firstRaw = parts[0] || "";
  const origin = url.origin;

  const R = RESERVED[platform.key] || new Set();

  switch (platform.key) {
    case "youtube": {
      // Short video links and watch/shorts/playlist pages cannot be resolved to a channel from URL alone.
      if (host === "youtu.be" || host.endsWith(".youtu.be")) return null;
      if (!firstRaw) return null;
      if (firstRaw.startsWith("@")) {
        return { url: `${origin}/${firstRaw}`, handle: firstRaw };
      }
      if ((first === "channel" || first === "c" || first === "user") && parts[1]) {
        return {
          url: `${origin}/${first}/${parts[1]}`,
          handle: first === "channel" ? parts[1] : `@${parts[1]}`,
        };
      }
      return null;
    }
    case "instagram": {
      if (!firstRaw) return null;
      if (first === "stories" && parts[1]) {
        return { url: `${origin}/${parts[1]}`, handle: `@${parts[1]}` };
      }
      if (R.has(first)) return null;
      if (!/^[a-zA-Z0-9._]{1,30}$/.test(firstRaw)) return null;
      return { url: `${origin}/${firstRaw}`, handle: `@${firstRaw}` };
    }
    case "twitter": {
      if (!firstRaw) return null;
      if (R.has(first)) return null;
      if (!/^[a-zA-Z0-9_]{1,15}$/.test(firstRaw)) return null;
      return { url: `${origin}/${firstRaw}`, handle: `@${firstRaw}` };
    }
    case "tiktok": {
      if (!firstRaw) return null;
      if (firstRaw.startsWith("@")) {
        return { url: `${origin}/${firstRaw}`, handle: firstRaw };
      }
      return null;
    }
    case "facebook": {
      if (!firstRaw) return null;
      if (first === "profile.php") {
        const id = url.searchParams.get("id");
        if (id && /^\d+$/.test(id)) {
          return { url: `${origin}/profile.php?id=${id}`, handle: `id/${id}` };
        }
        return null;
      }
      if (first === "pages" && parts[1] && parts[2]) {
        return { url: `${origin}/pages/${parts[1]}/${parts[2]}`, handle: parts[1] };
      }
      if (first === "people" && parts[1] && parts[2]) {
        return { url: `${origin}/people/${parts[1]}/${parts[2]}`, handle: parts[1] };
      }
      if (R.has(first)) return null;
      if (!/^[a-zA-Z0-9.\-_]{3,}$/.test(firstRaw)) return null;
      return { url: `${origin}/${firstRaw}`, handle: firstRaw };
    }
    case "linkedin": {
      const kinds = new Set(["in", "company", "school", "showcase"]);
      if (kinds.has(first) && parts[1]) {
        return { url: `${origin}/${first}/${parts[1]}`, handle: `@${parts[1]}` };
      }
      return null;
    }
    case "github": {
      if (!firstRaw) return null;
      if (R.has(first)) return null;
      if (!/^[a-zA-Z0-9][a-zA-Z0-9\-]{0,38}$/.test(firstRaw)) return null;
      // Any repo URL gets normalized to the owner profile.
      return { url: `${origin}/${firstRaw}`, handle: `@${firstRaw}` };
    }
    case "reddit": {
      if (first === "r" && parts[1]) {
        return { url: `${origin}/r/${parts[1]}`, handle: `r/${parts[1]}` };
      }
      if ((first === "u" || first === "user") && parts[1]) {
        return { url: `${origin}/user/${parts[1]}`, handle: `u/${parts[1]}` };
      }
      return null;
    }
    case "pinterest": {
      if (!firstRaw) return null;
      if (R.has(first)) return null;
      if (!/^[a-zA-Z0-9._\-]{3,30}$/.test(firstRaw)) return null;
      return { url: `${origin}/${firstRaw}`, handle: `@${firstRaw}` };
    }
    case "discord": {
      if (host === "discord.gg" || host.endsWith(".discord.gg")) {
        if (firstRaw) return { url: `${origin}/${firstRaw}`, handle: `invite/${firstRaw}` };
        return null;
      }
      if (first === "invite" && parts[1]) {
        return { url: `${origin}/invite/${parts[1]}`, handle: `invite/${parts[1]}` };
      }
      if (first === "users" && parts[1]) {
        return { url: `${origin}/users/${parts[1]}`, handle: parts[1] };
      }
      if (first === "servers" && parts[1]) {
        return { url: `${origin}/servers/${parts[1]}`, handle: `server/${parts[1]}` };
      }
      return null;
    }
    case "telegram": {
      if (!firstRaw) return null;
      if (first === "s" && parts[1]) {
        return { url: `https://t.me/${parts[1]}`, handle: `@${parts[1]}` };
      }
      if (firstRaw.startsWith("+")) {
        return { url: `${origin}/${firstRaw}`, handle: firstRaw };
      }
      if (!/^[a-zA-Z0-9_]{4,}$/.test(firstRaw)) return null;
      return { url: `${origin}/${firstRaw}`, handle: `@${firstRaw}` };
    }
    case "whatsapp": {
      if (host === "wa.me" || host.endsWith(".wa.me")) {
        if (firstRaw && /^\+?\d{6,}$/.test(firstRaw)) {
          return { url: `${origin}/${firstRaw}`, handle: firstRaw };
        }
        return null;
      }
      if (first === "channel" && parts[1]) {
        return { url: `${origin}/channel/${parts[1]}`, handle: `channel/${parts[1]}` };
      }
      return null;
    }
    case "snapchat": {
      if (first === "add" && parts[1]) {
        return { url: `${origin}/add/${parts[1]}`, handle: `@${parts[1]}` };
      }
      if (firstRaw && !R.has(first) && /^[a-zA-Z0-9._\-]{3,}$/.test(firstRaw)) {
        return { url: `${origin}/${firstRaw}`, handle: `@${firstRaw}` };
      }
      return null;
    }
    case "twitch": {
      if (!firstRaw) return null;
      if (R.has(first)) return null;
      if (!/^[a-zA-Z0-9_]{3,25}$/.test(firstRaw)) return null;
      return { url: `${origin}/${firstRaw}`, handle: `@${firstRaw}` };
    }
    case "medium": {
      // Subdomain usernames: {user}.medium.com
      const hostParts = host.split(".");
      if (hostParts.length === 3 && hostParts[1] === "medium" && hostParts[0] !== "www") {
        return { url: `https://${host}`, handle: `@${hostParts[0]}` };
      }
      if (firstRaw.startsWith("@")) {
        return { url: `${origin}/${firstRaw}`, handle: firstRaw };
      }
      return null;
    }
    case "dribbble": {
      if (!firstRaw) return null;
      if (R.has(first)) return null;
      if (!/^[a-zA-Z0-9._\-]{3,30}$/.test(firstRaw)) return null;
      return { url: `${origin}/${firstRaw}`, handle: `@${firstRaw}` };
    }
    case "behance": {
      if (!firstRaw) return null;
      if (R.has(first)) return null;
      if (!/^[a-zA-Z0-9._\-]{3,30}$/.test(firstRaw)) return null;
      return { url: `${origin}/${firstRaw}`, handle: `@${firstRaw}` };
    }
    case "threads": {
      if (firstRaw.startsWith("@")) {
        return { url: `${origin}/${firstRaw}`, handle: firstRaw };
      }
      return null;
    }
    case "mastodon": {
      if (firstRaw.startsWith("@")) {
        return { url: `${origin}/${firstRaw}`, handle: firstRaw };
      }
      return null;
    }
    case "spotify": {
      const kinds = new Set(["artist", "user", "show"]);
      if (kinds.has(first) && parts[1]) {
        return {
          url: `${origin}/${first}/${parts[1]}`,
          handle: `${first}/${parts[1]}`,
        };
      }
      return null;
    }
    case "soundcloud": {
      if (!firstRaw) return null;
      if (R.has(first)) return null;
      if (!/^[a-zA-Z0-9_\-]{3,30}$/.test(firstRaw)) return null;
      return { url: `${origin}/${firstRaw}`, handle: `@${firstRaw}` };
    }
    case "vimeo": {
      if (first === "channels" && parts[1]) {
        return { url: `${origin}/channels/${parts[1]}`, handle: `@${parts[1]}` };
      }
      if (R.has(first)) return null;
      if (!firstRaw || /^\d+$/.test(firstRaw)) return null;
      if (!/^[a-zA-Z0-9_\-]{3,30}$/.test(firstRaw)) return null;
      return { url: `${origin}/${firstRaw}`, handle: `@${firstRaw}` };
    }
    default:
      return null;
  }
}

function classifyAnchors(anchors) {
  const seen = new Map();
  for (const a of anchors) {
    let url;
    try {
      url = new URL(a.href);
    } catch {
      continue;
    }
    if (!/^https?:$/i.test(url.protocol)) continue;
    const host = url.hostname.toLowerCase();

    const platform = SOCIAL_PLATFORMS.find((p) => p.host.test(host));
    if (!platform) continue;

    const profile = toProfile(platform, url);
    if (!profile) continue;

    const key = platform.key + "|" + profile.url.toLowerCase();
    if (seen.has(key)) continue;

    seen.set(key, {
      type: "social",
      platform: platform.key,
      platformLabel: platform.label,
      letter: platform.letter,
      label: profile.handle || platform.label,
      url: profile.url,
    });
  }
  const order = new Map(SOCIAL_PLATFORMS.map((p, i) => [p.key, i]));
  return Array.from(seen.values()).sort((a, b) => {
    const oa = order.get(a.platform) ?? 99;
    const ob = order.get(b.platform) ?? 99;
    if (oa !== ob) return oa - ob;
    return a.label.localeCompare(b.label);
  });
}

/* --------------------------------- UI --------------------------------- */
function setLoading(isLoading) {
  els.loading.style.display = isLoading ? "flex" : "none";
  if (isLoading) els.results.innerHTML = "", els.results.appendChild(els.loading);
}

function updateCounts() {
  const { social, email, phone } = state.results;
  els.countSocial.textContent = social.length;
  els.countEmail.textContent = email.length;
  els.countPhone.textContent = phone.length;
  els.countAll.textContent = social.length + email.length + phone.length;
}

function visibleItems() {
  const q = state.query.trim().toLowerCase();
  const { filter } = state;
  const { social, email, phone } = state.results;

  const pool = [];
  if (filter === "all" || filter === "social") pool.push(...social);
  if (filter === "all" || filter === "email") pool.push(...email);
  if (filter === "all" || filter === "phone") pool.push(...phone);

  if (!q) return pool;
  return pool.filter((it) => {
    const hay = `${it.label || ""} ${it.value || ""} ${it.url || ""} ${it.platformLabel || ""}`.toLowerCase();
    return hay.includes(q);
  });
}

function renderResults() {
  const items = visibleItems();
  els.results.innerHTML = "";

  const hasAny =
    state.results.social.length +
      state.results.email.length +
      state.results.phone.length >
    0;

  els.copyAll.disabled = items.length === 0;
  els.export.disabled = !hasAny;

  if (items.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.innerHTML = `
      <div class="empty-emoji">${hasAny ? "🔎" : "🫥"}</div>
      <div>${
        hasAny
          ? "No matches for this filter or search."
          : "No social links, emails, or phones found on this page."
      }</div>
    `;
    els.results.appendChild(empty);
    return;
  }

  const groups = { social: [], email: [], phone: [] };
  items.forEach((it) => groups[it.type].push(it));

  const order = ["social", "email", "phone"];
  const titles = { social: "Social Profiles", email: "Emails", phone: "Phone Numbers" };

  for (const key of order) {
    const list = groups[key];
    if (!list.length) continue;

    const group = document.createElement("section");
    group.className = "group";

    const header = document.createElement("div");
    header.className = "group-header";
    header.innerHTML = `
      <div class="group-title">${titles[key]}</div>
      <div class="group-badge">${list.length}</div>
    `;
    group.appendChild(header);

    const groupList = document.createElement("div");
    groupList.className = "group-list";

    for (const it of list) {
      groupList.appendChild(renderItem(it));
    }
    group.appendChild(groupList);
    els.results.appendChild(group);
  }
}

function renderItem(it) {
  const row = document.createElement("div");
  row.className = "item";

  const icon = document.createElement("div");
  icon.className = "item-icon";

  let iconContent = "";
  let label = "";
  let valueHtml = "";
  let copyText = "";
  let openUrl = "";

  if (it.type === "social") {
    icon.classList.add(`icon-${it.platform}`);
    iconContent = escapeHtml(it.letter || "·");
    label = it.platformLabel;
    valueHtml = `<a href="${escapeAttr(it.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(
      it.label || it.url
    )}</a>`;
    copyText = it.url;
    openUrl = it.url;
  } else if (it.type === "email") {
    icon.classList.add("icon-email");
    iconContent = "@";
    label = "Email";
    valueHtml = `<a href="mailto:${escapeAttr(it.value)}">${escapeHtml(it.value)}</a>`;
    copyText = it.value;
    openUrl = `mailto:${it.value}`;
  } else if (it.type === "phone") {
    icon.classList.add("icon-phone");
    iconContent = "☎";
    label = "Phone";
    const tel = it.value.replace(/[^\d+]/g, "");
    valueHtml = `<a href="tel:${escapeAttr(tel)}">${escapeHtml(it.value)}</a>`;
    copyText = it.value;
    openUrl = `tel:${tel}`;
  }

  icon.textContent = iconContent;

  const content = document.createElement("div");
  content.className = "item-content";
  content.innerHTML = `
    <span class="item-label">${escapeHtml(label)}</span>
    <span class="item-value">${valueHtml}</span>
  `;

  const actions = document.createElement("div");
  actions.className = "item-actions";

  const copyBtn = document.createElement("button");
  copyBtn.className = "action-btn";
  copyBtn.title = "Copy";
  copyBtn.innerHTML = `
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>`;
  copyBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    await copyToClipboard(copyText);
    copyBtn.classList.add("copied");
    showToast("Copied to clipboard");
    setTimeout(() => copyBtn.classList.remove("copied"), 900);
  });

  const openBtn = document.createElement("button");
  openBtn.className = "action-btn";
  openBtn.title = "Open";
  openBtn.innerHTML = `
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <polyline points="15 3 21 3 21 9"></polyline>
      <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>`;
  openBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (openUrl.startsWith("http")) {
      chrome.tabs.create({ url: openUrl });
    } else {
      window.open(openUrl, "_blank");
    }
  });

  actions.appendChild(copyBtn);
  actions.appendChild(openBtn);

  row.appendChild(icon);
  row.appendChild(content);
  row.appendChild(actions);
  return row;
}

/* -------------------------- Utility helpers -------------------------- */
function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[c]);
}

function escapeAttr(s) {
  return escapeHtml(s);
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch {}
    ta.remove();
  }
}

let toastTimer = null;
function showToast(msg) {
  els.toast.textContent = msg;
  els.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove("show"), 1400);
}

/* ----------------------------- Scan flow ----------------------------- */
async function runScan() {
  setLoading(true);
  els.rescan.classList.add("spinning");

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id || !/^https?:/i.test(tab.url || "")) {
      state.results = { social: [], email: [], phone: [] };
      els.host.textContent = tab?.url ? "Cannot scan this page" : "No active tab";
      updateCounts();
      renderResults();
      return;
    }

    els.host.textContent = new URL(tab.url).hostname;

    const [injection] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: pageScanner,
    });

    const payload = injection?.result || { anchors: [], emails: [], phones: [] };
    const social = classifyAnchors(payload.anchors || []);
    const email = (payload.emails || [])
      .filter((e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e))
      .map((value) => ({ type: "email", value }));
    const phone = (payload.phones || []).map((value) => ({ type: "phone", value }));

    state.results = {
      social: dedupe(social, (x) => x.url.toLowerCase()),
      email: dedupe(email, (x) => x.value.toLowerCase()),
      phone: dedupe(phone, (x) => x.value.replace(/\D/g, "")),
    };

    updateCounts();
    renderResults();
  } catch (err) {
    console.error("SocialSnap scan failed", err);
    els.results.innerHTML = `
      <div class="empty">
        <div class="empty-emoji">⚠️</div>
        <div>Couldn't scan this page.<br/>Try reloading the tab and reopening SocialSnap.</div>
      </div>`;
  } finally {
    setLoading(false);
    els.rescan.classList.remove("spinning");
  }
}

function dedupe(arr, keyFn) {
  const seen = new Set();
  const out = [];
  for (const it of arr) {
    const k = keyFn(it);
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(it);
  }
  return out;
}

/* -------------------------- Event wiring -------------------------- */
function setActiveFilter(filter) {
  state.filter = filter;
  els.stats.forEach((s) => {
    s.classList.toggle("active", s.dataset.filter === filter);
  });
  renderResults();
}

els.stats.forEach((s) => {
  s.addEventListener("click", () => setActiveFilter(s.dataset.filter));
});

els.search.addEventListener("input", (e) => {
  state.query = e.target.value;
  renderResults();
});

els.rescan.addEventListener("click", runScan);

els.copyAll.addEventListener("click", async () => {
  const items = visibleItems();
  if (!items.length) return;
  const lines = items.map((it) =>
    it.type === "social" ? `${it.platformLabel}: ${it.url}` : `${it.type}: ${it.value}`
  );
  await copyToClipboard(lines.join("\n"));
  showToast(`Copied ${items.length} item${items.length === 1 ? "" : "s"}`);
});

els.export.addEventListener("click", async () => {
  const data = {
    scannedAt: new Date().toISOString(),
    page: els.host.textContent,
    social: state.results.social.map((s) => ({
      platform: s.platformLabel,
      handle: s.label,
      url: s.url,
    })),
    emails: state.results.email.map((e) => e.value),
    phones: state.results.phone.map((p) => p.value),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  chrome.tabs.create({ url });
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
});

/* --------------------------- Boot --------------------------- */
setActiveFilter("all");
runScan();
