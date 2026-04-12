"use client";

import React, { useState, useCallback } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import { Download, ZoomIn, RotateCcw, X, Circle, Loader2 } from 'lucide-react';
import { getCroppedImg } from '@/lib/canvasUtils';
import { motion, AnimatePresence } from 'framer-motion';
import DropZone from './DropZone';
import PremiumBackground from '@/components/PremiumBackground';
import { useCircle } from '@/app/circle-crop/CircleContext';

import PremiumSlider from './PremiumSlider';

export default function CircleCropWorkspace() {
    const {
        originalImage,
        setOriginalImage,
        setCroppedImage,
        isProcessing,
        setIsProcessing
    } = useCircle();

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [rotation, setRotation] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [borderWidth, setBorderWidth] = useState(0);
    const [borderColor, setBorderColor] = useState('#ffffff');

    const onCropComplete = useCallback((_croppedArea: Area, pixels: Area) => {
        setCroppedAreaPixels(pixels);
    }, []);

    const handleFileSelect = useCallback(async (files: File[]) => {
        if (files && files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = () => {
                setOriginalImage(reader.result as string);
                setCroppedImage(null);
            };
            reader.readAsDataURL(file);
        }
    }, [setOriginalImage, setCroppedImage]);

    const handleDownload = useCallback(async () => {
        try {
            if (!originalImage || !croppedAreaPixels) return;
            setIsProcessing(true);
            const croppedImageBlob = await getCroppedImg(
                originalImage,
                croppedAreaPixels,
                rotation,
                undefined,
                { width: borderWidth, color: borderColor }
            );

            if (croppedImageBlob) {
                const url = URL.createObjectURL(croppedImageBlob);
                const link = document.createElement('a');
                link.download = `circle-crop-${Date.now()}.png`;
                link.href = url;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    }, [originalImage, croppedAreaPixels, rotation, borderWidth, borderColor, setIsProcessing]);

    return (
        <div className="w-full h-full flex flex-col flex-1 min-h-0 relative">
            <PremiumBackground />
            <AnimatePresence mode="wait">
                {!originalImage ? (
                    <motion.div
                        key="dropzone"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex-1 flex items-center justify-center p-4 relative"
                    >
                        <DropZone
                            onFileSelect={handleFileSelect}
                            isProcessing={false}
                            accept={{ 'image/*': [] }}
                            text="Add your image"
                            subText="Drop image here to crop"
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="workspace"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 flex flex-col p-2 sm:p-4 md:p-6 min-h-0 h-full overflow-hidden max-w-[1500px] mx-auto w-full"
                    >
                        {/* Cropper Container */}
                        <div className="flex-1 min-h-0 bg-[#D9D9D9]/20 backdrop-blur-[40px] rounded-[32px] sm:rounded-[40px] border border-black/10 p-2 sm:p-4 relative flex flex-col overflow-hidden">
                            <div className="w-full h-full bg-[#D9D9D9] rounded-[24px] sm:rounded-[32px] overflow-hidden relative flex-1 border border-black/5 shadow-inner">
                                <Cropper
                                    image={originalImage}
                                    crop={crop}
                                    rotation={rotation}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onRotationChange={setRotation}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                    cropShape="round"
                                    showGrid={false}
                                    classes={{
                                        containerClassName: 'bg-[#D9D9D9]',
                                        cropAreaClassName: `shadow-[0_0_0_9999px_rgba(217,217,217,0.7)]`
                                    }}
                                    style={{
                                        cropAreaStyle: {
                                            border: `${borderWidth}px solid ${borderColor}`,
                                            transition: 'border 0.1s ease'
                                        }
                                    }}
                                />

                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setOriginalImage(null)}
                                    className="absolute top-4 right-4 z-10 bg-black/5 hover:bg-black/10 text-black/30 hover:text-black p-2.5 rounded-full transition-all border border-black/5"
                                >
                                    <X className="w-5 h-5" />
                                </motion.button>

                                {isProcessing && (
                                    <div className="absolute inset-0 bg-[#D9D9D9]/80 backdrop-blur-3xl flex flex-col items-center justify-center text-black z-20">
                                        <Loader2 className="w-12 h-12 animate-spin mb-4 text-black/20" />
                                        <p className="text-[11px] font-bold uppercase tracking-tight text-zinc-400 animate-pulse">Rendering</p>
                                    </div>
                                )}
                            </div>

                            {/* Compact Floating Controls - Liquid Glass */}
                            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-[840px] bg-white/60 backdrop-blur-xl rounded-[28px] sm:rounded-[36px] border border-white/40 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.1)] p-3 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-10 z-20">

                                {/* Sliders Group */}
                                <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <PremiumSlider
                                        label="Zoom"
                                        value={zoom}
                                        min={1}
                                        max={3}
                                        step={0.1}
                                        unit="x"
                                        icon={<ZoomIn className="w-3" />}
                                        onChange={(v) => setZoom(v)}
                                        labelColor="text-zinc-500"
                                        valueColor="text-zinc-800"
                                    />
                                    <PremiumSlider
                                        label="Rotate"
                                        value={rotation}
                                        min={0}
                                        max={360}
                                        unit="°"
                                        icon={<RotateCcw className="w-3" />}
                                        onChange={(v) => setRotation(v)}
                                        labelColor="text-zinc-500"
                                        valueColor="text-zinc-800"
                                    />
                                    <PremiumSlider
                                        label="Border"
                                        value={borderWidth}
                                        min={0}
                                        max={50}
                                        unit="px"
                                        icon={<Circle className="w-3" />}
                                        onChange={(v) => setBorderWidth(v)}
                                        labelColor="text-zinc-500"
                                        valueColor="text-zinc-800"
                                    />
                                </div>

                                {/* Actions Group */}
                                <div className="shrink-0 flex items-center gap-4 w-full sm:w-auto">
                                    <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-black/10 shrink-0 group/color bg-black/5">
                                        <input
                                            type="color"
                                            value={borderColor}
                                            onChange={(e) => setBorderColor(e.target.value)}
                                            className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer p-0 m-0 border-0 opacity-0 group-hover/color:opacity-100 transition-opacity"
                                        />
                                        <div
                                            className="w-full h-full pointer-events-none"
                                            style={{ backgroundColor: borderColor }}
                                        />
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleDownload}
                                        disabled={isProcessing}
                                        className="flex-1 sm:flex-none bg-zinc-700 text-white px-8 py-3.5 rounded-[20px] font-bold text-[11px] sm:text-xs uppercase tracking-tight flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-xl border border-white/10 disabled:opacity-30"
                                    >
                                        <Download className="w-3.5 h-3.5" /> Download
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
