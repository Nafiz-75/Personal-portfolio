document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // 🌙 THEME
  // ============================================
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  const themeToggles = document.querySelectorAll('#theme-toggle, #mobile-theme-toggle');

  const setThemeIcons = (theme) => {
    themeToggles.forEach((btn) => {
      const icon = btn.querySelector('i');
      if (!icon) return;
      icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    });
  };

  setThemeIcons(savedTheme);

  const toggleTheme = () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    setThemeIcons(next);
  };

  themeToggles.forEach((btn) => btn.addEventListener('click', toggleTheme));

  // ============================================
  // 📱 MOBILE MENU
  // ============================================
  const menuBtn  = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  const closeMobileMenu = () => {
    mobileMenu?.classList.remove('open');
    menuBtn?.classList.remove('open');
    menuBtn?.setAttribute('aria-expanded', 'false');
    mobileMenu?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  menuBtn?.addEventListener('click', () => {
    const isOpen = mobileMenu?.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      mobileMenu?.classList.add('open');
      menuBtn?.classList.add('open');
      menuBtn?.setAttribute('aria-expanded', 'true');
      mobileMenu?.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  });

  document.querySelectorAll('.m-link').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  // ============================================
  // 🔝 STICKY HEADER
  // ============================================
  const header = document.getElementById('header');
  const handleHeaderScroll = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // ============================================
  // 🎯 SCROLL REVEAL
  // ============================================
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal-up').forEach((el) => revealObserver.observe(el));

  // ============================================
  // ⬆️ BACK TO TOP
  // ============================================
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    backToTop?.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ============================================
  // 🚀 LOAD PROJECTS
  // ============================================
  const gallery = document.getElementById('project-gallery');

  // Safe text encoding to prevent XSS
  const safe = (val) => {
    const map = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#x27;' };
    return String(val ?? '').replace(/[<>&"']/g, (c) => map[c] || c);
  };

  function loadProjects() {
    if (!gallery) return;

    try {
      const projects = [
        {
          title: "RITHOS",
          category: "UI/UX Design",
          short: "End-to-end product design covering UX research, high-fidelity UI, and an interactive prototype built entirely in Figma.",
          description: "RITHOS is a complete product design project — from early UX flows and information architecture through to a polished, high-fidelity design system and interactive prototype. Every screen was crafted with a focus on intuitive navigation, visual hierarchy, and a cohesive component library.",
          mediaSrc: "https://placehold.co/1200x800/0F1117/C8FF60?text=RITHOS",
          tags: ["Figma", "UI Design", "UX Research", "Prototyping", "Design System"],
          tools: ["Figma", "FigJam"],
          figmaDesign: "https://www.figma.com/design/bITsq4ke22CeKo6vpQV2rJ/RITHOS?node-id=0-1&t=N2Ig1bhk44gHaaPc-1",
          figmaPrototype: "https://www.figma.com/proto/bITsq4ke22CeKo6vpQV2rJ/RITHOS?node-id=1-3150&p=f&viewport=-45%2C298%2C0.02&t=iCz2gBVHJl8gSLDS-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=1%3A3150&show-proto-sidebar=1&page-id=0%3A1",
          featured: true
        },
        {
          title: "AURUM STAYS",
          category: "UI/UX Design",
          short: "Luxury stay booking platform with a focus on premium user experience and seamless navigation.",
          description: "AURUM STAYS is a premium accommodation booking platform designed with a modern UI approach. The project focuses on clean layouts, intuitive booking flow, and an elegant visual hierarchy to enhance user trust and engagement.",
          mediaSrc: "https://placehold.co/1200x800/0F1117/F59E0B?text=AURUM+STAYS",
          tags: ["Figma", "UI Design", "UX Design", "Prototyping"],
          tools: ["Figma"],
          figmaDesign: "https://www.figma.com/design/jWjGBdXpdPanlW2mmAd2Ei/AURUM-STAYS?node-id=0-1&t=CSfHYBFJge17P80J-1",
          figmaPrototype: "https://www.figma.com/proto/jWjGBdXpdPanlW2mmAd2Ei/AURUM-STAYS?node-id=1-697&p=f&viewport=-2511%2C-2072%2C0.21&t=AB2sKpdfDK5yg9N0-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=1%3A682&page-id=0%3A1"
        },
        {
          title: "EcoStsy",
          category: "UI/UX Design",
          short: "Eco-friendly product marketplace promoting sustainable shopping habits.",
          description: "EcoStsy is a sustainability-focused e-commerce platform designed to promote eco-friendly products. The design emphasizes clarity, accessibility, and a green-themed visual identity that aligns with environmental values.",
          mediaSrc: "https://placehold.co/1200x800/0F1117/10B981?text=EcoStsy",
          tags: ["Figma", "UI Design", "UX Design", "Sustainability"],
          tools: ["Figma"],
          figmaDesign: "https://www.figma.com/design/f79X8TvGXpX0zqYyRMg7tB/EcoStsy?node-id=0-1&t=eUgXbWEo3TQsaByT-1",
          figmaPrototype: "https://www.figma.com/proto/f79X8TvGXpX0zqYyRMg7tB/EcoStsy?node-id=239-1431&p=f&viewport=-167%2C474%2C0.53&t=xjEtLYkRDnWyMOpo-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=3%3A4&page-id=0%3A1"
        },
        {
          title: "PickNear",
          category: "UI/UX Design",
          short: "A location-based app for discovering nearby products quickly and efficiently.",
          description: "PickNear is a smart product discovery app that helps users find nearby items in real-time. The design focuses on usability, fast navigation, and location-based interaction to improve convenience and decision-making.",
          mediaSrc: "https://placehold.co/1200x800/0F1117/3B82F6?text=PickNear",
          tags: ["Figma", "UI Design", "UX Design", "Location-Based App"],
          tools: ["Figma"],
          figmaDesign: "https://www.figma.com/design/wwH4TcYit22rPflBHlRoO9/PickNear?node-id=0-1&t=4EbixAGRAF3zNRBc-1",
          figmaPrototype: "https://www.figma.com/proto/wwH4TcYit22rPflBHlRoO9/PickNear?page-id=0%3A1&node-id=4-141&p=f&viewport=339%2C409%2C0.08&t=zOSF18IFby1BsG0X-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=4%3A141&show-proto-sidebar=1"
        },
        {
          title: "Image Compression via Graph Signal Processing",
          category: "Research · Thesis",
          short: "Compared Grid-Based, Patch-Based, and SLIC graph approaches for efficient image representation.",
          description: "Thesis research comparing three graph-based image compression approaches — Grid-Based, Patch-Based, and Superpixel-Based (SLIC) — using shared evaluation metrics. Built with Python, NumPy, and graph signal processing libraries.",
          mediaSrc: "https://placehold.co/1200x800/0F1117/6366f1?text=Thesis+Research",
          tags: ["Python", "Graph Signal Processing", "Research", "NumPy"],
          tools: ["Python", "NumPy", "SciPy"],
          github: "https://github.com/Nafiz-75"
        }
      ];

      projects.forEach((project) => {
        const card = document.createElement('div');
        const classes = ['proj-card', 'reveal-up'];
        if (project.featured)    classes.push('featured');
        if (project.comingSoon)  classes.push('coming-soon');
        card.className = classes.join(' ');

        const imgSrc = project.mediaSrc || 'https://placehold.co/1200x800/111117/3F3F46?text=Project';
        const tags   = Array.isArray(project.tags) ? project.tags : [];

        card.innerHTML = `
          ${project.featured ? '<span class="feat-badge">Featured</span>' : ''}
          <div class="card-img-wrap">
            <img class="card-img"
                 src="${safe(imgSrc)}"
                 alt="${safe(project.title)}"
                 loading="lazy" />
            <div class="card-overlay">
              <div class="view-btn">
                <i class="fas fa-arrow-right"></i>
              </div>
            </div>
          </div>
          <div class="card-body">
            <span class="card-cat">${safe(project.category)}</span>
            <h3>${safe(project.title)}</h3>
            <p class="card-excerpt">${safe(project.short || '')}</p>
            <div class="card-tags">
              ${tags.slice(0, 5).map((t) => `<span class="tag">${safe(t)}</span>`).join('')}
            </div>
          </div>
        `;

        if (!project.comingSoon) {
          card.addEventListener('click', () => openModal(project));
        }

        gallery.appendChild(card);
      });

      // Observe newly added cards
      gallery.querySelectorAll('.reveal-up').forEach((el) => revealObserver.observe(el));

    } catch (err) {
      console.error('Failed to render projects:', err);
    }
  }

  loadProjects();

  // ============================================
  // 🪟 PROJECT MODAL
  // ============================================
  const modal         = document.getElementById('project-modal');
  const modalBackdrop = modal?.querySelector('.modal-backdrop');
  const modalClose    = modal?.querySelector('.modal-close');

  const modalTitle      = document.getElementById('modal-title');
  const modalCat        = document.getElementById('modal-category');
  const modalImage      = document.getElementById('modal-image');
  const modalDesc       = document.getElementById('modal-description');
  const modalFigmaDesign = document.getElementById('modal-figma-design');
  const modalFigmaProto  = document.getElementById('modal-figma-proto');
  const modalGithub      = document.getElementById('modal-github');
  const modalLink        = document.getElementById('modal-link');

  const showEl  = (el, href) => { if (el) { el.href = href; el.style.display = 'inline-flex'; } };
  const hideEl  = (el)       => { if (el) el.style.display = 'none'; };

  function openModal(project) {
    if (!modal) return;

    if (modalTitle) modalTitle.textContent   = project.title    || '';
    if (modalCat)   modalCat.textContent     = project.category || '';

    if (modalImage) {
      modalImage.src = project.mediaSrc || '';
      modalImage.alt = project.title    || '';
    }

    if (modalDesc) {
      let html = `<p>${safe(project.description || '')}</p>`;
      if (Array.isArray(project.tools) && project.tools.length) {
        html += `<p style="margin-top:.85rem;color:var(--muted)">
          <strong style="color:var(--text)">Tools:</strong>
          ${project.tools.map(safe).join(', ')}
        </p>`;
      }
      modalDesc.innerHTML = html;
    }

    // Buttons
    project.figmaDesign  ? showEl(modalFigmaDesign, project.figmaDesign)   : hideEl(modalFigmaDesign);
    project.figmaPrototype? showEl(modalFigmaProto,  project.figmaPrototype): hideEl(modalFigmaProto);
    project.github       ? showEl(modalGithub, project.github)              : hideEl(modalGithub);
    project.link         ? showEl(modalLink,   project.link)                : hideEl(modalLink);

    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalClose?.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  modalClose?.addEventListener('click', closeModal);
  modalBackdrop?.addEventListener('click', closeModal);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('show')) closeModal();
  });

  // ============================================
  // ✉️ CONTACT FORM
  // ============================================
  const contactForm = document.getElementById('contact-form');
  const formMsg     = document.getElementById('form-message');

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());

  function showFormMsg(text, type) {
    if (!formMsg) return;
    formMsg.textContent = text;
    formMsg.className   = 'form-msg ' + type;
    setTimeout(() => { formMsg.className = 'form-msg'; }, 5000);
  }

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name  = document.getElementById('name')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const msg   = document.getElementById('message')?.value.trim();

    if (!name || !email || !msg) {
      return showFormMsg('Please fill in all fields.', 'error');
    }
    if (!isValidEmail(email)) {
      return showFormMsg('Please enter a valid email address.', 'error');
    }

    const submitBtn = contactForm.querySelector('.btn-primary');
    const originalHTML = submitBtn?.innerHTML;

    if (submitBtn) {
      submitBtn.innerHTML  = 'Sending… <i class="fas fa-spinner fa-spin"></i>';
      submitBtn.disabled   = true;
    }

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.innerHTML  = originalHTML;
        submitBtn.disabled   = false;
      }
      showFormMsg(
        'Thanks! Please email me directly at nafiz5627@gmail.com so I can reply quickly.',
        'success'
      );
      contactForm.reset();
    }, 1200);
  });

});