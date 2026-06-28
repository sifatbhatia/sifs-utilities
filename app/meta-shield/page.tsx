"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import dynamic from 'next/dynamic';

const MetaShieldWorkspace = dynamic(() => import('@/components/MetaShieldWorkspace'), {
    ssr: false,
});

export default function MetaShieldPage() {
    return (
        <main className="min-h-dvh bg-background p-safe-page relative overflow-x-hidden flex flex-col">
            <div className="max-w-[1760px] mx-auto w-full flex-1 min-h-0 flex flex-col">
                <div className="shrink-0 mb-1 sm:mb-2">
                    <Link
                        href="/sif/utils"
                        className="inline-flex items-center gap-2 min-h-11 py-2 -ml-1 pl-2 pr-3 rounded-xl text-[11px] sm:text-sm font-bold text-black/30 hover:text-black active:text-black/80 transition-colors uppercase tracking-widest touch-manipulation"
                    >
                        <ArrowLeft className="w-4 h-4 shrink-0" />
                        Back to Utils
                    </Link>
                </div>

                <div className="flex-1 flex flex-col min-h-0">
                    <header className="mb-2 sm:mb-4 md:mb-5 shrink-0">
                        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[88px] font-medium leading-[0.95] tracking-[-0.08em] text-primary">
                            MetaShield
                        </h1>
                        <p className="mt-1 text-base sm:text-xl md:text-2xl lg:text-3xl font-medium leading-tight text-primary/80">
                            Your files, without metadata.
                        </p>
                    </header>

                    <div className="flex-1 min-h-0">
                        <MetaShieldWorkspace />
                    </div>
                </div>
            </div>
        </main>
    );
}
