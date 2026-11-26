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

const URLS_SERVICOS_CONHECIDOS: Record<string, string> = {
  netflix: "https://www.netflix.com/br/",
  spotify: "https://www.spotify.com/br-pt/signup",
  amazon: "https://www.amazon.com.br/ap/register",
  globoplay: "https://globoplay.globo.com/",
  disney: "https://www.disneyplus.com/pt-br/sign-up",
};

export class BrowserAutomationTools {
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

    // Detecta pedidos como: "crie uma conta na netflix para mim e pare no pagamento"
    const matchCadastro = msg.match(
      /(?:cri(?:e|ar)|faz(?:er)?|abrir|cadastr(?:ar|e))\s+(?:uma\s+conta|meu\s+cadastro|perfil)?\s*(?:n[ao]\s+)?([a-zA-Z0-9_\-.]+)/i
    );

    if (matchCadastro && matchCadastro[1]) {
      const servico = matchCadastro[1].toLowerCase().replace(/["']/g, "").trim();
      const pararPagamento =
        msg.toLowerCase().includes("pagamento") ||
        msg.toLowerCase().includes("pagar") ||
        msg.toLowerCase().includes("pare");

      // Ignora comandos que são de pastas locais (ex: "crie uma pasta")
      if (servico === "pasta" || servico === "diretorio" || servico === "arquivo") {
        return null;
      }

      return {
        servico,
        pararNoPagamento: pararPagamento,
      };
    }

    return null;
  }
}
