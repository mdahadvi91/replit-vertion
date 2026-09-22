import { createSafeOutputName } from '@/lib/safe-file-name';
import { validateImageFile, type SupportedImageFormat } from '@/lib/image-validation';

export const compressionProfiles = {
  light: { label: 'High Quality', quality: 0.88, maxDimension: 3840 },
  balanced: { label: 'Balanced (Recommended)', quality: 0.75, maxDimension: 2560 },
  small: { label: 'Maximum Reduction', quality: 0.58, maxDimension: 1920 },
} as const;

export type CompressionProfile = keyof typeof compressionProfiles;

export interface CompressionOptions {
  profile: CompressionProfile;
  customQuality?: number; // 0.1 to 1.0
  convertToWebP?: boolean;
  maxWidth?: number;
  maxHeight?: number;
}

export interface CompressionStats {
  originalBytes: number;
  compressedBytes: number;
  originalWidth: number;
  originalHeight: number;
  outputWidth: number;
  outputHeight: number;
  ratioPercent: number; // e.g. 45% saved
  format: SupportedImageFormat;
  outputMime: string;
}

type ImageSource = {
  source: CanvasImageSource;
  width: number;
  height: number;
  close?: () => void;
  revoke?: () => void;
};

async function loadImageSource(file: File): Promise<ImageSource> {
  if ('createImageBitmap' in window) {
    try {
      const bitmap = await createImageBitmap(file);
      return { source: bitmap, width: bitmap.width, height: bitmap.height, close: () => bitmap.close() };
    } catch {
      // Fallback to Image element if createImageBitmap fails
    }
  }

  const objectUrl = URL.createObjectURL(file);
  const image = new Image();
  try {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('Your browser could not read this image file.'));
      image.src = objectUrl;
    });
    return {
      source: image,
      width: image.naturalWidth,
      height: image.naturalHeight,
      revoke: () => URL.revokeObjectURL(objectUrl),
    };
  } catch (error) {
    URL.revokeObjectURL(objectUrl);
    throw error;
  }
}

function calculateTargetDimensions(
  originalWidth: number,
  originalHeight: number,
  maxDimension: number,
  customMaxWidth?: number,
  customMaxHeight?: number,
) {
  let targetWidth = originalWidth;
  let targetHeight = originalHeight;

  const maxW = customMaxWidth ? Math.min(customMaxWidth, maxDimension) : maxDimension;
  const maxH = customMaxHeight ? Math.min(customMaxHeight, maxDimension) : maxDimension;

  if (targetWidth > maxW || targetHeight > maxH) {
    const ratio = Math.min(maxW / targetWidth, maxH / targetHeight);
    targetWidth = Math.max(1, Math.round(targetWidth * ratio));
    targetHeight = Math.max(1, Math.round(targetHeight * ratio));
  }

  return { targetWidth, targetHeight };
}

function getOutputMime(format: SupportedImageFormat, convertToWebP: boolean) {
  if (convertToWebP) return 'image/webp';
  return format === 'jpg' ? 'image/jpeg' : `image/${format}`;
}

export async function compressImage(
  file: File,
  optionsOrProfile: CompressionProfile | CompressionOptions = 'balanced',
) {
  const options: CompressionOptions =
    typeof optionsOrProfile === 'string'
      ? { profile: optionsOrProfile }
      : optionsOrProfile;

  const { profile = 'balanced', customQuality, convertToWebP = false, maxWidth, maxHeight } = options;
  const profileSettings = compressionProfiles[profile];

  const quality = customQuality !== undefined
    ? Math.max(0.1, Math.min(1.0, customQuality))
    : profileSettings.quality;

  const { format } = validateImageFile(file);
  const image = await loadImageSource(file);

  try {
    const { targetWidth, targetHeight } = calculateTargetDimensions(
      image.width,
      image.height,
      profileSettings.maxDimension,
      maxWidth,
      maxHeight,
    );

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const context = canvas.getContext('2d');
    if (!context) throw new Error('Your browser could not initialize an image processing canvas.');

    // Enable bicubic/high-quality image smoothing
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';

    // If converting transparent PNG to JPEG or WebP without transparency, fill white background if JPEG
    const mime = getOutputMime(format, convertToWebP);
    if (mime === 'image/jpeg') {
      context.fillStyle = '#FFFFFF';
      context.fillRect(0, 0, targetWidth, targetHeight);
    }

    context.drawImage(image.source, 0, 0, targetWidth, targetHeight);

    // Export blob with requested quality
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (result) {
            resolve(result);
          } else {
            reject(new Error('Failed to encode the compressed image.'));
          }
        },
        mime,
        quality,
      );
    });

    const outputFormat = convertToWebP ? 'webp' : format;
    const fileName = createSafeOutputName(file.name, outputFormat);

    const savedBytes = Math.max(0, file.size - blob.size);
    const ratioPercent = file.size > 0 ? Math.round((savedBytes / file.size) * 100) : 0;

    const stats: CompressionStats = {
      originalBytes: file.size,
      compressedBytes: blob.size,
      originalWidth: image.width,
      originalHeight: image.height,
      outputWidth: targetWidth,
      outputHeight: targetHeight,
      ratioPercent,
      format: outputFormat,
      outputMime: mime,
    };

    return {
      blob,
      mime,
      fileName,
      stats,
    };
  } finally {
    image.close?.();
    image.revoke?.();
  }
}
