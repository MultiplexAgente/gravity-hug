const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

function createIco(pngBuffers) {
  const count = pngBuffers.length;
  const headerLength = 6;
  const entryLength = 16;
  const dirSize = headerLength + count * entryLength;

  let totalSize = dirSize;
  for (const img of pngBuffers) {
    totalSize += img.buffer.length;
  }

  const out = Buffer.alloc(totalSize);

  out.writeUInt16LE(0, 0);
  out.writeUInt16LE(1, 2);
  out.writeUInt16LE(count, 4);

  let currentOffset = dirSize;
  for (let i = 0; i < count; i++) {
    const img = pngBuffers[i];
    const entryPos = headerLength + i * entryLength;
    const b = Buffer.from(img.buffer);
    out.writeUInt8(img.width >= 256 ? 0 : img.width, entryPos + 0);
    out.writeUInt8(img.height >= 256 ? 0 : img.height, entryPos + 1);
    out.writeUInt8(0, entryPos + 2);
    out.writeUInt8(0, entryPos + 3);
    out.writeUInt16LE(1, entryPos + 4);
    out.writeUInt16LE(32, entryPos + 6);
    out.writeUInt32LE(b.length, entryPos + 8);
    out.writeUInt32LE(currentOffset, entryPos + 12);

    b.copy(out, currentOffset);
    currentOffset += b.length;
  }

  return out;
}

async function main() {
  console.log('Restaurando ícone ORIGINAL HUG e ampliando para ocupar 100% da área (sem alterar o desenho)...');
  const originalPath = 'C:\\Users\\antho\\.gemini\\antigravity\\brain\\099b8213-bdd3-494a-b7d0-e1a02663d756\\hug-atom-icon.png';
  const originalBuf = fs.readFileSync(originalPath);
  const dataUrl = 'data:image/png;base64,' + originalBuf.toString('base64');

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // O ícone original tem 256x256, mas o círculo está em (15, 15) com largura/altura de 226px.
  // Vamos desenhar o círculo original recortando exatamente as margens vazias de 15px e esticando para 100% do canvas!
  const html = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; background: transparent; overflow: hidden; }
    canvas { display: block; width: 100%; height: 100%; }
  </style>
</head>
<body>
  <canvas id="c"></canvas>
  <script>
    const img = new Image();
    img.onload = () => {
      window.__ready = true;
    };
    img.src = "${dataUrl}";
    window.renderToSize = (size) => {
      const c = document.getElementById('c');
      c.width = size;
      c.height = size;
      const ctx = c.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.clearRect(0, 0, size, size);
      
      // Ocupa 100% da área (bleed total) sem nenhuma margem vazia para ter o mesmo tamanho de ícones do Chrome e Firefox na barra de tarefas
      ctx.drawImage(img, 15, 15, 226, 226, 0, 0, size, size);
    };
  </script>
</body>
</html>`;

  await page.setContent(html);
  await page.waitForFunction('window.__ready === true');

  const sizes = [512, 256, 128, 64, 48, 40, 32, 24, 16];
  const pngBuffers = [];

  for (const s of sizes) {
    await page.setViewport({ width: s, height: s, deviceScaleFactor: 1 });
    await page.evaluate((size) => window.renderToSize(size), s);
    const buf = await page.screenshot({
      type: 'png',
      omitBackground: true,
      clip: { x: 0, y: 0, width: s, height: s },
    });
    pngBuffers.push({ width: s, height: s, buffer: buf });
  }

  await browser.close();

  const buf512 = pngBuffers.find((b) => b.width === 512).buffer;
  const buf256 = pngBuffers.find((b) => b.width === 256).buffer;
  const icoBuffers = pngBuffers.filter((b) => b.width <= 256);
  const icoData = createIco(icoBuffers);

  // 1. Atualizar multiplex-ia
  fs.writeFileSync('public/favicon.ico', icoData);
  fs.writeFileSync('public/favicon.png', buf512);
  fs.writeFileSync('public/hug-atom-icon.png', buf512);
  fs.writeFileSync('public/apple-touch-icon.png', buf512);
  fs.writeFileSync('src/assets/hug-atom-icon.png', buf512);
  fs.writeFileSync('src/assets/hug-icon.jpg', buf512);
  fs.writeFileSync('src/assets/multiplex-atom.jpg', buf512);
  fs.writeFileSync('public/images/hug-icon.jpg', buf512);
  fs.writeFileSync('public/images/multiplex-atom.jpg', buf512);

  // 2. Atualizar multiplex-control-hub
  const controlHubPublic = 'D:\\Desenvolvimento\\Projetos\\multiplex-control-hub\\public';
  if (fs.existsSync(controlHubPublic)) {
    fs.writeFileSync(path.join(controlHubPublic, 'favicon.ico'), icoData);
    fs.writeFileSync(path.join(controlHubPublic, 'favicon.png'), buf512);
    fs.writeFileSync(path.join(controlHubPublic, 'apple-touch-icon.png'), buf512);
    const controlHubImages = path.join(controlHubPublic, 'images');
    if (fs.existsSync(controlHubImages)) {
      fs.writeFileSync(path.join(controlHubImages, 'hug-icon.jpg'), buf512);
      fs.writeFileSync(path.join(controlHubImages, 'multiplex-atom.jpg'), buf512);
    }
  }

  // 3. Atualizar atalho da Área de Trabalho
  const userProfile = process.env.USERPROFILE || 'C:\\Users\\antho';
  const oneDriveDesktop = path.join(userProfile, 'OneDrive', 'Área de Trabalho');
  const standardDesktop = path.join(userProfile, 'Desktop');
  const desktopDir = fs.existsSync(oneDriveDesktop) ? oneDriveDesktop : standardDesktop;
  const icoDest = path.join(desktopDir, 'hug-atom-icon.ico');
  fs.writeFileSync(icoDest, icoData);

  console.log('Ícone ORIGINAL restaurado com fidelidade 100% e expandido para tela cheia!');
}

main().catch(console.error);
