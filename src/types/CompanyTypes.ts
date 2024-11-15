import { BaseMetadata } from './BaseTypes';

export type CompanyType = 
  | 'Einzelunternehmen'
  | 'Personengesellschaft'
  | 'KG'
  | 'Kapitalgesellschaft'
  | 'Stiftungen';

export interface Company extends BaseMetadata {
  name: string;
  type: CompanyType;
  country: string;
  description?: string;
  foundedDate?: string;
  status: 'active' | 'inactive' | 'pending';
}