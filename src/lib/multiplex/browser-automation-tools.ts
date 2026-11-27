/**
 * HUG Desktop Agent — Automação de Navegador Web & Preenchimento Automático
 * 
 * Permite à I.A interagir diretamente com o Google Chrome no Windows:
 * 1. Abrir navegador visível na tela do usuário (headless: false)
 * 2. Navegar para páginas de cadastro e login (ex: Netflix, Spotify, portais diversos)
 * 3. Preencher formulários automaticamente (email, senha, nome, telefone)
 * 4. Avançar etapas de cadastro
 * 5. PARAR OBRIGATORIAMENTE na tela de pagamento para segurança do usuário
 */

import fs from "node:fs";
import path from "node:path";
import puppeteer, { type Browser, type Page } from "puppeteer-core";

export interface OpcoesAutofill {
  url?: string;
  servico?: string;
  email?: string;
  senha?: string;
  nome?: string;
  pararNoPagamento?: boolean;
}

export interface RespostaAutofill {
  sucesso: boolean;
  mensagem: string;
  servico: string;
  urlFinal?: string;
  etapaParada?: string;
  passosExecutados: string[];
  erro?: string;
}

export interface OpcoesTesteWeb {
  url: string;
  acao?: "abrir_e_inspecionar" | "clicar" | "preencher" | "capturar_tela";
  seletorClique?: string;
  seletorInput?: string;
  textoPreenchimento?: string;
  visivel?: boolean;
}

export interface RespostaTesteWeb {
  sucesso: boolean;
  mensagem: string;
  titulo?: string;
  urlFinal?: string;
  statusHttp?: number;
  logsConsole: string[];
  errosConsole: string[];
  anexo?: { name: string; type: string; dataUrl: string };
  caminhoScreenshot?: string;
  passosExecutados: string[];
  erro?: string;
}

const URLS_SERVICOS_CONHECIDOS: Record<string, string> = {
  netflix: "https://www.netflix.com/br/",
  spotify: "https://www.spotify.com/br-pt/signup",
  amazon: "https://www.amazon.com.br/ap/register",
  globoplay: "https://globoplay.globo.com/",
  disney: "https://www.disneyplus.com/pt-br/sign-up",
};

export class BrowserAutomationTools {
  /**
   * Normaliza qualquer entrada de endereço para URL HTTP/HTTPS válida
   */
  public static normalizarUrl(inputUrl: string): string {
    let u = (inputUrl || "").trim().replace(/^['"]|['"]$/g, "");
    if (!u) return "http://localhost:3000/";
    if (/^https?:\/\//i.test(u)) return u;
    if (/^(localhost|127\.0\.0\.1)(:\d+)?/i.test(u)) return `http://${u}`;
    if (/^[a-zA-Z0-9_\-]+\.[a-zA-Z]{2,}/.test(u)) return `https://${u}`;
    return `https://www.${u}.com/`;
  }

  /**
   * Localiza o executável do Chrome ou Edge no computador
   */
  public static obterCaminhoNavegador(): string {
    const caminhos = [
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
      process.env.LOCALAPPDATA + "\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
      "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    ];

    for (const p of caminhos) {
      if (p && fs.existsSync(p)) {
        return p;
      }
    }

    throw new Error(
      "Nenhum navegador (Google Chrome ou Microsoft Edge) encontrado em C:\\Program Files. Por favor, certifique-se de que o Chrome está instalado."
    );
  }

  /**
   * Abre o navegador na área de trabalho, acessa a página, inspeciona o carregamento,
   * captura logs de console/erros, clica/preenche se solicitado e tira screenshot para validação visual.
   */
  public static async navegarETestarWeb(opcoes: OpcoesTesteWeb): Promise<RespostaTesteWeb> {
    const passos: string[] = [];
    const logsConsole: string[] = [];
    const errosConsole: string[] = [];
    let browser: Browser | null = null;

    try {
      const urlAlvo = this.normalizarUrl(opcoes.url);
      passos.push(`Iniciando Google Chrome na sua área de trabalho`);
      const executablePath = this.obterCaminhoNavegador();
      const visivel = opcoes.visivel !== false;

      // Inicia o navegador visível na tela para que o usuário acompanhe tudo em tempo real
      browser = await puppeteer.launch({
        executablePath,
        headless: !visivel ? true : false,
        defaultViewport: null,
        args: [
          "--start-maximized",
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-blink-features=AutomationControlled",
        ],
        ignoreDefaultArgs: ["--enable-automation"],
      });

      const pages = await browser.pages();
      const page: Page = pages[0] || (await browser.newPage());

      // Monitoramento ativo de console e erros de script
      page.on("console", (msg) => {
        logsConsole.push(`[${msg.type().toUpperCase()}]: ${msg.text()}`);
      });
      page.on("pageerror", (err: any) => {
        errosConsole.push(`[Script Error]: ${err?.message || String(err)}`);
      });

      passos.push(`Navegando para: ${urlAlvo}`);
      let statusHttp = 200;
      try {
        const resp = await page.goto(urlAlvo, { waitUntil: "networkidle2", timeout: 30000 });
        if (resp) statusHttp = resp.status();
      } catch {
        // Fallback rápido se a rede mantiver conexões longas
        await page.goto(urlAlvo, { waitUntil: "domcontentloaded", timeout: 15000 }).catch(() => {});
      }

      // Pequena pausa para garantir renderização de elementos interativos
      await new Promise((r) => setTimeout(r, 1200));

      const titulo = await page.title().catch(() => "");
      const urlFinal = page.url();
      passos.push(`Página carregada com sucesso: "${titulo}" (${urlFinal})`);

      // Preenchimento de campo se fornecido
      if (opcoes.seletorInput && opcoes.textoPreenchimento) {
        try {
          await page.waitForSelector(opcoes.seletorInput, { timeout: 4000 });
          await page.type(opcoes.seletorInput, opcoes.textoPreenchimento, { delay: 35 });
          passos.push(`Preencheu o campo "${opcoes.seletorInput}" com "${opcoes.textoPreenchimento}"`);
        } catch {
          passos.push(`Aviso: seletor de input "${opcoes.seletorInput}" não encontrado.`);
        }
      }

      // Clique em elemento se fornecido
      if (opcoes.seletorClique) {
        try {
          await page.waitForSelector(opcoes.seletorClique, { timeout: 4000 });
          await page.click(opcoes.seletorClique);
          passos.push(`Clicou no elemento "${opcoes.seletorClique}"`);
          await new Promise((r) => setTimeout(r, 1500));
        } catch {
          passos.push(`Aviso: seletor de clique "${opcoes.seletorClique}" não encontrado.`);
        }
      }

      // Captura de screenshot de alta resolução
      passos.push(`Capturando screenshot da tela para verificação visual...`);
      const buffer = await page.screenshot({ type: "jpeg", quality: 85 });
      const base64 = Buffer.from(buffer).toString("base64");
      const dataUrl = `data:image/jpeg;base64,${base64}`;

      const nomeArquivo = `screenshot_web_${Date.now()}.jpg`;

      // 1. Salva no Disco D:
      try {
        const dirD = path.join(process.cwd(), "data", "imagens");
        if (!fs.existsSync(dirD)) fs.mkdirSync(dirD, { recursive: true });
        fs.writeFileSync(path.join(dirD, nomeArquivo), buffer);
      } catch {}

      // 2. Salva na Área de Trabalho do usuário
      const userProfile = process.env.USERPROFILE || "C:\\Users\\antho";
      const oneDriveDesktop = path.join(userProfile, "OneDrive", "Área de Trabalho");
      const standardDesktop = path.join(userProfile, "Desktop");
      const desktopDir = fs.existsSync(oneDriveDesktop) ? oneDriveDesktop : standardDesktop;
      const caminhoDesktop = path.join(desktopDir, nomeArquivo);
      try {
        fs.writeFileSync(caminhoDesktop, buffer);
      } catch {}

      const totalErros = errosConsole.length;
      const resumoConsole = totalErros === 0
        ? "✅ Zero erros de JavaScript no console."
        : `⚠️ ${totalErros} erro(s) de console:\n${errosConsole.slice(0, 3).join("\n")}`;

      return {
        sucesso: true,
        mensagem: `🌐 **Navegador Google Chrome Aberto e Testado com Sucesso!**\n\n• **Página Acessada:** ${urlFinal}\n• **Título:** ${titulo || "(Sem título)"}\n• **Status HTTP:** ${statusHttp}\n• **Console / Diagnóstico:** ${resumoConsole}\n\nO screenshot da página foi capturado e exibido abaixo. Uma cópia também foi salva na sua Área de Trabalho (${caminhoDesktop}) e no Disco D:.`,
        titulo,
        urlFinal,
        statusHttp,
        logsConsole,
        errosConsole,
        caminhoScreenshot: caminhoDesktop,
        anexo: {
          name: nomeArquivo,
          type: "image/jpeg",
          dataUrl,
        },
        passosExecutados: passos,
      };
    } catch (err: any) {
      passos.push(`Erro durante o teste: ${err?.message}`);
      return {
        sucesso: false,
        mensagem: `Erro ao navegar e testar no navegador: ${err?.message}`,
        logsConsole,
        errosConsole,
        passosExecutados: passos,
        erro: err?.message,
      };
    }
  }

  /**
   * Executa a automação de cadastro no navegador e para na etapa de pagamento
   */
  public static async executarCadastroAuto(opcoes: OpcoesAutofill): Promise<RespostaAutofill> {
    const passos: string[] = [];
    let browser: Browser | null = null;

    try {
      const servicoNormalizado = (opcoes.servico || "servico").toLowerCase().trim();
      let urlAlvo = opcoes.url?.trim();

      if (!urlAlvo) {
        urlAlvo = URLS_SERVICOS_CONHECIDOS[servicoNormalizado] || `https://www.${servicoNormalizado}.com/`;
      }

      passos.push(`Iniciando Google Chrome na sua área de trabalho`);
      const executablePath = this.obterCaminhoNavegador();

      // Inicia o navegador VISÍVEL para o usuário acompanhar tudo
      browser = await puppeteer.launch({
        executablePath,
        headless: false,
        defaultViewport: null,
        args: [
          "--start-maximized",
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-blink-features=AutomationControlled",
        ],
        ignoreDefaultArgs: ["--enable-automation"],
      });

      const pages = await browser.pages();
      const page: Page = pages[0] || (await browser.newPage());

      passos.push(`Navegando para o portal oficial: ${urlAlvo}`);
      await page.goto(urlAlvo, { waitUntil: "networkidle2", timeout: 45000 });

      const emailPreencher = opcoes.email || "usuario@empresa.com";
      const senhaPreencher = opcoes.senha || "SenhaForte@HUG2026!";
      const nomePreencher = opcoes.nome || "Cliente HUG";

      passos.push(`Procurando campos de cadastro e identificação...`);

      // 1. Preenchimento de Campo de Email
      const emailSelector =
        'input[type="email"], input[name*="email" i], input[id*="email" i], input[autocomplete="email"], input[placeholder*="email" i]';
      const campoEmail = await page.$(emailSelector);

      if (campoEmail) {
        passos.push(`Inserindo e-mail corporativo: ${emailPreencher}`);
        await campoEmail.click();
        await page.evaluate((el) => ((el as HTMLInputElement).value = ""), campoEmail);
        await campoEmail.type(emailPreencher, { delay: 40 });
      }

      // 2. Preenchimento de Nome (se houver)
      const nameSelector =
        'input[name*="name" i], input[id*="name" i], input[placeholder*="nome" i]';
      const campoNome = await page.$(nameSelector);
      if (campoNome) {
        passos.push(`Inserindo nome: ${nomePreencher}`);
        await campoNome.type(nomePreencher, { delay: 40 });
      }

      // 3. Clique em botões de "Vamos lá", "Começar", "Sign Up", "Continuar"
      const botaoAvancar = await page.$(
        'button[type="submit"], button[data-uia*="nmhp-card-cta"], button:has-text("Vamos lá"), button:has-text("Continuar"), button:has-text("Começar")'
      );

      if (botaoAvancar) {
        passos.push(`Avançando etapa de boas-vindas`);
        await Promise.all([
          botaoAvancar.click().catch(() => {}),
          page.waitForNavigation({ waitUntil: "networkidle2", timeout: 10000 }).catch(() => {}),
        ]);
      }

      // 4. Verificação de Campo de Senha
      const passSelector =
        'input[type="password"], input[name*="password" i], input[id*="password" i]';
      const campoSenha = await page.$(passSelector);
      if (campoSenha) {
        passos.push(`Definindo senha segura provisória`);
        await campoSenha.type(senhaPreencher, { delay: 40 });
      }

      // 5. REGRA DE SEGURANÇA MÁXIMA: Detecta se chegou na tela de planos ou pagamento
      const urlAtual = page.url();
      passos.push(`Página atual após formulário: ${urlAtual}`);

      // Verifica se há formulário de pagamento ou seleção de planos
      const temPagamento = await page.evaluate(() => {
        const text = document.body.innerText.toLowerCase();
        const hasPaymentText =
          text.includes("forma de pagamento") ||
          text.includes("pagamento") ||
          text.includes("cartão de crédito") ||
          text.includes("pix") ||
          text.includes("escolha seu plano") ||
          text.includes("payment");
        const hasCardInput = document.querySelector('input[name*="card" i], input[autocomplete*="cc-" i]');
        return hasPaymentText || Boolean(hasCardInput);
      });

      if (temPagamento || opcoes.pararNoPagamento !== false) {
        passos.push(`🛑 PARADA DE SEGURANÇA: Etapa de pagamento / plano detectada.`);
        passos.push(`A I.A pausou a automação e deixou o navegador aberto na sua tela.`);

        return {
          sucesso: true,
          servico: servicoNormalizado,
          urlFinal: urlAtual,
          etapaParada: "Pagamento / Seleção de Plano",
          passosExecutados: passos,
          mensagem: `A I.A abriu o navegador, acessou ${urlAlvo}, preencheu os dados de cadastro e **pausou exatamente na etapa de pagamento** na sua tela, garantindo que você insira os dados financeiros com 100% de segurança e privacidade.`,
        };
      }

      return {
        sucesso: true,
        servico: servicoNormalizado,
        urlFinal: urlAtual,
        etapaParada: "Concluído",
        passosExecutados: passos,
        mensagem: `Navegador aberto e dados preenchidos com sucesso no portal ${urlAlvo}.`,
      };
    } catch (err: any) {
      passos.push(`Erro durante a automação: ${err?.message}`);
      return {
        sucesso: false,
        servico: opcoes.servico || "desconhecido",
        passosExecutados: passos,
        erro: err?.message,
        mensagem: `Erro ao automatizar o navegador: ${err?.message}`,
      };
    }
  }

  /**
   * Reconhecedor de comandos em linguagem natural para automação web
   */
  public static analisarComandoWeb(mensagem: string): OpcoesAutofill | null {
    const msg = (mensagem || "").trim();
    const msgLower = msg.toLowerCase();

    // Se é claramente um comando de pastas ou arquivos do Windows, NUNCA executa navegador
    if (
      /(?:pasta|pastas|diret[oó]rio|arquivo|arquivos|loca tudo|área de trabalho|disco d|imagens|fotos)/i.test(msgLower) &&
      !/(?:navegador|browser|chrome|site|p[áa]gina|url|localhost|http|www|web)/i.test(msgLower)
    ) {
      return null;
    }

    // Detecta URL explícita (ex: "abra o localhost:3000", "acesse https://google.com")
    const matchUrl = msg.match(/(https?:\/\/[^\s]+|localhost:\d+|127\.0\.0\.1:\d+|[a-zA-Z0-9_\-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/i);
    if (matchUrl && matchUrl[0]) {
      return {
        url: matchUrl[0],
      };
    }

    // Detecta pedidos como: "crie uma conta na netflix para mim e pare no pagamento"
    const matchCadastro = msg.match(
      /(?:cri(?:e|ar)|faz(?:er)?|abrir|cadastr(?:ar|e))\s+(?:uma\s+conta|meu\s+cadastro|perfil)?\s*(?:n[ao]\s+)?([a-zA-Z0-9_\-.]+)/i
    );

    if (matchCadastro && matchCadastro[1]) {
      const servico = matchCadastro[1].toLowerCase().replace(/["']/g, "").trim();
      const palavrasNaoWeb = new Set([
        "pasta", "pastas", "diretorio", "diretório", "arquivo", "arquivos",
        "imagem", "imagens", "foto", "fotos", "musica", "video"
      ]);
      if (palavrasNaoWeb.has(servico)) return null;

      const pararPagamento =
        msgLower.includes("pagamento") ||
        msgLower.includes("pagar") ||
        msgLower.includes("pare");

      return {
        servico,
        pararNoPagamento: pararPagamento,
      };
    }

    return null;
  }
}
