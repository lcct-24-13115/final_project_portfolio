# Julia Cassandra Alemania | Portfolio Website

Personal portfolio website for **Web Technology (BSIT)**, built with plain HTML, CSS and JavaScript.
It is the web version of my Flutter portfolio app.

Live site: https://lcct-24-13115.github.io/final_project_portfolio/

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
11. Full-screen button
12. Download buttons for every certificate (and a ZIP of all certificates)
13. Send message through email, LinkedIn, Messenger or Instagram
14. Share my portfolio (LinkedIn, Facebook, email, copy link)

## Folder structure
```
index.html
css/julia-style.css
js/julia-main.js
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
3. Wait a minute, then open https://lcct-24-13115.github.io/final_project_portfolio/

## Automatic email (contact form)
1. Go to https://web3forms.com, enter cassandraalemania@gmail.com, and copy the free access key they email you.
2. Open `js/julia-main.js` and paste it here: `const WEB3FORMS_KEY = "your-key";`
3. Commit and push. The form then sends the message straight to the inbox.
Until a key is added, the form opens the visitor's email app instead.

