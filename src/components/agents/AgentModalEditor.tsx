import { useState, useEffect } from "react";
import {
  X,
  Save,
  Trash2,
  Copy,
  ShoppingBag,
  Store,
  ShieldCheck,
  Wallet,
  MessageSquare,
  FileText,
  Sliders,
  Radio,
  Check,
  Plus,
  HelpCircle,
  QrCode,
  Smartphone,
  Phone,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { CustomAgent } from "@/lib/multiplex/agents-service";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  agent: CustomAgent | null;
  onSave: (agent: CustomAgent) => void;
  onDelete?: (agentId: string) => void;
  onDuplicate?: (agentId: string) => void;
}

const ICONES_DISPONIVEIS = [
  { id: "ShoppingBag", label: "Vendas", Icon: ShoppingBag },
  { id: "Store", label: "Loja / Balcão", Icon: Store },
  { id: "ShieldCheck", label: "Suporte", Icon: ShieldCheck },
  { id: "Wallet", label: "Financeiro", Icon: Wallet },
  { id: "MessageSquare", label: "Atendimento", Icon: MessageSquare },
  { id: "FileText", label: "Contratos", Icon: FileText },
];

const MODELOS_HUG = [
  { id: "hug-fast", name: "HUG Fast", desc: "Respostas ultrarrápidas em menos de 1 segundo para WhatsApp" },
  { id: "hug-ultra", name: "HUG Ultra", desc: "Equilíbrio ideal entre precisão, persuasão e agilidade" },
  { id: "hug-reasoning", name: "HUG Reasoning", desc: "Raciocínio profundo para regras complexas, farmacêuticas e fiscais" },
];

const PROMPT_TEMPLATES_PRONTOS = [
  {
    titulo: "Vendedor Objetivo no WhatsApp",
    prompt: `Você é o Vendedor Oficial da loja no WhatsApp, conectado ao HUG IA Core.
1. Cumprimente com energia e pergunte diretamente o que o cliente procura.
2. Apresente os itens disponíveis com preço claro e foto/link se solicitado.
3. Pergunte a forma de pagamento preferida (PIX ou Cartão) e feche o pedido.
4. Mantenha as mensagens curtas para leitura rápida no celular.`,
  },
  {
    titulo: "Atendente Farmacêutico Regulatório",
    prompt: `Você é o Farmacêutico HUG da drogaria.
1. Orienta posologia e precauções com clareza.
2. Lembra sempre da retenção de receita para antibióticos e controlados (Portaria 344).
3. Oferece opções de genéricos mais econômicos.
4. Facilita o envio de receitas para dispensação e tele-entrega.`,
  },
  {
    titulo: "Suporte & Pós-Venda Acolhedor",
    prompt: `Você é o Especialista de Suporte e Pós-Venda.
1. Acolha a dúvida ou reclamação do cliente com paciência e educação.
2. Solicite o número do pedido ou CPF do titular.
3. Forneça o status da entrega ou orientações detalhadas de garantia e troca.
4. Envie o protocolo formal de atendimento no final da mensagem.`,
  },
  {
    titulo: "Financeiro & Negociação Amigável",
    prompt: `Você é o Assistente Financeiro da empresa.
1. Ajuda a consultar faturas em aberto e gerar chave PIX instantânea para pagamento.
2. Explica datas de vencimento e confirma comprovantes de depósito.
3. Propõe acordos e parcelamentos com transparência e respeito.`,
  },
];

export function AgentModalEditor({
  open,
  onClose,
  agent,
  onSave,
  onDelete,
  onDuplicate,
}: Props) {
  const [abaAtiva, setAbaAtiva] = useState<"geral" | "instrucoes" | "whatsapp" | "conhecimento">("geral");

  const [nome, setNome] = useState("");
  const [papel, setPapel] = useState("");
  const [descricao, setDescricao] = useState("");
  const [avatarIcon, setAvatarIcon] = useState("ShoppingBag");
  const [model, setModel] = useState<"hug-ultra" | "hug-fast" | "hug-reasoning">("hug-fast");
  const [temperature, setTemperature] = useState(0.6);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [humanHandoffEnabled, setHumanHandoffEnabled] = useState(true);
  const [novoArquivo, setNovoArquivo] = useState("");
  const [knowledgeFiles, setKnowledgeFiles] = useState<{ name: string; size: string; type: string }[]>([]);

  useEffect(() => {
    if (agent) {
      setNome(agent.name);
      setPapel(agent.role);
      setDescricao(agent.description);
      setAvatarIcon(agent.avatarIcon || "ShoppingBag");
      setModel(agent.model || "hug-fast");
      setTemperature(agent.temperature ?? 0.6);
      setSystemPrompt(agent.systemPrompt);
      setWelcomeMessage(agent.welcomeMessage);
      setWhatsappEnabled(agent.whatsappEnabled);
      setWhatsappNumber(agent.whatsappNumber || "");
      setHumanHandoffEnabled(agent.humanHandoffEnabled);
      setKnowledgeFiles(agent.knowledgeFiles || []);
    } else {
      setNome("Novo Agente HUG");
      setPapel("Atendimento & Vendas");
      setDescricao("Agente personalizado para atender meus clientes no WhatsApp e site.");
      setAvatarIcon("ShoppingBag");
      setModel("hug-fast");
      setTemperature(0.6);
      setSystemPrompt(PROMPT_TEMPLATES_PRONTOS[0].prompt);
      setWelcomeMessage("Olá! Sou o assistente oficial da loja. Como posso te ajudar hoje?");
      setWhatsappEnabled(true);
      setWhatsappNumber("");
      setHumanHandoffEnabled(true);
      setKnowledgeFiles([]);
    }
  }, [agent, open]);

  if (!open) return null;

  function handleSalvar() {
    if (!nome.trim()) {
      toast.error("Informe o nome do agente.");
      return;
    }

    const atualizado: CustomAgent = {
      id: agent?.id || `agent-hug-${Date.now().toString(36)}`,
      name: nome.trim(),
      role: papel.trim() || "Atendimento Comercial",
      description: descricao.trim(),
      avatarIcon,
      model,
      temperature,
      active: true,
      whatsappEnabled,
      whatsappNumber: whatsappNumber.trim(),
      humanHandoffEnabled,
      knowledgeFiles,
      systemPrompt: systemPrompt.trim(),
      welcomeMessage: welcomeMessage.trim() || "Olá! Como posso te ajudar?",
      quickPrompts: agent?.quickPrompts || [
        "Quais os produtos mais vendidos?",
        "Qual o prazo de entrega?",
        "Como pagar via PIX?",
        "Falar com atendente humano",
      ],
      createdAt: agent?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(atualizado);
    toast.success(`Agente "${atualizado.name}" salvo com sucesso!`);
    onClose();
  }

  function handleAdicionarArquivo(e: React.FormEvent) {
    e.preventDefault();
    if (!novoArquivo.trim()) return;
    setKnowledgeFiles([
      ...knowledgeFiles,
      {
        name: novoArquivo.trim(),
        size: `${(Math.random() * 2 + 0.3).toFixed(1)} MB`,
        type: novoArquivo.endsWith(".pdf") ? "PDF" : "Documento",
      },
    ]);
    setNovoArquivo("");
    toast.success("Documento de conhecimento adicionado.");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#090e17] border border-white/10 rounded-3xl shadow-2xl shadow-black overflow-hidden flex flex-col max-h-[90vh]">
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.08] bg-[#070b12]">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sliders className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {agent ? `Editar Agente: ${agent.name}` : "Criar Novo Agente no WhatsApp"}
              </h3>
              <p className="text-xs text-slate-400">
                Configure a inteligência, regras e comportamento do seu agente HUG IA.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Barra de Abas */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-white/[0.06] bg-[#070b12] text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setAbaAtiva("geral")}
            className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 ${
              abaAtiva === "geral"
                ? "border-emerald-500 text-emerald-400 font-bold"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Identidade & Perfil
          </button>
          <button
            type="button"
            onClick={() => setAbaAtiva("instrucoes")}
            className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 ${
              abaAtiva === "instrucoes"
                ? "border-emerald-500 text-emerald-400 font-bold"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Instruções (Prompt)
          </button>
          <button
            type="button"
            onClick={() => setAbaAtiva("whatsapp")}
            className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 flex items-center gap-1.5 ${
              abaAtiva === "whatsapp"
                ? "border-emerald-500 text-emerald-400 font-bold"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Smartphone className="size-3.5" />
            WhatsApp & Canais
          </button>
          <button
            type="button"
            onClick={() => setAbaAtiva("conhecimento")}
            className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 flex items-center gap-1.5 ${
              abaAtiva === "conhecimento"
                ? "border-emerald-500 text-emerald-400 font-bold"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <FileText className="size-3.5" />
            Conhecimento ({knowledgeFiles.length})
          </button>
        </div>

        {/* Conteúdo com rolagem interna */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs text-slate-300">
          {/* ABA 1: IDENTIDADE & PERFIL */}
          {abaAtiva === "geral" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300 font-semibold">Nome do Agente</Label>
                  <Input
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Ana Vendedora WhatsApp"
                    className="bg-black/40 border-white/10 text-white text-xs h-10 rounded-xl focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300 font-semibold">Papel / Função Comercial</Label>
                  <Input
                    value={papel}
                    onChange={(e) => setPapel(e.target.value)}
                    placeholder="Ex: Consultora de Vendas e Fechamento"
                    className="bg-black/40 border-white/10 text-white text-xs h-10 rounded-xl focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300 font-semibold">Descrição do Agente</Label>
                <Input
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Explique resumidamente o que este agente faz para a equipe."
                  className="bg-black/40 border-white/10 text-white text-xs h-10 rounded-xl focus:border-emerald-500"
                />
              </div>

              {/* Ícone de Identidade */}
              <div className="space-y-2">
                <Label className="text-xs text-slate-300 font-semibold">Ícone Semântico do Domínio</Label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {ICONES_DISPONIVEIS.map(({ id, label, Icon }) => {
                    const ativo = avatarIcon === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setAvatarIcon(id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                          ativo
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-sm"
                            : "border-white/10 bg-black/30 text-slate-400 hover:text-white hover:border-white/20"
                        }`}
                      >
                        <Icon className="size-5 mb-1" />
                        <span className="text-[10px] truncate max-w-full">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Modelo HUG IA Core */}
              <div className="space-y-2 pt-2">
                <Label className="text-xs text-slate-300 font-semibold">Motor Central HUG IA Core</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {MODELOS_HUG.map((m) => {
                    const ativo = model === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setModel(m.id as any)}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          ativo
                            ? "border-emerald-500 bg-emerald-500/10 text-white"
                            : "border-white/10 bg-black/30 text-slate-400 hover:border-white/20"
                        }`}
                      >
                        <p className={`text-xs font-bold ${ativo ? "text-emerald-400" : "text-slate-200"}`}>
                          {m.name}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                          {m.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <Label className="text-xs text-slate-300 font-semibold">Mensagem de Boas-Vindas Inicial</Label>
                <Input
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  placeholder="Olá! Como posso ajudar você hoje?"
                  className="bg-black/40 border-white/10 text-white text-xs h-10 rounded-xl focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* ABA 2: INSTRUÇÕES (PROMPT) */}
          {abaAtiva === "instrucoes" && (
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-1">
                <p className="font-bold text-emerald-400 text-xs">Exemplos Prontos com 1 Clique</p>
                <p className="text-[11px] text-slate-400">
                  Clique em um dos modelos para aplicar as melhores diretrizes ao seu agente:
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {PROMPT_TEMPLATES_PRONTOS.map((tpl) => (
                    <button
                      key={tpl.titulo}
                      type="button"
                      onClick={() => setSystemPrompt(tpl.prompt)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-medium text-slate-300 hover:text-white hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-colors"
                    >
                      {tpl.titulo}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label className="text-xs text-slate-300 font-semibold">
                    Instruções Detalhadas em Linguagem Natural (System Prompt)
                  </Label>
                  <span className="text-[10px] text-slate-500">
                    O HUG IA Core segue estritamente este texto
                  </span>
                </div>
                <Textarea
                  rows={8}
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="Escreva exatamente como você quer que o agente atenda seus clientes..."
                  className="bg-black/40 border-white/10 text-white text-xs rounded-xl focus:border-emerald-500 font-mono leading-relaxed p-3"
                />
              </div>
            </div>
          )}

          {/* ABA 3: WHATSAPP & CANAIS */}
          {abaAtiva === "whatsapp" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#070b12] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-white flex items-center gap-2">
                      <Smartphone className="size-4 text-emerald-400" />
                      Responder Automaticamente no WhatsApp
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Quando ativado, o agente responderá aos clientes que mandarem mensagem no número da loja.
                    </p>
                  </div>
                  <Switch
                    checked={whatsappEnabled}
                    onCheckedChange={setWhatsappEnabled}
                  />
                </div>

                {whatsappEnabled && (
                  <div className="pt-3 border-t border-white/[0.06] space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-300">Número do WhatsApp Vinculado</Label>
                      <Input
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        placeholder="Ex: (66) 99273-4632"
                        className="bg-black/40 border-white/10 text-white text-xs h-10 rounded-xl focus:border-emerald-500 font-mono"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-200">
                          Transferência para Atendente Humano
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Se o cliente pedir para falar com uma pessoa, o agente pausa a IA e avisa a equipe.
                        </p>
                      </div>
                      <Switch
                        checked={humanHandoffEnabled}
                        onCheckedChange={setHumanHandoffEnabled}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ABA 4: BASE DE CONHECIMENTO */}
          {abaAtiva === "conhecimento" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300 font-semibold">
                  Adicionar Documento de Conhecimento (Catálogo, Tabela de Preços, Regras)
                </Label>
                <form onSubmit={handleAdicionarArquivo} className="flex gap-2">
                  <Input
                    value={novoArquivo}
                    onChange={(e) => setNovoArquivo(e.target.value)}
                    placeholder="Nome do arquivo ou link (Ex: Catalogo_2026.pdf)"
                    className="bg-black/40 border-white/10 text-white text-xs h-10 rounded-xl focus:border-emerald-500"
                  />
                  <Button
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 rounded-xl shrink-0"
                  >
                    <Plus className="size-4 mr-1" /> Adicionar
                  </Button>
                </form>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-slate-300 font-semibold">
                  Arquivos Vinculados a este Agente ({knowledgeFiles.length})
                </Label>
                {knowledgeFiles.length === 0 ? (
                  <div className="p-6 rounded-2xl border border-dashed border-white/10 text-center text-slate-500 text-xs">
                    Nenhum arquivo anexado ainda. Adicione tabelas ou manuais para o agente consultar.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {knowledgeFiles.map((arq, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]"
                      >
                        <div className="flex items-center gap-2.5">
                          <FileText className="size-4 text-emerald-400" />
                          <span className="font-medium text-slate-200">{arq.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono">({arq.size})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setKnowledgeFiles(knowledgeFiles.filter((_, i) => i !== idx))
                          }
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Rodapé de Ações */}
        <div className="flex items-center justify-between p-4 border-t border-white/[0.08] bg-[#070b12]">
          <div className="flex items-center gap-2">
            {agent && onDelete && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (confirm(`Deseja excluir o agente "${agent.name}"?`)) {
                    onDelete(agent.id);
                    onClose();
                  }
                }}
                className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-xs h-9 px-3 rounded-xl"
              >
                <Trash2 className="size-3.5 mr-1" /> Excluir
              </Button>
            )}
            {agent && onDuplicate && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onDuplicate(agent.id);
                  onClose();
                }}
                className="border-white/10 bg-white/5 text-slate-300 hover:text-white text-xs h-9 px-3 rounded-xl"
              >
                <Copy className="size-3.5 mr-1" /> Duplicar
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-400 hover:text-white text-xs h-9 px-4 rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSalvar}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs h-9 px-5 rounded-xl gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <Save className="size-4" /> Salvar Agente
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
