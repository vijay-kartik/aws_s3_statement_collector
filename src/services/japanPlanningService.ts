import { PlanningIdea } from '@/types/japan-planning';
import { MOCK_PLANNING_IDEAS } from './instagramService';

/**
 * Service for managing Japan planning ideas
 */

// Helper to check if we're on client side
const isClient = typeof window !== 'undefined';

// Local cache for ideas to avoid unnecessary DB calls
let cachedIdeas: PlanningIdea[] | null = null;

// IndexedDB setup
const DB_NAME = 'japan-planning';
const DB_VERSION = 1;
const STORE_NAME = 'planning-ideas';

/**
 * Initialize IndexedDB
 */
async function initDB() {
  if (!isClient) return null;

  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      console.error('IndexedDB error:', event);
      reject(new Error('Failed to open IndexedDB'));
    };
  });
}

/**
 * Get all planning ideas from IndexedDB
 * @returns Promise with array of planning ideas
 */
async function getIdeasFromDB(): Promise<PlanningIdea[]> {
  if (!isClient) return [];

  try {
    const db = await initDB();
    if (!db) return [];

    return new Promise<PlanningIdea[]>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error('Failed to get ideas from IndexedDB'));
      };
    });
  } catch (error) {
    console.error('Error getting ideas from IndexedDB:', error);
    return [];
  }
}

/**
 * Save planning ideas to IndexedDB
 * @param ideas Array of planning ideas to save
 */
async function saveIdeasToDB(ideas: PlanningIdea[]): Promise<void> {
  if (!isClient) return;

  try {
    const db = await initDB();
    if (!db) return;

    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    // Clear existing items
    store.clear();

    // Add new items
    ideas.forEach(idea => {
      store.add(idea);
    });

    // Update cache
    cachedIdeas = [...ideas];
  } catch (error) {
    console.error('Error saving ideas to IndexedDB:', error);
  }
}

/**
 * Get all planning ideas
 * @returns Array of planning ideas
 */
export async function getAllPlanningIdeas(): Promise<PlanningIdea[]> {
  // If we have cached ideas, return them
  if (cachedIdeas) return [...cachedIdeas];
  
  try {
    // Try to get ideas from IndexedDB
    const ideas = await getIdeasFromDB();
    
    // If we have ideas in IndexedDB, use those
    if (ideas.length > 0) {
      cachedIdeas = ideas;
      return [...ideas];
    }
    
    // If no ideas in IndexedDB, use mock data and save to IndexedDB
    cachedIdeas = [...MOCK_PLANNING_IDEAS];
    await saveIdeasToDB(cachedIdeas);
    return [...cachedIdeas];
  } catch (error) {
    console.error('Error getting all planning ideas:', error);
    return [...MOCK_PLANNING_IDEAS];
  }
}

/**
 * Get planning ideas filtered by category
 * @param category The category to filter by
 * @returns Filtered planning ideas
 */
export async function getPlanningIdeasByCategory(category: string): Promise<PlanningIdea[]> {
  if (category.toLowerCase() === 'all') {
    return getAllPlanningIdeas();
  }
  
  const ideas = await getAllPlanningIdeas();
  return ideas.filter(idea => 
    idea.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Get planning ideas filtered by location
 * @param location The location to filter by
 * @returns Filtered planning ideas
 */
export async function getPlanningIdeasByLocation(location: string): Promise<PlanningIdea[]> {
  const ideas = await getAllPlanningIdeas();
  return ideas.filter(idea => 
    idea.location.toLowerCase().includes(location.toLowerCase())
  );
}

/**
 * Add a new planning idea
 * @param idea The planning idea to add (without ID and createdAt)
 * @returns The added planning idea
 */
export async function addPlanningIdea(
  idea: Omit<PlanningIdea, 'id' | 'createdAt'>
): Promise<PlanningIdea> {
  const newIdea: PlanningIdea = {
    ...idea,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  
  try {
    // Get current ideas
    const ideas = await getAllPlanningIdeas();
    
    // Add new idea
    const updatedIdeas = [...ideas, newIdea];
    
    // Save to IndexedDB
    await saveIdeasToDB(updatedIdeas);
    
    // Update cache
    cachedIdeas = updatedIdeas;
    
    return newIdea;
  } catch (error) {
    console.error('Error adding planning idea:', error);
    throw new Error('Failed to add planning idea');
  }
}

/**
 * Delete a planning idea
 * @param id The ID of the planning idea to delete
 * @returns Boolean indicating success
 */
export async function deletePlanningIdea(id: string): Promise<boolean> {
  try {
    // Get current ideas
    const ideas = await getAllPlanningIdeas();
    
    // Filter out the idea to delete
    const updatedIdeas = ideas.filter(idea => idea.id !== id);
    
    // If no change, return false
    if (updatedIdeas.length === ideas.length) {
      return false;
    }
    
    // Save to IndexedDB
    await saveIdeasToDB(updatedIdeas);
    
    // Update cache
    cachedIdeas = updatedIdeas;
    
    return true;
  } catch (error) {
    console.error('Error deleting planning idea:', error);
    return false;
  }
} 