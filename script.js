/* ============================================================================
   Opus Studio — V3 animations cinéma famille Opus
   GSAP 3.13 + ScrollTrigger + SplitText
   Charter Avdyl : hero timeline immédiate, fallback CSS, prefers-reduced-motion,
   no Lenis, ScrollTrigger start "top 85%" par défaut.
   ============================================================================ */

(function () {

  /* ─────────── 0. NAV BURGER ─────────── */
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
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  const hasSplit = (typeof SplitText !== 'undefined');
  if (hasSplit) {
    try { gsap.registerPlugin(SplitText); } catch (e) { /* noop */ }
  }
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isMobile = window.innerWidth < 900;

  /* Helper split lines + mask */
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

  /* ─────────── 3. SCROLL PROGRESS BAR ─────────── */
  const progress = document.querySelector('.scroll-progress');
  if (progress) {
    gsap.to(progress, {
      scaleX: 1, transformOrigin: 'left center', ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: true }
    });
  }

  /* ─────────── 4. HERO CINÉMA timeline immédiate ─────────── */
  const heroTitle = document.querySelector('[data-anim="hero-title"]');
  const heroEyebrow = document.querySelector('[data-anim="hero-eyebrow"]');
  const heroTag = document.querySelector('[data-anim="hero-tag"]');
  const heroActions = document.querySelector('[data-anim="hero-actions"]');
  const heroProofLine = document.querySelector('[data-anim="hero-proof-line"]');
  const heroProofs = document.querySelector('[data-anim="hero-proofs"]');
  const heroBg = document.querySelector('.hero-bg');
  const heroGrid = document.querySelector('.hero-grid-overlay');
  const scrollCue = document.querySelector('[data-anim="scroll-cue"]');

  if (heroTitle) {
    gsap.set([heroEyebrow, heroTag, heroActions, heroProofLine, heroProofs, scrollCue], { opacity: 0, y: 24 });
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
    tl.to(heroBg, { opacity: 1, duration: 1.2, ease: 'power2.out' }, 0)
      .to(heroGrid, { opacity: 1, scale: 1, duration: 1.4, ease: 'expo.out' }, 0.1)
      .to(heroEyebrow, { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, 0.35);

    if (titleSplit && titleSplit.lines) {
      tl.to(titleSplit.lines, { yPercent: 0, duration: 1.0, stagger: 0.08, ease: 'expo.out' }, 0.5);
    } else if (titleSplit && titleSplit.words) {
      tl.to(titleSplit.words, { opacity: 1, y: 0, duration: 0.85, stagger: 0.05, ease: 'power4.out' }, 0.5);
    } else {
      tl.to(heroTitle, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 0.5);
    }

    tl.to(heroTag, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, 0.95)
      .to(heroActions, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, 1.1)
      .to(heroProofLine, { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, 1.25)
      .to(heroProofs, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 1.4)
      .to(scrollCue, { opacity: 0.7, y: 0, duration: 0.7, ease: 'power3.out' }, 1.6);
  }

  /* ─────────── 5. HERO conic-gradient + grid mousemove parallax ─────────── */
  if (heroBg && isFinePointer && !isMobile) {
    let mouseX = 0.5, mouseY = 0.5;
    const xTo = gsap.quickTo(heroGrid, 'x', { duration: 0.9, ease: 'power3.out' });
    const yTo = gsap.quickTo(heroGrid, 'y', { duration: 0.9, ease: 'power3.out' });
    let raf = null;
    window.addEventListener('mousemove', function (e) {
      mouseX = e.clientX / window.innerWidth;
      mouseY = e.clientY / window.innerHeight;
      // Grid parallax léger
      xTo((mouseX - 0.5) * 30);
      yTo((mouseY - 0.5) * 30);
      // Conic gradient angle (subtle pivot)
      if (raf) return;
      raf = requestAnimationFrame(function () {
        const angle = 220 + (mouseX - 0.5) * 70;
        heroBg.style.setProperty('--hero-angle', angle + 'deg');
        raf = null;
      });
    }, { passive: true });
  }

  /* ─────────── 6. SCROLL CUE pulse + fade ─────────── */
  if (scrollCue) {
    const line = scrollCue.querySelector('.scroll-cue-line') || scrollCue;
    gsap.to(line, {
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

  /* ─────────── 7. TITRES section — SplitText lines mask ─────────── */
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
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 85%' },
        y: 36, opacity: 0, duration: 0.85, ease: 'power3.out'
      });
    }
  });

  /* ─────────── 8. FADE-UP génériques ─────────── */
  document.querySelectorAll('section:not(.hero) [data-anim="fade-up"]').forEach(function (el) {
    gsap.set(el, { opacity: 1 });
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%' },
      y: 24, opacity: 0, duration: 0.7, ease: 'power3.out'
    });
  });

  /* ─────────── 9. CARDS reveal ─────────── */
  document.querySelectorAll('[data-anim="card-reveal"]').forEach(function (el, i) {
    gsap.set(el, { opacity: 1 });
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%' },
      y: 40, opacity: 0, duration: 0.85, delay: (i % 4) * 0.08, ease: 'power3.out'
    });
  });

  /* ─────────── 10. STAT + STEP NUMBER SCRAMBLE (number scramble final) ─────────── */
  function scrambleNumber(el, target) {
    const targetStr = String(target);
    const chars = '0123456789';
    let frame = 0;
    const totalFrames = 18;
    function tick() {
      if (frame < totalFrames) {
        let scrambled = '';
        for (let i = 0; i < targetStr.length; i++) {
          if (i < frame * targetStr.length / totalFrames) scrambled += targetStr[i];
          else scrambled += chars[Math.floor(Math.random() * 10)];
        }
        el.textContent = scrambled;
        frame++;
        requestAnimationFrame(tick);
      } else {
        el.textContent = targetStr;
      }
    }
    tick();
  }

  document.querySelectorAll('[data-counter]').forEach(function (el) {
    const target = parseFloat(el.getAttribute('data-counter')) || 0;
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: function () { scrambleNumber(el, target); }
    });
  });

  document.querySelectorAll('[data-step-num]').forEach(function (el) {
    const final = parseInt(el.textContent.trim(), 10);
    if (Number.isNaN(final)) return;
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter: function () {
        const targetStr = String(final).padStart(2, '0');
        const chars = '0123456789';
        let frame = 0;
        const totalFrames = 16;
        function tick() {
          if (frame < totalFrames) {
            const scrambled = Array.from(targetStr).map(function (c, i) {
              return i < frame * targetStr.length / totalFrames ? c : chars[Math.floor(Math.random() * 10)];
            }).join('');
            el.textContent = scrambled;
            frame++;
            requestAnimationFrame(tick);
          } else {
            el.textContent = targetStr;
          }
        }
        tick();
      }
    });
  });

  /* ─────────── 11. MAGNETIC CTA ─────────── */
  if (isFinePointer && !isMobile) {
    document.querySelectorAll('.magnetic').forEach(function (b) {
      const xTo = gsap.quickTo(b, 'x', { duration: 0.55, ease: 'power3' });
      const yTo = gsap.quickTo(b, 'y', { duration: 0.55, ease: 'power3' });
      b.addEventListener('mousemove', function (e) {
        const r = b.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.25);
        yTo((e.clientY - r.top - r.height / 2) * 0.25);
      });
      b.addEventListener('mouseleave', function () { xTo(0); yTo(0); });
    });
  }

  /* ─────────── 12. CARD SPOTLIGHT curseur ─────────── */
  document.querySelectorAll('[data-spotlight]').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ─────────── 13. CARD TILT 3D (témoignages) ─────────── */
  if (isFinePointer && !isMobile) {
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

  /* ─────────── 14. CURSOR FOLLOWER ─────────── */
  if (isFinePointer && !isMobile) {
    const follower = document.querySelector('.cursor-follower');
    if (follower) {
      const xTo = gsap.quickTo(follower, 'x', { duration: 0.4, ease: 'power3' });
      const yTo = gsap.quickTo(follower, 'y', { duration: 0.4, ease: 'power3' });
      let visible = false;
      window.addEventListener('mousemove', function (e) {
        if (!visible) { follower.style.opacity = '1'; visible = true; }
        xTo(e.clientX); yTo(e.clientY);
      }, { passive: true });

      document.querySelectorAll('.magnetic, a, button, .service-card, .testimonial, .pricing-strip-card').forEach(function (el) {
        el.addEventListener('mouseenter', function () {
          gsap.to(follower, { scale: 2.4, opacity: 0.4, duration: 0.4, ease: 'power3.out' });
        });
        el.addEventListener('mouseleave', function () {
          gsap.to(follower, { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' });
        });
      });

      document.addEventListener('mouseleave', function () { gsap.to(follower, { opacity: 0, duration: 0.3 }); });
      document.addEventListener('mouseenter', function () { gsap.to(follower, { opacity: 1, duration: 0.3 }); });
    }
  }

  /* ─────────── 15. MARQUEE infini (vitesse selon direction scroll) ─────────── */
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    const tween = gsap.to(marqueeTrack, {
      xPercent: -50, duration: 30, repeat: -1, ease: 'none'
    });
    let lastDir = 1;
    ScrollTrigger.create({
      onUpdate: function (self) {
        const newDir = self.direction;
        if (newDir !== lastDir) {
          gsap.to(tween, { timeScale: newDir, duration: 0.6 });
          lastDir = newDir;
        }
      }
    });
  }

  /* ─────────── 16. DEVTOOLS FAKE — "code qui se tape" (méta-cohérence) ─────────── */
  const codeEl = document.getElementById('code-typing');
  if (codeEl) {
    // Snippet HTML stylé qui montre VRAIMENT comment Avdyl code
    const snippet =
      '<span class="com">// votre site, codé à la main, sans framework</span>\n' +
      '<span class="kw">const</span> <span class="fn">hero</span> = gsap.<span class="fn">timeline</span>({\n' +
      '  delay: <span class="num">0.15</span>,\n' +
      '  defaults: { ease: <span class="str">\'expo.out\'</span> }\n' +
      '});\n\n' +
      'hero\n' +
      '  .<span class="fn">from</span>(<span class="str">\'.hero-title\'</span>, {\n' +
      '    yPercent: <span class="num">110</span>,\n' +
      '    stagger: <span class="num">0.08</span>,\n' +
      '    duration: <span class="num">1</span>\n' +
      '  })\n' +
      '  .<span class="fn">from</span>(<span class="str">\'.hero-cta\'</span>, {\n' +
      '    opacity: <span class="num">0</span>,\n' +
      '    y: <span class="num">24</span>\n' +
      '  }, <span class="str">\'-=0.5\'</span>);\n\n' +
      '<span class="com">// Lighthouse : 98 · 100 · 100 · 100</span>';

    const cleanLen = snippet.replace(/<[^>]*>/g, '').length;

    ScrollTrigger.create({
      trigger: codeEl, start: 'top 75%', once: true,
      onEnter: function () {
        let i = 0;
        function typeNext() {
          if (i >= cleanLen) { codeEl.innerHTML = snippet; return; }
          // Trouve le caractère i en ignorant les tags HTML
          let charsSeen = 0;
          let result = '';
          let j = 0;
          while (j < snippet.length && charsSeen < i + 1) {
            if (snippet[j] === '<') {
              const closeIdx = snippet.indexOf('>', j);
              result += snippet.slice(j, closeIdx + 1);
              j = closeIdx + 1;
            } else {
              result += snippet[j];
              charsSeen++;
              j++;
            }
          }
          codeEl.innerHTML = result;
          i++;
          // Vitesse variable : plus rapide sur les espaces, plus lent sur les caractères
          const delay = snippet[j - 1] === '\n' ? 80 : snippet[j - 1] === ' ' ? 12 : 22;
          setTimeout(typeNext, delay);
        }
        typeNext();
      }
    });
  }

  /* ─────────── 17. STICKY STACK SYSTÈME (cards qui s'empilent au scroll) ─────────── */
  // SKIP en mobile (pas de sens tactile + bug iOS 17 sticky)
  if (!isMobile) {
    const systemCards = gsap.utils.toArray('.system-card');
    if (systemCards.length > 1) {
      systemCards.forEach(function (card, i) {
        if (i === systemCards.length - 1) return;
        gsap.to(card, {
          scale: 0.96 - (systemCards.length - i - 1) * 0.01,
          y: -16,
          opacity: 0.6,
          scrollTrigger: {
            trigger: systemCards[i + 1],
            start: 'top 75%',
            end: 'top 30%',
            scrub: 0.8
          }
        });
      });
    }
  }

  /* ─────────── 18. Refresh ScrollTrigger après chargement images ─────────── */
  window.addEventListener('load', function () {
    ScrollTrigger.refresh();
  });

})();
