import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Building2, Lock, Mail, ArrowRight, Loader2, Phone, User, Store, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import hugLogo from "/hug-atom-icon.png";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Cadastro da Empresa | HUG" },
      { name: "description", content: "Crie a conta da sua empresa na plataforma HUG." },
      { property: "og:title", content: "Cadastro da Empresa | HUG" },
      { property: "og:description", content: "Crie a conta da sua empresa na plataforma HUG." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CadastroPage,
});

const SEGMENTOS = [
  "Farmácias & Drogarias",
  "Supermercados & Mercados",
  "Materiais & Ferramentas",
  "Moda, Roupas & Calçados",
  "Gastronomia & Restaurantes",
  "Beleza, Cosméticos & Salões",
  "Agronegócio & Campo",
  "Outro Comércio / Serviços",
];

function CadastroPage() {
  const navigate = useNavigate();
  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [segmento, setSegmento] = useState(SEGMENTOS[0]);
  const [responsavel, setResponsavel] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [concluido, setConcluido] = useState(false);

  const formatTelefone = (val: string) => {
    const limpo = val.replace(/\D/g, "");
    if (limpo.length <= 10) {
      return limpo.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim();
    }
    return limpo.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim();
  };

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 dígitos.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas informadas não coincidem.");
      return;
    }

    setBusy(true);

    try {
      localStorage.setItem("hug_empresa_nome", nomeEmpresa);
      localStorage.setItem("hug_empresa_segmento", segmento);
      localStorage.setItem("hug_gestor_nome", responsavel);
      localStorage.setItem("hug_contato_whatsapp", whatsapp);

      await new Promise((r) => setTimeout(r, 600));

      setConcluido(true);
      toast.success("Conta empresarial cadastrada com sucesso!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível concluir o cadastro.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-8 relative overflow-hidden">
      {/* Luz ambiente suave de fundo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="mb-6 flex flex-col items-center justify-center text-center">
          <img
            src={hugLogo}
            alt="HUG"
            className="size-16 rounded-full object-cover shadow-lg shrink-0 mb-3"
          />
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">HUG</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Cadastre sua empresa e conecte sua operação</p>
        </div>

        {concluido ? (
          <div className="space-y-5 rounded-2xl border border-primary/30 bg-card/90 backdrop-blur p-6 shadow-xl text-center">
            <div className="size-14 rounded-full bg-primary/10 border border-primary/30 text-primary flex items-center justify-center mx-auto">
              <CheckCircle2 className="size-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Conta Criada com Sucesso!</h2>
              <p className="text-xs text-muted-foreground mt-1">
                A empresa <strong className="text-foreground">{nomeEmpresa}</strong> foi cadastrada no HUG. Você já pode acessar sua conta utilizando seu e-mail e senha.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Button
                type="button"
                className="w-full h-11 font-semibold shadow-lg shadow-primary/20 rounded-xl"
                onClick={() => void navigate({ to: "/entrar" })}
              >
                Acessar Minha Loja (Entrar)
                <ArrowRight className="ml-2 size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full text-xs text-muted-foreground hover:text-foreground"
                onClick={() => void navigate({ to: "/" })}
              >
                Voltar para o início
              </Button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={submit}
            className="space-y-4 rounded-2xl border border-border/80 bg-card/90 backdrop-blur p-6 shadow-xl"
          >
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-foreground">Criar Conta Empresarial</h2>
              <p className="text-xs text-muted-foreground">Preencha os dados da sua empresa para iniciar.</p>
            </div>

            {/* Nome da Empresa */}
            <div className="space-y-1.5">
              <Label htmlFor="nomeEmpresa" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Nome da Empresa / Loja
              </Label>
              <div className="flex items-center gap-3 h-11 px-3.5 rounded-xl border border-border bg-background/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <Building2 className="size-4 text-muted-foreground shrink-0" />
                <input
                  id="nomeEmpresa"
                  type="text"
                  value={nomeEmpresa}
                  onChange={(e) => setNomeEmpresa(e.target.value)}
                  placeholder="Ex: Farmácia Central, Mercado Popular"
                  required
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                />
              </div>
            </div>

            {/* Segmento */}
            <div className="space-y-1.5">
              <Label htmlFor="segmento" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Segmento de Atuação
              </Label>
              <div className="flex items-center gap-3 h-11 px-3.5 rounded-xl border border-border bg-background/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <Store className="size-4 text-muted-foreground shrink-0" />
                <select
                  id="segmento"
                  value={segmento}
                  onChange={(e) => setSegmento(e.target.value)}
                  className="w-full bg-transparent text-sm text-foreground focus:outline-none"
                >
                  {SEGMENTOS.map((seg) => (
                    <option key={seg} value={seg} className="bg-popover text-popover-foreground">
                      {seg}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Responsável e WhatsApp em duas colunas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="responsavel" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Responsável
                </Label>
                <div className="flex items-center gap-3 h-11 px-3.5 rounded-xl border border-border bg-background/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                  <User className="size-4 text-muted-foreground shrink-0" />
                  <input
                    id="responsavel"
                    type="text"
                    value={responsavel}
                    onChange={(e) => setResponsavel(e.target.value)}
                    placeholder="Seu nome"
                    required
                    className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="whatsapp" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  WhatsApp
                </Label>
                <div className="flex items-center gap-3 h-11 px-3.5 rounded-xl border border-border bg-background/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                  <Phone className="size-4 text-muted-foreground shrink-0" />
                  <input
                    id="whatsapp"
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(formatTelefone(e.target.value))}
                    placeholder="(00) 00000-0000"
                    required
                    className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* E-mail */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                E-mail Comercial
              </Label>
              <div className="flex items-center gap-3 h-11 px-3.5 rounded-xl border border-border bg-background/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <Mail className="size-4 text-muted-foreground shrink-0" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contato@suaempresa.com"
                  required
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                />
              </div>
            </div>

            {/* Senha e Confirmação */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Senha
                </Label>
                <div className="flex items-center gap-2.5 h-11 px-3 rounded-xl border border-border bg-background/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                  <Lock className="size-4 text-muted-foreground shrink-0" />
                  <input
                    id="password"
                    type={mostrarSenha ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 dígitos"
                    required
                    className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha((v) => !v)}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1 shrink-0"
                    title={mostrarSenha ? "Ocultar senha" : "Ver senha"}
                  >
                    {mostrarSenha ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Confirmar Senha
                </Label>
                <div className="flex items-center gap-2.5 h-11 px-3 rounded-xl border border-border bg-background/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                  <Lock className="size-4 text-muted-foreground shrink-0" />
                  <input
                    id="confirmPassword"
                    type={mostrarSenha ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a senha"
                    required
                    className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {error && <p className="text-xs text-destructive bg-destructive/10 p-2.5 rounded-xl border border-destructive/20">{error}</p>}

            <Button type="submit" className="w-full h-11 font-semibold shadow-lg shadow-primary/20 rounded-xl" disabled={busy}>
              {busy ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Criando Conta...
                </>
              ) : (
                <>
                  Criar Conta na HUG
                  <ArrowRight className="ml-2 size-4" />
                </>
              )}
            </Button>

            <div className="text-center pt-2 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                Já possui uma conta?{" "}
                <Link to="/entrar" className="text-primary font-bold hover:underline">
                  Acessar conta (Entrar)
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
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground/70">
          © 2026{" "}
          <a
            href="https://bonasoftmt.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors underline-offset-4 hover:underline"
          >
            BonaSoft
          </a>
          . Todos os direitos reservados.
        </p>
      </div>
    </main>
  );
}
