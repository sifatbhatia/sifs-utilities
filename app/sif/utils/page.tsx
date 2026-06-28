"use client";
import clsx from "clsx";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SITE_TOOLS } from "@/data/siteTools";
import { hubChrome } from "@/lib/marketingChrome";

export default function UtilsPage() {
  const theme = "classic";
  const h = hubChrome(theme);

  return (
    <main className={h.main}>
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-8 space-y-3 sm:mb-12 sm:space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <Link
              href="/"
              className={h.backLink}
            >
              ← Landing
            </Link>
          </div>
          <div className="space-y-1 sm:space-y-2">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={h.h1}
            >
              {"Sif's Utilities"}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={h.tagline}
            >
              Simple tools for everyday files.
            </motion.p>
          </div>
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
                  className={clsx(
                    "group block h-full touch-manipulation rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4",
                    h.linkFocus,
                  )}
                >
                  <div className={h.card}>
                    <div className={clsx(h.iconBox, tool.iconBg)}>
                      <Icon className={clsx("h-6 w-6", tool.iconClass)} strokeWidth={2} />
                    </div>

                    <div className="min-h-0 flex-1">
                      <h3 className={h.cardTitle}>{tool.name}</h3>
                      <p className={h.cardDesc}>{tool.description}</p>
                    </div>

                    <div className="mt-6 flex items-center justify-between gap-3 pt-2 sm:mt-8">
                      <span className={h.openLabel}>Open Tool</span>
                      <div className={h.arrowBtn} aria-hidden>
                        <ArrowRight size={18} className={h.arrowIconClass} strokeWidth={2.5} />
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
