import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  ArrowUp,
  Plus,
  ChevronRight,
  Check,
  ShoppingBag,
  Layers,
  MessageSquare,
  Store,
  Smartphone,
  Laptop,
  Globe,
  Radio,
  CheckCheck,
  Copy,
  RotateCcw,
  Image as ImageIcon,
  Camera,
  Mic,
  MicOff,
  Trash2,
  Play,
  Pause,
  Square,
  X,
  Paperclip,
} from "lucide-react";
import horizon from "@/assets/hero-horizon.jpg";
import monolith from "@/assets/monolith.jpg";
import hugLogo from "@/assets/hug-icon.jpg";
import { BonaParticleAtom } from "@/components/bonasoft/BonaLogo";
import { SmoothScroll } from "@/components/cinematic/SmoothScroll";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HUG — Gestão Empresarial Integrada" },
      {
        name: "description",
        content:
          "HUG — Vendas, gestão, ponto de venda, catálogo e inteligência comercial integrados em uma única plataforma.",
      },
      { property: "og:title", content: "HUG — Gestão Empresarial Integrada" },
      {
        property: "og:description",
        content:
          "Vendas, estoque, gestão empresarial e inteligência comercial integrados pelo HUG.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const ease = [0.16, 1, 0.3, 1] as const;

export const BONASOFT_WEBSITE_URL = "https://bonasoftmt.com";

/**
 * Manipulador universal de clique para abrir o site oficial da BonaSoft (https://bonasoftmt.com)
 */
export function openBonaSoftWebsite(e?: React.SyntheticEvent) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  const url = BONASOFT_WEBSITE_URL;
  try {
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win || win.closed || typeof win.closed === "undefined") {
      window.location.href = url;
    }
  } catch {
    window.location.href = url;
  }
}

const BONASOFT_WHATSAPP_NUMBER = "556692734632";
const getBonaSoftWhatsAppUrl = (mensagem: string) =>
  `https://wa.me/${BONASOFT_WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;

// 1. Narrativa Contínua dos Pilares Operacionais (Sem formato de cards, composições amplas)
const NARRATIVE_PILLARS = [
  {
    title: "Venda em qualquer frente.",
    subtitle: "Do balcão físico ao catálogo online e canais de mensagem.",
    description:
      "Uma frente de caixa instantânea com leitor de código de barras, pagamentos ágeis e sincronia em tempo real com pedidos digitais.",
    highlights: [
      "PDV ágil com resposta em menos de um segundo",
      "Catálogo digital sincronizado com o estoque físico",
      "Emissão rápida de comprovantes e documentos fiscais",
    ],
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=85",
  },
  {
    title: "Controle absoluto em tempo real.",
    subtitle: "Estoque, clientes e faturamento sem planilhas soltas.",
    description:
      "Cada venda realizada atualiza imediatamente a disponibilidade dos produtos. Acompanhe entradas, saídas, margens e histórico de compra de cada cliente.",
    highlights: [
      "Baixa automática de estoque multi-canal",
      "Histórico detalhado e preferências dos clientes",
      "Fluxo de caixa diário consolidado sem retrabalho",
    ],
    image:
      "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1600&q=85",
  },
  {
    title: "Do campo ao armazém em tempo real.",
    subtitle: "Fazendas, safras, silos e faturamento rural sem dispersão.",
    description:
      "Gerencie o ciclo produtivo da semeadura à colheita. Monitore pesagens na balança rodoviária, controle de umidade e classificação de grãos, estocagem em silos e armazéns e acompanhe custos operacionais por talhão em tempo real.",
    highlights: [
      "Controle de safras, talhões e custo operacional por hectare",
      "Pesagem em balança rodoviária, classificação e estocagem em silos",
      "Rastreabilidade de insumos, contratos de grãos e fluxo financeiro rural",
    ],
    image:
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=85",
  },
  {
    title: "Inteligência que entende o seu negócio.",
    subtitle: "Uma assistente conectada à realidade dos seus dados.",
    description:
      "Tire dúvidas rápidas sobre o catálogo, consulte disponibilidade em estoque e receba sugestões objetivas de atendimento para o seu time de vendas.",
    highlights: [
      "Consulta instantânea de produtos por conversa",
      "Sugestões de resposta a dúvidas com AI Gateway",
      "Agilidade operacional sem interfaces complicadas",
    ],
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=85",
  },
];

// 2. Ecossistema Comercial HUG (Apresentação Editorial)
const ECOSYSTEM_MODULES = [
  {
    id: "gestao",
    name: "HUG Gestão",
    label: "Gestão Empresarial",
    icon: Laptop,
    description:
      "Visão centralizada de faturamento, controle financeiro, compras e relatórios consolidados para matriz e filiais.",
  },
  {
    id: "pos",
    name: "HUG POS",
    label: "Ponto de Venda",
    icon: Store,
    description:
      "Frente de caixa rápida com suporte a leitor de código de barras, teclado de atalho e múltiplos caixas simultâneos.",
  },
  {
    id: "app",
    name: "HUG Mobile",
    label: "Aplicativo",
    icon: Smartphone,
    description:
      "Mobilidade total para atendimento em salão, consulta de preços no balcão e auditoria de inventário pelo celular.",
  },
  {
    id: "store",
    name: "HUG Store",
    label: "Loja Virtual",
    icon: Globe,
    description:
      "Catálogo público digital integrado ao estoque físico para pedidos com retirada no balcão ou entrega rápida.",
  },
  {
    id: "intelligence",
    name: "HUG I.A.",
    label: "I.A.",
    icon: MessageSquare,
    description:
      "Assistente para tirar dúvidas de clientes, consultar o catálogo em linguagem natural e apoiar o dia a dia do lojista.",
  },
];

// 3. Segmentos Comerciais com Fotografia Editorial
const COMMERCIAL_SECTORS = [
  {
    id: "materiais",
    name: "Materiais",
    title: "Materiais, Papelarias, Livrarias & Ferramentas",
    narrative:
      "Venda ágil no balcão e encomendas, busca instantânea por SKU, EAN ou ISBN, cálculo com conversão fracionada de unidades (m², kg, metro linear, resma, pacote, caixa), controle rigoroso de estoque e expedição com rotas de entrega.",
    kpi: "Balcão & Encomendas · SKU, ISBN & Fracionado",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=85",
  },
  {
    id: "mercado",
    name: "Mercados",
    title: "Supermercados & Mercearias",
    narrative:
      "Checkout de alta rotação, integração com balanças e sincronia com múltiplos caixas simultâneos.",
    kpi: "Operação Rápida · < 1.2s por Item",
    image:
      "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1600&q=85",
  },
  {
    id: "moda",
    name: "Moda",
    title: "Moda & Vestuário",
    narrative:
      "Grade multidimensional de cores e tamanhos com catálogo de coleções sincronizado em tempo real.",
    kpi: "Grade Matricial · Estoque Unificado",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=85",
  },
  {
    id: "restaurante",
    name: "Gastronomia",
    title: "Restaurantes & Bares",
    narrative:
      "Comandas eletrônicas, mesas sincronizadas e baixa automática de estoque por ficha técnica dos pratos.",
    kpi: "Salão & Cozinha · Sincronia Instantânea",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=85",
  },
  {
    id: "beleza",
    name: "Beleza",
    title: "Salões & Estética",
    narrative:
      "Agenda integrada por profissional, cálculo automático de comissões e histórico de atendimentos.",
    kpi: "Comissão Automática · Gestão de Agenda",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=85",
  },
  {
    id: "farmacia",
    name: "Farmácias",
    title: "Farmácias & Drogarias",
    narrative:
      "Rastreabilidade completa de lotes, controle de validades e retenção rigorosa de receituário.",
    kpi: "Rastreio Unitário · 100% Auditado",
    image:
      "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=1600&q=85",
  },
  {
    id: "agro",
    name: "Agro",
    title: "Fazendas, Safras, Armazéns & Silos",
    narrative:
      "Gerencie fazendas, safras, operações agrícolas, armazéns e silos em uma única plataforma. Gestão operacional, controle financeiro e dados em tempo real para decisões mais eficientes no campo e na armazenagem.",
    kpi: "Campo ao Armazém · Rastreabilidade Integral",
    image:
      "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=1600&q=85",
  },
];

// 4. Planos Oficiais Aprovados
const APPROVED_PLANS = [
  {
    name: "Starter",
    price: "99,00",
    tagline: "Para comércios e lojas que buscam agilidade no balcão e presença online.",
    features: [
      "Frente de caixa (PDV) ágil",
      "Catálogo online integrado",
      "Controle de estoque e vendas",
      "Gestão de clientes e histórico",
    ],
  },
  {
    name: "Business",
    price: "199,00",
    featured: true,
    tagline: "Para negócios em crescimento que necessitam de multicanalidade e inteligência.",
    features: [
      "Todos os recursos do Starter",
      "Operação multicanal (balcão + web)",
      "Assistente HUG I.A. para consulta e respostas",
      "Controle de múltiplos caixas",
      "Relatórios detalhados de faturamento",
    ],
  },
  {
    name: "Premium",
    price: "399,00",
    tagline: "Para empresas com alto volume operacional, múltiplas filiais e equipes ampliadas.",
    features: [
      "Todos os recursos do Business",
      "Multi-filiais e estoques conectados",
      "Acesso prioritário ao HUG I.A.",
      "Auditoria avançada e conciliação",
      "Suporte técnico prioritário",
    ],
  },
];

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1.1, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Cartão de apresentação com acabamento sofisticado
 */
function InteractiveTiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Interface Conversacional Completa da HUG I.A no Hero
 * Inspirada na usabilidade e fluidez do ChatGPT, com a identidade visual exclusiva da HUG.
 * - Mensagens do usuário alinhadas à direita
 * - Respostas da HUG I.A alinhadas à esquerda com avatar oficial
 * - Histórico vertical com rolagem independente e auto-scroll
 * - Ações sobre mensagens (copiar com feedback, feedback positivo/negativo)
 * - Composer fixo na parte inferior com textarea expansível e gradiente de fundo
 * - Estado inicial limpo com "como posso te ajudar?" e "vamos começar"
 */
interface ImagemAnexada {
  id: string;
  name: string;
  type: string;
  dataUrl: string;
}

interface AudioAnexado {
  dataUrl: string;
  mimeType: string;
  durationSeconds: number;
}

interface ChatMessage {
  id: string;
  sender: "user" | "hug";
  text: string;
  timestamp: string;
  images?: ImagemAnexada[];
  audio?: AudioAnexado;
  transcription?: string;
}

function HugAiHeroTester() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pergunta, setPergunta] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Estados multimodais (Imagens e Áudio)
  const [imagens, setImagens] = useState<ImagemAnexada[]>([]);
  const [menuAnexosAberto, setMenuAnexosAberto] = useState(false);
  const [gravandoAudio, setGravandoAudio] = useState(false);
  const [tempoGravacao, setTempoGravacao] = useState(0);
  const [audioGravado, setAudioGravado] = useState<AudioAnexado | null>(null);
  const [audioTocandoId, setAudioTocandoId] = useState<string | null>(null);

  // Refs de controle
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerGravacaoRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const isAtBottomRef = useRef(true);

  const exemplos = [
    "Qual o valor dos planos da plataforma?",
    "Quem te desenvolveu?",
    "Quais segmentos você atende?",
    "Qual a diferença entre Starter e Business?",
    "Você consegue gerenciar uma farmácia?",
  ];

  // Monitora a posição de rolagem interna do chat
  function handleChatScroll() {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    isAtBottomRef.current = scrollHeight - scrollTop - clientHeight < 80;
  }

  // Rola EXCLUSIVAMENTE o container interno do chat quando o usuário está no fim
  // Sem jamais movimentar a janela do usuário (window)
  useEffect(() => {
    if (chatContainerRef.current && isAtBottomRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, carregando]);

  // Hook auxiliar para automação / testes da interface
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__enviarHugPergunta = handleEnviar;
    }
  }, [pergunta, imagens, audioGravado, carregando]);

  // Ajusta dinamicamente a altura do textarea conforme o usuário digita
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [pergunta]);

  // Limpa o timer de gravação se desmontar
  useEffect(() => {
    return () => {
      if (timerGravacaoRef.current) clearInterval(timerGravacaoRef.current);
    };
  }, []);

  function getHoraAtual() {
    const agora = new Date();
    return agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }

  function formatarSegundos(segundos: number) {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  // Manipulação de arquivos de imagem
  function handleSelectFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setMenuAnexosAberto(false);

    const arquivosArray = Array.from(files);
    arquivosArray.forEach((file) => {
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (!dataUrl) return;

        setImagens((prev) => [
          ...prev,
          {
            id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            name: file.name,
            type: file.type,
            dataUrl,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    // Reseta inputs para permitir selecionar o mesmo arquivo novamente se quiser
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  }

  function handleRemoverImagem(id: string) {
    setImagens((prev) => prev.filter((img) => img.id !== id));
  }

  // Gravação de Áudio via MediaRecorder
  async function handleIniciarGravacao() {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Seu navegador não suporta gravação de áudio.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : "";

      const options = mimeType ? { mimeType } : undefined;
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        // Encerra todas as faixas do microfone para liberar o hardware
        stream.getTracks().forEach((track) => track.stop());

        const finalMime = mediaRecorder.mimeType || "audio/webm";
        const audioBlob = new Blob(audioChunksRef.current, { type: finalMime });

        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          if (dataUrl) {
            setAudioGravado({
              dataUrl,
              mimeType: finalMime,
              durationSeconds: tempoGravacao,
            });
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start(200); // Coleta a cada 200ms
      setGravandoAudio(true);
      setTempoGravacao(0);

      if (timerGravacaoRef.current) clearInterval(timerGravacaoRef.current);
      timerGravacaoRef.current = setInterval(() => {
        setTempoGravacao((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error("[Erro ao acessar microfone]:", err);
      alert("Permissão de microfone necessária para gravar áudio.");
    }
  }

  function handlePararGravacao() {
    if (timerGravacaoRef.current) {
      clearInterval(timerGravacaoRef.current);
      timerGravacaoRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setGravandoAudio(false);
  }

  function handleCancelarGravacao() {
    if (timerGravacaoRef.current) {
      clearInterval(timerGravacaoRef.current);
      timerGravacaoRef.current = null;
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.ondataavailable = null;
      mediaRecorderRef.current.onstop = null;
      if (mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      mediaRecorderRef.current.stream?.getTracks().forEach((t) => t.stop());
    }
    audioChunksRef.current = [];
    setGravandoAudio(false);
    setTempoGravacao(0);
  }

  function handleDescartarAudioGravado() {
    setAudioGravado(null);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
  }

  // Reprodução de áudio gravado (preview ou na mensagem)
  function handleToggleAudio(audioUrl: string, id: string) {
    if (audioTocandoId === id) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      setAudioTocandoId(null);
    } else {
      if (!audioPlayerRef.current) {
        audioPlayerRef.current = new Audio();
        audioPlayerRef.current.onended = () => setAudioTocandoId(null);
      }
      audioPlayerRef.current.src = audioUrl;
      audioPlayerRef.current.play().then(() => {
        setAudioTocandoId(id);
      }).catch((e) => console.error("Erro ao tocar áudio:", e));
    }
  }

  // Consulta multimodal ao HUG IA Core
  async function consultarHugIaCore(
    query: string,
    historicoAtual: ChatMessage[],
    imagensEnviar: ImagemAnexada[],
    audioEnviar: AudioAnexado | null
  ): Promise<{ reply: string; transcription?: string }> {
    try {
      const payloadHistory = historicoAtual.slice(-8).map((m) => ({
        role: m.sender === "user" ? ("user" as const) : ("assistant" as const),
        content: m.text,
      }));

      const res = await fetch("/api/ai/public-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: payloadHistory,
          images: imagensEnviar.map((img) => ({
            name: img.name,
            type: img.type,
            dataUrl: img.dataUrl,
          })),
          audio: audioEnviar
            ? {
                dataUrl: audioEnviar.dataUrl,
                mimeType: audioEnviar.mimeType,
              }
            : undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.ok && data.reply && data.reply.trim().length > 0) {
          return {
            reply: data.reply.trim(),
            transcription: data.transcription,
          };
        }
        if (data.error) {
          return { reply: `Não foi possível obter resposta da HUG I.A: ${data.error}` };
        }
      }
    } catch (err: any) {
      console.error("[HUG I.A Core Gateway Error]:", err);
    }

    return {
      reply: "Não foi possível conectar ao motor HUG IA Core no momento. Por favor, tente novamente em instantes.",
    };
  }

  function handleEnviar(textoCustom?: string) {
    const textoFinal = (textoCustom || pergunta).trim();
    const temImagens = imagens.length > 0;
    const temAudio = !!audioGravado;

    if ((!textoFinal && !temImagens && !temAudio) || carregando) return;

    // Se estiver gravando áudio no momento, interrompe para envio
    if (gravandoAudio) {
      handlePararGravacao();
    }

    const imagensParaEnviar = [...imagens];
    const audioParaEnviar = audioGravado ? { ...audioGravado } : null;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      sender: "user",
      text: textoFinal || (temAudio ? "Mensagem em áudio" : "Imagem anexada"),
      timestamp: getHoraAtual(),
      images: temImagens ? imagensParaEnviar : undefined,
      audio: audioParaEnviar || undefined,
    };

    const novoHistorico = [...messages, userMsg];
    setMessages(novoHistorico);
    setPergunta("");
    setImagens([]);
    setAudioGravado(null);
    setCarregando(true);
    isAtBottomRef.current = true;

    // Rola o container interno sem interferir na página
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 10);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Chama o HUG IA Core em tempo real através da rota multimodal oficial /api/ai/public-chat
    consultarHugIaCore(textoFinal, messages, imagensParaEnviar, audioParaEnviar).then((resultado) => {
      const hugMsg: ChatMessage = {
        id: `hug-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        sender: "hug",
        text: resultado.reply,
        transcription: resultado.transcription,
        timestamp: getHoraAtual(),
      };

      setMessages((prev) => [...prev, hugMsg]);
      setCarregando(false);
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEnviar();
    }
  }

  function handleCopiar(msgId: string, texto: string) {
    navigator.clipboard.writeText(texto).then(() => {
      setCopiedId(msgId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }

  function handleLimparConversa() {
    setMessages([]);
    setPergunta("");
    setImagens([]);
    setAudioGravado(null);
    setCarregando(false);
  }

  const isConversando = messages.length > 0;
  const podeEnviar = !carregando && (pergunta.trim().length > 0 || imagens.length > 0 || audioGravado !== null);

  return (
    <div className="w-full max-w-2xl sm:max-w-3xl mx-auto mt-6 sm:mt-12 px-2 sm:px-3">
      {/* Inputs Ocultos para Upload de Arquivos e Câmera */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        multiple
        className="hidden"
        onChange={(e) => handleSelectFiles(e.target.files)}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleSelectFiles(e.target.files)}
      />

      {/* 
        ESTADO INICIAL: Título limpo e convidativo
        Desaparece suavemente quando o usuário inicia a conversa
      */}
      <AnimatePresence>
        {!isConversando && (
          <motion.h3
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.4 }}
            className="text-lg sm:text-3xl font-light text-white/90 tracking-tight mb-3 sm:mb-5 text-center lowercase select-none overflow-hidden"
          >
            como posso te ajudar?
          </motion.h3>
        )}
      </AnimatePresence>

      {/* 
        ÁREA DE CONVERSA PRINCIPAL (100% Preto Sólido, Zero Transparência, Alto Contraste)
      */}
      {isConversando && (
        <div
          className="mb-3 sm:mb-4 rounded-3xl border border-[#262626] bg-[#000000] shadow-[0_24px_60px_-12px_rgba(0,0,0,1)] overflow-hidden flex flex-col"
          style={{ backgroundColor: "#000000", opacity: 1 }}
        >
          {/* Cabeçalho minimalista da conversa (sem badge Online) */}
          <div
            className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-[#1c1c1c] bg-[#000000]"
            style={{ backgroundColor: "#000000" }}
          >
            <div className="flex items-center gap-2.5">
              <img
                src={hugLogo}
                alt="HUG I.A"
                className="h-6 w-6 rounded-full object-cover"
              />
              <span className="text-sm font-medium text-white tracking-tight">HUG I.A</span>
            </div>

            {/* Ação de Reiniciar/Limpar conversa */}
            <button
              type="button"
              onClick={handleLimparConversa}
              className="inline-flex items-center gap-1.5 text-xs text-[#a0a0a0] hover:text-white transition-colors px-2.5 py-1.5 rounded-lg hover:bg-[#1a1a1a] active:scale-95"
              title="Iniciar uma nova conversa"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Nova conversa</span>
            </button>
          </div>

          {/* Lista de Mensagens estilo ChatGPT com fundo 100% preto sólido */}
          <div
            ref={chatContainerRef}
            onScroll={handleChatScroll}
            data-lenis-prevent="true"
            style={{ overscrollBehavior: "contain", backgroundColor: "#000000", opacity: 1 }}
            className="max-h-[420px] sm:max-h-[520px] overflow-y-auto px-4 sm:px-6 py-5 sm:py-6 space-y-5 sm:space-y-6 scrollbar-thin scrollbar-thumb-[#262626] overscroll-contain bg-[#000000]"
          >
            {messages.map((msg) => {
              const isUser = msg.sender === "user";

              if (isUser) {
                return (
                  <div key={msg.id} className="flex justify-end">
                    <div className="max-w-[85%] sm:max-w-[75%] rounded-[22px] rounded-br-[6px] bg-[#1f1f1f] border border-[#333333] px-4.5 py-2.5 sm:py-3 text-sm sm:text-[15px] text-white shadow-sm space-y-2">
                      {/* Imagens anexadas pelo usuário */}
                      {msg.images && msg.images.length > 0 && (
                        <div className="flex flex-wrap gap-2 pb-1">
                          {msg.images.map((img) => (
                            <img
                              key={img.id}
                              src={img.dataUrl}
                              alt={img.name}
                              className="h-20 w-20 sm:h-24 sm:w-24 object-cover rounded-xl border border-white/10"
                            />
                          ))}
                        </div>
                      )}

                      {/* Áudio anexado pelo usuário */}
                      {msg.audio && (
                        <div className="flex items-center gap-2.5 bg-[#2a2a2a] px-3 py-1.5 rounded-full border border-white/10">
                          <button
                            type="button"
                            onClick={() => msg.audio && handleToggleAudio(msg.audio.dataUrl, msg.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black hover:bg-white/90 transition-colors"
                          >
                            {audioTocandoId === msg.id ? (
                              <Pause className="h-3.5 w-3.5" />
                            ) : (
                              <Play className="h-3.5 w-3.5 ml-0.5" />
                            )}
                          </button>
                          <span className="text-xs text-white/80 font-mono">
                            {formatarSegundos(msg.audio.durationSeconds || 0)}
                          </span>
                        </div>
                      )}

                      {/* Texto digitado */}
                      {msg.text && (
                        <p className="whitespace-pre-line leading-relaxed font-normal">{msg.text}</p>
                      )}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className="flex items-start gap-3 sm:gap-3.5 justify-start"
                >
                  <img
                    src={hugLogo}
                    alt="HUG I.A"
                    className="h-6 w-6 sm:h-7 sm:w-7 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className="flex-1 min-w-0 max-w-[95%] text-left">
                    {/* Exibe transcrição de áudio se retornada */}
                    {msg.transcription && (
                      <div className="mb-2 text-xs text-[#00D6A0] bg-[#00D6A0]/10 border border-[#00D6A0]/20 px-2.5 py-1 rounded-md inline-block">
                        Áudio ouvido: "{msg.transcription}"
                      </div>
                    )}

                    {/* Texto puro em branco de alto contraste direto no fundo preto */}
                    <div className="text-white text-sm sm:text-[15px] leading-relaxed select-text font-normal whitespace-pre-line">
                      {msg.text}
                    </div>

                    {/* Barra de ações discretas abaixo da resposta: apenas Copiar */}
                    <div className="mt-2.5 flex items-center gap-2 text-[#8e8e8e]">
                      {/* Botão Copiar */}
                      <button
                        type="button"
                        onClick={() => handleCopiar(msg.id, msg.text)}
                        className="p-1.5 rounded-md hover:bg-[#1f1f1f] hover:text-white transition-colors"
                        title="Copiar resposta"
                      >
                        {copiedId === msg.id ? (
                          <Check className="h-4 w-4 text-[#00D6A0]" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Indicador de Digitando estilo ChatGPT */}
            {carregando && (
              <div className="flex items-start gap-3.5">
                <img
                  src={hugLogo}
                  alt="HUG I.A"
                  className="h-6 w-6 sm:h-7 sm:w-7 rounded-full object-cover shrink-0 mt-0.5"
                />
                <div className="flex items-center gap-1.5 py-2 text-[#8e8e8e]">
                  <span className="h-2 w-2 rounded-full bg-[#8e8e8e] animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 rounded-full bg-[#8e8e8e] animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 rounded-full bg-[#8e8e8e] animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 
        COMPOSER MULTIMODAL ESTILO CHATGPT (100% Preto Sólido, Zero Transparência)
      */}
      <div className="relative w-full">
        {/* Menu Flutuante de Anexos (+) */}
        <AnimatePresence>
          {menuAnexosAberto && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full left-0 mb-3 z-30 w-52 rounded-2xl border border-[#333333] bg-[#1a1a1a] p-1.5 shadow-[0_16px_36px_rgba(0,0,0,0.9)]"
            >
              <button
                type="button"
                onClick={() => {
                  setMenuAnexosAberto(false);
                  fileInputRef.current?.click();
                }}
                className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white hover:bg-[#262626] transition-colors"
              >
                <ImageIcon className="h-4 w-4 text-[#a0a0a0]" />
                <span>Fotos e Imagens</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuAnexosAberto(false);
                  cameraInputRef.current?.click();
                }}
                className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white hover:bg-[#262626] transition-colors"
              >
                <Camera className="h-4 w-4 text-[#a0a0a0]" />
                <span>Tirar Foto / Câmera</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prévia de Imagens Anexadas antes do Envio */}
        {imagens.length > 0 && (
          <div className="mb-2 flex items-center gap-2.5 overflow-x-auto px-2 py-1 scrollbar-none">
            {imagens.map((img) => (
              <div key={img.id} className="relative group shrink-0">
                <img
                  src={img.dataUrl}
                  alt={img.name}
                  className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-2xl border border-[#444444]"
                />
                <button
                  type="button"
                  onClick={() => handleRemoverImagem(img.id)}
                  title="Remover imagem"
                  className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/90 text-white border border-[#444444] hover:bg-rose-600 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Prévia de Áudio Gravado antes do Envio */}
        {audioGravado && !gravandoAudio && (
          <div className="mb-2.5 flex items-center justify-between rounded-2xl border border-[#333333] bg-[#1a1a1a] px-4 py-2">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleToggleAudio(audioGravado.dataUrl, "preview-audio")}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black hover:bg-white/90 transition-colors"
              >
                {audioTocandoId === "preview-audio" ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4 ml-0.5" />
                )}
              </button>
              <div className="text-left">
                <p className="text-xs font-medium text-white">Áudio gravado</p>
                <p className="text-[11px] text-[#8e8e8e] font-mono">
                  {formatarSegundos(audioGravado.durationSeconds)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDescartarAudioGravado}
              title="Descartar áudio"
              className="p-1.5 text-[#8e8e8e] hover:text-rose-400 transition-colors rounded-lg"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Barra de Composição Principal */}
        <div
          className="relative rounded-full border border-[#333333] bg-[#141414] shadow-[0_12px_40px_rgba(0,0,0,0.95)] transition-all duration-200 focus-within:border-[#555555] px-3 sm:px-4 py-2 sm:py-2.5"
          style={{ backgroundColor: "#141414", opacity: 1 }}
        >
          {gravandoAudio ? (
            /* Modo Ativo de Gravação de Áudio com Timer e Cancelar/Concluir */
            <div className="flex items-center justify-between w-full h-8 sm:h-9 px-1">
              <div className="flex items-center gap-2.5">
                <span className="h-3 w-3 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-xs sm:text-sm font-medium text-white">Gravando áudio...</span>
                <span className="text-xs sm:text-sm font-mono text-[#00D6A0] font-semibold">
                  {formatarSegundos(tempoGravacao)}
                </span>
              </div>

              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  type="button"
                  onClick={handleCancelarGravacao}
                  title="Cancelar gravação"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#262626] text-[#b4b4b4] hover:bg-rose-950 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handlePararGravacao}
                  title="Concluir áudio"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00D6A0] text-black hover:bg-[#00D6A0]/90 font-medium transition-colors"
                >
                  <Check className="h-4 w-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          ) : (
            /* Modo Normal de Composição: Botão (+), Botão Imagem, Textarea, Microfone e Enviar */
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Botão de Anexos (+) Estilo ChatGPT */}
              <button
                type="button"
                onClick={() => setMenuAnexosAberto((prev) => !prev)}
                title="Adicionar fotos, câmera ou arquivos"
                aria-label="Opções de anexo"
                className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
                  menuAnexosAberto
                    ? "bg-white text-black"
                    : "bg-[#262626] hover:bg-[#333333] text-[#b4b4b4] hover:text-white"
                }`}
              >
                <Plus className={`h-4 w-4 sm:h-5 sm:w-5 stroke-[2] transition-transform ${menuAnexosAberto ? "rotate-45" : ""}`} />
              </button>

              {/* Botão Direto de Selecionar Imagem */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Anexar imagem"
                className="hidden sm:flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-[#262626] hover:bg-[#333333] text-[#b4b4b4] hover:text-white transition-colors"
              >
                <ImageIcon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
              </button>

              {/* Campo Textarea Expansível SEM caixa interna ou bordas herdadas */}
              <div className="relative flex-1 min-w-0 flex items-center px-1">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={pergunta}
                  onChange={(e) => setPergunta(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Pergunte à HUG I.A..."
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    boxShadow: "none",
                    padding: "0",
                    borderRadius: "0",
                  }}
                  className="w-full resize-none !bg-transparent !border-0 !border-none !outline-none !shadow-none !p-0 !rounded-none text-sm sm:text-base text-white placeholder:text-[#8e8e8e] leading-relaxed max-h-36 overflow-y-auto focus:!ring-0 focus:!outline-none focus:!border-none"
                />
              </div>

              {/* Botão de Gravar Áudio (Microfone) Estilo ChatGPT */}
              <button
                type="button"
                onClick={handleIniciarGravacao}
                title="Gravar mensagem de voz"
                aria-label="Gravar áudio"
                className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-[#262626] hover:bg-[#333333] text-[#b4b4b4] hover:text-white transition-colors"
              >
                <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>

              {/* Botão de Envio Circular Estilo ChatGPT */}
              <button
                type="button"
                onClick={() => handleEnviar()}
                disabled={!podeEnviar}
                title="Enviar mensagem à HUG I.A"
                aria-label="Enviar mensagem"
                className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-white text-black hover:bg-white/90 font-medium transition-all duration-200 active:scale-95 disabled:bg-[#343434] disabled:text-[#676767] disabled:cursor-not-allowed"
              >
                {carregando ? (
                  <span className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.5]" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Demonstração Autêntica de Conversa com a HUG I.A
 * Interface inspirada em mensageria corporativa moderna (estilo WhatsApp / Chat Real)
 */
function HugChatConversationDemo() {
  return (
    <div className="relative mx-auto w-full max-w-lg rounded-3xl border border-emerald-500/20 bg-[#060c14]/95 backdrop-blur-2xl shadow-[0_25px_70px_-15px_rgba(0,0,0,0.95),0_0_40px_rgba(16,185,129,0.1)] overflow-hidden text-left">
      {/* Linha de luz especular superior */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
      <div className="pointer-events-none absolute -top-20 -right-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />

      {/* Cabeçalho da Janela de Conversa (estilo Chat Oficial) */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08] bg-[#04080e]/80">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={hugLogo}
              alt="HUG I.A"
              className="h-10 w-10 rounded-full object-cover ring-1 ring-emerald-500/40 shadow-sm"
            />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#04080e] bg-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white tracking-tight">HUG I.A</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded">
                Oficial
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-light">
              Conectada ao seu ERP
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-mono text-slate-300">Tempo Real</span>
        </div>
      </div>

      {/* Área de Mensagens da Conversa */}
      <div className="p-5 sm:p-6 space-y-4 bg-gradient-to-b from-[#060c14]/60 to-[#03060a]/90">
        {/* Carimbo de data sutil */}
        <div className="flex justify-center">
          <span className="rounded-full bg-white/[0.04] border border-white/[0.06] px-3 py-0.5 text-[10px] font-mono text-slate-400">
            Hoje · Balcão de Vendas
          </span>
        </div>

        {/* 1. Mensagem do Lojista (Direita) */}
        <div className="flex flex-col items-end space-y-1">
          <div className="max-w-[85%] rounded-2xl rounded-tr-xs bg-emerald-900/30 border border-emerald-500/20 px-4 py-3 text-slate-100 shadow-md">
            <p className="text-sm leading-relaxed">
              Temos o blazer linho tamanho M em estoque central para entrega ainda hoje?
            </p>
          </div>
          <div className="flex items-center gap-1 pr-1 text-[10px] text-slate-400 font-mono">
            <span>14:32</span>
            <CheckCheck className="h-3.5 w-3.5 text-emerald-400" />
          </div>
        </div>

        {/* 2. Resposta da HUG I.A (Esquerda) */}
        <div className="flex items-start gap-2.5 max-w-[92%]">
          <img
            src={hugLogo}
            alt="HUG"
            className="h-7 w-7 rounded-full object-cover shrink-0 mt-1 ring-1 ring-emerald-500/30"
          />
          <div className="space-y-1">
            <div className="rounded-2xl rounded-tl-xs bg-white/[0.05] border border-white/10 p-4 text-slate-100 shadow-md backdrop-blur-sm space-y-2">
              <p className="text-sm leading-relaxed text-slate-200">
                Temos sim! Encontrei <strong className="text-emerald-300 font-medium">4 unidades</strong> do blazer linho (tamanho M) no estoque central por <strong className="text-white font-medium">R$ 89,00</strong>.
              </p>
              <p className="text-sm leading-relaxed text-slate-300 font-light">
                Deseja que eu reserve uma unidade para retirada imediata no balcão ou prefere enviar um link de pagamento?
              </p>
            </div>
            <div className="flex items-center gap-2 pl-1 text-[10px] text-slate-400 font-mono">
              <span>HUG I.A</span>
              <span>·</span>
              <span>14:32</span>
            </div>
          </div>
        </div>

        {/* 3. Réplica do Lojista (Direita) */}
        <div className="flex flex-col items-end space-y-1">
          <div className="max-w-[85%] rounded-2xl rounded-tr-xs bg-emerald-900/30 border border-emerald-500/20 px-4 py-3 text-slate-100 shadow-md">
            <p className="text-sm leading-relaxed">
              Gera o link de pagamento por gentileza.
            </p>
          </div>
          <div className="flex items-center gap-1 pr-1 text-[10px] text-slate-400 font-mono">
            <span>14:33</span>
            <CheckCheck className="h-3.5 w-3.5 text-emerald-400" />
          </div>
        </div>

        {/* 4. Conclusão da HUG I.A (Esquerda) */}
        <div className="flex items-start gap-2.5 max-w-[92%]">
          <img
            src={hugLogo}
            alt="HUG"
            className="h-7 w-7 rounded-full object-cover shrink-0 mt-1 ring-1 ring-emerald-500/30"
          />
          <div className="space-y-1">
            <div className="rounded-2xl rounded-tl-xs bg-white/[0.05] border border-emerald-500/30 p-4 text-slate-100 shadow-md backdrop-blur-sm space-y-2">
              <p className="text-sm leading-relaxed text-slate-200">
                Link gerado com sucesso:
              </p>
              <div className="rounded-lg bg-emerald-950/40 border border-emerald-500/30 px-3 py-2 flex items-center justify-between text-xs font-mono text-emerald-300">
                <span>bonasoft.link/pay/blazer-m-89</span>
                <span className="text-[10px] uppercase tracking-wider text-emerald-400/80 font-sans">Pronto</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                1 unidade reservada no estoque central e vinculada ao balcão.
              </p>
            </div>
            <div className="flex items-center gap-2 pl-1 text-[10px] text-slate-400 font-mono">
              <span>HUG I.A</span>
              <span>·</span>
              <span>14:33</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Landing() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Interpolações suaves de profundidade no Hero atreladas à rolagem vertical
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.8 });
  const imgY = useTransform(smoothProgress, [0, 1], ["0%", "24%"]);
  const imgScale = useTransform(smoothProgress, [0, 1], [1.02, 1.18]);
  const textY = useTransform(smoothProgress, [0, 1], ["0%", "-40%"]);
  const fade = useTransform(smoothProgress, [0, 0.75], [1, 0]);

  const [selectedSector, setSelectedSector] = useState(COMMERCIAL_SECTORS[0]);

  return (
    <div className="dark min-h-screen bg-[#03060a] font-sans text-foreground antialiased selection:bg-emerald-500/25 selection:text-emerald-200 relative overflow-x-hidden">
      {/* Sistema de rolagem suave Lenis */}
      <SmoothScroll />

      {/* 
        ========================================================================
        NAVBAR: Minimalista, Fina, Fluida e Elegante
        ========================================================================
      */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#03060a]/75 backdrop-blur-2xl transition-all duration-300">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 sm:h-20 sm:px-10">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-[14px] font-medium tracking-[0.45em] sm:text-[16px] sm:tracking-[0.55em] text-foreground transition-all duration-300 hover:text-white group"
          >
            <img
              src={hugLogo}
              alt="HUG"
              className="h-8 w-8 rounded-full object-cover shadow-sm ring-1 ring-emerald-500/40 transition-transform duration-300 group-hover:scale-105"
            />
            <span className="relative">
              HUG
              <span className="absolute -bottom-1 left-0 h-[1.5px] w-0 bg-emerald-400 transition-all duration-300 group-hover:w-full" />
            </span>
          </Link>

          <nav className="hidden items-center gap-9 text-xs tracking-wider uppercase text-muted-foreground/80 md:flex">
            <a href="#pilares" className="transition-colors hover:text-foreground relative group py-1">
              Pilares
              <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-emerald-400 transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#ecossistema" className="transition-colors hover:text-foreground relative group py-1">
              Ecossistema
              <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-emerald-400 transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#inteligencia" className="transition-colors hover:text-foreground relative group py-1">
              I.A.
              <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-emerald-400 transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#segmentos" className="transition-colors hover:text-foreground relative group py-1">
              Segmentos
              <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-emerald-400 transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#planos" className="transition-colors hover:text-foreground relative group py-1">
              Planos
              <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-emerald-400 transition-all duration-300 group-hover:w-full" />
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={getBonaSoftWhatsAppUrl("Olá, BonaSoft! Gostaria de agendar uma consultoria e conhecer a plataforma HUG para minha empresa.")}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group overflow-hidden rounded-full border border-emerald-400/40 bg-gradient-to-r from-emerald-600/90 to-teal-500/90 px-5 py-2 text-xs font-medium text-white shadow-[0_0_16px_rgba(16,185,129,0.22)] backdrop-blur-md transition-all duration-300 hover:from-emerald-500 hover:to-teal-400 hover:shadow-[0_0_24px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#03060a] motion-reduce:transition-none motion-reduce:hover:transform-none"
            >
              {/* Brilho especular sutil na borda superior */}
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              {/* Reflexo luminoso suave ao hover */}
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full motion-reduce:hidden" />
              <span className="relative z-10">Falar com Especialista</span>
            </a>
          </div>
        </div>
      </header>

      {/* 
        ========================================================================
        HERO: Planeta Iluminado, Universo Espacial e Abertura Cinematográfica
        ========================================================================
      */}
      <section
        ref={heroRef}
        className="relative min-h-[85vh] lg:min-h-[92vh] overflow-hidden flex flex-col justify-start sm:justify-center"
      >
        {/* Imagem do Horizonte Planetário */}
        <motion.img
          src={horizon}
          alt="Horizonte de um planeta iluminado no espaço"
          width={1920}
          height={1088}
          style={{
            y: imgY,
            scale: imgScale,
          }}
          className="absolute inset-0 h-full w-full object-cover object-[50%_62%] brightness-[0.95] contrast-[1.1] will-change-transform"
        />

        {/* Gradientes atmosféricos de fusão espacial */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#03060a] via-[#03060a]/25 to-[#03060a]/75 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.12),_transparent_70%)] pointer-events-none" />

        {/* Conteúdo Central do Hero */}
        <motion.div
          style={{ y: textY, opacity: fade }}
          className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 pt-24 pb-10 sm:pt-36 sm:pb-20 text-center max-w-5xl mx-auto"
        >
          {/* Título com Abertura Tipográfica Cinematográfica */}
          <div className="overflow-hidden py-1">
            <motion.h1
              initial={{ opacity: 0, y: 70, filter: "blur(14px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.5, ease, delay: 0.3 }}
              className="text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-medium leading-[1.12] sm:leading-[1.03] tracking-[-0.035em] text-white"
            >
              Seu negócio,
              <br />
              <span className="text-muted-foreground/80">em outra órbita.</span>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease, delay: 0.7 }}
            className="mt-3.5 sm:mt-5 max-w-2xl text-sm sm:text-lg md:text-xl leading-relaxed text-slate-300/90 font-light px-2"
          >
            Vendas, estoque, gestão empresarial e inteligência comercial integrados em uma única
            plataforma.
          </motion.p>

          {/* Botões do Hero com Acabamento Premium Cinematográfico */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease, delay: 0.95 }}
            className="mt-6 sm:mt-10 flex w-full flex-col items-center justify-center gap-2.5 sm:w-auto sm:flex-row sm:gap-4 px-4 sm:px-0"
          >
            {/* CTA Principal: Falar com Especialista */}
            <a
              href={getBonaSoftWhatsAppUrl("Olá, BonaSoft! Gostaria de falar com um especialista e conhecer a plataforma HUG para minha empresa.")}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex w-full max-w-xs sm:w-auto sm:max-w-none items-center justify-center gap-2.5 sm:gap-3 overflow-hidden rounded-full border border-emerald-300/40 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 px-6 py-3 sm:px-9 sm:py-4 text-xs sm:text-base font-medium text-white shadow-[0_0_28px_rgba(16,185,129,0.32)] backdrop-blur-xl transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_42px_rgba(16,185,129,0.55)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#03060a] motion-reduce:transition-none motion-reduce:hover:transform-none"
            >
              {/* Brilho especular sutil na borda superior */}
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
              {/* Reflexo luminoso dinâmico no hover */}
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full motion-reduce:hidden" />
              
              <span className="relative z-10 tracking-tight">Falar com Especialista</span>
              <ArrowRight className="relative z-10 h-3.5 w-3.5 sm:h-4.5 sm:w-4.5 text-white transition-transform duration-300 ease-out group-hover:translate-x-1.5 motion-reduce:transform-none" />
            </a>

            {/* CTA Secundário: Conhecer a plataforma */}
            <a
              href="#pilares"
              className="group relative inline-flex w-full max-w-xs sm:w-auto sm:max-w-none items-center justify-center gap-2.5 sm:gap-3 overflow-hidden rounded-full border border-emerald-500/30 bg-[#080d14]/70 px-6 py-3 sm:px-9 sm:py-4 text-xs sm:text-base font-medium text-slate-100 shadow-lg shadow-black/40 backdrop-blur-xl transition-all duration-300 hover:border-emerald-400/60 hover:bg-[#0c1420]/80 hover:text-white hover:shadow-[0_0_28px_rgba(16,185,129,0.18)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#03060a] motion-reduce:transition-none motion-reduce:hover:transform-none"
            >
              {/* Brilho especular sutil na borda superior */}
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/35 to-transparent" />
              {/* Gradiente interno sutil para profundidade glass */}
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent" />
              
              <span className="relative z-10 tracking-tight">Conhecer a plataforma</span>
              <ArrowRight className="relative z-10 h-4 w-4 sm:h-4.5 sm:w-4.5 text-emerald-400 transition-transform duration-300 ease-out group-hover:translate-x-1.5 group-hover:text-emerald-300 motion-reduce:transform-none" />
            </a>
          </motion.div>
        </motion.div>

        {/* Campo Interativo HUG I.A: 100% Opaco, Sólido, Fundo Preto Permanente */}
        <div className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 pb-8 sm:pb-16">
          <HugAiHeroTester />
        </div>
      </section>

      {/* 
        ========================================================================
        SEÇÃO PILARES: Narrativa Visual Contínua (Scroll Storytelling com Atos)
        ========================================================================
      */}
      <section id="pilares" className="relative mx-auto max-w-[1400px] px-6 pt-10 pb-16 sm:pt-14 sm:pb-24 md:px-12">
        <Reveal className="max-w-4xl mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-medium leading-[1.12] sm:leading-[1.08] tracking-[-0.03em] text-white">
            Tudo que sua empresa precisa para vender.
            <br />
            <span className="text-muted-foreground">Nada que ela não precise.</span>
          </h2>
        </Reveal>

        {/* Indicador de Atos e Narrativa em Sequência */}
        <div className="space-y-16 sm:space-y-24">
          {NARRATIVE_PILLARS.map((item, idx) => {
            const isReversed = idx % 2 === 1;
            return (
              <div
                key={item.title}
                className={`flex flex-col gap-8 lg:gap-16 items-center ${
                  isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
                }`}
              >
                {/* Composição Visual Panorâmica com Efeito 3D Tilt */}
                <Reveal className="w-full lg:w-3/5">
                  <InteractiveTiltCard className="border border-white/10 bg-black/50 shadow-2xl group min-h-[340px] sm:min-h-[460px]">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.6] contrast-[1.05]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#03060a] via-transparent to-transparent pointer-events-none" />
                  </InteractiveTiltCard>
                </Reveal>

                {/* Conteúdo Editorial com Alto Espaço Negativo */}
                <Reveal delay={0.2} className="w-full lg:w-2/5 space-y-4">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-white leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
                    {item.subtitle}
                  </p>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>

                  <div className="pt-4 border-t border-white/10 space-y-2.5">
                    {item.highlights.map((h, hIdx) => (
                      <motion.div
                        key={h}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + hIdx * 0.1, duration: 0.6 }}
                        className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300/90"
                      >
                        <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                        <span>{h}</span>
                      </motion.div>
                    ))}
                  </div>
                </Reveal>
              </div>
            );
          })}
        </div>
      </section>

      {/* 
        ========================================================================
        SEÇÃO ECOSSISTEMA: Apresentação Editorial das Cinco Frentes Conectadas
        ========================================================================
      */}
      <section
        id="ecossistema"
        className="relative border-t border-white/[0.08] bg-[#020408] py-16 sm:py-24 overflow-hidden"
      >
        <div className="mx-auto max-w-[1400px] px-6 md:px-12 relative z-10">
          <Reveal className="max-w-3xl mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-white">
              Cinco frentes sincronizadas.
              <br />
              <span className="text-muted-foreground">Uma única operação comercial.</span>
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-400 leading-relaxed font-light">
              Toda a jornada da sua empresa — da retaguarda ao cliente final — conectada sob uma
              mesma base de dados e regras de negócio.
            </p>
          </Reveal>

          {/* Linha de feixe ótico de sincronia conectando as 5 frentes */}
          <div className="hidden lg:block relative w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent mb-10">
            <div className="absolute inset-0 bg-emerald-400/60 blur-xs" />
          </div>

          {/* Grade Editorial dos 5 Módulos com InteractiveTiltCard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8 pt-2">
            {ECOSYSTEM_MODULES.map((mod, i) => {
              const Icon = mod.icon;
              return (
                <Reveal key={mod.id} delay={i * 0.1}>
                  <InteractiveTiltCard className="p-6 border border-white/10 bg-white/[0.02] backdrop-blur-md h-full flex flex-col justify-between group">
                    <div className="space-y-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-sm transition-transform duration-300 group-hover:scale-110">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-mono tracking-wider text-emerald-400/90 uppercase block">
                          {mod.label}
                        </span>
                        <h4 className="text-xl font-medium text-white mt-1 group-hover:text-emerald-300 transition-colors">
                          {mod.name}
                        </h4>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-light">
                        {mod.description}
                      </p>
                    </div>
                  </InteractiveTiltCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        SEÇÃO INTELIGÊNCIA ARTIFICIAL: Monólito de Vidro Escuro e Demonstração Real
        ========================================================================
      */}
      <section id="inteligencia" className="relative min-h-[75vh] overflow-hidden flex items-center py-20 sm:py-28">
        {/* Monólito de Vidro Escuro como Plano de Fundo Cinematográfico */}
        <motion.img
          src={monolith}
          alt="Monólito de vidro escuro iluminado"
          loading="lazy"
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover brightness-[0.7] contrast-[1.1] transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#03060a] via-transparent to-[#03060a]" />
        <div className="absolute inset-0 bg-black/55" />

        {/* Ambient Glows Cinematográficos */}
        <div className="pointer-events-none absolute right-1/4 top-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-500/10 rounded-full blur-[140px]" />
        <div className="pointer-events-none absolute left-10 bottom-10 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-[1400px] w-full px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Texto de Apresentação */}
            <Reveal className="space-y-6 max-w-xl">
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-medium leading-[1.08] tracking-[-0.03em] text-white">
                Você pede.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400">
                  A HUG executa.
                </span>
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-slate-300/90 font-light">
                Esqueça relatórios complicados e comandos difíceis. Uma assistente conversacional
                conectada diretamente aos dados reais da sua loja para tirar dúvidas e sugerir
                respostas imediatas.
              </p>
              <div className="pt-3">
                <a
                  href={getBonaSoftWhatsAppUrl("Olá, BonaSoft! Gostaria de agendar uma demonstração executiva da inteligência HUG para meu negócio.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-emerald-300/40 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 px-8 py-3.5 text-sm sm:text-base font-medium text-white shadow-[0_0_24px_rgba(16,185,129,0.3)] backdrop-blur-xl transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_36px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#03060a] motion-reduce:transition-none motion-reduce:hover:transform-none"
                >
                  {/* Brilho especular sutil na borda superior */}
                  <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                  {/* Reflexo luminoso dinâmico no hover */}
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full motion-reduce:hidden" />
                  
                  <span className="relative z-10 tracking-tight">Falar com Especialista</span>
                  <ArrowRight className="relative z-10 h-4 w-4 sm:h-4.5 sm:w-4.5 text-white transition-transform duration-300 ease-out group-hover:translate-x-1.5 motion-reduce:transform-none" />
                </a>
              </div>
            </Reveal>

            {/* Demonstração Cinematográfica Realista de Conversa com a HUG I.A */}
            <Reveal delay={0.25}>
              <HugChatConversationDemo />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        SEÇÃO SEGMENTOS: Fotografia Editorial Ampla e Transições
        ========================================================================
      */}
      <section id="segmentos" className="relative mx-auto max-w-[1400px] px-6 py-16 sm:py-24 md:px-12">
        <Reveal className="max-w-3xl mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-white">
            Soluções especializadas para cada setor.
          </h2>
          <p className="mt-2.5 text-base sm:text-lg text-slate-400 font-light">
            Regras de negócio, termos comerciais e rotinas adaptadas à realidade de cada segmento.
          </p>
        </Reveal>

        {/* Seletor Minimalista com Pill Fluido */}
        <div className="flex flex-wrap gap-2 sm:gap-2.5 mb-8">
          {COMMERCIAL_SECTORS.map((sec) => {
            const isSelected = selectedSector.id === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setSelectedSector(sec)}
                className={`relative rounded-full px-5 py-2 text-xs sm:text-sm font-medium transition-colors ${
                  isSelected
                    ? "text-black"
                    : "border border-white/10 bg-white/5 text-muted-foreground hover:border-white/30 hover:text-white"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeSectorPill"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    className="absolute inset-0 rounded-full bg-white shadow-lg"
                  />
                )}
                <span className="relative z-10">{sec.name}</span>
              </button>
            );
          })}
        </div>

        {/* Quadro Panorâmico Cinematográfico do Segmento Ativo */}
        <div className="relative overflow-hidden rounded-3xl border border-white/15 min-h-[440px] sm:min-h-[520px] flex items-end p-6 sm:p-12 shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.img
              key={selectedSector.id}
              src={selectedSector.image}
              alt={selectedSector.title}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease }}
              className="absolute inset-0 h-full w-full object-cover brightness-[0.45] contrast-[1.1]"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-3.5 text-left">
            <span className="inline-block rounded-full border border-white/20 bg-black/60 px-3.5 py-1 text-xs font-mono uppercase tracking-wider text-emerald-400 backdrop-blur-md">
              {selectedSector.kpi}
            </span>
            <h3 className="text-3xl sm:text-5xl font-medium text-white tracking-tight">
              {selectedSector.title}
            </h3>
            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
              {selectedSector.narrative}
            </p>
          </div>
        </div>
      </section>


      {/* 
        ========================================================================
        SEÇÃO PLANOS: Apresentação Transparente (R$ 99,00, R$ 199,00, R$ 399,00)
        ========================================================================
      */}
      <section
        id="planos"
        className="relative border-t border-white/[0.08] bg-[#020408] py-16 sm:py-24"
      >
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <Reveal className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-white">
              Planos objetivos. Sem letras miúdas.
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-400 font-light">
              Valores mensais sem taxa oculta de implantação. Cancele ou altere a qualquer momento.
            </p>
          </Reveal>

          {/* Grade Editorial dos 3 Planos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {APPROVED_PLANS.map((plan, idx) => (
              <Reveal key={plan.name} delay={idx * 0.15}>
                <InteractiveTiltCard
                  className={`flex flex-col justify-between rounded-3xl p-7 sm:p-9 transition-all h-full ${
                    plan.featured
                      ? "border-2 border-emerald-500/60 bg-gradient-to-b from-emerald-950/40 via-black/85 to-black shadow-[0_0_50px_rgba(16,185,129,0.18)]"
                      : "border border-white/10 bg-black/60"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-medium text-white">{plan.name}</span>
                      {plan.featured && (
                        <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-0.5 text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
                          Recomendado
                        </span>
                      )}
                    </div>
                    <div className="mt-5 flex items-baseline gap-1.5">
                      <span className="text-2xl font-light text-slate-400">R$</span>
                      <span className="text-5xl font-medium text-white tracking-tight">
                        {plan.price}
                      </span>
                      <span className="text-xs font-mono text-slate-400 uppercase">/ mês</span>
                    </div>
                    <p className="mt-3.5 text-sm text-slate-300/90 leading-relaxed font-light">
                      {plan.tagline}
                    </p>

                    <div className="mt-6 pt-5 border-t border-white/10 space-y-2.5">
                      {plan.features.map((f) => (
                        <div key={f} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                          <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-4">
                    <a
                      href={getBonaSoftWhatsAppUrl(`Olá, BonaSoft! Gostaria de falar com um especialista para contratar o plano ${plan.name} do HUG (R$ ${plan.price}/mês).`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block w-full text-center rounded-full py-3.5 text-xs font-medium uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                        plan.featured
                          ? "bg-white text-black hover:bg-emerald-400 shadow-md"
                          : "border border-white/20 text-white hover:bg-white/10"
                      }`}
                    >
                      Falar com Especialista • {plan.name}
                    </a>
                  </div>
                </InteractiveTiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        ENCERRAMENTO: Conclusão Cinematográfica Espacial
        ========================================================================
      */}
      <section
        id="comecar"
        className="relative overflow-hidden px-6 py-20 text-center sm:py-28 border-t border-white/[0.08]"
      >
        {/* Glow de fundo espacial */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] sm:h-[600px] sm:w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/12 blur-[140px]" />

        <Reveal>
          <h2 className="relative mx-auto max-w-4xl text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.08] tracking-[-0.035em] text-white">
            O futuro do seu negócio
            <br />
            <span className="text-muted-foreground">começa em outra órbita.</span>
          </h2>
          <div className="mt-8 sm:mt-10 flex justify-center">
            <a
              href={getBonaSoftWhatsAppUrl("Olá, BonaSoft! Gostaria de falar com um especialista e levar a operação da minha empresa para a plataforma HUG.")}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/[0.08] px-9 py-4 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 hover:border-emerald-400/70 hover:bg-white/[0.18] hover:shadow-[0_0_30px_rgba(16,185,129,0.25)] active:bg-zinc-700 active:border-zinc-500 active:scale-[0.98]"
            >
              Falar com Especialista
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </Reveal>
      </section>

      {/* 
        ========================================================================
        RODAPÉ: Centralizado com o Átomo Quântico em Movimento Oficial da BonaSoft
        Direcionando para o site oficial (https://bonasoftmt.com)
        ========================================================================
      */}
      <footer className="border-t border-white/[0.08] bg-[#020408] py-12 px-6">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-center gap-6 text-center">
          <a
            href={BONASOFT_WEBSITE_URL}
            onClick={openBonaSoftWebsite}
            role="button"
            tabIndex={0}
            title="BonaSoft — Desenvolvimento de Sistemas (Acessar site oficial)"
            aria-label="Acessar o site oficial da BonaSoft"
            className="inline-flex items-center justify-center gap-3 py-2 px-4 cursor-pointer group opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <BonaParticleAtom className="h-8 w-8 text-emerald-400 shrink-0 transition-transform duration-300 group-hover:rotate-12" />
            <span className="font-sans font-light tracking-[0.28em] text-sm sm:text-base leading-none text-foreground uppercase group-hover:text-emerald-400 transition-colors">
              BONASOFT
            </span>
          </a>
          <p className="text-xs text-muted-foreground/60 font-mono tracking-wider">
            © {new Date().getFullYear()} <a href={BONASOFT_WEBSITE_URL} onClick={openBonaSoftWebsite} className="hover:text-emerald-400 transition-colors underline-offset-4 hover:underline">BonaSoft</a>. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
