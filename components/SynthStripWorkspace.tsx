"use client";

import React, { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Fingerprint,
  X,
  ExternalLink,
  Info,
  Loader2,
  Sparkles,
} from "lucide-react";
import DropZone from "./DropZone";
import PremiumBackground from "@/components/PremiumBackground";
import clsx from "clsx";
import { mitigateSynthidLike } from "@/lib/synthidMitigation";

type Mode = "meta" | "spectral";

function imageDataFromFile(file: File): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Canvas not available"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      try {
        const data = ctx.getImageData(0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        resolve(data);
      } catch (e) {
        URL.revokeObjectURL(url);
        reject(e);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

function imageDataToPngBlob(data: ImageData): Promise<Blob | null> {
  const c = document.createElement("canvas");
  c.width = data.width;
  c.height = data.height;
  const ctx = c.getContext("2d");
  if (!ctx) return Promise.resolve(null);
  ctx.putImageData(data, 0, 0);
  return new Promise((res) => c.toBlob((b) => res(b), "image/png"));
}

export default function SynthStripWorkspace() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [outBlob, setOutBlob] = useState<Blob | null>(null);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("spectral");
  const [strength, setStrength] = useState(32);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastProfile, setLastProfile] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(true);

  React.useEffect(() => {
    if (!file || !file.type.startsWith("image/")) {
      setPreviewUrl(null);
      return;
    }
    const u = URL.createObjectURL(file);
    setPreviewUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);

  React.useEffect(() => {
    if (!outBlob) {
      setOutUrl(null);
      return;
    }
    const u = URL.createObjectURL(outBlob);
    setOutUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [outBlob]);

  const run = useCallback(async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setOutBlob(null);
    setLastProfile(null);
    try {
      const idata = await imageDataFromFile(file);
      let result = idata;
      if (mode === "spectral") {
        const mit = mitigateSynthidLike(idata, strength);
        result = mit.data;
        setLastProfile(
          mit.profile === "tall"
            ? "Tall export profile (scaled carriers)"
            : "Square export profile (scaled carriers)",
        );
      }
      const blob = await imageDataToPngBlob(result);
      if (!blob) throw new Error("PNG export failed");
      setOutBlob(blob);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Processing failed");
    } finally {
      setBusy(false);
    }
  }, [file, mode, strength]);

  const download = useCallback(() => {
    if (!outBlob) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(outBlob);
    a.download = `synth-clean-${Date.now()}.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }, [outBlob]);

  return (
    <div className="w-full h-full flex flex-col flex-1 min-h-0 relative isolate">
      <PremiumBackground />
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="dz"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex-1 flex items-center justify-center p-4 min-h-0"
          >
            <DropZone
              onFileSelect={(files) => setFile(files[0] ?? null)}
              isProcessing={false}
              accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp", ".avif"] }}
              text="Drop an AI export (e.g. Nano Banana / Gemini)"
              subText="PNG or JPEG — stays in your browser"
            />
          </motion.div>
        ) : (
          <motion.div
            key="ws"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col gap-4 p-2 sm:p-4 min-h-0 overflow-y-auto custom-scrollbar"
          >
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setOutBlob(null);
                  setError(null);
                }}
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neo-ink/45 hover:text-neo-ink touch-manipulation"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            </div>

            <div
              className={clsx(
                "space-y-3 rounded-xl border-[3px] border-neo-ink p-4 shadow-[5px_5px_0_0_#0a0a0a] sm:p-5",
                showInfo ? "bg-neo-yellow" : "bg-white",
              )}
            >
              <button
                type="button"
                onClick={() => setShowInfo((s) => !s)}
                className="flex items-center gap-2 w-full text-left touch-manipulation"
              >
                <Info className="w-4 h-4 text-amber-800 shrink-0" />
                <span className="text-sm font-bold text-amber-950">
                  Ethics &amp; limits (read this)
                </span>
              </button>
              {showInfo && (
                <div className="text-xs sm:text-sm text-amber-950/90 leading-relaxed space-y-2">
                  <p>
                    <strong>SynthID</strong> is an invisible pixel watermark Google describes for
                    AI-generated images (e.g. Gemini / &ldquo;Nano Banana&rdquo; style tools).{" "}
                    <a
                      className="underline font-semibold"
                      href="https://deepmind.google/discover/blog/identifying-ai-generated-images-with-synthid/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      DeepMind overview
                    </a>
                    .
                  </p>
                  <p>
                    This utility does <strong>not</strong> guarantee removal or that detectors
                    will change. The optional step uses <strong>public, conservative</strong>{" "}
                    FFT-domain attenuation at carrier bands reported in independent research, scaled
                    to your image size — tuned to stay visually subtle. For deeper tooling (multi‑resolution
                    codebooks, benchmarks) see community projects such as{" "}
                    <a
                      className="underline font-semibold"
                      href="https://github.com/aloshdenny/reverse-SynthID"
                      target="_blank"
                      rel="noreferrer"
                    >
                      reverse‑SynthID
                    </a>{" "}
                    and the paper{" "}
                    <a
                      className="underline font-semibold"
                      href="https://arxiv.org/abs/2510.09263"
                      target="_blank"
                      rel="noreferrer"
                    >
                      arXiv:2510.09263
                    </a>
                    .
                  </p>
                  <p className="font-semibold">
                    Do not use this to mislabel AI images as human-made or to evade platform rules.
                  </p>
                </div>
              )}
            </div>

            <div className="relative z-10 space-y-5 rounded-xl border-[3px] border-neo-ink bg-white p-4 shadow-[6px_6px_0_0_#0a0a0a] sm:p-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setMode("meta")}
                  className={clsx(
                    "flex-1 rounded-lg border-[3px] border-neo-ink px-4 py-3 text-left transition-all touch-manipulation",
                    mode === "meta"
                      ? "bg-neo-ink text-white shadow-[3px_3px_0_0_#62f5cd]"
                      : "bg-white shadow-[3px_3px_0_0_#0a0a0a] hover:bg-neo-bg",
                  )}
                >
                  <div className="text-xs font-bold uppercase tracking-tight mb-1">
                    Metadata only
                  </div>
                  <div className="text-[11px] opacity-80 leading-snug">
                    Re-export through canvas → strips EXIF / container metadata. Pixel values
                    unchanged (lossless for PNG workflow).
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setMode("spectral")}
                  className={clsx(
                    "flex-1 rounded-lg border-[3px] border-neo-ink px-4 py-3 text-left transition-all touch-manipulation",
                    mode === "spectral"
                      ? "bg-neo-ink text-white shadow-[3px_3px_0_0_#ffe94a]"
                      : "bg-white shadow-[3px_3px_0_0_#0a0a0a] hover:bg-neo-bg",
                  )}
                >
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-tight mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Spectral softening
                  </div>
                  <div className="text-[11px] opacity-80 leading-snug">
                    Optional FFT pass at reported carrier bins (scaled to size). Defaults stay mild
                    to limit visible change.
                  </div>
                </button>
              </div>

              {mode === "spectral" && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-zinc-600 uppercase tracking-tight">
                    <span>Carrier attenuation</span>
                    <span>{strength}%</span>
                  </div>
                  <input
                    type="range"
                    min={8}
                    max={85}
                    value={strength}
                    onChange={(e) => setStrength(Number(e.target.value))}
                    className="h-3 w-full cursor-pointer touch-manipulation accent-neo-ink"
                  />
                  <p className="text-[10px] text-zinc-500 leading-relaxed">
                    Lower = closer to original pixels. Raising increases softening at a handful of
                    frequency bins; very high values can introduce subtle blur or ringing.
                  </p>
                </div>
              )}

              {error && (
                <p className="rounded-lg border-[3px] border-neo-ink bg-neo-magenta px-3 py-2 text-sm font-bold text-white shadow-[3px_3px_0_0_#0a0a0a]">
                  {error}
                </p>
              )}
              {lastProfile && !error && outBlob && (
                <p className="text-[11px] text-zinc-600">{lastProfile}</p>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  disabled={busy || !file}
                  onClick={run}
                  className="flex min-h-12 flex-1 items-center justify-center gap-2 border-[3px] border-neo-ink bg-neo-ink text-sm font-black uppercase tracking-tight text-white shadow-[4px_4px_0_0_#62f5cd] hover:translate-x-0.5 hover:translate-y-0.5 disabled:opacity-40 touch-manipulation"
                >
                  {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <Fingerprint className="w-5 h-5" />}
                  {busy ? "Processing…" : "Process image"}
                </button>
                <button
                  type="button"
                  disabled={!outBlob}
                  onClick={download}
                  className="flex min-h-12 flex-1 items-center justify-center gap-2 border-[3px] border-neo-ink bg-white text-sm font-black uppercase tracking-tight text-neo-ink shadow-[4px_4px_0_0_#0a0a0a] hover:bg-neo-bg disabled:opacity-40 touch-manipulation"
                >
                  <Download className="w-5 h-5" />
                  Download PNG
                </button>
              </div>

              <a
                href="https://deepmind.google/technologies/synthid/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-neo-ink/70 underline-offset-4 hover:text-neo-ink"
              >
                Official SynthID page <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid min-h-0 grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="flex min-h-[180px] flex-col overflow-hidden rounded-xl border-[3px] border-neo-ink bg-white p-3 shadow-[5px_5px_0_0_#0a0a0a] sm:p-4">
                <span className="mb-2 shrink-0 text-[10px] font-black uppercase tracking-widest text-neo-ink/50">
                  Original
                </span>
                <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-lg border-2 border-neo-ink bg-neo-bg">
                  {previewUrl && (
                    // eslint-disable-next-line @next/next/no-img-element -- blob preview
                    <img
                      src={previewUrl}
                      alt=""
                      className="max-w-full max-h-[min(40vh,360px)] w-auto h-auto object-contain"
                    />
                  )}
                </div>
              </div>
              <div className="flex min-h-[180px] flex-col overflow-hidden rounded-xl border-[3px] border-neo-ink bg-white p-3 shadow-[5px_5px_0_0_#0a0a0a] sm:p-4">
                <span className="mb-2 shrink-0 text-[10px] font-black uppercase tracking-widest text-neo-ink/50">
                  Output (PNG)
                </span>
                <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-lg border-2 border-neo-ink bg-neo-bg">
                  {outUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={outUrl}
                      alt=""
                      className="max-w-full max-h-[min(40vh,360px)] w-auto h-auto object-contain"
                    />
                  ) : (
                    <div className="px-4 text-center text-sm font-semibold text-neo-ink/45">
                      Run process to preview
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
