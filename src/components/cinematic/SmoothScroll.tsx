import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll() {
  useEffect(() => {
    // Respeita preferência do usuário por movimento reduzido
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Detecta se é dispositivo touch (celular, tablet ou tela sensível ao toque)
    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches ||
      window.innerWidth < 1024;

    // Em dispositivos touch, mantemos o scroll 100% nativo do navegador
    // evitando qualquer interceptação touch que cause travamentos ou congelamentos
    if (isTouchDevice) {
      function handleMobileAnchorClick(e: MouseEvent) {
        const target = (e.target as HTMLElement)?.closest('a[href^="#"]');
        if (!target) return;
        const href = target.getAttribute("href");
        if (!href || href === "#") return;
        const element = document.querySelector(href);
        if (element) {
          e.preventDefault();
          const targetY = element.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: targetY, behavior: "smooth" });
        }
      }

      document.addEventListener("click", handleMobileAnchorClick, { passive: false });
      return () => {
        document.removeEventListener("click", handleMobileAnchorClick);
      };
    }

    // No Desktop com mouse/trackpad: rolagem suave otimizada sem sequestrar touch
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 0, // NUNCA interceptar touch
      syncTouch: false,
      infinite: false,
    });

    (window as any).__hug_lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Suporte fluido para âncoras da página no Desktop
    function handleAnchorClick(e: MouseEvent) {
      const target = (e.target as HTMLElement)?.closest('a[href^="#"]');
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || href === "#") return;
      const element = document.querySelector(href);
      if (element) {
        e.preventDefault();
        lenis.scrollTo(element as HTMLElement, { offset: -80, duration: 1.2 });
      }
    }

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as any).__hug_lenis;
    };
  }, []);

  return null;
}
