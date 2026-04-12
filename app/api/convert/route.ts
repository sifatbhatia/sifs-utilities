
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as Blob;
        const format = formData.get('format') as string;
        const quality = parseInt(formData.get('quality') as string);

        if (!file || !format) {
            return NextResponse.json({ error: 'Missing file or format' }, { status: 400 });
        }

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
            default:
                return NextResponse.json({ error: 'Unsupported format' }, { status: 400 });
        }

        const processedBuffer = await pipeline.toBuffer();

        return new NextResponse(new Uint8Array(processedBuffer), {
            headers: {
                'Content-Type': `image/${format}`,
                'Content-Disposition': `attachment; filename="image.${format}"`,
            },
        });

    } catch (error) {
        console.error('Conversion error:', error);
        return NextResponse.json({ error: 'Conversion failed' }, { status: 500 });
    }
}
