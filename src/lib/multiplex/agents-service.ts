/**
 * HUG Agents - Serviço Central de Inteligência e Gerenciamento de Agentes
 * 
 * Controla:
 * - Ciclo de vida dos agentes (criação, edição, duplicação, exclusão)
 * - Templates oficiais do ecossistema HUG
 * - Histórico de conversas isolado por usuário e workspace
 * - Integração oficial com HUG IA Core (sem chamadas diretas a APIs externas no frontend)
 * - Parâmetros de auto-atendimento no WhatsApp
 */

export interface CustomAgent {
  id: string;
  name: string;
  role: string;
  description: string;
  systemPrompt: string;
  avatarIcon: string; // nome do ícone semântico (MessageSquare, ShoppingBag, Store, ShieldCheck, Wallet, etc.)
  model: "hug-ultra" | "hug-fast" | "hug-reasoning";
  temperature: number;
  active: boolean;
  whatsappEnabled: boolean;
  whatsappNumber?: string;
  instagramEnabled?: boolean;
  instagramUsername?: string;
  facebookEnabled?: boolean;
  facebookPageName?: string;
  humanHandoffEnabled: boolean;
  knowledgeFiles: { name: string; size: string; type: string }[];
  welcomeMessage: string;
  quickPrompts: string[];
  createdAt: string;
  updatedAt: string;
  userId?: string;
  companyId?: string;
}

export interface AgentChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
  agentId?: string;
  attachments?: { name: string; type: string; url?: string; dataUrl?: string }[];
  tempoProcessamentoSegundos?: number;
  etapasPensamento?: { label: string; status: "concluido" | "em_andamento" | "pendente"; duracao?: string }[];
}

export interface AgentConversation {
  id: string;
  agentId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: AgentChatMessage[];
  pinned?: boolean;
}

export const OFFICIAL_AGENT_TEMPLATES: Omit<CustomAgent, "id" | "createdAt" | "updatedAt">[] = [
  {
    name: "Desktop OS & Arquivos",
    role: "Gerenciador do Sistema de Arquivos Windows",
    description: "Cria pastas no disco D:, move arquivos e documentos, busca caminhos exatos no PC e organiza seus projetos locais.",
    systemPrompt: `Você é o Agente Desktop OS & Arquivos do ecossistema HUG.
REGRAS MANDATÓRIAS E INEGOCIÁVEIS:
1. NUNCA faça nada que o usuário não mandou explicitamente.
2. NUNCA diga ou prometa que vai fazer algo que não foi ordenado (ex: NUNCA diga "vou recriar a pasta", "vou criar novamente" por iniciativa própria).
3. NUNCA finja ações: só confirme que criou, abriu ou moveu uma pasta ou arquivo se a ferramenta correspondente tiver sido chamada e executada com sucesso real no sistema operacional.
4. Mantenha continuidade do contexto: se você acabou de criar ou falar de uma pasta (ex: "HIG") e logo depois o usuário disser "abra a pasta para mim", abra a mesma pasta do contexto sem perguntar o nome novamente.
5. Se o usuário pedir para criar na Área de Trabalho (Desktop), crie na Área de Trabalho. Se pedir no Disco D, crie no Disco D.
6. Seja direto, conciso e objetivo.`,
    avatarIcon: "HardDrive",
    model: "hug-fast",
    temperature: 0.2,
    active: true,
    whatsappEnabled: false,
    humanHandoffEnabled: false,
    knowledgeFiles: [],
    welcomeMessage: "Pronto para comandos de arquivos e pastas no Windows.",
    quickPrompts: [
      "Criar nova pasta",
      "Listar pastas no Disco D:",
      "Localizar arquivo no PC",
      "Mover arquivo de pasta",
    ],
  },
  {
    name: "Browser & Autofill",
    role: "Automação Web",
    description: "Automação de navegador e cadastros.",
    systemPrompt: `Você é o Agente Browser & Autofill, especialista em automação e preenchimento de formulários web no navegador.
OBJETIVOS:
1. Abrir o Google Chrome no computador e acessar portais solicitados (Netflix, Spotify, etc.).
2. Preencher dados de cadastro (email, senha provisória, nome).
3. Avançar etapas de formulário até chegar na tela de pagamento.
4. PARAR IMEDIATAMENTE na etapa de pagamento e deixar a tela aberta para que o usuário insira seus dados financeiros com 100% de privacidade e segurança.`,
    avatarIcon: "Globe",
    model: "hug-fast",
    temperature: 0.2,
    active: true,
    whatsappEnabled: false,
    humanHandoffEnabled: false,
    knowledgeFiles: [],
    welcomeMessage: "Pronto para navegar e preencher cadastros.",
    quickPrompts: [
      "Criar conta na Netflix (parar no pagamento)",
      "Acessar Spotify e iniciar cadastro",
      "Preencher cadastro web",
      "Abrir portal de login",
    ],
  },
  {
    name: "Agente de Vendas Multicanal",
    role: "Especialista em Vendas & Conversão",
    description: "Atende clientes no WhatsApp, Instagram e Facebook, apresenta produtos do catálogo, calcula frete e envia links de pagamento rápidos.",
    systemPrompt: `Você é o Agente Oficial de Vendas da empresa multicanal (WhatsApp, Instagram e Facebook), operando no HUG IA Core.
OBJETIVOS:
1. Atender os clientes com extrema cordialidade, objetividade e dinamismo.
2. Identificar rapidamente o produto ou serviço que o cliente deseja.
3. Consultar o catálogo e estoque antes de informar disponibilidade e preços.
4. Conduzir o cliente ao fechamento com links de pagamento PIX e cartão.
5. Se o cliente solicitar falar com atendente humano, encaminhar com presteza e anotar a solicitação.`,
    avatarIcon: "ShoppingBag",
    model: "hug-fast",
    temperature: 0.6,
    active: true,
    whatsappEnabled: true,
    whatsappNumber: "(66) 99273-4632",
    instagramEnabled: true,
    instagramUsername: "@empresa",
    facebookEnabled: true,
    facebookPageName: "Página Oficial",
    humanHandoffEnabled: true,
    knowledgeFiles: [],
    welcomeMessage: "Olá! Sou o assistente de vendas da empresa. Como posso te ajudar hoje a encontrar o que procura?",
    quickPrompts: [
      "Quais os produtos mais vendidos hoje?",
      "Como consultar a entrega para meu endereço?",
      "Simular atendimento de cliente indeciso",
      "Gerar link de pagamento PIX para pedido",
    ],
  },
  {
    name: "Agente de Suporte & Pós-Venda",
    role: "Suporte ao Cliente & Chamados",
    description: "Tira dúvidas de pedidos, rastreio de entregas, trocas, devoluções e suporte com protocolo formal.",
    systemPrompt: `Você é o Agente de Suporte ao Cliente da empresa, operando no HUG IA Core.
OBJETIVOS:
1. Ouvir com empatia a dúvida, elogio ou reclamação do cliente.
2. Localizar o número do pedido ou CPF/CNPJ do cliente.
3. Explicar prazos de garantia, políticas de devolução e código de rastreamento.
4. Manter tom acolhedor, profissional e tranquilizador.`,
    avatarIcon: "ShieldCheck",
    model: "hug-ultra",
    temperature: 0.5,
    active: true,
    whatsappEnabled: true,
    whatsappNumber: "(66) 99273-4632",
    instagramEnabled: true,
    instagramUsername: "@empresa",
    facebookEnabled: true,
    facebookPageName: "Página Oficial",
    humanHandoffEnabled: true,
    knowledgeFiles: [],
    welcomeMessage: "Olá! Sou o assistente de suporte e pós-venda. Tem alguma dúvida sobre seu pedido ou entrega?",
    quickPrompts: [
      "Como rastrear o pedido de um cliente?",
      "Qual o prazo padrão para trocas e devoluções?",
      "Gerar protocolo de atendimento formal",
      "Como acionar a garantia do produto?",
    ],
  },
  {
    name: "Agente Farmacêutico & Clínico",
    role: "Apoio Farmacêutico & Posologia",
    description: "Especializado em drogarias: orienta retenção de receita Anvisa (Portaria 344), posologia e tele-entrega rápida.",
    systemPrompt: `Você é o Agente Farmacêutico HUG, operando no HUG IA Core.
OBJETIVOS:
1. Esclarecer dúvidas posológicas e bula de medicamentos sem substituir consulta médica presencial.
2. Informar com rigor a necessidade de receita para antibióticos (RDC 20) e controlados (Portaria 344).
3. Oferecer opções de genéricos e similares para economia do paciente.
4. Facilitar o pedido para tele-entrega na cidade.`,
    avatarIcon: "Store",
    model: "hug-reasoning",
    temperature: 0.3,
    active: true,
    whatsappEnabled: true,
    humanHandoffEnabled: true,
    knowledgeFiles: [],
    welcomeMessage: "Olá! Sou o assistente farmacêutico. Precisa consultar a disponibilidade de algum medicamento ou enviar sua receita?",
    quickPrompts: [
      "Qual a diferença entre genérico e referência?",
      "Quais remédios precisam de receita retida?",
      "Consultar posologia recomendada de analgésicos",
      "Verificar regras de tele-entrega de medicamentos",
    ],
  },
  {
    name: "Agente Financeiro & Cobrança",
    role: "Conciliação & Faturas",
    description: "Emissão de 2ª via de boleto, chave PIX, conciliação de faturas e negociação amigável de débitos.",
    systemPrompt: `Você é o Agente Financeiro da empresa, operando no HUG IA Core.
OBJETIVOS:
1. Ajudar clientes a emitir 2ª via de boletos e gerar QR Code PIX instantâneo.
2. Confirmar o recebimento de comprovantes de pagamento com verificação.
3. Propor condições de parcelamento ou quitação com clareza matemática.
4. Jamais ser hostil ou desrespeitoso com o cliente.`,
    avatarIcon: "Wallet",
    model: "hug-fast",
    temperature: 0.4,
    active: true,
    whatsappEnabled: true,
    humanHandoffEnabled: true,
    knowledgeFiles: [],
    welcomeMessage: "Olá! Sou o assistente financeiro. Precisa de 2ª via de fatura, boleto ou confirmação de pagamento?",
    quickPrompts: [
      "Como gerar chave PIX para acerto de conta?",
      "Emitir demonstrativo de compras do mês",
      "Calcular juros ou descontos para quitação à vista",
      "Simular proposta de parcelamento",
    ],
  },
];

const CHAVE_AGENTS_STORAGE = (userId: string) => `hug_agents_list_${userId || "default"}`;
const CHAVE_CONVERSATIONS_STORAGE = (userId: string) => `hug_agents_conversations_${userId || "default"}`;

const memoryStore = new Map<string, string>();

function safeGetItem(key: string): string | null {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch {}
  return memoryStore.get(key) || null;
}

function safeSetItem(key: string, value: string): void {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(key, value);
      return;
    }
  } catch {}
  memoryStore.set(key, value);
}

function safeRemoveItem(key: string): void {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem(key);
      return;
    }
  } catch {}
  memoryStore.delete(key);
}

export const HugAgentsService = {
  /**
   * Obtém a lista de agentes do usuário autenticado.
   * Se for a primeira vez, inicializa com os templates oficiais do HUG.
   */
  obterAgentes(userId: string = "default"): CustomAgent[] {
    try {
      const raw = safeGetItem(CHAVE_AGENTS_STORAGE(userId));
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasDesktop = parsed.some((a: any) => a.name && (a.name.includes("Desktop") || a.name.includes("Pastas")));
          if (!hasDesktop) {
            const tplDesktop = OFFICIAL_AGENT_TEMPLATES.find((t) => t.name.includes("Desktop"));
            if (tplDesktop) {
              const novoDesktop = {
                ...tplDesktop,
                id: `agent-hug-desktop-${Date.now().toString(36)}`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              parsed.unshift(novoDesktop);
            }
          }

          const hasBrowser = parsed.some((a: any) => a.name && (a.name.includes("Browser") || a.name.includes("Autofill")));
          if (!hasBrowser) {
            const tplBrowser = OFFICIAL_AGENT_TEMPLATES.find((t) => t.name.includes("Browser"));
            if (tplBrowser) {
              const novoBrowser = {
                ...tplBrowser,
                id: `agent-hug-browser-${Date.now().toString(36)}`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              parsed.splice(1, 0, novoBrowser);
            }
          }

          let mudou = !hasDesktop || !hasBrowser;
          parsed.forEach((a: any) => {
            if (a.name && /^HUG\s+/i.test(a.name)) {
              a.name = a.name.replace(/^HUG\s+/i, "");
              mudou = true;
            }
          });

          if (mudou) {
            safeSetItem(CHAVE_AGENTS_STORAGE(userId), JSON.stringify(parsed));
          }
          return parsed;
        }
      }

      // Inicializa com templates oficiais
      const iniciais: CustomAgent[] = OFFICIAL_AGENT_TEMPLATES.map((tpl, idx) => ({
        ...tpl,
        id: `agent-hug-${idx + 1}-${Date.now().toString(36)}`,
        createdAt: new Date(Date.now() - (4 - idx) * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
        userId,
      }));

      safeSetItem(CHAVE_AGENTS_STORAGE(userId), JSON.stringify(iniciais));
      return iniciais;
    } catch {
      return OFFICIAL_AGENT_TEMPLATES.map((t, idx) => ({
        ...t,
        id: `agent-tpl-${idx + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
    }
  },

  salvarAgente(agente: CustomAgent, userId: string = "default"): CustomAgent[] {
    const lista = this.obterAgentes(userId);
    const index = lista.findIndex((a) => a.id === agente.id);
    let atualizada: CustomAgent[];

    const sanitizado: CustomAgent = {
      ...agente,
      updatedAt: new Date().toISOString(),
      userId,
    };

    if (index >= 0) {
      atualizada = [...lista];
      atualizada[index] = sanitizado;
    } else {
      atualizada = [sanitizado, ...lista];
    }

    safeSetItem(CHAVE_AGENTS_STORAGE(userId), JSON.stringify(atualizada));
    return atualizada;
  },

  excluirAgente(agentId: string, userId: string = "default"): CustomAgent[] {
    const lista = this.obterAgentes(userId);
    const filtrada = lista.filter((a) => a.id !== agentId);
    safeSetItem(CHAVE_AGENTS_STORAGE(userId), JSON.stringify(filtrada));
    return filtrada;
  },

  duplicarAgente(agentId: string, userId: string = "default"): CustomAgent[] {
    const lista = this.obterAgentes(userId);
    const alvo = lista.find((a) => a.id === agentId);
    if (!alvo) return lista;

    const copia: CustomAgent = {
      ...alvo,
      id: `agent-hug-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      name: `${alvo.name} (Cópia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const atualizada = [copia, ...lista];
    safeSetItem(CHAVE_AGENTS_STORAGE(userId), JSON.stringify(atualizada));
    return atualizada;
  },

  /**
   * Sanitiza conversas removendo base64 gigantes antes de persistir no localStorage
   * para evitar estouro de cota (QuotaExceededError de 5MB)
   */
  sanitizarConversas(conversas: AgentConversation[]): AgentConversation[] {
    return conversas.map((c) => ({
      ...c,
      messages: (c.messages || []).map((m) => ({
        ...m,
        attachments: m.attachments?.map((a) => ({
          name: a.name,
          type: a.type,
          dataUrl: a.dataUrl && a.dataUrl.length < 50000 ? a.dataUrl : undefined,
        })),
      })),
    }));
  },

  /**
   * Conversas do usuário
   */
  obterConversas(userId: string = "default"): AgentConversation[] {
    try {
      const raw = safeGetItem(CHAVE_CONVERSATIONS_STORAGE(userId));
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  async sincronizarConversasServidor(userId: string = "default"): Promise<AgentConversation[]> {
    try {
      const resp = await fetch(`/api/ai/conversations?userEmail=${encodeURIComponent(userId)}`);
      if (resp.ok) {
        const data = await resp.json();
        if (data.success && Array.isArray(data.conversations) && data.conversations.length > 0) {
          const locais = this.obterConversas(userId);
          const map = new Map<string, AgentConversation>();
          for (const c of data.conversations) map.set(c.id, c);
          for (const c of locais) map.set(c.id, c);
          const mescladas = Array.from(map.values()).sort(
            (a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
          );
          safeSetItem(CHAVE_CONVERSATIONS_STORAGE(userId), JSON.stringify(this.sanitizarConversas(mescladas)));
          return mescladas;
        }
      }
    } catch {}
    return this.obterConversas(userId);
  },

  salvarConversa(conversa: AgentConversation, userId: string = "default"): AgentConversation[] {
    const lista = this.obterConversas(userId);
    const index = lista.findIndex((c) => c.id === conversa.id);
    let atualizada: AgentConversation[];

    const sanitizada: AgentConversation = {
      ...conversa,
      updatedAt: new Date().toISOString(),
    };

    if (index >= 0) {
      atualizada = [...lista];
      atualizada[index] = sanitizada;
    } else {
      atualizada = [sanitizada, ...lista];
    }

    const paraSalvar = this.sanitizarConversas(atualizada);
    safeSetItem(CHAVE_CONVERSATIONS_STORAGE(userId), JSON.stringify(paraSalvar));

    // Backup assíncrono em disco D: via API local
    try {
      if (typeof window !== "undefined") {
        fetch("/api/ai/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userEmail: userId, conversation: sanitizada }),
        }).catch(() => {});
      }
    } catch {}

    return atualizada;
  },

  excluirConversa(conversaId: string, userId: string = "default"): AgentConversation[] {
    const lista = this.obterConversas(userId);
    const filtrada = lista.filter((c) => c.id !== conversaId);
    safeSetItem(CHAVE_CONVERSATIONS_STORAGE(userId), JSON.stringify(this.sanitizarConversas(filtrada)));

    try {
      if (typeof window !== "undefined") {
        fetch(`/api/ai/conversations?userEmail=${encodeURIComponent(userId)}&id=${encodeURIComponent(conversaId)}`, {
          method: "DELETE",
        }).catch(() => {});
      }
    } catch {}

    return filtrada;
  },

  /**
   * Envia uma mensagem para o HUG IA Core utilizando o prompt do agente
   */
  async enviarMensagem(params: {
    mensagem: string;
    agente: CustomAgent;
    historico: AgentChatMessage[];
    images?: Array<{ name?: string; type?: string; dataUrl: string }>;
    token?: string | null;
  }): Promise<{ resposta: string; erro?: string }> {
    try {
      // Formata histórico prévio para o formato aceito pelo HUG IA Core
      const historyFormatted = params.historico.map((m) => ({
        role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
        content: m.content,
      }));

      // Injeta instrução do agente com a maior prioridade
      const promptContexto = `[AGENTE ATIVO: ${params.agente.name} (${params.agente.role})]
DIRETRIZES DO AGENTE:
${params.agente.systemPrompt}

MODELO SELECIONADO: ${params.agente.model}
WHATSAPP AUTO-REPLY: ${params.agente.whatsappEnabled ? "ATIVO" : "DESATIVADO"}
TRANSBORDO HUMANO: ${params.agente.humanHandoffEnabled ? "ATIVO" : "DESATIVADO"}
`;

      const resp = await fetch("/api/ai/public-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(params.token ? { Authorization: `Bearer ${params.token}` } : {}),
        },
        body: JSON.stringify({
          message: `${promptContexto}\n\nMENSAGEM DO USUÁRIO:\n${params.mensagem}`,
          history: historyFormatted,
          images: params.images || [],
        }),
      });

      if (!resp.ok) {
        throw new Error(`O HUG IA Core retornou código HTTP ${resp.status}`);
      }

      const data = await resp.json();
      const resposta = data.reply || data.message || data.text || "Mensagem processada pelo agente.";
      return { resposta };
    } catch (err: any) {
      // Fallback inteligente para garantir resposta mesmo em modo offline/sem chaves no ambiente de teste
      const fallbackResposta = `Olá! Sou o agente **${params.agente.name}** operando no HUG IA Core.

Recebi sua solicitação: "${params.mensagem}".

Minhas instruções ativas:
- **Papel:** ${params.agente.role}
- **WhatsApp:** ${params.agente.whatsappEnabled ? "Canal conectado e pronto para responder clientes." : "Canal exclusivo interno."}
- **Regra de Transbordo:** ${params.agente.humanHandoffEnabled ? "Habilitado para transferir a atendente humano se necessário." : "Resolução 100% autônoma."}

Como posso ajudar você agora?`;

      return { resposta: fallbackResposta, erro: err?.message };
    }
  },
};
