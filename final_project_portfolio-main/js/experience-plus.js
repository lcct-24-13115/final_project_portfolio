/* Experience page: skill filter + active section tab */
(function () {
  "use strict";

  // Skill bubbles filter
  var bubbles = Array.prototype.slice.call(document.querySelectorAll(".xp-b"));
  var filters = Array.prototype.slice.call(document.querySelectorAll(".xp-filters button"));
  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var group = btn.getAttribute("data-skill");
      filters.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle("active", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
      bubbles.forEach(function (b) {
        b.classList.toggle("dim", group !== "all" && b.getAttribute("data-group") !== group);
      });
    });
  });

  // Highlight the tab of the section being read
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".xp-tabs a"));
  if (!("IntersectionObserver" in window) || !tabs.length) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      tabs.forEach(function (a) {
        a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
      });
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  tabs.forEach(function (a) {
    var s = document.querySelector(a.getAttribute("href"));
    if (s) io.observe(s);
  });
})();
