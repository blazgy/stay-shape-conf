(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./sharing-design.js'));
  else root.StayShapeRenderer = factory(root.StayShapeDesign);
})(typeof globalThis !== 'undefined' ? globalThis : this, function (definitions) {
  'use strict';
  const { formats, brand, backgrounds } = definitions;
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
  function paintBackground(context, width, height, key, backgroundImages = new Map()) {
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
        const scale = Math.max(width / (image.naturalWidth || image.width), height / (image.naturalHeight || image.height));
        const drawnWidth = (image.naturalWidth || image.width) * scale;
        const drawnHeight = (image.naturalHeight || image.height) * scale;
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
  function drawCard(canvas, design, backgroundImages = new Map()) {
    const ctx = canvas.getContext('2d');
    const { format, background } = design;
    const dimensions = formats[format];
    canvas.width = dimensions.width; canvas.height = dimensions.height;
    const scale = dimensions.width / 1200;
    const height = dimensions.height / scale;
    ctx.scale(scale, scale);
    paintBackground(ctx, 1200, height, background, backgroundImages);
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
    const mono = '"Stay Shape Mono", monospace';
    const sans = '"Stay Shape Sans", sans-serif';
    const display = '"Stay Shape Display", Impact, sans-serif';
    ctx.textBaseline = 'top'; ctx.fillStyle = theme.ink;
    const brandSize = landscape ? 42 : 61;
    ctx.font = `400 ${brandSize}px ${display}`; ctx.fillText('STAY & SHAPE', margin, headerY);
    const brandWidth = ctx.measureText('STAY & SHAPE').width;
    ctx.fillStyle = theme.accent; ctx.fillRect(margin + brandWidth + 20, headerY + brandSize * .72, 12, 12);
    ctx.font = `500 ${landscape ? 19 : 23}px ${mono}`;
    ctx.fillStyle = theme.detailInk ?? theme.accent;
    ctx.textAlign = 'right'; ctx.fillText('SARAJEVO / 2026', right, headerY + 20); ctx.textAlign = 'left';
    if (design.badge.trim()) {
      let badgeSize = landscape ? 23 : 27;
      do { ctx.font = `600 ${badgeSize}px ${mono}`; if (ctx.measureText(design.badge).width <= width - 48) break; badgeSize--; } while (badgeSize > 12);
      const badgeWidth = ctx.measureText(design.badge).width + 48;
      ctx.fillStyle = theme.accent; ctx.fillRect(margin, badgeY, badgeWidth, 64);
      ctx.fillStyle = theme.badgeInk; ctx.fillText(design.badge, margin + 24, badgeY + (64 - badgeSize) / 2);
    }
    ctx.fillStyle = theme.ink;
    const copyWidth = width * (theme.copyScale ?? (theme.image ? .76 : 1));
    fittedBlock(ctx, design.headline, margin, headlineY, copyWidth, subtitleY - headlineY - (landscape ? 28 : 48), landscape ? 96 : story ? 180 : portrait ? 165 : 154, display);
    fittedBlock(ctx, design.subtitle, margin, subtitleY, copyWidth, ruleY - subtitleY - 32, landscape ? 27 : 35, sans, '500');
    ctx.strokeStyle = theme.ink; ctx.globalAlpha = .4; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(margin, ruleY); ctx.lineTo(right, ruleY); ctx.stroke(); ctx.globalAlpha = 1;
    ctx.fillStyle = theme.footerInk ?? theme.accent; ctx.font = `400 ${landscape ? 38 : 62}px ${display}`; ctx.fillText('SARAJEVO', margin, footerY);
    ctx.fillStyle = theme.ink; ctx.font = `500 ${landscape ? 29 : 34}px ${mono}`;
    ctx.textAlign = 'right'; ctx.fillText('22—23.10.2026', right, footerY + (landscape ? 3 : 15)); ctx.textAlign = 'left';
    ctx.font = `400 ${landscape ? 18 : 23}px ${mono}`; ctx.fillText('www.stayandshape.com', margin, siteY);
    canvas.setAttribute?.('aria-label', `${design.badge}. ${design.headline}. ${design.subtitle}. Sarajevo, 22–23.10.2026. www.stayandshape.com`);
  }
  return { paintBackground, drawCard };
});
