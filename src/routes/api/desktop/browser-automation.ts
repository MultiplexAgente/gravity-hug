import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { BrowserAutomationTools } from "@/lib/multiplex/browser-automation-tools";

const BodySchema = z.object({
  servico: z.string().optional(),
  url: z.string().optional(),
  email: z.string().optional(),
  senha: z.string().optional(),
  nome: z.string().optional(),
  pararNoPagamento: z.boolean().optional().default(true),
});

export const Route = createFileRoute("/api/desktop/browser-automation")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => ({}));
          const parsed = BodySchema.safeParse(body);

          if (!parsed.success) {
            return Response.json(
              { sucesso: false, erro: "Parâmetros inválidos.", details: parsed.error.issues },
              { status: 400 }
            );
          }

          const resultado = await BrowserAutomationTools.executarCadastroAuto(parsed.data);
          return Response.json(resultado);
        } catch (err: any) {
          return Response.json(
            { sucesso: false, erro: err?.message || "Erro interno ao executar automação de navegador." },
            { status: 500 }
          );
        }
      },
    },
  },
});
