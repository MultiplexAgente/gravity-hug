import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { DesktopFSTools } from "@/lib/multiplex/desktop-fs-tools";

const BodySchema = z.object({
  action: z.enum(["buscar", "criar_pasta", "mover", "listar", "ler", "comando_natural"]),
  termo: z.string().optional(),
  caminho: z.string().optional(),
  origem: z.string().optional(),
  destino: z.string().optional(),
  comandoNatural: z.string().optional(),
  limite: z.number().optional().default(20),
});

export const Route = createFileRoute("/api/desktop/fs")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => null);
          const parsed = BodySchema.safeParse(body);

          if (!parsed.success) {
            return Response.json(
              { sucesso: false, erro: "Parâmetros inválidos.", details: parsed.error.issues },
              { status: 400 }
            );
          }

          const { action, termo, caminho, origem, destino, comandoNatural, limite } = parsed.data;

          if (action === "buscar") {
            if (!termo) {
              return Response.json({ sucesso: false, erro: "Termo de busca obrigatório." }, { status: 400 });
            }
            const res = await DesktopFSTools.buscarArquivos(termo, caminho, limite);
            return Response.json(res);
          }

          if (action === "criar_pasta") {
            if (!caminho) {
              return Response.json({ sucesso: false, erro: "Caminho da pasta obrigatório." }, { status: 400 });
            }
            const res = await DesktopFSTools.criarPasta(caminho);
            return Response.json(res);
          }

          if (action === "mover") {
            if (!origem || !destino) {
              return Response.json({ sucesso: false, erro: "Origem e destino são obrigatórios." }, { status: 400 });
            }
            const res = await DesktopFSTools.moverArquivo(origem, destino);
            return Response.json(res);
          }

          if (action === "listar") {
            if (!caminho) {
              return Response.json({ sucesso: false, erro: "Caminho do diretório obrigatório." }, { status: 400 });
            }
            const res = await DesktopFSTools.listarDiretorio(caminho);
            return Response.json(res);
          }

          if (action === "ler") {
            if (!caminho) {
              return Response.json({ sucesso: false, erro: "Caminho do arquivo obrigatório." }, { status: 400 });
            }
            const res = await DesktopFSTools.lerArquivo(caminho, limite || 200);
            return Response.json(res);
          }

          if (action === "comando_natural") {
            if (!comandoNatural) {
              return Response.json({ sucesso: false, erro: "Comando em linguagem natural obrigatório." }, { status: 400 });
            }
            const res = await DesktopFSTools.processarComandoInteligente(comandoNatural);
            if (!res) {
              return Response.json({
                sucesso: false,
                mensagem: "Nenhum comando de sistema de arquivos reconhecido na mensagem.",
              });
            }
            return Response.json(res);
          }

          return Response.json({ sucesso: false, erro: "Ação não suportada." }, { status: 400 });
        } catch (err: any) {
          return Response.json(
            { sucesso: false, erro: err?.message || "Erro interno ao executar ferramenta de arquivos." },
            { status: 500 }
          );
        }
      },
    },
  },
});
