import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { getToken, clearToken } from "@/lib/multiplex/client";
import { HugAgentsApp } from "@/components/agents/HugAgentsApp";
import { AgentsAuthView } from "@/components/agents/AgentsAuthView";

export const Route = createFileRoute("/agents")({
  head: () => ({
    meta: [
      { title: "HUG Agents — Atendimento e Vendas" },
      {
        name: "description",
        content: "Plataforma de automação e atendimento HUG.",
      },
      { property: "og:title", content: "HUG Agents" },
      {
        property: "og:description",
        content: "Plataforma de atendimento e gestão HUG.",
      },
    ],
  }),
  component: AgentsPage,
});

function AgentsPage() {
  const [autenticado, setAutenticado] = useState<boolean | null>(null);

  useEffect(() => {
    // Verifica se existe token ativo ou sessão do HUG Agents salva
    const token = getToken();
    const email = localStorage.getItem("hug_agents_user_email");
    if (token || email) {
      setAutenticado(true);
    } else {
      setAutenticado(false);
    }
  }, []);

  function handleLogout() {
    clearToken();
    localStorage.removeItem("hug_agents_user_email");
    localStorage.removeItem("hug_agents_user_name");
    setAutenticado(false);
  }

  // Enquanto avalia sessão inicial
  if (autenticado === null) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#03060a] text-xs text-slate-400">
        Carregando HUG Agents...
      </div>
    );
  }

  // Se não autenticado, apresenta a tela de login / cadastro exclusiva
  if (!autenticado) {
    return <AgentsAuthView onSuccess={() => setAutenticado(true)} />;
  }

  // Se autenticado, abre a aplicação independente HUG Agents
  return <HugAgentsApp onLogout={handleLogout} />;
}
