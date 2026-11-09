// ==========================================================
// Interaction Enhancements JavaScript
// Typing animation, progress dots, keyboard shortcuts, mouse trail, back to top
// ==========================================================

// ---------- Typing Animation ----------
class TypingAnimation {
  constructor(element, texts, typingSpeed = 100, deletingSpeed = 50, pauseDuration = 2000) {
    this.element = element;
    this.texts = texts;
    this.typingSpeed = typingSpeed;
    this.deletingSpeed = deletingSpeed;
    this.pauseDuration = pauseDuration;
    this.currentTextIndex = 0;
    this.currentCharIndex = 0;
    this.isDeleting = false;
    this.init();
  }

  init() {
    this.element.classList.add('typing-text');
    this.type();
  }

  type() {
    const currentText = this.texts[this.currentTextIndex];
    
    if (this.isDeleting) {
      this.currentCharIndex--;
      this.element.textContent = currentText.substring(0, this.currentCharIndex);
    } else {
      this.currentCharIndex++;
      this.element.textContent = currentText.substring(0, this.currentCharIndex);
    }

    let typeSpeed = this.isDeleting ? this.deletingSpeed : this.typingSpeed;

    if (!this.isDeleting && this.currentCharIndex === currentText.length) {
      typeSpeed = this.pauseDuration;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentCharIndex === 0) {
      this.isDeleting = false;
      this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
      typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// ---------- Progress Dots ----------
class ProgressDots {
  constructor() {
    this.pages = [
      { url: 'index.html', label: 'Home' },
      { url: 'about.html', label: 'About' },
      { url: 'experience.html', label: 'Experience' },
      { url: 'projects.html', label: 'Projects' },
      { url: 'contact.html', label: 'Contact' }
    ];
    this.init();
  }

  init() {
    const container = document.createElement('div');
    container.className = 'progress-dots';

    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    this.pages.forEach((page, index) => {
      const dot = document.createElement('div');
      dot.className = 'progress-dot';
      dot.setAttribute('data-label', page.label);
      
      if (currentPath === page.url || (currentPath === '' && page.url === 'index.html')) {
        dot.classList.add('active');
      }

      dot.addEventListener('click', () => {
        window.location.href = page.url;
      });

      container.appendChild(dot);
    });

    document.body.appendChild(container);
  }
}

// ---------- Keyboard Shortcuts ----------
class KeyboardShortcuts {
  constructor() {
    this.pageOrder = ['index.html', 'about.html', 'experience.html', 'projects.html', 'contact.html'];
    this.init();
  }

  init() {
    document.addEventListener('keydown', (e) => {
      // Don't trigger if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      const currentPath = window.location.pathname.split('/').pop() || 'index.html';
      const currentIndex = this.pageOrder.indexOf(currentPath);

      switch(e.key) {
        case 'ArrowLeft':
          if (currentIndex > 0) {
            window.location.href = this.pageOrder[currentIndex - 1];
          }
          break;
        case 'ArrowRight':
          if (currentIndex < this.pageOrder.length - 1) {
            window.location.href = this.pageOrder[currentIndex + 1];
          }
          break;
      }
    });
  }
}

// ---------- Mouse Trail ----------
class MouseTrail {
  constructor(trailLength = 8) {
    this.trailLength = trailLength;
    this.trail = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.init();
  }

  init() {
    // Check if reduced motion is preferred
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Create trail dots
    for (let i = 0; i < this.trailLength; i++) {
      const dot = document.createElement('div');
      dot.className = 'trail-dot';
      dot.style.width = `${8 - i * 0.5}px`;
      dot.style.height = `${8 - i * 0.5}px`;
      document.body.appendChild(dot);
      this.trail.push({
        element: dot,
        x: 0,
        y: 0
      });
    }

    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    // Animate trail
    this.animate();
  }

  animate() {
    let x = this.mouseX;
    let y = this.mouseY;

    this.trail.forEach((dot, index) => {
      const nextDot = this.trail[index + 1] || this.trail[0];
      
      dot.x += (x - dot.x) * 0.35;
      dot.y += (y - dot.y) * 0.35;
      
      dot.element.style.left = dot.x + 'px';
      dot.element.style.top = dot.y + 'px';
      
      x = dot.x;
      y = dot.y;
    });

    requestAnimationFrame(() => this.animate());
  }
}

// ---------- Back to Top Button ----------
class BackToTop {
  constructor() {
    this.button = null;
    this.init();
  }

  init() {
    // Create button
    this.button = document.createElement('button');
    this.button.className = 'back-to-top';
    this.button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    this.button.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(this.button);

    // Show/hide on scroll
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        this.button.classList.add('visible');
      } else {
        this.button.classList.remove('visible');
      }
    });

    // Scroll to top on click
    this.button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// ---------- Initialize All Features ----------
document.addEventListener('DOMContentLoaded', () => {
  // Typing animation - find h1 elements and add typing effect
  const heroH1 = document.querySelector('.hero h1');
  if (heroH1) {
    const typingElement = document.createElement('span');
    typingElement.className = 'typing-container';
    const textSpan = document.createElement('span');
    typingElement.appendChild(textSpan);
    
    heroH1.innerHTML = '';
    heroH1.appendChild(typingElement);
    
    new TypingAnimation(textSpan, [
      'Julia Alemania',
      'Web Developer',
      'BSIT Student',
      'Flutter Developer'
    ], 100, 50, 2000);
  }

  // Initialize all features
  new ProgressDots();
  new KeyboardShortcuts();
  new MouseTrail(8);
  new BackToTop();
});
