const { app, BrowserWindow, shell, nativeImage } = require("electron");
const path = require("path");
const http = require("http");
const fs = require("fs");
const { spawn } = require("child_process");

process.on("uncaughtException", (err) => {
  fs.writeFileSync(path.join(__dirname, "../electron-err.txt"), (err && err.stack) || String(err));
});
process.on("unhandledRejection", (err) => {
  fs.writeFileSync(path.join(__dirname, "../electron-err.txt"), (err && err.stack) || String(err));
});

let mainWindow;
let viteServerProcess = null;

// Verifica se o servidor local está ativo sem abrir nenhuma janela de console
function checkServer(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      resolve(true);
    });
    req.on("error", () => {
      resolve(false);
    });
    req.setTimeout(1200, () => {
      req.destroy();
      resolve(false);
    });
  });
}

// Inicia o servidor Vite em background 100% silencioso (sem CMD, sem janela, sem barra de tarefas)
async function ensureServerRunning() {
  const targetUrl = process.env.HUG_DESKTOP_URL || "http://localhost:3000/agents";
  const isUp = await checkServer("http://localhost:3000/");
  if (isUp) return;

  const viteCli = path.join(__dirname, "../node_modules/vite/bin/vite.js");
  const nodeBinary = fs.existsSync("C:\\Program Files\\nodejs\\node.exe")
    ? "C:\\Program Files\\nodejs\\node.exe"
    : "node";

  // Inicia o processo com windowsHide = true para NUNCA abrir janela preta do CMD
  viteServerProcess = spawn(nodeBinary, [viteCli, "dev", "--port", "3000"], {
    cwd: path.join(__dirname, ".."),
    windowsHide: true,
    stdio: "ignore",
    detached: true,
  });

  if (viteServerProcess && viteServerProcess.unref) {
    viteServerProcess.unref();
  }

  // Aguarda até o servidor responder
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 400));
    const ok = await checkServer("http://localhost:3000/");
    if (ok) break;
  }
}

async function createWindow() {
  await ensureServerRunning();

  const iconPath = process.platform === "win32"
    ? path.join(__dirname, "../public/favicon.ico")
    : path.join(__dirname, "../public/favicon.png");

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 940,
    minWidth: 1024,
    minHeight: 720,
    title: "HUG",
    backgroundColor: "#03060a",
    icon: iconPath,
    darkTheme: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.setIcon(iconPath);

  // URL do HUG rodando localmente
  const targetUrl = process.env.HUG_DESKTOP_URL || "http://localhost:3000/agents";
  mainWindow.loadURL(targetUrl);

  // Abre links externos no navegador padrao
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
