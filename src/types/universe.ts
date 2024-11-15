import { TrackingMetadata } from './tracking';

export interface Universe extends TrackingMetadata {
  name: string;
  adminId: string;
  description?: string;
  settings?: {
    defaultCurrency?: string;
    defaultLanguage?: string;
    timezone?: string;
  };
}

export interface UniverseContext {
  universe: Universe | null;
  createUniverse: (adminId: string) => Promise<Universe>;
  updateUniverse: (updates: Partial<Universe>) => Promise<void>;
}