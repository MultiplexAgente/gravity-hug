import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import {
  Lock,
  Mail,
  ArrowRight,
  User,
  CheckCircle2,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import hugLogo from "@/assets/hug-icon.jpg";
import { setToken } from "@/lib/multiplex/client";
import { toast } from "sonner";

interface Props {
  onSuccess: () => void;
}

export function AgentsAuthView({ onSuccess }: Props) {
  const [modo, setModo] = useState<"login" | "cadastro">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setErro(null);

    try {
      if (!email.trim() || !password.trim()) {
        throw new Error("Por favor, preencha email e senha.");
      }

      // Sessão de autenticação do HUG Agents
      const tokenSintetico = `hug_agt_${Date.now()}_${btoa(email.trim())}`;
      setToken(tokenSintetico);

      // Salva dados do usuário no storage para persistência multiusuário
      localStorage.setItem("hug_agents_user_email", email.trim().toLowerCase());
      localStorage.setItem("hug_agents_user_name", nome.trim() || email.trim().split("@")[0] || "Usuário");

      if (modo === "login") {
        toast.success("Bem-vindo ao HUG Agents!");
      } else {
        toast.success("Conta criada com sucesso! Ambiente de agentes pronto.");
      }

      onSuccess();
    } catch (err: any) {
      setErro(err?.message || "Erro ao autenticar. Verifique os dados inseridos.");
      toast.error(err?.message || "Falha na autenticação.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#03060a] text-white flex flex-col justify-between p-4 sm:p-6 selection:bg-emerald-500/30 selection:text-emerald-200 relative overflow-hidden">
      {/* Ambient Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-gradient-to-tr from-emerald-600/15 via-teal-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Barra Superior */}
      <header className="max-w-5xl mx-auto w-full flex items-center py-3 relative z-10">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
          Voltar à Homepage
        </Link>
      </header>

      {/* Caixa Central de Autenticação */}
      <main className="max-w-md w-full mx-auto my-auto py-6 relative z-10">
        <div className="rounded-3xl border border-white/10 bg-[#090d16]/90 backdrop-blur-2xl p-7 sm:p-9 shadow-[0_24px_80px_rgba(0,0,0,0.85)] space-y-6">
          {/* Logo e Cabeçalho */}
          <div className="flex flex-col items-center text-center space-y-3">
            <img
              src={hugLogo}
              alt="HUG Agents"
              className="size-16 rounded-2xl object-cover shadow-lg"
            />

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                HUG Agents
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                Acesso ao ambiente de atendimento e automação.
              </p>
            </div>

            {/* Alternador de Abas */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.08] w-full text-xs font-semibold">
              <button
                type="button"
                onClick={() => setModo("login")}
                className={`py-2 rounded-xl transition-all ${
                  modo === "login"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => setModo("cadastro")}
                className={`py-2 rounded-xl transition-all ${
                  modo === "cadastro"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Criar Conta
              </button>
            </div>
          </div>

          {/* Mensagem de Erro */}
          {erro && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
              {erro}
            </div>
          )}

          {/* Formulário sem Código de Empresa e sem Sobreposição */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {modo === "cadastro" && (
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-300">Seu Nome Completo</Label>
                <div className="flex items-center gap-3 h-11 px-3.5 rounded-xl border border-white/10 bg-black/40 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                  <User className="size-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Como gostaria de ser chamado"
                    className="w-full bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-300">Email de Acesso</Label>
              <div className="flex items-center gap-3 h-11 px-3.5 rounded-xl border border-white/10 bg-black/40 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                <Mail className="size-4 text-slate-400 shrink-0" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-300">Senha de Acesso</Label>
              <div className="flex items-center gap-3 h-11 px-3.5 rounded-xl border border-white/10 bg-black/40 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                <Lock className="size-4 text-slate-400 shrink-0" />
                <input
                  type={mostrarSenha ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="text-slate-500 hover:text-slate-300 transition-colors p-1"
                  title={mostrarSenha ? "Ocultar senha" : "Ver senha"}
                >
                  {mostrarSenha ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={carregando}
              className="w-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold h-11 rounded-xl text-xs gap-2 transition-all mt-3 shadow-lg shadow-emerald-500/25 active:scale-98"
            >
              {carregando ? (
                "Acessando ambiente..."
              ) : modo === "login" ? (
                <>
                  Entrar no HUG Agents
                  <ArrowRight className="size-4" />
                </>
              ) : (
                <>
                  Criar Minha Conta & Começar
                  <CheckCircle2 className="size-4" />
                </>
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
