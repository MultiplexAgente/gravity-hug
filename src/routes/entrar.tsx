import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Lock, Mail, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { api, setToken } from "@/lib/multiplex/client";
import hugLogo from "@/assets/hug-icon.jpg";

export const Route = createFileRoute("/entrar")({
  head: () => ({
    meta: [
      { title: "Entrar | HUG" },
      { name: "description", content: "Acesse sua conta no HUG." },
      { property: "og:title", content: "Entrar | HUG" },
      { property: "og:description", content: "Acesse sua conta no HUG." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const data = await api<{ accessToken: string }>("/api/company/login", {
        method: "POST",
        auth: false,
        body: JSON.stringify({ email: email.trim(), password }),
      });
      setToken(data.accessToken);
      await navigate({ to: "/inicio" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível entrar. Verifique seu e-mail e senha.");
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
        </div>

        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border/80 bg-card/90 backdrop-blur p-6 shadow-xl">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-foreground">Acesso à Sua Conta</h2>
            <p className="text-xs text-muted-foreground">Informe seu e-mail e senha de acesso.</p>
          </div>

          {/* Campo de E-mail */}
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
                placeholder="seu@email.com"
                required
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              />
            </div>
          </div>

          {/* Campo de Senha com Botão de Mostrar/Ocultar */}
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

          {error && <p className="text-xs text-destructive bg-destructive/10 p-2.5 rounded-xl border border-destructive/20">{error}</p>}

          <Button type="submit" className="w-full h-11 font-semibold shadow-lg shadow-primary/20 rounded-xl mt-2" disabled={busy}>
            {busy ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Acessando...
              </>
            ) : (
              <>
                Entrar na Conta
                <ArrowRight className="ml-2 size-4" />
              </>
            )}
          </Button>

          <div className="text-center pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              Ainda não tem conta?{" "}
              <Link to="/cadastro" className="text-primary font-bold hover:underline">
                Criar uma conta
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
