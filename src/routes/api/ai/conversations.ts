import { createFileRoute } from "@tanstack/react-router";
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

const CONVERSAS_DIR = path.join(process.cwd(), "data", "conversas");

function obterCaminhoUsuario(email: string): string {
  const safeEmail = (email || "default").trim().toLowerCase().replace(/[^a-z0-9_@.-]/gi, "_");
  if (!fs.existsSync(CONVERSAS_DIR)) {
    fs.mkdirSync(CONVERSAS_DIR, { recursive: true });
  }
  return path.join(CONVERSAS_DIR, `${safeEmail}.json`);
}

function lerConversas(email: string): any[] {
  try {
    const file = obterCaminhoUsuario(email);
    if (!fs.existsSync(file)) return [];
    const content = fs.readFileSync(file, "utf-8");
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((c: any) => {
      let title = c.title;
      if (Array.isArray(c.messages) && c.messages.length > 0) {
        const msgsOrd = [...c.messages].sort(
          (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        const firstUser = msgsOrd.find((m: any) => m.role === "user" && m.content && m.content.trim().length > 0);
        if (firstUser && firstUser.content) {
          const palavras = firstUser.content.trim().replace(/^["']|["']$/g, "").replace(/[\r\n]+/g, " ").split(/\s+/).filter(Boolean);
          title = palavras.length <= 5 ? palavras.join(" ") : palavras.slice(0, 5).join(" ") + "...";
        }
      }
      return {
        ...c,
        title: title || "Nova conversa",
      };
    });
  } catch {
    return [];
  }
}

function salvarConversas(email: string, conversas: any[]): void {
  try {
    const file = obterCaminhoUsuario(email);
    // Remove base64 gigantes de dataUrl e garante título baseado na 1ª mensagem do usuário
    const sanitizadas = conversas.map((c) => {
      let title = c.title || "Nova conversa";
      if (Array.isArray(c.messages) && c.messages.length > 0) {
        const msgsOrd = [...c.messages].sort(
          (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        const firstUser = msgsOrd.find((m: any) => m.role === "user" && m.content && m.content.trim().length > 0);
        if (firstUser && firstUser.content) {
          const palavras = firstUser.content.trim().replace(/^["']|["']$/g, "").replace(/[\r\n]+/g, " ").split(/\s+/).filter(Boolean);
          title = palavras.length <= 5 ? palavras.join(" ") : palavras.slice(0, 5).join(" ") + "...";
        }
      }
      return {
        ...c,
        title,
        messages: (c.messages || []).map((m: any) => ({
          ...m,
          attachments: m.attachments?.map((a: any) => ({
            name: a.name,
            type: a.type,
            dataUrl: (a.dataUrl && a.dataUrl.length < 50000) ? a.dataUrl : undefined,
          })),
        })),
      };
    });
    fs.writeFileSync(file, JSON.stringify(sanitizadas, null, 2), "utf-8");
  } catch (err) {
    console.error("[Conversations API: Erro ao salvar no disco]", err);
  }
}

const PostSchema = z.object({
  userEmail: z.string().default("default"),
  conversation: z.object({
    id: z.string(),
    agentId: z.string(),
    title: z.string(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    messages: z.array(z.any()),
    pinned: z.boolean().optional(),
  }),
});

export const Route = createFileRoute("/api/ai/conversations")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const email = url.searchParams.get("userEmail") || "default";
        const conversas = lerConversas(email);
        return Response.json({ success: true, conversations: conversas });
      },

      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => null);
          const parsed = PostSchema.safeParse(body);
          if (!parsed.success) {
            return Response.json({ success: false, error: "Payload inválido" }, { status: 400 });
          }

          const { userEmail, conversation } = parsed.data;
          const lista = lerConversas(userEmail);
          const idx = lista.findIndex((c) => c.id === conversation.id);

          const atualizada = {
            ...conversation,
            updatedAt: new Date().toISOString(),
          };

          if (idx >= 0) {
            lista[idx] = atualizada;
          } else {
            lista.unshift(atualizada);
          }

          salvarConversas(userEmail, lista);
          return Response.json({ success: true, conversations: lista });
        } catch (err: any) {
          return Response.json({ success: false, error: err?.message }, { status: 500 });
        }
      },

      DELETE: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const email = url.searchParams.get("userEmail") || "default";
          const id = url.searchParams.get("id");

          if (!id) {
            return Response.json({ success: false, error: "ID obrigatório" }, { status: 400 });
          }

          const lista = lerConversas(email);
          const filtrada = lista.filter((c) => c.id !== id);
          salvarConversas(email, filtrada);

          return Response.json({ success: true, conversations: filtrada });
        } catch (err: any) {
          return Response.json({ success: false, error: err?.message }, { status: 500 });
        }
      },
    },
  },
});
