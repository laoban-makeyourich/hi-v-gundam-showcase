(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const smooth = (t) => t * t * (3 - 2 * t);
  // Đoạn chuyển: p 0->1 trong [a,b], ra 0->1 đã làm mượt.
  const seg = (p, a, b) => smooth(clamp((p - a) / (b - a), 0, 1));

  // Reveal on scroll — transform / opacity only.
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

  const progressBar = document.getElementById('progressBar');
  const heroImg = document.getElementById('heroImg');
  const detailImg = document.getElementById('detailImg');
  const nav = document.querySelector('.nav');
  const assemblyWrap = document.querySelector('.assembly-wrap');
  const assemblyStage = document.getElementById('assemblyStage');
  const explodedImg = document.querySelector('.stage-exploded');
  const standingImg = document.querySelector('.stage-standing');
  const actionImg = document.querySelector('.stage-action');
  const chips = document.querySelectorAll('.chip');
  const steps = document.querySelectorAll('.step');
  const assemblyMeter = document.getElementById('assemblyMeter');
  const stageKicker = document.getElementById('stageKicker');
  const stageTitle = document.getElementById('stageTitle');
  const stageTexts = [
    ['02 — Tách rời', 'Các bộ phận<br>đang tách rời.'],
    ['02 — Lắp ráp', 'Đang lắp ráp<br>thành dáng đứng.'],
    ['03 — Đổi tư thế', 'Bung funnel.<br>Đổi tư thế bay.'],
  ];
  let currentStage = -1;
  let ticking = false;

  function setStage(i) {
    if (i === currentStage) return;
    currentStage = i;
    if (stageKicker) stageKicker.textContent = stageTexts[i][0];
    if (stageTitle) stageTitle.innerHTML = stageTexts[i][1];
    steps.forEach((s, j) => s.classList.toggle('is-active', j === i));
  }

  function onScroll() {
    const y = window.scrollY || 0;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) progressBar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    if (nav) nav.classList.toggle('scrolled', y > 24);

    if (!reduceMotion && heroImg && y < window.innerHeight * 1.2) {
      heroImg.style.transform = `scale(1.06) translateY(${y * 0.06}px)`;
    }
    if (!reduceMotion && detailImg) {
      const r = detailImg.getBoundingClientRect();
      const rel = clamp(1 - r.top / window.innerHeight, 0, 1);
      detailImg.style.transform = `scale(${1 + rel * 0.05}) translateY(${(1 - rel) * 14}px)`;
    }

    if (assemblyWrap && assemblyStage) {
      const rect = assemblyWrap.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = clamp(-rect.top / Math.max(total, 1), 0, 1);

      // Giai đoạn 1: tách rời -> lắp ráp (p 0 -> 0.55)
      const assemble = seg(p, 0.05, 0.55);
      // Giai đoạn 2: dáng đứng -> tư thế bay (p 0.55 -> 0.95)
      const pose = seg(p, 0.55, 0.95);

      if (explodedImg) {
        const op = 1 - seg(p, 0.30, 0.52);
        explodedImg.style.opacity = op.toFixed(3);
        explodedImg.style.transform = `scale(${(0.94 + assemble * 0.10).toFixed(3)}) translateY(${((1 - assemble) * -18).toFixed(1)}px)`;
      }
      if (standingImg) {
        const op = seg(p, 0.30, 0.50) * (1 - seg(p, 0.62, 0.82));
        standingImg.style.opacity = op.toFixed(3);
        standingImg.style.transform = `scale(${(0.92 + assemble * 0.08).toFixed(3)}) translateY(${((1 - assemble) * 24).toFixed(1)}px)`;
      }
      if (actionImg) {
        const op = seg(p, 0.62, 0.84);
        actionImg.style.opacity = op.toFixed(3);
        // Đổi tư thế: nghiêng dần + phóng to nhẹ + trượt lên khi pose tăng.
        actionImg.style.transform = `scale(${(1.02 + pose * 0.06).toFixed(3)}) rotate(${(-4 * pose).toFixed(2)}deg) translateY(${((1 - pose) * 22).toFixed(1)}px)`;
      }
      // Chip bộ phận: ở ngoài khi tách rời, thu vào và mờ dần khi lắp xong.
      chips.forEach((chip) => {
        const tx = parseFloat(chip.style.getPropertyValue('--tx')) || 0;
        const ty = parseFloat(chip.style.getPropertyValue('--ty')) || 0;
        const spread = 1 - assemble;
        chip.style.transform = `translate(-50%,-50%) translate(${(tx * spread).toFixed(1)}px, ${(ty * spread).toFixed(1)}px) scale(${(0.7 + assemble * 0.3).toFixed(2)})`;
        chip.style.opacity = (1 - seg(p, 0.42, 0.58)).toFixed(2);
      });

      if (assemblyMeter) assemblyMeter.style.transform = `scaleX(${p.toFixed(3)})`;
      assemblyStage.style.setProperty('--assemble', assemble.toFixed(3));
      setStage(p < 0.38 ? 0 : p < 0.68 ? 1 : 2);
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
  setStage(0);

  // Mobile menu — hidden attribute được CSS tôn trọng (xem .mobile-menu[hidden]).
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
