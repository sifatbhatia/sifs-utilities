# sifs-utils — Full Audit Report

**Site:** https://sifs-utils.vercel.app/
**Repo:** https://github.com/sifatbhatia/sifs-utilities.git
**Date:** 2026-06-27

---

## Part 1: Live Site Audit

### Site Summary

Sif's Utilities is a client-side browser-native toolbox offering 8 focused utilities: PixSqueeze (image compression), VidSqueeze (video compression), PDFPress (PDF shrinking), CircleCrop (circular image crop), MetaShield (metadata removal), SynthClean (audio cleanup), GrainPix (film grain styling), and IconSet (favicon/icon generation). All processing happens in-browser with no server uploads.

**Tech stack:**
- Next.js (App Router, RSC + client interactivity)
- Tailwind CSS
- Geist + Geist Mono fonts (self-hosted woff2)
- Lucide icons (inline SVGs)
- Vercel hosting
- Theme system: Classic / Neo-brutal / Liquid Glass, persisted in localStorage

### Issues Found

1. **[MEDIUM] Canonical URL points to different domain** — canonical href and og:url point to sifsutilities.com but the site lives at sifs-utils.vercel.app. The sifsutilities.com domain does not resolve. SEO signals are diluted and social shares will point to the wrong place.

2. **[LOW] Footer links use inconsistent casing** — Footer shows "PIXSQUEEZE" and "VIDSQUEEZE" in all-caps, but URLs are lowercase (/pixsqueeze, /vidsqueeze). The "ALL TOOLS" link goes to /sif/utils.

3. **[LOW] Marquee has no prefers-reduced-motion guard** — The infinite scrolling marquee strip animates unconditionally. Users with prefers-reduced-motion: reduce will still see the animation.

4. **[LOW] No visible loading states or skeleton screens** — Tool pages return 200 but there is no indication of what happens while client-side JS hydrates.

5. **[LOW] Theme flash on page load** — The theme is applied via an inline script reading localStorage, but there is a brief window where the default "classic" theme shows before stored preference takes effect.

### What is Working Well
- All 8 tool pages return HTTP 200
- Clean, well-structured HTML with semantic elements
- Strong accessibility basics (aria-labelledby, aria-hidden, focus-visible, min-h-11 touch targets)
- Responsive design with mobile-first Tailwind classes
- Performance-conscious (self-hosted fonts with preload, next-size-adjust meta, no external tracking)
- Good SEO foundation (OG tags, Twitter cards, JSON-LD, canonical, robots)
- No broken asset references

### Recommendations
1. Fix canonical URL or configure sifsutilities.com properly
2. Add prefers-reduced-motion media query for marquee
3. Audit SynthClean vs synth-strip naming consistency
4. Consider loading skeletons for tool pages
5. Add sitemap.xml and verify robots.txt
6. Test actual tool functionality end-to-end (upload, process, download)

### Screenshot Analysis

The homepage at 1440px width shows a clean, minimalist design with a light gray/white color palette. The layout flows: sticky nav with theme selector, hero section with large typography, horizontal scroll hint cards for featured tools, infinite marquee strip with tool names and badges, featured tools grid (3 cards with colored icon backgrounds), "Why this exists" pillar cards, dark CTA section, footer. The visual hierarchy is strong with good use of whitespace. The Geist font family gives it a clean, technical-but-approachable feel. No visual glitches or layout overflow observed.

---

## Part 2: Code Audit

### Project Overview

- **Framework:** Next.js 16 (App Router) with next@16.3.0-canary.5 (canary)
- **Language:** TypeScript (strict mode)
- **UI:** React 19, Tailwind CSS 4, Framer Motion
- **30 files** of TS/TSX, approximately 6,560 lines total
- **8 client-side tools** + 1 server API route
- **No test framework** configured
- tsc --noEmit passes clean, zero type errors

### Issues Found

1. **[CRITICAL] Security: Known-vulnerable Next.js canary** — next@16.3.0-canary.5 has 19 npm audit vulnerabilities (high severity): HTTP request smuggling, unbounded disk cache, DoS, CSRF bypass, XSS, cache poisoning, SSRF. Recommendation: Upgrade to latest stable (16.2.9+).

2. **[HIGH] MetaShieldWorkspace.tsx:80 — Regex-based XML parsing** — Uses regex to strip metadata from Office documents. Fragile against namespaced XML, CDATA sections, attribute ordering changes. Recommendation: Use a proper XML parser.

3. **[HIGH] IconSetWorkspace.tsx:56,84 — Memory leak in icon preview loop** — URL.createObjectURL called inside .map() for each icon size on every render. Object URLs are never revoked. Recommendation: Create once, revoke in useEffect cleanup.

4. **[MEDIUM] Inconsistent React import style** — 6 files use named imports, 3 use React.useState global namespace. Recommendation: Standardize on named imports.

5. **[MEDIUM] 12 unused imports across codebase** — Including useRef, useCallback, motion, AnimatePresence, Download, LayoutGrid, ImageIcon, Settings2, dynamic, Link, isProcessing. Dead code hurting bundle size and readability.

6. **[MEDIUM] 3 img elements where next/image should be used** — IconSetWorkspace.tsx:154, ImageWorkspace.tsx:105, MetaShieldWorkspace.tsx:215. Mostly blob URLs which is acceptable.

7. **[MEDIUM] VidContext.tsx — FFmpeg.log fires console.log on every message** — Dumps all FFmpeg output to browser console on every video. Recommendation: Gate behind debug flag.

8. **[MEDIUM] No error boundaries anywhere** — Zero ErrorBoundary usage. One crash equals white screen. Recommendation: Wrap each tool workspace.

9. **[MEDIUM] No loading states on initial page transitions** — Heavy client bundles (ffmpeg.wasm, pdfjs-dist, sharp) load without skeleton states. Recommendation: Add loading.tsx per route.

10. **[LOW] Hardcoded FFmpeg CDN URL** — https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd. Recommendation: Move to next.config.ts or self-host WASM assets.

11. **[LOW] Missing server-side input validation** — /api/convert route has no file size cap or MIME allowlist before sharp processes anything. Recommendation: Add explicit validation.

12. **[LOW] IconSetWorkspace.tsx:96 — Canvas toBlob inside map loop** — Race condition risk. Recommendation: Promise.all with explicit async/await.

### Architecture Assessment

**Strengths:**
- Clean Context + Workspace separation per tool
- marketingChrome.ts theme-system abstraction is impressive and DRY
- Client-side-first architecture for privacy
- TypeScript strict mode, zero any types
- No prop drilling, well-scoped contexts

**Weaknesses:**
- No test infrastructure (FFmpeg WASM, PDF.js, canvas manipulation need smoke tests)
- No Suspense boundaries for heavy dynamic imports
- All Context providers are singletons per tool route

### What is Good
1. TypeScript strict mode clean, zero any types
2. Thoughtful mobile UX (touch-manipulation, p-safe-page, min-h-dvh, safe-area insets)
3. Useful README with tool table, security notes, mobile considerations
4. SynthClean ethics banner with links to research
5. Standardized workspace anatomy across all tools
6. Graceful degradation in PDF compression

---

## Priority Fixes

| Priority | Issue | Recommendation |
|----------|-------|----------------|
| P0 | Next.js canary with 19 CVEs | Upgrade to stable 16.2.9+ |
| P1 | IconSetWorkspace memory leak | Revoke object URLs in useEffect |
| P1 | 12+ unused imports | Clean up dead code |
| P1 | No error boundaries | Add per-tool ErrorBoundary |
| P2 | Missing /api/convert validation | Add file size cap + MIME allowlist |
| P2 | No loading skeletons | Add loading.tsx per route |
| P2 | Inconsistent React imports | Standardize on named imports |
| P3 | FFmpeg console.log spam | Gate behind debug flag |
| P3 | Hardcoded FFmpeg CDN URL | Self-host or move to env |

---

*Report generated 2026-06-27 by Figé audit pipeline.*
