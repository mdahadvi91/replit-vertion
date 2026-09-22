import { createSafeOutputName } from '@/lib/safe-file-name';
import { validateImageFile, type SupportedImageFormat } from '@/lib/image-validation';

export const compressionProfiles = {
  light: { label: 'Light touch', quality: 0.9 },
  balanced: { label: 'Balanced', quality: 0.76 },
  small: { label: 'Smallest file', quality: 0.55 },
} as const;

export type CompressionProfile = keyof typeof compressionProfiles;

type ImageSource = {
  source: CanvasImageSource;
  width: number;
  height: number;
  close?: () => void;
  revoke?: () => void;
};

async function loadImageSource(file: File): Promise<ImageSource> {
  if ('createImageBitmap' in window) {
    const bitmap = await createImageBitmap(file);
    return { source: bitmap, width: bitmap.width, height: bitmap.height, close: () => bitmap.close() };
  }

  const objectUrl = URL.createObjectURL(file);
  const image = new Image();
  try {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('Your browser could not read this image.'));
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

function outputMime(format: SupportedImageFormat) {
  return format === 'jpg' ? 'image/jpeg' : `image/${format}`;
}

export async function compressImage(file: File, profile: CompressionProfile) {
  const { format } = validateImageFile(file);
  const image = await loadImageSource(file);
  const canvas = document.createElement('canvas');

  try {
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Your browser could not create an image canvas.');
    context.drawImage(image.source, 0, 0);

    const mime = outputMime(format);
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => (result ? resolve(result) : reject(new Error('The image could not be exported.'))),
        mime,
        compressionProfiles[profile].quality,
      );
    });

    return {
      blob,
      mime,
      fileName: createSafeOutputName(file.name, format),
    };
  } finally {
    image.close?.();
    image.revoke?.();
  }
}