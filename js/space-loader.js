/* ==========================================================
   Launch screen (loading screen) for the space theme.
   - Shows once per visit (remembered with sessionStorage)
   - Skip button, Escape key, and no screen at all when the
     visitor prefers reduced motion
   ========================================================== */
"use strict";

(function () {
  const screen = document.getElementById("launch");
  if (!screen) return;

  const root = document.documentElement;
  const fill = screen.querySelector(".launch-fill");
  const percent = screen.querySelector("[data-launch-percent]");
  const skip = screen.querySelector(".launch-skip");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function remember() {
    try {
      sessionStorage.setItem("launched", "1");
    } catch (error) {
      /* storage blocked: the screen may show again, which is fine */
    }
  }

  let finished = false;
  function finish() {
    if (finished) return;
    finished = true;
    remember();
    root.classList.remove("launching");
    screen.classList.add("done");
    setTimeout(function () {
      screen.remove();
    }, 700);
  }

  if (reduced) {
    finish();
    return;
  }

  root.classList.add("launching");
  skip.addEventListener("click", finish);
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") finish();
  });

  const duration = 1700;
  const start = performance.now();
  function tick(now) {
    if (finished) return;
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.round(progress * 100);
    fill.style.width = value + "%";
    percent.textContent = value + "%";
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      setTimeout(finish, 250);
    }
  }
  requestAnimationFrame(tick);
})();

/* ==========================================================
   Scroll progress bar (the glowing trail at the top)
   ========================================================== */
(function () {
  const bar = document.querySelector(".scroll-progress span");
  if (!bar) return;

  let waiting = false;
  function update() {
    waiting = false;
    const root = document.documentElement;
    const max = root.scrollHeight - root.clientHeight;
    const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    bar.style.width = (ratio * 100).toFixed(1) + "%";
  }
  function onScroll() {
    if (waiting) return;
    waiting = true;
    requestAnimationFrame(update);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
})();
