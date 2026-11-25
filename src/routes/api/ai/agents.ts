import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { getOptionalCompanySession } from "@/lib/multiplex/company-auth.server";
import { getServiceClient } from "@/lib/multiplex/supabase.server";

const AgentBodySchema = z.object({
  action: z.enum(["list", "save", "delete", "chat"]),
  agent: z
    .object({
      id: z.string().optional(),
      name: z.string().min(1).max(120),
      description: z.string().max(500).optional().nullable(),
      system_prompt: z.string().max(8000).optional().nullable(),
      model: z.string().optional().default("hug-fast"),
      temperature: z.number().min(0).max(1).optional().default(0.7),
      active: z.boolean().optional().default(true),
      auto_reply: z.boolean().optional().default(true),
      human_handoff_enabled: z.boolean().optional().default(true),
    })
    .optional(),
  agentId: z.string().optional(),
  message: z.string().max(8000).optional(),
});

export const Route = createFileRoute("/api/ai/agents")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const supabase = getServiceClient();
        if (!supabase) return Response.json({ error: "Banco de dados não configurado." }, { status: 503 });

        const session = await getOptionalCompanySession(supabase, request);
        const companyId = session?.companyId;

        // Se autenticado com empresa, busca da tabela oficial agents
        if (companyId) {
          const { data, error } = await supabase
            .from("agents")
            .select("*")
            .eq("company_id", companyId)
            .order("created_at", { ascending: false });

          if (error) {
            return Response.json({ error: error.message }, { status: 500 });
          }
          return Response.json({ agents: data ?? [] });
        }

        return Response.json({ agents: [] });
      },

      POST: async ({ request }) => {
        const parsed = AgentBodySchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) {
          return Response.json({ error: "Payload inválido.", details: parsed.error.issues }, { status: 400 });
        }

        const supabase = getServiceClient();
        if (!supabase) return Response.json({ error: "Banco de dados não configurado." }, { status: 503 });

        const session = await getOptionalCompanySession(supabase, request);
        const { action, agent, agentId } = parsed.data;

        // 1. AÇÃO LISTAR
        if (action === "list") {
          if (!session?.companyId) {
            return Response.json({ agents: [] });
          }
          const { data, error } = await supabase
            .from("agents")
            .select("*")
            .eq("company_id", session.companyId)
            .order("created_at", { ascending: false });

          if (error) return Response.json({ error: error.message }, { status: 500 });
          return Response.json({ agents: data ?? [] });
        }

        // 2. AÇÃO SALVAR (CRIAR OU ATUALIZAR)
        if (action === "save" && agent) {
          const companyId = session?.companyId || "00000000-0000-4000-8000-000000000001";
          const payload = {
            company_id: companyId,
            name: agent.name,
            description: agent.description ?? null,
            system_prompt: agent.system_prompt ?? null,
            model: agent.model,
            temperature: agent.temperature,
            active: agent.active,
            auto_reply: agent.auto_reply,
            human_handoff_enabled: agent.human_handoff_enabled,
            updated_at: new Date().toISOString(),
          };

          if (agent.id && !agent.id.startsWith("agent-")) {
            const { data, error } = await supabase
              .from("agents")
              .update(payload)
              .eq("id", agent.id)
              .select()
              .single();
            if (error) return Response.json({ error: error.message }, { status: 500 });
            return Response.json({ agent: data });
          } else {
            const { data, error } = await supabase
              .from("agents")
              .insert({
                ...payload,
                created_at: new Date().toISOString(),
              })
              .select()
              .single();
            if (error) return Response.json({ error: error.message }, { status: 500 });
            return Response.json({ agent: data });
          }
        }

        // 3. AÇÃO EXCLUIR
        if (action === "delete" && agentId) {
          if (!agentId.startsWith("agent-")) {
            await supabase.from("agents").delete().eq("id", agentId);
          }
          return Response.json({ success: true });
        }

        return Response.json({ error: "Ação não suportada." }, { status: 400 });
      },
    },
  },
});
