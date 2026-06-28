import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sifs-utils.vercel.app";

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
    "Local file tools for images, videos, PDFs, metadata, icons, JSON, and YAML.",
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
      "Compress, clean, crop, generate, and format files in your browser.",
    url: "/",
    siteName: "Sif's Utilities",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sif's Utilities",
    description: "Compress, clean, crop, generate, and format files in your browser.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
