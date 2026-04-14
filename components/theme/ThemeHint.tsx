"use client";

import { THEME_META } from "@/lib/theme";
import { useTheme } from "./ThemeProvider";

/**
 * Short callout that themes exist and can be changed via the switcher.
 */
export default function ThemeHint({ className = "" }: { className?: string }) {
  const { theme } = useTheme();
  const meta = THEME_META[theme];

  return (
    <p
      className={`text-[11px] font-semibold leading-snug text-neo-ink/65 sm:text-xs ${className}`}
      role="note"
    >
      <span className="font-black text-neo-ink/80">Themes:</span> Classic, Neo-brutal, and
      Liquid Glass — switch anytime with the Theme control in the header.{" "}
      <span className="whitespace-nowrap font-bold text-neo-ink/70">
        Now: {meta.label} ({meta.short})
      </span>
    </p>
  );
}
