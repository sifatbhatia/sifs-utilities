"use client";

import Link from "next/link";
import clsx from "clsx";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  ArrowDown,
  Sparkles,
  Image as ImageIcon,
  Video,
  FileText,
  CircleDashed,
  Zap,
  LayoutGrid,
  Fingerprint,
  Shield,
  Cpu,
} from "lucide-react";
import { useRef } from "react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.06 * i,
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const MARQUEE_ITEMS = [
  "PixSqueeze",
  "PDFPress",
  "VidSqueeze",
  "CircleCrop",
  "MetaShield",
  "SynthClean",
  "GrainPix",
  "IconSet",
  "Client-side",
  "Private",
  "No account",
];

const BENTO = [
  {
    name: "PixSqueeze",
    tag: "Images",
    desc: "Compress with a live before / after — stays on your device.",
    href: "/pixsqueeze",
    icon: ImageIcon,
    className:
      "md:col-span-7 md:row-span-2 min-h-[260px] md:min-h-0 bg-gradient-to-br from-[#e8e8e8] to-[#dcdcdc] border-black/[0.06]",
    iconClass: "text-blue-600 bg-blue-100",
    featured: true,
  },
  {
    name: "VidSqueeze",
    tag: "Video",
    desc: "FFmpeg in the browser. CRF control, queue, export.",
    href: "/vidsqueeze",
    icon: Video,
    className:
      "md:col-span-5 md:col-start-8 md:row-start-1 min-h-[200px] bg-[#e5e5e5] border-black/[0.06]",
    iconClass: "text-orange-600 bg-orange-100",
  },
  {
    name: "PDFPress",
    tag: "Documents",
    desc: "Shrink PDFs without sending them to us.",
    href: "/pdf-compressor",
    icon: FileText,
    className:
      "md:col-span-5 md:col-start-8 md:row-start-2 min-h-[200px] bg-[#e5e5e5] border-black/[0.06]",
    iconClass: "text-red-600 bg-red-100",
  },
  {
    name: "CircleCrop",
    tag: "Crop",
    desc: "Perfect circular exports for avatars.",
    href: "/circle-crop",
    icon: CircleDashed,
    className:
      "md:col-span-4 md:row-start-3 min-h-[180px] bg-[#e5e5e5] border-black/[0.06]",
    iconClass: "text-purple-600 bg-purple-100",
  },
  {
    name: "MetaShield",
    tag: "Privacy",
    desc: "Scrub metadata from images, PDFs, and more.",
    href: "/meta-shield",
    icon: Zap,
    className:
      "md:col-span-4 md:row-start-3 md:col-start-5 min-h-[180px] bg-[#e5e5e5] border-black/[0.06]",
    iconClass: "text-indigo-600 bg-indigo-100",
  },
  {
    name: "SynthClean",
    tag: "Research",
    desc: "EXIF strip + optional spectral softening for AI exports.",
    href: "/synth-strip",
    icon: Fingerprint,
    className:
      "md:col-span-4 md:row-start-3 md:col-start-9 min-h-[180px] bg-[#e5e5e5] border-black/[0.06]",
    iconClass: "text-amber-800 bg-amber-100",
  },
];

const STEPS = [
  {
    title: "Pick a tool",
    body: "Each workspace opens instantly — no signup wall.",
    icon: LayoutGrid,
  },
  {
    title: "Process locally",
    body: "Files run in your tab. We don’t operate a separate upload farm for these flows.",
    icon: Shield,
  },
  {
    title: "Export clean",
    body: "Download PNG, ZIP, or compressed media with the same visual language end-to-end.",
    icon: Cpu,
  },
] as const;

function MarqueeRow() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="relative overflow-hidden border-y border-black/[0.07] bg-[#c8c8c8]/40 py-3 sm:py-4">
      <div className="landing-marquee-track gap-10 sm:gap-14 pr-10 sm:pr-14 items-center">
        {doubled.map((label, i) => (
          <span
            key={`${label}-${i}`}
            className="shrink-0 text-[11px] sm:text-xs font-bold uppercase tracking-[0.35em] text-zinc-600/90"
          >
            {label}
          </span>
        ))}
      </div>
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-[#cecece] to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-[#cecece] to-transparent"
        aria-hidden
      />
    </div>
  );
}

export default function LandingPage() {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 120]);
  const y2 = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 200]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.55], [1, 0.35]);

  return (
    <div className="min-h-dvh bg-[#cecece] text-primary selection:bg-black selection:text-white font-sans overflow-x-clip">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 landing-grain z-[1]" />
        <motion.div style={{ y: y1 }} className="absolute -top-[40%] -left-[20%] w-[90vmin] h-[90vmin] rounded-full bg-indigo-400/[0.11] blur-[100px] sm:blur-[140px] landing-orb-drift" />
        <motion.div style={{ y: y2 }} className="absolute top-[20%] -right-[25%] w-[80vmin] h-[80vmin] rounded-full bg-violet-500/[0.09] blur-[90px] sm:blur-[130px] landing-orb-drift-delayed" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-[45%] bg-gradient-to-t from-[#b8b8b8]/30 to-transparent" />
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-[#cecece]/75 backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4 md:px-10 pt-[max(0.75rem,env(safe-area-inset-top,0px))]">
          <Link
            href="/"
            className="group flex items-center gap-2 touch-manipulation rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-800"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-800 text-white shadow-lg shadow-black/10">
              <Sparkles className="h-4 w-4" strokeWidth={1.8} />
            </span>
            <span className="text-sm font-semibold tracking-tight text-zinc-900 sm:text-base">
              {"Sif's Utilities"}
            </span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3" aria-label="Primary">
            <Link
              href="/sif/utils"
              className="touch-manipulation rounded-full border border-black/10 bg-white/50 px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-zinc-700 transition-colors hover:bg-white hover:text-zinc-900 sm:px-5 sm:text-xs"
            >
              All tools
            </Link>
            <Link
              href="/sif/utils"
              className="touch-manipulation inline-flex min-h-11 items-center gap-2 rounded-full bg-zinc-800 px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white shadow-lg shadow-black/15 transition-transform active:scale-[0.98] hover:bg-zinc-900 sm:px-6 sm:text-xs"
            >
              Open hub
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section
          ref={heroRef}
          className="relative px-4 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-14 md:px-10 md:pb-32 md:pt-20"
        >
          <motion.div
            style={{ opacity: opacityHero }}
            className="relative mx-auto max-w-[1600px]"
          >
            <motion.div
              initial="hidden"
              animate="show"
              className="max-w-5xl"
            >
              <motion.p
                variants={fadeUp}
                custom={0}
                initial="hidden"
                animate="show"
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 sm:mb-6 sm:px-4 sm:text-[11px]"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Browser-native creative utilities
              </motion.p>

              <div className="overflow-hidden">
                <motion.h1
                  variants={fadeUp}
                  custom={1}
                  initial="hidden"
                  animate="show"
                  className="text-[2.65rem] font-medium leading-[0.92] tracking-[-0.085em] text-zinc-900 sm:text-6xl sm:leading-[0.9] md:text-7xl lg:text-[min(7.5rem,11vw)] lg:leading-[0.88]"
                >
                  Tools that feel
                  <br />
                  <span className="bg-gradient-to-r from-zinc-800 via-zinc-600 to-zinc-800 bg-clip-text text-transparent">
                    studio-grade
                  </span>
                  <br />
                  <span className="text-zinc-500">without the studio.</span>
                </motion.h1>
              </div>

              <motion.p
                variants={fadeUp}
                custom={2}
                initial="hidden"
                animate="show"
                className="mt-6 max-w-xl text-base font-medium leading-relaxed text-zinc-600 sm:mt-8 sm:text-lg md:text-xl"
              >
                Compress, crop, clean, and package media in one cohesive gray-space UI — tuned for
                phones and desktops alike.
              </motion.p>

              <motion.div
                variants={fadeUp}
                custom={3}
                initial="hidden"
                animate="show"
                className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center"
              >
                <Link
                  href="/sif/utils"
                  className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-[22px] bg-zinc-800 px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.45)] transition-all hover:bg-zinc-900 active:scale-[0.99] touch-manipulation sm:min-h-14 sm:rounded-[28px] sm:px-10 sm:text-base"
                >
                  Explore the suite
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href="#suite"
                  className="inline-flex min-h-12 items-center justify-center rounded-[22px] border-2 border-zinc-800/15 bg-white/30 px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-zinc-800 backdrop-blur-sm transition-colors hover:bg-white/50 touch-manipulation sm:min-h-14 sm:rounded-[28px]"
                >
                  Scroll to tools
                </a>
              </motion.div>
            </motion.div>

            {/* Mobile / tablet preview card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none relative mx-auto mt-12 max-w-md select-none lg:hidden"
              aria-hidden
            >
              <div className="rounded-[28px] border border-black/10 bg-[#e5e5e5] p-5 shadow-xl sm:rounded-[32px] sm:p-6">
                <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-zinc-500 sm:text-[10px]">
                  <span>Workspace</span>
                  <span className="text-emerald-600">Live</span>
                </div>
                <div className="mt-4 aspect-[16/10] rounded-2xl bg-gradient-to-br from-zinc-300 to-zinc-400/70" />
                <div className="mt-4 flex items-center justify-between rounded-xl bg-white/50 px-3 py-2.5 sm:px-4">
                  <span className="text-[10px] font-bold uppercase tracking-tight text-zinc-600 sm:text-xs">
                    Saved
                  </span>
                  <span className="text-base font-bold text-emerald-600 sm:text-lg">−42%</span>
                </div>
              </div>
            </motion.div>

            {/* Hero card stack visual — desktop */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none relative mx-auto mt-14 hidden max-w-lg select-none lg:block lg:mt-0 lg:absolute lg:right-4 lg:top-1/2 lg:mt-0 lg:w-[min(38%,420px)] lg:-translate-y-1/2 xl:right-10"
              aria-hidden
            >
              <div className="relative aspect-[4/5] w-full">
                <div className="absolute inset-0 rotate-[-6deg] rounded-[36px] border border-black/10 bg-[#d4d4d4] shadow-2xl" />
                <div className="absolute inset-0 translate-x-3 translate-y-3 rotate-[4deg] rounded-[36px] border border-black/10 bg-[#dedede] shadow-xl" />
                <div className="absolute inset-0 flex flex-col justify-between rounded-[36px] border border-black/10 bg-[#e5e5e5] p-7 shadow-2xl">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    <span>Queue</span>
                    <span>Live</span>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 w-3/4 rounded-full bg-zinc-300/80" />
                    <div className="h-2 w-1/2 rounded-full bg-zinc-300/60" />
                    <div className="mt-6 aspect-video rounded-2xl bg-gradient-to-br from-zinc-300 to-zinc-400/80" />
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-white/50 px-4 py-3">
                    <span className="text-xs font-bold text-zinc-600">Saved</span>
                    <span className="text-lg font-bold text-emerald-600">−42%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="mx-auto mt-16 flex max-w-[1600px] justify-center sm:mt-24"
          >
            <a
              href="#suite"
              className="flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-[0.35em] text-zinc-500 touch-manipulation"
            >
              <span>Discover</span>
              <motion.span
                animate={reduce ? {} : { y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              >
                <ArrowDown className="h-5 w-5" />
              </motion.span>
            </a>
          </motion.div>
        </section>

        <MarqueeRow />

        {/* Bento */}
        <section
          id="suite"
          className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20 md:px-10 md:py-28"
        >
          <div className="mx-auto max-w-[1600px]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mb-10 max-w-2xl sm:mb-14"
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-zinc-500">
                The suite
              </p>
              <h2 className="mt-3 text-3xl font-medium leading-tight tracking-[-0.06em] text-zinc-900 sm:text-4xl md:text-5xl lg:text-6xl">
                Eight tools.
                <br />
                One visual language.
              </h2>
              <p className="mt-4 text-base font-medium text-zinc-600 sm:text-lg">
                Tap any tile — same rounded corners, same calm gray surfaces, same motion you already
                know from the hub.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:grid-rows-[minmax(160px,auto)_minmax(160px,auto)_auto] md:gap-4">
              {BENTO.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 26 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      delay: reduce ? 0 : 0.06 * index,
                      duration: 0.55,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={clsx(
                      "group relative rounded-[28px] border p-5 shadow-sm transition-shadow duration-300 hover:shadow-xl sm:rounded-[32px] sm:p-6 md:p-7",
                      item.className,
                    )}
                  >
                    <Link
                      href={item.href}
                      className="absolute inset-0 z-10 rounded-[28px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-800 sm:rounded-[32px]"
                    >
                      <span className="sr-only">{item.name}</span>
                    </Link>
                    <div className="relative z-[1] flex h-full flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">
                          {item.tag}
                        </span>
                        <div
                          className={clsx(
                            "flex h-11 w-11 items-center justify-center rounded-2xl sm:h-12 sm:w-12",
                            item.iconClass,
                          )}
                        >
                          <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.5} />
                        </div>
                      </div>
                      <div className="mt-auto pt-8">
                        <h3
                          className={clsx(
                            "font-bold text-zinc-900",
                            item.featured ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl",
                          )}
                        >
                          {item.name}
                        </h3>
                        <p className="mt-2 max-w-md text-sm font-medium leading-relaxed text-zinc-600 sm:text-base">
                          {item.desc}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-800 opacity-0 transition-opacity group-hover:opacity-100 sm:text-sm">
                          Launch
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                    {item.featured && (
                      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-blue-400/10 blur-3xl" />
                    )}
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-6 text-center md:mt-8"
            >
              <Link
                href="/sif/utils"
                className="inline-flex min-h-12 items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-700 underline decoration-2 underline-offset-4 hover:text-zinc-900 touch-manipulation"
              >
                View full grid including GrainPix &amp; IconSet
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Steps */}
        <section className="border-t border-black/[0.06] bg-[#c4c4c4]/25 px-4 py-16 sm:px-6 sm:py-20 md:px-10 md:py-24">
          <div className="mx-auto max-w-[1600px]">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center text-2xl font-medium tracking-[-0.05em] text-zinc-900 sm:text-3xl md:text-4xl"
            >
              {`How you move through Sif's Utilities`}
            </motion.h2>
            <div className="mt-12 grid gap-6 sm:mt-16 md:grid-cols-3 md:gap-8">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: reduce ? 0 : i * 0.1 }}
                    className="relative rounded-[28px] border border-black/[0.07] bg-[#e5e5e5]/90 p-6 sm:rounded-[32px] sm:p-8"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800 text-white">
                      <Icon className="h-6 w-6" strokeWidth={1.5} />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-2 text-xl font-bold text-zinc-900">{step.title}</h3>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-zinc-600 sm:text-base">
                      {step.body}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-16 sm:px-6 sm:py-20 md:px-10 md:py-28">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto max-w-[1600px] overflow-hidden rounded-[36px] border border-black/10 bg-gradient-to-br from-zinc-800 to-zinc-900 px-6 py-12 text-center shadow-2xl sm:rounded-[48px] sm:px-10 sm:py-16 md:py-20"
          >
            <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-indigo-400/10 blur-3xl" />
            <h2 className="relative text-2xl font-medium leading-tight tracking-[-0.04em] text-white sm:text-3xl md:text-4xl lg:text-5xl">
              Ready when you are.
            </h2>
            <p className="relative mx-auto mt-4 max-w-lg text-sm font-medium text-zinc-300 sm:text-base">
              Jump into the classic hub layout — every tool is one tap away.
            </p>
            <Link
              href="/sif/utils"
              className="relative mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-zinc-900 transition-transform hover:bg-zinc-100 active:scale-[0.98] touch-manipulation sm:mt-10 sm:min-h-14 sm:px-10"
            >
              Open Sif&apos;s Utilities
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </section>

        <footer className="border-t border-black/[0.08] px-4 py-10 sm:px-6 md:px-10 pb-[max(2.5rem,env(safe-area-inset-bottom,0px))]">
          <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <p className="text-xs font-semibold text-zinc-600">
              {"Sif's Utilities"} · Built with Next.js &amp; Framer Motion
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold uppercase tracking-widest text-zinc-500">
              <Link href="/sif/utils" className="hover:text-zinc-800 touch-manipulation">
                Tools
              </Link>
              <span aria-hidden className="text-zinc-400">
                ·
              </span>
              <Link href="/pixsqueeze" className="hover:text-zinc-800 touch-manipulation">
                PixSqueeze
              </Link>
              <span aria-hidden className="text-zinc-400">
                ·
              </span>
              <Link href="/vidsqueeze" className="hover:text-zinc-800 touch-manipulation">
                VidSqueeze
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
