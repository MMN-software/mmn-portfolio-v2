/* ============================================================
   MMN Cinematic Portfolio
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

/* ============ PRELOADER ============ */
(function preload() {
  const preFill = document.getElementById('preFill');
  const preCount = document.getElementById('preCount');
  const preloader = document.getElementById('preloader');
  const faDigits = s => String(s).replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
  let progress = 0;

  const tl = gsap.timeline({
    onComplete: () => {
      gsap.to(preloader, {
        yPercent: -100,
        duration: 1,
        ease: 'expo.inOut',
        onComplete: () => {
          preloader.style.display = 'none';
          heroAnimation();
        }
      });
    }
  });

  const obj = { v: 0 };
  tl.to(obj, {
    v: 100,
    duration: 2,
    ease: 'power2.inOut',
    onUpdate: () => {
      const v = Math.round(obj.v);
      preCount.textContent = faDigits(v);
      preFill.style.width = v + '%';
    }
  });
})();

/* ============ HERO ============ */
function heroAnimation() {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

  tl.to('.hero-title .word', {
    y: 0,
    duration: 1.2,
    stagger: 0.1
  })
  .from('[data-anim="hero-fade"]', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1
  }, '-=0.9');

  // badge pulse
  gsap.to('.hero-badge .dot', {
    scale: 1.3,
    duration: 1,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut'
  });
}

/* ============ CUSTOM CURSOR ============ */
(function cursor() {
  const cur = document.getElementById('cursor');
  const dot = document.getElementById('cursorDot');
  if (!cur || !dot) return;
  if (window.matchMedia('(max-width:768px)').matches) return;

  const xTo = gsap.quickTo(cur, 'x', { duration: 0.4, ease: 'power3' });
  const yTo = gsap.quickTo(cur, 'y', { duration: 0.4, ease: 'power3' });
  const dxTo = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3' });
  const dyTo = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3' });

  let mx = 0, my = 0;
  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    xTo(mx); yTo(my);
    dxTo(mx); dyTo(my);
  });

  document.querySelectorAll('[data-cursor="pointer"]').forEach(el => {
    el.addEventListener('mouseenter', () => cur.classList.add('hover'));
    el.addEventListener('mouseleave', () => cur.classList.remove('hover'));
  });

  document.querySelectorAll('[data-cursor="view"]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cur.classList.remove('hover');
      cur.classList.add('view');
    });
    el.addEventListener('mouseleave', () => cur.classList.remove('view'));
  });
})();

/* ============ MAGNETIC BUTTONS ============ */
(function magnetic() {
  if (window.matchMedia('(max-width:768px)').matches) return;
  document.querySelectorAll('[data-magnetic]').forEach(el => {
    const strength = 30;
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, {
        x: (x / rect.width) * strength,
        y: (y / rect.height) * strength,
        duration: 0.4,
        ease: 'power2.out'
      });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.5)' });
    });
  });
})();

/* ============ NAV SCROLL ============ */
(function navScroll() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  });
})();

/* ============ MOBILE MENU ============ */
(function menu() {
  const btn = document.getElementById('menuBtn');
  const overlay = document.getElementById('menuOverlay');
  if (!btn || !overlay) return;
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
  });
  overlay.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
})();

/* ============ SCROLL REVEALS ============ */
(function reveals() {
  // fade-up
  gsap.utils.toArray('[data-anim="fade-up"]').forEach(el => {
    gsap.from(el, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // work items
  gsap.utils.toArray('.work-item').forEach((item, i) => {
    const thumb = item.querySelector('.work-thumb');
    const info = item.querySelector('.work-info');
    const tl = gsap.timeline({
      scrollTrigger: { trigger: item, start: 'top 75%' }
    });
    tl.from(thumb, { scale: 0.85, opacity: 0, duration: 1.2, ease: 'expo.out' })
      .from(info.children, { y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'expo.out' }, '-=0.9');

    // parallax on thumb
    gsap.to(thumb.querySelector('.work-thumb-inner'), {
      yPercent: -15,
      ease: 'none',
      scrollTrigger: {
        trigger: item,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });
  });

  // counters
  gsap.utils.toArray('[data-count]').forEach(el => {
    const target = +el.dataset.count;
    const faDigits = s => String(s).replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
      onUpdate: () => { el.textContent = faDigits(Math.round(obj.v)); }
    });
  });
})();

/* ============ MARQUEE ============ */
(function marquee() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;
  gsap.to(track, {
    x: '-50%',
    duration: 40,
    repeat: -1,
    ease: 'none'
  });
})();

/* ============ YEAR ============ */
document.getElementById('year').textContent = new Date().getFullYear();

/* ============ SERVICE WORKER ============ */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
