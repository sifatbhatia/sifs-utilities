import type { ThemeId } from "@/lib/theme";

function pick3(theme: ThemeId, classic: string, glass: string, neo: string): string {
  if (theme === "classic") return classic;
  if (theme === "liquid-glass") return glass;
  return neo;
}

/** True “classic” marketing / hub: soft gray chrome before neo-brutalism. */
export function isClassicChrome(theme: ThemeId): boolean {
  return theme === "classic";
}

/**
 * Landing page (`/`) — classic calm · liquid glass · neo-brutal.
 */
export function landingChrome(theme: ThemeId) {
  const c = theme === "classic";
  const p = (cl: string, gl: string, neo: string) => pick3(theme, cl, gl, neo);
  return {
    c,
    main: p(
      "relative min-h-dvh bg-soft-gradient font-sans text-foreground selection:bg-neutral-500/20 selection:text-neutral-900",
      "relative min-h-dvh font-sans text-foreground neo-page-grid selection:bg-sky-400/25 selection:text-neutral-900",
      "relative min-h-dvh bg-neo-bg font-sans text-foreground selection:bg-neo-ink selection:text-white neo-page-grid",
    ),

    nav: p(
      "lp-nav sticky top-0 z-50 border-b border-neutral-400/25 bg-white/70 shadow-sm backdrop-blur-md",
      "lp-nav sticky top-0 z-50 border-b border-white/35 bg-white/25 shadow-[0_8px_40px_rgba(15,23,42,0.06)] backdrop-blur-2xl backdrop-saturate-150",
      "lp-nav sticky top-0 z-50 border-b-[3px] border-neo-ink bg-neo-yellow shadow-[0_4px_0_0_var(--neo-ink)]",
    ),

    hintRule: p(
      "border-t border-neutral-400/20 pt-2",
      "border-t border-white/25 pt-2",
      "border-t border-neo-ink/15 pt-2",
    ),

    logoMark: p(
      "flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-400/35 bg-white shadow-sm sm:h-10 sm:w-10",
      "flex h-9 w-9 items-center justify-center rounded-2xl border border-white/55 bg-white/40 shadow-lg backdrop-blur-xl sm:h-10 sm:w-10",
      "flex h-9 w-9 items-center justify-center border-[3px] border-neo-ink bg-white shadow-[3px_3px_0_0_var(--neo-ink)] sm:h-10 sm:w-10",
    ),

    brandWordmark: p(
      "hidden text-sm font-semibold tracking-tight text-[#575757] sm:inline sm:text-base",
      "hidden text-sm font-semibold tracking-tight text-neutral-900 sm:inline sm:text-base",
      "hidden text-sm font-black tracking-tight text-neo-ink sm:inline sm:text-base",
    ),

    hubBtn: p(
      "inline-flex min-h-11 items-center gap-2 rounded-full bg-[#575757] px-5 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-white shadow-md transition-colors hover:bg-[#4d4d4d] touch-manipulation sm:px-6 sm:text-xs",
      "inline-flex min-h-11 items-center gap-2 rounded-full bg-gradient-to-b from-sky-500 to-blue-600 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-white shadow-lg shadow-sky-500/25 transition hover:brightness-105 touch-manipulation sm:px-6 sm:text-xs",
      "inline-flex min-h-11 items-center gap-2 border-[3px] border-neo-ink bg-neo-ink px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-[4px_4px_0_0_#62f5cd] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#62f5cd] active:translate-x-1 active:translate-y-1 touch-manipulation sm:px-6 sm:text-xs",
    ),

    heroKicker: p(
      "lp-fade mb-4 inline-block rounded-full border border-neutral-400/30 bg-white/90 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-neutral-600 shadow-sm sm:mb-6 sm:text-[11px]",
      "lp-fade mb-4 inline-block rounded-full border border-white/50 bg-white/45 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-neutral-700 shadow-md backdrop-blur-md sm:mb-6 sm:text-[11px]",
      "lp-fade mb-4 inline-block border-[3px] border-neo-ink bg-neo-mint px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.28em] text-neo-ink shadow-[3px_3px_0_0_var(--neo-ink)] sm:mb-6 sm:text-[11px]",
    ),

    h1: p(
      "text-[2.75rem] font-bold leading-[0.92] tracking-normal text-[#575757] sm:text-6xl md:text-7xl lg:text-[6.25rem]",
      "text-[2.75rem] font-bold leading-[0.9] tracking-[-0.04em] text-neutral-950 sm:text-6xl md:text-7xl lg:text-[min(6.5rem,9.2vw)]",
      "text-[2.75rem] font-black leading-[0.88] tracking-[-0.06em] text-neo-ink sm:text-6xl md:text-7xl lg:text-[min(6.5rem,9.2vw)]",
    ),

    heroLead: p(
      "lp-fade mt-6 max-w-xl text-base font-normal leading-relaxed text-neutral-600 sm:mt-8 sm:text-lg md:max-w-2xl md:text-xl",
      "lp-fade mt-6 max-w-xl text-base font-medium leading-relaxed text-neutral-600 sm:mt-8 sm:text-lg md:max-w-2xl md:text-xl",
      "lp-fade mt-6 max-w-xl text-base font-semibold leading-relaxed text-neo-ink/70 sm:mt-8 sm:text-lg md:max-w-2xl md:text-xl",
    ),

    heroPrimaryCta: p(
      "inline-flex min-h-[3rem] items-center justify-center gap-2.5 rounded-full bg-[#575757] px-8 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#4d4d4d] touch-manipulation sm:min-h-[3.25rem] sm:text-base",
      "inline-flex min-h-[3rem] items-center justify-center gap-2.5 rounded-full bg-neutral-900 px-8 py-3 text-sm font-semibold text-white shadow-xl shadow-black/15 transition hover:bg-neutral-800 touch-manipulation sm:min-h-[3.25rem] sm:text-base",
      "inline-flex min-h-[3rem] items-center justify-center gap-2.5 border-[3px] border-neo-ink bg-neo-ink px-8 py-3 text-sm font-black uppercase tracking-wide text-white shadow-[6px_6px_0_0_#ffe94a] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[4px_4px_0_0_#ffe94a] active:translate-x-1 active:translate-y-1 touch-manipulation sm:min-h-[3.25rem] sm:text-base",
    ),

    heroGhostCta: p(
      "inline-flex min-h-[3rem] items-center justify-center rounded-full border border-neutral-400/45 bg-white px-8 py-3 text-sm font-semibold text-[#575757] shadow-sm transition hover:border-neutral-500 hover:shadow-md touch-manipulation sm:min-h-[3.25rem] sm:text-base",
      "inline-flex min-h-[3rem] items-center justify-center rounded-full border border-white/60 bg-white/50 px-8 py-3 text-sm font-semibold text-neutral-800 shadow-lg backdrop-blur-md transition hover:bg-white/65 touch-manipulation sm:min-h-[3.25rem] sm:text-base",
      "inline-flex min-h-[3rem] items-center justify-center border-[3px] border-neo-ink bg-white px-8 py-3 text-sm font-black uppercase tracking-wide text-neo-ink shadow-[6px_6px_0_0_var(--neo-ink)] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--neo-ink)] touch-manipulation sm:min-h-[3.25rem] sm:text-base",
    ),

    mobilePickCard: p(
      "flex w-[min(17.5rem,calc(100vw-2.5rem))] shrink-0 touch-manipulation flex-col rounded-2xl border border-neutral-400/25 bg-white p-4 shadow-md transition hover:shadow-lg active:scale-[0.99]",
      "flex w-[min(17.5rem,calc(100vw-2.5rem))] shrink-0 touch-manipulation flex-col rounded-3xl border border-white/45 bg-white/45 p-4 shadow-xl backdrop-blur-xl transition hover:shadow-2xl active:scale-[0.99]",
      "flex w-[min(17.5rem,calc(100vw-2.5rem))] shrink-0 touch-manipulation flex-col rounded-xl border-[3px] border-neo-ink bg-white p-4 shadow-[5px_5px_0_0_var(--neo-ink)] transition-transform active:translate-x-0.5 active:translate-y-0.5",
    ),

    mobilePickTitle: p("font-semibold text-neutral-900", "font-semibold text-neutral-900", "font-black text-neo-ink"),
    mobilePickDesc: p(
      "mt-1 line-clamp-2 text-xs font-medium text-neutral-600",
      "mt-1 line-clamp-2 text-xs font-medium text-neutral-600",
      "mt-1 line-clamp-2 text-xs font-semibold text-neo-ink/60",
    ),
    mobilePickOpen: p(
      "mt-3 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-neutral-700",
      "mt-3 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-neutral-700",
      "mt-3 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-neo-ink",
    ),

    marqueeStrip: p(
      "lp-marquee-strip relative z-10 border-y border-neutral-400/20 bg-neutral-200/90 py-3 sm:py-4",
      "lp-marquee-strip relative z-10 border-y border-white/35 bg-white/30 py-3 shadow-inner backdrop-blur-xl sm:py-4",
      "lp-marquee-strip relative z-10 border-y-[3px] border-neo-ink bg-neo-magenta py-3 sm:py-4",
    ),

    marqueeText: p(
      "shrink-0 text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-700 sm:text-[11px]",
      "shrink-0 text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-800 sm:text-[11px]",
      "shrink-0 text-[10px] font-black uppercase tracking-[0.32em] text-white sm:text-[11px]",
    ),

    marqueeFadeL: p(
      "pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-neutral-200 to-transparent sm:w-20",
      "pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white/70 to-transparent sm:w-20",
      "pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-neo-magenta to-transparent sm:w-20",
    ),

    marqueeFadeR: p(
      "pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-neutral-200 to-transparent sm:w-20",
      "pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white/70 to-transparent sm:w-20",
      "pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-neo-magenta to-transparent sm:w-20",
    ),

    suiteKicker: p(
      "lp-reveal inline-block rounded-full border border-neutral-400/30 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-neutral-600 shadow-sm sm:text-[11px]",
      "lp-reveal inline-block rounded-full border border-white/55 bg-white/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-neutral-700 shadow-md backdrop-blur-md sm:text-[11px]",
      "lp-reveal inline-block border-[3px] border-neo-ink bg-white px-2 py-1 text-[10px] font-black uppercase tracking-[0.32em] text-neo-ink shadow-[3px_3px_0_0_var(--neo-ink)] sm:text-[11px]",
    ),

    suiteH2: p(
      "lp-reveal mt-3 text-3xl font-bold leading-[0.95] tracking-normal text-[#575757] sm:text-4xl md:text-5xl lg:text-6xl",
      "lp-reveal mt-3 text-3xl font-bold leading-[0.95] tracking-[-0.03em] text-neutral-950 sm:text-4xl md:text-5xl lg:text-6xl",
      "lp-reveal mt-3 text-3xl font-black leading-[0.92] tracking-[-0.05em] text-neo-ink sm:text-4xl md:text-5xl lg:text-6xl",
    ),

    suiteLead: p(
      "lp-reveal mt-4 text-base font-normal leading-relaxed text-neutral-600 sm:text-lg",
      "lp-reveal mt-4 text-base font-medium leading-relaxed text-neutral-600 sm:text-lg",
      "lp-reveal mt-4 text-base font-semibold leading-relaxed text-neo-ink/70 sm:text-lg",
    ),

    hubPromoCard: p(
      "lp-reveal col-span-12 flex min-h-[160px] touch-manipulation flex-col justify-between rounded-2xl border border-dashed border-neutral-400/40 bg-white/80 p-6 shadow-md outline-none transition hover:shadow-lg sm:min-h-[170px] md:col-span-4 md:col-start-9 md:row-start-4 md:min-h-[170px]",
      "lp-reveal col-span-12 flex min-h-[160px] touch-manipulation flex-col justify-between rounded-3xl border border-dashed border-white/55 bg-gradient-to-br from-sky-400/20 to-violet-400/20 p-6 shadow-xl outline-none backdrop-blur-xl transition hover:shadow-2xl sm:min-h-[170px] md:col-span-4 md:col-start-9 md:row-start-4 md:min-h-[170px]",
      "lp-reveal col-span-12 flex min-h-[160px] touch-manipulation flex-col justify-between rounded-xl border-[3px] border-dashed border-neo-ink bg-neo-lavender p-6 shadow-[6px_6px_0_0_var(--neo-ink)] outline-none transition-transform hover:translate-x-0.5 hover:translate-y-0.5 sm:min-h-[170px] md:col-span-4 md:col-start-9 md:row-start-4 md:min-h-[170px]",
    ),

    pillarsSection: p(
      "relative z-10 border-t border-neutral-400/20 bg-white/45 px-4 py-16 sm:px-6 sm:py-20 md:px-10 md:py-24",
      "relative z-10 border-t border-white/30 bg-white/25 px-4 py-16 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] backdrop-blur-xl sm:px-6 sm:py-20 md:px-10 md:py-24",
      "relative z-10 border-t-[3px] border-neo-ink bg-neo-mint/40 px-4 py-16 sm:px-6 sm:py-20 md:px-10 md:py-24",
    ),

    pillarsH2: p(
      "lp-reveal text-center text-2xl font-bold tracking-[-0.03em] text-neutral-900 sm:text-3xl md:text-4xl",
      "lp-reveal text-center text-2xl font-bold tracking-[-0.03em] text-neutral-950 sm:text-3xl md:text-4xl",
      "lp-reveal text-center text-2xl font-black tracking-[-0.04em] text-neo-ink sm:text-3xl md:text-4xl",
    ),

    pillarCard: p(
      "lp-pillar rounded-2xl border border-white/50 bg-white/70 p-6 shadow-lg shadow-neutral-700/10 backdrop-blur-xl sm:p-8",
      "lp-pillar rounded-3xl border border-white/50 bg-white/50 p-6 shadow-xl backdrop-blur-xl sm:p-8",
      "lp-pillar rounded-xl border-[3px] border-neo-ink bg-white p-6 shadow-[6px_6px_0_0_var(--neo-ink)] sm:p-8",
    ),

    pillarIconWrap: p(
      "mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-400/35 bg-neutral-100 text-neutral-800 shadow-sm sm:h-12 sm:w-12",
      "mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/60 bg-gradient-to-br from-sky-400/25 to-blue-500/30 text-neutral-900 shadow-md backdrop-blur-md sm:h-12 sm:w-12",
      "mb-5 flex h-11 w-11 items-center justify-center border-[3px] border-neo-ink bg-neo-yellow text-neo-ink shadow-[3px_3px_0_0_var(--neo-ink)] sm:h-12 sm:w-12",
    ),

    pillarH3: p("text-lg font-semibold text-neutral-900 sm:text-xl", "text-lg font-semibold text-neutral-950 sm:text-xl", "text-lg font-black text-neo-ink sm:text-xl"),
    pillarBody: p(
      "mt-2 text-sm font-normal leading-relaxed text-neutral-600 sm:text-base",
      "mt-2 text-sm font-normal leading-relaxed text-neutral-600 sm:text-base",
      "mt-2 text-sm font-semibold leading-relaxed text-neo-ink/70 sm:text-base",
    ),

    ctaBox: p(
      "lp-cta-inner relative mx-auto max-w-[1600px] overflow-hidden rounded-2xl border border-white/20 bg-[rgba(87,87,87,0.94)] px-6 py-12 text-center shadow-2xl shadow-neutral-700/20 backdrop-blur-xl sm:px-10 sm:py-16 md:py-20",
      "lp-cta-inner relative mx-auto max-w-[1600px] overflow-hidden rounded-3xl border border-white/20 bg-neutral-900/88 px-6 py-12 text-center shadow-2xl shadow-black/20 backdrop-blur-2xl sm:px-10 sm:py-16 md:py-20",
      "lp-cta-inner relative mx-auto max-w-[1600px] overflow-hidden rounded-xl border-[3px] border-neo-ink bg-neo-ink px-6 py-12 text-center shadow-[8px_8px_0_0_#ff2d7a] sm:px-10 sm:py-16 md:py-20",
    ),

    ctaH2: p(
      "relative text-2xl font-bold leading-tight tracking-[-0.02em] text-white sm:text-3xl md:text-4xl lg:text-5xl",
      "relative text-2xl font-bold leading-tight tracking-[-0.02em] text-white sm:text-3xl md:text-4xl lg:text-5xl",
      "relative text-2xl font-black leading-tight tracking-[-0.03em] text-white sm:text-3xl md:text-4xl lg:text-5xl",
    ),

    ctaLead: p(
      "relative mx-auto mt-4 max-w-md text-sm font-normal text-white/75 sm:text-base",
      "relative mx-auto mt-4 max-w-md text-sm font-normal text-white/80 sm:text-base",
      "relative mx-auto mt-4 max-w-md text-sm font-semibold text-white/80 sm:text-base",
    ),

    ctaBtn: p(
      "relative mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#575757] shadow-md transition hover:bg-neutral-100 touch-manipulation sm:mt-10 sm:min-h-14 sm:px-10",
      "relative mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-neutral-900 shadow-xl transition hover:bg-white/95 touch-manipulation sm:mt-10 sm:min-h-14 sm:px-10",
      "relative mt-8 inline-flex min-h-12 items-center gap-2 border-[3px] border-neo-ink bg-neo-yellow px-8 py-3.5 text-sm font-black uppercase tracking-wide text-neo-ink shadow-[4px_4px_0_0_#ffffff] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 touch-manipulation sm:mt-10 sm:min-h-14 sm:px-10",
    ),

    footer: p(
      "relative z-10 border-t border-neutral-400/25 bg-white/50 px-4 py-10 sm:px-6 md:px-10 pb-[max(2.5rem,env(safe-area-inset-bottom,0px))]",
      "relative z-10 border-t border-white/35 bg-white/30 px-4 py-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] backdrop-blur-2xl sm:px-6 md:px-10 pb-[max(2.5rem,env(safe-area-inset-bottom,0px))]",
      "relative z-10 border-t-[3px] border-neo-ink bg-neo-bg px-4 py-10 sm:px-6 md:px-10 pb-[max(2.5rem,env(safe-area-inset-bottom,0px))]",
    ),

    footerMeta: p("text-xs font-medium text-neutral-500", "text-xs font-medium text-neutral-600", "text-xs font-black text-neo-ink/60"),
    footerLinks: p(
      "flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] font-semibold uppercase tracking-widest text-neutral-500 sm:text-xs",
      "flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] font-semibold uppercase tracking-widest text-neutral-600 sm:text-xs",
      "flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] font-black uppercase tracking-[0.2em] text-neo-ink/55 sm:text-xs",
    ),

    footerLink: p(
      "min-h-11 px-1 underline decoration-2 underline-offset-4 hover:text-neutral-800 touch-manipulation sm:min-h-0",
      "min-h-11 px-1 underline decoration-2 underline-offset-4 hover:text-neutral-900 touch-manipulation sm:min-h-0",
      "min-h-11 px-1 underline decoration-[3px] underline-offset-4 hover:text-neo-ink touch-manipulation sm:min-h-0",
    ),

    footerSep: p("text-neutral-400", "text-sky-900/20", "text-neo-ink/30"),

    focusRing: p("focus-visible:outline-neutral-700", "focus-visible:outline-sky-500/60", "focus-visible:outline-neo-ink"),

    /** Icons on light / frosted surfaces */
    deckIcon: p("text-neutral-800", "text-neutral-900", "text-neo-ink"),

    hubPromoTitle: p(
      "text-lg font-semibold text-neutral-900 sm:text-xl",
      "text-lg font-semibold text-neutral-950 sm:text-xl",
      "text-lg font-black text-neo-ink sm:text-xl",
    ),
    hubPromoDesc: p(
      "mt-1 text-sm font-normal text-neutral-600",
      "mt-1 text-sm font-medium text-neutral-600",
      "mt-1 text-sm font-semibold text-neo-ink/75",
    ),
    hubPromoOpen: p(
      "mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-neutral-800",
      "mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-neutral-900",
      "mt-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neo-ink",
    ),
  };
}

export function bentoTileChrome(theme: ThemeId) {
  const p = (cl: string, gl: string, neo: string) => pick3(theme, cl, gl, neo);
  return {
    focusRing: p("focus-visible:outline-neutral-700", "focus-visible:outline-sky-500/60", "focus-visible:outline-neo-ink"),

    card: p(
      "flex h-full min-h-[inherit] flex-col rounded-2xl border border-neutral-400/25 bg-[#e8e8e8] p-5 shadow-none transition-[transform,box-shadow] duration-200 sm:p-6 md:p-7",
      "flex h-full min-h-[inherit] flex-col rounded-3xl border border-white/50 bg-white/55 p-5 shadow-xl backdrop-blur-xl transition-[transform,box-shadow] duration-200 sm:p-6 md:p-7",
      "flex h-full min-h-[inherit] flex-col rounded-xl border-[3px] border-neo-ink bg-white p-5 shadow-[6px_6px_0_0_var(--neo-ink)] transition-[transform,box-shadow] duration-150 sm:p-6 md:p-7",
    ),

    cardHover: p(
      "hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.99]",
      "hover:-translate-y-1 hover:shadow-2xl active:scale-[0.99]",
      "hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--neo-ink)] active:translate-x-1 active:translate-y-1",
    ),

    label: p(
      "text-[9px] font-semibold uppercase tracking-[0.2em] text-neutral-500 sm:text-[10px]",
      "text-[9px] font-semibold uppercase tracking-[0.2em] text-neutral-500 sm:text-[10px]",
      "text-[9px] font-black uppercase tracking-[0.28em] text-neo-ink/50 sm:text-[10px]",
    ),

    iconFrame: p(
      "flex shrink-0 items-center justify-center rounded-xl border border-neutral-400/35",
      "flex shrink-0 items-center justify-center rounded-2xl border border-white/55 bg-white/30 backdrop-blur-md",
      "flex shrink-0 items-center justify-center border-[3px] border-neo-ink",
    ),

    title: p("font-semibold tracking-tight text-neutral-900", "font-bold tracking-tight text-neutral-950", "font-black tracking-tight text-neo-ink"),

    desc: p(
      "mt-1.5 font-normal leading-relaxed text-neutral-600 sm:mt-2",
      "mt-1.5 font-medium leading-relaxed text-neutral-600 sm:mt-2",
      "mt-1.5 font-semibold leading-relaxed text-neo-ink/65 sm:mt-2",
    ),

    openHint: p(
      "mt-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-neutral-800 underline decoration-2 underline-offset-4 sm:text-sm",
      "mt-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-neutral-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:text-xs",
      "mt-4 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neo-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:text-xs",
    ),
  };
}

/**
 * Hub grid (`/sif/utils`).
 */
export function hubChrome(theme: ThemeId) {
  const p = (cl: string, gl: string, neo: string) => pick3(theme, cl, gl, neo);
  return {
    main: p(
      "min-h-dvh bg-soft-gradient p-safe-hub font-sans selection:bg-neutral-500/20 selection:text-neutral-900",
      "min-h-dvh neo-page-grid p-safe-hub font-sans selection:bg-sky-400/25 selection:text-neutral-900",
      "min-h-dvh bg-neo-bg p-safe-hub font-sans selection:bg-neo-ink selection:text-white",
    ),

    backLink: p(
      "inline-flex min-h-11 items-center gap-2 border-b border-transparent text-[10px] font-semibold uppercase tracking-widest text-neutral-500 transition-colors hover:border-neutral-400 hover:text-neutral-800 sm:text-xs",
      "inline-flex min-h-11 items-center gap-2 touch-manipulation border-b border-transparent text-[10px] font-semibold uppercase tracking-widest text-neutral-600 transition-colors hover:text-neutral-900 sm:text-xs",
      "inline-flex min-h-11 items-center gap-2 touch-manipulation border-b-[3px] border-transparent text-[10px] font-black uppercase tracking-[0.2em] text-neo-ink/55 transition-colors hover:border-neo-ink hover:text-neo-ink sm:text-xs",
    ),

    h1: p(
      "text-[2.25rem] font-bold leading-[0.95] tracking-normal text-[#575757] sm:text-6xl md:text-7xl lg:text-[96px]",
      "text-[2.25rem] font-bold leading-[0.95] tracking-[-0.04em] text-neutral-950 sm:text-6xl md:text-7xl lg:text-[100px]",
      "text-[2.25rem] font-black leading-[0.92] tracking-[-0.06em] text-neo-ink sm:text-6xl md:text-7xl lg:text-[100px]",
    ),

    tagline: p(
      "max-w-2xl text-base font-normal leading-relaxed text-neutral-600 sm:text-xl md:text-2xl lg:text-4xl",
      "max-w-2xl text-base font-medium leading-relaxed text-neutral-600 sm:text-xl md:text-2xl lg:text-4xl",
      "max-w-2xl text-base font-bold leading-tight text-neo-ink/80 sm:text-xl md:text-2xl lg:text-4xl",
    ),

    card: p(
      "relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-2xl border border-white/55 bg-white/65 p-5 shadow-lg shadow-neutral-700/10 backdrop-blur-xl transition-all duration-200 sm:min-h-[280px] sm:p-8 md:h-[320px] hover:-translate-y-1 hover:shadow-xl sm:group-hover:scale-[1.01]",
      "relative flex min-h-[240px] flex-col justify-between overflow-hidden rounded-3xl border border-white/50 bg-white/50 p-6 shadow-xl backdrop-blur-xl transition-all duration-200 sm:min-h-[280px] md:h-[320px] sm:p-8 hover:-translate-y-1 hover:shadow-2xl sm:group-hover:scale-[1.01]",
      "relative flex min-h-[240px] flex-col justify-between overflow-hidden rounded-xl border-[3px] border-neo-ink bg-white p-6 shadow-[6px_6px_0_0_var(--neo-ink)] transition-transform duration-150 sm:min-h-[280px] md:h-[320px] sm:p-8 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--neo-ink)] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0_0_var(--neo-ink)] sm:group-hover:scale-[1.01]",
    ),

    iconBox: p(
      "mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-neutral-400/35 sm:mb-6 sm:h-14 sm:w-14",
      "mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/55 bg-white/35 backdrop-blur-md sm:mb-6 sm:h-14 sm:w-14",
      "mb-4 flex h-12 w-12 shrink-0 items-center justify-center border-[3px] border-neo-ink sm:mb-6 sm:h-14 sm:w-14",
    ),

    cardTitle: p(
      "mb-1.5 text-xl font-semibold text-[#575757] sm:mb-2 sm:text-2xl",
      "mb-1.5 text-xl font-semibold text-neutral-950 sm:mb-2 sm:text-2xl",
      "mb-1.5 text-xl font-black text-neo-ink sm:mb-2 sm:text-2xl",
    ),

    cardDesc: p(
      "pr-2 text-sm font-normal leading-relaxed text-neutral-600 sm:pr-8",
      "pr-2 text-sm font-medium leading-relaxed text-neutral-600 sm:pr-8",
      "pr-2 text-sm font-semibold leading-relaxed text-neo-ink/60 sm:pr-8",
    ),

    openLabel: p(
      "text-sm font-semibold uppercase tracking-wide text-[#575757] underline decoration-2 underline-offset-4",
      "text-sm font-semibold uppercase tracking-wide text-neutral-800 underline decoration-2 underline-offset-4",
      "text-sm font-black uppercase tracking-wide text-neo-ink underline decoration-[3px] underline-offset-4",
    ),

    arrowBtn: p(
      "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-neutral-400/35 bg-white shadow-sm transition-transform sm:h-10 sm:w-10 sm:group-hover:translate-x-0.5",
      "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/55 bg-white/45 shadow-lg backdrop-blur-md transition-transform sm:h-10 sm:w-10 sm:group-hover:translate-x-0.5",
      "flex h-11 w-11 shrink-0 items-center justify-center border-[3px] border-neo-ink bg-neo-mint shadow-[3px_3px_0_0_var(--neo-ink)] transition-transform sm:h-10 sm:w-10 sm:group-hover:translate-x-0.5 sm:group-hover:translate-y-0.5",
    ),

    linkFocus: p("focus-visible:outline-neutral-700", "focus-visible:outline-sky-500/60", "focus-visible:outline-neo-ink"),

    arrowIconClass: p("text-neutral-800", "text-neutral-800", "text-neo-ink"),
  };
}

/**
 * In-tool panels (workspaces) — soft surfaces for Classic.
 */
export function workspaceChrome(theme: ThemeId) {
  const p = (cl: string, gl: string, neo: string) => pick3(theme, cl, gl, neo);
  return {
    infoPanel: p(
      "space-y-3 rounded-2xl border border-amber-200/70 bg-amber-50/95 p-4 shadow-sm sm:p-5",
      "space-y-3 rounded-2xl border border-white/45 bg-amber-50/80 p-4 shadow-lg backdrop-blur-xl sm:p-5",
      "space-y-3 rounded-xl border-[3px] border-neo-ink p-4 shadow-[5px_5px_0_0_var(--neo-ink)] sm:p-5",
    ),

    mainPanel: p(
      "relative z-10 space-y-5 rounded-2xl border border-white/55 bg-white/72 p-4 shadow-lg shadow-neutral-700/10 backdrop-blur-xl sm:p-6",
      "relative z-10 space-y-5 rounded-2xl border border-white/50 bg-white/55 p-4 shadow-xl backdrop-blur-xl sm:p-6",
      "relative z-10 space-y-5 rounded-xl border-[3px] border-neo-ink bg-white p-4 shadow-[6px_6px_0_0_var(--neo-ink)] sm:p-6",
    ),

    modeBtn: p(
      "flex-1 rounded-xl border border-neutral-400/35 px-4 py-3 text-left transition-all touch-manipulation",
      "flex-1 rounded-2xl border border-white/45 bg-white/35 px-4 py-3 text-left backdrop-blur-md transition-all touch-manipulation",
      "flex-1 rounded-lg border-[3px] border-neo-ink px-4 py-3 text-left transition-all touch-manipulation",
    ),

    modeOn: p(
      "bg-[#575757] text-white shadow-md ring-1 ring-black/5",
      "bg-neutral-900/95 text-white shadow-lg ring-1 ring-white/20 backdrop-blur-md",
      "bg-neo-ink text-white shadow-[3px_3px_0_0_#62f5cd]",
    ),

    modeOnAlt: p(
      "bg-[#575757] text-white shadow-md ring-1 ring-black/5",
      "bg-neutral-900/95 text-white shadow-lg ring-1 ring-white/20 backdrop-blur-md",
      "bg-neo-ink text-white shadow-[3px_3px_0_0_#ffe94a]",
    ),

    modeOff: p(
      "bg-white shadow-sm hover:bg-neutral-50",
      "bg-white/55 shadow-md backdrop-blur-md hover:bg-white/70",
      "bg-white shadow-[3px_3px_0_0_var(--neo-ink)] hover:bg-neo-bg",
    ),

    errorBanner: p(
      "rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-900 shadow-sm",
      "rounded-xl border border-rose-200/80 bg-rose-50/90 px-3 py-2 text-sm font-semibold text-rose-900 shadow-md backdrop-blur-md",
      "rounded-lg border-[3px] border-neo-ink bg-neo-magenta px-3 py-2 text-sm font-bold text-white shadow-[3px_3px_0_0_var(--neo-ink)]",
    ),

    runPrimary: p(
      "flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#575757] text-sm font-semibold tracking-tight text-white shadow-md transition-colors hover:bg-[#4d4d4d] disabled:opacity-40 touch-manipulation",
      "flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-neutral-900 text-sm font-semibold tracking-tight text-white shadow-xl shadow-black/15 transition hover:bg-neutral-800 disabled:opacity-40 touch-manipulation",
      "flex min-h-12 flex-1 items-center justify-center gap-2 border-[3px] border-neo-ink bg-neo-ink text-sm font-black uppercase tracking-tight text-white shadow-[4px_4px_0_0_#62f5cd] hover:translate-x-0.5 hover:translate-y-0.5 disabled:opacity-40 touch-manipulation",
    ),

    runSecondary: p(
      "flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border border-neutral-400/45 bg-white text-sm font-semibold tracking-tight text-neutral-900 shadow-sm transition hover:bg-neutral-50 disabled:opacity-40 touch-manipulation",
      "flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border border-white/55 bg-white/60 text-sm font-semibold tracking-tight text-neutral-900 shadow-lg backdrop-blur-md transition hover:bg-white/75 disabled:opacity-40 touch-manipulation",
      "flex min-h-12 flex-1 items-center justify-center gap-2 border-[3px] border-neo-ink bg-white text-sm font-black uppercase tracking-tight text-neo-ink shadow-[4px_4px_0_0_var(--neo-ink)] hover:bg-neo-bg disabled:opacity-40 touch-manipulation",
    ),

    previewCard: p(
      "flex min-h-[180px] flex-col overflow-hidden rounded-2xl border border-white/55 bg-white/72 p-3 shadow-lg shadow-neutral-700/10 backdrop-blur-xl sm:p-4",
      "flex min-h-[180px] flex-col overflow-hidden rounded-2xl border border-white/50 bg-white/50 p-3 shadow-xl backdrop-blur-xl sm:p-4",
      "flex min-h-[180px] flex-col overflow-hidden rounded-xl border-[3px] border-neo-ink bg-white p-3 shadow-[5px_5px_0_0_var(--neo-ink)] sm:p-4",
    ),

    previewLabel: p(
      "mb-2 shrink-0 text-[10px] font-semibold uppercase tracking-widest text-neutral-500",
      "mb-2 shrink-0 text-[10px] font-semibold uppercase tracking-widest text-neutral-600",
      "mb-2 shrink-0 text-[10px] font-black uppercase tracking-widest text-neo-ink/50",
    ),

    previewFrame: p(
      "flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-xl border border-neutral-400/30 bg-neutral-100/70",
      "flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-xl border border-white/40 bg-white/40 backdrop-blur-md",
      "flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-lg border-2 border-neo-ink bg-neo-bg",
    ),

    floatingBadge: p(
      "absolute top-4 left-4 z-10 rounded-lg border border-rose-200 bg-rose-100 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-wider text-rose-950 shadow-sm",
      "absolute top-4 left-4 z-10 rounded-lg border border-rose-200/80 bg-rose-50/90 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-wider text-rose-950 shadow-md backdrop-blur-md",
      "absolute top-4 left-4 z-10 border-[3px] border-neo-ink bg-neo-magenta px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-white shadow-[3px_3px_0_0_var(--neo-ink)]",
    ),

    grainChip: p(
      "flex items-center gap-2 rounded-lg border border-neutral-400/35 bg-white px-3 py-1.5 shadow-sm",
      "flex items-center gap-2 rounded-xl border border-white/50 bg-white/55 px-3 py-1.5 shadow-md backdrop-blur-md",
      "flex items-center gap-2 border-[2px] border-neo-ink bg-white px-3 py-1.5 shadow-[2px_2px_0_0_var(--neo-ink)]",
    ),
  };
}

export function dropZoneChrome(theme: ThemeId) {
  const p = (cl: string, gl: string, neo: string) => pick3(theme, cl, gl, neo);
  return {
    root: p(
      "relative group cursor-pointer touch-manipulation w-full min-h-[220px] h-full max-w-[1610px] flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-500/45 bg-white/55 shadow-lg shadow-neutral-700/10 backdrop-blur-xl transition-[box-shadow,transform] duration-200 ease-out hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.99]",
      "relative group cursor-pointer touch-manipulation w-full min-h-[200px] h-full max-w-[1610px] flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/55 bg-white/45 shadow-xl backdrop-blur-2xl transition-[box-shadow,transform] duration-200 ease-out hover:border-sky-300/50 hover:shadow-2xl hover:-translate-y-0.5 active:scale-[0.99]",
      "relative group cursor-pointer touch-manipulation w-full min-h-[200px] h-full max-w-[1610px] flex flex-col items-center justify-center rounded-xl border-[3px] border-neo-ink bg-white shadow-[6px_6px_0_0_var(--neo-ink)] transition-[transform,box-shadow] duration-150 ease-out hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--neo-ink)] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0_0_var(--neo-ink)]",
    ),

    dragActive: p(
      "bg-emerald-50/90 ring-2 ring-neutral-400/40 ring-offset-2 ring-offset-white",
      "bg-emerald-400/25 ring-2 ring-sky-400/40 ring-offset-2 ring-offset-white/50",
      "bg-neo-mint ring-2 ring-neo-ink ring-offset-2 ring-offset-[#fff8e8]",
    ),

    plusBtn: p(
      "flex h-14 w-14 items-center justify-center rounded-full bg-[#545454] text-white shadow-md transition-transform duration-150 sm:h-16 sm:w-16",
      "flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30 transition-transform duration-150 sm:h-16 sm:w-16",
      "flex h-14 w-14 items-center justify-center rounded-lg border-[3px] border-neo-ink bg-neo-ink text-white shadow-[4px_4px_0_0_#62f5cd] transition-transform duration-150 sm:h-16 sm:w-16",
    ),

    title: p(
      "max-w-[18rem] select-none text-lg font-semibold leading-tight tracking-tight text-[#545454] sm:max-w-none sm:text-2xl",
      "max-w-[18rem] select-none text-lg font-semibold leading-tight tracking-tight text-neutral-900 sm:max-w-none sm:text-2xl",
      "max-w-[18rem] select-none text-lg font-extrabold uppercase leading-tight tracking-tight text-neo-ink sm:max-w-none sm:text-2xl",
    ),
  };
}
