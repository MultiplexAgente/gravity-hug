const fs = require('fs');
const puppeteer = require('puppeteer-core');

async function inspectImages() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  async function getInfo(filePath) {
    const buf = fs.readFileSync(filePath);
    const dataUrl = 'data:image/png;base64,' + buf.toString('base64');
    await page.setContent(`<img id="pic" src="${dataUrl}">`);
    return await page.evaluate(() => {
      const img = document.getElementById('pic');
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const a = data[(y * canvas.width + x) * 4 + 3];
          if (a > 20) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      return {
        width: canvas.width,
        height: canvas.height,
        minX,
        minY,
        maxX,
        maxY,
        boundW: maxX - minX,
        boundH: maxY - minY
      };
    });
  }

  const info1 = await getInfo('C:/Users/antho/.gemini/antigravity/brain/099b8213-bdd3-494a-b7d0-e1a02663d756/hug-atom-icon.png');
  const info2 = await getInfo('C:/Users/antho/.gemini/antigravity/brain/099b8213-bdd3-494a-b7d0-e1a02663d756/.user_uploaded/media_1795788746317_b59d2b2d.png');

  console.log('Original hug-atom-icon.png info:', info1);
  console.log('User uploaded media_... info:', info2);

  await browser.close();
}

inspectImages().catch(console.error);
