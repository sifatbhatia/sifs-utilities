"use client";

import React, { useState } from "react";
import clsx from 'clsx';

interface PremiumSliderProps {
    value: number;
    min: number;
    max: number;
    step?: number;
    onChange: (value: number) => void;
    onAfterChange?: (value: number) => void;
    className?: string;
    label?: string;
    unit?: string;
    icon?: React.ReactNode;
    labelTransform?: (value: number) => string | number;
    labelColor?: string;
    valueColor?: string;
}

export default function PremiumSlider({
    value,
    min,
    max,
    step = 1,
    onChange,
    onAfterChange,
    className,
    label,
    unit = "",
    icon,
    labelTransform,
    labelColor = "text-zinc-500",
    valueColor = "text-zinc-800"
}: PremiumSliderProps) {
    const [localValue, setLocalValue] = useState(value);
    const [isDragging, setIsDragging] = useState(false);

    const displayedValue = isDragging ? localValue : value;
    const percentage = ((displayedValue - min) / (max - min)) * 100;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        setLocalValue(val);
        onChange(val);
    };

    const handleMouseUp = () => {
        onAfterChange?.(localValue);
        setIsDragging(false);
    };

    const handleMouseDown = () => {
        setLocalValue(value);
        setIsDragging(true);
    };

    return (
        <div className={clsx("w-full space-y-2.5", className)}>
            {(label || unit) && (
                <div className="flex justify-between items-center px-1">
                    <div className={clsx("flex items-center gap-2 text-[10px] sm:text-[11px] font-medium uppercase tracking-tight", labelColor)}>
                        {icon}{label}
                    </div>
                    <span className={clsx("text-[10px] sm:text-[11px] font-semibold transition-all", valueColor)}>
                        {labelTransform ? labelTransform(displayedValue) : displayedValue}{unit}
                    </span>
                </div>
            )}

            <div className="relative h-6 flex items-center group/slider">
                {/* Background Track - Shade lighter than zinc-600 */}
                <div className="absolute w-full h-1.5 bg-zinc-200 rounded-full" />

                {/* Progress Track - zinc-600 */}
                <div
                    className="absolute h-1.5 bg-zinc-600 rounded-full transition-all duration-75 pointer-events-none"
                    style={{ width: `${percentage}%` }}
                />

                {/* Invisible native slider for interaction */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={displayedValue}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onTouchEnd={handleMouseUp}
                    onChange={handleChange}
                    className={clsx(
                        "absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer z-10",
                        "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-zinc-600 [&::-webkit-slider-thumb]:shadow-[0_0_15px_rgba(0,0,0,0.1)] [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:active:scale-90",
                        "[&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-zinc-600 [&::-moz-range-thumb]:shadow-[0_0_15px_rgba(0,0,0,0.1)] [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:active:scale-90"
                    )}
                />

                {/* Custom Thumb - for better styling control (Optional, current approach uses native thumb for better touch handling) */}
            </div>
        </div>
    );
}
