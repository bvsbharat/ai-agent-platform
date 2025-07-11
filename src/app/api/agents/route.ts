import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

// GET /api/agents - Fetch agents with filtering and sorting
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'newest'
    const limit = parseInt(searchParams.get('limit') || '12')
    const page = parseInt(searchParams.get('page') || '1')
    const offset = (page - 1) * limit

    let query = supabase
      .from('agents')
      .select('*', { count: 'exact' })
      .eq('is_public', true)

    // Apply filters
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Apply sorting
    switch (sort) {
      case 'trending':
        query = query.order('views', { ascending: false })
        break
      case 'popular':
        query = query.order('likes', { ascending: false })
        break
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false })
        break
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: agents, error, count } = await query

    if (error) {
      throw error
    }

    const totalPages = Math.ceil((count || 0) / limit)

    return NextResponse.json({
      agents,
      pagination: {
        page,
        limit,
        total: count,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    )
  }
}

// POST /api/agents - Create a new agent
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      name,
      description,
      category,
      prompt,
      model,
      temperature,
      max_tokens,
      tags,
      is_public = false
    } = body

    // Validation
    if (!name || !description || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('name')
      .eq('id', user.id)
      .single()

    const { data: agent, error } = await supabase
      .from('agents')
      .insert({
        name,
        description,
        category,
        author_id: user.id,
        author_name: profile?.name || user.email || '',
        prompt,
        model: model || 'gpt-4',
        temperature: temperature || 0.7,
        max_tokens: max_tokens || 2000,
        tags: tags || [],
        is_public
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ agent })
  } catch (error) {
    console.error('Error creating agent:', error)
    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 }
    )
  }
}