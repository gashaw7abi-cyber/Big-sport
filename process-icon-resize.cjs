const sharp = require('sharp');

async function process() {
  await sharp('public/icon-google-circle.png')
    .resize(192, 192)
    .png()
    .toFile('public/icon-192x192.png');
    
  await sharp('public/icon-google-circle.png')
    .resize(48, 48)
    .png()
    .toFile('public/favicon.png');
}

process().catch(console.error);
