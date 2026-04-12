/**
 * Radix-2 Cooley–Tukey FFT / inverse FFT for power-of-two lengths.
 * Real input: imaginary parts zero. Used for spectral image processing.
 */

function bitReversePermute(re: Float64Array, im: Float64Array): void {
  const n = re.length;
  let j = 0;
  // Standard loop is i < n - 1; one more iteration can drive k to 0 and hang `while (k <= j)`.
  for (let i = 0; i < n - 1; i++) {
    if (i < j) {
      [re[i], re[j]] = [re[j], re[i]];
      [im[i], im[j]] = [im[j], im[i]];
    }
    let k = n >> 1;
    while (k <= j) {
      j -= k;
      k >>= 1;
    }
    j += k;
  }
}

/** In-place FFT. length must be power of 2. */
export function fft1d(re: Float64Array, im: Float64Array): void {
  const n = re.length;
  if ((n & (n - 1)) !== 0) throw new Error("fft1d: length must be power of 2");

  bitReversePermute(re, im);

  for (let size = 2; size <= n; size <<= 1) {
    const half = size >> 1;
    const angle = (-2 * Math.PI) / size;
    for (let i = 0; i < n; i += size) {
      for (let j = 0; j < half; j++) {
        const k = i + j + half;
        const theta = angle * j;
        const wr = Math.cos(theta);
        const wi = Math.sin(theta);
        const tr = re[k] * wr - im[k] * wi;
        const ti = re[k] * wi + im[k] * wr;
        re[k] = re[i + j] - tr;
        im[k] = im[i + j] - ti;
        re[i + j] += tr;
        im[i + j] += ti;
      }
    }
  }
}

/** Inverse FFT; divides by n (matches ifft convention). */
export function ifft1d(re: Float64Array, im: Float64Array): void {
  const n = re.length;
  for (let i = 0; i < n; i++) im[i] = -im[i];
  fft1d(re, im);
  for (let i = 0; i < n; i++) im[i] = -im[i];
  const inv = 1 / n;
  for (let i = 0; i < n; i++) {
    re[i] *= inv;
    im[i] *= inv;
  }
}

function nextPow2(n: number): number {
  let p = 1;
  while (p < n) p <<= 1;
  return p;
}

export function padDimensions(h: number, w: number): { ph: number; pw: number } {
  return { ph: nextPow2(h), pw: nextPow2(w) };
}

/** Separate 2D FFT: rows then columns. Arrays row-major ph x pw. */
export function fft2d(re: Float64Array, im: Float64Array, ph: number, pw: number): void {
  const rowRe = new Float64Array(pw);
  const rowIm = new Float64Array(pw);
  for (let y = 0; y < ph; y++) {
    const off = y * pw;
    for (let x = 0; x < pw; x++) {
      rowRe[x] = re[off + x];
      rowIm[x] = im[off + x];
    }
    fft1d(rowRe, rowIm);
    for (let x = 0; x < pw; x++) {
      re[off + x] = rowRe[x];
      im[off + x] = rowIm[x];
    }
  }

  const colRe = new Float64Array(ph);
  const colIm = new Float64Array(ph);
  for (let x = 0; x < pw; x++) {
    for (let y = 0; y < ph; y++) {
      colRe[y] = re[y * pw + x];
      colIm[y] = im[y * pw + x];
    }
    fft1d(colRe, colIm);
    for (let y = 0; y < ph; y++) {
      re[y * pw + x] = colRe[y];
      im[y * pw + x] = colIm[y];
    }
  }
}

export function ifft2d(re: Float64Array, im: Float64Array, ph: number, pw: number): void {
  const rowRe = new Float64Array(pw);
  const rowIm = new Float64Array(pw);
  for (let y = 0; y < ph; y++) {
    const off = y * pw;
    for (let x = 0; x < pw; x++) {
      rowRe[x] = re[off + x];
      rowIm[x] = im[off + x];
    }
    ifft1d(rowRe, rowIm);
    for (let x = 0; x < pw; x++) {
      re[off + x] = rowRe[x];
      im[off + x] = rowIm[x];
    }
  }

  const colRe = new Float64Array(ph);
  const colIm = new Float64Array(ph);
  for (let x = 0; x < pw; x++) {
    for (let y = 0; y < ph; y++) {
      colRe[y] = re[y * pw + x];
      colIm[y] = im[y * pw + x];
    }
    ifft1d(colRe, colIm);
    for (let y = 0; y < ph; y++) {
      re[y * pw + x] = colRe[y];
      im[y * pw + x] = colIm[y];
    }
  }
}
