"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCheck, FileX, Loader2, X } from 'lucide-react';
import { formatBytes } from '@/lib/compression';
import clsx from 'clsx';

export interface BatchFile {
    id: string;
    file: File;
    status: 'pending' | 'processing' | 'completed' | 'error';
    originalSize: number;
    compressedSize?: number;
    compressedBlob?: Blob;
    error?: string;
}

interface BatchQueueProps {
    files: BatchFile[];
    onRemove: (id: string) => void;
    isProcessing: boolean;
}

export default function BatchQueue({ files, onRemove, isProcessing }: BatchQueueProps) {
    return (
        <div className="space-y-3">
            <AnimatePresence initial={false} mode="popLayout">
                {files.map((file) => (
                    <motion.div
                        key={file.id}
                        layout
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                        className={clsx(
                            "relative flex items-center gap-4 p-4 rounded-2xl border transition-all group",
                            file.status === 'completed'
                                ? "bg-zinc-100/60 border-zinc-200/60 hover:border-zinc-300"
                                : file.status === 'error'
                                    ? "bg-red-50 border-red-200/60"
                                    : "bg-zinc-50/50 border-zinc-100"
                        )}
                    >
                        {/* Status Icon */}
                        <div className="shrink-0">
                            {file.status === 'processing' ? (
                                <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center">
                                    <Loader2 className="w-5 h-5 text-zinc-400 animate-spin" />
                                </div>
                            ) : file.status === 'completed' ? (
                                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                                    <FileCheck size={20} strokeWidth={2.5} />
                                </div>
                            ) : file.status === 'error' ? (
                                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-500">
                                    <FileX size={20} strokeWidth={2.5} />
                                </div>
                            ) : (
                                <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-300">
                                    <Loader2 size={20} className="opacity-0" />
                                </div>
                            )}
                        </div>

                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                            <h4 className="text-[11px] font-bold text-zinc-800 uppercase tracking-tight truncate pr-8">
                                {file.file.name}
                            </h4>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-tight mt-1">
                                <span className="font-mono">{formatBytes(file.originalSize)}</span>
                                {file.compressedSize && (
                                    <>
                                        <span className="text-zinc-300">→</span>
                                        <span className="text-emerald-600 font-mono">{formatBytes(file.compressedSize)}</span>
                                        <span className="bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded text-[9px]">
                                            -{Math.round(((file.originalSize - file.compressedSize) / file.originalSize) * 100)}%
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove(file.id);
                            }}
                            className="absolute top-4 right-4 text-zinc-300 hover:text-zinc-700 transition-all p-2 rounded-xl hover:bg-zinc-100 opacity-0 group-hover:opacity-100"
                        >
                            <X size={14} strokeWidth={3} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
