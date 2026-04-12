"use client";

/** Flat neo-brutalist field: no glassmorphism, visible grid. */
export default function PremiumBackground() {
  return (
    <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none neo-page-grid" />
  );
}
