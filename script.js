/* =========================================================
   AKSWAY FILMS — script.js
   Cursor · Intro · Navbar · Hamburger · Scroll Animations
   Marquee · Portfolio · Form
   ========================================================= */

'use strict';

/* ===================== CUSTOM CURSOR ===================== */
(function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth follower via rAF
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.18;
    followerY += (mouseY - followerY) * 0.18;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover scale on interactive elements
  const hoverTargets = 'a, button, .service-card, .portfolio-item, input, select, textarea, .btn-hero, .btn-submit, .nav-cta';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // Hide on mobile
  if ('ontouchstart' in window) {
    cursor.style.display = 'none';
    follower.style.display = 'none';
    document.body.style.cursor = 'auto';
  }
})();

/* ===================== PAGE LOAD INTRO ===================== */
(function initIntro() {
  const overlay = document.getElementById('intro-overlay');
  if (!overlay) return;

  // After intro animation ends (≈ 3.2s), fade out overlay
  setTimeout(() => {
    overlay.classList.add('hidden');
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 600);
  }, 3000);
})();

/* ===================== NAVBAR ===================== */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Active link highlight
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = { rootMargin: '-40% 0px -55% 0px' };
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => sectionObserver.observe(sec));
})();

/* ===================== HAMBURGER MENU ===================== */
(function initHamburger() {
  const hamburger  = document.getElementById('hamburger');
  const mobileNav  = document.getElementById('mobile-nav');
  const closeBtn   = document.getElementById('mobile-nav-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-cta');

  if (!hamburger || !mobileNav) return;

  function openNav() {
    mobileNav.classList.add('open');
    hamburger.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openNav);
  if (closeBtn) closeBtn.addEventListener('click', closeNav);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });
})();

/* ===================== SMOOTH SCROLL ===================== */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ===================== SCROLL FADE-UP ===================== */
(function initScrollReveal() {
  const fadeEls = document.querySelectorAll('.fade-up');
  if (!fadeEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  fadeEls.forEach(el => observer.observe(el));
})();

/* ===================== STAGGERED CHILDREN REVEAL ===================== */
(function initStaggerReveal() {
  // Service cards, process steps, portfolio items get staggered entrance
  const staggerGroups = [
    { parent: '.services-grid', children: '.service-card' },
    { parent: '.process-steps', children: '.process-step' },
    { parent: '.portfolio-grid', children: '.portfolio-item' },
    { parent: '.contact-grid', children: '.contact-info, .contact-form-wrap' },
  ];

  staggerGroups.forEach(({ parent, children }) => {
    const parentEl = document.querySelector(parent);
    if (!parentEl) return;

    const childEls = parentEl.querySelectorAll(children);
    childEls.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(32px)';
      el.style.transition = `opacity 0.7s ease ${i * 0.12}s, transform 0.7s ease ${i * 0.12}s`;
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          childEls.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    observer.observe(parentEl);
  });
})();

/* ===================== HERO VIDEO ===================== */
(function initHeroVideo() {
  const video = document.getElementById('hero-video');
  if (!video) return;

  // Ensure autoplay on mobile by playing on first user interaction if needed
  const tryPlay = async () => {
    try {
      await video.play();
    } catch (e) {
      // Fallback handled by CSS (show image on mobile)
      console.log('Video autoplay blocked, using fallback image.');
    }
  };

  if (video.readyState >= 2) {
    tryPlay();
  } else {
    video.addEventListener('canplay', tryPlay, { once: true });
  }

  // On mobile, video is hidden via CSS; ensure the fallback image shows
  if (window.innerWidth <= 768) {
    video.pause();
    video.style.display = 'none';
  }
})();

/* ===================== PORTFOLIO HOVER ===================== */
(function initPortfolioHover() {
  // Already handled via CSS, but add touch support
  if (!('ontouchstart' in window)) return;

  document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('touchstart', () => {
      document.querySelectorAll('.portfolio-item').forEach(i => i.classList.remove('touch-active'));
      item.classList.add('touch-active');
    }, { passive: true });
  });

  document.addEventListener('touchstart', (e) => {
    if (!e.target.closest('.portfolio-item')) {
      document.querySelectorAll('.portfolio-item').forEach(i => i.classList.remove('touch-active'));
    }
  }, { passive: true });
})();

/* ===================== LAZY LOADING IMAGES ===================== */
(function initLazyLoad() {
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported, img[loading=lazy] already set in HTML
    return;
  }
  // Fallback: IntersectionObserver-based lazy loading
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
        imageObserver.unobserve(img);
      }
    });
  });
  lazyImages.forEach(img => imageObserver.observe(img));
})();

/* ===================== CONTACT FORM ===================== */
(function initContactForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form || !success) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const name  = form.querySelector('#cf-name');
    let valid = true;

    if (!name.value.trim()) {
      name.style.borderColor = 'rgba(200,80,80,0.6)';
      valid = false;
    } else {
      name.style.borderColor = '';
    }

    if (!valid) return;

    // WhatsApp Submission
    const submitBtn = form.querySelector('.btn-submit');
    submitBtn.textContent = 'Opening WhatsApp…';
    submitBtn.disabled = true;

    // Get additional fields
    const phoneNum     = form.querySelector('#cf-phone').value;
    const eventType    = form.querySelector('#cf-type').value;
    const date         = form.querySelector('#cf-date').value;
    const messageText  = form.querySelector('#cf-message').value;

    // Construct the WhatsApp message
    const message = `*New Inquiry from AKSWAY FILMS website*

*Name:* ${name.value}
*Phone:* ${phoneNum}
*Event:* ${eventType}
*Date:* ${date}

*Message:* ${messageText}`.trim();

    const waUrl = `https://wa.me/91897111258?text=${encodeURIComponent(message)}`;

    setTimeout(() => {
      window.open(waUrl, '_blank');
      
      form.reset();
      submitBtn.style.display = 'none';
      success.classList.add('show');

      // Restore button after 5 seconds
      setTimeout(() => {
        success.classList.remove('show');
        setTimeout(() => {
          submitBtn.style.display = '';
          submitBtn.textContent = 'Send Inquiry →';
          submitBtn.disabled = false;
        }, 300);
      }, 5000);
    }, 800);
  });

  // Remove error styling on input
  form.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => { el.style.borderColor = ''; });
  });
})();

/* ===================== MARQUEE PAUSE ON HOVER ===================== */
(function initMarqueePause() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;

  track.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });
  track.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
})();

/* ===================== PARALLAX HERO ===================== */
(function initParallax() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const video = document.getElementById('hero-video');
  const fallback = hero.querySelector('.hero-image-fallback');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const speed = 0.35;
    const offset = scrollY * speed;
    if (video) video.style.transform = `translateY(${offset}px)`;
    if (fallback) fallback.style.transform = `translateY(${offset}px)`;
  }, { passive: true });
})();

/* ===================== INTERSECTION OBSERVER DELAY FIX ===================== */
// Make sure sections with .fade-up that start in viewport are shown
(function fixVisibleFadeUp() {
  window.addEventListener('load', () => {
    document.querySelectorAll('.fade-up').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('visible');
      }
    });
  });
})();

/* ===================== NAV ACTIVE LINK STYLE ===================== */
// Inject active link style
(function injectActiveStyle() {
  const style = document.createElement('style');
  style.textContent = `
    .nav-link.active { color: var(--text); }
    .nav-link.active::after { width: 100%; }
    .portfolio-item.touch-active .portfolio-overlay { opacity: 1; }
    .portfolio-item.touch-active img { transform: scale(1.06); filter: contrast(1.05) saturate(0.85) brightness(0.6); }
  `;
  document.head.appendChild(style);
})();

console.log('%cAKSWAY FILMS ✦ Every frame tells a story.', 'color: #C8A96E; font-family: serif; font-size: 14px; font-style: italic;');
