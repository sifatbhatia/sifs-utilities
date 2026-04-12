"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { compressImage } from '@/lib/compression';
import { BatchFile } from '@/components/BatchQueue';
import JSZip from 'jszip';

interface PixContextType {
    files: BatchFile[];
    setFiles: React.Dispatch<React.SetStateAction<BatchFile[]>>;
    isBatchProcessing: boolean;
    quality: number;
    setQuality: (q: number) => void;
    format: string;
    setFormat: (f: string) => void;
    handleDownloadAll: () => Promise<void>;
    handleRemoveFile: (id: string) => void;
    handleFilesSelect: (newFiles: File[]) => void;
}

const PixContext = createContext<PixContextType | undefined>(undefined);

export function PixProvider({ children }: { children: React.ReactNode }) {
    const [files, setFiles] = useState<BatchFile[]>([]);
    const [isBatchProcessing, setIsBatchProcessing] = useState(false);
    const [quality, setQuality] = useState(80);
    const [format, setFormat] = useState('webp');

    // Reset files to pending if quality or format changes
    useEffect(() => {
        setFiles(prev => prev.map(f => ({ ...f, status: 'pending' })));
    }, [quality, format]);

    // Auto-process pending files
    useEffect(() => {
        const pendingFiles = files.filter(f => f.status === 'pending');
        if (pendingFiles.length === 0) return;

        const processNext = async () => {
            if (isBatchProcessing) return;
            setIsBatchProcessing(true);
            const fileToProcess = pendingFiles[0];
            if (!fileToProcess) {
                setIsBatchProcessing(false);
                return;
            }

            setFiles(prev => prev.map(f => f.id === fileToProcess.id ? { ...f, status: 'processing' } : f));

            try {
                const result = await processSingleFile(fileToProcess.file, quality, format);
                setFiles(prev => prev.map(f => f.id === fileToProcess.id ? {
                    ...f,
                    status: 'completed',
                    compressedBlob: result.blob,
                    compressedSize: result.blob.size
                } : f));
            } catch (error) {
                console.error("Batch error", error);
                setFiles(prev => prev.map(f => f.id === fileToProcess.id ? {
                    ...f,
                    status: 'error',
                    error: 'Failed'
                } : f));
            } finally {
                setIsBatchProcessing(false);
            }
        };

        const timer = setTimeout(processNext, 100);
        return () => clearTimeout(timer);
    }, [files, isBatchProcessing, quality, format]);

    const processSingleFile = async (file: File, q: number, fmt: string): Promise<{ blob: Blob }> => {
        const clientSupportedFormats = ['image/jpeg', 'image/png', 'image/webp'];
        const targetMimeType = `image/${fmt}`;
        const canUseClient = clientSupportedFormats.includes(file.type) && ['webp', 'jpeg', 'jpg', 'png'].includes(fmt);

        if (canUseClient) {
            const options = {
                maxSizeMB: 2,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
                fileType: targetMimeType,
                initialQuality: q / 100,
            };
            const compressed = await compressImage(file, options);
            return { blob: compressed };
        } else {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('format', fmt);
            formData.append('quality', q.toString());
            const res = await fetch('/api/convert', { method: 'POST', body: formData });
            if (!res.ok) throw new Error('Conversion failed');
            const blob = await res.blob();
            return { blob };
        }
    };

    const handleFilesSelect = (newFiles: File[]) => {
        const batchFiles: BatchFile[] = newFiles.map(f => ({
            id: Math.random().toString(36).substr(2, 9),
            file: f,
            status: 'pending',
            originalSize: f.size
        }));
        setFiles(prev => [...prev, ...batchFiles]);
    };

    const handleRemoveFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    const handleDownloadAll = async () => {
        const completed = files.filter(f => f.status === 'completed' && f.compressedBlob);
        if (completed.length === 0) return;

        if (completed.length === 1) {
            const f = completed[0];
            const link = document.createElement('a');
            link.href = URL.createObjectURL(f.compressedBlob!);
            link.download = `compressed_${f.file.name.split('.')[0]}.${format}`;
            link.click();
        } else {
            const zip = new JSZip();
            completed.forEach(f => {
                zip.file(`compressed_${f.file.name.split('.')[0]}.${format}`, f.compressedBlob!);
            });
            const content = await zip.generateAsync({ type: "blob" });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = "images.zip";
            link.click();
        }
    };

    return (
        <PixContext.Provider value={{
            files,
            setFiles,
            isBatchProcessing,
            quality,
            setQuality,
            format,
            setFormat,
            handleDownloadAll,
            handleRemoveFile,
            handleFilesSelect
        }}>
            {children}
        </PixContext.Provider>
    );
}

export function usePix() {
    const context = useContext(PixContext);
    if (!context) throw new Error("usePix must be used within PixProvider");
    return context;
}
