(() => {
  const root = document.querySelector('[data-component="conference-share"]');
  if (!root) return;
  const canvas = root.querySelector('[data-share-card]');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const caption = root.querySelector('#share-caption');
  const status = root.querySelector('[data-share-status]');
  const nativeButton = root.querySelector('[data-share-native]');
  const downloadButton = root.querySelector('[data-share-download]');
  const radios = [...root.querySelectorAll('[name="share-message"]')];
  const baseURL = 'https://www.stayandshape.com/';
  const { messages, programmeMessages, programmeInvitations, formats, backgrounds } = StayShapeDesign;
  const randomizedNotes = {
    en: 'New message, background and caption ready. Edit anything below, or try another combination.',
    de: 'Neue Botschaft, neuer Hintergrund und Beitragstext sind bereit. Bearbeiten Sie die Texte oder probieren Sie eine weitere Kombination.',
    bhs: 'Nova poruka, pozadina i tekst objave su spremni. Uredite tekst ili isprobajte novu kombinaciju.',
  };
  const ui = {
    en: {
      imageLoading: 'Loading your background…', imageFailed: 'The background could not load. Choose another background or reload the page.',
      download: 'Download image', open: 'Open {platform} ↗',
      native: 'Choose {platform} in your device’s sharing menu. Some apps accept only the image; use Copy caption if needed. You review and finish the post in your app.',
      nativeSteps: ['Tap Share image & caption and choose {platform}, if available.', 'Check the caption in your app. If it is missing, use Copy caption here and paste it in.', 'Review the image, caption and audience, then finish sharing in your app.'],
      manual: 'Your download includes the image and your edits. Upload it in {platform} using the steps below.',
      feed: 'Square or portrait works well for a feed image. Choose landscape for a wider layout.',
      instagram: 'Use square 1:1 or portrait 4:5 for your Instagram feed. Choose Story / status 9:16 for a story.',
      instagramStory: 'Vertical 9:16 is prepared for Instagram Stories. Upload the saved image in the Instagram app, then add your text before sharing.',
      whatsapp: 'Square for chats; vertical 9:16 for a status. Keep your message in the centre.',
      tiktok: 'Vertical 9:16 is our layout for a TikTok photo post. Upload the saved image in the TikTok mobile app.',
      crop: 'LinkedIn can crop a 9:16 image. Choose square, portrait 4:5 or landscape for its feed.',
      saved: 'Image downloaded. Copy your caption and continue in {platform}.',
      shareFailed: 'Image sharing is unavailable here. Download the image and upload it in your app.',
      shared: 'Image handed to your device’s share menu. Finish the post in your chosen app.',
      reset: 'Original message restored.',
      steps: {
        facebook: ['Download your image and copy the caption.', 'In Facebook, create a post with Photo/video, or add a story.', 'Upload the image, paste your caption and review before posting.'],
        instagram: ['Save your image to your phone and copy the caption.', 'In Instagram, create a Post and choose the saved image.', 'Paste your caption, review the image post and share when ready.'],
        instagramStory: ['Save your vertical image to your phone and copy any text you want to use.', 'In the Instagram app, create a Story and choose the saved image.', 'Add your text, review and share your story.'],
        linkedin: ['Download your image and copy the caption.', 'In LinkedIn, start a post and choose Photo.', 'Upload the image, paste your caption and review before posting.'],
        whatsapp: ['Download your image and copy the caption.', 'In WhatsApp, open a chat or add a Status.', 'Attach the saved image, add your caption and review before sharing.'],
        tiktok: ['Save your image to your phone and copy the caption.', 'In the TikTok app, tap + and choose a photo from your gallery.', 'Add your caption, review the photo post and publish when ready.'],
      },
    },
    de: {
      imageLoading: 'Hintergrund wird geladen…', imageFailed: 'Der Hintergrund konnte nicht geladen werden. Wählen Sie einen anderen oder laden Sie die Seite neu.',
      download: 'Bild herunterladen', open: '{platform} öffnen ↗',
      native: 'Wählen Sie {platform} im Teilen-Menü Ihres Geräts. Manche Apps übernehmen nur das Bild; nutzen Sie dann „Text kopieren“. Prüfen und veröffentlichen Sie den Beitrag in Ihrer App.',
      nativeSteps: ['Tippen Sie auf „Bild & Text teilen“ und wählen Sie {platform}, falls verfügbar.', 'Prüfen Sie den Text in Ihrer App. Falls er fehlt, nutzen Sie hier „Text kopieren“ und fügen Sie ihn ein.', 'Prüfen Sie Bild, Text und Zielgruppe und schließen Sie das Teilen in Ihrer App ab.'],
      manual: 'Der Download enthält Ihr Bild mit allen Änderungen. Laden Sie es mit den Schritten unten bei {platform} hoch.',
      feed: 'Quadrat und Hochformat eignen sich für Bildbeiträge im Feed. Für ein breiteres Layout wählen Sie Querformat.',
      instagram: 'Quadrat 1:1 oder Hochformat 4:5 für den Instagram-Feed. Für eine Story wählen Sie Story / Status 9:16.',
      instagramStory: 'Vertikal 9:16 ist für Instagram-Storys vorbereitet. Laden Sie das gespeicherte Bild in der Instagram-App hoch und ergänzen Sie Ihren Text.',
      whatsapp: 'Quadrat für Chats; vertikal 9:16 für den Status. Ihre Botschaft bleibt in der Mitte.',
      tiktok: 'Vertikal 9:16 ist unser Layout für einen TikTok-Fotobeitrag. Laden Sie das Bild in der TikTok-App auf Ihrem Handy hoch.',
      crop: 'LinkedIn kann ein 9:16-Bild beschneiden. Wählen Sie Quadrat, Hochformat 4:5 oder Querformat für den Feed.',
      saved: 'Bild heruntergeladen. Kopieren Sie den Text und fahren Sie in {platform} fort.',
      shareFailed: 'Bilder teilen ist hier nicht verfügbar. Laden Sie das Bild herunter und in Ihrer App hoch.',
      shared: 'Bild an das Teilen-Menü übergeben. Schließen Sie den Beitrag in Ihrer App ab.',
      reset: 'Ursprüngliche Botschaft wiederhergestellt.',
      steps: {
        facebook: ['Bild herunterladen und Beitragstext kopieren.', 'In Facebook einen Beitrag mit Foto/Video oder eine Story erstellen.', 'Bild hochladen, Text einfügen und vor dem Posten prüfen.'],
        instagram: ['Bild auf dem Handy speichern und Beitragstext kopieren.', 'In Instagram einen Beitrag erstellen und das gespeicherte Bild wählen.', 'Text einfügen, Bildbeitrag prüfen und teilen, wenn Sie bereit sind.'],
        instagramStory: ['Vertikales Bild auf dem Handy speichern und den gewünschten Text kopieren.', 'In der Instagram-App eine Story erstellen und das gespeicherte Bild wählen.', 'Text ergänzen, Story prüfen und teilen.'],
        linkedin: ['Bild herunterladen und Beitragstext kopieren.', 'In LinkedIn einen Beitrag erstellen und Foto wählen.', 'Bild hochladen, Text einfügen und vor dem Posten prüfen.'],
        whatsapp: ['Bild herunterladen und Beitragstext kopieren.', 'In WhatsApp einen Chat öffnen oder einen Status hinzufügen.', 'Bild anhängen, Text ergänzen und vor dem Teilen prüfen.'],
        tiktok: ['Bild auf dem Handy speichern und Text kopieren.', 'In der TikTok-App auf + tippen und ein Foto aus der Galerie wählen.', 'Text ergänzen, Fotobeitrag prüfen und veröffentlichen, wenn Sie bereit sind.'],
      },
    },
    bhs: {
      imageLoading: 'Učitavamo pozadinu…', imageFailed: 'Pozadina se nije mogla učitati. Odaberite drugu ili ponovo učitajte stranicu.',
      download: 'Preuzmite sliku', open: 'Otvorite {platform} ↗',
      native: 'Odaberite {platform} u meniju za dijeljenje na svom uređaju. Neke aplikacije prihvataju samo sliku; po potrebi koristite „Kopirajte tekst“. Pregledajte i dovršite objavu u svojoj aplikaciji.',
      nativeSteps: ['Dodirnite „Podijelite sliku i tekst“ i odaberite {platform}, ako je dostupan.', 'Provjerite tekst u svojoj aplikaciji. Ako nedostaje, ovdje ga kopirajte i zalijepite u aplikaciju.', 'Pregledajte sliku, tekst i publiku, pa dovršite dijeljenje u svojoj aplikaciji.'],
      manual: 'Preuzeta slika sadrži sve vaše izmjene. Objavite je na platformi {platform} prateći korake ispod.',
      feed: 'Kvadrat i portret odgovaraju slikama u objavama. Za širi prikaz odaberite pejzaž.',
      instagram: 'Kvadrat 1:1 ili portret 4:5 za Instagram objavu. Za story odaberite Story / status 9:16.',
      instagramStory: 'Vertikalni 9:16 je pripremljen za Instagram story. Učitajte sačuvanu sliku u Instagram aplikaciji i dodajte tekst prije dijeljenja.',
      whatsapp: 'Kvadrat za razgovore; vertikalni 9:16 za status. Poruka ostaje u sredini.',
      tiktok: 'Vertikalni 9:16 je naš format za TikTok foto-objavu. Preuzetu sliku učitajte u TikTok aplikaciji na telefonu.',
      crop: 'LinkedIn može izrezati sliku 9:16. Za objavu odaberite kvadrat, portret 4:5 ili pejzaž.',
      saved: 'Slika je preuzeta. Kopirajte tekst i nastavite na platformi {platform}.',
      shareFailed: 'Dijeljenje slike ovdje nije dostupno. Preuzmite je i učitajte u svojoj aplikaciji.',
      shared: 'Slika je predata meniju za dijeljenje. Dovršite objavu u odabranoj aplikaciji.',
      reset: 'Početna poruka je vraćena.',
      steps: {
        facebook: ['Preuzmite sliku i kopirajte tekst objave.', 'Na Facebooku započnite objavu s fotografijom ili story.', 'Učitajte sliku, zalijepite tekst i pregledajte prije objavljivanja.'],
        instagram: ['Sačuvajte sliku na telefonu i kopirajte tekst objave.', 'U Instagramu započnite objavu i odaberite sačuvanu sliku.', 'Zalijepite tekst, pregledajte objavu i podijelite kad budete spremni.'],
        instagramStory: ['Sačuvajte vertikalnu sliku na telefonu i kopirajte tekst koji želite koristiti.', 'U Instagram aplikaciji započnite story i odaberite sačuvanu sliku.', 'Dodajte tekst, pregledajte i podijelite story.'],
        linkedin: ['Preuzmite sliku i kopirajte tekst objave.', 'Na LinkedInu započnite objavu i odaberite fotografiju.', 'Učitajte sliku, zalijepite tekst i pregledajte prije objavljivanja.'],
        whatsapp: ['Preuzmite sliku i kopirajte tekst objave.', 'U WhatsAppu otvorite razgovor ili dodajte status.', 'Priložite sliku, dodajte tekst i pregledajte prije dijeljenja.'],
        tiktok: ['Sačuvajte sliku na telefonu i kopirajte tekst.', 'U TikTok aplikaciji dodirnite + i odaberite fotografiju iz galerije.', 'Dodajte tekst, pregledajte foto-objavu i objavite kad budete spremni.'],
      },
    },
  };
  const backgroundImages = new Map();
  function loadBackgroundImage(key) {
    if (backgroundImages.has(key)) return backgroundImages.get(key).promise;
    const image = new Image();
    const entry = { image, ready: false, failed: false };
    entry.promise = new Promise((resolve, reject) => {
      image.onload = () => { entry.ready = true; resolve(image); };
      image.onerror = () => { entry.failed = true; reject(new Error('Background image unavailable')); };
    });
    backgroundImages.set(key, entry);
    image.src = backgrounds[key].image;
    return entry.promise;
  }
  const platforms = {
    facebook: { label: 'Facebook', format: 'square', url: 'https://www.facebook.com/' },
    instagram: { label: 'Instagram', format: 'portrait', url: 'https://www.instagram.com/' },
    linkedin: { label: 'LinkedIn', format: 'portrait', url: 'https://www.linkedin.com/feed/' },
    whatsapp: { label: 'WhatsApp', format: 'story', url: 'https://web.whatsapp.com/' },
    tiktok: { label: 'TikTok', format: 'story', url: 'https://www.tiktok.com/' },
  };
  const params = new URLSearchParams(location.search);
  const allowed = (collection, value, fallback) => Object.hasOwn(collection, value) ? value : fallback;
  let variant = radios.some(radio => radio.value === params.get('share')) ? params.get('share') : 'attending';
  let programme = allowed(programmeMessages, params.get('message'), 'voice');
  let hasProgramme = variant === 'programme';
  let language = document.documentElement.lang === 'de' ? 'de' : document.documentElement.lang.startsWith('bs') ? 'bhs' : 'en';
  let background = allowed(backgrounds, params.get('background'), 'blue');
  let platform = allowed(platforms, params.get('platform'), 'facebook');
  let format = allowed(formats, params.get('format'), platforms[platform].format);
  let currentFile = null;
  let exportVersion = 0;
  let exportTimer;
  let sharing = false;
  let fontsReady = false;
  const drafts = new Map();
  const editFields = [...root.querySelectorAll('[data-share-edit]')];
  const formatControl = root.querySelector('[data-share-format]');
  const text = () => messages[language];
  const message = () => {
    if (variant !== 'programme') return text()[variant];
    const [badge, headline, subtitle, caption] = programmeMessages[programme][language];
    return { badge, lines: headline.split('\n'), subtitle, caption: `${caption}\n\n${programmeInvitations[language]}` };
  };
  const localized = key => ui[language][key].replaceAll('{platform}', platforms[platform].label);
  const draftKey = () => `${language}:${variant}${variant === 'programme' ? `:${programme}` : ''}`;
  const defaults = () => ({ badge: message().badge, headline: message().lines.join('\n'), subtitle: message().subtitle ?? `${text().topic}\n${text().focus}`, caption: `${message().caption}\n\n${baseURL}` });
  function draft() {
    if (!drafts.has(draftKey())) drafts.set(draftKey(), defaults());
    return drafts.get(draftKey());
  }
  for (const [key, limit] of [['badge', 60], ['headline', 180], ['subtitle', 160]]) {
    if (params.has(key)) draft()[key] = params.get(key).slice(0, limit);
  }
  let supportsImageShare = false;
  try {
    const probe = new File([''], 'stay-shape.png', { type: 'image/png' });
    supportsImageShare = typeof navigator.share === 'function' && typeof navigator.canShare === 'function' && navigator.canShare({ files: [probe], title: text().title, text: draft().caption });
  } catch { /* File downloads remain available on browsers without file sharing. */ }
  function shareURL() {
    const url = new URL('share', baseURL);
    url.search = StayShapeDesign.designParams({ variant, language, background, format, platform, programme, ...draft() }).toString();
    url.hash = 'share';
    return url.href;
  }
  function announce(key) { status.textContent = text()[key]; }
  function paintBackground(context, width, height, key) {
    StayShapeRenderer.paintBackground(context, width, height, key, backgroundImages);
  }
  function drawCard() {
    StayShapeRenderer.drawCard(canvas, { format, background, ...draft() }, backgroundImages);
  }
  function filename() { return `stay-shape-${variant}-${background}-${format}-${language}.png`; }
  function prepareImage() {
    const version = ++exportVersion;
    const name = filename();
    currentFile = null;
    nativeButton.disabled = true;
    downloadButton.disabled = true;
    clearTimeout(exportTimer);
    if (!fontsReady) return;
    const photo = backgroundImages.get(background);
    if (backgrounds[background].image && !photo?.ready) {
      status.textContent = localized(photo?.failed ? 'imageFailed' : 'imageLoading');
      return;
    }
    exportTimer = window.setTimeout(() => {
      canvas.toBlob(blob => {
        if (version !== exportVersion) return;
        if (!blob) { announce('failed'); return; }
        currentFile = new File([blob], name, { type: 'image/png' });
        nativeButton.disabled = sharing;
        downloadButton.disabled = false;
      }, 'image/png');
    }, 100);
  }
  function render(syncFields = false) {
    if (platform === 'instagram' && format === 'landscape') format = 'portrait';
    const landscapeOption = formatControl.querySelector('[value="landscape"]');
    landscapeOption.hidden = platform === 'instagram';
    landscapeOption.disabled = platform === 'instagram';
    radios.forEach(radio => { radio.checked = radio.value === variant; });
    root.querySelector('[data-share-programme-option]').hidden = !hasProgramme;
    root.querySelector('[data-share-programme-title]').textContent = programmeMessages[programme][language][1].replaceAll('\n', ' ');
    root.querySelectorAll('[name="share-background"]').forEach(radio => { radio.checked = radio.value === background; });
    root.querySelectorAll('[name="share-platform"]').forEach(radio => { radio.checked = radio.value === platform; });
    formatControl.value = format;
    if (syncFields) {
      editFields.forEach(field => { field.value = draft()[field.dataset.shareEdit]; });
      caption.value = draft().caption;
    }
    root.querySelector('[data-share-dimensions]').textContent = `${formats[format].width} × ${formats[format].height}`;
    root.querySelector('[data-share-download-label]').textContent = localized('download');
    downloadButton.classList.toggle('share-action-primary', !supportsImageShare);
    root.querySelector('[data-share-image-help]').textContent = localized(supportsImageShare ? 'native' : 'manual');
    const instagramMode = format === 'story' ? 'instagramStory' : 'instagram';
    const formatHelp = platform === 'instagram' ? instagramMode : platform === 'linkedin' && format === 'story' ? 'crop' : platform === 'whatsapp' || platform === 'tiktok' ? platform : 'feed';
    root.querySelector('[data-share-format-help]').textContent = localized(formatHelp);
    const open = root.querySelector('[data-share-open]');
    open.href = platforms[platform].url; open.textContent = localized('open');
    const steps = root.querySelector('[data-share-post-steps]');
    const stepsKey = platform === 'instagram' ? instagramMode : platform;
    const instructions = supportsImageShare ? ui[language].nativeSteps : ui[language].steps[stepsKey];
    steps.replaceChildren(...instructions.map(value => { const li = document.createElement('li'); li.textContent = value.replaceAll('{platform}', platforms[platform].label); return li; }));
    root.querySelector('[data-share-link]').value = shareURL();
    root.querySelector('[data-share-link-fallback]').hidden = true;
    status.textContent = '';
    drawCard(); prepareImage();
  }
  radios.forEach(radio => radio.addEventListener('change', () => {
    variant = radio.value;
    root.querySelector('[data-share-randomize-note]').hidden = true;
    render(true);
  }));
  root.querySelector('[data-share-randomize]').addEventListener('click', () => {
    const chooseDifferent = (keys, current) => {
      const choices = keys.filter(key => key !== current);
      return choices[Math.floor(Math.random() * choices.length)];
    };
    programme = chooseDifferent(Object.keys(programmeMessages), hasProgramme ? programme : null);
    background = chooseDifferent(Object.keys(backgrounds), background);
    variant = 'programme';
    hasProgramme = true;
    // A new combination starts with coordinated copy; personal preset drafts stay available.
    for (const lang of Object.keys(messages)) drafts.delete(`${lang}:programme:${programme}`);
    render(true);
    const note = root.querySelector('[data-share-randomize-note]');
    note.hidden = false;
    note.textContent = randomizedNotes[language];
  });
  root.querySelectorAll('[name="share-background"]').forEach(radio => radio.addEventListener('change', () => { background = radio.value; render(); }));
  root.querySelectorAll('[name="share-platform"]').forEach(radio => radio.addEventListener('change', () => { platform = radio.value; format = platforms[platform].format; render(); }));
  formatControl.addEventListener('change', () => { format = formatControl.value; render(); });
  editFields.forEach(field => field.addEventListener('input', () => { draft()[field.dataset.shareEdit] = field.value; render(); }));
  caption.addEventListener('input', () => { draft().caption = caption.value; });
  root.querySelector('[data-share-reset]').addEventListener('click', () => { drafts.delete(draftKey()); render(true); status.textContent = localized('reset'); });
  document.addEventListener('stay-shape:language-change', event => {
    language = allowed(messages, event.detail.language, 'en'); render(true);
    root.querySelector('[data-share-randomize-note]').textContent = randomizedNotes[language];
  });
  root.querySelectorAll('[data-share-copy]').forEach(button => button.addEventListener('click', async () => {
    const isCaption = button.dataset.shareCopy === 'caption';
    try {
      await navigator.clipboard.writeText(isCaption ? caption.value : shareURL());
      announce(isCaption ? 'copiedCaption' : 'copiedLink');
    } catch {
      const field = isCaption ? caption : root.querySelector('[data-share-link]');
      if (!isCaption) root.querySelector('[data-share-link-fallback]').hidden = false;
      field.focus(); field.select(); announce(isCaption ? 'manualCaption' : 'manualLink');
    }
  }));
  downloadButton.addEventListener('click', () => {
    if (!currentFile) return;
    const url = URL.createObjectURL(currentFile);
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = currentFile.name;
    document.body.append(anchor); anchor.click(); anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    status.textContent = localized('saved');
  });
  nativeButton.hidden = !supportsImageShare;
  if (!supportsImageShare) nativeButton.after(downloadButton);
  nativeButton.addEventListener('click', async () => {
    if (!currentFile || sharing) return;
    sharing = true; nativeButton.disabled = true;
    try {
      // The PNG is prepared ahead of time so share() runs directly in this click gesture.
      await navigator.share({ files: [currentFile], title: text().title, text: caption.value });
      status.textContent = localized('shared');
    } catch (error) {
      if (error.name !== 'AbortError') status.textContent = localized('shareFailed');
    } finally { sharing = false; nativeButton.disabled = !currentFile; }
  });
  root.querySelectorAll('[data-share-swatch]').forEach(swatch => paintBackground(swatch.getContext('2d'), swatch.width, swatch.height, swatch.dataset.shareSwatch));
  for (const [key, theme] of Object.entries(backgrounds)) {
    if (!theme.image) continue;
    loadBackgroundImage(key).then(() => {
      const swatch = root.querySelector(`[data-share-swatch="${key}"]`);
      paintBackground(swatch.getContext('2d'), swatch.width, swatch.height, key);
      if (background === key) { status.textContent = ''; drawCard(); prepareImage(); }
    }).catch(() => {
      if (background === key) status.textContent = localized('imageFailed');
    });
  }
  render(true);
  root.querySelectorAll('[data-share-controls]').forEach(node => { node.hidden = false; });
  Promise.all([
    document.fonts.load('400 61px "Stay Shape Display"'),
    document.fonts.load('500 34px "Stay Shape Mono"'),
    document.fonts.load('500 35px "Stay Shape Sans"'),
  ]).then(() => { fontsReady = true; drawCard(); prepareImage(); }).catch(() => announce('failed'));
})();
