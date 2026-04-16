import { MediaAsset, AssetType } from "@/types/media";

// Convert image to WebP format
export const convertToWebP = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    // If already webp or not an image, return as is
    if (file.type === "image/webp") return resolve(file);
    if (!file.type.startsWith("image/")) return resolve(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const webpFile = new File(
                [blob],
                file.name.replace(/\.[^/.]+$/, "") + ".webp",
                {
                  type: "image/webp",
                  lastModified: Date.now(),
                },
              );
              resolve(webpFile);
            } else {
              reject(new Error("Failed to convert to WebP"));
            }
          },
          "image/webp",
          0.8,
        );
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};

// Standardized Media Upload for Media Library
export const uploadMedia = async (
  file: File,
  options: { 
    folder?: string; 
    isIcon?: boolean;
  } = {}
): Promise<Partial<MediaAsset>> => {
  try {
    const isSVG = file.type === "image/svg+xml";
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    
    // Convert images (except SVG) to WebP for optimization
    const fileToUpload = (isImage && !isSVG) ? await convertToWebP(file) : file;

    const formData = new FormData();
    formData.append("file", fileToUpload);
    formData.append("upload_preset", "portfolio_upload");
    if (options.folder) formData.append("folder", options.folder);

    // Resource type must be 'auto', 'image', 'video' or 'raw'
    const resourceType = isVideo ? "video" : (isSVG || !isImage ? "auto" : "image");
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Upload failed");
    }

    const data = await response.json();

    // Determine asset type
    let assetType: AssetType = 'image';
    if (isSVG) assetType = 'svg';
    else if (options.isIcon) assetType = 'icon';
    else if (isVideo) assetType = 'video';
    else if (!isImage) assetType = 'other';

    return {
      file_name: data.original_filename + "." + data.format,
      original_file_name: data.original_filename,
      file_extension: data.format,
      mime_type: file.type,
      asset_type: assetType,
      provider: 'cloudinary',
      public_id: data.public_id,
      url: data.url,
      secure_url: data.secure_url,
      width: data.width || null,
      height: data.height || null,
      file_size: data.bytes || file.size,
      is_svg: isSVG,
      is_icon: options.isIcon || false,
    };
  } catch (error) {
    console.error("Error in uploadMedia:", error);
    throw error;
  }
};

// Advanced Upload to Cloudinary returning both URL and public_id (Legacy Support)
export const uploadImageToCloudinary = async (
  file: File,
  folder: string = "portfolio",
): Promise<{ url: string; public_id: string }> => {
  const result = await uploadMedia(file, { folder });
  return {
    url: result.secure_url!,
    public_id: result.public_id!,
  };
};

// Upload to Cloudinary using unsigned upload preset (Legacy Support)
export const uploadToCloudinary = async (file: File): Promise<string> => {
  const result = await uploadMedia(file);
  return result.secure_url!;
};

// Upload video to Cloudinary (Legacy Support)
export const uploadVideoToCloudinary = async (
    file: File,
    folder: string = "portfolio/testimonials/videos"
): Promise<string> => {
    const result = await uploadMedia(file, { folder });
    return result.secure_url!;
};

// Helper function to optimize Cloudinary URLs on the fly
export const optimizeCloudinary = (
  url: string | null | undefined, 
  options: { 
    quality?: 'auto' | 'best' | 'low';
    width?: number;
    height?: number;
    crop?: string;
  } = {}
): string => {
  const { quality = 'auto', width, height, crop = 'fit' } = options;
  if (!url || typeof url !== "string") return url || "";
  
  // Only optimize Cloudinary URLs
  if (!url.includes("res.cloudinary.com")) return url;
  
  // Check for common transformation keywords to avoid double-optimization
  if (url.includes("/upload/w_") || url.includes("/upload/q_") || url.includes("/upload/f_") || 
      url.includes("/video/upload/w_") || url.includes("/video/upload/q_") || url.includes("/video/upload/f_")) {
    return url;
  }
  
  const qScale = quality === 'best' ? 'q_auto:best' : (quality === 'low' ? 'q_auto:low' : 'q_auto');
  const wScale = width ? `w_${width},` : '';
  const hScale = height ? `h_${height},` : '';
  const cScale = (width || height) ? `c_${crop},` : '';
  
  // Handle both standard images and videos
  if (url.includes("/video/upload/")) {
    // For background videos, we want aggressive compression and limited resolution
    const videoTransformations = [
      width ? `w_${width}` : 'w_1280', // Cap at 720p for background
      height ? `h_${height}` : '',
      `br_1500k`,                     // Bitrate limit to reduce file size
      `q_auto:eco`,                   // Economy quality for background
      `vc_auto`,                      // Auto video codec
      `f_auto`                        // Auto format (mp4/webm)
    ].filter(Boolean).join(',');

    // Check if the URL already has transformations
    const uploadIndex = url.indexOf("/video/upload/");
    const base = url.substring(0, uploadIndex + 14);
    const rest = url.substring(uploadIndex + 14);
    
    // If it already has transformations (contains two slashes after upload/), skip to avoid double-optimization
    if (rest.indexOf("/") > rest.indexOf(".") && rest.indexOf("/") !== -1) {
      return url;
    }

    return `${base}${videoTransformations}/${rest}`;
  }
  
  if (url.includes("/upload/")) {
    return url.replace("/upload/", `/upload/${wScale}${hScale}${cScale}dpr_auto,${qScale},f_auto/`);
  }
  
  return url;
};
