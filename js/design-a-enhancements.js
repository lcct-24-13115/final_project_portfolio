/* ==========================================================
   Design A — Visual Enhancements JavaScript
   Scroll reveals, loading screen, page transitions, particles
   ========================================================== */

(function() {
  'use strict';

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    // Skip all animations
    return;
  }

  /* ---------- Loading Screen ---------- */
  class LoadingScreen {
    constructor() {
      this.screen = document.createElement('div');
      this.screen.className = 'loading-screen';
      this.screen.innerHTML = `
        <div class="loading-logo">
          <div class="loading-ring"></div>
          <div class="loading-ring"></div>
          <div class="loading-ring"></div>
          <div class="loading-ring"></div>
          <div class="loading-center"></div>
        </div>
        <div class="loading-text">Preparing your experience</div>
        <div class="loading-progress">
          <div class="loading-fill"></div>
        </div>
      `;
      document.body.appendChild(this.screen);
      this.fill = this.screen.querySelector('.loading-fill');
      this.progress = 0;
      this.createParticles();
    }

    createParticles() {
      // Create floating particles
      for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'loading-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 3 + 4) + 's';
        particle.style.animationDelay = (Math.random() * 2) + 's';
        this.screen.appendChild(particle);
      }
    }

    start() {
      this.screen.classList.add('active');
      this.animate();
    }

    animate() {
      const interval = setInterval(() => {
        this.progress += Math.random() * 15;
        if (this.progress >= 100) {
          this.progress = 100;
          clearInterval(interval);
          this.complete();
        }
        this.fill.style.width = this.progress + '%';
      }, 100);
    }

    complete() {
      setTimeout(() => {
        this.screen.classList.add('loaded');
        setTimeout(() => {
          this.screen.remove();
        }, 600);
      }, 200);
    }
  }

  /* ---------- Scroll Reveal ---------- */
  class ScrollReveal {
    constructor() {
      this.elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade');
      this.observer = null;
      this.init();
    }

    init() {
      if (!('IntersectionObserver' in window)) {
        // Fallback: reveal all immediately
        this.elements.forEach(el => el.classList.add('revealed'));
        return;
      }

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            this.observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      });

      this.elements.forEach(el => this.observer.observe(el));
    }
  }

  /* ---------- Floating Particles ---------- */
  class FloatingParticles {
    constructor() {
      this.container = document.createElement('div');
      this.container.className = 'particles';
      document.body.appendChild(this.container);
      this.particles = [];
      this.maxParticles = 20;
      this.init();
    }

    createParticle() {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random starting position
      const startX = Math.random() * window.innerWidth;
      const startY = Math.random() * window.innerHeight;
      
      // Random direction and distance
      const angle = Math.random() * Math.PI * 2;
      const distance = 100 + Math.random() * 200;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      
      particle.style.left = startX + 'px';
      particle.style.top = startY + 'px';
      particle.style.setProperty('--tx', tx + 'px');
      particle.style.setProperty('--ty', ty + 'px');
      particle.style.animationDuration = (8 + Math.random() * 4) + 's';
      particle.style.animationDelay = Math.random() * 2 + 's';
      
      // Random size and opacity
      const size = 2 + Math.random() * 4;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.opacity = 0.2 + Math.random() * 0.3;
      
      this.container.appendChild(particle);
      
      // Remove after animation
      setTimeout(() => {
        particle.remove();
      }, 12000);
    }

    init() {
      // Create initial particles
      for (let i = 0; i < 10; i++) {
        setTimeout(() => this.createParticle(), i * 200);
      }
      
      // Continuously create new particles
      setInterval(() => {
        if (this.container.children.length < this.maxParticles) {
          this.createParticle();
        }
      }, 800);
    }
  }

  /* ---------- Page Transitions ---------- */
  class PageTransitions {
    constructor() {
      this.transition = document.createElement('div');
      this.transition.className = 'page-transition';
      document.body.appendChild(this.transition);
      this.init();
    }

    init() {
      // Add transition to all internal links
      const links = document.querySelectorAll('a[href$=".html"], a[href$=".html#"]');
      links.forEach(link => {
        const href = link.getAttribute('href');
        
        // Skip external links and same-page anchors
        if (href && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
          link.addEventListener('click', (e) => {
            // Don't transition if same page
            if (href === window.location.pathname.split('/').pop()) {
              return;
            }
            
            e.preventDefault();
            this.transitionTo(href);
          });
        }
      });
    }

    transitionTo(url) {
      // Enter transition
      this.transition.classList.add('active');
      
      setTimeout(() => {
        window.location.href = url;
      }, 500);
    }

    onEnter() {
      // Exit transition on page load
      setTimeout(() => {
        this.transition.classList.add('exit');
        setTimeout(() => {
          this.transition.classList.remove('active', 'exit');
        }, 500);
      }, 100);
    }
  }

  /* ---------- Initialize Everything ---------- */
  function init() {
    // Loading screen
    const loader = new LoadingScreen();
    loader.start();

    // Wait for DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initEnhancements();
      });
    } else {
      initEnhancements();
    }

    function initEnhancements() {
      // Scroll reveals
      new ScrollReveal();

      // Floating particles
      new FloatingParticles();

      // Page transitions
      const pageTransitions = new PageTransitions();
      pageTransitions.onEnter();
    }
  }

  // Start everything
  init();

})();
