/* ==========================================================
   Mission log: tap the alien / UFO (and the little art above
   each number) to play an animation.
   - UFO tap: UFO wobbles, alien pops up and blinks, antennas
     wiggle, lights flash, beam brightens, sparkles burst and a
     speech bubble appears.
   - Art tap: the picture bounces and throws sparkles.
   Works with mouse, touch and keyboard (Enter / Space).
   ========================================================== */
"use strict";

(function () {
  const stage = document.querySelector(".mission-stage");
  if (!stage) return;

  const ufo = stage.querySelector(".m-ufo");
  const bubble = stage.querySelector(".m-bubble");
  const arts = Array.from(stage.querySelectorAll(".m-art"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const COLORS = ["#ffe27a", "#3ff0c8", "#ff7ad9", "#b45cff", "#7ff0ff"];

  const messages = [
    "Hi! Welcome aboard \uD83D\uDC4B",
    "Beam me up! \uD83D\uDE80",
    "4 projects built solo \uD83D\uDCBB",
    "15 certificates earned \uD83E\uDE90",
    "11 awards and honors \u2B50",
    "Take me to the Projects page!"
  ];
  let msgIndex = 0;
  let hideTimer = 0;

  /** Throw sparkles out of a point inside the stage. */
  function burst(x, y, count) {
    if (reduceMotion) return;
    for (let i = 0; i < count; i++) {
      const spark = document.createElement("span");
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.6;
      const dist = 70 + Math.random() * 90;
      spark.className = "m-spark";
      spark.style.left = x + "px";
      spark.style.top = y + "px";
      spark.style.setProperty("--dx", Math.cos(angle) * dist + "px");
      spark.style.setProperty("--dy", Math.sin(angle) * dist + "px");
      spark.style.setProperty("--s", 9 + Math.random() * 12 + "px");
      spark.style.setProperty("--c", COLORS[i % COLORS.length]);
      spark.addEventListener("animationend", () => spark.remove());
      stage.appendChild(spark);
    }
  }

  /** Point (inside the stage) where the pointer touched, or the element centre. */
  function origin(event, el) {
    const s = stage.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const fromPointer = event && typeof event.clientX === "number" && event.clientX > 0;
    return {
      x: (fromPointer ? event.clientX : r.left + r.width / 2) - s.left,
      y: (fromPointer ? event.clientY : r.top + r.height / 2) - s.top
    };
  }

  /** Restart a CSS animation class. */
  function replay(el, cls, ms) {
    el.classList.remove(cls);
    void el.getBoundingClientRect(); // force reflow so it can run again
    el.classList.add(cls);
    window.setTimeout(() => el.classList.remove(cls), ms);
  }

  function say(text) {
    bubble.textContent = text;
    bubble.classList.add("show");
    window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(() => bubble.classList.remove("show"), 2600);
  }

  function playUfo(event) {
    stage.classList.add("played");
    replay(ufo, "zap", 1000);
    replay(stage, "zapping", 1000);
    const p = origin(event, ufo);
    burst(p.x, p.y, 14);
    say(messages[msgIndex++ % messages.length]);
  }

  function playArt(event, art) {
    replay(art, "bump", 900);
    const p = origin(event, art);
    burst(p.x, p.y, 9);
  }

  function onKey(handler) {
    return (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handler(event);
      }
    };
  }

  ufo.addEventListener("click", playUfo);
  ufo.addEventListener("keydown", onKey(playUfo));

  arts.forEach((art) => {
    art.addEventListener("click", (e) => playArt(e, art));
    art.addEventListener("keydown", onKey((e) => playArt(e, art)));
  });
})();
