(() => {
  const storageKey = 'stay-shape-language';
  const languageButtons = [...document.querySelectorAll('[data-lang-button]')];
  const sessions = [...document.querySelectorAll('details.session')];
  const expandButton = document.querySelector('.expand-all');
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
    const allOpen = sessions.every(session => session.open);
    expandButton.textContent = metadata[language][allOpen ? 'collapse' : 'expand'];
    expandButton.setAttribute('aria-expanded', String(allOpen));
  }

  function setLanguage(nextLanguage) {
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
    const shouldOpen = !sessions.every(session => session.open);
    sessions.forEach(session => { session.open = shouldOpen; });
    syncExpandButton();
  });
  sessions.forEach(session => session.addEventListener('toggle', syncExpandButton));
  setLanguage(language);
  initBrandEnigma();
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
