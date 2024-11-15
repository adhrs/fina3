/**
 * Base interface for tracking metadata
 * Used to track creation, updates, and versioning of entities
 */
export interface TrackingMetadata {
  // Unique identifier
  id: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;

  // Version tracking
  version: number;

  // Optional audit fields
  createdBy?: string;
  updatedBy?: string;
}

/**
 * Helper function to initialize tracking metadata
 */
export const initializeTracking = (id: string, userId?: string): TrackingMetadata => {
  const now = new Date().toISOString();
  return {
    id,
    createdAt: now,
    updatedAt: now,
    version: 1,
    createdBy: userId,
    updatedBy: userId
  };
};

/**
 * Helper function to update tracking metadata
 */
export const updateTracking = (
  tracking: TrackingMetadata,
  userId?: string
): TrackingMetadata => {
  return {
    ...tracking,
    updatedAt: new Date().toISOString(),
    version: tracking.version + 1,
    updatedBy: userId
  };
};