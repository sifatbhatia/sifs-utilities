
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;
const ALLOWED_INPUT_TYPES = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/tiff',
]);
const OUTPUT_CONTENT_TYPES = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    avif: 'image/avif',
    tiff: 'image/tiff',
} as const;
type OutputFormat = keyof typeof OUTPUT_CONTENT_TYPES;

function isOutputFormat(value: string): value is OutputFormat {
    return value in OUTPUT_CONTENT_TYPES;
}

function parseQuality(value: FormDataEntryValue | null) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return 80;
    return Math.min(100, Math.max(1, Math.round(parsed)));
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');
        const formatValue = formData.get('format');

        if (!(file instanceof Blob) || typeof formatValue !== 'string') {
            return NextResponse.json({ error: 'Missing file or format' }, { status: 400 });
        }

        const format = formatValue.toLowerCase();
        if (!isOutputFormat(format)) {
            return NextResponse.json({ error: 'Unsupported format' }, { status: 400 });
        }

        if (file.size > MAX_FILE_SIZE_BYTES) {
            return NextResponse.json({ error: 'File is too large' }, { status: 413 });
        }

        if (!ALLOWED_INPUT_TYPES.has(file.type)) {
            return NextResponse.json({ error: 'Unsupported input type' }, { status: 415 });
        }

        const quality = parseQuality(formData.get('quality'));
        const buffer = Buffer.from(await file.arrayBuffer());

        let pipeline = sharp(buffer);

        // Apply format-specific compression
        switch (format) {
            case 'jpeg':
            case 'jpg':
                pipeline = pipeline.jpeg({ quality, mozjpeg: true });
                break;
            case 'png':
                pipeline = pipeline.png({ quality, compressionLevel: 9 });
                break;
            case 'webp':
                pipeline = pipeline.webp({ quality });
                break;
            case 'avif':
                pipeline = pipeline.avif({ quality, effort: 4 }); // effort 4 is a good balance
                break;
            case 'tiff':
                pipeline = pipeline.tiff({ quality });
                break;
        }

        const processedBuffer = await pipeline.toBuffer();

        return new NextResponse(new Uint8Array(processedBuffer), {
            headers: {
                'Content-Type': OUTPUT_CONTENT_TYPES[format],
                'Content-Disposition': `attachment; filename="image.${format}"`,
            },
        });

    } catch (error) {
        console.error('Conversion error:', error);
        return NextResponse.json({ error: 'Conversion failed' }, { status: 500 });
    }
}
