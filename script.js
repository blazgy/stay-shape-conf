(() => {
  const storageKey = 'stay-shape-language';
  const languageButtons = [...document.querySelectorAll('[data-lang-button]')];
  const sessions = [...document.querySelectorAll('details.session')];
  const expandButton = document.querySelector('.expand-all');
  const sessionMotion = createSessionMotion(sessions, syncExpandButton);
  let language = 'en';
  const languageTags = { en: 'en', de: 'de', bhs: 'bs-Latn' };
  const supportedLanguages = Object.keys(languageTags);

  const metadata = {
    en: {
      title: 'Stay & Shape | Sarajevo · 22–23 October 2026',
      description: 'Work, Migration and Technology: Who Shapes the Future of Work in the Balkans? Join Stay & Shape in Sarajevo, 22–23 October 2026. Explore the draft programme and register with FES.',
      expand: 'Expand all sessions', collapse: 'Collapse all sessions',
    },
    de: {
      title: 'Stay & Shape | Sarajevo · 22.–23. Oktober 2026',
      description: 'Arbeit, Migration und Technologie: Wer gestaltet die Zukunft der Arbeit auf dem Balkan? Stay & Shape in Sarajevo, 22.–23. Oktober 2026. Programmentwurf ansehen und bei FES anmelden.',
      expand: 'Alle Sessions ausklappen', collapse: 'Alle Sessions einklappen',
    },
    bhs: {
      title: 'Stay & Shape | Sarajevo · 22–23. oktobar 2026.',
      description: 'Rad, migracije i tehnologija: Ko oblikuje budućnost rada na Balkanu? Stay & Shape u Sarajevu, 22–23. oktobra 2026. Pogledajte nacrt programa i prijavite se putem FES-a.',
      expand: 'Prikaži sve detalje', collapse: 'Sakrij sve detalje',
    },
  };

  function syncExpandButton() {
    const allOpen = sessions.every(session => sessionMotion.isOpen(session));
    expandButton.textContent = metadata[language][allOpen ? 'collapse' : 'expand'];
    expandButton.setAttribute('aria-expanded', String(allOpen));
  }

  function setLanguage(nextLanguage) {
    sessionMotion.finishAll();
    language = supportedLanguages.includes(nextLanguage) ? nextLanguage : 'en';
    document.documentElement.lang = languageTags[language];
    document.title = metadata[language].title;
    document.querySelector('meta[name="description"]').content = metadata[language].description;
    document.querySelectorAll('[data-en][data-de][data-bhs]').forEach(node => {
      node.textContent = node.dataset[language];
    });
    document.querySelectorAll('[data-aria-en]').forEach(node => {
      node.setAttribute('aria-label', node.getAttribute('data-aria-' + language));
    });
    languageButtons.forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.langButton === language));
    });
    syncExpandButton();
    try { localStorage.setItem(storageKey, language); } catch { /* Language switching also works without storage. */ }
  }

  try {
    const savedLanguage = localStorage.getItem(storageKey);
    language = supportedLanguages.includes(savedLanguage) ? savedLanguage : 'en';
  } catch { /* English is the default when storage is unavailable. */ }
  languageButtons.forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.langButton)));
  expandButton.hidden = false;
  expandButton.addEventListener('click', () => {
    const shouldOpen = !sessions.every(session => sessionMotion.isOpen(session));
    sessions.forEach(session => sessionMotion.setOpen(session, shouldOpen));
    syncExpandButton();
  });
  sessions.forEach(session => session.addEventListener('toggle', syncExpandButton));
  setLanguage(language);
  initBrandEnigma();
  initPageMotion();
  initHeroDepth();
})();

function initBrandEnigma() {
  const brand = document.querySelector("[data-enigma-brand]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!brand || reduceMotion) {
    return;
  }

  const target = brand.textContent;
  const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const frameMs = 42;
  const durationMs = 1800;
  const firstRunDelayMs = 5000;
  const intervalMs = 60000;
  let frameHandle = null;
  let isRunning = false;

  const run = () => {
    if (isRunning) {
      return;
    }

    isRunning = true;
    brand.classList.add("is-enigma-running");
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const revealed = Math.floor(progress * (target.length + 1));

      brand.textContent = [...target]
        .map((char, index) => {
          if (char === " " || char === "&") {
            return char;
          }
          if (index < revealed || progress === 1) {
            return char;
          }
          return glyphs[Math.floor(Math.random() * glyphs.length)];
        })
        .join("");

      if (progress < 1) {
        frameHandle = window.setTimeout(() => {
          window.requestAnimationFrame(tick);
        }, frameMs);
        return;
      }

      brand.textContent = target;
      brand.classList.remove("is-enigma-running");
      isRunning = false;
    };

    window.requestAnimationFrame(tick);
  };

  window.setTimeout(run, firstRunDelayMs);
  window.setInterval(run, intervalMs);

  window.addEventListener("pagehide", () => {
    if (frameHandle) {
      window.clearTimeout(frameHandle);
    }
  });
}

// Keep the glass state in sync with scrolling and restored scroll positions.
(() => {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 16);
  window.addEventListener('scroll', updateHeader, { passive: true });
  window.addEventListener('pageshow', updateHeader);
  updateHeader();
})();

// Preserve native details semantics while animating both opening and closing.
function createSessionMotion(sessions, onChange) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const states = new Map(sessions.map(session => [session, { target: session.open, animation: null }]));
  const isOpen = session => states.get(session).animation ? states.get(session).target : session.open;

  function finish(session) {
    const state = states.get(session);
    if (!state.animation) return;
    state.animation.cancel();
    state.animation = null;
    session.open = state.target;
    session.style.removeProperty('height');
    session.style.removeProperty('overflow');
    delete session.dataset.expanded;
  }

  function setOpen(session, open) {
    const state = states.get(session);
    const startHeight = session.getBoundingClientRect().height;
    if (state.animation) state.animation.cancel();
    state.animation = null;
    state.target = open;
    session.style.removeProperty('height');
    session.style.removeProperty('overflow');
    delete session.dataset.expanded;
    if (reducedMotion.matches || !session.animate) {
      session.open = open;
      return;
    }

    const summary = session.querySelector('summary');
    session.open = true;
    const borderHeight = session.offsetHeight - session.clientHeight;
    const endHeight = open ? session.getBoundingClientRect().height : summary.getBoundingClientRect().height + borderHeight;
    session.dataset.expanded = String(open);
    session.style.overflow = 'hidden';
    session.style.height = `${startHeight}px`;
    const animation = session.animate(
      [{ height: `${startHeight}px` }, { height: `${endHeight}px` }],
      { duration: 520, easing: 'cubic-bezier(.42, 0, .58, 1)', fill: 'forwards' }
    );
    state.animation = animation;
    animation.onfinish = () => {
      if (state.animation !== animation) return;
      finish(session);
      onChange();
    };
  }

  sessions.forEach(session => {
    session.querySelector('summary').addEventListener('click', event => {
      event.preventDefault();
      setOpen(session, !isOpen(session));
      onChange();
    });
  });
  const finishAll = () => sessions.forEach(finish);
  window.addEventListener('resize', finishAll, { passive: true });
  window.addEventListener('beforeprint', finishAll);
  reducedMotion.addEventListener('change', finishAll);
  return { setOpen, isOpen, finishAll };
}

function initPageMotion() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches || !Element.prototype.animate) return;
  const mobile = window.matchMedia('(max-width: 720px)');
  const active = new Set();
  function reveal(element, {
    delay = 0,
    startingOpacity = .12,
    distance = mobile.matches ? 16 : 30,
    duration = mobile.matches ? 850 : 1050,
  } = {}) {
    const animation = element.animate([
      { opacity: startingOpacity, transform: `translateY(${distance}px)` },
      { opacity: 1, transform: 'translateY(0)' },
    ], { duration, delay, easing: 'cubic-bezier(.42, 0, .58, 1)', fill: 'backwards' });
    active.add(animation);
    animation.finished.then(() => active.delete(animation), () => active.delete(animation));
  }

  // Let the artwork arrive early, then give the title and supporting copy room to appear.
  const heroEntries = [
    ['.hero h1', 0],
    ['.hero-art', mobile.matches ? 100 : 160],
    ['.hero-subtitle', mobile.matches ? 130 : 220],
    ['.hero-description', mobile.matches ? 240 : 400],
  ];
  heroEntries.forEach(([selector, delay]) => {
    const element = document.querySelector(selector);
    if (element?.getBoundingClientRect().bottom > 0) reveal(element, { delay });
  });

  const heroActions = document.querySelector('.hero-actions');
  if (heroActions && heroActions.getBoundingClientRect().bottom > 0) {
    reveal(heroActions, {
      delay: mobile.matches ? 320 : 500,
      startingOpacity: .6,
      distance: mobile.matches ? 10 : 18,
      duration: mobile.matches ? 750 : 900,
    });
  }

  let observer;
  let refreshObserver;
  if ('IntersectionObserver' in window) {
    const rowDelays = new Map();
    const pending = new Set(document.querySelectorAll('.intro h2, .section-heading, .day-header, .practical-copy h2, .practical-visual, .recap-image, .recap-copy h2, .registration h2, .day .session'));
    pending.forEach(element => element.classList.add('motion-pending'));
    document.querySelectorAll('.day .schedule').forEach(schedule => {
      schedule.querySelectorAll('.session').forEach((row, index) => {
        rowDelays.set(row, Math.min(index, 3) * (mobile.matches ? 70 : 110));
      });
    });
    refreshObserver = () => {
      observer?.disconnect();
      // Pixels keep the trigger at 30% of viewport height on wide and narrow screens.
      const triggerDepth = Math.round(window.innerHeight * .3);
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          pending.delete(entry.target);
          observer.unobserve(entry.target);
          entry.target.classList.remove('motion-pending');
          if (rowDelays.has(entry.target)) {
            reveal(entry.target, {
              delay: rowDelays.get(entry.target),
              startingOpacity: mobile.matches ? .5 : .4,
              distance: mobile.matches ? 14 : 24,
              duration: mobile.matches ? 750 : 900,
            });
          } else {
            if (entry.target.matches('.practical h2')) entry.target.classList.add('is-rule-drawing');
            reveal(entry.target);
          }
        });
      }, { rootMargin: `0px 0px -${triggerDepth}px 0px`, threshold: 0 });
      pending.forEach(element => observer.observe(element));
    };
    window.addEventListener('resize', refreshObserver, { passive: true });
    refreshObserver();
  }
  const finishMotion = () => {
    observer?.disconnect();
    if (refreshObserver) window.removeEventListener('resize', refreshObserver);
    document.querySelectorAll('.motion-pending').forEach(element => element.classList.remove('motion-pending'));
    active.forEach(animation => animation.cancel());
    active.clear();
  };
  reducedMotion.addEventListener('change', event => { if (event.matches) finishMotion(); });
  window.addEventListener('beforeprint', finishMotion);
}

function initHeroDepth() {
  const hero = document.querySelector('.hero');
  const globe = hero?.querySelector('.hero-globe');
  if (!globe) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 721px)');
  let frame = 0;
  let settleTimer = 0;
  const update = () => {
    frame = 0;
    const bounds = hero.getBoundingClientRect();
    const shift = !reducedMotion.matches && desktop.matches && bounds.bottom > 0
      ? Math.max(-96, Math.min(0, bounds.top * .22))
      : 0;
    globe.style.setProperty('--globe-shift', `${shift.toFixed(1)}px`);
  };
  const scheduleUpdate = () => {
    if (!frame) frame = window.requestAnimationFrame(update);
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(() => {
      if (frame) window.cancelAnimationFrame(frame);
      update();
    }, 120);
  };

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate, { passive: true });
  window.addEventListener('pageshow', scheduleUpdate);
  reducedMotion.addEventListener('change', scheduleUpdate);
  desktop.addEventListener('change', scheduleUpdate);
  update();
}
