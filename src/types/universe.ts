import { TrackingMetadata } from './tracking';

export interface UniverseSettings {
  defaultCurrency: string;
  defaultLanguage: string;
  timezone: string;
}

export interface Universe extends TrackingMetadata {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  settings: UniverseSettings;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface UniverseContext {
  universe: Universe | null;
  createUniverse: (adminId: string) => Promise<Universe>;
  updateUniverse: (updates: Partial<Universe>) => Promise<void>;
}