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
  const messages = {
    en: {
      attending: { badge: 'I’M ATTENDING', lines: ['SEE YOU', 'IN SARAJEVO.'], caption: 'I’m attending Stay & Shape in Sarajevo on 22–23 October 2026. Two days on work, migration and technology, with the Balkans in focus. Will you be part of the conversation?' },
      speaking: { badge: 'I’M SPEAKING', lines: ['LET’S TALK', 'FUTURE OF WORK.'], caption: 'I’m speaking at Stay & Shape in Sarajevo on 22–23 October 2026. Join me for a conversation about work, migration and technology — and who gets to shape what comes next.' },
      join: { badge: 'JOIN THE CONVERSATION', lines: ['THE FUTURE', 'OF WORK', 'INCLUDES YOU.'], caption: 'Who shapes the future of work? Join the conversation at Stay & Shape in Sarajevo, 22–23 October 2026. Work, migration and technology. The Balkans in focus.' },
      topic: 'Work, Migration and Technology', focus: 'The Balkans in focus.',
      title: 'Who shapes the future of work?',
      copiedCaption: 'Caption copied. Ready for your post.', copiedLink: 'Link copied with your chosen message and language.',
      manualCaption: 'Select and copy the caption above.', manualLink: 'Select and copy the link below.',
      preparing: 'Preparing your card…', downloaded: 'Card ready. Add it to your post with the caption.', failed: 'Your card could not be downloaded. Please try again.',
      shareFailed: 'Sharing is unavailable here. Use Copy link or Copy caption.',
    },
    de: {
      attending: { badge: 'ICH BIN DABEI', lines: ['WIR SEHEN UNS', 'IN SARAJEVO.'], caption: 'Ich bin bei Stay & Shape in Sarajevo am 22.–23. Oktober 2026 dabei. Zwei Tage über Arbeit, Migration und Technologie, mit dem Balkan im Fokus. Sind Sie auch dabei?' },
      speaking: { badge: 'ICH BIN ALS SPEAKER DABEI', lines: ['REDEN WIR', 'ÜBER DIE', 'ZUKUNFT DER ARBEIT.'], caption: 'Ich bin als Speaker bei Stay & Shape in Sarajevo am 22.–23. Oktober 2026 dabei. Diskutieren Sie mit über Arbeit, Migration und Technologie — und darüber, wer die Zukunft gestaltet.' },
      join: { badge: 'DISKUTIEREN SIE MIT', lines: ['DIE ZUKUNFT', 'DER ARBEIT', 'BRAUCHT SIE.'], caption: 'Wer gestaltet die Zukunft der Arbeit? Diskutieren Sie mit bei Stay & Shape in Sarajevo, 22.–23. Oktober 2026. Arbeit, Migration und Technologie. Der Balkan im Fokus.' },
      topic: 'Arbeit, Migration und Technologie', focus: 'Der Balkan im Fokus.',
      title: 'Wer gestaltet die Zukunft der Arbeit?',
      copiedCaption: 'Text kopiert. Bereit für Ihren Beitrag.', copiedLink: 'Link mit Ihrer Botschaft und Sprache kopiert.',
      manualCaption: 'Wählen und kopieren Sie den Text oben.', manualLink: 'Wählen und kopieren Sie den Link unten.',
      preparing: 'Ihre Karte wird vorbereitet…', downloaded: 'Karte bereit. Fügen Sie sie mit dem Text Ihrem Beitrag hinzu.', failed: 'Die Karte konnte nicht heruntergeladen werden. Bitte erneut versuchen.',
      shareFailed: 'Teilen ist hier nicht verfügbar. Kopieren Sie den Link oder Text.',
    },
    bhs: {
      attending: { badge: 'DOLAZIM', lines: ['VIDIMO SE', 'U SARAJEVU.'], caption: 'Dolazim na Stay & Shape u Sarajevu, 22–23. oktobra 2026. Dva dana razgovora o radu, migracijama i tehnologiji, s Balkanom u fokusu. Hoćete li nam se pridružiti?' },
      speaking: { badge: 'GOVORIM NA KONFERENCIJI', lines: ['RAZGOVARAJMO', 'O BUDUĆNOSTI', 'RADA.'], caption: 'Govorim na konferenciji Stay & Shape u Sarajevu, 22–23. oktobra 2026. Pridružite mi se u razgovoru o radu, migracijama i tehnologiji — i o tome ko oblikuje budućnost.' },
      join: { badge: 'PRIDRUŽITE SE RAZGOVORU', lines: ['BUDUĆNOST', 'RADA TREBA', 'I VAŠ GLAS.'], caption: 'Ko oblikuje budućnost rada? Pridružite se razgovoru na konferenciji Stay & Shape u Sarajevu, 22–23. oktobra 2026. Rad, migracije i tehnologija. Balkan u fokusu.' },
      topic: 'Rad, migracije i tehnologija', focus: 'Balkan u fokusu.',
      title: 'Ko oblikuje budućnost rada?',
      copiedCaption: 'Tekst je kopiran. Spreman za objavu.', copiedLink: 'Link s odabranom porukom i jezikom je kopiran.',
      manualCaption: 'Odaberite i kopirajte tekst iznad.', manualLink: 'Odaberite i kopirajte link ispod.',
      preparing: 'Pripremamo vašu karticu…', downloaded: 'Kartica je spremna. Dodajte je u objavu zajedno s tekstom.', failed: 'Karticu nije moguće preuzeti. Pokušajte ponovo.',
      shareFailed: 'Dijeljenje ovdje nije dostupno. Kopirajte link ili tekst.',
    },
  };
  // Each set keeps the image message and post caption on the same programme topic.
  const programmeMessages = {
    voice: {
      en: ['WORK & VOICE', 'WHO SHAPES\nYOUR WORK?', 'Technology is changing work. Who gets a say in what comes next?', 'The future of work is shaped by decisions. Whose voices count when those decisions are made?'],
      de: ['ARBEIT & MITBESTIMMUNG', 'WER GESTALTET\nIHRE ARBEIT?', 'Technologie verändert die Arbeit. Wer entscheidet mit, was als Nächstes kommt?', 'Die Zukunft der Arbeit entsteht durch Entscheidungen. Wessen Stimme zählt dabei?'],
      bhs: ['RAD I VAŠ GLAS', 'KO OBLIKUJE\nVAŠ RAD?', 'Tehnologija mijenja rad. Ko ima pravo glasa o onome što slijedi?', 'Budućnost rada oblikuju odluke. Čiji se glas čuje kada se te odluke donose?'],
    },
    machines: {
      en: ['AI & AUTOMATION', 'WHEN MACHINES\nDO MORE,\nWHAT CHANGES\nFOR US?', 'AI, jobs and the future of work in the Balkans.', 'What happens when machines can do your work? Let’s explore how AI and automation change jobs, skills and working lives.'],
      de: ['KI & AUTOMATISIERUNG', 'MASCHINEN\nKÖNNEN MEHR.\nWAS ÄNDERT\nSICH FÜR UNS?', 'KI, Jobs und die Zukunft der Arbeit auf dem Balkan.', 'Was passiert, wenn Maschinen Ihre Arbeit übernehmen können? Diskutieren wir, wie KI und Automatisierung Jobs, Kompetenzen und Arbeitsleben verändern.'],
      bhs: ['AI I AUTOMATIZACIJA', 'MAŠINE RADE\nVIŠE. ŠTA SE\nMIJENJA\nZA NAS?', 'AI, radna mjesta i budućnost rada na Balkanu.', 'Šta se dešava kada mašine mogu raditi vaš posao? Razgovarajmo o tome kako AI i automatizacija mijenjaju poslove, vještine i radni život.'],
    },
    mobility: {
      en: ['MIGRATION & MOBILITY', 'PEOPLE MOVE.\nWORK CHANGES.', 'Migration, skills and the people shaping the region’s future.', 'Who moves, who stays, and who works across borders? Migration is reshaping the world of work in the Balkans.'],
      de: ['MIGRATION & MOBILITÄT', 'MENSCHEN\nZIEHEN WEITER.\nARBEIT\nVERÄNDERT SICH.', 'Migration, Kompetenzen und die Menschen, die die Zukunft der Region gestalten.', 'Wer geht, wer bleibt und wer arbeitet über Grenzen hinweg? Migration verändert die Arbeitswelt auf dem Balkan.'],
      bhs: ['MIGRACIJE I MOBILNOST', 'LJUDI SE SELE.\nRAD SE MIJENJA.', 'Migracije, vještine i ljudi koji oblikuju budućnost regije.', 'Ko odlazi, ko ostaje, a ko radi preko granica? Migracije mijenjaju svijet rada na Balkanu.'],
    },
    rights: {
      en: ['WORKERS’ RIGHTS', 'NEW TECHNOLOGY.\nFAIRER WORK?', 'Explore the choices that turn innovation into better working lives.', 'New technology raises questions about power, working conditions and workers’ rights. How can innovation improve working lives?'],
      de: ['RECHTE BEI DER ARBEIT', 'NEUE TECHNIK.\nFAIRERE ARBEIT?', 'Welche Entscheidungen machen Innovation zum Fortschritt für Beschäftigte?', 'Neue Technologien werfen Fragen zu Macht, Arbeitsbedingungen und Arbeitnehmerrechten auf. Wie kann Innovation das Arbeitsleben verbessern?'],
      bhs: ['RADNIČKA PRAVA', 'NOVA TEHNOLOGIJA.\nPRAVEDNIJI RAD?', 'Koje odluke pretvaraju inovacije u bolji radni život?', 'Nove tehnologije otvaraju pitanja moći, uslova rada i radničkih prava. Kako inovacije mogu poboljšati radni život?'],
    },
    innovation: {
      en: ['RESEARCH & INNOVATION', 'MEET THE IDEAS\nCHANGING WORK.', 'Discover research, start-ups and technologies from across the Balkans.', 'What is happening in the Balkans? The conference’s Research & Innovation Bazaar brings regional ideas, research and technologies into the conversation.'],
      de: ['FORSCHUNG & INNOVATION', 'IDEEN, DIE\nARBEIT VERÄNDERN.', 'Entdecken Sie Forschung, Start-ups und Technologien aus der Balkanregion.', 'Was tut sich auf dem Balkan? Der Forschungs- und Innovationsbasar der Konferenz bringt regionale Ideen, Forschung und Technologien ins Gespräch.'],
      bhs: ['ISTRAŽIVANJE I INOVACIJE', 'IDEJE KOJE\nMIJENJAJU RAD.', 'Upoznajte istraživanja, startupe i tehnologije iz cijele regije.', 'Šta se dešava na Balkanu? Bazar istraživanja i inovacija na konferenciji donosi regionalne ideje, istraživanja i tehnologije u zajednički razgovor.'],
    },
    skills: {
      en: ['SKILLS & CHANGE', 'NEW TOOLS.\nNEW SKILLS.\nWHO GETS\nTHE CHANCE?', 'How can workers take part in a changing world of work?', 'Technology is transforming the skills work requires. Let’s discuss how people can take part in that change and what support they need.'],
      de: ['KOMPETENZEN & WANDEL', 'NEUE TOOLS.\nNEUE KOMPETENZEN.\nCHANCEN FÜR ALLE?', 'Wie können Beschäftigte die Arbeitswelt im Wandel mitgestalten?', 'Technologie verändert die Kompetenzen, die Arbeit erfordert. Wie können Menschen diesen Wandel mitgestalten und welche Unterstützung brauchen sie?'],
      bhs: ['VJEŠTINE I PROMJENE', 'NOVI ALATI.\nNOVE VJEŠTINE.\nKO DOBIJA\nPRILIKU?', 'Kako radnici mogu učestvovati u promjenama svijeta rada?', 'Tehnologija mijenja vještine potrebne za rad. Razgovarajmo o tome kako ljudi mogu učestvovati u tim promjenama i kakva im je podrška potrebna.'],
    },
    remote: {
      en: ['REMOTE & CROSS-BORDER WORK', 'WORK CROSSES\nBORDERS.\nWHAT FOLLOWS?', 'Remote work is changing how people and opportunities connect.', 'Working across borders no longer always means moving. What does remote work mean for workers, workplaces and the Balkans?'],
      de: ['REMOTE-ARBEIT & GRENZEN', 'ARBEIT KENNT\nNEUE WEGE.\nWAS FOLGT?', 'Remote-Arbeit verändert, wie Menschen und Chancen zusammenfinden.', 'Grenzüberschreitend arbeiten heißt nicht mehr immer umzuziehen. Was bedeutet Remote-Arbeit für Beschäftigte, Betriebe und den Balkan?'],
      bhs: ['RAD NA DALJINU', 'RAD PRELAZI\nGRANICE.\nŠTA SLIJEDI?', 'Rad na daljinu mijenja veze između ljudi i prilika.', 'Rad preko granica više ne znači uvijek preseljenje. Šta rad na daljinu znači za radnike, radna mjesta i Balkan?'],
    },
    platforms: {
      en: ['PLATFORM WORK', 'BEHIND EVERY\nPLATFORM:\nPEOPLE.', 'Digital work raises real questions about power and participation.', 'Platforms are changing how work is organised. Let’s put the people doing that work, their working conditions and their voices in the conversation.'],
      de: ['PLATTFORMARBEIT', 'HINTER JEDER\nPLATTFORM:\nMENSCHEN.', 'Digitale Arbeit stellt Fragen nach Macht und Beteiligung.', 'Plattformen verändern die Organisation von Arbeit. Sprechen wir über die Menschen dahinter, ihre Arbeitsbedingungen und ihre Mitbestimmung.'],
      bhs: ['PLATFORMSKI RAD', 'IZA SVAKE\nPLATFORME:\nLJUDI.', 'Digitalni rad otvara pitanja moći i učešća.', 'Platforme mijenjaju organizaciju rada. Uključimo u razgovor ljude koji taj rad obavljaju, njihove uslove rada i njihov glas.'],
    },
    social: {
      en: ['SOCIAL PROTECTION', 'WORK CHANGES.\nWHAT KEEPS\nUS SECURE?', 'The future of work is also a conversation about social protection.', 'What happens to the European social model as work changes? Let’s discuss social protection and the choices shaping our shared future.'],
      de: ['SOZIALE SICHERHEIT', 'ARBEIT\nVERÄNDERT SICH.\nWAS GIBT\nUNS SICHERHEIT?', 'Zur Zukunft der Arbeit gehört auch die soziale Absicherung.', 'Was passiert mit dem europäischen Sozialmodell, wenn sich Arbeit verändert? Diskutieren wir über soziale Sicherheit und unsere gemeinsame Zukunft.'],
      bhs: ['SOCIJALNA ZAŠTITA', 'RAD SE MIJENJA.\nŠTA NAM PRUŽA\nSIGURNOST?', 'Budućnost rada je i razgovor o socijalnoj zaštiti.', 'Šta se dešava s evropskim socijalnim modelom dok se rad mijenja? Razgovarajmo o socijalnoj zaštiti i odlukama koje oblikuju zajedničku budućnost.'],
    },
    shortages: {
      en: ['LABOUR & DEMOGRAPHIC CHANGE', 'FEWER WORKERS.\nMORE QUESTIONS.', 'Labour shortages, migration and automation meet in the Balkans.', 'How do labour shortages and emigration shape investment in automation and demand for migrant workers? Let’s look at these changes together.'],
      de: ['ARBEIT & DEMOGRAFIE', 'WENIGER\nARBEITSKRÄFTE.\nMEHR FRAGEN.', 'Arbeitskräftemangel, Migration und Automatisierung treffen auf dem Balkan zusammen.', 'Wie beeinflussen Arbeitskräftemangel und Abwanderung Investitionen in Automatisierung und die Nachfrage nach migrantischen Arbeitskräften? Betrachten wir diese Entwicklungen gemeinsam.'],
      bhs: ['RAD I DEMOGRAFSKE PROMJENE', 'MANJE RADNIKA.\nVIŠE PITANJA.', 'Manjak radne snage, migracije i automatizacija susreću se na Balkanu.', 'Kako manjak radne snage i iseljavanje utiču na ulaganja u automatizaciju i potražnju za radnicima migrantima? Sagledajmo ove promjene zajedno.'],
    },
    cooperation: {
      en: ['THE BALKANS IN FOCUS', 'DIFFERENT\nPERSPECTIVES.\nSHARED QUESTIONS.', 'Researchers, unions, innovators and policymakers. One conversation about work.', 'The future of work needs different perspectives. Stay & Shape brings research, trade unions, civil society, innovators and policymakers into dialogue.'],
      de: ['DER BALKAN IM FOKUS', 'VIELE\nPERSPEKTIVEN.\nGEMEINSAME\nFRAGEN.', 'Forschung, Gewerkschaften, Innovation und Politik im Gespräch über Arbeit.', 'Die Zukunft der Arbeit braucht unterschiedliche Perspektiven. Stay & Shape bringt Forschung, Gewerkschaften, Zivilgesellschaft, Innovation und Politik in den Dialog.'],
      bhs: ['BALKAN U FOKUSU', 'RAZLIČITE\nPERSPEKTIVE.\nZAJEDNIČKA\nPITANJA.', 'Istraživači, sindikati, inovatori i donosioci odluka. Zajednički razgovor o radu.', 'Budućnost rada traži različite perspektive. Stay & Shape povezuje istraživače, sindikate, civilno društvo, inovatore i donosioce odluka.'],
    },
    future: {
      en: ['SHAPE WHAT COMES NEXT', 'THE FUTURE\nOF WORK NEEDS\nYOUR VOICE.', 'Join the conversation about technology, mobility and workers’ rights.', 'How will migration and technology shape the future of the Balkans? Be part of the conversation about what comes next.'],
      de: ['GESTALTEN SIE MIT', 'DIE ZUKUNFT\nDER ARBEIT\nBRAUCHT IHRE\nSTIMME.', 'Diskutieren Sie mit über Technologie, Mobilität und Arbeitnehmerrechte.', 'Wie werden Migration und Technologie die Zukunft des Balkans prägen? Gestalten Sie das Gespräch über das, was kommt, mit.'],
      bhs: ['OBLIKUJMO ONO ŠTO SLIJEDI', 'BUDUĆNOST\nRADA TREBA\nVAŠ GLAS.', 'Pridružite se razgovoru o tehnologiji, mobilnosti i radničkim pravima.', 'Kako će migracije i tehnologija oblikovati budućnost Balkana? Budite dio razgovora o onome što slijedi.'],
    },
  };
  const programmeInvitations = {
    en: 'Join the conversation at Stay & Shape in Sarajevo, 22–23 October 2026.',
    de: 'Diskutieren Sie mit bei Stay & Shape in Sarajevo, 22.–23. Oktober 2026.',
    bhs: 'Pridružite se razgovoru na konferenciji Stay & Shape u Sarajevu, 22–23. oktobra 2026.',
  };
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
  const formats = {
    square: { width: 1200, height: 1200 }, portrait: { width: 1080, height: 1350 },
    story: { width: 1080, height: 1920 }, landscape: { width: 1200, height: 630 },
  };
  const siteColors = getComputedStyle(document.documentElement);
  const brand = Object.fromEntries(['blue', 'red', 'yellow', 'ink'].map(key => [key, siteColors.getPropertyValue(`--color-${key}`).trim()]));
  const backgrounds = {
    blue: { paper: '#0642d9', ink: '#ffffff', accent: '#ffd21a', badgeInk: '#182039', motif: 'globe' },
    paper: { paper: '#f4f1ea', ink: '#172139', accent: '#0642d9', badgeInk: '#ffffff', motif: 'print' },
    signal: { paper: brand.red, ink: brand.ink, accent: brand.yellow, badgeInk: brand.ink, detailInk: brand.ink, footerInk: brand.ink, motif: 'conference-red', copyScale: .68 },
    night: { paper: '#111315', ink: '#ffffff', accent: brand.yellow, badgeInk: brand.ink, motif: 'conference-night', copyScale: .76 },
    hero: { paper: '#0642d9', ink: '#ffffff', accent: '#ffd21a', badgeInk: '#182039', image: './assets/sh-hero4.avif', positionX: .7, tallPositionX: .53, positionY: .5 },
    sarajevo: { paper: '#b91f22', ink: '#ffffff', accent: '#ffd21a', badgeInk: '#182039', image: './assets/part-sarajevo.avif', positionX: .55, positionY: .5 },
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
    const url = new URL(baseURL);
    for (const [key, value] of Object.entries({ share: variant, lang: language, background, format, platform })) url.searchParams.set(key, value);
    if (variant === 'programme') url.searchParams.set('message', programme);
    for (const key of ['badge', 'headline', 'subtitle']) {
      if (draft()[key] !== defaults()[key]) url.searchParams.set(key, draft()[key]);
    }
    url.hash = 'share';
    return url.href;
  }
  function announce(key) { status.textContent = text()[key]; }
  function wrapLines(context, value, width) {
    const lines = [];
    for (const paragraph of value.replace(/\r/g, '').trim().split(/\n+/)) {
      let line = '';
      for (const word of paragraph.split(/\s+/).filter(Boolean)) {
        const joined = line ? `${line} ${word}` : word;
        if (context.measureText(joined).width <= width) { line = joined; continue; }
        if (line) { lines.push(line); line = ''; }
        for (const char of Array.from(word)) {
          if (line && context.measureText(line + char).width > width) { lines.push(line); line = ''; }
          line += char;
        }
      }
      lines.push(line);
    }
    return lines;
  }
  function fittedBlock(context, value, x, y, width, height, maxSize, family, weight = '400') {
    let size = maxSize;
    let lines;
    for (; size >= .5; size -= .5) {
      context.font = `${weight} ${size}px ${family}`;
      lines = wrapLines(context, value, width);
      if (lines.length * size * 1.04 <= height) break;
    }
    lines.forEach((line, index) => context.fillText(line, x, y + index * size * 1.04));
  }
  function paintBackground(context, width, height, key) {
    const theme = backgrounds[key];
    context.fillStyle = theme.paper; context.fillRect(0, 0, width, height);
    if (theme.motif === 'conference-red' || theme.motif === 'conference-night') {
      context.save();
      // Repeat the hero's print dots, cut-paper colour blocks and yellow globe.
      context.fillStyle = theme.ink;
      context.globalAlpha = theme.motif === 'conference-red' ? .08 : .1;
      const step = width / 58;
      for (let y = step / 2; y < height; y += step) {
        for (let x = step / 2; x < width; x += step) {
          context.beginPath(); context.arc(x, y, width * .0009, 0, Math.PI * 2); context.fill();
        }
      }
      context.globalAlpha = 1;
      const radius = Math.min(width * .245, height * .27);
      const centreX = width * 1.02;
      const centreY = height * .44;
      if (theme.motif === 'conference-red') {
        context.fillStyle = brand.blue;
        context.beginPath();
        context.moveTo(width * .77, height * .19); context.lineTo(width * 1.1, height * .13);
        context.lineTo(width * 1.04, height * .72); context.lineTo(width * .7, height * .77);
        context.closePath(); context.fill();
      } else {
        context.fillStyle = brand.blue;
        context.beginPath();
        context.arc(centreX, centreY, radius * 1.08, 0, Math.PI * 2);
        context.fill();
        context.fillRect(0, height * .79, width, height * .21);
        context.fillStyle = brand.red;
        context.fillRect(0, height * .79, width, width * .006);
      }
      context.strokeStyle = brand.yellow;
      context.lineWidth = Math.max(1.5, radius * .045);
      for (const scale of [1, .55]) {
        context.beginPath(); context.ellipse(centreX, centreY, radius * scale, radius, 0, 0, Math.PI * 2); context.stroke();
      }
      context.beginPath(); context.moveTo(centreX, centreY - radius); context.lineTo(centreX, centreY + radius); context.stroke();
      for (const part of [-.5, 0, .5]) {
        const y = radius * part; const half = Math.sqrt(radius ** 2 - y ** 2);
        context.beginPath(); context.moveTo(centreX - half, centreY + y); context.lineTo(centreX + half, centreY + y); context.stroke();
      }
      context.restore();
      return;
    }
    if (theme.image) {
      const loaded = backgroundImages.get(key);
      if (loaded?.ready) {
        const image = loaded.image;
        const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
        const drawnWidth = image.naturalWidth * scale;
        const drawnHeight = image.naturalHeight * scale;
        const positionX = height / width > 1.5 ? theme.tallPositionX ?? theme.positionX : theme.positionX;
        context.drawImage(image, (width - drawnWidth) * positionX, (height - drawnHeight) * theme.positionY, drawnWidth, drawnHeight);
      }
      // Keep the original artwork visible while providing contrast for editable copy.
      const shade = context.createLinearGradient(0, 0, width, 0);
      shade.addColorStop(0, 'rgba(9,20,47,.88)');
      shade.addColorStop(.55, 'rgba(9,20,47,.7)');
      shade.addColorStop(1, 'rgba(9,20,47,.55)');
      context.fillStyle = shade; context.fillRect(0, 0, width, height);
      const footerShade = context.createLinearGradient(0, height * .6, 0, height);
      footerShade.addColorStop(0, 'rgba(9,20,47,0)');
      footerShade.addColorStop(1, 'rgba(9,20,47,.65)');
      context.fillStyle = footerShade; context.fillRect(0, 0, width, height);
      return;
    }
    context.save();
    context.strokeStyle = theme.accent; context.fillStyle = theme.accent; context.globalAlpha = .2;
    if (theme.motif === 'globe') {
      context.lineWidth = 5; context.translate(width * .95, height * .34); context.rotate(-.2);
      const radius = width * .28;
      [1, .6, .25].forEach(scale => { context.beginPath(); context.ellipse(0, 0, radius * scale, radius, 0, 0, Math.PI * 2); context.stroke(); });
      [-.5, 0, .5].forEach(part => { const y = radius * part; const half = Math.sqrt(radius ** 2 - y ** 2); context.beginPath(); context.moveTo(-half, y); context.lineTo(half, y); context.stroke(); });
    } else if (theme.motif === 'print') {
      context.globalAlpha = .07; context.lineWidth = 1;
      for (let x = 0; x < width; x += width / 20) { context.beginPath(); context.moveTo(x, 0); context.lineTo(x, height); context.stroke(); }
      for (let y = 0; y < height; y += width / 20) { context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke(); }
      context.globalAlpha = .16; context.lineWidth = width * .018;
      context.beginPath(); context.arc(width * .98, height * .35, width * .27, 0, Math.PI * 2); context.stroke();
    }
    context.restore();
  }
  function drawCard() {
    const dimensions = formats[format];
    canvas.width = dimensions.width; canvas.height = dimensions.height;
    const scale = dimensions.width / 1200;
    const height = dimensions.height / scale;
    ctx.scale(scale, scale);
    paintBackground(ctx, 1200, height, background);
    const theme = backgrounds[background];
    const landscape = format === 'landscape';
    const story = format === 'story';
    const portrait = format === 'portrait';
    const margin = story ? 96 : landscape ? 64 : 72;
    // The vertical layout leaves space around the content for story/status app controls.
    const headerY = story ? 210 : landscape ? 34 : 64;
    const badgeY = story ? 390 : landscape ? 112 : portrait ? 255 : 237;
    const headlineY = story ? 560 : landscape ? 214 : portrait ? 395 : 365;
    const subtitleY = story ? height - 660 : landscape ? 445 : portrait ? height - 390 : 835;
    const ruleY = story ? height - 520 : landscape ? 528 : portrait ? height - 222 : 978;
    const footerY = story ? height - 425 : landscape ? 550 : portrait ? height - 174 : 1020;
    const siteY = story ? height - 345 : landscape ? 602 : portrait ? height - 90 : 1108;
    const right = story ? 1040 : 1200 - margin;
    const width = right - margin;
    const mono = '"IBM Plex Mono", monospace';
    const sans = 'Outfit, sans-serif';
    const display = '"Bebas Neue", Impact, sans-serif';
    ctx.textBaseline = 'top'; ctx.fillStyle = theme.ink;
    const brandSize = landscape ? 42 : 61;
    ctx.font = `400 ${brandSize}px ${display}`; ctx.fillText('STAY & SHAPE', margin, headerY);
    const brandWidth = ctx.measureText('STAY & SHAPE').width;
    ctx.fillStyle = theme.accent; ctx.fillRect(margin + brandWidth + 20, headerY + brandSize * .72, 12, 12);
    ctx.font = `500 ${landscape ? 19 : 23}px ${mono}`;
    ctx.fillStyle = theme.detailInk ?? theme.accent;
    ctx.textAlign = 'right'; ctx.fillText('SARAJEVO / 2026', right, headerY + 20); ctx.textAlign = 'left';
    if (draft().badge.trim()) {
      let badgeSize = landscape ? 23 : 27;
      do { ctx.font = `600 ${badgeSize}px ${mono}`; if (ctx.measureText(draft().badge).width <= width - 48) break; badgeSize--; } while (badgeSize > 12);
      const badgeWidth = ctx.measureText(draft().badge).width + 48;
      ctx.fillStyle = theme.accent; ctx.fillRect(margin, badgeY, badgeWidth, 64);
      ctx.fillStyle = theme.badgeInk; ctx.fillText(draft().badge, margin + 24, badgeY + (64 - badgeSize) / 2);
    }
    ctx.fillStyle = theme.ink;
    const copyWidth = width * (theme.copyScale ?? (theme.image ? .76 : 1));
    fittedBlock(ctx, draft().headline, margin, headlineY, copyWidth, subtitleY - headlineY - (landscape ? 28 : 48), landscape ? 96 : story ? 180 : portrait ? 165 : 154, display);
    fittedBlock(ctx, draft().subtitle, margin, subtitleY, copyWidth, ruleY - subtitleY - 32, landscape ? 27 : 35, sans, '500');
    ctx.strokeStyle = theme.ink; ctx.globalAlpha = .4; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(margin, ruleY); ctx.lineTo(right, ruleY); ctx.stroke(); ctx.globalAlpha = 1;
    ctx.fillStyle = theme.footerInk ?? theme.accent; ctx.font = `400 ${landscape ? 38 : 62}px ${display}`; ctx.fillText('SARAJEVO', margin, footerY);
    ctx.fillStyle = theme.ink; ctx.font = `500 ${landscape ? 29 : 34}px ${mono}`;
    ctx.textAlign = 'right'; ctx.fillText('22—23.10.2026', right, footerY + (landscape ? 3 : 15)); ctx.textAlign = 'left';
    ctx.font = `400 ${landscape ? 18 : 23}px ${mono}`; ctx.fillText('www.stayandshape.com', margin, siteY);
    canvas.setAttribute('aria-label', `${draft().badge}. ${draft().headline}. ${draft().subtitle}. Sarajevo, 22–23.10.2026. www.stayandshape.com`);
  }
  function filename() { return `stay-shape-${variant}-${background}-${format}-${language}.png`; }
  function prepareImage() {
    const version = ++exportVersion;
    const name = filename();
    currentFile = null;
    nativeButton.disabled = true;
    downloadButton.disabled = true;
    clearTimeout(exportTimer);
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
  document.fonts.ready.then(() => { drawCard(); prepareImage(); });
})();
