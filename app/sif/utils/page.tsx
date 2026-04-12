"use client";
import clsx from "clsx";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SITE_TOOLS } from "@/data/siteTools";

export default function UtilsPage() {
  return (
    <main className="min-h-dvh bg-[#cecece] p-safe-hub font-sans selection:bg-black selection:text-white">
      <div className="max-w-[1600px] mx-auto">
        <header className="mb-8 sm:mb-12 space-y-2 sm:space-y-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-zinc-500 hover:text-zinc-800 transition-colors touch-manipulation mb-2"
          >
            ← Landing
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[2.25rem] leading-[0.95] sm:text-6xl md:text-7xl lg:text-[100px] font-medium tracking-[-0.08em] text-primary"
          >
            {"Sif's Utilities"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-xl md:text-2xl lg:text-4xl font-medium leading-tight text-primary/80 max-w-2xl"
          >
            A collection of creative tools.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                  className="group block h-full touch-manipulation rounded-[28px] sm:rounded-[32px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-800"
                >
                  <div className="min-h-[240px] sm:min-h-[280px] md:h-[320px] bg-[#e5e5e5] rounded-[inherit] p-6 sm:p-8 flex flex-col justify-between hover:bg-[#eaeaea] active:bg-[#e0e0e0] transition-all duration-300 relative overflow-hidden sm:group-hover:scale-[1.01] active:scale-[0.99] sm:hover:shadow-lg">
                    <div
                      className={clsx(
                        "w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shrink-0",
                        tool.iconBg,
                      )}
                    >
                      <Icon className={clsx("w-6 h-6", tool.iconClass)} strokeWidth={1.5} />
                    </div>

                    <div className="flex-1 min-h-0">
                      <h3 className="text-xl sm:text-2xl font-bold text-zinc-800 mb-1.5 sm:mb-2">
                        {tool.name}
                      </h3>
                      <p className="text-sm sm:text-sm font-medium text-zinc-500 leading-relaxed pr-2 sm:pr-8">
                        {tool.description}
                      </p>
                    </div>

                    <div className="mt-6 sm:mt-8 flex items-center justify-between gap-3 pt-2">
                      <span className="text-sm font-bold text-zinc-800 sm:group-hover:underline decoration-2 underline-offset-4">
                        Open Tool
                      </span>
                      <div
                        className="w-11 h-11 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0 sm:group-hover:scale-110 transition-transform"
                        aria-hidden
                      >
                        <ArrowRight size={18} className="text-zinc-800" />
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
