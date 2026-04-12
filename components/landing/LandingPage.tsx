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
    title: "One calm workspace",
    body: "Same gray surfaces, rounded corners, and motion from here into each tool — touch-friendly targets, safe areas, and layouts that still breathe on a small screen.",
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
        "lp-reveal group relative block touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-800",
        className,
      )}
    >
      <div
        className={clsx(
          "flex h-full min-h-[inherit] flex-col rounded-[22px] border border-black/[0.07] bg-[#e5e5e5] p-5 shadow-sm transition-[transform,box-shadow,background-color] duration-300 sm:rounded-[28px] sm:p-6 md:p-7",
          "hover:bg-[#eaeaea] hover:shadow-lg active:bg-[#e0e0e0] sm:hover:-translate-y-0.5",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-zinc-500 sm:text-[10px]">
            Tool
          </span>
          <div
            className={clsx(
              "flex shrink-0 items-center justify-center rounded-xl sm:rounded-2xl",
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
              "font-bold tracking-tight text-zinc-900",
              featured ? "text-2xl sm:text-3xl md:text-4xl" : "text-lg sm:text-xl md:text-2xl",
            )}
          >
            {t.name}
          </h3>
          <p
            className={clsx(
              "mt-1.5 font-medium leading-relaxed text-zinc-600 sm:mt-2",
              featured ? "text-sm sm:text-base max-w-md" : "text-xs sm:text-sm line-clamp-2 md:line-clamp-none",
            )}
          >
            {t.description}
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-800 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:text-xs">
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
      className="relative min-h-dvh bg-[#cecece] font-sans text-foreground selection:bg-zinc-800 selection:text-white"
    >
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      <nav className="lp-nav sticky top-0 z-50 border-b border-black/[0.06] bg-[#cecece]/85 backdrop-blur-md backdrop-saturate-150">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 md:px-10 pt-[max(0.5rem,env(safe-area-inset-top,0px))]">
          <Link
            href="/"
            className="flex min-h-11 min-w-11 items-center gap-2.5 rounded-xl font-semibold tracking-tight text-zinc-900 touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-800 sm:gap-3"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-800 text-white shadow-md shadow-black/10 sm:h-10 sm:w-10">
              <LayoutGrid className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={1.75} />
            </span>
            <span className="hidden text-sm sm:inline sm:text-base">{"Sif's Utilities"}</span>
          </Link>
          <Link
            href="/sif/utils"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-zinc-800 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-lg shadow-black/12 transition-transform active:scale-[0.98] hover:bg-zinc-900 touch-manipulation sm:px-6 sm:text-xs"
          >
            Hub
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex min-h-[min(100dvh,56rem)] flex-col justify-center px-4 pb-14 pt-6 sm:px-6 sm:pb-20 sm:pt-10 md:px-10 md:pb-28 md:pt-14">
        <div className="mx-auto max-w-[1600px]">
          <p className="lp-fade mb-4 text-[10px] font-bold uppercase tracking-[0.32em] text-zinc-500 sm:mb-6 sm:text-[11px]">
            Browser-native suite
          </p>

          <div className="max-w-[min(100%,52rem)] lg:max-w-[min(100%,64rem)]">
            <h1 className="text-[2.75rem] font-medium leading-[0.9] tracking-[-0.085em] text-primary sm:text-6xl sm:leading-[0.88] md:text-7xl md:leading-[0.86] lg:text-[min(6.5rem,9.2vw)]">
              <span className="lp-hero-line block overflow-hidden pb-[0.06em]">
                <span className="lp-hero-line-inner block">Sif&apos;s</span>
              </span>
              <span className="lp-hero-line block overflow-hidden pb-[0.06em]">
                <span className="lp-hero-line-inner block">Utilities</span>
              </span>
            </h1>
          </div>

          <p className="lp-fade mt-6 max-w-xl text-base font-medium leading-relaxed text-zinc-600 sm:mt-8 sm:text-lg md:max-w-2xl md:text-xl">
            Compress, transcode, crop, scrub metadata, tune exports — eight focused workspaces with
            one shared design language, without the usual crawl through slow, ad-heavy, or
            half-forgotten utility sites.
          </p>

          <div className="lp-hero-cta mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href="/sif/utils"
              className="inline-flex min-h-[3rem] items-center justify-center gap-2.5 rounded-full bg-zinc-800 px-8 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-[0_12px_40px_-12px_rgba(0,0,0,0.45)] transition-transform hover:bg-zinc-900 active:scale-[0.99] touch-manipulation sm:min-h-[3.25rem] sm:text-base"
            >
              Open the hub
              <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>
            <a
              href="#suite"
              className="inline-flex min-h-[3rem] items-center justify-center rounded-full border-2 border-zinc-800/20 bg-[#e5e5e5]/80 px-8 py-3 text-sm font-bold uppercase tracking-wide text-zinc-800 transition-colors hover:border-zinc-800/35 hover:bg-[#eaeaea] touch-manipulation sm:min-h-[3.25rem] sm:text-base"
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
                  className="flex w-[min(17.5rem,calc(100vw-2.5rem))] shrink-0 touch-manipulation flex-col rounded-[22px] border border-black/[0.07] bg-[#e5e5e5] p-4 shadow-sm transition-transform active:scale-[0.99]"
                >
                  <div
                    className={clsx(
                      "mb-3 flex h-10 w-10 items-center justify-center rounded-xl",
                      t.iconBg,
                    )}
                  >
                    <Icon className={clsx("h-5 w-5", t.iconClass)} strokeWidth={1.5} />
                  </div>
                  <p className="font-bold text-zinc-900">{t.name}</p>
                  <p className="mt-1 line-clamp-2 text-xs font-medium text-zinc-500">{t.description}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-zinc-700">
                    Open <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="relative z-10 border-y border-black/[0.07] bg-[#c6c6c6]/50 py-3 sm:py-4">
        <div className="overflow-hidden">
          <div className="lp-marquee-track items-center pr-10 sm:pr-14">
            {doubledMarquee.map((label, i) => (
              <span
                key={`${label}-${i}`}
                className="shrink-0 text-[10px] font-bold uppercase tracking-[0.32em] text-zinc-600 sm:text-[11px]"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#c4c4c4] to-transparent sm:w-20"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#c4c4c4] to-transparent sm:w-20"
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
            <p className="lp-reveal text-[10px] font-bold uppercase tracking-[0.32em] text-zinc-500 sm:text-[11px]">
              The suite
            </p>
            <h2 className="lp-reveal mt-3 text-3xl font-medium leading-[0.95] tracking-[-0.06em] text-primary sm:text-4xl md:text-5xl lg:text-6xl">
              Eight tools.
              <br />
              Built to match.
            </h2>
            <p className="lp-reveal mt-4 text-base font-medium leading-relaxed text-zinc-600 sm:text-lg">
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
              className="lp-reveal col-span-12 flex min-h-[160px] touch-manipulation flex-col justify-between rounded-[22px] border border-dashed border-zinc-800/25 bg-[#d8d8d8]/80 p-6 transition-colors hover:border-zinc-800/40 hover:bg-[#dbdbdb] sm:min-h-[170px] sm:rounded-[28px] md:col-span-4 md:col-start-9 md:row-start-4 md:min-h-[170px]"
            >
              <LayoutGrid className="h-8 w-8 text-zinc-700" strokeWidth={1.25} aria-hidden />
              <div>
                <p className="text-lg font-bold text-zinc-900 sm:text-xl">Full hub grid</p>
                <p className="mt-1 text-sm font-medium text-zinc-600">
                  Prefer the classic two-column tool wall? It&apos;s one tap away.
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-800">
                  Open hub
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="relative z-10 border-t border-black/[0.06] bg-[#c9c9c9]/35 px-4 py-16 sm:px-6 sm:py-20 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1600px]">
          <h2 className="lp-reveal text-center text-2xl font-medium tracking-[-0.05em] text-primary sm:text-3xl md:text-4xl">
            Why this exists
          </h2>
          <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
            {PILLARS.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="lp-pillar rounded-[22px] border border-black/[0.07] bg-[#e5e5e5] p-6 sm:rounded-[28px] sm:p-8"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-800 text-white sm:h-12 sm:w-12">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 sm:text-xl">{p.title}</h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-zinc-600 sm:text-base">
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
        <div className="lp-cta-inner mx-auto max-w-[1600px] overflow-hidden rounded-[28px] border border-black/10 bg-zinc-800 px-6 py-12 text-center shadow-2xl shadow-black/20 sm:rounded-[40px] sm:px-10 sm:py-16 md:py-20">
          <div
            className="pointer-events-none absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-white/[0.04] blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-white/[0.03] blur-3xl"
            aria-hidden
          />
          <h2 className="relative text-2xl font-medium leading-tight tracking-[-0.04em] text-white sm:text-3xl md:text-4xl lg:text-5xl">
            Pick up where you left off
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-sm font-medium text-zinc-400 sm:text-base">
            The hub keeps every utility in one calm grid — optimized for thumb reach on phones and
            wide canvases on desktop.
          </p>
          <Link
            href="/sif/utils"
            className="relative mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-zinc-900 transition-transform hover:bg-zinc-100 active:scale-[0.98] touch-manipulation sm:mt-10 sm:min-h-14 sm:px-10"
          >
            Enter the hub
            <ArrowRight className="h-5 w-5" aria-hidden />
          </Link>
        </div>
      </section>

      <footer className="relative z-10 border-t border-black/[0.08] px-4 py-10 sm:px-6 md:px-10 pb-[max(2.5rem,env(safe-area-inset-bottom,0px))]">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="text-xs font-semibold text-zinc-600">
            {"Sif's Utilities"} · Next.js
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 sm:text-xs">
            <Link href="/pixsqueeze" className="min-h-11 px-1 hover:text-zinc-800 touch-manipulation sm:min-h-0">
              PixSqueeze
            </Link>
            <span className="text-zinc-400" aria-hidden>
              ·
            </span>
            <Link href="/vidsqueeze" className="min-h-11 px-1 hover:text-zinc-800 touch-manipulation sm:min-h-0">
              VidSqueeze
            </Link>
            <span className="text-zinc-400" aria-hidden>
              ·
            </span>
            <Link href="/sif/utils" className="min-h-11 px-1 hover:text-zinc-800 touch-manipulation sm:min-h-0">
              All tools
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
