/**
 * Types related to Japan planning ideas
 */

/**
 * Represents a planning idea with Instagram reel
 */
export interface PlanningIdea {
  /** Unique identifier for the idea */
  id: string;
  
  /** Title of the planning idea */
  title: string;
  
  /** Detailed description of the place or experience */
  description: string;
  
  /** HTML embed code for the Instagram reel */
  reelEmbed: string;
  
  /** Location name */
  location: string;
  
  /** Category (e.g., Food, Nature, Shrine, etc.) */
  category: string;
  
  /** Optional tags for additional categorization */
  tags?: string[];
  
  /** Timestamp when the idea was added */
  createdAt: string;
} 