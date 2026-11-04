# Julia Cassandra Alemania | Portfolio Website

Personal portfolio website for **Web Technology (BSIT)**, built with plain HTML, CSS and JavaScript.
It is the web version of my Flutter portfolio app.

Live site: https://lcct-24-13115.github.io/my_portfolio/

## Sections
Home, About Me, Education, Skills (with certificates), Projects (with awards), Contact (with references).

## JavaScript features
1. Light / dark theme toggle (remembered with localStorage)
2. Mobile menu
3. Typing effect in the hero
4. Active menu link while scrolling
5. Fade-in on scroll
6. Certificate filter (All, Networking, Web, Webinars)
7. Image viewer for certificates and project screenshots (buttons, arrow keys, swipe)
8. Copy-to-clipboard buttons
9. Contact form validation
10. Back-to-top button

## Folder structure
```
index.html
css/style.css
js/main.js
fonts/        Poppins font files
images/       profile, favicon, preview
  certificates/
  projects/
docs/         CV (PDF)
```

## Run locally
Open `index.html` in a browser, or run `python -m http.server 8000` and visit http://localhost:8000

## Publish on GitHub Pages
1. Put all files in the repository root (the `index.html` must be at the top level).
2. Repository **Settings > Pages > Build and deployment**: Source = *Deploy from a branch*, Branch = `main`, folder = `/ (root)`.
3. Wait a minute, then open https://lcct-24-13115.github.io/my_portfolio/
