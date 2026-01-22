import { AppConfig, createDefaultConfig } from '@/types/config';

const STORAGE_KEY = 'algolia-compare-configs';
const ACTIVE_CONFIG_KEY = 'algolia-compare-active';

/**
 * Loads all configurations from localStorage.
 * If no configs are found or loading fails, returns a default config.
 *
 * @returns Array of AppConfig objects
 */
export function loadConfigsFromStorage(): AppConfig[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    console.error('Failed to load configs from storage');
  }
  return [createDefaultConfig()];
}

/**
 * Saves all configurations to localStorage.
 *
 * @param configs - Array of AppConfig objects to save
 */
export function saveConfigsToStorage(configs: AppConfig[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
}

/**
 * Loads the active configuration ID from localStorage.
 *
 * @returns The active config ID, or null if not found
 */
export function loadActiveIdFromStorage(): string | null {
  return localStorage.getItem(ACTIVE_CONFIG_KEY);
}

/**
 * Saves the active configuration ID to localStorage.
 *
 * @param configId - The ID of the active configuration
 */
export function saveActiveIdToStorage(configId: string): void {
  localStorage.setItem(ACTIVE_CONFIG_KEY, configId);
}

/**
 * Clears all configurations from localStorage.
 * Useful for testing or reset functionality.
 */
export function clearConfigsFromStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(ACTIVE_CONFIG_KEY);
}
