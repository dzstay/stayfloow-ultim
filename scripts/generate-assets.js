const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'assets');

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Logo: 1024x1024, #10B981 background, white text
const svgLogo = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <rect width="1024" height="1024" fill="#10B981" />
  <text x="512" y="550" font-family="sans-serif" font-size="160" font-weight="900" fill="white" text-anchor="middle" dominant-baseline="middle">StayFloow</text>
</svg>
`;

// Splash Screen: 2732x2732, #10B981 background, white text
const svgSplash = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2732 2732" width="2732" height="2732">
  <rect width="2732" height="2732" fill="#10B981" />
  <text x="1366" y="1400" font-family="sans-serif" font-size="300" font-weight="900" fill="white" text-anchor="middle" dominant-baseline="middle">StayFloow</text>
</svg>
`;

async function generate() {
  try {
    await sharp(Buffer.from(svgLogo)).png().toFile(path.join(assetsDir, 'icon.png'));
    console.log('✅ assets/icon.png généré avec succès.');

    await sharp(Buffer.from(svgSplash)).png().toFile(path.join(assetsDir, 'splash.png'));
    console.log('✅ assets/splash.png généré avec succès.');
  } catch (error) {
    console.error("Erreur lors de la génération :", error);
  }
}

generate();
