const { renderSharePage } = require('../lib/share-preview.js');

module.exports = async function handler(req, res) {
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.setHeader('Allow', 'GET, HEAD');
    res.statusCode = 405;
    return res.end('Method not allowed');
  }
  if (Buffer.byteLength(req.url || '') > 8192) {
    res.statusCode = 414;
    return res.end('Link too long');
  }
  try {
    const params = new URL(req.url, 'https://www.stayandshape.com').searchParams;
    const html = await renderSharePage(params);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=86400');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.statusCode = 200;
    return res.end(req.method === 'HEAD' ? undefined : html);
  } catch (error) {
    console.error('Share preview failed', error.message);
    res.setHeader('Cache-Control', 'no-store');
    res.statusCode = 500;
    return res.end('Preview unavailable. Please try again.');
  }
};
