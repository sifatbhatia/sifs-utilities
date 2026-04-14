"use client";

import { useId } from "react";
import clsx from "clsx";
import { useTheme } from "./ThemeProvider";
import type { ThemeId } from "@/lib/theme";
import { THEME_META, THEMES } from "@/lib/theme";

type Props = {
  /** Larger hit area + label for hub / landing */
  variant?: "compact" | "toolbar";
  className?: string;
};

export default function ThemeSwitcher({ variant = "compact", className = "" }: Props) {
  const id = useId();
  const { theme, setTheme } = useTheme();

  if (variant === "toolbar") {
    return (
      <div className={`flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2 ${className}`}>
        <span
          id={`${id}-label`}
          className={clsx(
            "text-[9px] uppercase sm:text-[10px]",
            theme === "classic" && "font-semibold tracking-widest text-neutral-500",
            theme === "liquid-glass" && "font-semibold tracking-widest text-neutral-600",
            theme === "neo-brutal" && "font-black tracking-[0.2em] text-neo-ink/55",
          )}
        >
          Theme
        </span>
        <select
          aria-labelledby={`${id}-label`}
          value={theme}
          onChange={(e) => setTheme(e.target.value as ThemeId)}
          className={clsx(
            "min-h-10 max-w-full cursor-pointer py-2 pl-2 pr-8 sm:min-h-9 sm:text-sm",
            theme === "classic" && "rounded-xl border border-neutral-400/40 bg-white text-xs font-medium text-neutral-800 shadow-sm",
            theme === "liquid-glass" &&
              "rounded-xl border border-white/55 bg-white/45 text-xs font-medium text-neutral-900 shadow-lg backdrop-blur-xl",
            theme === "neo-brutal" &&
              "rounded-lg border-[3px] border-neo-ink bg-white text-xs font-bold text-neo-ink shadow-[3px_3px_0_0_var(--neo-ink)]",
          )}
        >
          {THEMES.map((t) => (
            <option key={t} value={t}>
              {THEME_META[t].label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <label className={`flex items-center gap-2 ${className}`}>
      <span className="sr-only">Visual theme</span>
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as ThemeId)}
        className={clsx(
          "max-w-[9.5rem] cursor-pointer py-1.5 pl-2 pr-6 sm:max-w-[11rem] sm:text-xs",
          theme === "classic" &&
            "rounded-lg border border-neutral-400/40 bg-white text-[10px] font-medium tracking-wide text-neutral-800 shadow-sm",
          theme === "liquid-glass" &&
            "rounded-lg border border-white/50 bg-white/45 text-[10px] font-medium tracking-wide text-neutral-900 shadow-md backdrop-blur-lg",
          theme === "neo-brutal" &&
            "rounded-md border-[2px] border-neo-ink bg-white text-[10px] font-bold uppercase tracking-wide text-neo-ink",
        )}
        aria-label="Visual theme"
      >
        {THEMES.map((t) => (
          <option key={t} value={t}>
            {THEME_META[t].label}
          </option>
        ))}
      </select>
    </label>
  );
}
