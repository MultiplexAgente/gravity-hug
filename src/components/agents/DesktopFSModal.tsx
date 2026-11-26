import { useState, useEffect } from "react";
import {
  X,
  HardDrive,
  FolderPlus,
  FolderOpen,
  Search,
  Move,
  RefreshCw,
  Copy,
  Check,
  FileText,
  AlertCircle,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  abaInicial?: "criar" | "mover" | "buscar" | "explorar";
}

export function DesktopFSModal({ open, onClose, abaInicial = "criar" }: Props) {
  const [abaAtiva, setAbaAtiva] = useState<"criar" | "mover" | "buscar" | "explorar">(abaInicial);

  // 1. Criar Pasta
  const [caminhoNovaPasta, setCaminhoNovaPasta] = useState("D:\\Desenvolvimento\\Projetos\\nova-pasta");
  const [criandoPasta, setCriandoPasta] = useState(false);
  const [resultadoCriacao, setResultadoCriacao] = useState<any>(null);

  // 2. Mover Arquivo
  const [origemMover, setOrigemMover] = useState("");
  const [destinoMover, setDestinoMover] = useState("D:\\Desenvolvimento\\Projetos\\");
  const [movendoArquivo, setMovendoArquivo] = useState(false);
  const [resultadoMover, setResultadoMover] = useState<any>(null);

  // 3. Buscar Arquivo
  const [termoBusca, setTermoBusca] = useState("");
  const [caminhoBusca, setCaminhoBusca] = useState("D:\\Desenvolvimento\\Projetos");
  const [buscando, setBuscando] = useState(false);
  const [arquivosEncontrados, setArquivosEncontrados] = useState<any[]>([]);

  // 4. Explorar Diretório
  const [caminhoExplorar, setCaminhoExplorar] = useState("D:\\Desenvolvimento\\Projetos");
  const [listando, setListando] = useState(false);
  const [itensDiretorio, setItensDiretorio] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      setAbaAtiva(abaInicial);
      if (abaInicial === "explorar") {
        carregarExplorador("D:\\Desenvolvimento\\Projetos");
      }
    }
  }, [open, abaInicial]);

  // Ações API
  async function handleCriarPasta(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!caminhoNovaPasta.trim()) {
      toast.error("Informe o caminho ou nome da pasta.");
      return;
    }

    setCriandoPasta(true);
    setResultadoCriacao(null);

    try {
      const resp = await fetch("/api/desktop/fs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "criar_pasta",
          caminho: caminhoNovaPasta.trim(),
        }),
      });

      const data = await resp.json();
      if (!resp.ok || !data.sucesso) {
        throw new Error(data.erro || data.mensagem || "Falha ao criar pasta.");
      }

      setResultadoCriacao(data);
      toast.success(data.mensagem || "Pasta criada com sucesso no Windows!");
    } catch (err: any) {
      toast.error(err?.message || "Erro ao criar pasta no Windows.");
      setResultadoCriacao({ sucesso: false, erro: err?.message });
    } finally {
      setCriandoPasta(false);
    }
  }

  async function handleMoverArquivo(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!origemMover.trim() || !destinoMover.trim()) {
      toast.error("Preencha origem e destino do arquivo.");
      return;
    }

    setMovendoArquivo(true);
    setResultadoMover(null);

    try {
      const resp = await fetch("/api/desktop/fs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "mover",
          origem: origemMover.trim(),
          destino: destinoMover.trim(),
        }),
      });

      const data = await resp.json();
      if (!resp.ok || !data.sucesso) {
        throw new Error(data.erro || data.mensagem || "Falha ao mover arquivo.");
      }

      setResultadoMover(data);
      toast.success("Arquivo transferido com sucesso no Windows!");
    } catch (err: any) {
      toast.error(err?.message || "Erro ao mover arquivo.");
      setResultadoMover({ sucesso: false, erro: err?.message });
    } finally {
      setMovendoArquivo(false);
    }
  }

  async function handleBuscarArquivos(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!termoBusca.trim()) {
      toast.error("Digite o nome ou termo do arquivo a ser buscado.");
      return;
    }

    setBuscando(true);
    try {
      const resp = await fetch("/api/desktop/fs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "buscar",
          termo: termoBusca.trim(),
          caminho: caminhoBusca.trim() || "D:\\Desenvolvimento\\Projetos",
          limite: 30,
        }),
      });

      const data = await resp.json();
      if (!resp.ok || !data.sucesso) {
        throw new Error(data.erro || data.mensagem || "Falha na busca.");
      }

      setArquivosEncontrados(data.dados || []);
      if (data.dados?.length === 0) {
        toast.info("Nenhum arquivo encontrado com este nome.");
      } else {
        toast.success(`${data.dados.length} arquivo(s) localizado(s)!`);
      }
    } catch (err: any) {
      toast.error(err?.message || "Erro ao buscar arquivos no PC.");
    } finally {
      setBuscando(false);
    }
  }

  async function carregarExplorador(diretorio: string) {
    setListando(true);
    try {
      const resp = await fetch("/api/desktop/fs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "listar",
          caminho: diretorio,
        }),
      });

      const data = await resp.json();
      if (!resp.ok || !data.sucesso) {
        throw new Error(data.erro || data.mensagem || "Falha ao listar diretório.");
      }

      setItensDiretorio(data.dados?.itens || []);
    } catch (err: any) {
      toast.error(err?.message || "Erro ao listar diretório.");
    } finally {
      setListando(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-[95vw] max-h-[86vh] p-0 flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#070b12] text-white shadow-2xl">
        {/* Cabeçalho Fixo */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-white/[0.02] shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <HardDrive className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  HUG Desktop OS — Gerenciador de Arquivos & Pastas
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-400 mt-0.5">
                  Criação de pastas no disco, movimentação de arquivos e localização no Windows.
                </DialogDescription>
              </div>
            </div>
          </div>

          {/* Alternador de Abas */}
          <div className="grid grid-cols-4 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] w-full text-xs font-semibold mt-4 gap-1">
            <button
              type="button"
              onClick={() => setAbaAtiva("criar")}
              className={`py-2 px-1 rounded-lg transition-all flex items-center justify-center gap-1.5 text-center truncate ${
                abaAtiva === "criar"
                  ? "bg-emerald-600 text-white font-bold shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FolderPlus className="size-3.5 shrink-0" />
              <span>Criar Pasta</span>
            </button>
            <button
              type="button"
              onClick={() => setAbaAtiva("mover")}
              className={`py-2 px-1 rounded-lg transition-all flex items-center justify-center gap-1.5 text-center truncate ${
                abaAtiva === "mover"
                  ? "bg-emerald-600 text-white font-bold shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Move className="size-3.5 shrink-0" />
              <span>Mover Arquivo</span>
            </button>
            <button
              type="button"
              onClick={() => setAbaAtiva("buscar")}
              className={`py-2 px-1 rounded-lg transition-all flex items-center justify-center gap-1.5 text-center truncate ${
                abaAtiva === "buscar"
                  ? "bg-emerald-600 text-white font-bold shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Search className="size-3.5 shrink-0" />
              <span>Localizar no PC</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAbaAtiva("explorar");
                carregarExplorador(caminhoExplorar);
              }}
              className={`py-2 px-1 rounded-lg transition-all flex items-center justify-center gap-1.5 text-center truncate ${
                abaAtiva === "explorar"
                  ? "bg-emerald-600 text-white font-bold shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FolderOpen className="size-3.5 shrink-0" />
              <span>Explorador D:</span>
            </button>
          </div>
        </div>

        {/* Corpo com Rolagem */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 min-h-0 text-xs">
          {/* ABA 1: CRIAR PASTA */}
          {abaAtiva === "criar" && (
            <form onSubmit={handleCriarPasta} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-200">
                  Caminho Completo da Nova Pasta no Windows:
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={caminhoNovaPasta}
                    onChange={(e) => setCaminhoNovaPasta(e.target.value)}
                    placeholder="D:\Desenvolvimento\Projetos\minha-pasta"
                    className="h-10 text-xs font-mono bg-black/40 border-white/10 text-white"
                  />
                  <Button
                    type="submit"
                    disabled={criandoPasta}
                    className="h-10 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 gap-1.5"
                  >
                    <FolderPlus className="size-4" />
                    {criandoPasta ? "Criando..." : "Criar Pasta"}
                  </Button>
                </div>
              </div>

              {/* Atalhos Rápidos */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-400">Atalhos rápidos para Disco D:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    "D:\\Desenvolvimento\\Projetos\\novos-agentes",
                    "D:\\Desenvolvimento\\Projetos\\backups-hug",
                    "D:\\Desenvolvimento\\Projetos\\documentos-saas",
                    "D:\\Desenvolvimento\\Projetos\\relatorios-fiscais",
                  ].map((pathSugerido) => (
                    <button
                      key={pathSugerido}
                      type="button"
                      onClick={() => setCaminhoNovaPasta(pathSugerido)}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] font-mono text-[10px] text-slate-300 transition-colors"
                    >
                      {pathSugerido.split("\\").pop()}
                    </button>
                  ))}
                </div>
              </div>

              {resultadoCriacao && (
                <div
                  className={`p-3.5 rounded-2xl border text-xs leading-relaxed ${
                    resultadoCriacao.sucesso
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                      : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                  }`}
                >
                  <p className="font-bold flex items-center gap-1.5">
                    {resultadoCriacao.sucesso ? <Check className="size-4" /> : <AlertCircle className="size-4" />}
                    {resultadoCriacao.mensagem || resultadoCriacao.erro}
                  </p>
                  {resultadoCriacao.dados?.caminho && (
                    <p className="mt-1 font-mono text-[11px] opacity-80 break-all">
                      Local exato: {resultadoCriacao.dados.caminho}
                    </p>
                  )}
                </div>
              )}
            </form>
          )}

          {/* ABA 2: MOVER ARQUIVOS */}
          {abaAtiva === "mover" && (
            <form onSubmit={handleMoverArquivo} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-200">Arquivo de Origem:</Label>
                <Input
                  value={origemMover}
                  onChange={(e) => setOrigemMover(e.target.value)}
                  placeholder="D:\Desenvolvimento\Projetos\arquivo-antigo.txt"
                  className="h-10 text-xs font-mono bg-black/40 border-white/10 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-200">Pasta ou Arquivo de Destino:</Label>
                <Input
                  value={destinoMover}
                  onChange={(e) => setDestinoMover(e.target.value)}
                  placeholder="D:\Desenvolvimento\Projetos\pasta-destino\"
                  className="h-10 text-xs font-mono bg-black/40 border-white/10 text-white"
                />
              </div>

              <Button
                type="submit"
                disabled={movendoArquivo}
                className="w-full h-10 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5"
              >
                <Move className="size-4" />
                {movendoArquivo ? "Movendo no Windows..." : "Mover / Transferir Arquivo Agora"}
              </Button>

              {resultadoMover && (
                <div
                  className={`p-3.5 rounded-2xl border text-xs leading-relaxed ${
                    resultadoMover.sucesso
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                      : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                  }`}
                >
                  <p className="font-bold flex items-center gap-1.5">
                    {resultadoMover.sucesso ? <Check className="size-4" /> : <AlertCircle className="size-4" />}
                    {resultadoMover.mensagem || resultadoMover.erro}
                  </p>
                </div>
              )}
            </form>
          )}

          {/* ABA 3: BUSCAR ARQUIVOS NO PC */}
          {abaAtiva === "buscar" && (
            <div className="space-y-4">
              <form onSubmit={handleBuscarArquivos} className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                    placeholder="Nome do arquivo, extensão ou termo..."
                    className="h-10 text-xs bg-black/40 border-white/10 text-white"
                  />
                  <Button
                    type="submit"
                    disabled={buscando}
                    className="h-10 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 gap-1.5"
                  >
                    <Search className="size-4" />
                    {buscando ? "Buscando..." : "Buscar no PC"}
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Diretório base:</span>
                  <Input
                    value={caminhoBusca}
                    onChange={(e) => setCaminhoBusca(e.target.value)}
                    className="h-7 text-[11px] font-mono bg-black/20 border-white/10 text-slate-300 max-w-xs"
                  />
                </div>
              </form>

              {/* Lista de Resultados */}
              <div className="space-y-2 mt-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Resultados ({arquivosEncontrados.length})
                </span>

                <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
                  {arquivosEncontrados.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] transition-all flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          {item.eDiretorio ? (
                            <FolderOpen className="size-4 text-emerald-400 shrink-0" />
                          ) : (
                            <FileText className="size-4 text-slate-400 shrink-0" />
                          )}
                          <span className="font-semibold text-white truncate">{item.nome}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({item.tamanhoFormatado})</span>
                        </div>
                        <p className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
                          {item.caminhoCompleto}
                        </p>
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          navigator.clipboard.writeText(item.caminhoCompleto);
                          toast.success("Caminho copiado!");
                        }}
                        className="h-8 px-2 text-slate-400 hover:text-white shrink-0"
                        title="Copiar caminho exato"
                      >
                        <Copy className="size-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ABA 4: EXPLORADOR D: */}
          {abaAtiva === "explorar" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  value={caminhoExplorar}
                  onChange={(e) => setCaminhoExplorar(e.target.value)}
                  className="h-9 text-xs font-mono bg-black/40 border-white/10 text-white"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => carregarExplorador(caminhoExplorar)}
                  disabled={listando}
                  className="h-9 px-3 bg-white/10 hover:bg-white/20 text-white text-xs gap-1.5"
                >
                  <RefreshCw className={`size-3.5 ${listando ? "animate-spin" : ""}`} />
                  Atualizar
                </Button>
              </div>

              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                {itensDiretorio.map((it, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      if (it.eDiretorio) {
                        setCaminhoExplorar(it.caminhoCompleto);
                        carregarExplorador(it.caminhoCompleto);
                      }
                    }}
                    className={`p-2 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06] flex items-center justify-between transition-colors ${
                      it.eDiretorio ? "cursor-pointer" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {it.eDiretorio ? (
                        <FolderOpen className="size-4 text-emerald-400 shrink-0" />
                      ) : (
                        <FileText className="size-4 text-slate-400 shrink-0" />
                      )}
                      <span className="truncate text-slate-200">{it.nome}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono shrink-0">
                      <span>{it.tamanhoFormatado}</span>
                      {it.eDiretorio && <ChevronRight className="size-3 text-slate-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Rodapé Fixo */}
        <div className="p-3.5 px-6 border-t border-white/10 bg-white/[0.02] flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 font-mono">
            Ambiente Local: Disco D:\Desenvolvimento\Projetos
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-8 text-xs border-white/10 text-slate-300 hover:text-white"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
