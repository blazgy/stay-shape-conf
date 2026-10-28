(() => {
  'use strict';
  const photos = window.conferencePhotos;
  if (!Array.isArray(photos) || !photos.length) return;
  const byId = new Map(photos.map(photo => [photo.id, photo]));
  const tiles = [...document.querySelectorAll('[data-photo-id]')];
  const filters = [...document.querySelectorAll('[data-photo-filter]')];
  const count = document.querySelector('[data-gallery-count]');
  const labels = {
    en: { title: 'Sarajevo / Conference photographs', close: 'Close', previous: 'Previous photograph', next: 'Next photograph', loading: 'Loading photograph…', error: 'This photograph could not be loaded.', retry: 'Try again', direct: 'Open image directly', photo: 'Photograph', of: 'of', shown: 'photographs shown', open: 'Open photograph' },
    de: { title: 'Sarajevo / Konferenzfotos', close: 'Schließen', previous: 'Vorheriges Foto', next: 'Nächstes Foto', loading: 'Foto wird geladen…', error: 'Dieses Foto konnte nicht geladen werden.', retry: 'Erneut versuchen', direct: 'Bild direkt öffnen', photo: 'Foto', of: 'von', shown: 'Fotos angezeigt', open: 'Foto öffnen' },
    bhs: { title: 'Sarajevo / Fotografije s konferencije', close: 'Zatvori', previous: 'Prethodna fotografija', next: 'Sljedeća fotografija', loading: 'Učitavanje fotografije…', error: 'Fotografija se nije mogla učitati.', retry: 'Pokušajte ponovo', direct: 'Otvori fotografiju direktno', photo: 'Fotografija', of: 'od', shown: 'prikazanih fotografija', open: 'Otvori fotografiju' },
  };
  let language = document.documentElement.lang === 'de' ? 'de' : document.documentElement.lang.startsWith('bs') ? 'bhs' : 'en';
  let filter = 'all';
  let selection = photos;
  let current = null;
  let opener = null;
  let pushedEntry = false;
  let returnURL = '';
  let imageVersion = 0;
  const fullSource = photo => photo.variants.at(-1).src;
  const text = () => labels[language];
  const toolbar = document.querySelector('[data-gallery-toolbar]');
  if (toolbar) toolbar.hidden = false;

  function setFilter(next, updateURL = true) {
    filter = next === 'all' || filters.some(button => button.dataset.photoFilter === next) ? next : 'all';
    selection = filter === 'all' ? photos : photos.filter(photo => photo.category === filter);
    tiles.forEach(tile => { tile.hidden = filter !== 'all' && tile.dataset.category !== filter; });
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.photoFilter === filter)));
    if (count) {
      count.textContent = `${selection.length} / ${photos.length}`;
      count.setAttribute('aria-label', `${selection.length} ${text().of} ${photos.length} ${text().shown}`);
    }
    if (updateURL && toolbar) {
      const url = new URL(location.href);
      if (filter === 'all') url.searchParams.delete('category');
      else url.searchParams.set('category', filter);
      history.replaceState(history.state, '', url);
    }
  }
  filters.forEach(button => button.addEventListener('click', () => setFilter(button.dataset.photoFilter)));
  setFilter(new URLSearchParams(location.search).get('category') || 'all', false);

  const dialog = document.createElement('dialog');
  dialog.className = 'photo-lightbox';
  dialog.setAttribute('aria-labelledby', 'lightbox-title');
  dialog.innerHTML = `
    <div class="lightbox-top"><h2 class="lightbox-title" id="lightbox-title"></h2><button type="button" class="lightbox-close" autofocus><span data-viewer-label="close"></span><span aria-hidden="true">×</span></button></div>
    <div class="lightbox-content">
      <button type="button" class="lightbox-arrow lightbox-prev"><span aria-hidden="true">←</span></button>
      <figure class="lightbox-stage" aria-busy="false"><div class="lightbox-loading" role="status" data-viewer-label="loading"></div><div class="lightbox-error" role="alert" hidden><p data-viewer-label="error"></p><button type="button" class="lightbox-retry" data-viewer-label="retry"></button><a class="lightbox-direct" data-viewer-label="direct"></a></div></figure>
      <button type="button" class="lightbox-arrow lightbox-next"><span aria-hidden="true">→</span></button>
    </div>
    <div class="lightbox-bottom"><p class="lightbox-caption" id="lightbox-caption"><span class="lightbox-caption-text"></span><span>© FES</span></p><p class="lightbox-counter" aria-live="polite" aria-atomic="true"></p></div>`;
  document.body.append(dialog);
  const stage = dialog.querySelector('.lightbox-stage');
  const loading = dialog.querySelector('.lightbox-loading');
  const error = dialog.querySelector('.lightbox-error');
  const previous = dialog.querySelector('.lightbox-prev');
  const next = dialog.querySelector('.lightbox-next');
  const closeButton = dialog.querySelector('.lightbox-close');
  const caption = dialog.querySelector('.lightbox-caption-text');
  const counter = dialog.querySelector('.lightbox-counter');

  function localize() {
    const currentURL = new URL(location.href);
    if (toolbar || currentURL.searchParams.has('lang')) {
      currentURL.searchParams.set('lang', language);
      history.replaceState(history.state, '', currentURL);
    }
    tiles.forEach(tile => {
      const photo = byId.get(tile.dataset.photoId);
      if (!photo) return;
      tile.setAttribute('aria-label', `${text().open}: ${photo.caption[language]} (${photo.id})`);
      tile.querySelector('img').alt = photo.caption[language];
    });
    document.querySelectorAll('a[data-gallery-link]').forEach(link => {
      const url = new URL(link.href);
      url.searchParams.set('lang', language);
      link.href = url.href;
    });
    dialog.querySelector('#lightbox-title').textContent = text().title;
    dialog.querySelectorAll('[data-viewer-label]').forEach(node => { node.textContent = text()[node.dataset.viewerLabel]; });
    previous.setAttribute('aria-label', text().previous);
    next.setAttribute('aria-label', text().next);
    closeButton.setAttribute('aria-label', text().close);
    setFilter(filter, false);
    if (current) updateDetails();
  }

  function updateDetails() {
    const position = selection.findIndex(photo => photo.id === current.id);
    caption.textContent = current.caption[language];
    counter.textContent = `${String(position + 1).padStart(2, '0')} / ${String(selection.length).padStart(2, '0')}`;
    counter.setAttribute('aria-label', `${text().photo} ${position + 1} ${text().of} ${selection.length}`);
    previous.disabled = position <= 0;
    next.disabled = position >= selection.length - 1;
    const displayed = stage.querySelector('img');
    if (displayed) displayed.alt = current.caption[language];
  }

  function loadPhoto(photo) {
    current = photo;
    const version = ++imageVersion;
    stage.querySelector('img')?.remove();
    error.hidden = true;
    loading.hidden = false;
    stage.setAttribute('aria-busy', 'true');
    const image = new Image();
    image.className = 'lightbox-image';
    image.alt = photo.caption[language];
    image.width = photo.width;
    image.height = photo.height;
    image.hidden = true;
    image.decoding = 'async';
    image.addEventListener('load', () => {
      if (version !== imageVersion) return;
      image.hidden = false;
      loading.hidden = true;
      stage.setAttribute('aria-busy', 'false');
    });
    image.addEventListener('error', () => {
      if (version !== imageVersion) return;
      image.hidden = true;
      loading.hidden = true;
      error.hidden = false;
      stage.setAttribute('aria-busy', 'false');
      dialog.querySelector('.lightbox-direct').href = fullSource(photo);
    });
    stage.prepend(image);
    image.src = fullSource(photo);
    updateDetails();
    const position = selection.findIndex(item => item.id === photo.id);
    for (const neighbour of [selection[position - 1], selection[position + 1]]) {
      if (neighbour) { const preload = new Image(); preload.src = fullSource(neighbour); }
    }
  }

  function photoFromURL() {
    return byId.get(new URLSearchParams(location.hash.slice(1)).get('photo'));
  }

  function openPhoto(photo, push = true, trigger = document.activeElement) {
    if (typeof dialog.showModal !== 'function') return;
    if (!selection.some(item => item.id === photo.id)) setFilter('all');
    if (!dialog.open) {
      opener = trigger;
      const url = new URL(location.href);
      if (photoFromURL()) url.hash = '';
      returnURL = url.href;
      pushedEntry = push;
      dialog.showModal();
      document.body.classList.add('photo-viewer-open');
    }
    if (push) {
      const url = new URL(location.href);
      url.hash = `photo=${photo.id}`;
      history.pushState(null, '', url);
    }
    loadPhoto(photo);
  }

  function dismiss() {
    if (!dialog.open) return;
    ++imageVersion;
    dialog.close();
    document.body.classList.remove('photo-viewer-open');
    if (opener?.isConnected && !opener.hidden) opener.focus({ preventScroll: true });
  }

  function closePhoto() {
    dismiss();
    if (pushedEntry) history.back();
    else history.replaceState(history.state, '', returnURL || location.pathname + location.search);
    pushedEntry = false;
  }

  function move(direction) {
    const position = selection.findIndex(photo => photo.id === current?.id);
    const photo = selection[position + direction];
    if (!photo) return;
    const url = new URL(location.href);
    url.hash = `photo=${photo.id}`;
    history.replaceState(history.state, '', url);
    loadPhoto(photo);
    // Keep keyboard focus usable when the button at an endpoint becomes disabled.
    if (document.activeElement === previous && previous.disabled) next.focus();
    else if (document.activeElement === next && next.disabled) previous.focus();
  }

  tiles.forEach(tile => tile.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || typeof dialog.showModal !== 'function') return;
    const photo = byId.get(tile.dataset.photoId);
    if (!photo) return;
    event.preventDefault();
    openPhoto(photo, true, tile);
  }));
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  closeButton.addEventListener('click', closePhoto);
  dialog.querySelector('.lightbox-retry').addEventListener('click', () => loadPhoto(current));
  dialog.addEventListener('cancel', event => { event.preventDefault(); closePhoto(); });
  dialog.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  let touchStart = null;
  stage.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch' && event.isPrimary) touchStart = { x: event.clientX, y: event.clientY };
    else touchStart = null;
  });
  stage.addEventListener('pointerup', event => {
    if (!touchStart || event.pointerType !== 'touch') return;
    const dx = event.clientX - touchStart.x;
    const dy = event.clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4) move(dx < 0 ? 1 : -1);
  });
  stage.addEventListener('pointercancel', () => { touchStart = null; });
  window.addEventListener('popstate', () => {
    if (toolbar) setFilter(new URLSearchParams(location.search).get('category') || 'all', false);
    const photo = photoFromURL();
    if (photo) openPhoto(photo, false);
    else {
      dismiss(); pushedEntry = false;
      requestAnimationFrame(() => {
        if (opener?.isConnected && !opener.hidden) opener.focus({ preventScroll: true });
      });
    }
  });
  document.addEventListener('stay-shape:language-change', event => { language = event.detail.language; localize(); });
  localize();
  const linkedPhoto = photoFromURL();
  if (linkedPhoto) openPhoto(linkedPhoto, false);
})();
