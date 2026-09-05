export function validateFileExtension(filename: string, allowed: string[]): boolean {
  const ext = filename.split('.').pop()?.toLowerCase();
  return ext ? allowed.includes(ext) : false;
}

export function validateMimeType(mimetype: string, allowed: string[]): boolean {
  return allowed.includes(mimetype);
}

export function validateFileSize(size: number, maxSize: number): boolean {
  return size <= maxSize;
}

export function validateFileMagicBytes(buffer: Buffer): { valid: boolean; detectedType: string | null } {
  // PDF: %PDF (0x25504446)
  if (buffer.length >= 4 && buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) {
    return { valid: true, detectedType: 'pdf' };
  }
  // PPTX/ZIP: PK\x03\x04 (0x504B0304)
  if (buffer.length >= 4 && buffer[0] === 0x50 && buffer[1] === 0x4B && buffer[2] === 0x03 && buffer[3] === 0x04) {
    return { valid: true, detectedType: 'pptx' };
  }
  return { valid: false, detectedType: null };
}

export function sanitizeFilename(filename: string): string {
  const name = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  return name.length > 100 ? name.substring(name.length - 100) : name;
}

export function getAllowedMimeTypes(): string[] {
  return ['application/pdf', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
}
