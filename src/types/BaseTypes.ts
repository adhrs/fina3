export interface BaseMetadata {
  id: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  createdBy?: string;
  updatedBy?: string;
}

export const initializeMetadata = (userId?: string): BaseMetadata => {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    version: 1,
    createdBy: userId,
    updatedBy: userId
  };
};

export const updateMetadata = (
  metadata: BaseMetadata,
  userId?: string
): BaseMetadata => {
  return {
    ...metadata,
    updatedAt: new Date().toISOString(),
    version: metadata.version + 1,
    updatedBy: userId
  };
};