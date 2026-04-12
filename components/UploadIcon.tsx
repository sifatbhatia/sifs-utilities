import React from 'react';
import { Upload } from 'lucide-react';

export default function UploadIcon({ className }: { className?: string }) {
    return <Upload className={className} strokeWidth={1.5} />;
}
