/* ============================================================
   NESTLÉ - Good food, Good life | script.js
   Fonctionnalités : Mode sombre, Slider, Scroll animations,
   Barre de progression, Recherche live, Back to top, Nav active
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════════════════════════════
     1. MODE SOMBRE (Dark Mode)
  ══════════════════════════════════════════════════════ */
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;

  // Restaurer la préférence sauvegardée
  const savedTheme = localStorage.getItem('nestle-theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    updateToggleText(true);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = body.classList.toggle('dark-mode');
      localStorage.setItem('nestle-theme', isDark ? 'dark' : 'light');
      updateToggleText(isDark);

      // Petite animation du bouton
      themeToggle.style.transform = 'scale(0.92)';
      setTimeout(() => themeToggle.style.transform = '', 200);
    });
  }

  function updateToggleText(isDark) {
    if (!themeToggle) return;
    themeToggle.innerHTML = isDark
      ? '☀️ Mode Clair'
      : '🌙 Mode Sombre';
  }


  /* ══════════════════════════════════════════════════════
     2. HEADER - Scroll Shadow Effect
  ══════════════════════════════════════════════════════ */
  const header = document.querySelector('.main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }


  /* ══════════════════════════════════════════════════════
     3. BARRE DE PROGRESSION DE LECTURE
  ══════════════════════════════════════════════════════ */
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 3px; width: 0%;
    background: linear-gradient(90deg, #e2001a, #ff6b6b, #e2001a);
    background-size: 200% 100%;
    z-index: 9999; transition: width 0.1s linear;
    animation: shimmer 2s linear infinite;
  `;
  const style = document.createElement('style');
  style.textContent = `@keyframes shimmer { 0%{background-position:200%} 100%{background-position:-200%} }`;
  document.head.appendChild(style);
  document.body.prepend(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }, { passive: true });


  /* ══════════════════════════════════════════════════════
     4. BACK TO TOP BUTTON
  ══════════════════════════════════════════════════════ */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ══════════════════════════════════════════════════════
     5. NAVIGATION - Lien actif selon la page courante
  ══════════════════════════════════════════════════════ */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });


  /* ══════════════════════════════════════════════════════
     6. RECHERCHE LIVE
  ══════════════════════════════════════════════════════ */
  const searchInput = document.querySelector('.search-container input');
  if (searchInput) {
    // Créer le panel de résultats
    const searchPanel = document.createElement('div');
    searchPanel.style.cssText = `
      position: absolute; top: 100%; right: 0; width: 320px;
      background: white; border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.15);
      padding: 12px; display: none; z-index: 500;
      border: 1px solid rgba(0,0,0,0.08); max-height: 380px; overflow-y: auto;
    `;
    const searchContainer = document.querySelector('.search-container');
    searchContainer.style.position = 'relative';
    searchContainer.appendChild(searchPanel);

    // Pages du site pour la recherche
    const pages = [
      { title: '🏠 Accueil', href: 'index.html', desc: 'Page principale Nestlé' },
      { title: '🛍️ Nos Produits', href: 'produits.html', desc: 'Nescafé, KitKat, Maggi, Purina...' },
      { title: '📖 Nos Histoires', href: 'histoire.html', desc: 'Nutrition, Science, Durabilité' },
      { title: '🥗 Nutrition', href: 'nutrition.html', desc: 'Régimes équilibrés & santé' },
      { title: '💼 Carrières', href: 'carriere.html', desc: 'Rejoindre l\'équipe Nestlé' },
      { title: '📬 Contact', href: 'contact.html', desc: 'Nous contacter' },
    ];

    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase().trim();
      if (q.length < 2) { searchPanel.style.display = 'none'; return; }

      const results = pages.filter(p =>
        p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
      );

      if (results.length === 0) {
        searchPanel.innerHTML = `<p style="padding:12px;color:#999;font-size:.85rem;">Aucun résultat pour "${q}"</p>`;
      } else {
        searchPanel.innerHTML = results.map(r => `
          <a href="${r.href}" style="
            display:flex; flex-direction:column; padding:12px 14px; border-radius:8px;
            text-decoration:none; color:#1a1a1a; transition:background .2s; gap:3px;
          " onmouseover="this.style.background='#fff5f5'" onmouseout="this.style.background='transparent'">
            <span style="font-weight:700;font-size:.88rem">${r.title}</span>
            <span style="font-size:.78rem;color:#888">${r.desc}</span>
          </a>
        `).join('');
      }
      searchPanel.style.display = 'block';
    });

    // Fermer si on clique ailleurs
    document.addEventListener('click', e => {
      if (!searchContainer.contains(e.target)) searchPanel.style.display = 'none';
    });

    // Touche Escape
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Escape') { searchPanel.style.display = 'none'; searchInput.blur(); }
    });
  }


  /* ══════════════════════════════════════════════════════
     7. ANIMATIONS AU SCROLL (Intersection Observer)
  ══════════════════════════════════════════════════════ */
  // Ajouter les classes reveal automatiquement
  const animatableSelectors = [
    '.service-card', '.detailed-card', '.brand-item',
    '.news-item', '.expert-card', '.theme-card',
    '.chart-card', '.odd-box', '.approach-item',
    '.story-panel', '.nutrition-intro', '.stats-container h2',
    '.products-main-title', '.brands-section h2'
  ];

  animatableSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
        el.style.transitionDelay = (i % 6) * 0.07 + 's';
      }
    });
  });

  // Panels histoire en reveal alterné
  document.querySelectorAll('.story-panel').forEach((el, i) => {
    el.classList.add(i % 2 === 0 ? 'reveal-left' : 'reveal-right');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });


  /* ══════════════════════════════════════════════════════
     8. ANIMATION DES BARRES DE STATISTIQUES
  ══════════════════════════════════════════════════════ */
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bars = entry.target.querySelectorAll('.bar');
        bars.forEach((bar, i) => {
          const targetWidth = bar.style.width;
          bar.style.width = '0%';
          setTimeout(() => {
            bar.style.width = targetWidth;
          }, 200 + i * 120);
        });
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.charts-grid').forEach(el => barObserver.observe(el));


  /* ══════════════════════════════════════════════════════
     9. COMPTEUR ANIMÉ pour les chiffres ODD
  ══════════════════════════════════════════════════════ */
  const oddGrid = document.querySelector('.odd-grid');
  if (oddGrid) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.odd-box span').forEach(span => {
            const target = parseInt(span.textContent);
            if (!isNaN(target)) animateCounter(span, target);
          });
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    countObserver.observe(oddGrid);
  }

  function animateCounter(el, target) {
    let current = 0;
    const duration = 1000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.round(current);
    }, 16);
  }


  /* ══════════════════════════════════════════════════════
     10. SLIDER AUTO-PLAY (Hero Slider)
  ══════════════════════════════════════════════════════ */
  const slides = document.querySelectorAll('input[name="slider"]');
  if (slides.length > 0) {
    let current = 0;
    const autoSlide = setInterval(() => {
      current = (current + 1) % slides.length;
      slides[current].checked = true;
    }, 5500);

    // Pause on hover
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
      heroSlider.addEventListener('mouseenter', () => clearInterval(autoSlide));
    }

    // Indicateurs de points
    const dotsContainer = document.createElement('div');
    dotsContainer.style.cssText = `
      position: absolute; bottom: 24px; left: 50%;
      transform: translateX(-50%); display: flex; gap: 10px; z-index: 20;
    `;
    slides.forEach((slide, i) => {
      const dot = document.createElement('label');
      dot.setAttribute('for', slide.id);
      dot.style.cssText = `
        width: 10px; height: 10px; border-radius: 50%;
        background: rgba(255,255,255,0.45); cursor: pointer;
        transition: all 0.3s ease; display: block;
        border: 2px solid rgba(255,255,255,0.6);
      `;
      dot.addEventListener('mouseenter', () => dot.style.background = 'white');
      dot.addEventListener('mouseleave', () => {
        if (!slides[i].checked) dot.style.background = 'rgba(255,255,255,0.45)';
      });
      dotsContainer.appendChild(dot);
    });

    if (heroSlider) {
      heroSlider.appendChild(dotsContainer);

      // Mettre à jour le dot actif
      slides.forEach((slide, i) => {
        slide.addEventListener('change', () => {
          dotsContainer.querySelectorAll('label').forEach((dot, j) => {
            dot.style.background = j === i ? 'white' : 'rgba(255,255,255,0.45)';
            dot.style.transform = j === i ? 'scale(1.3)' : 'scale(1)';
          });
        });
      });

      // Activer le premier dot
      if (dotsContainer.children[0]) {
        dotsContainer.children[0].style.background = 'white';
        dotsContainer.children[0].style.transform = 'scale(1.3)';
      }
    }
  }


  /* ══════════════════════════════════════════════════════
     11. HOVER RIPPLE sur les boutons
  ══════════════════════════════════════════════════════ */
  document.querySelectorAll('.nestle-btn, .btn-contact, .btn-brands, .read-more, .btn-banner-link').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height) * 2;
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px; height: ${size}px;
        left: ${e.clientX - rect.left - size/2}px;
        top: ${e.clientY - rect.top - size/2}px;
        background: rgba(255,255,255,0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleAnim 0.6s linear;
        pointer-events: none;
      `;
      if (!document.getElementById('ripple-style')) {
        const rs = document.createElement('style');
        rs.id = 'ripple-style';
        rs.textContent = `@keyframes rippleAnim { to { transform: scale(1); opacity: 0; } }`;
        document.head.appendChild(rs);
      }
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 620);
    });
  });


  /* ══════════════════════════════════════════════════════
     12. TOOLTIP sur les cartes marques
  ══════════════════════════════════════════════════════ */
  document.querySelectorAll('.brand-item').forEach(item => {
    const img = item.querySelector('img');
    if (!img) return;
    const brandName = img.getAttribute('alt') || '';

    item.style.position = 'relative';
    const tooltip = document.createElement('div');
    tooltip.textContent = brandName;
    tooltip.style.cssText = `
      position: absolute; bottom: calc(100% + 8px); left: 50%;
      transform: translateX(-50%); background: #1a1a1a; color: white;
      padding: 5px 12px; border-radius: 6px; font-size: .75rem;
      white-space: nowrap; pointer-events: none;
      opacity: 0; transition: opacity .2s; z-index: 10;
    `;
    item.appendChild(tooltip);
    item.addEventListener('mouseenter', () => tooltip.style.opacity = '1');
    item.addEventListener('mouseleave', () => tooltip.style.opacity = '0');
  });


  /* ══════════════════════════════════════════════════════
     13. LAZY LOADING des images
  ══════════════════════════════════════════════════════ */
  const lazyImages = document.querySelectorAll('img:not([loading])');
  lazyImages.forEach(img => {
    img.setAttribute('loading', 'lazy');
  });


  /* ══════════════════════════════════════════════════════
     14. NOTIFICATION de bienvenue (première visite)
  ══════════════════════════════════════════════════════ */
  if (!sessionStorage.getItem('nestle-visited')) {
    sessionStorage.setItem('nestle-visited', '1');
    setTimeout(() => {
      const toast = document.createElement('div');
      toast.style.cssText = `
        position: fixed; bottom: 100px; right: 32px; z-index: 1000;
        background: white; border-left: 4px solid #e2001a;
        border-radius: 10px; padding: 16px 20px; max-width: 280px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.15);
        transform: translateX(120%); transition: transform 0.4s ease;
        font-size: .875rem; color: #333; line-height: 1.5;
      `;
      toast.innerHTML = `
        <strong style="color:#e2001a;">🍫 Bienvenue chez Nestlé !</strong><br>
        Bonne food, Good life — explorez notre univers.
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.style.transform = 'translateX(0)', 100);
      setTimeout(() => {
        toast.style.transform = 'translateX(120%)';
        setTimeout(() => toast.remove(), 400);
      }, 4500);
    }, 1500);
  }


  /* ══════════════════════════════════════════════════════
     15. SMOOTH SCROLL pour les liens internes
  ══════════════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerH = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ══════════════════════════════════════════════════════
     16. EFFET PARALLAXE léger sur le hero
  ══════════════════════════════════════════════════════ */
  const heroSlider = document.querySelector('.hero-slider');
  if (heroSlider) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroSlider.style.backgroundPositionY = (y * 0.3) + 'px';
    }, { passive: true });
  }


  /* ══════════════════════════════════════════════════════
     17. FILTRE PRODUITS (page produits)
  ══════════════════════════════════════════════════════ */
  const productsGrid = document.querySelector('.products-detailed-grid');
  if (productsGrid) {
    // Créer les boutons de filtre
    const categories = ['Tous', 'Café', 'Chocolat', 'Nutrition', 'Boissons', 'Eau'];
    const filterBar = document.createElement('div');
    filterBar.style.cssText = `
      display: flex; flex-wrap: wrap; gap: 10px;
      justify-content: center; margin-bottom: 36px;
    `;

    categories.forEach((cat, i) => {
      const btn = document.createElement('button');
      btn.textContent = cat;
      btn.style.cssText = `
        padding: 8px 20px; border-radius: 50px; font-size: .82rem;
        font-weight: 600; cursor: pointer; transition: all .25s;
        border: 2px solid ${i === 0 ? '#e2001a' : '#ddd'};
        background: ${i === 0 ? '#e2001a' : 'white'};
        color: ${i === 0 ? 'white' : '#555'};
        font-family: 'DM Sans', sans-serif;
      `;
      btn.addEventListener('click', () => {
        filterBar.querySelectorAll('button').forEach(b => {
          b.style.background = 'white'; b.style.color = '#555'; b.style.borderColor = '#ddd';
        });
        btn.style.background = '#e2001a'; btn.style.color = 'white'; btn.style.borderColor = '#e2001a';
      });
      filterBar.appendChild(btn);
    });

    productsGrid.parentNode.insertBefore(filterBar, productsGrid);
  }

  console.log('✅ Nestlé script.js chargé — Toutes les fonctionnalités actives !');
});
// ── Subject Tabs ──
    document.querySelectorAll('.subject-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.subject-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('selectedSubject').value = tab.dataset.val;
      });
    });

    // ── Char Counter ──
    const msgInput = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    msgInput.addEventListener('input', () => {
      const len = msgInput.value.length;
      charCount.textContent = len + ' / 500';
      charCount.className = 'char-count' + (len > 450 ? ' danger' : len > 350 ? ' warn' : '');
      if (len > 500) msgInput.value = msgInput.value.slice(0, 500);
    });

    // ── File Upload ──
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const filePreview = document.getElementById('filePreview');
    let uploadedFiles = [];

    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', e => {
      e.preventDefault(); dropZone.classList.remove('dragover');
      handleFiles(e.dataTransfer.files);
    });
    fileInput.addEventListener('change', () => handleFiles(fileInput.files));

    function handleFiles(files) {
      [...files].forEach(file => {
        if (file.size > 5 * 1024 * 1024) { alert(`${file.name} dépasse 5MB`); return; }
        uploadedFiles.push(file);
        const tag = document.createElement('div');
        tag.className = 'file-tag';
        tag.innerHTML = `📄 ${file.name} <button onclick="removeFile(this,'${file.name}')">×</button>`;
        filePreview.appendChild(tag);
      });
    }
    function removeFile(btn, name) {
      uploadedFiles = uploadedFiles.filter(f => f.name !== name);
      btn.parentElement.remove();
    }

    // ── Form Validation & Submit ──
    const form = document.getElementById('contactForm');

    function showError(id, errId, show) {
      const el = document.getElementById(id);
      const err = document.getElementById(errId);
      if (show) {
        el.classList.add('error'); el.classList.remove('success');
        if (err) err.classList.add('show');
      } else {
        el.classList.remove('error'); el.classList.add('success');
        if (err) err.classList.remove('show');
      }
    }

    function validateField(id, condition, errId) {
      const val = document.getElementById(id).value.trim();
      const invalid = !condition(val);
      showError(id, errId, invalid);
      return !invalid;
    }

    // Live validation
    ['firstName','lastName','email','message'].forEach(id => {
      document.getElementById(id).addEventListener('blur', () => {
        if (id === 'email') validateField('email', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'emailErr');
        else if (id === 'message') validateField('message', v => v.length >= 20, 'messageErr');
        else validateField(id, v => v.length > 0, id + 'Err');
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const v1 = validateField('firstName', v => v.length > 0, 'firstNameErr');
      const v2 = validateField('lastName',  v => v.length > 0, 'lastNameErr');
      const v3 = validateField('email', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'emailErr');
      const v4 = validateField('message', v => v.length >= 20, 'messageErr');
      const consent = document.getElementById('consent');
      const v5 = consent.checked;
      document.getElementById('consentErr').classList.toggle('show', !v5);

      if (!v1 || !v2 || !v3 || !v4 || !v5) {
        // Scroll to first error
        document.querySelector('.error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // Loading state
      const btn = document.getElementById('submitBtn');
      btn.classList.add('loading');
      btn.disabled = true;

      // Simulate API call
      await new Promise(r => setTimeout(r, 2000));

      // Show success
      document.getElementById('formContent').style.display = 'none';
      document.getElementById('successMsg').classList.add('show');
      btn.classList.remove('loading');
      btn.disabled = false;
    });

    function resetForm() {
      form.reset();
      uploadedFiles = [];
      filePreview.innerHTML = '';
      charCount.textContent = '0 / 500';
      document.querySelectorAll('.error, .success').forEach(el => el.classList.remove('error','success'));
      document.querySelectorAll('.error-msg').forEach(el => el.classList.remove('show'));
      document.getElementById('formContent').style.display = 'block';
      document.getElementById('successMsg').classList.remove('show');
      document.querySelectorAll('.subject-tab').forEach((t,i) => t.classList.toggle('active', i===0));
    }

    // ── FAQ Accordion ──
    document.querySelectorAll('.faq-question').forEach(q => {
      q.addEventListener('click', () => {
        const item = q.parentElement;
        const wasOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!wasOpen) item.classList.add('open');
      });
    });
    // ── WhatsApp bubble toggle ──
    const waBtn = document.getElementById('waBtn');
    const waBubble = document.getElementById('waBubble');
    let bubbleShown = false;

    // Afficher bulle automatiquement après 3s
    setTimeout(() => {
      waBubble.classList.add('show');
      bubbleShown = true;
      setTimeout(() => {
        if (bubbleShown) waBubble.classList.remove('show');
      }, 5000);
    }, 3000);

    waBtn.addEventListener('mouseenter', () => {
      waBubble.classList.add('show');
    });
    waBtn.addEventListener('mouseleave', () => {
      setTimeout(() => waBubble.classList.remove('show'), 1500);
    });

    // ── Recherche emploi simulée ──
    function searchJobs() {
      const keyword = document.getElementById('jobKeyword').value.trim();
      const country = document.getElementById('jobCountry').value;
      const results = document.getElementById('jobResults');
      const text = document.getElementById('jobResultText');

      if (!keyword && !country) {
        text.innerHTML = '⚠️ Veuillez entrer un mot-clé ou sélectionner un pays.';
        results.style.display = 'block';
        return;
      }

      // Offres simulées
      const jobs = [
        { title: 'Chef de projet Marketing', lieu: 'Dakar, Sénégal', type: 'CDI' },
        { title: 'Ingénieur Qualité', lieu: 'Paris, France', type: 'CDI' },
        { title: 'Stagiaire Communication', lieu: 'Casablanca, Maroc', type: 'Stage' },
        { title: 'Responsable Supply Chain', lieu: 'Abidjan, Côte d\'Ivoire', type: 'CDI' },
        { title: 'Data Analyst', lieu: 'Vevey, Suisse', type: 'CDI' },
      ].filter(j =>
        (!keyword || j.title.toLowerCase().includes(keyword.toLowerCase())) &&
        (!country || j.lieu.includes(country))
      );

      if (jobs.length === 0) {
        text.innerHTML = `🔍 Aucune offre trouvée pour "<strong>${keyword || country}</strong>". 
          <a href="https://www.nestle.com/jobs" target="_blank" 
             style="color:#ffb3c1;font-weight:700">Voir toutes les offres ↗</a>`;
      } else {
        text.innerHTML = `✅ <strong>${jobs.length} offre(s) trouvée(s)</strong><br><br>` +
          jobs.map(j => `• <strong>${j.title}</strong> — ${j.lieu} (${j.type})`).join('<br>');
      }
      results.style.display = 'block';
    }

    function clearSearch() {
      document.getElementById('jobKeyword').value = '';
      document.getElementById('jobCountry').value = '';
      document.getElementById('jobResults').style.display = 'none';
    }

    // Enter key search
    document.getElementById('jobKeyword').addEventListener('keydown', e => {
      if (e.key === 'Enter') searchJobs();
    });