import { useState, useEffect, useCallback } from 'react';
import { AppConfig, createDefaultConfig, generateId } from '@/types/config';
import pako from 'pako';

const STORAGE_KEY = 'algolia-compare-configs';
const ACTIVE_CONFIG_KEY = 'algolia-compare-active';

function encodeConfig(config: AppConfig): string {
  const jsonStr = JSON.stringify(config);
  const compressed = pako.deflate(jsonStr);
  const base64 = btoa(String.fromCharCode(...compressed));
  // URL-safe base64
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeConfig(encoded: string): AppConfig | null {
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

function loadConfigsFromStorage(): AppConfig[] {
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

function loadActiveIdFromStorage(): string | null {
  return localStorage.getItem(ACTIVE_CONFIG_KEY);
}

export function useConfigStore() {
  const [configs, setConfigs] = useState<AppConfig[]>(() => loadConfigsFromStorage());
  const [activeConfigId, setActiveConfigId] = useState<string | null>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlConfig = urlParams.get('config');
    
    if (urlConfig) {
      const decoded = decodeConfig(urlConfig);
      if (decoded) {
        return decoded.id;
      }
    }
    
    return loadActiveIdFromStorage() || configs[0]?.id || null;
  });

  // Load config from URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlConfig = urlParams.get('config');
    
    if (urlConfig) {
      const decoded = decodeConfig(urlConfig);
      if (decoded) {
        setConfigs(prev => {
          const existingIndex = prev.findIndex(c => c.id === decoded.id);
          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = decoded;
            return updated;
          }
          return [...prev, decoded];
        });
        setActiveConfigId(decoded.id);
      }
    }
  }, []);

  // Save configs to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
  }, [configs]);

  // Save active config ID to localStorage
  useEffect(() => {
    if (activeConfigId) {
      localStorage.setItem(ACTIVE_CONFIG_KEY, activeConfigId);
    }
  }, [activeConfigId]);

  // Update URL when active config changes
  useEffect(() => {
    const activeConfig = configs.find(c => c.id === activeConfigId);
    if (activeConfig) {
      const encoded = encodeConfig(activeConfig);
      const url = new URL(window.location.href);
      url.searchParams.set('config', encoded);
      window.history.replaceState({}, '', url.toString());
    }
  }, [configs, activeConfigId]);

  const activeConfig = configs.find(c => c.id === activeConfigId) || configs[0];

  const updateConfig = useCallback((configId: string, updates: Partial<AppConfig>) => {
    setConfigs(prev => prev.map(c => 
      c.id === configId ? { ...c, ...updates } : c
    ));
  }, []);

  const updateActiveConfig = useCallback((updates: Partial<AppConfig>) => {
    if (activeConfigId) {
      updateConfig(activeConfigId, updates);
    }
  }, [activeConfigId, updateConfig]);

  const addConfig = useCallback((config?: Partial<AppConfig>) => {
    const newConfig: AppConfig = {
      ...createDefaultConfig(),
      ...config,
      id: generateId(),
    };
    setConfigs(prev => [...prev, newConfig]);
    setActiveConfigId(newConfig.id);
    return newConfig;
  }, []);

  const deleteConfig = useCallback((configId: string) => {
    setConfigs(prev => {
      const filtered = prev.filter(c => c.id !== configId);
      if (filtered.length === 0) {
        return [createDefaultConfig()];
      }
      return filtered;
    });
    if (activeConfigId === configId) {
      setActiveConfigId(configs.find(c => c.id !== configId)?.id || null);
    }
  }, [activeConfigId, configs]);

  const importConfig = useCallback((json: string) => {
    try {
      const parsed = JSON.parse(json);
      const newConfig: AppConfig = {
        ...parsed,
        id: generateId(),
      };
      setConfigs(prev => [...prev, newConfig]);
      setActiveConfigId(newConfig.id);
      return { success: true };
    } catch (e) {
      return { success: false, error: 'Invalid JSON' };
    }
  }, []);

  const getShareableUrl = useCallback(() => {
    if (activeConfig) {
      const encoded = encodeConfig(activeConfig);
      const url = new URL(window.location.href);
      url.searchParams.set('config', encoded);
      return url.toString();
    }
    return window.location.href;
  }, [activeConfig]);

  return {
    configs,
    activeConfig,
    activeConfigId,
    setActiveConfigId,
    updateConfig,
    updateActiveConfig,
    addConfig,
    deleteConfig,
    importConfig,
    getShareableUrl,
  };
}
