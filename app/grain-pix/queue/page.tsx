"use client";

import React from 'react';
import { useGrain } from '../GrainContext';
import BatchQueue from '@/components/BatchQueue';
import { Download } from 'lucide-react';
import PremiumBackground from '@/components/PremiumBackground';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function QueuePage() {
    const { files, isBatchProcessing, handleRemoveFile, handleDownloadAll } = useGrain();

    const totalFiles = files.length;

    return (
        <main className="min-h-dvh h-[100dvh] bg-background p-safe-page relative overflow-hidden flex flex-col">
            <PremiumBackground />
            <div className="max-w-[1760px] mx-auto w-full h-full flex flex-col z-10 relative">
                <div className="shrink-0 mb-4 sm:mb-6">
                    <Link
                        href="/grain-pix"
                        className="inline-flex items-center gap-2 min-h-11 py-2 -ml-1 pl-2 pr-3 rounded-xl text-sm font-bold text-black/30 hover:text-black active:text-black/80 transition-colors uppercase tracking-widest touch-manipulation"
                    >
                        <ArrowLeft className="w-4 h-4 shrink-0" />
                        Back to Workspace
                    </Link>
                </div>

                <div className="flex-1 flex flex-col min-h-0 bg-white/40 backdrop-blur-xl rounded-[24px] sm:rounded-[40px] border border-black/5 shadow-2xl p-4 sm:p-6">
                    <div className="p-4 sm:p-6 shrink-0 flex items-center justify-between border-b border-black/5 bg-white/20">
                        <h3 className="text-xl font-bold text-[#1d1d1f] tracking-tight">Processing Queue</h3>
                        <div className="text-xs font-bold text-[#1d1d1f]/40 bg-black/5 px-2.5 py-1 rounded-full uppercase tracking-widest">
                            {files.length} {files.length === 1 ? 'file' : 'files'}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto min-h-0 px-4 py-4 custom-scrollbar">
                        <BatchQueue
                            files={files}
                            onRemove={handleRemoveFile}
                            isProcessing={isBatchProcessing}
                        />
                    </div>

                    <div className="p-4 border-t border-black/5 bg-white/20 shrink-0">
                        <button
                            onClick={handleDownloadAll}
                            disabled={totalFiles === 0}
                            className="w-full min-h-12 py-4 bg-[#1d1d1f] text-white rounded-[20px] font-bold text-base sm:text-lg hover:bg-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl shadow-black/20 touch-manipulation"
                        >
                            <Download size={20} />
                            Download All
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
