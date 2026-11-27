import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
        throw new Error("Preencha email e senha.");
      }

      const tokenSintetico = `hug_${Date.now()}_${btoa(email.trim())}`;
      setToken(tokenSintetico);

      localStorage.setItem("hug_agents_user_email", email.trim().toLowerCase());
      localStorage.setItem("hug_agents_user_name", nome.trim() || email.trim().split("@")[0] || "Usuário");

      if (modo === "login") {
        toast.success("Bem-vindo ao HUG!");
      } else {
        toast.success("Conta criada!");
      }

      onSuccess();
    } catch (err: any) {
      setErro(err?.message || "Erro ao autenticar.");
      toast.error(err?.message || "Falha na autenticação.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#03060a] text-white flex flex-col justify-between p-4 sm:p-6 selection:bg-emerald-500/30 selection:text-emerald-200 relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-gradient-to-tr from-emerald-600/15 via-teal-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Barra Superior */}
      <header className="max-w-5xl mx-auto w-full flex items-center py-3 relative z-10">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
          Voltar
        </Link>
      </header>

      {/* Caixa Central de Autenticação */}
      <main className="max-w-md w-full mx-auto my-auto py-6 relative z-10">
        <div className="rounded-3xl border border-white/10 bg-[#090d16]/90 backdrop-blur-2xl p-7 sm:p-9 shadow-[0_24px_80px_rgba(0,0,0,0.85)] space-y-6">
          {/* Logo e Cabeçalho */}
          <div className="flex flex-col items-center text-center space-y-3">
            <img
              src="/hug-atom-icon.png"
              alt="HUG"
              className="size-16 rounded-2xl object-contain shadow-lg"
            />

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                HUG
              </h1>
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

          {/* Formulário Limpo e Direto */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {modo === "cadastro" && (
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-300">Nome</Label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full h-11 px-3.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-300">Email</Label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full h-11 px-3.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-300">Senha</Label>
              <div className="relative flex items-center h-11 px-3.5 rounded-xl border border-white/10 bg-black/40 focus-within:border-emerald-500 transition-all">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full !bg-transparent !border-0 !p-0 !outline-none !shadow-none !ring-0 text-sm text-white placeholder:text-slate-500 leading-normal tracking-wide"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="text-slate-400 hover:text-white transition-colors p-1 shrink-0"
                  title={mostrarSenha ? "Ocultar" : "Mostrar"}
                >
                  {mostrarSenha ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={carregando}
              className="w-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold h-11 rounded-xl text-xs transition-all mt-3 shadow-lg shadow-emerald-500/25 active:scale-98"
            >
              {carregando ? "Carregando..." : modo === "login" ? "Entrar" : "Criar Conta"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
