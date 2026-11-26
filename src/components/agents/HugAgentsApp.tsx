import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Plus,
  MessageSquare,
  ShoppingBag,
  Store,
  ShieldCheck,
  Wallet,
  FileText,
  Smartphone,
  Sliders,
  Send,
  Paperclip,
  Mic,
  MicOff,
  Copy,
  RotateCcw,
  Trash2,
  ChevronDown,
  Menu,
  X,
  LogOut,
  Layers,
  ArrowLeft,
  Check,
  User,
  Radio,
  ExternalLink,
} from "lucide-react";
import hugLogo from "@/assets/hug-icon.jpg";
import { Button } from "@/components/ui/button";
import {
  HugAgentsService,
  CustomAgent,
  AgentConversation,
  AgentChatMessage,
  OFFICIAL_AGENT_TEMPLATES,
} from "@/lib/multiplex/agents-service";
import { AgentModalEditor } from "./AgentModalEditor";
import { getToken, clearToken } from "@/lib/multiplex/client";
import { toast } from "sonner";

interface Props {
  onLogout: () => void;
}

const ICON_MAP: Record<string, any> = {
  ShoppingBag,
  Store,
  ShieldCheck,
  Wallet,
  MessageSquare,
  FileText,
};

export function HugAgentsApp({ onLogout }: Props) {
  const navigate = useNavigate();
  const [sidebarAberta, setSidebarAberta] = useState(true);

  // Usuário e Workspace
  const [userEmail, setUserEmail] = useState("usuario@empresa.com");
  const [userName, setUserName] = useState("Administrador");
  const [codigoEmpresa, setCodigoEmpresa] = useState("0001");

  // Agentes
  const [agentes, setAgentes] = useState<CustomAgent[]>([]);
  const [agenteAtivo, setAgenteAtivo] = useState<CustomAgent | null>(null);

  // Conversas
  const [conversas, setConversas] = useState<AgentConversation[]>([]);
  const [conversaAtivaId, setConversaAtivaId] = useState<string | null>(null);

  // Mensagens do chat atual
  const [mensagens, setMensagens] = useState<AgentChatMessage[]>([]);
  const [textoInput, setTextoInput] = useState("");
  const [processando, setProcessando] = useState(false);

  // Modal Editor de Agentes
  const [modalEditorAberto, setModalEditorAberto] = useState(false);
  const [agenteParaEditar, setAgenteParaEditar] = useState<CustomAgent | null>(null);

  // Gravação de Áudio
  const [gravandoAudio, setGravandoAudio] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // Anexos
  const [anexosPendentes, setAnexosPendentes] = useState<{ name: string; type: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Scroll da área de mensagens
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // 1. CARREGAMENTO INICIAL
  useEffect(() => {
    const email = localStorage.getItem("hug_agents_user_email") || "usuario@empresa.com";
    const nome = localStorage.getItem("hug_agents_user_name") || "Administrador";
    const cod = localStorage.getItem("hug_codigo_loja") || "0001";
    setUserEmail(email);
    setUserName(nome);
    setCodigoEmpresa(cod);

    const listaAgentes = HugAgentsService.obterAgentes(email);
    setAgentes(listaAgentes);

    const listaConversas = HugAgentsService.obterConversas(email);
    setConversas(listaConversas);

    if (listaAgentes.length > 0) {
      setAgenteAtivo(listaAgentes[0]);
    }

    if (listaConversas.length > 0) {
      setConversaAtivaId(listaConversas[0].id);
      setMensagens(listaConversas[0].messages || []);
    }
  }, []);

  // 2. ROLAGEM SUAVE INTELIGENTE (sem atrapalhar se o usuário estiver rolando para cima)
  useEffect(() => {
    if (messagesEndRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const isPertoDoFim =
        container.scrollHeight - container.scrollTop - container.clientHeight < 250;
      if (isPertoDoFim) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [mensagens, processando]);

  // 3. INICIAR NOVA CONVERSA
  function handleNovoChat(agenteSelecionado?: CustomAgent) {
    const ag = agenteSelecionado || agenteAtivo || agentes[0];
    if (!ag) return;

    setAgenteAtivo(ag);
    setConversaAtivaId(null);
    setMensagens([]);
    setTextoInput("");
    setAnexosPendentes([]);
    if (window.innerWidth < 768) {
      setSidebarAberta(false);
    }
  }

  // 4. SELECIONAR CONVERSA EXISTENTE
  function handleSelecionarConversa(conv: AgentConversation) {
    setConversaAtivaId(conv.id);
    setMensagens(conv.messages || []);
    const agCorrespondente = agentes.find((a) => a.id === conv.agentId);
    if (agCorrespondente) {
      setAgenteAtivo(agCorrespondente);
    }
    if (window.innerWidth < 768) {
      setSidebarAberta(false);
    }
  }

  // 5. EXCLUIR CONVERSA
  function handleExcluirConversa(e: React.MouseEvent, convId: string) {
    e.stopPropagation();
    const atualizadas = HugAgentsService.excluirConversa(convId, userEmail);
    setConversas(atualizadas);
    if (conversaAtivaId === convId) {
      handleNovoChat();
    }
    toast.info("Conversa removida do histórico.");
  }

  // 6. ENVIAR MENSAGEM COM O HUG IA CORE
  async function handleEnviarMensagem(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const texto = textoInput.trim();
    if (!texto && anexosPendentes.length === 0) return;
    if (!agenteAtivo) return;

    const mensagemUsuario: AgentChatMessage = {
      id: `msg-usr-${Date.now()}`,
      role: "user",
      content: texto,
      createdAt: new Date().toISOString(),
      attachments: anexosPendentes.length > 0 ? [...anexosPendentes] : undefined,
    };

    const novasMensagens = [...mensagens, mensagemUsuario];
    setMensagens(novasMensagens);
    setTextoInput("");
    setAnexosPendentes([]);
    setProcessando(true);

    try {
      const token = getToken();
      const resposta = await HugAgentsService.enviarMensagem({
        mensagem: texto,
        agente: agenteAtivo,
        historico: mensagens,
        token,
      });

      const mensagemAssistente: AgentChatMessage = {
        id: `msg-agt-${Date.now()}`,
        role: "assistant",
        content: resposta.resposta,
        createdAt: new Date().toISOString(),
        agentId: agenteAtivo.id,
      };

      const mensagensFinais = [...novasMensagens, mensagemAssistente];
      setMensagens(mensagensFinais);

      // Persiste ou atualiza a conversa
      let convId = conversaAtivaId;
      if (!convId) {
        convId = `conv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        setConversaAtivaId(convId);
      }

      const tituloConversa =
        texto.slice(0, 36) + (texto.length > 36 ? "..." : "") || "Conversa com Agente";

      const conversaSalva: AgentConversation = {
        id: convId,
        agentId: agenteAtivo.id,
        title: tituloConversa,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: mensagensFinais,
      };

      const conversasAtualizadas = HugAgentsService.salvarConversa(conversaSalva, userEmail);
      setConversas(conversasAtualizadas);
    } catch (err: any) {
      toast.error(err?.message || "Erro ao processar mensagem com o agente.");
    } finally {
      setProcessando(false);
    }
  }

  // 7. GRAVAÇÃO DE ÁUDIO REAL
  async function alternarGravacaoAudio() {
    if (gravandoAudio) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      setGravandoAudio(false);
    } else {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          toast.error("Seu navegador não possui suporte para gravação de áudio.");
          return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;

        recorder.onstop = () => {
          stream.getTracks().forEach((track) => track.stop());
          setAnexosPendentes((prev) => [
            ...prev,
            { name: `Audio_Mensagem_${new Date().toLocaleTimeString("pt-BR")}.webm`, type: "audio/webm" },
          ]);
          toast.success("Áudio gravado e pronto para envio.");
        };

        recorder.start();
        setGravandoAudio(true);
        toast.info("Gravando mensagem de voz...");
      } catch {
        toast.error("Permissão de microfone negada.");
      }
    }
  }

  // 8. ANEXO DE ARQUIVOS
  function handleAnexarArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const novos = Array.from(files).map((f) => ({
      name: f.name,
      type: f.type || "application/octet-stream",
    }));
    setAnexosPendentes((prev) => [...prev, ...novos]);
    toast.success(`${novos.length} anexo(s) adicionado(s).`);
  }

  // 9. SALVAR AGENTE DO MODAL
  function handleSalvarAgente(agenteSalvo: CustomAgent) {
    const listaAtualizada = HugAgentsService.salvarAgente(agenteSalvo, userEmail);
    setAgentes(listaAtualizada);
    setAgenteAtivo(agenteSalvo);
  }

  function handleExcluirAgente(agentId: string) {
    const listaAtualizada = HugAgentsService.excluirAgente(agentId, userEmail);
    setAgentes(listaAtualizada);
    if (agenteAtivo?.id === agentId) {
      setAgenteAtivo(listaAtualizada[0] || null);
    }
  }

  function handleDuplicarAgente(agentId: string) {
    const listaAtualizada = HugAgentsService.duplicarAgente(agentId, userEmail);
    setAgentes(listaAtualizada);
  }

  const ActiveIcon = agenteAtivo ? ICON_MAP[agenteAtivo.avatarIcon] || MessageSquare : MessageSquare;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#03060a] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* ============================================================== */}
      {/* SIDEBAR ESQUERDA ESTILO CHATGPT                                */}
      {/* ============================================================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 sm:w-80 bg-[#070b12] border-r border-white/[0.08] flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          sidebarAberta ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Topo da Sidebar: Logo & Botão Novo Chat */}
        <div className="p-3.5 border-b border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img
                src={hugLogo}
                alt="HUG"
                className="size-7 rounded-xl object-cover"
              />
              <span className="text-sm font-bold tracking-wider text-white">
                HUG <span className="text-emerald-400 font-mono text-xs">AGENTS</span>
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setSidebarAberta(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white md:hidden"
            >
              <X className="size-5" />
            </button>
          </div>

          <Button
            type="button"
            onClick={() => handleNovoChat()}
            className="w-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 font-bold h-10 rounded-xl text-xs gap-2 transition-all justify-start px-3.5 shadow-sm"
          >
            <Plus className="size-4 text-emerald-400" />
            Novo chat
          </Button>
        </div>

        {/* Rolagem Central da Sidebar */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5 text-xs text-slate-400">
          {/* SEÇÃO 1: MEUS AGENTES */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <span>Meus Agentes</span>
              <button
                type="button"
                onClick={() => {
                  setAgenteParaEditar(null);
                  setModalEditorAberto(true);
                }}
                className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
              >
                <Plus className="size-3" /> Criar
              </button>
            </div>

            <div className="space-y-1">
              {agentes.map((ag) => {
                const IconComp = ICON_MAP[ag.avatarIcon] || MessageSquare;
                const selecionado = agenteAtivo?.id === ag.id;
                return (
                  <button
                    key={ag.id}
                    type="button"
                    onClick={() => {
                      setAgenteAtivo(ag);
                      handleNovoChat(ag);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                      selecionado
                        ? "bg-white/[0.08] text-white border border-white/[0.12]"
                        : "hover:bg-white/[0.03] text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`size-7 rounded-lg flex items-center justify-center shrink-0 ${
                          selecionado
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-white/5 text-slate-400"
                        }`}
                      >
                        <IconComp className="size-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate leading-tight">{ag.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{ag.role}</p>
                      </div>
                    </div>

                    {ag.whatsappEnabled && (
                      <span className="size-2 rounded-full bg-emerald-400 shrink-0" title="WhatsApp Ativo" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SEÇÃO 2: HISTÓRICO DE CONVERSAS */}
          <div className="space-y-1.5">
            <div className="px-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Histórico de Conversas
            </div>

            {conversas.length === 0 ? (
              <p className="px-2 text-[11px] text-slate-600 italic">Nenhuma conversa arquivada.</p>
            ) : (
              <div className="space-y-0.5">
                {conversas.map((c) => {
                  const ativa = conversaAtivaId === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => handleSelecionarConversa(c)}
                      className={`group flex items-center justify-between px-2.5 py-2 rounded-xl cursor-pointer transition-all ${
                        ativa
                          ? "bg-white/[0.08] text-white font-medium"
                          : "hover:bg-white/[0.04] text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <MessageSquare className="size-3.5 shrink-0 opacity-60" />
                        <span className="truncate text-xs">{c.title}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleExcluirConversa(e, c.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-500 hover:text-rose-400 transition-opacity"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* SEÇÃO 3: CANAL WHATSAPP & INTEGRAÇÕES */}
          <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
            <div className="px-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Canais & Integrações
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                  <Smartphone className="size-3.5 text-emerald-400" /> WhatsApp
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono">
                  Online
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Seus agentes atendem clientes e recebem pedidos diretamente no número da empresa.
              </p>
            </div>
          </div>
        </div>

        {/* Rodapé da Sidebar: Perfil do Usuário & Sair */}
        <div className="p-3.5 border-t border-white/[0.08] bg-[#05080e] flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-8 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-xs shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{userName}</p>
              <p className="text-[10px] text-slate-500 truncate">Empresa {codigoEmpresa}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/[0.04] transition-colors"
              title="Sair do HUG Agents"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ============================================================== */}
      {/* ÁREA CENTRAL PRINCIPAL DO CHAT                                 */}
      {/* ============================================================== */}
      <main className="flex-1 flex flex-col h-full min-w-0 relative bg-[#03060a]">
        {/* Header Superior Fixo */}
        <header className="h-14 border-b border-white/[0.08] bg-[#070b12]/90 backdrop-blur-md px-4 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarAberta(!sidebarAberta)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              <Menu className="size-5" />
            </button>

            {agenteAtivo ? (
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <ActiveIcon className="size-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xs sm:text-sm font-bold text-white truncate">
                      {agenteAtivo.name}
                    </h2>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono hidden sm:inline-block">
                      {agenteAtivo.model}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate hidden sm:block">
                    {agenteAtivo.role}
                  </p>
                </div>
              </div>
            ) : (
              <span className="text-xs font-bold text-white">HUG Agents</span>
            )}
          </div>

          {/* Ações do Topo */}
          <div className="flex items-center gap-2">
            {agenteAtivo && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setAgenteParaEditar(agenteAtivo);
                  setModalEditorAberto(true);
                }}
                className="border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 text-xs h-8 px-3 rounded-xl gap-1.5"
              >
                <Sliders className="size-3.5 text-emerald-400" />
                Configurar Agente
              </Button>
            )}

            <Link
              to="/"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              title="Voltar à Homepage"
            >
              <ArrowLeft className="size-4" />
            </Link>
          </div>
        </header>

        {/* ============================================================== */}
        {/* CONTAINER DE MENSAGENS COM SCROLL INTERNO                      */}
        {/* ============================================================== */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 space-y-6 max-w-4xl mx-auto w-full"
        >
          {mensagens.length === 0 ? (
            /* TELA INICIAL QUANDO NÃO HÁ MENSAGENS */
            <div className="h-full flex flex-col justify-center items-center text-center my-auto py-12 space-y-6">
              <div className="relative">
                <div className="size-16 rounded-3xl bg-card border border-border flex items-center justify-center text-foreground shadow-xl">
                  <ActiveIcon className="size-8" />
                </div>
              </div>

              <div className="max-w-md space-y-2">
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {agenteAtivo?.name || "HUG Agents"}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {agenteAtivo?.description || "Canal de atendimento e automação conectado."}
                </p>
                <p className="text-xs text-emerald-400/90 font-medium italic pt-1">
                  "{agenteAtivo?.welcomeMessage}"
                </p>
              </div>

              {/* Cards de Atalhos Rápidos */}
              {agenteAtivo?.quickPrompts && agenteAtivo.quickPrompts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-xl w-full pt-4">
                  {agenteAtivo.quickPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setTextoInput(prompt);
                      }}
                      className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-emerald-500/40 hover:bg-emerald-500/5 text-left text-xs text-slate-300 hover:text-white transition-all group"
                    >
                      <p className="font-medium group-hover:text-emerald-300 transition-colors">
                        {prompt}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* LISTA DE MENSAGENS DO CHAT */
            mensagens.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 sm:gap-4 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && (
                    <div className="size-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-1">
                      <ActiveIcon className="size-4" />
                    </div>
                  )}

                  <div className={`space-y-1.5 max-w-[85%] sm:max-w-[78%] ${isUser ? "items-end" : "items-start"}`}>
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                        isUser
                          ? "bg-emerald-600 text-white rounded-tr-none shadow-md"
                          : "bg-[#090e17] border border-white/[0.08] text-slate-200 rounded-tl-none"
                      }`}
                    >
                      {msg.content}

                      {/* Anexos da Mensagem */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="pt-2 mt-2 border-t border-white/10 space-y-1">
                          {msg.attachments.map((anexo, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 text-[11px] font-mono opacity-80"
                            >
                              <Paperclip className="size-3" />
                              <span>{anexo.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 px-1 text-[10px] text-slate-500">
                      <span>{new Date(msg.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
                      {!isUser && (
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(msg.content);
                            toast.success("Mensagem copiada.");
                          }}
                          className="hover:text-slate-300 transition-colors"
                        >
                          <Copy className="size-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {isUser && (
                    <div className="size-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-200 font-bold text-xs shrink-0 mt-1">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Indicador de Processamento / Pensando */}
          {processando && (
            <div className="flex gap-3 items-center text-xs text-slate-400">
              <div className="size-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 animate-pulse">
                <ActiveIcon className="size-4" />
              </div>
              <div className="p-3 rounded-2xl bg-[#090e17] border border-white/[0.08] text-slate-300 flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Processando resposta...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ============================================================== */}
        {/* BARRA DE ENTRADA DE MENSAGENS FIXA NO RODAPÉ                   */}
        {/* ============================================================== */}
        <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-[#070b12]/95 backdrop-blur-md shrink-0">
          <div className="max-w-4xl mx-auto space-y-2">
            {/* Lista de Anexos Pendentes */}
            {anexosPendentes.length > 0 && (
              <div className="flex flex-wrap gap-2 pb-1">
                {anexosPendentes.map((anexo, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 text-xs text-slate-200 font-mono"
                  >
                    <Paperclip className="size-3 text-emerald-400" />
                    <span className="truncate max-w-[140px]">{anexo.name}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setAnexosPendentes(anexosPendentes.filter((_, i) => i !== idx))
                      }
                      className="text-slate-400 hover:text-white ml-1"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <form
              onSubmit={handleEnviarMensagem}
              className="relative flex items-center bg-[#0d131f] border border-white/10 rounded-2xl p-1.5 focus-within:border-emerald-500/60 shadow-xl transition-all"
            >
              {/* Botão Anexar Arquivo */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAnexarArquivo}
                multiple
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                title="Anexar arquivo ou foto"
              >
                <Paperclip className="size-4" />
              </button>

              {/* Botão Microfone / Gravar Voz */}
              <button
                type="button"
                onClick={alternarGravacaoAudio}
                className={`p-2.5 rounded-xl transition-colors ${
                  gravandoAudio
                    ? "text-rose-400 bg-rose-500/20 animate-pulse"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
                }`}
                title={gravandoAudio ? "Parar gravação" : "Gravar mensagem de voz"}
              >
                {gravandoAudio ? <MicOff className="size-4" /> : <Mic className="size-4" />}
              </button>

              {/* Campo de Texto */}
              <input
                type="text"
                value={textoInput}
                onChange={(e) => setTextoInput(e.target.value)}
                placeholder={
                  agenteAtivo
                    ? `Pergunte ou simule um atendimento com ${agenteAtivo.name}...`
                    : "Digite uma mensagem..."
                }
                className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none"
              />

              {/* Botão Enviar */}
              <button
                type="submit"
                disabled={processando || (!textoInput.trim() && anexosPendentes.length === 0)}
                className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-30 disabled:hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-500/20 shrink-0"
              >
                <Send className="size-4" />
              </button>
            </form>

            <div className="flex justify-between items-center text-[10px] text-slate-500 px-2">
              <span>HUG Plataforma • Operação ativa</span>
              <span className="hidden sm:inline font-mono">Tenant {codigoEmpresa}</span>
            </div>
          </div>
        </div>
      </main>

      {/* ============================================================== */}
      {/* MODAL DE CRIAÇÃO E EDIÇÃO DE AGENTES                           */}
      {/* ============================================================== */}
      <AgentModalEditor
        open={modalEditorAberto}
        onClose={() => setModalEditorAberto(false)}
        agent={agenteParaEditar}
        onSave={handleSalvarAgente}
        onDelete={handleExcluirAgente}
        onDuplicate={handleDuplicarAgente}
      />
    </div>
  );
}
