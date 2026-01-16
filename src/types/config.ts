export interface CardMapping {
  image: string;
  imagePrefix: string;
  imageSuffix: string;
  title: string;
  subtitle: string;
  columns: number;
}

export interface SearchPanel {
  id: string;
  name: string;
  appId: string;
  apiKey: string;
  indexName: string;
  queryParams: Record<string, unknown>;
  cardMapping: CardMapping;
}

export interface AppConfig {
  id: string;
  name: string;
  queries: string[];
  panels: SearchPanel[];
}

export const DEFAULT_CARD_MAPPING: CardMapping = {
  image: 'image',
  imagePrefix: 'https://fxqklbpngldowtbkqezm.supabase.co/storage/v1/object/public/product-images/',
  imageSuffix: '',
  title: 'name',
  subtitle: 'brand',
  columns: 4
};

export const DEFAULT_PANEL: Omit<SearchPanel, 'id'> = {
  name: 'Panel',
  appId: 'Q6N17K5UHW',
  apiKey: 'e0ca15aae3bc4bbb2746bbabd890a4aa',
  indexName: 'ecommerce_ns_prod',
  queryParams: {},
  cardMapping: { ...DEFAULT_CARD_MAPPING },
};

export const DEFAULT_CONFIG: Omit<AppConfig, 'id'> = {
  name: 'Default Config',
  queries: ['shoes', 'running shoes', 'nike'],
  panels: [],
};

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function createDefaultPanel(): SearchPanel {
  return {
    ...DEFAULT_PANEL,
    id: generateId(),
    name: `Panel ${Date.now() % 1000}`,
  };
}

export function createDefaultConfig(): AppConfig {
  return {
    ...DEFAULT_CONFIG,
    id: generateId(),
    panels: [createDefaultPanel(), createDefaultPanel()],
  };
}
