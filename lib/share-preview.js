const fs = require('node:fs/promises');
const path = require('node:path');
const { baseURL, formats, normalizeDesign, designParams } = require('../sharing-design.js');

const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
let template;

function previewMetadata(params) {
  const design = normalizeDesign(params);
  const query = designParams(design).toString();
  const url = new URL(`share?${query}`, baseURL).href;
  const image = new URL(`api/share-image?${query}`, baseURL).href;
  const title = `${design.headline.replace(/\s+/g, ' ').trim() || 'Stay & Shape'} | Sarajevo 2026`;
  const description = `${design.subtitle.replace(/\s+/g, ' ').trim()} · Sarajevo · 22–23.10.2026`;
  const alt = `${design.badge}. ${design.headline}. ${design.subtitle}. Sarajevo, 22–23.10.2026.`.replace(/\s+/g, ' ').trim();
  return { design, url, image, title, description, alt, ...formats[design.format] };
}

async function renderSharePage(params) {
  const metadata = previewMetadata(params);
  const { design, url, image, title, description, alt, width, height } = metadata;
  // Social crawlers receive the complete metadata in the first HTML response.
  const tags = {
    'og:type': 'website', 'og:site_name': 'Stay & Shape', 'og:title': title,
    'og:description': description, 'og:url': url, 'og:image': image,
    'og:image:type': 'image/png', 'og:image:width': width, 'og:image:height': height,
    'og:image:alt': alt, 'og:locale': { en: 'en_GB', de: 'de_DE', bhs: 'bs_BA' }[design.language],
  };
  const socialTags = Object.entries(tags).map(([key, value]) => `<meta property="${key}" content="${escapeHTML(value)}">`);
  for (const [key, value] of Object.entries({ card: 'summary_large_image', title, description, image, 'image:alt': alt })) {
    socialTags.push(`<meta name="twitter:${key}" content="${escapeHTML(value)}">`);
  }
  template ||= fs.readFile(path.join(__dirname, '..', 'index.html'), 'utf8');
  return (await template)
    .replace(/<html lang="[^"]*">/, `<html lang="${{ en: 'en', de: 'de', bhs: 'bs-Latn' }[design.language]}">`)
    .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${escapeHTML(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, () => `<meta name="description" content="${escapeHTML(description)}">`)
    .replace(/<link rel="canonical"[^>]*>/, () => `<link rel="canonical" href="${escapeHTML(url)}">`)
    .replace(/\s*<meta (?:property="og:[^"]+"|name="twitter:[^"]+")[^>]*>/g, '')
    .replace('</head>', () => `  ${socialTags.join('\n    ')}\n  </head>`)
    .replace(/\b(src|href)="\.\//g, '$1="/');
}

module.exports = { previewMetadata, renderSharePage };
