/* ============================================================
   NAFIZ IMTIAZ — PORTFOLIO SCRIPT
   Features: GSAP animations, ScrollTrigger, Typing animation,
             Smooth scroll, Project filter, Modal, Form validation,
             Dark/Light mode, Custom cursor, Nav scroll
   ============================================================ */

'use strict';

/* ── DOM Helpers ─────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ── Custom Cursor ──────────────────────────────────────────── */
(function initCursor() {
  const cursor   = $('#cursor');
  const follower = $('#cursorFollower');
  if (!cursor || !follower) return;

  let mx = 0, my = 0;
  let fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  (function animateFollower() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animateFollower);
  })();

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity   = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity   = '1';
    follower.style.opacity = '0.6';
  });
})();

/* ── Sticky Nav ──────────────────────────────────────────────── */
(function initNav() {
  const nav = $('#mainNav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── Mobile Menu ─────────────────────────────────────────────── */
(function initMobileMenu() {
  const btn   = $('#hamburger');
  const menu  = $('#mobileMenu');
  const links = $$('.mobile-link');
  if (!btn || !menu) return;

  const toggle = (open) => {
    btn.classList.toggle('open', open);
    menu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  btn.addEventListener('click', () => toggle(!menu.classList.contains('open')));
  links.forEach(link => link.addEventListener('click', () => toggle(false)));
  document.addEventListener('click', e => {
    if (!menu.contains(e.target) && !btn.contains(e.target)) toggle(false);
  });
})();

/* ── Smooth Scroll ───────────────────────────────────────────── */
(function initSmoothScroll() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') { e.preventDefault(); return; }
      const target = $(href);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      window.scrollTo({ top: target.offsetTop - navH, behavior: 'smooth' });
    });
  });
})();

/* ── Typing Animation ────────────────────────────────────────── */
(function initTyping() {
  const el = $('#typedText');
  if (!el) return;

  const phrases = [
    'a UI/UX Designer',
    'a Visual Storyteller',
    'a Figma Power User',
    'a Mobile-First Thinker',
    'a Product Designer',
  ];

  let phraseIdx = 0, charIdx = 0, deleting = false;

  function tick() {
    const phrase = phrases[phraseIdx];
    el.textContent = deleting
      ? phrase.substring(0, charIdx - 1)
      : phrase.substring(0, charIdx + 1);

    charIdx = deleting ? charIdx - 1 : charIdx + 1;

    if (!deleting && charIdx === phrase.length) {
      setTimeout(() => { deleting = true; tick(); }, 1800);
      return;
    }
    if (deleting && charIdx === 0) {
      deleting  = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
    setTimeout(tick, deleting ? 50 : 90);
  }

  /* Slight delay so the hero GSAP animation finishes first */
  setTimeout(tick, 1200);
})();

/* ============================================================
   GSAP ANIMATIONS
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

/* ── GSAP: Hero Entrance ─────────────────────────────────────── */
(function initGSAPHero() {
  /*
    Set all hero elements to invisible immediately so there is
    no flash of unstyled content before the timeline runs.
  */
  gsap.set([
    '.hero-badge', '.hero-role', '.hero-desc',
    '.hero-cta', '.hero-stats', '.scroll-indicator',
  ], { opacity: 0, y: 24 });

  gsap.set('.hero-title .title-line', { opacity: 0, y: 52 });
  gsap.set('.hero-photo',             { opacity: 0, x: 64, scale: 0.94 });
  gsap.set('.floating-badge',         { opacity: 0, scale: 0.82, y: 12 });

  /* Staggered cinematic entrance */
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.12 });

  tl.to('.hero-badge',             { opacity: 1, y: 0, duration: 0.72 })
    .to('.hero-title .title-line', { opacity: 1, y: 0, duration: 0.88, stagger: 0.14 }, '-=0.30')
    .to('.hero-role',              { opacity: 1, y: 0, duration: 0.64 }, '-=0.55')
    .to('.hero-desc',              { opacity: 1, y: 0, duration: 0.64 }, '-=0.55')
    .to('.hero-cta',               { opacity: 1, y: 0, duration: 0.64 }, '-=0.52')
    .to('.hero-stats',             { opacity: 1, y: 0, duration: 0.64 }, '-=0.45')
    .to('.hero-photo',             { opacity: 1, x: 0, scale: 1, duration: 1.12 }, '-=1.22')
    .to('.floating-badge',         {
        opacity: 1, scale: 1, y: 0,
        duration: 0.52, stagger: 0.2, ease: 'back.out(1.7)',
      }, '-=0.50')
    .to('.scroll-indicator',       { opacity: 1, y: 0, duration: 0.48 }, '-=0.2');
})();

/* ── GSAP: Scroll Reveals ────────────────────────────────────── */
/*
  Replaces the old IntersectionObserver-based initReveal().
  Uses ScrollTrigger so each element animates exactly when it
  enters the viewport — no more toggling CSS classes manually.
*/
(function initGSAPReveal() {
  gsap.utils.toArray('.reveal-up').forEach(el => {
    const delay = el.dataset.delay ? parseInt(el.dataset.delay) * 0.08 : 0;
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.82,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger:       el,
          start:         'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  gsap.utils.toArray('.reveal-right').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, x: 40 },
      {
        opacity: 1, x: 0,
        duration: 0.82,
        ease: 'power3.out',
        scrollTrigger: {
          trigger:       el,
          start:         'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
})();

/* ── GSAP: Skill Bars ────────────────────────────────────────── */
/*
  Replaces the old initSkillBars() which wrote width as inline
  style after IntersectionObserver fired. GSAP gives a smoother
  eased bar-fill with better timing control.
*/
(function initGSAPSkillBars() {
  gsap.utils.toArray('.skill-fill').forEach(fill => {
    const targetW = fill.dataset.width || '0';
    gsap.fromTo(fill,
      { width: '0%' },
      {
        width: targetW + '%',
        duration: 1.35,
        ease: 'power2.out',
        scrollTrigger: {
          trigger:       fill,
          start:         'top 86%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
})();

/* ── GSAP: Timeline Items ────────────────────────────────────── */
(function initGSAPTimeline() {
  gsap.utils.toArray('.timeline-item').forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, x: i % 2 === 0 ? -36 : 36 },
      {
        opacity: 1, x: 0,
        duration: 0.78,
        ease: 'power3.out',
        scrollTrigger: {
          trigger:       item,
          start:         'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
})();

/* ── GSAP: About Cards Stagger ───────────────────────────────── */
(function initGSAPAboutCards() {
  const cards = $$('.about-card');
  if (!cards.length) return;

  gsap.fromTo(cards,
    { opacity: 0, y: 32, scale: 0.96 },
    {
      opacity: 1, y: 0, scale: 1,
      duration: 0.72,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger:       '.about-cards',
        start:         'top 84%',
        toggleActions: 'play none none none',
      },
    }
  );
})();

/* ── GSAP: Section Heading Reveals ──────────────────────────── */
(function initGSAPHeadings() {
  $$('.section-title').forEach(title => {
    gsap.fromTo(title,
      { opacity: 0, y: 28 },
      {
        opacity: 1, y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger:       title,
          start:         'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  $$('.section-tag').forEach(tag => {
    gsap.fromTo(tag,
      { opacity: 0, x: -20 },
      {
        opacity: 1, x: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger:       tag,
          start:         'top 90%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
})();

/* ============================================================
   INTERACTIVE FEATURES
   ============================================================ */

/* ── Project Filter ──────────────────────────────────────────── */
(function initFilter() {
  const btns  = $$('.filter-btn');
  const cards = $$('.project-card');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      cards.forEach((card, i) => {
        const cat  = card.dataset.category;
        const show = filter === 'all' || cat === filter;

        if (show) {
          card.classList.remove('hidden');
          gsap.fromTo(card,
            { opacity: 0, y: 20, scale: 0.97 },
            { opacity: 1, y: 0,  scale: 1, duration: 0.45, delay: i * 0.04, ease: 'power2.out' }
          );
        } else {
          card.classList.add('hidden');
          gsap.to(card, { opacity: 0, duration: 0.2, ease: 'power1.in' });
        }
      });
    });
  });
})();

/* ── Modal ───────────────────────────────────────────────────── */
const projectData = {
  rithos: {
    tag:   'Mobile UI/UX · Figma',
    title: 'RITHOS',
    sub:   'Lifestyle Brand Mobile App',
    img:   'assets/rithos.jpg',
    icon:  '👗',
    desc:  'End-to-end mobile UI/UX design for a premium lifestyle and fashion brand. The project covered the complete user journey from first open to purchase confirmation, with a strong visual identity built to scale.',
    bullets: [
      'Designed full mobile UI — onboarding, product discovery, detail pages, cart, and checkout flows',
      'Built a scalable component library with unified typography, colour tokens, and spacing rules',
      'Produced a linked interactive Figma prototype demonstrating the complete end-to-end user journey',
      'Defined interaction states and micro-animations for a polished feel',
    ],
    tech:  ['Figma', 'Mobile UI/UX', 'Design Systems', 'Interactive Prototype', 'Components'],
    demo:  'https://www.figma.com/design/bITsq4ke22CeKo6vpQV2rJ/RITHOS?node-id=0-1&t=N2Ig1bhk44gHaaPc-1',
    proto: 'https://www.figma.com/proto/bITsq4ke22CeKo6vpQV2rJ/RITHOS?node-id=1-3150&p=f&viewport=-45%2C298%2C0.02&t=iCz2gBVHJl8gSLDS-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=1%3A3150&show-proto-sidebar=1&page-id=0%3A1',
  },
  aurum: {
    tag:   'Mobile UI/UX · Figma',
    title: 'Aurum Stays',
    sub:   'Luxury Accommodation Booking App',
    img:   'assets/aurum.jpg',
    icon:  '🏨',
    desc:  'Premium accommodation booking app designed with a high-end visual identity and seamless booking UX. The brief called for an editorial quality that would feel at home in a luxury lifestyle magazine.',
    bullets: [
      'Designed high-fidelity screens for property search, room detail, filtering, and booking confirmation',
      'Crafted an editorial visual language using rich imagery, refined typography, and a gold accent palette',
      'Mapped task journeys and validated the full booking flow with a fully interactive prototype',
      'Applied careful spacing, grid systems, and visual hierarchy to maintain a premium feel',
    ],
    tech:  ['Figma', 'Luxury UI', 'Editorial Design', 'Prototyping', 'User Flow Mapping'],
    demo:  'https://www.figma.com/design/jWjGBdXpdPanlW2mmAd2Ei/AURUM-STAYS?node-id=0-1&t=CSfHYBFJge17P80J-1',
    proto: 'https://www.figma.com/proto/jWjGBdXpdPanlW2mmAd2Ei/AURUM-STAYS?node-id=1-697&p=f&viewport=-2511%2C-2072%2C0.21&t=AB2sKpdfDK5yg9N0-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=1%3A682&page-id=0%3A1',
  },
  ecostay: {
    tag:   'Mobile UI/UX · Figma',
    title: 'EcoStay',
    sub:   'Sustainable Lifestyle App',
    img:   'assets/ecostay.png',
    icon:  '🌿',
    desc:  'Eco-conscious lifestyle platform for sustainable product discovery and environmental impact tracking. Designed with a deep commitment to accessibility and natural aesthetics.',
    bullets: [
      'Designed a nature-inspired UI with an earthy palette, strong visual hierarchy, and clean IA',
      'Structured intuitive navigation across product browsing, impact tracking, and community sections',
      'Applied accessible design principles — sufficient contrast ratios, legible typography throughout',
      'Created a design system with semantic tokens for consistent theming across light and dark modes',
    ],
    tech:  ['Figma', 'Accessible Design', 'IA', 'Mobile UI', 'Design Tokens'],
    demo:  'https://www.figma.com/design/f79X8TvGXpX0zqYyRMg7tB/EcoStsy?node-id=0-1&t=eUgXbWEo3TQsaByT-1',
    proto: 'https://www.figma.com/proto/f79X8TvGXpX0zqYyRMg7tB/EcoStsy?node-id=239-1431&p=f&viewport=-167%2C474%2C0.53&t=xjEtLYkRDnWyMOpo-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=3%3A4&page-id=0%3A1',
  },
  courier: {
    tag:   'Web Design · Figma',
    title: 'SwiftCourier',
    sub:   'Courier & Delivery Landing Page',
    img:   'assets/courier.jpg',
    icon:  '🚚',
    desc:  'High-impact landing page for a courier and delivery service brand. The design balances trust signals, clear service communication, and strong conversion-focused CTAs.',
    bullets: [
      'Designed high-fidelity screens using a bold orange and dark navy brand palette',
      'Structured a persuasive hero section with dual CTAs and a social proof badge',
      'Mapped out full navigation, service listing, pricing, and contact sections',
      'Ensured responsive layout structure for seamless desktop-to-mobile adaptation',
    ],
    tech:  ['Figma', 'Landing Page', 'Web UI', 'Conversion Design', 'Responsive Layout'],
    demo:  'https://www.figma.com/design/gQGq918Dj4P247pSUlU3LZ/Courier-Website-Design?node-id=1-707&t=rnFsgcDGZd3LmBYb-1',
    proto: 'https://www.figma.com/proto/gQGq918Dj4P247pSUlU3LZ/Courier-Website-Design?node-id=1-705&viewport=198%2C9%2C0.62&t=J5fnXAHclLhE58j0-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1',
  },
  picknear: {
    tag:   'Mobile UI/UX · Figma',
    title: 'PickNear',
    sub:   'Hyperlocal Pickup & Delivery App',
    icon:  '📦',
    desc:  'Location-based app connecting users with nearby stores for fast, convenient local pickup. Designed with a focus on clarity in location-aware flows.',
    bullets: [
      'Designed location-aware flows covering store discovery, order placement, and live pickup tracking',
      'Built a reusable component system for consistency across listing, cart, and order status screens',
      'Prototyped the multi-step checkout and real-time tracking journey for usability validation',
      'Mapped user journeys for multiple persona types — casual shoppers and frequent buyers',
    ],
    tech:  ['Figma', 'Location UX', 'Component System', 'Prototyping', 'Mobile UI'],
    demo:  'https://www.figma.com/design/wwH4TcYit22rPflBHlRoO9/PickNear?node-id=0-1&t=4EbixAGRAF3zNRBc-1',
    proto: 'https://www.figma.com/proto/wwH4TcYit22rPflBHlRoO9/PickNear?page-id=0%3A1&node-id=4-141&p=f&viewport=339%2C409%2C0.08&t=zOSF18IFby1BsG0X-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=4%3A141&show-proto-sidebar=1',
  },
  portfolio: {
    tag:   'Web Development · HTML/CSS/JS',
    title: 'Personal Portfolio',
    sub:   'Responsive Portfolio Website',
    icon:  '🌐',
    desc:  'Fully responsive personal portfolio website designed and developed from scratch using vanilla HTML5, CSS3, and JavaScript. Built with a mobile-first approach and clean, accessible UI.',
    bullets: [
      'Designed and built a fully responsive layout with smooth navigation and mobile-first structure',
      'Implemented dark/light mode, custom cursor, typing animation, and GSAP scroll animations',
      'Built interactive project cards with modal popups and filter functionality',
      'Wrote clean, well-commented code with CSS custom properties for easy theming',
    ],
    tech:  ['HTML5', 'CSS3', 'JavaScript', 'GSAP', 'Responsive Design'],
    github: 'https://github.com/Nafiz-75',
    demo:  '#',
  },
};

(function initModal() {
  const overlay  = $('#modalOverlay');
  const content  = $('#modalContent');
  const closeBtn = $('#modalClose');
  if (!overlay || !content) return;

  function openModal(key) {
    const data = projectData[key];
    if (!data) return;

    const imgHTML = data.img
      ? `<img src="${data.img}" alt="${data.title}" class="modal-img" onerror="this.outerHTML='<div class=\\'modal-img-placeholder\\'>${data.icon || '🎨'}</div>'">`
      : `<div class="modal-img-placeholder">${data.icon || '🎨'}</div>`;

    const bulletsHTML = data.bullets.map(b => `<li>${b}</li>`).join('');
    const techHTML    = data.tech.map(t => `<span>${t}</span>`).join('');

    const linksHTML = `
      ${data.demo && data.demo !== '#' ? `<a href="${data.demo}" target="_blank" rel="noopener" class="modal-link modal-link-primary">View Design ↗</a>` : ''}
      ${data.proto  ? `<a href="${data.proto}"  target="_blank" rel="noopener" class="modal-link modal-link-ghost">View Prototype ↗</a>` : ''}
      ${data.github ? `<a href="${data.github}" target="_blank" rel="noopener" class="modal-link modal-link-ghost">GitHub ↗</a>` : ''}
    `;

    content.innerHTML = `
      ${imgHTML}
      <div class="modal-tag">${data.tag}</div>
      <h2 class="modal-title">${data.title}</h2>
      <p class="modal-sub">${data.sub}</p>
      <p class="modal-desc">${data.desc}</p>
      <ul class="modal-bullets">${bulletsHTML}</ul>
      <div class="modal-tech">${techHTML}</div>
      <div class="modal-links">${linksHTML}</div>
    `;

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    /* GSAP entrance for modal panel */
    const modalEl = overlay.querySelector('.modal');
    if (modalEl) {
      gsap.fromTo(modalEl,
        { opacity: 0, y: 36, scale: 0.96 },
        { opacity: 1, y: 0,  scale: 1, duration: 0.42, ease: 'power3.out' }
      );
    }
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', e => {
    const btn = e.target.closest('.overlay-btn');
    if (btn) openModal(btn.dataset.project);
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
})();

/* ── Populate Card Action Links from projectData ─────────────── */
/*
  BUG FIX: All card "View Design" and "Prototype" buttons in
  index.html had href="#" as placeholders, causing a new tab to
  open with the portfolio itself. This function reads the real
  Figma / GitHub URLs from projectData and wires them up.
*/
(function populateCardLinks() {
  $$('.project-card').forEach(card => {
    const overlayBtn = card.querySelector('.overlay-btn');
    if (!overlayBtn) return;

    const key  = overlayBtn.dataset.project;
    const data = projectData[key];
    if (!data) return;

    const btns       = $$('.card-btn', card);
    const primaryBtn = btns[0];
    const ghostBtn   = btns[1];

    /* Primary: design link, or GitHub if no design link */
    if (primaryBtn) {
      const href = (data.demo && data.demo !== '#') ? data.demo : data.github;
      if (href) {
        primaryBtn.href = href;
        if (!data.demo || data.demo === '#') {
          primaryBtn.textContent = 'GitHub ↗';
        }
      }
    }

    /* Ghost: prototype link, or GitHub, or hide */
    if (ghostBtn) {
      if (data.proto) {
        ghostBtn.href = data.proto;
      } else if (data.github) {
        ghostBtn.href        = data.github;
        ghostBtn.textContent = 'GitHub ↗';
      } else {
        ghostBtn.style.display = 'none';
      }
    }
  });
})();

/* ── Dark / Light Mode ───────────────────────────────────────── */
(function initTheme() {
  const btn  = $('#themeToggle');
  const body = document.body;
  if (!btn) return;

  const saved = localStorage.getItem('nafiz-theme');
  if (saved === 'light') {
    body.classList.remove('dark-mode');
    body.classList.add('light-mode');
  }

  btn.addEventListener('click', () => {
    const isLight = body.classList.contains('light-mode');
    body.classList.toggle('dark-mode', isLight);
    body.classList.toggle('light-mode', !isLight);
    localStorage.setItem('nafiz-theme', isLight ? 'dark' : 'light');
  });
})();

/* ── Contact Form Validation ─────────────────────────────────── */
(function initContactForm() {
  const form      = $('#contactForm');
  const submitBtn = $('#submitBtn');
  const successEl = $('#formSuccess');
  if (!form) return;

  const fields = {
    name:    { el: $('#name'),    err: $('#nameError'),    validate: v => v.trim().length >= 2,                  msg: 'Please enter at least 2 characters.' },
    email:   { el: $('#email'),   err: $('#emailError'),   validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: 'Please enter a valid email address.' },
    message: { el: $('#message'), err: $('#messageError'), validate: v => v.trim().length >= 10,                 msg: 'Message must be at least 10 characters.' },
  };

  Object.values(fields).forEach(({ el, err, validate, msg }) => {
    if (!el) return;
    el.addEventListener('blur', () => {
      const valid = validate(el.value);
      el.classList.toggle('error', !valid);
      if (err) err.textContent = valid ? '' : msg;
    });
    el.addEventListener('input', () => {
      if (el.classList.contains('error') && validate(el.value)) {
        el.classList.remove('error');
        if (err) err.textContent = '';
      }
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let allValid = true;

    Object.values(fields).forEach(({ el, err, validate, msg }) => {
      if (!el) return;
      const valid = validate(el.value);
      el.classList.toggle('error', !valid);
      if (err) err.textContent = valid ? '' : msg;
      if (!valid) allValid = false;
    });

    if (!allValid) return;

    const btnText    = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    submitBtn.disabled = true;
    if (btnText)    btnText.hidden    = true;
    if (btnLoading) btnLoading.hidden = false;

    setTimeout(() => {
      submitBtn.disabled = false;
      if (btnText)    btnText.hidden    = false;
      if (btnLoading) btnLoading.hidden = true;
      if (successEl)  successEl.hidden  = false;
      form.reset();
      setTimeout(() => { if (successEl) successEl.hidden = true; }, 5000);
    }, 1600);
  });
})();

/* ── Active Nav Link on Scroll ───────────────────────────────── */
(function initActiveNav() {
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');
  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.style.color = href === current ? 'var(--emerald-light)' : '';
    });
  }, { passive: true });
})();

/* ── Pill Hover Tilt ─────────────────────────────────────────── */
(function initPillTilt() {
  $$('.pill').forEach(pill => {
    pill.addEventListener('mousemove', e => {
      const rect = pill.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 10;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 10;
      pill.style.transform = `perspective(200px) rotateX(${-y}deg) rotateY(${x}deg)`;
    });
    pill.addEventListener('mouseleave', () => { pill.style.transform = ''; });
  });
})();

/* ── Scroll Progress Bar ─────────────────────────────────────── */
(function initScrollProgress() {
  const bar = document.createElement('div');
  bar.id = 'scrollProgress';
  Object.assign(bar.style, {
    position:      'fixed',
    top:           '0',
    left:          '0',
    height:        '2px',
    width:         '0%',
    background:    'linear-gradient(90deg, var(--emerald-dark), var(--emerald-light))',
    zIndex:        '9999',
    transition:    'width 0.1s',
    pointerEvents: 'none',
  });
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
  }, { passive: true });
})();

/* ── Back To Top ─────────────────────────────────────────────── */
(function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;
  btn.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ── Project Card Tilt ───────────────────────────────────────── */
(function initCardTilt() {
  $$('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 6;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 6;
      card.style.transform = `translateY(-8px) perspective(800px) rotateX(${-y}deg) rotateY(${x}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();

console.log('%c Nafiz Imtiaz Portfolio ', 'background:#10b981;color:#fff;font-size:14px;padding:6px 12px;border-radius:4px;font-family:monospace;');
console.log('%c Powered by GSAP + ScrollTrigger ', 'color:#34d399;font-family:monospace;font-size:11px;');