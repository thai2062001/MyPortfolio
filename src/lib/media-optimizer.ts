/**
 * Media Optimization Utilities
 * Handles image compression, resizing, and optimization before upload
 */

export interface OptimizationOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp';
}

const DEFAULT_OPTIONS: OptimizationOptions = {
    maxWidth: 2400,
    maxHeight: 2400,
    quality: 0.85,
    format: 'jpeg'
};

/**
 * Compress and optimize an image file
 */
export const optimizeImage = async (
    file: File,
    options: OptimizationOptions = {}
): Promise<File> => {
    const opts = { ...DEFAULT_OPTIONS, ...options };

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                // Calculate new dimensions
                let { width, height } = img;
                const maxWidth = opts.maxWidth!;
                const maxHeight = opts.maxHeight!;

                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width = Math.floor(width * ratio);
                    height = Math.floor(height * ratio);
                }

                // Create canvas and draw resized image
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                }

                // Use better image smoothing
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to blob
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Failed to create blob'));
                            return;
                        }

                        // Create optimized file
                        const optimizedFile = new File(
                            [blob],
                            file.name.replace(/\.[^.]+$/, `.${opts.format}`),
                            { type: `image/${opts.format}` }
                        );

                        resolve(optimizedFile);
                    },
                    `image/${opts.format}`,
                    opts.quality
                );
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target?.result as string;
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
};

/**
 * Get image dimensions without loading full image
 */
export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => resolve({ width: img.width, height: img.height });
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target?.result as string;
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
};

/**
 * Format file size to human readable string
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Calculate compression ratio
 */
export const getCompressionRatio = (originalSize: number, compressedSize: number): number => {
    return Math.round(((originalSize - compressedSize) / originalSize) * 100);
};

/**
 * Check if file needs optimization
 */
export const needsOptimization = (file: File, maxSize: number = 2 * 1024 * 1024): boolean => {
    return file.size > maxSize;
};

/**
 * Validate image file
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];

    if (!validTypes.includes(file.type)) {
        return { valid: false, error: 'Invalid file type. Only JPEG, PNG, WebP, and SVG are allowed.' };
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        return { valid: false, error: 'File size exceeds 10MB limit.' };
    }

    return { valid: true };
};
