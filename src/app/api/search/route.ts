import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Agent from '@/models/Agent';
import type { SearchFilter, SortObject } from '@/types/search';

// GET /api/search - Search agents by query
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    // Build search filter
    const searchFilter: SearchFilter = {
      deploymentStatus: 'published',
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ]
    };

    // Add category filter if specified
    if (category && category !== 'All') {
      searchFilter.category = category;
    }

    // Build sort object
    const sortObject: SortObject = {};
    if (sortBy === 'popularity') {
      sortObject['metrics.likes'] = order === 'desc' ? -1 : 1;
    } else if (sortBy === 'views') {
      sortObject['metrics.views'] = order === 'desc' ? -1 : 1;
    } else if (sortBy === 'runs') {
      sortObject['metrics.runs'] = order === 'desc' ? -1 : 1;
    } else {
      sortObject[sortBy] = order === 'desc' ? -1 : 1;
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Execute search query
    const [agents, totalCount] = await Promise.all([
      Agent.find(searchFilter)
        .select('-customLLMConfig') // Exclude sensitive config data
        .sort(sortObject)
        .skip(skip)
        .limit(limit)
        .lean(),
      Agent.countDocuments(searchFilter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      agents,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit
      },
      searchQuery: query,
      category: category || 'All',
      sortBy,
      order
    });
  } catch (error) {
    console.error('Error searching agents:', error);
    return NextResponse.json(
      { error: 'Failed to search agents' },
      { status: 500 }
    );
  }
}