import { describe, it, expect, afterAll } from "vitest";
import { DesktopFSTools } from "../src/lib/multiplex/desktop-fs-tools";
import fs from "node:fs";
import path from "node:path";

describe("HUG Desktop Agent - Ferramentas de Sistema de Arquivos (Windows)", () => {
  const pastaTeste = path.join("D:\\Desenvolvimento", "teste_hug_desktop_temp");
  const subpastaTeste = path.join(pastaTeste, "subpasta");
  const arquivoOrigem = path.join(pastaTeste, "documento_teste.txt");
  const arquivoDestino = path.join(subpastaTeste, "documento_movido.txt");

  afterAll(() => {
    try {
      if (fs.existsSync(pastaTeste)) {
        fs.rmSync(pastaTeste, { recursive: true, force: true });
      }
    } catch {}
  });

  it("deve criar uma nova pasta no disco", async () => {
    const res = await DesktopFSTools.criarPasta(pastaTeste);
    expect(res.sucesso).toBe(true);
    expect(fs.existsSync(pastaTeste)).toBe(true);
  });

  it("deve criar e ler um arquivo de teste", async () => {
    fs.writeFileSync(arquivoOrigem, "Conteúdo de teste HUG Desktop Agent 2026", "utf-8");
    const res = await DesktopFSTools.lerArquivo(arquivoOrigem);
    expect(res.sucesso).toBe(true);
    expect(res.dados.conteudo).toContain("HUG Desktop Agent 2026");
  });

  it("deve listar os arquivos da pasta", async () => {
    const res = await DesktopFSTools.listarDiretorio(pastaTeste);
    expect(res.sucesso).toBe(true);
    expect(res.dados.itens.some((i: any) => i.nome === "documento_teste.txt")).toBe(true);
  });

  it("deve mover o arquivo para uma nova subpasta", async () => {
    await DesktopFSTools.criarPasta(subpastaTeste);
    const res = await DesktopFSTools.moverArquivo(arquivoOrigem, arquivoDestino);
    expect(res.sucesso).toBe(true);
    expect(fs.existsSync(arquivoDestino)).toBe(true);
    expect(fs.existsSync(arquivoOrigem)).toBe(false);
  });

  it("deve buscar e encontrar o arquivo movido", async () => {
    const res = await DesktopFSTools.buscarArquivos("documento_movido", pastaTeste);
    expect(res.sucesso).toBe(true);
    expect(res.dados.length).toBeGreaterThan(0);
    expect(res.dados[0].nome).toBe("documento_movido.txt");
  });

  it("deve reconhecer comandos em linguagem natural de criação e busca", async () => {
    const cmd = await DesktopFSTools.processarComandoInteligente("Criar pasta teste_nova_pasta");
    expect(cmd).not.toBeNull();
    expect(cmd?.acao).toBe("criar_pasta");
    expect(cmd?.sucesso).toBe(true);

    // Limpa a pasta criada pelo comando
    try {
      const pastaCriada = path.join("D:\\Desenvolvimento", "teste_nova_pasta");
      if (fs.existsSync(pastaCriada)) {
        fs.rmSync(pastaCriada, { recursive: true, force: true });
      }
    } catch {}
  });
});
