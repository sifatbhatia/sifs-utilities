"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, LayoutGrid, X, Layers, Image as ImageIcon, Loader2, Palette, Settings2, Maximize, Smartphone, Info, List } from 'lucide-react';
import DropZone from './DropZone';
import PremiumBackground from '@/components/PremiumBackground';
import JSZip from 'jszip';
import PremiumSlider from './PremiumSlider';
import clsx from 'clsx';

export default function IconSetWorkspace() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [scale, setScale] = useState(0.8);
    const [bgColor, setBgColor] = useState('#ffffff');
    const [shape, setShape] = useState<'squircle' | 'circle' | 'square'>('squircle');
    const [showSidebar, setShowSidebar] = useState(false);

    // Icon sizes config
    const sizes = [
        { width: 1024, height: 1024, name: 'App Store', sub: '1024x1024', category: 'store', displayScale: 1.0 },
        { width: 512, height: 512, name: 'Web PWA', sub: '512x512', category: 'web', displayScale: 0.85 },
        { width: 192, height: 192, name: 'Android', sub: '192x192', category: 'android', displayScale: 0.7 },
        { width: 180, height: 180, name: 'iOS App', sub: '180x180', category: 'ios', displayScale: 0.65 },
        { width: 152, height: 152, name: 'iOS iPad', sub: '152x152', category: 'ios', displayScale: 0.6 },
        { width: 120, height: 120, name: 'iOS Shared', sub: '120x120', category: 'ios', displayScale: 0.55 },
        { width: 80, height: 80, name: 'Spotlight', sub: '80x80', category: 'ios', displayScale: 0.5 },
        { width: 32, height: 32, name: 'Favicon', sub: '32x32', category: 'web', displayScale: 0.4 },
    ];

    const generateIcons = async () => {
        if (!file) return;
        setIsProcessing(true);

        try {
            const zip = new JSZip();
            const img = new Image();
            img.src = URL.createObjectURL(file);

            await new Promise((resolve) => { img.onload = resolve; });

            for (const size of sizes) {
                const canvas = document.createElement('canvas');
                canvas.width = size.width;
                canvas.height = size.height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';

                    // Draw Background
                    ctx.fillStyle = bgColor;
                    ctx.fillRect(0, 0, size.width, size.height);

                    // Calculate Dimensions with Scale
                    const drawWidth = size.width * scale;
                    const drawHeight = size.height * scale;

                    // Support non-square logos? Maintain ratio
                    const imgRatio = img.width / img.height;
                    let finalWidth = drawWidth;
                    let finalHeight = drawHeight;

                    if (imgRatio > 1) {
                        finalHeight = drawWidth / imgRatio;
                    } else {
                        finalWidth = drawHeight * imgRatio;
                    }

                    const x = (size.width - finalWidth) / 2;
                    const y = (size.height - finalHeight) / 2;

                    ctx.drawImage(img, x, y, finalWidth, finalHeight);

                    const blob = await new Promise<Blob | null>(resolve =>
                        canvas.toBlob(resolve, 'image/png')
                    );

                    if (blob) {
                        zip.file(`icon-${size.width}x${size.height}.png`, blob);
                    }
                }
            }

            const content = await zip.generateAsync({ type: "blob" });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = `IconSet_${file.name.split('.')[0]}.zip`;
            link.click();

        } catch (error) {
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

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
                        transition={{ duration: 0.3 }}
                        className="flex-1 flex items-center justify-center p-4 relative"
                    >
                        <DropZone
                            onFileSelect={(files) => setFile(files[0])}
                            isProcessing={false}
                            accept={{ 'image/*': ['.png', '.jpg', '.svg'] }}
                            text="Add your logo"
                            subText="Drop logo to generate icons"
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="workspace"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 flex flex-col lg:grid lg:grid-cols-[1fr_360px] gap-4 p-2 sm:p-4 md:p-6 min-h-0 h-full overflow-hidden max-w-[1500px] mx-auto w-full relative"
                    >
                        {/* LEFT: Preview Grid */}
                        <div className="flex flex-col gap-4 min-h-0 flex-1 relative h-full">
                            <div className="neo-shell-outer">
                                <div className="neo-shell-inner w-full h-full overflow-hidden relative flex-1 p-6 sm:p-8 overflow-y-auto custom-scrollbar">
                                    <div className="flex flex-wrap items-end justify-center gap-6 sm:gap-10 pb-24 lg:pb-0">
                                        {sizes.map((size) => (
                                            <div
                                                key={`${size.name}-${size.width}`}
                                                className="flex flex-col items-center gap-4 group"
                                                style={{ width: `${140 * size.displayScale}px` }}
                                            >
                                                <div
                                                    className={clsx(
                                                        "relative aspect-square w-full shadow-2xl flex items-center justify-center border border-black/10 group-hover:scale-105 transition-all duration-500 overflow-hidden",
                                                        shape === 'squircle' ? "rounded-[32%]" :
                                                            shape === 'circle' ? "rounded-full" : "rounded-none"
                                                    )}
                                                    style={{ backgroundColor: bgColor }}
                                                >
                                                    <div
                                                        className="w-full h-full flex items-center justify-center transition-all duration-300 pointer-events-none"
                                                        style={{ transform: `scale(${scale})` }}
                                                    >
                                                        <img
                                                            src={URL.createObjectURL(file)}
                                                            alt={size.name}
                                                            className="w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
                                                        />
                                                    </div>

                                                    {/* Size Badge */}
                                                    <div className="absolute bottom-0 inset-x-0 border-t-[3px] border-neo-ink bg-neo-ink py-1 text-[10px] font-bold uppercase tracking-wide text-white translate-y-full transition-transform group-hover:translate-y-0">
                                                        <p className="text-[7px] sm:text-[9px] font-bold text-white text-center uppercase tracking-widest">{size.width}px</p>
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-[10px] font-bold text-zinc-800 uppercase tracking-tight">{size.name}</p>
                                                    <p className="text-[8px] font-bold font-mono text-zinc-400 uppercase tracking-tight mt-0.5">{size.width}x{size.height}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setFile(null)}
                                        className="absolute top-4 right-4 z-10 bg-black/5 hover:bg-black/10 text-black/30 hover:text-black p-2.5 rounded-full transition-all border border-black/5"
                                    >
                                        <X className="w-5 h-5" />
                                    </motion.button>
                                </div>

                                {/* Floating Action Bar - Mobile Optimized Controls */}
                                <div className="neo-dock max-w-[600px] p-3 sm:p-4 lg:hidden flex flex-col gap-3">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <PremiumSlider
                                                label="Zoom"
                                                value={scale}
                                                min={0.1}
                                                max={1.5}
                                                step={0.01}
                                                labelTransform={(v) => `${Math.round(v * 100)}%`}
                                                icon={<Maximize className="w-3 h-3" />}
                                                onChange={setScale}
                                                labelColor="text-zinc-500"
                                                valueColor="text-zinc-800"
                                            />
                                        </div>
                                        <div className="relative w-10 h-10 rounded-xl border border-black/10 shrink-0 group overflow-hidden">
                                            <input
                                                type="color"
                                                value={bgColor}
                                                onChange={(e) => setBgColor(e.target.value)}
                                                className="absolute inset-x-0 w-full h-full cursor-pointer p-0 m-0 border-0 opacity-0"
                                            />
                                            <div className="w-full h-full pointer-events-none" style={{ backgroundColor: bgColor }} />
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={generateIcons}
                                        disabled={isProcessing}
                                        className="w-full bg-zinc-700 text-white px-6 py-3.5 rounded-[16px] font-bold text-[10px] uppercase tracking-tight flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-xl border border-white/10 disabled:opacity-30"
                                    >
                                        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
                                        {isProcessing ? 'Generating' : 'Generate Bundle'}
                                    </motion.button>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Sidebar (Desktop + Mobile Overlay) */}
                        <div className={clsx(
                            "flex flex-col neo-sidebar overflow-hidden min-h-0 transition-transform duration-300",
                            showSidebar ? "fixed inset-4 z-50 lg:relative lg:inset-auto translate-y-0" : "hidden lg:flex",
                            "lg:h-full"
                        )}>
                            <div className="p-5 shrink-0 flex items-center justify-between border-b border-black/10 bg-black/5">
                                <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-tight">Generator</h3>
                                <div className="flex items-center gap-2">
                                    <div className="text-[10px] font-bold text-zinc-400 bg-zinc-100 px-2.5 py-1 rounded-full uppercase tracking-tight">
                                        {sizes.length} Sizes
                                    </div>
                                    <button onClick={() => setShowSidebar(false)} className="lg:hidden p-1.5 rounded-full hover:bg-black/10 transition-colors">
                                        <X className="w-4 h-4 text-zinc-500" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto min-h-0 px-6 py-6 space-y-8 custom-scrollbar">

                                {/* Appearance */}
                                <div className="space-y-6">
                                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight flex items-center gap-2">
                                        <Palette className="w-3 h-3" /> Appearance
                                    </div>

                                    <div className="space-y-5">
                                        {/* Bg Color */}
                                        <div className="flex items-center justify-between bg-white/50 p-3 rounded-2xl border border-white/50 shadow-sm">
                                            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-tight">Background</span>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="text"
                                                    value={bgColor.toUpperCase()}
                                                    onChange={(e) => setBgColor(e.target.value)}
                                                    className="w-16 bg-transparent text-[10px] font-mono font-bold text-zinc-800 uppercase focus:outline-none text-right"
                                                />
                                                <div className="relative w-8 h-8 rounded-full border border-black/10 shrink-0 group overflow-hidden">
                                                    <input
                                                        type="color"
                                                        value={bgColor}
                                                        onChange={(e) => setBgColor(e.target.value)}
                                                        className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer p-0 m-0 border-0 opacity-0 bg-white"
                                                    />
                                                    <div className="w-full h-full pointer-events-none" style={{ backgroundColor: bgColor }} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Zoom Slider */}
                                        <PremiumSlider
                                            label="Zoom"
                                            value={scale}
                                            min={0.1}
                                            max={1.5}
                                            step={0.01}
                                            labelTransform={(v) => `${Math.round(v * 100)}%`}
                                            icon={<Maximize className="w-3 h-3" />}
                                            onChange={setScale}
                                            labelColor="text-zinc-500"
                                            valueColor="text-zinc-800"
                                        />

                                        {/* Shape Selector */}
                                        <div className="space-y-3">
                                            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight flex items-center gap-2">
                                                <Smartphone className="w-3 h-3" /> Preview Shape
                                            </div>
                                            <div className="grid grid-cols-3 gap-2">
                                                {(['squircle', 'circle', 'square'] as const).map((s) => (
                                                    <button
                                                        key={s}
                                                        onClick={() => setShape(s)}
                                                        className={clsx(
                                                            "py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-tight transition-all border",
                                                            shape === s
                                                                ? "bg-zinc-800 text-white border-zinc-800 shadow-md"
                                                                : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300"
                                                        )}
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Export Info */}
                                <div className="space-y-4">
                                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight flex items-center gap-2">
                                        <Info className="w-3 h-3" /> Technical Specs
                                    </div>
                                    <div className="bg-zinc-100/50 rounded-2xl p-4 border border-zinc-200/50 space-y-3">
                                        <div className="flex justify-between items-center text-[11px] font-bold">
                                            <span className="text-zinc-500 uppercase tracking-tight">Format</span>
                                            <span className="text-zinc-800 font-mono">32-bit PNG</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[11px] font-bold">
                                            <span className="text-zinc-500 uppercase tracking-tight">Interpolation</span>
                                            <span className="text-zinc-800 font-mono">Bicubic</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[11px] font-bold">
                                            <span className="text-zinc-500 uppercase tracking-tight">Metadata</span>
                                            <span className="text-zinc-800 font-mono">Stripped</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Footer */}
                            <div className="p-6 pt-2 border-t border-black/5 bg-black/5">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={generateIcons}
                                    disabled={isProcessing}
                                    className="w-full bg-zinc-700 text-white px-8 py-4 rounded-[20px] font-bold text-[11px] uppercase tracking-tight flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-xl border border-white/10 disabled:opacity-30"
                                >
                                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin text-white/50" /> : <Layers className="w-4 h-4" />}
                                    {isProcessing ? 'Creating Bundle' : 'Generate & Download'}
                                </motion.button>
                                <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-tight text-center mt-4">
                                    Safe, Local Generation
                                </p>
                            </div>
                        </div>

                        {/* Mobile Sidebar Toggle */}
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
