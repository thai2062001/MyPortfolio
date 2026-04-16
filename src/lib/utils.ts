import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatUrl = (url: string): string => {
  if (!url) return "#";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `https://${url}`;
};

export const getImageUrlWithFallback = (url: string): string => {
  if (!url) return '/placeholder.svg';
  if (url.includes('cloudinary.com')) {
    return url.replace('http://', 'https://');
  }
  return url;
};

/**
 * Image utility functions
 */

export const isImageUrlValid = async (url: string): Promise<boolean> => {
  if (!url) return false;
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
};

export const getImageDimensions = (url: string): Promise<{ width: number; height: number } | null> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = () => resolve(null);
    img.src = url;
  });
};

export const validateImageFile = (
  file: File,
  options: { maxSize?: number; allowedTypes?: string[] } = {}
): { valid: boolean; error?: string } => {
  const { maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'] } = options;
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}` };
  }
  if (file.size > maxSize) {
    return { valid: false, error: `File size exceeds ${maxSize / 1024 / 1024}MB limit` };
  }
  return { valid: true };
};
