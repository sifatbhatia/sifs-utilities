"use client";

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import DropZone from './DropZone';
import { formatBytes } from '@/lib/compression';
import { Info, Loader2, X, List, Plus, Download, Settings2 } from 'lucide-react';
import clsx from 'clsx';
import PremiumBackground from '@/components/PremiumBackground';
import BatchQueue from './BatchQueue';
import { usePix } from '@/app/pixsqueeze/PixContext';
import PremiumSlider from './PremiumSlider';
import { useTheme } from '@/components/theme/ThemeProvider';
import { workspaceChrome } from '@/lib/marketingChrome';

// ControlPanel removed


export default function ImageWorkspace() {
    const { theme } = useTheme();
    const w = workspaceChrome(theme);
    const {
        files,
        setFiles,
        isBatchProcessing,
        quality,
        setQuality,
        format,
        setFormat,
        handleDownloadAll,
        handleFilesSelect
    } = usePix();

    const [showQueue, setShowQueue] = useState(false);

    // Single View State
    const [originalUrl, setOriginalUrl] = useState<string | null>(null);
    const [processedUrl, setProcessedUrl] = useState<string | null>(null);
    const [showOriginal, setShowOriginal] = useState(false);

    // Active file logic (default to first file for now)
    const activeFile = files.length > 0 ? files[0] : null;

    useEffect(() => {
        if (activeFile && activeFile.status === 'completed' && activeFile.compressedBlob) {
            setOriginalUrl(URL.createObjectURL(activeFile.file));
            setProcessedUrl(URL.createObjectURL(activeFile.compressedBlob));
        } else if (activeFile) {
            setOriginalUrl(URL.createObjectURL(activeFile.file));
            setProcessedUrl(null);
        } else {
            setOriginalUrl(null);
            setProcessedUrl(null);
        }

        return () => {
            if (originalUrl) URL.revokeObjectURL(originalUrl);
            if (processedUrl) URL.revokeObjectURL(processedUrl);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeFile?.status, activeFile?.file]);

    const totalOriginalSize = files.reduce((acc, f) => acc + f.originalSize, 0);
    const totalCompressedSize = files.reduce((acc, f) => acc + (f.compressedSize || f.originalSize), 0);
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
                        <DropZone onFileSelect={handleFilesSelect} isProcessing={isBatchProcessing} />
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
                            <div
                                className="neo-shell-outer border-0 w-full h-full overflow-hidden relative flex-1 flex flex-col items-center justify-start group/main shadow-[0px_24px_48px_0px_rgba(0,0,0,0.36),0px_8px_18px_0px_rgba(0,0,0,0.26),inset_0px_1px_0px_0px_rgba(255,255,255,0.34),inset_0px_-10px_18px_0px_rgba(0,0,0,0.16)]"
                                onMouseDown={() => setShowOriginal(true)}
                                onMouseUp={() => setShowOriginal(false)}
                                onMouseLeave={() => setShowOriginal(false)}
                                onTouchStart={() => setShowOriginal(true)}
                                onTouchEnd={() => setShowOriginal(false)}
                            >
                                    {originalUrl ? (
                                        <>
                                            {/* eslint-disable-next-line @next/next/no-img-element -- Blob object URLs cannot be optimized by next/image. */}
                                            <img
                                                src={showOriginal ? originalUrl : (processedUrl || originalUrl)}
                                                alt="Preview"
                                                className={clsx(
                                                    "max-w-[86%] max-h-[86%] sm:max-w-[82%] sm:max-h-[82%] object-contain pointer-events-none select-none transition-all duration-500 p-4 cursor-pointer",
                                                    !processedUrl && "opacity-30 blur-xl grayscale"
                                                )}
                                            />

                                            <AnimatePresence>
                                                {!processedUrl && (
                                                    <motion.div
                                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                        className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                                                    >
                                                        <Loader2 className="w-10 h-10 text-black/20 animate-spin" />
                                                        <span className="text-[9px] font-bold uppercase tracking-tight text-zinc-400 animate-pulse">Processing</span>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {processedUrl && (
                                                <div className="absolute top-4 left-1/2 -translate-x-1/2 neo-pill-tag opacity-0 pointer-events-none transition-all scale-90 group-hover/main:scale-100 group-hover/main:opacity-100">
                                                    <Info size={12} className="text-black/40" />
                                                    <span className="text-[9px] font-black uppercase tracking-tight text-neo-ink/70">
                                                        {showOriginal ? 'Original' : 'Hold to compare'}
                                                    </span>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-4 text-black/5">
                                            <Plus className="w-16 h-16" />
                                            <p className="text-[10px] font-bold uppercase tracking-tight">No Preview</p>
                                        </div>
                                    )}

                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setFiles([])}
                                    className="absolute top-4 right-4 z-10 bg-black/5 hover:bg-black/10 text-black/30 hover:text-black p-2.5 rounded-full transition-all border border-black/5 shadow-[0px_8px_20px_0px_rgba(0,0,0,0.14),inset_0px_1px_0px_0px_rgba(255,255,255,0.35)] hover:shadow-[0px_10px_24px_0px_rgba(0,0,0,0.18),inset_0px_1px_0px_0px_rgba(255,255,255,0.45)]"
                                >
                                    <X className="w-5 h-5" />
                                </motion.button>

                                {/* Compact Controls - Liquid Glass */}
                                <div className="neo-dock max-w-[840px] p-3 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-10 backdrop-blur-xl shadow-[0px_18px_36px_0px_rgba(0,0,0,0.16),0px_2px_8px_0px_rgba(0,0,0,0.08),inset_0px_1px_0px_0px_rgba(255,255,255,0.36)]">

                                    {/* Size Info */}
                                    <div className="flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-center shrink-0 w-full sm:w-auto min-w-[110px]">
                                        <div className="flex flex-col items-start px-1">
                                            <div className="text-[8px] sm:text-[9px] font-bold text-zinc-400 uppercase tracking-tight mb-0.5">Size</div>
                                            <div className="text-lg sm:text-2xl font-bold text-zinc-800 leading-none">
                                                {formatBytes(totalCompressedSize)}
                                            </div>
                                        </div>
                                        {totalReduction > 0 && (
                                            <div className="bg-zinc-100 px-2 py-0.5 rounded-full text-[8px] font-bold text-zinc-500 uppercase tracking-tight mt-1">
                                                -{totalReduction}%
                                            </div>
                                        )}
                                    </div>

                                    {/* Parameters */}
                                    <div className="flex-1 w-full flex flex-col gap-4 sm:gap-5">
                                        <PremiumSlider
                                            label="Quality"
                                            value={quality}
                                            min={1}
                                            max={100}
                                            unit="%"
                                            icon={<Settings2 className="w-3" />}
                                            onChange={() => { }}
                                            onAfterChange={(v) => setQuality(v)}
                                            labelColor={theme === "neo-brutal" ? "text-neo-ink/50" : "text-zinc-400"}
                                            valueColor={theme === "neo-brutal" ? "text-neo-ink" : "text-zinc-800"}
                                        />

                                        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                                            <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-tight mr-2 shrink-0">Output</span>
                                            {['webp', 'jpeg', 'png', 'avif'].map((f) => (
                                                <motion.button
                                                    key={f}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setFormat(f)}
                                                    className={clsx(
                                                        "px-3.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-tight transition-all shrink-0 border",
                                                        format === f
                                                            ? (theme === "classic"
                                                                ? "bg-[#575757] text-white border-[#575757]"
                                                                : theme === "liquid-glass"
                                                                    ? "bg-neutral-900 text-white border-neutral-900"
                                                                    : "bg-neo-ink text-white border-neo-ink")
                                                            : (theme === "neo-brutal"
                                                                ? "bg-white text-neo-ink/65 border-neo-ink/20 hover:bg-neo-bg hover:text-neo-ink"
                                                                : "bg-black/5 text-black/30 border-black/5 hover:bg-black/10 hover:text-black/60")
                                                    )}
                                                >
                                                    {f === 'jpeg' ? 'JPG' : f}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="shrink-0 w-full sm:w-auto">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleDownloadAll}
                                            disabled={isBatchProcessing || files.length === 0}
                                            className={clsx(w.runPrimary, "w-full px-8 py-3.5 rounded-[20px] text-[11px] sm:text-xs")}
                                        >
                                            <Download className="w-3.5 h-3.5" /> Export
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Sidebar (Queue) */}
                        <div className={clsx(
                            "flex flex-col neo-sidebar border-0 overflow-hidden min-h-0",
                            showQueue ? "fixed inset-4 z-50 lg:relative lg:inset-auto" : "hidden lg:flex",
                            "lg:h-full"
                        )}>
                            <div className="p-5 shrink-0 flex items-center justify-between bg-black/5">
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
        </div >
    );
}
