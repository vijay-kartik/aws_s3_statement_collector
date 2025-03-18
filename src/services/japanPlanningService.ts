import { PlanningIdea } from '@/types/japan-planning';
import { getReelEmbed, MOCK_PLANNING_IDEAS } from './instagramService';

/**
 * Service for managing Japan planning ideas
 */

/**
 * Get all planning ideas with embedded reels
 * @returns Array of planning ideas with reel embeds
 */
export async function getAllPlanningIdeas(): Promise<(PlanningIdea & { reelEmbed: string })[]> {
  try {
    // In a real application, this would fetch data from an API or database
    const ideas = [...MOCK_PLANNING_IDEAS];
    
    // Fetch embed HTML for each idea's reel
    const ideasWithEmbeds = await Promise.all(
      ideas.map(async (idea) => {
        try {
          const embedResponse = await getReelEmbed(idea.reelUrl);
          return {
            ...idea,
            reelEmbed: embedResponse.html
          };
        } catch (error) {
          console.error(`Failed to get embed for reel ${idea.reelUrl}:`, error);
          return {
            ...idea,
            reelEmbed: `<div class="error-embed">Failed to load Instagram reel</div>`
          };
        }
      })
    );
    
    return ideasWithEmbeds;
  } catch (error) {
    console.error('Error fetching planning ideas:', error);
    return [];
  }
}

/**
 * Get planning ideas filtered by category
 * @param category The category to filter by
 * @returns Filtered planning ideas with reel embeds
 */
export async function getPlanningIdeasByCategory(
  category: string
): Promise<(PlanningIdea & { reelEmbed: string })[]> {
  const allIdeas = await getAllPlanningIdeas();
  return allIdeas.filter(idea => idea.category.toLowerCase() === category.toLowerCase());
}

/**
 * Get planning ideas filtered by location
 * @param location The location to filter by
 * @returns Filtered planning ideas with reel embeds
 */
export async function getPlanningIdeasByLocation(
  location: string
): Promise<(PlanningIdea & { reelEmbed: string })[]> {
  const allIdeas = await getAllPlanningIdeas();
  return allIdeas.filter(idea => 
    idea.location.toLowerCase().includes(location.toLowerCase())
  );
}

/**
 * Add a new planning idea
 * @param idea The planning idea to add (without ID and createdAt)
 * @returns The added planning idea with reel embed
 */
export async function addPlanningIdea(
  idea: Omit<PlanningIdea, 'id' | 'createdAt' | 'reelEmbed'>
): Promise<PlanningIdea & { reelEmbed: string }> {
  try {
    // In a real application, this would save to a database
    const embedResponse = await getReelEmbed(idea.reelUrl);
    
    const newIdea: PlanningIdea & { reelEmbed: string } = {
      ...idea,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      reelEmbed: embedResponse.html
    };
    
    // In a real application, we would add this to the database
    // For this mock service, we'll just return the new idea
    
    return newIdea;
  } catch (error) {
    console.error('Error adding planning idea:', error);
    throw new Error(`Failed to add planning idea: ${(error as Error).message}`);
  }
} 