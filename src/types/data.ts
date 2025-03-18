/**
 * Data model types for the statement collector application
 */

/**
 * Represents a data item in the system
 */
export interface DataItem {
  /** Unique identifier for the data item */
  id: string;
  
  /** Title of the data item */
  title: string;
  
  /** Detailed description of the data item */
  description: string;
  
  /** Category the data item belongs to */
  category: string;
  
  /** Optional tags for additional categorization */
  tags?: string[];
  
  /** Optional email associated with the data item */
  email?: string;
  
  /** Optional URL related to the data item */
  url?: string;
  
  /** Optional numeric amount (e.g., for financial statements) */
  amount?: number;
  
  /** Timestamp when the data item was created */
  createdAt: string;
  
  /** Timestamp when the data item was last updated */
  updatedAt: string;
}

/**
 * Input type for creating a new data item
 * Omits generated fields like id and timestamps
 */
export type CreateDataInput = Omit<DataItem, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Input type for updating an existing data item
 * Makes all fields optional and omits fields that shouldn't be updated directly
 */
export type UpdateDataInput = Partial<Omit<DataItem, 'id' | 'createdAt' | 'updatedAt'>>;

/**
 * Response structure for data-related API endpoints
 */
export interface DataResponse<T> {
  /** Status of the response: success or error */
  status: 'success' | 'error';
  
  /** Optional message providing additional context */
  message?: string;
  
  /** The data payload (only present on successful responses) */
  data?: T;
  
  /** Error details (only present on error responses) */
  error?: {
    /** Error message */
    message: string;
    
    /** Optional detailed information about the error */
    details?: any;
  };
} 