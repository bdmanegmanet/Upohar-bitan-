/**
 * Normalize Google Drive and direct image URLs for public display.
 * Supported examples:
 *   https://drive.google.com/file/d/FILE_ID/view
 *   https://drive.google.com/open?id=FILE_ID
 *   https://lh3.googleusercontent.com/d/FILE_ID
 */
export function normalizeImageUrl(input: string): string {
  let value = String(input || '').trim().replace(/^['"]|['"]$/g, '');
  if (!value) return '';

  // Already lh3 format
  const lh = value.match(/lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/i);
  if (lh?.[1]) return `https://lh3.googleusercontent.com/d/${lh[1]}`;

  // drive.google.com/file/d/FILE_ID
  const file = value.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (file?.[1]) return `https://lh3.googleusercontent.com/d/${file[1]}`;

  // drive.google.com/open?id=FILE_ID or uc?id=FILE_ID or thumbnail?id=FILE_ID
  const driveIdParam = value.match(/drive\.google\.com\/[^?#]*[?&]id=([a-zA-Z0-9_-]+)/i);
  if (driveIdParam?.[1]) {
    return `https://lh3.googleusercontent.com/d/${driveIdParam[1]}`;
  }

  // docs.google.com/uc?id=FILE_ID
  const docsIdParam = value.match(/docs\.google\.com\/[^?#]*[?&]id=([a-zA-Z0-9_-]+)/i);
  if (docsIdParam?.[1]) {
    return `https://lh3.googleusercontent.com/d/${docsIdParam[1]}`;
  }

  // Raw Google Drive file ID (25-45 characters alphanumeric, -, _) without http
  if (!value.startsWith('http') && !value.startsWith('/') && !value.startsWith('data:') && !value.startsWith('blob:')) {
    if (/^[a-zA-Z0-9_-]{25,45}$/.test(value)) {
      return `https://lh3.googleusercontent.com/d/${value}`;
    }
  }

  return value;
}

export function normalizeImageList(value: string): string[] {
  return String(value || '')
    .split(/[,\n]+/)
    .map(normalizeImageUrl)
    .filter(Boolean);
}
