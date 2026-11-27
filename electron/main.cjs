const { app, BrowserWindow, shell } = require("electron");
const path = require("path");
const http = require("http");
const fs = require("fs");
const { spawn } = require("child_process");

// Desabilita aceleração por hardware para evitar tela preta por incompatibilidade de GPU no Windows
app.disableHardwareAcceleration();
app.commandLine.appendSwitch("disable-gpu");
app.commandLine.appendSwitch("no-sandbox");

process.on("uncaughtException", (err) => {
  fs.writeFileSync(path.join(__dirname, "../electron-err.txt"), (err && err.stack) || String(err));
});
process.on("unhandledRejection", (err) => {
  fs.writeFileSync(path.join(__dirname, "../electron-err.txt"), (err && err.stack) || String(err));
});

let mainWindow;
let viteServerProcess = null;

// Verifica se o servidor local está respondendo na porta 3000
function checkServer(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 400);
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

// Inicia o servidor Vite em background 100% silencioso (sem CMD, sem janela)
async function ensureServerRunning() {
  const isUp = await checkServer("http://localhost:3000/");
  if (isUp) return true;

  const viteCli = path.join(__dirname, "../node_modules/vite/bin/vite.js");
  const nodeBinary = fs.existsSync("C:\\Program Files\\nodejs\\node.exe")
    ? "C:\\Program Files\\nodejs\\node.exe"
    : "node";

  try {
    viteServerProcess = spawn(nodeBinary, [viteCli, "dev", "--port", "3000"], {
      cwd: path.join(__dirname, ".."),
      windowsHide: true,
      stdio: "ignore",
      detached: true,
    });

    if (viteServerProcess && viteServerProcess.unref) {
      viteServerProcess.unref();
    }
  } catch (err) {
    console.error("Falha ao iniciar processo do servidor local:", err);
  }

  // Aguarda até o servidor responder
  for (let i = 0; i < 25; i++) {
    await new Promise((r) => setTimeout(r, 400));
    const ok = await checkServer("http://localhost:3000/");
    if (ok) return true;
  }
  return false;
}

async function createWindow() {
  if (process.platform === "win32") {
    app.setAppUserModelId("com.hug.desktop");
  }

  const iconIco = path.join(__dirname, "../public/favicon.ico");
  const iconPng = path.join(__dirname, "../public/hug-atom-icon.png");
  const iconPath = process.platform === "win32" && fs.existsSync(iconIco) ? iconIco : iconPng;

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 940,
    minWidth: 1024,
    minHeight: 720,
    title: "HUG",
    backgroundColor: "#03060a",
    icon: iconPath,
    show: true,
    darkTheme: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  });

  mainWindow.setIcon(iconPath);

  const localUrl = "http://localhost:3000/agents";
  const remoteFallbackUrl = "https://gravity-hug.lovable.app/agents";
  const targetUrl = process.env.HUG_DESKTOP_URL || localUrl;

  let retries = 0;
  const maxRetries = 10;

  mainWindow.webContents.on("did-fail-load", (event, errorCode, errorDescription, validatedURL) => {
    console.warn(`[Electron] Falha ao carregar ${validatedURL} (${errorCode} - ${errorDescription})`);
    if (retries < maxRetries) {
      retries++;
      setTimeout(() => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          console.log(`[Electron] Tentando reconectar ao HUG (tentativa ${retries}/${maxRetries})...`);
          mainWindow.loadURL(localUrl);
        }
      }, 1200);
    } else {
      console.log("[Electron] Servidor local indisponível. Carregando versão web oficial de contingência...");
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.loadURL(remoteFallbackUrl);
      }
    }
  });

  // Garante que o servidor local esteja no ar antes de abrir
  void ensureServerRunning().then((serverReady) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      if (serverReady) {
        mainWindow.loadURL(targetUrl);
      } else {
        // Tenta carregar local, com fallback automático
        mainWindow.loadURL(targetUrl);
      }
    }
  });

  // Abre links externos no navegador padrão do sistema operacional
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
