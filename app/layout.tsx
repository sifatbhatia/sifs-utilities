import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { THEME_INIT_SCRIPT } from "./theme-init";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sifsutilities.com";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#CACACA" },
    { media: "(prefers-color-scheme: dark)", color: "#1a2332" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sif's Utilities",
    template: "%s · Sif's Utilities",
  },
  description:
    "Sif's Utilities — browser tools for compressing images and video, shrinking PDFs, cropping, stripping metadata, adding grain, and building icon sets.",
  keywords: [
    "image compressor",
    "video compressor",
    "pdf compressor",
    "metadata remover",
    "favicon generator",
    "browser tools",
    "client-side tools",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Sif's Utilities",
    description:
      "Sif's Utilities — compression, privacy, and quick asset prep in your browser.",
    url: "/",
    siteName: "Sif's Utilities",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sif's Utilities",
    description: "Compression, privacy, and quick asset prep in your browser.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="classic" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
