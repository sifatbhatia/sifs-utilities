export type ThemeId = "classic" | "neo-brutal" | "liquid-glass";

export const THEME_STORAGE_KEY = "sifutils-theme";

export const THEMES: readonly ThemeId[] = ["classic", "neo-brutal", "liquid-glass"];

export const THEME_META: Record<
  ThemeId,
  { label: string; short: string; blurb: string }
> = {
  classic: {
    label: "Classic",
    short: "Calm gray",
    blurb: "Soft gray surfaces and subtle borders — the original quiet utility look.",
  },
  "neo-brutal": {
    label: "Neo-brutal",
    short: "Anti-design",
    blurb: "Thick black frames, flat color, and hard offset shadows.",
  },
  "liquid-glass": {
    label: "Liquid Glass",
    short: "iOS-style blur",
    blurb: "Frosted layers, soft depth, and saturated blur — control-center style chrome.",
  },
};

export function isThemeId(v: string | null | undefined): v is ThemeId {
  return v === "classic" || v === "neo-brutal" || v === "liquid-glass";
}
