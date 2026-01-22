import { AppConfig } from '@/types/config';
import { encodeConfig } from './configEncoding';

/**
 * Generates a shareable URL for the given configuration.
 * The URL includes the encoded config as a query parameter.
 *
 * @param config - The configuration to encode in the URL
 * @returns Complete shareable URL with encoded config
 */
export function generateShareableUrl(config: AppConfig): string {
  const encoded = encodeConfig(config);
  const url = new URL(window.location.href);
  url.searchParams.set('config', encoded);
  return url.toString();
}

/**
 * Copies the given URL to the clipboard.
 *
 * @param url - The URL to copy
 * @returns Promise that resolves when copy is complete
 */
export async function copyUrlToClipboard(url: string): Promise<void> {
  await navigator.clipboard.writeText(url);
}

/**
 * Extracts and counts the characters in the 'config' query parameter of a URL.
 * Useful for checking if URL length is within acceptable limits.
 *
 * @param url - The full URL string
 * @returns Length of the config parameter value, or 0 if not found
 */
export function getConfigParamLength(url: string): number {
  try {
    const urlObj = new URL(url);
    const configParam = urlObj.searchParams.get('config');
    return configParam ? configParam.length : 0;
  } catch {
    // If url is not valid, try to extract manually
    const match = url.match(/[?&]config=([^&]*)/);
    return match ? match[1].length : 0;
  }
}
