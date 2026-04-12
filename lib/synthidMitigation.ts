/**
 * Experimental, research-informed spectral softening informed by public analysis of
 * Google SynthID-style spread-spectrum carriers (see DeepMind SynthID blog + independent
 * spectral studies). This is NOT a guaranteed watermark remover; it conservatively
 * attenuates magnitude at a small set of low/mid-frequency bins that have been reported
 * for specific export sizes, scaled to the padded FFT grid.
 *
 * References (user-facing copy links in UI):
 * - https://deepmind.google/discover/blog/identifying-ai-generated-images-with-synthid/
 * - https://arxiv.org/abs/2510.09263
 */

import { fft2d, ifft2d, padDimensions } from "./fft2d";

/** Documented carriers for ~1024×1024-class square exports (community spectral reports). */
const CARRIERS_1024: readonly [number, number][] = [
  [9, 9],
  [5, 5],
  [10, 11],
  [13, 6],
];

/** Documented carriers for ~1536×2816-class tall exports. */
const CARRIERS_TALL: readonly [number, number][] = [
  [768, 704],
  [672, 1056],
  [480, 1408],
  [384, 1408],
];

const REF_SQUARE = { h: 1024, w: 1024 };
const REF_TALL = { h: 1536, w: 2816 };

function pickProfile(h: number, w: number): {
  carriers: readonly [number, number][];
  refH: number;
  refW: number;
  profile: "square" | "tall";
} {
  const ar = w / Math.max(1, h);
  const tallRefAr = REF_TALL.w / REF_TALL.h;
  if (Math.abs(ar - tallRefAr) < 0.35 && h > 900 && w > 1800) {
    return {
      carriers: CARRIERS_TALL,
      refH: REF_TALL.h,
      refW: REF_TALL.w,
      profile: "tall",
    };
  }
  return {
    carriers: CARRIERS_1024,
    refH: REF_SQUARE.h,
    refW: REF_SQUARE.w,
    profile: "square",
  };
}

function scaleCarriers(
  carriers: readonly [number, number][],
  refH: number,
  refW: number,
  ph: number,
  pw: number,
): [number, number][] {
  const seen = new Set<string>();
  const out: [number, number][] = [];
  for (const [fy, fx] of carriers) {
    const y = Math.min(ph - 1, Math.max(1, Math.round((fy * ph) / refH)));
    const x = Math.min(pw - 1, Math.max(1, Math.round((fx * pw) / refW)));
    const key = `${y},${x}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push([y, x]);
  }
  return out;
}

function attenuateBin(
  re: Float64Array,
  im: Float64Array,
  pw: number,
  y: number,
  x: number,
  magnitudeScale: number,
): void {
  const idx = y * pw + x;
  re[idx] *= magnitudeScale;
  im[idx] *= magnitudeScale;
}

/** Hermitian symmetry for real-valued spatial signal */
function attenuateHermitianPair(
  re: Float64Array,
  im: Float64Array,
  ph: number,
  pw: number,
  y: number,
  x: number,
  factor: number,
): void {
  if (y === 0 && x === 0) return;
  attenuateBin(re, im, pw, y, x, factor);
  const y2 = y === 0 ? 0 : ph - y;
  const x2 = x === 0 ? 0 : pw - x;
  if (y2 !== y || x2 !== x) attenuateBin(re, im, pw, y2, x2, factor);
}

function processChannel(
  src: Uint8ClampedArray,
  channelOff: number,
  ph: number,
  pw: number,
  h: number,
  w: number,
  carriers: [number, number][],
  strength: number,
  channelWeight: number,
): Float64Array {
  const n = ph * pw;
  const re = new Float64Array(n);
  const im = new Float64Array(n);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const si = (y * w + x) * 4 + channelOff;
      re[y * pw + x] = src[si];
    }
  }

  fft2d(re, im, ph, pw);

  const base = 1 - Math.min(0.22, 0.06 + (strength / 100) * 0.16) * channelWeight;
  const factor = Math.max(0.65, base);

  for (const [cy, cx] of carriers) {
    if (cy < 3 && cx < 3) continue;
    attenuateHermitianPair(re, im, ph, pw, cy, cx, factor);
  }

  ifft2d(re, im, ph, pw);

  return re;
}

export type MitigationResult = {
  data: ImageData;
  profile: "square" | "tall";
  paddedH: number;
  paddedW: number;
};

/**
 * strength: 0–100. Higher = more attenuation at carrier bins (small visual risk at high values).
 */
export function mitigateSynthidLike(
  source: ImageData,
  strength: number,
): MitigationResult {
  const h = source.height;
  const w = source.width;
  const { ph, pw } = padDimensions(h, w);
  if (ph > 4096 || pw > 4096) {
    throw new Error("Image too large for in-browser spectral pass (max padded side 4096).");
  }

  const { carriers: refCarriers, refH, refW, profile } = pickProfile(h, w);
  const carriers = scaleCarriers(refCarriers, refH, refW, ph, pw);

  const g = processChannel(source.data, 1, ph, pw, h, w, carriers, strength, 1);
  const r = processChannel(source.data, 0, ph, pw, h, w, carriers, strength, 0.85);
  const b = processChannel(source.data, 2, ph, pw, h, w, carriers, strength, 0.7);

  const out = new ImageData(w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const j = y * pw + x;
      out.data[i] = clamp255(r[j]);
      out.data[i + 1] = clamp255(g[j]);
      out.data[i + 2] = clamp255(b[j]);
      out.data[i + 3] = source.data[i + 3];
    }
  }

  return { data: out, profile, paddedH: ph, paddedW: pw };
}

function clamp255(v: number): number {
  if (v < 0) return 0;
  if (v > 255) return 255;
  return Math.round(v);
}
