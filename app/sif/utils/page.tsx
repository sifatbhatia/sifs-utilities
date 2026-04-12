"use client";
import clsx from "clsx";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SITE_TOOLS } from "@/data/siteTools";

export default function UtilsPage() {
  return (
    <main className="min-h-dvh bg-neo-bg p-safe-hub font-sans selection:bg-neo-ink selection:text-white">
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-8 space-y-2 sm:mb-12 sm:space-y-3">
          <Link
            href="/"
            className="mb-2 inline-flex min-h-11 items-center gap-2 touch-manipulation border-b-[3px] border-transparent text-[10px] font-black uppercase tracking-[0.2em] text-neo-ink/55 transition-colors hover:border-neo-ink hover:text-neo-ink sm:text-xs"
          >
            ← Landing
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[2.25rem] font-black leading-[0.92] tracking-[-0.06em] text-neo-ink sm:text-6xl md:text-7xl lg:text-[100px]"
          >
            {"Sif's Utilities"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl text-base font-bold leading-tight text-neo-ink/80 sm:text-xl md:text-2xl lg:text-4xl"
          >
            A collection of creative tools.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {SITE_TOOLS.map((tool, index) => {
            const Icon = tool.Icon;
            return (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Link
                  href={tool.href}
                  className="group block h-full touch-manipulation rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neo-ink"
                >
                  <div className="relative flex min-h-[240px] flex-col justify-between overflow-hidden rounded-xl border-[3px] border-neo-ink bg-white p-6 shadow-[6px_6px_0_0_#0a0a0a] transition-transform duration-150 sm:min-h-[280px] md:h-[320px] sm:p-8 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[4px_4px_0_0_#0a0a0a] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0_0_#0a0a0a] sm:group-hover:scale-[1.01]">
                    <div
                      className={clsx(
                        "mb-4 flex h-12 w-12 shrink-0 items-center justify-center border-[3px] border-neo-ink sm:mb-6 sm:h-14 sm:w-14",
                        tool.iconBg,
                      )}
                    >
                      <Icon className={clsx("h-6 w-6", tool.iconClass)} strokeWidth={2} />
                    </div>

                    <div className="min-h-0 flex-1">
                      <h3 className="mb-1.5 text-xl font-black text-neo-ink sm:mb-2 sm:text-2xl">
                        {tool.name}
                      </h3>
                      <p className="pr-2 text-sm font-semibold leading-relaxed text-neo-ink/60 sm:pr-8">
                        {tool.description}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between gap-3 pt-2 sm:mt-8">
                      <span className="text-sm font-black uppercase tracking-wide text-neo-ink underline decoration-[3px] underline-offset-4">
                        Open Tool
                      </span>
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center border-[3px] border-neo-ink bg-neo-mint shadow-[3px_3px_0_0_#0a0a0a] transition-transform sm:h-10 sm:w-10 sm:group-hover:translate-x-0.5 sm:group-hover:translate-y-0.5"
                        aria-hidden
                      >
                        <ArrowRight size={18} className="text-neo-ink" strokeWidth={2.5} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
