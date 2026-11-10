/* Quick Links page: live local time (Philippines) next to the profile. */
"use strict";

(function () {
  const out = document.getElementById("qlTime");
  if (!out) return;

  function tick() {
    try {
      out.textContent = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Manila"
      }).format(new Date());
    } catch (error) {
      const d = new Date();
      out.textContent = String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
    }
  }

  tick();
  setInterval(tick, 15000);
})();
