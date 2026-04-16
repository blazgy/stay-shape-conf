const STORAGE_KEY = "stay-shape-language";

const content = {
  en: {
    meta: {
      title: "Stay & Shape | Vienna 2026 Conference",
      description:
        "Stay & Shape is a Vienna conference on youth migration, trade union renewal and the digital transformation of work in Southeast Europe.",
    },
    nav: {
      overview: "Overview",
      context: "Context",
      programme: "Programme",
      audience: "Audience",
      register: "Register",
    },
    hero: {
      eyebrow: "Conference in Vienna | 17-19 June 2026",
      title:
        "Stay & Shape: Youth, Migration and the Digital Transformation of Work in Southeast Europe",
      lead:
        "A one-page invitation to the Vienna event, bringing together young trade unionists, labour researchers and policy voices to discuss migration, institutional strength and the future of work.",
      ctaPrimary: "Register interest",
      ctaSecondary: "See programme highlights",
      panelLabel: "Vienna focus",
      panelNote:
        "This first release focuses only on the Vienna event. Detailed programme updates will follow for registered participants.",
      facts: [
        {
          label: "Venue",
          value: "Vienna, Austria",
        },
        {
          label: "Format",
          value: "Two days and two nights, with a political evening and a content-focused day",
        },
        {
          label: "Participants",
          value:
            "70 participants from Austria, Albania, Bosnia and Herzegovina, Moldova, Montenegro, Serbia and other EU countries",
        },
      ],
    },
    overview: {
      eyebrow: "Conference overview",
      title: "A working meeting about staying power",
      copy:
        "Stay & Shape examines what it takes to give young people reasons to stay, organise and build decent work across borders. The Vienna event combines high-level political discussion with workshops and analysis aimed at union renewal, youth representation and worker-centred approaches to digital change.",
      points: [
        {
          title: "Partner organisation",
          copy: "Austrian Trade Union Federation (OEGB), International Department",
        },
        {
          title: "Focus of the Vienna event",
          copy:
            "Youth recruitment, strong institutional structures, practical organising tools and the changing conditions created by AI and automation.",
        },
        {
          title: "Why now",
          copy:
            "Traditional sectors no longer guarantee security, while digitalisation is reshaping wages, surveillance and job quality.",
        },
      ],
    },
    context: {
      eyebrow: "Political context",
      title: "Migration pressure and digital change are colliding",
      copy:
        "Across Southeastern Europe, many young people leave because wages are low and employment is unstable. At the same time, AI, automation and algorithmic management are reshaping the work that remains. This creates a double pressure on unions: they must respond to the economic drivers behind migration while also shaping digital transformation so that it improves working lives instead of deepening precarity and surveillance.",
      alignmentEyebrow: "Future of work",
      alignmentCopy:
        "The conference treats migration and digitalisation as one shared labour question. Participants will compare organising strategies, digital-rights concerns and policy tools that can keep work fair, visible and worth staying for.",
    },
    objectives: {
      eyebrow: "Objectives",
      title: "What the Vienna event is designed to do",
      list: [
        {
          title: "Strengthen youth structures",
          copy:
            "Share practical approaches to youth recruitment and institutional youth structures together with the Austrian Trade Union Youth (OEGJ).",
        },
        {
          title: "Connect labour and technology",
          copy:
            "Frame AI, automation and digital labour management as core trade union questions rather than isolated tech topics.",
        },
        {
          title: "Develop concrete initiatives",
          copy:
            "Move from analysis to concrete actions that help young people stay, organise and shape better work across borders.",
        },
      ],
    },
    programme: {
      eyebrow: "Vienna highlights",
      title: "A political evening and a content-driven day",
      intro:
        "The Vienna event is intentionally shown as a flexible set of highlights. The structure is ready for updates, while the current page focuses on the confirmed core format.",
      cards: [
        {
          label: "Evening format",
          meta: "Political opening",
          title: "Power & Participation",
          copy:
            "The first evening is built as a political format that opens the conference with a broad discussion on youth employment, AI, automation and workers' rights.",
          bullets: [
            "30-minute keynote input on AI, robotics and labour-market change",
            "High-level political panel with balanced representation",
            "Focus on what technological change means for youth employment and job quality",
          ],
          speakers: [
            "Tea Jarc, ETUC",
            "Knut Dethlefsen, FES Future of Work",
            "Amelie Muthsam, Austrian Federal Council",
            "Additional panel guest to be announced",
            "Moderator to be announced",
          ],
        },
        {
          label: "Workshops",
          meta: "Institutional practice",
          title: "The Austrian model and youth organising",
          copy:
            "Hands-on sessions will explore vocational training, Young Workers Councils and how trade union recruitment can adapt to digital-age working lives.",
          bullets: [
            "Institutional youth structures and participation pathways",
            "Recruitment methods for digitally mediated work realities",
            "Exchange with Austrian union youth structures",
          ],
          speakers: [],
        },
        {
          label: "Analysis",
          meta: "Comparative lens",
          title: "The precarity trap",
          copy:
            "Comparative analysis will look at youth unemployment, the role of dual education systems and the conditions that push young people to leave.",
          bullets: [
            "Comparative regional data on youth labour-market insecurity",
            "Discussion of dual education systems and institutional resilience",
            "Connection between precarious work and migration pressure",
          ],
          speakers: [],
        },
      ],
    },
    audience: {
      eyebrow: "Who should attend",
      title: "Built for organisers, researchers and policy voices",
      list: [
        {
          title: "Young trade unionists",
          copy: "Participants under 40 who are building stronger structures for youth representation and recruitment.",
        },
        {
          title: "Youth committee representatives",
          copy: "People working inside union and workplace structures who want practical institutional models.",
        },
        {
          title: "Researchers and experts",
          copy: "Labour market researchers, AI policy experts and digital-rights advocates contributing evidence and strategy.",
        },
        {
          title: "Dialogue partners",
          copy: "Young employer representatives and political stakeholders joining the conversation on fair labour standards.",
        },
      ],
    },
    facts: {
      eyebrow: "Key facts",
      items: [
        {
          title: "Date",
          copy: "17-19 June 2026",
        },
        {
          title: "Location",
          copy: "Vienna, Austria",
        },
        {
          title: "Participant target",
          copy: "70 people",
        },
        {
          title: "Countries represented",
          copy: "Austria, Albania, Bosnia and Herzegovina, Moldova, Montenegro, Serbia and other EU countries",
        },
      ],
    },
    register: {
      eyebrow: "Registration",
      title: "Register your interest for Vienna",
      copy:
        "Share your details to receive a confirmation email and future updates about the Vienna event. Registrations are stored securely for this event only.",
      notes: [
        {
          title: "What happens next",
          copy:
            "After submitting, you will receive a confirmation email. Further practical information and programme updates will follow later.",
        },
        {
          title: "Participation target",
          copy:
            "The page communicates a target of 70 participants, but submissions remain open while organisers review registrations.",
        },
      ],
    },
    form: {
      nameLabel: "Full name",
      namePlaceholder: "Your full name",
      emailLabel: "Email address",
      emailPlaceholder: "you@example.org",
      consentLabel:
        "I agree that my name and email may be stored for conference registration and related updates about this event.",
      consentHint:
        "Your data is used only for organising this event and related communication.",
      submit: "Submit registration",
      submitting: "Submitting...",
      messages: {
        success:
          "Registration received. Please check your inbox for the confirmation email.",
        successPendingEmail:
          "Registration received. We could not send the confirmation email right now, but your details were saved and the organisers will follow up.",
        duplicate:
          "This email is already registered for the Vienna event.",
        error:
          "Something went wrong while sending your registration. Please try again in a moment.",
      },
      errors: {
        nameRequired: "Please enter your full name.",
        emailRequired: "Please enter your email address.",
        emailInvalid: "Please enter a valid email address.",
        consentRequired: "Please confirm the privacy notice to continue.",
        spamDetected: "Your submission could not be processed.",
      },
    },
    faq: {
      eyebrow: "FAQ",
      items: [
        {
          question: "Is this page already the full programme?",
          answer:
            "No. This first version presents the confirmed structure and highlights for Vienna. More detailed scheduling will follow later.",
        },
        {
          question: "Will the programme still be updated?",
          answer:
            "Yes. This first version shows the confirmed structure and key highlights, while further practical details will be shared later.",
        },
        {
          question: "What happens with my registration data?",
          answer:
            "Your name and email are stored for organising this event and sending related updates. No public participant list is shown on the page.",
        },
      ],
    },
    footer: {
      eyebrow: "Partner organisation",
      partner: "Austrian Trade Union Federation (OEGB), International Department",
      copy:
        "This landing page covers the Vienna event only. Additional programme details will be shared with registered participants.",
    },
  },
  de: {
    meta: {
      title: "Stay & Shape | Wien 2026 Konferenz",
      description:
        "Stay & Shape ist eine Konferenz in Wien zu Jugendmigration, gewerkschaftlicher Erneuerung und der digitalen Transformation der Arbeit in Suedosteuropa.",
    },
    nav: {
      overview: "Ueberblick",
      context: "Kontext",
      programme: "Programm",
      audience: "Zielgruppe",
      register: "Anmeldung",
    },
    hero: {
      eyebrow: "Konferenz in Wien | 17.-19. Juni 2026",
      title:
        "Stay & Shape: Jugend, Migration und die digitale Transformation der Arbeit in Suedosteuropa",
      lead:
        "Eine Einladung zur Wiener Veranstaltung, die junge Gewerkschafter:innen, Arbeitsmarktforscher:innen und politische Stimmen zusammenbringt, um ueber Migration, institutionelle Staerke und die Zukunft der Arbeit zu diskutieren.",
      ctaPrimary: "Interesse anmelden",
      ctaSecondary: "Programm-Hoehepunkte ansehen",
      panelLabel: "Fokus Wien",
      panelNote:
        "Diese erste Version konzentriert sich nur auf die Wiener Veranstaltung. Detaillierte Programm-Updates folgen fuer registrierte Teilnehmende.",
      facts: [
        {
          label: "Ort",
          value: "Wien, Oesterreich",
        },
        {
          label: "Format",
          value: "Zwei Tage und zwei Naechte mit einem politischen Abend und einem inhaltlichen Arbeitstag",
        },
        {
          label: "Teilnehmende",
          value:
            "70 Teilnehmende aus Oesterreich, Albanien, Bosnien und Herzegowina, Moldau, Montenegro, Serbien und weiteren EU-Laendern",
        },
      ],
    },
    overview: {
      eyebrow: "Konferenzueberblick",
      title: "Ein Arbeitstreffen ueber Bleibeperspektiven",
      copy:
        "Stay & Shape fragt danach, was jungen Menschen Gruende gibt zu bleiben, sich zu organisieren und grenzueberschreitend gute Arbeit zu gestalten. Die Wiener Veranstaltung verbindet politische Diskussionen auf hoher Ebene mit Workshops und Analysen zu gewerkschaftlicher Erneuerung, Jugendvertretung und arbeitnehmerorientierter Digitalisierung.",
      points: [
        {
          title: "Partnerorganisation",
          copy: "Oesterreichischer Gewerkschaftsbund (OEGB), Internationale Abteilung",
        },
        {
          title: "Schwerpunkt in Wien",
          copy:
            "Jugendansprache, starke institutionelle Strukturen, praktische Organisierungsansaetze und veraenderte Arbeitsbedingungen durch KI und Automatisierung.",
        },
        {
          title: "Warum jetzt",
          copy:
            "Traditionelle Branchen bieten immer seltener Sicherheit, waehrend Digitalisierung Lohnniveau, Ueberwachung und Arbeitsqualitaet neu formt.",
        },
      ],
    },
    context: {
      eyebrow: "Politischer Kontext",
      title: "Migrationsdruck und digitaler Wandel treffen gleichzeitig aufeinander",
      copy:
        "In Suedosteuropa verlassen viele junge Menschen ihre Heimat wegen niedriger Loehne und unsicherer Beschaeftigung. Gleichzeitig veraendern KI, Automatisierung und algorithmisches Management die Arbeit, die bleibt. Fuer Gewerkschaften entsteht dadurch doppelter Druck: Sie muessen auf die wirtschaftlichen Ursachen von Migration reagieren und zugleich den digitalen Wandel so gestalten, dass er Arbeit verbessert statt Prekaritaet und Ueberwachung zu vertiefen.",
      alignmentEyebrow: "Zukunft der Arbeit",
      alignmentCopy:
        "Die Konferenz behandelt Migration und Digitalisierung als eine gemeinsame arbeitsmarktpolitische Frage. Teilnehmende vergleichen Organisierungsstrategien, digitale Rechte und politische Instrumente, damit Arbeit fair, sichtbar und lebenswert bleibt.",
    },
    objectives: {
      eyebrow: "Ziele",
      title: "Worauf die Wiener Veranstaltung zielt",
      list: [
        {
          title: "Jugendstrukturen staerken",
          copy:
            "Praktische Zugaenge zu Jugendansprache und institutionellen Jugendstrukturen gemeinsam mit der Oesterreichischen Gewerkschaftsjugend (OEGJ) teilen.",
        },
        {
          title: "Arbeit und Technologie verbinden",
          copy:
            "KI, Automatisierung und digitales Arbeitsmanagement als zentrale gewerkschaftliche Fragen statt als isolierte Technikthemen diskutieren.",
        },
        {
          title: "Konkrete Initiativen entwickeln",
          copy:
            "Von der Analyse zu konkreten Schritten kommen, die jungen Menschen Gruende zum Bleiben, Organisieren und Mitgestalten besserer Arbeit geben.",
        },
      ],
    },
    programme: {
      eyebrow: "Hoehepunkte in Wien",
      title: "Ein politischer Abend und ein inhaltlicher Arbeitstag",
      intro:
        "Die Wiener Veranstaltung wird bewusst als flexibles Set von Programm-Hoehepunkten gezeigt. Die Struktur ist bereit fuer Updates, waehrend die aktuelle Seite das bestaetigte Kernformat sichtbar macht.",
      cards: [
        {
          label: "Abendformat",
          meta: "Politische Eroeffnung",
          title: "Power & Participation",
          copy:
            "Der erste Abend ist als politisches Format angelegt und eroefnet die Konferenz mit einer breiten Diskussion zu Jugendbeschaeftigung, KI, Automatisierung und Arbeitnehmerrechten.",
          bullets: [
            "30-minuetiger Keynote-Input zu KI, Robotik und Veraenderungen am Arbeitsmarkt",
            "Hochrangiges politisches Panel mit ausgewogener Besetzung",
            "Fokus auf die Bedeutung technologischer Veraenderung fuer Jugendbeschaeftigung und Arbeitsqualitaet",
          ],
          speakers: [
            "Tea Jarc, EGB",
            "Knut Dethlefsen, FES Future of Work",
            "Amelie Muthsam, Bundesrat",
            "Weiterer Panelgast wird noch bekanntgegeben",
            "Moderation wird noch bekanntgegeben",
          ],
        },
        {
          label: "Workshops",
          meta: "Institutionelle Praxis",
          title: "Das oesterreichische Modell und Jugendorganisierung",
          copy:
            "Praxisnahe Sessions befassen sich mit Berufsausbildung, Jugendvertrauensstrukturen und der Frage, wie sich gewerkschaftliche Ansprache an digitale Arbeitsrealitaeten anpassen kann.",
          bullets: [
            "Institutionelle Jugendstrukturen und Beteiligungswege",
            "Recruiting-Ansatz fuer digital gepraegte Arbeitswelten",
            "Austausch mit oesterreichischen Gewerkschaftsjugend-Strukturen",
          ],
          speakers: [],
        },
        {
          label: "Analyse",
          meta: "Vergleichender Blick",
          title: "Die Prekaritaetsfalle",
          copy:
            "Eine vergleichende Analyse betrachtet Jugendarbeitslosigkeit, die Rolle dualer Ausbildungssysteme und jene Bedingungen, die junge Menschen zum Weggehen bewegen.",
          bullets: [
            "Vergleichsdaten zu jugendlicher Arbeitsmarktunsicherheit in der Region",
            "Diskussion ueber duale Ausbildungssysteme und institutionelle Resilienz",
            "Verbindung zwischen prekärer Arbeit und Migrationsdruck",
          ],
          speakers: [],
        },
      ],
    },
    audience: {
      eyebrow: "Zielgruppe",
      title: "Gedacht fuer Organisierende, Forschung und Politik",
      list: [
        {
          title: "Junge Gewerkschafter:innen",
          copy: "Teilnehmende unter 40, die Jugendvertretung und Ansprache in ihren Organisationen staerken wollen.",
        },
        {
          title: "Jugendgremien und Vertretungen",
          copy: "Menschen in gewerkschaftlichen und betrieblichen Strukturen, die praktische institutionelle Modelle suchen.",
        },
        {
          title: "Forscher:innen und Expert:innen",
          copy: "Arbeitsmarktforscher:innen, KI-Politikexpert:innen und Digital-Rights-Akteur:innen mit Evidenz und Strategieperspektiven.",
        },
        {
          title: "Dialogpartner",
          copy: "Junge Arbeitgebervertreter:innen und politische Stakeholder, die ueber faire Arbeitsstandards mitdiskutieren.",
        },
      ],
    },
    facts: {
      eyebrow: "Kerndaten",
      items: [
        {
          title: "Datum",
          copy: "17.-19. Juni 2026",
        },
        {
          title: "Ort",
          copy: "Wien, Oesterreich",
        },
        {
          title: "Zielgroesse",
          copy: "70 Personen",
        },
        {
          title: "Vertretene Laender",
          copy: "Oesterreich, Albanien, Bosnien und Herzegowina, Moldau, Montenegro, Serbien und weitere EU-Laender",
        },
      ],
    },
    register: {
      eyebrow: "Anmeldung",
      title: "Interesse fuer Wien anmelden",
      copy:
        "Teilen Sie Ihre Daten, um eine Bestaetigungs-E-Mail und weitere Informationen zur Wiener Veranstaltung zu erhalten. Die Daten werden ausschliesslich fuer dieses Event gespeichert.",
      notes: [
        {
          title: "Wie es weitergeht",
          copy:
            "Nach dem Absenden erhalten Sie eine Bestaetigungs-E-Mail. Weitere praktische Informationen und Programm-Updates folgen spaeter.",
        },
        {
          title: "Teilnahmeziel",
          copy:
            "Die Seite kommuniziert ein Ziel von 70 Teilnehmenden, die Anmeldungen bleiben jedoch offen, waehrend das Organisationsteam sie bearbeitet.",
        },
      ],
    },
    form: {
      nameLabel: "Vollstaendiger Name",
      namePlaceholder: "Ihr vollstaendiger Name",
      emailLabel: "E-Mail-Adresse",
      emailPlaceholder: "sie@example.org",
      consentLabel:
        "Ich bin damit einverstanden, dass mein Name und meine E-Mail fuer die Konferenzanmeldung und fuer Informationen zu dieser Veranstaltung gespeichert werden.",
      consentHint:
        "Ihre Daten werden nur fuer die Organisation dieser Veranstaltung und fuer damit verbundene Kommunikation verwendet.",
      submit: "Anmeldung absenden",
      submitting: "Wird gesendet...",
      messages: {
        success:
          "Ihre Anmeldung wurde erfasst. Bitte pruefen Sie Ihr Postfach auf die Bestaetigungs-E-Mail.",
        successPendingEmail:
          "Ihre Anmeldung wurde erfasst. Die Bestaetigungs-E-Mail konnte gerade nicht gesendet werden, aber Ihre Daten wurden gespeichert und das Organisationsteam meldet sich bei Bedarf.",
        duplicate:
          "Diese E-Mail-Adresse ist bereits fuer die Wiener Veranstaltung registriert.",
        error:
          "Beim Senden Ihrer Anmeldung ist ein Fehler aufgetreten. Bitte versuchen Sie es gleich noch einmal.",
      },
      errors: {
        nameRequired: "Bitte geben Sie Ihren vollstaendigen Namen ein.",
        emailRequired: "Bitte geben Sie Ihre E-Mail-Adresse ein.",
        emailInvalid: "Bitte geben Sie eine gueltige E-Mail-Adresse ein.",
        consentRequired: "Bitte bestaetigen Sie den Datenschutzhinweis, um fortzufahren.",
        spamDetected: "Ihre Eingabe konnte nicht verarbeitet werden.",
      },
    },
    faq: {
      eyebrow: "FAQ",
      items: [
        {
          question: "Ist das bereits das vollstaendige Programm?",
          answer:
            "Nein. Diese erste Version zeigt die bestaetigte Struktur und die Hoehepunkte fuer Wien. Eine genauere Taktung folgt spaeter.",
        },
        {
          question: "Wird das Programm noch aktualisiert?",
          answer:
            "Ja. Diese erste Version zeigt die bestaetigte Struktur und die wichtigsten Formate. Weitere praktische Details werden spaeter geteilt.",
        },
        {
          question: "Was passiert mit meinen Registrierungsdaten?",
          answer:
            "Ihr Name und Ihre E-Mail werden fuer die Organisation dieser Veranstaltung und fuer damit verbundene Updates gespeichert. Es gibt keine oeffentliche Teilnehmendenliste auf der Seite.",
        },
      ],
    },
    footer: {
      eyebrow: "Partnerorganisation",
      partner: "Oesterreichischer Gewerkschaftsbund (OEGB), Internationale Abteilung",
      copy:
        "Diese Landingpage behandelt nur die Wiener Veranstaltung. Weitere Programmdetails werden mit registrierten Teilnehmenden geteilt.",
    },
  },
};

const elements = {
  form: document.getElementById("registration-form"),
  status: document.getElementById("form-status"),
  submitButton: document.getElementById("submit-button"),
  metaDescription: document.querySelector('meta[name="description"]'),
  langButtons: document.querySelectorAll("[data-lang-button]"),
};

let currentLanguage = getInitialLanguage();

document.addEventListener("DOMContentLoaded", () => {
  renderLanguage(currentLanguage);
  bindLanguageSwitch();
  bindRegistrationForm();
  initMotion();
});

function getInitialLanguage() {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "de") {
    return stored;
  }
  return "en";
}

function getContent(path, language = currentLanguage) {
  return path.split(".").reduce((value, key) => value && value[key], content[language]);
}

function renderLanguage(language) {
  currentLanguage = language;
  document.documentElement.lang = language;
  window.localStorage.setItem(STORAGE_KEY, language);
  document.title = getContent("meta.title", language);
  if (elements.metaDescription) {
    elements.metaDescription.setAttribute("content", getContent("meta.description", language));
  }

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const value = getContent(node.getAttribute("data-i18n"), language);
    if (typeof value === "string") {
      node.textContent = value;
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    const value = getContent(node.getAttribute("data-i18n-placeholder"), language);
    if (typeof value === "string") {
      node.setAttribute("placeholder", value);
    }
  });

  renderHeroFacts(language);
  renderList(
    document.getElementById("overview-points"),
    getContent("overview.points", language),
    "detail-item"
  );
  renderList(
    document.getElementById("objectives-list"),
    getContent("objectives.list", language),
    "objective-item"
  );
  renderProgramme(language);
  renderAudience(language);
  renderFacts(language);
  renderRegisterNotes(language);
  renderFaq(language);
  clearFormFeedback();
  syncLanguageButtons();
}

function renderHeroFacts(language) {
  const container = document.getElementById("hero-facts");
  const facts = getContent("hero.facts", language);
  container.innerHTML = facts
    .map(
      (fact) => `
        <article class="hero-fact-card">
          <p class="hero-fact-card__label">${escapeHtml(fact.label)}</p>
          <p class="hero-fact-card__value">${escapeHtml(fact.value)}</p>
        </article>
      `
    )
    .join("");
}

function renderList(container, items, itemClass) {
  if (container.id === "overview-points") {
    container.className = "detail-panel detail-list reveal";
  }
  container.innerHTML = items
    .map(
      (item) => `
        <article class="${itemClass}">
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.copy)}</p>
        </article>
      `
    )
    .join("");
}

function renderProgramme(language) {
  const container = document.getElementById("programme-highlights");
  const cards = getContent("programme.cards", language);
  container.innerHTML = cards
    .map(
      (card) => `
        <article class="programme-card">
          <div class="programme-card__meta">
            <span>${escapeHtml(card.label)}</span>
            <span>${escapeHtml(card.meta)}</span>
          </div>
          <h3 class="programme-card__title">${escapeHtml(card.title)}</h3>
          <p>${escapeHtml(card.copy)}</p>
          <ul class="programme-list">
            ${card.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}
          </ul>
          ${
            card.speakers.length
              ? `<div class="programme-speakers">${card.speakers
                  .map((speaker) => `<span>${escapeHtml(speaker)}</span>`)
                  .join("")}</div>`
              : ""
          }
        </article>
      `
    )
    .join("");
}

function renderAudience(language) {
  const container = document.getElementById("audience-list");
  const items = getContent("audience.list", language);
  container.className = "audience-list";
  container.innerHTML = items
    .map(
      (item) => `
        <article class="audience-item">
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.copy)}</p>
        </article>
      `
    )
    .join("");
}

function renderFacts(language) {
  const container = document.getElementById("facts-grid");
  const items = getContent("facts.items", language);
  container.innerHTML = items
    .map(
      (item) => `
        <article class="facts-item">
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.copy)}</p>
        </article>
      `
    )
    .join("");
}

function renderRegisterNotes(language) {
  const container = document.getElementById("register-notes");
  const items = getContent("register.notes", language);
  container.innerHTML = items
    .map(
      (item) => `
        <article class="register-note">
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.copy)}</p>
        </article>
      `
    )
    .join("");
}

function renderFaq(language) {
  const container = document.getElementById("faq-list");
  const items = getContent("faq.items", language);
  container.innerHTML = items
    .map(
      (item) => `
        <article class="faq-item">
          <h3>${escapeHtml(item.question)}</h3>
          <p>${escapeHtml(item.answer)}</p>
        </article>
      `
    )
    .join("");
}

function bindLanguageSwitch() {
  elements.langButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextLanguage = button.getAttribute("data-lang-button");
      if (nextLanguage && nextLanguage !== currentLanguage) {
        renderLanguage(nextLanguage);
      }
    });
  });
}

function syncLanguageButtons() {
  elements.langButtons.forEach((button) => {
    const isActive = button.getAttribute("data-lang-button") === currentLanguage;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function bindRegistrationForm() {
  if (!elements.form) {
    return;
  }

  elements.form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearFormFeedback();

    const formData = new FormData(elements.form);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim().toLowerCase(),
      consent: elements.form.querySelector("#consent").checked,
      website: String(formData.get("website") || "").trim(),
      language: currentLanguage,
    };

    const clientErrors = validateClientPayload(payload);
    if (Object.keys(clientErrors).length > 0) {
      showFieldErrors(clientErrors);
      showStatus("error", mapFirstError(clientErrors));
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await safeJson(response);

      if (response.status === 201) {
        elements.form.reset();
        showStatus("success", getContent("form.messages.success"));
        return;
      }

      if (response.status === 202) {
        elements.form.reset();
        showStatus("info", getContent("form.messages.successPendingEmail"));
        return;
      }

      if (response.status === 409) {
        showStatus("info", getContent("form.messages.duplicate"));
        return;
      }

      if (response.status === 400 && result && result.fieldErrors) {
        const localizedErrors = {};
        Object.entries(result.fieldErrors).forEach(([field, code]) => {
          localizedErrors[field] = mapErrorCode(code);
        });
        showFieldErrors(localizedErrors);
        showStatus("error", mapFirstError(localizedErrors));
        return;
      }

      showStatus("error", getContent("form.messages.error"));
    } catch (error) {
      console.error("Registration request failed", error);
      showStatus("error", getContent("form.messages.error"));
    } finally {
      setSubmitting(false);
    }
  });
}

function validateClientPayload(payload) {
  const errors = {};
  if (!payload.name) {
    errors.name = getContent("form.errors.nameRequired");
  }
  if (!payload.email) {
    errors.email = getContent("form.errors.emailRequired");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    errors.email = getContent("form.errors.emailInvalid");
  }
  if (!payload.consent) {
    errors.consent = getContent("form.errors.consentRequired");
  }
  if (payload.website) {
    errors.website = getContent("form.errors.spamDetected");
  }
  return errors;
}

function mapErrorCode(code) {
  const codeMap = {
    required_name: "form.errors.nameRequired",
    required_email: "form.errors.emailRequired",
    invalid_email: "form.errors.emailInvalid",
    consent_required: "form.errors.consentRequired",
    spam_detected: "form.errors.spamDetected",
  };
  return getContent(codeMap[code] || "form.messages.error");
}

function mapFirstError(errors) {
  return (
    errors.name ||
    errors.email ||
    errors.consent ||
    errors.website ||
    getContent("form.messages.error")
  );
}

function showFieldErrors(errors) {
  setFieldError("name", errors.name || "");
  setFieldError("email", errors.email || "");
  setFieldError("consent", errors.consent || errors.website || "");
}

function setFieldError(field, message) {
  const errorNode = document.getElementById(`${field}-error`);
  if (errorNode) {
    errorNode.textContent = message;
  }
}

function showStatus(type, message) {
  elements.status.textContent = message;
  elements.status.className = `form-status is-visible is-${type}`;
}

function clearFormFeedback() {
  setFieldError("name", "");
  setFieldError("email", "");
  setFieldError("consent", "");
  elements.status.textContent = "";
  elements.status.className = "form-status";
}

function setSubmitting(isSubmitting) {
  elements.form.classList.toggle("is-submitting", isSubmitting);
  elements.submitButton.disabled = isSubmitting;
  const labelNode = elements.submitButton.querySelector("[data-i18n='form.submit']");
  if (labelNode) {
    labelNode.textContent = isSubmitting
      ? getContent("form.submitting")
      : getContent("form.submit");
  }
}

function initMotion() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !window.gsap || !window.ScrollTrigger) {
    document.querySelectorAll(".reveal").forEach((node) => {
      node.style.opacity = "1";
      node.style.transform = "none";
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  gsap.set(".reveal", { autoAlpha: 0, y: 28 });

  document.querySelectorAll(".reveal").forEach((node) => {
    gsap.to(node, {
      autoAlpha: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: node,
        start: "top 88%",
        once: true,
      },
    });
  });

  const heroFacts = document.querySelectorAll(".hero-fact-card");
  if (heroFacts.length) {
    gsap.fromTo(
      heroFacts,
      { autoAlpha: 0, y: 24 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.1,
        delay: 0.15,
      }
    );
  }

  const heroPanel = document.querySelector(".hero__panel");
  if (heroPanel) {
    gsap.to(heroPanel, {
      y: -10,
      duration: 2.8,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
  }
}

async function safeJson(response) {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
