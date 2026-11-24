import fs from "fs";
import path from "path";
import { spawn } from "child_process";

const ARTIFACTS_DIR = "C:\\Users\\antho\\.gemini\\antigravity\\brain\\099b8213-bdd3-494a-b7d0-e1a02663d756";
const SCREENSHOTS_DIR = "D:\\Desenvolvimento\\Projetos\\multiplex-ia\\screenshots";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function run() {
  console.log("Iniciando processo do Chrome...");
  const chromeProc = spawn(CHROME_PATH, [
    "--remote-debugging-port=9222",
    "--headless=new",
    "--disable-gpu",
    "--user-data-dir=d:\\Desenvolvimento\\Projetos\\multiplex-ia\\.chrome-profile",
    "http://localhost:3000",
  ]);

  let connected = false;
  for (let i = 0; i < 25; i++) {
    try {
      const res = await fetch("http://127.0.0.1:9222/json/version");
      if (res.ok) {
        connected = true;
        break;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 300));
  }

  if (!connected) {
    throw new Error("Não foi possível conectar ao Chrome na porta 9222");
  }

  console.log("Chrome pronto! Abrindo aba...");
  const res = await fetch("http://127.0.0.1:9222/json/new?http://localhost:3000", { method: "PUT" });
  const tab = await res.json();
  const wsUrl = tab.webSocketDebuggerUrl;

  const ws = new WebSocket(wsUrl);

  let idCounter = 1;
  const callbacks = new Map();

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && callbacks.has(data.id)) {
      callbacks.get(data.id)(data.result, data.error);
      callbacks.delete(data.id);
    }
  };

  const send = (method, params = {}) => {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      callbacks.set(id, (result, error) => {
        if (error) reject(new Error(`${method} failed: ${JSON.stringify(error)}`));
        else resolve(result);
      });
      ws.send(JSON.stringify({ id, method, params }));
    });
  };

  await new Promise((resolve) => (ws.onopen = resolve));

  await send("Page.enable");
  await send("DOM.enable");
  await send("Runtime.enable");

  // Viewport Desktop
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 960,
    deviceScaleFactor: 2,
    mobile: false,
  });

  console.log("Aguardando hidratação do React...");
  await new Promise((r) => setTimeout(r, 4000));

  const check = await send("Runtime.evaluate", {
    expression: `typeof window.__enviarHugPergunta`,
  });
  console.log("Status de window.__enviarHugPergunta:", check.result?.value);

  const takeScreenshot = async (filename) => {
    const { data } = await send("Page.captureScreenshot", { format: "png" });
    const buffer = Buffer.from(data, "base64");
    fs.writeFileSync(path.join(SCREENSHOTS_DIR, filename), buffer);
    fs.writeFileSync(path.join(ARTIFACTS_DIR, filename), buffer);
    console.log(`Salva: ${filename} (${buffer.length} bytes)`);
  };

  // 1. Estado Inicial
  console.log("1. Capturando estado inicial...");
  await takeScreenshot("chat-hug-estado-inicial.png");

  // 2. Primeira mensagem
  console.log("2. Enviando primeira pergunta: 'Qual o valor dos planos?'");
  const eval1 = await send("Runtime.evaluate", {
    expression: `(() => {
      if (typeof window.__enviarHugPergunta === "function") {
        window.__enviarHugPergunta("Qual o valor dos planos?");
        return "enviado";
      }
      // Fallback: clicar no chip 'vamos começar'
      const chip = Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("vamos começar"));
      if (chip) {
        chip.click();
        return "chip_clicado";
      }
      return "nenhum";
    })()`,
  });
  console.log("Ação executada:", eval1.result?.value);

  await new Promise((r) => setTimeout(r, 1500));
  console.log("Capturando resposta recebida...");
  await takeScreenshot("chat-hug-resposta-recebida.png");

  // 3. Segunda mensagem
  console.log("3. Enviando segunda pergunta: 'Como funciona o PDV e catálogo online?'");
  const eval2 = await send("Runtime.evaluate", {
    expression: `(() => {
      if (typeof window.__enviarHugPergunta === "function") {
        window.__enviarHugPergunta("Como funciona o PDV e catálogo online?");
        return "enviado_2";
      }
      return "nenhum";
    })()`,
  });
  console.log("Ação 2 executada:", eval2.result?.value);

  await new Promise((r) => setTimeout(r, 1500));
  console.log("Capturando histórico com múltiplas mensagens...");
  await takeScreenshot("chat-hug-historico-multiplo.png");

  // 4. Viewport Mobile
  console.log("4. Configurando viewport mobile (390x844)...");
  await send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await new Promise((r) => setTimeout(r, 800));
  console.log("Capturando versão mobile...");
  await takeScreenshot("chat-hug-mobile.png");

  try {
    await fetch(`http://127.0.0.1:9222/json/close/${tab.id}`);
  } catch {}

  ws.close();
  chromeProc.kill();
  console.log("Automação e capturas concluídas!");
}

run().catch((err) => {
  console.error("Erro:", err);
  process.exit(1);
});
