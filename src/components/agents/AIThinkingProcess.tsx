import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, CheckCircle2, Loader2, ArrowRight } from "lucide-react";

export interface ThinkingStep {
  label: string;
  detalhes?: string;
  status: "concluido" | "em_andamento" | "pendente";
  duracao?: string;
}

interface LiveThinkingProps {
  emAndamento: true;
  etapasIniciais?: string[];
  titulo?: string;
  onFinalizado?: (tempoTotal: number, etapas: ThinkingStep[]) => void;
}

interface CompletedThinkingProps {
  emAndamento: false;
  tempoTotal: number;
  etapas: ThinkingStep[];
  titulo?: string;
}

type Props = LiveThinkingProps | CompletedThinkingProps;

export function AIThinkingProcess(props: Props) {
  const [expandido, setExpandido] = useState<boolean>(props.emAndamento);
  const [tempoSegundos, setTempoSegundos] = useState<number>(
    props.emAndamento ? 0 : props.tempoTotal || 0
  );

  const [etapas, setEtapas] = useState<ThinkingStep[]>(() => {
    if (!props.emAndamento) {
      return props.etapas || [];
    }
    const listaInicial = props.etapasIniciais && props.etapasIniciais.length > 0
      ? props.etapasIniciais
      : [
          "Analisando mensagem e contexto",
          "Consultando diretrizes e regras do agente",
          "Executando raciocínio com HUG IA Core",
          "Formulando resposta",
        ];

    return listaInicial.map((label, idx) => ({
      label,
      status: idx === 0 ? "em_andamento" : "pendente",
    }));
  });

  // 1. Cronômetro ao vivo enquanto está processando
  useEffect(() => {
    if (!props.emAndamento) return;

    const inicio = Date.now();
    const interval = setInterval(() => {
      const decorrido = Math.floor((Date.now() - inicio) / 1000);
      setTempoSegundos(decorrido);
    }, 1000);

    return () => clearInterval(interval);
  }, [props.emAndamento]);

  // 2. Progressão orgânica das etapas durante a execução
  useEffect(() => {
    if (!props.emAndamento) return;

    const intervalEtapas = setInterval(() => {
      setEtapas((atuais) => {
        const idxAtual = atuais.findIndex((e) => e.status === "em_andamento");
        if (idxAtual === -1) return atuais;

        if (idxAtual < atuais.length - 1) {
          const novas = [...atuais];
          novas[idxAtual] = { ...novas[idxAtual], status: "concluido" };
          novas[idxAtual + 1] = { ...novas[idxAtual + 1], status: "em_andamento" };
          return novas;
        }

        return atuais;
      });
    }, 1200);

    return () => clearInterval(intervalEtapas);
  }, [props.emAndamento]);

  const tituloExibido = props.emAndamento
    ? `${props.titulo || "Exploring"} ${tempoSegundos}s`
    : `Pensou por ${tempoSegundos}s`;

  return (
    <div className="text-xs my-2 select-none font-sans">
      {/* Linha de Cabeçalho do Accordion (ex: "Exploring 34s ⌄" ou "Pensou por 4s ⌄") */}
      <button
        type="button"
        onClick={() => setExpandido(!expandido)}
        className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors py-1 group font-medium"
      >
        <span className="text-slate-300 font-mono tracking-tight">{tituloExibido}</span>
        <ChevronDown
          className={`size-3.5 text-slate-500 group-hover:text-slate-300 transition-transform duration-200 ${
            expandido ? "rotate-0" : "-rotate-90"
          }`}
        />
      </button>

      {/* Conteúdo Expansível com as etapas detalhadas */}
      {expandido && (
        <div className="pl-3 border-l border-white/10 my-2 space-y-2 py-0.5 animate-in fade-in duration-200">
          {etapas.map((etapa, idx) => {
            const isConcluido = etapa.status === "concluido";
            const isEmAndamento = etapa.status === "em_andamento";

            return (
              <div
                key={idx}
                className="flex items-center justify-between text-xs group cursor-default"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`truncate transition-colors ${
                      isEmAndamento
                        ? "text-emerald-400 font-medium"
                        : isConcluido
                        ? "text-slate-400"
                        : "text-slate-600"
                    }`}
                  >
                    {etapa.label}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-500 shrink-0 ml-2">
                  {isConcluido && (
                    <ChevronRight className="size-3 text-slate-500 group-hover:text-slate-300 transition-colors" />
                  )}
                  {isEmAndamento && (
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-ping mr-1" />
                  )}
                </div>
              </div>
            );
          })}

          {/* Linha de Status de Trabalho Atual */}
          {props.emAndamento && (
            <div className="pt-1 flex items-center gap-2 text-slate-400 font-medium">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[11px] text-slate-300">Working</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
