const sharp = require('sharp');
const fs = require('fs');

async function process() {
  const width = 512;
  const r = width / 2;
  const circleSvg = `<svg width="${width}" height="${width}">
    <circle cx="${r}" cy="${r}" r="${r}" />
  </svg>`;

  await sharp('public/icon-google.jpg')
    .resize(width, width)
    .composite([{
      input: Buffer.from(circleSvg),
      blend: 'dest-in'
    }])
    .png()
    .toFile('public/icon-google-circle.png');
}

process().catch(console.error);
