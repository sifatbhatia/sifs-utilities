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
  Hammer,
  LayoutGrid,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import type { SiteTool } from "@/data/siteTools";
import { SITE_TOOLS } from "@/data/siteTools";
import { bentoTileChrome, landingChrome } from "@/lib/marketingChrome";

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
const LANDING_TOOL_LIMIT = 3;

const MARQUEE = [
  ...SITE_TOOLS.map((t) => t.name),
  "Runs in the browser",
  "No sign-in",
  "No ads",
  "Made for file chores",
];

const PILLARS = [
  {
    title: "Open the page, do the job",
    body: "Each tool starts on the work surface. There are no account prompts, pricing tables, or filler screens to get past.",
    icon: Zap,
  },
  {
    title: "Your files stay close",
    body: "Most jobs run in the browser. When a tool needs a local preview or export, it works with the file already on your device.",
    icon: Shield,
  },
  {
    title: "Plain controls",
    body: "Large drop zones, readable labels, and direct download buttons make the tools easy to use on a phone or a desktop.",
    icon: Sparkles,
  },
] as const;

const TASKS = [
  "Shrink a batch of images before sending them",
  "Make a PDF smaller without hunting for settings",
  "Crop a profile photo into a circle",
  "Strip metadata before sharing a file",
] as const;

function BentoTile({
  t,
  className,
  featured,
  tile,
}: {
  t: SiteTool;
  className?: string;
  featured?: boolean;
  tile: ReturnType<typeof bentoTileChrome>;
}) {
  const Icon = t.Icon;
  return (
    <Link
      href={t.href}
      className={clsx(
        "lp-reveal group relative block touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4",
        tile.focusRing,
        className,
      )}
    >
      <div className={clsx(tile.card, tile.cardHover)}>
        <div className="flex items-start justify-between gap-3">
          <span className={tile.label}>Tool</span>
          <div
            className={clsx(
              tile.iconFrame,
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
              tile.title,
              featured ? "text-2xl sm:text-3xl md:text-4xl" : "text-lg sm:text-xl md:text-2xl",
            )}
          >
            {t.name}
          </h3>
          <p
            className={clsx(
              tile.desc,
              featured ? "text-sm sm:text-base max-w-md" : "text-xs sm:text-sm line-clamp-2 md:line-clamp-none",
            )}
          >
            {t.description}
          </p>
          <span className={tile.openHint}>
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
  const theme = "classic";
  const lp = landingChrome(theme);
  const tile = bentoTileChrome(theme);
  const pillars = PILLARS;

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

      gsap.set(".lp-hero-line-inner", { yPercent: 108, filter: "blur(16px)", opacity: 0.15 });
      gsap.set(".lp-nav", { opacity: 0, y: -16 });
      gsap.set(".lp-fade", { opacity: 0, y: 32, filter: "blur(12px)" });
      gsap.set(".lp-hero-cta", { opacity: 0, y: 24 });
      gsap.set(".lp-reveal", { opacity: 0, y: 48 });
      gsap.set(".lp-pillar", { opacity: 0, y: 40 });
      gsap.set(".lp-cta-inner", { opacity: 0, y: 36 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(".lp-nav", { opacity: 1, y: 0, duration: 0.55 }, 0)
        .to(".lp-hero-line-inner", { yPercent: 0, filter: "blur(0px)", opacity: 1, duration: 0.92, stagger: 0.12 }, 0.08)
        .to(".lp-fade", { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.58, stagger: 0.07 }, "-=0.42")
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
    <main ref={root} className={lp.main}>
      <nav className={lp.nav}>
        <div className="mx-auto flex max-w-[1600px] flex-col gap-2 px-4 py-3 sm:px-6 sm:py-4 md:px-10 pt-[max(0.5rem,env(safe-area-inset-top,0px))]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/"
              className={clsx(
                "flex min-h-11 min-w-11 items-center gap-2.5 touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 sm:gap-3",
                lp.focusRing,
              )}
            >
              <span className={lp.logoMark}>
                <Hammer
                  className={clsx("h-4 w-4 sm:h-[18px] sm:w-[18px]", lp.deckIcon)}
                  strokeWidth={2.25}
                />
              </span>
              <span className={lp.brandWordmark}>{"Sif's Utilities"}</span>
            </Link>
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 sm:gap-3">
              <Link href="/sif/utils" className={lp.hubBtn}>
                Hub
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 px-4 pb-14 pt-10 sm:px-6 sm:pb-20 sm:pt-16 md:px-10 md:pb-28 md:pt-20">
        <div className="mx-auto grid min-h-[min(88dvh,52rem)] max-w-[1600px] items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,32rem)]">
          <div>
            <p className={lp.heroKicker}>Local file tools</p>

            <div className="max-w-[min(100%,58rem)]">
              <h1 className={lp.h1}>
                <span className="lp-hero-line block overflow-hidden pb-[0.06em]">
                  <span className="lp-hero-line-inner block">Useful tools</span>
                </span>
                <span className="lp-hero-line block overflow-hidden pb-[0.06em]">
                  <span className="lp-hero-line-inner block">for everyday files</span>
                </span>
              </h1>
            </div>

            <p className={lp.heroLead}>
              Resize images, compress videos, clean PDFs, remove metadata, build icons, and format
              JSON or YAML. Open a tool, drop a file, download the result.
            </p>

            <div className="lp-hero-cta mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center">
              <Link href="/sif/utils" className={lp.heroPrimaryCta}>
                Open all tools
                <ArrowRight className="h-5 w-5" aria-hidden />
              </Link>
              <a href="#suite" className={lp.heroGhostCta}>
                See common jobs
              </a>
            </div>
          </div>

          <aside className="lp-fade rounded-[1.75rem] border border-neutral-400/25 bg-white/70 p-4 shadow-xl shadow-neutral-700/10 backdrop-blur-md sm:p-5">
            <div className="rounded-[1.25rem] bg-[#575757] p-5 text-white sm:p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/55">
                Start here
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                Pick the chore, not the product category.
              </h2>
              <ul className="mt-6 space-y-3">
                {TASKS.map((task) => (
                  <li key={task} className="flex gap-3 text-sm leading-6 text-white/80">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/sif/utils"
                className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#575757] transition hover:bg-neutral-100"
              >
                Go to the tool list
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </aside>

          {/* Mobile: horizontal snap picks */}
          <div
            className="lp-scroll-hint lp-fade flex gap-3 overflow-x-auto pb-3 pl-1 md:hidden lg:col-span-2"
            aria-label="Featured tools"
          >
            {SITE_TOOLS.slice(0, LANDING_TOOL_LIMIT).map((t) => {
              const Icon = t.Icon;
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  className={lp.mobilePickCard}
                >
                  <div
                    className={clsx(
                      "mb-3 flex h-10 w-10 items-center justify-center rounded-xl",
                      t.iconBg,
                    )}
                  >
                    <Icon className={clsx("h-5 w-5", t.iconClass)} strokeWidth={1.5} />
                  </div>
                  <p className={lp.mobilePickTitle}>{t.name}</p>
                  <p className={lp.mobilePickDesc}>{t.description}</p>
                  <span className={clsx(lp.mobilePickOpen, "gap-1")}>
                    Open <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className={lp.marqueeStrip}>
        <div className="overflow-hidden">
          <div className="lp-marquee-track items-center pr-10 sm:pr-14">
            {doubledMarquee.map((label, i) => (
              <span key={`${label}-${i}`} className={lp.marqueeText}>
                {label}
              </span>
            ))}
          </div>
        </div>
        <div className={lp.marqueeFadeL} aria-hidden />
        <div className={lp.marqueeFadeR} aria-hidden />
      </div>

      {/* Bento */}
      <section
        id="suite"
        className="relative z-10 scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20 md:px-10 md:py-28"
      >
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-10 max-w-2xl sm:mb-14 md:mb-16">
            <p className={lp.suiteKicker}>Common jobs</p>
            <h2 className={lp.suiteH2}>
              Start with the file
              <br />
              in front of you.
            </h2>
            <p className={lp.suiteLead}>
              The most-used tools are here. The full list includes image, video, PDF, metadata,
              icon, JSON, and YAML utilities.
            </p>
          </div>

          <div className="grid grid-cols-12 gap-3 sm:gap-4">
            {BENTO_ORDER.slice(0, LANDING_TOOL_LIMIT).map((item) => (
              <BentoTile
                key={item.name}
                t={toolByName(item.name)}
                className={item.grid}
                featured={"featured" in item && item.featured === true}
                tile={tile}
              />
            ))}
          </div>
          <div className="mt-6 flex justify-center sm:mt-8">
            <Link href="/sif/utils" className={lp.heroPrimaryCta}>
              View the full list
              <LayoutGrid className="h-5 w-5" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className={lp.pillarsSection}>
        <div className="mx-auto max-w-[1600px]">
          <h2 className={lp.pillarsH2}>Why this exists</h2>
          <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className={lp.pillarCard}>
                  <div className={lp.pillarIconWrap}>
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
                  </div>
                  <h3 className={lp.pillarH3}>{p.title}</h3>
                  <p className={lp.pillarBody}>{p.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-4 py-16 sm:px-6 sm:py-20 md:px-10 md:py-24">
        <div className={lp.ctaBox}>
          <h2 className={lp.ctaH2}>Keep the tool list nearby</h2>
          <p className={lp.ctaLead}>
            Bookmark the hub for small jobs that are too annoying to do by hand and too simple
            to justify a full app.
          </p>
          <Link href="/sif/utils" className={lp.ctaBtn}>
            Open the hub
            <ArrowRight className="h-5 w-5" aria-hidden />
          </Link>
        </div>
      </section>

      <footer className={lp.footer}>
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className={lp.footerMeta}>{"Sif's Utilities"} · local-first file tools</p>
          <div className={lp.footerLinks}>
            <Link href="/pixsqueeze" className={lp.footerLink}>
              PixSqueeze
            </Link>
            <span className={lp.footerSep} aria-hidden>
              ·
            </span>
            <Link href="/vidsqueeze" className={lp.footerLink}>
              VidSqueeze
            </Link>
            <span className={lp.footerSep} aria-hidden>
              ·
            </span>
            <Link href="/sif/utils" className={lp.footerLink}>
              All tools
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
