(() => {
  function normalizeSearch(value) {
    return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
      .replace(/đ/g, 'd').replace(/ł/g, 'l').replace(/ß/g, 'ss').trim();
  }

  function matchesPublication(record, filters) {
    const words = normalizeSearch(filters.query).split(/\s+/).filter(Boolean);
    return (filters.topic === 'all' || record.topic === filters.topic)
      && (filters.publisher === 'all' || record.publishers.split(' ').includes(filters.publisher))
      && words.every(word => normalizeSearch(record.search).includes(word));
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { normalizeSearch, matchesPublication };
  if (typeof document === 'undefined') return;
  const root = document.querySelector('[data-component="publications"]');
  if (!root) return;

  const form = root.querySelector('[data-publication-filters]');
  const query = form.elements.query;
  const topic = form.elements.topic;
  const publisher = form.elements.publisher;
  const reset = form.querySelector('[type="reset"]');
  const results = root.querySelector('[data-publication-results]');
  const empty = root.querySelector('[data-publication-empty]');
  const cards = [...root.querySelectorAll('.publication-card')];
  const records = cards.map(card => ({ card, ...card.dataset }));
  const features = [...root.querySelectorAll('.publication-feature')];
  const position = root.querySelector('[data-feature-position]');
  let activeIndex = Math.max(0, features.findIndex(feature => feature.open));
  let language = document.documentElement.lang.startsWith('de') ? 'de' : document.documentElement.lang.startsWith('bs') ? 'bhs' : 'en';
  const copy = {
    en: { count: (count, total) => count === total ? `${total} publications` : `${count} of ${total} publications`, preview: 'Preview unavailable' },
    de: { count: (count, total) => count === total ? `${total} Publikationen` : `${count} von ${total} Publikationen`, preview: 'Vorschau nicht verfügbar' },
    bhs: { count: (count, total) => count === total ? `${total} publikacija` : `${count} od ${total} publikacija`, preview: 'Pregled nije dostupan' },
  };

  function applyFilters() {
    const filters = { query: query.value, topic: topic.value, publisher: publisher.value };
    let count = 0;
    records.forEach(record => {
      const matches = matchesPublication(record, filters);
      record.card.hidden = !matches;
      if (matches) count += 1;
    });
    results.textContent = copy[language].count(count, cards.length);
    empty.hidden = count > 0;
    reset.disabled = !query.value && topic.value === 'all' && publisher.value === 'all';
  }

  function activateFeature(index, focus = false) {
    activeIndex = (index + features.length) % features.length;
    features.forEach((feature, i) => {
      feature.open = i === activeIndex;
      feature.querySelector('summary').setAttribute('aria-expanded', String(feature.open));
      feature.querySelector('.publication-feature-body').inert = !feature.open;
    });
    position.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(features.length).padStart(2, '0')}`;
    if (focus) features[activeIndex].querySelector('summary').focus({ preventScroll: !window.matchMedia('(max-width: 1100px)').matches });
  }

  features.forEach((feature, index) => {
    const summary = feature.querySelector('summary');
    summary.addEventListener('click', event => {
      event.preventDefault();
      activateFeature(index);
    });
    summary.addEventListener('keydown', event => {
      const direction = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
      if (direction) {
        event.preventDefault();
        activateFeature(index + direction, true);
      } else if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        activateFeature(event.key === 'Home' ? 0 : features.length - 1, true);
      }
    });
  });
  root.querySelectorAll('[data-feature-step]').forEach(button => {
    button.addEventListener('click', () => activateFeature(activeIndex + Number(button.dataset.featureStep)));
  });
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', applyFilters);
  form.addEventListener('change', applyFilters);
  form.addEventListener('reset', event => {
    // Reset and redraw together; native reset default actions run after listeners.
    event.preventDefault();
    query.value = '';
    topic.value = 'all';
    publisher.value = 'all';
    applyFilters();
  });
  root.querySelector('[data-publication-clear]').addEventListener('click', () => {
    form.reset();
    query.focus();
  });

  function translate(next) {
    language = copy[next] ? next : 'en';
    query.placeholder = query.getAttribute(`data-placeholder-${language}`);
    root.querySelectorAll('.publication-preview-error').forEach(node => { node.textContent = copy[language].preview; });
    applyFilters();
  }
  document.addEventListener('stay-shape:language-change', event => translate(event.detail.language));

  root.querySelectorAll('img').forEach(img => {
    function showPreviewError() {
      if (img.hidden) return;
      img.hidden = true;
      const fallback = document.createElement('span');
      fallback.className = 'publication-preview-error';
      fallback.textContent = copy[language].preview;
      img.before(fallback);
    }
    img.addEventListener('error', showPreviewError, { once: true });
    if (img.complete && img.naturalWidth === 0) showPreviewError();
  });

  // A future share link can identify a publication even after filtering.
  window.addEventListener('hashchange', () => {
    const id = window.location.hash.slice(1);
    const card = cards.find(item => item.id === id);
    if (!card?.hidden) return;
    form.reset();
    applyFilters();
    card.scrollIntoView({ block: 'start' });
  });

  form.hidden = false;
  root.querySelector('.publication-feature-controls').hidden = false;
  activateFeature(activeIndex);
  translate(language);
})();
