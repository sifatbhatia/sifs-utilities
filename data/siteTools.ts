import type { LucideIcon } from "lucide-react";
import {
  Image as ImageIcon,
  Video,
  FileText,
  Zap,
  CircleDashed,
  LayoutGrid,
  Fingerprint,
} from "lucide-react";

export type SiteTool = {
  name: string;
  description: string;
  href: string;
  Icon: LucideIcon;
  iconClass: string;
  iconBg: string;
};

export const SITE_TOOLS: SiteTool[] = [
  {
    name: "PixSqueeze",
    description: "Smart image compression with instant preview.",
    href: "/pixsqueeze",
    Icon: ImageIcon,
    iconClass: "text-blue-600",
    iconBg: "bg-blue-100",
  },
  {
    name: "PDFPress",
    description: "Secure, client-side PDF compression.",
    href: "/pdf-compressor",
    Icon: FileText,
    iconClass: "text-red-600",
    iconBg: "bg-red-100",
  },
  {
    name: "CircleCrop",
    description: "Crop images into perfect circles instantly.",
    href: "/circle-crop",
    Icon: CircleDashed,
    iconClass: "text-purple-600",
    iconBg: "bg-purple-100",
  },
  {
    name: "VidSqueeze",
    description: "Compress videos directly in your browser.",
    href: "/vidsqueeze",
    Icon: Video,
    iconClass: "text-orange-600",
    iconBg: "bg-orange-100",
  },
  {
    name: "MetaShield",
    description: "Strip metadata and protect your privacy.",
    href: "/meta-shield",
    Icon: Zap,
    iconClass: "text-indigo-600",
    iconBg: "bg-indigo-100",
  },
  {
    name: "SynthClean",
    description:
      "Strip EXIF and optionally soften SynthID-like frequency carriers (Gemini / Nano Banana).",
    href: "/synth-strip",
    Icon: Fingerprint,
    iconClass: "text-amber-700",
    iconBg: "bg-amber-100",
  },
  {
    name: "GrainPix",
    description: "Add organic film grain with mathematical precision.",
    href: "/grain-pix",
    Icon: Zap,
    iconClass: "text-zinc-600",
    iconBg: "bg-zinc-200",
  },
  {
    name: "IconSet",
    description: "Craft perfect app icons and favicons in seconds.",
    href: "/icon-set",
    Icon: LayoutGrid,
    iconClass: "text-emerald-600",
    iconBg: "bg-emerald-100",
  },
];
