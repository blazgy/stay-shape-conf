const path = require('node:path');
const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');
const { formats, backgrounds, normalizeDesign } = require('../sharing-design.js');
const { drawCard } = require('../sharing-renderer.js');

const fonts = [
  ['BebasNeue-Regular.ttf', 'Stay Shape Display'],
  ['IBMPlexMono-Regular.ttf', 'Stay Shape Mono'],
  ['Outfit-Variable.ttf', 'Stay Shape Sans'],
];
for (const [file, family] of fonts) {
  if (!GlobalFonts.registerFromPath(path.join(__dirname, '..', 'assets', 'fonts', file), family)) {
    throw new Error(`Could not load preview font ${family}`);
  }
}

const images = new Map();
async function renderShareImage(params) {
  const design = normalizeDesign(params);
  const theme = backgrounds[design.background];
  const backgroundImages = new Map();
  if (theme.image) {
    if (!images.has(design.background)) {
      // Only the bundled, whitelisted artwork can be loaded. URLs cannot be supplied by visitors.
      const pending = loadImage(path.join(__dirname, '..', theme.image));
      images.set(design.background, pending);
      pending.catch(() => images.delete(design.background));
    }
    backgroundImages.set(design.background, { image: await images.get(design.background), ready: true });
  }
  const { width, height } = formats[design.format];
  const canvas = createCanvas(width, height);
  drawCard(canvas, design, backgroundImages);
  return canvas.encode('png');
}

module.exports = { renderShareImage };
