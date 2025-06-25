import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

// GET /api/search - Search agents by query
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const order = searchParams.get('order') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    // Build Supabase query
    let supabaseQuery = supabase
      .from('agents')
      .select('*', { count: 'exact' })
      .eq('is_public', true)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)

    // Add category filter if specified
    if (category && category !== 'All') {
      supabaseQuery = supabaseQuery.eq('category', category)
    }

    // Add sorting
    if (sortBy === 'popularity') {
      supabaseQuery = supabaseQuery.order('likes', { ascending: order === 'asc' })
    } else if (sortBy === 'views') {
      supabaseQuery = supabaseQuery.order('views', { ascending: order === 'asc' })
    } else {
      supabaseQuery = supabaseQuery.order(sortBy, { ascending: order === 'asc' })
    }

    // Add pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    supabaseQuery = supabaseQuery.range(from, to)

    // Execute query
    const { data: agents, error, count } = await supabaseQuery

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to search agents' },
        { status: 500 }
      )
    }

    // Calculate pagination info
    const totalCount = count || 0
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      agents: agents || [],
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
    })
  } catch (error) {
    console.error('Error searching agents:', error);
    return NextResponse.json(
      { error: 'Failed to search agents' },
      { status: 500 }
    );
  }
}