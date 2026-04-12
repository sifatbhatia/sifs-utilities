"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Sparkles, List, Layers, Zap } from 'lucide-react';
import DropZone from './DropZone';
import PremiumBackground from '@/components/PremiumBackground';
import { useGrain } from '@/app/grain-pix/GrainContext';
import BatchQueue from './BatchQueue';
import PremiumSlider from './PremiumSlider';
import clsx from 'clsx';

// WebGPU renderer removed

export default function GrainPixWorkspace() {
    const {
        files,
        setFiles,
        isBatchProcessing,
        settings,
        setSettings,
        handleDownloadAll,
        handleFilesSelect,
        activeFileId
    } = useGrain();

    const [showQueue, setShowQueue] = React.useState(false);

    const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Active file logic
    const activeFile = activeFileId ? files.find(f => f.id === activeFileId) : (files.length > 0 ? files[0] : null);

    // Load active file image
    useEffect(() => {
        if (!activeFile) return;

        const img = new Image();
        const url = URL.createObjectURL(activeFile.file);
        img.onload = () => {
            setOriginalImage(img);
            URL.revokeObjectURL(url);
        };
        img.src = url;
    }, [activeFile]);

    // Draw Grain (Preview Loop)
    useEffect(() => {
        if (!activeFile || !originalImage || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        // Use a reasonable preview size for performance
        const maxDisplaySize = 1200;
        let dWidth = originalImage.width;
        let dHeight = originalImage.height;

        if (dWidth > maxDisplaySize || dHeight > maxDisplaySize) {
            const ratio = Math.min(maxDisplaySize / dWidth, maxDisplaySize / dHeight);
            dWidth *= ratio;
            dHeight *= ratio;
        }

        canvas.width = dWidth;
        canvas.height = dHeight;

        // Draw scaled original
        ctx.drawImage(originalImage, 0, 0, dWidth, dHeight);

        // Apply Grain effect
        if (settings.amount > 0) {
            const imageData = ctx.getImageData(0, 0, dWidth, dHeight);
            const data = imageData.data;
            const amount = settings.amount;
            const roughness = settings.roughness / 100;

            if (settings.mode === 'manual') {
                for (let i = 0; i < data.length; i += 4) {
                    if (Math.random() < roughness) {
                        const noise = (Math.random() - 0.5) * amount * 2.55;
                        data[i] = Math.max(0, Math.min(255, data[i] + noise));
                        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
                        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
                    }
                }
            } else {
                // Lumegrain Match
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    const luma = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
                    const lumaFactor = 1.0 - Math.pow((luma - 0.5) * 2, 2);
                    const effectiveStrength = lumaFactor * roughness + (1 - lumaFactor) * (roughness * 0.2);
                    const noise = (Math.random() - 0.5) * amount * 2.55 * effectiveStrength;

                    data[i] = Math.max(0, Math.min(255, r + noise));
                    data[i + 1] = Math.max(0, Math.min(255, g + noise));
                    data[i + 2] = Math.max(0, Math.min(255, b + noise));
                }
            }
            ctx.putImageData(imageData, 0, 0);
        }

        // Size / Blur
        if (settings.size > 1) {
            ctx.filter = `blur(${(settings.size - 1) * 0.5}px)`;
            ctx.drawImage(canvas, 0, 0);
            ctx.filter = 'none';
        }
    }, [activeFile, originalImage, settings]);

    return (
        <div className="w-full h-full flex flex-col flex-1 min-h-0 relative text-[#1d1d1f]">
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
                            accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }}
                            text="Add your image"
                            subText="Drop image to add grain"
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="workspace"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 flex flex-col lg:grid lg:grid-cols-[1fr_340px] gap-4 p-2 sm:p-4 md:p-6 min-h-0 h-full overflow-hidden max-w-[1500px] mx-auto w-full relative"
                    >
                        {/* LEFT COLUMN: Preview + Controls */}
                        <div className="flex flex-col gap-4 min-h-0 flex-1 relative">
                            {/* Main Preview Container */}
                            <div className="neo-shell-outer">
                                <div className="neo-shell-inner w-full h-full overflow-hidden relative flex-1 flex items-center justify-center group/main">
                                    <canvas
                                        ref={canvasRef}
                                        className="max-w-full max-h-full object-contain shadow-2xl transition-transform duration-500 group-hover/main:scale-[1.01]"
                                    />

                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setFiles([])}
                                        className="absolute top-4 right-4 z-10 bg-black/5 hover:bg-black/10 text-black/30 hover:text-black p-2.5 rounded-full transition-all border border-black/5"
                                    >
                                        <X className="w-5 h-5" />
                                    </motion.button>

                                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                                        <div className="flex items-center gap-2 border-[2px] border-neo-ink bg-white px-3 py-1.5 shadow-[2px_2px_0_0_#0a0a0a]">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse shadow-[0_0_8px_rgba(22,163,74,0.4)]" />
                                            <span className="text-[10px] font-bold uppercase tracking-tight text-zinc-500">Live Engine</span>
                                        </div>
                                    </div>

                                    {/* Compact Floating Controls - Liquid Glass */}
                                    <div className="neo-dock max-w-[840px] p-3 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                                        {/* Mode Toggle - Compact */}
                                        <div className="flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-center shrink-0 w-full sm:w-auto">
                                            <div className="text-[8px] sm:text-[9px] font-bold text-zinc-400 uppercase tracking-tight mb-0 sm:mb-2 ml-1">Effect</div>
                                            <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200">
                                                {['manual', 'lumegrain'].map((m) => (
                                                    <motion.button
                                                        key={m}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() =>
                                                            setSettings((prev) => ({
                                                                ...prev,
                                                                mode: m as "manual" | "lumegrain",
                                                            }))
                                                        }
                                                        className={clsx(
                                                            "px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-tight transition-all",
                                                            settings.mode === m
                                                                ? "bg-zinc-800 text-white shadow-lg"
                                                                : "text-zinc-600 hover:text-zinc-800"
                                                        )}
                                                    >
                                                        {m === 'lumegrain' ? 'Lume' : 'Man'}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Parameters Grid - Compact */}
                                        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                                            <PremiumSlider
                                                label="Intensity"
                                                value={settings.amount}
                                                min={0}
                                                max={100}
                                                unit="%"
                                                icon={<Zap className="w-3" />}
                                                onChange={(v) => setSettings(prev => ({ ...prev, amount: v }))}
                                                labelColor="text-zinc-500"
                                                valueColor="text-zinc-800"
                                            />
                                            <PremiumSlider
                                                label="Roughness"
                                                value={settings.roughness}
                                                min={0}
                                                max={100}
                                                unit="%"
                                                icon={<Layers className="w-3" />}
                                                onChange={(v) => setSettings(prev => ({ ...prev, roughness: v }))}
                                                labelColor="text-zinc-500"
                                                valueColor="text-zinc-800"
                                            />
                                            <PremiumSlider
                                                label="Size"
                                                value={settings.size}
                                                min={1}
                                                max={5}
                                                step={0.1}
                                                unit="px"
                                                icon={<Sparkles className="w-3" />}
                                                onChange={(v) => setSettings(prev => ({ ...prev, size: v }))}
                                                labelColor="text-zinc-500"
                                                valueColor="text-zinc-800"
                                            />
                                        </div>

                                        {/* Action - Compact */}
                                        <div className="shrink-0 w-full sm:w-auto">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleDownloadAll}
                                                disabled={isBatchProcessing || files.length === 0}
                                                className="w-full bg-zinc-700 text-white px-8 py-3.5 rounded-[20px] font-bold text-[11px] sm:text-xs uppercase tracking-tight flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-xl border border-white/10 disabled:opacity-30"
                                            >
                                                <Download className="w-3.5 h-3.5" /> Export
                                            </motion.button>
                                        </div>
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
                                <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-tight">Queue</h3>
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
                                    isProcessing={isBatchProcessing}
                                />
                            </div>
                        </div>

                        {/* Mobile Queue Button */}
                        <button
                            onClick={() => setShowQueue(true)}
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
