import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import MCP from '@/models/MCP';

const SUPABASE_URL = 'https://knhgkaawjfqqwmsgmxns.supabase.co/rest/v1/mcps';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuaGdrYWF3amZxcXdtc2dteG5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2NDAzMTksImV4cCI6MjA1NTIxNjMxOX0.1Uc-at_fT0Tf1MsNuewJf1VR0yiynPzrPvF0uWvTNnk';
const AUTHORIZATION = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuaGdrYWF3amZxcXdtc2dteG5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2NDAzMTksImV4cCI6MjA1NTIxNjMxOX0.1Uc-at_fT0Tf1MsNuewJf1VR0yiynPzrPvF0uWvTNnk';

// Fetch MCPs from Supabase and sync to MongoDB
export async function POST() {
  try {
    await connectDB();

    let allMCPs = [];
    let offset = 0;
    const limit = 72;
    let hasMore = true;

    // Fetch all MCPs with pagination
    while (hasMore) {
      const url = `${SUPABASE_URL}?select=*&active=eq.true&order=company_id.asc.nullslast&limit=${limit}&offset=${offset}`;
      
      const response = await fetch(url, {
        headers: {
          'apikey': API_KEY,
          'Authorization': AUTHORIZATION,
          'Origin': 'https://cursor.directory',
          'Referer': 'https://cursor.directory/',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch MCPs: ${response.statusText}`);
      }

      const mcps = await response.json();
      
      if (mcps.length === 0) {
        hasMore = false;
      } else {
        allMCPs.push(...mcps);
        offset += limit;
        
        // If we got less than the limit, we've reached the end
        if (mcps.length < limit) {
          hasMore = false;
        }
      }
    }

    // Transform MCPs
    const transformedMCPs = allMCPs.map(mcp => ({
      id: mcp.id,
      name: mcp.name,
      link: mcp.link,
      description: mcp.description,
      logo: mcp.logo || '',
      company_id: mcp.company_id,
      slug: mcp.slug,
      active: mcp.active,
      plan: mcp.plan,
      order: mcp.order,
      fts: mcp.fts,
      config: mcp.config,
      owner_id: mcp.owner_id,
      created_at: new Date(mcp.created_at),
      installCount: Math.floor(Math.random() * 1000), // Random install count for demo
      category: extractCategory(mcp.description),
      tags: extractTags(mcp.fts)
    }));

    // Use upsert to handle duplicates
    const bulkOps = transformedMCPs.map(mcp => ({
      updateOne: {
        filter: { id: mcp.id },
        update: { $set: mcp },
        upsert: true
      }
    }));
    
    await MCP.bulkWrite(bulkOps);

    return NextResponse.json({ 
      success: true, 
      message: `Successfully synced ${allMCPs.length} MCPs`,
      count: allMCPs.length 
    });
  } catch (error) {
    console.error('Error syncing MCPs:', error);
    return NextResponse.json(
      { error: 'Failed to sync MCPs' },
      { status: 500 }
    );
  }
}

// Get MCPs with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || 'newest';

    // Build query
    const query: any = { active: true };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category && category !== 'All') {
      query.category = category;
    }

    // Build sort
    let sortQuery: any = {};
    switch (sort) {
      case 'trending':
        sortQuery = { installCount: -1 };
        break;
      case 'popular':
        sortQuery = { installCount: -1 };
        break;
      case 'newest':
      default:
        sortQuery = { created_at: -1 };
        break;
    }

    const skip = (page - 1) * limit;
    
    const [mcps, total] = await Promise.all([
      MCP.find(query)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .lean(),
      MCP.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      mcps,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching MCPs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch MCPs' },
      { status: 500 }
    );
  }
}

// Helper function to extract category from description
function extractCategory(description: string): string {
  const categories = {
    'test': 'Testing',
    'browser': 'Browser',
    'automation': 'Automation',
    'api': 'API',
    'database': 'Database',
    'ai': 'AI/ML',
    'development': 'Development',
    'security': 'Security',
    'monitoring': 'Monitoring',
    'deployment': 'Deployment'
  };

  const lowerDesc = description.toLowerCase();
  for (const [keyword, category] of Object.entries(categories)) {
    if (lowerDesc.includes(keyword)) {
      return category;
    }
  }
  return 'General';
}

// Helper function to extract tags from fts field
function extractTags(fts: string): string[] {
  if (!fts) return [];
  
  // Extract words from the fts field and clean them
  const words = fts.match(/'([^']+)'/g);
  if (!words) return [];
  
  return words
    .map(word => word.replace(/'/g, ''))
    .filter(word => word.length > 2)
    .slice(0, 5); // Limit to 5 tags
}