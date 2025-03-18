/**
 * Service for managing data operations
 */
import { DataItem, CreateDataInput, UpdateDataInput } from '@/types/data';

// Simulate a database with an in-memory array
// In a real application, this would connect to a database
let dataStore: DataItem[] = [];

/**
 * Create a new data item
 * @param data The data to create
 * @returns The created data item
 */
export async function createData(data: CreateDataInput): Promise<DataItem> {
  const timestamp = new Date().toISOString();
  const newItem: DataItem = {
    ...data,
    id: generateId(),
    createdAt: timestamp,
    updatedAt: timestamp
  };
  
  dataStore.push(newItem);
  return newItem;
}

/**
 * Get all data items
 * @returns Array of all data items
 */
export async function getAllData(): Promise<DataItem[]> {
  return [...dataStore];
}

/**
 * Get a data item by ID
 * @param id The ID of the data item to retrieve
 * @returns The data item or null if not found
 */
export async function getDataById(id: string): Promise<DataItem | null> {
  const item = dataStore.find(item => item.id === id);
  return item || null;
}

/**
 * Update a data item
 * @param id The ID of the data item to update
 * @param data The updated data
 * @returns The updated data item or null if not found
 */
export async function updateData(
  id: string, 
  data: UpdateDataInput
): Promise<DataItem | null> {
  const index = dataStore.findIndex(item => item.id === id);
  if (index === -1) return null;
  
  const updatedItem: DataItem = {
    ...dataStore[index],
    ...data,
    updatedAt: new Date().toISOString()
  };
  
  dataStore[index] = updatedItem;
  return updatedItem;
}

/**
 * Delete a data item
 * @param id The ID of the data item to delete
 * @returns Boolean indicating success
 */
export async function deleteData(id: string): Promise<boolean> {
  const initialLength = dataStore.length;
  dataStore = dataStore.filter(item => item.id !== id);
  return dataStore.length < initialLength;
}

/**
 * Helper function to generate a simple ID
 * In production, use a proper ID generation library or database-provided IDs
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
} 