# Sif's Utilities

**Sif's Utilities** is a small suite of creative and utility tools that run mostly **in your browser**: compress media, tweak PDFs, prep icons, and strip metadata without uploading files to a custom backend for those flows.

Built with **Next.js 16** (App Router), **React 19**, **TypeScript**, and **Tailwind CSS 4**.

---

## What's included

| Tool | Path | Summary |
|------|------|--------|
| **PixSqueeze** | `/pixsqueeze` | Image compression with live preview and batch queue |
| **PDFPress** | `/pdf-compressor` | Client-side PDF compression |
| **CircleCrop** | `/circle-crop` | Circular crops / profile-style exports |
| **VidSqueeze** | `/vidsqueeze` | In-browser video compression (**FFmpeg.wasm**) |
| **MetaShield** | `/meta-shield` | Remove metadata from supported files |
| **SynthClean** | `/synth-strip` | Re-export images without EXIF; optional conservative FFT softening at publicly reported SynthID-style carrier bands (Gemini / "Nano Banana" class exports — see in-app disclaimer) |
| **GrainPix** | `/grain-pix` | Film-style grain on images |
| **IconSet** | `/icon-set` | Generate app icons and favicons |
| **JSON Formatter** | `/json-formatter` | Format, compact, validate, copy, and download JSON locally |
| **YAML Formatter** | `/yaml-formatter` | Format, compact, validate, copy, and download YAML locally |

The **marketing landing** lives at **`/`**; the classic tool grid is at **`/sif/utils`**.

---

## Server API

- **`POST /api/convert`** — Image transcoding/compression using **Sharp** (JPEG, PNG, WebP, AVIF, TIFF). Used where a server-side encode is needed; deploy targets must support the Node native module.

---

## Getting started

**Requirements:** Node.js **20+** recommended.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You should land on the landing page; the full tool grid is at `/sif/utils`.

| Command | Purpose |
|--------|---------|
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | ESLint |

---

## Mobile and touch

The UI is tuned for phones and notched devices:

- **Safe areas** — Layout padding uses `env(safe-area-inset-*)` via the `p-safe-page` and `p-safe-hub` utilities in `app/globals.css`.
- **Viewport** — `viewport-fit=cover` and theme colors are set in `app/layout.tsx` so standalone / full-screen modes look correct.
- **Touch** — Larger tap targets on "Back" links, hub cards, drop zones, queue actions, and floating queue buttons; `touch-manipulation` on key controls to reduce tap delay where appropriate.
- **Height** — Full-height shells use **`min-h-dvh` / `100dvh`** so mobile browser chrome does not clip content.

---

## Security and privacy notes

- Most processing happens **client-side**; files are not sent to app-specific servers for those tools.
- **SynthClean** is for legitimate workflows (your own exports, research). It does **not** guarantee removal of Google SynthID or any detector signal. The optional spectral step follows **public** carrier-frequency reports and is capped to reduce visible degradation; see [DeepMind on SynthID](https://deepmind.google/discover/blog/identifying-ai-generated-images-with-synthid/) and the academic discussion in [arXiv:2510.09263](https://arxiv.org/abs/2510.09263).
- **VidSqueeze** loads FFmpeg core assets from a **CDN** (`unpkg`) when you run compression — see `app/vidsqueeze/VidContext.tsx` if you need to self-host.
- **COOP / COEP** headers are set in `next.config.ts` for SharedArrayBuffer compatibility with FFmpeg.wasm; third-party embeds may need alignment with those headers.

---

## Utility improvement backlog

| Priority | Area | Improvement |
|----------|------|-------------|
| P0 | Build | Investigate why `next build` can stall at `Creating an optimized production build ...` in this workspace. |
| P1 | Previews | Keep blob preview/download URLs on explicit create/revoke lifecycles. |
| P1 | Errors | Surface workspace-level processing errors inside each tool, not only in the console. |
| P2 | PixSqueeze | Add a per-file before/after size table and keep active-file selection stable during batch updates. |
| P2 | VidSqueeze | Show FFmpeg load/progress states and clearer CRF/output-size guidance. |
| P2 | PDFPress | Polish page extraction and preview refresh states. |
| P2 | MetaShield | Show supported file types and exact metadata fields removed before processing. |
| P3 | IconSet | Export a PWA/apple-touch-icon manifest snippet with generated assets. |
| P3 | GrainPix | Add seeded grain for repeatable exports. |

---

## Deploying

Deploy like any Next.js app ([Vercel](https://vercel.com), Node host, Docker, etc.). Check that:

1. **Sharp** is available in the runtime if you rely on `/api/convert`.
2. **Headers** in `next.config.ts` still match your hosting and any reverse proxy.

Set a real canonical URL in **`metadataBase`** inside `app/layout.tsx` when you have a production domain (helps Open Graph and social previews).

---

## Project layout (short)

- `app/` — Routes, layouts, API route
- `components/` — Workspaces, drop zones, queues, shared UI
- `lib/` — Canvas helpers, compression helpers

---

## License

Private / unlicensed unless you add a license file. Adjust this section when you publish.
