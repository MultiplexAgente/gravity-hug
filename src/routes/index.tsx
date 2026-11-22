import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "motion/react";
import {
  ArrowRight,
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

// 1. Narrativa Contínua dos Três Pilares (Sem formato de cards, composições amplas)
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
    name: "HUG Intelligence",
    label: "Inteligência Artificial",
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
      "Assistente HUG para consulta e respostas",
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
      "Acesso prioritário à inteligência HUG",
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
              Inteligência
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
        className="relative min-h-[85vh] lg:min-h-[92vh] overflow-hidden flex flex-col justify-center"
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
          className="relative z-10 flex flex-col items-center justify-center px-6 pt-28 pb-14 sm:pt-36 sm:pb-20 text-center max-w-5xl mx-auto"
        >
          {/* Título com Abertura Tipográfica Cinematográfica */}
          <div className="overflow-hidden py-1">
            <motion.h1
              initial={{ opacity: 0, y: 70, filter: "blur(14px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.5, ease, delay: 0.3 }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium leading-[1.08] sm:leading-[1.03] tracking-[-0.035em] text-white"
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
            className="mt-5 max-w-2xl text-base sm:text-lg md:text-xl leading-relaxed text-slate-300/90 font-light"
          >
            Vendas, estoque, gestão empresarial e inteligência comercial integrados em uma única
            plataforma.
          </motion.p>

          {/* Botões do Hero com Acabamento Premium Cinematográfico */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease, delay: 0.95 }}
            className="mt-8 sm:mt-10 flex w-full flex-col items-center justify-center gap-3.5 sm:w-auto sm:flex-row sm:gap-4 px-4 sm:px-0"
          >
            {/* CTA Principal: Falar com Especialista */}
            <a
              href={getBonaSoftWhatsAppUrl("Olá, BonaSoft! Gostaria de falar com um especialista e conhecer a plataforma HUG para minha empresa.")}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex w-full max-w-xs sm:w-auto sm:max-w-none items-center justify-center gap-3 overflow-hidden rounded-full border border-emerald-300/40 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 px-8 py-4 sm:px-9 sm:py-4 text-sm sm:text-base font-medium text-white shadow-[0_0_28px_rgba(16,185,129,0.32)] backdrop-blur-xl transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_42px_rgba(16,185,129,0.55)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#03060a] motion-reduce:transition-none motion-reduce:hover:transform-none"
            >
              {/* Brilho especular sutil na borda superior */}
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
              {/* Reflexo luminoso dinâmico no hover */}
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full motion-reduce:hidden" />
              
              <span className="relative z-10 tracking-tight">Falar com Especialista</span>
              <ArrowRight className="relative z-10 h-4 w-4 sm:h-4.5 sm:w-4.5 text-white transition-transform duration-300 ease-out group-hover:translate-x-1.5 motion-reduce:transform-none" />
            </a>

            {/* CTA Secundário: Conhecer a plataforma */}
            <a
              href="#pilares"
              className="group relative inline-flex w-full max-w-xs sm:w-auto sm:max-w-none items-center justify-center gap-3 overflow-hidden rounded-full border border-emerald-500/30 bg-[#080d14]/70 px-8 py-4 sm:px-9 sm:py-4 text-sm sm:text-base font-medium text-slate-100 shadow-lg shadow-black/40 backdrop-blur-xl transition-all duration-300 hover:border-emerald-400/60 hover:bg-[#0c1420]/80 hover:text-white hover:shadow-[0_0_28px_rgba(16,185,129,0.18)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#03060a] motion-reduce:transition-none motion-reduce:hover:transform-none"
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

            {/* Demonstração Visual Realista e Elegante da Conversa (Terminal HUD Glass) */}
            <Reveal delay={0.25}>
              <div className="relative group/terminal rounded-3xl border border-emerald-500/20 bg-[#04080e]/90 p-6 sm:p-9 backdrop-blur-2xl shadow-[0_25px_70px_-15px_rgba(0,0,0,0.95),0_0_40px_rgba(16,185,129,0.1)] space-y-6 overflow-hidden">
                {/* Linha de luz especular superior */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
                {/* Ambient corner glow */}
                <div className="pointer-events-none absolute -top-16 -right-16 w-44 h-44 bg-emerald-500/15 rounded-full blur-3xl" />
                
                {/* Cabeçalho do HUD / Terminal */}
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-2.5 w-2.5 items-center justify-center">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                    </div>
                    <span className="text-[11px] sm:text-xs font-mono font-medium text-slate-200 uppercase tracking-widest">
                      Consulta Operacional em Tempo Real
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-mono text-emerald-300">
                      Sincronizado
                    </span>
                  </div>
                </div>

                {/* Pergunta do Lojista */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 text-left space-y-2 backdrop-blur-sm shadow-inner transition-colors hover:border-white/20"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                      Lojista · Balcão de Vendas
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-slate-100 font-light leading-relaxed">
                    "Temos o blazer linho tamanho M em estoque central para entrega ainda hoje?"
                  </p>
                </motion.div>

                {/* Resposta Sugerida da HUG Intelligence */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="relative rounded-2xl border border-emerald-500/35 bg-gradient-to-br from-emerald-950/40 via-[#061b15]/60 to-[#04120e]/80 p-5 sm:p-6 text-left space-y-3.5 backdrop-blur-md shadow-[0_0_30px_rgba(16,185,129,0.12)] ring-1 ring-emerald-500/20 overflow-hidden"
                >
                  {/* Luz interna no topo do card da HUG */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                      <span className="text-[11px] font-mono text-emerald-300 uppercase font-semibold tracking-wider">
                        HUG Intelligence
                      </span>
                    </div>
                    <span className="inline-flex items-center rounded-md border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-mono text-emerald-300">
                      0.4s
                    </span>
                  </div>

                  <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-light">
                    "Localizado no estoque central: <strong className="font-semibold text-emerald-300">4 unidades disponíveis</strong>. Preço tabelado <strong className="font-semibold text-white">R$ 89,00</strong>. Deseja separar o pedido para retirada no balcão ou gerar link de pagamento?"
                  </p>

                  {/* Pílulas de Ação Rápida sugeridas pela IA */}
                  <div className="pt-1 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Separar no balcão
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                      Gerar link de pagamento
                    </span>
                  </div>
                </motion.div>
              </div>
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
