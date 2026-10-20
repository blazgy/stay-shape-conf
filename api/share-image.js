const { renderShareImage } = require('../lib/share-image.js');

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
    const png = req.method === 'HEAD' ? undefined : await renderShareImage(params);
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.statusCode = 200;
    return res.end(png);
  } catch (error) {
    console.error('Share image failed', error.message);
    res.setHeader('Cache-Control', 'no-store');
    res.statusCode = 500;
    return res.end('Image unavailable. Please try again.');
  }
};
