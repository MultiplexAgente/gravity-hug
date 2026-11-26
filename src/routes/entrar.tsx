import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Building2, Lock, Mail, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { api, setToken } from "@/lib/multiplex/client";
import hugLogo from "@/assets/hug-icon.jpg";

export const Route = createFileRoute("/entrar")({
  head: () => ({
    meta: [
      { title: "Entrar | HUG" },
      { name: "description", content: "Acesse a conta da sua empresa no HUG." },
      { property: "og:title", content: "Entrar | HUG" },
      { property: "og:description", content: "Acesse a conta da sua empresa no HUG." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [codigoEmpresa, setCodigoEmpresa] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarCodigoAvancado, setMostrarCodigoAvancado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Carrega automaticamente o código da loja salvo no dispositivo
  useEffect(() => {
    const salvo =
      localStorage.getItem("hug_codigo_loja") ||
      localStorage.getItem("hug_codigo_farmacia") ||
      "0001";
    if (salvo) setCodigoEmpresa(salvo);
  }, []);

  const handleCodigoChange = (valor: string) => {
    const limpo = valor.trim();
    setCodigoEmpresa(limpo);
    if (limpo) {
      localStorage.setItem("hug_codigo_loja", limpo);
    }
  };

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const cod = codigoEmpresa.trim() || "0001";
      localStorage.setItem("hug_codigo_loja", cod);
      
      const data = await api<{ accessToken: string }>("/api/company/login", {
        method: "POST",
        auth: false,
        body: JSON.stringify({ email: email.trim(), password, companyCode: cod }),
      });
      setToken(data.accessToken);
      await navigate({ to: "/inicio" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível entrar no HUG.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-8 relative overflow-hidden">
      {/* Luz ambiente suave de fundo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        <div className="mb-6 flex flex-col items-center justify-center text-center">
          <img
            src={hugLogo}
            alt="HUG"
            className="size-16 rounded-full object-cover shadow-lg shrink-0 mb-3"
          />
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">HUG</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Plataforma Integrada de Gestão & PDV</p>
        </div>

        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border/80 bg-card/90 backdrop-blur p-6 shadow-xl">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-foreground">Acesso ao Sistema</h2>
            <p className="text-xs text-muted-foreground">Entre com suas credenciais de acesso corporativo.</p>
          </div>

          {/* Campo de E-mail Sem Sobreposição */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              E-mail
            </Label>
            <div className="flex items-center gap-3 h-11 px-3.5 rounded-xl border border-border bg-background/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <Mail className="size-4 text-muted-foreground shrink-0" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@empresa.com"
                required
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              />
            </div>
          </div>

          {/* Campo de Senha Sem Sobreposição com Botão Visualizar */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Senha
            </Label>
            <div className="flex items-center gap-3 h-11 px-3.5 rounded-xl border border-border bg-background/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <Lock className="size-4 text-muted-foreground shrink-0" />
              <input
                id="password"
                type={mostrarSenha ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setMostrarSenha((v) => !v)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
                title={mostrarSenha ? "Ocultar senha" : "Ver senha"}
              >
                {mostrarSenha ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {/* Código da Loja Opcional/Colapsável para não poluir */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setMostrarCodigoAvancado((v) => !v)}
                className="text-[11px] text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
              >
                {mostrarCodigoAvancado ? "Ocultar código da loja" : "Informar código de unidade/loja"}
              </button>
              <span className="text-[10px] text-muted-foreground/70 font-mono">Padrão: {codigoEmpresa || "0001"}</span>
            </div>

            {mostrarCodigoAvancado && (
              <div className="flex items-center gap-3 h-10 px-3.5 rounded-xl border border-border bg-background/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all mt-1">
                <Building2 className="size-4 text-muted-foreground shrink-0" />
                <input
                  id="codigo"
                  type="text"
                  value={codigoEmpresa}
                  onChange={(e) => handleCodigoChange(e.target.value)}
                  placeholder="0001"
                  className="w-full bg-transparent font-mono text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                />
              </div>
            )}
          </div>

          {error && <p className="text-xs text-destructive bg-destructive/10 p-2.5 rounded-xl border border-destructive/20">{error}</p>}

          <Button type="submit" className="w-full h-11 font-semibold shadow-lg shadow-primary/20 rounded-xl" disabled={busy}>
            {busy ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Acessando...
              </>
            ) : (
              <>
                Entrar no HUG
                <ArrowRight className="ml-2 size-4" />
              </>
            )}
          </Button>

          <div className="text-center pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              Ainda não tem conta da sua empresa?{" "}
              <Link to="/cadastro" className="text-primary font-bold hover:underline">
                Cadastre-se aqui
              </Link>
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            className="w-full text-xs text-muted-foreground hover:text-foreground"
            onClick={() => void navigate({ to: "/" })}
          >
            Voltar para o início
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground/70">
          © 2026 <a href="https://bonasoftmt.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors underline-offset-4 hover:underline">BonaSoft</a>. Todos os direitos reservados.
        </p>
      </div>
    </main>
  );
}
