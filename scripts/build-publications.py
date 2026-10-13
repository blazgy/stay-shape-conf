"""Build the complete, no-JavaScript reading catalogue into the conference page.

The research catalogue is the bibliographic source of truth. Editorial copy and
featured choices live in data/publications-editorial.json. Run from any folder.
"""
import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOGUE = json.loads((ROOT / 'research/publications/catalogue.json').read_text())
EDITORIAL = json.loads((ROOT / 'data/publications-editorial.json').read_text())
PUBS = {p['id']: p for p in CATALOGUE['publications']}

def esc(value):
    return html.escape(str(value), quote=True)

def tr(en, de, bhs):
    return dict(en=en, de=de, bhs=bhs)

def text(copy, tag='span', attrs=''):
    data = ' '.join(f'data-{lang}="{esc(copy[lang])}"' for lang in ('en', 'de', 'bhs'))
    return f'<{tag} {attrs} {data}>{esc(copy["en"])}</{tag}>'

GROUPS = {
    'ai': tr('AI & technology', 'KI & Technologie', 'AI i tehnologija'),
    'migration': tr('Migration & mobility', 'Migration & Mobilität', 'Migracija i mobilnost'),
    'rights': tr('Workers’ rights', 'Arbeitnehmerrechte', 'Radnička prava'),
    'gender': tr('Gender & care', 'Geschlecht & Sorgearbeit', 'Rod i briga'),
    'social': tr('Labour markets', 'Arbeitsmärkte', 'Tržišta rada'),
    'platforms': tr('Platform & remote work', 'Plattformarbeit & Homeoffice', 'Platformski rad i rad na daljinu'),
}
MONTHS = {
    'en': 'January February March April May June July August September October November December'.split(),
    'de': 'Januar Februar März April Mai Juni Juli August September Oktober November Dezember'.split(),
    'bhs': 'januar februar mart april maj juni juli august septembar oktobar novembar decembar'.split(),
}
FORMATS = {
    'Book chapter': tr('Book chapter', 'Buchkapitel', 'Poglavlje knjige'),
    'Conference paper and preprint': tr('Research paper', 'Forschungsbeitrag', 'Istraživački rad'),
    'Country factsheet collection': tr('Country factsheets', 'Länder-Factsheets', 'Pregledi zemalja'),
    'Edited volume': tr('Edited volume', 'Sammelband', 'Zbornik'),
    'Guidelines': tr('Guidelines', 'Leitlinien', 'Smjernice'),
    'Opinion article': tr('Opinion article', 'Meinungsbeitrag', 'Autorski članak'),
    'Paper': tr('Paper', 'Forschungsbeitrag', 'Istraživački rad'),
    'Policy brief': tr('Policy brief', 'Policy Brief', 'Sažetak politika'),
    'Policy paper': tr('Policy paper', 'Policy Paper', 'Dokument o politikama'),
    'Policy position': tr('Policy position', 'Positionspapier', 'Dokument o stavovima'),
    'Practical guide': tr('Practical guide', 'Praxisleitfaden', 'Praktični vodič'),
    'Report': tr('Report', 'Bericht', 'Izvještaj'),
    'Report and practical guide': tr('Report & guide', 'Bericht & Leitfaden', 'Izvještaj i vodič'),
    'Research collection': tr('Research collection', 'Forschungssammlung', 'Zbirka istraživanja'),
    'Scoping review': tr('Scoping review', 'Scoping Review', 'Pregled istraživanja'),
    'Study': tr('Study', 'Studie', 'Studija'),
    'Study and practical guide': tr('Study & guide', 'Studie & Leitfaden', 'Studija i vodič'),
    'Technical brief': tr('Technical brief', 'Technical Brief', 'Tehnički sažetak'),
    'Working paper': tr('Working paper', 'Arbeitspapier', 'Radni dokument'),
}

def date_copy(pub):
    parts = pub['publication_date'].split('-')
    result = {}
    for lang in MONTHS:
        value = parts[0]
        if len(parts) > 1:
            value = MONTHS[lang][int(parts[1])-1] + ' ' + parts[0]
        if len(parts) > 2:
            value = str(int(parts[2])) + ('. ' if lang != 'en' else ' ') + value
        result[lang] = value
    return result

def summary(pub):
    return dict(en=EDITORIAL['english_overrides'].get(pub['id'], pub['description_en']), **EDITORIAL['summaries'][pub['id']])

def publisher(pub):
    pid = pub['id']
    if pid in ('p07', 'p08'):
        return ('ilo', 'ILO · ' + ('NASK' if pid == 'p07' else 'World Bank'))
    if pid == 'p10': return ('etui etuc', 'ETUI · ETUC')
    if pid in ('p09', 'p42'): return ('etui', 'ETUI')
    if pid in ('p11', 'p12'): return ('etuc', 'ETUC')
    if pid in ('p04', 'p35'): return ('rcc', 'RCC' + (' · ESAP 3' if pid == 'p35' else ''))
    if pid in ('p36', 'p38', 'p39'): return ('gs4s', 'GS4S' + (' · wiiw' if pid == 'p38' else ''))
    if 'Friedrich' in pub['publisher']:
        partner = ' · UNI Europa' if pid in ('p22', 'p23') else ' · EPSU' if pid == 'p29' else ' · FEPS' if pid == 'p30' else ''
        return ('fes', 'FES' + partner)
    return ('other', {'p02':'Aspen Institute Germany', 'p03':'Routledge', 'p40':'Reshaping Work', 'p41':'ISPIM · arXiv'}[pid])

def author_copy(pub):
    authors = pub['authors']
    return ', '.join(authors) if len(authors) <= 2 else authors[0] + ' et al.'

def speakers(pub):
    return [s['name'] for s in pub['speaker_connections'] if s['role'] in ('author', 'coauthor', 'coeditor')]

READ = tr('Read publication', 'Publikation lesen', 'Pročitajte publikaciju')
FIRST_PAGE = tr('First-page preview', 'Vorschau der ersten Seite', 'Pregled prve stranice')
ENGLISH = tr('English', 'Englisch', 'Engleski')

def cover(pub, featured=False):
    c = pub['cover']
    assert c['status'] == 'available' and (ROOT / c['path']).is_file(), pub['id']
    image = f'<img src="./{esc(c["path"])}" width="{c["width"]}" height="{c["height"]}" alt="{esc(c["alt"])}" loading="lazy" decoding="async">'
    note = FORMATS[pub['format']]
    if 'first_page_preview' in c['kind']: note = FIRST_PAGE
    elif c['kind'] == 'parent_book_cover':
        note = {lang: value + ' ' + pub['container_title'] for lang, value in tr('Book cover:', 'Buchcover:', 'Naslovnica knjige:').items()}
    if featured:
        caption = text(note, 'figcaption') if 'first_page_preview' in c['kind'] or c['kind'] == 'parent_book_cover' else ''
        return f'<figure class="publication-feature-cover">{image}{caption}</figure>'
    return f'<figure class="publication-cover">{image}{text(note,"figcaption")}</figure>'

def read_link(pub):
    return f'<a class="publication-read" href="{esc(read_url(pub))}" target="_blank" rel="noopener noreferrer">{text(READ)}<span class="visually-hidden">: {esc(pub["title"])}</span></a>'

def read_url(pub):
    # The verified publisher PDFs avoid blocked intermediary landing pages.
    return pub['cover']['source_url'] if pub['id'] in ('p09', 'p36') else pub['source_url']

def feature(choice, index):
    pub = PUBS[choice['id']]
    names = speakers(pub)
    speaker = text({lang: label + ' · ' + ', '.join(names) for lang, label in tr('Conference speaker', 'Konferenzreferent*in', 'Govornik na konferenciji').items()}, 'p', 'class="publication-speaker"') if names else ''
    title_class = ' class="publication-long-title"' if len(pub['title']) > 100 else ''
    return f'''<details class="publication-feature" name="featured-publications" id="featured-{pub['id']}" {'open' if index == 0 else ''}>
      <summary aria-controls="featured-body-{pub['id']}">
        <span class="publication-spine-number">{index+1:02d}</span>
        {text(choice['labels'],attrs='class="publication-spine-label"')}
        <span class="publication-spine-year">{pub['publication_date'][:4]}</span>
      </summary>
      <div class="publication-feature-body" id="featured-body-{pub['id']}">
        {cover(pub, True)}
        <div class="publication-feature-copy">
          {text(GROUPS[pub['group']], 'p', 'class="publication-topic"')}
          <h4 lang="en"{title_class}>{esc(pub['title'])}</h4>
          <p class="publication-feature-author">{esc(author_copy(pub))}</p>
          <p class="publication-feature-meta">{esc(publisher(pub)[1])} · {text(date_copy(pub))}</p>
          {speaker}
          {text(summary(pub),'p','class="publication-feature-description"')}
          {read_link(pub)}
        </div>
      </div>
    </details>'''

def card(pub, index):
    tokens, short_publisher = publisher(pub)
    search = ' '.join([pub['title'], *pub['authors'], pub['publisher'], pub['description_en'], *EDITORIAL['summaries'][pub['id']].values(), CATALOGUE['groups'][pub['group']], *(s['name'] for s in pub['speaker_connections'])])
    badge = ''
    if speakers(pub):
        badge = text(tr('Conference speaker', 'Mit Konferenzreferent*innen', 'Govornik na konferenciji'), 'p', 'class="publication-speaker"')
    return f'''<article class="publication-card" id="publication-{pub['id']}" data-topic="{pub['group']}" data-publishers="{tokens}" data-search="{esc(search)}">
      <div class="publication-card-kicker"><span>{index:02d}</span>{text(GROUPS[pub['group']])}</div>
      <a class="publication-cover-link" href="{esc(read_url(pub))}" target="_blank" rel="noopener noreferrer">{cover(pub)}</a>
      <h4 lang="en"><a href="{esc(read_url(pub))}" target="_blank" rel="noopener noreferrer">{esc(pub['title'])}</a></h4>
      <p class="publication-author">{esc(author_copy(pub))}</p>
      <p class="publication-meta">{esc(short_publisher)} · {text(date_copy(pub))} · {text(ENGLISH)}</p>
      {badge}
      {text(summary(pub),'p','class="publication-description"')}
      {read_link(pub)}
    </article>'''

available = sorted((p for p in PUBS.values() if p['status'] != 'announced'), key=lambda p: p['publication_date'], reverse=True)
featured_count = len(EDITORIAL['featured'])
featured = '\n'.join(feature(choice, i) for i, choice in enumerate(EDITORIAL['featured']))
cards = '\n'.join(card(pub, i+1) for i, pub in enumerate(available))
topic_options = ''.join(text(copy,'option',f'value="{key}"') for key, copy in GROUPS.items())
publisher_options = ''.join(f'<option value="{key}">{value}</option>' for key,value in [('fes','FES'),('ilo','ILO'),('etui','ETUI'),('etuc','ETUC'),('rcc','RCC'),('gs4s','GS4S')]) + text(tr('Other publishers','Weitere Herausgeber','Drugi izdavači'),'option','value="other"')
announcement = PUBS['p42']
section = f'''<!-- PUBLICATIONS: generated by scripts/build-publications.py -->
      <section class="publications section" id="publications" aria-labelledby="publications-title" data-component="publications">
        <div class="shell">
          <div class="publications-heading">
            <div><p class="eyebrow">04 / {text(tr('Ideas behind the conversation','Ideen hinter dem Austausch','Ideje iza razgovora'))}</p>
            {text(tr('Publications','Publikationen','Publikacije'),'h2','id="publications-title"')}</div>
            {text(tr('Research on work, migration and technology. Explore the ideas shaping our conference — and what comes next.','Forschung zu Arbeit, Migration und Technologie. Entdecken Sie die Ideen hinter unserer Konferenz — und dem, was danach kommt.','Istraživanja o radu, migracijama i tehnologiji. Otkrijte ideje koje oblikuju našu konferenciju — i ono što dolazi poslije.'),'p','class="publications-intro"')}
          </div>
          <div class="publication-feature-heading">
            {text(tr(f'Start here · {featured_count} featured reads',f'Hier beginnen · {featured_count} Lesetipps',f'Počnite ovdje · {featured_count} preporuka'),'h3','id="featured-publications-title"')}
            <div class="publication-feature-controls" hidden>
              <button type="button" data-feature-step="-1">{text(tr('Previous','Zurück','Prethodno'))}</button>
              <span data-feature-position aria-live="polite" aria-atomic="true">01 / {featured_count:02d}</span>
              <button type="button" data-feature-step="1">{text(tr('Next','Weiter','Sljedeće'))}</button>
            </div>
          </div>
          <div class="publication-features" aria-labelledby="featured-publications-title">{featured}</div>
          <div class="publication-library-heading">
            {text(tr('The reading collection','Die Lesesammlung','Zbirka publikacija'),'h3','id="publication-library-title"')}
            <p class="publication-results" data-publication-results role="status" aria-live="polite" aria-atomic="true">{text(tr('41 publications','41 Publikationen','41 publikacija'))}</p>
          </div>
          <form class="publication-filters" data-publication-filters hidden role="search" aria-label="Search publications" data-aria-en="Search publications" data-aria-de="Publikationen durchsuchen" data-aria-bhs="Pretražite publikacije">
            <label class="publication-search">{text(tr('Search the collection','Sammlung durchsuchen','Pretražite zbirku'))}<input type="search" name="query" autocomplete="off" placeholder="Title, author or keyword" data-placeholder-en="Title, author or keyword" data-placeholder-de="Titel, Name oder Stichwort" data-placeholder-bhs="Naslov, autor ili ključna riječ" aria-controls="publication-grid"></label>
            <label>{text(tr('Topic','Thema','Tema'),attrs='id="publication-topic-label"')}<select name="topic" aria-labelledby="publication-topic-label" aria-controls="publication-grid">{text(tr('All topics','Alle Themen','Sve teme'),'option','value="all"')}{topic_options}</select></label>
            <label>{text(tr('Publisher','Herausgeber','Izdavač'),attrs='id="publication-publisher-label"')}<select name="publisher" aria-labelledby="publication-publisher-label" aria-controls="publication-grid">{text(tr('All publishers','Alle Herausgeber','Svi izdavači'),'option','value="all"')}{publisher_options}</select></label>
            <button class="publication-reset" type="reset">{text(tr('Reset','Zurücksetzen','Poništi'))}</button>
          </form>
          <div class="publication-grid" id="publication-grid" aria-labelledby="publication-library-title">{cards}</div>
          <div class="publication-empty" data-publication-empty hidden>
            {text(tr('No publications match your search.','Keine Publikationen entsprechen Ihrer Suche.','Nema publikacija koje odgovaraju vašoj pretrazi.'),'h4')}
            {text(tr('Try another keyword or reset the filters.','Versuchen Sie ein anderes Stichwort oder setzen Sie die Filter zurück.','Pokušajte s drugom ključnom riječi ili poništite filtere.'),'p')}
            <button type="button" data-publication-clear>{text(tr('Reset filters','Filter zurücksetzen','Poništite filtere'))}</button>
          </div>
          <aside class="publication-announcement">
            {text(tr('Coming soon','Demnächst','Uskoro'),'p','class="publication-announcement-label"')}
            <div><h4 lang="en">{esc(announcement['title'])}</h4><p>{esc(', '.join(announcement['authors']))} · ETUI · 2026</p>
            {text(tr('Full PDF announced for the end of October 2026.','Vollständiges PDF für Ende Oktober 2026 angekündigt.','Cijeli PDF je najavljen za kraj oktobra 2026.'),'p')}
            <a class="publication-read" href="{esc(announcement['source_url'])}" target="_blank" rel="noopener noreferrer">{text(tr('Publisher announcement','Ankündigung des Herausgebers','Najava izdavača'))}</a></div>
          </aside>
        </div>
      </section>
      <!-- /PUBLICATIONS -->'''

section = '\n'.join(line.rstrip() for line in section.splitlines())
page_path = ROOT / 'index.html'
page = page_path.read_text()
start, end = '<!-- PUBLICATIONS: generated by scripts/build-publications.py -->', '<!-- /PUBLICATIONS -->'
if start in page:
    before, rest = page.split(start, 1)
    _, after = rest.split(end, 1)
    page = before + section + after
else:
    anchor = '      <section class="vienna-recap section" id="vienna">'
    assert anchor in page
    page = page.replace(anchor, '      ' + section + '\n' + anchor, 1)
page_path.write_text(page)
print(f'Built {len(available)} publications, {len(EDITORIAL["featured"])} featured reads and one announcement.')
