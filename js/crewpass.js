/* Crew pass: tilts toward the mouse, and cycles the role in the pill. */
"use strict";
(function () {
  const pass = document.querySelector(".crew-pass");
  if (!pass) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!reduced && fine) {
    const wrap = pass.parentElement;
    wrap.addEventListener("mousemove", (e) => {
      const r = pass.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      pass.style.transform = "rotate(-2deg) rotateY(" + px * 14 + "deg) rotateX(" + -py * 14 + "deg)";
    });
    wrap.addEventListener("mouseleave", () => { pass.style.transform = ""; });
  }
  const word = pass.querySelector("[data-roles]");
  if (!word || reduced) return;
  let roles;
  try { roles = JSON.parse(word.dataset.roles); } catch (e) { return; }
  let i = 0;
  setInterval(() => { i = (i + 1) % roles.length; word.textContent = roles[i]; }, 2200);
})();

/* Timeline: the step in the middle of the screen is bright, the others fade. */
(function () {
  const items = Array.from(document.querySelectorAll(".tl li"));
  if (items.length === 0) return;
  if (!("IntersectionObserver" in window)) { items.forEach((li) => li.classList.add("active")); return; }
  items[0].classList.add("active");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { items.forEach((li) => li.classList.toggle("active", li === e.target)); } });
  }, { rootMargin: "-35% 0px -45% 0px" });
  items.forEach((li) => io.observe(li));
})();
