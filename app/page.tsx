import type { Metadata } from "next";
import LandingPage from "@/components/landing/LandingPage";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sifs-utils.vercel.app";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Sif's Utilities is a set of local file tools for images, videos, PDFs, metadata, icons, JSON, and YAML.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Sif's Utilities",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/sif/utils`,
      "query-input": "required name=tool",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LandingPage />
    </>
  );
}
