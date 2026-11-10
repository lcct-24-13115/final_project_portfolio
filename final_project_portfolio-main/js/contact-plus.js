/* Contact page: live local time + accordion */
(function () {
  "use strict";

  // Live local time (Philippines)
  var timeEl = document.getElementById("localTime");
  if (timeEl) {
    var fmt;
    try { fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Manila" }); } catch (e) { fmt = null; }
    var tick = function () { timeEl.textContent = fmt ? fmt.format(new Date()) : new Date().toTimeString().slice(0, 5); };
    tick();
    setInterval(tick, 30000);
  }

  // Accordion: one panel open at a time
  var acc = document.getElementById("cAcc");
  if (!acc) return;
  var items = Array.prototype.slice.call(acc.querySelectorAll(".c-item"));
  items.forEach(function (item) {
    var btn = item.querySelector(".c-trigger");
    btn.addEventListener("click", function () {
      var willOpen = !item.classList.contains("open");
      items.forEach(function (it) {
        it.classList.remove("open");
        it.querySelector(".c-trigger").setAttribute("aria-expanded", "false");
      });
      if (willOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
})();
