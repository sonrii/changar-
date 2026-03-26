/**
 * Firestore Utilities
 * 
 * Helper functions for working with Firestore documents.
 * Firestore does not accept undefined values in documents.
 */

/**
 * Remove undefined values from an object before writing to Firestore.
 * Firestore throws an error if you try to write undefined values.
 * 
 * @param obj - Object that may contain undefined values
 * @returns New object with undefined values removed
 */
export function removeUndefinedFields<T extends Record<string, any>>(obj: T): Partial<T> {
  const cleaned: any = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      cleaned[key] = value;
    }
  }
  
  return cleaned;
}

/**
 * Prepare data for Firestore write operations (setDoc, addDoc, updateDoc).
 * Removes undefined values and optionally converts empty strings to null.
 * 
 * @param data - Data object to sanitize
 * @param options - Configuration options
 * @returns Sanitized data safe for Firestore
 */
export function sanitizeForFirestore<T extends Record<string, any>>(
  data: T,
  options: { convertEmptyStringsToNull?: boolean } = {}
): Partial<T> {
  const cleaned: any = {};
  
  for (const [key, value] of Object.entries(data)) {
    // Skip undefined values entirely
    if (value === undefined) {
      continue;
    }
    
    // Optionally convert empty strings to null
    if (options.convertEmptyStringsToNull && value === '') {
      cleaned[key] = null;
      continue;
    }
    
    cleaned[key] = value;
  }
  
  return cleaned;
}
