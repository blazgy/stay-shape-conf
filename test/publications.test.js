const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { matchesPublication } = require('../publications.js');
const root = path.join(__dirname, '..');
const catalogue = JSON.parse(fs.readFileSync(path.join(root, 'research/publications/catalogue.json'), 'utf8'));
const page = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const all = { query: '', topic: 'all', publisher: 'all' };

test('search accepts names without diacritics and combines terms independently of order', () => {
  const record = { topic: 'platforms', publishers: 'other', search: 'Jovana Karanović Jelena Šapić Platforms AI youth' };
  assert.equal(matchesPublication(record, { ...all, query: 'SAPIC jelena' }), true);
  assert.equal(matchesPublication(record, { ...all, query: 'sapic migration' }), false);
});

test('topic, publisher and search filters intersect, including joint publishers', () => {
  const record = { topic: 'social', publishers: 'etui etuc', search: 'Benchmarking Working Europe Esther Lynch' };
  assert.equal(matchesPublication(record, { query: 'Europe', topic: 'social', publisher: 'etui' }), true);
  assert.equal(matchesPublication(record, { query: 'Europe', topic: 'social', publisher: 'etuc' }), true);
  assert.equal(matchesPublication(record, { ...all, topic: 'gender' }), false);
  assert.equal(matchesPublication(record, { ...all, publisher: 'fes' }), false);
  assert.equal(matchesPublication(record, all), true);
});

test('every available publication has a visible static card, real cover and original title', () => {
  const available = catalogue.publications.filter(pub => pub.status !== 'announced');
  assert.equal(available.length, 41);
  assert.equal((page.match(/class="publication-card"/g) || []).length, 41);
  for (const pub of available) {
    assert.ok(page.includes(`id="publication-${pub.id}"`), pub.id);
    assert.ok(fs.existsSync(path.join(root, pub.cover.path)), pub.id);
    assert.equal(pub.cover.review_status, 'visually_verified');
  }
  assert.equal(page.includes('id="publication-p42"'), false);
  assert.ok(page.includes('Full PDF announced for the end of October 2026.'));
});

test('publication identifiers are unique and section follows practical information', () => {
  const ids = [...page.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(page.indexOf('id="practical"') < page.indexOf('id="publications"'));
  assert.ok(page.indexOf('id="publications"') < page.indexOf('id="vienna"'));
});

test('featured reads include all existing speaker-labelled publications plus Inga Sabanova', () => {
  const expected = ['p16', ...catalogue.publications.filter(pub => pub.status !== 'announced' && pub.speaker_connections.some(speaker => ['author', 'coauthor', 'coeditor'].includes(speaker.role))).map(pub => pub.id)];
  const actual = [...page.matchAll(/id="featured-(p\d+)"/g)].map(match => match[1]);
  assert.equal(actual.length, 9);
  assert.equal(actual[0], 'p16');
  assert.deepEqual([...actual].sort(), expected.sort());
  assert.ok(page.includes('Start here · 9 featured reads'));
  assert.ok(page.includes('01 / 09'));
  assert.equal(page.includes('Conference preprint'), false);
});
