"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Plus } from "lucide-react";
import clsx from "clsx";

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
  accept = { "image/*": [".jpeg", ".jpg", ".png", ".webp", ".avif", ".tiff", ".bmp", ".ico"] },
  text = "Add your images",
  subText = "Drop images here",
}: DropZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles);
      }
    },
    [onFileSelect],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: true,
    disabled: isProcessing,
  });

  return (
    <div
      {...getRootProps()}
      className={clsx(
        "relative group cursor-pointer touch-manipulation w-full min-h-[200px] h-full max-w-[1610px] flex flex-col items-center justify-center rounded-xl border-[3px] border-neo-ink bg-white shadow-[6px_6px_0_0_#0a0a0a] transition-[transform,box-shadow] duration-150 ease-out hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[4px_4px_0_0_#0a0a0a] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0_0_#0a0a0a]",
        isDragActive && "bg-neo-mint ring-2 ring-neo-ink ring-offset-2 ring-offset-[#fff8e8]",
        isProcessing && "opacity-50 cursor-not-allowed",
      )}
    >
      <input {...getInputProps()} />

      <div className="z-10 flex flex-col items-center gap-4 px-4 py-6 text-center sm:gap-6">
        <div
          className={clsx(
            "flex h-14 w-14 items-center justify-center rounded-lg border-[3px] border-neo-ink bg-neo-ink text-white shadow-[4px_4px_0_0_#62f5cd] transition-transform duration-150 sm:h-16 sm:w-16",
            isDragActive ? "scale-110" : "group-hover:scale-105",
          )}
        >
          <Plus className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={2.5} />
        </div>

        <p className="max-w-[18rem] select-none text-lg font-extrabold uppercase leading-tight tracking-tight text-neo-ink sm:max-w-none sm:text-2xl">
          {isDragActive ? subText : text}
        </p>
      </div>
    </div>
  );
}
