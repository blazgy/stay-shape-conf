(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.StayShapeDesign = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
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
  const formats = {
    square: { width: 1200, height: 1200 }, portrait: { width: 1080, height: 1350 },
    story: { width: 1080, height: 1920 }, landscape: { width: 1200, height: 630 },
  };
  const brand = { blue: '#0642d9', red: '#ef3028', yellow: '#ffd21a', ink: '#050505' };
  const backgrounds = {
    blue: { paper: '#0642d9', ink: '#ffffff', accent: '#ffd21a', badgeInk: '#182039', motif: 'globe' },
    paper: { paper: '#f4f1ea', ink: '#172139', accent: '#0642d9', badgeInk: '#ffffff', motif: 'print' },
    signal: { paper: brand.red, ink: brand.ink, accent: brand.yellow, badgeInk: brand.ink, detailInk: brand.ink, footerInk: brand.ink, motif: 'conference-red', copyScale: .68 },
    night: { paper: '#111315', ink: '#ffffff', accent: brand.yellow, badgeInk: brand.ink, motif: 'conference-night', copyScale: .76 },
    hero: { paper: '#0642d9', ink: '#ffffff', accent: '#ffd21a', badgeInk: '#182039', image: './assets/sh-hero4.avif', positionX: .7, tallPositionX: .53, positionY: .5 },
    sarajevo: { paper: '#b91f22', ink: '#ffffff', accent: '#ffd21a', badgeInk: '#182039', image: './assets/part-sarajevo.avif', positionX: .55, positionY: .5 },
  };

  const baseURL = 'https://www.stayandshape.com/';
  const platformFormats = { facebook: 'square', instagram: 'portrait', linkedin: 'portrait', whatsapp: 'story', tiktok: 'story' };
  const allowed = (values, value, fallback) => Object.hasOwn(values, value) ? value : fallback;
  function normalizeDesign(params) {
    const language = allowed(messages, params.get('lang'), 'en');
    const variant = ['attending', 'speaking', 'join', 'programme'].includes(params.get('share')) ? params.get('share') : 'attending';
    const programme = allowed(programmeMessages, params.get('message'), 'voice');
    const background = allowed(backgrounds, params.get('background'), 'blue');
    const platform = allowed(platformFormats, params.get('platform'), 'facebook');
    let format = allowed(formats, params.get('format'), platformFormats[platform]);
    if (platform === 'instagram' && format === 'landscape') format = 'portrait';
    const text = messages[language];
    const selected = variant === 'programme'
      ? programmeMessages[programme][language]
      : [text[variant].badge, text[variant].lines.join('\n'), `${text.topic}\n${text.focus}`];
    const clean = (key, fallback, limit) => (params.has(key) ? params.get(key) : fallback).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').slice(0, limit);
    return { language, variant, programme, background, platform, format,
      badge: clean('badge', selected[0], 60), headline: clean('headline', selected[1], 180), subtitle: clean('subtitle', selected[2], 160) };
  }
  function designParams(design) {
    const params = new URLSearchParams({ v: '1', share: design.variant, lang: design.language, background: design.background, format: design.format, platform: design.platform });
    if (design.variant === 'programme') params.set('message', design.programme);
    for (const key of ['badge', 'headline', 'subtitle']) params.set(key, design[key]);
    return params;
  }
  return { messages, programmeMessages, programmeInvitations, formats, brand, backgrounds, baseURL, normalizeDesign, designParams };
});
