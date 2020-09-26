import { SceneConfig } from 'src/app-engine/scene/common/scene-config';

export interface AppConfig {
  language: LanguageConfig;
  analytics: AnalyticsConfig;
  database: DatabaseConfig;
}

export interface LanguageConfig {
  useBrowserLangAsDefault?: boolean;
  default?: string;
  useOnly?: string;
}

export interface AnalyticsConfig {
  GA_key: string;
}

export interface DatabaseConfig {
  name: string;
  version: number;
}

export interface SceneConfigOptions {
  sceneConfig?: SceneConfig | string;
  localStorageKey?: string;
}
