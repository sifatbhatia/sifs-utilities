"use client";

import Link from "next/link";
import clsx from "clsx";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  ArrowRight,
  ChevronRight,
  LayoutGrid,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import type { SiteTool } from "@/data/siteTools";
import { SITE_TOOLS } from "@/data/siteTools";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function toolByName(name: string): SiteTool {
  const t = SITE_TOOLS.find((x) => x.name === name);
  if (!t) throw new Error(`Unknown tool: ${name}`);
  return t;
}

const BENTO_ORDER = [
  { name: "PixSqueeze" as const, grid: "col-span-12 md:col-span-7 md:row-span-2 min-h-[220px] md:min-h-[340px]", featured: true },
  { name: "VidSqueeze" as const, grid: "col-span-12 md:col-span-5 md:col-start-8 md:row-start-1 min-h-[180px] md:min-h-[160px]" },
  { name: "PDFPress" as const, grid: "col-span-12 md:col-span-5 md:col-start-8 md:row-start-2 min-h-[180px] md:min-h-[160px]" },
  { name: "MetaShield" as const, grid: "col-span-12 md:col-span-4 md:row-start-3 min-h-[170px]" },
  { name: "CircleCrop" as const, grid: "col-span-12 md:col-span-4 md:col-start-5 md:row-start-3 min-h-[170px]" },
  { name: "SynthClean" as const, grid: "col-span-12 md:col-span-4 md:col-start-9 md:row-start-3 min-h-[170px]" },
  { name: "GrainPix" as const, grid: "col-span-12 md:col-span-4 md:row-start-4 min-h-[170px]" },
  { name: "IconSet" as const, grid: "col-span-12 md:col-span-4 md:col-start-5 md:row-start-4 min-h-[170px]" },
] as const;

const MARQUEE = [
  ...SITE_TOOLS.map((t) => t.name),
  "Client-side",
  "Private",
  "No account",
  "No ads",
  "Fast",
];

const PILLARS = [
  {
    title: "Tired of those other sites?",
    body: "So was I — half the utilities online feel abandoned, half bury you in ads and trackers, and plenty still load like it’s 2012. This suite is the opposite: quick to open, easy to read, and kept current.",
    icon: Zap,
  },
  {
    title: "Runs locally",
    body: "Your files stay in the browser for these workflows — no upload queue on our side, nothing to wade through before you can start.",
    icon: Shield,
  },
  {
    title: "One loud, honest UI",
    body: "Thick black frames, flat color blocks, and hard offset shadows — the same visual rules from this page into every tool. Big tap targets, safe areas, no glassmorphism theater.",
    icon: Sparkles,
  },
] as const;

function BentoTile({
  t,
  className,
  featured,
}: {
  t: SiteTool;
  className?: string;
  featured?: boolean;
}) {
  const Icon = t.Icon;
  return (
    <Link
      href={t.href}
      className={clsx(
        "lp-reveal group relative block touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neo-ink",
        className,
      )}
    >
      <div
        className={clsx(
          "flex h-full min-h-[inherit] flex-col rounded-xl border-[3px] border-neo-ink bg-white p-5 shadow-[6px_6px_0_0_#0a0a0a] transition-[transform,box-shadow] duration-150 sm:p-6 md:p-7",
          "hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[4px_4px_0_0_#0a0a0a] active:translate-x-1 active:translate-y-1",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <span className="text-[9px] font-black uppercase tracking-[0.28em] text-neo-ink/50 sm:text-[10px]">
            Tool
          </span>
          <div
            className={clsx(
              "flex shrink-0 items-center justify-center border-[3px] border-neo-ink",
              featured ? "h-12 w-12 sm:h-14 sm:w-14" : "h-10 w-10 sm:h-11 sm:w-11",
              t.iconBg,
            )}
          >
            <Icon
              className={clsx(featured ? "h-6 w-6 sm:h-7 sm:w-7" : "h-5 w-5", t.iconClass)}
              strokeWidth={1.5}
            />
          </div>
        </div>
        <div className="mt-auto pt-6 sm:pt-8">
          <h3
            className={clsx(
              "font-black tracking-tight text-neo-ink",
              featured ? "text-2xl sm:text-3xl md:text-4xl" : "text-lg sm:text-xl md:text-2xl",
            )}
          >
            {t.name}
          </h3>
          <p
            className={clsx(
              "mt-1.5 font-semibold leading-relaxed text-neo-ink/65 sm:mt-2",
              featured ? "text-sm sm:text-base max-w-md" : "text-xs sm:text-sm line-clamp-2 md:line-clamp-none",
            )}
          >
            {t.description}
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neo-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:text-xs">
            Open
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function LandingPage() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        gsap.set(
          ".lp-hero-line-inner, .lp-nav, .lp-fade, .lp-hero-cta, .lp-reveal, .lp-pillar, .lp-cta-inner",
          { clearProps: "all" },
        );
        return;
      }

      gsap.set(".lp-hero-line-inner", { yPercent: 108 });
      gsap.set(".lp-nav", { opacity: 0, y: -16 });
      gsap.set(".lp-fade", { opacity: 0, y: 32 });
      gsap.set(".lp-hero-cta", { opacity: 0, y: 24 });
      gsap.set(".lp-reveal", { opacity: 0, y: 48 });
      gsap.set(".lp-pillar", { opacity: 0, y: 40 });
      gsap.set(".lp-cta-inner", { opacity: 0, y: 36 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(".lp-nav", { opacity: 1, y: 0, duration: 0.55 }, 0)
        .to(".lp-hero-line-inner", { yPercent: 0, duration: 0.92, stagger: 0.12 }, 0.08)
        .to(".lp-fade", { opacity: 1, y: 0, duration: 0.58, stagger: 0.07 }, "-=0.42")
        .to(".lp-hero-cta", { opacity: 1, y: 0, duration: 0.52, stagger: 0.07 }, "-=0.38");

      ScrollTrigger.batch(".lp-reveal", {
        batchMax: 14,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.72,
            stagger: 0.05,
            ease: "power2.out",
            overwrite: true,
          }),
        start: "top 90%",
        once: true,
      });

      ScrollTrigger.batch(".lp-pillar", {
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.68,
            stagger: 0.14,
            ease: "power2.out",
            overwrite: true,
          }),
        start: "top 88%",
        once: true,
      });

      ScrollTrigger.batch(".lp-cta-inner", {
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.1,
            ease: "power2.out",
            overwrite: true,
          }),
        start: "top 85%",
        once: true,
      });

      const onResize = () => {
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    },
    { scope: root },
  );

  const doubledMarquee = [...MARQUEE, ...MARQUEE];

  return (
    <main
      ref={root}
      className="relative min-h-dvh bg-neo-bg font-sans text-foreground selection:bg-neo-ink selection:text-white neo-page-grid"
    >
      <nav className="lp-nav sticky top-0 z-50 border-b-[3px] border-neo-ink bg-neo-yellow shadow-[0_4px_0_0_#0a0a0a]">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 md:px-10 pt-[max(0.5rem,env(safe-area-inset-top,0px))]">
          <Link
            href="/"
            className="flex min-h-11 min-w-11 items-center gap-2.5 touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neo-ink sm:gap-3"
          >
            <span className="flex h-9 w-9 items-center justify-center border-[3px] border-neo-ink bg-white shadow-[3px_3px_0_0_#0a0a0a] sm:h-10 sm:w-10">
              <LayoutGrid className="h-4 w-4 text-neo-ink sm:h-[18px] sm:w-[18px]" strokeWidth={2.25} />
            </span>
            <span className="hidden text-sm font-black tracking-tight text-neo-ink sm:inline sm:text-base">
              {"Sif's Utilities"}
            </span>
          </Link>
          <Link
            href="/sif/utils"
            className="inline-flex min-h-11 items-center gap-2 border-[3px] border-neo-ink bg-neo-ink px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-[4px_4px_0_0_#62f5cd] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#62f5cd] active:translate-x-1 active:translate-y-1 touch-manipulation sm:px-6 sm:text-xs"
          >
            Hub
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex min-h-[min(100dvh,56rem)] flex-col justify-center px-4 pb-14 pt-6 sm:px-6 sm:pb-20 sm:pt-10 md:px-10 md:pb-28 md:pt-14">
        <div className="mx-auto max-w-[1600px]">
          <p className="lp-fade mb-4 inline-block border-[3px] border-neo-ink bg-neo-mint px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.28em] text-neo-ink shadow-[3px_3px_0_0_#0a0a0a] sm:mb-6 sm:text-[11px]">
            Browser-native suite
          </p>

          <div className="max-w-[min(100%,52rem)] lg:max-w-[min(100%,64rem)]">
            <h1 className="text-[2.75rem] font-black leading-[0.88] tracking-[-0.06em] text-neo-ink sm:text-6xl md:text-7xl lg:text-[min(6.5rem,9.2vw)]">
              <span className="lp-hero-line block overflow-hidden pb-[0.06em]">
                <span className="lp-hero-line-inner block">Sif&apos;s</span>
              </span>
              <span className="lp-hero-line block overflow-hidden pb-[0.06em]">
                <span className="lp-hero-line-inner block">Utilities</span>
              </span>
            </h1>
          </div>

          <p className="lp-fade mt-6 max-w-xl text-base font-semibold leading-relaxed text-neo-ink/70 sm:mt-8 sm:text-lg md:max-w-2xl md:text-xl">
            Compress, transcode, crop, scrub metadata, tune exports — eight focused workspaces with
            one shared design language, without the usual crawl through slow, ad-heavy, or
            half-forgotten utility sites.
          </p>

          <div className="lp-hero-cta mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href="/sif/utils"
              className="inline-flex min-h-[3rem] items-center justify-center gap-2.5 border-[3px] border-neo-ink bg-neo-ink px-8 py-3 text-sm font-black uppercase tracking-wide text-white shadow-[6px_6px_0_0_#ffe94a] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[4px_4px_0_0_#ffe94a] active:translate-x-1 active:translate-y-1 touch-manipulation sm:min-h-[3.25rem] sm:text-base"
            >
              Open the hub
              <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>
            <a
              href="#suite"
              className="inline-flex min-h-[3rem] items-center justify-center border-[3px] border-neo-ink bg-white px-8 py-3 text-sm font-black uppercase tracking-wide text-neo-ink shadow-[6px_6px_0_0_#0a0a0a] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[4px_4px_0_0_#0a0a0a] touch-manipulation sm:min-h-[3.25rem] sm:text-base"
            >
              Browse the suite
            </a>
          </div>

          {/* Mobile: horizontal snap picks */}
          <div
            className="lp-scroll-hint lp-fade mt-10 flex gap-3 overflow-x-auto pb-3 pl-1 sm:mt-12 md:hidden"
            aria-label="Featured tools"
          >
            {SITE_TOOLS.slice(0, 6).map((t) => {
              const Icon = t.Icon;
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  className="flex w-[min(17.5rem,calc(100vw-2.5rem))] shrink-0 touch-manipulation flex-col rounded-xl border-[3px] border-neo-ink bg-white p-4 shadow-[5px_5px_0_0_#0a0a0a] transition-transform active:translate-x-0.5 active:translate-y-0.5"
                >
                  <div
                    className={clsx(
                      "mb-3 flex h-10 w-10 items-center justify-center rounded-xl",
                      t.iconBg,
                    )}
                  >
                    <Icon className={clsx("h-5 w-5", t.iconClass)} strokeWidth={1.5} />
                  </div>
                  <p className="font-black text-neo-ink">{t.name}</p>
                  <p className="mt-1 line-clamp-2 text-xs font-semibold text-neo-ink/60">{t.description}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-neo-ink">
                    Open <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="relative z-10 border-y-[3px] border-neo-ink bg-neo-magenta py-3 sm:py-4">
        <div className="overflow-hidden">
          <div className="lp-marquee-track items-center pr-10 sm:pr-14">
            {doubledMarquee.map((label, i) => (
              <span
                key={`${label}-${i}`}
                className="shrink-0 text-[10px] font-black uppercase tracking-[0.32em] text-white sm:text-[11px]"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-neo-magenta to-transparent sm:w-20"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-neo-magenta to-transparent sm:w-20"
          aria-hidden
        />
      </div>

      {/* Bento */}
      <section
        id="suite"
        className="relative z-10 scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20 md:px-10 md:py-28"
      >
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-10 max-w-2xl sm:mb-14 md:mb-16">
            <p className="lp-reveal inline-block border-[3px] border-neo-ink bg-white px-2 py-1 text-[10px] font-black uppercase tracking-[0.32em] text-neo-ink shadow-[3px_3px_0_0_#0a0a0a] sm:text-[11px]">
              The suite
            </p>
            <h2 className="lp-reveal mt-3 text-3xl font-black leading-[0.92] tracking-[-0.05em] text-neo-ink sm:text-4xl md:text-5xl lg:text-6xl">
              Eight tools.
              <br />
              Built to match.
            </h2>
            <p className="lp-reveal mt-4 text-base font-semibold leading-relaxed text-neo-ink/70 sm:text-lg">
              Tiles scale with the viewport; on desktop the grid opens up. Every link goes straight
              into the live workspace.
            </p>
          </div>

          <div className="grid grid-cols-12 gap-3 sm:gap-4">
            {BENTO_ORDER.map((item) => (
              <BentoTile
                key={item.name}
                t={toolByName(item.name)}
                className={item.grid}
                featured={"featured" in item && item.featured === true}
              />
            ))}
            <Link
              href="/sif/utils"
              className="lp-reveal col-span-12 flex min-h-[160px] touch-manipulation flex-col justify-between rounded-xl border-[3px] border-dashed border-neo-ink bg-neo-lavender p-6 shadow-[6px_6px_0_0_#0a0a0a] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 sm:min-h-[170px] md:col-span-4 md:col-start-9 md:row-start-4 md:min-h-[170px]"
            >
              <LayoutGrid className="h-8 w-8 text-neo-ink" strokeWidth={2} aria-hidden />
              <div>
                <p className="text-lg font-black text-neo-ink sm:text-xl">Full hub grid</p>
                <p className="mt-1 text-sm font-semibold text-neo-ink/75">
                  Prefer the classic two-column tool wall? It&apos;s one tap away.
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neo-ink">
                  Open hub
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="relative z-10 border-t-[3px] border-neo-ink bg-neo-mint/40 px-4 py-16 sm:px-6 sm:py-20 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1600px]">
          <h2 className="lp-reveal text-center text-2xl font-black tracking-[-0.04em] text-neo-ink sm:text-3xl md:text-4xl">
            Why this exists
          </h2>
          <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
            {PILLARS.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="lp-pillar rounded-xl border-[3px] border-neo-ink bg-white p-6 shadow-[6px_6px_0_0_#0a0a0a] sm:p-8"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center border-[3px] border-neo-ink bg-neo-yellow text-neo-ink shadow-[3px_3px_0_0_#0a0a0a] sm:h-12 sm:w-12">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-black text-neo-ink sm:text-xl">{p.title}</h3>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-neo-ink/70 sm:text-base">
                    {p.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-4 py-16 sm:px-6 sm:py-20 md:px-10 md:py-24">
        <div className="lp-cta-inner relative mx-auto max-w-[1600px] overflow-hidden rounded-xl border-[3px] border-neo-ink bg-neo-ink px-6 py-12 text-center shadow-[8px_8px_0_0_#ff2d7a] sm:px-10 sm:py-16 md:py-20">
          <h2 className="relative text-2xl font-black leading-tight tracking-[-0.03em] text-white sm:text-3xl md:text-4xl lg:text-5xl">
            Pick up where you left off
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-sm font-semibold text-white/80 sm:text-base">
            The hub keeps every utility in one loud-clear grid — thumb reach on phones, wide layout
            on desktop.
          </p>
          <Link
            href="/sif/utils"
            className="relative mt-8 inline-flex min-h-12 items-center gap-2 border-[3px] border-neo-ink bg-neo-yellow px-8 py-3.5 text-sm font-black uppercase tracking-wide text-neo-ink shadow-[4px_4px_0_0_#ffffff] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 touch-manipulation sm:mt-10 sm:min-h-14 sm:px-10"
          >
            Enter the hub
            <ArrowRight className="h-5 w-5" aria-hidden />
          </Link>
        </div>
      </section>

      <footer className="relative z-10 border-t-[3px] border-neo-ink bg-neo-bg px-4 py-10 sm:px-6 md:px-10 pb-[max(2.5rem,env(safe-area-inset-bottom,0px))]">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="text-xs font-black text-neo-ink/60">
            {"Sif's Utilities"} · Next.js
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] font-black uppercase tracking-[0.2em] text-neo-ink/55 sm:text-xs">
            <Link href="/pixsqueeze" className="min-h-11 px-1 underline decoration-[3px] underline-offset-4 hover:text-neo-ink touch-manipulation sm:min-h-0">
              PixSqueeze
            </Link>
            <span className="text-neo-ink/30" aria-hidden>
              ·
            </span>
            <Link href="/vidsqueeze" className="min-h-11 px-1 underline decoration-[3px] underline-offset-4 hover:text-neo-ink touch-manipulation sm:min-h-0">
              VidSqueeze
            </Link>
            <span className="text-neo-ink/30" aria-hidden>
              ·
            </span>
            <Link href="/sif/utils" className="min-h-11 px-1 underline decoration-[3px] underline-offset-4 hover:text-neo-ink touch-manipulation sm:min-h-0">
              All tools
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
