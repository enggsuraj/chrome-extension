const weekdayElement = document.getElementById("weekday");
const dateElement = document.getElementById("date");
const timeElement = document.getElementById("time");
const timeZoneElement = document.getElementById("timeZone");
const ipElement = document.getElementById("ip");
const ipLocation = document.getElementById("location");

/** IANA zone from ipinfo (location local time), e.g. "Asia/Kolkata". */
let locationTimeZone = null;

const showIpPending = (text) => {
  ipElement.classList.add("ip--pending");
  ipElement.textContent = text;
};

const showIpValue = (ip) => {
  ipElement.classList.remove("ip--pending");
  ipElement.textContent = ip;
};

const showLoading = () => {
  locationTimeZone = null;
  ipLocation.textContent = "";
  showIpPending("Loading IP...");
  updateDate();
};

const updateDate = () => {
  const tzOpt = locationTimeZone ? { timeZone: locationTimeZone } : {};
  const now = new Date();
  weekdayElement.textContent = now.toLocaleDateString("en-US", {
    weekday: "long",
    ...tzOpt,
  });
  dateElement.textContent = now.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...tzOpt,
  });
};

const pad2 = (n) => (n < 10 ? `0${n}` : `${n}`);

let fetchController = null;

const applyGeo = (data) => {
  const { ip, city, region, country, timezone } = data;
  const tz =
    timezone && typeof timezone === "string" && timezone.trim()
      ? timezone.trim()
      : null;
  locationTimeZone = tz;
  const location = `${city}, ${region}, ${country}`;
  showIpValue(`${ip}`);
  ipLocation.textContent = ` ${location}`;
  updateTimeElements();
};

const updateIP = async () => {
  fetchController?.abort();
  fetchController = new AbortController();

  const fetchOpts = { cache: "no-store", signal: fetchController.signal };
  try {
    fetchOpts.priority = "high";
  } catch (_) {
    /* older runtimes */
  }

  try {
    let data = null;
    const early = window.__qipJson;
    if (early) {
      delete window.__qipJson;
      try {
        data = await early;
      } catch (_) {
        data = null;
      }
    }

    if (data && data.ip) {
      applyGeo(data);
      return;
    }

    const response = await fetch("https://ipinfo.io/json", fetchOpts);
    data = await response.json();
    applyGeo(data);
  } catch (error) {
    if (error.name === "AbortError") return;
    console.error("Error fetching IP address:", error);
    locationTimeZone = null;
    ipLocation.textContent = "";
    showIpPending("Error fetching IP address");
    updateDate();
    updateTimeElements();
  }
};

const copy = () => {
  const copyText = document.querySelector("#ip");
  const range = document.createRange();
  range.selectNode(copyText);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  document.execCommand("copy");
  window.getSelection().removeAllRanges();
};

const updateTimeElements = () => {
  const now = new Date();

  if (locationTimeZone) {
    try {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: locationTimeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).formatToParts(now);
      let h = "";
      let m = "";
      let s = "";
      let dayPeriod = "";
      for (const p of parts) {
        if (p.type === "hour") h = p.value;
        if (p.type === "minute") m = p.value;
        if (p.type === "second") s = p.value;
        if (p.type === "dayPeriod") dayPeriod = p.value;
      }
      timeElement.textContent = `${h}:${m}:${s} ${dayPeriod}`.trim();
      timeZoneElement.textContent = locationTimeZone;
      timeZoneElement.title = "IANA time zone for detected location";
      updateDate();
      return;
    } catch {
      locationTimeZone = null;
      updateDate();
      updateTimeElementsLocal(now);
      return;
    }
  }

  updateTimeElementsLocal(now);
  updateDate();
};

const updateTimeElementsLocal = (currentTime) => {
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;

  const currentTimeFormatted = `${pad2(displayHours)}:${pad2(minutes)}:${pad2(
    seconds
  )} ${ampm}`;

  timeElement.textContent = `${currentTimeFormatted}`;

  const tzIana = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  timeZoneElement.textContent = tzIana;
  timeZoneElement.title = "Your device time zone (IANA)";
};

window.addEventListener("pagehide", () => {
  fetchController?.abort();
});

updateDate();
updateTimeElements();
showLoading();
void updateIP();

setInterval(updateTimeElements, 1000);
document.querySelector("#copy").addEventListener("click", copy);
