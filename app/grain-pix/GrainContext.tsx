"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { BatchFile } from '@/components/BatchQueue';
import JSZip from 'jszip';
import { downloadBlob } from '@/lib/download';

interface GrainSettings {
    amount: number;
    size: number;
    roughness: number;
    mode: 'manual' | 'lumegrain';
}

interface GrainContextType {
    files: BatchFile[];
    setFiles: React.Dispatch<React.SetStateAction<BatchFile[]>>;
    isBatchProcessing: boolean;
    settings: GrainSettings;
    setSettings: React.Dispatch<React.SetStateAction<GrainSettings>>;
    handleDownloadAll: () => Promise<void>;
    handleRemoveFile: (id: string) => void;
    handleFilesSelect: (newFiles: File[]) => void;
    // For single/active view
    activeFileId: string | null;
    setActiveFileId: (id: string | null) => void;
}

const GrainContext = createContext<GrainContextType | undefined>(undefined);

export function GrainProvider({ children }: { children: React.ReactNode }) {
    const [files, setFiles] = useState<BatchFile[]>([]);
    const [isBatchProcessing, setIsBatchProcessing] = useState(false);
    const [settings, setSettings] = useState<GrainSettings>({
        amount: 20,
        size: 1.0,
        roughness: 1.0,
        mode: 'lumegrain'
    });
    const [activeFileId, setActiveFileId] = useState<string | null>(null);
    const processingRef = useRef(false);

    // Helper to process a single file with grain
    const processFile = async (file: File, settings: GrainSettings): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(file);
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    URL.revokeObjectURL(url);
                    reject(new Error("No context"));
                    return;
                }

                ctx.drawImage(img, 0, 0);

                // Grain Logic
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                const grainAmount = settings.amount;
                const roughness = settings.roughness / 100;

                if (settings.mode === 'manual') {
                    // Manual: Uniform noise with density control (roughness)
                    for (let i = 0; i < data.length; i += 4) {
                        if (Math.random() < roughness) { // Density
                            const grain = (Math.random() - 0.5) * grainAmount * 2.55;
                            data[i] = Math.min(255, Math.max(0, data[i] + grain));
                            data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + grain));
                            data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + grain));
                        }
                    }
                } else {
                    // Lumegrain: Luma-weighted noise
                    // Protects shadows (0) and highlights (255) to mimic film
                    for (let i = 0; i < data.length; i += 4) {
                        const r = data[i];
                        const g = data[i + 1];
                        const b = data[i + 2];

                        // Calculate luminance
                        const luma = 0.299 * r + 0.587 * g + 0.114 * b;

                        // Luma factor: 0 at ends, 1 at mid-grey (128)
                        // Parabolic curve: 1 - ((luma/255 - 0.5) * 2)^2
                        // Adjusted by roughness to flatten or sharpen the curve
                        const normLuma = luma / 255;
                        const lumaFactor = 1 - Math.pow((normLuma - 0.5) * 2, 2);

                        // Apply roughness as intensity modifier on the cure
                        // If roughness is high, we apply more grain across whole spectrum
                        // If low, we restrict strictly to midtones
                        const effectiveStrength = lumaFactor * roughness + (1 - lumaFactor) * (roughness * 0.2);

                        const grain = (Math.random() - 0.5) * grainAmount * 2.55 * effectiveStrength;

                        data[i] = Math.min(255, Math.max(0, r + grain));
                        data[i + 1] = Math.min(255, Math.max(0, g + grain));
                        data[i + 2] = Math.min(255, Math.max(0, b + grain));
                    }
                }

                ctx.putImageData(imageData, 0, 0);

                if (settings.size > 1) {
                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width = canvas.width;
                    tempCanvas.height = canvas.height;
                    const tempCtx = tempCanvas.getContext('2d')!;
                    tempCtx.drawImage(canvas, 0, 0);

                    ctx.filter = `blur(${(settings.size - 1) * 0.5}px)`;
                    ctx.drawImage(tempCanvas, 0, 0);
                    ctx.filter = 'none';
                }

                canvas.toBlob((blob) => {
                    URL.revokeObjectURL(url);
                    if (blob) resolve(blob);
                    else reject(new Error("Blob creation failed"));
                }, file.type === 'image/jpeg' ? 'image/jpeg' : 'image/png');
            };
            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error("Image load failed"));
            };
            img.src = url;
        });
    };

    // Auto-process pending
    useEffect(() => {
        const pendingFiles = files.filter(f => f.status === 'pending');
        if (pendingFiles.length === 0 || processingRef.current) return;

        const processNext = async () => {
            processingRef.current = true;
            setIsBatchProcessing(true);
            const fileToProcess = pendingFiles[0];

            setFiles(prev => prev.map(f => f.id === fileToProcess.id ? { ...f, status: 'processing' } : f));

            try {
                const blob = await processFile(fileToProcess.file, settings);
                setFiles(prev => prev.map(f => f.id === fileToProcess.id ? {
                    ...f,
                    status: 'completed',
                    compressedBlob: blob,
                    compressedSize: blob.size
                } : f));
            } catch (error) {
                console.error("Grain processing failed", error);
                setFiles(prev => prev.map(f => f.id === fileToProcess.id ? {
                    ...f,
                    status: 'error',
                    error: 'Failed'
                } : f));
            } finally {
                processingRef.current = false;
                setIsBatchProcessing(false);
            }
        };

        const timer = setTimeout(processNext, 100);
        return () => clearTimeout(timer);
    }, [files, settings]);

    useEffect(() => {
        setFiles(prev => prev.map(f => f.status === 'completed' || f.status === 'error' ? { ...f, status: 'pending' } : f));
    }, [settings.amount, settings.size, settings.roughness, settings.mode]);


    const handleFilesSelect = (newFiles: File[]) => {
        const batchFiles: BatchFile[] = newFiles.map(f => ({
            id: Math.random().toString(36).substr(2, 9),
            file: f,
            status: 'pending',
            originalSize: f.size
        }));
        setFiles(prev => [...prev, ...batchFiles]);
        if (!activeFileId && batchFiles.length > 0) {
            setActiveFileId(batchFiles[0].id);
        }
    };

    const handleRemoveFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
        if (activeFileId === id) setActiveFileId(null);
    };

    const handleDownloadAll = async () => {
        const completed = files.filter(f => f.status === 'completed' && f.compressedBlob);
        if (completed.length === 0) return;

        if (completed.length === 1) {
            const f = completed[0];
            downloadBlob(f.compressedBlob!, `grained_${f.file.name}`);
        } else {
            const zip = new JSZip();
            completed.forEach(f => {
                zip.file(`grained_${f.file.name}`, f.compressedBlob!);
            });
            const content = await zip.generateAsync({ type: "blob" });
            downloadBlob(content, "grained_images.zip");
        }
    };

    return (
        <GrainContext.Provider value={{
            files,
            setFiles,
            isBatchProcessing,
            settings,
            setSettings,
            handleDownloadAll,
            handleRemoveFile,
            handleFilesSelect,
            activeFileId,
            setActiveFileId
        }}>
            {children}
        </GrainContext.Provider>
    );
}

export function useGrain() {
    const context = useContext(GrainContext);
    if (!context) throw new Error("useGrain must be used within GrainProvider");
    return context;
}
