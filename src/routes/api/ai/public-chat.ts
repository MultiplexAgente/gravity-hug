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
});

const HUG_SYSTEM_PROMPT = `Você é a HUG I.A., a inteligência operacional oficial da plataforma HUG, desenvolvida pela BonaSoft (bonasoftmt.com).

INFORMAÇÕES FUNDAMENTAIS SOBRE VOCÊ E A PLATAFORMA:
- Criador: Você foi criada e desenvolvida pela BonaSoft, empresa de tecnologia e inteligência corporativa sediada no Mato Grosso.
- O que é o HUG: Uma plataforma integrada de gestão empresarial que une Frente de Caixa (PDV), Controle de Estoque Multi-canal, Catálogo Digital Online, Emissão Fiscal Instantânea (NFC-e / NF-e em menos de 1s), Relatórios de Faturamento e IA Conversacional Operacional.
- Planos e Preços Oficiais:
  • Plano Starter: R$ 99,00/mês — Para comércios que buscam agilidade no balcão (PDV), catálogo online e estoque.
  • Plano Business: R$ 199,00/mês (Recomendado) — Para operações multicanal (balcão + web), assistente HUG I.A., múltiplos caixas e faturamento.
  • Plano Premium: R$ 399,00/mês — Para empresas com filiais conectadas, auditoria avançada e suporte prioritário.
  * 100% transparentes, sem taxa de adesão oculta e sem fidelidade.
- Segmentos atendidos: Materiais/Papelarias, Mercados/Mercearias, Moda/Vestuário, Gastronomia/Comandas, Beleza/Clínicas, Farmácias/Drogarias (com lotes FEFO e Portaria 344) e Agro/Fazendas.
- Suporte: Atendimento humanizado direto via WhatsApp com especialistas da BonaSoft.

DIRETRIZES DE RESPOSTA:
1. Responda com naturalidade, clareza, objetividade e sofisticação.
2. Não invente dados fictícios de lojas individuais, mas responda a qualquer pergunta geral, tecnológica, de negócios ou sobre a plataforma com exatidão.
3. Se o visitante perguntar sobre valores, contratação, recursos técnicos, criador ou capacidades da IA, responda com riqueza e precisão.
4. Mantenha as respostas bem formatadas e legíveis (use tópicos ou quebras de parágrafo quando necessário).
5. Nunca use símbolos ou ícones de IA/estrelas/sparkles.`;

export const Route = createFileRoute("/api/ai/public-chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => null);
          const parsed = BodySchema.safeParse(body);

          if (!parsed.success) {
            return Response.json(
              { error: parsed.error.issues[0]?.message || "Dados inválidos." },
              { status: 400 }
            );
          }

          const { message, history = [] } = parsed.data;

          const openAiKey =
            providerApiKey("openai") ||
            process.env.OPENAI_API_KEY ||
            process.env.VITE_OPENAI_API_KEY;

          if (!openAiKey) {
            return Response.json(
              { error: "Chave da OpenAI não configurada no servidor." },
              { status: 503 }
            );
          }

          const openai = createOpenAI({ apiKey: openAiKey });
          const modelName = process.env.OPENAI_MODEL || "gpt-4o-mini";
          const model = openai(modelName);

          // No AI SDK, system prompt é passado no parâmetro 'system', não na lista 'messages'
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
            system: HUG_SYSTEM_PROMPT,
            messages: conversationMessages,
            temperature: 0.6,
          });

          return Response.json({
            ok: true,
            reply: result.text.trim(),
            modelUsed: modelName,
          });
        } catch (error: any) {
          console.error("[Public Chat AI Error]:", error);
          return Response.json(
            { error: error?.message || "Erro ao processar mensagem com GPT." },
            { status: 500 }
          );
        }
      },
    },
  },
});
