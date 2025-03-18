'use client';

import { useEffect, useState } from 'react';
import { PlanningIdea } from '@/types/japan-planning';
import PlanningIdeaCard from '@/components/ui/PlanningIdeaCard';
import { getAllPlanningIdeas, getPlanningIdeasByCategory, addPlanningIdea } from '@/services/japanPlanningService';

const categories = ['All', 'Nature', 'Urban', 'Food', 'Shrine', 'Wellness'];

/**
 * Component for displaying Japan planning ideas with Instagram reels
 */
export default function JapanPlanningIdeas() {
  const [filteredIdeas, setFilteredIdeas] = useState<PlanningIdea[]>([]);
  const [allIdeas, setAllIdeas] = useState<PlanningIdea[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [newIdea, setNewIdea] = useState({
    title: '',
    description: '',
    reelEmbed: '',
    location: '',
    category: 'Nature',
    tags: ''
  });

  // Fetch planning ideas when the component mounts or category changes
  useEffect(() => {
    async function fetchIdeas() {
      try {
        setIsLoading(true);
        
        // Get all ideas first to determine if we have any
        const ideas = await getAllPlanningIdeas();
        setAllIdeas(ideas);
        
        // If there are no ideas, show the form by default
        if (ideas.length === 0 && !showForm) {
          setShowForm(true);
        }
        
        // Get ideas based on selected category
        const filteredIdeas = selectedCategory === 'All' 
          ? ideas
          : await getPlanningIdeasByCategory(selectedCategory);
        
        setFilteredIdeas(filteredIdeas);
        setError(null);
      } catch (err) {
        setError(`Failed to load planning ideas: ${(err as Error).message}`);
        console.error('Error fetching planning ideas:', err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchIdeas();
  }, [selectedCategory, showForm]);

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewIdea(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Process tags
      const tagArray = newIdea.tags 
        ? newIdea.tags.split(',').map(tag => tag.trim().toLowerCase()) 
        : [];
      
      // Create new idea
      const createdIdea = await addPlanningIdea({
        title: newIdea.title,
        description: newIdea.description,
        reelEmbed: newIdea.reelEmbed,
        location: newIdea.location,
        category: newIdea.category,
        tags: tagArray
      });
      
      // Reload all ideas to ensure we have the latest data
      const updatedAllIdeas = await getAllPlanningIdeas();
      setAllIdeas(updatedAllIdeas);
      
      // Update filtered ideas if category matches
      if (selectedCategory === 'All' || selectedCategory === createdIdea.category) {
        if (selectedCategory === 'All') {
          setFilteredIdeas(updatedAllIdeas);
        } else {
          const updatedFilteredIdeas = await getPlanningIdeasByCategory(selectedCategory);
          setFilteredIdeas(updatedFilteredIdeas);
        }
      }
      
      // Reset form
      setNewIdea({
        title: '',
        description: '',
        reelEmbed: '',
        location: '',
        category: 'Nature',
        tags: ''
      });
      
      // Close form if we now have ideas
      if (updatedAllIdeas.length > 0) {
        setShowForm(false);
      }
    } catch (err) {
      setError(`Failed to add idea: ${(err as Error).message}`);
      console.error('Error adding idea:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to determine what to show when no ideas are available
  const renderEmptyState = () => {
    if (showForm) return null;

    return (
      <div className="text-center my-12 p-8 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="text-xl font-semibold text-blue-800 mb-3">Welcome to Japan Planning Ideas!</h3>
        <p className="text-blue-700 mb-6">
          This is where you can collect Instagram reels and information about places to visit in Japan.
          Get started by adding your first planning idea.
        </p>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium flex items-center shadow-lg hover:shadow-xl transition-all duration-300 mx-auto"
          onClick={() => setShowForm(true)}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Your First Idea
        </button>
      </div>
    );
  };

  return (
    <div>
      {allIdeas.length > 0 && (
        /* Category filter - only show if we have ideas */
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
      )}

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

      {/* Empty state when there are no ideas */}
      {!isLoading && !error && allIdeas.length === 0 && renderEmptyState()}

      {/* No matching ideas for category */}
      {!isLoading && !error && allIdeas.length > 0 && filteredIdeas.length === 0 && (
        <div className="text-center my-12 text-gray-500">
          No planning ideas found for category &lsquo;{selectedCategory}&rsquo;. Try selecting a different category or add a new idea.
        </div>
      )}

      {/* Ideas list */}
      <div className="grid gap-6">
        {filteredIdeas.map((idea) => (
          <PlanningIdeaCard key={idea.id} idea={idea} />
        ))}
      </div>

      {/* Add new idea button or form */}
      <div className="mt-8">
        {!showForm ? (
          <div className="flex justify-center">
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium flex items-center shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => setShowForm(true)}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Idea
            </button>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">
              {allIdeas.length === 0 ? "Add Your First Planning Idea" : "Add a New Planning Idea"}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input 
                    type="text"
                    id="title"
                    name="title"
                    value={newIdea.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Exploring Arashiyama Bamboo Grove"
                  />
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input 
                    type="text"
                    id="location"
                    name="location"
                    value={newIdea.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Kyoto, Japan"
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={newIdea.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.filter(cat => cat !== 'All').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma separated)
                  </label>
                  <input 
                    type="text"
                    id="tags"
                    name="tags"
                    value={newIdea.tags}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., hiking, nature, photography"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea 
                  id="description"
                  name="description"
                  value={newIdea.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe what makes this place special..."
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="reelEmbed" className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram Embed HTML *
                </label>
                <textarea 
                  id="reelEmbed"
                  name="reelEmbed"
                  value={newIdea.reelEmbed}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder='Paste the Instagram embed code here (starts with &lt;blockquote class=&quot;instagram-media&quot;...)'
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tip: Go to Instagram post, click &quot;...&quot; → &quot;Embed&quot; → copy the HTML code
                </p>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                      Saving...
                    </>
                  ) : (
                    'Add Idea'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
} 