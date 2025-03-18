'use client';

import { useEffect, useState } from 'react';
import { PlanningIdea } from '@/types/japan-planning';
import PlanningIdeaCard from '@/components/ui/PlanningIdeaCard';

const categories = ['All', 'Nature', 'Urban', 'Food', 'Shrine', 'Wellness'];

/**
 * Component for displaying Japan planning ideas with Instagram reels
 */
export default function JapanPlanningIdeas() {
  const [ideas, setIdeas] = useState<(PlanningIdea & { reelEmbed: string })[]>([]);
  const [filteredIdeas, setFilteredIdeas] = useState<(PlanningIdea & { reelEmbed: string })[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch planning ideas based on selected category
  useEffect(() => {
    async function fetchIdeas() {
      try {
        setIsLoading(true);
        
        // Build URL with query parameters
        const apiUrl = selectedCategory === 'All' 
          ? '/api/japan-planning' 
          : `/api/japan-planning?category=${encodeURIComponent(selectedCategory)}`;
        
        // Fetch data from API
        const response = await fetch(apiUrl);
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error?.message || 'Failed to fetch planning ideas');
        }
        
        if (result.status === 'success' && Array.isArray(result.data)) {
          setFilteredIdeas(result.data);
          if (selectedCategory === 'All') {
            setIdeas(result.data);
          }
          setError(null);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        setError(`Failed to load planning ideas: ${(err as Error).message}`);
        console.error('Error fetching planning ideas:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchIdeas();
  }, [selectedCategory]);

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div>
      {/* Category filter */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Filter by Category</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Ideas list */}
      {!isLoading && !error && filteredIdeas.length === 0 && (
        <div className="text-center my-12 text-gray-500">
          No planning ideas found. Try selecting a different category.
        </div>
      )}

      <div className="grid gap-6">
        {filteredIdeas.map((idea) => (
          <PlanningIdeaCard key={idea.id} idea={idea} />
        ))}
      </div>

      {/* Add new idea button */}
      <div className="mt-8 flex justify-center">
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium flex items-center shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => {
            // In a real app, this would open a form to add a new idea
            alert('This would open a form to add a new planning idea.');
          }}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Idea
        </button>
      </div>
    </div>
  );
} 