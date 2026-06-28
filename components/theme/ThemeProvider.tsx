"use client";

import { createContext, useContext } from "react";
import type { ThemeId } from "@/lib/theme";

type Ctx = {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
};

const ThemeContext = createContext<Ctx | null>(null);
const classicTheme: Ctx = {
  theme: "classic",
  setTheme: () => {},
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeContext.Provider value={classicTheme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Ctx {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}

/** Optional: landing/utils can use without throwing if provider missing */
export function useThemeOptional(): Ctx | null {
  return useContext(ThemeContext);
}

