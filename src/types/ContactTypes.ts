import { TrackingMetadata } from './tracking';

export interface Contact extends TrackingMetadata {
  id: string;
  name: string;
  categories: string[];
  relations: {
    type: string;
    id: string;
    name: string;
  }[];
  role: string;
  createdAt: string;
  updatedAt: string;
}