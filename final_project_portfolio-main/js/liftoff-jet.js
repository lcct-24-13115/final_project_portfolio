/* ==========================================================
   Liftoff section: "See my projects" launches a jet.
   1. A jet pops out of the button and shakes (ready for takeoff)
   2. It blasts upward with a flame and a trail of smoke
   3. Then the Projects page opens.
   Ctrl / Shift / middle-click still work normally, and people who
   prefer reduced motion go straight to the page.
   ========================================================== */
"use strict";

(function () {
  const btn = document.getElementById("launch-btn");
  if (!btn) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const JET = `
<svg viewBox="0 0 84 170" aria-hidden="true">
  <defs>
    <linearGradient id="jBody" x1="0" x2="1"><stop offset="0" stop-color="#aab4ff"/><stop offset=".5" stop-color="#ffffff"/><stop offset="1" stop-color="#8a94e8"/></linearGradient>
    <linearGradient id="jFlame" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6b0"/><stop offset=".45" stop-color="#ffb23d"/><stop offset="1" stop-color="#ff3d7a" stop-opacity="0"/></linearGradient>
  </defs>
  <path class="flame" d="M34 122 Q42 190 50 122 Z" fill="url(#jFlame)"/>
  <path d="M42 8 C52 34 54 70 54 112 L30 112 C30 70 32 34 42 8 Z" fill="url(#jBody)"/>
  <path d="M30 76 L4 118 L4 128 L30 112 Z M54 76 L80 118 L80 128 L54 112 Z" fill="#6f7cf0"/>
  <path d="M34 108 L22 132 L34 126 Z M50 108 L62 132 L50 126 Z" fill="#ff7ad9"/>
  <ellipse cx="42" cy="48" rx="6" ry="14" fill="#1b2a8a"/><ellipse cx="40" cy="42" rx="2" ry="6" fill="#fff" fill-opacity=".6"/>
  <rect x="38" y="110" width="8" height="8" rx="2" fill="#3a3f8a"/>
</svg>`;
  let launched = false;

  function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }

  async function launch(href) {
    launched = true;
    btn.style.minWidth = btn.getBoundingClientRect().width + "px";
    btn.classList.add("launching");
    const label = btn.querySelector("span");
    if (label) label.textContent = "Liftoff! \uD83D\uDE80";

    const r = btn.getBoundingClientRect();
    const jet = document.createElement("div");
    jet.className = "jet-fly";
    jet.innerHTML = JET;
    const w = 84, h = 170;
    const startX = r.left + r.width / 2 - w / 2;
    const startY = r.top + r.height / 2 - h / 2;
    jet.style.left = startX + "px";
    jet.style.top = startY + "px";
    jet.style.opacity = "0";
    document.body.appendChild(jet);

    const flash = document.createElement("div");
    flash.className = "jet-flash";
    document.body.appendChild(flash);

    // 1) pop out of the button
    await jet.animate(
      [{ opacity: 0, transform: "scale(.2) translateY(30px)" }, { opacity: 1, transform: "scale(1) translateY(0)" }],
      { duration: 320, easing: "cubic-bezier(.3,1.5,.5,1)", fill: "forwards" }
    ).finished;

    // 2) engine shake
    await jet.animate(
      [{ transform: "translateX(0)" }, { transform: "translateX(-3px)" }, { transform: "translateX(3px)" }, { transform: "translateX(-3px)" }, { transform: "translateX(0)" }],
      { duration: 280, iterations: 2 }
    ).finished;

    // 3) blast off + smoke trail
    const distance = startY + h + 60;
    flash.animate([{ opacity: 0 }, { opacity: 1 }, { opacity: 0 }], { duration: 900, easing: "ease-out" });
    const fly = jet.animate(
      [{ transform: "translateY(0) scale(1)" }, { transform: "translateY(-" + distance + "px) scale(1.25)" }],
      { duration: 950, easing: "cubic-bezier(.55,0,.9,.5)", fill: "forwards" }
    );
    const t0 = performance.now();
    const trail = setInterval(() => {
      const y = jet.getBoundingClientRect();
      const puff = document.createElement("span");
      puff.className = "jet-smoke";
      puff.style.left = y.left + y.width / 2 + (Math.random() * 14 - 7) + "px";
      puff.style.top = y.top + y.height * 0.82 + "px";
      document.body.appendChild(puff);
      puff.animate(
        [{ opacity: 0.9, transform: "scale(.6)" }, { opacity: 0, transform: "scale(2.8) translateY(40px)" }],
        { duration: 700, easing: "ease-out" }
      ).finished.then(() => puff.remove());
      if (performance.now() - t0 > 1000) clearInterval(trail);
    }, 35);

    await fly.finished;
    clearInterval(trail);
    window.location.href = href;
  }

  btn.addEventListener("click", (event) => {
    // let new-tab / modifier clicks behave normally
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if (reduceMotion || !btn.animate) return;
    event.preventDefault();
    if (launched) return;
    const href = btn.getAttribute("href");
    launch(href).catch(() => { window.location.href = href; });
    setTimeout(() => { window.location.href = href; }, 3500); // safety net
  });

  // coming back with the browser Back button: reset everything
  window.addEventListener("pageshow", () => {
    launched = false;
    btn.classList.remove("launching");
    btn.style.minWidth = "";
    const label = btn.querySelector("span");
    if (label) label.textContent = "See my projects";
    document.querySelectorAll(".jet-fly,.jet-smoke,.jet-flash").forEach((el) => el.remove());
  });
})();
