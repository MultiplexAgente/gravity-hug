import { describe, it, expect, beforeEach } from "vitest";
import { HugAgentsService, OFFICIAL_AGENT_TEMPLATES, CustomAgent } from "../src/lib/multiplex/agents-service";

describe("HUG Agents — Inteligência e Gerenciamento de Agentes", () => {
  beforeEach(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
  });

  it("carrega templates oficiais se a lista de agentes estiver vazia", () => {
    const agentes = HugAgentsService.obterAgentes("test-user-123");
    expect(agentes.length).toBeGreaterThanOrEqual(4);
    expect(agentes[0].name).toContain("Vendas");
    expect(agentes[0].systemPrompt).toContain("HUG IA Core");
  });

  it("permite criar e salvar um novo agente personalizado", () => {
    const novoAgente: CustomAgent = {
      id: "agent-custom-999",
      name: "Agente de Teste Vendas",
      role: "Vendedor de Calçados",
      description: "Atende no WhatsApp tirando dúvidas de numeração",
      systemPrompt: "Você é um atendente simpático focado em vender tênis.",
      avatarIcon: "ShoppingBag",
      model: "hug-fast",
      temperature: 0.7,
      active: true,
      whatsappEnabled: true,
      humanHandoffEnabled: true,
      knowledgeFiles: [{ name: "Tabela_Tamanhos.pdf", size: "1.2 MB", type: "PDF" }],
      welcomeMessage: "Olá! Quer saber quais modelos temos no seu número?",
      quickPrompts: ["Tem número 41?", "Qual o frete para o centro?"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: "test-user-123",
    };

    const lista = HugAgentsService.salvarAgente(novoAgente, "test-user-123");
    expect(lista.some((a) => a.id === "agent-custom-999")).toBe(true);

    const reconsultada = HugAgentsService.obterAgentes("test-user-123");
    const encontrado = reconsultada.find((a) => a.id === "agent-custom-999");
    expect(encontrado?.role).toBe("Vendedor de Calçados");
    expect(encontrado?.knowledgeFiles.length).toBe(1);
  });

  it("permite duplicar um agente existente com novo ID e prefixo de cópia", () => {
    const agentes = HugAgentsService.obterAgentes("test-user-123");
    const primeiro = agentes[0];

    const atualizada = HugAgentsService.duplicarAgente(primeiro.id, "test-user-123");
    expect(atualizada.length).toBe(agentes.length + 1);
    expect(atualizada[0].name).toContain("(Cópia)");
    expect(atualizada[0].id).not.toBe(primeiro.id);
  });

  it("permite excluir um agente do usuário", () => {
    const agentes = HugAgentsService.obterAgentes("test-user-123");
    const totalInicial = agentes.length;
    const alvo = agentes[0].id;

    const filtrada = HugAgentsService.excluirAgente(alvo, "test-user-123");
    expect(filtrada.length).toBe(totalInicial - 1);
    expect(filtrada.some((a) => a.id === alvo)).toBe(false);
  });

  it("permite criar, salvar e listar conversas isoladas por usuário", () => {
    const conversa = {
      id: "conv-101",
      agentId: "agent-tpl-1",
      title: "Dúvida sobre entrega em Primavera",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: "m-1",
          role: "user" as const,
          content: "Qual o prazo de entrega hoje?",
          createdAt: new Date().toISOString(),
        },
        {
          id: "m-2",
          role: "assistant" as const,
          content: "Entregamos em até 45 minutos no centro!",
          createdAt: new Date().toISOString(),
        },
      ],
    };

    HugAgentsService.salvarConversa(conversa, "test-user-123");
    const lista = HugAgentsService.obterConversas("test-user-123");
    expect(lista.length).toBe(1);
    expect(lista[0].messages.length).toBe(2);

    // Garante isolamento: outro usuário não vê a conversa
    const listaOutro = HugAgentsService.obterConversas("outro-usuario-999");
    expect(listaOutro.length).toBe(0);
  });
});
