import pako from 'pako';
import { AppConfig } from '@/types/config';

/**
 * Encodes an AppConfig object into a URL-safe compressed string.
 * Uses pako deflate compression and base64 encoding.
 *
 * @param config - The configuration object to encode
 * @returns URL-safe base64 encoded string
 */
export function encodeConfig(config: AppConfig): string {
  const jsonStr = JSON.stringify(config);
  const compressed = pako.deflate(jsonStr);
  const base64 = btoa(String.fromCharCode(...compressed));
  // URL-safe base64
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Decodes a URL-safe compressed string back into an AppConfig object.
 * Reverses the encoding process: base64 decode then pako inflate.
 *
 * @param encoded - The URL-safe base64 encoded string
 * @returns Decoded AppConfig object, or null if decoding fails
 */
export function decodeConfig(encoded: string): AppConfig | null {
  try {
    // Restore standard base64
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';

    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const decompressed = pako.inflate(bytes, { to: 'string' });
    return JSON.parse(decompressed);
  } catch {
    return null;
  }
}
