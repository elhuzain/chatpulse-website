// GSAP + ScrollTrigger animations.
// Elements are pre-hidden by CSS (see .js rules in styles/input.css) to avoid a flash
// before GSAP runs. If GSAP fails to load, we drop the .js class so everything shows.
(function () {
  const root = document.documentElement;

  if (!window.gsap || !window.ScrollTrigger) {
    root.classList.remove('js');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power3.out', duration: 0.9 });

  const mm = gsap.matchMedia();

  // Reduced motion: just make sure everything is visible.
  mm.add('(prefers-reduced-motion: reduce)', () => {
    root.classList.remove('js');
  });

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // Hero intro: headline, copy, buttons
    gsap.from('.js-hero', {
      autoAlpha: 0,
      y: 32,
      filter: 'blur(8px)',
      stagger: 0.12,
      duration: 1.1,
      delay: 0.15,
      clearProps: 'filter',
    });

    // Discord mockup: window rises in, then messages arrive one by one
    gsap
      .timeline({ delay: 0.7 })
      .from('.js-mock', { autoAlpha: 0, y: 60, scale: 0.96, duration: 1.2 })
      .from('.js-msg', { autoAlpha: 0, y: 14, stagger: 0.35, duration: 0.6 }, '-=0.5');

    // Hero parallax while scrolling away
    gsap.to('#top .hero-grid', {
      yPercent: 25,
      ease: 'none',
      scrollTrigger: { trigger: '#top', start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to('.js-hero-content', {
      y: -80,
      opacity: 0.2,
      ease: 'none',
      scrollTrigger: { trigger: '#top', start: 'top top', end: 'bottom top', scrub: true },
    });

    // Section headings
    gsap.utils.toArray('.js-reveal').forEach((el) => {
      gsap.from(el, {
        autoAlpha: 0,
        y: 40,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    });

    // Feature cards, staggered in batches as they enter
    ScrollTrigger.batch('.js-card', {
      start: 'top 88%',
      once: true,
      onEnter: (cards) =>
        gsap.fromTo(
          cards,
          { autoAlpha: 0, y: 40 },
          { autoAlpha: 1, y: 0, stagger: 0.1, overwrite: true }
        ),
    });

    // Commands window, then its rows
    gsap
      .timeline({ scrollTrigger: { trigger: '.js-window', start: 'top 85%', once: true } })
      .from('.js-window', { autoAlpha: 0, y: 48, scale: 0.97, duration: 1 })
      .from('.js-cmd', { autoAlpha: 0, x: -24, stagger: 0.08, duration: 0.6 }, '-=0.5');

  });

  // Web fonts change layout; recalculate trigger positions once they're in.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
})();
