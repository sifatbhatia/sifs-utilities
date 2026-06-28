"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Settings2, List, Plus } from 'lucide-react';
import DropZone from './DropZone';
import PremiumBackground from '@/components/PremiumBackground';
import clsx from 'clsx';
import { useVid } from '@/app/vidsqueeze/VidContext'; // Correct app/vidsqueeze path
import BatchQueue, { BatchFile } from './BatchQueue';
import { formatBytes } from '@/lib/compression';

import PremiumSlider from './PremiumSlider';
import { useTheme } from '@/components/theme/ThemeProvider';
import { workspaceChrome } from '@/lib/marketingChrome';

export default function VidSqueezeWorkspace() {
    const { theme } = useTheme();
    const w = workspaceChrome(theme);
    const {
        files,
        setFiles,
        isBatchProcessing,
        quality,
        setQuality,
        handleDownloadAll,
        handleFilesSelect
    } = useVid();

    const [showQueue, setShowQueue] = useState(false);

    // Reset files to pending if quality changes
    useEffect(() => {
        setFiles(prev => prev.map(f => f.status === 'completed' || f.status === 'error' ? { ...f, status: 'pending' } : f));
    }, [quality, setFiles]);

    const activeFile = files.length > 0 ? files[0] : null;

    const blobSource = activeFile ? (activeFile.compressedBlob ?? activeFile.file) : null;
    const videoUrl = useMemo(() => {
        if (!blobSource) return null;
        return URL.createObjectURL(blobSource);
    }, [blobSource]);

    useEffect(() => {
        if (!videoUrl) return undefined;
        return () => URL.revokeObjectURL(videoUrl);
    }, [videoUrl]);

    const totalOriginalSize = files.reduce((acc: number, f: BatchFile) => acc + f.originalSize, 0);
    const totalCompressedSize = files.reduce((acc: number, f: BatchFile) => acc + (f.compressedSize || f.originalSize), 0);
    const totalReduction = totalOriginalSize > 0
        ? Math.round(((totalOriginalSize - totalCompressedSize) / totalOriginalSize) * 100)
        : 0;

    return (
        <div className="w-full h-full flex flex-col flex-1 min-h-0 relative">
            <PremiumBackground />
            <AnimatePresence mode="wait">
                {files.length === 0 ? (
                    <motion.div
                        key="dropzone"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="flex-1 flex items-center justify-center p-4 relative"
                    >
                        <DropZone
                            onFileSelect={handleFilesSelect}
                            isProcessing={isBatchProcessing}
                            accept={{ 'video/*': ['.mp4', '.mov', '.avi', '.webm'] }}
                            text="Add your video"
                            subText="Drop video to compress"
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="workspace"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 flex flex-col lg:grid lg:grid-cols-[1fr_340px] gap-4 p-2 sm:p-4 md:p-6 min-h-0 md:h-full md:overflow-hidden max-w-[1500px] mx-auto w-full relative"
                    >
                        {/* LEFT COLUMN: Preview + Controls */}
                        <div className="flex flex-col gap-4 min-h-0 flex-1 relative">
                            <div className="neo-shell-outer">
                                <div className="neo-shell-inner w-full h-full overflow-hidden relative flex-1 flex items-center justify-center">
                                    {files.length > 0 ? (
                                        <div className="w-full h-full flex items-center justify-center p-4">
                                            <div className="relative max-w-full max-h-full rounded-2xl overflow-hidden shadow-2xl border border-black/5 bg-black">
                                                <video
                                                    src={videoUrl || ""}
                                                    controls
                                                    className="max-w-full max-h-full"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-4 text-black/5">
                                            <Plus className="w-16 h-16" />
                                            <p className="text-[10px] font-bold uppercase tracking-tight">Awaiting Video</p>
                                        </div>
                                    )}

                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setFiles([])}
                                        className="absolute top-4 right-4 z-10 bg-black/5 hover:bg-black/10 text-black/30 hover:text-black p-2.5 rounded-full transition-all border border-black/5"
                                    >
                                        <X className="w-5 h-5" />
                                    </motion.button>
                                </div>

                                {/* Compact Floating Controls - Liquid Glass */}
                                <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-[840px] bg-white/60 backdrop-blur-xl rounded-[28px] sm:rounded-[36px] border border-white/40 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.1)] p-3 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-10 z-20">

                                    {/* Status Info */}
                                    <div className="flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-center shrink-0 w-full sm:w-auto min-w-[120px]">
                                        <div className="flex flex-col items-start px-1">
                                            <div className="text-[8px] sm:text-[9px] font-bold text-zinc-400 uppercase tracking-tight mb-0.5">Saved</div>
                                            <div className="text-lg sm:text-2xl font-bold text-emerald-600 leading-none">
                                                {totalReduction}%
                                            </div>
                                        </div>
                                        <div className="bg-zinc-100 px-2 py-0.5 rounded-full text-[8px] font-bold text-zinc-500 uppercase tracking-tight mt-1">
                                            {formatBytes(totalOriginalSize - totalCompressedSize)}
                                        </div>
                                    </div>

                                    {/* Parameters */}
                                    <div className="flex-1 w-full space-y-1">
                                        <PremiumSlider
                                            label="Compression (CRF)"
                                            value={quality}
                                            min={18}
                                            max={35}
                                            step={1}
                                            icon={<Settings2 className="w-3" />}
                                            onChange={() => { }}
                                            onAfterChange={(v) => setQuality(v)}
                                            labelColor={theme === "neo-brutal" ? "text-neo-ink/50" : "text-zinc-400"}
                                            valueColor={theme === "neo-brutal" ? "text-neo-ink" : "text-zinc-800"}
                                        />
                                        <div className="flex justify-between text-[7px] font-bold text-zinc-300 uppercase tracking-[0.3em] px-1 pointer-events-none">
                                            <span>High Fidelity</span>
                                            <span>Max Compression</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="shrink-0 w-full sm:w-auto">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleDownloadAll}
                                            disabled={totalCompressedSize === 0 || isBatchProcessing}
                                            className={clsx(w.runPrimary, "w-full px-8 py-3.5 rounded-[20px] text-[11px] sm:text-xs")}
                                        >
                                            <Download className="w-3.5 h-3.5" /> Export All
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Sidebar (Queue) */}
                        <div className={clsx(
                            "flex flex-col neo-sidebar overflow-hidden min-h-0",
                            showQueue ? "fixed inset-4 z-50 lg:relative lg:inset-auto" : "hidden lg:flex",
                            "lg:h-full"
                        )}>
                            <div className="p-5 shrink-0 flex items-center justify-between border-b border-black/10 bg-black/5">
                                <h3 className={clsx("text-sm font-bold uppercase tracking-tight", theme === "neo-brutal" ? "text-neo-ink" : "text-zinc-800")}>Queue</h3>
                                <div className="flex items-center gap-2">
                                    <div className="text-[10px] font-bold text-zinc-400 bg-zinc-100 px-2.5 py-1 rounded-full uppercase tracking-tight">{files.length}</div>
                                    <button onClick={() => setShowQueue(false)} className="lg:hidden p-1.5 rounded-full hover:bg-black/10 transition-colors">
                                        <X className="w-4 h-4 text-zinc-500" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto min-h-0 px-4 py-4 custom-scrollbar">
                                <BatchQueue
                                    files={files}
                                    onRemove={(id) => setFiles(prev => prev.filter(f => f.id !== id))}
                                />
                            </div>
                        </div>

                        {/* Mobile Queue Button */}
                        <button
                            onClick={() => setShowQueue(true)}
                            className={clsx(
                                "fixed safe-fab z-40 lg:hidden w-12 h-12 min-w-12 min-h-12 rounded-full shadow-xl flex items-center justify-center active:scale-95 transition-all touch-manipulation",
                                theme === "classic"
                                    ? "bg-[#575757] text-white hover:bg-[#4d4d4d]"
                                    : theme === "liquid-glass"
                                        ? "bg-neutral-900 text-white hover:bg-neutral-800 border border-white/10"
                                        : "bg-neo-ink text-white hover:bg-neo-ink/90 border-[3px] border-neo-ink"
                            )}
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
