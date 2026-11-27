import { useState } from "react";
import {
  X,
  Smartphone,
  Instagram,
  Facebook,
  CheckCircle2,
  RefreshCw,
  QrCode,
  ExternalLink,
  ShieldCheck,
  Power,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ChannelsModal({ open, onClose }: Props) {
  const [abaAtiva, setAbaAtiva] = useState<"whatsapp" | "instagram" | "facebook">("whatsapp");

  // WhatsApp State
  const [whatsappConectado, setWhatsappConectado] = useState(true);
  const [whatsappNumero, setWhatsappNumero] = useState("(66) 99273-4632");
  const [whatsappQrAberto, setWhatsappQrAberto] = useState(false);

  // Instagram State
  const [instagramConectado, setInstagramConectado] = useState(true);
  const [instagramPerfil, setInstagramPerfil] = useState("@anthony_pva");
  const [instagramAutoDm, setInstagramAutoDm] = useState(true);
  const [instagramAutoStories, setInstagramAutoStories] = useState(true);

  // Facebook State
  const [facebookConectado, setFacebookConectado] = useState(true);
  const [facebookPagina, setFacebookPagina] = useState("HUG Oficial & BonaSoft");
  const [facebookAutoMessenger, setFacebookAutoMessenger] = useState(true);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#090d16] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Cabeçalho do Modal */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between bg-[#060911]">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Smartphone className="size-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                Canais & Integrações
              </h2>
              <p className="text-[11px] text-slate-400">
                WhatsApp, Instagram Direct e Facebook Messenger
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Abas dos Canais */}
        <div className="flex border-b border-white/[0.08] px-4 pt-2 bg-[#060911]/50 gap-2">
          <button
            type="button"
            onClick={() => setAbaAtiva("whatsapp")}
            className={`pb-3 px-3 border-b-2 text-xs font-semibold flex items-center gap-2 transition-all ${
              abaAtiva === "whatsapp"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Smartphone className="size-4" />
            WhatsApp
            {whatsappConectado && (
              <span className="size-2 rounded-full bg-emerald-400 shrink-0" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setAbaAtiva("instagram")}
            className={`pb-3 px-3 border-b-2 text-xs font-semibold flex items-center gap-2 transition-all ${
              abaAtiva === "instagram"
                ? "border-pink-500 text-pink-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Instagram className="size-4" />
            Instagram Direct
            {instagramConectado && (
              <span className="size-2 rounded-full bg-pink-400 shrink-0" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setAbaAtiva("facebook")}
            className={`pb-3 px-3 border-b-2 text-xs font-semibold flex items-center gap-2 transition-all ${
              abaAtiva === "facebook"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Facebook className="size-4" />
            Facebook Messenger
            {facebookConectado && (
              <span className="size-2 rounded-full bg-blue-400 shrink-0" />
            )}
          </button>
        </div>

        {/* Conteúdo com Rolagem */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* ========================================================= */}
          {/* ABA 1: WHATSAPP                                           */}
          {/* ========================================================= */}
          {abaAtiva === "whatsapp" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Smartphone className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">WhatsApp Business</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                        whatsappConectado
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : "bg-slate-500/15 text-slate-400 border border-slate-500/30"
                      }`}>
                        {whatsappConectado ? "Online" : "Desconectado"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Número: {whatsappNumero}
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setWhatsappConectado(!whatsappConectado);
                    toast.success(whatsappConectado ? "WhatsApp desconectado." : "WhatsApp conectado com sucesso!");
                  }}
                  className={`text-xs h-9 rounded-xl border ${
                    whatsappConectado
                      ? "border-rose-500/30 text-rose-300 hover:bg-rose-500/10"
                      : "border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10"
                  }`}
                >
                  <Power className="size-3.5 mr-1.5" />
                  {whatsappConectado ? "Desconectar" : "Conectar"}
                </Button>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300 font-semibold">Número do WhatsApp Comercial</Label>
                <div className="flex gap-2">
                  <Input
                    value={whatsappNumero}
                    onChange={(e) => setWhatsappNumero(e.target.value)}
                    placeholder="Ex: (66) 99273-4632"
                    className="bg-black/40 border-white/10 text-white text-xs h-10 rounded-xl font-mono focus:border-emerald-500"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      setWhatsappQrAberto(!whatsappQrAberto);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl h-10 px-4 shrink-0 flex items-center gap-1.5"
                  >
                    <QrCode className="size-4" />
                    {whatsappQrAberto ? "Fechar QR" : "Ler QR Code"}
                  </Button>
                </div>
              </div>

              {whatsappQrAberto && (
                <div className="p-6 rounded-2xl bg-black/60 border border-emerald-500/30 flex flex-col items-center text-center space-y-3">
                  <div className="size-44 bg-white p-3 rounded-2xl shadow-xl flex items-center justify-center">
                    <img
                      src="/hug-atom-icon.png"
                      alt="QR Code"
                      className="size-32 object-contain"
                    />
                  </div>
                  <p className="text-xs text-slate-300 font-medium">
                    Abra o WhatsApp no celular &gt; Aparelhos conectados &gt; Conectar um aparelho
                  </p>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    Sincronização em tempo real via HUG Core Gateway
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* ABA 2: INSTAGRAM DIRECT                                   */}
          {/* ========================================================= */}
          {abaAtiva === "instagram" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                    <Instagram className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">Instagram Direct</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                        instagramConectado
                          ? "bg-pink-500/15 text-pink-400 border border-pink-500/30"
                          : "bg-slate-500/15 text-slate-400 border border-slate-500/30"
                      }`}>
                        {instagramConectado ? "Online" : "Desconectado"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Perfil: {instagramPerfil}
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setInstagramConectado(!instagramConectado);
                    toast.success(instagramConectado ? "Instagram desconectado." : "Instagram conectado com sucesso!");
                  }}
                  className={`text-xs h-9 rounded-xl border ${
                    instagramConectado
                      ? "border-rose-500/30 text-rose-300 hover:bg-rose-500/10"
                      : "border-pink-500/30 text-pink-300 hover:bg-pink-500/10"
                  }`}
                >
                  <Power className="size-3.5 mr-1.5" />
                  {instagramConectado ? "Desconectar" : "Conectar"}
                </Button>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300 font-semibold">Perfil do Instagram (@)</Label>
                <div className="flex gap-2">
                  <Input
                    value={instagramPerfil}
                    onChange={(e) => setInstagramPerfil(e.target.value)}
                    placeholder="Ex: @minhaloja_oficial"
                    className="bg-black/40 border-white/10 text-white text-xs h-10 rounded-xl font-mono focus:border-pink-500"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      toast.success("Perfil do Instagram atualizado.");
                    }}
                    className="bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-xl h-10 px-4 shrink-0"
                  >
                    Salvar
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#060911] border border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">Respostas Automáticas em DMs</p>
                    <p className="text-[11px] text-slate-400">Atender clientes diretamente nas mensagens privadas</p>
                  </div>
                  <Switch
                    checked={instagramAutoDm}
                    onCheckedChange={setInstagramAutoDm}
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                  <div>
                    <p className="text-xs font-bold text-white">Respostas a Menções em Stories</p>
                    <p className="text-[11px] text-slate-400">Enviar mensagem imediata quando marcarem a loja</p>
                  </div>
                  <Switch
                    checked={instagramAutoStories}
                    onCheckedChange={setInstagramAutoStories}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* ABA 3: FACEBOOK MESSENGER                                 */}
          {/* ========================================================= */}
          {abaAtiva === "facebook" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Facebook className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">Facebook Messenger</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                        facebookConectado
                          ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                          : "bg-slate-500/15 text-slate-400 border border-slate-500/30"
                      }`}>
                        {facebookConectado ? "Online" : "Desconectado"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Página: {facebookPagina}
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFacebookConectado(!facebookConectado);
                    toast.success(facebookConectado ? "Facebook desconectado." : "Facebook conectado com sucesso!");
                  }}
                  className={`text-xs h-9 rounded-xl border ${
                    facebookConectado
                      ? "border-rose-500/30 text-rose-300 hover:bg-rose-500/10"
                      : "border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
                  }`}
                >
                  <Power className="size-3.5 mr-1.5" />
                  {facebookConectado ? "Desconectar" : "Conectar"}
                </Button>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300 font-semibold">Nome da Página do Facebook</Label>
                <div className="flex gap-2">
                  <Input
                    value={facebookPagina}
                    onChange={(e) => setFacebookPagina(e.target.value)}
                    placeholder="Ex: Minha Empresa Oficial"
                    className="bg-black/40 border-white/10 text-white text-xs h-10 rounded-xl font-mono focus:border-blue-500"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      toast.success("Página do Facebook vinculada.");
                    }}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl h-10 px-4 shrink-0"
                  >
                    Salvar
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#060911] border border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">Respostas Automáticas no Messenger</p>
                    <p className="text-[11px] text-slate-400">Responder clientes que enviarem mensagens na Página</p>
                  </div>
                  <Switch
                    checked={facebookAutoMessenger}
                    onCheckedChange={setFacebookAutoMessenger}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé do Modal */}
        <div className="p-4 border-t border-white/[0.08] bg-[#060911] flex justify-end">
          <Button
            type="button"
            onClick={onClose}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-10 px-5 rounded-xl"
          >
            Concluir
          </Button>
        </div>
      </div>
    </div>
  );
}
