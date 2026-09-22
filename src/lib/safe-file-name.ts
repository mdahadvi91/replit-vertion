export function createSafeOutputName(fileName: string, extension: string) {
  const sourceBase = fileName.replace(/\.[^/.]+$/, '');
  const safeBase = sourceBase
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64)
    .toLowerCase();

  return `${safeBase || 'image'}-ahadex.${extension}`;
}