import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { providerApiKey } from "@/lib/multiplex/model-registry.server";

const BodySchema = z.object({
  message: z.string().max(4000).optional().default(""),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(4000),
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
- Starter: R$ 99,00/mês — Para comércios que buscam agilidade no balcão (PDV ágil, catálogo online integrado, controle de estoque e vendas, gestão de clientes).
- Business: R$ 199,00/mês (Recomendado) — Para operações em crescimento (todos os recursos do Starter + multicanal balcão/web, assistente HUG I.A., múltiplos caixas e relatórios detalhados).
- Premium: R$ 399,00/mês — Para operações corporativas e redes (todos os recursos do Business + múltiplas filiais conectadas, acesso prioritário ao HUG I.A., auditoria avançada e suporte prioritário).

PROCESSAMENTO MULTIMODAL:
- Quando o usuário enviar imagens: analise detalhadamente o conteúdo visual (leia textos, etiquetas, valores de notas fiscais, identifique produtos, marcas, embalagens ou itens) e relacione com os processos do ecossistema HUG ou com a dúvida feita pelo usuário.
- Quando o usuário enviar áudio: o sistema transcreve o áudio para você; responda diretamente ao que foi falado de maneira natural.

DIRETRIZES DE COMPORTAMENTO CONVERSACIONAL (MUITO IMPORTANTE):
1. Converse de forma natural, humana, segura, direta e profissional.
2. NUNCA comece suas respostas com frases robóticas ou templates repetitivos (como "Com base nos registros operacionais...").
3. NUNCA responda perguntas sobre sua identidade, sua empresa ou tecnologia usando textos sobre estoque ou caixa. Se perguntarem "Quem te desenvolveu?", responda exatamente sobre a BonaSoft e sua criação.
4. Responda PRIMEIRO e OBJETIVAMENTE ao que foi perguntado. Não empurre vendas ou "falar com especialista" em todas as mensagens — seja útil e conversacional.
5. Quando o visitante perguntar sobre preços ou contratação, seja claro e apresente os planos com transparência.
6. Não invente capacidades que não existem; se não souber ou se o assunto estiver fora do ecossistema, responda com honestidade.
7. Mantenha o contexto da conversa: use o histórico para entender referências a mensagens anteriores.
8. É TERMINANTEMENTE PROIBIDO usar ícones de IA, estrelas, faíscas ou sparkles (como ✨, ⭐ ou qualquer símbolo similar).`;

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

          // 4. CONEXÃO CONTINGENCIAL DIRETA COM O MODELO CENTRAL (COM SUPORTE TOTAL A VISÃO)
          if (openAiKey) {
            // Se houver imagens, utilizamos modelo com suporte a visão garantido (gpt-4o)
            const visionOrChatModel = images.length > 0 ? "gpt-4o" : (process.env.OPENAI_MODEL || "gpt-4o");

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
              ...history.slice(-8).map((item) => ({
                role: item.role as "user" | "assistant",
                content: item.content,
              })),
              {
                role: "user",
                content: images.length > 0 ? userContentParts : combinedMessage,
              },
            ];

            const payloadBody: any = {
              model: visionOrChatModel,
              messages: apiMessages,
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
              const openAiJson = await openAiResp.json();
              const replyText = openAiJson.choices?.[0]?.message?.content?.trim();

              if (replyText) {
                return Response.json({
                  ok: true,
                  reply: replyText,
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
