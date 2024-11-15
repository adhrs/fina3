import { BaseMetadata } from './BaseTypes';

export type ContactCategory = 
  | 'family'       // Family members
  | 'business'     // Business/company contacts
  | 'asset'        // Asset-related contacts
  | 'professional' // Lawyers, accountants, advisors
  | 'personal'     // Friends and other personal contacts
  | 'other';       // Miscellaneous

export interface ContactRelation {
  type: 'family' | 'company' | 'asset';
  id: string;
  name: string;
}

export interface Contact extends BaseMetadata {
  name: string;
  email?: string;
  phone?: string;
  categories: ContactCategory[];
  relations?: ContactRelation[];
  role?: string;
  company?: string;
  address?: string;
  notes?: string;
}