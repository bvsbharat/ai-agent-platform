import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// Unused but kept for reference
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Use anon key for read operations
// const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
// Use service role key for write operations (bypasses RLS)
const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey)

// POST /api/mcps - Sync MCP data from third-party API
export async function POST(_request: NextRequest) {
  try {
    // Use the Cursor Directory Supabase API
    const apiUrl = 'https://knhgkaawjfqqwmsgmxns.supabase.co/rest/v1/mcps?select=*&active=eq.true&order=company_id.asc.nullslast&limit=100'
    const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuaGdrYWF3amZxcXdtc2dteG5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2NDAzMTksImV4cCI6MjA1NTIxNjMxOX0.1Uc-at_fT0Tf1MsNuewJf1VR0yiynPzrPvF0uWvTNnk'

    // Fetch data from Cursor Directory API
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'apikey': authToken,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const mcps = await response.json()
    
    console.log(`Syncing ${mcps.length} MCPs...`)
    
    // Process and sync data to our database
    for (const mcp of mcps) {
      try {
        const mcpData = {
          id: mcp.id || `mcp-${Date.now()}-${Math.random()}`,
          name: mcp.name || 'Unnamed MCP',
          description: mcp.description || '',
          link: mcp.link || '',
          logo: mcp.logo || '',
          company_id: mcp.company_id || '',
          slug: mcp.slug || '',
          active: mcp.active !== false,
          plan: mcp.plan || 'free',
          config: mcp.config || {},
          synced_at: new Date().toISOString(),
          downloads: mcp.downloads || 0
        }

        const { error } = await supabaseAdmin.from('mcps').upsert(mcpData, {
          onConflict: 'id'
        })

        if (error) {
          console.error('Error syncing MCP:', error)
        }
      } catch (mcpError) {
        console.error('Error processing MCP:', mcpError)
      }
    }

    return NextResponse.json({
      success: true,
      synced: mcps.length,
      message: `Successfully synced ${mcps.length} MCPs`
    })

  } catch (error) {
    console.error('Error syncing MCPs:', error)
    return NextResponse.json(
      { error: 'Failed to sync MCPs', details: error },
      { status: 500 }
    )
  }
}

// GET /api/mcps - Fetch MCPs with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const sort = searchParams.get('sort') || 'newest'
    const limit = parseInt(searchParams.get('limit') || '12')
    const page = parseInt(searchParams.get('page') || '1')
    const offset = (page - 1) * limit

    let query = supabase
      .from('mcps')
      .select('*, downloads', { count: 'exact' })

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,vendor.ilike.%${search}%`)
    }
    
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    // Apply sorting
    switch (sort) {
      case 'popular':
        query = query.order('downloads', { ascending: false })
        break
      case 'rating':
        query = query.order('rating', { ascending: false })
        break
      case 'name':
        query = query.order('name', { ascending: true })
        break
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false })
        break
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: mcps, error, count } = await query

    if (error) {
      throw error
    }

    const totalPages = Math.ceil((count || 0) / limit)

    return NextResponse.json({
      mcps,
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
    console.error('Error fetching MCPs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch MCPs' },
      { status: 500 }
    )
  }
}