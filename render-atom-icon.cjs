const puppeteer = require("puppeteer-core");
const fs = require("fs");
const path = require("path");

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

// SVG do novo icone Atom / Orbit exatamente como na imagem
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Gradiente suave do disco escuro -->
    <radialGradient id="discGrad" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#2a3040" />
      <stop offset="100%" stop-color="#181c25" />
    </radialGradient>
    <!-- Gradiente neon suave das orbitas -->
    <linearGradient id="neonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#b8f2fc" />
      <stop offset="50%" stop-color="#93e3f3" />
      <stop offset="100%" stop-color="#73d2e6" />
    </linearGradient>
  </defs>

  <!-- Disco escuro de fundo -->
  <circle cx="256" cy="256" r="240" fill="url(#discGrad)" />

  <!-- Grupo das 3 orbitas simetricas -->
  <g fill="none" stroke="url(#neonGrad)" stroke-width="16" stroke-linecap="round" stroke-linejoin="round">
    <!-- Orbita 1: inclinada 30 graus -->
    <ellipse cx="256" cy="256" rx="172" ry="72" transform="rotate(30 256 256)" />
    <!-- Orbita 2: vertical 90 graus -->
    <ellipse cx="256" cy="256" rx="172" ry="72" transform="rotate(90 256 256)" />
    <!-- Orbita 3: inclinada 150 graus -->
    <ellipse cx="256" cy="256" rx="172" ry="72" transform="rotate(150 256 256)" />
  </g>

  <!-- Nucleo Central -->
  <circle cx="256" cy="256" r="16" fill="#9fe6f5" />

  <!-- Esferas/Eletrons nas pontas das orbitas com centro vazado -->
  <!-- Eletron 1: Superior (inclinado topo esquerdo/centro) -->
  <circle cx="270" cy="92" r="16" fill="#202532" stroke="url(#neonGrad)" stroke-width="14" />
  
  <!-- Eletron 2: Inferior Esquerdo -->
  <circle cx="114" cy="338" r="16" fill="#202532" stroke="url(#neonGrad)" stroke-width="14" />
  
  <!-- Eletron 3: Inferior Direito -->
  <circle cx="398" cy="338" r="16" fill="#202532" stroke="url(#neonGrad)" stroke-width="14" />
</svg>`;

async function main() {
  console.log("Iniciando renderizador de icones...");
  
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 512, height: 512, deviceScaleFactor: 1 });
  
  const html = `<!DOCTYPE html>
  <html>
    <head>
      <style>
        body { margin: 0; padding: 0; background: transparent; overflow: hidden; display: flex; align-items: center; justify-content: center; width: 512px; height: 512px; }
      </style>
    </head>
    <body>
      ${svgContent}
    </body>
  </html>`;

  await page.setContent(html);

  // 1. Gera PNG 512x512 transparente
  const png512 = await page.screenshot({ omitBackground: true, type: "png" });

  // 2. Gera JPG 512x512 com fundo escuro de preenchimento
  const htmlJpg = `<!DOCTYPE html>
  <html>
    <head>
      <style>
        body { margin: 0; padding: 0; background: #0b0f17; overflow: hidden; display: flex; align-items: center; justify-content: center; width: 512px; height: 512px; }
      </style>
    </head>
    <body>
      ${svgContent}
    </body>
  </html>`;
  await page.setContent(htmlJpg);
  const jpg512 = await page.screenshot({ type: "jpeg", quality: 95 });

  await browser.close();

  // Lista de destinos no multiplex-ia
  const targets = [
    { path: "D:\\Desenvolvimento\\Projetos\\multiplex-ia\\src\\assets\\hug-icon.jpg", data: jpg512 },
    { path: "D:\\Desenvolvimento\\Projetos\\multiplex-ia\\src\\assets\\multiplex-atom.jpg", data: jpg512 },
    { path: "D:\\Desenvolvimento\\Projetos\\multiplex-ia\\public\\images\\hug-icon.jpg", data: jpg512 },
    { path: "D:\\Desenvolvimento\\Projetos\\multiplex-ia\\public\\images\\multiplex-atom.jpg", data: jpg512 },
    { path: "D:\\Desenvolvimento\\Projetos\\multiplex-ia\\public\\apple-touch-icon.png", data: png512 },
    { path: "D:\\Desenvolvimento\\Projetos\\multiplex-ia\\public\\favicon.png", data: png512 },
    { path: "D:\\Desenvolvimento\\Projetos\\multiplex-ia\\public\\favicon.ico", data: png512 },

    // six-project-domain-garden
    { path: "D:\\Desenvolvimento\\Projetos\\six-project-domain-garden\\src\\assets\\hug-icon.jpg", data: jpg512 },
    { path: "D:\\Desenvolvimento\\Projetos\\six-project-domain-garden\\public\\images\\hug-icon.jpg", data: jpg512 },
    { path: "D:\\Desenvolvimento\\Projetos\\six-project-domain-garden\\public\\apple-touch-icon.png", data: png512 },
    { path: "D:\\Desenvolvimento\\Projetos\\six-project-domain-garden\\public\\favicon.png", data: png512 },
    { path: "D:\\Desenvolvimento\\Projetos\\six-project-domain-garden\\public\\favicon.ico", data: png512 },

    // multiplex-control-hub
    { path: "D:\\Desenvolvimento\\Projetos\\multiplex-control-hub\\src\\assets\\hug-icon.jpg", data: jpg512 },
    { path: "D:\\Desenvolvimento\\Projetos\\multiplex-control-hub\\public\\images\\hug-icon.jpg", data: jpg512 },
    { path: "D:\\Desenvolvimento\\Projetos\\multiplex-control-hub\\public\\apple-touch-icon.png", data: png512 },
    { path: "D:\\Desenvolvimento\\Projetos\\multiplex-control-hub\\public\\favicon.png", data: png512 },
    { path: "D:\\Desenvolvimento\\Projetos\\multiplex-control-hub\\public\\favicon.ico", data: png512 },
  ];

  for (const target of targets) {
    const dir = path.dirname(target.path);
    if (fs.existsSync(dir)) {
      fs.writeFileSync(target.path, target.data);
      console.log("Atualizado com sucesso:", target.path);
    }
  }

  // Salva tambem o arquivo SVG oficial
  fs.writeFileSync("D:\\Desenvolvimento\\Projetos\\multiplex-ia\\public\\hug-atom-icon.svg", svgContent, "utf8");
  console.log("SVG salvo em public/hug-atom-icon.svg");
  console.log("Substituicao completa realizada com sucesso!");
}

main().catch(err => {
  console.error("Erro ao gerar icones:", err);
  process.exit(1);
});
