import type { LucideIcon } from "lucide-react";
import {
  Image as ImageIcon,
  Video,
  FileText,
  Zap,
  CircleDashed,
  LayoutGrid,
  Fingerprint,
  Braces,
  FileCode2,
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
    description: "Compress JPG, PNG, WebP, and AVIF images with live quality and format controls.",
    href: "/pixsqueeze",
    Icon: ImageIcon,
    iconClass: "text-blue-600",
    iconBg: "bg-blue-100",
  },
  {
    name: "PDFPress",
    description: "Reduce PDF size with adjustable compression and side-by-side preview.",
    href: "/pdf-compressor",
    Icon: FileText,
    iconClass: "text-red-600",
    iconBg: "bg-red-100",
  },
  {
    name: "CircleCrop",
    description: "Crop any image into a clean circle with zoom, rotation, and border controls.",
    href: "/circle-crop",
    Icon: CircleDashed,
    iconClass: "text-purple-600",
    iconBg: "bg-purple-100",
  },
  {
    name: "VidSqueeze",
    description: "Compress videos in-browser with quality controls and quick export.",
    href: "/vidsqueeze",
    Icon: Video,
    iconClass: "text-orange-600",
    iconBg: "bg-orange-100",
  },
  {
    name: "MetaShield",
    description: "Remove metadata from images and documents before sharing.",
    href: "/meta-shield",
    Icon: Zap,
    iconClass: "text-indigo-600",
    iconBg: "bg-indigo-100",
  },
  {
    name: "SynthClean",
    description: "Strip metadata and optionally soften SynthID-like carrier patterns in image exports.",
    href: "/synth-strip",
    Icon: Fingerprint,
    iconClass: "text-amber-700",
    iconBg: "bg-amber-100",
  },
  {
    name: "GrainPix",
    description: "Apply adjustable film-grain texture with real-time canvas preview.",
    href: "/grain-pix",
    Icon: Zap,
    iconClass: "text-zinc-600",
    iconBg: "bg-zinc-200",
  },
  {
    name: "IconSet",
    description: "Generate app icon packs and favicons from a single logo source.",
    href: "/icon-set",
    Icon: LayoutGrid,
    iconClass: "text-emerald-600",
    iconBg: "bg-emerald-100",
  },
  {
    name: "JSON Formatter",
    description: "Format, compact, validate, copy, and download JSON locally in your browser.",
    href: "/json-formatter",
    Icon: Braces,
    iconClass: "text-sky-700",
    iconBg: "bg-sky-100",
  },
  {
    name: "YAML Formatter",
    description: "Format, compact, validate, copy, and download YAML locally in your browser.",
    href: "/yaml-formatter",
    Icon: FileCode2,
    iconClass: "text-teal-700",
    iconBg: "bg-teal-100",
  },
];
