"use client";

import React from 'react';
import { Download, X, Settings2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ControlPanelProps {
    quality: number;
    setQuality: (q: number) => void;
    format: string;
    setFormat: (f: string) => void;
    onDownload: () => void;
    onReset: () => void;
    isProcessing: boolean;
    compressedSize: string;
    sizeReduction: string;
}

const FORMATS = ['webp', 'jpeg', 'png', 'avif'];

export default function ControlPanel({
    quality,
    setQuality,
    format,
    setFormat,
    onDownload,
    onReset,
    isProcessing,
    compressedSize,
    sizeReduction
}: ControlPanelProps) {
    return (
        <div className="w-full max-w-[1400px] mx-auto bg-white/50 backdrop-blur-md border border-white/20 rounded-[24px] sm:rounded-[40px] shadow-sm p-4 sm:p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 md:gap-8">

                {/* Left: Stats */}
                <div className="flex flex-row md:flex-col items-center md:items-start justify-center gap-4 md:gap-1 min-w-0 md:min-w-[140px]">
                    <div className="flex flex-col items-center md:items-start">
                        <span className="text-[10px] sm:text-xs font-semibold text-primary/40 uppercase tracking-widest leading-none mb-1">New Size</span>
                        <span className="text-xl sm:text-2xl md:text-3xl font-bold text-primary leading-none">
                            {compressedSize}
                        </span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full whitespace-nowrap">
                        {sizeReduction} smaller
                    </span>
                </div>

                {/* Center: Controls */}
                <div className="flex-1 w-full space-y-4 sm:space-y-6">
                    {/* Quality Slider */}
                    <div className="space-y-2 sm:space-y-3">
                        <div className="flex justify-between text-xs sm:text-sm font-semibold text-primary/70">
                            <span className="flex items-center gap-2"><Settings2 size={14} /> Quality</span>
                            <span>{quality}%</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="100"
                            value={quality}
                            onChange={(e) => setQuality(Number(e.target.value))}
                            className="w-full h-1.5 sm:h-2 bg-primary/10 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-all"
                        />
                    </div>

                    {/* Format Selection */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2">
                        {FORMATS.map((fmt) => (
                            <button
                                key={fmt}
                                onClick={() => setFormat(fmt)}
                                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-sm font-bold tracking-tight transition-all duration-200 border ${format === fmt
                                    ? 'bg-primary text-white border-primary shadow-sm'
                                    : 'bg-white/40 text-primary/60 border-primary/10 hover:border-primary/40 hover:text-primary'
                                    }`}
                            >
                                {fmt.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-row md:flex-col gap-2 sm:gap-3 w-full md:w-auto md:min-w-[160px]">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onDownload}
                        disabled={isProcessing}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 py-2.5 sm:py-3.5 px-4 sm:px-6 bg-primary text-white rounded-lg sm:rounded-xl shadow-lg shadow-primary/20 font-bold text-sm sm:text-base transition-all hover:bg-primary/90 disabled:opacity-50"
                    >
                        <Download size={18} className="hidden sm:block" />
                        Download
                    </motion.button>

                    <button
                        onClick={onReset}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 py-2.5 px-4 sm:px-6 text-primary/40 hover:text-destructive hover:bg-destructive/5 rounded-lg sm:rounded-xl transition-colors text-[10px] sm:text-sm font-bold"
                    >
                        <X size={16} className="hidden sm:block" />
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
}
