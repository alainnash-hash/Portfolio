(() => {
  const SETTINGS = { loader: true, customCursor: true };

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const projects = window.PROJECTS || [];
  const pad = n => String(n).padStart(2, '0');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const g = window.gsap && window.ScrollTrigger ? window.gsap : null;
  if (g) g.registerPlugin(ScrollTrigger);

  // ---------- Smooth scroll ----------
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1 });
    if (g) { lenis.on('scroll', ScrollTrigger.update); g.ticker.add(t => lenis.raf(t * 1000)); g.ticker.lagSmoothing(0); }
    else { const f = t => { lenis.raf(t); requestAnimationFrame(f); }; requestAnimationFrame(f); }
  }
  const scrollToId = id => {
    const el = id === 'home' || id === 'top' ? 0 : document.getElementById(id);
    if (el === null) return;
    if (lenis) lenis.scrollTo(el, { offset: el === 0 ? 0 : -60 });
    else window.scrollTo({ top: el === 0 ? 0 : el.getBoundingClientRect().top + scrollY - 60, behavior: reduce ? 'auto' : 'smooth' });
  };
  const jumpTop = () => (lenis ? lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0));

  // ---------- Mobile menu ----------
  const menuBtn = $('.menu-btn'), mnav = $('#mnav');
  const setMenu = open => { mnav.classList.toggle('is-open', open); menuBtn.setAttribute('aria-expanded', open); menuBtn.textContent = open ? 'Close' : 'Menu'; };
  menuBtn.addEventListener('click', () => setMenu(!mnav.classList.contains('is-open')));

  // ---------- Work carousel ----------
  const works = $('.works'), sticky = $('.works__sticky'), track = $('.track'), bar = $('.progress__bar'), count = $('.works__count');
  let filter = 'All', dist = 0, x = 0, horiz = false;

  const renderCards = () => {
    const list = projects.filter(p => filter === 'All' || p.tag === filter);
    track.innerHTML = list.map(p => {
      const i = projects.indexOf(p) + 1;
      const bg = p.cover ? `url('${p.cover}')` : p.grad;
      return `<a href="#/work/${p.id}" class="card" data-cursor="view" aria-label="${esc(p.title)}, ${esc(p.category)}. Open case study">
        <div class="ph card__img"><div class="card__fill" style="background-image:${bg}"></div><span class="mono card__num">${pad(i)}</span></div>
        <div class="card__row"><span class="card__title">${esc(p.title)}</span><span class="mono">${esc(p.year)}</span></div>
        <span class="card__cat">${esc(p.category)}</span></a>`;
    }).join('');
    count.textContent = `${pad(list.length)} projects`;
  };

  const size = () => {
    horiz = innerWidth >= 900 && !reduce;
    works.classList.toggle('is-horizontal', horiz);
    if (horiz) { dist = Math.max(0, track.scrollWidth - track.clientWidth); works.style.height = innerHeight + dist + 'px'; }
    else { works.style.height = ''; track.style.transform = ''; x = 0; }
    window.ScrollTrigger && ScrollTrigger.refresh();
  };

  $$('.chip').forEach(b => b.addEventListener('click', () => {
    filter = b.dataset.filter;
    $$('.chip').forEach(c => c.setAttribute('aria-pressed', c === b));
    renderCards(); x = 0; track.scrollLeft = 0; size();
    if (g && !reduce) g.from($$('.card', track), { opacity: 0, y: 24, duration: 0.6, stagger: 0.05, ease: 'power3.out' });
  }));

  renderCards();
  size();
  addEventListener('resize', () => { if (innerWidth >= 900) setMenu(false); size(); });
  addEventListener('load', size);

  // ---------- Cursor ----------
  const cursor = $('.cursor');
  let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
  if (fine && SETTINGS.customCursor && !reduce) {
    document.body.classList.add('has-cursor');
    addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
    addEventListener('mouseover', e => {
      const view = e.target.closest('[data-cursor="view"]'), hit = e.target.closest('a, button');
      cursor.classList.toggle('is-view', !!view);
      cursor.classList.toggle('is-hover', !view && !!hit);
    });
  }

  // ---------- Frame loop ----------
  let caseOpen = false;
  const tick = () => {
    if (!caseOpen) {
      let p;
      if (horiz) {
        p = Math.min(1, Math.max(0, -works.getBoundingClientRect().top / (dist || 1)));
        x += (p * dist - x) * 0.18;
        track.style.transform = `translate3d(${-x}px,0,0)`;
      } else p = track.scrollLeft / Math.max(1, track.scrollWidth - track.clientWidth);
      bar.style.transform = `scaleX(${p})`;
    }
    if (document.body.classList.contains('has-cursor')) {
      cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
      cursor.style.transform = `translate3d(${cx}px,${cy}px,0)`;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  // ---------- Scroll animations ----------
  const lines = $$('[data-line]');
  const loader = $('.loader');
  if (g && !reduce) {
    g.set(lines, { yPercent: 110 });
    $$('[data-reveal]').forEach(el => g.from(el, { y: 48, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } }));
    $$('[data-reveal-line]').forEach((el, i) => g.from(el, { yPercent: 110, duration: 1.1, delay: i * 0.08, ease: 'power4.out', scrollTrigger: { trigger: el, start: 'top 95%', once: true } }));
    $$('[data-parallax]').forEach(el => g.to(el, { yPercent: 12, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));
    const hero = () => g.to(lines, { yPercent: 0, duration: 1.2, stagger: 0.09, ease: 'power4.out' });

    if (SETTINGS.loader && !location.hash.startsWith('#/work/')) {
      lenis && lenis.stop();
      const num = $('.loader__num'), o = { v: 0 };
      g.timeline()
        .to(o, { v: 100, duration: 1.4, ease: 'power2.inOut', onUpdate: () => (num.textContent = Math.round(o.v)) })
        .to(loader, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' })
        .add(hero, '-=0.35')
        .add(() => { loader.remove(); lenis && lenis.start(); });
    } else { loader.remove(); hero(); }
  } else loader.remove();

  // ---------- Case study pages (#/work/id) ----------
  const home = $('#home'), caseEl = $('#case'), wipe = $('.wipe');

  const transition = (swap, after) => {
    if (!g || reduce) { swap(); jumpTop(); after && after(); return; }
    g.timeline()
      .set(wipe, { display: 'block', transformOrigin: 'bottom' })
      .fromTo(wipe, { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: 'power4.inOut' })
      .add(() => { swap(); jumpTop(); })
      .set(wipe, { transformOrigin: 'top' })
      .to(wipe, { scaleY: 0, duration: 0.6, ease: 'power4.inOut', delay: 0.15 })
      .set(wipe, { display: 'none' })
      .add(() => after && after());
  };

  const fillCase = p => {
    const i = projects.indexOf(p), next = projects[(i + 1) % projects.length];
    $('#cs-kicker').textContent = `${pad(i + 1)} — ${p.category}`;
    $('#cs-title').textContent = p.title;
    $('#cs-year').textContent = p.year;
    $('#cs-cat').textContent = p.category;
    $('#cs-role').textContent = p.role;
    $('#cs-client').textContent = p.client;
    $('#cs-desc').textContent = p.desc;
    const hero = $('#cs-hero');
    hero.style.background = p.grad;
    hero.innerHTML = p.hero ? `<img src="${p.hero}" alt="${esc(p.title)}">` : '<span class="mono ph__label">[Hero image or video, 16:9]</span>';
    $('#cs-gallery').innerHTML = (p.gallery || []).map(src =>
      `<div class="ph" data-cs>${src ? `<img src="${src}" alt="${esc(p.title)} detail" loading="lazy">` : '<span class="mono ph__label">[Detail image]</span>'}</div>`).join('');
    $('#cs-next').href = `#/work/${next.id}`;
    $('#cs-next-title').textContent = `${next.title} →`;
    document.title = `${p.title} — Nash Alino`;
  };

  const showCase = p => {
    fillCase(p); home.hidden = true; caseEl.hidden = false; caseOpen = true;
    if (g && !reduce) g.from($$('[data-cs]', caseEl), { y: 40, opacity: 0, duration: 1, stagger: 0.07, ease: 'power3.out', delay: 0.35 });
    window.ScrollTrigger && ScrollTrigger.refresh();
  };
  const showHome = () => {
    caseEl.hidden = true; home.hidden = false; caseOpen = false;
    document.title = 'Nash Alino — Graphic Designer & Publishing Project Manager';
    size();
  };

  const route = (animate = true) => {
    const m = location.hash.match(/^#\/work\/(.+)$/);
    const p = m && projects.find(pr => pr.id === m[1]);
    if (p) animate ? transition(() => showCase(p)) : (showCase(p), jumpTop());
    else if (caseOpen) animate ? transition(showHome) : showHome();
  };

  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const h = a.getAttribute('href');
    if (h === '#' ) { e.preventDefault(); return; }
    e.preventDefault(); setMenu(false);
    if (h.startsWith('#/work/')) { history.pushState(null, '', h); route(); return; }
    const id = h.slice(1);
    if (caseOpen) { history.pushState(null, '', location.pathname + location.search); transition(showHome, () => id !== 'home' && scrollToId(id)); }
    else scrollToId(id);
  });
  addEventListener('popstate', () => route());
  route(false);

  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
})();
