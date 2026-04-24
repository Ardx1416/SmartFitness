/**
 * QR code generation utility.
 * Uses the QR Server API (https://goqr.me/api/) to generate reliable,
 * scannable QR codes as image URLs — no client-side encoding bugs.
 */

/**
 * Returns a URL that resolves to a QR code PNG image for the given text.
 * The image can be used in <img> src or downloaded directly.
 *
 * @param text  The text / URL to encode
 * @param size  Pixel dimensions of the square image (default 240)
 */
export function getQRCodeImageUrl(text: string, size = 240): string {
  const encoded = encodeURIComponent(text);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&format=png&ecc=M&margin=2`;
}

/**
 * @deprecated Use getQRCodeImageUrl instead.
 * Kept for backward-compat — returns a dummy 1×1 matrix so nothing crashes
 * if old callers are still around.
 */
export function generateQRMatrix(_text: string): boolean[][] {
  return [[true]];
}
