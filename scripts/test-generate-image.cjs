const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const OpenAI = require('openai');
const puppeteer = require('puppeteer-core');

const env = dotenv.parse(fs.readFileSync('.env'));
const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

async function estamparMarcaHug(imageBuffer) {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const base64Img = imageBuffer.toString('base64');
    const dataUrl = 'data:image/jpeg;base64,' + base64Img;
    const page = await browser.newPage();
    await page.setViewport({ width: 1024, height: 1024, deviceScaleFactor: 1 });

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 1024px; height: 1024px; overflow: hidden; background: #000; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .wrap { position: relative; width: 1024px; height: 1024px; }
    .pic { width: 1024px; height: 1024px; object-fit: cover; display: block; }
    .hug-badge {
      position: absolute;
      bottom: 24px;
      right: 24px;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: rgba(11, 15, 23, 0.88);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1.5px solid rgba(56, 189, 248, 0.5);
      border-radius: 9999px;
      padding: 8px 20px 8px 14px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.65), 0 0 16px rgba(56, 189, 248, 0.3);
    }
    .atom { width: 24px; height: 24px; display: block; }
    .brand {
      font-size: 16px;
      font-weight: 800;
      letter-spacing: 2px;
      color: #f0f9ff;
      text-transform: uppercase;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
    }
  </style>
</head>
<body>
  <div class="wrap">
    <img class="pic" src="${dataUrl}" />
    <div class="hug-badge">
      <svg class="atom" viewBox="0 0 512 512">
        <defs>
          <radialGradient id="dg" cx="50%" cy="38%" r="65%">
            <stop offset="0%" stop-color="#2c3446" />
            <stop offset="100%" stop-color="#0b0d13" />
          </radialGradient>
          <linearGradient id="ng" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#cffafe" />
            <stop offset="50%" stop-color="#67e8f9" />
            <stop offset="100%" stop-color="#38bdf8" />
          </linearGradient>
        </defs>
        <circle cx="256" cy="256" r="252" fill="url(#dg)" stroke="#38bdf8" stroke-width="6" />
        <g fill="none" stroke="url(#ng)" stroke-width="26" stroke-linecap="round">
          <ellipse cx="256" cy="256" rx="216" ry="92" transform="rotate(30 256 256)" />
          <ellipse cx="256" cy="256" rx="216" ry="92" transform="rotate(90 256 256)" />
          <ellipse cx="256" cy="256" rx="216" ry="92" transform="rotate(150 256 256)" />
        </g>
        <circle cx="256" cy="256" r="28" fill="#e0f2fe" />
      </svg>
      <span class="brand">HUG</span>
    </div>
  </div>
</body>
</html>`;

    await page.setContent(html);
    const stamped = await page.screenshot({ type: 'jpeg', quality: 95 });
    return Buffer.from(stamped);
  } finally {
    await browser.close().catch(() => {});
  }
}

async function run() {
  console.log('Generating image with gpt-image-1.5...');
  const res = await openai.images.generate({
    model: 'gpt-image-1.5',
    prompt: 'Two chimpanzees wearing stylish clothing dancing happily together, vibrant colors, cinematic lighting, 4k, realistic details',
    n: 1,
    size: '1024x1024',
  });

  const rawBuf = Buffer.from(res.data[0].b64_json, 'base64');
  console.log('Raw image generated! Stamping HUG badge...');
  const finalBuf = await estamparMarcaHug(rawBuf);

  const userProfile = process.env.USERPROFILE || 'C:\\Users\\antho';
  const desktop = path.join(userProfile, 'OneDrive', 'Área de Trabalho');
  const desktopAlt = path.join(userProfile, 'Desktop');
  const targetDir = fs.existsSync(desktop) ? desktop : desktopAlt;

  const targetFile = path.join(targetDir, '2_Macacos_Dancando_HUG.jpg');
  fs.writeFileSync(targetFile, finalBuf);
  console.log('Saved to Desktop:', targetFile);

  const dataDir = path.join(process.cwd(), 'data', 'imagens');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(path.join(dataDir, '2_Macacos_Dancando_HUG.jpg'), finalBuf);
  console.log('Saved to data/imagens!');
}

run().catch(console.error);
