"use strict";
/* Adds the pill-nav extras on every page: prev/next arrows, round menu, social dock,
   copyright, and the astronaut "Ready for liftoff?" hero. */
(function () {
  const pages = [["about.html","About Me"],["experience.html","Experience"],["projects.html","Projects"],["links.html","Quick Links"],["contact.html","Say hi"]];
  const file = (location.pathname.split("/").pop() || "index.html");
  const i = pages.findIndex((p) => p[0] === file);
  const header = document.querySelector(".site-header");
  const main = document.querySelector("main");

  // Prev / next arrows under the nav
  if (header && i !== -1) {
    const prev = pages[i - 1], next = pages[i + 1];
    const nav = document.createElement("div");
    nav.className = "pager";
    nav.innerHTML =
      '<a href="' + (prev ? prev[0] : "#") + '" aria-label="' + (prev ? "Previous page: " + prev[1] : "No previous page") + '"' + (prev ? "" : ' aria-disabled="true" tabindex="-1"') + '><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></a>' +
      '<a href="' + (next ? next[0] : "#") + '" aria-label="' + (next ? "Next page: " + next[1] : "No next page") + '"' + (next ? "" : ' aria-disabled="true" tabindex="-1"') + '><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>';
    header.appendChild(nav);
  }

  // Round menu (top-left)
  const menu = document.createElement("div");
  menu.className = "orb-menu";
  menu.innerHTML = '<button class="orb-btn" type="button" aria-expanded="false" aria-label="Open page menu">&middot;&middot;&middot;</button><ul class="orb-list">' +
    pages.map((p) => '<li><a href="' + p[0] + '">' + p[1] + "</a></li>").join("") + "</ul>";
  const btn = menu.querySelector(".orb-btn");
  btn.addEventListener("click", () => { const o = menu.classList.toggle("open"); btn.setAttribute("aria-expanded", o); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { menu.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); } });
  document.body.appendChild(menu);

  // Social icons (bottom-left) + copyright (bottom-right)
  const dock = document.createElement("div");
  dock.className = "social-dock";
  dock.innerHTML =
    '<a href="https://github.com/lcct-24-13115" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>' +
    '<a href="https://www.linkedin.com/in/julia-cassandra-alemania-911831444" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fa-brands fa-linkedin"></i></a>' +
    '<a href="https://www.facebook.com/JCUA24" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i class="fa-brands fa-facebook"></i></a>' +
    '<a href="https://www.instagram.com/makethoiu_" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>';
  document.body.appendChild(dock);
  const copy = document.createElement("p");
  copy.className = "copy-dock";
  copy.textContent = "\u00A9 " + new Date().getFullYear() + " Julia Alemania";
  document.body.appendChild(copy);

  // Astronaut hero at the end of each page (replaces the old CTA on Experience)
  if (!main || i === -1 || file === "contact.html") return;
  const old = document.querySelector(".xp-cta");
  if (old) old.remove();
  const sec = document.createElement("section");
  sec.className = "lo-hero";
  sec.setAttribute("aria-labelledby", "lo-title");
  sec.innerHTML =
    '<p class="lo-eyebrow">Ready for liftoff?</p>' +
    '<h2 class="lo-title" id="lo-title">Let&rsquo;s build<span class="lo-grad">something out of this world</span></h2>' +
    '<div class="lo-actions"><a class="lo-btn grad" href="contact.html">Say hi <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a><a class="lo-btn" href="projects.html">See my projects</a></div>' +
    '<svg class="lo-astro" viewBox="0 0 400 300" role="img" aria-label="Astronaut waving while holding a giant pencil">' +
    '<defs><radialGradient id="aS" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#b9c2e0"/></radialGradient>' +
    '<radialGradient id="aV" cx=".3" cy=".25" r=".9"><stop offset="0" stop-color="#3b57d6"/><stop offset="1" stop-color="#0a1250"/></radialGradient>' +
    '<linearGradient id="aP" x1="0" x2="1"><stop offset="0" stop-color="#f2b25c"/><stop offset="1" stop-color="#b9622a"/></linearGradient></defs>' +
    '<g transform="rotate(-32 250 190)"><rect x="150" y="165" width="220" height="50" rx="6" fill="url(#aP)"/><path d="M370 165 L420 190 L370 215 Z" fill="#f4d9b0"/><path d="M402 183 L420 190 L402 197 Z" fill="#222"/></g>' +
    '<path d="M110 300 C110 215 150 185 200 185 C250 185 290 215 290 300 Z" fill="url(#aS)"/>' +
    '<circle cx="200" cy="120" r="78" fill="url(#aS)"/><ellipse cx="200" cy="125" rx="58" ry="50" fill="url(#aV)"/><ellipse cx="178" cy="106" rx="14" ry="9" fill="#fff" fill-opacity=".35"/>' +
    '<rect x="70" y="140" width="36" height="86" rx="18" fill="url(#aS)" transform="rotate(25 88 180)"/><circle cx="72" cy="135" r="20" fill="#fff"/>' +
    '<circle cx="286" cy="215" r="22" fill="#fff"/></svg>';
  main.appendChild(sec);
})();
