/* ============================================================================
   Opus Studio — animations cinéma 2026
   GSAP 3.13 + ScrollTrigger + SplitText (chargés via CDN dans chaque page)
   PAS de Lenis (bug iOS 17+ confirmé)
   Charter Avdyl : hero via timeline immédiate, fallback CSS opacity:1,
   prefers-reduced-motion respecté, start "top 85%" par défaut.
   ============================================================================ */

(function () {

  /* ─────────── 0. NAV BURGER (toujours actif, même reduced-motion) ─────────── */
  const burger = document.getElementById('navBurger');
  const navMobile = document.getElementById('navMobile');
  if (burger && navMobile) {
    burger.addEventListener('click', function () {
      const open = navMobile.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
      navMobile.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    navMobile.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navMobile.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        navMobile.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

  /* ─────────── 1. Reduced motion : tout reste visible, on sort ─────────── */
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches) return;
  if (typeof gsap === 'undefined') return;
  if (typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  const hasSplit = (typeof SplitText !== 'undefined');
  if (hasSplit) {
    try { gsap.registerPlugin(SplitText); } catch (e) { /* noop */ }
  }

  /* Helper : split lines avec mask (effect cinéma premium). Fallback words. */
  function splitLinesMask(el) {
    if (!hasSplit || !el) return null;
    try {
      return new SplitText(el, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
    } catch (e) {
      try { return new SplitText(el, { type: 'lines', linesClass: 'split-line' }); }
      catch (e2) { return null; }
    }
  }
  function splitWords(el) {
    if (!hasSplit || !el) return null;
    try { return new SplitText(el, { type: 'words' }); } catch (e) { return null; }
  }

  /* ─────────── 2. NAV scroll state ─────────── */
  const nav = document.getElementById('nav');
  if (nav) {
    ScrollTrigger.create({
      start: 'top -50',
      onUpdate: function (self) { nav.classList.toggle('scrolled', self.scroll() > 50); }
    });
  }

  /* ─────────── 3. SCROLL PROGRESS BAR (anim 10 Agent 2) ─────────── */
  const progress = document.querySelector('.scroll-progress');
  if (progress) {
    gsap.to(progress, {
      scaleX: 1, transformOrigin: 'left center', ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: true }
    });
  }

  /* ─────────── 4. HERO CINÉMA — "Le sol qui se révèle" ─────────── */
  const heroTitle = document.querySelector('[data-anim="hero-title"]');
  const heroEyebrow = document.querySelector('[data-anim="hero-eyebrow"]');
  const heroTag = document.querySelector('[data-anim="hero-tag"]');
  const heroActions = document.querySelector('[data-anim="hero-actions"]');
  const heroProofs = document.querySelector('[data-anim="hero-proofs"]');
  const heroBg = document.querySelector('.hero-bg');
  const heroGrid = document.querySelector('.hero-grid-overlay');
  const scrollCue = document.querySelector('[data-anim="scroll-cue"]');

  if (heroTitle) {
    // Set initial states
    gsap.set([heroEyebrow, heroTag, heroActions, heroProofs, scrollCue], { opacity: 0, y: 24 });
    gsap.set(heroBg, { opacity: 0 });
    gsap.set(heroGrid, { opacity: 0, scale: 1.08 });

    const titleSplit = splitLinesMask(heroTitle) || splitWords(heroTitle);
    if (titleSplit && titleSplit.lines) {
      gsap.set(titleSplit.lines, { yPercent: 110 });
    } else if (titleSplit && titleSplit.words) {
      gsap.set(titleSplit.words, { opacity: 0, y: 40 });
    } else {
      gsap.set(heroTitle, { opacity: 0, y: 40 });
    }

    const tl = gsap.timeline({ delay: 0.15 });

    // Frame 1 — Halo background fade-in
    tl.to(heroBg, { opacity: 1, duration: 1.2, ease: 'power2.out' }, 0);

    // Frame 2 — Grid overlay s'allume du centre (scale + opacity)
    tl.to(heroGrid, { opacity: 1, scale: 1, duration: 1.4, ease: 'expo.out' }, 0.1);

    // Frame 3 — Eyebrow apparaît en premier (petit signal)
    tl.to(heroEyebrow, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.35);

    // Frame 4 — H1 lignes montent en mask (le moment cinéma)
    if (titleSplit && titleSplit.lines) {
      tl.to(titleSplit.lines, {
        yPercent: 0, duration: 1.05, stagger: 0.09, ease: 'expo.out'
      }, 0.5);
    } else if (titleSplit && titleSplit.words) {
      tl.to(titleSplit.words, {
        opacity: 1, y: 0, duration: 0.85, stagger: 0.05, ease: 'power4.out'
      }, 0.5);
    } else {
      tl.to(heroTitle, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 0.5);
    }

    // Frame 5 — Tagline + CTAs + proofs en cascade
    tl.to(heroTag, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.95)
      .to(heroActions, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 1.1)
      .to(heroProofs, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 1.3)
      .to(scrollCue, { opacity: 0.7, y: 0, duration: 0.7, ease: 'power3.out' }, 1.5);
  }

  /* ─────────── 5. HERO PARALLAX subtil au mousemove (grid overlay) ─────────── */
  if (heroGrid && !('ontouchstart' in window)) {
    const overlay = heroGrid;
    const xTo = gsap.quickTo(overlay, 'x', { duration: 0.9, ease: 'power3.out' });
    const yTo = gsap.quickTo(overlay, 'y', { duration: 0.9, ease: 'power3.out' });
    window.addEventListener('mousemove', function (e) {
      xTo((e.clientX - window.innerWidth / 2) * 0.015);
      yTo((e.clientY - window.innerHeight / 2) * 0.015);
    }, { passive: true });
  }

  /* ─────────── 6. SCROLL CUE — pulse + fade au scroll ─────────── */
  if (scrollCue) {
    gsap.to(scrollCue.querySelector('.scroll-cue-line') || scrollCue, {
      scaleY: 1.3, opacity: 0.4,
      duration: 1.4, repeat: -1, yoyo: true, ease: 'sine.inOut',
      transformOrigin: 'top center'
    });
    ScrollTrigger.create({
      start: 120,
      onEnter: function () { gsap.to(scrollCue, { opacity: 0, duration: 0.4 }); },
      onLeaveBack: function () { gsap.to(scrollCue, { opacity: 0.7, duration: 0.4 }); }
    });
  }

  /* ─────────── 7. TITRES SECTION — SplitText lines mask premium ─────────── */
  document.querySelectorAll('[data-anim="title-mask"]').forEach(function (el) {
    gsap.set(el, { opacity: 1 });
    const s = splitLinesMask(el);
    if (s && s.lines) {
      gsap.set(s.lines, { yPercent: 110 });
      gsap.to(s.lines, {
        scrollTrigger: { trigger: el, start: 'top 85%' },
        yPercent: 0, duration: 1.0, stagger: 0.08, ease: 'expo.out'
      });
    } else {
      // Fallback fade-up si SplitText fail
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 85%' },
        y: 36, opacity: 0, duration: 0.85, ease: 'power3.out'
      });
    }
  });

  /* ─────────── 8. FADE-UP génériques (hors hero) ─────────── */
  document.querySelectorAll('section:not(.hero) [data-anim="fade-up"]').forEach(function (el) {
    gsap.set(el, { opacity: 1 });
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%' },
      y: 24, opacity: 0, duration: 0.7, ease: 'power3.out'
    });
  });

  /* ─────────── 9. CARDS reveal stagger ─────────── */
  document.querySelectorAll('[data-anim="card-reveal"]').forEach(function (el, i) {
    gsap.set(el, { opacity: 1 });
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%' },
      y: 40, opacity: 0, duration: 0.85, delay: (i % 4) * 0.08, ease: 'power3.out'
    });
  });

  /* ─────────── 10. STAT counter (les chiffres dans .problem-stats) ─────────── */
  document.querySelectorAll('[data-counter]').forEach(function (el) {
    const target = parseFloat(el.getAttribute('data-counter')) || 0;
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: function () {
        gsap.to(obj, {
          v: target, duration: 1.4, ease: 'power3.out',
          onUpdate: function () {
            el.textContent = Number.isInteger(target)
              ? String(Math.round(obj.v))
              : obj.v.toFixed(1);
          }
        });
      }
    });
  });

  /* ─────────── 11. PROCESS step-num count-up 0 → 01/02/03/04 ─────────── */
  document.querySelectorAll('[data-step-num]').forEach(function (el) {
    const final = parseInt(el.textContent.trim(), 10);
    if (Number.isNaN(final)) return;
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter: function () {
        gsap.to(obj, {
          v: final, duration: 1.0, ease: 'power3.out',
          onUpdate: function () {
            el.textContent = String(Math.round(obj.v)).padStart(2, '0');
          }
        });
      }
    });
  });

  /* ─────────── 12. MAGNETIC CTA (boutons + nav-cta + cta cards) ─────────── */
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (isFinePointer) {
    document.querySelectorAll('.magnetic').forEach(function (b) {
      const xTo = gsap.quickTo(b, 'x', { duration: 0.55, ease: 'power3' });
      const yTo = gsap.quickTo(b, 'y', { duration: 0.55, ease: 'power3' });
      b.addEventListener('mousemove', function (e) {
        const r = b.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.28);
        yTo((e.clientY - r.top - r.height / 2) * 0.28);
      });
      b.addEventListener('mouseleave', function () { xTo(0); yTo(0); });
    });
  }

  /* ─────────── 13. CARD SPOTLIGHT curseur (services + system) ─────────── */
  document.querySelectorAll('[data-spotlight]').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ─────────── 14. CARD TILT 3D subtil (témoignages) ─────────── */
  if (isFinePointer) {
    document.querySelectorAll('[data-tilt]').forEach(function (c) {
      c.style.transformStyle = 'preserve-3d';
      c.addEventListener('mousemove', function (e) {
        const r = c.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -3.5;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 3.5;
        gsap.to(c, { rotateX: rx, rotateY: ry, duration: 0.45, ease: 'power3.out' });
      });
      c.addEventListener('mouseleave', function () {
        gsap.to(c, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'power3.out' });
      });
    });
  }

  /* ─────────── 15. CURSOR FOLLOWER (rond accent qui suit le curseur, desktop only) ─────────── */
  if (isFinePointer) {
    const follower = document.querySelector('.cursor-follower');
    if (follower) {
      const xTo = gsap.quickTo(follower, 'x', { duration: 0.45, ease: 'power3' });
      const yTo = gsap.quickTo(follower, 'y', { duration: 0.45, ease: 'power3' });
      let visible = false;
      window.addEventListener('mousemove', function (e) {
        if (!visible) { follower.style.opacity = '1'; visible = true; }
        xTo(e.clientX); yTo(e.clientY);
      }, { passive: true });

      // Grossit sur les éléments interactifs (.magnetic, a, button)
      const interactives = document.querySelectorAll('.magnetic, a, button, .service-card, .testimonial, .pricing-strip-card');
      interactives.forEach(function (el) {
        el.addEventListener('mouseenter', function () {
          gsap.to(follower, { scale: 2.4, opacity: 0.4, duration: 0.4, ease: 'power3.out' });
        });
        el.addEventListener('mouseleave', function () {
          gsap.to(follower, { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' });
        });
      });

      // Cache hors fenêtre
      document.addEventListener('mouseleave', function () { gsap.to(follower, { opacity: 0, duration: 0.3 }); });
      document.addEventListener('mouseenter', function () { gsap.to(follower, { opacity: 1, duration: 0.3 }); });
    }
  }

  /* ─────────── 16. Refresh après chargement images (règle charter) ─────────── */
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });

})();
