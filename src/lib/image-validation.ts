export const MAX_IMAGE_SIZE_BYTES = 20 * 1024 * 1024;

export type SupportedImageFormat = 'jpg' | 'png' | 'webp';

const FORMAT_RULES: Record<SupportedImageFormat, { mime: string; extensions: string[] }> = {
  jpg: { mime: 'image/jpeg', extensions: ['.jpg', '.jpeg'] },
  png: { mime: 'image/png', extensions: ['.png'] },
  webp: { mime: 'image/webp', extensions: ['.webp'] },
};

export class ImageValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImageValidationError';
  }
}

export function getImageExtension(fileName: string) {
  const match = /\.([a-z0-9]+)$/i.exec(fileName.trim());
  return match ? `.${match[1].toLowerCase()}` : '';
}

export function validateImageFile(file: File) {
  const extension = getImageExtension(file.name);
  const rule = Object.entries(FORMAT_RULES).find(([, candidate]) =>
    candidate.extensions.includes(extension),
  );

  if (!rule) {
    throw new ImageValidationError('Please choose a JPG, PNG or WebP image with a matching file extension.');
  }

  const [format, formatRule] = rule as [SupportedImageFormat, (typeof FORMAT_RULES)[SupportedImageFormat]];
  if (file.type.toLowerCase() !== formatRule.mime) {
    throw new ImageValidationError(
      `This file extension does not match its detected type. Choose a valid ${format.toUpperCase()} image.`,
    );
  }

  if (file.size === 0) {
    throw new ImageValidationError('This image is empty. Choose a file with image data.');
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new ImageValidationError('This file is larger than the 20 MB limit.');
  }

  return { format, extension, mime: formatRule.mime };
}