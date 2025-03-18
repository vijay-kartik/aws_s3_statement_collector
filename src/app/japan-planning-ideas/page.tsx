import { Metadata } from 'next';
import JapanPlanningIdeas from '@/components/app/JapanPlanningIdeas';

export const metadata: Metadata = {
  title: 'Japan Planning Ideas | Statement Collector',
  description: 'Collection of ideas and places to visit in Japan',
};

export default function JapanPlanningIdeasPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Japan Planning Ideas</h1>
      <p className="text-gray-600 mb-8">
        A collection of Instagram reels and ideas for our trip to Japan. Save your favorite places and experiences here.
      </p>
      <JapanPlanningIdeas />
    </div>
  );
} 