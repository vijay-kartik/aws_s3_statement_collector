import { PlanningIdea } from '@/types/japan-planning';
import InstagramReel from './InstagramReel';

interface PlanningIdeaCardProps {
  idea: PlanningIdea;
}

/**
 * Card component to display a planning idea with Instagram reel
 */
export default function PlanningIdeaCard({ idea }: PlanningIdeaCardProps) {
  const { title, description, location, category, tags, reelEmbed } = idea;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col md:flex-row">
        {/* Instagram Reel */}
        <div className="md:w-1/3 lg:w-2/5 p-4 flex items-center justify-center">
          <InstagramReel 
            embedHtml={reelEmbed} 
            className="w-full max-w-[320px] mx-auto" 
            maxHeight={350} // Set a fixed height for all embeds
            borderRadius={16} // Rounded corners to match the card's aesthetic
          />
        </div>

        {/* Description */}
        <div className="md:w-2/3 lg:w-3/5 p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {category}
            </span>
          </div>
          
          <div className="text-sm text-gray-600 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location}
          </div>
          
          <p className="text-gray-700 mb-4 line-clamp-4 md:line-clamp-none">{description}</p>
          
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {tags.map(tag => (
                <span 
                  key={tag} 
                  className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="mt-4 flex justify-end">
            <a 
              href="#" 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              onClick={(e) => {
                e.preventDefault();
                // In a real app, this would add the idea to a saved collection
                alert(`Added "${title}" to your saved ideas`);
              }}
            >
              Save for later
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 