// CalmScreen — popup logic (minimal).

(() => {
  const $ = (id) => document.getElementById(id);
  let state = null;
  let origin = null;

  const debounce = (fn, ms = 160) => {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  };

  const showToast = (msg) => {
    const el = $("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove("show"), 1300);
  };

  async function load() {
    const res = await chrome.runtime.sendMessage({ type: "getState" });
    state = res.state;
    origin = res.origin;
    render();
  }

  function render() {
    if (!state) return;

    $("originLabel").textContent = origin || "internal page";

    document.querySelectorAll(".preset").forEach((b) => {
      b.classList.toggle("on", b.dataset.preset === state.preset);
    });

    const b = Math.round(state.values.brightness * 100);
    const w = Math.round(state.values.warmth * 100);
    $("sBrightness").value = b;
    $("sWarmth").value = w;
    $("vBrightness").textContent = `${b}%`;
    $("vWarmth").textContent = `${w}%`;

    const toggle = $("siteToggle");
    const isOff = !!(origin && state.perOriginDisabled?.[origin]);
    if (!origin) {
      toggle.disabled = true;
      toggle.checked = false;
    } else {
      toggle.disabled = false;
      toggle.checked = !isOff;
    }
    document.querySelector(".app").classList.toggle("disabled", !origin || isOff);
  }

  function bind() {
    document.querySelectorAll(".preset").forEach((btn) => {
      btn.addEventListener("click", async () => {
        await chrome.runtime.sendMessage({ type: "applyPreset", preset: btn.dataset.preset });
        await load();
      });
    });

    // Local optimistic update — DO NOT call load() here. If the user is still
    // dragging when the message round-trip completes, a load() would re-render
    // the slider and visibly snap its position backwards. Local state is
    // authoritative for the popup session.
    const sendValues = debounce(async (values) => {
      if (state) {
        state.values = { ...state.values, ...values };
        state.preset = "custom";
      }
      document.querySelectorAll(".preset").forEach((b) => b.classList.remove("on"));
      try {
        await chrome.runtime.sendMessage({ type: "setValues", values, preset: "custom" });
      } catch { /* extension reloaded mid-flight; ignore. */ }
    }, 160);

    const attachSlider = (id, label, key) => {
      const input = $(id);
      const value = $(label);
      input.addEventListener("input", () => {
        value.textContent = `${input.value}%`;
        sendValues({ [key]: Number(input.value) / 100 });
      });
      // Scroll over the slider to nudge in 1% steps — the kind of detail that
      // makes a control feel premium without anyone having to learn it.
      input.addEventListener("wheel", (e) => {
        e.preventDefault();
        const step = e.shiftKey ? 5 : 1;
        const dir = e.deltaY < 0 ? 1 : -1;
        const min = Number(input.min) || 0;
        const max = Number(input.max) || 100;
        const next = Math.max(min, Math.min(max, Number(input.value) + dir * step));
        if (next === Number(input.value)) return;
        input.value = next;
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }, { passive: false });
      // Double-click to reset to a sensible default.
      input.addEventListener("dblclick", () => {
        const def = key === "brightness" ? 100 : 0;
        if (Number(input.value) === def) return;
        input.value = def;
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });
    };
    attachSlider("sBrightness", "vBrightness", "brightness");
    attachSlider("sWarmth", "vWarmth", "warmth");

    $("siteToggle").addEventListener("change", async (e) => {
      if (!origin) return;
      const willBeOn = e.target.checked;
      await chrome.runtime.sendMessage({
        type: "setSiteDisabled",
        origin,
        disabled: !willBeOn,
      });
      await load();
      showToast(willBeOn ? `On for ${origin}` : `Off for ${origin}`);
    });
  }

  bind();
  load();
})();
