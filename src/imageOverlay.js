// Image overlay utilities for creating composite images with text

/**
 * Creates a beautiful composite image with the captured photo and overlaid quote
 * This is what gets saved to the gallery
 */
export function createCompositeImage(imageDataUrl, quoteText, objectName = null) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            // Create canvas for composite
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Set canvas size to match image
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw the original image
            ctx.drawImage(img, 0, 0);

            // Add a subtle vignette overlay
            const gradient = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, 0,
                canvas.width / 2, canvas.height / 2, canvas.width * 0.7
            );
            gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Add darker gradient at bottom for text readability
            const textGradient = ctx.createLinearGradient(0, canvas.height * 0.5, 0, canvas.height);
            textGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
            textGradient.addColorStop(1, 'rgba(0, 0, 0, 0.75)');
            ctx.fillStyle = textGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Configure text styling
            const padding = 30;
            const maxWidth = canvas.width - (padding * 2);
            const lineHeight = 35;

            // Set font
            ctx.font = 'italic 24px "Crimson Text", Georgia, serif';
            ctx.fillStyle = '#f8fafc';
            ctx.textAlign = 'center';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 2;

            // Word wrap the quote
            const words = quoteText.split(' ');
            const lines = [];
            let currentLine = '';

            for (const word of words) {
                const testLine = currentLine + (currentLine ? ' ' : '') + word;
                const metrics = ctx.measureText(testLine);

                if (metrics.width > maxWidth && currentLine) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    currentLine = testLine;
                }
            }
            if (currentLine) {
                lines.push(currentLine);
            }

            // Calculate starting Y position to center text vertically in bottom half
            const textBlockHeight = lines.length * lineHeight;
            let currentY = canvas.height - padding - textBlockHeight;

            // Draw each line
            for (const line of lines) {
                ctx.fillText(line, canvas.width / 2, currentY);
                currentY += lineHeight;
            }

            // Add subtle branding
            ctx.font = '14px "Inter", sans-serif';
            ctx.fillStyle = 'rgba(248, 250, 252, 0.5)';
            ctx.shadowBlur = 4;
            ctx.fillText('Still — Pause & See', canvas.width / 2, canvas.height - 10);

            // Convert to data URL
            resolve(canvas.toDataURL('image/jpeg', 0.92));
        };

        img.src = imageDataUrl;
    });
}

/**
 * Download an image to the user's device
 */
export function downloadImage(dataUrl, filename = 'still-moment.jpg') {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
}
