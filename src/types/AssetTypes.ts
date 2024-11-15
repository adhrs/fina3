import { BaseMetadata } from './BaseTypes';

export type AssetType = 
  | 'Real Estate'
  | 'Vehicle'
  | 'Investment'
  | 'Art'
  | 'Other';

export interface Asset extends BaseMetadata {
  name: string;
  type: AssetType;
  value: number;
  status: 'active' | 'inactive' | 'pending';
  purchaseDate?: string;
  description?: string;
  location?: string;
}