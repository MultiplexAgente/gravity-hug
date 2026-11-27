import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { providerApiKey } from "@/lib/multiplex/model-registry.server";
import { HugAISecurityShield } from "@/lib/multiplex/ai-security";
import { DesktopFSTools } from "@/lib/multiplex/desktop-fs-tools";
import { BrowserAutomationTools } from "@/lib/multiplex/browser-automation-tools";

const BodySchema = z.object({
  message: z.string().max(64000).optional().default(""),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(64000),
      })
    )
    .optional()
    .default([]),
  conversationId: z.string().optional(),
  images: z
    .array(
      z.object({
        name: z.string().optional(),
        type: z.string().optional().default("image/jpeg"),
        dataUrl: z.string(),
      })
    )
    .optional()
    .default([]),
  audio: z
    .object({
      dataUrl: z.string(),
      mimeType: z.string().optional().default("audio/webm"),
      name: z.string().optional(),
    })
    .optional()
    .nullable(),
});

export const HUG_INSTITUCIONAL_SYSTEM_PROMPT = `Você é a HUG I.A., a assistente de inteligência artificial oficial do ecossistema HUG, desenvolvida pela BonaSoft (bonasoftmt.com).

IDENTIDADE E PROPÓSITO:
- Quem te desenvolveu: Fui desenvolvida pela BonaSoft, empresa de tecnologia e inteligência corporativa sediada no Mato Grosso.
- O que é o HUG: É uma plataforma integrada de gestão empresarial e inteligência comercial que unifica todas as pontas da empresa: retaguarda, frente de caixa (PDV), estoque físico e digital, faturamento, loja virtual e inteligência operacional em tempo real.
- Natureza da sua inteligência: Você é uma inteligência artificial generativa multimodal real, conectada ao HUG IA Core, com capacidade de raciocínio avançado, visão computacional para análise de fotos, documentos, notas fiscais, códigos de barras, produtos e estoques, processamento de áudio/voz e integração a ferramentas operacionais.
- Nível de processamento: Opera no motor central de inteligência artificial da HUG configurado com raciocínio avançado e capacidade de visão e áudio.
- Diferença entre você e um chatbot tradicional: Um chatbot tradicional segue fluxos rígidos de perguntas e respostas pré-programadas com palavras-chave estáticas. Você é uma IA generativa que compreende intenções, mantém contexto em múltiplos turnos de conversa, raciocina sobre problemas de negócios e adapta respostas dinamicamente.
- Diferença entre você e o ChatGPT: O ChatGPT é um modelo de linguagem generalista de uso amplo. A HUG I.A. é um agente especializado no ecossistema empresarial HUG, desenhado para rotinas comerciais, regras tributárias, frente de caixa, estoque e governança corporativa da plataforma.

ECOSSISTEMA HUG E MÓDULOS:
1. HUG Gestão: Retaguarda administrativa completa com fluxo de caixa, contas a pagar e receber, conciliação financeira, faturamento e relatórios estratégicos para matriz e filiais.
2. HUG POS (Ponto de Venda): PDV ultrarrápido com emissão fiscal (NFC-e e NF-e em menos de 1s), suporte a leitor de código de barras, teclado de atalhos e múltiplos caixas simultâneos.
3. HUG Mobile: Aplicativo móvel para atendimento no salão, consulta ágil de preços no balcão e conferência de inventário pelo smartphone.
4. HUG Store: Catálogo público online sincronizado instantaneamente ao estoque físico para pedidos com entrega ou retirada no balcão.
5. HUG I.A.: Assistente inteligente em linguagem natural e multimodal para apoio à decisão, consulta rápida e automação operacional.

SEGMENTOS ATENDIDOS E REGRAS DE NEGÓCIO:
- Materiais, Papelarias e Ferramentas: Busca instantânea por SKU/EAN/ISBN, conversão de unidades fracionadas (m², kg, metro linear, resma, caixa) e expedição por rotas.
- Supermercados e Mercearias: Checkout de alta rotação, pesagem de balança rodoviária e de checkout, múltiplos caixas simultâneos e baixa automática.
- Moda e Vestuário: Grade matricial de cores e tamanhos, coleções sazonais e catálogo virtual integrado.
- Gastronomia e Restaurantes: Comandas eletrônicas, mesas sincronizadas, delivery e baixa por ficha técnica de insumos.
- Beleza e Clínicas: Agendamento integrado por profissional, comissões automáticas e prontuário de atendimentos.
- Farmácias e Drogarias: Rastreabilidade unitária de lotes, controle rigoroso de validade (FEFO), retenção de receitas e conformidade com a Portaria 344 e ANVISA.
- Agro & Fazendas: Gestão de safras, talhões, pesagem em balança rodoviária, umidade e classificação de grãos, estocagem em silos e armazéns e faturamento rural.

PLANOS E PREÇOS OFICIAIS (100% TRANSPARENTES, SEM FIDELIDADE E SEM TAXA OCULTA):
- Starter: R$ 129,00/mês — Para comércios que buscam agilidade no balcão (PDV ágil, catálogo online integrado, controle de estoque e vendas, gestão de clientes).
- Business: R$ 199,00/mês (Recomendado) — Para operações em crescimento (todos os recursos do Starter + multicanal balcão/web, assistente HUG I.A., múltiplos caixas e relatórios detalhados).
- Premium: R$ 399,00/mês — Para operações corporativas e redes (todos os recursos do Business + múltiplas filiais conectadas, acesso prioritário ao HUG I.A., auditoria avançada e suporte prioritário).

PROCESSAMENTO MULTIMODAL:
- Quando o usuário enviar imagens: analise detalhadamente o conteúdo visual (leia textos, etiquetas, valores de notas fiscais, identifique produtos, marcas, embalagens ou itens) e relacione com os processos do ecossistema HUG ou com a dúvida feita pelo usuário.
- Quando o usuário enviar áudio: o sistema transcreve o áudio para você; responda diretamente ao que foi falado de maneira natural.

DIRETRIZES DE COMPORTAMENTO CONVERSACIONAL (MUITO IMPORTANTE):
1. REGRA SUPREMA: NUNCA faça nada que o usuário não mandou explicitamente, e NUNCA diga ou prometa que vai fazer algo que não foi ordenado.
2. É expressamente proibido dizer: "Vou recriar a pasta", "Vou criar novamente", "Deixe-me corrigir criando...", ou assumir iniciativas voluntárias não solicitadas.
3. NUNCA FINJA OU SIMULE AÇÕES: Você JAMAIS deve responder afirmando que criou, abriu, moveu ou apagou uma pasta ou arquivo sem ter executado a respectiva ferramenta ('criar_pasta', 'abrir_pasta_explorer', 'mover_arquivo') e recebido a confirmação real do sistema operacional.
4. CONTINUIDADE RIGOROSA DO CONTEXTO & MEMÓRIA: Leia com atenção extrema as mensagens anteriores.
   - "Área de Trabalho", "Desktop" e "Home" referem-se ao mesmo local principal no Windows do usuário (Área de Trabalho / OneDrive).
   - Se o usuário falar "abra a pasta para mim", "a que você acabou de criar", "a que está na home", "abra a pasta HUG", "abra o arquivo X": VOCÊ JÁ SABE o que ele quer! Chame IMEDIATAMENTE 'abrir_pasta_explorer' passando o nome da pasta ou arquivo.
   - NUNCA pergunte "qual o nome da pasta?" ou "qual a localização?".
   - NUNCA responda dizendo "Vou abrir... um momento por favor" ou "Deixe-me abrir...": você DEVE invocar a ferramenta no mesmo instante!
5. Converse de forma natural, humana, segura, direta e profissional.
6. NUNCA comece suas respostas com frases robóticas ou templates repetitivos.
7. Responda PRIMEIRO e OBJETIVAMENTE ao que foi perguntado.
8. É TERMINANTEMENTE PROIBIDO usar ícones de IA, estrelas, faíscas ou sparkles (como ✨, ⭐ ou qualquer símbolo similar).

OPERAÇÕES NO COMPUTADOR DO USUÁRIO (SISTEMA DE ARQUIVOS WINDOWS):
- Você tem ferramentas nativas para interagir com o computador do usuário: buscar_arquivos, abrir_pasta_explorer, mover_arquivo, criar_pasta e listar_diretorio.
- Quando o usuário mandar criar uma pasta (ex: "crie uma pasta HIG na minha área de trabalho"): CHAME OBRIGATORIAMENTE a ferramenta 'criar_pasta' passando o nome e local.
- Quando o usuário solicitar abrir uma pasta ou arquivo (ex: "abra a pasta para mim", "abra a pasta HUG", "abra o arquivo"): CHAME OBRIGATORIAMENTE 'abrir_pasta_explorer' ou 'buscar_arquivos'.
- Quando o usuário solicitar mover arquivos: CHAME OBRIGATORIAMENTE 'mover_arquivo'.`;

async function transcreverAudioWhisper(
  audioDataUrl: string,
  apiKey: string,
  mimeType = "audio/webm"
): Promise<string> {
  try {
    const base64Index = audioDataUrl.indexOf("base64,");
    const rawBase64 = base64Index !== -1 ? audioDataUrl.slice(base64Index + 7) : audioDataUrl;
    const buffer = Buffer.from(rawBase64, "base64");

    const extension = mimeType.includes("mp4")
      ? "mp4"
      : mimeType.includes("wav")
      ? "wav"
      : mimeType.includes("ogg")
      ? "ogg"
      : "webm";

    const file = new File([buffer], `audio_input.${extension}`, { type: mimeType });
    const formData = new FormData();
    formData.append("file", file);
    formData.append("model", "whisper-1");
    formData.append("language", "pt");

    const resp = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (resp.ok) {
      const data = await resp.json();
      return (data.text || "").trim();
    } else {
      const errText = await resp.text();
      console.warn("[Whisper Audio Transcription Failed]:", errText);
    }
  } catch (error) {
    console.error("[Whisper Error]:", error);
  }
  return "";
}

export const Route = createFileRoute("/api/ai/public-chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => null);
          const parsed = BodySchema.safeParse(body);

          if (!parsed.success) {
            return Response.json(
              { ok: false, error: parsed.error.issues[0]?.message || "Dados inválidos." },
              { status: 400 }
            );
          }

          const { message, history = [], conversationId, images = [], audio } = parsed.data;
          const convId = conversationId || `conv_pub_${Date.now().toString(36)}`;
          const modelTarget = "gpt-6.2-astra";

          const openAiKey =
            providerApiKey("openai") ||
            process.env.OPENAI_API_KEY ||
            process.env.VITE_OPENAI_API_KEY;

          // 1. Processamento de áudio se enviado
          let audioTranscription = "";
          if (audio && audio.dataUrl && openAiKey) {
            audioTranscription = await transcreverAudioWhisper(
              audio.dataUrl,
              openAiKey,
              audio.mimeType || "audio/webm"
            );
          }

          // Monta a mensagem textual combinada
          let combinedMessage = message.trim();
          if (audioTranscription) {
            if (combinedMessage) {
              combinedMessage = `${combinedMessage}\n\n[Mensagem em áudio enviada pelo usuário: "${audioTranscription}"]`;
            } else {
              combinedMessage = audioTranscription;
            }
          }

          if (!combinedMessage && images.length === 0) {
            return Response.json(
              { ok: false, error: "Nenhuma mensagem, imagem ou áudio foi fornecido." },
              { status: 400 }
            );
          }

          // Se só tem imagem sem texto explícito
          if (!combinedMessage && images.length > 0) {
            combinedMessage = "Por favor, analise a(s) imagem(ns) enviada(s) e me dê detalhes ou informações relevantes.";
          }

          // BLINDAGEM DE SEGURANÇA: HUG AI Security & Anti-Fraud Shield
          const threat = HugAISecurityShield.inspecionarEntrada(combinedMessage, {
            identificadorCliente: convId,
            nomeEmpresa: "HUG",
          });

          if (threat.bloqueado) {
            return Response.json({
              ok: true,
              reply: threat.respostaSegura || "Mensagem bloqueada pelos protocolos de segurança do HUG IA Core.",
              transcription: audioTranscription || undefined,
              modelUsed: "hug-security-shield",
              requestId: `sec-block-${Date.now()}`,
              conversationId: convId,
              securityTriggered: true,
            });
          }

          // 2. TENTATIVA VIA HUG IA CORE GATEWAY HTTP
          const coreUrl =
            process.env.HUG_CORE_GATEWAY_URL ||
            process.env.HUG_IA_CORE_URL ||
            "http://127.0.0.1:5055";

          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 6000);

            const coreResp = await fetch(`${coreUrl}/api/v1/ia/chat`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Hug-Application-Key": "hug_core_internal_sec_2026",
                Authorization: "Bearer hug-internal-hub-token-2026",
                "x-company-id": "1017",
                "x-application-id": "hug_institucional",
              },
              body: JSON.stringify({
                companyId: "1017",
                applicationId: "hug_institucional",
                incomingText: combinedMessage,
                systemPrompt: HUG_INSTITUCIONAL_SYSTEM_PROMPT,
                conversationId: convId,
                history,
                images,
                modelAlias: modelTarget,
              }),
              signal: controller.signal,
            });
            clearTimeout(timeoutId);

            if (coreResp.ok) {
              const coreData = await coreResp.json();
              if (coreData.success && (coreData.texto || coreData.text)) {
                return Response.json({
                  ok: true,
                  reply: (coreData.texto || coreData.text).trim(),
                  transcription: audioTranscription || undefined,
                  modelUsed: coreData.modelo || modelTarget,
                  requestId: coreData.requestId,
                  conversationId: coreData.conversaId || convId,
                  viaGateway: true,
                });
              }
            }
          } catch {
            // Continua para o módulo in-process oficial do HUG IA Core
          }

          // 3. IN-PROCESS HUG IA CORE GATEWAY
          try {
            const coreModuleUrl = "file:///D:/Desenvolvimento/Projetos/hug-ia-core/dist/index.js";
            const { processarRequisicaoGateway }: any = await import(/* @vite-ignore */ coreModuleUrl);

            const coreResult = await processarRequisicaoGateway(
              {
                companyId: "1017",
                applicationId: "hug_institucional",
                incomingText: combinedMessage,
                systemPrompt: HUG_INSTITUCIONAL_SYSTEM_PROMPT,
                conversationId: convId,
                history,
                images,
                modelAlias: modelTarget,
                context: {
                  canal: "web_institucional",
                  portal: "landing_page",
                },
              },
              {
                "x-hug-core-key": "hug_core_internal_sec_2026",
                authorization: "Bearer hug-internal-hub-token-2026",
              }
            );

            if (coreResult && coreResult.success && coreResult.texto) {
              return Response.json({
                ok: true,
                reply: coreResult.texto.trim(),
                transcription: audioTranscription || undefined,
                modelUsed: coreResult.modelo || modelTarget,
                requestId: coreResult.requestId,
                conversationId: coreResult.conversaId || convId,
                viaGateway: true,
              });
            }
          } catch {
            // Continua para a conexão direta com o modelo central aprovado
          }

          // 4. CONEXÃO CONTINGENCIAL DIRETA COM O MODELO CENTRAL (COM SUPORTE TOTAL A VISÃO E FERRAMENTAS)
          if (openAiKey) {
            // gpt-4o possui suporte pleno e nativo a ferramentas (tool_calls) e visão
            const visionOrChatModel = "gpt-4o";

            // Monta payload de mensagens para chat/vision completions
            const userContentParts: Array<
              | { type: "text"; text: string }
              | { type: "image_url"; image_url: { url: string; detail?: string } }
            > = [{ type: "text", text: combinedMessage }];

            for (const img of images) {
              const url = img.dataUrl.startsWith("data:")
                ? img.dataUrl
                : `data:${img.type || "image/jpeg"};base64,${img.dataUrl}`;
              userContentParts.push({
                type: "image_url",
                image_url: { url, detail: "auto" },
              });
            }

            const apiMessages: Array<{
              role: "system" | "user" | "assistant";
              content: any;
            }> = [
              { role: "system", content: HUG_INSTITUCIONAL_SYSTEM_PROMPT },
              ...history.slice(-40).map((item) => ({
                role: item.role as "user" | "assistant",
                content: item.content,
              })),
              {
                role: "user",
                content: images.length > 0 ? userContentParts : combinedMessage,
              },
            ];

            const tools = [
              {
                type: "function",
                function: {
                  name: "buscar_arquivos",
                  description: "Busca pastas ou arquivos no computador do usuário pelo nome da pasta ou projeto principal (ex: se o usuário pedir 'pasta de imagens da Loca Tudo Ferramentas', use o termo 'Loca Tudo' ou 'Loca Tudo Ferramentas', nunca termos genéricos como 'imagens' ou 'pastas').",
                  parameters: {
                    type: "object",
                    properties: {
                      termo: { type: "string", description: "Nome específico da pasta ou arquivo (ex: 'Loca Tudo')" },
                    },
                    required: ["termo"],
                  },
                },
              },
              {
                type: "function",
                function: {
                  name: "abrir_pasta_explorer",
                  description: "Abre uma pasta ou arquivo diretamente no Windows Explorer ou no aplicativo padrão do Windows na tela do usuário. Aceita tanto o caminho completo quanto o nome simples da pasta/arquivo (ex: 'HUG', 'Loca Tudo', 'relatorio.pdf').",
                  parameters: {
                    type: "object",
                    properties: {
                      caminho: { type: "string", description: "Nome da pasta/arquivo ou caminho a abrir" },
                    },
                    required: ["caminho"],
                  },
                },
              },
              {
                type: "function",
                function: {
                  name: "criar_pasta",
                  description: "Cria uma nova pasta no computador do usuário no local solicitado (ex: na Área de Trabalho ou no Disco D). NUNCA afirme que criou uma pasta sem antes chamar esta função.",
                  parameters: {
                    type: "object",
                    properties: {
                      caminho: { type: "string", description: "Nome ou caminho da pasta a criar (ex: 'HIG na Área de Trabalho' ou 'D:\\Desenvolvimento\\Projetos\\NovaPasta')" },
                    },
                    required: ["caminho"],
                  },
                },
              },
              {
                type: "function",
                function: {
                  name: "listar_diretorio",
                  description: "Lista o conteúdo de uma pasta no computador.",
                  parameters: {
                    type: "object",
                    properties: {
                      caminho: { type: "string", description: "Caminho da pasta a listar" },
                    },
                    required: ["caminho"],
                  },
                },
              },
              {
                type: "function",
                function: {
                  name: "mover_arquivo",
                  description: "Move ou transfere um arquivo ou pasta de um local para outro no computador do usuário (ex: mover arquivo para o Disco D:).",
                  parameters: {
                    type: "object",
                    properties: {
                      origem: { type: "string", description: "Caminho ou nome do arquivo/pasta de origem" },
                      destino: { type: "string", description: "Caminho da pasta ou arquivo de destino" },
                    },
                    required: ["origem", "destino"],
                  },
                },
              },
            ];

            const payloadBody: any = {
              model: visionOrChatModel,
              messages: apiMessages,
              tools,
            };

            // Modelos de raciocínio como gpt-6.2-astra, o1 e o3 não aceitam temperature customizada
            const isReasoning =
              visionOrChatModel.includes("astra") ||
              visionOrChatModel.startsWith("o1") ||
              visionOrChatModel.startsWith("o3");

            if (!isReasoning) {
              payloadBody.temperature = 0.5;
            }

            let openAiResp = await fetch("https://api.openai.com/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${openAiKey}`,
              },
              body: JSON.stringify(payloadBody),
            });

            // Se o modelo especificado falhar (ex: não suportado ou erro de parâmetro), fallback transparente para gpt-4o
            if (!openAiResp.ok && visionOrChatModel !== "gpt-4o") {
              const errBody = await openAiResp.text();
              console.warn(`[OpenAI Direct: modelo ${visionOrChatModel} falhou, tentando gpt-4o]:`, errBody);
              payloadBody.model = "gpt-4o";
              payloadBody.temperature = 0.5;
              openAiResp = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${openAiKey}`,
                },
                body: JSON.stringify(payloadBody),
              });
            }

            if (openAiResp.ok) {
              let openAiJson = await openAiResp.json();
              let messageObj = openAiJson.choices?.[0]?.message;
              console.log("[AI Response Message]:", JSON.stringify(messageObj));

              // Execução real de ferramentas chamadas pela IA
              if (messageObj?.tool_calls && messageObj.tool_calls.length > 0) {
                apiMessages.push(messageObj);

                for (const toolCall of messageObj.tool_calls) {
                  const fnName = toolCall.function?.name;
                  let args: any = {};
                  try {
                    args = JSON.parse(toolCall.function?.arguments || "{}");
                  } catch {}

                  let toolResult = "";
                  if (fnName === "buscar_arquivos") {
                    const res = await DesktopFSTools.buscarArquivos(args.termo);
                    // Se a mensagem do usuário indica intenção de abrir ("abra", "abrir", "mostrar"), abre no Explorer imediatamente
                    if (res.sucesso && Array.isArray(res.dados) && res.dados.length > 0 && /(?:abra|abrir|open|mostr(?:e|ar))/i.test(combinedMessage)) {
                      const primeiroDir = res.dados.find((d: any) => d.eDiretorio) || res.dados[0];
                      if (primeiroDir && primeiroDir.caminhoCompleto) {
                        const openRes = await DesktopFSTools.abrirNoExplorer(primeiroDir.caminhoCompleto);
                        (res as any).abertoNoWindowsExplorer = openRes.sucesso;
                        (res as any).pastaAberta = primeiroDir.caminhoCompleto;
                      }
                    }
                    toolResult = JSON.stringify(res);
                  } else if (fnName === "abrir_pasta_explorer") {
                    const res = await DesktopFSTools.abrirNoExplorer(args.caminho);
                    toolResult = JSON.stringify(res);
                  } else if (fnName === "criar_pasta") {
                    const res = await DesktopFSTools.criarPasta(args.caminho);
                    toolResult = JSON.stringify(res);
                  } else if (fnName === "listar_diretorio") {
                    const res = await DesktopFSTools.listarDiretorio(args.caminho);
                    toolResult = JSON.stringify(res);
                  } else if (fnName === "mover_arquivo") {
                    const res = await DesktopFSTools.moverArquivo(args.origem, args.destino);
                    toolResult = JSON.stringify(res);
                  }

                  apiMessages.push({
                    role: "tool",
                    tool_call_id: toolCall.id,
                    content: toolResult,
                  } as any);
                }

                // Chamada de retorno para o modelo formular a resposta final
                const followUpResp = await fetch("https://api.openai.com/v1/chat/completions", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${openAiKey}`,
                  },
                  body: JSON.stringify({
                    model: "gpt-4o",
                    messages: apiMessages,
                    temperature: 0.5,
                  }),
                });

                if (followUpResp.ok) {
                  const followUpJson = await followUpResp.json();
                  messageObj = followUpJson.choices?.[0]?.message;
                }
              } else {
                // Se a IA não executou tool_calls, mas a mensagem do usuário ou o texto retornado indicam ordem/promessa de abrir
                const querAbrir = /(?:abra|abrir|open|mostr(?:e|ar))\s+(?:a\s+)?(?:pasta|arquivo|diret[oó]rio)?/i.test(combinedMessage);
                const prometeuAbrir = /vou\s+abri[-a-z]*|abrir[-a-z]*\s+para\s+voc[êe]|vou\s+localizar\s+e\s+abrir/i.test(messageObj?.content || "");

                if (querAbrir || prometeuAbrir) {
                  let termoAlvo = "";
                  // Extrai o nome da pasta da mensagem do usuário
                  const mUser = combinedMessage.match(/(?:abra|abrir|open|mostr(?:e|ar))\s+(?:a\s+)?(?:pasta|arquivo|diret[oó]rio)?\s*["']?([^"'\n\r\?\!]+)["']?/i);
                  if (mUser && mUser[1]) {
                    termoAlvo = mUser[1].trim()
                      .replace(/^(?:a\s+que\s+est[áa]\s+na\s+home|a\s+que\s+est[áa]\s+no\s+desktop|a\s+pasta\s+)/i, "")
                      .replace(/\s+(?:na\s+home|no\s+desktop|na\s+[áa]rea\s+de\s+trabalho).*$/i, "")
                      .trim();
                  }
                  // Extrai da promessa da IA se houver
                  if (!termoAlvo && prometeuAbrir) {
                    const mPromessa = (messageObj?.content || "").match(/pasta\s+["']?([a-zA-Z0-9_\-]+)["']?/i);
                    if (mPromessa && mPromessa[1]) {
                      termoAlvo = mPromessa[1].trim();
                    }
                  }
                  // Se ainda não achou, busca no histórico recente
                  if (!termoAlvo || termoAlvo.length < 2) {
                    for (let i = history.length - 1; i >= 0; i--) {
                      const hMatch = history[i].content.match(/["']([a-zA-Z0-9_\-]+)["']/);
                      if (hMatch && hMatch[1]) {
                        termoAlvo = hMatch[1];
                        break;
                      }
                    }
                  }

                  if (termoAlvo) {
                    const openExec = await DesktopFSTools.abrirNoExplorer(termoAlvo);
                    if (openExec.sucesso) {
                      return Response.json({
                        ok: true,
                        reply: openExec.mensagem,
                        transcription: audioTranscription || undefined,
                        modelUsed: visionOrChatModel,
                        requestId: `comp_${Date.now().toString(36)}`,
                        conversationId: convId,
                        viaGateway: false,
                      });
                    }
                  }
                }
              }

              const replyText = messageObj?.content?.trim();

              if (replyText) {
                const outGuard = HugAISecurityShield.inspecionarSaida(replyText, "HUG");
                return Response.json({
                  ok: true,
                  reply: outGuard.textoSeguro,
                  transcription: audioTranscription || undefined,
                  modelUsed: visionOrChatModel,
                  requestId: `comp_${Date.now().toString(36)}`,
                  conversationId: convId,
                  viaGateway: false,
                });
              }
            } else {
              const errBody = await openAiResp.text();
              console.error("[OpenAI Direct Fallback Error]:", errBody);
            }
          }

          return Response.json(
            {
              ok: false,
              error: "Não foi possível obter resposta do motor HUG IA Core no momento.",
            },
            { status: 503 }
          );
        } catch (error: any) {
          console.error("[Public Chat AI Error]:", error);
          return Response.json(
            {
              ok: false,
              error: error?.message || "Erro no processamento da mensagem pelo HUG IA Core.",
            },
            { status: 500 }
          );
        }
      },
    },
  },
});
