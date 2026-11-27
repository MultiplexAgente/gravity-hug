const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Gradiente profundo do disco escuro -->
    <radialGradient id="discGrad" cx="50%" cy="38%" r="65%">
      <stop offset="0%" stop-color="#2c3446" />
      <stop offset="55%" stop-color="#161a24" />
      <stop offset="100%" stop-color="#0b0d13" />
    </radialGradient>
    <!-- Gradiente neon ciano das órbitas -->
    <linearGradient id="neonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#cffafe" />
      <stop offset="45%" stop-color="#67e8f9" />
      <stop offset="100%" stop-color="#38bdf8" />
    </linearGradient>
  </defs>

  <!-- Disco escuro preenchendo toda a área do ícone (FULL BLEED, r=252 para 504px de diâmetro) -->
  <circle cx="256" cy="256" r="252" fill="url(#discGrad)" stroke="#38bdf8" stroke-opacity="0.35" stroke-width="4" />

  <!-- Grupo das 3 órbitas atômicas simétricas em tamanho grande -->
  <g fill="none" stroke="url(#neonGrad)" stroke-width="22" stroke-linecap="round" stroke-linejoin="round">
    <!-- Órbita 1: inclinada 30 graus -->
    <ellipse cx="256" cy="256" rx="216" ry="92" transform="rotate(30 256 256)" />
    <!-- Órbita 2: vertical 90 graus -->
    <ellipse cx="256" cy="256" rx="216" ry="92" transform="rotate(90 256 256)" />
    <!-- Órbita 3: inclinada 150 graus -->
    <ellipse cx="256" cy="256" rx="216" ry="92" transform="rotate(150 256 256)" />
  </g>

  <!-- Núcleo central brilhante e proeminente -->
  <circle cx="256" cy="256" r="24" fill="#e0f2fe" stroke="#38bdf8" stroke-width="7" />

  <!-- 3 Elétrons posicionados com simetria matemática exata nos vértices externos -->
  <!-- Elétron 1: Superior Centro (Órbita 90º) -->
  <circle cx="256" cy="40" r="18" fill="#161a24" stroke="url(#neonGrad)" stroke-width="14" />
  
  <!-- Elétron 2: Inferior Esquerdo (Órbita 150º) -->
  <circle cx="69" cy="364" r="18" fill="#161a24" stroke="url(#neonGrad)" stroke-width="14" />
  
  <!-- Elétron 3: Inferior Direito (Órbita 30º) -->
  <circle cx="443" cy="364" r="18" fill="#161a24" stroke="url(#neonGrad)" stroke-width="14" />
</svg>`;

// Função para criar arquivo .ICO multi-resolução válido
function createIco(pngBuffers) {
  // pngBuffers: array de { width, height, buffer }
  const count = pngBuffers.length;
  const headerLength = 6;
  const entryLength = 16;
  const dirSize = headerLength + count * entryLength;

  let totalSize = dirSize;
  for (const img of pngBuffers) {
    totalSize += img.buffer.length;
  }

  const out = Buffer.alloc(totalSize);

  // Header
  out.writeUInt16LE(0, 0); // reserved
  out.writeUInt16LE(1, 2); // 1 = ICO
  out.writeUInt16LE(count, 4); // count

  let currentOffset = dirSize;
  for (let i = 0; i < count; i++) {
    const img = pngBuffers[i];
    const entryPos = headerLength + i * entryLength;
    const b = Buffer.from(img.buffer);
    out.writeUInt8(img.width >= 256 ? 0 : img.width, entryPos + 0);
    out.writeUInt8(img.height >= 256 ? 0 : img.height, entryPos + 1);
    out.writeUInt8(0, entryPos + 2); // color count
    out.writeUInt8(0, entryPos + 3); // reserved
    out.writeUInt16LE(1, entryPos + 4); // color planes
    out.writeUInt16LE(32, entryPos + 6); // bpp
    out.writeUInt32LE(b.length, entryPos + 8); // size
    out.writeUInt32LE(currentOffset, entryPos + 12); // offset

    b.copy(out, currentOffset);
    currentOffset += b.length;
  }

  return out;
}

async function main() {
  console.log('Iniciando geração de ícones em tamanho grande...');
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setContent(`<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; }
    html, body { width: 100%; height: 100%; background: transparent; overflow: hidden; }
    svg { width: 100%; height: 100%; display: block; }
  </style>
</head>
<body>
  ${svgCode}
</body>
</html>`);

  const sizes = [512, 256, 128, 64, 48, 32, 16];
  const pngBuffers = [];

  for (const size of sizes) {
    await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
    const buf = await page.screenshot({
      type: 'png',
      omitBackground: true,
      clip: { x: 0, y: 0, width: size, height: size },
    });
    pngBuffers.push({ width: size, height: size, buffer: buf });
  }

  await browser.close();

  const buf512 = pngBuffers.find((b) => b.width === 512).buffer;
  const buf256 = pngBuffers.find((b) => b.width === 256).buffer;

  // ICO com resoluções para Windows: 256, 128, 64, 48, 32, 16
  const icoBuffers = pngBuffers.filter((b) => b.width <= 256);
  const icoData = createIco(icoBuffers);

  // Escrever SVG atualizado
  fs.writeFileSync('public/hug-atom-icon.svg', svgCode, 'utf8');

  // Atualizar multiplex-ia
  fs.writeFileSync('public/favicon.ico', icoData);
  fs.writeFileSync('public/favicon.png', buf512);
  fs.writeFileSync('public/hug-atom-icon.png', buf512);
  fs.writeFileSync('public/apple-touch-icon.png', buf512);
  fs.writeFileSync('src/assets/hug-atom-icon.png', buf512);
  fs.writeFileSync('src/assets/hug-icon.jpg', buf512);
  fs.writeFileSync('src/assets/multiplex-atom.jpg', buf512);
  fs.writeFileSync('public/images/hug-icon.jpg', buf512);
  fs.writeFileSync('public/images/multiplex-atom.jpg', buf512);

  // Atualizar multiplex-control-hub
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

  console.log('Ícones gerados com sucesso em todos os destinos!');
}

main().catch(console.error);
