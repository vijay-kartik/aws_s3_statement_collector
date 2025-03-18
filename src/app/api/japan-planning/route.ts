import { NextRequest, NextResponse } from 'next/server';
import { getReelEmbed, MOCK_PLANNING_IDEAS } from '@/services/instagramService';
import { PlanningIdea } from '@/types/japan-planning';

/**
 * GET handler for Japan planning ideas
 * Returns a list of planning ideas with embedded Instagram reels
 */
export async function GET(request: NextRequest) {
  try {
    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    
    // Get all planning ideas
    let ideas = [...MOCK_PLANNING_IDEAS];
    
    // Apply filters if provided
    if (category && category !== 'All') {
      ideas = ideas.filter(idea => 
        idea.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    if (location) {
      ideas = ideas.filter(idea => 
        idea.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
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
    
    // Return successful response
    return NextResponse.json({
      status: 'success',
      data: ideasWithEmbeds
    });
  } catch (error) {
    console.error('Error processing planning ideas request:', error);
    
    // Return error response
    return NextResponse.json(
      {
        status: 'error',
        error: {
          message: 'Failed to fetch planning ideas',
          details: (error as Error).message
        }
      },
      { status: 500 }
    );
  }
}

/**
 * POST handler for adding a new planning idea
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'category', 'location', 'reelUrl'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          status: 'error',
          error: {
            message: 'Missing required fields',
            details: missingFields
          }
        },
        { status: 400 }
      );
    }
    
    // Get embed HTML for the reel
    const embedResponse = await getReelEmbed(body.reelUrl);
    
    // Create new planning idea
    const newIdea: PlanningIdea & { reelEmbed: string } = {
      id: Date.now().toString(),
      title: body.title,
      description: body.description,
      category: body.category,
      location: body.location,
      reelUrl: body.reelUrl,
      tags: body.tags || [],
      createdAt: new Date().toISOString(),
      reelEmbed: embedResponse.html
    };
    
    // In a real application, we would save this to a database
    // For now, we just return the created idea
    
    // Return successful response
    return NextResponse.json(
      {
        status: 'success',
        message: 'Planning idea created successfully',
        data: newIdea
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating planning idea:', error);
    
    // Return error response
    return NextResponse.json(
      {
        status: 'error',
        error: {
          message: 'Failed to create planning idea',
          details: (error as Error).message
        }
      },
      { status: 500 }
    );
  }
} 