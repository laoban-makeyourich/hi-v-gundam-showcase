(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reveal on scroll — transform / opacity only, for smoothness.
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      }
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
  }

  // Scroll progress + hero parallax + nav hide, batched in one rAF loop.
  const progressBar = document.getElementById('progressBar');
  const heroImg = document.getElementById('heroImg');
  const nav = document.querySelector('.nav');
  const explodedWrap = document.querySelector('.exploded-wrap');
  const explodedImg = document.getElementById('explodedImg');
  const explodedMeter = document.getElementById('explodedMeter');
  const xCards = document.querySelectorAll('.x-card');
  let ticking = false;
  let lastY = 0;

  function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

  function onScroll() {
    const y = window.scrollY || 0;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) progressBar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

    if (nav) {
      if (y > 140 && y > lastY + 4) nav.classList.add('hide');
      else if (y < lastY - 4 || y < 140) nav.classList.remove('hide');
    }
    lastY = y;

    if (!reduceMotion && heroImg && y < window.innerHeight * 1.2) {
      heroImg.style.transform = `scale(1.06) translateY(${y * 0.06}px)`;
    }

    if (explodedWrap && explodedImg) {
      const rect = explodedWrap.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = clamp(-rect.top / Math.max(total, 1), 0, 1);
      const eased = p * p * (3 - 2 * p); // smoothstep
      explodedWrap.style.setProperty('--explode-p', p.toFixed(3));
      explodedImg.style.setProperty('--explode-scale', (0.92 + eased * 0.12).toFixed(3));
      explodedImg.style.setProperty('--explode-rot', ((eased - 0.5) * 2).toFixed(2) + 'deg');
      if (explodedMeter) explodedMeter.style.setProperty('--explode-p', p.toFixed(3));
      xCards.forEach((card, i) => {
        const start = i * 0.22;
        const op = clamp((p - start) / 0.3, 0.25, 1);
        card.style.setProperty('--card-op', op.toFixed(2));
      });
    }
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScroll);
    }
  }
  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick);
  onScroll();

  // Mobile menu
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const open = mobileMenu.hidden;
      mobileMenu.hidden = !open;
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.textContent = open ? 'Đóng' : 'Menu';
    });
    mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
      mobileMenu.hidden = true;
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.textContent = 'Menu';
    }));
  }
})();
