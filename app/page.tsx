import type { Metadata } from "next";
import LandingPage from "@/components/landing/LandingPage";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Sif's Utilities is a browser-native toolbox for image compression, video compression, PDF shrinking, metadata cleanup, grain styling, and icon generation.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Sif's Utilities",
    url: "https://sifsutilities.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://sifsutilities.com/sif/utils",
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
