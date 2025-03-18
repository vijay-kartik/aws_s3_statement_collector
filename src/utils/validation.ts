/**
 * Validates if all required fields are present in the provided data object
 * @param data The data object to validate
 * @param requiredFields Array of field names that are required
 * @returns An object with validation result and any missing fields
 */
export function validateRequiredFields(
  data: Record<string, unknown>,
  requiredFields: string[]
): { isValid: boolean; missingFields: string[] } {
  const missingFields = requiredFields.filter(field => {
    // Check if the field exists and is not null, undefined, or empty string
    const value = data[field];
    return value === undefined || value === null || value === '';
  });

  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}

/**
 * Validates if values match expected types
 * @param data The data object to validate
 * @param typeValidations Object mapping field names to validation functions
 * @returns An object with validation result and any invalid fields
 */
export function validateFieldTypes(
  data: Record<string, unknown>,
  typeValidations: Record<string, (value: unknown) => boolean>
): { isValid: boolean; invalidFields: string[] } {
  const invalidFields = Object.entries(typeValidations)
    .filter(([field, validationFn]) => {
      // Skip fields that don't exist in the data
      if (data[field] === undefined) return false;
      // Return true if validation fails
      return !validationFn(data[field]);
    })
    .map(([field]) => field);

  return {
    isValid: invalidFields.length === 0,
    invalidFields
  };
}

// Common validation functions
export const validators = {
  isString: (value: unknown): boolean => typeof value === 'string',
  isNumber: (value: unknown): boolean => typeof value === 'number' && !isNaN(value),
  isBoolean: (value: unknown): boolean => typeof value === 'boolean',
  isDate: (value: unknown): boolean => value instanceof Date && !isNaN(value.getTime()),
  isArray: (value: unknown): boolean => Array.isArray(value),
  isEmail: (value: unknown): boolean => {
    if (typeof value !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },
  isUrl: (value: unknown): boolean => {
    if (typeof value !== 'string') return false;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }
}; 