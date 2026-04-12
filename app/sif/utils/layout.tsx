import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Tools",
  description:
    "Sif's Utilities hub — client-side utilities for images, video, PDFs, metadata, grain, and icons. Optimized for desktop and mobile.",
};

export default function SifUtilsLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return children;
}
