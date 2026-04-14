"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, ShieldCheck, X, FileText, CheckCircle, FileType, File, Loader2, Image as ImageIcon, List } from 'lucide-react';
import { formatBytes } from '@/lib/compression';
import DropZone from './DropZone';
import PremiumBackground from '@/components/PremiumBackground';
import clsx from 'clsx';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { useTheme } from '@/components/theme/ThemeProvider';
import { workspaceChrome } from '@/lib/marketingChrome';

export default function MetaShieldWorkspace() {
    const { theme } = useTheme();
    const w = workspaceChrome(theme);
    const [file, setFile] = useState<File | null>(null);
    const [isCleaned, setIsCleaned] = useState(false);
    const [cleanedBlob, setCleanedBlob] = useState<Blob | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [log, setLog] = useState<string[]>([]);
    const [showSidebar, setShowSidebar] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const addLog = (msg: string) => setLog(prev => [...prev, msg]);

    // Create preview URL for images
    React.useEffect(() => {
        if (file && file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(null);
        }
    }, [file]);

    const cleanPdf = async (file: File): Promise<Blob> => {
        addLog("Loading PDF document...");
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);

        addLog("Scrubbing PDF metadata...");
        pdfDoc.setTitle('');
        pdfDoc.setAuthor('');
        pdfDoc.setSubject('');
        pdfDoc.setKeywords([]);
        pdfDoc.setProducer('');
        pdfDoc.setCreator('');
        pdfDoc.setCreationDate(new Date());
        pdfDoc.setModificationDate(new Date());

        const savedBytes = await pdfDoc.save();
        return new Blob([savedBytes as unknown as BlobPart], { type: 'application/pdf' });
    };

    const cleanOffice = async (file: File): Promise<Blob> => {
        addLog("Loading Office document...");
        const zip = new JSZip();
        const loadedZip = await zip.loadAsync(file);

        addLog("Locating metadata files...");
        const coreXml = loadedZip.file("docProps/core.xml");
        const appXml = loadedZip.file("docProps/app.xml");

        if (coreXml) {
            addLog("Scrubbing core properties...");
            let content = await coreXml.async("string");
            content = content.replace(/<dc:creator>.*?<\/dc:creator>/g, "<dc:creator></dc:creator>");
            content = content.replace(/<cp:lastModifiedBy>.*?<\/cp:lastModifiedBy>/g, "<cp:lastModifiedBy></cp:lastModifiedBy>");
            content = content.replace(/<dc:title>.*?<\/dc:title>/g, "<dc:title></dc:title>");
            content = content.replace(/<dc:description>.*?<\/dc:description>/g, "<dc:description></dc:description>");
            zip.file("docProps/core.xml", content);
        }

        if (appXml) {
            addLog("Scrubbing app properties...");
            let content = await appXml.async("string");
            content = content.replace(/<Company>.*?<\/Company>/g, "<Company></Company>");
            content = content.replace(/<Manager>.*?<\/Manager>/g, "<Manager></Manager>");
            zip.file("docProps/app.xml", content);
        }

        return await zip.generateAsync({ type: "blob" });
    };

    const cleanImage = async (file: File): Promise<Blob> => {
        addLog("Re-encoding image to strip EXIF...");
        return new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(file);
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error("Canvas context failed"));
                    return;
                }
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    URL.revokeObjectURL(url);
                    if (blob) resolve(blob);
                    else reject(new Error("Blob creation failed"));
                }, file.type);
            };
            img.onerror = () => reject(new Error("Image load failed"));
            img.src = url;
        });
    };

    const handleClean = async () => {
        if (!file) return;
        setIsProcessing(true);
        setLog([]);
        setCleanedBlob(null);

        try {
            let blob: Blob;
            if (file.type === 'application/pdf') {
                blob = await cleanPdf(file);
            } else if (
                file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
                file.name.endsWith('.docx') || file.name.endsWith('.xlsx') || file.name.endsWith('.pptx')
            ) {
                blob = await cleanOffice(file);
            } else if (file.type.startsWith('image/')) {
                blob = await cleanImage(file);
            } else {
                addLog("Unknown type, performing sanitize pass...");
                blob = file;
            }

            setCleanedBlob(blob);
            setIsCleaned(true);
            addLog("Cleaning complete!");
        } catch (error) {
            console.error(error);
            addLog("Error during cleaning.");
        } finally {
            setIsProcessing(false);
        }
    };

    const getFileTypeLabel = () => {
        if (!file) return 'File';
        if (file.type === 'application/pdf') return 'PDF';
        if (file.type.startsWith('image/')) return file.type.split('/')[1].toUpperCase();
        if (file.name.endsWith('.docx')) return 'DOCX';
        if (file.name.endsWith('.xlsx')) return 'XLSX';
        if (file.name.endsWith('.pptx')) return 'PPTX';
        return 'FILE';
    };

    const getFileIcon = () => {
        if (!file) return <File className="w-8 h-8 text-zinc-400" strokeWidth={1.5} />;
        if (file.type === 'application/pdf') return <FileText className="w-8 h-8 text-red-500" strokeWidth={1.5} />;
        if (file.type.startsWith('image/')) return <ImageIcon className="w-8 h-8 text-blue-500" strokeWidth={1.5} />;
        return <FileType className="w-8 h-8 text-indigo-500" strokeWidth={1.5} />;
    };

    const getFileIconColor = () => {
        if (!file) return 'bg-zinc-100';
        if (file.type === 'application/pdf') return 'bg-red-100';
        if (file.type.startsWith('image/')) return 'bg-blue-100';
        return 'bg-indigo-100';
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
                            accept={{
                                'image/*': [],
                                'application/pdf': [],
                                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
                                'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
                            }}
                            text="Add file"
                            subText="Supports PDF, DOCX, XLSX, PPTX, Images"
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="workspace"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 flex flex-col lg:grid lg:grid-cols-[1fr_340px] gap-4 p-2 sm:p-4 md:p-6 min-h-0 h-full overflow-y-auto lg:overflow-hidden max-w-[1500px] mx-auto w-full relative"
                    >
                        {/* LEFT COLUMN: Preview */}
                        <div className="flex flex-col gap-4 min-h-[380px] lg:min-h-0 flex-1 relative">
                            <div className="neo-shell-outer flex-1 min-h-[340px]">
                                <div className="neo-shell-inner w-full h-full overflow-hidden relative flex-1 flex items-center justify-center">

                                    {/* Image preview */}
                                    {file.type.startsWith('image/') && previewUrl ? (
                                        <div className="w-full h-full flex items-center justify-center p-6 sm:p-8">
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                className="max-w-full max-h-full object-contain pointer-events-none select-none shadow-2xl rounded-lg"
                                            />
                                        </div>
                                    ) : file.type === 'application/pdf' ? (
                                        /* PDF preview */
                                        <div className="w-full h-full bg-white rounded-[16px] sm:rounded-[24px] m-3 sm:m-4 overflow-hidden">
                                            <embed
                                                src={`${URL.createObjectURL(file)}#toolbar=0&navpanes=0`}
                                                type="application/pdf"
                                                className="w-full h-full"
                                            />
                                        </div>
                                    ) : (
                                        /* Generic file preview */
                                        <div className="flex flex-col items-center justify-center gap-5 text-center p-8">
                                            <div className={clsx("w-20 h-20 rounded-3xl flex items-center justify-center", getFileIconColor())}>
                                                {getFileIcon()}
                                            </div>
                                            <div>
                                                <h3 className="text-lg sm:text-xl font-bold text-zinc-800 uppercase tracking-tight truncate max-w-[300px]">{file.name}</h3>
                                                <p className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-tight mt-1">
                                                    {formatBytes(file.size)} · {getFileTypeLabel()}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* File type badge */}
                                    <div className={clsx(
                                        "absolute top-4 left-4 text-white text-[9px] font-black px-3 py-1.5 rounded-xl shadow-lg uppercase tracking-wider z-10",
                                        file.type === 'application/pdf' ? 'bg-red-500'
                                            : file.type.startsWith('image/') ? 'bg-blue-500'
                                                : 'bg-indigo-500'
                                    )}>
                                        {getFileTypeLabel()}
                                    </div>

                                    {/* Shield status badge */}
                                    {isCleaned && (
                                        <div className="absolute top-4 left-20 bg-emerald-500 text-white text-[9px] font-black px-3 py-1.5 rounded-xl shadow-lg uppercase tracking-wider z-10 flex items-center gap-1.5">
                                            <CheckCircle className="w-3 h-3" /> Clean
                                        </div>
                                    )}

                                    {/* Close button */}
                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => {
                                            setFile(null);
                                            setIsCleaned(false);
                                            setCleanedBlob(null);
                                            setLog([]);
                                        }}
                                        className="absolute top-4 right-4 z-10 bg-black/5 hover:bg-black/10 text-black/30 hover:text-black p-2.5 rounded-full transition-all border border-black/5"
                                    >
                                        <X className="w-5 h-5" />
                                    </motion.button>

                                    {/* Processing overlay */}
                                    {isProcessing && (
                                        <div className="neo-modal-overlay">
                                            <Loader2 className="w-12 h-12 animate-spin mb-4 text-black/20" />
                                            <p className="text-[11px] font-bold uppercase tracking-tight text-zinc-400 animate-pulse">Scrubbing Metadata</p>
                                        </div>
                                    )}

                                    {/* Floating Controls — ABOVE preview on all devices */}
                                    <div className="neo-dock max-w-[600px] p-3 sm:p-4 flex items-center gap-4 backdrop-blur-xl shadow-[0px_18px_36px_0px_rgba(0,0,0,0.16),0px_2px_8px_0px_rgba(0,0,0,0.08),inset_0px_1px_0px_0px_rgba(255,255,255,0.36)]">

                                        {/* Status */}
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className={clsx(
                                                "w-2.5 h-2.5 rounded-full shrink-0",
                                                isCleaned ? "bg-emerald-500 animate-pulse" : "bg-orange-400"
                                            )} />
                                            <div className="min-w-0">
                                                <div className={clsx(
                                                    "text-[11px] sm:text-xs font-bold uppercase tracking-tight",
                                                    isCleaned ? "text-emerald-600" : "text-zinc-600"
                                                )}>
                                                    {isCleaned ? 'Sanitized' : 'Vulnerable'}
                                                </div>
                                                <div className="text-[8px] font-bold text-zinc-400 uppercase tracking-tight truncate">
                                                    {file.name}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action */}
                                        {!isCleaned ? (
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleClean}
                                                disabled={isProcessing}
                                                className={clsx(w.runPrimary, "shrink-0 px-5 sm:px-7 py-2.5 sm:py-3 rounded-[16px] sm:rounded-[20px] text-[10px] sm:text-[11px]")}
                                            >
                                                <ShieldCheck className="w-3.5 h-3.5" /> Scrub
                                            </motion.button>
                                        ) : (
                                            <motion.a
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                href={cleanedBlob ? URL.createObjectURL(cleanedBlob) : '#'}
                                                download={`safe_${file.name.replace(/(\.[^\\.]+)$/, '_clean$1')}`}
                                                className={clsx(w.runPrimary, "shrink-0 px-5 sm:px-7 py-2.5 sm:py-3 rounded-[16px] sm:rounded-[20px] text-[10px] sm:text-[11px]")}
                                            >
                                                <Download className="w-3.5 h-3.5" /> Download
                                            </motion.a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Sidebar (Details) */}
                        <div className={clsx(
                            "flex flex-col neo-sidebar overflow-hidden min-h-0",
                            showSidebar ? "fixed inset-4 z-50 lg:relative lg:inset-auto" : "hidden lg:flex",
                            "lg:h-full"
                        )}>
                            {/* Header */}
                            <div className="p-5 shrink-0 flex items-center justify-between border-b border-black/10 bg-black/5">
                                <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-tight">Details</h3>
                                <div className="flex items-center gap-2">
                                    <div className={clsx(
                                        "text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tight",
                                        isCleaned
                                            ? "text-emerald-600 bg-emerald-100"
                                            : "text-orange-600 bg-orange-100"
                                    )}>
                                        {isCleaned ? 'Clean' : 'Pending'}
                                    </div>
                                    <button onClick={() => setShowSidebar(false)} className="lg:hidden p-1.5 rounded-full hover:bg-black/10 transition-colors">
                                        <X className="w-4 h-4 text-zinc-500" />
                                    </button>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="flex-1 overflow-y-auto min-h-0 px-5 py-5 space-y-5 custom-scrollbar">

                                {/* File Card */}
                                <div className="bg-zinc-100/50 rounded-2xl p-4 border border-zinc-200/50 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", getFileIconColor())}>
                                            {getFileIcon()}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[11px] font-bold text-zinc-800 uppercase tracking-tight truncate">{file.name}</p>
                                            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight mt-0.5">
                                                {formatBytes(file.size)} · {getFileTypeLabel()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* File Properties */}
                                <div className="space-y-3">
                                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Properties</div>
                                    <div className="bg-zinc-100/50 rounded-2xl p-4 border border-zinc-200/50 space-y-3">
                                        <div className="flex justify-between items-center text-[11px] font-bold">
                                            <span className="text-zinc-500 uppercase tracking-tight">Type</span>
                                            <span className="text-zinc-800 font-mono">{getFileTypeLabel()}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[11px] font-bold">
                                            <span className="text-zinc-500 uppercase tracking-tight">MIME</span>
                                            <span className="text-zinc-800 font-mono text-[10px]">{file.type || 'unknown'}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[11px] font-bold">
                                            <span className="text-zinc-500 uppercase tracking-tight">Size</span>
                                            <span className="text-zinc-800 font-mono">{formatBytes(file.size)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[11px] font-bold">
                                            <span className="text-zinc-500 uppercase tracking-tight">Status</span>
                                            <span className={clsx(
                                                "font-bold uppercase tracking-tight px-2 py-0.5 rounded-lg text-[10px]",
                                                isCleaned ? "bg-emerald-100 text-emerald-600" : "bg-orange-100 text-orange-600"
                                            )}>
                                                {isCleaned ? 'Sanitized' : 'Vulnerable'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Processing Log */}
                                <div className="space-y-3">
                                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Activity Log</div>
                                    <div className="bg-zinc-100/50 rounded-2xl p-4 border border-zinc-200/50 max-h-[200px] overflow-y-auto custom-scrollbar">
                                        {log.length === 0 ? (
                                            <div className="text-[10px] text-zinc-400 italic">Awaiting command...</div>
                                        ) : (
                                            <div className="space-y-2">
                                                {log.map((m, i) => (
                                                    <div key={i} className="text-[10px] text-zinc-600 font-mono leading-relaxed flex items-start gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                                                        {m}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* What Gets Removed */}
                                <div className="space-y-3">
                                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Targets</div>
                                    <div className="bg-zinc-100/50 rounded-2xl p-4 border border-zinc-200/50 space-y-2">
                                        {['Author & Creator', 'GPS / Location', 'Camera Model', 'Software', 'Timestamps', 'Comments'].map((item) => (
                                            <div key={item} className="flex items-center gap-2.5 text-[10px] font-bold text-zinc-500">
                                                <div className={clsx(
                                                    "w-1.5 h-1.5 rounded-full",
                                                    isCleaned ? "bg-emerald-400" : "bg-zinc-300"
                                                )} />
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-5 pt-3 border-t border-black/5 bg-black/5">
                                {!isCleaned ? (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleClean}
                                        disabled={isProcessing}
                                        className={clsx(w.runPrimary, "w-full px-8 py-4 rounded-[20px] text-[11px]")}
                                    >
                                        {isProcessing ? (
                                            <><Loader2 className="w-4 h-4 animate-spin" /> Scrubbing</>
                                        ) : (
                                            <><ShieldCheck className="w-4 h-4" /> Scrub Metadata</>
                                        )}
                                    </motion.button>
                                ) : (
                                    <motion.a
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        href={cleanedBlob ? URL.createObjectURL(cleanedBlob) : '#'}
                                        download={`safe_${file.name.replace(/(\.[^\\.]+)$/, '_clean$1')}`}
                                        className={clsx(w.runPrimary, "w-full px-8 py-4 rounded-[20px] text-[11px]")}
                                    >
                                        <Download className="w-4 h-4" /> Download Safe File
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
                            className={clsx(
                                "fixed safe-fab z-40 lg:hidden w-12 h-12 min-w-12 min-h-12 rounded-full shadow-xl flex items-center justify-center active:scale-95 transition-all touch-manipulation",
                                theme === "classic"
                                    ? "bg-[#575757] text-white hover:bg-[#4d4d4d]"
                                    : theme === "liquid-glass"
                                        ? "bg-neutral-900 text-white hover:bg-neutral-800 border border-white/10"
                                        : "bg-neo-ink text-white hover:bg-neo-ink/90 border-[3px] border-neo-ink"
                            )}
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
