/**
 * Normalize Google Drive and direct image URLs for public display.
 * Supported examples:
 *   https://drive.google.com/file/d/FILE_ID/view
 *   https://drive.google.com/open?id=FILE_ID
 *   https://lh3.googleusercontent.com/d/FILE_ID
 */
export function normalizeImageUrl(input: string): string {
  const value = String(input || '').trim();
  if (!value) return '';

  const lh = value.match(/lh3\.googleusercontent\.com\/d\/([^/?#]+)/i);
  if (lh?.[1]) return `https://lh3.googleusercontent.com/d/${lh[1]}`;

  const file = value.match(/drive\.google\.com\/file\/d\/([^/?#]+)/i);
  if (file?.[1]) return `https://lh3.googleusercontent.com/d/${file[1]}`;

  const open = value.match(/[?&]id=([^&#]+)/i);
  if (/drive\.google\.com/i.test(value) && open?.[1]) {
    return `https://lh3.googleusercontent.com/d/${open[1]}`;
  }

  const uc = value.match(/drive\.google\.com\/uc\?(?:export=view&)?id=([^&#]+)/i);
  if (uc?.[1]) return `https://lh3.googleusercontent.com/d/${uc[1]}`;

  return value;
}

export function normalizeImageList(value: string): string[] {
  return String(value || '')
    .split(/[,\n]+/)
    .map(normalizeImageUrl)
    .filter(Boolean);
}
