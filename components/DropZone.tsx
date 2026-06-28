"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Plus } from "lucide-react";
import clsx from "clsx";
import { useTheme } from "@/components/theme/ThemeProvider";
import { dropZoneChrome } from "@/lib/marketingChrome";

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
  const { theme } = useTheme();
  const dz = dropZoneChrome(theme);
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
        dz.root,
        isDragActive && dz.dragActive,
        isProcessing && "opacity-50 cursor-not-allowed",
      )}
    >
      <input {...getInputProps()} />

      <div className="z-10 flex flex-col items-center gap-3 px-4 py-6 text-center sm:gap-6">
        <div
          className={clsx(dz.plusBtn, isDragActive ? "scale-110" : "group-hover:scale-105")}
        >
          <Plus className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={2.5} />
        </div>

        <p
          className={dz.title}
        >
          {isDragActive ? subText : text}
        </p>
      </div>
    </div>
  );
}
