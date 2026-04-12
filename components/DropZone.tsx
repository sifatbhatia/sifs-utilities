"use client";

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Plus } from 'lucide-react';
import clsx from 'clsx';

interface DropZoneProps {
    onFileSelect: (files: File[]) => void;
    isProcessing: boolean;
    accept?: Record<string, string[]>;
    text?: string;
    subText?: string;
}

export default function DropZone({
    onFileSelect,
    isProcessing,
    accept = { 'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.avif', '.tiff', '.bmp', '.ico'] },
    text = "Add your images",
    subText = "Drop images here"
}: DropZoneProps) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            onFileSelect(acceptedFiles);
        }
    }, [onFileSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        multiple: true,
        disabled: isProcessing
    });

    return (
        <div
            {...getRootProps()}
            className={clsx(
                "relative group cursor-pointer touch-manipulation w-full min-h-[200px] h-full max-w-[1610px] bg-[#D9D9D9] rounded-[28px] sm:rounded-[48px] lg:rounded-[67px] border border-[#8E8E8E] flex flex-col items-center justify-center transition-all duration-300 ease-out hover:bg-[#e5e5e5] active:bg-[#d0d0d0]",
                isDragActive && "bg-[#cccccc] scale-[0.99]",
                isProcessing && "opacity-50 cursor-not-allowed"
            )}
        >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center gap-4 sm:gap-6 z-10 text-center px-4 py-6">
                <div className={clsx(
                    "w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#555555] flex items-center justify-center text-white transition-transform duration-300",
                    isDragActive ? "scale-110" : "group-hover:scale-105"
                )}>
                    <Plus className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2} />
                </div>

                <p className="text-lg sm:text-2xl font-medium text-[#555555] tracking-tight leading-tight select-none max-w-[18rem] sm:max-w-none">
                    {isDragActive ? subText : text}
                </p>
            </div>
        </div>
    );
}
