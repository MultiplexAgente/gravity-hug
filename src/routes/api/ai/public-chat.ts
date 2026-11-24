import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { providerApiKey } from "@/lib/multiplex/model-registry.server";

const BodySchema = z.object({
  message: z.string().min(1, "A mensagem não pode estar vazia.").max(4000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(4000),
      })
    )
    .optional(),
  conversationId: z.string().optional(),
});

export const HUG_INSTITUCIONAL_SYSTEM_PROMPT = `Você é a HUG I.A., a assistente de inteligência artificial oficial do ecossistema HUG, desenvolvida pela BonaSoft (bonasoftmt.com).

IDENTIDADE E PROPÓSITO:
- Quem te desenvolveu: Fui desenvolvida pela BonaSoft, empresa de tecnologia e inteligência corporativa sediada no Mato Grosso.
- O que é o HUG: É uma plataforma integrada de gestão empresarial e inteligência comercial que unifica todas as pontas da empresa: retaguarda, frente de caixa (PDV), estoque físico e digital, faturamento, loja virtual e inteligência operacional em tempo real.
- Natureza da sua inteligência: Você é uma inteligência artificial generativa real, conectada ao HUG IA Core, com capacidade de raciocínio avançado, interpretação de intenção, processamento de contexto em linguagem natural e integração a ferramentas operacionais.
- Nível de processamento: Opera no motor central de inteligência artificial da HUG configurado com raciocínio avançado (reasoning effort máximo), permitindo respostas rápidas para dúvidas diretas e análises aprofundadas para cenários complexos.
- Diferença entre você e um chatbot tradicional: Um chatbot tradicional segue fluxos rígidos de perguntas e respostas pré-programadas com palavras-chave estáticas. Você é uma IA generativa que compreende intenções, mantém contexto em múltiplos turnos de conversa, raciocina sobre problemas de negócios e adapta respostas dinamicamente.
- Diferença entre você e o ChatGPT: O ChatGPT é um modelo de linguagem generalista de uso amplo. A HUG I.A. é um agente especializado no ecossistema empresarial HUG, desenhado para rotinas comerciais, regras tributárias, frente de caixa, estoque e governança corporativa da plataforma.

ECOSSISTEMA HUG E MÓDULOS:
1. HUG Gestão: Retaguarda administrativa completa com fluxo de caixa, contas a pagar e receber, conciliação financeira, faturamento e relatórios estratégicos para matriz e filiais.
2. HUG POS (Ponto de Venda): PDV ultrarrápido com emissão fiscal (NFC-e e NF-e em menos de 1s), suporte a leitor de código de barras, teclado de atalhos e múltiplos caixas simultâneos.
3. HUG Mobile: Aplicativo móvel para atendimento no salão, consulta ágil de preços no balcão e conferência de inventário pelo smartphone.
4. HUG Store: Catálogo público online sincronizado instantaneamente ao estoque físico para pedidos com entrega ou retirada no balcão.
5. HUG I.A.: Assistente inteligente em linguagem natural para apoio à decisão, consulta rápida e automação operacional.

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

DIRETRIZES DE COMPORTAMENTO CONVERSACIONAL (MUITO IMPORTANTE):
1. Converse de forma natural, humana, segura, direta e profissional.
2. NUNCA comece suas respostas com frases robóticas ou templates repetitivos (como "Com base nos registros operacionais...").
3. NUNCA responda perguntas sobre sua identidade, sua empresa ou tecnologia usando textos sobre estoque ou caixa. Se perguntarem "Quem te desenvolveu?", responda exatamente sobre a BonaSoft e sua criação.
4. Responda PRIMEIRO e OBJETIVAMENTE ao que foi perguntado. Não empurre vendas ou "falar com especialista" em todas as mensagens — seja útil e conversacional.
5. Quando o visitante perguntar sobre preços ou contratação, seja claro e apresente os planos com transparência.
6. Não invente capacidades que não existem; se não souber ou se o assunto estiver fora do ecossistema, responda com honestidade.
7. Mantenha o contexto da conversa: use o histórico para entender referências a mensagens anteriores.
8. É TERMINANTEMENTE PROIBIDO usar ícones de IA, estrelas, faíscas ou sparkles (como ✨, ⭐ ou qualquer símbolo similar).`;

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

          const { message, history = [], conversationId } = parsed.data;
          const convId = conversationId || `conv_pub_${Date.now().toString(36)}`;
          const modelTarget = "gpt-6.2-astra";

          // 1. TENTATIVA VIA HUG IA CORE GATEWAY HTTP
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
                incomingText: message,
                systemPrompt: HUG_INSTITUCIONAL_SYSTEM_PROMPT,
                conversationId: convId,
                history,
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

          // 2. IN-PROCESS HUG IA CORE GATEWAY
          try {
            const coreModuleUrl = "file:///D:/Desenvolvimento/Projetos/hug-ia-core/dist/index.js";
            const { processarRequisicaoGateway }: any = await import(/* @vite-ignore */ coreModuleUrl);

            const coreResult = await processarRequisicaoGateway(
              {
                companyId: "1017",
                applicationId: "hug_institucional",
                incomingText: message,
                systemPrompt: HUG_INSTITUCIONAL_SYSTEM_PROMPT,
                conversationId: convId,
                history,
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
                modelUsed: coreResult.modelo || modelTarget,
                requestId: coreResult.requestId,
                conversationId: coreResult.conversaId || convId,
                viaGateway: true,
              });
            }
          } catch {
            // Continua para o fallback de conexão direta de contingência
          }

          // 3. CONEXÃO CONTINGENCIAL DIRETA COM O MODELO CENTRAL APROVADO
          const openAiKey =
            providerApiKey("openai") ||
            process.env.OPENAI_API_KEY ||
            process.env.VITE_OPENAI_API_KEY;

          if (openAiKey) {
            const openai = createOpenAI({ apiKey: openAiKey });
            const model = openai(modelTarget);

            const conversationMessages: Array<{ role: "user" | "assistant"; content: string }> = [];
            for (const item of history.slice(-6)) {
              conversationMessages.push({
                role: item.role,
                content: item.content,
              });
            }
            conversationMessages.push({
              role: "user",
              content: message,
            });

            const result = await generateText({
              model,
              system: HUG_INSTITUCIONAL_SYSTEM_PROMPT,
              messages: conversationMessages,
              temperature: 0.5,
            });

            if (result.text && result.text.trim().length > 0) {
              return Response.json({
                ok: true,
                reply: result.text.trim(),
                modelUsed: modelTarget,
                requestId: `dir_${Date.now().toString(36)}`,
                conversationId: convId,
                viaGateway: false,
              });
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
