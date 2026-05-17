/* ============================================================================
   Opus Studio — animations charter Avdyl
   GSAP 3.13 + ScrollTrigger + SplitText (chargés via CDN dans chaque page)
   PAS de Lenis (bugs iOS 17+ confirmés)
   ============================================================================ */

(function() {

  // ── Burger menu (toujours actif, même en reduced-motion) ──
  const burger = document.getElementById('navBurger');
  const navMobile = document.getElementById('navMobile');
  if (burger && navMobile) {
    burger.addEventListener('click', function () {
      const open = navMobile.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
      navMobile.setAttribute('aria-hidden', !open);
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

  // ── Reduced motion : tout reste visible, on sort ──
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches) return;
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  const hasSplit = (typeof SplitText !== 'undefined');
  if (hasSplit) gsap.registerPlugin(SplitText);

  const splitWords = function (el) {
    if (!hasSplit || !el) return null;
    try { return new SplitText(el, { type: 'words' }); } catch (e) { return null; }
  };

  // ── 1. Nav scroll state ──
  const nav = document.getElementById('nav');
  if (nav) {
    ScrollTrigger.create({
      start: 'top -50',
      onUpdate: function (self) { nav.classList.toggle('scrolled', self.scroll() > 50); }
    });
  }

  // ── 2. HERO — intro immédiate (timeline, JAMAIS ScrollTrigger sur hero) ──
  const heroTitle = document.querySelector('[data-anim="hero-title"]');
  if (heroTitle) {
    const heroFadeups = document.querySelectorAll('.hero [data-anim="fade-up"]');
    gsap.set(heroTitle, { opacity: 1 });
    gsap.set(heroFadeups, { opacity: 0 });
    const heroSplit = splitWords(heroTitle);
    gsap.timeline({ delay: 0.2 })
      .from(heroSplit ? heroSplit.words : heroTitle, {
        y: 60, opacity: 0, duration: 1.0, stagger: 0.06, ease: 'power4.out',
      }, 0)
      .fromTo(heroFadeups,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.85, stagger: 0.12, ease: 'power3.out' },
        0.35);
  }

  // ── 3. Page header (pages internes) — fade-up immédiat ──
  const pageHeader = document.querySelector('.page-header');
  if (pageHeader) {
    const items = pageHeader.querySelectorAll('[data-anim="fade-up"], [data-anim="title-stagger"]');
    gsap.set(items, { opacity: 0 });
    gsap.timeline({ delay: 0.2 })
      .fromTo(items,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' });
  }

  // ── 4. Titres de section — frappe stagger (hors hero / page-header) ──
  document.querySelectorAll('section:not(.hero):not(.page-header) [data-anim="title-stagger"]').forEach(function (el) {
    gsap.set(el, { opacity: 1 });
    const s = splitWords(el);
    if (!s) return;
    gsap.from(s.words, {
      scrollTrigger: { trigger: el, start: 'top 85%' },
      y: 36, opacity: 0, duration: 0.85, stagger: 0.05, ease: 'power4.out',
    });
  });

  // ── 5. Fade-up génériques (hors hero / page-header) ──
  document.querySelectorAll('section:not(.hero):not(.page-header) [data-anim="fade-up"]').forEach(function (el) {
    gsap.set(el, { opacity: 1 });
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%' },
      y: 24, opacity: 0, duration: 0.7, ease: 'power3.out',
    });
  });

  // ── 6. Cartes (services / témoignages / projects / pillars) reveal stagger ──
  document.querySelectorAll('[data-anim="card-reveal"]').forEach(function (el, i) {
    gsap.set(el, { opacity: 1 });
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%' },
      y: 36, opacity: 0, duration: 0.75, delay: (i % 3) * 0.1, ease: 'power3.out',
    });
  });

  // ── 7. Process steps reveal ──
  document.querySelectorAll('.process-step').forEach(function (el, i) {
    gsap.set(el, { opacity: 1 });
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%' },
      y: 30, opacity: 0, duration: 0.7, delay: i * 0.08, ease: 'power3.out',
    });
  });

  // ── 8. Image reveal : clip-path inset depuis le côté gauche.
  //     Utilisé sur les cartes réalisations (4× dans realisations.html).
  //     Sans ce handler, le data-anim restait visible mais sans anim. ──
  document.querySelectorAll('[data-anim="image-reveal"]').forEach(function (el) {
    gsap.set(el, { opacity: 1 });
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%' },
      clipPath: 'inset(0 100% 0 0)',
      opacity: 0.4,
      duration: 1.1,
      ease: 'power3.out',
    });
  });

  // ── 9. Refresh après chargement images (règle charter) ──
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });

})();
