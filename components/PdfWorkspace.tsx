"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText, X, Settings2, Loader2, FileType, List, ChevronDown } from 'lucide-react';
import DropZone from './DropZone';
import PremiumBackground from '@/components/PremiumBackground';
import { usePdf } from '@/app/pdf-compressor/PdfContext';
import clsx from 'clsx';
import { formatBytes } from '@/lib/compression';
import PremiumSlider from './PremiumSlider';
import { useTheme } from '@/components/theme/ThemeProvider';
import { workspaceChrome } from '@/lib/marketingChrome';

function useObjectUrl(blob: Blob | null) {
    const objectUrl = useMemo(() => {
        if (!blob) return null;
        return URL.createObjectURL(blob);
    }, [blob]);

    useEffect(() => {
        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [objectUrl]);

    return objectUrl;
}

export default function PdfWorkspace() {
    const { theme } = useTheme();
    const w = workspaceChrome(theme);
    const {
        file,
        setFile,
        compressedBlob,
        setCompressedBlob,
        quality,
        setQuality,
        isProcessing,
        progress,
        handleCompress,
        numPages,
        extractPage
    } = usePdf();

    const [showSidebar, setShowSidebar] = useState(false);
    const [showPageExtractor, setShowPageExtractor] = useState(false);
    const [lastPreviewQuality, setLastPreviewQuality] = useState<number | null>(null);
    const pdfUrl = useObjectUrl(file);
    const compressedPdfUrl = useObjectUrl(compressedBlob);

    const handleCompressWithPreview = useCallback(async () => {
        setLastPreviewQuality(quality);
        await handleCompress();
    }, [handleCompress, quality]);

    useEffect(() => {
        if (!file || isProcessing) return;
        // Avoid auto-running on initial load; only refresh an existing preview.
        if (lastPreviewQuality === null) return;
        if (lastPreviewQuality === quality) return;

        const timer = window.setTimeout(() => {
            void handleCompressWithPreview();
        }, 320);

        return () => window.clearTimeout(timer);
    }, [file, handleCompressWithPreview, isProcessing, lastPreviewQuality, quality]);

    const activePreviewUrl = compressedPdfUrl || pdfUrl;
    const downloadUrl = compressedPdfUrl;

    return (
        <div className="w-full h-full flex flex-col flex-1 min-h-0 relative">
            <PremiumBackground />
            <AnimatePresence mode="wait">
                {!file ? (
                    <motion.div
                        key="dropzone"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex-1 flex items-center justify-center p-4 relative"
                    >
                        <DropZone
                            onFileSelect={(files) => setFile(files[0])}
                            isProcessing={false}
                            accept={{ 'application/pdf': ['.pdf'] }}
                            text="Add your PDF"
                            subText="Drop PDF to compress"
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="workspace"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 flex flex-col lg:grid lg:grid-cols-[1fr_360px] gap-4 p-2 sm:p-4 md:p-6 min-h-0 md:h-full md:overflow-hidden max-w-[1500px] mx-auto w-full relative"
                    >
                        {/* LEFT COLUMN: Full PDF Preview */}
                        <div className="flex flex-col gap-4 min-h-0 flex-1 relative">
                            <div className="neo-shell-outer">
                                <div className="neo-shell-inner neo-shell-inner--white w-full h-full overflow-hidden relative flex-1">
                                    {/* Full-size PDF embed */}
                                    {activePreviewUrl ? (
                                        <embed
                                            src={`${activePreviewUrl}#toolbar=0&navpanes=0`}
                                            type="application/pdf"
                                            className="w-full h-full"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-black/5">
                                            <FileText className="w-20 h-20" strokeWidth={1} />
                                            <p className="text-[10px] font-bold uppercase tracking-tight">Loading Preview</p>
                                        </div>
                                    )}

                                    {/* PDF badge */}
                                    <div className={w.floatingBadge}>
                                        PDF
                                    </div>

                                    {compressedBlob && (
                                        <div className="absolute top-4 left-4 z-10 bg-emerald-500/10 text-emerald-600 px-3 py-1.5 rounded-full border border-emerald-500/20">
                                            <span className="text-[9px] font-bold uppercase tracking-tight">Compressed Preview</span>
                                        </div>
                                    )}
                                    {!isProcessing && file && lastPreviewQuality !== null && lastPreviewQuality !== quality && (
                                        <div className="absolute top-14 left-4 z-10 bg-zinc-900/75 text-white px-2.5 py-1 rounded-full border border-white/20">
                                            <span className="text-[8px] font-bold uppercase tracking-tight">Updating Preview...</span>
                                        </div>
                                    )}

                                    {/* Close button */}
                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => {
                                            setFile(null);
                                            setCompressedBlob(null);
                                        }}
                                        className="absolute top-4 right-4 z-10 bg-black/5 hover:bg-black/10 text-black/30 hover:text-black p-2.5 rounded-full transition-all border border-black/5"
                                    >
                                        <X className="w-5 h-5" />
                                    </motion.button>

                                    {/* Processing overlay */}
                                    {isProcessing && (
                                        <div className="neo-modal-overlay neo-modal-overlay--solid">
                                            <Loader2 className="w-12 h-12 animate-spin mb-4 text-black/20" />
                                            <p className="text-[11px] font-bold uppercase tracking-tight text-zinc-400 animate-pulse">Compressing PDF</p>
                                            {progress > 0 && (
                                                <div className="mt-4 w-32">
                                                    <div className="h-1 bg-zinc-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-zinc-600 rounded-full transition-all duration-300"
                                                            style={{ width: `${progress}%` }}
                                                        />
                                                    </div>
                                                    <p className="text-[9px] font-bold text-zinc-300 text-center mt-2 uppercase tracking-tight">{progress}%</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Floating Controls — above preview on mobile */}
                                    <div className="neo-dock max-w-[600px] p-3 sm:p-4 lg:hidden backdrop-blur-xl shadow-[0px_18px_36px_0px_rgba(0,0,0,0.16),0px_2px_8px_0px_rgba(0,0,0,0.08),inset_0px_1px_0px_0px_rgba(255,255,255,0.36)]">
                                        <div className="flex flex-col gap-3">
                                            {/* File info + density */}
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-[10px] font-bold text-zinc-800 uppercase tracking-tight truncate">{file.name}</p>
                                                    <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-tight mt-0.5">
                                                        {formatBytes(file.size)} · {numPages} {numPages === 1 ? 'pg' : 'pgs'} · {Math.round(quality * 100)}%
                                                    </p>
                                                </div>
                                                {compressedBlob && (
                                                    <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 px-2.5 py-1 rounded-full border border-emerald-500/20 shrink-0">
                                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                                        <span className="text-[8px] font-bold uppercase tracking-tight">Done</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action */}
                                            {!compressedBlob ? (
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={handleCompressWithPreview}
                                                    disabled={isProcessing}
                                                    className="w-full bg-zinc-700 text-white px-6 py-2.5 rounded-[16px] font-bold text-[10px] uppercase tracking-tight flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-[0px_16px_34px_0px_rgba(0,0,0,0.25),0px_2px_8px_0px_rgba(0,0,0,0.14),inset_0px_1px_0px_0px_rgba(255,255,255,0.22)] hover:shadow-[0px_20px_40px_0px_rgba(0,0,0,0.3),0px_2px_10px_0px_rgba(0,0,0,0.16),inset_0px_1px_0px_0px_rgba(255,255,255,0.28)] border border-white/10 disabled:opacity-30"
                                                >
                                                    <FileType className="w-3.5 h-3.5" /> Compress
                                                </motion.button>
                                            ) : (
                                                <motion.a
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    href={downloadUrl || undefined}
                                                    download={`compressed_${file.name}`}
                                                    className="w-full bg-zinc-700 text-white px-6 py-2.5 rounded-[16px] font-bold text-[10px] uppercase tracking-tight flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-[0px_16px_34px_0px_rgba(0,0,0,0.25),0px_2px_8px_0px_rgba(0,0,0,0.14),inset_0px_1px_0px_0px_rgba(255,255,255,0.22)] hover:shadow-[0px_20px_40px_0px_rgba(0,0,0,0.3),0px_2px_10px_0px_rgba(0,0,0,0.16),inset_0px_1px_0px_0px_rgba(255,255,255,0.28)] border border-white/10"
                                                >
                                                    <Download className="w-3.5 h-3.5" /> Download
                                                </motion.a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Sidebar */}
                        <div className={clsx(
                            "flex flex-col neo-sidebar overflow-hidden min-h-0",
                            showSidebar ? "fixed inset-4 z-50 lg:relative lg:inset-auto" : "hidden lg:flex",
                            "lg:h-full"
                        )}>
                            {/* Header */}
                            <div className="p-5 shrink-0 flex items-center justify-between border-b border-black/10 bg-black/5">
                                <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-tight">Document</h3>
                                <div className="flex items-center gap-2">
                                    <div className="text-[10px] font-bold text-zinc-400 bg-zinc-100 px-2.5 py-1 rounded-full uppercase tracking-tight">
                                        {numPages} {numPages === 1 ? 'pg' : 'pgs'}
                                    </div>
                                    <button onClick={() => setShowSidebar(false)} className="lg:hidden p-1.5 rounded-full hover:bg-black/10 transition-colors">
                                        <X className="w-4 h-4 text-zinc-500" />
                                    </button>
                                </div>
                            </div>

                            {/* Scrollable body */}
                            <div className="flex-1 overflow-y-auto min-h-0 px-5 py-5 space-y-5 custom-scrollbar">

                                {/* File Info Card */}
                                <div className="bg-zinc-100/50 rounded-2xl p-4 border border-zinc-200/50 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                                            <FileText className="w-5 h-5 text-red-500" strokeWidth={1.5} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[11px] font-bold text-zinc-800 uppercase tracking-tight truncate">{file.name}</p>
                                            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight mt-0.5">
                                                {formatBytes(file.size)} · {numPages} {numPages === 1 ? 'page' : 'pages'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Size comparison */}
                                    {compressedBlob && (
                                        <div className="flex items-center justify-between pt-2 border-t border-zinc-200/50">
                                            <div>
                                                <div className="text-[8px] font-bold text-zinc-400 uppercase tracking-tight">Original</div>
                                                <div className="text-[12px] font-bold text-zinc-500">{formatBytes(file.size)}</div>
                                            </div>
                                            <div className="text-[10px] font-bold text-zinc-300">→</div>
                                            <div className="text-right">
                                                <div className="text-[8px] font-bold text-emerald-500 uppercase tracking-tight">Compressed</div>
                                                <div className="text-[12px] font-bold text-emerald-600">{formatBytes(compressedBlob.size)}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Density Control */}
                                <div className="space-y-3">
                                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Compression</div>
                                    <PremiumSlider
                                        label="Density"
                                        value={quality}
                                        min={0.1}
                                        max={1}
                                        step={0.1}
                                        labelTransform={(v) => `${Math.round(v * 100)}%`}
                                        icon={<Settings2 className="w-3" />}
                                        onChange={(v) => setQuality(v)}
                                        labelColor="text-zinc-400"
                                        valueColor="text-zinc-800"
                                    />
                                    <div className="flex items-center justify-between text-[8px] font-bold text-zinc-300 uppercase tracking-tight px-0.5">
                                        <span>Max Compression</span>
                                        <span>Original Quality</span>
                                    </div>

                                    {/* Estimated size */}
                                    <div className="bg-zinc-50 rounded-xl p-3 flex items-center justify-between border border-zinc-100">
                                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight">Est. Size</span>
                                        <span className="text-sm font-bold text-zinc-800">{formatBytes(file.size * quality)}</span>
                                    </div>
                                </div>

                                {/* Page Extractor */}
                                {numPages > 1 && (
                                    <div className="space-y-3">
                                        <button
                                            onClick={() => setShowPageExtractor(!showPageExtractor)}
                                            className="flex items-center justify-between w-full"
                                        >
                                            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Page Extractor</div>
                                            <ChevronDown className={clsx(
                                                "w-3.5 h-3.5 text-zinc-400 transition-transform",
                                                showPageExtractor && "rotate-180"
                                            )} />
                                        </button>

                                        <AnimatePresence>
                                            {showPageExtractor && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="grid grid-cols-5 gap-2 pb-1">
                                                        {Array.from({ length: Math.min(numPages, 20) }).map((_, i) => (
                                                            <motion.button
                                                                key={i}
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={() => extractPage(i)}
                                                                className="aspect-square flex items-center justify-center rounded-xl bg-white border border-zinc-200/80 hover:border-zinc-400 hover:bg-zinc-50 transition-all text-[11px] font-bold text-zinc-600 shadow-sm"
                                                                title={`Extract Page ${i + 1}`}
                                                            >
                                                                {i + 1}
                                                            </motion.button>
                                                        ))}
                                                        {numPages > 20 && (
                                                            <div className="aspect-square flex items-center justify-center rounded-xl bg-zinc-50 text-[9px] font-bold text-zinc-300 border border-zinc-100">
                                                                +{numPages - 20}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="text-[8px] font-bold text-zinc-300 uppercase tracking-tight mt-2">
                                                        Click a page number to extract it as a separate PDF
                                                    </p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}

                                {/* Success state */}
                                {compressedBlob && (
                                    <div className="flex items-center gap-3 bg-emerald-50 text-emerald-600 px-4 py-3 rounded-xl border border-emerald-200/50">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                        <div>
                                            <span className="text-[10px] font-bold uppercase tracking-tight block">Optimization Complete</span>
                                            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-tight">
                                                Saved {formatBytes(file.size - compressedBlob.size)} ({Math.round(((file.size - compressedBlob.size) / file.size) * 100)}%)
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer: Action button */}
                            <div className="p-5 pt-3 border-t border-black/5 bg-black/5">
                                {!compressedBlob ? (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleCompressWithPreview}
                                        disabled={isProcessing}
                                        className="w-full bg-zinc-700 text-white px-8 py-4 rounded-[20px] font-bold text-[11px] uppercase tracking-tight flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-[0px_16px_34px_0px_rgba(0,0,0,0.25),0px_2px_8px_0px_rgba(0,0,0,0.14),inset_0px_1px_0px_0px_rgba(255,255,255,0.22)] hover:shadow-[0px_20px_40px_0px_rgba(0,0,0,0.3),0px_2px_10px_0px_rgba(0,0,0,0.16),inset_0px_1px_0px_0px_rgba(255,255,255,0.28)] border border-white/10 disabled:opacity-30"
                                    >
                                        {isProcessing ? (
                                            <><Loader2 className="w-4 h-4 animate-spin" /> Compressing</>
                                        ) : (
                                            <><FileType className="w-4 h-4" /> Compress PDF</>
                                        )}
                                    </motion.button>
                                ) : (
                                    <motion.a
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        href={downloadUrl || undefined}
                                        download={`compressed_${file.name}`}
                                        className="w-full bg-zinc-700 text-white px-8 py-4 rounded-[20px] font-bold text-[11px] uppercase tracking-tight flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-[0px_16px_34px_0px_rgba(0,0,0,0.25),0px_2px_8px_0px_rgba(0,0,0,0.14),inset_0px_1px_0px_0px_rgba(255,255,255,0.22)] hover:shadow-[0px_20px_40px_0px_rgba(0,0,0,0.3),0px_2px_10px_0px_rgba(0,0,0,0.16),inset_0px_1px_0px_0px_rgba(255,255,255,0.28)] border border-white/10"
                                    >
                                        <Download className="w-4 h-4" /> Download PDF
                                    </motion.a>
                                )}
                                <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-tight text-center mt-3">
                                    100% client-side · No uploads
                                </p>
                            </div>
                        </div>

                        {/* Mobile Sidebar Button */}
                        <button
                            onClick={() => setShowSidebar(true)}
                            className="fixed safe-fab z-40 lg:hidden w-12 h-12 min-w-12 min-h-12 bg-zinc-700 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-zinc-800 active:scale-95 transition-all border border-white/10 touch-manipulation"
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
