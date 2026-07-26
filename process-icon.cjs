const { execSync } = require('child_process');
const fs = require('fs');
const sharp = require('sharp');

const IMAGE_URL = 'https://i.postimg.cc/g29Gpg7r/1778746810882.jpg';
const TEMP_IMAGE = 'public/icon-google.jpg';

async function processIcon(size, outputPath) {
  const r = size / 2;
  const circleSvg = `<svg width="${size}" height="${size}">
    <circle cx="${r}" cy="${r}" r="${r}" />
  </svg>`;

  await sharp(TEMP_IMAGE)
    .resize(size, size)
    .composite([{
      input: Buffer.from(circleSvg),
      blend: 'dest-in'
    }])
    .png()
    .toFile(outputPath);
  console.log(`Generated circular icon: ${outputPath} (${size}x${size})`);
}

async function run() {
  // Check if TEMP_IMAGE exists and has non-zero size, otherwise download via curl
  let downloadNeeded = true;
  if (fs.existsSync(TEMP_IMAGE)) {
    const stats = fs.statSync(TEMP_IMAGE);
    if (stats.size > 1000) {
      downloadNeeded = false;
      console.log(`Using existing source logo file (${stats.size} bytes).`);
    }
  }

  if (downloadNeeded) {
    console.log('Downloading latest source logo via curl...');
    try {
      execSync(`curl -sL "${IMAGE_URL}" -o "${TEMP_IMAGE}"`);
      console.log('Download complete.');
    } catch (err) {
      console.error('Failed to download with curl:', err.message);
    }
  }

  const stats = fs.statSync(TEMP_IMAGE);
  console.log(`Verifying source logo size: ${stats.size} bytes`);

  // Generate all circular sizes for Web, Mobile, and Search crawler standards
  await processIcon(512, 'public/icon.png');
  await processIcon(512, 'public/icon-512x512.png');
  await processIcon(192, 'public/icon-192x192.png');
  await processIcon(180, 'public/apple-touch-icon.png');
  await processIcon(180, 'public/apple-touch-icon-precomposed.png');
  await processIcon(96, 'public/favicon.png');
  await processIcon(48, 'public/favicon.ico');
  
  console.log('All circular icons processed successfully!');
}

run().catch(console.error);
