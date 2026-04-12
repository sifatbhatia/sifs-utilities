export const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });

export function getRadianAngle(degreeValue: number) {
    return (degreeValue * Math.PI) / 180;
}

export function rotateSize(width: number, height: number, rotation: number) {
    const rotRad = getRadianAngle(rotation);
    return {
        width:
            Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
        height:
            Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    };
}

export async function getCroppedImg(
    imageSrc: string,
    pixelCrop: { x: number; y: number; width: number; height: number },
    rotation = 0,
    flip = { horizontal: false, vertical: false },
    border = { width: 0, color: '#ffffff' }
): Promise<Blob | null> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return null;
    }

    const rotRad = getRadianAngle(rotation);

    // Calculate bounding box of the rotated image
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
        image.width,
        image.height,
        rotation
    );

    // Set canvas to the bounding box size
    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    // Translate canvas context to a central location to allow rotating and flipping around the center.
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    ctx.translate(-image.width / 2, -image.height / 2);

    // Draw rotated image
    ctx.drawImage(image, 0, 0);

    // Extract cropped image from the rotated canvas
    const data = ctx.getImageData(
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height
    );

    // Set canvas size to the final desired crop size
    // Include border in the output canvas size? Or draw within?
    // Let's add border *around* if we want, but typically getCroppedImg returns the crop itself.
    // However, CircleCrop tool likely wants the circular result with a border.
    // The previous implementation passed border config.

    // Create a new canvas for the final cropped (and potentially bordered) image
    // If border > 0, we need a larger canvas or draw border inside.
    // Let's assume we draw the border ON TOP of the cropped area for simplicity, or expand canvas.
    // Given it's a "profile picture" tool, usually borders are added.

    const finalCanvas = document.createElement('canvas');
    const borderW = border.width || 0;
    const size = Math.max(pixelCrop.width, pixelCrop.height);

    finalCanvas.width = size + borderW * 2;
    finalCanvas.height = size + borderW * 2;

    const finalCtx = finalCanvas.getContext('2d');
    if (!finalCtx) return null;

    // Draw the crop into the center of the final canvas
    finalCtx.putImageData(data, borderW, borderW);

    // Draw circular mask?
    // The previous code had `cropShape="round"` in the component, so the visual UI guide is round.
    // The output should likely be masked to circle if it's a circle cropper.

    // Create a circular clipping path
    finalCtx.globalCompositeOperation = 'destination-in';
    finalCtx.beginPath();
    finalCtx.arc(
        size / 2 + borderW,
        size / 2 + borderW,
        size / 2, // Radius
        0,
        2 * Math.PI
    );
    finalCtx.fill();

    // Reset composite operation to draw border
    finalCtx.globalCompositeOperation = 'source-over';

    if (borderW > 0) {
        finalCtx.beginPath();
        finalCtx.arc(
            size / 2 + borderW,
            size / 2 + borderW,
            size / 2 + borderW / 2, // Center of the border stroke
            0,
            2 * Math.PI
        );
        finalCtx.strokeStyle = border.color;
        finalCtx.lineWidth = borderW;
        finalCtx.stroke();
    }

    return new Promise((resolve) => {
        finalCanvas.toBlob((blob) => {
            resolve(blob);
        }, 'image/png');
    });
}
