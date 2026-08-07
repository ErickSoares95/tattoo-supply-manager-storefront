"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

interface Slide {
  eyebrow: string;
  title: ReactNode;
  sub: string;
  ctas: { label: string; href: string; variant: "gold" | "outline" }[];
  gradient: string;
}

const SLIDES: Slide[] = [
  {
    eyebrow: "ESTÚDIO & TATTOO SUPPLY",
    title: (
      <>
        Equipamento profissional para quem <em className="text-gold-light not-italic">vive de tatuagem</em>
      </>
    ),
    sub: "Máquinas, tintas, agulhas e descartáveis das marcas mais procuradas — selecionados pela Vanessa Gazanez.",
    ctas: [
      { label: "Ver todos os produtos", href: "#produtos", variant: "gold" },
      { label: "Mais vendidos da semana", href: "#destaques", variant: "outline" },
    ],
    gradient: "radial-gradient(ellipse at 30% 20%, rgba(201,162,74,.25), transparent 55%), linear-gradient(135deg, #0c0a08, #000)",
  },
  {
    eyebrow: "MARCA EM DESTAQUE",
    title: (
      <>
        Até <em className="text-gold-light not-italic">30% OFF</em> em Cheyenne
      </>
    ),
    sub: "+ até 10% de desconto pagando no Pix. Estoque limitado.",
    ctas: [{ label: "não perca", href: "#ofertas", variant: "gold" }],
    gradient: "radial-gradient(ellipse at 70% 30%, rgba(201,162,74,.22), transparent 55%), linear-gradient(135deg, #151210, #000)",
  },
  {
    eyebrow: "FRETE GRÁTIS",
    title: (
      <>
        Envio grátis para <em className="text-gold-light not-italic">todo o Brasil</em>
      </>
    ),
    sub: "Em compras acima de R$ 350, sem cupom, sem pegadinha.",
    ctas: [{ label: "Comprar agora", href: "#produtos", variant: "gold" }],
    gradient: "radial-gradient(ellipse at 50% 20%, rgba(201,162,74,.2), transparent 55%), linear-gradient(135deg, #100d0b, #000)",
  },
];

const AUTOPLAY_MS = 6000;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused]);

  function changeSlide(delta: number) {
    setIndex((current) => (current + delta + SLIDES.length) % SLIDES.length);
  }

  return (
    <section
      className="relative overflow-hidden border-b border-line"
      aria-roledescription="carrossel"
      aria-label="Destaques promocionais"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <button
        type="button"
        aria-label="Slide anterior"
        onClick={() => changeSlide(-1)}
        className="absolute top-1/2 left-4 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gold-dark bg-bg/70 text-xl text-gold-light hover:bg-gold hover:text-bg"
      >
        ‹
      </button>

      <div
        className="flex transition-transform duration-[400ms] ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className="flex min-h-[380px] w-full shrink-0 items-center px-[90px] py-[60px] max-lg:px-15 max-sm:min-h-[320px] max-sm:px-5 max-sm:py-9"
            style={{ backgroundImage: slide.gradient }}
          >
            <div className="max-w-[600px]">
              <p className="text-xs font-semibold tracking-[0.3em] text-gold">{slide.eyebrow}</p>
              <h1 className="my-3.5 text-[clamp(30px,4.5vw,50px)] text-cream">{slide.title}</h1>
              <p className="mb-6 max-w-[460px] text-[15px] text-muted">{slide.sub}</p>
              <div className="flex flex-wrap gap-3.5">
                {slide.ctas.map((cta) => (
                  <a
                    key={cta.label}
                    href={cta.href}
                    className={
                      cta.variant === "gold"
                        ? "inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-semibold text-bg hover:bg-gold-light"
                        : "inline-flex items-center gap-2 rounded-full border border-gold px-7 py-3 text-sm font-semibold text-gold-light hover:bg-gold/10"
                    }
                  >
                    {cta.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Próximo slide"
        onClick={() => changeSlide(1)}
        className="absolute top-1/2 right-4 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gold-dark bg-bg/70 text-xl text-gold-light hover:bg-gold hover:text-bg"
      >
        ›
      </button>

      <div className="absolute right-0 bottom-4 left-0 flex justify-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Ir para o slide ${i + 1}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            className={`h-[9px] w-[9px] rounded-full p-0 ${i === index ? "bg-gold" : "bg-white/25"}`}
          />
        ))}
      </div>
    </section>
  );
}
