/* ==========================================================
   Julia Cassandra Alemania | Portfolio
   JavaScript features:
   1.  Dark / light theme toggle (remembered with localStorage)
   2.  Mobile menu (open / close, closes on link tap and Escape)
   3.  Typing effect in the hero
   4.  Active menu link while scrolling (scroll-spy)
   5.  Fade-in animation on scroll
   6.  Certificate filter
   7.  Image viewer / gallery (keyboard, buttons, swipe)
   8.  Copy to clipboard with a small message
   9.  Contact form validation (opens the email app)
   10. Back-to-top button and footer year
   ========================================================== */

"use strict";

/** Shortcuts so the code below stays short and readable. */
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

/** Storage can be blocked (private browsing), so every use is guarded. */
function readStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}
function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    /* saving is optional */
  }
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- 1. Theme toggle ---------- */
function initTheme() {
  const root = document.documentElement;
  const button = $("#themeToggle");
  if (!button) return;
  const icon = $(".glyph", button);
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

  /** Returns "dark" or "light" for what is showing right now. */
  const currentTheme = () => root.getAttribute("data-theme") || (systemDark.matches ? "dark" : "light");

  /** Updates the button icon and its labels to match the theme. */
  function updateButton() {
    const isDark = currentTheme() === "dark";
    const label = isDark ? "Switch to light mode" : "Switch to dark mode";
    button.setAttribute("aria-label", label);
    button.setAttribute("title", label);
    icon.innerHTML = isDark ? "&#9728;" : "&#9790;"; // sun / moon
  }

  button.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    writeStorage("theme", next);
    updateButton();
  });

  updateButton();
}

/* ---------- 2. Mobile menu ---------- */
function initMobileMenu() {
  const toggle = $("#navToggle");
  const nav = $("#siteNav");
  if (!toggle || !nav) return;
  const icon = $(".glyph", toggle);

  function setOpen(open) {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    icon.innerHTML = open ? "&#10005;" : "&#9776;"; // X / hamburger
  }

  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
  // Close after choosing a link.
  $$("a", nav).forEach((link) => link.addEventListener("click", () => setOpen(false)));
  // Close with the Escape key.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("open")) {
      setOpen(false);
      toggle.focus();
    }
  });
}

/* ---------- 3. Typing effect ---------- */
function initTyping() {
  const target = $("#typed");
  if (!target) return;

  let words;
  try {
    words = JSON.parse(target.dataset.words);
  } catch (error) {
    return; // keep the plain text already in the page
  }
  if (!Array.isArray(words) || words.length === 0 || prefersReducedMotion) return;

  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const word = words[wordIndex];
    charIndex += deleting ? -1 : 1;
    target.textContent = word.slice(0, charIndex);

    let delay = deleting ? 45 : 90;
    if (!deleting && charIndex === word.length) {
      deleting = true;
      delay = 1500; // pause on the finished word
    } else if (deleting && charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 350;
    }
    setTimeout(tick, delay);
  }
  target.textContent = "";
  tick();
}

/* ---------- 4. Scroll-spy ---------- */
function initScrollSpy() {
  const links = $$(".site-nav a");
  const sections = links.map((link) => $(link.getAttribute("href"))).filter(Boolean);
  if (!("IntersectionObserver" in window) || sections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          const active = link.getAttribute("href") === "#" + entry.target.id;
          link.classList.toggle("active", active);
          if (active) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      });
    },
    // A section counts as "current" when it crosses the middle of the screen.
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((section) => observer.observe(section));
}

/* ---------- 5. Reveal on scroll ---------- */
function initReveal() {
  const items = $$(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  items.forEach((item) => observer.observe(item));
}

/* ---------- 6. Certificate filter ---------- */
function initCertFilter() {
  const buttons = $$("[data-filter]");
  const certs = $$(".cert");
  const status = $("#filterStatus");
  if (buttons.length === 0) return;

  function apply(filter) {
    let shown = 0;
    certs.forEach((cert) => {
      const match = filter === "all" || cert.dataset.category === filter;
      cert.hidden = !match;
      if (match) shown += 1;
    });
    buttons.forEach((btn) => {
      const active = btn.dataset.filter === filter;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
    if (status) status.textContent = `Showing ${shown} of ${certs.length} certificates`;
  }

  buttons.forEach((btn) => btn.addEventListener("click", () => apply(btn.dataset.filter)));
  apply("all");
}

/* ---------- 7. Image viewer ---------- */
function initLightbox() {
  const box = $("#lightbox");
  if (!box) return;
  const img = $("#lbImg");
  const title = $("#lbTitle");
  const count = $("#lbCount");
  const prev = $("#lbPrev");
  const next = $("#lbNext");
  const close = $("#lbClose");

  let items = []; // [{ src, title }]
  let index = 0;
  let opener = null; // element to give focus back to

  function show(i) {
    index = Math.max(0, Math.min(items.length - 1, i));
    const item = items[index];
    img.src = item.src;
    img.alt = item.title;
    title.textContent = item.title;
    count.textContent = `${index + 1} / ${items.length}`;
    prev.disabled = index === 0;
    next.disabled = index === items.length - 1;
    // Restart the zoom-in animation.
    img.style.animation = "none";
    void img.offsetWidth;
    img.style.animation = "";
  }

  function open(list, start, trigger) {
    if (list.length === 0) return;
    items = list;
    opener = trigger;
    box.hidden = false;
    document.body.style.overflow = "hidden";
    show(start);
    close.focus();
  }

  function shut() {
    box.hidden = true;
    document.body.style.overflow = "";
    img.removeAttribute("src");
    if (opener) opener.focus();
  }

  // Certificates: the gallery is whatever certificates are visible right now.
  $$(".cert-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const visible = $$(".cert-btn").filter((b) => !b.closest(".cert").hidden);
      const list = visible.map((b) => ({ src: b.dataset.full, title: b.dataset.title }));
      open(list, visible.indexOf(btn), btn);
    });
  });

  // Projects: the screenshots are listed as links inside a hidden list.
  $$(".project-cover").forEach((btn) => {
    btn.addEventListener("click", () => {
      const links = $$(`[data-gallery-list="${btn.dataset.gallery}"] a`);
      const list = links.map((a) => ({ src: a.getAttribute("href"), title: a.dataset.title }));
      open(list, 0, btn);
    });
  });

  prev.addEventListener("click", () => show(index - 1));
  next.addEventListener("click", () => show(index + 1));
  close.addEventListener("click", shut);
  // Click on the dark background closes the viewer.
  box.addEventListener("click", (event) => {
    if (event.target === box) shut();
  });

  document.addEventListener("keydown", (event) => {
    if (box.hidden) return;
    if (event.key === "Escape") shut();
    else if (event.key === "ArrowLeft") show(index - 1);
    else if (event.key === "ArrowRight") show(index + 1);
    else if (event.key === "Tab") {
      // Keep keyboard focus inside the viewer while it is open.
      const focusable = [close, prev, next].filter((el) => !el.disabled);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  // Swipe left / right on touch screens.
  let startX = null;
  box.addEventListener("touchstart", (event) => {
    startX = event.changedTouches[0].clientX;
  }, { passive: true });
  box.addEventListener("touchend", (event) => {
    if (startX === null) return;
    const diff = event.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 50) show(index + (diff < 0 ? 1 : -1));
    startX = null;
  }, { passive: true });
}

/* ---------- 8. Copy to clipboard ---------- */
let toastTimer;
function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

/** Copies text with the Clipboard API, or an older fallback. */
async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  document.execCommand("copy");
  area.remove();
}

function initCopyButtons() {
  $$(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        await copyText(btn.dataset.copy);
        showToast(`${btn.dataset.label} copied to clipboard`);
      } catch (error) {
        showToast("Could not copy. Please copy it by hand.");
      }
    });
  });
}

/* ---------- 9. Contact form ---------- */
function initContactForm() {
  const form = $("#contactForm");
  if (!form) return;
  const status = $("#formStatus");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /** Returns an error message, or "" when the field is valid. */
  const rules = {
    name: (value) => (value.trim().length < 2 ? "Please enter your name (at least 2 letters)." : ""),
    email: (value) => (emailPattern.test(value.trim()) ? "" : "Please enter a valid email address."),
    message: (value) => (value.trim().length < 10 ? "Your message should be at least 10 characters." : ""),
  };

  function check(input) {
    const message = rules[input.name](input.value);
    const field = input.closest(".field");
    const error = $(".error", field);
    error.textContent = message;
    field.classList.toggle("invalid", message !== "");
    input.setAttribute("aria-invalid", String(message !== ""));
    return message === "";
  }

  const inputs = $$("input, textarea", form);
  // Check each field when the visitor leaves it, and clear the error while typing.
  inputs.forEach((input) => {
    input.addEventListener("blur", () => check(input));
    input.addEventListener("input", () => {
      if (input.closest(".field").classList.contains("invalid")) check(input);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const results = inputs.map(check);
    if (results.includes(false)) {
      status.textContent = "Please fix the highlighted fields.";
      inputs.find((input) => input.closest(".field").classList.contains("invalid")).focus();
      return;
    }

    const data = new FormData(form);
    const subject = `Portfolio message from ${data.get("name").trim()}`;
    const body = `${data.get("message").trim()}\n\nFrom: ${data.get("name").trim()} (${data.get("email").trim()})`;
    window.location.href =
      "mailto:cassandraalemania@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

    status.textContent = "Opening your email app. Thank you for reaching out!";
    form.reset();
  });
}

/* ---------- 10. Back to top and footer year ---------- */
function initPageExtras() {
  const toTop = $("#toTop");
  if (toTop) {
    window.addEventListener("scroll", () => {
      toTop.hidden = window.scrollY < 600;
    }, { passive: true });
    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
}

/* ---------- Start everything when the page is ready ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMobileMenu();
  initTyping();
  initScrollSpy();
  initReveal();
  initCertFilter();
  initLightbox();
  initCopyButtons();
  initContactForm();
  initPageExtras();
});
