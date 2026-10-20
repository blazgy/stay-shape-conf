const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeDesign, designParams, backgrounds, formats, programmeMessages } = require('../sharing-design.js');
const { renderSharePage, previewMetadata } = require('../lib/share-preview.js');
const { renderShareImage } = require('../lib/share-image.js');
const pageHandler = require('../api/share.js');
const imageHandler = require('../api/share-image.js');

function response() {
  return { statusCode: 200, headers: {}, setHeader(name, value) { this.headers[name.toLowerCase()] = value; }, end(body) { this.body = body; } };
}

test('design URLs preserve edits, blank fields, language and posting settings', () => {
  const params = new URLSearchParams({ share: 'programme', message: 'machines', lang: 'bhs', background: 'sarajevo', platform: 'instagram', format: 'story', headline: 'RAD & AI\nŠTA SLIJEDI?', subtitle: '', badge: '' });
  const design = normalizeDesign(params);
  assert.equal(design.headline, 'RAD & AI\nŠTA SLIJEDI?');
  assert.equal(design.subtitle, '');
  assert.equal(design.badge, '');
  assert.deepEqual(normalizeDesign(designParams(design)), design);
});

test('all programme topics resolve in each supported language', () => {
  for (const message of Object.keys(programmeMessages)) {
    for (const lang of ['en', 'de', 'bhs']) {
      const design = normalizeDesign(new URLSearchParams({ share: 'programme', message, lang }));
      assert.equal(design.headline, programmeMessages[message][lang][1]);
      assert.equal(design.subtitle, programmeMessages[message][lang][2]);
      assert.ok(design.badge.length <= 60 && design.headline.length <= 180 && design.subtitle.length <= 160);
    }
  }
});

test('untrusted parameters cannot select external artwork or unbounded image dimensions', () => {
  const design = normalizeDesign(new URLSearchParams({ share: '__proto__', message: '../secrets', lang: 'xx', background: 'https://example.org/private', format: '999999', headline: 'x'.repeat(2000), badge: '\u0000BADGE' }));
  assert.equal(design.background, 'blue');
  assert.equal(design.format, 'square');
  assert.equal(design.variant, 'attending');
  assert.equal(design.language, 'en');
  assert.equal(design.headline.length, 180);
  assert.equal(design.badge, 'BADGE');
  assert.equal(normalizeDesign(new URLSearchParams({ platform: 'instagram', format: 'landscape' })).format, 'portrait');
});

test('share pages return unique, escaped Open Graph metadata before JavaScript runs', async () => {
  const headline = 'OUR "WORK" & <FUTURE> $&';
  const params = new URLSearchParams({ headline, subtitle: '</title><script>alert(1)</script>', background: 'night', format: 'portrait', lang: 'de' });
  const html = await renderSharePage(params);
  const head = html.split('</head>')[0];
  assert.ok(head.includes('OUR &quot;WORK&quot; &amp; &lt;FUTURE&gt; $&'));
  assert.ok(!head.includes('<script>alert(1)</script>'));
  assert.equal((head.match(/property="og:image" /g) || []).length, 1);
  assert.equal((head.match(/property="og:url" /g) || []).length, 1);
  assert.ok(head.includes('property="og:image:width" content="1080"'));
  assert.ok(head.includes('property="og:image:height" content="1350"'));
  assert.ok(head.includes('property="og:locale" content="de_DE"'));
  assert.ok(head.includes('name="twitter:card" content="summary_large_image"'));
  assert.ok(head.includes('src="/sharing-renderer.js"'));
  const metadata = previewMetadata(params);
  assert.equal(new URL(metadata.url).pathname, '/share');
  assert.equal(new URL(metadata.image).pathname, '/api/share-image');
  assert.equal(new URL(metadata.image).searchParams.get('headline'), headline);
  assert.equal(new URL(metadata.image).searchParams.get('background'), 'night');
  assert.ok(html.includes('data-component="conference-share"'));
});

test('PNG previews render every background and output format at its declared dimensions', async () => {
  for (const background of Object.keys(backgrounds)) {
    for (const [format, { width, height }] of Object.entries(formats)) {
      const png = await renderShareImage(new URLSearchParams({ background, format, share: 'programme', message: 'mobility', lang: 'bhs' }));
      assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
      assert.equal(png.readUInt32BE(16), width, `${background}:${format}`);
      assert.equal(png.readUInt32BE(20), height, `${background}:${format}`);
      assert.ok(png.length > 5000);
      assert.ok(png.length < 4_500_000, `${background}:${format} exceeds the function response limit`);
    }
  }
  const first = await renderShareImage(new URLSearchParams({ headline: 'FIRST MESSAGE' }));
  const second = await renderShareImage(new URLSearchParams({ headline: 'SECOND MESSAGE' }));
  assert.notDeepEqual(first, second);
});

test('preview endpoints support crawlers, reject writes and do not cache errors', async () => {
  for (const handler of [pageHandler, imageHandler]) {
    const denied = response();
    await handler({ method: 'POST', url: '/share' }, denied);
    assert.equal(denied.statusCode, 405);
    assert.equal(denied.headers.allow, 'GET, HEAD');
    const long = response();
    await handler({ method: 'GET', url: `/share?headline=${'a'.repeat(9000)}` }, long);
    assert.equal(long.statusCode, 414);
    const head = response();
    await handler({ method: 'HEAD', url: '/share?background=hero' }, head);
    assert.equal(head.statusCode, 200);
    assert.equal(head.body, undefined);
    assert.equal(head.headers['x-content-type-options'], 'nosniff');
  }
  const page = response();
  await pageHandler({ method: 'GET', url: '/share?headline=HELLO' }, page);
  assert.equal(page.headers['content-type'], 'text/html; charset=utf-8');
  assert.ok(page.body.includes('property="og:title" content="HELLO | Sarajevo 2026"'));
  const image = response();
  await imageHandler({ method: 'GET', url: '/api/share-image?headline=HELLO' }, image);
  assert.equal(image.headers['content-type'], 'image/png');
  assert.ok(image.headers['cache-control'].includes('s-maxage='));
  assert.ok(Buffer.isBuffer(image.body));
});
