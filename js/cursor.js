/* Bubble cursor: a dot that follows the mouse and a ring that trails it.
   Only runs with a mouse (not touch) and when motion is allowed. */
"use strict";
(function () {
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!fine || reduced) return;

  const root = document.documentElement;
  const ring = document.createElement("div");
  const dot = document.createElement("div");
  ring.className = "cursor-ring";
  dot.className = "cursor-dot";
  ring.setAttribute("aria-hidden", "true");
  dot.setAttribute("aria-hidden", "true");
  document.body.append(ring, dot);
  root.classList.add("has-cursor");

  let x = -100, y = -100, rx = -100, ry = -100;
  const HOVER = "a, button, summary, [role='button'], .cert-btn, .chip-btn, label, select";
  const TEXT = "input, textarea";

  window.addEventListener("mousemove", (e) => {
    x = e.clientX;
    y = e.clientY;
    dot.style.transform = "translate(" + x + "px," + y + "px)";
    const t = e.target.closest ? e.target : null;
    ring.classList.toggle("is-link", !!(t && t.closest(HOVER)));
    root.classList.toggle("cursor-text", !!(t && t.closest(TEXT)));
    root.classList.remove("cursor-hidden");
  }, { passive: true });

  document.addEventListener("mouseleave", () => root.classList.add("cursor-hidden"));
  window.addEventListener("mousedown", (e) => {
    ring.classList.add("is-down");
    const pop = document.createElement("span");
    pop.className = "cursor-pop";
    pop.style.left = e.clientX + "px";
    pop.style.top = e.clientY + "px";
    document.body.appendChild(pop);
    setTimeout(() => pop.remove(), 600);
  });
  window.addEventListener("mouseup", () => ring.classList.remove("is-down"));

  (function loop() {
    rx += (x - rx) * 0.16;
    ry += (y - ry) * 0.16;
    ring.style.transform = "translate(" + rx + "px," + ry + "px)";
    requestAnimationFrame(loop);
  })();
})();
