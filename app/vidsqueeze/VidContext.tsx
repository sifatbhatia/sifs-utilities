"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { BatchFile } from '@/components/BatchQueue';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import JSZip from 'jszip';

interface VidContextType {
    files: BatchFile[];
    setFiles: React.Dispatch<React.SetStateAction<BatchFile[]>>;
    isBatchProcessing: boolean;
    quality: number; // CRF
    setQuality: (q: number) => void;
    handleDownloadAll: () => Promise<void>;
    handleRemoveFile: (id: string) => void;
    handleFilesSelect: (newFiles: File[]) => void;
    ffmpeg: FFmpeg | null;
    loadFfmpeg: () => Promise<void>;
}

const VidContext = createContext<VidContextType | undefined>(undefined);

export function VidProvider({ children }: { children: React.ReactNode }) {
    const [files, setFiles] = useState<BatchFile[]>([]);
    const [isBatchProcessing, setIsBatchProcessing] = useState(false);
    const [quality, setQuality] = useState(23); // Default CRF 23
    const [ffmpeg, setFfmpeg] = useState<FFmpeg | null>(null);
    const processingRef = useRef(false);

    // Initialize FFmpeg
    const loadFfmpeg = async () => {
        if (ffmpeg) return;
        const ffmpegInstance = new FFmpeg();
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';

        ffmpegInstance.on('log', ({ message }) => {
            console.log('FFmpeg:', message);
        });

        await ffmpegInstance.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });

        setFfmpeg(ffmpegInstance);
    };

    // Auto-process
    useEffect(() => {
        const pendingFiles = files.filter(f => f.status === 'pending');
        if (pendingFiles.length === 0 || !ffmpeg || processingRef.current) return;

        const processNext = async () => {
            processingRef.current = true;
            setIsBatchProcessing(true);

            const fileToProcess = pendingFiles[0];

            // Mark as processing
            setFiles(prev => prev.map(f => f.id === fileToProcess.id ? { ...f, status: 'processing' } : f));

            try {
                await ffmpeg.writeFile(fileToProcess.file.name, await fetchFile(fileToProcess.file));
                const outputName = `compressed_${fileToProcess.file.name.split('.')[0]}.mp4`;

                // Run FFmpeg: -crf 23 is default, lower is better. 
                // Preset ultrafast for speed in browser? or medium?
                // Using ultrafast to ensure user doesn't wait forever in browser.
                await ffmpeg.exec([
                    '-i', fileToProcess.file.name,
                    '-vcodec', 'libx264',
                    '-crf', quality.toString(),
                    '-preset', 'ultrafast',
                    outputName
                ]);

                const data = await ffmpeg.readFile(outputName);
                const blob =
                    typeof data === "string"
                        ? new Blob([data], { type: "video/mp4" })
                        : new Blob([new Uint8Array(data)], { type: "video/mp4" });

                // Cleanup
                await ffmpeg.deleteFile(fileToProcess.file.name);
                await ffmpeg.deleteFile(outputName);

                setFiles(prev => prev.map(f => f.id === fileToProcess.id ? {
                    ...f,
                    status: 'completed',
                    compressedBlob: blob,
                    compressedSize: blob.size
                } : f));

            } catch (error) {
                console.error("Video compression failed", error);
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
    }, [files, ffmpeg, quality]);

    const handleFilesSelect = (newFiles: File[]) => {
        if (!ffmpeg) loadFfmpeg();

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
            link.download = `compressed_${f.file.name.split('.')[0]}.mp4`;
            link.click();
        } else {
            const zip = new JSZip();
            completed.forEach(f => {
                zip.file(`compressed_${f.file.name.split('.')[0]}.mp4`, f.compressedBlob!);
            });
            const content = await zip.generateAsync({ type: "blob" });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = "videos.zip";
            link.click();
        }
    };

    return (
        <VidContext.Provider value={{
            files,
            setFiles,
            isBatchProcessing,
            quality,
            setQuality,
            handleDownloadAll,
            handleRemoveFile,
            handleFilesSelect,
            ffmpeg,
            loadFfmpeg
        }}>
            {children}
        </VidContext.Provider>
    );
}

export function useVid() {
    const context = useContext(VidContext);
    if (!context) throw new Error("useVid must be used within VidProvider");
    return context;
}
