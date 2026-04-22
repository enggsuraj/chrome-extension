(function () {
  var o = { cache: "no-store" };
  try {
    o.priority = "high";
  } catch (e) {}
  try {
    window.__qipJson = fetch("https://ipinfo.io/json", o).then(function (r) {
      return r.json();
    });
  } catch (e) {
    window.__qipJson = null;
  }
})();
