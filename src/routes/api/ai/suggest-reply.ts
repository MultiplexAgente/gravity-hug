import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { generateCustomerSuggestedReply } from "@/lib/multiplex/ai-gateway.server";
import { requireCompanySession } from "@/lib/multiplex/company-auth.server";
import { getServiceClient } from "@/lib/multiplex/supabase.server";

const BodySchema = z.object({
  question: z.string().min(3, "A dúvida do cliente deve ter pelo menos 3 caracteres.").max(3000),
  context: z.string().max(4000).optional(),
  tone: z.enum(["cordial", "comercial", "direto", "tecnico"]).optional().default("cordial"),
  segment: z.string().max(100).optional(),
});

export const Route = createFileRoute("/api/ai/suggest-reply")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json().catch(() => null);
        const parsed = BodySchema.safeParse(body);

        if (!parsed.success) {
          return Response.json(
            { error: parsed.error.issues[0]?.message || "Dados inválidos." },
            { status: 400 }
          );
        }

        const supabase = getServiceClient();
        if (!supabase) {
          return Response.json({ error: "Banco de dados não configurado." }, { status: 503 });
        }
        const session = await requireCompanySession(supabase, request);
        if ("error" in session) {
          return Response.json({ error: session.error }, { status: session.status });
        }
        const companyName = session.companyName;

        const result = await generateCustomerSuggestedReply({
          question: parsed.data.question,
          context: parsed.data.context,
          tone: parsed.data.tone,
          companyName,
          segment: parsed.data.segment,
        });

        if (!result.ok) {
          return Response.json({ error: result.error || "Erro ao gerar resposta." }, { status: 500 });
        }

        return Response.json({
          ok: true,
          reply: result.reply,
          modelUsed: result.modelUsed,
          viaGateway: result.viaGateway,
        });
      },
    },
  },
});
