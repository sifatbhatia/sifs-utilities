"use client";

import React, { createContext, useContext, useState } from 'react';

interface CircleContextType {
    originalImage: string | null;
    setOriginalImage: (img: string | null) => void;
    croppedImage: string | null;
    setCroppedImage: (img: string | null) => void;
    isProcessing: boolean;
    setIsProcessing: (b: boolean) => void;
}

const CircleContext = createContext<CircleContextType | undefined>(undefined);

export function CircleProvider({ children }: { children: React.ReactNode }) {
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    return (
        <CircleContext.Provider value={{
            originalImage,
            setOriginalImage,
            croppedImage,
            setCroppedImage,
            isProcessing,
            setIsProcessing
        }}>
            {children}
        </CircleContext.Provider>
    );
}

export function useCircle() {
    const context = useContext(CircleContext);
    if (!context) throw new Error("useCircle must be used within CircleProvider");
    return context;
}
