"use client";

import { useEffect } from "react";

type ToolRouteErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ToolRouteError({ error, reset }: ToolRouteErrorProps) {
  useEffect(() => {
    console.error("Tool route failed:", error);
  }, [error]);

  return (
    <main className="min-h-dvh bg-background p-safe-page relative overflow-hidden flex items-center justify-center">
      <section className="w-full max-w-xl rounded-2xl border border-black/10 bg-white/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur">
        <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">
          Utility Error
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-primary">
          This tool could not finish loading.
        </h1>
        <p className="mt-3 text-sm leading-6 text-primary/70">
          Try again. If it repeats, reload the page before processing another
          file.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-zinc-900 px-5 text-sm font-bold uppercase tracking-tight text-white transition-colors hover:bg-zinc-700"
        >
          Retry
        </button>
      </section>
    </main>
  );
}
